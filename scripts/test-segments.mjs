#!/usr/bin/env node
// 세그먼트 탭(YWMN·WMN·ACTIVE·SLEEP)의 데이터와 배선을 확인한다.
//
// 브랜드가 134개라 한 목록에서 고르기 어려워 세그먼트로 먼저 좁힌다.
// 여기서 지키려는 것은 하나다: 어떤 탭을 눌러도 브랜드가 조용히 사라지면 안 된다.
// 분류가 빠진 브랜드는 ALL 에서라도 반드시 보여야 한다 — 안 보이면 사용자는
// "브랜드가 없어졌다"고 읽지, "분류가 안 됐구나"라고 읽지 않는다.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEGS = ["YWMN", "WMN", "ACTIVE", "SLEEP"];

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// ── ① 분류 데이터 ──
// brands.json 은 옆 저장소(miro-market-research)에 있다. 이 저장소만 받은
// 사람에게는 없을 수 있으므로, 없으면 데이터 검사만 건너뛴다.
const BRANDS = [
  join(ROOT, "../miro-market-research/public/brands.json"),
  join(ROOT, "../../workspace/miro-market-research/public/brands.json"),
  "/workspace/miro-market-research/public/brands.json",
].find(existsSync);

if (!BRANDS) {
  console.log("  · brands.json 이 없어 분류 검사는 건너뜁니다(옆 저장소)");
} else {
  const list = JSON.parse(readFileSync(BRANDS, "utf8"));
  if (!Array.isArray(list) || !list.length) fail("brands.json 이 비었다");

  const noSeg = list.filter((b) => !Array.isArray(b.segments) || !b.segments.length);
  if (noSeg.length) {
    fail(`분류가 없는 브랜드 ${noSeg.length}개 — ${noSeg.slice(0, 5).map((b) => b.name).join(", ")}`);
  }
  const wrong = list.flatMap((b) => (b.segments || []).filter((s) => !SEGS.includes(s)).map((s) => `${b.name}:${s}`));
  if (wrong.length) fail(`알 수 없는 세그먼트 이름 — ${wrong.slice(0, 5).join(", ")}`);

  // 탭이 비면 UI 에서 잠기므로, 네 탭 모두 브랜드가 있어야 쓸모가 있다.
  for (const s of SEGS) {
    const n = list.filter((b) => (b.segments || []).includes(s)).length;
    if (!n) fail(`${s} 탭에 브랜드가 하나도 없다`);
  }
  // 이름이 겹치면 목록에 같은 브랜드가 두 번 나온다.
  const seen = new Set(), dup = [];
  for (const b of list) { const k = String(b.name).toLowerCase(); if (seen.has(k)) dup.push(b.name); seen.add(k); }
  if (dup.length) fail(`이름이 겹치는 브랜드 — ${dup.join(", ")}`);
}

// ── ② 패널 배선 ──
const src = readFileSync(join(ROOT, "index.html"), "utf8");

// 탭 다섯 개(ALL + 네 세그먼트)가 화면에 있어야 한다.
const navBlock = src.slice(src.indexOf('<nav class="segnav"'), src.indexOf("</nav>", src.indexOf('<nav class="segnav"')));
if (!navBlock) fail("세그먼트 탭 마크업이 없다");
for (const s of ["", ...SEGS]) {
  if (!navBlock.includes(`data-seg="${s}"`)) fail(`탭에 data-seg="${s}" 가 없다`);
}

const MUST = [
  ["let segFilter", "고른 세그먼트를 기억하는 변수가 없다"],
  ["const inSeg =", "세그먼트로 거르는 함수가 없다"],
  ["importBrands.filter(inSeg)", "브랜드 목록에 세그먼트 필터가 안 걸려 있다"],
  ["function paintSegNav", "탭 상태를 그리는 함수가 없다"],
  ["paintSegNav(); fillBrandPicker()", "브랜드를 새로 받아도 탭 숫자가 갱신되지 않는다"],
];
for (const [needle, why] of MUST) if (!src.includes(needle)) fail(`${why} (${needle} 없음)`);

// 분류가 없는 브랜드가 ALL 에서 사라지면 안 된다.
const i = src.indexOf("const inSeg =");
const line = src.slice(i, src.indexOf("\n", i));
if (!/!segFilter/.test(line)) {
  fail("ALL 일 때 전체를 통과시키지 않는다 — 분류 없는 브랜드가 어디에도 안 보인다");
}

// 초기화 버튼이 세그먼트도 풀어야 한다.
const rst = src.slice(src.indexOf("pickResetBtn.addEventListener"), src.indexOf("pickResetBtn.addEventListener") + 700);
if (!rst.includes("segFilter = ''")) {
  fail("초기화 버튼이 세그먼트 탭을 안 푼다 — 브랜드만 ALL 이고 탭은 걸린 상태가 된다");
}

// 세그먼트를 바꿔 고른 브랜드가 목록에서 빠지면 선택도 풀려야 한다.
const fbp = src.slice(src.indexOf("function fillBrandPicker"), src.indexOf("function paintSegNav"));
if (!fbp.includes("list.some(b => b.name === cur)")) {
  fail("탭을 옮겨도 옛 브랜드 선택이 남는다 — 선택칸에는 있는데 목록에는 없는 상태");
}

if (bad) { console.error(`\n세그먼트 탭 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 세그먼트 탭 통과 — 분류 데이터 · 탭 ${SEGS.length + 1}개 · 배선 5종 · 되돌리기 3종`);
