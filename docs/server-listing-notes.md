# 서버 프리페치가 목록을 적게 읽는 이유와 고치는 안 (2026-11-25)

서버 프리페치(Render · 저장소 `miro-market-research` 의 `server.mjs`)는 이 저장소에서 고치지 않았습니다.
그 저장소에는 올리지 않기로 했기 때문입니다. 대신 **이 저장소의 헤드리스 수집기로 같은 브랜드를 읽어 보고,
분명히 더 많이 읽히는 브랜드는 헤드리스 수집기에 '합치기 저장'으로 넣었습니다**(서버가 쌓아 둔 카탈로그를 줄이지 않음).
아래는 서버 쪽을 고칠지 결정하실 때 쓸 원인과 고치는 안입니다. 코드 위치는 `server.mjs` 기준입니다.

> 측정 = GitHub Actions 에서 실제 페이지를 연 결과(저장 안 함). 추정 = 코드를 읽고 판단한 것(실측 아님).

## 원인 1 — 상품 이름에 정해진 낱말이 없으면 버린다 (`rank()`, 628행 부근) · 추정(코드)

카테고리 URL 에서 읽은 상품도 이름에 `top / tee / shirt / dress / pants` 같은 낱말이 있어야 남습니다.
`trustCategory` 가 켜져도 **sweatshirts 칸만** 이 검사를 건너뜁니다.

- dresses 칸: `dress|jumpsuit` 가 이름에 없으면 버림 → 치마(skirt)·이름만 있는 상품(예: 프랑스어 이름)이 빠짐
- pants 칸: `isPants()` 가 `jeans|denim` 을 **일부러 뺌** → 청바지가 전부 빠짐(Dickies·Good American)
- tops 칸: `cardigan|sweater` 가 들어가면 빠짐 → 니트 카테고리가 0개(Monsoon knitwear 서버 0개)

**고치는 안**: 엑셀에 적힌 카테고리 URL 에서 온 상품(`exactLinksCatalog`)은 카테고리를 믿고 낱말 검사를 건너뛴다.
남성복·아동복 제외(`isMenswear` 등)는 그대로 둔다.

```js
// rank() 안 — 지금
} else if (category === "tops") {
  list = list.filter((product) => isTop(product.classification || product.name, options));
// 제안: trustCategory 면 모든 칸에서 낱말 검사를 건너뛴다
if (!options.trustCategory) {
  if (category === "tops") list = list.filter(...);
  else if (category === "shirts") list = list.filter(...);
  ...
}
```

## 원인 2 — Sessun: 이미지 주소 조각을 상품 주소로 저장 (`markdownProducts()`, 1188행 부근) · 측정 + 코드

리더 프록시가 준 글에서 `srcset` 의 한 조각(`…/catalog/product/X.webp%20924w`)이 링크로 잡힙니다.
`isProductUrl()` 은 주소 끝이 `.webp` 인지 보는데, 끝에 `%20924w` 가 붙어 있어 통과하고,
경로에 `/product/` 가 있어 `PRODUCT_PATH` 에도 맞습니다. 그래서 상품 대신 사진 주소가 저장됩니다
(접근 지도 측정에서 Sessun 상품 표본 3개가 전부 이 모양 → 404).

**고치는 안**: `/\.(?:gif|jpe?g|png|webp|avif)$/i` 를 `/\.(?:gif|jpe?g|png|webp|avif)(?:%20\d+[wx])?$/i` 로.
(이 저장소의 수집기에는 같은 규칙을 넣었다 — `chrome-extension/collector.js` 의 `IMAGE_FILE`, 시험 `scripts/test-nonproduct.mjs`)

## 원인 3 — Whitestuff: 서버의 직접 fetch 가 막혀 리더 프록시로만 읽음 · 측정

서버 fetch 는 `fetch failed`, Worker 우회도 404, 리더 프록시는 429(요청 과다)라 날마다 114~267개로 흔들립니다.
같은 페이지를 크롬의 TLS 지문으로 받으면(impit) 6개 카테고리 모두 열리고 120~177개씩 보입니다.

**고치는 안**: 서버 `fetchText()` 에 브라우저 TLS 지문 fetch(npm `impit`)를 한 단계 더 넣는다. 또는 지금처럼 이 저장소의 헤드리스 수집기(impit 엔진)에 맡긴다.

## 원인 4 — 페이지 넘김이 Shopify 주소 모양에서만 동작 (`sequentialCatalogPageUrl()`, 1410행) · 추정(코드)

다음 페이지는 ① 페이지 안의 `data-url`·`?page=` 링크, ② `/collections/…` 주소의 `?page=N` 만 따라갑니다.
SFCC(Salesforce) 사이트의 `?start=&sz=` 는 `Search-UpdateGrid` 단추가 있을 때만 잡힙니다.
그리고 카테고리당 상한(`TOP_LIMIT` 등 100개)에 닿으면 멈춥니다.

## James Perse · Nation LTD — '페이지 넘김을 못 따라간다'는 추정은 **틀림** · 코드 확인

두 곳은 Shopify 라 서버가 `/collections/<이름>/products.json?limit=250` 으로 컬렉션 전체를 **한 번에** 받습니다
(`shopifyCollectionPage()`, 1627행). 페이지 넘김이 필요 없습니다. 하루 수집이 142·161개로 저장본(526·525)보다 적은 것은
① 원인 1의 낱말 검사로 이름이 맞지 않는 상품이 빠지고, ② 저장본은 매일 '합치기'로 쌓여 옛 상품이 남아 있기 때문입니다.
헤드리스 측정 결과는 아래 표(측정)를 보십시오.

## 브랜드별 측정 — 서버 하루 수집 vs 이 저장소 헤드리스(저장 안 함)

LISTING_TABLE

서버 칸은 2026-11-25 접근 지도 측정(run 45578702353·45582271538, 서버에 직접 물어본 URL별 개수)과 야간 리포트의 하루 수집 수입니다.
