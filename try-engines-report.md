# 무료 크롤링 엔진 비교 (2026-11-24T03:53Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

✅ 소재까지 읽음 · 🟡 페이지는 열림(소재 없음/목록) · ⛔ 차단 · ❌ 오류

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 8쪽 ✅·🟡 | 목록 4쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| firefox | 7 | 3 | 2 | 0 | 7·1 | 0·2 | 정상 · 12쪽 · 78s |

## 대상 고르기

브랜드당 상품 4개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| Massimo Dutti | 4 | 0 | 0/599 |  |
| Zara | 4 | 0 | 0/499 |  |

## 페이지별

| 구분 | 브랜드 | firefox |
|---|---|:-:|
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/cotton-blend-wrap-tshirt-l06273106) | 🟡 |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/striped-stretch-poplin-shirt-l05136537) | ✅ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/cargo-pants-with-hem-button-detail-l05052515) | ✅ |
| 상품 | [Massimo Dutti](https://www.massimodutti.com/us/barrel-fit-pants-with-hem-detail-l05043743) | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/fitted-zip-up-jacket-p03641827.html?v1=614749830) | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/side-band-zip-jacket-p03641862.html?v1=582795429) | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/stretch-zip-up-hoodie-jacket-p03641852.html?v1=607440192) | ✅ |
| 상품 | [Zara](https://www.zara.com/us/en/hooded-bomber-sweatshirt-p03046040.html?v1=545436944) | ✅ |
| 목록 | [prana.com](https://www.prana.com/women/tops.html) | ⛔ |
| 목록 | [whitehouseblackmarket.com](https://www.whitehouseblackmarket.com/store/category/tops/cat210001) | 🟡 |
| 목록 | [chicos.com](https://www.chicos.com/store/category/dresses/cat40004) | ⛔ |
| 목록 | [veronicabeard.com](https://veronicabeard.com/collections/tops) | 🟡 |

<details><summary>사유</summary>

- Massimo Dutti — https://www.massimodutti.com/us/cotton-blend-wrap-tshirt-l06273106
  - firefox: 🟡 글 3148자
- Massimo Dutti — https://www.massimodutti.com/us/striped-stretch-poplin-shirt-l05136537
  - firefox: ✅ Cotton 72% / Nylon 24% / Elastane 4%
- Massimo Dutti — https://www.massimodutti.com/us/cargo-pants-with-hem-button-detail-l05052515
  - firefox: ✅ Wool 100%
- Massimo Dutti — https://www.massimodutti.com/us/barrel-fit-pants-with-hem-detail-l05043743
  - firefox: ✅ Cotton 100%
- Zara — https://www.zara.com/us/en/fitted-zip-up-jacket-p03641827.html?v1=614749830
  - firefox: ✅ Wool 100% / Modal 49% / Polyester 45% / Elastane 6%
- Zara — https://www.zara.com/us/en/side-band-zip-jacket-p03641862.html?v1=582795429
  - firefox: ✅ Wool 100% / Modal 48% / Polyester 46% / Elastane 6%
- Zara — https://www.zara.com/us/en/stretch-zip-up-hoodie-jacket-p03641852.html?v1=607440192
  - firefox: ✅ Wool 100% / Nylon 82% / Elastane 18%
- Zara — https://www.zara.com/us/en/hooded-bomber-sweatshirt-p03046040.html?v1=545436944
  - firefox: ✅ Viscose 79% / Nylon 14% / Elastane 7%
- prana.com — https://www.prana.com/women/tops.html
  - firefox: ⛔ HTTP 403 Access to this page has been denied
- whitehouseblackmarket.com — https://www.whitehouseblackmarket.com/store/category/tops/cat210001
  - firefox: 🟡 글 28718자
- chicos.com — https://www.chicos.com/store/category/dresses/cat40004
  - firefox: ⛔ HTTP 403 Access Denied
- veronicabeard.com — https://veronicabeard.com/collections/tops
  - firefox: 🟡 글 28186자

</details>
