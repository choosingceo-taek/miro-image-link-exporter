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
