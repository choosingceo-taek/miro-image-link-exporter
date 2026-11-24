// 야간 혼용률 보강(scripts/enrich-comp.mjs)을 붙여 볼 가짜 세상 — Worker · 쇼핑몰 · 웹 아카이브.
//
// 한 서버가 셋을 다 맡는다. 주소로 가른다:
//   /p/<n>                쇼핑몰 상품 페이지(PAGES 에 없으면 403 = 차단)
//   /?catalogs ... /?store=...   Worker
//   /wb/available?url=    아카이브 보관본 조회(archive.org/wayback/available 흉내)
//   /web/<ts>id_/<url>    아카이브 보관본 원본(web.archive.org/web/<ts>id_/<url> 흉내)
//
// 모든 요청을 method·경로와 함께 적어 둔다 — DRY 실행이 정말 아무것도 안 썼는지,
// 아카이브를 몇 번 불렀는지를 테스트가 센다.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// opts:
//   pages:   { "/p/1": html | {status, body} }      쇼핑몰
//   items:   [{ productUrl, name, ... }] 또는 (base) => [...]
//   overlay: {} 또는 (base) => {}                   처음 오버레이
//   archive: { "<원본 URL(쿼리 포함 가능)>": { ts, html, status, redirectTo, snapStatus } }
//            또는 (base) => {...}. 없으면 '보관본 없음'.
//   archiveStatus: (kind, req) => number|0          429·503 을 흉내낼 때(0 이면 정상)
//   catalogLinks: { brand: { tops: [url] } }        카테고리 URL 목록(Render 흉내)
export async function startFake(opts = {}) {
  const state = { requests: [], stores: [], index: null, overlay: {}, hits: {} };
  let base = "";
  let archive = {};
  const srv = createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    state.requests.push({ method: req.method, path: u.pathname, query: u.search, ua: req.headers["user-agent"] || "" });
    const j = (o, code = 200) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
    const body = () => new Promise((r) => { let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => r(b)); });

    if (u.pathname.startsWith("/p/")) {
      state.hits[u.pathname] = (state.hits[u.pathname] || 0) + 1;
      const pg = (opts.pages || {})[u.pathname];
      if (pg == null) { res.writeHead(403); return res.end("Forbidden"); }
      const o = typeof pg === "string" ? { status: 200, body: pg } : pg;
      res.writeHead(o.status || 200, { "Content-Type": "text/html" });
      return res.end(o.body || "");
    }
    if (u.pathname === "/category-links.json") return j(opts.catalogLinks || {});
    if (u.pathname === "/wb/available") {
      const st = opts.archiveStatus ? opts.archiveStatus("api", u) : 0;
      if (st) { res.writeHead(st, { "Retry-After": "0" }); return res.end("busy"); }
      const want = u.searchParams.get("url");
      state.hits["api:" + want] = (state.hits["api:" + want] || 0) + 1;
      const a = archive[want];
      if (!a) return j({ url: want, archived_snapshots: {} });
      return j({ url: want, archived_snapshots: { closest: {
        status: a.snapStatus || "200", available: true, url: want, timestamp: a.ts,
      } } });
    }
    if (u.pathname.startsWith("/web/")) {
      const st = opts.archiveStatus ? opts.archiveStatus("web", u) : 0;
      if (st) { res.writeHead(st, { "Retry-After": "0" }); return res.end("busy"); }
      // /web/<ts>id_/<원본 URL> — 원본 URL 안의 '//' 와 쿼리를 그대로 살린다.
      const raw = req.url.slice("/web/".length);
      const m = raw.match(/^(\d+)id_\/(.+)$/);
      if (!m) { res.writeHead(404); return res.end("no"); }
      const a = archive[m[2]];
      state.hits["web:" + m[2]] = (state.hits["web:" + m[2]] || 0) + 1;
      if (!a) { res.writeHead(404); return res.end("Not in archive"); }
      // 원래 페이지가 다른 주소로 넘어간 보관본 — 아카이브는 그 주소의 보관본으로 보낸다.
      if (a.redirectTo) {
        res.writeHead(302, { Location: `${base}/web/${a.ts}id_/${a.redirectTo}` });
        return res.end();
      }
      res.writeHead(a.status || 200, { "Content-Type": "text/html" });
      return res.end(a.html || "");
    }

    if (u.searchParams.has("catalogs")) {
      return j({ list: opts.list || [{ site: "test.com.testbrand", brand: "TestBrand", count: 1 }] });
    }
    if (u.searchParams.has("catalog")) {
      const site = u.searchParams.get("catalog");
      const items = typeof opts.items === "function" ? opts.items(base, site) : (opts.items || []);
      return j({ brand: opts.brandOf ? opts.brandOf(site) : "TestBrand", items });
    }
    if (u.searchParams.has("comps")) {
      const site = u.searchParams.get("comps");
      return j(opts.perSite ? (state.overlay[site] || {}) : state.overlay);
    }
    if (u.searchParams.has("comp")) { state.hits.bypass = (state.hits.bypass || 0) + 1; return j({}); }
    if (u.searchParams.get("store") === "overlay") {
      return body().then((b) => {
        const o = JSON.parse(b);
        if (opts.perSite) state.overlay[u.searchParams.get("site")] = o; else state.overlay = o;
        state.stores.push(o); j({ ok: true });
      });
    }
    if (u.searchParams.get("store") === "index") {
      return body().then((b) => { state.index = JSON.parse(b); j({ ok: true, count: state.index.items.length }); });
    }
    res.writeHead(404); res.end("{}");
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${srv.address().port}`;
  state.overlay = typeof opts.overlay === "function" ? opts.overlay(base) : (opts.overlay || {});
  archive = typeof opts.archive === "function" ? opts.archive(base) : (opts.archive || {});
  return { base, state, close: () => new Promise((r) => srv.close(r)) };
}

// 진짜 스크립트를 가짜 세상에 붙여 끝까지 돌린다.
export async function runEnrich(base, env = {}) {
  const run = spawn(process.execPath, [join(ROOT, "scripts/enrich-comp.mjs")], {
    env: {
      ...process.env, WORKER_URL: base, WORKER_TOKEN: "test", BRAND_POOL: "1",
      WAYBACK_API: `${base}/wb/available`, WAYBACK_WEB: `${base}/web`,
      CATEGORY_LINKS_URL: `${base}/category-links.json`,
      WAYBACK_GAP_MS: "5", WAYBACK_BACKOFF_MS: "5",
      NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1",
      DRY: "", BRANDS: "", ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  run.stdout.on("data", (d) => { out += d; });
  run.stderr.on("data", (d) => { out += d; });
  const code = await new Promise((r) => run.on("close", r));
  return { code, out };
}
