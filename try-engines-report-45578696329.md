# 무료 크롤링 엔진 비교 (2026-11-25T09:13Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45578696329 · 러너 GitHub Actions 1000008378 · 나가는 IP 74.235.103.x · 2026-11-25T08:44Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 82쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 27 | 27 | 28 | 0 | 0·0 | 27·27 | 정상 · 82쪽 · 41s |
| playwright | 30 | 12 | 40 | 0 | 0·0 | 30·12 | 정상 · 82쪽 · 698s |
| firefox | 44 | 11 | 27 | 0 | 0·0 | 44·11 | 정상 · 82쪽 · 990s |
| camoufox | 0 | 0 | 0 | 82 | 0·0 | 0·0 | 엔진 실행 실패: exit 139 (SIGSEGV) · 0/82쪽까지 · 2s |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit | playwright | firefox | camoufox |
|---|---|:-:|:-:|:-:|:-:|
| 목록 | [Abercrombie & Fitch](https://www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | 🟡 0 | ❌ |
| 목록 | [Abercrombie & Fitch](https://www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | 🟡 0 | ❌ |
| 목록 | [Abercrombie & Fitch](https://www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm=navigation-left+nav) | 🟡 0 | ⛔ 418 | 🟡 0 | ❌ |
| 목록 | [Ann Taylor](https://www.anntaylor.com/clothing/tops-and-blouses/cata000010/) | ✅ 261 | ✅ 117 | 🟡 0 | ❌ |
| 목록 | [Ann Taylor](https://www.anntaylor.com/clothing/dresses/cata000012/) | ✅ 260 | 🟡 0 | 🟡 0 | ❌ |
| 목록 | [Ann Taylor](https://www.anntaylor.com/clothing/pants/cata000014/) | ✅ 252 | 🟡 0 | 🟡 0 | ❌ |
| 목록 | [Aritzia](https://www.aritzia.com/us/en/clothing/tops) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Aritzia](https://www.aritzia.com/us/en/clothing/tshirts) | ⛔ 403 | ⛔ 403 | ✅ 35 | ❌ |
| 목록 | [Aritzia](https://www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Athleta](https://athleta.gap.com/browse/tops/all-tops?cid=1032080&nav=meganav%3ATops%3ACategories%3AAll%20Tops) | 🟡 0 | ✅ 6 | ✅ 6 | ❌ |
| 목록 | [Athleta](https://athleta.gap.com/browse/tops/sweatshirts-and-wraps?cid=1005761&nav=meganav%3ATops%3ACategories%3ASweatshirts) | 🟡 0 | 🟡 4 | ✅ 6 | ❌ |
| 목록 | [Athleta](https://athleta.gap.com/browse/dresses-and-jumpsuits/all-dresses-and-jumpsuits?cid=89745&mlink=1%2C1%2CMeganav_6&nav=meganav%3ADresses%3A%3A) | 🟡 0 | 🟡 4 | ✅ 6 | ❌ |
| 목록 | [Athleta](https://athleta.gap.com/browse/bottoms/all-bottoms?cid=1025878&mlink=1%2C1%2CMeganav_2&nav=meganav%3ABottoms%3A%3A) | 🟡 0 | 🟡 4 | ✅ 6 | ❌ |
| 목록 | [Eileen fisher](https://www.eileenfisher.com/shop/clothing/tops-tees) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Eileen fisher](https://www.eileenfisher.com/shop/clothing/tanks-camis) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Eileen fisher](https://www.eileenfisher.com/shop/clothing/dresses-skirts) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Fatface](https://www.fatface.com/shop/womens/clothing/tops/t-shirts) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Fatface](https://www.fatface.com/shop/womens/clothing/sweatshirts-and-hoodies) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Fatface](https://www.fatface.com/shop/womens/clothing/dresses) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Gap](https://www.gap.com/browse/women/t-shirts-and-tanks?cid=17076&nav=meganav%3AWomen%3ACategories%3AT-Shirts+%26+Tanks#pageId=0&department=136) | 🟡 0 | ✅ 11 | ✅ 12 | ❌ |
| 목록 | [Gap](https://www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=meganav%3AWomen%3ACategories%3ASweatshirts+%26+Sweatpants#pageId=0&department=136) | 🟡 0 | ✅ 11 | ✅ 12 | ❌ |
| 목록 | [Gap](https://www.gap.com/browse/women/dresses?cid=13658&nav=meganav%3AWomen%3ACategories%3ADresses#pageId=0&department=136) | 🟡 0 | ✅ 11 | ✅ 12 | ❌ |
| 목록 | [Gap](https://www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=meganav%3AWomen%3ACategories%3ASweatshirts+%26+Sweatpants#pageId=0&department=136&style=1144620&mlink=1041168,1,W_SWEATS_MERCH_EBB_SWEATPANTS) | 🟡 0 | ✅ 11 | ✅ 12 | ❌ |
| 목록 | [H&M](https://www2.hm.com/en_us/women/products/tops.html?sort=newProduct) | ✅ 323 | ⛔ 403 | ✅ 20 | ❌ |
| 목록 | [H&M](https://www2.hm.com/en_us/women/products/hoodies-sweatshirts.html?sort=newProduct) | ✅ 323 | ⛔ 403 | ✅ 31 | ❌ |
| 목록 | [H&M](https://www2.hm.com/en_us/women/products/shirts-blouses.html?sort=newProduct) | ✅ 323 | ⛔ 403 | ✅ 34 | ❌ |
| 목록 | [L.L bean](https://global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro) | ✅ 266 | ⛔ 403 | ✅ 67 | ❌ |
| 목록 | [L.L bean](https://global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro) | ✅ 276 | ⛔ 403 | ✅ 67 | ❌ |
| 목록 | [L.L bean](https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro) | ✅ 244 | ⛔ 403 | ✅ 35 | ❌ |
| 목록 | [Loft](https://www.loft.com/clothing/tees-tanks/cat2860023/) | ✅ 171 | 🟡 0 | 🟡 0 | ❌ |
| 목록 | [Loft](https://www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/) | ✅ 171 | 🟡 0 | ✅ 94 | ❌ |
| 목록 | [Loft](https://www.loft.com/clothing/tops/catl000011/) | ✅ 171 | 🟡 0 | 🟡 0 | ❌ |
| 목록 | [Madewell](https://www.madewell.com/kr/womens/clothing/tees/) | 🟡 0 | ✅ 23 | ✅ 23 | ❌ |
| 목록 | [Madewell](https://www.madewell.com/kr/womens/clothing/tops-shirts/) | 🟡 3 | ✅ 26 | ✅ 26 | ❌ |
| 목록 | [Madewell](https://www.madewell.com/kr/womens/clothing/dresses/) | ✅ 8 | ✅ 22 | ✅ 22 | ❌ |
| 목록 | [Massimo Dutti](https://www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518) | 🟡 0 | ⛔ 403 | ✅ 36 | ❌ |
| 목록 | [Massimo Dutti](https://www.massimodutti.com/us/s/w-tops-n2889) | 🟡 0 | ⛔ 403 | ⛔ 404 | ❌ |
| 목록 | [Massimo Dutti](https://www.massimodutti.com/us/women/shirts-n1439?celement=1963012) | 🟡 0 | ⛔ 403 | ✅ 24 | ❌ |
| 목록 | [Oysho](https://www.oysho.com/gb/womens-sports-t-shirts-n4764) | 🟡 0 | ⛔ 403 | ✅ 20 | ❌ |
| 목록 | [Oysho](https://www.oysho.com/gb/dresses-jumpsuits-n4954) | 🟡 0 | ⛔ 403 | ✅ 18 | ❌ |
| 목록 | [Oysho](https://www.oysho.com/gb/womens-sports-tops-n5484) | 🟡 0 | ⛔ 403 | ✅ 22 | ❌ |
| 목록 | [Patagonia](https://www.patagonia.com/shop/womens/tops/t-shirts) | 🟡 0 | 🟡 0 | 🟡 0 | ❌ |
| 목록 | [Patagonia](https://www.patagonia.com/shop/womens/tops/sweatshirts-hoodies) | 🟡 0 | 🟡 0 | ✅ 16 | ❌ |
| 목록 | [Patagonia](https://www.patagonia.com/shop/womens/tops/button-down) | 🟡 0 | 🟡 0 | 🟡 0 | ❌ |
| 목록 | [Sezane](https://www.sezane.com/us-en/collection/t-shirts-sweatshirts-marinieres) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Sezane](https://www.sezane.com/us-en/collection/sweat-shirts-sailor-tops) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Sezane](https://www.sezane.com/us-en/collection/dresses) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Theory](https://www.theory.com/women/t-shirts-and-tanks/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Theory](https://www.theory.com/women/loungewear/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Theory](https://www.theory.com/women/tops/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Chico's](https://www.chicos.com/store/category/tees-tanks/cat11199293) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Chico's](https://www.chicos.com/store/category/activewear/cat20059281) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Chico's](https://www.chicos.com/store/category/blouses-shirts/cat11199294) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Chico's](https://www.chicos.com/store/category/dresses/cat40004) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Chico's](https://www.chicos.com/store/category/pants/cat8289646) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [WHBM](https://www.whitehouseblackmarket.com/store/category/tees/cat4769286) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [WHBM](https://www.whitehouseblackmarket.com/store/category/tops/cat210001) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [WHBM](https://www.whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [WHBM](https://www.whitehouseblackmarket.com/store/category/dresses/cat210002) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [WHBM](https://www.whitehouseblackmarket.com/store/category/pants/cat210003) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ❌ |
| 목록 | [Frank & Eileen](https://www.frankandeileen.com/collections/tees-tanks) | ✅ 95 | ✅ 130 | ✅ 130 | ❌ |
| 목록 | [Frank & Eileen](https://www.frankandeileen.com/collections/sweatshirts-capelets) | ✅ 48 | ✅ 84 | ✅ 84 | ❌ |
| 목록 | [Frank & Eileen](https://www.frankandeileen.com/collections/button-ups) | ✅ 123 | ✅ 150 | ✅ 150 | ❌ |
| 목록 | [James Perse](https://www.jamesperse.com/collections/womens-t-shirts) | ✅ 22 | ✅ 20 | ✅ 51 | ❌ |
| 목록 | [James Perse](https://www.jamesperse.com/collections/womens-tanks) | ✅ 13 | ✅ 15 | ✅ 15 | ❌ |
| 목록 | [James Perse](https://www.jamesperse.com/collections/womens-sweat-tops-sweat-bottoms) | ✅ 22 | ✅ 40 | ✅ 40 | ❌ |
| 목록 | [Reformation](https://www.thereformation.com/tops) | ⛔ 403 | ✅ 789 | ✅ 42 | ❌ |
| 목록 | [Reformation](https://www.thereformation.com/the-sweater-shop.html) | ⛔ 403 | ✅ 68 | ⛔ 403 | ❌ |
| 목록 | [Reformation](https://www.thereformation.com/tops/button-ups) | ⛔ 403 | ✅ 79 | ⛔ 403 | ❌ |
| 목록 | [Vanessa bruno](https://www.vanessabruno.com/clothing/shirts-tops/t-shirt.html) | 🟡 4 | ✅ 25 | ✅ 25 | ❌ |
| 목록 | [Vanessa bruno](https://www.vanessabruno.com/clothing/shirts-tops/top.html) | 🟡 2 | ✅ 23 | ✅ 23 | ❌ |
| 목록 | [Vanessa bruno](https://www.vanessabruno.com/last-chance/knitwear.html) | 🟡 0 | ✅ 21 | ✅ 21 | ❌ |
| 목록 | [Monsoon](https://www.monsoonlondon.com/kr/womens/womens-clothing/tops/) | ✅ 40 | ✅ 45 | ✅ 45 | ❌ |
| 목록 | [Monsoon](https://www.monsoonlondon.com/kr/womens/womens-clothing/knitwear/) | ✅ 40 | ✅ 45 | ✅ 45 | ❌ |
| 목록 | [Monsoon](https://www.monsoonlondon.com/kr/womens/dresses/) | ✅ 40 | ✅ 46 | ✅ 46 | ❌ |
| 목록 | [Whitestuff](https://www.whitestuff.com/browse/collection/womens-t-shirts) | ✅ 60 | ✅ 62 | ✅ 62 | ❌ |
| 목록 | [Whitestuff](https://www.whitestuff.com/browse/womens/tops-and-tees) | ✅ 63 | ✅ 60 | ✅ 60 | ❌ |
| 목록 | [Whitestuff](https://www.whitestuff.com/browse/womens/knitwear) | ✅ 59 | ✅ 60 | ✅ 60 | ❌ |
| 목록 | [Lucky Brand](https://www.luckybrand.com/women/clothing/shirts/tshirts-tanktops) | ✅ 21 | ✅ 27 | ✅ 27 | ❌ |
| 목록 | [Lucky Brand](https://www.luckybrand.com/women/clothing/shirts/blouses) | ✅ 17 | 🟡 0 | 🟡 0 | ❌ |
| 목록 | [Nike](https://www.nike.com/w/womens-tops-t-shirts-5e1x6z9om13) | 🟡 0 | ✅ 54 | ✅ 54 | ❌ |
| 목록 | [Nike](https://www.nike.com/w/womens-fleece-4xh6qz5e1x6) | 🟡 0 | ✅ 54 | ✅ 54 | ❌ |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | Abercrombie & Fitch | impit | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | Abercrombie & Fitch | playwright | blocked | 418 | 알 수 없음 (-) | 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | Abercrombie & Fitch | firefox | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | Abercrombie & Fitch | camoufox | error |  |  |  | www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigati |
| 목록 | Abercrombie & Fitch | impit | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | Abercrombie & Fitch | playwright | blocked | 418 | HUMAN(PerimeterX) (중간) | 이동 locale wd→us · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_incap_2787253, 쿠키 nlbi_2787253, 쿠키 i | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | Abercrombie & Fitch | firefox | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us · Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7d753170ef7ac84, 쿠키 dwanonymous_061d37aacc12d28c00d993db60553e88 / Cloudflare | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | Abercrombie & Fitch | camoufox | error |  |  |  | www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=nav |
| 목록 | Abercrombie & Fitch | impit | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | Abercrombie & Fitch | playwright | blocked | 418 | HUMAN(PerimeterX) (중간) | 이동 locale wd→us · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_incap_2787253, 쿠키 nlbi_2787253, 쿠키 i | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | Abercrombie & Fitch | firefox | geo | 200 |  | 제목 "Client Challenge" · 이동 locale wd→us · Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7d753170ef7ac84, 쿠키 dwanonymous_061d37aacc12d28c00d993db60553e88 / Cloudflare | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | Abercrombie & Fitch | camoufox | error |  |  |  | www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm |
| 목록 | Ann Taylor | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 dwsid, 쿠키 __cq_d | www.anntaylor.com/clothing/tops-and-blouses/cata000010/ |
| 목록 | Ann Taylor | camoufox | error |  |  |  | www.anntaylor.com/clothing/tops-and-blouses/cata000010/ |
| 목록 | Ann Taylor | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_ | www.anntaylor.com/clothing/dresses/cata000012/ |
| 목록 | Ann Taylor | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e3 | www.anntaylor.com/clothing/dresses/cata000012/ |
| 목록 | Ann Taylor | camoufox | error |  |  |  | www.anntaylor.com/clothing/dresses/cata000012/ |
| 목록 | Ann Taylor | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_ | www.anntaylor.com/clothing/pants/cata000014/ |
| 목록 | Ann Taylor | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→px · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e3 | www.anntaylor.com/clothing/pants/cata000014/ |
| 목록 | Ann Taylor | camoufox | error |  |  |  | www.anntaylor.com/clothing/pants/cata000014/ |
| 목록 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/tops |
| 목록 | Aritzia | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Salesforce Commerce Clo | www.aritzia.com/us/en/clothing/tops |
| 목록 | Aritzia | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwan | www.aritzia.com/us/en/clothing/tops |
| 목록 | Aritzia | camoufox | error |  |  |  | www.aritzia.com/us/en/clothing/tops |
| 목록 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/tshirts |
| 목록 | Aritzia | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Salesforce Commerce Clo | www.aritzia.com/us/en/clothing/tshirts |
| 목록 | Aritzia | camoufox | error |  |  |  | www.aritzia.com/us/en/clothing/tshirts |
| 목록 | Aritzia | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | Aritzia | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.aritzia.com/cdn-cgi/challenge-platform/h/b/orc, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Salesforce Commerce Clo | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | Aritzia | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 화면 흔적 cf-challenge / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dw | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | Aritzia | camoufox | error |  |  |  | www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 |
| 목록 | Athleta | impit | no-cards | 200 |  | 제목 "All Tops / Athleta" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | athleta.gap.com/browse/tops/all-tops?cid=1032080&nav=meganav%3ATops%3A |
| 목록 | Athleta | camoufox | error |  |  |  | athleta.gap.com/browse/tops/all-tops?cid=1032080&nav=meganav%3ATops%3A |
| 목록 | Athleta | impit | no-cards | 200 |  | 제목 "Sweatshirts &amp; Wraps / Athleta" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | athleta.gap.com/browse/tops/sweatshirts-and-wraps?cid=1005761&nav=mega |
| 목록 | Athleta | playwright | no-cards | 200 |  | 제목 "Sweatshirts & Wraps / Athleta" · Akamai: akamai-grn 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 | athleta.gap.com/browse/tops/sweatshirts-and-wraps?cid=1005761&nav=mega |
| 목록 | Athleta | camoufox | error |  |  |  | athleta.gap.com/browse/tops/sweatshirts-and-wraps?cid=1005761&nav=mega |
| 목록 | Athleta | impit | no-cards | 200 |  | 제목 "Casual Dresses / Athleta" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | athleta.gap.com/browse/dresses-and-jumpsuits/all-dresses-and-jumpsuits |
| 목록 | Athleta | playwright | no-cards | 200 |  | 제목 "Casual Dresses / Athleta" · Akamai: akamai-grn 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visi | athleta.gap.com/browse/dresses-and-jumpsuits/all-dresses-and-jumpsuits |
| 목록 | Athleta | camoufox | error |  |  |  | athleta.gap.com/browse/dresses-and-jumpsuits/all-dresses-and-jumpsuits |
| 목록 | Athleta | impit | no-cards | 200 |  | 제목 "Women&#x27;s Bottoms / Athleta" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | athleta.gap.com/browse/bottoms/all-bottoms?cid=1025878&mlink=1%2C1%2CM |
| 목록 | Athleta | playwright | no-cards | 200 |  | 제목 "Women's Bottoms / Athleta" · Akamai: akamai-grn 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 vis | athleta.gap.com/browse/bottoms/all-bottoms?cid=1025878&mlink=1%2C1%2CM |
| 목록 | Athleta | camoufox | error |  |  |  | athleta.gap.com/browse/bottoms/all-bottoms?cid=1025878&mlink=1%2C1%2CM |
| 목록 | Eileen fisher | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.eileenfisher.com/shop/clothing/tops-tees |
| 목록 | Eileen fisher | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.eileenfisher.com/shop/clothing/tops-tees |
| 목록 | Eileen fisher | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.eileenfisher.com/shop/clothing/tops-tees |
| 목록 | Eileen fisher | camoufox | error |  |  |  | www.eileenfisher.com/shop/clothing/tops-tees |
| 목록 | Eileen fisher | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.eileenfisher.com/shop/clothing/tanks-camis |
| 목록 | Eileen fisher | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.eileenfisher.com/shop/clothing/tanks-camis |
| 목록 | Eileen fisher | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7d | www.eileenfisher.com/shop/clothing/tanks-camis |
| 목록 | Eileen fisher | camoufox | error |  |  |  | www.eileenfisher.com/shop/clothing/tanks-camis |
| 목록 | Eileen fisher | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.eileenfisher.com/shop/clothing/dresses-skirts |
| 목록 | Eileen fisher | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.eileenfisher.com/shop/clothing/dresses-skirts |
| 목록 | Eileen fisher | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7 | www.eileenfisher.com/shop/clothing/dresses-skirts |
| 목록 | Eileen fisher | camoufox | error |  |  |  | www.eileenfisher.com/shop/clothing/dresses-skirts |
| 목록 | Fatface | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.fatface.com/shop/womens/clothing/tops/t-shirts |
| 목록 | Fatface | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.fatface.com/shop/womens/clothing/tops/t-shirts |
| 목록 | Fatface | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.fatface.com/shop/womens/clothing/tops/t-shirts |
| 목록 | Fatface | camoufox | error |  |  |  | www.fatface.com/shop/womens/clothing/tops/t-shirts |
| 목록 | Fatface | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.fatface.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Fatface | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.fatface.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Fatface | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ff | www.fatface.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Fatface | camoufox | error |  |  |  | www.fatface.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Fatface | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.fatface.com/shop/womens/clothing/dresses |
| 목록 | Fatface | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.fatface.com/shop/womens/clothing/dresses |
| 목록 | Fatface | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13f | www.fatface.com/shop/womens/clothing/dresses |
| 목록 | Fatface | camoufox | error |  |  |  | www.fatface.com/shop/womens/clothing/dresses |
| 목록 | Gap | impit | no-cards | 200 |  | 제목 "Women&#x27;s T-Shirts &amp; Tank Tops / " · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | www.gap.com/browse/women/t-shirts-and-tanks?cid=17076&nav=meganav%3AWo |
| 목록 | Gap | camoufox | error |  |  |  | www.gap.com/browse/women/t-shirts-and-tanks?cid=17076&nav=meganav%3AWo |
| 목록 | Gap | impit | no-cards | 200 |  | 제목 "Women&#x27;s Sweatshirts &amp; Joggers/ " · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=me |
| 목록 | Gap | camoufox | error |  |  |  | www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=me |
| 목록 | Gap | impit | no-cards | 200 |  | 제목 "Women&#x27;s Dresses / Gap" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | www.gap.com/browse/women/dresses?cid=13658&nav=meganav%3AWomen%3ACateg |
| 목록 | Gap | camoufox | error |  |  |  | www.gap.com/browse/women/dresses?cid=13658&nav=meganav%3AWomen%3ACateg |
| 목록 | Gap | impit | no-cards | 200 |  | 제목 "Women&#x27;s Sweatshirts &amp; Joggers/ " · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=me |
| 목록 | Gap | camoufox | error |  |  |  | www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=me |
| 목록 | H&M | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www2.hm.com/en_us/women/products/tops.html?sort=newProduct |
| 목록 | H&M | camoufox | error |  |  |  | www2.hm.com/en_us/women/products/tops.html?sort=newProduct |
| 목록 | H&M | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www2.hm.com/en_us/women/products/hoodies-sweatshirts.html?sort=newProd |
| 목록 | H&M | camoufox | error |  |  |  | www2.hm.com/en_us/women/products/hoodies-sweatshirts.html?sort=newProd |
| 목록 | H&M | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www2.hm.com/en_us/women/products/shirts-blouses.html?sort=newProduct |
| 목록 | H&M | camoufox | error |  |  |  | www2.hm.com/en_us/women/products/shirts-blouses.html?sort=newProduct |
| 목록 | L.L bean | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX):  | global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro |
| 목록 | L.L bean | camoufox | error |  |  |  | global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro |
| 목록 | L.L bean | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX):  | global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro |
| 목록 | L.L bean | camoufox | error |  |  |  | global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro |
| 목록 | L.L bean | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX):  | global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Wome |
| 목록 | L.L bean | camoufox | error |  |  |  | global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Wome |
| 목록 | Loft | impit | geo | 200 |  | 이동 locale -→on · 흔적 px-script·captcha·maintenance · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): 화면 흔적 px-scr | www.loft.com/clothing/tees-tanks/cat2860023/ |
| 목록 | Loft | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_ | www.loft.com/clothing/tees-tanks/cat2860023/ |
| 목록 | Loft | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / Akamai: 쿠키 bm_so, 쿠키 bm_lso, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck / HUMAN(PerimeterX): 화면 흔적 px-c | www.loft.com/clothing/tees-tanks/cat2860023/ |
| 목록 | Loft | camoufox | error |  |  |  | www.loft.com/clothing/tees-tanks/cat2860023/ |
| 목록 | Loft | impit | geo | 200 |  | 이동 locale -→on · 흔적 px-script·captcha·maintenance · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): 화면 흔적 px-scr | www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/ |
| 목록 | Loft | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_ | www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/ |
| 목록 | Loft | camoufox | error |  |  |  | www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/ |
| 목록 | Loft | impit | geo | 200 |  | 이동 locale -→on · 흔적 px-script·captcha·maintenance · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_9ecd7b6cba6688dbfc7f2f714b, 쿠키 dwanonymous_15fa1e644f5fdcec10046e747b451746, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): 화면 흔적 px-scr | www.loft.com/clothing/tops/catl000011/ |
| 목록 | Loft | playwright | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_ | www.loft.com/clothing/tops/catl000011/ |
| 목록 | Loft | firefox | geo | 200 |  | 제목 "Access to this page has been denied." · 이동 locale -→on · 흔적 px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e3 | www.loft.com/clothing/tops/catl000011/ |
| 목록 | Loft | camoufox | error |  |  |  | www.loft.com/clothing/tops/catl000011/ |
| 목록 | Madewell | impit | no-cards | 200 |  | 제목 "Women’s Tees & Tanks / Madewell" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.madewell.com/kr/womens/clothing/tees/ |
| 목록 | Madewell | camoufox | error |  |  |  | www.madewell.com/kr/womens/clothing/tees/ |
| 목록 | Madewell | impit | no-cards | 200 |  | 제목 "Women’s Tops & Shirts - Stylish Shirts, " · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.madewell.com/kr/womens/clothing/tops-shirts/ |
| 목록 | Madewell | camoufox | error |  |  |  | www.madewell.com/kr/womens/clothing/tops-shirts/ |
| 목록 | Madewell | camoufox | error |  |  |  | www.madewell.com/kr/womens/clothing/dresses/ |
| 목록 | Massimo Dutti | impit | shell | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518 |
| 목록 | Massimo Dutti | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_in | www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518 |
| 목록 | Massimo Dutti | camoufox | error |  |  |  | www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518 |
| 목록 | Massimo Dutti | impit | shell | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | Massimo Dutti | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_in | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | Massimo Dutti | firefox | blocked | 404 | Akamai (중간) | 제목 "Massimo Dutti" · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7d753170ef7ac84, 쿠키 dwanonymous_0 | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | Massimo Dutti | camoufox | error |  |  |  | www.massimodutti.com/us/s/w-tops-n2889 |
| 목록 | Massimo Dutti | impit | shell | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.massimodutti.com/us/women/shirts-n1439?celement=1963012 |
| 목록 | Massimo Dutti | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_in | www.massimodutti.com/us/women/shirts-n1439?celement=1963012 |
| 목록 | Massimo Dutti | camoufox | error |  |  |  | www.massimodutti.com/us/women/shirts-n1439?celement=1963012 |
| 목록 | Oysho | impit | shell | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/womens-sports-t-shirts-n4764 |
| 목록 | Oysho | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_in | www.oysho.com/gb/womens-sports-t-shirts-n4764 |
| 목록 | Oysho | camoufox | error |  |  |  | www.oysho.com/gb/womens-sports-t-shirts-n4764 |
| 목록 | Oysho | impit | shell | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/dresses-jumpsuits-n4954 |
| 목록 | Oysho | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_in | www.oysho.com/gb/dresses-jumpsuits-n4954 |
| 목록 | Oysho | camoufox | error |  |  |  | www.oysho.com/gb/dresses-jumpsuits-n4954 |
| 목록 | Oysho | impit | shell | 200 |  | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/womens-sports-tops-n5484 |
| 목록 | Oysho | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 visid_in | www.oysho.com/gb/womens-sports-tops-n5484 |
| 목록 | Oysho | camoufox | error |  |  |  | www.oysho.com/gb/womens-sports-tops-n5484 |
| 목록 | Patagonia | impit | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/shop/womens/tops/t-shirts |
| 목록 | Patagonia | playwright | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠 | www.patagonia.com/shop/womens/tops/t-shirts |
| 목록 | Patagonia | firefox | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage, 쿠키 bm_mi, 쿠키 bm_sz, 쿠키 ak_bmsc, 쿠키 bm_sv / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid | www.patagonia.com/shop/womens/tops/t-shirts |
| 목록 | Patagonia | camoufox | error |  |  |  | www.patagonia.com/shop/womens/tops/t-shirts |
| 목록 | Patagonia | impit | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/shop/womens/tops/sweatshirts-hoodies |
| 목록 | Patagonia | playwright | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠 | www.patagonia.com/shop/womens/tops/sweatshirts-hoodies |
| 목록 | Patagonia | camoufox | error |  |  |  | www.patagonia.com/shop/womens/tops/sweatshirts-hoodies |
| 목록 | Patagonia | impit | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage | www.patagonia.com/shop/womens/tops/button-down |
| 목록 | Patagonia | playwright | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠 | www.patagonia.com/shop/womens/tops/button-down |
| 목록 | Patagonia | firefox | maintenance | 200 |  | 제목 "Patagonia Outdoor Clothing & Gear" · 흔적 maintenance · Akamai: server: AkamaiNetStorage, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키  | www.patagonia.com/shop/womens/tops/button-down |
| 목록 | Patagonia | camoufox | error |  |  |  | www.patagonia.com/shop/womens/tops/button-down |
| 목록 | Sezane | impit | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/collection/t-shirts-sweatshirts-marinieres |
| 목록 | Sezane | playwright | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc / CloudFront: x-amz-cf-* 헤더 /  | www.sezane.com/us-en/collection/t-shirts-sweatshirts-marinieres |
| 목록 | Sezane | firefox | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/i.js, 불러온 주소 geo.captcha-delivery.com/interstitial/, 불러온 주소 ct.captcha-delivery.com/cf75247398dcf832.js / CloudFront: x-amz-cf-* 헤더 / Cl | www.sezane.com/us-en/collection/t-shirts-sweatshirts-marinieres |
| 목록 | Sezane | camoufox | error |  |  |  | www.sezane.com/us-en/collection/t-shirts-sweatshirts-marinieres |
| 목록 | Sezane | impit | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/collection/sweat-shirts-sailor-tops |
| 목록 | Sezane | playwright | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc / CloudFront: x-amz-cf-* 헤더 /  | www.sezane.com/us-en/collection/sweat-shirts-sailor-tops |
| 목록 | Sezane | firefox | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/26e66f54b7ed35cb.js / CloudFront: x-amz-cf-* 헤더 / Salesfo | www.sezane.com/us-en/collection/sweat-shirts-sailor-tops |
| 목록 | Sezane | camoufox | error |  |  |  | www.sezane.com/us-en/collection/sweat-shirts-sailor-tops |
| 목록 | Sezane | impit | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge / CloudFront: x-amz-cf-* 헤더 | www.sezane.com/us-en/collection/dresses |
| 목록 | Sezane | playwright | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc / CloudFront: x-amz-cf-* 헤더 /  | www.sezane.com/us-en/collection/dresses |
| 목록 | Sezane | firefox | blocked | 403 | DataDome (높음) | 제목 "sezane.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/1bd0ced52454cee9.js / CloudFront: x-amz-cf-* 헤더 / Salesfo | www.sezane.com/us-en/collection/dresses |
| 목록 | Sezane | camoufox | error |  |  |  | www.sezane.com/us-en/collection/dresses |
| 목록 | Theory | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.theory.com/women/t-shirts-and-tanks/ |
| 목록 | Theory | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.theory.com/women/t-shirts-and-tanks/ |
| 목록 | Theory | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid | www.theory.com/women/t-shirts-and-tanks/ |
| 목록 | Theory | camoufox | error |  |  |  | www.theory.com/women/t-shirts-and-tanks/ |
| 목록 | Theory | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.theory.com/women/loungewear/ |
| 목록 | Theory | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.theory.com/women/loungewear/ |
| 목록 | Theory | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13f | www.theory.com/women/loungewear/ |
| 목록 | Theory | camoufox | error |  |  |  | www.theory.com/women/loungewear/ |
| 목록 | Theory | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.theory.com/women/tops/ |
| 목록 | Theory | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.theory.com/women/tops/ |
| 목록 | Theory | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13f | www.theory.com/women/tops/ |
| 목록 | Theory | camoufox | error |  |  |  | www.theory.com/women/tops/ |
| 목록 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/category/tees-tanks/cat11199293 |
| 목록 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.chicos.com/store/category/tees-tanks/cat11199293 |
| 목록 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid | www.chicos.com/store/category/tees-tanks/cat11199293 |
| 목록 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/category/tees-tanks/cat11199293 |
| 목록 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/category/activewear/cat20059281 |
| 목록 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.chicos.com/store/category/activewear/cat20059281 |
| 목록 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7 | www.chicos.com/store/category/activewear/cat20059281 |
| 목록 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/category/activewear/cat20059281 |
| 목록 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/category/blouses-shirts/cat11199294 |
| 목록 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.chicos.com/store/category/blouses-shirts/cat11199294 |
| 목록 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7 | www.chicos.com/store/category/blouses-shirts/cat11199294 |
| 목록 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/category/blouses-shirts/cat11199294 |
| 목록 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/category/dresses/cat40004 |
| 목록 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.chicos.com/store/category/dresses/cat40004 |
| 목록 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7 | www.chicos.com/store/category/dresses/cat40004 |
| 목록 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/category/dresses/cat40004 |
| 목록 | Chico's | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.chicos.com/store/category/pants/cat8289646 |
| 목록 | Chico's | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): | www.chicos.com/store/category/pants/cat8289646 |
| 목록 | Chico's | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7 | www.chicos.com/store/category/pants/cat8289646 |
| 목록 | Chico's | camoufox | error |  |  |  | www.chicos.com/store/category/pants/cat8289646 |
| 목록 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/category/tees/cat4769286 |
| 목록 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.whitehouseblackmarket.com/store/category/tees/cat4769286 |
| 목록 | WHBM | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck / Cloudflare: 쿠키 __cf_bm, 쿠키 _cfuvid | www.whitehouseblackmarket.com/store/category/tees/cat4769286 |
| 목록 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/category/tees/cat4769286 |
| 목록 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/category/tops/cat210001 |
| 목록 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.whitehouseblackmarket.com/store/category/tops/cat210001 |
| 목록 | WHBM | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13f | www.whitehouseblackmarket.com/store/category/tops/cat210001 |
| 목록 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/category/tops/cat210001 |
| 목록 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287 |
| 목록 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287 |
| 목록 | WHBM | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13f | www.whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287 |
| 목록 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287 |
| 목록 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/category/dresses/cat210002 |
| 목록 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.whitehouseblackmarket.com/store/category/dresses/cat210002 |
| 목록 | WHBM | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13f | www.whitehouseblackmarket.com/store/category/dresses/cat210002 |
| 목록 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/category/dresses/cat210002 |
| 목록 | WHBM | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.whitehouseblackmarket.com/store/category/pants/cat210003 |
| 목록 | WHBM | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(Perime | www.whitehouseblackmarket.com/store/category/pants/cat210003 |
| 목록 | WHBM | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13f | www.whitehouseblackmarket.com/store/category/pants/cat210003 |
| 목록 | WHBM | camoufox | error |  |  |  | www.whitehouseblackmarket.com/store/category/pants/cat210003 |
| 목록 | Frank & Eileen | impit | geo | 200 |  | 제목 "Women&#39;s Tank Tops &amp; T-shirts / F" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.frankandeileen.com/collections/tees-tanks |
| 목록 | Frank & Eileen | playwright | geo | 200 |  | 제목 "Women's Tank Tops & T-shirts / Frank & E" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.frankandeileen.com/collections/tees-tanks |
| 목록 | Frank & Eileen | firefox | geo | 200 |  | 제목 "Women's Tank Tops & T-shirts / Frank & E" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: x-shopify-*/powered-by 헤더 / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck, 쿠키 ak_bmsc | www.frankandeileen.com/collections/tees-tanks |
| 목록 | Frank & Eileen | camoufox | error |  |  |  | www.frankandeileen.com/collections/tees-tanks |
| 목록 | Frank & Eileen | impit | geo | 200 |  | 제목 "Women&#39;s Sweatshirts, Hoodies, Capele" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.frankandeileen.com/collections/sweatshirts-capelets |
| 목록 | Frank & Eileen | playwright | geo | 200 |  | 제목 "Women's Sweatshirts, Hoodies, Capelets /" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.frankandeileen.com/collections/sweatshirts-capelets |
| 목록 | Frank & Eileen | firefox | geo | 200 |  | 제목 "Women's Sweatshirts, Hoodies, Capelets /" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: x-shopify-*/powered-by 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd | www.frankandeileen.com/collections/sweatshirts-capelets |
| 목록 | Frank & Eileen | camoufox | error |  |  |  | www.frankandeileen.com/collections/sweatshirts-capelets |
| 목록 | Frank & Eileen | impit | geo | 200 |  | 제목 "Stylish Womens Button Ups &amp; Shirts /" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.frankandeileen.com/collections/button-ups |
| 목록 | Frank & Eileen | playwright | geo | 200 |  | 제목 "Stylish Womens Button Ups & Shirts / Fra" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.frankandeileen.com/collections/button-ups |
| 목록 | Frank & Eileen | firefox | geo | 200 |  | 제목 "Stylish Womens Button Ups & Shirts / Fra" · 흔적 captcha·geo · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Shopify: x-shopify-*/powered-by 헤더 / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd | www.frankandeileen.com/collections/button-ups |
| 목록 | Frank & Eileen | camoufox | error |  |  |  | www.frankandeileen.com/collections/button-ups |
| 목록 | James Perse | camoufox | error |  |  |  | www.jamesperse.com/collections/womens-t-shirts |
| 목록 | James Perse | camoufox | error |  |  |  | www.jamesperse.com/collections/womens-tanks |
| 목록 | James Perse | camoufox | error |  |  |  | www.jamesperse.com/collections/womens-sweat-tops-sweat-bottoms |
| 목록 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/tops |
| 목록 | Reformation | camoufox | error |  |  |  | www.thereformation.com/tops |
| 목록 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/the-sweater-shop.html |
| 목록 | Reformation | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 화면 흔적 cf-challenge / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dw | www.thereformation.com/the-sweater-shop.html |
| 목록 | Reformation | camoufox | error |  |  |  | www.thereformation.com/the-sweater-shop.html |
| 목록 | Reformation | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.thereformation.com/tops/button-ups |
| 목록 | Reformation | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 쿠키 _cfuvid, 화면 흔적 cf-challenge / Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dw | www.thereformation.com/tops/button-ups |
| 목록 | Reformation | camoufox | error |  |  |  | www.thereformation.com/tops/button-ups |
| 목록 | Vanessa bruno | impit | no-cards | 200 |  | 제목 "Women&apos;s T-shirt / Vanessa Bruno" | www.vanessabruno.com/clothing/shirts-tops/t-shirt.html |
| 목록 | Vanessa bruno | camoufox | error |  |  |  | www.vanessabruno.com/clothing/shirts-tops/t-shirt.html |
| 목록 | Vanessa bruno | impit | no-cards | 200 |  | 제목 "Women&apos;s Top / Vanessa Bruno" | www.vanessabruno.com/clothing/shirts-tops/top.html |
| 목록 | Vanessa bruno | camoufox | error |  |  |  | www.vanessabruno.com/clothing/shirts-tops/top.html |
| 목록 | Vanessa bruno | impit | dead | 200 |  | 제목 "Vanessa Bruno Official Online Store: Wom" · 이동 home | www.vanessabruno.com/last-chance/knitwear.html |
| 목록 | Vanessa bruno | playwright | dead | 200 |  | 제목 "Vanessa Bruno Official Online Store: Wom" · 이동 home · Salesforce Commerce Cloud: 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt, 쿠키 dwsid / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid / Imperva: 쿠키 vi | www.vanessabruno.com/last-chance/knitwear.html |
| 목록 | Vanessa bruno | firefox | dead | 200 |  | 제목 "Vanessa Bruno Official Online Store: Wom" · 이동 home · Salesforce Commerce Cloud: 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7d753170ef7ac84, 쿠키 dwanonymous_061d37aacc12d28c00d993db60553 | www.vanessabruno.com/last-chance/knitwear.html |
| 목록 | Vanessa bruno | camoufox | error |  |  |  | www.vanessabruno.com/last-chance/knitwear.html |
| 목록 | Monsoon | impit | geo | 200 |  | 제목 "Women&#x27;s Tops / Ladies Tops / Monsoo" · 이동 locale kr→us · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_4ba13ffd41d7d753170ef7ac84, 쿠키 dwanonymous_061d37aacc12d28c00d993db60553e88, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.monsoonlondon.com/kr/womens/womens-clothing/tops/ |
| 목록 | Monsoon | playwright | geo | 200 |  | 제목 "Women's Tops / Ladies Tops / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): | www.monsoonlondon.com/kr/womens/womens-clothing/tops/ |
| 목록 | Monsoon | firefox | geo | 200 |  | 제목 "Women's Tops / Ladies Tops / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4 | www.monsoonlondon.com/kr/womens/womens-clothing/tops/ |
| 목록 | Monsoon | camoufox | error |  |  |  | www.monsoonlondon.com/kr/womens/womens-clothing/tops/ |
| 목록 | Monsoon | impit | geo | 200 |  | 제목 "Knitwear / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_4ba13ffd41d7d753170ef7ac84, 쿠키 dwanonymous_061d37aacc12d28c00d993db60553e88, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.monsoonlondon.com/kr/womens/womens-clothing/knitwear/ |
| 목록 | Monsoon | playwright | geo | 200 |  | 제목 "Knitwear / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxv | www.monsoonlondon.com/kr/womens/womens-clothing/knitwear/ |
| 목록 | Monsoon | firefox | geo | 200 |  | 제목 "Knitwear / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_4ba13ffd41d7d753170 | www.monsoonlondon.com/kr/womens/womens-clothing/knitwear/ |
| 목록 | Monsoon | camoufox | error |  |  |  | www.monsoonlondon.com/kr/womens/womens-clothing/knitwear/ |
| 목록 | Monsoon | impit | geo | 200 |  | 제목 "Dresses / Dresses for Women / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_4ba13ffd41d7d753170ef7ac84, 쿠키 dwanonymous_061d37aacc12d28c00d993db60553e88, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.monsoonlondon.com/kr/womens/dresses/ |
| 목록 | Monsoon | playwright | geo | 200 |  | 제목 "Dresses / Dresses for Women / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMAN(PerimeterX) | www.monsoonlondon.com/kr/womens/dresses/ |
| 목록 | Monsoon | firefox | geo | 200 |  | 제목 "Dresses / Dresses for Women / Monsoon US" · 이동 locale kr→us · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymous_daeb3743890cdd8b55ce05b7ee4e34cd, 쿠키 dwsid, 쿠키 dwac_ | www.monsoonlondon.com/kr/womens/dresses/ |
| 목록 | Monsoon | camoufox | error |  |  |  | www.monsoonlondon.com/kr/womens/dresses/ |
| 목록 | Whitestuff | camoufox | error |  |  |  | www.whitestuff.com/browse/collection/womens-t-shirts |
| 목록 | Whitestuff | camoufox | error |  |  |  | www.whitestuff.com/browse/womens/tops-and-tees |
| 목록 | Whitestuff | camoufox | error |  |  |  | www.whitestuff.com/browse/womens/knitwear |
| 목록 | Lucky Brand | camoufox | error |  |  |  | www.luckybrand.com/women/clothing/shirts/tshirts-tanktops |
| 목록 | Lucky Brand | playwright | shell | 200 |  | 제목 "PLAID BUTTON DOWN SHIRT / Lucky Brand" · 이동 path · Cloudflare: cf-ray 헤더 / Akamai: akamai-grn 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_7ee8fe5a3e299ad656a9402627, 쿠키 dwanonymous_a9da3b023683d9e6d387a7ed3d64d066, 쿠키 __cq_dnt, 쿠키 dw_dnt / HUMA | www.luckybrand.com/women/clothing/shirts/blouses |
| 목록 | Lucky Brand | firefox | shell | 200 |  | 제목 "PLAID BUTTON DOWN SHIRT / Lucky Brand" · 이동 path · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 _cfuvid / Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_so, 쿠키 bm_sz / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_331dd03a14fad860a3a367b35b, 쿠키 dwanonymo | www.luckybrand.com/women/clothing/shirts/blouses |
| 목록 | Lucky Brand | camoufox | error |  |  |  | www.luckybrand.com/women/clothing/shirts/blouses |
| 목록 | Nike | impit | no-cards | 200 |  | 제목 "Women&#x27;s Tops &amp; Shirts. Nike.com" · 흔적 kasada · Akamai: akamai-grn 헤더, 쿠키 ak_bmsc / Kasada: 화면 흔적 kasada | www.nike.com/w/womens-tops-t-shirts-5e1x6z9om13 |
| 목록 | Nike | camoufox | error |  |  |  | www.nike.com/w/womens-tops-t-shirts-5e1x6z9om13 |
| 목록 | Nike | impit | no-cards | 200 |  | 제목 "Womens Fleece. Nike.com" · 흔적 kasada · Akamai: akamai-grn 헤더, 쿠키 ak_bmsc / Kasada: 화면 흔적 kasada | www.nike.com/w/womens-fleece-4xh6qz5e1x6 |
| 목록 | Nike | camoufox | error |  |  |  | www.nike.com/w/womens-fleece-4xh6qz5e1x6 |

<details><summary>사유</summary>

- Abercrombie & Fitch — https://www.abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1520자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Abercrombie & Fitch — https://www.abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1520자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Abercrombie & Fitch — https://www.abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm=navigation-left+nav
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 303자
  - playwright: ⛔ HTTP 418 
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1520자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Ann Taylor — https://www.anntaylor.com/clothing/tops-and-blouses/cata000010/
  - impit: ✅ HTML 상품 링크 261 · 이미지 링크 122 · 글 67485자
  - playwright: ✅ 수집기 117개 · HTML 상품 링크 270 · 이미지 링크 123 · 글 73550자 · 예 https://www.anntaylor.com/stylerewards
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Ann Taylor — https://www.anntaylor.com/clothing/dresses/cata000012/
  - impit: ✅ HTML 상품 링크 260 · 이미지 링크 121 · 글 67457자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Ann Taylor — https://www.anntaylor.com/clothing/pants/cata000014/
  - impit: ✅ HTML 상품 링크 252 · 이미지 링크 122 · 글 65002자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Aritzia — https://www.aritzia.com/us/en/clothing/tops
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Aritzia — https://www.aritzia.com/us/en/clothing/tshirts
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ✅ 수집기 35개 · HTML 상품 링크 24 · 이미지 링크 26 · 글 11386자 · 예 https://www.aritzia.com/us/en/sale
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Aritzia — https://www.aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Athleta — https://athleta.gap.com/browse/tops/all-tops?cid=1032080&nav=meganav%3ATops%3ACategories%3AAll%20Tops
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 2932자
  - playwright: ✅ 수집기 6개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 7943자 · 예 https://athleta.gap.com/browse/product.do
  - firefox: ✅ 수집기 6개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 7946자 · 예 https://athleta.gap.com/browse/product.do
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Athleta — https://athleta.gap.com/browse/tops/sweatshirts-and-wraps?cid=1005761&nav=meganav%3ATops%3ACategories%3ASweatshirts
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 4567자
  - playwright: 🟡 수집기 4개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 7185자 · 예 https://athleta.gap.com/browse/product.do
  - firefox: ✅ 수집기 6개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 9254자 · 예 https://athleta.gap.com/browse/product.do
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Athleta — https://athleta.gap.com/browse/dresses-and-jumpsuits/all-dresses-and-jumpsuits?cid=89745&mlink=1%2C1%2CMeganav_6&nav=meganav%3ADresses%3A%3A
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 3898자
  - playwright: 🟡 수집기 4개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 6880자 · 예 https://athleta.gap.com/browse/product.do
  - firefox: ✅ 수집기 6개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 8584자 · 예 https://athleta.gap.com/browse/product.do
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Athleta — https://athleta.gap.com/browse/bottoms/all-bottoms?cid=1025878&mlink=1%2C1%2CMeganav_2&nav=meganav%3ABottoms%3A%3A
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 3115자
  - playwright: 🟡 수집기 4개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 5831자 · 예 https://athleta.gap.com/browse/product.do
  - firefox: ✅ 수집기 6개 · HTML 상품 링크 0 · 이미지 링크 3 · 글 7797자 · 예 https://athleta.gap.com/browse/product.do
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Eileen fisher — https://www.eileenfisher.com/shop/clothing/tops-tees
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Eileen fisher — https://www.eileenfisher.com/shop/clothing/tanks-camis
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Eileen fisher — https://www.eileenfisher.com/shop/clothing/dresses-skirts
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Fatface — https://www.fatface.com/shop/womens/clothing/tops/t-shirts
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Fatface — https://www.fatface.com/shop/womens/clothing/sweatshirts-and-hoodies
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Fatface — https://www.fatface.com/shop/womens/clothing/dresses
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Gap — https://www.gap.com/browse/women/t-shirts-and-tanks?cid=17076&nav=meganav%3AWomen%3ACategories%3AT-Shirts+%26+Tanks#pageId=0&department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 3 · 글 5465자
  - playwright: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 14 · 글 12333자 · 예 https://www.gap.com/browse/women/gift-shop
  - firefox: ✅ 수집기 12개 · HTML 상품 링크 0 · 이미지 링크 14 · 글 14205자 · 예 https://www.gap.com/browse/women/gift-shop
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Gap — https://www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=meganav%3AWomen%3ACategories%3ASweatshirts+%26+Sweatpants#pageId=0&department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 3 · 글 6325자
  - playwright: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 13 · 글 12715자 · 예 https://www.gap.com/browse/women/gift-shop
  - firefox: ✅ 수집기 12개 · HTML 상품 링크 0 · 이미지 링크 14 · 글 15159자 · 예 https://www.gap.com/browse/women/gift-shop
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Gap — https://www.gap.com/browse/women/dresses?cid=13658&nav=meganav%3AWomen%3ACategories%3ADresses#pageId=0&department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 5376자
  - playwright: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 14 · 글 12361자 · 예 https://www.gap.com/browse/women/gift-shop
  - firefox: ✅ 수집기 12개 · HTML 상품 링크 0 · 이미지 링크 13 · 글 14347자 · 예 https://www.gap.com/browse/women/gift-shop
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Gap — https://www.gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=meganav%3AWomen%3ACategories%3ASweatshirts+%26+Sweatpants#pageId=0&department=136&style=1144620&mlink=1041168,1,W_SWEATS_MERCH_EBB_SWEATPANTS
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 3 · 글 6325자
  - playwright: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 13 · 글 12675자 · 예 https://www.gap.com/browse/women/gift-shop
  - firefox: ✅ 수집기 12개 · HTML 상품 링크 0 · 이미지 링크 14 · 글 14889자 · 예 https://www.gap.com/browse/women/gift-shop
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- H&M — https://www2.hm.com/en_us/women/products/tops.html?sort=newProduct
  - impit: ✅ HTML 상품 링크 323 · 이미지 링크 35 · 글 24677자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 20개 · HTML 상품 링크 55 · 이미지 링크 35 · 글 11876자 · 예 https://www2.hm.com/en_us/productpage.1377524001.html
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- H&M — https://www2.hm.com/en_us/women/products/hoodies-sweatshirts.html?sort=newProduct
  - impit: ✅ HTML 상품 링크 323 · 이미지 링크 29 · 글 24374자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 31개 · HTML 상품 링크 39 · 이미지 링크 29 · 글 11205자 · 예 https://www2.hm.com/en_us/productpage.1345017010.html
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- H&M — https://www2.hm.com/en_us/women/products/shirts-blouses.html?sort=newProduct
  - impit: ✅ HTML 상품 링크 323 · 이미지 링크 22 · 글 24203자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 34개 · HTML 상품 링크 43 · 이미지 링크 24 · 글 11315자 · 예 https://www2.hm.com/en_us/productpage.1369642002.html
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- L.L bean — https://global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro
  - impit: ✅ HTML 상품 링크 266 · 이미지 링크 59 · 글 36607자
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ✅ 수집기 67개 · HTML 상품 링크 266 · 이미지 링크 59 · 글 31808자 · 예 https://global.llbean.com/llb/shop/509870/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- L.L bean — https://global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro
  - impit: ✅ HTML 상품 링크 276 · 이미지 링크 59 · 글 34542자
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ✅ 수집기 67개 · HTML 상품 링크 276 · 이미지 링크 59 · 글 30425자 · 예 https://global.llbean.com/llb/shop/509870/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- L.L bean — https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - impit: ✅ HTML 상품 링크 244 · 이미지 링크 27 · 글 22758자
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ✅ 수집기 35개 · HTML 상품 링크 244 · 이미지 링크 27 · 글 20902자 · 예 https://global.llbean.com/llb/shop/509870/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Loft — https://www.loft.com/clothing/tees-tanks/cat2860023/
  - impit: ✅ HTML 상품 링크 171 · 이미지 링크 9 · 글 16197자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Loft — https://www.loft.com/lou-grey/lou-grey-shop-all/cat1880002/
  - impit: ✅ HTML 상품 링크 171 · 이미지 링크 9 · 글 16197자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: ✅ 수집기 94개 · HTML 상품 링크 327 · 이미지 링크 97 · 글 78015자 · 예 https://www.loft.com/loftimist/stylerewards-loyalty-program/cat4490013/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Loft — https://www.loft.com/clothing/tops/catl000011/
  - impit: ✅ HTML 상품 링크 171 · 이미지 링크 9 · 글 16197자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 537자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Madewell — https://www.madewell.com/kr/womens/clothing/tees/
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 21 · 글 11369자
  - playwright: ✅ 수집기 23개 · HTML 상품 링크 20 · 이미지 링크 42 · 글 13709자 · 예 https://www.madewell.com/womens/black-friday/
  - firefox: ✅ 수집기 23개 · HTML 상품 링크 20 · 이미지 링크 42 · 글 13062자 · 예 https://www.madewell.com/womens/black-friday/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Madewell — https://www.madewell.com/kr/womens/clothing/tops-shirts/
  - impit: 🟡 HTML 상품 링크 3 · 이미지 링크 25 · 글 10318자
  - playwright: ✅ 수집기 26개 · HTML 상품 링크 26 · 이미지 링크 49 · 글 11874자 · 예 https://www.madewell.com/womens/black-friday/
  - firefox: ✅ 수집기 26개 · HTML 상품 링크 6 · 이미지 링크 29 · 글 11120자 · 예 https://www.madewell.com/womens/black-friday/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Madewell — https://www.madewell.com/kr/womens/clothing/dresses/
  - impit: ✅ HTML 상품 링크 8 · 이미지 링크 28 · 글 8608자
  - playwright: ✅ 수집기 22개 · HTML 상품 링크 26 · 이미지 링크 46 · 글 9349자 · 예 https://www.madewell.com/womens/black-friday/
  - firefox: ✅ 수집기 22개 · HTML 상품 링크 30 · 이미지 링크 50 · 글 9430자 · 예 https://www.madewell.com/womens/black-friday/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Massimo Dutti — https://www.massimodutti.com/us/women/t-shirts-n1444?celement=2242518
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 36개 · HTML 상품 링크 34 · 이미지 링크 34 · 글 9984자 · 예 https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Massimo Dutti — https://www.massimodutti.com/us/s/w-tops-n2889
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 404 Massimo Dutti
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Massimo Dutti — https://www.massimodutti.com/us/women/shirts-n1439?celement=1963012
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 24개 · HTML 상품 링크 22 · 이미지 링크 22 · 글 9188자 · 예 https://www.massimodutti.com/us/flowing-shirt-with-button-detail-l06839554
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Oysho — https://www.oysho.com/gb/womens-sports-t-shirts-n4764
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 20개 · HTML 상품 링크 14 · 이미지 링크 10 · 글 11998자 · 예 https://www.oysho.com/gb/womens-base-layer-n5063
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Oysho — https://www.oysho.com/gb/dresses-jumpsuits-n4954
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 18개 · HTML 상품 링크 16 · 이미지 링크 6 · 글 11956자 · 예 https://www.oysho.com/gb/perfectadapt-long-jumpsuit-with-contrast-stitching-l30792232
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Oysho — https://www.oysho.com/gb/womens-sports-tops-n5484
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 22개 · HTML 상품 링크 16 · 이미지 링크 13 · 글 10914자 · 예 https://www.oysho.com/gb/comfortlux-tops-n5686
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Patagonia — https://www.patagonia.com/shop/womens/tops/t-shirts
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Patagonia — https://www.patagonia.com/shop/womens/tops/sweatshirts-hoodies
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - firefox: ✅ 수집기 16개 · HTML 상품 링크 27 · 이미지 링크 14 · 글 23875자 · 예 https://www.patagonia.com/product/womens-daily-crewneck-sweatshirt/42172.html
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Patagonia — https://www.patagonia.com/shop/womens/tops/button-down
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 0 · 글 1007자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sezane — https://www.sezane.com/us-en/collection/t-shirts-sweatshirts-marinieres
  - impit: ⛔ HTTP 403 sezane.com
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sezane — https://www.sezane.com/us-en/collection/sweat-shirts-sailor-tops
  - impit: ⛔ HTTP 403 sezane.com
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Sezane — https://www.sezane.com/us-en/collection/dresses
  - impit: ⛔ HTTP 403 sezane.com
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Theory — https://www.theory.com/women/t-shirts-and-tanks/
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Theory — https://www.theory.com/women/loungewear/
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Theory — https://www.theory.com/women/tops/
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/category/tees-tanks/cat11199293
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/category/activewear/cat20059281
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/category/blouses-shirts/cat11199294
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/category/dresses/cat40004
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Chico's — https://www.chicos.com/store/category/pants/cat8289646
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/category/tees/cat4769286
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/category/tops/cat210001
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/category/dresses/cat210002
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- WHBM — https://www.whitehouseblackmarket.com/store/category/pants/cat210003
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Frank & Eileen — https://www.frankandeileen.com/collections/tees-tanks
  - impit: ✅ HTML 상품 링크 95 · 이미지 링크 97 · 글 13354자
  - playwright: ✅ 수집기 130개 · HTML 상품 링크 122 · 이미지 링크 124 · 글 18896자 · 예 https://www.frankandeileen.com/collections/holiday-collection
  - firefox: ✅ 수집기 130개 · HTML 상품 링크 122 · 이미지 링크 124 · 글 18643자 · 예 https://www.frankandeileen.com/collections/holiday-collection
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Frank & Eileen — https://www.frankandeileen.com/collections/sweatshirts-capelets
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 51 · 글 11649자
  - playwright: ✅ 수집기 84개 · HTML 상품 링크 74 · 이미지 링크 77 · 글 17115자 · 예 https://www.frankandeileen.com/collections/holiday-collection
  - firefox: ✅ 수집기 84개 · HTML 상품 링크 74 · 이미지 링크 77 · 글 16862자 · 예 https://www.frankandeileen.com/collections/holiday-collection
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Frank & Eileen — https://www.frankandeileen.com/collections/button-ups
  - impit: ✅ HTML 상품 링크 123 · 이미지 링크 128 · 글 15466자
  - playwright: ✅ 수집기 150개 · HTML 상품 링크 138 · 이미지 링크 143 · 글 21164자 · 예 https://www.frankandeileen.com/collections/holiday-collection
  - firefox: ✅ 수집기 150개 · HTML 상품 링크 138 · 이미지 링크 143 · 글 20911자 · 예 https://www.frankandeileen.com/collections/holiday-collection
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- James Perse — https://www.jamesperse.com/collections/womens-t-shirts
  - impit: ✅ HTML 상품 링크 22 · 이미지 링크 3 · 글 9833자
  - playwright: ✅ 수집기 20개 · HTML 상품 링크 19 · 이미지 링크 21 · 글 48817자 · 예 https://www.jamesperse.com/pages/search-results
  - firefox: ✅ 수집기 51개 · HTML 상품 링크 50 · 이미지 링크 52 · 글 119899자 · 예 https://www.jamesperse.com/pages/search-results
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- James Perse — https://www.jamesperse.com/collections/womens-tanks
  - impit: ✅ HTML 상품 링크 13 · 이미지 링크 3 · 글 9821자
  - playwright: ✅ 수집기 15개 · HTML 상품 링크 14 · 이미지 링크 16 · 글 36226자 · 예 https://www.jamesperse.com/pages/search-results
  - firefox: ✅ 수집기 15개 · HTML 상품 링크 14 · 이미지 링크 16 · 글 36226자 · 예 https://www.jamesperse.com/pages/search-results
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- James Perse — https://www.jamesperse.com/collections/womens-sweat-tops-sweat-bottoms
  - impit: ✅ HTML 상품 링크 22 · 이미지 링크 3 · 글 9905자
  - playwright: ✅ 수집기 40개 · HTML 상품 링크 39 · 이미지 링크 41 · 글 96009자 · 예 https://www.jamesperse.com/pages/search-results
  - firefox: ✅ 수집기 40개 · HTML 상품 링크 39 · 이미지 링크 41 · 글 96009자 · 예 https://www.jamesperse.com/pages/search-results
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Reformation — https://www.thereformation.com/tops
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ✅ 수집기 789개 · HTML 상품 링크 765 · 이미지 링크 662 · 글 2963717자 · 예 https://www.thereformation.com/collections/holiday-launch
  - firefox: ✅ 수집기 42개 · HTML 상품 링크 18 · 이미지 링크 15 · 글 124667자 · 예 https://www.thereformation.com/collections/holiday-launch
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Reformation — https://www.thereformation.com/the-sweater-shop.html
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ✅ 수집기 68개 · HTML 상품 링크 45 · 이미지 링크 1 · 글 9847자 · 예 https://www.thereformation.com/collections/holiday-launch
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Reformation — https://www.thereformation.com/tops/button-ups
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ✅ 수집기 79개 · HTML 상품 링크 60 · 이미지 링크 55 · 글 442417자 · 예 https://www.thereformation.com/collections/holiday-launch
  - firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Vanessa bruno — https://www.vanessabruno.com/clothing/shirts-tops/t-shirt.html
  - impit: 🟡 HTML 상품 링크 4 · 이미지 링크 23 · 글 10157자
  - playwright: ✅ 수집기 25개 · HTML 상품 링크 4 · 이미지 링크 21 · 글 7629자 · 예 https://www.vanessabruno.com/private-sale.html
  - firefox: ✅ 수집기 25개 · HTML 상품 링크 4 · 이미지 링크 21 · 글 7573자 · 예 https://www.vanessabruno.com/private-sale.html
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Vanessa bruno — https://www.vanessabruno.com/clothing/shirts-tops/top.html
  - impit: 🟡 HTML 상품 링크 2 · 이미지 링크 21 · 글 9502자
  - playwright: ✅ 수집기 23개 · HTML 상품 링크 2 · 이미지 링크 19 · 글 6984자 · 예 https://www.vanessabruno.com/private-sale.html
  - firefox: ✅ 수집기 23개 · HTML 상품 링크 2 · 이미지 링크 19 · 글 6984자 · 예 https://www.vanessabruno.com/private-sale.html
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Vanessa bruno — https://www.vanessabruno.com/last-chance/knitwear.html
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 20 · 글 8597자
  - playwright: ✅ 수집기 21개 · HTML 상품 링크 0 · 이미지 링크 18 · 글 6047자 · 예 https://www.vanessabruno.com/private-sale.html
  - firefox: ✅ 수집기 21개 · HTML 상품 링크 0 · 이미지 링크 18 · 글 6047자 · 예 https://www.vanessabruno.com/private-sale.html
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Monsoon — https://www.monsoonlondon.com/kr/womens/womens-clothing/tops/
  - impit: ✅ HTML 상품 링크 40 · 이미지 링크 8 · 글 8561자
  - playwright: ✅ 수집기 45개 · HTML 상품 링크 40 · 이미지 링크 46 · 글 11894자 · 예 https://www.monsoonlondon.com/us/new-in/
  - firefox: ✅ 수집기 45개 · HTML 상품 링크 40 · 이미지 링크 46 · 글 11894자 · 예 https://www.monsoonlondon.com/us/new-in/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Monsoon — https://www.monsoonlondon.com/kr/womens/womens-clothing/knitwear/
  - impit: ✅ HTML 상품 링크 40 · 이미지 링크 8 · 글 8176자
  - playwright: ✅ 수집기 45개 · HTML 상품 링크 40 · 이미지 링크 47 · 글 11556자 · 예 https://www.monsoonlondon.com/us/new-in/
  - firefox: ✅ 수집기 45개 · HTML 상품 링크 40 · 이미지 링크 47 · 글 11556자 · 예 https://www.monsoonlondon.com/us/new-in/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Monsoon — https://www.monsoonlondon.com/kr/womens/dresses/
  - impit: ✅ HTML 상품 링크 40 · 이미지 링크 8 · 글 8735자
  - playwright: ✅ 수집기 46개 · HTML 상품 링크 40 · 이미지 링크 43 · 글 12061자 · 예 https://www.monsoonlondon.com/us/new-in/
  - firefox: ✅ 수집기 46개 · HTML 상품 링크 40 · 이미지 링크 43 · 글 12061자 · 예 https://www.monsoonlondon.com/us/new-in/
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Whitestuff — https://www.whitestuff.com/browse/collection/womens-t-shirts
  - impit: ✅ HTML 상품 링크 60 · 이미지 링크 69 · 글 17389자
  - playwright: ✅ 수집기 62개 · HTML 상품 링크 60 · 이미지 링크 69 · 글 28414자 · 예 https://www.whitestuff.com/promo-terms-and-conditions
  - firefox: ✅ 수집기 62개 · HTML 상품 링크 60 · 이미지 링크 69 · 글 28414자 · 예 https://www.whitestuff.com/promo-terms-and-conditions
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Whitestuff — https://www.whitestuff.com/browse/womens/tops-and-tees
  - impit: ✅ HTML 상품 링크 63 · 이미지 링크 72 · 글 12523자
  - playwright: ✅ 수집기 60개 · HTML 상품 링크 60 · 이미지 링크 69 · 글 23349자 · 예 https://www.whitestuff.com/christmas
  - firefox: ✅ 수집기 60개 · HTML 상품 링크 60 · 이미지 링크 69 · 글 23349자 · 예 https://www.whitestuff.com/christmas
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Whitestuff — https://www.whitestuff.com/browse/womens/knitwear
  - impit: ✅ HTML 상품 링크 59 · 이미지 링크 69 · 글 17711자
  - playwright: ✅ 수집기 60개 · HTML 상품 링크 59 · 이미지 링크 69 · 글 29085자 · 예 https://www.whitestuff.com/christmas
  - firefox: ✅ 수집기 60개 · HTML 상품 링크 63 · 이미지 링크 73 · 글 29129자 · 예 https://www.whitestuff.com/christmas
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lucky Brand — https://www.luckybrand.com/women/clothing/shirts/tshirts-tanktops
  - impit: ✅ HTML 상품 링크 21 · 이미지 링크 21 · 글 35515자
  - playwright: ✅ 수집기 27개 · HTML 상품 링크 21 · 이미지 링크 21 · 글 41132자 · 예 https://www.luckybrand.com/sale/womens
  - firefox: ✅ 수집기 27개 · HTML 상품 링크 21 · 이미지 링크 21 · 글 41132자 · 예 https://www.luckybrand.com/sale/womens
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Lucky Brand — https://www.luckybrand.com/women/clothing/shirts/blouses
  - impit: ✅ HTML 상품 링크 17 · 이미지 링크 18 · 글 36502자
  - playwright: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 37자
  - firefox: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 37자
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Nike — https://www.nike.com/w/womens-tops-t-shirts-5e1x6z9om13
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 30 · 글 10024자
  - playwright: ✅ 수집기 54개 · HTML 상품 링크 0 · 이미지 링크 153 · 글 15727자 · 예 https://www.nike.com/w/womens-standard-tops-t-shirts-5e1x6z7ooj3z9om13
  - firefox: ✅ 수집기 54개 · HTML 상품 링크 0 · 이미지 링크 153 · 글 15727자 · 예 https://www.nike.com/w/womens-standard-tops-t-shirts-5e1x6z7ooj3z9om13
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)
- Nike — https://www.nike.com/w/womens-fleece-4xh6qz5e1x6
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 31 · 글 11252자
  - playwright: ✅ 수집기 54개 · HTML 상품 링크 0 · 이미지 링크 232 · 글 17823자 · 예 https://www.nike.com/w/nike-studio-fleece-s531
  - firefox: ✅ 수집기 54개 · HTML 상품 링크 0 · 이미지 링크 232 · 글 17823자 · 예 https://www.nike.com/w/nike-studio-fleece-s531
  - camoufox: ❌ 엔진 실행 실패: exit 139 (SIGSEGV)

</details>
