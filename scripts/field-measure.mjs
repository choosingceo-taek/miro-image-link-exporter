#!/usr/bin/env node
// 현장 지도(field map) 측정 — 브랜드마다 상품 페이지 몇 개를 열어, 항목별로 "읽히나 · 어디서"를 잰다. 읽기만 한다.
//
// 왜: 혼용률·컬러 말고도 상품명·사진 전부·가격·정가·통화·컬러 전부·사이즈(재고)·설명·디테일 글머리표·상품 코드를
// 모아야 한다(Market Pulse 1단계). 어느 브랜드에서 어느 출처(Shopify JSON · JSON-LD · 페이지 JSON · 제목 붙은 본문 칸)로
// 읽히는지, 사이트가 아예 안 적는지, 막혀서 모르는지를 브랜드마다 실측해 docs/field-map.md 의 근거로 쓴다.
//
// 하는 일(브랜드마다):
//   1) Worker 카탈로그에서 상품 주소 PER 개(기본 3 — 앞·가운데·끝)를 고른다(GET 만).
//   2) 오버레이(comp:<site>)의 시도 기록을 센다 — 야간 보강이 이 브랜드에 왜 손을 못 댔는지(5일 창·차단 표시)의 근거.
//   3) 상품마다 impit(브라우저 없이 크롬 TLS 지문) → 안 읽히면 파이어폭스. 브랜드 첫 상품은 읽혀도 파이어폭스로 한 번 더 연다
//      (클릭해야 그려지는 아코디언 칸이 있는지 보려고 — 파이어폭스는 Details·Description 같은 칸을 눌러 펼친다).
//   4) 출처별 흔적(probe)과 추출기 결과(detailOf)를 함께 남긴다. '읽힘'은 이 상품 페이지가 맞을 때만(productRead):
//      카탈로그 상품명의 낱말 60% 이상이 화면 글에 있어야 한다. 차단 화면·껍데기는 '막힘'이지 '사이트가 안 적음'이 아니다.
//   5) 브랜드마다 읽힌 표본 1개의 HTML 을 줄여(gzip) scripts/fixtures/pages/ 에 남긴다 — 사람이 값을 읽어 기대값을 적는 시험 자료.
//
// 저장하지 않는다: Worker 에는 GET 만 보낸다(fetch 를 감싸 GET/HEAD 가 아니면 보내기 전에 막는다 — 로그 첫 줄 "STORE: 0").
//
// env: WORKER_URL, WORKER_TOKEN, BRANDS(쉼표·'all'), PART("1/3" — 브랜드를 나눠 여러 러너에서), PER(기본 3),
//      FIREFOX(기본 1 — 0 이면 impit 만), RUN_ID, OUT_JSON, OUT_MD, FIX_DIR(기본 scripts/fixtures/pages), TIME_MIN(기본 95)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { detailOf, compOf, colorFromHtml, fromJsonLd, validComp, validColor, dtHeadKind, dtText } from "./detail-core.mjs";
import { looksLikeProduct } from "./access-evidence.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const tq = "&token=" + encodeURIComponent(TOKEN);
const PER = Math.max(1, Number(process.env.PER) || 3);
// (PER 는 RECHECK 때 브랜드 상품 전부를 보려고 크게 줄 수 있다 — 예: 400)
const FIREFOX = process.env.FIREFOX !== "0" && process.env.RECHECK !== "1";
const RUN_ID = process.env.RUN_ID || process.env.GITHUB_RUN_ID || "local";
const OUT_JSON = process.env.OUT_JSON || `field-measure-${RUN_ID}.json`;
const OUT_MD = process.env.OUT_MD || `field-measure-${RUN_ID}.md`;
// URLS(쉼표로 나눈 상품 주소): 브랜드마다 고르지 않고 이 주소들만 연다 — 읽힌 페이지는 전부 시험 자료로 남긴다(scripts/fixtures/witness).
//   혼용률 '두 번째 증인'에서 어긋난 표본을 사람이 HTML 로 판정하려고 쓴다.
// RECHECK=1: 브랜드(BRANDS)의 상품을 PER 개까지 impit 으로만 다시 읽어, 저장된 혼용률(오버레이)과 지금 규칙의 값을 견준다.
//   시험 자료는 남기지 않는다. 운영에 틀린 값이 몇 개 저장돼 있는지 어림하는 데 쓴다(쓰기 없음).
const URLS = String(process.env.URLS || "").split(",").map((x) => x.trim()).filter((x) => /^https?:\/\//.test(x));
const RECHECK = process.env.RECHECK === "1";
const FIX_DIR = join(ROOT, process.env.FIX_DIR || (URLS.length ? "scripts/fixtures/witness" : "scripts/fixtures/pages"));
const DEADLINE = Date.now() + Math.max(5, Number(process.env.TIME_MIN) || 95) * 60_000;
const NAV_MS = 45_000;

// ── 읽기만: GET/HEAD 가 아닌 요청은 보내기 전에 막는다 ──────────────────
{
  const realFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") return Promise.reject(new Error(`읽기 전용 — ${method} 막음`));
    return realFetch(input, init);
  };
}
console.log("STORE: 0 — 현장 지도 측정은 읽기만 한다(Worker 에 GET 만).");

// enrich-comp.mjs 의 '정말 이 상품을 읽었나' 규칙을 그대로 떼어 쓴다(복사본을 만들지 않는다).
const ecSrc = readFileSync(join(ROOT, "scripts/enrich-comp.mjs"), "utf8");
const ecSlice = (a, b) => { const i = ecSrc.indexOf(a), j = ecSrc.indexOf(b, i); return ecSrc.slice(i, j); };
const { realPage, productRead } = new Function(
  ecSlice("const CHALLENGE_RX", "// ── 이 상품 페이지를 정말 읽었나(none 판정) 시작") +
  ecSlice("// ── 이 상품 페이지를 정말 읽었나(none 판정) 시작", "// ── 이 상품 페이지를 정말 읽었나(none 판정) 끝") +
  "\n return { realPage, productRead };")();

const list = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lastHit = new Map();
async function polite(url) {
  let h = ""; try { h = new URL(url).hostname; } catch (e) { return; }
  const w = (lastHit.get(h) || 0) + 1500 - Date.now();
  if (w > 0) await sleep(w);
  lastHit.set(h, Date.now());
}

// ── 출처별 흔적(추출기와 따로 — 추출기를 추출기로 검증하지 않기 위해 날것을 센다) ─────────
function probe(html) {
  const h = String(html || "");
  const ld = { product: 0, group: 0, fields: [] };
  const fields = new Set();
  for (const m of h.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const t = m[1];
    if (/"@type"\s*:\s*\[?\s*"Product"/.test(t)) ld.product++;
    if (/"@type"\s*:\s*"ProductGroup"/.test(t)) ld.group++;
    for (const k of ["name", "image", "description", "sku", "mpn", "productGroupID", "color", "size", "material", "hasVariant", "priceCurrency", "price", "lowPrice", "availability", "priceSpecification"]) {
      if (new RegExp(`"${k}"\\s*:`).test(t)) fields.add(k);
    }
  }
  ld.fields = [...fields];
  const meta = [];
  for (const k of ["og:price:amount", "product:price:amount", "og:price:currency", "product:price:currency", "og:image", "og:description", "product:color", "product:original_price:amount"]) {
    if (new RegExp(`(?:property|name)=["']${k}["']`, "i").test(h)) meta.push(k);
  }
  const state = [];
  if (/id=["']__NEXT_DATA__["']/.test(h)) state.push("__NEXT_DATA__");
  if (/window\.__NUXT__|__NUXT_DATA__/.test(h)) state.push("__NUXT__");
  if (/__INITIAL_STATE__/.test(h)) state.push("__INITIAL_STATE__");
  if (/__PRELOADED_STATE__/.test(h)) state.push("__PRELOADED_STATE__");
  if (/__APOLLO_STATE__/.test(h)) state.push("__APOLLO_STATE__");
  if (/"parts"\s*:\s*\[\s*\{[^\]]{0,200}"components"/.test(h.replace(/\\"/g, '"'))) state.push("parts/components");
  const platform = /cdn\.shopify\.com|Shopify\.theme|shopify-section/i.test(h) ? "shopify"
    : /demandware|dwvar_|\/on\/demandware\.store|sfcc|dw\.ac/i.test(h) ? "salesforce"
    : /__NEXT_DATA__/.test(h) ? "next.js" : /magento|mage-init/i.test(h) ? "magento" : "";
  // 본문 칸 제목(Details·Description·Fit·Fabric & Care …) — 추출기 규칙(dtHeadKind)이 아닌 날 낱말로 센다.
  const heads = new Set();
  const vis = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  for (const m of vis.matchAll(/>\s*((?:product\s+)?(?:details?|description|features?|fit(?:\s*(?:&amp;|&|and)\s*(?:size|sizing))?|size\s*(?:&amp;|&|and)\s*fit|fabric\s*(?:&amp;|&|and)\s*care|materials?\s*(?:&amp;|&|and)\s*care|care|composition|specifications|highlights|overview))\s*</gi)) {
    heads.add(m[1].toLowerCase().replace(/&amp;/g, "&").replace(/\s+/g, " "));
    if (heads.size >= 12) break;
  }
  const domDesc = /class=["'][^"']*(?:product[-_]?description|pdp[-_]?description|description__|product__description)[^"']*["']/i.test(vis);
  const swatches = (vis.match(/class=["'][^"']*swatch[^"']*["']/gi) || []).length;
  const sizeBtns = (vis.match(/(?:class|data-[a-z-]*|name)=["'][^"']*\bsize[^"']*["']/gi) || []).length;
  const priceEls = (vis.match(/class=["'][^"']*\bprice\b[^"']*["']/gi) || []).length;
  const strike = /<(?:s|del|strike)\b|class=["'][^"']*(?:compare|was[-_]?price|strike|original[-_]?price|list[-_]?price)[^"']*["']/i.test(vis);
  const galleryImgs = (vis.match(/<img\b[^>]*(?:class|alt)=["'][^"']*(?:gallery|product[-_]?(?:image|media|photo)|pdp[-_]?(?:image|media))[^"']*["']/gi) || []).length;
  return { ld, meta, state, platform, heads: [...heads], domDesc, swatches, sizeBtns, priceEls, strike, galleryImgs, len: h.length };
}

// 시험 자료로 남길 HTML 을 줄인다 — 스타일·그림·외부 스크립트를 빼고, JSON 스크립트와 상품 정보가 든 스크립트만 둔다.
function trimForFixture(html) {
  let h = String(html || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "<svg></svg>")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/\s(?:style|srcset|sizes|data-srcset)=("[^"]*"|'[^']*')/gi, "");
  h = h.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (all, attrs, body) => {
    if (/application\/(?:ld\+)?json|__NEXT_DATA__/i.test(attrs)) return all;
    if (/"parts"\s*:|percentage|composition|__INITIAL_STATE__|__PRELOADED_STATE__|productData|"variants"|ShopifyAnalytics\.meta|var meta =/i.test(body) && body.length < 1_500_000) return all;
    return /\bsrc=/.test(attrs) ? "" : "<script></script>";
  });
  return h.replace(/\n\s*\n+/g, "\n");
}

// ── 엔진 ────────────────────────────────────────────────────────────
let impit = null;
async function impitGet(url, accept) {
  if (!impit) { const { Impit } = await import("impit"); impit = new Impit({ browser: "chrome", followRedirects: true, timeout: NAV_MS }); }
  await polite(url);
  const r = await impit.fetch(url, { headers: { "Accept-Language": "en-US,en;q=0.9", ...(accept ? { Accept: accept } : {}) } });
  return { status: r.status, body: await r.text(), finalUrl: r.url || url };
}
let ff = null;
// 페이지 하나에 90초 상한 — 11/25 측정에서 파이어폭스 한 페이지가 16분 멈춰(page.content 가 안 돌아옴) 1/3 몫이 시간 초과로 끝났다.
async function firefoxGet(url) {
  let timer;
  try {
    return await Promise.race([firefoxGet1(url), new Promise((_, no) => { timer = setTimeout(() => no(new Error("90초 넘게 응답 없음")), 90_000); })]);
  } catch (e) {
    if (/90초/.test(String(e.message))) { try { await ff.close(); } catch (e2) {} ff = null; }   // 멈춘 브라우저는 새로 띄운다
    throw e;
  } finally { clearTimeout(timer); }
}
async function firefoxGet1(url) {
  if (!ff) { const { firefox } = await import("playwright"); ff = await firefox.launch(); }
  await polite(url);
  const ctx = await ff.newContext({ locale: "en-US" });
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_MS });
    await page.waitForTimeout(2500);
    // 접힌 칸(Details·Description·Fit·Fabric & Care …)을 눌러 펼친다 — 클릭해야 글이 그려지는 사이트가 있다.
    const clicked = await page.evaluate(() => {
      for (const d of document.querySelectorAll("details")) d.open = true;
      const rx = /^(?:product\s+)?(?:details?|description|features?|fit|size\s*(?:&|and)\s*fit|fit\s*(?:&|and)\s*sizing|fabric\s*(?:&|and)\s*care|materials?|composition|care|specifications|overview|highlights)\b/i;
      let n = 0;
      for (const b of document.querySelectorAll('button,[role="button"],[role="tab"],summary,[aria-expanded="false"]')) {
        if (b.closest("nav,header,footer")) continue;
        const t = ((b.textContent || "") + " " + (b.getAttribute("aria-label") || "")).trim();
        if (t.length < 60 && rx.test(t)) { try { b.click(); n++; } catch (e) {} }
        if (n >= 12) break;
      }
      return n;
    }).catch(() => 0);
    await page.waitForTimeout(clicked ? 2000 : 500);
    const html = await page.content();
    return { status: resp ? resp.status() : 0, body: html, finalUrl: page.url(), clicked };
  } finally { await ctx.close().catch(() => {}); }
}

// Shopify 공개 JSON(.js — 재고 available·이미지 전부가 든 쪽). 상품 주소가 /products/<handle> 일 때만.
async function shopifyJs(url) {
  const m = url.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
  if (!m) return null;
  try {
    const r = await impitGet(`${m[1]}/products/${m[2]}.js`, "application/json");
    if (r.status >= 400 || !/^\s*\{/.test(r.body)) return { ok: false, status: r.status };
    return { ok: true, json: JSON.parse(r.body) };
  } catch (e) { return { ok: false, status: 0, err: String(e.message || e).slice(0, 80) }; }
}

function judgeRead(res, name) {
  if (!res) return "err";
  if (res.err) return "err";
  if (res.status >= 400) return "blocked";
  if (!realPage(res.body)) return "blocked";
  if (!productRead(res.body, name)) return "shell";
  return "read";
}
const FIELD_KEYS = ["name", "imgs", "price", "priceOrig", "cur", "color", "colors", "sizes", "sizesIn", "comp", "desc", "feat", "sku"];

// ── 대상 ────────────────────────────────────────────────────────────
const cats = (((await (await fetch(`${WORKER}/?catalogs=1${tq}`, { signal: AbortSignal.timeout(60000) })).json()) || {}).list || [])
  .sort((a, z) => (a.site < z.site ? -1 : 1));
// 같은 호스트에 옛 키(<host>)와 새 키(<host>.<slug>)가 함께 있으면 새 키만(enrich-comp.mjs 와 같은 규칙).
const hostKey = (s) => String(s || "").split(".").slice(0, 2).join(".");
const newer = new Set(cats.filter((c) => c.site !== hostKey(c.site)).map((c) => hostKey(c.site)));
let brands = cats.filter((c) => !(c.site === hostKey(c.site) && newer.has(c.site)));
const want = list(process.env.BRANDS).map(norm).filter((x) => x && x !== "all");
if (want.length) brands = brands.filter((c) => want.includes(norm(c.brand)) || String(c.site).split(".").map(norm).some((p) => want.includes(p)));
const [pi, pn] = String(process.env.PART || "1/1").split("/").map(Number);
if (pn > 1) brands = brands.filter((_, i) => i % pn === (pi - 1));
console.log(`브랜드 ${brands.length}개 · 브랜드당 ${PER}개 · 파이어폭스 ${FIREFOX ? "켬" : "끔"} · PART ${pi}/${pn}`);

mkdirSync(FIX_DIR, { recursive: true });
const out = { runId: RUN_ID, at: new Date().toISOString(), ip: "", part: `${pi}/${pn}`, brands: [] };
try { out.ip = (await (await fetch("https://checkip.amazonaws.com", { signal: AbortSignal.timeout(10000) })).text()).trim().replace(/\.\d+$/, ".x"); } catch (e) {}
const save = () => writeFileSync(join(ROOT, OUT_JSON), JSON.stringify(out, null, 1));

for (const c of brands) {
  if (Date.now() > DEADLINE) { out.brands.push({ brand: c.brand, site: c.site, skipped: "시간 초과로 못 봄" }); continue; }
  const B = { brand: c.brand || c.site, site: c.site, products: [], overlay: null };
  out.brands.push(B);
  let items = [];
  try { items = ((await (await fetch(`${WORKER}/?catalog=${encodeURIComponent(c.site)}${tq}`, { signal: AbortSignal.timeout(30000) })).json()).items || []); }
  catch (e) { B.error = "카탈로그 못 읽음"; save(); continue; }
  B.total = items.length;
  // 오버레이의 시도 기록 — 야간 보강이 언제 무엇을 적었나.
  let ov = {};
  try {
    ov = await (await fetch(`${WORKER}/?comps=${encodeURIComponent(c.site)}${tq}`, { signal: AbortSignal.timeout(30000) })).json();
    const now = Date.now(), DAY = 86400000;
    const s = { items: items.length, withRow: 0, comp: 0, color: 0, sizes: 0, price: 0, tried: 0, in5d: 0, blocked: 0, blockedIn5d: 0, none: 0, noneNv: {}, oldestT: 0, newestT: 0, emptyIn5d: 0 };
    for (const p of items) {
      const o = ov[p.productUrl];
      if (!o) continue;
      s.withRow++;
      if (validComp(String(o.comp || ""))) s.comp++;
      if (validColor(String(o.color || ""))) s.color++;
      if (o.sizes) s.sizes++;
      if (o.price) s.price++;
      if (o.t) {
        s.tried++;
        const in5 = now - o.t < 5 * DAY;
        if (in5) s.in5d++;
        if (in5 && !validComp(String(o.comp || ""))) s.emptyIn5d++;
        s.oldestT = s.oldestT ? Math.min(s.oldestT, o.t) : o.t;
        s.newestT = Math.max(s.newestT, o.t);
        if (o.blocked && in5) s.blockedIn5d++;
      }
      if (o.blocked) s.blocked++;
      if (o.none) { s.none++; const k = o.nv || "(예전)"; s.noneNv[k] = (s.noneNv[k] || 0) + 1; }
    }
    B.overlay = s;
  } catch (e) { B.overlay = { error: "오버레이 못 읽음" }; }

  // 주소 모양으로 상품을 고른다(카테고리·기획전 주소 빼기). J.Crew 처럼 상품 주소가 /categories/…/MQ341 이라
  // 주소 규칙에 하나도 안 걸리는 브랜드는 이름이 있는 항목에서 고른다(그 사실을 B.byName 으로 남긴다).
  let cand = items.filter((p) => p && p.productUrl && looksLikeProduct(p.productUrl) && String(p.name || "").trim());
  if (!cand.length) { cand = items.filter((p) => p && p.productUrl && String(p.name || "").trim()); B.byName = true; }
  if (URLS.length) { const want = new Set(URLS); cand = items.filter((p) => p && want.has(p.productUrl)); if (!cand.length) { out.brands.pop(); continue; } }
  const idx = cand.length <= PER ? cand.map((_, i) => i) : [...new Set(Array.from({ length: PER }, (_, k) => Math.round((k * (cand.length - 1)) / (PER - 1 || 1))))];
  B.picked = idx.length;
  B.notProduct = items.length - items.filter((p) => p && looksLikeProduct(p.productUrl)).length;
  let fixtureSaved = false;
  for (let k = 0; k < idx.length; k++) {
    const p = cand[idx[k]];
    const P = { url: p.productUrl, name: p.name, engines: {}, stored: String(((ov || {})[p.productUrl] || {}).comp || "") };
    B.products.push(P);
    // Shopify JSON
    const sj = await shopifyJs(p.productUrl);
    if (sj) P.shopify = sj.ok ? { ok: true, keys: Object.keys(sj.json).slice(0, 40), images: (sj.json.images || []).length, variants: (sj.json.variants || []).length,
      options: (sj.json.options || []).map((o) => (typeof o === "string" ? o : o.name)), hasAvail: (sj.json.variants || []).some((v) => typeof v.available === "boolean"),
      descLen: dtText(sj.json.description || "").length } : { ok: false, status: sj.status, err: sj.err };
    // impit
    let best = null, bestEng = "";
    try {
      const r = await impitGet(p.productUrl);
      const v = judgeRead(r, p.name);
      P.engines.impit = { v, status: r.status, len: r.body.length, final: r.finalUrl !== p.productUrl ? r.finalUrl.slice(0, 200) : "" };
      if (v === "read") { best = r; bestEng = "impit"; }
      P._impit = r;
    } catch (e) { P.engines.impit = { v: "err", note: String(e.message || e).slice(0, 80) }; }
    // 파이어폭스 — impit 이 못 읽었거나, 브랜드 첫 상품(클릭해야 그려지는 칸 확인)
    if (FIREFOX && (!best || k === 0) && Date.now() < DEADLINE) {
      try {
        const r = await firefoxGet(p.productUrl);
        const v = judgeRead(r, p.name);
        P.engines.firefox = { v, status: r.status, len: r.body.length, clicked: r.clicked };
        if (v === "read") { best = r; bestEng = "firefox"; P._ff = r; }
      } catch (e) { P.engines.firefox = { v: "err", note: String(e.message || e).split("\n")[0].slice(0, 80) }; }
    }
    P.read = !!best || !!(sj && sj.ok);
    P.engine = bestEng || (sj && sj.ok ? "shopify-json" : "");
    const html = best ? best.body : "";
    const d = detailOf(html, p.productUrl, sj && sj.ok ? sj.json : null);
    const cp = html ? compOf(html, p.productUrl) : { comp: "", src: "" };
    let ldOld = {};
    try { ldOld = html ? fromJsonLd(html) || {} : {}; } catch (e) {}
    const color = d.color || ldOld.color || (html ? colorFromHtml(html) : "");
    P.got = {
      name: d.name || "", imgs: d.imgs || [], price: d.price || "", priceOrig: d.priceOrig || "", cur: d.cur || "",
      color: validColor(color) ? color : "", colors: d.colors || [], sizes: d.sizes || [], sizesIn: d.sizesIn || null,
      comp: validComp(cp.comp) ? cp.comp : "", desc: d.desc || "", feat: d.feat || [], sku: d.sku || "",
    };
    P.src = { ...d.src, comp: validComp(cp.comp) ? cp.src : "", color: validColor(color) ? (d.color ? d.src.color : "page") : "" };
    P.probe = html ? probe(html) : null;
    // impit 과 파이어폭스를 둘 다 읽었으면 — 클릭해야 그려지는 칸이 있었나(impit 에서는 없던 디테일이 파이어폭스에서 나옴)
    if (P._impit && P._ff && judgeRead(P._impit, p.name) === "read") {
      const di = detailOf(P._impit.body, p.productUrl, sj && sj.ok ? sj.json : null);
      P.clickOnly = { featImpit: (di.feat || []).length, featFirefox: (d.feat || []).length, descImpit: (di.desc || "").length, descFirefox: (d.desc || "").length };
    }
    // 시험 자료(브랜드당 1개)
    if (best && !RECHECK && (!fixtureSaved || URLS.length)) {
      const slug = (norm(B.brand).slice(0, 40) || norm(c.site)) + (URLS.length ? "-" + norm(p.productUrl.split(/[?#]/)[0].split("/").filter(Boolean).pop()).slice(0, 40) : "");
      const file = `${slug}.html.gz`;
      writeFileSync(join(FIX_DIR, file), gzipSync(trimForFixture(best.body), { level: 9 }));
      let shopFile = "";
      if (sj && sj.ok) { shopFile = `${slug}.shop.json.gz`; writeFileSync(join(FIX_DIR, shopFile), gzipSync(JSON.stringify(sj.json), { level: 9 })); }
      P.fixture = { file, shopFile, engine: bestEng };
      fixtureSaved = true;
    }
    delete P._impit; delete P._ff;
    console.log(`  ${B.brand} · ${P.engine || "못 읽음"} · ${FIELD_KEYS.filter((f) => { const v = P.got[f]; return Array.isArray(v) ? v.length : v; }).join(",")}`);
    save();
  }
  // 파일 이름이 겹치지 않게 사이트 키를 남긴다(브랜드 이름 → 파일)
  save();
}
if (ff) await ff.close().catch(() => {});

// ── 짧은 리포트 ───────────────────────────────────────────────────
const L = [`# 현장 지도 측정 ${RUN_ID} (PART ${out.part} · ${out.at.slice(0, 16)}Z · 러너 ${out.ip})`, "",
  "읽기만 한 실행이다(STORE: 0). 칸 = 상품 3개 중 그 항목이 읽힌 수 · 출처.", "",
  `| 브랜드 | 읽힘 | ${FIELD_KEYS.join(" | ")} |`, `|---|---|${FIELD_KEYS.map(() => "---").join("|")}|`];
for (const B of out.brands) {
  if (!B.products || !B.products.length) { L.push(`| ${B.brand} | ${B.skipped || B.error || "상품 없음"} |${FIELD_KEYS.map(() => "").join("|")}|`); continue; }
  const rd = B.products.filter((p) => p.read);
  const cell = (f) => {
    const n = rd.filter((p) => { const v = p.got[f]; return Array.isArray(v) ? v.length : v; }).length;
    const srcs = [...new Set(rd.map((p) => p.src && p.src[f]).filter(Boolean))].join("/");
    return n ? `${n}${srcs ? " " + srcs : ""}` : "0";
  };
  L.push(`| ${B.brand} | ${rd.length}/${B.products.length} ${[...new Set(rd.map((p) => p.engine))].join("/")} | ${FIELD_KEYS.map(cell).join(" | ")} |`);
}
writeFileSync(join(ROOT, OUT_MD), L.join("\n") + "\n");
console.log(`\n끝 — ${OUT_JSON} · ${OUT_MD}`);
process.exit(0);
