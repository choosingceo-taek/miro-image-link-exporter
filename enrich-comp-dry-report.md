# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-25T11:49Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Buck Mason, Dickies, Everlane, J crew, Massimo Dutti, Mint velvet, Poetry, Spanx, Whitestuff, Wilson

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 0/10개** (상품 0/2679개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

전체 평균은 아직입니다 — 혼용률 53% · 컬러웨이 43%.
기준 95% 까지 1400개, 목표 99% 까지 1507개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 2679개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 1412 | 53% | +60 |
| 컬러웨이 | 1146 | 43% | +3 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 30개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (10) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| Massimo Dutti | — | 5/603 (1%) | 4/603 (1%) | 혼용률 +2 컬러 +2 | 성공 아카이브 2 / 실패 정보없음 30·직접차단 30·보관본없음 27·아카이브거부 1 |
| J crew | — | 65/215 (30%) | 208/215 (97%) | 혼용률 +2 컬러 +1 | 성공 페이지 30·impit 30 |
| Wilson | — | 28/52 (54%) | 39/52 (75%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 13·페이지 23 / 실패 정보없음 1·직접차단 1·보관본없음 1 |
| Dickies | — | 144/260 (55%) | 260/260 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 28·페이지 30·impit 1 |
| Mint velvet | — | 293/416 (70%) | 134/416 (32%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 30·페이지 30 |
| Everlane | — | 317/443 (72%) | 0/443 (0%) | 혼용률 +2 컬러 +0 | 성공 쇼피JSON 30·페이지 30 |
| Buck Mason | — | 86/119 (72%) | 118/119 (99%) | 혼용률 +29 컬러 +0 | 성공 페이지 30 |
| Spanx | — | 66/84 (79%) | 84/84 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 18 |
| Poetry | — | 240/303 (79%) | 299/303 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 30 |
| Whitestuff | — | 168/184 (91%) | 0/184 (0%) | 혼용률 +25 컬러 +0 | 성공 페이지 30·impit 30 / 가드 보류 4 |

## 저장 직전 가드가 보류한 혼용률 (4)

이 브랜드의 다른 상품에도 똑같이 되풀이되는 값이라 상품의 소재가 아니라 페이지 틀(메뉴·배너·추천 블록)의 글로 보고
저장하지 않았다(scripts/comp-guard.mjs). 칸은 비어 있고 재시도 기간이 지나면 다시 읽는다.

| 브랜드 | 상품 | 읽은 값 | 이유 |
|---|---|---|---|
| Whitestuff | [LIBBY ORGANIC COTTON SHIRT](https://www.whitestuff.com/p/9420/448337-libby-organic-cotton-shirt/BRIL_WHITE) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [LIBBY ORGANIC COTTON SHIRT](https://www.whitestuff.com/p/9420/448337-libby-organic-cotton-shirt/BLUE_MLT) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [LENA EMBROIDERED SHIRT](https://www.whitestuff.com/p/9444/447536-lena-embroidered-shirt/BLK_MLT) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [JOJO JERSEY SHIRT DRESS](https://www.whitestuff.com/p/9360/448930-jojo-jersey-shirt-dress/DARK_NAVY) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |

## 웹 아카이브 층

조회 31/600개(브랜드당 40) · 요청 34회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Massimo Dutti | 30 | 0 | 2 | 27 | 1 | 0 | 0 | 0 | 134s |
| Buck Mason | 30 | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 2s |
| Dickies | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5s |
| Everlane | 30 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |
| J crew | 30 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 6s |
| Poetry | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |
| Mint velvet | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3s |
| Whitestuff | 30 | 25 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |
| Wilson | 24 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 35s |
| Spanx | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |

사유별 개수: 보관본 없음 28 · 찾음 2 · 보관본에 혼용률 없음 1

<details><summary>사유별 예시(최대 25개)</summary>

**보관본 없음**

- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-henley-tshirt-l06203115
- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-mock-neck-tshirt-l06285106
- Massimo Dutti — https://www.massimodutti.com/us/striped-interlock-sweatshirt-l06211810
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918
- Massimo Dutti — https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-knit-tshirt-l06270106
- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-tshirt-with-lingerieinspired-detail-l06874575
- Massimo Dutti — https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-interlock-vneck-tshirt-l06834542
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-long-sleeve-polo-shirt-l06204115
- Wilson — https://custom.wilson.com/en-us/custom/footballs
- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-striped-woolblend-polo-l06266106
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-strappy-top-l06612200
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-short-sleeve-henley-tshirt-l06856820
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-long-sleeve-tshirt-l06882820
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-striped-boat-neck-tshirt-l06274180
- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-striped-tshirt-l06845220
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-long-tshirt-with-round-neck-l06828803
- Massimo Dutti — https://www.massimodutti.com/us/knit-top-with-lace-detail-l06838553
- Massimo Dutti — https://www.massimodutti.com/us/top-with-lace-neckline-detail-l06857575
- Massimo Dutti — https://www.massimodutti.com/us/buttondetail-short-sleeve-tshirt-l06812250
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-square-neck-top-l06256578
- Massimo Dutti — https://www.massimodutti.com/us/vneck-top-with-lace-detail-l06810918
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-halter-top-l06815918
- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-straight-neckline-tshirt-l06241810

**찾음**

- Massimo Dutti — https://www.massimodutti.com/us/100-cotton-long-sleeve-striped-tshirt-l06238513 — 20260919 · Cotton 100%
- Massimo Dutti — https://www.massimodutti.com/us/flowing-vneck-tshirt-l06831935 — 20260518 · Cotton 100%

**보관본에 혼용률 없음**

- Massimo Dutti — https://www.massimodutti.com/us/short-sleeve-striped-cotton-blend-tshirt-l06207562

</details>

