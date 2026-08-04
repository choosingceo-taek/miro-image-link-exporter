#!/usr/bin/env node
// 브랜드 목록 전수 점검 — "앱에 뜨는데 아무도 안 긁는 브랜드"를 찾는다.
//
// 왜 필요한가: 브랜드를 긁는 주체는 셋이고, 담당은 blocked-brands.json 이 나눈다.
//   ① Render 서버 프리페치(03:00)  — 차단 목록에 없는 브랜드
//   ② 헤드리스 크롬(03:30)          — blocked.browser
//   ③ 크롬 확장(05:00)              — blocked.brands
// 그래서 "서버가 못 긁는데 차단 목록에도 없는" 브랜드는 아무도 담당하지 않는다.
// 저장본은 처음 한 번 들어온 채로 영영 늙고, 앱은 그 브랜드를 '서버 담당'으로 알아
// 성공할 수 없는 실시간 수집을 90초 기다린다. ae.com(American Eagle·Aerie)이 그랬다.
//
// 판정은 추측하지 않고 저장 상태로 한다: 담당이 없는데 저장본이 오래됐거나 아예 없으면
// 구멍이다. 카테고리 URL 유무도 함께 본다 — URL 이 없으면 목록에 넣어도 못 긁는다.
//
// env: WORKER_URL, WORKER_TOKEN, RENDER_URL, STALE_HOURS(기본 48)

const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const STALE_H = Math.max(1, Number(process.env.STALE_HOURS) || 48);
const tok = "&token=" + encodeURIComponent(TOKEN);

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const CATS = ["tops", "sweatshirts", "shirts", "dresses", "pants"];

async function getJson(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    await new Promise((r) => setTimeout(r, 4000));
  }
  throw last || new Error("fetch failed");
}

const [brands, blocked, links, catalogs] = await Promise.all([
  getJson(`${RENDER}/brands.json`),
  getJson(`${RENDER}/blocked-brands.json`),
  getJson(`${RENDER}/category-links.json`),
  getJson(`${WORKER}/?catalogs=1${tok}`),
]);

const list = (catalogs && catalogs.list) || [];
const byKey = new Map();
for (const c of list) {
  byKey.set(norm(c.site), c);
  if (c.brand) byKey.set(norm(c.brand), c);
  byKey.set(norm(String(c.site).split(".").pop()), c);
}
// 저장본 찾기는 앱(findSavedCatalog)과 같은 규칙으로 — 앱이 못 찾으면 여기서도 못 찾아야
// 진단이 맞는다. 이름 정확 일치 → 그다음 같은 호스트에 키가 하나뿐일 때만.
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

const inBrands = new Set((blocked.brands || []).map(norm));   // 확장 담당
const inBrowser = new Set((blocked.browser || []).map(norm)); // 헤드리스 담당
const rows = [];
for (const b of Array.isArray(brands) ? brands : []) {
  const name = String(b.name || "");
  if (!name) continue;
  const nb = norm(name);
  const owner = inBrands.has(nb) ? "확장" : inBrowser.has(nb) ? "헤드리스" : "서버";
  const saved = savedFor(name, b.url);
  const ageH = saved && saved.updated ? Math.round((Date.now() - saved.updated) / 3600000) : null;
  const c = links[name] || {};
  const urlCount = CATS.reduce((n, k) => n + ((c[k] || []).length), 0);
  rows.push({ name, url: b.url || "", owner, site: saved ? saved.site : "", count: saved ? (saved.count || 0) : 0, ageH, urlCount });
}

// 구멍: 서버 담당인데 저장본이 없거나 오래됐다 = 서버가 못 긁고 있는데 아무도 안 맡았다.
const holes = rows.filter((r) => r.owner === "서버" && (r.ageH === null || r.ageH > STALE_H));
// 담당은 있는데 카테고리 URL 이 없으면 목록에 있어도 수집이 안 된다.
const noUrl = rows.filter((r) => r.owner !== "서버" && r.urlCount === 0);
// 앱이 저장본을 못 찾는 브랜드(같은 호스트에 키가 여럿 + 이름 불일치).
const unfindable = rows.filter((r) => !r.site && r.owner !== "서버");

const pad = (s, n) => String(s).padEnd(n);
console.log(`브랜드 ${rows.length}개 · 담당 — 서버 ${rows.filter((r) => r.owner === "서버").length}, ` +
  `헤드리스 ${rows.filter((r) => r.owner === "헤드리스").length}, 확장 ${rows.filter((r) => r.owner === "확장").length}`);

console.log(`\n⛔ 아무도 안 긁는 브랜드 ${holes.length}개 (서버 담당인데 저장본이 ${STALE_H}시간 초과 또는 없음)`);
if (holes.length) {
  console.log("   → blocked-brands.json 의 brands(확장) 또는 browser(헤드리스)에 넣어야 한다.\n");
  console.log("   " + pad("브랜드", 26) + pad("저장", 9) + pad("갱신", 12) + pad("카테고리URL", 12) + "호스트");
  for (const r of holes.sort((a, z) => (z.count || 0) - (a.count || 0))) {
    let host = ""; try { host = new URL(r.url).hostname.replace(/^www\./, ""); } catch (e) {}
    console.log("   " + pad(r.name, 26) + pad(r.count ? r.count + "개" : "없음", 9) +
      pad(r.ageH === null ? "-" : r.ageH + "시간 전", 12) +
      pad(r.urlCount ? r.urlCount + "개" : "❌ 없음", 12) + host);
  }
}

if (noUrl.length) {
  console.log(`\n⚠ 담당은 있는데 카테고리 URL 이 없는 브랜드 ${noUrl.length}개 — 수집기가 열 페이지가 없다`);
  for (const r of noUrl) console.log(`   - ${r.name} (${r.owner})`);
}

if (unfindable.length) {
  console.log(`\n⚠ 앱이 저장본을 못 찾는 브랜드 ${unfindable.length}개 — 이름이 저장 키와 어긋났거나 한 번도 수집 안 됨`);
  for (const r of unfindable) console.log(`   - ${r.name} (${r.owner})`);
}

if (!holes.length && !noUrl.length && !unfindable.length) console.log("\n✅ 구멍 없음 — 모든 브랜드에 담당이 있고 저장본이 살아 있다");

// 구멍이 있으면 종료코드 1 — 워크플로에서 눈에 띄게. (점검이지 실패는 아니므로 EXIT_OK=1 로 끌 수 있다)
if (holes.length && process.env.EXIT_OK !== "1") process.exit(1);
