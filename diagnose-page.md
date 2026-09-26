# 목록 페이지 진단 (2026-09-26 21:53Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

## https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017

- HTTP **200** · 최종주소 `https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017`
- 제목: "Women's Sweatpants | Carhartt"
- 링크 254개 · `<img>` 85개 · iframe 2개
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
- 제목: "Women's Graphic, Cropped, and Oversized T-Shirts | American Eagle"
- 링크 519개 · `<img>` 244개 · iframe 6개
- 링크 중 이미지가 딸린 것 124개 → 그중 주소를 뽑아낸 것 **124개**

**주소를 찾은 속성**: `src` 124

**성공한 카드의 class**: `x-link-to qa-x-link-to _tile-link_1loo4i` 120 · `_container_1eekmh ae-theme` 2 · `flyout qa-flyout flyout-onboarding qa-flyout-onboarding _con` 2

**이미지가 안 붙은 상품 링크 표본**

- `/intl/en/p/women/tops/t-shirts/ae-cozy-crew-neck-long-sleeve-t-shirt/3376_2022_369`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-cozy-crew-neck-long-sleeve-t-shirt/3376_2022_369" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-ae _flags_14vr46" data-testid="merchant-flags"> New </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Cozy Crew N```
- `/intl/en/p/women/tops/t-shirts/ae-long-sleeve-henley-t-shirt/3376_1834_337`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-long-sleeve-henley-t-shirt/3376_1834_337" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <!----> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="AE Long-Sleeve Henley T-Shirt" data-testid="name"> AE Long-Sleeve Henley T-Shirt </h3> <div class="_container_1bn8o3 text-bold _price_1xhak1```
- `/intl/en/p/women/tops/t-shirts/ae-dolly-parton-graphic-baby-tee/1095_1636_106`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/intl/en/p/women/tops/t-shirts/ae-dolly-parton-graphic-baby-tee/1095_1636_106" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-ae _flags_14vr46" data-testid="merchant-flags"> New + Online Exclusive </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="```

## https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031

- HTTP **200** · 최종주소 `https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031`
- 제목: "Women's Tops: Cozy Sweaters, Sweatshirts, Shirts & More | Aerie"
- 링크 501개 · `<img>` 204개 · iframe 12개
- 링크 중 이미지가 딸린 것 114개 → 그중 주소를 뽑아낸 것 **114개**

**주소를 찾은 속성**: `src` 114

**성공한 카드의 class**: `x-link-to qa-x-link-to _tile-link_1loo4i` 90 · `images_Dzl3I` 11 · `container_2ZJCi with-columns_yaY1x` 6 · `_container_1eekmh aerie-theme` 2 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-d559a` 1 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-c2c69` 1 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-cf8d6` 1 · `_content_1u317r qa-headless-cms-lockup-overlay overlay-eb830` 1

**이미지가 안 붙은 상품 링크 표본**

- `/us/en/p/aerie/tops/button-ups-blouses/aerie-anytime-fave-flannel-oversized-shirt/1783_4160_082`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/button-ups-blouses/aerie-anytime-fave-flannel-oversized-shirt/1783_4160_082" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> New + Bestseller </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data```
- `/us/en/p/aerie/tops/sweatshirts-hoodies/aerie-oh-zip-sweatshirt/0743_3982_192`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/sweatshirts-hoodies/aerie-oh-zip-sweatshirt/0743_3982_192" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> Matching Set + Bestseller </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-```
- `/us/en/p/aerie/tops/sweaters-cardigans/aerie-layover-cardigan/0743_4028_192`
  - 카드 class: `x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i`
  - img 속성: (img 없음)
  - ```<a href="/us/en/p/aerie/tops/sweaters-cardigans/aerie-layover-cardigan/0743_4028_192" data-testid="x-link" class="x-link-to qa-x-link-to _tile-link_1loo4i _tile-link_1loo4i"> <div class="merchant-flags text-bold text-capitalize merchant-flag-aerie _flags_14vr46" data-testid="merchant-flags"> New + Matching Set </div> <h3 class="product-name _product-name_15zhao _gray_1loo4i" data-product-name="Aer```

## https://www.apieceapart.com/shop/tops

- HTTP **200** · 최종주소 `https://www.apieceapart.com/shop/tops`
- 제목: "Tops | Apiece Apart"
- 링크 86개 · `<img>` 141개 · iframe 0개
- 링크 중 이미지가 딸린 것 0개 → 그중 주소를 뽑아낸 것 **0개**

**이미지가 안 붙은 상품 링크 표본**

- `/products/isolde-button-down-1?id=f9cb84ad-9620-429e-9dbb-9b5252710bdb`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Isolde Button Down" href="/products/isolde-button-down-1?id=f9cb84ad-9620-429e-9dbb-9b5252710bdb"><span class="sr-only">Isolde Button Down</span></a>```
- `/products/nele-lantern-sleeve-top-2?id=755e8a51-1ceb-44de-a077-ac087c9181ff`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Nele Lantern Sleeve Top" href="/products/nele-lantern-sleeve-top-2?id=755e8a51-1ceb-44de-a077-ac087c9181ff"><span class="sr-only">Nele Lantern Sleeve T```
- `/products/anni-denim-button?id=f15db154-f717-4782-8c2c-887262c5d114`
  - 카드 class: `inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focu`
  - img 속성: (img 없음)
  - ```<a class="inline-flex items-center no-underline hover:underline absolute inset-0 z-10 focus-visible:!absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-sm" aria-label="View details for Anni Denim Button Up" href="/products/anni-denim-button?id=f15db154-f717-4782-8c2c-887262c5d114"><span class="sr-only">Anni Denim Button Up</span></a>```

