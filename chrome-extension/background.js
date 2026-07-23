// RACK 상품 수집기 — 백그라운드 오케스트레이션 (MV3 service worker)
// URL 목록을 하나씩 백그라운드 탭으로 열어 렌더링(=Akamai 통과) → 자동 스크롤·수집 →
// 기존 RACK Worker(KV)로 전송 → 탭 닫고 다음. 진행상황은 state에 쌓아 팝업이 폴링.

const DEFAULT_WORKER = 'https://fabric-extractor.hs-fabric-linker.workers.dev';
const DEFAULT_TOKEN = 'hsfabriclinker';

let state = { running: false, done: 0, total: 0, current: '', log: [] };

async function getCfg() {
  const s = await chrome.storage.local.get(['worker', 'token']);
  return {
    worker: String(s.worker || DEFAULT_WORKER).replace(/\/+$/, ''),
    token: s.token !== undefined ? String(s.token) : DEFAULT_TOKEN,
  };
}

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
    const s = (u + ' ' + name).toLowerCase();
    if (/dress|원피스/.test(s)) return 'dresses';
    if (/pant|trouser|jean|denim|바지|팬츠|slack/.test(s)) return 'pants';
    if (/sweat|hoodie|jumper|맨투맨|후드/.test(s)) return 'sweatshirts';
    if (/shirt(?!s? ?dress)|blouse|셔츠|블라우스/.test(s)) return 'shirts';
    if (/coat|jacket|outer|코트|자켓|재킷|아우터/.test(s)) return 'outerwear';
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
  // 자동 스크롤로 레이지 로딩 강제
  let last = -1, stable = 0;
  for (let i = 0; i < 50; i++) {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(450);
    const h = document.documentElement.scrollHeight;
    if (h === last) { if (++stable >= 3) break; } else { stable = 0; last = h; }
  }
  window.scrollTo(0, 0);
  await sleep(250);
  return harvest();
}

function pushLog(entry) { state.log.unshift(entry); if (state.log.length > 200) state.log.pop(); }

async function collect(urls) {
  if (state.running) return;
  const cfg = await getCfg();
  state = { running: true, done: 0, total: urls.length, current: '', log: [] };
  for (let i = 0; i < urls.length; i++) {
    if (!state.running) break;
    const url = urls[i];
    state.current = url;
    let tab = null;
    try {
      tab = await chrome.tabs.create({ url, active: false });
      await waitForComplete(tab.id, 45000);
      await sleep(1800);   // Akamai/JS 챌린지·초기 렌더 여유
      const inj = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: pageCollector });
      const items = (inj && inj[0] && inj[0].result) || [];
      if (items.length) {
        const site = new URL(url).hostname.replace(/^www\./, '');
        const brand = site.split('.')[0];
        const resp = await fetch(cfg.worker + '/?store=catalog' + (cfg.token ? '&token=' + encodeURIComponent(cfg.token) : ''), {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ site, brand, items }),
        });
        const d = await resp.json().catch(() => ({}));
        pushLog({ url, ok: !!d.ok, count: d.ok ? d.count : 0, msg: d.ok ? (d.count + '개 전송') : ('전송실패 ' + (d.error || resp.status)) });
      } else {
        pushLog({ url, ok: false, count: 0, msg: '상품 못 찾음(차단/비목록 페이지?)' });
      }
    } catch (e) {
      pushLog({ url, ok: false, count: 0, msg: '오류: ' + String((e && e.message) || e) });
    } finally {
      if (tab) { try { await chrome.tabs.remove(tab.id); } catch (e) {} }
      state.done = i + 1;
    }
    await sleep(1500);   // 사이트 부담·차단 방지 텀
  }
  state.running = false;
  state.current = '';
}

// 지금 보고 있는 활성 탭을 바로 수집(제일 확실 — 이미 렌더된 실제 페이지).
async function collectActive() {
  const cfg = await getCfg();
  let tab;
  try { [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); } catch (e) {}
  if (!tab || !/^https?:/.test(tab.url || '')) return { ok: false, msg: '현재 탭이 웹페이지가 아닙니다.' };
  try {
    const inj = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: pageCollector });
    const items = (inj && inj[0] && inj[0].result) || [];
    if (!items.length) return { ok: false, msg: '상품을 못 찾았습니다(상품 목록 페이지인지 확인).' };
    const site = new URL(tab.url).hostname.replace(/^www\./, '');
    const brand = site.split('.')[0];
    const resp = await fetch(cfg.worker + '/?store=catalog' + (cfg.token ? '&token=' + encodeURIComponent(cfg.token) : ''), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ site, brand, items }),
    });
    const d = await resp.json().catch(() => ({}));
    return { ok: !!d.ok, count: d.ok ? d.count : 0, msg: d.ok ? (site + ' · ' + d.count + '개 전송됨') : ('전송 실패 ' + (d.error || resp.status)) };
  } catch (e) { return { ok: false, msg: '오류: ' + String((e && e.message) || e) }; }
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type === 'collectActive') { collectActive().then(reply); return true; }
  if (msg.type === 'start') { collect(msg.urls || []); reply({ ok: true }); return; }
  if (msg.type === 'stop') { state.running = false; reply({ ok: true }); return; }
  if (msg.type === 'state') { reply(state); return; }
  if (msg.type === 'getCfg') { getCfg().then(reply); return true; }
  if (msg.type === 'setCfg') {
    chrome.storage.local.set({ worker: msg.worker || '', token: msg.token || '' }).then(() => reply({ ok: true }));
    return true;
  }
});
