// 웹 아카이브 보관본 흉내 — 진짜로 받아야 할 상품 페이지와, 받으면 안 되는 목록 페이지.
//
// 실측(try-engines-report.md, 11/24)에서 나온 경우를 본떴다. 진짜 HTML 을 그대로 두면
// 저작물이고 크기도 커서, 판정에 쓰이는 뼈대(JSON-LD · og:type · h1 · 가격 · 담기 버튼 ·
// 혼용률 문구)만 남겼다.
const prose = ("Free shipping and free returns. Machine wash cold, tumble dry low. Imported. " +
  "Model is 177cm and wears a size S. Our fit guide helps you choose. ").repeat(6);
const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...o })}</script>`;
const og = (t) => `<meta property="og:type" content="${t}">`;
const doc = (head, body) => `<!doctype html><html><head><title>t</title>${head}</head><body>${body}<p>${prose}</p></body></html>`;
// 상품 카드 n개 — 목록 페이지. comps 를 주면 카드마다 소재를 붙인다.
const cards = (n, { price = (i) => `$${48 + i}.00`, comp = () => "", cart = false } = {}) =>
  Array.from({ length: n }, (_, i) => `<li class="product-card"><a href="/p/item-${i}"><img src="/i/${i}.jpg" alt="Item ${i}">` +
    `<h3>Item ${i}</h3></a><span class="price">${price(i)}</span>${comp(i) ? `<p>${comp(i)}</p>` : ""}` +
    `${cart ? "<button>Add to bag</button>" : ""}</li>`).join("");
const related = (n) => `<section><h2>You may also like</h2><ul>${cards(n)}</ul></section>`;

// ── 받아야 하는 것(진짜 상품 페이지) ──
export const GOOD = {
  // Arket: og:type product + JSON-LD Product. 소재는 본문 상세에.
  arket: doc(og("product") + ld({ "@type": "Product", name: "Heavyweight T-shirt", color: "White",
    offers: { "@type": "Offer", price: "35", priceCurrency: "USD" } }),
    `<h1>Heavyweight T-shirt</h1><span>$35</span><button>Add to bag</button>` +
    `<div class="details"><h4>Composition</h4><p>Cotton 96%, Elastane 4%</p></div>` + related(4)),
  // Zara: JSON-LD 가 사이즈별 Product 배열(이름이 같다). 소재는 페이지 상태 JSON 안에.
  zara: doc(ld([1, 2, 3, 4].map((n) => ({ "@type": "Product", name: "RUSTIC COTTON T-SHIRT", sku: "0442430625" + n,
    offers: { price: "25.90", priceCurrency: "USD" } }))),
    `<h1>RUSTIC COTTON T-SHIRT</h1><div id="app"></div>` +
    `<script>window.zara={"product":{"detail":{"composition":[{"part":"OUTER SHELL","text":"100% cotton"}]}}}</script>`),
  // Reformation: JSON-LD Product 하나 + 관련 상품 ItemList(Product 6개) — 목록으로 보면 안 된다.
  reformation: doc(ld({ "@type": "Product", name: "Veya Silk Top", color: "Ivory" }) +
    ld({ "@type": "ItemList", itemListElement: [1, 2, 3, 4, 5, 6].map((i) => ({ "@type": "ListItem", position: i,
      item: { "@type": "Product", name: "Rec " + i } })) }),
    `<h1>Veya Silk Top</h1><span>$148</span><p>Fabric: 100% Silk</p>` + related(6)),
  // Mango 형: 구조화 데이터 없이 h1 하나 + 담기 버튼 하나 + 가격 하나.
  mango: doc("", `<h1>Long-sleeved boat neck t-shirt</h1><span>$29.99</span><button>Add to bag</button>` +
    `<p>Composition: 100% cotton</p>`),
  // 겉감·안감·배색 — 한 상품의 원단 여러 개는 한 덩어리로 묶여 '혼용률 여러 벌'이 아니다.
  coat: doc(og("product"), `<h1>Wool Blend Coat</h1><span>$298</span>` +
    `<p>Shell: 70% Wool, 30% Polyamide. Lining: 100% Viscose. Trim: 100% Polyester.</p>`),
  // Zara supima(11/24 측정 2차): 같은 소재를 "100% Supima" · "Cotton 100%" · 둘 다로 세 번 적는다 —
  // 섬유를 대표 이름으로 묶지 않으면 '혼용률 세 벌'로 거부됐다.
  zaraSupima: doc(og("product") + ld({ "@type": "ProductGroup", name: "SUPIMA STAND-UP COLLAR T-SHIRT",
    hasVariant: [{ "@type": "Product", name: "SUPIMA STAND-UP COLLAR T-SHIRT" }] }),
    `<h1>SUPIMA® STAND-UP COLLAR T-SHIRT</h1><span>$29.90</span><p>Made of 100% Supima cotton.</p>` +
    `<p>${"x ".repeat(400)}</p><p>OUTER SHELL: Cotton 100%</p><p>${"y ".repeat(400)}</p>` +
    `<p>${"w ".repeat(400)}</p><p>Care: COTTON 100% · 100% SUPIMA</p>` +
    `<script>{"composition":"100% supima"}</script>`),
  // Mango(11/24 측정 2차): 구조화 데이터도 담기 버튼도 없는 보관본. h1 하나 · 혼용률 한 벌 · 가격 2번.
  mangoNoCart: doc("", `<h1>Long-sleeved boat-neck t-shirt</h1><span>$29.99</span><span>$39.99</span>` +
    `<p>Composition: 65% polyester, 32% viscose, 3% elastane</p>`),
};

// ── 받으면 안 되는 것(목록 페이지) ──
export const BAD = {
  // Aritzia /intl/en/new: 구조화 데이터 없음, h1 "New", 카드 24개 중 하나에 "100% Wool".
  aritziaNew: doc(og("website"), `<h1>New</h1><ul>${cards(24, { comp: (i) => (i === 3 ? "100% Wool" : "") })}</ul>`),
  // 같은 목록인데 h1 이 없고 JSON-LD ItemList 만 있는 판.
  aritziaNewLd: doc(ld({ "@type": "ItemList", itemListElement: Array.from({ length: 24 }, (_, i) => ({ "@type": "ListItem", position: i + 1, url: "/p/" + i })) }),
    `<ul>${cards(24, { comp: (i) => (i === 3 ? "100% Wool" : "") })}</ul>`),
  // Joules /shop/womens/clothing/tops/t-shirts: h1 "Women's T-Shirts", 카드마다 빠른 담기, 가격이 전부 같다.
  joulesTshirts: doc(og("website") + ld({ "@type": "BreadcrumbList", itemListElement: [] }),
    `<h1>Women's T-Shirts</h1><ul>${cards(20, { price: () => "£24.95", comp: () => "100% Cotton", cart: true })}</ul>`),
  // 같은 목록인데 h1 이 카테고리 낱말이 아닌 판("Rugby Shirts & Tees") — 담기 버튼 수로 걸린다.
  joulesNamed: doc("", `<h1>The Rugby Shirt Edit for Her</h1><ul>${cards(12, { price: () => "£49.95", cart: true })}</ul><p>100% Cotton</p>`),
  // &Other Stories /en-us/bags/: CollectionPage + ItemList of Product.
  storiesBags: doc(ld({ "@type": "CollectionPage", name: "Bags" }) +
    ld({ "@type": "ItemList", itemListElement: [1, 2, 3, 4].map((i) => ({ "@type": "Product", name: "Bag " + i })) }),
    `<h1>Bags</h1><ul>${cards(16, { comp: (i) => (i === 0 ? "100% Cotton" : "") })}</ul>`),
  // 같은 목록인데 CollectionPage 없이 Product 가 여러 개 최상위에 있는 판.
  storiesBagsFlat: doc([1, 2, 3, 4].map((i) => ld({ "@type": "Product", name: "Bag " + i })).join(""),
    `<ul>${cards(16, { comp: (i) => (i === 0 ? "100% Cotton" : "") })}</ul>`),
  // 상품 표시(og:type product)가 있는데 카드마다 다른 소재가 붙은 목록 — 혼용률 여러 벌.
  listingWithOg: doc(og("product"), `<h1>Knitwear</h1><ul>${cards(10, {
    comp: (i) => ["100% Wool", "70% Wool, 30% Polyamide", "100% Cashmere", "50% Cotton, 50% Acrylic"][i % 4] })}</ul>`),
  // Aritzia 형(11/24 측정 2차): 상품 표시 없이 사이트 공통 문구에 "100% Merino Wool" · "100% Cotton"
  // 이 박혀 있다 — 예전 오탐 "Wool 100%" 의 출처. 상품 자기 소재(Polyester)와 합쳐 세 벌.
  aritziaBoiler: doc(ld({ "@type": "BreadcrumbList", itemListElement: [] }),
    `<div class="promo">The softest 100% Merino Wool layers.</div><p>${"z ".repeat(400)}</p>` +
    `<div class="promo">Everyday 100% Cotton tees.</div><p>${"z ".repeat(400)}</p>` +
    `<div><button>Add to bag</button><p>Shell: 100% Polyester</p></div>`),
  // Joules 형(11/24 측정 2차): h1 하나(카테고리 낱말 아님) · 혼용률 한 벌인데 가격이 24번 — 목록.
  joulesMultipack: doc(ld({ "@type": "BreadcrumbList", itemListElement: [] }),
    `<h1>Buy Women's Tops Online</h1><ul>${cards(24, { price: () => "£29.95", comp: (i) => (i === 2 ? "100% Cotton" : "") })}</ul>`),
  // 상품 표시가 하나도 없는 페이지(글만 길다).
  noSignal: doc("", `<h2>Our materials</h2><p>We love 100% Cotton.</p>`),
};
