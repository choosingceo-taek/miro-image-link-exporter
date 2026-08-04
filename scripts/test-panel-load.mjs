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

// 엑셀 열 구성 — 컬러웨이·혼용률 열을 열지 말지는 그 파일에 실리는 상품들이 정한다.
// 여기서 확인하는 것: ① 열 목록이 두 상태 모두 온전한지 ② 열 문자가 순서대로
// 붙는지(어긋나면 '확인 필요' 서식이 엉뚱한 칸에 간다) ③ 95% 기준이 실제로 그
// 기준대로 동작하는지 — 켜는 순간 깨지면 열어 봐야 의미가 없다.
let colLabel = "";
{
  const i2 = html.indexOf("const COMP_ITEM_RX");
  const j2 = html.indexOf("function rowValues");
  if (i2 < 0 || j2 < 0) { console.error("❌ 엑셀 열 선언부를 찾지 못함"); process.exit(1); }
  const decl = html.slice(i2, j2);
  let api;
  try {
    api = new Function(
      "const cleanVal = (v) => { const t = String(v || '').trim(); return t.includes('[object Object]') ? '' : t; };\n" +
      decl +
      "\n return { colsFor, rowColFor, fabricReady, FABRIC_GATE };",
    )();
  } catch (e) {
    console.error("❌ 엑셀 열 선언부 실행 실패:", String((e && e.message) || e));
    process.exit(1);
  }

  const BASE = ["브랜드", "썸네일", "URL", "상품명"];
  const FULL = BASE.concat(["컬러웨이", "혼용률"]);
  const headers = (on) => api.colsFor(on).map((c) => c.header);
  for (const [on, want] of [[false, BASE], [true, FULL]]) {
    if (JSON.stringify(headers(on)) !== JSON.stringify(want)) {
      console.error(`❌ 열 구성이 다름(열 ${on ? "열림" : "닫힘"})\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(headers(on))}`);
      process.exit(1);
    }
  }
  // URL 은 항상 C 열이어야 한다(하이퍼링크를 C 에 박는다).
  if (headers(true)[2] !== "URL" || headers(false)[2] !== "URL") {
    console.error("❌ URL 이 C 열이 아님 — 하이퍼링크가 엉뚱한 칸에 박힌다"); process.exit(1);
  }
  const full = api.rowColFor(api.colsFor(true));
  const wantCol = { brand: "A", name: "D", color: "E", comp: "F" };
  for (const k of Object.keys(wantCol)) {
    if (full[k] !== wantCol[k]) {
      console.error(`❌ 열 문자 어긋남 · ${k}: 기대 ${wantCol[k]} 실제 ${full[k]}`);
      process.exit(1);
    }
  }

  // 95% 기준이 실제로 그렇게 동작하는지. 20개 중 1개까지는 비어도 열린다(95%),
  // 2개가 비면 닫힌다(90%). 값이 '있는' 게 아니라 '옳은' 것만 센다.
  const ok = { comp: "Cotton 100%", color: "White" };
  const mk = (n, f) => Array.from({ length: n }, (_, k) => (f && f(k)) || { ...ok });
  const gateCases = [
    ["전부 옳으면 열린다", mk(20), true],
    ["20개 중 1개 빔(95%) — 열린다", mk(20, (k) => (k === 0 ? {} : null)), true],
    ["20개 중 2개 빔(90%) — 닫힌다", mk(20, (k) => (k < 2 ? {} : null)), false],
    ["혼용률만 차고 컬러가 비면 닫힌다", mk(20, () => ({ comp: "Cotton 100%" })), false],
    ["절반만 뽑힌 혼용률은 옳지 않다", mk(20, () => ({ comp: "Cotton 60%", color: "White" })), false],
    ["안내 문구 컬러는 옳지 않다", mk(20, () => ({ comp: "Cotton 100%", color: "Select" })), false],
    ["'[object Object]' 는 값이 아니다", mk(20, () => ({ comp: "[object Object]", color: "[object Object]" })), false],
    ["상품이 없으면 닫힌다", [], false],
  ];
  let gateBad = 0;
  for (const [label, items, want] of gateCases) {
    const got = api.fabricReady(items);
    if (got !== want) { console.error(`❌ 열 판정 · ${label}: 기대 ${want} 실제 ${got}`); gateBad++; }
  }
  if (gateBad) { console.error(`\n열 판정 ${gateBad}건 실패`); process.exit(1); }
  colLabel = `열 4↔6개 전환 · 개방 기준 ${Math.round(api.FABRIC_GATE * 100)}% ${gateCases.length}건`;
}

if (bad) { console.error(`\n패널 로드 실패 ${bad}건 — 미로 앱에서 같은 오류가 화면에 뜬다`); process.exit(1); }
// 함수 안쪽(initPanel 스코프)의 미선언 참조는 여기서 안 잡힌다 —
// 그건 scripts/test-rowvalues.mjs 가 블록을 통째로 떼어 실행하며 검사한다.
console.log(`✅ 패널 로드 통과 · 엑셀 ${colLabel} · 스위치 양쪽 확인`);
