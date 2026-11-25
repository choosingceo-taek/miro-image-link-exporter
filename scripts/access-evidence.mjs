// 접근 지도(docs/access-map.md)용 — 한 번의 응답에서 "누가, 왜 막았나"의 근거를 뽑는 순수 함수 모음.
//
// try-engines.mjs 가 페이지마다 부르고, test-access-evidence.mjs 가 네트워크 없이 시험한다.
// 원칙: 결론(차단 주체)은 응답에 남은 흔적(쿠키 이름·응답 헤더·차단 화면 문구·불러온 스크립트 주소)으로만
// 내린다. 브랜드 평판으로 짐작하지 않는다. 흔적이 차단 화면 자체에 있으면 '높음', 쿠키·헤더만 있으면
// '중간', CDN 헤더만 있고 차단 문구가 없으면 '낮음'으로 적는다.
//
// 또 하나: 유료 수집 서비스 시험용 '외부 API 엔진' 설정(SCRAPE_API_CONFIG)을 읽고, 요청을 만들고,
// 키가 어디에도 새지 않게 가리는 함수도 여기 있다(업체 이름·주소·키는 저장소에 두지 않는다).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const slice = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i); return src.slice(i, j); };

// ── 상품 주소처럼 보이는가(try-engines 에서 옮겨 옴) ─────────────────────────
const auditSrc = readFileSync(join(ROOT, "scripts/audit-catalogs.mjs"), "utf8");
const NON_PRODUCT_SEGMENTS = new Function(slice(auditSrc, "const NON_PRODUCT_SEGMENTS = [", "const NON_PRODUCT_PATH") + "\n return NON_PRODUCT_SEGMENTS;")();
const NON_PRODUCT_PATH = new RegExp("/(?:" + NON_PRODUCT_SEGMENTS.join("|") + ")(?:/|$)", "i");

// 카탈로그 앞쪽에 카테고리·기획전 주소가 섞인 브랜드가 있다(11/24 표본: Adidas /us/black_friday ·
// Aritzia /intl/en/new · Lululemon /c/…). 상품 주소에 흔한 표시가 하나라도 있어야 상품으로 본다.
export function looksLikeProduct(url) {
  let u;
  try { u = new URL(url); } catch (e) { return false; }
  const path = u.pathname;
  if (NON_PRODUCT_PATH.test(path)) return false;
  if (/\/(?:c|category|categories|collections?)(?:\/|$)/i.test(path) && !/\/products?\//i.test(path)) return false;
  if (/\/(?:product|products|p|productpage|style|item|dp|prd)\//i.test(path)) return true;   // /product/… · /p/… · /style/…
  if (/productpage\.|\/prod\d|_\/prod/i.test(path)) return true;                         // H&M · Lululemon
  if (/\d{6,}/.test(path)) return true;                                                  // 상품 번호(Zara p04424306 · Fatface 968669)
  if (/[A-Z]{2}\d{4}\.html$/i.test(path)) return true;                                   // Adidas IF1234.html
  if (/^\/shop\/[^/]*-[^/]*-[^/]+\/?$/i.test(path)) return true;                         // Anthropologie·Free People /shop/<상품-이름>
  return false;
}

// ── 응답 헤더 ──────────────────────────────────────────────────────────────
// 차단 주체·CDN·플랫폼을 가리는 데 쓰는 헤더만 남긴다(쿠키 값·개인 정보는 남기지 않는다).
const KEEP_HEADER = /^(server|via|x-cache|cf-ray|cf-mitigated|cf-cache-status|akamai-grn|x-akamai-[\w-]+|x-iinfo|x-cdn|x-datadome|x-datadome-cid|x-dd-b|x-px[\w-]*|x-kpsdk-[\w-]+|x-amzn-waf-action|x-amz-cf-pop|x-amz-cf-id|x-served-by|x-fastly-request-id|fastly-[\w-]+|x-sucuri-[\w-]+|x-shopify-stage|x-shopid|powered-by|x-powered-by|x-vercel-id|x-nf-request-id|x-sfdc-[\w-]+|x-dw-request-base-id|location|retry-after|content-type|content-length)$/i;
export function pickHeaders(h) {
  const out = {};
  if (!h) return out;
  const entries = typeof h.entries === "function" ? [...h.entries()] : Object.entries(h);
  for (const [k, v] of entries) {
    const key = String(k).toLowerCase();
    if (!KEEP_HEADER.test(key)) continue;
    out[key] = String(v).replace(/\s+/g, " ").slice(0, 100);
  }
  return out;
}

// Set-Cookie(한 줄로 합쳐졌든 배열이든)에서 쿠키 '이름'만 뽑는다. 값은 버린다.
export function cookieNamesFromSetCookie(sc) {
  const parts = Array.isArray(sc) ? sc : String(sc || "").split(/,(?=\s*[!#$%&'*+\-.^_`|~0-9A-Za-z]+=)/);
  const names = [];
  for (const p of parts) {
    const m = String(p).trim().match(/^([^=;\s]+)=/);
    if (m && !names.includes(m[1])) names.push(m[1]);
  }
  return names;
}

// ── 화면(HTML)의 흔적 ──────────────────────────────────────────────────────
// [id, 정규식, 이 흔적이 가리키는 주체, 'block'(차단 화면에만 나오는 것) | 'present'(평소 페이지에도 있음)]
export const MARKERS = [
  // 주의: Cloudflare 봇 관리는 평소 페이지에도 /cdn-cgi/challenge-platform/scripts/jsd/main.js 를 심는다 — 그건 '있음'일 뿐 차단 화면이 아니다.
  ["cf-challenge", /\/cdn-cgi\/challenge-platform\/h\/|window\._cf_chl_opt|<title>\s*Just a moment\.\.\.\s*<\/title>|Checking if the site connection is secure|Enable JavaScript and cookies to continue/i, "Cloudflare", "block"],
  ["cf-script", /\/cdn-cgi\/challenge-platform\/scripts\//i, "Cloudflare", "present"],
  ["cf-block", /Attention Required! \| Cloudflare|Sorry, you have been blocked|cf-error-details|<span[^>]*>\s*Cloudflare Ray ID/i, "Cloudflare", "block"],
  ["akamai-deny", /errors(\.|&#46;)edgesuite(\.|&#46;)net|Reference&#32;&#35;\d+(&#46;|\.)[0-9a-f]+|Reference #\d+\.[0-9a-f]+\.\d+|Reference Error: \d+\.[0-9a-f]+\.\d+/i, "Akamai", "block"],
  ["akamai-challenge", /\/_sec\/cp_challenge|sec-if-cpt-container|bm-verify=|ak_bmsc_challenge/i, "Akamai", "block"],
  ["px-challenge", /px-captcha|_pxCaptcha|captcha\.px-cdn\.net|Press &amp; Hold|Press & Hold to confirm/i, "HUMAN(PerimeterX)", "block"],
  ["px-script", /client\.perimeterx\.net|px-cloud\.net|px-cdn\.net|window\._pxAppId|\/_px\/|\/px\/client\/main\.min\.js/i, "HUMAN(PerimeterX)", "present"],
  ["datadome-challenge", /geo\.captcha-delivery\.com|ct\.captcha-delivery\.com|var dd=\{['"]rt['"]/i, "DataDome", "block"],
  ["datadome-script", /js\.datadome\.co|datadome\.co\/tags\.js|window\.ddjskey/i, "DataDome", "present"],
  ["imperva-block", /_Incapsula_Resource|Incapsula incident ID|Request unsuccessful\. Incapsula/i, "Imperva", "block"],
  ["imperva-abp", /Pardon Our Interruption/i, "Imperva", "block"],
  ["kasada", /149e9513-01fa-4fb0-aad4-566afd725d1b|KPSDK|kpsdk/, "Kasada", "present"],
  ["aws-waf", /awsWafCookieDomainList|token\.awswaf\.com|AwsWafIntegration/i, "AWS WAF", "block"],
  ["vercel-checkpoint", /Vercel Security Checkpoint|We.re verifying your browser/i, "Vercel", "block"],
  ["queue-it", /queue-it\.net|queueit-/i, "Queue-it", "present"],
  ["captcha", /g-recaptcha|recaptcha\/api\.js|hcaptcha\.com\/1\/api|challenges\.cloudflare\.com\/turnstile/i, "", "present"],
  ["access-denied", /<title>\s*(Access Denied|403 Forbidden|Forbidden)\s*<\/title>|<h1>\s*Access Denied\s*<\/h1>/i, "", "block"],
  ["geo", /not currently able to ship|currently unable to ship to|isn.?t available in your (country|region)|not available in your (country|region)|this (site|website) is not available|we (do not|don.?t) (currently )?ship to/i, "", "geo"],
  ["maintenance", /system maintenance|we.?re working on it|be right back|site is (temporarily )?(down|unavailable)|under maintenance/i, "", "maintenance"],
  ["notfound", /page not found|page you (were|are|re) looking for|can.?t find (the|that) page|could not be found|no longer (exists|available)|404 error|error 404|we couldn.?t find/i, "", "notfound"],
  ["login", /please (sign|log) in to (view|continue|access)|you must be (logged|signed) in/i, "", "login"],
  ["js-shell", /<div id="(__next|root|app|__nuxt)"[^>]*>\s*<\/div>|<noscript>[^<]{0,200}(enable|requires) javascript/i, "", "shell"],
];

// 차단 화면 쿠키 이름 → 주체. platform 은 차단과 무관한 쇼핑몰 엔진(고치는 방법을 고르는 데 쓴다).
const COOKIE_RULES = [
  ["Akamai", /^(_abck|bm_sz|ak_bmsc|bm_sv|bm_mi|bm_so|bm_ss|bm_s|bm_lso|sbsd|sbsd_o|sec_cpt)$/, "protection"],
  ["HUMAN(PerimeterX)", /^(_px\d?|_pxhd|_pxvid|pxcts|_pxff_[\w-]*|_pxde|_px_[\w-]*)$/, "protection"],
  ["DataDome", /^datadome$/i, "protection"],
  ["Imperva", /^(incap_ses_[\w-]*|visid_incap_[\w-]*|nlbi_[\w-]*|reese84|___utmvc)$/, "protection"],
  ["Cloudflare", /^(__cf_bm|cf_clearance|__cflb|_cfuvid|cf_chl_[\w-]*)$/, "protection"],
  ["Kasada", /^(KP_UIDz[\w-]*|x-kpsdk[\w-]*)$/i, "protection"],
  ["AWS WAF", /^aws-waf-token$/, "protection"],
  ["F5(BIG-IP)", /^TS[0-9a-f]{6,}$/i, "protection"],
  ["Queue-it", /^QueueITAccepted/, "protection"],
  ["Salesforce Commerce Cloud", /^(dwsid|dwanonymous_[\w-]*|dwac_[\w-]*|__cq_dnt|dw_dnt)$/, "platform"],
  ["Shopify", /^(_shopify_[\w-]*|secure_customer_sig|cart_currency|_tracking_consent)$/, "platform"],
];

// 헤더 → 주체
function headerVendors(h) {
  const out = [];
  const add = (vendor, role, sig) => out.push({ vendor, role, sig });
  const hv = (k) => (h && h[k]) || "";
  if (/cloudflare/i.test(hv("server")) || hv("cf-ray")) add("Cloudflare", "cdn", hv("cf-ray") ? "cf-ray 헤더" : `server: ${hv("server")}`);
  if (/challenge|block/i.test(hv("cf-mitigated"))) add("Cloudflare", "block", `cf-mitigated: ${hv("cf-mitigated")}`);
  if (/akamai/i.test(hv("server")) || hv("akamai-grn") || Object.keys(h || {}).some((k) => k.startsWith("x-akamai-")))
    add("Akamai", "cdn", hv("akamai-grn") ? "akamai-grn 헤더" : hv("server") ? `server: ${hv("server")}` : "x-akamai-* 헤더");
  if (hv("x-iinfo") || /imperva|incapsula/i.test(hv("x-cdn"))) add("Imperva", "cdn", hv("x-iinfo") ? "x-iinfo 헤더" : `x-cdn: ${hv("x-cdn")}`);
  if (hv("x-datadome") || hv("x-datadome-cid") || hv("x-dd-b")) add("DataDome", "protection", "x-datadome 헤더");
  if (Object.keys(h || {}).some((k) => /^x-px/.test(k))) add("HUMAN(PerimeterX)", "protection", "x-px* 헤더");
  if (Object.keys(h || {}).some((k) => /^x-kpsdk-/.test(k))) add("Kasada", "protection", "x-kpsdk-* 헤더");
  if (hv("x-amzn-waf-action")) add("AWS WAF", "block", `x-amzn-waf-action: ${hv("x-amzn-waf-action")}`);
  if (hv("x-amz-cf-id") || hv("x-amz-cf-pop") || /cloudfront/i.test(hv("via"))) add("CloudFront", "cdn", "x-amz-cf-* 헤더");
  if (/cache-\w+/i.test(hv("x-served-by")) || hv("x-fastly-request-id") || Object.keys(h || {}).some((k) => k.startsWith("fastly-")))
    add("Fastly", "cdn", "x-served-by/fastly 헤더");
  if (hv("x-sucuri-id") || /sucuri/i.test(hv("server"))) add("Sucuri", "protection", "x-sucuri 헤더");
  if (hv("x-shopify-stage") || hv("x-shopid") || /shopify/i.test(hv("powered-by"))) add("Shopify", "platform", "x-shopify-*/powered-by 헤더");
  if (hv("x-vercel-id")) add("Vercel", "cdn", "x-vercel-id 헤더");
  if (hv("x-dw-request-base-id") || Object.keys(h || {}).some((k) => k.startsWith("x-sfdc-"))) add("Salesforce Commerce Cloud", "platform", "x-dw/x-sfdc 헤더");
  return out;
}

// 화면 글(스크립트·태그를 뺀 보이는 글)
export function visibleText(html) {
  return String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#39;|&rsquo;/gi, "'").replace(/\s+/g, " ").trim();
}

export function markersOf(html, title) {
  const h = String(html || "").slice(0, 400_000) + " <title>" + String(title || "") + "</title>";
  return MARKERS.filter(([, rx]) => rx.test(h)).map(([id]) => id);
}

// 요청 주소 → 국가·언어 조각(/us/ · /en-us/ · /gb/ · /kr/ …)
function localeOf(u) {
  try {
    const x = new URL(u);
    const seg = x.pathname.split("/").filter(Boolean).slice(0, 2).map((s) => s.toLowerCase());
    return seg.filter((s) => /^([a-z]{2}|[a-z]{2}[-_][a-z]{2}|intl|row|global)$/.test(s)).join("/");
  } catch (e) { return ""; }
}
const regDomain = (host) => {
  const p = String(host || "").toLowerCase().replace(/^www\d?\./, "").split(".");
  return p.slice(/^(co|com|org|net)$/.test(p[p.length - 2] || "") && p.length > 2 ? -3 : -2).join(".");
};

// 요청한 주소와 최종 주소를 견준다 — 지역(나라) 이동 · 다른 사이트 · 첫 화면으로 튕김.
export function redirectKind(from, to) {
  if (!from || !to || from === to) return "";
  let a, b;
  try { a = new URL(from); b = new URL(to); } catch (e) { return ""; }
  if (regDomain(a.hostname) !== regDomain(b.hostname)) return "other-site";
  const la = localeOf(from), lb = localeOf(to);
  if (la !== lb && (la || lb)) return `locale ${la || "-"}→${lb || "-"}`;
  if (a.hostname !== b.hostname) return `host ${a.hostname}→${b.hostname}`;
  const depth = (p) => p.split("/").filter(Boolean).length;
  if (depth(a.pathname) >= 1 && depth(b.pathname) === 0) return "home";
  if (a.pathname.replace(/\/+$/, "") !== b.pathname.replace(/\/+$/, "")) return "path";
  return "";
}

// ── 목록 페이지: HTML 안의 상품 링크 수 ─────────────────────────────────────
// 브라우저 엔진은 실제 수집기(collector.js)를 돌려 센다. 이건 그와 별개로 HTML 만으로 세는 값이라
// impit(브라우저 없음)에도 쓸 수 있다 — "HTML 에 상품이 없다 = 스크립트가 그린다"를 가리는 근거.
export function countProductLinks(html, base) {
  const h = String(html || "");
  let baseHost = "";
  try { baseHost = regDomain(new URL(base).hostname); } catch (e) {}
  const product = new Set(), withImg = new Set();
  const rx = /<a\b[^>]*?href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]{0,4000}?)<\/a>/gi;
  let m, n = 0;
  while ((m = rx.exec(h)) && n++ < 20000) {
    let u;
    try { u = new URL(m[1].replace(/&amp;/g, "&"), base); } catch (e) { continue; }
    if (!/^https?:$/.test(u.protocol) || (baseHost && regDomain(u.hostname) !== baseHost)) continue;
    const key = u.origin + u.pathname.replace(/\/+$/, "");
    if (looksLikeProduct(u.href)) product.add(key);
    if (/<img\b|<picture\b|data-src=|srcset=/i.test(m[2])) withImg.add(key);
  }
  // JSON-LD ItemList 의 상품 수(일부 사이트는 목록을 여기 적는다)
  let itemList = 0;
  for (const s of h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (/"@type"\s*:\s*"ItemList"/.test(s[1])) itemList += (s[1].match(/"@type"\s*:\s*"ListItem"/g) || []).length;
  }
  return { productLinks: product.size, imgLinks: withImg.size, itemList };
}

// ── 한 응답의 근거 묶음 ─────────────────────────────────────────────────────
// in: { url, finalUrl, status, title, html, headers(객체), cookies(이름 배열), requests(주소 배열), kind }
export function evidenceOf(x) {
  const html = String(x.html || "");
  const text = visibleText(html);
  const ev = {
    status: x.status || 0,
    finalUrl: x.finalUrl && x.finalUrl !== x.url ? String(x.finalUrl).slice(0, 200) : "",
    redirect: redirectKind(x.url, x.finalUrl),
    title: String(x.title || (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1] || "").replace(/\s+/g, " ").trim().slice(0, 100),
    bytes: html.length,
    textLen: text.length,
    headers: pickHeaders(x.headers),
    cookies: (x.cookies || []).slice(0, 40),
    markers: markersOf(html, x.title),
    vendorRequests: [...new Set((x.requests || []).map((r) => { try { const u = new URL(r); return u.hostname + u.pathname.slice(0, 40); } catch (e) { return ""; } }).filter(Boolean))].slice(0, 8),
    snippet: text.slice(0, 220),
  };
  if (x.kind === "listing") Object.assign(ev, countProductLinks(html, x.finalUrl || x.url));
  return ev;
}

// 근거 → 보호 장치·CDN·플랫폼, 그리고 (막혔다면) 막은 주체와 신뢰도
const VENDOR_REQ_RX = [
  ["HUMAN(PerimeterX)", /perimeterx\.net|px-cdn\.net|px-cloud\.net|\/_px\//i],
  ["DataDome", /captcha-delivery\.com|datadome\.co/i],
  ["Cloudflare", /challenges\.cloudflare\.com|\/cdn-cgi\/challenge-platform/i],
  ["Kasada", /149e9513-01fa-4fb0-aad4-566afd725d1b|kpsdk/i],
  ["AWS WAF", /awswaf\.com/i],
  ["Akamai", /\/_sec\/cp_challenge|\/akam\/\d+\//i],
  ["Imperva", /_Incapsula_Resource/i],
];
export function identify(ev, blocked) {
  const seen = new Map();   // vendor → { roles:Set, signals:[] }
  const add = (vendor, role, sig) => {
    if (!vendor) return;
    if (!seen.has(vendor)) seen.set(vendor, { roles: new Set(), signals: [] });
    const s = seen.get(vendor);
    s.roles.add(role);
    if (sig && !s.signals.includes(sig)) s.signals.push(sig);
  };
  for (const v of headerVendors(ev.headers || {})) add(v.vendor, v.role, v.sig);
  for (const c of ev.cookies || []) {
    for (const [vendor, rx, role] of COOKIE_RULES) if (rx.test(c)) add(vendor, role, `쿠키 ${c}`);
  }
  for (const id of ev.markers || []) {
    const m = MARKERS.find((x) => x[0] === id);
    if (m && m[2]) add(m[2], m[3] === "block" ? "block" : "protection", `화면 흔적 ${id}`);
  }
  for (const r of ev.vendorRequests || []) for (const [vendor, rx] of VENDOR_REQ_RX) if (rx.test(r)) add(vendor, "protection", `불러온 주소 ${r.slice(0, 50)}`);

  const list = [...seen.entries()].map(([vendor, s]) => ({ vendor, roles: [...s.roles], signals: s.signals.slice(0, 5) }));
  let by = "", confidence = "", why = "";
  if (blocked) {
    const blockPage = list.find((v) => v.roles.includes("block"));
    const prot = list.find((v) => v.roles.includes("protection"));
    const cdn = list.find((v) => v.roles.includes("cdn"));
    if (blockPage) { by = blockPage.vendor; confidence = "높음"; why = "차단 화면 자체의 흔적"; }
    else if (prot) { by = prot.vendor; confidence = "중간"; why = "차단 응답에 그 업체의 쿠키·헤더·스크립트"; }
    else if (cdn) { by = cdn.vendor; confidence = "낮음"; why = "CDN 헤더만 있음(차단 문구 없음)"; }
    else if ((ev.markers || []).includes("access-denied")) { by = "알 수 없음"; confidence = "낮음"; why = "'Access Denied' 화면, 업체 흔적 없음"; }
    else { by = "알 수 없음"; confidence = "-"; why = "업체 흔적 없음"; }
  }
  return {
    protection: list.filter((v) => v.roles.some((r) => r === "protection" || r === "block")).map((v) => v.vendor),
    cdn: list.filter((v) => v.roles.includes("cdn")).map((v) => v.vendor),
    platform: list.filter((v) => v.roles.includes("platform")).map((v) => v.vendor),
    by, confidence, why, vendors: list,
  };
}

// 한 페이지 결과의 원인(작은 고정 어휘)
//   ok · blocked · rate-limit · conn-drop · timeout · geo · dead · maintenance · login
//   shell(HTML 에 상품이 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드가 안 보임)
//   selector(브라우저에 상품 카드가 보이는데 우리 수집기가 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · error
export function causeOf(r, kind) {
  const ev = r.ev || {};
  const mk = new Set(ev.markers || []);
  if (r.v === "skip") return "skip";
  if (r.v === "err") {
    const n = String(r.note || "");
    if (/timeout|timed out|시간 초과/i.test(n)) return "timeout";
    if (/ERR_HTTP2|ECONNRESET|socket hang up|ERR_CONNECTION|ERR_EMPTY_RESPONSE|NS_ERROR_NET|NS_ERROR_CONNECTION|connection (reset|closed)|응답 없음/i.test(n)) return "conn-drop";
    if (/보관본 없음/.test(n)) return "no-archive";
    return "error";
  }
  // 차단 화면 흔적이 있으면(상태가 200·429 여도) 차단이다 — Akamai 의 빈 확인 화면(Zara·Massimo Dutti·Oysho)이 200 으로 온다.
  const blockMark = [...mk].some((id) => (MARKERS.find((x) => x[0] === id) || [])[3] === "block");
  if (blockMark && (r.v === "blocked" || (ev.textLen || 0) < 600 || ev.status >= 400)) return "blocked";
  if (ev.status === 429) return "rate-limit";
  if (r.v === "blocked") return "blocked";
  if (ev.status === 404 || ev.status === 410 || ev.redirect === "home" || ev.redirect === "other-site") return "dead";
  const notFoundPage = mk.has("notfound") && /not found|404|doesn.?t exist|no longer/i.test(ev.title || "");
  if (kind === "listing" && Math.max(r.cards || 0, r.collector || 0) >= 5) return "ok";   // 상품이 보이면 지역·배송 문구는 무시
  if (kind !== "listing" && r.v === "comp") return "ok";
  if (mk.has("geo") || /^locale /.test(ev.redirect || "")) return "geo";
  if (mk.has("maintenance") && (ev.textLen || 0) < 3000) return "maintenance";
  if (mk.has("login") && (ev.textLen || 0) < 3000) return "login";
  if (kind === "listing") {
    const cards = Math.max(r.cards || 0, r.collector || 0);
    if (notFoundPage && cards < 3) return "dead";
    if (r.collector === 0 && (ev.imgLinks || 0) >= 12) return "selector";
    if (cards >= 5) return "ok";
    if ((ev.textLen || 0) < 1500 || mk.has("js-shell")) return "shell";
    return "no-cards";
  }
  if (notFoundPage) return "dead";
  return "no-comp";
}

// ── 유료 수집 서비스 시험 칸(외부 HTTP API 엔진) ──────────────────────────────
// 저장소에는 업체 이름·주소·키가 하나도 없다. 실행 때 저장소 비밀(SCRAPE_API_CONFIG)로만 들어온다.
// 설정은 JSON 객체 하나 또는 배열(여러 서비스를 한 번에 견줄 때):
//   {
//     "name": "trial-a",                          // 리포트 열 이름(ext:trial-a). 업체 이름일 필요 없음
//     "request": "https://<API 주소>?key={key}&url={url}",   // {url}=인코딩한 대상 주소 · {url_raw}=그대로 · {key}
//     "method": "GET",                            // GET | POST (기본 GET)
//     "headers": { "<헤더>": "{key}" },             // 선택
//     "params": { "<이름>": "<값>" },               // 선택 — request 주소에 쿼리로 덧붙임
//     "body": { "url": "{url_raw}" },             // 선택 — POST 본문(객체는 JSON, 문자열은 그대로)
//     "key": "<비밀 키>",
//     "html": "body" | "json:<점 경로>",           // 응답에서 페이지 HTML 을 꺼내는 곳(기본 body)
//     "upstreamStatus": "header:<이름>" | "json:<점 경로>",   // 선택 — 대상 사이트가 준 HTTP 상태
//     "success": { "status": [200], "notMatch": "<정규식>" },  // 선택 — 성공 판정(기본: 200 이고 본문 있음)
//     "timeoutSec": 120, "maxRequests": 100, "gapMs": 1000
//   }
export function loadExtConfigs(raw) {
  const out = { configs: [], problems: [] };
  if (!raw || !String(raw).trim()) return out;
  let v;
  try { v = JSON.parse(raw); } catch (e) { out.problems.push("SCRAPE_API_CONFIG 가 JSON 이 아님(내용은 출력하지 않음)"); return out; }
  const arr = Array.isArray(v) ? v : [v];
  arr.forEach((c, i) => {
    const label = c && typeof c.name === "string" && /^[\w.-]{1,30}$/.test(c.name) ? c.name : `svc${i + 1}`;
    if (!c || typeof c !== "object") { out.problems.push(`${label}: 객체가 아님`); return; }
    // https 만 받는다(키가 평문으로 다니지 않게). 시험용 가짜 서버(127.0.0.1·localhost)만 예외.
    if (typeof c.request !== "string" || !/^(https:\/\/|http:\/\/(127\.0\.0\.1|localhost)[:/])/i.test(c.request)) { out.problems.push(`${label}: request 는 https:// 로 시작해야 함`); return; }
    const carries = (s) => /\{url(_raw)?\}/.test(typeof s === "string" ? s : JSON.stringify(s || ""));
    if (!carries(c.request) && !carries(c.body) && !carries(c.params) && !carries(c.headers)) { out.problems.push(`${label}: {url} 자리표시가 어디에도 없음`); return; }
    const method = String(c.method || "GET").toUpperCase();
    if (!["GET", "POST"].includes(method)) { out.problems.push(`${label}: method 는 GET|POST`); return; }
    out.configs.push({
      name: label, request: c.request, method, headers: c.headers || {}, params: c.params || {}, body: c.body ?? null,
      key: c.key == null ? "" : String(c.key), html: String(c.html || "body"), upstreamStatus: String(c.upstreamStatus || ""),
      success: c.success || {}, timeoutSec: Math.min(300, Math.max(10, Number(c.timeoutSec) || 120)),
      maxRequests: Math.max(1, Number(c.maxRequests) || 100), gapMs: Math.max(0, Number(c.gapMs ?? 1000)),
    });
  });
  return out;
}

// 로그·리포트에서 가려야 할 값들(키 그 자체, 키가 들어간 헤더·쿼리 값, 요청 주소 틀)
export function secretsOf(cfg) {
  const s = new Set();
  if (cfg.key) s.add(cfg.key);
  const sub = (x) => String(x).split("{key}").join(cfg.key);
  for (const v of Object.values(cfg.headers || {})) if (String(v).includes("{key}") || /auth|key|token|secret/i.test(String(v))) s.add(sub(v));
  for (const [k, v] of Object.entries(cfg.params || {})) if (String(v).includes("{key}") || /key|token|secret|auth/i.test(k)) s.add(sub(v));
  try { const u = new URL(cfg.request.replace(/\{[a-z_]+\}/g, "x")); for (const [k, v] of u.searchParams) if (/key|token|secret|auth/i.test(k) && v !== "x") s.add(v); } catch (e) {}
  // 요청 주소의 호스트도 가린다(업체를 드러내지 않기 위해)
  try { s.add(new URL(cfg.request.replace(/\{[a-z_]+\}/g, "x")).hostname); } catch (e) {}
  return [...s].filter((x) => x && x.length >= 4);
}
export function redact(str, secrets) {
  let out = String(str == null ? "" : str);
  for (const s of secrets || []) if (s) out = out.split(s).join("***");
  return out;
}

const fill = (tpl, target, key) => String(tpl)
  .split("{url_raw}").join(target)
  .split("{url}").join(encodeURIComponent(target))
  .split("{key}").join(key);
function fillDeep(v, target, key) {
  if (v == null) return v;
  if (typeof v === "string") return fill(v, target, key);
  if (Array.isArray(v)) return v.map((x) => fillDeep(x, target, key));
  if (typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillDeep(x, target, key)]));
  return v;
}
export function buildExtRequest(cfg, target) {
  const u = new URL(fill(cfg.request, target, cfg.key));
  for (const [k, v] of Object.entries(cfg.params || {})) u.searchParams.set(k, fill(v, target, cfg.key));
  const headers = fillDeep(cfg.headers || {}, target, cfg.key);
  let body;
  if (cfg.method === "POST" && cfg.body != null) {
    body = typeof cfg.body === "string" ? fill(cfg.body, target, cfg.key) : JSON.stringify(fillDeep(cfg.body, target, cfg.key));
    if (typeof cfg.body !== "string" && !Object.keys(headers).some((h) => h.toLowerCase() === "content-type")) headers["Content-Type"] = "application/json";
  }
  return { url: u.href, init: { method: cfg.method, headers, ...(body != null ? { body } : {}) } };
}
const dig = (obj, path) => String(path || "").split(".").filter(Boolean).reduce((o, k) => (o == null ? o : o[k]), obj);
// 외부 API 응답 → { ok, apiStatus, upstream, html, note }
export function readExtResponse(cfg, apiStatus, bodyText, headerGet) {
  let html = String(bodyText || "");
  let json = null;
  if (/^json:/.test(cfg.html) || /^json:/.test(cfg.upstreamStatus)) { try { json = JSON.parse(bodyText); } catch (e) { json = null; } }
  if (/^json:/.test(cfg.html)) { const v = json ? dig(json, cfg.html.slice(5)) : null; html = typeof v === "string" ? v : ""; }
  let upstream = 0;
  if (/^header:/.test(cfg.upstreamStatus)) upstream = Number(headerGet(cfg.upstreamStatus.slice(7))) || 0;
  else if (/^json:/.test(cfg.upstreamStatus)) upstream = Number(json ? dig(json, cfg.upstreamStatus.slice(5)) : 0) || 0;
  const okStatus = Array.isArray(cfg.success.status) && cfg.success.status.length ? cfg.success.status.map(Number) : [200];
  let ok = okStatus.includes(apiStatus) && html.length > 0;
  let note = `API ${apiStatus}` + (upstream ? ` · 사이트 ${upstream}` : "") + ` · ${html.length}자`;
  if (ok && cfg.success.notMatch) {
    try { if (new RegExp(cfg.success.notMatch, "i").test(html)) { ok = false; note += " · 실패 문구 일치"; } } catch (e) {}
  }
  return { ok, apiStatus, upstream, html, note };
}
