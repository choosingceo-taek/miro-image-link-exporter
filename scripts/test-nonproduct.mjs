#!/usr/bin/env node
// 상품이 아닌 링크를 거르는 규칙의 회귀 테스트.
//
// 같은 판단이 두 곳에 있다:
//   수집기(chrome-extension/collector.js)  — 애초에 담지 않는다
//   점검(scripts/audit-catalogs.mjs)        — 담긴 뒤에 잡아낸다
// 두 규칙이 어긋나면 한쪽이 담고 다른 쪽이 계속 지적하는 상태가 된다. 실제로
// 수집기에는 경로 규칙이 아예 없어서 The white company 의 /magazine/ 기사 9개와
// Ann Taylor 의 하위 카테고리 타일 22개가 매일 다시 들어갔다.
//
// 여기서는 ① 두 규칙이 같은 목록을 쓰는지 ② 실제 사례를 제대로 가르는지 본다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const col = readFileSync(join(ROOT, "chrome-extension/collector.js"), "utf8");
const aud = readFileSync(join(ROOT, "scripts/audit-catalogs.mjs"), "utf8");

// 두 파일에서 경로 조각 목록을 그대로 떼어 비교한다.
const segsOf = (src, marker) => {
  const i = src.indexOf(marker);
  if (i < 0) return null;
  const j = src.indexOf("]", i);
  return src.slice(i, j)
    .match(/'[^']+'|"[^"]+"/g)
    ?.map((s) => s.slice(1, -1))
    .filter((s) => s !== "|") ?? null;
};
const colSegs = segsOf(col, "const NON_PRODUCT_SEGMENTS = [");
const audSegs = segsOf(aud, "const NON_PRODUCT_SEGMENTS = [");

let bad = 0;
if (!colSegs) { console.error("❌ collector.js 에서 NON_PRODUCT_PATH 목록을 찾지 못함"); bad++; }
if (!audSegs) { console.error("❌ audit-catalogs.mjs 에서 NON_PRODUCT_SEGMENTS 를 찾지 못함"); bad++; }
if (colSegs && audSegs) {
  const only = (a, b) => a.filter((x) => !b.includes(x));
  const missCol = only(audSegs, colSegs), missAud = only(colSegs, audSegs);
  if (missCol.length) { console.error(`❌ 수집기에 없는 조각: ${missCol.join(", ")}`); bad++; }
  if (missAud.length) { console.error(`❌ 점검에 없는 조각: ${missAud.join(", ")}`); bad++; }
}

// 실제 사례 — 리포트에 찍혔던 URL 그대로.
const RX = new RegExp("/(?:" + (colSegs || []).join("|") + ")(?:/|$)", "i");
const CASES = [
  // 버려야 하는 것
  ["The white company 매거진", "/uk/magazine/sleep", true],
  ["매거진 하위", "/uk/magazine/style/lookbook", true],
  ["앱 안내", "/help/mobile-app", true],
  ["블로그 글", "/blogs/news/summer-picks", true],
  ["사이즈 안내", "/size-guide", true],
  ["매장 찾기", "/store-locator/seoul", true],
  // 남겨야 하는 것 — 낱말이 상품명 안에 들어 있을 뿐이다
  ["상품명에 help", "/products/help-me-tee", false],
  ["상품명에 guide", "/womens/guide-jacket", false],
  ["상품명에 search", "/p/searchlight-dress", false],
  ["상품명에 about", "/aboutface-serum", false],
  ["Leset 안내 글(/pages/)", "/pages/fabric-set-guide", true],
  ["Me+Em 매장 안내", "/us/stores", true],
  ["상품명에 pages", "/products/pages-tee", false],
  ["평범한 상품", "/womens/clothing/tops/ribbed-tank-12345", false],
];
for (const [label, path, want] of CASES) {
  const got = RX.test(path);
  if (got !== want) { bad++; console.error(`❌ ${label}: ${path} → 기대 ${want} 실제 ${got}`); }
}

// 최상위 짧은 경로 규칙 — 가격이 없을 때만 버린다.
// Ann Taylor 의 /cat5310001 같은 타일은 가격이 없고, 같은 모양의 진짜 상품은 가격이 붙는다.
const drop = (path, price) =>
  !price && path.split("/").filter(Boolean).length <= 1 && path.length < 16;
const LANDING = [
  ["Ann Taylor 타일", "/cat5310001", "", true],
  ["Ann Taylor 타일2", "/cata7000090", "", true],
  ["같은 모양인데 가격이 있으면 상품", "/cat5310001", "$49.50", false],
  ["긴 경로는 그대로", "/clothing/tops/ribbed-tank", "", false],
  ["조각이 둘이면 그대로", "/p/12345", "", false],
];
for (const [label, path, price, want] of LANDING) {
  const got = drop(path, price);
  if (got !== want) { bad++; console.error(`❌ ${label}: ${path} (가격 "${price}") → 기대 ${want} 실제 ${got}`); }
}

// 경로 모양 규칙(카테고리 /c/·/w/ · Inditex '-n숫자' · 이미지 파일)과 물음표 뒤 상품 번호.
// 수집기 소스에서 그 부분만 떼어 그대로 돌린다 — 테스트용 사본을 따로 두지 않는다.
const shapeSrc = col.slice(col.indexOf("const CATEGORY_PATH"), col.indexOf("  // 상품 번호가 경로가 아니라"));
const idSrc = col.slice(col.indexOf("const ID_PARAMS"), col.indexOf("  const harvest"));
const { nonProductShape, idQuery } = new Function(shapeSrc + idSrc + "\n return { nonProductShape, idQuery };")();
const SHAPE = [
  // 버려야 하는 것 — 2026-11-25 저장본·야간 표본에 실제로 있던 주소
  ["Carhartt 메뉴 타일", "https://www.carhartt.com/c/black-friday", true],
  ["Carhartt 하위 카테고리", "https://www.carhartt.com/c/women-tops-tshirt", true],
  ["Carhartt EU 카테고리", "https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017", true],
  ["Nike 필터 링크", "https://www.nike.com/w/womens-tops-t-shirts-5e1x6z9om13", true],
  ["Oysho 하위 카테고리 타일", "https://www.oysho.com/gb/womens-sports-t-shirts-n5063", true],
  ["Massimo Dutti 카테고리", "https://www.massimodutti.com/us/women/shirts-n1439", true],
  ["Sessun srcset 조각", "https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-025.webp%20924w", true],
  ["이미지 파일", "https://cdn.example.com/media/catalog/top-123.jpg", true],
  // 남겨야 하는 것
  ["Nike 상품", "https://www.nike.com/t/sportswear-chill-knit-womens-t-shirt-abc/FN3684-010", false],
  ["Carhartt 상품", "https://www.carhartt.com/product/105510/womens-relaxed-fit-tee", false],
  ["Carhartt EU 상품", "https://www.carhartt.com/en-eu/p/relaxed-fit-fleece-joggers/105510", false],
  ["Hybris 상품(/c/ 와 /p/ 함께)", "https://www.thewhitecompany.com/uk/Clothing/c/tops/p/ABC123", false],
  ["J.Crew 상품(categories 아래)", "https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334", false],
  ["Massimo Dutti 상품", "https://www.massimodutti.com/us/linen-shirt-l05812529", false],
  ["Oysho 상품", "https://www.oysho.com/gb/seamless-t-shirt-c0p123456789.html", false],
  ["J.Crew 기획전(끝이 womens)", "https://www.jcrew.com/shop/party-dressing/womens", true],
  ["J.Crew 기획전 2", "https://www.jcrew.com/shop/cold-weather-accessories/womens", true],
  ["상품명이 womens 로 끝나지 않는 상품", "https://www.example.com/products/womens-tee", false],
  ["Reformation 기획전 타일", "https://www.thereformation.com/collections/holiday-launch", true],
  ["Shopify 컬렉션 안의 상품", "https://shop.example.com/collections/tops/products/cotton-tee", false],
  ["낱말 c 로 시작하는 조각", "https://shop.example.com/cotton/cami-top-123", false],
];
for (const [label, url, want] of SHAPE) {
  const got = nonProductShape(new URL(url).pathname.replace(/\/+$/, ""));
  if (got !== want) { bad++; console.error(`❌ ${label}: ${url} → 기대 ${want} 실제 ${got}`); }
}
// 접근 지도에 실린 진짜 상품 주소(브랜드마다 표본 3개)는 하나도 버리면 안 된다.
// (Sessun 의 이미지 조각은 상품이 아니라서 제외 — 위에서 '버려야 함'으로 본다)
let real = 0;
try {
  const map = JSON.parse(readFileSync(join(ROOT, "access-map.json"), "utf8"));
  for (const b of map.brands || []) {
    for (const u of (b.product && b.product.urls) || []) {
      if (/static\.sessun\.com/.test(u.url)) continue;
      real++;
      const path = new URL(u.url).pathname.replace(/\/+$/, "");
      if (nonProductShape(path)) { bad++; console.error(`❌ 진짜 상품을 버림: ${b.brand} ${u.url}`); }
    }
  }
} catch (e) { bad++; console.error("❌ access-map.json 을 못 읽음: " + e.message); }
// 프로그램 주소인데 상품 번호가 없는 안내·기획전(Gap 계열 info.do)
const scriptSrc = col.slice(col.indexOf("  const scriptNoProduct"), col.indexOf("\n", col.indexOf("!/product|item|detail")) + 1);
const scriptNoProduct = new Function("idQuery", scriptSrc + "\n return scriptNoProduct;")(idQuery);
for (const [label, url, want] of [
  ["Gap 안내(info.do)", "https://www.gap.com/browse/info.do?cid=1234", true],
  ["Old Navy 안내(info.do)", "https://oldnavy.gap.com/browse/info.do", true],
  ["Gap 상품(pid 있음)", "https://www.gap.com/browse/product.do?pid=886594042", false],
  ["번호 없는 상품 상세(.aspx)", "https://shop.example.com/ProductDetail.aspx?code=AB12", false],
]) {
  const got = scriptNoProduct(new URL(url));
  if (got !== want) { bad++; console.error(`❌ ${label}: ${url} → 기대 ${want} 실제 ${got}`); }
}
// 새 규칙(경로 조각 pages·stores · 프로그램 주소 안내)도 접근 지도의 진짜 상품 표본은 하나도 버리면 안 된다.
try {
  const map = JSON.parse(readFileSync(join(ROOT, "access-map.json"), "utf8"));
  for (const b of map.brands || []) for (const u of (b.product && b.product.urls) || []) {
    if (/static\.sessun\.com|itunes\.apple\.com/.test(u.url)) continue;
    const x = new URL(u.url);
    if (RX.test(x.pathname) || scriptNoProduct(x)) { bad++; console.error(`❌ 새 규칙이 진짜 상품을 버림: ${b.brand} ${u.url}`); }
  }
} catch (e) { bad++; console.error("❌ access-map.json 을 못 읽음: " + e.message); }
const IDQ = [
  ["Gap 상품 번호", "https://www.gap.com/browse/product.do?pid=885858002&cid=17076#pdp-page-content", "?pid=885858002"],
  ["Athleta 상품 번호", "https://athleta.gap.com/browse/product.do?vid=1&pid=5409160220002", "?pid=5409160220002"],
  ["보통 상품 주소는 물음표 뒤를 버림", "https://www.example.com/products/tee?variant=123&pid=9", ""],
  ["프로그램 주소라도 번호가 없으면 버림", "https://www.example.com/browse/category.do?cid=17076", ""],
];
for (const [label, url, want] of IDQ) {
  const got = idQuery(new URL(url));
  if (got !== want) { bad++; console.error(`❌ ${label}: ${url} → 기대 "${want}" 실제 "${got}"`); }
}
// 다른 사이트로 가는 링크(앱 스토어 등) — 하위 도메인은 같은 사이트로 본다.
const siteSrc = col.slice(col.indexOf("const siteOf"), col.indexOf("  // 상품 번호가 경로가 아니라"));
const siteOf = new Function(siteSrc + "\n return siteOf;")();
const SITE = [
  ["FP Movement 앱 스토어", "www.freepeople.com", "itunes.apple.com", false],
  ["H&M 하위 도메인", "www2.hm.com", "www2.hm.com", true],
  ["Athleta(gap.com 하위)", "athleta.gap.com", "athleta.gap.com", true],
  ["L.L.Bean global", "global.llbean.com", "www.llbean.com", true],
  ["영국 도메인", "www.example.co.uk", "shop.example.co.uk", true],
  ["영국 도메인 — 다른 회사", "www.example.co.uk", "www.other.co.uk", false],
];
for (const [label, page, link, same] of SITE) {
  const got = siteOf(page) === siteOf(link);
  if (got !== same) { bad++; console.error(`❌ ${label}: ${page} vs ${link} → 기대 ${same} 실제 ${got}`); }
}
// 접근 지도의 진짜 상품 표본은 목록 페이지와 같은 사이트여야 한다(앱 스토어 링크 1개만 예외로 버려져야 함).
let offReal = 0;
try {
  const map = JSON.parse(readFileSync(join(ROOT, "access-map.json"), "utf8"));
  for (const b of map.brands || []) {
    const pages = ((b.listing && b.listing.urls) || []).map((u) => siteOf(new URL(u.url).hostname));
    for (const u of (b.product && b.product.urls) || []) {
      if (!pages.length || pages.includes(siteOf(new URL(u.url).hostname))) continue;
      offReal++;
      if (!/itunes\.apple\.com/.test(u.url)) { bad++; console.error(`❌ 다른 사이트로 판정된 진짜 상품: ${b.brand} ${u.url}`); }
    }
  }
} catch (e) { bad++; console.error("❌ access-map.json 을 못 읽음: " + e.message); }
// 배너 문구(앱 내려받기·선물 가게)
const bnSrc = col.slice(col.indexOf("const BANNER_NAME"), col.indexOf("\n", col.indexOf("const BANNER_NAME")));
const BANNER_NAME = new Function(bnSrc + "\n return BANNER_NAME;")();
for (const [name, want] of [["Download on the App Store", true], ["Gifts for Her", true], ["Gift Shop", true],
  ["Cashmere Gift Sweater", false], ["Logo Tee", false], ["Women's Pima Cotton Tee", false]]) {
  if (BANNER_NAME.test(name) !== want) { bad++; console.error(`❌ 배너 문구 ${name} → 기대 ${want}`); }
}
console.log(`경로 모양 ${SHAPE.length}건 · 실제 상품 표본 ${real}건 · 물음표 상품 번호 ${IDQ.length}건 · 같은 사이트 ${SITE.length}건(표본 중 다른 사이트 ${offReal}건) 확인`);

if (bad) { console.error(`\n비상품 판별 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 비상품 판별 통과 — 경로 ${CASES.length}건 · 최상위 ${LANDING.length}건 (수집기·점검 두 규칙 일치)`);
