# 담당 재분류 (2026-08-05T16:27Z)

상품 페이지를 서버 IP 로 읽을 수 있는지로 나눴다. 목록 페이지가 긁히는 것과는 다른 문제다 —
목록은 되는데 상품 페이지가 막히면 카탈로그는 쌓이지만 혼용률은 영원히 0% 다.

| 판정 | 브랜드 | 뜻 |
|---|---:|---|
| 확장 필요 | 26 | 서버 IP 로 상품 페이지가 막힌다 |
| 서버 가능 | 4 | 서버로 읽힌다 |
| 규칙 보완 | 61 | 읽히는데 우리가 못 뽑는다 |
| 정보 없음 | 33 | 사이트가 혼용률을 안 적는다 |
| 그대로 | 9 | 이미 다 찼다 |

## ⛔ 서버 → 확장 (2)

서버가 아무리 돌아도 이 브랜드의 혼용률은 안 채워진다.

| 브랜드 | 지금 담당 | 채움 | 빈 상품 | 표본 |
|---|---|---:|---:|---|
| Seasalt cornwall | 서버 | 46% | 152 | 차단 5 |
| Sessun | 서버 | 95% | 2 | 차단 2 |

## — 사이트가 혼용률을 안 적는 브랜드 (33)

표본을 열어 봤는데 페이지 어디에도 소재 표기가 없었다. 아무리 다시 읽어도 안 나온다.
엑셀에서는 '확인 필요' 가 아니라 '정보 없음' 으로 나가야 하는 대상이다.

| 브랜드 | 담당 | 채움 | 빈 상품 | 확인한 상품 URL |
|---|---|---:|---:|---|
| Loft | 확장 | 5% | 583 | https://www.loft.com/new-arrivals/all-new-arrivals/catl00009/<br>https://www.loft.com/clothing/essential-shop/cat1340018/ |
| Zara | 서버 | 0% | 421 | https://www.zara.com/us/en/asymmetric-knit-top-p02756032.html?v1=555528881<br>https://www.zara.com/us/en/flowy-v-neck-knit-top-p03471006.html?v1=562236633 |
| Splendid | 서버 | 8% | 369 | https://splendid.com/products/violet-short-sleeve-top-copy-rf6w222<br>https://splendid.com/products/lainey-lace-trim-short-sleeve-tee |
| Mint velvet | 서버 | 1% | 354 | https://mintvelvet.com/products/black-scoop-neck-layering-top<br>https://mintvelvet.com/products/green-cotton-ultimate-t-shirt |
| Ann Taylor | 확장 | 49% | 200 | https://www.anntaylor.com/cat5310001<br>https://www.anntaylor.com/clothing/all-clothing/cat3630020/ |
| rouje | 서버 | 40% | 180 | https://www.rouje.com/products/tarek-top-crochet-ecru<br>https://www.rouje.com/products/dolly-t-shirt-solid-red |
| Scoth & soda | 서버 | 60% | 136 | https://scotchandsoda.com/products/basquiat-washed-artwork-t-shirt-u9a01301t_u137-eggnog<br>https://scotchandsoda.com/products/basquiat-breton-t-shirt-u9b01304t_u124-blue-white-stripe |
| Stateside | 서버 | 61% | 124 | https://shopstateside.us/products/faux-fur-vest-in-tutu<br>https://shopstateside.us/products/softest-fleece-hood-pullover-in-ballet-pink |
| Coldwatercreek | 헤드리스 | 39% | 123 | https://www.coldwatercreek.com/waffle-knit-button-front-tee/25757/<br>https://www.coldwatercreek.com/textured-knit-henley/19701/ |
| Boden | 서버 | 58% | 123 | https://us.boden.com/products/women-clara-tie-neck-denim-top-dark-indigo-t2174den<br>https://us.boden.com/products/women-sienna-frill-cotton-shirt-embroidered-pink-maroon-check-t2165chk |
| The white company | 확장 | 0% | 79 | https://www.thewhitecompany.com/uk/Clothing/c/holiday-shop<br>https://www.thewhitecompany.com/uk/magazine/home |
| Prana | 서버 | 0% | 67 | https://www.prana.com/p/mountain-maven-denim-shirt/2163521.html?dwvar_2163521_color=Blue%20Denim<br>https://www.prana.com/p/everyday-daisy-crop-tee/2178941.html?dwvar_2178941_color=Black |
| The upside | 확장 | 85% | 52 | https://www.theupside.com/active/all-in-one/dresses/<br>https://www.theupside.com/active/bottoms/leggings/ |
| Nike | 헤드리스 | 92% | 36 | https://www.nike.com/t/revolution-8-mens-road-running-shoes-U0b8oy8S/HJ9198-122<br>https://www.nike.com/t/air-jordan-4-toro-mens-shoes-Aey77D4l/FQ8138-600 |
| Tuckernuck | 서버 | 92% | 31 | https://tnuck.com/products/vibrant-stripe-boatneck-top<br>https://tnuck.com/products/cafe-check-button-front-wide-hem-top |
| Project Social T | 서버 | 91% | 22 | https://www.projectsocialt.com/products/osper-ivory-textured-stripe-tee-ivory-navy<br>https://www.projectsocialt.com/products/zadie-ivory-striped-tee-ivory-navy |
| Z Supply | 서버 | 92% | 21 | https://zsupplyclothing.com/products/rowe-scoop-tank-3-pack<br>https://zsupplyclothing.com/products/select-airy-tank-3-pack-1 |
| Oasis | 서버 | 67% | 20 | https://www.oasisfashion.com/product/apricot-floral-cotton-broderie-anglaise-midi-dress_p-11a05601-d99a-41fc-8f0a-06e38a50de3f?colour=White<br>https://www.oasisfashion.com/product/apricot-paisley-crochet-maxi-dress_p-fa0c1a56-4f0c-4bfb-b094-29de8d04a253?colour=Pink |
| Jigsaw | 서버 | 91% | 19 | https://www.jigsaw-online.com/products/cotton-slub-boxy-raglan-tee-navy<br>https://www.jigsaw-online.com/products/ribbed-henley-vest-brown |
| Me+Em | 헤드리스 | 96% | 19 | https://www.meandem.com/us/luxe-boxy-t-shirt-cigaro-brown<br>https://www.meandem.com/us/luxe-boxy-t-shirt-navy |
| Oysho | 확장 | 0% | 18 | https://www.oysho.com/gb/womens-sports-tank-tops-n4770<br>https://www.oysho.com/gb/short-sleeve-womens-t-shirts-n4766 |
| Frame | 서버 | 91% | 16 | https://frame-store.com/products/relaxed-pocket-tee<br>https://frame-store.com/products/sothebys-sweatshirt |
| English factory | 서버 | 94% | 13 | https://shopenglishfactory.com/products/stripe-sleeveless-t-shirt-jj2529t-new<br>https://shopenglishfactory.com/products/puff-sleeve-knit-top-jj2456t-brown |
| Splits59 | 서버 | 90% | 11 | https://www.splits59.com/products/taylor-knit-polo-2<br>https://www.splits59.com/products/djuna-oversized-crop-jersey-tee-3 |
| Bash | 서버 | 94% | 8 | https://ba-sh.com/fr/fr/p/top-salda-kaki-3667436122316.html<br>https://ba-sh.com/fr/fr/p/top-salda-ecru-3667436027574.html |
| Sundry | 서버 | 98% | 7 | https://sundryclothing.com/products/gift-card<br>https://sundryclothing.com/products/softest-fleece-hoodie-in-signature-green |
| ALC | 서버 | 99% | 5 | https://alcltd.com/products/joan-bra-top-ganache<br>https://alcltd.com/collections/tees-tanks/products/joan-bra-top-ganache |
| Banana Republic | 확장 | 20% | 4 | https://br.attn.tv/p/ubl/landing-page<br>https://bananarepublic.gap.com/browse/product.do |
| Massimo Dutti | 확장 | 0% | 4 | https://www.massimodutti.com/us/100-cotton-poplin-draped-dress-l06652511<br>https://www.massimodutti.com/us/flowing-blouse-with-tie-detail-l05166542 |
| Eddie bauer | 서버 | 97% | 3 | https://www.eddiebauer.com/fr-ca/products/womens-departure-3-ls-shirt-21624297<br>https://www.eddiebauer.com/fr-ca/products/womens-guide-pant-23551062 |
| Gap | 확장 | 0% | 2 | https://www.gap.com/browse/info.do<br>https://www.gap.com/browse/product.do |
| La Ligne | 서버 | 99% | 2 | https://lalignenyc.com/products/molly-tee-white-cobalt |
| Athleta | 확장 | 0% | 1 | https://athleta.gap.com/browse/product.do |

### 그중 확장이 시간을 쓰고 있는 브랜드 (9)

수집은 계속해야 하지만(빼면 상품이 낡는다) 혼용률 찾기에는 시간을 덜 써야 한다.

| 브랜드 | 지금 담당 | 채움 | 빈 상품 | 표본 |
|---|---|---:|---:|---|
| Loft | 확장 | 5% | 583 | 정보없음 5 |
| Ann Taylor | 확장 | 49% | 200 | 정보없음 5 |
| The white company | 확장 | 0% | 79 | 정보없음 5 |
| The upside | 확장 | 85% | 52 | 차단 1 · 정보없음 4 |
| Oysho | 확장 | 0% | 18 | 정보없음 5 |
| Banana Republic | 확장 | 20% | 4 | 정보없음 4 |
| Massimo Dutti | 확장 | 0% | 4 | 정보없음 4 |
| Gap | 확장 | 0% | 2 | 정보없음 2 |
| Athleta | 확장 | 0% | 1 | 정보없음 1 |

## 🔧 규칙 보완 (61)

페이지에 값이 있는데 못 뽑는다. 담당을 옮길 문제가 아니라 추출 규칙 문제다.

| 브랜드 | 지금 담당 | 채움 | 빈 상품 | 표본 |
|---|---|---:|---:|---|
| Boldest | 헤드리스 | 9% | 185 | 규칙누락 4 · 정보없음 1 |
| Dickies | 서버 | 43% | 172 | 정보없음 2 · 규칙누락 3 |
| On | 헤드리스 | 50% | 71 | 규칙누락 5 |
| Gestuz | 헤드리스 | 90% | 67 | 규칙누락 5 |
| Poetry | 헤드리스 | 86% | 54 | 규칙누락 5 |
| Rails | 서버 | 84% | 50 | 규칙누락 5 |
| Leset | 헤드리스 | 81% | 38 | 규칙누락 5 |
| Wrap | 헤드리스 | 92% | 36 | 규칙누락 5 |
| Phase eight | 서버 | 92% | 31 | 정보없음 1 · 규칙누락 3 · 성공 1 |
| Reformation | 서버 | 93% | 28 | 규칙누락 5 |
| Cotton citizen | 서버 | 93% | 21 | 규칙누락 5 |
| Good American | 서버 | 86% | 19 | 규칙누락 3 · 정보없음 2 |
| Monsoon | 서버 | 44% | 18 | 규칙누락 5 |
| CCC | 헤드리스 | 97% | 17 | 정보없음 2 · 규칙누락 3 |
| Michael Stars | 서버 | 92% | 17 | 정보없음 2 · 규칙누락 3 |
| Oak + Fort | 서버 | 95% | 17 | 규칙누락 3 · 정보없음 2 |
| Bellerose | 서버 | 95% | 16 | 규칙누락 5 |
| Sweaty betty | 헤드리스 | 95% | 16 | 규칙누락 5 |
| Evereve | 서버 | 97% | 15 | 규칙누락 5 |
| Vuori | 서버 | 93% | 15 | 규칙누락 3 · 차단 2 |
| Monrow | 서버 | 93% | 14 | 규칙누락 4 · 정보없음 1 |
| Cotton on | 헤드리스 | 97% | 13 | 규칙누락 5 |
| Whitestuff | 서버 | 97% | 13 | 규칙누락 5 |
| Addison bay | 서버 | 93% | 11 | 정보없음 2 · 규칙누락 3 |
| Alo | 서버 | 94% | 11 | 규칙누락 5 |
| Club monaco | 서버 | 90% | 11 | 규칙누락 5 |
| Sanctuary | 서버 | 97% | 11 | 규칙누락 5 |
| Faherty | 서버 | 95% | 10 | 정보없음 1 · 규칙누락 4 |
| Outdoorvoices | 서버 | 92% | 10 | 규칙누락 5 |
| Thread & supply | 서버 | 97% | 10 | 규칙누락 5 |
| Vanessa bruno | 서버 | 89% | 10 | 규칙누락 5 |
| Nylora | 서버 | 96% | 8 | 규칙누락 5 |
| Mango | 확장 | 83% | 8 | 규칙누락 5 |
| Ulla Johnson | 서버 | 97% | 8 | 규칙누락 5 |
| WHBM | 서버 | 97% | 8 | 규칙누락 3 · 정보없음 2 |
| Damson Madder | 서버 | 97% | 7 | 규칙누락 4 · 정보없음 1 |
| Marine Layer | 서버 | 96% | 7 | 규칙누락 5 |
| Spanx | 서버 | 93% | 7 | 규칙누락 5 |
| J.jill | 서버 | 93% | 6 | 규칙누락 5 |
| LNA | 서버 | 97% | 6 | 규칙누락 5 |
| Chico's | 서버 | 99% | 5 | 규칙누락 5 |
| Whistles | 서버 | 97% | 5 | 규칙누락 4 · 정보없음 1 |
| Barbour | 헤드리스 | 98% | 4 | 규칙누락 4 |
| Bassike | 서버 | 98% | 4 | 규칙누락 4 |
| Jager | 서버 | 99% | 4 | 규칙누락 3 · 정보없음 1 |
| Gymshark | 서버 | 98% | 4 | 차단 1 · 정보없음 1 · 규칙누락 2 |
| Beyond yoga | 서버 | 99% | 3 | 규칙누락 2 · 정보없음 1 |
| Greyson | 서버 | 95% | 3 | 규칙누락 3 |
| Gerard darel | 헤드리스 | 99% | 3 | 정보없음 1 · 규칙누락 2 |
| Varley | 서버 | 99% | 3 | 규칙누락 3 |
| Citizens of Humanity | 서버 | 99% | 2 | 규칙누락 2 |
| J.mclaughlin | 헤드리스 | 96% | 2 | 규칙누락 2 |
| Rag & bone | 서버 | 99% | 2 | 규칙누락 2 |
| Shopbop | 헤드리스 | 100% | 2 | 규칙누락 2 |
| Veronica Beard | 서버 | 99% | 2 | 규칙누락 2 |
| vineyardvines | 서버 | 99% | 2 | 규칙누락 2 |
| Draper James | 서버 | 99% | 1 | 규칙누락 1 |
| Frank & Eileen | 서버 | 100% | 1 | 규칙누락 1 |
| Goldie | 서버 | 99% | 1 | 규칙누락 1 |
| Lilla P | 서버 | 99% | 1 | 규칙누락 1 |
| Velvet | 서버 | 100% | 1 | 규칙누락 1 |

