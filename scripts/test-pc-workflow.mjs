#!/usr/bin/env node
// PC 수집 워크플로(pc-collect.yml)·설치 안내(docs/pc-runner.md)·아침 리포트 PC 절 시험 — 네트워크·브라우저 없음.
//  · owner PC 의 러너(라벨 rack-pc)에서만 돈다 · 예약 시각이 KST 평일 08:30 · 입력(store·brands·report_tag)과 기본값
//  · 측정 실행 막기(MEASURE_TAG)가 브라우저를 받기 전에 있다 · 리포트는 실패해도 올린다
//  · 위장·우회 도구를 받지 않는다 · 안내 문서에 토큰 값이 없다
//  · 아침 리포트에 'PC 잡' 절 — 오늘 결과 ✅ · 오래됨/없음 ⚠
//  · actionlint 가 있으면(ACTIONLINT=<경로> 또는 PATH) 워크플로 문법 검사
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { combine, PC_JOB, SIDE_JOBS } from "./combine-collect-reports.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const ok = (c, m) => { if (c) console.log("  ✅ " + m); else { console.error("  ❌ " + m); bad++; } };
const yml = readFileSync(join(ROOT, ".github/workflows/pc-collect.yml"), "utf8");
const code = yml.split("\n").filter((l) => !/^\s*#/.test(l)).join("\n");

console.log("pc-collect.yml");
ok(/runs-on: \[self-hosted, rack-pc\]/.test(code), "owner PC 의 러너(self-hosted · rack-pc)에서만 돈다");
ok(!/ubuntu-latest|windows-latest|macos-latest/.test(code), "GitHub 서버 러너에서는 돌지 않는다");
const crons = [...code.matchAll(/cron: "([^"]+)"/g)].map((m) => m[1]);
ok(crons.length === 1, `예약은 한 줄(바꾸기 쉽게): ${crons.join(" | ")}`);
// cron(UTC) → KST 요일·시각
{
  const [mi, hr, , , dow] = crons[0].split(" ");
  const days = dow === "*" ? [0, 1, 2, 3, 4, 5, 6] : dow.split(",").flatMap((p) => { const [a, b] = p.split("-").map(Number); return b === undefined ? [a] : Array.from({ length: b - a + 1 }, (_, i) => a + i); });
  const kstMin = Number(hr) * 60 + Number(mi) + 9 * 60;
  const kst = days.map((d) => (d + Math.floor(kstMin / 1440)) % 7).sort().join(",");
  const at = `${String(Math.floor((kstMin % 1440) / 60)).padStart(2, "0")}:${String(kstMin % 60).padStart(2, "0")}`;
  ok(at === "08:30" && kst === "1,2,3,4,5", `기본 예약 = KST 평일(월~금) 08:30 (읽은 값: KST ${at} · 요일 ${kst})`);
}
for (const [name, def] of [["store", "1"], ["brands", ""], ["report_tag", ""]]) {
  const m = code.match(new RegExp(`\\n      ${name}:\\n(?:        .*\\n)*?        default: "([^"]*)"`));
  ok(m && m[1] === def, `입력 ${name} (기본 "${def}")`);
}
ok(/STORE: \$\{\{ github\.event\.inputs\.store \|\| '1' \}\}/.test(code), "예약 실행(입력 없음)은 store=1");
ok(/MEASURE_TAG: \$\{\{ github\.event\.inputs\.report_tag \}\}/.test(code), "측정 실행 여부는 입력 report_tag 로(MEASURE_TAG)");
ok(/REPORT_TAG: \$\{\{ github\.event\.inputs\.report_tag && format\('\{0\}-\{1\}', github\.event\.inputs\.report_tag, github\.run_id\) \|\| '' \}\}/.test(code), "측정 리포트 이름에 실행 번호를 붙인다");
const iGuard = code.indexOf("pc-collect.mjs --check-only"), iInstall = code.indexOf("npm i --no-save playwright"), iRun = code.indexOf("run: node scripts/pc-collect.mjs\n");
ok(iGuard > 0 && iGuard < iInstall && iInstall < iRun, "측정 막기 → 설치 → 수집 순서(막히면 브라우저도 안 받는다)");
ok(/name: Commit report\n\s+#.*\n\s+if: always\(\)\n\s+run: node scripts\/pc-commit\.mjs/.test(yml), "리포트는 실패해도 올린다(pc-commit.mjs)");
ok(/name: Upload report\n\s+if: always\(\)/.test(code), "아티팩트도 늘 올린다");
ok(/concurrency:\n\s+group: pc-collect\n\s+cancel-in-progress: false/.test(code), "한 PC 에서 한 번에 하나만(취소 없이 줄 서기)");
ok(/timeout-minutes: 240/.test(code), "잡 시간 상한 240분");
ok(/PC_WRITE_BUDGET: \$\{\{ vars\.PC_WRITE_BUDGET \|\| '120' \}\}/.test(code), "쓰기 예산은 저장소 변수(기본 120)");
ok(/playwright@1\.49\.1/.test(code) && !/install(?: --with-deps)? chromium/.test(code), "Playwright 는 데이터센터와 같은 판 · 크롬은 받지 않고 PC 에 설치된 것을 씀");
ok(!/echo .*secrets\./.test(code), "비밀값을 화면에 찍지 않는다");

console.log("위장·우회 도구 없음");
const pcFiles = ["scripts/pc-collect.mjs", "scripts/pc-browser-hooks.mjs", "scripts/pc-plan.mjs", "scripts/pc-limits.mjs", "scripts/pc-commit.mjs", ".github/workflows/pc-collect.yml"];
const src = pcFiles.map((f) => readFileSync(join(ROOT, f), "utf8").split("\n").filter((l) => !/^\s*(\/\/|#)/.test(l)).join("\n")).join("\n");
for (const w of ["patchright", "camoufox", "puppeteer-extra", "stealth", "undetected", "captcha", "proxy-chain", "fingerprint-injector", "2captcha", "scraperapi", "brightdata", "zenrows"]) {
  ok(!new RegExp(w, "i").test(src), `PC 경로 코드에 ${w} 없음`);
}
ok(/IMPIT: "0"/.test(readFileSync(join(ROOT, "scripts/pc-collect.mjs"), "utf8")), "컬러 보강에서 브라우저 지문 흉내(impit)를 끈다");

console.log("docs/pc-runner.md");
const doc = readFileSync(join(ROOT, "docs/pc-runner.md"), "utf8");
for (const [rx, m] of [
  [/rack-pc/, "라벨 rack-pc"], [/Settings.*Actions.*Runners.*New self-hosted runner/s, "러너 추가 위치(Settings → Actions → Runners → New self-hosted runner)"],
  [/## .*윈도우/, "윈도우 절"], [/## .*맥/, "맥 절"], [/서비스/, "서비스로 돌리기"], [/절전|잠자기/, "전원·절전"],
  [/IT|보안 프로그램|회사/, "회사 IT 정책"], [/끄기|지우기|remove/, "멈추기·지우기"], [/공개 저장소|public/i, "공개 저장소 주의"],
]) ok(rx.test(doc), `안내에 ${m}`);
ok(!/\b[A-Z0-9]{29}\b/.test(doc) && !/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_/.test(doc), "안내에 토큰 값이 없다");
ok(!/--token\s+(?!<|\$|"<|\[)[A-Za-z0-9]{10,}/.test(doc), "--token 뒤에는 자리표시만");

console.log("아침 리포트 PC 절");
{
  const MAIN = "# 헤드리스 브라우저 수집 테스트 (2026-11-27T05:00Z)\n\n- **Nike** — 500개\n";
  const mj = { when: "2026-11-27T05:00:00Z" };
  const PC = "# PC 수집 — 내 PC 의 진짜 브라우저 (2026-11-27T00:10Z)\n\n## 목록 수집 (1)\n\n| ✅ | WHBM | chromium | 219 | 219 | |\n";
  const now = Date.parse("2026-11-27T10:00:00Z");
  const parts = (pc, when) => [...SIDE_JOBS.map((job) => ({ job, md: "# x\n", json: mj })), { job: PC_JOB, md: pc, json: when ? { when } : null }];
  const today = combine(MAIN, parts(PC, "2026-11-27T00:10:00Z"), mj, null, now);
  ok(/## PC 잡/.test(today) && /✅ 오늘 결과 — PC 잡/.test(today) && /WHBM/.test(today), "오늘 아침 PC 결과 → ✅");
  ok(/^### 목록 수집/m.test(today), "PC 리포트 제목은 한 단계 낮춘다");
  const stale = combine(MAIN, parts(PC, "2026-11-25T00:10:00Z"), mj, null, now);
  ok(/⚠ \*\*오래된 결과\*\* — PC 잡/.test(stale), "30시간보다 오래되면 ⚠ 오래된 결과(PC 가 꺼졌거나 러너가 안 돎)");
  const none = combine(MAIN, parts(null, null), mj, null, now);
  ok(/⚠ \*\*결과 없음\*\* — PC 잡 리포트\(pc-collect-report\.\*\)/.test(none), "리포트가 없으면 ⚠ 결과 없음");
  ok(combine(today, parts(PC, "2026-11-27T00:10:00Z"), mj, null, now) === today, "두 번 돌려도 한 번만 붙는다");
}

console.log("actionlint");
{
  const bin = process.env.ACTIONLINT || "actionlint";
  const r = spawnSync(bin, ["-shellcheck=", "-pyflakes=", ...readdirSync(join(ROOT, ".github/workflows")).map((f) => join(ROOT, ".github/workflows", f))], { cwd: ROOT, encoding: "utf8" });
  if (r.error) console.log(`  (actionlint 없음 — 건너뜀. CI 는 받아서 돌린다: ${String(r.error.code || r.error.message)})`);
  else ok(r.status === 0, `actionlint 통과(모든 워크플로)${r.status ? "\n" + r.stdout + r.stderr : ""}`);
}

if (bad) { console.error(`\nPC 수집 워크플로 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ PC 수집 워크플로·안내·아침 리포트 통과");
