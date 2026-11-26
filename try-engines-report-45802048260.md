# 무료 크롤링 엔진 비교 (2026-11-26T10:35Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45802048260 · 러너 GitHub Actions 1000008937 · 나가는 IP 3.42.157.x · 2026-11-26T10:35Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 4쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 0 | 4 | 0 | 0 | 0·4 | 0·0 | 정상 · 4쪽 · 3s |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit |
|---|---|:-:|
| 상품 | [www.llbean.com](https://www.llbean.com/llb/shop/502972?page=womens-shirts-and-button-downs) | 🟡 |
| 상품 | [www.llbean.com](https://www.llbean.com/llb/shop/516735?prefn1=refinementGender&prefv1=Womens&nav=gnro) | 🟡 |
| 상품 | [global.llbean.com](https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro) | 🟡 |
| 상품 | [www.oysho.com](https://www.oysho.com/us/womens-sweatshirts-n4922) | 🟡 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 상품 | www.llbean.com | impit | no-comp | 200 |  | 제목 "Women&#x27;s Shirts &amp; Button-Downs /" · Akamai: server: istio-envoy, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_sz | www.llbean.com/llb/shop/502972?page=womens-shirts-and-button-downs |
| 상품 | www.llbean.com | impit | no-comp | 200 |  | 제목 "Men&#x27;s, Women&#x27;s &amp; Kids&#x27" · Akamai: server: istio-envoy, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_sz | www.llbean.com/llb/shop/516735?prefn1=refinementGender&prefv1=Womens&n |
| 상품 | global.llbean.com | impit | no-comp | 200 |  | 제목 "Flannel Shirts / L.L.Bean International" · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 _cfuvid / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_2ed7405bf249449b067d110a6b, 쿠키 dwanonymous_d13b2ca47c82e2b9b55e4e73e26138f9, 쿠키 __cq_dnt, 쿠키 dw_dnt | global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Wome |
| 상품 | www.oysho.com | impit | blocked | 200 | Akamai (높음) | 제목 "&nbsp;" · 흔적 akamai-challenge · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge | www.oysho.com/us/womens-sweatshirts-n4922 |

<details><summary>사유</summary>

- www.llbean.com — https://www.llbean.com/llb/shop/502972?page=womens-shirts-and-button-downs
  - impit: 🟡 글 16106자
- www.llbean.com — https://www.llbean.com/llb/shop/516735?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - impit: 🟡 글 14518자
- global.llbean.com — https://global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnro
  - impit: 🟡 글 23133자
- www.oysho.com — https://www.oysho.com/us/womens-sweatshirts-n4922
  - impit: 🟡 글 8자

</details>
