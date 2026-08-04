#!/usr/bin/env node
// 야간 보강 — 저장된 카탈로그에서 엑셀 항목(혼용률·컬러웨이)이 빈 상품의 페이지를 읽어 채운다.
//
// 왜 밤에 하나: 혼용률은 상품 페이지에만 있는데, 스캔하는 순간에 읽으면 상품 수만큼
// 사용자가 기다린다. 혼용률은 한 번 뽑으면 바뀌지 않는 값이므로 여기서 미리 채워 두면
// 보드 스캐너는 저장값을 붙이기만 한다(접속 0회).
//
// 추출은 AI 없이 한다: ① Shopify /products/<handle>.json ② schema.org JSON-LD
// ③ 본문 텍스트의 "60% Cotton" 패턴. 규칙은 worker/fabric-extractor.js 의 블록을
// 그대로 떼어 와 실행한다 — 복사본을 만들면 한쪽만 고쳐지는 사고가 난다.
//
// 봇 차단(확장 담당) 브랜드는 직접 접속이 403이라 리더 프록시(r.jina.ai)로 우회한다.
// 그래도 안 되는 상품은 남겨 두면 확장 1.7 이 실사용 PC에서 채운다(이중 안전망).
//
// env: WORKER_URL, WORKER_TOKEN, PER_BRAND(브랜드당 상한, 기본 800), TOTAL(전체 상한, 기본 40000),
//      NEED_FIELDS(목표 항목, 기본 comp,color), RETRY_DAYS(빈손 재시도 간격, 기본 5)
// 예약 실행은 workflow_dispatch inputs 가 비어 있어 이 기본값이 그대로 쓰인다 —
// 작게 잡으면 매일 조금씩만 채우다 끝나지 않는다. 하룻밤에 전부 도는 값으로 둔다.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
// 채울 목표 항목. 상품 페이지를 한 번 열면 넷 다 나오므로 함께 두는 편이 효율적이다.
const FIELDS = (process.env.NEED_FIELDS || "comp,color").split(",").map((s2) => s2.trim()).filter(Boolean);
// 못 찾은 상품을 며칠 뒤에 다시 시도할지. 사이트가 정보를 안 적으면 아무리 읽어도 안 나온다.
const RETRY_DAYS = Math.max(1, Number(process.env.RETRY_DAYS) || 5);
const PER_BRAND = Math.max(1, Number(process.env.PER_BRAND) || 800);
const TOTAL = Math.max(1, Number(process.env.TOTAL) || 40000);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const tok = "&token=" + encodeURIComponent(TOKEN);

// ── worker 의 추출 블록을 그대로 실행(단일 소스 유지) ─────────────────────
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
function slice(startMark, endMark) {
  const i = workerSrc.indexOf(startMark);
  const j = workerSrc.indexOf(endMark, i);
  if (i < 0 || j < 0) throw new Error(`worker 블록을 찾지 못함: ${startMark}`);
  return workerSrc.slice(i, j);
}
const compFromText = new Function(
  slice("const FIBRES = {", "function titleCase") + "\n return compFromText;",
)();
// 본문 16000자 밖·페이지 JSON 안까지 보는 판(compWindow 포함).
const compFromHtml = new Function(
  slice("const FIBRES = {", "function titleCase") + "\n return compFromHtml;",
)();
// compFromText/compFromHtml 은 [{material,percent}] 를 돌려준다. 그대로 저장하면
// String() 이 걸려 '[object Object],[object Object]' 가 들어간다 — 반드시 여기서 문자열로.
const asComp = (v) => (Array.isArray(v)
  ? v.map((c) => `${c.material} ${c.percent}%`).join(" / ")
  : String(v || "").trim());
// fromJsonLd 는 titleCase 를 쓰므로 두 블록을 이어 붙인다.
const colorFromHtml = new Function(
  slice("const COLOR_JUNK", "function titleCase") + "\n return colorFromHtml;",
)();
const fromJsonLd = new Function(
  slice("function fromJsonLd(html) {", "const FIBRES = {") +
  slice("function titleCase(s) {", "// 페이지 제목") + "\n return fromJsonLd;",
)();

const _unusedCompOfJsonLd = (html) => {
  try {
    const ld = fromJsonLd(html);
    if (ld.composition && ld.composition.length) {
      return ld.composition.map((c) => `${c.material} ${c.percent}%`).join(" / ");
    }
  } catch (e) {}
  return "";
};

async function get(url, accept, timeoutMs = 20000) {
  const r = await fetch(url, {
    headers: { "user-agent": UA, accept: accept || "text/html,*/*;q=0.8", "accept-language": "en-US,en;q=0.9" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.text();
}

// 빈 배열([])도 truthy 라 그대로 쓰면 "아무것도 못 찾았는데 성공"으로 판정된다.
// 그 탓에 Shopify 상품은 첫 경로에서 곧장 반환돼 페이지·우회 경로를 아예 안 탔다.
const val = (v) => (Array.isArray(v) ? v.length > 0 : !!String(v || "").trim());
const has = (o) => !!o && (val(o.comp) || val(o.color) || val(o.sizes) || val(o.price));

// 한 상품의 네 항목(혼용률·컬러·사이즈·가격). 실패는 null — 이유는 세어서 리포트로.
async function enrichOf(url, stat) {
  // ① Shopify JSON — 가장 싸고 정확. variants/options 에 사이즈·컬러·가격이 구조화돼 있다.
  const m = url.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
  if (m) {
    try {
      const j = JSON.parse(await get(`${m[1]}/products/${m[2]}.json`, "application/json", 12000));
      const pr = j && j.product;
      if (pr) {
        const opt = (want) => {
          const o = (pr.options || []).find((x) => new RegExp(want, "i").test(String((x && x.name) || "")));
          return o && Array.isArray(o.values) ? o.values.map((v) => String(v).trim()).filter(Boolean) : [];
        };
        const vs = Array.isArray(pr.variants) ? pr.variants : [];
        const num = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : NaN; };
        const now = vs.map((v) => num(v && v.price)).filter(Number.isFinite);
        const was = vs.map((v) => num(v && v.compare_at_price)).filter(Number.isFinite);
        const lowNow = now.length ? Math.min(...now) : NaN;
        const highWas = was.length ? Math.max(...was) : NaN;
        const out = {
          comp: asComp(compFromText(String(pr.body_html || "").replace(/<[^>]+>/g, " "))),
          color: opt("^(colou?r|색상|컬러)$").slice(0, 4).join(" / "),
          sizes: opt("^(size|사이즈)$").slice(0, 30).join(", "),
          price: Number.isFinite(lowNow) ? "$" + lowNow : "",
          priceOrig: Number.isFinite(highWas) && Number.isFinite(lowNow) && highWas > lowNow ? "$" + highWas : "",
        };
        // 혼용률까지 나왔으면 여기서 끝. 아니면 아래 경로로 내려가 보강한다.
        if (out.comp) { stat.shopify++; return out; }
        if (has(out)) { stat.shopify++; var partial = out; }
      }
    } catch (e) {}
  }
  // ② 페이지 직접 → JSON-LD → 본문.
  let html = "";
  try { html = await get(url); } catch (e) { stat.blocked++; }
  if (html) {
    let ld = {};
    try { ld = fromJsonLd(html); } catch (e) {}
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
    const out = {
      comp: (ld.composition && ld.composition.length)
        ? asComp(ld.composition)
        : (asComp(compFromHtml(html)) || asComp(compFromText(text))),
      // 색은 JSON-LD 에 없는 경우가 더 많다 — 페이지의 색상 선택 옵션에서도 읽는다.
      color: ld.color || colorFromHtml(html),
      sizes: (ld.sizes || []).slice(0, 30).join(", "),
      price: ld.price || "",
      priceOrig: ld.price_original || "",
    };
    if (has(out)) { stat.page++; return merge(out, typeof partial === "undefined" ? null : partial); }
  }
  // ③ Worker 우회 — GitHub Actions IP 는 많은 쇼핑몰에서 403 이지만 Cloudflare IP 는
  //    통과하는 경우가 많다. Worker 안에서 Shopify JSON → 직접 → 리더까지 다시 시도한다.
  try {
    const r = await fetch(WORKER + "/?comp=" + encodeURIComponent(url) + tok, {
      signal: AbortSignal.timeout(20000),
    });
    const j = await r.json();
    if (has(j)) { stat.worker++; return merge(j, typeof partial === "undefined" ? null : partial); }
    stat.noData++;
  } catch (e) { stat.fail++; }
  return typeof partial === "undefined" ? null : partial;
}

// 앞 경로에서 얻은 값을 잃지 않게 합친다(먼저 찾은 쪽 우선).
function merge(a, b) {
  if (!b) return a;
  const out = { ...b };
  for (const k of ["comp", "color", "sizes", "price", "priceOrig"]) if (!out[k] && a[k]) out[k] = a[k];
  return out;
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; await fn(items[k]); }
  }));
}

const ls = await fetch(WORKER + "/?catalogs=1" + tok).then((r) => r.json());
let list = (ls.list || []).sort((a, z) => (a.site < z.site ? -1 : 1));
// 같은 호스트에 옛 키(<host>)와 새 키(<host>.<slug>)가 함께 있으면 같은 상품을 두 번 읽게 된다.
// 예산 낭비라 새 키만 남긴다(옛 키는 어차피 미로 앱이 쓰지 않는다).
{
  const hosts = new Map();
  for (const c of list) {
    const host = String(c.site || "").split(".").slice(0, 2).join(".");
    if (!hosts.has(host)) hosts.set(host, []);
    hosts.get(host).push(c);
  }
  const skip = new Set();
  for (const [host, g] of hosts) {
    if (g.length > 1 && g.some((c) => c.site !== host)) {
      for (const c of g) if (c.site === host) skip.add(c.site);
    }
  }
  if (skip.size) console.log(`중복 옛 키 ${skip.size}개 건너뜀: ${[...skip].join(", ")}`);
  list = list.filter((c) => !skip.has(c.site));
}
console.log(`카탈로그 ${list.length}개 — [${FIELDS.join(",")}] 채운다 (브랜드당 ${PER_BRAND}, 전체 ${TOTAL}, 재시도 ${RETRY_DAYS}일)`);

let budget = TOTAL;
const rows = [];
for (const c of list) {
  if (budget <= 0) break;
  let cat;
  try { cat = await fetch(WORKER + "/?catalog=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(30000) }).then((r) => r.json()); }
  catch (e) { rows.push({ brand: c.brand || c.site, error: String(e.message || e) }); continue; }
  const items = cat.items || [];
  // 채움 상태는 오버레이(comp:<site>) 기준 — 카탈로그 item 필드는 더 이상 쓰지 않는다.
  //
  // 읽기에 실패하면 이 브랜드는 통째로 건너뛴다. 예전엔 빈 객체로 넘어갔는데,
  // 저장 단계가 그 빈 객체를 기준으로 병합해 통째로 덮어썼다 — 읽기 한 번 실패에
  // 브랜드의 누적 수집분이 전부 날아갔다(Cotton on 98% → 0%).
  let overlay = null;
  for (let attempt = 0; attempt < 3 && overlay === null; attempt++) {
    try {
      const r = await fetch(WORKER + "/?comps=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      if (j && typeof j === "object" && !Array.isArray(j) && !j.error) overlay = j;
      else throw new Error("오버레이 형식이 아님");
    } catch (e) {
      if (attempt === 2) { rows.push({ brand: cat.brand || c.site, site: c.site, total: items.length, error: "오버레이 읽기 실패: " + String(e.message || e) }); }
      else await new Promise((r2) => setTimeout(r2, 2000));
    }
  }
  if (overlay === null) continue;
  const ov = (p) => overlay[p.productUrl] || {};
  // 객체·배열이 통째로 String() 돼 들어간 흔적은 값이 아니다.
  // '[object Object]' 하나일 수도, 배열이라 쉼표로 여럿일 수도 있다.
  const valOf = (o, k) => { const t = String((o && o[k]) || "").trim(); return t.includes("[object Object]") ? "" : t; };
  // 목표 항목(NEED_FIELDS)이 다 찼거나, 최근에 이미 시도해 봤으면 건너뛴다.
  //
  // "시도했으면 건너뛴다"가 핵심이다. 목표를 comp+color 로 두면, 혼용률은 있는데
  // 색을 안 적는 사이트의 상품을 매 실행마다 영원히 다시 읽게 된다 — 예산이 그쪽으로
  // 다 새고 정작 빈 상품에 손이 못 간다. 실제로 4항목 목표였을 때 45분에 +429 였다.
  const now = Date.now();
  const RETRY_MS = RETRY_DAYS * 24 * 3600 * 1000;
  const full = (p) => {
    const o = ov(p);
    if (FIELDS.every((k) => valOf(o, k))) return true;
    // 쓰레기 값('[object Object]')이 박힌 상품은 시도 시각과 무관하게 다시 읽는다.
    // 안 그러면 잘못 저장된 값이 재시도 기간(RETRY_DAYS) 내내 자리를 차지한다.
    if (FIELDS.some((k) => o[k] && !valOf(o, k))) return false;
    return o.t && now - o.t < RETRY_MS;   // 최근 시도 → 이번엔 넘긴다
  };
  // 엑셀에 나가는 두 항목을 따로 센다 — 합쳐 보면 어느 쪽이 비었는지 알 수 없다.
  const have = items.filter((p) => valOf(ov(p), "comp")).length;
  const haveColor = items.filter((p) => valOf(ov(p), "color")).length;
  const todo = items.filter((p) => !full(p)).slice(0, Math.min(PER_BRAND, budget));
  if (!todo.length) { rows.push({ brand: cat.brand || c.site, site: c.site, total: items.length, have, haveColor, patched: 0 }); continue; }

  const stat = { shopify: 0, page: 0, worker: 0, noData: 0, blocked: 0, fail: 0 };
  const comps = {};
  // Worker 우회가 붙어 차단 상품은 왕복이 하나 더 는다 — 동시 처리를 올려 상쇄한다.
  await pool(todo, 10, async (p) => {
    const got = await enrichOf(p.productUrl, stat);
    // 빈 결과도 넣는다 — 저장 단계에서 '시도 시각'만 찍혀 다음 실행이 건너뛴다.
    comps[p.productUrl] = has(got) ? got : {};
  });
  budget -= todo.length;

  // 저장: 병합을 여기서 하고 Worker 에는 완성된 오버레이를 통째로 넘긴다.
  // Worker 가 병합하면(기존 오버레이 파싱 + 항목별 정리 + 재직렬화) 항목 400개쯤에서
  // 무료 플랜 CPU 10ms 를 넘겨 저장 전에 죽는다 — Vince(340) 성공, Whitestuff(419)
  // 실패로 실측됐다. 여기서 병합하면 Worker 는 파싱 없이 쓰기만 하므로 크기와 무관하다.
  let patched = 0, addComp = 0, addColor = 0;
  const keys = Object.keys(comps);
  if (keys.length) {
    const merged = { ...overlay };
    const clean = (v, max) => {
      const t = String(v == null ? "" : v).trim().slice(0, max);
      return t.includes("[object Object]") ? "" : t;
    };
    for (const [url, v] of Object.entries(comps)) {
      const cur = { ...(merged[url] || {}) };
      const inc = typeof v === "string" ? { comp: v } : (v || {});
      let n = 0;
      for (const [k, max] of [["comp", 160], ["color", 80], ["sizes", 200], ["price", 40], ["priceOrig", 40]]) {
        const t = clean(inc[k], max);
        if (t && !valOf(cur, k)) {
          cur[k] = t; n++;
          if (k === "comp") addComp++;
          if (k === "color") addColor++;
        } else if (cur[k] && !valOf(cur, k)) {
          delete cur[k];   // 예전 확장이 넣은 '[object Object]' 정리
        }
      }
      // 값을 못 찾았어도 "시도했음"은 남긴다 — 안 남기면 같은 상품을 매번 다시 읽는다.
      cur.t = now;
      merged[url] = cur;
      if (n) patched++;
    }
    // 상품 상한(브랜드 카탈로그 800)보다 넉넉하게 1000개까지만 남긴다.
    const mk = Object.keys(merged);
    if (mk.length > 1000) for (const k of mk.slice(0, mk.length - 1000)) delete merged[k];

    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        const resp = await fetch(`${WORKER}/?store=overlay&site=${encodeURIComponent(c.site)}${tok}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(merged), signal: AbortSignal.timeout(45000),
        });
        const text = await resp.text();
        let r = null;
        try { r = JSON.parse(text); } catch (e) {}
        if (r && r.ok) { ok = true; break; }
        if (attempt === 2) console.log(`  !! ${c.site} 저장 실패: HTTP ${resp.status} ${text.slice(0, 160)}`);
      } catch (e) {
        if (attempt === 2) console.log(`  !! ${c.site} 저장 오류: ${String(e.message || e)}`);
      }
      await new Promise((r2) => setTimeout(r2, 2000));
    }
    if (!ok) patched = 0;
  }

  // 저장 후 실제로 박혔는지 다시 읽어 확인한다 — 응답의 patched 만 믿지 않는다.
  let verify = null, verifyColor = null;
  if (keys.length) {
    try {
      const re = await fetch(WORKER + "/?comps=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(20000) }).then((r) => r.json());
      const vs2 = Object.values(re || {});
      verify = vs2.filter((o) => valOf(o, "comp")).length;
      verifyColor = vs2.filter((o) => valOf(o, "color")).length;
      // 쓰기 직후 읽기는 KV 지연으로 0 이 나올 수 있다 — 쓴 것도 없을 때만 문제로 본다.
      if (patched === 0 && verify === 0) {
        console.log(`  !! ${c.site}: 저장 후에도 오버레이 비어 있음 — 첫 키 ${keys[0].slice(0, 120)}`);
      }
    } catch (e) {}
  }
  // KV 는 최종 일관성 저장소라 방금 쓴 값이 즉시 읽히지 않을 수 있다(수십 초 지연).
  // 실측: ae.com.americaneagle 은 '+3 검증 3', addisonbay 는 '+3 검증 0' — 같은 코드다.
  // 검증값을 그대로 쓰면 실제로 저장된 것을 안 됐다고 보고하게 되므로 큰 값을 쓴다.
  const haveNow = Math.max(verify == null ? 0 : verify, have + addComp);
  const colorNow = Math.max(verifyColor == null ? 0 : verifyColor, haveColor + addColor);
  rows.push({ brand: cat.brand || c.site, site: c.site, total: items.length, have: haveNow, haveColor: colorNow, patched, addComp, addColor, stat });
  console.log(`  ${c.site}: 혼용률 +${addComp} 컬러 +${addColor} (읽음 ${todo.length}, 경로 ${JSON.stringify(stat)})`);
}

// ── 검색 인덱스 재구축 — 전 브랜드 카탈로그에서. comp 가 인덱스로 흘러야
//    보드 스캐너가 접속 없이 붙일 수 있다. 브랜드당 150개(프리페치와 동일 상한).
let indexCount = 0;
try {
  const idx = [];
  for (const c of list) {
    try {
      const cat = await fetch(WORKER + "/?catalog=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(30000) }).then((r) => r.json());
      let om = {};
      try { om = await fetch(WORKER + "/?comps=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(20000) }).then((r) => r.json()) || {}; } catch (e) {}
      for (const it of (cat.items || []).slice(0, 150)) {
        if (!it || !it.imageUrl || !it.productUrl) continue;
        const o = om[it.productUrl] || {};
        // 검색·스캔에 필요한 필드만 싣는다(src 를 실었더니 KV 값 상한을 넘겼다).
        idx.push({
          name: it.name || "", brand: cat.brand || c.brand || c.site,
          category: it.category || "", imageUrl: it.imageUrl, productUrl: it.productUrl,
          price: o.price || it.price || "", priceOrig: o.priceOrig || it.priceOrig || "",
          comp: o.comp || "", color: o.color || "", sizes: o.sizes || "",
        });
      }
    } catch (e) {}
  }
  const resp = await fetch(WORKER + "/?store=index" + tok, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: idx }), signal: AbortSignal.timeout(120000),
  });
  const text = await resp.text();
  try { indexCount = JSON.parse(text).count || 0; }
  catch (e) { console.log(`index rebuild failed: HTTP ${resp.status} ${text.slice(0, 200)}`); }
} catch (e) { console.log("index rebuild failed:", String(e.message || e)); }

const done = rows.filter((r) => !r.error);
const totalItems = done.reduce((s, r) => s + (r.total || 0), 0);
const totalHave = done.reduce((s, r) => s + (r.have || 0), 0);
const totalColor = done.reduce((s, r) => s + (r.haveColor || 0), 0);
const totalComp = done.reduce((s, r) => s + (r.addComp || 0), 0);
const totalColorAdd = done.reduce((s, r) => s + (r.addColor || 0), 0);
const pct = (n) => (totalItems ? Math.round((n / totalItems) * 100) : 0);
let md = `# 엑셀 항목 보강 결과 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
md += `목표 항목: ${FIELDS.join(", ")} · 상품 ${totalItems}개\n\n`;
md += `| 항목 | 보유 | 채움률 | 이번 실행 |\n|---|---:|---:|---:|\n`;
md += `| 혼용률 | ${totalHave} | ${pct(totalHave)}% | +${totalComp} |\n`;
md += `| 컬러웨이 | ${totalColor} | ${pct(totalColor)}% | +${totalColorAdd} |\n\n`;
md += `- 검색 인덱스 재구축: ${indexCount}개\n\n`;
md += `백필은 브랜드당 ${PER_BRAND}개·한 회차 ${TOTAL}개 상한이다. 목표 항목이 다 찬 상품과\n`;
md += `${RETRY_DAYS}일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.\n\n`;
// 경로 이름을 그대로 쓰면 오해를 부른다 — shopify/page/worker 는 '성공한 경로'이고
// noData/blocked/fail 만 실패다. 예전 리포트의 'page=505' 를 '505개 실패'로 읽었다.
const PATH_LABEL = {
  shopify: "쇼피JSON", page: "페이지", worker: "우회",
  noData: "정보없음", blocked: "직접차단", fail: "오류",
};
const pathStr = (st) => {
  if (!st) return "";
  const ok = ["shopify", "page", "worker"].filter((k) => st[k]).map((k) => `${PATH_LABEL[k]} ${st[k]}`);
  const ng = ["noData", "blocked", "fail"].filter((k) => st[k]).map((k) => `${PATH_LABEL[k]} ${st[k]}`);
  return [ok.length ? "성공 " + ok.join("·") : "", ng.length ? "실패 " + ng.join("·") : ""].filter(Boolean).join(" / ");
};
const gaps = done.filter((r) => r.total).sort((a, z) => (a.have / a.total) - (z.have / z.total));
if (gaps.length) {
  md += `## 브랜드별 채움률 (${gaps.length}) — 낮은 순\n\n`;
  md += `| 브랜드 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |\n|---|---:|---:|---:|---|\n`;
  for (const r of gaps) {
    const cp = Math.round((r.have / r.total) * 100);
    const cl = Math.round(((r.haveColor || 0) / r.total) * 100);
    md += `| ${r.brand} | ${r.have}/${r.total} (${cp}%) | ${r.haveColor || 0}/${r.total} (${cl}%) | 혼용률 +${r.addComp || 0} 컬러 +${r.addColor || 0} | ${pathStr(r.stat)} |\n`;
  }
  md += `\n`;
}
const errs = rows.filter((r) => r.error);
if (errs.length) {
  md += `## 읽기 실패 (${errs.length})\n\n`;
  for (const r of errs) md += `- ${r.brand}: ${r.error}\n`;
}
writeFileSync(join(ROOT, "enrich-comp-report.md"), md);
console.log(`\n혼용률 ${totalHave}/${totalItems} (${pct(totalHave)}%, +${totalComp}) · 컬러 ${totalColor}/${totalItems} (${pct(totalColor)}%, +${totalColorAdd}) · 인덱스 ${indexCount}`);
