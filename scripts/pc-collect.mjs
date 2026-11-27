#!/usr/bin/env node
// PC 자동 수집 — owner 의 PC(집·회사 IP, 설치된 진짜 크롬)에서 기존 수집기를 그대로 돌린다.
// GitHub Actions 의 '내 PC 러너'(self-hosted runner, 라벨 rack-pc)가 .github/workflows/pc-collect.yml 로 부른다.
// 설치·끄는 법: docs/pc-runner.md
//
// 왜: 확장 담당 브랜드(Render blocked-brands.json 의 brands — 약 30개)는 데이터센터 IP(GitHub·Render)를
// Akamai·DataDome·Cloudflare·Vercel·PerimeterX 가 막아, owner PC 의 크롬 확장만 읽는다. 확장은 PC 가 켜져 있고
// 크롬이 열려 있는 밤 23:00 에만 돈다(11/26 밤을 놓쳐 19개 브랜드가 하루 묵었다). 이 스크립트는 같은 PC·같은 IP 에서
// 사람이 버튼을 누르지 않아도 매일 돈다. 위장·우회 도구·유료 서비스는 쓰지 않는다 — 진짜 브라우저 그대로다.
//
// 순서(한 실행):
//   0. 계획 — 대상 브랜드(Render brands + pc-brands.json add) · 브랜드별 엔진·새 창(scripts/pc-plan.mjs) ·
//      목록이 최근에 저장된 브랜드는 건너뜀(확장이 어젯밤 돌았으면 쓰기를 아낀다) · 쓰기 예산 나누기
//   1. 목록 수집 — scripts/browser-collect.mjs (추가 브랜드 파일 형식으로 브랜드별 엔진을 넘긴다 · 브랜드당 저장 1번)
//   2. 혼용률 보강 — scripts/enrich-comp-browser.mjs (엔진별로 한 번씩 · 브랜드당 저장 2번: 오버레이·상품 상세)
//   3. 컬러 보강 — scripts/enrich-comp.mjs NEED_FIELDS=color (2단계에서 상품 페이지가 읽힌 브랜드만 ·
//      브라우저 지문 흉내(impit)·Worker 우회·아카이브는 끔 · 브랜드당 저장 2번 + 검색 인덱스 1번)
//   4. 리포트 — pc-collect-report.json/.md · PC 측정 기록 pc-collect-state.json
// 모든 단계에 scripts/pc-browser-hooks.mjs 를 끼운다(진짜 크롬 · 창 띄우기 · 있는 그대로 · 정중한 접속 · 쓰기 예산).
//
// env:
//   STORE            1(기본)이면 저장 · 0 이면 읽기만(Worker 에 GET 만)
//   BRANDS           쉼표로 구분한 브랜드(비우면 계획 전체 · 주면 신선도·멈춤과 무관하게 그 브랜드만)
//   REPORT_TAG       측정 실행 — 리포트를 pc-collect-<TAG>.* 로 따로 남기고 측정 기록을 건드리지 않는다. STORE=0 만 허용
//   MEASURE_TAG      워크플로가 주는 '입력' report_tag(이것이 있으면 STORE=0 이어야 한다 — browser-collect.yml 과 같은 막기)
//   STEPS            collect,comp,color(기본) 중 고름 · plan 이면 계획만 적고 끝낸다(브라우저를 띄우지 않음)
//   PC_WRITE_BUDGET  한 실행의 Worker 저장 요청 상한(기본 120)
//   PC_FRESH_HOURS   목록이 이 시간 안에 저장됐으면 목록 수집을 건너뜀(기본 20 · 0 이면 늘 수집)
//   PC_HEADED        1(기본) 창을 띄움 · PC_NATIVE 1(기본) 위장 설정 뺌 · PC_CHANNEL chrome(기본)
//   COLLECT_MIN · COMP_MIN · COLOR_MIN  단계별 시간 예산(분, 기본 90 · 90 · 30) · COMP_BRAND_MIN 혼용률 브랜드당(기본 5)
//   PER_BRAND        혼용률 보강 브랜드당 상품 수(기본 30) · COLOR_PER_BRAND 컬러 보강(기본 60)
//   MAX_PAGES        카테고리당 최대 페이지(기본 8)
//   RENDER_URL · WORKER_URL · WORKER_TOKEN
// 시험용(scripts/smoke-pc-collect.mjs): REPORT_DIR · PC_WORK_DIR · PC_STATE_FILE · PC_ENRICH_STATE · PC_NO_CHROME=1 · PC_NO_FIREFOX=1
//   · PC_ACCESS_MAP · PC_BRANDS_FILE

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, copyFileSync, unlinkSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { platform, arch, homedir } from "node:os";
import { buildPlan, updateState, parseEnrichTable, splitBudget, normBrand, WRITES } from "./pc-plan.mjs";
import { emptyRunState, scrubPaths } from "./pc-limits.mjs";
import { budgetEnv, readLedger, ledgerPuts, remainingToday, writeLedger } from "./kv-budget.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const E = process.env;
const STORE = E.STORE === "0" ? "0" : "1";
const MEASURE_TAG = String(E.MEASURE_TAG || "").trim();
const TAG = String(E.REPORT_TAG || "").replace(/[^\w.-]/g, "");

// 측정 실행이 저장까지 하면 운영 카탈로그를 바꾼다 — 막는다(browser-collect.yml 의 MEASURE_TAG 검사와 같다).
if ((MEASURE_TAG || TAG) && STORE !== "0") {
  console.error("::error::report_tag(측정 실행)는 store=0 으로만 돌린다");
  process.exit(1);
}
if (process.argv.includes("--check-only")) { console.log(`확인: STORE=${STORE}${TAG ? " · 측정 " + TAG : ""} — 통과`); process.exit(0); }

const STEPS = String(E.STEPS || "collect,comp,color").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const PLAN_ONLY = STEPS.includes("plan");
const ASKED_BUDGET = Math.max(0, Number(E.PC_WRITE_BUDGET ?? 120) || 0);
// 하루(UTC) KV 쓰기 장부(scripts/kv-budget.mjs · kv-writes/) — 워크플로가 KV_LEDGER_DIR 을 주면 오늘 다른 잡이 쓴 put 을 빼고
// 남은 몫 안에서만 쓴다(무료 플랜 하루 1,000 − 예약분). 장부가 없으면(로컬·시험) PC_WRITE_BUDGET 그대로.
const KV_ENV = budgetEnv();
const LEDGER = KV_ENV.dir ? readLedger(KV_ENV.dir) : [];
const KV_LEFT = KV_ENV.dir ? remainingToday({ limit: KV_ENV.limit, reserve: KV_ENV.reserve, used: ledgerPuts(LEDGER) }) : Infinity;
const BUDGET = Math.min(ASKED_BUDGET, KV_LEFT);
const FRESH_H = E.PC_FRESH_HOURS === undefined || E.PC_FRESH_HOURS === "" ? 20 : Math.max(0, Number(E.PC_FRESH_HOURS) || 0);
const ONLY = String(E.BRANDS || "").split(",").map((s) => s.trim()).filter(Boolean);
const REPORT_DIR = E.REPORT_DIR || ROOT;
const WORK = E.PC_WORK_DIR || join(ROOT, ".pc-work");
const BASE = TAG ? `pc-collect-${TAG}` : "pc-collect-report";
const STATE_FILE = E.PC_STATE_FILE || join(ROOT, "pc-collect-state.json");
const ENRICH_STATE = E.PC_ENRICH_STATE || join(ROOT, "pc-enrich-state.json");
const RENDER = (E.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const WORKER = (E.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = E.WORKER_TOKEN || "hsfabriclinker";
const MIN = (k, d) => Math.max(1, Number(E[k]) || d);
const HOOKS = pathToFileURL(join(ROOT, "scripts", "pc-browser-hooks.mjs")).href;
const RUN_FILE = join(WORK, "run.json");
const T0 = Date.now();
const notes = [];
if (KV_ENV.dir && KV_LEFT < ASKED_BUDGET) {
  notes.push(`오늘(UTC) KV 쓰기 몫이 ${KV_LEFT}번 남음(한도 ${KV_ENV.limit} − 예약 ${KV_ENV.reserve} − 오늘 장부 ${ledgerPuts(LEDGER)}) — 이번 실행 쓰기 예산을 ${ASKED_BUDGET} → ${BUDGET} 로 줄임`);
}

const readJson = (p, d = null) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch (e) { return d; } };
const readText = (p) => { try { return readFileSync(p, "utf8"); } catch (e) { return null; } };

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });
writeFileSync(RUN_FILE, JSON.stringify(emptyRunState(BUDGET), null, 1));
const runState = () => readJson(RUN_FILE, emptyRunState(BUDGET));
const bumpLists = () => { const r = runState(); r.writes.lists++; writeFileSync(RUN_FILE, JSON.stringify(r, null, 1)); };

async function getJson(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    if (i < tries - 1) await new Promise((r) => setTimeout(r, (Number(E.CONFIG_RETRY_MS) || 5000) * 3 ** i));
  }
  throw last;
}

// 자식 프로세스 하나 — 훅을 끼우고, 화면에도 보이고, 글도 모은다.
function runStep(step, script, env, minutes) {
  return new Promise((resolve) => {
    console.log(`\n── ${step} ── node ${script}`);
    const child = spawn(process.execPath, ["--import", HOOKS, join(ROOT, "scripts", script)], {
      // 자식은 장부를 따로 쓰지 않는다(KV_LEDGER_DIR 비움) — 이 실행 전체를 끝에서 한 줄로 남긴다.
      env: { ...process.env, ...env, KV_LEDGER_DIR: "", PC_RUN_FILE: RUN_FILE, PC_STEP: step, PC_WRITE_BUDGET: String(BUDGET),
        RENDER_URL: RENDER, WORKER_URL: WORKER, WORKER_TOKEN: TOKEN },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    const take = (d) => { out += d; process.stdout.write(d); };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    // 단계 시간 예산 + 15분이 지나도 안 끝나면 끊는다(브라우저가 멈춘 경우 — 다음 단계·리포트를 지키려고).
    const kill = setTimeout(() => { notes.push(`⚠ ${step}: ${minutes + 15}분이 지나 멈춤`); child.kill(); }, (minutes + 15) * 60_000);
    child.on("close", (code) => { clearTimeout(kill); resolve({ code, out }); });
  });
}

// 기존 보강 스크립트는 리포트를 저장소 루트의 정해진 이름에 쓴다 — 데이터센터 리포트를 덮지 않게
// 실행 전 내용을 기억해 두고, 실행 뒤 새 리포트는 작업 폴더로 옮기고 원래 내용을 되돌린다.
async function withRootFiles(names, fn) {
  const before = new Map(names.map((n) => [n, readText(join(ROOT, n))]));
  const res = await fn();
  const produced = {};
  for (const n of names) {
    const now = readText(join(ROOT, n));
    if (now != null && now !== before.get(n)) produced[n] = now;
    if (before.get(n) == null) { if (now != null) try { unlinkSync(join(ROOT, n)); } catch (e) {} }
    else if (now !== before.get(n)) writeFileSync(join(ROOT, n), before.get(n));
  }
  return { ...res, produced };
}

// ── 브라우저가 이 PC 에 있나(창 없이 잠깐 띄워 본다) ──
async function probe() {
  const have = { chrome: false, firefox: false }, info = {};
  let pw;
  try { pw = await import("playwright"); } catch (e) { info.error = "playwright 가 설치돼 있지 않음"; return { have, info }; }
  for (const [k, type, opts] of [["chrome", pw.chromium, { channel: E.PC_CHANNEL === "" ? undefined : E.PC_CHANNEL || "chrome" }], ["firefox", pw.firefox, {}]]) {
    if ((k === "chrome" && E.PC_NO_CHROME === "1") || (k === "firefox" && E.PC_NO_FIREFOX === "1")) { info[k] = "시험용으로 없다고 둠"; continue; }
    try {
      const b = await type.launch({ ...opts, headless: true, timeout: 60_000 });
      info[k] = b.version();
      have[k] = true;
      await b.close();
    } catch (e) { info[k] = "못 띄움: " + String((e && e.message) || e).split("\n")[0].slice(0, 140); }
  }
  return { have, info };
}

// ── 0. 계획 ──
const accessMap = (readJson(E.PC_ACCESS_MAP || join(ROOT, "access-map.json"), {}) || {}).brands || [];
const pcBrands = readJson(E.PC_BRANDS_FILE || join(ROOT, "pc-brands.json"), {}) || {};
const prevState = readJson(STATE_FILE, {}) || {};
const prevReport = readJson(join(REPORT_DIR, BASE + ".json"), null) || readJson(join(REPORT_DIR, "pc-collect-report.json"), null);
const datacenter = ((readJson(join(ROOT, "browser-extra-brands.json"), {}) || {}).brands || []).map((b) => b && b.brand).filter(Boolean);

let renderBrands = [], renderNote = "";
try {
  const blocked = await getJson(RENDER + "/blocked-brands.json");
  renderBrands = Array.isArray(blocked.brands) ? blocked.brands : [];
} catch (e) {
  renderBrands = (prevReport && prevReport.plan && prevReport.plan.renderBrands) || accessMap.filter((b) => b.group === "extension").map((b) => b.brand);
  renderNote = `⚠ Render 설정 파일을 못 받아(${String((e && e.message) || e).slice(0, 60)}) ` +
    (prevReport && prevReport.plan ? "지난 PC 실행의" : "접근 지도(access-map.json)의") + ` 확장 담당 브랜드 ${renderBrands.length}개로 계획했습니다.`;
  notes.push(renderNote);
}
let catalogs = null;
try {
  const d = await getJson(`${WORKER}/?catalogs=1&token=${encodeURIComponent(TOKEN)}`, 2);
  bumpLists();
  if (d && Array.isArray(d.list)) catalogs = d.list;
} catch (e) { notes.push(`저장된 목록(?catalogs=1)을 못 읽어 '최근 저장' 건너뛰기를 못 함 — 데이터센터 야간 수집 브랜드만 건너뜀(${String((e && e.message) || e).slice(0, 50)})`); }

const browsers = await probe();
if (!browsers.have.chrome) notes.push(`⚠ 설치된 크롬을 못 띄움(${browsers.info.chrome || browsers.info.error}) — 크롬 브랜드는 파이어폭스로`);
if (!browsers.have.firefox) notes.push(`파이어폭스 없음(${browsers.info.firefox || browsers.info.error}) — 파이어폭스 브랜드는 크롬으로`);

const plan = buildPlan({ renderBrands, accessMap, overrides: pcBrands.overrides || {}, extra: pcBrands.add || [], state: prevState,
  only: ONLY, catalogs, datacenter, freshHours: FRESH_H, now: Date.now(), have: browsers.have });
// 쓰기 예산 — 저장하는 실행에서만 자른다(읽기만 하는 실행은 쓰기가 0 이다).
const allot = STORE === "1" ? splitBudget(BUDGET, plan.collect.length, plan.enrich.length, plan.enrich.length)
  : { collect: plan.collect.length, comp: plan.enrich.length, color: plan.enrich.length };
for (const x of plan.collect.splice(allot.collect)) plan.skipped.push({ brand: x.brand, stage: "listing", why: `쓰기 예산(${BUDGET}) 부족 — 오늘 건너뜀` });
for (const x of plan.enrich.splice(allot.comp)) plan.skipped.push({ brand: x.brand, stage: "product", why: `쓰기 예산(${BUDGET}) 부족 — 오늘 건너뜀` });
if (!browsers.have.chrome && !browsers.have.firefox) notes.push("⚠ 이 PC 에서 브라우저를 하나도 못 띄움 — 아무것도 수집하지 않음");
console.log(`PC 수집 계획 — 목록 ${plan.collect.length} · 상품 페이지 ${plan.enrich.length} · 건너뜀 ${plan.skipped.length} · 저장 ${STORE === "1" ? "ON(예산 " + BUDGET + ")" : "OFF"}`);
for (const x of plan.collect) console.log(`  · 목록 ${x.brand} → ${x.engine}${x.fresh ? " · 새 창" : ""}`);
for (const x of plan.enrich) console.log(`  · 상품 ${x.brand} → ${x.engine}${x.fresh ? " · 새 창" : ""}`);

let collectJson = null, compRows = [], colorMd = "", colorBrands = [], failed = [];
const doing = (s) => !PLAN_ONLY && STEPS.includes(s) && (browsers.have.chrome || browsers.have.firefox);

// ── 1. 목록 수집 ──
if (doing("collect") && plan.collect.length) {
  const extraFile = join(WORK, "pc-extra-brands.json");
  writeFileSync(extraFile, JSON.stringify({ brands: plan.collect.map((x) => ({
    brand: x.brand, engine: x.engine === "firefox" ? "firefox" : "chromium", fresh: !!x.fresh, job: "pc", ...(x.store === "merge" ? { store: "merge" } : {}),
  })) }, null, 1));
  // 수집기가 Render 설정 파일을 못 받으면 지난 리포트의 브랜드·URL 로 돈다 — 지난 PC 실행의 수집 결과를 넣어 둔다.
  if (prevReport && prevReport.collect) writeFileSync(join(WORK, "browser-collect-pc-collect.json"), JSON.stringify(prevReport.collect));
  const r = await runStep("collect", "browser-collect.mjs", {
    GROUP: "browser", BRANDS: "", ENGINE: "", FRESH_CONTEXT: "0", DIAG: "", DRY_PLAN: "",
    EXTRA_MODE: "only", EXTRA_JOB: "pc", EXTRA_BRANDS_FILE: extraFile,
    REPORT_TAG: "pc-collect", REPORT_DIR: WORK, STORE, MAX_PAGES: E.MAX_PAGES || "8",
    DEADLINE_MIN: String(MIN("COLLECT_MIN", 90)),
  }, MIN("COLLECT_MIN", 90) + 10);
  collectJson = readJson(join(WORK, "browser-collect-pc-collect.json"), null);
  if (r.code !== 0) { failed.push("collect"); notes.push(`⚠ 목록 수집이 코드 ${r.code} 로 끝남`); }
}

// ── 2. 혼용률 보강 — 브랜드마다 따로 ──
// 브랜드 하나씩 부른다: 보강 스크립트는 BRANDS 를 주면 저장된 목록 순서(알파벳)로 돌아 시간이 모자라면 늘 같은
// 브랜드가 밀린다. 하나씩이면 순서를 우리가 정하고(데이터센터에서 막힌 정도가 큰 브랜드 먼저 · 시작 위치를 날마다 돌림)
// 브랜드마다 시간 상한(COMP_BRAND_MIN)을 둘 수 있다.
const ENRICH_ENGINE = (x) => (x.engine === "firefox" ? (x.fresh ? "firefox-fresh" : "firefox") : "playwright");
const readable = new Set();   // 이번에 상품 페이지가 읽힌(또는 혼용률이 이미 다 찬) 브랜드 — 컬러 보강 대상
if (doing("comp") && plan.enrich.length) {
  // 측정 실행·읽기만 하는 실행은 PC 차단 이력 파일을 바꾸지 않게 복사본을 쓴다.
  let statePath = ENRICH_STATE;
  if (TAG || STORE === "0") { statePath = join(WORK, "pc-enrich-state.json"); if (existsSync(ENRICH_STATE)) copyFileSync(ENRICH_STATE, statePath); }
  const order = [...plan.enrich];
  const k = order.length ? Math.floor(Date.now() / 86_400_000) % order.length : 0;
  order.push(...order.splice(0, k));
  const stepEnd = Date.now() + MIN("COMP_MIN", 90) * 60_000;
  const perBrand = MIN("COMP_BRAND_MIN", 5);
  for (const x of order) {
    if (Date.now() > stepEnd) { plan.skipped.push({ brand: x.brand, stage: "product", why: `혼용률 보강 시간 예산(${MIN("COMP_MIN", 90)}분)을 다 씀 — 내일 앞쪽에서` }); continue; }
    const engine = ENRICH_ENGINE(x);
    const dryTag = `pc-comp`;
    const files = ["enrich-browser-report.md", `enrich-browser-dry-${dryTag}.md`];
    const r = await withRootFiles(files, () => runStep(`comp ${x.brand}`, "enrich-comp-browser.mjs", {
      BRANDS: x.brand, TOP: "1", PER_BRAND: E.PER_BRAND || "30",
      STORE, DRY: "", DRY_TAG: dryTag, ENGINE: engine, TABS: "1", PAUSE_MS: "2000", TIME_MIN: String(perBrand),
      STATE_PATH: statePath, LANE_FILE: join(WORK, "no-lane.json"), PLAYWRIGHT_CHROMIUM: "",
    }, perBrand));
    const md = Object.values(r.produced)[0] || "";
    const rows = parseEnrichTable(md);
    compRows.push(...rows);
    for (const row of rows) if (row.ok + row.none > 0) readable.add(normBrand(row.brand));
    if (/— 채울 것 없음/.test(r.out)) readable.add(normBrand(x.brand));
    if (!rows.length) compRows.push({ brand: x.brand, engine, total: 0, tried: 0, ok: 0, none: 0, shell: 0, blocked: 0, err: 0,
      note: /채울 것 없음/.test(r.out) ? "채울 것 없음" : /대상 브랜드 없음/.test(r.out) ? "저장된 목록 없음" : `코드 ${r.code}` });
    if (r.code !== 0) { failed.push(`comp ${x.brand}`); notes.push(`⚠ 혼용률 보강(${x.brand})이 코드 ${r.code} 로 끝남`); }
  }
}

// ── 3. 컬러 보강 — 2단계에서 상품 페이지가 읽힌 브랜드만 ──
if (doing("color")) {
  const used = runState().writes.used;
  const left = STORE === "1" ? BUDGET - used : Infinity;
  const fit = left > WRITES.colorFixed ? Math.floor((left - WRITES.colorFixed) / WRITES.color) : 0;
  // 혼용률 단계를 돌지 않은 실행(STEPS=color)이면 계획의 상품 페이지 브랜드 전부.
  const cand = STEPS.includes("comp") ? plan.enrich.filter((x) => readable.has(normBrand(x.brand))) : plan.enrich;
  colorBrands = cand.slice(0, fit).map((x) => x.brand);
  for (const x of cand.slice(fit)) plan.skipped.push({ brand: x.brand, stage: "color", why: `쓰기 예산 남은 ${left} — 컬러 보강 건너뜀` });
  if (colorBrands.length) {
    const tag = "pc-color";
    const files = ["enrich-comp-report.md", `enrich-comp-dry-${tag}.md`, "enrich-comp-dry-report.md"];
    const r = await withRootFiles(files, () => runStep("color", "enrich-comp.mjs", {
      NEED_FIELDS: "color", BRANDS: colorBrands.join(","), PER_BRAND: E.COLOR_PER_BRAND || "60",
      TOTAL: String((Number(E.COLOR_PER_BRAND) || 60) * colorBrands.length),
      IMPIT: "0", WORKER_BYPASS: "0", WAYBACK: "0", HOST_GAP_MS: "1500", BRAND_POOL: "1", PAGE_POOL: "1",
      DETAIL_BACKFILL: "0", TIME_MIN: String(MIN("COLOR_MIN", 30)),
      DRY: STORE === "1" ? "" : "1", DRY_TAG: STORE === "1" ? "" : tag,
    }, MIN("COLOR_MIN", 30)));
    colorMd = Object.values(r.produced)[0] || "";
    writeFileSync(join(WORK, "color.md"), colorMd);
    if (r.code !== 0) { failed.push("color"); notes.push(`⚠ 컬러 보강이 코드 ${r.code} 로 끝남`); }
  }
}

// ── 4. 기록·리포트 ──
const run = runState();
const collectResults = (collectJson && collectJson.results) || [];
if (!TAG && !PLAN_ONLY) {
  const next = updateState(prevState, { collectResults, enrichRows: compRows }, Date.now());
  writeFileSync(STATE_FILE, JSON.stringify(next, null, 1) + "\n");
}
const puts = run.writes.log.filter((l) => l.put).length, dels = run.writes.log.filter((l) => l.del).length;
let ledgerFile = "";
if (KV_ENV.dir && STORE === "1" && !TAG && !PLAN_ONLY) {
  const f = writeLedger(KV_ENV.dir, { job: "pc-collect", run: E.GITHUB_RUN_ID || "", start: new Date(T0).toISOString(), at: new Date().toISOString(),
    requests: run.writes.used, puts, deletes: dels, failed: run.writes.log.filter((l) => l.ok && !l.put).length, mode: "pc" });
  ledgerFile = f ? f.replace(ROOT, "").replace(/^[\\/]+/, "").replace(/\\/g, "/") : "";
}
const writesBy = {};
for (const l of run.writes.log) if (l.ok) writesBy[l.kind] = (writesBy[l.kind] || 0) + 1;
const refusedW = run.writes.log.filter((l) => !l.ok);
const headed = run.launches.filter((l) => !l.headless).length;
const report = {
  when: new Date().toISOString(), store: STORE === "1", tag: TAG, steps: PLAN_ONLY ? ["plan"] : STEPS, secs: Math.round((Date.now() - T0) / 1000),
  runner: { platform: platform(), arch: arch(), node: process.version },
  browsers: browsers.info, notes,
  plan: { renderBrands, collect: plan.collect, enrich: plan.enrich, skipped: plan.skipped, freshHours: FRESH_H, only: ONLY },
  writes: { budget: BUDGET, asked: ASKED_BUDGET, kvLeftToday: Number.isFinite(KV_LEFT) ? KV_LEFT : null, used: run.writes.used, puts, deletes: dels, ledgerFile, byKind: writesBy, refused: refusedW, lists: run.writes.lists, log: run.writes.log },
  polite: { navs: run.polite.navs, stopped: run.polite.stopped, refused: run.polite.refused.slice(0, 50) },
  launches: run.launches,
  collect: collectJson,
  comp: compRows, colorBrands, failed,
};
// 리포트는 공개 저장소에 올라간다 — 오류 글 속의 내 폴더 경로(사용자 이름)를 ~ 로 지운다.
const scrub = (t) => scrubPaths(t, homedir());
const scrubDeep = (v) => (typeof v === "string" ? scrub(v) : Array.isArray(v) ? v.map(scrubDeep)
  : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, y]) => [k, scrubDeep(y)])) : v);
writeFileSync(join(REPORT_DIR, BASE + ".json"), JSON.stringify(scrubDeep(report), null, 1));

const verdictOf = (r) => (r.collected >= 20 ? "✅" : /차단/.test(r.verdict || "") ? "⛔" : "🔧");
let md = `# PC 수집 — 내 PC 의 진짜 브라우저 (${report.when.slice(0, 16)}Z)\n\n`;
md += `owner PC(집·회사 IP)의 GitHub 러너가 설치된 크롬·파이어폭스로 확장 담당 브랜드를 돈 결과입니다.` +
  ` ${PLAN_ONLY ? "**계획만(쇼핑몰 접속·저장 없음)**" : STORE === "1" ? "저장함" : "**저장 안 함(읽기만)**"}${TAG ? ` · 측정 실행 ${TAG}` : ""} · ${Math.round(report.secs / 60)}분\n\n`;
md += `- 브라우저: 크롬 ${browsers.info.chrome || "-"} · 파이어폭스 ${browsers.info.firefox || "-"}` +
  (run.launches.length ? ` · 띄운 창 ${run.launches.length}번 중 창 띄움 ${headed} · 창 없이 ${run.launches.length - headed}` : "") + `\n`;
md += `- 저장 요청 ${run.writes.used}/${BUDGET}번` + (Object.keys(writesBy).length ? ` (${Object.entries(writesBy).map(([k, v]) => `${k} ${v}`).join(" · ")})` : "") +
  (refusedW.length ? ` · 막은 요청 ${refusedW.length}` : "") + ` · KV put ${puts}` + (dels ? ` · delete ${dels}` : "") + ` · 목록 읽기(?catalogs) ${run.writes.lists}번\n`;
md += `- 쇼핑몰 페이지 요청 ${run.polite.navs}번` + (Object.keys(run.polite.stopped).length ? ` · 429 로 멈춘 사이트: ${Object.keys(run.polite.stopped).join(", ")}` : "") +
  (run.polite.refused.length ? ` · 한도로 안 보낸 요청 ${run.polite.refused.length}` : "") + `\n\n`;
for (const n of notes) md += `> ${n}\n\n`;
if (collectResults.length || (collectJson && collectJson.configNote)) {
  md += `\n## 목록 수집 (${collectResults.length})\n\n`;
  if (collectJson.configNote) md += `> ⚠ ${collectJson.configNote}\n\n`;
  md += `| | 브랜드 | 엔진 | 모음 | 저장 | 메모 |\n|---|---|---|---:|---:|---|\n`;
  for (const r of collectResults) {
    const bad = (r.perUrl || []).filter((u) => u.note).map((u) => u.note.slice(0, 60));
    md += `| ${r.deferred ? "⏭" : verdictOf(r)} | ${r.brand} | ${r.engine}${r.fresh ? " · 새 창" : ""} | ${r.collected || 0} | ${r.stored || 0} | ${[r.storeErr, ...new Set(bad)].filter(Boolean).join(" · ").slice(0, 160)} |\n`;
  }
}
if (compRows.length) {
  md += `\n## 혼용률 보강 (${compRows.length})\n\n| 브랜드 | 엔진 | 시도 | 채움 | 미표기 | 껍데기 | 차단 |\n|---|---|---:|---:|---:|---:|---:|\n`;
  for (const r of compRows) md += `| ${r.brand} | ${r.engine} | ${r.tried} | **${r.ok}** | ${r.none} | ${r.shell} | ${r.blocked}${r.note ? " · " + r.note : ""} |\n`;
}
if (colorBrands.length) {
  md += `\n## 컬러 보강 (${colorBrands.length}) — ${colorBrands.join(", ")}\n\n`;
  const lines = String(colorMd).split("\n").filter((l) => /^\|/.test(l)).slice(0, 40);
  md += lines.length ? lines.join("\n") + "\n" : "(리포트 없음)\n";
}
const stops = Object.values((readJson(STATE_FILE, {}) || {}).brands || {}).filter((b) => Number(b.stoppedUntil) > Date.now() || Number(b.productStoppedUntil) > Date.now());
if (stops.length) {
  md += `\n## ⛔ 이 PC 의 진짜 브라우저로도 막힌 브랜드 (${stops.length}) — 확장 담당 유지\n\n`;
  for (const b of stops) md += `- ${b.brand}${b.stoppedUntil ? " · 목록 " + new Date(b.stoppedUntil).toISOString().slice(0, 10) + " 에 다시 봄" : ""}${b.productStoppedUntil ? " · 상품 " + new Date(b.productStoppedUntil).toISOString().slice(0, 10) + " 에 다시 봄" : ""}\n`;
}
if (plan.skipped.length) {
  md += `\n### 건너뜀 (${plan.skipped.length})\n\n`;
  for (const s of plan.skipped) md += `- ${s.brand} (${s.stage === "listing" ? "목록" : s.stage === "product" ? "상품" : "컬러"}) — ${s.why}\n`;
}
// 계획(브랜드별 엔진과 근거)은 길어서 접어 둔다 — GitHub 에서 눌러 펼친다.
md += `\n<details><summary>계획 — 브랜드별 엔진과 근거 (목록 ${plan.collect.length} · 상품 페이지 ${plan.enrich.length})</summary>\n\n| 브랜드 | 단계 | 엔진 | 근거 |\n|---|---|---|---|\n`;
for (const x of plan.collect) md += `| ${x.brand} | 목록 | ${x.engine}${x.fresh ? " · 새 창" : ""} | ${x.why} |\n`;
for (const x of plan.enrich) md += `| ${x.brand} | 상품 | ${x.engine}${x.fresh ? " · 새 창" : ""} | ${x.why} |\n`;
md += `\n</details>\n`;
writeFileSync(join(REPORT_DIR, BASE + ".md"), scrub(md));
console.log(`\n리포트: ${BASE}.md · 저장 요청 ${run.writes.used}/${BUDGET} · 페이지 요청 ${run.polite.navs}`);
if (!browsers.have.chrome && !browsers.have.firefox) process.exit(1);
if (failed.includes("collect")) process.exit(1);
