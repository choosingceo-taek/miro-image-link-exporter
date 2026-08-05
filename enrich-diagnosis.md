# 혼용률 미채움 원인 (2026-08-05T02:46Z)

브랜드 5개 · 표본 20개

| 원인 | 표본 | 손댈 곳 |
|---|---:|---|
| 성공 | 0 | 재시도 창에 갇혀 있을 뿐 — RETRY_ALL=1 로 한 번 돌리면 채워진다 |
| 차단 | 0 | 서버 IP 로는 못 읽는다 — 확장(가정용 IP) 담당으로 옮겨야 한다 |
| 규칙 누락 | 20 | 페이지에 값이 있는데 못 뽑았다 — 추출 규칙을 고친다 |
| 정보 없음 | 0 | 사이트가 안 적는다 — 더 할 수 있는 게 없다 |

## 🔧 추출 규칙을 고쳐야 하는 브랜드 (5)

| 브랜드 | 저장 키 | 빈 상품 | 표본 규칙누락 |
|---|---|---:|---:|
| Goldie | goldietees.com.goldie | 123/153 | 4/4 |
| Everlane | everlane.com.everlane | 267/362 | 4/4 |
| Dickies | dickies.com.dickies | 207/301 | 4/4 |
| Reformation | thereformation.com.reformation | 163/382 | 4/4 |
| Nike | nike.com.nike | 107/468 | 4/4 |

