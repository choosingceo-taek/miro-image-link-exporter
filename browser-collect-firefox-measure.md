# 파이어폭스 목록 수집 측정 (2026-11-24, 저장 안 함)

서버 프리페치가 목록 페이지에서 HTTP 403 으로 실패하는 브랜드(Prana · WHBM · Chico's ·
Veronica Beard)를 GitHub Actions 의 헤드리스 수집기(`scripts/browser-collect.mjs`)로
파이어폭스와 크롬으로 각각 돌려 봤다. 모두 `store=0` — Worker 에는 아무것도 보내지 않았다.
카테고리 URL 은 Render `category-links.json` 그대로, 카테고리당 최대 8페이지.

## 요약

| 브랜드 | 크롬(run 45322447710) | 파이어폭스(run 45322433259) |
|---|---|---|
| Prana | 0 · 4/4 HTTP 403 | 0 · 4/4 HTTP 403 |
| Chico's | 0 · 5/5 HTTP 403 | 73 · 첫 카테고리(tees-tanks)만 열림, 나머지 4개 403 |
| WHBM | 0 · 5/5 HTTP 403 | 21 · 첫 카테고리(tees)만 열림, 나머지 4개 403 |
| Veronica Beard | 382 · 4/4 열림 | 382 · 4/4 열림 |

실행 시간(수집 단계): 파이어폭스 약 3분 50초 · 크롬 약 3분 10초. 설치 단계는 둘 다 20초대.

## 실행 상세

### 실행 1 — firefox (run 45322433259)

엔진 firefox · 저장 OFF · 2026-11-24T03:56Z

| 브랜드 | 합계 | 카테고리 분포 | 시간 |
|---|---|---|---|
| Prana | 0 | {} | 13s |
| Chico's | 73 | {"tops":73} | 39s |
| WHBM | 21 | {"tops":21} | 37s |
| Veronica Beard | 382 | {"tops":112,"shirts":64,"sweatshirts":11,"pants":96,"dresses":99} (공용 링크 10 제외) | 142s |

**Prana**

- 0개 · https://www.prana.com/women/tops.html ← HTTP 403
- 0개 · https://www.prana.com/women/tops/sweaters-hoodies.html ← HTTP 403
- 0개 · https://www.prana.com/women/dresses-skirts.html ← HTTP 403
- 0개 · https://www.prana.com/women/bottoms.html ← HTTP 403

**Chico's**

- 73개 · https://www.chicos.com/store/category/tees-tanks/cat11199293
- 0개 · https://www.chicos.com/store/category/activewear/cat20059281 ← HTTP 403
- 0개 · https://www.chicos.com/store/category/blouses-shirts/cat11199294 ← HTTP 403
- 0개 · https://www.chicos.com/store/category/dresses/cat40004 ← HTTP 403
- 0개 · https://www.chicos.com/store/category/pants/cat8289646 ← HTTP 403
- 표본: Touch of Cool™ Foiled Mockneck Layering Tee — https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622
- 표본: Touch of Cool™ Mockneck Layering Tee — https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541
- 표본: Touch of Cool™ Crewneck Layering Tee — https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172
- 표본: Touch of Cool™ Crewneck Layering Tee — https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423149
- 표본: Touch of Cool™ V-Neck Layering Tee — https://www.chicos.com/store/product/touch-of-cool-v-neck-layering-tee/570423170

**WHBM**

- 21개 · https://www.whitehouseblackmarket.com/store/category/tees/cat4769286
- 0개 · https://www.whitehouseblackmarket.com/store/category/tops/cat210001 ← HTTP 403
- 0개 · https://www.whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287 ← HTTP 403
- 0개 · https://www.whitehouseblackmarket.com/store/category/dresses/cat210002 ← HTTP 403
- 0개 · https://www.whitehouseblackmarket.com/store/category/pants/cat210003 ← HTTP 403
- 표본: Satin Front Short Sleeve Tee — https://www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-tee/570421368
- 표본: WHBM FORME™ Ribbed Scoop Neck Tee — https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570405895
- 표본: Scoop Neck Long Sleeve Tee — https://www.whitehouseblackmarket.com/store/product/scoop-neck-long-sleeve-tee/570421361
- 표본: Scoop Neck Long Sleeve Tee — https://www.whitehouseblackmarket.com/store/product/scoop-neck-long-sleeve-tee/570421825
- 표본: Scoop Neck Long Sleeve Tee — https://www.whitehouseblackmarket.com/store/product/scoop-neck-long-sleeve-tee/570421360

**Veronica Beard**

- 177개 · https://veronicabeard.com/collections/tops?filter.style=T-Shirts
- 189개 · https://veronicabeard.com/collections/tops
- 109개 · https://veronicabeard.com/collections/dresses
- 97개 · https://veronicabeard.com/collections/bottoms-pants
- 표본: drexler henley top green shadow — https://veronicabeard.com/products/drexler-henley-top-green-shadow
- 표본: pruitt mesh t shirt black limestone — https://veronicabeard.com/products/pruitt-mesh-t-shirt-black-limestone
- 표본: issa long sleeve polo shirt navy — https://veronicabeard.com/products/issa-long-sleeve-polo-shirt-navy
- 표본: coralee puff sleeve top garnet rose — https://veronicabeard.com/products/coralee-puff-sleeve-top-garnet-rose
- 표본: Mylie Mockneck Tank Top — https://veronicabeard.com/products/mylie-mock-neck-tank-top-gunmetal

### 실행 2 — chromium (run 45322447710)

이 실행의 리포트 커밋은 워크플로의 `-X ours` 버그로 버려졌다(같은 날 고침). 아래는 잡 로그에서
옮긴 것이다. 표본은 로그에 찍히지 않아 적지 못했다.

| 브랜드 | 합계 | URL 별 | 시간 |
|---|---|---|---|
| Prana | 0 | 4/4 HTTP 403 | 11s |
| Chico's | 0 | 5/5 HTTP 403(tees-tanks 포함) | 13s |
| WHBM | 0 | 5/5 HTTP 403(tees 포함) | 13s |
| Veronica Beard | 382(공용 링크 10 제외) | T-Shirts 177 · tops 189 · dresses 109 · bottoms-pants 97 | 151s |
