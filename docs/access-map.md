# 접근 지도 — 134개 브랜드, 우리 수집기가 어디까지 닿는가

만든 때 2026-11-25T10:17Z · 측정 실행 14회(GitHub Actions, 읽기만) · 기준 야간 리포트 2026-11-25(main)

이 문서는 `node scripts/build-access-map.mjs` 가 만든다. 같은 사실이 `access-map.json` 에 기계용으로 있다.
판정 근거는 세 가지뿐이다 — ① 11/25 야간 리포트(서버 프리페치·헤드리스 수집·카탈로그 점검·혼용률 보강),
② 오늘 새로 잰 측정(`try-engines-results-<실행>.json`, 실행 목록은 맨 아래), ③ 그 둘을 보고 사람이 적은 판정
(`access-measure/verdicts.json`). 오늘 재지 않고 추정한 것은 표에 **(추정)** 이라고 적었다.

## 1. 한눈에

### 목록(카테고리) 페이지 — 상품 목록을 가져오는 단계

| 상태 | 브랜드 | 상품(카탈로그) | 브랜드 이름 |
|---|---:|---:|---|
| ✅ 된다 | 83 | 23,415 | Addison bay, Aerie, ALC, Alo, American Eagle, Apiece Apart, Barbour, Bassike, Bellerose, Beyond yoga, Boden, Boldest, Buck Mason, CCC, Citizens of Humanity, Club monaco, Coldwatercreek, Cotton citizen, Cotton on, Damson Madder, Draper James, Eddie bauer, English factory, Evereve, Everlane, Faherty, Frame, Frank & Eileen, Gerard darel, Gestuz, Goldie, Greyson, Gymshark, Hobbs, J crew, J.jill, J.mclaughlin, Jager, Jigsaw, La Ligne, Leset, Lilla P, LNA, Marine Layer, Me+Em, Michael Stars, Mint velvet, Monrow, Ninety Percent, Nylora, Oak + Fort, Oasis, On, Outdoorvoices, Phase eight, Poetry, Project Social T, Rag & bone, Rails, rouje, Sanctuary, Scoth & soda, Shopbop, Spanx, Splendid, Splits59, Stateside, Sundry, Sweaty betty, The Great, Thread & supply, Tuckernuck, Ulla Johnson, Varley, Velvet, Veronica Beard, Vince, Vuori, Whistles, Wrap, Xirena, Z Supply, Zara |
| 🏠 집 IP(확장)에서만 | 27 | 8,982 | &Other Stories, Abercrombie & Fitch, Addidas, Ann Taylor, Anthropologie, Aritzia, Arket, Eileen fisher, Fatface, FP Movement, Free People, H&M, Joules, L.L bean, Lands end, Loft, Lululemon, Madewell, Mango, Massimo Dutti, Paige, Patagonia, Seasalt cornwall, Sezane, The white company, Theory, Wilson |
| 🟠 일부만 | 9 | 4,104 | Chico's, Garnet hill, James Perse, Nation LTD, Reformation, The upside, vineyardvines, WHBM, Whitestuff |
| ⛔ 어디서도 막힘 | 1 | 81 | Prana |
| 🔗 URL 이 틀림·죽음 | 2 | 786 | Good American, Lucky Brand |
| 🔧 열리는데 잘못 읽음 | 12 | 1,152 | Athleta, Banana Republic, Bash, Carlhartt, Dickies, Gap, Monsoon, Nike, Old Navy, Oysho, Sessun, Vanessa bruno |
| **합계** | **134** | **38,520** | |


### 상품 페이지 — 혼용률·컬러를 읽는 단계

| 상태 | 브랜드 | 상품(카탈로그) | 브랜드 이름 |
|---|---:|---:|---|
| ✅ 된다 | 91 | 26,866 | Addison bay, Aerie, ALC, Alo, American Eagle, Ann Taylor, Apiece Apart, Barbour, Bash, Bassike, Bellerose, Beyond yoga, Boden, Boldest, CCC, Citizens of Humanity, Club monaco, Cotton citizen, Cotton on, Damson Madder, Draper James, Eddie bauer, Eileen fisher, English factory, Evereve, Faherty, Frame, Frank & Eileen, Gerard darel, Gestuz, Goldie, Good American, Greyson, Gymshark, Hobbs, J.jill, J.mclaughlin, Jager, James Perse, Jigsaw, L.L bean, La Ligne, Lands end, Leset, Lilla P, LNA, Lucky Brand, Madewell, Marine Layer, Me+Em, Michael Stars, Monrow, Monsoon, Nation LTD, Nike, Ninety Percent, Nylora, Oak + Fort, Oasis, On, Outdoorvoices, Phase eight, Project Social T, Rag & bone, Rails, Sanctuary, Scoth & soda, Seasalt cornwall, Shopbop, Splendid, Splits59, Stateside, Sundry, Sweaty betty, The Great, Theory, Thread & supply, Tuckernuck, Ulla Johnson, Vanessa bruno, Varley, Velvet, Veronica Beard, Vince, vineyardvines, Vuori, Whistles, Wrap, Xirena, Z Supply, Zara |
| 🏠 집 IP(확장)에서만 | 5 | 1,510 | &Other Stories, Abercrombie & Fitch, Aritzia, Mango, Paige |
| 🟠 일부만 | 20 | 6,360 | Arket, Buck Mason, Chico's, Coldwatercreek, Dickies, Everlane, Free People, Garnet hill, J crew, Joules, Loft, Mint velvet, Patagonia, Poetry, Reformation, Spanx, The upside, WHBM, Whitestuff, Wilson |
| ⛔ 어디서도 막힘 | 9 | 2,685 | Addidas, Anthropologie, Fatface, FP Movement, H&M, Lululemon, Prana, Sezane, The white company |
| 🔧 열리는데 잘못 읽음 | 8 | 867 | Athleta, Banana Republic, Carlhartt, Gap, Massimo Dutti, Old Navy, Oysho, Sessun |
| 📭 사이트가 혼용률을 안 적음 | 1 | 232 | rouje |
| **합계** | **134** | **38,520** | |


엑셀 혼용률 칸: 지금 28,312/38,520개가 채워져 있고 **10,208개가 비어 있다**(11/25 03:39 카탈로그 점검 기준).

핵심 다섯 가지:

1. **진짜로 막힌 곳은 생각보다 적다.** 데이터센터(Render·GitHub)에서 우리 무료 엔진이 하나도 못 여는 브랜드는 목록 기준 18개
   (Akamai 가 막는 9 · DataDome 4 · Vercel 2 · Cloudflare 1(Prana) · 불명 1(A&F) · 가짜 점검 화면 1(Patagonia)). 이 중 15개는
   이미 집 PC 확장이 목록을 매일 받아 온다. 나머지 셋(Chico's·WHBM·Prana)은 서버 담당이라 목록이 며칠~두 달째 그대로다.
2. **확장 담당 33개 중 18개는 집 IP 가 필요 없다.** 막혔던 건 '헤드리스 크롬'이라는 한 가지 길뿐이었다. 같은 페이지를
   브라우저 없는 fetch(impit — 크롬의 TLS 지문을 흉내) 나 파이어폭스로 열면 열린다: H&M·Arket·&Other Stories·L.L bean·Ann Taylor·
   Loft·Seasalt cornwall·Wilson·Madewell·Massimo Dutti·Oysho·Garnet hill 12개는 오늘 2회(서로 다른 러너) 측정에서 상품이 보였다(Garnet hill 은 새 창으로 1회). Gap 계열 4개
   (Gap·Old Navy·Athleta·Banana Republic)는 막힌 게 아니라 집 IP 에서도 상품을 1~7개만 읽는 '읽기' 문제다. 나머지 둘은 추정:
   Aritzia(서버에 이미 있는 Aritzia 검색 API 경로) · The White Company(영국 지역으로 열기).
3. **'첫 페이지만 열리던' 곳은 새 창으로 풀린다.** The upside·Reformation(Cloudflare)·Garnet hill·Massimo Dutti(Akamai)는 파이어폭스
   한 창으로 카테고리를 이어 열면 두 번째부터 403 이었는데, 카테고리마다 쿠키 없는 새 창으로 열면 전부 열렸다(헤드리스 수집기에 이미 있는
   `FRESH_CONTEXT=1` 설정). 첫 방문 뒤 받은 봇 판정 쿠키가 다음 요청을 막는 것으로 보인다. Prana 는 새 창으로도 막혔다. 새 창 측정은 1회다.
4. **혼용률 빈칸의 큰 덩어리는 접근 문제가 아니다.** Buck Mason·Dickies·Everlane·Mint velvet·Spanx·Whitestuff·Wilson·Poetry·J crew 는
   오늘 무료 엔진으로 표본 전부를 읽었다 — 야간 보강이 아직 못 돌았거나(대상·상한·5일 재시도 제한), 보강의 fetch 가 TLS 지문
   때문에 막히는 것(Whitestuff 76개 '직접차단'인데 impit 은 3/3)이다. 무료로 고친다.
5. **유료 서비스가 필요한 몫은 상품 페이지에 몰려 있다.** 상품 페이지가 데이터센터에서 모든 무료 엔진(웹 아카이브 포함)으로
   막힌 브랜드는 11개, 혼용률 빈칸 약 3,600개 — H&M(744)·Chico's(800)·Lululemon(476)·Fatface(374)·adidas(408)·Anthropologie(270)·
   Sezane(206)·The White Company(68, 지역)·Garnet hill·FP Movement·Prana. 이 중 확장 담당 브랜드는 확장의 탭 보강이 지금 0~10% 라
   집 IP 로 되는지부터 확인하고, 안 되면 유료다. 유료 서비스는 **Akamai 를 통과하는지**가 가장 중요하다(이 11개 중 6개가 Akamai).
   무료로 못 연 주소만 모은 시험 대상(`access-measure/targets-blocked.json`)이 준비돼 있다 — §6.


상태 이름 뜻:

- ✅ 된다 — 지금 쓰는 길(서버·헤드리스·확장)로 매일 채워진다.
- 🏠 집 IP(확장)에서만 — 데이터센터(Render·GitHub)에서는 막히거나 못 읽고, 담당자 PC 의 크롬 확장만 된다. 확장을 매일 돌려야 유지된다.
- 🟠 일부만 — 카테고리 일부만, 또는 날마다(러너마다) 되다 말다 한다.
- ⛔ 어디서도 막힘 — 우리가 가진 길이 모두 막혔다.
- 🔗 URL 이 틀림·죽음 — 사이트가 아니라 담당자가 준 주소가 문제.
- 🔧 열리는데 잘못 읽음 — 접근은 되는데 우리 수집기가 상품을 못 고르거나 엉뚱한 것을 고른다.
- 📭 사이트가 혼용률을 안 적음(상품 페이지만).

고치는 단계: **0** 이미 정상 → **1** 무료로 우리 쪽에서(엔진 바꾸기·사이트 JSON·선택자·웹 아카이브) → **2** 집 IP 가 필요(확장) → **3** 유료 차단 해제 서비스 → **4** 담당자가 새 URL 을 줘야 함.

## 2. 무엇이 막는가 — 차단 주체

"403" 은 증상일 뿐이다. 차단 업체는 응답에 흔적을 남긴다 — 쿠키 이름(`_abck`·`bm_sz` = Akamai, `datadome` = DataDome,
`__cf_bm` = Cloudflare, `_px*` = HUMAN/PerimeterX), 응답 헤더(`server: AkamaiGHost`·`akamai-grn`, `cf-mitigated: challenge`,
`x-datadome: protected`, `x-vercel-id`), 차단 화면의 제목과 문구(“Access Denied … Reference #”, “Just a moment…”,
“Attention Required! | Cloudflare”, “Please enable JS and disable any ad blocker” + captcha-delivery.com,
“Access to this page has been denied” + px-cloud.net, “Vercel Security Checkpoint”), 그리고 페이지가 불러오는 확인 스크립트 주소.
아래 주체는 **그 흔적만으로** 정했다(브랜드 평판으로 짐작하지 않음). 근거 강도: **높음** = 차단 화면 자체에 그 업체 흔적 ·
**중간** = 차단 응답에 그 업체 쿠키·헤더만 · **낮음** = CDN 헤더만. 판정 규칙과 시험은 `scripts/access-evidence.mjs` ·
`scripts/test-access-evidence.mjs`.

| 차단 주체 | 근거 강도 | 브랜드 | 막힌 범위(엔진별 막힘/잰 횟수, 목록+상품) | 대표 근거(측정 원본) |
|---|---|---|---|---|
| Akamai | 높음 | &Other Stories | impit 6/22 · playwright 12/12 · firefox 6/12 · firefox-fresh 0/3 | HTTP 403 · 제목 "Access Denied" · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny |
| Akamai | 높음 | Addidas | impit 20/20 · playwright 8/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 403 · 제목 "adidas" · Akamai: x-akamai-* 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | Arket | impit 6/22 · playwright 12/12 · firefox 6/12 · firefox-fresh 0/3 | HTTP 403 · 제목 "Access Denied" · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny |
| Akamai | 높음 | Chico's | impit 29/29 · playwright 19/19 · firefox 16/19 · firefox-fresh 5/8 | HTTP 403 · 제목 "Access Denied" · Akamai: akamai-grn 헤더, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | Eileen fisher | impit 14/14 · playwright 6/6 · firefox 6/6 · firefox-fresh 3/3 | HTTP 403 · 제목 "Access Denied" · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny |
| Akamai | 높음 | Fatface | impit 20/20 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 403 · 제목 "Access Denied" · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | Garnet hill | impit 0/23 · playwright 15/15 · firefox 10/15 · firefox-fresh 0/6 | HTTP 403 · 제목 "Access Denied" · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny |
| Akamai | 높음 | H&M | impit 6/22 · playwright 12/12 · firefox 6/12 · firefox-fresh 0/3 | HTTP 403 · 제목 "Access Denied" · Akamai: akamai-grn 헤더, 화면 흔적 akamai-deny |
| Akamai | 높음 | Joules | impit 22/22 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 403 · 제목 "Access Denied" · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | Lands end | impit 22/22 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 403 · 제목 "Access Denied" · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | Lululemon | impit 22/22 · playwright 0/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 403 · 제목 "Access Denied" · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | Massimo Dutti | impit 22/22 · playwright 12/12 · firefox 0/12 · firefox-fresh 0/3 | HTTP 200 · 제목 "&nbsp;" · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge |
| Akamai | 높음 | Oysho | impit 16/16 · playwright 6/6 · firefox 0/6 · firefox-fresh 0/3 | HTTP 200 · 제목 "&nbsp;" · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge |
| Akamai | 높음 | Theory | impit 19/19 · playwright 9/9 · firefox 9/9 · firefox-fresh 3/3 | HTTP 403 · 제목 "Access Denied" · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | WHBM | impit 29/29 · playwright 19/19 · firefox 14/19 · firefox-fresh 5/8 | HTTP 403 · 제목 "Access Denied" · Akamai: server: AkamaiGHost, 쿠키 _abck, 쿠키 bm_s, 쿠키 bm_so, 쿠키 bm_sz |
| Akamai | 높음 | Zara | impit 18/18 · playwright 6/6 · firefox 0/6 | HTTP 200 · 제목 "&nbsp;" · Akamai: 쿠키 ak_bmsc, 화면 흔적 akamai-challenge |
| Cloudflare | 높음 | Alo | impit 11/11 · playwright 0/3 · firefox 0/3 | HTTP 403 · 제목 "Verifying your connection..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge |
| Cloudflare | 높음 | Aritzia | impit 27/27 · playwright 15/15 · firefox 10/15 · firefox-fresh 5/6 | HTTP 403 · 제목 "Just a moment..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge |
| Cloudflare | 높음 | Coldwatercreek | impit 13/13 · playwright 0/3 · firefox 0/3 | HTTP 403 · 제목 "Just a moment..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge |
| Cloudflare | 높음 | Dickies | impit 0/19 · playwright 0/9 · firefox 1/9 · firefox-fresh 0/3 | HTTP 403 · 제목 "Just a moment..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.dickies.com/cdn-cgi/challenge-platform/h/g/orc, 불러온 주소 challenges.cloudflare.com/turnstile/ |
| Cloudflare | 높음 | Good American | impit 0/16 · playwright 0/6 · firefox 1/6 · firefox-fresh 1/3 | HTTP 403 · 제목 "Just a moment..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.goodamerican.com/cdn-cgi/challenge-platform/h/, 불러온 주소 challenges.cloudflare.com/turnstile/ |
| Cloudflare | 높음 | L.L bean | impit 0/19 · playwright 9/9 · firefox 0/9 · firefox-fresh 0/3 | HTTP 403 · 제목 "Attention Required! / Cloudflare" · Cloudflare: cf-ray 헤더, 화면 흔적 cf-block |
| Cloudflare | 높음 | On | impit 4/10 · playwright 0/2 · firefox 0/2 | HTTP 200 · 제목 "" · Cloudflare: cf-ray 헤더, 화면 흔적 cf-challenge |
| Cloudflare | 높음 | Prana | impit 25/25 · playwright 14/17 · firefox 14/17 · firefox-fresh 7/7 | HTTP 403 · 제목 "Attention Required! / Cloudflare" · Cloudflare: cf-ray 헤더, 쿠키 __cf_bm, 화면 흔적 cf-challenge, 화면 흔적 cf-block |
| Cloudflare | 높음 | Reformation | impit 25/25 · playwright 0/15 · firefox 10/15 · firefox-fresh 0/6 | HTTP 403 · 제목 "Just a moment..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 쿠키 __cf_bm, 화면 흔적 cf-challenge |
| Cloudflare | 높음 | The upside | impit 25/25 · playwright 12/17 · firefox 11/17 · firefox-fresh 0/7 | HTTP 403 · 제목 "Just a moment..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge |
| Cloudflare | 높음 | Wilson | impit 0/21 · playwright 0/9 · firefox 1/9 · firefox-fresh 2/3 | HTTP 403 · 제목 "Just a moment..." · Cloudflare: cf-ray 헤더, cf-mitigated: challenge, 화면 흔적 cf-challenge, 불러온 주소 www.wilson.com/cdn-cgi/challenge-platform/h/b/orch, 불러온 주소 challenges.cloudflare.com/turnstile/ |
| DataDome | 높음 | Anthropologie | impit 25/25 · playwright 15/15 · firefox 13/15 · firefox-fresh 6/6 | HTTP 403 · 제목 "anthropologie.com" · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge |
| DataDome | 높음 | FP Movement | impit 14/15 · playwright 6/7 · firefox 6/7 · firefox-fresh 3/3 | HTTP 403 · 제목 "freepeople.com" · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge |
| DataDome | 높음 | Free People | impit 22/22 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 403 · 제목 "freepeople.com" · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge |
| DataDome | 높음 | Sezane | impit 20/20 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 403 · 제목 "sezane.com" · DataDome: x-datadome 헤더, 쿠키 datadome, 화면 흔적 datadome-challenge / CloudFront: x-amz-cf-* 헤더 |
| HUMAN(PerimeterX) | 높음 | Ann Taylor | impit 0/12 · playwright 4/6 · firefox 6/6 · firefox-fresh 3/3 | HTTP 200 · 제목 "Access to this page has been denied." · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / HUMAN(PerimeterX): 화면 흔적 px-challenge, 화면 흔적 px-script, 화면 흔적 px-block, 불러온 주소 client.px-cloud.net/PXm |
| HUMAN(PerimeterX) | 높음 | Loft | impit 0/19 · playwright 9/9 · firefox 7/9 · firefox-fresh 3/3 | HTTP 200 · 제목 "Access to this page has been denied." · Cloudflare: cf-ray 헤더 / Salesforce Commerce Cloud: x-dw/x-sfdc 헤더 / HUMAN(PerimeterX): 화면 흔적 px-challenge, 화면 흔적 px-script, 화면 흔적 px-block, 불러온 주소 client.px-cloud.net/PXY |
| Vercel | 높음 | Mango | impit 24/24 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 429 · 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint |
| Vercel | 높음 | Paige | impit 22/22 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 429 · 제목 "Vercel Security Checkpoint" · Vercel: x-vercel-id 헤더, 화면 흔적 vercel-checkpoint |
| 알 수 없음 | - | Abercrombie & Fitch | impit 24/24 · playwright 12/12 · firefox 12/12 · firefox-fresh 3/3 | HTTP 200 · 제목 "Client Challenge" · 쿠키 _fs_ch_st_FSBmUei20MqUiJb9 |


업체별로 본 것(오늘 측정 기준):

- **Akamai(Bot Manager)** — 가장 많다. 두 가지 모양: ① “Access Denied … Reference #18.…” 화면 + `server: AkamaiGHost`·`akamai-grn` +
  쿠키 `_abck`·`bm_sz`·`bm_s`(Chico's·WHBM·Joules·Fatface·Lululemon·Lands end·Theory·Eileen fisher·adidas — adidas 는
  “Reference Error … unable to give you access”), ② HTTP 200 인데 본문이 비어 있고 `bm-verify` 확인 스크립트 + 쿠키 `ak_bmsc`
  (Zara·Massimo Dutti·Oysho, 브라우저 없는 fetch 에만). 일부 사이트(H&M·Arket·&Other Stories·Garnet hill)는 **헤드리스 크롬만** 거부하고
  브라우저 없는 fetch(impit)나 파이어폭스는 통과시킨다 — 사이트마다 규칙 강도가 다르다는 뜻이다.
- **Cloudflare** — “Just a moment…”/“Verifying your connection…” 확인 화면(`cf-mitigated: challenge`, Aritzia·Reformation·The upside·
  Coldwatercreek·Alo)과 “Attention Required! … Sorry, you have been blocked” 차단 화면(Prana, L.L bean 은 크롬만). 브라우저로 열면
  첫 페이지는 통과하고 두 번째부터 막히는 경우가 많다(Prana·The upside·Reformation 파이어폭스).
- **DataDome** — `x-datadome: protected`, 쿠키 `datadome`, 화면 “Please enable JS and disable any ad blocker” + `captcha-delivery.com`.
  Anthropologie·Free People·FP Movement(같은 회사)·Sezane. 우리 엔진 전부(브라우저 포함) 막힌다.
- **HUMAN(PerimeterX)** — 화면 “Access to this page has been denied.” + `px-cloud.net` 스크립트·`px-captcha`. Ann Taylor·Loft(같은 회사).
  **브라우저만** 막히고 브라우저 없는 fetch 는 통과(상품 링크 170~260개가 그대로 보인다).
- **Vercel 방화벽** — “Vercel Security Checkpoint … We're verifying your browser”, HTTP 429, `x-vercel-id`. Mango·Paige. 모든 엔진.
- **업체 불명** — Abercrombie & Fitch: 제목 “Client Challenge”, 쿠키 `_fs_ch_st_*`, 크롬은 HTTP 418. 흔적으로 업체를 특정할 수 없어 '알 수 없음'.
- **차단이 아닌 것** — The White Company 는 미국 IP 를 /us/ 로 돌려 “미국으로 배송 못 함” 화면(지역). Patagonia 는 데이터센터에
  “시스템 점검 중” 정적 화면(`server: AkamaiNetStorage`)을 준다 — 같은 시각 파이어폭스로 일부 페이지가 열려 진짜 점검은 아니다(낮음).

유료 서비스를 고른다면: 무료로 안 되는 주소의 대부분이 **Akamai**(브랜드 수 기준 최다)이고 다음이 **DataDome**·**Cloudflare** 다.
세 업체를 모두 통과하는지가 관건이다 — 한 업체만 잘 뚫는 서비스는 일부 브랜드만 푼다. Vercel(2)·Client Challenge(1)는 작다.
아래 §6 의 시험 칸으로 `targets-blocked.json`(무료로 못 연 주소만) 한 번이면 서비스마다 업체별 통과율이 나온다.


## 3. 담당자가 확인해야 할 URL

| 브랜드 | 지금 URL | 근거 | 바꿀 것 |
|---|---|---|---|
| Addidas | https://www.adidas.com/us/women-tops?sort=newest-to-oldest | 확장이 이 URL 에서 0개(catalog-audit 11/25). 데이터센터는 차단이라 확인 못 함 | 정렬 파라미터 없는 /us/women-tops 로(추정) |
| Bash | https://ba-sh.com/fr/en/…/?_gl=… (카테고리 전부) | 동작은 함 — 광고 추적 꼬리(_gl=…)가 붙은 주소 | ? 뒤를 뗀 주소 |
| Fatface | https://www.fatface.com/shop/womens/clothing/tops/t-shirts | 확장이 이 URL 에서 0개(catalog-audit 11/25). 데이터센터는 차단이라 확인 못 함 | 담당자가 사이트에서 확인 |
| Good American | https://www.goodamerican.com/en-kr/collections/… (카테고리 전부) | 11/25 impit 2회: /en-kr/ → /collections/… 로 이동 | https://www.goodamerican.com/collections/… (지역 없는 주소) |
| Joules | https://www.joules.com/shop/womens/clothing/tops | 확장이 이 URL 에서 0개(catalog-audit 11/25) | 담당자가 사이트에서 확인 |
| Lucky Brand | https://www.luckybrand.com/women/clothing/shirts/blouses | 11/25 헤드리스 0개 · 진단 페이지 제목 'Search / Lucky Brand' · 오늘 크롬·파이어폭스 0개 | 담당자가 블라우스 카테고리 현재 주소 확인 |
| Madewell | https://www.madewell.com/kr/womens/… (카테고리 전부) | 동작은 함 — 한국 지역(/kr/) 주소 | 미국 주소로(담당자 판단) |
| Monsoon | https://www.monsoonlondon.com/kr/womens/… (카테고리 전부) | 동작은 함 — 한국 지역(/kr/) 주소라 가격·배송이 한국 기준일 수 있음 | /us/ 또는 /uk/ 주소로(담당자 판단) |
| Oysho | https://www.oysho.com/gb/dresses-jumpsuits-n4954 | 확장이 0개(catalog-audit 11/25) | 담당자가 사이트에서 확인 |
| The white company | https://www.thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts | 확장이 0개(catalog-audit 11/25) · 데이터센터는 /us/ 로 이동 | 담당자가 영국 사이트에서 현재 주소 확인 |
| Vanessa bruno | https://www.vanessabruno.com/last-chance/knitwear.html | 11/25 impit 3회·크롬·파이어폭스: 첫 화면(/)으로 이동 | 담당자가 니트 카테고리 새 주소 확인 |

바꾸지 않아도 되는 것 — 카탈로그 점검(catalog-audit)이 '교체가 필요한 카테고리 URL'로 올렸지만 주소는 살아 있다:

| 브랜드 | URL | 근거 |
|---|---|---|
| &Other Stories | https://www.stories.com/en-us/clothing/tops/ | 카탈로그 점검은 '교체 필요'로 올렸지만 오늘 impit·파이어폭스 모두 상품 37~48개 — 주소는 살아 있음 |
| Arket | https://www.arket.com/en-ww/women/clothing/tops/ | 카탈로그 점검은 '교체 필요'(확장 0개)로 올렸지만 오늘 impit 3회·파이어폭스 3회 모두 상품 33~48개 — 주소는 살아 있고 확장이 못 읽는 것 |
| Athleta | Athleta 카테고리 URL 전부 | 카탈로그 점검은 '교체 필요'로 올렸지만 데이터센터 크롬·파이어폭스로 모두 열림(HTTP 200) — 수집기가 상품을 5~12개만 읽는 문제 |
| Banana Republic | Banana Republic 카테고리 URL 전부 | 카탈로그 점검은 '교체 필요'로 올렸지만 데이터센터 크롬·파이어폭스로 모두 열림(HTTP 200) — 수집기가 상품을 5~12개만 읽는 문제 |
| Gap | Gap 카테고리 URL 전부 | 카탈로그 점검은 '교체 필요'로 올렸지만 데이터센터 크롬·파이어폭스로 모두 열림(HTTP 200) — 수집기가 상품을 5~12개만 읽는 문제 |
| Old Navy | Old Navy 카테고리 URL 전부 | 카탈로그 점검은 '교체 필요'로 올렸지만 데이터센터 크롬·파이어폭스로 모두 열림(HTTP 200) — 수집기가 상품을 5~12개만 읽는 문제 |


## 4. 목록 페이지 — 브랜드별

'근거(측정)' 칸의 `엔진 성공/잰 횟수(실패 원인 HTTP)` 는 오늘 그 브랜드의 목록 URL 들을 모든 실행에서 잰 합계다.
엔진: impit = 브라우저 없이 크롬의 TLS 지문으로 HTML 만 받음(서버 프리페치와 가장 비슷한 길) · playwright = 헤드리스 크롬 ·
firefox = 헤드리스 파이어폭스 · firefox-fresh = 페이지마다 쿠키 없는 새 창 · server = Render 서버에 직접 물어봄(프리페치와 같은 길).
목록은 "상품 5개 이상"을 성공으로 셌다(브라우저는 야간 수집과 같은 수집기 collector.js 기준, impit 은 HTML 의 상품 링크).
✅ 행에서 impit 이 0 이어도 문제가 아니다 — 그 사이트는 상품을 스크립트로 그리고, 서버는 Shopify JSON 같은 다른 길로 읽는다(야간 수치가 근거).


### ✅ 된다 — 83개 브랜드 · 상품 23,415개

| 브랜드 | 담당 | 상품 | 혼용률 | 근거 |
|---|---|---:|---:|---|
| Addison bay | 서버(Render) | 141 | 92% | 서버 프리페치 11/25 141개(6일 141·141·141·141·141·141) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Aerie | 헤드리스(Actions) | 101 | 91% | 헤드리스 11/25 101개 · URL 48·46·43·48 — 오늘 impit 12/12 · playwright 4/4 · firefox 4/4 · firefox-fresh 2/2 · 11/25 야간 실측(규칙 판정) |
| ALC | 서버(Render) | 393 | 98% | 서버 프리페치 11/25 393개(6일 393·393·393·393·393·393) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Alo | 서버(Render) | 190 | 89% | 서버 프리페치 11/25 190개(6일 190·198·201·193·215·216) — 오늘 impit 0/8 · 11/25 야간 실측(규칙 판정) |
| American Eagle | 헤드리스(Actions) | 178 | 99% | 헤드리스 11/25 178개 · URL 30·30·30·30·30·30 — 오늘 impit 12/12 · 11/25 야간 실측(규칙 판정) |
| Apiece Apart | 헤드리스(Actions) | 102 | 94% | 헤드리스 11/25 102개 · URL 39·39·24 — 오늘 impit 0/6 · 11/25 야간 실측(규칙 판정) |
| Barbour | 헤드리스(Actions) | 170 | 90% | 헤드리스 11/25 170개 · URL 41·41·41·34·38 — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Bassike | 서버(Render) | 318 | 97% | 서버 프리페치 11/25 318개(6일 318·320·278·320·320·324) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Bellerose | 서버(Render) | 231 | 91% | 서버 프리페치 11/25 231개(6일 231·171·172·172·172·169) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Beyond yoga | 서버(Render) | 175 | 98% | 서버 프리페치 11/25 175개(6일 175·175·178·178·178·179) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Boden | 서버(Render) | 331 | 94% | 서버 프리페치 11/25 331개(6일 331·341·344·343·342·343) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Boldest | 헤드리스(Actions) | 136 | 100% | 헤드리스 11/25 136개 · URL 71·65 — 오늘 impit 0/4 · 11/25 야간 실측(규칙 판정) |
| Buck Mason | 서버(Render) | 119 | 48% | 서버 프리페치 11/25 119개(6일 119·120·120·120·119·118) — 오늘 impit 12/12 · 11/25 야간 실측(규칙 판정) |
| CCC | 헤드리스(Actions) | 800 | 94% | 헤드리스 11/25 240개 · URL 53·53·53·53·53 — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Citizens of Humanity | 서버(Render) | 171 | 95% | 서버 프리페치 11/25 171개(6일 171·171·171·171·171·171) — 오늘 impit 6/8 · 11/25 야간 실측(규칙 판정) |
| Club monaco | 서버(Render) | 169 | 82% | 서버 프리페치 11/25 169개(6일 169·169·171·171·171·172) — 오늘 impit 6/6 · 11/25 야간 실측(규칙 판정) |
| Coldwatercreek | 헤드리스(Actions) | 200 | 33% | 헤드리스 11/25 200개 · URL 59·53·65·67·61 — 오늘 impit 0/10 · 11/25 야간 실측(규칙 판정) |
| Cotton citizen | 서버(Render) | 283 | 88% | 서버 프리페치 11/25 283개(6일 283·282·282·282·286·288) — 오늘 impit 12/12 · 11/25 야간 실측(규칙 판정) |
| Cotton on | 헤드리스(Actions) | 470 | 100% | 헤드리스 11/25 470개 · URL 189·189·36·52·189 — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Damson Madder | 서버(Render) | 385 | 98% | 서버 프리페치 11/25 385개(6일 385·394·372·372·372·347) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Draper James | 서버(Render) | 147 | 93% | 서버 프리페치 11/25 147개(6일 147·147·147·148·148·148) — 오늘 impit 6/6 · 11/25 야간 실측(규칙 판정) |
| Eddie bauer | 서버(Render) | 200 | 95% | 서버 프리페치 11/25 200개(6일 200·210·211·202·171·174) — 오늘 impit 12/12 · 11/25 야간 실측(규칙 판정) |
| English factory | 서버(Render) | 269 | 93% | 서버 프리페치 11/25 269개(6일 269·271·268·268·268·268) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Evereve | 서버(Render) | 444 | 94% | 서버 프리페치 11/25 444개(6일 444·444·444·444·443·444) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Everlane | 서버(Render) | 443 | 67% | 서버 프리페치 11/25 443개(6일 443·444·450·451·455·454) — 오늘 impit 4/10 · 11/25 야간 실측(규칙 판정) |
| Faherty | 서버(Render) | 170 | 95% | 서버 프리페치 11/25 170개(6일 170·170·172·172·175·177) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Frame | 서버(Render) | 189 | 89% | 서버 프리페치 11/25 189개(6일 189·190·191·191·191·190) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Frank & Eileen | 서버(Render) | 448 | 99% | 프리페치 445~446개(11/25 하루만 80 — 같은 날 낮 서버 측정은 카테고리당 33~99개) — 오늘 impit 16/16 · playwright 6/6 · firefox 6/6 · server 10/10 · firefox-fresh 3/3 · 측정·판정 |
| Gerard darel | 헤드리스(Actions) | 138 | 97% | 헤드리스 11/25 138개 · URL 23·50·33·38 — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Gestuz | 헤드리스(Actions) | 643 | 93% | 헤드리스 11/25 643개 · URL 135·116·116·62·181·97 — 오늘 impit 12/12 · 11/25 야간 실측(규칙 판정) |
| Goldie | 서버(Render) | 139 | 99% | 서버 프리페치 11/25 139개(6일 139·139·138·138·138·138) — 오늘 impit 4/4 · 11/25 야간 실측(규칙 판정) |
| Greyson | 서버(Render) | 93 | 96% | 서버 프리페치 11/25 93개(6일 93·93·93·93·93·93) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Gymshark | 서버(Render) | 274 | 99% | 서버 프리페치 11/25 274개(6일 274·275·277·280·285·290) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Hobbs | 서버(Render) | 353 | 91% | 서버 프리페치 11/25 353개(6일 353·352·352·353·352·351) — 오늘 impit 6/6 · 11/25 야간 실측(규칙 판정) |
| J crew | 헤드리스(Actions) | 215 | 29% | 헤드리스 11/25 215개 · URL 59·46·62·57·73 — 오늘 impit 0/10 · 11/25 야간 실측(규칙 판정) |
| J.jill | 서버(Render) | 89 | 93% | 서버 프리페치 11/25 89개(6일 89·89·89·90·88·89) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| J.mclaughlin | 헤드리스(Actions) | 516 | 91% | 헤드리스 11/25 201개 · URL 25·69·42·77 — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Jager | 서버(Render) | 402 | 93% | 서버 프리페치 11/25 402개(6일 402·403·402·400·401·401) — 오늘 impit 0/10 · 11/25 야간 실측(규칙 판정) |
| Jigsaw | 서버(Render) | 315 | 97% | 서버 프리페치 11/25 315개(6일 315·315·311·311·311·311) — 오늘 impit 0/12 · 11/25 야간 실측(규칙 판정) |
| La Ligne | 서버(Render) | 397 | 98% | 서버 프리페치 11/25 397개(6일 397·394·391·389·388·388) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Leset | 헤드리스(Actions) | 326 | 84% | 헤드리스 11/25 326개 · URL 123·54·176·82·23·47 — 오늘 impit 10/12 · 11/25 야간 실측(규칙 판정) |
| Lilla P | 서버(Render) | 167 | 99% | 서버 프리페치 11/25 167개(6일 167·169·169·169·169·169) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| LNA | 서버(Render) | 236 | 96% | 서버 프리페치 11/25 236개(6일 236·236·236·236·234·234) — 오늘 impit 12/12 · 11/25 야간 실측(규칙 판정) |
| Marine Layer | 서버(Render) | 180 | 95% | 서버 프리페치 11/25 180개(6일 180·180·181·181·181·181) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Me+Em | 헤드리스(Actions) | 425 | 88% | 헤드리스 11/25 425개 · URL 64·22·162·149·162 — 오늘 impit 0/10 · 11/25 야간 실측(규칙 판정) |
| Michael Stars | 서버(Render) | 203 | 83% | 서버 프리페치 11/25 203개(6일 203·209·209·209·209·199) — 오늘 impit 12/12 · 11/25 야간 실측(규칙 판정) |
| Mint velvet | 서버(Render) | 416 | 70% | 서버 프리페치 11/25 416개(6일 416·416·417·417·417·417) — 오늘 impit 0/12 · 11/25 야간 실측(규칙 판정) |
| Monrow | 서버(Render) | 200 | 93% | 서버 프리페치 11/25 200개(6일 200·198·197·197·197·197) — 오늘 impit 6/6 · 11/25 야간 실측(규칙 판정) |
| Ninety Percent | 서버(Render) | 156 | 99% | 서버 프리페치 11/25 156개(6일 156·156·156·156·156·156) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Nylora | 서버(Render) | 237 | 96% | 서버 프리페치 11/25 237개(6일 237·236·236·236·236·233) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Oak + Fort | 서버(Render) | 336 | 100% | 서버 프리페치 11/25 336개(6일 336·337·336·337·337·337) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Oasis | 서버(Render) | 133 | 90% | 서버 프리페치 11/25 133개(6일 133·120·130·144·138·120) — 오늘 impit 0/10 · 11/25 야간 실측(규칙 판정) |
| On | 헤드리스(Actions) | 263 | 92% | 헤드리스 11/25 263개 · URL 165·73·19·60 — 오늘 impit 0/8 · 11/25 야간 실측(규칙 판정) |
| Outdoorvoices | 서버(Render) | 126 | 94% | 서버 프리페치 11/25 126개(6일 126·121·121·121·121·121) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Phase eight | 서버(Render) | 400 | 93% | 서버 프리페치 11/25 400개(6일 400·400·400·400·400·401) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Poetry | 헤드리스(Actions) | 303 | 79% | 헤드리스 11/25 303개 · URL 67·85·77·118 — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Project Social T | 서버(Render) | 275 | 91% | 서버 프리페치 11/25 275개(6일 275·275·275·275·275·275) — 오늘 impit 14/14 · 11/25 야간 실측(규칙 판정) |
| Rag & bone | 서버(Render) | 244 | 99% | 서버 프리페치 11/25 244개(6일 244·241·237·238·240·244) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Rails | 서버(Render) | 290 | 85% | 서버 프리페치 11/25 290개(6일 290·290·289·289·289·289) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| rouje | 서버(Render) | 232 | 64% | 서버 프리페치 11/25 232개(6일 232·232·232·232·232·232) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Sanctuary | 서버(Render) | 421 | 98% | 서버 프리페치 11/25 421개(6일 421·421·421·421·422·422) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Scoth & soda | 서버(Render) | 378 | 96% | 서버 프리페치 11/25 378개(6일 378·379·382·384·385·387) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Shopbop | 헤드리스(Actions) | 453 | 86% | 헤드리스 11/25 453개 · URL 237·242·240·246 — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Spanx | 서버(Render) | 84 | 79% | 서버 프리페치 11/25 84개(6일 84·79·79·81·80·80) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Splendid | 서버(Render) | 404 | 84% | 프리페치 403~404개(Shopify 경로) · 평 HTML 은 스크립트가 그림 — 오늘 impit 0/10 · 측정·판정 |
| Splits59 | 서버(Render) | 162 | 83% | 서버 프리페치 11/25 162개(6일 162·183·158·158·158·158) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Stateside | 서버(Render) | 335 | 82% | 서버 프리페치 11/25 335개(6일 335·335·335·335·335·335) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Sundry | 서버(Render) | 246 | 96% | 서버 프리페치 11/25 246개(6일 246·246·246·246·246·246) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Sweaty betty | 헤드리스(Actions) | 405 | 95% | 헤드리스 11/25 78개 · URL 36·36·23·39 — 오늘 impit 0/8 · 11/25 야간 실측(규칙 판정) |
| The Great | 서버(Render) | 240 | 97% | 프리페치 11/25 240개(앞 5일 111~119로 흔들림) · 낮 서버 측정 카테고리당 16~84 · 크롬 42~267 — 오늘 impit 0/16 · playwright 6/6 · firefox 6/6 · server 10/10 · firefox-fresh 3/3 · 측정·판정 |
| Thread & supply | 서버(Render) | 258 | 97% | 서버 프리페치 11/25 258개(6일 258·258·258·258·258·258) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Tuckernuck | 서버(Render) | 376 | 88% | 서버 프리페치 11/25 376개(6일 376·379·378·379·378·382) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Ulla Johnson | 서버(Render) | 307 | 97% | 서버 프리페치 11/25 307개(6일 307·308·309·309·308·308) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Varley | 서버(Render) | 285 | 97% | 서버 프리페치 11/25 285개(6일 285·284·295·295·292·292) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Velvet | 서버(Render) | 352 | 100% | 서버 프리페치 11/25 352개(6일 352·352·352·352·352·352) — 오늘 impit 0/12 · 11/25 야간 실측(규칙 판정) |
| Veronica Beard | 서버(Render) | 375 | 93% | 서버 프리페치 11/25 339개(6일 339·338·337·338·337·0) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Vince | 서버(Render) | 381 | 99% | 서버 프리페치 11/25 381개(6일 381·384·385·385·385·385) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Vuori | 서버(Render) | 219 | 94% | 서버 프리페치 11/25 219개(6일 219·219·219·219·219·219) — 오늘 impit 0/12 · 11/25 야간 실측(규칙 판정) |
| Whistles | 서버(Render) | 217 | 94% | 서버 프리페치 11/25 217개(6일 217·217·216·218·214·214) — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Wrap | 헤드리스(Actions) | 374 | 90% | 헤드리스 11/25 374개 · URL 100·115·63·48·91 — 오늘 impit 10/10 · 11/25 야간 실측(규칙 판정) |
| Xirena | 서버(Render) | 333 | 96% | 서버 프리페치 11/25 333개(6일 333·332·321·321·321·271) — 오늘 impit 8/8 · 11/25 야간 실측(규칙 판정) |
| Z Supply | 서버(Render) | 216 | 100% | 서버 프리페치 11/25 216개(6일 216·215·206·208·207·207) — 오늘 impit 0/12 · 11/25 야간 실측(규칙 판정) |
| Zara | 서버(Render) | 499 | 0% | 서버 프리페치 499개(Zara 전용 경로) · 평 HTML 은 Akamai 빈 확인 화면이지만 서버 길은 영향 없음 — 오늘 impit 0/12 · 측정·판정 |

### 🏠 집 IP(확장)에서만 — 27개 브랜드 · 상품 8,982개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| &Other Stories | 크롬 확장(집 PC) | 343 | 크롬만 Akamai 403 — HTML·파이어폭스는 열림 | 확장 343개(URL 4/5 · tops 12개) — 오늘 impit 16/16 · playwright 0/6(blocked 403) · firefox 6/6 · firefox-fresh 3/3 | 헤드리스 파이어폭스(browser-extra-brands) 또는 서버 HTML 로 옮김 — 11/24 파이어폭스 수집 475개 · 오늘 impit·파이어폭스 전부 성공 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Abercrombie & Fitch | 크롬 확장(집 PC) | 214 | 업체 불명 'Client Challenge' 확인 화면(쿠키 _fs_ch_st_*) · 크롬은 HTTP 418 | 확장 214개(6/6 URL) — 오늘 impit 0/18(blocked) · playwright 0/6(blocked 418) · firefox 0/6(blocked) · firefox-fresh 0/3(blocked) | 확장 유지. 서버에 A&F 전용 카탈로그 API 코드(abercrombie-catalog)가 있다 — 데이터센터에서 되는지 안 재 봄(추정) | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Addidas | 크롬 확장(집 PC) | 408 | Akamai 거부(“Reference Error … unable to give you access”) — 모든 엔진 | 확장 408개(URL 3/4) — 오늘 impit 0/14(blocked 403) · playwright 0/6(blocked·conn-drop 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 · 유료(Akamai 대응) 시험 대상 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Ann Taylor | 크롬 확장(집 PC) | 381 | 브라우저는 PerimeterX 차단 화면(“Access to this page has been denied” + px-cloud.net) · 평 HTML(impit)은 상품 250개 넘게 보임 | 확장 381개 — 오늘 impit 12/12 · playwright 2/6(blocked) · firefox 0/6(blocked) · firefox-fresh 0/3(blocked) | 서버 HTML 수집(브라우저 TLS 지문 fetch)으로 옮김 — 오늘 impit 9/9 URL 에서 상품 링크 252~261개 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Anthropologie | 크롬 확장(집 PC) | 270 | DataDome 차단(x-datadome: protected · 쿠키 datadome · captcha-delivery) — 파이어폭스는 첫 URL 만 열리고 다음부터 403 | 확장 270개 — 오늘 impit 0/16(blocked 403) · playwright 0/6(blocked 403) · firefox 2/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 · 유료(DataDome 대응) 시험 대상 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Aritzia | 크롬 확장(집 PC) | 800 | Cloudflare 확인 화면(Just a moment… · cf-mitigated: challenge) — 파이어폭스는 3개 중 1개만 | 확장 800개(6/6 URL) — 오늘 impit 0/18(blocked 403) · playwright 0/6(blocked 403) · firefox 2/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 서버에 Aritzia 검색 API(Algolia) 코드가 이미 있다 — 데이터센터에서 되면 무료(오늘 안 잼, 추정) · 아니면 확장 유지 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Arket | 크롬 확장(집 PC) | 285 | 크롬만 Akamai 403 — HTML·파이어폭스는 열림 | 확장 285개(URL 4/5) — 오늘 impit 16/16 · playwright 0/6(blocked 403) · firefox 6/6 · firefox-fresh 3/3 | 헤드리스 파이어폭스 또는 서버 HTML — 오늘 impit 13/13 · 파이어폭스 3/3 · 11/24 파이어폭스 373개 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Eileen fisher | 크롬 확장(집 PC) | 545 | Akamai 거부 화면(Access Denied · Reference #) — 모든 엔진 | 확장 545개 — 오늘 impit 0/14(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Fatface | 크롬 확장(집 PC) | 374 | Akamai 거부 — 모든 엔진 | 확장 374개(URL 3/4) — 오늘 impit 0/14(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| FP Movement | 크롬 확장(집 PC) | 58 | DataDome 차단 — 모든 엔진 | 확장 58개 · 표본이 카테고리 타일(수집기가 잘못 잡음 의심) — 오늘 impit 0/14(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 + 확장 수집기 선택자 확인 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Free People | 크롬 확장(집 PC) | 190 | DataDome 차단 — 모든 엔진 | 확장 190개 — 오늘 impit 0/16(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 · 유료(DataDome 대응) 시험 대상 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| H&M | 크롬 확장(집 PC) | 744 | 크롬만 Akamai 403 — 평 HTML(impit)에 상품 링크 323개, 파이어폭스도 열림 | 확장 744개 — 오늘 impit 16/16 · playwright 0/6(blocked 403) · firefox 6/6 · firefox-fresh 3/3 | 서버 HTML 또는 헤드리스 파이어폭스 — 오늘 impit 13/13 · 파이어폭스 3/3 · 11/24 파이어폭스 744개 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Joules | 크롬 확장(집 PC) | 459 | Akamai 거부 — 모든 엔진(Fatface 와 같은 플랫폼) | 확장 459개(URL 4/5) — 오늘 impit 0/16(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| L.L bean | 크롬 확장(집 PC) | 310 | 크롬만 Cloudflare 차단(Attention Required) — 평 HTML·파이어폭스는 열림 | 확장 310개 — 오늘 impit 16/16 · playwright 0/6(blocked 403) · firefox 6/6 · firefox-fresh 3/3 | 서버 HTML 또는 헤드리스 파이어폭스 — 오늘 impit 13/13(상품 링크 244~276)·파이어폭스 3/3 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Lands end | 크롬 확장(집 PC) | 469 | Akamai 거부 — 모든 엔진 | 확장 469개 — 오늘 impit 0/16(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Loft | 크롬 확장(집 PC) | 673 | 브라우저는 PerimeterX 차단 화면 · 평 HTML(impit)은 상품 링크 171개 | 확장 673개 — 오늘 impit 16/16 · playwright 0/6(blocked) · firefox 2/6(blocked) · firefox-fresh 0/3(blocked) | 서버 HTML 수집으로 옮김 — 오늘 impit 13/13 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Lululemon | 크롬 확장(집 PC) | 476 | Akamai 거부 — 모든 엔진(크롬은 접속 끊김) | 확장 476개 — 오늘 impit 0/16(blocked 403) · playwright 0/6(conn-drop) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 · 유료(Akamai 대응) 시험 대상 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Madewell | 크롬 확장(집 PC) | 75 | 차단 없음 — 데이터센터 크롬·파이어폭스 3/3(22~26개). 평 HTML 엔 상품이 적음(스크립트가 그림) | 확장 75개(URL 35·26·6·8) — 오늘 impit 4/14(no-cards) · playwright 6/6 · firefox 6/6 · firefox-fresh 3/3 | 헤드리스 크롬 그룹으로 옮김(무료). URL 이 한국 지역(/kr/)이라 가격이 원화일 수 있음 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Mango | 크롬 확장(집 PC) | 93 | Vercel 보안 확인 화면(Vercel Security Checkpoint, HTTP 429) — 모든 엔진 · 확장도 URL 당 14~16개만 | 확장 93개 — 오늘 impit 0/18(blocked 429) · playwright 0/6(blocked 429) · firefox 0/6(blocked 429) · firefox-fresh 0/3(blocked 429) | 확장 유지 + 확장 수집기의 더 보기/스크롤 확인 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Massimo Dutti | 크롬 확장(집 PC) | 603 | 평 HTML 은 Akamai 빈 확인 화면(200 · bm-verify) · 크롬 403 · 파이어폭스는 2회 모두 열림(한 창 2/3 — 1개 404, 새 창 3/3) | 확장 603개 — 오늘 impit 0/16(blocked) · playwright 0/6(blocked 403) · firefox 4/6(dead 404) · firefox-fresh 3/3 | 헤드리스 파이어폭스(+새 창) — 11/24 111개 · 오늘 2회 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Paige | 크롬 확장(집 PC) | 60 | Vercel 보안 확인 화면(HTTP 429) — 모든 엔진 | 확장 60개(URL 당 8~24) — 오늘 impit 0/16(blocked 429) · playwright 0/6(blocked 429) · firefox 0/6(blocked 429) · firefox-fresh 0/3(blocked 429) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Patagonia | 크롬 확장(집 PC) | 168 | 데이터센터에는 '시스템 점검 중' 정적 화면(server: AkamaiNetStorage) — 진짜 점검이 아니라 봇에게 보내는 화면으로 보임(낮음) · 파이어폭스 1/3 | 확장 168개 — 오늘 impit 0/16(maintenance) · playwright 0/6(maintenance) · firefox 2/6(maintenance) · firefox-fresh 0/3(maintenance) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Seasalt cornwall | 크롬 확장(집 PC) | 279 | 차단 없음 — 데이터센터 모든 엔진 성공 | 확장 279개 — 오늘 impit 16/16 · playwright 6/6 · firefox 6/6 · firefox-fresh 3/3 | 서버(HTML) 그룹으로 옮김 — 오늘 impit 13/13 · 크롬·파이어폭스 59~60개 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Sezane | 크롬 확장(집 PC) | 206 | DataDome 차단(CloudFront 앞단) — 모든 엔진 | 확장 206개(URL 1개는 1개만) — 오늘 impit 0/14(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| The white company | 크롬 확장(집 PC) | 68 | 지역: /uk/ 주소가 미국 IP 에서 /us/ 로 넘어가 '미국으로 배송 못 함' 화면 — 차단 아님 | 확장 68개(URL 2/3) — 오늘 impit 0/12(geo) · playwright 0/6(geo·dead 404) · firefox 0/6(geo·dead 404) · firefox-fresh 0/3(geo) | 영국 지역 쿠키·파라미터로 열어 보기(무료, 안 재 봄) · 안 되면 영국 IP(유료 서비스의 국가 지정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Theory | 크롬 확장(집 PC) | 379 | Akamai 거부 — 모든 엔진 | 확장 379개 — 오늘 impit 0/16(blocked 403) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 유지 | 2 집 IP 필요(확장) | 측정·판정 · 실행 4회 |
| Wilson | 크롬 확장(집 PC) | 52 | 차단 없음 — 데이터센터 모든 엔진 성공(크롬·파이어폭스 24~28개 > 확장 4~19개) | 확장 52개 — 오늘 impit 18/18 · playwright 6/6 · firefox 5/6(blocked 403) · firefox-fresh 1/3(blocked 403) | 헤드리스 크롬 그룹으로 옮김(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |

### 🟠 일부만 — 9개 브랜드 · 상품 4,104개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| Chico's | 서버(Render) | 800 | Akamai 거부 — 우리 엔진 전부 403. 서버는 리더 프록시(r.jina.ai) 우회로 가끔 성공(6일 중 3일 0) — 그 우회는 429 한도 | 프리페치 6일 3·3·262·251·3·208 · 카탈로그 11/22 이후 갱신 없음 — 오늘 impit 0/20(blocked 403) · playwright 0/10(blocked 403) · firefox 0/10(blocked 403) · server 6/10(blocked·shell 403) · firefox-fresh 0/5(blocked 403) | 확장 담당으로 옮김(집 IP) — 또는 유료(Akamai 대응) | 2 집 IP 필요(확장) | 측정·판정 · 실행 6회 |
| Garnet hill | 크롬 확장(집 PC) | 108 | Akamai — 크롬 403 · 파이어폭스는 한 창이면 첫 URL 만, 새 창이면 3/3 열림. 그런데 열려도 상품 7~10개뿐이고 집 IP 확장도 URL 3개에서 4~9개 — 목록을 잘 못 읽음 | 확장 86·4·9·9 — 오늘 impit 0/14(shell) · playwright 0/6(blocked 403) · firefox 2/6(blocked 403) · firefox-fresh 3/3 | 파이어폭스 + 새 창으로 열고 수집기 확인(무료, 새 창 1회 측정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| James Perse | 서버(Render) | 526 | 차단 없음 — 서버가 매일 142~155개, 저장 526 은 옛 수집분. 페이지당 상품 링크 13~22개라 페이지 넘김을 못 따라가는 것으로 보임(추정) | 프리페치 142개 — 오늘 impit 18/18 · playwright 6/6 · firefox 6/6 · server 6/12(rate-limit 429) · firefox-fresh 3/3 | 서버의 페이지 넘김 확인(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |
| Nation LTD | 서버(Render) | 525 | 차단 없음 — 서버가 매일 161~164개, 저장 525 는 옛 수집분 · 페이지당 22~52개(페이지 넘김 의심, 추정) | 프리페치 161개 — 오늘 impit 14/14 · playwright 6/6 · firefox 6/6 · server 8/8 · firefox-fresh 3/3 | 서버의 페이지 넘김 확인(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |
| Reformation | 서버(Render) | 753 | Cloudflare 확인 화면 — 서버 직접·impit 403 · 서버는 리더 프록시로 일부(dresses 0). 데이터센터 헤드리스 크롬은 2회 모두 3/3, 파이어폭스는 첫 URL 만 — 새 창이면 3/3 | 프리페치 221개(저장 753 은 옛 수집분 포함) — 오늘 impit 0/16(blocked 403) · playwright 6/6 · firefox 2/6(blocked 403) · server 7/10(shell·blocked 403) · firefox-fresh 3/3 | 헤드리스 크롬 그룹으로 옮김(무료, 2회 측정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |
| The upside | 헤드리스(Actions) | 429 | Cloudflare 확인 화면 — 한 창으로 이어서 열면 첫 카테고리만 열리고 다음부터 403(헤드리스 크롬·파이어폭스 2회). 카테고리마다 쿠키 없는 새 창으로 열면 4/4 열림(68·56·30·68) | 헤드리스 11/25 70·0·0·0 (저장 429 는 옛 수집분) — 오늘 impit 0/16(blocked 403) · playwright 2/8(blocked 403) · firefox 2/8(blocked 403) · firefox-fresh 4/4 | 헤드리스 수집을 파이어폭스 + 카테고리마다 새 창(browser-collect 의 FRESH_CONTEXT=1 — 이미 있는 설정)으로. 새 창 측정은 1회 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| vineyardvines | 서버(Render) | 560 | 평 HTML 엔 상품이 없음(스크립트가 그림) — 서버는 리더 프록시로 tops·dresses·pants 만 · 크롬도 6~10개만(지연 로딩) | 프리페치 143~151개(저장 560 은 옛 수집분 포함) — 오늘 impit 0/16(no-cards) · playwright 6/6 · firefox 6/6 · server 3/10(rate-limit·shell 429) · firefox-fresh 3/3 | 헤드리스로 옮기고 스크롤·더 보기 처리(무료, 추정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |
| WHBM | 서버(Render) | 219 | Akamai 거부 — 우리 엔진 전부 403(Chico's 와 같은 회사). 서버는 리더 프록시 우회로만 — 오늘 낮엔 됐고 밤엔 6일 연속 2개 | 프리페치 6일 2개 · 카탈로그 11/18 이후 갱신 없음 — 오늘 impit 0/20(blocked 403) · playwright 0/10(blocked 403) · firefox 0/10(blocked 403) · server 10/10 · firefox-fresh 0/5(blocked 403) | 확장 담당으로 옮김 또는 유료 | 2 집 IP 필요(확장) | 측정·판정 · 실행 6회 |
| Whitestuff | 서버(Render) | 184 | 서버 직접 fetch 가 'fetch failed'(Worker 도 404) → 리더 프록시로만 읽어 매일 114~267개로 흔들림. 평 HTML(impit)·크롬은 15/15 성공 | 프리페치 6일 184·182·190·223·114·267 — 오늘 impit 18/18 · playwright 6/6 · firefox 6/6 · server 3/12(rate-limit 429) · firefox-fresh 3/3 | 서버 fetch 를 브라우저 TLS 지문 fetch(impit 류)로 — 무료 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |

### ⛔ 어디서도 막힘 — 1개 브랜드 · 상품 81개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| Prana | 서버(Render) | 81 | Cloudflare 차단 화면(Attention Required · Sorry, you have been blocked) — impit·서버 전부. 1차 러너에선 크롬·파이어폭스가 첫 URL 만 열렸고, 2차 러너에선 첫 URL 도 403(새 창 포함) | 서버 6일 연속 1개 · 카탈로그 9/22 이후 갱신 없음(두 달) — 오늘 impit 0/16(blocked 403) · playwright 1/8(blocked 403) · firefox 1/8(blocked 403) · server 0/8(blocked·shell 403) · firefox-fresh 0/4(blocked 403) | 확장 담당으로 옮김(집 IP — 안 재 봄) 또는 유료(Cloudflare 대응) | 2 집 IP 필요(확장) | 측정·판정 · 실행 6회 |

### 🔗 URL 이 틀림·죽음 — 2개 브랜드 · 상품 786개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| Good American | 서버(Render) | 625 | URL 에 한국 지역(/en-kr/) — 미국 IP 에선 지역 없는 주소로 넘어감 · 서버는 카테고리당 10~53개 · 크롬은 43~353개 | 프리페치 216개(저장 625 는 옛 수집분 포함) — 오늘 impit 2/16(geo·no-cards) · playwright 6/6 · firefox 5/6(blocked 403) · server 4/10(rate-limit 429) · firefox-fresh 2/3(blocked 403) | URL 에서 /en-kr 빼기 | 4 새 URL 필요(담당자) | 측정·판정 · 실행 6회 |
| Lucky Brand | 헤드리스(Actions) | 161 | blouses URL 이 검색 페이지('Search / Lucky Brand')로 열리고 수집 중 페이지가 바뀜(Execution context destroyed) | 헤드리스 65·90·0·67·36 — 오늘 impit 14/14 · playwright 2/4(shell) · firefox 2/4(shell) · firefox-fresh 1/2(shell) | blouses 카테고리 새 주소 | 4 새 URL 필요(담당자) | 측정·판정 · 실행 4회 |

### 🔧 열리는데 잘못 읽음 — 12개 브랜드 · 상품 1,152개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| Athleta | 크롬 확장(집 PC) | 1 | Gap 계열: 페이지는 열리는데(데이터센터 크롬·파이어폭스 200) 수집기가 상품을 4~6개만 잡음 — 집 IP 확장도 1개 | 확장 1개(4개 URL 중 3개 0) — 오늘 impit 0/16(no-cards) · playwright 3/8(no-cards) · firefox 8/8 · firefox-fresh 4/4 | Gap 계열 상품 목록 JSON(사이트가 그리드를 그릴 때 부르는 주소)으로 읽기 — 무료(추정, 안 재 봄) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Banana Republic | 크롬 확장(집 PC) | 1 | Gap 계열: 열리는데 수집기가 5개만 — 확장도 1개 | 확장 1개 — 오늘 impit 0/16(no-cards) · playwright 8/8 · firefox 8/8 · firefox-fresh 4/4 | Gap 계열 목록 JSON(추정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Bash | 서버(Render) | 50 | 차단 없음 — 서버가 카테고리당 4~10개만, 평 HTML 엔 URL 당 51~97개 · 크롬 34~65개 | 프리페치 50개(6일 34~56) — 오늘 impit 16/16 · playwright 6/6 · firefox 6/6 · server 4/10(shell) · firefox-fresh 3/3 | 서버 목록 읽기 보완 또는 헤드리스(무료). URL 에 광고 추적 꼬리(_gl=…)가 붙어 있음 — 떼어도 됨 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |
| Carlhartt | 헤드리스(Actions) | 148 | 수집기가 메뉴·기획전 타일(/c/black-friday 등, 이름 'arrow icon')을 상품으로 잡음 | 헤드리스 148개 · 표본 5개가 전부 카테고리 링크 — 오늘 impit 12/14(no-cards) · playwright 4/4 · firefox 4/4 · firefox-fresh 2/2 | 수집기에서 /c/ 경로 제외(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Dickies | 서버(Render) | 260 | 차단 없음 — 서버가 카테고리당 2~48개만 읽음(6일 내내 72개), 평 HTML 엔 URL 당 상품 링크 46~49개 · 크롬 50~90개 | 프리페치 72개(저장 260 은 옛 수집분 포함) — 오늘 impit 16/16 · playwright 6/6 · firefox 5/6(blocked 403) · server 6/10(shell) · firefox-fresh 3/3 | 서버 목록 읽기(선택자·페이지 넘김) 보완 또는 헤드리스로 — 무료 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |
| Gap | 크롬 확장(집 PC) | 6 | 열리는데 수집기가 11~12개만(기프트숍 배너) — 확장도 6개 | 확장 6개(전부 배너) — 오늘 impit 0/16(no-cards) · playwright 8/8 · firefox 8/8 · firefox-fresh 4/4 | Gap 계열 목록 JSON(추정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Monsoon | 서버(Render) | 30 | 차단 없음 — 서버가 카테고리당 0~22개, 평 HTML 엔 URL 당 40개 · 크롬 45개. URL 이 한국 지역(/kr/) | 프리페치 30개(6일 내내 29~30) — 오늘 impit 14/14 · playwright 6/6 · firefox 6/6 · server 3/8(rate-limit·shell 429) · firefox-fresh 3/3 | 서버 목록 읽기 보완 또는 헤드리스(무료) · 지역을 /us/ 등으로(가격 통화) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |
| Nike | 헤드리스(Actions) | 490 | 헤드리스 표본 5개가 모두 필터 카테고리 링크(/w/…) — 상품 아님 의심 | 헤드리스 490개 — 오늘 impit 0/12(no-cards) · playwright 4/4 · firefox 4/4 · firefox-fresh 2/2 | 수집기에서 /w/ 경로 제외, 상품(/t/…)만(무료, 추정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Old Navy | 크롬 확장(집 PC) | 7 | 열리는데 수집기가 10~11개만 — 확장도 7개(배너) | 확장 7개 — 오늘 impit 0/20(no-cards) · playwright 10/10 · firefox 10/10 · firefox-fresh 5/5 | Gap 계열 목록 JSON(추정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Oysho | 크롬 확장(집 PC) | 20 | 확장 카탈로그 20개가 전부 하위 카테고리 타일(…-n5063) — 상품이 아님. 데이터센터 파이어폭스는 열림(3/3, 18~22개) | 확장 20개 — 오늘 impit 0/16(blocked) · playwright 0/6(blocked 403) · firefox 6/6 · firefox-fresh 3/3 | 헤드리스 파이어폭스 + 수집기 확인(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 4회 |
| Sessun | 서버(Render) | 81 | 서버 목록 읽기가 일부 상품 대신 이미지 주소(static.sessun.com/…webp%20924w — srcset 조각)를 상품 링크로 저장 | 프리페치 81개 · 카탈로그 표본에 이미지 주소 섞임(오늘 상품 표본 3개가 전부 이미지 주소 → 404) — 오늘 impit 10/10 | 서버 목록 읽기에서 srcset 조각을 링크로 쓰지 않게(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 2회 |
| Vanessa bruno | 서버(Render) | 58 | 서버가 tops 6개 말고는 0개 — 같은 페이지 평 HTML 에 상품 링크 22~25개, 크롬도 21~25개 · URL 1개는 첫 화면으로 튕김 | 프리페치 6일 내내 6개(저장 58 은 옛 수집분) — 오늘 impit 6/18(no-cards·dead) · playwright 4/6(dead) · firefox 4/6(dead) · server 4/12(shell) · firefox-fresh 2/3(dead) | 서버 목록 읽기 보완 또는 헤드리스(무료) + 죽은 URL 교체 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 6회 |


## 5. 상품 페이지 — 브랜드별

상품은 "혼용률을 읽음"을 성공으로 셌다. 브랜드마다 카탈로그 앞쪽 상품 3개(같은 상품을 모든 엔진이 연다).
site-api = 사이트 자체 JSON(Shopify `.json`·Zara), wayback = 웹 아카이브 보관본.


### ✅ 된다 — 91개 브랜드 · 상품 26,866개

| 브랜드 | 담당 | 상품 | 혼용률 | 근거 |
|---|---|---:|---:|---|
| Addison bay | 서버(Render) | 141 | 92% | 혼용률 130/141(92%) · 11/25 야간 실측(규칙 판정) |
| Aerie | 헤드리스(Actions) | 101 | 91% | 혼용률 92/101(91%) · 11/25 야간 실측(규칙 판정) |
| ALC | 서버(Render) | 393 | 98% | 혼용률 386/393(98%) · 11/25 야간 실측(규칙 판정) |
| Alo | 서버(Render) | 190 | 89% | 혼용률 169/190(89%) — 오늘 impit 0/3 · playwright 3/3 · firefox 3/3 · 11/25 야간 실측(규칙 판정) |
| American Eagle | 헤드리스(Actions) | 178 | 99% | 혼용률 176/178(99%) · 11/25 야간 실측(규칙 판정) |
| Ann Taylor | 크롬 확장(집 PC) | 381 | 92% | 혼용률 349/381(92%) — 확장 몫 · 측정·판정 |
| Apiece Apart | 헤드리스(Actions) | 102 | 94% | 혼용률 96/102(94%) · 11/25 야간 실측(규칙 판정) |
| Barbour | 헤드리스(Actions) | 170 | 90% | 혼용률 153/170(90%) — 오늘 impit 2/2 · site-api 0/2 · wayback 2/2 · playwright 2/2 · firefox 2/2 · 11/25 야간 실측(규칙 판정) |
| Bash | 서버(Render) | 50 | 94% | 혼용률 47/50(94%) · 11/25 야간 실측(규칙 판정) |
| Bassike | 서버(Render) | 318 | 97% | 혼용률 307/318(97%) · 11/25 야간 실측(규칙 판정) |
| Bellerose | 서버(Render) | 231 | 91% | 혼용률 211/231(91%) · 11/25 야간 실측(규칙 판정) |
| Beyond yoga | 서버(Render) | 175 | 98% | 혼용률 172/175(98%) · 11/25 야간 실측(규칙 판정) |
| Boden | 서버(Render) | 331 | 94% | 혼용률 311/331(94%) · 11/25 야간 실측(규칙 판정) |
| Boldest | 헤드리스(Actions) | 136 | 100% | 혼용률 136/136(100%) · 11/25 야간 실측(규칙 판정) |
| CCC | 헤드리스(Actions) | 800 | 94% | 혼용률 749/800(94%) — 오늘 impit 2/2 · site-api 2/2 · wayback 0/2 · playwright 2/2 · firefox 2/2 · 11/25 야간 실측(규칙 판정) |
| Citizens of Humanity | 서버(Render) | 171 | 95% | 혼용률 162/171(95%) · 11/25 야간 실측(규칙 판정) |
| Club monaco | 서버(Render) | 169 | 82% | 혼용률 139/169(82%) · 11/25 야간 실측(규칙 판정) |
| Cotton citizen | 서버(Render) | 283 | 88% | 혼용률 248/283(88%) · 11/25 야간 실측(규칙 판정) |
| Cotton on | 헤드리스(Actions) | 470 | 100% | 혼용률 468/470(100%) · 11/25 야간 실측(규칙 판정) |
| Damson Madder | 서버(Render) | 385 | 98% | 혼용률 377/385(98%) · 11/25 야간 실측(규칙 판정) |
| Draper James | 서버(Render) | 147 | 93% | 혼용률 136/147(93%) · 11/25 야간 실측(규칙 판정) |
| Eddie bauer | 서버(Render) | 200 | 95% | 혼용률 189/200(95%) · 11/25 야간 실측(규칙 판정) |
| Eileen fisher | 크롬 확장(집 PC) | 545 | 93% | 혼용률 508/545(93%) 확장 몫 · 측정·판정 |
| English factory | 서버(Render) | 269 | 93% | 혼용률 249/269(93%) · 11/25 야간 실측(규칙 판정) |
| Evereve | 서버(Render) | 444 | 94% | 혼용률 418/444(94%) · 11/25 야간 실측(규칙 판정) |
| Faherty | 서버(Render) | 170 | 95% | 혼용률 161/170(95%) · 11/25 야간 실측(규칙 판정) |
| Frame | 서버(Render) | 189 | 89% | 혼용률 169/189(89%) · 11/25 야간 실측(규칙 판정) |
| Frank & Eileen | 서버(Render) | 448 | 99% | 혼용률 442/448(99%) · 11/25 야간 실측(규칙 판정) |
| Gerard darel | 헤드리스(Actions) | 138 | 97% | 혼용률 134/138(97%) · 11/25 야간 실측(규칙 판정) |
| Gestuz | 헤드리스(Actions) | 643 | 93% | 혼용률 596/643(93%) · 11/25 야간 실측(규칙 판정) |
| Goldie | 서버(Render) | 139 | 99% | 혼용률 138/139(99%) · 11/25 야간 실측(규칙 판정) |
| Good American | 서버(Render) | 625 | 85% | 혼용률 531/625(85%) · 측정·판정 |
| Greyson | 서버(Render) | 93 | 96% | 혼용률 89/93(96%) · 11/25 야간 실측(규칙 판정) |
| Gymshark | 서버(Render) | 274 | 99% | 혼용률 271/274(99%) · 11/25 야간 실측(규칙 판정) |
| Hobbs | 서버(Render) | 353 | 91% | 혼용률 320/353(91%) · 11/25 야간 실측(규칙 판정) |
| J.jill | 서버(Render) | 89 | 93% | 혼용률 83/89(93%) · 11/25 야간 실측(규칙 판정) |
| J.mclaughlin | 헤드리스(Actions) | 516 | 91% | 혼용률 469/516(91%) · 11/25 야간 실측(규칙 판정) |
| Jager | 서버(Render) | 402 | 93% | 혼용률 374/402(93%) · 11/25 야간 실측(규칙 판정) |
| James Perse | 서버(Render) | 526 | 100% | 혼용률 524/526(100%) · 11/25 야간 실측(규칙 판정) |
| Jigsaw | 서버(Render) | 315 | 97% | 혼용률 304/315(97%) · 11/25 야간 실측(규칙 판정) |
| L.L bean | 크롬 확장(집 PC) | 310 | 95% | 혼용률 293/310(95%) 확장 몫 — 오늘 impit 0/3 · playwright 0/3 · firefox 0/3 · 측정·판정 |
| La Ligne | 서버(Render) | 397 | 98% | 혼용률 391/397(98%) · 11/25 야간 실측(규칙 판정) |
| Lands end | 크롬 확장(집 PC) | 469 | 88% | 혼용률 411/469(88%) 확장 몫 · 데이터센터는 모든 엔진 403 — 오늘 impit 0/6 · site-api 0/3 · wayback 2/3 · playwright 0/6 · firefox 0/6 · 측정·판정 |
| Leset | 헤드리스(Actions) | 326 | 84% | 혼용률 275/326(84%) · 11/25 야간 실측(규칙 판정) |
| Lilla P | 서버(Render) | 167 | 99% | 혼용률 166/167(99%) · 11/25 야간 실측(규칙 판정) |
| LNA | 서버(Render) | 236 | 96% | 혼용률 226/236(96%) · 11/25 야간 실측(규칙 판정) |
| Lucky Brand | 헤드리스(Actions) | 161 | 93% | 혼용률 149/161(93%) — 오늘 impit 2/2 · site-api 0/2 · wayback 1/2 · playwright 2/2 · firefox 2/2 · 11/25 야간 실측(규칙 판정) |
| Madewell | 크롬 확장(집 PC) | 75 | 89% | 혼용률 67/75(89%) — 오늘 impit 3/3 · playwright 3/3 · firefox 3/3 · 측정·판정 |
| Marine Layer | 서버(Render) | 180 | 95% | 혼용률 171/180(95%) · 11/25 야간 실측(규칙 판정) |
| Me+Em | 헤드리스(Actions) | 425 | 88% | 혼용률 374/425(88%) — 오늘 impit 2/2 · site-api 0/2 · wayback 2/2 · playwright 2/2 · firefox 2/2 · 11/25 야간 실측(규칙 판정) |
| Michael Stars | 서버(Render) | 203 | 83% | 혼용률 168/203(83%) · 11/25 야간 실측(규칙 판정) |
| Monrow | 서버(Render) | 200 | 93% | 혼용률 186/200(93%) · 11/25 야간 실측(규칙 판정) |
| Monsoon | 서버(Render) | 30 | 97% | 혼용률 29/30(97%) · 11/25 야간 실측(규칙 판정) |
| Nation LTD | 서버(Render) | 525 | 100% | 혼용률 525/525(100%) · 11/25 야간 실측(규칙 판정) |
| Nike | 헤드리스(Actions) | 490 | 82% | 혼용률 402/490(82%) · 11/25 야간 실측(규칙 판정) |
| Ninety Percent | 서버(Render) | 156 | 99% | 혼용률 154/156(99%) · 11/25 야간 실측(규칙 판정) |
| Nylora | 서버(Render) | 237 | 96% | 혼용률 228/237(96%) · 11/25 야간 실측(규칙 판정) |
| Oak + Fort | 서버(Render) | 336 | 100% | 혼용률 335/336(100%) · 11/25 야간 실측(규칙 판정) |
| Oasis | 서버(Render) | 133 | 90% | 혼용률 120/133(90%) · 11/25 야간 실측(규칙 판정) |
| On | 헤드리스(Actions) | 263 | 92% | 혼용률 241/263(92%) — 오늘 impit 2/2 · site-api 0/2 · wayback 0/2 · playwright 2/2 · firefox 2/2 · 11/25 야간 실측(규칙 판정) |
| Outdoorvoices | 서버(Render) | 126 | 94% | 혼용률 118/126(94%) · 11/25 야간 실측(규칙 판정) |
| Phase eight | 서버(Render) | 400 | 93% | 혼용률 373/400(93%) · 11/25 야간 실측(규칙 판정) |
| Project Social T | 서버(Render) | 275 | 91% | 혼용률 249/275(91%) · 11/25 야간 실측(규칙 판정) |
| Rag & bone | 서버(Render) | 244 | 99% | 혼용률 241/244(99%) · 11/25 야간 실측(규칙 판정) |
| Rails | 서버(Render) | 290 | 85% | 혼용률 246/290(85%) · 11/25 야간 실측(규칙 판정) |
| Sanctuary | 서버(Render) | 421 | 98% | 혼용률 411/421(98%) · 11/25 야간 실측(규칙 판정) |
| Scoth & soda | 서버(Render) | 378 | 96% | 혼용률 362/378(96%) · 11/25 야간 실측(규칙 판정) |
| Seasalt cornwall | 크롬 확장(집 PC) | 279 | 95% | 혼용률 266/279(95%) · 측정·판정 |
| Shopbop | 헤드리스(Actions) | 453 | 86% | 혼용률 391/453(86%) · 11/25 야간 실측(규칙 판정) |
| Splendid | 서버(Render) | 404 | 84% | 혼용률 338/404(84%) · 11/25 야간 실측(규칙 판정) |
| Splits59 | 서버(Render) | 162 | 83% | 혼용률 135/162(83%) · 11/25 야간 실측(규칙 판정) |
| Stateside | 서버(Render) | 335 | 82% | 혼용률 275/335(82%) · 11/25 야간 실측(규칙 판정) |
| Sundry | 서버(Render) | 246 | 96% | 혼용률 235/246(96%) · 11/25 야간 실측(규칙 판정) |
| Sweaty betty | 헤드리스(Actions) | 405 | 95% | 혼용률 385/405(95%) — 오늘 impit 2/2 · site-api 0/2 · wayback 1/2 · playwright 2/2 · firefox 2/2 · 11/25 야간 실측(규칙 판정) |
| The Great | 서버(Render) | 240 | 97% | 혼용률 233/240(97%) · 11/25 야간 실측(규칙 판정) |
| Theory | 크롬 확장(집 PC) | 379 | 96% | 혼용률 365/379(96%) 확장 몫 — 오늘 impit 0/3 · playwright 0/3 · firefox 0/3 · 측정·판정 |
| Thread & supply | 서버(Render) | 258 | 97% | 혼용률 250/258(97%) · 11/25 야간 실측(규칙 판정) |
| Tuckernuck | 서버(Render) | 376 | 88% | 혼용률 330/376(88%) · 11/25 야간 실측(규칙 판정) |
| Ulla Johnson | 서버(Render) | 307 | 97% | 혼용률 297/307(97%) · 11/25 야간 실측(규칙 판정) |
| Vanessa bruno | 서버(Render) | 58 | 95% | 혼용률 55/58(95%) · 11/25 야간 실측(규칙 판정) |
| Varley | 서버(Render) | 285 | 97% | 혼용률 277/285(97%) · 11/25 야간 실측(규칙 판정) |
| Velvet | 서버(Render) | 352 | 100% | 혼용률 351/352(100%) · 11/25 야간 실측(규칙 판정) |
| Veronica Beard | 서버(Render) | 375 | 93% | 혼용률 347/375(93%) · 11/25 야간 실측(규칙 판정) |
| Vince | 서버(Render) | 381 | 99% | 혼용률 376/381(99%) · 11/25 야간 실측(규칙 판정) |
| vineyardvines | 서버(Render) | 560 | 98% | 혼용률 551/560(98%) · 11/25 야간 실측(규칙 판정) |
| Vuori | 서버(Render) | 219 | 94% | 혼용률 206/219(94%) · 11/25 야간 실측(규칙 판정) |
| Whistles | 서버(Render) | 217 | 94% | 혼용률 205/217(94%) · 11/25 야간 실측(규칙 판정) |
| Wrap | 헤드리스(Actions) | 374 | 90% | 혼용률 336/374(90%) — 오늘 impit 1/2 · site-api 0/2 · wayback 0/2 · playwright 1/2 · firefox 1/2 · 11/25 야간 실측(규칙 판정) |
| Xirena | 서버(Render) | 333 | 96% | 혼용률 320/333(96%) · 11/25 야간 실측(규칙 판정) |
| Z Supply | 서버(Render) | 216 | 100% | 혼용률 216/216(100%) · 11/25 야간 실측(규칙 판정) |
| Zara | 서버(Render) | 499 | 0% | 파이어폭스 보강 11/25 04:10 120/120 · 오늘 파이어폭스 3/3. 엑셀 채움률(11/25 03:39) 0% 는 그 직전 숫자 — 채우는 중 — 오늘 impit 0/6 · site-api 0/3 · wayback 0/3 · playwright 0/6 · firefox 6/6 · 측정·판정 |

### 🏠 집 IP(확장)에서만 — 5개 브랜드 · 상품 1,510개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| &Other Stories | 크롬 확장(집 PC) | 343 | 상품 페이지는 Akamai 가 모든 엔진 차단(파이어폭스는 200 확인 화면) · 보관본 없음 | 혼용률 143/343 은 확장 몫 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) | 확장 탭 보강 유지. 데이터센터 무료 길 없음 → 유료(Akamai 대응) 시험 대상 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| Abercrombie & Fitch | 크롬 확장(집 PC) | 214 | 같은 확인 화면 | 혼용률 136/214 확장 몫 · 보관본 없음 — 오늘 impit 0/6(blocked) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/6(blocked 418) · firefox 0/6(blocked) | 확장 탭 보강 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| Aritzia | 크롬 확장(집 PC) | 800 | Cloudflare — impit·크롬 403 · 파이어폭스는 러너마다 3개 중 0~1개 · 보관본은 사이트 공통 문구 때문에 거부 | 혼용률 501/800 확장 몫 — 오늘 impit 0/9(blocked 403) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/9(blocked 403) · firefox 2/9(blocked·geo 403) · firefox-fresh 1/3(blocked 403) | 확장 탭 보강 | 2 집 IP 필요(확장) | 측정·판정 · 실행 3회 |
| Mango | 크롬 확장(집 PC) | 93 | Vercel 확인 화면 — 모든 엔진 · 파이어폭스 보강 11/25 39/39 차단 | 혼용률 54/93 확장 몫 — 오늘 impit 0/6(blocked 429) · site-api 0/3(error) · wayback 1/3(no-archive) · playwright 0/6(blocked 429) · firefox 0/6(blocked 429) | 확장 탭 보강 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| Paige | 크롬 확장(집 PC) | 60 | Vercel 확인 화면 — 모든 엔진 | 혼용률 38/60 확장 몫 — 오늘 impit 0/6(blocked 429) · site-api 0/3(rate-limit 429) · wayback 0/3(no-archive) · playwright 0/6(blocked 429) · firefox 0/6(blocked 429) | 확장 탭 보강 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |

### 🟠 일부만 — 20개 브랜드 · 상품 6,360개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| Arket | 크롬 확장(집 PC) | 285 | 상품 페이지는 Akamai 가 모든 엔진 차단 · 웹 아카이브는 3/3 읽음 | 혼용률 143/285 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 3/3 · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) | 야간 보강의 웹 아카이브 층을 Arket 에 돌리기(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 2회 |
| Buck Mason | 서버(Render) | 119 | 접근 문제 없음 — 오늘 impit·크롬·파이어폭스·아카이브 3/3 | 혼용률 57/119 — 오늘 impit 3/3 · site-api 0/3(dead 404) · wayback 3/3 · playwright 3/3 · firefox 3/3 | 야간 보강이 아직 못 돎/5일 재시도 제한(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Chico's | 서버(Render) | 800 | Akamai — 러너(IP)에 따라 갈림: 파이어폭스가 두 러너에서 0/3·0/3, 다른 러너에서 3/3(새 창도 3/3) · 크롬·impit 은 늘 403 · 보관본 1/3 | 혼용률 0/800 — 지금은 상품 보강 대상에 없음 — 오늘 impit 0/9(blocked 403) · site-api 0/3(error) · wayback 1/3(no-archive) · playwright 0/9(blocked 403) · firefox 3/9(blocked 403) · firefox-fresh 3/3 | 파이어폭스 보강 대상에 넣고 막히면 다음 실행에 다시(무료, 러너 운) · 안정적으로는 확장 또는 유료 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 3회 |
| Coldwatercreek | 헤드리스(Actions) | 200 | 평 HTML 은 Cloudflare 403 · 크롬·파이어폭스 2/3 혼용률 읽음 — 그런데 11/25 파이어폭스 보강은 120개 중 118개를 '사이트 미표기'로 적음(표본과 엇갈림) | 혼용률 66/200 — 오늘 impit 0/3(blocked 403) · site-api 0/3(error) · wayback 0/3(no-comp·no-archive) · playwright 2/3(no-comp) · firefox 2/3(no-comp) | 보강의 미표기 판정을 표본으로 재확인(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Dickies | 서버(Render) | 260 | 접근 문제 없음 — 오늘 impit·크롬·파이어폭스 3/3 | 혼용률 144/260 — 오늘 impit 3/3 · site-api 1/3(geo) · wayback 0/3(no-archive) · playwright 3/3 · firefox 3/3 | 야간 보강이 아직 다 못 돎(무료 — 대상·상한 조정) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Everlane | 서버(Render) | 443 | 접근 문제 없음 — 오늘 모든 엔진 3/3(사이트 JSON 포함) | 혼용률 296/443 — 오늘 impit 3/3 · site-api 3/3 · wayback 1/3(no-archive) · playwright 3/3 · firefox 3/3 | 야간 보강 대상·상한(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Free People | 크롬 확장(집 PC) | 190 | DataDome — 페이지는 모든 엔진 403 · 웹 아카이브 2/3 | 혼용률 9/190 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 2/3(no-archive) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) | 웹 아카이브 층(11/24 측정 적중 50%)을 계속 돌리기 — 무료 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 2회 |
| Garnet hill | 크롬 확장(집 PC) | 108 | Akamai — 크롬 403 · 파이어폭스 새 창은 열리지만 혼용률 글이 없음(3/3 열림 · 0/3 읽음) · 평 HTML 껍데기 | 혼용률 2/108 — 오늘 impit 0/9(no-comp) · site-api 0/3(error) · wayback 0/3(no-comp) · playwright 0/9(blocked 403) · firefox 0/9(no-comp·blocked 403) · firefox-fresh 0/3(no-comp) | 열린 페이지에서 왜 소재가 안 읽히는지 덤프로 확인(DUMP=1) — 무료 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 3회 |
| J crew | 헤드리스(Actions) | 215 | 야간 fetch 는 '직접차단' 12 · 오늘 크롬·파이어폭스 3/3 읽음 | 혼용률 63/215 — 오늘 impit 1/3(no-comp) · site-api 0/3(error) · wayback 1/3(no-archive) · playwright 3/3 · firefox 3/3 | 크롬 보강(enrich-browser) 대상에 넣기(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Joules | 크롬 확장(집 PC) | 459 | Akamai — 페이지는 모든 엔진 403 · 웹 아카이브만 일부(11/25 야간 15개) | 혼용률 0~15/459 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 1/3(no-archive) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) | 웹 아카이브 층 계속 · 나머지는 확장 탭 보강 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| Loft | 크롬 확장(집 PC) | 673 | 브라우저는 PerimeterX · 평 HTML 은 열리나 오늘 표본 3개에서 혼용률 못 찾음(JSON-LD 에 있는 상품만 읽힘) | 혼용률 284/673(42%) — 오늘 impit 0/3(geo) · site-api 0/3(error) · wayback 0/3(no-comp·no-archive) · playwright 0/3(blocked) · firefox 0/3(blocked) | 평 HTML + JSON-LD 로 야간 보강(무료) — 나머지는 확장 탭 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Mint velvet | 서버(Render) | 416 | 접근 문제 없음 — impit·크롬·파이어폭스 3/3 | 혼용률 293/416 — 오늘 impit 3/3 · site-api 0/3(no-comp) · wayback 0/3(no-archive) · playwright 3/3 · firefox 3/3 | 야간 보강 대상·상한(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Patagonia | 크롬 확장(집 PC) | 168 | 같은 점검 화면 · 파이어폭스 2/3 읽음 · 보관본 1/3 | 혼용률 4/168 — 오늘 impit 0/6(maintenance) · site-api 0/3(error) · wayback 1/3(no-archive) · playwright 0/6(maintenance) · firefox 4/6(maintenance) | 파이어폭스 보강을 Patagonia 에 — 11/24 측정 16/20 읽음(무료, 러너마다 갈림) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 2회 |
| Poetry | 헤드리스(Actions) | 303 | 접근 문제 없음 — 오늘 impit·크롬·파이어폭스 3/3 | 혼용률 240/303 — 오늘 impit 3/3 · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 3/3 · firefox 3/3 | 야간 보강(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Reformation | 서버(Render) | 753 | Cloudflare — impit·사이트 JSON 403 · 크롬 2회 모두 3/3 · 파이어폭스 새 창 3/3 · 웹 아카이브 3/3 | 혼용률 261/753 — 오늘 impit 0/9(blocked 403) · site-api 0/3(blocked 403) · wayback 3/3 · playwright 9/9 · firefox 3/9(blocked 403) · firefox-fresh 3/3 | 크롬 보강 + 웹 아카이브(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 3회 |
| Spanx | 서버(Render) | 84 | 접근 문제 없음 — impit·크롬·파이어폭스 3/3 | 혼용률 66/84 — 오늘 impit 3/3 · site-api 0/3(dead 404) · wayback 2/3(error) · playwright 3/3 · firefox 3/3 | 야간 보강(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| The upside | 헤드리스(Actions) | 429 | Cloudflare — 한 창으로 이어 열면 첫 페이지만 · 페이지마다 새 창이면 3/3(1회) | 혼용률 322/429 — 오늘 impit 0/9(blocked 403) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 3/9(blocked 403) · firefox 4/9(blocked 403) · firefox-fresh 3/3 | 크롬 보강을 파이어폭스 + 페이지마다 새 창으로(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 3회 |
| WHBM | 서버(Render) | 219 | Akamai — 러너에 따라 갈림: 파이어폭스 2/3·0/3·3/3 · 크롬·impit 403 · 보관본 2/3 | 혼용률 75/219 — 오늘 impit 0/9(blocked 403) · site-api 0/3(error) · wayback 2/3(no-archive) · playwright 0/9(blocked 403) · firefox 5/9(blocked 403) · firefox-fresh 3/3 | 파이어폭스 보강 + 웹 아카이브(무료, 러너마다 갈림) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 3회 |
| Whitestuff | 서버(Render) | 184 | 야간 보강의 직접 fetch 가 76개 '직접차단' · 오늘 impit·크롬·파이어폭스 3/3 읽음 | 혼용률 143/184 — 오늘 impit 3/3 · site-api 0/3(error) · wayback 0/3(error) · playwright 3/3 · firefox 3/3 | 야간 보강 fetch 를 impit 류로(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Wilson | 크롬 확장(집 PC) | 52 | 접근 문제 없음 — 오늘 모든 엔진 3/3 읽음. 아직 보강이 안 돈 것 | 혼용률 28/52 — 오늘 impit 3/3 · site-api 0/3(geo) · wayback 2/3(error) · playwright 3/3 · firefox 3/3 | 야간 보강 대상에 넣기(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |

### ⛔ 어디서도 막힘 — 9개 브랜드 · 상품 2,685개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| Addidas | 크롬 확장(집 PC) | 408 | Akamai — 모든 엔진 403, 보관본 거의 없음(11/25 성공 2) | 혼용률 4/408 — 확장 탭 보강도 아직 못 채움 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/6(blocked·timeout 403) · firefox 0/6(blocked 403) | 확장 탭 보강을 adidas 에 돌리기(집 IP) 또는 유료 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| Anthropologie | 크롬 확장(집 PC) | 270 | DataDome — 모든 엔진 403 · 보관본 없음 | 혼용률 4/270 — 오늘 impit 0/9(blocked 403) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/9(blocked 403) · firefox 0/9(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 탭 보강(집 IP) 또는 유료 | 2 집 IP 필요(확장) | 측정·판정 · 실행 3회 |
| Fatface | 크롬 확장(집 PC) | 374 | Akamai — 모든 엔진 403 · 보관본 없음 | 혼용률 0/374 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) | 확장 탭 보강을 Fatface 에 돌리기 또는 유료 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| FP Movement | 크롬 확장(집 PC) | 58 | DataDome · 카탈로그가 대부분 카테고리 주소 | 혼용률 6/58 — 오늘 impit 0/1(no-comp) · site-api 0/1(error) · wayback 0/1(no-comp) · playwright 0/1(no-comp) · firefox 0/1(no-comp) | 목록부터 바로잡기 | 2 집 IP 필요(확장) | 측정·판정 · 실행 1회 |
| H&M | 크롬 확장(집 PC) | 744 | 상품 페이지는 Akamai 가 모든 엔진 403(파이어폭스 포함) · 보관본 없음 | 혼용률 0/744 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) | 확장 탭 보강(집 IP) 또는 유료(Akamai 대응) | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| Lululemon | 크롬 확장(집 PC) | 476 | Akamai — 모든 엔진 · 보관본 거의 없음(11/24 적중 4%) | 혼용률 0/476 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 1/3(no-comp·no-archive) · playwright 0/6(timeout) · firefox 0/6(blocked 403) | 확장 탭 보강 또는 유료 | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| Prana | 서버(Render) | 81 | Cloudflare — 브라우저는 첫 페이지만 · 파이어폭스 보강 11/25 77/81 차단 | 혼용률 0/81 — 오늘 impit 0/9(blocked 403) · site-api 0/3(error) · wayback 1/3(no-archive) · playwright 2/9(blocked 403) · firefox 2/9(blocked 403) · firefox-fresh 0/3(blocked 403) | 확장 또는 유료 | 2 집 IP 필요(확장) | 측정·판정 · 실행 3회 |
| Sezane | 크롬 확장(집 PC) | 206 | DataDome — 모든 엔진 · 보관본 일부(11/24 거부 다수) | 혼용률 2/206 — 오늘 impit 0/6(blocked 403) · site-api 0/3(error) · wayback 1/3(no-archive) · playwright 0/6(blocked 403) · firefox 0/6(blocked 403) | 확장 탭 보강 또는 유료(DataDome 대응) | 2 집 IP 필요(확장) | 측정·판정 · 실행 2회 |
| The white company | 크롬 확장(집 PC) | 68 | 같은 지역 이동 — 데이터센터 모든 엔진 · 파이어폭스 보강 11/25 63/68 차단 | 혼용률 0/68 — 오늘 impit 0/6(geo) · site-api 0/3(error) · wayback 0/3(no-comp) · playwright 0/6(geo·dead 404) · firefox 0/6(geo·dead 404) | 영국 지역으로 열기(추정) 또는 확장 탭 보강 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 2회 |

### 🔧 열리는데 잘못 읽음 — 8개 브랜드 · 상품 867개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| Athleta | 크롬 확장(집 PC) | 1 | 카탈로그에 상품이 없음(목록 문제) | 상품 1개 |  | 1 무료 변경(우리 쪽) | 측정·판정 |
| Banana Republic | 크롬 확장(집 PC) | 1 | 카탈로그에 상품이 없음 | 상품 1개 |  | 1 무료 변경(우리 쪽) | 측정·판정 |
| Carlhartt | 헤드리스(Actions) | 148 | 카탈로그 표본 3개 중 2개가 카테고리 페이지라 혼용률 없음 | 혼용률 108/148 — 오늘 impit 1/3(no-comp) · site-api 0/3(error) · wayback 1/3(no-comp·no-archive) · playwright 1/3(no-comp) · firefox 1/3(no-comp) | 목록부터 바로잡기 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 1회 |
| Gap | 크롬 확장(집 PC) | 6 | 카탈로그 6개가 전부 기획전 배너 |  |  | 1 무료 변경(우리 쪽) | 측정·판정 |
| Massimo Dutti | 크롬 확장(집 PC) | 603 | 파이어폭스로 열리지만 혼용률이 스크립트 JSON(material/percentage)에만 있어 1/3 만 읽힘 · 크롬·평 HTML 차단 | 혼용률 1/603 — 오늘 impit 0/6(blocked) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 0/6(blocked 403) · firefox 2/6(no-comp) | 페이지 속 JSON 의 material·percentage 짝을 읽도록 추출기 보완(무료) | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 2회 |
| Old Navy | 크롬 확장(집 PC) | 7 | 카탈로그 7개가 전부 배너 |  |  | 1 무료 변경(우리 쪽) | 측정·판정 |
| Oysho | 크롬 확장(집 PC) | 20 | 카탈로그에 상품이 없음 |  |  | 1 무료 변경(우리 쪽) | 측정·판정 |
| Sessun | 서버(Render) | 81 | 카탈로그의 '상품 주소' 일부가 이미지 파일(404). 진짜 상품 주소(us.sessun.com/catalogue/…html)는 모든 엔진이 혼용률까지 읽음(2/2) | 혼용률 34/81 — 오늘 impit 2/8(dead·blocked 404/503) · site-api 0/3(error) · wayback 0/3(no-archive) · playwright 2/8(dead 404) · firefox 2/8(dead 404) · firefox-fresh 2/2 | 목록부터 바로잡기 | 1 무료 변경(우리 쪽) | 측정·판정 · 실행 3회 |

### 📭 사이트가 혼용률을 안 적음 — 1개 브랜드 · 상품 232개

| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |
|---|---|---:|---|---|---|---|---|
| rouje | 서버(Render) | 232 | 페이지는 모든 엔진으로 열리는데 혼용률 글이 없음(표본 3개) · 사이트 JSON(.json)은 꺼져 있음(404) | 혼용률 149/232 — 일부 상품만 적힘 — 오늘 impit 0/3(no-comp) · site-api 0/3(dead 404) · wayback 0/3(no-archive) · playwright 0/3(no-comp) · firefox 0/3(no-comp) | 없음(사이트가 안 적음) — 엑셀 '정보 없음' | 0 이미 정상 | 측정·판정 · 실행 1회 |


## 6. 유료 서비스 시험 칸

`scripts/try-engines.mjs` 에 업체 중립 엔진 `ext:<이름>` 을 넣었다. 업체 이름·주소·키는 저장소에 없다 — 실행할 때
저장소 비밀 **`SCRAPE_API_CONFIG`** 로만 들어온다. 비밀이 없으면 그 엔진은 조용히 빠진다(지금 상태).

담당자가 할 일:

1. GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret
2. 이름 `SCRAPE_API_CONFIG`, 값은 아래 모양의 JSON 한 줄(서비스 둘 이상을 견주려면 배열 `[ {...}, {...} ]`):

```json
{
  "name": "trial-a",
  "request": "https://<서비스 API 주소>?api_key={key}&url={url}",
  "method": "GET",
  "params": { "<서비스 옵션 이름>": "<값>" },
  "headers": {},
  "key": "<서비스가 준 키>",
  "html": "body",
  "upstreamStatus": "",
  "success": { "status": [200] },
  "timeoutSec": 120,
  "maxRequests": 100,
  "gapMs": 1000
}
```

- `{url}` 자리에 대상 주소가 인코딩돼 들어간다(`{url_raw}` = 그대로). `{key}` 는 `request`·`headers`·`params`·`body` 어디에 써도 된다.
- 키를 헤더로 받는 서비스: `"headers": { "<헤더 이름>": "{key}" }`. POST 로 받는 서비스: `"method": "POST", "body": { "url": "{url_raw}" }`.
- 응답이 JSON 으로 HTML 을 감싸 주면 `"html": "json:<점 경로>"`(예: `json:data.html`), 대상 사이트의 상태 코드를 따로 주면
  `"upstreamStatus": "header:<헤더 이름>"` 또는 `"json:<점 경로>"`.
- `name` 은 리포트 열 제목(`ext:trial-a`)이 된다 — 업체 이름일 필요 없다. `maxRequests` 로 한 번 실행의 요청 수(=비용)를 묶는다.
- 키·키가 든 헤더 값·API 호스트는 로그에서 가려지고(GitHub `add-mask`), 리포트·결과 JSON 에서는 `***` 로 바뀐다.
  결과에는 대상 주소와 판정만 남는다. 가짜 API 로 시험: `node scripts/test-access-evidence.mjs`.

시험 한 번: Actions → Diagnose stuck pages → Run workflow, 브랜치 `claude/dv-visibility-cross-device-igprlf`,
mode `engines`, urls `access-measure/targets-blocked.json`, engines `impit,firefox,ext`(유료 열만 보려면 `ext`).
리포트 `try-engines-report-<실행>.md` 에 무료 엔진 열 옆에 `ext:<이름>` 열이 나온다. `targets-blocked.json` 은 지금 무료로는
안 되는 목록·상품 주소만 모은 것이다(§7).

## 7. 측정 방법과 한계

- 모든 측정은 GitHub Actions 러너(미국 데이터센터 IP)에서 읽기만 했다. Worker 에 아무것도 쓰지 않았다(엔진 비교 도구는 저장 코드가 없다).
- 사이트당 요청은 엔진마다 URL 3~5개, 같은 사이트 연속 요청은 1.5초 이상 띄웠다. 로그인·확인 화면 풀기는 하지 않았다.
- 같은 URL 을 서로 다른 러너(IP)에서 2회 이상 쟀다. 목록 URL 623개 전부는 impit 으로 2회(서로 다른 IP) — 두 번의 판정이 623개 모두 같았다.
  막힌·이상한 브랜드의 목록 URL 166개는 크롬·파이어폭스로 2회, 상품은 브랜드당 3개를 1~2회.
- camoufox(탐지 회피용 파이어폭스)는 이번에도 모든 실행에서 시작하자마자 죽었다(SIGSEGV) — 결과 없음, 표에서 뺐다.
- 데이터센터 결과는 러너마다 갈릴 수 있다(11/24 Chico's 상품 12/20 → 0/20). 한 번만 잰 칸은 표의 '실행 N회'로 보인다.
- 서버(Render) 경고의 'reader fallback failed (HTTP 429)' 는 서버가 쓰는 외부 리더 프록시의 한도다 — 사이트 차단 근거로 세지 않았다.
- 집 IP(확장) 쪽은 오늘 새로 재지 않았다. 확장 담당 브랜드의 '확장에서 된다'는 카탈로그의 URL 별 저장 수와 갱신 시각(11/25)이 근거다.
- '페이지 넘김 의심' 같은 원인은 표에 (추정)으로 적었다 — 측정은 '차단 없음'까지만 말한다.

<details><summary>목록 URL 별 측정 — 한 엔진이라도 실패한 URL 293개(칸: 성공/잰 횟수 · 실패 원인 · HTTP)</summary>

| 브랜드 | 카테고리 | URL | impit | playwright | firefox | firefox-fresh | server |
|---|---|---|---|---|---|---|---|
| &Other Stories | tops | stories.com/en-us/clothing/tops/ | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| &Other Stories | sweatshirts | stories.com/en-us/clothing/tops/sweatshirts-hoodies/ | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| &Other Stories | shirts | stories.com/en-us/clothing/blouses-shirts/ | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Abercrombie & Fitch | tops | abercrombie.com/shop/wd/womens-tees-and-tanks-tops?pagefm=navigation-left+nav | 0/4 blocked | 0/2 blocked 418 | 0/2 blocked | 0/1 blocked | – |
| Abercrombie & Fitch | tops | abercrombie.com/shop/wd/womens-camis-and-tank-tops-tops?pagefm=navigation-left+n | 0/4 blocked | 0/2 blocked 418 | 0/2 blocked | 0/1 blocked | – |
| Abercrombie & Fitch | sweatshirts | abercrombie.com/shop/wd/womens-hoodies-and-sweatshirts-tops?pagefm=navigation-le | 0/4 blocked | 0/2 blocked 418 | 0/2 blocked | 0/1 blocked | – |
| Abercrombie & Fitch | shirts | abercrombie.com/shop/wd/womens-shirts-and-blouses-tops?pagefm=navigation-left+na | 0/2 blocked | – | – | – | – |
| Abercrombie & Fitch | dresses | abercrombie.com/shop/wd/womens-dresses-and-jumpsuits | 0/2 blocked | – | – | – | – |
| Abercrombie & Fitch | pants | abercrombie.com/shop/wd/womens-sweatpants-and-joggers-bottoms?pagefm=navigation- | 0/2 blocked | – | – | – | – |
| Addidas | tops | adidas.com/us/women-tops?sort=newest-to-oldest | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Addidas | sweatshirts | adidas.com/us/women-hoodies_sweatshirts | 0/4 blocked 403 | 0/2 blocked·conn-drop 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Addidas | dresses | adidas.com/us/women-skirts_dresses | 0/4 blocked 403 | 0/2 blocked·conn-drop 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Addidas | pants | adidas.com/us/women-pants | 0/2 blocked 403 | – | – | – | – |
| Alo | tops | aloyoga.com/collections/tops | 0/2 blocked 403 | – | – | – | – |
| Alo | sweatshirts | aloyoga.com/collections/womens-sweatshirts-hoodies | 0/2 blocked 403 | – | – | – | – |
| Alo | dresses | aloyoga.com/collections/dresses | 0/2 blocked 403 | – | – | – | – |
| Alo | pants | aloyoga.com/collections/sweatpants | 0/2 blocked 403 | – | – | – | – |
| Ann Taylor | tops | anntaylor.com/clothing/tops-and-blouses/cata000010/ | 4/4 | 2/2 | 0/2 blocked | 0/1 blocked | – |
| Ann Taylor | dresses | anntaylor.com/clothing/dresses/cata000012/ | 4/4 | 0/2 blocked | 0/2 blocked | 0/1 blocked | – |
| Ann Taylor | pants | anntaylor.com/clothing/pants/cata000014/ | 4/4 | 0/2 blocked | 0/2 blocked | 0/1 blocked | – |
| Anthropologie | tops | anthropologie.com/tees | 0/4 blocked 403 | 0/2 blocked 403 | 2/2 | 0/1 blocked 403 | – |
| Anthropologie | sweatshirts | anthropologie.com/tops-sweatshirts | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Anthropologie | shirts | anthropologie.com/tops | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Anthropologie | dresses | anthropologie.com/dresses | 0/2 blocked 403 | – | – | – | – |
| Anthropologie | pants | anthropologie.com/bottoms | 0/2 blocked 403 | – | – | – | – |
| Apiece Apart | tops | apieceapart.com/shop/tops | 0/2 shell | – | – | – | – |
| Apiece Apart | dresses | apieceapart.com/shop/dresses | 0/2 shell | – | – | – | – |
| Apiece Apart | pants | apieceapart.com/shop/pants | 0/2 shell | – | – | – | – |
| Aritzia | tops | aritzia.com/us/en/clothing/tops | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Aritzia | tops | aritzia.com/us/en/clothing/tshirts | 0/4 blocked 403 | 0/2 blocked 403 | 2/2 | 0/1 blocked 403 | – |
| Aritzia | sweatshirts | aritzia.com/us/en/clothing/sweatsuit-sets?lastViewed=74 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Aritzia | shirts | aritzia.com/us/en/clothing/shirts-blouses | 0/2 blocked 403 | – | – | – | – |
| Aritzia | dresses | aritzia.com/us/en/clothing/dresses-3 | 0/2 blocked 403 | – | – | – | – |
| Aritzia | pants | aritzia.com/us/en/clothing/sweatsuit-sets/sweat-pants | 0/2 blocked 403 | – | – | – | – |
| Arket | tops | arket.com/en-ww/women/clothing/tops/ | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Arket | tops | arket.com/en-ww/women/clothing/tops/t-shirts/ | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Arket | sweatshirts | arket.com/en-ww/women/clothing/sweatshirts-and-hoodies/ | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Athleta | tops | athleta.gap.com/browse/tops/all-tops?cid=1032080&nav=meganav%3ATops%3ACategories | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Athleta | sweatshirts | athleta.gap.com/browse/tops/sweatshirts-and-wraps?cid=1005761&nav=meganav%3ATops | 0/4 no-cards | 0/2 no-cards | 2/2 | 1/1 | – |
| Athleta | dresses | athleta.gap.com/browse/dresses-and-jumpsuits/all-dresses-and-jumpsuits?cid=89745 | 0/4 no-cards | 0/2 no-cards | 2/2 | 1/1 | – |
| Athleta | pants | athleta.gap.com/browse/bottoms/all-bottoms?cid=1025878&mlink=1%2C1%2CMeganav_2&n | 0/4 no-cards | 1/2 no-cards | 2/2 | 1/1 | – |
| Banana Republic | tops | bananarepublic.gap.com/browse/women/t-shirts?cid=1055063&nav=meganav%3AWOMEN%3AW | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Banana Republic | tops | bananarepublic.gap.com/browse/women/tops-and-blouses?cid=5037&nav=meganav%3AWOME | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Banana Republic | dresses | bananarepublic.gap.com/browse/women/dresses-and-jumpsuits?cid=69883&nav=meganav% | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Banana Republic | pants | bananarepublic.gap.com/browse/women/pants?cid=67595&nav=meganav%3AWOMEN%3AWOMEN% | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Bash | tops | ba-sh.com/fr/en/t-shirts/?_gl=1*18k9v40*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0MDE | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 shell |
| Bash | sweatshirts | ba-sh.com/fr/en/sweatshirts/?_gl=1*6lpw8g*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0M | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 shell |
| Bash | shirts | ba-sh.com/fr/en/tops-shirts/?_gl=1*wv5ete*_up*MQ..*_ga*MTY2MjMwMDkxNC4xNzgzMzA0M | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 shell |
| Boldest | tops | kolonmall.com/boldest/List/133020162237 | 0/2 shell | – | – | – | – |
| Boldest | pants | kolonmall.com/boldest/List/133020161437 | 0/2 shell | – | – | – | – |
| Carlhartt | pants | carhartt.com/en-eu/c/women/trousers-jeans/sweatpants/euw3000017 | 0/2 no-cards | – | – | – | – |
| Chico's | tops | chicos.com/store/category/tees-tanks/cat11199293 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| Chico's | sweatshirts | chicos.com/store/category/activewear/cat20059281 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| Chico's | shirts | chicos.com/store/category/blouses-shirts/cat11199294 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 0/2 blocked 403 |
| Chico's | dresses | chicos.com/store/category/dresses/cat40004 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| Chico's | pants | chicos.com/store/category/pants/cat8289646 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 0/2 shell 403 |
| Citizens of Humanity | dresses | citizensofhumanity.com/collections/dresses-jumpsuits | 0/2 no-cards | – | – | – | – |
| Coldwatercreek | tops | coldwatercreek.com/clothing/knit-tops-tees | 0/2 blocked 403 | – | – | – | – |
| Coldwatercreek | sweatshirts | coldwatercreek.com/clothing/sweatshirts | 0/2 blocked 403 | – | – | – | – |
| Coldwatercreek | shirts | coldwatercreek.com/clothing/shirts-blouses | 0/2 blocked 403 | – | – | – | – |
| Coldwatercreek | dresses | coldwatercreek.com/clothing/dresses | 0/2 blocked 403 | – | – | – | – |
| Coldwatercreek | pants | coldwatercreek.com/clothing/pants-shorts | 0/2 blocked 403 | – | – | – | – |
| Dickies | tops | dickies.com/collections/womens-tops | 4/4 | 2/2 | 1/2 blocked 403 | 1/1 | 2/2 |
| Dickies | shirts | dickies.com/en-us/collections/womens-shirt-jackets | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 shell |
| Dickies | dresses | dickies.com/collections/womens-skirts-dresses | 2/2 | – | – | – | 0/2 shell |
| Eileen fisher | tops | eileenfisher.com/shop/clothing/tops-tees | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Eileen fisher | tops | eileenfisher.com/shop/clothing/tanks-camis | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Eileen fisher | dresses | eileenfisher.com/shop/clothing/dresses-skirts | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Eileen fisher | pants | eileenfisher.com/shop/clothing/pants-jumpsuits | 0/2 blocked 403 | – | – | – | – |
| Everlane | sweatshirts | everlane.com/collections/womens-active-lounge?__cf_chl_f_tk=Q8ynDAoxucPAizM7arSD | 0/2 no-cards | – | – | – | – |
| Everlane | shirts | everlane.com/collections/womens-tops | 0/2 no-cards | – | – | – | – |
| Everlane | dresses | everlane.com/collections/womens-dresses | 0/2 no-cards | – | – | – | – |
| Fatface | tops | fatface.com/shop/womens/clothing/tops/t-shirts | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Fatface | sweatshirts | fatface.com/shop/womens/clothing/sweatshirts-and-hoodies | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Fatface | dresses | fatface.com/shop/womens/clothing/dresses | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Fatface | pants | fatface.com/shop/womens/clothing/all-trousers | 0/2 blocked 403 | – | – | – | – |
| FP Movement | tops | freepeople.com/fpmovement/workout-tops/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| FP Movement | sweatshirts | freepeople.com/fpmovement/hoodies-sweatshirts/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| FP Movement | dresses | freepeople.com/fpmovement/one-pieces/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| FP Movement | pants | freepeople.com/fpmovement/workout-bottoms/ | 0/2 blocked 403 | – | – | – | – |
| Free People | tops | freepeople.com/tops/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Free People | sweatshirts | freepeople.com/sweatshirts-pullovers/?vis_nav=4 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Free People | shirts | freepeople.com/blouses/?feature-product-ids=FP-109929869-000&topper=2 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Free People | dresses | freepeople.com/dresses/ | 0/2 blocked 403 | – | – | – | – |
| Free People | pants | freepeople.com/pants/ | 0/2 blocked 403 | – | – | – | – |
| Gap | tops | gap.com/browse/women/t-shirts-and-tanks?cid=17076&nav=meganav%3AWomen%3ACategori | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Gap | sweatshirts | gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=meganav%3AWomen% | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Gap | dresses | gap.com/browse/women/dresses?cid=13658&nav=meganav%3AWomen%3ACategories%3ADresse | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Gap | pants | gap.com/browse/women/sweatshirts-and-sweatpants?cid=1041168&nav=meganav%3AWomen% | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Garnet hill | tops | garnethill.com/clothing/categories/tops-tees/ | 0/4 shell | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Garnet hill | shirts | garnethill.com/clothing/categories/tops-tees/facet/f_style_uFilter/Shirts__sp__a | 0/4 shell | 0/2 blocked 403 | 0/2 blocked 403 | 1/1 | – |
| Garnet hill | dresses | garnethill.com/clothing/categories/dresses/ | 0/4 shell | 0/2 blocked 403 | 0/2 blocked 403 | 1/1 | – |
| Garnet hill | pants | garnethill.com/clothing/categories/pants/ | 0/2 shell | – | – | – | – |
| Good American | tops | goodamerican.com/en-kr/collections/tees-tanks | 0/4 geo | 2/2 | 1/2 blocked 403 | 0/1 blocked 403 | 1/2 rate-limit 429 |
| Good American | sweatshirts | goodamerican.com/collections/jeanius-sweats | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 2/2 |
| Good American | shirts | goodamerican.com/en-kr/collections/womens-tops | 0/4 geo | 2/2 | 2/2 | 1/1 | 0/2 rate-limit 429 |
| Good American | dresses | goodamerican.com/en-kr/collections/dresses | 2/2 | – | – | – | 0/2 rate-limit 429 |
| Good American | pants | goodamerican.com/en-kr/collections/bottoms | 0/2 geo | – | – | – | 1/2 rate-limit 429 |
| H&M | tops | www2.hm.com/en_us/women/products/tops.html?sort=newProduct | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| H&M | sweatshirts | www2.hm.com/en_us/women/products/hoodies-sweatshirts.html?sort=newProduct | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| H&M | shirts | www2.hm.com/en_us/women/products/shirts-blouses.html?sort=newProduct | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| J crew | tops | jcrew.com/plp/womens/categories/clothing/tees-and-tanks | 0/2 no-cards | – | – | – | – |
| J crew | sweatshirts | jcrew.com/plp/womens/categories/clothing/sweatshirts-and-sweatpants | 0/2 no-cards | – | – | – | – |
| J crew | shirts | jcrew.com/plp/womens/categories/clothing/shirts-and-tops | 0/2 no-cards | – | – | – | – |
| J crew | dresses | jcrew.com/plp/womens/categories/clothing/dresses-and-jumpsuits | 0/2 no-cards | – | – | – | – |
| J crew | pants | jcrew.com/plp/womens/categories/clothing/pants | 0/2 no-cards | – | – | – | – |
| Jager | tops | marksandspencer.com/l/brands/jaeger/fs5/t-shirts-3?filter=Categories%253DSubCate | 0/2 no-cards | – | – | – | – |
| Jager | tops | marksandspencer.com/l/brands/jaeger?filter=Categories%253DSubCategory_28994397%7 | 0/2 no-cards | – | – | – | – |
| Jager | sweatshirts | marksandspencer.com/l/women/knitwear/fs5/summer | 0/2 no-cards | – | – | – | – |
| Jager | dresses | marksandspencer.com/l/brands/jaeger?filter=Categories%253DSubCategory_28994397%7 | 0/2 no-cards | – | – | – | – |
| Jager | pants | marksandspencer.com/l/women/jeans | 0/2 no-cards | – | – | – | – |
| James Perse | tops | jamesperse.com/collections/womens-t-shirts | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 rate-limit 429 |
| James Perse | sweatshirts | jamesperse.com/collections/womens-sweat-tops-sweat-bottoms | 4/4 | 2/2 | 2/2 | 1/1 | 1/2 rate-limit 429 |
| James Perse | dresses | jamesperse.com/collections/womens-dresses-jumpsuits | 2/2 | – | – | – | 1/2 rate-limit 429 |
| James Perse | pants | jamesperse.com/collections/womens-pants-denim | 2/2 | – | – | – | 0/2 rate-limit 429 |
| Jigsaw | tops | jigsaw-online.com/collections/tops | 0/2 no-cards | – | – | – | – |
| Jigsaw | tops | jigsaw-online.com/collections/t-shirts | 0/2 no-cards | – | – | – | – |
| Jigsaw | sweatshirts | jigsaw-online.com/collections/knitwear | 0/2 no-cards | – | – | – | – |
| Jigsaw | shirts | jigsaw-online.com/collections/shirts-blouses | 0/2 no-cards | – | – | – | – |
| Jigsaw | dresses | jigsaw-online.com/collections/dresses | 0/2 no-cards | – | – | – | – |
| Jigsaw | pants | jigsaw-online.com/collections/trousers | 0/2 no-cards | – | – | – | – |
| Joules | tops | joules.com/shop/womens/clothing/tops | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Joules | sweatshirts | joules.com/shop/womens/clothing/sweatshirts-and-hoodies | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Joules | shirts | joules.com/shop/womens/clothing/shirts-and-blouses | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Joules | dresses | joules.com/shop/womens/clothing/dresses | 0/2 blocked 403 | – | – | – | – |
| Joules | pants | joules.com/shop/womens/clothing/all-trousers?p=2#1454.34375 | 0/2 blocked 403 | – | – | – | – |
| L.L bean | tops | global.llbean.com/llb/shop/504209/?page=womens-tees-and-tanks&nav=gnro | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| L.L bean | sweatshirts | global.llbean.com/llb/shop/886/?page=womens-sweatshirts&nav=gnro | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| L.L bean | shirts | global.llbean.com/llb/shop/516735/?prefn1=refinementGender&prefv1=Womens&nav=gnr | 4/4 | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Lands end | tops | landsend.com/shop/womens-tops/S-xfe-xez-y5c-xec | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Lands end | sweatshirts | landsend.com/shop/womens-sweatshirts-hoodies-tops-tees/S-xfe-16na-xez-y5c-xh1-y0 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Lands end | shirts | landsend.com/shop/womens-shirts-blouses-tops/S-xfe-xez-y5c-yql-xec | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Lands end | dresses | landsend.com/shop/womens-dresses/S-xfg-xez-y5c-xec | 0/2 blocked 403 | – | – | – | – |
| Lands end | pants | landsend.com/shop/womens-sweatpants-pants-bottoms/S-xff-xez-y5c-y7b-xh5-xec | 0/2 blocked 403 | – | – | – | – |
| Leset | sweatshirts | leset.com/collections/sweat-sets | 0/2 no-cards | – | – | – | – |
| Loft | tops | loft.com/clothing/tees-tanks/cat2860023/ | 4/4 | 0/2 blocked | 0/2 blocked | 0/1 blocked | – |
| Loft | sweatshirts | loft.com/lou-grey/lou-grey-shop-all/cat1880002/ | 4/4 | 0/2 blocked | 2/2 | 0/1 blocked | – |
| Loft | shirts | loft.com/clothing/tops/catl000011/ | 4/4 | 0/2 blocked | 0/2 blocked | 0/1 blocked | – |
| Lucky Brand | shirts | luckybrand.com/women/clothing/shirts/blouses | 4/4 | 0/2 shell | 0/2 shell | 0/1 shell | – |
| Lululemon | tops | shop.lululemon.com/c/women-t-shirts/n1wx7w | 0/4 blocked 403 | 0/2 conn-drop | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Lululemon | tops | shop.lululemon.com/c/women-tank-tops/n1uk4w | 0/4 blocked 403 | 0/2 conn-drop | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Lululemon | sweatshirts | shop.lululemon.com/c/women-hoodies-and-sweatshirts/n1jux6 | 0/4 blocked 403 | 0/2 conn-drop | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Lululemon | dresses | shop.lululemon.com/c/women-dresses/n1mk31 | 0/2 blocked 403 | – | – | – | – |
| Lululemon | pants | shop.lululemon.com/c/women-sweatpants/n1m8w7 | 0/2 blocked 403 | – | – | – | – |
| Madewell | tops | madewell.com/kr/womens/clothing/tees/ | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Madewell | tops | madewell.com/kr/womens/clothing/tops-shirts/ | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Madewell | pants | madewell.com/kr/womens/clothing/pants/ | 0/2 no-cards | – | – | – | – |
| Mango | tops | shop.mango.com/us/en/c/women/t-shirts/8e23bdfb | 0/4 blocked 429 | 0/2 blocked 429 | 0/2 blocked 429 | 0/1 blocked 429 | – |
| Mango | tops | shop.mango.com/us/en/c/women/tops/227371cd | 0/4 blocked 429 | 0/2 blocked 429 | 0/2 blocked 429 | 0/1 blocked 429 | – |
| Mango | sweatshirts | shop.mango.com/us/en/c/women/knitwear/7e46863e | 0/4 blocked 429 | 0/2 blocked 429 | 0/2 blocked 429 | 0/1 blocked 429 | – |
| Mango | shirts | shop.mango.com/us/en/c/women/shirts---blouses/b8003173 | 0/2 blocked 429 | – | – | – | – |
| Mango | dresses | shop.mango.com/us/en/c/women/dresses-and-jumpsuits/e6bb8705 | 0/2 blocked 429 | – | – | – | – |
| Mango | pants | shop.mango.com/us/en/c/women/pants/0bf28b3b | 0/2 blocked 429 | – | – | – | – |
| Massimo Dutti | tops | massimodutti.com/us/women/t-shirts-n1444?celement=2242518 | 0/4 blocked | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Massimo Dutti | tops | massimodutti.com/us/s/w-tops-n2889 | 0/4 blocked | 0/2 blocked 403 | 0/2 dead 404 | 1/1 | – |
| Massimo Dutti | shirts | massimodutti.com/us/women/shirts-n1439?celement=1963012 | 0/4 blocked | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Massimo Dutti | dresses | massimodutti.com/us/women/dresses-n1494?celement=2158374 | 0/2 blocked | – | – | – | – |
| Massimo Dutti | pants | massimodutti.com/us/women/trousers-n1476?celement=2158376 | 0/2 blocked | – | – | – | – |
| Me+Em | tops | meandem.com/us/tops/t-shirts | 0/2 no-cards | – | – | – | – |
| Me+Em | sweatshirts | meandem.com/us/tops/sweatshirts | 0/2 no-cards | – | – | – | – |
| Me+Em | shirts | meandem.com/us/tops | 0/2 no-cards | – | – | – | – |
| Me+Em | dresses | meandem.com/us/dresses | 0/2 no-cards | – | – | – | – |
| Me+Em | pants | meandem.com/us/pants | 0/2 no-cards | – | – | – | – |
| Mint velvet | tops | mintvelvet.com/collections/t-shirts | 0/2 no-cards | – | – | – | – |
| Mint velvet | tops | mintvelvet.com/collections/tops | 0/2 no-cards | – | – | – | – |
| Mint velvet | sweatshirts | mintvelvet.com/collections/sweatshirts-hoodies | 0/2 no-cards | – | – | – | – |
| Mint velvet | shirts | mintvelvet.com/collections/shirts-blouses | 0/2 no-cards | – | – | – | – |
| Mint velvet | dresses | mintvelvet.com/collections/dresses | 0/2 no-cards | – | – | – | – |
| Mint velvet | pants | mintvelvet.com/collections/trousers | 0/2 no-cards | – | – | – | – |
| Monsoon | tops | monsoonlondon.com/kr/womens/womens-clothing/tops/ | 4/4 | 2/2 | 2/2 | 1/1 | 1/2 rate-limit 429 |
| Monsoon | sweatshirts | monsoonlondon.com/kr/womens/womens-clothing/knitwear/ | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 shell·rate-limit 429 |
| Monsoon | pants | monsoonlondon.com/kr/womens/womens-clothing/trousers-shorts/ | 2/2 | – | – | – | 0/2 rate-limit·shell 429 |
| Nike | tops | nike.com/w/womens-tops-t-shirts-5e1x6z9om13 | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Nike | sweatshirts | nike.com/w/womens-fleece-4xh6qz5e1x6 | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Nike | dresses | nike.com/w/womens-skirts-and-dresses-5e1x6z8y3qp | 0/2 no-cards | – | – | – | – |
| Nike | pants | nike.com/w/womens-pants-and-tights-2kq19z5e1x6 | 0/2 no-cards | – | – | – | – |
| Oasis | tops | oasisfashion.com/categories/womens-tops | 0/2 no-cards | – | – | – | – |
| Oasis | sweatshirts | oasisfashion.com/categories/womens-tops/facet/categoryTaxonomy/Hoodies%20&%20Swe | 0/2 no-cards | – | – | – | – |
| Oasis | shirts | oasisfashion.com/categories/womens-tops-shirts-and-blouses | 0/2 no-cards | – | – | – | – |
| Oasis | dresses | oasisfashion.com/categories/womens-dresses | 0/2 no-cards | – | – | – | – |
| Oasis | pants | oasisfashion.com/categories/womens-skirts | 0/2 no-cards | – | – | – | – |
| Old Navy | tops | oldnavy.gap.com/browse/women/t-shirts?cid=1035712&nav=meganav%3AWomen%3AWomen%E2 | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Old Navy | sweatshirts | oldnavy.gap.com/browse/women/sweatshirts-and-hoodies?cid=3044037&nav=meganav%3AW | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Old Navy | shirts | oldnavy.gap.com/browse/women/all-tops?cid=72091&nav=meganav%3AWomen%3AWomen%E2%8 | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Old Navy | dresses | oldnavy.gap.com/browse/women/dresses-and-jumpsuits?cid=15292&nav=meganav%3AWomen | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| Old Navy | pants | oldnavy.gap.com/browse/women/sweatpants?cid=3044038&nav=meganav%3AWomen%3AWomen% | 0/4 no-cards | 2/2 | 2/2 | 1/1 | – |
| On | tops | on.com/en-us/shop/womens/apparel/tops-tshirts | 0/2 blocked·shell | – | – | – | – |
| On | sweatshirts | on.com/en-us/shop/womens/apparel/hoodies-sweatshirts | 0/2 blocked·shell | – | – | – | – |
| On | dresses | on.com/en-us/shop/womens/apparel/dresses | 0/2 blocked·shell | – | – | – | – |
| On | pants | on.com/en-us/shop/womens/apparel/pants | 0/2 blocked·shell | – | – | – | – |
| Oysho | tops | oysho.com/gb/womens-sports-t-shirts-n4764 | 0/4 blocked | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Oysho | tops | oysho.com/gb/womens-sports-tops-n5484 | 0/4 blocked | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Oysho | sweatshirts | oysho.com/gb/womens-sweatshirts-n4922 | 0/2 blocked | – | – | – | – |
| Oysho | dresses | oysho.com/gb/dresses-jumpsuits-n4954 | 0/4 blocked | 0/2 blocked 403 | 2/2 | 1/1 | – |
| Oysho | pants | oysho.com/gb/womens-pants-n4813 | 0/2 blocked | – | – | – | – |
| Paige | tops | paige.com/collection/women-tees-and-tanks | 0/4 blocked 429 | 0/2 blocked 429 | 0/2 blocked 429 | 0/1 blocked 429 | – |
| Paige | sweatshirts | paige.com/collection/women-sweaters-and-sweatshirts | 0/4 blocked 429 | 0/2 blocked 429 | 0/2 blocked 429 | 0/1 blocked 429 | – |
| Paige | shirts | paige.com/collection/women-tops | 0/4 blocked 429 | 0/2 blocked 429 | 0/2 blocked 429 | 0/1 blocked 429 | – |
| Paige | dresses | paige.com/collection/women-dresses | 0/2 blocked 429 | – | – | – | – |
| Paige | pants | paige.com/collection/women-pants | 0/2 blocked 429 | – | – | – | – |
| Patagonia | tops | patagonia.com/shop/womens/tops/t-shirts | 0/4 maintenance | 0/2 maintenance | 0/2 maintenance | 0/1 maintenance | – |
| Patagonia | sweatshirts | patagonia.com/shop/womens/tops/sweatshirts-hoodies | 0/4 maintenance | 0/2 maintenance | 2/2 | 0/1 maintenance | – |
| Patagonia | shirts | patagonia.com/shop/womens/tops/button-down | 0/4 maintenance | 0/2 maintenance | 0/2 maintenance | 0/1 maintenance | – |
| Patagonia | dresses | patagonia.com/shop/womens/dresses-jumpsuits | 0/2 maintenance | – | – | – | – |
| Patagonia | pants | patagonia.com/shop/womens/bottoms | 0/2 maintenance | – | – | – | – |
| Prana | tops | prana.com/women/tops.html | 0/4 blocked 403 | 1/2 blocked 403 | 1/2 blocked 403 | 0/1 blocked 403 | 0/2 blocked 403 |
| Prana | sweatshirts | prana.com/women/tops/sweaters-hoodies.html | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 0/2 blocked 403 |
| Prana | dresses | prana.com/women/dresses-skirts.html | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 0/2 blocked 403 |
| Prana | pants | prana.com/women/bottoms.html | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 0/2 shell 403 |
| Reformation | tops | thereformation.com/tops | 0/4 blocked 403 | 2/2 | 2/2 | 1/1 | 2/2 |
| Reformation | sweatshirts | thereformation.com/the-sweater-shop.html | 0/4 blocked 403 | 2/2 | 0/2 blocked 403 | 1/1 | 0/2 shell 403 |
| Reformation | shirts | thereformation.com/tops/button-ups | 0/4 blocked 403 | 2/2 | 0/2 blocked 403 | 1/1 | 2/2 |
| Reformation | dresses | thereformation.com/dresses | 0/2 blocked 403 | – | – | – | 1/2 blocked 403 |
| Reformation | pants | thereformation.com/clothing/pants | 0/2 blocked 403 | – | – | – | 2/2 |
| Sezane | tops | sezane.com/us-en/collection/t-shirts-sweatshirts-marinieres | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Sezane | sweatshirts | sezane.com/us-en/collection/sweat-shirts-sailor-tops | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Sezane | dresses | sezane.com/us-en/collection/dresses | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Sezane | pants | sezane.com/us-en/collection/bottoms/trousers | 0/2 blocked 403 | – | – | – | – |
| Splendid | tops | splendid.com/collections/the-tee-shop | 0/2 shell | – | – | – | – |
| Splendid | sweatshirts | splendid.com/collections/women-categories-sweats-sweatshirts | 0/2 no-cards | – | – | – | – |
| Splendid | shirts | splendid.com/collections/women-categories-tops | 0/2 no-cards | – | – | – | – |
| Splendid | dresses | splendid.com/collections/women-categories-dresses | 0/2 no-cards | – | – | – | – |
| Splendid | pants | splendid.com/collections/bottoms | 0/2 no-cards | – | – | – | – |
| Sweaty betty | tops | sweatybetty.com/us/shop/tops | 0/2 no-cards | – | – | – | – |
| Sweaty betty | sweatshirts | sweatybetty.com/us/shop/tops/sweatshirts-and-hoodies | 0/2 no-cards | – | – | – | – |
| Sweaty betty | dresses | sweatybetty.com/us/shop/bottoms/dresses-and-jumpsuits | 0/2 no-cards | – | – | – | – |
| Sweaty betty | pants | sweatybetty.com/us/shop/bottoms | 0/2 no-cards | – | – | – | – |
| The Great | tops | thisisthegreat.com/collections/the-great-knits | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 2/2 |
| The Great | sweatshirts | thisisthegreat.com/collections/knit-shop-sweatshirts | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 2/2 |
| The Great | shirts | thisisthegreat.com/collections/tops | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 2/2 |
| The Great | dresses | thisisthegreat.com/collections/dresses | 0/2 no-cards | – | – | – | 2/2 |
| The Great | pants | thisisthegreat.com/collections/knit-shop-sweatpants | 0/2 no-cards | – | – | – | 2/2 |
| The upside | tops | theupside.com/shop/tops/ | 0/4 blocked 403 | 2/2 | 2/2 | 1/1 | – |
| The upside | sweatshirts | theupside.com/shop/tops/knitwear/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 1/1 | – |
| The upside | dresses | theupside.com/shop/all-in-one/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 1/1 | – |
| The upside | pants | theupside.com/shop/bottoms/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 1/1 | – |
| The white company | tops | thewhitecompany.com/uk/Clothing/View-All-Clothing/Tops/c/tops-and-t-shirts | 0/4 geo | 0/2 geo | 0/2 geo | 0/1 geo | – |
| The white company | sweatshirts | thewhitecompany.com/uk/Clothing/View-All-Clothing/c/loungewear | 0/4 geo | 0/2 dead 404 | 0/2 dead 404 | 0/1 geo | – |
| The white company | dresses | thewhitecompany.com/uk/Clothing/View-All-Clothing/c/dresses-and-tunics | 0/4 geo | 0/2 dead 404 | 0/2 dead 404 | 0/1 geo | – |
| Theory | tops | theory.com/women/t-shirts-and-tanks/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Theory | sweatshirts | theory.com/women/loungewear/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Theory | shirts | theory.com/women/tops/ | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | – |
| Theory | dresses | theory.com/women/dresses/ | 0/2 blocked 403 | – | – | – | – |
| Theory | pants | theory.com/women/pants/ | 0/2 blocked 403 | – | – | – | – |
| Vanessa bruno | tops | vanessabruno.com/clothing/shirts-tops/t-shirt.html | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 2/2 |
| Vanessa bruno | tops | vanessabruno.com/clothing/shirts-tops/top.html | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 2/2 |
| Vanessa bruno | sweatshirts | vanessabruno.com/last-chance/knitwear.html | 0/4 dead | 0/2 dead | 0/2 dead | 0/1 dead | 0/2 shell |
| Vanessa bruno | shirts | vanessabruno.com/clothing/shirts-tops.html | 2/2 | – | – | – | 0/2 shell |
| Vanessa bruno | dresses | vanessabruno.com/clothing/dresses-jumpsuits.html | 2/2 | – | – | – | 0/2 shell |
| Vanessa bruno | pants | vanessabruno.com/clothing/trousers.html | 2/2 | – | – | – | 0/2 shell |
| Velvet | tops | velvet-tees.com/collections/womens-tees | 0/2 no-cards | – | – | – | – |
| Velvet | tops | velvet-tees.com/collections/tanks-camis | 0/2 no-cards | – | – | – | – |
| Velvet | sweatshirts | velvet-tees.com/collections/hoodies-sweatshirts | 0/2 no-cards | – | – | – | – |
| Velvet | shirts | velvet-tees.com/collections/womens-tops | 0/2 no-cards | – | – | – | – |
| Velvet | dresses | velvet-tees.com/collections/dresses | 0/2 no-cards | – | – | – | – |
| Velvet | pants | velvet-tees.com/collections/pants-shorts | 0/2 no-cards | – | – | – | – |
| vineyardvines | tops | vineyardvines.com/category/womens-tees-tanks?nav=home--top_nav--Womens--womens-c | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 1/2 rate-limit 429 |
| vineyardvines | sweatshirts | vineyardvines.com/category/women-sweatshirts?nav=category--top_nav--Womens--wome | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 0/2 rate-limit 429 |
| vineyardvines | shirts | vineyardvines.com/category/Womens-Shirts-Tunics?nav=category--top_nav--Womens--w | 0/4 no-cards | 2/2 | 2/2 | 1/1 | 0/2 shell·rate-limit 429 |
| vineyardvines | dresses | vineyardvines.com/category/womens-dresses?nav=category--top_nav--Womens--womens- | 0/2 no-cards | – | – | – | 0/2 rate-limit 429 |
| vineyardvines | pants | vineyardvines.com/category/womens-pants-denim?nav=category--top_nav--Womens--wom | 0/2 no-cards | – | – | – | 2/2 |
| Vuori | tops | vuoriclothing.com/collections/womens-tanks | 0/2 no-cards | – | – | – | – |
| Vuori | tops | vuoriclothing.com/collections/womens-short-sleeve-tops | 0/2 no-cards | – | – | – | – |
| Vuori | tops | vuoriclothing.com/collections/womens-long-sleeve-tops | 0/2 no-cards | – | – | – | – |
| Vuori | sweatshirts | vuoriclothing.com/collections/womens-hoodies-and-sweatshirts | 0/2 no-cards | – | – | – | – |
| Vuori | dresses | vuoriclothing.com/collections/womens-dresses-jumpsuits | 0/2 no-cards | – | – | – | – |
| Vuori | pants | vuoriclothing.com/collections/womens-joggers | 0/2 no-cards | – | – | – | – |
| WHBM | tops | whitehouseblackmarket.com/store/category/tees/cat4769286 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| WHBM | tops | whitehouseblackmarket.com/store/category/tops/cat210001 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| WHBM | shirts | whitehouseblackmarket.com/store/category/blouses-shirts/cat4769287 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| WHBM | dresses | whitehouseblackmarket.com/store/category/dresses/cat210002 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| WHBM | pants | whitehouseblackmarket.com/store/category/pants/cat210003 | 0/4 blocked 403 | 0/2 blocked 403 | 0/2 blocked 403 | 0/1 blocked 403 | 2/2 |
| Whitestuff | tops | whitestuff.com/browse/collection/womens-t-shirts | 4/4 | 2/2 | 2/2 | 1/1 | 1/2 rate-limit 429 |
| Whitestuff | tops | whitestuff.com/browse/womens/tops-and-tees | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 rate-limit 429 |
| Whitestuff | sweatshirts | whitestuff.com/browse/womens/knitwear | 4/4 | 2/2 | 2/2 | 1/1 | 0/2 rate-limit 429 |
| Whitestuff | shirts | whitestuff.com/browse/womens/shirts-and-blouses | 2/2 | – | – | – | 1/2 rate-limit 429 |
| Whitestuff | dresses | whitestuff.com/browse/womens/dresses | 2/2 | – | – | – | 1/2 rate-limit 429 |
| Whitestuff | pants | whitestuff.com/browse/womens/trousers-and-leggings | 2/2 | – | – | – | 0/2 rate-limit 429 |
| Wilson | tops | wilson.com/en-us/sportswear/women/tops/tanks | 4/4 | 2/2 | 1/2 blocked 403 | 1/1 | – |
| Wilson | tops | wilson.com/en-us/sportswear/women/tops/short-sleeve-tops | 4/4 | 2/2 | 2/2 | 0/1 blocked 403 | – |
| Wilson | tops | wilson.com/en-us/sportswear/women/tops/long-sleeve-tops | 4/4 | 2/2 | 2/2 | 0/1 blocked 403 | – |
| Z Supply | tops | zsupplyclothing.com/collections/tees-1 | 0/2 no-cards | – | – | – | – |
| Z Supply | tops | zsupplyclothing.com/collections/tanks | 0/2 no-cards | – | – | – | – |
| Z Supply | sweatshirts | zsupplyclothing.com/collections/sweatshirts-hoodies-pullovers | 0/2 no-cards | – | – | – | – |
| Z Supply | shirts | zsupplyclothing.com/collections/shirts-blouses | 0/2 no-cards | – | – | – | – |
| Z Supply | dresses | zsupplyclothing.com/collections/dresses | 0/2 no-cards | – | – | – | – |
| Z Supply | pants | zsupplyclothing.com/collections/bottoms | 0/2 no-cards | – | – | – | – |
| Zara | tops | zara.com/us/en/woman-tshirts-l1362.html?v1=2420417 | 0/2 blocked | – | – | – | – |
| Zara | tops | zara.com/us/en/woman-tops-l1322.html?v1=2635766 | 0/2 blocked | – | – | – | – |
| Zara | sweatshirts | zara.com/us/en/woman-sweatshirts-l1320.html?v1=2467841 | 0/2 blocked | – | – | – | – |
| Zara | shirts | zara.com/us/en/woman-shirts-l1217.html?v1=2420369 | 0/2 blocked | – | – | – | – |
| Zara | dresses | zara.com/us/en/woman-dresses-l1066.html?v1=2420896 | 0/2 blocked | – | – | – | – |
| Zara | pants | zara.com/us/en/woman-trousers-l1335.html?v1=2420795 | 0/2 blocked | – | – | – | – |

</details>


### 측정 실행

| 실행 | 시각(UTC) | 나가는 IP | 엔진 | 대상 수 |
|---|---|---|---|---:|
| 45578685230 | 2026-11-25T08:44 | 20.64.204.x | impit | 623 |
| 45578690977 | 2026-11-25T08:44 | 52.176.139.x | impit, playwright, firefox, camoufox | 84 |
| 45578696329 | 2026-11-25T08:44 | 74.235.103.x | impit, playwright, firefox, camoufox | 82 |
| 45578702353 | 2026-11-25T08:44 | 52.159.227.x | server | 75 |
| 45578722275 | 2026-11-25T08:44 | 172.190.93.x | impit, site-api, wayback, playwright, firefox, camoufox | 49 |
| 45578730036 | 2026-11-25T08:44 | 13.86.110.x | impit, site-api, wayback, playwright, firefox, camoufox | 60 |
| 45578744223 | 2026-11-25T08:44 | 74.235.119.x | (카탈로그 훑기) | 0 |
| 45580608846 | 2026-11-25T08:57 | 52.226.124.x | impit | 623 |
| 45582267106 | 2026-11-25T09:08 | 172.208.124.x | impit, playwright, firefox | 90 |
| 45582271538 | 2026-11-25T09:08 | 51.57.145.x | server | 75 |
| 45582315366 | 2026-11-25T09:08 | 20.102.102.x | impit, site-api, wayback, playwright, firefox | 23 |
| 45584342647 | 2026-11-25T09:21 | 20.55.223.x | impit, playwright, firefox, firefox-fresh | 84 |
| 45584347742 | 2026-11-25T09:21 | 20.120.221.x | impit, playwright, firefox, firefox-fresh | 82 |
| 45591302346 | 2026-11-25T10:04 | 20.171.4.x | impit, playwright, firefox, firefox-fresh | 26 |

