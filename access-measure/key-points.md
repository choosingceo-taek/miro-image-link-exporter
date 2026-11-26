핵심 다섯 가지:

1. **진짜로 막힌 곳은 생각보다 적다.** 데이터센터(Render·GitHub)에서 우리 무료 엔진이 하나도 안정적으로 못 여는 브랜드는 목록 기준
   18개(Akamai 9 · DataDome 4 · Vercel 2 · Cloudflare 1(Prana) · 업체 불명 1(A&F) · 가짜 점검 화면 1(Patagonia)). 이 중 15개는
   이미 집 PC 확장이 목록을 매일 받아 온다. 나머지 셋(Chico's·WHBM·Prana)은 서버 담당이라 목록이 며칠~두 달째 그대로다
   (Chico's 11/22 · WHBM 11/18 · Prana 9/22 이후 갱신 없음).
2. **확장 담당 33개 중 18개는 집 IP 가 필요 없다.** 막혔던 건 '헤드리스 크롬'이라는 한 가지 길뿐이었다. 같은 페이지를
   브라우저 없는 fetch(impit — 크롬의 TLS 지문을 흉내)나 파이어폭스로 열면 열린다: H&M·Arket·&Other Stories·L.L bean·Ann Taylor·
   Loft·Seasalt cornwall·Wilson·Madewell·Massimo Dutti·Oysho·Garnet hill 12개는 오늘 2회 이상(서로 다른 러너) 측정에서 상품이 보였다
   (Garnet hill 은 새 창으로 1회). Gap 계열 4개(Gap·Old Navy·Athleta·Banana Republic)는 막힌 게 아니라 집 IP 에서도 상품을 1~7개만
   읽는 '읽기' 문제다. 나머지 둘은 추정: Aritzia(서버에 이미 있는 Aritzia 검색 API 경로) · The White Company(영국 지역으로 열기).
3. **'첫 페이지만 열리던' 곳은 새 창으로 풀린다.** The upside·Reformation(Cloudflare)·Garnet hill·Massimo Dutti(Akamai)는 파이어폭스
   한 창으로 카테고리를 이어 열면 두 번째부터 403 이었는데, 페이지마다 쿠키 없는 새 창으로 열면 열렸다(헤드리스 수집기에 이미 있는
   `FRESH_CONTEXT=1` 설정). 첫 방문 뒤 받은 봇 판정 쿠키가 다음 요청을 막는 것으로 보인다. Chico's·WHBM(Akamai)·Prana(Cloudflare)는
   새 창으로도 안 풀렸다 — Chico's·WHBM 은 러너(IP)에 따라 첫 페이지만 열리거나 상품 3개 중 2~3개가 열려, 날마다 운이다.
4. **혼용률 빈칸의 큰 덩어리는 접근 문제가 아니다.** 빈칸 10,208개 중 약 4,200개는 '무료로 고칠 수 있음'(단계 1) 브랜드에 있다.
   Buck Mason·Dickies·Everlane·Mint velvet·Spanx·Whitestuff·Wilson·Poetry·J crew 는 오늘 무료 엔진으로 표본 전부를 읽었다 —
   야간 보강이 아직 못 돌았거나(대상·상한·5일 재시도 제한), 보강의 fetch 가 TLS 지문 때문에 막히는 것(Whitestuff '직접차단' 76개인데
   impit 은 3/3)이다. Massimo Dutti 는 열리지만 소재가 페이지 속 JSON 에만 있어 추출기 보완이 필요하다.
5. **유료 서비스가 필요한 몫은 상품 페이지에 몰려 있다.** 상품 페이지가 데이터센터에서 모든 무료 엔진(웹 아카이브 포함)으로 막힌
   브랜드는 9개(빈칸 약 2,700개) — Akamai 4(H&M 744 · adidas 408 · Lululemon 476 · Fatface 374), DataDome 3(Anthropologie · Sezane ·
   FP Movement), Cloudflare 1(Prana), 지역 1(The White Company). 여기에 확장으로만 일부 채워지는 5개(&Other Stories · A&F · Aritzia ·
   Mango · Paige, 빈칸 약 640개)가 더 있다. 확장 담당 브랜드는 확장의 탭 보강이 지금 0~10% 라 집 IP 로 되는지부터 확인하고, 안 되면
   유료다. 유료 서비스는 **Akamai 와 DataDome 을 둘 다 통과하는지**가 관건이다. 무료로 못 연 주소만 모은 시험 대상
   (`access-measure/targets-blocked.json`, 124개)이 준비돼 있다 — §6.
