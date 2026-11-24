# 혼용률 보강 — 진짜 크롬 (2026-11-24 04:25Z)

평 fetch 로는 차단되는 브랜드를 진짜 브라우저(크롬·파이어폭스)로 다시 읽은 결과입니다.

- 시도 20개 · **채움 5개** (25%)
- (저장하지 않음 — DRY 실행)

- 엔진: firefox

| 브랜드 | 엔진 | 상품 | 시도 | 채움 | 사이트 미표기 | 껍데기 | 차단·타임아웃 | 오류 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Patagonia | firefox | 168 | 20 | **5** | 0 | 15 | 0 | 0 |

껍데기 = 차단 화면은 아닌데 이 상품의 본문(상품명)이 화면에 안 그려진 페이지. 미표기(none)로 적지 않고 차단과 같이 센다.

차단·타임아웃이 대부분이면 진짜 크롬으로도 안 된다는 뜻이므로, 그 브랜드는
사람 PC 의 확장(가정용 IP)이 맡아야 합니다. '사이트 미표기'가 대부분이면
더 할 수 있는 것이 없습니다 — 엑셀에 '정보 없음'으로 나갑니다.

<details><summary>껍데기로 센 페이지 예 12개(제목 + 화면 글 앞부분)</summary>

- Patagonia · W's I Voted Sticker Easy Cut Tee in White — https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Capilene® Cool Merino-Blend Shirt in Moonrise Taupe — https://www.patagonia.com/product/womens-capilene-cool-merino-blend-shirt/44580.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Capilene® Cool Daily Shirt in Berry Fig - Light Berry Fi — https://www.patagonia.com/product/womens-capilene-cool-daily-shirt/45226.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Hut Tripper Skyline Oversized T-Shirt in Amaranth Pink — https://www.patagonia.com/product/womens-hut-tripper-skyline-oversized-t-shirt/37902.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Long-Sleeved Capilene® Cool Sun Shirt in Vellum Green -  — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-sun-shirt/44795.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Long-Sleeved Capilene® Cool Daily Shirt - Boardshort Log — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-daily-shirt-boardshort-logo/45465.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Nature's Pace Oversized T-Shirt in Cover Green — https://www.patagonia.com/product/womens-natures-pace-oversized-t-shirt/37903.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Long-Sleeved Hut Tripper Easy-Cut T-Shirt in Weathered S — https://www.patagonia.com/product/womens-long-sleeved-hut-tripper-easy-cut-t-shirt/37906.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's '95 Oval Logo Oversized T-Shirt in Diver Blue — https://www.patagonia.com/product/womens-95-oval-logo-oversized-t-shirt/37870.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Capilene® Cool Ultra Shirt in Pumice - Dyno White X-Dye — https://www.patagonia.com/product/womens-capilene-cool-ultra-shirt/44720.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Long-Sleeved Capilene® Cool Sun Shirt - Peak Visions in  — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-sun-shirt-peak-visions/44935.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 
- Patagonia · W's Long-Sleeved Capilene® Cool Daily Shirt in Smolder Blue  — https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-daily-shirt/45186.html
  > Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up 

</details>

<details><summary>읽은 혼용률 5개 — 상품명과 함께(⚠ 는 상품명과 안 맞아 보이는 것)</summary>

| 브랜드 | 상품명 | 혼용률 | 확인 |
|---|---|---|---|
| Patagonia | [W's In-Spired Easy Cut Tee in Undyed Natural](https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html) | Cotton 100% |  |
| Patagonia | [W's Long-Sleeved Capilene® Cool Merino-Blend Shirt in Moonrise Taupe](https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html) | Wool 65% / Polyester 35% |  |
| Patagonia | [W's Long-Sleeved Capilene® Cool Trail Shirt in Cover Green](https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-trail-shirt/24493.html) | Polyester 85% / Lyocell 15% |  |
| Patagonia | [W's Capilene® Cool Trail Shirt in Berry Fig](https://www.patagonia.com/product/womens-capilene-cool-trail-shirt/24503.html) | Polyester 85% / Lyocell 15% |  |
| Patagonia | [W's Capilene® Cool Daily Shirt - Fitz Roy Nimbus in Berry Fig - Light ](https://www.patagonia.com/product/womens-capilene-cool-daily-shirt-fitz-roy-nimbus/45486.html) | Polyester 100% |  |

</details>
