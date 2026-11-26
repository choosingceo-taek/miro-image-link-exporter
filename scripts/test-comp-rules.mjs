#!/usr/bin/env node
// 혼용률 추출 규칙 — 2026-11-26 에 더한 것만 따로 본다(worker/fabric-extractor.js 의 compFromText · compFromHtml).
//
// 실제 페이지에서 본 글을 줄여 넣었다(어느 브랜드·어느 측정에서 봤는지는 각 줄에). 기대값은 사람이 페이지 글을 읽고 적었다.
// 같은 페이지 전체는 scripts/fixtures/detail-pages/expected.json 의 2026-11-26 항목이 시험한다(test-detail.mjs).
//
// 확장(chrome-extension/background.js)의 복사본은 이 규칙이 아직 없다 — test-composition.mjs 는 두 구현이 같은 것만 본다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const block = src.slice(src.indexOf("const FIBRES = {"), src.indexOf("function titleCase"));
const { compFromText, compFromHtml, validComp } = new Function(block + "\n return { compFromText, compFromHtml, validComp };")();
const asStr = (v) => {
  const lines = [];
  for (const c of v) { const n = c.line || 0; (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`); }
  return lines.filter(Boolean).map((l) => l.join(" / ")).join("\n");
};

let bad = 0, n = 0;
const eq = (label, got, want) => {
  n++;
  if (got !== want) { bad++; console.error(`  ❌ ${label}\n     기대 ${JSON.stringify(want)}\n     실제 ${JSON.stringify(got)}`); }
  else console.log(`  ✓ ${label}`);
};

const TEXT = [
  // ── 줄임말(Dickies) — 퍼센트 바로 뒤, 수식어 없이만
  ["Dickies Poly·Rayon·Spandex", "Features V-Neck Top Fabric Composition: 77%Poly 20%Rayon 3%Spandex Fabric description: 2-Way Stretch", "Polyester 77% / Viscose 20% / Elastane 3%"],
  ["Dickies CTN·POLY·NYLON·SPAN", "Fabric Composition: 55%CTN 34%POLY 8%NYLON 3%SPAN Fabric description: 2-Way Stretch", "Cotton 55% / Polyester 34% / Nylon 8% / Elastane 3%"],
  ["Nation LTD 'Span' 꼬리", "CONTENT 66% Cotton, 32% Lyocell, 2% Span MADE IN Peru", "Cotton 66% / Lyocell 32% / Elastane 2%"],
  ["줄임말은 섬유 뒤 퍼센트(역방향)로 읽지 않는다", "Wing span 100% guaranteed. Sizes S M L.", ""],
  ["줄임말 앞에 수식어가 있으면 읽지 않는다", "Covers 100% of the span of the shoulders.", ""],
  ["'poly cotton' 혼방 설명은 조각이라 비운다", "A 65% poly cotton blend tee.", ""],
  // ── 상표 + 일반 이름
  ["Spanx Tencel™ Modal 은 Modal", "Bodice: 49% Polyester, 44% Tencel™ Modal, 7% Elastane.", "Polyester 49% / Modal 44% / Elastane 7%"],
  ["Poetry TENCEL™ lyocell 뒤 virgin wool", "79% TENCEL™ lyocell 21% virgin wool", "Lyocell 79% / Wool 21%"],
  ["Marine Layer TENCEL™ Modal", "49% Cotton, 47% TENCEL™ Modal, 4% Spandex Hugs the body", "Cotton 49% / Modal 47% / Elastane 4%"],
  ["Athleta LYCRA® Elastane", "Fabric & care 75% Nylon/25% LYCRA® Elastane", "Nylon 75% / Elastane 25%"],
  ["상표만 있으면 상표가 섬유(예전과 같다)", "Made of 100% Tencel. Machine wash.", "Lyocell 100%"],
  ["Banana Republic viscose rayon · ECOVERO™ (viscose rayon) · elastane spandex", "Fabric & care 84% viscose rayon, 15% LENZING™ ECOVERO™ (viscose rayon), 1% elastane spandex. Machine wash cold", "Viscose 99% / Elastane 1%"],
  // ── 떨어진 퍼센트는 한 벌이 아니다 · 'Fabric & care' 는 소재 제목(Gap)
  ["Gap — 설명의 'Made with 14%' + Fabric & care + 추천 카드", "Elasticized hems. Made with 14% recycled polyester. Compared to virgin materials, using recycled materials helps reduce resource use and waste. Product #856413 Size & fit Fit: Relaxed. Fabric & care 86% Cotton, 14% Recycled Polyester. Machine wash cold. Imported. Shipping & returns Shop the collection " + "VintageSoft Hoodie $79.95 50% off at checkout ".repeat(8) + "100% Cotton Track Sweater Pants $99.95", "Cotton 86% / Polyester 14%"],
  // ── 새 섬유 이름
  ["Mint Velvet metallised fibre", "Composition: Main, 31% metallised fibre, 69% viscose Wash Care", "Metallic 31% / Viscose 69%"],
  ["ba&sh METALLIZED FIBER", "Material: 62% VISCOSE / 38% METALLIZED FIBER Made in: China", "Viscose 62% / Metallic 38%"],
  ["ba&sh ELASTOMULTIESTER", "Material: 92% COTTON / 6% ELASTOMULTIESTER / 2% ELASTANE Made in: Turkey", "Cotton 92% / Elastomultiester 6% / Elastane 2%"],
  ["Poetry yak", "50% hemp 44% organic cotton 6% yak Design details", "Hemp 50% / Cotton 44% / Yak 6%"],
  ["ba&sh 프랑스어", "Composition: 85% LAINE / 14% POLYAMIDE / 1% ELASTHANNE Fabriqué en : Chine", "Wool 85% / Nylon 14% / Elastane 1%"],
  ["Rouje 프랑스어(띄어 쓴 %, é)", "Matières & Entretien Composition : Tissu principal : 93 % coton, 7 % élasthanne Entretien", "Cotton 93% / Elastane 7%"],
  ["'lin' 은 섬유로 읽지 않는다(짧아 오탐)", "Composition : 100 % lin lavé", ""],
  // ── 목록 안의 부위 이름에서 끊기(Mint Velvet)
  ["Main, … ,lining, …", "Composition: Main, 41% polyamide, 59% viscose,lining, 3% elastane, 97% polyester Wash Care", "Nylon 41% / Viscose 59%\nElastane 3% / Polyester 97%"],
  ["Main, … ,main 2, …", "Composition: Main, 52% polyamide, 48% viscose,main 2, 84% lyocell, 16% polyester Wash Care", "Nylon 52% / Viscose 48%\nLyocell 84% / Polyester 16%"],
  ["Lining: 콜론 — 합 105% 안이어도 끊는다", "Shell: 97% cotton, 3% elastane. Lining: 3% elastane, 97% polyester", "Cotton 97% / Elastane 3%\nElastane 3% / Polyester 97%"],
  ["끊어도 장식 줄은 여전히 뺀다", "Main: 95% cotton, 5% elastane, Trim: 100% polyester", "Cotton 95% / Elastane 5%"],
  // ── 겉감 이름 없이 장식·배색 줄 빼기(Vanessa Bruno)
  ["Secondary fabric · Embroidery", "Ref : 6HVA32 Composition : 100% viscose. Secondary fabric 100% cotton. Embroidery 100% polyester Origin: India", "Viscose 100%"],
  ["Vanessa Bruno tertiary fabric · embroidery · lace", "Ref : 6HVA27-V09920-048 Composition : 100% cotton / tertiary fabric 62% cotton, 38% polyester / embroidery 100% polyester / lace 62% cotton, 38% polyester Origin", "Cotton 100%"],
  ["이름 없는 한 벌 + Trim", "100% cotton. Trim: 100% polyester. Machine wash.", "Cotton 100%"],
  // ── 다른 줄의 조각을 되풀이한 줄(Everlane)
  ["Why It's Better 의 97% organic cotton", "Materials: 97% Organic Cotton 3% Elastane Why It's Better This style is made with 97% organic cotton, certified", "Cotton 97% / Elastane 3%"],
  ["서로 다른 두 원단은 그대로(겉감 · 안감)", "Shell: 100% Wool. Lining: 100% Polyester", "Wool 100%\nPolyester 100%"],
];
for (const [label, text, want] of TEXT) eq(label, asStr(compFromText(text)), want);

// ── 페이지 HTML — 하이픈에 붙은 'body' 는 겉감 이름이 아니다(Spanx 의 깨진 클래스 글)
{
  const html = `<html><body><h1>AirEssentials Jumpsuit</h1><ul class="[&>li]:mt-0 [&>li]:text-sm leading-[var(--body-leading)]">` +
    `<li>Bodice: 49% Polyester, 44% Tencel™ Modal, 7% Elastane. Bottom: 47% Tencel™ Modal, 46% Polyester, 7% Elastane.</li>` +
    `<li>Machine Wash Cold, Gentle Cycle.</li></ul></body></html>`;
  eq("Spanx — '--body-leading' 클래스 글 뒤 Bodice + Bottom 두 줄", asStr(compFromHtml(html)), "Polyester 49% / Modal 44% / Elastane 7%\nModal 47% / Polyester 46% / Elastane 7%");
}
// 페이지 JSON 안의 "Composition: Main, …,main 2, …" — 두 줄이어도 한 상품의 소재 문자열이다(Mint Velvet, 평 fetch 판)
{
  const html = `<html><body><h1>Black Knit Top</h1><p>Lovely top.</p><script>var s={"type":"@theme","settings":{"content":" Composition: Main, 52% polyamide, 48% viscose,main 2, 84% lyocell, 16% polyester ","text_alignment":"left"}}</script></body></html>`;
  eq("Mint Velvet — 테마 JSON 의 Composition: Main, … main 2", asStr(compFromHtml(html)), "Nylon 52% / Viscose 48%\nLyocell 84% / Polyester 16%");
  const recs = `<html><body><h1>Top</h1><script>var recs=[{"d":"100% cotton tee"},{"d":"95% viscose 5% elastane dress"}]</script></body></html>`;
  eq("부위 이름 없는 JSON 의 두 조성(추천 상품)은 예전처럼 버린다", asStr(compFromHtml(recs)), "");
}
// 사이트가 첫 섬유만 적은 값(Wilson '46% Cotton')은 옳은 값이 아니다 — 저장하지 않는다.
eq("Wilson — '46% Cotton' 하나는 옳은 값이 아니다", String(validComp(asStr(compFromText("Product details table Composition 46% Cotton Fit Type Easy")))), "false");

console.log(bad ? `\n${bad}/${n}개 실패` : `\n✅ 2026-11-26 혼용률 규칙 ${n}건 통과`);
process.exit(bad ? 1 : 0);
