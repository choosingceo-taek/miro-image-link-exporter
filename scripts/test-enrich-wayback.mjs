#!/usr/bin/env node
// 야간 혼용률 보강의 웹 아카이브 층을 가짜 아카이브에 붙여 끝까지 돌린다(네트워크 없음).
//
// 보는 것:
//   - 지금 페이지가 막힌 진짜 상품 → 보관본에서 혼용률·컬러만(가격·사이즈 X), via·wd·wt, none 정리
//   - 쿼리 없는 주소로 보관본이 없으면 쿼리 붙은 주소로 한 번 더(Zara ?v1=)
//   - 보관본 없음 → wt 를 찍고, 다음 실행은 30일 안이라 다시 묻지 않는다
//   - 카테고리 주소 오탐 셋 → 아카이브에 묻지도 않는다 · 목록 같은 보관본 · 다른 주소로 넘어간 보관본 → 거부
//   - 나중에 지금 페이지에서 같은 값을 읽으면 via 를 지운다 / 다른 값이면 덮지 않는다
//   - 429 가 이어지면 물러섰다가 층을 끈다 · 조회 상한 · DRY=1 은 쓰기 0 · WAYBACK=0 은 접속 0
//   node scripts/test-enrich-wayback.mjs
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { startFake, runEnrich } from "./fixtures/fake-enrich-env.mjs";
import { GOOD, BAD } from "./fixtures/wayback-pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = join(ROOT, "enrich-comp-report.md");
const DRY_REPORT = join(ROOT, "enrich-comp-dry-report.md");
const DAY = 24 * 3600 * 1000;

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);

const prose = ("Free shipping on orders over $75. Soft, breathable fabric with a relaxed fit. " +
  "Machine wash cold, tumble dry low. Imported. Size guide: XS S M L XL. Reviews (124). ").repeat(6);
const live = (t, body, color) => `<html><head><title>${t}</title><script type="application/ld+json">` +
  JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: t, color }) +
  `</script></head><body><h1>${t}</h1>${body}<p>${prose}</p></body></html>`;

// 상품 주소(경로). 쇼핑몰 쪽은 PAGES 에 있는 것만 200, 나머지는 403(차단)이다.
const P = {
  hit: "/p/arket-tee-1001",                       // 막힘 · 보관본 있음(상품)
  query: "/p/zara-tee-p0442.html?v1=615",          // 막힘 · 쿼리 붙은 주소로만 보관
  nosnap: "/p/nosnap-tee-9001",                    // 막힘 · 보관본 없음
  catNew: "/intl/en/new",                          // 오탐 1 — Aritzia
  catTees: "/shop/womens/clothing/tops/t-shirts",  // 오탐 2 — Joules
  catBags: "/en-us/bags/",                         // 오탐 3 — &Other Stories
  listing: "/p/summer-edit-77",                    // 주소는 상품 같은데 보관본이 목록
  moved: "/p/old-tee-55",                          // 보관본이 다른 주소로 넘어감
  confirm: "/p/live-tee-3",                        // 보관본 값을 지금 페이지가 확인
  differ: "/p/live-diff-4",                        // 지금 페이지가 다른 값을 줌
  recentWt: "/p/recent-wt-5",                      // 이틀 전에 물어봄 → 안 묻는다
  oldWt: "/p/old-wt-6",                            // 40일 전에 물어봄 → 다시 묻는다
  staleNone: "/p/stale-none-7",                    // 예전 none · 오늘 막힘 · 보관본 없음
};
const PAGES = {
  [P.confirm]: live("Live Tee", "<div>Composition: 100% Cotton</div>", "Navy"),
  [P.differ]: live("Live Linen", "<div>Composition: 100% Linen</div>", "Sand"),
};
// 보관본에 가격·사이즈가 있어도 버려야 한다 — 일부러 넣어 둔다.
const arketWithPrice = GOOD.arket.replace('"price":"35"', '"price":"35","priceCurrency":"USD"')
  .replace("</body>", `<select name="size"><option>XS</option><option>S</option></select></body>`);

function world(base) {
  const u = (p) => base + p;
  const TS = "20260712093011";
  return {
    archive: {
      [u(P.hit)]: { ts: TS, html: arketWithPrice },
      [u(P.query)]: { ts: "20260515000000", html: GOOD.zara },   // 쿼리 포함 주소로만
      [u(P.catNew)]: { ts: TS, html: BAD.aritziaNew },
      [u(P.catTees)]: { ts: TS, html: BAD.joulesTshirts },
      [u(P.catBags.replace(/\/$/, ""))]: { ts: TS, html: BAD.storiesBags },
      [u(P.catBags)]: { ts: TS, html: BAD.storiesBags },
      [u(P.listing)]: { ts: TS, html: BAD.joulesNamed },
      [u(P.moved)]: { ts: TS, redirectTo: u("/p/womens-tops-listing-2") },
      [u("/p/womens-tops-listing-2")]: { ts: TS, html: GOOD.mango },   // 넘어간 곳은 멀쩡해 보여도 거부
      [u(P.recentWt)]: { ts: TS, html: GOOD.reformation },
      [u(P.oldWt)]: { ts: TS, html: GOOD.reformation },
    },
    overlay: {
      [u(P.hit)]: { none: 1, t: Date.now() - 10 * DAY },                 // 예전 none → 보관본 값이 지운다
      [u(P.confirm)]: { comp: "Cotton 100%", via: "wayback", wd: "20250101", t: Date.now() - 10 * DAY },
      [u(P.differ)]: { comp: "Cotton 100%", via: "wayback", wd: "20250101", t: Date.now() - 10 * DAY },
      [u(P.recentWt)]: { t: Date.now() - 10 * DAY, wt: Date.now() - 2 * DAY },
      [u(P.oldWt)]: { t: Date.now() - 41 * DAY, wt: Date.now() - 40 * DAY },
      [u(P.staleNone)]: { none: 1, t: Date.now() - 10 * DAY },
    },
  };
}
const items = (paths) => (base) => paths.map((p, n) => ({
  name: "P" + n, category: "tops", imageUrl: `https://img.x/${n}.jpg`, productUrl: base + p,
}));
const archiveReqs = (st) => st.requests.filter((r) => r.path.startsWith("/wb/") || r.path.startsWith("/web/"));
const apiAsked = (st, base, p) => st.hits["api:" + base + p] || 0;
const webAsked = (st, base, p) => st.hits["web:" + base + p] || 0;

const keep = (f) => (existsSync(f) ? readFileSync(f) : null);
const reportBak = keep(REPORT), dryBak = keep(DRY_REPORT);
try {
  // ── 시나리오 1: 기본 — 두 번 돈다(두 번째는 '다시 묻지 않음' 확인) ──
  {
    const L = "기본";
    let base = "";
    const fk = await startFake({
      pages: PAGES, items: items(Object.values(P)),
      overlay: (b) => { base = b; return world(b).overlay; },
      archive: (b) => world(b).archive,
    });
    const t0 = Date.now();
    const r1 = await runEnrich(fk.base, { RETRY_ALL: "1" });
    const t1 = Date.now();
    if (r1.code !== 0) { console.error(r1.out); fail(`[${L}] 1회차 종료 코드 ${r1.code}`); }
    const at = (p) => fk.state.overlay[base + p] || {};

    const h = at(P.hit);
    if (h.comp !== "Cotton 96% / Elastane 4%" || h.via !== "wayback" || h.wd !== "20260712" || !(h.wt >= t0 && h.wt <= t1))
      fail(`[${L}] 보관본 적중: ${JSON.stringify(h)}`);
    else ok("막힌 상품 → 보관본에서 혼용률(Cotton 96% / Elastane 4%) · via=wayback · wd=20260712 · wt");
    if (h.color !== "White") fail(`[${L}] 보관본 컬러가 안 실렸다: ${JSON.stringify(h)}`);
    else ok("보관본의 컬러도 함께(White)");
    if (h.price || h.priceOrig || h.sizes) fail(`[${L}] 보관본의 가격·사이즈가 저장됐다: ${JSON.stringify(h)}`);
    else ok("보관본의 가격·사이즈·정가는 저장하지 않는다");
    if (h.none) fail(`[${L}] 보관본으로 찾았는데 none 이 남았다`);
    else ok("보관본으로 찾으면 예전 none 을 지운다");

    const q = at(P.query);
    if (q.comp !== "Cotton 100%" || q.via !== "wayback" || q.wd !== "20260515") fail(`[${L}] 쿼리 포함 주소: ${JSON.stringify(q)}`);
    else if (apiAsked(fk.state, base, P.query.split("?")[0]) !== 1 || apiAsked(fk.state, base, P.query) !== 1)
      fail(`[${L}] 쿼리 없이 먼저, 그다음 쿼리 포함으로 묻지 않았다`);
    else ok("쿼리 없이 먼저 묻고, 없으면 쿼리 포함 주소(?v1=)로 — 찾음");

    const ns = at(P.nosnap);
    if (ns.comp || ns.via || !(ns.wt >= t0 && ns.wt <= t1)) fail(`[${L}] 보관본 없음: ${JSON.stringify(ns)}`);
    else ok("보관본 없음 → wt 만 찍는다");

    for (const k of ["catNew", "catTees", "catBags"]) {
      const o = at(P[k]);
      const asked = fk.state.requests.filter((r) => (r.path.startsWith("/wb/") || r.path.startsWith("/web/")) &&
        decodeURIComponent(r.query + r.path).includes(P[k].replace(/\/$/, ""))).length;
      if (o.comp || o.via || asked) fail(`[${L}] 카테고리 오탐 ${P[k]}: 아카이브 ${asked}회 · ${JSON.stringify(o)}`);
    }
    if (!bad) ok("카테고리 주소 오탐 셋(/intl/en/new · …/tops/t-shirts · /en-us/bags/) → 아카이브에 묻지도 않는다");

    const li = at(P.listing);
    if (li.comp || li.via || !li.wt) fail(`[${L}] 목록 같은 보관본: ${JSON.stringify(li)}`);
    else ok("보관본이 목록 페이지(담기 버튼 여러 개) → 거부하고 wt");

    const mv = at(P.moved);
    if (mv.comp || mv.via || !mv.wt) fail(`[${L}] 다른 주소로 넘어간 보관본: ${JSON.stringify(mv)}`);
    else ok("보관본이 다른 경로로 넘어감 → 넘어간 곳이 멀쩡한 상품 페이지여도 거부");

    const cf = at(P.confirm);
    if (cf.comp !== "Cotton 100%" || cf.via || cf.wd || cf.color !== "Navy") fail(`[${L}] 지금 페이지가 같은 값 확인: ${JSON.stringify(cf)}`);
    else ok("지금 페이지에서 같은 혼용률을 읽으면 via·wd 를 지운다(확인됨)");
    const df = at(P.differ);
    if (df.comp !== "Cotton 100%" || df.via !== "wayback") fail(`[${L}] 지금 페이지가 다른 값: ${JSON.stringify(df)}`);
    else ok("지금 페이지가 다른 값이면 이미 있는 값을 덮지 않고 via 도 남긴다");
    if (apiAsked(fk.state, base, P.confirm) || apiAsked(fk.state, base, P.differ)) fail(`[${L}] 지금 페이지를 읽은 상품을 아카이브에 물었다`);

    if (apiAsked(fk.state, base, P.recentWt) || at(P.recentWt).comp) fail(`[${L}] 이틀 전에 물어본 상품을 다시 물었다`);
    else ok("wt 가 30일 안이면 다시 묻지 않는다");
    if (at(P.oldWt).comp !== "Silk 100%" || at(P.oldWt).via !== "wayback") fail(`[${L}] 40일 전 wt 상품: ${JSON.stringify(at(P.oldWt))}`);
    else ok("wt 가 30일 지났으면 다시 묻는다(찾음 · Silk 100%)");

    const sn = at(P.staleNone);
    if (sn.none || !sn.wt) fail(`[${L}] 예전 none + 막힘 + 보관본 없음: ${JSON.stringify(sn)}`);
    else ok("예전 none + 오늘 막힘 → none 정리 규칙은 그대로(보관본이 없어도)");

    // 정중함: User-Agent · Save Page Now 금지
    const ar = archiveReqs(fk.state);
    if (ar.some((r) => !/^rack-catalog-enrich \(github\.com\//.test(r.ua) || /@/.test(r.ua))) fail(`[${L}] 아카이브 요청의 User-Agent: ${ar[0] && ar[0].ua}`);
    else ok(`아카이브 요청 ${ar.length}건 모두 저장소를 밝히는 User-Agent(연락처 없음)`);
    if (fk.state.requests.some((r) => /\/save\b/i.test(r.path))) fail(`[${L}] Save Page Now 를 불렀다`);

    const rep1 = readFileSync(REPORT, "utf8");
    if (!/아카이브 \d/.test(rep1) || !/## 웹 아카이브 층/.test(rep1)) fail(`[${L}] 리포트에 아카이브 경로·표가 없다`);
    else ok("리포트: 경로 열에 '아카이브 N', 웹 아카이브 층 표");

    // 2회차 — 같은 오버레이로 다시. 보관본 없던 상품·거부된 상품은 다시 묻지 않는다.
    const before = { ns: apiAsked(fk.state, base, P.nosnap), li: apiAsked(fk.state, base, P.listing), mv: apiAsked(fk.state, base, P.moved) };
    const r2 = await runEnrich(fk.base, { RETRY_ALL: "1" });
    if (r2.code !== 0) { console.error(r2.out); fail(`[${L}] 2회차 종료 코드 ${r2.code}`); }
    const after = { ns: apiAsked(fk.state, base, P.nosnap), li: apiAsked(fk.state, base, P.listing), mv: apiAsked(fk.state, base, P.moved) };
    if (JSON.stringify(before) !== JSON.stringify(after)) fail(`[${L}] 2회차가 다시 물었다: ${JSON.stringify(before)} → ${JSON.stringify(after)}`);
    else if (!fk.state.hits[P.nosnap] || fk.state.hits[P.nosnap] < 2) fail(`[${L}] 2회차에 상품 페이지 자체를 안 읽었다(RETRY_ALL)`);
    else ok("2회차(RETRY_ALL): 지금 페이지는 다시 읽지만, 보관본 없음·거부 상품은 아카이브에 다시 묻지 않는다");
    await fk.close();
  }

  // ── 시나리오 2: 429 가 이어지면 물러섰다가 층을 끈다 ──
  {
    const L = "429";
    const paths = ["/p/a-1", "/p/b-2", "/p/c-3", "/p/d-4", "/p/e-5", "/p/f-6"];
    const fk = await startFake({ items: items(paths), archiveStatus: () => 429 });
    const r = await runEnrich(fk.base, {});
    if (r.code !== 0) { console.error(r.out); fail(`[${L}] 종료 코드 ${r.code}`); }
    const n = archiveReqs(fk.state).length;
    // 동시 2개라 4번째 실패 순간 다른 하나가 이미 나가 있을 수 있다 — 4~5회.
    if (n < 4 || n > 5) fail(`[${L}] 연속 429 뒤 요청 수 ${n} (기대 4~5 = WAYBACK_FAILS + 이미 나간 하나)`);
    else ok(`429 연속 4회 → 물러섰다가 이 실행에서 아카이브 층을 끈다(요청 ${n}회에서 멈춤, 상품 6개)`);
    if (Object.values(fk.state.overlay).some((o) => o.wt)) fail(`[${L}] 일시 오류인데 wt 를 찍었다`);
    else ok("429 는 일시 오류 — wt 를 안 찍어 다음 실행이 다시 묻는다");
    if (!/층을 껐다/.test(readFileSync(REPORT, "utf8"))) fail(`[${L}] 리포트에 층을 껐다는 표시가 없다`);
    await fk.close();
  }

  // ── 시나리오 3: 조회 상한 ──
  {
    const L = "상한";
    const paths = ["/p/a-1", "/p/b-2", "/p/c-3", "/p/d-4", "/p/e-5"];
    const fk = await startFake({ items: items(paths) });
    const r = await runEnrich(fk.base, { WAYBACK_MAX: "2" });
    const n = fk.state.requests.filter((x) => x.path === "/wb/available").length;
    if (r.code !== 0 || n !== 2) fail(`[${L}] WAYBACK_MAX=2 인데 조회 ${n}회`);
    else ok("WAYBACK_MAX=2 → 상품 2개만 묻는다");
    await fk.close();
    const fk2 = await startFake({ items: items(paths) });
    await runEnrich(fk2.base, { WAYBACK_PER_BRAND: "1" });
    const n2 = fk2.state.requests.filter((x) => x.path === "/wb/available").length;
    if (n2 !== 1) fail(`[${L}] WAYBACK_PER_BRAND=1 인데 조회 ${n2}회`);
    else ok("WAYBACK_PER_BRAND=1 → 브랜드당 1개");
    await fk2.close();
  }

  // ── 시나리오 4: DRY=1 — 보관본에서 찾아도 쓰기 0 ──
  {
    const L = "DRY";
    const fk = await startFake({ items: items([P.hit, P.nosnap]), archive: (b) => world(b).archive });
    if (existsSync(DRY_REPORT)) unlinkSync(DRY_REPORT);
    const r = await runEnrich(fk.base, { DRY: "1" });
    if (r.code !== 0) { console.error(r.out); fail(`[${L}] 종료 코드 ${r.code}`); }
    const writes = fk.state.requests.filter((x) => x.method !== "GET" && x.method !== "HEAD");
    if (writes.length || fk.state.stores.length || fk.state.index) fail(`[${L}] 쓰기 ${writes.length}건`);
    else ok(`DRY: 아카이브까지 읽고(요청 ${archiveReqs(fk.state).length}건) 쓰기는 0`);
    const dry = existsSync(DRY_REPORT) ? readFileSync(DRY_REPORT, "utf8") : "";
    if (!/\| TestBrand \| 2 \| 0 \| 1 \| 1 \|/.test(dry)) fail(`[${L}] DRY 리포트의 아카이브 표: \n${dry}`);
    else ok("DRY 리포트: 시도 2 · 지금 페이지 0 · 보관본 1 · 보관본 없음 1");
    await fk.close();
  }

  // ── 시나리오 5: WAYBACK=0 — 아카이브 접속 0 ──
  {
    const L = "WAYBACK=0";
    const fk = await startFake({ items: items([P.hit, P.nosnap]), archive: (b) => world(b).archive });
    const r = await runEnrich(fk.base, { WAYBACK: "0" });
    const n = archiveReqs(fk.state).length + fk.state.requests.filter((x) => x.path === "/category-links.json").length;
    if (r.code !== 0 || n) fail(`[${L}] 아카이브·카테고리 목록 요청 ${n}건`);
    else if (Object.values(fk.state.overlay).some((o) => o.wt || o.via)) fail(`[${L}] wt/via 가 찍혔다`);
    else ok("WAYBACK=0 → 아카이브에 한 번도 안 묻는다");
    await fk.close();
  }
} finally {
  if (reportBak) writeFileSync(REPORT, reportBak); else if (existsSync(REPORT)) unlinkSync(REPORT);
  if (dryBak) writeFileSync(DRY_REPORT, dryBak); else if (existsSync(DRY_REPORT)) unlinkSync(DRY_REPORT);
}

if (bad) { console.error(`\n웹 아카이브 층 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ 웹 아카이브 층 통과 — 적중 · 쿼리 · 보관본 없음/재질문 창 · 오탐 거부 · 리다이렉트 · 확인/불일치 · 429 · 상한 · DRY · 끄기");
