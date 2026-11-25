# 목록 페이지 진단 (2026-11-25 11:17Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

## https://www.gap.com/browse/women/t-shirts-and-tanks?cid=17076

- HTTP **200** · 최종주소 `https://www.gap.com/browse/women/t-shirts-and-tanks?cid=17076#department=136`
- 제목: "Women's T-Shirts & Tank Tops | Gap"
- 링크 1456개 · `<img>` 1011개 · iframe 8개
- 링크 중 이미지가 딸린 것 227개 → 그중 주소를 뽑아낸 것 **225개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 2 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |
| CSS 배경으로 깔림 | 1 | 스타일시트 배경은 인라인 style 검사로 안 잡힙니다 |

**주소를 찾은 속성**: `src` 225

**성공한 카드의 class**: `plp_product-image` 198 · `catnav--item` 11 · `(no class)` 9 · `z-1 relative gap` 5 · `catnav--item--link` 2

**이미지가 안 붙은 상품 링크 표본**

- `https://gap.attn.tv/p/M6l/landing-page?tid=gpem123719&mweb=true`
  - img 속성: (img 없음)
  - ```<li data-testid="footer-customer-links-desktop-item-2"><a href="https://gap.attn.tv/p/M6l/landing-page?tid=gpem123719&amp;mweb=true" class="fds_link fds__core-web-link-regular sw_footer__customer-links-desktop__link fds__core-web-subhead fds_link--subtle fds_link--regular fds_link--disable-visited-style">Sign up for texts</a></li>```
- `https://www.gapinc.com/en-us/consumer-privacy-policy#otnotice-section-cbe55da1-ad03-45b8-8017-fb73d4a1fb5e`
  - 카드 class: `sw_footer__legal__link-item fds__global-navigation-caption`
  - img 속성: (img 없음)
  - ```<li data-testid="footer-legal-link-3" class="sw_footer__legal__link-item fds__global-navigation-caption"><a target="_blank" href="https://www.gapinc.com/en-us/consumer-privacy-policy#otnotice-section-cbe55da1-ad03-45b8-8017-fb73d4a1fb5e" class="fds_link fds__core-web-link-regular sw_footer__legal__link fds__global-navigation-caption fds_link--subtle fds_link--regular fds_link--disable-visited-styl```

## https://bananarepublic.gap.com/browse/women/t-shirts?cid=1055063

- HTTP **200** · 최종주소 `https://bananarepublic.gap.com/browse/women/t-shirts?cid=1055063#department=136`
- 제목: "Women's T-Shirts & Tees | Banana Republic"
- 링크 681개 · `<img>` 229개 · iframe 16개
- 링크 중 이미지가 딸린 것 118개 → 그중 주소를 뽑아낸 것 **116개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 2 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |
| CSS 배경으로 깔림 | 103 | 스타일시트 배경은 인라인 style 검사로 안 잡힙니다 |

**주소를 찾은 속성**: `src` 116

**성공한 카드의 class**: `plp_product-image` 103 · `z-1 relative br` 5 · `sitewide-116t4n3` 4 · `sds_relative` 4

**이미지가 안 붙은 상품 링크 표본**

- `https://privacyportal.onetrust.com/webform/e1cf9ab6-fc39-4557-b4ef-4393861dad52/5069878c-b35b-463f-a1ee-b8d846c30070`
  - img 속성: (img 없음)
  - ```<a href="https://privacyportal.onetrust.com/webform/e1cf9ab6-fc39-4557-b4ef-4393861dad52/5069878c-b35b-463f-a1ee-b8d846c30070" target="_blank" style="color:#007bff;font-weight:bold" rel="nofollow noopener noreferrer">this Webform</a>```

## https://oldnavy.gap.com/browse/women/sweatshirts-and-hoodies?cid=3044037

- HTTP **200** · 최종주소 `https://oldnavy.gap.com/browse/women/sweatshirts-and-hoodies?cid=3044037#department=136`
- 제목: "Women's Sweatshirts & Hoodies | Old Navy"
- 링크 1478개 · `<img>` 1387개 · iframe 16개
- 링크 중 이미지가 딸린 것 217개 → 그중 주소를 뽑아낸 것 **215개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 2 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |
| CSS 배경으로 깔림 | 199 | 스타일시트 배경은 인라인 style 검사로 안 잡힙니다 |

**주소를 찾은 속성**: `src` 215

**성공한 카드의 class**: `plp_product-image` 199 · `dp catnav--item` 10 · `z-1 relative on` 5 · `sw_brand-logo__logo-container sw_brand-logo-container__isSqu` 1

**이미지가 안 붙은 상품 링크 표본**

- `/browse/todays-deals/shop-all?cid=3039764&mlink=GBON-Promo-Unilateral-1123_BlackFriday50OffEverything-Family`
  - 카드 class: `sitewide-95smju`
  - img 속성: (img 없음)
  - ```<a href="/browse/todays-deals/shop-all?cid=3039764&amp;mlink=GBON-Promo-Unilateral-1123_BlackFriday50OffEverything-Family" class="sitewide-95smju"></a>```
- `https://www.gapinc.com/en-us/consumer-privacy-policy#otnotice-section-cbe55da1-ad03-45b8-8017-fb73d4a1fb5e`
  - 카드 class: `sw_footer__legal__link-item fds__global-navigation-caption`
  - img 속성: (img 없음)
  - ```<li data-testid="footer-legal-link-3" class="sw_footer__legal__link-item fds__global-navigation-caption"><a target="_blank" href="https://www.gapinc.com/en-us/consumer-privacy-policy#otnotice-section-cbe55da1-ad03-45b8-8017-fb73d4a1fb5e" class="fds_link fds__core-web-link-regular sw_footer__legal__link fds__global-navigation-caption fds_link--subtle fds_link--regular fds_link--disable-visited-styl```
- `https://privacyportal.onetrust.com/webform/e1cf9ab6-fc39-4557-b4ef-4393861dad52/5069878c-b35b-463f-a1ee-b8d846c30070`
  - img 속성: (img 없음)
  - ```<a href="https://privacyportal.onetrust.com/webform/e1cf9ab6-fc39-4557-b4ef-4393861dad52/5069878c-b35b-463f-a1ee-b8d846c30070" target="_blank" style="color:#007bff;font-weight:bold" rel="nofollow noopener noreferrer">this Webform</a>```

## https://www.thereformation.com/tops/button-ups

- HTTP **403** · 최종주소 `https://www.thereformation.com/tops/button-ups`
- 제목: "Just a moment..."

### ⛔ 차단으로 보입니다 — 선택자 문제가 아닙니다

데이터센터 IP(GitHub Actions)가 막혔다는 뜻이므로, 이 브랜드는 **확장(가정용 IP)** 이 맡아야 합니다.
> www.thereformation.com Performing security verification This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot. Ray

