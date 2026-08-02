#!/usr/bin/env node
// 구조화 데이터(schema.org JSON-LD) 추출 회귀 테스트.
// worker/fabric-extractor.js 의 fromJsonLd()/titleCase() 를 그대로 떼어 실행한다.
//
// 이 경로가 값을 채워 줄수록 Gemini 호출이 줄어든다 = 무료 한도(429) 대기가 줄어든다.
// 그래서 여기가 조용히 망가지면 "무료 한도 대기 중" 이 다시 나타난다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");

const i = src.indexOf("function fromJsonLd(html) {");
const j = src.indexOf("function titleCase(s) {");
if (i < 0 || j < 0) { console.error("❌ fromJsonLd/titleCase 를 찾지 못함"); process.exit(1); }
const k = src.indexOf("}", src.indexOf("return String(s).toLowerCase()")) + 1;
const fromJsonLd = new Function(src.slice(i, k) + "\n return fromJsonLd;")();

const page = (ld) => `<html><head><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body></body></html>`;

let bad = 0;
const check = (label, got, want) => {
  for (const key of Object.keys(want)) {
    const a = JSON.stringify(got[key]), b = JSON.stringify(want[key]);
    if (a !== b) { bad++; console.error(`❌ ${label} · ${key}\n   기대 ${b}\n   실제 ${a}`); }
  }
};

// ── AggregateOffer + 사이즈별 offer + material 문자열 ──
check("AggregateOffer", fromJsonLd(page({
  "@context": "https://schema.org", "@type": "Product", name: "Silk Cami Top", color: "Ivory",
  material: "92% Silk, 8% Elastane",
  offers: {
    "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: "128.00",
    offers: [
      { "@type": "Offer", price: "128.00", priceCurrency: "USD", itemOffered: { size: "XS" } },
      { "@type": "Offer", price: "128.00", priceCurrency: "USD", itemOffered: { size: "S" } },
    ],
  },
})), {
  product_name: "Silk Cami Top", price: "$128", color: "Ivory", sizes: ["XS", "S"],
  composition: [{ material: "Silk", percent: 92 }, { material: "Elastane", percent: 8 }],
});

// ── @graph 안에 Product 가 들어 있는 경우(워드프레스·Shopify 테마에서 흔함) ──
check("@graph", fromJsonLd(page({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "BreadcrumbList" },
    { "@type": "Product", name: "Wool Coat", offers: { "@type": "Offer", price: "349", priceCurrency: "GBP" } },
  ],
})), { product_name: "Wool Coat", price: "£349" });

// ── @type 이 배열인 경우 ──
check("@type 배열", fromJsonLd(page({
  "@type": ["Product", "Thing"], name: "Linen Shirt",
  offers: { price: "79", priceCurrency: "EUR" },
})), { product_name: "Linen Shirt", price: "€79" });

// ── hasVariant 로 사이즈를 주는 경우 + 퍼센트 앞뒤가 뒤집힌 소재 표기 ──
check("hasVariant", fromJsonLd(page({
  "@type": "Product", name: "Jeans", material: "Cotton 98%, Elastane 2%",
  hasVariant: [{ size: "26" }, { size: "27" }, { size: "28" }],
  offers: { price: "110", priceCurrency: "KRW" },
})), {
  sizes: ["26", "27", "28"], price: "₩110",
  composition: [{ material: "Cotton", percent: 98 }, { material: "Elastane", percent: 2 }],
});

// ── 퍼센트 없는 소재는 materials 에만 ──
check("퍼센트 없는 소재", fromJsonLd(page({
  "@type": "Product", name: "Cardigan", material: "Merino Wool",
})), { materials: ["Merino Wool"], composition: [] });

// ── Product 가 없으면 전부 빈 값(예외 없이) ──
check("Product 없음", fromJsonLd(page({ "@type": "Organization", name: "Acme" })), {
  product_name: "", price: "", color: "", sizes: [], composition: [], materials: [],
});

// ── 깨진 JSON-LD 가 섞여 있어도 나머지를 읽는다 ──
{
  const html = `<script type="application/ld+json">{ this is not json </script>` +
    page({ "@type": "Product", name: "Tee", offers: { price: "25", priceCurrency: "USD" } });
  check("깨진 JSON-LD 혼재", fromJsonLd(html), { product_name: "Tee", price: "$25" });
}

// ── JSON-LD 자체가 없어도 예외를 던지지 않는다 ──
check("JSON-LD 없음", fromJsonLd("<html><body>no structured data</body></html>"), {
  product_name: "", price: "", sizes: [], composition: [],
});
check("빈 입력", fromJsonLd(""), { product_name: "", sizes: [], composition: [] });

if (bad) { console.error(`\n구조화 데이터 추출 ${bad}건 실패`); process.exit(1); }
console.log("✅ 구조화 데이터(JSON-LD) 추출 9건 통과");
