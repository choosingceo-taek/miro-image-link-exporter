#!/usr/bin/env node
// 저장된 혼용률 점검 — 읽기만 한다. 값은 하나도 고치거나 지우지 않는다.
//
// 왜 있나: 2026-11-24 Zara 면 티셔츠가 "Wool 100% / Cotton 100%" 로 읽힌 일(숨은 메뉴의 기획전 이름
// "100% WOOL | CASHMERE" 가 진짜 소재와 두 줄로 묶임)은 추출기를 고쳐 앞으로는 막았다
// (docs/firefox-enrich-checks.md). 하지만 예전 추출기는 몇 달 동안 Worker·야간 스크립트·확장에서
// 돌았고, 그때 저장된 값은 그대로 남아 있다. 혼용률은 엑셀로 바로 나가므로, 틀린 값은 빈 값보다
// 나쁘다. 그래서 저장된 값 전부를 '틀린 값의 모양(시그니처)'으로 훑어 어디가 의심스러운지 센다.
//
// 보는 값: 팀이 실제로 보는 값 — 카탈로그 상품의 comp 가 있으면 그것, 없으면 오버레이(comp:<site>)의
// comp(shared/product-core.js 의 mergeOverlay 와 같은 순서). 어디서 왔는지(카탈로그/오버레이,
// 오버레이면 via=wayback 여부)도 함께 남긴다.
//
// 시그니처(자세한 기준은 아래 각 함수 주석):
//   A  Zara 모양 — 두 줄(또는 예전 한 줄 200%)인데 줄마다 섬유 하나 100% 이고 섬유가 서로 다름
//   B  반복 조각 — 한 브랜드의 여러 줄 혼용률에서 같은 줄이 큰 비율로 되풀이됨(메뉴·배너에서 온 조각)
//   C  한 값이 독차지 — 한 브랜드 상품의 60% 이상이 똑같은 혼용률(상품 30개 이상) — '확인'이지 '틀림' 아님
//   D  상품명과 어긋남 — 이름의 섬유가 혼용률에 없음(enrich-comp-browser.mjs 의 ⚠ 검사 nameCheck 를 그대로 씀)
//   E  불가능한 값 — 오늘의 validComp 가 거절하는 값, 섬유가 아닌 낱말, [object …]
//   F  상품이 아닌 주소(카테고리·목록)에 저장된 혼용률
//
// env: WORKER_URL, WORKER_TOKEN, BRANDS(쉼표 — 이 브랜드만), VERIFY_PER(검증 표본: 브랜드당, 기본 4),
//      VERIFY_BRANDS(시그니처당 검증할 브랜드 수, 기본 5), LOFT_N(Loft 표본 수, 기본 30)
//      VERIFY=<try-engines 결과 JSON> — Worker 를 다시 읽지 않고, 앞 단계가 남긴 stored-comp-audit.json 과
//      실제 페이지를 다시 읽은 결과를 견줘 리포트에 '확인됨/못 읽음'을 붙인다.
// 출력: stored-comp-audit.json(기계용) · stored-comp-audit-raw.md(사람용 원자료) · stored-comp-verify-urls.txt
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const SELF = fileURLToPath(import.meta.url);
const ROOT = join(dirname(SELF), "..");

// ── 규칙은 한 벌만: worker 의 validComp·FIBRES, 크롬 보강 리포트의 nameCheck ───────────
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const cut = (src, a, b, what) => {
  const i = src.indexOf(a), j = src.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error(`${what} 블록을 찾지 못함: ${a}`);
  return src.slice(i, j);
};
export const { validComp } = new Function(
  cut(workerSrc, "const COMP_ITEM_RX", "// ── 페이지 HTML 전체에서 혼용률", "worker") + "\n return { validComp };")();
const FIBRES = new Function(cut(workerSrc, "const FIBRES = {", "function titleCase", "worker") + "\n return FIBRES;")();
const browserSrc = readFileSync(join(ROOT, "scripts/enrich-comp-browser.mjs"), "utf8");
const nameCheck = new Function(
  cut(browserSrc, "// ── 상품명·혼용률 대조 시작", "// ── 상품명·혼용률 대조 끝", "enrich-comp-browser") + "\n return nameCheck;")();

// 섬유로 인정하는 이름 — 추출기가 내는 대표 이름(FIBRES 의 값) + 사이트가 직접 적는 흔한 이름.
// 여기에 없는 낱말("Shell 100%", "Body 100%")은 섬유가 아니라 부위·문구가 섬유 자리에 들어간 것이다.
const FIBRE_NAMES = new Set([...Object.values(FIBRES), "Spandex", "Rayon", "Polyamide", "Lycra", "Tencel", "Metallic",
  "Metal", "Lurex", "Other", "Others", "Other Fibers", "Other Fibres", "Down", "Feather", "Feathers", "Elastodiene",
  "Elastomultiester", "Polypropylene", "Polyacrylic", "Silver", "Organic Cotton", "Recycled Polyester", "Merino Wool",
  "Recycled Nylon", "Pima Cotton", "Lambswool", "Yak", "Camel", "Vicuna", "Cashmere", "Polyethylene", "Pvc", "Rubber",
  "Suede", "Spandex Elastane", "Ecovero Viscose", "Modacrylic", "Wool Blend", "Flax", "Leather"]
  .map((s) => s.toLowerCase()));

// ── 값 다루기 ─────────────────────────────────────────────────────
// 예전 저장 사고로 '[object Object]' 가 남은 값은 화면에서 빈 값으로 보인다(product-core 의 cleanVal).
export const cleanVal = (v) => { const t = String(v || "").trim(); return t.includes("[object") ? "" : t; };
// 혼용률 → 줄 목록 → 항목 [{fib, pct}] (읽을 수 없는 항목은 fib=원문, pct=NaN)
export function parseComp(s) {
  return String(s || "").split("\n").map((l) => l.trim()).filter(Boolean).map((line) =>
    line.split(/\s*\/\s*/).filter(Boolean).map((p) => {
      const m = p.match(/^(.*?)\s*(\d{1,4}(?:\.\d+)?)\s*%$/);
      return m ? { fib: m[1].trim(), pct: Number(m[2]) } : { fib: p.trim(), pct: NaN };
    }));
}
const lineKey = (items) => items.map((c) => `${c.fib} ${c.pct}%`).sort().join(" / ").toLowerCase();
// 같은 혼용률인가 — 줄·항목 순서는 무시(enrich-comp.mjs 의 sameComp 와 같은 정규화)
export const normComp = (s) => String(s || "").toLowerCase().split(/\s*\/\s*|\n/).map((t) => t.trim()).filter(Boolean).sort().join("/");
export const sameComp = (a, b) => !!a && normComp(a) === normComp(b);

// A. Zara 모양: 줄이 둘 이상이고(또는 예전 저장분처럼 한 줄에 합 200%), 줄(항목)마다 섬유 하나가 100%,
//    그 섬유들이 서로 다르다. 진짜 겉감 100% 면 + 안감 100% 폴리도 이 모양이라 '의심'일 뿐이다 —
//    다만 티셔츠·니트처럼 안감이 없는 옷에서 나오면 거의 틀린 값이다(리포트는 상품명과 함께 보인다).
export function sigA(comp) {
  const lines = parseComp(comp);
  let parts;
  if (lines.length >= 2) {
    if (!lines.every((l) => l.length === 1)) return false;
    parts = lines.map((l) => l[0]);
  } else if (lines.length === 1 && lines[0].length >= 2) {
    parts = lines[0];   // "Wool 100% / Cotton 100%" 한 줄(합 200 — validComp 가 예전 저장분으로 인정)
  } else return false;
  if (!parts.every((c) => c.pct === 100)) return false;
  return new Set(parts.map((c) => c.fib.toLowerCase())).size === parts.length;
}

// 흔한 안감 — 반복 조각이 이것이면 '메뉴 조각'이 아니라 진짜 안감일 공산이 크다.
const LINING_RX = /^(polyester|viscose|acetate|cupro|nylon|polyamide) 100%$/i;

// B. 반복 조각: 한 브랜드에서 여러 줄 혼용률(2줄 이상)이 MIN_MULTI 개 이상이고, 그중 같은 줄이
//    SHARE 이상(그리고 MIN_HITS 개 이상)에서 되풀이되면 그 줄을 '반복 조각'으로 본다.
//    상품마다 달라야 할 소재 사이에 늘 같은 줄이 끼어 있다 = 상품이 아니라 페이지 틀(메뉴·배너·바닥글)에서
//    왔을 가능성. 다만 흔한 안감(폴리 100% 등)이면 진짜 안감일 수 있어 따로 표시한다.
export const B_RULE = { MIN_MULTI: 5, MIN_HITS: 3, SHARE: 0.5 };
export function sigB(items) {
  const multi = items.filter((p) => parseComp(p.comp).length >= 2);
  if (multi.length < B_RULE.MIN_MULTI) return [];
  const cnt = new Map();
  for (const p of multi) {
    const seen = new Set();
    for (const l of parseComp(p.comp)) {
      const k = l.map((c) => `${c.fib} ${c.pct}%`).join(" / ");
      const kk = lineKey(l);
      if (seen.has(kk)) continue;
      seen.add(kk);
      const e = cnt.get(kk) || { line: k, n: 0, partners: new Set(), urls: [] };
      e.n++;
      for (const o of parseComp(p.comp)) if (lineKey(o) !== kk) e.partners.add(lineKey(o));
      e.urls.push(p.url);
      cnt.set(kk, e);
    }
  }
  const out = [];
  for (const e of cnt.values()) {
    const share = e.n / multi.length;
    if (e.n >= B_RULE.MIN_HITS && share >= B_RULE.SHARE && e.partners.size >= 2) {
      out.push({ line: e.line, n: e.n, multi: multi.length, share, partners: e.partners.size,
        lining: LINING_RX.test(e.line), urls: e.urls });
    }
  }
  return out.sort((a, z) => z.n - a.n);
}

// C. 한 값이 독차지: 혼용률이 있는 상품이 C_RULE.MIN 개 이상인 브랜드에서 똑같은 값이 SHARE 이상.
//    청바지·티셔츠 브랜드라면 그럴 수 있다 — '틀림'이 아니라 '확인'.
export const C_RULE = { MIN: 30, SHARE: 0.6 };
export function sigC(items) {
  const withComp = items.filter((p) => p.comp);
  if (withComp.length < C_RULE.MIN) return null;
  const cnt = new Map();
  for (const p of withComp) { const k = normComp(p.comp); const e = cnt.get(k) || { comp: p.comp, n: 0 }; e.n++; cnt.set(k, e); }
  const top = [...cnt.values()].sort((a, z) => z.n - a.n)[0];
  const share = top.n / withComp.length;
  return share >= C_RULE.SHARE ? { comp: top.comp, n: top.n, of: withComp.length, share } : null;
}

// D. 상품명과 어긋남 — nameCheck(⚠ 검사)의 이름 관련 지적만(‘두 줄’은 A·B 에서 따로 본다).
export function sigD(name, comp) {
  const s = nameCheck(name, comp);
  if (!s) return [];
  return s.replace(/^⚠\s*/, "").split(" · ").filter((x) => x && x !== "두 줄");
}

// E. 불가능한 값 — 이유를 하나 고른다. 빈 배열이면 문제없음.
export function sigE(raw) {
  const t = String(raw || "").trim();
  if (!t) return [];
  const why = [];
  if (t.includes("[object")) return ["[object …] (저장 사고 흔적)"];
  const lines = parseComp(t);
  if (lines.length > 2) why.push(`줄이 ${lines.length}개`);
  for (const l of lines) {
    if (l.some((c) => !Number.isFinite(c.pct))) { why.push("‘섬유 NN%’ 꼴이 아닌 조각"); continue; }
    if (l.some((c) => c.pct > 100)) why.push("100% 넘는 항목");
    if (l.some((c) => c.pct <= 0)) why.push("0% 항목");
    const sum = l.reduce((n, c) => n + c.pct, 0);
    if (!((sum >= 95 && sum <= 105) || (lines.length === 1 && sum >= 190 && sum <= 210))) why.push(`합이 ${Math.round(sum)}%`);
    const bad = l.filter((c) => !FIBRE_NAMES.has(c.fib.toLowerCase()));
    if (bad.length) why.push(`섬유가 아닌 낱말: ${bad.map((c) => c.fib).join(", ")}`);
  }
  if (!why.length && !validComp(t)) why.push("validComp 가 거절(형식)");
  return [...new Set(why)];
}

// F. 상품 주소가 아닌 곳(카테고리·목록)에 저장된 혼용률. 목록 페이지에는 여러 상품의 소재가 섞여 있다.
const NON_PRODUCT_RX = /\/(?:c|category|categories|collections?|shop-all[^/]*|new-arrivals?)(?:\/|$)|\/cat[a-z]?\d{4,}\/?$/i;
export function sigF(url) {
  let u; try { u = new URL(url); } catch (e) { return false; }
  if (/\/products?\//i.test(u.pathname)) return false;
  return NON_PRODUCT_RX.test(u.pathname);
}

// 한 브랜드의 상품 목록(팀이 보는 값으로 합친 것)을 시그니처별로 나눈다.
export function analyzeBrand(items) {
  const withComp = items.filter((p) => p.comp || p.raw);
  const r = { A: [], B: [], C: null, D: [], E: [], F: [] };
  for (const p of withComp) {
    if (p.comp && sigA(p.comp)) r.A.push(p);
    if (p.comp) { const d = sigD(p.name, p.comp); if (d.length) r.D.push({ ...p, why: d }); }
    const e = sigE(p.raw || p.comp);
    if (e.length) r.E.push({ ...p, why: e });
    if (p.comp && sigF(p.url)) r.F.push(p);
  }
  r.B = sigB(withComp.filter((p) => p.comp));
  r.C = sigC(withComp.filter((p) => p.comp));
  return r;
}

// 상품URL 표기가 조금씩 달라도 같은 상품으로(product-core 의 urlKey)
const urlKey = (u) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/+$/, "")).toLowerCase(); } catch (e) { return ""; } };

// 카탈로그 상품 + 오버레이 → 팀이 보는 값. mergeOverlay 와 같은 순서(카탈로그 값 우선).
export function shownItems(catItems, overlay) {
  const ov = new Map();
  for (const [u, o] of Object.entries(overlay || {})) if (o) ov.set(urlKey(u), o);
  return (catItems || []).filter((p) => p && p.productUrl).map((p) => {
    const o = ov.get(urlKey(p.productUrl)) || {};
    const catRaw = String(p.comp || "").trim(), ovRaw = String(o.comp || "").trim();
    const raw = catRaw || ovRaw;
    return {
      name: String(p.name || ""), url: p.productUrl, raw,
      comp: cleanVal(raw),
      src: catRaw ? "catalog" : ovRaw ? "overlay" : "",
      via: catRaw ? "" : String(o.via || ""), wd: catRaw ? "" : String(o.wd || ""),
      none: !!(o.none && !raw), nv: String(o.nv || ""),
      // 카탈로그 값이 오버레이 값을 가린 경우(둘이 다름) — 화면에는 카탈로그 값이 나간다
      hidden: catRaw && ovRaw && !sameComp(cleanVal(catRaw), cleanVal(ovRaw)) ? ovRaw : "",
    };
  });
}

async function scan() {
  const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
  const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
  const tok = "&token=" + encodeURIComponent(TOKEN);
  const normBrand = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
  const BRANDS = String(process.env.BRANDS || "").split(",").map(normBrand).filter(Boolean);
  const VERIFY_PER = Math.max(1, Number(process.env.VERIFY_PER) || 4);
  const VERIFY_BRANDS = Math.max(1, Number(process.env.VERIFY_BRANDS) || 5);
  const LOFT_N = Math.max(0, Number(process.env.LOFT_N ?? 30));
  const getJson = async (qs) => {
    let last;
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(WORKER + "/?" + qs + tok, { signal: AbortSignal.timeout(60000) });
        if (!r.ok) throw new Error("HTTP " + r.status);
        return await r.json();
      } catch (e) { last = e; await new Promise((res) => setTimeout(res, 3000)); }
    }
    throw last;
  };

  let list = ((await getJson("catalogs=1")).list || []).sort((a, z) => (a.site < z.site ? -1 : 1));
  // 같은 호스트의 옛 키(<host>)와 새 키(<host>.<slug>)가 함께 있으면 옛 키는 앱이 쓰지 않는다 — enrich-comp.mjs 와 같이 뺀다.
  const hosts = new Map();
  for (const c of list) { const h = String(c.site || "").split(".").slice(0, 2).join("."); if (!hosts.has(h)) hosts.set(h, []); hosts.get(h).push(c); }
  const skipOld = new Set();
  for (const [h, g] of hosts) if (g.length > 1 && g.some((c) => c.site !== h)) for (const c of g) if (c.site === h) skipOld.add(c.site);
  list = list.filter((c) => !skipOld.has(c.site));
  if (BRANDS.length) list = list.filter((c) => BRANDS.includes(normBrand(c.brand)) || String(c.site).split(".").map(normBrand).some((x) => BRANDS.includes(x)));
  console.log(`카탈로그 ${list.length}개(옛 키 ${skipOld.size}개 뺌) — 읽기만 한다`);

  const brands = [];
  const errors = [];
  const itemsBySite = new Map();   // 검증 표본을 고를 때 이름·값을 찾으려고 들고 있는다
  for (const c of list) {
    let cat, overlay;
    try { cat = await getJson("catalog=" + encodeURIComponent(c.site)); }
    catch (e) { errors.push({ site: c.site, what: "catalog", err: String(e.message || e) }); continue; }
    try { overlay = await getJson("comps=" + encodeURIComponent(c.site)); }
    catch (e) { errors.push({ site: c.site, what: "comps", err: String(e.message || e) }); overlay = {}; }
    const brand = cat.brand || c.brand || c.site;
    const items = shownItems(cat.items || [], overlay);
    itemsBySite.set(c.site, items);
    const r = analyzeBrand(items);
    const withComp = items.filter((p) => p.comp);
    const stat = {
      brand, site: c.site, total: items.length, comp: withComp.length,
      valid: withComp.filter((p) => validComp(p.comp)).length,
      fromCatalog: withComp.filter((p) => p.src === "catalog").length,
      fromOverlay: withComp.filter((p) => p.src === "overlay").length,
      viaWayback: withComp.filter((p) => p.via === "wayback").length,
      none: items.filter((p) => p.none).length,
      rawOnly: items.filter((p) => p.raw && !p.comp).length,   // [object …] 같은 것 — 화면엔 빈 칸
      hidden: items.filter((p) => p.hidden).length,
      multi: withComp.filter((p) => parseComp(p.comp).length >= 2).length,
    };
    brands.push({ ...stat, A: r.A, B: r.B, C: r.C, D: r.D, E: r.E, F: r.F,
      hiddenEx: items.filter((p) => p.hidden).slice(0, 5),
      // Loft 질문용: 저장값 분포와 none·빈 상품
      ...(/loft/i.test(brand) ? { loft: items } : {}) });
    console.log(`  ${brand}: 상품 ${stat.total} · 혼용률 ${stat.comp} · A ${r.A.length} · B ${r.B.length} · C ${r.C ? "예" : "-"} · D ${r.D.length} · E ${r.E.length} · F ${r.F.length}`);
  }

  // ── 검증 표본: A·B·D 상위 브랜드에서 몇 개씩 + Loft ───────────────────
  const sample = [];
  const seen = new Set();
  const add = (p, sig, brand, why) => { if (seen.has(p.url) || (sig !== "LOFT" && sigF(p.url))) return; seen.add(p.url); sample.push({ url: p.url, name: p.name, stored: p.comp, src: p.src, via: p.via, sig, brand, why: why || "" }); };
  const top = (key) => brands.filter((b) => (key === "B" ? b.B.length : b[key].length)).sort((a, z) =>
    (key === "B" ? z.B[0].n - a.B[0].n : z[key].length - a[key].length)).slice(0, VERIFY_BRANDS);
  // A 는 안감이 없을 옷(티셔츠·니트·셔츠)을 먼저 — 그런 옷의 두 줄은 거의 틀린 값이라 확인 가치가 크다.
  const NO_LINING_RX = /t-?shirt|\btees?\b|tank|\btop\b|sweater|knit|cardigan|polo|henley|shirt|blouse|jumper|sweatshirt|hoodie/i;
  const unlinedFirst = (arr) => [...arr].sort((x, y) => Number(NO_LINING_RX.test(y.name)) - Number(NO_LINING_RX.test(x.name)));
  for (const b of top("A")) for (const p of unlinedFirst(b.A).slice(0, VERIFY_PER)) add(p, "A", b.brand);
  for (const b of top("B")) {
    const its = new Map((itemsBySite.get(b.site) || []).map((p) => [p.url, p]));
    for (const u of b.B[0].urls.slice(0, VERIFY_PER)) add(its.get(u) || { url: u, name: "", comp: "", src: "" }, "B", b.brand, b.B[0].line);
  }
  for (const b of top("D")) for (const p of b.D.slice(0, VERIFY_PER)) add(p, "D", b.brand, p.why.join(" · "));
  const loftB = brands.find((b) => b.loft);
  const loftSample = [];
  if (loftB && LOFT_N) {
    const prod = (p) => !sigF(p.url) && /loft\.com/i.test(p.url);
    const pick = [...loftB.loft.filter((p) => p.none && prod(p)), ...loftB.loft.filter((p) => !p.none && !p.comp && prod(p))].slice(0, LOFT_N);
    for (const p of pick) { loftSample.push({ url: p.url, name: p.name, stored: p.comp, none: p.none, nv: p.nv }); }
    for (const p of loftB.loft.filter((p) => p.comp && prod(p)).slice(0, 6)) loftSample.push({ url: p.url, name: p.name, stored: p.comp, none: false });
    for (const p of loftSample) if (!seen.has(p.url)) { seen.add(p.url); sample.push({ ...p, sig: "LOFT", brand: loftB.brand }); }
  }
  // JSON 이 너무 커지지 않게 목록은 줄이고 개수는 따로 둔다(리포트는 개수를 쓴다).
  const KEEP = 80;
  for (const b of brands) {
    for (const f of b.B) { f.examples = f.urls.slice(0, 8); delete f.urls; }
    b.Ewhy = {};
    for (const p of b.E) for (const w of p.why) { const k = w.replace(/: .*/, ""); b.Ewhy[k] = (b.Ewhy[k] || 0) + 1; }
    for (const k of ["A", "D", "E", "F"]) { b["n" + k] = b[k].length; b[k] = (k === "A" ? unlinedFirst(b[k]) : b[k]).slice(0, KEEP); }
    if (b.loft) b.loft = b.loft.map((p) => ({ name: p.name, url: p.url, comp: p.comp, src: p.src, none: p.none, nv: p.nv }));
  }
  const out = { at: new Date().toISOString(), skippedOldKeys: [...skipOld], errors, rules: { B: B_RULE, C: C_RULE }, brands, sample };
  writeFileSync(join(ROOT, "stored-comp-audit.json"), JSON.stringify(out, null, 1));
  writeFileSync(join(ROOT, "stored-comp-verify-urls.txt"), sample.map((s) => s.url).filter((u) => !u.includes(",")).join(","));
  writeFileSync(join(ROOT, "stored-comp-audit-raw.md"), rawReport(out, null));
  console.log(`표본 ${sample.length}개 → stored-comp-verify-urls.txt · 리포트 stored-comp-audit-raw.md`);
}

// ── 검증: 실제 페이지를 오늘의 추출기로 다시 읽은 결과(try-engines RESULTS_JSON)와 견준다 ──────
const LIVE_ENGINES = ["firefox", "impit", "playwright", "patchright", "crawlee-firefox", "camoufox"];
export function verdict(stored, byEngine) {
  // 지금 페이지에서 읽은 값(아카이브 제외) — 먼저 나온 엔진 순서
  const live = LIVE_ENGINES.map((e) => [e, byEngine[e]]).filter(([, r]) => r && r.v === "comp" && r.comp);
  const arc = byEngine.wayback && byEngine.wayback.v === "comp" && byEngine.wayback.comp ? byEngine.wayback : null;
  const opened = Object.entries(byEngine).filter(([, r]) => r && (r.v === "open" || r.v === "comp")).map(([e]) => e);
  const cmp = (fresh) => {
    if (!stored) return "new";
    if (sameComp(stored, fresh)) return "same";
    // 저장값의 한 줄이 지금 값과 같다 = 저장값에 다른 줄이 섞였다(Zara 모양)
    const sl = String(stored).split("\n").map((x) => normComp(x));
    if (sl.length > 1 && sl.includes(normComp(fresh))) return "extra";
    return "diff";
  };
  if (live.length) {
    const [eng, r] = live[0];
    const c = cmp(r.comp);
    return { v: c === "same" ? "fine" : c === "new" ? "fresh" : "wrong", how: c, eng, fresh: r.comp };
  }
  if (arc) {
    const c = cmp(arc.comp);
    return { v: c === "same" ? "fine-arc" : c === "new" ? "fresh-arc" : "wrong-arc", how: c, eng: "wayback", fresh: arc.comp, note: arc.note };
  }
  if (opened.length) return { v: "open", eng: opened.join(","), fresh: "" };
  return { v: "unread", eng: "", fresh: "" };
}

async function verify(resultsPath) {
  const audit = JSON.parse(readFileSync(join(ROOT, "stored-comp-audit.json"), "utf8"));
  const res = existsSync(resultsPath) ? JSON.parse(readFileSync(resultsPath, "utf8")) : { results: {}, runInfo: {} };
  for (const s of audit.sample) {
    const by = {};
    for (const [e, m] of Object.entries(res.results || {})) by[e] = m[s.url] || null;
    s.engines = Object.fromEntries(Object.entries(by).map(([e, r]) => [e, r ? { v: r.v, note: r.note || "", comp: r.comp || "" } : null]));
    s.verdict = verdict(s.stored, by);
  }
  audit.verifiedAt = res.at || "";
  audit.runInfo = res.runInfo || {};
  writeFileSync(join(ROOT, "stored-comp-audit.json"), JSON.stringify(audit, null, 1));
  writeFileSync(join(ROOT, "stored-comp-audit-raw.md"), rawReport(audit, true));
  console.log("검증 결과를 붙였다 → stored-comp-audit-raw.md");
}

// ── 원자료 리포트(사람이 읽는 정리본은 docs/stored-comp-audit.md 에 따로 쓴다) ─────────────
function rawReport(a, verified) {
  const esc = (s) => String(s || "").replace(/\|/g, "/").replace(/\n/g, " ‖ ");
  const B = a.brands;
  const sum = (k) => B.reduce((n, b) => n + (b[k] || 0), 0);
  const cnt = (k) => B.reduce((n, b) => n + (b["n" + k] != null ? b["n" + k] : b[k] ? 1 : 0), 0);
  let md = `# 저장된 혼용률 점검 — 원자료 (${a.at.slice(0, 16)}Z)\n\n읽기만 했다(쓰기 요청은 스크립트가 막는다). 사람이 읽는 정리는 docs/stored-comp-audit.md.\n\n`;
  md += `- 브랜드(카탈로그) ${B.length}개 · 상품 ${sum("total")} · 혼용률이 보이는 상품 ${sum("comp")} (오늘의 validComp 통과 ${sum("valid")})\n`;
  md += `- 출처: 카탈로그 값 ${sum("fromCatalog")} · 오버레이 값 ${sum("fromOverlay")} (그중 보관본 via=wayback ${sum("viaWayback")})\n`;
  md += `- [object …] 등 화면엔 빈 칸인 값 ${sum("rawOnly")} · 카탈로그 값이 다른 오버레이 값을 가림 ${sum("hidden")} · none ${sum("none")}\n`;
  md += `- 여러 줄 혼용률 ${sum("multi")}\n`;
  md += `- A ${cnt("A")} · B 브랜드 ${B.filter((b) => b.B.length).length} · C 브랜드 ${cnt("C")} · D ${cnt("D")} · E ${cnt("E")} · F ${cnt("F")}\n`;
  if (a.errors.length) md += `- 읽기 실패: ${a.errors.map((e) => `${e.site}(${e.what}: ${e.err})`).join(", ")}\n`;
  if (a.skippedOldKeys.length) md += `- 뺀 옛 키: ${a.skippedOldKeys.join(", ")}\n`;
  const ex = (arr, n, f) => arr.slice(0, n).map(f).join("\n");
  const row = (p, extra) => `  - ${esc(p.name) || "(이름 없음)"} — \`${esc(p.comp || p.raw)}\` — ${p.src}${p.via ? "/" + p.via : ""}${extra ? " — " + extra : ""} — ${p.url}`;
  const bySig = (k) => B.filter((b) => b["n" + k]).sort((x, y) => y["n" + k] - x["n" + k]);
  md += `\n## A. Zara 모양(줄마다 다른 섬유 100%)\n\n`;
  for (const b of bySig("A")) md += `- **${b.brand}** ${b.nA} / 혼용률 ${b.comp}\n${ex(b.A, 5, (p) => row(p))}\n`;
  md += `\n## B. 반복 조각 (여러 줄 ${B_RULE.MIN_MULTI}개 이상 · 같은 줄 ${B_RULE.SHARE * 100}% 이상 · ${B_RULE.MIN_HITS}개 이상 · 짝 줄 2종 이상)\n\n`;
  for (const b of B.filter((x) => x.B.length).sort((x, y) => y.B[0].n - x.B[0].n)) {
    for (const f of b.B) md += `- **${b.brand}** \`${f.line}\` — 여러 줄 ${f.multi}개 중 ${f.n}개(${Math.round(f.share * 100)}%) · 짝 ${f.partners}종${f.lining ? " · 흔한 안감일 수 있음" : ""}\n${(f.examples || []).slice(0, 4).map((u) => "  - " + u).join("\n")}\n`;
  }
  md += `\n## C. 한 값이 독차지 (혼용률 ${C_RULE.MIN}개 이상 · ${C_RULE.SHARE * 100}% 이상) — 확인용\n\n`;
  for (const b of B.filter((x) => x.C).sort((x, y) => y.C.share - x.C.share)) md += `- **${b.brand}** \`${esc(b.C.comp)}\` ${b.C.n}/${b.C.of} (${Math.round(b.C.share * 100)}%)\n`;
  md += `\n## D. 상품명과 어긋남\n\n`;
  for (const b of bySig("D")) md += `- **${b.brand}** ${b.nD} / 혼용률 ${b.comp}\n${ex(b.D, 5, (p) => row(p, p.why.join(" · ")))}\n`;
  md += `\n## E. 불가능한 값\n\n`;
  const ew = new Map();
  for (const b of B) for (const [k, n] of Object.entries(b.Ewhy || {})) ew.set(k, (ew.get(k) || 0) + n);
  md += [...ew].map(([k, n]) => `- ${k}: ${n}`).join("\n") + "\n\n";
  for (const b of bySig("E")) md += `- **${b.brand}** ${b.nE}\n${ex(b.E, 5, (p) => row(p, p.why.join(" · ")))}\n`;
  md += `\n## F. 상품 주소가 아닌 곳의 혼용률\n\n`;
  for (const b of bySig("F")) md += `- **${b.brand}** ${b.nF}\n${ex(b.F, 4, (p) => row(p))}\n`;
  md += `\n## 카탈로그 값이 다른 오버레이 값을 가린 예\n\n`;
  for (const b of B.filter((x) => x.hidden)) md += `- **${b.brand}** ${b.hidden}\n${b.hiddenEx.slice(0, 3).map((p) => `  - ${esc(p.name)} — 보임 \`${esc(p.comp)}\` · 가려짐 \`${esc(p.hidden)}\` — ${p.url}`).join("\n")}\n`;
  const loft = B.find((b) => b.loft);
  if (loft) {
    md += `\n## Loft 저장값\n\n상품 ${loft.total} · 혼용률 ${loft.comp} · none ${loft.none}\n\n`;
    const dist = new Map();
    for (const p of loft.loft.filter((x) => x.comp)) { const k = p.comp; const e = dist.get(k) || { n: 0, ex: [] }; e.n++; if (e.ex.length < 3) e.ex.push(p.name); dist.set(k, e); }
    md += `| 저장값 | 상품 수 | 예(상품명) |\n|---|---:|---|\n` + [...dist].sort((x, y) => y[1].n - x[1].n).slice(0, 40).map(([k, e]) => `| ${esc(k)} | ${e.n} | ${e.ex.map(esc).join(" · ")} |`).join("\n") + "\n";
  }
  md += `\n## 실제 페이지로 확인한 표본 (${a.sample.length}개)\n\n`;
  if (!verified) md += `(아직 다시 읽지 않음)\n`;
  else {
    md += `다시 읽은 시각 ${a.verifiedAt || "-"} · 엔진: ${Object.entries(a.runInfo || {}).map(([e, s]) => `${e}(${s})`).join(" · ")}\n\n`;
    const V = { fine: "지금 페이지(오늘 추출기)와 같음", wrong: "틀림 확인(지금 페이지·오늘 추출기와 다름)", fresh: "저장값 없음 · 지금 페이지 값 있음",
      "fine-arc": "보관본과 같음", "wrong-arc": "보관본과 다름", "fresh-arc": "저장값 없음 · 보관본 값 있음", open: "열렸지만 소재 못 읽음", unread: "다시 못 읽음(차단·오류)" };
    const tally = new Map();
    for (const s of a.sample) { const k = `${s.sig} · ${V[s.verdict.v]}`; tally.set(k, (tally.get(k) || 0) + 1); }
    md += [...tally].sort().map(([k, n]) => `- ${k}: ${n}`).join("\n") + "\n\n";
    md += `| 시그니처 | 브랜드 | 상품 | 저장값 | 판정 | 다시 읽은 값 | 엔진별 |\n|---|---|---|---|---|---|---|\n`;
    for (const s of a.sample) {
      const eng = Object.entries(s.engines || {}).map(([e, r]) => `${e}:${r ? r.v : "-"}`).join(" ");
      md += `| ${s.sig}${s.why ? " " + esc(s.why).slice(0, 40) : ""} | ${esc(s.brand)} | [${esc(s.name || "(이름 없음)").slice(0, 60)}](${s.url}) | ${esc(s.stored) || (s.none ? "none" : "-")} | ${V[s.verdict.v]}${s.verdict.how === "extra" ? " · 저장값에 섞인 줄" : ""} | ${esc(s.verdict.fresh)} | ${eng} |\n`;
    }
  }
  return md;
}

// ── 실행 ──────────────────────────────────────────────────────────
const isMain = process.argv[1] && resolve(process.argv[1]) === SELF;
if (isMain) {
  // 쓰기는 아예 불가능하게: GET/HEAD 가 아닌 요청은 보내기 전에 막는다(enrich-comp.mjs 의 DRY 와 같은 장치).
  const realFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return Promise.reject(new Error(`읽기 전용 점검 — ${method} 요청을 막음: ${String((input && input.url) || input).slice(0, 120)}`));
    }
    return realFetch(input, init);
  };
  if (process.env.VERIFY) await verify(process.env.VERIFY);
  else await scan();
}
