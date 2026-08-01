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
  // 상품이 아니라 카테고리·배너 링크인지 판별.
  // 목록 페이지 상단에는 하위 카테고리 타일("Tanks & Camis. Click to shop.")과
  // 로고·브레드크럼이 이미지와 함께 있어서, 그냥 두면 상품인 척 섞여 들어온다.
  const BANNER_NAME = /click to shop|shop the look|discover now|^\s*(shop\b|discover\b|explore\b|view all|see all|shop all|new arrivals?\b|browse\b)|\blogo\b/i;

  const harvest = () => {
    const here = location.pathname.replace(/\/+$/, '');
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
      if (path === here) return;                     // 지금 보고 있는 목록 페이지 자체
      if (here.startsWith(path + '/')) return;       // 상위 카테고리(브레드크럼)
      const key = href.origin + path;
      if (seen.has(key)) return;
      seen.add(key);
      const nameEl = card.querySelector('h1,h2,h3,h4,[class*="name"],[class*="title"],[class*="Name"],[class*="Title"]');
      const name = ((img && img.alt) || (nameEl && nameEl.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 150);
      if (name && BANNER_NAME.test(name)) return;    // "Click to shop" 류 카테고리 타일
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
