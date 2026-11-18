# 목록 페이지 진단 (2026-11-18 01:33Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

## https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017

- HTTP **200** · 최종주소 `https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017`
- 제목: "Women's Sweatpants | Carhartt"
- 링크 254개 · `<img>` 84개 · iframe 2개
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

- HTTP **403** · 최종주소 `https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030`
- 제목: "Access Denied"

### ⛔ 차단으로 보입니다 — 선택자 문제가 아닙니다

데이터센터 IP(GitHub Actions)가 막혔다는 뜻이므로, 이 브랜드는 **확장(가정용 IP)** 이 맡아야 합니다.
> Access Denied You don't have permission to access "http://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030" on this server. Reference #18.a437cb17.1794965616.471fda0d https://errors.edgesuite.net/18.

## https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031

- HTTP **403** · 최종주소 `https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031`
- 제목: "Access Denied"

### ⛔ 차단으로 보입니다 — 선택자 문제가 아닙니다

데이터센터 IP(GitHub Actions)가 막혔다는 뜻이므로, 이 브랜드는 **확장(가정용 IP)** 이 맡아야 합니다.
> Access Denied You don't have permission to access "http://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031" on this server. Reference #18.a437cb17.1794965622.47204b0d https://errors.edgesuite.net/18.

## https://www.apieceapart.com/shop/tops

- HTTP **200** · 최종주소 `https://www.apieceapart.com/shop/tops`
- 제목: "Tops | Apiece Apart"
- 링크 66개 · `<img>` 101개 · iframe 0개
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

