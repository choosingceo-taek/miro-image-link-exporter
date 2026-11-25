#!/usr/bin/env node
// 접근 지도 근거(access-evidence.mjs)와 유료 서비스 시험 칸(try-engines 의 ext 엔진) 시험.
// 바깥 사이트·Worker·Render 에는 접속하지 않는다 — 가짜 API 서버(127.0.0.1)만 쓴다.
//
// 확인하는 것:
//  1. 차단 화면의 흔적으로 차단 주체를 가린다(Cloudflare·Akamai·PerimeterX·DataDome·Imperva) — 흔적 없으면 '알 수 없음'
//  2. 원인 어휘(geo·dead·shell·selector·rate-limit·conn-drop)
//  3. 외부 API 엔진: 설정이 있을 때만 생기고, 키를 헤더로 보내고, 결과를 무료 엔진과 같은 판정으로 적고,
//     키·API 주소가 리포트·결과 JSON·로그 어디에도 안 남는다. 설정이 없거나 깨졌으면 조용히 빠진다.
import http from "node:http";
import { spawnSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  identify, evidenceOf, causeOf, cookieNamesFromSetCookie, countProductLinks, redirectKind,
  loadExtConfigs, secretsOf, redact, buildExtRequest, readExtResponse,
} from "./access-evidence.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (cond, msg) => { if (cond) console.log("  ✓ " + msg); else { console.log("  ✗ " + msg); fails++; } };

console.log("1. 차단 주체");
{
  const cf = evidenceOf({ url: "https://a.example/x", status: 403, title: "Just a moment...", html: "<html><head><title>Just a moment...</title></head><body><script src=\"/cdn-cgi/challenge-platform/h/b/orchestrate/chl_page/v1\"></script></body></html>", headers: { server: "cloudflare", "cf-ray": "8f-ICN", "cf-mitigated": "challenge" }, cookies: ["__cf_bm"] });
  const w = identify(cf, true);
  ok(w.by === "Cloudflare" && w.confidence === "높음", `Cloudflare 챌린지 → ${w.by}(${w.confidence})`);

  const ak = evidenceOf({ url: "https://b.example/x", status: 403, html: "<HTML><HEAD><TITLE>Access Denied</TITLE></HEAD><BODY><H1>Access Denied</H1>You don't have permission to access \"http&#58;&#47;&#47;b.example\" on this server.<P>Reference&#32;&#35;18&#46;5c0f1302&#46;1764040000&#46;1a2b3c<P>https&#58;&#47;&#47;errors&#46;edgesuite&#46;net&#47;18</BODY></HTML>", headers: { server: "AkamaiGHost" }, cookies: [] });
  const w2 = identify(ak, true);
  ok(w2.by === "Akamai" && w2.confidence === "높음", `Akamai 거부 화면 → ${w2.by}(${w2.confidence})`);

  const px = evidenceOf({ url: "https://c.example/x", status: 403, html: "<title>Access to this page has been denied</title><div id=\"px-captcha\"></div><script>window._pxAppId='PXabc';</script>", cookies: ["_pxhd", "_px3"] });
  ok(identify(px, true).by === "HUMAN(PerimeterX)", "PerimeterX 챌린지(px-captcha·_pxhd)");

  const dd = evidenceOf({ url: "https://d.example/x", status: 403, html: "<html><script>var dd={'rt':'c','cid':'AHrl','hsh':'1','host':'geo.captcha-delivery.com'}</script><script src=\"https://ct.captcha-delivery.com/c.js\"></script></html>", headers: { "x-datadome": "protected" }, cookies: ["datadome"] });
  ok(identify(dd, true).by === "DataDome", "DataDome 챌린지(captcha-delivery)");

  const im = evidenceOf({ url: "https://e.example/x", status: 200, html: "<html><head><META NAME=\"robots\" CONTENT=\"noindex,nofollow\"><script src=\"/_Incapsula_Resource?SWJIYLWA=5074a744e2e3d891814e9a2dace20bd4\"></script></head><body></body></html>", headers: { "x-iinfo": "9-1234" }, cookies: ["visid_incap_123", "incap_ses_456_123"] });
  ok(identify(im, true).by === "Imperva", "Imperva(_Incapsula_Resource·incap 쿠키)");

  // 쿠키만 있고 차단 문구 없음 → 중간
  const mid = evidenceOf({ url: "https://f.example/x", status: 403, html: "<html><body>Forbidden-ish</body></html>", cookies: ["_abck", "bm_sz"] });
  const w3 = identify(mid, true);
  ok(w3.by === "Akamai" && w3.confidence === "중간", `쿠키만(_abck) → ${w3.by}(${w3.confidence})`);

  // 흔적 전혀 없음 → 알 수 없음(평판으로 짐작하지 않는다)
  const none = evidenceOf({ url: "https://g.example/x", status: 403, html: "<html><body>no</body></html>" });
  ok(identify(none, true).by === "알 수 없음", "흔적 없는 403 → 알 수 없음");

  ok(JSON.stringify(cookieNamesFromSetCookie("a=1; Path=/; Expires=Wed, 21 Oct 2026 07:28:00 GMT, _abck=XYZ; Secure, bm_sz=1")) === JSON.stringify(["a", "_abck", "bm_sz"]), "Set-Cookie 합친 줄에서 이름만(날짜의 쉼표에 안 속음)");
}

console.log("2. 원인 어휘");
{
  ok(redirectKind("https://www.monsoonlondon.com/us/womens/tops/", "https://www.monsoonlondon.com/kr/womens/tops/") === "locale us→kr", "지역 이동 us→kr");
  ok(redirectKind("https://x.com/women/tops/", "https://x.com/") === "home", "첫 화면으로 튕김");
  const geoEv = evidenceOf({ url: "https://w.example/uk/p/1", finalUrl: "https://w.example/uk/p/1", status: 200, html: "<p>We're sorry. The White Company is not currently able to ship orders to the United States of America</p>" });
  ok(causeOf({ v: "open", ev: geoEv }, "product") === "geo", "배송 불가 화면 → geo");
  const deadEv = evidenceOf({ url: "https://x.com/women/tops/", finalUrl: "https://x.com/", status: 200, html: "<p>home</p>", kind: "listing" });
  ok(causeOf({ v: "open", ev: deadEv, cards: 0 }, "listing") === "dead", "목록 주소가 첫 화면으로 → dead");
  const shellEv = evidenceOf({ url: "https://s.com/c/tops", status: 200, html: "<div id=\"__next\"></div><script>big()</script>", kind: "listing" });
  ok(causeOf({ v: "open", ev: shellEv, cards: 0 }, "listing") === "shell", "HTML 에 상품 없음 → shell");
  const many = Array.from({ length: 20 }, (_, i) => `<a href="/foo-${i}"><img src="/i${i}.jpg"></a>`).join("");
  const selEv = evidenceOf({ url: "https://t.com/c/tops", status: 200, html: `<main>${many}${"x".repeat(3000)}</main>`, kind: "listing" });
  ok(causeOf({ v: "open", ev: selEv, cards: 0, collector: 0 }, "listing") === "selector", "이미지 링크 20개인데 수집기 0 → selector");
  ok(causeOf({ v: "blocked", ev: { status: 429, markers: [] } }, "listing") === "rate-limit", "429 → rate-limit");
  ok(causeOf({ v: "err", note: "page.goto: net::ERR_HTTP2_PROTOCOL_ERROR" }, "product") === "conn-drop", "HTTP2 끊김 → conn-drop");
  const c = countProductLinks('<a href="/p/123456"><img src=a></a><a href="https://other.com/p/9999999">x</a><a href="/collections/tops">c</a>', "https://shop.com/c/x");
  ok(c.productLinks === 1 && c.imgLinks === 1, `상품 링크 세기(같은 사이트만) ${JSON.stringify(c)}`);
}

console.log("3. 외부 API 설정");
{
  ok(loadExtConfigs("").configs.length === 0, "비밀 없음 → 칸 없음");
  const bad = loadExtConfigs("{not json sk_live_LEAK");
  ok(bad.configs.length === 0 && bad.problems.length === 1 && !bad.problems[0].includes("sk_live_LEAK"), "깨진 JSON → 칸 없음, 문제 문구에 값 없음");
  ok(loadExtConfigs(JSON.stringify({ name: "a", request: "http://api.example/x?u={url}", key: "k" })).configs.length === 0, "https 가 아니면 거부");
  ok(loadExtConfigs(JSON.stringify({ name: "a", request: "https://api.example/x", key: "k" })).configs.length === 0, "{url} 자리표시 없으면 거부");
  const cfg = loadExtConfigs(JSON.stringify({ name: "t", request: "https://api.example.net/v1?api_key={key}&target={url}", params: { render: "1" }, headers: { Authorization: "Bearer {key}" }, key: "sk_abc_123" })).configs[0];
  const req = buildExtRequest(cfg, "https://shop.example/p/1?a=b");
  ok(req.url.includes("api_key=sk_abc_123") && req.url.includes("target=https%3A%2F%2Fshop.example%2Fp%2F1%3Fa%3Db") && req.url.includes("render=1"), "요청 주소에 키·대상(인코딩)·추가 쿼리");
  ok(req.init.headers.Authorization === "Bearer sk_abc_123", "헤더에 키");
  const sec = secretsOf(cfg);
  ok(sec.includes("sk_abc_123") && sec.includes("Bearer sk_abc_123") && sec.includes("api.example.net"), "가릴 값: 키·키 든 헤더·API 호스트");
  ok(redact("err at https://api.example.net/v1?api_key=sk_abc_123", sec) === "err at https://***/v1?api_key=***", "가리기");
  const x = readExtResponse({ html: "json:data.html", upstreamStatus: "json:data.status", success: {} }, 200, JSON.stringify({ data: { html: "<p>hi</p>", status: 403 } }), () => "");
  ok(x.ok && x.upstream === 403 && x.html === "<p>hi</p>", "JSON 응답에서 HTML·사이트 상태 꺼내기");
}

console.log("4. try-engines 의 ext 엔진(가짜 API)");
{
  const SECRET = "sk_test_9f8e7d6c5b4a";
  const seen = [];
  const PRODUCT = "<html><head><title>Ribbed Tee</title></head><body><h1>Ribbed Tee</h1><h3>Composition</h3><p>95% cotton, 5% elastane</p></body></html>";
  const CHALLENGE = "<html><head><title>Just a moment...</title></head><body><script src=\"/cdn-cgi/challenge-platform/h/b/x\"></script></body></html>";
  const LISTING = "<html><body>" + Array.from({ length: 12 }, (_, i) => `<a href="https://shop.example.test/p/10000${i}"><img src="/i.jpg"></a>`).join("") + "</body></html>";
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://127.0.0.1");
    seen.push({ key: req.headers["x-api-key"], target: u.searchParams.get("target") });
    if (req.headers["x-api-key"] !== SECRET) { res.writeHead(401); return res.end("bad key"); }
    const t = u.searchParams.get("target") || "";
    const page = /blocked/.test(t) ? { html: CHALLENGE, status: 403 } : /listing/.test(t) ? { html: LISTING, status: 200 } : { html: PRODUCT, status: 200 };
    res.writeHead(200, { "Content-Type": "application/json", "X-Account": SECRET });
    res.end(JSON.stringify({ data: page }));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const dir = mkdtempSync(join(tmpdir(), "ext-test-"));
  const targetsFile = join(dir, "t.json");
  writeFileSync(targetsFile, JSON.stringify([
    { kind: "product", brand: "Fake", url: "https://shop.example.test/p/1234567" },
    { kind: "product", brand: "Fake", url: "https://shop.example.test/p/blocked-7654321" },
    { kind: "listing", brand: "Fake", url: "https://shop.example.test/c/listing-tops", cat: "tops" },
  ]));
  const config = { name: "trial-a", request: `http://127.0.0.1:${port}/scrape?target={url}`, headers: { "X-Api-Key": "{key}" }, key: SECRET, html: "json:data.html", upstreamStatus: "json:data.status", gapMs: 0 };
  const run = (env) => new Promise((done) => {
    const p = spawn(process.execPath, [join(ROOT, "scripts/try-engines.mjs")], { env: { PATH: process.env.PATH, GITHUB_ACTIONS: "false", HOST_GAP_MS: "0", ...env } });
    let out = "";
    p.stdout.on("data", (d) => { out += d; });
    p.stderr.on("data", (d) => { out += d; });
    p.on("close", (code) => done({ code, out }));
  });
  const OUT = join(dir, "report.md"), RES = join(dir, "res.json");
  const r1 = await run({ TARGETS: targetsFile, ENGINES: "ext", SCRAPE_API_CONFIG: JSON.stringify(config), OUT, RESULTS_JSON: RES });
  ok(r1.code === 0, "실행 성공");
  const rep = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  const res = existsSync(RES) ? JSON.parse(readFileSync(RES, "utf8")) : { results: {} };
  const col = res.results["ext:trial-a"] || {};
  ok(rep.includes("ext:trial-a"), "리포트에 ext:trial-a 열");
  ok((col["https://shop.example.test/p/1234567"] || {}).v === "comp", `상품 → 혼용률 읽음 (${(col["https://shop.example.test/p/1234567"] || {}).note})`);
  const b = col["https://shop.example.test/p/blocked-7654321"] || {};
  ok(b.v === "blocked" && b.who && b.who.by === "Cloudflare", `사이트 403 챌린지 → 차단 · 주체 ${b.who && b.who.by}`);
  const l = col["https://shop.example.test/c/listing-tops"] || {};
  ok(l.v === "list" && l.cards === 12, `목록 → 상품 링크 ${l.cards}`);
  ok(seen.length === 3 && seen.every((s) => s.key === SECRET), "가짜 API 가 키를 헤더로 받음(3회)");
  const all = rep + JSON.stringify(res) + r1.out.split("\n").filter((x) => !x.startsWith("::add-mask::")).join("\n");
  ok(!all.includes(SECRET), "키가 리포트·결과 JSON·로그 어디에도 없음");
  ok(!all.includes(`127.0.0.1:${port}`) && !all.includes("/scrape?"), "API 주소가 리포트·결과·로그에 없음");

  // 비밀이 없으면 칸이 조용히 빠진다
  const OUT2 = join(dir, "report2.md");
  const r2 = await run({ TARGETS: targetsFile, ENGINES: "ext", OUT: OUT2 });
  const rep2 = existsSync(OUT2) ? readFileSync(OUT2, "utf8") : "";
  ok(r2.code === 0 && !rep2.includes("ext:") && !/외부 API 설정 문제/.test(r2.out), "비밀 없음 → 열 없음 · 경고 없음");
  // 깨진 설정 → 칸 없음 · 값 출력 없음
  const r3 = await run({ TARGETS: targetsFile, ENGINES: "ext", SCRAPE_API_CONFIG: `{"name":"x","key":"${SECRET}"`, OUT: join(dir, "r3.md") });
  ok(r3.code === 0 && /외부 API 설정 문제/.test(r3.out) && !r3.out.includes(SECRET), "깨진 설정 → 칸 없음 · 문제만 알림(값 없음)");
  server.close();
}

if (fails) { console.log(`\n실패 ${fails}개`); process.exit(1); }
console.log("\n모두 통과");
void spawnSync;
