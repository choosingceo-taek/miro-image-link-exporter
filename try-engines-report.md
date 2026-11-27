# 무료 크롤링 엔진 비교 (2026-11-27T08:31Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45962133367 · 러너 GitHub Actions 1000009041 · 나가는 IP 52.176.35.x · 2026-11-27T07:59Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 70쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 21 | 13 | 36 | 0 | 0·0 | 21·13 | 정상 · 70쪽 · 61s |
| playwright | 0 | 13 | 57 | 0 | 0·0 | 0·13 | 정상 · 70쪽 · 428s |
| firefox | 11 | 16 | 22 | 21 | 0·0 | 11·16 | 시간 초과(12분) · 49/70쪽까지 · 720s |
| firefox-fresh | 12 | 18 | 26 | 14 | 0·0 | 12·18 | 시간 초과(12분) · 56/70쪽까지 · 720s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit | playwright | firefox | firefox-fresh |
|---|---|:-:|:-:|:-:|:-:|
| 목록 | [abercrombie.com](https://www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | 🟡 0 | 🟡 0 |
| 목록 | [abercrombie.com](https://www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | 🟡 0 | 🟡 0 |
| 목록 | [abercrombie.com](https://www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | 🟡 0 | 🟡 0 |
| 목록 | [abercrombie.com](https://www.abercrombie.com/shop/wd/womens-shirts-and-blouses-tops?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | 🟡 0 | 🟡 0 |
| 목록 | [abercrombie.com](https://www.abercrombie.com/shop/wd/womens-dresses-and-jumpsuits) | 🟡 0 | ⛔ 418 | ❌ | 🟡 0 |
| 목록 | [abercrombie.com](https://www.abercrombie.com/shop/wd/womens-sweatpants-and-joggers-bottoms?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | ❌ | ❌ |
| 목록 | [anntaylor.com](https://www.anntaylor.com/clothing/tops-and-blouses/cata000010/) | ✅ 100 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [anntaylor.com](https://www.anntaylor.com/clothing/dresses/cata000012/) | ✅ 100 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [anntaylor.com](https://www.anntaylor.com/clothing/pants/cata000014/) | ✅ 100 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [aritzia.com](https://www.aritzia.com/us/en/clothing/tops) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [aritzia.com](https://www.aritzia.com/us/en/clothing/tshirts) | ⛔ 403 | ⛔ 403 | ✅ 33 | ⛔ 403 |
| 목록 | [aritzia.com](https://www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [aritzia.com](https://www.aritzia.com/us/en/clothing/shirts-blouses) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [aritzia.com](https://www.aritzia.com/us/en/clothing/dresses-3) | ⛔ 403 | ⛔ 403 | ❌ | ⛔ 403 |
| 목록 | [aritzia.com](https://www.aritzia.com/us/en/clothing/sweatsuit-sets/sweat-pants) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [arket.com](https://www.arket.com/en-ww/women/clothing/tops/) | ✅ 48 | ⛔ 403 | ✅ 48 | ✅ 48 |
| 목록 | [arket.com](https://www.arket.com/en-ww/women/clothing/tops/t-shirts/) | ✅ 48 | ⛔ 403 | ✅ 48 | ✅ 48 |
| 목록 | [arket.com](https://www.arket.com/en-ww/women/clothing/sweatshirts-and-hoodies/) | ✅ 32 | ⛔ 403 | ✅ 32 | ✅ 32 |
| 목록 | [arket.com](https://www.arket.com/en-ww/women/clothing/shirts-and-blouses/) | ✅ 48 | ⛔ 403 | ✅ 48 | ✅ 48 |
| 목록 | [arket.com](https://www.arket.com/en-ww/women/clothing/dresses/) | ✅ 48 | ⛔ 403 | ❌ | ✅ 48 |
| 목록 | [shop.mango.com](https://shop.mango.com/us/en/c/women/t-shirts/8e23bdfb) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [shop.mango.com](https://shop.mango.com/us/en/c/women/tops/227371cd) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [shop.mango.com](https://shop.mango.com/us/en/c/women/knitwear/7e46863e) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [shop.mango.com](https://shop.mango.com/us/en/c/women/shirts---blouses/b8003173) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [shop.mango.com](https://shop.mango.com/us/en/c/women/dresses-and-jumpsuits/e6bb8705) | ⛔ 429 | ⛔ 429 | ❌ | ⛔ 429 |
| 목록 | [shop.mango.com](https://shop.mango.com/us/en/c/women/pants/0bf28b3b) | ⛔ 429 | ⛔ 429 | ❌ | ❌ |
| 목록 | [massimodutti.com](https://www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518) | 🟡 0 | ⛔ 403 | ✅ 48 | ✅ 48 |
| 목록 | [massimodutti.com](https://www.massimodutti.com/us/s/w-tops-n2889) | 🟡 0 | ⛔ 403 | ⛔ 404 | 🟡 0 |
| 목록 | [massimodutti.com](https://www.massimodutti.com/us/women/shirts-n1439?celement=1963012) | 🟡 0 | ⛔ 403 | ✅ 49 | ✅ 49 |
| 목록 | [massimodutti.com](https://www.massimodutti.com/us/women/dresses-n1494?celement=2158374) | 🟡 0 | ⛔ 403 | ✅ 36 | ✅ 36 |
| 목록 | [massimodutti.com](https://www.massimodutti.com/us/women/trousers-n1476?celement=2158376) | 🟡 0 | ⛔ 403 | ❌ | ❌ |
| 목록 | [anthropologie.com](https://www.anthropologie.com/tees) | ⛔ 403 | ⛔ 403 | 🟡 2 | ⛔ 403 |
| 목록 | [anthropologie.com](https://www.anthropologie.com/tops-sweatshirts) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [anthropologie.com](https://www.anthropologie.com/tops) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [anthropologie.com](https://www.anthropologie.com/dresses) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [anthropologie.com](https://www.anthropologie.com/bottoms) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [freepeople.com](https://www.freepeople.com/tops/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [freepeople.com](https://www.freepeople.com/sweatshirts-pullovers/?vis_nav=4) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [freepeople.com](https://www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&topper=2) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [freepeople.com](https://www.freepeople.com/dresses/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [freepeople.com](https://www.freepeople.com/pants/) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [freepeople.com](https://www.freepeople.com/fpmovement/workout-tops/) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [freepeople.com](https://www.freepeople.com/fpmovement/hoodies-sweatshirts/) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [freepeople.com](https://www.freepeople.com/fpmovement/one-pieces/) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [freepeople.com](https://www.freepeople.com/fpmovement/workout-bottoms/) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [joules.com](https://www.joules.com/shop/womens/clothing/tops) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [joules.com](https://www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [joules.com](https://www.joules.com/shop/womens/clothing/shirts-and-blouses) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [joules.com](https://www.joules.com/shop/womens/clothing/dresses) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [joules.com](https://www.joules.com/shop/womens/clothing/all-trousers?p=2#1454.34375) | ⛔ 403 | ⛔ 403 | ❌ | ❌ |
| 목록 | [loft.com](https://www.loft.com/clothing/tees-tanks/cat2860023/) | ✅ 173 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [loft.com](https://www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/) | ✅ 173 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [loft.com](https://www.loft.com/clothing/tops/catl000011/) | ✅ 370 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [loft.com](https://www.loft.com/clothing/dresses/catl000013/) | ✅ 374 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [loft.com](https://www.loft.com/clothing/pants/catl000014/) | ✅ 173 | 🟡 0 | ❌ | ❌ |
| 목록 | [luckybrand.com](https://www.luckybrand.com/women/clothing/shirts/blouses) | ✅ 16 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [madewell.com](https://www.madewell.com/womens/clothing/tees/) | 🟡 1 | 🟡 2 | 🟡 2 | 🟡 2 |
| 목록 | [madewell.com](https://www.madewell.com/womens/clothing/tops-shirts/) | ✅ 5 | 🟡 4 | 🟡 4 | 🟡 4 |
| 목록 | [madewell.com](https://www.madewell.com/womens/clothing/dresses/) | ✅ 8 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [madewell.com](https://www.madewell.com/womens/clothing/pants/) | 🟡 1 | 🟡 1 | ❌ | 🟡 1 |
| 목록 | [stories.com](https://www.stories.com/en-us/clothing/tops/) | ✅ 37 | ⛔ 403 | ✅ 42 | ✅ 42 |
| 목록 | [stories.com](https://www.stories.com/en-us/clothing/tops/sweatshirts-hoodies/) | ✅ 6 | ⛔ 403 | ✅ 6 | ✅ 6 |
| 목록 | [stories.com](https://www.stories.com/en-us/clothing/blouses-shirts/) | ✅ 36 | ⛔ 403 | ✅ 41 | ✅ 41 |
| 목록 | [stories.com](https://www.stories.com/en-us/clothing/dresses/) | ✅ 38 | ⛔ 403 | ❌ | ✅ 42 |
| 목록 | [stories.com](https://www.stories.com/en-us/clothing/trousers/) | ✅ 36 | ⛔ 403 | ❌ | ❌ |
| 목록 | [paige.com](https://paige.com/collection/women-tees-and-tanks) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [paige.com](https://paige.com/collection/women-sweaters-and-sweatshirts) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [paige.com](https://paige.com/collection/women-tops) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [paige.com](https://paige.com/collection/women-dresses) | ⛔ 429 | ⛔ 429 | ❌ | ⛔ 429 |
| 목록 | [paige.com](https://paige.com/collection/women-pants) | ⛔ 429 | ⛔ 429 | ❌ | ❌ |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | abercrombie.com | impit | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | abercrombie.com | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | abercrombie.com | firefox | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | abercrombie.com | firefox-fresh | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | abercrombie.com | impit | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | abercrombie.com | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | abercrombie.com | firefox | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | abercrombie.com | firefox-fresh | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | abercrombie.com | impit | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | abercrombie.com | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | abercrombie.com | firefox | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | abercrombie.com | firefox-fresh | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | abercrombie.com | impit | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-shirts-and-blouses-tops?pagefm=navi |
| 목록 | abercrombie.com | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-shirts-and-blouses-tops?pagefm=navi |
| 목록 | abercrombie.com | firefox | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-shirts-and-blouses-tops?pagefm=navi |
| 목록 | abercrombie.com | firefox-fresh | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-shirts-and-blouses-tops?pagefm=navi |
| 목록 | abercrombie.com | impit | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-dresses-and-jumpsuits |
| 목록 | abercrombie.com | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-dresses-and-jumpsuits |
| 목록 | abercrombie.com | firefox | timeout |  |  |  | www.abercrombie.com/shop/wd/womens-dresses-and-jumpsuits |
| 목록 | abercrombie.com | firefox-fresh | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-dresses-and-jumpsuits |
| 목록 | abercrombie.com | impit | blocked | 200 | 알 수 없음 (-) | 제목 "Client Challenge" · 이동 locale wd→us · 흔적 client-challenge | www.abercrombie.com/shop/wd/womens-sweatpants-and-joggers-bottoms?page |
| 목록 | abercrombie.com | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-sweatpants-and-joggers-bottoms?page |
| 목록 | abercrombie.com | firefox | timeout |  |  |  | www.abercrombie.com/shop/wd/womens-sweatpants-and-joggers-bottoms?page |
| 목록 | abercrombie.com | firefox-fresh | timeout |  |  |  | www.abercrombie.com/shop/wd/womens-sweatpants-and-joggers-bottoms?page |
| 목록 | anntaylor.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/tops-and-blouses/cata000010/ |
| 목록 | anntaylor.com | firefox | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/tops-and-blouses/cata000010/ |
| 목록 | anntaylor.com | firefox-fresh | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/tops-and-blouses/cata000010/ |
| 목록 | anntaylor.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/dresses/cata000012/ |
| 목록 | anntaylor.com | firefox | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/dresses/cata000012/ |
| 목록 | anntaylor.com | firefox-fresh | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/dresses/cata000012/ |
| 목록 | anntaylor.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/pants/cata000014/ |
| 목록 | anntaylor.com | firefox | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/pants/cata000014/ |
| 목록 | anntaylor.com | firefox-fresh | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid,  | www.anntaylor.com/clothing/pants/cata000014/ |
| 목록 | aritzia.com | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/tops |
| 목록 | aritzia.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/tops |
| 목록 | aritzia.com | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/tops |
| 목록 | aritzia.com | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/tops |
| 목록 | aritzia.com | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/tshirts |
| 목록 | aritzia.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/tshirts |
| 목록 | aritzia.com | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/tshirts |
| 목록 | aritzia.com | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | aritzia.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | aritzia.com | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 _cfuvid, 쿠키 cf_clearance, 쿠키 __cf_bm | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | aritzia.com | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | aritzia.com | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/shirts-blouses |
| 목록 | aritzia.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/shirts-blouses |
| 목록 | aritzia.com | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 _cfuvid, 쿠키 cf_clearance, 쿠키 __cf_bm | www.aritzia.com/us/en/clothing/shirts-blouses |
| 목록 | aritzia.com | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/shirts-blouses |
| 목록 | aritzia.com | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/dresses-3 |
| 목록 | aritzia.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/dresses-3 |
| 목록 | aritzia.com | firefox | timeout |  |  |  | www.aritzia.com/us/en/clothing/dresses-3 |
| 목록 | aritzia.com | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/dresses-3 |
| 목록 | aritzia.com | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/sweatsuit-sets/sweat-pants |
| 목록 | aritzia.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/g/orc | www.aritzia.com/us/en/clothing/sweatsuit-sets/sweat-pants |
| 목록 | aritzia.com | firefox | timeout |  |  |  | www.aritzia.com/us/en/clothing/sweatsuit-sets/sweat-pants |
| 목록 | aritzia.com | firefox-fresh | timeout |  |  |  | www.aritzia.com/us/en/clothing/sweatsuit-sets/sweat-pants |
| 목록 | arket.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.arket.com/en-ww/women/clothing/tops/ |
| 목록 | arket.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.arket.com/en-ww/women/clothing/tops/t-shirts/ |
| 목록 | arket.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.arket.com/en-ww/women/clothing/sweatshirts-and-hoodies/ |
| 목록 | arket.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.arket.com/en-ww/women/clothing/shirts-and-blouses/ |
| 목록 | arket.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.arket.com/en-ww/women/clothing/dresses/ |
| 목록 | arket.com | firefox | timeout |  |  |  | www.arket.com/en-ww/women/clothing/dresses/ |
| 목록 | shop.mango.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | shop.mango.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | shop.mango.com | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | shop.mango.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | shop.mango.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | shop.mango.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | shop.mango.com | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | shop.mango.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | shop.mango.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | shop.mango.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | shop.mango.com | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | shop.mango.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | shop.mango.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/shirts---blouses/b8003173 |
| 목록 | shop.mango.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/shirts---blouses/b8003173 |
| 목록 | shop.mango.com | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/shirts---blouses/b8003173 |
| 목록 | shop.mango.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/shirts---blouses/b8003173 |
| 목록 | shop.mango.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/dresses-and-jumpsuits/e6bb8705 |
| 목록 | shop.mango.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/dresses-and-jumpsuits/e6bb8705 |
| 목록 | shop.mango.com | firefox | timeout |  |  |  | shop.mango.com/us/en/c/women/dresses-and-jumpsuits/e6bb8705 |
| 목록 | shop.mango.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/dresses-and-jumpsuits/e6bb8705 |
| 목록 | shop.mango.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/pants/0bf28b3b |
| 목록 | shop.mango.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/pants/0bf28b3b |
| 목록 | shop.mango.com | firefox | timeout |  |  |  | shop.mango.com/us/en/c/women/pants/0bf28b3b |
| 목록 | shop.mango.com | firefox-fresh | timeout |  |  |  | shop.mango.com/us/en/c/women/pants/0bf28b3b |
| 목록 | massimodutti.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518 |
| 목록 | massimodutti.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518 |
| 목록 | massimodutti.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | massimodutti.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | massimodutti.com | firefox | dead | 404 | Akamai (중간) | 제목 "Massimo Dutti" · Akamai: x-akamai-* 헤더, 쿠키 bm_mi, 쿠키 bm_sv, 쿠키 ak_bmsc, 쿠키 bm_sz / F5(BIG-IP): 쿠키 TS01d6af0d | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | massimodutti.com | firefox-fresh | no-cards | 200 |  | 제목 "Massimo Dutti" · Akamai: 쿠키 bm_mi, 쿠키 bm_sz, 쿠키 bm_sv, 쿠키 ak_bmsc, 쿠키 _abck / F5(BIG-IP): 쿠키 TS01d6af0d | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | massimodutti.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/women/shirts-n1439?celement=1963012 |
| 목록 | massimodutti.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/women/shirts-n1439?celement=1963012 |
| 목록 | massimodutti.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/women/dresses-n1494?celement=2158374 |
| 목록 | massimodutti.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/women/dresses-n1494?celement=2158374 |
| 목록 | massimodutti.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/women/trousers-n1476?celement=2158376 |
| 목록 | massimodutti.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/women/trousers-n1476?celement=2158376 |
| 목록 | massimodutti.com | firefox | timeout |  |  |  | www.massimodutti.com/us/women/trousers-n1476?celement=2158376 |
| 목록 | massimodutti.com | firefox-fresh | timeout |  |  |  | www.massimodutti.com/us/women/trousers-n1476?celement=2158376 |
| 목록 | anthropologie.com | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/tees |
| 목록 | anthropologie.com | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tees |
| 목록 | anthropologie.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tees |
| 목록 | anthropologie.com | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/tops-sweatshirts |
| 목록 | anthropologie.com | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops-sweatshirts |
| 목록 | anthropologie.com | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops-sweatshirts |
| 목록 | anthropologie.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops-sweatshirts |
| 목록 | anthropologie.com | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/tops |
| 목록 | anthropologie.com | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops |
| 목록 | anthropologie.com | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops |
| 목록 | anthropologie.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops |
| 목록 | anthropologie.com | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/dresses |
| 목록 | anthropologie.com | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/dresses |
| 목록 | anthropologie.com | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/dresses |
| 목록 | anthropologie.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/dresses |
| 목록 | anthropologie.com | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/bottoms |
| 목록 | anthropologie.com | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/bottoms |
| 목록 | anthropologie.com | firefox | timeout |  |  |  | www.anthropologie.com/bottoms |
| 목록 | anthropologie.com | firefox-fresh | timeout |  |  |  | www.anthropologie.com/bottoms |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/tops/ |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/tops/ |
| 목록 | freepeople.com | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/tops/ |
| 목록 | freepeople.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/tops/ |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | freepeople.com | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | freepeople.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | freepeople.com | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | freepeople.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/dresses/ |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/dresses/ |
| 목록 | freepeople.com | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/dresses/ |
| 목록 | freepeople.com | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/dresses/ |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/pants/ |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/pants/ |
| 목록 | freepeople.com | firefox | timeout |  |  |  | www.freepeople.com/pants/ |
| 목록 | freepeople.com | firefox-fresh | timeout |  |  |  | www.freepeople.com/pants/ |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | freepeople.com | firefox | timeout |  |  |  | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | freepeople.com | firefox-fresh | timeout |  |  |  | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | freepeople.com | firefox | timeout |  |  |  | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | freepeople.com | firefox-fresh | timeout |  |  |  | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | freepeople.com | firefox | timeout |  |  |  | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | freepeople.com | firefox-fresh | timeout |  |  |  | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | freepeople.com | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/fpmovement/workout-bottoms/ |
| 목록 | freepeople.com | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/fpmovement/workout-bottoms/ |
| 목록 | freepeople.com | firefox | timeout |  |  |  | www.freepeople.com/fpmovement/workout-bottoms/ |
| 목록 | freepeople.com | firefox-fresh | timeout |  |  |  | www.freepeople.com/fpmovement/workout-bottoms/ |
| 목록 | joules.com | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/tops |
| 목록 | joules.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_s, 쿠키 bm_so, 화면 흔적 akamai-deny | www.joules.com/shop/womens/clothing/tops |
| 목록 | joules.com | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/tops |
| 목록 | joules.com | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/tops |
| 목록 | joules.com | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | joules.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_s, 화면 흔적 akamai-deny | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | joules.com | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_s, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | joules.com | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | joules.com | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | joules.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_s, 화면 흔적 akamai-deny | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | joules.com | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_s, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | joules.com | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | joules.com | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/dresses |
| 목록 | joules.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_s, 화면 흔적 akamai-deny | www.joules.com/shop/womens/clothing/dresses |
| 목록 | joules.com | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_s, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/dresses |
| 목록 | joules.com | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/dresses |
| 목록 | joules.com | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/all-trousers?p=2#1454.34375 |
| 목록 | joules.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_s, 화면 흔적 akamai-deny | www.joules.com/shop/womens/clothing/all-trousers?p=2#1454.34375 |
| 목록 | joules.com | firefox | timeout |  |  |  | www.joules.com/shop/womens/clothing/all-trousers?p=2#1454.34375 |
| 목록 | joules.com | firefox-fresh | timeout |  |  |  | www.joules.com/shop/womens/clothing/all-trousers?p=2#1454.34375 |
| 목록 | loft.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/tees-tanks/cat2860023/ |
| 목록 | loft.com | firefox | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/tees-tanks/cat2860023/ |
| 목록 | loft.com | firefox-fresh | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/tees-tanks/cat2860023/ |
| 목록 | loft.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/ |
| 목록 | loft.com | firefox | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/ |
| 목록 | loft.com | firefox-fresh | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 dwsid,  | www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/ |
| 목록 | loft.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/tops/catl000011/ |
| 목록 | loft.com | firefox | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/tops/catl000011/ |
| 목록 | loft.com | firefox-fresh | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 dwsid,  | www.loft.com/clothing/tops/catl000011/ |
| 목록 | loft.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/dresses/catl000013/ |
| 목록 | loft.com | firefox | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/dresses/catl000013/ |
| 목록 | loft.com | firefox-fresh | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 dwsid,  | www.loft.com/clothing/dresses/catl000013/ |
| 목록 | loft.com | playwright | blocked | 200 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746,  | www.loft.com/clothing/pants/catl000014/ |
| 목록 | loft.com | firefox | timeout |  |  |  | www.loft.com/clothing/pants/catl000014/ |
| 목록 | loft.com | firefox-fresh | timeout |  |  |  | www.loft.com/clothing/pants/catl000014/ |
| 목록 | luckybrand.com | playwright | shell | 200 |  | 제목 "PLAID BUTTON DOWN SHIRT / Lucky Brand" · 이동 path · Cloudflare: cf-ray 헤더 / Akamai: akamai-grn 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_e03650a5b0f56eb20d07b43e59, 쿠키 dwanonymous_daf97866bcb36047de9f0e88cb49cc50, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.luckybrand.com/women/clothing/shirts/blouses |
| 목록 | luckybrand.com | firefox | shell | 200 |  | 제목 "PLAID BUTTON DOWN SHIRT / Lucky Brand" · 이동 path · Cloudflare: cf-ray 헤더 / Akamai: akamai-grn 헤더, 쿠키 ak_bmsc / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_e03650a5b0f56eb20d07b43e59, 쿠키 dwanonymous_daf97866bcb36047de9f0e88cb49cc50, 쿠키 __cq_dnt, 쿠키 d | www.luckybrand.com/women/clothing/shirts/blouses |
| 목록 | luckybrand.com | firefox-fresh | shell | 200 |  | 제목 "PLAID BUTTON DOWN SHIRT / Lucky Brand" · 이동 path · Cloudflare: cf-ray 헤더 / Akamai: akamai-grn 헤더, 쿠키 ak_bmsc / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_e03650a5b0f56eb20d07b43e59, 쿠키 dwanonymous_daf97866bcb36047de9f0e88cb49cc50, 쿠키 __cq_dnt, 쿠키 d | www.luckybrand.com/women/clothing/shirts/blouses |
| 목록 | madewell.com | impit | no-cards | 200 |  | 제목 "Women’s Tees & Tanks / Madewell" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.madewell.com/womens/clothing/tees/ |
| 목록 | madewell.com | impit | no-cards | 200 |  | 제목 "Women's Pants & Trousers / Madewell" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.madewell.com/womens/clothing/pants/ |
| 목록 | madewell.com | firefox | timeout |  |  |  | www.madewell.com/womens/clothing/pants/ |
| 목록 | stories.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.stories.com/en-us/clothing/tops/ |
| 목록 | stories.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.stories.com/en-us/clothing/tops/sweatshirts-hoodies/ |
| 목록 | stories.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.stories.com/en-us/clothing/blouses-shirts/ |
| 목록 | stories.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.stories.com/en-us/clothing/dresses/ |
| 목록 | stories.com | firefox | timeout |  |  |  | www.stories.com/en-us/clothing/dresses/ |
| 목록 | stories.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.stories.com/en-us/clothing/trousers/ |
| 목록 | stories.com | firefox | timeout |  |  |  | www.stories.com/en-us/clothing/trousers/ |
| 목록 | stories.com | firefox-fresh | timeout |  |  |  | www.stories.com/en-us/clothing/trousers/ |
| 목록 | paige.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tees-and-tanks |
| 목록 | paige.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tees-and-tanks |
| 목록 | paige.com | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tees-and-tanks |
| 목록 | paige.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tees-and-tanks |
| 목록 | paige.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | paige.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | paige.com | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | paige.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | paige.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tops |
| 목록 | paige.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tops |
| 목록 | paige.com | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tops |
| 목록 | paige.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tops |
| 목록 | paige.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-dresses |
| 목록 | paige.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-dresses |
| 목록 | paige.com | firefox | timeout |  |  |  | paige.com/collection/women-dresses |
| 목록 | paige.com | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-dresses |
| 목록 | paige.com | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-pants |
| 목록 | paige.com | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-pants |
| 목록 | paige.com | firefox | timeout |  |  |  | paige.com/collection/women-pants |
| 목록 | paige.com | firefox-fresh | timeout |  |  |  | paige.com/collection/women-pants |

<details><summary>사유</summary>

- abercrombie.com — https://www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
- abercrombie.com — https://www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
- abercrombie.com — https://www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
- abercrombie.com — https://www.abercrombie.com/shop/wd/womens-shirts-and-blouses-tops?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
- abercrombie.com — https://www.abercrombie.com/shop/wd/womens-dresses-and-jumpsuits
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1516자
- abercrombie.com — https://www.abercrombie.com/shop/wd/womens-sweatpants-and-joggers-bottoms?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- anntaylor.com — https://www.anntaylor.com/clothing/tops-and-blouses/cata000010/
  - impit: ✅ HTML 상품 링크 100 · 이미지 링크 24 · 글 11546자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
- anntaylor.com — https://www.anntaylor.com/clothing/dresses/cata000012/
  - impit: ✅ HTML 상품 링크 100 · 이미지 링크 24 · 글 11546자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
- anntaylor.com — https://www.anntaylor.com/clothing/pants/cata000014/
  - impit: ✅ HTML 상품 링크 100 · 이미지 링크 24 · 글 11546자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
- aritzia.com — https://www.aritzia.com/us/en/clothing/tops
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- aritzia.com — https://www.aritzia.com/us/en/clothing/tshirts
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ✅ 수집기 33개 · HTML 상품 링크 44 · 이미지 링크 48 · 글 12196자 · 예 https://www.aritzia.com/us/en/clothing/tshirts/longsleeve-tshirts
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- aritzia.com — https://www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- aritzia.com — https://www.aritzia.com/us/en/clothing/shirts-blouses
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- aritzia.com — https://www.aritzia.com/us/en/clothing/dresses-3
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- aritzia.com — https://www.aritzia.com/us/en/clothing/sweatsuit-sets/sweat-pants
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- arket.com — https://www.arket.com/en-ww/women/clothing/tops/
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 49 · 글 4909자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 34102자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 34102자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
- arket.com — https://www.arket.com/en-ww/women/clothing/tops/t-shirts/
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 49 · 글 5668자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 17828자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 34931자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
- arket.com — https://www.arket.com/en-ww/women/clothing/sweatshirts-and-hoodies/
  - impit: ✅ HTML 상품 링크 32 · 이미지 링크 33 · 글 4343자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 32개 · HTML 상품 링크 32 · 이미지 링크 30 · 글 13124자 · 예 https://www.arket.com/en-ww/product/terry-sweatshirt-dark-blue-1283133037/
  - firefox-fresh: ✅ 수집기 32개 · HTML 상품 링크 32 · 이미지 링크 30 · 글 30170자 · 예 https://www.arket.com/en-ww/product/terry-sweatshirt-dark-blue-1283133037/
- arket.com — https://www.arket.com/en-ww/women/clothing/shirts-and-blouses/
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 49 · 글 4751자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 16925자 · 예 https://www.arket.com/en-ww/product/relaxed-fit-poplin-shirt-light-blueburgundy-1349067007/
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 33971자 · 예 https://www.arket.com/en-ww/product/relaxed-fit-poplin-shirt-light-blueburgundy-1349067007/
- arket.com — https://www.arket.com/en-ww/women/clothing/dresses/
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 49 · 글 4969자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 47 · 글 33829자 · 예 https://www.arket.com/en-ww/product/silk-organza-dress-black-1340093001/
- shop.mango.com — https://shop.mango.com/us/en/c/women/t-shirts/8e23bdfb
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- shop.mango.com — https://shop.mango.com/us/en/c/women/tops/227371cd
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- shop.mango.com — https://shop.mango.com/us/en/c/women/knitwear/7e46863e
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- shop.mango.com — https://shop.mango.com/us/en/c/women/shirts---blouses/b8003173
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- shop.mango.com — https://shop.mango.com/us/en/c/women/dresses-and-jumpsuits/e6bb8705
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- shop.mango.com — https://shop.mango.com/us/en/c/women/pants/0bf28b3b
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- massimodutti.com — https://www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 48 · 이미지 링크 48 · 글 10902자
  - firefox-fresh: ✅ HTML 상품 링크 48 · 이미지 링크 48 · 글 10902자
- massimodutti.com — https://www.massimodutti.com/us/s/w-tops-n2889
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 404 Massimo Dutti
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 7413자
- massimodutti.com — https://www.massimodutti.com/us/women/shirts-n1439?celement=1963012
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 49개 · HTML 상품 링크 49 · 이미지 링크 49 · 글 11099자 · 예 https://www.massimodutti.com/us/flowing-shirt-with-button-detail-l06839554
  - firefox-fresh: ✅ HTML 상품 링크 49 · 이미지 링크 49 · 글 11099자
- massimodutti.com — https://www.massimodutti.com/us/women/dresses-n1494?celement=2158374
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 36 · 글 10768자 · 예 https://www.massimodutti.com/us/flowing-satin-finish-midi-dress-l06631510
  - firefox-fresh: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 36 · 글 10768자 · 예 https://www.massimodutti.com/us/flowing-satin-finish-midi-dress-l06631510
- massimodutti.com — https://www.massimodutti.com/us/women/trousers-n1476?celement=2158376
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- anthropologie.com — https://www.anthropologie.com/tees
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: 🟡 수집기 2개 · HTML 상품 링크 71 · 이미지 링크 7 · 글 7332자 · 예 https://www.anthropologie.com/shop/maeve-sequined-baby-tee
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- anthropologie.com — https://www.anthropologie.com/tops-sweatshirts
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- anthropologie.com — https://www.anthropologie.com/tops
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- anthropologie.com — https://www.anthropologie.com/dresses
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- anthropologie.com — https://www.anthropologie.com/bottoms
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- freepeople.com — https://www.freepeople.com/tops/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- freepeople.com — https://www.freepeople.com/sweatshirts-pullovers/?vis_nav=4
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- freepeople.com — https://www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&topper=2
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- freepeople.com — https://www.freepeople.com/dresses/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- freepeople.com — https://www.freepeople.com/pants/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- freepeople.com — https://www.freepeople.com/fpmovement/workout-tops/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- freepeople.com — https://www.freepeople.com/fpmovement/hoodies-sweatshirts/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- freepeople.com — https://www.freepeople.com/fpmovement/one-pieces/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- freepeople.com — https://www.freepeople.com/fpmovement/workout-bottoms/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- joules.com — https://www.joules.com/shop/womens/clothing/tops
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- joules.com — https://www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- joules.com — https://www.joules.com/shop/womens/clothing/shirts-and-blouses
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- joules.com — https://www.joules.com/shop/womens/clothing/dresses
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- joules.com — https://www.joules.com/shop/womens/clothing/all-trousers?p=2#1454.34375
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- loft.com — https://www.loft.com/clothing/tees-tanks/cat2860023/
  - impit: ✅ HTML 상품 링크 173 · 이미지 링크 9 · 글 16481자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
- loft.com — https://www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/
  - impit: ✅ HTML 상품 링크 173 · 이미지 링크 9 · 글 16481자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
- loft.com — https://www.loft.com/clothing/tops/catl000011/
  - impit: ✅ HTML 상품 링크 370 · 이미지 링크 105 · 글 71300자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
- loft.com — https://www.loft.com/clothing/dresses/catl000013/
  - impit: ✅ HTML 상품 링크 374 · 이미지 링크 109 · 글 75778자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
- loft.com — https://www.loft.com/clothing/pants/catl000014/
  - impit: ✅ HTML 상품 링크 173 · 이미지 링크 9 · 글 16503자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- luckybrand.com — https://www.luckybrand.com/women/clothing/shirts/blouses
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 17 · 글 36573자
  - playwright: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 37자
  - firefox: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 37자
  - firefox-fresh: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 37자
- madewell.com — https://www.madewell.com/womens/clothing/tees/
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 22 · 글 11123자
  - playwright: 🟡 수집기 2개 · HTML 상품 링크 20 · 이미지 링크 42 · 글 13292자 · 예 https://www.madewell.com/feature/womens-tees/
  - firefox: 🟡 수집기 2개 · HTML 상품 링크 20 · 이미지 링크 42 · 글 13292자 · 예 https://www.madewell.com/feature/womens-tees/
  - firefox-fresh: 🟡 수집기 2개 · HTML 상품 링크 20 · 이미지 링크 42 · 글 13192자 · 예 https://www.madewell.com/feature/womens-tees/
- madewell.com — https://www.madewell.com/womens/clothing/tops-shirts/
  - impit: ✅ HTML 상품 링크 5 · 이미지 링크 26 · 글 10112자
  - playwright: 🟡 수집기 4개 · HTML 상품 링크 23 · 이미지 링크 46 · 글 12202자 · 예 https://www.madewell.com/p/OB685/
  - firefox: 🟡 수집기 4개 · HTML 상품 링크 23 · 이미지 링크 46 · 글 12159자 · 예 https://www.madewell.com/p/OB685/
  - firefox-fresh: 🟡 수집기 4개 · HTML 상품 링크 23 · 이미지 링크 46 · 글 12159자 · 예 https://www.madewell.com/p/OB685/
- madewell.com — https://www.madewell.com/womens/clothing/dresses/
  - impit: ✅ HTML 상품 링크 8 · 이미지 링크 28 · 글 8499자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 20 · 이미지 링크 40 · 글 9672자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 20 · 이미지 링크 40 · 글 9672자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 20 · 이미지 링크 40 · 글 9615자
- madewell.com — https://www.madewell.com/womens/clothing/pants/
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 22 · 글 9802자
  - playwright: 🟡 수집기 1개 · HTML 상품 링크 21 · 이미지 링크 42 · 글 11283자 · 예 https://www.madewell.com/p/NX207/
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: 🟡 수집기 1개 · HTML 상품 링크 21 · 이미지 링크 42 · 글 11193자 · 예 https://www.madewell.com/p/NX207/
- stories.com — https://www.stories.com/en-us/clothing/tops/
  - impit: ✅ HTML 상품 링크 37 · 이미지 링크 11 · 글 7044자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 42개 · HTML 상품 링크 37 · 이미지 링크 16 · 글 12901자 · 예 https://www.stories.com/en-us/product/embroidered-wool-polo-jumper-grey-1368465001/
  - firefox-fresh: ✅ 수집기 42개 · HTML 상품 링크 37 · 이미지 링크 16 · 글 12901자 · 예 https://www.stories.com/en-us/product/embroidered-wool-polo-jumper-grey-1368465001/
- stories.com — https://www.stories.com/en-us/clothing/tops/sweatshirts-hoodies/
  - impit: ✅ HTML 상품 링크 6 · 이미지 링크 1 · 글 3167자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 6개 · HTML 상품 링크 6 · 이미지 링크 7 · 글 8864자 · 예 https://www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-1358924005/
  - firefox-fresh: ✅ 수집기 6개 · HTML 상품 링크 6 · 이미지 링크 7 · 글 8864자 · 예 https://www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-1358924005/
- stories.com — https://www.stories.com/en-us/clothing/blouses-shirts/
  - impit: ✅ HTML 상품 링크 36 · 이미지 링크 8 · 글 6723자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 41개 · HTML 상품 링크 36 · 이미지 링크 13 · 글 12155자 · 예 https://www.stories.com/en-us/product/high-neck-lace-blouse-black-1362393001/
  - firefox-fresh: ✅ 수집기 41개 · HTML 상품 링크 36 · 이미지 링크 13 · 글 12155자 · 예 https://www.stories.com/en-us/product/high-neck-lace-blouse-black-1362393001/
- stories.com — https://www.stories.com/en-us/clothing/dresses/
  - impit: ✅ HTML 상품 링크 38 · 이미지 링크 5 · 글 7180자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ✅ 수집기 42개 · HTML 상품 링크 38 · 이미지 링크 10 · 글 13322자 · 예 https://www.stories.com/en-us/product/short-sleeve-long-dress-dark-red-1325649008/
- stories.com — https://www.stories.com/en-us/clothing/trousers/
  - impit: ✅ HTML 상품 링크 36 · 이미지 링크 12 · 글 6910자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지
- paige.com — https://paige.com/collection/women-tees-and-tanks
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- paige.com — https://paige.com/collection/women-sweaters-and-sweatshirts
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- paige.com — https://paige.com/collection/women-tops
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- paige.com — https://paige.com/collection/women-dresses
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- paige.com — https://paige.com/collection/women-pants
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - firefox-fresh: ❌ 시간 초과(12분) — 못 본 페이지

</details>
