# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-26T08:14Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Bash, Buck Mason, Carlhartt, Coldwatercreek, Dickies, Everlane, J crew, Mint velvet, Poetry, Spanx, Vanessa bruno, Whitestuff, Wilson

- 설정: 재시도 창 5일(무시 — RETRY_ALL) · 추출 규칙 판 b7b932fd · 한 사이트 요청 간격 1000ms · Worker 우회 끔(측정 — 상품 주소당 요청 3번 이하) · impit 켬
- **429 를 받아 이 실행에서 그만 물은 사이트**: www.everlane.com(https://www.everlane.com/products/womens-city-stripe-draped-jumpsuit-black) · www.dickies.com(https://www.dickies.com/products/dk-eds-essentials-mid-rise-straight-leg-drawstring-pant-dk010-wnps.js) · mintvelvet.com(https://mintvelvet.com/products/black-velvet-butterfly-mini-dress.js) — 그 뒤 상품은 시도 기록 없이 남겼다

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 2/13개** (상품 604/3424개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

Bash · Poetry

전체 평균은 아직입니다 — 혼용률 79% · 컬러웨이 67%.
기준 95% 까지 975개, 목표 99% 까지 1112개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 3424개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 2715 | 79% | +269 |
| 컬러웨이 | 2278 | 67% | +5 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 800개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (13) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| J crew | — | 62/202 (31%) | 202/202 (100%) | 혼용률 +1 컬러 +1 | 성공 페이지 142·impit 142 |
| Coldwatercreek | — | 71/200 (36%) | 113/200 (56%) | 혼용률 +0 컬러 +0 | 성공 페이지 129 / 실패 껍데기 1 |
| Wilson | — | 29/51 (57%) | 38/51 (75%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 10·페이지 21 / 실패 직접차단 2·보관본없음 2 |
| Carlhartt | — | 110/148 (74%) | 77/148 (52%) | 혼용률 +0 컬러 +0 | 성공 페이지 34 / 미표기 1 / 실패 직접차단 2·껍데기 1 |
| Everlane | — | 332/443 (75%) | 247/443 (56%) | 혼용률 +0 컬러 +2 | 성공 쇼피JSON 32·페이지 29 / 실패 직접차단 8·아카이브거부 5 / 429 로 멈춤 82 |
| Mint velvet | — | 322/416 (77%) | 307/416 (74%) | 혼용률 +3 컬러 +2 | 성공 쇼피JSON 46·페이지 40 / 실패 직접차단 8·보관본없음 2 / 429 로 멈춤 59 |
| Dickies | — | 215/264 (81%) | 264/264 (100%) | 혼용률 +67 컬러 +0 | 성공 쇼피JSON 67 / 실패 직접차단 8 / 429 로 멈춤 49 |
| Spanx | — | 99/120 (83%) | 120/120 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 21 |
| Whitestuff | — | 593/665 (89%) | 0/665 (0%) | 혼용률 +136 컬러 +0 | 성공 페이지 366·impit 366 |
| Vanessa bruno | — | 176/193 (91%) | 193/193 (100%) | 혼용률 +2 컬러 +0 | 성공 페이지 19 |
| Buck Mason | — | 111/118 (94%) | 117/118 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 7 |
| Poetry | ✅ | 295/303 (97%) | 299/303 (99%) | 혼용률 +55 컬러 +0 | 성공 페이지 59 / 미표기 4 |
| Bash | ✅ | 300/301 (100%) | 301/301 (100%) | 혼용률 +5 컬러 +0 | 성공 페이지 175 |

## 상품 상세(설명·디테일·사진 전부·컬러 전부) — 이번 실행에서 읽은 브랜드 13개

별도 저장 칸(detail:<site>)에 쌓인다. 상품 수 대비 — 설명 2589 · 디테일 1798 · 사진 2406 · 컬러 전부 820 / 3424

| 브랜드 | 상품 | 설명 | 디테일 | 사진 | 컬러 전부 | 이번 +N | 가드(설명 보류·글머리표 뺌) | 저장 크기 |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| Whitestuff | 665 | 315 | 315 | 315 | 0 | +277 | 0·0 | 203KB |
| Everlane | 443 | 436 | 160 | 439 | 0 | +1 | 0·0 | 455KB |
| Mint velvet | 416 | 307 | 0 | 410 | 0 | +12 | 0·0 | 437KB |
| Poetry | 303 | 303 | 299 | 0 | 0 | +0 | 0·0 | 165KB |
| Bash | 301 | 299 | 299 | 299 | 299 | +169 | 0·168 | 452KB |
| Dickies | 264 | 257 | 206 | 257 | 257 | +36 | 0·0 | 290KB |
| J crew | 202 | 0 | 0 | 0 | 0 | +1 | 0·0 | 26KB |
| Coldwatercreek | 200 | 199 | 199 | 199 | 0 | +120 | 0·0 | 129KB |
| Vanessa bruno | 193 | 131 | 127 | 152 | 0 | +0 | 0·0 | 158KB |
| Carlhartt | 148 | 70 | 71 | 69 | 0 | +6 | 0·0 | 88KB |
| Spanx | 120 | 120 | 0 | 120 | 120 | +0 | 0·0 | 107KB |
| Buck Mason | 118 | 109 | 97 | 109 | 108 | +0 | 0·0 | 114KB |
| Wilson | 51 | 43 | 25 | 37 | 36 | +1 | 0·40 | 121KB |

<details><summary>가드가 뺀 글(브랜드 대부분에 똑같이 붙은 글 — 사이트 공통 문구로 보고 저장하지 않음)</summary>

- Wilson · 글머리표 — product details table · gender women · model number · see all skus
- Bash · 글머리표 — do not bleach

</details>

## 껍데기로 센 페이지 예 (2)

차단 화면은 아닌데 카탈로그 상품명이 화면 글에 없어 '사이트 미표기(none)'로 적지 않은 페이지.

- Promotional Banners for Saving on Best Sellers — https://www.coldwatercreek.com/sale/best-sellers-on-sale
  > Best Sellers On Sale / Customer Favorites on Sale / Coldwater Creek · Best Sellers On Sale / Customer Favorites on Sale / Coldwater Creek 25% Off + FREE SHIPPING Your entire order with code CREEK25 &n
- arrow icon — https://www.carhartt.com/en-eu/force-np
  > Force NP / Carhartt · Force NP / Carhartt Skip to Header Skip to Main Content Skip to Footer Carhartt for Business FREE SHIPPING ON ALL ORDERS OVER €75 &nbsp; &nbsp; &nbsp; &nbsp; Shop All Men Women A

## 혼용률이 엇갈린 상품 (42)

지금 페이지에서 읽은 값이 이미 있던 값과 다르다. 보관본 값이었으면 지금 페이지 값으로 바꿨고(바꿈),
지금 페이지에서 읽었던 값이면 그대로 뒀다(유지).

| 브랜드 | 상품 | 있던 값 | 지금 페이지 | 처리 |
|---|---|---|---|---|
| Whitestuff | https://www.whitestuff.com/p/7267/nelly-embroidered-t-shirt/MID_BLUE | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6242/sophie-collared-organic-cotton-shirt/DARK_NAVY | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6242/sophie-collared-organic-cotton-shirt/BLUE_MLT | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8975/447531-fleur-tie-neck-top/NAVY_MULTI | Cotton 100% | Cotton 100% ‖ Modal 51% / Viscose 49% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8899/447143-wren-embroidered-cord-top/BLK_MLT | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8997/447665-talia-fairisle-jumper/TEAL_MLT | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8941/447660-talia-nep-high-neck-jumper/MID_GREEN | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8456/447310-borg-zip-through/NAVY_MULTI | Polyester 100% ‖ Nylon 100% | Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8606/448002-annie-embroidered-shirt/MID_PINK | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9247/447713-lena-embroidered-shirt/IVORY_MLT | Viscose 97% ‖ Polyester 100% | Viscose 97% / Metallic 3% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9168/447550-leah-jersey-dress/BROWN_PR | Cotton 50% / Lyocell 50% | Cotton 50% / Modal 50% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9047/447047-lucy-embroidered-cord-dress/DUS_PINK | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8604/447892-sloane-dress/DK_GREEN | Viscose 100% ‖ Polyester 100% | Viscose 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8542/447053-easton-swing-dress/BROWN_PR | Viscose 58% / Cotton 42% ‖ Cotton 100% | Viscose 58% / Cotton 42% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8533/447043-dakota-jersey-mix-dress/BROWN_MLT | Cotton 95% / Elastane 5% ‖ Cotton 100% | Cotton 95% / Elastane 5% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8640/447054-sole-jersey-dress/PURE_BLK | Cotton 100% | Cotton 60% / Modal 40% ‖ Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9000/447059-annika-embroidered-cord-dress/DK_RED | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8846/447134-winnie-embroidered-dress/DK_BROWN | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7138/shay-jersey-mix-dress/KHAKI_GRN | Cotton 100% ‖ Cotton 97% / Elastane 3% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7144/margot-legging/PURE_BLK | Cotton 48% / Lyocell 44% / Elastane 8% | Cotton 48% / Modal 44% / Elastane 8% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7144/margot-legging/DARK_NAVY | Cotton 48% / Lyocell 44% / Elastane 8% | Cotton 48% / Modal 44% / Elastane 8% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6900/annie-broderie-collared-jersey-shirt/BRIL_WHITE | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6834/womens-annie-collared-shirt-jersey/WHITE_PR | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8688/446745-lucie-crew-neck-jumper/BRT_RED | Acrylic 47% / Polyester 32% / Cotton 19% | Polyester 51% / Acrylic 22% / Cotton 19% / Wool 7% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8688/446745-lucie-crew-neck-jumper/BLUE_MLT | Acrylic 47% / Polyester 32% / Cotton 19% | Polyester 51% / Acrylic 22% / Cotton 19% / Wool 7% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8974/447457-sienna-sparkle-jumper/NAVY_MULTI | Cotton 50% / Lyocell 27% / Modal 19% / Polyester 4% | Cotton 50% / Modal 27% / Polyester 19% / Metallic 4% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8607/447731-talia-colourblock-jumper/PLUM_MLT | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | Polyester 32% / Cotton 19% / Acrylic 47% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9162/447461-lois-fairisle--cardi/PINK_MLT | Cotton 100% ‖ Cotton 98% / Polyester 1% | Cotton 98% / Polyester 1% / Metallic 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8941/447660-talia-nep-high-neck-jumper/LGT_GREY | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8941/447660-talia-nep-high-neck-jumper/DK_TEAL | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9054/447880-libby-organic-cotton-shirt/DK_PLUM | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8211/447006-libby-organic-cotton-shirt/BRT_PINK | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8606/448002-annie-embroidered-shirt/MID_BLUE | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8606/448002-annie-embroidered-shirt/DK_GREEN | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9016/448556-annie-jersey-shirt/PLUM_MLT | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8282/447014-libby-organic-cotton-shirt/DARK_NAVY | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8534/446863-belle-tweedy-wide-leg-trouser/GREY_MLT | Cotton 97% / Polyester 2% / Elastane 1% | Cotton 97% / Polyester 2% / Elastane 1% ‖ Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8898/447399-tia-cord-wide-leg-trouser/DK_PLUM | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8529/447717-belle-tweedy-wide-leg-trouser/BROWN_MLT | Polyester 66% / Wool 28% / Viscose 5% / Elastane 1% | Polyester 66% / Wool 28% / Viscose 5% / Elastane 1% ‖ Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8898/447399-tia-cord-wide-leg-trouser/NAT_WHITE | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/5526/twister-chino-wide-leg-trouser/DARK_NAVY | Cotton 66% / Linen 18% / Viscose 15% / Elastane 1% | Cotton 67% / Linen 18% / Viscose 14% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9124/447398-tia-cord-wide-leg-trouser/PURE_BLK | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |

## 브랜드별 표본 — 사람이 열어 확인할 것

채운 것: 이번에 읽은 값 · 출처 · 그 값을 페이지 글에서 다시 찾은 자리(추출기와 따로 찾음 — 못 찾으면 비어 있다).
빈 것: 페이지는 읽었는데 혼용률이 없던 상품(사이트 미표기로 적었을 것). 못 읽음: 막힘·껍데기·값 없음.

### Bash — 채움 174 · 빈 것 1 · 못 읽음 0

- ✅ https://ba-sh.com/fr/en/p/top-zaria-dore-3667436071300.html
  - 값: **Viscose 62% / Metallic 38%** (본문)
  - 페이지 글: 화면 글: …viscose in this model is made from wood pulp from sustainably managed forests. Material: 62% VISCOSE / 38% METALLIZED FIBER Made in: China Wash at 30&deg;C Do not bleach Iron at a maximum temperature of 110&deg…
- ✅ https://ba-sh.com/fr/en/p/tank-top-zuani-kaki-3667436078521.html
  - 값: **Viscose 70% / Metallic 30%** (본문)
  - 페이지 글: 화면 글: …viscose in this model is made from wood pulp from sustainably managed forests. Material: 70% VISCOSE / 30% METALLIZED FIBER Made in: China Wash at 30&deg;C Do not bleach Iron at a maximum temperature of 110&deg…
- ✅ https://ba-sh.com/fr/en/p/pants-faimi-blackstone-3667436126895.html
  - 값: **Cotton 92% / Elastomultiester 6% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …is responsible, enhancing every moment of daily life with a touch of character. Material: 92% COTTON / 6% ELASTOMULTIESTER / 2% ELASTANE Made in: Tunisia Wash at 30&deg;C Do not bleach Iron at a maximum tempera…
- ✅ https://ba-sh.com/fr/en/p/jeans-aommie-brut-3667436083914.html
  - 값: **Cotton 92% / Elastomultiester 6% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …the bottom of the leg - Worn blue wash - Vintage whiskering effect - 5 pockets Material: 92% COTTON / 6% ELASTOMULTIESTER / 2% ELASTANE Made in: Turkey Wash at 30&deg;C Do not bleach Iron at a maximum temperat…
- ✅ https://ba-sh.com/fr/fr/p/legging-slalom-noir-3667436131509.html
  - 값: **Wool 85% / Nylon 14% / Elastane 1%** (본문)
  - 페이지 글: 화면 글: …tifiée qui garantit le bien-être animal et la gestion durable des pâturages. Composition: 85% LAINE / 14% POLYAMIDE / 1% ELASTHANNE Fabriqu&eacute; en : Chine Lavage &agrave; la main Ne pas blanchir Ne pas rep…
- ⬜ 빈 것(컬러·가격만) · https://ba-sh.com/fr/en/p/trousers-sita-terre-3667436073335.html

### Buck Mason — 채움 0 · 빈 것 7 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/natural-sea-breeze-linen-coastline-cami
- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/white-big-tuxedo-shirt
- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/dusty-maize-draped-twill-cpo-shirt

### Carlhartt — 채움 0 · 빈 것 35 · 못 읽음 3

- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt
- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107745/womens-waffle-knit-loose-ls-t-shirt
- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt
- ⛔ 막힘(fetch,impit) · https://www.carhartt.com/c/insulated-boots
- ⛔ 막힘(fetch,impit) · https://www.carhartt.com/c/base-layer
- ⛔ 막힘·껍데기 · https://www.carhartt.com/en-eu/force-np

### Coldwatercreek — 채움 1 · 빈 것 128 · 못 읽음 1

- ✅ https://www.coldwatercreek.com/leaf-embroidered-tee/20985/
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …etites 24”; Women’s 27&quot; Crewneck Hits mid hip Relaxed fit Long sleeves Fabric & Care 100% cotton Machine wash Imported Share Share on Facebook Share on Pinterest Share on Email Print page Close modal &#215;…
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/wintertide-waffle-tee/22279/
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/snowflake-tapestry-burnout-tee/26140/
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/follow-your-heart-tunic/22475/
- ⛔ 막힘·껍데기 · https://www.coldwatercreek.com/sale/best-sellers-on-sale

### Dickies — 채움 67 · 빈 것 0 · 못 읽음 0

- ✅ https://www.dickies.com/products/dk-balance-v-neck-top-dk875-roy
  - 값: **Polyester 77% / Viscose 20% / Elastane 3%** (Shopify JSON)
  - 페이지 글: 화면 글: …gives a flattering look. Center back length: 26" Features V-Neck Top Fabric Composition: 77%Poly 20%Rayon 3%Spandex Fabric description: 2-Way Stretch Pockets: 5 Pockets Fit: Contemporary Sleeves: Short Slee…
- ✅ https://www.dickies.com/products/dk-balance-notched-v-neck-top-dk671-nav
  - 값: **Polyester 77% / Viscose 20% / Elastane 3%** (Shopify JSON)
  - 페이지 글: 화면 글: …ete this style. Center back length: 25 ½" Features Notched V-Neck Top Fabric Composition: 77%Poly 20%Rayon 3%Spandex Fabric description: 2-Way Stretch Pockets: 2 Pockets Fit: Contemporary Sleeves: Short Slee…
- ✅ https://www.dickies.com/products/dk-forge-womens-jumpsuit-dk525-blkn
  - 값: **Cotton 55% / Polyester 34% / Nylon 8% / Elastane 3%** (Shopify JSON)
  - 페이지 글: 화면 글: …le-needle stitching for lasting durability. Features Women's Jumpsuit Fabric Composition: 55%CTN 34%POLY 8%NYLON 3%SPAN Fabric description: 2-Way Stretch Closure: Drawstring Waist Pockets: 5 Pockets Fit: Mo…
- ✅ https://www.dickies.com/products/dk-eds-essentials-mock-wrap-top-dk625-baps
  - 값: **Polyester 95% / Elastane 5%** (Shopify JSON)
  - 페이지 글: 화면 글: …will tape at the neck. Center back length: 26" Features Mock Wrap Top Fabric Composition: 95%Poly 5%Spandex Fabric description: 4-way stretch Pockets: 2 pockets Fit: Contemporary…
- ✅ https://www.dickies.com/products/dk-eds-essentials-mock-wrap-top-dk625-cips
  - 값: **Polyester 95% / Elastane 5%** (Shopify JSON)
  - 페이지 글: 화면 글: …will tape at the neck. Center back length: 26" Features Mock Wrap Top Fabric Composition: 95%Poly 5%Spandex Fabric description: 4-way stretch Pockets: 2 pockets Fit: Contemporary…

### Everlane — 채움 0 · 빈 것 29 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-100-my-body-box-cut-tee-white
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-full-zip-hoodie-in-wool-cashmere-oatmeal
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-funnel-sweater-wool-cashmere-oatmeal

### J crew — 채움 2 · 빈 것 140 · 못 읽음 0

- ✅ https://www.jcrew.com/shop/family-pajamas
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …Price: $75 Sale Price: $37.50 (50% Off) View Pointelle tee and flannel pajama pant set in 100% cotton details QUICK SHOP Pointelle tee and flannel pajama pant set in 100% cotton Original Price: $118 Sale Price:…
- ✅ https://www.jcrew.com/p/womens/categories/clothing/shirts-and-tops/CX476
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 페이지 JSON: …om/s7-img-facade/CX476_DN0173_d3"],"description":"This slim-fit denim button-up is cut in 100% cotton with a hidden front placket and subtle darting that flatters through the waist for a streamlined look by J.Cr…
- ⬜ 빈 것(컬러·가격만) · https://www.jcrew.com/m/womens/categories/clothing/matching-sets/MQ341
- ⬜ 빈 것(컬러·가격만) · https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334
- ⬜ 빈 것(컬러·가격만) · https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ426

### Mint velvet — 채움 3 · 빈 것 37 · 못 읽음 0

- ✅ https://mintvelvet.com/products/black-metallic-knit-peplum-top
  - 값: **Metallic 6% / Nylon 53% / Viscose 41%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 6% metallised fibre, 53% polyamide, 41% viscose " ,"text_alignment": "left" ,"override_color_options": false ,"text_colour": "rgb…
- ✅ https://mintvelvet.com/products/black-metallic-sleeveless-top
  - 값: **Metallic 21% / Nylon 12% / Viscose 67%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 21% metallised fibre, 12% polyamide, 67% viscose " ,"text_alignment": "left" ,"override_color_options": false ,"text_colour": "rgb…
- ✅ https://mintvelvet.com/products/ivory-schiffley-blouse
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 100% polyester,trim, 100% polyamide,main 2, 100% polyester,embroidery, 100% cotton " ,"text_alignment": "left" ,"override_co…
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/black-knit-sheer-sleeve-zip-detail-top
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/cream-draped-asymmetric-top
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/black-draped-asymmetric-top-1

### Poetry — 채움 55 · 빈 것 8 · 못 읽음 0

- ✅ https://www.poetryfashion.co.uk/shirts-and-tunics/lyocell-cotton-wool-frill-blouse-ocean-blue/RW14.A.html
  - 값: **Lyocell 41% / Cotton 40% / Wool 19%** (본문)
  - 페이지 글: 화면 글: …frill detail. Full-length sleeves gather into the cuffs and the hemline is gently curved. 41% TENCEL™ lyocell 40% cotton 19% wool Design details Machine wash Drapey lyocell, cotton and wool fabric in our exclus…
- ✅ https://www.poetryfashion.co.uk/shirts-and-tunics/lyocell-cotton-wool-gingham-blouse-maroon-cherry/RT71.B.html
  - 값: **Lyocell 41% / Cotton 40% / Wool 19%** (본문)
  - 페이지 글: 화면 글: …sh wtih a pleated cuff. The smooth placket is fastened with pairs of neat corozo buttons. 41% TENCEL™ lyocell 40% cotton 19% wool Design details Machine wash Drapey lyocell, cotton and wool blend gingham check…
- ✅ https://www.poetryfashion.co.uk/shirts-and-tunics/lyocell-cotton-wool-gingham-blouse-midnight-coral/RT71.A.html
  - 값: **Lyocell 41% / Cotton 40% / Wool 19%** (본문)
  - 페이지 글: 화면 글: …sh wtih a pleated cuff. The smooth placket is fastened with pairs of neat corozo buttons. 41% TENCEL™ lyocell 40% cotton 19% wool Design details Machine wash Drapey lyocell, cotton and wool blend gingham check…
- ✅ https://www.poetryfashion.co.uk/shirts-and-tunics/lyocell-cotton-wool-check-blouse-midnight-coral/RF37.E.html
  - 값: **Lyocell 41% / Cotton 40% / Wool 19%** (본문)
  - 페이지 글: 화면 글: …a shorter, boxy shape with full-length sleeves and gentle gathers at the yoke and cuffs. 41% TENCEL™ lyocell 40% cotton 19% wool Design details Machine wash Drapey lyocell, cotton and wool blend gingham check…
- ✅ https://www.poetryfashion.co.uk/shirts-and-tunics/lyocell-cotton-wool-check-blouse-maroon-cherry/RF37.G.html
  - 값: **Lyocell 41% / Cotton 40% / Wool 19%** (본문)
  - 페이지 글: 화면 글: …a shorter, boxy shape with full-length sleeves and gentle gathers at the yoke and cuffs. 41% TENCEL™ lyocell 40% cotton 19% wool Design details Machine wash Drapey lyocell, cotton and wool blend gingham check…
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poeds/dresses-and-skirts
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poest/shirts-and-tunics
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poetj/trousers

### Spanx — 채움 0 · 빈 것 21 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://spanx.com/products/spanx-ponte-jacquard-tailored-vest?v=48685653852371&bau-context=standard&Color=Timeless+Navy+Gingham
- ⬜ 빈 것(컬러·가격만) · https://spanx.com/products/spanx-boostup-cropped-square-neck-shelf-tank?v=48685694746835&bau-context=standard&Color=Vino+Polka+Dot
- ⬜ 빈 것(컬러·가격만) · https://spanx.com/products/spanx-bodyline-high-neck-cropped-tank-with-flexform-cups?v=48685376143571&bau-context=standard&Color=Anthracite

### Vanessa bruno — 채움 2 · 빈 것 17 · 못 읽음 0

- ✅ https://www.vanessabruno.com/p/haldo-embroidered-blouse-54343.html
  - 값: **Viscose 100%** (본문)
  - 페이지 글: 화면 글: …sers. Wear the collar open for a more relaxed look. Ref : 6HVA32-V09929-003 Composition : 100% viscose. Secondary fabric 100% cotton. Embroidery 100% polyester Origin: India Features: • Embroidered viscose blouse…
- ✅ https://www.vanessabruno.com/p/hora-blouse-53937.html
  - 값: **Cotton 100% ‖ Cotton 62% / Polyester 38%** (본문)
  - 페이지 글: 화면 글: …ankle boots, or a plain long skirt at the weekend. Ref : 6HVA27-V09920-048 Composition : 100% cotton / tertiary fabric 62% cotton, 38% polyester / embroidery 100% polyester / lace 62% cotton, 38% polyester Orig…
- ⬜ 빈 것(컬러·가격만) · https://www.vanessabruno.com/cabas-tote-bags.html
- ⬜ 빈 것(컬러·가격만) · https://www.vanessabruno.com/new-in/new-bags-cabas-tote.html
- ⬜ 빈 것(컬러·가격만) · https://www.vanessabruno.com/bags/daily-tote.html

### Whitestuff — 채움 352 · 빈 것 14 · 못 읽음 0

- ✅ https://www.whitestuff.com/p/7379/nelly-cotton-notch-neck-t-shirt/TEAL_PR
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …and comes with a notch-neck detail. Because, you know. It’s top notch. Product ID: 446179 100% Cotton Model wears a size 10 and is 5'9&quot;/175cm Size 12 high shoulder neck point to hem approx. 62CM Notch Neck…
- ✅ https://www.whitestuff.com/p/1303/nelly-notch-neck-tee/NAT_WHITE
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …It&rsquo;s top notch. Shop all Nelly Tees Style with these Accessories Product ID: 438430 100% Cotton Size 12 high shoulder neck point to hem approx. 62CM Notch Neck Short Sleeve Regular fit Machine Washable DEL…
- ✅ https://www.whitestuff.com/p/1303/nelly-notch-neck-tee/DARK_NAVY
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …It&rsquo;s top notch. Shop all Nelly Tees Style with these Accessories Product ID: 438430 100% Cotton Size 12 high shoulder neck point to hem approx. 62CM Notch Neck Short Sleeve Regular fit Machine Washable DEL…
- ✅ https://www.whitestuff.com/p/6974/nelly-notch-texture-tee/LGT_YELLOW
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …elect size Find in store DETAILS Notch your average tee. No, really. This one’s made with 100% cotton and comes with a notch-neck detail. And slight texture in the fabric. Product ID: 445788 100% Cotton Model we…
- ✅ https://www.whitestuff.com/p/6974/nelly-notch-texture-tee/MID_BLUE
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …elect size Find in store DETAILS Notch your average tee. No, really. This one’s made with 100% cotton and comes with a notch-neck detail. And slight texture in the fabric. Product ID: 445788 100% Cotton Model we…
- ⬜ 빈 것(컬러·가격만) · https://www.whitestuff.com/p/7119/nelly-notch-neck-short-sleeve-t-shirt/MID_PINK
- ⬜ 빈 것(컬러·가격만) · https://www.whitestuff.com/p/8444/446604-izzy-striped-collar-jumper/NAT_MLT
- ⬜ 빈 것(컬러·가격만) · https://www.whitestuff.com/p/8422/447103-ronley-shirt/GREEN_PR

### Wilson — 채움 0 · 빈 것 21 · 못 읽음 2

- ⬜ 빈 것(컬러·가격만) · https://www.wilson.com/en-us/collections/deals-baseball
- ⬜ 빈 것(컬러·가격만) · https://www.wilson.com/en-us/collections/deals-fastpitch
- ⬜ 빈 것(컬러·가격만) · https://www.wilson.com/en-us/collections/deals-golf
- ⛔ 막힘(fetch,impit) · https://custom.wilson.com/en-us/custom/footballs
- ⛔ 막힘(fetch,impit) · https://custom.wilson.com/en-us/custom/basketballs

## 웹 아카이브 층

조회 9/600개(브랜드당 40) · 요청 14회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Whitestuff | 366 | 352 | 0 | 0 | 0 | 0 | 0 | 0 | 731s |
| Bash | 175 | 174 | 0 | 0 | 0 | 0 | 0 | 0 | 175s |
| J crew | 142 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 285s |
| Coldwatercreek | 130 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 130s |
| Dickies | 116 | 67 | 0 | 0 | 0 | 0 | 0 | 8 | 75s |
| Everlane | 111 | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 101s |
| Mint velvet | 99 | 3 | 0 | 2 | 0 | 0 | 0 | 0 | 94s |
| Poetry | 63 | 55 | 0 | 0 | 0 | 0 | 0 | 0 | 63s |
| Carlhartt | 38 | 0 | 0 | 0 | 0 | 2 | 0 | 1 | 41s |
| Wilson | 23 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 37s |
| Spanx | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 63s |
| Vanessa bruno | 19 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 12s |
| Buck Mason | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 21s |

사유별 개수: 주소: 카테고리 경로 2 · 보관본에 혼용률 없음 5 · 보관본 없음 4

<details><summary>사유별 예시(최대 25개)</summary>

**주소: 카테고리 경로**

- Carlhartt — https://www.carhartt.com/c/insulated-boots
- Carlhartt — https://www.carhartt.com/c/base-layer

**보관본에 혼용률 없음**

- Everlane — https://www.everlane.com/products/womens-eyelet-smock-dress-white
- Everlane — https://www.everlane.com/products/womens-japanese-goweave-slip-dress-long-black
- Everlane — https://www.everlane.com/products/womens-linen-picnic-jumpsuit-washed-black
- Everlane — https://www.everlane.com/products/womens-hammered-satin-slip-dress-black
- Everlane — https://www.everlane.com/products/womens-cotton-merino-turtleneck-dress-heather-charcoal

**보관본 없음**

- Mint velvet — https://mintvelvet.com/products/black-velvet-butterfly-mini-dress
- Mint velvet — https://mintvelvet.com/products/animal-print-knit-2-in-1-dress
- Wilson — https://custom.wilson.com/en-us/custom/footballs
- Wilson — https://custom.wilson.com/en-us/custom/basketballs

</details>

