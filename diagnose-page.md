# 목록 페이지 진단 (2026-11-28 01:47Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

## https://www.luckybrand.com/women/clothing/shirts/blouses

- HTTP **200** · 최종주소 `https://www.luckybrand.com/women/clothing/shirts/blouses`
- 제목: "Search | Lucky Brand"
- 링크 521개 · `<img>` 442개 · iframe 11개
- 링크 중 이미지가 딸린 것 160개 → 그중 주소를 뽑아낸 것 **159개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 1 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |
| CSS 배경으로 깔림 | 2 | 스타일시트 배경은 인라인 style 검사로 안 잡힙니다 |

**주소를 찾은 속성**: `src` 145 · `data-src` 14

**성공한 카드의 class**: `product-tile__swatch swatch--color swatch--color-small  ` 60 · `product-tile__media-container component-overlay component-ov` 36 · `product-tile__swatch swatch--color swatch--color-small  sele` 32 · `product-tile__body-section product-tile__swatches flex flex-` 16 · `product-tile__swatch swatch--color swatch--color-small displ` 8 · `header-flyout__item level-1` 4 · `header-flyout__tile level-2 content-tile content-tile--size-` 2 · `header__main` 1

**이미지가 안 붙은 상품 링크 표본**

- `https://privacyportal.onetrust.com/webform/4e8b8273-2a8b-473f-a58c-2ea803edfdaf/4e59f2cb-1974-4262-a573-9f73c1e0bace`
  - 카드 class: `footer-links__item`
  - img 속성: (img 없음)
  - ```<li class="footer-links__item"> <a href="https://privacyportal.onetrust.com/webform/4e8b8273-2a8b-473f-a58c-2ea803edfdaf/4e59f2cb-1974-4262-a573-9f73c1e0bace" class="component-actions__cta link link--secondary " aria-label="Do Not Contact Me" style=""> Do Not Contact Me </a> </li>```

## https://oldnavy.gap.com/browse/women/sweatpants?cid=3044038&nav=meganav%3AWomen%3AWomen%27s%20Bottoms%3ASweatpants#department=136

- HTTP **200** · 최종주소 `https://oldnavy.gap.com/browse/women/sweatpants?cid=3044038&nav=meganav%3AWomen%3AWomen%27s%20Bottoms%3ASweatpants#department=136`
- 제목: "Women Sweatpants | Old Navy"
- 링크 1258개 · `<img>` 1082개 · iframe 1개
- 링크 중 이미지가 딸린 것 168개 → 그중 주소를 뽑아낸 것 **167개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 1 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |
| CSS 배경으로 깔림 | 151 | 스타일시트 배경은 인라인 style 검사로 안 잡힙니다 |

**주소를 찾은 속성**: `src` 167

**성공한 카드의 class**: `plp_product-image` 151 · `dp catnav--item` 10 · `z-1 relative on` 5 · `sw_brand-logo__logo-container sw_brand-logo-container__isSqu` 1

**이미지가 안 붙은 상품 링크 표본**

- `/browse/todays-deals/shop-all?cid=3039764&mlink=GBON-Promo-Unilateral-1126_BlackFriday50OffEverything_Refresh-Family`
  - 카드 class: `sitewide-95smju`
  - img 속성: (img 없음)
  - ```<a href="/browse/todays-deals/shop-all?cid=3039764&amp;mlink=GBON-Promo-Unilateral-1126_BlackFriday50OffEverything_Refresh-Family" class="sitewide-95smju"></a>```
- `https://www.gapinc.com/en-us/consumer-privacy-policy#otnotice-section-cbe55da1-ad03-45b8-8017-fb73d4a1fb5e`
  - 카드 class: `sw_footer__legal__link-item fds__global-navigation-caption`
  - img 속성: (img 없음)
  - ```<li data-testid="footer-legal-link-3" class="sw_footer__legal__link-item fds__global-navigation-caption"><a target="_blank" href="https://www.gapinc.com/en-us/consumer-privacy-policy#otnotice-section-cbe55da1-ad03-45b8-8017-fb73d4a1fb5e" class="fds_link fds__core-web-link-regular sw_footer__legal__link fds__global-navigation-caption fds_link--subtle fds_link--regular fds_link--disable-visited-styl```

## https://bananarepublic.gap.com/browse/women/dresses-and-jumpsuits?cid=69883&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3ADresses+%26+Jumpsuits#department=136

- HTTP **200** · 최종주소 `https://bananarepublic.gap.com/browse/women/dresses-and-jumpsuits?cid=69883&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3ADresses+%26+Jumpsuits#department=136`
- 제목: "Women's Dresses | Banana Republic"
- 링크 703개 · `<img>` 402개 · iframe 15개
- 링크 중 이미지가 딸린 것 126개 → 그중 주소를 뽑아낸 것 **124개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 2 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |
| CSS 배경으로 깔림 | 111 | 스타일시트 배경은 인라인 style 검사로 안 잡힙니다 |

**주소를 찾은 속성**: `src` 124

**성공한 카드의 class**: `plp_product-image` 111 · `z-1 relative br` 5 · `sitewide-116t4n3` 4 · `sds_relative` 4

**이미지가 안 붙은 상품 링크 표본**

- `https://privacyportal.onetrust.com/webform/e1cf9ab6-fc39-4557-b4ef-4393861dad52/5069878c-b35b-463f-a1ee-b8d846c30070`
  - img 속성: (img 없음)
  - ```<a href="https://privacyportal.onetrust.com/webform/e1cf9ab6-fc39-4557-b4ef-4393861dad52/5069878c-b35b-463f-a1ee-b8d846c30070" target="_blank" style="color:#007bff;font-weight:bold" rel="nofollow noopener noreferrer">this Webform</a>```

