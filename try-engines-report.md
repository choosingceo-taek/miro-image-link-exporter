# 무료 크롤링 엔진 비교 (2026-11-26T09:24Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45786605359 · 러너 GitHub Actions 1000008884 · 나가는 IP 4.236.164.x · 2026-11-26T09:12Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 37쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 32 | 0 | 3 | 2 | 0·0 | 32·0 | 시간 초과(12분) · 35/37쪽까지 · 720s |
| impit | 34 | 0 | 3 | 0 | 0·0 | 34·0 | 정상 · 37쪽 · 31s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright | impit |
|---|---|:-:|:-:|
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030) | ✅ 193 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/t-shirts/cat90030) | ✅ 237 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/tank-tops-tube-tops/cat380157) | ✅ 62 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/tank-tops-tube-tops/cat380157) | ✅ 90 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/hoodies-sweatshirts/cat90048) | ✅ 103 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/hoodies-sweatshirts/cat90048) | ✅ 118 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/shirts-blouses/cat360002) | ✅ 60 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/shirts-blouses/cat360002) | ✅ 71 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/dresses/cat1320034) | ✅ 89 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/dresses/cat1320034) | ✅ 120 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/bottoms/cat10051) | ✅ 364 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/bottoms/cat10051) | ✅ 401 | ✅ 30 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-t-shirts) | ✅ 36 | ✅ 36 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-t-shirts) | ✅ 15 | ✅ 14 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-sweatshirts-hoodies) | ✅ 36 | ✅ 36 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-hoodies-sweatshirts) | ✅ 7 | ✅ 6 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-sweatshirts-hoodies) | ⛔ 404 | ⛔ 404 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-shirts-blouses) | ✅ 36 | ✅ 36 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-shirts-blouses) | ✅ 29 | ✅ 28 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-dresses) | ✅ 29 | ✅ 29 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-dresses) | ✅ 10 | ✅ 9 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/clothing/dresses) | ✅ 10 | ✅ 9 |
| 목록 | [barbour.com](https://www.barbour.com/row/womens/womens-clothing/womens-trousers) | ✅ 33 | ✅ 33 |
| 목록 | [barbour.com](https://www.barbour.com/us/womens/womens-clothing/womens-trousers) | ⛔ 404 | ⛔ 404 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/t-shirts/?_gl=1*18k9v40*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ1OTckajYwJGwwJGg1MzYzNDQ3NzQ.) | ✅ 22 | ✅ 51 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/t-shirts/) | ✅ 39 | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/sweatshirts/?_gl=1*6lpw8g*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MjMkajM0JGwwJGg1MzYzNDQ3NzQ.) | ✅ 37 | ✅ 54 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/sweatshirts/) | ✅ 44 | ✅ 63 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/sweaters-cardiganssweatshirts/) | ✅ 41 | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/tops-shirts/?_gl=1*wv5ete*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTEkajQ2JGwwJGg1MzYzNDQ3NzQ.) | ✅ 97 | ✅ 87 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/tops-shirts/) | ✅ 98 | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/ready-to-wear/dresses/?_gl=1*15p7q1u*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTYkajQxJGwwJGg1MzYzNDQ3NzQ.) | ✅ 107 | ✅ 97 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/dresses/) | ✅ 108 | ✅ 99 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/ready-to-wear/dresses/) | ⛔ 404 | ⛔ 404 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/trousers-jeans/?_gl=1*6jfisz*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MzUkajIyJGwwJGg1MzYzNDQ3NzQ.) | ✅ 75 | ✅ 87 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/trousers-jeans/) | ❌ | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/pants-jeans/) | ❌ | ✅ 27 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | barbour.com | playwright | dead | 404 | Cloudflare (낮음) | 제목 "Sites-barbour-us-Site" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_1e532452c54fb0368ba9b98273, 쿠키 dwanonymous_fad861a9ba68573238e98b619c71bf9d, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.barbour.com/us/womens/womens-clothing/womens-sweatshirts-hoodies |
| 목록 | barbour.com | impit | dead | 404 | Cloudflare (낮음) | 제목 "Sites-barbour-us-Site" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_1bfd63077533a3d24788588522ef61b2, 쿠키 dwac_85c6dd13f546b74604b98f966c, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.barbour.com/us/womens/womens-clothing/womens-sweatshirts-hoodies |
| 목록 | barbour.com | playwright | dead | 404 | Cloudflare (낮음) | 제목 "Sites-barbour-us-Site" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_1e532452c54fb0368ba9b98273, 쿠키 dwanonymous_fad861a9ba68573238e98b619c71bf9d, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.barbour.com/us/womens/womens-clothing/womens-trousers |
| 목록 | barbour.com | impit | dead | 404 | Cloudflare (낮음) | 제목 "Sites-barbour-us-Site" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_1bfd63077533a3d24788588522ef61b2, 쿠키 dwac_85c6dd13f546b74604b98f966c, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.barbour.com/us/womens/womens-clothing/womens-trousers |
| 목록 | ba-sh.com | playwright | dead | 404 | Cloudflare (낮음) | 제목 "Sites-bash-us-Site" · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_694063f73aea99781f1dbbe491, 쿠키 dwanonymous_9beb1b82c11c2832ad0891cf6d0faf7d, 쿠키 __cq_dnt, 쿠키 dw_dnt | ba-sh.com/us/ready-to-wear/dresses/ |
| 목록 | ba-sh.com | impit | dead | 404 | Cloudflare (낮음) | 제목 "Sites-bash-us-Site" · 흔적 notfound · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwanonymous_3844c0b69bfe3e048dd1c65e47cdf49f, 쿠키 dwac_934d62719b796d302d6d547b7e, 쿠키 __cq_dnt, 쿠키 dw_dnt | ba-sh.com/us/ready-to-wear/dresses/ |
| 목록 | ba-sh.com | playwright | timeout |  |  |  | ba-sh.com/us/trousers-jeans/ |
| 목록 | ba-sh.com | playwright | timeout |  |  |  | ba-sh.com/us/pants-jeans/ |

<details><summary>사유</summary>

- ae.com — https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030
  - playwright: ✅ 수집기 193개 · HTML 상품 링크 193 · 이미지 링크 194 · 글 32066자 · 예 https://www.ae.com/intl/en/p/women/tops/t-shirts/ae-cozy-crew-neck-long-sleeve-t-shirt/3376_2025_309
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 9412자
- ae.com — https://www.ae.com/us/en/c/women/tops/t-shirts/cat90030
  - playwright: ✅ 수집기 237개 · HTML 상품 링크 236 · 이미지 링크 246 · 글 42296자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 10971자
- ae.com — https://www.ae.com/intl/en/c/women/tops/tank-tops-tube-tops/cat380157
  - playwright: ✅ 수집기 62개 · HTML 상품 링크 62 · 이미지 링크 63 · 글 13938자 · 예 https://www.ae.com/intl/en/p/women/tops/blouses-button-up-shirts/ae-lace-trim-button-up-top/2351_7160_131
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 8961자
- ae.com — https://www.ae.com/us/en/c/women/tops/tank-tops-tube-tops/cat380157
  - playwright: ✅ 수집기 90개 · HTML 상품 링크 89 · 이미지 링크 99 · 글 19494자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 10684자
- ae.com — https://www.ae.com/intl/en/c/women/tops/hoodies-sweatshirts/cat90048
  - playwright: ✅ 수집기 103개 · HTML 상품 링크 103 · 이미지 링크 104 · 글 20324자 · 예 https://www.ae.com/intl/en/p/women/tops/hoodies-sweatshirts/ae-everyday-luxe-oversized-hoodie/1453_3332_637
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 8993자
- ae.com — https://www.ae.com/us/en/c/women/tops/hoodies-sweatshirts/cat90048
  - playwright: ✅ 수집기 118개 · HTML 상품 링크 117 · 이미지 링크 137 · 글 25336자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 50 · 글 11019자
- ae.com — https://www.ae.com/intl/en/c/women/tops/shirts-blouses/cat360002
  - playwright: ✅ 수집기 60개 · HTML 상품 링크 60 · 이미지 링크 61 · 글 13319자 · 예 https://www.ae.com/intl/en/p/women/tops/blouses-button-up-shirts/ae-cozy-flannel-shacket/1354_7086_106
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 8805자
- ae.com — https://www.ae.com/us/en/c/women/tops/shirts-blouses/cat360002
  - playwright: ✅ 수집기 71개 · HTML 상품 링크 70 · 이미지 링크 80 · 글 17310자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 10396자
- ae.com — https://www.ae.com/intl/en/c/women/dresses/cat1320034
  - playwright: ✅ 수집기 89개 · HTML 상품 링크 89 · 이미지 링크 90 · 글 17985자 · 예 https://www.ae.com/intl/en/p/women/dresses/mini-dresses/ae-oversized-cable-knit-sweater-mini-dress/0395_9648_062
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 9413자
- ae.com — https://www.ae.com/us/en/c/women/dresses/cat1320034
  - playwright: ✅ 수집기 120개 · HTML 상품 링크 119 · 이미지 링크 136 · 글 24446자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 47 · 글 11041자
- ae.com — https://www.ae.com/intl/en/c/women/bottoms/cat10051
  - playwright: ✅ 수집기 364개 · HTML 상품 링크 364 · 이미지 링크 365 · 글 56328자 · 예 https://www.ae.com/intl/en/p/women/pants-sweatpants/cargo-pants/ae-low-rise-cozy-corduroy-cargo-pant/0316_6065_329
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 9596자
- ae.com — https://www.ae.com/us/en/c/women/bottoms/cat10051
  - playwright: ✅ 수집기 401개 · HTML 상품 링크 400 · 이미지 링크 410 · 글 71104자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 11742자
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-t-shirts
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 0 · 글 15715자 · 예 https://www.barbour.com/row/rosalie-t-shirt-LTS0730WH11.html
  - impit: ✅ HTML 상품 링크 36 · 이미지 링크 0 · 글 14553자
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-t-shirts
  - playwright: ✅ 수집기 15개 · HTML 상품 링크 14 · 이미지 링크 0 · 글 11736자 · 예 https://www.barbour.com/us/barbour-x-a.p.c.-womens-t-shirt-LTS0763WH33.html
  - impit: ✅ HTML 상품 링크 14 · 이미지 링크 0 · 글 10810자
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-sweatshirts-hoodies
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 0 · 글 15656자 · 예 https://www.barbour.com/row/elswith-sweatshirt-LOL0711WH11.html
  - impit: ✅ HTML 상품 링크 36 · 이미지 링크 0 · 글 14592자
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-hoodies-sweatshirts
  - playwright: ✅ 수집기 7개 · HTML 상품 링크 6 · 이미지 링크 0 · 글 10148자 · 예 https://www.barbour.com/us/hartland-logo-sweatshirt-LOL0672RE86.html
  - impit: ✅ HTML 상품 링크 6 · 이미지 링크 0 · 글 8810자
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-sweatshirts-hoodies
  - playwright: ⛔ HTTP 404 Sites-barbour-us-Site
  - impit: ⛔ HTTP 404 Sites-barbour-us-Site
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-shirts-blouses
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 36 · 이미지 링크 0 · 글 17066자 · 예 https://www.barbour.com/row/seren-oversized-denim-shirt-LSH1765BL68.html
  - impit: ✅ HTML 상품 링크 36 · 이미지 링크 0 · 글 15737자
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-shirts-blouses
  - playwright: ✅ 수집기 29개 · HTML 상품 링크 28 · 이미지 링크 0 · 글 16286자 · 예 https://www.barbour.com/us/ellen-shirt-LSH1796RU51.html
  - impit: ✅ HTML 상품 링크 28 · 이미지 링크 0 · 글 15116자
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-dresses
  - playwright: ✅ 수집기 29개 · HTML 상품 링크 29 · 이미지 링크 0 · 글 13141자 · 예 https://www.barbour.com/row/kenna-maxi-dress-LDR1055BK11.html
  - impit: ✅ HTML 상품 링크 29 · 이미지 링크 0 · 글 12165자
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-dresses
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 9 · 이미지 링크 0 · 글 10516자 · 예 https://www.barbour.com/us/tisbury-mini-dress-LDR1019NY99.html
  - impit: ✅ HTML 상품 링크 9 · 이미지 링크 0 · 글 9464자
- barbour.com — https://www.barbour.com/us/womens/clothing/dresses
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 9 · 이미지 링크 0 · 글 10516자 · 예 https://www.barbour.com/us/tisbury-mini-dress-LDR1019NY99.html
  - impit: ✅ HTML 상품 링크 9 · 이미지 링크 0 · 글 9464자
- barbour.com — https://www.barbour.com/row/womens/womens-clothing/womens-trousers
  - playwright: ✅ 수집기 33개 · HTML 상품 링크 33 · 이미지 링크 0 · 글 15238자 · 예 https://www.barbour.com/row/gabriette-stretch-skinny-jeans-LTR0447BK11.html
  - impit: ✅ HTML 상품 링크 33 · 이미지 링크 0 · 글 14231자
- barbour.com — https://www.barbour.com/us/womens/womens-clothing/womens-trousers
  - playwright: ⛔ HTTP 404 Sites-barbour-us-Site
  - impit: ⛔ HTTP 404 Sites-barbour-us-Site
- ba-sh.com — https://ba-sh.com/fr/en/t-shirts/?_gl=1*18k9v40*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ1OTckajYwJGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 22개 · HTML 상품 링크 67 · 이미지 링크 32 · 글 16440자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 51 · 이미지 링크 6 · 글 4737자
- ba-sh.com — https://ba-sh.com/us/t-shirts/
  - playwright: ✅ 수집기 39개 · HTML 상품 링크 85 · 이미지 링크 34 · 글 18604자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 7891자
- ba-sh.com — https://ba-sh.com/fr/en/sweatshirts/?_gl=1*6lpw8g*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MjMkajM0JGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 37개 · HTML 상품 링크 69 · 이미지 링크 32 · 글 13279자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 54 · 이미지 링크 6 · 글 4432자
- ba-sh.com — https://ba-sh.com/us/sweatshirts/
  - playwright: ✅ 수집기 44개 · HTML 상품 링크 79 · 이미지 링크 32 · 글 14981자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 63 · 이미지 링크 5 · 글 4895자
- ba-sh.com — https://ba-sh.com/us/sweaters-cardiganssweatshirts/
  - playwright: ✅ 수집기 41개 · HTML 상품 링크 75 · 이미지 링크 30 · 글 14559자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 4174자
- ba-sh.com — https://ba-sh.com/fr/en/tops-shirts/?_gl=1*wv5ete*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTEkajQ2JGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 97개 · HTML 상품 링크 130 · 이미지 링크 59 · 글 15722자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 87 · 이미지 링크 4 · 글 5343자
- ba-sh.com — https://ba-sh.com/us/tops-shirts/
  - playwright: ✅ 수집기 98개 · HTML 상품 링크 133 · 이미지 링크 34 · 글 19660자 · 예 https://ba-sh.com/us/p/top-crista-noir-3667436126727.html
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 7740자
- ba-sh.com — https://ba-sh.com/fr/en/ready-to-wear/dresses/?_gl=1*15p7q1u*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTYkajQxJGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 107개 · HTML 상품 링크 137 · 이미지 링크 68 · 글 16178자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 97 · 이미지 링크 57 · 글 10986자
- ba-sh.com — https://ba-sh.com/us/dresses/
  - playwright: ✅ 수집기 108개 · HTML 상품 링크 139 · 이미지 링크 67 · 글 20216자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 99 · 이미지 링크 57 · 글 14168자
- ba-sh.com — https://ba-sh.com/us/ready-to-wear/dresses/
  - playwright: ⛔ HTTP 404 Sites-bash-us-Site
  - impit: ⛔ HTTP 404 Sites-bash-us-Site
- ba-sh.com — https://ba-sh.com/fr/en/trousers-jeans/?_gl=1*6jfisz*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MzUkajIyJGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 75개 · HTML 상품 링크 108 · 이미지 링크 32 · 글 14810자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 87 · 이미지 링크 3 · 글 5358자
- ba-sh.com — https://ba-sh.com/us/trousers-jeans/
  - playwright: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 4608자
- ba-sh.com — https://ba-sh.com/us/pants-jeans/
  - playwright: ❌ 시간 초과(12분) — 못 본 페이지
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 4608자

</details>
