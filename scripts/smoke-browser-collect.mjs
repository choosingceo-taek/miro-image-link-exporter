#!/usr/bin/env node
// 헤드리스 수집기(scripts/browser-collect.mjs)를 가짜 Render·가짜 Worker·가짜 쇼핑몰에 붙여
// 진짜 크롬으로 끝까지 돌린다.
//
// 이 스크립트가 망가지면 잡이 초록불이어도 하루치 수집이 사라진다 — 실제로 있었던 일들:
//  · 2026-09-27 수집이 119분을 넘겨 잡이 취소되고 23개 브랜드 결과가 통째로 사라졌다
//    → 시간 예산(SOFT: 새 브랜드 시작 안 함 · HARD: 진행 중인 브랜드를 끊고 저장 안 함)
//  · 2026-10-14 Render 429 한 번에 수집이 시작도 못 했다 → 재시도 + 지난 리포트로 대체
// 그래서 네 가지를 본다.
//   1. 평소(STORE=1) — 모으고 저장하고 리포트에 적는다
//   2. 설정 파일을 못 받음 — 지난 리포트의 브랜드로 돌고 ⚠ 를 남긴다
//   3. 마감 — 예산 뒤 브랜드는 '미룸', 진행 중에 끊긴 브랜드는 저장하지 않는다
//   4. STORE=0 — Worker 에 아무것도 보내지 않는다
//
//   npm i --no-save playwright@1.49.1 && npx playwright install --with-deps chromium
//   node scripts/smoke-browser-collect.mjs
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);

// ── 가짜 서버 하나가 Render·Worker·쇼핑몰을 다 맡는다(경로로 나눈다) ──
const state = { stores: [], slow: {}, hits: {}, catalogs: [], catalogsFail: false };
const listing = (brand, cat, n) => {
  const slug = brand.toLowerCase();
  let cards = "";
  for (let i = 1; i <= n; i++) {
    cards += `<li class="product-card"><a href="/${slug}/products/${slug}-${cat}-${i}">` +
      `<img src="/img/${slug}-${cat}-${i}.jpg" width="600" height="800" alt="${brand} ${cat} Tee ${i}"></a>` +
      `<h3 class="product-name">${brand} ${cat} Tee ${i}</h3><span class="price">$48.00</span></li>`;
  }
  return `<!doctype html><html><head><title>${brand} — ${cat}</title></head><body>` +
    `<h1>${brand} ${cat}</h1><ul class="grid">${cards}</ul></body></html>`;
};
let config = null;   // { browser: [...], links: {...}, brands: [...] }
const srv = createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const j = (o, code = 200) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
  const p = u.pathname;
  // 가짜 Render
  if (p === "/render/blocked-brands.json") return j({ browser: config.browser, brands: [] });
  if (p === "/render/category-links.json") return j(config.links);
  if (p === "/render/brands.json") return j(config.brands);
  // 가짜 Worker — 카탈로그 저장
  if (p === "/worker/" || p === "/worker") {
    if (u.searchParams.get("store") === "catalog" && req.method === "POST") {
      let b = ""; req.on("data", (d) => (b += d));
      return req.on("end", () => {
        const body = JSON.parse(b);
        state.stores.push({ brand: body.brand, site: body.site, count: body.items.length, query: u.search });
        j({ ok: true, count: body.items.length });
      });
    }
    // 저장된 카탈로그 목록(추가 브랜드 저장 전에 지금 개수를 본다)
    if (u.searchParams.get("catalogs")) return state.catalogsFail ? j({ error: "down" }, 500) : j({ ok: true, list: state.catalogs });
    return j({ error: "unknown" }, 400);
  }
  if (p.startsWith("/img/")) { state.imgHits = (state.imgHits || 0) + 1; res.writeHead(404); return res.end(); }
  // 가짜 쇼핑몰 목록 페이지: /<brand>/c/<cat>
  const m = p.match(/^\/([a-z]+)\/c\/([a-z]+)$/);
  if (m) {
    state.hits[p] = (state.hits[p] || 0) + 1;
    const brand = m[1][0].toUpperCase() + m[1].slice(1);
    const send = () => { res.writeHead(200, { "Content-Type": "text/html" }); res.end(listing(brand, m[2], 6)); };
    const delay = state.slow[p] || 0;
    return delay ? setTimeout(send, delay) : send();
  }
  res.writeHead(404); res.end("not found");
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const PORT = srv.address().port;
const BASE = `http://localhost:${PORT}`;

function setBrands(spec) {
  // spec: [[이름, [카테고리...]], ...] — 순서대로 blocked.browser 에 넣는다
  config = { browser: [], links: {}, brands: [] };
  for (const [name, cats] of spec) {
    config.browser.push(name);
    config.links[name] = { tops: cats.map((c) => `${BASE}/${name.toLowerCase()}/c/${c}`) };
    config.brands.push({ name, url: `${BASE}/${name.toLowerCase()}` });
  }
}
// 수집기는 시작 위치를 날마다 돌린다(day % n). 원하는 실행 순서가 나오도록 거꾸로 돌려 넣는다.
function orderFor(names) {
  const n = names.length, k = Math.floor(Date.now() / 86_400_000) % n;
  return names.map((_, j) => names[(j - k + n) % n]);
}

async function collect(label, env, { prevReport } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "bc-smoke-"));
  if (prevReport) writeFileSync(join(dir, "browser-collect-report.json"), JSON.stringify(prevReport));
  state.stores = []; state.hits = {};
  const t0 = Date.now();
  const run = spawn(process.execPath, [join(ROOT, "scripts/browser-collect.mjs")], {
    env: {
      ...process.env,
      RENDER_URL: `${BASE}/render`, WORKER_URL: `${BASE}/worker`, WORKER_TOKEN: "test",
      REPORT_DIR: dir, MAX_PAGES: "1", GROUP: "browser", BRANDS: "", STORE: "1",
      // 저장소의 진짜 추가 브랜드 파일이 끼어들지 않게 — 필요한 시험만 따로 준다.
      EXTRA_BRANDS_FILE: join(dir, "no-extra.json"),
      NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1",
      ...(process.env.PLAYWRIGHT_CHROMIUM ? { CHROMIUM_PATH: process.env.PLAYWRIGHT_CHROMIUM } : {}),
      ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  run.stdout.on("data", (d) => { out += d; });
  run.stderr.on("data", (d) => { out += d; });
  const code = await new Promise((r) => run.on("close", r));
  const secs = (Date.now() - t0) / 1000;
  console.log(`\n[${label}] 종료 ${code} · ${secs.toFixed(1)}s`);
  const jp = join(dir, "browser-collect-report.json"), mp = join(dir, "browser-collect-report.md");
  const json = existsSync(jp) ? JSON.parse(readFileSync(jp, "utf8")) : null;
  const md = existsSync(mp) ? readFileSync(mp, "utf8") : "";
  rmSync(dir, { recursive: true, force: true });
  if (code !== 0) { console.error(out); fail(`[${label}] 종료 코드 ${code}`); }
  if (!json || !md) fail(`[${label}] 리포트 파일이 없다(json ${!!json} · md ${!!md})`);
  return { code, out, json, md, stores: [...state.stores], hits: { ...state.hits }, secs };
}
// 브라우저 없이 대상·엔진 계획만 받는다(DRY_PLAN).
async function plan(env) {
  const run = spawn(process.execPath, [join(ROOT, "scripts/browser-collect.mjs")], {
    env: {
      ...process.env, RENDER_URL: `${BASE}/render`, WORKER_URL: `${BASE}/worker`, GROUP: "browser", BRANDS: "",
      STORE: "0", DRY_PLAN: "1", ENGINE: "", REPORT_DIR: mkdtempSync(join(tmpdir(), "bc-plan-")),
      EXTRA_BRANDS_FILE: join(tmpdir(), "bc-no-extra.json"),
      NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1", ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  run.stdout.on("data", (d) => { out += d; });
  run.stderr.on("data", (d) => { out += d; });
  const code = await new Promise((r) => run.on("close", r));
  const m = out.match(/^PLAN (.*)$/m);
  return { code, out, plan: m ? JSON.parse(m[1]) : null };
}

const res = (json, brand) => ((json && json.results) || []).find((r) => r.brand === brand);

try {
  // ── 1. 평소 실행 ──
  {
    const L = "평소 STORE=1";
    setBrands([["Alpha", ["tops"]], ["Bravo", ["tops", "shirts"]]]);
    const { json, md, stores } = await collect(L, {});
    const sa = stores.find((s) => s.brand === "Alpha"), sb = stores.find((s) => s.brand === "Bravo");
    if (!sa || sa.count !== 6) fail(`[${L}] Alpha 저장: ${JSON.stringify(sa)}`);
    if (!sb || sb.count !== 12) fail(`[${L}] Bravo 저장: ${JSON.stringify(sb)}`);
    if (sa && !/replace=1/.test(sa.query)) fail(`[${L}] 통째 교체(replace=1) 저장이 아니다: ${sa.query}`);
    if (sa && sb) ok(`두 브랜드를 모아 저장했다(Alpha ${sa.count} · Bravo ${sb.count}, replace=1)`);
    const ra = res(json, "Alpha");
    if (!ra || ra.collected !== 6 || ra.stored !== 6 || ra.cut) fail(`[${L}] 리포트 JSON 의 Alpha: ${JSON.stringify(ra && { ...ra, perUrl: undefined, sample: undefined })}`);
    if (!/\*\*Alpha\*\*/.test(md) || !/\*\*Bravo\*\*/.test(md)) fail(`[${L}] 리포트 md 에 브랜드가 없다`);
    else ok("리포트(json·md)에 두 브랜드가 적힌다");
    if (/마감으로 미룸/.test(md) || /⚠/.test(md)) fail(`[${L}] 평소 실행인데 마감·경고가 적혔다`);
  }

  // ── 2. 설정 파일을 못 받음 → 지난 리포트로 ──
  {
    const L = "설정 실패 → 지난 리포트";
    setBrands([["Charlie", ["tops"]]]);
    const prev = {
      results: [
        { brand: "Charlie", site: "localhost.charlie", collected: 6, perUrl: [{ url: `${BASE}/charlie/c/tops`, count: 6, note: "" }] },
        // 지난번 마감으로 미뤘던 브랜드도 대상에 들어와야 한다
        { brand: "Delta", site: "localhost.delta", collected: 0, deferred: true, perUrl: [{ url: `${BASE}/delta/c/tops`, count: 0, note: "마감으로 미룸" }] },
      ],
    };
    const { json, md, stores, out, secs } = await collect(L, {
      RENDER_URL: "http://127.0.0.1:9/render",   // 닫힌 포트
      CONFIG_RETRY_MS: "20",
    }, { prevReport: prev });
    if (!/⚠ 설정 파일을 못 받아/.test(md)) fail(`[${L}] 리포트에 ⚠ 안내가 없다`);
    else ok("리포트에 '⚠ 설정 파일을 못 받아 … 지난 실행의 브랜드' 안내");
    if (!json || !/지난 실행의 브랜드·카테고리 URL 2개/.test(json.configNote || "")) fail(`[${L}] JSON configNote: ${json && json.configNote}`);
    const names = stores.map((s) => s.brand).sort().join(",");
    if (names !== "Charlie,Delta") fail(`[${L}] 지난 리포트의 브랜드를 다 돌지 않았다(저장 ${names}) ${out.slice(-400)}`);
    else ok("지난 리포트의 브랜드(지난번에 미룬 것 포함)로 수집·저장했다");
    if (secs > 60) fail(`[${L}] 재시도가 시험용 간격을 안 따른다(${secs.toFixed(0)}s)`);
  }

  // ── 3. 마감 ──
  {
    const L = "마감 SOFT/HARD";
    // 실행 순서: Echo(빠름) → Foxtrot(첫 페이지가 느림 · 카테고리 3개) → Golf → Hotel
    setBrands(orderFor(["Echo", "Foxtrot", "Golf", "Hotel"]).map((n) => [n, n === "Foxtrot" ? ["tops", "shirts", "pants"] : ["tops"]]));
    state.slow = { "/foxtrot/c/tops": 22_000 };
    const { json, md, stores, out, code } = await collect(L, { DEADLINE_SEC: "18", HARD_GRACE_SEC: "8" });
    state.slow = {};
    const order = [...out.matchAll(/\[\d+\/4\] (\w+)(?: \(\w+\))?:/g)].map((m) => m[1]);
    if (order[0] !== "Echo") fail(`[${L}] 실행 순서가 예상과 다르다: ${order.join(",")} — 시작 위치 회전 규칙이 바뀌었나`);
    const stored = stores.map((s) => s.brand);
    if (!stored.includes("Echo")) fail(`[${L}] 마감 전에 끝난 Echo 가 저장되지 않았다: ${JSON.stringify(stores)}`);
    else ok("마감 전에 끝난 브랜드(Echo)는 저장된다");
    if (stored.includes("Foxtrot")) fail(`[${L}] 마감으로 끊긴 Foxtrot 이 저장됐다 — 일부 카테고리로 기존 카탈로그를 덮는다`);
    const rf = res(json, "Foxtrot");
    if (!rf || !rf.cut || rf.stored || !/마감으로 중단/.test(rf.storeErr || "")) fail(`[${L}] Foxtrot 결과: ${JSON.stringify(rf && { cut: rf.cut, stored: rf.stored, storeErr: rf.storeErr, collected: rf.collected })}`);
    else ok(`진행 중 HARD 마감에 걸린 Foxtrot 은 끊기고(cut · ${rf.collected}개까지) 저장하지 않는다`);
    for (const b of ["Golf", "Hotel"]) {
      if (stored.includes(b)) fail(`[${L}] 예산 뒤의 ${b} 가 저장됐다`);
    }
    if (state.hits["/golf/c/tops"] || state.hits["/hotel/c/tops"]) fail(`[${L}] 예산 뒤의 브랜드 페이지를 열었다`);
    const sec = (md.split("## ⏭ 마감으로 미룸")[1] || "").split("\n## ")[0];
    if (!sec) fail(`[${L}] 리포트에 '마감으로 미룸' 절이 없다\n${md.slice(0, 600)}`);
    else {
      if (!/- Golf — 마감/.test(sec) || !/- Hotel — 마감/.test(sec)) fail(`[${L}] 미룸 절에 Golf·Hotel 이 없다:\n${sec}`);
      if (!/- Foxtrot — 마감으로 중단/.test(sec)) fail(`[${L}] 미룸 절에 '마감으로 중단' Foxtrot 이 없다:\n${sec}`);
      if (/Echo/.test(sec)) fail(`[${L}] 끝난 Echo 가 미룸 절에 들어갔다`);
      if (/- Golf — 마감/.test(sec) && /- Foxtrot — 마감으로 중단/.test(sec)) ok("리포트 '⏭ 마감으로 미룸' 절에 Golf·Hotel(미룸)과 Foxtrot(마감으로 중단)");
    }
    if (!/⏭ 마감으로 미룸 3/.test(md)) fail(`[${L}] 요약 줄의 미룸 수가 3이 아니다: ${(md.match(/- 대상.*/) || [""])[0]}`);
    // 다음 실행이 설정을 못 받았을 때 대신 돌 목록 — 미룬 브랜드의 URL 이 JSON 에 남아야 한다.
    const urlsOf = (b) => ((res(json, b) || {}).perUrl || []).map((u) => u.url);
    for (const b of ["Golf", "Hotel"]) {
      if (!urlsOf(b).includes(`${BASE}/${b.toLowerCase()}/c/tops`)) fail(`[${L}] JSON 에 미룬 ${b} 의 URL 이 없다 — 다음 대체 실행에서 빠진다`);
    }
    const fx = urlsOf("Foxtrot");
    for (const c of ["tops", "shirts", "pants"]) {
      if (!fx.includes(`${BASE}/foxtrot/c/${c}`)) fail(`[${L}] JSON 에 끊긴 Foxtrot 의 ${c} URL 이 없다 — 다음 대체 실행에서 그 카테고리가 빠진다`);
    }
    if (urlsOf("Golf").length && fx.length === 3) ok("JSON 에 미룬·끊긴 브랜드의 카테고리 URL 이 전부 남는다");
    if (code === 0 && json && md) ok("마감이어도 종료 코드 0 · 리포트 두 파일 모두 씀");
  }

  // ── 4. STORE=0 ──
  {
    const L = "STORE=0";
    setBrands([["India", ["tops"]]]);
    const { json, stores } = await collect(L, { STORE: "0" });
    if (stores.length) fail(`[${L}] Worker 에 저장 요청이 갔다: ${JSON.stringify(stores)}`);
    else ok("STORE=0 이면 Worker 에 아무것도 보내지 않는다");
    const ri = res(json, "India");
    if (!ri || ri.collected !== 6 || ri.stored !== 0) fail(`[${L}] 조사 결과: ${JSON.stringify(ri && { collected: ri.collected, stored: ri.stored })}`);
    if (json && json.store !== false) fail(`[${L}] 리포트 JSON 의 store 가 false 가 아니다`);
    if (!ri || ri.engine !== "chromium" || !json || json.engine !== "per-brand") fail(`[${L}] 기본 엔진이 리포트에 chromium 으로 안 적혔다: ${JSON.stringify(ri && ri.engine)} / ${json && json.engine}`);
    else ok("ENGINE 을 비우면 chromium 으로 돌고 리포트에 엔진이 적힌다");
  }

  // ── 4b. FRESH_CONTEXT=1 — 카테고리마다 새 창으로 열어도 똑같이 모은다 ──
  {
    const L = "FRESH_CONTEXT";
    setBrands([["Bravo", ["tops", "shirts", "pants"]]]);
    const { json, md } = await collect(L, { STORE: "0", FRESH_CONTEXT: "1" });
    const rb = res(json, "Bravo");
    if (!rb || rb.collected !== 18 || !json.freshContext || !/카테고리마다 새 창/.test(md)) fail(`[${L}] ${JSON.stringify(rb && rb.collected)} · ${json && json.freshContext}`);
    else ok("FRESH_CONTEXT=1 — 카테고리마다 새 창으로 열어도 3개 카테고리 18개를 모으고 리포트에 적는다");
  }

  // ── 5. 엔진 선택(DRY_PLAN — 브라우저를 띄우지 않고 고른 옵션만 본다) ──
  // 로컬·CI 에 파이어폭스가 없어도 '파이어폭스에 크롬 흉내를 넣지 않는다'는 규칙은 지킬 수 있다.
  {
    const L = "엔진 선택";
    setBrands([["Juliet", ["tops"]]]);
    const ff = await plan({ ENGINE: "firefox" });
    const p = ff.plan;
    if (ff.code !== 0 || !p) fail(`[${L}] ENGINE=firefox 계획을 못 받았다(종료 ${ff.code}) ${ff.out.slice(-300)}`);
    else {
      const t = p.targets.find((x) => x.brand === "Juliet");
      if (!t || t.engine !== "firefox") fail(`[${L}] ENGINE=firefox 인데 대상 엔진이 ${t && t.engine}`);
      const fo = p.options.firefox;
      if (fo.context.userAgent) fail(`[${L}] 파이어폭스에 user-agent 를 덮어쓴다: ${fo.context.userAgent}`);
      if (fo.launch.args && fo.launch.args.length) fail(`[${L}] 파이어폭스에 크롬 전용 실행 인자를 넣는다: ${fo.launch.args}`);
      if (fo.hideWebdriver) fail(`[${L}] 파이어폭스에 webdriver 감추기 스크립트를 넣는다`);
      if (fo.context.locale !== "en-US" || fo.context.timezoneId !== "America/New_York" || !fo.context.viewport) fail(`[${L}] 파이어폭스 언어·시간대·창 크기가 크롬과 다르다: ${JSON.stringify(fo.context)}`);
      const co = p.options.chromium;
      if (!/Chrome\//.test(co.context.userAgent || "") || !(co.launch.args || []).includes("--disable-http2")) fail(`[${L}] 크롬 옵션이 바뀌었다: ${JSON.stringify(co)}`);
      if (t && t.engine === "firefox" && !fo.context.userAgent && !(fo.launch.args || []).length) ok("ENGINE=firefox — 파이어폭스는 크롬 UA·인자 없이 언어·시간대·창 크기만 맞춘다");
    }
    const df = await plan({});
    const dt = df.plan && df.plan.targets.find((x) => x.brand === "Juliet");
    if (!dt || dt.engine !== "chromium") fail(`[${L}] ENGINE 을 비우면 chromium 이어야 한다: ${dt && dt.engine}`);
    else ok("ENGINE 을 비우면 chromium");
    const up = await plan({ ENGINE: "FireFox" });
    if (!up.plan || up.plan.targets[0].engine !== "firefox") fail(`[${L}] ENGINE 대소문자를 무시하지 않는다`);
    const badEng = await plan({ ENGINE: "webkit" });
    if (badEng.code !== 2 || badEng.plan) fail(`[${L}] 모르는 엔진(webkit)을 거부하지 않는다(종료 ${badEng.code})`);
    else ok("모르는 엔진 이름은 종료 코드 2로 거부");
  }

  // ── 6. 추가 브랜드 파일(browser-extra-brands.json) ──
  // Render browser 그룹엔 없지만 여기서도 모을 브랜드. 서버 프리페치가 채우던 카탈로그라
  // 약한 밤에 덮지 않도록 저장 조건이 더 엄격하다.
  {
    const L = "추가 브랜드";
    setBrands([["Alpha", ["tops"]]]);
    // 그룹 밖 브랜드(카테고리 링크·브랜드 목록에는 있다)
    const other = (name, cats) => {
      if (cats.length) config.links[name] = { tops: cats.map((c) => `${BASE}/${name.toLowerCase()}/c/${c}`) };
      config.brands.push({ name, url: `${BASE}/${name.toLowerCase()}` });
    };
    const four = ["tops", "shirts", "dresses", "pants"];
    other("Kilo", four); other("November", four); other("Oscar", ["tops"]); other("Lima", []); other("Papa", []);
    const dir = mkdtempSync(join(tmpdir(), "bc-extra-"));
    const file = join(dir, "extra.json");
    writeFileSync(file, JSON.stringify({ brands: [
      { brand: "kilo", engine: "firefox" },                       // 이름 대소문자가 달라도 찾는다
      { brand: "Alpha", engine: "firefox", fresh: true },         // Render 그룹과 중복 → 엔진·새 창만 바꿈
      { brand: "Lima", engine: "firefox" },                       // 카테고리 URL 없음 → 건너뜀
      { brand: "Papa", engine: "firefox", urls: [`${BASE}/papa/c/tops`] },   // URL 직접 지정
      { brand: "November", engine: "firefox" },
      { brand: "Oscar", engine: "firefox" },
      { brand: "Quebec", engine: "safari" },                      // 모르는 엔진 → 건너뜀
    ] }));
    const { plan: p, code } = await plan({ EXTRA_BRANDS_FILE: file });
    if (code !== 0 || !p) fail(`[${L}] 계획을 못 받았다`);
    else {
      const t = (b) => p.targets.find((x) => x.brand === b);
      const names = p.targets.map((x) => x.brand).sort().join(",");
      if (names !== "Alpha,Kilo,November,Oscar,Papa") fail(`[${L}] 대상이 예상과 다르다: ${names}`);
      if (!t("Kilo") || t("Kilo").engine !== "firefox" || t("Kilo").source !== "extra" || t("Kilo").urls.length !== 4) fail(`[${L}] Kilo: ${JSON.stringify(t("Kilo"))}`);
      else ok("추가 브랜드는 category-links.json 의 URL 로, 적힌 엔진(firefox)으로 대상에 들어간다");
      if (!t("Alpha") || t("Alpha").engine !== "firefox" || t("Alpha").source !== "extra-override" || !t("Alpha").fresh ||
          p.targets.filter((x) => x.brand === "Alpha").length !== 1) fail(`[${L}] 겹치는 Alpha 가 한 번만, 바뀐 엔진·새 창으로 돌지 않는다: ${JSON.stringify(p.targets.filter((x) => x.brand === "Alpha"))}`);
      else if (!p.extraNotes.some((n) => /^Alpha: Render browser 그룹 브랜드 — 엔진 firefox · 새 창/.test(n))) fail(`[${L}] 엔진 변경 안내가 없다: ${p.extraNotes}`);
      else ok("Render 그룹과 겹치는 추가 항목은 새로 더하지 않고 그 브랜드의 엔진·새 창만 바꾼다 · 안내를 남긴다");
      if (t("Lima") || !p.extraNotes.some((n) => /^Lima: 카테고리 URL 이 없어 건너뜀/.test(n))) fail(`[${L}] URL 없는 Lima 처리: ${p.extraNotes}`);
      else ok("카테고리 URL 이 없는 추가 브랜드는 건너뛰고 안내를 남긴다");
      if (!t("Papa") || t("Papa").urls[0] !== `${BASE}/papa/c/tops`) fail(`[${L}] 직접 지정한 URL 을 안 쓴다: ${JSON.stringify(t("Papa"))}`);
      if (!p.extraNotes.some((n) => /^Quebec: 모르는 엔진/.test(n))) fail(`[${L}] 모르는 엔진 안내가 없다`);
    }
    // GROUP=extension(확장 담당 재조사)에는 섞지 않는다
    const pe = await plan({ EXTRA_BRANDS_FILE: file, GROUP: "extension" });
    // (가짜 Render 의 확장 그룹은 비어 있어 대상 0개로 끝나야 한다 — 추가 브랜드가 섞이면 계획이 나온다)
    if (pe.plan ? pe.plan.targets.some((x) => x.source === "extra") : !/no targets/.test(pe.out)) fail(`[${L}] GROUP=extension 에 추가 브랜드가 섞였다: ${pe.out.slice(-200)}`);
    else ok("GROUP=extension(확장 담당 재조사)에는 추가 브랜드를 섞지 않는다");
    // BRANDS 로 고르면 추가 브랜드의 엔진을 따른다 · ENGINE 을 주면 그게 이긴다
    const pb = await plan({ EXTRA_BRANDS_FILE: file, BRANDS: "Kilo" });
    const kb = pb.plan && pb.plan.targets.find((x) => x.brand === "Kilo");
    if (!kb || kb.engine !== "firefox" || pb.plan.targets.length !== 1) fail(`[${L}] BRANDS=Kilo: ${JSON.stringify(pb.plan && pb.plan.targets)}`);
    const pc = await plan({ EXTRA_BRANDS_FILE: file, BRANDS: "Kilo", ENGINE: "chromium" });
    const kc = pc.plan && pc.plan.targets.find((x) => x.brand === "Kilo");
    if (!kc || kc.engine !== "chromium") fail(`[${L}] ENGINE=chromium 이 추가 브랜드 엔진을 못 덮는다: ${kc && kc.engine}`);
    else ok("BRANDS 로 골라도 추가 브랜드 엔진을 따르고, ENGINE 을 주면 그게 이긴다");

    // 저장 조건(여기엔 파이어폭스가 없어 ENGINE=chromium 으로 돌린다 — 조건은 엔진과 무관하다)
    writeFileSync(file, JSON.stringify({ brands: ["Kilo", "November", "Oscar"].map((brand) => ({ brand, engine: "firefox" })) }));
    state.catalogs = [
      { site: "localhost.kilo", count: 30 },        // 24개 ≥ 30의 절반 → 저장
      { site: "localhost.november", count: 100 },   // 24개 < 100의 절반 → 저장 안 함
    ];
    const r1 = await collect(L + " 저장", { EXTRA_BRANDS_FILE: file, ENGINE: "chromium" });
    const st = r1.stores.map((x) => x.brand).sort().join(",");
    if (st !== "Alpha,Kilo") fail(`[${L}] 저장된 브랜드가 Alpha,Kilo 가 아니다: ${st}`);
    else ok("추가 브랜드: 기준을 넘은 Kilo(24개, 저장본 30) 만 저장 · Render 그룹 Alpha 는 평소대로");
    const rn = res(r1.json, "November"), ro = res(r1.json, "Oscar"), rk = res(r1.json, "Kilo");
    if (!rn || rn.collected !== 24 || !/저장본 100개의 절반 미만/.test(rn.storeErr)) fail(`[${L}] November: ${JSON.stringify(rn && { c: rn.collected, e: rn.storeErr })}`);
    else ok("지금 저장본의 절반 미만이면 저장하지 않는다(November 24 < 100/2)");
    if (!ro || ro.collected !== 6 || !/최소 20개 미달/.test(ro.storeErr)) fail(`[${L}] Oscar: ${JSON.stringify(ro && { c: ro.collected, e: ro.storeErr })}`);
    else ok("추가 브랜드는 20개 미만이면 저장하지 않는다(Oscar 6개 — 일반 브랜드 기준 5개보다 엄격)");
    if (!rk || rk.engineSource !== "extra") fail(`[${L}] 리포트에 추가 브랜드 표시(engineSource=extra)가 없다`);
    // 저장 개수를 모르면 보내지 않는다
    writeFileSync(file, JSON.stringify({ brands: [{ brand: "Kilo", engine: "firefox" }] }));   // 시간을 줄이려 Kilo 만
    state.catalogsFail = true;
    const r2 = await collect(L + " 개수 확인 실패", { EXTRA_BRANDS_FILE: file, ENGINE: "chromium" });
    state.catalogsFail = false;
    const st2 = r2.stores.map((x) => x.brand).sort().join(",");
    const rk2 = res(r2.json, "Kilo");
    if (st2 !== "Alpha" || !rk2 || !/저장된 개수를 확인 못 함/.test(rk2.storeErr)) fail(`[${L}] 개수 확인 실패 때 저장: ${st2} · ${rk2 && rk2.storeErr}`);
    else ok("저장된 개수를 확인 못 하면 추가 브랜드는 저장하지 않는다(Render 그룹은 평소대로)");
    rmSync(dir, { recursive: true, force: true });
  }

  // ── 7. impit 엔진 · 브랜드별 새 창 · 합치기 저장 ──
  // impit: HTML 만 크롬 TLS 지문 fetch 로 받고, 크롬 창은 사이트에 직접 접속하지 않는다(이미지도 안 받음).
  {
    const L = "impit·새 창·합치기";
    let hasImpit = true;
    try { await import("impit"); } catch (e) { hasImpit = false; }
    if (!hasImpit) fail(`[${L}] impit 패키지가 없다 — npm i --no-save impit@0.14.9`);
    else {
      setBrands([["Romeo", ["tops"]]]);
      config.links.Sierra = { tops: ["tops", "shirts", "pants", "dresses"].map((c) => `${BASE}/sierra/c/${c}`) };
      config.brands.push({ name: "Sierra", url: `${BASE}/sierra` });
      const dir = mkdtempSync(join(tmpdir(), "bc-impit-"));
      const file = join(dir, "extra.json");
      writeFileSync(file, JSON.stringify({ brands: [
        { brand: "Sierra", engine: "impit", fresh: true, store: "merge" },
        { brand: "Romeo", engine: "impit" },   // Render 그룹 브랜드를 impit 으로
      ] }));
      state.catalogs = [{ site: "localhost.sierra", count: 30 }, { site: "localhost.romeo", count: 0 }];
      state.imgHits = 0;
      const r = await collect(L, { EXTRA_BRANDS_FILE: file, ENGINE: "" });
      const rs = res(r.json, "Sierra"), rr = res(r.json, "Romeo");
      if (!rs || rs.collected !== 24 || rs.engine !== "impit" || !rs.fresh || rs.storeMode !== "merge") fail(`[${L}] Sierra: ${JSON.stringify(rs && { c: rs.collected, e: rs.engine, f: rs.fresh, m: rs.storeMode, p: rs.perUrl })}`);
      else ok("impit 엔진 — HTML 만 받아 같은 수집기로 4개 카테고리 24개를 모은다(새 창 · 리포트에 엔진 적힘)");
      const ss = r.stores.find((x) => x.brand === "Sierra");
      if (!ss || /replace=1/.test(ss.query)) fail(`[${L}] store:"merge" 인데 통째 교체로 저장했다: ${JSON.stringify(ss)}`);
      else ok("store:\"merge\" 브랜드는 replace=1 없이(합치기) 저장한다");
      if (!rr || rr.collected !== 6 || rr.engine !== "impit") fail(`[${L}] Romeo(Render 그룹 → impit): ${JSON.stringify(rr && { c: rr.collected, e: rr.engine })}`);
      if (state.imgHits) fail(`[${L}] impit 브랜드인데 크롬 창이 사이트에 이미지를 요청했다(${state.imgHits}번)`);
      else ok("impit 엔진의 크롬 창은 사이트에 직접 요청하지 않는다(이미지 요청 0)");
      const sm = (rs && rs.perUrl[0] && rs.perUrl[0].sample) || [];
      if (sm.length !== 3 || !/^http:\/\/localhost:\d+\/sierra\/products\//.test(sm[0].productUrl)) fail(`[${L}] URL 별 표본 3개가 없다: ${JSON.stringify(sm)}`);
      else ok("리포트에 URL 마다 표본 3개(이름·주소)를 남긴다");
      rmSync(dir, { recursive: true, force: true });
    }
  }
} finally {
  srv.close();
}

if (bad) { console.error(`\n헤드리스 수집 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ 헤드리스 수집 통과 — 평소 저장 · 설정 실패 대체 · 마감(미룸/중단·저장 안 함) · STORE=0 · 엔진 선택");
