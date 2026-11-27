#!/usr/bin/env node
// KV 쓰기 횟수 — 야간 보강(enrich-comp.mjs)을 KV put 을 세는 가짜 Worker 에 붙여, 바꾸기 전 · 뒤를 나란히 잰다.
//
// 왜: Cloudflare 무료 플랜은 KV put 이 하루 1,000회다. 11/26·11/27 이틀 연속 다 찼고 대부분이 야간 보강이었다
// (실행 한 번 250~530회, 하루 3~6번 — DAILY-AUTOMATION.md '쓰기 예산'). 가짜 세상은 실제 카탈로그처럼 브랜드 134개,
// 브랜드마다 상품 6개(신상 · 재시도 · 상세 채우기 · 매번 다시 열리던 상품 · 막힌 상세 · 다 찬 상품 — fixtures/fake-kv-worker.mjs).
//
// 보는 것:
//   ① 바꾸기 전(fixtures/enrich-comp-before-2026-11-27.mjs): 1·2·3차마다 저장 → 한 실행에 브랜드당 오버레이 3 · 상세 3
//   ② 바꾼 뒤: 브랜드마다 오버레이 1 · 상세 1 · 인덱스 1 이하, 그리고 저장되는 값(혼용률·컬러·상세)은 바꾸기 전과 같다
//   ③ 같은 날 두 번째 자동 실행: 전에는 매번 다시 열리던 상품 때문에 또 수백 번 → 이제 new 방식이라 0
//   ④ 하루 몫 가드: 오늘 장부가 거의 찼으면 오버레이(값이 바뀐 것)부터 보내고 상세·인덱스는 미룬다
//   ⑤ Worker 가 '한도 초과'를 돌려주면 그 뒤로는 보내지 않는다(재시도도 안 한다)
//   ⑥ 실행 도중 다른 잡(크롬 보강·확장)이 같은 브랜드에 쓴 값을 덮지 않는다
//   ⑦ DRY=1: 실제로 보낸 저장 요청 0, '저장했다면'은 ②와 같은 수
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { buildWorld, startKvWorker } from "./fixtures/fake-kv-worker.mjs";
import { ruleVersion } from "./rule-version.mjs";
import { utcDay } from "./kv-budget.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BEFORE = join(ROOT, "scripts/fixtures/enrich-comp-before-2026-11-27.mjs");
const AFTER = join(ROOT, "scripts/enrich-comp.mjs");
const IMPIT_MODULE = join(ROOT, "scripts/fixtures/fake-impit.mjs");
const TMP = mkdtempSync(join(tmpdir(), "kv-writes-"));
const BRANDS = 134;
let bad = 0;
const ok = (name, cond, extra = "") => { if (cond) console.log(`  ✓ ${name}`); else { console.error(`  ❌ ${name}${extra ? " — " + extra : ""}`); bad++; } };

async function run(script, base, env = {}) {
  const p = spawn(process.execPath, [script], {
    env: {
      ...process.env, WORKER_URL: base, WORKER_TOKEN: "test", CATEGORY_LINKS_URL: `${base}/category-links.json`,
      NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1",
      WAYBACK: "0", IMPIT_MODULE, DETAIL_BACKFILL: "1", BRAND_POOL: "8", PAGE_POOL: "8", RETRY_ALL: "", DRY: "", BRANDS: "",
      REPORT_DIR: TMP, KV_LEDGER_DIR: "", ENRICH_MODE: "", GITHUB_RUN_ID: "", ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  p.stdout.on("data", (d) => { out += d; });
  p.stderr.on("data", (d) => { out += d; });
  const code = await new Promise((r) => p.on("close", r));
  if (code !== 0) console.error(out.slice(-3000));
  return { code, out };
}
const fmt = (st) => `put ${st.puts} (overlay ${st.byKind.overlay || 0} · details ${st.byKind.details || 0} · index ${st.byKind.index || 0}) · 요청 ${st.posts}`;
// 저장되는 값만(시도 기록 t·ct·rv·cv·wt·bv · 상세의 읽은 시각 dt 는 뺌) — 바꾸기 전과 뒤가 같은 것을 저장했는지 견준다.
const BOOK = new Set(["t", "ct", "rv", "cv", "wt", "bv", "dt"]);
function values(st, base) {
  const out = {};
  for (const [site, m] of [...Object.entries(st.overlays).map(([s, m]) => ["ov:" + s, m]), ...Object.entries(st.details).map(([s, m]) => ["dt:" + s, m])]) {
    for (const [u, v] of Object.entries(m || {})) {
      const r = {};
      for (const k of Object.keys(v || {}).sort()) if (!BOOK.has(k)) r[k] = v[k];
      out[site + " " + u.replace(base, "")] = JSON.stringify(r);
    }
  }
  return out;
}

const RV = ruleVersion();
const now = Date.now();
const results = {};

// ── ① 바꾸기 전 — 같은 날 두 번(점검 뒤 이어 돌기 · 예약) ──
{
  const f = await startKvWorker(buildWorld({ brands: BRANDS, ruleV: RV, now }));
  const r1 = await run(BEFORE, f.base);
  ok("① 바꾸기 전 첫 실행 성공", r1.code === 0);
  const s1 = { ...f.st, byKind: { ...f.st.byKind } };
  const r2 = await run(BEFORE, f.base);
  ok("① 바꾸기 전 두 번째 실행 성공", r2.code === 0);
  results.before = { run1: s1, run2: { puts: f.st.puts - s1.puts, posts: f.st.posts - s1.posts, byKind: Object.fromEntries(Object.entries(f.st.byKind).map(([k, v]) => [k, v - (s1.byKind[k] || 0)])) } };
  results.beforeValues = values(f.st, f.base);
  console.log(`  바꾸기 전 — 첫 실행 ${fmt(s1)}`);
  console.log(`  바꾸기 전 — 두 번째 실행 ${fmt(results.before.run2)}`);
  ok("① 바꾸기 전: 차수마다 저장해 오버레이가 브랜드 수의 2배를 넘는다", (s1.byKind.overlay || 0) > 2 * BRANDS, `오버레이 ${s1.byKind.overlay}`);
  ok("① 바꾸기 전: 두 번째 실행도 브랜드마다 다시 쓴다(매번 다시 열리던 상품)", results.before.run2.puts >= BRANDS, `put ${results.before.run2.puts}`);
  await f.close();
}

// ── ② ③ 바꾼 뒤 — 같은 날 두 번, 자동 실행(auto)과 장부 ──
{
  const ledger = join(TMP, "ledger-after");
  const f = await startKvWorker(buildWorld({ brands: BRANDS, ruleV: RV, now }));
  const r1 = await run(AFTER, f.base, { ENRICH_MODE: "auto", KV_LEDGER_DIR: ledger, GITHUB_RUN_ID: "101" });
  ok("② 바꾼 뒤 첫 실행 성공", r1.code === 0);
  const s1 = { ...f.st, byKind: { ...f.st.byKind } };
  console.log(`  바꾼 뒤 — 첫 실행 ${fmt(s1)}`);
  ok("② 오버레이는 브랜드마다 한 번 이하", (s1.byKind.overlay || 0) <= BRANDS, `오버레이 ${s1.byKind.overlay}`);
  ok("② 상세는 브랜드마다 한 번 이하", (s1.byKind.details || 0) <= BRANDS, `상세 ${s1.byKind.details}`);
  ok("② 인덱스는 한 번", (s1.byKind.index || 0) === 1);
  ok("② 재시도 없이 한 번에(요청 = put)", s1.posts === s1.puts, `요청 ${s1.posts} · put ${s1.puts}`);
  ok("② 리포트·로그에 'KV 쓰기 집계'", /KV 쓰기 집계 — 보낸 저장 요청 \d+ · KV put \d+/.test(r1.out));
  // '예전 방식이었다면' = 같은 읽기 결과를 1·2·3차마다 저장했을 횟수. 바꾸기 전 실측보다 '막힌 상세' 브랜드(10번째마다, 13개)만큼
  // 작다 — 그 브랜드의 막힌 상품을 이제 3차에서 다시 열지 않아 3차 저장 자리가 없다.
  const blockedDetail = Array.from({ length: BRANDS }, (_, b) => b).filter((b) => b % 10 === 9).length;
  const m = r1.out.match(/예전 방식이었다면 (\d+)/);
  ok("② 로그의 '예전 방식이었다면' = 바꾸기 전 실측 − 다시 안 연 막힌 상세 브랜드", m && Number(m[1]) === results.before.run1.puts - blockedDetail,
    `로그 ${m && m[1]} · 바꾸기 전 실측 ${results.before.run1.puts} − ${blockedDetail}`);
  const day = utcDay();
  const files = readdirSync(join(ledger, day));
  ok("② 장부에 이 실행(enrich-comp-101.json, mode full)", files.includes("enrich-comp-101.json") &&
    JSON.parse(readFileSync(join(ledger, day, "enrich-comp-101.json"), "utf8")).mode === "full");
  ok("② 장부의 put 수 = 가짜 Worker 가 센 put 수", JSON.parse(readFileSync(join(ledger, day, "enrich-comp-101.json"), "utf8")).puts === s1.puts);

  const r2 = await run(AFTER, f.base, { ENRICH_MODE: "auto", KV_LEDGER_DIR: ledger, GITHUB_RUN_ID: "102" });
  ok("③ 두 번째 자동 실행 성공", r2.code === 0);
  const run2 = { puts: f.st.puts - s1.puts, posts: f.st.posts - s1.posts, byKind: Object.fromEntries(Object.entries(f.st.byKind).map(([k, v]) => [k, v - (s1.byKind[k] || 0)])) };
  console.log(`  바꾼 뒤 — 두 번째 실행 ${fmt(run2)}`);
  ok("③ 두 번째 자동 실행은 new 방식", /실행 방식 new/.test(r2.out));
  ok("③ 바뀐 게 없으면 한 번도 쓰지 않는다", run2.puts === 0 && run2.posts === 0, `put ${run2.puts}`);
  results.after = { run1: s1, run2 };
  // 저장된 값이 바꾸기 전과 같다 — 쓰기를 줄여도 잃는 데이터가 없다.
  const av = values(f.st, f.base), bv = results.beforeValues;
  const diff = Object.keys({ ...av, ...bv }).filter((k) => av[k] !== bv[k]);
  ok("② 저장된 혼용률·컬러·상세가 바꾸기 전과 같다", diff.length === 0, diff.slice(0, 3).map((k) => `${k}: ${bv[k]} → ${av[k]}`).join(" | "));
  // 헤드리스가 늦게 끝나 브랜드 둘에 신상이 들어온 뒤의 자동 실행 — 그 두 브랜드만 읽고 쓴다.
  f.addNew(7); f.addNew(42);
  const p2 = f.st.puts, k2 = { ...f.st.byKind };
  const r3 = await run(AFTER, f.base, { ENRICH_MODE: "auto", KV_LEDGER_DIR: ledger, GITHUB_RUN_ID: "103" });
  ok("③ 세 번째(신상 뒤) 자동 실행 성공", r3.code === 0);
  const d3 = Object.fromEntries(Object.entries(f.st.byKind).map(([k, v]) => [k, v - (k2[k] || 0)]));
  console.log(`  바꾼 뒤 — 신상 두 브랜드 뒤 세 번째 실행 put ${f.st.puts - p2} ${JSON.stringify(d3)}`);
  ok("③ 카탈로그가 바뀐 브랜드 2개만 본다", /카탈로그가 바뀐 브랜드 2\/134개만 본다/.test(r3.out));
  ok("③ 그 두 브랜드의 오버레이·상세 + 인덱스만 쓴다(5)", f.st.puts - p2 === 5 && d3.overlay === 2 && d3.details === 2 && d3.index === 1, JSON.stringify(d3));
  ok("③ 신상의 혼용률이 찼다", (f.st.overlays["b7.example.brand7"][`${f.base}/p/7/1?new=1`] || {}).comp === "Cotton 95% / Elastane 5%");
  await f.close();
}

// ── ③-b 바꾼 뒤 손으로 두 번 돌려도(full 두 번) 매번 다시 열던 상품이 없어 거의 안 쓴다 ──
{
  const f = await startKvWorker(buildWorld({ brands: BRANDS, ruleV: RV, now }));
  await run(AFTER, f.base, { ENRICH_MODE: "full" });
  const p1 = f.st.puts;
  const r2 = await run(AFTER, f.base, { ENRICH_MODE: "full" });
  ok("③-b 두 번째 full 실행 성공", r2.code === 0);
  console.log(`  바꾼 뒤 — full 을 같은 날 두 번: 두 번째 put ${f.st.puts - p1}`);
  ok("③-b 두 번째 full 도 쓰지 않는다(매번 다시 열리던 상품 · 막힌 상세가 쉰다)", f.st.puts - p1 === 0, `put ${f.st.puts - p1}`);
  await f.close();
}

// ── ④ 하루 몫 가드 — 오늘 장부 650 + 예약 300 → 남은 50 ──
{
  const ledger = join(TMP, "ledger-tight");
  mkdirSync(join(ledger, utcDay()), { recursive: true });
  writeFileSync(join(ledger, utcDay(), "browser-collect-1-main.json"), JSON.stringify({ job: "browser-collect", run: "1", part: "main", puts: 650 }));
  const f = await startKvWorker(buildWorld({ brands: BRANDS, ruleV: RV, now }));
  const r = await run(AFTER, f.base, { ENRICH_MODE: "auto", KV_LEDGER_DIR: ledger, GITHUB_RUN_ID: "201" });
  ok("④ 실행 성공", r.code === 0);
  console.log(`  남은 몫 50 — ${fmt(f.st)}`);
  ok("④ 남은 몫(50)을 넘지 않는다", f.st.puts <= 50, `put ${f.st.puts}`);
  ok("④ 오버레이부터 — 상세·인덱스는 미룬다", (f.st.byKind.overlay || 0) === 50 && !f.st.byKind.details && !f.st.byKind.index, JSON.stringify(f.st.byKind));
  ok("④ 미룬 수를 로그에 남긴다", /미룸 (\d+)/.test(r.out) && Number(r.out.match(/미룸 (\d+)/)[1]) > 0);
  // 미룬 브랜드는 저장본 그대로(시도 기록도 안 바뀜) → 다음 실행이 다시 읽는다.
  const untouched = Object.entries(f.st.overlays).filter(([site, o]) => {
    const b = Number(site.match(/^b(\d+)\./)[1]);
    const p2 = o[`${f.base}/p/${b}/2`];
    return p2 && !p2.comp && p2.t === now - 6 * 86400000;
  }).length;
  ok("④ 미룬 브랜드(134 − 50)의 저장본은 그대로", untouched === BRANDS - 50, `그대로인 브랜드 ${untouched}`);
  await f.close();
}

// ── ⑤ Worker 가 '한도 초과'를 돌려주면 그 뒤로는 보내지 않는다 ──
{
  const f = await startKvWorker(buildWorld({ brands: BRANDS, ruleV: RV, now }), { putLimit: 10 });
  const r = await run(AFTER, f.base, {});
  ok("⑤ 실행 성공", r.code === 0);
  console.log(`  한도 10 — put ${f.st.puts} · 보낸 요청 ${f.st.posts} · 한도 초과 응답 ${f.st.limitReplies}`);
  ok("⑤ 한도 초과 뒤 거의 바로 멈춘다(동시 4개 이내)", f.st.posts <= 10 + 4, `요청 ${f.st.posts}`);
  ok("⑤ 로그에 '한도 걸림'", /한도 걸림/.test(r.out));
  await f.close();
}

// ── ⑥ 실행 도중 다른 잡이 같은 브랜드에 쓴 값을 덮지 않는다 ──
{
  const site = "b0.example.brand0";
  let reads = 0;
  // 첫 읽기 직후, 크롬 보강이 같은 브랜드의 '다 찬' 상품 컬러를 바꾸고 새 상품 하나에 혼용률을 쓴 것처럼 만든다.
  const f = await startKvWorker(buildWorld({ brands: 3, ruleV: RV, now }), {
    onComps: (s, st, base) => {
      if (s !== site || reads++) return;
      const o = st.overlays[site];
      o[`${base}/p/0/5`] = { ...o[`${base}/p/0/5`], color: "Sand Melange" };
      o[`${base}/p/0/9`] = { comp: "Silk 100%", t: Date.now() };
    },
  });
  const r = await run(AFTER, f.base, {});
  ok("⑥ 실행 성공", r.code === 0);
  const o = f.st.overlays[site];
  ok("⑥ 다른 잡이 쓴 컬러가 남는다", o[`${f.base}/p/0/5`] && o[`${f.base}/p/0/5`].color === "Sand Melange");
  ok("⑥ 다른 잡이 쓴 상품이 남는다", o[`${f.base}/p/0/9`] && o[`${f.base}/p/0/9`].comp === "Silk 100%");
  ok("⑥ 이번 실행이 채운 혼용률도 들어갔다", o[`${f.base}/p/0/0`] && o[`${f.base}/p/0/0`].comp === "Cotton 95% / Elastane 5%");
  await f.close();
}

// ── ⑦ DRY — 아무것도 보내지 않고, 보냈을 요청을 센다 ──
{
  const f = await startKvWorker(buildWorld({ brands: BRANDS, ruleV: RV, now }));
  const r = await run(AFTER, f.base, { DRY: "1" });
  ok("⑦ DRY 실행 성공", r.code === 0);
  ok("⑦ DRY — POST 0회 · put 0", f.st.posts === 0 && f.st.puts === 0);
  const m = r.out.match(/KV 쓰기 집계 \[DRY\] — 실제로 보낸 저장 요청 0 · KV put 0 · 보내기 전에 막은 요청 0 · 저장했다면 요청 (\d+)/);
  ok("⑦ DRY 로그 줄: 실제로 보낸 저장 요청 0", !!m, r.out.split("\n").filter((l) => l.includes("KV 쓰기 집계")).join(" | "));
  // DRY 는 인덱스를 만들지 않으므로(BRANDS 측정이 다른 브랜드를 읽지 않게) '저장했다면'은 오버레이·상세 + 인덱스 1 이다.
  ok("⑦ '저장했다면'이 진짜 실행의 저장 요청 수와 같다", m && Number(m[1]) === results.after.run1.posts, `DRY ${m && m[1]} · 진짜 ${results.after.run1.posts}`);
  await f.close();
}

rmSync(TMP, { recursive: true, force: true });
const b1 = results.before.run1.puts, b2 = results.before.run2.puts, a1 = results.after.run1.puts, a2 = results.after.run2.puts;
console.log(`\n브랜드 ${BRANDS}개 · 같은 날 두 번 — 바꾸기 전 ${b1} + ${b2} = ${b1 + b2} → 바꾼 뒤 ${a1} + ${a2} = ${a1 + a2} (KV put)`);
if (bad) { console.error(`\nKV 쓰기 — ${bad}개 실패`); process.exit(1); }
console.log("✅ KV 쓰기 — 브랜드마다 한 번 · 같으면 안 보냄 · 하루 full 한 번 · 몫 가드 · 한도에서 멈춤 · 다른 잡 값 보존 · DRY 0");
