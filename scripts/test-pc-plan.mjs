#!/usr/bin/env node
// PC 수집의 브랜드·엔진 고르기(pc-plan.mjs)와 한도(pc-limits.mjs) 시험 — 네트워크·브라우저 없음.
//  · 접근 지도(진짜 access-map.json)의 측정으로 브랜드별 엔진·새 창이 근거대로 골라지는가
//  · PC 에서 잰 결과(2번 연달아 막힘)로 엔진을 바꾸고, 둘 다 막히면 멈추는가 — 우회하지 않는다
//  · 최근 저장된 목록은 건너뛰고(쓰기 절약), 사람이 고른 브랜드는 그대로 도는가
//  · 쓰기 예산 나누기 · 같은 주소 3번 · 같은 호스트 1초 · 429 멈춤 · 같은 브랜드 저장 한 번
//  · 측정 실행(report_tag)은 store=0 으로만
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { evidenceEngine, choose, buildPlan, updateState, parseEnrichTable, splitBudget, STOP_DAYS, DAY } from "./pc-plan.mjs";
import { emptyRunState, politeBefore, politeAfter, classifyWorker, writeDecide } from "./pc-limits.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const ok = (c, m) => { if (c) console.log("  ✅ " + m); else { console.error("  ❌ " + m); bad++; } };
const AM = JSON.parse(readFileSync(join(ROOT, "access-map.json"), "utf8")).brands;
const am = (n) => AM.find((b) => b.brand === n);
const pick = (n, stage = "listing") => evidenceEngine(am(n), stage);

console.log("접근 지도 근거로 고르기(진짜 access-map.json)");
for (const n of ["H&M", "Arket", "&Other Stories", "L.L bean"]) ok(pick(n).engine === "firefox" && !pick(n).fresh, `${n} 목록 → 파이어폭스(크롬만 막힘: ${pick(n).why.slice(0, 70)})`);
for (const n of ["Garnet hill", "Massimo Dutti"]) ok(pick(n).engine === "firefox" && pick(n).fresh, `${n} 목록 → 파이어폭스 · 새 창(한 창이면 첫 페이지만)`);
for (const n of ["Lululemon", "Sezane", "Mango", "Paige", "Joules", "Fatface", "Theory", "Eileen fisher", "Lands end", "Addidas", "Free People", "Abercrombie & Fitch"]) {
  ok(pick(n).engine === "chrome" && !pick(n).fresh, `${n} 목록 → 크롬(데이터센터 모든 엔진 막힘 · 확장 = 진짜 크롬이 읽음)`);
}
ok(pick("Anthropologie").engine === "chrome" && pick("Anthropologie").fresh, "Anthropologie 목록 → 크롬 · 새 창(기록: 첫 URL 만 열림)");
ok(pick("WHBM").engine === "chrome" && pick("WHBM").fresh, "WHBM 목록 → 크롬 · 새 창(기록: 첫 카테고리만)");
ok(pick("Chico's").engine === "chrome" && pick("Chico's").fresh, "Chico's 목록 → 크롬 · 새 창");
ok(pick("Patagonia", "product").engine === "firefox", "Patagonia 상품 페이지 → 파이어폭스(데이터센터 4/6, 크롬 0/6)");
ok(pick("WHBM", "product").engine === "firefox" && !pick("WHBM", "product").fresh, "WHBM 상품 페이지 → 파이어폭스(7/12)");
ok(pick("Chico's", "product").engine === "firefox" && pick("Chico's", "product").fresh, "Chico's 상품 페이지 → 파이어폭스 · 새 창(새 창 3/6 > 한 창 5/12)");
ok(pick("H&M", "product").engine === "chrome", "H&M 상품 페이지 → 크롬(데이터센터 모든 엔진 403 — 확장이 읽음)");
ok(evidenceEngine(null).engine === "chrome" && /측정 없음/.test(evidenceEngine(null).why), "접근 지도에 없는 브랜드 → 크롬(측정 없음이라고 적음)");

console.log("PC 측정 기록·손 설정");
const now = Date.parse("2026-11-27T00:00:00Z");
const H = am("H&M");
ok(choose({ entry: H, st: { firefox: { fails: 2 } }, now }).engine === "chrome", "파이어폭스가 PC 에서 2번 연달아 막히면 크롬으로");
ok(choose({ entry: H, st: { firefox: { fails: 1 } }, now }).engine === "firefox", "1번 막힌 것으로는 안 바꿈");
const L = am("Lululemon");
const sw = choose({ entry: L, st: { chrome: { fails: 2 } }, now });
ok(sw.engine === "firefox" && sw.fresh, "크롬이 2번 막힌 크롬 브랜드 → 파이어폭스 · 새 창");
const st = choose({ entry: L, st: { chrome: { fails: 2 }, firefox: { fails: 2 } }, stoppedUntil: now + DAY, now });
ok(!!st.stop && /확장 담당 유지/.test(st.stop), "둘 다 2번 연달아 막히면 멈춤(우회하지 않고 기록)");
ok(!choose({ entry: L, st: { chrome: { fails: 2 }, firefox: { fails: 2 } }, stoppedUntil: now - 1, now }).stop, "멈춘 기간이 지나면 한 번 다시 봄");
ok(choose({ entry: L, ov: { engine: "firefox", fresh: true }, now }).engine === "firefox", "pc-brands.json 의 engine 이 이긴다");
ok(!!choose({ entry: L, ov: { stop: "사람이 멈춤" }, now }).stop, "pc-brands.json 의 stop 이면 돌지 않음");
ok(choose({ entry: L, have: { chrome: false, firefox: true }, now }).engine === "firefox", "이 PC 에 크롬이 없으면 파이어폭스로");
ok(choose({ entry: H, have: { chrome: true, firefox: false }, now }).engine === "chrome", "파이어폭스가 없으면 크롬으로");
ok(!!choose({ entry: H, have: { chrome: false, firefox: false }, now }).stop, "둘 다 없으면 멈춤");

console.log("하루치 계획");
{
  const p = buildPlan({
    renderBrands: ["H&M", "Lululemon", "Sezane", "lululemon"], accessMap: AM, now, freshHours: 20,
    catalogs: [{ brand: "Sezane", updated: now - 5 * 3_600_000, count: 200 }, { brand: "H&M", updated: now - 40 * 3_600_000, count: 700 }],
    extra: [{ brand: "WHBM", store: "merge" }],
  });
  const names = (a) => a.map((x) => x.brand).join(",");
  ok(names(p.collect) === "H&M,Lululemon,WHBM", `목록: 이름 중복 없음 · 5시간 전 저장된 Sezane 은 건너뜀 · add 의 WHBM 포함 (${names(p.collect)})`);
  ok(p.skipped.some((s) => s.brand === "Sezane" && /5시간 전/.test(s.why)), "건너뛴 이유가 적힘");
  ok(p.collect.find((x) => x.brand === "WHBM").store === "merge" && p.collect.find((x) => x.brand === "H&M").store === "replace", "add 브랜드는 합쳐 저장, 확장 브랜드는 통째 교체");
  ok(names(p.enrich).includes("Sezane"), "목록을 건너뛴 브랜드도 상품 페이지 보강은 함");
  ok(p.enrich[0].rank <= p.enrich[p.enrich.length - 1].rank, "상품 페이지는 데이터센터에서 막힌 정도가 큰 브랜드부터");
  const only = buildPlan({ renderBrands: ["H&M", "Sezane"], accessMap: AM, now, only: ["sezane"], catalogs: [{ brand: "Sezane", updated: now - 3_600_000 }] });
  ok(names(only.collect) === "Sezane", "BRANDS 로 고르면 그 브랜드만, 최근 저장이어도 돈다");
  const noCat = buildPlan({ renderBrands: ["H&M", "Sezane"], accessMap: AM, now, catalogs: null, datacenter: ["H&M"] });
  ok(names(noCat.collect) === "Sezane" && noCat.skipped.some((s) => s.brand === "H&M"), "저장 목록을 못 읽으면 데이터센터 야간 수집 브랜드는 건너뜀");
  const secs = buildPlan({ renderBrands: ["Sezane"], accessMap: AM, now, catalogs: [{ brand: "Sezane", updated: (now - 3_600_000) / 1000 }] });
  ok(!secs.collect.length, "updated 가 초 단위여도 읽음");
}

console.log("측정 기록 갱신");
{
  let s = {};
  const blocked = { brand: "Sezane", engine: "chromium", collected: 0, verdict: "확장 필요(봇 차단)" };
  s = updateState(s, { collectResults: [blocked] }, now);
  ok(s.brands.sezane.collect.chrome.fails === 1 && !s.brands.sezane.stoppedUntil, "1번 막힘 — 아직 멈추지 않음");
  s = updateState(s, { collectResults: [blocked] }, now);
  s = updateState(s, { collectResults: [{ ...blocked, engine: "firefox" }] }, now);
  s = updateState(s, { collectResults: [{ ...blocked, engine: "firefox" }] }, now);
  ok(s.brands.sezane.stoppedUntil === now + STOP_DAYS * DAY, `크롬·파이어폭스 둘 다 2번 → ${STOP_DAYS}일 멈춤`);
  s = updateState(s, { collectResults: [{ brand: "Sezane", engine: "chromium", collected: 150, verdict: "자동화 가능" }] }, now);
  ok(s.brands.sezane.collect.chrome.fails === 0 && !s.brands.sezane.stoppedUntil, "다시 읽히면 기록을 풀어 줌");
  s = updateState(s, { collectResults: [{ brand: "X", engine: "chromium", collected: 3, verdict: "보완 필요(수집 0~소량)" }] }, now);
  ok(s.brands.x.collect.chrome.fails === 0 && s.brands.x.collect.chrome.lastVerdict === "thin", "적게 읽힌 것(차단 아님)은 막힘으로 세지 않음");
  s = updateState(s, { collectResults: [{ brand: "Y", engine: "chromium", collected: 0, verdict: "자동화 가능", cut: true }] }, now);
  ok(!s.brands.y, "마감으로 끊긴 브랜드는 기록하지 않음");
  s = updateState(s, { enrichRows: [{ brand: "Sezane", engine: "playwright", tried: 30, ok: 0, none: 0, blocked: 30, shell: 0 }] }, now);
  ok(s.brands.sezane.product.chrome.fails === 1, "상품 페이지 차단은 product 칸에 따로");
}

console.log("보강 리포트 표 읽기");
{
  const rows = parseEnrichTable(readFileSync(join(ROOT, "enrich-browser-report.md"), "utf8"));
  ok(rows.length > 3 && rows.every((r) => r.brand && r.tried >= 0), `enrich-browser-report.md 표 ${rows.length}줄`);
  const t = parseEnrichTable("| H&M | playwright | 744 | 30 | **0** | 0 | 0 | 30 | 0 |");
  ok(t.length === 1 && t[0].brand === "H&M" && t[0].blocked === 30, "한 줄 표");
}

console.log("쓰기 예산 나누기");
{
  ok(JSON.stringify(splitBudget(120, 28, 36, 36)) === JSON.stringify({ collect: 28, comp: 36, color: 9 }), "120 = 목록 28 + 혼용률 36×2 + 컬러 9×2 + 인덱스 1 안쪽");
  ok(JSON.stringify(splitBudget(10, 28, 36, 36)) === JSON.stringify({ collect: 10, comp: 0, color: 0 }), "모자라면 목록부터");
  ok(JSON.stringify(splitBudget(0, 5, 5, 5)) === JSON.stringify({ collect: 0, comp: 0, color: 0 }), "예산 0 이면 아무것도 안 씀");
}

console.log("정중한 접속");
{
  const p = emptyRunState(10).polite;
  const a = politeBefore(p, "https://shop.example/c/tops", 1000);
  const b = politeBefore(p, "https://shop.example/c/shirts", 1000);
  ok(a.ok && a.waitMs === 0 && b.ok && b.waitMs === 1000, "같은 호스트 두 번째는 1초 기다림");
  const c = politeBefore(p, "https://other.example/x", 1000);
  ok(c.ok && c.waitMs === 0, "다른 호스트는 안 기다림");
  politeBefore(p, "https://shop.example/c/tops", 5000);
  politeBefore(p, "https://shop.example/c/tops#x", 9000);
  const d = politeBefore(p, "https://shop.example/c/tops", 20000);
  ok(!d.ok && /PER_URL_LIMIT/.test(d.why), "같은 주소 네 번째는 막음(#뒤는 같은 주소)");
  ok(politeBefore(p, "https://shop.example/c/tops", 20000, { gapMs: 1000, maxPerUrl: 5 }).ok, "상한은 옵션");
  ok(politeAfter(p, "https://shop.example/c/pants", 429) && !politeAfter(p, "https://shop.example/c/pants", 429), "429 → 그 호스트 멈춤(한 번만 기록)");
  const e = politeBefore(p, "https://shop.example/new", 30000);
  ok(!e.ok && /STOP429/.test(e.why), "429 받은 호스트는 더 묻지 않음");
  ok(politeBefore(p, "https://other.example/y", 30000).ok, "다른 호스트는 그대로");
  ok(!politeAfter(p, "https://other.example/y", 403), "403 은 멈춤 아님(브랜드 판단은 수집기가)");
}

console.log("쓰기 한도");
{
  const W = "https://w.example";
  ok(JSON.stringify(classifyWorker(`${W}/?store=catalog&replace=1&token=t`, "POST", JSON.stringify({ site: "Hm.com.hm" }))) === JSON.stringify({ type: "write", kind: "catalog", site: "hm.com.hm" }), "목록 저장은 본문의 site 로");
  ok(classifyWorker(`${W}/?store=overlay&site=a.b`, "POST", "{}").site === "a.b", "보강 저장은 주소의 site 로");
  ok(classifyWorker(`${W}/?catalogs=1&token=t`, "GET").type === "list" && classifyWorker(`${W}/?catalog=a`, "GET").type === "read", "목록 읽기(list)와 읽기를 나눔");
  ok(classifyWorker(`${W}/?x=1`, "DELETE").type === "write", "GET 이 아닌 요청은 쓰기로 셈");
  const w = emptyRunState(3).writes;
  ok(writeDecide(w, "catalog", "a", "collect", now).ok, "첫 저장은 보냄");
  ok(!writeDecide(w, "catalog", "a", "collect", now).ok, "같은 종류·같은 브랜드 두 번째는 막음(재시도 없음)");
  ok(writeDecide(w, "overlay", "a", "comp", now).ok && writeDecide(w, "details", "a", "comp", now).ok, "종류가 다르면 따로");
  const over = writeDecide(w, "catalog", "b", "collect", now);
  ok(!over.ok && /예산/.test(over.why) && w.used === 3 && w.log.length === 5, "예산 3을 넘으면 막음 · 막은 것도 기록");
}

console.log("측정 실행 막기");
{
  const run = (env) => spawnSync(process.execPath, [join(ROOT, "scripts/pc-collect.mjs"), "--check-only"], { env: { PATH: process.env.PATH, ...env }, encoding: "utf8" }).status;
  ok(run({ STORE: "1" }) === 0, "운영 실행(store=1)은 통과");
  ok(run({ STORE: "1", MEASURE_TAG: "m", REPORT_TAG: "m-1" }) === 1, "측정 실행 + store=1 → 멈춤");
  ok(run({ STORE: "1", MEASURE_TAG: "m" }) === 1, "입력 report_tag(MEASURE_TAG)만 있어도 멈춤");
  ok(run({ STORE: "0", MEASURE_TAG: "m", REPORT_TAG: "m-1" }) === 0, "측정 실행 + store=0 → 통과");
  ok(run({}) === 0, "예약 실행(입력 없음 → store 기본 1)은 통과");
}

if (bad) { console.error(`\nPC 수집 계획·한도 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ PC 수집 계획·한도 통과");
