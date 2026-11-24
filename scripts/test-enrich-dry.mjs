#!/usr/bin/env node
// 야간 혼용률 보강의 측정 실행(DRY=1)이 정말 아무것도 쓰지 않는지, BRANDS 필터가 맞게 거르는지 본다.
//
// 왜 있는 테스트인지: DRY 는 '진짜 사이트·아카이브를 읽어 보되 저장은 하지 않는' 측정용이다.
// 저장이 한 번이라도 새면 측정하려던 상품에 시도 시각(t)이 찍혀 다음 밤 실행이 그 상품을
// 건너뛰고, 검토 전의 값(아카이브 오탐 같은)이 엑셀로 나간다. 그래서 가짜 Worker 로 받은
// 요청을 전부 세어 GET 말고는 하나도 없음을 확인한다.
//
// 함께 보는 것: BRANDS 로 한 브랜드만 돌려도 진짜 실행의 검색 인덱스는 전 브랜드로 만든다
// (줄인 목록으로 만들면 나머지 브랜드가 인덱스에서 빠진다).
//   node scripts/test-enrich-dry.mjs
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { startFake, runEnrich } from "./fixtures/fake-enrich-env.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = join(ROOT, "enrich-comp-report.md");
const DRY_REPORT = join(ROOT, "enrich-comp-dry-report.md");

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);

const prose = ("Free shipping on orders over $75. Soft, breathable fabric with a relaxed fit. " +
  "Machine wash cold, tumble dry low. Imported. Size guide: XS S M L XL. Reviews (124). ").repeat(6);
const page = (t, body) => `<html><head><title>${t}</title><script type="application/ld+json">` +
  JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: t, color: "Navy" }) +
  `</script></head><body><h1>${t}</h1>${body}<p>${prose}</p></body></html>`;

const SITES = [
  { site: "alpha.com.alpha", brand: "Chico's", count: 3 },
  { site: "beta.com.beta", brand: "H&M", count: 3 },
  { site: "gamma.com.gamma", brand: "Gamma", count: 3 },
];
const fakeOpts = {
  list: SITES,
  perSite: true,
  brandOf: (site) => SITES.find((s) => s.site === site).brand,
  items: (base, site) => [1, 2, 3].map((n) => ({
    name: `${site} ${n}`, category: "tops", imageUrl: `https://img.x/${site}/${n}.jpg`, productUrl: `${base}/p/${n}?s=${site}`,
  })),
  pages: {
    "/p/1": page("Navy Tee", "<div>Composition: 100% Cotton</div>"),
    "/p/2": page("Plain Tee", "<p>Machine wash cold.</p>"),
    // /p/3 는 403 차단 — 아카이브에도 없다
  },
  // 아카이브에는 아무것도 없다(보관본 조회는 GET 이라 DRY 에서도 그대로 한다).
  archive: {},
};

const keep = (f) => (existsSync(f) ? readFileSync(f) : null);
const reportBak = keep(REPORT), dryBak = keep(DRY_REPORT);
const restore = () => {
  if (reportBak) writeFileSync(REPORT, reportBak); else if (existsSync(REPORT)) unlinkSync(REPORT);
  if (dryBak) writeFileSync(DRY_REPORT, dryBak); else if (existsSync(DRY_REPORT)) unlinkSync(DRY_REPORT);
};

try {
  // ── DRY=1 + BRANDS ──
  {
    const L = "DRY=1 BRANDS";
    if (existsSync(DRY_REPORT)) unlinkSync(DRY_REPORT);
    const before = existsSync(REPORT) ? readFileSync(REPORT, "utf8") : null;
    const fk = await startFake(fakeOpts);
    // 이름은 기호·대소문자를 섞어 적는다 — 그대로 맞아야 한다.
    const { code, out } = await runEnrich(fk.base, { DRY: "1", BRANDS: " chico's , h&m ,Nobody" });
    await fk.close();
    if (code !== 0) { console.error(out); fail(`[${L}] 종료 코드 ${code}`); }

    const writes = fk.state.requests.filter((r) => r.method !== "GET" && r.method !== "HEAD");
    if (writes.length) fail(`[${L}] GET 이 아닌 요청 ${writes.length}건: ${JSON.stringify(writes.slice(0, 3))}`);
    else ok(`요청 ${fk.state.requests.length}건이 전부 GET — 쓰기 0건`);
    if (fk.state.stores.length || fk.state.index) fail(`[${L}] 저장이 일어났다: overlay ${fk.state.stores.length} · index ${!!fk.state.index}`);
    else ok("오버레이 저장 0 · 검색 인덱스 재구축 0");

    // 그래도 읽기는 했다 — 측정이 안 되면 DRY 의 의미가 없다.
    if (!(fk.state.hits["/p/1"] >= 1)) fail(`[${L}] 상품 페이지를 읽지 않았다`);
    else ok("상품 페이지는 평소처럼 읽는다");

    // BRANDS: Chico's·H&M 만. Gamma 의 카탈로그·오버레이는 열지도 않는다.
    const cat = (s) => fk.state.requests.filter((r) => r.query.includes(encodeURIComponent(s)) || r.query.includes(s)).length;
    if (cat("gamma.com.gamma")) fail(`[${L}] BRANDS 에 없는 Gamma 를 읽었다`);
    else if (!cat("alpha.com.alpha") || !cat("beta.com.beta")) fail(`[${L}] BRANDS 의 브랜드를 안 읽었다`);
    else ok("BRANDS 필터 — \"chico's\"·\"h&m\" 이 Chico's·H&M 에 맞고 Gamma 는 건너뛴다");
    if (!/못 찾은 이름: nobody/.test(out)) fail(`[${L}] 못 찾은 브랜드 이름을 알리지 않았다`);
    else ok("못 찾은 브랜드 이름(Nobody)을 로그에 남긴다");

    const after = existsSync(REPORT) ? readFileSync(REPORT, "utf8") : null;
    if (after !== before) fail(`[${L}] 진짜 리포트(enrich-comp-report.md)를 덮어썼다`);
    else ok("진짜 리포트는 그대로");
    const dry = existsSync(DRY_REPORT) ? readFileSync(DRY_REPORT, "utf8") : "";
    if (!/DRY 실행 — 저장하지 않았다/.test(dry)) fail(`[${L}] DRY 리포트가 없거나 DRY 표시가 없다`);
    else if (!/Chico's/.test(dry) || /\| Gamma \|/.test(dry)) fail(`[${L}] DRY 리포트의 브랜드 줄이 이상하다`);
    else ok("DRY 리포트는 enrich-comp-dry-report.md 에, 맨 위에 'DRY 실행 — 저장하지 않았다'");
    // '저장했다면' 숫자는 센다 — Navy Tee 의 혼용률이 두 브랜드에서 하나씩.
    if (!/\| 혼용률 \| \d+ \| \d+% \| \+2 \|/.test(dry)) fail(`[${L}] '저장했다면 +2' 가 리포트에 없다\n${dry.slice(0, 900)}`);
    else ok("저장은 안 해도 '저장했다면 늘었을 개수(+2)'는 센다");
  }

  // ── 같은 설정으로 진짜 실행 — 대조군. 저장이 일어나고, 인덱스는 전 브랜드로 만든다. ──
  {
    const L = "진짜 실행 BRANDS";
    const fk = await startFake(fakeOpts);
    const { code, out } = await runEnrich(fk.base, { BRANDS: "Chico's" });
    await fk.close();
    if (code !== 0) { console.error(out); fail(`[${L}] 종료 코드 ${code}`); }
    const posts = fk.state.requests.filter((r) => r.method === "POST").length;
    if (!fk.state.stores.length || !fk.state.index) fail(`[${L}] 진짜 실행인데 저장이 없다(POST ${posts})`);
    else ok(`진짜 실행은 저장한다(POST ${posts}) — 대조군`);
    const brands = new Set(((fk.state.index && fk.state.index.items) || []).map((x) => x.brand));
    if (brands.size !== 3) fail(`[${L}] 인덱스가 전 브랜드가 아니다: ${[...brands].join(", ")}`);
    else ok("BRANDS 로 한 브랜드만 돌려도 검색 인덱스는 전 브랜드(3)로 다시 만든다");
    if (Object.keys(fk.state.overlay).join() !== "alpha.com.alpha") fail(`[${L}] 다른 브랜드 오버레이를 썼다: ${Object.keys(fk.state.overlay)}`);
  }
} finally {
  restore();
}

if (bad) { console.error(`\nDRY·BRANDS ${bad}건 실패`); process.exit(1); }
console.log("\n✅ DRY 는 GET 만 보내고 진짜 리포트를 건드리지 않는다 · BRANDS 필터 · 인덱스는 전 브랜드");
