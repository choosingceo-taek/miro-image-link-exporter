# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-24T01:18Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Addidas, Anthropologie, Aritzia, Arket, Chico's, Fatface, FP Movement, Free People, Joules, Massimo Dutti, Lululemon, Mango, &Other Stories, Reformation, H&M, Zara

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 0/16개** (상품 0/7684개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

전체 평균은 아직입니다 — 혼용률 16% · 컬러웨이 8%.
기준 95% 까지 6675개, 목표 99% 까지 6983개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 7684개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 1206 | 16% | +15 |
| 컬러웨이 | 625 | 8% | +13 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 40개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (16) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| Fatface | — | 0/456 (0%) | 0/456 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 30·직접차단 30·보관본없음 16·아카이브오류 8 |
| Free People | — | 0/192 (0%) | 0/192 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 30·직접차단 30·보관본없음 3·아카이브오류 8 |
| Joules | — | 0/566 (0%) | 0/566 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 30·직접차단 30 |
| Lululemon | — | 0/483 (0%) | 0/483 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 30·직접차단 30 |
| Zara | — | 0/500 (0%) | 0/500 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 30·직접차단 30 |
| H&M | — | 0/743 (0%) | 4/743 (1%) | 혼용률 +0 컬러 +0 | 실패 정보없음 38·직접차단 38·보관본없음 8 |
| Massimo Dutti | — | 1/599 (0%) | 0/599 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 30·직접차단 30 |
| Addidas | — | 1/537 (0%) | 1/537 (0%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 정보없음 33·직접차단 33·보관본없음 15·아카이브거부 9 |
| Chico's | — | 7/800 (1%) | 6/800 (1%) | 혼용률 +7 컬러 +6 | 성공 아카이브 7 / 실패 정보없음 30·직접차단 30·보관본없음 15·아카이브오류 8 |
| Anthropologie | — | 4/259 (2%) | 4/259 (2%) | 혼용률 +4 컬러 +4 | 성공 아카이브 4 / 실패 정보없음 32·직접차단 32·보관본없음 26·아카이브거부 1·아카이브오류 1 |
| FP Movement | — | 7/72 (10%) | 0/72 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 40·직접차단 39·보관본없음 3·아카이브오류 8 |
| &Other Stories | — | 172/477 (36%) | 108/477 (23%) | 혼용률 +0 컬러 +0 | 실패 정보없음 40·직접차단 40 |
| Reformation | — | 284/730 (39%) | 323/730 (44%) | 혼용률 +0 컬러 +0 | 실패 정보없음 40·직접차단 40 |
| Arket | — | 177/382 (46%) | 178/382 (47%) | 혼용률 +3 컬러 +2 | 성공 아카이브 3 / 실패 정보없음 40·직접차단 40·보관본없음 37 |
| Mango | — | 52/88 (59%) | 0/88 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 40·직접차단 40 |
| Aritzia | — | 501/800 (63%) | 1/800 (0%) | 혼용률 +0 컬러 +0 | 실패 정보없음 40·직접차단 40·보관본없음 14·아카이브거부 8 |

## 웹 아카이브 층

조회 203/1000개(브랜드당 40) · 요청 245회 · 429 0 · 5xx 0 · 네트워크 오류 11 · 쿼리 포함 주소로만 찾은 것 0 · **이 실행 도중 층을 껐다: 연속 실패 4회(마지막: fetch failed)**

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Arket | 40 | 0 | 3 | 37 | 0 | 0 | 0 | 0 | 184s |
| Aritzia | 40 | 0 | 0 | 14 | 8 | 18 | 0 | 0 | 163s |
| FP Movement | 40 | 0 | 0 | 3 | 0 | 2 | 8 | 0 | 200s |
| &Other Stories | 40 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 9s |
| Mango | 40 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10s |
| Reformation | 40 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 9s |
| H&M | 38 | 0 | 0 | 8 | 0 | 0 | 0 | 0 | 21s |
| Addidas | 33 | 0 | 1 | 15 | 9 | 8 | 0 | 0 | 172s |
| Anthropologie | 32 | 0 | 4 | 26 | 1 | 0 | 1 | 0 | 353s |
| Chico's | 30 | 0 | 7 | 15 | 0 | 0 | 8 | 0 | 353s |
| Fatface | 30 | 0 | 0 | 16 | 0 | 0 | 8 | 0 | 182s |
| Free People | 30 | 0 | 0 | 3 | 0 | 0 | 8 | 0 | 166s |
| Joules | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 8s |
| Massimo Dutti | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2s |
| Lululemon | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7s |
| Zara | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2s |

사유별 개수: 보관본 없음 137 · 주소: 카테고리 경로 1 · 주소: 카테고리 이름 주소 27 · 상품 표시 없음 14 · 찾음 15 · 보관본에 혼용률 없음 1 · 목록 페이지(JSON-LD) 2 · 혼용률 여러 벌(목록) 1 · 아카이브 오류 33

<details><summary>사유별 예시(최대 5개)</summary>

**보관본 없음**

- Addidas — https://www.adidas.com/us/ultimate365-solid-knit-skort/KC4506.html
- Addidas — https://www.adidas.com/us/adidas-x-farm-rio-dress/KR0258.html
- Addidas — https://www.adidas.com/us/tennis-climacool-lace-dress-pro/KS7080.html
- Anthropologie — https://www.anthropologie.com/shop/bronx-banco-embellished-long-sleeve-maxi-dress
- Anthropologie — https://www.anthropologie.com/shop/celiab-starlit-sequined-fringe-mini-dress

**주소: 카테고리 경로**

- Aritzia — https://www.aritzia.com/intl/en/shop-by/event-dressing/holiday-party-dressing

**주소: 카테고리 이름 주소**

- Aritzia — https://www.aritzia.com/intl/en/new
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets/wool-coats
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweaters
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets
- Addidas — https://www.adidas.com/us/women

**상품 표시 없음**

- Aritzia — https://www.aritzia.com/intl/en/clothing/polar-fleece — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":0,"prices":48,"carts":0}
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets/puffers/thesuperpuff — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":0,"carts":0}
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweatsuit-sets — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":2,"prices":0,"carts":0}
- Addidas — https://www.adidas.com/us/women-black_friday — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":112,"carts":0}
- Addidas — https://www.adidas.com/us/women-prime — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":69,"carts":0}

**찾음**

- Anthropologie — https://www.anthropologie.com/shop/pilcro-quinn-drapey-v-neck-tee — 20261023 · Cotton 50% / Modal 50%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-layering-tee/570395349?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=196535885707 — 20260913 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-foil-mock-neck-layering-tee/570375536?inseam=regular&sizeType=regular&color=7130&catId=cat11199293&collectionId=category&parentId=196534644558 — 20260716 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997 — 20260515 · Viscose 95% / Elastane 5%
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-evan-raw-edge-baby-tee — 20261113 · Cotton 47% / Modal 47% / Elastane 6%

**보관본에 혼용률 없음**

- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-arena-wool-blend-fitted-turtleneck-top

**목록 페이지(JSON-LD)**

- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":0,"carts":0}
- Aritzia — https://www.aritzia.com/intl/en/discover — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":2,"prices":0,"carts":0}

**혼용률 여러 벌(목록)**

- Aritzia — https://www.aritzia.com/intl/en/product/pacino-vest/113937.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":3,"prices":0,"carts":1}

**아카이브 오류**

- Chico's — https://www.chicos.com/store/product/touch-of-cool-v-neck-layering-tee/570395354?inseam=regular&sizeType=regular&color=7174&catId=cat11199293&collectionId=category&parentId=196535885493 — fetch failed
- FP Movement — https://www.freepeople.com/fpmovement/shop/happiness-runs-crop-tank/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Chico's — https://www.chicos.com/store/product/pima-v-neck-cuffed-3-4-sleeve-tee/570423266?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761649440 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Chico's — https://www.chicos.com/store/product/cotton-slub-cuff-detail-tee/570421512?inseam=regular&sizeType=regular&color=7177&catId=cat11199293&collectionId=category&parentId=199761616626 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Chico's — https://www.chicos.com/store/product/touch-of-cool-foiled-layering-tee/570420624?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761497317 — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)

</details>

