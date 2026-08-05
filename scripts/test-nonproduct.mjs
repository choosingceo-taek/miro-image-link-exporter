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

if (bad) { console.error(`\n비상품 판별 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 비상품 판별 통과 — 경로 ${CASES.length}건 · 최상위 ${LANDING.length}건 (수집기·점검 두 규칙 일치)`);
