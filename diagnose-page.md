# 목록 페이지 진단 (2026-11-26 02:04Z)

상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.

## https://www.luckybrand.com/women/clothing/shirts/blouses

- HTTP **200** · 최종주소 `https://www.luckybrand.com/women/clothing/shirts/blouses`
- 제목: "Search | Lucky Brand"
- 링크 521개 · `<img>` 442개 · iframe 9개
- 링크 중 이미지가 딸린 것 160개 → 그중 주소를 뽑아낸 것 **159개**

| 증상 | 개수 | 뜻 |
|---|---:|---|
| img 는 있는데 주소가 비어 있음 | 1 | 지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다 |
| CSS 배경으로 깔림 | 2 | 스타일시트 배경은 인라인 style 검사로 안 잡힙니다 |

**주소를 찾은 속성**: `src` 138 · `data-src` 21

**성공한 카드의 class**: `product-tile__swatch swatch--color swatch--color-small  ` 60 · `product-tile__media-container component-overlay component-ov` 36 · `product-tile__swatch swatch--color swatch--color-small  sele` 32 · `product-tile__body-section product-tile__swatches flex flex-` 16 · `product-tile__swatch swatch--color swatch--color-small displ` 8 · `header-flyout__item level-1` 4 · `header-flyout__tile level-2 content-tile content-tile--size-` 2 · `header__main` 1

**이미지가 안 붙은 상품 링크 표본**

- `https://privacyportal.onetrust.com/webform/4e8b8273-2a8b-473f-a58c-2ea803edfdaf/4e59f2cb-1974-4262-a573-9f73c1e0bace`
  - 카드 class: `footer-links__item`
  - img 속성: (img 없음)
  - ```<li class="footer-links__item"> <a href="https://privacyportal.onetrust.com/webform/4e8b8273-2a8b-473f-a58c-2ea803edfdaf/4e59f2cb-1974-4262-a573-9f73c1e0bace" class="component-actions__cta link link--secondary " aria-label="Do Not Contact Me" style=""> Do Not Contact Me </a> </li>```

