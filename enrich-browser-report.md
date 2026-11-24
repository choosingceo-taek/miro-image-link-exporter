# 혼용률 보강 — 진짜 크롬 (2026-11-24 04:21Z)

평 fetch 로는 차단되는 브랜드를 진짜 브라우저(크롬·파이어폭스)로 다시 읽은 결과입니다.

- 시도 60개 · **채움 30개** (50%)
- (저장하지 않음 — DRY 실행)

- 엔진: firefox

| 브랜드 | 엔진 | 상품 | 시도 | 채움 | 사이트 미표기 | 껍데기 | 차단·타임아웃 | 오류 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Patagonia | firefox | 168 | 30 | **0** | 0 | 30 | 0 | 0 |
| Zara | firefox | 499 | 30 | **30** | 0 | 0 | 0 | 0 |

껍데기 = 차단 화면은 아닌데 이 상품의 본문(상품명)이 화면에 안 그려진 페이지. 미표기(none)로 적지 않고 차단과 같이 센다.

차단·타임아웃이 대부분이면 진짜 크롬으로도 안 된다는 뜻이므로, 그 브랜드는
사람 PC 의 확장(가정용 IP)이 맡아야 합니다. '사이트 미표기'가 대부분이면
더 할 수 있는 것이 없습니다 — 엑셀에 '정보 없음'으로 나갑니다.

<details><summary>읽은 혼용률 30개 — 상품명과 함께(⚠ 는 상품명과 안 맞아 보이는 것)</summary>

| 브랜드 | 상품명 | 혼용률 | 확인 |
|---|---|---|---|
| Zara | [SUPIMA® LONG SLEEVE T-SHIRT](https://www.zara.com/us/en/supima--long-sleeve-t-shirt-p00858777.html?v1=587652540) | Cotton 100% |  |
| Zara | [COTTON-MODAL PLAIN T-SHIRT](https://www.zara.com/us/en/cotton-modal-t-shirt-p08779741.html?v1=612283245) | Cotton 47% / Modal 47% / Elastane 6% |  |
| Zara | [LONG SLEEVE HENLEY T-SHIRT](https://www.zara.com/us/en/long-sleeve-henley-t-shirt-p04174666.html?v1=615550153) | Cotton 95% / Elastane 5% |  |
| Zara | [BOAT NECK T-SHIRT](https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=569054944) | Cotton 100% |  |
| Zara | [SEAMLESS JACQUARD THERMAL T-SHIRT SKI COLLECTION](https://www.zara.com/us/en/seamless-jacquard-thermal-t-shirt-ski-collection-p04388021.html?v1=605238279) | Nylon 60% / Polyester 30% / Elastane 10% |  |
| Zara | [RIBBED TANK TOP](https://www.zara.com/us/en/ribbed-tank-top-p03253301.html?v1=584387697) | Cotton 95% / Elastane 5% |  |
| Zara | [SHORT SLEEVE INTERLOCK T-SHIRT](https://www.zara.com/us/en/short-sleeve-interlock-t-shirt-p04174378.html?v1=610629406) | Cotton 100% |  |
| Zara | [RUSTIC COTTON T-SHIRT](https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=585357968) | Cotton 100% |  |
| Zara | [OVERSIZED TEXT T-SHIRT](https://www.zara.com/us/en/oversized-text-t-shirt-p00264250.html?v1=563600640) | Cotton 100% |  |
| Zara | [TURTLENECK T-SHIRT](https://www.zara.com/us/en/turtleneck-t-shirt-p02335646.html?v1=615161650) | Modal 48% / Cotton 47% / Elastane 5% |  |
| Zara | [DOUBLE LAYER T-SHIRT](https://www.zara.com/us/en/double-layer-t-shirt-p00858734.html?v1=592204190) | Viscose 52% / Polyester 48% |  |
| Zara | [INTERLOCK LONG-SLEEVE T-SHIRT](https://www.zara.com/us/en/long-sleeve-interlock-t-shirt-p04174639.html?v1=594238103) | Cotton 100% |  |
| Zara | [OVERSIZED FLAME T-SHIRT](https://www.zara.com/us/en/oversized-slub-t-shirt-p00858741.html?v1=610076047) | Cotton 100% |  |
| Zara | [OVERSIZED STRIPED T-SHIRT](https://www.zara.com/us/en/striped-oversize-t-shirt-p00858742.html?v1=583447043) | Cotton 100% |  |
| Zara | [CONTRAST COLLAR STRIPED POLO](https://www.zara.com/us/en/contrast-collar-striped-polo-p00858743.html?v1=583452669) | Cotton 100% |  |
| Zara | [LYOCELL T-SHIRT](https://www.zara.com/us/en/lyocell-t-shirt-p03431648.html?v1=580218597) | Lyocell 76% / Silk 19% / Elastane 5% |  |
| Zara | [LYOCELL RAGLAN SLEEVE T-SHIRT](https://www.zara.com/us/en/lyocell-raglan-sleeve-t-shirt-p03431649.html?v1=580218600) | Lyocell 76% / Silk 19% / Elastane 5% |  |
| Zara | [PIQUÉ MOCK NECK T-SHIRT](https://www.zara.com/us/en/pique-mock-neck-t-shirt-p05067177.html?v1=612704451) | Polyester 98% / Elastane 2% |  |
| Zara | [HIGH-NECK MIXED T-SHIRT](https://www.zara.com/us/en/mock-neck-combined-t-shirt-p05644800.html?v1=549528304) | Polyester 55% / Cotton 45% ‖ Cotton 100% | ⚠ 두 줄 |
| Zara | [RIBBED BUTTON T-SHIRT](https://www.zara.com/us/en/ribbed-button-t-shirt-p04174704.html?v1=562533856) | Cotton 95% / Elastane 5% |  |
| Zara | [STRIPED SHORT SLEEVE T-SHIRT](https://www.zara.com/us/en/striped-short-sleeve-t-shirt-p06462001.html?v1=555529058) | Cotton 100% |  |
| Zara | [Long-Sleeve Ribbed T-Shirt](https://www.zara.com/us/en/long-sleeve-ribbed-t-shirt-p03253804.html?v1=577411701) | Cotton 48% / Modal 48% / Elastane 4% |  |
| Zara | [HENLEY T-SHIRT](https://www.zara.com/us/en/henley-t-shirt-p04424632.html?v1=561441193) | Cotton 100% |  |
| Zara | [BOAT NECK T-SHIRT](https://www.zara.com/us/en/boat-neck-t-shirt-p01058805.html?v1=547344101) | Polyester 65% / Lyocell 28% / Elastane 7% |  |
| Zara | [EMBROIDERED POCKET RIPPED T-SHIRT](https://www.zara.com/us/en/distressed-embroidered-pocket-t-shirt-p00858746.html?v1=583452689) | Cotton 100% |  |
| Zara | [WIDE SLEEVE STRIPED T-SHIRT](https://www.zara.com/us/en/wide-sleeve-striped-t-shirt-p04424629.html?v1=548172239) | Cotton 100% |  |
| Zara | [RIB KNIT MOCK NECK T-SHIRT](https://www.zara.com/us/en/ribbed-mock-neck-t-shirt-p04174663.html?v1=598725465) | Cotton 48% / Modal 48% / Elastane 4% |  |
| Zara | [V-NECK T-SHIRT](https://www.zara.com/us/en/v-neck-t-shirt-p02335239.html?v1=551780159) | Cotton 100% |  |
| Zara | [RIBBED BUTTON-UP T-SHIRT](https://www.zara.com/us/en/buttoned-ribbed-t-shirt-p03253802.html?v1=547392332) | Cotton 48% / Modal 48% / Elastane 4% |  |
| Zara | [RIBBED SCOOP NECK T-SHIRT](https://www.zara.com/us/en/ribbed-scoop-neck-t-shirt-p03641825.html?v1=560359404) | Cotton 79% / Viscose 15% / Elastane 6% |  |

</details>
