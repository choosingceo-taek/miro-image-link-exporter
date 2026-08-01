#!/usr/bin/env node
// 헤드리스 크롬 수집기 — Render 스크래퍼로는 못 읽는 브랜드를 진짜 브라우저로 수집한다.
//
// Render로 실패하는 원인은 두 가지가 섞여 있다.
//   (A) 봇 차단(Akamai/PerimeterX) — 데이터센터 IP면 브라우저를 써도 403이다 → 크롬 확장만이 답
//   (B) JS 렌더링 — 서버 스크래퍼가 못 읽을 뿐, 진짜 브라우저면 IP와 무관하게 읽힌다
// (B)는 GitHub Actions에서 매일 자동 수집할 수 있다(사람 PC 불필요).
// 그 분류가 blocked-brands.json 의 browser(=B) / brands(=A) 두 배열이다.
//
// 수집 로직은 크롬 확장과 동일한 chrome-extension/collector.js 를 그대로 주입한다(코드 이중화 없음).
//
// env:
//   GROUP       browser(기본) | extension(차단 그룹 재조사) | all
//   BRANDS      쉼표로 구분한 브랜드(비우면 그룹 전체)
//   STORE       "1" 이면 Worker KV에 저장. 0이면 조사만(기존 데이터 손대지 않음)
//   MAX_PAGES   카테고리당 최대 페이지(기본 8)
//   HEADFUL     "1" 이면 headless 끔(로컬 디버깅용)
//   CHROMIUM_PATH  미리 설치된 크롬 실행 경로(선택)
//   RENDER_URL / WORKER_URL / WORKER_TOKEN

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const STORE = process.env.STORE === "1";
const MAX_PAGES = Math.max(1, Number(process.env.MAX_PAGES) || 8);
const HEADFUL = process.env.HEADFUL === "1";
const only = (process.env.BRANDS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
// browser = 헤드리스로 수집 가능한 그룹(기본, 매일 자동) · extension = 크롬 확장 담당 그룹(재조사용) · all = 둘 다
const GROUP = (process.env.GROUP || "browser").toLowerCase();

const PER_CATEGORY = 150;    // 확장(background.js)과 동일
const MAX_PER_BRAND = 750;

// 확장과 같은 수집기 코드를 문자열로 읽어 page.evaluate 에 넣는다.
const collectorSrc = readFileSync(join(ROOT, "chrome-extension", "collector.js"), "utf8");
const COLLECTOR = `(async () => { ${collectorSrc}\n return await pageCollector(); })()`;

// 확장(background.js)의 siteKeyOf / 야간 프리페치의 siteKey 와 동일한 규칙.
function siteKeyOf(name, url) {
  let host = "brand";
  try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) {}
  const slug = String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return (host + "." + slug).slice(0, 80);
}

async function getJson(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw last;
}

async function buildTargets() {
  const [blocked, links, brands] = await Promise.all([
    getJson(RENDER + "/blocked-brands.json"),
    getJson(RENDER + "/category-links.json"),
    getJson(RENDER + "/brands.json").catch(() => []),
  ]);
  const byName = new Map((Array.isArray(brands) ? brands : []).map((b) => [String(b.name).toLowerCase(), b]));
  const names = GROUP === "extension" ? (blocked.brands || [])
    : GROUP === "all" ? [...(blocked.browser || []), ...(blocked.brands || [])]
    : (blocked.browser || []);
  const groups = [];
  for (const name of names) {
    if (only.length && !only.includes(name.toLowerCase())) continue;
    const c = links[name] || {};
    const urls = [];
    for (const k of ["tops", "sweatshirts", "shirts", "dresses", "pants"]) {
      for (const u of c[k] || []) if (/^https?:\/\//i.test(u) && !urls.includes(u)) urls.push(u);
    }
    if (!urls.length) continue;
    const b = byName.get(name.toLowerCase());
    groups.push({ brand: name, site: siteKeyOf(name, (b && b.url) || urls[0]), urls });
  }
  return groups;
}

// 차단 여부를 결과에 남기려고 응답 상태와 차단 문구를 함께 본다.
function blockSignal(status, title, text) {
  if (status === 403 || status === 429) return "HTTP " + status;
  const t = (title + " " + text).toLowerCase();
  if (/access denied|pardon our interruption|are you a human|attention required|bot detection|unusual traffic|verify you are/i.test(t)) {
    return "봇 차단 페이지";
  }
  return "";
}

const targets = await buildTargets();
if (!targets.length) { console.error("no targets"); process.exit(1); }
console.log(`헤드리스 수집 [${GROUP}] ${targets.length}개 브랜드 (저장 ${STORE ? "ON" : "OFF — 조사만"}, 카테고리당 최대 ${MAX_PAGES}페이지)`);

const browser = await chromium.launch({
  headless: !HEADFUL,
  // 컨테이너에 크롬이 미리 깔려 있으면(예: PLAYWRIGHT_BROWSERS_PATH) 그걸 쓴다.
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  // 일부 사이트(예: shop.lululemon.com)는 헤드리스 크롬의 HTTP/2 협상에서 즉시 끊는다 → HTTP/1.1로.
  args: ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--disable-http2"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "en-US",
  timezoneId: "America/New_York",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
});
// navigator.webdriver 흔적 제거(간단한 자동화 탐지 회피 — 진짜 봇차단은 못 뚫는다)
await context.addInitScript(() => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });
});

const results = [];
for (const g of targets) {
  const t0 = Date.now();
  const brandItems = new Map();
  const seenIn = new Map();   // productUrl → 몇 개의 카테고리 페이지에서 나왔나
  const perUrl = [];
  for (const url of g.urls) {
    const page = await context.newPage();
    let note = "";
    const byUrl = new Map();
    try {
      let pageUrl = url, pages = 0;
      while (pageUrl && pages < MAX_PAGES && byUrl.size < PER_CATEGORY) {
        const resp = await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
        await page.waitForTimeout(2500);
        if (pages === 0) {
          const sig = blockSignal(
            resp ? resp.status() : 0,
            await page.title().catch(() => ""),
            (await page.locator("body").innerText().catch(() => "")).slice(0, 400),
          );
          if (sig) { note = sig; break; }
        }
        const res = (await page.evaluate(COLLECTOR)) || {};
        let added = 0;
        for (const it of res.items || []) {
          if (it && it.productUrl && !byUrl.has(it.productUrl)) { byUrl.set(it.productUrl, it); added++; }
        }
        pages++;
        if (!added) break;
        pageUrl = res.nextUrl && res.nextUrl !== pageUrl ? res.nextUrl : "";
      }
      if (!byUrl.size && !note) note = "상품 0개(선택자 불일치/빈 목록)";
    } catch (e) {
      note = "오류: " + String((e && e.message) || e).split("\n")[0].slice(0, 90);
    } finally {
      await page.close().catch(() => {});
    }
    let n = 0;
    for (const it of byUrl.values()) {
      if (n++ >= PER_CATEGORY) break;
      if (!brandItems.has(it.productUrl)) brandItems.set(it.productUrl, it);
      seenIn.set(it.productUrl, (seenIn.get(it.productUrl) || 0) + 1);
    }
    perUrl.push({ url, count: byUrl.size, note });
    console.log(`   ${byUrl.size ? "·" : "✕"} ${byUrl.size}개  ${url}${note ? "  ← " + note : ""}`);
  }

  // 모든 카테고리 페이지에 똑같이 등장하는 링크는 상품이 아니라 내비게이션·추천 블록이다.
  // (Madewell처럼 4개 카테고리가 저마다 18개를 주는데 합쳐도 22개면 대부분이 공용 블록이다)
  const okUrls = perUrl.filter((u) => u.count > 0).length;
  let dropped = 0;
  let items = [...brandItems.values()];
  if (okUrls >= 3) {
    const before = items.length;
    items = items.filter((it) => (seenIn.get(it.productUrl) || 0) < okUrls);
    dropped = before - items.length;
  }
  items = items.slice(0, MAX_PER_BRAND);
  const cats = {};
  for (const it of items) cats[it.category] = (cats[it.category] || 0) + 1;
  let stored = 0, storeErr = "";
  if (STORE && items.length >= 5) {
    try {
      const legacy = g.site.slice(0, g.site.lastIndexOf("."));
      const r = await fetch(
        `${WORKER}/?store=catalog&replace=1&legacy=${encodeURIComponent(legacy)}&token=${encodeURIComponent(TOKEN)}`,
        {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site: g.site, brand: g.brand, items }),
          signal: AbortSignal.timeout(30_000),
        },
      );
      const d = await r.json().catch(() => ({}));
      if (d.ok) stored = d.count; else storeErr = String(d.error || r.status);
    } catch (e) { storeErr = String((e && e.message) || e).slice(0, 80); }
  }
  const secs = Math.round((Date.now() - t0) / 1000);
  results.push({
    brand: g.brand, site: g.site, collected: items.length, stored, storeErr, cats, perUrl, secs, dropped,
    // 무엇이 잡혔는지 눈으로 확인할 수 있게 표본을 남긴다(선택자 오작동 진단용).
    sample: items.slice(0, 5).map((it) => ({ name: it.name, productUrl: it.productUrl })),
  });
  const blockedUrls = perUrl.filter((u) => /차단|HTTP 40|HTTP 42/.test(u.note)).length;
  console.log(
    `[${results.length}/${targets.length}] ${g.brand}: ${items.length}개` +
    (dropped ? ` (공용 링크 ${dropped}개 제외)` : "") +
    (STORE ? ` → 저장 ${stored}${storeErr ? " (" + storeErr + ")" : ""}` : "") +
    (blockedUrls ? `  ⛔ 차단 ${blockedUrls}/${g.urls.length}` : "") + ` (${secs}s)`,
  );
}
await browser.close();

// 판정: 헤드리스로 충분히 모이면 "자동화 가능", 차단 신호가 있으면 "확장 필요", 그 외는 "선택자 보완 필요".
for (const r of results) {
  const blockedUrls = r.perUrl.filter((u) => /차단|HTTP 40|HTTP 42/.test(u.note)).length;
  r.verdict = r.collected >= 20 ? "자동화 가능"
    : blockedUrls ? "확장 필요(봇 차단)"
    : "보완 필요(수집 0~소량)";
}
const auto = results.filter((r) => r.verdict === "자동화 가능");
const blk = results.filter((r) => r.verdict.startsWith("확장"));
const fix = results.filter((r) => r.verdict.startsWith("보완"));

let md = `# 헤드리스 크롬 수집 테스트 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
md += `GitHub Actions(데이터센터 IP)에서 진짜 크롬으로 확장 담당 브랜드를 돌린 결과.\n\n`;
md += `- 대상 ${results.length} · ✅ 자동화 가능 ${auto.length} · ⛔ 확장 필요 ${blk.length} · 🔧 보완 필요 ${fix.length}\n\n`;
for (const [title, rows] of [["✅ 자동화 가능", auto], ["⛔ 확장 필요(봇 차단)", blk], ["🔧 보완 필요", fix]]) {
  md += `## ${title} (${rows.length})\n\n`;
  for (const r of rows) {
    md += `- **${r.brand}** — ${r.collected}개 ${JSON.stringify(r.cats)}` +
      (r.dropped ? ` · 공용 링크 ${r.dropped}개 제외` : "") + ` (${r.secs}s)\n`;
    for (const u of r.perUrl) if (u.note) md += `  - ${u.count}개 · ${u.url} ← ${u.note}\n`;
    for (const sm of r.sample || []) md += `  - 표본: ${sm.name} — ${sm.productUrl}\n`;
  }
  md += `\n`;
}
writeFileSync(join(ROOT, "browser-collect-report.json"), JSON.stringify({ when: new Date().toISOString(), store: STORE, results }, null, 1));
writeFileSync(join(ROOT, "browser-collect-report.md"), md);
console.log(`\n자동화 가능 ${auto.length} / 확장 필요 ${blk.length} / 보완 필요 ${fix.length}`);
