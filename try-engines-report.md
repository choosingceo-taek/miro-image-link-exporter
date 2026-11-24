# 무료 크롤링 엔진 비교 (2026-11-24T05:48Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

✅ 소재까지 읽음 · 🟡 페이지는 열림(소재 없음/목록) · ⛔ 차단 · ❌ 오류

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 5쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| firefox | 2 | 1 | 2 | 0 | 2·1 | 0·0 | 정상 · 5쪽 · 28s |
| impit | 0 | 4 | 1 | 0 | 0·4 | 0·0 | 정상 · 5쪽 · 1s |

## 페이지별

| 구분 | 브랜드 | firefox | impit |
|---|---|:-:|:-:|
| 상품 | [splendid.com](https://splendid.com/products/louisa-long-sleeve-tee) | ⛔ | 🟡 |
| 상품 | [splendid.com](https://splendid.com/products/leopard-bamboo-blend-long-sleeve-tee) | ✅ | 🟡 |
| 상품 | [splendid.com](https://splendid.com/products/stella-linen-midi-dress) | ✅ | 🟡 |
| 상품 | [www.aritzia.com](https://www.aritzia.com/intl/en/product/essential-wool-cashmere-cherub-sweater/126806.html) | ⛔ | ⛔ |
| 상품 | [www.loft.com](https://www.loft.com/clothing/tops/catl000011/everyday-crew-tee/580214.html) | 🟡 | 🟡 |

<details><summary>사유</summary>

- splendid.com — https://splendid.com/products/louisa-long-sleeve-tee
  - firefox: ⛔ HTTP 403 Verify your browser
  - impit: 🟡 글 909자
- splendid.com — https://splendid.com/products/leopard-bamboo-blend-long-sleeve-tee
  - firefox: ✅ Cotton 100% / Cashmere 100%
  - impit: 🟡 글 955자
- splendid.com — https://splendid.com/products/stella-linen-midi-dress
  - firefox: ✅ Linen 100% / Viscose 100%
  - impit: 🟡 글 909자
- www.aritzia.com — https://www.aritzia.com/intl/en/product/essential-wool-cashmere-cherub-sweater/126806.html
  - firefox: ⛔ HTTP 403 Just a moment...
  - impit: ⛔ HTTP 403 Just a moment...
- www.loft.com — https://www.loft.com/clothing/tops/catl000011/everyday-crew-tee/580214.html
  - firefox: 🟡 글 539자
  - impit: 🟡 글 16233자

</details>
