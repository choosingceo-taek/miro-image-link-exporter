// KV 쓰기를 세는 가짜 Worker + 가짜 쇼핑몰 — scripts/test-kv-writes.mjs 가 쓴다.
//
// 진짜 Worker(worker/fabric-extractor.js)와 같은 규칙으로 KV 를 흉내 낸다:
//   POST ?store=catalog  → put 1 (+ legacy 를 주면 delete 1)
//   POST ?store=overlay  → put 1 (comp:<site>)      POST ?store=details → put 1 (detail:<site>)
//   POST ?store=index    → put 1 (search:index — Worker 처럼 칸을 걸러 저장)
//   그 밖의 GET 은 쓰기 0. putLimit 을 넘으면 진짜처럼 "KV put() limit exceeded for the day." 를 돌려준다.
//
// 브랜드 수·상품 수는 실제 카탈로그(134개 브랜드)에 맞춰 만든다. 상품 하나하나의 처지(신상·재시도·상세 채우기·
// 매번 다시 열리던 상품·막힌 상품)는 11/26~27 야간 보강 로그에서 본 것을 흉내 낸다(DAILY-AUTOMATION.md '쓰기 예산').
import { createServer } from "node:http";

const DAY = 86400000;
const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", ...o })}</script>`;
const filler = "<p>" + "This piece is part of our everyday collection, designed to be worn season after season. ".repeat(10) + "</p>";
export const page = (name, body, ldo) => `<html><head><title>${name}</title>${ldo ? ld({ name, ...ldo }) : ""}</head><body>
  <main><h1>${name}</h1>${body}${filler}</main></body></html>`;

// 진짜 Worker 의 store=index 가 남기는 칸 그대로.
const indexItem = (p) => ({
  name: String(p.name || "").slice(0, 200), brand: String(p.brand || "").slice(0, 80), category: String(p.category || "tops").slice(0, 20),
  imageUrl: String(p.imageUrl).slice(0, 1000), productUrl: String(p.productUrl).slice(0, 1000),
  price: String(p.price || "").slice(0, 40), priceOrig: String(p.priceOrig || "").slice(0, 40),
  comp: String(p.comp || "").slice(0, 160), color: String(p.color || "").slice(0, 80), sizes: String(p.sizes || "").slice(0, 200),
});

// 상품 하나의 처지(브랜드마다 6개):
//   0·1 신상(오버레이 기록 없음) — 1차에서 읽혀 혼용률이 찬다
//   2   재시도(6일 전에 시도, 빈칸) — 2차에서 읽혀 혼용률이 찬다
//   3   혼용률은 있고 상세 없음(40일 전) — 3차에서 상세를 채운다. 10번째 브랜드마다는 '막힌 상세'(어제 열었는데 403 — Chico's 형)
//   4   읽히는데 혼용률이 없음(컬러·가격만, 어제 이 규칙 판으로 읽음 rv) — 예전 impit 재확인 규칙이 매번 다시 열던 상품(Alo Yoga 형)
//   5   다 찼음(혼용률·컬러·상세)
export function buildWorld({ brands = 134, ruleV = "", now = Date.now() } = {}) {
  const sites = [];
  for (let b = 0; b < brands; b++) sites.push({ site: `b${b}.example.brand${b}`, brand: `Brand ${b}`, b });
  return {
    sites, now, ruleV,
    items: (base, s) => Array.from({ length: 6 }, (_, n) => ({
      name: `Brand${s.b} Item${n} Shirt`, productUrl: `${base}/p/${s.b}/${n}`, imageUrl: `${base}/i/${s.b}/${n}.jpg`, category: "tops", price: "$10",
    })),
    overlay: (base, s) => {
      const u = (n) => `${base}/p/${s.b}/${n}`;
      const blockedDetail = s.b % 10 === 9;
      return {
        [u(2)]: { t: now - 6 * DAY },
        [u(3)]: { t: blockedDetail ? now - DAY : now - 40 * DAY, comp: "Cotton 100%", color: "Navy" },
        [u(4)]: { t: now - DAY, color: "Black", price: "$10", rv: ruleV, cv: "x" },
        [u(5)]: { t: now - 40 * DAY, comp: "Linen 100%", color: "Sand" },
      };
    },
    // 4번은 어제 읽혔다 — 그때 뽑은 상세(컬러)도 저장돼 있다.
    details: (base, s) => ({ [`${base}/p/${s.b}/4`]: { colors: ["Black"], dt: now - DAY }, [`${base}/p/${s.b}/5`]: { desc: "Kept description.", dt: now - DAY } }),
    page: (b, n) => {
      const name = `Brand${b} Item${n} Shirt`;
      if (n === 3 && b % 10 === 9) return null;   // 막힌 상세(403)
      if (n === 4) return page(name, `<div>Colour: Black</div>`, { color: "Black" });
      const comp = n === 3 ? "100% Cotton" : n === 5 ? "100% Linen" : "95% Cotton, 5% Elastane";
      return page(name, `<h3>Details</h3><ul><li>Relaxed fit ${b}-${n}</li><li>Button front</li></ul><div>Composition: ${comp}</div>`, { color: "Navy" });
    },
  };
}

export async function startKvWorker(world, { putLimit = Infinity, onComps = null } = {}) {
  const st = {
    overlays: {}, details: {}, catalogs: {}, index: null,
    extra: {},   // site → 나중에 들어온 신상(헤드리스 수집 흉내) — addNew 로 넣는다
    puts: 0, deletes: 0, byKind: {}, posts: 0, requests: [], limitReplies: 0,
  };
  let base = "";
  const srv = createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    st.requests.push({ method: req.method, path: u.pathname, query: u.search });
    const j = (o, code = 200) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
    const body = () => new Promise((r) => { let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => r(b)); });
    const m = u.pathname.match(/^\/p\/(\d+)\/(\d+)$/);
    if (m) {
      const html = world.page(Number(m[1]), Number(m[2]));
      if (html == null) { res.writeHead(403); return res.end("Forbidden"); }
      res.writeHead(200, { "Content-Type": "text/html" }); return res.end(html);
    }
    if (u.pathname === "/category-links.json") return j({});
    const q = u.searchParams;
    if (req.method === "GET") {
      if (q.has("catalogs")) return j({ ok: true, list: world.sites.map((s) => ({ site: s.site, brand: s.brand, count: 6, updated: st.catalogs[s.site] ? st.catalogs[s.site].updated : world.now - 2 * 3600000 })) });
      if (q.has("catalog")) {
        const s = world.sites.find((x) => x.site === q.get("catalog"));
        return s ? j({ site: s.site, brand: s.brand, items: world.items(base, s).concat(st.extra[s.site] || []) }) : j({ error: "no catalog" }, 404);
      }
      if (q.has("comps")) {
        const site = q.get("comps");
        const out = JSON.stringify(st.overlays[site] || {});
        if (onComps) onComps(site, st, base);
        res.writeHead(200, { "Content-Type": "application/json" }); return res.end(out);
      }
      if (q.has("details")) return j(st.details[q.get("details")] || {});
      if (q.has("index")) return j(st.index || { items: [] });
      if (q.has("comp")) return j({});
      return j({ error: "?" }, 400);
    }
    // POST — 진짜 Worker 처럼 한 요청이 KV 에 put 하나(카탈로그는 + delete 하나).
    st.posts++;
    const kind = q.get("store") || "extract";
    return body().then((b) => {
      if (st.puts >= putLimit) { st.limitReplies++; return j({ error: `store=${kind}: KV put() limit exceeded for the day.` }); }
      const put = () => { st.puts++; st.byKind[kind] = (st.byKind[kind] || 0) + 1; };
      if (kind === "overlay") { st.overlays[q.get("site")] = JSON.parse(b); put(); return j({ ok: true, site: q.get("site"), bytes: b.length }); }
      if (kind === "details") { st.details[q.get("site")] = JSON.parse(b); put(); return j({ ok: true, site: q.get("site"), bytes: b.length }); }
      if (kind === "index") {
        const items = (JSON.parse(b).items || []).filter((p) => p && /^https?:\/\//i.test(p.imageUrl || "") && /^https?:\/\//i.test(p.productUrl || "")).slice(0, 40000).map(indexItem);
        st.index = { updated: Date.now(), items }; put(); return j({ ok: true, count: items.length });
      }
      if (kind === "catalog") {
        const o = JSON.parse(b); st.catalogs[o.site] = { ...o, updated: Date.now() }; put();
        if (q.get("legacy")) st.deletes++;
        return j({ ok: true, site: o.site, count: (o.items || []).length });
      }
      return j({ error: "unknown store" }, 400);
    });
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${srv.address().port}`;
  for (const s of world.sites) {
    st.overlays[s.site] = world.overlay(base, s);
    st.details[s.site] = world.details(base, s);
  }
  // 헤드리스가 그 브랜드 카탈로그를 새로 저장한 것처럼 — 신상 하나를 더하고 갱신 시각을 지금으로.
  const addNew = (b) => {
    const s = world.sites[b];
    (st.extra[s.site] = st.extra[s.site] || []).push({ name: `Brand${b} Item1 Shirt`, productUrl: `${base}/p/${b}/1?new=1`, imageUrl: `${base}/i/${b}/new.jpg`, category: "tops", price: "$10" });
    st.catalogs[s.site] = { ...(st.catalogs[s.site] || {}), updated: Date.now() };
  };
  return { base, st, addNew, close: () => new Promise((r) => srv.close(r)) };
}
