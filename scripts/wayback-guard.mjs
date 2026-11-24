// 웹 아카이브(web.archive.org) 보관본에서 혼용률을 가져와도 되는지 가르는 규칙.
//
// 왜 따로 있나: 보관본은 '그 주소에 예전에 있던 페이지'다. 주소가 상품이 아니라 카테고리
// 목록이면 목록에 섞인 상품 하나의 소재가 그 '상품'의 혼용률로 박힌다. 실측(try-engines,
// 11/24)에서 실제로 그랬다 — Aritzia /intl/en/new → "Wool 100%", Joules /shop/womens/
// clothing/tops/t-shirts → "Cotton 100%", &Other Stories /en-us/bags/ → "Cotton 100%".
// 셋 다 상품으로 잘못 저장된 카테고리 주소다. 그래서 두 겹으로 거른다.
//
//   ① urlGuard — 주소만 보고 상품이 아닌 것을 뺀다(아카이브에 묻기 전, 접속 0회).
//   ② archivePageCheck — 받은 보관본이 '상품 하나의 페이지'인지 본다.
//
// 야간 보강(scripts/enrich-comp.mjs)이 쓰고, scripts/test-wayback-guard.mjs 가 못 박는다.
// 네트워크를 쓰지 않는 순수 함수만 둔다.

// 상품 상세 페이지가 아닌 것이 확실한 경로 조각 — scripts/audit-catalogs.mjs ·
// chrome-extension/collector.js 와 같은 목록이다(테스트가 셋이 같은지 본다).
const NON_PRODUCT_SEGMENTS = [
  "account", "login", "signin", "register", "cart", "bag", "basket", "checkout", "wishlist",
  "gift-?cards?", "e-?gift", "size-?(?:guide|chart)", "help", "faq", "contact",
  "customer-?(?:service|care)", "store-?locator", "find-a-stores?", "our-stores?",
  "blogs?", "journal", "magazine", "press", "about(?:-us)?", "careers?", "jobs?",
  "returns?", "shipping", "delivery", "terms", "privacy", "cookies?", "legal",
  "sitemap", "search", "newsletter", "subscribe", "sustainability", "lookbook",
  "campaigns?", "editorial", "inspiration", "guides?", "how-to", "klarna", "afterpay",
  "loyalty", "rewards", "affiliates?",
];
export const NON_PRODUCT_PATH = new RegExp("/(?:" + NON_PRODUCT_SEGMENTS.join("|") + ")(?:/|$)", "i");

// 카테고리 이름으로만 쓰이는 낱말. 주소의 마지막 조각이 이것뿐이면 목록 페이지다.
const CATEGORY_WORDS = new Set((
  "new new-in new-arrivals whats-new just-in trending sale clearance outlet offers black-friday " +
  "bestsellers best-sellers bags shoes accessories jewelry jewellery clothing apparel " +
  "women womens woman men mens man kids girls boys unisex " +
  "tops t-shirts tshirts tees shirts blouses shirts-blouses dresses skirts pants trousers jeans denim " +
  "shorts knitwear knits sweaters jumpers cardigans sweatshirts hoodies jackets coats coats-jackets " +
  "outerwear puffers blazers suits activewear loungewear swimwear lingerie sleepwear tanks " +
  "collection collections all view-all shop-all basics essentials gifts edit discover " +
  "black friday cyber monday prime holiday"
).split(/\s+/));
// 마지막 낱말이 이 복수형이면 카테고리일 공산이 크다("rugby-shirts", "womens-tops").
const PLURAL_GARMENT = /^(?:shirts|t-?shirts|tees|tops|blouses|dresses|skirts|pants|trousers|jeans|shorts|sweaters|jumpers|cardigans|sweatshirts|hoodies|jackets|coats|puffers|blazers|knits|tanks|bags|shoes|accessories|arrivals|clothing|clothes|sets)$/;
// 이 이름의 경로 조각이 있으면 카테고리 트리 안이다(Lululemon /c/…, Chico's /store/category/…).
const CATEGORY_SEGMENTS = new Set(["c", "category", "categories", "browse", "shop-by"]);

// "new" · "t-shirts" · "rugby-shirts" · "Women's T-Shirts" 처럼 카테고리 이름으로 보이는가.
// 숫자가 있으면 상품 번호가 붙은 것이라 아니라고 본다.
export function isCategoryName(name) {
  const t = String(name || "").toLowerCase().replace(/[’'&]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
  if (!t || /\d/.test(t)) return false;
  if (CATEGORY_WORDS.has(t)) return true;
  const words = t.split("-").filter(Boolean);
  // 낱말이 전부 카테고리 낱말("men-trending", "womens-new")이거나,
  // 셋 이하이고 마지막이 복수형 옷 이름("rugby-shirts")이면 카테고리.
  if (words.every((w) => CATEGORY_WORDS.has(w))) return true;
  return words.length <= 3 && PLURAL_GARMENT.test(words[words.length - 1]);
}

const normHost = (h) => String(h || "").toLowerCase().replace(/^www\d?\./, "");
// 비교용 주소: 호스트(www 제외) + 경로(소문자, 끝 '/' 제외). 쿼리·조각은 버린다.
export function urlKey(u) {
  try {
    const x = new URL(u);
    return normHost(x.hostname) + x.pathname.toLowerCase().replace(/\/+$/, "");
  } catch (e) { return ""; }
}

// ① 주소 규칙. { ok } 또는 { ok:false, reason }.
// categorySet: 그 브랜드(들)의 카테고리 URL 의 urlKey 집합 — 있으면 '같은 주소'를 뺀다.
//
// 규칙(위에서부터):
//   a. 상품이 아닌 경로 조각(점검·수집기와 같은 목록) — /bags/, /help/ …
//   b. 알려진 카테고리 URL 과 같은 주소
//   c. 경로에 카테고리 트리 조각(/c/, /category/ …)이 있다
//   d. /collections/ 아래인데 /products/ 가 없다(Shopify 목록)
//   e. 마지막 조각이 숫자 없는 카테고리 낱말뿐이다 — new · t-shirts · rugby-shirts · womens-tops
//      (낱말 셋 이하이고 마지막 낱말이 복수형 옷 이름이면 카테고리로 본다. 숫자가 있으면
//       상품 번호가 붙은 것이라 상품으로 둔다)
//   f. 경로가 조각 하나에 16자 미만(랜딩 페이지 — 점검의 같은 규칙)
// 진짜 상품을 몇 개 놓치더라도(예: 상품명이 "cargo-pants" 하나뿐인 주소) 틀린 혼용률을
// 박는 것보다 낫다 — 놓친 상품은 '확인 필요'로 남아 확장이 채운다.
export function urlGuard(url, categorySet) {
  let x;
  try { x = new URL(url); } catch (e) { return { ok: false, reason: "주소 형식 오류" }; }
  const path = x.pathname.replace(/\/+$/, "");
  if (NON_PRODUCT_PATH.test(path)) return { ok: false, reason: "상품이 아닌 경로" };
  if (categorySet && categorySet.has(urlKey(url))) return { ok: false, reason: "카테고리 URL 과 같은 주소" };
  const segs = path.split("/").filter(Boolean).map((s) => s.toLowerCase());
  if (segs.some((s) => CATEGORY_SEGMENTS.has(s))) return { ok: false, reason: "카테고리 경로" };
  if (segs.includes("collections") && !segs.includes("products")) return { ok: false, reason: "카테고리 경로" };
  const last = (segs[segs.length - 1] || "").replace(/\.html?$/, "");
  if (isCategoryName(last)) return { ok: false, reason: "카테고리 이름 주소" };
  if (segs.length <= 1 && path.length < 16) return { ok: false, reason: "최상위 짧은 경로" };
  return { ok: true };
}

// 보관본 주소(…/web/<ts>[id_]/<원본>)에서 원본 URL 을 꺼낸다. 못 꺼내면 "".
export function archivedOriginal(finalUrl) {
  const m = String(finalUrl || "").match(/\/(\d{4,14})(?:[a-z]{2}_)?\/(https?:\/\/.+)$/i);
  return m ? m[2] : "";
}
export function archivedTimestamp(finalUrl) {
  const m = String(finalUrl || "").match(/\/(\d{4,14})(?:[a-z]{2}_)?\/https?:\/\//i);
  return m ? m[1] : "";
}
// 보관본이 다른 주소로 넘어갔나 — 원래 페이지가 리다이렉트였으면 아카이브는 넘어간 곳의
// 보관본을 준다(단종 상품 → 카테고리 목록이 흔하다). 경로까지 같아야 같은 상품으로 본다.
export function samePage(a, b) {
  const ka = urlKey(a), kb = urlKey(b);
  return !!ka && ka === kb;
}

// ── ② 보관본이 상품 하나의 페이지인가 ──────────────────────────────
// 규칙(말로):
//   받아들이려면 '상품 하나' 표시가 있어야 하고, '목록' 표시가 하나도 없어야 한다.
//   상품 하나 표시(하나 이상):
//     P1. JSON-LD 에 최상위 Product(목록 안이 아닌 것)가 있고 이름이 1~2가지다
//     P2. og:type 이 product(product.item 등)
//     P3. <h1> 이 정확히 하나이고, 그 글이 카테고리 낱말이 아니고, '장바구니에 담기' 버튼 글이 있다
//   목록 표시(하나라도 있으면 거부):
//     L1. JSON-LD 에 CollectionPage · SearchResultsPage 가 있다
//     L2. 최상위 Product 가 없는데 ItemList 에 항목이 3개 이상이다
//     L3. 최상위 Product 의 이름이 3가지 이상이다
//     L4. 서로 다른 혼용률 덩어리가 3벌 이상이다(상품 카드마다 "100% Cotton" 이 따로 붙은 목록).
//         겉감·안감·배색처럼 한 상품의 여러 원단은 붙어 있어 한 덩어리로 묶인다.
//     L5. 상품 하나 표시가 P3 뿐인데 화면에 가격이 8번 이상 나오거나 '담기' 버튼이 3개 이상이다
//         (카드마다 '빠른 담기'가 붙은 목록. 가격이 다 같아도 횟수로 잡힌다)
//   상품 표시가 하나도 없으면 거부한다('상품 표시 없음') — 판단할 근거가 없으면 받지 않는다.
// 오탐 셋(Aritzia new · Joules t-shirts · &Other Stories bags)은 주소 규칙에서도 걸리지만,
// 이 검사도 따로 그 셋을 걸러야 한다(테스트가 주소 규칙 없이 이 검사만 돌려 본다).
const ADD_TO_CART_RX = /add\s+to\s+(?:bag|cart|basket)|장바구니\s*담기/gi;
const LISTING_TYPES = new Set(["CollectionPage", "SearchResultsPage", "OfferCatalog"]);

function jsonLdNodes(html) {
  const out = [];
  const rx = /<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = rx.exec(html))) {
    try { out.push(JSON.parse(m[1].trim())); } catch (e) {}
  }
  return out;
}
const typesOf = (n) => [].concat((n && n["@type"]) || []).map(String);

function scanLd(html) {
  const r = { types: new Set(), rootProducts: new Set(), listProducts: 0, itemListLen: 0 };
  // inList: ItemList 안 · inProduct: Product 안(변형·추천 상품)
  const walk = (n, inList, inProduct, depth) => {
    if (!n || typeof n !== "object" || depth > 12) return;
    if (Array.isArray(n)) { for (const x of n) walk(x, inList, inProduct, depth + 1); return; }
    const ts = typesOf(n);
    for (const t of ts) r.types.add(t);
    const isProd = ts.some((t) => t === "Product" || t === "ProductGroup");
    const isList = ts.includes("ItemList");
    if (isProd) {
      if (inList) r.listProducts++;
      else if (!inProduct) r.rootProducts.add(String(n.name || "").trim().toLowerCase().split(/\s+[-–|]\s+/)[0] || "?");
    }
    if (isList) {
      const els = n.itemListElement;
      r.itemListLen = Math.max(r.itemListLen, Array.isArray(els) ? els.length : 0);
    }
    for (const [k, v] of Object.entries(n)) {
      if (k === "@context") continue;
      walk(v, inList || isList, inProduct || isProd, depth + 1);
    }
  };
  for (const n of jsonLdNodes(html)) walk(n, false, false, 0);
  return r;
}

// 화면 글(스크립트·스타일 제외)과 스크립트까지 포함한 글. 혼용률은 페이지 JSON 에 있을 때도 많다.
const visibleText = (html) => String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
const allText = (html) => String(html || "").replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ").replace(/\\u0025/gi, "%").replace(/&nbsp;|&#37;|&percnt;/g, (x) => (x === "&nbsp;" ? " " : "%"))
  .replace(/\s+/g, " ");

// 혼용률 덩어리: "NN% 섬유" / "섬유 NN%" 를 찾아, 300자 넘게 떨어지거나 같은 섬유가 다시
// 나오면 다른 덩어리로 본다(목록에서는 카드가 붙어 있어 거리만으로는 못 가른다).
// 덩어리마다 '섬유 퍼센트' 묶음을 정렬해 서명으로 만들고, 서로 다른 서명 수를 센다.
export function compBlocks(html, fibreNames, sigsOut) {
  const names = [...new Set((fibreNames || []).map((s) => String(s).toLowerCase()))]
    .sort((a, b) => b.length - a.length).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!names.length) return 0;
  const f = "(" + names.join("|") + ")";
  const rx = new RegExp(`(\\d{1,3})\\s?%\\s*${f}\\b|\\b${f}\\s*:?\\s*(\\d{1,3})\\s?%`, "gi");
  const text = allText(html);
  const blocks = [];
  let cur = null, m;
  while ((m = rx.exec(text))) {
    const pct = m[1] || m[4], fib = (m[2] || m[3] || "").toLowerCase();
    if (!cur || m.index - cur.end > 300 || cur.fibs.has(fib)) { cur = { items: new Set(), fibs: new Set(), end: 0 }; blocks.push(cur); }
    cur.items.add(fib + " " + Number(pct));
    cur.fibs.add(fib);
    cur.end = m.index + m[0].length;
  }
  const sigs = new Set(blocks.map((b) => [...b.items].sort().join("/")));
  if (sigsOut) sigsOut.push(...[...sigs].slice(0, 4));
  return sigs.size;
}

// 화면에 가격이 나오는 횟수(같은 가격도 따로 센다).
export function priceCount(html) {
  const rx = /(?:[$£€]|USD|GBP|EUR|CAD|AUD)\s?\d{1,5}(?:[.,]\d{2})?/g;
  return (visibleText(html).match(rx) || []).length;
}

function h1s(html) {
  const out = [];
  const rx = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let m;
  while ((m = rx.exec(String(html || "")))) out.push(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  return out;
}

// fibreNames: 섬유 이름 목록(worker 의 FIBRES 키). { ok, reason, signals } 를 돌려준다.
export function archivePageCheck(html, fibreNames) {
  const s = String(html || "");
  const ld = scanLd(s);
  const og = /<meta[^>]+property=["']og:type["'][^>]*content=["']\s*(?:og:)?product/i.test(s) ||
    /<meta[^>]+content=["']\s*(?:og:)?product[^"']*["'][^>]*property=["']og:type["']/i.test(s);
  const heads = h1s(s);
  const h1Generic = heads.length === 1 && isCategoryName(heads[0]);
  const sigs = [];
  const blocks = compBlocks(s, fibreNames, sigs);
  const title = ((s.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1] || "").replace(/\s+/g, " ").trim().slice(0, 60);
  const prices = priceCount(s);
  const carts = (visibleText(s).match(ADD_TO_CART_RX) || []).length;
  const P1 = ld.rootProducts.size >= 1 && ld.rootProducts.size <= 2;
  const P2 = og;
  const P3 = heads.length === 1 && heads[0].length >= 2 && heads[0].length <= 150 && !h1Generic && carts >= 1;
  const signals = { rootProducts: ld.rootProducts.size, listProducts: ld.listProducts, itemList: ld.itemListLen,
    og, h1: heads.length, blocks, prices, carts, sigs, title, types: [...ld.types].slice(0, 6) };
  if ([...ld.types].some((t) => LISTING_TYPES.has(t))) return { ok: false, reason: "목록 페이지(JSON-LD)", signals };
  if (!ld.rootProducts.size && (ld.itemListLen >= 3 || ld.listProducts >= 3)) return { ok: false, reason: "목록 페이지(JSON-LD)", signals };
  if (ld.rootProducts.size >= 3) return { ok: false, reason: "상품 여러 개(JSON-LD)", signals };
  if (blocks >= 3) return { ok: false, reason: "혼용률 여러 벌(목록)", signals };
  if (!P1 && !P2 && P3 && (prices >= 8 || carts >= 3)) return { ok: false, reason: "가격·담기 버튼 여러 개(목록)", signals };
  if (!P1 && !P2 && !P3) return { ok: false, reason: "상품 표시 없음", signals };
  return { ok: true, signals };
}
