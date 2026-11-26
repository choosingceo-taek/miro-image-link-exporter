# 무료 크롤링 엔진 비교 (2026-11-26T10:37Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45802704448 · 러너 GitHub Actions 1000008939 · 나가는 IP 52.159.247.x · 2026-11-26T10:36Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 3쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 1 | 0 | 2 | 0 | 0·0 | 1·0 | 정상 · 3쪽 · 60s |
| impit | 3 | 0 | 0 | 0 | 0·0 | 3·0 | 정상 · 3쪽 · 2s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright | impit |
|---|---|:-:|:-:|
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro) | ⛔ 403 | ✅ 244 |
| 목록 | [llbean.com](https://www.llbean.com/llb/shop/502972?page=womens-shirts-and-button-downs) | ✅ 48 | ✅ 76 |
| 목록 | [global.llbean.com](https://global.llbean.com/llb/shop/502972/?page=womens-shirts-and-button-downs) | ⛔ 403 | ✅ 275 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block | global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Wome |
| 목록 | global.llbean.com | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Akamai: 쿠키 bm_sz, 쿠키 _abck | global.llbean.com/llb/shop/502972/?page=womens-shirts-and-button-downs |

<details><summary>사유</summary>

- global.llbean.com — https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - impit: ✅ HTML 상품 링크 244 · 이미지 링크 28 · 글 22583자
- llbean.com — https://www.llbean.com/llb/shop/502972?page=womens-shirts-and-button-downs
  - playwright: ✅ 수집기 48개 · HTML 상품 링크 76 · 이미지 링크 49 · 글 15773자 · 예 https://www.llbean.com/llb/shop/5868075
  - impit: ✅ HTML 상품 링크 76 · 이미지 링크 49 · 글 16044자
- global.llbean.com — https://global.llbean.com/llb/shop/502972/?page=womens-shirts-and-button-downs
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - impit: ✅ HTML 상품 링크 275 · 이미지 링크 60 · 글 35990자

</details>
