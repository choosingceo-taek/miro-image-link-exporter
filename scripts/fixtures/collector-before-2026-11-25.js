// 상품 목록 페이지에서 상품을 긁어내는 수집기 — 크롬 확장과 헤드리스 러너가 함께 쓴다.
//
// · 확장(background.js)은 importScripts('collector.js')로 불러 chrome.scripting 으로 주입한다.
// · 헤드리스 러너(scripts/browser-collect.mjs)는 이 파일을 텍스트로 읽어 page.evaluate 에 넣는다.
// 두 곳에서 같은 코드를 쓰기 위해 외부 의존성 없이 self-contained 로 유지할 것.

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
    // 이름이 겉옷을 가리키면 URL 보조는 건너뛴다. 상품명이 'Denim Jacket'인데 주소에 denim이
    // 들어 있다는 이유로 pants가 되던 문제 — 겉옷 칸이 없으니 기본값 tops로 두는 편이 덜 틀리다.
    const outer = nHas(/jacket|coat|blazer|parka|anorak|\bvest\b|재킷|자켓|코트|점퍼|베스트|조끼/);
    if (!outer && /dress|원피스/.test(url)) return 'dresses';
    if (!outer && /pants?\b|trouser|jeans?\b|denim|chino|legging|jogger|shorts?\b|skirts?\b|skorts?\b|바지|팬츠/.test(url)) return 'pants';
    if (/sweat|hoodie|knit|cardigan|맨투맨|후드|니트/.test(url)) return 'sweatshirts';
    if (/shirt|blouse|셔츠|블라우스/.test(url)) return 'shirts';
    return 'tops';
  };
  // 이미지 주소는 절대경로가 아닐 수 있다 — //assets.gap.com/... (프로토콜 상대),
  // /webcontent/0056/... (루트 상대) 둘 다 흔하다. 예전에는 http(s)로 시작하지
  // 않으면 버려서, 그런 사이트는 상품을 통째로 놓쳤다(Gap·Carhartt).
  const abs = (u) => {
    const v = String(u || '').trim();
    if (!v || /^(data|blob|javascript):/i.test(v)) return '';
    try { const a = new URL(v, location.href); return /^https?:$/.test(a.protocol) ? a.href : ''; }
    catch (e) { return ''; }
  };
  // srcset("url 1x, url 2x")에서 가장 큰(마지막) 후보를 고른다. 상대경로도 받는다.
  const fromSrcset = (ss) => {
    const parts = String(ss || '').split(',').map((x) => x.trim().split(/\s+/)[0]).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) { const u = abs(parts[i]); if (u) return u; }
    return '';
  };
  const bad = (u) => !u || /\.svg(\?|#|$)/i.test(u) || /placeholder|blank|spacer|1x1|transparent/i.test(u);

  const bestImage = (el) => {
    if (!el) return '';
    const pick = (img) => {
      if (!img) return '';
      let src = abs(img.currentSrc) || abs(img.getAttribute('src')) || abs(img.getAttribute('data-src')) ||
                abs(img.getAttribute('data-lazy')) || abs(img.getAttribute('data-original')) ||
                abs(img.getAttribute('data-image')) || abs(img.getAttribute('data-srcset'));
      if (bad(src)) {
        const alt = fromSrcset(img.getAttribute('srcset')) || fromSrcset(img.getAttribute('data-srcset'));
        if (!bad(alt)) src = alt;
      }
      return bad(src) ? '' : src;
    };
    // 카드 안의 첫 <img> 만 보면 안 된다. 상품 카드 맨 앞에 아이콘이 오는 사이트가
    // 있다 — Carhartt 는 카드 첫머리에 확대보기 아이콘(/images/common/eye-black.svg)을
    // 넣어서, 그 하나가 .svg 라 버려지면 상품 사진까지 통째로 못 찾았다.
    let src = '';
    for (const img of el.querySelectorAll('img')) {
      src = pick(img);
      if (src) break;
    }
    if (!src) {
      for (const s of el.querySelectorAll('source[srcset], source[data-srcset]')) {
        const u = fromSrcset(s.getAttribute('srcset')) || fromSrcset(s.getAttribute('data-srcset'));
        if (!bad(u)) { src = u; break; }
      }
    }
    if (!src) {
      const bgEl = el.querySelector('[style*="background-image"]') || el;
      const bg = ((bgEl.getAttribute && bgEl.getAttribute('style')) || '').match(/url\(["']?([^"')]+)/i);
      if (bg) { const u = abs(bg[1]); if (!bad(u)) src = u; }
    }
    return src || '';
  };
  // 상품이 아니라 카테고리·배너 링크인지 판별.
  // 목록 페이지 상단에는 하위 카테고리 타일("Tanks & Camis. Click to shop.")과
  // 로고·브레드크럼이 이미지와 함께 있어서, 그냥 두면 상품인 척 섞여 들어온다.
  // 'Logo Tee' 같은 진짜 상품을 죽이지 않도록, 로고는 "이름이 로고로 끝나는 짧은 링크"만 막는다.
  const BANNER_NAME = /click to shop|shop the look|discover now|^\s*(shop\b|discover\b|explore\b|view all|see all|shop all|new arrivals?\b|browse\b)|^.{0,24}\blogo\s*$/i;
  // 상품 페이지가 아닌 경로. 점검(scripts/audit-catalogs.mjs)이 사후에 잡아내는 것과
  // 같은 목록이다 — 잡아낼 수 있으면 애초에 담지 않는 게 맞다. 실제로 The white
  // company 는 /magazine/ 아래 기사 9개가 상품으로 들어가 있었다.
  // 한 '조각' 전체가 일치할 때만 막는다 — "help-me-tee" 같은 상품명은 살아남는다.
  const NON_PRODUCT_SEGMENTS = [
    'account', 'login', 'signin', 'register', 'cart', 'bag', 'basket', 'checkout', 'wishlist',
    'gift-?cards?', 'e-?gift', 'size-?(?:guide|chart)', 'help', 'faq', 'contact',
    'customer-?(?:service|care)', 'store-?locator', 'find-a-stores?', 'our-stores?',
    'blogs?', 'journal', 'magazine', 'press', 'about(?:-us)?', 'careers?', 'jobs?',
    'returns?', 'shipping', 'delivery', 'terms', 'privacy', 'cookies?', 'legal',
    'sitemap', 'search', 'newsletter', 'subscribe', 'sustainability', 'lookbook',
    'campaigns?', 'editorial', 'inspiration', 'guides?', 'how-to', 'klarna', 'afterpay',
    'loyalty', 'rewards', 'affiliates?',
  ];
  const NON_PRODUCT_PATH = new RegExp('/(?:' + NON_PRODUCT_SEGMENTS.join('|') + ')(?:/|$)', 'i');

  // ── 가격 ────────────────────────────────────────────────────────────
  // 통화가 앞에 붙는 표기($128, ₩89,000, USD 128)와 뒤에 붙는 표기(129,00 zł, 1 290 kr)를
  // 모두 잡는다. 예전에는 [$€£₩¥]만 봐서 유럽·북유럽 사이트가 통째로 빈칸이 됐다.
  const P_NUM = '\\d{1,3}(?:[.,\\u00a0\\u202f ]\\d{3})*(?:[.,]\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?';
  const P_PRE = '[$€£₩¥₹]|\\b(?:USD|EUR|GBP|KRW|JPY|CHF|PLN|SEK|NOK|DKK|AUD|CAD|NZD)\\b';
  const P_POST = 'z\\u0142|K\\u010d|kr|Ft|lei|CHF|PLN|SEK|NOK|DKK|\\u20ac|\\u00a3|\\uc6d0';
  const PRICE_RX = new RegExp(
    '(?:' + P_PRE + ')\\s?(?:' + P_NUM + ')|(?:' + P_NUM + ')\\s?(?:' + P_POST + ')(?![a-z])', 'i');
  const PRICE_RX_G = new RegExp(PRICE_RX.source, 'gi');
  // 비교·정렬용 숫자. "1.299,00" 처럼 소수점과 천단위 구분이 뒤집힌 표기도 다룬다.
  const priceNum = (s) => {
    const d = String(s).replace(/[^\d.,]/g, '');
    if (!d) return NaN;
    const lastDot = d.lastIndexOf('.'), lastCom = d.lastIndexOf(',');
    const dec = Math.max(lastDot, lastCom);
    // 마지막 구분자 뒤가 1~2자리면 소수점, 아니면 천단위 구분자.
    const isDec = dec >= 0 && d.length - dec - 1 <= 2 && d.length - dec - 1 >= 1;
    const norm = isDec ? d.slice(0, dec).replace(/[.,]/g, '') + '.' + d.slice(dec + 1)
                       : d.replace(/[.,]/g, '');
    return Number(norm);
  };
  // 카드 텍스트에서 가격을 뽑는다. 할인 상품은 정가·할인가가 나란히 있으므로
  // 서로 다른 금액이 둘 이상이면 큰 쪽을 정가, 작은 쪽을 할인가로 본다.
  const pricesFrom = (text) => {
    const hits = String(text || '').match(PRICE_RX_G) || [];
    const uniq = [];
    for (const h of hits) {
      const t = h.replace(/\s+/g, ' ').trim();
      const n = priceNum(t);
      if (!Number.isFinite(n) || n <= 0) continue;
      if (!uniq.some((u) => u.n === n)) uniq.push({ t, n });
      if (uniq.length >= 4) break;
    }
    if (!uniq.length) return { price: '', priceOrig: '' };
    if (uniq.length === 1) return { price: uniq[0].t, priceOrig: '' };
    uniq.sort((a, z) => z.n - a.n);
    return { price: uniq[uniq.length - 1].t, priceOrig: uniq[0].t };
  };
  // 상품 사진이 하나뿐인 동안만 위로 올라가며 가격을 찾는다.
  // card 를 `closest(...,'div')` 로 잡으면 이미지만 감싼 래퍼에서 멈춰 가격이 형제로 빠진다.
  // 사진이 둘 이상 들어오는 순간은 그리드로 올라선 것이라, 더 가면 이웃 상품 가격을 집는다.
  const bigImgs = (el) => {
    let n = 0;
    for (const im of el.querySelectorAll('img')) {
      const r = im.getBoundingClientRect();
      if (Math.max(r.width, r.height) >= 60 || (im.naturalWidth || 0) >= 60) n++;
      if (n > 1) break;
    }
    return n;
  };
  const priceOf = (card) => {
    let el = card;
    for (let i = 0; i < 5 && el; i++) {
      const p = pricesFrom(el.textContent);
      if (p.price) return p;
      const up = el.parentElement;
      if (!up || up === document.body || bigImgs(up) > 1) break;
      el = up;
    }
    return { price: '', priceOrig: '' };
  };

  // 하위 카테고리 타일 주소를 따로 모아 둔다.
  // 엑셀의 카테고리 URL이 상품 목록이 아니라 "허브 페이지"인 경우가 있다
  // (예: /fpmovement/workout-tops/ 는 casual-tops·performance-tops 타일만 보여준다).
  // 그때 호출측이 이 목록을 한 단계 더 따라가 실제 상품을 가져온다.
  const subCats = new Set();

  // 0개로 끝났을 때 "왜 다 걸러졌는지" 세어 둔다. 추측 대신 숫자로 원인을 좁힌다.
  const rej = { total: 0, noImage: 0, tinyImage: 0, shortPath: 0, samePage: 0, banner: 0, dup: 0,
    nonProduct: 0, landing: 0 };

  const harvest = () => {
    const here = location.pathname.replace(/\/+$/, '');
    const seen = new Set(), items = [];
    for (const k of Object.keys(rej)) rej[k] = 0;
    document.querySelectorAll('a[href]').forEach((a) => {
      let href; try { href = new URL(a.href, location.href); } catch (e) { return; }
      if (!/^https?:/.test(href.protocol)) return;
      rej.total++;
      const card = a.closest('article,li,[class*="card"],[class*="product"],[class*="tile"],[class*="item"],div') || a;
      // 카드를 못 짚었으면 한두 단계 위까지 올라가 본다.
      // Apiece Apart 는 카드 전체를 덮는 투명 링크(<a class="absolute inset-0">)를 쓰는데,
      // 링크 안에는 sr-only 글자뿐이고 사진은 형제 요소다 — 가장 가까운 div 만 보면
      // 상품 80개가 통째로 '이미지 없음'으로 버려진다.
      // 다만 끝없이 올라가면 그리드 전체를 카드로 착각해 옆 상품 사진을 가져온다.
      // 링크가 여럿 든 조상은 카드가 아니라 목록이므로 거기서 멈춘다.
      const widen = (el) => {
        let cur = el;
        for (let hop = 0; hop < 3; hop++) {
          const up = cur.parentElement;
          if (!up || up === document.body) return '';
          if (up.querySelectorAll('a[href]').length > 3) return '';
          const got = bestImage(up);
          if (got) return got;
          cur = up;
        }
        return '';
      };
      const src = bestImage(a) || bestImage(card) || widen(card);
      if (!/^https?:/.test(src)) { rej.noImage++; return; }
      // 아이콘·배지를 걸러내려는 검사인데, naturalWidth(실제 로드된 비트맵 크기)로 보면
      // 지연 로딩 중인 저해상도 상품 이미지까지 버린다 — Carhartt sweatpants 에서
      // 상품 66개가 통째로 이렇게 날아갔다. 화면에 그려진 크기를 기준으로 판단한다.
      const img = a.querySelector('img') || card.querySelector('img');
      if (img) {
        const r = img.getBoundingClientRect();
        const shown = Math.max(r.width, r.height);
        const declared = Math.max(Number(img.getAttribute('width')) || 0, Number(img.getAttribute('height')) || 0);
        // 그려진 크기도 선언된 크기도 모두 작을 때만 아이콘으로 본다.
        // (레이지 이미지는 아직 로드 전이라 naturalWidth 가 0이거나 작을 수 있다)
        if (shown && shown < 60 && declared < 60) { rej.tinyImage++; return; }
        if (!shown && !declared && img.naturalWidth && img.naturalWidth < 40) { rej.tinyImage++; return; }
      }
      const path = href.pathname.replace(/\/+$/, '');
      if (path.length < 8) { rej.shortPath++; return; }
      if (NON_PRODUCT_PATH.test(path)) { rej.nonProduct++; return; }
      if (path === here) { rej.samePage++; return; }        // 지금 보고 있는 목록 페이지 자체
      if (here.startsWith(path + '/')) { rej.samePage++; return; }   // 상위 카테고리(브레드크럼)
      const key = href.origin + path;
      if (seen.has(key)) { rej.dup++; return; }
      seen.add(key);
      const nameEl = card.querySelector('h1,h2,h3,h4,[class*="name"],[class*="title"],[class*="Name"],[class*="Title"]');
      const name = ((img && img.alt) || (nameEl && nameEl.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 150);
      if (name && BANNER_NAME.test(name)) {          // "Click to shop" 류 카테고리 타일
        rej.banner++;
        // 같은 구역(현재 경로의 부모 아래)에 있는 타일이면 하위/형제 카테고리로 기억한다.
        // FP Movement의 /fpmovement/workout-tops/ 는 형제인 /fpmovement/casual-tops/ 를
        // 타일로 보여 준다 — 자식만 보면 놓친다. 상품으로는 쓰지 않는다.
        if (here) {
          const parent = here.slice(0, here.lastIndexOf('/'));
          if (parent && path !== here && path.startsWith(parent + '/')) {
            subCats.add(href.origin + href.pathname);
          }
        }
        return;
      }
      const pr = priceOf(card);
      // 조각 하나짜리 짧은 경로는 하위 카테고리 타일일 때가 많다
      // (Ann Taylor 의 /cat5310001, /cata7000090 — 22개가 상품으로 들어가 있었다).
      // 다만 그런 모양의 진짜 상품 URL 도 있어서, 가격이 없을 때만 버린다 —
      // 상품 카드에는 대개 가격이 붙고 카테고리 타일에는 안 붙는다.
      if (!pr.price && path.split('/').filter(Boolean).length <= 1 && path.length < 16) {
        rej.landing++;
        return;
      }
      items.push({
        name: name || decodeURIComponent(path.split('/').pop() || '').replace(/[-_]+/g, ' '),
        imageUrl: src, productUrl: href.origin + href.pathname,
        price: pr.price, priceOrig: pr.priceOrig, category: guessCategory(href.pathname, name),
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

  // 상품 그리드가 나타날 때까지 먼저 기다린다. 느린 SPA(Massimo Dutti·Oysho 등)는
  // 첫 렌더가 늦어서, 바로 훑으면 몇 개만 잡고 끝난다.
  for (let i = 0; i < 20 && harvest().length < 4; i++) await sleep(400);

  // 스크롤 + "더 보기" 클릭을 상품 수가 늘지 않을 때까지 반복(무한스크롤·버튼형 모두 대응).
  // 예전에는 500ms×3회(=1.5초)만 안 늘면 끝냈는데, 다음 묶음을 받아오는 데 2~3초 걸리는
  // 사이트에서는 그 사이에 멈춰 버렸다. 기다림을 늘려 실제로 다 받을 때까지 본다.
  let stable = 0, lastCount = -1;
  for (let i = 0; i < 80; i++) {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(700);
    const btn = findLoadMore();
    if (btn) { try { btn.click(); } catch (e) {} await sleep(1500); }
    const n = harvest().length;
    if (n === lastCount) { if (++stable >= (btn ? 6 : 5)) break; } else { stable = 0; lastCount = n; }
  }
  window.scrollTo(0, 0);
  await sleep(250);
  const out = harvest();
  return { items: out, nextUrl: findNext(), subCats: [...subCats].slice(0, 8), rej: { ...rej } };
}
