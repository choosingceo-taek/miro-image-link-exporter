#!/usr/bin/env node
// 공개 출처 측정 — 데이터센터에서 상품 페이지·목록을 못 읽는 브랜드에 대해, 사이트가 크롤러에게
// 공개하는 것(robots.txt · 거기 적힌 XML 사이트맵)과 공공 웹 아카이브(Wayback Machine · Common Crawl)를
// 읽어 본다. 읽기만 한다 — Worker 에도 사이트에도 GET 말고는 보내지 않는다(보내기 전에 막는다).
//
// 지키는 것(정중한 손님):
//   · robots.txt 의 일반 크롤러(User-agent: *) 규칙이 막은 경로는 가져오지 않고 '막힘(robots)'으로 적는다
//   · 한 주소에 한 실행 최대 3번 · 한 호스트에 요청 사이 최소 1초(archive.org 4초 · Common Crawl 색인 1.5초)
//   · 429(Common Crawl 색인은 503 도 — '천천히' 신호)를 받으면 그 호스트는 이 실행에서 더 묻지 않는다
//   · 차단·확인 화면이 오면 적고 넘어간다(우회하지 않는다). 아카이브는 이미 있는 보관본만 읽는다.
//   · User-Agent 는 이름 없는 일반 값. 403 이면 수집기가 늘 쓰던 브라우저 UA 로 한 번만 다시 묻는다.
//
// env:
//   TARGETS      대상 파일(기본 access-measure/targets-open-sources.json)
//   BRANDS       쉼표로 나눈 브랜드(비우면 파일 전부) · PART "i/n" — n 몫 중 i 번째 브랜드만
//   PER          브랜드당 아카이브 표본 상품 수(기본 10) · READ_PER 그중 보관본을 실제로 열어 볼 수(기본 4)
//   MAX_CHILD    브랜드당 열어 볼 하위 사이트맵 수(기본 6) · TIME_MIN 시간 예산(기본 100)
//   RUN_ID       리포트 이름(open-sources-<RUN_ID>.json/.md)
//   WORKER_URL / WORKER_TOKEN · WAYBACK_API / WAYBACK_WEB / CC_INDEX / CC_DATA (시험용 주소 바꾸기)
//   GAP_MS / ARCHIVE_GAP_MS / CC_GAP_MS (시험용 간격)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { gunzipSync, brotliDecompressSync, inflateSync } from "node:zlib";
import { compOf, validComp, WORKER_SRC } from "./detail-core.mjs";
import { archivePageCheck } from "./wayback-guard.mjs";
import { looksLikeProduct } from "./access-evidence.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── robots.txt ──────────────────────────────────────────────────────────────
// 그룹: 연달아 적힌 User-agent 줄들 + 그 아래 Allow/Disallow. Sitemap 줄은 그룹과 무관.
export function parseRobots(txt) {
  const groups = [], sitemaps = [];
  let cur = null, lastWasAgent = false;
  for (const raw of String(txt || "").split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === "sitemap") { if (val) sitemaps.push(val); continue; }
    if (key === "user-agent") {
      if (!cur || !lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!cur) continue;
    if (key === "allow" || key === "disallow") cur.rules.push({ allow: key === "allow", path: val });
  }
  return { groups, sitemaps: [...new Set(sitemaps)] };
}
// 한 크롤러 이름에 맞는 규칙들. 그 이름 그룹이 없으면 '*' 그룹(구글 방식: 가장 구체적인 그룹 하나).
export function rulesFor(robots, agent = "*") {
  const a = String(agent).toLowerCase();
  const named = robots.groups.filter((g) => a !== "*" && g.agents.some((x) => x !== "*" && a.includes(x)));
  const use = named.length ? named : robots.groups.filter((g) => g.agents.includes("*"));
  return use.flatMap((g) => g.rules);
}
const escRx = (x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
const ruleRx = (p) => { const end = p.endsWith("$"); const body = end ? p.slice(0, -1) : p; return new RegExp("^" + body.split("*").map(escRx).join(".*") + (end ? "$" : "")); };
// 경로(쿼리 포함)가 허용되나. 가장 길게 맞는 규칙이 이긴다 · 길이가 같으면 Allow · 빈 Disallow 는 무시.
export function isAllowed(rules, pathAndQuery) {
  let best = null;
  for (const r of rules) {
    if (!r.path) continue;
    let rx;
    try { rx = ruleRx(r.path); } catch (e) { continue; }
    if (!rx.test(pathAndQuery)) continue;
    const len = r.path.replace(/[*$]/g, "").length;
    if (!best || len > best.len || (len === best.len && r.allow && !best.allow)) best = { len, allow: r.allow, path: r.path };
  }
  return best ? { ok: best.allow, rule: (best.allow ? "Allow: " : "Disallow: ") + best.path } : { ok: true, rule: "" };
}
// 사이트 전체를 막았나(이 크롤러에게 '/' 가 막힘)
export const blocksAll = (robots, agent) => !isAllowed(rulesFor(robots, agent), "/").ok;

// ── 사이트맵 ────────────────────────────────────────────────────────────────
const decodeXml = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").trim();
export function parseSitemap(xml) {
  const s = String(xml || "");
  const kind = /<sitemapindex[\s>]/i.test(s) ? "index" : /<urlset[\s>]/i.test(s) ? "urlset" : "";
  const locs = [];
  let lastmod = 0;
  if (kind === "index") {
    for (const m of s.matchAll(/<sitemap[\s>][\s\S]*?<\/sitemap>/gi)) {
      const l = m[0].match(/<loc>([\s\S]*?)<\/loc>/i);
      if (l) locs.push(decodeXml(l[1]));
    }
  } else if (kind === "urlset") {
    for (const m of s.matchAll(/<url[\s>][\s\S]*?<\/url>/gi)) {
      const l = m[0].match(/<loc>([\s\S]*?)<\/loc>/i);
      if (l) locs.push(decodeXml(l[1]));
      if (/<lastmod>/i.test(m[0])) lastmod++;
    }
  }
  return { kind, locs, lastmod };
}
// 저장된 상품 주소의 첫 경로 조각에서 지역 표시를 뽑는다(en_us · en-gb · us · gb · intl …).
export function localeTokens(urls) {
  const count = new Map();
  for (const u of urls) {
    let seg = "";
    try { seg = new URL(u).pathname.split("/")[1] || ""; } catch (e) { continue; }
    if (!/^(?:[a-z]{2}(?:[-_][a-z]{2})?|intl)$/i.test(seg)) continue;
    count.set(seg.toLowerCase(), (count.get(seg.toLowerCase()) || 0) + 1);
  }
  const top = [...count.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!top) return [];
  const t = top[0];
  const parts = t.split(/[-_]/);
  return [...new Set([t, t.replace("_", "-"), t.replace("-", "_"), ...(parts.length === 2 ? [parts[1], parts[1] + "-" + parts[0], parts[0] + "_" + parts[1]] : [])])];
}
const NOT_PRODUCT_MAP = /categor|cms|content|blog|stor(?:e|y|ies)|page|image|video|editorial|lookbook|look|collection|static|landing|journal|help|brand|article|inspiration|static|search|plp|navigation|faq|news|campaign/i;
const PRODUCT_MAP = /product|pdp|prod|item|style|sku|catalog|detail|p_|-p\b/i;
// 하위 사이트맵 고르기: 상품 이름이 들어간 것 · 같은 지역 · 상품 아닌 것(카테고리·글·사진)은 뒤로.
export function pickChildren(children, locale = [], max = 6) {
  const scored = children.map((u, i) => {
    let tail = u;
    try { const x = new URL(u); tail = x.pathname + x.search; } catch (e) {}
    let s = 0;
    if (PRODUCT_MAP.test(tail)) s += 3;
    if (NOT_PRODUCT_MAP.test(tail)) s -= 5;
    const low = tail.toLowerCase();
    if (locale.length) {
      if (locale.some((t) => new RegExp(`(^|[^a-z])${t}([^a-z]|$)`).test(low))) s += 2;
      else if (/(^|[^a-z])[a-z]{2}[-_][a-z]{2}([^a-z]|$)/.test(low)) s -= 2;
    }
    return { u, s, i };
  });
  return scored.sort((a, b) => b.s - a.s || a.i - b.i).slice(0, max).map((x) => x.u);
}
// 주소 비교용(쿼리·끝 / · 대소문자·www 제외)
export function normUrl(u) {
  try { const x = new URL(u); return (x.host.replace(/^www\d?\./, "") + x.pathname).replace(/\/+$/, "").toLowerCase(); }
  catch (e) { return String(u || "").split("?")[0].replace(/\/+$/, "").toLowerCase(); }
}
// 주소 낱말로 짐작한 카테고리(추정 — 사이트맵에는 카테고리가 없다). 담당자 카테고리 5개만.
export function guessCategory(url) {
  let p = "";
  try { p = decodeURIComponent(new URL(url).pathname).toLowerCase(); } catch (e) { p = String(url).toLowerCase(); }
  if (/(^|\/)(men|mens|man|boys?|girls?|kids?|baby|home|beauty)(\/|$)/.test(p)) return "";
  const w = p.replace(/[^a-z0-9]+/g, " ");
  if (/\b(dress|dresses|jumpsuit|jumpsuits|romper|playsuit)\b/.test(w)) return "dresses";
  if (/\b(sweatshirt|sweatshirts|hoodie|hoodies|hoody|crewneck)\b/.test(w)) return "sweatshirts";
  if (/\b(pant|pants|trouser|trousers|jean|jeans|legging|leggings|jogger|joggers|chino|chinos)\b/.test(w)) return "pants";
  if (/\b(t shirt|tshirt|tee|tees|tank|top|tops|cami|camisole|bodysuit|polo|sweater|jumper|cardigan|knit)\b/.test(w)) return "tops";
  if (/\b(shirt|shirts|blouse|blouses|overshirt)\b/.test(w)) return "shirts";
  return "";
}

// 받은 글이 차단·확인 화면인가(제목·앞부분만 본다)
const CHALLENGE_RX = /access denied|pardon our interruption|are you a human|attention required|verify you are human|unusual traffic|press (and|&) hold|just a moment|enable javascript and cookies|request unsuccessful|incapsula incident|security checkpoint|client challenge|captcha-delivery|px-captcha|_incapsula_resource|cf-chl|challenge-platform/i;
export function challengeOf(status, text) {
  const s = String(text || "").slice(0, 6000);
  const title = (s.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1].trim().slice(0, 60);
  if (CHALLENGE_RX.test(s)) return title || "차단·확인 화면";
  if (status === 403 || status === 429 || status === 418) return `HTTP ${status}`;
  return "";
}

// ── 요청: 호스트별 간격 · 주소별 3번 · 429 에 멈춤 ─────────────────────────────
const GAP_MS = Number(process.env.GAP_MS ?? 1000);
const ARCHIVE_GAP_MS = Number(process.env.ARCHIVE_GAP_MS ?? 4000);
const CC_GAP_MS = Number(process.env.CC_GAP_MS ?? 1500);
const UA = "Mozilla/5.0 (compatible; catalog-sitemap-check/1.0)";
// 403 이면 한 번만 — 수집기(enrich-comp·try-engines)가 이미 쓰는 브라우저 UA. 그 밖의 위장은 하지 않는다.
const UA_BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hostKey = (h) => (/(^|\.)archive\.org$/.test(h) ? "archive.org" : h);
const gapFor = (k, h) => (k === "archive.org" ? ARCHIVE_GAP_MS : /^index\.commoncrawl\.org$/.test(h) ? CC_GAP_MS : GAP_MS);
export const net = { hosts: new Map(), perUrl: new Map(), calls: 0, refusedNonGet: 0, stops: [] };
function hostState(h) {
  const k = hostKey(h);
  if (!net.hosts.has(k)) net.hosts.set(k, { next: 0, chain: Promise.resolve(), stopped: "", n: 0, gap: gapFor(k, h) });
  return net.hosts.get(k);
}
// 한 번 GET. 돌려주는 것: { status, body(Buffer), headers, url, skipped? }
export async function get(url, { ua = UA, timeout = 45000, accept = "*/*", headers = {} } = {}) {
  let host;
  try { host = new URL(url).host; } catch (e) { return { status: 0, skipped: "주소 오류" }; }
  const st = hostState(host);
  const used = net.perUrl.get(url) || 0;
  if (used >= 3) return { status: 0, skipped: "이 주소 3번 다 씀" };
  if (st.stopped) return { status: 0, skipped: st.stopped };
  net.perUrl.set(url, used + 1);
  // 같은 호스트는 줄을 세워 하나씩, 간격을 두고
  const run = st.chain.then(async () => {
    if (st.stopped) return { status: 0, skipped: st.stopped };
    const wait = st.next - Date.now();
    if (wait > 0) await sleep(wait);
    st.n++; net.calls++;
    try {
      const r = await fetch(url, { headers: { "user-agent": ua, accept, ...headers }, redirect: "follow", signal: AbortSignal.timeout(timeout) });
      const body = Buffer.from(await r.arrayBuffer());
      const h = Object.fromEntries(["content-type", "content-encoding", "server", "retry-after", "content-range"].map((k) => [k, r.headers.get(k) || ""]));
      if (r.status === 429 || (r.status === 503 && /commoncrawl/.test(host))) {
        st.stopped = `HTTP ${r.status} — 이 호스트는 이번 실행에서 그만`;
        net.stops.push({ host: hostKey(host), status: r.status, url });
      }
      return { status: r.status, body, headers: h, url: r.url };
    } catch (e) {
      return { status: 0, error: String((e && e.message) || e).slice(0, 100) };
    } finally {
      st.next = Date.now() + st.gap;
    }
  });
  st.chain = run.catch(() => {});
  return run;
}
// 네트워크 오류·5xx 면 한 번 더(주소당 3번 안에서)
async function getRetry(url, o) {
  let r = await get(url, o);
  if (!r.skipped && (r.status === 0 || (r.status >= 500 && r.status !== 503))) { await sleep(3000); r = await get(url, o); }
  return r;
}
export function bodyText(r) {
  let b = r.body || Buffer.alloc(0);
  try { if (b[0] === 0x1f && b[1] === 0x8b) b = gunzipSync(b); } catch (e) {}
  return b.toString("utf8");
}

// ── 한 브랜드: robots → 사이트맵 ───────────────────────────────────────────────
async function robotsAndSitemaps(origin, stored, { maxChild = 6 } = {}) {
  const out = { origin, robots: { status: 0 }, sitemaps: [], children: { listed: 0, fetched: 0, blockedByRobots: [] }, urls: 0, productUrls: 0, sample: [] };
  let r = await getRetry(origin + "/robots.txt", { accept: "text/plain,*/*" });
  let txt = r.body ? bodyText(r) : "";
  let ch = r.status ? challengeOf(r.status, txt) : "";
  if (r.status === 403) {   // 이름 없는 UA 만 막는 곳 — 수집기가 늘 쓰는 UA 로 한 번만
    const r2 = await get(origin + "/robots.txt", { ua: UA_BROWSER, accept: "text/plain,*/*" });
    out.robots.firstStatus = 403;
    if (r2.status) { r = r2; txt = r2.body ? bodyText(r2) : ""; ch = challengeOf(r2.status, txt); out.robots.browserUa = true; }
  }
  out.robots.status = r.status;
  if (r.skipped || r.error) out.robots.note = r.skipped || r.error;
  if (ch) out.robots.challenge = ch;
  const looksRobots = r.status === 200 && !ch && /user-agent\s*:/i.test(txt);
  out.robots.ok = looksRobots;
  const robots = parseRobots(looksRobots ? txt : "");
  const rules = rulesFor(robots, "*");
  out.robots.sitemapsListed = robots.sitemaps.length;
  out.robots.blocksAllGeneral = looksRobots && blocksAll(robots, "*");
  out.robots.ccbot = looksRobots ? (blocksAll(robots, "ccbot") ? "막음" : "허용") : "";
  out.robots.archiver = looksRobots ? (blocksAll(robots, "ia_archiver") || blocksAll(robots, "archive.org_bot") ? "막음" : "허용") : "";
  const ua = out.robots.browserUa ? UA_BROWSER : UA;
  // robots 에 사이트맵이 없으면 /sitemap.xml 을 (robots 가 허용할 때만) 한 번 본다
  let tops = robots.sitemaps.slice(0, 4);
  if (!tops.length && looksRobots) tops = [origin + "/sitemap.xml"];
  const locale = localeTokens(stored);
  out.locale = locale[0] || "";
  const seen = new Set();
  const storedSet = new Set(stored.map(normUrl));
  const inMap = new Set();
  const allLocs = [];
  const fetchMap = async (u, depth) => {
    if (seen.has(u)) return null;
    seen.add(u);
    let path = u;
    try { const x = new URL(u); path = x.pathname + x.search; if (x.origin !== origin && !x.host.endsWith(new URL(origin).host.replace(/^www\d?\./, ""))) path = null; } catch (e) { return null; }
    if (path) {
      const a = isAllowed(rules, path);
      if (!a.ok) { out.children.blockedByRobots.push(`${u} (${a.rule})`); return { url: u, robots: a.rule }; }
    }
    const rr = await getRetry(u, { ua, accept: "application/xml,text/xml,*/*" });
    const t = rr.body ? bodyText(rr) : "";
    const cc = rr.status ? challengeOf(rr.status, t) : "";
    const pm = rr.status === 200 && !cc ? parseSitemap(t) : { kind: "", locs: [] };
    const rec = { url: u, status: rr.status, kind: pm.kind, n: pm.locs.length, depth, ...(cc ? { challenge: cc } : {}), ...(rr.skipped ? { note: rr.skipped } : {}), ...(rr.error ? { note: rr.error } : {}) };
    if (pm.kind === "urlset") {
      out.children.fetched += depth > 0 ? 1 : 0;
      rec.lastmod = pm.lastmod;
      for (const l of pm.locs) { allLocs.push(l); const k = normUrl(l); if (storedSet.has(k)) inMap.add(k); }
    }
    return { rec, pm };
  };
  for (const top of tops) {
    const got = await fetchMap(top, 0);
    if (!got || !got.rec) { if (got) out.sitemaps.push(got); continue; }
    out.sitemaps.push(got.rec);
    if (got.pm.kind === "index") {
      out.children.listed += got.pm.locs.length;
      // 하위가 또 색인이면 한 단계 더(지역별 색인 → 상품 사이트맵)
      for (const c of pickChildren(got.pm.locs, locale, maxChild)) {
        if (out.children.fetched >= maxChild) break;
        const g2 = await fetchMap(c, 1);
        if (!g2 || !g2.rec) continue;
        out.sitemaps.push(g2.rec);
        if (g2.pm.kind === "index") {
          out.children.listed += g2.pm.locs.length;
          for (const c2 of pickChildren(g2.pm.locs, locale, maxChild)) {
            if (out.children.fetched >= maxChild) break;
            const g3 = await fetchMap(c2, 2);
            if (g3 && g3.rec) out.sitemaps.push(g3.rec);
          }
        }
      }
    }
  }
  const prod = allLocs.filter((u) => looksLikeProduct(u));
  out.urls = allLocs.length;
  out.productUrls = prod.length;
  out.storedInMap = inMap.size;
  Object.defineProperty(out, "inMapKeys", { value: inMap, enumerable: false });
  out.storedChecked = storedSet.size;
  const cats = {};
  for (const u of prod) { const c = guessCategory(u); if (c) cats[c] = (cats[c] || 0) + 1; }
  out.guessCats = cats;
  out.newProductUrls = prod.filter((u) => !storedSet.has(normUrl(u))).length;
  out.sample = prod.slice(0, 3);
  return out;
}

// ── 아카이브 ───────────────────────────────────────────────────────────────
const WAYBACK_API = (process.env.WAYBACK_API || "https://archive.org/wayback/available").replace(/\/+$/, "");
const WAYBACK_WEB = (process.env.WAYBACK_WEB || "https://web.archive.org/web").replace(/\/+$/, "");
const CC_INDEX = (process.env.CC_INDEX || "https://index.commoncrawl.org").replace(/\/+$/, "");
const CC_DATA = (process.env.CC_DATA || "https://data.commoncrawl.org").replace(/\/+$/, "");
const fibreSlice = (() => { const i = WORKER_SRC.indexOf("const FIBRES = {"), j = WORKER_SRC.indexOf("function titleCase", i); return WORKER_SRC.slice(i, j); })();
const FIBRE_MAP = new Function(fibreSlice + "\n return FIBRES;")();
// 보관본 HTML 에서 혼용률. 차단 화면·목록 페이지면 읽지 않는다(야간 보강의 아카이브 층과 같은 가드).
export function compFromArchive(html, url) {
  const ch = challengeOf(200, html);
  if (ch) return { ok: false, why: "보관본도 차단 화면(" + ch.slice(0, 30) + ")" };
  const chk = archivePageCheck(html, FIBRE_MAP);
  if (!chk.ok) return { ok: false, why: chk.reason };
  const c = compOf(html, url);
  if (c.comp && validComp(c.comp)) return { ok: true, comp: c.comp, src: c.src };
  return { ok: false, why: "보관본에 혼용률 없음" };
}
async function waybackOne(url, read) {
  const bare = url.split("#")[0].split("?")[0];
  const a = await get(`${WAYBACK_API}?url=${encodeURIComponent(bare)}`, { accept: "application/json" });
  if (a.skipped || a.status !== 200) return { cap: false, err: a.skipped || a.error || "HTTP " + a.status };
  let j = null;
  try { j = JSON.parse(bodyText(a)); } catch (e) {}
  const c = j && j.archived_snapshots && j.archived_snapshots.closest;
  if (!c || c.available === false || !c.timestamp) return { cap: false };
  const ok2xx = !c.status || /^2/.test(String(c.status));
  if (!ok2xx) return { cap: false, redirect: String(c.status) };
  if (!read) return { cap: true, ts: c.timestamp };
  const r = await get(`${WAYBACK_WEB}/${c.timestamp}id_/${bare}`, { accept: "text/html,*/*" });
  if (r.skipped || r.status !== 200) return { cap: true, ts: c.timestamp, read: { ok: false, why: r.skipped || r.error || "HTTP " + r.status } };
  return { cap: true, ts: c.timestamp, read: compFromArchive(bodyText(r), bare) };
}
let ccCrawls = null;
async function ccList(n) {
  if (ccCrawls) return ccCrawls;
  const r = await getRetry(`${CC_INDEX}/collinfo.json`, { accept: "application/json" });
  try { ccCrawls = JSON.parse(bodyText(r)).map((x) => x.id).filter(Boolean).slice(0, n); } catch (e) { ccCrawls = []; }
  return ccCrawls;
}
// WARC 레코드(gzip 한 덩어리) → HTTP 본문
export function warcBody(buf) {
  let b = buf;
  try { if (b[0] === 0x1f && b[1] === 0x8b) b = gunzipSync(b); } catch (e) { return { status: 0, html: "" }; }
  const sep = Buffer.from("\r\n\r\n");
  const i = b.indexOf(sep);
  if (i < 0) return { status: 0, html: "" };
  const http = b.subarray(i + 4);
  const j = http.indexOf(sep);
  if (j < 0) return { status: 0, html: "" };
  const head = http.subarray(0, j).toString("latin1");
  const status = Number((head.match(/^HTTP\/[\d.]+\s+(\d{3})/) || [])[1]) || 0;
  let body = http.subarray(j + 4);
  const enc = ((head.match(/\r\ncontent-encoding:\s*([^\r\n]+)/i) || [])[1] || "").trim().toLowerCase();
  try {
    if (body[0] === 0x1f && body[1] === 0x8b) body = gunzipSync(body);
    else if (enc === "br") body = brotliDecompressSync(body);
    else if (enc === "deflate") body = inflateSync(body);
  } catch (e) {}
  return { status, html: body.toString("utf8") };
}
async function ccOne(url, read, crawls) {
  const bare = url.split("#")[0].split("?")[0];
  for (const id of crawls) {
    const r = await get(`${CC_INDEX}/${id}-index?url=${encodeURIComponent(bare)}&output=json&limit=5`, { accept: "application/json" });
    if (r.skipped) return { cap: false, err: r.skipped };
    if (r.status === 404) continue;
    if (r.status !== 200) return { cap: false, err: r.error || "HTTP " + r.status };
    const recs = bodyText(r).split("\n").map((l) => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean);
    const ok = recs.find((x) => String(x.status) === "200") || null;
    if (!ok) { if (recs.length) return { cap: false, crawl: id, only: [...new Set(recs.map((x) => x.status))].join(",") }; continue; }
    if (!read) return { cap: true, crawl: id };
    const off = Number(ok.offset), len = Number(ok.length);
    const d = await get(`${CC_DATA}/${ok.filename}`, { headers: { range: `bytes=${off}-${off + len - 1}` }, accept: "*/*" });
    if (d.skipped || (d.status !== 206 && d.status !== 200)) return { cap: true, crawl: id, read: { ok: false, why: d.skipped || d.error || "HTTP " + d.status } };
    const w = warcBody(d.body);
    return { cap: true, crawl: id, read: w.html ? compFromArchive(w.html, bare) : { ok: false, why: "WARC 를 못 풂" } };
  }
  return { cap: false };
}
// 표본: 혼용률이 빈 상품을 먼저(아카이브가 메울 수 있는지가 관심사), 카탈로그 전체에 고르게
export function pickSample(items, emptySet, per) {
  const urls = items.map((x) => x.productUrl).filter((u) => /^https?:\/\//.test(u || "") && looksLikeProduct(u));
  const spread = (arr, n) => (arr.length <= n ? arr : Array.from({ length: n }, (_, i) => arr[Math.floor((i * arr.length) / n)]));
  const empty = urls.filter((u) => emptySet.has(u));
  const rest = urls.filter((u) => !emptySet.has(u));
  const a = spread(empty, per);
  return [...a, ...spread(rest, per - a.length)];
}

// ── 실행 ───────────────────────────────────────────────────────────────────
async function main() {
  // 읽기만: GET/HEAD 가 아닌 요청은 보내기 전에 막는다(Worker 에 쓰는 길을 원천 차단).
  const realFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") { net.refusedNonGet++; return Promise.reject(new Error(`읽기만 — ${method} 요청을 막음`)); }
    return realFetch(input, init);
  };
  const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
  const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
  const tok = "&token=" + encodeURIComponent(TOKEN);
  const PER = Math.max(0, Number(process.env.PER || 10));
  const READ_PER = Math.max(0, Number(process.env.READ_PER || 4));
  const MAX_CHILD = Math.max(1, Number(process.env.MAX_CHILD || 6));
  const TIME_MS = Math.max(1, Number(process.env.TIME_MIN || 100)) * 60_000;
  const RUN_ID = String(process.env.RUN_ID || "local").replace(/[^\w.-]/g, "");
  const OUT_DIR = process.env.REPORT_DIR || ROOT;
  const file = process.env.TARGETS || join(ROOT, "access-measure/targets-open-sources.json");
  let targets = JSON.parse(readFileSync(file, "utf8")).brands || [];
  const only = String(process.env.BRANDS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (only.length) targets = targets.filter((t) => only.includes(t.brand.toLowerCase()));
  const pm = String(process.env.PART || "1/1").match(/^(\d+)\/(\d+)$/);
  if (pm && Number(pm[2]) > 1) targets = targets.filter((_, i) => i % Number(pm[2]) === Number(pm[1]) - 1);
  console.log(`STORE: 0 · 읽기만 — Worker·사이트·아카이브에 GET 만 보낸다(다른 요청은 보내기 전에 막음) · 대상 ${targets.length}개 브랜드`);
  const t0 = Date.now();

  let list = [];
  try { list = ((await (await fetch(WORKER + "/?catalogs=1" + tok, { signal: AbortSignal.timeout(30000) })).json()).list) || []; }
  catch (e) { console.log("카탈로그 목록을 못 읽음 — 아카이브 표본 없이 사이트맵만: " + e.message); }
  const crawls = await ccList(Math.max(1, Number(process.env.CC_CRAWLS || 2)));
  console.log(`Common Crawl 색인: ${crawls.join(", ") || "(못 읽음)"}`);

  const rows = [];
  for (const t of targets) {
    if (Date.now() - t0 > TIME_MS) { rows.push({ brand: t.brand, deferred: true }); continue; }
    const cats = list.filter((c) => String(c.brand || "").toLowerCase() === t.brand.toLowerCase());
    // 같은 브랜드에 옛 키·새 키가 있으면 상품이 많은 쪽
    const cat = cats.sort((a, b) => (b.count || 0) - (a.count || 0))[0];
    let items = [], empty = new Set();
    if (cat) {
      try { items = ((await (await fetch(WORKER + "/?catalog=" + encodeURIComponent(cat.site) + tok, { signal: AbortSignal.timeout(30000) })).json()).items) || []; } catch (e) {}
      try {
        const ov = await (await fetch(WORKER + "/?comps=" + encodeURIComponent(cat.site) + tok, { signal: AbortSignal.timeout(30000) })).json();
        for (const it of items) { const o = ov && ov[it.productUrl]; if (!o || !o.comp || o.comp === "none") empty.add(it.productUrl); }
      } catch (e) {}
    }
    const stored = items.map((x) => x.productUrl).filter(Boolean);
    // 상품 주소 호스트(가장 많은 것)를 쓴다 — 목록과 상품 호스트가 다른 브랜드가 있다
    const hc = new Map();
    for (const u of stored) { try { const o = new URL(u).origin; hc.set(o, (hc.get(o) || 0) + 1); } catch (e) {} }
    const origin = [...hc.entries()].sort((a, b) => b[1] - a[1]).map((x) => x[0])[0] || t.origin;
    console.log(`\n■ ${t.brand} — ${origin} · 저장 ${stored.length}개(혼용률 빈 것 ${empty.size})`);
    const sm = await robotsAndSitemaps(origin, stored, { maxChild: MAX_CHILD });
    console.log(`  robots ${sm.robots.status}${sm.robots.challenge ? " ⛔ " + sm.robots.challenge : ""} · 사이트맵 ${sm.robots.sitemapsListed}개 적힘 · 상품 주소 ${sm.productUrls}/${sm.urls} · 저장 주소 중 사이트맵에 ${sm.storedInMap}/${sm.storedChecked}`);
    // 아카이브 표본 — 두 아카이브를 동시에(호스트가 달라 서로의 간격에 영향 없음)
    const sample = pickSample(items, empty, PER);
    const wb = [], cc = [];
    await Promise.all([
      (async () => { for (let i = 0; i < sample.length; i++) wb.push({ url: sample[i], ...(await waybackOne(sample[i], i < READ_PER)) }); })(),
      (async () => { for (let i = 0; i < sample.length; i++) cc.push({ url: sample[i], ...(await ccOne(sample[i], i < READ_PER, crawls)) }); })(),
    ]);
    const sum = (arr) => ({ n: arr.length, cap: arr.filter((x) => x.cap).length, read: arr.filter((x) => x.read).length,
      comp: arr.filter((x) => x.read && x.read.ok).length, err: arr.filter((x) => x.err).length,
      why: Object.entries(arr.filter((x) => x.read && !x.read.ok).reduce((m, x) => ((m[x.read.why] = (m[x.read.why] || 0) + 1), m), {})).map(([k, v]) => `${k} ${v}`).join(" · ") });
    const W = sum(wb), C = sum(cc);
    console.log(`  Wayback 보관 ${W.cap}/${W.n} · 열어 본 ${W.read} 중 혼용률 ${W.comp}${W.why ? " (" + W.why + ")" : ""} | Common Crawl 보관 ${C.cap}/${C.n} · 열어 본 ${C.read} 중 혼용률 ${C.comp}${C.why ? " (" + C.why + ")" : ""}`);
    rows.push({ brand: t.brand, origin, listing: t.listing, product: t.product, stored: stored.length, storedEmpty: empty.size,
      storedCats: items.reduce((m, x) => ((m[x.category || "?"] = (m[x.category || "?"] || 0) + 1), m), {}),
      // 담당자 카테고리별: 저장 상품 중 받은 사이트맵에 있는 수 / 저장 수(측정)
      storedCatsInMap: items.reduce((m, x) => { const c = x.category || "?"; const v = (m[c] = m[c] || [0, 0]); v[1]++; if (sm.inMapKeys.has(normUrl(x.productUrl))) v[0]++; return m; }, {}),
      sitemap: sm, wayback: { ...W, items: wb }, commoncrawl: { ...C, items: cc } });
  }
  const res = { when: new Date().toISOString(), run: RUN_ID, readOnly: true, refusedNonGet: net.refusedNonGet, crawls,
    requests: net.calls, hosts: Object.fromEntries([...net.hosts].map(([k, v]) => [k, { n: v.n, stopped: v.stopped }])), stops: net.stops, rows };
  writeFileSync(join(OUT_DIR, `open-sources-${RUN_ID}.json`), JSON.stringify(res, null, 1));
  writeFileSync(join(OUT_DIR, `open-sources-${RUN_ID}.md`), report(res));
  console.log(`\n요청 ${net.calls}회 · 막은 쓰기 요청 ${net.refusedNonGet} · 429/503 으로 멈춘 호스트 ${net.stops.length}`);
}

export function report(res) {
  let md = `# 공개 출처 측정 — robots.txt · 사이트맵 · 웹 아카이브 (실행 ${res.run}, ${res.when.slice(0, 16)}Z)\n\n`;
  md += `읽기만(GET) · 요청 ${res.requests}회 · Common Crawl 색인 ${res.crawls.join(", ") || "없음"} · 429/503 으로 멈춘 호스트 ${res.stops.length ? res.stops.map((s) => s.host + " " + s.status).join(", ") : "없음"}\n\n`;
  md += `| 브랜드 | robots.txt | 사이트맵(적힌 수) | 상품 주소(받은 사이트맵) | 저장 주소 중 사이트맵에 있음 | 주소로 짐작한 카테고리(추정) | Wayback 보관 / 혼용률 | Common Crawl 보관 / 혼용률 | CCBot·아카이브 |\n|---|---|---|---:|---:|---|---|---|---|\n`;
  for (const r of res.rows) {
    if (r.deferred) { md += `| ${r.brand} | 시간 예산으로 미룸 | | | | | | | |\n`; continue; }
    const s = r.sitemap;
    const rb = s.robots.status === 200 && s.robots.ok ? "200" + (s.robots.browserUa ? "(브라우저 UA)" : "") + (s.robots.blocksAllGeneral ? " · 전체 막음" : "")
      : `${s.robots.status || "-"}${s.robots.challenge ? " ⛔ " + s.robots.challenge : ""}${s.robots.note ? " " + s.robots.note : ""}`;
    const maps = s.sitemaps.map((m) => m.robots ? `robots 막음` : `${m.status}${m.challenge ? "⛔" : ""}${m.kind ? " " + m.kind : ""}${m.n ? " " + m.n : ""}`);
    const mapCell = `${s.robots.sitemapsListed}개 · ${maps.slice(0, 4).join(" / ")}${maps.length > 4 ? " …" : ""}` + (s.children.listed ? ` · 하위 ${s.children.fetched}/${s.children.listed} 받음` : "");
    const cats = Object.entries(s.guessCats || {}).map(([k, v]) => `${k} ${v}`).join(" · ");
    md += `| ${r.brand} | ${rb} | ${mapCell} | ${s.productUrls}/${s.urls} | ${s.storedInMap}/${s.storedChecked} | ${cats} | ${r.wayback.cap}/${r.wayback.n} · ${r.wayback.comp}/${r.wayback.read} | ${r.commoncrawl.cap}/${r.commoncrawl.n} · ${r.commoncrawl.comp}/${r.commoncrawl.read} | ${s.robots.ccbot || "-"} · ${s.robots.archiver || "-"} |\n`;
  }
  md += `\n- 상품 주소 = 받은 사이트맵의 주소 중 상품 모양(접근 지도와 같은 규칙). 큰 사이트는 하위 사이트맵 일부만 받았다(받은 수/적힌 수).\n`;
  md += `- 보관 = 표본(혼용률 빈 상품 먼저) 중 보관본이 있는 수 · 혼용률 = 앞 표본 몇 개를 열어 혼용률이 읽힌 수/연 수.\n\n`;
  md += `## 브랜드별 자세히\n\n`;
  for (const r of res.rows) {
    if (r.deferred) continue;
    const s = r.sitemap;
    md += `### ${r.brand}\n\n- 출처 ${s.origin} · 저장 ${r.stored}개(혼용률 빈 것 ${r.storedEmpty}) · 지역 표시 ${s.locale || "-"}\n`;
    md += `- robots.txt: HTTP ${s.robots.status}${s.robots.firstStatus ? `(이름 없는 UA 는 ${s.robots.firstStatus})` : ""}${s.robots.challenge ? " · ⛔ " + s.robots.challenge : ""} · 사이트맵 ${s.robots.sitemapsListed}개 · CCBot ${s.robots.ccbot || "-"} · 아카이브 크롤러 ${s.robots.archiver || "-"}\n`;
    for (const m of s.sitemaps) md += `  - ${m.robots ? "robots 가 막아 안 가져옴 — " + m.robots + " · " + m.url : `${m.status} ${m.kind || "-"} ${m.n || 0}개${m.lastmod ? ` (lastmod ${m.lastmod})` : ""}${m.challenge ? " ⛔ " + m.challenge : ""}${m.note ? " · " + m.note : ""} · ${m.url}`}\n`;
    for (const b of s.children.blockedByRobots) md += `  - robots 막음: ${b}\n`;
    if (s.sample.length) md += `- 상품 주소 표본: ${s.sample.join(" · ")}\n`;
    for (const [k, A] of [["Wayback", r.wayback], ["Common Crawl", r.commoncrawl]]) {
      md += `- ${k}: 표본 ${A.n} 중 보관 ${A.cap} · 열어 본 ${A.read} 중 혼용률 ${A.comp}${A.why ? " · 못 읽은 이유: " + A.why : ""}${A.err ? ` · 오류 ${A.err}` : ""}\n`;
      for (const it of A.items.filter((x) => x.read && x.read.ok).slice(0, 2)) md += `  - ${it.url} → ${String(it.read.comp).replace(/\n/g, " | ")}\n`;
    }
    md += `\n`;
  }
  return md;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
