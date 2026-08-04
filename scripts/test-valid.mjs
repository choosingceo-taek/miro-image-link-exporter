#!/usr/bin/env node
// 값이 "쓸 수 있는" 값인지 판정하는 규칙의 회귀 테스트.
//
// 이 규칙이 엑셀 열을 여는 기준선(95%)을 정한다. 느슨하면 잘못된 값을 채운
// 것으로 세어 기준선을 넘겨 놓고 정작 표는 못 쓰게 되고, 빡빡하면 멀쩡한
// 값을 버려서 문이 영영 안 열린다. 양쪽 다 여기서 잡는다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const i = src.indexOf("const COMP_ITEM_RX");
const j = src.indexOf("// ── 페이지 HTML 전체에서 혼용률");
if (i < 0 || j < 0) { console.error("❌ 판정 블록을 찾지 못함"); process.exit(1); }
const { validComp, validColor } = new Function(
  src.slice(i, j) + "\n return { validComp, validColor };",
)();

const COMP = [
  // ── 옳은 값 ──
  ["한 가지 섬유 100%", "Cotton 100%", true],
  ["두 가지 합 100%", "Cotton 60% / Modal 40%", true],
  ["세 가지 합 100%", "Cotton 95% / Elastane 3% / Nylon 2%", true],
  ["겉감+안감 두 겹", "Cotton 100% / Polyester 100%", true],
  ["반올림 오차 101%", "Wool 51% / Nylon 50%", true],

  // ── 버려야 하는 값 ──
  ["절반만 뽑힘 — 나머지를 놓친 것", "Cotton 60%", false],
  ["합이 어중간", "Cotton 70% / Wool 20%", false],
  ["세 겹은 과다 — 여러 상품이 섞였을 것", "Cotton 100% / Wool 100% / Silk 100%", false],
  ["객체가 통째로 들어감", "[object Object]", false],
  ["배열이 통째로 들어감", "[object Object],[object Object]", false],
  ["퍼센트가 없음", "Cotton", false],
  ["형식이 다름", "60% Cotton", false],
  ["빈 값", "", false],
  ["공백만", "   ", false],
];

const COLOR = [
  // ── 옳은 값 ──
  ["영문 색 이름", "Optic White", true],
  ["한글 색 이름", "코어", true],
  ["고유 색 이름", "Olive Tree", true],
  ["여러 색 표기", "Ivory / Navy", true],
  ["기호 포함", "Black & White", true],

  // ── 버려야 하는 값 ──
  ["안내 문구", "Select", false],
  ["항목 이름만", "Color", false],
  ["한글 항목 이름만", "색상", false],
  ["색상 코드", "#ff0000", false],
  ["숫자만", "12", false],
  ["문자열 null", "null", false],
  ["객체가 통째로 들어감", "[object Object]", false],
  ["너무 긴 값 — 설명문이 통째로 들어옴", "A".repeat(41), false],
  ["빈 값", "", false],
];

let bad = 0;
for (const [label, v, want] of COMP) {
  const got = validComp(v);
  if (got !== want) { bad++; console.error(`❌ 혼용률 · ${label}: ${JSON.stringify(v)} → 기대 ${want} 실제 ${got}`); }
}
for (const [label, v, want] of COLOR) {
  const got = validColor(v);
  if (got !== want) { bad++; console.error(`❌ 컬러 · ${label}: ${JSON.stringify(v)} → 기대 ${want} 실제 ${got}`); }
}
if (bad) { console.error(`\n값 판정 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 값 판정 통과 — 혼용률 ${COMP.length}건 · 컬러 ${COLOR.length}건`);
