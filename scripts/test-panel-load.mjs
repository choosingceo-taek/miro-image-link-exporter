#!/usr/bin/env node
// 패널 스크립트가 실제로 "로드되는지" 확인한다.
//
// node --check 는 문법만 본다. 선언이 빠진 참조(NEED is not defined)는 통과시켜 버리고,
// 미로 앱을 열었을 때 화면에 오류로 뜬다 — 실제로 그 사고가 났다. 여기서는 브라우저
// 최소 스텁을 깔고 스크립트를 끝까지 실행해, 로드 시점에 터지는 참조 오류를 잡는다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runInNewContext } from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(ROOT, "index.html"), "utf8");
const blocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!blocks.length) { console.error("❌ index.html 에서 스크립트를 찾지 못함"); process.exit(1); }

// 브라우저 최소 스텁 — DOM 을 흉내 내려는 게 아니라, 참조가 존재하기만 하면 된다.
const el = () => ({
  style: {}, dataset: {}, value: "", textContent: "", innerHTML: "", checked: false,
  classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {},
  setAttribute() {}, getAttribute: () => null, focus() {}, click() {},
  querySelector: () => null, querySelectorAll: () => [], getContext: () => null,
  getBoundingClientRect: () => ({ width: 0, height: 0 }),
});

const sandbox = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  URL, URLSearchParams, TextDecoder, TextEncoder, AbortController, Promise, Math, JSON, Date,
  location: { href: "https://example.test/", hostname: "example.test", pathname: "/", search: "", origin: "https://example.test" },
  document: {
    getElementById: () => el(), querySelector: () => el(), querySelectorAll: () => [],
    createElement: () => el(), addEventListener() {}, body: el(), documentElement: el(),
  },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  navigator: { userAgent: "node", clipboard: { writeText: async () => {} } },
  miro: { board: { ui: { on() {} }, get: async () => [], getInfo: async () => ({ id: "b" }), getSelection: async () => [] } },
  fetch: async () => ({ ok: false, status: 0, json: async () => ({}), text: async () => "" }),
  addEventListener() {}, alert() {}, requestAnimationFrame: (f) => setTimeout(f, 0),
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

let bad = 0;
blocks.forEach((code, i) => {
  try {
    runInNewContext(code, sandbox, { timeout: 10000 });
  } catch (e) {
    const msg = String((e && e.message) || e);
    // 로드 시점의 참조 오류만 실패로 본다 — 스텁이 얕아서 나는 다른 오류는 무시한다.
    if (/is not defined/.test(msg)) {
      bad++;
      console.error(`❌ 스크립트 ${i}: ${msg}`);
    }
  }
});

// 엑셀 열 구성 — SHOW_FABRIC_COLUMNS 스위치가 정한다.
// 컬러웨이·혼용률은 모든 브랜드에서 값이 채워질 때까지 열에서 뺀 상태다.
// 여기서는 두 가지를 확인한다: ① 지금 스위치대로 열이 나오는지
// ② 스위치를 켰을 때 여섯 열이 되는지 — 켜는 순간 깨지면 의미가 없다.
let colLabel = "";
{
  const i2 = html.indexOf("const SHOW_FABRIC_COLUMNS");
  const j2 = html.indexOf("function rowValues");
  if (i2 < 0 || j2 < 0) { console.error("❌ 엑셀 열 선언부를 찾지 못함"); process.exit(1); }
  const decl = html.slice(i2, j2);
  const build = (on) => new Function(
    decl.replace(/const SHOW_FABRIC_COLUMNS = (?:true|false);/, `const SHOW_FABRIC_COLUMNS = ${on};`) +
    "\n return { cols: XLSX_COLS.map((c) => c.header), rowCol: ROW_COL };",
  )();

  const on = /const SHOW_FABRIC_COLUMNS = true;/.test(decl);
  const BASE = ["브랜드", "썸네일", "URL", "상품명"];
  const FULL = BASE.concat(["컬러웨이", "혼용률"]);

  const now = build(on);
  const want = on ? FULL : BASE;
  if (JSON.stringify(now.cols) !== JSON.stringify(want)) {
    console.error(`❌ 지금 열 구성이 스위치와 다름\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(now.cols)}`);
    process.exit(1);
  }
  // URL 은 항상 C 열이어야 한다(하이퍼링크를 C 에 박는다).
  if (now.cols[2] !== "URL") { console.error("❌ URL 이 C 열이 아님 — 하이퍼링크가 엉뚱한 칸에 박힌다"); process.exit(1); }

  const flipped = build(!on);
  const wantFlipped = on ? BASE : FULL;
  if (JSON.stringify(flipped.cols) !== JSON.stringify(wantFlipped)) {
    console.error(`❌ 스위치를 반대로 놓으면 깨짐\n   기대 ${JSON.stringify(wantFlipped)}\n   실제 ${JSON.stringify(flipped.cols)}`);
    process.exit(1);
  }
  // 열 문자가 순서대로 붙는지 — 어긋나면 '확인 필요' 서식이 엉뚱한 칸에 간다.
  const full = build(true).rowCol;
  const wantCol = { brand: "A", name: "D", color: "E", comp: "F" };
  for (const k of Object.keys(wantCol)) {
    if (full[k] !== wantCol[k]) {
      console.error(`❌ 열 문자 어긋남 · ${k}: 기대 ${wantCol[k]} 실제 ${full[k]}`);
      process.exit(1);
    }
  }
  colLabel = on ? "열 6개(컬러웨이·혼용률 포함)" : "열 4개(컬러웨이·혼용률은 스위치 off)";
}

if (bad) { console.error(`\n패널 로드 실패 ${bad}건 — 미로 앱에서 같은 오류가 화면에 뜬다`); process.exit(1); }
// 함수 안쪽(initPanel 스코프)의 미선언 참조는 여기서 안 잡힌다 —
// 그건 scripts/test-rowvalues.mjs 가 블록을 통째로 떼어 실행하며 검사한다.
console.log(`✅ 패널 로드 통과 · 엑셀 ${colLabel} · 스위치 양쪽 확인`);
