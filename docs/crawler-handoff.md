# 크롤러 넘겨받기 — Design Suite 에서 Market Pulse 데이터·크롤러 쓰기

이 문서는 다른 Claude 세션(Design Suite 개발)이 이 저장소의 수집기를 가져다 쓰도록 정리한 것입니다.
기준일 2026-11-27. 숫자는 그날 측정·저장값입니다.

## 1. 무엇이 이미 돌고 있나 (매일 밤, 사람 손 없이)

| 단계 | 하는 일 | 어디서 | 결과 |
|---|---|---|---|
| 서버 수집 (03:00 KST) | 서버 담당 브랜드의 카테고리 페이지 → 상품 목록 | Render 서버, 저장소 `choosingceo-taek/miro-market-research` (`server.mjs`, `scripts/prefetch-catalogs.mjs`) | Worker 에 `catalog:<site>` |
| 헤드리스 수집 (03:30) | 서버가 못 읽는 브랜드를 진짜 브라우저로. 잡 3개(main · extra · oysho) | GitHub Actions `browser-collect.yml` → `scripts/browser-collect.mjs` | 같은 곳 |
| 카탈로그 점검 → 혼용률 보강 | 상품 아닌 항목 점검, 상품 페이지를 열어 혼용률·컬러·상세 채움 | `catalog-audit.yml` → `enrich-comp.yml`(`scripts/enrich-comp.mjs`), `enrich-browser.yml`(파이어폭스 차선) | Worker 에 `comp:<site>`(혼용률·컬러), `detail:<site>`(상세) |
| 집 PC 확장 | 서버 IP 가 막힌 브랜드(25개)를 가정용 IP 로 | `chrome-extension/`(1.7.24) | 같은 곳 |

브랜드 134개 · 카테고리 URL 628개(미국 주소 기준) · 상품 약 3만 9천 개.
접속 가능/불가 브랜드 목록: 저장소 담당자에게 받은 엑셀 `브랜드별_카테고리URL_접속현황_2026-11-27.xlsx`, 또는 `access-map.json`.

## 2. 가장 쉬운 방법 — 저장된 데이터를 읽기만 한다 (권장)

Design Suite 가 새로 긁지 않고, 매일 밤 채워지는 Worker 저장소를 읽으면 됩니다. 미로 앱·리서치 앱(`app.html`)이 이렇게 씁니다.

Worker 주소와 토큰은 리서치 앱·확장에 들어 있는 값과 같습니다(이 문서에는 적지 않음 — 저장소 담당자에게 받거나 `app.html` 설정 기본값 참고).

| 요청 | 돌려주는 것 |
|---|---|
| `GET ?catalogs=1&token=…` | 브랜드(사이트)별 저장본 목록과 갱신 시각 |
| `GET ?catalog=<site>&token=…` | 그 브랜드의 상품 목록(상품명·상품 URL·사진·가격·카테고리) |
| `GET ?comps=<site>&token=…` | 상품 URL → 혼용률·컬러(오버레이) |
| `GET ?details=<site>&token=…` | 상품 URL → 상세(설명·디테일 글머리표·사진 전부·컬러 전부·사이즈·재고 사이즈·상품 코드·정가·통화) |
| `GET ?index=1&token=…` | 전체 상품 검색 인덱스 |

같은 상품을 잇는 열쇠는 **상품 URL** 입니다. 화면에서 쓰는 판정·검색·엑셀 규칙은 `shared/product-core.js` 를 그대로 가져다 쓰면 됩니다(시험: `scripts/test-app-*.mjs`).

**쓰기(store) 요청은 하지 마세요.** 운영 데이터를 바꿉니다. 저장은 야간 작업만 합니다.

## 3. 코드를 가져다 쓸 때 — 부품과 위치

| 부품 | 하는 일 | 파일 |
|---|---|---|
| 목록 수집기 | 카테고리 페이지에서 상품 카드 모으기 · 메뉴/배너/안내/다른 사이트 링크 거르기 · 가상 스크롤 · `?pid=` 상품 번호 | `chrome-extension/collector.js` (확장·헤드리스 공용) |
| 헤드리스 실행기 | 엔진(chromium · firefox · impit · api) · 새 창 · 시간 예산 · 합치기 저장 | `scripts/browser-collect.mjs`, 브랜드별 설정 `browser-extra-brands.json` |
| 상품 상세 추출 | 상품명·가격·정가·통화·컬러·사이즈·혼용률·설명·디테일·사진·코드. 출처 순서 Shopify JSON → JSON-LD → 메타 → 제목 붙은 본문 칸 | `worker/fabric-extractor.js` ('상품 상세(detail) 추출' 구간). Node 에서 쓰려면 `scripts/detail-core.mjs` 의 `detailOf`·`compOf` |
| 혼용률 안전장치 | 장식·안감·메뉴 글을 혼용률로 읽지 않음 · 합 100% 검사 · 다른 상품 블록 막기 | `scripts/comp-guard.mjs`, `scripts/detail-guard.mjs`, `partsOwnerOk` |
| 서버 목록 규칙 | Shopify/SFCC 목록 · 다음 페이지 · 이미지 조각 거르기 | 서버 저장소 `server.mjs` (`rank()`, `markdownProducts()`) |
| 접근 측정 | 엔진별로 열리는지·차단 장비 기록 | `scripts/try-engines.mjs`, `scripts/access-evidence.mjs`, `docs/access-map.md` |
| 시험 자료 | 실제 페이지와 기대값(사람이 원본에서 읽은 값) | `scripts/fixtures/detail-pages/expected.json` 외 |

**복사보다 공용으로**: 규칙은 거의 매일 고쳐집니다(예: 11/26 줄임말 `77%Poly`, 프랑스어 표기). 코드를 복사하면 미로 쪽 수정이 Design Suite 에 안 들어갑니다. 2번(데이터 읽기)을 먼저 쓰고, 새로 긁어야 하는 경우에만 이 저장소의 워크플로를 부르거나 부품을 공용 패키지로 빼는 것을 권합니다.

## 4. 새로 긁어야 할 때 지킬 것

- 실제 쇼핑몰 접속은 GitHub Actions 에서만 됩니다(클라우드 세션 컨테이너는 쇼핑몰에 못 감). 측정은 항상 **저장 없이**(`store=0` / `dry=1` + `report_tag`).
- 예의 있는 접속: URL 하나에 실행당 3회 이하, 같은 사이트 1초 이상 간격, 429 면 그 사이트 중단.
- 차단 장비를 속이는 도구(위장 브라우저·지문 조작·확인 화면 풀기·프록시)는 쓰지 않습니다. 막힌 곳은 집 PC 확장(가정용 IP)이나 유료 서비스로 — 둘 다 담당자 결정.
- 혼용률 규칙을 바꾸면 원본 페이지 글에서 사람이 읽은 기대값으로 시험을 붙입니다(추출기 자기 출력으로 기대값을 만들지 않기).
- 1순위 혼용률, 2순위 컬러웨이.

## 5. 아직 안 되는 것 (2026-11-27)

- 상품 페이지가 서버에서 막힌 브랜드 약 19곳(H&M·Lululemon·Sezane·Anthropologie 등) — 혼용률은 집 PC 확장으로만.
- 목록이 집 PC 로만 되는 25곳, 서버에서 막힌 4곳(Chico's·WHBM·Prana·The White Company).
- 이미 저장된 틀린 혼용률 일부(정리 도구 `scripts/clean-stored-comp.mjs` — 실행은 담당자 승인).
- 시즌 간 같은 상품을 잇는 기준(상품 코드 vs 스타일+컬러)과 가격 이력 보관은 미정 — C/O 차트에 필요하면 담당자와 정할 것.

자세한 기록: `docs/access-map.md`, `docs/field-map.md`, `docs/listing-doors.md`, `docs/comp-25-brands.md`, `DAILY-AUTOMATION.md`.
