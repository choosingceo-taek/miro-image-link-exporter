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
