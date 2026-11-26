# 무료 크롤링 엔진 비교 (2026-11-26T08:49Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45783356343 · 러너 GitHub Actions 1000008872 · 나가는 IP 172.215.212.x · 2026-11-26T08:29Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 31쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 7 | 6 | 18 | 0 | 0·0 | 7·6 | 정상 · 31쪽 · 469s |
| firefox | 14 | 4 | 2 | 11 | 0·0 | 14·4 | 시간 초과(12분) · 20/31쪽까지 · 720s |
| impit | 12 | 18 | 1 | 0 | 0·0 | 12·18 | 정상 · 31쪽 · 19s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright | firefox | impit |
|---|---|:-:|:-:|:-:|
| 목록 | [thewhitecompany.com](https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts) | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [thewhitecompany.com](https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts) | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [thewhitecompany.com](https://www.thewhitecompany.com/us/c/us/Clothing/c/Tops) | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [thewhitecompany.com](https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear) | ⛔ 404 | ⛔ 404 | 🟡 0 |
| 목록 | [thewhitecompany.com](https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear) | 🟡 0 | ❌ | 🟡 0 |
| 목록 | [thewhitecompany.com](https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tunics) | ⛔ 404 | ❌ | 🟡 0 |
| 목록 | [thewhitecompany.com](https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tunics) | 🟡 0 | ❌ | 🟡 0 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro) | ⛔ 403 | ✅ 48 | ✅ 267 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/504209?page=womens-tees-and-tanks&nav=gnro) | ✅ 49 | ✅ 49 | ✅ 64 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro) | ⛔ 403 | ✅ 48 | ✅ 276 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/886?page=womens-sweatshirts&nav=gnro) | ✅ 55 | ✅ 55 | ✅ 73 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro) | ⛔ 403 | ✅ 16 | ✅ 244 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/516735?prefn1=refinementGender&prefv1=Womens&nav=gnro) | ✅ 45 | ✅ 45 | ✅ 70 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/506213/?page=womens-dresses-and-skirts&nav=gnro) | ⛔ 403 | ✅ 19 | ✅ 247 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/506213?page=womens-dresses-and-skirts&nav=gnro) | ✅ 31 | ✅ 31 | ✅ 49 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/622/?page=womens-pants-and-jeans&nav=gnro) | ⛔ 403 | ❌ | ✅ 272 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/622?page=womens-pants-and-jeans&nav=gnro) | ✅ 50 | ❌ | ✅ 74 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-sports-t-shirts-n4764) | ⛔ 403 | ✅ 92 | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-sports-t-shirts-n4764) | ⛔ 403 | ✅ 29 | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-sports-tops-n5484) | ⛔ 403 | ✅ 65 | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-sports-tops-n5484) | ⛔ 403 | ✅ 36 | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-sweatshirts-n4922) | ⛔ 403 | ❌ | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-sweatshirts-n4922) | ⛔ 403 | ❌ | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/gb/dresses-jumpsuits-n4954) | ⛔ 403 | ❌ | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/us/dresses-jumpsuits-n4954) | ⛔ 403 | ❌ | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-pants-n4813) | ⛔ 403 | ❌ | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-pants-n4813) | ⛔ 403 | ❌ | 🟡 0 |
| 목록 | [carhartt.com](https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017) | 🟡 1 | 🟡 1 | 🟡 1 |
| 목록 | [carhartt.com](https://www.carhartt.com/c/women-work-pants) | ✅ 6 | ✅ 6 | ✅ 7 |
| 목록 | [carhartt.com](https://www.carhartt.com/c/women-pants) | ✅ 24 | ✅ 24 | ✅ 25 |
| 목록 | [carhartt.com](https://www.carhartt.com/c/women-sweatpants) | ⛔ 404 | ⛔ 404 | ⛔ 404 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | thewhitecompany.com | firefox | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | thewhitecompany.com | firefox | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sv, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/c/us/Clothing/c/Tops |
| 목록 | thewhitecompany.com | firefox | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sv, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/c/us/Clothing/c/Tops |
| 목록 | thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/c/us/Clothing/c/Tops |
| 목록 | thewhitecompany.com | playwright | dead | 404 | Akamai (중간) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear |
| 목록 | thewhitecompany.com | firefox | dead | 404 | Akamai (중간) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck, 쿠키 bm_sv | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear |
| 목록 | thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear |
| 목록 | thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear |
| 목록 | thewhitecompany.com | firefox | timeout |  |  |  | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear |
| 목록 | thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear |
| 목록 | thewhitecompany.com | playwright | dead | 404 | Akamai (중간) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | thewhitecompany.com | firefox | timeout |  |  |  | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | thewhitecompany.com | firefox | timeout |  |  |  | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block | global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Wome |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/506213/?page=womens-dresses-and-skirts&nav= |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/622/?page=womens-pants-and-jeans&nav=gnro |
| 목록 | global.llbean.com | firefox | timeout |  |  |  | global.llbean.com/llb/shop/622/?page=womens-pants-and-jeans&nav=gnro |
| 목록 | llbean.com | firefox | timeout |  |  |  | www.llbean.com/llb/shop/622?page=womens-pants-and-jeans&nav=gnro |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-sports-t-shirts-n4764 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/womens-sports-t-shirts-n4764 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-sports-t-shirts-n4764 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/us/womens-sports-t-shirts-n4764 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-sports-tops-n5484 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/womens-sports-tops-n5484 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-sports-tops-n5484 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/us/womens-sports-tops-n5484 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-sweatshirts-n4922 |
| 목록 | oysho.com | firefox | timeout |  |  |  | www.oysho.com/gb/womens-sweatshirts-n4922 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/womens-sweatshirts-n4922 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-sweatshirts-n4922 |
| 목록 | oysho.com | firefox | timeout |  |  |  | www.oysho.com/us/womens-sweatshirts-n4922 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/us/womens-sweatshirts-n4922 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | firefox | timeout |  |  |  | www.oysho.com/gb/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | firefox | timeout |  |  |  | www.oysho.com/us/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/us/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-pants-n4813 |
| 목록 | oysho.com | firefox | timeout |  |  |  | www.oysho.com/gb/womens-pants-n4813 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/gb/womens-pants-n4813 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-pants-n4813 |
| 목록 | oysho.com | firefox | timeout |  |  |  | www.oysho.com/us/womens-pants-n4813 |
| 목록 | oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/us/womens-pants-n4813 |
| 목록 | carhartt.com | playwright | no-cards | 200 |  | 제목 "Women's Sweatpants / Carhartt" · Akamai: server: *, 쿠키 bm_sz, 쿠키 _abck | www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017 |
| 목록 | carhartt.com | firefox | no-cards | 200 |  | 제목 "Women's Sweatpants / Carhartt" · Akamai: server: *, 쿠키 bm_sz, 쿠키 _abck | www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017 |
| 목록 | carhartt.com | impit | no-cards | 200 |  | 제목 "Women's Sweatpants / Carhartt" · Akamai: server: *, 쿠키 _abck, 쿠키 bm_sz | www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017 |
| 목록 | carhartt.com | playwright | dead | 404 | Akamai (낮음) | 제목 "Page Not Found / Carhartt" · 흔적 notfound · Akamai: server: * | www.carhartt.com/c/women-sweatpants |
| 목록 | carhartt.com | firefox | dead | 404 | Akamai (중간) | 제목 "Page Not Found / Carhartt" · 흔적 notfound · Akamai: server: *, 쿠키 bm_sz, 쿠키 _abck | www.carhartt.com/c/women-sweatpants |
| 목록 | carhartt.com | impit | dead | 404 | Akamai (중간) | 제목 "Page Not Found / Carhartt" · 흔적 notfound · Akamai: server: *, 쿠키 _abck, 쿠키 bm_sz | www.carhartt.com/c/women-sweatpants |

<details><summary>사유</summary>

- thewhitecompany.com — https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- thewhitecompany.com — https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- thewhitecompany.com — https://www.thewhitecompany.com/us/c/us/Clothing/c/Tops
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- thewhitecompany.com — https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear
  - playwright: ⛔ HTTP 404 Page Not Found | The White Company US
  - firefox: ⛔ HTTP 404 Page Not Found | The White Company US
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- thewhitecompany.com — https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- thewhitecompany.com — https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tunics
  - playwright: ⛔ HTTP 404 Page Not Found | The White Company US
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- thewhitecompany.com — https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tunics
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- global.llbean.com — https://global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 267 · 이미지 링크 60 · 글 31402자 · 예 https://global.llbean.com/llb/shop/32708.html
  - impit: ✅ HTML 상품 링크 267 · 이미지 링크 60 · 글 35710자
- llbean.com — https://www.llbean.com/llb/shop/504209?page=womens-tees-and-tanks&nav=gnro
  - playwright: ✅ 수집기 49개 · HTML 상품 링크 65 · 이미지 링크 49 · 글 15643자 · 예 https://www.llbean.com/llb/shop/5879147
  - firefox: ✅ 수집기 49개 · HTML 상품 링크 65 · 이미지 링크 49 · 글 15643자 · 예 https://www.llbean.com/llb/shop/5879147
  - impit: ✅ HTML 상품 링크 64 · 이미지 링크 48 · 글 15762자
- global.llbean.com — https://global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 276 · 이미지 링크 60 · 글 30245자 · 예 https://global.llbean.com/llb/shop/5847096.html
  - impit: ✅ HTML 상품 링크 276 · 이미지 링크 60 · 글 34643자
- llbean.com — https://www.llbean.com/llb/shop/886?page=womens-sweatshirts&nav=gnro
  - playwright: ✅ 수집기 55개 · HTML 상품 링크 80 · 이미지 링크 56 · 글 14945자 · 예 https://www.llbean.com/llb/shop/20010772
  - firefox: ✅ 수집기 55개 · HTML 상품 링크 80 · 이미지 링크 56 · 글 14945자 · 예 https://www.llbean.com/llb/shop/20010772
  - impit: ✅ HTML 상품 링크 73 · 이미지 링크 48 · 글 15125자
- global.llbean.com — https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ✅ 수집기 16개 · HTML 상품 링크 244 · 이미지 링크 28 · 글 20973자 · 예 https://global.llbean.com/llb/shop/70362.html
  - impit: ✅ HTML 상품 링크 244 · 이미지 링크 28 · 글 22583자
- llbean.com — https://www.llbean.com/llb/shop/516735?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - playwright: ✅ 수집기 45개 · HTML 상품 링크 70 · 이미지 링크 45 · 글 14234자 · 예 https://www.llbean.com/llb/shop/5884871
  - firefox: ✅ 수집기 45개 · HTML 상품 링크 70 · 이미지 링크 45 · 글 14234자 · 예 https://www.llbean.com/llb/shop/5884871
  - impit: ✅ HTML 상품 링크 70 · 이미지 링크 45 · 글 14456자
- global.llbean.com — https://global.llbean.com/llb/shop/506213/?page=womens-dresses-and-skirts&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ✅ 수집기 19개 · HTML 상품 링크 247 · 이미지 링크 31 · 글 21728자 · 예 https://global.llbean.com/llb/shop/20010010.html
  - impit: ✅ HTML 상품 링크 247 · 이미지 링크 31 · 글 24473자
- llbean.com — https://www.llbean.com/llb/shop/506213?page=womens-dresses-and-skirts&nav=gnro
  - playwright: ✅ 수집기 31개 · HTML 상품 링크 59 · 이미지 링크 32 · 글 11644자 · 예 https://www.llbean.com/llb/shop/129901
  - firefox: ✅ 수집기 31개 · HTML 상품 링크 59 · 이미지 링크 32 · 글 11644자 · 예 https://www.llbean.com/llb/shop/129901
  - impit: ✅ HTML 상품 링크 49 · 이미지 링크 22 · 글 10689자
- global.llbean.com — https://global.llbean.com/llb/shop/622/?page=womens-pants-and-jeans&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: ✅ HTML 상품 링크 272 · 이미지 링크 60 · 글 34953자
- llbean.com — https://www.llbean.com/llb/shop/622?page=womens-pants-and-jeans&nav=gnro
  - playwright: ✅ 수집기 50개 · HTML 상품 링크 76 · 이미지 링크 51 · 글 15709자 · 예 https://www.llbean.com/llb/shop/5865338
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: ✅ HTML 상품 링크 74 · 이미지 링크 49 · 글 15981자
- oysho.com — https://www.oysho.com/gb/womens-sports-t-shirts-n4764
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 92 · 이미지 링크 5 · 글 19771자
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/us/womens-sports-t-shirts-n4764
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 29 · 이미지 링크 6 · 글 13555자
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/gb/womens-sports-tops-n5484
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 65 · 이미지 링크 5 · 글 16611자
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/us/womens-sports-tops-n5484
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 36 · 이미지 링크 16 · 글 13926자
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/gb/womens-sweatshirts-n4922
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/us/womens-sweatshirts-n4922
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/gb/dresses-jumpsuits-n4954
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/us/dresses-jumpsuits-n4954
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/gb/womens-pants-n4813
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/us/womens-pants-n4813
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- carhartt.com — https://www.carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017
  - playwright: 🟡 수집기 1개 · HTML 상품 링크 1 · 이미지 링크 30 · 글 5021자 · 예 https://www.carhartt.com/en-eu/p/relaxed-fit-fleece-joggers/105510
  - firefox: 🟡 수집기 1개 · HTML 상품 링크 1 · 이미지 링크 30 · 글 5021자 · 예 https://www.carhartt.com/en-eu/p/relaxed-fit-fleece-joggers/105510
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 30 · 글 6066자
- carhartt.com — https://www.carhartt.com/c/women-work-pants
  - playwright: ✅ 수집기 6개 · HTML 상품 링크 7 · 이미지 링크 72 · 글 12641자 · 예 https://www.carhartt.com/product/105113/womens-essential-ashland-pant
  - firefox: ✅ 수집기 6개 · HTML 상품 링크 7 · 이미지 링크 72 · 글 12641자 · 예 https://www.carhartt.com/product/105113/womens-essential-ashland-pant
  - impit: ✅ HTML 상품 링크 7 · 이미지 링크 72 · 글 21188자
- carhartt.com — https://www.carhartt.com/c/women-pants
  - playwright: ✅ 수집기 24개 · HTML 상품 링크 25 · 이미지 링크 90 · 글 14511자 · 예 https://www.carhartt.com/product/105113/womens-essential-ashland-pant
  - firefox: ✅ 수집기 24개 · HTML 상품 링크 25 · 이미지 링크 90 · 글 14511자 · 예 https://www.carhartt.com/product/105113/womens-essential-ashland-pant
  - impit: ✅ HTML 상품 링크 25 · 이미지 링크 90 · 글 23046자
- carhartt.com — https://www.carhartt.com/c/women-sweatpants
  - playwright: ⛔ HTTP 404 Page Not Found | Carhartt
  - firefox: ⛔ HTTP 404 Page Not Found | Carhartt
  - impit: ⛔ HTTP 404 Page Not Found | Carhartt

</details>
