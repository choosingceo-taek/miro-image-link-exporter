# 무료 크롤링 엔진 비교 (2026-11-25T10:07Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

- 실행 45584342647 · 러너 GitHub Actions 1000008405 · 나가는 IP 20.55.223.x · 2026-11-25T09:21Z

✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 0쪽 ✅·🟡 | 목록 84쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| impit | 25 | 24 | 35 | 0 | 0·0 | 25·24 | 정상 · 84쪽 · 59s |
| playwright | 38 | 1 | 40 | 5 | 0·0 | 38·1 | 정상 · 84쪽 · 1068s |
| firefox | 43 | 1 | 40 | 0 | 0·0 | 43·1 | 정상 · 84쪽 · 767s |
| firefox-fresh | 47 | 3 | 34 | 0 | 0·0 | 47·3 | 정상 · 84쪽 · 867s |

## 페이지별

목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.

| 구분 | 브랜드 | impit | playwright | firefox | firefox-fresh |
|---|---|:-:|:-:|:-:|:-:|
| 목록 | [&Other Stories](https://www.stories.com/en-us/clothing/tops/) | ✅ 37 | ⛔ 403 | ✅ 48 | ✅ 48 |
| 목록 | [&Other Stories](https://www.stories.com/en-us/clothing/tops/sweatshirts-hoodies/) | ✅ 6 | ⛔ 403 | ✅ 12 | ✅ 12 |
| 목록 | [&Other Stories](https://www.stories.com/en-us/clothing/blouses-shirts/) | ✅ 36 | ⛔ 403 | ✅ 46 | ✅ 46 |
| 목록 | [Addidas](https://www.adidas.com/us/women-tops?sort=newest-to-oldest) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Addidas](https://www.adidas.com/us/women-hoodies_sweatshirts) | ⛔ 403 | ❌ | ⛔ 403 | ⛔ 403 |
| 목록 | [Addidas](https://www.adidas.com/us/women-skirts_dresses) | ⛔ 403 | ❌ | ⛔ 403 | ⛔ 403 |
| 목록 | [Anthropologie](https://www.anthropologie.com/tees) | ⛔ 403 | ⛔ 403 | ✅ 5 | ⛔ 403 |
| 목록 | [Anthropologie](https://www.anthropologie.com/tops-sweatshirts) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Anthropologie](https://www.anthropologie.com/tops) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Arket](https://www.arket.com/en-ww/women/clothing/tops/) | ✅ 48 | ⛔ 403 | ✅ 48 | ✅ 48 |
| 목록 | [Arket](https://www.arket.com/en-ww/women/clothing/tops/t-shirts/) | ✅ 48 | ⛔ 403 | ✅ 48 | ✅ 48 |
| 목록 | [Arket](https://www.arket.com/en-ww/women/clothing/sweatshirts-and-hoodies/) | ✅ 33 | ⛔ 403 | ✅ 32 | ✅ 32 |
| 목록 | [Banana Republic](https://bananarepublic.gap.com/browse/women/t-shirts?cid=1055063&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3AT-Shirts+%26+Tanks#department=136) | 🟡 0 | ✅ 5 | ✅ 5 | ✅ 5 |
| 목록 | [Banana Republic](https://bananarepublic.gap.com/browse/women/tops-and-blouses?cid=5037&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3ATops+%26+Shirts#department=136) | 🟡 0 | ✅ 5 | ✅ 5 | ✅ 5 |
| 목록 | [Banana Republic](https://bananarepublic.gap.com/browse/women/dresses-and-jumpsuits?cid=69883&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3ADresses+%26+Jumpsuits#department=136) | 🟡 0 | ✅ 5 | ✅ 5 | ✅ 5 |
| 목록 | [Banana Republic](https://bananarepublic.gap.com/browse/women/pants?cid=67595&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3APants#department=136) | 🟡 0 | ✅ 5 | ✅ 5 | ✅ 5 |
| 목록 | [FP Movement](https://www.freepeople.com/fpmovement/workout-tops/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [FP Movement](https://www.freepeople.com/fpmovement/hoodies-sweatshirts/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [FP Movement](https://www.freepeople.com/fpmovement/one-pieces/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Free People](https://www.freepeople.com/tops/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Free People](https://www.freepeople.com/sweatshirts-pullovers/?vis_nav=4) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Free People](https://www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&topper=2) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Garnet hill](https://www.garnethill.com/clothing/categories/tops-tees/) | 🟡 0 | ⛔ 403 | ✅ 7 | ✅ 7 |
| 목록 | [Garnet hill](https://www.garnethill.com/clothing/categories/tops-tees/facet/f_style_uFilter/Shirts__sp__am__spBlouses?categoryId=191619) | 🟡 0 | ⛔ 403 | ⛔ 403 | ✅ 7 |
| 목록 | [Garnet hill](https://www.garnethill.com/clothing/categories/dresses/) | 🟡 0 | ⛔ 403 | ⛔ 403 | ✅ 10 |
| 목록 | [Joules](https://www.joules.com/shop/womens/clothing/tops) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Joules](https://www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Joules](https://www.joules.com/shop/womens/clothing/shirts-and-blouses) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Lands end](https://www.landsend.com/shop/womens-tops/S-xfe-xez-y5c-xec) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Lands end](https://www.landsend.com/shop/womens-sweatshirts-hoodies-tops-tees/S-xfe-16na-xez-y5c-xh1-y0d-xec) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Lands end](https://www.landsend.com/shop/womens-shirts-blouses-tops/S-xfe-xez-y5c-yql-xec) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Lululemon](https://shop.lululemon.com/c/women-t-shirts/n1wx7w) | ⛔ 403 | ❌ | ⛔ 403 | ⛔ 403 |
| 목록 | [Lululemon](https://shop.lululemon.com/c/women-tank-tops/n1uk4w) | ⛔ 403 | ❌ | ⛔ 403 | ⛔ 403 |
| 목록 | [Lululemon](https://shop.lululemon.com/c/women-hoodies-and-sweatshirts/n1jux6) | ⛔ 403 | ❌ | ⛔ 403 | ⛔ 403 |
| 목록 | [Mango](https://shop.mango.com/us/en/c/women/t-shirts/8e23bdfb) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [Mango](https://shop.mango.com/us/en/c/women/tops/227371cd) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [Mango](https://shop.mango.com/us/en/c/women/knitwear/7e46863e) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [Old Navy](https://oldnavy.gap.com/browse/women/t-shirts?cid=1035712&nav=meganav%3AWomen%3AWomen%E2%80%99s+Tops%3AT-shirts+%26+Tanks#department=136) | 🟡 0 | ✅ 10 | ✅ 11 | ✅ 11 |
| 목록 | [Old Navy](https://oldnavy.gap.com/browse/women/sweatshirts-and-hoodies?cid=3044037&nav=meganav%3AWomen%3AWomen%E2%80%99s%20Tops%3ASweatshirts%20%26%20Hoodies#department=136) | 🟡 0 | ✅ 10 | ✅ 11 | ✅ 11 |
| 목록 | [Old Navy](https://oldnavy.gap.com/browse/women/all-tops?cid=72091&nav=meganav%3AWomen%3AWomen%E2%80%99s+Tops%3AAll+Tops&tid=ON_WMNS_TOPS#department=136&style=1166604&banner=vi_tops_w_blouses_click) | 🟡 0 | ✅ 10 | ✅ 11 | ✅ 11 |
| 목록 | [Old Navy](https://oldnavy.gap.com/browse/women/dresses-and-jumpsuits?cid=15292&nav=meganav%3AWomen%3AShop%20Women%27s%20Categories%3ADresses%20%26%20Jumpsuits) | 🟡 0 | ✅ 10 | ✅ 11 | ✅ 11 |
| 목록 | [Old Navy](https://oldnavy.gap.com/browse/women/sweatpants?cid=3044038&nav=meganav%3AWomen%3AWomen%27s%20Bottoms%3ASweatpants#department=136) | 🟡 0 | ✅ 10 | ✅ 11 | ✅ 11 |
| 목록 | [Paige](https://paige.com/collection/women-tees-and-tanks) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [Paige](https://paige.com/collection/women-sweaters-and-sweatshirts) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [Paige](https://paige.com/collection/women-tops) | ⛔ 429 | ⛔ 429 | ⛔ 429 | ⛔ 429 |
| 목록 | [Seasalt cornwall](https://www.seasaltcornwall.com/clothing/tops) | ✅ 35 | ✅ 59 | ✅ 59 | ✅ 59 |
| 목록 | [Seasalt cornwall](https://www.seasaltcornwall.com/clothing/jumpers-cardigans) | ✅ 36 | ✅ 59 | ✅ 59 | ✅ 59 |
| 목록 | [Seasalt cornwall](https://www.seasaltcornwall.com/clothing/shirts-blouses) | ✅ 35 | ✅ 60 | ✅ 60 | ✅ 60 |
| 목록 | [The white company](https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts) | 🟡 0 | 🟡 0 | 🟡 0 | 🟡 0 |
| 목록 | [The white company](https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear) | 🟡 0 | ⛔ 404 | ⛔ 404 | 🟡 0 |
| 목록 | [The white company](https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tunics) | 🟡 0 | ⛔ 404 | ⛔ 404 | 🟡 0 |
| 목록 | [Wilson](https://www.wilson.com/en-us/sportswear/women/tops/tanks) | ✅ 15 | ✅ 28 | ⛔ 403 | ✅ 24 |
| 목록 | [Wilson](https://www.wilson.com/en-us/sportswear/women/tops/short-sleeve-tops) | ✅ 11 | ✅ 24 | ✅ 24 | ⛔ 403 |
| 목록 | [Wilson](https://www.wilson.com/en-us/sportswear/women/tops/long-sleeve-tops) | ✅ 15 | ✅ 26 | ✅ 26 | ⛔ 403 |
| 목록 | [Prana](https://www.prana.com/women/tops.html) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Prana](https://www.prana.com/women/tops/sweaters-hoodies.html) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Prana](https://www.prana.com/women/dresses-skirts.html) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Prana](https://www.prana.com/women/bottoms.html) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ⛔ 403 |
| 목록 | [Dickies](https://www.dickies.com/collections/womens-tops) | ✅ 46 | ✅ 90 | ⛔ 403 | ✅ 90 |
| 목록 | [Dickies](https://www.dickies.com/en-us/collections/womens-hoodies) | ✅ 49 | ✅ 50 | ✅ 50 | ✅ 50 |
| 목록 | [Dickies](https://www.dickies.com/en-us/collections/womens-shirt-jackets) | ✅ 48 | ✅ 49 | ✅ 49 | ✅ 49 |
| 목록 | [Good American](https://www.goodamerican.com/en-kr/collections/tees-tanks) | 🟡 0 | ✅ 136 | ⛔ 403 | ⛔ 403 |
| 목록 | [Good American](https://www.goodamerican.com/collections/jeanius-sweats) | 🟡 0 | ✅ 43 | ✅ 45 | ✅ 45 |
| 목록 | [Good American](https://www.goodamerican.com/en-kr/collections/womens-tops) | 🟡 1 | ✅ 353 | ✅ 73 | ✅ 74 |
| 목록 | [Nation LTD](https://nation.la/collections/tops) | ✅ 52 | ✅ 35 | ✅ 35 | ✅ 35 |
| 목록 | [Nation LTD](https://nation.la/collections/sweatshirts) | ✅ 48 | ✅ 24 | ✅ 24 | ✅ 24 |
| 목록 | [Nation LTD](https://nation.la/collections/dresses) | ✅ 47 | ✅ 22 | ✅ 22 | ✅ 22 |
| 목록 | [vineyardvines](https://www.vineyardvines.com/category/womens-tees-tanks?nav=home--top_nav--Womens--womens-clothing--9) | 🟡 0 | ✅ 6 | ✅ 6 | ✅ 6 |
| 목록 | [vineyardvines](https://www.vineyardvines.com/category/women-sweatshirts?nav=category--top_nav--Womens--womens-clothing--3) | 🟡 4 | ✅ 10 | ✅ 10 | ✅ 10 |
| 목록 | [vineyardvines](https://www.vineyardvines.com/category/Womens-Shirts-Tunics?nav=category--top_nav--Womens--womens-clothing--7) | 🟡 0 | ✅ 8 | ✅ 8 | ✅ 8 |
| 목록 | [Bash](https://ba-sh.com/fr/en/t-shirts/?_gl=1*18k9v40*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ1OTckajYwJGwwJGg1MzYzNDQ3NzQ.) | ✅ 51 | ✅ 34 | ✅ 34 | ✅ 34 |
| 목록 | [Bash](https://ba-sh.com/fr/en/sweatshirts/?_gl=1*6lpw8g*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MjMkajM0JGwwJGg1MzYzNDQ3NzQ.) | ✅ 54 | ✅ 36 | ✅ 36 | ✅ 33 |
| 목록 | [Bash](https://ba-sh.com/fr/en/tops-shirts/?_gl=1*wv5ete*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTEkajQ2JGwwJGg1MzYzNDQ3NzQ.) | ✅ 87 | ✅ 65 | ✅ 61 | ✅ 61 |
| 목록 | [The Great](https://thisisthegreat.com/collections/the-great-knits) | 🟡 1 | ✅ 267 | ✅ 267 | ✅ 267 |
| 목록 | [The Great](https://thisisthegreat.com/collections/knit-shop-sweatshirts) | 🟡 1 | ✅ 103 | ✅ 103 | ✅ 103 |
| 목록 | [The Great](https://thisisthegreat.com/collections/tops) | 🟡 1 | ✅ 42 | ✅ 42 | ✅ 42 |
| 목록 | [The upside](https://www.theupside.com/shop/tops/) | ⛔ 403 | ✅ 69 | ✅ 68 | ✅ 68 |
| 목록 | [The upside](https://www.theupside.com/shop/tops/knitwear/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ✅ 56 |
| 목록 | [The upside](https://www.theupside.com/shop/all-in-one/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ✅ 30 |
| 목록 | [The upside](https://www.theupside.com/shop/bottoms/) | ⛔ 403 | ⛔ 403 | ⛔ 403 | ✅ 68 |
| 목록 | [Carlhartt](https://www.carhartt.com/c/women-tops-tshirt) | ✅ 25 | ✅ 78 | ✅ 78 | ✅ 78 |
| 목록 | [Carlhartt](https://www.carhartt.com/c/women-hoodies-sweatshirts) | ✅ 26 | ✅ 78 | ✅ 78 | ✅ 78 |
| 목록 | [Aerie](https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031) | ✅ 30 | ✅ 48 | ✅ 48 | ✅ 48 |
| 목록 | [Aerie](https://www.ae.com/us/en/c/aerie/tops/hoodies-sweatshirts/cat7030169) | ✅ 30 | ✅ 46 | ✅ 46 | ✅ 46 |

## 원인 근거(성공이 아닌 칸만)

원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.

차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.

| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |
|---|---|---|---|---:|---|---|---|
| 목록 | &Other Stories | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.stories.com/en-us/clothing/tops/ |
| 목록 | &Other Stories | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_lso, 화면 흔적 akamai-deny / DataDome: 쿠키 datadome | www.stories.com/en-us/clothing/tops/sweatshirts-hoodies/ |
| 목록 | &Other Stories | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.stories.com/en-us/clothing/blouses-shirts/ |
| 목록 | Addidas | impit | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.adidas.com/us/women-tops?sort=newest-to-oldest |
| 목록 | Addidas | playwright | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: server: AkamaiNetStorage, 화면 흔적 akamai-deny | www.adidas.com/us/women-tops?sort=newest-to-oldest |
| 목록 | Addidas | firefox | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.adidas.com/us/women-tops?sort=newest-to-oldest |
| 목록 | Addidas | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.adidas.com/us/women-tops?sort=newest-to-oldest |
| 목록 | Addidas | impit | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.adidas.com/us/women-hoodies_sweatshirts |
| 목록 | Addidas | playwright | conn-drop |  |  |  | www.adidas.com/us/women-hoodies_sweatshirts |
| 목록 | Addidas | firefox | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.adidas.com/us/women-hoodies_sweatshirts |
| 목록 | Addidas | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.adidas.com/us/women-hoodies_sweatshirts |
| 목록 | Addidas | impit | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.adidas.com/us/women-skirts_dresses |
| 목록 | Addidas | playwright | conn-drop |  |  |  | www.adidas.com/us/women-skirts_dresses |
| 목록 | Addidas | firefox | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.adidas.com/us/women-skirts_dresses |
| 목록 | Addidas | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "adidas" · 흔적 akamai-deny · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.adidas.com/us/women-skirts_dresses |
| 목록 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/tees |
| 목록 | Anthropologie | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tees |
| 목록 | Anthropologie | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tees |
| 목록 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/tops-sweatshirts |
| 목록 | Anthropologie | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc / Akamai: 쿠키 bm_lso | www.anthropologie.com/tops-sweatshirts |
| 목록 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/6f3df25c27d88c50.js / Shopify: 쿠키 _shopify_essenti | www.anthropologie.com/tops-sweatshirts |
| 목록 | Anthropologie | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops-sweatshirts |
| 목록 | Anthropologie | impit | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.anthropologie.com/tops |
| 목록 | Anthropologie | playwright | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.anthropologie.com/tops |
| 목록 | Anthropologie | firefox | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/c6b1bb0a77bbd655.js / Shopify: 쿠키 _shopify_essenti | www.anthropologie.com/tops |
| 목록 | Anthropologie | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "anthropologie.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.anthropologie.com/tops |
| 목록 | Arket | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / DataDome: 쿠키 datadome | www.arket.com/en-ww/women/clothing/tops/ |
| 목록 | Arket | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_lso, 화면 흔적 akamai-deny | www.arket.com/en-ww/women/clothing/tops/t-shirts/ |
| 목록 | Arket | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.arket.com/en-ww/women/clothing/sweatshirts-and-hoodies/ |
| 목록 | Banana Republic | impit | no-cards | 200 |  | 제목 "Women&#x27;s T-Shirts &amp; Tees / Banan" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | bananarepublic.gap.com/browse/women/t-shirts?cid=1055063&nav=meganav%3 |
| 목록 | Banana Republic | impit | no-cards | 200 |  | 제목 "Women&#x27;s Tops &amp; Blouses / Banana" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | bananarepublic.gap.com/browse/women/tops-and-blouses?cid=5037&nav=mega |
| 목록 | Banana Republic | impit | no-cards | 200 |  | 제목 "Women&#x27;s Dresses / Banana Republic" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | bananarepublic.gap.com/browse/women/dresses-and-jumpsuits?cid=69883&na |
| 목록 | Banana Republic | impit | no-cards | 200 |  | 제목 "Women&#x27;s Pants / Banana Republic" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | bananarepublic.gap.com/browse/women/pants?cid=67595&nav=meganav%3AWOME |
| 목록 | FP Movement | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | FP Movement | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | FP Movement | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/b4af093e2c58cc7f.js / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키  | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | FP Movement | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/fpmovement/workout-tops/ |
| 목록 | FP Movement | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | FP Movement | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | FP Movement | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/6f3df25c27d88c50.js / Shopify: 쿠키 _shopify_essential, | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | FP Movement | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/fpmovement/hoodies-sweatshirts/ |
| 목록 | FP Movement | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | FP Movement | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | FP Movement | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/da36c05dadf821af.js / Shopify: 쿠키 _shopify_essential, | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | FP Movement | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/fpmovement/one-pieces/ |
| 목록 | Free People | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/tops/ |
| 목록 | Free People | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/tops/ |
| 목록 | Free People | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/da36c05dadf821af.js / Shopify: 쿠키 _shopify_essential, | www.freepeople.com/tops/ |
| 목록 | Free People | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/tops/ |
| 목록 | Free People | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | Free People | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | Free People | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/5e1e29c5dc850c7b.js / Shopify: 쿠키 _shopify_essential, | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | Free People | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/sweatshirts-pullovers/?vis_nav=4 |
| 목록 | Free People | impit | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | Free People | playwright | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 static.captcha-delivery.com/captcha/assets/tpl/6dc | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | Free People | firefox | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/, 불러온 주소 ct.captcha-delivery.com/5e1e29c5dc850c7b.js / Shopify: 쿠키 _shopify_essential, | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | Free People | firefox-fresh | blocked | 403 | DataDome (높음) | 제목 "freepeople.com" · 흔적 datadome-challenge · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge, 불러온 주소 ct.captcha-delivery.com/c.js, 불러온 주소 geo.captcha-delivery.com/captcha/ | www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&toppe |
| 목록 | Garnet hill | impit | shell | 200 |  | 제목 "Women's Shirts, Tops & Tees" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/clothing/categories/tops-tees/ |
| 목록 | Garnet hill | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 화면 흔적 akamai-deny / DataDome: 쿠키 datadome | www.garnethill.com/clothing/categories/tops-tees/ |
| 목록 | Garnet hill | impit | shell | 200 |  | 제목 "Women's Shirts, Tops & Tees" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/clothing/categories/tops-tees/facet/f_style_uFilter |
| 목록 | Garnet hill | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.garnethill.com/clothing/categories/tops-tees/facet/f_style_uFilter |
| 목록 | Garnet hill | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.garnethill.com/clothing/categories/tops-tees/facet/f_style_uFilter |
| 목록 | Garnet hill | impit | shell | 200 |  | 제목 "Dresses For Women" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_mi, 쿠키 bm_s | www.garnethill.com/clothing/categories/dresses/ |
| 목록 | Garnet hill | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny | www.garnethill.com/clothing/categories/dresses/ |
| 목록 | Garnet hill | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.garnethill.com/clothing/categories/dresses/ |
| 목록 | Joules | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/tops |
| 목록 | Joules | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 화면 흔적 akamai-deny / DataDome: 쿠키 datadome | www.joules.com/shop/womens/clothing/tops |
| 목록 | Joules | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.joules.com/shop/womens/clothing/tops |
| 목록 | Joules | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/tops |
| 목록 | Joules | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Joules | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Joules | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Joules | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies |
| 목록 | Joules | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | Joules | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | Joules | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | Joules | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.joules.com/shop/womens/clothing/shirts-and-blouses |
| 목록 | Lands end | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/shop/womens-tops/S-xfe-xez-y5c-xec |
| 목록 | Lands end | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 화면 흔적 akamai-deny / DataDome: 쿠키 datadome | www.landsend.com/shop/womens-tops/S-xfe-xez-y5c-xec |
| 목록 | Lands end | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.landsend.com/shop/womens-tops/S-xfe-xez-y5c-xec |
| 목록 | Lands end | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.landsend.com/shop/womens-tops/S-xfe-xez-y5c-xec |
| 목록 | Lands end | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/shop/womens-sweatshirts-hoodies-tops-tees/S-xfe-16na- |
| 목록 | Lands end | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.landsend.com/shop/womens-sweatshirts-hoodies-tops-tees/S-xfe-16na- |
| 목록 | Lands end | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.landsend.com/shop/womens-sweatshirts-hoodies-tops-tees/S-xfe-16na- |
| 목록 | Lands end | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.landsend.com/shop/womens-sweatshirts-hoodies-tops-tees/S-xfe-16na- |
| 목록 | Lands end | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | www.landsend.com/shop/womens-shirts-blouses-tops/S-xfe-xez-y5c-yql-xec |
| 목록 | Lands end | playwright | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny | www.landsend.com/shop/womens-shirts-blouses-tops/S-xfe-xez-y5c-yql-xec |
| 목록 | Lands end | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.landsend.com/shop/womens-shirts-blouses-tops/S-xfe-xez-y5c-yql-xec |
| 목록 | Lands end | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | www.landsend.com/shop/womens-shirts-blouses-tops/S-xfe-xez-y5c-yql-xec |
| 목록 | Lululemon | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | shop.lululemon.com/c/women-t-shirts/n1wx7w |
| 목록 | Lululemon | playwright | conn-drop |  |  |  | shop.lululemon.com/c/women-t-shirts/n1wx7w |
| 목록 | Lululemon | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | shop.lululemon.com/c/women-t-shirts/n1wx7w |
| 목록 | Lululemon | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck | shop.lululemon.com/c/women-t-shirts/n1wx7w |
| 목록 | Lululemon | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | shop.lululemon.com/c/women-tank-tops/n1uk4w |
| 목록 | Lululemon | playwright | conn-drop |  |  |  | shop.lululemon.com/c/women-tank-tops/n1uk4w |
| 목록 | Lululemon | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | shop.lululemon.com/c/women-tank-tops/n1uk4w |
| 목록 | Lululemon | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck | shop.lululemon.com/c/women-tank-tops/n1uk4w |
| 목록 | Lululemon | impit | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz | shop.lululemon.com/c/women-hoodies-and-sweatshirts/n1jux6 |
| 목록 | Lululemon | playwright | conn-drop |  |  |  | shop.lululemon.com/c/women-hoodies-and-sweatshirts/n1jux6 |
| 목록 | Lululemon | firefox | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 화면 흔적 akamai-deny / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | shop.lululemon.com/c/women-hoodies-and-sweatshirts/n1jux6 |
| 목록 | Lululemon | firefox-fresh | blocked | 403 | Akamai (높음) | 제목 "Access Denied" · 흔적 akamai-deny·access-denied · Akamai: server: AkamaiGHost, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 _abck | shop.lululemon.com/c/women-hoodies-and-sweatshirts/n1jux6 |
| 목록 | Mango | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | Mango | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / DataDome: 쿠키 datadome / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | Mango | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc, 쿠키 _abck | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | Mango | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb |
| 목록 | Mango | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | Mango | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | Mango | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | Mango | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/tops/227371cd |
| 목록 | Mango | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | Mango | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | Mango | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | Mango | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | shop.mango.com/us/en/c/women/knitwear/7e46863e |
| 목록 | Old Navy | impit | no-cards | 200 |  | 제목 "Women&#x27;s T-Shirts / Old Navy" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | oldnavy.gap.com/browse/women/t-shirts?cid=1035712&nav=meganav%3AWomen% |
| 목록 | Old Navy | impit | no-cards | 200 |  | 제목 "Women&#x27;s Sweatshirts &amp; Hoodies /" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | oldnavy.gap.com/browse/women/sweatshirts-and-hoodies?cid=3044037&nav=m |
| 목록 | Old Navy | impit | no-cards | 200 |  | 제목 "Women&#x27;s Tops / Old Navy" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | oldnavy.gap.com/browse/women/all-tops?cid=72091&nav=meganav%3AWomen%3A |
| 목록 | Old Navy | impit | no-cards | 200 |  | 제목 "Women&#x27;s Dresses / Old Navy" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | oldnavy.gap.com/browse/women/dresses-and-jumpsuits?cid=15292&nav=megan |
| 목록 | Old Navy | impit | no-cards | 200 |  | 제목 "Women Sweatpants / Old Navy" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_mi, 쿠키 bm_s, 쿠키 bm_so | oldnavy.gap.com/browse/women/sweatpants?cid=3044038&nav=meganav%3AWome |
| 목록 | Paige | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tees-and-tanks |
| 목록 | Paige | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / DataDome: 쿠키 datadome / Akamai: 쿠키 bm_lso | paige.com/collection/women-tees-and-tanks |
| 목록 | Paige | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / Akamai: 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc, 쿠키 bm_sv | paige.com/collection/women-tees-and-tanks |
| 목록 | Paige | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tees-and-tanks |
| 목록 | Paige | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | Paige | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | Paige | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | Paige | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-sweaters-and-sweatshirts |
| 목록 | Paige | impit | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tops |
| 목록 | Paige | playwright | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tops |
| 목록 | Paige | firefox | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | paige.com/collection/women-tops |
| 목록 | Paige | firefox-fresh | blocked | 429 | Vercel (높음) | 제목 "Vercel Security Checkpoint" · 흔적 vercel-checkpoint · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint | paige.com/collection/women-tops |
| 목록 | The white company | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | The white company | playwright | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_lso / DataDome: 쿠키 datadome | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | The white company | firefox | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 bm_so, 쿠키 bm_sz, 쿠키 bm_lso, 쿠키 ak_bmsc | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | The white company | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and- |
| 목록 | The white company | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear |
| 목록 | The white company | playwright | blocked | 404 | Akamai (낮음) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더 | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear |
| 목록 | The white company | firefox | blocked | 404 | Akamai (낮음) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear |
| 목록 | The white company | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear |
| 목록 | The white company | impit | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 ak_bmsc, 쿠키 bm_sz | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | The white company | playwright | blocked | 404 | Akamai (낮음) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더 | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | The white company | firefox | blocked | 404 | Akamai (낮음) | 제목 "Page Not Found / The White Company US" · 흔적 notfound · Akamai: x-akamai-* 헤더 / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | The white company | firefox-fresh | geo | 200 |  | 제목 "The White Company - US" · 이동 locale uk→us · 흔적 geo · Akamai: x-akamai-* 헤더, 쿠키 ak_bmsc, 쿠키 bm_sz, 쿠키 _abck | www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tu |
| 목록 | Wilson | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 이동 path · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.wilson.com/cdn-cgi/challenge-platform/h/b/orch, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Akamai: 쿠키 bm | www.wilson.com/en-us/sportswear/women/tops/tanks |
| 목록 | Wilson | firefox-fresh | blocked | 403 | Cloudflare (중간) | 제목 "Verify your browser" · 이동 path · 흔적 captcha·js-shell · Cloudflare: cf-ray 헤더, 불러온 주소 challenges.cloudflare.com/turnstile/v0/api.js, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0, 불러온 주소 challenges.cloudflare.com/cdn-cgi/challenge-platfo, 불러온 주소 | www.wilson.com/en-us/sportswear/women/tops/short-sleeve-tops |
| 목록 | Wilson | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 이동 path · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.wilson.com/cdn-cgi/challenge-platform/h/b/orch, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Shopify: 쿠키 _ | www.wilson.com/en-us/sportswear/women/tops/long-sleeve-tops |
| 목록 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 화면 흔적 cf-block | www.prana.com/women/tops.html |
| 목록 | Prana | playwright | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-script · Cloudflare: cf-ray 헤더, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/h/b/scrip, 불러온 주소 www.prana.com/ | www.prana.com/women/tops.html |
| 목록 | Prana | firefox | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-script · Cloudflare: cf-ray 헤더, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/h/b/scrip, 불러온 주소 www.prana.com/ | www.prana.com/women/tops.html |
| 목록 | Prana | firefox-fresh | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 cf_clearance, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠키 _px3, 쿠 | www.prana.com/women/tops.html |
| 목록 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 화면 흔적 cf-block | www.prana.com/women/tops/sweaters-hoodies.html |
| 목록 | Prana | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block | www.prana.com/women/tops/sweaters-hoodies.html |
| 목록 | Prana | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency, 쿠키 _shopify_cmp | www.prana.com/women/tops/sweaters-hoodies.html |
| 목록 | Prana | firefox-fresh | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 cf_clearance, 쿠키 __cf_bm, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠키 _px3, 쿠 | www.prana.com/women/tops/sweaters-hoodies.html |
| 목록 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 화면 흔적 cf-block | www.prana.com/women/dresses-skirts.html |
| 목록 | Prana | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-script, 화면 흔적 cf-block, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/h/b/scrip | www.prana.com/women/dresses-skirts.html |
| 목록 | Prana | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.prana.com/women/dresses-skirts.html |
| 목록 | Prana | firefox-fresh | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 cf_clearance, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠키 _px3, 쿠 | www.prana.com/women/dresses-skirts.html |
| 목록 | Prana | impit | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-script·cf-block · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-script, 화면 흔적 cf-block | www.prana.com/women/bottoms.html |
| 목록 | Prana | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block | www.prana.com/women/bottoms.html |
| 목록 | Prana | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Attention Required! / Cloudflare" · 흔적 cf-block · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block / Shopify: 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 _shopify_cmp, 쿠키 cart_currency | www.prana.com/women/bottoms.html |
| 목록 | Prana | firefox-fresh | blocked | 403 | HUMAN(PerimeterX) (높음) | 제목 "Access to this page has been denied" · 흔적 cf-script·px-challenge·px-script · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 쿠키 cf_clearance, 화면 흔적 cf-script, 불러온 주소 www.prana.com/cdn-cgi/challenge-platform/scripts/j / HUMAN(PerimeterX): 쿠키 _pxhd, 쿠키 _pxvid, 쿠키 _px3, 쿠 | www.prana.com/women/bottoms.html |
| 목록 | Dickies | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 이동 locale -→en-us · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.dickies.com/cdn-cgi/challenge-platform/h/g/orc, 불러온 주소 challenges.cloudflare.com/turnstile/v0/g/b9d4778be / Aka | www.dickies.com/collections/womens-tops |
| 목록 | Good American | impit | geo | 200 |  | 제목 "Tees &amp; Tanks &ndash; GOOD AMERICAN" · 이동 locale en-kr→- · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.goodamerican.com/en-kr/collections/tees-tanks |
| 목록 | Good American | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 이동 locale en-kr→- · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.goodamerican.com/cdn-cgi/challenge-platform/h/, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Aka | www.goodamerican.com/en-kr/collections/tees-tanks |
| 목록 | Good American | firefox-fresh | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 이동 locale en-kr→- · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.goodamerican.com/cdn-cgi/challenge-platform/h/, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Sho | www.goodamerican.com/en-kr/collections/tees-tanks |
| 목록 | Good American | impit | no-cards | 200 |  | 제목 "Jeanius &ndash; GOOD AMERICAN" · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.goodamerican.com/collections/jeanius-sweats |
| 목록 | Good American | impit | geo | 200 |  | 제목 "Tops &ndash; GOOD AMERICAN" · 이동 locale en-kr→- · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | www.goodamerican.com/en-kr/collections/womens-tops |
| 목록 | vineyardvines | impit | no-cards | 200 |  | 제목 "Women’s T-Shirts &amp; Polos" · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / CloudFront: x-amz-cf-* 헤더 | www.vineyardvines.com/category/womens-tees-tanks?nav=home--top_nav--Wo |
| 목록 | vineyardvines | impit | no-cards | 200 |  | 제목 "Women&#x27;s Shep Shirts™ &amp; Sweatshi" · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / CloudFront: x-amz-cf-* 헤더 | www.vineyardvines.com/category/women-sweatshirts?nav=category--top_nav |
| 목록 | vineyardvines | impit | no-cards | 200 |  | 제목 "Women&#x27;s Shirts and Tops at Vineyard" · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm / CloudFront: x-amz-cf-* 헤더 | www.vineyardvines.com/category/Womens-Shirts-Tunics?nav=category--top_ |
| 목록 | The Great | impit | no-cards | 200 |  | 제목 "Women&#39;s Tees &amp; Sweats / THE GREA" · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | thisisthegreat.com/collections/the-great-knits |
| 목록 | The Great | impit | no-cards | 200 |  | 제목 "Women&#39;s Sweatshirts / THE GREAT. &nd" · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | thisisthegreat.com/collections/knit-shop-sweatshirts |
| 목록 | The Great | impit | no-cards | 200 |  | 제목 "Women&#39;s Tops &amp; Shirts / THE GREA" · 흔적 captcha · Cloudflare: cf-ray 헤더 / Shopify: x-shopify-*/powered-by 헤더, 쿠키 _shopify_essential, 쿠키 _shopify_analytics, 쿠키 _shopify_marketing, 쿠키 cart_currency | thisisthegreat.com/collections/tops |
| 목록 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/shop/tops/ |
| 목록 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/shop/tops/knitwear/ |
| 목록 | The upside | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 | www.theupside.com/shop/tops/knitwear/ |
| 목록 | The upside | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Shopify: 쿠키 _shopify_es | www.theupside.com/shop/tops/knitwear/ |
| 목록 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/shop/all-in-one/ |
| 목록 | The upside | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 | www.theupside.com/shop/all-in-one/ |
| 목록 | The upside | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Shopify: 쿠키 _shopify_es | www.theupside.com/shop/all-in-one/ |
| 목록 | The upside | impit | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge | www.theupside.com/shop/bottoms/ |
| 목록 | The upside | playwright | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 | www.theupside.com/shop/bottoms/ |
| 목록 | The upside | firefox | blocked | 403 | Cloudflare (높음) | 제목 "Just a moment..." · 흔적 cf-challenge·captcha · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.theupside.com/cdn-cgi/challenge-platform/h/b/o, 불러온 주소 challenges.cloudflare.com/turnstile/v0/b/f8df4d4a0 / Shopify: 쿠키 _shopify_es | www.theupside.com/shop/bottoms/ |

<details><summary>사유</summary>

- &Other Stories — https://www.stories.com/en-us/clothing/tops/
  - impit: ✅ HTML 상품 링크 37 · 이미지 링크 9 · 글 6942자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 38 · 이미지 링크 15 · 글 12884자 · 예 https://www.stories.com/en-us/shoes/
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 38 · 이미지 링크 15 · 글 12884자 · 예 https://www.stories.com/en-us/shoes/
- &Other Stories — https://www.stories.com/en-us/clothing/tops/sweatshirts-hoodies/
  - impit: ✅ HTML 상품 링크 6 · 이미지 링크 1 · 글 3111자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 12개 · HTML 상품 링크 6 · 이미지 링크 7 · 글 8764자 · 예 https://www.stories.com/en-us/shoes/
  - firefox-fresh: ✅ 수집기 12개 · HTML 상품 링크 6 · 이미지 링크 7 · 글 8764자 · 예 https://www.stories.com/en-us/shoes/
- &Other Stories — https://www.stories.com/en-us/clothing/blouses-shirts/
  - impit: ✅ HTML 상품 링크 36 · 이미지 링크 8 · 글 6706자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 46개 · HTML 상품 링크 36 · 이미지 링크 13 · 글 12140자 · 예 https://www.stories.com/en-us/shoes/
  - firefox-fresh: ✅ 수집기 46개 · HTML 상품 링크 36 · 이미지 링크 13 · 글 12140자 · 예 https://www.stories.com/en-us/shoes/
- Addidas — https://www.adidas.com/us/women-tops?sort=newest-to-oldest
  - impit: ⛔ HTTP 403 adidas
  - playwright: ⛔ HTTP 403 adidas
  - firefox: ⛔ HTTP 403 adidas
  - firefox-fresh: ⛔ HTTP 403 adidas
- Addidas — https://www.adidas.com/us/women-hoodies_sweatshirts
  - impit: ⛔ HTTP 403 adidas
  - playwright: ❌ 응답 없음(차단 의심) — 헤더조차 45초 안에 안 옴
  - firefox: ⛔ HTTP 403 adidas
  - firefox-fresh: ⛔ HTTP 403 adidas
- Addidas — https://www.adidas.com/us/women-skirts_dresses
  - impit: ⛔ HTTP 403 adidas
  - playwright: ❌ 응답 없음(차단 의심) — 헤더조차 45초 안에 안 옴
  - firefox: ⛔ HTTP 403 adidas
  - firefox-fresh: ⛔ HTTP 403 adidas
- Anthropologie — https://www.anthropologie.com/tees
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ✅ 수집기 5개 · HTML 상품 링크 71 · 이미지 링크 9 · 글 7383자 · 예 https://www.anthropologie.com/shop/pilcro-sequined-twofer-tank
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- Anthropologie — https://www.anthropologie.com/tops-sweatshirts
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- Anthropologie — https://www.anthropologie.com/tops
  - impit: ⛔ HTTP 403 anthropologie.com
  - playwright: ⛔ HTTP 403 anthropologie.com
  - firefox: ⛔ HTTP 403 anthropologie.com
  - firefox-fresh: ⛔ HTTP 403 anthropologie.com
- Arket — https://www.arket.com/en-ww/women/clothing/tops/
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 49 · 글 4925자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 34200자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 34179자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
- Arket — https://www.arket.com/en-ww/women/clothing/tops/t-shirts/
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 49 · 글 5673자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 17891자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 48 · 이미지 링크 45 · 글 34933자 · 예 https://www.arket.com/en-ww/product/heavyweight-t-shirt-white-1135758001/
- Arket — https://www.arket.com/en-ww/women/clothing/sweatshirts-and-hoodies/
  - impit: ✅ HTML 상품 링크 33 · 이미지 링크 34 · 글 4388자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 32개 · HTML 상품 링크 32 · 이미지 링크 30 · 글 13173자 · 예 https://www.arket.com/en-ww/product/terry-sweatshirt-dark-blue-1283133037/
  - firefox-fresh: ✅ 수집기 32개 · HTML 상품 링크 32 · 이미지 링크 30 · 글 30219자 · 예 https://www.arket.com/en-ww/product/terry-sweatshirt-dark-blue-1283133037/
- Banana Republic — https://bananarepublic.gap.com/browse/women/t-shirts?cid=1055063&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3AT-Shirts+%26+Tanks#department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 5426자
  - playwright: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 10613자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 12504자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox-fresh: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 12504자 · 예 https://bananarepublic.gap.com/my-account/sign-in
- Banana Republic — https://bananarepublic.gap.com/browse/women/tops-and-blouses?cid=5037&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3ATops+%26+Shirts#department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 5331자
  - playwright: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 10132자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 12051자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox-fresh: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 12409자 · 예 https://bananarepublic.gap.com/my-account/sign-in
- Banana Republic — https://bananarepublic.gap.com/browse/women/dresses-and-jumpsuits?cid=69883&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3ADresses+%26+Jumpsuits#department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 5962자
  - playwright: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 10317자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 12682자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox-fresh: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 13040자 · 예 https://bananarepublic.gap.com/my-account/sign-in
- Banana Republic — https://bananarepublic.gap.com/browse/women/pants?cid=67595&nav=meganav%3AWOMEN%3AWOMEN%27S+CLOTHING%3APants#department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 2 · 글 5751자
  - playwright: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 10186자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 12488자 · 예 https://bananarepublic.gap.com/my-account/sign-in
  - firefox-fresh: ✅ 수집기 5개 · HTML 상품 링크 0 · 이미지 링크 5 · 글 12846자 · 예 https://bananarepublic.gap.com/my-account/sign-in
- FP Movement — https://www.freepeople.com/fpmovement/workout-tops/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- FP Movement — https://www.freepeople.com/fpmovement/hoodies-sweatshirts/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- FP Movement — https://www.freepeople.com/fpmovement/one-pieces/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- Free People — https://www.freepeople.com/tops/
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- Free People — https://www.freepeople.com/sweatshirts-pullovers/?vis_nav=4
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- Free People — https://www.freepeople.com/blouses/?feature-product-ids=FP-109929869-000&topper=2
  - impit: ⛔ HTTP 403 freepeople.com
  - playwright: ⛔ HTTP 403 freepeople.com
  - firefox: ⛔ HTTP 403 freepeople.com
  - firefox-fresh: ⛔ HTTP 403 freepeople.com
- Garnet hill — https://www.garnethill.com/clothing/categories/tops-tees/
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 27자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ✅ 수집기 7개 · HTML 상품 링크 0 · 이미지 링크 6 · 글 14019자 · 예 https://www.garnethill.com/blake-organic-cotton-corduroy-button-down-shirt/clothing/categories/tops-tees/710542
  - firefox-fresh: ✅ 수집기 7개 · HTML 상품 링크 0 · 이미지 링크 6 · 글 14019자 · 예 https://www.garnethill.com/blake-organic-cotton-corduroy-button-down-shirt/clothing/categories/tops-tees/710542
- Garnet hill — https://www.garnethill.com/clothing/categories/tops-tees/facet/f_style_uFilter/Shirts__sp__am__spBlouses?categoryId=191619
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 27자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ✅ 수집기 7개 · HTML 상품 링크 0 · 이미지 링크 6 · 글 11781자 · 예 https://www.garnethill.com/blake-organic-cotton-corduroy-button-down-shirt/clothing/categories/tops-tees/710542
- Garnet hill — https://www.garnethill.com/clothing/categories/dresses/
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 0 · 글 17자
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ✅ 수집기 10개 · HTML 상품 링크 0 · 이미지 링크 9 · 글 14143자 · 예 https://www.garnethill.com/seamed-knit-trapeze-dress---wine-tasting-floral/clothing/categories/dresses/572307
- Joules — https://www.joules.com/shop/womens/clothing/tops
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Joules — https://www.joules.com/shop/womens/clothing/sweatshirts-and-hoodies
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Joules — https://www.joules.com/shop/womens/clothing/shirts-and-blouses
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Lands end — https://www.landsend.com/shop/womens-tops/S-xfe-xez-y5c-xec
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Lands end — https://www.landsend.com/shop/womens-sweatshirts-hoodies-tops-tees/S-xfe-16na-xez-y5c-xh1-y0d-xec
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Lands end — https://www.landsend.com/shop/womens-shirts-blouses-tops/S-xfe-xez-y5c-yql-xec
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ⛔ HTTP 403 Access Denied
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Lululemon — https://shop.lululemon.com/c/women-t-shirts/n1wx7w
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ❌ 응답 없음(차단 의심) — 헤더조차 45초 안에 안 옴
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Lululemon — https://shop.lululemon.com/c/women-tank-tops/n1uk4w
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ❌ 응답 없음(차단 의심) — 헤더조차 45초 안에 안 옴
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Lululemon — https://shop.lululemon.com/c/women-hoodies-and-sweatshirts/n1jux6
  - impit: ⛔ HTTP 403 Access Denied
  - playwright: ❌ 응답 없음(차단 의심) — 헤더조차 45초 안에 안 옴
  - firefox: ⛔ HTTP 403 Access Denied
  - firefox-fresh: ⛔ HTTP 403 Access Denied
- Mango — https://shop.mango.com/us/en/c/women/t-shirts/8e23bdfb
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- Mango — https://shop.mango.com/us/en/c/women/tops/227371cd
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- Mango — https://shop.mango.com/us/en/c/women/knitwear/7e46863e
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- Old Navy — https://oldnavy.gap.com/browse/women/t-shirts?cid=1035712&nav=meganav%3AWomen%3AWomen%E2%80%99s+Tops%3AT-shirts+%26+Tanks#department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 3 · 글 5714자
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 12276자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 14116자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox-fresh: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 14475자 · 예 https://oldnavy.gap.com/browse/info.do
- Old Navy — https://oldnavy.gap.com/browse/women/sweatshirts-and-hoodies?cid=3044037&nav=meganav%3AWomen%3AWomen%E2%80%99s%20Tops%3ASweatshirts%20%26%20Hoodies#department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 3 · 글 5623자
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 11843자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 14054자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox-fresh: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 14379자 · 예 https://oldnavy.gap.com/browse/info.do
- Old Navy — https://oldnavy.gap.com/browse/women/all-tops?cid=72091&nav=meganav%3AWomen%3AWomen%E2%80%99s+Tops%3AAll+Tops&tid=ON_WMNS_TOPS#department=136&style=1166604&banner=vi_tops_w_blouses_click
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 4 · 글 7152자
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 13708자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 15485자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox-fresh: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 15812자 · 예 https://oldnavy.gap.com/browse/info.do
- Old Navy — https://oldnavy.gap.com/browse/women/dresses-and-jumpsuits?cid=15292&nav=meganav%3AWomen%3AShop%20Women%27s%20Categories%3ADresses%20%26%20Jumpsuits
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 3 · 글 7227자
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 13694자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 15773자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox-fresh: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 15988자 · 예 https://oldnavy.gap.com/browse/info.do
- Old Navy — https://oldnavy.gap.com/browse/women/sweatpants?cid=3044038&nav=meganav%3AWomen%3AWomen%27s%20Bottoms%3ASweatpants#department=136
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 4 · 글 5860자
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 11895자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 14318자 · 예 https://oldnavy.gap.com/browse/info.do
  - firefox-fresh: ✅ 수집기 11개 · HTML 상품 링크 0 · 이미지 링크 8 · 글 14632자 · 예 https://oldnavy.gap.com/browse/info.do
- Paige — https://paige.com/collection/women-tees-and-tanks
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- Paige — https://paige.com/collection/women-sweaters-and-sweatshirts
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- Paige — https://paige.com/collection/women-tops
  - impit: ⛔ HTTP 429 Vercel Security Checkpoint
  - playwright: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox: ⛔ HTTP 429 Vercel Security Checkpoint
  - firefox-fresh: ⛔ HTTP 429 Vercel Security Checkpoint
- Seasalt cornwall — https://www.seasaltcornwall.com/clothing/tops
  - impit: ✅ HTML 상품 링크 35 · 이미지 링크 75 · 글 19512자
  - playwright: ✅ 수집기 59개 · HTML 상품 링크 35 · 이미지 링크 72 · 글 33239자 · 예 https://www.seasaltcornwall.com/black-friday-deals
  - firefox: ✅ 수집기 59개 · HTML 상품 링크 35 · 이미지 링크 72 · 글 33157자 · 예 https://www.seasaltcornwall.com/black-friday-deals
  - firefox-fresh: ✅ 수집기 59개 · HTML 상품 링크 35 · 이미지 링크 72 · 글 32882자 · 예 https://www.seasaltcornwall.com/black-friday-deals
- Seasalt cornwall — https://www.seasaltcornwall.com/clothing/jumpers-cardigans
  - impit: ✅ HTML 상품 링크 36 · 이미지 링크 76 · 글 19106자
  - playwright: ✅ 수집기 59개 · HTML 상품 링크 36 · 이미지 링크 71 · 글 28223자 · 예 https://www.seasaltcornwall.com/black-friday-deals
  - firefox: ✅ 수집기 59개 · HTML 상품 링크 36 · 이미지 링크 71 · 글 28034자 · 예 https://www.seasaltcornwall.com/black-friday-deals
  - firefox-fresh: ✅ 수집기 59개 · HTML 상품 링크 36 · 이미지 링크 71 · 글 32258자 · 예 https://www.seasaltcornwall.com/black-friday-deals
- Seasalt cornwall — https://www.seasaltcornwall.com/clothing/shirts-blouses
  - impit: ✅ HTML 상품 링크 35 · 이미지 링크 76 · 글 19284자
  - playwright: ✅ 수집기 60개 · HTML 상품 링크 35 · 이미지 링크 72 · 글 27961자 · 예 https://www.seasaltcornwall.com/black-friday-deals
  - firefox: ✅ 수집기 60개 · HTML 상품 링크 35 · 이미지 링크 72 · 글 27764자 · 예 https://www.seasaltcornwall.com/black-friday-deals
  - firefox-fresh: ✅ 수집기 60개 · HTML 상품 링크 35 · 이미지 링크 72 · 글 31996자 · 예 https://www.seasaltcornwall.com/black-friday-deals
- The white company — https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - playwright: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - firefox: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- The white company — https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - playwright: ⛔ HTTP 404 Page Not Found | The White Company US
  - firefox: ⛔ HTTP 404 Page Not Found | The White Company US
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- The white company — https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tunics
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
  - playwright: ⛔ HTTP 404 Page Not Found | The White Company US
  - firefox: ⛔ HTTP 404 Page Not Found | The White Company US
  - firefox-fresh: 🟡 수집기 0개 · HTML 상품 링크 0 · 이미지 링크 1 · 글 310자
- Wilson — https://www.wilson.com/en-us/sportswear/women/tops/tanks
  - impit: ✅ HTML 상품 링크 15 · 이미지 링크 14 · 글 17819자
  - playwright: ✅ 수집기 28개 · HTML 상품 링크 21 · 이미지 링크 14 · 글 25307자 · 예 https://www.wilson.com/en-us/collections/deals-baseball
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ 수집기 24개 · HTML 상품 링크 20 · 이미지 링크 14 · 글 25373자 · 예 https://www.wilson.com/en-us/collections/deals-baseball
- Wilson — https://www.wilson.com/en-us/sportswear/women/tops/short-sleeve-tops
  - impit: ✅ HTML 상품 링크 11 · 이미지 링크 14 · 글 16742자
  - playwright: ✅ 수집기 24개 · HTML 상품 링크 17 · 이미지 링크 14 · 글 19533자 · 예 https://www.wilson.com/en-us/collections/deals-baseball
  - firefox: ✅ 수집기 24개 · HTML 상품 링크 17 · 이미지 링크 14 · 글 19533자 · 예 https://www.wilson.com/en-us/collections/deals-baseball
  - firefox-fresh: ⛔ HTTP 403 Verify your browser
- Wilson — https://www.wilson.com/en-us/sportswear/women/tops/long-sleeve-tops
  - impit: ✅ HTML 상품 링크 15 · 이미지 링크 14 · 글 17710자
  - playwright: ✅ 수집기 26개 · HTML 상품 링크 19 · 이미지 링크 14 · 글 21338자 · 예 https://www.wilson.com/en-us/collections/deals-baseball
  - firefox: ✅ 수집기 26개 · HTML 상품 링크 19 · 이미지 링크 14 · 글 21338자 · 예 https://www.wilson.com/en-us/collections/deals-baseball
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- Prana — https://www.prana.com/women/tops.html
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - playwright: ⛔ HTTP 403 Access to this page has been denied
  - firefox: ⛔ HTTP 403 Access to this page has been denied
  - firefox-fresh: ⛔ HTTP 403 Access to this page has been denied
- Prana — https://www.prana.com/women/tops/sweaters-hoodies.html
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox-fresh: ⛔ HTTP 403 Access to this page has been denied
- Prana — https://www.prana.com/women/dresses-skirts.html
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox-fresh: ⛔ HTTP 403 Access to this page has been denied
- Prana — https://www.prana.com/women/bottoms.html
  - impit: ⛔ HTTP 403 Attention Required! | Cloudflare
  - playwright: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox: ⛔ HTTP 403 Attention Required! | Cloudflare
  - firefox-fresh: ⛔ HTTP 403 Access to this page has been denied
- Dickies — https://www.dickies.com/collections/womens-tops
  - impit: ✅ HTML 상품 링크 46 · 이미지 링크 63 · 글 12539자
  - playwright: ✅ 수집기 90개 · HTML 상품 링크 90 · 이미지 링크 107 · 글 23262자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ 수집기 90개 · HTML 상품 링크 90 · 이미지 링크 107 · 글 23264자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
- Dickies — https://www.dickies.com/en-us/collections/womens-hoodies
  - impit: ✅ HTML 상품 링크 49 · 이미지 링크 63 · 글 13231자
  - playwright: ✅ 수집기 50개 · HTML 상품 링크 53 · 이미지 링크 67 · 글 17791자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
  - firefox: ✅ 수집기 50개 · HTML 상품 링크 53 · 이미지 링크 67 · 글 18258자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
  - firefox-fresh: ✅ 수집기 50개 · HTML 상품 링크 53 · 이미지 링크 67 · 글 18258자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
- Dickies — https://www.dickies.com/en-us/collections/womens-shirt-jackets
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 63 · 글 12854자
  - playwright: ✅ 수집기 49개 · HTML 상품 링크 51 · 이미지 링크 66 · 글 17053자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
  - firefox: ✅ 수집기 49개 · HTML 상품 링크 51 · 이미지 링크 66 · 글 17053자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
  - firefox-fresh: ✅ 수집기 49개 · HTML 상품 링크 51 · 이미지 링크 66 · 글 17520자 · 예 https://www.dickies.com/en-us/products/insulated-eisenhower-jacket-dk00tj150bk
- Good American — https://www.goodamerican.com/en-kr/collections/tees-tanks
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 12 · 글 13003자
  - playwright: ✅ 수집기 136개 · HTML 상품 링크 121 · 이미지 링크 133 · 글 189504자 · 예 https://www.goodamerican.com/collections/new-arrivals
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ⛔ HTTP 403 Just a moment...
- Good American — https://www.goodamerican.com/collections/jeanius-sweats
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 12 · 글 16026자
  - playwright: ✅ 수집기 43개 · HTML 상품 링크 30 · 이미지 링크 42 · 글 79036자 · 예 https://www.goodamerican.com/collections/new-arrivals
  - firefox: ✅ 수집기 45개 · HTML 상품 링크 30 · 이미지 링크 42 · 글 79845자 · 예 https://www.goodamerican.com/collections/new-arrivals
  - firefox-fresh: ✅ 수집기 45개 · HTML 상품 링크 30 · 이미지 링크 42 · 글 79845자 · 예 https://www.goodamerican.com/collections/new-arrivals
- Good American — https://www.goodamerican.com/en-kr/collections/womens-tops
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 12 · 글 17671자
  - playwright: ✅ 수집기 353개 · HTML 상품 링크 341 · 이미지 링크 352 · 글 438167자 · 예 https://www.goodamerican.com/en-kr/collections/new-arrivals
  - firefox: ✅ 수집기 73개 · HTML 상품 링크 61 · 이미지 링크 72 · 글 122652자 · 예 https://www.goodamerican.com/en-kr/collections/new-arrivals
  - firefox-fresh: ✅ 수집기 74개 · HTML 상품 링크 60 · 이미지 링크 71 · 글 119137자 · 예 https://www.goodamerican.com/collections/new-arrivals
- Nation LTD — https://nation.la/collections/tops
  - impit: ✅ HTML 상품 링크 52 · 이미지 링크 30 · 글 50470자
  - playwright: ✅ 수집기 35개 · HTML 상품 링크 62 · 이미지 링크 60 · 글 56135자 · 예 https://nation.la/collections/best-selling-tops
  - firefox: ✅ 수집기 35개 · HTML 상품 링크 62 · 이미지 링크 60 · 글 55485자 · 예 https://nation.la/collections/best-selling-tops
  - firefox-fresh: ✅ 수집기 35개 · HTML 상품 링크 62 · 이미지 링크 60 · 글 55485자 · 예 https://nation.la/collections/best-selling-tops
- Nation LTD — https://nation.la/collections/sweatshirts
  - impit: ✅ HTML 상품 링크 48 · 이미지 링크 26 · 글 50320자
  - playwright: ✅ 수집기 24개 · HTML 상품 링크 55 · 이미지 링크 49 · 글 54583자 · 예 https://nation.la/collections/sweatshirts/products/jessie-sweatshirt-heather-grey
  - firefox: ✅ 수집기 24개 · HTML 상품 링크 55 · 이미지 링크 49 · 글 53856자 · 예 https://nation.la/collections/sweatshirts/products/jessie-sweatshirt-heather-grey
  - firefox-fresh: ✅ 수집기 24개 · HTML 상품 링크 55 · 이미지 링크 49 · 글 53856자 · 예 https://nation.la/collections/sweatshirts/products/jessie-sweatshirt-heather-grey
- Nation LTD — https://nation.la/collections/dresses
  - impit: ✅ HTML 상품 링크 47 · 이미지 링크 26 · 글 50962자
  - playwright: ✅ 수집기 22개 · HTML 상품 링크 53 · 이미지 링크 47 · 글 55200자 · 예 https://nation.la/collections/dresses/products/pietra-dress-jet-black
  - firefox: ✅ 수집기 22개 · HTML 상품 링크 53 · 이미지 링크 47 · 글 54473자 · 예 https://nation.la/collections/dresses/products/pietra-dress-jet-black
  - firefox-fresh: ✅ 수집기 22개 · HTML 상품 링크 53 · 이미지 링크 47 · 글 54473자 · 예 https://nation.la/collections/dresses/products/pietra-dress-jet-black
- vineyardvines — https://www.vineyardvines.com/category/womens-tees-tanks?nav=home--top_nav--Womens--womens-clothing--9
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 2421자
  - playwright: ✅ 수집기 6개 · HTML 상품 링크 1 · 이미지 링크 2 · 글 5060자 · 예 https://www.vineyardvines.com/product/womens-casual-knits/deluxe-turtleneck/2K005106.html
  - firefox: ✅ 수집기 6개 · HTML 상품 링크 1 · 이미지 링크 2 · 글 5060자 · 예 https://www.vineyardvines.com/product/womens-casual-knits/deluxe-turtleneck/2K005106.html
  - firefox-fresh: ✅ 수집기 6개 · HTML 상품 링크 1 · 이미지 링크 2 · 글 5060자 · 예 https://www.vineyardvines.com/product/womens-casual-knits/deluxe-turtleneck/2K005106.html
- vineyardvines — https://www.vineyardvines.com/category/women-sweatshirts?nav=category--top_nav--Womens--womens-clothing--3
  - impit: 🟡 HTML 상품 링크 4 · 이미지 링크 1 · 글 4231자
  - playwright: ✅ 수집기 10개 · HTML 상품 링크 11 · 이미지 링크 2 · 글 6684자 · 예 https://www.vineyardvines.com/product/womens-shep-shirts/fair-isle-dreamcloth-relaxed-shep-shirt/2K004143.html
  - firefox: ✅ 수집기 10개 · HTML 상품 링크 11 · 이미지 링크 2 · 글 6684자 · 예 https://www.vineyardvines.com/product/womens-shep-shirts/fair-isle-dreamcloth-relaxed-shep-shirt/2K004143.html
  - firefox-fresh: ✅ 수집기 10개 · HTML 상품 링크 11 · 이미지 링크 2 · 글 6684자 · 예 https://www.vineyardvines.com/product/womens-shep-shirts/fair-isle-dreamcloth-relaxed-shep-shirt/2K004143.html
- vineyardvines — https://www.vineyardvines.com/category/Womens-Shirts-Tunics?nav=category--top_nav--Womens--womens-clothing--7
  - impit: 🟡 HTML 상품 링크 0 · 이미지 링크 1 · 글 2438자
  - playwright: ✅ 수집기 8개 · HTML 상품 링크 0 · 이미지 링크 2 · 글 4591자 · 예 https://www.vineyardvines.com/product/womens-woven-tops/cropped-birdie-embellished-button-down/2W002187.html
  - firefox: ✅ 수집기 8개 · HTML 상품 링크 0 · 이미지 링크 2 · 글 4571자 · 예 https://www.vineyardvines.com/product/womens-woven-tops/cropped-birdie-embellished-button-down/2W002187.html
  - firefox-fresh: ✅ 수집기 8개 · HTML 상품 링크 0 · 이미지 링크 2 · 글 4591자 · 예 https://www.vineyardvines.com/product/womens-woven-tops/cropped-birdie-embellished-button-down/2W002187.html
- Bash — https://ba-sh.com/fr/en/t-shirts/?_gl=1*18k9v40*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ1OTckajYwJGwwJGg1MzYzNDQ3NzQ.
  - impit: ✅ HTML 상품 링크 51 · 이미지 링크 6 · 글 4735자
  - playwright: ✅ 수집기 34개 · HTML 상품 링크 67 · 이미지 링크 31 · 글 16388자 · 예 https://ba-sh.com/fr/en/event/
  - firefox: ✅ 수집기 34개 · HTML 상품 링크 67 · 이미지 링크 31 · 글 16378자 · 예 https://ba-sh.com/fr/en/event/
  - firefox-fresh: ✅ 수집기 34개 · HTML 상품 링크 67 · 이미지 링크 31 · 글 16377자 · 예 https://ba-sh.com/fr/en/event/
- Bash — https://ba-sh.com/fr/en/sweatshirts/?_gl=1*6lpw8g*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MjMkajM0JGwwJGg1MzYzNDQ3NzQ.
  - impit: ✅ HTML 상품 링크 54 · 이미지 링크 6 · 글 4430자
  - playwright: ✅ 수집기 36개 · HTML 상품 링크 69 · 이미지 링크 31 · 글 13227자 · 예 https://ba-sh.com/fr/en/event/
  - firefox: ✅ 수집기 36개 · HTML 상품 링크 69 · 이미지 링크 31 · 글 13217자 · 예 https://ba-sh.com/fr/en/event/
  - firefox-fresh: ✅ 수집기 33개 · HTML 상품 링크 69 · 이미지 링크 31 · 글 16063자 · 예 https://ba-sh.com/fr/en/event/
- Bash — https://ba-sh.com/fr/en/tops-shirts/?_gl=1*wv5ete*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE0*_ga_V0KDVCDYHF*czE3ODMzMDQwMTQkbzEkZzAkdDE3ODMzMDQ2MTEkajQ2JGwwJGg1MzYzNDQ3NzQ.
  - impit: ✅ HTML 상품 링크 87 · 이미지 링크 4 · 글 5329자
  - playwright: ✅ 수집기 65개 · HTML 상품 링크 129 · 이미지 링크 59 · 글 15658자 · 예 https://ba-sh.com/fr/en/event/
  - firefox: ✅ 수집기 61개 · HTML 상품 링크 128 · 이미지 링크 59 · 글 15655자 · 예 https://ba-sh.com/fr/en/event/
  - firefox-fresh: ✅ 수집기 61개 · HTML 상품 링크 128 · 이미지 링크 59 · 글 18464자 · 예 https://ba-sh.com/fr/en/event/
- The Great — https://thisisthegreat.com/collections/the-great-knits
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 2 · 글 14370자
  - playwright: ✅ 수집기 267개 · HTML 상품 링크 265 · 이미지 링크 3 · 글 137260자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
  - firefox: ✅ 수집기 267개 · HTML 상품 링크 265 · 이미지 링크 3 · 글 137260자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
  - firefox-fresh: ✅ 수집기 267개 · HTML 상품 링크 265 · 이미지 링크 3 · 글 137260자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
- The Great — https://thisisthegreat.com/collections/knit-shop-sweatshirts
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 2 · 글 14991자
  - playwright: ✅ 수집기 103개 · HTML 상품 링크 101 · 이미지 링크 3 · 글 62332자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
  - firefox: ✅ 수집기 103개 · HTML 상품 링크 101 · 이미지 링크 3 · 글 62332자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
  - firefox-fresh: ✅ 수집기 103개 · HTML 상품 링크 101 · 이미지 링크 3 · 글 62332자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
- The Great — https://thisisthegreat.com/collections/tops
  - impit: 🟡 HTML 상품 링크 1 · 이미지 링크 2 · 글 14050자
  - playwright: ✅ 수집기 42개 · HTML 상품 링크 40 · 이미지 링크 3 · 글 27694자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
  - firefox: ✅ 수집기 42개 · HTML 상품 링크 40 · 이미지 링크 3 · 글 27694자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
  - firefox-fresh: ✅ 수집기 42개 · HTML 상품 링크 40 · 이미지 링크 3 · 글 27694자 · 예 https://thisisthegreat.com/collections/the-great-outdoors
- The upside — https://www.theupside.com/shop/tops/
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ✅ 수집기 69개 · HTML 상품 링크 59 · 이미지 링크 10 · 글 59577자 · 예 https://www.theupside.com/active/tops/sports-bras/
  - firefox: ✅ 수집기 68개 · HTML 상품 링크 59 · 이미지 링크 10 · 글 59170자 · 예 https://www.theupside.com/active/tops/sports-bras/
  - firefox-fresh: ✅ 수집기 68개 · HTML 상품 링크 59 · 이미지 링크 10 · 글 59170자 · 예 https://www.theupside.com/active/tops/sports-bras/
- The upside — https://www.theupside.com/shop/tops/knitwear/
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ 수집기 56개 · HTML 상품 링크 46 · 이미지 링크 10 · 글 58068자 · 예 https://www.theupside.com/active/tops/sports-bras/
- The upside — https://www.theupside.com/shop/all-in-one/
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ 수집기 30개 · HTML 상품 링크 20 · 이미지 링크 10 · 글 54538자 · 예 https://www.theupside.com/active/tops/sports-bras/
- The upside — https://www.theupside.com/shop/bottoms/
  - impit: ⛔ HTTP 403 Just a moment...
  - playwright: ⛔ HTTP 403 Just a moment...
  - firefox: ⛔ HTTP 403 Just a moment...
  - firefox-fresh: ✅ 수집기 68개 · HTML 상품 링크 59 · 이미지 링크 10 · 글 59050자 · 예 https://www.theupside.com/active/tops/sports-bras/
- Carlhartt — https://www.carhartt.com/c/women-tops-tshirt
  - impit: ✅ HTML 상품 링크 25 · 이미지 링크 90 · 글 22503자
  - playwright: ✅ 수집기 78개 · HTML 상품 링크 25 · 이미지 링크 90 · 글 14234자 · 예 https://www.carhartt.com/c/black-friday-accessories
  - firefox: ✅ 수집기 78개 · HTML 상품 링크 25 · 이미지 링크 90 · 글 14234자 · 예 https://www.carhartt.com/c/black-friday-accessories
  - firefox-fresh: ✅ 수집기 78개 · HTML 상품 링크 25 · 이미지 링크 90 · 글 14234자 · 예 https://www.carhartt.com/c/black-friday-accessories
- Carlhartt — https://www.carhartt.com/c/women-hoodies-sweatshirts
  - impit: ✅ HTML 상품 링크 26 · 이미지 링크 90 · 글 22398자
  - playwright: ✅ 수집기 78개 · HTML 상품 링크 26 · 이미지 링크 90 · 글 14084자 · 예 https://www.carhartt.com/c/black-friday-accessories
  - firefox: ✅ 수집기 78개 · HTML 상품 링크 26 · 이미지 링크 90 · 글 14084자 · 예 https://www.carhartt.com/c/black-friday-accessories
  - firefox-fresh: ✅ 수집기 78개 · HTML 상품 링크 26 · 이미지 링크 90 · 글 14152자 · 예 https://www.carhartt.com/c/black-friday-accessories
- Aerie — https://www.ae.com/us/en/c/aerie/clothing/tops/cat4130031
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 44 · 글 10882자
  - playwright: ✅ 수집기 48개 · HTML 상품 링크 30 · 이미지 링크 44 · 글 12138자 · 예 https://www.ae.com/us/en/c/aerie/aerie-gifts/cat6770012
  - firefox: ✅ 수집기 48개 · HTML 상품 링크 30 · 이미지 링크 44 · 글 12158자 · 예 https://www.ae.com/us/en/c/aerie/aerie-gifts/cat6770012
  - firefox-fresh: ✅ 수집기 48개 · HTML 상품 링크 30 · 이미지 링크 44 · 글 12260자 · 예 https://www.ae.com/us/en/c/aerie/aerie-gifts/cat6770012
- Aerie — https://www.ae.com/us/en/c/aerie/tops/hoodies-sweatshirts/cat7030169
  - impit: ✅ HTML 상품 링크 30 · 이미지 링크 44 · 글 11913자
  - playwright: ✅ 수집기 46개 · HTML 상품 링크 30 · 이미지 링크 44 · 글 13210자 · 예 https://www.ae.com/us/en/c/aerie/aerie-gifts/cat6770012
  - firefox: ✅ 수집기 46개 · HTML 상품 링크 30 · 이미지 링크 44 · 글 13143자 · 예 https://www.ae.com/us/en/c/aerie/aerie-gifts/cat6770012
  - firefox-fresh: ✅ 수집기 46개 · HTML 상품 링크 30 · 이미지 링크 44 · 글 13215자 · 예 https://www.ae.com/us/en/c/aerie/aerie-gifts/cat6770012

</details>
