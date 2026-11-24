# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-24T02:25Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Addidas, Anthropologie, Aritzia, Arket, Chico's, Fatface, FP Movement, Free People, Joules, Massimo Dutti, Lululemon, Mango, &Other Stories, Reformation, H&M, Zara

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 0/16개** (상품 0/7684개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

전체 평균은 아직입니다 — 혼용률 16% · 컬러웨이 9%.
기준 95% 까지 6619개, 목표 99% 까지 6927개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 7684개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 1265 | 16% | +74 |
| 컬러웨이 | 681 | 9% | +69 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 40개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (16) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| H&M | — | 0/743 (0%) | 4/743 (1%) | 혼용률 +0 컬러 +0 | 실패 정보없음 38·직접차단 38·보관본없음 36·아카이브거부 2 |
| Joules | — | 1/566 (0%) | 1/566 (0%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 정보없음 30·직접차단 30·보관본없음 22·아카이브거부 5 |
| Addidas | — | 1/537 (0%) | 1/537 (0%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 정보없음 30·직접차단 33·오류 3·보관본없음 15·아카이브거부 3 |
| Lululemon | — | 1/483 (0%) | 1/483 (0%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 정보없음 30·직접차단 30·보관본없음 24·아카이브거부 1 |
| Massimo Dutti | — | 3/599 (1%) | 2/599 (0%) | 혼용률 +2 컬러 +2 | 성공 아카이브 2 / 실패 정보없음 30·직접차단 30·보관본없음 27·아카이브거부 1 |
| Fatface | — | 4/456 (1%) | 4/456 (1%) | 혼용률 +4 컬러 +4 | 성공 아카이브 4 / 실패 정보없음 30·직접차단 30·보관본없음 26 |
| Chico's | — | 9/800 (1%) | 8/800 (1%) | 혼용률 +9 컬러 +8 | 성공 아카이브 9 / 실패 정보없음 30·직접차단 30·보관본없음 20·아카이브오류 1 |
| Zara | — | 9/500 (2%) | 8/500 (2%) | 혼용률 +9 컬러 +8 | 성공 아카이브 9 / 실패 정보없음 30·직접차단 30·보관본없음 13·아카이브거부 1·아카이브오류 7 |
| Anthropologie | — | 5/259 (2%) | 5/259 (2%) | 혼용률 +5 컬러 +5 | 성공 아카이브 5 / 실패 정보없음 32·직접차단 32·보관본없음 26·아카이브거부 1 |
| Free People | — | 15/192 (8%) | 12/192 (6%) | 혼용률 +15 컬러 +12 | 성공 아카이브 15 / 실패 정보없음 30·직접차단 30·보관본없음 15 |
| FP Movement | — | 20/72 (28%) | 13/72 (18%) | 혼용률 +13 컬러 +13 | 성공 아카이브 15 / 실패 정보없음 40·직접차단 39·보관본없음 20·아카이브거부 2 |
| &Other Stories | — | 173/477 (36%) | 110/477 (23%) | 혼용률 +1 컬러 +2 | 성공 아카이브 2 / 실패 정보없음 40·직접차단 40·보관본없음 32·아카이브거부 4 |
| Reformation | — | 294/730 (40%) | 333/730 (46%) | 혼용률 +10 컬러 +10 | 성공 아카이브 10 / 실패 정보없음 39·직접차단 40·오류 1·보관본없음 14·아카이브거부 4·아카이브오류 8 |
| Arket | — | 177/382 (46%) | 178/382 (47%) | 혼용률 +3 컬러 +2 | 성공 아카이브 3 / 실패 정보없음 40·직접차단 40·보관본없음 37 |
| Mango | — | 52/88 (59%) | 0/88 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 40·직접차단 40·보관본없음 39·아카이브거부 1 |
| Aritzia | — | 501/800 (63%) | 1/800 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 40·직접차단 40·보관본없음 14·아카이브거부 5 |

## 웹 아카이브 층

조회 503/600개(브랜드당 40) · 요청 680회 · 429 0 · 5xx 0 · 네트워크 오류 33 · 쿼리 포함 주소로만 찾은 것 0 · **이 실행 도중 층을 껐다: 연속 실패 4회(마지막: fetch failed)**

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Arket | 40 | 0 | 3 | 37 | 0 | 0 | 0 | 0 | 1235s |
| Aritzia | 40 | 0 | 0 | 14 | 5 | 21 | 0 | 0 | 539s |
| FP Movement | 40 | 0 | 15 | 20 | 2 | 2 | 0 | 0 | 1549s |
| &Other Stories | 40 | 0 | 2 | 32 | 4 | 2 | 0 | 0 | 1075s |
| Mango | 40 | 0 | 0 | 39 | 1 | 0 | 0 | 0 | 861s |
| Reformation | 40 | 0 | 10 | 14 | 4 | 0 | 8 | 0 | 1355s |
| H&M | 38 | 0 | 0 | 36 | 2 | 0 | 0 | 0 | 684s |
| Addidas | 33 | 0 | 1 | 15 | 3 | 14 | 0 | 0 | 965s |
| Anthropologie | 32 | 0 | 5 | 26 | 1 | 0 | 0 | 0 | 1036s |
| Chico's | 30 | 0 | 9 | 20 | 0 | 0 | 1 | 0 | 1923s |
| Fatface | 30 | 0 | 4 | 26 | 0 | 0 | 0 | 0 | 1335s |
| Free People | 30 | 0 | 15 | 15 | 0 | 0 | 0 | 0 | 1415s |
| Joules | 30 | 0 | 1 | 22 | 5 | 2 | 0 | 0 | 1096s |
| Massimo Dutti | 30 | 0 | 2 | 27 | 1 | 0 | 0 | 0 | 907s |
| Lululemon | 30 | 0 | 1 | 24 | 1 | 4 | 0 | 0 | 595s |
| Zara | 30 | 0 | 9 | 13 | 1 | 0 | 7 | 0 | 1065s |

사유별 개수: 보관본 없음 380 · 주소: 카테고리 이름 주소 40 · 주소: 카테고리 경로 5 · 상품 표시 없음 14 · 보관본에 혼용률 없음 6 · 찾음 77 · 혼용률 여러 벌(목록) 7 · 목록 페이지(JSON-LD) 3 · 아카이브 오류 16

<details><summary>사유별 예시(최대 25개)</summary>

**보관본 없음**

- Addidas — https://www.adidas.com/us/ultimate365-solid-knit-skort/KC4506.html
- Addidas — https://www.adidas.com/us/tennis-climacool-lace-dress-pro/KS7080.html
- Addidas — https://www.adidas.com/us/adidas-x-farm-rio-dress/KR0258.html
- Anthropologie — https://www.anthropologie.com/shop/bronx-banco-embellished-long-sleeve-maxi-dress
- Anthropologie — https://www.anthropologie.com/shop/celiab-starlit-sequined-fringe-mini-dress
- H&M — https://www2.hm.com/en_us/productpage.1359542001.html
- H&M — https://www2.hm.com/en_us/productpage.1350040002.html
- H&M — https://www2.hm.com/en_us/productpage.1350040003.html
- H&M — https://www2.hm.com/en_us/productpage.1322984005.html
- H&M — https://www2.hm.com/en_us/productpage.1352154004.html
- H&M — https://www2.hm.com/en_us/productpage.1350040001.html
- H&M — https://www2.hm.com/en_us/productpage.1363380001.html
- H&M — https://www2.hm.com/en_us/productpage.1359542002.html
- Anthropologie — https://www.anthropologie.com/shop/lyrebird-heirloom-lace-trim-cami-in-silky
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-fuzzy-dolman-sleeve-boatneck-top
- Arket — https://www.arket.com/en-ww/product/wool-rib-top-black-1357865001/
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-evan-cotton-modal-long-sleeve-tee
- Anthropologie — https://www.anthropologie.com/shop/maeve-betty-v-neck-baby-muscle-tee
- Anthropologie — https://www.anthropologie.com/shop/pilcro-twofer-long-sleeve-tee
- Arket — https://www.arket.com/en-ww/product/cashmere-hoodie-grey-1352706002/
- Arket — https://www.arket.com/en-ww/product/long-sleeved-merino-top-grey-0630664068/
- Arket — https://www.arket.com/en-ww/product/striped-long-sleeved-t-shirt-red-1366898001/
- Arket — https://www.arket.com/en-ww/product/heavy-silk-blend-tank-top-black-1370751001/
- Arket — https://www.arket.com/en-ww/product/babylock-jersey-top-black-1356934002/
- Arket — https://www.arket.com/en-ww/product/long-sleeved-merino-top-off-white-0630664071/

**주소: 카테고리 이름 주소**

- Aritzia — https://www.aritzia.com/intl/en/clothing/sweatsuit-sets
- Aritzia — https://www.aritzia.com/intl/en/new
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets/wool-coats
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweaters
- Addidas — https://www.adidas.com/us/women
- Addidas — https://www.adidas.com/us/women-black_friday
- Addidas — https://www.adidas.com/us/black_friday
- Addidas — https://www.adidas.com/us/men-trending
- Addidas — https://www.adidas.com/us/men-black_friday
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweatsuit-sets/sweat-pants
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes/butter-clothing
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes/workout-jackets
- Addidas — https://www.adidas.com/us/trending
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories/cashmere-accessories
- Aritzia — https://www.aritzia.com/intl/en/discover
- Aritzia — https://www.aritzia.com/intl/en/gifts/all-gifts
- Aritzia — https://www.aritzia.com/intl/en/clothing/cashmere-clothing
- Aritzia — https://www.aritzia.com/intl/en/sale
- Aritzia — https://www.aritzia.com/intl/en/sale/sale-sweaters
- Aritzia — https://www.aritzia.com/intl/en/sale/sale-dresses
- Addidas — https://www.adidas.com/us/kids-trending
- Aritzia — https://www.aritzia.com/intl/en/clothing/tops/going-out-tops

**주소: 카테고리 경로**

- Aritzia — https://www.aritzia.com/intl/en/shop-by/event-dressing/holiday-party-dressing
- Lululemon — https://shop.lululemon.com/c/women-t-shirts/n1oyr3zwx7wzydf5
- Lululemon — https://shop.lululemon.com/c/women-relaxed-fit-t-shirts/n1o9nlzwx7w
- Lululemon — https://shop.lululemon.com/c/women-oversized-fit-t-shirts/n1vc9jzwx7w
- Lululemon — https://shop.lululemon.com/c/women-classic-fit-t-shirts/n153mlzwx7w

**상품 표시 없음**

- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets/puffers/thesuperpuff — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":0,"carts":0,"sigs":["merino wool 100","cotton 100"],"title":"The Super Puff / Puffer Jackets for Women / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList"]}
- Aritzia — https://www.aritzia.com/intl/en/clothing/polar-fleece — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":0,"prices":48,"carts":0,"sigs":[],"title":"Polarfleece&reg; / Aritzia INTL","types":["BreadcrumbList","ListItem"]}
- Aritzia — https://www.aritzia.com/intl/en/clothing/tops/bodysuits — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":41,"carts":0,"sigs":[],"title":"Bodysuits for Women / Shop Long Sleeve, Tank &amp; Thong / A","types":["BreadcrumbList","ListItem"]}
- Addidas — https://www.adidas.com/us/winter — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":78,"carts":0,"sigs":[],"title":"Winter Clothes &amp; Shoes / adidas US","types":[]}
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories/socks — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":0,"carts":0,"sigs":["merino wool 100","cotton 100"],"title":"Socks &amp; Tights for Women / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList"]}
- Addidas — https://www.adidas.com/us/women-long_sleeve_shirts — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":141,"carts":0,"sigs":[],"title":"adidas Women&#x27;s Long Sleeve Shirts / adidas US","types":[]}
- Addidas — https://www.adidas.com/us/women-polo — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":94,"carts":0,"sigs":[],"title":"Women&#x27;s Polos / adidas US","types":[]}
- Joules — https://www.joules.com/shop/womens/clothing/tops/f/pattern-stripe — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":24,"carts":0,"sigs":[],"title":"Women's Striped Tops & T-Shirts / Ladies' Breton Tops / Joul","types":["BreadcrumbList","ListItem"]}
- Joules — https://www.joules.com/shop/womens/clothing/knitwear/f/sleeve-sleeveless — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":20,"carts":0,"sigs":[],"title":"Knitted Vests For Women / Sweater Vests & Knitted Tank Tops","types":["BreadcrumbList","ListItem"]}
- Joules — https://www.joules.com/shop/womens/clothing/tops/f/benefit-multipack — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":24,"carts":0,"sigs":["cotton 100"],"title":"Buy Women's Tops Online / Joules UK","types":["BreadcrumbList","ListItem"]}
- Joules — https://www.joules.com/shop/womens/clothing/tops/f/colour-red — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":36,"carts":0,"sigs":[],"title":"Red & Burgundy Tops For Women / Joules","types":["BreadcrumbList","ListItem"]}
- Joules — https://www.joules.com/shop/womens/clothing/tops/f/colour-brown — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":26,"carts":0,"sigs":[],"title":"Womens Brown Tops / Brown Mesh Tops / Joules","types":["BreadcrumbList","ListItem"]}
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/07/00 — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":2,"carts":0,"sigs":["elastane 3/polyester 65/viscose 32"],"title":"Long-sleeved boat-neck t-shirt - Women / MANGO USA","types":[]}
- H&M — https://www2.hm.com/en_us/women/shop-by-product/tops/bralette.html — {"rootProducts":0,"listProducts":2,"itemList":2,"og":false,"h1":1,"blocks":0,"prices":2,"carts":0,"sigs":[],"title":"Bralette Tops / Bralette Crop, Tank &amp; Lace Tops / H&amp;","types":["BreadcrumbList","ListItem","ItemList","Product","AggregateOffer"]}

**보관본에 혼용률 없음**

- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-arena-wool-blend-fitted-turtleneck-top
- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-cotton-blend-henley-l06278106
- Reformation — https://www.thereformation.com/products/aylani-knit-top/1319748BLK.html?dwvar_1319748BLK_color=BLK
- Reformation — https://www.thereformation.com/products/indigo-knit-top/1321141GOL.html?dwvar_1321141GOL_color=GOL
- Reformation — https://www.thereformation.com/products/milaya-top/1321127GSS.html?dwvar_1321127GSS_color=GSS
- Reformation — https://www.thereformation.com/products/milaya-top/1321127GAM.html?dwvar_1321127GAM_color=GAM

**찾음**

- Chico's — https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997 — 20260515 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-foil-mock-neck-layering-tee/570375536?inseam=regular&sizeType=regular&color=7130&catId=cat11199293&collectionId=category&parentId=196534644558 — 20260716 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-layering-tee/570395349?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=196535885707 — 20260913 · Viscose 95% / Elastane 5%
- Anthropologie — https://www.anthropologie.com/shop/pilcro-quinn-drapey-v-neck-tee — 20261023 · Cotton 50% / Modal 50%
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-evan-raw-edge-baby-tee — 20261113 · Cotton 47% / Modal 47% / Elastane 6%
- Addidas — https://www.adidas.com/us/adi365-running-climacool-iconic-t-shirt/KS3242.html — 20260812 · Polyester 100%
- Arket — https://www.arket.com/en-ww/product/draped-satin-top-light-beige-1333034001/ — 20260418 · Acetate 100%
- Anthropologie — https://www.anthropologie.com/shop/lyrebird-heirloom-lace-asymmetrical-camisole — 20260528 · Nylon 100%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-layering-tee/570420604?inseam=regular&sizeType=regular&color=4569&catId=cat11199293&collectionId=category&parentId=199761495863 — 20261017 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/petal-print-touch-of-cool-layering-tee/570418124?inseam=regular&sizeType=regular&color=787&catId=cat11199293&collectionId=category&parentId=199761354740 — 20260913 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/the-touch-of-cool-leopard-elbow-sleeve-layering-tee/570374475?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=196534590176 — 20260717 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-square-neck-tee/570349716?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=196533215674 — 20260720 · Viscose 95% / Elastane 5%
- Anthropologie — https://www.anthropologie.com/shop/maeve-boat-neck-tank — 20260715 · Cotton 96% / Elastane 4%
- Anthropologie — https://www.anthropologie.com/shop/pilcro-square-neck-long-sleeve-top — 20261017 · Cotton 58% / Modal 37% / Elastane 5%
- Arket — https://www.arket.com/en-ww/product/lace-trim-cotton-strap-top-black-1348892002/ — 20260616 · Cotton 100% / Cotton 75% / Polyamide 25%
- Arket — https://www.arket.com/en-ww/product/drawstring-top-black-1331609001/ — 20260422 · Acetate 100%
- FP Movement — https://www.freepeople.com/fpmovement/shop/go-to-smooth-square-neck-cami/ — 20261102 · Modal 70% / Nylon 21% / Elastane 9%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-v-neck-layering-tee/570395354?inseam=regular&sizeType=regular&color=7174&catId=cat11199293&collectionId=category&parentId=196535885493 — 20261016 · Viscose 95% / Elastane 5%
- FP Movement — https://www.freepeople.com/fpmovement/shop/my-time-tee/ — 20260918 · Cotton 60% / Polyester 40%
- FP Movement — https://www.freepeople.com/fpmovement/shop/tackle-tee/ — 20261113 · Cotton 100%
- FP Movement — https://www.freepeople.com/fpmovement/shop/happiness-runs-crop-tank/ — 20260626 · Nylon 92% / Elastane 8%
- Free People — https://www.freepeople.com/shop/we-the-free-easy-does-it-long-sleeve-tee/ — 20261108 · Cotton 95% / Elastane 5%
- Free People — https://www.freepeople.com/shop/we-the-free-brick-lane-jacquard-maxi-shirt-jacket/ — 20261019 · Cotton 100%
- Fatface — https://www.fatface.com/style/su642249/f62945 — 20260202 · Cotton 100%
- Free People — https://www.freepeople.com/shop/we-the-free-surplus-cuff-top/ — 20261117 · Cotton 95% / Elastane 5%

**혼용률 여러 벌(목록)**

- Aritzia — https://www.aritzia.com/intl/en/product/pacino-vest/113937.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":3,"prices":0,"carts":1,"sigs":["polyester 100","merino wool 100","cotton 100"],"title":"Pacino Vest / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList"]}
- Lululemon — https://shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":3,"prices":3,"carts":1,"sigs":["elastane 2/pima 98","elastane 6","elastane 3"],"title":"The Classic Jersey Tee / Women&#x27;s Short Sleeve Shirts &a","types":["ProductGroup","Brand","AggregateRating","Product","Offer","Organization"]}
- Zara — https://www.zara.com/us/en/supima--mock-neck-t-shirt-p00858772.html?v1=615484360 — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":3,"prices":2,"carts":0,"sigs":["supima 100","cotton 100","cotton 100/supima 100"],"title":"SUPIMA® STAND-UP COLLAR T-SHIRT - White / ZARA United States","types":["ProductGroup","Brand","PropertyValue","Product","Offer"]}
- &Other Stories — https://www.stories.com/en-us/product/wool-blend-knitted-t-shirt-dark-grey-melange-1319342004/ — {"rootProducts":1,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":10,"prices":50,"carts":0,"sigs":["cotton 44/wool 56","cotton 100/organic cotton 100/wool 100","cotton 100/merino wool 100","cotton 100/merino wool 100/wool 100"],"title":"Rib-Knit T-shirt - Dark Grey Melange - &amp; Other Stories U","types":["Product","Brand","Thing","Offer","Organization","BreadcrumbList"]}
- &Other Stories — https://www.stories.com/en-us/product/wool-blend-knitted-t-shirt-white-1319342002/ — {"rootProducts":1,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":10,"prices":50,"carts":0,"sigs":["cotton 43/wool 57","cotton 100/organic cotton 100/wool 100","cotton 100/merino wool 100/wool 100","merino wool 100"],"title":"Rib-Knit T-shirt - White - Sweaters - &amp; Other Stories US","types":["Product","Brand","Thing","Offer","Organization","BreadcrumbList"]}
- &Other Stories — https://www.stories.com/en-us/product/oversized-cotton-t-shirt-white-1329849004/ — {"rootProducts":1,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":7,"prices":50,"carts":0,"sigs":["cotton 100/organic cotton 100","organic cotton 100","organic cotton 100/silk 100","cotton 100/merino wool 100/organic cotton 100/silk 100"],"title":"Oversized Cotton T-Shirt - White - &amp; Other Stories US","types":["Product","Brand","Thing","Offer","Organization","BreadcrumbList"]}
- &Other Stories — https://www.stories.com/en-us/product/ribbed-t-shirt-white-1303999009/ — {"rootProducts":1,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":5,"prices":95,"carts":0,"sigs":["cotton 95/spandex 5","organic cotton 100","cotton 100","merino wool 100/organic cotton 100"],"title":"Ribbed T-Shirt - White - T-shirts - &amp; Other Stories US","types":["Product","Brand","Thing","Offer","Organization","BreadcrumbList"]}

**목록 페이지(JSON-LD)**

- FP Movement — https://www.freepeople.com/fpmovement/top-rated-activewear-tops/ — {"rootProducts":0,"listProducts":66,"itemList":66,"og":true,"h1":1,"blocks":1,"prices":66,"carts":0,"sigs":["cotton 100"],"title":"Top Rated Activewear Tops / FP Movement","types":["Corporation","ContactPoint","SiteNavigationElement","WebPageElement","BreadcrumbList","ListItem"]}
- FP Movement — https://www.freepeople.com/fpmovement/mvmt-logo-curation/ — {"rootProducts":0,"listProducts":72,"itemList":72,"og":true,"h1":1,"blocks":0,"prices":72,"carts":0,"sigs":[],"title":"Logo Activewear / FP Movement","types":["Corporation","ContactPoint","SiteNavigationElement","WebPageElement","BreadcrumbList","ListItem"]}
- H&M — https://www2.hm.com/en_us/women/shop-by-product/tops/long-sleeve.html — {"rootProducts":0,"listProducts":36,"itemList":36,"og":false,"h1":1,"blocks":0,"prices":37,"carts":0,"sigs":[],"title":"Women&#x27;s Long Sleeve Tops / Long Sleeve Crop Tops / H&am","types":["BreadcrumbList","ListItem","ItemList","Product","AggregateOffer"]}

**아카이브 오류**

- Chico's — https://www.chicos.com/store/product/sequin-bowtie-applique-tee/570420611?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761498123 — fetch failed
- Reformation — https://www.thereformation.com/products/zimmi-top/1321133BDJ.html?dwvar_1321133BDJ_color=BDJ — fetch failed
- Reformation — https://www.thereformation.com/products/isola-silk-top/1320641LTU.html?dwvar_1320641LTU_color=LTU — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Reformation — https://www.thereformation.com/products/linden-knit-top/1321277PVT.html?dwvar_1321277PVT_color=PVT — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Reformation — https://www.thereformation.com/products/thatcher-top/1320742SAQ.html?dwvar_1320742SAQ_color=SAQ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Reformation — https://www.thereformation.com/products/eugenie-top/1318840YUS.html?dwvar_1318840YUS_color=YUS — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Zara — https://www.zara.com/us/en/henley-t-shirt-p04424632.html?v1=561441193 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Zara — https://www.zara.com/us/en/distressed-embroidered-pocket-t-shirt-p00858746.html?v1=583452689 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Zara — https://www.zara.com/us/en/double-layer-t-shirt-p00858734.html?v1=592204190 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Zara — https://www.zara.com/us/en/ribbed-v-neck-t-shirt-p01044638.html?v1=600958760 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Zara — https://www.zara.com/us/en/boat-neck-t-shirt-p01058805.html?v1=547344101 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Zara — https://www.zara.com/us/en/pique-mock-neck-t-shirt-p05067177.html?v1=612600876 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Zara — https://www.zara.com/us/en/wide-sleeve-striped-t-shirt-p04424629.html?v1=548172239 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Reformation — https://www.thereformation.com/products/veya-silk-top/1319462BSN.html?dwvar_1319462BSN_color=BSN — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Reformation — https://www.thereformation.com/products/leora-knit-top/1321256FDL.html?dwvar_1321256FDL_color=FDL — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Reformation — https://www.thereformation.com/products/santino-knit-top/1319488CRM.html?dwvar_1319488CRM_color=CRM — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)

</details>

