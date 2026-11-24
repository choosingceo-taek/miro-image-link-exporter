# 무료 크롤링 엔진 비교 (2026-11-24T05:49Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

✅ 소재까지 읽음 · 🟡 페이지는 열림(소재 없음/목록) · ⛔ 차단 · ❌ 오류

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 10쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| firefox | 6 | 0 | 4 | 0 | 6·0 | 0·0 | 정상 · 10쪽 · 76s |
| impit | 2 | 3 | 5 | 0 | 2·3 | 0·0 | 정상 · 10쪽 · 2s |
| site-api | 0 | 3 | 2 | 5 | 0·3 | 0·0 | 정상 · 10쪽 · 0s |
| wayback | 2 | 0 | 0 | 8 | 2·0 | 0·0 | 정상 · 10쪽 · 15s |

## 페이지별

| 구분 | 브랜드 | firefox | impit | site-api | wayback |
|---|---|:-:|:-:|:-:|:-:|
| 상품 | [splendid.com](https://splendid.com/products/louisa-long-sleeve-tee) | ✅ | 🟡 | 🟡 | ❌ |
| 상품 | [splendid.com](https://splendid.com/products/stella-linen-midi-dress) | ✅ | 🟡 | 🟡 | ❌ |
| 상품 | [splendid.com](https://splendid.com/products/lainey-lace-trim-short-sleeve-tee) | ✅ | 🟡 | 🟡 | ❌ |
| 상품 | [www.aritzia.com](https://www.aritzia.com/intl/en/product/essential-wool-cashmere-cherub-sweater/126806.html) | ✅ | ⛔ | ❌ | ❌ |
| 상품 | [www.aritzia.com](https://www.aritzia.com/intl/en/product/seabreeze-tank/131673.html) | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [www.aritzia.com](https://www.aritzia.com/intl/en/product/francoise-dress/131516.html) | ⛔ | ⛔ | ❌ | ❌ |
| 상품 | [row.gymshark.com](https://row.gymshark.com/products/gymshark-feather-form-scoop-neck-t-shirt-ss-tops-blue-aw26) | ✅ | ✅ | ⛔ | ❌ |
| 상품 | [row.gymshark.com](https://row.gymshark.com/products/gymshark-conditioning-club-oversized-short-sleeve-t-shirt-ss-tops-white-aw26) | ✅ | ✅ | ⛔ | ❌ |
| 상품 | [www.stories.com](https://www.stories.com/en-us/product/box-pleat-tank-top-white-1358088003/) | ⛔ | ⛔ | ❌ | ✅ |
| 상품 | [www.stories.com](https://www.stories.com/en-us/product/boxy-t-shirt-white-1223613001/) | ⛔ | ⛔ | ❌ | ✅ |

<details><summary>사유</summary>

- splendid.com — https://splendid.com/products/louisa-long-sleeve-tee
  - firefox: ✅ Cotton 100% / Cashmere 100%
  - impit: 🟡 글 909자
  - site-api: 🟡 JSON 29693자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
- splendid.com — https://splendid.com/products/stella-linen-midi-dress
  - firefox: ✅ Linen 100% / Viscose 100%
  - impit: 🟡 글 909자
  - site-api: 🟡 JSON 11078자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
- splendid.com — https://splendid.com/products/lainey-lace-trim-short-sleeve-tee
  - firefox: ✅ Cotton 100% / Cashmere 100%
  - impit: 🟡 글 943자
  - site-api: 🟡 JSON 11969자 · 소재 못 찾음 · 
  - wayback: ❌ 보관본 없음
- www.aritzia.com — https://www.aritzia.com/intl/en/product/essential-wool-cashmere-cherub-sweater/126806.html
  - firefox: ✅ Wool 70% / Cashmere 30% / Wool 66% / Cashmere 28% / Nylon 5%
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
- www.aritzia.com — https://www.aritzia.com/intl/en/product/seabreeze-tank/131673.html
  - firefox: ⛔ HTTP 403 Just a moment...
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
- www.aritzia.com — https://www.aritzia.com/intl/en/product/francoise-dress/131516.html
  - firefox: ⛔ HTTP 403 Just a moment...
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
- row.gymshark.com — https://row.gymshark.com/products/gymshark-feather-form-scoop-neck-t-shirt-ss-tops-blue-aw26
  - firefox: ✅ Nylon 78% / Elastane 21% / Polyester 1%
  - impit: ✅ Nylon 78% / Elastane 21% / Polyester 1%
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ❌ 보관본 없음
- row.gymshark.com — https://row.gymshark.com/products/gymshark-conditioning-club-oversized-short-sleeve-t-shirt-ss-tops-white-aw26
  - firefox: ✅ Polyester 100%
  - impit: ✅ Polyester 100%
  - site-api: ⛔ HTTP 403 · JSON 아님
  - wayback: ❌ 보관본 없음
- www.stories.com — https://www.stories.com/en-us/product/box-pleat-tank-top-white-1358088003/
  - firefox: ⛔ HTTP 403 Access Denied
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260812 보관본 · Cotton 100%
- www.stories.com — https://www.stories.com/en-us/product/boxy-t-shirt-white-1223613001/
  - firefox: ⛔ HTTP 403 Access Denied
  - impit: ⛔ HTTP 403 Access Denied
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260517 보관본 · Cotton 100%

</details>
