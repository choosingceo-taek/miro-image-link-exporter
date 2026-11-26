# 무료 크롤링 엔진 비교 (2026-11-26T08:56Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45786534557 · 러너 GitHub Actions 1000008878 · 나가는 IP 3.42.157.x · 2026-11-26T08:52Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 13쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 1 | 9 | 2 | 1 | 1·9 | 0·0 | 정상 · 13쪽 · 108s |
| firefox-fresh | 1 | 9 | 2 | 1 | 1·9 | 0·0 | 정상 · 13쪽 · 107s |
| impit | 1 | 9 | 2 | 1 | 1·9 | 0·0 | 정상 · 13쪽 · 8s |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright | firefox-fresh | impit |
|---|---|:-:|:-:|:-:|
| 상품 | [www.thewhitecompany.com](https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.thewhitecompany.com](https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.thewhitecompany.com](https://www.thewhitecompany.com/us/c/us/Clothing/c/Tops) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.thewhitecompany.com](https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.thewhitecompany.com](https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tunics) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.thewhitecompany.com](https://www.thewhitecompany.com/us/) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.phase-eight.com](https://www.phase-eight.com/us/clothing/tops/) | ⛔ 404 | ⛔ 404 | ⛔ 404 |
| 상품 | [www.phase-eight.com](https://www.phase-eight.com/us/) | ⛔ 404 | ⛔ 404 | ⛔ 404 |
| 상품 | [www.crewclothing.com](https://www.crewclothing.com/) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.crewclothing.co.uk](https://www.crewclothing.co.uk/) | 🟡 | 🟡 | 🟡 |
| 상품 | [www.poetryfashion.com](https://www.poetryfashion.com/) | 🟡 | 🟡 | 🟡 |
| 상품 | [us.poetryfashion.com](https://us.poetryfashion.com/) | ❌ | ❌ | ❌ |
| 상품 | [www.carhartt.com](https://www.carhartt.com/c/women-pants) | ✅ | ✅ | ✅ |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 상품 | www.thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 상품 | www.thewhitecompany.com | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 상품 | www.thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 상품 | www.thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 상품 | www.thewhitecompany.com | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 상품 | www.thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 상품 | www.thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/c/us/Clothing/c/Tops |
| 상품 | www.thewhitecompany.com | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/c/us/Clothing/c/Tops |
| 상품 | www.thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/c/us/Clothing/c/Tops |
| 상품 | www.thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear |
| 상품 | www.thewhitecompany.com | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear |
| 상품 | www.thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear |
| 상품 | www.thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tu |
| 상품 | www.thewhitecompany.com | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tu |
| 상품 | www.thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tu |
| 상품 | www.thewhitecompany.com | playwright | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/ |
| 상품 | www.thewhitecompany.com | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/us/ |
| 상품 | www.thewhitecompany.com | impit | geo | 200 |  | 제목 "The White Company - US" · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/us/ |
| 상품 | www.phase-eight.com | playwright | dead | 404 | Cloudflare (낮음) | 제목 "Sites-P8-UK-Site /" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_90fe26f2e0af8dfc2722a28aeaa6722f, 쿠키 dwac_b68853caff276aaea9ec9a5cc4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.phase-eight.com/us/clothing/tops/ |
| 상품 | www.phase-eight.com | firefox-fresh | dead | 404 | Cloudflare (낮음) | 제목 "Sites-P8-UK-Site /" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_90fe26f2e0af8dfc2722a28aeaa6722f, 쿠키 dwac_b68853caff276aaea9ec9a5cc4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.phase-eight.com/us/clothing/tops/ |
| 상품 | www.phase-eight.com | impit | dead | 404 | Cloudflare (낮음) | 제목 "Sites-P8-UK-Site /" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_90fe26f2e0af8dfc2722a28aeaa6722f, 쿠키 dwac_b68853caff276aaea9ec9a5cc4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.phase-eight.com/us/clothing/tops/ |
| 상품 | www.phase-eight.com | playwright | dead | 404 | Cloudflare (낮음) | 제목 "Sites-P8-UK-Site /" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_90fe26f2e0af8dfc2722a28aeaa6722f, 쿠키 dwac_b68853caff276aaea9ec9a5cc4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.phase-eight.com/us/ |
| 상품 | www.phase-eight.com | firefox-fresh | dead | 404 | Cloudflare (낮음) | 제목 "Sites-P8-UK-Site /" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_90fe26f2e0af8dfc2722a28aeaa6722f, 쿠키 dwac_b68853caff276aaea9ec9a5cc4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.phase-eight.com/us/ |
| 상품 | www.phase-eight.com | impit | dead | 404 | Cloudflare (낮음) | 제목 "Sites-P8-UK-Site /" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_90fe26f2e0af8dfc2722a28aeaa6722f, 쿠키 dwac_b68853caff276aaea9ec9a5cc4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.phase-eight.com/us/ |
| 상품 | www.crewclothing.com | playwright | dead | 200 |  | 제목 "Crew Clothing Company / smart. casual. e" · 이동 other-site · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.crewclothing.com/ |
| 상품 | www.crewclothing.com | firefox-fresh | dead | 200 |  | 제목 "Crew Clothing Company / smart. casual. e" · 이동 other-site · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp | www.crewclothing.com/ |
| 상품 | www.crewclothing.com | impit | dead | 200 |  | 제목 "Crew Clothing Company / smart. casual. e" · 이동 other-site · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.crewclothing.com/ |
| 상품 | www.crewclothing.co.uk | playwright | no-comp | 200 |  | 제목 "Crew Clothing Company / smart. casual. e" · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.crewclothing.co.uk/ |
| 상품 | www.crewclothing.co.uk | firefox-fresh | no-comp | 200 |  | 제목 "Crew Clothing Company / smart. casual. e" · 흔적 captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp | www.crewclothing.co.uk/ |
| 상품 | www.crewclothing.co.uk | impit | no-comp | 200 |  | 제목 "Crew Clothing Company / smart. casual. e" · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.crewclothing.co.uk/ |
| 상품 | www.poetryfashion.com | playwright | no-comp | 200 |  | 제목 "POETRY - Women's Fashion - Spring Summer" · 이동 path · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_de37c8076c689b61626fbd417f, 쿠키 dwanonymous_1d13d00da8742c6d036c3743f536c7e4, 쿠키 __cq_dnt | www.poetryfashion.com/ |
| 상품 | www.poetryfashion.com | firefox-fresh | no-comp | 200 |  | 제목 "POETRY - Women's Fashion - Spring Summer" · 이동 path · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwsid, 쿠키 dwac_de37c8076c689b61626fbd417f, 쿠키 dwanonymous_1d13d00da8742c6d036c3743f536c7e4, 쿠키 __cq_dnt | www.poetryfashion.com/ |
| 상품 | www.poetryfashion.com | impit | no-comp | 200 |  | 제목 "POETRY - Women's Fashion - Spring Summer" · 이동 path · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_de37c8076c689b61626fbd417f, 쿠키 dwanonymous_1d13d00da8742c6d036c3743f536c7e4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.poetryfashion.com/ |
| 상품 | us.poetryfashion.com | playwright | error |  |  |  | us.poetryfashion.com/ |
| 상품 | us.poetryfashion.com | firefox-fresh | error |  |  |  | us.poetryfashion.com/ |
| 상품 | us.poetryfashion.com | impit | error |  |  |  | us.poetryfashion.com/ |

<details><summary>사유</summary>

- www.thewhitecompany.com — https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts
  - playwright: 🟡 글 316자
  - firefox-fresh: 🟡 글 316자
  - impit: 🟡 글 312자
- www.thewhitecompany.com — https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts
  - playwright: 🟡 글 316자
  - firefox-fresh: 🟡 글 316자
  - impit: 🟡 글 312자
- www.thewhitecompany.com — https://www.thewhitecompany.com/us/c/us/Clothing/c/Tops
  - playwright: 🟡 글 316자
  - firefox-fresh: 🟡 글 316자
  - impit: 🟡 글 312자
- www.thewhitecompany.com — https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/loungewear
  - playwright: 🟡 글 316자
  - firefox-fresh: 🟡 글 316자
  - impit: 🟡 글 312자
- www.thewhitecompany.com — https://www.thewhitecompany.com/us/Clothing/View-All-Clothing/c/dresses-and-tunics
  - playwright: 🟡 글 316자
  - firefox-fresh: 🟡 글 316자
  - impit: 🟡 글 312자
- www.thewhitecompany.com — https://www.thewhitecompany.com/us/
  - playwright: 🟡 글 316자
  - firefox-fresh: 🟡 글 316자
  - impit: 🟡 글 312자
- www.phase-eight.com — https://www.phase-eight.com/us/clothing/tops/
  - playwright: ⛔ HTTP 404 Sites-P8-UK-Site |
  - firefox-fresh: ⛔ HTTP 404 Sites-P8-UK-Site |
  - impit: ⛔ HTTP 404 Sites-P8-UK-Site | 
- www.phase-eight.com — https://www.phase-eight.com/us/
  - playwright: ⛔ HTTP 404 Sites-P8-UK-Site |
  - firefox-fresh: ⛔ HTTP 404 Sites-P8-UK-Site |
  - impit: ⛔ HTTP 404 Sites-P8-UK-Site | 
- www.crewclothing.com — https://www.crewclothing.com/
  - playwright: 🟡 글 8523자
  - firefox-fresh: 🟡 글 8523자
  - impit: 🟡 글 8109자
- www.crewclothing.co.uk — https://www.crewclothing.co.uk/
  - playwright: 🟡 글 8523자
  - firefox-fresh: 🟡 글 8523자
  - impit: 🟡 글 8109자
- www.poetryfashion.com — https://www.poetryfashion.com/
  - playwright: 🟡 글 14058자
  - firefox-fresh: 🟡 글 14058자
  - impit: 🟡 글 3156자
- us.poetryfashion.com — https://us.poetryfashion.com/
  - playwright: ❌ page.goto: net::ERR_NAME_NOT_RESOLVED at https://us.poetryfashion.com/
  - firefox-fresh: ❌ page.goto: NS_ERROR_UNKNOWN_HOST
  - impit: ❌ Failed to connect to the server.
- www.carhartt.com — https://www.carhartt.com/c/women-pants
  - playwright: ✅ Cotton 97% / Elastane 3%
  - firefox-fresh: ✅ Cotton 97% / Elastane 3%
  - impit: ✅ Cotton 97% / Elastane 3%

</details>
