// ==UserScript==
// @name         RACK 상품 수집기 (원클릭)
// @namespace    rack-miro
// @version      2.0
// @description  봇 차단 쇼핑몰(Zara·Massimo Dutti·H&M·Gap 등)에서 버튼 한 번으로 상품을 자동 스크롤·수집해 RACK 공유 저장소로 전송 → 팀 전체가 미로 앱에서 즉시 접근. (실제 브라우저에서 돌기 때문에 Akamai 차단을 자연히 통과)
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

  // ── 기본값 내장: 팀원은 설치만 하면 바로 사용(설정 입력 불필요) ──
  //    다른 Worker/토큰을 쓰려면 버튼 우클릭(또는 Tampermonkey 메뉴)에서 변경.
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

  // ── 카테고리 추정 (URL·이름 키워드) ──
  function guessCategory(u, name) {
    const s = (u + ' ' + name).toLowerCase();
    if (/dress|원피스/.test(s)) return 'dresses';
    if (/pant|trouser|jean|denim|바지|팬츠|slack/.test(s)) return 'pants';
    if (/sweat|hoodie|jumper|맨투맨|후드/.test(s)) return 'sweatshirts';
    if (/shirt(?!s? ?dress)|blouse|셔츠|블라우스/.test(s)) return 'shirts';
    if (/coat|jacket|outer|코트|자켓|재킷|아우터/.test(s)) return 'outerwear';
    return 'tops';
  }

  // 요소의 가장 큰 이미지 주소(placeholder·srcset·background 대응)
  function bestImage(el) {
    if (!el) return '';
    // 1) <img> 직접
    const pickFrom = (img) => {
      if (!img) return '';
      let src = img.currentSrc || img.getAttribute('src') || img.getAttribute('data-src') ||
                img.getAttribute('data-lazy') || img.getAttribute('data-original') || '';
      if (!/^https?:/.test(src) || /\.svg(\?|#|$)/i.test(src) || /placeholder|blank|spacer|1x1/i.test(src)) {
        const ss = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
        const m = ss.match(/https?:\/\/[^\s,]+/g);
        if (m && m.length) src = m[m.length - 1];   // srcset 마지막 = 대개 최대 해상도
      }
      return /^https?:/.test(src) ? src : '';
    };
    const img = el.querySelector('img');
    let src = pickFrom(img);
    // 2) <picture><source srcset>
    if (!src) {
      const s = el.querySelector('source[srcset], source[data-srcset]');
      if (s) { const m = (s.getAttribute('srcset') || s.getAttribute('data-srcset') || '').match(/https?:\/\/[^\s,]+/g); if (m) src = m[m.length - 1]; }
    }
    // 3) background-image
    if (!src) {
      const bgEl = el.querySelector('[style*="background-image"]') || el;
      const bg = (bgEl.getAttribute && bgEl.getAttribute('style') || '').match(/url\(["']?(https?:\/\/[^"')]+)/i);
      if (bg) src = bg[1];
    }
    return src || '';
  }

  // ── 페이지에서 상품(링크+이미지+이름+가격) 수집 ──
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
      if (img && img.naturalWidth && img.naturalWidth < 100) return;   // 아이콘·로고 제외
      const path = href.pathname.replace(/\/+$/, '');
      if (path.length < 8) return;                                     // 네비게이션 제외
      const key = href.origin + path;                                  // 쿼리 무시 중복 제거
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

  // ── 페이지 끝까지 자동 스크롤(레이지 로딩 강제) ──
  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
  async function autoScroll(onProgress) {
    let last = -1, stable = 0;
    for (let i = 0; i < 60; i++) {                 // 최대 ~24초
      window.scrollTo(0, document.documentElement.scrollHeight);
      await sleep(400);
      const h = document.documentElement.scrollHeight;
      if (onProgress) onProgress('스크롤 중… ' + harvest().length + '개');
      if (h === last) { if (++stable >= 3) break; } else { stable = 0; last = h; }
    }
    window.scrollTo(0, 0);
    await sleep(300);
  }

  // ── 전송 ──
  let busy = false;
  async function run(btn) {
    if (busy) return;
    const cfg = getConfig(false);
    if (!cfg || !cfg.url) return;
    busy = true;
    const setLabel = (t) => { if (btn) btn.textContent = t; };
    try {
      setLabel('⏳ 스크롤 중…');
      await autoScroll(setLabel);
      const items = harvest();
      if (!items.length) { setLabel('상품 못 찾음'); alert('상품을 못 찾았습니다. 상품 목록 페이지에서 실행했는지 확인하세요.'); return; }
      setLabel('전송 중… (' + items.length + '개)');
      const site = location.hostname.replace(/^www\./, '');
      const brand = site.split('.')[0];
      await new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: cfg.url + '/?store=catalog' + (cfg.token ? '&token=' + encodeURIComponent(cfg.token) : ''),
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ site, brand, items }),
          onload(r) {
            try {
              const d = JSON.parse(r.responseText);
              setLabel(d.ok ? ('✅ ' + d.count + '개 전송됨') : ('⚠ ' + (d.error || r.status)));
            } catch (e) { setLabel('⚠ 응답 오류 ' + r.status); }
            resolve();
          },
          onerror() { setLabel('⚠ 전송 실패(주소/토큰 확인)'); resolve(); },
        });
      });
    } finally {
      busy = false;
      setTimeout(() => setLabel('📥 RACK 전송'), 5000);
    }
  }

  // ── 상품 목록처럼 보이는 페이지에서만 버튼 노출 ──
  function looksLikeListing() { return harvest().length >= 6; }

  let btn = null;
  function ensureButton() {
    if (btn) return;
    if (!looksLikeListing()) return;
    btn = document.createElement('button');
    btn.textContent = '📥 RACK 전송';
    Object.assign(btn.style, {
      position: 'fixed', right: '16px', bottom: '16px', zIndex: 2147483647,
      padding: '11px 15px', background: '#111', color: '#fff', border: 'none',
      borderRadius: '30px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(0,0,0,.3)', fontFamily: 'sans-serif', letterSpacing: '.3px',
    });
    btn.title = '이 페이지 상품을 RACK로 전송 · 우클릭=설정 변경';
    btn.addEventListener('click', () => run(btn));
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); getConfig(true); });
    document.body.appendChild(btn);
  }

  // 상품이 async 로딩되므로 여러 번 확인. Tampermonkey 메뉴로도 항상 실행 가능.
  let tries = 0;
  const timer = setInterval(() => { ensureButton(); if (btn || ++tries > 15) clearInterval(timer); }, 1000);
  try { GM_registerMenuCommand('📥 RACK로 이 페이지 상품 전송', () => run(btn)); } catch (e) {}
  try { GM_registerMenuCommand('⚙ Worker 주소/토큰 변경', () => getConfig(true)); } catch (e) {}
})();
