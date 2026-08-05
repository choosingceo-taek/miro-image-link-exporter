# 혼용률 미채움 원인 (2026-08-05T12:08Z)

브랜드 40개 · 표본 160개

| 원인 | 표본 | 손댈 곳 |
|---|---:|---|
| 성공 | 4 | 재시도 창에 갇혀 있을 뿐 — RETRY_ALL=1 로 한 번 돌리면 채워진다 |
| 차단 | 88 | 서버 IP 로는 못 읽는다 — 확장(가정용 IP) 담당으로 옮겨야 한다 |
| 규칙 누락 | 21 | 페이지에 값이 있는데 못 뽑았다 — 추출 규칙을 고친다 |
| 정보 없음 | 47 | 사이트가 안 적는다 — 더 할 수 있는 게 없다 |

## ⛔ 확장 담당으로 옮겨야 하는 브랜드 (22)

표본의 절반 이상이 '차단'이다. 서버 프리페치가 아무리 돌아도 이 브랜드의
혼용률은 안 채워진다. Render 저장소의 `public/blocked-brands.json` 의
`brands` 에 넣으면 확장이 05:00 에 수집·보강한다.

| 브랜드 | 저장 키 | 빈 상품 | 표본 차단 |
|---|---|---:|---:|
| Aerie | ae.com.aerie | 114/114 | 4/4 |
| Fatface | fatface.com.fatface | 547/547 | 4/4 |
| Garnet hill | garnethill.com.garnethill | 118/118 | 4/4 |
| Joules | joules.com.joules | 306/306 | 4/4 |
| Lucky Brand | luckybrand.com.luckybrand | 234/234 | 4/4 |
| Patagonia | patagonia.com.patagonia | 202/202 | 4/4 |
| Lululemon | shop.lululemon.com.lululemon | 79/79 | 4/4 |
| Wilson | wilson.com.wilson | 41/41 | 4/4 |
| H&M | www2.hm.com.hm | 740/741 | 4/4 |
| Sezane | sezane.com.sezane | 166/167 | 4/4 |
| J crew | jcrew.com.jcrew | 188/192 | 4/4 |
| FP Movement | freepeople.com.fpmovement | 66/68 | 4/4 |
| Free People | freepeople.com.freepeople | 148/154 | 4/4 |
| Anthropologie | anthropologie.com.anthropologie | 137/147 | 4/4 |
| Addidas | adidas.com.addidas | 391/420 | 4/4 |
| Eileen fisher | eileenfisher.com.eileenfisher | 285/343 | 4/4 |
| Aritzia | aritzia.com.aritzia | 370/465 | 4/4 |
| Madewell | madewell.com.madewell | 11/16 | 4/4 |
| Paige | paige.com.paige | 32/57 | 4/4 |
| Seasalt cornwall | seasaltcornwall.com.seasaltcornwall | 152/280 | 4/4 |
| Abercrombie & Fitch | abercrombie.com.abercrombiefitch | 129/241 | 4/4 |
| L.L bean | global.llbean.com.llbean | 139/322 | 4/4 |

## 🔧 추출 규칙을 고쳐야 하는 브랜드 (6)

| 브랜드 | 저장 키 | 빈 상품 | 표본 규칙누락 |
|---|---|---:|---:|
| Boldest | kolonmall.com.boldest | 189/203 | 3/4 |
| On | on.com.on | 100/142 | 4/4 |
| Dickies | dickies.com.dickies | 201/301 | 4/4 |
| Everlane | everlane.com.everlane | 228/362 | 4/4 |
| Monsoon | monsoonlondon.com.monsoon | 18/32 | 4/4 |
| Stateside | shopstateside.us.stateside | 171/322 | 2/4 |

### 못 뽑은 본문

**Boldest**
- (페이지 JSON/스크립트) `…ucher","code":"2MEJ","value":"10","symbol":"%","name":"칠링썸머 10%","formattedDownEndDate":"2026-08-09","downEndDate":"1786287599000","useEndDate":"1786287599000","useStartDate":"1785718800000","downUseP…`
- (페이지 JSON/스크립트) `…ucher","code":"2MEJ","value":"10","symbol":"%","name":"칠링썸머 10%","formattedDownEndDate":"2026-08-09","downEndDate":"1786287599000","useEndDate":"1786287599000","useStartDate":"1785718800000","downUseP…`

**On**
- (페이지 본문) `…ed cold Materials &amp; Transparency Materials Main Fabric: Polyester (recycled) 69%, Elastane 31%. Country of origin Vietnam…`
- (페이지 본문) `…ed cold Materials &amp; Transparency Materials Main Fabric: Polyester (recycled) 69%, Elastane 31%. Country of origin Vietnam…`

**Dickies**
- (페이지 본문) `…ughest jobs. Tagless label for non-chafing comfort 6.75 oz. 100% Cotton Jersey, Heavyweight Heather Gray: 90% Cotton/10% Polyester Imported MORE LIKE THIS Previous Slide Next Slide Available Colors Wo…`
- (페이지 본문) `…ughest jobs. Tagless label for non-chafing comfort 6.75 oz. 100% Cotton Jersey, Heavyweight Heather Gray: 90% Cotton/10% Polyester Imported MORE LIKE THIS Previous Slide Next Slide Available Colors Wo…`

**Everlane**
- (페이지 본문) `…ontact us . CHAT WITH AN EXPERT Materials & Care Materials: 50% Organic Cotton, 50% Cotton Care: Machine Wash Cold. Gentle Cycle with Like Colors. Only Non-Chlorine Bleach When Needed. Reshape Dry Fla…`
- (페이지 본문) `…p; Accessories womens / Tees The Boyfriend Tee in Essential Cotton 40% OFF Regular price $29 Regular price $48 Sale price $29 Unit price / &nbsp;per&nbsp; 40% OFF Skip to product information Loading O…`

**Monsoon**
- (페이지 본문) `…Details Learn more about the materials we use here . Outer: Cotton (b) 60% , Modal 40% L 60 CM machine wash Pull on Vneck Short sleeves Plain Weight: 180 ID: 10019650016 Delivery & Returns DELIVERY: W…`
- (페이지 본문) `…to zoom Click to zoom Click to zoom Click to zoom Wishlist 70% OFF Sasha Stripe Linen Blend T-Shirt Red &euro; 19,20 Price reduced from &euro; 64,00 to 5 out of 5 Customer Rating Reviews Colour: Red…`

**Stateside**
- (페이지 본문) `…and lightweight to wear. #HO25-690-6118-CREA Content + Care 53% Rayon 45% Viscose 2% Spandex Made in the USA Model wears size small. Review our&nbsp; SIZE CHART &nbsp;for sizing help SKU HO25-690-6118…`
- (페이지 본문) `…exceptional high quality. #D23-434-5374-WSB Content + Care 48% Supima Cotton 48% Micro Modal 4% Spandex Made in the USA Machine wash cold. No Bleach. Tumble dry low heat. Cool iron. SKU D23-434-5374-…`

## ⏳ 다시 읽기만 하면 채워지는 브랜드 (1)

Buck Mason(128)

## — 사이트가 혼용률을 안 적는 브랜드 (12)

Massimo Dutti · Oysho · Prana · The white company · Zara · Mint velvet · Loft · Splendid · rouje · Coldwatercreek · Stateside · Ann Taylor

