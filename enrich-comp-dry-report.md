# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-24T04:22Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Loft, Patagonia

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 0/2개** (상품 0/841개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

전체 평균은 아직입니다 — 혼용률 37% · 컬러웨이 41%.
기준 95% 까지 492개, 목표 99% 까지 526개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 841개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 307 | 37% | +8 |
| 컬러웨이 | 342 | 41% | +8 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 40개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (2) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| Patagonia | — | 2/168 (1%) | 1/168 (1%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 정보없음 30·보관본없음 5·아카이브거부 24 |
| Loft | — | 305/673 (45%) | 341/673 (51%) | 혼용률 +7 컬러 +7 | 성공 페이지 5·아카이브 2 / 미표기 1 / 실패 정보없음 35·보관본없음 28·아카이브거부 4 |

## 웹 아카이브 층

조회 64/600개(브랜드당 40) · 요청 95회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Loft | 40 | 5 | 2 | 28 | 4 | 0 | 0 | 0 | 321s |
| Patagonia | 30 | 0 | 1 | 5 | 24 | 0 | 0 | 0 | 377s |

사유별 개수: 보관본 없음 33 · 상품 여러 개(JSON-LD) 22 · 상품 표시 없음 4 · 혼용률 여러 벌(목록) 1 · 보관본에 혼용률 없음 1 · 찾음 3

<details><summary>사유별 예시(최대 25개)</summary>

**보관본 없음**

- Patagonia — https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html
- Patagonia — https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html
- Loft — https://www.loft.com/clothing/tops/catl000011/heathered-ribbed-turtleneck-top/711652.html
- Loft — https://www.loft.com/clothing/tops/catl000011/metallic-button-henley-top/711815.html
- Loft — https://www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-modern-tee/711761.html
- Loft — https://www.loft.com/clothing/tops/catl000011/striped-metallic-button-henley-top/711634.html
- Loft — https://www.loft.com/clothing/tops/catl000011/striped-long-sleeve-modern-tee/711775.html
- Loft — https://www.loft.com/clothing/tops/catl000011/lace-trim-v-neck-perfect-ribbed-elbow-sleeve-tee/775012.html
- Loft — https://www.loft.com/clothing/tops/catl000011/modern-wedge-tee/767613.html
- Loft — https://www.loft.com/clothing/tops/catl000011/heathered-modern-wedge-tee/769573.html
- Loft — https://www.loft.com/clothing/tops/catl000011/everyday-crew-tee/580214.html
- Patagonia — https://www.patagonia.com/product/womens-natures-pace-oversized-t-shirt/37903.html
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-hut-tripper-easy-cut-t-shirt/37906.html
- Loft — https://www.loft.com/clothing/tops/catl000011/bandana-print-everyday-crew-tee/787471.html
- Loft — https://www.loft.com/clothing/tops/catl000011/lotus-flower-everyday-v-neck-tee/784743.html
- Loft — https://www.loft.com/clothing/tops/catl000011/harbor-tank-top/586150.html
- Loft — https://www.loft.com/clothing/tops/catl000011/perfect-tank/586193.html
- Loft — https://www.loft.com/clothing/tops/catl000011/perfect-ribbed-apron-neck-tank-top/751426.html
- Loft — https://www.loft.com/clothing/tops/catl000011/perfect-ribbed-scoop-neck-tank-top/760847.html
- Loft — https://www.loft.com/clothing/tops/catl000011/long-sleeve-everyday-tee/759965.html
- Loft — https://www.loft.com/clothing/tops/catl000011/long-sleeve-everyday-tee/750665.html
- Loft — https://www.loft.com/clothing/tops/catl000011/side-button-tank-top/761044.html
- Loft — https://www.loft.com/clothing/tops/catl000011/cutout-jersey-modern-tee/774214.html
- Loft — https://www.loft.com/clothing/tops/catl000011/mesh-trim-perfect-ribbed-tank-top/769311.html
- Loft — https://www.loft.com/clothing/tops/catl000011/lobster-lunch-everyday-crew-tee/769665.html

**상품 여러 개(JSON-LD)**

- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-trail-shirt/24493.html — {"rootProducts":4,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["lyocell 15/polyester 85"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Trail Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html — {"rootProducts":3,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 35"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Merino Blend S","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-merino-blend-shirt/44580.html — {"rootProducts":4,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 35"],"title":"Patagonia Women's Capilene® Cool Merino Blend Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-daily-shirt-fitz-roy-nimbus/45486.html — {"rootProducts":6,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Capilene® Cool Daily Shirt - Fitz Roy Nimb","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-daily-shirt/45226.html — {"rootProducts":7,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Capilene® Cool Daily Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-trail-shirt/24503.html — {"rootProducts":4,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["lyocell 15/polyester 85"],"title":"Patagonia Women's Capilene® Cool Trail Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-sun-shirt/44795.html — {"rootProducts":5,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Sun Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-daily-shirt-boardshort-logo/45465.html — {"rootProducts":3,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Daily Shirt - ","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-95-oval-logo-oversized-t-shirt/37870.html — {"rootProducts":5,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["cotton 100"],"title":"Patagonia Women's '95 Oval Logo Oversized T-Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-ultra-shirt/44720.html — {"rootProducts":5,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Capilene® Cool Ultra Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-sun-shirt-peak-visions/44935.html — {"rootProducts":3,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Sun Shirt - Pe","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-work-pocket-tee/53415.html — {"rootProducts":4,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":2,"prices":4,"carts":2,"sigs":["cotton 45","cotton 45/hemp 55"],"title":"Patagonia Women's Work Pocket Tee","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-trail-harbor-tee/42060.html — {"rootProducts":6,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["cotton 45/hemp 55"],"title":"Patagonia Women's Trail Harbor Tee","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-water-people-banner-easy-cut-t-shirt/37861.html — {"rootProducts":4,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["cotton 100"],"title":"Patagonia Women's Long-Sleeved Water People Banner Easy-Cut ","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-p-6-logo-responsibili-tee/37603.html — {"rootProducts":4,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":4,"carts":2,"sigs":[],"title":"Patagonia Women's Long-Sleeved P-6 Logo Responsibili-Tee®","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-daily-shirt-boardshort-logo/45489.html — {"rootProducts":4,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Capilene® Cool Daily Shirt - Boardshort Lo","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-great-waves-ringer-tee/37864.html — {"rootProducts":4,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["cotton 100"],"title":"Patagonia Women's Great Waves Ringer Tee","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-trail-shirt-stratapeaks/23716.html — {"rootProducts":4,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["lyocell 15/polyester 85"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Trail Shirt - ","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-daily-shirt-fitz-roy-trout/45459.html — {"rootProducts":4,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Daily Shirt - ","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-daily-shirt-fitz-roy-nimbus/45462.html — {"rootProducts":5,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Long-Sleeved Capilene® Cool Daily Shirt - ","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-work-pocket-t-shirt/53335.html — {"rootProducts":7,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":3,"prices":4,"carts":2,"sigs":["cotton 45","cotton 45/hemp 55","cotton 42/elastane 5/hemp 53"],"title":"Patagonia Women's Long-Sleeved Work Pocket T-Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-trail-shirt-stratapeaks/23726.html — {"rootProducts":4,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["lyocell 15/polyester 85"],"title":"Patagonia Women's Capilene® Cool Trail Shirt - Stratapeaks","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}

**상품 표시 없음**

- Patagonia — https://www.patagonia.com/product/womens-hut-tripper-skyline-oversized-t-shirt/37902.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":0,"carts":0,"sigs":[],"title":"Patagonia Outdoor Clothing & Gear","types":[]}
- Loft — https://www.loft.com/gifts/shop-all-gifts/cat3860003/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":805,"carts":0,"sigs":[],"title":"LOFT 2025 Holiday Gift Guide / LOFT","types":["Organization","ContactPoint","BreadcrumbList","ListItem","WebSite","SearchAction"]}
- Loft — https://www.loft.com/new-arrivals/all-new-arrivals/catl00009/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":777,"carts":0,"sigs":[],"title":"Women&rsquo;s Summer New Arrivals / LOFT","types":["Organization","ContactPoint","BreadcrumbList","ListItem","WebSite","SearchAction"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-daily-shirt/45186.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":0,"prices":0,"carts":0,"sigs":[],"title":"Hang Tight! Routing to checkout...","types":[]}

**혼용률 여러 벌(목록)**

- Loft — https://www.loft.com/clothing/sweaters/catl000012/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":4,"prices":815,"carts":0,"sigs":["cashmere 100","cashmere 100/cotton 100","cotton 100/linen 100","linen 100"],"title":"Women&rsquo;s Sweaters / LOFT","types":["Organization","ContactPoint","BreadcrumbList","ListItem","WebSite","SearchAction"]}

**보관본에 혼용률 없음**

- Loft — https://www.loft.com/clothing/tops/catl000011/oversized-jersey-modern-tee/771190.html

**찾음**

- Loft — https://www.loft.com/clothing/tops/catl000011/long-sleeve-crew-neck-tee/593639.html — 20260413 · Modal 94% / Elastane 6%
- Loft — https://www.loft.com/clothing/tops/catl000011/striped-side-button-tank-top/781756.html — 20250624 · Cotton 100%
- Patagonia — https://www.patagonia.com/product/womens-desert-glow-oversized-t-shirt/37868.html — 20260421 · Cotton 100%

</details>

