# 목록 '문 열기' — 집 IP 없이 열리는 목록을 데이터센터 수집기로 (2026-11-25)

접근 지도(`docs/access-map.md`)가 "무료로 열 수 있다"고 한 목록 페이지를 실제로 열어 본 기록입니다.
모든 측정은 GitHub Actions 에서 **저장 없이**(store=0) 돌렸습니다. 실행 번호는 `access-measure/RUNS.md` 에 있습니다.

> **측정** = Actions 에서 실제 페이지를 열어 센 수. **추정** = 코드·구조를 보고 판단한 것.
> 이 브랜치의 변경은 owner 가 `main` 에 합치기 전에는 야간 수집에 쓰이지 않습니다.

## 1. 무엇을 바꿨나 (쉬운 말로)

| 바꾼 것 | 왜 | 시험 |
|---|---|---|
| 헤드리스 수집기에 **impit 엔진** | 크롬으로 열면 막히는데, 브라우저 없이 크롬의 '접속 지문'만 흉내 내 HTML 을 받으면 열리는 사이트가 있다(Whitestuff·Sessun). 받은 HTML 을 크롬 창에 넣고 같은 수집기로 읽는다. 크롬 창은 사이트에 직접 접속하지 않는다 | `smoke-browser-collect.mjs` 7번 |
| 브랜드별 **새 창**(`fresh`) | 첫 카테고리만 열리고 둘째부터 막히는 곳(The upside·Massimo Dutti·Oysho) | 같은 곳 |
| 브랜드별 **합치기 저장**(`store: "merge"`) | 서버가 채워 온 카탈로그(옛 상품이 쌓여 있음)를 이 수집이 줄이지 않게 | 같은 곳 |
| Render 그룹 브랜드의 **엔진 바꾸기** | The upside 처럼 이미 헤드리스로 도는 브랜드도 추가 파일로 엔진·새 창만 바꾼다 | 6번 |
| 야간을 **두 잡**으로 | 추가 브랜드를 다 넣으면 85분 예산을 넘는다. Render 그룹 잡과 추가 브랜드 잡이 동시에 돈다 | 6번(EXTRA_MODE) |
| 수집기: **물음표 뒤 상품 번호** | Gap 계열은 모든 상품 주소가 `/browse/product.do` 하나이고 번호가 `?pid=` 에 있다. 물음표 뒤를 버려서 상품이 한 개로 합쳐졌다(집 IP 에서도 1~7개) | `smoke-collector-cards.mjs` · `test-nonproduct.mjs` |
| 수집기: **한 화면씩 내려가며 누적** | 화면 밖 카드를 지우는 그리드(가상 스크롤)는 맨 아래로 한 번에 뛰면 중간이 안 그려진다 | 가상 스크롤 연기 테스트(옛 수집기 60개 중 5개) |
| 수집기: **상품이 아닌 모양** 거르기 | `/c/`·`/w/`·`/collections/` 카테고리(Carhartt 'arrow icon' 타일, Nike 필터, Reformation 기획전), Inditex `-n숫자` 카테고리(Oysho 타일), 이미지 파일 주소(Sessun srcset 조각) | `test-nonproduct.mjs`(접근 지도의 진짜 상품 주소 143개는 하나도 안 버리는지 함께 봄) |
| 수집기: **사이트 머리글·메뉴·바닥글** 링크 제외 | The upside 'Header Submenu Image', Old Navy·Banana Republic 메뉴 타일. 단, 그 칸 안에 가격 붙은 카드가 8개 이상이면 상품 그리드로 본다(Monsoon) | 연기 테스트 2개 |
| 수집기: 모은 수 **상한** | 끝없이 이어지는 목록(Nike·Reformation·Oysho)이 한 브랜드에 10~45분 쓰던 것 → 헤드리스는 200개에서 멈춤(확장은 그대로 600) | — |
| 수집 중 **페이지가 바뀌면 한 번 다시 읽기** | Oysho 첫 두 카테고리가 0개였던 원인 | — |

규칙(경로·메뉴·상품 번호)은 `chrome-extension/collector.js` 한 곳에 있어 **확장도 같은 규칙**을 씁니다.
확장 쪽에 반영되려면 확장을 다시 불러와야 합니다(버전 올리기는 이번 작업 범위 밖).

## 2. 브랜드별 결과

### 2-1. 넣은 브랜드 (`browser-extra-brands.json` — main 에 합치면 매일)

전 = 11/25 저장본·야간(확장 ext · 서버 srv · 헤드리스 hl)의 카테고리 URL 별 수. 후 = 저장 안 함 측정, 서로 다른 러너 2회 이상.

| 브랜드 | 엔진 | 전(URL 별) | 후(URL 별) | 실행 | 표본 3개(사이트에서 확인용) |
|---|---|---|---|---|---|
| H&M | 파이어폭스 | ext 150·150·149·150·145 | 156~172·168~173·171~175·172~176·157~166 (745) | 45598942983·45598957772·45605800257·45605806955 | productpage.1370920002 · 1368807009 · 1359326003 (`www2.hm.com/en_us/productpage.<번호>.html`) |
| Seasalt cornwall | 크롬 | ext 131·50·1·65·32 | 141·91·58·88·53 (276) | 45620020752·45620027222 | Isla Semi-Fitted Shirt `/isla-patterned-organic-cotton-shirt` · Golden Light Knitted Vest `/golden-light-fair-isle-knitted-vest` · Stone Circle Fair Isle Jumper `/stone-circle-fair-isle-jumper` |
| Gap | 크롬 | ext 6(배너) | 201·205·203·68 (472) | 45604830101·45604840722 | Modern V-Neck T-Shirt `product.do?pid=886594042` · Modern Boatneck T-Shirt `pid=915374002` · VintageSoft Oversized Mockneck Zip Jacket `pid=1188195042` |
| Old Navy | 크롬 | ext 7 | 203·200~205·114·197·157 (693) | 같음 | Vintage Crew-Neck T-Shirt `pid=537388222` · Snug Long-Sleeve Ribbed T-Shirt `pid=909502002` · Fitted Performance Fleece Full-Zip Jacket `pid=903184012` |
| Athleta | 크롬 | ext 1 | 395·122·41·295 (403) | 같음 | Luxe Velvet Built In Bra Tank `pid=1184499002` · Seasoft V-Neck Sweatshirt `pid=1174523072` · Coaster Luxe Open Cardigan `pid=1177198022` |
| Banana Republic | 크롬 | ext 1 | 106·164·131·136 (511) | 같음 | French Terry Stand-Collar Sweatshirt `pid=1180234022` · Vintage Cotton Crew-Neck T-Shirt `pid=834994342` · The Everyday Shirt in Cotton Poplin `pid=709387252` |
| The upside | 파이어폭스+새 창(엔진만 바꿈) | hl 70·0·0·0 | 58~119·45~46·19·58~119 | 45604830101·45604840722·45620020752·45620027222 | Palacio Jetta Racerback Bra `/palacio-jetta-racerback-bra-check-usw426033/` · Seamless Halle Halter Top `/seamless-halle-halter-top-cream-usw326095/` · Castilla Clementine Knit Crew `/castilla-clementine-knit-crew-olive-usw126120/` |
| Reformation | 크롬 · 합치기 | srv 57·1·27·0~56·36 | 613·50·61·600·168 (535, 상한 전) | 45604830101·45604840722 | Bia Top `/products/bia-top/1321186FDL.html` · Calie Tank `/products/calie-tank/1310381EDS.html` · Clara Cashmere Crew Cardigan `/products/clara-cashmere-crew-cardigan/1312652BLK.html` |
| Sessun | impit · 합치기 | srv 하루 81(사진 주소 조각 섞임) | 47·27·17·25·95 (211) | 45604834917·45604846574 | Serge `/catalogue/t-shirts/serge-navy.html` · Serge co `/catalogue/t-shirts/serge-co-black.html` · Chebbi `/catalogue/sweatshirts/chebbi-black-granit.html` |
| Whitestuff | impit · 합치기 | srv 60·60·1~48·42·73·28 | 110·157·170·111·127·131 (664) | 45598952305·45598969872·45604834917·45604846574 | Nelly Embroidered T-Shirt `/p/7267/nelly-embroidered-t-shirt/BRIL_WHITE` · Iris Linen Tee `/p/9491/442987-iris-linen-tee/IVORY_PR` · Lizzie Long Sleeve Embroidery Top `/p/9510/448922-…/NAVY_MULTI` |
| Bash | 크롬 · 합치기 | srv 4·4·4·10~24·7 | 35·38·97·107·76 (295) | 45604834917·45604846574 | T-shirt IONI `/fr/en/p/t-shirt-ioni-kaki-3667436072215.html` · Tank top SHADEY `/p/tank-top-shadey-champagne-3667436159237.html` · BAPY Sweatshirt `/p/bapy-sweatshirt-ecru-3667436160745.html` |
| Vanessa bruno | 크롬 · 합치기 | srv tops 6 · 나머지 0 | tops 4+2 · knit(엑셀 주소) 9 · 셔츠 77 · 원피스 41 · 바지 25 (207) | 45604834917·45604846574 | Camomille t-shirt `/p/camomille-t-shirt-45499.html` · Glendon t-shirt `/p/glendon-t-shirt-52710.html` · Glycine tank top `/p/glycine-tank-top-53999.html` |

### 2-2. 수집기 규칙으로 고친 Render 그룹 브랜드(엔진 그대로)

| 브랜드 | 전 | 후 | 실행 | 표본 |
|---|---|---|---|---|
| Carhartt | hl 77·78·62·61·25(표본 5개가 전부 /c/ 메뉴 타일) | 24·25·11·10·1 — 전부 `/product/` | 45598948052·45598964123·45604830101·45604840722·45620020752·45620027222 | Women's TENCEL Loose Floral T-Shirt `/product/107478/…` · TENCEL Long-Sleeve Logo T-Shirt `/product/106574/…` · TENCEL Full-Zip Sweatshirt `/product/106837/…` |
| Nike | hl 150·174·139·86(표본 5개가 /w/ 필터 링크) | 216·216·140·216 — `/t/` 상품 | 같음 | Jordan Flight Fleece Corset `/t/…/IM6788-010` · Sportswear T-Shirt `/t/…/IM3777-437` · ACG "Wolf Tree" Pants `/t/…/HJ0241-009` |
| Oysho(확장 쪽) | 확장 20개 전부 `-n5063` 카테고리 타일 | 수집기 규칙으로 타일이 걸러짐(확장 재설치 뒤 적용). 데이터센터 파이어폭스로는 448개 읽히지만 한 번에 46분이라 넣지 않음 | 45605800257·45605806955·45620020752·45620027222 | Extra-fine lyocell-blend T-shirt `/gb/…-l37581348` · Half-zip sweatshirt `/gb/…-l36923158` · Perfect-adapt long jumpsuit `/gb/…-l30792232` |

### 2-3. 넣지 않은 브랜드와 이유(모두 측정)

| 브랜드 | 이유 |
|---|---|
| Arket · &Other Stories · L.L bean · Wilson | 열리고 브랜드 합계는 확장보다 많거나 비슷하지만(370~381 · 470~479 · 296 · 83~96) **URL 하나 이상이 확장 저장 수보다 적음**(Arket 셔츠 114~117 < 119, Stories sweatshirts 6 < 12, L.L.Bean tees 109 < 126, Wilson tanks 14~16 < 19). 확장 쪽 수에 메뉴·공용 링크가 섞여 있을 가능성이 있지만(추정) 규칙대로 넣지 않음 |
| Ann Taylor · Loft | 지도 측정 땐 impit 이 열렸으나 이번 2회는 PerimeterX 확인 화면·오류 페이지로 넘어감 |
| Massimo Dutti | 파이어폭스+새 창 114~228개 < 확장 603 |
| Madewell | 데이터센터 크롬으론 상품 대신 공용 기획전 링크만 보임(6개) |
| Garnet hill | 첫 URL 10개, 나머지 0 |
| Oysho | 열리고 448개지만 46분 — 야간 시간 예산에 못 넣음 |
| Aritzia | 사이트의 검색 API(Algolia)는 데이터센터에서 열림(4회 509~510개) — 확장 800 에 못 미침. `api` 엔진(`scripts/listing-api.mjs`)은 준비돼 있음 |
| The white company | `/us/` 주소로도 0개 — 지역 문제 그대로 |
| Dickies · Good American · James Perse · Nation LTD · vineyardvines | 헤드리스가 일부 카테고리에서 서버보다 적음(Dickies hoodies 44<48, Good American jeanius-sweats 13<35, James Perse tanks 11<40, Nation tops 30<97, vineyardvines tees 21<93) — 서버 유지 |
| Monsoon | 1차 impit 174개(서버 30) → 2차 0개(그리드가 메뉴 칸 안에 있어 새 규칙에 걸림 — 고침). 고친 코드로 2회 재측정을 못 해 넣지 않음 |
| Lucky Brand | 대체 주소도 읽는 중 다른 페이지로 넘어감 — URL 표 참고 |

### 2-4. 새 수집기 규칙이 Render 그룹(이미 매일 도는 23개)에 준 영향 — 3차 측정(run 45620020752·45620027222)

대부분 URL 마다 3~6개씩 줄었습니다 — 매 페이지 똑같이 붙던 메뉴·공용 링크가 빠진 것으로 봅니다(추정, 표본은 진짜 상품).
눈에 띄게 줄어든 곳은 owner 가 확인할 필요가 있습니다:

- **Leset sweat-sets 176 → 5** — 이 페이지는 세트(컬렉션) 타일을 보여 주는데, 새 `/collections/` 규칙이 그 타일을 상품에서 뺐습니다. 이전 176개가 진짜 상품이었는지 세트 타일이었는지는 확인 못 함
- **Sweaty betty 36·36·23·39 → 27·27·13·26**, **Me+Em t-shirts 64 → 48 · sweatshirts 22 → 7**, **J crew 59~73 → 32~62**, **Shopbop 237~246 → 207~214** — 표본은 진짜 상품. 빠진 것이 메뉴 링크인지 상품인지 확인 못 함
- Carhartt 148 → 71 은 메뉴 타일이 빠진 것(측정 표본으로 확인)

Worker 는 이전 저장본의 절반 아래로 줄면 갈아끼우지 않고 합치므로(축소 가드) 카탈로그가 한 번에 크게 줄지는 않습니다.
이 브랜치의 수집기는 한 화면씩 내려가며 읽어 시간이 늘었습니다(Render 그룹 55분 → 86분). 그래서 야간 시간 예산을 '잡 시작부터 105분'으로 바꿨습니다.

## 3. URL 문제 — 바꿀 주소 제안 (owner 결정 필요 · 엑셀 URL 은 바꾸지 않았음)

| 브랜드 | 지금 URL | 제안 URL | 본 상품 수(지금 → 제안) | 근거 |
|---|---|---|---|---|
| Good American | `/en-kr/collections/tees-tanks` | `/collections/tees-tanks` | 136 → 134 | 측정 run 45598952305·45598969872(크롬) — 두 주소가 같은 목록 |
| Good American | `/en-kr/collections/womens-tops` | `/collections/womens-tops` | 353 → 353 | 같음 |
| Good American | `/en-kr/collections/dresses` | `/collections/dresses` | 93 → 93 | 같음 |
| Good American | `/en-kr/collections/bottoms` | `/collections/bottoms` | 101 → 101 | 같음 |
| Monsoon | `/kr/womens/womens-clothing/tops/` | `/us/womens/womens-clothing/tops/` | 50 → 50 | 측정(impit) — `/kr/` 는 미국 IP 에서 `/us/women/womens-clothing/tops-blouses/` 로 넘어감 |
| Monsoon | `/kr/womens/womens-clothing/knitwear/` | `/us/womens/womens-clothing/knitwear/` | 65~66 → 68 | 같음 |
| Monsoon | `/kr/womens/dresses/` | `/us/womens/dresses/` | 62 → 62 | 같음 |
| Monsoon | `/kr/womens/womens-clothing/trousers-shorts/` | `/us/womens/womens-clothing/trousers-shorts/` | 15 → 15 | 같음(미국에선 pants-shorts 로 넘어감) |
| Madewell | `/kr/womens/clothing/tees/` 등 4개 | `/womens/clothing/tees/` 등(`/kr` 빼기) | 같은 수(23·26·22·23) | 측정 — 같은 페이지. 다만 데이터센터 크롬으로는 상품 대신 공용 기획전 링크만 보여 '읽기' 문제는 남음 |
| Vanessa bruno | `/last-chance/knitwear.html` | `/clothing/knitwear.html` | 9~20 → 53~73 | 측정 run 45598952305·45598969872·45604834917·45604846574 — 지금 주소는 첫 화면으로 튕겨 다른 상품을 보여 줌 |
| Lucky Brand | `/women/clothing/shirts/blouses` | (제안 없음) | 0 → — | 측정: 이 주소는 읽는 도중 검색 페이지로 바뀜. `/women/clothing/shirts`(같은 현상)·`/women/clothing/tops`(16, 기획전 타일 위주)도 대안이 못 됨 |
| Carhartt(참고) | `/en-eu/c/women/trousers-jeans/sweatpants/euw3000017` | (owner 확인) | 0~2 | 측정 — 미국 IP 에서 다른 곳으로 넘어감. 미국 사이트의 여성 바지 카테고리로 바꾸는 것이 맞아 보임(추정) |

수집할 때 주소를 고쳐 쓰는 규칙(`/en-kr/` 빼기 등)은 **넣지 않았습니다** — 미국 IP 에서는 지금 주소도 같은 목록으로 열리기 때문에(측정) 고칠 필요가 없었습니다. 위 표는 가격 통화·지역을 분명히 하려면 엑셀 주소를 바꾸시라는 제안입니다.

## 4. 서버 담당 브랜드

`docs/server-listing-notes.md` — 서버가 적게 읽는 원인과 고치는 안.
