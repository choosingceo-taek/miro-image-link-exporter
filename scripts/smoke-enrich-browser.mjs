#!/usr/bin/env node
// enrich-comp-browser.mjs 를 가짜 Worker·가짜 상품 페이지에 붙여 끝까지 돌린다.
//
// 이 스크립트가 하는 일은 저장이다. 잘못 저장하면 되돌리기 어렵다 — 특히
// 차단당한 상품을 '사이트가 안 적음(none)'으로 적어 버리면 엑셀에 '정보 없음'이
// 박히고 다시는 읽지 않게 된다. 그래서 무엇을 저장했는지까지 확인한다.
//
// 손으로 돌린다:
//   npm i --no-save playwright@1.49.1
//   npx playwright install --with-deps chromium
//   node scripts/smoke-enrich-browser.mjs
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, unlinkSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8952;

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

const fake = spawn(process.execPath, [join(ROOT, "scripts/fixtures/fake-worker.mjs")],
  { env: { ...process.env, PORT: String(PORT) }, stdio: ["ignore", "ignore", "pipe"] });
let savedRaw = "";
fake.stderr.on("data", (d) => { savedRaw += String(d); });
await new Promise((r) => setTimeout(r, 800));

// 이력 파일은 임시 경로로 — 저장소의 enrich-browser-state.json 을 건드리지 않는다.
const TMP = mkdtempSync(join(tmpdir(), "smoke-enrich-"));
const STATE = join(TMP, "state.json");
const run = spawn(process.execPath, [join(ROOT, "scripts/enrich-comp-browser.mjs")], {
  env: { ...process.env, WORKER_URL: `http://localhost:${PORT}`, WORKER_TOKEN: "", BRANDS: "TestBrand", STATE_PATH: STATE },
  stdio: ["ignore", "pipe", "pipe"],
});
let out = "";
run.stdout.on("data", (d) => { out += String(d); });
run.stderr.on("data", (d) => { out += String(d); });
const code = await new Promise((r) => run.on("close", r));

// ── 엔진 고르기(브라우저를 띄우지 않고 고르기만) ──
// 파이어폭스는 이 연기 테스트 환경에 없을 수 있어, PICK_ONLY 로 배선만 본다.
async function pick(engine, stateObj) {
  const sp = join(TMP, `pick-${engine}-${stateObj ? "s" : "n"}.json`);
  if (stateObj) writeFileSync(sp, JSON.stringify(stateObj));
  const p = spawn(process.execPath, [join(ROOT, "scripts/enrich-comp-browser.mjs")], {
    env: { ...process.env, WORKER_URL: `http://localhost:${PORT}`, WORKER_TOKEN: "", BRANDS: "TestBrand",
      ENGINE: engine, PICK_ONLY: "1", STATE_PATH: sp },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let o = "";
  p.stdout.on("data", (d) => { o += String(d); });
  p.stderr.on("data", (d) => { o += String(d); });
  await new Promise((r) => p.on("close", r));
  return o;
}
// 예전 모양 이력 = 크롬(playwright)으로 막힌 기록
const OLD = { blocked: { "test.com.testbrand": { brand: "TestBrand", until: Date.now() + 86400000, at: "2026-11-20", ratio: 100 } } };
const autoBlocked = await pick("auto", OLD);
if (!/TestBrand → firefox/.test(autoBlocked)) fail("auto: 크롬 차단 이력이 있는데 파이어폭스로 안 넘어간다\n" + autoBlocked);
const autoClean = await pick("auto", null);
if (!/TestBrand → playwright/.test(autoClean)) fail("auto: 이력이 없는데 playwright 가 아니다\n" + autoClean);
const plain = await pick("playwright", OLD);
if (!/TestBrand → playwright/.test(plain)) fail("ENGINE=playwright 가 지켜지지 않는다\n" + plain);
const bogus = await pick("nope", null);
if (!/TestBrand → playwright/.test(bogus)) fail("모르는 엔진 이름이면 playwright 로 돌아가야 한다\n" + bogus);
fake.kill();

if (code !== 0) { console.error(out); fail(`종료 코드 ${code}`); }
// 이 실행은 막히지 않았으므로(6개 중 2개) 이력에 아무것도 남지 않아야 한다 — 새 모양으로 저장된다.
try {
  const st = JSON.parse(readFileSync(STATE, "utf8"));
  if (!st.blocked || Object.keys(st.blocked).length) fail(`이력이 이상하다: ${JSON.stringify(st)}`);
} catch (e) { fail("이력 파일을 쓰지 않았다: " + e.message); }

// ── 집계가 맞는가 ──
if (!/TestBrand \[playwright\] — 시도 8 · ✅ 3 · 미표기 2 · 껍데기 1 · 차단\/타임아웃 2/.test(out)) {
  fail("집계가 예상과 다름:\n     " + (out.match(/· TestBrand.*/) || ["(없음)"])[0]);
}

// ── 무엇을 저장했는가 ──
const line = savedRaw.split("\n").find((l) => l.startsWith("SAVED:"));
if (!line) fail("저장 요청이 없었다");
else {
  const saved = JSON.parse(line.slice(6));
  const p = (n) => saved[`http://localhost:${PORT}/p/${n}`];

  if (!p(1) || p(1).comp !== "Cotton 95% / Elastane 5%") {
    fail(`평범한 표기: ${JSON.stringify(p(1) && p(1).comp)}`);
  }
  // 접힌 details 를 펼치지 않으면 이 값이 안 나온다. 원단이 둘이라 줄이 나뉜다.
  if (!p(2) || p(2).comp !== "Wool 100%\nPolyester 100%") {
    fail(`접힌 탭 안의 두 겹 원단: ${JSON.stringify(p(2) && p(2).comp)}`);
  }
  // 사이트가 안 적는 상품은 none 으로 — 엑셀에서 '확인 필요'와 구분된다.
  if (!p(3) || p(3).none !== 1) fail(`소재 미표기 상품: ${JSON.stringify(p(3))}`);
  if (p(3) && p(3).comp) fail("소재가 없는데 comp 가 채워졌다");
  // 차단당한 상품은 아무것도 적지 않아야 한다. none 을 적으면 영영 안 읽는다.
  if (p(4)) fail(`차단당한 상품이 저장됐다 — ${JSON.stringify(p(4))}`);
  // 200 으로 온 봇 확인 화면도 차단이다 — none 으로 적으면 안 된다.
  if (p(5)) fail(`봇 확인 화면이 저장됐다 — ${JSON.stringify(p(5))}`);
  // 늦게 그려지는 소재도 읽어야 한다.
  // 상품 상세: 'Details' 를 눌러야 그려지는 글머리표 — 펼쳐서 읽고 detail:<site> 에 따로 저장한다(오버레이에는 없다).
  const dl = savedRaw.split("\n").find((l) => l.startsWith("DETAILS:"));
  if (!dl) fail("상품 상세 저장 요청이 없었다");
  else {
    const d1 = JSON.parse(dl.slice(8))[`http://localhost:${PORT}/p/1`] || {};
    if (JSON.stringify(d1.feat) !== JSON.stringify(["Relaxed fit", "Ribbed crew neck"])) fail(`클릭해야 그려지는 디테일: ${JSON.stringify(d1)}`);
  }
  if (p(1) && (p(1).feat || p(1).desc)) fail("상세가 오버레이에 섞였다");
  if (!p(6) || p(6).comp !== "Wool 70% / Nylon 30%") fail(`늦게 그려지는 소재: ${JSON.stringify(p(6))}`);
  // 껍데기(상품명이 화면 글에 없음)는 none 으로 적지 않는다 — Patagonia 167개가 이렇게 잘못 적혔다.
  if (p(7)) fail(`껍데기 페이지가 저장됐다 — ${JSON.stringify(p(7))}`);
  // nv 없는 예전 none 은 크롬 몫 — 크롬으로는 다시 열지 않으므로 그대로 남는다.
  if (!p(8) || p(8).none !== 1 || p(8).comp || p(8).nv) fail(`크롬 몫의 예전 none 을 다시 열었다 — ${JSON.stringify(p(8))}`);
  // fetch 만 적은 none 은 크롬으로 한 번 더 열고, 역시 없으면 nv 에 chromium 을 더한다.
  if (!p(9) || p(9).none !== 1 || p(9).nv !== "chromium,fetch") fail(`fetch 몫 none 다시 보기: ${JSON.stringify(p(9))}`);
  // 새로 적은 none 에는 이 엔진이 남는다.
  if (p(3) && p(3).nv !== "chromium") fail(`새 none 의 nv: ${JSON.stringify(p(3))}`);
  // 혼용률이 들어간 상품에 none 이 남지 않는다.
  for (const n of [1, 2, 6]) if (p(n) && (p(n).none || p(n).nv)) fail(`혼용률을 채웠는데 none 이 남았다: ${JSON.stringify(p(n))}`);
  // '[object Object]' 가 들어가는 옛 사고의 재발 방지.
  for (const [u, v] of Object.entries(saved)) {
    if (String(v.comp || "").includes("[object")) fail(`객체가 문자열로 새어 들어감: ${u}`);
    if (!v.t && !/\/p\/8$/.test(u)) fail(`시도 시각(t)이 없다: ${u} — 재시도 창이 동작하지 않는다`);
  }
}

// ── 리포트가 나왔는가 ──
const rp = join(ROOT, "enrich-browser-report.md");
if (!existsSync(rp)) fail("리포트 파일이 없다");
else {
  const md = readFileSync(rp, "utf8");
  if (!/TestBrand/.test(md)) fail("리포트에 브랜드 줄이 없다");
  if (!/\[Waffle Tee\]\(.*\/p\/1\) \| Cotton 95% \/ Elastane 5%/.test(md)) fail("리포트에 읽은 혼용률이 상품명과 함께 없다");
  if (!/Lined Coat.*Wool 100% ‖ Polyester 100% \| ⚠ 두 줄/.test(md)) fail("두 줄 혼용률에 ⚠ 표시가 없다");
  if (!/껍데기로 센 페이지 예 1개[\s\S]*Capilene Cool Merino Shirt[\s\S]*Shop Women Men Kids/.test(md)) fail("껍데기 페이지 예(제목·글 앞부분)가 리포트에 없다");
  unlinkSync(rp);
}

if (bad) { console.error(`\n크롬 보강 ${bad}건 실패`); process.exit(1); }
console.log("✅ 크롬 혼용률 보강 통과 — 평범·접힌탭 두겹·미표기·차단·봇확인화면·늦은표기·껍데기·예전 none 두 가지 + 저장 내용 + 엔진 고르기 4경우");
