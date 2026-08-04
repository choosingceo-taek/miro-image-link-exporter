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

// 엑셀 열 구성이 의도한 것과 같은지 확인한다 — 열을 바꿀 때 여기도 같이 고치게 된다.
{
  const want = ["브랜드", "썸네일", "URL", "상품명", "컬러웨이", "혼용률"];
  // ws.columns 는 여러 곳에 있다(레거시 CSV 시트 포함) — 브랜드 열이 있는 것이 보드 스캐너다.
  const block = [...html.matchAll(/ws\.columns = \[[\s\S]*?\];/g)]
    .map((m) => m[0]).find((b) => b.includes("'브랜드'"));
  const got = block ? [...block.matchAll(/header: '([^']+)'/g)].map((m) => m[1]) : [];
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    console.error(`❌ 엑셀 열 구성이 다름\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got)}`);
    process.exit(1);
  }
}

if (bad) { console.error(`\n패널 로드 실패 ${bad}건 — 미로 앱에서 같은 오류가 화면에 뜬다`); process.exit(1); }
// 함수 안쪽(initPanel 스코프)의 미선언 참조는 여기서 안 잡힌다 —
// 그건 scripts/test-rowvalues.mjs 가 블록을 통째로 떼어 실행하며 검사한다.
console.log(`✅ 패널 로드 통과 · 엑셀 열 6개(브랜드·썸네일·URL·상품명·컬러웨이·혼용률) 확인`);
