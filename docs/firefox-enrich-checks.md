# 파이어폭스 혼용률 보강 — 데이터 정확성 점검 (2026-11-24)

새 엔진(그냥 Playwright 파이어폭스)으로 혼용률을 읽기 전에 찾은 네 가지 문제와 고친 내용,
그리고 GitHub Actions 에서 읽기만 해서(저장 안 함) 확인한 결과다. 기준은 하나다 —
**틀린 값이 저장되는 것은 빈 값보다 나쁘다.**

## 1. Zara 혼용률이 틀리게 읽힘

### 무엇이 섞였나

파이어폭스로 연 Zara 면 티셔츠가 "Wool 100% / Cotton 100%" 로 읽혔다(파이어폭스 계열 엔진 모두).
덤프(`try-engines.mjs` DUMP=1)로 본 원인: 울 100% 는 상품 소재가 아니라 **숨은 메뉴의 기획전 이름**이다.

```
nav.layout-categories > … > li.layout-categories-category--level-3 > a > span.layout-categories-category-name__label
「02 FEATURED EDITS PARTYWEAR 100% WOOL | CASHMERE 03 COLLECTION BEST SELLERS …」   (화면에 안 보임)
```

진짜 소재는 3,000자쯤 뒤에 있다(RUSTIC COTTON T-SHIRT):
`T-shirt with main fabric made of 100% cotton yarn.` / `Composition: 100% cotton`.
추출기(compWindow)가 첫 "퍼센트+섬유"(메뉴)에서 4000자 창을 열어 둘 다 담았고, compFromText 가
각각을 한 벌(100%)로 보고 겉감/안감처럼 두 줄로 묶었다. validComp 는 줄마다 100% 라 통과했다.

### 고친 규칙(worker/fabric-extractor.js 한 벌 + 확장 사본, 사이트 예외 없음)

1. `<nav>`·`<template>` 안의 글은 소재로 읽지 않는다.
2. 창은 "Composition·Materials·Fabric·Content·Outer shell·Lining·소재·혼용률" 제목이 바로 앞에 붙은
   자리부터 연다(없으면 예전처럼 첫 자리).
3. 두 줄(두 원단)은 300자 안에 붙어 있거나 둘 다 부위 이름(OUTER SHELL·LINING·MAIN·CONTRAST·겉감·안감 …)이
   붙어 있을 때만. 아니면 어느 쪽이 맞는지 모르므로 **빈 값**.

### 전후

| 페이지 | 고치기 전(45305293020) | 고친 뒤(45325039271) | 보관본 |
|---|---|---|---|
| rustic-cotton-t-shirt p04424306 | Wool 100% / Cotton 100% | Cotton 100% | Cotton 100% |
| boat-neck-t-shirt p04424640 | Wool 100% / Cotton 100% | Cotton 100% | Cotton 100% |
| washed-crepe-100-cotton-t-shirt p04424641 | Cotton 100% / Wool 100% | Cotton 100% | 없음 |

재킷(두 겹) 실측(45322290169, 고치기 전): STRETCH ZIP-UP HOODIE JACKET 은
`OUTER SHELL 82% polyamide 18% elastane LINING 82% polyamide 18% elastane` — 이제 "Nylon 82% / Elastane 18%"
(겉감=안감이라 한 줄). FITTED ZIP-UP JACKET 은 "Modal 49% / Polyester 45% / Elastane 6%".

### Zara 30개(45324955886, 파이어폭스, 저장 안 함) — 30/30

| 상품명 | 혼용률 | 메모 |
|---|---|---|
| SUPIMA® LONG SLEEVE T-SHIRT | Cotton 100% | |
| COTTON-MODAL PLAIN T-SHIRT | Cotton 47% / Modal 47% / Elastane 6% | |
| LONG SLEEVE HENLEY T-SHIRT | Cotton 95% / Elastane 5% | 보관본과 같음 |
| BOAT NECK T-SHIRT (p04424640) | Cotton 100% | 보관본과 같음 |
| SEAMLESS JACQUARD THERMAL T-SHIRT SKI COLLECTION | Nylon 60% / Polyester 30% / Elastane 10% | |
| RIBBED TANK TOP | Cotton 95% / Elastane 5% | |
| SHORT SLEEVE INTERLOCK T-SHIRT | Cotton 100% | |
| RUSTIC COTTON T-SHIRT | Cotton 100% | |
| OVERSIZED TEXT T-SHIRT | Cotton 100% | |
| TURTLENECK T-SHIRT | Modal 48% / Cotton 47% / Elastane 5% | |
| DOUBLE LAYER T-SHIRT | Viscose 52% / Polyester 48% | |
| INTERLOCK LONG-SLEEVE T-SHIRT | Cotton 100% | |
| OVERSIZED FLAME T-SHIRT | Cotton 100% | |
| OVERSIZED STRIPED T-SHIRT | Cotton 100% | |
| CONTRAST COLLAR STRIPED POLO | Cotton 100% | |
| LYOCELL T-SHIRT | Lyocell 76% / Silk 19% / Elastane 5% | |
| LYOCELL RAGLAN SLEEVE T-SHIRT | Lyocell 76% / Silk 19% / Elastane 5% | |
| PIQUÉ MOCK NECK T-SHIRT | Polyester 98% / Elastane 2% | |
| HIGH-NECK MIXED T-SHIRT | Polyester 55% / Cotton 45% ‖ Cotton 100% | 두 줄 — "mixed"(배색 원단) 상품이라 그럴 법함, 눈으로 확인 권함 |
| RIBBED BUTTON T-SHIRT | Cotton 95% / Elastane 5% | |
| STRIPED SHORT SLEEVE T-SHIRT | Cotton 100% | |
| Long-Sleeve Ribbed T-Shirt | Cotton 48% / Modal 48% / Elastane 4% | |
| HENLEY T-SHIRT | Cotton 100% | |
| BOAT NECK T-SHIRT (p01058805) | Polyester 65% / Lyocell 28% / Elastane 7% | |
| EMBROIDERED POCKET RIPPED T-SHIRT | Cotton 100% | |
| WIDE SLEEVE STRIPED T-SHIRT | Cotton 100% | |
| RIB KNIT MOCK NECK T-SHIRT | Cotton 48% / Modal 48% / Elastane 4% | |
| V-NECK T-SHIRT | Cotton 100% | |
| RIBBED BUTTON-UP T-SHIRT | Cotton 48% / Modal 48% / Elastane 4% | |
| RIBBED SCOOP NECK T-SHIRT | Cotton 79% / Viscose 15% / Elastane 6% | |

이름에 섬유가 있는데 다른 섬유를 읽은 상품은 없다(리포트의 ⚠ 검사).

### 다른 브랜드(45324141764 덤프, 고친 추출기)

- Massimo Dutti: Lyocell 70/Wool 30 · Cotton 93/Cashmere 7(JSON 의 detailedComposition 과 같음). 나머지는
  소재가 스크립트 JSON(`"material":"cotton","percentage":"93%"`)에만 있어 못 읽음 — 틀린 값은 없음.
  메뉴에 "WOOL | CASHMERE" 가 있지만 퍼센트가 없어 섞이지 않는다.
- Patagonia: Cotton 100 · Wool 65/Polyester 35 · Polyester 85/Lyocell 15(뒤 둘은 보관본과 같음).
- Aritzia: 3 차단(Just a moment) · 1 열림(소재 못 찾음). Chico's: 4/4 차단(그 러너). 섞인 값 없음.

## 2. 거짓 '사이트 미표기(none)'

### 새 규칙: none 은 "이 상품의 본문이 그려진 페이지"에서만

카탈로그 상품명의 낱말 60% 이상이 화면 글(제목 제외)에 있어야 한다. 상품명이 없으면 JSON-LD Product /
og:type product 와 글 600자. 아니면 '껍데기'로 세고 none 을 적지 않는다(야간 fetch: 아카이브도 물어봄,
크롬 보강: 차단과 같이 셈). 규칙은 `scripts/enrich-comp.mjs` 의 productRead 한 벌, 크롬 보강은 그 구간을 떼어 쓴다.

Patagonia 의 "1,017자 페이지"는 점검 안내 화면이었다:
`Patagonia Outdoor Clothing & Gear — We’re working on it. System maintenance is in progress …`
(차단 문구 없음·600자 넘음 → 예전 realPage 는 '읽음' → none). 지금은 껍데기.

### none 을 누가 적었나(nv)

`nv` = none 을 적은 읽기 방식(fetch · chromium · firefox, 쉼표로). nv 없는 예전 none 은 fetch·크롬 몫.
크롬 보강은 지금 엔진이 nv 에 없을 때만 다시 열고, 역시 없으면 nv 에 더한다(엔진마다 상품당 한 번).
auto 는 크롬으로는 할 일이 없지만 파이어폭스가 안 본 none 이 30개 넘는 브랜드를 파이어폭스로 한 번 본다.

### 실측(파이어폭스, 저장 안 함)

| 실행 | 브랜드 | 탭 | 시도 | 읽음 | none | 껍데기 | 차단 |
|---|---|---|---:|---:|---:|---:|---:|
| 45324955886 | Patagonia | 4 | 30 | 0 | 0 | 30(전부 점검 화면) | 0 |
| 45325999540 | Patagonia | 1·2초 | 20 | 5 | 0 | 15(점검 화면) | 0 |
| 45326512567 | Patagonia | 4 | 20 | 16 | 0 | 4 | 0 |
| 45324955886 | Zara(예전 none 431개 중 30) | 4 | 30 | 30 | 0 | 0 | 0 |

예전 규칙이었으면 Patagonia 점검 화면 49개가 전부 none 이 됐다. 지금은 0.
Loft(야간 fetch DRY, 45325209223 · 45326495262): 첫 실행 40개 중 none 1 · 지금 페이지 혼용률 5,
둘째 30개 중 지금 페이지 혼용률 27 · 껍데기 3 — 껍데기 3개는 카탈로그에 섞인 카테고리 주소
(/gifts/shop-all-gifts/, /clothing/sweaters/, /new-arrivals/ …)라 none 이 아닌 게 맞다.
Loft 가 지금은 상당수 상품에 소재를 적는다는 것도 드러났다(예전 '전부 미표기'와 다름 — 값은 눈으로 확인 권함).

## 3. Chico's — 탭 수 가설

| 실행 | 탭 · 쉼 | Chico's | Lululemon | Patagonia |
|---|---|---|---|---|
| 45322396684 | 4 · 없음 | 12/20 읽힘, 8 차단 | 0/20 | |
| 45322405046 | 4 · 없음 | 0/20(4.5초에 전부 403) | 0/20 | |
| 45322924106 | 1 · 3초±50% | 0/20 | 0/20 | |
| 45324085051 | 1 · 3초±50% | 0/20 | 0/20 | |
| 45326512567 | 4 · 없음 | 0/20 | | 16/20 |

탭 수와 무관하게 실행마다(러너 IP 마다) 갈렸다 — 가설은 맞지 않는다. 탭 수 기본값은 그대로 두고,
한 실행의 운으로 14일을 잠그지 않게 차단 이력을 바꿨다: 처음 막히면 '의심' 2일, 앞 기록이 끝난 지
30일 안에 또 막히면 14일. 예전 기록은 앞 기록으로 센다. 시험(DRY) 실행은 이력을 쓰지 않는다.

## 4. 출처 표시(via·wd)와 none

두 스크립트 공통(applyLiveComp): 지금 페이지에서 읽은 혼용률이
빈 칸이면 채움 · 같은 값이면 via·wd 지움 · 보관본과 다르면 **지금 페이지가 이김**(via·wd 지움) ·
지금 페이지에서 읽었던 값과 다르면 유지. 엇갈림은 리포트 '혼용률이 엇갈린 상품'에 남는다.
혼용률이 들어가면 none·nv 를 지운다. 크롬 보강의 `{ ...기존, ...새 값 }` 병합(via:"wayback" 이 남던 것)은 없앴다.

## 남은 것

- Massimo Dutti 처럼 소재가 스크립트 JSON(`material`/`percentage` 짝)에만 있는 페이지는 아직 못 읽는다.
- Massimo Dutti 카탈로그의 상품명은 사진 설명이라 productRead 가 맞추지 못한다 — none 대신 껍데기로 센다(안전한 쪽).
- 메뉴가 `<nav>` 가 아니고, 제목도 없는 소재가 메뉴 조각과 멀리 떨어져 있으면 빈 값이 된다(틀린 값 대신).
