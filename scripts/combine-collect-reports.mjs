#!/usr/bin/env node
// 야간 헤드리스 수집의 두 잡 결과를 아침 리포트 한 장(browser-collect-report.md)에 모은다.
//
// 야간은 두 잡이 동시에 돈다: Render 그룹(→ browser-collect-report.*) · 추가 브랜드(→ browser-collect-extra-report.*).
// owner 는 아침에 browser-collect-report.md 만 보므로, 추가 브랜드 잡이 실패하거나 결과가 오래돼도
// 거기에 드러나야 한다. 그래서 그 파일 끝에 '추가 브랜드 잡' 절을 붙인다(두 번 돌려도 한 번만 붙음).
//
//   node scripts/combine-collect-reports.mjs            (저장소 루트의 두 리포트)
//   REPORT_DIR=<폴더> node scripts/combine-collect-reports.mjs
//
// 절 맨 위에 상태 한 줄을 적는다:
//   ✅ 오늘 결과 — 추가 브랜드 잡이 Render 그룹 잡과 같은 날(20시간 안) 끝났다
//   ⚠ 오래된 결과 — 추가 브랜드 잡 리포트가 20시간보다 오래됐다(오늘 잡이 실패했거나 돌지 않음)
//   ⚠ 결과 없음 — 추가 브랜드 잡 리포트 파일이 없다
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = process.env.REPORT_DIR || ROOT;
const MARK = "<!-- 추가 브랜드 잡(자동으로 붙임 — scripts/combine-collect-reports.mjs) -->";
const STALE_H = 20;

const read = (f) => { try { return readFileSync(join(DIR, f), "utf8"); } catch (e) { return null; } };
const json = (f) => { try { return JSON.parse(read(f)); } catch (e) { return null; } };

export function combine(mainMd, extraMd, mainJson, extraJson) {
  const base = String(mainMd || "").split(MARK)[0].replace(/\s+$/, "");
  let status;
  if (!extraMd || !extraJson) status = "⚠ **결과 없음** — 추가 브랜드 잡 리포트(browser-collect-extra-report.*)가 없습니다. 오늘 그 잡이 실패했거나 돌지 않았습니다.";
  else {
    const tm = Date.parse((mainJson && mainJson.when) || "") || Date.now();
    const te = Date.parse(extraJson.when || "") || 0;
    const hours = Math.round((tm - te) / 3_600_000);
    status = te && Math.abs(tm - te) <= STALE_H * 3_600_000
      ? `✅ 오늘 결과 — 추가 브랜드 잡 ${String(extraJson.when).slice(0, 16)}Z`
      : `⚠ **오래된 결과** — 추가 브랜드 잡 리포트가 ${te ? hours + "시간 전" : "언제인지 모름"}(${String(extraJson.when || "?").slice(0, 16)}Z) 것입니다. 오늘 그 잡이 실패했거나 돌지 않았습니다.`;
  }
  const body = extraMd ? String(extraMd).replace(/^# .*\n/, "").replace(/^(#{2,5}) /gm, "#$1 ").trim() : "";
  return `${base}\n\n${MARK}\n\n## 추가 브랜드 잡 (browser-extra-brands.json)\n\n${status}\n\n${body}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mainMd = read("browser-collect-report.md");
  if (mainMd == null) { console.log("browser-collect-report.md 가 없어 합치지 않음"); process.exit(0); }
  const out = combine(mainMd, read("browser-collect-extra-report.md"), json("browser-collect-report.json"), json("browser-collect-extra-report.json"));
  writeFileSync(join(DIR, "browser-collect-report.md"), out);
  console.log("아침 리포트에 추가 브랜드 잡 절을 붙임 — " + (out.match(/(✅|⚠)[^\n]*/) || [""])[0].slice(0, 120));
}
