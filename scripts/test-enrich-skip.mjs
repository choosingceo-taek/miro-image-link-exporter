#!/usr/bin/env node
// 크롬 보강이 '차단 확정' 브랜드를 계속 붙잡고 있지 않는지 확인한다.
//
// 왜 있는 테스트인지: 이 도구는 처음에 "혼용률이 가장 비어 있는 브랜드"만 보고
// 대상을 골랐다. 사이트가 우리를 막으면 그 브랜드는 영영 0% 이므로, 영원히
// 1등으로 남는다. 실제로 닷새 동안 3,472개를 시도해 0개를 얻었고, 그동안
// 채워질 수 있는 브랜드는 뒤에서 차례를 못 받았다. Aerie 113개·Lucky Brand
// 120개를 찾아냈던 그 예산이 통째로 버려졌다.
//
// 조용히 망가지는 종류의 결함이다 — 워크플로는 매일 초록불로 끝나고, 리포트도
// 정상으로 보인다. 그래서 규칙 자체를 여기에 못 박는다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "scripts/enrich-comp-browser.mjs"), "utf8");

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// ── ① 판정 규칙을 떼어 내 직접 돌려 본다 ──
// 소스에서 임계값을 읽어 온다. 숫자를 테스트에 베껴 쓰면 한쪽만 바뀌어도 모른다.
const ratioM = src.match(/const BLOCK_RATIO = ([\d.]+)/);
const daysM = src.match(/const SKIP_DAYS = Math\.max\(1, Number\(process\.env\.SKIP_DAYS\) \|\| (\d+)\)/);
if (!ratioM) fail("BLOCK_RATIO 를 찾지 못함");
if (!daysM) fail("SKIP_DAYS 기본값을 찾지 못함");
const BLOCK_RATIO = Number(ratioM ? ratioM[1] : 0.9);
const SKIP_DAYS = Number(daysM ? daysM[1] : 14);

if (SKIP_DAYS < 3) fail(`SKIP_DAYS 가 ${SKIP_DAYS}일 — 너무 짧아 며칠 만에 다시 헛돈다`);
if (SKIP_DAYS > 60) fail(`SKIP_DAYS 가 ${SKIP_DAYS}일 — 사이트가 다시 열려도 두 달을 놓친다`);
if (BLOCK_RATIO < 0.5 || BLOCK_RATIO > 1) fail(`BLOCK_RATIO 가 ${BLOCK_RATIO} — 범위가 이상하다`);

// 실제 운영에서 나온 숫자로 판정을 확인한다.
const shouldBlock = (tried, blocked) => tried >= 10 && blocked / tried >= BLOCK_RATIO;
const CASES = [
  // [설명, 시도, 차단, 막힘으로 볼 것인가]
  ["Zara — 120개 전부 차단", 120, 120, true],
  ["Garnet hill — 106개 전부 차단", 106, 106, true],
  ["Aerie — 잘 읽힌 날", 120, 0, false],
  ["Lucky Brand — 100% 성공", 120, 0, false],
  ["The white company — 일부만 막힘(81/90)", 90, 81, true],
  ["절반만 막힘 — 사이트 탓인지 불분명하므로 계속 시도", 100, 50, false],
  ["표본이 너무 적으면 판정하지 않는다", 5, 5, false],
];
for (const [label, tried, blocked, want] of CASES) {
  const got = shouldBlock(tried, blocked);
  if (got !== want) fail(`${label} — 기대 ${want} 실제 ${got}`);
}

// ── ② 배선이 코드에 남아 있는가 ──
// 판정만 맞고 실제로 건너뛰지 않으면 아무 의미가 없다.
const MUST = [
  ["const STATE_PATH", "이력 파일 경로가 없다"],
  ["isSkipped(state, c.site, eng,", "후보를 고를 때 이력을 확인하지 않는다 — 매일 같은 브랜드를 다시 집는다"],
  ["const eng = engineOf(c.site);", "후보를 고를 때 '이 브랜드를 읽을 엔진' 기준으로 이력을 보지 않는다"],
  ["recordResult(state, c.site, c.engine,", "차단 결과를 기록하지 않는다 — 내일도 똑같이 시도한다"],
  ["writeFileSync(STATE_PATH", "이력을 저장하지 않는다 — 실행이 끝나면 잊는다"],
  ["normalizeState(JSON.parse(", "이력을 읽을 때 예전 모양을 새 모양으로 바꾸지 않는다"],
];
for (const [needle, why] of MUST) {
  if (!src.includes(needle)) fail(`${why} (${needle} 없음)`);
}

// 사람이 이름을 직접 준 경우(BRANDS=)에는 건너뛰면 안 된다 — 확인하려고 부른 것이다.
const selBlock = src.slice(src.indexOf("if (!want.length) {"), src.indexOf("if (!targets.length)"));
if (!selBlock.includes("isSkipped")) fail("자동 선택 경로에 건너뛰기가 없다");
const manualBlock = src.slice(src.indexOf("} else {", src.indexOf("scored.sort")), src.indexOf("if (!targets.length)"));
if (manualBlock.includes("isSkipped")) {
  fail("BRANDS= 로 직접 지정한 경우까지 건너뛴다 — 확인하려고 불렀는데 아무것도 안 한다");
}

// DRY 실행이 이력을 잠그면 안 된다.
if (!/if \(STORE\) writeFileSync\(STATE_PATH/.test(src)) {
  fail("DRY 실행에서도 이력을 쓴다 — 시험 삼아 돌려 보다가 후보가 잠긴다");
}

// 건너뛴 브랜드를 리포트에 남겨야 사람이 알아챈다.
if (!src.includes("건너뜀(차단 이력)")) fail("건너뛴 브랜드를 리포트에 안 남긴다 — 조용히 빠지면 눈치채지 못한다");

// ── ④ 이력은 엔진마다 따로다 ──
// 예전엔 브랜드 하나에 기록이 하나라, 크롬으로 막힌 브랜드가 14일 동안 통째로 빠졌다.
// 파이어폭스로는 열리는 브랜드도 시도조차 못 했다. 규칙 구간을 떼어 직접 돌린다.
const a = src.indexOf("// ── 엔진별 차단 이력 규칙 시작"), b = src.indexOf("// ── 엔진별 차단 이력 규칙 끝");
if (a < 0 || b < 0) fail("엔진별 이력 규칙 구간을 찾지 못함");
else {
  const R = new Function(src.slice(a, b) +
    "\n return { normalizeState, isSkipped, pickEngine, recordResult, chromiumBlocked };")();
  const NOW = Date.UTC(2026, 10, 24);
  const DAY = 86400000;
  // 예전 모양 — {site: {brand, until, …}} 는 크롬(playwright) 기록으로 읽는다.
  const old = { blocked: {
    "zara.com.zara": { brand: "Zara", until: NOW + 5 * DAY, at: "2026-11-19", ratio: 100 },
    "joules.com.joules": { brand: "Joules", until: NOW - 3 * DAY, at: "2026-10-01", ratio: 100 },
  } };
  const st = R.normalizeState(old);
  if (!st.blocked["zara.com.zara"] || !st.blocked["zara.com.zara"].playwright) fail("예전 모양을 playwright 기록으로 읽지 않는다");
  if (!R.isSkipped(st, "zara.com.zara", "playwright", NOW)) fail("크롬으로 막힌 기간 안인데 크롬으로 다시 시도한다");
  if (R.isSkipped(st, "zara.com.zara", "firefox", NOW)) fail("크롬으로 막혔다고 파이어폭스까지 건너뛴다 — 이 변경의 핵심");
  if (R.isSkipped(st, "joules.com.joules", "playwright", NOW)) fail("기간이 지난 기록인데 계속 건너뛴다");
  // 새 모양은 그대로 읽힌다(두 번 읽어도 같다).
  const again = R.normalizeState(JSON.parse(JSON.stringify(st)));
  if (JSON.stringify(again) !== JSON.stringify(st)) fail("새 모양을 다시 읽으면 모양이 바뀐다");
  if (Object.keys(R.normalizeState(null).blocked).length) fail("빈 이력이 비어 있지 않다");
  if (Object.keys(R.normalizeState({ blocked: { x: "망가진 값" } }).blocked).length) fail("망가진 항목을 받아들인다");

  // auto: 지금 크롬으로 막혀 있으면 파이어폭스로, 아니면 playwright 로.
  if (R.pickEngine(st, "zara.com.zara", "auto", "firefox", NOW) !== "firefox") fail("auto 가 크롬 차단 브랜드를 파이어폭스로 안 보낸다");
  // 기간이 지난 크롬 기록은 크롬으로 다시 본다 — 안 그러면 다시 열린 사이트(Reformation)가
  // 영영 파이어폭스에 묶이고, 크롬 기록은 크롬으로 읽힐 기회가 없어 풀리지도 않는다.
  if (R.pickEngine(st, "joules.com.joules", "auto", "firefox", NOW) !== "playwright") fail("auto 가 기간이 지난 크롬 기록에 묶여 크롬을 다시 시도하지 않는다");
  if (R.pickEngine(st, "aerie.com.aerie", "auto", "firefox", NOW) !== "playwright") fail("auto 가 이력 없는 브랜드까지 파이어폭스로 보낸다");
  if (R.pickEngine(st, "zara.com.zara", "patchright", "firefox", NOW) !== "patchright") fail("엔진을 직접 고르면 그대로 써야 한다");

  // 기록: 파이어폭스로 막히면 파이어폭스 칸에만 적고, 크롬 기록은 건드리지 않는다.
  // 처음 막히면 '의심' — 2일만 쉰다(한 실행의 러너 IP 운으로 14일을 잃지 않게: Chico's 12/20 → 0/20).
  const v1 = R.recordResult(st, "zara.com.zara", "firefox", { brand: "Zara", tried: 20, blocked: 20, ok: 0 }, NOW, SKIP_DAYS, BLOCK_RATIO);
  if (v1 !== "suspect" || !st.blocked["zara.com.zara"].firefox || !st.blocked["zara.com.zara"].firefox.suspect) fail(`처음 막힌 것을 '의심'으로 적지 않는다(${v1})`);
  if (!st.blocked["zara.com.zara"].playwright) fail("파이어폭스를 기록하면서 크롬 기록을 지웠다");
  if (st.blocked["zara.com.zara"].firefox.until !== NOW + 2 * DAY) fail("처음 막힌 것의 제외 기간이 2일이 아니다");
  // 의심 기간이 끝난 뒤 다시 막히면 확정 — SKIP_DAYS.
  const v1b = R.recordResult(st, "zara.com.zara", "firefox", { brand: "Zara", tried: 20, blocked: 20, ok: 0 }, NOW + 3 * DAY, SKIP_DAYS, BLOCK_RATIO);
  if (v1b !== "blocked" || st.blocked["zara.com.zara"].firefox.suspect) fail(`두 번째로 막혔는데 확정하지 않는다(${v1b})`);
  if (st.blocked["zara.com.zara"].firefox.until !== NOW + 3 * DAY + SKIP_DAYS * DAY) fail("확정 제외 기간이 SKIP_DAYS 와 다르다");
  // 예전 기록(suspect 표시 없음)이 있는 엔진은 바로 확정.
  {
    const s2 = R.normalizeState(old);
    if (R.recordResult(s2, "zara.com.zara", "playwright", { brand: "Zara", tried: 20, blocked: 20, ok: 0 }, NOW, SKIP_DAYS, BLOCK_RATIO) !== "blocked") fail("예전 확정 기록이 있는데 다시 '의심'부터 시작한다");
    // 앞 기록이 끝난 지 30일이 넘었으면 새로 시작한다.
    const s3 = R.normalizeState({ blocked: { "x.com.x": { brand: "X", until: NOW - 40 * DAY, at: "2026-09-01", ratio: 100 } } });
    if (R.recordResult(s3, "x.com.x", "playwright", { brand: "X", tried: 20, blocked: 20, ok: 0 }, NOW, SKIP_DAYS, BLOCK_RATIO) !== "suspect") fail("40일 전에 끝난 기록 때문에 바로 14일을 잠근다");
  }
  // 파이어폭스로 다시 읽히면 파이어폭스 칸만 푼다 — 크롬 기록은 남아 auto 가 계속 파이어폭스를 쓴다.
  const v2 = R.recordResult(st, "zara.com.zara", "firefox", { brand: "Zara", tried: 20, blocked: 2, ok: 15 }, NOW, SKIP_DAYS, BLOCK_RATIO);
  if (v2 !== "cleared" || st.blocked["zara.com.zara"].firefox) fail("다시 읽혔는데 파이어폭스 이력을 안 푼다");
  if (!st.blocked["zara.com.zara"].playwright) fail("파이어폭스로 읽혔다고 크롬 기록까지 지웠다 — auto 가 다음 날 크롬으로 되돌아간다");
  // 크롬으로 읽히면 크롬 칸을 풀고, 칸이 다 비면 사이트 줄도 지운다.
  R.recordResult(st, "zara.com.zara", "playwright", { brand: "Zara", tried: 20, blocked: 0, ok: 20 }, NOW, SKIP_DAYS, BLOCK_RATIO);
  if (st.blocked["zara.com.zara"]) fail("칸이 다 비었는데 사이트 줄이 남는다");
  // 표본이 적으면 판정하지 않는다.
  if (R.recordResult(st, "x.com.x", "firefox", { brand: "X", tried: 5, blocked: 5, ok: 0 }, NOW, SKIP_DAYS, BLOCK_RATIO) !== "") fail("표본 5개로 차단 판정을 했다");
}

// ── ③ '사이트가 안 적음'도 다시 안 읽어야 한다 ──
// 차단만 기억하고 미표기는 기억하지 않아서, 페이지를 정상적으로 열고 소재가
// 없는 걸 확인한 뒤 다음 날 또 여는 짓을 매일 했다. 8/20 실행에서 시도 665개 중
// 305개(46%)가 그런 상품이었다 — Prana 65 · Loft 120 · Boldest 120.
const noneDays = src.match(/const NONE_DAYS = Math\.max\(1, Number\(process\.env\.NONE_DAYS\) \|\| (\d+)\)/);
if (!noneDays) fail("미표기 재시도 기간(NONE_DAYS)이 없다 — 매일 같은 상품을 다시 읽는다");
else if (Number(noneDays[1]) < 7) fail(`NONE_DAYS 가 ${noneDays[1]}일 — 너무 짧아 곧 다시 헛돈다`);

if (!/o\.none && o\.t && now - o\.t < NONE_DAYS/.test(src)) {
  fail("미표기 상품을 건너뛰는 조건이 없다");
}
// 확인 시각(t)이 없으면 건너뛰면 안 된다 — 언제 확인했는지 모르는 값을 영구
// 제외하면 사이트가 표기를 추가해도 영영 못 읽는다.
if (!/o\.none && o\.t/.test(src)) fail("확인 시각 없이 건너뛴다 — 영구 제외가 된다");

// 브랜드 고르기에서도 미표기를 '처리됨'으로 세야 한다. 안 그러면 전부 미표기인
// 브랜드가 계속 1순위를 차지하고 자리만 먹는다.
const sel = src.slice(src.indexOf("let filled = 0"), src.indexOf("scored.sort"));
if (!sel.includes("if (noneSeenBy(o, eng)) settled++")) {
  fail("브랜드 점수에서 미표기를 (이 엔진이 확인한 것으로) 안 센다 — Loft 처럼 전부 미표기인 브랜드가 매일 1순위가 된다");
}
if (!sel.includes("c.count - settled")) fail("남은 개수를 미표기 포함으로 세지 않는다");

// ── ⑤ none 을 누가 적었나(nv) · 지금 페이지 값과 보관본 값 ──
// 규칙은 enrich-comp.mjs 한 벌이고 크롬 보강은 그 구간을 떼어 쓴다. 여기서 직접 돌린다.
let nRule = 0;
{
  const ec = readFileSync(join(ROOT, "scripts/enrich-comp.mjs"), "utf8");
  const A = "// ── 혼용률 출처·none 표시 규칙 시작", B = "// ── 혼용률 출처·none 표시 규칙 끝";
  if (ec.indexOf(A) < 0 || ec.indexOf(B) < 0) fail("enrich-comp.mjs 에 출처·none 규칙 구간이 없다");
  if (!src.includes(A) || !src.includes(B)) fail("크롬 보강이 출처·none 규칙 구간을 떼어 쓰지 않는다(사본이 생기면 갈라진다)");
  const validComp = (s2) => /^([A-Za-z]+ \d{1,3}%)( \/ [A-Za-z]+ \d{1,3}%)*(\n([A-Za-z]+ \d{1,3}%)( \/ [A-Za-z]+ \d{1,3}%)*)?$/.test(String(s2 || "").trim());
  const R = new Function("validComp", ec.slice(ec.indexOf(A), ec.indexOf(B)) +
    "\n return { noneSeenBy, markNone, clearNone, applyLiveComp };")(validComp);
  const eq = (label, got, want) => { nRule++; if (JSON.stringify(got) !== JSON.stringify(want)) fail(`${label}: 기대 ${JSON.stringify(want)} 실제 ${JSON.stringify(got)}`); };
  // nv 없는 예전 none = fetch·크롬이 적은 것. 파이어폭스는 한 번 더 본다.
  eq("예전 none · playwright", R.noneSeenBy({ none: 1 }, "playwright"), true);
  eq("예전 none · patchright", R.noneSeenBy({ none: 1 }, "patchright"), true);
  eq("예전 none · firefox", R.noneSeenBy({ none: 1 }, "firefox"), false);
  eq("fetch 만 · playwright", R.noneSeenBy({ none: 1, nv: "fetch" }, "playwright"), false);
  eq("firefox 가 적음 · firefox", R.noneSeenBy({ none: 1, nv: "firefox" }, "firefox"), true);
  eq("none 아님", R.noneSeenBy({ nv: "firefox" }, "firefox"), false);
  // markNone: 이 엔진을 더한다(예전 none 이면 예전 몫도 남긴다) — 엔진마다 상품당 한 번
  { const o = { none: 1 }; R.markNone(o, "firefox"); eq("예전 none 에 firefox 더함", o, { none: 1, nv: "chromium,fetch,firefox" }); }
  { const o = {}; R.markNone(o, "fetch"); eq("새 none(fetch)", o, { none: 1, nv: "fetch" }); }
  { const o = { none: 1, nv: "fetch" }; R.markNone(o, "playwright"); R.markNone(o, "playwright"); eq("같은 엔진 두 번", o, { none: 1, nv: "chromium,fetch" }); }
  // applyLiveComp: 지금 페이지에서 읽은 혼용률
  { const o = { none: 1, nv: "fetch" }; eq("빈 칸 채움", R.applyLiveComp(o, "Cotton 100%").act, "set"); eq("빈 칸 채움 결과", o, { comp: "Cotton 100%" }); }
  { const o = { comp: "Cotton 95% / Elastane 5%", via: "wayback", wd: "20260712", color: "White" };
    eq("보관본과 같은 값(순서 다름)", R.applyLiveComp(o, "Elastane 5% / Cotton 95%").act, "same");
    eq("확인됨 → via·wd 지움", o, { comp: "Cotton 95% / Elastane 5%", color: "White" }); }
  { const o = { comp: "Cotton 100%", via: "wayback", wd: "20250101" };
    const r = R.applyLiveComp(o, "Linen 100%");
    eq("보관본과 다른 값 → 지금 페이지가 이김", r.act, "replace");
    eq("바꾼 결과", o, { comp: "Linen 100%" });
    eq("엇갈림 기록", r.conflict, { old: "Cotton 100%", oldVia: "wayback", oldWd: "20250101", live: "Linen 100%" }); }
  { const o = { comp: "Cashmere 100%" };
    const r = R.applyLiveComp(o, "Wool 100%");
    eq("지금 페이지에서 읽었던 값과 다름 → 유지", r.act, "keep");
    eq("유지 결과", o, { comp: "Cashmere 100%" });
    eq("유지도 기록", !!r.conflict, true); }
  { const o = { none: 1 }; eq("옳지 않은 값은 무시", R.applyLiveComp(o, "Cotton 60% / Wool").act, ""); eq("무시하면 그대로", o, { none: 1 }); }
}
// 배선: 크롬 보강이 이 규칙으로 합치고(예전의 { ...기존, ...새 값 } 이 아니라), none 은 이 엔진이 본 것만 믿는다.
for (const [needle, why] of [
  ["applyLiveComp(cur, v.comp)", "지금 페이지 혼용률을 출처 규칙으로 합치지 않는다 — via:\"wayback\" 이 남는다"],
  ["markNone(cur, c.engine)", "none 에 이 엔진(nv)을 남기지 않는다"],
  ["if (noneSeenBy(o, c.engine)) { skippedNone++; return false; }", "다른 엔진이 적은 none 까지 건너뛴다 — 새 엔진이 다시 볼 기회가 없다"],
  ["productRead(html, p.name", "껍데기 페이지를 none 으로 적는다"],
  ["blocked: stat.blocked + stat.shell", "껍데기를 차단으로 세지 않는다 — 크롬이 껍데기만 받는 브랜드가 auto 에서 파이어폭스로 안 넘어간다"],
  ["unseenBest > 30", "auto 가 '파이어폭스가 아직 안 본 none' 이 쌓인 브랜드를 다시 보지 않는다(Patagonia)"],
]) { nRule++; if (!src.includes(needle)) fail(`${why} (${needle} 없음)`); }
if (/merged\[u\] = \{ \.\.\.\(merged\[u\] \|\| \{\}\), \.\.\.v/.test(src)) fail("예전 병합({ ...기존, ...새 값 })이 남아 있다");

if (bad) { console.error(`\n크롬 보강 건너뛰기 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 크롬 보강 건너뛰기 통과 — 판정 ${CASES.length}건 · 배선 14종 · 엔진별 이력 22건 · none 출처·병합 ${nRule}건 (${SKIP_DAYS}일 제외 · 차단 ${BLOCK_RATIO * 100}% 기준)`);
