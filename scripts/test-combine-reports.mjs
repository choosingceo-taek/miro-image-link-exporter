#!/usr/bin/env node
// 아침 리포트 합치기(combine-collect-reports.mjs) 시험 — 추가 브랜드 잡의 결과·실패가 owner 가 보는
// browser-collect-report.md 에 드러나는지, 두 번 돌려도 한 번만 붙는지 본다. 네트워크·브라우저 없음.
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { combine } from "./combine-collect-reports.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const ok = (c, m) => { if (c) console.log("  ✅ " + m); else { console.error("  ❌ " + m); bad++; } };

const MAIN = "# 헤드리스 브라우저 수집 테스트 (2026-11-26T05:00Z)\n\n## ✅ 자동화 가능 (1)\n\n- **Nike** — 500개\n";
const EXTRA = "# 헤드리스 브라우저 수집 테스트 (2026-11-26T04:40Z)\n\n## ✅ 자동화 가능 (1)\n\n- **Gap** — 470개\n  - 0개 · https://gap/x ← HTTP 403\n";
const mj = { when: "2026-11-26T05:00:00Z" };

{
  const out = combine(MAIN, EXTRA, mj, { when: "2026-11-26T04:40:00Z" });
  ok(out.startsWith(MAIN.trim()), "Render 그룹 리포트는 그대로 앞에 둔다");
  ok(/## 추가 브랜드 잡/.test(out) && /\*\*Gap\*\* — 470개/.test(out) && /HTTP 403/.test(out), "추가 브랜드 잡의 브랜드·실패 줄이 아침 리포트에 들어간다");
  ok(/✅ 오늘 결과/.test(out), "같은 날 결과면 ✅");
  ok(/^### ✅ 자동화 가능/m.test(out), "추가 잡의 제목은 한 단계 낮춘다(## → ###)");
  const twice = combine(out, EXTRA, mj, { when: "2026-11-26T04:40:00Z" });
  ok(twice === out, "두 번 돌려도 한 번만 붙는다");
}
{
  const out = combine(MAIN, EXTRA, mj, { when: "2026-11-24T04:40:00Z" });
  ok(/⚠ \*\*오래된 결과\*\*/.test(out), "추가 잡 리포트가 20시간보다 오래되면 ⚠ 오래된 결과");
}
{
  const out = combine(MAIN, null, mj, null);
  ok(/⚠ \*\*결과 없음\*\*/.test(out), "추가 잡 리포트가 없으면 ⚠ 결과 없음");
}
{
  // 파일로 돌리기(REPORT_DIR)
  const dir = mkdtempSync(join(tmpdir(), "combine-"));
  writeFileSync(join(dir, "browser-collect-report.md"), MAIN);
  writeFileSync(join(dir, "browser-collect-report.json"), JSON.stringify(mj));
  writeFileSync(join(dir, "browser-collect-extra-report.md"), EXTRA);
  writeFileSync(join(dir, "browser-collect-extra-report.json"), JSON.stringify({ when: "2026-11-26T04:40:00Z" }));
  const r = spawnSync(process.execPath, [join(ROOT, "scripts/combine-collect-reports.mjs")], { env: { ...process.env, REPORT_DIR: dir }, encoding: "utf8" });
  const md = readFileSync(join(dir, "browser-collect-report.md"), "utf8");
  ok(r.status === 0 && /\*\*Gap\*\*/.test(md), "파일로 돌려도 browser-collect-report.md 에 붙는다");
}

if (bad) { console.error(`\n리포트 합치기 ${bad}건 실패`); process.exit(1); }
console.log("✅ 리포트 합치기 통과 — 추가 브랜드 잡 결과·실패가 아침 리포트에 보인다");
