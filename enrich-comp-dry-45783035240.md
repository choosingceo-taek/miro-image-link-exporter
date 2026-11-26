# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-26T09:31Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Athleta, Bash, Banana Republic, Buck Mason, Carlhartt, Coldwatercreek, Dickies, Sessun, Everlane, Gap, J crew, Mint velvet, Old Navy, Poetry, Spanx, Vanessa bruno, Whitestuff, Wilson · 못 찾은 이름: oldnavy, athleta, bananarepublic

- 설정: 재시도 창 5일(무시 — RETRY_ALL) · 추출 규칙 판 fc324802 · 한 사이트 요청 간격 2000ms · Worker 우회 끔(측정 — 상품 주소당 요청 3번 이하) · impit 켬

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 4/18개** (상품 1552/5796개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

Bash · Dickies · Old Navy · Poetry

전체 평균은 아직입니다 — 혼용률 83% · 컬러웨이 80%.
기준 95% 까지 861개, 목표 99% 까지 1093개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 5796개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 4802 | 83% | +480 |
| 컬러웨이 | 4646 | 80% | +365 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 800개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (18) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| J crew | — | 62/202 (31%) | 202/202 (100%) | 혼용률 +1 컬러 +1 | 성공 페이지 142·impit 142 |
| Coldwatercreek | — | 71/200 (36%) | 113/200 (56%) | 혼용률 +0 컬러 +0 | 성공 페이지 129 / 실패 껍데기 1 |
| Wilson | — | 29/51 (57%) | 38/51 (75%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 10·페이지 21 / 실패 직접차단 2·보관본없음 2 |
| Athleta | — | 277/407 (68%) | 380/407 (93%) | 혼용률 +0 컬러 +0 | 성공 페이지 130 |
| Gap | — | 333/481 (69%) | 480/481 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 147 / 실패 직접차단 1 |
| Carlhartt | — | 110/148 (74%) | 77/148 (52%) | 혼용률 +0 컬러 +0 | 성공 페이지 35 / 미표기 1 / 실패 직접차단 1·껍데기 1·보관본없음 1 |
| Everlane | — | 335/443 (76%) | 250/443 (56%) | 혼용률 +3 컬러 +5 | 성공 쇼피JSON 111·페이지 111 |
| Spanx | — | 99/120 (83%) | 120/120 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 21 |
| Sessun | — | 242/290 (83%) | 0/290 (0%) | 혼용률 +2 컬러 +0 | 성공 페이지 243 / 실패 직접차단 47·보관본없음 17 |
| Banana Republic | — | 427/510 (84%) | 510/510 (100%) | 혼용률 +65 컬러 +0 | 성공 페이지 148 |
| Whitestuff | — | 593/665 (89%) | 306/665 (46%) | 혼용률 +136 컬러 +350 | 성공 페이지 665·impit 665 |
| Vanessa bruno | — | 176/193 (91%) | 193/193 (100%) | 혼용률 +2 컬러 +0 | 성공 페이지 19 |
| Buck Mason | — | 111/118 (94%) | 117/118 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 7 |
| Mint velvet | — | 404/416 (97%) | 312/416 (75%) | 혼용률 +85 컬러 +9 | 성공 쇼피JSON 99·페이지 99 |
| Poetry | ✅ | 295/303 (97%) | 299/303 (99%) | 혼용률 +55 컬러 +0 | 성공 페이지 59 / 미표기 4 |
| Dickies | ✅ | 259/264 (98%) | 264/264 (100%) | 혼용률 +111 컬러 +0 | 성공 쇼피JSON 116·페이지 10·impit 다시 2 |
| Old Navy | ✅ | 679/684 (99%) | 684/684 (100%) | 혼용률 +15 컬러 +0 | 성공 페이지 20 |
| Bash | ✅ | 300/301 (100%) | 301/301 (100%) | 혼용률 +5 컬러 +0 | 성공 페이지 175 |

## 상품 상세(설명·디테일·사진 전부·컬러 전부) — 이번 실행에서 읽은 브랜드 18개

별도 저장 칸(detail:<site>)에 쌓인다. 상품 수 대비 — 설명 5084 · 디테일 3230 · 사진 4881 · 컬러 전부 2881 / 5796

| 브랜드 | 상품 | 설명 | 디테일 | 사진 | 컬러 전부 | 이번 +N | 가드(설명 보류·글머리표 뺌) | 저장 크기 |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| Old Navy | 684 | 684 | 61 | 684 | 684 | +19 | 0·0 | 872KB |
| Whitestuff | 665 | 484 | 484 | 484 | 0 | +362 | 0·451 | 293KB |
| Banana Republic | 510 | 510 | 230 | 510 | 510 | +6 | 0·0 | 605KB |
| Gap | 481 | 480 | 389 | 480 | 480 | +0 | 0·0 | 687KB |
| Everlane | 443 | 440 | 160 | 443 | 0 | +38 | 0·0 | 476KB |
| Mint velvet | 416 | 298 | 0 | 408 | 0 | +32 | 0·0 | 432KB |
| Athleta | 407 | 407 | 333 | 380 | 380 | +1 | 0·0 | 340KB |
| Poetry | 303 | 303 | 299 | 0 | 0 | +0 | 0·0 | 165KB |
| Bash | 301 | 299 | 299 | 299 | 299 | +169 | 0·168 | 452KB |
| Sessun | 290 | 243 | 243 | 243 | 0 | +0 | 0·0 | 155KB |
| Dickies | 264 | 264 | 213 | 264 | 264 | +47 | 0·0 | 296KB |
| J crew | 202 | 0 | 0 | 0 | 0 | +1 | 0·0 | 26KB |
| Coldwatercreek | 200 | 199 | 199 | 199 | 0 | +120 | 0·0 | 129KB |
| Vanessa bruno | 193 | 131 | 127 | 152 | 0 | +0 | 0·0 | 158KB |
| Carlhartt | 148 | 70 | 71 | 69 | 0 | +5 | 0·0 | 88KB |
| Spanx | 120 | 120 | 0 | 120 | 120 | +0 | 0·0 | 107KB |
| Buck Mason | 118 | 109 | 97 | 109 | 108 | +0 | 0·0 | 114KB |
| Wilson | 51 | 43 | 25 | 37 | 36 | +1 | 0·40 | 121KB |

<details><summary>가드가 뺀 글(브랜드 대부분에 똑같이 붙은 글 — 사이트 공통 문구로 보고 저장하지 않음)</summary>

- Wilson · 글머리표 — product details table · gender women · model number · see all skus
- Whitestuff · 글머리표 — machine washable
- Bash · 글머리표 — do not bleach

</details>

## 껍데기로 센 페이지 예 (2)

차단 화면은 아닌데 카탈로그 상품명이 화면 글에 없어 '사이트 미표기(none)'로 적지 않은 페이지.

- Promotional Banners for Saving on Best Sellers — https://www.coldwatercreek.com/sale/best-sellers-on-sale
  > Best Sellers On Sale / Customer Favorites on Sale / Coldwater Creek · Best Sellers On Sale / Customer Favorites on Sale / Coldwater Creek 25% Off + FREE SHIPPING Your entire order with code CREEK25 &n
- arrow icon — https://www.carhartt.com/en-eu/force-np
  > Force NP / Carhartt · Force NP / Carhartt Skip to Header Skip to Main Content Skip to Footer Carhartt for Business FREE SHIPPING ON ALL ORDERS OVER €75 &nbsp; &nbsp; &nbsp; &nbsp; Shop All Men Women A

## 혼용률이 엇갈린 상품 (84)

지금 페이지에서 읽은 값이 이미 있던 값과 다르다. 보관본 값이었으면 지금 페이지 값으로 바꿨고(바꿈),
지금 페이지에서 읽었던 값이면 그대로 뒀다(유지).

| 브랜드 | 상품 | 있던 값 | 지금 페이지 | 처리 |
|---|---|---|---|---|
| Sessun | https://us.sessun.com/catalogue/shirt-and-blouses/lylee-navy-domiu.html | Viscose 82% / Silk 16% | Viscose 82% / Silk 16% / Metallic 2% | 유지 |
| Sessun | https://us.sessun.com/catalogue/shirt-and-blouses/duchess-coffea-domiu.html | Viscose 82% / Silk 16% | Viscose 82% / Silk 16% / Metallic 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8590/447980-ember-rib-polo/NAVY_MULTI | Cotton 97% / Elastane 3% ‖ Cotton 100% | Cotton 97% / Elastane 3% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7267/nelly-embroidered-t-shirt/MID_BLUE | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8938/447360-lola-sparkle-rib-polo/PURE_BLK | Cotton 98% ‖ Cotton 99% | Cotton 98% / Metallic 2% ‖ Cotton 99% / Metallic 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8938/447360-lola-sparkle-rib-polo/KHAKI_GRN | Cotton 98% | Cotton 98% / Metallic 2% ‖ Cotton 99% / Metallic 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8541/447010-matilda-top/GREEN_MLT | Viscose 58% / Cotton 42% ‖ Cotton 100% | Viscose 58% / Cotton 42% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9001/447142-eleanor-poet-top/BLK_MLT | Viscose 100% | Viscose 100% ‖ Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6900/annie-broderie-collared-jersey-shirt/BRIL_WHITE | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6242/sophie-collared-organic-cotton-shirt/DARK_NAVY | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6242/sophie-collared-organic-cotton-shirt/BLUE_MLT | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6834/womens-annie-collared-shirt-jersey/WHITE_PR | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8975/447531-fleur-tie-neck-top/NAVY_MULTI | Cotton 100% | Cotton 100% ‖ Modal 51% / Viscose 49% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8984/447364-lola-sparkle-roll-neck/PURE_BLK | Cotton 96% / Elastane 2% ‖ Cotton 95% / Elastane 3% | Cotton 96% / Elastane 2% / Metallic 2% ‖ Cotton 95% / Elastane 3% / Metallic 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8984/447364-lola-sparkle-roll-neck/DK_TEAL | Cotton 96% / Elastane 2% ‖ Cotton 95% / Elastane 3% | Cotton 96% / Elastane 2% / Metallic 2% ‖ Cotton 95% / Elastane 3% / Metallic 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8899/447143-wren-embroidered-cord-top/BLK_MLT | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8688/446745-lucie-crew-neck-jumper/BRT_RED | Acrylic 47% / Polyester 32% / Cotton 19% | Polyester 51% / Acrylic 22% / Cotton 19% / Wool 7% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8688/446745-lucie-crew-neck-jumper/BLUE_MLT | Acrylic 47% / Polyester 32% / Cotton 19% | Polyester 51% / Acrylic 22% / Cotton 19% / Wool 7% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8974/447457-sienna-sparkle-jumper/NAVY_MULTI | Cotton 50% / Lyocell 27% / Modal 19% / Polyester 4% | Cotton 50% / Modal 27% / Polyester 19% / Metallic 4% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/5966/olive-long-sleeve-crew-neck-jumper/DUS_GREEN | Cotton 55% / Lyocell 30% / Polyester 15% | Cotton 55% / Modal 30% / Polyester 15% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/5966/olive-long-sleeve-crew-neck-jumper/DK_CHART | Cotton 55% / Lyocell 30% / Polyester 15% | Cotton 55% / Modal 30% / Polyester 15% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8607/447731-talia-colourblock-jumper/PLUM_MLT | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | Polyester 32% / Cotton 19% / Acrylic 47% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8997/447665-talia-fairisle-jumper/TEAL_MLT | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9162/447461-lois-fairisle--cardi/PINK_MLT | Cotton 100% ‖ Cotton 98% / Polyester 1% | Cotton 98% / Polyester 1% / Metallic 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8941/447660-talia-nep-high-neck-jumper/LGT_GREY | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8941/447660-talia-nep-high-neck-jumper/DK_TEAL | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8941/447660-talia-nep-high-neck-jumper/MID_GREEN | Polyester 31% / Cotton 20% / Acrylic 47% | Acrylic 47% / Polyester 32% / Cotton 19% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8456/447310-borg-zip-through/NAVY_MULTI | Polyester 100% ‖ Nylon 100% | Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9054/447880-libby-organic-cotton-shirt/DK_PLUM | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8211/447006-libby-organic-cotton-shirt/BRT_PINK | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8606/448002-annie-embroidered-shirt/MID_BLUE | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8606/448002-annie-embroidered-shirt/MID_PINK | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8606/448002-annie-embroidered-shirt/DK_GREEN | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9016/448556-annie-jersey-shirt/PLUM_MLT | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8282/447014-libby-organic-cotton-shirt/DARK_NAVY | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9247/447713-lena-embroidered-shirt/IVORY_MLT | Viscose 97% ‖ Polyester 100% | Viscose 97% / Metallic 3% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7945/megan-embroidered-short-sleeve-jersey-dress/MID_BLUE | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7945/megan-embroidered-short-sleeve-jersey-dress/KHAKI_GRN | Cotton 100% / Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8961/447557-ruby-roll-neck-sparkle-dress/CHARC_GREY | Cotton 95% / Elastane 3% | Cotton 95% / Elastane 3% / Metallic 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9015/447972-vice-velvet-mix-dress/DK_BROWN | Polyester 59% / Viscose 40% ‖ Viscose 75% / Nylon 25% | Viscose 75% / Nylon 25% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8540/447853-leah-jersey-dress/BLK_PR | Cotton 50% / Lyocell 50% | Cotton 50% / Modal 50% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8527/447040-megan-embroidered-jersey-dress/DK_GREEN | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9296/447551-eleanor-poet-dress/NAVY_MULTI | Lyocell 51% / Modal 49% | Modal 51% / Viscose 49% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9234/447564-harper-embroidery-jersey-dress/PURE_BLK | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9013/447549-ada-shirred-dress/BLK_MLT | Cotton 97% / Polyester 1% | Cotton 97% / Metallic 2% / Polyester 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8752/448503-reegan-jersey-dress/BLK_PR | Cotton 51% / Modal 49% ‖ Cotton 100% | Cotton 51% / Modal 49% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8752/448503-reegan-jersey-dress/GREEN_MLT | Cotton 51% / Modal 49% ‖ Cotton 100% | Cotton 51% / Modal 49% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8577/448505-reegan-jersey-dress/DARK_NAVY | Cotton 98% / Elastane 2% ‖ Cotton 100% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9404/447976-poppy-palazzo-velvet-jumpsuit/BLK_MLT | Viscose 73% / Nylon 25% | Viscose 73% / Nylon 25% / Metallic 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9047/447047-lucy-embroidered-cord-dress/DUS_PINK | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9108/447541-cece-jersey-mix-dress/DK_TEAL | Viscose 100% ‖ Cotton 57% / Polyester 38% / Elastane 5% | Viscose 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9168/447550-leah-jersey-dress/BROWN_PR | Cotton 50% / Lyocell 50% | Cotton 50% / Modal 50% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8775/447850-ada-shirred-dress/BROWN_PR | Cotton 50% / Lyocell 50% | Cotton 50% / Lyocell 50% ‖ Cotton 50% / Modal 50% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8775/447850-ada-shirred-dress/BLK_PR | Cotton 50% / Lyocell 50% | Cotton 50% / Lyocell 50% ‖ Cotton 50% / Modal 50% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8530/448504-matilda-dress/GREEN_MLT | Viscose 58% / Cotton 42% ‖ Cotton 100% | Viscose 58% / Cotton 42% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8327/448287-harper-jersey-dress/NAVY_MULTI | Cotton 52% / Modal 48% | Cotton 52% / Modal 48% ‖ Cotton 51% / Modal 49% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8327/448287-harper-jersey-dress/GREEN_PR | Cotton 52% / Modal 48% | Cotton 52% / Modal 48% ‖ Cotton 51% / Modal 49% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8604/447892-sloane-dress/DK_GREEN | Viscose 100% ‖ Polyester 100% | Viscose 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8353/carter-mix-sweat-dress/DARK_NAVY | Cotton 100% / Viscose 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8542/447053-easton-swing-dress/BROWN_PR | Viscose 58% / Cotton 42% ‖ Cotton 100% | Viscose 58% / Cotton 42% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8742/447323-sole-jersey-dress/DK_PLUM | Cotton 50% / Modal 50% | Cotton 60% / Modal 40% ‖ Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8533/447043-dakota-jersey-mix-dress/BROWN_MLT | Cotton 95% / Elastane 5% ‖ Cotton 100% | Cotton 95% / Elastane 5% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8640/447054-sole-jersey-dress/PURE_BLK | Cotton 100% | Cotton 60% / Modal 40% ‖ Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9000/447059-annika-embroidered-cord-dress/DK_RED | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8641/447695-gracie-twist-dress/MID_GREEN | Cotton 51% / Modal 49% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8846/447134-winnie-embroidered-dress/DK_BROWN | Cotton 100% ‖ Polyester 100% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7138/shay-jersey-mix-dress/NAVY_MULTI | Cotton 100% / Elastane 3% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7138/shay-jersey-mix-dress/KHAKI_GRN | Cotton 100% ‖ Cotton 97% / Elastane 3% | Cotton 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8534/446863-belle-tweedy-wide-leg-trouser/GREY_MLT | Cotton 97% / Polyester 2% / Elastane 1% | Cotton 97% / Polyester 2% / Elastane 1% ‖ Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9345/447655-ayla-velvet-stripe-jean/DK_GREY | Cotton 99% ‖ Cotton 99% / Elastane 1% | Cotton 99% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8528/447149-belle-tweedy-wide-leg-trouser/NAVY_MULTI | Polyester 66% / Wool 28% / Viscose 5% / Elastane 1% | Polyester 66% / Wool 28% / Viscose 5% / Elastane 1% ‖ Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8898/447399-tia-cord-wide-leg-trouser/DK_PLUM | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8898/447399-tia-cord-wide-leg-trouser/NAT_WHITE | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/8529/447717-belle-tweedy-wide-leg-trouser/BROWN_MLT | Polyester 66% / Wool 28% / Viscose 5% / Elastane 1% | Polyester 66% / Wool 28% / Viscose 5% / Elastane 1% ‖ Polyester 100% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/5526/twister-chino-wide-leg-trouser/DARK_NAVY | Cotton 66% / Linen 18% / Viscose 15% / Elastane 1% | Cotton 67% / Linen 18% / Viscose 14% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9124/447398-tia-cord-wide-leg-trouser/PURE_BLK | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9406/448742-bianca-bootcut-cord-trousers/PURE_BLK | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9406/448742-bianca-bootcut-cord-trousers/DK_BROWN | Cotton 98% ‖ Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/9405/447656-aubrey-metallic-stripe-jean/BLK_MLT | Cotton 65% / Polyester 28% / Viscose 5% / Elastane 1% | Cotton 65% / Polyester 28% / Viscose 5% / Metallic 1% / Elastane 1% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7144/margot-legging/PURE_BLK | Cotton 48% / Lyocell 44% / Elastane 8% | Cotton 48% / Modal 44% / Elastane 8% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/7144/margot-legging/DARK_NAVY | Cotton 48% / Lyocell 44% / Elastane 8% | Cotton 48% / Modal 44% / Elastane 8% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6700/faye-devore-velvet-dress/BLK_MLT | Viscose 63% / Nylon 32% ‖ Viscose 85% / Nylon 15% | Viscose 63% / Nylon 32% / Metallic 5% ‖ Viscose 85% / Nylon 15% | 유지 |
| Whitestuff | https://www.whitestuff.com/p/6814/belle-velvet-wide-leg-trouser/DK_CHART | Viscose 71% / Nylon 25% | Viscose 71% / Nylon 25% / Metallic 4% | 유지 |
| Bash | https://ba-sh.com/fr/en/p/trousers-twani-beige-3667436091698.html | Wool 14% / Polyester 59% / Viscose 26% | Polyester 59% / Viscose 26% / Wool 14% / Elastane 1% | 유지 |

## 브랜드별 표본 — 사람이 열어 확인할 것

채운 것: 이번에 읽은 값 · 출처 · 그 값을 페이지 글에서 다시 찾은 자리(추출기와 따로 찾음 — 못 찾으면 비어 있다).
빈 것: 페이지는 읽었는데 혼용률이 없던 상품(사이트 미표기로 적었을 것). 못 읽음: 막힘·껍데기·값 없음.

### Athleta — 채움 0 · 빈 것 130 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=845688002
- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=659287752
- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=659287002

### Banana Republic — 채움 65 · 빈 것 83 · 못 읽음 0

- ✅ https://bananarepublic.gap.com/browse/product.do?pid=1203518002
  - 값: **Viscose 99% / Elastane 1%** (본문)
  - 페이지 글: (다시 찾지 못함)
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=1183816012
  - 값: **Viscose 99% / Elastane 1%** (본문)
  - 페이지 글: (다시 찾지 못함)
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=1203515002
  - 값: **Viscose 99% / Elastane 1%** (본문)
  - 페이지 글: (다시 찾지 못함)
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=1203875012
  - 값: **Viscose 99% / Elastane 1%** (본문)
  - 페이지 글: (다시 찾지 못함)
- ✅ https://bananarepublic.gap.com/browse/product.do?pid=1203517002
  - 값: **Viscose 99% / Elastane 1%** (본문)
  - 페이지 글: (다시 찾지 못함)
- ⬜ 빈 것(컬러·가격만) · https://bananarepublic.gap.com/browse/product.do?pid=1180190002
- ⬜ 빈 것(컬러·가격만) · https://bananarepublic.gap.com/browse/product.do?pid=1180190012
- ⬜ 빈 것(컬러·가격만) · https://bananarepublic.gap.com/browse/product.do?pid=1180136002

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

- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/white-big-tuxedo-shirt
- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/natural-sea-breeze-linen-coastline-cami
- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/dusty-maize-draped-twill-cpo-shirt

### Carlhartt — 채움 0 · 빈 것 36 · 못 읽음 2

- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/c/best-sellers
- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt
- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt
- ⛔ 막힘(fetch,impit) · https://www.carhartt.com/product/107872/womens-paxton-quilted-shirt-jac
- ⛔ 막힘·껍데기 · https://www.carhartt.com/en-eu/force-np

### Coldwatercreek — 채움 1 · 빈 것 128 · 못 읽음 1

- ✅ https://www.coldwatercreek.com/leaf-embroidered-tee/20985/
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …etites 24”; Women’s 27&quot; Crewneck Hits mid hip Relaxed fit Long sleeves Fabric & Care 100% cotton Machine wash Imported Share Share on Facebook Share on Pinterest Share on Email Print page Close modal &#215;…
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/wintertide-waffle-tee/22279/
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/snowflake-tapestry-burnout-tee/26140/
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/follow-your-heart-tunic/22475/
- ⛔ 막힘·껍데기 · https://www.coldwatercreek.com/sale/best-sellers-on-sale

### Dickies — 채움 111 · 빈 것 5 · 못 읽음 0

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
- ⬜ 빈 것(컬러·가격만) · https://www.dickies.com/products/dk-dynamix-mid-rise-straight-leg-drawstring-pant-dk130-blk
- ⬜ 빈 것(컬러·가격만) · https://www.dickies.com/products/dk-dynamix-mid-rise-straight-leg-drawstring-pant-dk130-nav
- ⬜ 빈 것(컬러·가격만) · https://www.dickies.com/products/dk-dynamix-mid-rise-straight-leg-drawstring-pant-dk130-pwt

### Everlane — 채움 3 · 빈 것 108 · 못 읽음 0

- ✅ https://www.everlane.com/products/womens-utility-cigarette-pant-black
  - 값: **Cotton 97% / Elastane 3%** (본문)
  - 페이지 글: 화면 글: …Check out our sizing FAQs or contact us . CHAT WITH AN EXPERT Materials & Care Materials: 97% Organic Cotton 3% Elastane Why It&#39;s Better This style is made with 97% organic cotton, certified to the Organic Content…
- ✅ https://www.everlane.com/products/womens-utility-cigarette-pant-olive-night
  - 값: **Cotton 97% / Elastane 3%** (본문)
  - 페이지 글: 화면 글: …Check out our sizing FAQs or contact us . CHAT WITH AN EXPERT Materials & Care Materials: 97% Organic Cotton 3% Elastane Why It&#39;s Better This style is made with 97% organic cotton, certified to the Organic Content…
- ✅ https://www.everlane.com/products/womens-utility-cigarette-pant-bone
  - 값: **Cotton 97% / Elastane 3%** (본문)
  - 페이지 글: 화면 글: …Check out our sizing FAQs or contact us . CHAT WITH AN EXPERT Materials & Care Materials: 97% Organic Cotton 3% Elastane Why It&#39;s Better This style is made with 97% organic cotton, certified to the Organic Content…
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-100-my-body-box-cut-tee-white
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-full-zip-hoodie-in-wool-cashmere-oatmeal
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-funnel-sweater-wool-cashmere-oatmeal

### Gap — 채움 0 · 빈 것 147 · 못 읽음 1

- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=1180261062
- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=1180261142
- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=523562322
- ⛔ 막힘(fetch,impit) · https://www.gap.com/browse/new/gap-hoodie-shop

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

### Mint velvet — 채움 87 · 빈 것 12 · 못 읽음 0

- ✅ https://mintvelvet.com/products/black-knit-sheer-sleeve-zip-detail-top
  - 값: **Nylon 52% / Viscose 48% ‖ Lyocell 84% / Polyester 16%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 52% polyamide, 48% viscose,main 2, 84% lyocell, 16% polyester " ,"text_alignment": "left" ,"override_color_options": false…
- ✅ https://mintvelvet.com/products/cream-draped-asymmetric-top
  - 값: **Elastane 4% / Nylon 31% / Viscose 65% ‖ Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 4% elastane, 31% polyamide, 65% viscose,main 2, 100% polyester " ,"text_alignment": "left" ,"override_color_options": fal…
- ✅ https://mintvelvet.com/products/black-draped-asymmetric-top-1
  - 값: **Elastane 4% / Nylon 31% / Viscose 65% ‖ Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 4% elastane, 31% polyamide, 65% viscose,main 2, 100% polyester " ,"text_alignment": "left" ,"override_color_options": fal…
- ✅ https://mintvelvet.com/products/black-velvet-butterfly-detail-top
  - 값: **Nylon 29% / Viscose 71% ‖ Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 29% polyamide, 71% viscose,lining, 100% polyester " ,"text_alignment": "left" ,"override_color_options": false ,"text_colou…
- ✅ https://mintvelvet.com/products/gold-sequin-waistcoat
  - 값: **Polyester 89% / Cotton 2% / Metallic 7% / Viscose 2% ‖ Elastane 3% / Polyester 97%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 89% recycled polyester, 2% cotton, 7% metallised fibre, 2% viscose,trim, 22% polyamide, 78% viscose,lining, 3% elastane, 97% polyest…
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/burgundy-swan-print-shirt
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/burgundy-lace-detail-mini-dress
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/black-velvet-cape-detail-maxi-dress

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
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poest/shirts-and-tunics
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poeds/dresses-and-skirts
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poetj/trousers

### Sessun — 채움 242 · 빈 것 1 · 못 읽음 47

- ✅ https://en.sessun.com/catalogue/t-shirts/dorel-ambrune.html
  - 값: **Lyocell 67% / Cotton 33%** (본문)
  - 페이지 글: 화면 글: …n and care Round neck. Dropped shoulders. Short sleeves. Deliberately cropped silhouette. 67% Lyocell, 33% cotton Made in Portugal Need help? We're available by email: hello@sessun.com or by telephone at +334 86…
- ✅ https://en.sessun.com/catalogue/t-shirts/sergio-rosee.html
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …75 cm and is wearing an S. Find your size Composition and care Round neck. Short sleeves. 100% Cotton Made in Portugal Wring out and dry flat on a flat surface in the shade. Need help? We're available by email:…
- ✅ https://en.sessun.com/catalogue/t-shirts/dimentica-fleur-de-sel.html
  - 값: **Lyocell 67% / Cotton 33%** (본문)
  - 페이지 글: 화면 글: …your size Composition and care Round neck. Dropped shoulders with wide cuffs. Sleeveless. 67% Lyocell, 33% cotton Made in Portugal Need help? We're available by email: hello@sessun.com or by telephone at +334 86…
- ✅ https://en.sessun.com/catalogue/t-shirts/erico-lava.html
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …ewelled button at the base of the collar. Short sleeves. Deliberately cropped silhouette. 100% Cotton Made in Portugal Need help? We're available by email: hello@sessun.com or by telephone at +334 86 06 36 04 Di…
- ✅ https://en.sessun.com/catalogue/t-shirts/serge-red-muse.html
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …75 cm and is wearing an S. Find your size Composition and care Round neck. Short sleeves. 100% Cotton Made in Portugal Need help? We're available by email: hello@sessun.com or by telephone at +334 86 06 36 04 Di…
- ⬜ 빈 것(컬러·가격만) · https://en.sessun.com/catalogue/trousers/carlea-black.html
- ⛔ 막힘(fetch,impit) · https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-025.webp%20924w
- ⛔ 막힘(fetch,impit) · https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-028.webp%20924w
- ⛔ 막힘(fetch,impit) · https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_blazer_blue-Karty_bluenim-027.webp%20924w

### Spanx — 채움 0 · 빈 것 21 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://spanx.com/products/spanx-ponte-jacquard-tailored-vest?v=48685653852371&bau-context=standard&Color=Timeless+Navy+Gingham
- ⬜ 빈 것(컬러·가격만) · https://spanx.com/products/spanx-boostup-cropped-square-neck-shelf-tank?v=48685694746835&bau-context=standard&Color=Vino+Polka+Dot
- ⬜ 빈 것(컬러·가격만) · https://spanx.com/products/spanx-bodyline-high-neck-cropped-tank-with-flexform-cups?v=48685376143571&bau-context=standard&Color=Anthracite

### Vanessa bruno — 채움 2 · 빈 것 17 · 못 읽음 0

- ✅ https://www.vanessabruno.com/p/haldo-embroidered-blouse-54343.html
  - 값: **Viscose 100%** (본문)
  - 페이지 글: 화면 글: …sers. Wear the collar open for a more relaxed look. Ref : 6HVA32-V09929-003 Composition : 100% viscose. Secondary fabric 100% cotton. Embroidery 100% polyester Origin: India Features: • Embroidered viscose blouse…
- ✅ https://www.vanessabruno.com/p/hora-blouse-53937.html
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …ankle boots, or a plain long skirt at the weekend. Ref : 6HVA27-V09920-048 Composition : 100% cotton / tertiary fabric 62% cotton, 38% polyester / embroidery 100% polyester / lace 62% cotton, 38% polyester Orig…
- ⬜ 빈 것(컬러·가격만) · https://www.vanessabruno.com/new-in/new-bags-cabas-tote.html
- ⬜ 빈 것(컬러·가격만) · https://www.vanessabruno.com/bags/daily-tote.html
- ⬜ 빈 것(컬러·가격만) · https://www.vanessabruno.fr/nouveautes/nouveautes-sacs-cabas.html

### Whitestuff — 채움 649 · 빈 것 16 · 못 읽음 0

- ✅ https://www.whitestuff.com/p/7379/nelly-cotton-notch-neck-t-shirt/TEAL_PR
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …and comes with a notch-neck detail. Because, you know. It’s top notch. Product ID: 446179 100% Cotton Model wears a size 10 and is 5'9&quot;/175cm Size 12 high shoulder neck point to hem approx. 62CM Notch Neck…
- ✅ https://www.whitestuff.com/p/1303/nelly-notch-neck-tee/NAT_WHITE
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …It&rsquo;s top notch. Shop all Nelly Tees Style with these Accessories Product ID: 438430 100% Cotton Size 12 high shoulder neck point to hem approx. 62CM Notch Neck Short Sleeve Regular fit Machine Washable DEL…
- ✅ https://www.whitestuff.com/p/1303/nelly-notch-neck-tee/DARK_NAVY
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …It&rsquo;s top notch. Shop all Nelly Tees Style with these Accessories Product ID: 438430 100% Cotton Size 12 high shoulder neck point to hem approx. 62CM Notch Neck Short Sleeve Regular fit Machine Washable DEL…
- ✅ https://www.whitestuff.com/p/6974/nelly-notch-texture-tee/MID_BLUE
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …elect size Find in store DETAILS Notch your average tee. No, really. This one’s made with 100% cotton and comes with a notch-neck detail. And slight texture in the fabric. Product ID: 445788 100% Cotton Model we…
- ✅ https://www.whitestuff.com/p/6974/nelly-notch-texture-tee/LGT_YELLOW
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …elect size Find in store DETAILS Notch your average tee. No, really. This one’s made with 100% cotton and comes with a notch-neck detail. And slight texture in the fabric. Product ID: 445788 100% Cotton Model we…
- ⬜ 빈 것(컬러·가격만) · https://www.whitestuff.com/p/7119/nelly-notch-neck-short-sleeve-t-shirt/MID_PINK
- ⬜ 빈 것(컬러·가격만) · https://www.whitestuff.com/p/8444/446604-izzy-striped-collar-jumper/NAT_MLT
- ⬜ 빈 것(컬러·가격만) · https://www.whitestuff.com/p/8422/447103-ronley-shirt/GREEN_PR

### Wilson — 채움 0 · 빈 것 21 · 못 읽음 2

- ⬜ 빈 것(컬러·가격만) · https://www.wilson.com/en-us/collections/deals-golf
- ⬜ 빈 것(컬러·가격만) · https://www.wilson.com/en-us/collections/holiday-edit
- ⬜ 빈 것(컬러·가격만) · https://www.wilson.com/en-us/collections/mens-holiday-edit
- ⛔ 막힘(fetch,impit) · https://custom.wilson.com/en-us/custom/footballs
- ⛔ 막힘(fetch,impit) · https://custom.wilson.com/en-us/custom/basketballs

## 웹 아카이브 층

조회 20/600개(브랜드당 40) · 요청 20회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Whitestuff | 665 | 649 | 0 | 0 | 0 | 0 | 0 | 0 | 2658s |
| Sessun | 290 | 242 | 0 | 17 | 0 | 0 | 0 | 30 | 640s |
| Bash | 175 | 174 | 0 | 0 | 0 | 0 | 0 | 0 | 350s |
| Banana Republic | 148 | 65 | 0 | 0 | 0 | 0 | 0 | 0 | 461s |
| Gap | 148 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 592s |
| J crew | 142 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 566s |
| Athleta | 130 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 520s |
| Coldwatercreek | 130 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 514s |
| Dickies | 116 | 111 | 0 | 0 | 0 | 0 | 0 | 0 | 265s |
| Everlane | 111 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 659s |
| Mint velvet | 99 | 87 | 0 | 0 | 0 | 0 | 0 | 0 | 418s |
| Poetry | 63 | 55 | 0 | 0 | 0 | 0 | 0 | 0 | 141s |
| Carlhartt | 38 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 90s |
| Wilson | 23 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 99s |
| Spanx | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 167s |
| Old Navy | 20 | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 49s |
| Vanessa bruno | 19 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 30s |
| Buck Mason | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 53s |

사유별 개수: 보관본 없음 20 · 주소: 카테고리 경로 1

<details><summary>사유별 예시(최대 25개)</summary>

**보관본 없음**

- Carlhartt — https://www.carhartt.com/product/107872/womens-paxton-quilted-shirt-jac
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_black_granit-006_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Inea_black-Gilda_murza-0301.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Inea_black-Gilda_murza-0201.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Pova_brownwhisky-011_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Pova_brownwhisky-001_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/RTCH_WXL_Chebbi_Ganache-Dalt_espresso-025_1_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Olivieira_marble_rose-046.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Olivieira_marble_rose-022.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/RTCH_WXL_Chebbi_Ganache-Dalt_espresso-020_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_ballerina-003.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_ballerina-039.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_vivapurple-036_rtch.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_vivapurple-038_rtch.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_wild_lila-Vega_optical_white-RTCH-008_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_wild_lila-Vega_optical_white-RTCH-018_RTCH.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Oliveira_lilastone-059.webp%20924w
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Oliveira_lilastone-007.webp%20924w
- Wilson — https://custom.wilson.com/en-us/custom/footballs
- Wilson — https://custom.wilson.com/en-us/custom/basketballs

**주소: 카테고리 경로**

- Gap — https://www.gap.com/browse/new/gap-hoodie-shop

</details>

