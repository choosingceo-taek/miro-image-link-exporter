// RACK 상품 수집기 — 백그라운드 오케스트레이션 (MV3 service worker)
// URL 목록을 하나씩 백그라운드 탭으로 열어 렌더링(=Akamai 통과) → 자동 스크롤·수집 →
// 기존 RACK Worker(KV)로 전송 → 탭 닫고 다음. 진행상황은 state에 쌓아 팝업이 폴링.

// pageCollector() 는 collector.js 에 있다 — 헤드리스 러너(scripts/browser-collect.mjs)와
// 같은 코드를 쓰기 위해 분리했다. (MV3 클래식 서비스워커라 importScripts 사용 가능)
importScripts('collector.js');

const DEFAULT_WORKER = 'https://fabric-extractor.hs-fabric-linker.workers.dev';
const DEFAULT_TOKEN = 'hsfabriclinker';
const DEFAULT_RENDER = 'https://market-research-uzs2.onrender.com';
const ALARM = 'rackDailyScan';
// 카테고리당 상한 150 (앱 표시 상한 100 + 상품명 재분류로 카테고리가 옮겨가는 여유분).
// 브랜드 합계는 Worker 저장 상한(800) 아래로 유지 — 5카테고리 × 150 = 750.
const PER_CATEGORY = 150;
const MAX_PER_BRAND = 750;

let state = { running: false, done: 0, total: 0, current: '', log: [], startedAt: 0, items: 0 };

async function getCfg() {
  const s = await chrome.storage.local.get(['worker', 'token', 'render']);
  return {
    worker: String(s.worker || DEFAULT_WORKER).replace(/\/+$/, ''),
    token: s.token !== undefined ? String(s.token) : DEFAULT_TOKEN,
    render: String(s.render || DEFAULT_RENDER).replace(/\/+$/, ''),
  };
}

// ── 매일 자동 수집(스케줄) ───────────────────────────────────────────
// 대상 = 서버가 못 긁는 브랜드(blocked-brands.json)의 카테고리 URL 전부.
// 목록을 서버에서 받아오므로 브랜드가 바뀌어도 확장을 다시 배포할 필요가 없음.
async function getSched() {
  const s = await chrome.storage.local.get(['schedOn', 'schedHour', 'schedMin', 'visible', 'maxPages', 'lastRun', 'idleOnly']);
  return {
    schedOn: !!s.schedOn,
    idleOnly: s.idleOnly !== false,   // 기본 true — 자리를 비웠을 때만 수집
    // 기본 23:00 — 마감 06:00 까지 일곱 시간을 확보한다. 자리를 비워야 시작하므로
    // 일찍 잡아도 방해되지 않는다(퇴근·취침하는 순간 시작한다).
    schedHour: Number.isInteger(s.schedHour) ? s.schedHour : 23,
    schedMin: Number.isInteger(s.schedMin) ? s.schedMin : 0,      // 분 단위까지 지정 가능
    visible: s.visible !== false,   // 기본 true — 숨은 탭은 크롬이 타이머를 늦춰 수집률이 떨어짐
    maxPages: Number.isInteger(s.maxPages) ? s.maxPages : 20,     // 카테고리당 최대 페이지 수
    lastRun: s.lastRun || null,
  };
}

function nextRunAt(hour, min) {
  const now = new Date();
  const at = new Date(now);
  at.setHours(hour, min || 0, 0, 0);
  if (at <= now) at.setDate(at.getDate() + 1);
  return at.getTime();
}

async function applySchedule() {
  const { schedOn, schedHour, schedMin } = await getSched();
  await chrome.alarms.clear(ALARM);
  if (schedOn) {
    chrome.alarms.create(ALARM, { when: nextRunAt(schedHour, schedMin), periodInMinutes: 1440 });
  }
}

// 저장 키: <호스트>.<브랜드슬러그> — 야간 프리페치(scripts/prefetch-catalogs.mjs)와 동일해야 한다.
// 호스트만 쓰면 한 도메인에 여러 브랜드가 있을 때 서로 덮어쓴다
// (freepeople.com = Free People + FP Movement, ae.com = American Eagle + Aerie).
function siteKeyOf(name, url) {
  let host = 'brand';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) {}
  const slug = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return (host + '.' + slug).slice(0, 80);
}

// 서버에서 차단 브랜드 목록 + 브랜드 정보 + 카테고리 링크를 받아
// "브랜드 단위" 수집 대상을 만든다. (URL 단위로 저장하면 브랜드가 뒤섞인다)
// Render 무료 인스턴스는 잠들어 있으면 첫 요청이 느리거나 502를 낸다 → 재시도.
async function getJson(url, tries) {
  let last;
  for (let i = 0; i < (tries || 3); i++) {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (r.ok) return await r.json();
      last = new Error('HTTP ' + r.status);
    } catch (e) { last = e; }
    await sleep(5000);
  }
  throw last || new Error('fetch failed');
}

async function buildTargets() {
  const cfg = await getCfg();
  const [blocked, links, brands] = await Promise.all([
    getJson(cfg.render + '/blocked-brands.json'),
    getJson(cfg.render + '/category-links.json'),
    getJson(cfg.render + '/brands.json').catch(() => []),
  ]);
  const names = (blocked && blocked.brands) || [];
  const byName = new Map(
    (Array.isArray(brands) ? brands : []).map((b) => [String(b.name).toLowerCase(), b]),
  );
  const groups = [];
  for (const name of names) {
    const c = links[name] || {};
    const urls = [];
    for (const key of ['tops', 'sweatshirts', 'shirts', 'dresses', 'pants']) {
      for (const u of c[key] || []) if (/^https?:\/\//i.test(u) && !urls.includes(u)) urls.push(u);
    }
    if (!urls.length) continue;
    const b = byName.get(name.toLowerCase());
    groups.push({ brand: name, site: siteKeyOf(name, (b && b.url) || urls[0]), urls });
  }

  // 오래 안 본 브랜드부터. 하룻밤에 전부 못 돌 수도 있는데, 그때 목록 순서대로
  // 하면 뒤쪽 브랜드가 계속 밀린다 — 앞쪽만 매일 새로 긁고 뒤쪽은 몇 주씩 낡는다.
  // 저장본의 갱신 시각을 받아 가장 낡은 것부터 돌면, 며칠에 걸쳐서라도 모든
  // 브랜드가 고르게 갱신된다("2~3일 안에 한 바퀴"가 이렇게 지켜진다).
  // 목록을 못 받으면 원래 순서를 쓴다 — 순서가 최적이 아닐 뿐 수집은 된다.
  try {
    const ls = await getJson(
      cfg.worker + '/?catalogs=1' + (cfg.token ? '&token=' + encodeURIComponent(cfg.token) : ''), 2);
    const updated = new Map();
    for (const c of (ls && ls.list) || []) updated.set(String(c.site || ''), c.updated || 0);
    // 저장본이 없는 브랜드(한 번도 수집 안 됨)는 0 이라 가장 먼저 온다.
    groups.sort((x, y) => (updated.get(x.site) || 0) - (updated.get(y.site) || 0));
  } catch (e) {}
  return groups;
}

// MV3 서비스워커는 놀고 있으면 30초 만에 종료된다. 수집은 30분 넘게 걸리므로
// 도중에 워커가 내려가면 그날 수집이 조용히 중단된다. 실행 중에는 짧은 주기 알람을
// 걸어 워커를 깨어 있게 한다(알람 이벤트가 유휴 타이머를 리셋).
const KEEPALIVE = 'rackKeepAlive';
function keepAlive(on) {
  try {
    if (on) chrome.alarms.create(KEEPALIVE, { periodInMinutes: 0.4 });
    else chrome.alarms.clear(KEEPALIVE);
  } catch (e) {}
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === KEEPALIVE) return;   // 깨우는 것 자체가 목적 — 할 일 없음
  if (alarm.name !== ALARM) return;
  try {
    const groups = await buildTargets();
    if (groups.length) await collect(groups);
  } catch (e) {
    await chrome.storage.local.set({
      lastRun: { when: Date.now(), ok: 0, fail: 0, total: 0, error: String((e && e.message) || e) },
    });
  }
});

// 따라잡기: 예약 시각에 크롬이 꺼져 있었어도, 크롬을 켜면 "오늘 아직 안 돌았고
// 예약 시각이 지났으면" 즉시 1회 수집. (출근 후 크롬만 켜면 자동 실행되는 핵심)
async function maybeCatchUp() {
  const { schedOn, schedHour, schedMin, lastRun } = await getSched();
  if (!schedOn || state.running) return;
  const now = new Date();
  const todayAt = new Date(now);
  todayAt.setHours(schedHour, schedMin || 0, 0, 0);
  const ranToday = lastRun && lastRun.when &&
    new Date(lastRun.when).toDateString() === now.toDateString();
  if (now >= todayAt && !ranToday) {
    try {
      const urls = await buildTargets();
      if (urls.length) collect(urls);
    } catch (e) {}
  }
}

chrome.runtime.onInstalled.addListener(applySchedule);
chrome.runtime.onStartup.addListener(() => { applySchedule(); maybeCatchUp(); });
// 워커가 수집 도중 종료됐다면 깨우기 알람만 남는다 — 새로 뜰 때 정리한다.
if (!state.running) keepAlive(false);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 아침 마감 ──────────────────────────────────────────────────────
// 수집은 사람이 자리를 비운 사이에 끝나 있어야 한다. 출근해서 쓰기 시작할 때
// 수집 창이 남아 있으면 안 되고, 브라우저를 닫아 강제로 끊기면 그 브랜드는
// 반쪽만 저장된다. 그래서 마감 시각을 넘기면 스스로, 깨끗이 멈춘다.
// (브랜드 하나를 다 끝낸 지점에서 멈추므로 저장이 잘리지 않는다)
const DEADLINE_HOUR = 6, DEADLINE_MIN = 0;
function deadlineFrom(now) {
  const at = new Date(now);
  at.setHours(DEADLINE_HOUR, DEADLINE_MIN, 0, 0);
  if (at.getTime() <= now) at.setDate(at.getDate() + 1);
  return at.getTime();
}
const hhmm = (t) => {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const dur = (ms) => {
  const m = Math.round(ms / 60000);
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분`;
};

// ── 자리를 비웠을 때만 수집 ─────────────────────────────────────────
// 수집은 실제 크롬 창을 몇 시간 동안 돌린다. 사용자가 일하는 중에 겹치면 화면도
// 네트워크도 나눠 쓰게 되고, 무엇보다 쇼핑몰이 그 사람 IP 를 막으면 정작 본인이
// 그 사이트를 못 쓴다. 그래서 자리를 비운 동안에만 돌리고, 돌아오면 하던 지점에서
// 멈췄다가 다시 비우면 이어서 한다 — 그만두는 게 아니라 미루는 것이다.
const IDLE_SECONDS = 300;   // 5분 — 크롬이 허용하는 최소값은 15초
try { chrome.idle.setDetectionInterval(IDLE_SECONDS); } catch (e) {}

function queryIdle() {
  return new Promise((resolve) => {
    try { chrome.idle.queryState(IDLE_SECONDS, resolve); }
    catch (e) { resolve('idle'); }   // 권한이 없으면 수집을 막지 않는다
  });
}

// 자리에 있으면 비울 때까지 기다린다. label 은 팝업에 이유를 보여주기 위한 것.
async function waitAway(label, manual) {
  if (manual) return;   // 직접 누른 실행은 기다리지 않는다
  const { idleOnly } = await getSched();
  if (!idleOnly) return;
  let waited = 0;
  while (state.running) {
    if ((await queryIdle()) !== 'active') {
      if (waited) state.current = (label ? label + ' · ' : '') + '자리 비움 확인 — 수집 시작';
      return;
    }
    // "자리 있음" 은 '자리가 비어 있다'로도 읽힌다 — 실제로 그렇게 읽혔다.
    // 지금 상태와 무엇을 하면 시작되는지를 그대로 적는다.
    state.current = (label ? label + ' · ' : '') +
      'PC 사용 중이라 대기' + (waited >= 60 ? ` (${Math.round(waited / 60)}분째)` : '') +
      ' — 5분간 안 만지면 시작';
    await sleep(15000);
    waited += 15;
  }
}

function waitForComplete(tabId, timeout) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (done) return; done = true; chrome.tabs.onUpdated.removeListener(onUpd); resolve(); };
    const onUpd = (id, info) => { if (id === tabId && info.status === 'complete') finish(); };
    chrome.tabs.onUpdated.addListener(onUpd);
    // 이미 완료됐을 수도 있으니 한 번 확인
    chrome.tabs.get(tabId, (t) => { if (!chrome.runtime.lastError && t && t.status === 'complete') finish(); });
    setTimeout(finish, timeout || 40000);
  });
}

function pushLog(entry) { state.log.unshift(entry); if (state.log.length > 200) state.log.pop(); }

// 입력은 buildTargets()가 만든 브랜드 그룹 [{brand, site, urls}].
// (예전처럼 URL 배열이 들어와도 동작하도록 호스트 기준 그룹으로 감싼다.)
function asGroups(input) {
  const arr = Array.isArray(input) ? input : [];
  if (arr.length && typeof arr[0] === 'object' && arr[0].urls) return arr;
  const byHost = new Map();
  for (const u of arr) {
    let host = 'brand';
    try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (e) { continue; }
    if (!byHost.has(host)) {
      // 저장 키는 반드시 <host>.<브랜드슬러그> 로 만든다. 예전엔 여기서 host 만 썼는데,
      // 그러면 정상 경로가 만든 <host>.<slug> 와 별개의 카탈로그가 하나 더 생겨
      // 같은 브랜드가 두 벌 저장되고 미로 앱이 둘 중 아무거나 집게 된다.
      const brand = host.split('.')[0];
      byHost.set(host, { brand, site: siteKeyOf(brand, u), urls: [] });
    }
    byHost.get(host).urls.push(u);
  }
  return [...byHost.values()];
}

// ── 혼용률 추출 — worker/fabric-extractor.js 의 compFromText 와 같은 규칙.
// 확장은 단일 파일로 자립해야 해서 복사본을 두되, scripts/test-composition.mjs 가
// 두 파일의 FIBRES·정규식이 어긋나면 CI에서 실패시킨다.
const FIBRES = {
  cotton: 'Cotton', 'organic cotton': 'Cotton', polyester: 'Polyester',
  'recycled polyester': 'Polyester', elastane: 'Elastane', spandex: 'Elastane',
  lycra: 'Elastane', modal: 'Modal', nylon: 'Nylon', polyamide: 'Nylon',
  viscose: 'Viscose', rayon: 'Viscose', wool: 'Wool', 'merino wool': 'Wool', merino: 'Wool',
  silk: 'Silk', linen: 'Linen', flax: 'Linen', cashmere: 'Cashmere', acrylic: 'Acrylic',
  lyocell: 'Lyocell', tencel: 'Lyocell', hemp: 'Hemp', ramie: 'Ramie', jute: 'Jute',
  alpaca: 'Alpaca', mohair: 'Mohair', angora: 'Angora', bamboo: 'Bamboo', cupro: 'Cupro',
  acetate: 'Acetate', triacetate: 'Triacetate', polyurethane: 'Polyurethane', leather: 'Leather',
  // 목화 품종명이 섬유 이름 자리에 그대로 오는 경우 — Evereve 는 "48% Pima" 로만 적는다.
  pima: 'Cotton', supima: 'Cotton',
  // 상표명이 섬유 이름을 대신하는 경우.
  ecovero: 'Viscose', micromodal: 'Modal', 'micro modal': 'Modal', 'sea cell': 'Lyocell',
  // 금속사 — Oasis 는 "Main: 60% Nylon, 40% Metal", "8% Metallic" 로 적는다. 모르면 겉감 줄이 조각이 되어 안감 줄이 대신 뽑혔다.
  metallic: 'Metallic', 'metallic fibre': 'Metallic', 'metallic fiber': 'Metallic', metal: 'Metallic', lurex: 'Metallic',
  폴리에스테르: 'Polyester', 나일론: 'Nylon', 스판덱스: 'Elastane', 레이온: 'Viscose',
  모달: 'Modal', 리넨: 'Linen', 실크: 'Silk', 캐시미어: 'Cashmere', 아크릴: 'Acrylic',
  비스코스: 'Viscose', 텐셀: 'Lyocell', 라이오셀: 'Lyocell',
};
const FIBRE_ALT = Object.keys(FIBRES)
  .sort((a, z) => z.length - a.length)
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
// 퍼센트와 섬유 이름 사이에 수식어가 끼는 표기가 흔하다:
//   "100% Peruvian pima cotton"  "90% LENZING™ ECOVERO™ Viscose"  "29% Organically Grown Cotton"
// 반대 방향도 마찬가지다 — "Silk (mulberry) 5%" 처럼 괄호나 낱말이 끼면 놓친다.
// 이걸 놓치면 더 나쁘다: "Cotton 95%, Silk (mulberry) 5%" 에서 실크만 빠져
// "Cotton 95%" 가 되는데, 95% 는 유효 범위라 틀린 값이 그대로 저장된다.
//
// 그룹 번호로 읽으면 규칙을 손볼 때마다 어긋난다(실제로 한 번 어긋났다) — 이름을 붙인다.
const MOD_FWD = "(?<modf>(?:[A-Za-z\u2122\u00ae'\u2019-]{2,20}\\s+){0,4}?)";
const MOD_REV = "(?<modr>(?:\\s*\\([^)]{1,24}\\))?(?:\\s+[A-Za-z\u2122\u00ae'\u2019-]{2,20}){0,2})";
const COMP_RX = new RegExp(
  '(?<pctf>\\d{1,3})\\s*%\\s*(?:of\\s+)?' + MOD_FWD + '(?<fibf>' + FIBRE_ALT + ')(?![A-Za-z])' +
  '|(?<![A-Za-z])(?<fibr>' + FIBRE_ALT + ')' + MOD_REV + '\\s*[::]?\\s*(?<pctr>\\d{1,3})\\s*%', 'gi');
// 수식어 자리에 이런 말이 오면 소재 설명이 아니라 판촉·안내 문구다.
const MOD_BAD_RX = /\b(off|sale|extra|save|discount|up|only|from|code|order|shipping|free|new|all|shop|more|less|min|max|use)\b/i;

// 모든 "퍼센트+섬유" 자리를 앞에서부터 찾는다. 두 가지는 소재가 아니다:
//  · 섬유 이름이 앞에 오고 사이에 낱말이 끼었는데, 그 퍼센트 바로 뒤에 다른 섬유가 오는 경우 — 그 퍼센트는 뒤 섬유의 것이다.
//    2026-11-25 The Great: 창 이름 "Fit Guide dialog Modal spinner Details 100% Cotton" 이 "Modal 100%" 로 읽혔다.
//  · "100% Cotton Shop"·"… Collection" 처럼 기획전·메뉴 이름 — 2026-11-25 Z Supply 는 모든 페이지 메뉴에 이것이 있어
//    진짜 소재("Waffle Thermal: 60% Cotton, 40% Polyester")와 섞여 판단을 못 하거나, 메뉴 값이 그대로 저장됐다.
const PCT_THEN_FIBRE_RX = new RegExp('^\\d{1,3}\\s*%\\s*(?:of\\s+)?(?:[A-Za-z™®\'’-]{2,20}\\s+){0,4}?(?:' + FIBRE_ALT + ')(?![A-Za-z])', 'i');
const NAV_AFTER_RX = /^\s+(?:shop|collection|edit|essentials|capsule|store)\b/i;
function compMatchAll(src) {
  const rx = new RegExp(COMP_RX.source, 'gi');
  const out = [];
  let m;
  while ((m = rx.exec(src))) {
    const g = m.groups;
    if (g.fibr && /[A-Za-z]/.test(String(g.modr || '').replace(/\([^)]*\)/g, ''))) {
      const pctAt = m.index + m[0].search(/\d{1,3}\s*%\s*$/);
      if (PCT_THEN_FIBRE_RX.test(src.slice(pctAt, pctAt + 120))) { rx.lastIndex = pctAt; continue; }
    }
    if (NAV_AFTER_RX.test(src.slice(m.index + m[0].length, m.index + m[0].length + 20))) continue;
    out.push(m);
  }
  return out;
}
// 두 줄(두 원단)로 볼 수 있는 거리·부위 이름 — worker 의 PART_GAP 주석 참고(같은 규칙).
const PART_GAP = 300;
const PART_LABEL_RX = /(?<![A-Za-z])(?:outer|shell|lining|lined|main|body|contrast|trim|inner|filling|fill|padding|wadding|insert|pocket|sleeve|collar|cuff|rib|lace|embroidery|겉감|안감|배색|충전재)(?![A-Za-z])[^%]{0,24}$/i;
// 낱말 없이 "100% 섬유" 만 셋 이상 줄줄이 붙은 자리는 한 옷의 소재가 아니라 배지·메뉴·필터 목록이다.
// 2026-11-24 Splendid: 머리 영역에 심긴 개인화 배지 틀 "100% Cotton 100% Cotton 100% Cashmere 100% Cashmere" 가
// 진짜 소재("68% Viscose - From Bamboo, 29% Polyester, 3% Elastane")보다 먼저 잡혀 "Cotton 100% / Cashmere 100%"
// 두 줄로 저장됐다(저장값 344개 중 233개). 한 옷의 두 원단은 부위 이름("Lining:")이 사이에 붙거나 둘뿐이다 —
// 셋 이상이 맨몸으로(구분 기호만 두고) 이어지거나, 같은 섬유가 맨몸으로 바로 되풀이되면("100% Cashmere 100% Cashmere"
// — 배지 하나만 그려진 Splendid 페이지가 원피스·레깅스를 Cashmere 100% 로 남긴 모양, 33개) 목록으로 보고 소재 후보에서
// 뺀다. 서로 다른 둘("100% Silk 100% Polyester")은 겉감·안감일 수 있어 그대로 둔다.
const BARE_GAP_RX = /^[\s|\/,\u00b7\u2022;+&-]{0,6}$/;
function bareRunAt(src) {
  const ms = [];
  for (const m of compMatchAll(String(src || ''))) {
    const g = m.groups;
    const fib = FIBRES[String(g.fibf || g.fibr || '').toLowerCase().trim()];
    if (fib) ms.push({ at: m.index, end: m.index + m[0].length, pct: Number(g.pctf || g.pctr), fib });
  }
  const out = new Set();
  for (let i = 0; i < ms.length;) {
    let j = i;
    if (ms[i].pct === 100) {
      while (j + 1 < ms.length && ms[j + 1].pct === 100 && BARE_GAP_RX.test(src.slice(ms[j].end, ms[j + 1].at))) j++;
    }
    const dup = j > i && ms.slice(i + 1, j + 1).some((x, k) => x.fib === ms[i + k].fib);
    if (j - i + 1 >= 3 || dup) for (let k = i; k <= j; k++) out.add(ms[k].at);
    i = j + 1;
  }
  return out;
}
// 부위 이름 — 겉감(main)이 보이면 장식(trim·rib·주머니 안감 …) 줄은 혼용률이 아니다. 2026-11-25 Boden:
// "Main: 50% recycled polyester, 30% polyester, 20% elastane · Trims: 100% polyester" 에서 겉감이 같은 섬유 두 번
// (재생 폴리 + 폴리)이라 조각으로 끊기고, 온전한 한 벌인 장식 줄 "Polyester 100%" 만 남아 저장됐다.
const PART_MINOR_RX = /(?<![A-Za-z])(?:trims?|trimming|rib(?:bing|bed)?|pocket(?:\s+lining)?|pocketing|contrast|combo|embroidery|lace|cuffs?|collar|binding|piping|insert|applique|appliqué|패치|배색)(?![A-Za-z])[^%]{0,24}$/i;
const PART_LINING_RX = /(?<![A-Za-z])(?:lining|lined|안감)(?![A-Za-z])[^%]{0,24}$/i;
const PART_MAIN_RX = /(?<![A-Za-z])(?:main|shell|outer|body|self|base\s+fabric|겉감)(?![A-Za-z])[^%]{0,24}$/i;
function partRole(src, at, end) {
  // 값 뒤 괄호에 부위가 붙는 표기가 먼저다 — Tuckernuck "100% Cotton (outer), 100% Viscose (embroidery), 100% Polyester (lace)"
  // (앞쪽 40자에는 앞 줄의 "(outer)," 가 들어 있어 앞에서 찾으면 틀린다)
  const after = end != null ? (src.slice(end, end + 30).match(/^\s*\(([^)]{2,24})\)/) || [])[1] : '';
  if (after) {
    if (PART_MINOR_RX.test(after)) return 'minor';
    if (PART_LINING_RX.test(after)) return 'lining';
    if (PART_MAIN_RX.test(after)) return 'main';
  }
  const before = src.slice(Math.max(0, at - 40), at);
  if (PART_MINOR_RX.test(before)) return 'minor';
  if (PART_LINING_RX.test(before)) return 'lining';
  if (PART_MAIN_RX.test(before)) return 'main';
  return '';
}
// 소재 제목("Materials & Care" · "Composition:" · "Fabric content") 바로 뒤에 온 줄 — 여러 조성이 섞인 창에서 이 상품의 것.
const COMP_TITLE_RX = /(?:composition|materials?(?:\s*(?:&|and)\s*care)?|fabric(?:\s+content)?|content|소재|혼용률?)\s*[:：]?\s*$/i;
// 같은 섬유가 쉼표·빗금만 사이에 두고 곧바로 다시 나오면(재생 폴리 + 폴리) 한 벌 안의 같은 섬유다 — 더한다.
const SAME_FIBRE_GAP_RX = /^[\s,;\/&+]*(?:and\s+)?$/i;
function compFromText(text) {
  // 한 옷에 원단이 두 가지인 경우가 있다 — 겉감/안감, 몸판/배색, 색상별 사양.
  // 한 줄로 더하면 200% 나 110% 가 되어 없는 조성이 되고, 하나만 남기면 나머지
  // 원단을 잃는다. 한 벌이 100% 에 차면 줄을 바꿔 이어 담는다(worker 와 같은 규칙).
  const src = String(text || '').slice(0, 16000);
  const bare = bareRunAt(src);   // 배지·메뉴 목록(위 bareRunAt 주석)은 건너뛴다
  const groups = [];
  let cur = [], total = 0, seen = new Set(), gStart = 0, gEnd = 0;
  let ovf = false;   // 한 목록이 쉼표·빗금으로 이어지다 100% 를 넘었다(Bellerose '66 / 22 / 2 / 10 / 10' = 110%) — 페이지 표기가 틀렸다
  const flush = () => { if (cur.length) groups.push({ items: cur, start: gStart, end: gEnd, ovf }); cur = []; total = 0; seen = new Set(); ovf = false; };
  for (const m of compMatchAll(src)) {
    if (bare.has(m.index)) continue;
    const g = m.groups;
    const pct = Number(g.pctf || g.pctr);
    const mods = String(g.modf || g.modr || '');
    const key = String(g.fibf || g.fibr || '').toLowerCase().trim();
    const material = FIBRES[key];
    if (!material || !Number.isFinite(pct) || pct <= 0 || pct > 100) continue;
    // "20% off cotton tees" 같은 판촉 문구를 소재로 읽지 않는다.
    if (mods && MOD_BAD_RX.test(mods)) continue;
    // 같은 섬유가 곧바로 다시 나오면(재생 폴리 + 폴리) 더한다(worker 와 같은 규칙).
    if (cur.length && seen.has(material) && total + pct <= 105 && SAME_FIBRE_GAP_RX.test(src.slice(gEnd, m.index))) {
      const k = cur.findIndex((c) => c.startsWith(material + ' '));
      cur[k] = material + ' ' + (Number(cur[k].match(/(\d+)%/)[1]) + pct) + '%';
      total += pct; gEnd = m.index + m[0].length;
      continue;
    }
    if (cur.length && !seen.has(material) && pct < 100 && total + pct > 105 && /^\s*[,\/;+&]\s*$/.test(src.slice(gEnd, m.index))) { ovf = true; flush(); groups[groups.length - 1].ovfNext = true; }
    if (cur.length && (seen.has(material) || total + pct > 105)) flush();
    if (!cur.length) gStart = m.index;
    cur.push(material + ' ' + pct + '%');
    gEnd = m.index + m[0].length;
    total += pct;
    seen.add(material);
    if (cur.length >= 8) flush();
    if (groups.length >= 4) break;
  }
  flush();
  if (!groups.length) return '';
  const sum = (g) => g.items.reduce((n, c) => n + Number(c.match(/(\d+)%/)[1]), 0);
  // 겉감(main) 줄이 있으면 장식(minor) 줄은 뺀다. 겉감이 온전하지 않으면 빈 값(worker 와 같은 규칙).
  // 사이트 공통 '원단 안내'(FABRIC GUIDE · glossary) 안의 조성은 이 상품의 것이 아니다(Goldie).
  for (let i = groups.length - 1; i >= 0; i--) if (/(?:fabric|material)s?\s+guide|glossary/i.test(src.slice(Math.max(0, groups[i].start - 120), groups[i].start))) groups.splice(i, 1);
  for (const g of groups) g.role = partRole(src, g.start, g.end);
  if (groups.some((g) => g.role === 'main')) {
    if (!groups.some((g) => g.role === 'main' && sum(g) >= 95 && sum(g) <= 105)) return '';
    // 부위 이름이 없는 줄도 뺀다 — 설명 글의 "100% Wool 100% Cotton" 처럼 겉감·장식을 이름 없이 늘어놓은 줄이
    // 'Body: 100% wool · Trim: 100% cotton' 보다 앞에 오면 장식이 둘째 줄로 붙었다(Rag & bone Lucy henley).
    for (let i = groups.length - 1; i >= 0; i--) if (groups[i].role !== 'main' && groups[i].role !== 'lining') groups.splice(i, 1);
  }
  // 100% 를 넘긴 목록과 그 꼬리 조각은 버린다(worker 와 같은 규칙).
  const titledAt = (g) => COMP_TITLE_RX.test(src.slice(Math.max(0, g.start - 30), g.start));
  const ovfTitled = groups.some((g, i) => (g.ovf || (i > 0 && groups[i - 1].ovf)) && titledAt(g));
  for (let i = groups.length - 1; i >= 0; i--) if (groups[i].ovf || (i > 0 && groups[i - 1].ovf)) groups.splice(i, 1);
  // 소재 제목 바로 뒤의 목록이 틀린 표기라 버렸으면, 뒤에 남은 다른 조성(추천 카드 등)으로 대신하지 않는다.
  if (ovfTitled) return '';
  const whole = groups.filter((g) => sum(g) >= 95 && sum(g) <= 105);
  const uniq = [];
  const seenLine = new Set();
  for (const g of whole) {
    const k = g.items.join(' / ');
    if (seenLine.has(k)) continue;
    seenLine.add(k);
    uniq.push(g);
  }
  // 셋 이상이면 섞인 것 — 단 첫 줄만 소재 제목 바로 뒤면 그 줄(worker 와 같은 규칙).
  const titled = (g) => COMP_TITLE_RX.test(src.slice(Math.max(0, g.start - 30), g.start));
  if (uniq.length >= 2 && titled(uniq[0]) && !uniq.slice(1).some(titled) && uniq[1].start - uniq[0].end > PART_GAP) uniq.splice(1);
  if (!uniq.length || uniq.length > 2) return '';
  // 두 줄이면 가깝거나 둘 다 부위 이름이 붙어 있어야 한 옷의 두 원단이다.
  if (uniq.length === 2) {
    const near = uniq[1].start - uniq[0].end <= PART_GAP;
    const labelled = (g) => PART_LABEL_RX.test(src.slice(Math.max(0, g.start - 40), g.start));
    if (!near && !(labelled(uniq[0]) && labelled(uniq[1]))) return '';
  }
  return uniq.map((g) => g.items.join(' / ')).join('\n');
}


// ── 페이지 HTML 전체에서 혼용률 — worker 의 compFromHtml 과 같은 규칙.
// ① compFromText 는 앞 16000자만 본다. 메뉴·배너가 길면 소재가 그 뒤로 밀려
//    페이지에 적혀 있는데도 못 읽는다 → 퍼센트+섬유 주변만 잘라서 넘긴다.
// ② 소재 설명이 페이지 JSON 안에만 있는 사이트가 많다. 본문에서 못 찾았을 때만
//    스크립트를 보고, 여러 상품이 섞였을 수 있어 합이 105%를 넘으면 버린다.
// 창은 "소재 제목(Composition·Materials·Fabric…)이 바로 앞에 붙은 자리"를 먼저 찾고, 없으면 첫 자리에서
// 연다. 첫 자리가 메뉴·배너의 조각("100% WOOL | CASHMERE")이고 진짜 소재가 4000자 밖에 있으면
// 조각 하나만 창에 들어와 그대로 틀린 값이 된다(2026-11-24 Zara 에서 본 모양).
function compWindow(s) {
  const COMP_HEAD_RX = /(?:composition|materials?|fabric(?:ation)?|content|outer shell|lining|소재|혼용률?)\s*[:：&a-z ]{0,20}$/i;
  const bare = bareRunAt(s);   // 배지·메뉴 목록에서는 창을 열지 않는다(Splendid)
  let first = null, headed = null;
  for (const m of compMatchAll(s)) {
    if (bare.has(m.index)) continue;
    if (!first) first = m;
    // 사이트 공통 '원단 안내'(FABRIC GUIDE · glossary) 칸의 제목은 이 상품의 소재 제목이 아니다 — 2026-11-25 Goldie:
    // 'FABRIC GUIDE … FABRICATION 100% Peruvian pima' 가 상품 글머리표의 '50% cotton, 50% polyester' 를 이겼다.
    if (COMP_HEAD_RX.test(s.slice(Math.max(0, m.index - 40), m.index)) && !/(?:fabric|material)s?\s+guide|glossary/i.test(s.slice(Math.max(0, m.index - 90), m.index))) { headed = m; break; }
  }
  const pick = headed || first;
  if (!pick) return '';
  const at = Math.max(0, pick.index - 200);
  return s.slice(at, at + 4000);
}
function compFromHtml(html) {
  const h = String(html || '');
  if (!h) return '';
  // 메뉴(<nav>)·<template> 은 상품 본문이 아니다(worker 와 같은 규칙 — Zara 숨은 메뉴의 "100% WOOL").
  const visible = h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<template\b[\s\S]*?<\/template>/gi, ' ')
    // 추천 상품 칸이 따로 만든 태그일 때(<product-recommendations>) — 다른 상품의 소재가 든다.
    .replace(/<([a-z]+-[a-z-]*recommend[a-z-]*)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ');
  const shown = compFromText(compWindow(visible) || visible);
  if (shown) return shown;

  let scripts = '';
  for (const m of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    scripts += ' ' + m[1];
    if (scripts.length > 800000) break;
  }
  if (!scripts) return '';
  const unesc = scripts
    .replace(/\\u003c/gi, '<').replace(/\\u003e/gi, '>').replace(/\\u0026/gi, '&')
    .replace(/\\"/g, '"').replace(/\\\//g, '/').replace(/\\[nrt]/g, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const win = compWindow(unesc);
  if (!win) return '';
  const out = compFromText(win);
  if (!out) return '';
  // 스크립트 경로는 여러 상품이 섞이기 쉽다. 줄이 나뉘어 있으면(원단 두 가지)
  // 그건 한 상품의 표기가 아니라 다른 상품이 섞인 것으로 본다 — 본문과 달리
  // 여기서는 어느 상품의 것인지 확인할 방법이 없다.
  if (out.includes('\n')) return '';
  const total = out.split(' / ').reduce((n, c) => n + Number((c.match(/(\d+)%/) || [0, 0])[1]), 0);
  return total > 105 ? '' : out;
}

// 상품 페이지 HTML 의 schema.org Product 에서 컬러·사이즈·가격을 뽑는다.
// worker 의 fromJsonLd 축약판 — 확장은 자립형이라 복사가 불가피하다.
function jsonLdBits(html) {
  const out = { color: '', sizes: '', price: '', priceOrig: '' };
  const rx = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const flat = [];
  const walk = (n, d) => {
    if (!n || d > 4) return;
    if (Array.isArray(n)) { n.forEach((x) => walk(x, d + 1)); return; }
    if (typeof n !== 'object') return;
    flat.push(n);
    if (n['@graph']) walk(n['@graph'], d + 1);
  };
  while ((m = rx.exec(html)) && flat.length < 200) {
    try { walk(JSON.parse(m[1].trim()), 0); } catch (e) {}
  }
  const isProd = (n) => {
    const v = n && n['@type'];
    return Array.isArray(v) ? v.some((x) => String(x).toLowerCase() === 'product')
                            : String(v || '').toLowerCase() === 'product';
  };
  const prod = flat.find(isProd);
  if (!prod) return out;
  if (prod.color) out.color = String(prod.color).trim().slice(0, 80);
  const offers = [];
  const push = (o) => {
    if (!o) return;
    if (Array.isArray(o)) { o.forEach(push); return; }
    if (typeof o !== 'object') return;
    offers.push(o);
    if (o.offers) push(o.offers);
  };
  push(prod.offers);
  const amt = (o) => {
    const raw = o.price != null ? o.price : o.lowPrice;
    const n = Number(String(raw == null ? '' : raw).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : NaN;
  };
  const SYM = { USD: '$', EUR: '\u20ac', GBP: '\u00a3', KRW: '\u20a9', JPY: '\u00a5' };
  const vals = offers.map(amt).filter(Number.isFinite);
  if (vals.length) {
    const cur = String((offers.find((o) => Number.isFinite(amt(o))) || {}).priceCurrency || '').toUpperCase();
    out.price = (SYM[cur] || (cur ? cur + ' ' : '')) + String(Math.min(...vals));
  }
  const sizes = new Set();
  const addSize = (v) => { const t = String(v == null ? '' : v).trim(); if (t && t.length <= 20) sizes.add(t); };
  (Array.isArray(prod.hasVariant) ? prod.hasVariant : []).forEach((v) => v && addSize(v.size));
  offers.forEach((o) => { if (o.itemOffered && o.itemOffered.size) addSize(o.itemOffered.size); if (o.size) addSize(o.size); });
  if (prod.size) (Array.isArray(prod.size) ? prod.size : [prod.size]).forEach(addSize);
  out.sizes = [...sizes].slice(0, 30).join(', ');
  return out;
}

// ── 컬러웨이 추출 — worker/fabric-extractor.js 의 colorFromHtml 복사본.
// 확장은 단일 파일로 자립해야 해서 복사하되, scripts/test-color.mjs 가
// 두 구현이 어긋나면 CI에서 실패시킨다.
// ── 컬러웨이: 상품 페이지의 "색상 선택 옵션"에서 읽는다 ─────────────────
// 색은 상품명에 없는 경우가 많고("한정판: Olive Tree", "코어"), 사전에 없는
// 고유 이름이 흔하다. 그래서 색상 단어를 추측하지 않고 옵션 표기를 그대로 가져온다.
// 사이트마다 마크업이 달라 흔한 형태를 순서대로 훑고, 못 찾으면 빈 값을 준다.
const COLOR_JUNK = /^(?:select|choose|color|colour|색상|컬러|선택|기타|\d+|#[0-9a-f]{3,8}|[\s:：·,\/-]+)$/i;
function cleanColor(v) {
  const t = String(v || '')
    .replace(/&amp;/gi, '&').replace(/&#0?39;|&apos;/gi, "'").replace(/&quot;/gi, '"')
    .replace(/^\s*(?:색상|컬러|colou?r)\s*[::]\s*/i, '')     // "Color: Olive" → "Olive"
    .replace(/^\s*한정판\s*[::]\s*/, '')                      // "한정판: Olive Tree" → "Olive Tree"
    .replace(/\s*\(전체 보기\)\s*$/, '')
    .replace(/\s+/g, ' ').trim();
  if (!t || t.length > 40 || COLOR_JUNK.test(t)) return '';
  return t;
}
function colorFromHtml(html) {
  const h = String(html || '');
  if (!h) return '';
  const pats = [
    // 페이지에 심어 둔 JSON — 가장 신뢰도가 높다.
    /"selected(?:Color|Colour)"\s*:\s*"([^"]{1,40})"/i,
    // 영국식 철자(colour)와 이름 변형까지 — Mint velvet·Whitestuff 같은 영국 사이트가 colour 를 쓴다.
    /"colou?r(?:Name|_name|Description|Label|DisplayName|Display)"\s*:\s*"([^"]{1,40})"/i,
    /"swatch(?:Name|Label)"\s*:\s*"([^"]{1,40})"/i,
    /<meta[^>]+(?:property|name)="(?:product|og):colou?r"[^>]+content="([^"]{1,40})"/i,
    /"colou?r"\s*:\s*"([^"]{1,40})"/i,
    // 선택된 스와치의 접근성 라벨
    /aria-label="\s*(?:색상|컬러|colou?r)\s*[::]?\s*([^"]{1,40})"/i,
    /data-(?:color|colour|color-name)="([^"]{1,40})"/i,
    // 선택 상자의 선택된 항목
    /<option[^>]+selected[^>]*>([^<]{1,40})<\/option>/i,
    // 화면 글자 "Colour: Navy" / <span>Color:</span><span>Navy</span>
    />\s*(?:colou?r|색상)\s*[:：]\s*([A-Za-z][A-Za-z' &\/-]{1,30}?)\s*</i,
    />\s*(?:colou?r|색상)\s*[:：]\s*<\/[a-z]+>\s*(?:<[^>]+>\s*){0,3}([A-Za-z][A-Za-z' &\/-]{1,30}?)\s*</i,
  ];
  for (const re of pats) {
    const m = h.match(re);
    if (m) { const c = cleanColor(m[1]); if (c) return c; }
  }
  // 색상 선택 영역(select/fieldset)의 첫 옵션 — 위 방법이 다 실패했을 때만.
  const box = h.match(/<(select|fieldset)[^>]*(?:name|id|class|data-option-name)="[^"]*(?:colou?r|색상|컬러)[^"]*"[\s\S]{0,4000}?<\/\1>/i);
  if (box) {
    for (const m of box[0].matchAll(/<option[^>]*>([^<]{1,40})<\/option>|aria-label="([^"]{1,40})"/gi)) {
      const c = cleanColor(m[1] || m[2]);
      if (c) return c;
    }
  }
  return '';
}

// 브랜드 저장 후: 네 항목(혼용률·컬러·사이즈·가격)이 빈 상품의 페이지를 서비스워커 fetch 로 읽어 채운다.
// 확장은 실사용 PC(주거용 IP)라 서버가 못 여는 봇 차단 사이트도 열린다 — 이 브랜드들의
// 혼용률은 여기서만 나온다. 탭을 열지 않고 fetch 만 하므로 페이지당 1~2초.
// 한 번 채운 값은 Worker 가 계속 승계하므로 매일 조금씩 하면 결국 다 찬다.
// 실행당 브랜드 상한. 1.7.0 은 80이라 다 채우는 데 며칠이 걸렸다 —
// 한 번 실행으로 끝내려고 상한을 사실상 없애고(브랜드 저장 상한과 같은 값)
// 순차 처리를 4개 동시로 바꿨다. 대신 실행 시간이 브랜드당 몇 분씩 늘어난다.
const COMP_PER_RUN = MAX_PER_BRAND;
const COMP_CONCURRENCY = 4;
// 혼용률·컬러는 이미 찼지만 상품 상세(설명·디테일·사진)가 없는 상품을 브랜드당 실행마다 이만큼 더 연다.
const DETAIL_PER_RUN = 100;

// ── 탭으로 읽기 ────────────────────────────────────────────────────
// 위 fetch 는 서비스워커에서 나가는 '맨 요청'이다. 집 IP 라도 쿠키·JS 실행이 없어서
// 봇 확인 화면이나 스크립트로만 그리는 빈 껍데기를 받는 사이트가 많다.
// 그래서 목록은 탭으로 잘 모으는데(Chico's 800 · Fatface 456 · Lululemon 463 …)
// 혼용률은 0% 로 남았다. 그런 상품만 실제 탭으로 열어 렌더링된 화면에서 읽는다.
// 탭은 느리므로(상품당 5~10초) 브랜드당 실행마다 상한을 둔다 — 남은 것은 다음 차례에.
const TAB_PER_RUN = 40;
const TAB_GIVEUP = 6;   // 처음 이만큼이 탭으로도 전부 막히면 이 브랜드는 오늘 탭 읽기를 접는다
const CHALLENGE_RX = /access denied|pardon our interruption|are you a human|attention required|verify you are human|unusual traffic|press (and|&) hold|just a moment|enable javascript and cookies|request unsuccessful|incapsula incident/i;
// fetch 로 받은 HTML 이 상품 페이지를 실제로 읽은 것인가(scripts/enrich-comp.mjs 의 realPage 와 같은 규칙).
function realPage(html) {
  const s = String(html || '');
  const title = (s.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1];
  // 화면에 보이는 글. 스크립트·스타일을 걷어 낸 것이다.
  const visible = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  // 차단 문구는 제목과 화면 글에서만 찾는다. 원본 HTML 에서 찾으면 PerimeterX·Incapsula 로
  // 보호되는 '정상' 상품 페이지가 머리의 <script src=…perimeterx…/_Incapsula_Resource> 나
  // 다국어 문구 묶음("Access denied") 때문에 통째로 차단으로 분류된다. 글 없이 iframe 만
  // 띄우는 캡차(DataDome·Incapsula)는 아래 글 길이 기준에서 걸린다.
  if (CHALLENGE_RX.test(title) || CHALLENGE_RX.test(visible.slice(0, 3000))) return false;
  // JSON-LD Product 나 og:type product 가 있으면 상품 페이지다.
  if (/"@type"\s*:\s*"Product"|property=["']og:type["'][^>]*content=["']product/i.test(s)) return true;
  // 그 외에는 화면에 보이는 글이 어느 정도 있어야 한다. 스크립트로만 그리는 껍데기는 수백 자에 그친다.
  return visible.length >= 600;
}

// ── 이 상품 페이지를 정말 읽었나(none 판정) 시작 — enrich-comp-browser.mjs 가 이 구간을 떼어 쓰고, 확장 background.js 에 글자 그대로 복사돼 있다
// realPage 는 '차단 화면이 아니다'까지만 본다. 소재가 없다(none)는 결론은 그보다 강한 근거가
// 있어야 한다 — none 은 엑셀에 '정보 없음'으로 나가고 그 상품을 한동안 다시 안 보기 때문이다.
//
// 11/24 실측: Patagonia 상품 페이지는 fetch·크롬으로 열면 글 1,017자짜리 껍데기만 온다(600자는
// 넘는다). 그 껍데기를 '읽었다'로 쳐서 남은 167개가 전부 none 이 됐는데, 파이어폭스로 열면
// 같은 상품에서 혼용률이 나온다. 그래서 none 은 "이 상품의 본문이 그려진 페이지"일 때만 적는다:
//   · 카탈로그의 상품명이 있으면 — 그 이름의 낱말 대부분(60% 이상)이 화면 글에 있어야 한다.
//     제목(<title>)만으로는 안 된다. 껍데기도 제목은 갖고 있다.
//   · 상품명이 없으면 — 상품 신호(JSON-LD Product · og:type product · schema.org/Product)와
//     화면 글 600자 이상.
// 아니면 '못 읽음'으로 센다(차단과 같이) — none 을 적지 않는다.
const NAME_STOP = new Set(["the", "and", "with", "for", "in", "of", "a", "an", "to", "by", "new", "women", "womens",
  "men", "mens", "s", "x", "de", "la", "le", "et", "en"]);
function nameWords(name) {
  return String(name || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 2 && !NAME_STOP.has(w));
}
function productRead(html, name) {
  const s = String(html || "");
  const visible = s.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<title[\s\S]*?<\/title>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#0?39;|&apos;|&rsquo;/gi, "'");
  const words = nameWords(name);
  if (words.length) {
    const hay = " " + nameWords(visible).join(" ") + " ";
    const hit = words.filter((w) => hay.includes(" " + w + " ")).length;
    return hit / words.length >= 0.6;
  }
  const signal = /"@type"\s*:\s*\[?\s*"Product"|property=["']og:type["'][^>]*content=["']product|itemtype=["'][^"']*schema\.org\/Product/i.test(s);
  return signal && visible.replace(/\s+/g, " ").trim().length >= 600;
}
// ── 이 상품 페이지를 정말 읽었나(none 판정) 끝
// 소재·상세를 읽기 전에 '이 상품의 본문이 그려진 페이지인가'를 본다(scripts/enrich-comp.mjs 와 글자 그대로 같은 구간).

// 탭 안에서 실행된다(자립 함수여야 한다). 접힌 소재 탭을 펼치고, 퍼센트+섬유가
// 보일 때까지 최대 6초 기다린 뒤 HTML 을 돌려준다.
async function readRenderedPage() {
  // 상품 상세 칸(Description·Features·Fit·Care …)도 함께 펼친다 — 클릭해야 글이 그려지는 사이트가 있다.
  const rx = /composition|material|fabric|소재|혼용|content|details|description|features|fit\b|care|specifications|overview|highlights/i;
  for (const d of document.querySelectorAll('details')) d.open = true;
  for (const b of document.querySelectorAll('button,[role="button"],summary,[aria-expanded="false"]')) {
    if (b.closest('nav,header,footer')) continue;
    const t = (b.textContent || '') + ' ' + (b.getAttribute('aria-label') || '');
    if (t.length < 80 && rx.test(t)) { try { b.click(); } catch (e) {} }
  }
  const fibre = /\d{1,3}\s?%\s*(?:[A-Za-z]+\s)?(cotton|polyester|viscose|wool|linen|silk|nylon|polyamide|elastane|spandex|lyocell|modal|cashmere|acrylic|rayon|leather)/i;
  for (let i = 0; i < 12; i++) {
    if (fibre.test((document.body && document.body.innerText) || '')) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  return {
    title: document.title,
    head: ((document.body && document.body.innerText) || '').slice(0, 600),
    html: document.documentElement.outerHTML.slice(0, 1500000),
  };
}

async function readByTab(url, winId, name) {
  let tab = null;
  try {
    tab = winId
      ? await chrome.tabs.create({ url, active: true, windowId: winId })
      : await chrome.tabs.create({ url, active: false });
    await waitForComplete(tab.id, 45000);
    await sleep(2000);   // JS 챌린지·초기 렌더 여유
    const inj = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: readRenderedPage });
    const r = (inj && inj[0] && inj[0].result) || null;
    if (!r) return { blocked: true };
    if (CHALLENGE_RX.test(r.title + ' ' + r.head)) return { blocked: true };
    const bits = jsonLdBits(r.html);
    const isThis = productRead(r.html, name || '');
    const det = isThis ? detailOf(r.html, url, null) : {};
    return {
      comp: compFromHtml(r.html) || (isThis ? partsComp(r.html, url) : ''), color: bits.color || colorFromHtml(r.html),
      sizes: bits.sizes || (det.sizes || []).slice(0, 30).join(', '), price: bits.price || det.price || '', priceOrig: bits.priceOrig || det.priceOrig || '',
      det: isThis ? detailRec(det) : null,
    };
  } catch (e) {
    return { blocked: true };
  } finally {
    if (tab) { try { await chrome.tabs.remove(tab.id); } catch (e) {} }
  }
}

// 저장 직전 가드 — 브랜드 전체에 되풀이되는 '사이트 장식'(메뉴·배너·추천 블록의 글)을 혼용률로 저장하지 않는다.
// 2026-11-24 점검: Splendid 344개 중 233개가 "Cotton 100% ‖ Cashmere 100%", Aritzia 472개 중 358개가 "Leather 100%".
// 야간 보강·크롬 보강과 같은 규칙(scripts/comp-guard.mjs)을 글자 그대로 옮겨 둔다 — 확장은 자립형 파일이라 복사가 불가피하다.
// ── 저장 직전 가드 규칙 시작 — chrome-extension/background.js 에 글자 그대로 복사돼 있다(test-comp-guard 가 비교)
const GUARD_RULE = {
  LINE_MIN_MULTI: 8,   // 여러 줄 값이 이만큼은 있어야 판단한다(적으면 우연과 구별이 안 된다)
  LINE_SHARE: 0.8,     // 같은 줄이 여러 줄 값의 이 비율 이상
  LINE_PARTNERS: 3,    // 짝 줄의 종류(같은 원단 묶음이면 짝이 한두 종류다)
  VALUE_MIN: 30,       // 브랜드 혼용률이 이만큼은 있어야 판단한다
  VALUE_SHARE: 0.6,    // 한 값이 이 비율 이상
  VALUE_CONTRA: 0.1,   // 그 값을 가진 상품 중 이름과 어긋나는 비율
  VALUE_CONTRA_MIN: 5, // 어긋나는 상품이 적어도 이만큼
};

// 흔한 안감 — 브랜드 전체에 되풀이돼도 진짜일 수 있다.
const LINING_RX = /^(?:polyester|viscose|acetate|triacetate|cupro|nylon|polyamide) 100%$/i;

// 혼용률 → 단위(원단 한 벌) 목록. 줄로 나뉘고, 예전 저장분처럼 한 줄에 "Wool 100% / Cotton 100%"(합 200)로
// 붙은 것도 두 벌로 본다.
function units(comp) {
  const out = [];
  for (const line of String(comp || "").split("\n").map((l) => l.trim()).filter(Boolean)) {
    const items = line.split(/\s*\/\s*/).filter(Boolean).map((p) => {
      const m = p.match(/^(.*?)\s*(\d{1,3}(?:\.\d+)?)\s*%$/);
      return m ? { fib: m[1].trim(), pct: Number(m[2]) } : { fib: p.trim(), pct: NaN };
    });
    const sum = items.reduce((n, c) => n + (Number.isFinite(c.pct) ? c.pct : 0), 0);
    if (items.length >= 2 && sum > 150 && items.every((c) => c.pct === 100)) for (const c of items) out.push([c]);
    else out.push(items);
  }
  return out;
}
const unitKey = (u) => u.map((c) => `${c.fib} ${c.pct}%`.toLowerCase()).sort().join(" / ");
const unitText = (u) => u.map((c) => `${c.fib} ${c.pct}%`).join(" / ");
const normValue = (comp) => units(comp).map(unitKey).sort().join(" ‖ ");

// 상품명이 말하는 섬유 중 혼용률에 없는 것. "Faux Leather"·"Linen-Look" 는 그 섬유가 아니다.
const NAME_FIBRES = { cotton: "Cotton", wool: "Wool", merino: "Wool", linen: "Linen", silk: "Silk", cashmere: "Cashmere",
  viscose: "Viscose", lyocell: "Lyocell", tencel: "Lyocell", modal: "Modal", polyester: "Polyester", nylon: "Nylon",
  leather: "Leather", alpaca: "Alpaca", mohair: "Mohair" };
function nameContradicts(name, comp) {
  const n = String(name || "").toLowerCase()
    .replace(/\b(?:faux|vegan|imitation|fake|pleather)[\s-]+[a-z]+/g, " ")
    .replace(/\b[a-z]+[\s-](?:look|like|effect|feel|touch|print)\b/g, " ");
  const c = String(comp || "").toLowerCase();
  return Object.entries(NAME_FIBRES).filter(([w, f]) => new RegExp(`\\b${w}\\b`).test(n) && !c.includes(f.toLowerCase())).map(([w]) => w);
}

// 브랜드 하나의 값들([{url, name, comp}])에서 조각으로 보이는 줄·값을 찾는다.
function findFlags(items, rule = GUARD_RULE) {
  const withComp = items.filter((p) => p && String(p.comp || "").trim());
  const flags = [];
  // ① 줄 규칙
  const multi = withComp.filter((p) => units(p.comp).length >= 2);
  if (multi.length >= rule.LINE_MIN_MULTI) {
    const cnt = new Map();
    for (const p of multi) {
      const us = units(p.comp);
      const keys = new Set(us.map(unitKey));
      for (const u of us) {
        const k = unitKey(u);
        if (!keys.has(k)) continue;
        keys.delete(k);
        const e = cnt.get(k) || { text: unitText(u), n: 0, partners: new Set() };
        e.n++;
        for (const o of us) if (unitKey(o) !== k) e.partners.add(unitKey(o));
        cnt.set(k, e);
      }
    }
    for (const [k, e] of cnt) {
      const share = e.n / multi.length;
      if (share >= rule.LINE_SHARE && e.partners.size >= rule.LINE_PARTNERS && !LINING_RX.test(e.text)) {
        flags.push({ kind: "line", key: k, text: e.text, n: e.n, of: multi.length, share, partners: e.partners.size });
      }
    }
  }
  // ② 값 규칙
  if (withComp.length >= rule.VALUE_MIN) {
    const cnt = new Map();
    for (const p of withComp) {
      const k = normValue(p.comp);
      const e = cnt.get(k) || { text: p.comp, n: 0, contra: 0, ex: [] };
      e.n++;
      const why = nameContradicts(p.name, p.comp);
      if (why.length) { e.contra++; if (e.ex.length < 5) e.ex.push({ name: p.name, url: p.url, why }); }
      cnt.set(k, e);
    }
    for (const [k, e] of cnt) {
      const share = e.n / withComp.length;
      if (share >= rule.VALUE_SHARE && e.contra >= rule.VALUE_CONTRA_MIN && e.contra / e.n >= rule.VALUE_CONTRA) {
        flags.push({ kind: "value", key: k, text: e.text, n: e.n, of: withComp.length, share, contra: e.contra, contraEx: e.ex });
      }
    }
  }
  return flags;
}

// 이 값이 어느 표시에 걸리나(없으면 null).
function heldBy(comp, flags) {
  if (!flags.length || !String(comp || "").trim()) return null;
  const us = units(comp);
  const v = normValue(comp);
  for (const f of flags) {
    if (f.kind === "value" && f.key === v) return f;
    if (f.kind === "line" && us.length >= 2 && us.some((u) => unitKey(u) === f.key)) return f;
  }
  return null;
}

const urlKey = (u) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/+$/, "")).toLowerCase(); } catch (e) { return String(u || ""); } };

// 저장 직전에 쓴다. stored: 이 브랜드에 이미 저장돼 화면에 보이는 값, incoming: 이번 실행에서 읽은 값
// (둘 다 [{url, name, comp}]). 같은 상품은 이번 값으로 본다. 보류할 이번 값의 주소 → 이유를 돌려준다.
function guardRun(stored, incoming, rule = GUARD_RULE) {
  const inc = new Map();
  for (const p of incoming || []) if (p && p.url && String(p.comp || "").trim()) inc.set(urlKey(p.url), p);
  const ctx = [...(stored || []).filter((p) => p && p.url && !inc.has(urlKey(p.url))), ...inc.values()];
  const flags = findFlags(ctx, rule);
  const held = new Map();
  for (const p of inc.values()) {
    const f = heldBy(p.comp, flags);
    if (f) held.set(p.url, { comp: p.comp, name: p.name || "", flag: f });
  }
  return { held, flags };
}

// 보류 이유를 사람 말로.
function flagText(f) {
  const pct = Math.round(f.share * 100);
  return f.kind === "line"
    ? `여러 줄 값 ${f.of}개 중 ${f.n}개(${pct}%)에 같은 줄 "${f.text}" · 짝 ${f.partners}종`
    : `값 ${f.of}개 중 ${f.n}개(${pct}%)가 "${String(f.text).replace(/\n/g, " ‖ ")}" · 그중 ${f.contra}개는 이름과 어긋남`;
}
// ── 저장 직전 가드 규칙 끝

// ── 상품 상세(설명·디테일 글머리표·사진 전부·컬러 전부·코드·통화·재고 사이즈) ─────────────
// 아래 두 구간은 worker/fabric-extractor.js 의 '상품 상세(detail) 추출' 구간과 scripts/detail-guard.mjs 의
// '상세 가드 규칙' 구간을 글자 그대로 옮긴 것이다(확장은 자립형 파일이라 복사가 불가피 — test-detail 이 비교한다).
// 상세는 오버레이(comp:<site>)가 아니라 따로(detail:<site>, Worker ?store=details) 저장한다.
function titleCase(s) {
  return String(s).toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()).trim().slice(0, 40);
}
// ── 상품 상세(detail) 추출 시작 — enrich-comp.mjs·enrich-comp-browser.mjs·field-measure.mjs 가 이 구간을 떼어 쓰고,
//    chrome-extension/background.js 에 글자 그대로 복사돼 있다(scripts/test-detail.mjs 가 비교한다).
//
// 무엇을 뽑나(혼용률·컬러 말고 '나머지 상품 정보'):
//   desc    설명 문단(평문)            feat   디테일 글머리표(핏·기장·넥라인·여밈·주머니·관리법 …)
//   imgs    상품 사진 전부(갤러리)     colors 이 상품이 나오는 컬러 전부
//   sku     상품 코드                  cur    통화(USD·GBP …)
//   sizes   사이즈 전부                sizesIn 재고 있는 사이즈(사이트가 알려 줄 때만)
//   price / priceOrig / color / name   더 나은 출처가 있을 때 기존 값을 보강
// 출처 순서: Shopify 공개 JSON → JSON-LD(Product·ProductGroup) → 메타 태그 → 제목이 붙은 본문 칸(Details·Description·
// Features·Fit·Fabric & Care …). 어디서 왔는지는 src 에 남긴다(현장 지도 docs/field-map.md 의 근거).
//
// 지키는 것(이 저장소에서 실제로 틀렸던 자리):
//   · 메뉴(<nav>)·<template>·머리/꼬리(사이트 공통)·추천 상품("you may also like")·리뷰 칸의 글은 다른 상품의 것 — 지우고 본다.
//   · 사이트에 적힌 글 그대로. 공백만 다듬고 길이만 자른다(번역·고쳐 쓰기 없음).
//   · 길이 상한(DETAIL_CAP): 설명 1,500자 · 글머리표 25개 × 220자 · 사진 20장 · 컬러 30개 · 사이즈 40개 · 코드 60자.
// 이 구간은 다른 함수에 기대지 않는다(확장에 그대로 복사하기 위해서). titleCase 만 예외 — 확장에도 같은 이름이 있다.
const DETAIL_CAP = { desc: 1500, feat: 25, featLen: 220, imgs: 20, colors: 30, sizes: 40, sku: 60 };

// HTML 조각 → 사람이 읽는 평문(줄 구분은 \n 하나).
function dtText(s) {
  return String(s == null ? '' : s)
    // JSON-LD 설명에 HTML 이 엔티티로 든 경우("&lt;p&gt;…") — 태그로 되돌려 아래에서 함께 벗긴다(Whitestuff).
    .replace(/&lt;(\/?[a-z][a-z0-9]*\b[^&<>]{0,200}?)&gt;/gi, '<$1>')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(?:p|li|div|h[1-6]|dd|dt|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/&quot;|&#34;/gi, '"').replace(/&#0?39;|&apos;|&rsquo;|&lsquo;|&#821[67];/gi, "'")
    .replace(/&ldquo;|&rdquo;|&#822[01];/gi, '"').replace(/&ndash;|&#8211;/gi, '–').replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&bull;|&#8226;/gi, '•').replace(/&trade;/gi, '™').replace(/&reg;/gi, '®').replace(/&deg;/gi, '°')
    .replace(/&eacute;/gi, 'é').replace(/&egrave;/gi, 'è')
    .replace(/&#(\d{2,5});/g, (m, n) => { const c = Number(n); return c > 31 && c < 65536 ? String.fromCharCode(c) : ' '; })
    .replace(/&#x([0-9a-f]{2,4});/gi, (m, n) => { const c = parseInt(n, 16); return c > 31 ? String.fromCharCode(c) : ' '; })
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&')
    .replace(/[ \t\r\f\v ​]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
}
const dtClip = (s, n) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t; };
const dtUniq = (arr) => { const seen = new Set(); const out = []; for (const x of arr) { const k = String(x).toLowerCase(); if (x && !seen.has(k)) { seen.add(k); out.push(x); } } return out; };

// 한 요소(여는 태그부터 짝이 맞는 닫는 태그까지)를 통째로 지운다. 같은 이름의 태그 깊이를 센다.
// test(tag, attrs) 가 참인 요소만. 짝을 못 찾으면 지우지 않고 지나간다.
const DT_VOID = /^(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/;
function dtCut(h, test) {
  let out = '', from = 0;
  const open = /<([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g;
  let m;
  while ((m = open.exec(h))) {
    const tag = m[1].toLowerCase();
    if (DT_VOID.test(tag) || /\/\s*$/.test(m[2]) || !test(tag, m[2])) continue;
    const rx = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi');
    rx.lastIndex = m.index + m[0].length;
    let depth = 1, k, end = -1;
    while ((k = rx.exec(h))) {
      if (k[1]) { if (--depth === 0) { end = k.index + k[0].length; break; } } else if (!/\/\s*>$/.test(k[0])) depth++;
    }
    if (end < 0) continue;
    out += h.slice(from, m.index) + ' ';
    from = end;
    open.lastIndex = end;
  }
  return out + h.slice(from);
}
// 다른 상품·사이트 공통의 글이 든 칸. class·id 에 이런 말이 있으면 지운다.
const DT_NOISE_RX = /recommend|related|also[-_ ]?(?:like|love|bought|viewed)|you[-_ ]?may|may[-_ ]?also|upsell|up-sell|cross[-_ ]?sell|recently[-_ ]?viewed|complete[-_ ]?(?:the|your)[-_ ]?look|shop[-_ ]?the[-_ ]?look|wear[-_ ]?it[-_ ]?with|style[-_ ]?it[-_ ]?with|pairs?[-_ ]?(?:well[-_ ]?)?with|mega[-_ ]?menu|menu[-_ ]?drawer|header[-_ ]?(?:menu|drawer|nav)|site[-_ ]?nav|newsletter|cookie|consent|mini[-_ ]?cart|minicart|cart[-_ ]?drawer|breadcrumb|size[-_ ]?(?:guide|chart)|review|rating|bazaarvoice|yotpo|okendo|klarna|afterpay|loyalty|promo[-_ ]?bar|announcement|search[-_ ]?(?:form|bar|overlay)|skip[-_ ]?link/i;
const DT_ATTR_RX = /\b(?:class|id|aria-label|data-section-type|data-component)\s*=\s*["']([^"']*)["']/gi;
function dtAttrs(a) { let s = ''; for (const m of String(a).matchAll(DT_ATTR_RX)) s += ' ' + m[1]; return s; }
// 본문만 남긴 HTML. 스크립트·스타일·메뉴·<template>·사이트 머리/꼬리·추천 칸을 걷어 낸다.
function dtBody(html) {
  let h = String(html || '').slice(0, 1500000)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|template|iframe|select)\b[\s\S]*?<\/\1>/gi, ' ');
  h = dtCut(h, (tag, a) => {
    const at = dtAttrs(a);
    if (tag === 'nav') return true;
    if (tag === 'aside' || tag === 'dialog') return !/product|pdp/i.test(at);
    // 머리·꼬리는 사이트 공통 칸일 때만(상품 칸 머리 <header class="product__header"> 는 남긴다)
    if (tag === 'header' || tag === 'footer') return !/product|pdp|item|accordion|tab/i.test(at);
    return !!at && DT_NOISE_RX.test(at) && !/\b(?:product|pdp)[-_]?(?:details?|description|info|accordion|tabs?)\b/i.test(at);
  });
  return h;
}

// 칸 제목 — 이 제목이 붙은 칸의 글을 상품 디테일로 본다.
// 이음말: "Fabric & Care" · "Fabric and Care" · "SIZE + FIT" · "Fit/Size"
const DT_DESC_HEAD = /^(?:product\s+)?(?:description|overview|about\s+(?:this|the)\s+(?:product|style|item|piece)|editor'?s?\s+notes?|the\s+story|design\s+notes?|description\s*(?:&|and|\+|\/)\s*details?)$/i;
const DT_FEAT_HEAD = /^(?:(?:product|style|design|more|the|key|garment)\s+)?(?:details?|features?|highlights?|specifications?|specs|characteristics)$|^(?:details?\s*(?:&|and|\+|\/)\s*(?:care|fit|fabric|composition)|fit|the\s+fit|fit\s*(?:&|and|\+|\/)\s*(?:size|sizing|measurements?|details?|style)|size\s*(?:&|and|\+|\/)\s*fit|sizing|(?:fabric|fabrics|materials?|composition|content)\s*(?:&|and|\+|\/)\s*(?:care|fit)|care|care\s+(?:instructions|guide)|fabric(?:\s+details)?|materials?|composition)$/i;
// 이음말로 이은 칸 제목("Fabric & care details" · "Style & Fit + Measurements +" · "Fabric & Details") — 디테일 칸이다.
const DT_HEADISH_RX = /^(?:[a-z ]{0,30}(?:&|\+|\band\b)\s*)?(?:fabric|care|details?|fit|measurements?|size|style|materials?|composition)(?:\s*(?:&|\+|\band\b)\s*[a-z ]{0,20})?(?:\s+details)?\s*\+?$/i;
function dtHeadKind(t) {
  const s = String(t || '').replace(/[+\-–—:>›▾▸∨⌄˅]+\s*$/, '').replace(/\s+/g, ' ').trim();
  if (!s || s.length > 40) return '';
  if (DT_DESC_HEAD.test(s)) return 'desc';
  if (DT_FEAT_HEAD.test(s)) return 'feat';
  if (/[&+]|\band\b/i.test(s) && DT_HEADISH_RX.test(s)) return 'feat';
  return '';
}
// 사이트 공통 안내(배송·반품·사이즈 안내·결제)는 상품 디테일이 아니다 — 글머리표에서 뺀다.
// 값이 붙은 가격("$48")·판매 문구·공유 단추·태그 조각도 상품 디테일이 아니다(추천 칸이 새어 든 모양 — 11/25 현장 측정).
const DT_JUNK_RX = /\b(?:free\s+(?:shipping|returns?|delivery)|shipping|delivery|returns?(?:\s+(?:policy|within)|\s+\d+\s+days)|exchanges?|klarna|afterpay|interest-free|gift\s*card|sign\s+(?:in|up)|log\s*in|add\s+to\s+(?:bag|cart)|size\s+guide|find\s+(?:in|your)\s+(?:store|size)|write\s+a\s+review|newsletter|promo\s+code|subscribe|select\s+(?:a\s+)?size|notify\s+me|out\s+of\s+stock|pair\s+it\s+with|shop\s+(?:the\s+look|women|men|now|all)|wishlist|instagram|facebook|pinterest|tiktok|learn\s+more|contact\s+us|have\s+a\s+question|close\s+dialog|opens\s+in\s+a\s+new\s+window|choosing\s+a\s+selection|use\s+code|\d+%\s+off|sale|qty|in-store\s+availability|check\s+(?:in-store|availability|stock)|orders?\s+placed|can\s+be\s+returned|returned\s+until)\b|[$£€]\s?\d|<\/?[a-z]+[\s>]|="/i;
// 사이즈 단추·숫자만 있는 줄("10" · "XL" · "XXS XS S M L")
const DT_SIZE_LINE_RX = /^(?:(?:\d{1,3}|x{0,3}[sml]|xxs|one\s+size|os|petite|tall)(?:\s+|$))+$/i;

// 제목 바로 뒤의 내용 — 제목의 부모 칸이 닫히는 곳에서 멈춘다(아코디언 한 칸 · 제목+목록 한 덩어리).
// 다음 제목·6,000자에서도 멈춘다. 부모 칸이 비어 있으면(제목만 따로 감싼 구조) 한 겹 더, 최대 세 겹까지 넓힌다.
// 칸 경계를 지키지 않으면 칸 뒤에 이어진 추천 상품·사이즈 단추·판촉 문구까지 글머리표로 들어온다(11/25 측정).
function dtChunk(body, from, stopAt) {
  const rx = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
  for (const lim of [1, 2, 3]) {
    rx.lastIndex = from;
    let depth = 0, end = Math.min(stopAt, from + 6000), m;
    while ((m = rx.exec(body)) && m.index < end) {
      const tag = m[2].toLowerCase();
      if (DT_VOID.test(tag) || /\/\s*>$/.test(m[0])) continue;
      if (m[1]) { if (--depth <= -lim) { end = m.index; break; } } else depth++;
    }
    const chunk = body.slice(from, end);
    if (dtText(chunk).length >= 3) return chunk;
  }
  return '';
}
// 공유·추적·배송 방법 단추 이름.
const DT_BTN_RX = /^(?:[^.]{2,40}\s\+|share|traceability|nominated\s+day|collect\s+from\s+store|click\s*(?:&|and)\s*collect)$/i;
const dtJunk = (t) => DT_JUNK_RX.test(t) || DT_SIZE_LINE_RX.test(t) || DT_BTN_RX.test(String(t).trim()) || !!dtHeadKind(t);

// 제목이 붙은 본문 칸을 찾아 설명 문단·글머리표를 모은다.
function dtSections(body) {
  const heads = [];
  const rx = /<(button|summary|h[1-6]|dt|span|div|p|label|li|strong|b)\b([^>]*)>([\s\S]{1,300}?)<\/\1>/gi;
  let m;
  while ((m = rx.exec(body))) {
    // "Composition: …" 처럼 쌍점으로 끝나는 굵은 글·span 은 칸 제목이 아니라 한 줄 안의 이름표다(Mint Velvet: <li><strong>Composition: </strong>…).
    const ht = dtText(m[3]);
    const kind = (/^(?:strong|b|span|label)$/i.test(m[1]) && /[:：]\s*$/.test(ht)) ? "" : dtHeadKind(ht);
    if (kind) { heads.push({ kind, at: m.index, end: m.index + m[0].length }); rx.lastIndex = m.index + m[0].length; }
    else rx.lastIndex = m.index + 1 + m[1].length;
  }
  const desc = [], feat = [], kinds = new Set();
  for (let i = 0; i < heads.length; i++) {
    const h = heads[i];
    const chunk = dtChunk(body, h.end, i + 1 < heads.length ? heads[i + 1].at : body.length);
    // 단추·링크 하나만 든 줄("Check in-store availability")은 상품 디테일이 아니다.
    const lis = [...chunk.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].filter((x) => !/^\s*<(button|a)\b[\s\S]*<\/\1>\s*$/i.test(x[1])).map((x) => dtText(x[1]).replace(/\n/g, ' ').replace(/^[•·\-*\s]+/, '').trim())
      .filter((t) => t.length >= 2 && t.length <= 400 && !dtJunk(t));
    let got = 0;
    if (lis.length) { feat.push(...lis); got += lis.length; }
    const rest = dtText(chunk.replace(/<(ul|ol)\b[\s\S]*?<\/\1>/gi, ' '));
    const lines = rest.split('\n').map((x) => x.replace(/^[•·\-*\s]+/, '').trim()).filter((t) => t.length >= 2 && !dtJunk(t));
    if (h.kind === 'desc') {
      const para = lines.filter((t) => t.length >= 25);
      if (para.length) { desc.push(para.join('\n')); got++; }
      if (!lis.length) { const short = lines.filter((t) => t.length < 25 && t.length >= 3); if (short.length >= 2) { feat.push(...short); got += short.length; } }
    } else if (!lis.length) {
      // 글머리표 없이 줄로만 적은 칸("Relaxed fit<br>Hits at hip")은 줄이 글머리표다.
      const ls = lines.filter((t) => t.length <= 220);
      if (ls.length) { feat.push(...ls); got += ls.length; }
    }
    if (got) kinds.add(h.kind);
  }
  return { desc, feat, kinds: [...kinds] };
}

// JSON-LD 의 Product·ProductGroup 노드(중첩·@graph 까지 편다).
function dtLdNodes(html) {
  const flat = [];
  const walk = (n, d) => {
    if (!n || d > 6) return;
    if (Array.isArray(n)) { n.forEach((x) => walk(x, d + 1)); return; }
    if (typeof n !== 'object') return;
    flat.push(n);
    if (n['@graph']) walk(n['@graph'], d + 1);
    if (n.mainEntity) walk(n.mainEntity, d + 1);
  };
  const rx = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m, n = 0;
  while ((m = rx.exec(String(html || ''))) && n++ < 30) {
    const raw = m[1].trim().replace(/^<!\[CDATA\[|\]\]>$/g, '');
    try { walk(JSON.parse(raw), 0); } catch (e) {
      // 줄바꿈이 문자열 안에 그대로 든 JSON-LD(흔하다) — 공백으로 바꿔 한 번 더.
      try { walk(JSON.parse(raw.replace(/[\r\n\t]+/g, ' ')), 0); } catch (e2) {}
    }
  }
  const isT = (x, t) => { const v = x && x['@type']; return (Array.isArray(v) ? v : [v]).some((y) => String(y || '').toLowerCase() === t); };
  return { group: flat.find((x) => isT(x, 'productgroup')) || null, prod: flat.find((x) => isT(x, 'product')) || null, all: flat.filter((x) => isT(x, 'product')) };
}
const DT_SYM = { USD: '$', EUR: '€', GBP: '£', KRW: '₩', JPY: '¥', AUD: 'A$', CAD: 'C$' };
const dtNum = (v) => { const n = Number(String(v == null ? '' : v).replace(/,/g, '').replace(/[^\d.]/g, '')); return Number.isFinite(n) && n > 0 ? n : NaN; };
const dtMoney = (n, cur) => (Number.isFinite(n) ? (DT_SYM[cur] || (cur ? cur + ' ' : '$')) + String(Math.round(n * 100) / 100) : '');
function dtImg(v, base) {
  let u = typeof v === 'string' ? v : (v && (v.url || v.contentUrl || v.src)) || '';
  u = String(u).trim().replace(/&amp;/g, '&');
  if (!u) return '';
  if (u.startsWith('//')) u = 'https:' + u;
  else if (!/^https?:\/\//i.test(u)) { try { u = new URL(u, base).href; } catch (e) { return ''; } }
  // 견본 조각(swatch)·로고·아이콘·자리표시는 상품 사진이 아니다.
  if (/\.svg(?:\?|$)|swatch|logo|icon|placeholder|sprite|spacer|1x1|blank\.gif/i.test(u)) return '';
  return u;
}
const dtImgKey = (u) => String(u).replace(/^https?:/, '').replace(/[?#].*$/, '').replace(/_(?:\d+x\d*|\d*x\d+)(?=\.\w+$)/, '').toLowerCase();
function dtImgs(list, base) {
  const out = [], seen = new Set();
  for (const v of list) {
    const u = dtImg(v, base);
    const k = u && dtImgKey(u);
    if (u && !seen.has(k)) { seen.add(k); out.push(u); }
    if (out.length >= DETAIL_CAP.imgs) break;
  }
  return out;
}
const dtAvail = (o) => { const a = String((o && o.availability) || ''); return a ? /instock|limitedavailability|presale|preorder|onlineonly/i.test(a) : null; };

function dtFromLd(html, base) {
  const { group, prod, all } = dtLdNodes(html);
  const out = {};
  const p = prod || group;
  if (!p) return out;
  const g = group || {};
  const variants = Array.isArray(g.hasVariant) ? g.hasVariant : (Array.isArray(p.hasVariant) ? p.hasVariant : []);
  const vlist = variants.length ? variants : [];
  out.name = dtText(p.name || g.name || '').slice(0, 200);
  const d = dtText(g.description || p.description || '');
  if (d) out.desc = d;
  const imgs = [].concat(p.image || [], g.image || [], ...vlist.map((v) => (v && v.image) || []));
  out.imgs = dtImgs(imgs, base);
  out.sku = String(p.sku || g.productGroupID || p.productGroupID || p.mpn || g.sku || p.productID || '').trim().slice(0, DETAIL_CAP.sku);
  // 가격: 단일·배열·AggregateOffer. 정가는 priceSpecification 의 ListPrice·StrikethroughPrice.
  const offers = [];
  const push = (o) => { if (!o) return; if (Array.isArray(o)) { o.forEach(push); return; } if (typeof o !== 'object') return; offers.push(o); if (o.offers) push(o.offers); };
  push(p.offers); if (group && p !== group) push(g.offers);
  vlist.forEach((v) => v && push(v.offers));
  const curOf = (o) => String(o.priceCurrency || (o.priceSpecification && [].concat(o.priceSpecification)[0] && [].concat(o.priceSpecification)[0].priceCurrency) || '').toUpperCase();
  // 판매가: price → lowPrice → 정가 표시가 아닌 priceSpecification.price(Jaeger·M&S 는 여기에만 적는다).
  const specNow = (o) => { const x = [].concat(o.priceSpecification || []).find((sp) => sp && !/listprice|strikethrough|msrp|srp/i.test(String(sp.priceType || ''))); return x ? x.price : null; };
  const nowOf = (o) => dtNum(o.price != null ? o.price : (o.lowPrice != null ? o.lowPrice : specNow(o)));
  const nows = offers.map(nowOf).filter(Number.isFinite);
  const cur = (offers.map(curOf).find(Boolean) || '').slice(0, 3);
  if (cur) out.cur = cur;
  if (nows.length) out.price = dtMoney(Math.min(...nows), cur);
  const lists = [];
  for (const o of offers) for (const s of [].concat(o.priceSpecification || [])) {
    if (s && /listprice|strikethrough|msrp|srp/i.test(String(s.priceType || ''))) { const n = dtNum(s.price); if (Number.isFinite(n)) lists.push(n); }
  }
  if (lists.length && nows.length && Math.max(...lists) > Math.min(...nows)) out.priceOrig = dtMoney(Math.max(...lists), cur);
  // 컬러·사이즈: 변형(hasVariant) 또는 offers.itemOffered
  const colors = [], sizes = [], sizesIn = [];
  let stockKnown = false;
  const take = (node, offer) => {
    if (!node) return;
    const c = dtText(node.color || ''); if (c && c.length <= 40) colors.push(c);
    // size 는 글 하나 · {name} · 배열(Massimo Dutti: ["XS","S",…]) 모두 있다. 배열이면 재고는 알 수 없다.
    const many = Array.isArray(node.size);
    for (const z of many ? node.size : [node.size]) {
      const s = dtText(z && typeof z === 'object' ? z.name : z || '');
      if (!s || s.length > 20) continue;
      sizes.push(s);
      const av = many ? null : dtAvail(offer || [].concat(node.offers || [])[0]);
      if (av !== null) { stockKnown = true; if (av) sizesIn.push(s); }
    }
  };
  for (const v of vlist) take(v);
  for (const o of offers) if (o.itemOffered) take(o.itemOffered, o);
  if (!vlist.length) take(p, [].concat(p.offers || [])[0]);
  if (prod && prod.color) out.color = dtText(prod.color).slice(0, 80);
  const cs = dtUniq(colors);
  if (cs.length) out.colors = cs.slice(0, DETAIL_CAP.colors);
  const ss = dtUniq(sizes);
  if (ss.length) { out.sizes = ss.slice(0, DETAIL_CAP.sizes); if (stockKnown) out.sizesIn = dtUniq(sizesIn).slice(0, DETAIL_CAP.sizes); }
  out.ldCount = all.length;
  return out;
}

// Shopify 공개 JSON — /products/<handle>.js(가격 센트·재고 available) 또는 .json(가격 문자열·body_html) 둘 다 받는다.
function dtFromShopify(pr, base) {
  const out = {};
  if (!pr || typeof pr !== 'object') return out;
  const p = pr.product || pr;
  out.name = dtText(p.title || '').slice(0, 200);
  const bodyHtml = String(p.body_html || p.description || '');
  const lis = [...bodyHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((x) => dtText(x[1]).replace(/\n/g, ' ').trim()).filter((t) => t.length >= 2 && t.length <= 400);
  // 본문 속 칸 제목("DETAILS" · "SIZE + FIT")은 설명이 아니다 — 빼고 남은 문단만.
  const para = dtText(bodyHtml.replace(/<(ul|ol)\b[\s\S]*?<\/\1>/gi, ' ')).split('\n')
    .filter((t) => !dtHeadKind(t)).join('\n').trim();
  if (para) out.desc = para;
  if (lis.length) out.feat = lis;
  const imgs = (Array.isArray(p.images) ? p.images : []).map((x) => (typeof x === 'string' ? x : x && x.src));
  if (p.featured_image) imgs.unshift(p.featured_image);
  out.imgs = dtImgs(imgs, base);
  const opts = Array.isArray(p.options) ? p.options : [];
  const optIdx = (rx) => opts.findIndex((o) => rx.test(String(typeof o === 'string' ? o : (o && o.name) || '').trim()));
  const valsOf = (i) => { const o = opts[i]; return o && Array.isArray(o.values) ? o.values.map((v) => dtText(v)).filter(Boolean) : []; };
  const ci = optIdx(/^(?:colou?rs?|colou?rway|shade|wash|색상|컬러)$/i), si = optIdx(/^(?:sizes?|사이즈)$/i);
  if (ci >= 0) out.colors = dtUniq(valsOf(ci)).slice(0, DETAIL_CAP.colors);
  const vs = Array.isArray(p.variants) ? p.variants : [];
  if (si >= 0) {
    out.sizes = dtUniq(valsOf(si)).slice(0, DETAIL_CAP.sizes);
    if (vs.some((v) => v && typeof v.available === 'boolean')) {
      const key = 'option' + (si + 1);
      out.sizesIn = dtUniq(vs.filter((v) => v && v.available).map((v) => dtText(v[key] || ''))).filter(Boolean).slice(0, DETAIL_CAP.sizes);
    }
  }
  // .js 는 가격이 센트(정수), .json 은 "98.00" 문자열이다.
  const cents = typeof p.price === 'number' || vs.some((v) => v && typeof v.price === 'number');
  const amt = (v) => { const n = dtNum(v); return Number.isFinite(n) ? (cents ? n / 100 : n) : NaN; };
  const now = vs.map((v) => amt(v && v.price)).filter(Number.isFinite);
  const was = vs.map((v) => amt(v && v.compare_at_price)).filter(Number.isFinite);
  const cur = String((vs[0] && vs[0].price_currency) || '').toUpperCase().slice(0, 3);
  if (cur) out.cur = cur;
  if (now.length) out.price = dtMoney(Math.min(...now), cur || 'USD');
  if (now.length && was.length && Math.max(...was) > Math.min(...now)) out.priceOrig = dtMoney(Math.max(...was), cur || 'USD');
  // 상품 코드: 변형 코드들의 공통 앞부분(사이즈 꼬리를 뗀 것), 없으면 첫 변형 코드.
  const skus = vs.map((v) => String((v && v.sku) || '').trim()).filter(Boolean);
  if (skus.length) {
    let pre = skus[0];
    for (const s of skus) while (pre && !s.startsWith(pre)) pre = pre.slice(0, -1);
    pre = pre.replace(/[-_.\s]+$/, '');
    out.sku = (skus.length > 1 && pre.length >= 4 ? pre : skus[0]).slice(0, DETAIL_CAP.sku);
  }
  return out;
}

// 메타 태그(og·product:) — 가격·통화·사진. 설명(og:description)은 사이트 공통 문구인 경우가 많아 맨 뒤 대안으로만.
function dtFromMeta(html, base) {
  const h = String(html || '').slice(0, 400000);
  const metas = [...h.matchAll(/<meta\b[^>]*>/gi)].map((x) => x[0]);
  const keyOf = (t) => (t.match(/\b(?:property|name|itemprop)\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
  const valOf = (t) => (t.match(/\bcontent\s*=\s*"([^"]*)"/i) || t.match(/\bcontent\s*=\s*'([^']*)'/i) || [])[1];
  const get = (rx) => { for (const t of metas) { const v = valOf(t); if (v != null && rx.test(keyOf(t))) return dtText(v); } return ''; };
  const all = (rx) => metas.filter((t) => rx.test(keyOf(t))).map(valOf).filter(Boolean);
  const out = {};
  const cur = get(/^(?:product|og):price:currency$|^priceCurrency$/i).toUpperCase().slice(0, 3);
  if (cur) out.cur = cur;
  const amt = dtNum(get(/^(?:product|og):price:amount$|^price$/i));
  if (Number.isFinite(amt)) out.price = dtMoney(amt, cur);
  const orig = dtNum(get(/^(?:product|og):original_price:amount$/i));
  if (Number.isFinite(orig) && Number.isFinite(amt) && orig > amt) out.priceOrig = dtMoney(orig, cur);
  out.imgs = dtImgs(all(/^og:image(?::secure_url|:url)?$/i), base);
  out.desc = get(/^og:description$|^description$/i);
  out.color = get(/^(?:product|og):colou?r$/i);
  return out;
}

// Inditex(Massimo Dutti·Zara) 형 — 소재가 화면 글이 아니라 페이지 JSON 의 parts/components 에만 있다:
//   "parts":[{"description":"OUTER SHELL","components":[{"material":"cotton","percentage":"93%"},…]}]
// 추천 상품의 소재가 같은 JSON 에 섞일 수 있어, 서로 다른 조성이 둘 이상이면(이 상품의 것인지 모름) 버린다 —
// 단 주소의 상품 번호(…-l06853106 · …-p01234567)가 나온 자리 바로 뒤 8,000자 안의 것은 이 상품의 것으로 본다.
function compFromPartsJson(html, url) {
  const h = String(html || '').replace(/\\"/g, '"').replace(/\\u002[fF]/g, '/');
  const groups = [];
  for (const m of h.matchAll(/"parts"\s*:\s*\[/g)) {
    const seg = h.slice(m.index, m.index + 6000);
    const lines = [];
    for (const pm of seg.matchAll(/"description"\s*:\s*"([^"]{0,40})"(?:(?!"description")[\s\S]){0,400}?"components"\s*:\s*\[([^\]]*)\]/g)) {
      const items = [...pm[2].matchAll(/"material"\s*:\s*"([A-Za-z][A-Za-z ]{1,30})"\s*,\s*"percentage"\s*:\s*"?(\d{1,3}(?:[.,]\d+)?)\s*%?"?/g)]
        .map((c) => ({ material: titleCase(c[1].trim()), percent: Math.round(Number(c[2].replace(',', '.'))) }));
      const sum = items.reduce((n, c) => n + c.percent, 0);
      if (items.length && sum >= 95 && sum <= 105) lines.push(items);
      if (lines.length >= 2) break;
    }
    if (lines.length) groups.push({ at: m.index, text: lines.map((l) => l.map((c) => c.material + ' ' + c.percent + '%').join(' / ')).join('\n'), lines });
  }
  if (!groups.length) return [];
  const uniq = [...new Set(groups.map((g) => g.text))];
  let pick = uniq.length === 1 ? groups[0] : null;
  if (!pick) {
    const id = (String(url || '').match(/[lp](\d{7,9})(?:[?#./]|$)/i) || [])[1];
    if (id) {
      const at = h.indexOf(id);
      const near = at >= 0 ? groups.filter((g) => g.at > at && g.at - at < 8000) : [];
      if (near.length) pick = near[0];
    }
  }
  if (!pick) return [];
  return pick.lines.flatMap((l, n) => l.map((c) => ({ ...c, line: n })));
}

// 부위 이름표만 있는 줄("OUTER SHELL")과 이름표 없이 쌍점으로 시작하는 값 조각(": 100% cotton")을 정리한다.
// 이름표 바로 뒤에 값 줄이 오면 한 줄로 붙인다("OUTER SHELL: 100% cotton"). 짝이 없는 이름표·조각은 버린다 —
// 혼용률 줄은 이름표와 값이 함께 있을 때만 디테일로 남긴다(2026-11-25 Zara 표본).
const DT_PART_LABEL_RX = /^(?:outer\s+shell|shell|main(?:\s+fabric)?|body|lining|trims?|outer|inner|filling|padding|composition|materials?|fabric)\s*[:：]?$/i;
function dtJoinLabels(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const t = String(list[i] || '').trim();
    if (DT_PART_LABEL_RX.test(t)) {
      const next = String(list[i + 1] || '').trim().replace(/^[:：]\s*/, '');
      if (next && /\d{1,3}\s?%/.test(next) && !DT_PART_LABEL_RX.test(next)) { out.push(t.replace(/\s*[:：]$/, '') + ': ' + next); i++; }
      continue;
    }
    if (/^[:：\-\u2013]\s*\S/.test(t)) continue;
    out.push(t);
  }
  return out;
}

// 상품명 꼬리의 컬러 — 컬러마다 따로 된 상품(Boden: "Lace Trim V-Neck Velvet Top-Beetroot Red",
// 주소 …-beetroot-red-t2259red)은 컬러 옵션도 JSON-LD color 도 없이 이름 끝에만 컬러를 적는다.
// 꼬리를 주소(상품 핸들)에서도 똑같이 찾을 수 있을 때만 컬러로 본다 — 이름 끝의 아무 낱말이나 컬러로 읽지 않게.
function dtTitleColor(name, url) {
  const n = String(name || '').trim();
  const m = n.match(/(?:\s[-\u2013\u2014|]\s|-)([A-Za-z][A-Za-z '&\/]{1,30})$/);
  if (!m) return '';
  const tail = m[1].trim();
  const slug = tail.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let path = '';
  try { path = new URL(url).pathname.toLowerCase(); } catch (e) { return ''; }
  if (!slug || slug.length < 3 || !new RegExp('(?:^|[-/])' + slug + '(?:[-/.]|$)').test(path)) return '';
  // "Crew-Neck" · "Velvet V-Neck" · "Cap-Sleeve" 처럼 옷 모양 낱말이 꼬리면 컬러가 아니다. 앞부분은 여러 낱말이어야 한다.
  if (/^(?:neck|sleeves?|shirt|tee|top|dress|length|line|fit|leg|rise|back|front|waist|up|down|in|out|on|off|zip|button|wrap|pocket|collar|hem|knit|cut|crop(?:ped)?|tie|ups?)\b/i.test(tail)) return '';
  const head = n.slice(0, n.length - m[0].length);
  return /\s/.test(head) && n.length > tail.length + 3 ? tail : '';
}

// 한 상품 페이지의 상세 정보. html(없어도 됨)·shop(Shopify JSON, 없어도 됨)·url.
// 배열은 이미 상한으로 잘려 있다. src = 항목별 출처(shopify·jsonld·meta·dom).
function detailOf(html, url, shop) {
  const base = url || 'https://example.invalid/';
  const sp = shop ? dtFromShopify(shop, base) : {};
  const ld = html ? dtFromLd(html, base) : {};
  const mt = html ? dtFromMeta(html, base) : {};
  const dom = html ? dtSections(dtBody(html)) : { desc: [], feat: [], kinds: [] };
  const out = { src: {} };
  const pick = (k, cands) => {
    for (const [s, v] of cands) {
      if (Array.isArray(v) ? v.length : (v != null && String(v).trim())) { out[k] = v; out.src[k] = s; return; }
    }
  };
  pick('name', [['shopify', sp.name], ['jsonld', ld.name]]);
  // 설명: Shopify 본문 → JSON-LD → 본문 칸. og:description 은 마지막(사이트 공통 문구가 흔하다).
  pick('desc', [['shopify', sp.desc], ['jsonld', ld.desc], ['dom', dom.desc.join('\n')], ['meta', mt.desc]]);
  // 글머리표: 본문 칸 → Shopify 본문 목록(본문 칸이 핏·관리법 칸까지 더 넓게 담는다).
  pick('feat', [['dom', dom.feat], ['shopify', sp.feat]]);
  pick('imgs', [['shopify', sp.imgs], ['jsonld', ld.imgs], ['meta', mt.imgs]]);
  pick('colors', [['shopify', sp.colors], ['jsonld', ld.colors]]);
  pick('sizes', [['shopify', sp.sizes], ['jsonld', ld.sizes]]);
  pick('sizesIn', [['shopify', sp.sizesIn], ['jsonld', ld.sizesIn]]);
  pick('sku', [['shopify', sp.sku], ['jsonld', ld.sku]]);
  pick('cur', [['jsonld', ld.cur], ['meta', mt.cur], ['shopify', sp.cur]]);
  pick('price', [['shopify', sp.price], ['jsonld', ld.price], ['meta', mt.price]]);
  pick('priceOrig', [['shopify', sp.priceOrig], ['jsonld', ld.priceOrig], ['meta', mt.priceOrig]]);
  pick('color', [['jsonld', ld.color], ['meta', mt.color], ['title', dtTitleColor(out.name || ld.name || sp.name, url)]]);
  if (out.desc) out.desc = dtClip(out.desc, DETAIL_CAP.desc);
  if (out.feat) out.feat = dtJoinLabels(out.feat);
  if (out.feat) {
    out.feat = dtUniq(out.feat.map((t) => dtClip(t.replace(/\s+/g, ' '), DETAIL_CAP.featLen)))
      .filter((t) => !dtJunk(t)).slice(0, DETAIL_CAP.feat);
    if (!out.feat.length) { delete out.feat; delete out.src.feat; }
  }
  if (out.name) out.name = dtClip(out.name, 200);
  if (out.color && out.color.length > 40) { delete out.color; delete out.src.color; }
  out.domKinds = dom.kinds;
  return out;
}
// ── 상품 상세(detail) 추출 끝

// ── 상세 가드 규칙 시작 — chrome-extension/background.js 에 글자 그대로 복사돼 있다(test-detail-guard 가 비교)
const DETAIL_GUARD = { DESC_MIN: 5, DESC_SHARE: 0.5, FEAT_MIN: 10, FEAT_SHARE: 0.8 };
const dgNorm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9가-힣%]+/g, ' ').trim();
// 같은 상품의 다른 색은 이름 꼬리만 다르다("The Box-Cut Tee | Peyote | No Pocket" · "Kim Tee - Navy") — 꼬리를 떼고 센다.
// (Everlane DRY 45607xxxxx: 박스컷 티 20색의 같은 설명을 '사이트 공통 문구'로 잘못 보류했다)
const dgName = (s) => dgNorm(String(s || '').split(/\s+[|\u2013\u2014]\s+|\s+-\s+/)[0])
  .replace(/\b(?:xs|s|m|l|xl|xxl|petite|tall|plus)\b/g, ' ').replace(/\s+/g, ' ').trim();

// stored·incoming: [{url, name, desc, feat}] (같은 상품은 이번 값으로 본다).
// 돌려주는 것: { holdDesc: Set(설명 정규화 키), dropFeat: Set(글머리표 정규화 키), stats }
function detailFlags(stored, incoming, rule = DETAIL_GUARD) {
  const inc = new Map();
  for (const p of incoming || []) if (p && p.url) inc.set(p.url, p);
  const all = [...(stored || []).filter((p) => p && p.url && !inc.has(p.url)), ...inc.values()];
  // 같은 이름(다른 색·다른 주소)의 상품은 한 상품으로 센다.
  const byName = new Map();
  for (const p of all) {
    const k = dgName(p.name) || p.url;
    const e = byName.get(k) || { desc: new Set(), feat: new Set() };
    if (p.desc) e.desc.add(dgNorm(p.desc));
    for (const f of p.feat || []) e.feat.add(dgNorm(f));
    byName.set(k, e);
  }
  const groups = [...byName.values()];
  const withDesc = groups.filter((g) => g.desc.size).length;
  const withFeat = groups.filter((g) => g.feat.size).length;
  const dc = new Map(), fc = new Map();
  for (const g of groups) {
    for (const d of g.desc) dc.set(d, (dc.get(d) || 0) + 1);
    for (const f of g.feat) fc.set(f, (fc.get(f) || 0) + 1);
  }
  const holdDesc = new Set(), dropFeat = new Set();
  for (const [k, n] of dc) if (k && n >= rule.DESC_MIN && n / Math.max(1, withDesc) >= rule.DESC_SHARE) holdDesc.add(k);
  for (const [k, n] of fc) if (k && n >= rule.FEAT_MIN && n / Math.max(1, withFeat) >= rule.FEAT_SHARE) dropFeat.add(k);
  return { holdDesc, dropFeat, stats: { products: groups.length, withDesc, withFeat } };
}

// 이번 값 하나에 가드를 적용한다. 무엇을 뺐는지 함께 돌려준다.
function detailApply(rec, flags) {
  const out = { ...rec };
  const why = [];
  if (out.desc && flags.holdDesc.has(dgNorm(out.desc))) { why.push('desc'); delete out.desc; }
  if (Array.isArray(out.feat) && out.feat.length) {
    const keep = out.feat.filter((f) => !flags.dropFeat.has(dgNorm(f)));
    if (keep.length !== out.feat.length) why.push('feat-' + (out.feat.length - keep.length));
    if (keep.length) out.feat = keep; else delete out.feat;
  }
  return { rec: out, why };
}

// 상세 저장값(detail:<site>, {상품URL: {desc, feat, imgs, colors, sku, cur, sizesIn, dt}})에 이번 값을 합친다.
// 이번에 읽은 값이 있으면 그 칸은 이번 값으로 바꾼다(가격·재고처럼 바뀌는 칸이 있다). 없으면 예전 값을 둔다.
// dt = 상세를 마지막으로 읽은 시각. 1,000개 상한(오버레이와 같게, 오래된 것부터 뺀다).
const DETAIL_FIELDS = ['desc', 'feat', 'imgs', 'colors', 'sku', 'cur', 'sizesIn'];
function mergeDetails(map, incoming, now) {
  const merged = { ...(map || {}) };
  let added = 0;
  for (const [url, rec] of Object.entries(incoming || {})) {
    const cur = { ...(merged[url] || {}) };
    let n = 0;
    for (const k of DETAIL_FIELDS) {
      const v = rec && rec[k];
      const has = Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== '';
      if (has) { if (JSON.stringify(cur[k]) !== JSON.stringify(v)) n++; cur[k] = v; }
    }
    cur.dt = now;
    merged[url] = cur;
    if (n) added++;
  }
  const keys = Object.keys(merged);
  if (keys.length > 1000) {
    keys.sort((a, z) => (merged[a].dt || 0) - (merged[z].dt || 0));
    for (const k of keys.slice(0, keys.length - 1000)) delete merged[k];
  }
  return { merged, added };
}
// ── 상세 가드 규칙 끝

// Massimo Dutti 형(소재가 페이지 JSON 에만) — compFromPartsJson 결과를 저장 형식 문자열로.
function partsComp(html, url) {
  const lines = [];
  for (const c of compFromPartsJson(html, url)) { const n = c.line || 0; (lines[n] = lines[n] || []).push(c.material + ' ' + c.percent + '%'); }
  return lines.filter(Boolean).map((l) => l.join(' / ')).join('\n');
}
// 상세 결과 → 저장할 칸만(빈 칸 뺌). scripts/detail-core.mjs 의 detailRecord 와 같은 규칙.
function detailRec(d) {
  const out = {};
  for (const k of DETAIL_FIELDS) { const v = d && d[k]; if (Array.isArray(v) ? v.length : v != null && String(v).trim()) out[k] = v; }
  return out;
}

async function enrichComps(g, cfg, manual, winId, stopAt) {
  const tok = cfg.token ? '&token=' + encodeURIComponent(cfg.token) : '';
  let cat;
  try { cat = await (await fetch(cfg.worker + '/?catalog=' + encodeURIComponent(g.site) + tok)).json(); }
  catch (e) { return 0; }
  // 채움 상태는 오버레이(comp:<site>) 기준이다 — 카탈로그 item 필드에는 더 이상
  // 혼용률·컬러가 실리지 않아, 그걸 보면 매 실행마다 전 상품을 다시 읽게 된다.
  //
  // 읽기에 실패하면 이 브랜드는 통째로 건너뛴다. 예전엔 빈 객체로 넘어갔는데,
  // 저장 단계가 그 빈 객체를 기준으로 병합해 통째로 덮어썼다 — 읽기 한 번 실패에
  // 브랜드의 누적 수집분이 전부 날아갔다.
  let overlay = null;
  for (let attempt = 0; attempt < 3 && overlay === null; attempt++) {
    try {
      const r = await fetch(cfg.worker + '/?comps=' + encodeURIComponent(g.site) + tok);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      if (j && typeof j === 'object' && !Array.isArray(j) && !j.error) overlay = j;
      else throw new Error('bad overlay');
    } catch (e) { if (attempt < 2) await sleep(2000); }
  }
  if (overlay === null) return 0;
  const now = Date.now();
  const RETRY_MS = 5 * 24 * 3600 * 1000;   // 값이 없던 상품은 5일 뒤에 다시 본다
  const val = (o, k) => { const t = String((o && o[k]) || '').trim(); return t.includes('[object Object]') ? '' : t; };
  const full = (p) => {
    const o = overlay[p.productUrl];
    if (!o) return false;
    if (val(o, 'comp') && val(o, 'color')) return true;
    // 쓰레기 값이 박힌 상품은 시도 시각과 무관하게 다시 읽는다.
    if (['comp', 'color'].some((k) => o[k] && !val(o, k))) return false;
    // 값이 없어도 최근에 시도했으면 넘긴다 — 안 그러면 컬러를 안 적는 사이트의
    // 상품을 매번 다시 읽느라 정작 손 안 댄 상품까지 차례가 안 온다.
    return o.t && now - o.t < RETRY_MS;
  };
  // 상품 상세 저장값 — 혼용률·컬러가 이미 찬 상품도 상세가 없으면 실행마다 DETAIL_PER_RUN 개씩 연다.
  // 못 읽으면 null(이번엔 상세 보강·저장을 하지 않는다).
  let dmap = null;
  try {
    const r = await fetch(cfg.worker + '/?details=' + encodeURIComponent(g.site) + tok);
    if (r.ok) { const j = await r.json(); if (j && typeof j === 'object' && !Array.isArray(j) && !j.error) dmap = j; }
  } catch (e) {}
  const todo0 = (cat.items || []).filter((p) => p && p.productUrl && !full(p)).slice(0, COMP_PER_RUN);
  const backfill = dmap ? (cat.items || []).filter((p) => p && p.productUrl && full(p) && val(overlay[p.productUrl], 'comp') && !dmap[p.productUrl])
    .slice(0, DETAIL_PER_RUN) : [];
  const todo = todo0.concat(backfill);
  if (!todo.length) return 0;
  const comps = {};
  const tabQueue = [];   // fetch 로는 막혀서 탭으로 다시 읽을 상품
  let done = 0;
  const one = async (p) => {
    if (!state.running) return;
    await waitAway(g.brand, manual);   // 상품 페이지 읽기도 자리를 비운 동안에만
    if (!state.running) return;
    try {
      const got = { comp: '', color: '', sizes: '', price: '', priceOrig: '', det: null };
      let shopPr = null;
      // Shopify 상품은 공개 JSON 이 훨씬 싸고 사이즈·컬러·가격이 구조화돼 있다.
      const m = p.productUrl.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
      if (m) {
        try {
          const j = await (await fetch(m[1] + '/products/' + m[2] + '.json')).json();
          const pr = j && j.product;
          if (pr) {
            got.comp = compFromText(String(pr.body_html || '').replace(/<[^>]+>/g, ' '));
            const opt = (want) => {
              const o = (pr.options || []).find((x) => new RegExp(want, 'i').test(String((x && x.name) || '')));
              return o && Array.isArray(o.values) ? o.values.map((v) => String(v).trim()).filter(Boolean) : [];
            };
            got.color = opt('^(colou?r|색상|컬러)$').slice(0, 4).join(' / ');
            got.sizes = opt('^(size|사이즈)$').slice(0, 30).join(', ');
            const vs = Array.isArray(pr.variants) ? pr.variants : [];
            const num = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : NaN; };
            const cur = vs.map((v) => num(v && v.price)).filter(Number.isFinite);
            const was = vs.map((v) => num(v && v.compare_at_price)).filter(Number.isFinite);
            const lo = cur.length ? Math.min(...cur) : NaN;
            const hi = was.length ? Math.max(...was) : NaN;
            if (Number.isFinite(lo)) got.price = '$' + lo;
            if (Number.isFinite(hi) && Number.isFinite(lo) && hi > lo) got.priceOrig = '$' + hi;
            shopPr = pr;
            got.det = detailRec(detailOf('', p.productUrl, pr));
          }
        } catch (e) {}
      }
      // 부족한 항목은 페이지 HTML(JSON-LD + 본문)에서 보강.
      let fetchBlocked = false;
      // 상세(설명·디테일 글머리표)는 페이지 본문 칸에만 있는 사이트가 많아, 없으면 페이지도 연다.
      const needDet = !(got.det && (got.det.desc || got.det.feat));
      if (!got.comp || !got.sizes || !got.color || !got.price || needDet) {
        let html = '';
        try {
          const resp = await fetch(p.productUrl, { credentials: 'omit' });
          html = await resp.text();
          if (!resp.ok || !realPage(html)) { fetchBlocked = true; html = ''; }
        } catch (e) { fetchBlocked = true; }
        if (html) {
          const bits = jsonLdBits(html);
          if (!got.color) got.color = bits.color || colorFromHtml(html);
          if (!got.sizes) got.sizes = bits.sizes;
          if (!got.price) got.price = bits.price;
          if (!got.priceOrig) got.priceOrig = bits.priceOrig;
          if (!got.comp) got.comp = compFromHtml(html);
          // 이 상품의 본문이 그려진 페이지일 때만 상세·JSON 속 소재를 믿는다.
          if (productRead(html, p.name || '')) {
            if (!got.comp) got.comp = partsComp(html, p.productUrl);
            const d = detailOf(html, p.productUrl, shopPr);
            got.det = detailRec(d);
            if (!got.sizes) got.sizes = (d.sizes || []).slice(0, 30).join(', ');
            if (!got.price) got.price = d.price || '';
            if (!got.priceOrig) got.priceOrig = d.priceOrig || '';
          }
        }
      }
      // fetch 가 막혀 혼용률을 못 얻었으면 탭으로 다시 읽을 차례를 기다린다.
      // 여기서 시도 시각을 찍으면 5일 동안 다시 안 보므로, 탭 순서가 안 온 상품은 비워 둔다.
      if (!got.comp && fetchBlocked) { tabQueue.push({ p, got }); }
      // 빈손이어도 넣는다 — 저장 단계에서 시도 시각만 찍혀 다음 실행이 건너뛴다.
      else comps[p.productUrl] = got;
    } catch (e) {}
    done++;
    if (done % 5 === 0 || done === todo.length) {
      state.current = g.brand + ' · 혼용률·컬러 ' + done + '/' + todo.length;
    }
    await sleep(400);   // 사이트 부담·차단 방지 텀
  };
  // 4개씩 동시에. 순차로 하면 상품 수천 개에 몇 시간이 걸린다.
  state.current = g.brand + ' · 혼용률·컬러 0/' + todo.length;
  let idx = 0;
  await Promise.all(Array.from({ length: Math.min(COMP_CONCURRENCY, todo.length) }, async () => {
    while (idx < todo.length && state.running) { const k = idx++; await one(todo[k]); }
  }));
  // fetch 로 막힌 상품을 탭으로 — 한 번에 하나씩(같은 사이트에 탭을 여럿 띄우면 차단을 부른다).
  let tabTried = 0, tabBlocked = 0, tabOk = 0;
  for (const { p, got } of tabQueue.slice(0, TAB_PER_RUN)) {
    if (!state.running || (stopAt && Date.now() >= stopAt)) break;
    if (tabTried >= TAB_GIVEUP && tabBlocked === tabTried) break;   // 탭으로도 전부 막힘 → 오늘은 접는다
    await waitAway(g.brand, manual);
    if (!state.running) break;
    state.current = g.brand + ' · 탭으로 혼용률 ' + (tabTried + 1) + '/' + Math.min(tabQueue.length, TAB_PER_RUN);
    const r = await readByTab(p.productUrl, winId, p.name);
    tabTried++;
    if (r.blocked) { tabBlocked++; continue; }   // 막힌 상품은 시도 시각을 찍지 않는다 — 다음에 다시
    for (const k of ['comp', 'color', 'sizes', 'price', 'priceOrig']) if (!got[k] && r[k]) got[k] = r[k];
    if (r.det) got.det = { ...(got.det || {}), ...r.det };
    if (got.comp) tabOk++;
    comps[p.productUrl] = got;
    await sleep(1500);   // 사이트 부담·차단 방지 텀
  }
  if (tabTried) {
    pushLog({ url: g.site, ok: tabOk > 0, count: tabOk,
      msg: `${g.brand} · 탭으로 혼용률 ${tabOk}/${tabTried}개` + (tabBlocked ? ` (막힘 ${tabBlocked})` : '') +
        (tabQueue.length > tabTried ? ` — 남은 ${tabQueue.length - tabTried}개는 다음 차례` : '') });
  }
  if (!Object.keys(comps).length) return 0;
  // 저장 직전 가드: 이번에 읽은 혼용률을 이 브랜드에 이미 저장된 값과 함께 보고, 브랜드 전체에 되풀이되는
  // 조각이면 혼용률만 빼고 저장한다(컬러·사이즈·가격·시도 시각은 남김). 몇 개를 뺐는지 로그에 남긴다.
  {
    const items = cat.items || [];
    const nameOf = new Map(items.map((p) => [p.productUrl, p.name || '']));
    const stored = items.map((p) => ({ url: p.productUrl, name: p.name || '',
      comp: String(p.comp || '').trim() || val(overlay[p.productUrl], 'comp') })).filter((x) => x.comp);
    const incoming = Object.entries(comps).map(([url, got]) => ({ url, name: nameOf.get(url) || '', comp: String((got && got.comp) || '').trim() }))
      .filter((x) => x.comp);
    const { held } = guardRun(stored, incoming);
    for (const url of held.keys()) comps[url] = { ...comps[url], comp: '' };
    if (held.size) {
      const f = [...held.values()][0];
      pushLog({ url: g.site, ok: true, count: 0,
        msg: `${g.brand} · 혼용률 ${held.size}개 보류 — 다른 상품에도 똑같이 되풀이되는 값(${flagText(f.flag)})` });
    }
  }
  // 병합은 여기서 하고 Worker 에는 완성본을 통째로 넘긴다 — Worker 가 병합하면
  // 항목이 많을 때 무료 플랜 CPU 한도(10ms)를 넘겨 저장 전에 죽는다.
  const merged = { ...overlay };
  let patched = 0;
  for (const [url, got] of Object.entries(comps)) {
    const cur = { ...(merged[url] || {}) };
    let n = 0;
    // 항목별로 옮긴다. 예전엔 객체 전체를 String() 해서 comp 칸에
    // '[object Object]' 가 들어가고 컬러·사이즈·가격은 통째로 버려졌다.
    for (const [k, max] of [['comp', 160], ['color', 80], ['sizes', 200], ['price', 40], ['priceOrig', 40]]) {
      const t = String((got && got[k]) || '').trim().slice(0, max);
      if (t && !t.includes('[object Object]') && !val(cur, k)) { cur[k] = t; n++; }
      else if (cur[k] && !val(cur, k)) delete cur[k];   // 예전에 저장된 쓰레기 값 정리
    }
    cur.t = now;
    merged[url] = cur;
    if (n) patched++;
  }
  const mk = Object.keys(merged);
  if (mk.length > 1000) for (const k of mk.slice(0, mk.length - 1000)) delete merged[k];
  let stored = 0;
  try {
    const r = await (await fetch(cfg.worker + '/?store=overlay&site=' + encodeURIComponent(g.site) + tok, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    })).json();
    stored = r.ok ? patched : 0;
  } catch (e) { stored = 0; }
  await storeDetails(g, cfg, cat.items || [], comps, dmap);
  return stored;
}

// 상품 상세 저장(detail:<site>). 저장값을 먼저 읽고 — 못 읽으면 저장하지 않는다(빈 값으로 덮어쓰지 않게) —
// 저장 직전 가드(브랜드 대부분에 똑같이 붙은 설명·글머리표 빼기) 뒤 합쳐 통째로 넘긴다(Worker 는 파싱하지 않는다).
async function storeDetails(g, cfg, items, comps, map) {
  const tok = cfg.token ? '&token=' + encodeURIComponent(cfg.token) : '';
  const inc = {};
  for (const [url, got] of Object.entries(comps)) if (got && got.det) inc[url] = got.det;
  if (!Object.keys(inc).length || !map) return 0;
  const nameOf = new Map(items.map((p) => [p.productUrl, p.name || '']));
  const flags = detailFlags(Object.entries(map).map(([url, d]) => ({ url, name: nameOf.get(url) || '', desc: d && d.desc, feat: d && d.feat })),
    Object.entries(inc).map(([url, d]) => ({ url, name: nameOf.get(url) || '', desc: d.desc, feat: d.feat })));
  const clean = {};
  for (const [url, d] of Object.entries(inc)) clean[url] = detailApply(d, flags).rec;
  const { merged, added } = mergeDetails(map, clean, Date.now());
  try {
    const r = await (await fetch(cfg.worker + '/?store=details&site=' + encodeURIComponent(g.site) + tok, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(merged),
    })).json();
    if (r.ok && added) pushLog({ url: g.site, ok: true, count: added, msg: `${g.brand} · 상품 상세(설명·디테일·사진) ${added}개` });
    return r.ok ? added : 0;
  } catch (e) { return 0; }
}

// manual = 사람이 팝업에서 직접 누른 실행. 버튼 이름이 "지금 전체 실행"인데
// 자리를 비울 때까지 아무 일도 안 일어나면 고장으로 보인다 — 실제로 그렇게 보였다.
// 직접 누른 것은 그 자체가 "지금 해라"는 뜻이므로 자리 확인을 건너뛴다.
// 예약 실행은 그대로 자리를 비운 뒤에만 돈다.
async function collect(input, manual) {
  if (state.running) return;
  const cfg = await getCfg();
  const { visible, maxPages } = await getSched();
  let groups = asGroups(input);
  // 순서는 buildTargets 가 '오래 안 본 브랜드부터'로 정해 온다. 그래서 아침에
  // 시간이 모자라 남기고 멈춰도, 다음 밤에는 그 남은 브랜드가 가장 낡아 있어
  // 자연히 맨 앞으로 온다 — 따로 위치를 기억할 필요가 없다.
  const stopAt = deadlineFrom(Date.now());
  const totalUrls = groups.reduce((s, g) => s + g.urls.length, 0);
  let okCount = 0, failCount = 0;
  // 표시 모드: 전용 창 하나를 만들어 거기서 탭을 돌린다(사용자 작업창을 건드리지 않음).
  // 숨은 탭은 크롬이 타이머를 늦춰(throttling) 레이지 로딩·봇 챌린지 통과율이 떨어진다.
  // 상태를 먼저 새로 세운다. 기다리는 동안 팝업이 폴링하는데, 지난 실행의 진행률과
  // 로그가 남아 있으면 이번 수집이 벌써 절반쯤 돈 것처럼 보인다.
  // running 을 여기서 켜는 이유는 waitAway·중지 버튼이 이 값을 보기 때문이다.
  state = { running: true, done: 0, total: totalUrls, current: '시작 대기', log: [], startedAt: Date.now(), items: 0 };
  keepAlive(true);
  // 창부터 띄우지 않는다 — 일하는 중이면 자리를 비울 때까지 조용히 기다린다.
  await waitAway('', manual);
  if (!state.running) { keepAlive(false); return; }
  let winId = null;
  if (visible) {
    try {
      // focused: false — 수집 창이 사용자가 하던 일을 가로채지 않게 뒤에서 뜬다.
      // (최소화하면 크롬이 탭을 가려진 것으로 보고 타이머를 늦춰 수집률이 떨어진다.
      //  그래서 '뒤에 떠 있는 창'까지가 한계다.)
      const w = await chrome.windows.create({ url: 'about:blank', focused: false, width: 1280, height: 900 });
      winId = w.id;
    } catch (e) {}
  }
  // 실제 수집이 시작되는 지점 — 기다린 시간은 소요 시간에 넣지 않는다.
  state.startedAt = Date.now();
  state.current = '';
  let stopped = 0;
  for (const g of groups) {
    if (!state.running) break;
    // 마감을 넘겼으면 다음 브랜드로 넘어가지 않는다. 남은 브랜드는 내일 밤
    // 여기서부터 이어서 한다(위 순환).
    if (Date.now() >= stopAt) {
      stopped = groups.length - groups.indexOf(g);
      pushLog({ url: '', ok: true, count: 0,
        msg: `${hhmm(stopAt)} 마감 — 남은 ${stopped}개 브랜드는 내일 밤 이어서(오래된 순)` });
      break;
    }
    // 한 브랜드의 모든 카테고리 URL을 먼저 모은 뒤, 브랜드 단위로 한 번만 저장한다.
    const brandItems = new Map();
    // 지난밤 이 브랜드를 하다 멈췄으면, 끝낸 카테고리는 건너뛰고 그다음부터 한다.
    // (브랜드 하나가 카테고리 열 개짜리면 통째로 다시 하는 건 밤 하나를 버리는 일이다)
    let doneUrls = new Set();
    try {
      const { progress } = await chrome.storage.local.get(['progress']);
      if (progress && progress.site === g.site) doneUrls = new Set(progress.doneUrls || []);
    } catch (e) {}
    if (doneUrls.size) {
      pushLog({ url: g.site, ok: true, count: 0,
        msg: `${g.brand} · 지난밤 ${doneUrls.size}개 카테고리까지 했음 — 그다음부터` });
    }
    let brandStopped = false;
    // 카테고리 URL 자체가 상품으로 잡히는 것을 막는다(목록 상단의 하위 카테고리 타일).
    const normUrl = (u) => String(u || '').split('?')[0].replace(/\/+$/, '');
    const listing = new Set(g.urls.map(normUrl));
    for (const url of g.urls) {
      if (!state.running) break;
      if (doneUrls.has(url)) continue;   // 지난밤에 끝낸 카테고리
      // 카테고리 하나를 시작하기 전에 마감을 본다. 시작해 놓고 중간에 끊기면
      // 그 카테고리는 반쪽만 긁힌 채 저장된다.
      if (Date.now() >= stopAt) { brandStopped = true; break; }
      await waitAway(g.brand, manual);
      if (!state.running) break;
      state.current = g.brand + ' · ' + url;
      let tab = null;
      try {
        tab = winId
          ? await chrome.tabs.create({ url, active: true, windowId: winId })
          : await chrome.tabs.create({ url, active: false });
        // 카테고리의 모든 페이지를 순회: 같은 탭을 다음 페이지로 이동시키며 누적.
        // 새 상품이 하나도 안 늘면(같은 페이지 반복/마지막 페이지) 중단.
        const byUrl = new Map();
        // 허브 페이지(상품 대신 하위 카테고리 타일만 있는 곳) 대응 큐.
        const queue = [url];
        let hubFollowed = 0;
        let pageUrl = queue.shift(), pages = 0;
        while (pageUrl && pages < maxPages && byUrl.size < PER_CATEGORY) {
          if (pages > 0) {
            await waitAway(g.brand, manual);   // 페이지를 넘기기 직전마다 자리 확인
            if (!state.running) break;
            await chrome.tabs.update(tab.id, { url: pageUrl });
          }
          await waitForComplete(tab.id, 45000);
          await sleep(visible ? 2500 : 1800);   // Akamai/JS 챌린지·초기 렌더 여유
          const inj = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: pageCollector });
          const res = (inj && inj[0] && inj[0].result) || {};
          const pageItems = res.items || [];
          let added = 0;
          for (const it of pageItems) {
            if (!it || !it.productUrl || listing.has(normUrl(it.productUrl))) continue;
            // src = 출처 카테고리 URL. 나중에 잘못 잡힌 항목이 어느 페이지에서 왔는지 추적한다.
            if (!byUrl.has(it.productUrl)) { byUrl.set(it.productUrl, { ...it, src: url }); added++; }
          }
          pages++;
          state.current = g.brand + ' · ' + url + (pages > 1 ? ` (p${pages})` : '');
          // 상품이 거의 없고 하위 카테고리 타일만 있으면 허브 페이지다 → 한 단계 내려간다.
          if (byUrl.size < 20 && !hubFollowed && (res.subCats || []).length) {
            for (const sc of res.subCats.slice(0, 4)) if (!queue.includes(sc)) queue.push(sc);
            hubFollowed = 1;
          }
          const next = res.nextUrl && res.nextUrl !== pageUrl ? res.nextUrl : '';
          pageUrl = (added && next) ? next : (queue.shift() || '');
          if (pageUrl) await sleep(900);           // 페이지 넘김 텀
        }
        // 카테고리당 상한(앱 표시 상한 100 + 재분류 여유). 브랜드 합계는 Worker 저장 상한 이하로.
        let n = 0;
        for (const it of byUrl.values()) {
          if (n++ >= PER_CATEGORY) break;
          if (!brandItems.has(it.productUrl)) brandItems.set(it.productUrl, it);
        }
        pushLog({
          url, ok: byUrl.size > 0, count: byUrl.size,
          msg: byUrl.size ? `${g.brand} · ${byUrl.size}개 수집(${pages}p)` : `${g.brand} · 상품 못 찾음(차단/비목록 페이지?)`,
        });
      } catch (e) {
        pushLog({ url, ok: false, count: 0, msg: '오류: ' + String((e && e.message) || e) });
      } finally {
        if (tab) { try { await chrome.tabs.remove(tab.id); } catch (e) {} }
        state.done++;
      }
      doneUrls.add(url);   // 이 카테고리는 끝났다 — 중간에 멈춰도 다시 하지 않는다
      await sleep(1500);   // 사이트 부담·차단 방지 텀
    }

    // 브랜드 단위 저장.
    // 카테고리를 다 돌았으면 replace=1 로 통째로 교체한다(품절 상품 누적 방지).
    // 마감에 걸려 일부만 돌았으면 절대 교체하면 안 된다 — 안 본 카테고리의 상품이
    // 전부 사라진다. 그때는 병합으로 넣어 오늘 본 만큼만 더한다.
    const items = [...brandItems.values()].slice(0, MAX_PER_BRAND);
    const partial = brandStopped;
    if (items.length) {
      try {
        // legacy=<호스트>: 예전 버전이 호스트만으로 저장해 둔 옛 키를 함께 지운다
        // (안 지우면 Free People/FP Movement가 섞인 옛 데이터가 검색에 먼저 걸림).
        const legacy = g.site.slice(0, g.site.lastIndexOf('.'));
        const resp = await fetch(
          cfg.worker + '/?store=catalog' + (partial ? '' : '&replace=1') +
            '&legacy=' + encodeURIComponent(legacy) +
            (cfg.token ? '&token=' + encodeURIComponent(cfg.token) : ''),
          {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ site: g.site, brand: g.brand, items }),
          },
        );
        const d = await resp.json().catch(() => ({}));
        if (d.ok) okCount++; else failCount++;
        state.items += d.ok ? items.length : 0;
        if (d.ok) {
          const patched = await enrichComps(g, cfg, manual, winId, stopAt);
          if (patched) pushLog({ url: g.site, ok: true, count: patched, msg: `${g.brand} · 혼용률 ${patched}개 채움` });
        }
        pushLog({
          url: g.site, ok: !!d.ok, count: d.ok ? d.count : 0,
          msg: d.ok
            ? (d.guarded
              // 수집량이 절반 아래로 떨어져 Worker 가 갈아끼우기를 막았다.
              // 오늘 못 본 상품을 지우지 않은 것이므로 실패가 아니라 보호다.
              ? `${g.brand} · 수집 ${d.guarded.got}개(이전 ${d.guarded.kept}개) — 급감이라 덮어쓰지 않고 병합, 총 ${d.count}개`
              : (partial
                ? `${g.brand} · ${items.length}개 부분 저장(카테고리 ${doneUrls.size}/${g.urls.length}) — 나머지는 내일 밤`
                : `${g.brand} · ${items.length}개 저장`))
            : `${g.brand} 전송실패 ` + (d.error || resp.status),
        });
      } catch (e) {
        failCount++;
        pushLog({ url: g.site, ok: false, count: 0, msg: `${g.brand} 전송오류: ` + String((e && e.message) || e) });
      }
    } else if (!partial) {
      failCount++;
      pushLog({ url: g.site, ok: false, count: 0, msg: `${g.brand} · 수집 0개(저장 안 함 — 이전 저장본 유지)` });
    }

    // 어디까지 했는지 남긴다. 다 돌았으면 지워서 내일은 처음부터 하게 한다.
    try {
      if (partial) await chrome.storage.local.set({ progress: { site: g.site, doneUrls: [...doneUrls] } });
      else await chrome.storage.local.remove('progress');
    } catch (e) {}

    if (partial) {
      stopped = groups.length - groups.indexOf(g);
      pushLog({ url: '', ok: true, count: 0,
        msg: `${hhmm(stopAt)} 마감 — ${g.brand} 카테고리 ${doneUrls.size}/${g.urls.length} 까지. ` +
          `남은 ${stopped}개 브랜드는 내일 밤 이어서` });
      break;
    }
  }
  if (winId) { try { await chrome.windows.remove(winId); } catch (e) {} }
  keepAlive(false);
  state.running = false;
  state.current = '';
  // 팝업이 "마지막 실행" 요약을 보여줄 수 있도록 저장(서비스워커가 잠들어도 유지).
  const tookMs = Date.now() - state.startedAt;
  await chrome.storage.local.set({
    lastRun: {
      when: Date.now(), ok: okCount, fail: failCount, total: groups.length, urls: totalUrls, stopped,
      // 실측 소요 시간과 완주 여부. 다음 밤에 시간이 모자랄지 추측하지 않고
      // 지난밤 기록으로 판단하기 위한 값이다.
      tookMs, full: stopped === 0, deadline: hhmm(stopAt),
    },
  });
  pushLog({ url: '', ok: stopped === 0, count: 0,
    msg: stopped === 0
      ? `한 바퀴 완료 — 브랜드 ${groups.length}개 · ${dur(tookMs)} 걸림`
      : `${groups.length - stopped}/${groups.length}개까지 · ${dur(tookMs)} 걸림 · 남은 ${stopped}개는 내일 밤` });
}

// 임의의 페이지 URL → 그 페이지가 속한 브랜드와 저장 키.
// 한 호스트에 브랜드가 여럿이면(freepeople.com) 카테고리 링크가 가장 길게 겹치는 쪽을 고른다.
async function resolveBrand(pageUrl, cfg) {
  let host = 'brand';
  try { host = new URL(pageUrl).hostname.replace(/^www\./, ''); } catch (e) {}
  try {
    const groups = await buildTargets();
    const sameHost = groups.filter((g) => g.site.startsWith(host + '.'));
    if (sameHost.length === 1) return { brand: sameHost[0].brand, site: sameHost[0].site };
    if (sameHost.length > 1) {
      let best = sameHost[0], bestLen = -1;
      for (const g of sameHost) {
        for (const u of g.urls) {
          let n = 0;
          while (n < u.length && n < pageUrl.length && u[n] === pageUrl[n]) n++;
          if (n > bestLen) { bestLen = n; best = g; }
        }
      }
      return { brand: best.brand, site: best.site };
    }
  } catch (e) {}
  // 목록에 없는 사이트 — 호스트 기준으로만 저장(프리페치 키와 겹치지 않게 슬러그를 붙임).
  const slug = host.split('.')[0];
  return { brand: slug, site: siteKeyOf(slug, pageUrl) };
}

// 지금 보고 있는 활성 탭을 바로 수집(제일 확실 — 이미 렌더된 실제 페이지).
async function collectActive() {
  const cfg = await getCfg();
  let tab;
  try { [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); } catch (e) {}
  if (!tab || !/^https?:/.test(tab.url || '')) return { ok: false, msg: '현재 탭이 웹페이지가 아닙니다.' };
  try {
    const inj = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: pageCollector });
    const items = ((inj && inj[0] && inj[0].result) || {}).items || [];
    if (!items.length) return { ok: false, msg: '상품을 못 찾았습니다(상품 목록 페이지인지 확인).' };
    // 브랜드 이름을 서버 목록에서 찾아 정식 키로 저장한다.
    // (호스트만으로 만들면 shop.lululemon.com → brand "shop" 처럼 엉뚱한 이름이 남고,
    //  freepeople.com 처럼 한 도메인의 두 브랜드가 서로를 덮어쓴다.)
    const { brand, site } = await resolveBrand(tab.url, cfg);
    const resp = await fetch(cfg.worker + '/?store=catalog' + (cfg.token ? '&token=' + encodeURIComponent(cfg.token) : ''), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ site, brand, items }),
    });
    const d = await resp.json().catch(() => ({}));
    const msg = d.ok
      ? (brand + ' · 이 페이지 ' + (d.added != null ? d.added : d.count) + '개 → 저장소 총 ' + d.count + '개')
      : ('전송 실패 ' + (d.error || resp.status));
    // site·brand 는 팝업의 '수집한 브랜드 리서치에서 보기'(#site=)에 쓴다.
    return { ok: !!d.ok, count: d.ok ? d.count : 0, msg, site, brand };
  } catch (e) { return { ok: false, msg: '오류: ' + String((e && e.message) || e) }; }
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type === 'collectActive') { collectActive().then(reply); return true; }
  if (msg.type === 'getSched') {
    (async () => {
      const s = await getSched();
      const a = await chrome.alarms.get(ALARM);
      reply({ ...s, nextRun: a ? a.scheduledTime : 0 });
    })();
    return true;
  }
  if (msg.type === 'setSched') {
    (async () => {
      await chrome.storage.local.set({
        schedOn: !!msg.schedOn,
        schedHour: Math.min(Math.max(Number(msg.schedHour) || 0, 0), 23),
        schedMin: Math.min(Math.max(Number(msg.schedMin) || 0, 0), 59),
        visible: msg.visible !== false,
        // 체크박스를 끄면 실제로 꺼져야 한다. 여기서 빠뜨리면 팝업이 보내도
        // 저장이 안 돼, 껐다가 팝업을 다시 열면 도로 켜져 있다(그랬다).
        idleOnly: msg.idleOnly !== false,
        maxPages: Math.min(Math.max(Number(msg.maxPages) || 20, 1), 100),
      });
      await applySchedule();
      const a = await chrome.alarms.get(ALARM);
      reply({ ok: true, nextRun: a ? a.scheduledTime : 0 });
    })();
    return true;
  }
  if (msg.type === 'runNow') {
    (async () => {
      try {
        const groups = await buildTargets();
        if (!groups.length) { reply({ ok: false, msg: '대상 URL을 받지 못했습니다.' }); return; }
        collect(groups, true);   // 사람이 직접 누른 것 — 자리 확인 없이 바로 시작.
        reply({ ok: true, total: groups.reduce((s, g) => s + g.urls.length, 0), brands: groups.length });
      } catch (e) {
        reply({ ok: false, msg: '목록 로드 실패: ' + String((e && e.message) || e) });
      }
    })();
    return true;
  }
  if (msg.type === 'start') { collect(msg.urls || [], true); reply({ ok: true }); return; }
  if (msg.type === 'stop') { state.running = false; keepAlive(false); reply({ ok: true }); return; }
  if (msg.type === 'state') { reply(state); return; }
  if (msg.type === 'getCfg') { getCfg().then(reply); return true; }
  if (msg.type === 'setCfg') {
    chrome.storage.local.set({ worker: msg.worker || '', token: msg.token || '' }).then(() => reply({ ok: true }));
    return true;
  }
});
