#!/usr/bin/env node
// 웹 아카이브 보관본을 받아도 되는지 가르는 규칙(scripts/wayback-guard.mjs)을 못 박는다.
//
// 왜 있는 테스트인지: 11/24 실측에서 보관본이 '상품'의 혼용률을 찾아 준 것 중 셋이 거짓이었다 —
// 상품으로 잘못 저장된 카테고리 주소(Aritzia /intl/en/new · Joules …/tops/t-shirts ·
// &Other Stories /en-us/bags/)의 보관본은 목록 페이지라, 카드 하나의 소재가 그대로 박힌다.
// 걸러 내지 못하면 틀린 혼용률이 엑셀로 나가고, 옳은 값으로 여겨져 다시 읽지도 않는다.
// 반대로 너무 세게 거르면 진짜 상품(Arket·Zara·Reformation …)의 혼용률을 버린다.
//
// 두 겹을 따로 본다 — 주소 규칙(urlGuard) 없이도 페이지 검사(archivePageCheck)만으로
// 세 오탐이 걸러져야 하고, 주소 규칙만으로도 걸러져야 한다.
//   node scripts/test-wayback-guard.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { urlGuard, urlKey, archivePageCheck, archivedOriginal, archivedTimestamp, samePage, isCategoryName } from "./wayback-guard.mjs";
import { GOOD, BAD } from "./fixtures/wayback-pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// 섬유 이름은 worker 의 FIBRES 에서(야간 보강과 같은 목록).
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const i = workerSrc.indexOf("const FIBRES = {");
const FIBRE_NAMES = Object.keys(new Function(workerSrc.slice(i, workerSrc.indexOf("};", i) + 2) + "\n return FIBRES;")());

// ── ① 주소 규칙 ──
const URLS = [
  // 거를 것 — 실측 오탐 셋과 같은 모양
  ["Aritzia new(오탐)", "https://www.aritzia.com/intl/en/new", false],
  ["Joules t-shirts(오탐)", "https://www.joules.com/shop/womens/clothing/tops/t-shirts", false],
  ["&Other Stories bags(오탐)", "https://www.stories.com/en-us/bags/", false],
  ["Joules rugby-shirts", "https://www.joules.com/shop/womens/clothing/tops/rugby-shirts", false],
  ["&Other Stories shoes", "https://www.stories.com/en-us/shoes/", false],
  ["Lululemon /c/", "https://shop.lululemon.com/c/women-t-shirts/n1oyr3zwx7wzydf5", false],
  ["Chico's category", "https://www.chicos.com/store/category/dresses/cat40004", false],
  ["Shopify collection", "https://veronicabeard.com/collections/tops", false],
  ["Adidas black_friday", "https://www.adidas.com/us/black_friday", false],
  ["Adidas men-trending", "https://www.adidas.com/us/men-trending", false],
  ["Sezane collection", "https://www.sezane.com/us-en/octobre-editions/collection", false],
  ["매거진", "https://www.thewhitecompany.com/uk/magazine/sleep", false],
  ["최상위 짧은 경로", "https://www.anntaylor.com/cat5310001", false],
  // 11/24 측정 실행(45303192170)에서 보관본 검사까지 가서야 걸린 카테고리 주소들
  ["Adidas women-black_friday", "https://www.adidas.com/us/women-black_friday", false],
  ["Adidas women-prime", "https://www.adidas.com/us/women-prime", false],
  ["Aritzia sweatsuit-sets", "https://www.aritzia.com/intl/en/clothing/sweatsuit-sets", false],
  ["Aritzia workout-clothes", "https://www.aritzia.com/intl/en/clothing/womens-workout-clothes", false],
  ["Aritzia discover", "https://www.aritzia.com/intl/en/discover", false],
  ["Aritzia 상품(/product/…/번호)", "https://www.aritzia.com/intl/en/product/pacino-vest/113937.html", true],
  ["Adidas 상품", "https://www.adidas.com/us/adidas-x-farm-rio-dress/KR0258.html", true],
  // 남길 것 — 실측 보고서의 진짜 상품 주소
  ["Arket", "https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/", true],
  ["Zara(쿼리)", "https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=615161645", true],
  ["Reformation", "https://www.thereformation.com/products/veya-silk-top/1319462USE.html?dwvar_1319462USE_color=USE", true],
  ["Mango", "https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/07/00", true],
  ["Chico's", "https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular", true],
  ["Free People", "https://www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/", true],
  ["H&M", "https://www2.hm.com/en_us/productpage.1378282001.html", true],
  ["Massimo Dutti", "https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106", true],
  ["Anthropologie", "https://www.anthropologie.com/shop/maeve-sequined-baby-tee", true],
  ["Fatface", "https://www.fatface.com/style/sv299843/968669", true],
  ["Patagonia", "https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html", true],
  ["Shopify 상품", "https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote", true],
  ["Shopify 컬렉션 아래 상품", "https://shop.example.com/collections/tops/products/linen-tee", true],
  ["상품명에 bag 낱말(조각 아님)", "https://www.example.com/p/baggy-jeans-123", true],
];
for (const [label, url, want] of URLS) {
  const g = urlGuard(url, null);
  if (g.ok !== want) fail(`주소 ${label}: ${url} → 기대 ${want ? "통과" : "거부"}, 실제 ${g.ok ? "통과" : "거부(" + g.reason + ")"}`);
}
// 카테고리 URL 목록과 같은 주소(끝 '/'·쿼리·www 무시)
{
  const set = new Set([urlKey("https://www.aritzia.com/intl/en/clothing/coats-jackets/puffers/thesuperpuff/")]);
  const g = urlGuard("https://aritzia.com/intl/en/clothing/coats-jackets/puffers/thesuperpuff?lang=en", set);
  if (g.ok) fail("카테고리 URL 목록과 같은 주소를 통과시켰다");
  if (!urlGuard("https://aritzia.com/intl/en/clothing/coats-jackets/puffers/thesuperpuff/sp-123", set).ok)
    fail("카테고리 URL 아래의 다른 주소까지 거부했다(같은 주소만 거른다)");
}
// h1·주소 조각의 카테고리 이름 판정
for (const [s, want] of [["New", true], ["Women's T-Shirts", true], ["rugby-shirts", true], ["Bags", true],
  ["Heavyweight T-shirt", false], ["veya-silk-top", false], ["thesuperpuff", false], ["Rugby Shirts 2 Pack", false]]) {
  if (isCategoryName(s) !== want) fail(`isCategoryName("${s}") → 기대 ${want}`);
}

// ── ② 보관본 페이지 검사 ──
for (const [k, html] of Object.entries(GOOD)) {
  const r = archivePageCheck(html, FIBRE_NAMES);
  if (!r.ok) fail(`진짜 상품 페이지(${k})를 거부했다: ${r.reason} ${JSON.stringify(r.signals)}`);
}
const WANT_REASON = {
  aritziaNew: /상품 표시 없음/, aritziaNewLd: /목록 페이지/, joulesTshirts: /가격·담기|상품 표시 없음/,
  joulesNamed: /가격·담기/, storiesBags: /목록 페이지/, storiesBagsFlat: /상품 여러 개/,
  listingWithOg: /혼용률 여러 벌/, noSignal: /상품 표시 없음/,
};
for (const [k, html] of Object.entries(BAD)) {
  const r = archivePageCheck(html, FIBRE_NAMES);
  if (r.ok) fail(`목록 페이지(${k})를 통과시켰다: ${JSON.stringify(r.signals)}`);
  else if (WANT_REASON[k] && !WANT_REASON[k].test(r.reason)) fail(`목록 페이지(${k})의 거부 사유가 기대와 다르다: ${r.reason}`);
}

// ── ③ 보관본 주소 풀기 · 리다이렉트 비교 ──
{
  const fin = "https://web.archive.org/web/20260712093011id_/https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/";
  if (archivedOriginal(fin) !== "https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/") fail("보관본 주소에서 원본을 못 꺼냈다");
  if (archivedTimestamp(fin) !== "20260712093011") fail("보관본 주소에서 날짜를 못 꺼냈다");
  if (!samePage(archivedOriginal(fin), "http://arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001")) fail("http/www/끝 '/' 차이를 다른 주소로 봤다");
  if (samePage("https://www.zara.com/us/en/woman-tshirts-l1362.html", "https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html")) fail("다른 경로를 같은 페이지로 봤다");
  if (!samePage("https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=1", "https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html")) fail("쿼리 차이를 다른 페이지로 봤다");
}

// ── ④ 상품이 아닌 경로 조각 목록이 점검·수집기와 같은가 ──
{
  const segs = (rel, marker) => {
    const src = readFileSync(join(ROOT, rel), "utf8");
    const a = src.indexOf(marker);
    return a < 0 ? null : src.slice(a, src.indexOf("]", a)).match(/'[^']+'|"[^"]+"/g).map((x) => x.slice(1, -1)).join("|");
  };
  const mine = segs("scripts/wayback-guard.mjs", "const NON_PRODUCT_SEGMENTS = [");
  const aud = segs("scripts/audit-catalogs.mjs", "const NON_PRODUCT_SEGMENTS = [");
  if (!mine || mine !== aud) fail("wayback-guard 의 NON_PRODUCT_SEGMENTS 가 audit-catalogs.mjs 와 다르다 — 같이 고칠 것");
}

if (bad) { console.error(`\n아카이브 가드 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 아카이브 가드 통과 — 주소 ${URLS.length}건 · 상품 페이지 ${Object.keys(GOOD).length} · 목록 페이지 ${Object.keys(BAD).length} · 주소 풀기·비교`);
