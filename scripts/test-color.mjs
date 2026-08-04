#!/usr/bin/env node
// 컬러웨이 추출 회귀 테스트 — worker/fabric-extractor.js 의 colorFromHtml/cleanColor.
//
// 색은 상품명에 없는 경우가 많고("한정판: Olive Tree", "코어") 사전에 없는 고유
// 이름이 흔하다. 그래서 색상 단어를 추측하지 않고 페이지의 "선택 옵션" 표기를
// 그대로 가져온다. 반대로 아무 문자열이나 색으로 넘기면 엑셀이 더 헷갈려지므로,
// 잡음(#hex, "Select", 숫자)을 거르는 쪽도 함께 검사한다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const i = src.indexOf("const COLOR_JUNK");
const j = src.indexOf("function titleCase");
if (i < 0 || j < 0) { console.error("❌ colorFromHtml 블록을 찾지 못함"); process.exit(1); }
const colorFromHtml = new Function(src.slice(i, j) + "\n return colorFromHtml;")();

const CASES = [
  // ── 실제 화면에서 확인된 형태 ──
  ["한정판 라벨", '<div aria-label="색상: 한정판: Olive Tree (전체 보기)"></div>', "Olive Tree"],
  ["한글 색상명", '<button data-color="코어"></button>', "코어"],
  ["영문 Color: 접두어", '<div aria-label="Color: Ivory / Navy"></div>', "Ivory / Navy"],

  // ── 페이지에 심긴 JSON ──
  ["selectedColor", '<script>window.p={"selectedColor":"Olive Tree"}</script>', "Olive Tree"],
  ["colorName", '<script>{"colorName":"Ecarlate"}</script>', "Ecarlate"],
  ["color", '<script>{"color":"Sand"}</script>', "Sand"],

  // ── 선택 상자 ──
  ["선택된 option", '<option value="1" selected>Light Pink</option>', "Light Pink"],
  ["색상 select 의 첫 실제 옵션", '<select name="product-color"><option>Select</option><option>Navy Blue</option></select>', "Navy Blue"],
  ["색상과 무관한 select 는 무시", '<select name="size"><option>M</option></select>', ""],

  // ── 잡음은 색으로 넘기지 않는다 ──
  ["hex 코드", '<div data-color="#ff0000"></div>', ""],
  ["안내 문구", '<div data-color="Select"></div>', ""],
  ["숫자만", '<div data-color="12"></div>', ""],
  ["라벨만 있고 값 없음", '<div aria-label="색상:"></div>', ""],
  ["색 정보 없음", "<div>no color here</div>", ""],
  ["빈 입력", "", ""],

  // ── HTML 엔티티 ──
  ["엔티티 복원", '<div data-color="Black &amp; White"></div>', "Black & White"],
];

let bad = 0;
for (const [label, html, want] of CASES) {
  const got = colorFromHtml(html);
  if (got !== want) {
    bad++;
    console.error(`❌ ${label}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got)}`);
  }
}
if (bad) { console.error(`\n컬러 추출 ${bad}/${CASES.length} 실패`); process.exit(1); }
console.log(`✅ 컬러 추출 ${CASES.length}건 통과`);
