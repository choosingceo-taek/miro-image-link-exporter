# 무료 크롤링 엔진 비교 (2026-11-26T10:02Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45795550224 · 러너 GitHub Actions 1000008903 · 나가는 IP 3.42.157.x · 2026-11-26T09:51Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 13쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| playwright | 3 | 0 | 10 | 0 | 0·0 | 3·0 | 정상 · 13쪽 · 59s |
| firefox | 12 | 1 | 0 | 0 | 0·0 | 12·1 | 정상 · 13쪽 · 605s |

## 대상 고르기

브랜드당 상품 3개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.

| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |
|---|---:|---:|---:|---|
| - | 카탈로그 없음 | | | |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | playwright | firefox |
|---|---|:-:|:-:|
| 목록 | [ba-sh.com](https://ba-sh.com/fr/en/trousers-jeans/?_gl=1*6jfisz*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MzUkajIyJGwwJGg1MzYzNDQ3NzQ.) | ✅ 28 | ✅ 28 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/trousers-jeans/) | ✅ 31 | ✅ 31 |
| 목록 | [ba-sh.com](https://ba-sh.com/us/pants-jeans/) | ✅ 74 | ✅ 74 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-sweatshirts-n4922) | ⛔ 403 | 🟡 0 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-sweatshirts-n4922) | ⛔ 403 | ✅ 39 |
| 목록 | [oysho.com](https://www.oysho.com/gb/dresses-jumpsuits-n4954) | ⛔ 403 | ✅ 47 |
| 목록 | [oysho.com](https://www.oysho.com/us/dresses-jumpsuits-n4954) | ⛔ 403 | ✅ 46 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-pants-n4813) | ⛔ 403 | ✅ 93 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-pants-n4813) | ⛔ 403 | ✅ 33 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-sports-t-shirts-n4764) | ⛔ 403 | ✅ 99 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-sports-t-shirts-n4764) | ⛔ 403 | ✅ 29 |
| 목록 | [oysho.com](https://www.oysho.com/gb/womens-sports-tops-n5484) | ⛔ 403 | ✅ 65 |
| 목록 | [oysho.com](https://www.oysho.com/us/womens-sports-tops-n5484) | ⛔ 403 | ✅ 36 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-sweatshirts-n4922 |
| 목록 | oysho.com | firefox | shell | 200 |  | F5(BIG-IP): 쿠키 TS0105c744 / Akamai: 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_sv, 쿠키 bm_sz | www.oysho.com/gb/womens-sweatshirts-n4922 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-sweatshirts-n4922 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/dresses-jumpsuits-n4954 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-pants-n4813 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-pants-n4813 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-sports-t-shirts-n4764 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-sports-t-shirts-n4764 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/gb/womens-sports-tops-n5484 |
| 목록 | oysho.com | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: 화면 흔적 akamai-deny | www.oysho.com/us/womens-sports-tops-n5484 |

<details><summary>사유</summary>

- ba-sh.com — https://ba-sh.com/fr/en/trousers-jeans/?_gl=1*6jfisz*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MzUkajIyJGwwJGg1MzYzNDQ3NzQ.
  - playwright: ✅ 수집기 28개 · HTML 상품 링크 108 · 이미지 링크 32 · 글 14619자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
  - firefox: ✅ 수집기 28개 · HTML 상품 링크 108 · 이미지 링크 32 · 글 14616자 · 예 https://ba-sh.com/fr/en/p/cardigan-maja-multico-3667436072963.html
- ba-sh.com — https://ba-sh.com/us/trousers-jeans/
  - playwright: ✅ 수집기 31개 · HTML 상품 링크 107 · 이미지 링크 32 · 글 12662자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - firefox: ✅ 수집기 31개 · HTML 상품 링크 107 · 이미지 링크 32 · 글 12641자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
- ba-sh.com — https://ba-sh.com/us/pants-jeans/
  - playwright: ✅ 수집기 74개 · HTML 상품 링크 107 · 이미지 링크 31 · 글 12662자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
  - firefox: ✅ 수집기 74개 · HTML 상품 링크 107 · 이미지 링크 31 · 글 12641자 · 예 https://ba-sh.com/us/p/jeans-vana-bluejeans-3667436069666.html
- oysho.com — https://www.oysho.com/gb/womens-sweatshirts-n4922
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 0자
- oysho.com — https://www.oysho.com/us/womens-sweatshirts-n4922
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 39 · 이미지 링크 6 · 글 9793자
- oysho.com — https://www.oysho.com/gb/dresses-jumpsuits-n4954
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 47개 · HTML 상품 링크 48 · 이미지 링크 2 · 글 11956자 · 예 https://www.oysho.com/gb/perfectadapt-long-jumpsuit-with-contrast-stitching-l30792232
- oysho.com — https://www.oysho.com/us/dresses-jumpsuits-n4954
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 46 · 이미지 링크 12 · 글 12698자
- oysho.com — https://www.oysho.com/gb/womens-pants-n4813
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 93 · 이미지 링크 12 · 글 17025자
- oysho.com — https://www.oysho.com/us/womens-pants-n4813
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 33 · 이미지 링크 14 · 글 10291자
- oysho.com — https://www.oysho.com/gb/womens-sports-t-shirts-n4764
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 99 · 이미지 링크 5 · 글 16640자
- oysho.com — https://www.oysho.com/us/womens-sports-t-shirts-n4764
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 29 · 이미지 링크 5 · 글 10194자
- oysho.com — https://www.oysho.com/gb/womens-sports-tops-n5484
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 65 · 이미지 링크 5 · 글 13250자
- oysho.com — https://www.oysho.com/us/womens-sports-tops-n5484
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ HTML 상품 링크 36 · 이미지 링크 16 · 글 10697자

</details>
