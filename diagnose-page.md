# 목록 페이지 진단 (2026-11-12 23:59Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

## https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017

- HTTP **200** · 최종주소 `https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017`
- 제목: "Women's Sweatpants | Carhartt"
- 링크 256개 · `<img>` 84개 · iframe 2개
- 링크 중 이미지가 딸린 것 37개 → 그중 주소를 뽑아낸 것 **28개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 9 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |

**주소를 찾은 속성**: `src` 28

**성공한 카드의 class**: `list-item ng-star-inserted` 24 · `footer-nav-link ng-star-inserted` 3 · `header-large-logo` 1

**이미지가 안 붙은 상품 링크 표본**

- `/en-eu/p/relaxed-fit-fleece-joggers/105510`
  - 카드 class: `cx-product-image-container`
  - img 속성: `_ngcontent-ng-c507543076=` `src=/images/common/eye-black.svg` `alt=` `aria-hidden=true`
  - ```<a _ngcontent-ng-c507543076="" tabindex="-1" class="cx-product-image-container" id="105510" data-sku="105510-V61XSREG" data-position="1" href="/en-eu/p/relaxed-fit-fleece-joggers/105510"><div _ngcontent-ng-c507543076="" class="product-image-wrapper"><!----><!----><a _ngcontent-ng-c507543076="" tabindex="0" role="button" mattooltiphidedelay="750" mattooltipposition="right" aria-haspopup="dialog" cl```
- `/en-eu/p/relaxed-fit-fleece-joggers/105510`
  - 카드 class: `product-name product-name-link`
  - img 속성: (img 없음)
  - ```<a _ngcontent-ng-c507543076="" class="product-name product-name-link" data-sku="105510-V61XSREG" data-position="1" href="/en-eu/p/relaxed-fit-fleece-joggers/105510"><h2 _ngcontent-ng-c507543076="" class="product-name-label">Relaxed Fit Fleece Joggers</h2></a>```

## https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030

- HTTP **200** · 최종주소 `https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030`
- 제목: "Women's Graphic, Cropped, and Oversized T-Shirts | American Eagle"
- 링크 563개 · `<img>` 241개 · iframe 6개
- 링크 중 이미지가 딸린 것 125개 → 그중 주소를 뽑아낸 것 **125개**

**주소를 찾은 속성**: `src` 125

**성공한 카드의 class**: `x-link-to qa-x-link-to _tile-link_1loo4i` 120 · `_container_1eekmh ae-theme` 2 · `flyout qa-flyout flyout-onboarding qa-flyout-onboarding _con` 2 · `_logo-container_1u97wq _with-banner_1u97wq` 1

**이미지가 안 붙은 상품 링크 표본**

- `/intl/en/p/women/tops/t-shirts/ae-soft-sexy-waffle-mock-neck-tee/3376_2032_600`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-soft-sexy-waffle-mock-neck-tee/3376_2032_600" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-ae _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Soft &amp; Sexy```
- `/intl/en/p/women/tops/t-shirts/ae-cozy-crew-neck-long-sleeve-t-shirt/3376_2022_603`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-cozy-crew-neck-long-sleeve-t-shirt/3376_2022_603" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <!----> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Cozy Crew Neck Long Sleeve T-Shirt" data-testid="name"> AE Cozy Crew Neck Long Sleeve T-Shirt </h3> <div class="container_AAFq2 t```
- `/intl/en/p/women/tops/t-shirts/ae-long-sleeve-waffle-plush-crew-neck-tee/1532_2058_603`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-long-sleeve-waffle-plush-crew-neck-tee/1532_2058_603" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-ae _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Long-Sl```

## https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031

- HTTP **200** · 최종주소 `https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031`
- 제목: "Women's Tops: Cozy Sweaters, Sweatshirts, Shirts & More | Aerie"
- 링크 516개 · `<img>` 210개 · iframe 9개
- 링크 중 이미지가 딸린 것 118개 → 그중 주소를 뽑아낸 것 **118개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| shadow DOM 안의 링크 | 6 | shadow 호스트 1개 — querySelectorAll 로는 안 보입니다 |

**주소를 찾은 속성**: `src` 118

**성공한 카드의 class**: `x-link-to qa-x-link-to _tile-link_1loo4i` 90 · `images_T6gbn` 12 · `container_lNjyr with-columns_wvSlQ` 6 · `content_4Lkq- qa-headless-cms-lockup-overlay cms-1y275r4 ove` 6 · `_container_1eekmh aerie-theme` 2 · `_logo-container_1u97wq _with-banner_1u97wq` 1 · `container_lNjyr with-columns_wvSlQ shake-animation_3etWh` 1

**이미지가 안 붙은 상품 링크 표본**

- `/us/en/p/aerie/tops/sweaters-cardigans/aerie-cotton-cable-cardigan/9492_4006_618`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/sweaters-cardigans/aerie-cotton-cable-cardigan/9492_4006_618" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="Aerie Cotton ```
- `/us/en/p/aerie/tops/sweatshirts-hoodies/aerie-oh-zip-sweatshirt/0743_3982_618`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/sweatshirts-hoodies/aerie-oh-zip-sweatshirt/0743_3982_618" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> Matching Set </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="Aerie O```
- `/us/en/p/aerie/clothing/loungewear/aerie-oh-snap-cropped-sweatshirt/0743_4162_618`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/clothing/loungewear/aerie-oh-snap-cropped-sweatshirt/0743_4162_618" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> New + Matching Set </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-nam```

## https://www.apieceapart.com/shop/tops

- HTTP **200** · 최종주소 `https://www.apieceapart.com/shop/tops`
- 제목: "Tops | Apiece Apart"
- 링크 75개 · `<img>` 119개 · iframe 0개
- 링크 중 이미지가 딸린 것 0개 → 그중 주소를 뽑아낸 것 **0개**

**이미지가 안 붙은 상품 링크 표본**

- `/products/fabi-chill-button-down-1?id=ac3b9770-46b4-4fc4-9908-d710623bbc95`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Fabi Chill Button Down" href="/products/fabi-chill-button-down-1?id=ac3b9770-46b4-4fc4-9908-d710623bbc95"><span class="sr-only">Fabi Chill Button Down<```
- `/products/ora-fluid-twist-top?id=150d719c-07c4-40a2-98a2-047cda28f70f`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Ora Fluid Twist Top" href="/products/ora-fluid-twist-top?id=150d719c-07c4-40a2-98a2-047cda28f70f"><span class="sr-only">Ora Fluid Twist Top</span></a>```
- `/products/ana-cravat-shirt?id=994c425e-566b-45ac-baab-a4bf40d40d4a`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Ana Cravat Shirt" href="/products/ana-cravat-shirt?id=994c425e-566b-45ac-baab-a4bf40d40d4a"><span class="sr-only">Ana Cravat Shirt</span></a>```

