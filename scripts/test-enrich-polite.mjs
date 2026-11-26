#!/usr/bin/env node
// 야간 보강(enrich-comp.mjs)의 세 가지 규칙을 가짜 세상에 붙여 확인한다.
//
// ① 추출 규칙 판(rv) — 읽었는데 혼용률이 비었던 상품은 규칙이 바뀌면 재시도 창(5일)과 무관하게 한 번 더 연다.
//    같은 판으로 이미 본 상품, 막혔을 수 있는 예전 기록(시도 시각만)은 창을 지킨다. (scripts/rule-version.mjs)
// ② 429 — 한 사이트가 429 를 주면 그 실행에서는 그 사이트에 더 묻지 않고, 그 뒤 상품에는 시도 시각을 남기지 않는다.
// ③ 측정 실행(DRY) — 한 사이트 요청 간격(HOST_GAP_MS) · Worker 우회 끄기(WORKER_BYPASS=0) · 실행 번호 붙은 리포트에
//    브랜드별 표본(값 · 출처 · 그 값이 나온 페이지 글).
//   node scripts/test-enrich-polite.mjs
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { startFake, runEnrich } from "./fixtures/fake-enrich-env.mjs";
import { ruleVersion } from "./rule-version.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);
const RV = ruleVersion();
// 진짜 실행(DRY 아님)은 enrich-comp-report.md 를 쓴다 — 끝나면 되돌린다.
const REPORT = join(ROOT, "enrich-comp-report.md");
const reportBak = existsSync(REPORT) ? readFileSync(REPORT) : null;
process.on("exit", () => { if (reportBak) writeFileSync(REPORT, reportBak); else if (existsSync(REPORT)) unlinkSync(REPORT); });
if (!/^[0-9a-f]{8}$/.test(RV)) fail(`규칙 판 모양이 이상하다: ${RV}`);

const prose = ("Soft, breathable fabric with a relaxed fit. Machine wash cold, tumble dry low. Imported. ").repeat(8);
const page = (t, body) => `<html><head><title>${t}</title><script type="application/ld+json">` +
  JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: t, color: "Navy" }) +
  `</script></head><body><h1>${t}</h1>${body}<p>${prose}</p></body></html>`;
const DAY = 86400000;
const items = (n0, n1) => (base) => Array.from({ length: n1 - n0 + 1 }, (_, k) => {
  const n = n0 + k;
  return { name: `Tee ${n}`, category: "tops", imageUrl: `https://img.x/${n}.jpg`, productUrl: `${base}/p/${n}` };
});

// ── ① 규칙 판 ──
{
  const L = "규칙 판";
  const t = Date.now() - DAY;   // 하루 전 — 재시도 창(5일) 안
  const fk = await startFake({
    items: items(1, 5),
    overlay: (base) => ({
      [`${base}/p/1`]: { t, none: 1 },                   // 예전 기록(rv 없음) · 사이트 미표기 — 읽었던 것 → 다시 연다
      [`${base}/p/2`]: { t, none: 1, rv: RV },           // 지금 판으로 이미 봄 → 창을 지킨다
      [`${base}/p/3`]: { t, none: 1, rv: "00000000" },   // 다른 판으로 봄 → 다시 연다
      [`${base}/p/4`]: { t },                            // 시도 시각만 — 막혔을 수 있다 → 창을 지킨다
      [`${base}/p/5`]: { t, color: "Navy", bv: "fetch,impit" },  // impit 까지 막혔던 기록 → 창을 지킨다
    }),
    pages: Object.fromEntries([1, 2, 3, 4, 5].map((n) => [`/p/${n}`, page(`Tee ${n}`, "<div>Composition: 100% Cotton</div>")])),
  });
  const { code, out } = await runEnrich(fk.base, { IMPIT: "0" });
  await fk.close();
  if (code !== 0) { console.error(out); fail(`[${L}] 종료 코드 ${code}`); }
  const h = (n) => fk.state.hits[`/p/${n}`] || 0;
  if (!(h(1) >= 1)) fail(`[${L}] 예전 미표기 기록(rv 없음)을 다시 열지 않았다`); else ok("예전 미표기 기록(rv 없음)은 창 안이어도 한 번 더 연다");
  if (h(2)) fail(`[${L}] 지금 판으로 이미 본 상품을 다시 열었다(${h(2)})`); else ok("지금 판으로 이미 본 상품은 창을 지킨다");
  if (!(h(3) >= 1)) fail(`[${L}] 다른 판으로 본 상품을 다시 열지 않았다`); else ok("다른 판으로 본 상품은 창 안이어도 다시 연다");
  if (h(4)) fail(`[${L}] 시도 시각만 있는(막혔을 수 있는) 예전 기록을 열었다`); else ok("시도 시각만 있는 예전 기록은 창을 지킨다");
  if (h(5)) fail(`[${L}] impit 까지 막혔던 기록을 열었다`); else ok("impit 까지 막혔던 기록(bv)은 창을 지킨다");
  const ov = fk.state.overlay;
  const o1 = ov[`${fk.base}/p/1`] || {};
  if (o1.comp !== "Cotton 100%" || o1.rv || o1.none) fail(`[${L}] 다시 읽은 값 저장이 이상하다: ${JSON.stringify(o1)}`);
  else ok("다시 읽어 찬 상품은 혼용률을 쓰고 rv·none 을 지운다");
  if ((ov[`${fk.base}/p/2`] || {}).rv !== RV) fail(`[${L}] 손대지 않은 상품의 rv 가 바뀌었다`);
}
// 비었던 상품에는 지금 판이 남는다 — 다음 실행은 창을 지킨다.
{
  const L = "규칙 판 기록";
  const fk = await startFake({
    items: items(1, 2),
    overlay: {},
    // 컬러 없는 상품 페이지(JSON-LD 에 color 없음) — 읽었는데 아무것도 없으면 사이트 미표기(none)
    pages: { "/p/1": `<html><head><title>Tee 1</title><script type="application/ld+json">{"@type":"Product","name":"Tee 1"}</script></head><body><h1>Tee 1</h1><p>Machine wash.</p><p>${prose}</p></body></html>` },   // /p/2 는 403
  });
  const { code, out } = await runEnrich(fk.base, { IMPIT: "0", WORKER_BYPASS: "0", WAYBACK: "0" });
  await fk.close();
  if (code !== 0) { console.error(out); fail(`[${L}] 종료 코드 ${code}`); }
  const o1 = fk.state.overlay[`${fk.base}/p/1`] || {}, o2 = fk.state.overlay[`${fk.base}/p/2`] || {};
  if (o1.rv !== RV || !o1.none) fail(`[${L}] 읽었는데 빈 상품에 지금 판·미표기가 안 남았다: ${JSON.stringify(o1)}`);
  else ok("읽었는데 빈 상품에는 지금 판(rv)이 남는다");
  if (o2.rv !== RV || o2.none) fail(`[${L}] 막힌 상품의 기록이 이상하다: ${JSON.stringify(o2)}`);
  else ok("막힌 상품에도 지금 판이 남는다(안 남기면 매 실행 다시 열린다) · 미표기는 적지 않는다");
  if (fk.state.hits.bypass) fail(`[${L}] WORKER_BYPASS=0 인데 Worker 우회를 불렀다(${fk.state.hits.bypass})`);
  else ok("WORKER_BYPASS=0 이면 Worker 우회(?comp)를 부르지 않는다");
}

// ── ② 429 ──
{
  const L = "429";
  const fk = await startFake({
    items: items(1, 3),
    overlay: {},
    pages: {
      "/p/1": { status: 429, body: "Too Many Requests" },
      "/p/2": page("Tee 2", "<div>Composition: 100% Cotton</div>"),
      "/p/3": page("Tee 3", "<div>Composition: 100% Cotton</div>"),
    },
  });
  const { code, out } = await runEnrich(fk.base, { IMPIT: "0", PAGE_POOL: "1", WAYBACK: "0" });
  await fk.close();
  if (code !== 0) { console.error(out); fail(`[${L}] 종료 코드 ${code}`); }
  const h = (n) => fk.state.hits[`/p/${n}`] || 0;
  if (h(1) !== 1) fail(`[${L}] 429 를 준 주소를 ${h(1)}번 열었다(기대 1)`);
  else if (h(2) || h(3)) fail(`[${L}] 429 뒤에도 같은 사이트를 열었다: /p/2 ${h(2)} · /p/3 ${h(3)}`);
  else ok("429 를 받으면 그 실행에서는 그 사이트에 더 묻지 않는다");
  const ov = fk.state.overlay;
  const marked = [1, 2, 3].filter((n) => ov[`${fk.base}/p/${n}`] && ov[`${fk.base}/p/${n}`].t);
  if (marked.length) fail(`[${L}] 429 로 멈춘 상품에 시도 시각이 찍혔다: ${marked.join(",")}`);
  else ok("429 로 멈춘 상품에는 시도 시각을 남기지 않는다(다음 실행이 읽는다)");
  if (!/429/.test(out)) fail(`[${L}] 로그에 429 로 멈췄다는 줄이 없다`);
}

// ── ③ 측정 실행 ──
{
  const L = "측정";
  const RUN = "testpolite";
  const file = join(ROOT, `enrich-comp-dry-${RUN}.md`);
  if (existsSync(file)) unlinkSync(file);
  const fk = await startFake({
    items: items(1, 4),
    overlay: {},
    pages: {
      "/p/1": page("Tee 1", "<ul><li>Relaxed fit</li><li>Fabric: 60% organic cotton, 40% recycled polyester</li></ul>"),
      "/p/2": page("Tee 2", "<p>Machine wash.</p>"),
      "/p/3": page("Tee 3", "<div>Composition: 100% Linen</div>"),
      // /p/4 는 403
    },
  });
  const t0 = Date.now();
  const { code, out } = await runEnrich(fk.base, { IMPIT: "0", DRY: "1", DRY_TAG: RUN, HOST_GAP_MS: "300", WORKER_BYPASS: "0", PAGE_POOL: "4", WAYBACK: "0" });
  const ms = Date.now() - t0;
  await fk.close();
  if (code !== 0) { console.error(out); fail(`[${L}] 종료 코드 ${code}`); }
  const writes = fk.state.requests.filter((r) => r.method !== "GET" && r.method !== "HEAD");
  if (writes.length) fail(`[${L}] 쓰기 요청 ${writes.length}건`); else ok("측정 실행 — 쓰기 0건");
  // 상품 4개 = 같은 호스트 요청 4번 → 간격 300ms 면 적어도 900ms
  if (ms < 900) fail(`[${L}] 한 사이트 요청 간격을 지키지 않았다(${ms}ms)`); else ok(`한 사이트 요청 간격 300ms 를 지킨다(실행 ${ms}ms)`);
  if (fk.state.hits.bypass) fail(`[${L}] Worker 우회를 불렀다`);
  const md = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (!md) fail(`[${L}] 실행 번호 붙은 리포트(${file})가 없다`);
  else {
    ok("측정 리포트는 enrich-comp-dry-<실행 번호>.md 에");
    if (!/## 브랜드별 표본/.test(md)) fail(`[${L}] 표본 절이 없다`);
    else if (!/Cotton 60% \/ Polyester 40%/.test(md) || !/60% organic cotton, 40% recycled polyester/.test(md)) fail(`[${L}] 채운 표본의 값·페이지 글이 없다\n${md.slice(md.indexOf("## 브랜드별 표본"), md.indexOf("## 브랜드별 표본") + 900)}`);
    else ok("채운 표본에 값과 그 값이 나온 페이지 글이 함께 있다");
    if (!/⬜ 빈 것\([^)]*\) · \S+\/p\/2/.test(md)) fail(`[${L}] 읽었는데 빈 상품 표본이 없다`); else ok("읽었는데 빈 상품을 표본으로 남긴다");
    if (!/⛔ [^\n]*\/p\/4/.test(md)) fail(`[${L}] 못 읽은 상품 표본이 없다`); else ok("못 읽은 상품을 표본으로 남긴다");
    if (!/Worker 우회 끔/.test(md) || !new RegExp(`규칙 판 ${RV}`).test(md)) fail(`[${L}] 설정 줄(Worker 우회·규칙 판)이 없다`);
    else ok("리포트 맨 위에 설정(요청 간격 · Worker 우회 · 규칙 판)을 적는다");
  }
  if (existsSync(file)) unlinkSync(file);
}

if (bad) { console.error(`\n${bad}건 실패`); process.exit(1); }
console.log("\n✅ 규칙 판 재시도 · 429 멈춤 · 측정 실행(요청 간격 · 우회 끔 · 표본)");
