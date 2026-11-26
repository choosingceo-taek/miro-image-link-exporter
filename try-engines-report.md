# 무료 크롤링 엔진 비교 (2026-11-26T09:48Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45793876846 · 러너 GitHub Actions 1000008896 · 나가는 IP 20.119.102.x · 2026-11-26T09:40Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 23쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 23 | 0 | 0 | 0 | 0·0 | 23·0 | 정상 · 23쪽 · 500s |
| impit | 23 | 0 | 0 | 0 | 0·0 | 23·0 | 정상 · 23쪽 · 18s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright | impit |
|---|---|:-:|:-:|
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/trousers-jeans/?_gl=1*6jfisz*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MzUkajIyJGwwJGg1MzYzNDQ3NzQ.) | ✅ 36 | ✅ 87 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/trousers-jeans/) | ✅ 39 | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/pants-jeans/) | ✅ 74 | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/t-shirts/?_gl=1*18k9v40*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ1OTckajYwJGwwJGg1MzYzNDQ3NzQ.) | ✅ 34 | ✅ 51 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/t-shirts/) | ✅ 53 | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/sweatshirts/?_gl=1*6lpw8g*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MjMkajM0JGwwJGg1MzYzNDQ3NzQ.) | ✅ 37 | ✅ 54 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/sweatshirts/) | ✅ 44 | ✅ 63 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/tops-shirts/?_gl=1*wv5ete*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTEkajQ2JGwwJGg1MzYzNDQ3NzQ.) | ✅ 97 | ✅ 87 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/tops-shirts/) | ✅ 98 | ✅ 27 |
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/ready-to-wear/dresses/?_gl=1*15p7q1u*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTYkajQxJGwwJGg1MzYzNDQ3NzQ.) | ✅ 107 | ✅ 97 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/dresses/) | ✅ 108 | ✅ 99 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030) | ✅ 179 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/t-shirts/cat90030) | ✅ 238 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/tank-tops-tube-tops/cat380157) | ✅ 64 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/tank-tops-tube-tops/cat380157) | ✅ 87 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/hoodies-sweatshirts/cat90048) | ✅ 105 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/hoodies-sweatshirts/cat90048) | ✅ 118 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/tops/shirts-blouses/cat360002) | ✅ 60 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/tops/shirts-blouses/cat360002) | ✅ 75 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/dresses/cat1320034) | ✅ 89 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/dresses/cat1320034) | ✅ 120 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/intl/en/c/women/bottoms/cat10051) | ✅ 364 | ✅ 30 |
| 목록 | [ae.com](https://www.ae.com/us/en/c/women/bottoms/cat10051) | ✅ 398 | ✅ 30 |

<details><summary>사유</summary>

- ba-sh.com — https://ba-sh.com/fr/en/trousers-jeans/?_gl=1*6jfisz*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MzUkajIyJGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 108 · 이미지 링크 32 · 글 17638자 · 예 https://ba-sh.com/fr/en/p/pants-faimi-blackstone-3667436126895.html
  - impit: ✅ HTML 상품 링크 87 · 이미지 링크 3 · 글 5358자
- ba-sh.com — https://ba-sh.com/us/trousers-jeans/
  - playwright: ✅ 수집기 39개 · HTML 상품 링크 108 · 이미지 링크 33 · 글 15674자 · 예 https://ba-sh.com/us/p/pants-faimi-blackstone-3667436126895.html
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 4608자
- ba-sh.com — https://ba-sh.com/us/pants-jeans/
  - playwright: ✅ 수집기 74개 · HTML 상품 링크 107 · 이미지 링크 31 · 글 15674자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 4608자
- ba-sh.com — https://ba-sh.com/fr/en/t-shirts/?_gl=1*18k9v40*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ1OTckajYwJGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 34개 · HTML 상품 링크 67 · 이미지 링크 32 · 글 13613자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 51 · 이미지 링크 6 · 글 4737자
- ba-sh.com — https://ba-sh.com/us/t-shirts/
  - playwright: ✅ 수집기 53개 · HTML 상품 링크 84 · 이미지 링크 33 · 글 18602자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 7891자
- ba-sh.com — https://ba-sh.com/fr/en/sweatshirts/?_gl=1*6lpw8g*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MjMkajM0JGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 37개 · HTML 상품 링크 69 · 이미지 링크 32 · 글 13277자 · 예 https://ba-sh.com/fr/en/p/crush-sweatshirt-chocolat-3667436148194.html
  - impit: ✅ HTML 상품 링크 54 · 이미지 링크 6 · 글 4432자
- ba-sh.com — https://ba-sh.com/us/sweatshirts/
  - playwright: ✅ 수집기 44개 · HTML 상품 링크 78 · 이미지 링크 31 · 글 14981자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 63 · 이미지 링크 5 · 글 4895자
- ba-sh.com — https://ba-sh.com/fr/en/tops-shirts/?_gl=1*wv5ete*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTEkajQ2JGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 97개 · HTML 상품 링크 130 · 이미지 링크 59 · 글 15720자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 87 · 이미지 링크 4 · 글 5343자
- ba-sh.com — https://ba-sh.com/us/tops-shirts/
  - playwright: ✅ 수집기 98개 · HTML 상품 링크 132 · 이미지 링크 33 · 글 19660자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 27 · 이미지 링크 1 · 글 7740자
- ba-sh.com — https://ba-sh.com/fr/en/ready-to-wear/dresses/?_gl=1*15p7q1u*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTYkajQxJGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 107개 · HTML 상품 링크 139 · 이미지 링크 69 · 글 16177자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - impit: ✅ HTML 상품 링크 97 · 이미지 링크 57 · 글 10986자
- ba-sh.com — https://ba-sh.com/us/dresses/
  - playwright: ✅ 수집기 108개 · HTML 상품 링크 138 · 이미지 링크 66 · 글 20216자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - impit: ✅ HTML 상품 링크 99 · 이미지 링크 57 · 글 14168자
- ae.com — https://www.ae.com/intl/en/c/women/tops/t-shirts/cat90030
  - playwright: ✅ 수집기 179개 · HTML 상품 링크 179 · 이미지 링크 180 · 글 29757자 · 예 https://www.ae.com/intl/en/p/women/tops/t-shirts/ae-cozy-crew-neck-long-sleeve-t-shirt/3376_2025_309
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 9382자
- ae.com — https://www.ae.com/us/en/c/women/tops/t-shirts/cat90030
  - playwright: ✅ 수집기 238개 · HTML 상품 링크 237 · 이미지 링크 247 · 글 42482자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 10971자
- ae.com — https://www.ae.com/intl/en/c/women/tops/tank-tops-tube-tops/cat380157
  - playwright: ✅ 수집기 64개 · HTML 상품 링크 64 · 이미지 링크 65 · 글 14508자 · 예 https://www.ae.com/intl/en/p/women/tops/blouses-button-up-shirts/ae-lace-trim-button-up-top/2351_7160_131
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 8963자
- ae.com — https://www.ae.com/us/en/c/women/tops/tank-tops-tube-tops/cat380157
  - playwright: ✅ 수집기 87개 · HTML 상품 링크 86 · 이미지 링크 96 · 글 19689자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 10684자
- ae.com — https://www.ae.com/intl/en/c/women/tops/hoodies-sweatshirts/cat90048
  - playwright: ✅ 수집기 105개 · HTML 상품 링크 105 · 이미지 링크 106 · 글 20308자 · 예 https://www.ae.com/intl/en/p/women/tops/hoodies-sweatshirts/ae-everyday-luxe-oversized-hoodie/1453_3332_637
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 8993자
- ae.com — https://www.ae.com/us/en/c/women/tops/hoodies-sweatshirts/cat90048
  - playwright: ✅ 수집기 118개 · HTML 상품 링크 117 · 이미지 링크 137 · 글 25418자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 50 · 글 11019자
- ae.com — https://www.ae.com/intl/en/c/women/tops/shirts-blouses/cat360002
  - playwright: ✅ 수집기 60개 · HTML 상품 링크 60 · 이미지 링크 61 · 글 13343자 · 예 https://www.ae.com/intl/en/p/women/tops/blouses-button-up-shirts/ae-cozy-flannel-shacket/1354_7086_106
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 8805자
- ae.com — https://www.ae.com/us/en/c/women/tops/shirts-blouses/cat360002
  - playwright: ✅ 수집기 75개 · HTML 상품 링크 74 · 이미지 링크 84 · 글 17327자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 10396자
- ae.com — https://www.ae.com/intl/en/c/women/dresses/cat1320034
  - playwright: ✅ 수집기 89개 · HTML 상품 링크 89 · 이미지 링크 90 · 글 18014자 · 예 https://www.ae.com/intl/en/p/women/dresses/mini-dresses/ae-oversized-cable-knit-sweater-mini-dress/0395_9648_062
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 9413자
- ae.com — https://www.ae.com/us/en/c/women/dresses/cat1320034
  - playwright: ✅ 수집기 120개 · HTML 상품 링크 119 · 이미지 링크 136 · 글 24660자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 47 · 글 11041자
- ae.com — https://www.ae.com/intl/en/c/women/bottoms/cat10051
  - playwright: ✅ 수집기 364개 · HTML 상품 링크 364 · 이미지 링크 365 · 글 56328자 · 예 https://www.ae.com/intl/en/p/women/pants-sweatpants/cargo-pants/ae-low-rise-cozy-corduroy-cargo-pant/0316_6065_329
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 31 · 글 9598자
- ae.com — https://www.ae.com/us/en/c/women/bottoms/cat10051
  - playwright: ✅ 수집기 398개 · HTML 상품 링크 397 · 이미지 링크 407 · 글 71049자 · 예 https://www.ae.com/us/en/x/jeans
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 40 · 글 11710자

</details>
