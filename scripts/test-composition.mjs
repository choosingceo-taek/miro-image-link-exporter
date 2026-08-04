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

  // ── 섬유가 아닌 퍼센트는 무시해야 한다 ──
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

let bad = 0;
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
if (bad) { console.error(`\n혼용률 추출 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 혼용률 추출 ${CASES.length}건 통과 (worker·확장 두 구현 일치)`);
