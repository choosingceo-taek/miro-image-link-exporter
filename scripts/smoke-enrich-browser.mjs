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
import { existsSync, unlinkSync, readFileSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8952;

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

const fake = spawn(process.execPath, [join(ROOT, "scripts/fixtures/fake-worker.mjs")],
  { env: { ...process.env, PORT: String(PORT) }, stdio: ["ignore", "ignore", "pipe"] });
let savedRaw = "";
fake.stderr.on("data", (d) => { savedRaw += String(d); });
await new Promise((r) => setTimeout(r, 800));

const run = spawn(process.execPath, [join(ROOT, "scripts/enrich-comp-browser.mjs")], {
  env: { ...process.env, WORKER_URL: `http://localhost:${PORT}`, WORKER_TOKEN: "", BRANDS: "TestBrand" },
  stdio: ["ignore", "pipe", "pipe"],
});
let out = "";
run.stdout.on("data", (d) => { out += String(d); });
run.stderr.on("data", (d) => { out += String(d); });
const code = await new Promise((r) => run.on("close", r));
fake.kill();

if (code !== 0) { console.error(out); fail(`종료 코드 ${code}`); }

// ── 집계가 맞는가 ──
if (!/시도 4 · ✅ 2 · 미표기 1 · 차단\/타임아웃 1/.test(out)) {
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
  // '[object Object]' 가 들어가는 옛 사고의 재발 방지.
  for (const [u, v] of Object.entries(saved)) {
    if (String(v.comp || "").includes("[object")) fail(`객체가 문자열로 새어 들어감: ${u}`);
    if (!v.t) fail(`시도 시각(t)이 없다: ${u} — 재시도 창이 동작하지 않는다`);
  }
}

// ── 리포트가 나왔는가 ──
const rp = join(ROOT, "enrich-browser-report.md");
if (!existsSync(rp)) fail("리포트 파일이 없다");
else {
  const md = readFileSync(rp, "utf8");
  if (!/TestBrand/.test(md)) fail("리포트에 브랜드 줄이 없다");
  unlinkSync(rp);
}

if (bad) { console.error(`\n크롬 보강 ${bad}건 실패`); process.exit(1); }
console.log("✅ 크롬 혼용률 보강 통과 — 평범·접힌탭 두겹·미표기·차단 네 경우 + 저장 내용 확인");
