# 저장된 혼용률 점검 (2026-11-24)

> 작성 중 — 이 문서는 작업하면서 채운다. 숫자는 2026-11-24 점검 실행 기준이다.
> **아직 아무 값도 지우거나 고치지 않았다.** 정리는 담당자 승인 뒤에 한다.

## 한눈에

- 지금 저장된 혼용률: **28,218개** (브랜드 134개, 상품 38,847개 중).
- 틀린 값은 몇 브랜드에 몰려 있다. 실제 페이지와 견줘 **틀림이 확인된 브랜드**는 Splendid · Aritzia · Gymshark ·
  &Other Stories 네 곳이고, 여기에 **상품이 아닌 주소(카테고리 목록)에 붙은 값**(Carhartt 등)이 있다.
- 나머지 의심 브랜드(ALC · Me+Em · Tuckernuck · CCC · Good American 등)는 실제 페이지와 같았다 —
  겉감+안감, 실크+레이스처럼 진짜로 두 원단인 옷이었다.
- 원인: 상품 페이지에서 **상품 소재가 아닌 글**(페이지 틀 — 메뉴·배너·추천 블록 등)이 소재로 함께 읽혔다.
  11/24 Zara 에서 같은 일을 찾아 추출기를 고쳤고(`docs/firefox-enrich-checks.md`), 이번엔 이미 저장된 값을 훑었다.

## 어떻게 봤나

1. **모양으로 훑기** — 저장값 전부를 '틀린 값이 보이는 모양'으로 셌다(`scripts/audit-stored-comp.mjs`, 읽기만).
   - A: 두 줄인데 줄마다 다른 섬유 100% (예: `Wool 100% ‖ Cotton 100%`) — Zara 에서 본 모양
   - B: 한 브랜드의 여러 줄 값에 같은 줄이 거의 늘 끼어 있음 — 페이지 틀에서 온 조각
   - C: 한 값이 브랜드 값의 60% 이상을 차지함 — 확인용(면 티셔츠 브랜드는 정상일 수 있음)
   - D: 상품명이 말하는 섬유가 값에 없음 (울 스웨터인데 `Leather 100%`)
   - E: 섬유가 아닌 낱말·합이 맞지 않는 값
   - F: 상품이 아닌 주소(카테고리·목록)에 붙은 값
2. **실제 페이지와 견주기** — 의심 브랜드에서 89개를 골라 오늘 다시 열어 읽었다(GitHub Actions, 저장 안 함).
   - 주의: "다시 읽은 값과 같다"가 곧 "맞다"는 아니다. 오늘 추출기도 같은 실수를 할 수 있다 — Splendid 는
     본문만 읽으면 오늘도 `Cotton 100% ‖ Cashmere 100%` 가 나왔고, 페이지의 구조화 데이터(JSON-LD)를 먼저 읽어야
     진짜 소재가 나왔다. 그래서 '같음'이어도 상품명·옷 종류와 맞는지 함께 봤다.

## 판정 기준

| 표시 | 뜻 |
|---|---|
| 🔴 틀림 확인 | 실제 페이지(또는 보관본)를 다시 읽어 다른 소재가 나왔다 |
| 🟠 틀림 공산 큼(모양만) | 페이지를 못 열었지만 모양·상품명으로 보아 거의 틀림 |
| 🟢 확인했고 괜찮음 | 다시 읽어 같았고, 상품명·옷 종류와도 맞는다 |
| ⚪ 확인 못 함 | 페이지가 막혔거나 열렸어도 소재를 못 읽었다 |

## 문제별 정리

### 1. Splendid — 🔴 틀림 확인

- 저장된 혼용률 344개 중 **233개가 `Cotton 100% ‖ Cashmere 100%`** (두 줄). 여러 줄 값 251개 중 239개에
  `Cashmere 100%`, 237개에 `Cotton 100%` 줄이 들어 있다. 리넨 원피스·뱀부 티셔츠에도 붙어 있다.
- 다시 읽은 6개 모두 달랐다:

| 상품 | 저장값 | 오늘 페이지 |
|---|---|---|
| [Louisa Long Sleeve Tee](https://splendid.com/products/louisa-long-sleeve-tee) | Cotton 100% ‖ Cashmere 100% | Cotton 100% |
| [Lainey Lace Trim Short Sleeve Tee](https://splendid.com/products/lainey-lace-trim-short-sleeve-tee) | Cotton 100% ‖ Cashmere 100% | Cotton 60% / Polyester 40% |
| [Leopard Bamboo Blend Long Sleeve Tee](https://splendid.com/products/leopard-bamboo-blend-long-sleeve-tee) | Cotton 100% ‖ Cashmere 100% | Viscose 68% / Polyester 29% / Elastane 3% |
| [Stella Linen Trim Tank](https://splendid.com/products/stella-linen-trim-tank) | Cotton 100% ‖ Cashmere 100% | Linen 100% |
| [Stella Linen Midi Dress](https://splendid.com/products/stella-linen-midi-dress) | Cotton 100% ‖ Cashmere 100% | Linen 100% ‖ Viscose 100% |
| [Stella Linen Mini Dress](https://splendid.com/products/stella-linen-mini-dress) | Cotton 100% ‖ Cashmere 100% | Linen 100% ‖ Viscose 100% |

- 어디서 왔나: (조사 중 — 페이지 덤프)

### 2. Aritzia — 🔴 틀림 확인(1개) + 🟠 모양

- 저장된 혼용률 472개 중 **358개가 `Leather 100%`** (한 줄). 면 탱크톱·울 스웨터·리넨 원피스에도 붙어 있다.
- 다시 읽기: [Essential Wool Cashmere Cherub Sweater](https://www.aritzia.com/intl/en/product/essential-wool-cashmere-cherub-sweater/126806.html)
  저장값 `Leather 100%` → 오늘 페이지 `Wool 70% / Cashmere 30% ‖ Wool 66% / Cashmere 28% / Nylon 5% / Elastane 1%`.
  나머지 2개는 차단(Aritzia 는 데이터센터 접속을 대부분 막는다).
- 예: Seabreeze Tank(면 메시 탱크) · Francoise Dress(면 포플린) · Ventura Linen Halter Dress — 모두 `Leather 100%`.
- 어디서 왔나: (조사 중)

### 3. Gymshark — 🔴 틀림 확인

- 저장된 혼용률 272개 중 여러 줄 값이 49개, 그중 **48개에 `‖ Cotton 100%` 줄이 덧붙어 있다**.
- 다시 읽은 4개 모두 첫 줄만 맞고 `Cotton 100%` 줄은 페이지에 없었다. 예:
  [FeatherForm Scoop Neck T-Shirt](https://row.gymshark.com/products/gymshark-feather-form-scoop-neck-t-shirt-ss-tops-blue-aw26)
  저장값 `Nylon 78% / Elastane 21% / Polyester 1% ‖ Cotton 100%` → 오늘 `Nylon 78% / Elastane 21% / Polyester 1%`.

### 4. &Other Stories — 🟠 모양(보관본 1개로 확인)

- 저장된 혼용률 172개 중 **58개가 `Cotton 100% / Linen 100%` 꼴**(예전 저장 형식 — 두 원단을 한 줄에 합 200%로).
  면 티셔츠에 Linen, 면 셔츠에 Wool/Silk 가 붙는다.
- 다시 읽기: 상품 페이지는 모두 차단. 보관본(웹 아카이브)으로 읽은
  [Box Pleat Tank Top](https://www.stories.com/en-us/product/box-pleat-tank-top-white-1358088003/) 은 `Cotton 100%`
  (저장값 `Cotton 100% / Linen 100%`).

### 5. 상품이 아닌 주소에 붙은 값 (시그니처 F) — 125개

카탈로그에 상품 대신 카테고리·기획전 주소가 들어가 있고, 그 목록 페이지에서 읽은 소재(목록의 아무 상품 것)가
'상품 혼용률'로 붙었다. 목록 페이지에는 여러 상품이 섞여 있으므로 이 값은 어느 상품의 것도 아니다.

| 브랜드 | 개수 | 판단 | 예 |
|---|---:|---|---|
| Carhartt(카탈로그 이름 Carlhartt) | 44 | 🔴 상품 아님 — 이름도 "arrow icon" | `/c/black-friday` → Cotton 59% / Polyester 41% |
| Aerie | 4 | 🔴 상품 아님 | `/c/aerie/tops/sweatshirts-hoodies/cat7030169` → Cotton 100% |
| J.McLaughlin | 4 | 🔴 상품 아님 | `/collections/new-arrivals-women` → Polyester 100% |
| Loft | 4 | 🔴 상품 아님 | `/clothing/dresses/casual-dresses/cat3670007/`("Casual") → Cotton 100% ‖ Linen 100% |
| Ann Taylor | 3 | 🔴 상품 아님 | `/clothing/sweaters/cata000011/` → Cashmere 100% ‖ Cotton 100% |
| Madewell | 3 | 🔴 상품 아님 | `/womens/new/new-arrivals/` → Cotton 100% |
| Seasalt Cornwall | 2 | 🔴 상품 아님 | `/new-arrivals/all-new-arrivals` → Cotton 100% |
| J.Crew | 59 | 🟢 오탐 — 진짜 상품 주소다 | `/p/womens/categories/clothing/tees-and-tanks/CX381`(끝이 상품 번호) |
| Garnet Hill | 2 | 🟢 오탐 — 진짜 상품 주소다 | `/eileen-fisher-silk-twill-classic-collar-shirt/clothing/categories/tops-tees/744396` |

→ 앞의 7개 브랜드 **64개는 상품이 아닌 행**이라 값을 지워도 잃는 것이 없다(행 자체를 카탈로그에서 빼는 것도 검토할 만하다).

### 6. 확인했고 괜찮은 브랜드 — 🟢

모양(A·B·D)으로는 의심스러웠지만 실제 페이지와 같았고, 옷 종류와도 맞는 곳.

| 브랜드 | 다시 읽은 수 | 결과 | 왜 두 줄/같은 줄인가 |
|---|---:|---|---|
| ALC | 8 | 8개 같음 | 실크 + 나일론 레이스, 트리아세테이트 겉감 + 안감 |
| Me+Em | 4 | 4개 같음 | 실크 + 폴리 안감, 캐시미어 니트 + 레이스 |
| Tuckernuck | 5 | 5개 같음 | 면 아일렛 + 폴리 안감, 리넨 + 면 |
| CCC(Crew Clothing) | 4 | 4개 같음 | 스웨트셔츠 몸판·배색 두 원단 — 브랜드 공통 원단이라 되풀이 |
| Good American | 4 | 4개 같음 | 'Better Than Leather' 라인 = Polyurethane 100% (이름에 leather 가 있어도 정상) |

같은 모양(줄마다 다른 섬유 100%)인데 확인하지 못한 브랜드 — Sanctuary · Shopbop · Seasalt · Veronica Beard · Jigsaw ·
La Ligne · Mint Velvet · Rag & bone · Boden · Whitestuff · Club Monaco · English Factory · Ulla Johnson 등(각 10~20개) — 은
예시 상품이 대부분 블라우스·원피스·자수 셔츠(겉감+안감/자수실)라 진짜 두 원단일 공산이 크다. ⚪ 확인 못 함으로 둔다.
예외로 볼 곳: **Bellerose 12개**(`Cotton 100% / Leather 100%` 가 면 스웨트셔츠·포플린 셔츠에), **Oak + Fort**(여러 줄 13개 중
7개에 `Wool 100%` — 새틴 홀터넥 탑·플리스 팬츠에도), **Gestuz**(`Leather 100% / Cotton 100%` 블라우스) — 🟠 사람이 볼 것.

Ann Taylor 는 여러 줄 값 66개 중 63개에 `Polyester 100%` 줄(안감)이 있다. 다시 열었지만 8개 모두 소재를 못 읽어 ⚪.
블라우스·원피스 브랜드라 안감일 공산이 크다.

### 7. Loft

(정리 중)

### 8. 이름만 이상한 값 (시그니처 E) — 158개

- **121개는 섬유 이름 표기 문제**이고 숫자는 맞다: `Recycled Cotton 20%`(American Eagle), `Metallised Fibre 20%`(Hobbs),
  `Fibre 14%`(Phase Eight), `Combed Pima Cotton 100%`(Vince), `Lambskin Suede 100%`. 엑셀에 그대로 나가도 사람이
  읽는 데 문제는 없다 — 지울 대상이 아니다. (Buck Mason `Silk Charmeuse With 100%`, Hobbs `Elastane Sleeve 6%` 처럼 낱말이
  덜 잘린 것 몇 개는 다듬으면 좋다.)
- **37개는 숫자가 모자란 값**이다(합 5%·8%·50%·106% 등): Greyson `Elastane 8%`, Ninety Percent `Elastane 5%`,
  Stateside `Elastane 6%`, Club Monaco 4 · Cotton Citizen 4 · Dickies 4 · Faherty 4 · Good American 2 · 그 밖 4.
  **37개 모두 카탈로그에 실린 값**이고, 그중 29개는 오버레이에 온전한 값(예: `Modal 95% / Elastane 5%`)이 따로
  있는데 카탈로그 값이 앞에 서서 가려진다. 오늘의 검사(validComp)는 이 37개를 '옳지 않은 값'으로 거른다.

## 앞으로 막는 장치

(정리 중)

## 정리 제안

(정리 중)
