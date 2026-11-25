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
