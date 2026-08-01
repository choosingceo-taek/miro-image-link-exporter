// RACK 상품 수집기 — 백그라운드 오케스트레이션 (MV3 service worker)
// URL 목록을 하나씩 백그라운드 탭으로 열어 렌더링(=Akamai 통과) → 자동 스크롤·수집 →
// 기존 RACK Worker(KV)로 전송 → 탭 닫고 다음. 진행상황은 state에 쌓아 팝업이 폴링.

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

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM) return;
  try {
    const urls = await buildTargets();
    if (urls.length) await collect(urls);
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

// 페이지 컨텍스트에서 실행되는 수집기 (완전 self-contained: 자동 스크롤 후 상품 배열 반환)
async function pageCollector() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const guessCategory = (u, name) => {
    const n = ' ' + String(name || '').toLowerCase() + ' ';
    const url = ' ' + String(u || '').toLowerCase() + ' ';
    const nHas = (re) => re.test(n);
    if (nHas(/dress|gown|jumpsuit|romper|원피스|점프수트/) && !nHas(/(?<!t[-\s])shirt[-\s]?dress/)) return 'dresses';
    if (nHas(/pants?\b|trouser|chino|legging|jogger|slack|culotte|capri|skorts?\b|skirts?\b|\bshorts\b|바지|팬츠|슬랙스|청바지|쇼츠|반바지|레깅스|조거|스커트|치마/) || nHas(/\b(?:jeans?|denim)\b(?!\s?(?:jacket|shirt|blouse|dress|skirt|vest|coat|top))/)) return 'pants';
    if (nHas(/sweat|hoodie|hoody|jumper|cardigan|knit(?!\s?(?:tank|tee|cami|top))|sweater|맨투맨|후드|니트|가디건|스웨터/)) return 'sweatshirts';
    if (nHas(/t[-\s]?shirt|tees?\b|tank|cami|camisole|halter|bodysuit|crop\s*top|티셔츠|나시|캐미|홀터/)) return 'tops';
    if (nHas(/shirt|blouse|button[-\s]?down|oxford|셔츠|블라우스|남방/)) return 'shirts';
    if (nHas(/\btop\b|탑/)) return 'tops';
    if (/dress|원피스/.test(url)) return 'dresses';
    if (/pants?\b|trouser|jeans?\b|denim|chino|legging|jogger|shorts?\b|skirts?\b|skorts?\b|바지|팬츠/.test(url)) return 'pants';
    if (/sweat|hoodie|knit|cardigan|맨투맨|후드|니트/.test(url)) return 'sweatshirts';
    if (/shirt|blouse|셔츠|블라우스/.test(url)) return 'shirts';
    return 'tops';
  };
  const bestImage = (el) => {
    if (!el) return '';
    const pick = (img) => {
      if (!img) return '';
      let src = img.currentSrc || img.getAttribute('src') || img.getAttribute('data-src') ||
                img.getAttribute('data-lazy') || img.getAttribute('data-original') || '';
      if (!/^https?:/.test(src) || /\.svg(\?|#|$)/i.test(src) || /placeholder|blank|spacer|1x1/i.test(src)) {
        const ss = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
        const m = ss.match(/https?:\/\/[^\s,]+/g);
        if (m && m.length) src = m[m.length - 1];
      }
      return /^https?:/.test(src) ? src : '';
    };
    let src = pick(el.querySelector('img'));
    if (!src) {
      const s = el.querySelector('source[srcset], source[data-srcset]');
      if (s) { const m = (s.getAttribute('srcset') || s.getAttribute('data-srcset') || '').match(/https?:\/\/[^\s,]+/g); if (m) src = m[m.length - 1]; }
    }
    if (!src) {
      const bgEl = el.querySelector('[style*="background-image"]') || el;
      const bg = ((bgEl.getAttribute && bgEl.getAttribute('style')) || '').match(/url\(["']?(https?:\/\/[^"')]+)/i);
      if (bg) src = bg[1];
    }
    return src || '';
  };
  const harvest = () => {
    const seen = new Set(), items = [];
    document.querySelectorAll('a[href]').forEach((a) => {
      let href; try { href = new URL(a.href, location.href); } catch (e) { return; }
      if (!/^https?:/.test(href.protocol)) return;
      const card = a.closest('article,li,[class*="card"],[class*="product"],[class*="tile"],[class*="item"],div') || a;
      const src = bestImage(a) || bestImage(card);
      if (!/^https?:/.test(src)) return;
      const img = a.querySelector('img') || card.querySelector('img');
      if (img && img.naturalWidth && img.naturalWidth < 100) return;
      const path = href.pathname.replace(/\/+$/, '');
      if (path.length < 8) return;
      const key = href.origin + path;
      if (seen.has(key)) return;
      seen.add(key);
      const nameEl = card.querySelector('h1,h2,h3,h4,[class*="name"],[class*="title"],[class*="Name"],[class*="Title"]');
      const name = ((img && img.alt) || (nameEl && nameEl.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 150);
      const priceM = (card.textContent || '').match(/(?:[$€£₩¥]|\bUSD|\bEUR|\bKRW)\s?\d[\d.,]*/);
      items.push({
        name: name || decodeURIComponent(path.split('/').pop() || '').replace(/[-_]+/g, ' '),
        imageUrl: src, productUrl: href.origin + href.pathname,
        price: priceM ? priceM[0].trim() : '', category: guessCategory(href.pathname, name),
      });
    });
    return items;
  };
  // "더 보기" 류 버튼 찾기(보이는 것만).
  const findLoadMore = () => {
    const rx = /load\s*more|show\s*more|see\s*more|view\s*more|더\s*보기|더\s*불러오기|상품\s*더/i;
    const sel = 'button, a[role="button"], [data-testid*="load" i], [class*="load-more" i], [class*="loadMore" i], [class*="show-more" i]';
    return [...document.querySelectorAll(sel)].find((el) => {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return false;                  // 숨겨진 것 제외
      const t = (el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '');
      return rx.test(t) || /load-?more|show-?more/i.test(String(el.className || ''));
    });
  };

  // 다음 페이지 주소(rel=next → 다음/Next 링크 → page 파라미터 증가 순).
  const findNext = () => {
    const rel = document.querySelector('link[rel="next"], a[rel="next"]');
    if (rel && rel.href) return rel.href;
    const rx = /^\s*(next|다음|next page|›|»|＞|>)\s*$/i;
    const a = [...document.querySelectorAll('a[href]')].find((x) => {
      const t = (x.textContent || '').trim();
      const al = x.getAttribute('aria-label') || '';
      return (rx.test(t) || rx.test(al)) && !/prev|이전/i.test(t + al);
    });
    if (a && a.href) return a.href;
    try {
      const u = new URL(location.href);
      for (const k of ['page', 'pageNumber', 'pageNo', 'p', 'pg']) {
        if (u.searchParams.has(k)) {
          const n = parseInt(u.searchParams.get(k), 10);
          if (Number.isFinite(n)) { u.searchParams.set(k, String(n + 1)); return u.href; }
        }
      }
      // 페이지 파라미터가 없는 첫 페이지면 ?page=2 를 시도(빈 결과면 호출측이 멈춤).
      u.searchParams.set('page', '2');
      return u.href;
    } catch (e) { return ''; }
  };

  // 스크롤 + "더 보기" 클릭을 상품 수가 늘지 않을 때까지 반복(무한스크롤·버튼형 모두 대응).
  let stable = 0, lastCount = -1;
  for (let i = 0; i < 60; i++) {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(500);
    const btn = findLoadMore();
    if (btn) { try { btn.click(); } catch (e) {} await sleep(1200); }
    const n = harvest().length;
    if (n === lastCount) { if (++stable >= (btn ? 4 : 3)) break; } else { stable = 0; lastCount = n; }
  }
  window.scrollTo(0, 0);
  await sleep(250);
  return { items: harvest(), nextUrl: findNext() };
}

function pushLog(entry) { state.log.unshift(entry); if (state.log.length > 200) state.log.pop(); }

// 입력은 buildTargets()가 만든 브랜드 그룹 [{brand, site, urls}].
// (예전처럼 URL 배열이 들어와도 동작하도록 호스트 기준 그룹으로 감싼다.)
function asGroups(input) {
  const arr = input || [];
  if (arr.length && typeof arr[0] === 'object' && arr[0].urls) return arr;
  const byHost = new Map();
  for (const u of arr) {
    let host = 'brand';
    try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (e) { continue; }
    if (!byHost.has(host)) byHost.set(host, { brand: host.split('.')[0], site: host, urls: [] });
    byHost.get(host).urls.push(u);
  }
  return [...byHost.values()];
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
  for (const g of groups) {
    if (!state.running) break;
    // 한 브랜드의 모든 카테고리 URL을 먼저 모은 뒤, 브랜드 단위로 한 번만 저장한다.
    const brandItems = new Map();
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
        let pageUrl = url, pages = 0;
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
            if (it && it.productUrl && !byUrl.has(it.productUrl)) { byUrl.set(it.productUrl, it); added++; }
          }
          pages++;
          state.current = g.brand + ' · ' + url + (pages > 1 ? ` (p${pages})` : '');
          if (!added) break;                       // 더 이상 새 상품 없음 → 마지막 페이지
          pageUrl = res.nextUrl && res.nextUrl !== pageUrl ? res.nextUrl : '';
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
        pushLog({
          url: g.site, ok: !!d.ok, count: d.ok ? d.count : 0,
          msg: d.ok ? `✅ ${g.brand} · ${items.length}개 저장` : `❌ ${g.brand} 전송실패 ` + (d.error || resp.status),
        });
      } catch (e) {
        failCount++;
        pushLog({ url: g.site, ok: false, count: 0, msg: `❌ ${g.brand} 전송오류: ` + String((e && e.message) || e) });
      }
    } else {
      failCount++;
      pushLog({ url: g.site, ok: false, count: 0, msg: `❌ ${g.brand} · 수집 0개(저장 안 함 — 이전 저장본 유지)` });
    }
  }
  if (winId) { try { await chrome.windows.remove(winId); } catch (e) {} }
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
  if (msg.type === 'stop') { state.running = false; reply({ ok: true }); return; }
  if (msg.type === 'state') { reply(state); return; }
  if (msg.type === 'getCfg') { getCfg().then(reply); return true; }
  if (msg.type === 'setCfg') {
    chrome.storage.local.set({ worker: msg.worker || '', token: msg.token || '' }).then(() => reply({ ok: true }));
    return true;
  }
});
