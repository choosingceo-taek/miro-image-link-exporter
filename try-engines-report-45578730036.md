# 무료 크롤링 엔진 비교 (2026-11-25T08:59Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45578730036 · 러너 GitHub Actions 1000008381 · 나가는 IP 13.86.110.x · 2026-11-25T08:44Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 60쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 22 | 11 | 27 | 0 | 22·11 | 0·0 | 정상 · 60쪽 · 27s |
| site-api | 4 | 8 | 18 | 30 | 4·8 | 0·0 | 정상 · 60쪽 · 6s |
| wayback | 18 | 4 | 0 | 38 | 18·4 | 0·0 | 정상 · 60쪽 · 115s |
| playwright | 26 | 8 | 26 | 0 | 26·8 | 0·0 | 정상 · 60쪽 · 402s |
| firefox | 24 | 12 | 24 | 0 | 24·12 | 0·0 | 정상 · 60쪽 · 357s |
| camoufox | 0 | 0 | 0 | 60 | 0·0 | 0·0 | 엔진 실행 실패: exit 139 (SIGSEGV) · 0/60쪽까지 · 1s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| Abercrombie & Fitch | 3 | 2 | 2/214 | /shop/wd/womens · /shop/wd/mens-holiday-outfits |
| Aritzia | 3 | 26 | 95/800 | /intl/en/sale · /intl/en/sale/sale-coats-jackets |
| Arket | 3 | 0 | 0/285 |  |
| Buck Mason | 3 | 0 | 0/119 |  |
| Carlhartt | 3 | 51 | 78/148 | /c/black-friday-accessories · /c/black-friday |
| Dickies | 3 | 0 | 0/260 |  |
| Sessun | 3 | 29 | 34/81 | /catalogue/shirt-and-blouses/vence-meloroad.html · /catalogue/shirt-and-blouses/leonie-murza-playgrid.html |
| Everlane | 3 | 0 | 0/443 |  |
| Gap | 0 | 6 | 6/6 | /browse/women/gift-shop · /browse/men/gift-shop |
| Lands end | 3 | 4 | 14/469 | /shop/womens-tops-tees/S-xfe-xez-y5c-xh1-xec · /shop/womens-polo-shirts-henley-tops/S-xfe-xez-y5c-y03-y0e-16na-xec |
| Loft | 3 | 1 | 1/673 | /new-arrivals/all-new-arrivals/catl00009/ |
| Mint velvet | 3 | 0 | 0/416 |  |
| Old Navy | 0 | 7 | 7/7 | /browse/info.do · /browse/women/holiday-outfits |
| Paige | 3 | 0 | 0/60 |  |
| Poetry | 0 | 303 | 303/303 | /t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html · /t-shirts-and-tops/silk-cotton-jersey-t-shirt-blackberry/RW51.C.html |
| rouje | 3 | 0 | 0/232 |  |
| Mango | 3 | 0 | 0/93 |  |
| Spanx | 3 | 0 | 0/84 |  |
| &Other Stories | 3 | 6 | 9/343 | /en-us/shoes/ · /en-us/bags/ |
| Reformation | 3 | 0 | 0/753 |  |
| The upside | 3 | 10 | 18/429 | /active/tops/sports-bras/ · /active/bottoms/shorts/ |
| Whitestuff | 3 | 0 | 0/184 |  |
| Wilson | 3 | 12 | 12/52 | /en-us/collections/deals-baseball · /en-us/custom/basketballs |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit | site-api | wayback | playwright | firefox | camoufox |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|
| 상품 | [Abercrombie & Fitch](https://www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-62050821) | 🟡 | ❌ | ❌ | ⛔ 418 | 🟡 | ❌ |
| 상품 | [Abercrombie & Fitch](https://www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-61005323) | 🟡 | ❌ | ❌ | ⛔ 418 | 🟡 | ❌ |
| 상품 | [Abercrombie & Fitch](https://www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321) | 🟡 | ❌ | ❌ | ⛔ 418 | 🟡 | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | 🟡 | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/ezra-top/125956.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Arket](https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Arket](https://www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135758046/) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Arket](https://www.arket.com/en-ww/product/alba-heavyweight-t-shirt-white-1283090001/) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Buck Mason](https://www.buckmason.com/products/white-field-spec-boyfriend-crop-tee) | ✅ | ⛔ 404 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Buck Mason](https://www.buckmason.com/products/natural-navy-stripe-field-spec-rugby-polo-1) | ✅ | ⛔ 404 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Buck Mason](https://www.buckmason.com/products/ganache-field-spec-boyfriend-crop-tee) | ✅ | ⛔ 404 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Carlhartt](https://www.carhartt.com/product/107391/womens-irvine-relaxed-t-shirt) | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Carlhartt](https://www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt) | 🟡 | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| 상품 | [Carlhartt](https://www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt) | 🟡 | ❌ | ❌ | 🟡 | 🟡 | ❌ |
| 상품 | [Dickies](https://www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc) | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Dickies](https://www.dickies.com/products/womens-cooling-performance-short-sleeve-pocket-t-shirt-dk0a888ubkh) | ✅ | 🟡 | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Dickies](https://www.dickies.com/products/womens-cooling-performance-short-sleeve-v-neck-t-shirt-dk0a888kl51) | ✅ | 🟡 | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Sessun](https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-025.webp%20924w) | ⛔ 404 | ❌ | ❌ | ⛔ 404 | ⛔ 404 | ❌ |
| 상품 | [Sessun](https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-028.webp%20924w) | ⛔ 404 | ❌ | ❌ | ⛔ 404 | ⛔ 404 | ❌ |
| 상품 | [Sessun](https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_blazer_blue-Karty_bluenim-027.webp%20924w) | ⛔ 404 | ❌ | ❌ | ⛔ 404 | ⛔ 404 | ❌ |
| 상품 | [Everlane](https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote) | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Everlane](https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-ponderosa-pine) | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Everlane](https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-brown-stripe) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Lands end](https://www.landsend.com/products/supima-cotton-long-sleeve-crewneck-t-shirt/id_302536) | ⛔ 403 | ⛔ 403 | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Lands end](https://www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtleneck/id_302525) | ⛔ 403 | ⛔ 403 | 🟡 | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Lands end](https://www.landsend.com/products/supima-cotton-long-sleeve-v-neck-t-shirt/id_244123) | ⛔ 403 | ⛔ 403 | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Loft](https://www.loft.com/gifts/shop-all-gifts/cat3860003/) | 🟡 | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| 상품 | [Loft](https://www.loft.com/clothing/sweaters/catl000012/) | 🟡 | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| 상품 | [Loft](https://www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-modern-tee/711761.html) | 🟡 | ❌ | ❌ | 🟡 | 🟡 | ❌ |
| 상품 | [Mint velvet](https://mintvelvet.com/products/black-jersey-draped-sleeveless-top) | ✅ | 🟡 | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Mint velvet](https://mintvelvet.com/products/black-metallic-wool-blend-asymmetric-top) | ✅ | 🟡 | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Mint velvet](https://mintvelvet.com/products/black-mesh-draped-bubble-hem-top) | ✅ | 🟡 | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Paige](https://paige.com/en-kr/products/women-rhodes-tee-whisper-pink) | ⛔ 429 | ⛔ 429 | ❌ | ⛔ 429 | ⛔ 429 | ❌ |
| 상품 | [Paige](https://paige.com/en-kr/products/women-shauntay-top-black) | ⛔ 429 | ⛔ 429 | ❌ | ⛔ 429 | ⛔ 429 | ❌ |
| 상품 | [Paige](https://paige.com/en-kr/products/women-rhodes-tee-white) | ⛔ 429 | ⛔ 429 | ❌ | ⛔ 429 | ⛔ 429 | ❌ |
| 상품 | [rouje](https://www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy) | 🟡 | ⛔ 404 | ❌ | 🟡 | 🟡 | ❌ |
| 상품 | [rouje](https://www.rouje.com/products/basile-long-sleeve-top-grey) | 🟡 | ⛔ 404 | ❌ | 🟡 | 🟡 | ❌ |
| 상품 | [rouje](https://www.rouje.com/products/petra-long-sleeve-top-grey) | 🟡 | ⛔ 404 | ❌ | 🟡 | 🟡 | ❌ |
| 상품 | [Mango](https://shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-shirt/37091331/01/00) | ⛔ 429 | ❌ | ❌ | ⛔ 429 | ⛔ 429 | ❌ |
| 상품 | [Mango](https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/32/00) | ⛔ 429 | ❌ | ❌ | ⛔ 429 | ⛔ 429 | ❌ |
| 상품 | [Mango](https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/07/00) | ⛔ 429 | ❌ | ✅ | ⛔ 429 | ⛔ 429 | ❌ |
| 상품 | [Spanx](https://spanx.com/products/spanx-airessentials-turtleneck-tunic?v=48683236458707&bau-context=standard&Color=Very+Black) | ✅ | ⛔ 404 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Spanx](https://spanx.com/products/spanx-airessentials-crewneck-long-sleeve-top?v=48685318963411&bau-context=standard&Color=Very+Black) | ✅ | ⛔ 404 | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Spanx](https://spanx.com/products/spanx-poplin-oversized-button-up-shirt?v=48681461219539&bau-context=standard&Color=Classic+White) | ✅ | ⛔ 404 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [&Other Stories](https://www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-1358924005/) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 200 | ❌ |
| 상품 | [&Other Stories](https://www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924002/) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 200 | ❌ |
| 상품 | [&Other Stories](https://www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323866001/) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Reformation](https://www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_1319462ALO_color=ALO) | ⛔ 403 | ⛔ 403 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Reformation](https://www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_1320743BLK_color=BLK) | ⛔ 403 | ⛔ 403 | ✅ | ✅ | ⛔ 403 | ❌ |
| 상품 | [Reformation](https://www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_1314146BLK_color=BLK) | ⛔ 403 | ⛔ 403 | ✅ | ✅ | ⛔ 403 | ❌ |
| 상품 | [The upside](https://www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/) | ⛔ 403 | ❌ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [The upside](https://www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [The upside](https://www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Whitestuff](https://www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Whitestuff](https://www.whitestuff.com/p/8750/447966-amelia-embroidered-top/MID_PLUM) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Whitestuff](https://www.whitestuff.com/p/8647/447994-clara-ls-tee/DK_BLUE) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Wilson](https://www.wilson.com/en-us/products/everyday-brami-ww00015) | ✅ | 🟡 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Wilson](https://www.wilson.com/en-us/products/on-the-daily-brami-ww00284) | ✅ | 🟡 | ✅ | ✅ | ✅ | ❌ |
| 상품 | [Wilson](https://www.wilson.com/en-us/products/pro-seamless-tank-ww00024) | ✅ | 🟡 | ❌ | ✅ | ✅ | ❌ |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 상품 | Abercrombie & Fitch | impit | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-620 |
| 상품 | Abercrombie & Fitch | site-api | error |  |  |  | www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-620 |
| 상품 | Abercrombie & Fitch | wayback | no-archive |  |  |  | www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-620 |
| 상품 | Abercrombie & Fitch | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-620 |
| 상품 | Abercrombie & Fitch | firefox | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-620 |
| 상품 | Abercrombie & Fitch | camoufox | error |  |  |  | www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-620 |
| 상품 | Abercrombie & Fitch | impit | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-610053 |
| 상품 | Abercrombie & Fitch | site-api | error |  |  |  | www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-610053 |
| 상품 | Abercrombie & Fitch | wayback | no-archive |  |  |  | www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-610053 |
| 상품 | Abercrombie & Fitch | playwright | blocked | 418 | Cloudflare (중간) | 이동 locale wd→us · Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-610053 |
| 상품 | Abercrombie & Fitch | firefox | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us · Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-610053 |
| 상품 | Abercrombie & Fitch | camoufox | error |  |  |  | www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-610053 |
| 상품 | Abercrombie & Fitch | impit | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321 |
| 상품 | Abercrombie & Fitch | site-api | error |  |  |  | www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321 |
| 상품 | Abercrombie & Fitch | wayback | no-archive |  |  |  | www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321 |
| 상품 | Abercrombie & Fitch | playwright | blocked | 418 | Cloudflare (중간) | 이동 locale wd→us · Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321 |
| 상품 | Abercrombie & Fitch | firefox | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us · Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321 |
| 상품 | Abercrombie & Fitch | camoufox | error |  |  |  | www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321 |
| 상품 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | site-api | error |  |  |  | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | wayback | no-archive |  |  |  | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | camoufox | error |  |  |  | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | site-api | error |  |  |  | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | wayback | no-archive |  |  |  | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_mar | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | firefox | geo | 200 |  | 제목 "Caprice Satin Bustier / Aritzia US" · 이동 locale intl/en→us/en · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/scripts / CloudFront: x-amz-cf-* 헤더 / Shopify: 쿠키 _shopif | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | camoufox | error |  |  |  | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Aritzia | site-api | error |  |  |  | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Aritzia | wayback | no-archive |  |  |  | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Aritzia | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_mar | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Aritzia | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Aritzia | camoufox | error |  |  |  | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Arket | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/ |
| 상품 | Arket | site-api | error |  |  |  | www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/ |
| 상품 | Arket | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm | www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/ |
| 상품 | Arket | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso / Cloudflare: 쿠키 __cf_bm | www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/ |
| 상품 | Arket | camoufox | error |  |  |  | www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/ |
| 상품 | Arket | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135 |
| 상품 | Arket | site-api | error |  |  |  | www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135 |
| 상품 | Arket | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135 |
| 상품 | Arket | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135 |
| 상품 | Arket | camoufox | error |  |  |  | www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135 |
| 상품 | Arket | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.arket.com/en-ww/product/alba-heavyweight-t-shirt-white-1283090001/ |
| 상품 | Arket | site-api | error |  |  |  | www.arket.com/en-ww/product/alba-heavyweight-t-shirt-white-1283090001/ |
| 상품 | Arket | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.arket.com/en-ww/product/alba-heavyweight-t-shirt-white-1283090001/ |
| 상품 | Arket | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.arket.com/en-ww/product/alba-heavyweight-t-shirt-white-1283090001/ |
| 상품 | Arket | camoufox | error |  |  |  | www.arket.com/en-ww/product/alba-heavyweight-t-shirt-white-1283090001/ |
| 상품 | Buck Mason | site-api | blocked | 404 | Vercel (낮음) | Vercel: x-vercel-id 헤더 | www.buckmason.com/products/white-field-spec-boyfriend-crop-tee |
| 상품 | Buck Mason | camoufox | error |  |  |  | www.buckmason.com/products/white-field-spec-boyfriend-crop-tee |
| 상품 | Buck Mason | site-api | blocked | 404 | Vercel (낮음) | Vercel: x-vercel-id 헤더 | www.buckmason.com/products/natural-navy-stripe-field-spec-rugby-polo-1 |
| 상품 | Buck Mason | camoufox | error |  |  |  | www.buckmason.com/products/natural-navy-stripe-field-spec-rugby-polo-1 |
| 상품 | Buck Mason | site-api | blocked | 404 | Vercel (낮음) | Vercel: x-vercel-id 헤더 | www.buckmason.com/products/ganache-field-spec-boyfriend-crop-tee |
| 상품 | Buck Mason | camoufox | error |  |  |  | www.buckmason.com/products/ganache-field-spec-boyfriend-crop-tee |
| 상품 | Carlhartt | site-api | error |  |  |  | www.carhartt.com/product/107391/womens-irvine-relaxed-t-shirt |
| 상품 | Carlhartt | camoufox | error |  |  |  | www.carhartt.com/product/107391/womens-irvine-relaxed-t-shirt |
| 상품 | Carlhartt | impit | no-comp | 200 |  | 제목 "Women's Irvine Loose LS Logo T-Shirt / C" · Akamai: server: *, 쿠키 _abck, 쿠키 bm_sz | www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt |
| 상품 | Carlhartt | site-api | error |  |  |  | www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt |
| 상품 | Carlhartt | wayback | no-comp |  |  |  | www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt |
| 상품 | Carlhartt | playwright | no-comp | 200 |  | 제목 "Women's Irvine Loose LS Logo T-Shirt / C" · Akamai: server: * / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt |
| 상품 | Carlhartt | firefox | no-comp | 200 |  | 제목 "Women's Irvine Loose LS Logo T-Shirt / C" · Akamai: server: * / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt |
| 상품 | Carlhartt | camoufox | error |  |  |  | www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt |
| 상품 | Carlhartt | impit | no-comp | 200 |  | 제목 "Women's Irvine Loose LS Pocket T-Shirt /" · Akamai: server: *, 쿠키 _abck, 쿠키 bm_sz | www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt |
| 상품 | Carlhartt | site-api | error |  |  |  | www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt |
| 상품 | Carlhartt | wayback | no-archive |  |  |  | www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt |
| 상품 | Carlhartt | playwright | no-comp | 200 |  | 제목 "Women's Irvine Loose LS Pocket T-Shirt /" · Akamai: server: * / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt |
| 상품 | Carlhartt | firefox | no-comp | 200 |  | 제목 "Women's Irvine Loose LS Pocket T-Shirt /" · Akamai: server: * / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt |
| 상품 | Carlhartt | camoufox | error |  |  |  | www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt |
| 상품 | Dickies | impit | geo | 200 |  | 제목 "Women's Everyday Short Sleeve T-Shirt / " · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc |
| 상품 | Dickies | site-api | geo | 200 |  | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc |
| 상품 | Dickies | wayback | no-archive |  |  |  | www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc |
| 상품 | Dickies | playwright | geo | 200 |  | 제목 "Women's Everyday Short Sleeve T-Shirt / " · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc |
| 상품 | Dickies | firefox | geo | 200 |  | 제목 "Women's Everyday Short Sleeve T-Shirt / " · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더 | www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc |
| 상품 | Dickies | camoufox | error |  |  |  | www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc |
| 상품 | Dickies | impit | geo | 200 |  | 제목 "Women's Cooling Performance Short Sleeve" · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.dickies.com/products/womens-cooling-performance-short-sleeve-pocke |
| 상품 | Dickies | site-api | geo | 200 |  | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.dickies.com/products/womens-cooling-performance-short-sleeve-pocke |
| 상품 | Dickies | wayback | no-archive |  |  |  | www.dickies.com/products/womens-cooling-performance-short-sleeve-pocke |
| 상품 | Dickies | playwright | geo | 200 |  | 제목 "Women's Cooling Performance Short Sleeve" · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.dickies.com/products/womens-cooling-performance-short-sleeve-pocke |
| 상품 | Dickies | firefox | geo | 200 |  | 제목 "Women's Cooling Performance Short Sleeve" · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp | www.dickies.com/products/womens-cooling-performance-short-sleeve-pocke |
| 상품 | Dickies | camoufox | error |  |  |  | www.dickies.com/products/womens-cooling-performance-short-sleeve-pocke |
| 상품 | Dickies | impit | geo | 200 |  | 제목 "Women's Cooling Performance Short Sleeve" · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.dickies.com/products/womens-cooling-performance-short-sleeve-v-nec |
| 상품 | Dickies | site-api | geo | 200 |  | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.dickies.com/products/womens-cooling-performance-short-sleeve-v-nec |
| 상품 | Dickies | wayback | no-archive |  |  |  | www.dickies.com/products/womens-cooling-performance-short-sleeve-v-nec |
| 상품 | Dickies | playwright | geo | 200 |  | 제목 "Women's Cooling Performance Short Sleeve" · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.dickies.com/products/womens-cooling-performance-short-sleeve-v-nec |
| 상품 | Dickies | firefox | geo | 200 |  | 제목 "Women's Cooling Performance Short Sleeve" · 이동 locale -→en-us · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_c | www.dickies.com/products/womens-cooling-performance-short-sleeve-v-nec |
| 상품 | Dickies | camoufox | error |  |  |  | www.dickies.com/products/womens-cooling-performance-short-sleeve-v-nec |
| 상품 | Sessun | impit | blocked | 404 | 알 수 없음 (-) | 제목 "404 Page Not Found" · 흔적 notfound | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | site-api | error |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | wayback | no-archive |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | playwright | blocked | 404 | Cloudflare (중간) | 제목 "404 Page Not Found" · 흔적 notfound · Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | firefox | blocked | 404 | Cloudflare (중간) | 제목 "404 Page Not Found" · 흔적 notfound · Cloudflare: 쿠키 __cf_bm | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | camoufox | error |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | impit | blocked | 404 | 알 수 없음 (-) | 제목 "404 Page Not Found" · 흔적 notfound | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | site-api | error |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | wayback | no-archive |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | playwright | blocked | 404 | Cloudflare (중간) | 제목 "404 Page Not Found" · 흔적 notfound · Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | firefox | blocked | 404 | Cloudflare (중간) | 제목 "404 Page Not Found" · 흔적 notfound · Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | camoufox | error |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | impit | blocked | 404 | 알 수 없음 (-) | 제목 "404 Page Not Found" · 흔적 notfound | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | site-api | error |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | wayback | no-archive |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | playwright | blocked | 404 | Cloudflare (중간) | 제목 "404 Page Not Found" · 흔적 notfound · Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | firefox | blocked | 404 | Cloudflare (중간) | 제목 "404 Page Not Found" · 흔적 notfound · Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Sessun | camoufox | error |  |  |  | static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/pr |
| 상품 | Everlane | wayback | no-archive |  |  |  | www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote |
| 상품 | Everlane | camoufox | error |  |  |  | www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote |
| 상품 | Everlane | wayback | no-archive |  |  |  | www.everlane.com/products/womens-organic-cotton-box-cut-tee-ponderosa- |
| 상품 | Everlane | camoufox | error |  |  |  | www.everlane.com/products/womens-organic-cotton-box-cut-tee-ponderosa- |
| 상품 | Everlane | camoufox | error |  |  |  | www.everlane.com/products/womens-organic-cotton-box-cut-tee-brown-stri |
| 상품 | Lands end | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/products/supima-cotton-long-sleeve-crewneck-t-shirt/i |
| 상품 | Lands end | site-api | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/products/supima-cotton-long-sleeve-crewneck-t-shirt/i |
| 상품 | Lands end | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.landsend.com/products/supima-cotton-long-sleeve-crewneck-t-shirt/i |
| 상품 | Lands end | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp / Cloudflare: 쿠키 __cf_bm | www.landsend.com/products/supima-cotton-long-sleeve-crewneck-t-shirt/i |
| 상품 | Lands end | camoufox | error |  |  |  | www.landsend.com/products/supima-cotton-long-sleeve-crewneck-t-shirt/i |
| 상품 | Lands end | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtl |
| 상품 | Lands end | site-api | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtl |
| 상품 | Lands end | wayback | no-comp |  |  |  | www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtl |
| 상품 | Lands end | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtl |
| 상품 | Lands end | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtl |
| 상품 | Lands end | camoufox | error |  |  |  | www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtl |
| 상품 | Lands end | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/products/supima-cotton-long-sleeve-v-neck-t-shirt/id_ |
| 상품 | Lands end | site-api | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/products/supima-cotton-long-sleeve-v-neck-t-shirt/id_ |
| 상품 | Lands end | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.landsend.com/products/supima-cotton-long-sleeve-v-neck-t-shirt/id_ |
| 상품 | Lands end | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopi | www.landsend.com/products/supima-cotton-long-sleeve-v-neck-t-shirt/id_ |
| 상품 | Lands end | camoufox | error |  |  |  | www.landsend.com/products/supima-cotton-long-sleeve-v-neck-t-shirt/id_ |
| 상품 | Loft | impit | geo | 200 |  | 이동 locale -→on · 흔적 px-script·captcha·maintenance · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): 화면 흔적 px-scr | www.loft.com/gifts/shop-all-gifts/cat3860003/ |
| 상품 | Loft | site-api | error |  |  |  | www.loft.com/gifts/shop-all-gifts/cat3860003/ |
| 상품 | Loft | wayback | no-comp |  |  |  | www.loft.com/gifts/shop-all-gifts/cat3860003/ |
| 상품 | Loft | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.loft.com/gifts/shop-all-gifts/cat3860003/ |
| 상품 | Loft | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_c | www.loft.com/gifts/shop-all-gifts/cat3860003/ |
| 상품 | Loft | camoufox | error |  |  |  | www.loft.com/gifts/shop-all-gifts/cat3860003/ |
| 상품 | Loft | impit | geo | 200 |  | 이동 locale -→on · 흔적 px-script·captcha·maintenance · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): 화면 흔적 px-scr | www.loft.com/clothing/sweaters/catl000012/ |
| 상품 | Loft | site-api | error |  |  |  | www.loft.com/clothing/sweaters/catl000012/ |
| 상품 | Loft | wayback | no-comp |  |  |  | www.loft.com/clothing/sweaters/catl000012/ |
| 상품 | Loft | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.loft.com/clothing/sweaters/catl000012/ |
| 상품 | Loft | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠 | www.loft.com/clothing/sweaters/catl000012/ |
| 상품 | Loft | camoufox | error |  |  |  | www.loft.com/clothing/sweaters/catl000012/ |
| 상품 | Loft | impit | geo | 200 |  | 이동 locale -→on · 흔적 px-script·captcha·maintenance · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): 화면 흔적 px-scr | www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-moder |
| 상품 | Loft | site-api | error |  |  |  | www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-moder |
| 상품 | Loft | wayback | no-archive |  |  |  | www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-moder |
| 상품 | Loft | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-moder |
| 상품 | Loft | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _sho | www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-moder |
| 상품 | Loft | camoufox | error |  |  |  | www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-moder |
| 상품 | Mint velvet | site-api | no-comp | 200 |  | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | mintvelvet.com/products/black-jersey-draped-sleeveless-top |
| 상품 | Mint velvet | wayback | no-archive |  |  |  | mintvelvet.com/products/black-jersey-draped-sleeveless-top |
| 상품 | Mint velvet | camoufox | error |  |  |  | mintvelvet.com/products/black-jersey-draped-sleeveless-top |
| 상품 | Mint velvet | site-api | no-comp | 200 |  | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | mintvelvet.com/products/black-metallic-wool-blend-asymmetric-top |
| 상품 | Mint velvet | wayback | no-archive |  |  |  | mintvelvet.com/products/black-metallic-wool-blend-asymmetric-top |
| 상품 | Mint velvet | camoufox | error |  |  |  | mintvelvet.com/products/black-metallic-wool-blend-asymmetric-top |
| 상품 | Mint velvet | site-api | no-comp | 200 |  | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | mintvelvet.com/products/black-mesh-draped-bubble-hem-top |
| 상품 | Mint velvet | wayback | no-archive |  |  |  | mintvelvet.com/products/black-mesh-draped-bubble-hem-top |
| 상품 | Mint velvet | camoufox | error |  |  |  | mintvelvet.com/products/black-mesh-draped-bubble-hem-top |
| 상품 | Paige | impit | rate-limit | 429 | Vercel (낮음) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 | paige.com/en-kr/products/women-rhodes-tee-whisper-pink |
| 상품 | Paige | site-api | rate-limit | 429 | Vercel (낮음) | Vercel: x-vercel-id 헤더 | paige.com/en-kr/products/women-rhodes-tee-whisper-pink |
| 상품 | Paige | wayback | no-archive |  |  |  | paige.com/en-kr/products/women-rhodes-tee-whisper-pink |
| 상품 | Paige | playwright | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | paige.com/en-kr/products/women-rhodes-tee-whisper-pink |
| 상품 | Paige | firefox | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp / Cloudflare: 쿠키 __cf_bm | paige.com/en-kr/products/women-rhodes-tee-whisper-pink |
| 상품 | Paige | camoufox | error |  |  |  | paige.com/en-kr/products/women-rhodes-tee-whisper-pink |
| 상품 | Paige | impit | rate-limit | 429 | Vercel (낮음) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 | paige.com/en-kr/products/women-shauntay-top-black |
| 상품 | Paige | site-api | rate-limit | 429 | Vercel (낮음) | Vercel: x-vercel-id 헤더 | paige.com/en-kr/products/women-shauntay-top-black |
| 상품 | Paige | wayback | no-archive |  |  |  | paige.com/en-kr/products/women-shauntay-top-black |
| 상품 | Paige | playwright | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | paige.com/en-kr/products/women-shauntay-top-black |
| 상품 | Paige | firefox | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | paige.com/en-kr/products/women-shauntay-top-black |
| 상품 | Paige | camoufox | error |  |  |  | paige.com/en-kr/products/women-shauntay-top-black |
| 상품 | Paige | impit | rate-limit | 429 | Vercel (낮음) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 | paige.com/en-kr/products/women-rhodes-tee-white |
| 상품 | Paige | site-api | rate-limit | 429 | Vercel (낮음) | Vercel: x-vercel-id 헤더 | paige.com/en-kr/products/women-rhodes-tee-white |
| 상품 | Paige | wayback | no-archive |  |  |  | paige.com/en-kr/products/women-rhodes-tee-white |
| 상품 | Paige | playwright | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | paige.com/en-kr/products/women-rhodes-tee-white |
| 상품 | Paige | firefox | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | paige.com/en-kr/products/women-rhodes-tee-white |
| 상품 | Paige | camoufox | error |  |  |  | paige.com/en-kr/products/women-rhodes-tee-white |
| 상품 | rouje | impit | no-comp | 200 |  | 제목 "Top à manches longues en dentelle marine" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy |
| 상품 | rouje | site-api | blocked | 404 | Cloudflare (낮음) | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy |
| 상품 | rouje | wayback | no-archive |  |  |  | www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy |
| 상품 | rouje | playwright | no-comp | 200 |  | 제목 "Top à manches longues en dentelle marine" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy |
| 상품 | rouje | firefox | no-comp | 200 |  | 제목 "Top à manches longues en dentelle marine" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp | www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy |
| 상품 | rouje | camoufox | error |  |  |  | www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy |
| 상품 | rouje | impit | no-comp | 200 |  | 제목 "Top à manches longues gris - Basile / Ro" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/basile-long-sleeve-top-grey |
| 상품 | rouje | site-api | blocked | 404 | Cloudflare (낮음) | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/basile-long-sleeve-top-grey |
| 상품 | rouje | wayback | no-archive |  |  |  | www.rouje.com/products/basile-long-sleeve-top-grey |
| 상품 | rouje | playwright | no-comp | 200 |  | 제목 "Top à manches longues gris - Basile / Ro" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.rouje.com/products/basile-long-sleeve-top-grey |
| 상품 | rouje | firefox | no-comp | 200 |  | 제목 "Top à manches longues gris - Basile / Ro" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/basile-long-sleeve-top-grey |
| 상품 | rouje | camoufox | error |  |  |  | www.rouje.com/products/basile-long-sleeve-top-grey |
| 상품 | rouje | impit | no-comp | 200 |  | 제목 "Top à manches longues gris - Petra / Rou" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/petra-long-sleeve-top-grey |
| 상품 | rouje | site-api | blocked | 404 | Cloudflare (낮음) | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/petra-long-sleeve-top-grey |
| 상품 | rouje | wayback | no-archive |  |  |  | www.rouje.com/products/petra-long-sleeve-top-grey |
| 상품 | rouje | playwright | no-comp | 200 |  | 제목 "Top à manches longues gris - Petra / Rou" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y | www.rouje.com/products/petra-long-sleeve-top-grey |
| 상품 | rouje | firefox | no-comp | 200 |  | 제목 "Top à manches longues gris - Petra / Rou" · 이동 path · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.rouje.com/products/petra-long-sleeve-top-grey |
| 상품 | rouje | camoufox | error |  |  |  | www.rouje.com/products/petra-long-sleeve-top-grey |
| 상품 | Mango | impit | rate-limit | 429 | Vercel (낮음) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 | shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-s |
| 상품 | Mango | site-api | error |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-s |
| 상품 | Mango | wayback | no-archive |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-s |
| 상품 | Mango | playwright | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-s |
| 상품 | Mango | firefox | rate-limit | 429 | Vercel (낮음) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp | shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-s |
| 상품 | Mango | camoufox | error |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-s |
| 상품 | Mango | impit | rate-limit | 429 | Vercel (낮음) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | site-api | error |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | wayback | no-archive |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | playwright | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | firefox | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | camoufox | error |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | impit | rate-limit | 429 | Vercel (낮음) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | site-api | error |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | playwright | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | firefox | rate-limit | 429 | Cloudflare (중간) | 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더 / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Mango | camoufox | error |  |  |  | shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t- |
| 상품 | Spanx | site-api | blocked | 404 | Cloudflare (낮음) | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 cart_currency, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing | spanx.com/products/spanx-airessentials-turtleneck-tunic?v=486832364587 |
| 상품 | Spanx | camoufox | error |  |  |  | spanx.com/products/spanx-airessentials-turtleneck-tunic?v=486832364587 |
| 상품 | Spanx | site-api | blocked | 404 | Cloudflare (낮음) | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 cart_currency, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing | spanx.com/products/spanx-airessentials-crewneck-long-sleeve-top?v=4868 |
| 상품 | Spanx | wayback | error |  |  |  | spanx.com/products/spanx-airessentials-crewneck-long-sleeve-top?v=4868 |
| 상품 | Spanx | camoufox | error |  |  |  | spanx.com/products/spanx-airessentials-crewneck-long-sleeve-top?v=4868 |
| 상품 | Spanx | site-api | blocked | 404 | Cloudflare (낮음) | Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 cart_currency, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing | spanx.com/products/spanx-poplin-oversized-button-up-shirt?v=4868146121 |
| 상품 | Spanx | camoufox | error |  |  |  | spanx.com/products/spanx-poplin-oversized-button-up-shirt?v=4868146121 |
| 상품 | &Other Stories | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-13 |
| 상품 | &Other Stories | site-api | error |  |  |  | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-13 |
| 상품 | &Other Stories | wayback | no-archive |  |  |  | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-13 |
| 상품 | &Other Stories | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-13 |
| 상품 | &Other Stories | firefox | blocked | 200 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-13 |
| 상품 | &Other Stories | camoufox | error |  |  |  | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-13 |
| 상품 | &Other Stories | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924 |
| 상품 | &Other Stories | site-api | error |  |  |  | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924 |
| 상품 | &Other Stories | wayback | no-archive |  |  |  | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924 |
| 상품 | &Other Stories | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924 |
| 상품 | &Other Stories | firefox | blocked | 200 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924 |
| 상품 | &Other Stories | camoufox | error |  |  |  | www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924 |
| 상품 | &Other Stories | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323 |
| 상품 | &Other Stories | site-api | error |  |  |  | www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323 |
| 상품 | &Other Stories | wayback | no-archive |  |  |  | www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323 |
| 상품 | &Other Stories | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_y, 쿠키 _shopify_s | www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323 |
| 상품 | &Other Stories | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323 |
| 상품 | &Other Stories | camoufox | error |  |  |  | www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323 |
| 상품 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_13 |
| 상품 | Reformation | site-api | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_13 |
| 상품 | Reformation | camoufox | error |  |  |  | www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_13 |
| 상품 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_13207 |
| 상품 | Reformation | site-api | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_13207 |
| 상품 | Reformation | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 화면 흔적 cf-challenge / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_13207 |
| 상품 | Reformation | camoufox | error |  |  |  | www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_13207 |
| 상품 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_ |
| 상품 | Reformation | site-api | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_ |
| 상품 | Reformation | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_ |
| 상품 | Reformation | camoufox | error |  |  |  | www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_ |
| 상품 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/ |
| 상품 | The upside | site-api | error |  |  |  | www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/ |
| 상품 | The upside | wayback | no-archive |  |  |  | www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/ |
| 상품 | The upside | camoufox | error |  |  |  | www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/ |
| 상품 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | site-api | error |  |  |  | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | wayback | no-archive |  |  |  | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_mar | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 화면 흔적 cf-challenge / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | camoufox | error |  |  |  | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |
| 상품 | The upside | site-api | error |  |  |  | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |
| 상품 | The upside | wayback | no-archive |  |  |  | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |
| 상품 | The upside | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_mar | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |
| 상품 | The upside | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 쿠키 cf_clearance / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |
| 상품 | The upside | camoufox | error |  |  |  | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |
| 상품 | Whitestuff | site-api | error |  |  |  | www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI |
| 상품 | Whitestuff | wayback | error |  |  |  | www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI |
| 상품 | Whitestuff | camoufox | error |  |  |  | www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI |
| 상품 | Whitestuff | site-api | error |  |  |  | www.whitestuff.com/p/8750/447966-amelia-embroidered-top/MID_PLUM |
| 상품 | Whitestuff | wayback | error |  |  |  | www.whitestuff.com/p/8750/447966-amelia-embroidered-top/MID_PLUM |
| 상품 | Whitestuff | camoufox | error |  |  |  | www.whitestuff.com/p/8750/447966-amelia-embroidered-top/MID_PLUM |
| 상품 | Whitestuff | site-api | error |  |  |  | www.whitestuff.com/p/8647/447994-clara-ls-tee/DK_BLUE |
| 상품 | Whitestuff | wayback | error |  |  |  | www.whitestuff.com/p/8647/447994-clara-ls-tee/DK_BLUE |
| 상품 | Whitestuff | camoufox | error |  |  |  | www.whitestuff.com/p/8647/447994-clara-ls-tee/DK_BLUE |
| 상품 | Wilson | site-api | geo | 200 |  | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.wilson.com/en-us/products/everyday-brami-ww00015 |
| 상품 | Wilson | camoufox | error |  |  |  | www.wilson.com/en-us/products/everyday-brami-ww00015 |
| 상품 | Wilson | site-api | geo | 200 |  | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.wilson.com/en-us/products/on-the-daily-brami-ww00284 |
| 상품 | Wilson | camoufox | error |  |  |  | www.wilson.com/en-us/products/on-the-daily-brami-ww00284 |
| 상품 | Wilson | site-api | geo | 200 |  | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.wilson.com/en-us/products/pro-seamless-tank-ww00024 |
| 상품 | Wilson | wayback | error |  |  |  | www.wilson.com/en-us/products/pro-seamless-tank-ww00024 |
| 상품 | Wilson | camoufox | error |  |  |  | www.wilson.com/en-us/products/pro-seamless-tank-ww00024 |

<details><summary>사유</summary>

- Abercrombie & Fitch — https://www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-62050821
  - impit: 🟡 글 305자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 글 1518자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Abercrombie & Fitch — https://www.abercrombie.com/shop/wd/p/double-lined-long-sleeve-baby-tee-61005323
  - impit: 🟡 글 305자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 글 1518자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Abercrombie & Fitch — https://www.abercrombie.com/shop/wd/p/essential-baby-tee-56537321
  - impit: 🟡 글 305자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 글 1518자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Aritzia — https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Aritzia — https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: 🟡 글 10274자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Aritzia — https://www.aritzia.com/intl/en/product/ezra-top/125956.html
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Arket — https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260712 보관본 · JSON-LD · Cotton 96% / Elastane 4%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Arket — https://www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135758046/
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260125 보관본 · Cotton 96% / Elastane 4%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Arket — https://www.arket.com/en-ww/product/alba-heavyweight-t-shirt-white-1283090001/
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20251109 보관본 · Cotton 100%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Buck Mason — https://www.buckmason.com/products/white-field-spec-boyfriend-crop-tee
  - impit: ✅ JSON-LD · Cotton - With Double The 100%
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ✅ 20261023 보관본 · JSON-LD · Cotton - With Double The 100%
  - playwright: ✅ JSON-LD · Cotton - With Double The 100%
  - firefox: ✅ JSON-LD · Cotton - With Double The 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Buck Mason — https://www.buckmason.com/products/natural-navy-stripe-field-spec-rugby-polo-1
  - impit: ✅ JSON-LD · Cotton - 100% / Cotton Heavy-Duty Slub Je 100%
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ✅ 20261110 보관본 · JSON-LD · Cotton - 100% / Cotton Heavy-Duty Slub Je 100%
  - playwright: ✅ JSON-LD · Cotton - 100% / Cotton Heavy-Duty Slub Je 100%
  - firefox: ✅ JSON-LD · Cotton - 100% / Cotton Heavy-Duty Slub Je 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Buck Mason — https://www.buckmason.com/products/ganache-field-spec-boyfriend-crop-tee
  - impit: ✅ JSON-LD · Cotton - With Double The 100%
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ✅ 20261106 보관본 · JSON-LD · Cotton - With Double The 100%
  - playwright: ✅ JSON-LD · Cotton - With Double The 100%
  - firefox: ✅ JSON-LD · Cotton - With Double The 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Carlhartt — https://www.carhartt.com/product/107391/womens-irvine-relaxed-t-shirt
  - impit: ✅ Cotton 60% / Polyester 40%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20261103 보관본 · Cotton 60% / Polyester 40%
  - playwright: ✅ Cotton 60% / Polyester 40%
  - firefox: ✅ Cotton 60% / Polyester 40%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Carlhartt — https://www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt
  - impit: 🟡 글 25822자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20261007 보관본 · 글 24622자
  - playwright: 🟡 글 14343자
  - firefox: 🟡 글 13399자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Carlhartt — https://www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt
  - impit: 🟡 글 25565자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 14921자
  - firefox: 🟡 글 13361자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Dickies — https://www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc
  - impit: ✅ Cotton 60% / Polyester 40%
  - site-api: ✅ Cotton 60% / Polyester 40%
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 60% / Polyester 40%
  - firefox: ✅ Cotton 60% / Polyester 40%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Dickies — https://www.dickies.com/products/womens-cooling-performance-short-sleeve-pocket-t-shirt-dk0a888ubkh
  - impit: ✅ Polyester 50% / Cotton 25% / Viscose 25%
  - site-api: 🟡 JSON 8015자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Polyester 50% / Cotton 25% / Viscose 25%
  - firefox: ✅ Polyester 50% / Cotton 25% / Viscose 25%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Dickies — https://www.dickies.com/products/womens-cooling-performance-short-sleeve-v-neck-t-shirt-dk0a888kl51
  - impit: ✅ Polyester 50% / Cotton 25% / Viscose 25%
  - site-api: 🟡 JSON 7789자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Polyester 50% / Cotton 25% / Viscose 25%
  - firefox: ✅ Polyester 50% / Cotton 25% / Viscose 25%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-025.webp%20924w
  - impit: ⛔ HTTP 404 404 Page Not Found
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 404 404 Page Not Found
  - firefox: ⛔ HTTP 404 404 Page Not Found
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Otto_almond-Carlea_black-028.webp%20924w
  - impit: ⛔ HTTP 404 404 Page Not Found
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 404 404 Page Not Found
  - firefox: ⛔ HTTP 404 404 Page Not Found
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sessun — https://static.sessun.com/icache/size/924c1156/themes/sessun/images/catalog/product/WXL_Chebbi_blazer_blue-Karty_bluenim-027.webp%20924w
  - impit: ⛔ HTTP 404 404 Page Not Found
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 404 404 Page Not Found
  - firefox: ⛔ HTTP 404 404 Page Not Found
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Everlane — https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote
  - impit: ✅ Cotton 100%
  - site-api: ✅ Cotton 100%
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Everlane — https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-ponderosa-pine
  - impit: ✅ Cotton 100%
  - site-api: ✅ Cotton 100%
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Everlane — https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-brown-stripe
  - impit: ✅ Cotton 100%
  - site-api: ✅ Cotton 100%
  - wayback: ✅ 20260914 보관본 · Cotton 100%
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lands end — https://www.landsend.com/products/supima-cotton-long-sleeve-crewneck-t-shirt/id_302536
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ✅ 20260330 보관본 · Cotton 100%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lands end — https://www.landsend.com/products/womens-relaxed-cotton-long-sleeve-mock-turtleneck/id_302525
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: 🟡 20260330 보관본 · 글 9323자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lands end — https://www.landsend.com/products/supima-cotton-long-sleeve-v-neck-t-shirt/id_244123
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ✅ 20260330 보관본 · Cotton 100%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Loft — https://www.loft.com/gifts/shop-all-gifts/cat3860003/
  - impit: 🟡 글 16251자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20251219 보관본 · 글 70337자
  - playwright: 🟡 글 539자
  - firefox: 🟡 글 539자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Loft — https://www.loft.com/clothing/sweaters/catl000012/
  - impit: 🟡 글 16251자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20260620 보관본 · 글 71006자
  - playwright: 🟡 글 539자
  - firefox: 🟡 글 539자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Loft — https://www.loft.com/clothing/tops/catl000011/diamond-slopes-long-sleeve-modern-tee/711761.html
  - impit: 🟡 글 16251자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 539자
  - firefox: 🟡 글 539자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Mint velvet — https://mintvelvet.com/products/black-jersey-draped-sleeveless-top
  - impit: ✅ Elastane 8% / Nylon 34% / Viscose 58%
  - site-api: 🟡 JSON 6693자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Elastane 8% / Nylon 34% / Viscose 58%
  - firefox: ✅ Elastane 8% / Nylon 34% / Viscose 58%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Mint velvet — https://mintvelvet.com/products/black-metallic-wool-blend-asymmetric-top
  - impit: ✅ Cashmere 5% / Nylon 9% / Polyester 10% / Viscose 33% / Wool 
  - site-api: 🟡 JSON 6435자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cashmere 5% / Nylon 9% / Polyester 10% / Viscose 33% / Wool 
  - firefox: ✅ Cashmere 5% / Nylon 9% / Polyester 10% / Viscose 33% / Wool 
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Mint velvet — https://mintvelvet.com/products/black-mesh-draped-bubble-hem-top
  - impit: ✅ Polyester 95% / Elastane 5%
  - site-api: 🟡 JSON 7080자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Polyester 95% / Elastane 5%
  - firefox: ✅ Polyester 95% / Elastane 5%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Paige — https://paige.com/en-kr/products/women-rhodes-tee-whisper-pink
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - site-api: ⛔ HTTP 429 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Paige — https://paige.com/en-kr/products/women-shauntay-top-black
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - site-api: ⛔ HTTP 429 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Paige — https://paige.com/en-kr/products/women-rhodes-tee-white
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - site-api: ⛔ HTTP 429 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- rouje — https://www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy
  - impit: 🟡 글 11669자
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 14500자
  - firefox: 🟡 글 14314자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- rouje — https://www.rouje.com/products/basile-long-sleeve-top-grey
  - impit: 🟡 글 12039자
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 14945자
  - firefox: 🟡 글 13759자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- rouje — https://www.rouje.com/products/petra-long-sleeve-top-grey
  - impit: 🟡 글 12029자
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 14178자
  - firefox: 🟡 글 14834자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-shirt/37091331/01/00
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/32/00
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/07/00
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260921 보관본 · Polyester 65% / Viscose 32% / Elastane 3%
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Spanx — https://spanx.com/products/spanx-airessentials-turtleneck-tunic?v=48683236458707&bau-context=standard&Color=Very+Black
  - impit: ✅ Modal 47% / Polyester 46% / Elastane 7%
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ✅ 20260211 보관본 · Lyocell 47% / Polyester 46% / Elastane 7%
  - playwright: ✅ Modal 47% / Polyester 46% / Elastane 7%
  - firefox: ✅ Modal 47% / Polyester 46% / Elastane 7%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Spanx — https://spanx.com/products/spanx-airessentials-crewneck-long-sleeve-top?v=48685318963411&bau-context=standard&Color=Very+Black
  - impit: ✅ Modal 47% / Polyester 46% / Elastane 7%
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ❌ fetch failed
  - playwright: ✅ Modal 47% / Polyester 46% / Elastane 7%
  - firefox: ✅ Modal 47% / Polyester 46% / Elastane 7%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Spanx — https://spanx.com/products/spanx-poplin-oversized-button-up-shirt?v=48681461219539&bau-context=standard&Color=Classic+White
  - impit: ✅ Cotton 100%
  - site-api: ⛔ HTTP 404 · JSON 아님
  - wayback: ✅ 20260806 보관본 · Cotton 100%
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- &Other Stories — https://www.stories.com/en-us/product/half-zip-cotton-sweatshirt-dark-brown-1358924005/
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 200 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- &Other Stories — https://www.stories.com/en-us/product/half-zip-cotton-sweatshirt-cream-1358924002/
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 200 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- &Other Stories — https://www.stories.com/en-us/product/scuba-zip-up-jacket-dark-greenwhite-1323866001/
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Reformation — https://www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_1319462ALO_color=ALO
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ✅ 20261106 보관본 · Silk 100%
  - playwright: ✅ Silk 100%
  - firefox: ✅ Silk 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Reformation — https://www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_1320743BLK_color=BLK
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ✅ 20261106 보관본 · Nylon 100%
  - playwright: ✅ Nylon 100%
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Reformation — https://www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_1314146BLK_color=BLK
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ✅ 20260909 보관본 · Silk 100%
  - playwright: ✅ Silk 100% / Viscose 100%
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- The upside — https://www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Nylon 75% / Elastane 25%
  - firefox: ✅ Nylon 75% / Elastane 25%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- The upside — https://www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- The upside — https://www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Whitestuff — https://www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI
  - impit: ✅ Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ fetch failed
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Whitestuff — https://www.whitestuff.com/p/8750/447966-amelia-embroidered-top/MID_PLUM
  - impit: ✅ Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ fetch failed
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Whitestuff — https://www.whitestuff.com/p/8647/447994-clara-ls-tee/DK_BLUE
  - impit: ✅ Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ fetch failed
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Wilson — https://www.wilson.com/en-us/products/everyday-brami-ww00015
  - impit: ✅ Nylon 100%
  - site-api: 🟡 JSON 109433자 · 소재 못 찾음 · 
  - wayback: ✅ 20261110 보관본 · Nylon 100%
  - playwright: ✅ Nylon 100%
  - firefox: ✅ Nylon 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Wilson — https://www.wilson.com/en-us/products/on-the-daily-brami-ww00284
  - impit: ✅ Nylon 100%
  - site-api: 🟡 JSON 102825자 · 소재 못 찾음 · 
  - wayback: ✅ 20261110 보관본 · Nylon 100%
  - playwright: ✅ Nylon 100%
  - firefox: ✅ Nylon 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Wilson — https://www.wilson.com/en-us/products/pro-seamless-tank-ww00024
  - impit: ✅ Nylon 100%
  - site-api: 🟡 JSON 45823자 · 소재 못 찾음 · 
  - wayback: ❌ fetch failed
  - playwright: ✅ Nylon 100%
  - firefox: ✅ Nylon 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)

</details>
