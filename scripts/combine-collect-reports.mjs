#!/usr/bin/env node
// 야간 헤드리스 수집의 잡 결과를 아침 리포트 한 장(browser-collect-report.md)에 모은다.
//
// 야간은 세 잡이 동시에 돈다:
//   Render 그룹(→ browser-collect-report.*) · 추가 브랜드(→ browser-collect-extra-report.*) ·
//   Oysho(→ browser-collect-oysho-report.* — 한 브랜드가 약 46분이라 자기 잡에서 돈다).
// owner 는 아침에 browser-collect-report.md 만 보므로, 다른 잡이 실패하거나 결과가 오래돼도
// 거기에 드러나야 한다. 그래서 그 파일 끝에 잡마다 절을 하나씩 붙인다(두 번 돌려도 한 번만 붙음).
//
//   node scripts/combine-collect-reports.mjs            (저장소 루트의 리포트들)
//   REPORT_DIR=<폴더> node scripts/combine-collect-reports.mjs
//
// 절마다 맨 위에 상태 한 줄을 적는다:
//   ✅ 오늘 결과 — 그 잡이 Render 그룹 잡과 같은 날(20시간 안) 끝났다
//   ⚠ 오래된 결과 — 그 잡 리포트가 20시간보다 오래됐다(오늘 잡이 실패했거나 돌지 않음)
//   ⚠ 결과 없음 — 그 잡 리포트 파일이 없다
//
// PC 잡(pc-collect.yml — owner PC 의 러너, 평일 아침)도 붙인다. 그 잡은 야간 잡보다 늦게(아침) 돌고 PC 가 꺼진 날은
// 돌지 않으므로, 오래됨을 '지금' 기준 30시간으로 본다. PC 잡이 끝나면 스스로 이 합치기를 다시 돌려 오늘 결과를 붙인다.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = process.env.REPORT_DIR || ROOT;
// 붙인 부분의 시작 표시. 첫 표시 앞까지가 Render 그룹 잡이 쓴 본문이다(두 번 돌려도 한 번만 붙게).
const MARK = "<!-- 추가 브랜드 잡(자동으로 붙임 — scripts/combine-collect-reports.mjs) -->";
const STALE_H = 20;

// 아침 리포트에 붙일 잡들(순서대로). file = 리포트 이름(.md/.json), label = 상태 줄에 쓰는 이름.
export const SIDE_JOBS = [
  { key: "extra", file: "browser-collect-extra-report", title: "추가 브랜드 잡 (browser-extra-brands.json)", label: "추가 브랜드 잡" },
  { key: "oysho", file: "browser-collect-oysho-report", title: "Oysho 잡 (파이어폭스 · 새 창 · 자기 시간 예산)", label: "Oysho 잡" },
];

// PC 잡 — browser-collect.yml 의 잡이 아니라서 SIDE_JOBS 와 따로 둔다(test-collect-workflow.mjs 가 SIDE_JOBS 를 그 잡들과 맞춰 본다).
export const PC_JOB = { key: "pc", file: "pc-collect-report", title: "PC 잡 (내 PC 의 진짜 브라우저 — pc-collect.yml)", label: "PC 잡", staleH: 30, ref: "now" };

const read = (f) => { try { return readFileSync(join(DIR, f), "utf8"); } catch (e) { return null; } };
const json = (f) => { try { return JSON.parse(read(f)); } catch (e) { return null; } };

// 한 잡의 절. md·js 가 없으면 '결과 없음', 오래됐으면 '오래된 결과'.
// job.ref === "now" 이면 오래됨을 지금 시각 기준으로(job.staleH 시간), 아니면 Render 그룹 잡이 끝난 시각 기준으로(20시간) 본다.
export function section(job, mainJson, md, js, now = Date.now()) {
  let status;
  if (!md || !js) status = `⚠ **결과 없음** — ${job.label} 리포트(${job.file}.*)가 없습니다. 오늘 그 잡이 실패했거나 돌지 않았습니다.`;
  else {
    const tm = job.ref === "now" ? now : Date.parse((mainJson && mainJson.when) || "") || now;
    const te = Date.parse(js.when || "") || 0;
    const hours = Math.round((tm - te) / 3_600_000);
    status = te && Math.abs(tm - te) <= (job.staleH || STALE_H) * 3_600_000
      ? `✅ 오늘 결과 — ${job.label} ${String(js.when).slice(0, 16)}Z`
      : `⚠ **오래된 결과** — ${job.label} 리포트가 ${te ? hours + "시간 전" : "언제인지 모름"}(${String(js.when || "?").slice(0, 16)}Z) 것입니다. 오늘 그 잡이 실패했거나 돌지 않았습니다.`;
  }
  const body = md ? String(md).replace(/^# .*\n/, "").replace(/^(#{2,5}) /gm, "#$1 ").trim() : "";
  return `## ${job.title}\n\n${status}\n\n${body}`.trim();
}

// parts: [{ job, md, json }] — 잡마다 하나. 예전 호출 모양(combine(mainMd, extraMd, mainJson, extraJson))도 받는다.
export function combine(mainMd, extraMdOrParts, mainJson, extraJson, now = Date.now()) {
  const parts = Array.isArray(extraMdOrParts) ? extraMdOrParts : [{ job: SIDE_JOBS[0], md: extraMdOrParts, json: extraJson }];
  const base = String(mainMd || "").split(MARK)[0].replace(/\s+$/, "");
  const secs = parts.map((p) => section(p.job, mainJson, p.md, p.json, now));
  return `${base}\n\n${MARK}\n\n${secs.join("\n\n")}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mainMd = read("browser-collect-report.md");
  if (mainMd == null) { console.log("browser-collect-report.md 가 없어 합치지 않음"); process.exit(0); }
  const parts = [...SIDE_JOBS, PC_JOB].map((job) => ({ job, md: read(job.file + ".md"), json: json(job.file + ".json") }));
  const out = combine(mainMd, parts, json("browser-collect-report.json"));
  writeFileSync(join(DIR, "browser-collect-report.md"), out);
  for (const m of out.split(MARK)[1].match(/^(✅|⚠)[^\n]*/gm) || []) console.log("아침 리포트에 붙임 — " + m.slice(0, 120));
}
