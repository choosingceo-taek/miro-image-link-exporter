# 혼용률 보강 — 진짜 크롬 (2026-11-26 08:05Z)

평 fetch 로는 차단되는 브랜드를 진짜 브라우저(크롬·파이어폭스)로 다시 읽은 결과입니다.

- 시도 135개 · **채움 57개** (42%)
- (저장하지 않음 — DRY 실행)

- 엔진: firefox

| 브랜드 | 엔진 | 상품 | 시도 | 채움 | 사이트 미표기 | 껍데기 | 차단·타임아웃 | 오류 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Chico's | firefox 새 창 | 800 | 15 | **3** | 0 | 0 | 12 | 0 |
| Everlane | firefox 새 창 | 443 | 15 | **0** | 15 | 0 | 0 | 0 |
| Garnet hill | firefox 새 창 | 108 | 15 | **1** | 5 | 9 | 0 | 0 |
| J crew | firefox 새 창 | 202 | 15 | **15** | 0 | 0 | 0 | 0 |
| Massimo Dutti | firefox 새 창 | 606 | 15 | **11** | 0 | 4 | 0 | 0 |
| Reformation | firefox 새 창 | 800 | 15 | **6** | 7 | 1 | 1 | 0 |
| The upside | firefox 새 창 | 429 | 15 | **6** | 0 | 9 | 0 | 0 |
| WHBM | firefox 새 창 | 219 | 15 | **0** | 0 | 0 | 15 | 0 |
| Zara | firefox 새 창 | 499 | 15 | **15** | 0 | 0 | 0 | 0 |

껍데기 = 차단 화면은 아닌데 이 상품의 본문(상품명)이 화면에 안 그려진 페이지. 미표기(none)로 적지 않고 차단과 같이 센다.

차단·타임아웃이 대부분이면 진짜 크롬으로도 안 된다는 뜻이므로, 그 브랜드는
사람 PC 의 확장(가정용 IP)이 맡아야 합니다. '사이트 미표기'가 대부분이면
더 할 수 있는 것이 없습니다 — 엑셀에 '정보 없음'으로 나갑니다.

<details><summary>껍데기로 센 페이지 예 12개(제목 + 화면 글 앞부분)</summary>

- Garnet hill · A holiday decor and gifts personalized for your person. SHOP — https://www.garnethill.com/holiday-gifts/shops/gifts-under-100/
  > Gifts Under $100 Skip to content Skip to footer Garnet hill logo submit Search Page of Items Page of
- Garnet hill · A holiday decor and gifts personalized for your person. SHOP — https://www.garnethill.com/holiday-gifts/shops/gifts-for-her/
  > Holiday & Christmas Gifts for Her Skip to content Skip to footer Garnet hill logo submit Search Page of Items Page of
- Garnet hill · A holiday decor and gifts personalized for your person. SHOP — https://www.garnethill.com/holiday-gifts/shops/gifts-for-kids/
  > Christmas & Holiday Gifts for Kids Skip to content Skip to footer Garnet hill logo submit Search Page of Items Page of
- Garnet hill · A holiday decor and gifts personalized for your person. SHOP — https://www.garnethill.com/holiday-gifts/shops/family-pajamas/
  > Pajamas For The Family Skip to content Skip to footer Garnet hill logo submit Search Page of Items Page of
- Garnet hill · A holiday decor and gifts personalized for your person. SHOP — https://www.garnethill.com/holiday-gifts/shops/holiday-dressing/
  > Women's Holiday Clothing Skip to content Skip to footer Garnet hill logo submit Search Page of Items Page of
- Garnet hill · Cashmere knitted hats, scarves, and gloves in a variety of c — https://www.garnethill.com/bedding-home/decor/holiday-decor/
  > Holiday Decor Skip to content Skip to footer Garnet hill logo submit Search Home Bedding & Home Home Decor Holiday Decor Holiday Decor Page of Items Page of Rel
- Garnet hill · Woman wearing a green cashmere sweater standing in a snowy f — https://www.garnethill.com/clothing/features/brands-we-love/
  > Brands We Love: Women's Clothing Skip to content Skip to footer Give the Gift of Cashmere - Shop Now! FREE Design Services Refer a Friend / Give 25% off, Get 25
- Garnet hill · Woman wearing a green cashmere sweater standing in a snowy f — https://www.garnethill.com/clothing/features/top-rated-clothing/
  > Top-Rated Women's Clothing Skip to content Skip to footer Garnet hill logo submit Search Home Clothing Features Top-Rated Clothing Top-Rated Clothing Page of It
- Garnet hill · Woman wearing a green cashmere sweater standing in a snowy f — https://www.garnethill.com/clothing/features/the-linen-shop/
  > The Linen Shop: Women's Clothing Skip to content Skip to footer Garnet hill logo submit Search Home Clothing Features The Linen Shop The Linen Shop Page of Item
- Massimo Dutti · Long-sleeve crewneck t-shirt in a mid-shot with a mock neck  — https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
  > Striped henley knit T-shirt · Navy Blue · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG VIEW LOOK STRIPED HENLEY KNIT T-SHIRT $90 Colour N
- Massimo Dutti · Medium shot of a dark camel-colored long-sleeve shirt. It fe — https://www.massimodutti.com/us/long-sleeve-mock-neck-tshirt-l06285106
  > Long sleeve mock neck T-shirt · Dark Camel · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG VIEW LOOK LONG SLEEVE MOCK NECK T-SHIRT $90 -40
- Massimo Dutti · Set of a royal blue long-sleeved crewneck sweater, dark jean — https://www.massimodutti.com/us/cotton-blend-knit-tshirt-l06270106
  > Cotton blend knit T-shirt · Bluish, Medium Camel, Pale Grey · T-shirt / Massimo Dutti NEW IN WOMAN MAN MD WORLD SEARCH LOG IN BAG VIEW LOOK COTTON BLEND KNIT T-

</details>

<details><summary>읽은 혼용률 57개 — 상품명과 함께(⚠ 는 상품명과 안 맞아 보이는 것)</summary>

| 브랜드 | 상품명 | 혼용률 | 확인 |
|---|---|---|---|
| Chico's | [Touch of Cool™ Cheetah V-Neck Layering Tee](https://www.chicos.com/store/product/touch-of-cool-cheetah-v-neck-layering-tee/570418143?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761355020) | Viscose 95% / Elastane 5% |  |
| Chico's | [Shimmer Mockneck Layering Tee](https://www.chicos.com/store/product/shimmer-mockneck-layering-tee/570422708?inseam=regular&sizeType=regular&color=6844&catId=cat11199293&collectionId=category&parentId=199761617951) | Nylon 70% / Metallic 26% / Elastane 4% |  |
| Chico's | [Touch of Cool™ Striped Layering Tee](https://www.chicos.com/store/product/touch-of-cool-striped-layering-tee/570414533?inseam=regular&sizeType=regular&color=4636&catId=cat11199293&collectionId=category&parentId=199761185825) | Viscose 95% / Elastane 5% |  |
| Garnet hill | [Woman wearing a green cashmere sweater standing in a snowy field. shop](https://www.garnethill.com/clothing/features/the-cashmere-shop/) | Cashmere 100% |  |
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
| Massimo Dutti | [Oyster-white fitted sleeveless T-shirt with a round neckline, button-l](https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918) | Cotton 96% / Elastane 4% ‖ Cotton 97% / Elastane 3% | ⚠ 두 줄 |
| Massimo Dutti | [Red long-sleeved henley shirt, dark jeans, and beige trench coat set.](https://www.massimodutti.com/us/100-cotton-henley-tshirt-l06203115) | Cotton 100% |  |
| Massimo Dutti | [Brown striped long-sleeve, crew-neck sweatshirt set with light blue je](https://www.massimodutti.com/us/striped-interlock-sweatshirt-l06211810) | Cotton 99% / Elastane 1% |  |
| Massimo Dutti | [Close-up of the neckline of a black V-neck T-shirt with lace detailing](https://www.massimodutti.com/us/long-sleeve-tshirt-with-lingerieinspired-detail-l06874575) | Lyocell 70% / Wool 30% |  |
| Massimo Dutti | [Set consisting of a white short-sleeve T-shirt and dark blue jeans wit](https://www.massimodutti.com/us/100-cotton-interlock-vneck-tshirt-l06834542) | Cotton 100% |  |
| Massimo Dutti | [Long-sleeve polo set in oyster-white with a buttoned collar, straight-](https://www.massimodutti.com/us/100-cotton-long-sleeve-polo-shirt-l06204115) | Cotton 100% |  |
| Massimo Dutti | [round-neck tank top set with spaghetti straps, wide-leg black pleated ](https://www.massimodutti.com/us/cotton-blend-strappy-top-l06612200) | Cotton 96% / Elastane 4% |  |
| Massimo Dutti | [White short-sleeve T-shirt set with a crew neck and button-front plack](https://www.massimodutti.com/us/100-cotton-short-sleeve-henley-tshirt-l06856820) | Cotton 100% |  |
| Massimo Dutti | [Mid-length shot of a long-sleeve T-shirt in oyster-white with a crew n](https://www.massimodutti.com/us/100-cotton-long-sleeve-tshirt-l06882820) | Cotton 100% |  |
| Massimo Dutti | [fitted t-shirt set, short sleeves and round neck, blue jeans with fron](https://www.massimodutti.com/us/ribbed-short-sleeve-tshirt-l06247810) | Cotton 100% |  |
| Reformation | [Norette Knit Top - Crushed Violet](https://www.thereformation.com/products/norette-knit-top/1320799CUV.html) | Lyocell 67% / Cotton 29% / Elastane 4% |  |
| Reformation | [Keona Silk Top - Black](https://www.thereformation.com/products/keona-silk-top/1321132BLK.html) | Silk 100% |  |
| Reformation | [Iris Knit Top - Lipstick](https://www.thereformation.com/products/iris-knit-top/1318710LPS.html) | Lyocell 67% / Cotton 29% / Elastane 4% |  |
| Reformation | [Nox Knit Cardigan Set - Green Sparkle](https://www.thereformation.com/products/nox-knit-cardigan-set/1321146GEK.html) | Polyester 79% / Metallic 17% / Elastane 4% |  |
| Reformation | [Liara Silk Top - Black](https://www.thereformation.com/products/liara-silk-top/1321264BLK.html) | Silk 100% |  |
| Reformation | [Lewis Tee - Black](https://www.thereformation.com/products/lewis-tee/1318252BLK.html) | Cotton 100% |  |
| The upside | [CORVARA JAKARA PUFFER JACKET - CREME [USW426182]](https://www.theupside.com/corvara-jakara-puffer-jacket-creme-usw426182/) | Polyester 100% |  |
| The upside | [PANTHERA SOL FLEECE JACKET - LEOPARD [USW426169]](https://www.theupside.com/panthera-sol-fleece-jacket-leopard-usw426169/) | Polyester 100% |  |
| The upside | [DEL REY POINTELLE TANK TOP - BUTTER [USW426065]](https://www.theupside.com/del-rey-pointelle-tank-top-butter-usw426065/) | Cotton 100% |  |
| The upside | [MALI LONG SLEEVE TOP - COCONUT [USW426072]](https://www.theupside.com/mali-long-sleeve-top-coconut-usw426072/) | Cotton 100% |  |
| The upside | [PALOMA CREW - BUTTER [USW426053]](https://www.theupside.com/paloma-crew-butter-usw426053/) | Cotton 100% |  |
| The upside | [SAKINA SILK KNIT CARDIGAN - NATURAL [USW426131]](https://www.theupside.com/sakina-silk-knit-cardigan-natural-usw426131/) | Silk 55% / Cotton 45% |  |
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
