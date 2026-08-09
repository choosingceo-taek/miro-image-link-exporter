# 목록 페이지 진단 (2026-08-09 21:55Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

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

## https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017

- HTTP **200** · 최종주소 `https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017`
- 제목: "Women's Sweatpants | Carhartt"
- 링크 259개 · `<img>` 85개 · iframe 2개
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

## https://www.theupside.com/shop/bottoms/

- HTTP **403** · 최종주소 `https://www.theupside.com/shop/bottoms/`
- 제목: "Just a moment..."

### ⛔ 차단으로 보입니다 — 선택자 문제가 아닙니다

데이터센터 IP(GitHub Actions)가 막혔다는 뜻이므로, 이 브랜드는 **확장(가정용 IP)** 이 맡아야 합니다.
> www.theupside.com Performing security verification This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot. Ray ID: 

