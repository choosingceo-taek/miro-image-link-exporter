# 혼용률 미채움 원인 (2026-08-04T11:32Z)

브랜드 45개 · 표본 180개

| 원인 | 표본 | 손댈 곳 |
|---|---:|---|
| 성공 | 63 | 재시도 창에 갇혀 있을 뿐 — RETRY_ALL=1 로 한 번 돌리면 채워진다 |
| 차단 | 68 | 서버 IP 로는 못 읽는다 — 확장(가정용 IP) 담당으로 옮겨야 한다 |
| 규칙 누락 | 38 | 페이지에 값이 있는데 못 뽑았다 — 추출 규칙을 고친다 |
| 정보 없음 | 11 | 사이트가 안 적는다 — 더 할 수 있는 게 없다 |

## ⛔ 확장 담당으로 옮겨야 하는 브랜드 (17)

표본의 절반 이상이 '차단'이다. 서버 프리페치가 아무리 돌아도 이 브랜드의
혼용률은 안 채워진다. Render 저장소의 `public/blocked-brands.json` 의
`brands` 에 넣으면 확장이 05:00 에 수집·보강한다.

| 브랜드 | 저장 키 | 빈 상품 | 표본 차단 |
|---|---|---:|---:|
| Aerie | ae.com.aerie | 114/114 | 4/4 |
| Aritzia | aritzia.com.aritzia | 366/366 | 4/4 |
| Eileen fisher | eileenfisher.com.eileenfisher | 266/266 | 4/4 |
| Fatface | fatface.com.fatface | 549/549 | 4/4 |
| FP Movement | freepeople.com.fpmovement | 46/46 | 4/4 |
| Free People | freepeople.com.freepeople | 74/74 | 4/4 |
| L.L bean | global.llbean.com.llbean | 226/226 | 4/4 |
| Joules | joules.com.joules | 298/298 | 4/4 |
| Lucky Brand | luckybrand.com.luckybrand | 149/149 | 4/4 |
| Paige | paige.com.paige | 51/51 | 4/4 |
| Patagonia | patagonia.com.patagonia | 203/203 | 4/4 |
| Lululemon | shop.lululemon.com.lululemon | 91/91 | 4/4 |
| Wilson | wilson.com.wilson | 40/40 | 4/4 |
| H&M | www2.hm.com.hm | 326/326 | 4/4 |
| J crew | jcrew.com.jcrew | 189/190 | 4/4 |
| Sezane | sezane.com.sezane | 166/167 | 4/4 |
| Addidas | adidas.com.addidas | 447/450 | 4/4 |

## 🔧 추출 규칙을 고쳐야 하는 브랜드 (11)

| 브랜드 | 저장 키 | 빈 상품 | 표본 규칙누락 |
|---|---|---:|---:|
| Ann Taylor | anntaylor.com.anntaylor | 49/49 | 4/4 |
| Gestuz | gestuz.com.gestuz | 667/667 | 2/4 |
| J.jill | jjill.com.jjill | 89/89 | 2/4 |
| Boldest | kolonmall.com.boldest | 201/201 | 4/4 |
| Leset | leset.com.leset | 208/208 | 2/4 |
| Mint velvet | mintvelvet.com.mintvelvet | 354/354 | 4/4 |
| Monsoon | monsoonlondon.com.monsoon | 31/31 | 3/4 |
| Nation LTD | nation.la.nationltd | 192/192 | 4/4 |
| Prana | prana.com.prana | 50/50 | 4/4 |
| Stateside | shopstateside.us.stateside | 322/323 | 3/4 |
| Splendid | splendid.com.splendid | 395/399 | 4/4 |

## ⏳ 다시 읽기만 하면 채워지는 브랜드 (17)

Gestuz(667) · Jigsaw(218) · J.jill(89) · Leset(208) · Marine Layer(183) · Oasis(63) · Rag & bone(188) · Spanx(97) · Reformation(383) · Boden(224) · Vanessa bruno(90) · Varley(199) · vineyardvines(200) · Whistles(195) · Whitestuff(419) · Xirena(342) · Everlane(378)

## — 사이트가 혼용률을 안 적는 브랜드 (3)

Oysho · The white company · Zara

