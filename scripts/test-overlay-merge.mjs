#!/usr/bin/env node
// 두 경로가 같은 상품에 대해 같은 값을 내는지 본다.
//
// 혼용률·컬러웨이·사이즈는 야간 보강이 오버레이(comp:<site>)에 쌓고, 카탈로그 본문에는
// 안 들어간다. 그래서 오버레이를 읽지 않는 경로는 데이터가 100% 차 있어도 빈 칸을 낸다.
// 실제로 브랜드 목록 경로(loadCatalog)가 그 상태였다 — 보드 스캐너로 뽑으면 채워지는데
// 브랜드 목록으로 뽑으면 비는, 경로에 따라 결과가 달라지는 사고였다.
//
// 화면 없이 확인해야 하므로 index.html 의 스크립트를 vm 에 올리고, fetch 만 가짜로
// 갈아끼운 뒤 loadCatalog 를 실제로 호출한다. 카탈로그에는 값이 없고 오버레이에만
// 있는 상황을 만들어, 결과 항목에 값이 실려 나오는지 본다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runInNewContext } from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(ROOT, "index.html"), "utf8");
const blocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const main = blocks.find((b) => b.includes("async function loadCatalog"));
if (!main) { console.error("❌ loadCatalog 를 가진 스크립트 블록을 찾지 못함"); process.exit(1); }

const SITE = "ae.com.americaneagle";
// 카탈로그 본문 — 혼용률·컬러·사이즈가 비어 있다(실제 저장 상태가 이렇다).
const CATALOG = {
  site: SITE, brand: "American Eagle", updated: Date.now(),
  items: [
    { name: "Ribbed Tank", imageUrl: "https://s7.ae.com/a.jpg", productUrl: "https://www.ae.com/p/1", price: "$24.95", category: "tops" },
    { name: "Denim Short", imageUrl: "https://s7.ae.com/b.jpg", productUrl: "https://www.ae.com/p/2", price: "$49.95", category: "pants" },
  ],
};
// 오버레이 — 야간 보강이 채워 둔 값. 상품URL 표기가 카탈로그와 미묘하게 다르다
// (끝 슬래시·www 유무). urlKey 로 맞추지 않으면 하나도 안 붙는다.
const OVERLAY = {
  "https://ae.com/p/1/": { comp: "Cotton 95% / Elastane 5%", color: "White", sizes: "XS, S, M, L" },
  "https://www.ae.com/p/2": { comp: "Cotton 100%", color: "Medium Wash", sizes: "0, 2, 4, 6" },
};

const el = () => ({
  style: {}, dataset: {}, value: "", textContent: "", innerHTML: "", checked: false,
  classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {},
  setAttribute() {}, getAttribute: () => null, focus() {}, click() {},
  querySelector: () => null, querySelectorAll: () => [], getContext: () => null,
  getBoundingClientRect: () => ({ width: 0, height: 0 }),
});

const seen = [];
const sandbox = {
  console: { log() {}, warn() {}, error() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  URL, URLSearchParams, TextDecoder, TextEncoder, AbortController, Promise, Math, JSON, Date, Map, Set, Object, Array, String, Number, Boolean, RegExp, Error, isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
  // ?view=panel 이어야 initPanel() 이 실행돼 loadCatalog 가 만들어진다.
  location: { href: "https://example.test/?view=panel", hostname: "example.test", pathname: "/", search: "?view=panel", origin: "https://example.test" },
  document: {
    getElementById: () => el(), querySelector: () => el(), querySelectorAll: () => [],
    createElement: () => el(), addEventListener() {}, body: el(), documentElement: el(),
  },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  navigator: { userAgent: "node", clipboard: { writeText: async () => {} } },
  miro: { board: { ui: { on() {} }, get: async () => [], getInfo: async () => ({ id: "b" }), getSelection: async () => [] } },
  addEventListener() {}, alert() {}, requestAnimationFrame: (f) => setTimeout(f, 0),
  fetch: async (u) => {
    seen.push(String(u));
    const s = String(u);
    if (s.includes("?catalog=")) return { ok: true, status: 200, json: async () => CATALOG };
    if (s.includes("?comps=")) return { ok: true, status: 200, json: async () => OVERLAY };
    return { ok: false, status: 404, json: async () => ({}), text: async () => "" };
  },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

// loadCatalog 는 initPanel() 안에 있다. 테스트에서만 내부를 꺼내 쓰기 위해,
// initPanel 안의 안정된 지점 한 곳에 통로를 끼워 넣는다(본문 로직은 그대로).
const ANCHOR = "fillCatPicker();  // 카테고리 선택 기본값(검색 전)";
if (!main.includes(ANCHOR)) {
  console.error(`❌ 테스트 삽입 지점을 찾지 못함: ${ANCHOR}`);
  console.error("   index.html 이 바뀌었다면 이 테스트의 ANCHOR 도 함께 고쳐야 한다.");
  process.exit(1);
}
const probe = ANCHOR +
  "\n;globalThis.__t = { loadCatalog, items: () => importItems, proxy: (u) => { __proxy = { url: u, token: 't' }; } };";
try {
  runInNewContext(main.replace(ANCHOR, probe), sandbox, { timeout: 15000 });
} catch (e) {
  console.error("❌ 패널 스크립트 실행 실패:", String((e && e.message) || e));
  process.exit(1);
}

const t = sandbox.__t;
if (!t || typeof t.loadCatalog !== "function") { console.error("❌ loadCatalog 를 꺼내지 못함"); process.exit(1); }
t.proxy("https://worker.test");

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

await t.loadCatalog(SITE, "American Eagle");
const items = t.items() || [];

if (items.length !== 2) fail(`상품 ${items.length}개 — 2개여야 한다`);

// ① 오버레이를 실제로 조회했는가. (안 물어보면 값이 붙을 리가 없다)
if (!seen.some((u) => u.includes("?comps=" + SITE))) fail("오버레이(?comps=)를 조회하지 않았다");

// ② 값이 항목에 실렸는가 — 카탈로그에는 없고 오버레이에만 있던 값들.
const want = [
  { url: "https://www.ae.com/p/1", comp: "Cotton 95% / Elastane 5%", color: "White", sizes: "XS, S, M, L" },
  { url: "https://www.ae.com/p/2", comp: "Cotton 100%", color: "Medium Wash", sizes: "0, 2, 4, 6" },
];
for (const w of want) {
  const it = items.find((p) => p.productUrl === w.url);
  if (!it) { fail(`${w.url} 항목이 없다`); continue; }
  for (const k of ["comp", "color", "sizes"]) {
    if (it[k] !== w[k]) fail(`${w.url} 의 ${k}: "${it[k]}" — "${w[k]}" 여야 한다`);
  }
}

// ③ 카탈로그가 이미 가진 값(가격)은 오버레이가 덮어쓰지 않는다.
const first = items.find((p) => p.productUrl === "https://www.ae.com/p/1");
if (first && first.price !== "$24.95") fail(`가격이 바뀌었다: "${first.price}"`);

if (bad) { console.error(`\n❌ 오버레이 병합 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 오버레이 병합 통과 — 브랜드 목록 경로가 혼용률·컬러·사이즈를 붙인다 (상품 ${items.length}건, URL 표기 차이 포함)`);
