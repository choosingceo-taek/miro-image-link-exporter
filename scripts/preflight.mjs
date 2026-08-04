#!/usr/bin/env node
// 내일 아침 실제로 쓸 수 있는 상태인지 사전 점검한다.
//
// 개별 점검(커버리지·채움률·중복키)은 각각 따로 있지만, 정작 쓰는 사람이 알고 싶은
// 것은 하나다: "지금 미로 앱을 열어서 브랜드를 고르고, 보드에 끌어다 놓고, 엑셀로
// 뽑으면 제대로 나오나?" 그 사슬을 한 줄로 답한다.
//
// 사슬의 고리마다 실제로 물어본다 — 설정 파일이 그렇게 적혀 있다가 아니라,
// 그 요청이 지금 실제로 성공하는지를 본다.
//
// env: WORKER_URL, WORKER_TOKEN, RENDER_URL, BRAND(한 브랜드만 깊게 볼 때)

const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const ONE = (process.env.BRAND || "").trim().toLowerCase();
const tok = "&token=" + encodeURIComponent(TOKEN);
const GATE = 0.95;

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const urlKey = (u) => {
  try { const x = new URL(u); return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/+$/, "")).toLowerCase(); }
  catch (e) { return ""; }
};

// 판정 규칙은 패널(index.html)과 같아야 한다 — 다르면 점검이 통과해도 엑셀은 빈다.
const COMP_ITEM_RX = /^[A-Za-z][A-Za-z ]{1,24} (\d{1,3})%$/;
function validComp(s) {
  const t = String(s || "").trim();
  if (!t || t.includes("[object Object]")) return false;
  const parts = t.split(" / ");
  if (parts.length > 8) return false;
  let total = 0;
  for (const p of parts) {
    const m = p.match(COMP_ITEM_RX);
    if (!m) return false;
    const n = Number(m[1]);
    if (!(n > 0 && n <= 100)) return false;
    total += n;
  }
  return (total >= 95 && total <= 105) || (total >= 190 && total <= 210);
}
const COLOR_BAD_RX = /^(?:select|choose|colou?r|색상|컬러|선택|기타|없음|n\/a|none|null|undefined|\d+|#[0-9a-f]{3,8})$/i;
function validColor(s) {
  const t = String(s || "").trim();
  if (!t || t.length > 40 || t.includes("[object Object]")) return false;
  return !COLOR_BAD_RX.test(t);
}

async function getJson(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw last || new Error("fetch failed");
}

let fail = 0, warn = 0;
const ok = (m) => console.log(`  ✅ ${m}`);
const no = (m) => { console.log(`  ❌ ${m}`); fail++; };
const hm = (m) => { console.log(`  ⚠  ${m}`); warn++; };

// ── ① 앱이 브랜드 목록을 받는가 ────────────────────────────────────
console.log("\n① 브랜드 목록 (미로 앱이 검색바를 채우는 곳)");
let brands = [], blocked = { brands: [], browser: [] };
try {
  [brands, blocked] = await Promise.all([getJson(`${RENDER}/brands.json`), getJson(`${RENDER}/blocked-brands.json`)]);
  ok(`브랜드 ${brands.length}개 · 확장 담당 ${(blocked.brands || []).length} · 헤드리스 ${(blocked.browser || []).length}`);
} catch (e) {
  no(`Render 서버 응답 없음 — ${String(e.message || e)}`);
  console.log("     무료 인스턴스가 잠들었을 수 있다. 브라우저로 한 번 열면 깨어난다.");
}

// ── ② 저장된 카탈로그가 있는가 ────────────────────────────────────
console.log("\n② 저장된 카탈로그 (앱이 실제로 읽는 곳)");
let list = [];
try {
  list = (await getJson(`${WORKER}/?catalogs=1${tok}`)).list || [];
  const stale = list.filter((c) => c.updated && Date.now() - c.updated > 72 * 3600e3).length;
  ok(`카탈로그 ${list.length}개 · 상품 ${list.reduce((n, c) => n + (c.count || 0), 0)}개`);
  if (stale) hm(`${stale}개가 72시간 넘게 안 갱신됨 — 그 브랜드는 신상이 빠져 있다`);
} catch (e) {
  no(`Worker 응답 없음 — ${String(e.message || e)}`);
}

// ── ③ 앱이 브랜드→저장본을 찾아내는가 ──────────────────────────────
// index.html 의 findSavedCatalog 와 같은 규칙. 여기서 못 찾으면 앱도 못 찾는다.
console.log("\n③ 브랜드 → 저장본 연결 (앱의 findSavedCatalog 와 같은 규칙)");
function savedFor(name, url) {
  const nb = norm(name);
  const exact = list.find((c) => norm(c.brand) === nb || norm(String(c.site).split(".").pop()) === nb);
  if (exact) return exact;
  let host = "";
  try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) {}
  if (!host) return null;
  const same = list.filter((c) => norm(c.site).startsWith(norm(host)));
  return same.length === 1 ? same[0] : null;
}
const targets = (Array.isArray(brands) ? brands : []).filter((b) => !ONE || String(b.name).toLowerCase().includes(ONE));
const unmatched = targets.filter((b) => !savedFor(b.name, b.url));
if (!targets.length) no("점검할 브랜드가 없다");
else if (!unmatched.length) ok(`${targets.length}개 전부 저장본과 연결된다`);
else {
  hm(`${unmatched.length}개는 저장본을 못 찾는다 — 앱에서 "검색 결과 확인이 필요합니다"로 보인다`);
  for (const b of unmatched.slice(0, 12)) console.log(`     - ${b.name}`);
}

// ── ④ 엑셀에 혼용률·컬러웨이가 실려 나오는가 ─────────────────────
// 카탈로그와 오버레이를 앱과 똑같이 합쳐 보고, 그 브랜드를 지금 뽑으면
// 두 열이 열리는지 판정한다.
console.log("\n④ 엑셀 열 개방 판정 (브랜드를 지금 뽑으면 컬러웨이·혼용률이 붙는가)");
const check = ONE ? list.filter((c) => norm(c.brand).includes(norm(ONE)) || norm(c.site).includes(norm(ONE))) : list;
const ready = [], notReady = [];
let checked = 0;
for (const c of check) {
  if (!ONE && checked >= 200) break;
  checked++;
  let cat, ov;
  try {
    [cat, ov] = await Promise.all([
      getJson(`${WORKER}/?catalog=${encodeURIComponent(c.site)}${tok}`),
      getJson(`${WORKER}/?comps=${encodeURIComponent(c.site)}${tok}`).catch(() => ({})),
    ]);
  } catch (e) { hm(`${c.brand || c.site}: 읽기 실패 ${String(e.message || e)}`); continue; }
  const byKey = new Map();
  for (const [u, o] of Object.entries(ov || {})) if (o) byKey.set(urlKey(u), o);
  const items = (cat.items || []).filter((p) => p && p.imageUrl && p.productUrl);
  if (!items.length) { notReady.push({ brand: cat.brand || c.site, comp: 0, color: 0, n: 0 }); continue; }
  let nc = 0, ncl = 0;
  for (const p of items) {
    const o = byKey.get(urlKey(p.productUrl)) || {};
    if (validComp(p.comp || o.comp)) nc++;
    if (validColor(p.color || o.color)) ncl++;
  }
  const row = { brand: cat.brand || c.site, comp: nc / items.length, color: ncl / items.length, n: items.length };
  (row.comp >= GATE && row.color >= GATE ? ready : notReady).push(row);
}
const pct = (x) => Math.round(x * 100) + "%";
ok(`두 열이 다 붙는 브랜드 ${ready.length}/${ready.length + notReady.length}개 (상품 ${ready.reduce((n, r) => n + r.n, 0)}개)`);
if (ready.length) console.log(`     ${ready.map((r) => r.brand).sort().join(" · ")}`);
if (ONE && notReady.length) {
  for (const r of notReady) console.log(`     ${r.brand}: 혼용률 ${pct(r.comp)} · 컬러 ${pct(r.color)} (상품 ${r.n})`);
}

// ── ⑤ 내일 아침 무엇이 언제 도는가 ────────────────────────────────
console.log("\n⑤ 내일 아침 일정 (KST)");
console.log("     03:00  서버 프리페치      — 차단 목록에 없는 브랜드");
console.log("     03:30  헤드리스 크롬      — blocked.browser");
console.log(`     05:00  크롬 확장          — blocked.brands ${(blocked.brands || []).length}개 (PC 가 켜져 있어야 한다)`);
console.log("     05:30  혼용률·컬러 보강   — 저장된 카탈로그의 빈 항목");
console.log("     06:00  커버리지 점검      — 담당 없는 브랜드 찾기");

console.log("\n" + "─".repeat(60));
if (fail) {
  console.log(`❌ 막힌 곳 ${fail}건 — 내일 아침 이대로면 문제가 생긴다`);
  process.exit(1);
}
console.log(warn
  ? `✅ 사슬은 이어져 있다 · 주의 ${warn}건 (위 ⚠ 참고)`
  : `✅ 사슬이 전부 이어져 있다 — 브랜드 검색 → 보드 → 엑셀`);
