# 접근 지도 측정 실행 기록

모두 `diagnose-page.yml` mode=engines, 브랜치 `claude/dv-visibility-cross-device-igprlf`, 저장 안 함(읽기만).
결과는 실행마다 `try-engines-report-<실행>.md` · `try-engines-results-<실행>.json` 으로 커밋된다.

| 실행 | 시작(UTC) | 대상 | 엔진 | 메모 |
|---|---|---|---|---|
| 45578685230 | 2026-11-25 08:42 | targets-listing-all.json (목록 623) | impit | 1차 · 전 URL HTTP 수준 |
| 45578690977 | 08:42 | targets-listing-a.json (목록 84 · 27 브랜드) | impit,playwright,firefox,camoufox | 1차 |
| 45578696329 | 08:42 | targets-listing-b.json (목록 82 · 26 브랜드) | 같음 | 1차 |
| 45578702353 | 08:42 | targets-listing-server.json (목록 75 · 서버 15 브랜드) | server | 서버 경고 |
| 45578722275 | 08:43 | 상품 · 20 브랜드 × 3 | impit,site-api,wayback,playwright,firefox,camoufox | 1차 P-a |
| 45578730036 | 08:43 | 상품 · 23 브랜드 × 3 | 같음 | 1차 P-b |
| 45578744223 | 08:43 | 카탈로그 134개 훑기(엔진 없음) | - | URL별 저장 수 |
| 45580608846 | 08:55 | targets-listing-all.json (목록 623) | impit | 2차(다른 러너) · 판정 규칙 보완 뒤 |
| 45582267106 | 09:06 | 상품 · 33 브랜드 × 3 | impit,playwright,firefox | 2차 상품(camoufox 는 1차에서 두 번 다 시작하자마자 SIGSEGV — 뺌) |
| 45582271538 | 09:06 | targets-listing-server.json | server | 2차 서버 경고 |
| 45582315366 | 09:06 | targets-product-extra.json (상품 23 · 카탈로그에서 못 고른 브랜드) | impit,site-api,wayback,playwright,firefox | 1차 |
| 45584342647 | 09:19 | targets-listing-a.json | impit,playwright,firefox,firefox-fresh | 2차 목록 a(다른 러너) · 페이지마다 새 창 엔진 추가 |
| 45584347742 | 09:19 | targets-listing-b.json | 같음 | 2차 목록 b |

1차 목록 a·b 에서 camoufox 는 시작하자마자 SIGSEGV(exit 139) — 11/24 와 같다. 2차부터 뺐다.
| 45591302346 | 10:03 | targets-product-extra2.json (상품 26) | impit,playwright,firefox,firefox-fresh | 상품 2차 · Sessun 진짜 주소 · 새 창 |
| 45593253005 | 10:15 | targets-listing-retry.json (Chico's·WHBM·Prana 목록 14) | impit,firefox,firefox-fresh | 다른 러너 재측정 |
| 45593259314 | 10:15 | targets-product-extra2.json | impit,firefox,firefox-fresh | 상품 2차 반복(다른 러너) |
| 45593253005·45593259314 결과 | | | | Chico's·WHBM 파이어폭스는 이 러너에서도 첫 페이지만(73·21), 새 창 403 · The upside·Reformation 상품은 새 창 3/3(2회째) · Prana 전부 403 |

## 목록 문 열기 측정(2026-11-25 오후) — `browser-collect.yml` report_tag 실행, 저장 안 함

모두 `store=0` · `report_tag` 실행(로그 첫 줄 `STORE: 0 · REPORT_TAG: …` 과 `저장 OFF — 조사만` 으로 확인).
결과는 `browser-collect-<tag>-<실행>[-extra].json/.md` 로 커밋된다(운영 리포트 `browser-collect-report.*` 는 건드리지 않음).

| 실행 | 대상 | 코드 | 메모 |
|---|---|---|---|
| 45598559769·564211·568833·586399·591172·597529 | 1차(같은 후보) | 설치 오류 | `--no-save` 를 두 번 따로 받아 playwright 가 지워짐 → 수집 시작 전 종료(아무것도 안 읽음·안 씀) |
| 45598942983·45598957772 | 후보 1(확장 담당 14) | impit 엔진·pid·경로 규칙 | 1차 |
| 45598948052·45598964123 | 후보 2(Gap 계열·Upside·Carhartt·Nike·Reformation·Lucky) | 같음 | 1차 |
| 45598952305·45598969872 | 후보 3(서버 담당 10) | 같음 | 1차 |
| 45604830101·45604840722 | 후보 2 | + 메뉴 칸 제외 · 누적 스크롤 | 2차 |
| 45604834917·45604846574 | 후보 3 | 같음 | 2차 |
| 45605800257·45605806955 | 후보 1 | + 페이지 바뀌면 다시 읽기 · 두 잡 | 2차 |
| 45620020752·45620027222 | 야간과 같은 모양(두 잡 · 후보 최종 파일) | + 상한 200 · 메뉴 칸 안 상품 그리드 | 3차 |
| 45636819418 | 최종 설정 그대로(`browser-extra-brands.json` · 두 잡 · 시간 예산 105분) | 최종 코드 | 두 잡 모두 미룸 없이 끝남: Render 그룹 23개 88분 · 추가 브랜드 12개 65분. 넣은 12개 모두 다시 기준 이상 |
| 45603042651 (diagnose-page, mode=page · 읽기만) | Gap·BR·Old Navy·Reformation 목록 구조 | — | `diagnose-page.md` |
