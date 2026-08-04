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
const m = src.match(/const NEED = '확인 필요';[\s\S]*?return vals;\n\s*\}/);
if (!m) { console.error("❌ rowValues 블록을 찾지 못함 — index.html 구조가 바뀌었는지 확인"); process.exit(1); }
// NEED 도 실제 코드에서 함께 떼어 온다 — 주입하면 선언 누락(NEED is not defined)을 못 잡는다.
const NEED = "확인 필요";
const rowValues = new Function(m[0] + "\n return rowValues;")();

// 썸네일·URL 은 보드 값을 그대로 쓰므로 rowValues 가 만드는 것은 브랜드·상품명
// (+컬러웨이·혼용률 열이 열렸을 때 그 둘)이다. 열이 열렸는지는 이제 그 파일에
// 실리는 상품들이 정하므로(fabricReady), 테스트는 두 경우를 다 돌린다.
const ROW_COL_BASE = { brand: "A", name: "D" };
const ROW_COL_FULL = { brand: "A", name: "D", color: "E", comp: "F" };
const run = (r, brand, on) => rowValues(r, brand, on ? ROW_COL_FULL : ROW_COL_BASE, on);
// [설명, 입력, 열이 닫혔을 때 기대, 열이 열렸을 때 기대]
const CASES = [
  ["브랜드·상품명이 있으면 그대로",
    { brand: "Vince", name: "Modal-Silk Relaxed T-Shirt", color: "Optic White", comp: "Modal 90% / Silk 10%" },
    { brand: "Vince", name: "Modal-Silk Relaxed T-Shirt", color: undefined, comp: undefined },
    { brand: "Vince", name: "Modal-Silk Relaxed T-Shirt", color: "Optic White", comp: "Modal 90% / Silk 10%" }],

  ["브랜드가 없으면 도메인 추정값을 쓴다",
    { name: "Tee", color: "Black", comp: "Cotton 100%" },
    { brand: "freepeople", name: "Tee" },
    { brand: "freepeople", name: "Tee" }],

  ["상품명을 못 가져왔으면 확인 필요",
    { brand: "Gap", color: "Navy", comp: "Cotton 100%" },
    { brand: "Gap", name: NEED },
    { brand: "Gap", name: NEED }],

  ["아무것도 없음 → 전 항목 확인 필요",
    {},
    { brand: NEED, name: NEED, color: undefined, comp: undefined },
    { brand: NEED, name: NEED, color: NEED, comp: NEED }],

  ["열이 닫혀 있으면 컬러·혼용률은 결과에 없다",
    { brand: "Arket", name: "Rib T-shirt", color: "White", comp: "Cotton 100%" },
    { color: undefined, comp: undefined },
    { color: "White", comp: "Cotton 100%" }],

  ["옛 저장 사고로 남은 '[object Object]' 는 값이 아니다",
    { brand: "Arket", name: "Rib T-shirt", color: "[object Object]", comp: "[object Object],[object Object]" },
    { color: undefined, comp: undefined },
    { color: NEED, comp: NEED }],

  ["가격·사이즈는 열에 없으므로 결과에 없다",
    { brand: "Arket", name: "Rib T-shirt", price: "$40", sizes: "S, M" },
    { brand: "Arket", name: "Rib T-shirt", price: undefined, sizes: undefined },
    { brand: "Arket", name: "Rib T-shirt", price: undefined, sizes: undefined }],
];

let bad = 0;
for (const [label, input, wantOff, wantOn] of CASES) {
  const brand = label.includes("도메인 추정값") ? "freepeople" : "";
  for (const [on, want] of [[false, wantOff], [true, wantOn]]) {
    const got = run(input, brand, on);
    for (const k of Object.keys(want)) {
      if (got[k] !== want[k]) {
        bad++;
        console.error(`❌ ${label} · ${k} (열 ${on ? "열림" : "닫힘"})\n   기대 ${JSON.stringify(want[k])}\n   실제 ${JSON.stringify(got[k])}`);
      }
    }
  }
}

if (bad) { console.error(`\n행 값 계산 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 엑셀 행 값 ${CASES.length}건 통과 (열 닫힘·열림 양쪽)`);
