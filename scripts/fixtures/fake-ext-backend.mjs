// 크롬 확장(chrome-extension/)을 통째로 돌려 볼 가짜 서버 — Render · Worker · 쇼핑몰을 한 포트에 둔다.
//
// scripts/smoke-extension-enrich.mjs 가 불러 쓴다. 진짜 사이트에 붙이면 결과가 매일
// 달라지고, 차단 여부도 우리가 정할 수 없다. 여기서는 상품 페이지가 '누가 여는가'에
// 따라 다르게 응답한다:
//   · 서비스워커 fetch  → Sec-Fetch-Dest: empty
//   · 탭으로 연 페이지  → Sec-Fetch-Dest: document
// 실제 봇 차단 사이트가 맨 요청에는 확인 화면·빈 껍데기를 주고, 브라우저 탭에는
// 진짜 화면을 주는 것을 그대로 흉내 낸다.
//
//   /r/...  Render (blocked-brands.json · category-links.json · brands.json)
//   /w/?..  Worker (catalogs · store=catalog · catalog · comps · store=overlay)
//   /a/...  SmokeBrand — 경우별 상품 6개
//   /b/...  GiveupBrand — fetch·탭 모두 막히는 상품 7개 (TAB_GIVEUP 확인용)
import { createServer } from "node:http";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64");

// 진짜 상품 페이지로 읽히려면 보이는 글자가 600자는 넘어야 한다(realPage).
const FILL = ("This relaxed piece is cut for everyday wear and finished with clean seams. " +
  "Model is 177 cm and wears a size small. Machine wash cold with like colours, tumble dry low. " +
  "Free returns within thirty days of delivery on full priced items. ").repeat(4);

const CHALLENGE = `<html><head><title>Pardon Our Interruption</title></head><body>
  <h1>Pardon Our Interruption</h1>
  <p>As you were browsing something about your browser made us think you were a bot.</p></body></html>`;

// 스크립트로만 그리는 빈 껍데기 — 상품 표식도 없고 보이는 글자도 600자에 못 미친다.
const SHELL = `<html><head><title>Loading</title></head><body><div id="app"></div>
  <script>window.__boot = 1;</script></body></html>`;

const real = (name, inner) => `<!doctype html><html><head><title>${name} | Smoke Shop</title></head>
  <body><h1>${name}</h1><p>${FILL}</p>${inner || ""}</body></html>`;

// 상품별 응답 — fetch(서비스워커)와 document(탭)를 따로 정한다.
const A = {
  // ① fetch 로 바로 읽힌다 — 탭을 열면 안 된다.
  "fetch-ok": {
    name: "Fetch Ok Tee",
    fetch: { status: 200, body: real("Fetch Ok Tee",
      `<meta property="product:color" content="Navy"><div class="detail">Composition: 95% Cotton, 5% Elastane</div>`) },
  },
  // ② fetch 는 봇 확인 화면, 탭은 진짜 화면인데 소재를 3초 뒤에야 그린다.
  "challenge-late": {
    name: "Late Knit Sweater",
    fetch: { status: 200, body: CHALLENGE },
    doc: { status: 200, body: real("Late Knit Sweater",
      `<div id="comp"></div><script>window.__p = {"selectedColor":"Oat"};
       setTimeout(() => { document.getElementById("comp").textContent = "Composition: 70% Wool, 30% Polyamide"; }, 3000);</script>`) },
  },
  // ③ fetch 는 빈 껍데기, 탭은 접힌 details — 펼쳐야(toggle) 내용이 생긴다.
  "js-shell": {
    name: "Shell Linen Shirt",
    fetch: { status: 200, body: SHELL },
    doc: { status: 200, body: real("Shell Linen Shirt",
      `<details id="mat"><summary>Composition</summary><div id="matbody"></div></details>
       <script>document.getElementById("mat").addEventListener("toggle", (e) => {
         if (e.target.open) document.getElementById("matbody").textContent = "Outer: 100% Linen";
       });</script>`) },
  },
  // ③-b fetch 가 403 — 탭은 진짜 화면.
  "fetch-403": {
    name: "Forbidden Silk Blouse",
    fetch: { status: 403, body: "Forbidden" },
    doc: { status: 200, body: real("Forbidden Silk Blouse", `<p>Composition: 100% Silk</p>`) },
  },
  // ④ fetch 도 탭도 봇 확인 화면 — 오버레이에 아무것도 남기면 안 된다(다음에 다시).
  "both-blocked": {
    name: "Blocked Wide Pant",
    fetch: { status: 200, body: CHALLENGE },
    doc: { status: 200, body: CHALLENGE },
  },
  // ⑤ fetch 로 읽혔는데 소재가 정말 없다 — 시도 시각(t)만 찍힌다.
  "no-comp": {
    name: "Plain Tank Top",
    fetch: { status: 200, body: real("Plain Tank Top", `<p>Care: hand wash only.</p>`) },
  },
};
const B_COUNT = 7;

function listing(prefix, items) {
  const cards = items.map(([slug, name], i) => `
    <li class="product-card">
      <a href="/${prefix}/item/${slug}"><img src="/img/${prefix}-${i}.png" width="300" height="400" alt="${name}"></a>
      <h3 class="product-name">${name}</h3><span class="price">$${48 + i}</span>
    </li>`).join("");
  return `<!doctype html><html><head><title>Tops</title></head><body>
    <h1>Tops</h1><ul class="grid">${cards}</ul></body></html>`;
}

export function startFakeBackend(port) {
  const base = `http://127.0.0.1:${port}`;
  const rec = {
    base,
    product: [],          // { path, dest } — 상품 페이지 요청과 Sec-Fetch-Dest
    listing: [],          // 목록 페이지 요청
    catalogs: {},         // site → items (store=catalog 로 저장된 것)
    catalogPosts: [],     // store=catalog 요청 원문
    overlayPosts: [],     // { site, body } — store=overlay 요청
    other: [],            // 예상 밖의 요청
  };
  const aItems = Object.entries(A).map(([slug, v]) => [slug, v.name]);
  const bItems = Array.from({ length: B_COUNT }, (_, i) => [`blocked-${i + 1}`, `Blocked Knit Top ${i + 1}`]);

  const server = createServer((req, res) => {
    const u = new URL(req.url, base);
    const p = u.pathname;
    const send = (status, type, body) => { res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" }); res.end(body); };
    const json = (o) => send(200, "application/json", JSON.stringify(o));
    const readBody = () => new Promise((r) => { let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => r(b)); });

    // ── Render ──
    if (p === "/r/blocked-brands.json") return json({ brands: ["SmokeBrand", "GiveupBrand"] });
    if (p === "/r/category-links.json") {
      return json({
        SmokeBrand: { tops: [`${base}/a/c/tops`] },
        GiveupBrand: { tops: [`${base}/b/c/tops`] },
      });
    }
    if (p === "/r/brands.json") {
      return json([{ name: "SmokeBrand", url: `${base}/a/` }, { name: "GiveupBrand", url: `${base}/b/` }]);
    }

    // ── Worker ──
    if (p === "/w/" || p === "/w") {
      const q = u.searchParams;
      if (q.has("catalogs")) return json({ list: [] });
      if (q.get("store") === "catalog" && req.method === "POST") {
        return readBody().then((b) => {
          const d = JSON.parse(b);
          rec.catalogPosts.push({ query: u.search, body: d });
          rec.catalogs[d.site] = d.items;
          json({ ok: true, count: d.items.length });
        });
      }
      if (q.has("catalog")) {
        const site = q.get("catalog");
        return json({ site, items: rec.catalogs[site] || [] });
      }
      if (q.has("comps")) {
        const site = q.get("comps");
        const last = [...rec.overlayPosts].reverse().find((o) => o.site === site);
        return json(last ? last.body : {});
      }
      if (q.get("store") === "overlay" && req.method === "POST") {
        return readBody().then((b) => {
          rec.overlayPosts.push({ site: q.get("site"), body: JSON.parse(b) });
          json({ ok: true });
        });
      }
      rec.other.push(req.method + " " + req.url);
      return send(404, "application/json", '{"error":"unknown"}');
    }

    // ── 쇼핑몰 ──
    if (p.startsWith("/img/")) return send(200, "image/png", PNG);
    if (p === "/a/c/tops") { rec.listing.push(req.url); return send(200, "text/html", listing("a", aItems)); }
    if (p === "/b/c/tops") { rec.listing.push(req.url); return send(200, "text/html", listing("b", bItems)); }
    let m = p.match(/^\/a\/item\/([\w-]+)$/);
    if (m && A[m[1]]) {
      const dest = String(req.headers["sec-fetch-dest"] || "");
      rec.product.push({ path: p, dest });
      const c = A[m[1]];
      const r = dest === "document" ? (c.doc || c.fetch) : c.fetch;
      return send(r.status, "text/html", r.body);
    }
    m = p.match(/^\/b\/item\/blocked-\d+$/);
    if (m) {
      rec.product.push({ path: p, dest: String(req.headers["sec-fetch-dest"] || "") });
      return send(200, "text/html", CHALLENGE);
    }
    if (p === "/favicon.ico") return send(404, "text/plain", "");
    rec.other.push(req.method + " " + req.url);
    send(404, "text/plain", "not found");
  });

  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve({ server, rec })));
}
