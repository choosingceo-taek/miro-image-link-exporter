#!/usr/bin/env node
// 야간 헤드리스 수집 워크플로(browser-collect.yml)의 잡 나누기 시험 — 네트워크·브라우저 없음.
//  · 잡(main · extra · oysho)마다 EXTRA_MODE·EXTRA_JOB·시간 예산이 맞게 들어가는가
//  · 추가 브랜드 파일에 적힌 "job" 마다 그 잡이 있는가(없으면 그 브랜드는 아무 잡에서도 돌지 않는다)
//  · 아침 리포트 합치기(combine-collect-reports.mjs)가 main 이 아닌 잡을 모두 붙이는가
//  · 측정 실행 막기(report_tag 면 store=0 만)가 야간 저장 실행을 막지 않는가 — 예전 검사는 $REPORT_TAG 를 봐서
//    야간 extra 잡(REPORT_TAG=extra-report · STORE=1)이 시작하자마자 멈췄다(main 에 합쳐진 뒤 첫 야간에 날 오류).
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SIDE_JOBS } from "./combine-collect-reports.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const ok = (c, m) => { if (c) console.log("  ✅ " + m); else { console.error("  ❌ " + m); bad++; } };

const yml = readFileSync(join(ROOT, ".github/workflows/browser-collect.yml"), "utf8");

// matrix include 항목 읽기(이 파일 모양에 맞춘 간단한 읽기 — YAML 라이브러리 없이)
const inc = yml.split(/\n\s+include:\n/)[1] || "";
const parts = [];
for (const m of inc.split("\n")) {
  const s = m.match(/^\s+- part: (\S+)/);
  if (s) { parts.push({ part: s[1] }); continue; }
  const kv = m.match(/^\s{12}(extra_mode|extra_job|budget): ?(.*)$/);
  if (kv && parts.length) parts[parts.length - 1][kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
  else if (parts.length && /^\s{0,8}\S/.test(m)) break;
}
const P = Object.fromEntries(parts.map((p) => [p.part, p]));
ok(parts.map((p) => p.part).join(",") === "main,extra,oysho", `잡이 main·extra·oysho 셋이다(읽은 것: ${parts.map((p) => p.part).join(",")})`);
ok(P.main && P.main.extra_mode === "skip" && P.main.extra_job === "", "main 잡은 Render 그룹만(EXTRA_MODE=skip)");
ok(P.extra && P.extra.extra_mode === "only" && P.extra.extra_job === "", "extra 잡은 job 이 없는 추가 브랜드만");
ok(P.oysho && P.oysho.extra_mode === "only" && P.oysho.extra_job === "oysho", "oysho 잡은 job=oysho 브랜드만");
ok(P.oysho && Number(P.oysho.budget) >= 60 && Number(P.oysho.budget) < Number(P.main.budget), `oysho 잡은 자기 시간 예산(${P.oysho && P.oysho.budget}분 — 측정 46분 + 여유)`);
ok(/EXTRA_MODE: \$\{\{ matrix\.extra_mode \}\}/.test(yml) && /EXTRA_JOB: \$\{\{ matrix\.extra_job \}\}/.test(yml) && /BUDGET_MIN - used/.test(yml),
  "Collect 단계가 잡의 EXTRA_MODE·EXTRA_JOB·예산을 쓴다");
ok(/matrix\.part != 'main' && format\('\{0\}-report', matrix\.part\)/.test(yml), "야간 리포트 이름: main 은 운영 리포트, 나머지는 <잡>-report");

// 추가 브랜드 파일의 job 마다 그 잡이 있어야 한다
const extra = JSON.parse(readFileSync(join(ROOT, "browser-extra-brands.json"), "utf8"));
const jobs = [...new Set((extra.brands || []).map((b) => String(b.job || "").toLowerCase()).filter(Boolean))];
const missing = jobs.filter((j) => !parts.some((p) => p.extra_job === j));
ok(!missing.length, `추가 브랜드 파일의 job(${jobs.join(",") || "없음"})마다 잡이 있다${missing.length ? " — 없음: " + missing : ""}`);
const oy = (extra.brands || []).find((b) => b.brand === "Oysho");
ok(oy && oy.engine === "firefox" && oy.fresh === true && oy.job === "oysho" && oy.store !== "merge",
  "Oysho 는 파이어폭스 · 새 창 · job=oysho · 통째 교체(확장 저장본 20개가 전부 타일이라 합치지 않음)");

// 아침 리포트에 main 이 아닌 잡이 모두 붙는다
const sideFiles = SIDE_JOBS.map((j) => j.file).sort().join(",");
const wantFiles = parts.filter((p) => p.part !== "main").map((p) => `browser-collect-${p.part}-report`).sort().join(",");
ok(sideFiles === wantFiles, `아침 리포트 합치기가 잡 리포트를 모두 붙인다(${sideFiles})`);

// 측정 막기 검사를 실제 bash 로 돌려 본다
const guard = yml.split("\n").filter((l) => /^\s+if \[ -n "\$(DIAG|MEASURE_TAG|REPORT_TAG)" \]/.test(l)).map((l) => l.trim()).join("\n");
ok(/MEASURE_TAG/.test(guard) && !/-n "\$REPORT_TAG"/.test(guard), "측정 막기 검사는 입력(MEASURE_TAG)을 본다");
const runGuard = (env) => spawnSync("bash", ["-c", guard + "\nexit 0"], { env: { PATH: process.env.PATH, ...env }, encoding: "utf8" }).status;
ok(runGuard({ STORE: "1", REPORT_TAG: "extra-report", MEASURE_TAG: "", DIAG: "" }) === 0, "야간 extra 잡(REPORT_TAG=extra-report · STORE=1)은 통과");
ok(runGuard({ STORE: "1", REPORT_TAG: "oysho-report", MEASURE_TAG: "", DIAG: "" }) === 0, "야간 oysho 잡(REPORT_TAG=oysho-report · STORE=1)은 통과");
ok(runGuard({ STORE: "1", REPORT_TAG: "", MEASURE_TAG: "", DIAG: "" }) === 0, "야간 main 잡은 통과");
ok(runGuard({ STORE: "1", REPORT_TAG: "m-1-oysho", MEASURE_TAG: "m", DIAG: "" }) === 1, "측정 실행(report_tag)에 store=1 이면 멈춘다");
ok(runGuard({ STORE: "0", REPORT_TAG: "m-1-oysho", MEASURE_TAG: "m", DIAG: "" }) === 0, "측정 실행에 store=0 이면 통과");
ok(runGuard({ STORE: "0", REPORT_TAG: "extra-report", MEASURE_TAG: "", DIAG: "debug" }) === 1, "diag 는 측정 실행(report_tag)과 함께만");

if (bad) { console.error(`\n수집 워크플로 잡 나누기 ${bad}건 실패`); process.exit(1); }
console.log("✅ 수집 워크플로 잡 나누기 통과 — main · extra · oysho 가 겹치지 않고, 야간 저장 실행이 측정 막기에 걸리지 않는다");
