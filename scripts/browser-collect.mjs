#!/usr/bin/env node
// 헤드리스 크롬 수집기 — Render 스크래퍼로는 못 읽는 브랜드를 진짜 브라우저로 수집한다.
//
// Render로 실패하는 원인은 두 가지가 섞여 있다.
//   (A) 봇 차단(Akamai/PerimeterX) — 데이터센터 IP면 브라우저를 써도 403이다 → 크롬 확장만이 답
//   (B) JS 렌더링 — 서버 스크래퍼가 못 읽을 뿐, 진짜 브라우저면 IP와 무관하게 읽힌다
// (B)는 GitHub Actions에서 매일 자동 수집할 수 있다(사람 PC 불필요).
// 그 분류가 blocked-brands.json 의 browser(=B) / brands(=A) 두 배열이다.
// 그 밖에 저장소의 browser-extra-brands.json 에 적힌 브랜드도 돈다 — 서버 프리페치가 목록
// 페이지에서 막히지만 Actions 에선 열리는 브랜드다(브랜드마다 엔진을 정함 · 저장 조건이 더 엄격).
//
// 수집 로직은 크롬 확장과 동일한 chrome-extension/collector.js 를 그대로 주입한다(코드 이중화 없음).
//
// env:
//   GROUP       browser(기본) | extension(차단 그룹 재조사) | all
//   BRANDS      쉼표로 구분한 브랜드(주면 그룹 무시하고 전체에서 선택 · 비우면 그룹 전체)
//   STORE       "1" 이면 Worker KV에 저장. 0이면 조사만(기존 데이터 손대지 않음)
//   MAX_PAGES   카테고리당 최대 페이지(기본 8)
//   HEADFUL     "1" 이면 headless 끔(로컬 디버깅용)
//   CHROMIUM_PATH  미리 설치된 크롬 실행 경로(선택)
//   ENGINE      chromium | firefox. 주면 모든 브랜드를 그 엔진으로 돈다(측정용).
//               비우면 브랜드별 기본 — Render browser 그룹은 chromium, 추가 브랜드 파일은 적힌 엔진.
//   FIREFOX_PATH   미리 설치된 파이어폭스 실행 경로(선택)
//   FRESH_CONTEXT  "1" 이면 카테고리 URL 마다 쿠키가 빈 새 창으로 연다(측정용, 기본 끔)
//   EXTRA_BRANDS_FILE  추가 브랜드 파일 경로(기본 저장소 루트의 browser-extra-brands.json)
//   RENDER_URL / WORKER_URL / WORKER_TOKEN
//   DEADLINE_MIN   시간 예산(분, 기본 85 · 최소 5). 이 시각 뒤로는 새 브랜드를 시작하지 않는다
//
// 시험용 훅(scripts/smoke-browser-collect.mjs 가 쓴다 — 운영에서는 비워 둔다):
//   DEADLINE_SEC     DEADLINE_MIN 대신 초 단위 예산(최소 제한 없음)
//   HARD_GRACE_SEC   예산 뒤 진행 중인 브랜드를 끊기까지의 여유(기본 600초)
//   CONFIG_RETRY_MS  설정 파일 재시도 첫 간격(기본 5000 — 5번 시도에 약 3분)
//   REPORT_DIR       리포트를 읽고 쓰는 폴더(기본 저장소 루트)
//   DRY_PLAN         "1" 이면 대상·엔진별 실행 옵션만 JSON 으로 찍고 끝낸다(브라우저를 띄우지 않음)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium, firefox } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT_DIR = process.env.REPORT_DIR || ROOT;
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const STORE = process.env.STORE === "1";
const MAX_PAGES = Math.max(1, Number(process.env.MAX_PAGES) || 8);
// 페이지 이동 대기. 늦은 사이트는 이 시간을 넘겨도 차단이 아니라 그냥 느린 것이라,
// 아래에서 'commit' 으로 한 번 더 시도한 뒤 SLOW_SETTLE_MS 만큼 쉬어 준다.
const NAV_MS = Math.max(10_000, Number(process.env.NAV_MS) || 60_000);
const SLOW_SETTLE_MS = Math.max(1_000, Number(process.env.SLOW_SETTLE_MS) || 9_000);
const HEADFUL = process.env.HEADFUL === "1";
const only = (process.env.BRANDS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
// browser = 헤드리스로 수집 가능한 그룹(기본, 매일 자동) · extension = 크롬 확장 담당 그룹(재조사용) · all = 둘 다
const GROUP = (process.env.GROUP || "browser").toLowerCase();
const DRY_PLAN = process.env.DRY_PLAN === "1";

// ── 브라우저 엔진 ──
// 크롬(chromium)으로 403 이 나는 목록 페이지 일부가 파이어폭스로는 열렸다(try-engines-report.md).
// 두 엔진은 실행·창 옵션만 다르고 나머지(수집기 주입·페이지 넘김·저장)는 똑같이 쓴다.
// 파이어폭스에는 크롬 user-agent·크롬 전용 실행 인자를 넣지 않는다 — 크롬인 척하면
// 오히려 어긋난 지문이 돼서 막힌다. 언어·시간대·창 크기만 맞춘다.
const ENGINES = ["chromium", "firefox"];
const ENGINE_ENV = (process.env.ENGINE || "").trim().toLowerCase();
if (ENGINE_ENV && !ENGINES.includes(ENGINE_ENV)) {
  console.error(`ENGINE 은 ${ENGINES.join(" | ")} 중 하나여야 합니다(받은 값: ${process.env.ENGINE})`);
  process.exit(2);
}
const COMMON_CONTEXT = { viewport: { width: 1440, height: 1000 }, locale: "en-US", timezoneId: "America/New_York" };
function engineOptions(name) {
  if (name === "firefox") {
    return {
      launch: {
        headless: !HEADFUL,
        ...(process.env.FIREFOX_PATH ? { executablePath: process.env.FIREFOX_PATH } : {}),
      },
      context: { ...COMMON_CONTEXT },
      hideWebdriver: false,
    };
  }
  return {
    launch: {
      headless: !HEADFUL,
      // 컨테이너에 크롬이 미리 깔려 있으면(예: PLAYWRIGHT_BROWSERS_PATH) 그걸 쓴다.
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
      // 일부 사이트(예: shop.lululemon.com)는 헤드리스 크롬의 HTTP/2 협상에서 즉시 끊는다 → HTTP/1.1로.
      args: ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--disable-http2"],
    },
    context: {
      ...COMMON_CONTEXT,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
    // navigator.webdriver 흔적 제거(간단한 자동화 탐지 회피 — 진짜 봇차단은 못 뚫는다)
    hideWebdriver: true,
  };
}
// 브랜드의 엔진: ENGINE 을 주면 그것, 아니면 브랜드에 적힌 엔진, 그것도 없으면 chromium.
const engineFor = (t) => ENGINE_ENV || (t && ENGINES.includes(t.engine) ? t.engine : "chromium");

// 엔진은 처음 필요할 때 띄운다 — 한 실행에 크롬 브랜드와 파이어폭스 브랜드가 섞일 수 있다.
const contexts = new Map();   // 엔진 이름 → { browser, context }
async function newContext(name, browser) {
  const o = engineOptions(name);
  const context = await browser.newContext(o.context);
  if (o.hideWebdriver) {
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });
  }
  return context;
}
async function contextFor(name) {
  if (contexts.has(name)) return contexts.get(name).context;
  const browser = await (name === "firefox" ? firefox : chromium).launch(engineOptions(name).launch);
  const context = await newContext(name, browser);
  contexts.set(name, { browser, context });
  return context;
}
// FRESH_CONTEXT=1: 카테고리 URL 마다 쿠키가 빈 새 창(context)으로 연다.
// 2026-11-24 파이어폭스 측정에서 Chico's·WHBM 이 브랜드의 첫 카테고리만 열리고 두 번째부터
// 403 이었다 — 첫 방문 뒤 받은 봇 판정 쿠키 때문인지 확인하려는 선택이다(기본은 끔).
const FRESH_CONTEXT = process.env.FRESH_CONTEXT === "1";
async function pageFor(name) {
  const shared = await contextFor(name);
  if (!FRESH_CONTEXT) return { page: await shared.newPage(), done: async () => {} };
  const ctx = await newContext(name, contexts.get(name).browser);
  return { page: await ctx.newPage(), done: () => ctx.close().catch(() => {}) };
}

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

// 시간 예산. 워크플로 timeout-minutes(120)에 걸리면 잡이 취소돼 리포트도 저장도 안 남는다
// (2026-09-27: 수집이 119분을 넘겨 23개 브랜드 결과가 통째로 사라졌다).
//  · SOFT — 이 시각이 지나면 새 브랜드를 시작하지 않는다. 남은 브랜드는 '미룸'으로 적는다.
//  · HARD — 진행 중인 브랜드도 멈춘다. 그 브랜드는 저장하지 않는다(일부 카테고리만으로
//           replace 저장하면 기존 카탈로그가 줄어든다 — 이전 저장본을 그대로 두는 게 낫다).
// 설치 단계가 최악 20분이므로 20 + 95 + 커밋 몇 분 < 120.
const T_START = Date.now();
const SOFT_MS = Number(process.env.DEADLINE_SEC) > 0
  ? Number(process.env.DEADLINE_SEC) * 1000
  : Math.max(5, Number(process.env.DEADLINE_MIN) || 85) * 60_000;
const HARD_MS = SOFT_MS + (Number(process.env.HARD_GRACE_SEC) > 0 ? Number(process.env.HARD_GRACE_SEC) * 1000 : 10 * 60_000);
const pastSoft = () => Date.now() - T_START > SOFT_MS;
const pastHard = () => Date.now() - T_START > HARD_MS;

// 시작 직후 설정 파일 3개를 Render 에서 받는다. Render 무료 인스턴스는 깨어나는 데
// 수십 초가 걸리고 429 를 주기도 한다. 예전엔 5초 간격 3번(총 15초)이라
// 2026-10-14 에 429 한 번으로 23개 브랜드 수집이 시작도 못 하고 끝났다.
// 간격을 늘려 가며 약 3분을 버틴다.
const RETRY_BASE_MS = Number(process.env.CONFIG_RETRY_MS) > 0 ? Number(process.env.CONFIG_RETRY_MS) : 5000;
async function getJson(url, tries = 5) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    if (i < tries - 1) await new Promise((r) => setTimeout(r, Math.min(60_000, RETRY_BASE_MS * 3 ** i)));
  }
  throw last;
}

// 그래도 못 받으면 지난 실행 리포트(저장소에 커밋돼 있다)의 브랜드·카테고리 URL 로 돈다.
// 하루 늦은 URL 이라도 하루를 통째로 날리는 것보다 낫다.
function targetsFromLastReport() {
  try {
    const prev = JSON.parse(readFileSync(join(REPORT_DIR, "browser-collect-report.json"), "utf8"));
    return (prev.results || [])
      .filter((r) => r && r.brand && r.site && Array.isArray(r.perUrl) && r.perUrl.length)
      .filter((r) => !only.length || only.includes(String(r.brand).toLowerCase()))
      .map((r) => ({
        brand: r.brand, site: r.site, urls: r.perUrl.map((u) => u.url).filter(Boolean),
        // 지난 실행에서 브랜드별로 정해 둔 엔진(추가 브랜드 파일)을 이어 쓴다.
        ...(r.engineSource === "extra" && ENGINES.includes(r.engine) ? { engine: r.engine, source: "extra" } : {}),
      }));
  } catch (e) { return []; }
}

let configNote = "";
const extraNotes = [];   // 추가 브랜드 파일을 읽다가 건너뛴 사유
// 추가 브랜드 파일. 형식: { "brands": [ { "brand": "Prana", "engine": "firefox", "urls": [선택], "evidence": "…" } ] }
function loadExtras() {
  const file = process.env.EXTRA_BRANDS_FILE || join(ROOT, "browser-extra-brands.json");
  if (!existsSync(file)) return [];
  let d;
  try { d = JSON.parse(readFileSync(file, "utf8")); } catch (e) {
    extraNotes.push(`추가 브랜드 파일을 못 읽음(${String((e && e.message) || e).slice(0, 60)}) — 추가 브랜드 없이 진행`);
    return [];
  }
  const out = [];
  for (const x of (d && d.brands) || []) {
    const brand = String((x && x.brand) || "").trim();
    if (!brand) continue;
    const engine = String(x.engine || "chromium").toLowerCase();
    if (!ENGINES.includes(engine)) { extraNotes.push(`${brand}: 모르는 엔진 "${x.engine}" — 건너뜀`); continue; }
    const urls = (Array.isArray(x.urls) ? x.urls : []).filter((u) => /^https?:\/\//i.test(u));
    out.push({ brand, engine, urls });
  }
  return out;
}
async function buildTargets() {
  let blocked, links, brands;
  try {
    [blocked, links, brands] = await Promise.all([
      getJson(RENDER + "/blocked-brands.json"),
      getJson(RENDER + "/category-links.json"),
      getJson(RENDER + "/brands.json").catch(() => []),
    ]);
  } catch (e) {
    const fallback = targetsFromLastReport();
    configNote = `설정 파일을 못 받아(${String((e && e.message) || e).slice(0, 60)}) ` +
      `지난 실행의 브랜드·카테고리 URL ${fallback.length}개로 대신 수집했습니다.`;
    console.warn("⚠ " + configNote);
    return fallback;
  }
  const byName = new Map((Array.isArray(brands) ? brands : []).map((b) => [String(b.name).toLowerCase(), b]));
  const linksOf = (name) => {
    if (links[name]) return links[name];
    const k = Object.keys(links || {}).find((x) => x.toLowerCase() === name.toLowerCase());
    return (k && links[k]) || {};
  };
  const catUrls = (name) => {
    const c = linksOf(name), urls = [];
    for (const k of ["tops", "sweatshirts", "shirts", "dresses", "pants"]) {
      for (const u of c[k] || []) if (/^https?:\/\//i.test(u) && !urls.includes(u)) urls.push(u);
    }
    return urls;
  };
  // BRANDS 를 직접 주면 그룹을 무시하고 전체 브랜드에서 고른다 —
  // 아직 어느 그룹에도 없는 후보를 헤드리스로 시험해 볼 때 쓴다.
  const names = only.length
    ? (Array.isArray(brands) ? brands : []).map((b) => b.name)
    : GROUP === "extension" ? (blocked.brands || [])
    : GROUP === "all" ? [...(blocked.browser || []), ...(blocked.brands || [])]
    : (blocked.browser || []);
  const groups = [];
  for (const name of names) {
    if (only.length && !only.includes(name.toLowerCase())) continue;
    const urls = catUrls(name);
    if (!urls.length) continue;
    const b = byName.get(name.toLowerCase());
    groups.push({ brand: name, site: siteKeyOf(name, (b && b.url) || urls[0]), urls });
  }

  // 추가 브랜드(browser-extra-brands.json) — Render 그룹 파일엔 없지만 여기서도 모을 브랜드.
  // 서버 프리페치가 목록 페이지에서 막히는 브랜드를 파이어폭스로 채우는 용도다.
  // 확장 담당 그룹을 재조사하는 실행(GROUP=extension)에는 섞지 않는다.
  if (GROUP !== "extension") {
    const inGroup = new Set((blocked.browser || []).map((n) => String(n).toLowerCase()));
    for (const x of loadExtras()) {
      const key = x.brand.toLowerCase();
      if (only.length && !only.includes(key)) continue;
      // Render browser 그룹에 이미 있는 브랜드는 그쪽(크롬)을 따른다 — 같은 카탈로그를 두 번 덮지 않게.
      if (inGroup.has(key)) { extraNotes.push(`${x.brand}: Render browser 그룹에 이미 있어 추가 항목을 무시함`); continue; }
      const urls = x.urls.length ? x.urls : catUrls(x.brand);
      if (!urls.length) { extraNotes.push(`${x.brand}: 카테고리 URL 이 없어 건너뜀(category-links.json 에도, 추가 파일에도 없음)`); continue; }
      const b = byName.get(key);
      const name = (b && b.name) || x.brand;
      const t = { brand: name, site: siteKeyOf(name, (b && b.url) || urls[0]), urls, engine: x.engine, source: "extra" };
      const i = groups.findIndex((g) => g.brand.toLowerCase() === key);   // BRANDS 로 이미 고른 경우
      if (i >= 0) groups[i] = t; else groups.push(t);
    }
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
for (const n of extraNotes) console.warn("추가 브랜드: " + n);
if (!targets.length) { console.error("no targets" + (configNote ? " — " + configNote : "")); process.exit(1); }
// 마감에 걸리면 늘 뒤쪽 브랜드만 밀린다. 시작 위치를 날마다 돌려 밀리는 브랜드가 매일 같지 않게 한다.
{
  const day = Math.floor(Date.now() / 86_400_000);
  const k = targets.length ? day % targets.length : 0;
  targets.push(...targets.splice(0, k));
}
for (const t of targets) t.engine = engineFor(t);
const enginesUsed = [...new Set(targets.map((t) => t.engine))];
console.log(`헤드리스 수집 [${GROUP}] ${targets.length}개 브랜드 (엔진 ${enginesUsed.join("+")}, 저장 ${STORE ? "ON" : "OFF — 조사만"}, 카테고리당 최대 ${MAX_PAGES}페이지)`);
if (DRY_PLAN) {
  // 브라우저 없이 '무엇을 어떤 엔진·옵션으로 돌지'만 보여 준다(엔진 전환 시험용).
  const opts = {};
  for (const e of ENGINES) opts[e] = engineOptions(e);
  console.log("PLAN " + JSON.stringify({ engineEnv: ENGINE_ENV, configNote, extraNotes, targets, options: opts }));
  process.exit(0);
}


// 추가 브랜드 저장 조건:
//  · 최소 EXTRA_MIN_ITEMS(20)개 — 일반 브랜드의 5개보다 높다. 20개 미만이면 목록이 반쯤 막힌 것이다
//  · 지금 저장된 개수의 절반 이상 — Worker 도 절반 아래면 replace 대신 병합으로 돌리지만(축소 가드),
//    그 병합은 옛 상품을 남긴 채 새 상품을 섞는다. 서버가 채운 카탈로그와 섞이지 않게 아예 보내지 않는다
//  · 저장 개수를 확인 못 하면 보내지 않는다(모르면 건드리지 않는다)
const EXTRA_MIN_ITEMS = 20;
let storedCounts = null;   // site → 지금 저장된 개수(한 번만 받는다)
async function extraStoreBlock(site, n) {
  if (n < EXTRA_MIN_ITEMS) return `추가 브랜드 최소 ${EXTRA_MIN_ITEMS}개 미달(${n}개) — 저장 안 함(이전 저장본 유지)`;
  if (!storedCounts) {
    try {
      const r = await fetch(`${WORKER}/?catalogs=1&token=${encodeURIComponent(TOKEN)}`, { signal: AbortSignal.timeout(30_000) });
      const d = await r.json();
      if (!d || !Array.isArray(d.list)) throw new Error("HTTP " + r.status);
      storedCounts = new Map(d.list.map((x) => [x.site, Number(x.count) || 0]));
    } catch (e) {
      return `저장된 개수를 확인 못 함(${String((e && e.message) || e).slice(0, 40)}) — 저장 안 함`;
    }
  }
  const old = storedCounts.get(site) || 0;
  if (old && n < old * 0.5) return `지금 저장본 ${old}개의 절반 미만(${n}개) — 저장 안 함(이전 저장본 유지)`;
  return "";
}

const norm = (u) => String(u || "").split("?")[0].replace(/\/+$/, "");

const results = [];
const deferred = [];   // 마감으로 오늘 못 돈 브랜드 — 실패가 아니다(이전 저장본 유지)
for (const g of targets) {
  if (pastSoft()) { deferred.push({ brand: g.brand, why: "마감" }); continue; }
  const t0 = Date.now();
  let cut = false;     // HARD 마감으로 이 브랜드를 중간에 끊었나
  // 이 브랜드의 카테고리 URL 자체가 상품으로 잡히는 경우를 막는다
  // (목록 페이지 상단의 하위 카테고리 타일이 대표적).
  const listing = new Set(g.urls.map(norm));
  const brandItems = new Map();
  const seenIn = new Map();   // productUrl → 몇 개의 카테고리 페이지에서 나왔나
  const perUrl = [];
  for (const url of g.urls) {
    if (pastHard()) { cut = true; break; }
    const { page, done: closeCtx } = await pageFor(g.engine);
    let note = "";
    let lastRej = null;
    const byUrl = new Map();
    try {
      // 허브 페이지(상품 대신 하위 카테고리 타일만 있는 곳) 대응: 큐에 뒤따라 붙인다.
      const queue = [url];
      let hubFollowed = 0;
      let pageUrl = queue.shift(), pages = 0;
      while (pageUrl && pages < MAX_PAGES && byUrl.size < PER_CATEGORY) {
        if (pastHard()) { cut = true; break; }
        // domcontentloaded 를 60초 안에 못 받는 사이트가 있다(Eileen fisher·Lululemon).
        // 차단이 아니라 문서가 늦게 끝나는 것이라, 한 번 더 기회를 준다: 'commit' 은
        // 응답 헤더가 오는 순간 돌아오므로 하위 리소스를 기다리지 않는다. 그 뒤
        // 넉넉히 쉬어 주면 목록은 대개 그려져 있다.
        let resp;
        try {
          resp = await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: NAV_MS });
          await page.waitForTimeout(2500);
        } catch (e) {
          if (!/Timeout/i.test(String((e && e.message) || e))) throw e;
          try {
            resp = await page.goto(pageUrl, { waitUntil: "commit", timeout: NAV_MS });
            await page.waitForTimeout(SLOW_SETTLE_MS);
          } catch (e2) {
            if (!/Timeout/i.test(String((e2 && e2.message) || e2))) throw e2;
            // commit 은 응답 헤더가 오는 순간 돌아온다. 그것조차 안 온다는 건 느린 게
            // 아니라 서버가 아예 응답하지 않는다는 뜻이다 — 데이터센터 IP 를 조용히
            // 떨구는 방식의 차단이다(403 을 주지 않으니 blockSignal 로는 안 잡힌다).
            // '오류'로 적으면 다음 사람이 선택자를 고치러 간다. 그래서 이름을 붙인다.
            throw new Error(`응답 없음(차단 의심) — 헤더조차 ${NAV_MS / 1000}초 안에 안 옴`);
          }
        }
        if (pages === 0) {
          const sig = blockSignal(
            resp ? resp.status() : 0,
            await page.title().catch(() => ""),
            (await page.locator("body").innerText().catch(() => "")).slice(0, 400),
          );
          if (sig) { note = sig; break; }
        }
        const res = (await page.evaluate(COLLECTOR)) || {};
        lastRej = res.rej || lastRej;
        let added = 0;
        for (const it of res.items || []) {
          if (!it || !it.productUrl || listing.has(norm(it.productUrl))) continue;
          if (!byUrl.has(it.productUrl)) { byUrl.set(it.productUrl, { ...it, src: url }); added++; }
        }
        pages++;
        // 상품이 거의 없고 하위 카테고리 타일만 있으면 허브 페이지다 → 한 단계 내려간다.
        if (byUrl.size < 20 && !hubFollowed && (res.subCats || []).length) {
          for (const sc of res.subCats.slice(0, 4)) if (!queue.includes(sc)) queue.push(sc);
          hubFollowed = 1;
        }
        const next = res.nextUrl && res.nextUrl !== pageUrl ? res.nextUrl : "";
        if (added && next) { pageUrl = next; continue; }
        pageUrl = queue.shift() || "";   // 다음 하위 카테고리로
      }
      if (!byUrl.size && !note) {
        // 0개일 때는 "왜"를 남긴다 — 주소가 틀린 건지, 리다이렉트된 건지, 진짜 빈 목록인지
        // 구분이 안 되면 엉뚱한 URL을 교체하게 된다.
        const d = await page.evaluate(() => ({
          finalUrl: location.href,
          title: document.title,
          links: document.querySelectorAll("a[href]").length,
          imgs: document.querySelectorAll("img").length,
          text: (document.body ? document.body.innerText : "").replace(/\s+/g, " ").trim().slice(0, 120),
        })).catch(() => null);
        // 마지막 harvest 의 탈락 사유 집계 — 어느 조건에서 다 걸렸는지 바로 보인다.
        const rj = lastRej ? Object.entries(lastRej).map(([k, v]) => `${k}=${v}`).join(" ") : "";
        note = d
          ? `상품 0개 · 최종주소 ${d.finalUrl} · 제목 "${d.title}" · 링크 ${d.links}/이미지 ${d.imgs}` +
            (rj ? ` · 탈락[${rj}]` : "") + ` · "${d.text}"`
          : "상품 0개(페이지 확인 실패)";
      }
    } catch (e) {
      note = "오류: " + String((e && e.message) || e).split("\n")[0].slice(0, 90);
    } finally {
      await page.close().catch(() => {});
      await closeCtx();
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
  // 끊겨서 못 돈 카테고리도 perUrl 에 남긴다. 리포트 JSON 은 다음 실행이 설정 파일을 못 받았을 때
  // 대신 돌 목록이라, 여기서 빠지면 그 카테고리는 그날 수집 대상에서 사라진다.
  if (cut) for (const url of g.urls) if (!perUrl.some((u) => u.url === url)) perUrl.push({ url, count: 0, note: "마감으로 중단 — 오늘 못 돎" });

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
  if (cut) storeErr = "마감으로 중단 — 저장 안 함(이전 저장본 유지)";
  // 추가 브랜드는 평소 서버 프리페치가 채우는 카탈로그다. 파이어폭스가 약한 밤에 그걸 덮지 않게
  // 더 엄격하게 본다(아래 extraStoreBlock).
  const extraBlock = STORE && !cut && g.source === "extra" ? await extraStoreBlock(g.site, items.length) : "";
  if (extraBlock) storeErr = extraBlock;
  if (STORE && !cut && !extraBlock && items.length >= 5) {
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
    brand: g.brand, site: g.site, engine: g.engine, engineSource: g.source || (ENGINE_ENV ? "env" : "default"),
    collected: items.length, stored, storeErr, cats, perUrl, secs, dropped, cut,
    // 무엇이 잡혔는지 눈으로 확인할 수 있게 표본을 남긴다(선택자 오작동 진단용).
    sample: items.slice(0, 5).map((it) => ({ name: it.name, productUrl: it.productUrl })),
  });
  const blockedUrls = perUrl.filter((u) => /차단|HTTP 40|HTTP 42/.test(u.note)).length;
  console.log(
    `[${results.length}/${targets.length}] ${g.brand} (${g.engine}): ${items.length}개` +
    (dropped ? ` (공용 링크 ${dropped}개 제외)` : "") +
    (STORE ? ` → 저장 ${stored}${storeErr ? " (" + storeErr + ")" : ""}` : "") +
    (blockedUrls ? `  ⛔ 차단 ${blockedUrls}/${g.urls.length}` : "") + ` (${secs}s)`,
  );
}
for (const { browser } of contexts.values()) await browser.close().catch(() => {});

// 판정: 헤드리스로 충분히 모이면 "자동화 가능", 차단 신호가 있으면 "확장 필요", 그 외는 "선택자 보완 필요".
for (const r of results) {
  if (r.cut) { deferred.push({ brand: r.brand, why: `마감으로 중단(${r.collected}개까지 모음)` }); continue; }
  const blockedUrls = r.perUrl.filter((u) => /차단|HTTP 40|HTTP 42/.test(u.note)).length;
  r.verdict = r.collected >= 20 ? "자동화 가능"
    : blockedUrls ? "확장 필요(봇 차단)"
    : "보완 필요(수집 0~소량)";
}
const done = results.filter((r) => !r.cut);
const auto = done.filter((r) => r.verdict === "자동화 가능");
const blk = done.filter((r) => r.verdict.startsWith("확장"));
const fix = done.filter((r) => r.verdict.startsWith("보완"));

let md = `# 헤드리스 브라우저 수집 테스트 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
md += `GitHub Actions(데이터센터 IP)에서 진짜 브라우저로 확장 담당 브랜드를 돌린 결과.\n\n`;
md += `- 엔진: ${enginesUsed.join(" + ")}` + (ENGINE_ENV ? ` (ENGINE=${ENGINE_ENV} 로 전체 지정)` : " (브랜드별 기본)") +
  (FRESH_CONTEXT ? " · 카테고리마다 새 창(FRESH_CONTEXT)" : "") + `\n\n`;
if (configNote) md += `> ⚠ ${configNote}\n\n`;
for (const n of extraNotes) md += `> 추가 브랜드: ${n}\n\n`;
md += `- 대상 ${targets.length} · ✅ 자동화 가능 ${auto.length} · ⛔ 확장 필요 ${blk.length} · 🔧 보완 필요 ${fix.length}` +
  (deferred.length ? ` · ⏭ 마감으로 미룸 ${deferred.length}` : "") + `\n\n`;
if (deferred.length) {
  md += `## ⏭ 마감으로 미룸 (${deferred.length})\n\n`;
  md += `${Math.round(SOFT_MS / 60_000)}분 예산을 넘겨 오늘은 돌지 않았습니다. 실패가 아니며 이전 저장본이 그대로 쓰입니다. ` +
    `시작 순서가 날마다 바뀌므로 내일은 앞쪽에서 돕니다.\n\n`;
  for (const d of deferred) md += `- ${d.brand} — ${d.why}\n`;
  md += `\n`;
}
for (const [title, rows] of [["✅ 자동화 가능", auto], ["⛔ 확장 필요(봇 차단)", blk], ["🔧 보완 필요", fix]]) {
  md += `## ${title} (${rows.length})\n\n`;
  for (const r of rows) {
    md += `- **${r.brand}** [${r.engine}] — ${r.collected}개 ${JSON.stringify(r.cats)}` +
      (r.dropped ? ` · 공용 링크 ${r.dropped}개 제외` : "") + ` (${r.secs}s)\n`;
    for (const u of r.perUrl) if (u.note) md += `  - ${u.count}개 · ${u.url} ← ${u.note}\n`;
    for (const sm of r.sample || []) md += `  - 표본: ${sm.name} — ${sm.productUrl}\n`;
  }
  md += `\n`;
}
// 마감으로 미룬 브랜드는 다음 실행이 설정 파일을 못 받았을 때의 대체 대상 목록에도 남아 있어야 한다.
// 지난 리포트가 아니라 오늘 대상(targets)에서 가져온다 — 오늘 설정 파일로 새로 들어온 브랜드는
// 지난 리포트에 없어서, 미루는 순간 다음 대체 실행 목록에서 빠졌다.
const carry = targets.filter((t) => deferred.some((d) => d.brand === t.brand) && !results.some((r) => r.brand === t.brand));
const keep = [...results, ...carry.map((t) => ({ brand: t.brand, site: t.site, engine: t.engine, engineSource: t.source || (ENGINE_ENV ? "env" : "default"), collected: 0, deferred: true, perUrl: t.urls.map((url) => ({ url, count: 0, note: "마감으로 미룸" })) }))];
writeFileSync(join(REPORT_DIR, "browser-collect-report.json"), JSON.stringify({ when: new Date().toISOString(), store: STORE, engine: ENGINE_ENV || "per-brand", engines: enginesUsed, freshContext: FRESH_CONTEXT, configNote, extraNotes, deferred, results: keep }, null, 1));
writeFileSync(join(REPORT_DIR, "browser-collect-report.md"), md);
console.log(`\n자동화 가능 ${auto.length} / 확장 필요 ${blk.length} / 보완 필요 ${fix.length}`);
