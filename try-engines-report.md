# 무료 크롤링 엔진 비교 (2026-11-24T04:11Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

✅ 소재까지 읽음 · 🟡 페이지는 열림(소재 없음/목록) · ⛔ 차단 · ❌ 오류

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 20쪽 ✅·🟡 | 목록 4쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| firefox | 9 | 7 | 8 | 0 | 9·4 | 0·3 | 정상 · 24쪽 · 180s |
| wayback | 5 | 5 | 0 | 14 | 5·1 | 0·4 | 정상 · 24쪽 · 19s |

## 대상 고르기

브랜드당 상품 4개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| Aritzia | 4 | 27 | 93/800 | /intl/en/new · /intl/en/clothing/coats-jackets/puffers/thesuperpuff |
| Chico's | 4 | 0 | 0/800 |  |
| Massimo Dutti | 4 | 0 | 0/599 |  |
| Patagonia | 4 | 0 | 0/168 |  |
| Zara | 4 | 0 | 0/499 |  |

## 페이지별

| 구분 | 브랜드 | firefox | wayback |
|---|---|:-:|:-:|
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html) | ⛔ | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html) | 🟡 | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/smooth-matter%E2%84%A2-ginger-top/133120.html) | ⛔ | ❌ |
| 상품 | [Aritzia](https://www.aritzia.com/intl/en/product/foxtrot-satin-camisole/128706.html) | ⛔ | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249) | ⛔ | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997) | ⛔ | ✅ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959) | ⛔ | ❌ |
| 상품 | [Chico's](https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423149?inseam=regular&sizeType=regular&color=1673&catId=cat11199293&collectionId=category&parentId=199761624812) | ⛔ | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106) | 🟡 | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575) | ✅ | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918) | 🟡 | ❌ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/long-sleeve-cotton-blend-henley-l06278106) | ✅ | 🟡 |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html) | 🟡 | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html) | ✅ | ❌ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html) | ✅ | ✅ |
| 상품 | [Patagonia](https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-trail-shirt/24493.html) | ✅ | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/long-sleeve-henley-t-shirt-p04174666.html?v1=615550153) | ✅ | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/cotton-modal-t-shirt-p08779741.html?v1=612283245) | ✅ | ❌ |
| 상품 | [Zara](https://www.zara.com/us/en/supima--long-sleeve-t-shirt-p00858777.html?v1=587652540) | ✅ | ❌ |
| 상품 | [Zara](https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=569054944) | ✅ | ✅ |
| 목록 | [prana.com](https://www.prana.com/women/tops.html) | 🟡 | 🟡 |
| 목록 | [whitehouseblackmarket.com](https://www.whitehouseblackmarket.com/store/category/tops/cat210001) | 🟡 | 🟡 |
| 목록 | [chicos.com](https://www.chicos.com/store/category/dresses/cat40004) | ⛔ | 🟡 |
| 목록 | [veronicabeard.com](https://veronicabeard.com/collections/tops) | 🟡 | 🟡 |

<details><summary>사유</summary>

- Aritzia — https://www.aritzia.com/intl/en/product/refine-shine%E2%84%A2-nominee-blouse/120661.html
  - firefox: ⛔ HTTP 403 Just a moment...
  - wayback: ❌ 보관본 없음
- Aritzia — https://www.aritzia.com/intl/en/product/caprice-satin-bustier/129128.html
  - firefox: 🟡 글 10447자
  - wayback: ❌ 보관본 없음
- Aritzia — https://www.aritzia.com/intl/en/product/smooth-matter%E2%84%A2-ginger-top/133120.html
  - firefox: ⛔ HTTP 403 Just a moment...
  - wayback: ❌ 보관본 없음
- Aritzia — https://www.aritzia.com/intl/en/product/foxtrot-satin-camisole/128706.html
  - firefox: ⛔ HTTP 403 Just a moment...
  - wayback: ❌ 보관본 없음
- Chico's — https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249
  - firefox: ⛔ HTTP 403 Access Denied
  - wayback: ❌ 보관본 없음
- Chico's — https://www.chicos.com/store/product/touch-of-cool-mockneck-layering-tee/570355541?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=196533518997
  - firefox: ⛔ HTTP 403 Access Denied
  - wayback: ✅ 20260515 보관본 · Viscose 95% / Elastane 5%
- Chico's — https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423172?inseam=regular&sizeType=regular&color=5125&catId=cat11199293&collectionId=category&parentId=199761624959
  - firefox: ⛔ HTTP 403 Access Denied
  - wayback: ❌ 보관본 없음
- Chico's — https://www.chicos.com/store/product/touch-of-cool-crewneck-layering-tee/570423149?inseam=regular&sizeType=regular&color=1673&catId=cat11199293&collectionId=category&parentId=199761624812
  - firefox: ⛔ HTTP 403 Access Denied
  - wayback: ❌ 보관본 없음
- Massimo Dutti — https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
  - firefox: 🟡 글 3130자
  - wayback: ❌ 보관본 없음
- Massimo Dutti — https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575
  - firefox: ✅ Lyocell 70% / Wool 30%
  - wayback: ❌ 보관본 없음
- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918
  - firefox: 🟡 글 23135자
  - wayback: ❌ 보관본 없음
- Massimo Dutti — https://www.massimodutti.com/us/long-sleeve-cotton-blend-henley-l06278106
  - firefox: ✅ Cotton 93% / Cashmere 7%
  - wayback: 🟡 20261014 보관본 · 글 3642자
- Patagonia — https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html
  - firefox: 🟡 글 1017자
  - wayback: ❌ 보관본 없음
- Patagonia — https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html
  - firefox: ✅ Cotton 100%
  - wayback: ❌ 보관본 없음
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html
  - firefox: ✅ Wool 65% / Polyester 35%
  - wayback: ✅ 20260423 보관본 · Wool 65% / Polyester 35%
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-trail-shirt/24493.html
  - firefox: ✅ Polyester 85% / Lyocell 15%
  - wayback: ✅ 20260420 보관본 · Polyester 85% / Lyocell 15%
- Zara — https://www.zara.com/us/en/long-sleeve-henley-t-shirt-p04174666.html?v1=615550153
  - firefox: ✅ Cotton 95% / Elastane 5%
  - wayback: ✅ 20260926 보관본 · Cotton 95% / Elastane 5%
- Zara — https://www.zara.com/us/en/cotton-modal-t-shirt-p08779741.html?v1=612283245
  - firefox: ✅ Cotton 47% / Modal 47% / Elastane 6%
  - wayback: ❌ 보관본 없음
- Zara — https://www.zara.com/us/en/supima--long-sleeve-t-shirt-p00858777.html?v1=587652540
  - firefox: ✅ Cotton 100%
  - wayback: ❌ 보관본 없음
- Zara — https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=569054944
  - firefox: ✅ Cotton 100%
  - wayback: ✅ 20260923 보관본 · Cotton 100%
- prana.com — https://www.prana.com/women/tops.html
  - firefox: 🟡 글 10946자
  - wayback: 🟡 20260404 보관본 · 글 6883자
- whitehouseblackmarket.com — https://www.whitehouseblackmarket.com/store/category/tops/cat210001
  - firefox: 🟡 글 29340자
  - wayback: 🟡 20260909 보관본 · 글 18329자
- chicos.com — https://www.chicos.com/store/category/dresses/cat40004
  - firefox: ⛔ HTTP 403 Access Denied
  - wayback: 🟡 20261021 보관본 · 글 13928자
- veronicabeard.com — https://veronicabeard.com/collections/tops
  - firefox: 🟡 글 28187자
  - wayback: 🟡 20260813 보관본 · 글 16263자

</details>
