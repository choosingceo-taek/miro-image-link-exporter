# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-26T09:00Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Athleta, Banana Republic, Chico's, Sessun, Gap, Garnet hill, Massimo Dutti, Old Navy, Reformation, The upside, WHBM, Zara · 못 찾은 이름: oldnavy, athleta, bananarepublic

- 설정: 재시도 창 5일(무시 — RETRY_ALL) · 추출 규칙 판 b7b932fd · 한 사이트 요청 간격 1000ms · Worker 우회 끔(측정 — 상품 주소당 요청 3번 이하) · impit 켬

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 1/12개** (상품 684/5833개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

Old Navy

전체 평균은 아직입니다 — 혼용률 46% · 컬러웨이 41%.
기준 95% 까지 3136개, 목표 99% 까지 3369개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 5833개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 2656 | 46% | +191 |
| 컬러웨이 | 2406 | 41% | +90 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 800개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (12) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| Massimo Dutti | — | 6/606 (1%) | 5/606 (1%) | 혼용률 +2 컬러 +2 | 성공 아카이브 2 / 실패 직접차단 60·보관본없음 36·아카이브거부 2 |
| Garnet hill | — | 2/108 (2%) | 0/108 (0%) | 혼용률 +0 컬러 +0 | 실패 직접차단 30·보관본없음 1·아카이브거부 21 |
| Reformation | — | 66/800 (8%) | 66/800 (8%) | 혼용률 +33 컬러 +33 | 성공 아카이브 33 / 실패 직접차단 107·보관본없음 4·아카이브거부 3 |
| Chico's | — | 69/800 (9%) | 69/800 (9%) | 혼용률 +24 컬러 +25 | 성공 페이지 19·impit 19·아카이브 6 / 실패 직접차단 745·보관본없음 34 |
| Zara | — | 113/499 (23%) | 111/499 (22%) | 혼용률 +5 컬러 +5 | 성공 아카이브 5 / 실패 직접차단 497·보관본없음 29·아카이브거부 5·아카이브오류 1 |
| WHBM | — | 100/219 (46%) | 101/219 (46%) | 혼용률 +25 컬러 +25 | 성공 페이지 17·impit 17·아카이브 8 / 실패 직접차단 202·보관본없음 29·아카이브거부 3 |
| Athleta | — | 277/407 (68%) | 380/407 (93%) | 혼용률 +0 컬러 +0 | 성공 페이지 130 |
| Gap | — | 333/481 (69%) | 480/481 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 147 / 실패 직접차단 1 |
| Banana Republic | — | 368/510 (72%) | 510/510 (100%) | 혼용률 +6 컬러 +0 | 성공 페이지 148 |
| Sessun | — | 242/290 (83%) | 0/290 (0%) | 혼용률 +2 컬러 +0 | 성공 페이지 3 / 실패 직접차단 47·보관본없음 17 |
| The upside | — | 401/429 (93%) | 0/429 (0%) | 혼용률 +79 컬러 +0 | 성공 페이지 390·impit 397·아카이브 6 / 미표기 2 / 실패 직접차단 32·껍데기 5·보관본없음 20·아카이브거부 5 |
| Old Navy | ✅ | 679/684 (99%) | 684/684 (100%) | 혼용률 +15 컬러 +0 | 성공 페이지 20 |

## 상품 상세(설명·디테일·사진 전부·컬러 전부) — 이번 실행에서 읽은 브랜드 11개

별도 저장 칸(detail:<site>)에 쌓인다. 상품 수 대비 — 설명 2696 · 디테일 1256 · 사진 2669 · 컬러 전부 2120 / 5725

| 브랜드 | 상품 | 설명 | 디테일 | 사진 | 컬러 전부 | 이번 +N | 가드(설명 보류·글머리표 뺌) | 저장 크기 |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| Reformation | 800 | 0 | 0 | 0 | 0 | +0 | 0·0 | 7KB |
| Chico's | 800 | 49 | 0 | 49 | 49 | +19 | 0·0 | 47KB |
| Old Navy | 684 | 684 | 61 | 684 | 684 | +19 | 0·0 | 872KB |
| Massimo Dutti | 606 | 0 | 0 | 0 | 0 | +0 | 0·0 | 0KB |
| Banana Republic | 510 | 510 | 230 | 510 | 510 | +6 | 0·0 | 605KB |
| Zara | 499 | 0 | 0 | 0 | 0 | +0 | 0·0 | 1KB |
| Gap | 481 | 480 | 389 | 480 | 480 | +0 | 0·0 | 687KB |
| The upside | 429 | 306 | 0 | 306 | 0 | +391 | 0·0 | 538KB |
| Athleta | 407 | 407 | 333 | 380 | 380 | +1 | 0·0 | 340KB |
| Sessun | 290 | 243 | 243 | 243 | 0 | +0 | 0·0 | 155KB |
| WHBM | 219 | 17 | 0 | 17 | 17 | +17 | 0·0 | 18KB |

## 껍데기로 센 페이지 예 (5)

차단 화면은 아닌데 카탈로그 상품명이 화면 글에 없어 '사이트 미표기(none)'로 적지 않은 페이지.

- “CCT_PLP_2026 — https://www.theupside.com/the-cambodian-childrens-trust/
  > The Cambodian Children&#x27;s Trust · The Cambodian Children&#x27;s Trust Loading... Product Name 25% off at checkout United States &nbsp;&nbsp;&nbsp; $ USD Australia International United Kingdom New 
- Header Submenu Image — https://www.theupside.com/active/all-in-one/dresses/
  > Dresses / THE UPSIDE · Dresses / THE UPSIDE Loading... Product Name 25% off at checkout United States &nbsp;&nbsp;&nbsp; $ USD Australia International United Kingdom New Shop Featured E-Gift Card Best
- Header Submenu Image — https://www.theupside.com/collections/discover/alvorada/
  > ALVORADA / THE UPSIDE · ALVORADA / THE UPSIDE Loading... Product Name 25% off at checkout United States &nbsp;&nbsp;&nbsp; $ USD Australia International United Kingdom New Shop Featured E-Gift Card Be
- Header Submenu Image — https://www.theupside.com/edits/the-vacation-edit/
  > THE VACATION EDIT / THE UPSIDE · THE VACATION EDIT / THE UPSIDE Loading... Product Name 25% off at checkout United States &nbsp;&nbsp;&nbsp; $ USD Australia International United Kingdom New Shop Featu
- Meet Eddie Nelson, the Founder of Bred Breathwork — https://www.theupside.com/journal/
  > Journal · Journal Loading... Product Name 25% off at checkout United States &nbsp;&nbsp;&nbsp; $ USD Australia International United Kingdom New Shop Featured E-Gift Card Best Sellers Always Tops All T

## 혼용률이 엇갈린 상품 (21)

지금 페이지에서 읽은 값이 이미 있던 값과 다르다. 보관본 값이었으면 지금 페이지 값으로 바꿨고(바꿈),
지금 페이지에서 읽었던 값이면 그대로 뒀다(유지).

| 브랜드 | 상품 | 있던 값 | 지금 페이지 | 처리 |
|---|---|---|---|---|
| The upside | https://www.theupside.com/mindful-movement/ | Polyester 100% | Cotton 100% ‖ Polyester 100% | 유지 |
| The upside | https://www.theupside.com/arlo-pointelle-long-sleeve-top-butter-usw426091/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/bangalow-scoop-tank-top-washed-sage-usw026061/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/bangalow-scoop-tank-top-white-usw026061/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/bangalow-scoop-tank-top-volcano-usw026061/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/abby-v-neck-tank-top-olive-usw326161/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/abby-v-neck-tank-top-navy-usw326161/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/javan-jones-quarter-zip-sweat-leopard-usw326059/ | Cotton 98% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/del-rey-pointelle-tank-top-chocolate-usw326044/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/zahra-rib-tee-cream-usw226113/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/del-rey-pointelle-tank-top-cream-usw226098/ | Cotton 95% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/aliki-ballet-bra-gingham-usw425113/ | Polyester 46% / Nylon 41% / Elastane 10% | Polyester 46% / Nylon 41% / Elastane 10% / Metallic 3% | 유지 |
| The upside | https://www.theupside.com/freddie-fleece-lined-anorak-black-usw026046/ | Polyester 92% / Elastane 8% | Polyester 92% / Elastane 8% ‖ Polyester 100% | 유지 |
| The upside | https://www.theupside.com/amara-amayah-knit-shirt-lilac-usw226019/ | Cotton 97% / Polyester 1% | Cotton 99% / Polyester 1% | 유지 |
| The upside | https://www.theupside.com/aliki-kiva-bodysuit-gingham-usw425163/ | Polyester 46% / Nylon 41% / Elastane 10% | Polyester 46% / Nylon 41% / Elastane 10% / Metallic 3% | 유지 |
| The upside | https://www.theupside.com/galaxia-marnie-wide-leg-pant-starry-usw326006/ | Linen 100% | Metallic 55% / Polyester 45% | 유지 |
| The upside | https://www.theupside.com/javan-darcy-short-leopard-usw326061/ | Cotton 98% | Cotton 100% | 유지 |
| The upside | https://www.theupside.com/joie-jetset-straight-leg-pant-denim-usw125109/ | Cotton 97% / Polyester 1% | Cotton 99% / Polyester 1% ‖ Cotton 97% / Polyester 2% | 유지 |
| The upside | https://www.theupside.com/peached-2-5in-spin-short-black-usw024025/ | Nylon 25% / Elastane 75% | Nylon 75% / Elastane 25% | 유지 |
| The upside | https://www.theupside.com/peached-2-5in-spin-short-white-usw024025/ | Nylon 25% / Elastane 75% | Nylon 75% / Elastane 25% | 유지 |
| The upside | https://www.theupside.com/amara-roller-knit-short-lilac-usw226020/ | Cotton 97% / Polyester 1% | Cotton 99% / Polyester 1% | 유지 |

## 브랜드별 표본 — 사람이 열어 확인할 것

채운 것: 이번에 읽은 값 · 출처 · 그 값을 페이지 글에서 다시 찾은 자리(추출기와 따로 찾음 — 못 찾으면 비어 있다).
빈 것: 페이지는 읽었는데 혼용률이 없던 상품(사이트 미표기로 적었을 것). 못 읽음: 막힘·껍데기·값 없음.

### Athleta — 채움 0 · 빈 것 130 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=845688002
- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=659287752
- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=659287002

### Banana Republic — 채움 6 · 빈 것 142 · 못 읽음 0

- ✅ https://bananarepublic.gap.com/browse/product.do?pid=539384002
  - 값: **Wool 98% / Elastane 2%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["98% Responsible Wool Standard wool, 2% elastane.","Dry clean only.","This product is made with 98% Responsible Wool Standard certi…
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=1183118002
  - 값: **Polyester 53% / Wool 43% / Elastane 4%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["53% recycled polyester, 43% Responsible Wool Standard (RWS) wool, 4% elastane.","Dry clean.","This product contains 43% RWS-certifie…
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=539384082
  - 값: **Wool 98% / Elastane 2%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["98% Responsible Wool Standard wool, 2% elastane.","Dry clean only.","This product is made with 98% Responsible Wool Standard certi…
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=539384072
  - 값: **Wool 98% / Elastane 2%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["98% Responsible Wool Standard wool, 2% elastane.","Dry clean only.","This product is made with 98% Responsible Wool Standard certi…
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=539384062
  - 값: **Wool 98% / Elastane 2%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["98% Responsible Wool Standard wool, 2% elastane.","Dry clean only.","This product is made with 98% Responsible Wool Standard certi…
- ⬜ 빈 것(컬러·가격만) · https://bananarepublic.gap.com/browse/product.do?pid=1203518002
- ⬜ 빈 것(컬러·가격만) · https://bananarepublic.gap.com/browse/product.do?pid=1183816012
- ⬜ 빈 것(컬러·가격만) · https://bananarepublic.gap.com/browse/product.do?pid=1180190002

### Chico's — 채움 24 · 빈 것 1 · 못 읽음 739

- ✅ https://www.chicos.com/store/product/cotton-stretch-3-4-sleeve-tee/570403265?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=196536333443
  - 값: **Cotton 95% / Elastane 5%** (보관본 20260804)
  - 페이지 글: 화면 글: …kline. Made from cotton-stretch fabric. Classic-fit, 3/4 sleeve, v-neck tee. Length: 25". 95% Cotton, 5% Spandex. Machine washable. Imported. Shipping & Returns SHARE Reviews and Fit Have a question? Ask and an…
- ✅ https://www.chicos.com/store/product/satin-pleated-cuff-mockneck-top/570420883?inseam=regular&sizeType=regular&color=1673&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761514595
  - 값: **Polyester 96% / Elastane 4%** (본문)
  - 페이지 글: 페이지 JSON: …ve. Classic-fit, long-sleeved mockneck blouse. Zipper back for ease of wear. Length: 26". 96% Polyester, 4% Spandex. Machine washable. Imported. ","color":"SOFT IVORY","sku":"199761514649","brand":{"@type":"Organi…
- ✅ https://www.chicos.com/store/product/sequin-striped-batwing-top/570420876?inseam=regular&sizeType=regular&color=001&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761514243
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …wy look and feel. V-neck,bracelet sleeves with small band cuffed sleeves. Length: 26.75". 100% Polyester. Machine washable. Imported. ","color":"BLACK","sku":"199761514298","brand":{"@type":"Organization","name":"C…
- ✅ https://www.chicos.com/store/product/zenergy-french-terry-printed-half-zip-pullover/570418739?inseam=regular&sizeType=regular&color=001&catId=cat20059281&collectionId=category&parentId=199761374496
  - 값: **Cotton 57% / Modal 38% / Elastane 5%** (본문)
  - 페이지 글: 페이지 JSON: …nch Terry fabrication. Classic-fit mockneck long-sleeved half-zip pullover. French Terry: 57% Cotton, 38% Modal, 5% Spandex. Ribbed Cuffs: 38% Modal, 4% Spandex, 58% Cotton. Length: on body 26". Machine washabl…
- ✅ https://www.chicos.com/store/product/zenergy-luxe-printed-sequin-pullover/570419551?inseam=regular&sizeType=regular&color=001&catId=cat20059281&collectionId=category&parentId=199761511617
  - 값: **Nylon 63% / Polyester 13% / Viscose 23% / Cashmere 1%** (본문)
  - 페이지 글: 페이지 JSON: …sic-fit long-sleeved sweater with cowl neckline. Front Length: 25.5", Back Length: 26.5". 63% Nylon, 13% Polyester, 23% Rayon, 1% Cashmere. Machine washable. Imported. ","color":"BLACK","sku":"199761511679","b…
- ⬜ 빈 것(컬러·가격만) · https://www.chicos.com/store/product/zenergy-long-quilted-vest/570420008?inseam=regular&sizeType=regular&color=7175&catId=cat20059281&collectionId=category&parentId=199761512331
- ⛔ 막힘(fetch,impit) · https://www.chicos.com/store/product/touch-of-cool-cheetah-v-neck-layering-tee/570418143?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761355020
- ⛔ 막힘(fetch,impit) · https://www.chicos.com/store/product/shimmer-mockneck-layering-tee/570422708?inseam=regular&sizeType=regular&color=6844&catId=cat11199293&collectionId=category&parentId=199761617951
- ⛔ 막힘(fetch,impit) · https://www.chicos.com/store/product/touch-of-cool-striped-layering-tee/570414533?inseam=regular&sizeType=regular&color=4636&catId=cat11199293&collectionId=category&parentId=199761185825

### Gap — 채움 0 · 빈 것 147 · 못 읽음 1

- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=1180261062
- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=1180261142
- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=523562322
- ⛔ 막힘(fetch,impit) · https://www.gap.com/browse/new/gap-hoodie-shop

### Garnet hill — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘(fetch,impit) · https://www.garnethill.com/holiday-gifts/shops/cashmere-gifts/
- ⛔ 막힘(fetch,impit) · https://www.garnethill.com/holiday-gifts/shops/gifts-under-100/
- ⛔ 막힘(fetch,impit) · https://www.garnethill.com/holiday-gifts/shops/gifts-for-her/

### Massimo Dutti — 채움 2 · 빈 것 0 · 못 읽음 58

- ✅ https://www.massimodutti.com/us/flowing-vneck-tshirt-l06831935
  - 값: **Cotton 100%** (보관본 20260518)
  - 페이지 글: 화면 글: …ng V-neck T-shirt Colour Brown Add to basket Colour Brown / Ref. 6831/935 T-shirt made of 100% cotton fabric that’s soft, flowing and slightly shimmery. T-shirt made of cotton. V-neck. V-neck . Short sleeves. Re…
- ✅ https://www.massimodutti.com/us/100-mercerised-cotton-short-sleeve-tshirt-l06201543
  - 값: **Cotton 100%** (보관본 20260523)
  - 페이지 글: 화면 글: …100% mercerised cotton short sleeve T-shirt · White, Bright Red, Black · T-shirt / Massimo Dutti WOMEN MEN MASSIMO DUTTI WORLD SEARC…
- ⛔ 막힘(fetch,impit) · https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
- ⛔ 막힘(fetch,impit) · https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575
- ⛔ 막힘(fetch,impit) · https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918

### Old Navy — 채움 15 · 빈 것 5 · 못 읽음 0

- ✅ https://oldnavy.gap.com/browse/product.do?pid=903179002
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["100% recycled polyester","jersey pocket lining: 60% cotton, 40% polyester","machine wash according to the care instruction label","im…
- ✅ https://oldnavy.gap.com/browse/product.do?pid=903179022
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["100% recycled polyester","jersey pocket lining: 60% cotton, 40% polyester","machine wash according to the care instruction label","im…
- ✅ https://oldnavy.gap.com/browse/product.do?pid=903179032
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["100% recycled polyester","jersey pocket lining: 60% cotton, 40% polyester","machine wash according to the care instruction label","im…
- ✅ https://oldnavy.gap.com/browse/product.do?pid=903179042
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["100% recycled polyester","jersey pocket lining: 60% cotton, 40% polyester","machine wash according to the care instruction label","im…
- ✅ https://oldnavy.gap.com/browse/product.do?pid=903740012
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …ll},{"id":"fabric","name":"Fabric","label":"Fabric & care","description":null,"bullets":["100% recycled polyester","jersey pocket lining: 60% cotton, 40% polyester","machine wash according to the care instruction label","im…
- ⬜ 빈 것(컬러·가격만) · https://oldnavy.gap.com/browse/product.do?pid=916674002
- ⬜ 빈 것(컬러·가격만) · https://oldnavy.gap.com/browse/product.do?pid=1186791012
- ⬜ 빈 것(컬러·가격만) · https://oldnavy.gap.com/browse/product.do?pid=916674022

### Reformation — 채움 33 · 빈 것 0 · 못 읽음 74

- ✅ https://www.thereformation.com/products/jonie-cashmere-oversized-scoop-neck/1319252OAT.html
  - 값: **Cashmere 95% / Wool 5% ‖ Cashmere 100%** (보관본 20261012)
  - 페이지 글: 화면 글: …oto JPG, PNG or WEBP up to 10MB clear Play video Pause video Play video Pause video Jonie Cashmere Oversized Scoop Neck 95% recycled cashmere CA$ 568.00 CA$ 568 Final sale Help Final sale products are not eligible for returns except…
- ✅ https://www.thereformation.com/products/ashley-regenerative-wool-crew/1320628PXG.html
  - 값: **Wool 100%** (보관본 20261012)
  - 페이지 글: 화면 글: …Play video Pause video Play video Pause video Play video Pause video Ashley Regenerative Wool Crew 100% NATIVA™ wool CA$ 288.00 CA$ 288 Final sale Help Final sale products are not eligible for returns except under…
- ✅ https://www.thereformation.com/products/soren-sheer-alpaca-sweater-top/1318668ZSS.html
  - 값: **Alpaca 70% / Nylon 30%** (보관본 20261113)
  - 페이지 글: 화면 글: …de . Material & care This is a tissue weight alpaca sweater yarn spun in Italy, made from 70% Baby Alpaca and 30 % Recycled Nylon. Hand wash + dry flat. Alpaca wool is a renewable fiber that has a much lower environ…
- ✅ https://www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_1320743BLK_color=BLK
  - 값: **Nylon 100%** (보관본 20261106)
  - 페이지 글: 화면 글: …it? See our size & fit guide . Material & care This is a deadstock woven fabric made from 100% Nylon. Deadstock is aging, excess, or over-ordered fabric. Dry clean only. We buy verified aging, leftover, and ove…
- ✅ https://www.thereformation.com/products/aylani-knit-top/1319748CUV.html?dwvar_1319748CUV_color=CUV
  - 값: **Lyocell 88% / Elastane 12%** (보관본 20261014)
  - 페이지 글: 화면 글: …al & care Eco Cinch is a medium weight stretch knit fabric with a soft handfeel made with 88% TENCEL ® Lyocell, 12% Elastane. Wash cold / tumble dry low. TENCEL™ Lyocell comes from Eucalyptus trees, which take…
- ⛔ 막힘(fetch,impit) · https://www.thereformation.com/products/thatcher-silk-twill-top/1320740FDL.html?dwvar_1320740FDL_color=FDL
- ⛔ 막힘(fetch,impit) · https://www.thereformation.com/products/thatcher-top/1320742TGT.html?dwvar_1320742TGT_color=TGT
- ⛔ 막힘(fetch,impit) · https://www.thereformation.com/products/yessica-dress/1320570CRM.html?dwvar_1320570CRM_color=CRM

### Sessun — 채움 2 · 빈 것 1 · 못 읽음 47

- ✅ https://en.sessun.com/catalogue/dresses/yanza-moss-bronze.html
  - 값: **Wool 40% / Yak 30% / Nylon 30%** (본문)
  - 페이지 글: 화면 글: …neck. Long raglan sleeves. Slit detailing at the armholes. Directional stitch detailing. 40% wool, 30% yak, 30% polyamide Made in China Wring out and dry flat on a suitable surface. Need help? We're availabl…
- ✅ https://en.sessun.com/catalogue/dresses/yanza-carbonella.html
  - 값: **Wool 40% / Yak 30% / Nylon 30%** (본문)
  - 페이지 글: 화면 글: …neck. Long raglan sleeves. Slit detailing at the armholes. Directional stitch detailing. 40% wool, 30% yak, 30% polyamide Made in China Wring out and dry flat on a suitable surface. Need help? We're availabl…
- ⬜ 빈 것(컬러·가격만) · https://en.sessun.com/catalogue/trousers/carlea-black.html
- ⛔ 막힘(fetch,impit) · https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-025.webp%20924w
- ⛔ 막힘(fetch,impit) · https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-028.webp%20924w
- ⛔ 막힘(fetch,impit) · https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_blazer_blue-Karty_bluenim-027.webp%20924w

### The upside — 채움 392 · 빈 것 6 · 못 읽음 31

- ✅ https://www.theupside.com/inez-brielle-scoop-bra-black-usw426153/
  - 값: **Nylon 75% / Elastane 25%** (본문)
  - 페이지 글: 화면 글: …and wears an US 4/S which is a AU 8, UK 8 and FR 36 [care-instructions] Recycled Peached 75% Recycled Nylon 25% Elastane Cold gentle machine wash separately. Wash inside out. Do not soak, bleach or wring. Hang dry in…
- ✅ https://www.theupside.com/le-ski-blanche-half-zip-black-usw426184/
  - 값: **Cotton 98% / Nylon 2%** (본문)
  - 페이지 글: (다시 찾지 못함)
- ✅ https://www.theupside.com/wonder-knit-polo-navy-usw426171/
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …den is 5'7"/175cm and wears an US 4/S which is a AU 8, UK 8 and FR 36 [care-instructions] Organic Cotton 100% Organic Cotton Cold gentle machine wash separately. Do not soak, bleach or wring. Reshape whilst damp. Dry fl…
- ✅ https://www.theupside.com/jules-cropped-tee-jewel-usw426089/
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …den is 5'7"/175cm and wears an US 4/S which is a AU 8, UK 8 and FR 36 [care-instructions] Organic Cotton 100% Organic Cotton Cold machine wash with similar colours. Wash inside out. Do not soak, bleach or wring. Hang dr…
- ✅ https://www.theupside.com/lou-v-neck-sweater-jewel-usw426087/
  - 값: **Cotton 100%** (본문)
  - 페이지 글: (다시 찾지 못함)
- ⬜ 빈 것(컬러·가격만) · https://www.theupside.com/seamless-halle-halter-top-cream-usw326095/
- ⬜ 빈 것(미표기) · https://www.theupside.com/meet-eddie-nelson-founder-of-bred-breathwork
- ⬜ 빈 것(컬러·가격만) · https://www.theupside.com/soho-hunter-tank-top-butterscotch-usw426010/
- ⛔ 막힘(fetch,impit) · https://www.theupside.com/active/bottoms/shorts/
- ⛔ 막힘(fetch,impit) · https://www.theupside.com/collections/discover/nomada/
- ⛔ 막힘(fetch,impit) · https://www.theupside.com/active/tops/sports-bras/

### WHBM — 채움 25 · 빈 것 0 · 못 읽음 194

- ✅ https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570405894?inseam=regular&sizeType=regular&color=001&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526
  - 값: **Cotton 95% / Elastane 5%** (본문)
  - 페이지 글: 페이지 JSON: …a flattering silhouette. Fitted Short sleeves Scoop neck Fully lined Regular length: 24” 95% Cotton, 5% Spandex Machine wash cold May be dry cleaned Imported ","color":"Black","sku":"196536535915","brand":{"@t…
- ✅ https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570405895?inseam=regular&sizeType=regular&color=100&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526
  - 값: **Cotton 95% / Elastane 5%** (보관본 20260608)
  - 페이지 글: 화면 글: …a flattering silhouette. Fitted Short sleeves Scoop neck Fully lined Regular length: 24” 95% Cotton, 5% Spandex Machine wash cold May be dry cleaned Imported Shipping & Returns SHARE Reviews and Fit Have a que…
- ✅ https://www.whitehouseblackmarket.com/store/product/short-sleeve-tee/570317989?inseam=regular&sizeType=regular&color=001&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=194301903020
  - 값: **Viscose 95% / Elastane 5%** (본문)
  - 페이지 글: 페이지 JSON: …Modern, effortless fit Short sleeve V-neck Regular length: 24 1/2” Petite length: 23 1/8” 95% Rayon, 5% Spandex Machine wash cold Imported ","color":"Black","sku":"194301903037","brand":{"@type":"Organization"…
- ✅ https://www.whitehouseblackmarket.com/store/product/jetsetter-tee/570302805?inseam=regular&sizeType=regular&color=001&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=194300960925
  - 값: **Viscose 95% / Elastane 5%** (본문)
  - 페이지 글: 페이지 JSON: …Short dolman sleeves V-neck Pullover Regular length:&nbsp; 25 1/2" Petite length: 24 1/8" 95% Rayon, 5% Spandex Machine wash cold Imported ","color":"Black","sku":"194300961007","brand":{"@type":"Organization"…
- ✅ https://www.whitehouseblackmarket.com/store/product/scoop-neck-long-sleeve-tee/570421364?inseam=regular&sizeType=regular&color=7716&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761603251
  - 값: **Cotton 96% / Elastane 4%** (본문)
  - 페이지 글: 페이지 JSON: …lish + ease to your looks. Fitted Scoop neck Long sleeve Pullover Regular length: 24 3/4” 96% Cotton, 4% Spandex Machine wash cold Tumble dry low Imported ","color":"Heathered Slate","sku":"199761603350","brand…
- ⛔ 막힘(fetch,impit) · https://www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-tee/570421368?inseam=regular&sizeType=regular&color=190&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761602643
- ⛔ 막힘(fetch,impit) · https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570413314?inseam=regular&sizeType=regular&color=7332&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526
- ⛔ 막힘(fetch,impit) · https://www.whitehouseblackmarket.com/store/product/scoop-neck-long-sleeve-tee/570421825?inseam=regular&sizeType=regular&color=2341&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761603251

### Zara — 채움 5 · 빈 것 0 · 못 읽음 492

- ✅ https://www.zara.com/us/en/mock-neck-t-shirt-p03641857.html?v1=575974479
  - 값: **Cotton 48% / Modal 47% / Elastane 5%** (보관본 20261107)
  - 페이지 글: 페이지 JSON: …perty":[{"@type":"PropertyValue","propertyID":"Composition","name":"OUTER SHELL","value":"48% cotton, 47% modal, 5% elastane"}],"hasVariant":[{"@type":"Product","name":"MOCK NECK T-SHIRT - Oyster-white - S","sk…
- ✅ https://www.zara.com/us/en/cotton-strap-top-p04424626.html?v1=547344104
  - 값: **Cotton 50% / Modal 50%** (보관본 20260909)
  - 페이지 글: 화면 글: …position & care Check in-store availability Shipping, Exchanges and Returns Composition : 50% cotton, 50% modal Footer Help My Zara account Items and sizes Gift options Deliveries Payments and invoices My purch…
- ✅ https://www.zara.com/us/en/hooded-bomber-sweatshirt-p03046040.html?v1=586069548
  - 값: **Viscose 79% / Nylon 14% / Elastane 7% ‖ Polyester 100%** (보관본 20260901)
  - 페이지 글: 화면 글: …omposition & care Check in-store availability Shipping, Exchanges and Returns OUTER SHELL 79% viscose 14% polyamide 7% elastane LINING BODY 100% polyester HOOD 79% viscose 7% elastane 14% polyamide Footer Help M…
- ✅ https://www.zara.com/us/en/interlock-bomber-sweatshirt-p02335653.html?v1=560284773
  - 값: **Cotton 75% / Polyester 17% / Elastane 8%** (보관본 20261107)
  - 페이지 글: 페이지 JSON: …,"value":""},{"@type":"PropertyValue","propertyID":"Composition","name":"LINING","value":"75% cotton, 17% polyester, 8% elastane"}],"hasVariant":[{"@type":"Product","name":"INTERLOCK BOMBER SWEATSHIRT - Mid-blu…
- ✅ https://www.zara.com/us/en/pocket-hoodie-p04393801.html?v1=590079117
  - 값: **Cotton 70% / Polyester 30%** (보관본 20261107)
  - 페이지 글: 페이지 JSON: …perty":[{"@type":"PropertyValue","propertyID":"Composition","name":"OUTER SHELL","value":"70% cotton, 30% polyester"}],"hasVariant":[{"@type":"Product","name":"POCKET HOODIE - Fuchsia - S","sku":"553031697-630-…
- ⛔ 막힘(fetch,impit) · https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424807.html?v1=605310761
- ⛔ 막힘(fetch,impit) · https://www.zara.com/us/en/striped-oversize-t-shirt-p00858742.html?v1=583447043
- ⛔ 막힘(fetch,impit) · https://www.zara.com/us/en/lyocell-t-shirt-p03431648.html?v1=580218597

## 웹 아카이브 층

조회 270/600개(브랜드당 40) · 요청 486회 · 429 0 · 5xx 0 · 네트워크 오류 19 · 쿼리 포함 주소로만 찾은 것 2

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Chico's | 764 | 18 | 6 | 34 | 0 | 0 | 0 | 705 | 2339s |
| Zara | 497 | 0 | 5 | 29 | 5 | 0 | 1 | 457 | 1880s |
| The upside | 429 | 386 | 6 | 20 | 5 | 6 | 0 | 0 | 1218s |
| WHBM | 219 | 17 | 8 | 29 | 3 | 0 | 0 | 162 | 1605s |
| Gap | 148 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 149s |
| Banana Republic | 148 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 148s |
| Athleta | 130 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 131s |
| Reformation | 107 | 0 | 33 | 4 | 3 | 2 | 0 | 65 | 746s |
| Massimo Dutti | 60 | 0 | 2 | 36 | 2 | 0 | 0 | 20 | 633s |
| Sessun | 50 | 2 | 0 | 17 | 0 | 0 | 0 | 30 | 298s |
| Garnet hill | 30 | 0 | 0 | 1 | 21 | 8 | 0 | 0 | 823s |
| Old Navy | 20 | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 20s |

사유별 개수: 찾음 60 · 보관본 없음 170 · 보관본에 혼용률 없음 9 · 혼용률 여러 벌(목록) 1 · 주소: 카테고리 경로 9 · 주소: 카테고리 이름 주소 7 · 보관본도 차단·빈 화면 21 · 상품 표시 없음 5 · 보관본 열기 실패 2 · 주소: 상품이 아닌 경로 1 · 목록 페이지(JSON-LD) 1 · 아카이브 오류 1

<details><summary>사유별 예시(최대 25개)</summary>

**찾음**

- Reformation — https://www.thereformation.com/products/jonie-cashmere-oversized-scoop-neck/1319252OAT.html — 20261012 · Cashmere 95% / Wool 5% / Cashmere 100%
- Reformation — https://www.thereformation.com/products/ashley-regenerative-wool-crew/1320628PXG.html — 20261012 · Wool 100%
- Reformation — https://www.thereformation.com/products/soren-sheer-alpaca-sweater-top/1318668ZSS.html — 20261113 · Alpaca 70% / Nylon 30%
- Reformation — https://www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_1320743BLK_color=BLK — 20261106 · Nylon 100%
- Reformation — https://www.thereformation.com/products/aylani-knit-top/1319748CUV.html?dwvar_1319748CUV_color=CUV — 20261014 · Lyocell 88% / Elastane 12%
- Reformation — https://www.thereformation.com/products/thatcher-top/1320742CUV.html?dwvar_1320742CUV_color=CUV — 20261106 · Viscose 100%
- Reformation — https://www.thereformation.com/products/norette-knit-top/1320799BLK.html?dwvar_1320799BLK_color=BLK — 20261113 · Lyocell 67% / Cotton 29% / Elastane 4%
- Reformation — https://www.thereformation.com/products/hetty-top/1320726DPR.html?dwvar_1320726DPR_color=DPR — 20261115 · Viscose 53% / Lyocell 25% / Linen 22%
- Reformation — https://www.thereformation.com/products/leven-knit-top/1320705PRN.html?dwvar_1320705PRN_color=PRN — 20261030 · Polyester 100%
- Reformation — https://www.thereformation.com/products/aylani-knit-top/1319748LPS.html?dwvar_1319748LPS_color=LPS — 20261013 · Lyocell 88% / Elastane 12%
- Reformation — https://www.thereformation.com/products/iris-knit-top/1318710PVT.html?dwvar_1318710PVT_color=PVT — 20261010 · Lyocell 67% / Cotton 29% / Elastane 4%
- Reformation — https://www.thereformation.com/products/blythe-silk-top/1320738BLK.html?dwvar_1320738BLK_color=BLK — 20261015 · Silk 100%
- Reformation — https://www.thereformation.com/products/dusk-knit-top/1312627CUV.html?dwvar_1312627CUV_color=CUV — 20261021 · Cotton 88% / Elastane 12%
- Reformation — https://www.thereformation.com/products/eli-oversized-shirt/1316192SGQ.html?dwvar_1316192SGQ_color=SGQ — 20261019 · Lyocell 84% / Polyester 16%
- Reformation — https://www.thereformation.com/products/eternity-knit-top/1314524OOL.html?dwvar_1314524OOL_color=OOL — 20260304 · Lyocell 67% / Cotton 29% / Elastane 4% · 쿼리 포함 주소
- Reformation — https://www.thereformation.com/products/eli-oversized-shirt/1316192SHQ.html?dwvar_1316192SHQ_color=SHQ — 20261013 · Lyocell 84% / Polyester 16%
- Reformation — https://www.thereformation.com/products/raya-fitted-silk-shirt/1319179PRP.html?dwvar_1319179PRP_color=PRP — 20261111 · Silk 100%
- Reformation — https://www.thereformation.com/products/katherine-poplin-shirt/1320596LPS.html?dwvar_1320596LPS_color=LPS — 20261106 · Cotton 97% / Elastane 3%
- Reformation — https://www.thereformation.com/products/katherine-poplin-shirt/1320596BGW.html?dwvar_1320596BGW_color=BGW — 20260901 · Cotton 97% / Elastane 3%
- Reformation — https://www.thereformation.com/products/jillian-silk-dress/1318344BSN.html?dwvar_1318344BSN_color=BSN — 20261105 · Silk 100% / Viscose 100%
- Reformation — https://www.thereformation.com/products/ofelia-silk-dress/1320564ETP.html?dwvar_1320564ETP_color=ETP — 20261113 · Silk 100% / Viscose 100%
- Reformation — https://www.thereformation.com/products/hugo-knit-dress/1319773OOL.html?dwvar_1319773OOL_color=OOL — 20261009 · Lyocell 88% / Elastane 12%
- Reformation — https://www.thereformation.com/products/rene-mesh-knit-dress/1317961BRW.html?dwvar_1317961BRW_color=BRW — 20261006 · Nylon 92% / Elastane 8%
- Reformation — https://www.thereformation.com/products/demi-dress/1321084MJQ.html?dwvar_1321084MJQ_color=MJQ — 20261113 · Polyester 97% / Elastane 3%
- Reformation — https://www.thereformation.com/products/mariam-dress/1320692ZMM.html?dwvar_1320692ZMM_color=ZMM — 20261110 · Polyester 100%

**보관본 없음**

- Reformation — https://www.thereformation.com/products/thatcher-silk-twill-top/1320740FDL.html?dwvar_1320740FDL_color=FDL
- Reformation — https://www.thereformation.com/products/thatcher-top/1320742TGT.html?dwvar_1320742TGT_color=TGT
- Reformation — https://www.thereformation.com/products/rune-dress/1321025AUB.html?dwvar_1321025AUB_color=AUB
- Reformation — https://www.thereformation.com/products/angeles-dress/1320722FOE.html?dwvar_1320722FOE_color=FOE
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_black_granit-006_RTCH.webp%20924w
- Chico's — https://www.chicos.com/store/product/applique-long-sleeve-tee/570422109?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761663781
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Inea_black-Gilda_murza-0301.webp%20924w
- Chico's — https://www.chicos.com/store/product/shimmer-velvet-knit-top/570421521?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761617814
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Inea_black-Gilda_murza-0201.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Pova_brownwhisky-011_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Pova_brownwhisky-001_RTCH.webp%20924w
- Chico's — https://www.chicos.com/store/product/shimmer-flare-sleeve-top/570423352?inseam=regular&sizeType=regular&color=001&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761664207
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/RTCH_WXL_Chebbi_Ganache-Dalt_espresso-025_1_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/RTCH_WXL_Chebbi_Ganache-Dalt_espresso-020_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Olivieira_marble_rose-046.webp%20924w
- Chico's — https://www.chicos.com/store/product/shimmering-christmas-cheer-long-sleeve-layering-tee/570423126?inseam=regular&sizeType=regular&color=001&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761629558
- Chico's — https://www.chicos.com/store/product/shimmering-snowflakes-long-sleeve-layering-tee/570423354?inseam=regular&sizeType=regular&color=1673&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761670734
- Chico's — https://www.chicos.com/store/product/ponte-long-sleeve-cowlneck-tee/570423174?inseam=regular&sizeType=regular&color=4569&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761630998
- Chico's — https://www.chicos.com/store/product/shimmer-3d-long-sleeve-peasant-top/570423501?inseam=regular&sizeType=regular&color=001&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761672752
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Olivieira_marble_rose-022.webp%20924w
- Chico's — https://www.chicos.com/store/product/satin-rose-jacquard-collared-tunic/570420860?inseam=regular&sizeType=regular&color=1673&catId=cat40002&collectionId=category&queryId=fb538b860025287dda303d6d31d165df&indexName=prod_chs_products&parentId=199761513888
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_ballerina-003.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_ballerina-039.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_vivapurple-036_rtch.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_vivapurple-038_rtch.webp%20924w

**보관본에 혼용률 없음**

- Reformation — https://www.thereformation.com/products/yessica-dress/1320570CRM.html?dwvar_1320570CRM_color=CRM
- Reformation — https://www.thereformation.com/products/maribel-dress/1320723NRU.html?dwvar_1320723NRU_color=NRU
- WHBM — https://www.whitehouseblackmarket.com/store/product/puff-sleeve-twill-shirt/570406419?inseam=regular&sizeType=regular&color=001&catId=cat4769287&collectionId=category&queryId=e0882e62584ea750cb66a30b638265fb&indexName=prod_whbm_products&parentId=196536527361
- Zara — https://www.zara.com/us/en/printed-sweatshirt-p06050113.html?v1=605502540
- Zara — https://www.zara.com/us/en/zip-up-sweatshirt-jacket-p04174816.html?v1=606253707
- WHBM — https://www.whitehouseblackmarket.com/store/product/puff-sleeve-twill-shirt/570418409?inseam=regular&sizeType=regular&color=100&catId=cat4769287&collectionId=category&queryId=e0882e62584ea750cb66a30b638265fb&indexName=prod_whbm_products&parentId=196536527361
- Massimo Dutti — https://www.massimodutti.com/us/flowing-straightleg-pants-l05025702
- Massimo Dutti — https://www.massimodutti.com/us/pinstripe-cool-wool-blend-suit-trousers-l05015519
- The upside — https://www.theupside.com/elina-v-neck-tee-white-usw026055/

**혼용률 여러 벌(목록)**

- Reformation — https://www.thereformation.com/products/emmerson-dress/1320945HIL.html?dwvar_1320945HIL_color=HIL — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":3,"prices":6,"carts":1,"sigs":["viscose 51","viscose 49","viscose 100"],"title":"Emmerson Dress","types":["Product","Brand","Offer"]}

**주소: 카테고리 경로**

- Gap — https://www.gap.com/browse/new/gap-hoodie-shop
- The upside — https://www.theupside.com/collections/discover/nomada/
- The upside — https://www.theupside.com/collections/discover/alvorada/
- Garnet hill — https://www.garnethill.com/clothing/categories/sweaters/
- Garnet hill — https://www.garnethill.com/clothing/categories/coats-jackets/
- Garnet hill — https://www.garnethill.com/clothing/categories/skirts/
- Garnet hill — https://www.garnethill.com/clothing/categories/sleepwear/
- Garnet hill — https://www.garnethill.com/clothing/categories/athleisure/
- Garnet hill — https://www.garnethill.com/clothing/categories/intimates/

**주소: 카테고리 이름 주소**

- Reformation — https://www.thereformation.com/tops/going-out-tops
- Reformation — https://www.thereformation.com/tops/basic-tops
- The upside — https://www.theupside.com/active/bottoms/shorts/
- Garnet hill — https://www.garnethill.com/clothing/features/top-rated-clothing/
- The upside — https://www.theupside.com/active/all-in-one/dresses/
- The upside — https://www.theupside.com/tanks-tees/
- Garnet hill — https://www.garnethill.com/shoes-accessories/shoes/

**보관본도 차단·빈 화면**

- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/cashmere-gifts/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/gifts-under-100/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/gifts-for-her/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/gifts-for-him/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/gifts-for-kids/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/family-pajamas/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/holiday-dressing/
- Garnet hill — https://www.garnethill.com/bedding-home/features/monogram-shop/
- Garnet hill — https://www.garnethill.com/bedding-home/decor/holiday-decor/
- Garnet hill — https://www.garnethill.com/clothing/features/the-cashmere-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-linen-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-eileen-fisher-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-organic-cotton-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-kids-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-mens-shop/
- Garnet hill — https://www.garnethill.com/shoes-accessories/shoes/flats/
- Garnet hill — https://www.garnethill.com/shoes-accessories/shoes/boots/
- Garnet hill — https://www.garnethill.com/clothing/features/the-petite-shop/
- Garnet hill — https://www.garnethill.com/shoes-accessories/shoes/sneakers/
- Zara — https://www.zara.com/us/en/basic-plush-sweatshirt-p08417802.html?v1=555528898
- Zara — https://www.zara.com/us/en/interlock-zip-up-sweatshirt-p02335652.html?v1=597431702

**상품 표시 없음**

- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/holiday-decor/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":1,"prices":2,"carts":0,"sigs":["linen 100"],"title":"Holiday Decor","types":["Brand","BreadcrumbList","ListItem"]}
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/holiday-bedding/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":1,"prices":2,"carts":0,"sigs":["cotton 100"],"title":"Holiday Bedding","types":["Brand","BreadcrumbList","ListItem"]}
- The upside — https://www.theupside.com/giftcertificates.php/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":0,"prices":15,"carts":0,"sigs":[],"title":"Gift Certificates - THE UPSIDE USA","types":["WebPage","WebSite","Organization"]}
- The upside — https://www.theupside.com/made-to-move-signature-fabrics/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":6,"blocks":0,"prices":0,"carts":0,"sigs":[],"title":"MADE TO MOVE","types":["WebPage","WebSite","Organization"]}
- The upside — https://www.theupside.com/the-cambodian-childrens-trust/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":0,"prices":1,"carts":0,"sigs":[],"title":"The Cambodian Children&#x27;s Trust","types":["WebPage","WebSite","BreadcrumbList","ListItem","Organization"]}

**보관본 열기 실패**

- WHBM — https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570413314?inseam=regular&sizeType=regular&color=7332&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526 — HTTP 404
- Zara — https://www.zara.com/us/en/long-sleeve-cotton-t-shirt-p04424802.html?v1=605502545 — HTTP 404

**주소: 상품이 아닌 경로**

- The upside — https://www.theupside.com/journal/

**목록 페이지(JSON-LD)**

- The upside — https://www.theupside.com/holiday-gift-guide — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":0,"prices":0,"carts":0,"sigs":[],"title":"HOLIDAY GIFT GUIDE / THE UPSIDE","types":["CollectionPage","WebSite","Organization"]}

**아카이브 오류**

- Zara — https://www.zara.com/us/en/cotton-zip-jacket-p03253809.html?v1=547392296 — fetch failed

</details>

