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
const state = { stores: [], slow: {}, hits: {} };
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
    return j({ error: "unknown" }, 400);
  }
  if (p.startsWith("/img/")) { res.writeHead(404); return res.end(); }
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

  // ── 5. 엔진 선택(DRY_PLAN — 브라우저를 띄우지 않고 고른 옵션만 본다) ──
  // 로컬·CI 에 파이어폭스가 없어도 '파이어폭스에 크롬 흉내를 넣지 않는다'는 규칙은 지킬 수 있다.
  {
    const L = "엔진 선택";
    setBrands([["Juliet", ["tops"]]]);
    const plan = async (env) => {
      const run = spawn(process.execPath, [join(ROOT, "scripts/browser-collect.mjs")], {
        env: {
          ...process.env, RENDER_URL: `${BASE}/render`, WORKER_URL: `${BASE}/worker`, GROUP: "browser", BRANDS: "",
          STORE: "0", DRY_PLAN: "1", ENGINE: "", REPORT_DIR: mkdtempSync(join(tmpdir(), "bc-plan-")),
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
    };
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
} finally {
  srv.close();
}

if (bad) { console.error(`\n헤드리스 수집 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ 헤드리스 수집 통과 — 평소 저장 · 설정 실패 대체 · 마감(미룸/중단·저장 안 함) · STORE=0 · 엔진 선택");
