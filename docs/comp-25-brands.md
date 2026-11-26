# 혼용률·컬러가 덜 찬 25개 브랜드 — 원인과 고친 것 (2026-11-26)

> 모든 측정은 **읽기만** 한 실행이다. Worker 에는 아무것도 쓰지 않았다(로그 증거는 맨 아래).
> 숫자 옆 표시: **[측정]** = 실행이 실제로 센 값 · **[추정]** = 측정 표본에서 미루어 본 값.

## 한눈에

| 브랜드 | 지금 혼용률 (야간 45773556142 뒤) [측정] | 찾은 원인 | 고친 것 | 고친 뒤 기대 | 근거 실행 |
|---|---|---|---|---|---|
| Gap | 333/481 (69%) | 빈 칸 147개는 평 fetch·impit 판에 'Fabric & care' 글이 없다(자바스크립트로 그림). 파이어폭스 판에는 있다 | 파이어폭스 차선(하루 80) · 'Fabric & care' 소재 제목 · 120자 떨어진 퍼센트 끊기 | fetch 측정 +0 [측정] · 파이어폭스 15/15 · 새 창 15/15 [측정, 두 러너] → 이틀이면 거의 100% [추정] | 45780157872 · 45779391924 · 45783035240 · 45783083400 · 45792904221 |
| Old Navy | 664/684 (97%) | 남은 20개도 읽힌다 — 야간이 한 번 돈 것뿐 | (규칙 판으로 다시 읽음) | 679/684 (99%) [측정] | 45779391924 · 45783035240 |
| Athleta | 277/407 (68%) | 빈 칸 130개는 impit 판이 글 2,043자 껍데기 | 파이어폭스 차선(하루 80) | fetch 측정 +0 [측정] · 파이어폭스 15/15 · 새 창 15/15 [측정, 두 러너] → 이틀이면 거의 100% [추정] | 45780157872 · 45783035240 · 45783083400 · 45792904221 |
| Banana Republic | 362/510 (71%) | 'viscose rayon' · 'ECOVERO™ (viscose rayon)' · 'elastane spandex' 표기 + 자바스크립트 판 | 같은 섬유 다른 이름 꼬리 규칙 · 파이어폭스 차선(하루 80) | fetch 측정 +65 → 84% [측정] · 나머지는 파이어폭스 15/15 [측정] | 45780157872 · 45783035240 · 45783083400 · 45792904221 |
| Reformation | 97/800 (12%) | 평 fetch·impit 403 · 파이어폭스 한 창은 0/15, 상품마다 새 창은 6/15 | 파이어폭스 차선(새 창, 하루 120) | 하룻밤 +40~50 [추정 — 6/15 비율] | 45776242765 · 45778478149 · 45778482116 |
| Sessun | 240/290 (83%) | 카탈로그 47개가 상품 주소가 아니라 그림 주소(…webp 924w) · 79개가 다른 사이트 주소 | 없음(목록 수집 쪽) | 242/290 [측정] | 45776242765 · 45783035240 |
| Vanessa bruno | 174/193 (90%) | 남은 것은 가방·목록 페이지가 상품으로 저장됨 · 사라진 상품 · 'Secondary/tertiary fabric' 세 줄 | 배색·자수·레이스 줄 빼기 | 176/193 (91%) [측정] | 45776242765 · 45783035240 |
| Bash | 295/301 (98%) | METALLIZED FIBER · ELASTOMULTIESTER · 프랑스어 페이지 | 섬유 이름 더함 | 300/301 (100%) [측정] | 45776242765 · 45783035240 |
| Whitestuff | 혼용률 594/665 (89%) · 컬러 0/665 | 컬러를 제목에만 적음("… in TEAL PRINT \| White Stuff") | 제목 컬러 · 컬러 규칙 판 | 컬러 306/665 이상 [측정 — 저장했다면 +350] · 혼용률 그대로 | 45783035240 |
| The upside | 322/429 (75%) · 컬러 0% | impit 403 이 러너에 따라 갈림(45779391924 러너는 impit 397쪽 읽음 → +79) · 파이어폭스 한 창 0/15, 새 창 6/15 · 컬러는 제목에만 | 파이어폭스 차선(새 창) · 제목 컬러 | impit 이 읽히는 밤 93% [측정 45779391924] · 아니면 하룻밤 +40~50 [추정] | 45776242765 · 45779391924 · 45778478149 · 45778482116 |
| Carlhartt | 110/148 (74%) | 퍼센트를 안 적음("6.8-ounce waffle knit fabric", "cotton/poly jersey") · 카탈로그에 목록 주소(/c/insulated-boots) | 없음 | 그대로 [측정] | 45776242765 · 45783035240 |
| Zara | 108/499 (22%) | 평 fetch·impit 은 Akamai 빈 화면(106/106) · 순위로만 고르던 크롬 보강에 차례가 안 옴 | 파이어폭스 차선(하루 120) | 파이어폭스 15/15 · 15/15 [측정, 두 러너] → 나흘이면 391개 대부분 [추정] | 45776242765 · 45778478149 · 45778482116 |
| Massimo Dutti | 5/606 (1%) | Akamai · 옛 미표기 390개를 크롬 보강 순위가 '채운 것'으로 셈 | 파이어폭스 차선(새 창, 하루 120) | 파이어폭스 7/15 · 새 창 11/15 [측정] → 하룻밤 +70~90 [추정] | 45776247588 · 45778478149 · 45778482116 |
| Garnet hill | 2/108 (2%) | 카탈로그에 기획전·선물 목록 주소와 bbb.org · 상품도 퍼센트를 거의 안 적음("Organic pima cotton/TENCEL™ Modal/spandex") | 없음 | 파이어폭스 0/15 · 1/15 [측정] | 45776247588 · 45778478149 · 45778482116 |
| Chico's | 80/800 (10%) | 403 이 러너 IP 에 따라 갈림 | 파이어폭스 차선(새 창, 하루 60) | fetch 측정 +24 [측정 45779391924] · 파이어폭스 1/15 · 3/15 [측정] | 45776247588 · 45779391924 · 45778478149 · 45778482116 |
| WHBM | 75/219 (34%) | 같은 이유(러너 IP) | 파이어폭스 차선(새 창, 하루 60) | fetch 측정 +25 → 46% [측정 45779391924] · 파이어폭스 0/15 두 번(이 러너들) · 현장 측정 3/3 | 45776247588 · 45779391924 · 45778478149 · 45778482116 |
| Buck Mason | 111/118 (94%) | 남은 7개는 'Fabric: Slubby Linen' 처럼 퍼센트 없음 | 없음 | 그대로 [측정] | 45776247588 · 45783035240 |
| Dickies | 148/264 (56%) | 줄임말 "77%Poly 20%Rayon 3%Spandex" · "55%CTN 34%POLY 8%NYLON 3%SPAN" | 줄임말 규칙 | 259/264 (98%) [측정] | 45776247588 · 45783035240 |
| Wilson | 29/51 (57%) | 사이트가 첫 섬유만 적음("Composition 46% Cotton") · 카탈로그에 할인 모음 주소 | 없음 | 그대로 [측정] | 45776247588 · 45783035240 |
| Everlane | 332/443 (75%) | 빈 상품 페이지에 Materials 칸이 없음(평 fetch 111쪽 · 파이어폭스 15쪽 모두) · 조각 줄 때문에 두 줄로 틀린 값 | 조각 되풀이 줄 빼기 | 335/443 (76%) [측정] | 45776247588 · 45783035240 · 45783083400 |
| Mint velvet | 319/416 (77%) | ',lining,' 으로 이어진 목록 · 평 fetch 판은 소재가 테마 JSON 에만(두 줄이라 버림) · metallised fibre | 부위 이름 끊기 · JSON 두 줄 받기 · 섬유 이름 | 404/416 (97%) [측정] · 파이어폭스 15/15 [측정] | 45776247588 · 45783035240 · 45783083400 |
| Poetry | 240/303 (79%) | 'TENCEL™ lyocell' · 'yak' · 카탈로그에 목록 주소 3개 | 상표 뒤 일반 이름 · 섬유 이름 | 295/303 (97%) [측정] | 45776247588 · 45783035240 |
| Spanx | 99/120 (83%) | 평 fetch 판·Shopify JSON 에 소재 없음 · 크롬 보강 파이어폭스는 14/15 미표기(새 창은 11/15 미표기 · 4/15 채움, 45792904221) · 현장 측정 파이어폭스(칸을 눌러 펼침)는 3/3 읽음 · 'Tencel™ Modal' 을 Lyocell 로 읽던 틀림 | Tencel™ Modal 규칙(틀린 값 방지) · impit 다시 읽기 | 그대로 [측정] — 남음(아래) | 45776247588 · 45783035240 · 45783083400 |
| J crew | 61/202 (30%) | impit 판에 상세가 없음(카탈로그 이름이 상품 코드라 '읽음'으로 셈) | 파이어폭스 차선(하루 120) | 파이어폭스 15/15 · 15/15 [측정] → 이틀이면 거의 다 [추정] | 45776247588 · 45779388161 · 45778478149 · 45778482116 |
| Coldwatercreek | 71/200 (36%) | 'Fabric & Care Cotton/spandex' — 퍼센트를 안 적음. 미표기 118/120 은 맞다 | 없음 | 그대로 [측정 — 129쪽 읽고 +0] | 45776247588 · 45783035240 |

- '지금'은 11/26 16:12 KST 에 끝난 야간 보강(45773556142, 운영)이 저장한 값이다. 그 실행이 어제 처음 저장된 Gap·Old Navy·Athleta·Banana Republic·
  Sessun·Vanessa bruno·Bash·Whitestuff 카탈로그를 처음으로 돌았다 — 이 8개 브랜드의 '0~73%' 는 **야간 보강이 아직 안 돌아서**였다 [측정].
- '고친 뒤 기대'의 측정 값은 측정 실행(dry=1, 창 무시 retry_all=1)이 '저장했다면' 센 값이다. 측정 실행은 Worker 우회를 끄고 한 사이트 요청을
  2초 간격으로만 보내서 야간보다 조금 적게 센다.

## 우리 쪽에서 고친 것

### 1. 추출 규칙 (worker/fabric-extractor.js — 혼용률 구간)

| 규칙 | 본 곳(실제 페이지 글) | 시험 |
|---|---|---|
| 줄임말 Poly·CTN·Span — 퍼센트 바로 뒤, 수식어 없이만 | Dickies "77%Poly 20%Rayon 3%Spandex" · "55%CTN 34%POLY 8%NYLON 3%SPAN" · Nation LTD "2% Span" | test-comp-rules · detail-pages 2쪽 |
| 상표 뒤 일반 이름이 섬유 | Spanx "44% Tencel™ Modal"(예전엔 Lyocell 로 틀림) · Poetry "79% TENCEL™ lyocell 21% virgin wool" · Marine Layer "47% TENCEL™ Modal" | test-comp-rules · detail-pages 2쪽 |
| 같은 섬유의 다른 이름 꼬리 | Banana Republic "84% viscose rayon, 15% LENZING™ ECOVERO™ (viscose rayon), 1% elastane spandex" | test-comp-rules · detail-pages 1쪽 |
| 목록 안의 부위 이름에서 끊기 | Mint Velvet "Composition: Main, 41% polyamide, 59% viscose,lining, 3% elastane, 97% polyester" | test-comp-rules · detail-pages 1쪽 |
| 페이지 JSON 의 "Composition: Main, …" 두 줄 | Mint Velvet 평 fetch 판(소재가 테마 설정 JSON 에만) | test-comp-rules |
| 겉감 이름이 없어도 장식·배색 줄 빼기 (secondary·tertiary fabric · embroidery · lace) | Vanessa Bruno "100% viscose. Secondary fabric 100% cotton. Embroidery 100% polyester" | test-comp-rules · detail-pages 1쪽 |
| 다른 줄의 조각을 되풀이한 줄 빼기 | Everlane "Materials: 97% Organic Cotton 3% Elastane … made with 97% organic cotton"(예전엔 두 줄로 틀림) | test-comp-rules · detail-pages 1쪽 |
| 120자 넘게 떨어진 퍼센트는 다른 글 · 'Fabric & care' 는 소재 제목 | Gap "Made with 14% recycled polyester" … "Fabric & care 86% Cotton, 14% Recycled Polyester" … 추천 카드 "100% Cotton Track Sweater Pants" | test-comp-rules · detail-pages 1쪽 |
| 하이픈에 붙은 'body' 는 겉감 이름이 아님 | Spanx 깨진 클래스 글 "--body-leading" | test-comp-rules · detail-pages 1쪽 |
| 새 섬유 이름: metallised/metallized fibre · elastomultiester · yak · 프랑스어(laine·coton·soie·cachemire·élasthanne) | Mint Velvet · ba&sh · Poetry · ba&sh 프랑스어 페이지 | test-comp-rules · detail-pages 4쪽 |
| 비워 두는 것(그대로) | Wilson 'Composition 46% Cotton'(사이트가 첫 섬유만) · Coldwater Creek 'Cotton/spandex'(퍼센트 없음) | detail-pages 2쪽 |

- 기대값은 모두 시험 자료 HTML 을 사람이 읽고 적었다(`scripts/fixtures/detail-pages/expected.json` 의 why 칸에 그 글을 옮겨 둠).
- 지금 있는 시험 자료 277쪽 전부를 고치기 전·후 규칙으로 견줬다: 바뀐 쪽은 위 페이지들뿐이고, 예전 값이 바뀐 곳은 모두 예전이 틀렸던 곳이다
  (Spanx·Marine Layer Lyocell→Modal, Everlane 조각 줄, Nation LTD Elastane 2% 빠짐) [측정 — 로컬, 시험 자료].
- `scripts/comp-guard.mjs`(브랜드 전체에 되풀이되는 장식·메뉴 글 보류)는 그대로 통과한다.
- **확장(chrome-extension/background.js)에는 이 규칙이 아직 없다** — 이 작업 범위 밖이라 손대지 않았다(아래 '담당자 확인').

### 2. 야간 보강이 다시 읽는 규칙 (scripts/enrich-comp.mjs)

- **규칙 판(rv)**: 읽었는데 혼용률이 비었던 상품은 5일 창 동안 다시 안 열었다. 규칙을 고쳐도 닷새 동안 닿지 않았고, 창을 무시하는 새벽 회차는
  다른 실행에 밀려 취소되면 빠졌다(11/26 새벽 회차 45745945625 취소됨 [측정]). 이제 상품마다 규칙 판을 남기고, 판이 바뀌면 한 번 더 연다.
- **컬러 규칙 판(cv)**: 컬러가 절반도 안 찬 브랜드에서만 같은 규칙(컬러는 2순위).
- **평 fetch 판에 혼용률이 없으면 impit 으로 한 번 더**: 같은 주소에 다른 판을 주는 사이트(Spanx·Everlane·Mint Velvet 형). 상품 주소당 요청 2번.
- **429 를 받으면 그 사이트는 그 실행에서 멈춤**, 그 뒤 상품은 시도 기록 없이 남김.
- **2차 바퀴도 95분이 지나면 새로 열지 않음** — 리포트·검색 인덱스를 못 쓰고 끝나는 일을 막는다.
- **제목 컬러**: "<상품명> in <컬러> | 브랜드" 에서 컬러(주소 마디에 그 낱말이 있을 때만) — White Stuff·The Upside 컬러 0% 의 원인 [측정].

### 3. 파이어폭스 차선 (enrich-firefox-brands.json · scripts/enrich-comp-browser.mjs)

크롬 보강은 혼용률이 가장 빈 6개 브랜드만 골라서, 0~5% 브랜드가 매일 자리를 다 차지했다. 파이어폭스로만 열리는 Zara(22%)·Reformation·The Upside·
J.Crew·Massimo Dutti(옛 미표기 390개가 '채운 것'처럼 세져 77% 로 보였다)·Gap 계열은 차례가 오지 않았다. 이 브랜드들을 순위와 따로 매일 맨 앞에 돈다.

| 브랜드 | 하루 | 새 창 | 근거 [측정] |
|---|---:|:-:|---|
| Zara | 120 | | 파이어폭스 15/15 · 새 창 15/15 |
| J crew | 120 | | 15/15 · 15/15 |
| Massimo Dutti | 120 | ✅ | 한 창 7/15 · 새 창 11/15 |
| Reformation | 120 | ✅ | 한 창 0/15(14 차단) · 새 창 6/15 |
| The upside | 120 | ✅ | 한 창 0/15(14 차단) · 새 창 6/15 |
| WHBM | 60 | ✅ | 현장 측정 3/3 · 측정 실행 0/15 두 번(러너 IP) |
| Chico's | 60 | ✅ | 1/15 · 3/15(러너 IP) |
| Gap · Athleta · Banana Republic | 80씩 | | 15/15씩 · 새 창 15/15씩(두 러너) |

- 하룻밤 상한: 차선 1,080개 + 순위 6개 × 120. 크롬 보강은 시작 뒤 65분에 새 상품을 멈춘다 — 시간이 모자라면 순위 브랜드가 덜 돈다 [추정 — 11/26 크롬 보강은 618개에 약 20분].
- 파이어폭스로 연달아 막히면(90% 이상, 두 번) 그 브랜드는 14일 쉰다(처음엔 2일) — 예전 규칙 그대로.

## 우리 쪽으로는 안 되는 것

- **사이트가 퍼센트를 안 적음**: Coldwater Creek('Cotton/spandex'), Carhartt('6.8-ounce waffle knit fabric'), Buck Mason('Fabric: Slubby Linen'),
  Garnet hill('Organic pima cotton/TENCEL™ Modal/spandex'), Everlane 빈 칸 상품(Materials 칸 없음). 미표기로 두는 것이 맞다.
- **사이트가 첫 섬유만 적음**: Wilson('Composition 46% Cotton'). 절반 값은 저장하지 않는다(옳은 값이 아님).
- **카탈로그에 상품이 아닌 주소**: Sessun 그림 주소 47개 · 다른 사이트 79개, Garnet hill 기획전·bbb.org, Wilson 할인 모음, Poetry·Carhartt·Vanessa bruno 목록·가방 페이지,
  J.Crew '/m/…/MQ341' 같은 세트 페이지. 목록 수집(서버 저장소·browser-collect) 쪽 일이라 손대지 않았다.
- **러너 IP 로 갈리는 차단**: Chico's·WHBM·The Upside 는 같은 날도 러너마다 열리고 막힌다(45779391924 러너는 열림, 45778478149 러너는 막힘). 차선과 impit 이 열리는 밤에 채운다.
- **Spanx 21개**: 평 fetch·Shopify JSON·크롬 보강 파이어폭스 어디에도 소재가 없고, 현장 측정의 파이어폭스(Details 칸을 눌러 펼치고 기다림)에서만 보였다.
  크롬 보강의 펼치기·기다리기를 Spanx 에 맞추는 일은 이번에 하지 않았다(다음 일).

## 담당자가 볼 것

- **운영 반영**: 이 브랜치(claude/dv-visibility-cross-device-igprlf)의 변경은 main 에 합쳐야 야간에 돈다. 합친 첫 밤에는 규칙 판(rv)이 바뀌어
  '읽었는데 비었던' 상품을 한 번씩 다시 읽는다 — 보통 밤보다 길어질 수 있다(2차 바퀴는 95분에 멈춰 다음 밤으로 넘긴다).
- **Worker 배포**: 추출 규칙은 worker/fabric-extractor.js 에 있어 야간 보강(GitHub Actions)은 바로 쓰지만, Worker 의 ?comp 우회 경로는 Worker 를 다시
  배포해야 새 규칙을 쓴다(deploy-worker.yml).
- **확장(chrome-extension/background.js)**: 혼용률 규칙 복사본이 있어 이번 규칙(줄임말·상표 뒤 일반 이름·부위 끊기 등)이 확장에는 없다. 확장 담당이
  옮겨야 한다(test-composition.mjs 는 두 구현이 같은 것만 본다 — 새 규칙은 test-comp-rules.mjs).
- **이미 저장된 틀린 값**: 'TENCEL™ Modal' 을 Lyocell 로 읽은 값(Spanx·Marine Layer 형)과 Everlane 조각 줄('… ‖ Cotton 97%')은 지금 페이지 값이 이미 있으면
  덮지 않는 규칙(applyLiveComp '유지') 때문에 저절로 고쳐지지 않는다. 고치려면 혼용률 정리(diagnose-page mode=clean → clean-apply, 승인 필요)를 돌려야 한다.
- **rouje**: 이 작업 범위 밖이지만, 시험 자료(scripts/fixtures/pages/rouje.html.gz)에 'Composition : Tissu principal : 93 % coton, 7 % élasthanne' 가 있다 —
  '사이트가 안 적음'이 아니라 프랑스어라 못 읽었던 것으로 보인다 [측정 — 시험 자료 한 쪽]. 이번 프랑스어 규칙으로 읽힌다.
- **카탈로그 주소**: Sessun 그림 주소 47개 · Garnet hill 목록 주소 · Wilson 할인 모음 — 목록 수집 담당 확인.

## 사람이 열어 확인할 표본 (브랜드마다 3개 — 값 · 그 값이 나온 페이지 글)

**Dickies (줄임말 규칙)** — 측정 45783035240 표본 · 시험 자료

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://www.dickies.com/products/dk-balance-v-neck-top-dk875-roy | Polyester 77% / Viscose 20% / Elastane 3% | Fabric Composition: 77%Poly 20%Rayon 3%Spandex |
| https://www.dickies.com/products/dk-forge-womens-jumpsuit-dk525-blkn | Cotton 55% / Polyester 34% / Nylon 8% / Elastane 3% | Fabric Composition: 55%CTN 34%POLY 8%NYLON 3%SPAN |
| https://www.dickies.com/products/dk-eds-essentials-mock-wrap-top-dk625-baps | Polyester 95% / Elastane 5% | Fabric Composition: 95%Poly 5%Spandex |

**Mint Velvet (부위 끊기 · JSON 두 줄 · metallised fibre)** — 측정 45783035240 표본 · 시험 자료

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://mintvelvet.com/products/black-knit-sheer-sleeve-zip-detail-top | Nylon 52% / Viscose 48% ‖ Lyocell 84% / Polyester 16% | "content": " Composition: Main, 52% polyamide, 48% viscose,main 2, 84% lyocell, 16% polyester " |
| https://mintvelvet.com/products/black-velvet-spotted-ruffle-maxi-dress | Nylon 41% / Viscose 59% ‖ Elastane 3% / Polyester 97% | Composition: Main, 41% polyamide, 59% viscose,lining, 3% elastane, 97% polyester |
| https://mintvelvet.com/products/gold-balloon-trousers | Metallic 31% / Viscose 69% | Composition: Main, 31% metallised fibre, 69% viscose |

**Poetry (TENCEL™ lyocell · yak)** — 측정 45783035240 표본 · 시험 자료

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://www.poetryfashion.co.uk/shirts-and-tunics/lyocell-cotton-wool-frill-blouse-ocean-blue/RW14.A.html | Lyocell 41% / Cotton 40% / Wool 19% | 41% TENCEL™ lyocell 40% cotton 19% wool |
| https://www.poetryfashion.co.uk/sale/italian-lyocell-wool-tailored-trousers-ink/RJ23.B.html | Lyocell 79% / Wool 21% | <span class="b-pdp_composition"> 79% TENCEL™ lyocell 21% virgin wool </span> |
| https://www.poetryfashion.co.uk/dresses-and-skirts/cotton-cord-pull-on-skirt-dark-chocolate/RL36.C.html | Hemp 50% / Cotton 44% / Yak 6% | <span class="b-pdp_composition"> 50% hemp 44% organic cotton 6% yak </span> |

**Banana Republic (같은 섬유 다른 이름 꼬리)** — 측정 45780157872 시험 자료 · 45783035240 · 45783083400

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://bananarepublic.gap.com/browse/product.do?pid=1203518002 | Viscose 99% / Elastane 1% | Fabric & care 84% viscose rayon, 15% LENZING™ ECOVERO™ (viscose rayon), 1% elastane spandex. |
| https://bananarepublic.gap.com/browse/product.do?pid=1199181002 | Viscose 99% / Elastane 1% | Fabric & care 84% viscose rayon, 15% LENZING™ ECOVERO™ (viscose rayon), 1% elastane spandex. Dry clean. |
| https://bananarepublic.gap.com/browse/product.do?pid=539384002 | Wool 98% / Elastane 2% | "label":"Fabric & care",…"bullets":["98% Responsible Wool Standard wool, 2% elastane." (측정 45779391924 표본) |

**Gap ('Fabric & care' 제목 · 떨어진 퍼센트)** — 측정 45780157872 시험 자료 · 45783083400

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://www.gap.com/browse/product.do?pid=856413002 | Cotton 86% / Polyester 14% | Made with 14% recycled polyester. … Fabric & care 86% Cotton, 14% Recycled Polyester. (추천 카드 '100% Cotton Track Sweater Pants' 는 빼고) |
| https://www.gap.com/browse/product.do?pid=1180261062 | Cotton 77% / Polyester 23% | Fabric & care 77% Cotton, 23% Recycled Polyester. Machine wash cold |
| https://www.gap.com/browse/product.do?pid=817099012 | Cotton 86% / Polyester 14% | Fabric & care Cotton 86%, Recycled Polyester 14% Machine wash. Imported. |

**ba&sh (섬유 이름 · 프랑스어)** — 측정 45783035240 표본

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://ba-sh.com/fr/en/p/top-zaria-dore-3667436071300.html | Viscose 62% / Metallic 38% | Material: 62% VISCOSE / 38% METALLIZED FIBER |
| https://ba-sh.com/fr/en/p/pants-faimi-blackstone-3667436126895.html | Cotton 92% / Elastomultiester 6% / Elastane 2% | Material: 92% COTTON / 6% ELASTOMULTIESTER / 2% ELASTANE |
| https://ba-sh.com/fr/fr/p/legging-slalom-noir-3667436131509.html | Wool 85% / Nylon 14% / Elastane 1% | Composition: 85% LAINE / 14% POLYAMIDE / 1% ELASTHANNE |

**Vanessa Bruno (배색·자수·레이스 빼기)** — 측정 45783035240 표본

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://www.vanessabruno.com/p/haldo-embroidered-blouse-54343.html | Viscose 100% | Composition : 100% viscose. Secondary fabric 100% cotton. Embroidery 100% polyester |
| https://www.vanessabruno.com/p/hora-blouse-53937.html | Cotton 100% | Composition : 100% cotton / tertiary fabric 62% cotton, 38% polyester / embroidery 100% polyester / lace 62% cotton, 38% polyester |
| (셋째 표본 없음 — 남은 빈 칸은 가방·목록 페이지) |  |  |

**Everlane (조각 줄 빼기)** — 측정 45783035240 표본

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://www.everlane.com/products/womens-utility-cigarette-pant-black | Cotton 97% / Elastane 3% | Materials: 97% Organic Cotton 3% Elastane Why It's Better This style is made with 97% organic cotton |
| https://www.everlane.com/products/womens-utility-cigarette-pant-olive-night | Cotton 97% / Elastane 3% | (같은 글) |
| https://www.everlane.com/products/womens-utility-cigarette-pant-bone | Cotton 97% / Elastane 3% | (같은 글 — 예전 규칙은 'Cotton 97% / Elastane 3% ‖ Cotton 97%') |

**Spanx (Tencel™ Modal — 틀린 값 막기)** — 현장 측정 45776247588 시험 자료

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://spanx.com/products/spanx-airessentials-collared-tie-waist-jumpsuit | Polyester 49% / Modal 44% / Elastane 7% ‖ Modal 47% / Polyester 46% / Elastane 7% | Bodice: 49% Polyester, 44% Tencel™ Modal, 7% Elastane. Bottom: 47% Tencel™ Modal, 46% Polyester, 7% Elastane. |
| https://spanx.com/products/spanx-ponte-jacquard-tailored-vest | Viscose 53% / Nylon 44% / Elastane 3% ‖ Polyester 92% / Elastane 8% | Body: 53% Viscose, 44% Nylon, 3% Elastane. Lining: 92% Polyester, 8% Elastane. |
| https://spanx.com/products/spanxsupersmooth-perfectfit-ponte-slim-straight-pant | Viscose 68% / Nylon 28% / Elastane 4% ‖ Polyester 80% / Elastane 20% | Body: 68% Ecovero™ Viscose, 28% Nylon, 4% Elastane. Lining: 80% Polyester, 20% Elastane. |

**White Stuff · The Upside (제목 컬러)** — 현장 측정 45776242765 시험 자료

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://www.whitestuff.com/p/7379/nelly-cotton-notch-neck-t-shirt/TEAL_PR | 컬러 Teal Print | <title>NELLY COTTON NOTCH NECK T-SHIRT in TEAL PRINT / White Stuff</title> · 주소 /TEAL_PR |
| https://www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI | 컬러 Navy Multi | <title>KIM BUTTON THROUGH TEE in NAVY MULTI / White Stuff</title> |
| https://www.theupside.com/cosmic-wide-leg-shana-pant-washed-black-usw226028/ | 컬러 Washed Black | <title>COSMIC WIDE LEG SHANA PANT in WASHED BLACK / The UPSIDE</title> |

**파이어폭스 차선 브랜드 (추출 규칙은 그대로 — 고른 길만 바뀜)** — 현장 측정 45776242765·45776247588 시험 자료 · 측정 45778482116

| 상품 | 뽑은 값 | 페이지 글 |
|---|---|---|
| https://www.zara.com/us/en/striped-capri-pants-p06929504.html?v1=545470445 | Polyester 62% / Viscose 34% / Elastane 4% | "propertyID":"Composition","name":"OUTER SHELL","value":"62% polyester, 34% viscose, 4% elastane" |
| https://www.thereformation.com/products/elara-pant/1320293AKE.html | Nylon 100% | Material & care This is a deadstock woven fabric made from 100% Nylon. |
| https://www.massimodutti.com/us/100-ramie-flowing-pocket-shirt-l05184684 | Ramie 100% | "compositionDetail":{"parts":[{"description":"OUTER SHELL",…"components":[{"material":"ramie","percentage":"100%"}] |
| https://www.jcrew.com/p/womens/categories/clothing/pants/relaxed/petite-cosmo-pant-in-luster-charmeuse/CN714 | Viscose 100% | …charmeuse fabric that reflects the light… 100% viscose. Elastic waist. |
| https://www.theupside.com/rylan-hooded-anorak-chai-usw126092h/ | Nylon 100% | [care-instructions] 100% Nylon Cold machine wash |
| https://athleta.gap.com/browse/product.do?pid=845697032 | Nylon 78% / Polyester 19% / Elastane 3% | Fabric & care 78% Nylon/19% Polyester/3% spandex |

- 확인이 더 필요한 값: Massimo Dutti 측정 45778482116 에서 서로 다른 상품 셋(buttoned henley · lingerie-inspired tee · asymmetric flowing top)이 모두 'Lyocell 70% / Wool 30%' 였다.
  셋째의 값은 시험 자료 HTML 에서 그 상품의 것임을 확인했지만(compositionDetail), 앞의 둘은 HTML 을 남기지 않아 확인하지 못했다 — 페이지 JSON 에 다른 상품의 소재가 실렸을 수 있다 [추정].

## 읽기만 했다는 증거 (로그 줄)

- 현장 측정(diagnose-page mode=fields) 45776242765: `STORE: 0 — 현장 지도 측정은 읽기만 한다(Worker 에 GET 만).`
- 크롬 보강 측정(enrich-browser store=0) 45778482116: `STORE: 0 — 읽기만 한다(Worker 에 GET 만, 오버레이·상세·차단 이력 저장 안 함).`
- 야간 보강 측정(enrich-comp dry=1) 45779388161: `DRY=1 — 읽기만 한다. Worker 에 저장하지 않고 인덱스도 다시 만들지 않는다.`
