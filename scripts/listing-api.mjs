// 사이트가 자기 상품 목록을 그릴 때 부르는 JSON(검색 API)을 직접 읽는 곳 — 헤드리스 수집기의 'api' 엔진.
//
// 페이지가 봇 확인 화면으로 막혀도 목록 API 는 열려 있는 사이트가 있다.
//  · Aritzia — 목록 페이지는 Cloudflare 확인 화면(데이터센터에서 크롬·impit 403). 서버 저장소
//    (miro-market-research server.mjs 의 aritziaCatalog)가 같은 Algolia 검색 주소로 읽고 있었다.
//    주소와 '검색 전용' 공개 키는 사이트가 모든 방문자의 브라우저에 내려 주는 값이다(비밀이 아님).
//
// 각 항목: parts(돌 카테고리 이름) · label(part)(리포트에 적을 이름) · read(part) → 상품 배열
// 상품 모양은 collector.js 와 같다: { name, imageUrl, productUrl, price, priceOrig, category }

const ARITZIA_ENDPOINT =
  "https://search-0.aritzia.com/1/indexes/production_ecommerce_aritzia__Aritzia_INTL__products__default/query";
// 우리 카테고리 → Aritzia 검색의 categories 값(서버 저장소와 같은 짝)
const ARITZIA_PARTS = {
  tops: "tops",
  sweatshirts: "sweatshirts-hoodies",
  shirts: "shirts-blouses",
  dresses: "dresses",
  pants: "pants",
};

export function aritziaItems(data, category) {
  const out = [], seen = new Set();
  for (const hit of (data && data.hits) || []) {
    if (!hit || !hit.slug || seen.has(hit.masterId || hit.slug)) continue;
    seen.add(hit.masterId || hit.slug);
    const amount = hit.price && (hit.price.min ?? hit.price.max);
    out.push({
      name: String(hit.c_displayName || hit.name || "").replace(/\s+/g, " ").trim().slice(0, 150),
      // 확장이 저장해 온 주소와 같은 모양(/intl/en/product/<slug>) — 색상 꼬리는 붙이지 않는다
      // (수집기는 물음표 뒤를 버리므로 같은 상품이 두 주소로 갈리지 않게).
      productUrl: `https://www.aritzia.com/intl/en/product/${hit.slug}`,
      imageUrl: hit.defaultImage
        ? "https://assets.aritzia.com/image/upload/c_crop,ar_1920:2623,g_south/q_auto,f_auto,dpr_auto/" + hit.defaultImage
        : "",
      price: Number.isFinite(amount) ? `$${amount}` : "",
      priceOrig: "",
      category,
    });
  }
  return out.filter((x) => x.name && x.imageUrl);
}

export const API_READERS = {
  aritzia: {
    parts: Object.keys(ARITZIA_PARTS),
    label: (part) => `api:aritzia-algolia:categories=${ARITZIA_PARTS[part]}`,
    async read(part) {
      const r = await fetch(ARITZIA_ENDPOINT, {
        method: "POST",
        headers: {
          "x-algolia-application-id": "SONLJM8OH6",
          "x-algolia-api-key": "1455bca7c6c33e746a0f38beb28422e6",
          "content-type": "application/json",
        },
        body: JSON.stringify({ query: "", hitsPerPage: 150, distinct: true, facetFilters: [`categories:${ARITZIA_PARTS[part]}`] }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return aritziaItems(await r.json(), part);
    },
  },
};
