# 무료 크롤링 엔진 비교 (2026-11-24T01:27Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

✅ 소재까지 읽음 · 🟡 페이지는 열림(소재 없음/목록) · ⛔ 차단 · ❌ 오류

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 54쪽 ✅·🟡 | 목록 4쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 5 | 5 | 45 | 3 | 5·4 | 0·1 | 정상 · 58쪽 · 560s |
| firefox | 9 | 6 | 43 | 0 | 9·5 | 0·1 | 정상 · 58쪽 · 434s |
| crawlee-chromium | 6 | 4 | 45 | 3 | 6·3 | 0·1 | 정상 · 58쪽 · 177s |
| crawlee-firefox | 8 | 9 | 41 | 0 | 8·6 | 0·3 | 정상 · 58쪽 · 187s |
| camoufox | 0 | 0 | 0 | 58 | 0·0 | 0·0 | 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp · 0/58쪽까지 · 1s |
| wayback | 15 | 7 | 0 | 36 | 15·3 | 0·4 | 정상 · 58쪽 · 53s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| Addidas | 3 | 18 | 20/537 | /us/black_friday · /us/men-trending |
| Anthropologie | 3 | 0 | 0/259 |  |
| Aritzia | 3 | 27 | 93/800 | /intl/en/new · /intl/en/clothing/coats-jackets/puffers/thesuperpuff |
| Arket | 3 | 0 | 0/382 |  |
| Chico's | 3 | 0 | 0/800 |  |
| Everlane | 3 | 0 | 0/450 |  |
| Fatface | 3 | 0 | 0/456 |  |
| Free People | 3 | 0 | 13/192 |  |
| Joules | 3 | 7 | 7/566 | /shop/womens/clothing/tops/t-shirts · /shop/womens/clothing/tops/rugby-shirts |
| Massimo Dutti | 3 | 0 | 0/599 |  |
| Patagonia | 3 | 0 | 0/168 |  |
| Sezane | 3 | 37 | 50/206 | /us-en/petit-sezane · /us-en/octobre-editions/collection |
| Lululemon | 3 | 4 | 119/483 | /c/women-t-shirts/n1oyr3zwx7wzydf5 · /c/women-classic-fit-t-shirts/n153mlzwx7w |
| Mango | 3 | 0 | 0/88 |  |
| &Other Stories | 3 | 6 | 9/477 | /en-us/shoes/ · /en-us/bags/ |
| Reformation | 3 | 0 | 0/730 |  |
| H&M | 3 | 0 | 6/743 |  |
| Zara | 3 | 0 | 0/500 |  |

## 페이지별

| 구분 | 브랜드 | playwright | firefox | crawlee-chromium | crawlee-firefox | camoufox | wayback |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|
| 상품 | [Addidas](https://www.adidas.com/us/adi365-running-climacool-iconic-t-shirt/JZ5162.html) | ⛔ | ⛔ | ⛔ | 🟡 | ❌ | ❌ |
| 상품 | [Addidas](https://www.adidas.com/us/adi365-running-climacool-iconic-t-shirt/KS3240.html) | ⛔ | ⛔ | ⛔ | 🟡 | ❌ | ❌ |
| 상품 | [Addidas](https://www.adidas.com/us/adi365-running-climacool-iconic-t-shirt/JZ5163.html) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/maeve-sequined-baby-tee) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/by-anthropologie-fuzzy-dolman-sleeve-boatneck-top) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Anthropologie](https://www.anthropologie.com/shop/by-anthropologie-arena-wool-blend-fitted-turtleneck-top) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | 🟡 |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html) | ⛔ | ⛔ | ⛔ | ✅ | ❌ | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html) | ⛔ | 🟡 | ⛔ | 🟡 | ❌ | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/smooth-matter%E2%84%A2-ginger-top/133120.html) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Arket](https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Arket](https://www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135758046/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Arket](https://www.arket.com/en-ww/product/wool-rib-top-black-1357865001/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Everlane](https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote) | ✅ | ⛔ | ✅ | ⛔ | ❌ | ❌ |
| 상품 | [Everlane](https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-ponderosa-pine) | ✅ | ✅ | ✅ | ⛔ | ❌ | ❌ |
| 상품 | [Everlane](https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-brown-stripe) | ✅ | ✅ | ✅ | ⛔ | ❌ | ✅ |
| 상품 | [Fatface](https://www.fatface.com/style/sv299843/968669) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Fatface](https://www.fatface.com/style/sv455991/v77736) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Fatface](https://www.fatface.com/style/sv042896/v67869) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Free People](https://www.freepeople.com/shop/we-the-free-nolan-swit/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Free People](https://www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Free People](https://www.freepeople.com/shop/we-the-free-surplus-cuff-top/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Joules](https://www.joules.com/style/sv013348/g84805) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Joules](https://www.joules.com/style/su250341/q94498) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Joules](https://www.joules.com/style/sv067949/g24062) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106) | ⛔ | ✅ | ⛔ | 🟡 | ❌ | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575) | ⛔ | ✅ | ⛔ | 🟡 | ❌ | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918) | ⛔ | 🟡 | ⛔ | 🟡 | ❌ | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html) | 🟡 | 🟡 | 🟡 | ✅ | ❌ | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html) | 🟡 | 🟡 | 🟡 | ✅ | ❌ | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html) | 🟡 | 🟡 | 🟡 | ✅ | ❌ | ✅ |
| 상품 | [Sezane](https://www.sezane.com/us-en/product/leon-t-shirt/white) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Sezane](https://www.sezane.com/us-en/product/leon-t-shirt/navy) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Sezane](https://www.sezane.com/us-en/product/leon-t-shirt/black) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Lululemon](https://shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8) | ❌ | ⛔ | ❌ | ⛔ | ❌ | ✅ |
| 상품 | [Lululemon](https://shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim) | ❌ | ✅ | ❌ | ⛔ | ❌ | 🟡 |
| 상품 | [Lululemon](https://shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm) | ❌ | ⛔ | ❌ | ⛔ | ❌ | ❌ |
| 상품 | [Mango](https://shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-shirt/37091331/01/00) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Mango](https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/07/00) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [Mango](https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/32/00) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [&Other Stories](https://www.stories.com/en-us/product/embroidered-wool-polo-jumper-grey-1368465001/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [&Other Stories](https://www.stories.com/en-us/product/mock-neck-lace-top-dark-red-1373644002/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [&Other Stories](https://www.stories.com/en-us/product/wool-turtleneck-top-black-1341950002/) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Reformation](https://www.thereformation.com/products/veya-silk-top/1319462USE.html?dwvar_1319462USE_color=USE) | ✅ | ✅ | ⛔ | ✅ | ❌ | ✅ |
| 상품 | [Reformation](https://www.thereformation.com/products/indigo-knit-top/1321141GOL.html?dwvar_1321141GOL_color=GOL) | 🟡 | ⛔ | ⛔ | ⛔ | ❌ | 🟡 |
| 상품 | [Reformation](https://www.thereformation.com/products/norette-knit-top/1320799PZZ.html?dwvar_1320799PZZ_color=PZZ) | ✅ | ⛔ | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [H&M](https://www2.hm.com/en_us/productpage.1378282001.html) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [H&M](https://www2.hm.com/en_us/productpage.1378282002.html) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [H&M](https://www2.hm.com/en_us/productpage.1372041001.html) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [Zara](https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=615161645) | ⛔ | ✅ | ✅ | ✅ | ❌ | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=615792507) | ⛔ | ✅ | ✅ | ✅ | ❌ | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/washed-crepe-100-cotton-t-shirt-p04424641.html?v1=576063400) | ⛔ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 목록 | [prana.com](https://www.prana.com/women/tops.html) | ⛔ | ⛔ | ⛔ | 🟡 | ❌ | 🟡 |
| 목록 | [whitehouseblackmarket.com](https://www.whitehouseblackmarket.com/store/category/tops/cat210001) | ⛔ | ⛔ | ⛔ | 🟡 | ❌ | 🟡 |
| 목록 | [chicos.com](https://www.chicos.com/store/category/dresses/cat40004) | ⛔ | ⛔ | ⛔ | ⛔ | ❌ | 🟡 |
| 목록 | [veronicabeard.com](https://veronicabeard.com/collections/tops) | 🟡 | 🟡 | 🟡 | 🟡 | ❌ | 🟡 |

<details><summary>사유</summary>

- Addidas — https://www.adidas.com/us/adi365-running-climacool-iconic-t-shirt/JZ5162.html
  - playwright: ⛔ HTTP 403 adidas
  - firefox: ⛔ HTTP 403 adidas
  - crawlee-chromium: ⛔ HTTP 403 adidas
  - crawlee-firefox: 🟡 글 34자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Addidas — https://www.adidas.com/us/adi365-running-climacool-iconic-t-shirt/KS3240.html
  - playwright: ⛔ HTTP 403 adidas
  - firefox: ⛔ HTTP 403 adidas
  - crawlee-chromium: ⛔ HTTP 403 adidas
  - crawlee-firefox: 🟡 글 838자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Addidas — https://www.adidas.com/us/adi365-running-climacool-iconic-t-shirt/JZ5163.html
  - playwright: ⛔ HTTP 403 adidas
  - firefox: ⛔ HTTP 403 adidas
  - crawlee-chromium: ⛔ HTTP 403 adidas
  - crawlee-firefox: ⛔ HTTP 403 adidas
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Anthropologie — https://www.anthropologie.com/shop/maeve-sequined-baby-tee
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - crawlee-chromium: ⛔ HTTP 403 anthropologie.com
  - crawlee-firefox: ⛔ HTTP 403 anthropologie.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-fuzzy-dolman-sleeve-boatneck-top
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - crawlee-chromium: ⛔ HTTP 403 anthropologie.com
  - crawlee-firefox: ⛔ HTTP 403 anthropologie.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-arena-wool-blend-fitted-turtleneck-top
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - crawlee-chromium: ⛔ HTTP 403 anthropologie.com
  - crawlee-firefox: ⛔ HTTP 403 anthropologie.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: 🟡 20261115 보관본 · 글 3220자
- Aritzia — https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - crawlee-chromium: ⛔ HTTP 403 Just a moment...
  - crawlee-firefox: ✅ Leather 100%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Aritzia — https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: 🟡 글 10447자
  - crawlee-chromium: ⛔ HTTP 403 Just a moment...
  - crawlee-firefox: 🟡 글 9886자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Aritzia — https://www.aritzia.com/intl/en/product/smooth-matter%E2%84%A2-ginger-top/133120.html
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - crawlee-chromium: ⛔ HTTP 403 Just a moment...
  - crawlee-firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Arket — https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260712 보관본 · Cotton 96% / Elastane 4%
- Arket — https://www.arket.com/en-ww/product/pearl-heavyweight-t-shirt-light-beige-1135758046/
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260125 보관본 · Cotton 96% / Elastane 4%
- Arket — https://www.arket.com/en-ww/product/wool-rib-top-black-1357865001/
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Chico's — https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Chico's — https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260515 보관본 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Everlane — https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote
  - playwright: ✅ Cotton 100%
  - firefox: ⛔ HTTP 403 Verify your browser
  - crawlee-chromium: ✅ Cotton 100%
  - crawlee-firefox: ⛔ HTTP 403 Verify your browser
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Everlane — https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-ponderosa-pine
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - crawlee-chromium: ✅ Cotton 100%
  - crawlee-firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Everlane — https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-brown-stripe
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
  - crawlee-chromium: ✅ Cotton 100%
  - crawlee-firefox: ⛔ HTTP 403 Verify your browser
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260914 보관본 · Cotton 100%
- Fatface — https://www.fatface.com/style/sv299843/968669
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Fatface — https://www.fatface.com/style/sv455991/v77736
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Fatface — https://www.fatface.com/style/sv042896/v67869
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Free People — https://www.freepeople.com/shop/we-the-free-nolan-swit/
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - crawlee-chromium: ⛔ HTTP 403 freepeople.com
  - crawlee-firefox: ⛔ HTTP 403 freepeople.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Free People — https://www.freepeople.com/shop/we-the-free-tinsley-long-sleeve-top/
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - crawlee-chromium: ⛔ HTTP 403 freepeople.com
  - crawlee-firefox: ⛔ HTTP 403 freepeople.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20261021 보관본 · Cotton 50% / Modal 50%
- Free People — https://www.freepeople.com/shop/we-the-free-surplus-cuff-top/
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - crawlee-chromium: ⛔ HTTP 403 freepeople.com
  - crawlee-firefox: ⛔ HTTP 403 freepeople.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20261117 보관본 · Cotton 95% / Elastane 5%
- Joules — https://www.joules.com/style/sv013348/g84805
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Joules — https://www.joules.com/style/su250341/q94498
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260508 보관본 · Viscose 86% / Elastane 14%
- Joules — https://www.joules.com/style/sv067949/g24062
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Massimo Dutti — https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Cotton 93% / Cashmere 5% / Wool 2%
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: 🟡 글 3130자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Massimo Dutti — https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Lyocell 70% / Wool 30%
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: 🟡 글 3089자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: 🟡 글 23135자
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: 🟡 글 3152자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Patagonia — https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html
  - playwright: 🟡 글 1017자
  - firefox: 🟡 글 1017자
  - crawlee-chromium: 🟡 글 1017자
  - crawlee-firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Patagonia — https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html
  - playwright: 🟡 글 1017자
  - firefox: 🟡 글 1017자
  - crawlee-chromium: 🟡 글 1017자
  - crawlee-firefox: ✅ Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html
  - playwright: 🟡 글 1017자
  - firefox: 🟡 글 1017자
  - crawlee-chromium: 🟡 글 1017자
  - crawlee-firefox: ✅ Wool 65% / Polyester 35%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260423 보관본 · Wool 65% / Polyester 35%
- Sezane — https://www.sezane.com/us-en/product/leon-t-shirt/white
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - crawlee-chromium: ⛔ HTTP 403 sezane.com
  - crawlee-firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Sezane — https://www.sezane.com/us-en/product/leon-t-shirt/navy
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - crawlee-chromium: ⛔ HTTP 403 sezane.com
  - crawlee-firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Sezane — https://www.sezane.com/us-en/product/leon-t-shirt/black
  - playwright: ⛔ HTTP 403 sezane.com
  - firefox: ⛔ HTTP 403 sezane.com
  - crawlee-chromium: ⛔ HTTP 403 sezane.com
  - crawlee-firefox: ⛔ HTTP 403 sezane.com
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260821 보관본 · Cotton 100%
- Lululemon — https://shop.lululemon.com/p/little-ribbed-tee/b5a7hl0ba8
  - playwright: ❌ page.goto: Timeout 45000ms exceeded.
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ❌ page.goto: net::ERR_HTTP2_PROTOCOL_ERROR at https://shop.lululemon.com
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260719 보관본 · Cotton 91% / Elastane 9%
- Lululemon — https://shop.lululemon.com/p/the-classic-jersey-tee/rf5usypnim
  - playwright: ❌ page.goto: Timeout 45000ms exceeded.
  - firefox: ✅ Cotton 97% / Elastane 3% / Cotton 94% / Elastane 6%
  - crawlee-chromium: ❌ page.goto: net::ERR_HTTP2_PROTOCOL_ERROR at https://shop.lululemon.com
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: 🟡 20260810 보관본 · 글 8012자
- Lululemon — https://shop.lululemon.com/p/forever-favourite-tee/g4tzotd8xm
  - playwright: ❌ page.goto: Timeout 45000ms exceeded.
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ❌ page.goto: net::ERR_HTTP2_PROTOCOL_ERROR at https://shop.lululemon.com
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/100-cotton-round-neck-t-shirt/37091331/01/00
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - crawlee-chromium: ⛔ HTTP 429 Vercel Security Checkpoint
  - crawlee-firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/07/00
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - crawlee-chromium: ⛔ HTTP 429 Vercel Security Checkpoint
  - crawlee-firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260921 보관본 · Polyester 65% / Viscose 32% / Elastane 3%
- Mango — https://shop.mango.com/us/en/p/women/t-shirts/basics/long-sleeved-boat-neck-t-shirt/37094103/32/00
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - crawlee-chromium: ⛔ HTTP 429 Vercel Security Checkpoint
  - crawlee-firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- &Other Stories — https://www.stories.com/en-us/product/embroidered-wool-polo-jumper-grey-1368465001/
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- &Other Stories — https://www.stories.com/en-us/product/mock-neck-lace-top-dark-red-1373644002/
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- &Other Stories — https://www.stories.com/en-us/product/wool-turtleneck-top-black-1341950002/
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Reformation — https://www.thereformation.com/products/veya-silk-top/1319462USE.html?dwvar_1319462USE_color=USE
  - playwright: ✅ Silk 100%
  - firefox: ✅ Silk 100%
  - crawlee-chromium: ⛔ HTTP 403 Just a moment...
  - crawlee-firefox: ✅ Silk 100%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20261110 보관본 · Silk 100%
- Reformation — https://www.thereformation.com/products/indigo-knit-top/1321141GOL.html?dwvar_1321141GOL_color=GOL
  - playwright: 🟡 글 100788자
  - firefox: ⛔ HTTP 403 Just a moment...
  - crawlee-chromium: ⛔ HTTP 403 Just a moment...
  - crawlee-firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: 🟡 20261113 보관본 · 글 6954자
- Reformation — https://www.thereformation.com/products/norette-knit-top/1320799PZZ.html?dwvar_1320799PZZ_color=PZZ
  - playwright: ✅ Lyocell 67% / Cotton 29% / Elastane 4%
  - firefox: ⛔ HTTP 403 Just a moment...
  - crawlee-chromium: ⛔ HTTP 403 Just a moment...
  - crawlee-firefox: ⛔ HTTP 403 Just a moment...
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20261106 보관본 · Lyocell 67% / Cotton 29% / Elastane 4%
- H&M — https://www2.hm.com/en_us/productpage.1378282001.html
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- H&M — https://www2.hm.com/en_us/productpage.1378282002.html
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- H&M — https://www2.hm.com/en_us/productpage.1372041001.html
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- Zara — https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=615161645
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Wool 100% / Cotton 100%
  - crawlee-chromium: ✅ Wool 100% / Cotton 100%
  - crawlee-firefox: ✅ Wool 100% / Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20261112 보관본 · Cotton 100%
- Zara — https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=615792507
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Wool 100% / Cotton 100%
  - crawlee-chromium: ✅ Wool 100% / Cotton 100%
  - crawlee-firefox: ✅ Wool 100% / Cotton 100%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ✅ 20260923 보관본 · Cotton 100%
- Zara — https://www.zara.com/us/en/washed-crepe-100-cotton-t-shirt-p04424641.html?v1=576063400
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ Cotton 100% / Wool 100%
  - crawlee-chromium: ✅ Cotton 100% / Wool 100%
  - crawlee-firefox: ✅ Cotton 100% / Wool 100%
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: ❌ 보관본 없음
- prana.com — https://www.prana.com/women/tops.html
  - playwright: ⛔ HTTP 403 Access to this page has been denied
  - firefox: ⛔ HTTP 403 Access to this page has been denied
  - crawlee-chromium: ⛔ HTTP 403 Attention Required! | Cloudflare
  - crawlee-firefox: 🟡 글 9805자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: 🟡 20260404 보관본 · 글 6883자
- whitehouseblackmarket.com — https://www.whitehouseblackmarket.com/store/category/tops/cat210001
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: 🟡 글 26715자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: 🟡 20260909 보관본 · 글 18329자
- chicos.com — https://www.chicos.com/store/category/dresses/cat40004
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - crawlee-chromium: ⛔ HTTP 403 Access Denied
  - crawlee-firefox: ⛔ HTTP 403 Access Denied
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: 🟡 20261021 보관본 · 글 13928자
- veronicabeard.com — https://veronicabeard.com/collections/tops
  - playwright: 🟡 글 28550자
  - firefox: 🟡 글 28123자
  - crawlee-chromium: 🟡 글 28209자
  - crawlee-firefox: 🟡 글 28211자
  - camoufox: ❌ 엔진 실행 실패: Failed to fetch releases from https://api.github.com/repos/daijro/camoufox/releases/tags/v152.0.4-beta.30 after 5 attemp
  - wayback: 🟡 20260813 보관본 · 글 16263자

</details>
