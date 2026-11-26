# 무료 크롤링 엔진 비교 (2026-11-26T09:51Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45795558811 · 러너 GitHub Actions 1000008904 · 나가는 IP 52.156.111.x · 2026-11-26T09:50Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 10쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 1 | 9 | 0 | 0 | 1·9 | 0·0 | 정상 · 10쪽 · 10s |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit |
|---|---|:-:|
| 상품 | [ba-sh.com](https://ba-sh.com/us/pants-jeans/) | 🟡 |
| 상품 | [ba-sh.com](https://ba-sh.com/us/trousers-jeans/) | 🟡 |
| 상품 | [ba-sh.com](https://ba-sh.com/us/t-shirts/) | 🟡 |
| 상품 | [ba-sh.com](https://ba-sh.com/us/sweatshirts/) | 🟡 |
| 상품 | [ba-sh.com](https://ba-sh.com/us/tops-shirts/) | 🟡 |
| 상품 | [ba-sh.com](https://ba-sh.com/us/dresses/) | 🟡 |
| 상품 | [www.ae.com](https://www.ae.com/us/en/c/women/tops/t-shirts/cat90030) | ✅ |
| 상품 | [www.poetryfashion.com](https://www.poetryfashion.com/category-POAST/shirts-tunics.htm) | 🟡 |
| 상품 | [www.poetryfashion.com](https://www.poetryfashion.com/category-POADS/dresses-skirts.htm) | 🟡 |
| 상품 | [www.barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-t-shirts) | 🟡 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 상품 | ba-sh.com | impit | no-comp | 200 |  | 제목 "Jeans for Women - Stylish Denim, Pleated" · Cloudflare: cf-ray 헤더 | ba-sh.com/us/pants-jeans/ |
| 상품 | ba-sh.com | impit | no-comp | 200 |  | 제목 "Jeans for Women - Stylish Denim, Pleated" · 이동 path · Cloudflare: cf-ray 헤더 | ba-sh.com/us/trousers-jeans/ |
| 상품 | ba-sh.com | impit | no-comp | 200 |  | 제목 "Women T-Shirts & Tank Tops - Stylish Gra" · Cloudflare: cf-ray 헤더 | ba-sh.com/us/t-shirts/ |
| 상품 | ba-sh.com | impit | no-comp | 200 |  | 제목 "Black Friday Sweater Sale - Up To 40% Of" · 이동 path · Cloudflare: cf-ray 헤더 | ba-sh.com/us/sweatshirts/ |
| 상품 | ba-sh.com | impit | no-comp | 200 |  | 제목 "Tops & Shirts For Women - Patterned & Fl" · Cloudflare: cf-ray 헤더 | ba-sh.com/us/tops-shirts/ |
| 상품 | ba-sh.com | impit | no-comp | 200 |  | 제목 "Dresses For Women - Mini, Maxi, Midi Len" · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_934d62719b796d302d6d547b7e, 쿠키 dwanonymous_3844c0b69bfe3e048dd1c65e47cdf49f, 쿠키 __cq_dnt, 쿠키 dw_dnt | ba-sh.com/us/dresses/ |
| 상품 | www.poetryfashion.com | impit | no-comp | 200 |  | 제목 "POETRY - Shirts & Tunics" · 이동 path · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_de37c8076c689b61626fbd417f, 쿠키 dwanonymous_1d13d00da8742c6d036c3743f536c7e4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.poetryfashion.com/category-POAST/shirts-tunics.htm |
| 상품 | www.poetryfashion.com | impit | no-comp | 200 |  | 제목 "POETRY - Dresses & Skirts" · 이동 path · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_de37c8076c689b61626fbd417f, 쿠키 dwanonymous_1d13d00da8742c6d036c3743f536c7e4, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.poetryfashion.com/category-POADS/dresses-skirts.htm |
| 상품 | www.barbour.com | impit | no-comp | 200 |  | 제목 "Women's T-Shirts / Barbour" · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_1e532452c54fb0368ba9b98273, 쿠키 dwanonymous_fad861a9ba68573238e98b619c71bf9d, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.barbour.com/row/womens/womens-clothing/womens-t-shirts |

<details><summary>사유</summary>

- ba-sh.com — https://ba-sh.com/us/pants-jeans/
  - impit: 🟡 글 4722자
- ba-sh.com — https://ba-sh.com/us/trousers-jeans/
  - impit: 🟡 글 4722자
- ba-sh.com — https://ba-sh.com/us/t-shirts/
  - impit: 🟡 글 8013자
- ba-sh.com — https://ba-sh.com/us/sweatshirts/
  - impit: 🟡 글 5005자
- ba-sh.com — https://ba-sh.com/us/tops-shirts/
  - impit: 🟡 글 7862자
- ba-sh.com — https://ba-sh.com/us/dresses/
  - impit: 🟡 글 14450자
- www.ae.com — https://www.ae.com/us/en/c/women/tops/t-shirts/cat90030
  - impit: ✅ Cotton 100%
- www.poetryfashion.com — https://www.poetryfashion.com/category-POAST/shirts-tunics.htm
  - impit: 🟡 글 3772자
- www.poetryfashion.com — https://www.poetryfashion.com/category-POADS/dresses-skirts.htm
  - impit: 🟡 글 4425자
- www.barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-t-shirts
  - impit: 🟡 글 14621자

</details>
