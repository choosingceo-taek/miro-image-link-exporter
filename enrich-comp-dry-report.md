# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-24T04:27Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

대상 브랜드(BRANDS): Loft

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 0/1개** (상품 0/673개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

전체 평균은 아직입니다 — 혼용률 48% · 컬러웨이 54%.
기준 95% 까지 315개, 목표 99% 까지 342개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 673개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 325 | 48% | +27 |
| 컬러웨이 | 361 | 54% | +27 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 30개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (1) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| Loft | — | 325/673 (48%) | 361/673 (54%) | 혼용률 +27 컬러 +27 | 성공 페이지 27 / 실패 정보없음 3·껍데기 3·아카이브거부 3 |

## 껍데기로 센 페이지 예 (3)

차단 화면은 아닌데 카탈로그 상품명이 화면 글에 없어 '사이트 미표기(none)'로 적지 않은 페이지.

- newarrivals-meganav-img — https://www.loft.com/gifts/shop-all-gifts/cat3860003/
  > The Gift Edit / LOFT · The Gift Edit / LOFT 60% off party picks!&nbsp; Shop Now&gt; Black Friday Deals starting at $18!&nbsp; Shop Now&gt; 50% off everything!&nbsp; Shop Now&gt; true Order Status Orde
- meganav-img-2 — https://www.loft.com/clothing/sweaters/catl000012/
  > Shop Women&rsquo;s Sweaters &amp; Cardigans / LOFT · Shop Women&rsquo;s Sweaters &amp; Cardigans / LOFT 60% off party picks!&nbsp; Shop Now&gt; Black Friday Deals starting at $18!&nbsp; Shop Now&gt; 5
- newarrivals-meganav-img — https://www.loft.com/new-arrivals/all-new-arrivals/catl00009/
  > Women&rsquo;s Fall Clothing New Arrivals / LOFT · Women&rsquo;s Fall Clothing New Arrivals / LOFT 60% off party picks!&nbsp; Shop Now&gt; Black Friday Deals starting at $18!&nbsp; Shop Now&gt; 50% off

## 웹 아카이브 층

조회 3/600개(브랜드당 40) · 요청 6회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Loft | 30 | 27 | 0 | 0 | 3 | 0 | 0 | 0 | 22s |

사유별 개수: 상품 표시 없음 2 · 혼용률 여러 벌(목록) 1

<details><summary>사유별 예시(최대 25개)</summary>

**상품 표시 없음**

- Loft — https://www.loft.com/gifts/shop-all-gifts/cat3860003/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":805,"carts":0,"sigs":[],"title":"LOFT 2025 Holiday Gift Guide / LOFT","types":["Organization","ContactPoint","BreadcrumbList","ListItem","WebSite","SearchAction"]}
- Loft — https://www.loft.com/new-arrivals/all-new-arrivals/catl00009/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":777,"carts":0,"sigs":[],"title":"Women&rsquo;s Summer New Arrivals / LOFT","types":["Organization","ContactPoint","BreadcrumbList","ListItem","WebSite","SearchAction"]}

**혼용률 여러 벌(목록)**

- Loft — https://www.loft.com/clothing/sweaters/catl000012/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":4,"prices":815,"carts":0,"sigs":["cashmere 100","cashmere 100/cotton 100","cotton 100/linen 100","linen 100"],"title":"Women&rsquo;s Sweaters / LOFT","types":["Organization","ContactPoint","BreadcrumbList","ListItem","WebSite","SearchAction"]}

</details>

