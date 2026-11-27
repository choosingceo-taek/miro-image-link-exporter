#!/usr/bin/env node
// PC 수집(pc-collect.yml) 결과를 저장소에 올린다 — 윈도우·맥 어느 셸에서도 돌게 git 을 직접 부른다.
//
//   node scripts/pc-commit.mjs            (워크플로 안에서만 — GITHUB_ACTIONS=true 가 아니면 멈춘다)
//
// 올리는 것: pc-collect-report.json/.md(측정 실행이면 pc-collect-<태그>.*) · pc-collect-state.json · pc-enrich-state.json
// 운영 실행이면 아침 리포트(browser-collect-report.md)에 PC 절을 다시 붙여 함께 올린다(combine-collect-reports.mjs).
//
// 다른 워크플로가 먼저 올렸으면: 원격을 그대로 받고(reset --hard origin/브랜치) 이번 실행의 파일만 다시 쓴 뒤
// 아침 리포트를 그 위에서 다시 합쳐 올린다 — 남의 리포트를 덮지 않는다. 세 번 해 보고 안 되면 경고만 남긴다.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
if (process.env.GITHUB_ACTIONS !== "true" && !process.argv.includes("--force")) {
  console.error("pc-commit 은 워크플로 안에서만 돈다(작업 폴더를 원격으로 되돌리기 때문) — 직접 돌리려면 --force");
  process.exit(2);
}
const TAG = String(process.env.REPORT_TAG || "").replace(/[^\w.-]/g, "");
const BRANCH = process.env.GITHUB_REF_NAME || "main";
const base = TAG ? `pc-collect-${TAG}` : "pc-collect-report";
const files = [`${base}.json`, `${base}.md`, ...(TAG ? [] : ["pc-collect-state.json", "pc-enrich-state.json"])];
const keep = new Map(files.filter((f) => existsSync(join(ROOT, f))).map((f) => [f, readFileSync(join(ROOT, f))]));
if (!keep.size) { console.log("올릴 PC 리포트가 없음"); process.exit(0); }

const git = (...a) => execFileSync("git", a, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
const tryGit = (...a) => { try { git(...a); return true; } catch (e) { console.log(String(e.stderr || e.message).trim().slice(0, 300)); return false; } };
git("config", "user.name", "collect-bot");
git("config", "user.email", "collect-bot@users.noreply.github.com");

for (let i = 1; i <= 3; i++) {
  if (!tryGit("fetch", "origin", BRANCH)) continue;
  git("reset", "--hard", `origin/${BRANCH}`);
  for (const [f, buf] of keep) writeFileSync(join(ROOT, f), buf);
  const add = [...keep.keys()];
  if (!TAG) {
    // 아침 리포트에 PC 절을 붙인다(측정 실행은 붙이지 않는다).
    try {
      execFileSync(process.execPath, [join(ROOT, "scripts", "combine-collect-reports.mjs")], { cwd: ROOT, stdio: "inherit" });
      add.push("browser-collect-report.md");
    } catch (e) { console.log("아침 리포트 합치기 실패 — PC 리포트만 올림"); }
  }
  git("add", "--", ...add.filter((f) => existsSync(join(ROOT, f))));
  if (!git("diff", "--cached", "--name-only").trim()) { console.log("바뀐 것 없음"); process.exit(0); }
  git("commit", "-m", TAG ? `pc-collect: 측정 실행 ${TAG} 리포트 — 저장 안 함` : "pc-collect: 내 PC 진짜 브라우저 수집 결과");
  if (tryGit("push", "origin", `HEAD:${BRANCH}`)) { console.log(`올림 — ${add.join(", ")}`); process.exit(0); }
  await new Promise((r) => setTimeout(r, 5000 * i));
}
console.log("::warning::PC 리포트를 세 번 시도했지만 올리지 못함(아티팩트에는 남아 있음)");
