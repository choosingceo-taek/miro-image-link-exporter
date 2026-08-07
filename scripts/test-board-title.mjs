#!/usr/bin/env node
// 보드 이미지 캡션의 왕복 테스트: boardTitle 로 쓴 것을 parseTitle 이 되읽는가.
//
// 캡션은 두 가지 일을 한다. ① 보드에서 눈으로 혼용률을 본다 ② localStorage
// 캐시가 없는 PC에서 스캔할 때 혼용률을 되살린다. ②가 있는 이유는 캐시가
// 브라우저마다 따로라서, 내가 넣은 상품을 팀원이 스캔하면 혼용률이 통째로
// 비어 나오기 때문이다.
//
// 위험한 건 파싱이다. parseTitle 은 '·' 로 자르고 "가격이 아닌 조각"을 전부
// 이름으로 본다. 혼용률을 그냥 붙이면 상품명이 "Silk Blouse · Silk 100%" 가
// 되어 엑셀 이름 열이 오염된다. 그래서 혼용률 조각을 알아보고 빼내야 한다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "index.html"), "utf8");

// 판정기(validComp)와 캡션 함수는 index.html 안에서 서로 멀리 떨어져 있다.
// 두 덩어리를 떼어 한 스코프에 넣고 돌린다.
const cut = (from, to, what) => {
  const i = src.indexOf(from), j = src.indexOf(to, i);
  if (i < 0 || j < 0) { console.error(`❌ ${what} 블록을 찾지 못함 — index.html 구조 확인`); process.exit(1); }
  return src.slice(i, j);
};
const validBlock = cut("const COMP_ITEM_RX", "// ── 컬러웨이·혼용률 열 스위치", "판정");
const titleBlock = cut("const compToTitle =", "// ── 상품 사진을 보드로", "캡션");

const { boardTitle, parseTitle } = new Function(
  "const cleanVal = (v) => { const t = String(v || '').trim(); return t.includes('[object Object]') ? '' : t; };\n" +
  validBlock + "\n" + titleBlock + "\n return { boardTitle, parseTitle };",
)();

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// ── ① 캡션에 혼용률이 붙는가 ──
const WRITE = [
  {
    label: "옳은 혼용률은 붙는다",
    it: { brand: "Vince", name: "Silk Blouse", price: "$295", comp: "Silk 100%" },
    want: "Vince · Silk Blouse · $295 · Silk 100%",
  },
  {
    label: "여러 섬유는 그대로",
    it: { brand: "Rails", name: "Hunter Plaid", price: "$168", comp: "Cotton 60% / Modal 40%" },
    want: "Rails · Hunter Plaid · $168 · Cotton 60% / Modal 40%",
  },
  {
    label: "원단이 둘이면 줄 대신 ' | ' 로 잇는다",
    it: { brand: "Theory", name: "Lined Coat", price: "$695", comp: "Wool 100%\nPolyester 100%" },
    want: "Theory · Lined Coat · $695 · Wool 100% | Polyester 100%",
  },
  {
    label: "반쪽짜리는 안 붙인다 — 보드에서 지우기 번거롭다",
    it: { brand: "Loft", name: "Ribbed Tank", price: "$39", comp: "Cotton 60%" },
    want: "Loft · Ribbed Tank · $39",
  },
  {
    label: "혼용률이 없으면 예전과 같은 캡션",
    it: { brand: "H&M", name: "Linen Shirt", price: "$34.99", comp: "" },
    want: "H&M · Linen Shirt · $34.99",
  },
  {
    label: "옛 저장 사고로 남은 [object Object] 는 버린다",
    it: { brand: "Gestuz", name: "Wide Trouser", price: "", comp: "[object Object]" },
    want: "Gestuz · Wide Trouser",
  },
];
for (const { label, it, want } of WRITE) {
  const got = boardTitle(it);
  if (got !== want) fail(`${label}\n     기대 "${want}"\n     실제 "${got}"`);
}

// ── ② 되읽을 때 이름·가격·혼용률이 제자리로 가는가 ──
// 이게 깨지면 조용히 상품명이 오염된다 — 엑셀을 열어 봐야 안다.
const READ = [
  {
    label: "혼용률이 이름에 섞이지 않는다",
    title: "Vince · Silk Blouse · $295 · Silk 100%",
    want: { name: "Silk Blouse", price: "$295", comp: "Silk 100%" },
  },
  {
    label: "두 줄짜리는 줄바꿈으로 되돌아온다",
    title: "Theory · Lined Coat · $695 · Wool 100% | Polyester 100%",
    want: { name: "Lined Coat", price: "$695", comp: "Wool 100%\nPolyester 100%" },
  },
  {
    label: "혼용률 없는 옛 캡션도 그대로 읽힌다",
    title: "H&M · Linen Shirt · $34.99",
    want: { name: "Linen Shirt", price: "$34.99", comp: "" },
  },
  {
    label: "이름에 '·' 가 들어간 상품",
    title: "Arket · Wool · Cashmere Scarf · $89 · Wool 70% / Cashmere 30%",
    want: { name: "Wool · Cashmere Scarf", price: "$89", comp: "Wool 70% / Cashmere 30%" },
  },
  {
    label: "우리가 만든 게 아닌 캡션은 전부 이름으로",
    title: "회의 자료 3안",
    want: { name: "회의 자료 3안", price: "", comp: "" },
  },
];
for (const { label, title, want } of READ) {
  const got = parseTitle(title);
  for (const k of ["name", "price", "comp"]) {
    if (got[k] !== want[k]) {
      fail(`${label} — ${k}\n     기대 ${JSON.stringify(want[k])}\n     실제 ${JSON.stringify(got[k])}`);
    }
  }
}

// ── ③ 왕복 ── 쓴 것을 되읽으면 원래 값이 나와야 한다.
for (const { it } of WRITE) {
  const back = parseTitle(boardTitle(it));
  const wantComp = boardTitle(it).includes(" · " + String(it.comp).split("\n")[0]) ? it.comp : "";
  if (back.comp !== wantComp) {
    fail(`왕복 실패 "${it.name}"\n     기대 ${JSON.stringify(wantComp)}\n     실제 ${JSON.stringify(back.comp)}`);
  }
  if (it.name && back.name !== it.name) {
    fail(`왕복에서 이름이 바뀜 "${it.name}" → "${back.name}"`);
  }
}

if (bad) { console.error(`\n보드 캡션 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 보드 캡션 통과 — 쓰기 ${WRITE.length}건 · 읽기 ${READ.length}건 · 왕복 ${WRITE.length}건`);
