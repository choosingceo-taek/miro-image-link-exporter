# 상품 정보 현장 지도 (field map)

> 만든 때 2026-11-25T17:03Z · 측정 실행 45598506233(1/3, 러너 20.189.190.x) · 45598511317(2/3, 러너 4.249.22.x) · 45598515028(3/3, 러너 132.196.80.x) · 45601690170(1/3, 러너 4.236.91.x) · 45601695189(2/3, 러너 172.190.119.x) · 45601700145(3/3, 러너 134.138.58.x) · 45618009481(1/3, 러너 20.57.38.x)
> 만드는 법: `node scripts/build-field-map.mjs` — 측정은 `diagnose-page.yml` mode=fields(읽기만, 로그에 `STORE: 0`).

## 한눈에

브랜드마다 카탈로그에서 상품 3개(앞·가운데·끝)를 골라 상품 페이지를 무료 엔진(impit → 파이어폭스)으로 열고, 항목마다 읽히는지와 어디서 읽히는지를 쟀다. 상품 페이지는 브랜드 110/134개에서 읽혔고(24개는 막힘, 0개는 표본 없음), 카탈로그 상품은 모두 38,520개다.

| 항목 | 읽히는 브랜드 | 그 브랜드의 카탈로그 상품(추정) | 읽혔는데 없음(브랜드) | 막힘(브랜드) | 주된 출처 |
|---|---:|---:|---:|---:|---|
| 상품명 | 105 | 30,009 (78%) | 5 | 24 | Shopify JSON 56 · JSON-LD 51 |
| 사진 전부 | 103 | 29,332 (76%) | 7 | 24 | Shopify JSON 56 · JSON-LD 49 · 메타 태그 2 |
| 판매가 | 104 | 29,839 (77%) | 6 | 24 | Shopify JSON 56 · JSON-LD 50 |
| 정가(할인 시) | 26 | 8,031 (21%) | 84 | 24 | Shopify JSON 22 · JSON-LD 4 |
| 통화 | 102 | 29,510 (77%) | 8 | 24 | JSON-LD 100 · 메타 태그 4 |
| 이 상품 컬러 | 88 | 25,445 (66%) | 22 | 24 | 본문 75 · JSON-LD 14 |
| 컬러 전부 | 73 | 20,689 (54%) | 37 | 24 | Shopify JSON 44 · JSON-LD 29 |
| 사이즈 | 67 | 20,137 (52%) | 43 | 24 | Shopify JSON 52 · JSON-LD 15 |
| 재고 사이즈 | 62 | 18,558 (48%) | 48 | 24 | Shopify JSON 50 · JSON-LD 12 |
| 혼용률 | 98 | 27,922 (72%) | 12 | 24 | 본문 92 · JSON-LD 6 · 페이지 JSON 1 |
| 설명 | 106 | 30,319 (79%) | 4 | 24 | Shopify JSON 53 · JSON-LD 52 · 메타 태그 9 |
| 디테일 글머리표 | 87 | 25,857 (67%) | 23 | 24 | 본문 칸 82 · Shopify JSON 9 |
| 상품 코드 | 104 | 29,584 (77%) | 6 | 24 | Shopify JSON 56 · JSON-LD 50 |

- **측정한 것**: 표본 상품 페이지에서 그 항목이 읽혔는지·출처(칸마다 n/r). **추정한 것**: '카탈로그 상품' 열 — 표본 3개에서 읽히면 그 브랜드의 상품 전부가 같은 틀이라고 보고 더한 값이다.
- '읽히는 브랜드' = 읽힌 표본의 절반 이상에서 그 항목이 나온 브랜드.

### 사이즈·컬러·가격 — 오늘 저장값과 페이지에서 읽히는 몫

| 항목 | 오늘 저장값(오버레이, 측정) | 페이지에서 읽히는 브랜드를 다 채우면(추정) |
|---|---:|---:|
| 사이즈 | 16,564/38,520 (43%) | 20,944/38,520 (54%) |
| 컬러 | 25,164/38,520 (65%) | 29,675/38,520 (77%) |
| 가격 | 24,051/38,520 (62%) | 31,528/38,520 (82%) |
| 혼용률 | 28,625/38,520 (74%) | 33,340/38,520 (87%) |

가격은 카탈로그(목록 수집)에도 있어 화면에는 그쪽이 먼저 쓰인다 — 위 저장값은 오버레이(상품 페이지에서 읽은 값)만 센 것이다.

### 이 지도를 바탕으로 바꾼 것 (작업 브랜치에만 — 운영 반영은 담당자 승인 뒤)

- **상품 상세 추출기**(worker/fabric-extractor.js 의 '상품 상세(detail) 추출' 구간): 설명 · 디테일 글머리표 · 사진 전부 · 컬러 전부 · 상품 코드 · 통화 · 재고 사이즈, 그리고 사이즈·가격·정가·컬러를 위 표의 출처 순서(Shopify JSON → JSON-LD → 메타 → 제목 붙은 본문 칸)로 읽는다.
- **지키는 규칙**: 메뉴·사이트 머리/꼬리·추천 칸("Pair it with", "You may also like")·리뷰 칸의 글은 빼고, 제목 칸의 경계(부모 칸이 닫히는 곳)에서 멈춘다. 이 상품의 이름이 화면에 그려진 페이지에서만 믿는다. 브랜드 상품 대부분에 똑같이 붙는 글(배송 안내·브랜드 소개)은 저장 직전 가드가 뺀다(scripts/detail-guard.mjs).
- **길이 상한**: 설명 1,500자 · 글머리표 25줄(줄당 220자) · 사진 20장 · 컬러 30개 · 사이즈 40개 · 상품 코드 60자. 글은 사이트에 적힌 그대로(공백만 정리, 번역·고쳐 쓰기 없음).
- **저장**: Worker 의 별도 칸 detail:<사이트>(혼용률 오버레이와 나눔 — 이유는 worker/README.md). 엑셀 추출·상세 보기 때만 받는다.
- **연결**: 야간 보강(enrich-comp.mjs) · 크롬 보강(enrich-comp-browser.mjs) · 확장 1.7.24(background.js) · 리서치 앱(상세 보기, 엑셀 추가 열: 판매가 · 정가 · 사이즈 · 컬러 전부 · 설명 · 디테일 · 이미지 링크).
- **혼용률 보완**: Massimo Dutti 형(소재가 페이지 JSON parts/components 에만) · JSON-LD 소재가 옳지 않으면 본문으로(Buck Mason) · 평 fetch 가 TLS 지문으로 막히면 impit 으로 다시(Whitestuff·J.Crew 형).

### 무료로 읽히는데 혼용률이 빈 브랜드 — 야간 보강이 왜 못 채웠나

오버레이(Worker 의 comp:<사이트>)에 남은 시도 기록을 측정 실행이 읽어 센 것(측정). '5일 안 시도·빈 칸' = 지난 5일 안에 열어 봤지만 혼용률이 비어 있는 상품 — 야간 보강은 이런 상품을 5일 동안 다시 열지 않는다(재시도 창). 오늘 측정 열은 같은 브랜드 표본을 오늘 무료 엔진으로 연 결과.

| 브랜드 | 상품 | 혼용률 저장 | 시도 기록 | 5일 안 시도·빈 칸 | 사이트 미표기(none) | 오늘 측정(혼용률) | 오늘 읽은 엔진 |
|---|---:|---:|---:|---:|---:|---|---|
| Buck Mason | 119 | 57 | 117 | 62 | 5 | ✅ 2/3 JSON-LD | firefox/impit |
| Dickies | 260 | 144 | 260 | 116 | 0 | ✅ 2/3 본문 | firefox/impit |
| Everlane | 443 | 315 | 443 | 128 | 14 | ✅ 2/3 본문 | firefox/impit |
| Mint velvet | 416 | 293 | 416 | 123 | 23 | ✅ 3/3 본문 | firefox/impit |
| Spanx | 84 | 66 | 84 | 18 | 0 | ✅ 2/3 본문 | firefox/impit |
| Wilson | 52 | 28 | 52 | 24 | 0 | ✅ 1/3 본문 | firefox/impit |
| Poetry | 303 | 240 | 303 | 63 | 4 | ✅ 3/3 본문 | firefox/impit |
| Whitestuff | 184 | 143 | 184 | 41 | 0 | ✅ 3/3 본문 | firefox/impit |
| J crew | 215 | 63 | 215 | 152 | 0 | ✅ 2/2 본문 | firefox |
| Massimo Dutti | 603 | 3 | 603 | 600 | 462 | ✅ 2/2 페이지 JSON | firefox |

### 혼용률 두 번째 증인 — 글머리표와 견준 결과

같은 페이지를 두 번 읽은 것이다: 혼용률 칸(comp — JSON-LD·본문 창·페이지 JSON)과 디테일 글머리표·설명 속 '퍼센트+섬유' 줄(제목 붙은 본문 칸). 측정 표본 중 글머리표에 소재 줄이 있는 196개 가운데 **20개가 어긋났다**(측정 당시 규칙). 어긋난 표본은 증인 측정(45623658964, 읽기만)이 HTML 을 다시 받아 남겼고(scripts/fixtures/witness), 판정은 그 HTML 을 사람이 읽고 적었다. '운영 저장값'은 같은 실행이 Worker 오버레이에서 읽은 값(쓰기 없음), '지금 규칙'은 이번에 고친 추출기로 같은 HTML 을 다시 읽은 값.

| 브랜드 | 상품 | 측정 때 comp | 글머리표·설명의 소재 줄 | 판정(페이지 기준) | 운영 저장값 | 지금 규칙 | 근거 |
|---|---|---|---|---|---|---|---|
| Chico's | https://www.chicos.com/store/product/printed-metallic-crinkle-clip-dot-ruffled-blouse/570422433?inseam=regular&sizeType=regular&color=001&catId=cat11199294&collectionId=category&queryId=c6f79d5a1bbc0a981c717e4593a53507&indexName=prod_chs_products&parentId=199761600533 | Polyester 99% | 99% Polyester, 1% Lurex. | 판정 없음 | — | — |  |
| Faherty | https://fahertybrand.com/products/sunseeker-dress-sausalito-sunset | (빈 칸) | Material: 70% LIVA REVIVA™ Viscose, 30% CIRCULOSE® Viscose | 글머리표가 맞음 | (빈 칸) | Viscose 100% | 같은 섬유(비스코스) 둘 — 예전 규칙은 둘째 비스코스에서 끊어 조각만 남아 빈 칸. 지금 규칙은 더해 Viscose 100%. |
| Oak + Fort | https://oakandfort.ca/products/knit-sleeveless-midi-dress-dr-15785-w | (빈 칸) | 55% Cotton, 43% Polyester, 2% Spandex / Exclusive of trims | 글머리표가 맞음 | Cotton 55% / Polyester 43% / Elastane 2% | Cotton 55% / Polyester 43% / Elastane 2% | 창 안에 추천 카드의 '100% WOOL …'·'100% Merino Wool' 가 함께 있어 비웠다. 지금 규칙은 소재 제목 바로 뒤 줄을 고른다. 운영 저장값은 이미 옳다(다른 경로). |
| Oak + Fort | https://oakandfort.ca/products/striped-cotton-poplin-pajama-style-pant-pt-13613-w | (빈 칸) | 100% Cotton/ Exclusive of trims | 글머리표가 맞음 | Cotton 100% | Cotton 100% | 위와 같은 모양. 지금 규칙 Cotton 100%. 운영 저장값은 이미 옳다. |
| Rag & bone | https://www.rag-bone.com/p/rb-miramar-dahlia-flare-pant-RC7525H7MPO.html | Viscose 72% / Nylon 23% / Elastane 5% Cotton 100% | Body: 72% rayon, 23% polyamide, 5% elastane; Pocketing: 100% cotton | 글머리표가 맞음 | Viscose 72% / Nylon 23% / Elastane 5% / Cotton 100% | Viscose 72% / Nylon 23% / Elastane 5% | comp 가 주머니감 줄을 덧붙였다. 운영 저장값은 한 줄 합 200%('… / Cotton 100%') 로 틀림. 지금 규칙 Viscose 72% / Nylon 23% / Elastane 5%. |
| Boden | https://us.boden.com/products/women-lace-trim-v-neck-velvet-top-beetroot-red-t2259red | Polyester 100% | Main: 50% recycled polyester, 30% polyester, 20% elastane ¶ Trims: 100% polyester | 글머리표가 맞음 | Polyester 100% | Polyester 80% / Elastane 20% | comp 가 장식(Trims) 줄을 집었다. 운영 저장값 Polyester 100% — 틀림. 지금 규칙 Polyester 80% / Elastane 20%. |
| vineyardvines | https://www.vineyardvines.com/product/womens-woven-tops/ella-jacquard-top/2W002201.html | (빈 칸) | 81% nylon, 19% metallic | 판정 없음 | — | — | 글머리표 — 페이지에 혼용률이 적혀 있는데 comp 가 못 읽음 |
| Jager | https://www.marksandspencer.com/cotton-rich-cord-wide-leg-trousers/p/clp23084829#intid=pid_pg4pip48g2r20c2%7Cprodflag_Online%20Only | Cotton 99% / Elastane 1% Polyester 65% / Cotton 35% | Main - 99% cotton, 1% elastane, Pocketing - 65% polyester, 35% cotton | 글머리표가 맞음 | Cotton 99% / Elastane 1% / Polyester 65% / Cotton 35% | Cotton 99% / Elastane 1% | comp 가 주머니감을 덧붙였다. 운영 저장값은 한 줄 합 200% — 틀림. 지금 규칙 Cotton 99% / Elastane 1%. |
| Oasis | https://www.oasisfashion.com/product/oasis-volume-sleeve-sweatshirt-with-cotton-collar_baa13417?colour=antique+rose | Cotton 100% Cotton 98% / Elastane 2% | Shell: 100% Cotton. Trim: 98% Cotton. 2% Elastane. Machine washable. Model wears size 10. | 글머리표가 맞음 | Cotton 100% Cotton 98% / Elastane 2% | Cotton 100% | comp 가 장식 줄을 둘째 줄로 붙였다. 운영 저장값 'Cotton 100% ‖ Cotton 98% / Elastane 2%' — 둘째 줄 틀림. 지금 규칙 Cotton 100%. |
| Oasis | https://www.oasisfashion.com/product/adrianna-papell-a-line-jacquard-short-dress_p-ace2a577-0392-494f-9405-fbe25bcd132a?colour=Multi | Polyester 97% | 97% Polyester, 3% Metallic. Dry Clean. Model wears a Size 8. | 판정 없음 | — | — | 판단 필요 — 글머리표 한 줄(이름표 없음)과 comp 가 다르다 |
| Outdoorvoices | https://www.outdoorvoices.com/products/w-waffle-baby-tee-white | (빈 칸) | Fitted baby tee in new waffle knit fabric - made of 100% cotton. | 페이지 못 읽음 | Cotton 100% | (못 읽음) | 증인 측정에서는 impit·파이어폭스 모두 껍데기라 HTML 을 못 남겼다. 측정 표본의 설명 글로는 글머리표가 맞다(추정). |
| Tuckernuck | https://tnuck.com/products/cream-kaiya-floral-top | (빈 칸) | Material: 100% Cotton (main), 73% Cotton, 27% Nylon (combo), 100% Viscose (embroidery) | 글머리표가 맞음 | — | — | 세 조성이라 비웠다. 지금 규칙(괄호 부위 · combo 는 배색)으로 Cotton 100% — 측정 시험 자료(scripts/fixtures/pages/tuckernuck.html.gz)에서 확인. |
| Tuckernuck | https://tnuck.com/products/blue-shira-embroidered-midi-dress | (빈 칸) | Material: 100% Cotton (outer), 100% Viscose (embroidery), 100% Polyester (lace) | 글머리표가 맞음 | (빈 칸) | Cotton 100% | 세 조성이라 비웠다. 지금 규칙은 괄호 속 부위로 겉감만: Cotton 100%. |
| Z Supply | https://zsupplyclothing.com/products/downhome-pant | (빈 칸) | Silky Pointelle: 95% Polyester, 5% Spandex | 글머리표가 맞음 | Cotton 100% | Polyester 95% / Elastane 5% | 운영 저장값 Cotton 100% 는 메뉴 글('100% Cotton Shop')을 읽은 것 — 틀림. 지금 규칙은 빈 칸(메뉴 조각과 섞여 판단 보류). 옳은 값은 Polyester 95% / Elastane 5%. |
| Everlane | https://www.everlane.com/products/womens-boyfriend-shirt-cotton-optic-white-black | (빈 칸) | 100% Organic Cotton | 글머리표가 맞음 | (빈 칸) | Cotton 100% | 측정 때는 빈 칸. 지금 규칙 Cotton 100%. 운영 저장값도 빈 칸. |
| Goldie | https://www.goldietees.com/products/allure-tee | Cotton 100% | 50% cotton, 50% polyester | 글머리표가 맞음 | Cotton 50% / Polyester 50% | Cotton 50% / Polyester 50% | 측정 때 comp 는 원단 안내 칸을 읽었다. 운영 저장값은 이미 옳다(Cotton 50% / Polyester 50%). 지금 규칙도 옳다. |
| Hobbs | https://www.hobbs.com/us/product/middleton-pants-with-wool-/0224-8631-9044L00-GREY-BLACK.html | Wool 59% / Polyester 30% / Polyamide 7% / Other Fibres 3% / Elastane 1% | Fabric: 59% Wool 30% Polyester 7% Polyamide 3% Other fibres 1% Elastane ¶ Lining: Pocket Lining: 100% Polyester ¶ Fabric Composition: 59% Wool 30% Polyester 7% Polyamide 3% Other fibres 1% Elastane | comp 가 맞음 | Wool 59% / Polyester 30% / Polyamide 7% / Other Fibres 3% / Elastane 1% | Wool 59% / Polyester 30% / Polyamide 7% / Other Fibres 3% / Elastane 1% | comp(JSON-LD)가 'Other Fibres 3%' 까지 옳다. 증인(글머리표 해석)이 'Other fibres' 를 섬유로 몰라 97% 로 읽었을 뿐. |
| Jigsaw | https://www.jigsaw-online.com/products/jersey-blake-trouser-black | Cotton 60% / Polyester 38% / Elastane 2% Cotton 100% | Main : 60% Cotton, 38% Polyester, ¶ Lining : 100% Cotton | comp 가 맞음 | Cotton 60% / Polyester 38% / Elastane 2% Cotton 100% | Cotton 60% / Polyester 38% / Elastane 2% Cotton 100% | comp(겉감+안감 두 줄)가 옳다. 측정 글머리표가 2% Elastane 앞에서 잘렸다. |
| The Great | https://thisisthegreat.com/collections/knit-shop-sweatshirts/products/the-slouch-sweatshirt-dark-slate | Modal 100% | 100% Cotton | 글머리표가 맞음 | Modal 100% | Cotton 100% | 측정·운영 저장값 Modal 100% 는 틀림(다른 상품 글로 보임). 지금 규칙 Cotton 100%. |
| Vince | https://www.vince.com/product/pima-cotton-crew-neck-t-shirt-V017384404REDOCHRE.html | Pima Cotton 100% | Our tees are informed by the desire to feel comfortable in one's own skin, which is why we've crafted this one from 100% Pima cotton — a fiber beloved for its i | comp 가 맞음 | Pima Cotton 100% | Pima Cotton 100% | 같은 값 — comp 는 'Pima Cotton', 증인은 'Cotton' 으로 이름만 다르게 적었다. |

시험 자료(사람이 기대값을 적은 실제 페이지 43개)를 지금 규칙으로 같은 비교: 소재 줄이 있는 31개 중 어긋남 0개.

### 운영에 이미 저장된 혼용률 — 지금 규칙으로 다시 읽으면

어긋남이 나온 브랜드의 카탈로그 상품을 전부 impit 으로 다시 열어(읽기만 — 로그 `STORE: 0`, 실행 45632693720 · 45632699869 · 45650636663 · 45650645698 · 45650717311), Worker 오버레이에 저장된 값과 고친 추출기의 값을 견줬다. **세지만 고치지 않았다** — 운영 값은 다음 야간 보강이 새 규칙으로 다시 쓸 때 바뀐다(담당자 승인 뒤).

| 브랜드 | 실행 | 상품 | 다시 읽힘 | 저장값 있음 | 같음 | 다름 — 덧붙은 줄(장식·주머니감 등)만 빠짐 | 다름 — 값이 바뀜 | 다름 — 지금 규칙은 빈 칸 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Oasis | 45650636663 | 133 | 133 | 120 | 113 | 2 | 5 | 0 |
| Rag & bone | 45650636663 | 244 | 239 | 241 | 223 | 2 | 11 | 0 |
| Boden | 45650636663 | 331 | 317 | 309 | 262 | 23 | 23 | 1 |
| Bellerose | 45650717311 | 231 | 231 | 214 | 176 | 8 | 21 | 9 |
| CCC | 45650717311 | 358 | 355 | 338 | 310 | 25 | 0 | 0 |
| Jigsaw | 45650645698 | 315 | 137 | 304 | 105 | 5 | 7 | 15 |
| Jager | 45650717311 | 400 | 400 | 381 | 351 | 3 | 27 | 0 |
| The Great | 45650645698 | 240 | 240 | 238 | 144 | 0 | 93 | 1 |
| Tuckernuck | 45650717311 | 376 | 376 | 339 | 317 | 13 | 7 | 2 |
| Z Supply | 45650645698 | 216 | 216 | 216 | 113 | 0 | 98 | 5 |

보기(브랜드·갈래마다 2개, 그리고 HTML 을 받아 사람이 판정한 것 전부 — scripts/fixtures/witness/recheck-verdicts.json):

| 브랜드 | 상품 | 갈래 | 운영 저장값 | 지금 규칙 | 판정(HTML 을 읽고) |
|---|---|---|---|---|---|
| Oasis | https://www.oasisfashion.com/product/oasis-volume-sleeve-sweatshirt-with-cotton-collar_baa13417?colour=antique+rose | 덧붙은 줄만 빠짐 | Cotton 100% ‖ Cotton 98% / Elastane 2% | Cotton 100% | — |
| Oasis | https://www.oasisfashion.com/product/oasis-volume-sleeve-sweatshirt-with-satin-scarf_baa13419?colour=grey+marl | 덧붙은 줄만 빠짐 | Cotton 100% ‖ Cotton 98% / Elastane 2% | Cotton 100% | — |
| Oasis | https://www.oasisfashion.com/product/roman-metallic-stripe-tie-neck-shirt_p-d2510c73-596c-4639-9bf0-b7c5b1c1a031?colour=Black | 값이 바뀜 | Viscose 96% | Viscose 96% / Metallic 4% | — |
| Oasis | https://www.oasisfashion.com/product/blue-vanilla-gold-long-sleeve-turtleneck-blouse_p-db13ef21-179d-4465-a045-5c809ad99f0c?colour=Gold | 값이 바뀜 | Polyester 100% | Nylon 60% / Metallic 40% ‖ Polyester 100% | 지금 규칙이 맞음 — Main 60% Nylon, 40% Metal · Lining 100% Polyester — 저장값은 안감만. |
| Oasis | https://www.oasisfashion.com/product/coast-coast-muse-burnout-velvet-long-sleeve-maxi-dress-with-gold-trim_bcc14057?colour=olive | 값이 바뀜 | Polyester 96% / Elastane 4% | Polyester 88% / Metallic 8% / Elastane 4% ‖ Polyester 96% / Elastane 4% | 지금 규칙이 맞음 — Main 88% Polyester 8% Metallic 4% Elastane · Lining 96% Polyester 4% Elastane — 저장값은 안감만. |
| Rag & bone | https://www.rag-bone.com/p/vintage-terry-tee-RE9J26PT3VW_960.html | 값이 바뀜 | Cotton 78% / Polyester 22% / Elastane 2% | Cotton 78% / Polyester 22% | 지금 규칙이 맞음 — Body 78% cotton, 22% polyester · Rib trim 98% cotton, 2% elastane — 저장값은 리브의 2% elastane 을 겉감에 붙였다(합 102%). |
| Rag & bone | https://www.rag-bone.com/p/lucy-merino-wool-henley-RG4F26F6MMN_110.html | 값이 바뀜 | Wool 100% / Cotton 100% | Wool 100% | 지금 규칙이 맞음 — Body 100% wool · Trim 100% cotton — 저장값은 장식(Trim)을 겉감 줄에 붙여 합 200%. |
| Rag & bone | https://www.rag-bone.com/p/ariana-satin-slip-dress-RA5D26S3MSW.html | 덧붙은 줄만 빠짐 | Polyester 100% ‖ Viscose 100% | Polyester 100% | 지금 규칙이 맞음 — Body 100% polyester · Trim 100% viscose — 저장값 둘째 줄은 장식. |
| Rag & bone | https://www.rag-bone.com/p/melanie-track-pant-RAFJ26F7MTA_001.html | 덧붙은 줄만 빠짐 | Wool 100% ‖ Polyester 100% | Wool 100% | — |
| Rag & bone | https://www.rag-bone.com/p/cam-refine-knit-pant-RE7Z26F71PW.html | 값이 바뀜 | Viscose 66% / Nylon 30% / Elastane 4% / Polyester 94% | Viscose 66% / Nylon 30% / Elastane 4% ‖ Polyester 94% / Elastane 6% | 지금 규칙이 맞음 — Body + Lining — 저장값은 안감 조각(Polyester 94%)을 겉감 줄에 붙였다(합 194%). |
| Boden | https://us.boden.com/products/women-lace-trim-v-neck-velvet-top-beetroot-red-t2259red | 값이 바뀜 | Polyester 100% | Polyester 80% / Elastane 20% | — |
| Boden | https://us.boden.com/products/women-carmen-lace-trim-insert-top-deep-aurora-blue-t2243blu | 덧붙은 줄만 빠짐 | Polyester 99% / Elastane 1% ‖ Cotton 100% | Polyester 99% / Elastane 1% | — |
| Boden | https://us.boden.com/products/women-carmen-lace-trim-insert-top-pink-violet-t2243pnt | 덧붙은 줄만 빠짐 | Polyester 99% / Elastane 1% ‖ Cotton 100% | Polyester 99% / Elastane 1% | — |
| Boden | https://us.boden.com/products/women-tulle-mix-velvet-top-dark-chocolate-t2257brn | 값이 바뀜 | Polyester 100% | Polyester 90% / Elastane 10% | — |
| Boden | https://us.boden.com/products/women-ruffle-v-neck-lace-top-deep-wisteria-t2180red | 값이 바뀜 | Viscose 100% / Cotton 75% / Nylon 25% | Viscose 100% | 지금 규칙이 맞음 — Main 100% viscose · Lace 75% cotton, 25% nylon — 저장값은 레이스를 겉감 줄에 붙였다(합 200%). |
| Boden | https://us.boden.com/products/women-honor-column-velvet-midi-dress-harbour-blue-d1849blu | 값이 바뀜 | Polyester 100% | Polyester 90% / Elastane 10% ‖ Polyester 100% | 지금 규칙이 맞음 — Main 60% recycled polyester, 30% polyester, 10% elastane · Bodice lining 100% recycled polyester — 저장값은 안감만. |
| Boden | https://us.boden.com/products/women-louise-cord-midi-shirt-dress-storm-blue-d1786blu | 지금 규칙은 빈 칸 | Cotton 100% | Cotton 100% | 저장값이 맞음 — Main 100% cotton — 저장값이 맞다. 재확인 실행에서 빈 칸이었던 것은 그때 impit 이 페이지 본문을 못 받은 탓(같은 규칙으로 이 HTML 은 Cotton 100%). |
| Bellerose | https://bellerose.com/products/women-t-shirts-fiores-dusty-rose | 값이 바뀜 | Cotton 100% / Wool 100% | Cotton 100% | 지금 규칙이 맞음 — Shell fabric 100% Cotton — 저장값의 Wool 100% 는 다른 곳의 글. |
| Bellerose | https://bellerose.com/products/women-t-shirts-mendy-h-grey | 값이 바뀜 | Elastane 4% / Cotton 36% / Polyester 36% / Viscose 24% / Leather 100% | Elastane 4% / Cotton 36% / Polyester 36% / Viscose 24% | — |
| Bellerose | https://bellerose.com/products/women-knitwear-anglet-stripe-a-bw262940-k1356s | 지금 규칙은 빈 칸 | Cotton 63% / Polyester 37% | (빈 칸) | 둘 다 아님 — 페이지 표기 합 178% — 저장값 Cotton 63% / Polyester 37% 는 뒤 두 숫자만 고른 추측. 지금 규칙은 빈 칸. |
| Bellerose | https://bellerose.com/products/women-sweatshirts-tood-combo-b | 지금 규칙은 빈 칸 | Wool 100% / Elastane 4% | (빈 칸) | — |
| Bellerose | https://bellerose.com/products/women-knitwear-anglet-anthracite | 덧붙은 줄만 빠짐 | Cotton 100% ‖ Leather 100% | Cotton 100% | — |
| Bellerose | https://bellerose.com/products/women-shirts-gastoo-white | 덧붙은 줄만 빠짐 | Cotton 100% ‖ Leather 100% | Cotton 100% | — |
| CCC | https://www.crewclothing.co.uk/products/half-zip-sweatshirt-in-white-and-navy-stripes | 덧붙은 줄만 빠짐 | Cotton 64% / Polyester 36% ‖ Cotton 57% / Polyester 40% / Elastane 3% | Cotton 64% / Polyester 36% | 지금 규칙이 맞음 — Body 64/36 · Rib 57/40/3 — 저장값 둘째 줄은 리브. |
| CCC | https://www.crewclothing.co.uk/products/star-embroidered-sweat-in-navy | 덧붙은 줄만 빠짐 | Cotton 66% / Polyester 34% ‖ Cotton 59% / Polyester 39% / Elastane 2% | Cotton 66% / Polyester 34% | — |
| Jigsaw | https://www.jigsaw-online.com/products/v-neck-sheer-top-cream | 값이 바뀜 | Lyocell 85% / Polyester 15% / Viscose 100% | Lyocell 85% / Polyester 15% ‖ Viscose 100% | — |
| Jigsaw | https://www.jigsaw-online.com/products/tiger-orchid-knit-tank-blue | 값이 바뀜 | Cotton 100% / Silk 100% | Cotton 100% ‖ Silk 100% | 지금 규칙이 맞음 — Main 1 100% Cotton · Main 2 100% Silk — 저장값은 두 겉감을 한 줄에 붙였다(합 200%). |
| Jigsaw | https://www.jigsaw-online.com/products/satin-lace-detail-cami-brown | 값이 바뀜 | Viscose 100% / Polyester 100% | Viscose 100% | 지금 규칙이 맞음 — Main 100% Viscose · Trim 100% Polyester — 저장값은 장식을 붙였다. |
| Jigsaw | https://www.jigsaw-online.com/products/fine-rib-half-sleeve-henley-navy | 덧붙은 줄만 빠짐 | Cotton 97% / Elastane 3% ‖ Lyocell 58% / Cotton 42% | Cotton 97% / Elastane 3% | — |
| Jigsaw | https://www.jigsaw-online.com/products/modal-lace-v-cami-black | 덧붙은 줄만 빠짐 | Modal 92% / Elastane 8% ‖ Nylon 90% / Elastane 10% | Modal 92% / Elastane 8% | — |
| Jigsaw | https://www.jigsaw-online.com/products/modal-lace-cami-burgundy | 덧붙은 줄만 빠짐 | Modal 92% / Elastane 8% ‖ Nylon 90% / Elastane 10% | Modal 92% / Elastane 8% | 지금 규칙이 맞음 — Main 92% Modal, 8% Elastane · Trim 90% Polyamide, 10% Elastane — 저장값 둘째 줄은 장식. |
| Jigsaw | https://www.jigsaw-online.com/products/fishermans-rib-jumper-navy | 지금 규칙은 빈 칸 | Wool 54% / Nylon 27% / Cotton 19% | (빈 칸) | — |
| Jigsaw | https://www.jigsaw-online.com/products/burgundy-36 | 지금 규칙은 빈 칸 | Viscose 62% / Polyester 38% | (빈 칸) | — |
| Jager | https://www.marksandspencer.com/printed-off-the-shoulder-vest/p/clp61265432?color=CHOCOLATE#intid=pid_pg1pip48g2r22c1%7Cprodflag_20%25%20off | 값이 바뀜 | Polyester 100% | Nylon 76% / Metallic 20% / Elastane 4% ‖ Polyester 100% | — |
| Jager | https://www.marksandspencer.com/studio-crew-neck-sweatshirt/p/clp23087631?color=LILAC#intid=pid_pg1pip48g2r13c1%7Cprodflag_submsg-The%20Sports%20Edit | 덧붙은 줄만 빠짐 | Cotton 80% / Polyester 20% ‖ Cotton 97% / Elastane 3% | Cotton 80% / Polyester 20% | — |
| Jager | https://www.marksandspencer.com/cotton-rich-striped-sweatshirt/p/clp23089070#intid=pid_pg1pip48g2r23c2%7Cprodflag_30%25%20off | 덧붙은 줄만 빠짐 | Cotton 66% / Polyester 34% ‖ Cotton 57% / Polyester 40% / Elastane 3% | Cotton 66% / Polyester 34% | — |
| Jager | https://www.marksandspencer.com/pure-cotton-printed-sweatshirt/p/clp61232148#intid=pid_pg3pip48g2r6c1 | 값이 바뀜 | Cotton 100% / Cotton 95% / Elastane 5% | Cotton 100% ‖ Cotton 95% / Elastane 5% | — |
| The Great | https://thisisthegreat.com/products/the-rayon-jersey-v-neck-tee-cream | 값이 바뀜 | Modal 53% / Cotton 47% | Viscose 53% / Cotton 47% | — |
| The Great | https://thisisthegreat.com/collections/tees-sweats-a-great-big-sale/products/the-little-tee-soft-yellow-stripe | 값이 바뀜 | Modal 60% / Cotton 40% | Cotton 60% / Polyester 40% | — |
| The Great | https://thisisthegreat.com/collections/tops/products/the-orchard-top-harbor-wash | 지금 규칙은 빈 칸 | Cotton 80% / Hemp 20% | (빈 칸) | — |
| Tuckernuck | https://tnuck.com/products/blue-teagan-eyelet-short-sleeve-top | 덧붙은 줄만 빠짐 | Cotton 100% ‖ Polyester 100% | Cotton 100% | 지금 규칙이 맞음 — 100% Cotton (outer) · 100% Polyester (embroidery) — 저장값 둘째 줄은 자수. |
| Tuckernuck | https://tnuck.com/products/navy-paisley-ellery-top | 덧붙은 줄만 빠짐 | Viscose 100% ‖ Polyester 100% | Viscose 100% | — |
| Tuckernuck | https://tnuck.com/products/metallic-deja-pants | 값이 바뀜 | Polyester 100% | Nylon 52% / Metallic 42% / Elastane 6% ‖ Polyester 100% | — |
| Tuckernuck | https://tnuck.com/products/terrace-jacquard-meg-a-line-mini-skirt | 값이 바뀜 | Polyester 100% ‖ Polyester 97% / Elastane 3% | Polyester 91% / Metallic 9% ‖ Polyester 97% / Elastane 3% | — |
| Tuckernuck | https://tnuck.com/products/vibrant-stripe-mini-skirt | 지금 규칙은 빈 칸 | Viscose 68% / Polyester 32% | (빈 칸) | — |
| Tuckernuck | https://tnuck.com/products/ivory-teal-solstice-midi-dress | 지금 규칙은 빈 칸 | Cotton 100% | (빈 칸) | — |
| Z Supply | https://zsupplyclothing.com/products/solene-luxe-top | 값이 바뀜 | Cotton 100% | Polyester 100% | — |
| Z Supply | https://zsupplyclothing.com/products/dazzle-tee | 값이 바뀜 | Cotton 100% | Polyester 95% / Elastane 5% | 지금 규칙이 맞음 — Sequin Mesh 95% Polyester, 5% Spandex — 저장값 Cotton 100% 는 메뉴 글(틀림). |
| Z Supply | https://zsupplyclothing.com/products/junie-slub-long-sleeve-tee-3-pack | 지금 규칙은 빈 칸 | Cotton 100% | (빈 칸) | — |
| Z Supply | https://zsupplyclothing.com/products/rowe-scoop-tank-3-pack | 지금 규칙은 빈 칸 | Cotton 100% | (빈 칸) | — |

재확인 실행 4565… 은 커밋 4520b4b(이 지도의 혼용률 규칙 전부)로 쟀다. 4563… 실행(a819ae5 규칙)은 같은 브랜드의 새 실행이 있어 표에서 뺐다. '값이 바뀜'·'빈 칸'은 HTML 을 받아 판정한 줄 말고는 규칙만으로 본 것이다 — 저장값이 맞고 지금 규칙이 틀린 경우도 있을 수 있어, 운영에 다시 쓰기 전에 판정 줄을 더 늘려 보는 것이 안전하다.

**운영 값이 지금도 옛 규칙으로 다시 쓰이고 있다.** main 브랜치의 야간 보강(enrich-comp.yml, 이날 오후에도 여러 번 실행)이 옛 규칙으로 저장한다. 같은 The Great 상품의 저장값이 14:19 재확인에서는 'Cotton 100%'(맞음)였는데 16:03 재확인에서는 'Modal 100%'(창 이름 'Modal spinner' 를 읽은 틀린 값)로 바뀌어 있었다(78개). Z Supply 의 'Cotton 100%'(메뉴 '100% Cotton Shop') 도 같은 모양이다. 이 브랜치의 규칙이 main 에 들어가기 전까지는 틀린 값이 계속 다시 쓰인다.

## 브랜드별 (134)

칸: ✅ 읽힌 수/읽힌 표본 · 출처 — 📭 읽혔는데 없음 — ⛔ 막힘 — 🔗 표본 없음

| 브랜드 | 상품 | 읽힘 | 상품명 | 사진 전부 | 판매가 | 정가(할인 시) | 통화 | 이 상품 컬러 | 컬러 전부 | 사이즈 | 재고 사이즈 | 혼용률 | 설명 | 디테일 글머리표 | 상품 코드 |
|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| &Other Stories | 343 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Abercrombie & Fitch | 214 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Addidas | 408 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Addison bay | 141 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 메타 태그·JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| Aerie | 101 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 본문 칸 | ✅ 3/3 JSON-LD |
| ALC | 393 | 3/3 firefox/shopify-json/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 2/3 JSON-LD | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Alo | 190 | 3/3 firefox | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 2/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| American Eagle | 178 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문·JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 본문 칸 | ✅ 3/3 JSON-LD |
| Ann Taylor | 381 | 1/3 impit | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 칸 | ✅ 1/1 JSON-LD |
| Anthropologie | 270 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Apiece Apart | 102 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD |
| Aritzia | 800 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Arket | 285 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Athleta | 1 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Banana Republic | 1 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Barbour | 170 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Bash | 50 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 2/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Bassike | 318 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON |
| Bellerose | 231 | 3/3 firefox | ✅ 3/3 Shopify JSON·JSON-LD | ✅ 3/3 Shopify JSON·JSON-LD | ✅ 3/3 Shopify JSON·JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | ✅ 1/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON·JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON·JSON-LD |
| Beyond yoga | 175 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 2/3 Shopify JSON |
| Boden | 331 | 2/3 firefox/impit | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | 📭 0/2 | ✅ 2/2 JSON-LD | 📭 0/2 | 📭 0/2 | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 본문 | ✅ 2/2 Shopify JSON | ✅ 2/2 본문 칸 | ✅ 2/2 Shopify JSON |
| Boldest | 136 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 2/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 메타 태그·JSON-LD | ✅ 1/3 본문 칸 | ✅ 3/3 JSON-LD |
| Buck Mason | 119 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 본문 칸 | ✅ 3/3 JSON-LD |
| Carlhartt | 148 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| CCC | 800 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Chico's | 800 | 3/3 firefox | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Citizens of Humanity | 171 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Club monaco | 169 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Coldwatercreek | 200 | 3/3 firefox | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 1/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Cotton citizen | 283 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON·본문 칸 | ✅ 3/3 Shopify JSON |
| Cotton on | 470 | 3/3 firefox/impit | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 2/3 메타 태그 | ✅ 3/3 본문 칸 | 📭 0/3 |
| Damson Madder | 385 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD·메타 태그 | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 Shopify JSON |
| Dickies | 260 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Draper James | 147 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 2/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Eddie bauer | 200 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Eileen fisher | 545 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| English factory | 269 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON |
| Evereve | 444 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Everlane | 443 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 1/3 본문 | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Faherty | 170 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Fatface | 374 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| FP Movement | 58 | 1/1 firefox | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 |
| Frame | 189 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| Frank & Eileen | 448 | 2/3 firefox/impit | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | 📭 0/2 | ✅ 2/2 JSON-LD | ✅ 2/2 본문 | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 본문 | ✅ 2/2 Shopify JSON | ✅ 2/2 본문 칸 | ✅ 2/2 Shopify JSON |
| Free People | 190 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Gap | 6 | 2/3 firefox | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | ✅ 2/2 본문 | 📭 0/2 | 📭 0/2 | 📭 0/2 |
| Garnet hill | 108 | 2/3 firefox | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | ✅ 2/2 JSON-LD | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | ✅ 1/2 본문 | ✅ 2/2 JSON-LD | ✅ 1/2 본문 칸 | ✅ 2/2 JSON-LD |
| Gerard darel | 138 | 3/3 firefox/impit/shopify-json | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 2/3 JSON-LD | ✅ 2/3 본문 | ✅ 2/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸·Shopify JSON | ✅ 3/3 Shopify JSON |
| Gestuz | 643 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Goldie | 139 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON |
| Good American | 625 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Greyson | 93 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| Gymshark | 274 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 2/3 본문 칸 | ✅ 3/3 JSON-LD |
| H&M | 744 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Hobbs | 353 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| J crew | 215 | 2/3 firefox | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | ✅ 2/2 JSON-LD | ✅ 2/2 본문 | ✅ 2/2 JSON-LD | 📭 0/2 | 📭 0/2 | ✅ 2/2 본문 | ✅ 2/2 JSON-LD | ✅ 1/2 본문 칸 | ✅ 2/2 JSON-LD |
| J.jill | 89 | 3/3 impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 2/3 본문 | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD |
| J.mclaughlin | 516 | 2/3 firefox/impit | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | ✅ 2/2 JSON-LD | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | ✅ 2/2 본문 | ✅ 2/2 JSON-LD | ✅ 2/2 본문 칸 | ✅ 2/2 JSON-LD |
| Jager | 402 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| James Perse | 526 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| Jigsaw | 315 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Joules | 459 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| L.L bean | 310 | 3/3 firefox/impit | ✅ 2/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 2/3 JSON-LD | 📭 0/3 | ✅ 2/3 JSON-LD | ✅ 2/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 2/3 본문 | ✅ 3/3 메타 태그 | ✅ 3/3 본문 칸 | ✅ 2/3 JSON-LD |
| La Ligne | 397 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Lands end | 469 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Leset | 326 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Lilla P | 167 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| LNA | 236 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| Loft | 673 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Lucky Brand | 161 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Lululemon | 476 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Madewell | 75 | 2/3 impit | ✅ 1/2 JSON-LD | ✅ 2/2 JSON-LD·메타 태그 | ✅ 1/2 JSON-LD | 📭 0/2 | ✅ 1/2 JSON-LD | ✅ 2/2 JSON-LD·본문 | ✅ 1/2 JSON-LD | 📭 0/2 | 📭 0/2 | ✅ 2/2 본문 | ✅ 2/2 JSON-LD·메타 태그 | ✅ 2/2 본문 칸 | ✅ 1/2 JSON-LD |
| Mango | 93 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Marine Layer | 180 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | 📭 0/3 | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Massimo Dutti | 603 | 2/3 firefox | ✅ 2/2 JSON-LD | ✅ 2/2 메타 태그·JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | ✅ 2/2 JSON-LD | ✅ 2/2 본문 | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | ✅ 2/2 페이지 JSON | ✅ 2/2 JSON-LD·메타 태그 | 📭 0/2 | ✅ 2/2 JSON-LD |
| Me+Em | 425 | 1/1 firefox | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | 📭 0/1 | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 칸 | 📭 0/1 |
| Michael Stars | 203 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Mint velvet | 416 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 1/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Monrow | 200 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON·JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Monsoon | 30 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Nation LTD | 525 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Nike | 490 | 1/1 firefox | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 칸 | ✅ 1/1 JSON-LD |
| Ninety Percent | 156 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Nylora | 237 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Oak + Fort | 336 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON·본문 칸 | ✅ 3/3 Shopify JSON |
| Oasis | 133 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Old Navy | 7 | 1/3 impit | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | 📭 0/1 | ✅ 1/1 본문 | 📭 0/1 | 📭 0/1 | 📭 0/1 |
| On | 263 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 2/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Outdoorvoices | 126 | 3/3 shopify-json/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 1/3 JSON-LD | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 1/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Oysho | 20 | 2/3 firefox | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | ✅ 2/2 메타 태그 | 📭 0/2 | 📭 0/2 |
| Paige | 60 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Patagonia | 168 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Phase eight | 400 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Poetry | 303 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Prana | 81 | 1/3 firefox | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 | 📭 0/1 | 📭 0/1 | 📭 0/1 | ✅ 1/1 본문 | ✅ 1/1 메타 태그 | ✅ 1/1 본문 칸 | ✅ 1/1 JSON-LD |
| Project Social T | 275 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Rag & bone | 244 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Rails | 290 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Reformation | 753 | 3/3 firefox | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| rouje | 232 | 2/3 firefox/impit | ✅ 2/2 JSON-LD·Shopify JSON | ✅ 2/2 JSON-LD·Shopify JSON | ✅ 2/2 JSON-LD·Shopify JSON | ✅ 1/2 Shopify JSON | ✅ 2/2 JSON-LD | ✅ 2/2 본문 | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | ✅ 2/2 JSON-LD·Shopify JSON | ✅ 2/2 본문 칸 | ✅ 2/2 JSON-LD·Shopify JSON |
| Sanctuary | 421 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 메타 태그 | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 메타 태그·Shopify JSON | ✅ 3/3 Shopify JSON·본문 칸 | ✅ 3/3 Shopify JSON |
| Scoth & soda | 378 | 2/3 firefox/impit | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 1/2 Shopify JSON | ✅ 2/2 JSON-LD | ✅ 2/2 본문 | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 Shopify JSON | ✅ 2/2 본문 | ✅ 2/2 Shopify JSON | ✅ 2/2 본문 칸 | ✅ 2/2 Shopify JSON |
| Seasalt cornwall | 279 | 3/3 firefox/impit | ✅ 2/3 JSON-LD | ✅ 2/3 JSON-LD | ✅ 2/3 JSON-LD | 📭 0/3 | ✅ 2/3 JSON-LD | ✅ 2/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 2/3 본문 | ✅ 3/3 메타 태그·JSON-LD | ✅ 1/3 본문 칸 | ✅ 2/3 JSON-LD |
| Sessun | 81 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Sezane | 206 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Shopbop | 453 | 1/3 firefox | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | 📭 0/1 | 📭 0/1 | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 칸 | ✅ 1/1 JSON-LD |
| Spanx | 84 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 2/3 본문 | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD |
| Splendid | 404 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON |
| Splits59 | 162 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Stateside | 335 | 3/3 impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 메타 태그 | ✅ 3/3 본문 | 📭 0/3 | ✅ 2/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 2/3 Shopify JSON |
| Sundry | 246 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 2/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| Sweaty betty | 405 | 1/3 firefox | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 | 📭 0/1 | 📭 0/1 | 📭 0/1 | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 칸 | ✅ 1/1 JSON-LD |
| The Great | 240 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 3/3 Shopify JSON |
| The upside | 429 | 2/3 firefox | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 1/2 JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | 📭 0/2 | 📭 0/2 | 📭 0/2 | ✅ 2/2 본문 | ✅ 2/2 JSON-LD | ✅ 2/2 본문 칸 | ✅ 2/2 JSON-LD |
| The white company | 68 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Theory | 379 | ⛔ 막힘 | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Thread & supply | 258 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Tuckernuck | 376 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Ulla Johnson | 307 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 Shopify JSON |
| Vanessa bruno | 58 | 1/3 firefox | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | ✅ 1/1 JSON-LD | 📭 0/1 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 | 📭 0/1 | 📭 0/1 | 📭 0/1 | ✅ 1/1 본문 | ✅ 1/1 JSON-LD | ✅ 1/1 본문 칸 | ✅ 1/1 JSON-LD |
| Varley | 285 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 2/3 본문 | ✅ 3/3 JSON-LD | ✅ 1/3 본문 칸 | ✅ 3/3 JSON-LD |
| Velvet | 352 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Veronica Beard | 375 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 2/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Vince | 381 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD |
| vineyardvines | 560 | 2/3 firefox/impit | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 본문 | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 1/2 본문 | ✅ 2/2 JSON-LD | ✅ 2/2 본문 칸 | ✅ 2/2 JSON-LD |
| Vuori | 219 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| WHBM | 219 | 2/3 firefox/impit | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | ✅ 2/2 JSON-LD | 📭 0/2 | 📭 0/2 | ✅ 2/2 본문 | ✅ 2/2 JSON-LD | ✅ 1/2 본문 칸 | ✅ 2/2 JSON-LD |
| Whistles | 217 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Whitestuff | 184 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | 📭 0/3 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Wilson | 52 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 2/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Wrap | 374 | 3/3 firefox/impit | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | 📭 0/3 | 📭 0/3 | 📭 0/3 | ✅ 2/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |
| Xirena | 333 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 Shopify JSON | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Z Supply | 216 | 3/3 firefox/impit | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 3/3 Shopify JSON | ✅ 1/3 본문 | ✅ 3/3 Shopify JSON | ✅ 1/3 본문 칸 | ✅ 3/3 Shopify JSON |
| Zara | 499 | 3/3 firefox | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | 📭 0/3 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 JSON-LD | ✅ 3/3 본문 | ✅ 3/3 JSON-LD | ✅ 3/3 본문 칸 | ✅ 3/3 JSON-LD |

## 막힌 브랜드 — 무엇이 막았나

- **&Other Stories** (343개) — impit blocked 403, firefox blocked 403 · 접근 지도: 상품 페이지는 Akamai 가 모든 엔진 차단(파이어폭스는 200 확인 화면) · 보관본 없음
- **Abercrombie & Fitch** (214개) — impit blocked 200, firefox shell 200 · 접근 지도: 같은 확인 화면
- **Addidas** (408개) — impit blocked 200, firefox blocked 403 / impit blocked 403, firefox blocked 403 · 접근 지도: Akamai — 모든 엔진 403, 보관본 거의 없음(11/25 성공 2)
- **Anthropologie** (270개) — impit blocked 403, firefox blocked 403 · 접근 지도: DataDome — 모든 엔진 403 · 보관본 없음
- **Aritzia** (800개) — impit blocked 403, firefox blocked 403 · 접근 지도: Cloudflare — impit·크롬 403 · 파이어폭스는 러너마다 3개 중 0~1개 · 보관본은 사이트 공통 문구 때문에 거부
- **Arket** (285개) — impit blocked 403, firefox blocked 403 · 접근 지도: 상품 페이지는 Akamai 가 모든 엔진 차단 · 웹 아카이브는 3/3 읽음
- **Athleta** (1개) — impit shell 200, firefox shell 200 · 접근 지도: 카탈로그에 상품이 없음(목록 문제) · 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다
- **Banana Republic** (1개) — impit shell 200, firefox shell 200 · 접근 지도: 카탈로그에 상품이 없음 · 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다
- **Eileen fisher** (545개) — impit blocked 403, firefox blocked 403 · 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다
- **Fatface** (374개) — impit blocked 403, firefox blocked 403 · 접근 지도: Akamai — 모든 엔진 403 · 보관본 없음
- **Free People** (190개) — impit blocked 403, firefox blocked 403 · 접근 지도: DataDome — 페이지는 모든 엔진 403 · 웹 아카이브 2/3
- **Gestuz** (643개) — impit shell 200, firefox shell 200
- **H&M** (744개) — impit blocked 403, firefox blocked 403 · 접근 지도: 상품 페이지는 Akamai 가 모든 엔진 403(파이어폭스 포함) · 보관본 없음
- **Joules** (459개) — impit blocked 403, firefox blocked 403 · 접근 지도: Akamai — 페이지는 모든 엔진 403 · 웹 아카이브만 일부(11/25 야간 15개)
- **Lands end** (469개) — impit blocked 403, firefox blocked 403
- **Loft** (673개) — impit shell 200, firefox blocked 200 · 접근 지도: 브라우저는 PerimeterX · 평 HTML 은 열리나 오늘 표본 3개에서 혼용률 못 찾음(JSON-LD 에 있는 상품만 읽힘)
- **Lululemon** (476개) — impit blocked 403, firefox blocked 403 · 접근 지도: Akamai — 모든 엔진 · 보관본 거의 없음(11/24 적중 4%)
- **Mango** (93개) — impit blocked 429, firefox blocked 429 · 접근 지도: Vercel 확인 화면 — 모든 엔진 · 파이어폭스 보강 11/25 39/39 차단
- **Paige** (60개) — impit blocked 429, firefox blocked 429 · 접근 지도: Vercel 확인 화면 — 모든 엔진
- **Patagonia** (168개) — impit shell 200, firefox shell 200 · 접근 지도: 같은 점검 화면 · 파이어폭스 2/3 읽음 · 보관본 1/3
- **Sessun** (81개) — impit blocked 404, firefox blocked 404 · 접근 지도: 카탈로그의 '상품 주소' 일부가 이미지 파일(404). 진짜 상품 주소(us.sessun.com/catalogue/…html)는 모든 엔진이 혼용률까지 읽음(2/2)
- **Sezane** (206개) — impit blocked 403, firefox blocked 403 · 접근 지도: DataDome — 모든 엔진 · 보관본 일부(11/24 거부 다수)
- **The white company** (68개) — impit blocked 200, firefox blocked 200 · 접근 지도: 같은 지역 이동 — 데이터센터 모든 엔진 · 파이어폭스 보강 11/25 63/68 차단
- **Theory** (379개) — impit blocked 200, firefox blocked 403

## 사람이 확인할 표본 (브랜드당 1개)

사이트를 열어 아래 값과 견주면 된다. 설명은 앞 160자, 디테일은 앞 6줄만 적었다. 시험 자료(HTML)는 `scripts/fixtures/pages/`.

<details><summary><b>Addison bay</b> — Smooth Sport Elm Active Tank in Cypress product link (firefox)</summary>

- 주소: https://addisonbay.com/products/elm-active-tank?variant=42369871478866
- 이름: 페이지 "Smooth Sport Elm Active Tank" · 카탈로그 "Smooth Sport Elm Active Tank in Cypress product link"(목록 수집이 붙인 이름)
- 가격 $78 · 통화 USD · 코드 R26AB0604C
- 컬러 cypress · 컬러 전부 Cypress
- 사이즈 XX-Small, X-Small, Small, Medium, Large, X-Large, XX-Large · 재고 XX-Small, X-Small, Small, Medium, Large, X-Large, XX-Large
- 혼용률 Nylon 75% / Elastane 25% · 사진 7장
- 설명: The Elm Active Tank in Cypress delivers high-performance style on and off the court. Crafted from a lightweight, moisture-wicking stretch fabric, this sleeveles
- 디테일: —
- 페이지의 칸 제목: details

</details>

<details><summary><b>Aerie</b> — Aerie Go-To Boyfriend Crewneck Sweatshirt (firefox)</summary>

- 주소: https://www.ae.com/us/en/p/aerie/tops/sweatshirts-hoodies/aerie-go-to-boyfriend-crewneck-sweatshirt/0743_3981_128
- 가격 $29 · 통화 USD · 코드 0743_3981_128
- 컬러 Dusk · 컬러 전부 Dusk
- 사이즈 —
- 혼용률 Cotton 86% / Recycled Polyester 14% · 사진 1장
- 설명: An oversized, boyfriend crew sweatshirt in our coziest, softest everyday fleece.
- 디테일: —
- 페이지의 칸 제목: details · size & fit

</details>

<details><summary><b>ALC</b> — Drew Silk Devoré Camisole Top (firefox)</summary>

- 주소: https://alcltd.com/products/drew-top-deep-mulberry
- 가격 $350 · 통화 USD · 코드 1921484947
- 컬러 rgba(17, 17, 17, 0) · 컬러 전부 Deep Mulberry
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Viscose 54% / Silk 46% · 사진 5장
- 설명: The Drew Top is crafted from silk devoré in a dark mulberry hue. This fluid camisole features a relaxed silhouette and delicate adjustable straps. The fabric is
- 디테일: Model is 5'10" Wearing Size S · Model Measurements: Bust 30.5" Waist 23" Hips 34" · Product Measurements for a Size S: Bust 32.5" Waist 35.5" · Style 5TOPS02265 · 54% Viscose 46% Silk · Dry Clean
- 페이지의 칸 제목: description

</details>

<details><summary><b>Alo</b> — Silk Blend Radiance Long Sleeve Top - Black (firefox)</summary>

- 주소: https://www.aloyoga.com/products/w31085p-silk-blend-radiance-long-sleeve-top-black
- 가격 $198 · 통화 USD · 코드 95139070311
- 컬러 Black · 컬러 전부 Black, Sandy Beige, White
- 사이즈 XXS, XS, S, M, L · 재고 XXS, XS, S, M
- 혼용률 Silk 52% / Viscose 40% / Elastane 8% · 사진 3장
- 설명: The Silk Blend Radiance Long Sleeve Top is a wardrobe must-have. It has an open-front silhouette that ties softly at the center for an effortless, barely-there 
- 디테일: Designed for an easy, relaxed fit with an adjustable front tie.
- 페이지의 칸 제목: highlights · details · description · fit

</details>

<details><summary><b>American Eagle</b> — AE Cozy Crew Neck Long Sleeve T-Shirt (firefox)</summary>

- 주소: https://www.ae.com/intl/en/p/women/tops/t-shirts/ae-cozy-crew-neck-long-sleeve-t-shirt/3376_2022_603
- 가격 $15 · 통화 USD · 코드 3376_2022_603
- 컬러 Starlet Pink · 컬러 전부 Starlet Pink
- 사이즈 —
- 혼용률 Polyester 68% / Viscose 28% / Elastane 4% · 사진 1장
- 설명: Featuring a brushed interior, this tee is super soft and cuddly. The perfect base layer, you'll wear this on repeat.
- 디테일: —
- 페이지의 칸 제목: details · size & fit

</details>

<details><summary><b>Ann Taylor</b> — The Wide-Leg Pant in Ponte (impit)</summary>

- 주소: https://www.anntaylor.com/clothing/suits/cata000013/wide-leg-pant-ponte/858659.html
- 가격 $64.5 · 통화 USD · 코드 858659
- 컬러 Black · 컬러 전부 Black
- 사이즈 0, 00, 2, 4, 6, 8, 10, 12, 14, 16 · 재고 0, 00, 2, 4, 6, 8, 10, 12, 14, 16
- 혼용률 Viscose 66% / Nylon 30% / Elastane 4% · 사진 1장
- 설명: A modern must-have with a statement leg and flattering high waist. Front zip with a hook-and-bar closure. Belt loops. Front pleats. Front off-seam poclets. Back
- 디테일: Tailored & fitted · 66% Rayon, 30% Nylon, 4% Spandex · Machine Washable
- 페이지의 칸 제목: features · details · product details · fit · fabric & care

</details>

<details><summary><b>Apiece Apart</b> — fabi chill button down 1 (firefox)</summary>

- 주소: https://www.apieceapart.com/products/fabi-chill-button-down-1
- 이름: 페이지 "Fabi Chill Button Down" · 카탈로그 "fabi chill button down 1"(목록 수집이 붙인 이름)
- 가격 $375 · 통화 USD · 코드 9636844896476
- 컬러 Stripe · 컬러 전부 Stripe
- 사이즈 XXS, XS, S, M, L, XL · 재고 XXS, XS, S, M, L, XL
- 혼용률 Viscose 89% / Silk 11% · 사진 6장
- 설명: 89% Rayon, 11% Silk Made in China Unlined, shirt collar, dropped shoulders, button closures at front and cuffs, rounded shirttail hem Dry clean only, iron low. 
- 디테일: —
- 페이지의 칸 제목: description · details

</details>

<details><summary><b>Barbour</b> — Rosalie T-Shirt White (firefox)</summary>

- 주소: https://www.barbour.com/row/rosalie-t-shirt-LTS0730WH11.html
- 이름: 페이지 "Rosalie T-Shirt" · 카탈로그 "Rosalie T-Shirt White"(목록 수집이 붙인 이름)
- 가격 — · 통화 — · 코드 LTS0730WH11
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 100% · 사진 4장
- 설명: The Barbour Rosalie T-Shirt is a minimalist essential with signature detailing.
- 디테일: Outer: 100% Cotton · Left Chest 'B' Embroidery · Back Length: 60cm · Machine Wash 30°C - Mild Process · Wash with similar colours
- 페이지의 칸 제목: description
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>Bash</b> — T-shirt IONI (firefox)</summary>

- 주소: https://ba-sh.com/fr/en/p/t-shirt-ioni-grischine-3667436152573.html
- 가격 €75 · 통화 EUR · 코드 1H26IONI
- 컬러 KAKI · 컬러 전부 KAKI, ECRU, GRISCHINE
- 사이즈 —
- 혼용률 Cotton 100% · 사진 14장
- 설명: - Classic unisex cut - Straight cut - Round neck - Short sleeves - Contrasting neckline - Varsity vibes The cotton fibers in this model come from organic farmin
- 디테일: Material: 100% COTTON · Made in: Portugal · Wash at 30°C · Do not bleach · Iron at a maximum temperature of 110°C. · Do not dry clean
- 페이지의 칸 제목: product details · description · composition

</details>

<details><summary><b>Bassike</b> — Mesh Boxy Seam Detail T-Shirt (firefox)</summary>

- 주소: https://www.bassike.com/products/mesh-boxy-seam-detail-t-shirt-r26wft144-washed-ink
- 가격 $185 · 정가 $265 · 통화 USD · 코드 R26WFT144-57316-166820-6672
- 컬러 — · 컬러 전부 —
- 사이즈 00, 0, 1, 2, 3, 4 · 재고 00, 0, 1, 2, 3, 4
- 혼용률 Polyester 75% / Elastane 25% · 사진 4장
- 설명: The Mesh Boxy Seam Detail T-Shirt, crafted for a relaxed silhouette. Features hem side slits and a locally washed finish using a special technique to achieve a 
- 디테일: Slouch fit · Boxy silhouette · Short sleeve · Hem side slants · Local dye wash · Fabric made in Italy
- 페이지의 칸 제목: details · composition

</details>

<details><summary><b>Bellerose</b> — Vice white crew-neck t-shirt (262 / W / CASPER) (firefox)</summary>

- 주소: https://bellerose.com/products/women-t-shirts-vice-casper-bw271333-t1473
- 가격 $59 · 통화 EUR · 코드 5414817359
- 컬러 English · 컬러 전부 —
- 사이즈 XXS, XS, S, M, L, XL, XXL · 재고 XXS, XS, S, M, L, XL, XXL
- 혼용률 Cotton 100% · 사진 14장
- 설명: Muscle t-shirt with folded shoulders and crewneck in white cotton jersey.
- 디테일: Regular cut · Crew, ribbed neck · Wide armhole · Exaggerated, folded shoulders · Lightweight rustic jersey, 160 gsm · Shell fabric : 100% Cotton
- 페이지의 칸 제목: size & fit · details · care

</details>

<details><summary><b>Beyond yoga</b> — Always Beyond Crew Tee 2.0 (firefox)</summary>

- 주소: https://beyondyoga.com/products/always-beyond-crew-tee-2-0-cabernet-heather-007b4-0026
- 가격 $66 · 통화 USD · 코드 —
- 컬러 — · 컬러 전부 Cabernet Heather
- 사이즈 XS, S, M, L, XL, 2XL · 재고 XS, L, XL
- 혼용률 Polyester 94% / Elastane 6% · 사진 3장
- 설명: Like that one tee you borrowed years ago... and never returned. Meet the soft, roomy, and lightweight Always Beyond Crew Tee 2.0. Wear it on repeat, and don't l
- 디테일: CLOSE · Machine Wash Cold, Gentle Cycle, Tumble Dry Low
- 페이지의 칸 제목: product details · product fit

</details>

<details><summary><b>Boden</b> — Lace Trim V-Neck Velvet Top-Black (firefox)</summary>

- 주소: https://us.boden.com/products/women-lace-trim-v-neck-velvet-top-beetroot-red-t2259red
- 이름: 페이지 "Lace Trim V-Neck Velvet Top-Beetroot Red" · 카탈로그 "Lace Trim V-Neck Velvet Top-Black"(목록 수집이 붙인 이름)
- 가격 $99 · 통화 USD · 코드 P-T2259RED
- 컬러 — · 컬러 전부 —
- 사이즈 0, 2, 4, 6, 8, 10, 12, 14, 16/18, 20/22 · 재고 0, 4, 6, 8, 10, 12, 14, 16/18, 20/22
- 혼용률 Polyester 100% · 사진 5장
- 설명: What do you get when velvet and lace come together? A sign party season is incoming. This long sleeve V-neck top has all the hallmarks of a festive favourite. I
- 디테일: Model is wearing size 2 · Model is 5'9.5 · Main: 50% recycled polyester, 30% polyester, 20% elastane · Trims: 100% polyester · Machine washable
- 페이지의 칸 제목: product fit · fit & size · fabric & care · composition · care · fit

</details>

<details><summary><b>Boldest</b> — 와플 긴팔 티셔츠 (firefox)</summary>

- 주소: https://www.kolonmall.com/Brands/boldest/Product/2ATAX27116BKS
- 가격 ₩79000 · 통화 KRW · 코드 2ATAX27116BKS
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Cashmere 100% · 사진 1장
- 설명: Boldest 브랜드의 와플 긴팔 티셔츠 상품을 만나보세요. 코오롱몰 패션·라이프스타일 상품과 함께 트렌디한 데일리룩을 즐겨보세요.
- 디테일: 폴리에스터 100%(몸판) · 좌우 소매 벨크로 · 와펜 탈부착 가능 벨크로 시스템 적용(왼쪽 소매 2개, 오른쪽 소매 1개) · 좌측 가슴: 볼디스트 사각 라벨 · 뒤 상단: 볼디스트 삼각 라벨
- 페이지의 칸 제목: features
- 메모: 클릭해야 그려지는 디테일: impit 0줄 → 파이어폭스 5줄

</details>

<details><summary><b>Buck Mason</b> — White Field Spec Boyfriend Crop Tee (firefox)</summary>

- 주소: https://www.buckmason.com/products/white-field-spec-boyfriend-crop-tee
- 이름: 페이지 "White Field-Spec Boyfriend Crop Tee" · 카탈로그 "White Field Spec Boyfriend Crop Tee"(목록 수집이 붙인 이름)
- 가격 $62 · 통화 USD · 코드 7475653673043
- 컬러 white · 컬러 전부 white
- 사이즈 XS, S, M, L, XL, XXL · 재고 XS, S, M, L, XL, XXL
- 혼용률 Cotton 100% · 사진 8장
- 설명: Our heaviest women's tee, cut from broken-in yet hard-wearing cotton in a boxy, cropped fit.
- 디테일: Classic · 100% cotton
- 페이지의 칸 제목: description · fit

</details>

<details><summary><b>Carlhartt</b> — womens irvine relaxed t shirt (firefox)</summary>

- 주소: https://www.carhartt.com/product/107391/womens-irvine-relaxed-t-shirt
- 이름: 페이지 "Women's Irvine Relaxed T-Shirt" · 카탈로그 "womens irvine relaxed t shirt"(목록 수집이 붙인 이름)
- 가격 $9.99 · 통화 USD · 코드 107391
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 60% / Polyester 40% · 사진 1장
- 설명: Description A reliable staple for work or off-hours, this women’s Carhartt pocket t-shirt delivers comfort without sacrificing toughness. Built from a breathabl
- 디테일: Regular (XS - 3X) · Buy with GPay · 5-ounce, 60% Cotton/40% Polyester Jersey · Relaxed Fit · Rib-knit crewneck · Left-chest pocket with tonal Carhartt Label
- 페이지의 칸 제목: details · features · description · size & fit · product care
- 메모: 클릭해야 그려지는 디테일: impit 6줄 → 파이어폭스 25줄

</details>

<details><summary><b>CCC</b> — Ultimate Breton in Sand and White Stripes (firefox)</summary>

- 주소: https://www.crewclothing.co.uk/products/ultimate-breton-in-sand-and-white-stripes
- 가격 $39 · 통화 GBP · 코드 14189
- 컬러 Sand and White Stripes · 컬러 전부 —
- 사이즈 6, 8, 10, 12, 14, 16, 18, 20, 22 · 재고 6, 8, 10, 12, 14, 16, 18, 20, 22
- 혼용률 Cotton 100% · 사진 5장
- 설명: Our ultimate Breton top remains a forever favourite. In sand and white stripes, this one features three-quarter-length sleeves, a boat neckline, and crossed oar
- 디테일: 100% Cotton · Crossed oars embroidered on the hem · Model is 5'10 and wears a size 8 · Delicate machine wash at 30 degrees
- 페이지의 칸 제목: product details

</details>

<details><summary><b>Chico's</b> — Touch of Cool™ Foiled Mockneck Layering Tee (firefox)</summary>

- 주소: https://www.chicos.com/store/product/touch-of-cool-foiled-mockneck-layering-tee/570420622?inseam=regular&sizeType=regular&color=1469&catId=cat11199293&collectionId=category&parentId=199761497249
- 가격 $25 · 통화 USD · 코드 199761497294
- 컬러 GRAY ONYX · 컬러 전부 GRAY ONYX
- 사이즈 —
- 혼용률 Viscose 95% / Elastane 5% · 사진 1장
- 설명: Your favorite layering piece just got an upgrade with our Touch of Cool™ Foiled Mockneck Layering Tee. The fabric on this long sleeve, mockneck top is perfect f
- 디테일: Lightweight fabric designed to feel incredibly comfy and cool to the touch. · Classic-fit, long-sleeved, mockneck tee. · Length: 26.5". · 95% Rayon, 5% Spandex. · Machine washable. · Imported.
- 페이지의 칸 제목: details · product details

</details>

<details><summary><b>Citizens of Humanity</b> — Ilaria Draped Japanese hammered Satin Top in Cream (firefox)</summary>

- 주소: https://citizensofhumanity.com/products/ilaria-draped-top-cream
- 가격 $328 · 통화 USD · 코드 193693949
- 컬러 XS · 컬러 전부 Cream
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Acetate 86% / Polyester 14% · 사진 6장
- 설명: The Ilaria Draped Top features a softly draped cowl neckline, a close-fitting silhouette, and delicate button detailing at the back. Crafted from lightweight Ja
- 디테일: Body Length: 26" · Chest: 43" · Sleeve Length: 29" · Sweep: 38" · Model is 5'10" and wearing a size Small · Fabric Content: 86% Acetate, 14% Polyester
- 페이지의 칸 제목: details

</details>

<details><summary><b>Club monaco</b> — Shiny Wide Rib Halter Top (firefox)</summary>

- 주소: https://www.clubmonaco.com/products/shiny-wide-rib-halter-top-295906738-353
- 가격 $44 · 정가 $89.5 · 통화 USD · 코드 0030029
- 컬러 Sun Rise · 컬러 전부 —
- 사이즈 XXS, XS, S, M, L, XL
- 혼용률 Polyester 97% / Elastane 3% · 사진 1장
- 설명: A seriously chic halter top done in wide-ribbed fabric with a slight sheen. Tuck it into dress pants or style it with your favorite jeans. For a monochromatic m
- 디테일: Autumn Glaze: Model is 5'11" wearing a size S · Designed for a body-skimming fit · 97% polyester; 3% elastane · Slim fit with a 22" length; based on a size M · Pullover style · Halter neck with crisscross shoulder straps; center stitch detail

</details>

<details><summary><b>Coldwatercreek</b> — Wintertide Waffle Tee (firefox)</summary>

- 주소: https://www.coldwatercreek.com/wintertide-waffle-tee/22279/
- 가격 $79.95 · 통화 USD · 코드 22279
- 컬러 options for Holly Grove Waffle Tee · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 1장
- 설명: Alpine motifs give this light, waffle knit tee a folkloric feel. Embroidered at the shoulders and sleeves, with a split neck and curved hem.
- 디테일: Misses 26" long; Petites 24"; Women’s 28" · Hits mid hip · Relaxed fit · Cotton/spandex · Machine wash · Imported
- 페이지의 칸 제목: details · highlights · features · product description · fabric & care · fit
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>Cotton citizen</b> — Standard Oversized Tee (firefox)</summary>

- 주소: https://cottoncitizen.com/products/standard-oversized-tee-vintage-carmine
- 가격 $72 · 정가 $90 · 통화 USD · 코드 W12691-VCRMN
- 컬러 White · 컬러 전부 Vintage Carmine
- 사이즈 XS, S, M, L · 재고 XS, S, M, L
- 혼용률 Cotton 100% · 사진 4장
- 설명: The Standard Oversized Tee reimagines our best-selling Standard Tee with exaggerated proportions and an effortlessly relaxed fit. Designed with a wider cut thro
- 디테일: Oversized, relaxed fit · Classic crew neckline · Exaggerated wide neck binding · Slightly dropped shoulders · Relaxed short sleeves · Slightly elongated length
- 페이지의 칸 제목: description · details · size & fit

</details>

<details><summary><b>Cotton on</b> — 90S High V Neck ¾ Sleeve, BLACK (firefox)</summary>

- 주소: https://cottonon.com/US/90s-high-v-neck-%C2%BE-sleeve/2062142-01.html
- 가격 — · 통화 — · 코드 —
- 컬러 black · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 95% / Elastane 5% · 사진 0장
- 설명: Discover the 90S V Neck ¾ Sleeve for women in black. The top features a classic black hue and stretch cotton fabric. Perfect for casual days out or relaxed week
- 디테일: Color: black See all colors (6) · Soft stretchy fabrication · Close to body fit · V Neckline · 3/4 Sleeve · Main: 95% Cotton, 5% Elastane.
- 페이지의 칸 제목: details · description · care · features · composition

</details>

<details><summary><b>Damson Madder</b> — Quiet Company - Ecru (firefox)</summary>

- 주소: https://damsonmadder.com/products/quiet-company-ecru
- 가격 $40 · 통화 USD · 코드 PF26-DM-3910
- 컬러 Select Size · 컬러 전부 ECRU
- 사이즈 6, 8, 10, 12, 14, 16, 18, 20 · 재고 8, 10, 12, 16, 20
- 혼용률 Cotton 100% · 사진 7장
- 설명: The Quiet Company Tee in white is a fun, statement piece. Featuring an oversized, boxy fit, it showcases a large-scale graphic on the back and a small print on 
- 디테일: Oversized, boxy silhouette · Large scale back graphic and small front chest graphic on white t-shirt base · 100% Organic Cotton · Made in Türkiye
- 페이지의 칸 제목: fabric & care

</details>

<details><summary><b>Dickies</b> — Women's Everyday Short Sleeve T-Shirt (firefox)</summary>

- 주소: https://www.dickies.com/products/womens-everyday-short-sleeve-t-shirt-clc
- 가격 $17.49 · 정가 $24.99 · 통화 USD · 코드 191651956
- 컬러 Brand Band Cloud Cream · 컬러 전부 Brand Band Cloud Cream
- 사이즈 XS, S, M, L, XL, 2XL · 재고 XS, S, M, L, XL, 2XL
- 혼용률 Cotton 60% / Polyester 40% · 사진 5장
- 설명: Soft, easy, and made for everyday wear, this short sleeve tee is crafted from a 60% cotton / 40% polyester blend that feels great against the skin and keeps its
- 디테일: Ss T-Shirt · Fabric Composition: 60 cotton/40 polyester · Fabric description: Cotton · Fit: Relaxed Fit · Sleeves: Short Sleeve
- 페이지의 칸 제목: details · description · features · size & fit · product details · materials & care

</details>

<details><summary><b>Draper James</b> — Top with Lace Trim (firefox)</summary>

- 주소: https://draperjames.com/products/top-with-lace-trim-in-burgundy
- 가격 $128 · 통화 USD · 코드 TOW0783601
- 컬러 options for Top in Fringe · 컬러 전부 —
- 사이즈 —
- 혼용률 Polyester 100% · 사진 8장
- 설명: Burgundy and lace were made for this time of year. This lined top brings a romantic finish to holiday outfitting without feeling overdone. Pair it with a skirt 
- 디테일: Zipper · Lined · Shell: 100% Polyester Lining: 100% Polyester · Body Length: 24" · Machine wash cold. With like colors. Do not bleach. Do not tumble dry. Line dry. Cool iron · TOW0783

</details>

<details><summary><b>Eddie bauer</b> — Women's Fav Long Sleeve Crew Neck Tee (firefox)</summary>

- 주소: https://www.eddiebauer.com/products/wr-ls-favorite-crew-solid-eb001067w
- 가격 $21 · 정가 $30 · 통화 USD · 코드 EB001067W
- 컬러 options · 컬러 전부 Blkcherry, Htrindigo, Ltplum, Mheagra, Thistle, Tlblu
- 사이즈 S, M, L, 1X, 2X, 3X, XS, XL, XXL · 재고 3X, S, M, L, XS, XL, XXL, 2X
- 혼용률 Cotton 60% / Polyester 40% · 사진 20장
- 설명: One wearing will convince you that our Fav T-Shirts are more than just ordinary. The proof starts with the superior cotton we use, combed to make the yarn smoot
- 디테일: 1x1 rib knit for better shape retention and stretch · Polishing process minimizes pilling · Garment-washed for softness and to prevent shrinkage · Please note: During our branding transition, you may receive an item featuring either our block logo or our script logo. This does not affect the product's quality, features, or performance. · 60% cotton · 40% polyester using domestic and Imported materials
- 페이지의 칸 제목: fit · product details · features · materials & care

</details>

<details><summary><b>English factory</b> — Pinstripe Balloon Sleeve Shirt (firefox)</summary>

- 주소: https://shopenglishfactory.com/products/pinstripe-balloon-sleeve-shirt-sa037t
- 가격 $97 · 통화 USD · 코드 SA037T-BROWN
- 컬러 , Size · 컬러 전부 BROWN
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Cotton 100% Polyester 100% · 사진 8장
- 설명: Voluminous balloon sleeves bring dramatic proportions to a classic pinstriped button-down shirt woven from crisp cotton. Designed with a structured collar, cent
- 디테일: Fine pinstripe pattern · Classic collar with front button placket · Voluminous balloon sleeves with fitted cuffs · Back yoke detail · Loose, relaxed fit · Lined interior
- 페이지의 칸 제목: size & fit

</details>

<details><summary><b>Evereve</b> — Tourist Tee (firefox)</summary>

- 주소: https://evereve.com/products/tourist-tee-white
- 가격 $38 · 통화 USD · 코드 34077
- 컬러 White · 컬러 전부 White
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Cotton 52% / Polyester 40% / Viscose 8% · 사진 4장
- 설명: Crafted from a lightweight jersey knit, the Tourist Tee by Z Supply features a crew neckline, ladder stitch detail, and a comfortable, relaxed fit.
- 디테일: Neckline: Crew Neck · Material: 52% Cotton, 40% Polyester, 8% Rayon Knit · Care: Machine Wash,Wash Cold,Delicate / Gentle Cycle,Dry Flat
- 페이지의 칸 제목: details · material & care · fit

</details>

<details><summary><b>Everlane</b> — The Box-Cut Tee in Essential Cotton / Peyote / No Pocket (firefox)</summary>

- 주소: https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-peyote
- 가격 $20 · 정가 $34 · 통화 USD · 코드 F-T-CTN-ORGN-BOX-PEY
- 컬러 Ponderosa Pine · 컬러 전부 —
- 사이즈 XXS, XS, S, M, L, XL, XXL · 재고 XXS, XS, S, M, L, XL
- 혼용률 Cotton 100% · 사진 6장
- 설명: With over 1M sold, we don’t mean to brag, but this tee is kind of a big deal. Famous for its crew neck, perfectly relaxed fit, slightly cropped length, easy sho
- 디테일: Relaxed fit · Slightly cropped length · Length: 22.5" · 100% Organic Cotton, Exclusive of Elastic · Machine Wash Cold. Gentle Cycle with Like Colors. Only Non-Chlorine Bleach When Needed. Tumble Dry Low. Cool Iron When Needed.
- 페이지의 칸 제목: fit · details · description · materials & care

</details>

<details><summary><b>Faherty</b> — Silk Velvet Harriet Top - Moonward Plaid (firefox)</summary>

- 주소: https://fahertybrand.com/products/silk-velvet-harriet-top-moonward-plaid
- 가격 $198 · 통화 USD · 코드 WTH2607-MWP
- 컬러 Moonward Plaid · 컬러 전부 Moonward Plaid
- 사이즈 XXS, XS, S, M, L, XL, XXL · 재고 XXS, XS, S, M, L, XL, XXL
- 혼용률 Viscose 85% / Silk 15% · 사진 5장
- 설명: Made from a silky velvet blend, this top has extra fabric at the neckline that folds and drapes softly instead of sitting flat against the chest. It's fully lin
- 디테일: Detail: Cowl neck top. Lined. · Material: 85% Viscose, 15% Silk; Recycled Polyester lining · Model: Aude is 5'9" wearing size Small · Care: Dry clean only · WTH2607-MWP
- 페이지의 칸 제목: description · details · fit

</details>

<details><summary><b>FP Movement</b> — Download on the App Store (firefox)</summary>

- 주소: https://itunes.apple.com/us/app/free-people/id659532790
- 가격 — · 통화 — · 코드 —
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 0장
- 설명: —
- 디테일: —

</details>

<details><summary><b>Frame</b> — The Wave Tie Top -- Mahogany (firefox)</summary>

- 주소: https://frame-store.com/products/the-wave-tie-top-wp27jkt017-mahg
- 가격 $378 · 통화 USD · 코드 WP27JKT017-MAHG
- 컬러 MAHOGANY · 컬러 전부 MAHOGANY
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Viscose 100% · 사진 7장
- 설명: THE WAVE TIE TOP
- 디테일: —
- 페이지의 칸 제목: size & fit · materials & care · care

</details>

<details><summary><b>Frank & Eileen</b> — WAVERLY Pine, Vintage Jersey (firefox)</summary>

- 주소: https://www.frankandeileen.com/products/waverly-pine-vintage-jersey
- 가격 $268 · 통화 USD · 코드 LABWAVERLY-PINE
- 컬러 Pine / XS - $268 · 컬러 전부 Pine
- 사이즈 XS, S, M, L, XL · 재고 XS, M
- 혼용률 Cotton 100% · 사진 4장
- 설명: Waverly is the cool button-up we all want. A tailored front and a longer back create an easy fit and iconic yet understated look.
- 디테일: Shirttail hem long enough to cover your bum · Tailored fit that drapes over your hips · Shaped like a pear with soft rounded shoulders · Chest pocket · Signature bust flattering button placement and long sleeves with button cuffs · Paloma is 5'9" with a 34" bust wearing a size S
- 페이지의 칸 제목: description · fit
- 메모: 클릭해야 그려지는 디테일: impit 10줄 → 파이어폭스 11줄

</details>

<details><summary><b>Gap</b> — Visit the Gap Gift Shop (firefox)</summary>

- 주소: https://www.gap.com/browse/women/gift-shop
- 가격 — · 통화 — · 코드 —
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 100% · 사진 0장
- 설명: —
- 디테일: —
- 페이지의 칸 제목: details
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>Garnet hill</b> — Essential Long-Sleeve Tee (firefox)</summary>

- 주소: https://www.garnethill.com/essential-long-sleeve-tee/holiday-gifts/shops/gifts-for-her/468762
- 가격 $44 · 통화 USD · 코드 43309
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 4장
- 설명: Experience everyday luxury with our Essential Long-Sleeve Tee, crafted from a blend of organic pima cotton and TENCEL Modal for ultimate comfort and style. Shop
- 디테일: —
- 페이지의 칸 제목: features · details

</details>

<details><summary><b>Gerard darel</b> — t shirt bara det03e2069100 (firefox)</summary>

- 주소: https://gerarddarel.com/en-us/products/t-shirt-bara_det03e2069100
- 이름: 페이지 "T-shirt en coton épais - BARA" · 카탈로그 "t shirt bara det03e2069100"(목록 수집이 붙인 이름)
- 가격 $66.5 · 정가 $95 · 통화 USD · 코드 DET03E206\1
- 컬러 Black · 컬러 전부 Black
- 사이즈 T0, T1, T2, T3, T4 · 재고 T1, T3, T4
- 혼용률 Cotton 100% · 사진 8장
- 설명: Esprit sportswear pour le tee-shirt Bara à col rond, finitions bord-côtes et confectionné dans un coton épais. Proposé en noir pour un porter facile au quotidie
- 디테일: Traceability (opens in a new tab) · Complete the look (+2) · Straight shape · Plain cotton · Standard length · Round neck
- 페이지의 칸 제목: description · composition · care
- 메모: 클릭해야 그려지는 디테일: impit 2줄 → 파이어폭스 14줄

</details>

<details><summary><b>Goldie</b> — Allure Tee (firefox)</summary>

- 주소: https://www.goldietees.com/products/allure-tee
- 가격 $125 · 통화 USD · 코드 16001BRNWHT-WHT
- 컬러 White / XS - $125.00 · 컬러 전부 White
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L
- 혼용률 Cotton 100% · 사진 4장
- 설명: On the double: one relaxed, boxy tee, two looks. Made from slub jersey layers in contrasting tones, this reversible essential lets you switch up your style in s
- 디테일: 50% cotton, 50% polyester · Demi-sheer dévoré jersey with floral scrollwork detailing · Made in Peru · Body length: 23” · Machine wash
- 페이지의 칸 제목: care

</details>

<details><summary><b>Good American</b> — the combo layered tee Regular price$88.00 30% Off with code HOLIDAY (firefox)</summary>

- 주소: https://www.goodamerican.com/products/the-combo-layered-tee-chalk-with-chalk
- 이름: 페이지 "THE COMBO LAYERED TEE / CHALK WITH CHALK" · 카탈로그 "the combo layered tee Regular price$88.00 30% Off with code HOLIDAY"(목록 수집이 붙인 이름)
- 가격 $88 · 통화 USD · 코드 GT0842-CHCH
- 컬러 oklch(1 0 0) · 컬러 전부 CHALK WITH CHALK
- 사이즈 XS, S, M, L, XL, 1XL, 2XL, 3XL · 재고 XS, S, M, L, XL, 1XL, 3XL
- 혼용률 Cotton 100% · 사진 6장
- 설명: The layered look, all in one. Made from 100% cotton lightweight jersey that feels soft and holds its shape, this two-in-one tee gives you the look of perfectly 
- 디테일: 21" long from shoulder · p]:m-0"> · 100% Cotton · Machine wash cold on gentle cycle with like colors. Do not bleach. Tumble dry low, iron on low heat. Do not dry clean. · Model · Model is 5'6 wearing size XS
- 페이지의 칸 제목: details · care · size & fit · fit

</details>

<details><summary><b>Greyson</b> — Croc Halley Long Sleeve Top (firefox)</summary>

- 주소: https://greysonclothiers.com/products/croc-halley-long-sleeve-top
- 가격 $140 · 통화 USD · 코드 LFA26K17A-713
- 컬러 Brown · 컬러 전부 CLAY
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Nylon 86% / Elastane 14% · 사진 1장
- 설명: The instinctual power of croc, perfected. Tonal scales soften the classic crocodile motif, transforming a dimensional print into an organic, fluid expression of
- 디테일: —
- 페이지의 칸 제목: details · materials & care

</details>

<details><summary><b>Gymshark</b> — Vital Sweetheart Neck Crop Top (firefox)</summary>

- 주소: https://row.gymshark.com/products/gymshark-vital-sweetheart-neck-crop-top-ls-tops-black-ss26
- 가격 $30 · 통화 USD · 코드 7477752299591
- 컬러 Black Marl · 컬러 전부 —
- 사이즈 xs, s, m, l, xl, xxl · 재고 xs, s, m, l, xl, xxl
- 혼용률 Nylon 96% / Elastane 4% · 사진 1장
- 설명: VITAL. EVERY TIME.HIIT staples, Pilates must-haves, lifting fits, running essentials...Vital’s the gym girl go-to every time. Contouring mesh dots shape your ph
- 디테일: Designed for HIIT, Pilates, lifting and running. This crop top is body fit and made from breathable & sweat-wicking fabric. · Seamless · A comfortable, seamless design means zero distractions and full focus on your training. · Sweat-wicking · Sweat-wicking tech keeps you dry through the sweatiest sessions. · Body fit
- 페이지의 칸 제목: description · features · size & fit · materials & care

</details>

<details><summary><b>Hobbs</b> — Tamsin Ribbed Long Sleeve Top (firefox)</summary>

- 주소: https://www.hobbs.com/us/product/tamsin-ribbed-long-sleeve-top/0226-2361-3647L00-VIOLET-BLUE.html
- 가격 $73.5 · 통화 USD · 코드 0226-2361-3647L00
- 컬러 Violet Blue · 컬러 전부 Violet Blue
- 사이즈 —
- 혼용률 Cotton 95% / Elastane 5% · 사진 5장
- 설명: Product Code: 0226-2361-3647L00 Fabric Composition: 95% Cotton, 5% Elastane Length: Side neck point to hem 58.5cm / 23 inches Unlined Care: Machine Wash Necklin
- 디테일: Breathable cotton · Relaxed fit · Gold shoulder buttons · Long sleeve · Round neck · Fabric: 95% Cotton, 5% Elastane
- 페이지의 칸 제목: details · composition · care · product care

</details>

<details><summary><b>J crew</b> — CY803 (firefox)</summary>

- 주소: https://www.jcrew.com/p/womens/categories/clothing/shirts-and-tops/CY803
- 이름: 페이지 "Scoopneck tank top in cupro blend" · 카탈로그 "CY803"(목록 수집이 붙인 이름)
- 가격 $58.8 · 통화 USD · 코드 CY803-BR8844
- 컬러 PEPPERCORN · 컬러 전부 NAVY, PALE PINK, BLACK, PEPPERCORN
- 사이즈 —
- 혼용률 Cupro 60% / Viscose 40% · 사진 6장
- 설명: Scoopneck tank top in cupro blend for women - Find the best selection available in-stores and online at J.Crew.
- 디테일: 60% cupro/40% viscose. · Machine wash. · Imported. · Item CY803. · Classic fit. · Hits above waist.
- 페이지의 칸 제목: details · product details · size & fit
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>J.jill</b> — Printed Smocked-Detail Top (impit)</summary>

- 주소: https://www.jjill.com/product/printed-smocked-detail-top?color=CW3
- 가격 $79 · 통화 USD · 코드 331961
- 컬러 lakeside vibrant wallart · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 60% / Lyocell 40% · 사진 1장
- 설명: Printed Smocked-Detail Top + lakeside vibrant wallart
- 디테일: —
- 페이지의 칸 제목: fit

</details>

<details><summary><b>J.mclaughlin</b> — Model wearing Signature Tee in Grand Heraldic Tassel by J.McLaughlin with a gold chain pattern and white pants (firefox)</summary>

- 주소: https://www.jmclaughlin.com/products/signature-tee-grand-heraldic-tassel-cream-gold
- 이름: 페이지 "Cream/Gold Grand Heraldic Tassel Signature Tee / Women's Tops / J.McLaughlin" · 카탈로그 "Model wearing Signature Tee in Grand Heraldic Tassel by J.McLaughlin with a gold chain pattern and white pants"(목록 수집이 붙인 이름)
- 가격 $178 · 통화 USD · 코드 0003616800-CREAM/GOLD
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Nylon 91% / Elastane 9% · 사진 1장
- 설명: Classic yet contemporary, J. McLaughlin's Signature Tee in Cream/Gold Grand Heraldic Tassel is innovatively nostalgic. Free shipping over $150.
- 디테일: Runs Small True to Size Runs Big · Fit rating: True to Size , on a scale from Runs Small to Runs Big . · Crewneck · 3/4 sleeves · Pullover · Catalina Cloth (91% Nylon, 9% Spandex)
- 페이지의 칸 제목: size & fit · description · details
- 메모: 클릭해야 그려지는 디테일: impit 9줄 → 파이어폭스 10줄

</details>

<details><summary><b>Jager</b> — Textured Striped T-Shirt (firefox)</summary>

- 주소: https://www.marksandspencer.com/textured-striped-t-shirt/p/clp61248347#intid=pid_pg1pip4g2r1c1
- 가격 £69 · 통화 GBP · 코드 P61248347
- 컬러 CHOCOLATE · 컬러 전부 —
- 사이즈 —
- 혼용률 Viscose 100% · 사진 7장
- 설명: This short sleeve t-shirt from JAEGER has a textured stripe for a soft, tactile finish. It has a round neck and a button and keyhole at the back, and it pairs n
- 디테일: Product Length: Standard · Fit: Regular fit · Fastening: Back button fastening · Unlined · 100% viscose (exclusive of trimmings) · Do not wash
- 페이지의 칸 제목: composition · care · fit

</details>

<details><summary><b>James Perse</b> — Sheer Slub Long Sleeve Crew - Coastal (firefox)</summary>

- 주소: https://www.jamesperse.com/products/sheer-slub-long-sleeve-crew-coastal-wua3361
- 가격 $105 · 통화 USD · 코드 WUA3361_COASTAL
- 컬러 Coastal · 컬러 전부 Coastal
- 사이즈 0, 1, 2, 3, 4 · 재고 0, 1, 2, 3, 4
- 혼용률 Cotton 100% · 사진 6장
- 설명: Lightweight and sheer, this long sleeve crew is cut from 100% cotton with a slub texture that introduces a subtle vintage character. The slim silhouette is carr
- 디테일: —
- 페이지의 칸 제목: size & fit · description

</details>

<details><summary><b>Jigsaw</b> — Metallic Jersey Top / Navy (firefox)</summary>

- 주소: https://www.jigsaw-online.com/products/metallic-jersey-top-navy
- 가격 $82 · 정가 $110 · 통화 GBP · 코드 J53113_BL010
- 컬러 XS / Navy · 컬러 전부 Navy
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Polyester 95% / Elastane 5% · 사진 5장
- 설명: A metallic shimmer runs through this jersey top, finished with a soft cowl neckline and long sleeves. Tucks at the sides give it a fitted silhouette that holds 
- 디테일: —
- 페이지의 칸 제목: product details · materials and care

</details>

<details><summary><b>L.L bean</b> — Gifts for Her (firefox)</summary>

- 주소: https://global.llbean.com/llb/shop/509870/
- 가격 — · 통화 — · 코드 —
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 0장
- 설명: Gift giving from L.L.Bean is easy for any event. See our Gift Shop for great gift ideas including gift cards, monogrammed gifts, cool jackets or classic styles 
- 디테일: Canvas (1) Refine by Fabric: Canvas · Cashmere (12) Refine by Fabric: Cashmere · Chamois (3) Refine by Fabric: Chamois · Corduroy (2) Refine by Fabric: Corduroy · Cotton (98) Refine by Fabric: Cotton · Cotton Blend (16) Refine by Fabric: Cotton Blend
- 페이지의 칸 제목: details · features · fit · product details · size & fit · fabric & care

</details>

<details><summary><b>La Ligne</b> — Picture of Mabel Tank (firefox)</summary>

- 주소: https://lalignenyc.com/products/mabel-tank-spice
- 이름: 페이지 "Mabel Tank in Spice" · 카탈로그 "Picture of Mabel Tank"(목록 수집이 붙인 이름)
- 가격 $125 · 통화 USD · 코드 8404915447
- 컬러 Spice · 컬러 전부 Spice, Smoky quartz, Midnight, Chocolate, Olive, Ivory
- 사이즈 XXS, XS, S, M, L, XL · 재고 XXS, XS, S, M, L, XL
- 혼용률 Acetate 80% / Polyester 20% Polyester 100% · 사진 11장
- 설명: As you start collecting all of our satin Colby Pants, we made the perfect partner to complete the look with our Mabel Tank, made in NYC from the same sl...
- 디테일: 80% acetate, 20% polyester · Lining: 100% polyester · Spice · Japanese satin · Made in New York · Scoop neck
- 페이지의 칸 제목: details · size & fit · care

</details>

<details><summary><b>Leset</b> — The Margo (firefox)</summary>

- 주소: https://leset.com/products/the-margo-white
- 가격 $78 · 통화 USD · 코드 LT017A-CTN
- 컬러 White · 컬러 전부 White
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Cotton 100% · 사진 10장
- 설명: "The Margo T-Shirt is probably the most worn item in my wardrobe. It has a relaxed cut and looks great layered or on its own. I’ve convinced almost everyone in 
- 디테일: Model 1: 5’9”, Wearing Size S. · Model 2: 5’8”, Wearing Size L. · Fits true to size, we recommend taking your normal size.

</details>

<details><summary><b>Lilla P</b> — High Neck Tank (firefox)</summary>

- 주소: https://lillap.com/products/high-neck-tank-1
- 가격 $68 · 통화 USD · 코드 PA3833
- 컬러 Black · 컬러 전부 Black, Nude, White
- 사이즈 X-Small, Small, Medium, Large, X-Large · 재고 X-Small, Small, Medium, Large, X-Large
- 혼용률 Cotton 95% / Elastane 5% · 사진 10장
- 설명: Our High Neck Tank is the newest addition to our Stretch Layering Collection, and it answers a specific need: coverage at the neckline without a sleeve. In Pima
- 디테일: —
- 페이지의 칸 제목: description

</details>

<details><summary><b>LNA</b> — Timeless Ribbed Tank - Fiery Red (firefox)</summary>

- 주소: https://www.lnaclothing.com/products/cw2218-timeless-ribbed-tank-fiery-red
- 가격 $68 · 통화 USD · 코드 CW2218
- 컬러 United States · 컬러 전부 Fiery Red
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Viscose 95% / Elastane 5% · 사진 6장
- 설명: A fitted 2x1 rib tank with a scoop neck line. This tank is meant to hit top of pant. Model is 5'7 and wearing a size small Material: 95% Rayon 5% Spandex Recomm
- 디테일: —

</details>

<details><summary><b>Lucky Brand</b> — BRUSHED BOAT NECK BANDED TOP, image 4 (firefox)</summary>

- 주소: https://www.luckybrand.com/brushed-boat-neck-banded-top/170762.html
- 이름: 페이지 "BRUSHED BOAT NECK BANDED TOP" · 카탈로그 "BRUSHED BOAT NECK BANDED TOP, image 4"(목록 수집이 붙인 이름)
- 가격 $35.7 · 통화 USD · 코드 170762
- 컬러 JET BLACK · 컬러 전부 —
- 사이즈 —
- 혼용률 Polyester 63% / Viscose 33% / Elastane 4% · 사진 7장
- 설명: 63% Polyester 33% Rayon 4% Elastane
- 디테일: 63% Polyester 33% Rayon 4% Elastane · Machine Wash Cold With Like Colors Turn Inside Out Do Not Bleach Tumble Dry Low Cool Iron Do Not Dry Clean
- 페이지의 칸 제목: details

</details>

<details><summary><b>Madewell</b> — OB685 (impit)</summary>

- 주소: https://www.madewell.com/kr/p/OB685/
- 이름: 페이지 "The Easy Shirt in 100% Cotton Poplin" · 카탈로그 "OB685"(목록 수집이 붙인 이름)
- 가격 ₩164440 · 통화 KRW · 코드 OB685
- 컬러 DARK CHICORY · 컬러 전부 DARK CHICORY
- 사이즈 —
- 혼용률 Cotton 100% · 사진 6장
- 설명: Made from washed cotton poplin, this shirt feels light and broken-in right from the start. The subtle monogram detail at the hem adds a personal touch that pair
- 디테일: 100% cotton. · Imported. · Item OB685
- 페이지의 칸 제목: product details · size & fit · materials & care

</details>

<details><summary><b>Marine Layer</b> — Lexi Rib Sun-In Crew Tee (firefox)</summary>

- 주소: https://www.marinelayer.com/products/lexi-rib-sun-in-crew-tee-5
- 가격 $58 · 통화 USD · 코드 1240201011410-0
- 컬러 — · 컬러 전부 Antique White
- 사이즈 Extra Small, Small, Medium, Large, Extra Large · 재고 Extra Small, Small, Medium, Large, Extra Large
- 혼용률 Cotton 49% / Lyocell 47% / Elastane 4% · 사진 5장
- 설명: —
- 디테일: 49% Cotton, 47% TENCEL™ Modal, 4% Spandex · Hugs the body · Garment dyed · Machine wash cold, tumble dry low · Made responsibly in China
- 페이지의 칸 제목: details

</details>

<details><summary><b>Massimo Dutti</b> — Asymmetrical long-sleeved burgundy top set with side draping, beige wide-leg pants with pockets, and black shoes. (firefox)</summary>

- 주소: https://www.massimodutti.com/us/asymmetric-long-sleeve-flowing-top-l06873575
- 이름: 페이지 "Asymmetric long sleeve flowing top" · 카탈로그 "Asymmetrical long-sleeved burgundy top set with side draping, beige wide-leg pants with pockets, and black shoes."(목록 수집이 붙인 이름)
- 가격 $90 · 통화 USD · 코드 65268623
- 컬러 BURGUNDY · 컬러 전부 BURGUNDY
- 사이즈 XS, S, M, L, XL
- 혼용률 Lyocell 70% / Wool 30% · 사진 1장
- 설명: Asymmetric Long Sleeve Flowing Top
- 디테일: —
- 페이지의 칸 제목: product care

</details>

<details><summary><b>Me+Em</b> — Slim Knit Top (firefox)</summary>

- 주소: https://www.meandem.com/us/ss27kn364001039xxs-charcoal-melange
- 가격 $345 · 통화 USD · 코드 —
- 컬러 Charcoal Mélange · 컬러 전부 Charcoal Mélange
- 사이즈 —
- 혼용률 Cashmere 100% · 사진 1장
- 설명: ME+EM's Charcoal Cashmere Slim Knit Top has a smooth shape and lightweight feel for layering potential. Shop now.
- 디테일: Slim fit · Crew neckline · Saddle shoulder · Full-length sleeves · Standard body length · Rolled trims
- 페이지의 칸 제목: fit · composition

</details>

<details><summary><b>Michael Stars</b> — Kailee V-Neck Long Sleeve Tee (firefox)</summary>

- 주소: https://www.michaelstars.com/products/kailee-v-neck-long-sleeve-tee-46013
- 가격 $88 · 통화 — · 코드 46013
- 컬러 ' + startColor + ' · 컬러 전부 WHITE, CHALK, NOCTURNAL, BLACK
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, XL, L
- 혼용률 Cotton 100% · 사진 8장
- 설명: Kailee is the v-neck that offers the perfect amount of effortless cool. This long sleeve tee features a rolled detail at the neck, sleeve opening and hem. Desig
- 디테일: Fitted Semi-Fitted Relaxed · Ultra Rib Dresses Gauze Dresses Linen Dresses · New Jersey: 100% Cotton · Machine Wash / Tumble Dry Low
- 페이지의 칸 제목: fit · details

</details>

<details><summary><b>Mint velvet</b> — Black Jersey Draped Sleeveless Top (firefox)</summary>

- 주소: https://mintvelvet.com/products/black-jersey-draped-sleeveless-top
- 가격 $69 · 통화 GBP · 코드 042649BLCK00
- 컬러 Black · 컬러 전부 —
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Elastane 8% / Nylon 34% / Viscose 58% · 사진 7장
- 설명: Black jersey sleeveless top featuring a high neckline, shoulder pads, draped detailing and gathered sides.
- 디테일: Main, 8% elastane, 34% polyamide, 58% viscose
- 페이지의 칸 제목: fabric & care
- 메모: 클릭해야 그려지는 디테일: impit 0줄 → 파이어폭스 1줄

</details>

<details><summary><b>Monrow</b> — Supimaluxe Rib Scoop Neck Tank (firefox)</summary>

- 주소: https://www.monrow.com/products/supimaluxe-rib-scoop-neck-tank-dustycocoa
- 가격 $78 · 통화 USD · 코드 HT1595LR2_DUSTY COCOA
- 컬러 Supersoft Straight Leg Vintage Sweatpant · 컬러 전부 DUSTY COCOA
- 사이즈 XXS, XS, S, M, L, XL · 재고 XXS, XS, M, L
- 혼용률 Modal 49% / Cotton 48% / Elastane 3% · 사진 4장
- 설명: This tank top is the kind of not-so-basic basic that you will continuously reach for. Grab this flattering tank to round out your collection of base layers.
- 디테일: The model is wearing a size Small and is 5’9”, 25” waist, 36” hips, 33” bust”,“Machine wash cold, tumble dry low or, lay flat to dry · Style #HT1595LR2

</details>

<details><summary><b>Monsoon</b> — Magdalena Sleeveless Paisley Top Yellow (firefox)</summary>

- 주소: https://www.monsoonlondon.com/ie/magdalena-sleeveless-paisley-top-yellow-10063060005.html
- 가격 €32 · 통화 EUR · 코드 10063060005
- 컬러 Yellow · 컬러 전부 —
- 사이즈 —
- 혼용률 Viscose 100% · 사진 6장
- 설명: Thank us later. Brimming with boho charm, this top is printed with pretty paisleys on a tangerine backdrop. Spun in a lightweight fabric, it features pintuck pl
- 디테일: Outer: LENZING ECOVERO Viscose 100% · L 62 CM · machine wash · Pull on · Notch · Sleeveless
- 페이지의 칸 제목: description · details

</details>

<details><summary><b>Nation LTD</b> — Maxine Long Sleeve (firefox)</summary>

- 주소: https://nation.la/products/maxine-long-sleeve-heather-grey
- 가격 $198 · 통화 USD · 코드 11084RBLH_HGR
- 컬러 Heather Grey · 컬러 전부 Heather Grey
- 사이즈 XS, S, M, L, XL, XXL · 재고 S, M, L, XL, XXL
- 혼용률 — · 사진 9장
- 설명: Details that turn heads. The Maxine Long Sleeve is a flattering, fitted core piece with a crew neck, shank button cuffs, and contrast poplin yoke detail at the 
- 디테일: MADE IN Peru · Has Stretch · Softer · Heavyweight · ['S', 'SM', 'SMALL'].includes(String(variant[sizeKey] // '').toUpperCase()) · && (!color // variant[colorKey] === color)
- 페이지의 칸 제목: description · care

</details>

<details><summary><b>Nike</b> — Nike Air Max 2017 (firefox)</summary>

- 주소: https://www.nike.com/t/air-max-2017-mens-shoes-BVqnkV/849559-001
- 이름: 페이지 "Nike Air Max 2017 Men's Shoes" · 카탈로그 "Nike Air Max 2017"(목록 수집이 붙인 이름)
- 가격 $139.97 · 통화 USD · 코드 BVqnkV
- 컬러 White/Black · 컬러 전부 Black/Anthracite/White
- 사이즈 6, 6.5, 7, 7.5, 8.5, 9, 9.5, 10, 10.5, 11 · 재고 6, 6.5, 7, 7.5, 8.5, 9, 9.5, 10, 10.5, 11
- 혼용률 — · 사진 1장
- 설명: MAX CUSHION FOR MAX COMFORT. The Nike Air Max 2017 delivers the plush sensation you love with a full-length Max Air unit. The upper is seamlessly constructed wi
- 디테일: Not intended for use as Personal Protective Equipment (PPE) · Shown: Black/Anthracite/White · Style: 849559-001
- 페이지의 칸 제목: product details

</details>

<details><summary><b>Ninety Percent</b> — Verity Wide Neckline Vest In Chalk (firefox)</summary>

- 주소: https://ninetypercent.com/products/verity-wide-neckline-vest-in-chalk-aw26
- 가격 $36 · 통화 GBP · 코드 NPJW-8978
- 컬러 Chalk · 컬러 전부 Chalk
- 사이즈 4, 6, 8, 10, 12, 14, 16, 18 · 재고 4, 6, 8, 10, 12, 14, 16, 18
- 혼용률 Cotton 95% / Elastane 5% · 사진 5장
- 설명: The Verity Wide Neckline Vest is a simple wardrobe staple with a wide square neckline and broad shoulder straps. Cut from soft organic cotton jersey with added 
- 디테일: Machine wash on medium cycle · Professional dry clean at gentle cycle · Do not bleach · Do not tumble dry · Organic Cotton is a natural crop, both durable and biodegradable. · It’s comfortable, breathable and hypoallergenic.
- 페이지의 칸 제목: highlights · description

</details>

<details><summary><b>Nylora</b> — SARA TOP CHARCOAL (firefox)</summary>

- 주소: https://nylora.com/products/sara-top-charcoal
- 가격 $128 · 통화 USD · 코드 NT1200_H
- 컬러 1A1A1A · 컬러 전부 —
- 사이즈 XS, S, M, L · 재고 XS, S, M, L
- 혼용률 Nylon 77% / Elastane 23% · 사진 8장
- 설명: DETAILS: Color: Charcoal Front crew neckline with back scoop detail Nylora's signature 4-way stretch fabric Built-in bra with removable padding White heat seal 
- 디테일: Color: Charcoal · Front crew neckline with back scoop detail · Nylora's signature 4-way stretch fabric · Built-in bra with removable padding · White heat seal Nylora emblem detail at back · 77% Nylon, 23% Spandex
- 페이지의 칸 제목: details

</details>

<details><summary><b>Oak + Fort</b> — VELVET LACE CAMI TOP (firefox)</summary>

- 주소: https://oakandfort.ca/products/lace-cami-top-kt-17996-w
- 가격 $128 · 통화 CAD · 코드 KT-17996-W
- 컬러 Taupe Gray · 컬러 전부 Taupe Gray, Brown
- 사이즈 Small, Medium, Large · 재고 Small
- 혼용률 — · 사진 5장
- 설명: This cami top is designed in soft velvet with a subtle sheen that adds depth throughout the surface. Delicate lace trim frames the V-neckline and continues alon
- 디테일: Relaxed fit · 19” length based on a size S · Model is 5'7” and is wearing a size S
- 페이지의 칸 제목: description · details · fit & sizing · materials & care

</details>

<details><summary><b>Oasis</b> — Product Volume Sleeve Sweatshirt With Cotton Collar antique rose (firefox)</summary>

- 주소: https://www.oasisfashion.com/product/oasis-volume-sleeve-sweatshirt-with-cotton-collar_baa13417?colour=antique+rose
- 이름: 페이지 "Volume Sleeve Sweatshirt With Cotton Collar" · 카탈로그 "Product Volume Sleeve Sweatshirt With Cotton Collar antique rose"(목록 수집이 붙인 이름)
- 가격 £15 · 정가 £39 · 통화 GBP · 코드 BAA13417-434-14
- 컬러 Pink · 컬러 전부 Pink
- 사이즈 —
- 혼용률 Cotton 100% Cotton 98% / Elastane 2% · 사진 4장
- 설명: An oversized broderie anglaise Peter Pan collar sits wide across the shoulders, trimmed with a scalloped eyelet edge that gives it a distinctly feminine, almost
- 디테일: An oversized broderie anglaise Peter Pan collar sits wide across the shoulders, trimmed with a scalloped eyelet edge that gives it a distinctly feminine, almost vintage-inspired character. · The sleeves are cut with generous volume through the upper arm and gather softly into ribbed cuffs, creating a billowing silhouette that moves well when worn. · Cotton fabric is breathable and soft against the skin, making it genuinely comfortable to wear from morning through to evening without feeling heavy or stiff. · The body sits in a relaxed, boxy shape with a ribbed hem band that keeps the sweatshirt from swamping the frame - it skims rather than clings. · The contrast collar trim introduces a tonal two-piece effect, so the sweatshirt reads as more considered than a standard casual top straight out of the wardrobe. · Shell: 100% Cotton. Trim: 98% Cotton. 2% Elastane. Machine washable. Model wears size 10.
- 페이지의 칸 제목: description

</details>

<details><summary><b>Old Navy</b> — Image of two toddler models wearing Old Navy mix match go clothing. (impit)</summary>

- 주소: https://oldnavy.gap.com/browse/toddler-girls/mix-and-match-shop
- 가격 — · 통화 — · 코드 —
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 100% · 사진 0장
- 설명: —
- 디테일: —
- 페이지의 칸 제목: details
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>On</b> — On Studio Long-T Clay Women – Low-impact training Tops and t-shirts (firefox)</summary>

- 주소: https://www.on.com/en-us/products/studio-long-t-w-1wg1037/womens/clay-apparel-1WG10375013
- 이름: 페이지 "Women's Studio Long-T" · 카탈로그 "On Studio Long-T Clay Women – Low-impact training Tops and t-shirts"(목록 수집이 붙인 이름)
- 가격 $70 · 통화 USD · 코드 1WG1037
- 컬러 Cassis · 컬러 전부 Cassis, Black, Clay
- 사이즈 —
- 혼용률 Polyester 91% / Elastane 9% · 사진 3장
- 설명: Layer up for low-impact training with this soft-touch long-sleeved T-shirt, featuring thumbholes for extra comfort.
- 디테일: Miko is 176 cm / 5' 9.5" and is wearing a size S · Cold machine wash · Do not bleach · Do not dry clean · Do not iron · May be tumble dried cold
- 페이지의 칸 제목: size & fit · fit
- 메모: 클릭해야 그려지는 디테일: impit 11줄 → 파이어폭스 15줄

</details>

<details><summary><b>Outdoorvoices</b> — Waffle Baby Tee in White – front close-up (shopify-json)</summary>

- 주소: https://www.outdoorvoices.com/products/w-waffle-baby-tee-white
- 이름: 페이지 "Waffle Baby Tee" · 카탈로그 "Waffle Baby Tee in White – front close-up"(목록 수집이 붙인 이름)
- 가격 $58 · 통화 — · 코드 W310003-WFL-WHK
- 컬러 — · 컬러 전부 White, Dusty Pink
- 사이즈 S, XS, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 — · 사진 6장
- 설명: Fitted baby tee in new waffle knit fabric - made of 100% cotton.
- 디테일: —
- 페이지의 칸 제목: details · fabric and care · fit

</details>

<details><summary><b>Oysho</b> — womens base layer n5063 (firefox)</summary>

- 주소: https://www.oysho.com/gb/womens-base-layer-n5063
- 가격 — · 통화 — · 코드 —
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 0장
- 설명: View by product - T shirts - Base layers - Women’s fashion at OYSHO online
- 디테일: —
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>Phase eight</b> — Hannah High Neck Sequin Top (firefox)</summary>

- 주소: https://www.phase-eight.com/row/product/hannah-high-neck-sequin-top-502514258.html
- 가격 $112 · 통화 USD · 코드 PE502514
- 컬러 Burgundy · 컬러 전부 Burgundy
- 사이즈 —
- 혼용률 Polyester 95% / Elastane 5% · 사진 7장
- 설명: Meet your new statement event top. Designed in a burgundy hue and covered in matching sequins, our Hannah top catches the light beautifully. Featuring a high ro
- 디테일: Model is 5'10/177cm · Model wears UK Size 10 · Regular Fit · 95% Polyester 5% Elastane · Delicate Machine Wash
- 페이지의 칸 제목: fit · details

</details>

<details><summary><b>Poetry</b> — Silk & cotton T-shirt, Midnight, large (firefox)</summary>

- 주소: https://www.poetryfashion.co.uk/t-shirts-and-tops/silk-cotton-jersey-t-shirt-midnight/RW51.A.html
- 이름: 페이지 "Silk & cotton T-shirt" · 카탈로그 "Silk & cotton T-shirt, Midnight, large"(목록 수집이 붙인 이름)
- 가격 £89 · 통화 GBP · 코드 RW51.A
- 컬러 Midnight · 컬러 전부 —
- 사이즈 —
- 혼용률 Silk 55% / Cotton 45% · 사진 0장
- 설명: Silk & cotton T-shirt
- 디테일: Machine wash · Our new luxurious and exceptionally soft silk and cotton jersey · Perfect chic T-shirt silhouette · Wide neck-trim · Small side-splits · Factory
- 페이지의 칸 제목: details
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>Prana</b> — Everyday Long Sleeve Tee (firefox)</summary>

- 주소: https://www.prana.com/p/everyday-long-sleeve-tee/2127531.html?dwvar_2127531_color=Nautical
- 가격 $33.6 · 통화 USD · 코드 2127531
- 컬러 Soft White · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 100% · 사진 1장
- 설명: Staple fitted tee in in 100% Regenerative Organic Certified® Cotton with a washed finish for extra softness.
- 디테일: Style # · 2127531 · Expand or collapse section · 100% Regenerative Organic Certified® Cotton · Premium Softness · No Fading With Wear
- 페이지의 칸 제목: details · product details · product highlights · product care

</details>

<details><summary><b>Project Social T</b> — The Temptress Velvet Mesh Off The Shoulder Top (firefox)</summary>

- 주소: https://www.projectsocialt.com/products/the-temptress-off-shoulder-grey
- 가격 $65 · 통화 USD · 코드 1202710A-GREY
- 컬러 — · 컬러 전부 Grey
- 사이즈 XS, S, M, L · 재고 XS, S, M, L
- 혼용률 Viscose 50% / Nylon 50% · 사진 4장
- 설명: The Temptress Velvet Mesh Off The Shoulder Top is made from velvet mesh with a slim fit and a regular crop that just skims the hip. An asymmetrical neckline sit
- 디테일: —
- 페이지의 칸 제목: description

</details>

<details><summary><b>Rag & bone</b> — The Slub Tee W272C32CH 101 (firefox)</summary>

- 주소: https://www.rag-bone.com/p/the-slub-tee-W272C32CH_101.html
- 이름: 페이지 "The Slub Tee" · 카탈로그 "The Slub Tee W272C32CH 101"(목록 수집이 붙인 이름)
- 가격 $98 · 통화 USD · 코드 W272C32CH_101
- 컬러 Black · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 100% · 사진 5장
- 설명: The perfect tee. Cut for a classic, tailored fit, our essential short-sleeve T-shirt is crafted from organic Peruvian slub cotton with a heathered look and subt
- 디테일: Slim fit · Size Small: Body length from high point shoulder 24 1/2", chest 33 1/2", sweep 36", sleeve length from center back neck 12 3/8" · Model is 5'9.5" wearing a size small · Slub pima cotton jersey · 100% pima cotton · Machine washable
- 페이지의 칸 제목: size & fit · materials & care
- 메모: 클릭해야 그려지는 디테일: impit 4줄 → 파이어폭스 10줄

</details>

<details><summary><b>Rails</b> — ALIXA TOP - ONYX BLURRED FLORAL (firefox)</summary>

- 주소: https://www.rails.com/products/alixa-top-onyx-blurred-floral
- 가격 $238 · 통화 USD · 코드 927-698C-85058505:
- 컬러 XXS · 컬러 전부 —
- 사이즈 XXS, XS, S, M, L, XL, XXL · 재고 XXS, XS, S, M, L
- 혼용률 — · 사진 5장
- 설명: Effortless romance in lightweight chiffon with a lined body, the Alixa features a deep V-neckline with cascading ruffles, a soft floral print, front button clos
- 디테일: —
- 페이지의 칸 제목: details · fit · care

</details>

<details><summary><b>Reformation</b> — Veya Silk Top $111 $148.00 $148 (firefox)</summary>

- 주소: https://www.thereformation.com/products/veya-silk-top/1319462ALO.html?dwvar_1319462ALO_color=ALO
- 이름: 페이지 "Veya Silk Top" · 카탈로그 "Veya Silk Top $111 $148.00 $148"(목록 수집이 붙인 이름)
- 가격 $111 · 통화 USD · 코드 1319462ALO
- 컬러 Almond · 컬러 전부 —
- 사이즈 —
- 혼용률 Silk 100% · 사진 1장
- 설명: Up top. Shop the Veya Silk Top from Reformation, a sleeveless top with a scoop neckline. Wear it, wear it again, and then a few more times after that.
- 디테일: Designed to have a slim fit throughout. · unlined. · The model is wearing a size XS and is 5'10", 23" waist, 34" hips, 32" bust. · This is a 19mm silk charmeuse that’s smooth to the touch. The next best thing to wearing nothing. Made from 100% Silk. Dry clean only. · Sustainably made in China Help Heads up: the country of origin above refers to stuff from our most recent production run. There may be styles in our inventory that were made somewhere else. · When we aren't making clothes in our own factory in LA, we work exclusively with factory partners who share our values of treating workers well and minimizing environmental impact.
- 페이지의 칸 제목: material & care

</details>

<details><summary><b>rouje</b> — OLIVE Top (firefox)</summary>

- 주소: https://www.rouje.com/products/olive-lace-pointelle-long-sleeve-top-navy
- 이름: 페이지 "Haut OLIVE" · 카탈로그 "OLIVE Top"(목록 수집이 붙인 이름)
- 가격 €85 · 통화 EUR · 코드 OLIVE-COTESTEMPETE-34
- 컬러 Taille · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 1장
- 설명: Top ajusté en jersey côtelé Coloris bleu tempête Col rond finitions froncées Manches longues Fabriqué au PortugalConseils taille :Cette pièce taille normalement
- 디테일: Coloris bleu tempête · Col rond finitions froncées · Manches longues · Fabriqué au Portugal Conseils taille : · Cette pièce taille normalement. · Mia mesure 176cm et porte une taille 36
- 페이지의 칸 제목: description
- 메모: 클릭해야 그려지는 디테일: impit 4줄 → 파이어폭스 12줄

</details>

<details><summary><b>Sanctuary</b> — Sparkle Boatneck Long Sleeve Tee Black (firefox)</summary>

- 주소: https://www.sanctuaryclothing.com/products/sparkle-boatneck-long-sleeve-tee-black
- 가격 $41 · 정가 $59 · 통화 USD · 코드 CT4180SM3/BLCK
- 컬러 — · 컬러 전부 BLACK
- 사이즈 XXS, XS, S, M, L, XL, XXL · 재고 M, L, XL, XXL
- 혼용률 Viscose 94% / Elastane 6% · 사진 14장
- 설명: Sparkle Boatneck Long Sleeve Tee Black
- 디테일: Long Sleeve Sparkle Boatneck Top · Boatneck · Pull On · Lightweight · Fitted · Front: 22 1/2"
- 페이지의 칸 제목: product details

</details>

<details><summary><b>Scoth & soda</b> — Loose Embroidered T-Shirt (firefox)</summary>

- 주소: https://scotchandsoda.com/products/loose-embroidered-t-shirt-u9a01764t-u014-meteorite
- 가격 $68 · 통화 USD · 코드 87211371992
- 컬러 METEORITE CHECK · 컬러 전부 Meteorite
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Cotton 100% · 사진 7장
- 설명: A loose fit t-shirt in pure cotton, detailed with branded embroidery. Style with denim for an easy casual uniform.
- 디테일: Crewneck · Short sleeve · Dropped shoulder · 100% Cotton · Machine Wash: 30°C Delicate · Style Number: U9A01764T
- 페이지의 칸 제목: highlights · description · fabric & care · size & fit

</details>

<details><summary><b>Seasalt cornwall</b> — Go to black friday page (firefox)</summary>

- 주소: https://www.seasaltcornwall.com/black-friday-deals
- 가격 — · 통화 — · 코드 —
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 0장
- 설명: Whether you’re looking for a new statement piece or a timeless classic, our Black Friday deals have your next wardrobe favourite for less.
- 디테일: —
- 페이지의 칸 제목: product details · fit
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>Shopbop</b> — Designer Boutique (firefox)</summary>

- 주소: https://www.shopbop.com/straight-leg-sweatpants-sprwmn/vp/v=1/1511586278.htm
- 이름: 페이지 "Straight Leg Sweatpants" · 카탈로그 "Designer Boutique"(목록 수집이 붙인 이름)
- 가격 $275 · 통화 USD · 코드 SPRWM30279
- 컬러 Black · 컬러 전부 Black
- 사이즈 —
- 혼용률 Polyester 50% / Cotton 38% / Viscose 12% · 사진 1장
- 설명: These SPRWMN sweatpants feature a covered elastic waistband, slant hip pockets, and a straight leg silhouette. Made in the USA, these pants offer comfort and ea
- 디테일: Model measurements: · Size M: Paloma (5'8.5") usually wears size XXS · View all model measurements · Measurements from size M · Rise: 11.5in / 29cm · Inseam: 34.75in / 88cm
- 페이지의 칸 제목: size & fit · details

</details>

<details><summary><b>Spanx</b> — SPANX AirEssentials® Turtleneck Tunic / Very Black (firefox)</summary>

- 주소: https://spanx.com/products/spanx-airessentials-turtleneck-tunic?v=48683236458707&bau-context=standard&Color=Very+Black
- 이름: 페이지 "SPANX AirEssentials® Turtleneck Tunic" · 카탈로그 "SPANX AirEssentials® Turtleneck Tunic / Very Black"(목록 수집이 붙인 이름)
- 가격 $69 · 통화 USD · 코드 196992332813
- 컬러 Very Black · 컬러 전부 Very Black, Timeless Navy, Umber Root
- 사이즈 XS · 재고 XS
- 혼용률 Modal 47% / Polyester 46% / Elastane 7% · 사진 3장
- 설명: Ultra-soft turtleneck tunic with breathable fabric and backside coverage—perfect for layering or lounging in cooler weather.
- 디테일: —
- 페이지의 칸 제목: description · size & fit · details · care · fit

</details>

<details><summary><b>Splendid</b> — Josie Layered Long Sleeve Tee (firefox)</summary>

- 주소: https://splendid.com/products/josie-layered-long-sleeve-tee
- 가격 $78 · 통화 USD · 코드 1989888
- 컬러 Black\/Shell · 컬러 전부 Black/Shell, Dark Navy/Shell, Perfect Blue/Shell, Shell/Ice Heather Grey
- 사이즈 L, M, S, XL, XS · 재고 L, M, S, XL, XS
- 혼용률 — · 사진 20장
- 설명: The layered look, already handled. Contrast trim peeks out at the neckline, cuffs and hem of the Josie Long Sleeve Tee, giving one piece the look of two.
- 디테일: Crew neckline · Long sleeves · Contrast trim at neckline, cuffs, and hem · Layered-look design · Slim fit

</details>

<details><summary><b>Splits59</b> — Ashby Rib Tank With Piping (firefox)</summary>

- 주소: https://www.splits59.com/products/ashby-rib-tank-with-piping
- 이름: 페이지 "Ashby Rib Tank with Piping - White/Black" · 카탈로그 "Ashby Rib Tank With Piping"(목록 수집이 붙인 이름)
- 가격 $78 · 통화 USD · 코드 B2181_WHITE/BLACK
- 컬러 options for Mel Airweight Lite Tank · 컬러 전부 Black/Creme, Pine Green/Creme, White/Black
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, XL
- 혼용률 Modal 95% / Elastane 5% · 사진 7장
- 설명: Designed to be your most essential workout tank. Super soft baby rib fabric to hug your body and layer effortlessly. An update on our original Ashby Tank featur
- 디테일: in partnership with Splits59 · Try before you buy · 5 days · Easily return what you don't have · Only pay for what you keep · Not right now
- 페이지의 칸 제목: details · description

</details>

<details><summary><b>Stateside</b> — Cloud Jersey Lace-Up Polo Tee in White (impit)</summary>

- 주소: https://shopstateside.us/products/cloud-jersey-lace-up-polo-tee-in-white
- 가격 $88.8 · 정가 $148 · 통화 USD · 코드 SP26-459-6178-WHT
- 컬러 XS · 컬러 전부 —
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Cotton 100% · 사진 5장
- 설명: Style Information: Elevate your everyday style with this Cloud Jersey Lace-Up Polo Tee in crisp white. Crafted from soft, breathable cloud jersey fabric, this t
- 디테일: Style Information: · #SP26-459-6178-WHT · 100% Sueded Supima Cotton · Made in the USA · Model wears size small. Review our SIZE CHART for sizing help information.
- 페이지의 칸 제목: description

</details>

<details><summary><b>Sundry</b> — Sundry 3/4 Sleeve Knit Top in Cocoa (firefox)</summary>

- 주소: https://sundryclothing.com/products/sundry-3-4-sleeve-knit-top-in-cocoa
- 가격 $54 · 정가 $90 · 통화 USD · 코드 FA26-SMJ-I86_COCOA
- 컬러 — · 컬러 전부 —
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Cotton 47% / Modal 47% / Elastane 6% · 사진 2장
- 설명: Effortless layering meets everyday comfort with this classic 3/4 sleeve knit top. The fitted v-neck creates a flattering silhouette perfect for pairing with you
- 디테일: —

</details>

<details><summary><b>Sweaty betty</b> — navigate sherpa longline puffer SB04475 Black.html (firefox)</summary>

- 주소: https://www.sweatybetty.com/us/shop/tops/jackets/navigate-sherpa-longline-puffer-SB04475_Black.html
- 이름: 페이지 "Navigate Sherpa Longline Puffer" · 카탈로그 "navigate sherpa longline puffer SB04475 Black.html"(목록 수집이 붙인 이름)
- 가격 $358.4 · 통화 USD · 코드 SB04475_Black
- 컬러 black · 컬러 전부 —
- 사이즈 —
- 혼용률 Polyester 100% Nylon 100% · 사진 1장
- 설명: Our bestselling puffer coat, now as a soft sherpa jacket. Part of our innovative HeatProtect collection with a ‘Super’ rating, thanks to the warm down filling (
- 디테일: Our bestselling puffer coat, now as a soft sherpa jacket · Part of our innovative HeatProtect collection with a ‘Super’ rating, thanks to the warm down filling (650 fill power) · Loose, longline fit with funnel collar and two-way front zipper · Two side slip pockets · Front length: 111cm / 43.5” · Model wears size S and is 178cm/5'10" tall
- 페이지의 칸 제목: product features · care
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>The Great</b> — The Turtleneck. Solid -- Almost Black (firefox)</summary>

- 주소: https://thisisthegreat.com/products/the-turtleneck-almost-black
- 가격 $125 · 통화 USD · 코드 T1371002ALBLK
- 컬러 Almost Black · 컬러 전부 Almost Black
- 사이즈 0, 1, 2, 3 · 재고 0, 1, 2, 3
- 혼용률 Cotton 100% · 사진 5장
- 설명: THE TURTLENECK
- 디테일: —
- 페이지의 칸 제목: description · size & fit · details

</details>

<details><summary><b>The upside</b> — MAYA SAL DOUBLE LAYER BRA - SETTING SUN [USW426067] (firefox)</summary>

- 주소: https://www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/
- 가격 $99.99 · 통화 USD · 코드 USW426067.22761
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Nylon 75% / Elastane 25% · 사진 7장
- 설명: [web-description]Red, orange and a flash of light blue - the Sal double-layer bra glows like late afternoon Double layer bra with a scooped neckline and back Pr
- 디테일: Double layer bra with a scooped neckline and back · Printed in our Maya red to orange ombre design · Bra underlayer in light blue with contrast binded edges · Elasticated underbust · Fully lined with removeable cups · Recycled soft peached fabrication
- 페이지의 칸 제목: details · size & fit · care

</details>

<details><summary><b>Thread & supply</b> — GINGER SHIRT (firefox)</summary>

- 주소: https://threadandsupply.com/products/ginger-shirt-copy
- 가격 $58 · 통화 USD · 코드 T8035LZTTS
- 컬러 United States (USD $) · 컬러 전부 DEEP MAHOGANY, EGGNOG, LAURA WASH, MARINA WASH STRIPE
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Lyocell 100% · 사진 20장
- 설명: Style Description: This lightweight button-up, made from our breathable Tencel fabric, is perfect for layering on breezy days. With its relaxed fit and soft dra
- 디테일: Copied to clipboard · We ship to all 50 states in the US · Please allow 1-3 business days to process order · Express 2 Day Air: Order by 12pm PT Mon–Fri; arrives in 2-4 business days · Unfortunately we DO NOT currently ship to PO Boxes · DUTY FEES ARE PRE-PAID

</details>

<details><summary><b>Tuckernuck</b> — Cream Kaiya Floral Top (firefox)</summary>

- 주소: https://tnuck.com/products/cream-kaiya-floral-top
- 가격 $350 · 통화 USD · 코드 RS27-032CEMWHT
- 컬러 Cream · 컬러 전부 Cream
- 사이즈 XXS, XS, S, M, L, XL · 재고 XXS, XS, S, M, L, XL
- 혼용률 — · 사진 7장
- 설명: An artisanal top. Intricately detailed and effortlessly feminine, the Kaiya top is cut from a textured material in a soft cream hue, it features an elegant band
- 디테일: Band collar · Long sleeves with buttoned cuffs · Front button closures · Floral-lace insets at neck, front, back, and sleeves · Textured finish · Tailyn is wearing a size XS
- 페이지의 칸 제목: size & fit

</details>

<details><summary><b>Ulla Johnson</b> — Senna Smocked Coverup Top - Nostalgia Playground (firefox)</summary>

- 주소: https://ullajohnson.com/products/senna-smocked-coverup-top-nostalgia-playground
- 가격 $250 · 통화 USD · 코드 PS271733-NOSTALGIA-PLAYGROUND
- 컬러 Nostalgia Playground · 컬러 전부 Nostalgia Playground
- 사이즈 P, S, M, L, XL · 재고 P, S, M, L, XL
- 혼용률 Cotton 100% · 사진 5장
- 설명: As part of our Pre-Spring 2027 collaboration, the Senna Top is printed with bold florals from Cassi Namoda's painting, "Nostalgia Playground." This lightweight 
- 디테일: —
- 페이지의 칸 제목: details · size & fit

</details>

<details><summary><b>Vanessa bruno</b> — Clothing T-shirt - VANESSABRUNO (firefox)</summary>

- 주소: https://www.vanessabruno.com/p/hei-t-shirt-54829.html
- 이름: 페이지 "Hei T-shirt" · 카탈로그 "Clothing T-shirt - VANESSABRUNO"(목록 수집이 붙인 이름)
- 가격 €125 · 통화 EUR · 코드 04W054508
- 컬러 Navy Blue · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 100% · 사진 5장
- 설명: In navy cotton jersey, the long-sleeved Hei T-shirt lifts a wardrobe basic with gathered shoulders.The 100% cotton jersey follows the body without clinging. Gat
- 디테일: Cotton jersey T-shirt, hip length · Round neck · Gathered shoulders, front and back · Long sleeves · Colour: navy · Close-fitting, true to size
- 페이지의 칸 제목: description

</details>

<details><summary><b>Varley</b> — Neilsen Sleeveless Knit Top - color Peacoat (firefox)</summary>

- 주소: https://www.varley.com/products/neilsen-sleeveless-knit-top?variant=67295821496493&color=Peacoat&size=XXS
- 이름: 페이지 "Neilsen Sleeveless Knit Top" · 카탈로그 "Neilsen Sleeveless Knit Top - color Peacoat"(목록 수집이 붙인 이름)
- 가격 $118 · 통화 USD · 코드 197959920067
- 컬러 Peacoat · 컬러 전부 Peacoat
- 사이즈 XXS, XS, S, M, L, XL
- 혼용률 Nylon 40% / Wool 30% / Viscose 30% · 사진 1장
- 설명: The Neilsen is an elevated take on a tank, crafted from a soft wool-blend in a super fine gauge, perfect for easy layering. A high neck keeps you warm, while Va
- 디테일: 40% Nylon, 30% Wool, 30% Viscose
- 페이지의 칸 제목: description · fabric & care
- 메모: 클릭해야 그려지는 디테일: impit 0줄 → 파이어폭스 1줄

</details>

<details><summary><b>Velvet</b> — TAYLOR PRINTED TEE (firefox)</summary>

- 주소: https://velvet-tees.com/products/taylor-feather-printed-jersey-mock-neck-tee
- 가격 $128 · 통화 USD · 코드 TAYLOR08
- 컬러 — · 컬러 전부 MULTI-FEATHER JERSEY
- 사이즈 x-small, small, medium, large, x-large · 재고 x-small, small, medium, large, x-large
- 혼용률 Viscose 95% / Elastane 5% · 사진 7장
- 설명: The Taylor is a long-sleeved mock neck tee made from a soft, stretchy feather jersey with an abstract, mottled print. The lightweight, fluid fabric drapes beaut
- 디테일: TAYLOR08 · MADE IN CHINA · MACHINE WASH · 95% VISCOSE 5% SPANDEX · MOCK NECKLINE
- 페이지의 칸 제목: highlights · details

</details>

<details><summary><b>Veronica Beard</b> — Wyeth Zebra Turtleneck Top (firefox)</summary>

- 주소: https://veronicabeard.com/products/wyeth-zebra-turtleneck-top-ochre-black
- 가격 $228 · 통화 USD · 코드 1977874555
- 컬러 Ochre\/Black · 컬러 전부 Ochre/Black
- 사이즈 XS, S, M, L, XL · 재고 S, M, L, XL
- 혼용률 Polyester 96% / Elastane 4% · 사진 5장
- 설명: A foundational piece you’ll reach for again and again. The Wyeth top is crafted from a zebra-print semi-sheer stretch knit that hugs the body for a slim, second
- 디테일: 96% Polyester, 4% Elastane · Turn inside out and machine wash cold. Lay flat. · Our model is 5’10” and is wearing a size S · Length 22.125” · Sleeve length 31” · Length 22.125” / Sleeve length 31”, based on a size S
- 페이지의 칸 제목: details · composition · care · size & fit · product details
- 메모: 클릭해야 그려지는 디테일: impit 5줄 → 파이어폭스 6줄

</details>

<details><summary><b>Vince</b> — Pima Cotton Crew Neck T-Shirt (firefox)</summary>

- 주소: https://www.vince.com/product/pima-cotton-crew-neck-t-shirt-V017384404REDOCHRE.html
- 가격 $118 · 통화 USD · 코드 V017384404REDOCHRE
- 컬러 RED OCHRE · 컬러 전부 RED OCHRE
- 사이즈 XXS, XS, S, M, L, XL
- 혼용률 Pima Cotton 100% · 사진 4장
- 설명: Our tees are informed by the desire to feel comfortable in one's own skin, which is why we've crafted this one from 100% Pima cotton — a fiber beloved for its i
- 디테일: —
- 페이지의 칸 제목: description · details · fabric & care

</details>

<details><summary><b>vineyardvines</b> — Ella Jacquard Top (firefox)</summary>

- 주소: https://www.vineyardvines.com/product/womens-woven-tops/ella-jacquard-top/2W002201.html
- 가격 $88.8 · 정가 $148 · 통화 USD · 코드 2W002201
- 컬러 Magnolia Jacq Navy · 컬러 전부 Magnolia Jacq Navy
- 사이즈 XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 — · 사진 2장
- 설명: Shimmery metallic jacquard brings beautiful texture and understated shimmer to this standout top. A flattering V-neckline and smocked cuffs add feminine polish,
- 디테일: 81% nylon, 19% metallic · Gold metallic jacquard fabric · V-neckline · Smocked cuffs · 24" from top of shoulder to bottom hem, based on a size small · Imported
- 페이지의 칸 제목: details · description · features

</details>

<details><summary><b>Vuori</b> — Vuori AllTheFeels™ Layered Tank (firefox)</summary>

- 주소: https://vuoriclothing.com/products/womens-vuori-allthefeels-layered-tank-maraschino
- 가격 $78 · 통화 USD · 코드 vuori-allthefeels-layered-tank
- 컬러 Maraschino · 컬러 전부 Maraschino, Black, French Roast
- 사이즈 XXS, XS, S, M, L, XL, XXL · 재고 XXS, XS, S, M, L, XL
- 혼용률 Nylon 75% / Elastane 25% Polyester 86% / Elastane 14% · 사진 3장
- 설명: Shop the Vuori AllTheFeels™ Layered Tank in Maraschino. This women's supportive tank top is made with Vuori BlissBlend™ fabric & moisture-wicking performance.
- 디테일: Moisture Wicking · Buttery soft Vuori BlissBlend™ stretch knit for easy movement · Stretch to Fit; Form fitting though the body · Cropped · Model is 5'7 1/2" in size XS · 75% Polyamide (Recycled), 25% Elastane (Shell), 86% Polyester (Recycled), 14% Elastane (Liner)
- 페이지의 칸 제목: product details · fit · fabric & care · product features

</details>

<details><summary><b>WHBM</b> — Satin Front Short Sleeve Tee (firefox)</summary>

- 주소: https://www.whitehouseblackmarket.com/store/product/satin-front-short-sleeve-tee/570421368?inseam=regular&sizeType=regular&color=190&catId=cat4769286&collectionId=category&queryId=d9048cf76c8aa154df879765d8492e70&indexName=prod_whbm_products&parentId=199761602643
- 가격 $29.4 · 통화 USD · 코드 199761603442
- 컬러 Ecru · 컬러 전부 Ecru
- 사이즈 —
- 혼용률 Polyester 96% / Elastane 4% Cotton 54% / Modal 41% / Elastane 5% · 사진 1장
- 설명: We've combined two of your favorite fabrics into one versatile top. Crafted with a blend of satin + knit fabrics, this design features a satin front, elevating 
- 디테일: Modern, effortless fit · Short sleeve · Crew neck · Regular length: 23 1/4” · Front: 96% Polyester, 4% Spandex · Back: 54% Cotton, 41% Modal, 5% Spandex
- 페이지의 칸 제목: details · product details
- 메모: 클릭해야 그려지는 디테일: impit 0줄 → 파이어폭스 9줄

</details>

<details><summary><b>Whistles</b> — White Rosa Double Trim T-Shirt (firefox)</summary>

- 주소: https://www.whistles.com/us/product/rosa-double-trim-t-shirt-30980.html
- 가격 $51.75 · 통화 USD · 코드 rosa-double-trim-t-shirt-40171
- 컬러 White · 컬러 전부 White
- 사이즈 —
- 혼용률 Cotton 100% · 사진 6장
- 설명: You can never have too many T-shirts and our Rosa style will become a wardrobe staple you keep returning to. Cut from soft cotton in a relaxed silhouette, it is
- 디테일: 100% Cotton · Regular fit · Length: 60cm · Emma is 5'8''/173cm and wears a US size S/4-6 · Product fit · Perfect
- 페이지의 칸 제목: product details · product fit · composition · product care
- 메모: 클릭해야 그려지는 디테일: impit 17줄 → 파이어폭스 21줄

</details>

<details><summary><b>Whitestuff</b> — KIM BUTTON THROUGH TEE (firefox)</summary>

- 주소: https://www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI
- 가격 £29.4 · 통화 GBP · 코드 447978
- 컬러 — · 컬러 전부 —
- 사이즈 —
- 혼용률 Cotton 100% · 사진 1장
- 설명: This long-sleeve tee has buttons down the front. Perfect for when things feel a little chilly in the morning but brighten up by lunchtime. Made with 100% organi
- 디테일: 100% Organic Cotton · Size M high shoulder neck point to hem approx. 59cm · Crew Neck · Long Sleeve · Regular fit · Machine Washable
- 페이지의 칸 제목: details

</details>

<details><summary><b>Wilson</b> — Everyday Brami (firefox)</summary>

- 주소: https://www.wilson.com/en-us/products/everyday-brami-ww00015
- 가격 $34 · 정가 $68 · 통화 USD · 코드 WW00015
- 컬러 label · 컬러 전부 Black, Griffin / Bright White, Bright White, Chateau Pink, Sandrift Stripe, Fig
- 사이즈 2XS, XS, S, M, L, XL · 재고 XS, S, M, L, XL
- 혼용률 Nylon 100% · 사진 20장
- 설명: The Everyday Brami is just that -- the multi-purpose piece with just the right coverage to do it all. It's incredibly nuanced and considered for such a vital ga
- 디테일: —
- 페이지의 칸 제목: features · product details · composition

</details>

<details><summary><b>Wrap</b> — Striped jersey top, Blue stone, large (firefox)</summary>

- 주소: https://www.wraplondon.com/jersey-tops/tencel-cotton-striped-jersey-top-blue-stone/TH87.A.html
- 이름: 페이지 "Striped jersey top" · 카탈로그 "Striped jersey top, Blue stone, large"(목록 수집이 붙인 이름)
- 가격 $115 · 통화 USD · 코드 TH87.A
- 컬러 Blue stone · 컬러 전부 —
- 사이즈 —
- 혼용률 — · 사진 0장
- 설명: Striped jersey top
- 디테일: Machine wash · Tencel cotton jersey · Slim-fit · All-over stripe · Round neckline · Full-length sleeves
- 페이지의 칸 제목: details
- 메모: 상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다

</details>

<details><summary><b>Xirena</b> — X2605 Tee Chocolate Cherry Troy Tee Chocolate Cherry Troy Tee (firefox)</summary>

- 주소: https://www.xirena.com/products/chocolate-cherry-troy-tee
- 이름: 페이지 "Chocolate Cherry Troy Tee" · 카탈로그 "X2605 Tee Chocolate Cherry Troy Tee Chocolate Cherry Troy Tee"(목록 수집이 붙인 이름)
- 가격 $210 · 통화 USD · 코드 X6BJX045
- 컬러 Chocolate Cherry · 컬러 전부 Chocolate Cherry
- 사이즈 X-Small, Small, Medium, Large, X-Large · 재고 X-Small, Large, X-Large
- 혼용률 Cotton 100% · 사진 5장
- 설명: Earn your stripes. Troy is made in our ultra-soft striped cotton jersey. This vintage-inspired rugby tee features a contrast white poplin collar, partial button
- 디테일: Fabric Description: Bedford Striped Jersey / 100% Cotton · Care Guide: Machine wash cold, gentle cycle, tumble dry low · Provenance: Los Angeles · Style Number: X6BJX045 · Fit: True to size · Model: 5'10" and wears size Small
- 페이지의 칸 제목: details · size & fit

</details>

<details><summary><b>Z Supply</b> — Arlet Stripe Thermal Top (firefox)</summary>

- 주소: https://zsupplyclothing.com/products/arlet-stripe-thermal-top
- 가격 $54 · 통화 USD · 코드 ZT263412S
- 컬러 ffffff · 컬러 전부 Eclipse, Velvet Green
- 사이즈 X Small, Small, Medium, Large, X Large · 재고 X Small, Small, Medium, Large, X Large
- 혼용률 — · 사진 18장
- 설명: The best basics are the ones that never stay folded for long. Soft waffle thermal knit and yarn-dyed stripes give this fitted long sleeve an easy, lived-in feel
- 디테일: —
- 페이지의 칸 제목: details · size & fit

</details>

<details><summary><b>Zara</b> — LONG-SLEEVE INTERLOCK T-SHIRT (firefox)</summary>

- 주소: https://www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=616513999
- 가격 $29.9 · 통화 USD · 코드 04174639
- 컬러 Ecru · 컬러 전부 Ecru, Navy blue, Green, Black
- 사이즈 S, M, L, XL · 재고 S, M, L, XL
- 혼용률 Cotton 100% · 사진 10장
- 설명: REGULAR FIT - CREW NECK - REGULAR LENGTH - LONG SLEEVES T-shirt made from flexible stretch knit fabric with a compact, plush, opaque construction. Crew neck and
- 디테일: Check in-store availability · Due to the holiday season, orders placed from the 15th of November can be returned until 30th of December. · : 100% cotton · OUTER SHELL · 100% cotton · Machine wash max. 30ºC/86ºF delicate cycle
- 페이지의 칸 제목: description · composition · overview · care

</details>

