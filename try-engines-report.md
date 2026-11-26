# 무료 크롤링 엔진 비교 (2026-11-26T10:16Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45798410879 · 러너 GitHub Actions 1000008920 · 나가는 IP 20.163.32.x · 2026-11-26T10:09Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 18쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 17 | 0 | 1 | 0 | 0·0 | 17·0 | 정상 · 18쪽 · 456s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright |
|---|---|:-:|
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POETT/tshirts-tops/index.htm) | ✅ 64 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POATT/tshirts-tops.htm) | ✅ 55 |
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POEST/shirts-tunics/index.htm) | ✅ 82 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POAST/shirts-tunics.htm) | ✅ 73 |
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POEDS/dresses-skirts/index.htm) | ✅ 74 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POADS/dresses-skirts.htm) | ✅ 65 |
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POETJ/trousers-shorts/index.htm) | ✅ 115 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POATJ/trousers.htm) | ✅ 106 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-t-shirts) | ✅ 36 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-t-shirts) | ✅ 15 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-sweatshirts-hoodies) | ✅ 36 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-hoodies-sweatshirts) | ✅ 7 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-shirts-blouses) | ✅ 36 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-shirts-blouses) | ✅ 29 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-dresses) | ✅ 29 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-dresses) | ✅ 10 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-trousers) | ✅ 33 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-trousers) | ⛔ 404 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | barbour.com | playwright | dead | 404 | Cloudflare (낮음) | 제목 "Sites-barbour-us-Site" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_1e532452c54fb0368ba9b98273, 쿠키 dwanonymous_fad861a9ba68573238e98b619c71bf9d, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.barbour.com/us/womens/womens-clothing/womens-trousers |

<details><summary>사유</summary>

- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POETT/tshirts-tops/index.htm
  - playwright: ✅ 수집기 64개 · HTML 상품 링크 16 · 이미지 링크 55 · 글 17075자 · 예 https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html
- poetryfashion.com — https://www.poetryfashion.com/category-POATT/tshirts-tops.htm
  - playwright: ✅ 수집기 55개 · HTML 상품 링크 16 · 이미지 링크 43 · 글 16865자 · 예 https://www.poetryfashion.com/t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html
- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POEST/shirts-tunics/index.htm
  - playwright: ✅ 수집기 82개 · HTML 상품 링크 16 · 이미지 링크 74 · 글 19298자 · 예 https://www.poetryfashion.co.uk/shirts-and-tunics/viscose-wool-printed-blouse-grey-pink/RW41.A.html
- poetryfashion.com — https://www.poetryfashion.com/category-POAST/shirts-tunics.htm
  - playwright: ✅ 수집기 73개 · HTML 상품 링크 16 · 이미지 링크 62 · 글 18788자 · 예 https://www.poetryfashion.com/shirts-and-tunics/viscose-wool-printed-blouse-grey-pink/RW41.A.html
- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POEDS/dresses-skirts/index.htm
  - playwright: ✅ 수집기 74개 · HTML 상품 링크 16 · 이미지 링크 70 · 글 19321자 · 예 https://www.poetryfashion.co.uk/dresses-and-skirts/printed-silk-pleated-waist-dress-teal-brown/RW07.A.html
- poetryfashion.com — https://www.poetryfashion.com/category-POADS/dresses-skirts.htm
  - playwright: ✅ 수집기 65개 · HTML 상품 링크 16 · 이미지 링크 58 · 글 18943자 · 예 https://www.poetryfashion.com/dresses-and-skirts/printed-silk-pleated-waist-dress-teal-brown/RW07.A.html
- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POETJ/trousers-shorts/index.htm
  - playwright: ✅ 수집기 115개 · HTML 상품 링크 16 · 이미지 링크 98 · 글 20165자 · 예 https://www.poetryfashion.co.uk/trousers/wide-leg-cord-trousers-dark-petrol/UG24.Q.html
- poetryfashion.com — https://www.poetryfashion.com/category-POATJ/trousers.htm
  - playwright: ✅ 수집기 106개 · HTML 상품 링크 16 · 이미지 링크 86 · 글 19802자 · 예 https://www.poetryfashion.com/trousers/wide-leg-cord-trousers-dark-petrol/UG24.Q.html
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-t-shirts
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 0 · 글 15715자 · 예 https://www.barbour.com/row/rosalie-t-shirt-LTS0730WH11.html
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-t-shirts
  - playwright: ✅ 수집기 15개 · HTML 상품 링크 14 · 이미지 링크 0 · 글 11736자 · 예 https://www.barbour.com/us/barbour-x-a.p.c.-womens-t-shirt-LTS0763WH33.html
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-sweatshirts-hoodies
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 0 · 글 15656자 · 예 https://www.barbour.com/row/elswith-sweatshirt-LOL0711WH11.html
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-hoodies-sweatshirts
  - playwright: ✅ 수집기 7개 · HTML 상품 링크 6 · 이미지 링크 0 · 글 10148자 · 예 https://www.barbour.com/us/hartland-logo-sweatshirt-LOL0672RE86.html
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-shirts-blouses
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 0 · 글 17066자 · 예 https://www.barbour.com/row/seren-oversized-denim-shirt-LSH1765BL68.html
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-shirts-blouses
  - playwright: ✅ 수집기 29개 · HTML 상품 링크 28 · 이미지 링크 0 · 글 16286자 · 예 https://www.barbour.com/us/ellen-shirt-LSH1796RU51.html
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-dresses
  - playwright: ✅ 수집기 29개 · HTML 상품 링크 29 · 이미지 링크 0 · 글 13141자 · 예 https://www.barbour.com/row/kenna-maxi-dress-LDR1055BK11.html
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-dresses
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 9 · 이미지 링크 0 · 글 10516자 · 예 https://www.barbour.com/us/tisbury-mini-dress-LDR1019NY99.html
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-trousers
  - playwright: ✅ 수집기 33개 · HTML 상품 링크 33 · 이미지 링크 0 · 글 15238자 · 예 https://www.barbour.com/row/gabriette-stretch-skinny-jeans-LTR0447BK11.html
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-trousers
  - playwright: ⛔ HTTP 404 Sites-barbour-us-Site

</details>
