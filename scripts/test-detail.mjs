#!/usr/bin/env node
// 상품 상세 추출기(worker 의 '상품 상세(detail) 추출' 구간) 시험.
//
// 두 가지를 본다.
//   A. 규칙 시험 — 손으로 만든 작은 페이지로, 지켜야 할 것(메뉴·추천 칸·리뷰·배송 안내 빼기, 출처 순서, 상한,
//      Shopify .js/.json 둘 다, 재고 사이즈, Inditex parts JSON 의 '이 상품' 가리기)을 하나씩.
//   B. 실제 페이지 시험 — scripts/fixtures/pages/ 의 브랜드별 실제 상품 페이지(현장 지도 측정이 저장한 것)에 대해,
//      사람이 HTML 을 읽고 적은 기대값(scripts/fixtures/detail-pages/expected.json)과 견준다. 추출기 결과를 기대값으로 베끼지 않는다.
// 확장(background.js)의 복사본이 원본과 글자 그대로 같은지도 본다.
import { readFileSync, existsSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { detailOf, compFromPartsJson, detailBlock, compOf } from "./detail-core.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0, n = 0;
const eq = (name, got, want) => {
  n++;
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`  ❌ ${name}: ${g}\n       기대 ${w}`); bad++; } else console.log(`  ✓ ${name}`);
};

// ── A. 규칙 ──────────────────────────────────────────────────────────
const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...o })}</script>`;
{
  const html = `<html><head>${ld({ "@type": "Product", name: "Wren Linen Shirt", description: "A relaxed linen shirt &amp; easy layer.",
      image: ["https://cdn.x/1.jpg", "//cdn.x/2.jpg", { "@type": "ImageObject", url: "https://cdn.x/3.jpg" }, "https://cdn.x/swatch-red.jpg"],
      sku: "WLS-01", color: "Natural",
      offers: { "@type": "Offer", price: "128.00", priceCurrency: "GBP",
        priceSpecification: [{ "@type": "UnitPriceSpecification", priceType: "https://schema.org/StrikethroughPrice", price: "160.00", priceCurrency: "GBP" }] } })}</head>
    <body><header class="site-header"><h3>Details</h3><ul><li>Header promo bullet</li></ul></header>
    <nav><button>Details</button><ul><li>Menu bullet</li></ul></nav>
    <main><h1>Wren Linen Shirt</h1>
      <div class="product-accordion"><button>Details</button><div><ul><li>Relaxed fit</li><li>  Button   front </li><li>Free shipping on orders over £50</li></ul></div>
      <button>Size &amp; Fit</button><div><p>Model is 5'10" and wears a size S<br>Hits at the hip</p></div></div>
      <div class="recently-viewed"><h4>Features</h4><ul><li>Someone else's feature</li></ul></div>
      <div id="reviews"><h4>Details</h4><ul><li>Review bullet</li></ul></div></main>
    <template><h4>Details</h4><ul><li>Template bullet</li></ul></template>
    <footer><h4>Care</h4><ul><li>Footer bullet</li></ul></footer></body></html>`;
  const d = detailOf(html, "https://shop.example/p/wren");
  eq("JSON-LD 이름·설명(엔티티 풀기)", [d.name, d.desc], ["Wren Linen Shirt", "A relaxed linen shirt & easy layer."]);
  eq("사진 전부(// 보정·ImageObject·견본 조각 뺌)", d.imgs, ["https://cdn.x/1.jpg", "https://cdn.x/2.jpg", "https://cdn.x/3.jpg"]);
  eq("가격·정가(StrikethroughPrice)·통화", [d.price, d.priceOrig, d.cur], ["£128", "£160", "GBP"]);
  eq("코드·컬러", [d.sku, d.color], ["WLS-01", "Natural"]);
  eq("글머리표 — 메뉴·머리·꼬리·template·최근 본 상품·리뷰·배송 안내 빼고, 줄로 적은 Fit 칸 포함",
    d.feat, ["Relaxed fit", "Button front", "Model is 5'10\" and wears a size S", "Hits at the hip"]);
  eq("출처 표시", [d.src.desc, d.src.feat, d.src.imgs], ["jsonld", "dom", "jsonld"]);
}
{
  // ProductGroup + 변형: 컬러 전부·사이즈·재고 사이즈
  const v = (color, size, inStock) => ({ "@type": "Product", color, size, image: `https://cdn.x/${color}.jpg`,
    offers: { "@type": "Offer", price: "60", priceCurrency: "USD", availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } });
  const html = `<html><head>${ld({ "@type": "ProductGroup", name: "Rib Tank", productGroupID: "RT9", description: "Ribbed.",
    hasVariant: [v("Black", "S", true), v("Black", "M", false), v("Ivory", "S", true), v("Ivory", "L", true)] })}</head><body></body></html>`;
  const d = detailOf(html, "https://x/");
  eq("ProductGroup: 컬러 전부", d.colors, ["Black", "Ivory"]);
  eq("ProductGroup: 사이즈·재고 사이즈", [d.sizes, d.sizesIn], [["S", "M", "L"], ["S", "L"]]);
  eq("ProductGroup: 코드(productGroupID)·가격", [d.sku, d.price], ["RT9", "$60"]);
}
{
  // Shopify .js(가격 센트·available)
  const js = { title: "Everyday Tee", description: "<p>Our softest tee.</p><ul><li>Boxy fit</li><li>100% cotton</li></ul>",
    images: ["//cdn.shopify.com/a_800x.jpg", "//cdn.shopify.com/b.jpg"], options: [{ name: "Color", values: ["Bone", "Navy"] }, { name: "Size", values: ["S", "M", "L"] }],
    variants: [{ option1: "Bone", option2: "S", price: 4800, compare_at_price: 6000, available: true, sku: "ET4410-BONE-S" },
      { option1: "Bone", option2: "M", price: 4800, compare_at_price: 6000, available: false, sku: "ET4410-BONE-M" },
      { option1: "Navy", option2: "L", price: 4800, compare_at_price: null, available: true, sku: "ET4410-NAVY-L" }] };
  const d = detailOf("", "https://shop.x/products/everyday-tee", js);
  eq("Shopify .js: 설명·글머리표", [d.desc, d.feat], ["Our softest tee.", ["Boxy fit", "100% cotton"]]);
  eq("Shopify .js: 사진(크기 꼬리 다른 같은 사진은 하나)", d.imgs, ["https://cdn.shopify.com/a_800x.jpg", "https://cdn.shopify.com/b.jpg"]);
  eq("Shopify .js: 컬러·사이즈·재고", [d.colors, d.sizes, d.sizesIn], [["Bone", "Navy"], ["S", "M", "L"], ["S", "L"]]);
  eq("Shopify .js: 가격 센트→달러·정가", [d.price, d.priceOrig], ["$48", "$60"]);
  eq("Shopify .js: 코드 공통 앞부분(사이즈·색 꼬리 뗌)", d.sku, "ET4410");
  // .json(가격 문자열·body_html·options 에 values)
  const json = { product: { title: "Everyday Tee", body_html: "<p>Our softest tee.</p>", images: [{ src: "https://cdn.shopify.com/a.jpg" }],
    options: [{ name: "Size", values: ["S", "M"] }], variants: [{ option1: "S", price: "48.00", compare_at_price: "48.00", sku: "ET1" }] } };
  const dj = detailOf("", "https://shop.x/products/everyday-tee", json);
  eq("Shopify .json: 가격 문자열·같은 정가는 할인 아님·재고 모름", [dj.price, dj.priceOrig || "", dj.sizesIn || null], ["$48", "", null]);
}
{
  // 상한
  const long = "word ".repeat(600);
  const many = Array.from({ length: 40 }, (_, i) => `<li>Bullet number ${i}</li>`).join("");
  const d = detailOf(`<html><head>${ld({ "@type": "Product", name: "Cap", description: long })}</head><body><h2>Details</h2><ul>${many}</ul></body></html>`, "https://x/");
  eq("상한: 설명 1,500자 이하", d.desc.length <= 1500, true);
  eq("상한: 글머리표 25줄", d.feat.length, 25);
}
{
  // og:description 은 마지막 대안 · 메타 가격
  const html = `<html><head><meta property="og:description" content="Shop the latest at Brand."><meta property="product:price:amount" content="45.50"><meta property="product:price:currency" content="USD"></head>
    <body><div class="pdp"><h3>Description</h3><p>A cropped cardigan in a soft cotton blend, finished with pearl buttons.</p></div></body></html>`;
  const d = detailOf(html, "https://x/");
  eq("본문 칸 설명이 og:description 보다 먼저", d.desc, "A cropped cardigan in a soft cotton blend, finished with pearl buttons.");
  eq("메타 가격·통화", [d.price, d.cur], ["$45.5", "USD"]);
}
{
  // Inditex parts JSON — 하나뿐이면 받는다, 서로 다른 조성이 여럿이면 상품 번호 가까운 것만, 없으면 버린다.
  const part = (pairs) => `{"parts":[{"id":"1","description":"OUTER SHELL","areas":[],"components":[${pairs.map(([m, p], i) => `{"id":${i},"material":"${m}","percentage":"${p}%"}`).join(",")}],"microcontents":[]}]}`;
  eq("parts: 하나", compOf(`<script>x=${part([["cotton", 93], ["cashmere", 5], ["wool", 2]])}</script>`, "").comp, "Cotton 93% / Cashmere 5% / Wool 2%");
  const two = `<script>a={"reco":${part([["polyester", 100]])}};b={"id":"l06853106","detail":${part([["linen", 100]])}}</script>`;
  eq("parts: 여럿이면 상품 번호 뒤의 것", compOf(two, "https://www.massimodutti.com/us/linen-shirt-l06853106").comp, "Linen 100%");
  eq("parts: 여럿인데 번호를 모르면 버림", compOf(two, "https://x/no-id").comp, "");
  const lined = `<script>{"parts":[{"description":"OUTER SHELL","components":[{"material":"wool","percentage":"100%"}]},{"description":"LINING","components":[{"material":"viscose","percentage":"100%"}]}]}</script>`;
  eq("parts: 겉감·안감 두 줄", compFromPartsJson(lined, "").map((c) => `${c.line}:${c.material} ${c.percent}`), ["0:Wool 100", "1:Viscose 100"]);
}

{
  // 글머리표 정리: 단추 줄 · 매장 안내 · 이름표만 있는 줄 · 쌍점으로 시작하는 조각(2026-11-25 Zara 표본 모양)
  const html = `<html><body><h1>Interlock Tee</h1><h3>Composition &amp; care</h3><ul>
    <li><button><span>Check in-store availability</span></button></li>
    <li>Due to the holiday season, orders placed from the 15th of November can be returned until 30th of December.</li>
    <li>: 100% cotton</li><li>OUTER SHELL</li><li>100% cotton</li><li>LINING</li><li>Machine wash max. 30ºC</li></ul></body></html>`;
  eq("글머리표 정리 — 이름표+값은 한 줄로, 단추·반품 안내·조각·짝 없는 이름표는 뺌", detailOf(html, "https://x/").feat,
    ["OUTER SHELL: 100% cotton", "Machine wash max. 30ºC"]);
  // 겉감·장식: 겉감(같은 섬유 둘)이 온전하면 겉감, 장식 줄만으로는 답하지 않는다(Boden).
  eq("혼용률: Main 이 Trims 를 이긴다", compOf("<p>Main: 50% recycled polyester, 30% polyester, 20% elastane</p><p>Trims: 100% polyester</p>", "").comp, "Polyester 80% / Elastane 20%");
  eq("혼용률: 겉감이 조각이면 장식 줄을 답하지 않는다", compOf("<p>Main: 50% polyester and other stuff</p><p>Trims: 100% polyester</p>", "").comp, "");
  eq("혼용률: 겉감+안감 두 줄은 그대로", compOf("<p>Shell: 100% wool</p><p>Lining: 100% viscose</p><p>Rib: 95% cotton, 5% elastane</p>", "").comp, "Wool 100%\nViscose 100%");
}

// ── 확장 복사본 ──────────────────────────────────────────────────────
{
  const ext = readFileSync(join(ROOT, "chrome-extension/background.js"), "utf8");
  eq("확장: 상세 추출 구간이 worker 와 글자 그대로 같다", ext.includes(detailBlock()), true);
  const ec = readFileSync(join(ROOT, "scripts/enrich-comp.mjs"), "utf8");
  const blk = (src) => { const a = src.indexOf("// ── 이 상품 페이지를 정말 읽었나(none 판정) 시작"), b = src.indexOf("function productRead", a); const c = src.indexOf("// ── 이 상품 페이지를 정말 읽었나(none 판정) 끝", a); return a >= 0 ? src.slice(b, c) : null; };
  eq("확장: productRead 가 enrich-comp 와 같다", !!blk(ec) && blk(ext) === blk(ec), true);
}

// ── B. 실제 페이지(현장 지도 측정이 저장한 표본) ───────────────────────────
// expected.json: [{ brand, file, shop?, url, name, expect: { 칸: 값 | {has:"글"} | {count:N} | {min:N} | {first:"…"} } }]
// 값은 사람이 HTML 을 열어 읽은 것이다(expected.json 의 why 칸에 읽은 자리를 적었다).
const FIX = join(ROOT, "scripts/fixtures/detail-pages");   // 현장 측정이 덮어쓰지 않는 고정 사본(scripts/fixtures/pages 에서 옮김)
const EXP = join(FIX, "expected.json");
if (existsSync(EXP)) {
  const cases = JSON.parse(readFileSync(EXP, "utf8"));
  for (const c of cases) {
    const html = gunzipSync(readFileSync(join(FIX, c.file))).toString("utf8");
    const shop = c.shop ? JSON.parse(gunzipSync(readFileSync(join(FIX, c.shop))).toString("utf8")) : null;
    const d = detailOf(html, c.url, shop);
    const comp = compOf(html, c.url).comp;
    const got = { ...d, comp };
    for (const [k, want] of Object.entries(c.expect)) {
      const v = got[k];
      if (want && typeof want === "object" && !Array.isArray(want)) {
        if ("has" in want) eq(`${c.brand} · ${k} 에 "${String(want.has).slice(0, 40)}"`, (Array.isArray(v) ? v.join(" | ") : String(v || "")).includes(want.has), true);
        if ("count" in want) eq(`${c.brand} · ${k} 개수`, Array.isArray(v) ? v.length : -1, want.count);
        if ("min" in want) eq(`${c.brand} · ${k} ${want.min}개 이상`, Array.isArray(v) && v.length >= want.min, true);
        if ("first" in want) eq(`${c.brand} · ${k} 첫 값`, Array.isArray(v) ? v[0] : v, want.first);
        if ("not" in want) eq(`${c.brand} · ${k} 에 "${String(want.not).slice(0, 40)}" 없음`, (Array.isArray(v) ? v.join(" | ") : String(v || "")).includes(want.not), false);
        if ("empty" in want) eq(`${c.brand} · ${k} 비어 있음(사이트가 이 페이지에 안 적음)`, Array.isArray(v) ? v.length : String(v || "").length, 0);
      } else eq(`${c.brand} · ${k}`, v === undefined ? "" : v, want);
    }
  }
}
console.log(bad ? `\n${bad}/${n}개 실패` : `\n모두 통과(${n})`);
process.exit(bad ? 1 : 0);
