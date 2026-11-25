핵심 다섯 가지:

1. **진짜로 막힌 곳은 생각보다 적다.** 데이터센터(Render·GitHub)에서 우리 무료 엔진이 하나도 못 여는 브랜드는 목록 기준 18개
   (Akamai 가 막는 9 · DataDome 4 · Vercel 2 · Cloudflare 1(Prana) · 불명 1(A&F) · 가짜 점검 화면 1(Patagonia)). 이 중 15개는
   이미 집 PC 확장이 목록을 매일 받아 온다. 나머지 셋(Chico's·WHBM·Prana)은 서버 담당이라 목록이 며칠~두 달째 그대로다.
2. **확장 담당 33개 중 18개는 집 IP 가 필요 없다.** 막혔던 건 '헤드리스 크롬'이라는 한 가지 길뿐이었다. 같은 페이지를
   브라우저 없는 fetch(impit — 크롬의 TLS 지문을 흉내) 나 파이어폭스로 열면 열린다: H&M·Arket·&Other Stories·L.L bean·Ann Taylor·
   Loft·Seasalt cornwall·Wilson·Madewell·Massimo Dutti·Oysho·Garnet hill(새 창) 12개는 오늘 2회(서로 다른 러너) 측정에서 상품이 보였다. Gap 계열 4개
   (Gap·Old Navy·Athleta·Banana Republic)는 막힌 게 아니라 집 IP 에서도 상품을 1~7개만 읽는 '읽기' 문제다. 나머지 둘은 추정:
   Aritzia(서버에 이미 있는 Aritzia 검색 API 경로) · The White Company(영국 지역으로 열기).
3. **Cloudflare 로 '첫 페이지만 열리던' 곳은 새 창으로 풀린다.** The upside·Reformation·Garnet hill·Massimo Dutti 는 한 창으로
   카테고리를 이어 열면 두 번째부터 403 이었는데, 카테고리마다 쿠키 없는 새 창으로 열면 전부 열렸다(헤드리스 수집기에 이미 있는
   `FRESH_CONTEXT=1` 설정). Prana 는 새 창으로도 막혔다.
4. **혼용률 빈칸의 큰 덩어리는 접근 문제가 아니다.** Buck Mason·Dickies·Everlane·Mint velvet·Spanx·Whitestuff·Wilson·Poetry·J crew 는
   오늘 무료 엔진으로 표본 전부를 읽었다 — 야간 보강이 아직 못 돌았거나(대상·상한·5일 재시도 제한), 보강의 fetch 가 TLS 지문
   때문에 막히는 것(Whitestuff 76개 '직접차단'인데 impit 은 3/3)이다. 무료로 고친다.
5. **유료 서비스가 필요한 몫은 상품 페이지에 몰려 있다.** 상품 페이지가 데이터센터에서 모든 무료 엔진(웹 아카이브 포함)으로
   막힌 브랜드는 11개, 혼용률 빈칸 약 3,600개 — H&M(744)·Chico's(800)·Lululemon(476)·Fatface(374)·adidas(408)·Anthropologie(270)·
   Sezane(206)·The White Company(68, 지역)·Garnet hill·FP Movement·Prana. 이 중 확장 담당 브랜드는 확장의 탭 보강이 오늘 0~5% 라
   집 IP 로 되는지부터 확인하고, 안 되면 유료다. 유료 서비스는 **Akamai 를 통과하는지**가 가장 중요하다(이 11개 중 6개가 Akamai).
   무료로 못 연 주소만 모은 시험 대상(`access-measure/targets-blocked.json`)이 준비돼 있다 — §6.
