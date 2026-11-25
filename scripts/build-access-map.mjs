#!/usr/bin/env node
// 접근 지도 만들기 — docs/access-map.md(사람용) · access-map.json(기계용)을 같은 사실로 만든다.
//
// 읽는 것(모두 저장소 안 — 네트워크 안 씀):
//   access-measure/inputs/        Render 의 브랜드·카테고리 목록, 프리페치 리포트 6일치, main 의 11/25 야간 리포트 스냅샷
//   try-engines-results-*.json    접근 지도 측정 실행(access-measure/RUNS.md)의 페이지별 결과와 근거
//   access-measure/verdicts.json  사람이 근거를 보고 내린 판정(상태·원인·고치는 법·메모). 숫자는 여기 적지 않고
//                                 위 두 곳에서 다시 센다 — 판정 파일에는 '왜'만 둔다.
// 판정 파일에 없는 브랜드는 규칙으로 정한다(autoListing/autoProduct) — 그 행의 근거 칸에 '규칙'이라고 적힌다.
//
// 실행: node scripts/build-access-map.mjs   (docs/access-map.md · access-map.json 을 새로 쓴다)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { causeOf as causeNow, identify as identifyNow, markersOf } from "./access-evidence.mjs";
// 이 실행부터 브라우저 쿠키를 그 페이지 주소의 것만 적었다(그 전 실행은 같은 창의 다른 사이트 쿠키가 섞였다).
const COOKIE_FIX_RUN = 45584347743;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IN = join(ROOT, "access-measure/inputs");
const J = (p) => JSON.parse(readFileSync(p, "utf8"));
const links = J(join(IN, "category-links.json"));
const blocked = J(join(IN, "blocked-brands.json"));
const audit = J(join(IN, "catalog-audit.json"));
const bc = J(join(IN, "browser-collect-report.json"));
const ebState = J(join(IN, "enrich-browser-state.json"));
const verdicts = existsSync(join(ROOT, "access-measure/verdicts.json")) ? J(join(ROOT, "access-measure/verdicts.json")) : {};
const prefetch = readdirSync(IN).filter((f) => /^prefetch-report-/.test(f)).sort().reverse().map((f) => J(join(IN, f)));
const CATS = ["tops", "sweatshirts", "shirts", "dresses", "pants"];
const BRANDS = Object.keys(links).sort((a, b) => a.localeCompare(b));

// ── 측정 실행 결과 모으기 ────────────────────────────────────────────
const runs = [];
for (const f of readdirSync(ROOT).filter((f) => /^try-engines-results-\d+\.json$/.test(f)).sort()) {
  try { const d = J(join(ROOT, f)); runs.push({ id: f.match(/\d+/)[0], ...d }); } catch (e) {}
}
const obs = new Map();         // url → engine → [관측]
const kindOfUrl = new Map();   // url → listing|product
const brandOfUrl = new Map();
const catalogs = new Map();    // brand → 카탈로그 훑기(URL 별 저장 수)
for (const r of runs) {
  for (const t of r.targets || []) { kindOfUrl.set(t.url, t.kind); brandOfUrl.set(t.url, t.brand); }
  for (const [eng, byUrl] of Object.entries(r.results || {})) {
    for (const [url, x] of Object.entries(byUrl)) {
      if (!x || x.v === "skip") continue;
      const kind = kindOfUrl.get(url) || "product";
      const ev = x.ev || {};
      const o = { run: r.id, ip: (r.meta || {}).ip || "", at: ((r.meta || {}).at || r.at || "").slice(0, 16), v: x.v, status: ev.status || 0,
        by: x.who ? x.who.by : "", conf: x.who ? x.who.confidence : "", signals: x.who ? x.who.signals || [] : [],
        n: x.collector != null ? x.collector : x.cards, title: ev.title || "", redirect: ev.redirect || "", finalUrl: ev.finalUrl || "",
        markers: ev.markers || [], note: x.note || "", comp: x.comp || "", textLen: ev.textLen, imgLinks: ev.imgLinks, cookies: ev.cookies || [], headers: ev.headers || {} };
      // 측정 뒤에 고친 판정 규칙도 반영되게, 저장된 근거로 원인을 다시 정한다.
      const mk = [...new Set([...o.markers, ...markersOf("", o.title)])];
      o.cause = causeNow({ v: x.v, note: x.note, cards: x.cards, collector: x.collector, ev: { ...ev, markers: mk } }, kind);
      // 차단 주체도 오늘의 규칙으로 다시. 브라우저 엔진의 옛 실행 쿠키는 섞였을 수 있어 뺀다.
      if (o.cause === "blocked" || o.cause === "rate-limit") {
        const trustCookies = eng === "impit" || eng === "site-api" || Number(r.id) >= COOKIE_FIX_RUN;
        const who = identifyNow({ ...ev, markers: mk, cookies: trustCookies ? ev.cookies || [] : [] }, true);
        Object.assign(o, { by: who.by, conf: who.confidence, signals: who.vendors.map((v) => `${v.vendor}: ${v.signals.join(", ")}`).slice(0, 5) });
        if (!trustCookies) o.cookies = [];
      }
      if (!obs.has(url)) obs.set(url, {});
      (obs.get(url)[eng] = obs.get(url)[eng] || []).push(o);
    }
  }
  for (const c of r.catalogs || []) if (c && !c.missing && c.bySrc) catalogs.set(c.brand, { ...c, run: r.id });
}

// ── 야간 리포트(11/25 main)에서 브랜드별 사실 ──────────────────────────
const enrichMd = readFileSync(join(IN, "enrich-comp-report.md"), "utf8");
const enrichPaths = new Map();
for (const line of enrichMd.split("\n")) {
  const m = line.match(/^\| (.+?) \| (✅|—) \| .+? \| .+? \| .+? \| (.*) \|$/);
  if (m && m[3].trim()) enrichPaths.set(m[1].trim(), m[3].trim());
}
const ebMd = readFileSync(join(IN, "enrich-browser-report.md"), "utf8");
const enrichBrowser = new Map();
for (const line of ebMd.split("\n")) {
  const m = line.match(/^\| (.+?) \| (firefox|chromium|playwright) \| (\d+) \| (\d+) \| \*\*(\d+)\*\* \| (\d+) \| (\d+) \| (\d+) \| (\d+) \|$/);
  if (m) enrichBrowser.set(m[1], { engine: m[2], tried: +m[4], filled: +m[5], none: +m[6], shell: +m[7], blocked: +m[8] });
}
const chromiumBlocked = new Map();
for (const v of Object.values(ebState.blocked || {})) for (const [eng, x] of Object.entries(v)) {
  if (!chromiumBlocked.has(x.brand)) chromiumBlocked.set(x.brand, {});
  chromiumBlocked.get(x.brand)[eng] = `${x.at}${x.suspect ? "(의심)" : ""}`;
}
const groupOf = (b) => blocked.brands.includes(b) ? "extension" : blocked.browser.includes(b) ? "browser" : "server";
const GROUP_KO = { server: "서버(Render)", browser: "헤드리스(Actions)", extension: "크롬 확장(집 PC)" };
const field = new Map(audit.fieldCoverage.map((x) => [x.brand, x]));
const extAge = new Map(audit.extension.map((x) => [x.name, x]));
const bcBy = new Map(bc.results.map((x) => [x.brand, x]));
const pfHist = (b) => prefetch.map((r) => { const x = r.results.find((y) => y.name === b); return x ? { when: r.when.slice(5, 10), ok: x.ok, collected: x.collected, stored: x.stored } : null; }).filter(Boolean);
const urlsOf = (b) => { const out = []; for (const c of CATS) for (const u of (links[b] || {})[c] || []) if (!out.some((x) => x.url === u)) out.push({ url: u, cat: c }); return out; };
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };

// 한 URL 의 측정 요약(엔진별 성공/잰 수)
function urlSummary(url) {
  const kind = kindOfUrl.get(url) || "product";
  const out = {};
  for (const [eng, arr] of Object.entries(obs.get(url) || {})) {
    out[eng] = {
      ok: arr.filter((x) => x.cause === "ok").length, n: arr.length,
      runs: [...new Set(arr.map((x) => x.run))], ips: [...new Set(arr.map((x) => x.ip).filter(Boolean))],
      causes: [...new Set(arr.map((x) => x.cause))], status: [...new Set(arr.map((x) => x.status).filter(Boolean))],
      by: [...new Set(arr.map((x) => x.by).filter((b) => b && b !== "알 수 없음"))], conf: [...new Set(arr.map((x) => x.conf).filter(Boolean))],
      counts: arr.map((x) => x.n).filter((n) => n != null), title: (arr.find((x) => x.title) || {}).title || "",
      redirect: [...new Set(arr.map((x) => x.redirect).filter(Boolean))], finalUrl: (arr.find((x) => x.finalUrl) || {}).finalUrl || "",
      signals: [...new Set(arr.flatMap((x) => x.signals || []))].slice(0, 4), comp: (arr.find((x) => x.comp) || {}).comp || "",
      kind,
    };
  }
  return out;
}
const ENG_KO = { impit: "impit(브라우저 없는 fetch)", playwright: "크롬(헤드리스)", firefox: "파이어폭스", server: "서버(Render)", "site-api": "사이트 JSON", wayback: "웹 아카이브", camoufox: "camoufox", "crawlee-firefox": "crawlee-firefox" };
const cellOf = (s) => !s ? "–" : `${s.ok}/${s.n}` + (s.ok < s.n ? ` ${s.causes.filter((c) => c !== "ok").join("·")}${s.status.filter((x) => x >= 400).length ? " " + s.status.filter((x) => x >= 400).join("/") : ""}` : "");

// 브랜드 → 측정 요약(목록·상품)
function measured(b, kind) {
  const urls = [...obs.keys()].filter((u) => brandOfUrl.get(u) === b && (kindOfUrl.get(u) || "product") === kind);
  const per = urls.map((u) => ({ url: u, cat: (urlsOf(b).find((x) => x.url === u) || {}).cat || "", s: urlSummary(u) }));
  const eng = {};
  for (const p of per) for (const [e, s] of Object.entries(p.s)) {
    eng[e] = eng[e] || { ok: 0, n: 0, urlsOk: 0, urls: 0, runs: new Set(), ips: new Set(), causes: new Set(), status: new Set(), by: new Set() };
    const g = eng[e];
    g.ok += s.ok; g.n += s.n; g.urls++; if (s.ok === s.n) g.urlsOk++;
    s.runs.forEach((x) => g.runs.add(x)); s.ips.forEach((x) => g.ips.add(x)); s.causes.forEach((x) => g.causes.add(x)); s.status.forEach((x) => g.status.add(x)); s.by.forEach((x) => g.by.add(x));
  }
  for (const g of Object.values(eng)) for (const k of ["runs", "ips", "causes", "status", "by"]) g[k] = [...g[k]];
  return { urls: per, eng };
}

// 차단 주체 — 그 브랜드의 측정 전부에서(높음 > 중간 > 낮음)
function blockerOf(b) {
  const rank = { "높음": 3, "중간": 2, "낮음": 1 };
  let best = null;
  for (const [u, o] of obs) {
    if (brandOfUrl.get(u) !== b) continue;
    for (const [eng, arr] of Object.entries(o)) for (const x of arr) {
      if (x.cause !== "blocked" && x.cause !== "rate-limit") continue;
      // 서버 경고의 429 는 서버가 쓰는 리더 프록시의 한도, 사이트 JSON·아카이브의 404 는 '없음' — 사이트의 차단 근거가 아니다.
      if (["server", "site-api", "wayback"].includes(eng)) continue;
      const by = x.by || "알 수 없음";
      const r = rank[x.conf] || 0;
      if (!best || r > best.r) best = { by, conf: x.conf || "-", r, signals: x.signals, title: x.title, status: x.status, eng, url: u, cookies: x.cookies.slice(0, 8), headers: x.headers };
    }
  }
  return best;
}

// ── 판정 ──────────────────────────────────────────────────────────
const L_STATUS = {
  works: "✅ 된다",
  "home-only": "🏠 집 IP(확장)에서만",
  partial: "🟠 일부만",
  blocked: "⛔ 어디서도 막힘",
  "bad-url": "🔗 URL 이 틀림·죽음",
  misread: "🔧 열리는데 잘못 읽음",
};
const P_STATUS = { ...L_STATUS, "not-published": "📭 사이트가 혼용률을 안 적음" };
const TIER = {
  0: "0 이미 정상",
  1: "1 무료 변경(우리 쪽)",
  2: "2 집 IP 필요(확장)",
  3: "3 유료 차단 해제 서비스",
  4: "4 새 URL 필요(담당자)",
};

function autoListing(b) {
  const g = groupOf(b);
  const pf = pfHist(b);
  const bcr = bcBy.get(b);
  const cat = catalogs.get(b);
  const total = (field.get(b) || {}).total || 0;
  if (g === "server") {
    const last = pf[0];
    if (last && last.ok && last.collected >= 50) return { status: "works", tier: 0, cause: "", why: `서버 프리페치 11/25 ${last.collected}개(6일 ${pf.map((x) => x.collected).join("·")})`, basis: "야간 리포트(규칙)" };
  }
  if (g === "browser" && bcr && bcr.perUrl.every((u) => u.count > 0)) return { status: "works", tier: 0, cause: "", why: `헤드리스 11/25 ${bcr.collected}개 · URL ${bcr.perUrl.map((u) => u.count).join("·")}`, basis: "야간 리포트(규칙)" };
  if (g === "extension" && cat && Object.keys(cat.bySrc).length >= urlsOf(b).length) return { status: "home-only", tier: 2, cause: "datacenter-block", why: `확장이 ${total}개 저장`, basis: "카탈로그(규칙)" };
  return { status: "partial", tier: 1, cause: "", why: "규칙으로 못 정함 — 판정 파일 필요", basis: "규칙" };
}
function autoProduct(b) {
  const f = field.get(b) || {};
  const pct = f.total ? Math.round((f.comp / f.total) * 100) : 0;
  if (pct >= 85) return { status: "works", tier: 0, cause: "", why: `혼용률 ${f.comp}/${f.total}(${pct}%)`, basis: "야간 리포트(규칙)" };
  return { status: "partial", tier: 1, cause: "", why: `혼용률 ${pct}% — 판정 파일 필요`, basis: "규칙" };
}

// ── 만들기 ─────────────────────────────────────────────────────────
const out = [];
for (const b of BRANDS) {
  const g = groupOf(b);
  const f = field.get(b) || { total: 0, comp: 0 };
  const v = verdicts[b] || {};
  const L = { ...autoListing(b), ...(v.listing || {}) };
  const P = { ...autoProduct(b), ...(v.product || {}) };
  if (v.listing) L.basis = v.listing.basis || "측정·판정";
  if (v.product) P.basis = v.product.basis || "측정·판정";
  const mL = measured(b, "listing"), mP = measured(b, "product");
  const bl = blockerOf(b);
  const pf = pfHist(b), bcr = bcBy.get(b), cat = catalogs.get(b), ext = extAge.get(b);
  out.push({
    brand: b, group: g, domain: host((urlsOf(b)[0] || {}).url), products: f.total, comp: { with: f.comp, total: f.total, pct: f.total ? Math.round((f.comp / f.total) * 100) : 0 },
    categoryUrls: urlsOf(b).length,
    nightly: {
      prefetch: g === "server" ? pf : undefined,
      headless: bcr ? { collected: bcr.collected, perUrl: bcr.perUrl.map((u) => ({ url: u.url, count: u.count, note: u.note || "" })) } : undefined,
      extension: g === "extension" ? { ageHours: ext ? Math.round(ext.age) : null, items: ext ? ext.items : null, bySrc: cat ? cat.bySrc : null } : undefined,
      enrichFetch: enrichPaths.get(b) || "", enrichBrowser: enrichBrowser.get(b) || null, chromiumBlockedSince: chromiumBlocked.get(b) || null,
    },
    listing: { ...L, label: L_STATUS[L.status] || L.status, tierLabel: TIER[L.tier] ?? "", measured: mL.eng, urls: mL.urls.map((x) => ({ url: x.url, cat: x.cat, engines: Object.fromEntries(Object.entries(x.s).map(([e, s]) => [e, cellOf(s)])) })) },
    product: { ...P, label: P_STATUS[P.status] || P.status, tierLabel: TIER[P.tier] ?? "", measured: mP.eng, urls: mP.urls.map((x) => ({ url: x.url, engines: Object.fromEntries(Object.entries(x.s).map(([e, s]) => [e, cellOf(s)])) })) },
    blocker: bl ? { by: bl.by, confidence: bl.conf, signals: bl.signals, title: bl.title, status: bl.status, engine: bl.eng, url: bl.url, cookies: bl.cookies, headers: bl.headers } : null,
  });
}

// ── JSON ──────────────────────────────────────────────────────────
const RUNS_META = runs.map((r) => ({ id: r.id, at: ((r.meta || {}).at || r.at || "").slice(0, 16), ip: (r.meta || {}).ip || "", engines: r.engines, targets: (r.targets || []).length, runInfo: r.runInfo }));
writeFileSync(join(ROOT, "access-map.json"), JSON.stringify({
  generated: new Date().toISOString(), note: "docs/access-map.md 와 같은 사실. listing=목록(카테고리) 페이지, product=상품 페이지. basis 가 '규칙'인 행은 사람이 따로 보지 않은 판정.",
  vocabulary: { listing: L_STATUS, product: P_STATUS, tier: TIER }, runs: RUNS_META, brands: out,
}, null, 1) + "\n");

// ── 마크다운 ──────────────────────────────────────────────────────
const sum = (arr) => arr.reduce((s, x) => s + x.products, 0);
const esc = (s) => String(s == null ? "" : s).replace(/\|/g, "/").replace(/\n/g, " ");
let md = readFileSync(join(ROOT, "access-measure/map-head.md"), "utf8");
md = md.replace("{{GENERATED}}", new Date().toISOString().slice(0, 16) + "Z").replace("{{RUNS}}", String(runs.length));

// 요약
const tbl = (key, VOC) => {
  let s = `| 상태 | 브랜드 | 상품(카탈로그) | 브랜드 이름 |\n|---|---:|---:|---|\n`;
  for (const k of Object.keys(VOC)) {
    const rows = out.filter((x) => x[key].status === k);
    if (!rows.length) continue;
    s += `| ${VOC[k]} | ${rows.length} | ${sum(rows).toLocaleString("en-US")} | ${rows.map((x) => x.brand).join(", ")} |\n`;
  }
  return s + `| **합계** | **${out.length}** | **${sum(out).toLocaleString("en-US")}** | |\n`;
};
const prodMissing = out.reduce((s, x) => s + (x.comp.total - x.comp.with), 0);
md = md.replace("{{SUMMARY_LISTING}}", tbl("listing", L_STATUS)).replace("{{SUMMARY_PRODUCT}}", tbl("product", P_STATUS))
  .replace("{{COMP_TOTAL}}", `${out.reduce((s, x) => s + x.comp.with, 0).toLocaleString("en-US")}/${sum(out).toLocaleString("en-US")}`)
  .replace("{{COMP_MISSING}}", prodMissing.toLocaleString("en-US"));

// 차단 주체별
{
  const by = new Map();
  for (const x of out) if (x.blocker) { const k = x.blocker.by; if (!by.has(k)) by.set(k, []); by.get(k).push(x); }
  let s = `| 차단 주체 | 근거 강도 | 브랜드 | 그 브랜드의 대표 근거(측정 원본) |\n|---|---|---|---|\n`;
  for (const [k, xs] of [...by.entries()].sort((a, b) => b[1].length - a[1].length)) {
    for (const x of xs) s += `| ${k} | ${x.blocker.confidence} | ${x.brand} | HTTP ${x.blocker.status} · 제목 "${esc(x.blocker.title).slice(0, 40)}" · ${esc(x.blocker.signals.join(" / ")).slice(0, 200)} |\n`;
  }
  md = md.replace("{{BLOCKERS}}", s);
}

// 상태별 브랜드 표
function section(key, VOC) {
  let s = "";
  for (const k of Object.keys(VOC)) {
    const rows = out.filter((x) => x[key].status === k);
    if (!rows.length) continue;
    s += `\n### ${VOC[k]} — ${rows.length}개 브랜드 · 상품 ${sum(rows).toLocaleString("en-US")}개\n\n`;
    if (k === "works") {
      s += `| 브랜드 | 담당 | 상품 | 혼용률 | 근거 |\n|---|---|---:|---:|---|\n`;
      for (const x of rows) s += `| ${x.brand} | ${GROUP_KO[x.group]} | ${x.products} | ${x.comp.pct}% | ${esc(x[key].why)} · ${x[key].basis} |\n`;
      continue;
    }
    s += `| 브랜드 | 담당 | 상품 | 원인 | 근거(측정) | 고치는 법 | 단계 | 근거 종류 |\n|---|---|---:|---|---|---|---|---|\n`;
    for (const x of rows) {
      const m = x[key].measured || {};
      const meas = Object.entries(m).map(([e, g]) => `${e} ${g.ok}/${g.n}${g.ok < g.n ? "(" + g.causes.filter((c) => c !== "ok").join("·") + (g.status.filter((t) => t >= 400).length ? " " + g.status.filter((t) => t >= 400).join("/") : "") + ")" : ""}`).join(" · ");
      const runsN = new Set(Object.values(m).flatMap((g) => g.runs)).size;
      s += `| ${x.brand} | ${GROUP_KO[x.group]} | ${x.products} | ${esc(x[key].cause)} | ${esc(x[key].why)}${meas ? ` — 오늘 ${meas}` : ""} | ${esc(x[key].fix || "")} | ${x[key].tierLabel} | ${x[key].basis}${runsN ? ` · 실행 ${runsN}회` : ""} |\n`;
    }
  }
  return s;
}
md = md.replace("{{LISTING_SECTIONS}}", section("listing", L_STATUS)).replace("{{PRODUCT_SECTIONS}}", section("product", P_STATUS));

// URL 단위 근거(막힌·이상한 목록 URL 만)
{
  let s = `| 브랜드 | 카테고리 | URL | ${["impit", "playwright", "firefox", "server"].map((e) => ENG_KO[e]).join(" | ")} |\n|---|---|---|---|---|---|---|\n`;
  for (const x of out) for (const u of x.listing.urls) {
    const cells = ["impit", "playwright", "firefox", "server"].map((e) => u.engines[e] || "–");
    if (cells.every((c) => c === "–" || /^(\d+)\/\1$/.test(c))) continue;
    s += `| ${x.brand} | ${u.cat} | ${u.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 80)} | ${cells.join(" | ")} |\n`;
  }
  md = md.replace("{{URL_TABLE}}", s);
}
// 틀린 URL
{
  let s = "";
  for (const x of out) for (const w of (verdicts[x.brand] || {}).badUrls || []) s += `| ${x.brand} | ${esc(w.url)} | ${esc(w.why)} | ${esc(w.suggest || "담당자가 사이트에서 새 주소 확인")} |\n`;
  md = md.replace("{{BAD_URLS}}", s ? `| 브랜드 | 지금 URL | 근거 | 바꿀 것 |\n|---|---|---|---|\n` + s : "(없음)\n");
}
// 실행 목록
{
  let s = `| 실행 | 시각(UTC) | 나가는 IP | 엔진 | 대상 수 |\n|---|---|---|---|---:|\n`;
  for (const r of RUNS_META) s += `| ${r.id} | ${r.at} | ${r.ip} | ${(r.engines || []).join(", ") || "(카탈로그 훑기)"} | ${r.targets} |\n`;
  md = md.replace("{{RUN_TABLE}}", s);
}
writeFileSync(join(ROOT, "docs/access-map.md"), md);
console.log(`브랜드 ${out.length} · 실행 ${runs.length} · 판정 파일 ${Object.keys(verdicts).length}개 브랜드`);
for (const k of Object.keys(L_STATUS)) console.log(`  목록 ${k}: ${out.filter((x) => x.listing.status === k).length}`);
for (const k of Object.keys(P_STATUS)) console.log(`  상품 ${k}: ${out.filter((x) => x.product.status === k).length}`);
