#!/usr/bin/env node
// 야간 보강(enrich-comp.mjs)의 상품 상세·impit 층을 가짜 Worker·가짜 쇼핑몰에 붙여 끝까지 돌린다.
//
// 보는 것:
//   ① 페이지를 연 김에 설명·디테일 글머리표·사진 전부·컬러 전부를 뽑아 detail:<site>(store=details)에 따로 저장한다.
//      오버레이(comp:<site>)에는 상세가 섞이지 않는다.
//   ② 평 fetch 가 막히는(403) 페이지를 impit(크롬 TLS 지문)으로 읽는다 — Whitestuff·J.Crew 형.
//   ③ impit 까지 막힌 상품은 오버레이에 bv="fetch,impit" 를 남겨, 다음부터는 재시도 창을 지킨다.
//   ④ impit 이 생기기 전에 '못 읽음'으로 끝나 5일 창에 갇힌 상품은 한 번 다시 연다. bv 에 impit 이 있으면 안 연다.
//   ⑤ DETAIL_BACKFILL=1: 혼용률은 찼는데 상세가 없는 상품을 3차로 연다. 최근에 상세를 본 상품은 안 연다.
//   ⑥ 상세 저장값을 못 읽으면(500) 상세를 저장하지 않는다(빈 값으로 덮어쓰지 않게).
//   ⑦ Massimo Dutti 형 — 소재가 페이지 JSON(parts/components)에만 있어도 혼용률을 읽는다.
//   ⑧ DRY=1 이면 store=details 도 보내지 않는다.
//   ⑨ 브랜드 대부분에 똑같이 붙는 설명(사이트 공통 문구)은 저장 직전 가드가 뺀다.
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { startFake, runEnrich } from "./fixtures/fake-enrich-env.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMPIT_MODULE = join(ROOT, "scripts/fixtures/fake-impit.mjs");
const DAY = 86400000;
let bad = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`  ❌ ${name}: ${g} (기대 ${w})`); bad++; } else console.log(`  ✓ ${name}`);
};
// 리포트 파일은 테스트가 덮어쓰므로 끝나면 되돌린다.
const REPORTS = ["enrich-comp-report.md", "enrich-comp-dry-report.md"].map((f) => join(ROOT, f));
const saved = REPORTS.map((f) => (existsSync(f) ? readFileSync(f, "utf8") : null));

const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", ...o })}</script>`;
const filler = "<p>" + "This piece is part of our everyday collection, designed to be worn season after season. ".repeat(10) + "</p>";
const page = (name, body, ldo) => `<html><head><title>${name}</title>${ldo ? ld({ name, ...ldo }) : ""}</head><body>
  <nav><button>Details</button><ul><li>Menu item that is not a product detail</li></ul></nav>
  <main><h1>${name}</h1>${body}${filler}</main>
  <section class="product-recommendations"><h3>Details</h3><ul><li>Someone else's bullet</li></ul></section></body></html>`;
const NAMES = { 1: "Linen Camp Shirt", 2: "Organic Rib Tank", 3: "Blocked Wool Coat", 4: "Stuck Tee", 5: "Done Blocked Tee",
  6: "Backfill Dress", 7: "Recent Detail Dress", 8: "Striped Henley Knit T-shirt" };

function world(base, extraOverlay = {}) {
  const items = Object.entries(NAMES).map(([n, name]) => ({ name, productUrl: `${base}/p/${n}`, imageUrl: `${base}/i/${n}.jpg` }));
  const now = Date.now();
  const overlay = {
    [`${base}/p/4`]: { t: now - 2 * DAY },                                   // impit 전에 못 읽음 — 5일 창 안
    [`${base}/p/5`]: { t: now - 2 * DAY, bv: "fetch,impit" },                // impit 으로도 막혔던 상품
    [`${base}/p/6`]: { t: now - 40 * DAY, comp: "Cotton 100%", color: "Ivory" },   // 혼용률 있음, 상세 없음
    [`${base}/p/7`]: { t: now - 40 * DAY, comp: "Cotton 100%", color: "Ivory" },   // 혼용률 있음, 상세 최근
    ...extraOverlay,
  };
  const details = { [`${base}/p/7`]: { desc: "Kept description.", dt: now - DAY } };
  return { items, overlay, details };
}
const PAGES = {
  "/p/1": page("Linen Camp Shirt", `<div class="pdp-accordion">
      <button aria-expanded="false">Description</button><div><p>An easy camp-collar shirt cut from washed European linen for warm days.</p></div>
      <button aria-expanded="false">Details</button><div><ul><li>Relaxed fit</li><li>Camp collar</li><li>Hits at hip</li><li>Free shipping on orders over $100</li></ul></div>
      <h3>Fabric &amp; Care</h3><div><p>100% Linen<br>Machine wash cold</p></div></div>`,
    { color: "Sand", image: ["https://cdn.example/1a.jpg", "https://cdn.example/1b.jpg"], sku: "LCS-001",
      offers: { "@type": "Offer", price: "88.00", priceCurrency: "USD", availability: "https://schema.org/InStock" } }),
  "/p/4": page("Stuck Tee", "<div>Composition: 100% Cotton</div>", { color: "White" }),
  "/p/5": page("Done Blocked Tee", "<div>Composition: 100% Cotton</div>", { color: "White" }),
  "/p/6": page("Backfill Dress", `<h2>Product Details</h2><ul><li>Midi length</li><li>Square neckline</li></ul><div>Composition: 100% Cotton</div>`, { color: "Ivory" }),
  "/p/7": page("Recent Detail Dress", "<div>Composition: 100% Cotton</div>", { color: "Ivory" }),
  // Massimo Dutti 형 — 소재는 화면에 없고 스크립트 JSON 에만.
  "/p/8": page("Striped Henley Knit T-shirt", `<script>window.__STATE__ = {"product":{"id":"l06853106","detailedComposition":{"parts":[{"id":"1","description":"OUTER SHELL","areas":[],"components":[{"id":1,"material":"cotton","percentage":"93%"},{"id":23,"material":"cashmere","percentage":"5%"},{"id":2,"material":"wool","percentage":"2%"}],"microcontents":[]}]}}};</script>`, { color: "Navy Blue" }),
};
const IMPIT_ONLY = {
  "/p/2": page("Organic Rib Tank", "<h3>Features</h3><ul><li>Slim fit</li><li>Scoop neck</li></ul><div>Composition: 95% Organic Cotton, 5% Elastane</div>", { color: "Black" }),
};

// ── 1. 본 실행: impit 켬 · 3차 켬 ──
{
  const f = await startFake({
    items: (base) => world(base).items, overlay: (base) => world(base).overlay, details: (base) => world(base).details,
    pages: PAGES, impitOnly: IMPIT_ONLY,
  });
  const { code, out } = await runEnrich(f.base, { IMPIT_MODULE, DETAIL_BACKFILL: "1", RETRY_ALL: "" });
  if (code !== 0) console.log(out.slice(-2000));
  eq("실행 성공", code, 0);
  const ov = f.state.overlay, dt = f.state.details, b = f.base;
  eq("② impit 으로 읽은 혼용률 저장(평 fetch 403)", ov[`${b}/p/2`] && ov[`${b}/p/2`].comp, "Cotton 95% / Elastane 5%");
  eq("② impit 으로 읽은 상품의 디테일", dt[`${b}/p/2`] && dt[`${b}/p/2`].feat, ["Slim fit", "Scoop neck"]);
  eq("③ impit 까지 막힌 상품에 bv", ov[`${b}/p/3`] && ov[`${b}/p/3`].bv, "fetch,impit");
  eq("④ 5일 창에 갇힌(impit 전) 상품을 다시 열었다", f.state.hits["/p/4"], 1);
  eq("④ 다시 열어 혼용률을 채웠다", ov[`${b}/p/4`] && ov[`${b}/p/4`].comp, "Cotton 100%");
  eq("④ bv 에 impit 이 있는 상품은 안 열었다", f.state.hits["/p/5"] || 0, 0);
  eq("⑤ 3차: 상세 없는 상품을 열었다", f.state.hits["/p/6"], 1);
  eq("⑤ 3차: 상세 저장", dt[`${b}/p/6`] && dt[`${b}/p/6`].feat, ["Midi length", "Square neckline"]);
  eq("⑤ 3차: 최근에 상세를 본 상품은 안 열었다", f.state.hits["/p/7"] || 0, 0);
  eq("⑤ 예전 상세는 남는다", dt[`${b}/p/7`] && dt[`${b}/p/7`].desc, "Kept description.");
  const d1 = dt[`${b}/p/1`] || {};
  eq("① 설명(본문 칸)", d1.desc, "An easy camp-collar shirt cut from washed European linen for warm days.");
  eq("① 디테일 — 메뉴·추천 칸·배송 안내는 빠짐", d1.feat, ["Relaxed fit", "Camp collar", "Hits at hip", "100% Linen", "Machine wash cold"]);
  eq("① 사진 전부(JSON-LD)", d1.imgs, ["https://cdn.example/1a.jpg", "https://cdn.example/1b.jpg"]);
  eq("① 코드·통화", [d1.sku, d1.cur], ["LCS-001", "USD"]);
  eq("① 상세는 오버레이에 섞이지 않는다", Object.keys(ov[`${b}/p/1`] || {}).some((k) => ["desc", "feat", "imgs"].includes(k)), false);
  eq("① 오버레이 혼용률·컬러·가격", [ov[`${b}/p/1`].comp, ov[`${b}/p/1`].color, ov[`${b}/p/1`].price], ["Linen 100%", "Sand", "$88"]);
  eq("⑦ Massimo Dutti 형 parts JSON 혼용률", ov[`${b}/p/8`] && ov[`${b}/p/8`].comp, "Cotton 93% / Cashmere 5% / Wool 2%");
  // 예전엔 차수(1·2·3차)마다 저장해 3번이었다. 이제 실행 끝에 브랜드마다 한 번(KV 쓰기 한도 — DAILY-AUTOMATION.md '쓰기 예산').
  eq("상세 저장은 실행에 한 번(1·2·3차를 모아서)", f.state.detailStores.length, 1);
  await f.close();
}

// ── 2. 상세 저장값을 못 읽으면 상세를 저장하지 않는다 ──
{
  const f = await startFake({
    items: (base) => world(base).items, overlay: (base) => world(base).overlay, details: (base) => world(base).details,
    pages: PAGES, impitOnly: IMPIT_ONLY, detailsStatus: 500,
  });
  const { code } = await runEnrich(f.base, { IMPIT_MODULE, DETAIL_BACKFILL: "1" });
  eq("⑥ 실행 성공", code, 0);
  eq("⑥ store=details 를 보내지 않았다", f.state.detailStores.length, 0);
  eq("⑥ 혼용률 보강은 그대로 했다", !!(f.state.overlay[`${f.base}/p/1`] || {}).comp, true);
  await f.close();
}

// ── 3. DRY: 아무것도 안 쓴다 ──
{
  const f = await startFake({
    items: (base) => world(base).items, overlay: (base) => world(base).overlay, details: (base) => world(base).details,
    pages: PAGES, impitOnly: IMPIT_ONLY,
  });
  const { code } = await runEnrich(f.base, { IMPIT_MODULE, DETAIL_BACKFILL: "1", DRY: "1" });
  eq("⑧ DRY 실행 성공", code, 0);
  eq("⑧ DRY — POST 0회", f.state.requests.filter((r) => r.method !== "GET").length, 0);
  await f.close();
}

// ── 4. impit 이 없으면(IMPIT=0) 예전처럼 — 5일 창에 갇힌 상품은 안 연다 ──
{
  const f = await startFake({
    items: (base) => world(base).items, overlay: (base) => world(base).overlay, details: (base) => world(base).details,
    pages: PAGES, impitOnly: IMPIT_ONLY,
  });
  const { code } = await runEnrich(f.base, { IMPIT: "0" });
  eq("impit 없음 — 실행 성공", code, 0);
  eq("impit 없음 — 창에 갇힌 상품은 안 연다", f.state.hits["/p/4"] || 0, 0);
  eq("impit 없음 — 평 fetch 403 페이지는 못 읽는다", (f.state.overlay[`${f.base}/p/2`] || {}).comp || "", "");
  eq("impit 없음 — bv 를 적지 않는다", "bv" in (f.state.overlay[`${f.base}/p/3`] || {}), false);
  await f.close();
}

// ── 5. ⑨ 사이트 공통 설명은 가드가 뺀다 ──
{
  const many = {};
  const names = {};
  for (let i = 1; i <= 8; i++) {
    names[i] = `Boilerplate Item ${["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel"][i - 1]}`;
    many[`/p/${i}`] = page(names[i], `<div>Composition: 100% Cotton</div>`, { color: "Blue", description: "Free returns within 30 days. Our studio designs pieces to last for years to come." });
  }
  const f = await startFake({
    items: (base) => Object.entries(names).map(([n, name]) => ({ name, productUrl: `${base}/p/${n}`, imageUrl: "x" })),
    pages: many,
  });
  const { code } = await runEnrich(f.base, { IMPIT: "0" });
  eq("⑨ 실행 성공", code, 0);
  const vals = Object.values(f.state.details);
  eq("⑨ 상세 기록은 남는다(사진·컬러 등)", vals.length, 8);
  eq("⑨ 8개 모두에 붙은 같은 설명은 저장하지 않았다", vals.filter((d) => d.desc).length, 0);
  await f.close();
}

REPORTS.forEach((f, i) => { if (saved[i] != null) writeFileSync(f, saved[i]); });
console.log(bad ? `\n${bad}개 실패` : "\n모두 통과");
process.exit(bad ? 1 : 0);
