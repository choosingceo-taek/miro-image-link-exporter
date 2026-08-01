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
md = dm + `\n---\n\n` + md;

low.sort((a, z) => a.total - z.total);
md += `# 수집량이 적은 브랜드 (${LOW_MARK}개 미만)\n\n`;
md += `카테고리 URL별로 몇 개를 줬는지 — 0개인 URL이 원인이다.\n\n`;
for (const r of low) {
  md += `## ${r.brand} — ${r.total}개 (${r.group})\n\n`;
  for (const p of r.perSrc) md += `- ${String(p.n).padStart(4)}개 · ${p.src}\n`;
  for (const sm of r.sample) md += `  - 표본: ${sm.name || "(무명)"} — ${sm.productUrl}\n`;
  md += `\n`;
}
writeFileSync(join(ROOT, "catalog-audit.json"), JSON.stringify({ when: new Date().toISOString(), scanned, flagged, report, low, deadUrls }, null, 1));
writeFileSync(join(ROOT, "catalog-audit.md"), md);
console.log(`\n검사 ${scanned}개 · 문제 ${flagged}개 · 브랜드 ${report.filter((r) => r.badCount).length}개`);
console.log(`교체 필요 URL ${deadUrls.reduce((s, r) => s + r.dead.length, 0)}개 (브랜드 ${deadUrls.length}개)`);
