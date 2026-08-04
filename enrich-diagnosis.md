# 혼용률 미채움 원인 (2026-08-04T16:04Z)

브랜드 95개 · 표본 284개

| 원인 | 표본 | 손댈 곳 |
|---|---:|---|
| 성공 | 25 | 재시도 창에 갇혀 있을 뿐 — RETRY_ALL=1 로 한 번 돌리면 채워진다 |
| 차단 | 72 | 서버 IP 로는 못 읽는다 — 확장(가정용 IP) 담당으로 옮겨야 한다 |
| 규칙 누락 | 135 | 페이지에 값이 있는데 못 뽑았다 — 추출 규칙을 고친다 |
| 정보 없음 | 52 | 사이트가 안 적는다 — 더 할 수 있는 게 없다 |

## ⛔ 확장 담당으로 옮겨야 하는 브랜드 (24)

표본의 절반 이상이 '차단'이다. 서버 프리페치가 아무리 돌아도 이 브랜드의
혼용률은 안 채워진다. Render 저장소의 `public/blocked-brands.json` 의
`brands` 에 넣으면 확장이 05:00 에 수집·보강한다.

| 브랜드 | 저장 키 | 빈 상품 | 표본 차단 |
|---|---|---:|---:|
| Aerie | ae.com.aerie | 114/114 | 3/3 |
| Aritzia | aritzia.com.aritzia | 366/366 | 3/3 |
| Eileen fisher | eileenfisher.com.eileenfisher | 266/266 | 3/3 |
| Fatface | fatface.com.fatface | 549/549 | 3/3 |
| L.L bean | global.llbean.com.llbean | 226/226 | 3/3 |
| Joules | joules.com.joules | 298/298 | 3/3 |
| Lucky Brand | luckybrand.com.luckybrand | 149/149 | 3/3 |
| Paige | paige.com.paige | 51/51 | 3/3 |
| Patagonia | patagonia.com.patagonia | 203/203 | 3/3 |
| Lululemon | shop.lululemon.com.lululemon | 91/91 | 3/3 |
| Wilson | wilson.com.wilson | 40/40 | 3/3 |
| H&M | www2.hm.com.hm | 326/326 | 3/3 |
| Sezane | sezane.com.sezane | 166/167 | 3/3 |
| J crew | jcrew.com.jcrew | 188/190 | 3/3 |
| FP Movement | freepeople.com.fpmovement | 45/46 | 3/3 |
| Lands end | landsend.com.landsend | 14/15 | 3/3 |
| Anthropologie | anthropologie.com.anthropologie | 83/89 | 3/3 |
| Free People | freepeople.com.freepeople | 69/74 | 3/3 |
| Addidas | adidas.com.addidas | 406/552 | 3/3 |
| Seasalt cornwall | seasaltcornwall.com.seasaltcornwall | 152/280 | 3/3 |
| Abercrombie & Fitch | abercrombie.com.abercrombiefitch | 129/240 | 3/3 |
| &Other Stories | stories.com.otherstories | 93/293 | 3/3 |
| Theory | theory.com.theory | 43/143 | 3/3 |
| Sessun | en.sessun.com.sessun | 2/18 | 2/2 |

## 🔧 추출 규칙을 고쳐야 하는 브랜드 (46)

| 브랜드 | 저장 키 | 빈 상품 | 표본 규칙누락 |
|---|---|---:|---:|
| Boldest | kolonmall.com.boldest | 194/201 | 2/3 |
| Stateside | shopstateside.us.stateside | 269/323 | 2/3 |
| Everlane | everlane.com.everlane | 307/380 | 3/3 |
| Dickies | dickies.com.dickies | 245/304 | 3/3 |
| Goldie | goldietees.com.goldie | 123/153 | 3/3 |
| Evereve | evereve.com.evereve | 344/450 | 3/3 |
| Beyond yoga | beyondyoga.com.beyondyoga | 171/228 | 3/3 |
| On | on.com.on | 120/163 | 3/3 |
| Marine Layer | marinelayer.com.marinelayer | 129/183 | 3/3 |
| Citizens of Humanity | citizensofhumanity.com.citizensofhumanity | 147/209 | 3/3 |
| Z Supply | zsupplyclothing.com.zsupply | 183/292 | 3/3 |
| Ninety Percent | ninetypercent.com.ninetypercent | 110/182 | 3/3 |
| Leset | leset.com.leset | 117/208 | 3/3 |
| Nation LTD | nation.la.nationltd | 106/192 | 3/3 |
| Michael Stars | michaelstars.com.michaelstars | 106/208 | 2/3 |
| Eddie bauer | eddiebauer.com.eddiebauer | 55/113 | 2/3 |
| rouje | rouje.com.rouje | 108/222 | 2/3 |
| Monsoon | monsoonlondon.com.monsoon | 15/31 | 3/3 |
| Outdoorvoices | outdoorvoices.com.outdoorvoices | 61/128 | 2/3 |
| Frame | frame-store.com.frame | 71/162 | 3/3 |
| Reformation | thereformation.com.reformation | 157/383 | 3/3 |
| Poetry | poetryfashion.co.uk.poetry | 158/388 | 3/3 |
| J.jill | jjill.com.jjill | 34/89 | 3/3 |
| The upside | theupside.com.theupside | 126/341 | 2/3 |
| Damson Madder | damsonmadder.com.damsonmadder | 77/216 | 3/3 |
| Spanx | spanx.com.spanx | 31/97 | 3/3 |
| Cotton citizen | cottoncitizen.com.cottoncitizen | 95/307 | 3/3 |
| Sweaty betty | sweatybetty.com.sweatybetty | 89/353 | 3/3 |
| Nike | nike.com.nike | 108/469 | 3/3 |
| Rails | rails.com.rails | 66/312 | 3/3 |
| Club monaco | clubmonaco.com.clubmonaco | 22/109 | 3/3 |
| English factory | shopenglishfactory.com.englishfactory | 46/230 | 2/3 |
| Greyson | greysonclothiers.com.greyson | 13/66 | 3/3 |
| Vuori | vuoriclothing.com.vuori | 41/210 | 3/3 |
| Vanessa bruno | vanessabruno.com.vanessabruno | 17/90 | 3/3 |
| Wrap | wraplondon.com.wrap | 84/469 | 3/3 |
| Bassike | bassike.com.bassike | 38/219 | 3/3 |
| Gestuz | gestuz.com.gestuz | 105/667 | 2/3 |
| Faherty | fahertybrand.com.faherty | 30/193 | 3/3 |
| Mango | shop.mango.com.mango | 7/48 | 3/3 |
| Monrow | monrow.com.monrow | 27/205 | 3/3 |
| Carlhartt | carhartt.com.carlhartt | 3/23 | 3/3 |
| Project Social T | projectsocialt.com.projectsocialt | 32/254 | 3/3 |
| La Ligne | lalignenyc.com.laligne | 42/364 | 3/3 |
| Chico's | chicos.com.chicos | 38/343 | 3/3 |
| Alo | aloyoga.com.alo | 21/191 | 3/3 |

## ⏳ 다시 읽기만 하면 채워지는 브랜드 (7)

Buck Mason(136) · Frank & Eileen(341) · Xirena(272) · Boden(162) · Oak + Fort(243) · Bellerose(198) · The Great(59)

## — 사이트가 혼용률을 안 적는 브랜드 (17)

Ann Taylor · Oysho · Prana · The white company · Zara · Mint velvet · Splendid · Loft · Jigsaw · ALC · Coldwatercreek · Scoth & soda · Oasis · Splits59 · Me+Em · Good American · Tuckernuck

