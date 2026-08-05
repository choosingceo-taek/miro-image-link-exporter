# 혼용률 미채움 원인 (2026-08-05T11:01Z)

브랜드 7개 · 표본 28개

| 원인 | 표본 | 손댈 곳 |
|---|---:|---|
| 성공 | 0 | 재시도 창에 갇혀 있을 뿐 — RETRY_ALL=1 로 한 번 돌리면 채워진다 |
| 차단 | 0 | 서버 IP 로는 못 읽는다 — 확장(가정용 IP) 담당으로 옮겨야 한다 |
| 규칙 누락 | 27 | 페이지에 값이 있는데 못 뽑았다 — 추출 규칙을 고친다 |
| 정보 없음 | 1 | 사이트가 안 적는다 — 더 할 수 있는 게 없다 |

## 🔧 추출 규칙을 고쳐야 하는 브랜드 (7)

| 브랜드 | 저장 키 | 빈 상품 | 표본 규칙누락 |
|---|---|---:|---:|
| Goldie | goldietees.com.goldie | 123/153 | 4/4 |
| Everlane | everlane.com.everlane | 265/362 | 4/4 |
| Stateside | shopstateside.us.stateside | 232/322 | 3/4 |
| Dickies | dickies.com.dickies | 202/301 | 4/4 |
| Reformation | thereformation.com.reformation | 163/382 | 4/4 |
| Evereve | evereve.com.evereve | 149/453 | 4/4 |
| Nike | nike.com.nike | 107/468 | 4/4 |

### 못 뽑은 본문

**Goldie**
- (쇼피JSON 본문) `…r with our Stella Flare Pant for more of a good thing. 100% Peruvian pima cotton Premium double-faced pima with a cloud-like, cozy feel Made in Peru Body length: 21" Machine wash…`
- (쇼피JSON 본문) `…th jeans, a blazer and some lipstick—and you’re done. 100% Peruvian pima cotton Signature slub jersey with a light, silky texture Made in Peru Body length: 23” Machine wash…`

**Everlane**
- (페이지 본문) `…ontact us . CHAT WITH AN EXPERT Materials & Care Materials: 90% LENZING™ ECOVERO™ Viscose, 10% Elastane Why It&#39;s Better This style is made with responsibly-sourced viscose. LENZING™ ECOVERO™ visco…`
- (페이지 본문) `…ontact us . CHAT WITH AN EXPERT Materials & Care Materials: 90% LENZING™ ECOVERO™ Viscose, 10% Elastane Why It&#39;s Better This style is made with responsibly-sourced viscose. LENZING™ ECOVERO™ visco…`

**Stateside**
- (쇼피JSON 본문) `…and back. Made in the States. Fabric Information: Our 100% Supima Cotton Slub Jersey is a lightweight knit that is comfortable and has a great aesthetic. The technique of twisting the yarn into…`
- (쇼피JSON 본문) `…and back. Made in the States. Fabric Information: Our 100% Supima Cotton Slub Jersey is a lightweight knit that is comfortable and has a great aesthetic. The technique of twisting the yarn into…`

**Dickies**
- (페이지 본문) `…ughest jobs. Tagless label for non-chafing comfort 6.75 oz. 100% Cotton Jersey, Heavyweight Heather Gray: 90% Cotton/10% Polyester Imported MORE LIKE THIS Previous Slide Next Slide Available Colors Wo…`
- (페이지 본문) `…ughest jobs. Tagless label for non-chafing comfort 6.75 oz. 100% Cotton Jersey, Heavyweight Heather Gray: 90% Cotton/10% Polyester Imported MORE LIKE THIS Previous Slide Next Slide Available Colors Wo…`

**Reformation**
- (페이지 본문) `…enty of stretch. For being comfortable in public. Made from 67% TENCEL™ Lyocell, 29% Organically Grown Cotton, and 4% Elastane. Hand wash + dry flat. TENCEL™ Lyocell comes from Eucalyptus trees, which…`
- (페이지 본문) `…enty of stretch. For being comfortable in public. Made from 67% TENCEL™ Lyocell, 29% Organically Grown Cotton, and 4% Elastane. TENCEL™ Lyocell comes from Eucalyptus trees, which take only half an acr…`

**Evereve**
- (페이지 본문) `…om Shoulder to Hem: 21" Material & Care Material: 48% Pima, 48% Modal, 4% Spandex Jersey Care: Machine Wash,Wash Cold,Delicate / Gentle Cycle,Tumble Dry Low Style #: EVSU26KT50-GX Evereve Size Guide E…`
- (페이지 본문) `…gth from Shoulder to Hem: 22 1/2" Material & Care Material: 56% Viscose Filament, 44% Spun Rayon; Contrast: 95% Rayon, 5% Spandex; Binding: 95% Modal, 5% Spandex Care: Hand Wash,Wash Cold,Dry Flat,Do…`

**Nike**
- (페이지 본문) `…ave, wishlist non-filled This product is made with at least 75% recycled polyester fibers Meet your new favorite workout essential. Made from soft fabric that stretches with your every move, this snug…`
- (페이지 본문) `…always-comfortable top its updated look. Product Details 50-100% cotton/0-50% polyester Material percentages may vary. Check label for actual content. Embroidered logo Machine wash Imported Shown: Pin…`

