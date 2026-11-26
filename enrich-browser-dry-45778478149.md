# 혼용률 보강 — 진짜 크롬 (2026-11-26 08:20Z)

평 fetch 로는 차단되는 브랜드를 진짜 브라우저(크롬·파이어폭스)로 다시 읽은 결과입니다.

- 시도 135개 · **채움 38개** (28%)
- (저장하지 않음 — DRY 실행)

- 엔진: firefox

| 브랜드 | 엔진 | 상품 | 시도 | 채움 | 사이트 미표기 | 껍데기 | 차단·타임아웃 | 오류 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Chico's | firefox | 800 | 15 | **1** | 0 | 0 | 14 | 0 |
| Everlane | firefox | 443 | 15 | **0** | 15 | 0 | 0 | 0 |
| Garnet hill | firefox | 108 | 15 | **0** | 0 | 1 | 14 | 0 |
| J crew | firefox | 202 | 15 | **15** | 0 | 0 | 0 | 0 |
| Massimo Dutti | firefox | 606 | 15 | **7** | 0 | 8 | 0 | 0 |
| Reformation | firefox | 800 | 15 | **0** | 1 | 0 | 14 | 0 |
| The upside | firefox | 429 | 15 | **0** | 0 | 1 | 14 | 0 |
| WHBM | firefox | 219 | 15 | **0** | 0 | 0 | 15 | 0 |
| Zara | firefox | 499 | 15 | **15** | 0 | 0 | 0 | 0 |

껍데기 = 차단 화면은 아닌데 이 상품의 본문(상품명)이 화면에 안 그려진 페이지. 미표기(none)로 적지 않고 차단과 같이 센다.

차단·타임아웃이 대부분이면 진짜 크롬으로도 안 된다는 뜻이므로, 그 브랜드는
사람 PC 의 확장(가정용 IP)이 맡아야 합니다. '사이트 미표기'가 대부분이면
더 할 수 있는 것이 없습니다 — 엑셀에 '정보 없음'으로 나갑니다.

<details><summary>껍데기로 센 페이지 예 10개(제목 + 화면 글 앞부분)</summary>

- Garnet hill · A holiday decor and gifts personalized for your person. SHOP — https://www.garnethill.com/holiday-gifts/shops/cashmere-gifts/
  > Cashmere Gifts Skip to content Skip to footer Garnet hill logo submit Search
- Massimo Dutti · Long-sleeve crewneck t-shirt in a mid-shot with a mock neck  — https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
  > Striped henley knit T-shirt · Navy Blue · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG STRIPED HENLEY KNIT T-SHIRT $90 Colour Navy Blue A
- Massimo Dutti · Oyster-white fitted sleeveless T-shirt with a round neckline — https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918
  > Cotton blend bib detail T-shirt · Off White · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG COTTON BLEND BIB DETAIL T-SHIRT Colour Off Whi
- Massimo Dutti · Medium shot of a dark camel-colored long-sleeve shirt. It fe — https://www.massimodutti.com/us/long-sleeve-mock-neck-tshirt-l06285106
  > Long sleeve mock neck T-shirt · Dark Camel · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG LONG SLEEVE MOCK NECK T-SHIRT Colour Dark Camel
- Massimo Dutti · Brown striped long-sleeve, crew-neck sweatshirt set with lig — https://www.massimodutti.com/us/striped-interlock-sweatshirt-l06211810
  > Striped interlock sweatshirt · Brown · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG STRIPED INTERLOCK SWEATSHIRT Colour Brown ADD TO BASK
- Massimo Dutti · Close-up of the neckline of a black V-neck T-shirt with lace — https://www.massimodutti.com/us/long-sleeve-tshirt-with-lingerieinspired-detail-l06874575
  > Long sleeve T-shirt with lingerie-inspired detail · Brown, Black · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG LONG SLEEVE T-SHIRT WITH 
- Massimo Dutti · Set of a royal blue long-sleeved crewneck sweater, dark jean — https://www.massimodutti.com/us/cotton-blend-knit-tshirt-l06270106
  > Cotton blend knit T-shirt · Bluish, Medium Camel, Pale Grey · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG COTTON BLEND KNIT T-SHIRT Colo
- Massimo Dutti · Medium shot of a long-sleeve striped polo in beige, black, a — https://www.massimodutti.com/us/long-sleeve-striped-woolblend-polo-l06266106
  > Long sleeve striped wool-blend polo · Mink · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG LONG SLEEVE STRIPED WOOL-BLEND POLO Colour Mink
- Massimo Dutti · round-neck tank top set with spaghetti straps, wide-leg blac — https://www.massimodutti.com/us/cotton-blend-strappy-top-l06612200
  > Cotton blend strappy top · Off White · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG COTTON BLEND STRAPPY TOP Colour Off White ADD TO BASK
- The upside · Header Submenu Image — https://www.theupside.com/active/tops/sports-bras/
  > Sports Bras / THE UPSIDE This website uses cookies We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. W

</details>

<details><summary>읽은 혼용률 38개 — 상품명과 함께(⚠ 는 상품명과 안 맞아 보이는 것)</summary>

| 브랜드 | 상품명 | 혼용률 | 확인 |
|---|---|---|---|
| Chico's | [Touch of Cool™ Cheetah V-Neck Layering Tee](https://www.chicos.com/store/product/touch-of-cool-cheetah-v-neck-layering-tee/570418143?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761355020) | Viscose 95% / Elastane 5% |  |
| J crew | [MQ341](https://www.jcrew.com/m/womens/categories/clothing/matching-sets/MQ341) | Cotton 93% / Elastane 7% |  |
| J crew | [MQ334](https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ334) | Cotton 57% / Lyocell 39% / Elastane 4% |  |
| J crew | [MQ426](https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ426) | Cotton 60% / Polyester 40% |  |
| J crew | [CX829](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CX829) | Cotton 57% / Modal 39% / Elastane 4% |  |
| J crew | [CZ988](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CZ988) | Cotton 100% |  |
| J crew | [DA232](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/DA232) | Polyester 95% / Elastane 5% ‖ Polyester 92% / Elastane 8% | ⚠ 두 줄 |
| J crew | [CS373](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/tanks-and-camis/CS373) | Cotton 100% |  |
| J crew | [BY359](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/BY359) | Cotton 100% |  |
| J crew | [MQ279](https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ279) | Cotton 100% |  |
| J crew | [CZ835](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CZ835) | Cotton 57% / Lyocell 39% / Elastane 4% |  |
| J crew | [CZ859](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CZ859) | Cotton 60% / Polyester 40% |  |
| J crew | [ME842](https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/ME842) | Cotton 100% |  |
| J crew | [CT029](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CT029) | Cotton 57% / Lyocell 39% / Elastane 4% |  |
| J crew | [DA168](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/DA168) | Cotton 100% |  |
| J crew | [CZ403](https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CZ403) | Cotton 60% / Polyester 40% |  |
| Massimo Dutti | [Close-up of the neckline of a black T-shirt with a crew neck and front](https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575) | Lyocell 70% / Wool 30% |  |
| Massimo Dutti | [Red long-sleeved henley shirt, dark jeans, and beige trench coat set.](https://www.massimodutti.com/us/100-cotton-henley-tshirt-l06203115) | Cotton 100% |  |
| Massimo Dutti | [Set consisting of a white short-sleeve T-shirt and dark blue jeans wit](https://www.massimodutti.com/us/100-cotton-interlock-vneck-tshirt-l06834542) | Cotton 100% |  |
| Massimo Dutti | [Long-sleeve polo set in oyster-white with a buttoned collar, straight-](https://www.massimodutti.com/us/100-cotton-long-sleeve-polo-shirt-l06204115) | Cotton 100% |  |
| Massimo Dutti | [White short-sleeve T-shirt set with a crew neck and button-front plack](https://www.massimodutti.com/us/100-cotton-short-sleeve-henley-tshirt-l06856820) | Cotton 100% |  |
| Massimo Dutti | [Mid-length shot of a long-sleeve T-shirt in oyster-white with a crew n](https://www.massimodutti.com/us/100-cotton-long-sleeve-tshirt-l06882820) | Cotton 100% |  |
| Massimo Dutti | [fitted t-shirt set, short sleeves and round neck, blue jeans with fron](https://www.massimodutti.com/us/ribbed-short-sleeve-tshirt-l06247810) | Cotton 100% |  |
| Zara | [RUSTIC COTTON T-SHIRT](https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424807.html?v1=605310761) | Cotton 99% / Viscose 1% |  |
| Zara | [MOCK NECK T-SHIRT](https://www.zara.com/us/en/mock-neck-t-shirt-p03641857.html?v1=575974479) | Cotton 48% / Modal 47% / Elastane 5% |  |
| Zara | [LONG SLEEVE COTTON T-SHIRT](https://www.zara.com/us/en/long-sleeve-cotton-t-shirt-p04424802.html?v1=605502545) | Cotton 48% / Modal 47% / Elastane 5% |  |
| Zara | [OVERSIZED STRIPED T-SHIRT](https://www.zara.com/us/en/striped-oversize-t-shirt-p00858742.html?v1=583447043) | Cotton 100% |  |
| Zara | [LYOCELL T-SHIRT](https://www.zara.com/us/en/lyocell-t-shirt-p03431648.html?v1=580218597) | Lyocell 76% / Silk 19% / Elastane 5% |  |
| Zara | [CONTRAST COLLAR STRIPED POLO](https://www.zara.com/us/en/contrast-collar-striped-polo-p00858743.html?v1=583452669) | Cotton 100% |  |
| Zara | [LYOCELL RAGLAN SLEEVE T-SHIRT](https://www.zara.com/us/en/lyocell-raglan-sleeve-t-shirt-p03431649.html?v1=580218600) | Lyocell 76% / Silk 19% / Elastane 5% |  |
| Zara | [HEAVY COTTON SHORT SLEEVE T-SHIRT](https://www.zara.com/us/en/heavy-cotton-short-sleeve-t-shirt-p03253810.html?v1=551451502) | Cotton 100% |  |
| Zara | [COTTON STRAP TOP](https://www.zara.com/us/en/cotton-strap-top-p04424626.html?v1=547344104) | Cotton 50% / Modal 50% |  |
| Zara | [NBA LOS ANGELES LAKERS T-SHIRT](https://www.zara.com/us/en/nba-los-angeles-lakers-t-shirt-p00085155.html?v1=580472382) | Cotton 100% |  |
| Zara | [COTTON SHORT SLEEVE T-SHIRT](https://www.zara.com/us/en/short-sleeve-cotton-t-shirt-p06912628.html?v1=547524837) | Cotton 100% |  |
| Zara | [CROPPED SHORT SLEEVE T-SHIRT](https://www.zara.com/us/en/cropped-short-sleeve-t-shirt-p03641305.html?v1=545422656) | Cotton 48% / Modal 47% / Elastane 5% |  |
| Zara | [COMBINATION T-SHIRT](https://www.zara.com/us/en/combination-t-shirt-p05580451.html?v1=555020298) | Cotton 100% |  |
| Zara | [STRIPED T-SHIRT WITH STOPPERS](https://www.zara.com/us/en/striped-t-shirt-with-stoppers-p01165100.html?v1=548740029) | Cotton 100% |  |
| Zara | [COTTON V-NECK T-SHIRT](https://www.zara.com/us/en/cotton-v-neck-t-shirt-p04174635.html?v1=547559709) | Cotton 100% |  |

</details>
