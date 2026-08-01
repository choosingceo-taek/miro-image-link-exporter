#!/usr/bin/env node
// 카테고리 분류 회귀 테스트.
// index.html · chrome-extension/collector.js · rack-harvester.user.js 세 곳의
// 분류 규칙을 추출해 ① 코퍼스 정답과 비교하고 ② 세 구현이 서로 어긋나면 실패시킨다.
// (trackpant→tops 같은 오분류가 다시 생기면 CI가 push 단계에서 잡는다)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILES = ["index.html", "chrome-extension/collector.js", "rack-harvester.user.js"];

// 파일에서 규칙 블록(dress 규칙 ~ 마지막 return 'tops';)을 추출해 함수로 만든다.
function classifierFrom(path) {
  const src = readFileSync(join(ROOT, path), "utf8");
  const m = src.match(/if \(nHas\(\/dress\|gown[\s\S]*?return 'tops';(?=\s*\n\s*\};?)/);
  if (!m) throw new Error(`규칙 블록을 찾지 못함: ${path}`);
  const body =
    "const n = ' ' + String(name || '').toLowerCase() + ' ';" +
    "const url = ' ' + String(u || '').toLowerCase() + ' ';" +
    "const nHas = (re) => re.test(n);" +
    m[0];
  return new Function("u", "name", body);
}

// 정답 코퍼스 — 문제가 됐던 케이스와 위험 조합을 모두 포함.
const CASES = [
  // ── pants (합성어 포함) ──
  ["FIREBIRD CROP TRACKPANT", "pants"], ["PINSTRIPE FIREBIRD LOOSE TRACKPANT", "pants"],
  ["SWEATPANT", "pants"], ["TRACK PANTS", "pants"], ["ESSENTIALS JOGGER", "pants"],
  ["3-STRIPES LEGGINGS", "pants"], ["WIDE LEG TROUSERS", "pants"], ["PLEATED TROUSER", "pants"],
  ["SLIM JEANS", "pants"], ["FLARE JEAN", "pants"], ["STRAIGHT LEG DENIM", "pants"],
  ["CARGO PANT", "pants"], ["LEATHER PANT", "pants"], ["SLACKS", "pants"],
  ["DENIM SHORTS", "pants"], ["SWEAT SHORTS", "pants"], ["BIKE SHORTS", "pants"],
  ["TENNIS SKORT", "pants"], ["PLEATED MINI SKIRT", "pants"], ["와이드 팬츠", "pants"],
  // ── tops ──
  ["ADICOLOR CLASSICS TEE", "tops"], ["CLASSIC T-SHIRT", "tops"], ["SHORT SLEEVE TEE", "tops"],
  ["RIBBED TANK TOP", "tops"], ["KNIT TANK", "tops"], ["CROP TOP", "tops"],
  ["BODYSUIT", "tops"], ["HENLEY TOP", "tops"], ["ELEPHANT PRINT TEE", "tops"],
  // ── sweatshirts ──
  ["SWEATSHIRT", "sweatshirts"], ["ESSENTIALS HOODIE", "sweatshirts"],
  ["CABLE KNIT SWEATER", "sweatshirts"], ["WOOL CARDIGAN", "sweatshirts"],
  ["HALF-ZIP SWEAT", "sweatshirts"], ["니트 가디건", "sweatshirts"],
  // ── shirts ──
  ["OXFORD SHIRT", "shirts"], ["SILK BLOUSE", "shirts"], ["SHORT SLEEVE SHIRT", "shirts"],
  ["DENIM SHIRT", "shirts"], ["CHAMBRAY SHIRT", "shirts"], ["POLO SHIRT", "shirts"],
  ["SHIRT DRESS", "shirts"],   // 의도된 규칙: shirt dress는 셔츠 탭
  // ── dresses ──
  ["FLORAL MIDI DRESS", "dresses"], ["SWEATER DRESS", "dresses"], ["KNIT DRESS", "dresses"],
  ["T-SHIRT DRESS", "dresses"], ["HOODIE DRESS", "dresses"], ["DENIM DRESS", "dresses"],
  ["JUMPSUIT", "dresses"], ["KNIT ROMPER", "dresses"], ["린넨 원피스", "dresses"],
  // ── 기본값(카테고리 밖 품목은 tops로 수렴) ──
  ["DENIM JACKET", "tops"], ["JEAN JACKET", "tops"], ["PUFFER JACKET", "tops"],
  // 겉옷 + 주소에 하의 단어가 섞인 경우(실제 상품 페이지에서 나온 조합).
  // 주소의 denim/jeans/skirt 때문에 pants로 새면 안 된다.
  ["DENIM JACKET", "tops", "/shop/product/6-denim-jacket"],
  ["JEAN JACKET", "tops", "/womens/jeans-jacket"],
  ["QUILTED VEST", "tops", "/collections/womens-pants/products/quilted-vest"],
  ["WOOL COAT", "tops", "/c/dresses/wool-coat"],
  // ── URL 폴백(이름에 단서가 없을 때) ──
  ["", "pants", "/collections/womens-pants"], ["", "dresses", "/c/dresses"],
  ["", "shirts", "/shop/shirts-blouses"], ["", "sweatshirts", "/c/hoodies-sweatshirts"],
];

let failed = 0;
const fns = FILES.map((f) => [f, classifierFrom(f)]);
for (const [name, want, url = ""] of CASES) {
  const results = fns.map(([f, fn]) => [f, fn(url, name)]);
  const distinct = [...new Set(results.map(([, r]) => r))];
  if (distinct.length > 1) {
    failed++;
    console.log(`✗ 구현 불일치  ${JSON.stringify(name || url)} → ${results.map(([f, r]) => `${f}:${r}`).join(" / ")}`);
    continue;
  }
  if (distinct[0] !== want) {
    failed++;
    console.log(`✗ 오분류      ${JSON.stringify(name || url)} → ${distinct[0]} (기대: ${want})`);
  }
}
console.log(failed ? `\n${failed}건 실패 / ${CASES.length}건` : `✅ ${CASES.length}건 전부 통과 (${FILES.length}개 구현 일치)`);
process.exit(failed ? 1 : 0);
