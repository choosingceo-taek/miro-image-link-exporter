# 무료 크롤링 엔진 비교 (2026-11-25T09:13Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45582315366 · 러너 GitHub Actions 1000008396 · 나가는 IP 20.102.102.x · 2026-11-25T09:08Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 23쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 17 | 3 | 3 | 0 | 17·3 | 0·0 | 정상 · 23쪽 · 13s |
| site-api | 2 | 0 | 2 | 19 | 2·0 | 0·0 | 정상 · 23쪽 · 2s |
| wayback | 7 | 1 | 0 | 15 | 7·1 | 0·0 | 정상 · 23쪽 · 23s |
| playwright | 21 | 2 | 0 | 0 | 21·2 | 0·0 | 정상 · 23쪽 · 128s |
| firefox | 21 | 2 | 0 | 0 | 21·2 | 0·0 | 정상 · 23쪽 · 127s |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit | site-api | wayback | playwright | firefox |
|---|---|:-:|:-:|:-:|:-:|:-:|
| 상품 | [Wrap](https://www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-stone/TH87.A.html) | 🟡 | ❌ | ❌ | 🟡 | 🟡 |
| 상품 | [Wrap](https://www.wraplondon.com/jersey-tops/cotton-jersey-high-neck-sweatshirt-soft-slate-blue/TH89.B.html) | ✅ | ❌ | ❌ | ✅ | ✅ |
| 상품 | [Barbour](https://www.barbour.com/row/rosalie-t-shirt-LTS0730WH11.html) | ✅ | ❌ | ✅ | ✅ | ✅ |
| 상품 | [Barbour](https://www.barbour.com/row/niamh-logo-t-shirt-LTS0735WH11.html) | ✅ | ❌ | ✅ | ✅ | ✅ |
| 상품 | [CCC](https://www.crewclothing.co.uk/products/ultimate-breton-in-sand-and-white-stripes) | ✅ | ✅ | ❌ | ✅ | ✅ |
| 상품 | [CCC](https://www.crewclothing.co.uk/products/perfect-crew-slub-t-shirt-in-pink) | ✅ | ✅ | ❌ | ✅ | ✅ |
| 상품 | [Coldwatercreek](https://www.coldwatercreek.com/wintertide-waffle-tee/22279/) | ⛔ 403 | ❌ | 🟡 | 🟡 | 🟡 |
| 상품 | [Coldwatercreek](https://www.coldwatercreek.com/prancing-reindeer-embroidered-tee/26058/) | ⛔ 403 | ❌ | ❌ | ✅ | ✅ |
| 상품 | [Coldwatercreek](https://www.coldwatercreek.com/gilded-bow-ornament-tee/26059/) | ⛔ 403 | ❌ | ❌ | ✅ | ✅ |
| 상품 | [J crew](https://www.jcrew.com/m/womens/categories/clothing/matching-sets/MQ341) | ✅ | ❌ | ❌ | ✅ | ✅ |
| 상품 | [J crew](https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334) | 🟡 | ❌ | ❌ | ✅ | ✅ |
| 상품 | [J crew](https://www.jcrew.com/m/womens/categories/clothing/sweaters/crewneck/ME829) | 🟡 | ❌ | ✅ | ✅ | ✅ |
| 상품 | [Lucky Brand](https://www.luckybrand.com/brushed-boat-neck-banded-top/170762.html) | ✅ | ❌ | ❌ | ✅ | ✅ |
| 상품 | [Lucky Brand](https://www.luckybrand.com/lace-yoke-henley/169956.html) | ✅ | ❌ | ✅ | ✅ | ✅ |
| 상품 | [Me+Em](https://www.meandem.com/us/piped-fitted-t-shirt-soft-white-rich-olive-green) | ✅ | ❌ | ✅ | ✅ | ✅ |
| 상품 | [Me+Em](https://www.meandem.com/us/ultimate-fitted-rib-crew-neck-tee-black) | ✅ | ❌ | ✅ | ✅ | ✅ |
| 상품 | [On](https://www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/clay-apparel-1WG10375013) | ✅ | ⛔ 200 | ❌ | ✅ | ✅ |
| 상품 | [On](https://www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/cassis-apparel-1WG10375007) | ✅ | ⛔ 200 | ❌ | ✅ | ✅ |
| 상품 | [Poetry](https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html) | ✅ | ❌ | ❌ | ✅ | ✅ |
| 상품 | [Poetry](https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-blackberry/RW51.C.html) | ✅ | ❌ | ❌ | ✅ | ✅ |
| 상품 | [Poetry](https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-aqua-mist/RW51.D.html) | ✅ | ❌ | ❌ | ✅ | ✅ |
| 상품 | [Sweaty betty](https://www.sweatybetty.com/us/shop/tops/jackets/navigate-sherpa-longline-puffer-SB04475_Black.html) | ✅ | ❌ | ❌ | ✅ | ✅ |
| 상품 | [Sweaty betty](https://www.sweatybetty.com/us/shop/tops/jackets/nimbus-longline-waterproof-puffer-SB10381_Black.html) | ✅ | ❌ | ✅ | ✅ | ✅ |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 상품 | Wrap | impit | no-comp | 200 |  | 제목 "Wrap London - Tencel &amp; cotton stripe" · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_860804ea114f19df18e8851f0e, 쿠키 dwanonymous_5c6bc43bd463bf3a315146c1c7c0ab7f, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-s |
| 상품 | Wrap | site-api | error |  |  |  | www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-s |
| 상품 | Wrap | wayback | no-archive |  |  |  | www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-s |
| 상품 | Wrap | playwright | no-comp | 200 |  | 제목 "Wrap London - Tencel & cotton striped je" · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_860804ea114f19df18e8851f0e, 쿠키 dwanonymous_5c6bc43bd463bf3a315146c1c7c0ab7f, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-s |
| 상품 | Wrap | firefox | no-comp | 200 |  | 제목 "Wrap London - Tencel & cotton striped je" · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더, 쿠키 dwac_860804ea114f19df18e8851f0e, 쿠키 dwanonymous_5c6bc43bd463bf3a315146c1c7c0ab7f, 쿠키 __cq_dnt, 쿠키 dw_dnt | www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-s |
| 상품 | Wrap | site-api | error |  |  |  | www.wraplondon.com/jersey-tops/cotton-jersey-high-neck-sweatshirt-soft |
| 상품 | Wrap | wayback | no-archive |  |  |  | www.wraplondon.com/jersey-tops/cotton-jersey-high-neck-sweatshirt-soft |
| 상품 | Barbour | site-api | error |  |  |  | www.barbour.com/row/rosalie-t-shirt-LTS0730WH11.html |
| 상품 | Barbour | site-api | error |  |  |  | www.barbour.com/row/niamh-logo-t-shirt-LTS0735WH11.html |
| 상품 | CCC | wayback | no-archive |  |  |  | www.crewclothing.co.uk/products/ultimate-breton-in-sand-and-white-stri |
| 상품 | CCC | wayback | no-archive |  |  |  | www.crewclothing.co.uk/products/perfect-crew-slub-t-shirt-in-pink |
| 상품 | Coldwatercreek | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.coldwatercreek.com/wintertide-waffle-tee/22279/ |
| 상품 | Coldwatercreek | site-api | error |  |  |  | www.coldwatercreek.com/wintertide-waffle-tee/22279/ |
| 상품 | Coldwatercreek | wayback | no-comp |  |  |  | www.coldwatercreek.com/wintertide-waffle-tee/22279/ |
| 상품 | Coldwatercreek | playwright | no-comp | 200 |  | 제목 "Wintertide Waffle Tee - Coldwater Creek" · 흔적 cf-script·captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 불러온 주소 www.coldwatercreek.com/cdn-cgi/challenge-platform/ / Salesforce Commerce Cloud: 쿠키 dwac_860804ea114f19df18e8851f0e, 쿠키 dwanonymous_ | www.coldwatercreek.com/wintertide-waffle-tee/22279/ |
| 상품 | Coldwatercreek | firefox | no-comp | 200 |  | 제목 "Wintertide Waffle Tee - Coldwater Creek" · 흔적 cf-script·captcha · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 cf_clearance, 화면 흔적 cf-script, 불러온 주소 www.coldwatercreek.com/cdn-cgi/challenge-platform/ / Salesforce Commerce Cloud: 쿠키 dwac_860804ea114f19df18e8851f0e | www.coldwatercreek.com/wintertide-waffle-tee/22279/ |
| 상품 | Coldwatercreek | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.coldwatercreek.com/prancing-reindeer-embroidered-tee/26058/ |
| 상품 | Coldwatercreek | site-api | error |  |  |  | www.coldwatercreek.com/prancing-reindeer-embroidered-tee/26058/ |
| 상품 | Coldwatercreek | wayback | no-archive |  |  |  | www.coldwatercreek.com/prancing-reindeer-embroidered-tee/26058/ |
| 상품 | Coldwatercreek | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge | www.coldwatercreek.com/gilded-bow-ornament-tee/26059/ |
| 상품 | Coldwatercreek | site-api | error |  |  |  | www.coldwatercreek.com/gilded-bow-ornament-tee/26059/ |
| 상품 | Coldwatercreek | wayback | no-archive |  |  |  | www.coldwatercreek.com/gilded-bow-ornament-tee/26059/ |
| 상품 | J crew | site-api | error |  |  |  | www.jcrew.com/m/womens/categories/clothing/matching-sets/MQ341 |
| 상품 | J crew | wayback | no-archive |  |  |  | www.jcrew.com/m/womens/categories/clothing/matching-sets/MQ341 |
| 상품 | J crew | impit | no-comp | 200 |  | 제목 "Perfect Rib Long-sleeve T-shirt In Strip" · 흔적 notfound · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334 |
| 상품 | J crew | site-api | error |  |  |  | www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334 |
| 상품 | J crew | wayback | no-archive |  |  |  | www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334 |
| 상품 | J crew | impit | no-comp | 200 |  | 제목 "Studded Boyfriend Jersey Relaxed Long-sl" · 흔적 notfound · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.jcrew.com/m/womens/categories/clothing/sweaters/crewneck/ME829 |
| 상품 | J crew | site-api | error |  |  |  | www.jcrew.com/m/womens/categories/clothing/sweaters/crewneck/ME829 |
| 상품 | Lucky Brand | site-api | error |  |  |  | www.luckybrand.com/brushed-boat-neck-banded-top/170762.html |
| 상품 | Lucky Brand | wayback | no-archive |  |  |  | www.luckybrand.com/brushed-boat-neck-banded-top/170762.html |
| 상품 | Lucky Brand | site-api | error |  |  |  | www.luckybrand.com/lace-yoke-henley/169956.html |
| 상품 | Me+Em | site-api | error |  |  |  | www.meandem.com/us/piped-fitted-t-shirt-soft-white-rich-olive-green |
| 상품 | Me+Em | site-api | error |  |  |  | www.meandem.com/us/ultimate-fitted-rib-crew-neck-tee-black |
| 상품 | On | site-api | blocked | 200 | Cloudflare (낮음) | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 | www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/clay-apparel- |
| 상품 | On | wayback | no-archive |  |  |  | www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/clay-apparel- |
| 상품 | On | site-api | blocked | 200 | Cloudflare (낮음) | 이동 locale -→en-us · Cloudflare: cf-ray 헤더 | www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/cassis-appare |
| 상품 | On | wayback | no-archive |  |  |  | www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/cassis-appare |
| 상품 | Poetry | site-api | error |  |  |  | www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-m |
| 상품 | Poetry | wayback | no-archive |  |  |  | www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-m |
| 상품 | Poetry | site-api | error |  |  |  | www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-b |
| 상품 | Poetry | wayback | no-archive |  |  |  | www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-b |
| 상품 | Poetry | site-api | error |  |  |  | www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-a |
| 상품 | Poetry | wayback | no-archive |  |  |  | www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-a |
| 상품 | Sweaty betty | site-api | error |  |  |  | www.sweatybetty.com/us/shop/tops/jackets/navigate-sherpa-longline-puff |
| 상품 | Sweaty betty | wayback | no-archive |  |  |  | www.sweatybetty.com/us/shop/tops/jackets/navigate-sherpa-longline-puff |
| 상품 | Sweaty betty | site-api | error |  |  |  | www.sweatybetty.com/us/shop/tops/jackets/nimbus-longline-waterproof-pu |

<details><summary>사유</summary>

- Wrap — https://www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-stone/TH87.A.html
  - impit: 🟡 글 5048자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: 🟡 글 15571자
  - firefox: 🟡 글 15571자
- Wrap — https://www.wraplondon.com/jersey-tops/cotton-jersey-high-neck-sweatshirt-soft-slate-blue/TH89.B.html
  - impit: ✅ Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- Barbour — https://www.barbour.com/row/rosalie-t-shirt-LTS0730WH11.html
  - impit: ✅ Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260914 보관본 · Cotton 100%
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- Barbour — https://www.barbour.com/row/niamh-logo-t-shirt-LTS0735WH11.html
  - impit: ✅ Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20261107 보관본 · Cotton 100%
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- CCC — https://www.crewclothing.co.uk/products/ultimate-breton-in-sand-and-white-stripes
  - impit: ✅ Cotton 100%
  - site-api: ✅ Cotton 100%
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- CCC — https://www.crewclothing.co.uk/products/perfect-crew-slub-t-shirt-in-pink
  - impit: ✅ Cotton 100%
  - site-api: ✅ Cotton 100%
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- Coldwatercreek — https://www.coldwatercreek.com/wintertide-waffle-tee/22279/
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: 🟡 20260517 보관본 · 글 7744자
  - playwright: 🟡 글 16448자
  - firefox: 🟡 글 16437자
- Coldwatercreek — https://www.coldwatercreek.com/prancing-reindeer-embroidered-tee/26058/
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- Coldwatercreek — https://www.coldwatercreek.com/gilded-bow-ornament-tee/26059/
  - impit: ⛔ HTTP 403 Just a moment...
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- J crew — https://www.jcrew.com/m/womens/categories/clothing/matching-sets/MQ341
  - impit: ✅ Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- J crew — https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334
  - impit: 🟡 글 9556자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Cotton 57% / Lyocell 39% / Elastane 4%
  - firefox: ✅ Cotton 57% / Lyocell 39% / Elastane 4%
- J crew — https://www.jcrew.com/m/womens/categories/clothing/sweaters/crewneck/ME829
  - impit: 🟡 글 8846자
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260213 보관본 · Cotton 100%
  - playwright: ✅ Cotton 100%
  - firefox: ✅ Cotton 100%
- Lucky Brand — https://www.luckybrand.com/brushed-boat-neck-banded-top/170762.html
  - impit: ✅ Polyester 63% / Viscose 33% / Elastane 4%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Polyester 63% / Viscose 33% / Elastane 4%
  - firefox: ✅ Polyester 63% / Viscose 33% / Elastane 4%
- Lucky Brand — https://www.luckybrand.com/lace-yoke-henley/169956.html
  - impit: ✅ Cotton 95% / Elastane 5%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260808 보관본 · Cotton 95% / Elastane 5%
  - playwright: ✅ Cotton 95% / Elastane 5%
  - firefox: ✅ Cotton 95% / Elastane 5%
- Me+Em — https://www.meandem.com/us/piped-fitted-t-shirt-soft-white-rich-olive-green
  - impit: ✅ Cotton 52% / Modal 48% / Cotton 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260809 보관본 · Cotton 52% / Modal 48% / Cotton 100%
  - playwright: ✅ Cotton 52% / Modal 48% / Cotton 100%
  - firefox: ✅ Cotton 52% / Modal 48% / Cotton 100%
- Me+Em — https://www.meandem.com/us/ultimate-fitted-rib-crew-neck-tee-black
  - impit: ✅ Cotton 97% / Elastane 3%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260812 보관본 · Cotton 97% / Elastane 3%
  - playwright: ✅ Cotton 97% / Elastane 3%
  - firefox: ✅ Cotton 97% / Elastane 3%
- On — https://www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/clay-apparel-1WG10375013
  - impit: ✅ Polyester 91% / Elastane 9%
  - site-api: ⛔ HTTP 200 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Polyester 91% / Elastane 9%
  - firefox: ✅ Polyester 91% / Elastane 9%
- On — https://www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/cassis-apparel-1WG10375007
  - impit: ✅ Polyester 91% / Elastane 9%
  - site-api: ⛔ HTTP 200 · JSON 아님
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Polyester 91% / Elastane 9%
  - firefox: ✅ Polyester 91% / Elastane 9%
- Poetry — https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html
  - impit: ✅ Silk 55% / Cotton 45%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Silk 55% / Cotton 45%
  - firefox: ✅ Silk 55% / Cotton 45%
- Poetry — https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-blackberry/RW51.C.html
  - impit: ✅ Silk 55% / Cotton 45%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Silk 55% / Cotton 45%
  - firefox: ✅ Silk 55% / Cotton 45%
- Poetry — https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-aqua-mist/RW51.D.html
  - impit: ✅ Silk 55% / Cotton 45%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Silk 55% / Cotton 45%
  - firefox: ✅ Silk 55% / Cotton 45%
- Sweaty betty — https://www.sweatybetty.com/us/shop/tops/jackets/navigate-sherpa-longline-puffer-SB04475_Black.html
  - impit: ✅ Polyester 100% / Nylon 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ❌ 보관본 없음
  - playwright: ✅ Polyester 100% / Nylon 100%
  - firefox: ✅ Polyester 100% / Nylon 100%
- Sweaty betty — https://www.sweatybetty.com/us/shop/tops/jackets/nimbus-longline-waterproof-puffer-SB10381_Black.html
  - impit: ✅ Polyester 100%
  - site-api: ❌ 이 사이트용 JSON 주소를 모름
  - wayback: ✅ 20260611 보관본 · Polyester 100%
  - playwright: ✅ Polyester 100%
  - firefox: ✅ Polyester 100%

</details>
