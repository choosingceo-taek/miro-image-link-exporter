#!/usr/bin/env node
// 저장된 카탈로그 점검 — 상품이 아닌 항목(배너·내비게이션·안내 페이지)이 섞였는지 찾는다.
//
// 미로 앱은 Worker KV에 저장된 것을 그대로 보여주므로, 여기서 걸리는 항목이 곧 화면에 뜨는 쓰레기다.
// 어떤 브랜드의 어떤 카테고리 URL에서 왔는지까지 짚어 준다
// (item.src 가 있으면 그대로, 없으면 category-links.json 과 경로를 대조해 추정).
//
// env: WORKER_URL, WORKER_TOKEN, RENDER_URL, LIMIT(브랜드당 표시 개수, 기본 12)

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const LIMIT = Math.max(1, Number(process.env.LIMIT) || 12);

async function getJson(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    await new Promise((res) => setTimeout(res, 4000));
  }
  throw last;
}

// 상품 상세 페이지가 아닌 것이 확실한 "경로 조각"들.
// 부분 문자열이 아니라 경로 세그먼트 단위로 맞춰야 한다 —
// /cart 를 그냥 찾으면 /cartmel-flared-jeans 가 걸리고, /store 는 /store/product/... 가 걸린다.
const NON_PRODUCT_SEGMENTS = [
  "account", "login", "signin", "register", "cart", "bag", "basket", "checkout", "wishlist",
  "gift-?cards?", "e-?gift", "size-?(?:guide|chart)", "help", "faq", "contact",
  "customer-?(?:service|care)", "store-?locator", "find-a-stores?", "our-stores?",
  "blogs?", "journal", "magazine", "press", "about(?:-us)?", "careers?", "jobs?",
  "returns?", "shipping", "delivery", "terms", "privacy", "cookies?", "legal",
  "sitemap", "search", "newsletter", "subscribe", "sustainability", "lookbook",
  "campaigns?", "editorial", "inspiration", "guides?", "how-to", "klarna", "afterpay",
  "loyalty", "rewards", "affiliates?",
];
const NON_PRODUCT_PATH = new RegExp("/(?:" + NON_PRODUCT_SEGMENTS.join("|") + ")(?:/|$)", "i");

// 상품명이 아니라 배너 문구인 것들.
const BANNER_TEXT = new RegExp([
  "^shop\\b", "^discover\\b", "^explore\\b", "^view all", "^see all", "^shop all",
  "^new in$", "^new arrivals?$", "^sale$", "^clearance$", "^outlet$", "^gift", "^bestsellers?$",
  "free shipping", "free delivery", "sign ?up", "log ?in", "learn more", "read more",
  "size guide", "find your", "download", "^back to", "^more\\b", "^all \\w+$",
  "^\\d+% off", "^up to \\d+", "^버튼$", "^자세히", "^더보기$",
].join("|"), "i");

const cats = ["tops", "sweatshirts", "shirts", "dresses", "pants"];

const tok = "&token=" + encodeURIComponent(TOKEN);
const [ls, links, brandsJson] = await Promise.all([
  getJson(WORKER + "/?catalogs=1" + tok),
  getJson(RENDER + "/category-links.json").catch(() => ({})),
  getJson(RENDER + "/api/brands").catch(() => ({ brands: [] })),
]);
const list = (ls && ls.list) || [];
const groupOf = new Map((brandsJson.brands || []).map((b) => [b.name.toLowerCase(), b.group || "server"]));
console.log(`저장된 카탈로그 ${list.length}개 점검…`);

// 브랜드별 카테고리 URL 목록(경로 접두사로 출처를 추정하는 데 쓴다).
const linkPaths = new Map();   // 브랜드 → [{url, path}]
for (const [name, c] of Object.entries(links)) {
  const arr = [];
  for (const k of cats) {
    for (const u of c[k] || []) {
      try { arr.push({ url: u, path: new URL(u).pathname.replace(/\/+$/, "") }); } catch (e) {}
    }
  }
  if (arr.length) linkPaths.set(name.toLowerCase(), arr);
}
// 카테고리 URL 자체(상품이 아니라 목록 페이지)를 상품으로 저장한 경우를 잡기 위한 집합.
const allListing = new Set();
for (const arr of linkPaths.values()) for (const a of arr) allListing.add(a.url.replace(/\/+$/, ""));

function guessSrc(brand, productUrl) {
  const arr = linkPaths.get(String(brand || "").toLowerCase()) || [];
  let best = "", bestLen = 0;
  let p = "";
  try { p = new URL(productUrl).pathname; } catch (e) { return ""; }
  for (const a of arr) {
    if (a.path && p.startsWith(a.path) && a.path.length > bestLen) { best = a.url; bestLen = a.path.length; }
  }
  return best;
}

function why(it) {
  const url = String(it.productUrl || "");
  const name = String(it.name || "").trim();
  let path = "";
  try { path = new URL(url).pathname.replace(/\/+$/, ""); } catch (e) { return "URL 형식 오류"; }
  if (allListing.has(url.replace(/\/+$/, ""))) return "카테고리 목록 페이지 자체";
  if (NON_PRODUCT_PATH.test(path)) return "상품 페이지가 아닌 경로";
  if (!name) return "이름 없음";
  if (BANNER_TEXT.test(name)) return "배너 문구가 상품명";
  if (path.split("/").filter(Boolean).length <= 1 && path.length < 16) return "최상위 경로(랜딩 페이지로 보임)";
  return "";
}

const report = [];
const low = [];                 // 수집량이 비정상적으로 적은 브랜드
const deadUrls = [];            // 상품을 한 개도 못 준 카테고리 URL(교체 대상)
const priceCov = [];            // 브랜드별 가격 채움률(보드 스캐너 엑셀 '가격' 열의 근거)
const compCov = [];             // 브랜드별 혼용률 채움률(야간 보강 진행도)
const fieldCov = [];            // 브랜드별 4항목(가격·컬러·사이즈·혼용률) 채움률
const LOW_MARK = Math.max(1, Number(process.env.LOW_MARK) || 60);
let scanned = 0, flagged = 0;
for (const c of list) {
  let d;
  try { d = await getJson(WORKER + "/?catalog=" + encodeURIComponent(c.site) + tok, 2); }
  catch (e) { report.push({ brand: c.brand || c.site, site: c.site, error: String(e.message || e) }); continue; }
  const items = d.items || [];
  scanned += items.length;
  // 출처(src)별로 묶어 보고 — 어떤 카테고리 URL이 문제인지 바로 보이게.
  const bySrc = new Map();
  for (const it of items) {
    const reason = why(it);
    if (!reason) continue;
    flagged++;
    const src = it.src || guessSrc(d.brand || c.brand, it.productUrl) || "(출처 불명)";
    if (!bySrc.has(src)) bySrc.set(src, []);
    bySrc.get(src).push({ name: it.name, productUrl: it.productUrl, category: it.category, reason });
  }
  // 상품을 한 개도 못 준 카테고리 URL = 교체 대상. 저조 여부와 상관없이 전 브랜드에서 모은다.
  // (한 카테고리가 죽어도 다른 카테고리가 많으면 총계로는 안 드러난다)
  {
    const brandName = d.brand || c.brand || "";
    const linked = linkPaths.get(String(brandName).toLowerCase()) || [];
    if (linked.length) {
      const got = new Set(items.map((it) => it.src).filter(Boolean));
      const anySrc = got.size > 0;   // src 기록이 없는 옛 저장분은 판정 불가 → 건너뜀
      const dead = linked.filter((a) => !got.has(a.url)).map((a) => a.url);
      if (anySrc && dead.length) {
        deadUrls.push({
          brand: brandName,
          group: groupOf.get(String(brandName).toLowerCase()) || "?",
          total: items.length, dead,
        });
      }
    }
  }

  // 가격은 목록 카드의 텍스트에서 통화기호로 뽑는다. 통화 표기가 다르거나(zł, kr)
  // 가격을 이미지·지연로딩으로 그리는 사이트는 빈칸이 되고, 그러면 보드 스캐너
  // 엑셀의 '가격' 열도 빈칸으로 나온다. 브랜드별 채움률을 남겨 어디가 안 되는지 본다.
  // 혼용률·컬러·사이즈는 오버레이(comp:<site>)에, 가격은 카탈로그에 있다.
  // 엑셀 열마다 실제로 몇 %가 채워지는지 그대로 센다.
  let ov = {};
  try { ov = await getJson(WORKER + "/?comps=" + encodeURIComponent(c.site) + tok, 1) || {}; } catch (e) {}
  {
    // 예전 확장(≤1.7.3)이 수집 결과 객체를 통째로 String() 해 넣은 '[object Object]' 는
    // 값이 아니다. 이걸 세면 채움률이 실제보다 높게 나와 문제를 못 본다.
    const g = (it, k) => {
      const t = String((ov[it.productUrl] || {})[k] || it[k] || "").trim();
      return t === "[object Object]" ? "" : t;
    };
    const withPrice = items.filter((it) => g(it, "price")).length;
    const withComp = items.filter((it) => g(it, "comp")).length;
    const withColor = items.filter((it) => g(it, "color")).length;
    const withSizes = items.filter((it) => g(it, "sizes")).length;
    fieldCov.push({
      brand: d.brand || c.brand || c.site,
      group: groupOf.get(String(d.brand || c.brand || "").toLowerCase()) || "?",
      total: items.length, price: withPrice, color: withColor, sizes: withSizes, comp: withComp,
    });
    compCov.push({
      brand: d.brand || c.brand || c.site,
      group: groupOf.get(String(d.brand || c.brand || "").toLowerCase()) || "?",
      total: items.length, withComp,
      pct: items.length ? Math.round((withComp / items.length) * 100) : 0,
    });
    priceCov.push({
      brand: d.brand || c.brand || c.site,
      group: groupOf.get(String(d.brand || c.brand || "").toLowerCase()) || "?",
      total: items.length,
      withPrice,
      pct: items.length ? Math.round((withPrice / items.length) * 100) : 0,
      sample: (items.find((it) => String(it.price || "").trim()) || {}).price || "",
    });
  }

  // 수집이 저조한 브랜드는 "어느 카테고리 URL이 몇 개를 줬는지"까지 남긴다.
  // 5개 카테고리를 돌았는데 총계가 적다면, 어떤 URL이 빈손이었는지가 원인이다.
  if (items.length < LOW_MARK) {
    const per = new Map();
    for (const it of items) {
      const k = it.src || "(출처 없음 — 옛 수집분)";
      per.set(k, (per.get(k) || 0) + 1);
    }
    const links = linkPaths.get(String(d.brand || c.brand || "").toLowerCase()) || [];
    for (const a of links) if (!per.has(a.url)) per.set(a.url, 0);   // 한 개도 못 준 URL도 보이게
    low.push({
      brand: d.brand || c.brand || c.site, site: c.site,
      group: groupOf.get(String(d.brand || c.brand || "").toLowerCase()) || "?",
      total: items.length,
      perSrc: [...per.entries()].map(([src, n]) => ({ src, n })).sort((a, b) => a.n - b.n),
      sample: items.slice(0, 3).map((it) => ({ name: it.name, productUrl: it.productUrl })),
    });
  }

  if (bySrc.size) {
    const bad = [...bySrc.entries()].map(([src, rows]) => ({ src, count: rows.length, rows: rows.slice(0, LIMIT) }));
    bad.sort((a, b) => b.count - a.count);
    report.push({
      brand: d.brand || c.brand || c.site, site: c.site,
      group: groupOf.get(String(d.brand || c.brand || "").toLowerCase()) || "?",
      total: items.length, badCount: bad.reduce((s, x) => s + x.count, 0), bySrc: bad,
    });
  }
  console.log(`  ${c.site}: ${items.length}개 중 문제 ${bySrc.size ? [...bySrc.values()].reduce((s, r) => s + r.length, 0) : 0}개`);
}

report.sort((a, z) => (z.badCount || 0) - (a.badCount || 0));
let md = `# 저장 카탈로그 점검 — 상품이 아닌 항목 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
md += `- 카탈로그 ${list.length}개 · 상품 ${scanned}개 검사 · **문제 항목 ${flagged}개**\n`;
md += `- 문제가 있는 브랜드 ${report.filter((r) => r.badCount).length}개\n\n`;
md += `> 출처는 item.src 가 있으면 그대로, 없으면 경로를 카테고리 링크와 대조해 추정한 값입니다.\n\n`;
for (const r of report) {
  if (r.error) { md += `## ${r.brand}\n\n- 읽기 실패: ${r.error}\n\n`; continue; }
  md += `## ${r.brand} — ${r.badCount}/${r.total}개 (${r.group})\n\n`;
  for (const b of r.bySrc) {
    md += `- **${b.count}개** · ${b.src}\n`;
    for (const row of b.rows) md += `  - [${row.reason}] ${row.category} · ${row.name || "(이름없음)"} — ${row.productUrl}\n`;
  }
  md += `\n`;
}
// 같은 브랜드가 두 벌 저장되면 미로 앱이 둘 중 아무거나 집는다.
// 저장 키는 <host>.<브랜드슬러그> 가 정상이고, <host> 만 있는 것은 옛 형식이다.
// 둘 다 남아 있으면 상품 수·점검 결과가 이중 계산되므로 반드시 알린다.
const byHost = new Map();
for (const c of list) {
  const site = String(c.site || "");
  const host = site.split(".").slice(0, 2).join(".");   // example.com
  if (!byHost.has(host)) byHost.set(host, []);
  byHost.get(host).push(c);
}
const dupes = [];
for (const [host, group] of byHost) {
  if (group.length < 2) continue;
  const bare = group.filter((c) => String(c.site) === host);
  const proper = group.filter((c) => String(c.site) !== host);
  if (bare.length && proper.length) {
    dupes.push({ host, bare: bare[0], proper: proper.map((c) => ({ site: c.site, brand: c.brand, count: c.count })) });
  }
}
let km = "";
if (dupes.length) {
  km = `# \u26a0 중복 저장 키 ${dupes.length}건 — 같은 브랜드가 두 벌 저장됨\n\n`;
  km += `\`<host>\` 만으로 저장된 옛 키와 \`<host>.<브랜드슬러그>\` 새 키가 함께 있습니다.\n`;
  km += `상품 수·점검 결과가 이중 계산되고, 미로 앱이 둘 중 아무거나 집을 수 있습니다.\n\n`;
  km += `| 옛 키(삭제 대상) | 개수 | 정상 키 | 개수 |\n|---|---:|---|---:|\n`;
  for (const d of dupes) {
    const p = d.proper[0];
    km += `| ${d.bare.site} | ${d.bare.count || 0} | ${p.site} | ${p.count || 0} |\n`;
  }
  km += `\n`;
}

// 확장 담당 브랜드는 사람이 크롬을 켜야만 갱신된다. 며칠 잊으면 미로 앱이 조용히
// 옛날 상품을 보여주므로, 저장본의 갱신 시각을 여기서 같이 찍어 둔다.
// (샌드박스에서는 Worker 로 직접 못 나가서, 이 리포트가 유일한 확인 경로다.)
const STALE_H = Math.max(1, Number(process.env.STALE_HOURS) || 36);
const now = Date.now();
const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const seen = new Map();
for (const c of list) {
  if (c.brand) seen.set(slug(c.brand), c);
  // 저장 키가 <host>.<브랜드슬러그> 라서 브랜드 메타가 비어도 뒤쪽으로 되찾을 수 있다.
  const tail = String(c.site || "").split(".").pop();
  if (tail && !seen.has(slug(tail))) seen.set(slug(tail), c);
}
const extBrands = (brandsJson.brands || []).filter((b) => (b.group || "server") === "extension");
const extRows = extBrands.map((b) => {
  const c = seen.get(slug(b.name));
  const age = c && c.updated ? (now - c.updated) / 3600e3 : null;
  return { name: b.name, items: c ? c.count || 0 : 0, age, missing: !c };
}).sort((a, z) => (z.age ?? 1e9) - (a.age ?? 1e9));
const stale = extRows.filter((r) => r.missing || r.age === null || r.age > STALE_H);

let em = `# 크롬 확장 담당 브랜드 갱신 상태 (${extRows.length}개)\n\n`;
if (!stale.length) {
  em += `모두 ${STALE_H}시간 안에 갱신됨 — 확장 실행이 밀리지 않았습니다.\n\n`;
} else {
  em += `**확장 실행 필요 ${stale.length}개** — ${STALE_H}시간 넘게 갱신되지 않았습니다.\n`;
  em += `개인/회사 PC 크롬에서 \`RACK 상품 수집기\` 팝업의 전체 수집을 한 번 돌리세요.\n\n`;
  for (const r of stale) {
    em += r.missing
      ? `- ⛔ ${r.name} — 저장본 없음(한 번도 수집 안 됨)\n`
      : `- ⚠ ${r.name} — ${Math.round(r.age)}시간 전 · ${r.items}개\n`;
  }
  em += `\n`;
}
const okRows = extRows.filter((r) => !stale.includes(r));
if (okRows.length) {
  em += `<details><summary>정상 ${okRows.length}개</summary>\n\n`;
  for (const r of okRows) em += `- ${r.name} — ${Math.round(r.age)}시간 전 · ${r.items}개\n`;
  em += `\n</details>\n\n`;
}

// 죽은 URL 먼저 — 사람이 조치할 수 있는 유일한 항목이라 맨 위에 둔다.
deadUrls.sort((a, z) => z.dead.length - a.dead.length);
let dm = `# 교체가 필요한 카테고리 URL\n\n`;
dm += `상품을 **한 개도** 주지 못한 주소입니다. 브랜드 사이트에서 개편·삭제됐을 가능성이 큽니다.\n`;
dm += `대체 주소를 찾으면 \`카테고리 URL 수정\` 워크플로로 갈아끼우세요.\n\n`;
dm += `- 대상 ${deadUrls.length}개 브랜드 · URL ${deadUrls.reduce((s, r) => s + r.dead.length, 0)}개\n\n`;
for (const r of deadUrls) {
  dm += `## ${r.brand} (${r.group}) — 현재 ${r.total}개 저장\n\n`;
  for (const u of r.dead) dm += `- ${u}\n`;
  dm += `\n`;
}
// 보드 스캐너 엑셀의 '가격' 열은 여기 값을 그대로 쓴다. 0%면 그 브랜드는 가격이 빈칸으로 나온다.
priceCov.sort((a, z) => a.pct - z.pct || z.total - a.total);
const noPrice = priceCov.filter((r) => r.total >= 5 && r.pct < 20);
const partPrice = priceCov.filter((r) => r.total >= 5 && r.pct >= 20 && r.pct < 90);
let pm = `# 가격 수집 상태 (보드 스캐너 엑셀 '가격' 열)\n\n`;
pm += `목록 카드 텍스트에서 통화기호로 뽑습니다. 통화 표기가 다르거나(zł·kr 등) 가격을\n`;
pm += `이미지·지연로딩으로 그리는 사이트는 빈칸이 되고, 엑셀 '가격' 열도 비게 됩니다.\n\n`;
pm += `- 전체 ${priceCov.length}개 브랜드 · ❌ 거의 없음 ${noPrice.length}개 · ⚠ 일부만 ${partPrice.length}개\n\n`;
if (noPrice.length) {
  pm += `## ❌ 가격이 거의 안 잡히는 브랜드 (20% 미만)\n\n| 브랜드 | 그룹 | 가격있음/전체 |\n|---|---|---:|\n`;
  for (const r of noPrice) pm += `| ${r.brand} | ${r.group} | ${r.withPrice}/${r.total} (${r.pct}%) |\n`;
  pm += `\n`;
}
if (partPrice.length) {
  pm += `## ⚠ 일부만 잡히는 브랜드 (20~90%)\n\n| 브랜드 | 그룹 | 가격있음/전체 | 예시 |\n|---|---|---:|---|\n`;
  for (const r of partPrice) pm += `| ${r.brand} | ${r.group} | ${r.withPrice}/${r.total} (${r.pct}%) | ${r.sample} |\n`;
  pm += `\n`;
}

// 혼용률 백필 진행도 — "다 되어야 한다"가 목표라 100% 미만 브랜드를 전부 보여준다.
compCov.sort((a, z) => a.pct - z.pct || z.total - a.total);
const compAll = compCov.reduce((s2, r) => s2 + r.total, 0);
const compHave = compCov.reduce((s2, r) => s2 + r.withComp, 0);
const compGaps = compCov.filter((r) => r.total >= 5 && r.pct < 100);
let cm = `# 혼용률 채움 상태 (보드 스캐너 엑셀 '혼용률' 열)\n\n`;
cm += `야간 보강(enrich-comp)과 크롬 확장 1.7 이 미리 채운다 — 스캔 때 사이트 접속 없음.\n\n`;
cm += `- 전체 ${compHave}/${compAll}개 (${compAll ? Math.round((compHave / compAll) * 100) : 0}%) · 미완 브랜드 ${compGaps.length}개\n\n`;
if (compGaps.length) {
  cm += `<details><summary>브랜드별 진행도</summary>\n\n| 브랜드 | 그룹 | 보유/전체 |\n|---|---|---:|\n`;
  for (const r of compGaps) cm += `| ${r.brand} | ${r.group} | ${r.withComp}/${r.total} (${r.pct}%) |\n`;
  cm += `\n</details>\n\n`;
}

// ── 엑셀 4항목 채움률 — 시연·업무에서 실제로 보이는 값 ──────────────────
const pctOf = (n, t) => (t ? Math.round((n / t) * 100) : 0);
const sum = (k) => fieldCov.reduce((a, r) => a + r[k], 0);
const totAll = fieldCov.reduce((a, r) => a + r.total, 0);
fieldCov.sort((a, z) => z.total - a.total);
const SAFE = (r) => r.total >= 10 && pctOf(r.price, r.total) >= 80 && pctOf(r.comp, r.total) >= 80;
const safe = fieldCov.filter(SAFE);
let fm = `# 엑셀 4항목 채움률 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
fm += `보드 스캐너 엑셀에 실제로 찍히는 값이다. 빈 칸은 '확인 필요'로 표시된다.\n\n`;
fm += `| 항목 | 채움 | 비율 |\n|---|---:|---:|\n`;
for (const [label, k] of [["가격", "price"], ["컬러", "color"], ["사이즈", "sizes"], ["혼용률", "comp"]]) {
  fm += `| ${label} | ${sum(k)}/${totAll} | ${pctOf(sum(k), totAll)}% |\n`;
}
fm += `\n**가격·혼용률 모두 80% 이상인 브랜드 ${safe.length}개** (시연에 안전)\n\n`;
if (safe.length) {
  fm += `| 브랜드 | 상품 | 가격 | 컬러 | 사이즈 | 혼용률 |\n|---|---:|---:|---:|---:|---:|\n`;
  for (const r of safe.slice(0, 40)) {
    fm += `| ${r.brand} | ${r.total} | ${pctOf(r.price, r.total)}% | ${pctOf(r.color, r.total)}% | ${pctOf(r.sizes, r.total)}% | ${pctOf(r.comp, r.total)}% |\n`;
  }
  fm += `\n`;
}
const weak = fieldCov.filter((r) => r.total >= 10 && !SAFE(r));
if (weak.length) {
  fm += `<details><summary>아직 부족한 브랜드 ${weak.length}개</summary>\n\n`;
  fm += `| 브랜드 | 그룹 | 상품 | 가격 | 컬러 | 사이즈 | 혼용률 |\n|---|---|---:|---:|---:|---:|---:|\n`;
  for (const r of weak) {
    fm += `| ${r.brand} | ${r.group} | ${r.total} | ${pctOf(r.price, r.total)}% | ${pctOf(r.color, r.total)}% | ${pctOf(r.sizes, r.total)}% | ${pctOf(r.comp, r.total)}% |\n`;
  }
  fm += `\n</details>\n\n`;
}

md = fm + `\n---\n\n` + km + em + `\n---\n\n` + cm + `\n---\n\n` + pm + `\n---\n\n` + dm + `\n---\n\n` + md;

low.sort((a, z) => a.total - z.total);
md += `# 수집량이 적은 브랜드 (${LOW_MARK}개 미만)\n\n`;
md += `카테고리 URL별로 몇 개를 줬는지 — 0개인 URL이 원인이다.\n\n`;
for (const r of low) {
  md += `## ${r.brand} — ${r.total}개 (${r.group})\n\n`;
  for (const p of r.perSrc) md += `- ${String(p.n).padStart(4)}개 · ${p.src}\n`;
  for (const sm of r.sample) md += `  - 표본: ${sm.name || "(무명)"} — ${sm.productUrl}\n`;
  md += `\n`;
}
writeFileSync(join(ROOT, "catalog-audit.json"), JSON.stringify({ when: new Date().toISOString(), scanned, flagged, report, low, deadUrls, extension: extRows, priceCoverage: priceCov, compCoverage: compCov, fieldCoverage: fieldCov, duplicateKeys: dupes }, null, 1));
writeFileSync(join(ROOT, "catalog-audit.md"), md);
console.log(`\n검사 ${scanned}개 · 문제 ${flagged}개 · 브랜드 ${report.filter((r) => r.badCount).length}개`);
console.log(`교체 필요 URL ${deadUrls.reduce((s, r) => s + r.dead.length, 0)}개 (브랜드 ${deadUrls.length}개)`);
if (dupes.length) console.log(`\u26a0 중복 저장 키 ${dupes.length}건: ${dupes.map((d) => d.bare.site).join(", ")}`);
console.log(`확장 담당 ${extRows.length}개 중 ${STALE_H}시간 초과 ${stale.length}개${stale.length ? ": " + stale.map((r) => r.name).join(", ") : ""}`);
