# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-25T12:14Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Bassike, Buck Mason, Dickies, Everlane, J crew, La Ligne, Mint velvet, Poetry, Spanx, Vince, Whitestuff, Wilson

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 2/12개** (상품 778/3172개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

La Ligne · Vince

전체 평균은 아직입니다 — 혼용률 78% · 컬러웨이 61%.
기준 95% 까지 1091개, 목표 99% 까지 1218개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 3172개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 2484 | 78% | +62 |
| 컬러웨이 | 1923 | 61% | +3 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 30개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (12) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| J crew | — | 65/215 (30%) | 208/215 (97%) | 혼용률 +2 컬러 +1 | 성공 페이지 60·impit 60 |
| Wilson | — | 28/52 (54%) | 41/52 (79%) | 혼용률 +0 컬러 +2 | 성공 쇼피JSON 38·페이지 50·impit 1 / 실패 정보없음 2·직접차단 2·보관본없음 2 |
| Dickies | — | 144/260 (55%) | 260/260 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 36·페이지 58·impit 33 |
| Mint velvet | — | 293/416 (70%) | 134/416 (32%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 60·페이지 60 |
| Everlane | — | 317/443 (72%) | 0/443 (0%) | 혼용률 +2 컬러 +0 | 성공 쇼피JSON 60·페이지 40 |
| Buck Mason | — | 86/119 (72%) | 118/119 (99%) | 혼용률 +30 컬러 +0 | 성공 페이지 60 |
| Spanx | — | 66/84 (79%) | 84/84 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 48 |
| Poetry | — | 240/303 (79%) | 299/303 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 60 |
| Whitestuff | — | 168/184 (91%) | 0/184 (0%) | 혼용률 +25 컬러 +0 | 성공 페이지 60·impit 60 / 가드 보류 6 |
| Bassike | — | 307/318 (97%) | 1/318 (0%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 39·페이지 37·impit 4 |
| La Ligne | ✅ | 391/397 (98%) | 397/397 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 36 |
| Vince | ✅ | 379/381 (99%) | 381/381 (100%) | 혼용률 +3 컬러 +0 | 성공 페이지 35 |

## 상품 상세(설명·디테일·사진 전부·컬러 전부) — 이번 실행에서 읽은 브랜드 12개

> Worker 에 상세 칸(?details)이 아직 없어(배포 전) 12개 브랜드는 빈 저장값에서 센 '저장했다면' 값이다.

별도 저장 칸(detail:<site>)에 쌓인다. 상품 수 대비 — 설명 304 · 디테일 188 · 사진 294 · 컬러 전부 171 / 3172

| 브랜드 | 상품 | 설명 | 디테일 | 사진 | 컬러 전부 | 이번 +N | 가드(설명 보류·글머리표 뺌) | 저장 크기 |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| Everlane | 443 | 10 | 10 | 30 | 0 | +60 | 20·0 | 25KB |
| Mint velvet | 416 | 30 | 0 | 30 | 0 | +60 | 0·0 | 34KB |
| La Ligne | 397 | 28 | 28 | 28 | 27 | +34 | 0·0 | 32KB |
| Vince | 381 | 30 | 0 | 30 | 30 | +35 | 0·0 | 27KB |
| Bassike | 318 | 30 | 28 | 30 | 0 | +41 | 0·0 | 37KB |
| Poetry | 303 | 30 | 30 | 0 | 0 | +60 | 0·60 | 15KB |
| Dickies | 260 | 30 | 21 | 30 | 30 | +60 | 0·18 | 31KB |
| J crew | 215 | 0 | 0 | 0 | 0 | +0 | 0·0 | 4KB |
| Whitestuff | 184 | 30 | 30 | 30 | 0 | +60 | 0·55 | 15KB |
| Buck Mason | 119 | 29 | 24 | 29 | 29 | +52 | 0·0 | 31KB |
| Spanx | 84 | 30 | 0 | 30 | 30 | +48 | 0·0 | 33KB |
| Wilson | 52 | 27 | 17 | 27 | 25 | +46 | 0·68 | 86KB |

<details><summary>가드가 뺀 글(브랜드 대부분에 똑같이 붙은 글 — 사이트 공통 문구로 보고 저장하지 않음)</summary>

- Poetry · 글머리표 — machine wash · factory
- Wilson · 글머리표 — product details table · gender women · model number · see all skus
- Whitestuff · 글머리표 — machine washable
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-brown-stripe — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-vintage-red — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/f-t-ctn-orgn-box-cocoa — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-ponderosa-pine — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-cabernet — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-golden-glow — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-heathered-oats — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-blue-wing-teal — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-imperial-blue — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-aleutian — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-pale-peach — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-everglade — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-heather-rose — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-passion-fruit — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-olive-night — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-estate-blue — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-toffee-rose-pink-stripe — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-navy-peony-dark-sea-stripe — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Everlane · 설명 · https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-open-air-blue — With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxe
- Poetry · 글머리표 — machine wash · factory
- Dickies · 글머리표 — imported
- Wilson · 글머리표 — product details table · gender women · model number · see all skus
- Whitestuff · 글머리표 — long sleeve · machine washable

</details>

## 혼용률이 엇갈린 상품 (13)

지금 페이지에서 읽은 값이 이미 있던 값과 다르다. 보관본 값이었으면 지금 페이지 값으로 바꿨고(바꿈),
지금 페이지에서 읽었던 값이면 그대로 뒀다(유지).

| 브랜드 | 상품 | 있던 값 | 지금 페이지 | 처리 |
|---|---|---|---|---|
| Buck Mason | https://www.buckmason.com/products/white-toughknit-easy-tee | Cotton 100% | Cotton 100% / Ended 100% | 유지 |
| Buck Mason | https://www.buckmason.com/products/coal-venice-wash-toughknit-easy-tee | Cotton 100% | Cotton 100% / Ended 100% | 유지 |
| Buck Mason | https://www.buckmason.com/products/coal-venice-wash-toughknit-shrunken-pocket-tee | Cotton 100% | Cotton 100% / Ended 100% | 유지 |
| Buck Mason | https://www.buckmason.com/products/black-the-a-tank | Cotton 100% | Cotton 100% / Open 100% | 유지 |
| Buck Mason | https://www.buckmason.com/products/white-surplus-rib-scoop-neck-tank | Cotton 90% / Elastane 10% | Cotton 90% / Spandex 10% / Cotton 90% / Spandex 10% | 유지 |
| Buck Mason | https://www.buckmason.com/products/white-the-a-tank | Cotton 100% | Cotton 100% / Open 100% | 유지 |
| Buck Mason | https://www.buckmason.com/products/black-surplus-rib-tank | Cotton 90% / Elastane 10% | Cotton 90% / Spandex 10% / Cotton 90% / Spandex 10% | 유지 |
| Buck Mason | https://www.buckmason.com/products/white-surplus-rib-tank | Cotton 90% / Elastane 10% | Cotton 90% / Spandex 10% / Cotton 90% / Spandex 10% | 유지 |
| Buck Mason | https://www.buckmason.com/products/black-surplus-rib-scoop-neck-tank | Cotton 90% / Elastane 10% | Cotton 90% / Spandex 10% / Cotton 90% / Spandex 10% | 유지 |
| Buck Mason | https://www.buckmason.com/products/white-blue-malibu-stripe-big-oxford-bd-shirt | Cotton 100% | Cotton 100% / Yarn 100% | 유지 |
| Buck Mason | https://www.buckmason.com/products/harbor-stripe-mainstay-cotton-linen-cut-off-short-sleeve-button-down | Cotton 86% / Linen 14% | Cotton 86% / Linen In A 14% | 유지 |
| Buck Mason | https://www.buckmason.com/products/white-khaki-ivy-stripe-big-oxford-bd-shirt | Cotton 100% | Cotton 100% / Yarn 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8938/447360-lola-sparkle-rib-polo/KHAKI_GRN | Cotton 98% | Cotton 98% ‖ Cotton 99% | 유지 |

## 저장 직전 가드가 보류한 혼용률 (6)

이 브랜드의 다른 상품에도 똑같이 되풀이되는 값이라 상품의 소재가 아니라 페이지 틀(메뉴·배너·추천 블록)의 글로 보고
저장하지 않았다(scripts/comp-guard.mjs). 칸은 비어 있고 재시도 기간이 지나면 다시 읽는다.

| 브랜드 | 상품 | 읽은 값 | 이유 |
|---|---|---|---|
| Whitestuff | [LIBBY ORGANIC COTTON SHIRT](https://www.whitestuff.com/p/9420/448337-libby-organic-cotton-shirt/BRIL_WHITE) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [LIBBY ORGANIC COTTON SHIRT](https://www.whitestuff.com/p/9420/448337-libby-organic-cotton-shirt/BLUE_MLT) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [LENA EMBROIDERED SHIRT](https://www.whitestuff.com/p/9444/447536-lena-embroidered-shirt/BLK_MLT) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [JOJO JERSEY SHIRT DRESS](https://www.whitestuff.com/p/9360/448930-jojo-jersey-shirt-dress/DARK_NAVY) | Cotton 100% ‖ Polyester 100% | 여러 줄 값 35개 중 29개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [EMBER RIB POLO](https://www.whitestuff.com/p/8590/447980-ember-rib-polo/NAVY_MULTI) | Cotton 97% / Elastane 3% ‖ Cotton 100% | 여러 줄 값 30개 중 25개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |
| Whitestuff | [MATILDA TOP](https://www.whitestuff.com/p/8541/447010-matilda-top/GREEN_MLT) | Viscose 58% / Cotton 42% ‖ Cotton 100% | 여러 줄 값 30개 중 25개(83%)에 같은 줄 "Cotton 100%" · 짝 7종 |

## 웹 아카이브 층

조회 2/600개(브랜드당 40) · 요청 2회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Buck Mason | 60 | 58 | 0 | 0 | 0 | 0 | 0 | 0 | 3s |
| J crew | 60 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 20s |
| Everlane | 60 | 28 | 0 | 0 | 0 | 0 | 0 | 0 | 6s |
| Dickies | 60 | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 15s |
| Mint velvet | 60 | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 7s |
| Poetry | 60 | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 8s |
| Whitestuff | 60 | 53 | 0 | 0 | 0 | 0 | 0 | 0 | 12s |
| Wilson | 52 | 27 | 0 | 2 | 0 | 0 | 0 | 0 | 7s |
| Spanx | 48 | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 12s |
| Bassike | 41 | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 5s |
| La Ligne | 36 | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 8s |
| Vince | 35 | 33 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |

사유별 개수: 보관본 없음 2

<details><summary>사유별 예시(최대 25개)</summary>

**보관본 없음**

- Wilson — https://custom.wilson.com/en-us/custom/footballs
- Wilson — https://custom.wilson.com/en-us/custom/basketballs

</details>

