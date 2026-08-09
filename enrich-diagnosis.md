# 혼용률 미채움 원인 (2026-08-09T04:20Z)

브랜드 8개 · 표본 80개

| 원인 | 표본 | 손댈 곳 |
|---|---:|---|
| 성공 | 10 | 재시도 창에 갇혀 있을 뿐 — RETRY_ALL=1 로 한 번 돌리면 채워진다 |
| 차단 | 20 | 서버 IP 로는 못 읽는다 — 확장(가정용 IP) 담당으로 옮겨야 한다 |
| 규칙 누락 | 9 | 페이지에 값이 있는데 못 뽑았다 — 추출 규칙을 고친다 |
| 정보 없음 | 41 | 사이트가 안 적는다 — 더 할 수 있는 게 없다 |

## ⛔ 확장 담당으로 옮겨야 하는 브랜드 (2)

표본의 절반 이상이 '차단'이다. 서버 프리페치가 아무리 돌아도 이 브랜드의
혼용률은 안 채워진다. Render 저장소의 `public/blocked-brands.json` 의
`brands` 에 넣으면 확장이 05:00 에 수집·보강한다.

| 브랜드 | 저장 키 | 빈 상품 | 표본 차단 |
|---|---|---:|---:|
| Joules | joules.com.joules | 311/311 | 10/10 |
| Patagonia | patagonia.com.patagonia | 208/208 | 10/10 |

## 🔧 추출 규칙을 고쳐야 하는 브랜드 (1)

| 브랜드 | 저장 키 | 빈 상품 | 표본 규칙누락 |
|---|---|---:|---:|
| Boldest | kolonmall.com.boldest | 171/201 | 9/10 |

### 못 뽑은 본문

**Boldest**
- (페이지 JSON/스크립트) `…ucher","code":"2MEJ","value":"10","symbol":"%","name":"칠링썸머 10%","formattedDownEndDate":"2026-08-09","downEndDate":"1786287599000","useEndDate":"1786287599000","useStartDate":"1785718800000","downUseP…`
- (페이지 JSON/스크립트) `…ucher","code":"2MEJ","value":"10","symbol":"%","name":"칠링썸머 10%","formattedDownEndDate":"2026-08-09","downEndDate":"1786287599000","useEndDate":"1786287599000","useStartDate":"1785718800000","downUseP…`

## ⏳ 다시 읽기만 하면 채워지는 브랜드 (1)

Buck Mason(130)

## — 사이트가 혼용률을 안 적는 브랜드 (4)

The white company · Zara · Mint velvet · Loft

