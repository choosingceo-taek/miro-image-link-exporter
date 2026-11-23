#!/usr/bin/env node
// 무료 크롤링 엔진 비교 — 지금 막혀 있는 페이지를 엔진마다 열어 보고 무엇이 통하는지 잰다.
//
// 추측으로 도구를 바꾸지 않으려고 만든 실측 도구다. 저장은 하지 않는다(읽기만).
//
// 엔진:
//   playwright        지금 쓰는 헤드리스 크롬(기준선)
//   patchright        자동화 흔적을 지운 Playwright 패치판
//   crawlee-chromium  Crawlee PlaywrightCrawler + 지문 생성·주입(fingerprint-suite) + 세션 풀
//   crawlee-firefox   같은 것을 파이어폭스로(Crawlee 문서가 차단 회피용으로 권하는 조합)
//   camoufox          탐지 회피용으로 고친 파이어폭스(camoufox-js)
//   impit             브라우저 없이 브라우저의 TLS·HTTP2 지문으로 요청(Apify, curl_cffi 류)
//   site-api          사이트가 자기 화면을 그릴 때 쓰는 JSON 주소를 직접 읽는다(지금은 Zara·Shopify)
//   wayback           웹 아카이브(archive.org)에 보관된 같은 상품 페이지를 읽는다 — 차단과 무관
//
// env:
//   ENGINES   쉼표 구분(기본: 위 전부)
//   BRANDS    상품 페이지를 뽑을 브랜드(Worker 카탈로그에서 브랜드당 PER 개)
//   PER       브랜드당 상품 수(기본 2)
//   LISTINGS  목록 페이지 URL(쉼표 구분)
//   URLS      위 둘 대신 이 URL 만(쉼표 구분)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const ENGINES = (process.env.ENGINES || "impit,site-api,wayback,playwright,patchright,crawlee-chromium,crawlee-firefox,camoufox")
  .split(",").map((s) => s.trim()).filter(Boolean);
const PER = Math.max(1, Number(process.env.PER) || 2);
const NAV_MS = 45_000;
const list = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);

// 추출 규칙은 worker 한 벌을 쓴다(enrich-comp-browser 와 같은 방식).
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const slice = (a, b) => { const i = workerSrc.indexOf(a), j = workerSrc.indexOf(b, i); return workerSrc.slice(i, j); };
const compFromHtml = new Function(slice("const FIBRES = {", "function titleCase") + "\n return compFromHtml;")();

const CHALLENGE_RX = /access denied|pardon our interruption|are you a human|attention required|verify you are human|unusual traffic|press (and|&) hold|just a moment|enable javascript and cookies|request unsuccessful|_Incapsula_Resource|captcha-delivery|403 forbidden/i;
const FIBRE_RX = /\d{1,3}\s?%\s*(?:[A-Za-z]+\s)?(cotton|polyester|viscose|wool|linen|silk|nylon|polyamide|elastane|spandex|lyocell|modal|cashmere|acrylic|rayon|leather)/i;

// ── 대상 ─────────────────────────────────────────────────────────
const targets = [];   // { kind: 'product'|'listing', brand, url }
if (list(process.env.URLS).length) {
  for (const u of list(process.env.URLS)) targets.push({ kind: "product", brand: new URL(u).hostname, url: u });
} else {
  const want = list(process.env.BRANDS || "Zara,H&M,Massimo Dutti,Arket,&Other Stories,Lululemon,Chico's,Anthropologie,Free People,Joules,Patagonia,Addidas").map((s) => s.toLowerCase());
  try {
    const cats = (await (await fetch(`${WORKER}/?catalogs=1&token=${TOKEN}`)).json()).list || [];
    for (const c of cats) {
      if (!want.includes(String(c.brand || "").toLowerCase())) continue;
      const cat = await (await fetch(`${WORKER}/?catalog=${encodeURIComponent(c.site)}&token=${TOKEN}`)).json();
      for (const p of (cat.items || []).slice(0, PER)) if (p && p.productUrl) targets.push({ kind: "product", brand: c.brand, url: p.productUrl });
    }
  } catch (e) { console.error("Worker 카탈로그 읽기 실패: " + e.message); }
  for (const u of list(process.env.LISTINGS || [
    "https://www.prana.com/women/tops.html",
    "https://www.whitehouseblackmarket.com/store/category/tops/cat210001",
    "https://www.chicos.com/store/category/dresses/cat40004",
    "https://veronicabeard.com/collections/tops",
  ].join(","))) targets.push({ kind: "listing", brand: new URL(u).hostname.replace(/^www\./, ""), url: u });
}
if (!targets.length) { console.error("대상 없음"); process.exit(1); }
console.log(`대상 ${targets.length}개 · 엔진 ${ENGINES.join(", ")}\n`);

// 한 페이지 결과 판정
function judge(status, title, html, err) {
  if (err) return { v: "err", note: String(err).split("\n")[0].slice(0, 70) };
  const text = String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  if (status >= 400 || CHALLENGE_RX.test(title + " " + text.slice(0, 1500))) return { v: "blocked", note: `HTTP ${status} ${String(title).slice(0, 40)}` };
  const comp = compFromHtml(html);
  const c = Array.isArray(comp) ? comp.map((x) => `${x.material} ${x.percent}%`).join(" / ") : String(comp || "");
  if (c) return { v: "comp", note: c.slice(0, 60) };
  return { v: "open", note: `글 ${text.length}자` };
}

// 브라우저 페이지 공통: 열고, 접힌 소재 탭을 펼치고, 소재가 그려질 때까지 최대 6초
async function readPage(page, url) {
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_MS });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    for (const d of document.querySelectorAll("details")) d.open = true;
    const rx = /composition|material|fabric|content|details/i;
    for (const b of document.querySelectorAll('button,[role="button"],summary,[aria-expanded="false"]')) {
      const t = (b.textContent || "") + " " + (b.getAttribute("aria-label") || "");
      if (t.length < 80 && rx.test(t)) { try { b.click(); } catch (e) {} }
    }
  }).catch(() => {});
  await page.waitForFunction((src) => new RegExp(src, "i").test((document.body && document.body.innerText) || ""),
    FIBRE_RX.source, { timeout: 6000 }).catch(() => {});
  return { status: resp ? resp.status() : 0, title: await page.title().catch(() => ""), html: await page.content() };
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function runPlainBrowser(mod, urls) {
  const { chromium } = await import(mod);
  const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--disable-http2"] });
  const ctx = await browser.newContext(mod === "playwright" ? { userAgent: UA, locale: "en-US" } : { locale: "en-US" });
  const out = {};
  for (const url of urls) {
    const page = await ctx.newPage();
    try { const r = await readPage(page, url); out[url] = judge(r.status, r.title, r.html); }
    catch (e) { out[url] = judge(0, "", "", e.message); }
    finally { await page.close().catch(() => {}); }
  }
  await browser.close();
  return out;
}

async function runCrawlee(browserName, urls) {
  const { PlaywrightCrawler, Configuration } = await import("crawlee");
  const pw = await import("playwright");
  const out = {};
  // 저장소를 메모리로 — 리포트 외에 파일을 남기지 않는다.
  const config = new Configuration({ persistStorage: false, purgeOnStart: true });
  const crawler = new PlaywrightCrawler({
    launchContext: { launcher: browserName === "firefox" ? pw.firefox : pw.chromium },
    browserPoolOptions: { useFingerprints: true },   // fingerprint-generator + fingerprint-injector
    useSessionPool: true,
    // 403 을 받아도 처리기에서 기록하도록 차단 코드 자동 처리를 끈다(비교가 목적).
    sessionPoolOptions: { blockedStatusCodes: [] },
    maxRequestRetries: 1,
    maxConcurrency: 2,
    navigationTimeoutSecs: NAV_MS / 1000,
    requestHandlerTimeoutSecs: 90,
    headless: true,
    async requestHandler({ page, request, response }) {
      await page.evaluate(() => { for (const d of document.querySelectorAll("details")) d.open = true; }).catch(() => {});
      await page.waitForFunction((src) => new RegExp(src, "i").test((document.body && document.body.innerText) || ""),
        FIBRE_RX.source, { timeout: 6000 }).catch(() => {});
      out[request.userData.url] = judge(response ? response.status() : 0, await page.title().catch(() => ""), await page.content());
    },
    failedRequestHandler({ request }, error) {
      out[request.userData.url] = judge(0, "", "", (error && error.message) || "failed");
    },
  }, config);
  await crawler.run(urls.map((url, i) => ({ url, uniqueKey: `${i}:${url}`, userData: { url } })));
  return out;
}

async function runCamoufox(urls) {
  const { Camoufox } = await import("camoufox-js");
  const browser = await Camoufox({ headless: true, humanize: true });
  const out = {};
  for (const url of urls) {
    const page = await browser.newPage();
    try { const r = await readPage(page, url); out[url] = judge(r.status, r.title, r.html); }
    catch (e) { out[url] = judge(0, "", "", e.message); }
    finally { await page.close().catch(() => {}); }
  }
  await browser.close();
  return out;
}

async function runImpit(urls) {
  const { Impit } = await import("impit");
  const impit = new Impit({ browser: "chrome", followRedirects: true, timeout: NAV_MS });
  const out = {};
  for (const url of urls) {
    try {
      const r = await impit.fetch(url, { headers: { "Accept-Language": "en-US,en;q=0.9" } });
      const html = await r.text();
      out[url] = judge(r.status, (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1], html);
    } catch (e) { out[url] = judge(0, "", "", e.message); }
  }
  return out;
}

// 사이트가 자기 화면을 그릴 때 부르는 JSON 주소. HTML 페이지보다 방어가 느슨한 경우가 있다.
function apiUrlOf(url) {
  const u = new URL(url);
  // Zara: …-p01234567.html?v1=<상품 id> → /<나라>/<언어>/products-details?productIds=<id>&ajax=true
  if (/(^|\.)zara\.com$/.test(u.hostname) && u.searchParams.get("v1")) {
    const loc = u.pathname.split("/").filter(Boolean).slice(0, 2).join("/");
    return `${u.origin}/${loc}/products-details?productIds=${u.searchParams.get("v1")}&ajax=true`;
  }
  // Shopify: /products/<handle> → /products/<handle>.json
  const m = url.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
  if (m) return `${m[1]}/products/${m[2]}.json`;
  return "";
}
// JSON 안의 소재 표기를 사람이 읽는 글로 편다 — {"material":"cotton","percentage":"95%"} → "95% cotton"
function flattenComp(text) {
  const out = [];
  for (const m of String(text).matchAll(/"(?:material|name)"\s*:\s*"([A-Za-z ]{3,30})"\s*,\s*"percentage"\s*:\s*"?(\d{1,3})\s?%?"?/gi)) out.push(`${m[2]}% ${m[1]}`);
  for (const m of String(text).matchAll(/"percentage"\s*:\s*"?(\d{1,3})\s?%?"?\s*,\s*"(?:material|name)"\s*:\s*"([A-Za-z ]{3,30})"/gi)) out.push(`${m[1]}% ${m[2]}`);
  return out.join(", ");
}
async function runSiteApi(urls) {
  const { Impit } = await import("impit");
  const impit = new Impit({ browser: "chrome", followRedirects: true, timeout: NAV_MS });
  const out = {};
  for (const url of urls) {
    const api = apiUrlOf(url);
    if (!api) { out[url] = { v: "err", note: "이 사이트용 JSON 주소를 모름" }; continue; }
    try {
      const r = await impit.fetch(api, { headers: { Accept: "application/json", "Accept-Language": "en-US,en;q=0.9" } });
      const body = await r.text();
      if (r.status >= 400 || !/^\s*[\[{]/.test(body)) { out[url] = { v: "blocked", note: `HTTP ${r.status} · JSON 아님` }; continue; }
      const flat = flattenComp(body);
      const j = judge(r.status, "", `<p>${flat}</p><p>${body.replace(/<[^>]+>/g, " ").slice(0, 200000)}</p>`);
      out[url] = j.v === "open" ? { v: "open", note: `JSON ${body.length}자 · 소재 못 찾음 · ${(body.match(/.{0,60}omposition.{0,120}/i) || [""])[0]}` } : j;
    } catch (e) { out[url] = judge(0, "", "", e.message); }
  }
  return out;
}

// 웹 아카이브. 상품의 소재는 바뀌지 않으므로 몇 달 전 보관본이어도 값은 같다.
async function runWayback(urls) {
  const out = {};
  for (const url of urls) {
    try {
      const a = await (await fetch("https://archive.org/wayback/available?url=" + encodeURIComponent(url.split("?")[0]),
        { signal: AbortSignal.timeout(30000) })).json();
      const snap = a && a.archived_snapshots && a.archived_snapshots.closest;
      if (!snap || !snap.available) { out[url] = { v: "err", note: "보관본 없음" }; continue; }
      // id_ = 아카이브가 덧붙이는 머리띠 없이 원본 그대로
      const raw = `https://web.archive.org/web/${snap.timestamp}id_/${url.split("?")[0]}`;
      const r = await fetch(raw, { signal: AbortSignal.timeout(45000) });
      const html = await r.text();
      const j = judge(r.status, (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1], html);
      out[url] = { ...j, note: `${snap.timestamp.slice(0, 8)} 보관본 · ${j.note}` };
    } catch (e) { out[url] = judge(0, "", "", e.message); }
  }
  return out;
}

const RUN = {
  playwright: (u) => runPlainBrowser("playwright", u),
  patchright: (u) => runPlainBrowser("patchright", u),
  "crawlee-chromium": (u) => runCrawlee("chromium", u),
  "crawlee-firefox": (u) => runCrawlee("firefox", u),
  camoufox: (u) => runCamoufox(u),
  impit: (u) => runImpit(u),
  "site-api": (u) => runSiteApi(u),
  wayback: (u) => runWayback(u),
};

const urls = targets.map((t) => t.url);
const results = {};   // engine → url → {v, note}
for (const eng of ENGINES) {
  if (!RUN[eng]) { console.log(`알 수 없는 엔진: ${eng}`); continue; }
  const t0 = Date.now();
  try { results[eng] = await RUN[eng](urls); }
  catch (e) {
    console.log(`  !! ${eng} 실행 실패: ${e.message}`);
    results[eng] = Object.fromEntries(urls.map((u) => [u, { v: "err", note: "엔진 실행 실패: " + String(e.message).slice(0, 60) }]));
  }
  const r = Object.values(results[eng]);
  console.log(`${eng}: 소재 ${r.filter((x) => x.v === "comp").length} · 열림 ${r.filter((x) => x.v === "open").length} · ` +
    `차단 ${r.filter((x) => x.v === "blocked").length} · 오류 ${r.filter((x) => x.v === "err").length} (${Math.round((Date.now() - t0) / 1000)}s)`);
  // 엔진 하나가 끝날 때마다 리포트를 써 둔다 — 시간 제한에 걸려도 그때까지의 결과가 남는다.
  writeReport(true);
}
writeReport(false);

// ── 리포트 ────────────────────────────────────────────────────────
function writeReport(partial) {
  const ICON = { comp: "✅", open: "🟡", blocked: "⛔", err: "❌" };
  const engs = ENGINES.filter((e) => results[e]);
  let md = `# 무료 크롤링 엔진 비교 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
  if (partial) md += `> ⏳ 진행 중 — ${engs.length}/${ENGINES.length}개 엔진까지의 중간 결과입니다.\n\n`;
  md += `GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.\n\n`;
  md += `✅ 소재까지 읽음 · 🟡 페이지는 열림(소재 없음/목록) · ⛔ 차단 · ❌ 오류\n\n`;
  md += `| 엔진 | ✅ | 🟡 | ⛔ | ❌ |\n|---|---:|---:|---:|---:|\n`;
  for (const e of engs) {
    const r = Object.values(results[e]);
    md += `| ${e} | ${r.filter((x) => x.v === "comp").length} | ${r.filter((x) => x.v === "open").length} | ${r.filter((x) => x.v === "blocked").length} | ${r.filter((x) => x.v === "err").length} |\n`;
  }
  md += `\n## 페이지별\n\n| 구분 | 브랜드 | ${engs.join(" | ")} |\n|---|---|${engs.map(() => ":-:").join("|")}|\n`;
  for (const t of targets) {
    md += `| ${t.kind === "listing" ? "목록" : "상품"} | [${t.brand}](${t.url}) | ${engs.map((e) => ICON[(results[e][t.url] || {}).v] || "·").join(" | ")} |\n`;
  }
  md += `\n<details><summary>사유</summary>\n\n`;
  for (const t of targets) {
    md += `- ${t.brand} — ${t.url}\n`;
    for (const e of engs) { const r = results[e][t.url] || {}; md += `  - ${e}: ${ICON[r.v] || "·"} ${r.note || ""}\n`; }
  }
  md += `\n</details>\n`;
  writeFileSync(join(ROOT, process.env.OUT || "try-engines-report.md"), md);
  if (!partial) console.log("\n리포트: try-engines-report.md");
}

