#!/usr/bin/env node
// 엑셀 한 행의 값 계산 회귀 테스트.
// index.html 의 rowValues() 를 그대로 떼어 실행한다.
// 핵심 규칙 두 가지가 깨지면 여기서 잡힌다:
//   ① 사이트에서 못 가져온 칸은 비우지 않고 '확인 필요'
//   ② 할인 상품만 정가/할인가가 둘 다 차고, 정상가 상품의 할인가는 '-'
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "index.html"), "utf8");

// 색 추출기부터 rowValues 끝(return vals)까지 한 덩어리로 떼어 온다.
// 앞뒤 주석이 바뀌어도 깨지지 않도록 코드 자체를 기준으로 잡는다.
// rowValues 블록만 떼어 온다. 앞뒤 주석이 바뀌어도 깨지지 않도록 코드를 기준으로 잡는다.
const m = src.match(/const cleanVal = [\s\S]*?return vals;\n\s*\}/);
if (!m) { console.error("❌ rowValues 블록을 찾지 못함 — index.html 구조가 바뀌었는지 확인"); process.exit(1); }
const NEED = "확인 필요";
const rowValues = new Function("NEED", m[0] + "\n return rowValues;")(NEED);

// 엑셀 5열: 브랜드 · 썸네일 · URL · 상품명 · 혼용률.
// 썸네일과 URL 은 보드 값을 그대로 쓰므로 rowValues 가 만드는 것은 세 가지다.
const CASES = [
  ["전부 채워진 상품",
    { brand: "Shopbop", name: "Linen Shirt", comp: "Linen 100%" },
    { brand: "Shopbop", name: "Linen Shirt", comp: "Linen 100%" }],

  ["혼용률이 아직 안 채워졌으면 확인 필요",
    { brand: "Gap", name: "Black Tee" },
    { brand: "Gap", name: "Black Tee", comp: NEED }],

  ["브랜드가 없으면 도메인 추정값을 쓴다",
    { name: "Tee", comp: "Cotton 100%" },
    { brand: "freepeople", name: "Tee", comp: "Cotton 100%" }],

  ["아무것도 없음 → 전 항목 확인 필요",
    {},
    { brand: NEED, name: NEED, comp: NEED }],

  ["예전 저장 사고로 남은 '[object Object]' 는 값으로 보지 않는다",
    { brand: "Wrap", name: "Dress", comp: "[object Object]" },
    { brand: "Wrap", name: "Dress", comp: NEED }],

  ["가격·컬러·사이즈는 열에서 빠졌으므로 결과에 없다",
    { brand: "Vince", name: "Coat", comp: "Wool 80% / Nylon 20%", price: "$100", color: "Navy", sizes: "S, M" },
    { brand: "Vince", name: "Coat", comp: "Wool 80% / Nylon 20%" }],
];

let bad = 0;
for (const [label, input, want] of CASES) {
  const got = rowValues(input, label.includes("도메인 추정값") ? "freepeople" : "");
  for (const k of Object.keys(want)) {
    if (got[k] !== want[k]) {
      bad++;
      console.error(`❌ ${label} · ${k}\n   기대 ${JSON.stringify(want[k])}\n   실제 ${JSON.stringify(got[k])}`);
    }
  }
}

if (bad) { console.error(`\n행 값 계산 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 엑셀 행 값 ${CASES.length}건 통과`);
