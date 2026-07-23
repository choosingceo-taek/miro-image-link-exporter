// ==UserScript==
// @name         RACK 상품 수집기 (자동)
// @namespace    rack-miro
// @version      2.1
// @description  봇 차단 쇼핑몰(Zara·Massimo Dutti·H&M·Gap 등)을 열람하는 동안 자동으로 상품을 수집해 RACK 공유 저장소로 전송 → 팀 전체가 미로 앱에서 즉시 접근. (실제 브라우저에서 돌기 때문에 Akamai 차단을 자연히 통과 · 설정값 내장 → 설치만 하면 바로 동작)
// @author       RACK
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      workers.dev
// @connect      fabric-extractor.hs-fabric-linker.workers.dev
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  // ── 설정값 내장: 설치만 하면 바로 동작(입력 불필요). 바꾸려면 메뉴 "⚙ 설정 변경". ──
  const DEFAULT_URL = 'https://fabric-extractor.hs-fabric-linker.workers.dev';
  const DEFAULT_TOKEN = 'hsfabriclinker';

  function getConfig(force) {
    let url = GM_getValue('rackWorkerUrl', DEFAULT_URL);
    let token = GM_getValue('rackToken', DEFAULT_TOKEN);
    if (force) {
      url = (prompt('RACK Worker 주소', url) || '').trim();
      if (!url) return null;
      token = (prompt('Access token (없으면 비워두기)', token) || '').trim();
      GM_setValue('rackWorkerUrl', url.replace(/\/+$/, ''));
      GM_setValue('rackToken', token);
    }
    return { url: String(url).replace(/\/+$/, ''), token: String(token || '') };
  }
  const autoOn = () => GM_getValue('rackAuto', true);

  // ── 카테고리 추정 ──
  function guessCategory(u, name) {
    const n = ' ' + String(name || '').toLowerCase() + ' ';
    const url = ' ' + String(u || '').toLowerCase() + ' ';
    const nHas = (re) => re.test(n);
    if (nHas(/dress|gown|원피스/) && !nHas(/shirt[-\s]?dress/)) return 'dresses';
    if (nHas(/shirt|blouse|button[-\s]?down|oxford|셔츠|블라우스|남방/)) return 'shirts';
    if (nHas(/sweat|hoodie|hoody|jumper|cardigan|knit|sweater|맨투맨|후드|니트|가디건|스웨터/)) return 'sweatshirts';
    if (nHas(/t[-\s]?shirt|tee|tank|cami|camisole|halter|bodysuit|티셔츠|탑|나시|캐미|홀터/)) return 'tops';
    if (nHas(/\bpants?\b|trouser|jean|denim|chino|legging|slack|shorts?|바지|팬츠|슬랙스|청바지|쇼츠|반바지/)) return 'pants';
    if (nHas(/\btop\b/)) return 'tops';
    if (/dress|원피스/.test(url)) return 'dresses';
    if (/shirt|blouse|셔츠|블라우스/.test(url)) return 'shirts';
    if (/sweat|hoodie|knit|cardigan|맨투맨|후드|니트/.test(url)) return 'sweatshirts';
    if (/[\/=-](pants?|trousers?|jeans?|denim|chinos?|leggings?)[\/=&-]/.test(url) || /바지|팬츠/.test(url)) return 'pants';
    return 'tops';
  }

  // 요소의 가장 큰 이미지 주소(placeholder·srcset·background 대응)
  function bestImage(el) {
    if (!el) return '';
    const pickFrom = (img) => {
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
    let src = pickFrom(el.querySelector('img'));
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
  }

  // ── 페이지에서 상품 수집 ──
  function harvest() {
    const seen = new Set(), items = [];
    document.querySelectorAll('a[href]').forEach((a) => {
      let href;
      try { href = new URL(a.href, location.href); } catch (e) { return; }
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
      const name = ((img && img.alt) || (nameEl && nameEl.textContent) || '')
        .replace(/\s+/g, ' ').trim().slice(0, 150);
      const priceM = (card.textContent || '').match(/(?:[$€£₩¥]|\bUSD|\bEUR|\bKRW)\s?\d[\d.,]*/);
      items.push({
        name: name || decodeURIComponent(path.split('/').pop() || '').replace(/[-_]+/g, ' '),
        imageUrl: src,
        productUrl: href.origin + href.pathname,
        price: priceM ? priceM[0].trim() : '',
        category: guessCategory(href.pathname, name),
      });
    });
    return items;
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
  async function autoScroll(onProgress) {
    let last = -1, stable = 0;
    for (let i = 0; i < 60; i++) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await sleep(400);
      const h = document.documentElement.scrollHeight;
      if (onProgress) onProgress(harvest().length);
      if (h === last) { if (++stable >= 3) break; } else { stable = 0; last = h; }
    }
    window.scrollTo(0, 0);
    await sleep(300);
  }

  // ── 전송 (공통) ──
  function send(items, cb) {
    const cfg = getConfig(false);
    if (!cfg || !cfg.url || !items.length) { cb && cb(false, 'no-config-or-items'); return; }
    const site = location.hostname.replace(/^www\./, '');
    const brand = site.split('.')[0];
    GM_xmlhttpRequest({
      method: 'POST',
      url: cfg.url + '/?store=catalog' + (cfg.token ? '&token=' + encodeURIComponent(cfg.token) : ''),
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ site, brand, items }),
      onload(r) { try { const d = JSON.parse(r.responseText); cb && cb(!!d.ok, d.ok ? d.count : (d.error || r.status)); } catch (e) { cb && cb(false, r.status); } },
      onerror() { cb && cb(false, 'network'); },
    });
  }

  // ── 화면 알림(토스트) ──
  let toastEl = null;
  function toast(msg, ms) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      Object.assign(toastEl.style, {
        position: 'fixed', left: '16px', bottom: '16px', zIndex: 2147483647,
        padding: '9px 13px', background: '#111', color: '#fff', borderRadius: '8px',
        fontSize: '12px', fontFamily: 'sans-serif', boxShadow: '0 4px 14px rgba(0,0,0,.3)',
        maxWidth: '260px', opacity: '0', transition: 'opacity .2s',
      });
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { if (toastEl) toastEl.style.opacity = '0'; }, ms || 3500);
  }

  // ── 자동 모드: 열람(스크롤) 중 상품이 늘면 조용히 전송(강제 스크롤 없음) ──
  let autoSent = 0, autoBusy = false, autoTimer = null;
  function scheduleAuto() {
    if (!autoOn()) return;
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      if (autoBusy) return;
      const items = harvest();
      if (items.length < 6 || items.length <= autoSent) return;
      autoBusy = true;
      send(items, (ok, info) => {
        autoBusy = false;
        if (ok) { autoSent = items.length; toast('📥 ' + info + '개 자동 저장됨 → 미로 RACK'); }
      });
    }, 2500);
  }

  // ── 수동 버튼: 끝까지 강제 스크롤 후 전송(전체 수집) ──
  let manualBusy = false;
  async function runManual(btn) {
    if (manualBusy) return;
    manualBusy = true;
    const label = (t) => { if (btn) btn.textContent = t; };
    try {
      label('⏳ 스크롤 중…');
      await autoScroll((n) => label('스크롤 중… ' + n + '개'));
      const items = harvest();
      if (!items.length) { label('상품 못 찾음'); return; }
      label('전송 중… (' + items.length + ')');
      await new Promise((res) => send(items, (ok, info) => {
        label(ok ? ('✅ ' + info + '개 전송됨') : ('⚠ ' + info));
        if (ok) autoSent = Math.max(autoSent, items.length);
        res();
      }));
    } finally {
      manualBusy = false;
      setTimeout(() => label('📥 전체 수집·전송'), 5000);
    }
  }

  // ── 상품 목록처럼 보이면 버튼 노출 ──
  function looksLikeListing() { return harvest().length >= 6; }
  let btn = null;
  function ensureButton() {
    if (btn || !looksLikeListing()) return;
    btn = document.createElement('button');
    btn.textContent = '📥 전체 수집·전송';
    Object.assign(btn.style, {
      position: 'fixed', right: '16px', bottom: '16px', zIndex: 2147483647,
      padding: '11px 15px', background: '#111', color: '#fff', border: 'none',
      borderRadius: '30px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(0,0,0,.3)', fontFamily: 'sans-serif', letterSpacing: '.3px',
    });
    btn.title = '이 페이지 상품을 끝까지 스크롤해 전송 · 우클릭=설정';
    btn.addEventListener('click', () => runManual(btn));
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); getConfig(true); });
    document.body.appendChild(btn);
  }

  // 상품이 async 로딩되므로 반복 확인 + 스크롤마다 자동 수집 예약
  let tries = 0;
  const timer = setInterval(() => { ensureButton(); if (++tries > 20) clearInterval(timer); }, 1000);
  window.addEventListener('scroll', scheduleAuto, { passive: true });
  setTimeout(scheduleAuto, 3500);   // 초기 로딩분 자동 전송

  // 메뉴
  try {
    GM_registerMenuCommand('📥 지금 전체 수집·전송', () => runManual(btn));
    GM_registerMenuCommand((autoOn() ? '⏸ 자동수집 끄기' : '▶ 자동수집 켜기'), () => { GM_setValue('rackAuto', !autoOn()); toast('자동 수집: ' + (autoOn() ? 'ON' : 'OFF')); });
    GM_registerMenuCommand('⚙ Worker 주소/토큰 변경', () => getConfig(true));
  } catch (e) {}
})();
