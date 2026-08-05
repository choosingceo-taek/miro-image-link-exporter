#!/usr/bin/env node
// 본문 텍스트에서 혼용률 뽑기 회귀 테스트.
// worker/fabric-extractor.js 의 compFromText() 를 그대로 떼어 실행한다.
//
// 이 경로가 성공할수록 AI 호출이 줄어든다 = "AI 보강이 필요해 잠시 대기" 가 사라진다.
// 반대로 "20% OFF" 를 섬유로 오인하면 엉터리 혼용률이 엑셀에 실린다. 양쪽 다 잡는다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");

const i = src.indexOf("const FIBRES = {");
const j = src.indexOf("\n}", src.indexOf("function compFromText(text) {")) + 2;
if (i < 0 || j < 2) { console.error("❌ compFromText 블록을 찾지 못함"); process.exit(1); }
const compFromText = new Function(src.slice(i, j) + "\n return compFromText;")();

const asStr = (c) => c.map((x) => `${x.material} ${x.percent}%`).join(" / ");

const CASES = [
  // ── 정상적으로 잡혀야 하는 표기들 ──
  ["Composition: 60% Cotton, 40% Modal", "Cotton 60% / Modal 40%"],
  ["Fabric — 100% Cotton", "Cotton 100%"],
  ["Material: Cotton 98%, Elastane 2%", "Cotton 98% / Elastane 2%"],
  ["95% Organic Cotton 5% Spandex", "Cotton 95% / Elastane 5%"],       // 별칭 정규화
  ["Made of 70% Viscose 30% Polyamide", "Viscose 70% / Nylon 30%"],
  ["소재: 폴리에스테르 65%, 레이온 35%", "Polyester 65% / Viscose 35%"],
  ["Shell: 100% Recycled Polyester", "Polyester 100%"],
  ["55% Linen / 45% Tencel", "Linen 55% / Lyocell 45%"],

  // ── 실제로 못 뽑던 본문 (2026-08-05 진단에서 나온 그대로) ──
  // 퍼센트와 섬유 이름 사이에 수식어가 끼면 예전에는 통째로 놓쳤다.
  ["Goldie — 100% Peruvian pima cotton Premium double-faced pima", "Cotton 100%"],
  ["Stateside — Our 100% Supima Cotton Slub Jersey is a lightweight knit", "Cotton 100%"],
  ["Everlane — Materials: 90% LENZING\u2122 ECOVERO\u2122 Viscose, 10% Elastane",
    "Viscose 90% / Elastane 10%"],
  ["Reformation — Made from 67% TENCEL\u2122 Lyocell, 29% Organically Grown Cotton, and 4% Elastane",
    "Lyocell 67% / Cotton 29% / Elastane 4%"],
  // 목화 품종명이 섬유 이름 자리에 그대로 오는 표기.
  ["Evereve — Material: 48% Pima, 48% Modal, 4% Spandex Jersey",
    "Cotton 48% / Modal 48% / Elastane 4%"],
  // ── 섬유가 아닌 퍼센트는 무시해야 한다 ──
  // 수식어를 허용하면 "20% off cotton" 을 소재로 읽을 위험이 생긴다. 그래서
  // 수식어 자리에 판촉 낱말이 오면 버린다 — 아래 세 건이 그 경계를 지킨다.
  ["20% off cotton tees this week only", ""],
  ["Save 15% on all linen shirts", ""],
  ["Extra 20% OFF everything today", ""],
  ["100% satisfaction guaranteed. Free returns.", ""],
  ["Save 30% on your first order", ""],
  // 할인 문구와 실제 혼용률이 섞여 있어도 혼용률만 집는다
  ["20% OFF · Composition: 80% Wool, 20% Nylon", "Wool 80% / Nylon 20%"],

  // ── 같은 섬유가 반복돼도 한 번만 ──
  ["100% Cotton. Care: machine wash. 100% Cotton lining.", "Cotton 100%"],

  // ── 합이 터무니없으면 통째로 버린다(겉감·안감·트림이 뒤섞인 페이지) ──
  ["100% Cotton 100% Polyester 100% Wool", ""],

  // 실제 화면(FABRICATION 섹션) — 섬유가 아닌 소재 표현은 무시하고 %만 잡는다
  ["FABRICATION 매우 부드러운 플리스 패브릭 폴리에스테르 100%", "Polyester 100%"],

  // ── 혼용률이 없는 페이지 ──
  ["A soft everyday tee in a relaxed fit.", ""],
  ["", ""],
];

// 확장(background.js)의 복사본 — 자립형 파일이라 복사가 불가피하다.
// 규칙이 어긋나면 확장 담당 브랜드만 다른 혼용률이 나오므로 여기서 함께 검사한다.
const extSrc = readFileSync(join(ROOT, "chrome-extension/background.js"), "utf8");
const em = (() => {
  const i = extSrc.indexOf("const FIBRES = {");
  const j = extSrc.indexOf("// 브랜드 저장 후", i);
  if (i < 0 || j < 0) { console.error("❌ background.js 의 혼용률 블록을 찾지 못함"); process.exit(1); }
  return extSrc.slice(i, j);
})();
const extComp = new Function(em + "\n return compFromText;")();

// ── compFromHtml: 페이지 HTML 전체에서 뽑기 ──────────────────────────
// 본문 16000자 밖에 있는 소재와, 스크립트(페이지 JSON) 안에만 있는 소재를 잡는다.
const hi = src.indexOf("function compWindow(s) {");
const hj = src.indexOf("const COLOR_JUNK");
if (hi < 0 || hj < 0) { console.error("❌ compFromHtml 블록을 찾지 못함"); process.exit(1); }
const compFromHtml = new Function(
  src.slice(i, j) + src.slice(hi, hj) + "\n return compFromHtml;",
)();

const pad = "<p>" + "메뉴 배너 안내 ".repeat(4000) + "</p>";
const HTML_CASES = [
  ["본문에 그대로 있으면 잡는다",
    "<div>Composition: 60% Cotton, 40% Modal</div>", "Cotton 60% / Modal 40%"],

  // compFromText 는 앞 16000자만 본다 — 메뉴가 길면 소재가 그 뒤로 밀린다.
  ["앞 16000자 밖에 있어도 잡는다",
    pad + "<div>Fabric: 95% Cotton, 5% Elastane</div>", "Cotton 95% / Elastane 5%"],

  // 아코디언 내용이 페이지 JSON 에만 담긴 형태(Next.js·Shopify 하이드레이션).
  ["스크립트 안 JSON 에만 있어도 잡는다",
    '<script id="__NEXT_DATA__">{"desc":"\\u003cp\\u003e100% Linen\\u003c/p\\u003e"}</script>',
    "Linen 100%"],
  ["이스케이프된 따옴표·슬래시를 되돌린다",
    '<script>{"body_html":"\\"Shell\\": 70% Wool, 30% Nylon"}</script>', "Wool 70% / Nylon 30%"],

  // 본문에 있으면 스크립트는 보지 않는다 — 추천 상품의 소재를 집으면 안 된다.
  ["본문이 우선, 스크립트는 안 본다",
    '<div>100% Cotton</div><script>{"d":"100% Wool"}</script>', "Cotton 100%"],

  // 스크립트 경로는 여러 상품이 섞이기 쉬워 합이 105%를 넘으면 통째로 버린다.
  ["스크립트에 여러 상품이 섞이면 버린다",
    '<script>{"a":"100% Cotton","b":"100% Wool"}</script>', ""],
  ["스크립트 한 상품의 구성은 남긴다",
    '<script>{"a":"80% Cotton, 20% Polyester"}</script>', "Cotton 80% / Polyester 20%"],

  ["할인 문구는 여전히 무시한다", "<div>Extra 20% OFF everything</div>", ""],
  ["소재가 없는 페이지", "<div>A soft everyday tee.</div>", ""],
  ["빈 입력", "", ""],
];

let bad = 0;
const extCompHtml = new Function(em + "\n return compFromHtml;")();
for (const [label, html, want] of HTML_CASES) {
  const got = asStr(compFromHtml(html));
  if (got !== want) {
    bad++;
    console.error(`❌ worker compFromHtml · ${label}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got)}`);
  }
  const got2 = extCompHtml(html);
  if (got2 !== want) {
    bad++;
    console.error(`❌ 확장 compFromHtml · ${label}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got2)}`);
  }
}

for (const [text, want] of CASES) {
  const got = asStr(compFromText(text));
  if (got !== want) {
    bad++;
    console.error(`❌ worker · ${JSON.stringify(text.slice(0, 60))}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got)}`);
  }
  // 확장 복사본은 문자열을 돌려준다 — 같은 문자열이어야 한다.
  const got2 = extComp(text);
  if (got2 !== want) {
    bad++;
    console.error(`❌ 확장 · ${JSON.stringify(text.slice(0, 60))}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got2)}`);
  }
}
// ── 회귀 방지: 배열을 그대로 저장하지 않는지 ─────────────────────────
// compFromText/compFromHtml 은 [{material,percent}] 를 돌려준다. 백필이 이걸
// 문자열로 바꾸지 않고 저장하면 엑셀 혼용률 칸에 '[object Object],[object Object]'
// 가 들어간다. 실제로 그렇게 저장돼 있었고, 채움률까지 그만큼 부풀려 보였다.
{
  const enrich = readFileSync(join(ROOT, "scripts/enrich-comp.mjs"), "utf8");
  const lines = enrich.split("\n");
  for (let n = 0; n < lines.length; n++) {
    if (!/\bcomp:/.test(lines[n])) continue;
    // 삼항 연산자로 여러 줄에 걸치므로 뒤 두 줄까지 같은 식으로 본다.
    const stmt = lines.slice(n, n + 3).join(" ");
    if (!/compFromText|compFromHtml|ld\.composition/.test(stmt)) continue;
    if (stmt.includes("asComp(")) continue;
    bad++;
    console.error(`❌ enrich-comp: 배열을 문자열로 바꾸지 않았다 — asComp() 로 감쌀 것\n   ${lines[n].trim()}`);
  }
}

if (bad) { console.error(`\n혼용률 추출 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 혼용률 추출 ${CASES.length}건 통과 (worker·확장 두 구현 일치) · HTML 전체 ${HTML_CASES.length}건 통과`);
