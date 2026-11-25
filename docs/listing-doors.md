# 목록 '문 열기' — 집 IP 없이 열리는 목록을 데이터센터 수집기로 (2026-11-25)

접근 지도(`docs/access-map.md`)가 "무료로 열 수 있다"고 한 목록 페이지를 실제로 열어 본 기록입니다.
모든 측정은 GitHub Actions 에서 **저장 없이**(store=0) 돌렸습니다. 실행 번호는 `access-measure/RUNS.md` 에 있습니다.

> **측정** = Actions 에서 실제 페이지를 열어 센 수. **추정** = 코드·구조를 보고 판단한 것.
> 이 브랜치의 변경은 owner 가 `main` 에 합치기 전에는 야간 수집에 쓰이지 않습니다.

## 1. 무엇을 바꿨나 (쉬운 말로)

| 바꾼 것 | 왜 | 시험 |
|---|---|---|
| 헤드리스 수집기에 **impit 엔진** | 크롬으로 열면 막히는데, 브라우저 없이 크롬의 '접속 지문'만 흉내 내 HTML 을 받으면 열리는 사이트가 있다(Whitestuff·Sessun). 받은 HTML 을 크롬 창에 넣고 같은 수집기로 읽는다. 크롬 창은 사이트에 직접 접속하지 않는다 | `smoke-browser-collect.mjs` 7번 |
| 브랜드별 **새 창**(`fresh`) | 첫 카테고리만 열리고 둘째부터 막히는 곳(The upside·Massimo Dutti·Oysho) | 같은 곳 |
| 브랜드별 **합치기 저장**(`store: "merge"`) | 서버가 채워 온 카탈로그(옛 상품이 쌓여 있음)를 이 수집이 줄이지 않게 | 같은 곳 |
| Render 그룹 브랜드의 **엔진 바꾸기** | The upside 처럼 이미 헤드리스로 도는 브랜드도 추가 파일로 엔진·새 창만 바꾼다 | 6번 |
| 야간을 **두 잡**으로 | 추가 브랜드를 다 넣으면 85분 예산을 넘는다. Render 그룹 잡과 추가 브랜드 잡이 동시에 돈다 | 6번(EXTRA_MODE) |
| 수집기: **물음표 뒤 상품 번호** | Gap 계열은 모든 상품 주소가 `/browse/product.do` 하나이고 번호가 `?pid=` 에 있다. 물음표 뒤를 버려서 상품이 한 개로 합쳐졌다(집 IP 에서도 1~7개) | `smoke-collector-cards.mjs` · `test-nonproduct.mjs` |
| 수집기: **한 화면씩 내려가며 누적** | 화면 밖 카드를 지우는 그리드(가상 스크롤)는 맨 아래로 한 번에 뛰면 중간이 안 그려진다 | 가상 스크롤 연기 테스트(옛 수집기 60개 중 5개) |
| 수집기: **상품이 아닌 모양** 거르기 | `/c/`·`/w/`·`/collections/` 카테고리(Carhartt 'arrow icon' 타일, Nike 필터, Reformation 기획전), Inditex `-n숫자` 카테고리(Oysho 타일), 이미지 파일 주소(Sessun srcset 조각) | `test-nonproduct.mjs`(접근 지도의 진짜 상품 주소 143개는 하나도 안 버리는지 함께 봄) |
| 수집기: **사이트 머리글·메뉴·바닥글** 링크 제외 | The upside 'Header Submenu Image', Old Navy·Banana Republic 메뉴 타일. 단, 그 칸 안에 가격 붙은 카드가 8개 이상이면 상품 그리드로 본다(Monsoon) | 연기 테스트 2개 |
| 수집기: 모은 수 **상한** | 끝없이 이어지는 목록(Nike·Reformation·Oysho)이 한 브랜드에 10~45분 쓰던 것 → 헤드리스는 200개에서 멈춤(확장은 그대로 600) | — |
| 수집 중 **페이지가 바뀌면 한 번 다시 읽기** | Oysho 첫 두 카테고리가 0개였던 원인 | — |

규칙(경로·메뉴·상품 번호)은 `chrome-extension/collector.js` 한 곳에 있어 **확장도 같은 규칙**을 씁니다.
확장 쪽에 반영되려면 확장을 다시 불러와야 합니다(버전 올리기는 이번 작업 범위 밖).

## 2. 브랜드별 결과

BRAND_TABLE

## 3. URL 문제 — 바꿀 주소 제안 (owner 결정 필요 · 엑셀 URL 은 바꾸지 않았음)

| 브랜드 | 지금 URL | 제안 URL | 본 상품 수(지금 → 제안) | 근거 |
|---|---|---|---|---|
| Good American | `/en-kr/collections/tees-tanks` | `/collections/tees-tanks` | 136 → 134 | 측정 run 45598952305·45598969872(크롬) — 두 주소가 같은 목록 |
| Good American | `/en-kr/collections/womens-tops` | `/collections/womens-tops` | 353 → 353 | 같음 |
| Good American | `/en-kr/collections/dresses` | `/collections/dresses` | 93 → 93 | 같음 |
| Good American | `/en-kr/collections/bottoms` | `/collections/bottoms` | 101 → 101 | 같음 |
| Monsoon | `/kr/womens/womens-clothing/tops/` | `/us/womens/womens-clothing/tops/` | 50 → 50 | 측정(impit) — `/kr/` 는 미국 IP 에서 `/us/women/womens-clothing/tops-blouses/` 로 넘어감 |
| Monsoon | `/kr/womens/womens-clothing/knitwear/` | `/us/womens/womens-clothing/knitwear/` | 65~66 → 68 | 같음 |
| Monsoon | `/kr/womens/dresses/` | `/us/womens/dresses/` | 62 → 62 | 같음 |
| Monsoon | `/kr/womens/womens-clothing/trousers-shorts/` | `/us/womens/womens-clothing/trousers-shorts/` | 15 → 15 | 같음(미국에선 pants-shorts 로 넘어감) |
| Madewell | `/kr/womens/clothing/tees/` 등 4개 | `/womens/clothing/tees/` 등(`/kr` 빼기) | 같은 수(23·26·22·23) | 측정 — 같은 페이지. 다만 데이터센터 크롬으로는 상품 대신 공용 기획전 링크만 보여 '읽기' 문제는 남음 |
| Vanessa bruno | `/last-chance/knitwear.html` | `/clothing/knitwear.html` | 9~20 → 53~73 | 측정 run 45598952305·45598969872·45604834917·45604846574 — 지금 주소는 첫 화면으로 튕겨 다른 상품을 보여 줌 |
| Lucky Brand | `/women/clothing/shirts/blouses` | (제안 없음) | 0 → — | 측정: 이 주소는 읽는 도중 검색 페이지로 바뀜. `/women/clothing/shirts`(같은 현상)·`/women/clothing/tops`(16, 기획전 타일 위주)도 대안이 못 됨 |
| Carhartt(참고) | `/en-eu/c/women/trousers-jeans/sweatpants/euw3000017` | (owner 확인) | 0~2 | 측정 — 미국 IP 에서 다른 곳으로 넘어감. 미국 사이트의 여성 바지 카테고리로 바꾸는 것이 맞아 보임(추정) |

수집할 때 주소를 고쳐 쓰는 규칙(`/en-kr/` 빼기 등)은 **넣지 않았습니다** — 미국 IP 에서는 지금 주소도 같은 목록으로 열리기 때문에(측정) 고칠 필요가 없었습니다. 위 표는 가격 통화·지역을 분명히 하려면 엑셀 주소를 바꾸시라는 제안입니다.

## 4. 서버 담당 브랜드

`docs/server-listing-notes.md` — 서버가 적게 읽는 원인과 고치는 안.
