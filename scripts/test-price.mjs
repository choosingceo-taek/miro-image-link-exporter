#!/usr/bin/env node
// 가격 파싱 회귀 테스트.
// collector.js 의 가격 블록(P_NUM ~ pricesFrom)을 그대로 떼어 실행한다.
// 통화기호가 [$€£₩¥] 뿐이라 유럽·북유럽 사이트가 통째로 빈칸이던 문제와,
// 할인 상품에서 정가·할인가를 뒤집어 넣던 문제가 다시 생기면 여기서 잡힌다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "chrome-extension/collector.js"), "utf8");

const m = src.match(/const P_NUM =[\s\S]*?\n  \};(?=\n  \/\/ 상품 사진이)/);
if (!m) { console.error("❌ 가격 블록을 찾지 못함 — collector.js 구조가 바뀌었는지 확인"); process.exit(1); }
const pricesFrom = new Function(m[0] + "\n return pricesFrom;")();

// [카드 텍스트, 기대 할인가(=판매가), 기대 정가]
const CASES = [
  // ── 단일 가격: 정가 칸은 비운다 ──
  ["Wide Leg Trouser $128", "$128", ""],
  ["니트 가디건 ₩89,000", "₩89,000", ""],
  ["Linen Shirt USD 79.00", "USD 79.00", ""],
  ["Cotton Tee £24.50", "£24.50", ""],
  ["Robe en lin € 149", "€ 149", ""],
  ["Sukienka 129,99 zł", "129,99 zł", ""],          // 예전 정규식이 통째로 놓치던 표기
  ["Klänning 1 290 kr", "1 290 kr", ""],
  ["Košile 899 Kč", "899 Kč", ""],
  ["Merino Sweater CHF 189", "CHF 189", ""],
  ["원피스 89,000원", "89,000원", ""],

  // ── 할인: 큰 값이 정가, 작은 값이 할인가 ──
  ["Silk Blouse $128.00 $89.00", "$89.00", "$128.00"],
  ["Sale! $89.00 was $128.00", "$89.00", "$128.00"],   // 순서가 뒤집혀도 금액으로 판단
  ["Dress ₩129,000 ₩89,000", "₩89,000", "₩129,000"],
  ["Jeans 1.299,00 kr 899,00 kr", "899,00 kr", "1.299,00 kr"],
  // 같은 금액이 두 번 나오는 것은 할인이 아니다(정가 칸 비움)
  ["Tee $45.00 $45.00", "$45.00", ""],

  // ── 가격이 없는 카드 ──
  ["Shop New Arrivals", "", ""],
  ["Free shipping over 50", "", ""],
  // 통화 없는 맨숫자는 가격으로 보지 않는다 (사이즈·수량과 구별이 안 된다)
  ["Cotton Shirt 100% Cotton", "", ""],
];

let bad = 0;
for (const [text, wantSale, wantOrig] of CASES) {
  const got = pricesFrom(text);
  if (got.price !== wantSale || got.priceOrig !== wantOrig) {
    bad++;
    console.error(`❌ ${JSON.stringify(text)}\n   기대 판매 ${JSON.stringify(wantSale)} / 정가 ${JSON.stringify(wantOrig)}` +
                  `\n   실제 판매 ${JSON.stringify(got.price)} / 정가 ${JSON.stringify(got.priceOrig)}`);
  }
}
if (bad) { console.error(`\n가격 파싱 ${bad}/${CASES.length} 실패`); process.exit(1); }
console.log(`✅ 가격 파싱 ${CASES.length}건 통과`);
