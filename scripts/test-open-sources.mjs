#!/usr/bin/env node
// 공개 출처 측정(open-sources.mjs) 시험 — 가짜 쇼핑몰·Worker·Wayback·Common Crawl(로컬 서버)로만 돈다.
//  · robots.txt 규칙(일반 크롤러)을 지켜 막힌 사이트맵은 가져오지 않는다
//  · 사이트맵 색인 → 같은 지역·상품 사이트맵을 고르고(gzip 포함) 상품 주소·저장 주소 겹침을 센다
//  · 429 를 받은 호스트는 그 실행에서 더 묻지 않는다 · 한 주소 3번 · 한 호스트 간격
//  · 보관본(Wayback id_ · Common Crawl WARC)에서 혼용률을 읽고, 차단 화면 보관본은 읽지 않는다
//  · GET 말고는 아무것도 보내지 않는다
import http from "node:http";
import { gzipSync } from "node:zlib";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseRobots, rulesFor, isAllowed, blocksAll, parseSitemap, pickChildren, guessCategory, warcBody, normUrl, challengeOf } from "./open-sources.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const ok = (c, m) => { if (c) console.log("  ✅ " + m); else { console.error("  ❌ " + m); bad++; } };

// ── 규칙 단위 ──
{
  const r = parseRobots("User-agent: Googlebot\nDisallow: /g\n\nUser-agent: *\nUser-agent: other\nDisallow: /search\nDisallow: /*?q=\nAllow: /search/help$\nDisallow:\nSitemap: https://x/s1.xml\nSitemap: https://x/s1.xml\n\nUser-agent: CCBot\nDisallow: /\n");
  const ru = rulesFor(r, "*");
  ok(!isAllowed(ru, "/search/a").ok && isAllowed(ru, "/search/help").ok && !isAllowed(ru, "/search/help2").ok, "가장 길게 맞는 규칙 · $ 끝 표시");
  ok(!isAllowed(ru, "/p?q=1").ok && isAllowed(ru, "/p/1").ok && isAllowed(ru, "/g").ok, "* 와일드카드 · 다른 크롤러 그룹 규칙은 일반 크롤러에 안 씀 · 빈 Disallow 무시");
  ok(blocksAll(r, "ccbot") && !blocksAll(r, "*") && r.sitemaps.length === 1, "CCBot 전체 막음을 알아본다 · 사이트맵 중복 제거");
  const sm = parseSitemap('<?xml version="1.0"?><urlset><url><loc>https://x/p/a-1?x=1&amp;y=2</loc><lastmod>2026</lastmod></url><url><loc><![CDATA[https://x/p/b-2]]></loc></url></urlset>');
  ok(sm.kind === "urlset" && sm.locs[0] === "https://x/p/a-1?x=1&y=2" && sm.locs[1] === "https://x/p/b-2" && sm.lastmod === 1, "사이트맵 주소(&amp;·CDATA)·lastmod");
  ok(parseSitemap("<sitemapindex><sitemap><loc>https://x/a.xml</loc></sitemap></sitemapindex>").kind === "index", "사이트맵 색인");
  ok(pickChildren(["https://a/sitemap-cms.xml", "https://a/en_gb/products-1.xml", "https://a/en_us/products-1.xml"], ["en_us", "us"], 1)[0] === "https://a/en_us/products-1.xml", "같은 지역의 상품 사이트맵을 먼저 고른다");
  ok(guessCategory("https://x/products/linen-midi-dress") === "dresses" && guessCategory("https://x/p/relaxed-t-shirt") === "tops" &&
    guessCategory("https://x/p/poplin-shirt") === "shirts" && guessCategory("https://x/men/hoodie") === "" && guessCategory("https://x/productpage.1.html") === "", "주소 낱말로 카테고리 짐작(남성·번호만 있는 주소는 모름)");
  ok(normUrl("https://www.x.com/A/b/?q=1") === normUrl("https://x.com/a/b"), "주소 비교는 www·쿼리·끝 / ·대소문자 무시");
  ok(challengeOf(200, "<title>Just a moment...</title>") && challengeOf(403, "x") === "HTTP 403" && !challengeOf(200, "<title>Shirt</title>"), "차단 화면 알아보기");
}

// ── 가짜 인터넷 ──
const PRODUCT = (name, comp) => `<html><head><title>${name}</title><script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"${name}","material":"${comp}","offers":{"@type":"Offer","price":"20","priceCurrency":"USD"}}</script><meta property="og:type" content="product"></head><body><h1>${name}</h1><p>Composition: ${comp}</p><button>Add to bag</button></body></html>`;
const hits = [];
let PORT = 0;
const A = () => `http://127.0.0.1:${PORT}`, B = () => `http://localhost:${PORT}`;
// Common Crawl 의 WARC 레코드 하나(gzip 한 덩어리): WARC 머리 · HTTP 머리 · 본문
const warc = (html) => gzipSync(Buffer.concat([
  Buffer.from("WARC/1.0\r\nWARC-Type: response\r\n\r\nHTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n"), Buffer.from(html)]));
const srv = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  hits.push({ method: req.method, host: req.headers.host, path: u.pathname + u.search, at: Date.now() });
  const send = (code, body, type = "text/plain") => { res.writeHead(code, { "content-type": type }); res.end(body); };
  const host = String(req.headers.host || "");
  // Worker(읽기)
  if (u.pathname === "/worker/") {
    if (u.searchParams.get("catalogs")) return send(200, JSON.stringify({ ok: true, list: [{ site: "a.shop", brand: "Alpha", count: 3 }, { site: "b.shop", brand: "Bravo", count: 1 }] }));
    if (u.searchParams.get("catalog") === "a.shop") return send(200, JSON.stringify({ items: [
      { productUrl: `${A()}/en_us/p/linen-midi-dress-100001.html`, category: "dresses" },
      { productUrl: `${A()}/en_us/p/relaxed-t-shirt-100002.html`, category: "tops" },
      { productUrl: `${A()}/en_us/p/poplin-shirt-100003.html`, category: "shirts" },
    ] }));
    if (u.searchParams.get("catalog") === "b.shop") return send(200, JSON.stringify({ items: [{ productUrl: `${B()}/p/blocked-top-200001.html`, category: "tops" }] }));
    if (u.searchParams.get("comps") === "a.shop") return send(200, JSON.stringify({ [`${A()}/en_us/p/poplin-shirt-100003.html`]: { comp: "Cotton 100%" } }));
    if (u.searchParams.get("comps")) return send(200, "{}");
  }
  // 아카이브
  if (u.pathname === "/wb/available") {
    const t = u.searchParams.get("url");
    if (/linen-midi-dress/.test(t)) return send(200, JSON.stringify({ archived_snapshots: { closest: { available: true, status: "200", timestamp: "20260101000000" } } }));
    if (/relaxed-t-shirt/.test(t)) return send(200, JSON.stringify({ archived_snapshots: { closest: { available: true, status: "200", timestamp: "20260202000000" } } }));
    return send(200, JSON.stringify({ archived_snapshots: {} }));
  }
  if (u.pathname.startsWith("/wb/web/")) {
    if (/linen-midi-dress/.test(u.pathname)) return send(200, PRODUCT("Linen Midi Dress", "100% Linen"), "text/html");
    return send(200, "<html><head><title>Access Denied</title></head><body>Reference #18</body></html>", "text/html");
  }
  if (u.pathname === "/cc/collinfo.json") return send(200, JSON.stringify([{ id: "CC-MAIN-2026-40" }, { id: "CC-MAIN-2026-33" }, { id: "CC-MAIN-2026-25" }]));
  if (u.pathname === "/cc/CC-MAIN-2026-40-index") {
    if (/relaxed-t-shirt/.test(u.searchParams.get("url"))) return send(200, JSON.stringify({ status: "200", filename: "crawl/a.warc.gz", offset: "0", length: String(WARC_T.length) }) + "\n");
    return send(404, '{"message":"No Captures found"}');
  }
  if (u.pathname === "/cc/CC-MAIN-2026-33-index") {
    if (/poplin-shirt/.test(u.searchParams.get("url"))) return send(200, JSON.stringify({ status: "301", filename: "x", offset: "0", length: "1" }) + "\n");
    return send(404, "{}");
  }
  if (u.pathname === "/ccdata/crawl/a.warc.gz") {
    const m = String(req.headers.range || "").match(/bytes=(\d+)-(\d+)/);
    if (!m) return send(400, "range 필요");
    res.writeHead(206, { "content-type": "application/octet-stream" }); return res.end(WARC_T.subarray(Number(m[1]), Number(m[2]) + 1));
  }
  // 브랜드 B(localhost) — robots 에서 429
  if (host.startsWith("localhost")) return send(429, "slow down");
  // 브랜드 A(127.0.0.1) 쇼핑몰
  if (u.pathname === "/robots.txt") return send(200, `User-agent: *\nDisallow: /private/\nDisallow: /search\n\nUser-agent: CCBot\nDisallow: /\n\nSitemap: ${A()}/sitemap_index.xml\nSitemap: ${A()}/private/hidden.xml\n`);
  if (u.pathname === "/sitemap_index.xml") return send(200, `<sitemapindex><sitemap><loc>${A()}/sitemap-cms.xml</loc></sitemap><sitemap><loc>${A()}/en_gb/sitemap-products-1.xml</loc></sitemap><sitemap><loc>${A()}/en_us/sitemap-products-1.xml.gz</loc></sitemap><sitemap><loc>${A()}/private/sitemap-products-2.xml</loc></sitemap></sitemapindex>`, "application/xml");
  if (u.pathname === "/en_us/sitemap-products-1.xml.gz") { res.writeHead(200, { "content-type": "application/x-gzip" }); return res.end(gzipSync(`<urlset>${["linen-midi-dress-100001", "relaxed-t-shirt-100002", "wide-leg-trouser-100004", "cable-knit-sweater-100005"].map((s) => `<url><loc>${A()}/en_us/p/${s}.html</loc><lastmod>2026-11-01</lastmod></url>`).join("")}<url><loc>${A()}/en_us/stores</loc></url></urlset>`)); }
  if (u.pathname === "/en_gb/sitemap-products-1.xml") return send(200, `<urlset><url><loc>${A()}/en_gb/p/x-1000099.html</loc></url></urlset>`, "application/xml");
  if (u.pathname === "/sitemap-cms.xml") return send(200, `<urlset><url><loc>${A()}/about</loc></url></urlset>`, "application/xml");
  return send(404, "not found");
});
const WARC_T = warc(PRODUCT("Relaxed T-Shirt", "95% Cotton, 5% Elastane"));
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
PORT = srv.address().port;
ok(warcBody(WARC_T).status === 200 && /Relaxed T-Shirt/.test(warcBody(WARC_T).html), "WARC 레코드에서 HTTP 본문을 꺼낸다");

const dir = mkdtempSync(join(tmpdir(), "open-sources-"));
const targets = join(dir, "t.json");
writeFileSync(targets, JSON.stringify({ brands: [{ brand: "Alpha", origin: A() }, { brand: "Bravo", origin: B() }] }));
const run = spawn(process.execPath, [join(ROOT, "scripts/open-sources.mjs")], {
  env: { ...process.env, TARGETS: targets, REPORT_DIR: dir, RUN_ID: "t", WORKER_URL: `${A()}/worker`, WORKER_TOKEN: "t",
    WAYBACK_API: `${A()}/wb/available`, WAYBACK_WEB: `${A()}/wb/web`, CC_INDEX: `${A()}/cc`, CC_DATA: `${A()}/ccdata`,
    PER: "3", READ_PER: "3", MAX_CHILD: "2", GAP_MS: "60", ARCHIVE_GAP_MS: "60", CC_GAP_MS: "60",
    NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1", HTTP_PROXY: "", HTTPS_PROXY: "", http_proxy: "", https_proxy: "" },
  stdio: ["ignore", "pipe", "pipe"],
});
let out = "";
run.stdout.on("data", (d) => { out += d; }); run.stderr.on("data", (d) => { out += d; });
const code = await new Promise((r) => run.on("close", r));
srv.close();
if (code !== 0) console.error(out);
ok(code === 0, "실행이 끝난다(종료 0)");
ok(/^STORE: 0 · 읽기만/m.test(out), "로그 첫 줄에 '읽기만'(STORE: 0)");
const res = JSON.parse(readFileSync(join(dir, "open-sources-t.json"), "utf8"));
const md = readFileSync(join(dir, "open-sources-t.md"), "utf8");
const a = res.rows.find((r) => r.brand === "Alpha"), b = res.rows.find((r) => r.brand === "Bravo");
ok(hits.every((h) => h.method === "GET"), "GET 말고는 아무것도 보내지 않았다");
ok(!hits.some((h) => h.path.startsWith("/private/")), "robots.txt 가 막은 경로(/private/)는 사이트맵이라도 가져오지 않았다");
ok(a.sitemap.children.blockedByRobots.length >= 1 && a.sitemap.sitemaps.some((m) => m.robots), "막혀서 안 가져온 사이트맵을 기록한다");
ok(a.sitemap.robots.ok && a.sitemap.robots.ccbot === "막음" && a.sitemap.robots.sitemapsListed === 2, "robots.txt 상태·적힌 사이트맵 수·CCBot 막음");
ok(hits.some((h) => h.path === "/en_us/sitemap-products-1.xml.gz") && !hits.some((h) => h.path === "/sitemap-cms.xml"), "같은 지역(en_us)의 상품 사이트맵을 고르고 cms 사이트맵은 뒤로(상한 2)");
ok(a.sitemap.productUrls === 4 && a.sitemap.urls === 5, `상품 주소 수(받은 사이트맵, gzip 포함): ${a.sitemap.productUrls}/${a.sitemap.urls}`);
ok(a.sitemap.storedInMap === 2 && a.sitemap.storedChecked === 3 && a.storedCatsInMap.dresses[0] === 1 && a.storedCatsInMap.shirts[0] === 0, "저장 주소 중 사이트맵에 있는 수 · 카테고리별");
ok(a.sitemap.guessCats.pants === 1 && a.sitemap.guessCats.dresses === 1, "주소 낱말로 카테고리 짐작(추정)");
ok(a.wayback.n === 3 && a.wayback.cap === 2 && a.wayback.comp === 1 && /차단 화면/.test(a.wayback.why), `Wayback: 보관 2 · 혼용률 1 · 차단 화면 보관본은 안 읽음(${a.wayback.why})`);
ok(a.commoncrawl.cap === 1 && a.commoncrawl.comp === 1 && a.commoncrawl.items.some((x) => x.read && /Cotton 95%/.test(x.read.comp)), "Common Crawl: 색인 → WARC 범위 요청 → 혼용률");
ok(a.wayback.items[0].url.includes("linen-midi-dress") || a.wayback.items[0].url.includes("relaxed"), "표본은 혼용률 빈 상품부터");
ok(b.sitemap.robots.status === 429 && res.stops.some((s) => s.status === 429), "429 를 기록한다");
const bHits = hits.filter((h) => String(h.host).startsWith("localhost"));
ok(bHits.length === 1, `429 뒤 그 호스트에는 더 묻지 않는다(localhost 요청 ${bHits.length}회)`);
const per = new Map();
for (const h of hits) { const k = h.host + h.path; per.set(k, (per.get(k) || 0) + 1); }
ok([...per.values()].every((n) => n <= 3), "한 주소에 3번 넘게 묻지 않았다");
const shop = hits.filter((h) => String(h.host).startsWith("127.0.0.1") && !h.path.startsWith("/worker/")).map((h) => h.at);
let minGap = Infinity;
for (let i = 1; i < shop.length; i++) minGap = Math.min(minGap, shop[i] - shop[i - 1]);
ok(minGap >= 50, `한 호스트 요청 사이 간격을 지킨다(가장 짧은 간격 ${minGap}ms ≥ 설정 60ms−오차)`);
ok(/\| Alpha \| 200 /.test(md) && /\| Bravo \| 429/.test(md) && /robots 가 막아 안 가져옴/.test(md), "리포트 표에 브랜드별 상태가 적힌다");

if (bad) { console.error(`\n공개 출처 측정 ${bad}건 실패`); process.exit(1); }
console.log("✅ 공개 출처 측정 통과 — robots 를 지키고, 429 에 멈추고, GET 만 보내고, 보관본 혼용률을 가드와 함께 읽는다");
