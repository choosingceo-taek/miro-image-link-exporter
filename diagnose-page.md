# 목록 페이지 진단 (2026-08-12 20:01Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

## https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017

- HTTP **200** · 최종주소 `https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017`
- 제목: "Women's Sweatpants | Carhartt"
- 링크 253개 · `<img>` 85개 · iframe 2개
- 링크 중 이미지가 딸린 것 38개 → 그중 주소를 뽑아낸 것 **29개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 9 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |

**주소를 찾은 속성**: `src` 29

**성공한 카드의 class**: `list-item ng-star-inserted` 25 · `footer-nav-link ng-star-inserted` 3 · `header-large-logo` 1

**이미지가 안 붙은 상품 링크 표본**

- `/en-eu/p/relaxed-fit-fleece-joggers/105510`
  - 카드 class: `cx-product-image-container`
  - img 속성: `_ngcontent-ng-c4076350514=` `src=/images/common/eye-black.svg` `alt=` `aria-hidden=true`
  - ```<a _ngcontent-ng-c4076350514="" tabindex="-1" class="cx-product-image-container" id="105510" data-sku="105510-V61XLREG" data-position="1" href="/en-eu/p/relaxed-fit-fleece-joggers/105510"><div _ngcontent-ng-c4076350514="" class="product-image-wrapper"><!----><!----><a _ngcontent-ng-c4076350514="" tabindex="0" role="button" mattooltiphidedelay="750" mattooltipposition="right" aria-haspopup="dialog"```
- `/en-eu/p/relaxed-fit-fleece-joggers/105510`
  - 카드 class: `product-name`
  - img 속성: (img 없음)
  - ```<a _ngcontent-ng-c4076350514="" class="product-name" data-sku="105510-V61XLREG" data-position="1" href="/en-eu/p/relaxed-fit-fleece-joggers/105510"><h2 _ngcontent-ng-c4076350514="" class="product-name-label">Relaxed Fit Fleece Joggers</h2></a>```

## https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030

- HTTP **200** · 최종주소 `https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030`
- 제목: "Women's T-Shirts: Graphic Tees, Cropped & More | American Eagle"
- 링크 516개 · `<img>` 257개 · iframe 6개
- 링크 중 이미지가 딸린 것 125개 → 그중 주소를 뽑아낸 것 **125개**

**주소를 찾은 속성**: `src` 125

**성공한 카드의 class**: `x-link-to qa-x-link-to _tile-link_1loo4i` 120 · `_container_1eekmh ae-theme` 2 · `flyout qa-flyout flyout-onboarding qa-flyout-onboarding _con` 2 · `_content_13ccxt` 1

**이미지가 안 붙은 상품 링크 표본**

- `/intl/en/p/women/tops/t-shirts/ae-hey-baby-waffle-tee/2370_1980_647`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-hey-baby-waffle-tee/2370_1980_647" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-ae _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Hey Baby Waffle Tee" data-```
- `/intl/en/p/women/tops/t-shirts/ae-everyday-t-shirt/1537_1852_008`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-everyday-t-shirt/1537_1852_008" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-ae _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Everyday T-Shirt" data-testid```
- `/intl/en/p/women/tops/t-shirts/ae-hey-baby-waffle-tee/2370_1836_062`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-hey-baby-waffle-tee/2370_1836_062" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-ae _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Hey Baby Waffle Tee" data-```

## https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031

- HTTP **200** · 최종주소 `https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031`
- 제목: "Women's Tops: Cozy Sweaters, Sweatshirts, Shirts & More | Aerie"
- 링크 597개 · `<img>` 280개 · iframe 12개
- 링크 중 이미지가 딸린 것 148개 → 그중 주소를 뽑아낸 것 **148개**

**주소를 찾은 속성**: `src` 148

**성공한 카드의 class**: `x-link-to qa-x-link-to _tile-link_1loo4i` 120 · `images_Dzl3I` 14 · `container_2ZJCi with-columns_yaY1x` 7 · `_container_1eekmh aerie-theme` 2 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-f2b4e` 1 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-fa209` 1 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-c4f94` 1 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-f2a90` 1

**이미지가 안 붙은 상품 링크 표본**

- `/us/en/p/aerie/tops/sweatshirts-hoodies/aerie-quarter-snap-sweatshirt/0743_3983_410`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/sweatshirts-hoodies/aerie-quarter-snap-sweatshirt/0743_3983_410" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="Aerie Quar```
- `/us/en/p/aerie/tops/t-shirts/aerie-cozy-polo-boyfriend-t-shirt/5495_4186_092`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/t-shirts/aerie-cozy-polo-boyfriend-t-shirt/5495_4186_092" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="Aerie Cozy Polo B```
- `/us/en/p/aerie/tops/t-shirts/aerie-cozy-polo-boyfriend-t-shirt/5495_4186_192`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/t-shirts/aerie-cozy-polo-boyfriend-t-shirt/5495_4186_192" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="Aerie Cozy Polo B```

## https://www.apieceapart.com/shop/tops

- HTTP **200** · 최종주소 `https://www.apieceapart.com/shop/tops`
- 제목: "Tops | Apiece Apart"
- 링크 80개 · `<img>` 129개 · iframe 0개
- 링크 중 이미지가 딸린 것 0개 → 그중 주소를 뽑아낸 것 **0개**

**이미지가 안 붙은 상품 링크 표본**

- `/products/cropped-isolde-button-down-2?id=f9201e82-ff3a-45ab-8c49-5907123c3e14`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Cropped Isolde Button Down" href="/products/cropped-isolde-button-down-2?id=f9201e82-ff3a-45ab-8c49-5907123c3e14"><span class="sr-only">Cropped Isolde ```
- `/products/monde-drape-bias-top?id=7a00e29c-ef82-41bd-9297-a86e4d7a089b`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Monde Drape Bias Top" href="/products/monde-drape-bias-top?id=7a00e29c-ef82-41bd-9297-a86e4d7a089b"><span class="sr-only">Monde Drape Bias Top</span></```
- `/products/isolde-button-down-6?id=335ab320-6b5a-422d-b304-077ff57e62c6`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Isolde Button Down" href="/products/isolde-button-down-6?id=335ab320-6b5a-422d-b304-077ff57e62c6"><span class="sr-only">Isolde Button Down</span></a>```

