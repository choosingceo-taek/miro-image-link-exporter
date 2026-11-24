// 혼용률 정리(scripts/clean-stored-comp.mjs)를 붙여 볼 가짜 Worker + 가짜 상품 페이지.
//
// 진짜 Worker(worker/fabric-extractor.js)와 같은 방식으로 저장한다:
//   POST ?store=catalog       — 상품 칸을 같은 목록으로 거르고(name·imageUrl·productUrl·price·priceOrig·category·src·comp·
//                               color·sizes), replace=1 이 아니면 기존 목록과 병합(새 목록 우선, 안 온 옛 상품은 뒤에 남김)
//   POST ?store=overlay&site= — 받은 본문을 그대로 오버레이로
//   POST ?store=index         — 검색 인덱스
// 그래서 '카탈로그를 다시 보내면 무엇이 바뀌나'(칸 손실·순서·updated)가 진짜와 같게 드러난다.
// 상품 페이지(/p/…)도 같이 맡아, 정리 뒤에 야간 보강(enrich-comp.mjs)이 그 상품을 다시 읽는지 볼 수 있다.
//
// 모든 요청을 method 와 함께 적어 둔다 — 미리보기가 정말 GET 만 보냈는지 테스트가 센다.
import { createServer } from "node:http";

const CAT_FIELDS = [["name", 200], ["imageUrl", 1000], ["productUrl", 1000], ["price", 40], ["priceOrig", 40], ["category", 20],
  ["src", 300], ["comp", 160], ["color", 80], ["sizes", 200]];

// world: { catalogs: { site: { brand, items } }, overlays: { site: {} }, pages: { "/p/x": html } }
// port: 같은 주소로 여러 번 띄울 때(미리보기의 계획 파일을 다음 실행이 그대로 쓰도록). 0 이면 아무 포트.
export async function startCleanWorker(build, port = 0) {
  const state = { requests: [], catalogs: {}, overlays: {}, index: null, hits: {}, pages: {} };
  const srv = createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    state.requests.push({ method: req.method, path: u.pathname, query: u.search });
    const j = (o, code = 200) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
    const body = () => new Promise((r) => { let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => r(b)); });
    if (u.pathname.startsWith("/p/") || u.pathname.startsWith("/c/")) {
      state.hits[u.pathname] = (state.hits[u.pathname] || 0) + 1;
      const pg = state.pages[u.pathname];
      if (pg == null) { res.writeHead(403); return res.end("Forbidden"); }
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(pg);
    }
    if (u.pathname === "/category-links.json") return j({});
    if (u.pathname === "/wb/available") return j({ archived_snapshots: {} });
    if (req.method === "GET") {
      if (u.searchParams.has("catalogs")) {
        return j({ ok: true, list: Object.entries(state.catalogs).map(([site, c]) => ({ site, brand: c.brand, count: c.items.length, updated: c.updated })) });
      }
      if (u.searchParams.has("catalog")) {
        const c = state.catalogs[u.searchParams.get("catalog")];
        return c ? j(c) : j({ error: "no catalog" }, 404);
      }
      if (u.searchParams.has("comps")) return j(state.overlays[u.searchParams.get("comps")] || {});
      if (u.searchParams.has("comp")) return j({});
      return j({ error: "?" }, 400);
    }
    if (req.method !== "POST") return j({ error: "POST only" }, 405);
    const store = u.searchParams.get("store");
    if (store === "overlay") {
      return body().then((t) => {
        if (!t || t[0] !== "{") return j({ error: "body must be a JSON object" }, 400);
        state.overlays[u.searchParams.get("site")] = JSON.parse(t);
        j({ ok: true });
      });
    }
    if (store === "catalog") {
      return body().then((t) => {
        const b = JSON.parse(t);
        const items = (b.items || []).filter((p) => p && /^https?:\/\//i.test(p.imageUrl || "") && /^https?:\/\//i.test(p.productUrl || ""))
          .slice(0, 800).map((p) => Object.fromEntries(CAT_FIELDS.map(([k, max]) => [k, String(p[k] || (k === "category" ? "tops" : "")).slice(0, max)])));
        if (!items.length) return j({ error: "no valid items" }, 400);
        const old = (state.catalogs[b.site] || {}).items || [];
        let merged = items;
        if (u.searchParams.get("replace") !== "1" && old.length) {
          const seen = new Set(items.map((p) => p.productUrl));
          merged = items.concat(old.filter((p) => p && !seen.has(p.productUrl))).slice(0, 800);
        }
        state.catalogs[b.site] = { site: b.site, brand: String(b.brand || ""), updated: Date.now(), items: merged };
        j({ ok: true, site: b.site, count: merged.length });
      });
    }
    if (store === "index") return body().then((t) => { state.index = JSON.parse(t); j({ ok: true, count: state.index.items.length }); });
    j({ error: "?" }, 400);
  });
  await new Promise((r) => srv.listen(port, "127.0.0.1", r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const w = build(base);
  state.catalogs = w.catalogs; state.overlays = w.overlays; state.pages = w.pages || {};
  return { base, state, close: () => new Promise((r) => srv.close(r)) };
}
