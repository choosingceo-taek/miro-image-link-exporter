# 무료 크롤링 엔진 비교 (2026-11-25T09:00Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45578722275 · 러너 GitHub Actions 1000008380 · 나가는 IP 172.190.93.x · 2026-11-25T08:44Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 49쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 0 | 16 | 33 | 0 | 0·16 | 0·0 | 정상 · 49쪽 · 7s |
| site-api | 0 | 0 | 3 | 46 | 0·0 | 0·0 | 정상 · 49쪽 · 3s |
| wayback | 10 | 9 | 0 | 30 | 10·9 | 0·0 | 정상 · 49쪽 · 54s |
| playwright | 1 | 6 | 39 | 3 | 1·6 | 0·0 | 정상 · 49쪽 · 518s |
| firefox | 9 | 7 | 33 | 0 | 9·7 | 0·0 | 정상 · 49쪽 · 381s |
| camoufox | 0 | 0 | 0 | 49 | 0·0 | 0·0 | 엔진 실행 실패: exit 139 (SIGSEGV) · 0/49쪽까지 · 2s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| Addidas | 3 | 15 | 15/408 | /us/black_friday · /us/men-trending |
| Anthropologie | 3 | 0 | 0/270 |  |
| Chico's | 3 | 0 | 0/800 |  |
| Coldwatercreek | 0 | 200 | 200/200 | /wintertide-waffle-tee/22279/ · /prancing-reindeer-embroidered-tee/26058/ |
| Fatface | 3 | 0 | 0/374 |  |
| FP Movement | 1 | 57 | 57/58 | /fpmovement/performance-tops/ · /fpmovement/casual-tops/ |
| Free People | 3 | 0 | 9/190 |  |
| Garnet hill | 3 | 79 | 101/108 | /holiday-gifts/shops/cashmere-gifts/ · /holiday-gifts/shops/gifts-under-100/ |
| J crew | 0 | 215 | 215/215 | /m/womens/categories/clothing/matching-sets/MQ341 · /m/womens/categories/clothing/tees-and-tanks/MQ334 |
| Joules | 3 | 0 | 0/459 |  |
| Massimo Dutti | 3 | 0 | 0/603 |  |
| Oysho | 0 | 20 | 20/20 | /gb/womens-base-layer-n5063 · /gb/womens-long-sleeve-t-shirts-n4763 |
| Patagonia | 3 | 0 | 0/168 |  |
| Prana | 3 | 0 | 0/81 |  |
| Sezane | 3 | 37 | 50/206 | /us-en/petit-sezane · /us-en/octobre-editions/collection |
| Lululemon | 3 | 4 | 118/476 | /c/women-t-shirts/n1oyr3zwx7wzydf5 · /c/women-classic-fit-t-shirts/n153mlzwx7w |
| The white company | 3 | 0 | 10/68 |  |
| WHBM | 3 | 0 | 0/219 |  |
| H&M | 3 | 0 | 6/744 |  |
| Zara | 3 | 0 | 0/499 |  |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit | site-api | wayback | playwright | firefox | camoufox |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|
| 상품 | [Addidas](https://www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Addidas](https://www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Addidas](https://www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-top) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/pilcro-sequined-twofer-tank) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbed-top) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Fatface](https://www.fatface.com/style/su990707/y56442) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Fatface](https://www.fatface.com/style/su990707/g78330) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Fatface](https://www.fatface.com/style/sv022065/v60690) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [FP Movement](https://itunes.apple.com/us/app/free-people/id659532790) | 🟡 | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| 상품 | [Free People](https://www.freepeople.com/shop/we-the-free-nolan-swit/) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Free People](https://www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Free People](https://www.freepeople.com/shop/we-the-free-surplus-cuff-top/) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Garnet hill](https://www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts-for-her/468762) | 🟡 | ❌ | 🟡 | ⛔ 403 | 🟡 | ❌ |
| 상품 | [Garnet hill](https://www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gifts-for-her/468763) | 🟡 | ❌ | 🟡 | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Garnet hill](https://www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts-for-her/473213) | 🟡 | ❌ | 🟡 | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Joules](https://www.joules.com/style/su928251/g50944) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Joules](https://www.joules.com/style/su924374/y97347) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Joules](https://www.joules.com/style/su796903/g49585) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106) | 🟡 | ❌ | ❌ | ⛔ 403 | 🟡 | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575) | 🟡 | ❌ | ❌ | ⛔ 403 | ✅ | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918) | 🟡 | ❌ | ❌ | ⛔ 403 | 🟡 | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html) | 🟡 | ❌ | ❌ | 🟡 | 🟡 | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html) | 🟡 | ❌ | ❌ | 🟡 | ✅ | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html) | 🟡 | ❌ | ✅ | 🟡 | ✅ | ❌ |
| 상품 | [Prana](https://www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_color=Nautical) | ⛔ 403 | ❌ | ❌ | ✅ | ✅ | ❌ |
| 상품 | [Prana](https://www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_color=Nautical) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Prana](https://www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_color=Dawn%20Heather) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Sezane](https://www.sezane.com/us-en/product/leon-t-shirt/white) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Sezane](https://www.sezane.com/us-en/product/leon-t-shirt/navy) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Sezane](https://www.sezane.com/us-en/product/leon-t-shirt/black) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Lululemon](https://shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8) | ⛔ 403 | ❌ | ✅ | ❌ | ⛔ 403 | ❌ |
| 상품 | [Lululemon](https://shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim) | ⛔ 403 | ❌ | 🟡 | ❌ | ⛔ 403 | ❌ |
| 상품 | [Lululemon](https://shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm) | ⛔ 403 | ❌ | ❌ | ❌ | ⛔ 403 | ❌ |
| 상품 | [The white company](https://www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214) | 🟡 | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| 상품 | [The white company](https://www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245) | 🟡 | ❌ | 🟡 | ⛔ 404 | ⛔ 404 | ❌ |
| 상품 | [The white company](https://www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG) | 🟡 | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| 상품 | [WHBM](https://www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-tee/570421368?inseam=regular&sizeType=regular&color=190&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761602643) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ✅ | ❌ |
| 상품 | [WHBM](https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570405895?inseam=regular&sizeType=regular&color=100&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ✅ | ❌ |
| 상품 | [WHBM](https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570413314?inseam=regular&sizeType=regular&color=7332&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526) | ⛔ 403 | ❌ | ✅ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [H&M](https://www2.hm.com/en_us/productpage.1368126003.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [H&M](https://www2.hm.com/en_us/productpage.1368126004.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [H&M](https://www2.hm.com/en_us/productpage.1375905003.html) | ⛔ 403 | ❌ | ❌ | ⛔ 403 | ⛔ 403 | ❌ |
| 상품 | [Zara](https://www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616513999) | 🟡 | ⛔ 403 | ❌ | ⛔ 403 | ✅ | ❌ |
| 상품 | [Zara](https://www.zara.com/us/en/supima--fitted-t-shirt-p03431641.html?v1=616513972) | 🟡 | ⛔ 403 | ❌ | ⛔ 403 | ✅ | ❌ |
| 상품 | [Zara](https://www.zara.com/us/en/v-neck-t-shirt-p04174315.html?v1=616513966) | 🟡 | ⛔ 403 | 🟡 | ⛔ 403 | ✅ | ❌ |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 상품 | Addidas | impit | blocked | 403 | Akamai (중간) | 제목 "adidas" · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.ht |
| 상품 | Addidas | site-api | error |  |  |  | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.ht |
| 상품 | Addidas | wayback | no-archive |  |  |  | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.ht |
| 상품 | Addidas | playwright | blocked | 403 | Akamai (낮음) | 제목 "adidas" · Akamai: server: AkamaiNetStorage | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.ht |
| 상품 | Addidas | firefox | blocked | 403 | Akamai (중간) | 제목 "adidas" · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.ht |
| 상품 | Addidas | camoufox | error |  |  |  | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.ht |
| 상품 | Addidas | impit | blocked | 403 | Akamai (중간) | 제목 "adidas" · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.ht |
| 상품 | Addidas | site-api | error |  |  |  | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.ht |
| 상품 | Addidas | wayback | no-archive |  |  |  | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.ht |
| 상품 | Addidas | playwright | blocked | 403 | Akamai (낮음) | 제목 "adidas" · Akamai: server: AkamaiNetStorage | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.ht |
| 상품 | Addidas | firefox | blocked | 403 | Akamai (중간) | 제목 "adidas" · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.ht |
| 상품 | Addidas | camoufox | error |  |  |  | www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.ht |
| 상품 | Addidas | impit | blocked | 403 | Akamai (중간) | 제목 "adidas" · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html |
| 상품 | Addidas | site-api | error |  |  |  | www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html |
| 상품 | Addidas | wayback | no-archive |  |  |  | www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html |
| 상품 | Addidas | playwright | blocked | 403 | Akamai (낮음) | 제목 "adidas" · Akamai: server: AkamaiNetStorage | www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html |
| 상품 | Addidas | firefox | blocked | 403 | Akamai (중간) | 제목 "adidas" · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html |
| 상품 | Addidas | camoufox | error |  |  |  | www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html |
| 상품 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | site-api | error |  |  |  | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | wayback | no-archive |  |  |  | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/i.js, 불러온 주소 geo.captcha-delivery.com/interstitial/, 불러온 주소 ct.captcha-delivery.com/ac5b013433546af5.js / Akamai: 쿠키 _abck, 쿠키 bm | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | camoufox | error |  |  |  | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | site-api | error |  |  |  | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | wayback | no-archive |  |  |  | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/85bbf9ab726e39e1.js / Akamai: 쿠키 bm_so, 쿠키 bm_sz,  | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | camoufox | error |  |  |  | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Anthropologie | site-api | error |  |  |  | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Anthropologie | wayback | no-archive |  |  |  | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Anthropologie | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/1f8381863971542d.js / Akamai: 쿠키 bm_so, 쿠키 bm_sz,  | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Anthropologie | camoufox | error |  |  |  | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | site-api | error |  |  |  | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | wayback | no-archive |  |  |  | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/57035 |
| 상품 | Chico's | site-api | error |  |  |  | www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/57035 |
| 상품 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/57035 |
| 상품 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/57035 |
| 상품 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/57035 |
| 상품 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Chico's | site-api | error |  |  |  | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Chico's | wayback | no-archive |  |  |  | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Fatface | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.fatface.com/style/su990707/y56442 |
| 상품 | Fatface | site-api | error |  |  |  | www.fatface.com/style/su990707/y56442 |
| 상품 | Fatface | wayback | no-archive |  |  |  | www.fatface.com/style/su990707/y56442 |
| 상품 | Fatface | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.fatface.com/style/su990707/y56442 |
| 상품 | Fatface | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.fatface.com/style/su990707/y56442 |
| 상품 | Fatface | camoufox | error |  |  |  | www.fatface.com/style/su990707/y56442 |
| 상품 | Fatface | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.fatface.com/style/su990707/g78330 |
| 상품 | Fatface | site-api | error |  |  |  | www.fatface.com/style/su990707/g78330 |
| 상품 | Fatface | wayback | no-archive |  |  |  | www.fatface.com/style/su990707/g78330 |
| 상품 | Fatface | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.fatface.com/style/su990707/g78330 |
| 상품 | Fatface | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.fatface.com/style/su990707/g78330 |
| 상품 | Fatface | camoufox | error |  |  |  | www.fatface.com/style/su990707/g78330 |
| 상품 | Fatface | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.fatface.com/style/sv022065/v60690 |
| 상품 | Fatface | site-api | error |  |  |  | www.fatface.com/style/sv022065/v60690 |
| 상품 | Fatface | wayback | no-archive |  |  |  | www.fatface.com/style/sv022065/v60690 |
| 상품 | Fatface | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.fatface.com/style/sv022065/v60690 |
| 상품 | Fatface | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.fatface.com/style/sv022065/v60690 |
| 상품 | Fatface | camoufox | error |  |  |  | www.fatface.com/style/sv022065/v60690 |
| 상품 | FP Movement | impit | no-comp | 200 |  | 제목 "‎Free People App - App Store" · 이동 host itunes.apple.com→apps.apple.com · Fastly: x-served-by/fastly 헤더 | itunes.apple.com/us/app/free-people/id659532790 |
| 상품 | FP Movement | site-api | error |  |  |  | itunes.apple.com/us/app/free-people/id659532790 |
| 상품 | FP Movement | wayback | no-comp |  |  |  | itunes.apple.com/us/app/free-people/id659532790 |
| 상품 | FP Movement | playwright | no-comp | 200 |  | 제목 "‎Free People App - App Store" · 이동 host itunes.apple.com→apps.apple.com · Fastly: x-served-by/fastly 헤더 | itunes.apple.com/us/app/free-people/id659532790 |
| 상품 | FP Movement | firefox | no-comp | 200 |  | 제목 "‎Free People App - App Store" · 이동 host itunes.apple.com→apps.apple.com · Fastly: x-served-by/fastly 헤더 / Akamai: 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | itunes.apple.com/us/app/free-people/id659532790 |
| 상품 | FP Movement | camoufox | error |  |  |  | itunes.apple.com/us/app/free-people/id659532790 |
| 상품 | Free People | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/shop/we-the-free-nolan-swit/ |
| 상품 | Free People | site-api | error |  |  |  | www.freepeople.com/shop/we-the-free-nolan-swit/ |
| 상품 | Free People | wayback | no-archive |  |  |  | www.freepeople.com/shop/we-the-free-nolan-swit/ |
| 상품 | Free People | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/shop/we-the-free-nolan-swit/ |
| 상품 | Free People | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/85bbf9ab726e39e1.js / Akamai: 쿠키 _abck, 쿠키 bm_so, 쿠키  | www.freepeople.com/shop/we-the-free-nolan-swit/ |
| 상품 | Free People | camoufox | error |  |  |  | www.freepeople.com/shop/we-the-free-nolan-swit/ |
| 상품 | Free People | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/ |
| 상품 | Free People | site-api | error |  |  |  | www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/ |
| 상품 | Free People | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/ |
| 상품 | Free People | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/85bbf9ab726e39e1.js / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키  | www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/ |
| 상품 | Free People | camoufox | error |  |  |  | www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/ |
| 상품 | Free People | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/shop/we-the-free-surplus-cuff-top/ |
| 상품 | Free People | site-api | error |  |  |  | www.freepeople.com/shop/we-the-free-surplus-cuff-top/ |
| 상품 | Free People | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/shop/we-the-free-surplus-cuff-top/ |
| 상품 | Free People | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/1f8381863971542d.js / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키  | www.freepeople.com/shop/we-the-free-surplus-cuff-top/ |
| 상품 | Free People | camoufox | error |  |  |  | www.freepeople.com/shop/we-the-free-surplus-cuff-top/ |
| 상품 | Garnet hill | impit | no-comp | 200 |  | 제목 "Essential Long-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | site-api | error |  |  |  | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | wayback | no-comp |  |  |  | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | firefox | no-comp | 200 |  | 제목 "Essential Long-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | camoufox | error |  |  |  | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | impit | no-comp | 200 |  | 제목 "Essential Short-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | site-api | error |  |  |  | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | wayback | no-comp |  |  |  | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | camoufox | error |  |  |  | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | impit | no-comp | 200 |  | 제목 "Essential Turtleneck Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Garnet hill | site-api | error |  |  |  | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Garnet hill | wayback | no-comp |  |  |  | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Garnet hill | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Garnet hill | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Garnet hill | camoufox | error |  |  |  | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Joules | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/style/su928251/g50944 |
| 상품 | Joules | site-api | error |  |  |  | www.joules.com/style/su928251/g50944 |
| 상품 | Joules | wayback | no-archive |  |  |  | www.joules.com/style/su928251/g50944 |
| 상품 | Joules | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.joules.com/style/su928251/g50944 |
| 상품 | Joules | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.joules.com/style/su928251/g50944 |
| 상품 | Joules | camoufox | error |  |  |  | www.joules.com/style/su928251/g50944 |
| 상품 | Joules | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/style/su924374/y97347 |
| 상품 | Joules | site-api | error |  |  |  | www.joules.com/style/su924374/y97347 |
| 상품 | Joules | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.joules.com/style/su924374/y97347 |
| 상품 | Joules | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.joules.com/style/su924374/y97347 |
| 상품 | Joules | camoufox | error |  |  |  | www.joules.com/style/su924374/y97347 |
| 상품 | Joules | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/style/su796903/g49585 |
| 상품 | Joules | site-api | error |  |  |  | www.joules.com/style/su796903/g49585 |
| 상품 | Joules | wayback | no-archive |  |  |  | www.joules.com/style/su796903/g49585 |
| 상품 | Joules | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.joules.com/style/su796903/g49585 |
| 상품 | Joules | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.joules.com/style/su796903/g49585 |
| 상품 | Joules | camoufox | error |  |  |  | www.joules.com/style/su796903/g49585 |
| 상품 | Massimo Dutti | impit | no-comp | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106 |
| 상품 | Massimo Dutti | site-api | error |  |  |  | www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106 |
| 상품 | Massimo Dutti | wayback | no-archive |  |  |  | www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106 |
| 상품 | Massimo Dutti | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106 |
| 상품 | Massimo Dutti | firefox | no-comp | 200 |  | 제목 "Striped henley knit T-shirt · Navy Blue " · Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc, 쿠키 bm_sv | www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106 |
| 상품 | Massimo Dutti | camoufox | error |  |  |  | www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106 |
| 상품 | Massimo Dutti | impit | no-comp | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/buttoned-henley-tshirt-l06863575 |
| 상품 | Massimo Dutti | site-api | error |  |  |  | www.massimodutti.com/us/buttoned-henley-tshirt-l06863575 |
| 상품 | Massimo Dutti | wayback | no-archive |  |  |  | www.massimodutti.com/us/buttoned-henley-tshirt-l06863575 |
| 상품 | Massimo Dutti | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/buttoned-henley-tshirt-l06863575 |
| 상품 | Massimo Dutti | camoufox | error |  |  |  | www.massimodutti.com/us/buttoned-henley-tshirt-l06863575 |
| 상품 | Massimo Dutti | impit | no-comp | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918 |
| 상품 | Massimo Dutti | site-api | error |  |  |  | www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918 |
| 상품 | Massimo Dutti | wayback | no-archive |  |  |  | www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918 |
| 상품 | Massimo Dutti | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918 |
| 상품 | Massimo Dutti | firefox | no-comp | 200 |  | 제목 "Cotton blend bib detail T-shirt · Off Wh" · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918 |
| 상품 | Massimo Dutti | camoufox | error |  |  |  | www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918 |
| 상품 | Patagonia | impit | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.ht |
| 상품 | Patagonia | site-api | error |  |  |  | www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.ht |
| 상품 | Patagonia | wayback | no-archive |  |  |  | www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.ht |
| 상품 | Patagonia | playwright | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.ht |
| 상품 | Patagonia | firefox | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.ht |
| 상품 | Patagonia | camoufox | error |  |  |  | www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.ht |
| 상품 | Patagonia | impit | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html |
| 상품 | Patagonia | site-api | error |  |  |  | www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html |
| 상품 | Patagonia | wayback | no-archive |  |  |  | www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html |
| 상품 | Patagonia | playwright | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html |
| 상품 | Patagonia | camoufox | error |  |  |  | www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html |
| 상품 | Patagonia | impit | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-ble |
| 상품 | Patagonia | site-api | error |  |  |  | www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-ble |
| 상품 | Patagonia | playwright | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-ble |
| 상품 | Patagonia | camoufox | error |  |  |  | www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-ble |
| 상품 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-challenge·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 화면 흔적 cf-block | www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_co |
| 상품 | Prana | site-api | error |  |  |  | www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_co |
| 상품 | Prana | wayback | no-archive |  |  |  | www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_co |
| 상품 | Prana | camoufox | error |  |  |  | www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_co |
| 상품 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-challenge·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 화면 흔적 cf-block | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | site-api | error |  |  |  | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | playwright | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / HUMAN(PerimeterX): 화면 흔적 px-challenge, 화면 흔적 px-script, 불러온 주소 client.px-cloud.net/PXLkXIE7Oj/main.min.js, 불러온 주소 ift.px-cloud.net/ns, 불러온 주소 collector-pxlkxie7oj.px | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-block / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc, 쿠키 bm_sv | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | camoufox | error |  |  |  | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-challenge·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 화면 흔적 cf-block | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Prana | site-api | error |  |  |  | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Prana | wayback | no-archive |  |  |  | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Prana | playwright | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / HUMAN(PerimeterX): 화면 흔적 px-challenge, 화면 흔적 px-script, 불러온 주소 client.px-cloud.net/PXLkXIE7Oj/main.min.js, 불러온 주소 ift.px-cloud.net/ns, 불러온 주소 collector-pxlkxie7oj.px | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Prana | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-block / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc, 쿠키 bm_sv | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Prana | camoufox | error |  |  |  | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Sezane | impit | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/product/leon-t-shirt/white |
| 상품 | Sezane | site-api | error |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/white |
| 상품 | Sezane | wayback | no-archive |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/white |
| 상품 | Sezane | playwright | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/product/leon-t-shirt/white |
| 상품 | Sezane | firefox | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/85bbf9ab726e39e1.js / CloudFront: x-amz-cf-* 헤더 / Akamai: | www.sezane.com/us-en/product/leon-t-shirt/white |
| 상품 | Sezane | camoufox | error |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/white |
| 상품 | Sezane | impit | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/product/leon-t-shirt/navy |
| 상품 | Sezane | site-api | error |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/navy |
| 상품 | Sezane | wayback | no-archive |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/navy |
| 상품 | Sezane | playwright | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/product/leon-t-shirt/navy |
| 상품 | Sezane | firefox | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/i.js, 불러온 주소 geo.captcha-delivery.com/interstitial/, 불러온 주소 ct.captcha-delivery.com/39895aacf60e24ab.js / CloudFront: x-amz-cf-* 헤더 / Ak | www.sezane.com/us-en/product/leon-t-shirt/navy |
| 상품 | Sezane | camoufox | error |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/navy |
| 상품 | Sezane | impit | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/product/leon-t-shirt/black |
| 상품 | Sezane | site-api | error |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/black |
| 상품 | Sezane | playwright | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/product/leon-t-shirt/black |
| 상품 | Sezane | firefox | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/1f8381863971542d.js / CloudFront: x-amz-cf-* 헤더 / Akamai: | www.sezane.com/us-en/product/leon-t-shirt/black |
| 상품 | Sezane | camoufox | error |  |  |  | www.sezane.com/us-en/product/leon-t-shirt/black |
| 상품 | Lululemon | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8 |
| 상품 | Lululemon | site-api | error |  |  |  | shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8 |
| 상품 | Lululemon | playwright | timeout |  |  |  | shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8 |
| 상품 | Lululemon | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8 |
| 상품 | Lululemon | camoufox | error |  |  |  | shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8 |
| 상품 | Lululemon | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim |
| 상품 | Lululemon | site-api | error |  |  |  | shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim |
| 상품 | Lululemon | wayback | no-comp |  |  |  | shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim |
| 상품 | Lululemon | playwright | timeout |  |  |  | shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim |
| 상품 | Lululemon | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim |
| 상품 | Lululemon | camoufox | error |  |  |  | shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim |
| 상품 | Lululemon | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm |
| 상품 | Lululemon | site-api | error |  |  |  | shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm |
| 상품 | Lululemon | wayback | no-archive |  |  |  | shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm |
| 상품 | Lululemon | playwright | timeout |  |  |  | shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm |
| 상품 | Lululemon | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm |
| 상품 | Lululemon | camoufox | error |  |  |  | shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm |
| 상품 | The white company | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214 |
| 상품 | The white company | site-api | error |  |  |  | www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214 |
| 상품 | The white company | wayback | no-comp |  |  |  | www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214 |
| 상품 | The white company | playwright | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더 | www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214 |
| 상품 | The white company | firefox | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214 |
| 상품 | The white company | camoufox | error |  |  |  | www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214 |
| 상품 | The white company | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245 |
| 상품 | The white company | site-api | error |  |  |  | www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245 |
| 상품 | The white company | wayback | no-comp |  |  |  | www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245 |
| 상품 | The white company | playwright | blocked | 404 | Akamai (낮음) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더 | www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245 |
| 상품 | The white company | firefox | blocked | 404 | Akamai (중간) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245 |
| 상품 | The white company | camoufox | error |  |  |  | www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245 |
| 상품 | The white company | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG |
| 상품 | The white company | site-api | error |  |  |  | www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG |
| 상품 | The white company | wayback | no-comp |  |  |  | www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG |
| 상품 | The white company | playwright | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더 | www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG |
| 상품 | The white company | firefox | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG |
| 상품 | The white company | camoufox | error |  |  |  | www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG |
| 상품 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-t |
| 상품 | WHBM | site-api | error |  |  |  | www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-t |
| 상품 | WHBM | wayback | no-archive |  |  |  | www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-t |
| 상품 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-t |
| 상품 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-t |
| 상품 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | site-api | error |  |  |  | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | site-api | error |  |  |  | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | H&M | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www2.hm.com/en_us/productpage.1368126003.html |
| 상품 | H&M | site-api | error |  |  |  | www2.hm.com/en_us/productpage.1368126003.html |
| 상품 | H&M | wayback | no-archive |  |  |  | www2.hm.com/en_us/productpage.1368126003.html |
| 상품 | H&M | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www2.hm.com/en_us/productpage.1368126003.html |
| 상품 | H&M | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www2.hm.com/en_us/productpage.1368126003.html |
| 상품 | H&M | camoufox | error |  |  |  | www2.hm.com/en_us/productpage.1368126003.html |
| 상품 | H&M | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www2.hm.com/en_us/productpage.1368126004.html |
| 상품 | H&M | site-api | error |  |  |  | www2.hm.com/en_us/productpage.1368126004.html |
| 상품 | H&M | wayback | no-archive |  |  |  | www2.hm.com/en_us/productpage.1368126004.html |
| 상품 | H&M | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www2.hm.com/en_us/productpage.1368126004.html |
| 상품 | H&M | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www2.hm.com/en_us/productpage.1368126004.html |
| 상품 | H&M | camoufox | error |  |  |  | www2.hm.com/en_us/productpage.1368126004.html |
| 상품 | H&M | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www2.hm.com/en_us/productpage.1375905003.html |
| 상품 | H&M | site-api | error |  |  |  | www2.hm.com/en_us/productpage.1375905003.html |
| 상품 | H&M | wayback | no-archive |  |  |  | www2.hm.com/en_us/productpage.1375905003.html |
| 상품 | H&M | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www2.hm.com/en_us/productpage.1375905003.html |
| 상품 | H&M | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc / Cloudflare: 쿠키 __cf_bm | www2.hm.com/en_us/productpage.1375905003.html |
| 상품 | H&M | camoufox | error |  |  |  | www2.hm.com/en_us/productpage.1375905003.html |
| 상품 | Zara | impit | no-comp | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616 |
| 상품 | Zara | site-api | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 쿠키 _abck, 쿠키 bm_sz, 화면 흔적 akamai-deny | www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616 |
| 상품 | Zara | wayback | no-archive |  |  |  | www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616 |
| 상품 | Zara | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616 |
| 상품 | Zara | camoufox | error |  |  |  | www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616 |
| 상품 | Zara | impit | no-comp | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.zara.com/us/en/supima--fitted-t-shirt-p03431641.html?v1=616513972 |
| 상품 | Zara | site-api | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 쿠키 _abck, 쿠키 bm_sz, 화면 흔적 akamai-deny | www.zara.com/us/en/supima--fitted-t-shirt-p03431641.html?v1=616513972 |
| 상품 | Zara | wayback | no-archive |  |  |  | www.zara.com/us/en/supima--fitted-t-shirt-p03431641.html?v1=616513972 |
| 상품 | Zara | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.zara.com/us/en/supima--fitted-t-shirt-p03431641.html?v1=616513972 |
| 상품 | Zara | camoufox | error |  |  |  | www.zara.com/us/en/supima--fitted-t-shirt-p03431641.html?v1=616513972 |
| 상품 | Zara | impit | no-comp | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.zara.com/us/en/v-neck-t-shirt-p04174315.html?v1=616513966 |
| 상품 | Zara | site-api | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 쿠키 _abck, 쿠키 bm_sz, 화면 흔적 akamai-deny | www.zara.com/us/en/v-neck-t-shirt-p04174315.html?v1=616513966 |
| 상품 | Zara | wayback | no-comp |  |  |  | www.zara.com/us/en/v-neck-t-shirt-p04174315.html?v1=616513966 |
| 상품 | Zara | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.zara.com/us/en/v-neck-t-shirt-p04174315.html?v1=616513966 |
| 상품 | Zara | camoufox | error |  |  |  | www.zara.com/us/en/v-neck-t-shirt-p04174315.html?v1=616513966 |

<details><summary>사유</summary>

- Addidas — https://www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7943.html
  - impit: ⛔ HTTP 403 adidas
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 adidas
  - firefox: ⛔ HTTP 403 adidas
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Addidas — https://www.adidas.com/us/essentials-small-logo-feel-cozy-sweatshirt/IX7940.html
  - impit: ⛔ HTTP 403 adidas
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 adidas
  - firefox: ⛔ HTTP 403 adidas
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Addidas — https://www.adidas.com/us/knit-essentials-boucle-crew-sweatshirt/LI0121.html
  - impit: ⛔ HTTP 403 adidas
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 adidas
  - firefox: ⛔ HTTP 403 adidas
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-top
  - impit: ⛔ HTTP 403 anthropologie.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Anthropologie — https://www.anthropologie.com/shop/pilcro-sequined-twofer-tank
  - impit: ⛔ HTTP 403 anthropologie.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbed-top
  - impit: ⛔ HTTP 403 anthropologie.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260515 보관본 · Viscose 95% / Elastane 5%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Fatface — https://www.fatface.com/style/su990707/y56442
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Fatface — https://www.fatface.com/style/su990707/g78330
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Fatface — https://www.fatface.com/style/sv022065/v60690
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- FP Movement — https://itunes.apple.com/us/app/free-people/id659532790
  - impit: 🟡 글 23397자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20181005 보관본 · 글 12382자
  - playwright: 🟡 글 23536자
  - firefox: 🟡 글 23536자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Free People — https://www.freepeople.com/shop/we-the-free-nolan-swit/
  - impit: ⛔ HTTP 403 freepeople.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Free People — https://www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/
  - impit: ⛔ HTTP 403 freepeople.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20261021 보관본 · Cotton 50% / Modal 50%
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Free People — https://www.freepeople.com/shop/we-the-free-surplus-cuff-top/
  - impit: ⛔ HTTP 403 freepeople.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20261117 보관본 · Cotton 95% / Elastane 5%
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Garnet hill — https://www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts-for-her/468762
  - impit: 🟡 글 41자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20261026 보관본 · 글 41자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: 🟡 글 4405자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Garnet hill — https://www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gifts-for-her/468763
  - impit: 🟡 글 42자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20261016 보관본 · 글 42자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Garnet hill — https://www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts-for-her/473213
  - impit: 🟡 글 40자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20261016 보관본 · 글 40자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Joules — https://www.joules.com/style/su928251/g50944
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Joules — https://www.joules.com/style/su924374/y97347
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260712 보관본 · JSON-LD · Main 100% / Rib 95% / Elastane 5%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Joules — https://www.joules.com/style/su796903/g49585
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Massimo Dutti — https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
  - impit: 🟡 글 8자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: 🟡 글 3130자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Massimo Dutti — https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575
  - impit: 🟡 글 8자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Lyocell 70% / Wool 30%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918
  - impit: 🟡 글 8자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: 🟡 글 23135자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Patagonia — https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html
  - impit: 🟡 글 1009자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 1017자
  - firefox: 🟡 글 1017자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Patagonia — https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html
  - impit: 🟡 글 1009자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 1017자
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html
  - impit: 🟡 글 1009자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260423 보관본 · Wool 65% / Polyester 35%
  - playwright: 🟡 글 1017자
  - firefox: ✅ Wool 65% / Polyester 35%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Prana — https://www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_color=Nautical
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Prana — https://www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_color=Nautical
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260409 보관본 · Cotton 100%
  - playwright: ⛔ HTTP 403 Access to this page has been denied
  - firefox: ⛔ HTTP 403 Attention Required! | Cloudflare
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Prana — https://www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_color=Dawn%20Heather
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access to this page has been denied
  - firefox: ⛔ HTTP 403 Attention Required! | Cloudflare
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sezane — https://www.sezane.com/us-en/product/leon-t-shirt/white
  - impit: ⛔ HTTP 403 sezane.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sezane — https://www.sezane.com/us-en/product/leon-t-shirt/navy
  - impit: ⛔ HTTP 403 sezane.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sezane — https://www.sezane.com/us-en/product/leon-t-shirt/black
  - impit: ⛔ HTTP 403 sezane.com
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260821 보관본 · JSON-LD · Organic Cotton - Organic 100%
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lululemon — https://shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260719 보관본 · Cotton 91% / Elastane 9%
  - playwright: ❌ page.goto: Timeout 45000ms exceeded.
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lululemon — https://shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20260810 보관본 · 글 8012자
  - playwright: ❌ page.goto: Timeout 45000ms exceeded.
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lululemon — https://shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ❌ page.goto: Timeout 45000ms exceeded.
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- The white company — https://www.thewhitecompany.com/uk/Fleeceback-Turn-Up-Cuff-Jogger/p/A07214
  - impit: 🟡 글 312자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20260415 보관본 · 글 13353자
  - playwright: 🟡 글 316자
  - firefox: 🟡 글 316자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- The white company — https://www.thewhitecompany.com/uk/Zip-Through-Hoodie-with-Cotton/p/A17245
  - impit: 🟡 글 312자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20260713 보관본 · 글 13736자
  - playwright: ⛔ HTTP 404 Page Not Found | The White Company US
  - firefox: ⛔ HTTP 404 Page Not Found | The White Company US
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- The white company — https://www.thewhitecompany.com/uk/Ultimate-Leggings/p/LLCNG
  - impit: 🟡 글 312자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20260417 보관본 · 글 13555자
  - playwright: 🟡 글 316자
  - firefox: 🟡 글 316자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-tee/570421368?inseam=regular&sizeType=regular&color=190&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761602643
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Polyester 96% / Elastane 4% / Cotton 54% / Modal 41% / Elast
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570405895?inseam=regular&sizeType=regular&color=100&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260608 보관본 · Cotton 95% / Elastane 5%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Cotton 95% / Elastane 5%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570413314?inseam=regular&sizeType=regular&color=7332&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260721 보관본 · Cotton 95% / Elastane 5%
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- H&M — https://www2.hm.com/en_us/productpage.1368126003.html
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- H&M — https://www2.hm.com/en_us/productpage.1368126004.html
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- H&M — https://www2.hm.com/en_us/productpage.1375905003.html
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Zara — https://www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616513999
  - impit: 🟡 글 8자
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Zara — https://www.zara.com/us/en/supima--fitted-t-shirt-p03431641.html?v1=616513972
  - impit: 🟡 글 8자
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Zara — https://www.zara.com/us/en/v-neck-t-shirt-p04174315.html?v1=616513966
  - impit: 🟡 글 8자
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: 🟡 20260220 보관본 · 글 8자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Cotton 93% / Elastane 7%
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)

</details>
