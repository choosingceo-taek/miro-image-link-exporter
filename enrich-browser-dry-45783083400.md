# 혼용률 보강 — 진짜 크롬 (2026-11-26 08:40Z)

평 fetch 로는 차단되는 브랜드를 진짜 브라우저(크롬·파이어폭스)로 다시 읽은 결과입니다.

- 시도 105개 · **채움 76개** (72%)
- (저장하지 않음 — DRY 실행)

- 엔진: firefox

| 브랜드 | 엔진 | 상품 | 시도 | 채움 | 사이트 미표기 | 껍데기 | 차단·타임아웃 | 오류 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Athleta | firefox | 407 | 15 | **15** | 0 | 0 | 0 | 0 |
| Banana Republic | firefox | 510 | 15 | **15** | 0 | 0 | 0 | 0 |
| Everlane | firefox | 443 | 15 | **0** | 15 | 0 | 0 | 0 |
| Gap | firefox | 481 | 15 | **15** | 0 | 0 | 0 | 0 |
| Mint velvet | firefox | 416 | 15 | **15** | 0 | 0 | 0 | 0 |
| Old Navy | firefox | 684 | 15 | **15** | 0 | 0 | 0 | 0 |
| Spanx | firefox | 120 | 15 | **1** | 14 | 0 | 0 | 0 |

껍데기 = 차단 화면은 아닌데 이 상품의 본문(상품명)이 화면에 안 그려진 페이지. 미표기(none)로 적지 않고 차단과 같이 센다.

차단·타임아웃이 대부분이면 진짜 크롬으로도 안 된다는 뜻이므로, 그 브랜드는
사람 PC 의 확장(가정용 IP)이 맡아야 합니다. '사이트 미표기'가 대부분이면
더 할 수 있는 것이 없습니다 — 엑셀에 '정보 없음'으로 나갑니다.

<details><summary>읽은 혼용률 76개 — 상품명과 함께(⚠ 는 상품명과 안 맞아 보이는 것)</summary>

| 브랜드 | 상품명 | 혼용률 | 확인 |
|---|---|---|---|
| Athleta | [Momentum Flex Top](https://athleta.gap.com/browse/product.do?pid=845688002) | Nylon 97% / Elastane 3% |  |
| Athleta | [Coaster Luxe Recover Sweatshirt](https://athleta.gap.com/browse/product.do?pid=659287752) | Lyocell 78% / Polyester 19% / Elastane 3% |  |
| Athleta | [Coaster Luxe Recover Sweatshirt](https://athleta.gap.com/browse/product.do?pid=659287002) | Lyocell 78% / Polyester 19% / Elastane 3% |  |
| Athleta | [Momentum Flex Top](https://athleta.gap.com/browse/product.do?pid=845688332) | Nylon 97% / Elastane 3% |  |
| Athleta | [Momentum Flex Top](https://athleta.gap.com/browse/product.do?pid=1177318052) | Nylon 97% / Elastane 3% |  |
| Athleta | [Coaster Luxe V-Neck Sweatshirt](https://athleta.gap.com/browse/product.do?pid=1174524092) | Lyocell 75% / Polyester 20% / Elastane 5% |  |
| Athleta | [Momentum Flex Tee](https://athleta.gap.com/browse/product.do?pid=845689102) | Nylon 100% |  |
| Athleta | [Move With Ease Tank](https://athleta.gap.com/browse/product.do?pid=784675372) | Polyester 56% / Modal 37% / Elastane 7% |  |
| Athleta | [Momentum Flex Muscle Tank](https://athleta.gap.com/browse/product.do?pid=845579202) | Nylon 97% / Elastane 3% |  |
| Athleta | [Momentum Flex Top](https://athleta.gap.com/browse/product.do?pid=845688032) | Nylon 97% / Elastane 3% |  |
| Athleta | [Coaster Luxe V-Neck Sweatshirt](https://athleta.gap.com/browse/product.do?pid=1174524022) | Lyocell 75% / Polyester 20% / Elastane 5% |  |
| Athleta | [Momentum Flex Top](https://athleta.gap.com/browse/product.do?pid=1177318012) | Nylon 97% / Elastane 3% |  |
| Athleta | [Coaster Luxe V-Neck Sweatshirt](https://athleta.gap.com/browse/product.do?pid=1174524102) | Lyocell 75% / Polyester 20% / Elastane 5% |  |
| Athleta | [Coaster Luxe Recover Sweatshirt](https://athleta.gap.com/browse/product.do?pid=659287502) | Lyocell 78% / Polyester 19% / Elastane 3% |  |
| Athleta | [Coaster Luxe Recover Sweatshirt](https://athleta.gap.com/browse/product.do?pid=659287732) | Lyocell 78% / Polyester 19% / Elastane 3% |  |
| Banana Republic | [Stretch-Satin Fringe Top](https://bananarepublic.gap.com/browse/product.do?pid=1203518002) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Cowl-Neck Halter Top](https://bananarepublic.gap.com/browse/product.do?pid=1183816012) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Layered Georgette Cropped Top](https://bananarepublic.gap.com/browse/product.do?pid=1180190002) | Viscose 100% ‖ Viscose 96% / Elastane 4% | ⚠ 두 줄 |
| Banana Republic | [Stretch-Satin Asymmetric Top](https://bananarepublic.gap.com/browse/product.do?pid=1203515002) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Twisted Halter Top](https://bananarepublic.gap.com/browse/product.do?pid=1203875012) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Layered Georgette Cropped Top](https://bananarepublic.gap.com/browse/product.do?pid=1180190012) | Viscose 100% ‖ Viscose 96% / Elastane 4% | ⚠ 두 줄 |
| Banana Republic | [Stretch-Satin Cropped Top](https://bananarepublic.gap.com/browse/product.do?pid=1203517002) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Asymmetric Top](https://bananarepublic.gap.com/browse/product.do?pid=1203515022) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Fringe Top](https://bananarepublic.gap.com/browse/product.do?pid=1203518012) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Twisted Halter Top](https://bananarepublic.gap.com/browse/product.do?pid=1203875002) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Asymmetric Top](https://bananarepublic.gap.com/browse/product.do?pid=1203515012) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Cropped Top](https://bananarepublic.gap.com/browse/product.do?pid=1203517012) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Tie-Back Top](https://bananarepublic.gap.com/browse/product.do?pid=1186894012) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Stretch-Satin Cowl-Neck Halter Top](https://bananarepublic.gap.com/browse/product.do?pid=1183816002) | Viscose 99% / Elastane 1% |  |
| Banana Republic | [Crinkle Chiffon Top](https://bananarepublic.gap.com/browse/product.do?pid=1183800012) | Viscose 100% |  |
| Gap | [VintageSoft Terry Oversized Wedge Side-Slit Sweatshirt](https://www.gap.com/browse/product.do?pid=1180261062) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Terry Oversized Wedge Side-Slit Sweatshirt](https://www.gap.com/browse/product.do?pid=1180261142) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Relaxed Hoodie](https://www.gap.com/browse/product.do?pid=523562322) | Cotton 77% / Polyester 23% |  |
| Gap | [Adult VintageSoft Relaxed Joggers](https://www.gap.com/browse/product.do?pid=903064172) | Cotton 77% / Polyester 23% |  |
| Gap | [Mid Rise VintageSoft Baggy Joggers](https://www.gap.com/browse/product.do?pid=903058062) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Oversized Half-Zip Wedge Pullover](https://www.gap.com/browse/product.do?pid=903061142) | Cotton 77% / Polyester 23% |  |
| Gap | [Adult VintageSoft Relaxed Joggers](https://www.gap.com/browse/product.do?pid=903064032) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Terry Oversized Wedge Side-Slit Sweatshirt](https://www.gap.com/browse/product.do?pid=1180261022) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Terry Oversized Wedge Side-Slit Sweatshirt](https://www.gap.com/browse/product.do?pid=1180261012) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Relaxed Hoodie](https://www.gap.com/browse/product.do?pid=523562342) | Cotton 77% / Polyester 23% |  |
| Gap | [Adult VintageSoft Relaxed Joggers](https://www.gap.com/browse/product.do?pid=903064012) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Terry Oversized Wedge Zip Hoodie](https://www.gap.com/browse/product.do?pid=1180111112) | Cotton 77% / Polyester 23% |  |
| Gap | [VintageSoft Terry Oversized Wedge Zip Hoodie](https://www.gap.com/browse/product.do?pid=1180111092) | Cotton 77% / Polyester 23% |  |
| Gap | [gap hoodie shop](https://www.gap.com/browse/new/gap-hoodie-shop) | Cotton 100% |  |
| Gap | [VintageSoft Wedge Zip Hoodie](https://www.gap.com/browse/product.do?pid=714577192) | Cotton 77% / Polyester 23% |  |
| Mint velvet | [Black Knit Sheer Sleeve Zip Detail Top](https://mintvelvet.com/products/black-knit-sheer-sleeve-zip-detail-top) | Nylon 52% / Viscose 48% ‖ Lyocell 84% / Polyester 16% | ⚠ 두 줄 |
| Mint velvet | [Cream Sheer Draped Asymmetric Top](https://mintvelvet.com/products/cream-draped-asymmetric-top) | Elastane 4% / Nylon 31% / Viscose 65% ‖ Polyester 100% | ⚠ 두 줄 |
| Mint velvet | [Black Sheer Draped Asymmetric Top](https://mintvelvet.com/products/black-draped-asymmetric-top-1) | Elastane 4% / Nylon 31% / Viscose 65% ‖ Polyester 100% | ⚠ 두 줄 |
| Mint velvet | [Black Velvet Butterfly Detail Top](https://mintvelvet.com/products/black-velvet-butterfly-detail-top) | Nylon 29% / Viscose 71% ‖ Polyester 100% | ⚠ 두 줄 |
| Mint velvet | [Gold Sequin Cut Out Waistcoat Top](https://mintvelvet.com/products/gold-sequin-waistcoat) | Polyester 89% / Cotton 2% / Metallic 7% / Viscose 2% ‖ Elastane 3% / Polyester 97% | ⚠ 두 줄 |
| Mint velvet | [Black Floral Mesh Devore Top](https://mintvelvet.com/products/black-floral-mesh-devore-top) | Elastane 15% / Nylon 48% / Polyester 37% ‖ Elastane 5% / Polyester 95% | ⚠ 두 줄 |
| Mint velvet | [Black Mesh Drape Embellished Top](https://mintvelvet.com/products/black-mesh-drape-embellished-top) | Polyester 95% / Elastane 5% ‖ Elastane 5% / Polyester 95% | ⚠ 두 줄 |
| Mint velvet | [Black Lace Mandarin Collar Top](https://mintvelvet.com/products/black-lace-mandarin-collar-top) | Lyocell 5% / Cotton 27% / Nylon 45% / Viscose 23% ‖ Elastane 6% / Viscose 94% | ⚠ 두 줄 |
| Mint velvet | [Black Sequin Fringe Detail Top](https://mintvelvet.com/products/black-sequin-tassel-detail-top) | Polyester 95% / Elastane 5% ‖ Elastane 5% / Polyester 95% | ⚠ 두 줄 |
| Mint velvet | [Black Metallic Knit Peplum Top](https://mintvelvet.com/products/black-metallic-knit-peplum-top) | Metallic 6% / Nylon 53% / Viscose 41% |  |
| Mint velvet | [Black Metallic Sleeveless Top](https://mintvelvet.com/products/black-metallic-sleeveless-top) | Metallic 21% / Nylon 12% / Viscose 67% |  |
| Mint velvet | [Brown Velvet Bubble Hem Top](https://mintvelvet.com/products/brown-velvet-bubble-hem-top) | Polyester 90% / Elastane 10% ‖ Elastane 5% / Viscose 95% | ⚠ 두 줄 |
| Mint velvet | [Burgundy Peplum Detail Top](https://mintvelvet.com/products/burgundy-peplum-detail-top) | Nylon 15% / Polyester 13% / Viscose 72% ‖ Polyester 100% | ⚠ 두 줄 |
| Mint velvet | [Pink Velvet Mandarin Collar Puff Sleeve Top](https://mintvelvet.com/products/pink-velvet-mandarin-collar-puff-sleeve-top) | Nylon 22% / Viscose 78% ‖ Elastane 3% / Polyester 97% | ⚠ 두 줄 |
| Mint velvet | [Animal Print Draped Detail Mesh Top](https://mintvelvet.com/products/animal-print-draped-detail-mesh-top) | Polyester 95% / Elastane 5% ‖ Elastane 5% / Polyester 95% | ⚠ 두 줄 |
| Old Navy | [Loose Sherpa Quarter-Zip Pullover](https://oldnavy.gap.com/browse/product.do?pid=903179002) | Cotton 60% / Polyester 40% |  |
| Old Navy | [Loose Sherpa Quarter-Zip Pullover](https://oldnavy.gap.com/browse/product.do?pid=903179022) | Cotton 60% / Polyester 40% |  |
| Old Navy | [Loose Sherpa Quarter-Zip Pullover](https://oldnavy.gap.com/browse/product.do?pid=903179032) | Cotton 60% / Polyester 40% |  |
| Old Navy | [Loose Sherpa Quarter-Zip Pullover](https://oldnavy.gap.com/browse/product.do?pid=903179042) | Cotton 60% / Polyester 40% |  |
| Old Navy | [Loose Sherpa Half-Zip Pullover](https://oldnavy.gap.com/browse/product.do?pid=903740012) | Polyester 100% |  |
| Old Navy | [Hooded Sherpa Vest](https://oldnavy.gap.com/browse/product.do?pid=916674002) | Polyester 100% ‖ Cotton 60% / Polyester 40% | ⚠ 두 줄 |
| Old Navy | [Logo Faux-Fur Trimmed Zip Hoodie Sweatshirt](https://oldnavy.gap.com/browse/product.do?pid=1186791012) | Cotton 80% / Polyester 20% ‖ Polyester 100% | ⚠ 두 줄 |
| Old Navy | [Hooded Sherpa Vest](https://oldnavy.gap.com/browse/product.do?pid=916674022) | Polyester 100% ‖ Cotton 60% / Polyester 40% | ⚠ 두 줄 |
| Old Navy | [The Occasion by Old Navy Beaded Sequin Mini Skirt](https://oldnavy.gap.com/browse/product.do?pid=1185402002) | Polyester 95% / Elastane 5% ‖ Polyester 92% / Elastane 8% | ⚠ 두 줄 |
| Old Navy | [High-Waisted SoComfy Wide-Leg Sweatpants](https://oldnavy.gap.com/browse/product.do?pid=777363022) | Cotton 90% / Polyester 10% |  |
| Old Navy | [High-Waisted SoComfy Wide-Leg Sweatpants](https://oldnavy.gap.com/browse/product.do?pid=777363012) | Cotton 90% / Polyester 10% |  |
| Old Navy | [High-Waisted SoComfy Wide-Leg Sweatpants](https://oldnavy.gap.com/browse/product.do?pid=777363032) | Cotton 90% / Polyester 10% |  |
| Old Navy | [High-Waisted SoComfy Wide-Leg Sweatpants](https://oldnavy.gap.com/browse/product.do?pid=777363232) | Cotton 90% / Polyester 10% |  |
| Old Navy | [High-Waisted SoComfy Wide-Leg Sweatpants](https://oldnavy.gap.com/browse/product.do?pid=777363142) | Cotton 90% / Polyester 10% |  |
| Old Navy | [High-Waisted SoComfy Wide-Leg Sweatpants](https://oldnavy.gap.com/browse/product.do?pid=777363082) | Cotton 90% / Polyester 10% |  |
| Spanx | [SPANXshape ® SPANXshape ® Ponte Halter Midi Dress USD $89.00 USD](https://spanx.com/products/spanxshape-ponte-halter-midi-dress?v=48685327122643&bau-context=standard&Color=Classic+Black) | Viscose 68% / Nylon 28% / Elastane 4% ‖ Polyester 100% | ⚠ 두 줄 |

</details>
