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
const m = src.match(/const COLOR_WORDS = \[[\s\S]*?return vals;\n\s*\}/);
if (!m) { console.error("❌ rowValues 블록을 찾지 못함 — index.html 구조가 바뀌었는지 확인"); process.exit(1); }
const fns = new Function(m[0] + "\n return { rowValues, colorFromText };")();
const { rowValues, colorFromText } = fns;
const NEED = "확인 필요";

const CASES = [
  ["전부 채워진 정상가 상품",
    { brand: "Sezane", name: "Linen Shirt - Ivory", category: "shirts", price: "$128" },
    { brand: "Sezane", name: "Linen Shirt - Ivory", category: "shirts",
      priceOrig: "$128", price: "-", color: "Ivory" }],

  ["할인 상품 — 정가·할인가 둘 다",
    { brand: "Loft", name: "Navy Dress", category: "dresses", price: "$89", priceOrig: "$128" },
    { brand: "Loft", name: "Navy Dress", category: "dresses",
      priceOrig: "$128", price: "$89", color: "Navy" }],

  ["가격을 전혀 못 가져옴 → 정가·할인가 모두 확인 필요",
    { brand: "Gap", name: "Black Tee", category: "tops" },
    { brand: "Gap", name: "Black Tee", priceOrig: NEED, price: NEED, color: "Black" }],

  ["색이 이름·URL 어디에도 없으면 확인 필요",
    { brand: "Arket", name: "Barrel Leg Trouser", category: "pants", price: "\u20ac199" },
    { priceOrig: "\u20ac199", price: "-", color: NEED }],

  ["카테고리가 없으면 확인 필요",
    { brand: "X", name: "Thing", price: "$1" },
    { category: NEED }],

  ["아무것도 없음 → 전 항목 확인 필요",
    {},
    { brand: NEED, name: NEED, category: NEED, priceOrig: NEED, price: NEED, color: NEED }],

  ["야간 보강이 채운 혼용률·컬러·사이즈는 그대로 실린다",
    { brand: "Bellerose", name: "Sweatshirt", category: "sweatshirts", price: "\u20ac120",
      comp: "Cotton 100%", color: "Ecarlate", sizes: "XS, S, M, L" },
    { comp: "Cotton 100%", color: "Ecarlate", sizes: "XS, S, M, L" }],

  ["저장 컬러가 이름의 색상어보다 우선",
    { brand: "X", name: "Navy Dress", category: "dresses", price: "$1", color: "Deep Ocean" },
    { color: "Deep Ocean" }],

  ["사이즈가 안 채워졌으면 확인 필요",
    { brand: "X", name: "Thing", category: "tops", price: "$1" },
    { sizes: NEED }],

  ["혼용률이 아직 안 채워졌으면 확인 필요",
    { brand: "Gap", name: "Black Tee", category: "tops", price: "$20" },
    { comp: NEED }],

  ["URL 슬러그의 색도 읽는다",
    { brand: "Bassike", name: "Crushed Cotton Barrel Pant", category: "pants", price: "$240",
      link: "https://bassike.com/products/barrel-pant-ecru" },
    { color: "Ecru", priceOrig: "$240", price: "-" }],
];

let bad = 0;
for (const [label, input, want] of CASES) {
  const got = rowValues(input, "");
  for (const k of Object.keys(want)) {
    if (got[k] !== want[k]) {
      bad++;
      console.error(`❌ ${label} · ${k}\n   기대 ${JSON.stringify(want[k])}\n   실제 ${JSON.stringify(got[k])}`);
    }
  }
}

// 브랜드 추정값(도메인)이 있으면 그것을 쓰고 '확인 필요'로 떨어지지 않는다.
{
  const got = rowValues({ name: "Tee", price: "$20" }, "freepeople");
  if (got.brand !== "freepeople") { bad++; console.error(`❌ 브랜드 추정값 미사용: ${JSON.stringify(got.brand)}`); }
}


// ── 색: 상품명·URL 슬러그에서 읽는다(사이트 접속 없음) ──
const COLOR_CASES = [
  ["Hadley Blouse - Olive Cotton Satin", "", "Olive"],
  ["Mock-Neck Ribbed Top - Light Pink - Lookbook", "", "Light Pink"],
  ["Crushed Cotton Barrel Pant", "https://bassike.com/products/barrel-pant-ecru", "Ecru"],
  ["Wool Coat", "https://x.com/p/wool-coat-navy-blue", "Navy"],
  ["Off White Linen Shirt", "", "Off White"],
  // 색이 없으면 빈 문자열 — 아무 단어나 색으로 넘기지 않는다
  ["Perfect Fit Crewneck T-Shirt", "https://jcrew.com/p/perfect-fit-crewneck-t-shirt/CT123", ""],
  ["Barrel Leg Trouser", "", ""],
];
for (const [name, url, want] of COLOR_CASES) {
  const got = colorFromText(name, url);
  if (got !== want) {
    bad++;
    console.error(`❌ 색 · ${JSON.stringify(name)}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got)}`);
  }
}

if (bad) { console.error(`\n행 값 계산 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 엑셀 행 값 ${CASES.length + 1}건 · 색 추출 ${COLOR_CASES.length}건 통과`);
