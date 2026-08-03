#!/usr/bin/env node
// 야간 혼용률 보강 — 저장된 카탈로그에서 comp(혼용률) 없는 상품의 페이지를 읽어 채운다.
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
// env: WORKER_URL, WORKER_TOKEN, PER_BRAND(브랜드당 상한, 기본 800), TOTAL(전체 상한, 기본 40000)
// 예약 실행은 workflow_dispatch inputs 가 비어 있어 이 기본값이 그대로 쓰인다 —
// 작게 잡으면 매일 조금씩만 채우다 끝나지 않는다. 하룻밤에 전부 도는 값으로 둔다.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
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
// fromJsonLd 는 titleCase 를 쓰므로 두 블록을 이어 붙인다.
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

const has = (o) => o && (o.comp || o.color || o.sizes || o.price);

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
          comp: compFromText(String(pr.body_html || "").replace(/<[^>]+>/g, " ")),
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
        ? ld.composition.map((c) => `${c.material} ${c.percent}%`).join(" / ")
        : compFromText(text),
      color: ld.color || "",
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
console.log(`카탈로그 ${list.length}개 — comp 없는 상품을 채운다 (브랜드당 ${PER_BRAND}, 전체 ${TOTAL})`);

let budget = TOTAL;
const rows = [];
for (const c of list) {
  if (budget <= 0) break;
  let cat;
  try { cat = await fetch(WORKER + "/?catalog=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(30000) }).then((r) => r.json()); }
  catch (e) { rows.push({ brand: c.brand || c.site, error: String(e.message || e) }); continue; }
  const items = cat.items || [];
  // 네 항목(혼용률·컬러·사이즈·가격) 중 하나라도 비어 있으면 읽는다.
  const full = (p) => p.comp && p.color && p.sizes && p.price;
  const have = items.filter(full).length;
  const todo = items.filter((p) => !full(p)).slice(0, Math.min(PER_BRAND, budget));
  if (!todo.length) { rows.push({ brand: cat.brand || c.site, site: c.site, total: items.length, have, patched: 0 }); continue; }

  const stat = { shopify: 0, page: 0, worker: 0, noData: 0, blocked: 0, fail: 0 };
  const comps = {};
  // Worker 우회가 붙어 차단 상품은 왕복이 하나 더 는다 — 동시 처리를 올려 상쇄한다.
  await pool(todo, 10, async (p) => {
    const got = await enrichOf(p.productUrl, stat);
    if (has(got)) comps[p.productUrl] = got;
  });
  budget -= todo.length;

  let patched = 0;
  if (Object.keys(comps).length) {
    try {
      const resp = await fetch(WORKER + "/?store=comps" + tok, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: c.site, comps }),
        signal: AbortSignal.timeout(30000),
      });
      const text = await resp.text();
      let r = {};
      try { r = JSON.parse(text); } catch (e) {}
      patched = r.patched || 0;
      // 뽑은 게 있는데 하나도 저장되지 않았다면 원인을 응답 그대로 남긴다.
      // (첫 대량 실행에서 +0 이 무더기로 나왔는데 로그가 없어 원인을 못 좁혔다)
      if (!patched) {
        console.log(`  !! ${c.site}: 추출 ${Object.keys(comps).length}건인데 저장 0 — HTTP ${resp.status} ${text.slice(0, 300)}`);
      }
    } catch (e) { rows.push({ brand: cat.brand || c.site, error: "store: " + String(e.message || e) }); continue; }
  }
  rows.push({ brand: cat.brand || c.site, site: c.site, total: items.length, have: have + patched, patched, stat });
  console.log(`  ${c.site}: +${patched} (경로 ${JSON.stringify(stat)})`);
}

// ── 검색 인덱스 재구축 — 전 브랜드 카탈로그에서. comp 가 인덱스로 흘러야
//    보드 스캐너가 접속 없이 붙일 수 있다. 브랜드당 150개(프리페치와 동일 상한).
let indexCount = 0;
try {
  const idx = [];
  for (const c of list) {
    try {
      const cat = await fetch(WORKER + "/?catalog=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(30000) }).then((r) => r.json());
      for (const it of (cat.items || []).slice(0, 150)) {
        if (!it || !it.imageUrl || !it.productUrl) continue;
        // {...it} 로 넘기면 src(카테고리 URL, 최대 300자)까지 실려 31k 건에서
        // KV 값 상한(25MB)을 넘긴다 — 검색·스캔에 필요한 필드만 싣는다.
        idx.push({
          name: it.name || "", brand: cat.brand || c.brand || c.site,
          category: it.category || "", imageUrl: it.imageUrl, productUrl: it.productUrl,
          price: it.price || "", priceOrig: it.priceOrig || "",
          comp: it.comp || "", color: it.color || "", sizes: it.sizes || "",
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
const totalPatched = done.reduce((s, r) => s + (r.patched || 0), 0);
let md = `# 혼용률 보강 결과 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
md += `- 상품 ${totalItems}개 중 혼용률 보유 ${totalHave}개 (${totalItems ? Math.round((totalHave / totalItems) * 100) : 0}%) · 오늘 +${totalPatched}\n`;
md += `- 검색 인덱스 재구축: ${indexCount}개 (comp 포함)\n\n`;
md += `백필은 브랜드당 ${PER_BRAND}개·하루 ${TOTAL}개 상한으로 며칠에 나눠 채운다. 채워진 값은 다시 읽지 않는다.\n\n`;
const gaps = done.filter((r) => r.total && r.have < r.total).sort((a, z) => (a.have / a.total) - (z.have / z.total));
if (gaps.length) {
  md += `## 아직 비어 있는 브랜드 (${gaps.length})\n\n| 브랜드 | 보유/전체 | 오늘 추가 | 실패 경로 |\n|---|---:|---:|---|\n`;
  for (const r of gaps) {
    const st = r.stat ? Object.entries(r.stat).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(" ") : "";
    md += `| ${r.brand} | ${r.have}/${r.total} | +${r.patched} | ${st} |\n`;
  }
  md += `\n`;
}
const errs = rows.filter((r) => r.error);
if (errs.length) {
  md += `## 읽기 실패 (${errs.length})\n\n`;
  for (const r of errs) md += `- ${r.brand}: ${r.error}\n`;
}
writeFileSync(join(ROOT, "enrich-comp-report.md"), md);
console.log(`\n혼용률 ${totalHave}/${totalItems} (+${totalPatched}) · 인덱스 ${indexCount}`);
