# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-24T02:38Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Aritzia, Massimo Dutti, Lululemon, Mango, &Other Stories, H&M, Zara

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 0/7개** (상품 0/3690개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

전체 평균은 아직입니다 — 혼용률 20% · 컬러웨이 3%.
기준 95% 까지 3384개, 목표 99% 까지 3532개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 3690개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 736 | 20% | +10 |
| 컬러웨이 | 122 | 3% | +9 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 20개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (7) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| H&M | — | 0/743 (0%) | 4/743 (1%) | 혼용률 +0 컬러 +0 | 실패 정보없음 27·직접차단 27·보관본없음 27 |
| Lululemon | — | 1/483 (0%) | 1/483 (0%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 정보없음 20·직접차단 20·보관본없음 14·아카이브거부 1 |
| Massimo Dutti | — | 2/599 (0%) | 1/599 (0%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 정보없음 20·직접차단 20·보관본없음 18·아카이브거부 1 |
| Zara | — | 8/500 (2%) | 7/500 (1%) | 혼용률 +8 컬러 +7 | 성공 아카이브 8 / 실패 정보없음 20·직접차단 20·보관본없음 11·아카이브거부 1 |
| &Other Stories | — | 172/477 (36%) | 108/477 (23%) | 혼용률 +0 컬러 +0 | 실패 정보없음 20·직접차단 20·보관본없음 18 |
| Mango | — | 52/88 (59%) | 0/88 (0%) | 혼용률 +0 컬러 +0 | 성공 아카이브 1 / 실패 정보없음 20·직접차단 20·보관본없음 19 |
| Aritzia | — | 501/800 (63%) | 1/800 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 20·직접차단 20·보관본없음 2·아카이브거부 3 |

## 웹 아카이브 층

조회 126/600개(브랜드당 40) · 요청 154회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| H&M | 27 | 0 | 0 | 27 | 0 | 0 | 0 | 0 | 229s |
| Mango | 20 | 0 | 1 | 19 | 0 | 0 | 0 | 0 | 348s |
| Aritzia | 20 | 0 | 0 | 2 | 3 | 15 | 0 | 0 | 289s |
| Lululemon | 20 | 0 | 1 | 14 | 1 | 4 | 0 | 0 | 344s |
| Massimo Dutti | 20 | 0 | 1 | 18 | 1 | 0 | 0 | 0 | 312s |
| &Other Stories | 20 | 0 | 0 | 18 | 0 | 2 | 0 | 0 | 328s |
| Zara | 20 | 0 | 8 | 11 | 1 | 0 | 0 | 0 | 277s |

사유별 개수: 보관본 없음 109 · 주소: 카테고리 이름 주소 16 · 주소: 카테고리 경로 5 · 보관본에 혼용률 없음 1 · 찾음 11 · 상품 표시 없음 3 · 혼용률 여러 벌(목록) 1 · 보관본도 차단·빈 화면 1

<details><summary>사유별 예시(최대 25개)</summary>

**보관본 없음**

- H&M — https://www2.hm.com/en_us/productpage.1362711003.html
- H&M — https://www2.hm.com/en_us/productpage.1267555063.html
- H&M — https://www2.hm.com/en_us/productpage.1365081001.html
- H&M — https://www2.hm.com/en_us/productpage.1365082001.html
- H&M — https://www2.hm.com/en_us/productpage.1366369003.html
- H&M — https://www2.hm.com/en_us/productpage.1351030001.html
- H&M — https://www2.hm.com/en_us/productpage.1360363001.html
- Massimo Dutti — https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575
- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-round-neck-tshirt-l06830802
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-long-sleeve-polo-shirt-l06204115
- Massimo Dutti — https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
- Massimo Dutti — https://www.massimodutti.com/us/ribbed-short-sleeve-tshirt-l06247810
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918
- &Other Stories — https://www.stories.com/en-us/product/wool-turtleneck-top-black-1341950002/
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/long-sleeve/fitted-high-neck-t-shirt/37035856/70/00
- &Other Stories — https://www.stories.com/en-us/product/rhinestone-trimmed-top-black-1363489001/
- Lululemon — https://shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/32/00
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/ribbed-high-neck-t-shirt/37077792/61/00
- Lululemon — https://shop.lululemon.com/p/going-steady-tee/lwgia9b7pi
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-shirt/37091331/01/00
- &Other Stories — https://www.stories.com/en-us/product/embroidered-wool-polo-jumper-grey-1368465001/
- Mango — https://shop.mango.com/us/en/p/women/tops/knitwear/knit-top-with-brooch-detail/37027782/07/00
- &Other Stories — https://www.stories.com/en-us/product/mock-neck-lace-top-dark-brown-1373644001/
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/short-sleeve/short-sleeve-knitted-t-shirt/37041390/30/00

**주소: 카테고리 이름 주소**

- Aritzia — https://www.aritzia.com/intl/en/clothing/sweatsuit-sets
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets
- Aritzia — https://www.aritzia.com/intl/en/new
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets/wool-coats
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweaters
- &Other Stories — https://www.stories.com/en-us/bags/
- &Other Stories — https://www.stories.com/en-us/shoes/
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweatsuit-sets/sweat-pants
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes/workout-jackets
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes/butter-clothing
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories/cashmere-accessories
- Aritzia — https://www.aritzia.com/intl/en/discover
- Aritzia — https://www.aritzia.com/intl/en/clothing/cashmere-clothing
- Aritzia — https://www.aritzia.com/intl/en/gifts/all-gifts

**주소: 카테고리 경로**

- Aritzia — https://www.aritzia.com/intl/en/shop-by/event-dressing/holiday-party-dressing
- Lululemon — https://shop.lululemon.com/c/women-classic-fit-t-shirts/n153mlzwx7w
- Lululemon — https://shop.lululemon.com/c/women-oversized-fit-t-shirts/n1vc9jzwx7w
- Lululemon — https://shop.lululemon.com/c/women-t-shirts/n1oyr3zwx7wzydf5
- Lululemon — https://shop.lululemon.com/c/women-relaxed-fit-t-shirts/n1o9nlzwx7w

**보관본에 혼용률 없음**

- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-cotton-blend-henley-l06278106

**찾음**

- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-short-sleeve-tshirt-l06207109 — 20261114 · Cotton 100%
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/07/00 — 20260921 · Polyester 65% / Viscose 32% / Elastane 3%
- Lululemon — https://shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8 — 20260719 · Cotton 91% / Elastane 9%
- Zara — https://www.zara.com/us/en/ribbed-tank-top-p03253301.html?v1=585050962 — 20260927 · Cotton 95% / Elastane 5%
- Zara — https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=615161645 — 20261112 · Cotton 100%
- Zara — https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=615792507 — 20260923 · Cotton 100%
- Zara — https://www.zara.com/us/en/supima--mock-neck-t-shirt-p00858772.html?v1=615484360 — 20260917 · Cotton 100%
- Zara — https://www.zara.com/us/en/short-sleeve-interlock-t-shirt-p04174378.html?v1=610629406 — 20261107 · Cotton 100%
- Zara — https://www.zara.com/us/en/ribbed-strappy-top-p04424300.html?v1=545474891 — 20261107 · Cotton 95% / Elastane 5%
- Zara — https://www.zara.com/us/en/mock-neck-t-shirt-p03641857.html?v1=575974478 — 20261107 · Cotton 48% / Modal 47% / Elastane 5%
- Zara — https://www.zara.com/us/en/cotton-wide-sleeve-t-shirt-p04424631.html?v1=606185817 — 20261023 · Cotton 100%

**상품 표시 없음**

- Aritzia — https://www.aritzia.com/intl/en/clothing/polar-fleece — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":0,"prices":48,"carts":0,"sigs":[],"title":"Polarfleece&reg; / Aritzia INTL","types":["BreadcrumbList","ListItem"]}
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets/puffers/thesuperpuff — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":0,"carts":0,"sigs":["wool 100","cotton 100"],"title":"The Super Puff / Puffer Jackets for Women / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList"]}
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories/socks — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":0,"carts":0,"sigs":["wool 100","cotton 100"],"title":"Socks &amp; Tights for Women / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList"]}

**혼용률 여러 벌(목록)**

- Lululemon — https://shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":3,"prices":3,"carts":1,"sigs":["cotton 98/elastane 2","elastane 6","elastane 3"],"title":"The Classic Jersey Tee / Women&#x27;s Short Sleeve Shirts &a","types":["ProductGroup","Brand","AggregateRating","Product","Offer","Organization"]}

**보관본도 차단·빈 화면**

- Zara — https://www.zara.com/us/en/pique-mock-neck-t-shirt-p05067177.html?v1=612600876

</details>

