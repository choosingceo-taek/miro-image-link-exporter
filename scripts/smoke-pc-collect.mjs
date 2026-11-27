#!/usr/bin/env node
// PC 수집(scripts/pc-collect.mjs)을 가짜 Render·가짜 Worker·가짜 쇼핑몰(이 PC 의 localhost)에 붙여
// PC 러너와 같은 설정(설치된 구글 크롬 channel "chrome" · 창 띄우기 · 있는 그대로 · 정중한 접속 · 쓰기 예산)으로
// 끝까지 돌린다. 진짜 쇼핑몰·Render·Worker 에는 접속하지 않는다.
//
//   npm i --no-save playwright@1.49.1      (크롬은 PC 에 설치된 구글 크롬을 쓴다)
//   xvfb-run -a node scripts/smoke-pc-collect.mjs     (리눅스 · 화면이 있는 PC 는 그냥 node)
//
// 보는 것:
//   1. 평소 실행 — 계획(엔진·새 창·최근 저장 건너뛰기) · 목록 저장은 브랜드당 1번 · 보강 저장은 종류·브랜드당 1번 ·
//      쓰기 수가 리포트와 맞음 · 같은 주소 3번 이하 · 같은 호스트 1초 간격 · 429 받은 호스트는 더 안 감 ·
//      새 창(쿠키 없음) · 진짜 크롬 user-agent(덮어쓰기 없음) · webdriver 를 숨기지 않음 · 리포트·측정 기록
//   2. 측정 실행(report_tag) + store=1 → 시작 전에 멈춤(쇼핑몰 접속 0)
//   3. store=0 → Worker 에 쓰기 0 · 측정 기록 그대로
//   4. 쓰기 한도 — 같은 브랜드 두 번 · 예산 초과는 보내기 전에 막힘(훅만 · 브라우저 없음)
//   5. 아침 리포트에 'PC 잡' 절이 붙음
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (c, m) => { if (c) console.log("  ✅ " + m); else fail(m); };

// ── 가짜 서버: 경로·호스트로 Render·Worker·쇼핑몰 둘(localhost · 127.0.0.1)을 나눈다 ──
const S = { posts: [], hits: [], beacons: [], catalogs: new Map(), overlays: new Map() };
const card = (slug, cat, i) => `<li class="product-card"><a href="/${slug}/products/${slug}-${cat}-${i}">` +
  `<img src="/img/${slug}-${cat}-${i}.jpg" width="600" height="800" alt="${slug} ${cat} Tee ${i}"></a>` +
  `<h3 class="product-name">${slug} ${cat} Tee ${i}</h3><span class="price">$48.00</span></li>`;
const BEACON = `<script>fetch("/beacon?wd=" + navigator.webdriver + "&tz=" + encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)).catch(() => {});</script>`;
const listing = (slug, cat, n) => `<!doctype html><html><head><title>${slug} ${cat}</title></head><body><h1>${slug} ${cat}</h1>` +
  `<ul class="grid">${Array.from({ length: n }, (_, i) => card(slug, cat, i + 1)).join("")}</ul>${BEACON}</body></html>`;
const product = (slug, name) => `<!doctype html><html><head><title>${name}</title></head><body><h1>${name}</h1>` +
  `<div class="detail">Composition: 60% Cotton, 40% Polyester</div><div class="color">Color: Navy</div>${BEACON}</body></html>`;
let config;
const srv = createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const host = String(req.headers.host || "");
  const p = u.pathname;
  const j = (o, code = 200) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
  if (p.startsWith("/render/")) {
    if (p === "/render/blocked-brands.json") return j({ browser: ["Zulu"], brands: config.brands.map((b) => b.name) });
    if (p === "/render/category-links.json") return j(config.links);
    if (p === "/render/brands.json") return j(config.brands);
    return j({}, 404);
  }
  if (p === "/worker/" || p === "/worker") {
    const q = u.searchParams;
    if (req.method === "POST") {
      let b = ""; req.on("data", (d) => (b += d));
      return req.on("end", () => {
        let body = {};
        try { body = JSON.parse(b); } catch (e) {}
        const kind = q.get("store"), site = q.get("site") || body.site || "";
        S.posts.push({ kind, site, query: u.search });
        if (kind === "catalog") S.catalogs.set(body.site, { brand: body.brand, items: body.items, updated: Date.now() });
        if (kind === "overlay") S.overlays.set(site, body);
        j({ ok: true, count: (body.items || []).length });
      });
    }
    if (q.get("catalogs")) return j({ ok: true, list: [...S.catalogs].map(([site, c]) => ({ site, brand: c.brand, count: c.items.length, updated: c.updated })) });
    if (q.get("catalog")) { const c = S.catalogs.get(q.get("catalog")); return j(c ? { brand: c.brand, items: c.items } : { items: [] }); }
    if (q.get("comps")) return j(S.overlays.get(q.get("comps")) || {});
    if (q.get("details")) return j({});
    return j({ error: "unknown" }, 400);
  }
  if (p === "/beacon") { S.beacons.push({ wd: u.searchParams.get("wd"), tz: u.searchParams.get("tz") }); res.writeHead(204); return res.end(); }
  if (p.startsWith("/img/") || p === "/favicon.ico") { res.writeHead(404); return res.end(); }
  S.hits.push({ host, path: p, at: Date.now(), ua: String(req.headers["user-agent"] || ""), cookie: String(req.headers.cookie || "") });
  let m = p.match(/^\/([a-z]+)\/c\/([a-z]+)$/);
  if (m) {
    if (m[1] === "charlie" && m[2] === "tops") { res.writeHead(429, { "Content-Type": "text/html" }); return res.end("<h1>Too Many Requests</h1>"); }
    res.writeHead(200, { "Content-Type": "text/html", "Set-Cookie": "botcheck=seen; Path=/" });
    return res.end(listing(m[1], m[2], 25));
  }
  m = p.match(/^\/([a-z]+)\/products\/([a-z0-9-]+)$/);
  if (m) { res.writeHead(200, { "Content-Type": "text/html" }); return res.end(product(m[1], m[2].replace(/-/g, " "))); }
  res.writeHead(404); res.end("not found");
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const PORT = srv.address().port;
const LH = `http://localhost:${PORT}`, IP = `http://127.0.0.1:${PORT}`;

// 브랜드: Alpha(크롬 · 기록에 '첫 카테고리만' → 새 창 · 카테고리 2) · Bravo(데이터센터에서 파이어폭스만 열림 → 파이어폭스,
// 이 PC 에 없으면 크롬) · Charlie(다른 호스트 · 첫 카테고리가 429 → 그 호스트 멈춤) · Delta(목록이 방금 저장됨 → 목록 건너뜀)
config = {
  brands: [
    { name: "Alpha", url: `${LH}/alpha` }, { name: "Bravo", url: `${LH}/bravo` },
    { name: "Charlie", url: `${IP}/charlie` }, { name: "Delta", url: `${LH}/delta` },
  ],
  links: {
    Alpha: { tops: [`${LH}/alpha/c/tops`], shirts: [`${LH}/alpha/c/shirts`] },
    Bravo: { tops: [`${LH}/bravo/c/tops`] },
    Charlie: { tops: [`${IP}/charlie/c/tops`], shirts: [`${IP}/charlie/c/shirts`] },
    Delta: { tops: [`${LH}/delta/c/tops`] },
  },
};
const deltaItems = Array.from({ length: 30 }, (_, i) => ({ name: `delta tops Tee ${i + 1}`, productUrl: `${LH}/delta/products/delta-tops-${i + 1}`, imageUrl: `${LH}/img/d${i}.jpg`, category: "tops" }));
const alphaOld = Array.from({ length: 10 }, (_, i) => ({ name: `alpha old ${i}`, productUrl: `${LH}/alpha/products/alpha-old-${i}`, imageUrl: `${LH}/img/a${i}.jpg`, category: "tops" }));
const resetWorker = () => {
  S.posts = []; S.hits = []; S.beacons = []; S.overlays = new Map();
  S.catalogs = new Map([
    ["localhost.delta", { brand: "Delta", items: deltaItems, updated: Date.now() - 3_600_000 }],
    ["localhost.alpha", { brand: "Alpha", items: alphaOld, updated: Date.now() - 3 * 86_400_000 }],
  ]);
};
const meas = (pw, ff, fr) => ({ playwright: { ok: pw[0], n: pw[1] }, firefox: { ok: ff[0], n: ff[1] }, "firefox-fresh": { ok: fr[0], n: fr[1] } });
const TMP = mkdtempSync(join(tmpdir(), "pc-smoke-"));
const accessMap = join(TMP, "access-map.json");
writeFileSync(accessMap, JSON.stringify({ brands: [
  { brand: "Alpha", group: "extension", listing: { status: "home-only", cause: "Akamai — 첫 카테고리만 열리고 나머지 403", measured: meas([0, 6], [1, 6], [0, 3]) }, product: { status: "blocked", measured: meas([0, 6], [0, 6], [0, 3]) }, comp: { pct: 0 } },
  { brand: "Bravo", group: "extension", listing: { status: "home-only", cause: "크롬만 403", measured: meas([0, 6], [6, 6], [3, 3]) }, product: { status: "home-only", measured: meas([0, 6], [0, 6], [0, 3]) }, comp: { pct: 10 } },
  { brand: "Charlie", group: "extension", listing: { status: "home-only", measured: meas([0, 6], [0, 6], [0, 3]) }, product: { status: "home-only" } },
  { brand: "Delta", group: "extension", listing: { status: "home-only", measured: meas([0, 6], [0, 6], [0, 3]) }, product: { status: "partial" } },
] }));
const pcBrands = join(TMP, "pc-brands.json");
writeFileSync(pcBrands, JSON.stringify({ overrides: {}, add: [] }));

async function pc(label, env) {
  const dir = mkdtempSync(join(TMP, "run-"));
  const run = spawn(process.execPath, [join(ROOT, "scripts/pc-collect.mjs")], {
    env: {
      ...process.env,
      RENDER_URL: `${LH}/render`, WORKER_URL: `${LH}/worker`, WORKER_TOKEN: "test",
      REPORT_DIR: dir, PC_WORK_DIR: join(dir, "work"), PC_STATE_FILE: join(dir, "state.json"), PC_ENRICH_STATE: join(dir, "enrich-state.json"),
      PC_ACCESS_MAP: accessMap, PC_BRANDS_FILE: pcBrands,
      STORE: "1", BRANDS: "", STEPS: "", REPORT_TAG: "", MEASURE_TAG: "",
      MAX_PAGES: "1", PER_BRAND: "3", COLOR_PER_BRAND: "3", COLLECT_MIN: "10", COMP_MIN: "10", COMP_BRAND_MIN: "3", COLOR_MIN: "5",
      PC_WRITE_BUDGET: "120", PC_FRESH_HOURS: "20", CONFIG_RETRY_MS: "50",
      NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1",
      ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  run.stdout.on("data", (d) => { out += d; });
  run.stderr.on("data", (d) => { out += d; });
  const t0 = Date.now();
  const code = await new Promise((r) => run.on("close", r));
  console.log(`\n[${label}] 종료 ${code} · ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  const tag = env.REPORT_TAG ? `pc-collect-${env.REPORT_TAG}` : "pc-collect-report";
  const json = existsSync(join(dir, tag + ".json")) ? JSON.parse(readFileSync(join(dir, tag + ".json"), "utf8")) : null;
  const md = existsSync(join(dir, tag + ".md")) ? readFileSync(join(dir, tag + ".md"), "utf8") : "";
  const state = existsSync(join(dir, "state.json")) ? JSON.parse(readFileSync(join(dir, "state.json"), "utf8")) : null;
  return { code, out, json, md, state, dir };
}

try {
  // ── 1. 평소 실행 ──
  {
    const L = "평소";
    resetWorker();
    const { code, out, json, md, state, dir } = await pc(L, {});
    if (code !== 0) console.error(out.slice(-3000));
    ok(code === 0 && json && md, `[${L}] 끝까지 돌고 리포트(json·md)를 썼다`);
    const plan = (json && json.plan) || { collect: [], enrich: [], skipped: [] };
    const pl = (b) => plan.collect.find((x) => x.brand === b);
    const ffHere = !!(json && json.browsers && /^\d/.test(String(json.browsers.firefox || "")));
    ok(pl("Alpha") && pl("Alpha").engine === "chrome" && pl("Alpha").fresh, `[${L}] Alpha → 크롬 · 새 창(기록에 '첫 카테고리만')`);
    ok(pl("Bravo") && pl("Bravo").engine === (ffHere ? "firefox" : "chrome"),
      `[${L}] Bravo → ${ffHere ? "파이어폭스" : "크롬(이 PC 에 파이어폭스가 없어 바꿈)"}: ${pl("Bravo") && pl("Bravo").why}`);
    ok(!pl("Delta") && plan.skipped.some((s) => s.brand === "Delta" && /시간 전에 저장됨/.test(s.why)), `[${L}] Delta 는 목록이 방금 저장돼 목록 수집을 건너뜀`);
    ok(plan.enrich.some((x) => x.brand === "Delta"), `[${L}] Delta 도 상품 페이지 보강은 한다`);
    const launches = (json && json.launches) || [];
    ok(launches.length && launches.every((l) => l.engine !== "chromium" || l.channel === "chrome"), `[${L}] 크로미움 브랜드는 설치된 구글 크롬(channel chrome)으로 띄움 (${launches.length}번)`);
    const headed = launches.filter((l) => !l.headless).length;
    if (process.env.DISPLAY) ok(headed === launches.length, `[${L}] 화면이 있으면 창을 띄움(${headed}/${launches.length})`);
    else ok(launches.every((l) => l.headless && /창을 못 띄워/.test(l.note || "")), `[${L}] 화면이 없으면 같은 크롬을 창 없이 다시 엶(리포트에 적힘)`);
    // 저장 요청
    const per = {};
    for (const p of S.posts) per[`${p.kind}|${p.site}`] = (per[`${p.kind}|${p.site}`] || 0) + 1;
    ok(Object.values(per).every((n) => n === 1), `[${L}] 저장 요청은 종류·브랜드마다 한 번씩(${JSON.stringify(per)})`);
    const cats = S.posts.filter((p) => p.kind === "catalog").map((p) => p.site).sort().join(",");
    ok(cats === "localhost.alpha,localhost.bravo", `[${L}] 목록 저장 = Alpha·Bravo 한 번씩(Charlie 는 0개·Delta 는 건너뜀): ${cats}`);
    ok(json && json.writes.used === S.posts.length && S.posts.length <= 120, `[${L}] 리포트의 쓰기 수(${json && json.writes.used})가 실제 저장 요청 수(${S.posts.length})와 같다`);
    ok(/저장 요청 \d+\/120번/.test(md), `[${L}] 리포트 첫머리에 쓰기 수/예산`);
    // 정중한 접속
    const byPath = {};
    for (const h of S.hits) byPath[h.host + h.path] = (byPath[h.host + h.path] || 0) + 1;
    ok(Object.values(byPath).every((n) => n <= 3), `[${L}] 같은 주소는 3번 이하(최대 ${Math.max(...Object.values(byPath))})`);
    let minGap = Infinity;
    for (const host of new Set(S.hits.map((h) => h.host))) {
      const t = S.hits.filter((h) => h.host === host).map((h) => h.at).sort((a, b) => a - b);
      for (let i = 1; i < t.length; i++) minGap = Math.min(minGap, t[i] - t[i - 1]);
    }
    ok(minGap >= 950, `[${L}] 같은 호스트 요청 사이 최소 ${minGap}ms(1초 이상 — 시계 오차 50ms 허용)`);
    ok(S.hits.some((h) => h.path === "/charlie/c/tops") && !S.hits.some((h) => h.host.startsWith("127.0.0.1") && h.path !== "/charlie/c/tops"),
      `[${L}] 429 를 준 호스트(127.0.0.1)에는 그 뒤로 아무 요청도 안 감`);
    ok(json && Object.keys(json.polite.stopped).some((h) => h.startsWith("127.0.0.1")), `[${L}] 리포트에 429 로 멈춘 사이트가 적힘`);
    // 새 창
    const shirts = S.hits.find((h) => h.path === "/alpha/c/shirts");
    ok(shirts && !/botcheck/.test(shirts.cookie), `[${L}] Alpha 의 두 번째 카테고리는 쿠키 없는 새 창으로 열림`);
    // 있는 그대로의 브라우저
    const uas = [...new Set(S.hits.filter((h) => h.host.startsWith("localhost")).map((h) => h.ua))];
    const major = String((launches.find((l) => l.engine === "chromium") || {}).version || "").split(".")[0];
    ok(uas.length && major && uas.every((a) => a.includes(`Chrome/${major}.`) || /Firefox\//.test(a) || /compatible; market-research-pc-collector/.test(a)),
      `[${L}] user-agent 를 덮어쓰지 않음 — 브라우저는 자기 판(Chrome/${major}), fetch 는 자기 이름: ${uas.map((a) => (a.match(/(Headless)?Chrome\/[\d.]+|Firefox\/[\d.]+|compatible; [\w-]+/) || [a.slice(0, 40)])[0]).join(" · ")}`);
    if (headed) ok(uas.every((a) => !/HeadlessChrome/.test(a)), `[${L}] 창을 띄우면 user-agent 에 HeadlessChrome 이 없음`);
    ok(S.beacons.length && S.beacons.every((b) => b.wd === "true"), `[${L}] navigator.webdriver 를 숨기지 않음(자동화임을 그대로 드러냄 · ${S.beacons.length}페이지)`);
    const tzHere = Intl.DateTimeFormat().resolvedOptions().timeZone;
    ok(S.beacons.every((b) => b.tz === tzHere), `[${L}] 시간대를 덮어쓰지 않음(이 PC 시간대 ${tzHere})`);
    // 보강
    ok(json && json.comp.some((r) => r.brand === "Alpha" && r.ok > 0), `[${L}] 혼용률 보강이 Alpha 상품 페이지를 읽음`);
    ok(S.posts.some((p) => p.kind === "overlay" && p.site === "localhost.alpha"), `[${L}] 혼용률을 오버레이로 저장`);
    ok(json && json.colorBrands.includes("Alpha") && !json.colorBrands.includes("Charlie"), `[${L}] 컬러 보강은 상품 페이지가 읽힌 브랜드만(${json && json.colorBrands.join(",")})`);
    ok(!existsSync(join(ROOT, "enrich-browser-dry-pc-comp.md")) && !existsSync(join(ROOT, "enrich-comp-dry-pc-color.md")), `[${L}] 보강 스크립트 리포트가 저장소 루트에 남지 않음`);
    // 측정 기록
    const st = state && state.brands;
    ok(st && st.alpha && st.alpha.collect && st.alpha.collect.chrome && st.alpha.collect.chrome.lastVerdict === "ok", `[${L}] 측정 기록: Alpha 크롬 ok`);
    ok(st && st.charlie && st.charlie.collect.chrome.fails === 1, `[${L}] 측정 기록: Charlie 크롬 막힘 1번`);
    // 아침 리포트
    writeFileSync(join(dir, "browser-collect-report.md"), "# 헤드리스 브라우저 수집 테스트\n\n- **Nike** — 500개\n");
    writeFileSync(join(dir, "browser-collect-report.json"), JSON.stringify({ when: new Date().toISOString() }));
    const c = spawn(process.execPath, [join(ROOT, "scripts/combine-collect-reports.mjs")], { env: { ...process.env, REPORT_DIR: dir }, stdio: "ignore" });
    await new Promise((r) => c.on("close", r));
    const morning = readFileSync(join(dir, "browser-collect-report.md"), "utf8");
    ok(/## PC 잡/.test(morning) && /✅ 오늘 결과 — PC 잡/.test(morning) && /Alpha/.test(morning.split("## PC 잡")[1] || ""), "아침 리포트에 PC 잡 절이 ✅ 로 붙음");
  }

  // ── 2. 측정 실행 + store=1 → 멈춤 ──
  {
    const L = "측정 + store=1";
    resetWorker();
    const { code, out } = await pc(L, { REPORT_TAG: "m-1", MEASURE_TAG: "m", STORE: "1" });
    ok(code === 1 && /store=0 으로만/.test(out) && !S.hits.length && !S.posts.length, `[${L}] 시작 전에 멈춤(쇼핑몰 ${S.hits.length} · 저장 ${S.posts.length})`);
  }

  // ── 3. store=0 측정 실행 → 쓰기 0, 측정 기록 그대로 ──
  {
    const L = "측정 + store=0";
    resetWorker();
    const { code, json, state, out } = await pc(L, { REPORT_TAG: "m-2", MEASURE_TAG: "m", STORE: "0", STEPS: "collect,comp" });
    if (code !== 0) console.error(out.slice(-2000));
    ok(code === 0 && json && json.tag === "m-2", `[${L}] 리포트를 pc-collect-m-2.* 로 따로 씀`);
    ok(!S.posts.length, `[${L}] Worker 에 쓰기 0(${S.posts.length})`);
    ok(S.hits.length > 0, `[${L}] 읽기는 함(쇼핑몰 요청 ${S.hits.length})`);
    ok(!state, `[${L}] PC 측정 기록 파일을 만들지 않음`);
  }

  // ── 4. 쓰기 한도(훅만) ──
  {
    const L = "쓰기 한도";
    resetWorker();
    const runFile = join(TMP, "hook-run.json");
    const code = `
      const W = process.env.WORKER_URL;
      const post = (q, body) => fetch(W + "/?" + q, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(() => "sent").catch((e) => "refused: " + e.message);
      const r = [];
      r.push(await post("store=catalog&replace=1", { site: "x.alpha", brand: "Alpha", items: [] }));
      r.push(await post("store=catalog&replace=1", { site: "x.alpha", brand: "Alpha", items: [] }));
      r.push(await post("store=overlay&site=x.alpha", {}));
      r.push(await post("store=overlay&site=x.bravo", {}));
      console.log(JSON.stringify(r));`;
    const p = spawn(process.execPath, ["--import", pathToFileURL(join(ROOT, "scripts/pc-browser-hooks.mjs")).href, "--input-type=module", "-e", code], {
      env: { ...process.env, WORKER_URL: `${LH}/worker`, PC_RUN_FILE: runFile, PC_WRITE_BUDGET: "2", PC_STEP: "test", NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let o = "";
    p.stdout.on("data", (d) => { o += d; });
    p.stderr.on("data", (d) => { o += d; });
    await new Promise((r) => p.on("close", r));
    const line = (o.match(/^\[.*\]$/m) || ["[]"])[0];
    const r = JSON.parse(line);
    ok(r[0] === "sent" && /한 번만/.test(r[1] || "") && r[2] === "sent" && /예산/.test(r[3] || ""), `[${L}] 같은 브랜드 두 번째·예산 초과는 보내기 전에 막음: ${line}`);
    ok(S.posts.length === 2, `[${L}] 서버에 닿은 저장 요청 2번(예산 2)`);
    const rf = JSON.parse(readFileSync(runFile, "utf8"));
    ok(rf.writes.used === 2 && rf.writes.log.length === 4, `[${L}] 상태 파일에 쓰기 4건(보냄 2 · 막음 2) 기록`);
  }
} finally {
  srv.close();
  rmSync(TMP, { recursive: true, force: true });
}

if (bad) { console.error(`\nPC 수집 연기 테스트 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ PC 수집 연기 테스트 통과 — 진짜 크롬 · 있는 그대로 · 정중한 접속 · 쓰기 예산 · 리포트");
