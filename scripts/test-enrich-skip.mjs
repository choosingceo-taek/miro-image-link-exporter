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
  ["isSkipped(c.site)", "후보를 고를 때 이력을 확인하지 않는다 — 매일 같은 브랜드를 다시 집는다"],
  ["state.blocked[c.site] = {", "차단 결과를 기록하지 않는다 — 내일도 똑같이 시도한다"],
  ["writeFileSync(STATE_PATH", "이력을 저장하지 않는다 — 실행이 끝나면 잊는다"],
  ["delete state.blocked[c.site]", "다시 읽히기 시작해도 이력을 안 푼다 — 영구 제외가 된다"],
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

if (bad) { console.error(`\n크롬 보강 건너뛰기 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 크롬 보강 건너뛰기 통과 — 판정 ${CASES.length}건 · 배선 8종 (${SKIP_DAYS}일 제외 · 차단 ${BLOCK_RATIO * 100}% 기준)`);
