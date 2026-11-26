#!/usr/bin/env node
// 본문 텍스트에서 혼용률 뽑기 회귀 테스트.
// worker/fabric-extractor.js 의 compFromText() 를 그대로 떼어 실행한다.
//
// 이 경로가 성공할수록 AI 호출이 줄어든다 = "AI 보강이 필요해 잠시 대기" 가 사라진다.
// 반대로 "20% OFF" 를 섬유로 오인하면 엉터리 혼용률이 엑셀에 실린다. 양쪽 다 잡는다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");

const i = src.indexOf("const FIBRES = {");
const j = src.indexOf("\n}", src.indexOf("function compFromText(text) {")) + 2;
if (i < 0 || j < 2) { console.error("❌ compFromText 블록을 찾지 못함"); process.exit(1); }
const compFromText = new Function(src.slice(i, j) + "\n return compFromText;")();

// 원단이 둘이면 항목에 line 번호가 달려 온다 — 줄로 나눠 합친다(enrich 의 asComp 와 같다).
const asStr = (v) => {
  const lines = [];
  for (const c of v) {
    const n = c.line || 0;
    (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`);
  }
  return lines.filter(Boolean).map((l) => l.join(" / ")).join("\n");
};

// 2026-11-24 Zara 상품 페이지에서 잡은 실제 화면 글(줄임). 메뉴에 기획전 이름 "100% WOOL | CASHMERE" 가 있다.
const ZARA_MENU = "Skip to main content Search Bag 0 LOG IN Help WOMAN MAN KIDS ZARA HOME BEAUTY MASSIMO DUTTI ZARA SRPLS " +
  "DISCOVER CAMPAIGN COLLECTION LOOKBOOK TRI-CHIC RE{FORM}ZARA THE FILM INSTALLATION 01 NEW ARRIVALS THE NEW SKI COLLECTION " +
  "NEW BACK IN STOCK 02 FEATURED EDITS PARTYWEAR 100% WOOL | CASHMERE 03 COLLECTION BEST SELLERS JACKETS | TRENCHES COATS " +
  "PUFFERS | TECHNICAL BLAZERS KNITWEAR DRESSES PANTS JEANS SKIRTS T-SHIRTS SHIRTS | BLOUSES TOPS | BODYSUITS SWEATSHIRTS | " +
  "SWEATPANTS SWEATERS | CARDIGANS SHOES | BAGS CO-ORD SETS SUEDE | LEATHER ACCESSORIES | JEWELRY PERFUMES | BEAUTY LINGERIE " +
  "SPECIAL PRICES 04 SPECIAL EDITION 05 THE FOLD-ER 06 ZARA PRE-OWNED 07 ZARA HOME 08 660 FITH AVENUE NYC TRAVEL MODE GIFT CARD " +
  "STORES DOWNLOAD APP SUSTAINABILITY CAREERS + INFO ".repeat(1) + "THE NEW SKI COLLECTION PARTY KNITWEAR 01 NEW ARRIVALS ".repeat(30);
const ZARA_TAIL = "Add to cart Add Description Straight-fit T-shirt with round neck and short sleeves. See more Complete your look " +
  "Product Measurements Composition & care Check in-store availability Shipping, Exchanges and Returns Due to the holiday " +
  "season, orders placed from the 15th of November can be returned until 30th of December.";
const CARE = "Care: machine wash at max. 30ºC/86ºF with short spin cycle. Do not use bleach. Iron at a maximum of 110ºC/230ºF. " +
  "Do not dry clean. Do not tumble dry. Wash inside out. Our garments are made with care to last. ".repeat(3);

const CASES = [
  // ── 정상적으로 잡혀야 하는 표기들 ──
  ["Composition: 60% Cotton, 40% Modal", "Cotton 60% / Modal 40%"],
  ["Fabric — 100% Cotton", "Cotton 100%"],
  ["Material: Cotton 98%, Elastane 2%", "Cotton 98% / Elastane 2%"],
  ["95% Organic Cotton 5% Spandex", "Cotton 95% / Elastane 5%"],       // 별칭 정규화
  ["Made of 70% Viscose 30% Polyamide", "Viscose 70% / Nylon 30%"],
  ["소재: 폴리에스테르 65%, 레이온 35%", "Polyester 65% / Viscose 35%"],
  ["Shell: 100% Recycled Polyester", "Polyester 100%"],
  ["55% Linen / 45% Tencel", "Linen 55% / Lyocell 45%"],
  // 겉감(같은 섬유 둘: 재생 폴리 + 폴리)이 장식(Trims) 줄을 이긴다 — 2026-11-25 Boden.
  ["Main: 50% recycled polyester, 30% polyester, 20% elastane. Trims: 100% polyester", "Polyester 80% / Elastane 20%"],
  ["Main: 50% polyester blend. Trims: 100% polyester", ""],
  ["Shell: 100% Wool. Rib: 95% Cotton, 5% Elastane", "Wool 100%"],
  // 겉감 줄이 있으면 부위 이름 없는 줄(설명 글의 나열)도 뺀다 — Rag & bone Lucy henley.
  ["A layering piece. 100% Wool 100% Cotton Size & Fit. Materials: Body: 100% wool. Trim: 100% cotton. Details: placket", "Wool 100%"],
  // 금속사 — Oasis "Main: 60% Nylon, 40% Metal; Lining: 100% Polyester".
  ["Main: 60% Nylon, 40% Metal; Lining: 100% Polyester.", "Nylon 60% / Metallic 40%\nPolyester 100%"],
  // 섬유 이름 + 낱말 + 퍼센트인데 퍼센트 바로 뒤에 섬유가 오면 그 퍼센트는 뒤 섬유의 것 — The Great 창 이름 "Modal spinner".
  ["Fit Guide dialog Modal spinner Details 100% Cotton Machine Wash Cold", "Cotton 100%"],
  // 붙어 있는 "Cotton 95% Silk 5%" 는 그대로(앞 섬유 + 바로 뒤 퍼센트).
  ["Cotton 95% Silk 5%", "Cotton 95% / Silk 5%"],
  // 기획전·메뉴 이름 "100% Cotton Shop" 은 소재가 아니다 — Z Supply.
  ["The Layering Shop 100% Cotton Shop All Day Collection … Details Crew neck Waffle Thermal: 60% Cotton, 40% Polyester Machine Wash Cold", "Cotton 60% / Polyester 40%"],

  // ── 실제로 못 뽑던 본문 (2026-08-05 진단에서 나온 그대로) ──
  // 퍼센트와 섬유 이름 사이에 수식어가 끼면 예전에는 통째로 놓쳤다.
  ["Goldie — 100% Peruvian pima cotton Premium double-faced pima", "Cotton 100%"],
  ["Stateside — Our 100% Supima Cotton Slub Jersey is a lightweight knit", "Cotton 100%"],
  ["Everlane — Materials: 90% LENZING\u2122 ECOVERO\u2122 Viscose, 10% Elastane",
    "Viscose 90% / Elastane 10%"],
  ["Reformation — Made from 67% TENCEL\u2122 Lyocell, 29% Organically Grown Cotton, and 4% Elastane",
    "Lyocell 67% / Cotton 29% / Elastane 4%"],
  // Massimo Dutti — 섬유 이름과 퍼센트 사이에 괄호가 낀다. 이걸 놓치면 실크가
  // 빠진 채 "Cotton 95%" 만 남는데, 95% 는 유효 범위라 틀린 값이 그대로 저장된다.
  ["COMPOSITION OUTER LAYER Cotton 95%, Silk (mulberry) 5%", "Cotton 95% / Silk 5%"],
  // 인증 표기처럼 낱말이 길게 붙어도 잡는다.
  ["95% OCS CERTIFIED ORGANICALLY GROWN COTTON", "Cotton 95%"],
  // 역방향에도 판촉 문구 방어가 걸려야 한다.
  ["Cotton tees are 20% off", ""],

  // 목화 품종명이 섬유 이름 자리에 그대로 오는 표기.
  ["Evereve — Material: 48% Pima, 48% Modal, 4% Spandex Jersey",
    "Cotton 48% / Modal 48% / Elastane 4%"],
  // ── 섬유가 아닌 퍼센트는 무시해야 한다 ──
  // 수식어를 허용하면 "20% off cotton" 을 소재로 읽을 위험이 생긴다. 그래서
  // 수식어 자리에 판촉 낱말이 오면 버린다 — 아래 세 건이 그 경계를 지킨다.
  ["20% off cotton tees this week only", ""],
  ["Save 15% on all linen shirts", ""],
  ["Extra 20% OFF everything today", ""],
  ["100% satisfaction guaranteed. Free returns.", ""],
  ["Save 30% on your first order", ""],
  // 할인 문구와 실제 혼용률이 섞여 있어도 혼용률만 집는다
  ["20% OFF · Composition: 80% Wool, 20% Nylon", "Wool 80% / Nylon 20%"],

  // ── 같은 섬유가 다시 나오면 거기서 한 벌이 끝난 것으로 본다 ──
  // 건너뛰고 계속 읽으면 다음 사양의 항목을 끌어와 없는 조성을 만든다.
  ["100% Cotton. Care: machine wash. 100% Cotton lining.", "Cotton 100%"],
  // Dickies — 색상별 사양이 이어진다. 예전에는 Cotton 100 + Polyester 10 = 110% 라는
  // 없는 조성을 만들어 통째로 버려졌다. 이제 먼저 적힌 본체 사양을 남긴다.
  ["6.75 oz. 100% Cotton Jersey, Heavyweight Heather Gray: 90% Cotton/10% Polyester Imported",
    "Cotton 100%\nCotton 90% / Polyester 10%"],
  // 겉감·안감이 각각 100% 인 표기는 줄을 나눠 둘 다 남긴다.
  ["Shell: 100% Cotton. Lining: 100% Polyester", "Cotton 100%\nPolyester 100%"],

  // ── 합이 터무니없으면 통째로 버린다(겉감·안감·트림이 뒤섞인 페이지) ──
  ["100% Cotton 100% Polyester 100% Wool", ""],

  // 실제 화면(FABRICATION 섹션) — 섬유가 아닌 소재 표현은 무시하고 %만 잡는다
  ["FABRICATION 매우 부드러운 플리스 패브릭 폴리에스테르 100%", "Polyester 100%"],

  // ── 멀리 떨어진 두 벌은 한 옷의 두 원단이 아니다(2026-11-24 Zara) ──
  // 숨은 메뉴의 기획전 이름 "100% WOOL | CASHMERE" 와 3,000자 뒤의 진짜 소재가 두 줄로 묶여
  // 면 티셔츠가 "Wool 100% / Cotton 100%" 로 읽혔다. 글만으로는 어느 쪽이 맞는지 모르므로 비운다.
  [ZARA_MENU + " RUSTIC COTTON T-SHIRT $ 25.90 Ecru " + ZARA_TAIL + " Composition: 100% cotton Footer HELP MY ZARA ACCOUNT", ""],
  // 부위 이름이 둘 다 붙어 있으면 멀어도 두 원단이다.
  ["OUTER SHELL: 100% cotton. " + CARE + " LINING: 100% polyester", "Cotton 100%\nPolyester 100%"],
  // 부위 이름이 하나뿐이고 멀면 비운다.
  ["100% wool blend look. " + CARE + " LINING: 100% polyester", ""],
  // Zara 두 겹(실측): 겉감·안감이 같으면 한 줄
  ["OUTER SHELL 82% polyamide 18% elastane LINING 82% polyamide 18% elastane", "Nylon 82% / Elastane 18%"],
  // Zara 두 겹(실측 모양): 겉감·안감이 다르면 두 줄
  ["OUTER SHELL 100% polyester LINING 100% cotton", "Polyester 100%\nCotton 100%"],

  // ── 혼용률이 없는 페이지 ──
  ["A soft everyday tee in a relaxed fit.", ""],
  ["", ""],
];

// 확장(background.js)의 복사본 — 자립형 파일이라 복사가 불가피하다.
// 규칙이 어긋나면 확장 담당 브랜드만 다른 혼용률이 나오므로 여기서 함께 검사한다.
const extSrc = readFileSync(join(ROOT, "chrome-extension/background.js"), "utf8");
const em = (() => {
  const i = extSrc.indexOf("const FIBRES = {");
  const j = extSrc.indexOf("// 브랜드 저장 후", i);
  if (i < 0 || j < 0) { console.error("❌ background.js 의 혼용률 블록을 찾지 못함"); process.exit(1); }
  return extSrc.slice(i, j);
})();
const extComp = new Function(em + "\n return compFromText;")();

// ── compFromHtml: 페이지 HTML 전체에서 뽑기 ──────────────────────────
// 본문 16000자 밖에 있는 소재와, 스크립트(페이지 JSON) 안에만 있는 소재를 잡는다.
const hi = src.indexOf("function compWindow(s) {");
const hj = src.indexOf("const COLOR_JUNK");
if (hi < 0 || hj < 0) { console.error("❌ compFromHtml 블록을 찾지 못함"); process.exit(1); }
const compFromHtml = new Function(
  src.slice(i, j) + src.slice(hi, hj) + "\n return compFromHtml;",
)();

const pad = "<p>" + "메뉴 배너 안내 ".repeat(4000) + "</p>";
const ZARA_NAV = '<nav class="layout-categories"><div class="zds-tabs"><ul class="layout-categories__level-n-category-list">' +
  ZARA_MENU.split(" | ").map((t) => `<li><span class="layout-categories-category-name__label">${t}</span></li>`).join("") + '</ul></div></nav>';
// 2026-11-24 Splendid 상품 페이지(파이어폭스, 실행 45333219085 덤프에서 옮김·줄임). 머리 영역(div#vue-app-header)에
// 개인화 위젯의 배지 틀이 있고, 배지 글자는 CSS 로 감춰져 있지만 페이지 글에는 남는다.
const SPLENDID_BADGE = (id, fib) => `<div class="dy_unit dy_smart_object_${id}"><style>.dy_img_badge_html-${id} span { display: none; }</style>` +
  `<div class="dy_img_badge_html-${id}--container"><div class="dy_img_badge_html-${id} included"><span class="plp">100% ${fib}</span><span class="pdp">100% ${fib}</span></div></div></div>`;
const SPLENDID_HEAD = '<div id="vue-app-header"><div class="sticky"><div class="sticky__inner"><div>Women Kids Best Sellers Sleepwear ' +
  'Shop All Sale Best Sellers The Sleep Shop PJ Sets Robes Slippers &amp; Accessories Sale Sleepwear Your Personal Edit Insider Rewards ' +
  'About About Our Story Splendid Kind Our Fabrics Stores UPF 50+ UPF 50+ ' + SPLENDID_BADGE("3088350", "Cotton") + SPLENDID_BADGE("3884170", "Cashmere") +
  ' Waitlist Waitlist See all results ' + 'BLACK FRIDAY EVENT 40% OFF SITEWIDE | CODE: GIFT * '.repeat(7) + '</div></div></div></div>';
const SPLENDID_PAGE = (title, desc, fabric) => SPLENDID_HEAD + `<main><div id="vue-app"><div class="product-details"><div class="product-info loaded">` +
  `<h1>${title}</h1> $78 Leopard Print Size Chart Find My Size XS S M L XL Add to Bag FREE SHIPPING &amp; RETURNS* Earn 78 points with this purchase. ` +
  `<div class="product-description">Description Fit Fabric Care Shipping &amp; Returns <div class="product-description__tab-content"><div>` +
  `<p>${desc}</p><p>Size Chart</p><p>${fabric}</p><p>Machine wash cold</p><p>Imported</p></div></div></div></div></div></div></main>`;
const HTML_CASES = [
  ["본문에 그대로 있으면 잡는다",
    "<div>Composition: 60% Cotton, 40% Modal</div>", "Cotton 60% / Modal 40%"],

  // compFromText 는 앞 16000자만 본다 — 메뉴가 길면 소재가 그 뒤로 밀린다.
  ["앞 16000자 밖에 있어도 잡는다",
    pad + "<div>Fabric: 95% Cotton, 5% Elastane</div>", "Cotton 95% / Elastane 5%"],

  // 아코디언 내용이 페이지 JSON 에만 담긴 형태(Next.js·Shopify 하이드레이션).
  ["스크립트 안 JSON 에만 있어도 잡는다",
    '<script id="__NEXT_DATA__">{"desc":"\\u003cp\\u003e100% Linen\\u003c/p\\u003e"}</script>',
    "Linen 100%"],
  ["이스케이프된 따옴표·슬래시를 되돌린다",
    '<script>{"body_html":"\\"Shell\\": 70% Wool, 30% Nylon"}</script>', "Wool 70% / Nylon 30%"],

  // 본문에 있으면 스크립트는 보지 않는다 — 추천 상품의 소재를 집으면 안 된다.
  ["본문이 우선, 스크립트는 안 본다",
    '<div>100% Cotton</div><script>{"d":"100% Wool"}</script>', "Cotton 100%"],

  // 스크립트 경로는 여러 상품이 섞이기 쉬워 합이 105%를 넘으면 통째로 버린다.
  ["스크립트에 여러 상품이 섞이면 버린다",
    '<script>{"a":"100% Cotton","b":"100% Wool"}</script>', ""],
  ["스크립트 한 상품의 구성은 남긴다",
    '<script>{"a":"80% Cotton, 20% Polyester"}</script>', "Cotton 80% / Polyester 20%"],

  ["할인 문구는 여전히 무시한다", "<div>Extra 20% OFF everything</div>", ""],

  // ── 2026-11-24 Zara(파이어폭스로 연 실제 페이지, 줄임) ──
  // 숨은 메뉴 <nav class="layout-categories"> 의 "100% WOOL | CASHMERE" 가 섞이면 안 된다.
  ["Zara 면 티셔츠 — 메뉴의 100% WOOL 은 상품 소재가 아니다",
    ZARA_NAV + '<div class="product-detail-view"><h1>RUSTIC COTTON T-SHIRT</h1><p>' + ZARA_TAIL +
    '</p><div class="product-detail-composition"><span>Composition: 100% cotton</span></div></div>', "Cotton 100%"],
  ["Zara 재킷 — 메뉴 + 한 겹(OUTER SHELL)",
    ZARA_NAV + '<div class="product-detail-view"><h1>FITTED ZIP-UP JACKET</h1><p>' + ZARA_TAIL +
    '</p><div class="product-detail-composition"><span class="product-detail-composition__single-part">Composition: 49% modal, 45% polyester, 6% elastane</span></div></div>',
    "Modal 49% / Polyester 45% / Elastane 6%"],
  ["Zara 재킷 — 메뉴 + 겉감·안감 같은 소재",
    ZARA_NAV + '<div class="product-detail-view"><h1>STRETCH ZIP-UP HOODIE JACKET</h1><p>' + ZARA_TAIL +
    '</p><div class="product-detail-composition"><ul><li>OUTER SHELL<ul><li>82% polyamide</li><li>18% elastane</li></ul></li>' +
    '<li>LINING<ul><li>82% polyamide</li><li>18% elastane</li></ul></li></ul></div></div>', "Nylon 82% / Elastane 18%"],
  // 메뉴가 <nav> 가 아니어도(그냥 div) — 창을 "Composition:" 이 붙은 자리에서 열어 메뉴 조각이 안 들어온다.
  ["메뉴가 <nav> 가 아니어도 — 소재 제목이 붙은 자리에서 창을 연다",
    '<div class="menu">' + ZARA_MENU + '</div><div><h1>RUSTIC COTTON T-SHIRT</h1><p>' + ZARA_TAIL + '</p><span>Composition: 100% cotton</span></div>', "Cotton 100%"],
  // 소재 제목도 없고 메뉴 조각과 진짜 소재가 멀리 떨어져 있으면 — 어느 쪽인지 모르므로 비운다.
  ["제목 없는 두 벌이 멀리 떨어져 있으면 비운다",
    '<div class="menu">' + ZARA_MENU + '</div><div><h1>RUSTIC COTTON T-SHIRT</h1><p>' + ZARA_TAIL + '</p><span>100% cotton</span></div>', ""],
  // 메뉴 조각이 진짜 소재보다 4000자 넘게 앞에 있어도 — 제목이 붙은 쪽을 고른다.
  ["메뉴 조각이 4000자 넘게 앞에 있어도 제목 붙은 소재를 고른다",
    '<div class="menu">PARTYWEAR 100% WOOL | CASHMERE ' + "NEW ARRIVALS BEST SELLERS ".repeat(250) + '</div><div><h1>RUSTIC COTTON T-SHIRT</h1><p>' + ZARA_TAIL + '</p><span>Composition: 100% cotton</span></div>', "Cotton 100%"],
  // ── 2026-11-24 Splendid — 머리 영역 배지 틀 "100% Cotton 100% Cotton 100% Cashmere 100% Cashmere" ──
  // 고치기 전: 세 페이지 모두 "Cotton 100%\nCashmere 100%"(저장값 344개 중 233개가 이 값이었다).
  ["Splendid 뱀부 티 — 머리의 배지 목록은 소재가 아니다",
    SPLENDID_PAGE("Leopard Bamboo Blend Long Sleeve Tee", "Upgrade your layering game with our Bamboo Blend Long Sleeve Tee. Fitted crewneck tee Made from bamboo with a hint of spandex Long sleeves Style Number: RF3K542",
      "68% Viscose - From Bamboo, 29% Polyester, 3% Elastane"), "Viscose 68% / Polyester 29% / Elastane 3%"],
  ["Splendid 면 티 — 배지 목록을 빼고 진짜 Cotton 100% 만",
    SPLENDID_PAGE("Louisa Long Sleeve Tee", "A classic long sleeve tee in our softest cotton jersey. Style Number: RF3K501", "100% Cotton"), "Cotton 100%"],
  ["Splendid 리넨 원피스 — 겉감·안감 두 줄은 그대로",
    SPLENDID_PAGE("Stella Linen Midi Dress", "Pleated front details Midi length with side pleats Lightweight linen fabric Style Number: RS6D430",
      "100% Linen Lining: 100% Viscose"), "Linen 100%\nViscose 100%"],
  // 목록이 아닌 두 원단(부위 이름 없이 둘만 붙은 것)은 그대로 둔다 — 셋 이상일 때만 목록으로 본다.
  ["맨몸 '100% 섬유' 둘은 목록으로 보지 않는다", "<div>Composition: 100% Silk 100% Polyester</div>", "Silk 100%\nPolyester 100%"],
  // 같은 섬유가 맨몸으로 바로 되풀이되면 배지 목록이다 — 배지 하나만 그려진 Splendid 페이지(본문 소재는 아직 안 그려짐).
  // 고치기 전: 원피스·레깅스가 "Cashmere 100%" 로 저장됐다(33개). 진짜 소재가 따로 있으면 그것만 읽는다.
  ["Splendid 배지 하나뿐 — 본문 소재가 없으면 비운다",
    SPLENDID_HEAD.replace(SPLENDID_BADGE("3088350", "Cotton"), "") + '<main><h1>Meadow Mini Dress</h1><p>A breezy mini dress.</p></main>', ""],
  ["Splendid 배지 하나 + 본문 소재 — 본문 것만",
    SPLENDID_HEAD.replace(SPLENDID_BADGE("3088350", "Cotton"), "") + '<main><h1>Kit Gauze Button Down Shirt</h1><p>Size Chart 100% Cotton Machine wash cold</p></main>', "Cotton 100%"],
  ["소재가 없는 페이지", "<div>A soft everyday tee.</div>", ""],
  ["빈 입력", "", ""],
];

let bad = 0;
const extCompHtml = new Function(em + "\n return compFromHtml;")();
for (const [label, html, want] of HTML_CASES) {
  const got = asStr(compFromHtml(html));
  if (got !== want) {
    bad++;
    console.error(`❌ worker compFromHtml · ${label}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got)}`);
  }
  const got2 = extCompHtml(html);
  if (got2 !== want) {
    bad++;
    console.error(`❌ 확장 compFromHtml · ${label}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got2)}`);
  }
}

for (const [text, want] of CASES) {
  const got = asStr(compFromText(text));
  if (got !== want) {
    bad++;
    console.error(`❌ worker · ${JSON.stringify(text.slice(0, 60))}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got)}`);
  }
  // 확장 복사본은 문자열을 돌려준다 — 같은 문자열이어야 한다.
  const got2 = extComp(text);
  if (got2 !== want) {
    bad++;
    console.error(`❌ 확장 · ${JSON.stringify(text.slice(0, 60))}\n   기대 ${JSON.stringify(want)}\n   실제 ${JSON.stringify(got2)}`);
  }
}
// ── 회귀 방지: 배열을 그대로 저장하지 않는지 ─────────────────────────
// compFromText/compFromHtml 은 [{material,percent}] 를 돌려준다. 백필이 이걸
// 문자열로 바꾸지 않고 저장하면 엑셀 혼용률 칸에 '[object Object],[object Object]'
// 가 들어간다. 실제로 그렇게 저장돼 있었고, 채움률까지 그만큼 부풀려 보였다.
{
  const enrich = readFileSync(join(ROOT, "scripts/enrich-comp.mjs"), "utf8");
  const lines = enrich.split("\n");
  for (let n = 0; n < lines.length; n++) {
    if (!/\bcomp:/.test(lines[n])) continue;
    // 삼항 연산자로 여러 줄에 걸치므로 뒤 두 줄까지 같은 식으로 본다.
    const stmt = lines.slice(n, n + 3).join(" ");
    if (!/compFromText|compFromHtml|ld\.composition/.test(stmt)) continue;
    if (stmt.includes("asComp(")) continue;
    bad++;
    console.error(`❌ enrich-comp: 배열을 문자열로 바꾸지 않았다 — asComp() 로 감쌀 것\n   ${lines[n].trim()}`);
  }
}

if (bad) { console.error(`\n혼용률 추출 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 혼용률 추출 ${CASES.length}건 통과 (worker·확장 두 구현 일치) · HTML 전체 ${HTML_CASES.length}건 통과`);
