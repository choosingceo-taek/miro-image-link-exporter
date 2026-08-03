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
  const s = await chrome.storage.local.get(['schedOn', 'schedHour', 'schedMin', 'visible', 'maxPages', 'lastRun']);
  return {
    schedOn: !!s.schedOn,
    schedHour: Number.isInteger(s.schedHour) ? s.schedHour : 8,   // 기본 08:00
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
  폴리에스테르: 'Polyester', 나일론: 'Nylon', 스판덱스: 'Elastane', 레이온: 'Viscose',
  모달: 'Modal', 리넨: 'Linen', 실크: 'Silk', 캐시미어: 'Cashmere', 아크릴: 'Acrylic',
  비스코스: 'Viscose', 텐셀: 'Lyocell', 라이오셀: 'Lyocell',
};
const FIBRE_ALT = Object.keys(FIBRES)
  .sort((a, z) => z.length - a.length)
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
const COMP_RX = new RegExp(
  '(\\d{1,3})\\s*%\\s*(?:of\\s+)?(' + FIBRE_ALT + ')(?![A-Za-z])' +
  '|(?<![A-Za-z])(' + FIBRE_ALT + ')\\s*[::]?\\s*(\\d{1,3})\\s*%', 'gi');
function compFromText(text) {
  const out = [];
  const seen = new Set();
  for (const m of String(text || '').slice(0, 16000).matchAll(COMP_RX)) {
    const pct = Number(m[1] || m[4]);
    const key = String(m[2] || m[3] || '').toLowerCase().trim();
    const material = FIBRES[key];
    if (!material || !Number.isFinite(pct) || pct <= 0 || pct > 100) continue;
    if (seen.has(material)) continue;
    seen.add(material);
    out.push(material + ' ' + pct + '%');
    if (out.length >= 8) break;
  }
  const total = out.reduce((n, c) => n + Number(c.match(/(\d+)%/)[1]), 0);
  if (!out.length || total > 210) return '';
  return out.join(' / ');
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

// 브랜드 저장 후: 네 항목(혼용률·컬러·사이즈·가격)이 빈 상품의 페이지를 서비스워커 fetch 로 읽어 채운다.
// 확장은 실사용 PC(주거용 IP)라 서버가 못 여는 봇 차단 사이트도 열린다 — 이 브랜드들의
// 혼용률은 여기서만 나온다. 탭을 열지 않고 fetch 만 하므로 페이지당 1~2초.
// 한 번 채운 값은 Worker 가 계속 승계하므로 매일 조금씩 하면 결국 다 찬다.
// 실행당 브랜드 상한. 1.7.0 은 80이라 다 채우는 데 며칠이 걸렸다 —
// 한 번 실행으로 끝내려고 상한을 사실상 없애고(브랜드 저장 상한과 같은 값)
// 순차 처리를 4개 동시로 바꿨다. 대신 실행 시간이 브랜드당 몇 분씩 늘어난다.
const COMP_PER_RUN = MAX_PER_BRAND;
const COMP_CONCURRENCY = 4;
async function enrichComps(g, cfg) {
  const tok = cfg.token ? '&token=' + encodeURIComponent(cfg.token) : '';
  let cat;
  try { cat = await (await fetch(cfg.worker + '/?catalog=' + encodeURIComponent(g.site) + tok)).json(); }
  catch (e) { return 0; }
  const full = (p) => p.comp && p.color && p.sizes && p.price;
  const todo = (cat.items || []).filter((p) => p && !full(p) && p.productUrl).slice(0, COMP_PER_RUN);
  if (!todo.length) return 0;
  const comps = {};
  let done = 0;
  const one = async (p) => {
    if (!state.running) return;
    try {
      const got = { comp: '', color: '', sizes: '', price: '', priceOrig: '' };
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
            const now = vs.map((v) => num(v && v.price)).filter(Number.isFinite);
            const was = vs.map((v) => num(v && v.compare_at_price)).filter(Number.isFinite);
            const lo = now.length ? Math.min(...now) : NaN;
            const hi = was.length ? Math.max(...was) : NaN;
            if (Number.isFinite(lo)) got.price = '$' + lo;
            if (Number.isFinite(hi) && Number.isFinite(lo) && hi > lo) got.priceOrig = '$' + hi;
          }
        } catch (e) {}
      }
      // 부족한 항목은 페이지 HTML(JSON-LD + 본문)에서 보강.
      if (!got.comp || !got.sizes || !got.color || !got.price) {
        const html = await (await fetch(p.productUrl, { credentials: 'omit' })).text();
        const bits = jsonLdBits(html);
        if (!got.color) got.color = bits.color;
        if (!got.sizes) got.sizes = bits.sizes;
        if (!got.price) got.price = bits.price;
        if (!got.priceOrig) got.priceOrig = bits.priceOrig;
        if (!got.comp) {
          got.comp = compFromText(
            html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
        }
      }
      if (got.comp || got.color || got.sizes || got.price) comps[p.productUrl] = got;
    } catch (e) {}
    done++;
    if (done % 5 === 0 || done === todo.length) {
      state.current = g.brand + ' · 혼용률 ' + done + '/' + todo.length;
    }
    await sleep(400);   // 사이트 부담·차단 방지 텀
  };
  // 4개씩 동시에. 순차로 하면 상품 수천 개에 몇 시간이 걸린다.
  state.current = g.brand + ' · 혼용률 0/' + todo.length;
  let idx = 0;
  await Promise.all(Array.from({ length: Math.min(COMP_CONCURRENCY, todo.length) }, async () => {
    while (idx < todo.length && state.running) { const k = idx++; await one(todo[k]); }
  }));
  if (!Object.keys(comps).length) return 0;
  try {
    const r = await (await fetch(cfg.worker + '/?store=comps' + tok, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: g.site, comps }),
    })).json();
    return r.patched || 0;
  } catch (e) { return 0; }
}

async function collect(input) {
  if (state.running) return;
  const cfg = await getCfg();
  const { visible, maxPages } = await getSched();
  const groups = asGroups(input);
  const totalUrls = groups.reduce((s, g) => s + g.urls.length, 0);
  let okCount = 0, failCount = 0;
  // 표시 모드: 전용 창 하나를 만들어 거기서 탭을 돌린다(사용자 작업창을 건드리지 않음).
  // 숨은 탭은 크롬이 타이머를 늦춰(throttling) 레이지 로딩·봇 챌린지 통과율이 떨어진다.
  let winId = null;
  if (visible) {
    try {
      const w = await chrome.windows.create({ url: 'about:blank', focused: true, width: 1280, height: 900 });
      winId = w.id;
    } catch (e) {}
  }
  state = { running: true, done: 0, total: totalUrls, current: '', log: [], startedAt: Date.now(), items: 0 };
  keepAlive(true);
  for (const g of groups) {
    if (!state.running) break;
    // 한 브랜드의 모든 카테고리 URL을 먼저 모은 뒤, 브랜드 단위로 한 번만 저장한다.
    const brandItems = new Map();
    // 카테고리 URL 자체가 상품으로 잡히는 것을 막는다(목록 상단의 하위 카테고리 타일).
    const normUrl = (u) => String(u || '').split('?')[0].replace(/\/+$/, '');
    const listing = new Set(g.urls.map(normUrl));
    for (const url of g.urls) {
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
      await sleep(1500);   // 사이트 부담·차단 방지 텀
    }

    // 브랜드 단위 저장 — replace=1로 어제 수집본을 통째로 교체(오래된 품절 상품 누적 방지).
    const items = [...brandItems.values()].slice(0, MAX_PER_BRAND);
    if (items.length) {
      try {
        // legacy=<호스트>: 예전 버전이 호스트만으로 저장해 둔 옛 키를 함께 지운다
        // (안 지우면 Free People/FP Movement가 섞인 옛 데이터가 검색에 먼저 걸림).
        const legacy = g.site.slice(0, g.site.lastIndexOf('.'));
        const resp = await fetch(
          cfg.worker + '/?store=catalog&replace=1&legacy=' + encodeURIComponent(legacy) +
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
          const patched = await enrichComps(g, cfg);
          if (patched) pushLog({ url: g.site, ok: true, count: patched, msg: `${g.brand} · 혼용률 ${patched}개 채움` });
        }
        pushLog({
          url: g.site, ok: !!d.ok, count: d.ok ? d.count : 0,
          msg: d.ok ? `${g.brand} · ${items.length}개 저장` : `${g.brand} 전송실패 ` + (d.error || resp.status),
        });
      } catch (e) {
        failCount++;
        pushLog({ url: g.site, ok: false, count: 0, msg: `${g.brand} 전송오류: ` + String((e && e.message) || e) });
      }
    } else {
      failCount++;
      pushLog({ url: g.site, ok: false, count: 0, msg: `${g.brand} · 수집 0개(저장 안 함 — 이전 저장본 유지)` });
    }
  }
  if (winId) { try { await chrome.windows.remove(winId); } catch (e) {} }
  keepAlive(false);
  state.running = false;
  state.current = '';
  // 팝업이 "마지막 실행" 요약을 보여줄 수 있도록 저장(서비스워커가 잠들어도 유지).
  await chrome.storage.local.set({
    lastRun: { when: Date.now(), ok: okCount, fail: failCount, total: groups.length, urls: totalUrls },
  });
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
    return { ok: !!d.ok, count: d.ok ? d.count : 0, msg };
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
        collect(groups);   // 기다리지 않고 시작 — 진행상황은 state 폴링으로.
        reply({ ok: true, total: groups.reduce((s, g) => s + g.urls.length, 0), brands: groups.length });
      } catch (e) {
        reply({ ok: false, msg: '목록 로드 실패: ' + String((e && e.message) || e) });
      }
    })();
    return true;
  }
  if (msg.type === 'start') { collect(msg.urls || []); reply({ ok: true }); return; }
  if (msg.type === 'stop') { state.running = false; keepAlive(false); reply({ ok: true }); return; }
  if (msg.type === 'state') { reply(state); return; }
  if (msg.type === 'getCfg') { getCfg().then(reply); return true; }
  if (msg.type === 'setCfg') {
    chrome.storage.local.set({ worker: msg.worker || '', token: msg.token || '' }).then(() => reply({ ok: true }));
    return true;
  }
});
