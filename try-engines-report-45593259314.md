# 무료 크롤링 엔진 비교 (2026-11-25T10:24Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45593259314 · 러너 GitHub Actions 1000008433 · 나가는 IP 4.154.153.x · 2026-11-25T10:17Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 26쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 2 | 3 | 21 | 0 | 2·3 | 0·0 | 정상 · 26쪽 · 7s |
| firefox | 8 | 2 | 16 | 0 | 8·2 | 0·0 | 정상 · 26쪽 · 206s |
| firefox-fresh | 8 | 3 | 15 | 0 | 8·3 | 0·0 | 정상 · 26쪽 · 217s |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit | firefox | firefox-fresh |
|---|---|:-:|:-:|:-:|
| 상품 | [Sessun](https://us.sessun.com/catalogue/shirt-and-blouses/vence-meloroad.html) | ✅ | ✅ | ✅ |
| 상품 | [Sessun](https://us.sessun.com/catalogue/shirt-and-blouses/leonie-murza-playgrid.html) | ✅ | ✅ | ✅ |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-top) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/pilcro-sequined-twofer-tank) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbed-top) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249) | ⛔ 403 | ✅ | ⛔ 403 |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997) | ⛔ 403 | ✅ | ⛔ 403 |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Garnet hill](https://www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts-for-her/468762) | 🟡 | 🟡 | 🟡 |
| 상품 | [Garnet hill](https://www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gifts-for-her/468763) | 🟡 | ⛔ 403 | 🟡 |
| 상품 | [Garnet hill](https://www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts-for-her/473213) | 🟡 | ⛔ 403 | 🟡 |
| 상품 | [Prana](https://www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_color=Nautical) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Prana](https://www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_color=Nautical) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Prana](https://www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_color=Dawn%20Heather) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [WHBM](https://www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-tee/570421368?inseam=regular&sizeType=regular&color=190&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761602643) | ⛔ 403 | ✅ | ⛔ 403 |
| 상품 | [WHBM](https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570405895?inseam=regular&sizeType=regular&color=100&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526) | ⛔ 403 | ✅ | ⛔ 403 |
| 상품 | [WHBM](https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570413314?inseam=regular&sizeType=regular&color=7332&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html) | ⛔ 403 | 🟡 | ⛔ 403 |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/ezra-top/125956.html) | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 상품 | [Reformation](https://www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_1319462ALO_color=ALO) | ⛔ 403 | ✅ | ✅ |
| 상품 | [Reformation](https://www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_1320743BLK_color=BLK) | ⛔ 403 | ⛔ 403 | ✅ |
| 상품 | [Reformation](https://www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_1314146BLK_color=BLK) | ⛔ 403 | ⛔ 403 | ✅ |
| 상품 | [The upside](https://www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/) | ⛔ 403 | ✅ | ✅ |
| 상품 | [The upside](https://www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/) | ⛔ 403 | ⛔ 403 | ✅ |
| 상품 | [The upside](https://www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/) | ⛔ 403 | ⛔ 403 | ✅ |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 상품 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/i.js, 불러온 주소 geo.captcha-delivery.com/interstitial/ | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-t |
| 상품 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/shop/pilcro-sequined-twofer-tank |
| 상품 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Anthropologie | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbe |
| 상품 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-te |
| 상품 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/57035 |
| 상품 | Chico's | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/57035 |
| 상품 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 ak_bmsc, 쿠키 bm_sv, 쿠키 _abck, 쿠키 bm_so | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Chico's | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/57042 |
| 상품 | Garnet hill | impit | no-comp | 200 |  | 제목 "Essential Long-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | firefox | no-comp | 200 |  | 제목 "Essential Long-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | firefox-fresh | no-comp | 200 |  | 제목 "Essential Long-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts |
| 상품 | Garnet hill | impit | no-comp | 200 |  | 제목 "Essential Short-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | firefox-fresh | no-comp | 200 |  | 제목 "Essential Short-Sleeve Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gift |
| 상품 | Garnet hill | impit | no-comp | 200 |  | 제목 "Essential Turtleneck Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Garnet hill | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Garnet hill | firefox-fresh | no-comp | 200 |  | 제목 "Essential Turtleneck Tee / Garnet Hill" · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts- |
| 상품 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 화면 흔적 cf-block | www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_co |
| 상품 | Prana | firefox | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠 | www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_co |
| 상품 | Prana | firefox-fresh | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠 | www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_co |
| 상품 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 화면 흔적 cf-block | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-block / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠키 _px3, 쿠키 pxcts, 쿠키 _pxde | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | firefox-fresh | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 cf_clearance, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠 | www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_c |
| 상품 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 화면 흔적 cf-block | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Prana | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-block / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠키 _px3, 쿠키 pxcts, 쿠키 _pxde | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | Prana | firefox-fresh | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-block·px-script · Cloudflare: cf-ray 헤더, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠 | www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_ |
| 상품 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-t |
| 상품 | WHBM | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-t |
| 상품 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 ak_bmsc, 쿠키 bm_sv, 쿠키 _abck, 쿠키 bm_so | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | WHBM | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-ne |
| 상품 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc | www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/1 |
| 상품 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | firefox | geo | 200 |  | 제목 "Caprice Satin Bustier / Aritzia US" · 이동 locale intl/en→us/en · 흔적 cf-script · Cloudflare: cf-ray 헤더, 쿠키 _cfuvid, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-script / CloudFront: x-amz-cf-* 헤더 | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc | www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html |
| 상품 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Aritzia | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 _cfuvid, 쿠키 cf_clearance, 쿠키 __cf_bm | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Aritzia | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc | www.aritzia.com/intl/en/product/ezra-top/125956.html |
| 상품 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_13 |
| 상품 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_13207 |
| 상품 | Reformation | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-challenge / Salesforce Commerce Cloud: 쿠키 dwac_0644a165d42080eb78142cac75, 쿠키 dwanonymous_914668167e2805280fee994f0c25aa1b,  | www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_13207 |
| 상품 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_ |
| 상품 | Reformation | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-challenge / Salesforce Commerce Cloud: 쿠키 dwac_0644a165d42080eb78142cac75, 쿠키 dwanonymous_914668167e2805280fee994f0c25aa1b,  | www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_ |
| 상품 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/ |
| 상품 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 cf_clearance, 화면 흔적 cf-challenge | www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/ |
| 상품 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |
| 상품 | The upside | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 cf_clearance, 화면 흔적 cf-challenge | www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/ |

<details><summary>사유</summary>

- Sessun — https://us.sessun.com/catalogue/shirt-and-blouses/vence-meloroad.html
  - impit: ✅ Viscose 100%
  - firefox: ✅ Viscose 100%
  - firefox-fresh: ✅ Viscose 100%
- Sessun — https://us.sessun.com/catalogue/shirt-and-blouses/leonie-murza-playgrid.html
  - impit: ✅ Viscose 100%
  - firefox: ✅ Viscose 100%
  - firefox-fresh: ✅ Viscose 100%
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-layered-lace-puff-sleeve-top
  - impit: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- Anthropologie — https://www.anthropologie.com/shop/pilcro-sequined-twofer-tank
  - impit: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-bruna-cashmere-modal-ribbed-top
  - impit: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- Chico's — https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249
  - impit: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Viscose 95% / Elastane 5%
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Chico's — https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997
  - impit: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Viscose 95% / Elastane 5%
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Chico's — https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959
  - impit: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Garnet hill — https://www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts-for-her/468762
  - impit: 🟡 글 41자
  - firefox: 🟡 글 842자
  - firefox-fresh: 🟡 글 4405자
- Garnet hill — https://www.garnethill.com/essential-short-sleeve-tee/holiday-gifts/shops/gifts-for-her/468763
  - impit: 🟡 글 42자
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: 🟡 글 4414자
- Garnet hill — https://www.garnethill.com/essential-turtleneck-tee/holiday-gifts/shops/gifts-for-her/473213
  - impit: 🟡 글 40자
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: 🟡 글 982자
- Prana — https://www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_color=Nautical
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ⛔ HTTP 403 Access to this page has been denied
  - firefox-fresh: ⛔ HTTP 403 Access to this page has been denied
- Prana — https://www.prana.com/p/everyday-short-sleeve-tee/2063791.html?dwvar_2063791_color=Nautical
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox-fresh: ⛔ HTTP 403 Access to this page has been denied
- Prana — https://www.prana.com/p/cambria-cove-button-up-top/2179031.html?dwvar_2179031_color=Dawn%20Heather
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox-fresh: ⛔ HTTP 403 Access to this page has been denied
- WHBM — https://www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-tee/570421368?inseam=regular&sizeType=regular&color=190&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761602643
  - impit: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Polyester 96% / Elastane 4% / Cotton 54% / Modal 41% / Elast
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- WHBM — https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570405895?inseam=regular&sizeType=regular&color=100&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526
  - impit: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Cotton 95% / Elastane 5%
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- WHBM — https://www.whitehouseblackmarket.com/store/product/whbm-forme-ribbed-scoop-neck-tee/570413314?inseam=regular&sizeType=regular&color=7332&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=196536535526
  - impit: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Aritzia — https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- Aritzia — https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: 🟡 글 8779자
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- Aritzia — https://www.aritzia.com/intl/en/product/ezra-top/125956.html
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- Reformation — https://www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_1319462ALO_color=ALO
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ✅ Silk 100%
  - firefox-fresh: ✅ Silk 100%
- Reformation — https://www.thereformation.com/products/acacia-top/1320743BLK.html?dwvar_1320743BLK_color=BLK
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ Nylon 100%
- Reformation — https://www.thereformation.com/products/monica-silk-top/1314146BLK.html?dwvar_1314146BLK_color=BLK
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ Silk 100% / Viscose 100%
- The upside — https://www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ✅ Nylon 75% / Elastane 25%
  - firefox-fresh: ✅ Nylon 75% / Elastane 25%
- The upside — https://www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ Polyester 100%
- The upside — https://www.theupside.com/hermosa-ava-double-layer-bra-navy-usw426084/
  - impit: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ Nylon 75% / Elastane 25%

</details>
