# 무료 크롤링 엔진 비교 (2026-11-26T09:38Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45791824407 · 러너 GitHub Actions 1000008889 · 나가는 IP 4.242.3.x · 2026-11-26T09:26Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 22쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 16 | 1 | 5 | 0 | 0·0 | 16·1 | 정상 · 22쪽 · 654s |
| impit | 21 | 1 | 0 | 0 | 0·0 | 21·1 | 정상 · 22쪽 · 21s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright | impit |
|---|---|:-:|:-:|
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro) | ⛔ 403 | ✅ 267 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/504209?page=womens-tees-and-tanks&nav=gnro) | ✅ 49 | ✅ 64 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro) | ⛔ 403 | ✅ 276 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/886?page=womens-sweatshirts&nav=gnro) | ✅ 55 | ✅ 73 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro) | ⛔ 403 | ✅ 244 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/516735?prefn1=refinementGender&prefv1=Womens&nav=gnro) | ✅ 45 | ✅ 70 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/506213/?page=womens-dresses-and-skirts&nav=gnro) | ⛔ 403 | ✅ 247 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/506213?page=womens-dresses-and-skirts&nav=gnro) | ✅ 31 | ✅ 49 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/622/?page=womens-pants-and-jeans&nav=gnro) | ⛔ 403 | ✅ 272 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/622?page=womens-pants-and-jeans&nav=gnro) | ✅ 50 | ✅ 74 |
| 목록 | [carhartt.com](https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017) | 🟡 1 | 🟡 1 |
| 목록 | [carhartt.com](https://www.carhartt.com/c/women-work-pants) | ✅ 6 | ✅ 7 |
| 목록 | [carhartt.com](https://www.carhartt.com/c/women-pants) | ✅ 24 | ✅ 25 |
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POETT/tshirts-tops/index.htm) | ✅ 64 | ✅ 16 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POATT/tshirts-tops.htm) | ✅ 55 | ✅ 16 |
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POEST/shirts-tunics/index.htm) | ✅ 82 | ✅ 16 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POAST/shirts-tunics.htm) | ✅ 73 | ✅ 16 |
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POEDS/dresses-skirts/index.htm) | ✅ 74 | ✅ 16 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POADS/dresses-skirts.htm) | ✅ 65 | ✅ 16 |
| 목록 | [poetryfashion.co.uk](https://www.poetryfashion.co.uk/category-POETJ/trousers-shorts/index.htm) | ✅ 115 | ✅ 16 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-POATJ/trousers.htm) | ✅ 106 | ✅ 16 |
| 목록 | [poetryfashion.com](https://www.poetryfashion.com/category-TOP/top-category.htm) | ✅ 16 | ✅ 16 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block | global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Wome |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/506213/?page=womens-dresses-and-skirts&nav= |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/622/?page=womens-pants-and-jeans&nav=gnro |
| 목록 | carhartt.com | playwright | no-cards | 200 |  | 제목 "Women's Sweatpants / Carhartt" · Akamai: server: *, 쿠키 bm_sz, 쿠키 _abck | www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017 |
| 목록 | carhartt.com | impit | no-cards | 200 |  | 제목 "Women's Sweatpants / Carhartt" · Akamai: server: *, 쿠키 _abck, 쿠키 bm_sz | www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017 |

<details><summary>사유</summary>

- global.llbean.com — https://global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - impit: ✅ HTML 상품 링크 267 · 이미지 링크 60 · 글 35697자
- llbean.com — https://www.llbean.com/llb/shop/504209?page=womens-tees-and-tanks&nav=gnro
  - playwright: ✅ 수집기 49개 · HTML 상품 링크 65 · 이미지 링크 49 · 글 15643자 · 예 https://www.llbean.com/llb/shop/5879147
  - impit: ✅ HTML 상품 링크 64 · 이미지 링크 48 · 글 15762자
- global.llbean.com — https://global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - impit: ✅ HTML 상품 링크 276 · 이미지 링크 60 · 글 34643자
- llbean.com — https://www.llbean.com/llb/shop/886?page=womens-sweatshirts&nav=gnro
  - playwright: ✅ 수집기 55개 · HTML 상품 링크 80 · 이미지 링크 56 · 글 14945자 · 예 https://www.llbean.com/llb/shop/20010772
  - impit: ✅ HTML 상품 링크 73 · 이미지 링크 48 · 글 15125자
- global.llbean.com — https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - impit: ✅ HTML 상품 링크 244 · 이미지 링크 28 · 글 22583자
- llbean.com — https://www.llbean.com/llb/shop/516735?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - playwright: ✅ 수집기 45개 · HTML 상품 링크 70 · 이미지 링크 45 · 글 14234자 · 예 https://www.llbean.com/llb/shop/5884871
  - impit: ✅ HTML 상품 링크 70 · 이미지 링크 45 · 글 14456자
- global.llbean.com — https://global.llbean.com/llb/shop/506213/?page=womens-dresses-and-skirts&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - impit: ✅ HTML 상품 링크 247 · 이미지 링크 31 · 글 24473자
- llbean.com — https://www.llbean.com/llb/shop/506213?page=womens-dresses-and-skirts&nav=gnro
  - playwright: ✅ 수집기 31개 · HTML 상품 링크 59 · 이미지 링크 32 · 글 11644자 · 예 https://www.llbean.com/llb/shop/129901
  - impit: ✅ HTML 상품 링크 49 · 이미지 링크 22 · 글 10689자
- global.llbean.com — https://global.llbean.com/llb/shop/622/?page=womens-pants-and-jeans&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - impit: ✅ HTML 상품 링크 272 · 이미지 링크 60 · 글 34953자
- llbean.com — https://www.llbean.com/llb/shop/622?page=womens-pants-and-jeans&nav=gnro
  - playwright: ✅ 수집기 50개 · HTML 상품 링크 76 · 이미지 링크 51 · 글 15709자 · 예 https://www.llbean.com/llb/shop/5865338
  - impit: ✅ HTML 상품 링크 74 · 이미지 링크 49 · 글 15981자
- carhartt.com — https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017
  - playwright: 🟡 수집기 1개 · HTML 상품 링크 1 · 이미지 링크 30 · 글 5021자 · 예 https://www.carhartt.com/en-eu/p/relaxed-fit-fleece-joggers/105510
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 30 · 글 6066자
- carhartt.com — https://www.carhartt.com/c/women-work-pants
  - playwright: ✅ 수집기 6개 · HTML 상품 링크 7 · 이미지 링크 72 · 글 12641자 · 예 https://www.carhartt.com/product/105113/womens-essential-ashland-pant
  - impit: ✅ HTML 상품 링크 7 · 이미지 링크 72 · 글 21188자
- carhartt.com — https://www.carhartt.com/c/women-pants
  - playwright: ✅ 수집기 24개 · HTML 상품 링크 25 · 이미지 링크 90 · 글 14511자 · 예 https://www.carhartt.com/product/105113/womens-essential-ashland-pant
  - impit: ✅ HTML 상품 링크 25 · 이미지 링크 90 · 글 23046자
- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POETT/tshirts-tops/index.htm
  - playwright: ✅ 수집기 64개 · HTML 상품 링크 16 · 이미지 링크 55 · 글 17085자 · 예 https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 26 · 글 3564자
- poetryfashion.com — https://www.poetryfashion.com/category-POATT/tshirts-tops.htm
  - playwright: ✅ 수집기 55개 · HTML 상품 링크 16 · 이미지 링크 43 · 글 16865자 · 예 https://www.poetryfashion.com/t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 14 · 글 3383자
- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POEST/shirts-tunics/index.htm
  - playwright: ✅ 수집기 82개 · HTML 상품 링크 16 · 이미지 링크 74 · 글 19288자 · 예 https://www.poetryfashion.co.uk/shirts-and-tunics/viscose-wool-printed-blouse-grey-pink/RW41.A.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 27 · 글 3950자
- poetryfashion.com — https://www.poetryfashion.com/category-POAST/shirts-tunics.htm
  - playwright: ✅ 수집기 73개 · HTML 상품 링크 16 · 이미지 링크 62 · 글 18788자 · 예 https://www.poetryfashion.com/shirts-and-tunics/viscose-wool-printed-blouse-grey-pink/RW41.A.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 15 · 글 3710자
- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POEDS/dresses-skirts/index.htm
  - playwright: ✅ 수집기 74개 · HTML 상품 링크 16 · 이미지 링크 70 · 글 19321자 · 예 https://www.poetryfashion.co.uk/dresses-and-skirts/printed-silk-pleated-waist-dress-teal-brown/RW07.A.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 29 · 글 4625자
- poetryfashion.com — https://www.poetryfashion.com/category-POADS/dresses-skirts.htm
  - playwright: ✅ 수집기 65개 · HTML 상품 링크 16 · 이미지 링크 58 · 글 18943자 · 예 https://www.poetryfashion.com/dresses-and-skirts/printed-silk-pleated-waist-dress-teal-brown/RW07.A.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 27 · 글 4363자
- poetryfashion.co.uk — https://www.poetryfashion.co.uk/category-POETJ/trousers-shorts/index.htm
  - playwright: ✅ 수집기 115개 · HTML 상품 링크 16 · 이미지 링크 98 · 글 20166자 · 예 https://www.poetryfashion.co.uk/trousers/wide-leg-cord-trousers-dark-petrol/UG24.Q.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 30 · 글 3709자
- poetryfashion.com — https://www.poetryfashion.com/category-POATJ/trousers.htm
  - playwright: ✅ 수집기 106개 · HTML 상품 링크 16 · 이미지 링크 86 · 글 19802자 · 예 https://www.poetryfashion.com/trousers/wide-leg-cord-trousers-dark-petrol/UG24.Q.html
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 18 · 글 3521자
- poetryfashion.com — https://www.poetryfashion.com/category-TOP/top-category.htm
  - playwright: ✅ HTML 상품 링크 16 · 이미지 링크 307 · 글 30282자
  - impit: ✅ HTML 상품 링크 16 · 이미지 링크 18 · 글 5152자

</details>
