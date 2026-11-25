#!/usr/bin/env node
// 접근 지도 만들기 — docs/access-map.md(사람용) · access-map.json(기계용)을 같은 사실로 만든다.
//
// 읽는 것(모두 저장소 안 — 네트워크 안 씀):
//   access-measure/inputs/     Render 의 브랜드·카테고리 목록, 프리페치 리포트 6일치, main 의 11/25 야간 리포트 스냅샷
//   try-engines-results-*.json 접근 지도 측정 실행(access-measure/RUNS.md)의 페이지별 결과와 근거
//   access-measure/verdicts.json  사람이 근거를 보고 내린 판정(상태·원인·고치는 법). 숫자는 여기 적지 않고
//                              위 두 곳에서 다시 센다 — 판정 파일에는 '왜'만 둔다.
// 판정 파일에 없는 브랜드는 규칙으로 정한다(아래 autoListing/autoProduct) — 그 행은 '규칙'으로 표시된다.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IN = join(ROOT, "access-measure/inputs");
const J = (p) => JSON.parse(readFileSync(p, "utf8"));
const links = J(join(IN, "category-links.json"));
const blocked = J(join(IN, "blocked-brands.json"));
const audit = J(join(IN, "catalog-audit.json"));
const bc = J(join(IN, "browser-collect-report.json"));
const ebState = J(join(IN, "enrich-browser-state.json"));
const verdicts = existsSync(join(ROOT, "access-measure/verdicts.json")) ? J(join(ROOT, "access-measure/verdicts.json")) : {};
const prefetch = readdirSync(IN).filter((f) => /^prefetch-report-/.test(f)).sort().reverse().map((f) => J(join(IN, f)));
const CATS = ["tops", "sweatshirts", "shirts", "dresses", "pants"];

// ── 측정 실행 결과 모으기 ────────────────────────────────────────────
const runs = [];
for (const f of readdirSync(ROOT).filter((f) => /^try-engines-results-\d+\.json$/.test(f)).sort()) {
  try { const d = J(join(ROOT, f)); runs.push({ id: f.match(/\d+/)[0], ...d }); } catch (e) {}
}
// url → engine → [{run, v, cause, status, by, conf, n}]
const obs = new Map();
const catalogs = new Map();   // brand(lower) → 가장 최근 카탈로그 훑기
for (const r of runs) {
  for (const [eng, byUrl] of Object.entries(r.results || {})) {
    for (const [url, x] of Object.entries(byUrl)) {
      if (!x || x.v === "skip") continue;
      if (!obs.has(url)) obs.set(url, {});
      const o = obs.get(url);
      (o[eng] = o[eng] || []).push({
        run: r.id, ip: (r.meta || {}).ip || "", at: (r.meta || {}).at || r.at, v: x.v, cause: x.cause, status: (x.ev || {}).status || 0,
        by: x.who ? x.who.by : "", conf: x.who ? x.who.confidence : "", signals: x.who ? x.who.signals : [],
        n: x.collector != null ? x.collector : x.cards, title: (x.ev || {}).title || "", redirect: (x.ev || {}).redirect || "",
        markers: (x.ev || {}).markers || [], note: x.note || "", finalUrl: (x.ev || {}).finalUrl || "", comp: x.comp || "",
      });
    }
  }
  for (const c of r.catalogs || []) if (c && !c.missing && c.bySrc) catalogs.set(String(c.brand).toLowerCase(), { ...c, run: r.id });
}

export { runs, obs, catalogs, links, blocked, audit, bc, ebState, verdicts, prefetch, CATS };

// ── 야간 리포트(11/25 main)에서 브랜드별 사실 ──────────────────────────
const enrichMd = readFileSync(join(IN, "enrich-comp-report.md"), "utf8");
const enrichPaths = new Map();   // brand → "성공 … / 실패 …" (야간 fetch 보강의 경로별 개수)
for (const line of enrichMd.split("\n")) {
  const m = line.match(/^\| (.+?) \| (✅|—) \| .+? \| .+? \| .+? \| (.*) \|$/);
  if (m && m[3].trim()) enrichPaths.set(m[1].trim(), m[3].trim());
}
const ebMd = readFileSync(join(IN, "enrich-browser-report.md"), "utf8");
const enrichBrowser = new Map();   // brand → {engine, tried, filled, none, shell, blocked}
for (const line of ebMd.split("\n")) {
  const m = line.match(/^\| (.+?) \| (firefox|chromium|playwright) \| (\d+) \| (\d+) \| \*\*(\d+)\*\* \| (\d+) \| (\d+) \| (\d+) \| (\d+) \|$/);
  if (m) enrichBrowser.set(m[1], { engine: m[2], products: +m[3], tried: +m[4], filled: +m[5], none: +m[6], shell: +m[7], blocked: +m[8], err: +m[9] });
}
const chromiumBlocked = new Map();   // brand → {engine: at}
for (const v of Object.values(ebState.blocked || {})) for (const [eng, x] of Object.entries(v)) {
  if (!chromiumBlocked.has(x.brand)) chromiumBlocked.set(x.brand, {});
  chromiumBlocked.get(x.brand)[eng] = `${x.at}${x.suspect ? "(의심)" : ""} ${x.ratio}%`;
}
const groupOf = (b) => blocked.brands.includes(b) ? "extension" : blocked.browser.includes(b) ? "browser" : "server";
const field = new Map(audit.fieldCoverage.map((x) => [x.brand, x]));
const extAge = new Map(audit.extension.map((x) => [x.name, x]));
const deadUrls = new Map(audit.deadUrls.map((x) => [x.brand, x.dead]));
const bcBy = new Map(bc.results.map((x) => [x.brand, x]));
const pfHist = (b) => prefetch.map((r) => { const x = r.results.find((y) => y.name === b); return x ? { when: r.when.slice(0, 10), ok: x.ok, collected: x.collected, stored: x.stored, warns: x.warns || [] } : null; }).filter(Boolean);
const urlsOf = (b) => { const out = []; for (const c of CATS) for (const u of (links[b] || {})[c] || []) if (!out.some((x) => x.url === u)) out.push({ url: u, cat: c }); return out; };

export { enrichPaths, enrichBrowser, chromiumBlocked, groupOf, field, extAge, deadUrls, bcBy, pfHist, urlsOf };
