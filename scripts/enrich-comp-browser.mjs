#!/usr/bin/env node
// 혼용률 보강 — 진짜 크롬 판.
//
// 야간 보강(enrich-comp.mjs)은 平 fetch 로 상품 페이지를 읽는다. 그래서 봇을
// 막는 사이트에서는 통째로 0% 로 남는다. 진단 표본에서 Joules 10/10,
// Patagonia 10/10 이 '직접차단'이었다 — 두 브랜드만 519개 상품이다.
// Worker 우회(Cloudflare IP)도 같은 이유로 뚫리지 않는다.
//
// 진짜 크롬은 다르다. 헤드리스 수집(browser-collect)이 데이터센터 IP에서도
// 19개 브랜드를 매일 긁고 있는 게 그 증거다 — TLS 지문·헤더가 실제 브라우저이고
// JS 챌린지를 실행하며, 클라이언트에서 그려지는 본문까지 읽힌다.
//
// 그래서 이 스크립트는 '평 fetch 로는 안 되는 브랜드'만 골라 크롬으로 다시 읽는다.
// 추출 규칙은 worker 에서 그대로 떼어 쓴다 — 사본을 만들면 진단과 실제가 어긋난다.
//
// env:
//   BRANDS   쉼표로 구분한 브랜드(비우면 blocked-brands.json 의 확장·헤드리스 담당 중
//            혼용률이 비어 있는 브랜드를 채움률 낮은 순으로)
//   TOP      브랜드 수 상한(기본 6)
//   PER_BRAND 브랜드당 상품 수(기본 120)
//   STORE    1이면 Worker 오버레이에 저장(기본 1)
//   DRY      1이면 저장하지 않고 결과만 출력
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const tok = "&token=" + encodeURIComponent(TOKEN);
const TOP = Math.max(1, Number(process.env.TOP) || 6);
const PER_BRAND = Math.max(1, Number(process.env.PER_BRAND) || 120);
const STORE = process.env.STORE !== "0" && process.env.DRY !== "1";
const want = (process.env.BRANDS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
// 한 사이트로 동시에 너무 많이 가면 429 를 부른다. 탭 4개면 충분히 빠르다.
const TABS = Math.max(1, Number(process.env.TABS) || 4);

// ── 추출 규칙은 worker 한 벌만 쓴다 ─────────────────────────────────
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const slice = (a, b) => {
  const i = workerSrc.indexOf(a), j = workerSrc.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error("worker 블록을 찾지 못함: " + a);
  return workerSrc.slice(i, j);
};
const compFromHtml = new Function(slice("const FIBRES = {", "function titleCase") + "\n return compFromHtml;")();
const compFromText = new Function(slice("const FIBRES = {", "function titleCase") + "\n return compFromText;")();
const colorFromHtml = new Function(slice("const COLOR_JUNK", "function titleCase") + "\n return colorFromHtml;")();
const { validComp } = new Function(
  slice("const COMP_ITEM_RX", "// ── 페이지 HTML 전체에서 혼용률") + "\n return { validComp, validColor };")();

// 원단이 둘이면 항목에 line 번호가 달려 온다 — 줄로 나눠 담는다.
// (이 변환을 빠뜨리면 '[object Object]' 가 저장된다)
const asComp = (v) => {
  if (!Array.isArray(v)) return String(v || "").trim();
  const lines = [];
  for (const c of v) {
    const n = c.line || 0;
    (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`);
  }
  return lines.filter(Boolean).map((l) => l.join(" / ")).join("\n");
};

const api = async (qs, init) => {
  const r = await fetch(WORKER + "/?" + qs + tok, { signal: AbortSignal.timeout(45000), ...(init || {}) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
};

// ── 대상 고르기 ─────────────────────────────────────────────────
const catalogs = ((await api("catalogs=1")).list || []).filter((c) => c && c.site && (c.count || 0) > 0);
let targets = [];
for (const c of catalogs) {
  if (want.length && !want.includes(String(c.brand || "").toLowerCase())) continue;
  targets.push(c);
}
if (!want.length) {
  // 비어 있는 순서대로. 오버레이를 읽어 혼용률이 없는 상품 수를 센다.
  const scored = [];
  for (const c of targets) {
    let ov = {};
    try { ov = await api("comps=" + encodeURIComponent(c.site)); } catch (e) {}
    let filled = 0;
    for (const o of Object.values(ov || {})) if (o && validComp(String(o.comp || "").trim())) filled++;
    const miss = c.count - filled;
    if (miss > 30) scored.push({ ...c, miss, rate: filled / c.count });
  }
  scored.sort((a, b) => a.rate - b.rate || b.miss - a.miss);
  targets = scored.slice(0, TOP);
} else {
  targets = targets.slice(0, TOP);
}

if (!targets.length) { console.log("대상 브랜드 없음"); process.exit(0); }
console.log(`대상 ${targets.length}개: ${targets.map((t) => t.brand).join(", ")}\n`);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const ctx = await browser.newContext({
  userAgent: UA, locale: "en-US", viewport: { width: 1366, height: 1400 },
});
// 이미지·폰트·영상은 받지 않는다. 혼용률은 글자에만 있고, 안 받으면 몇 배 빠르다.
await ctx.route("**/*", (route) => {
  const t = route.request().resourceType();
  return (t === "image" || t === "font" || t === "media") ? route.abort() : route.continue();
});

const rows = [];
let grandFilled = 0, grandTried = 0;

for (const c of targets) {
  let cat, overlay = {};
  try { cat = await api("catalog=" + encodeURIComponent(c.site)); }
  catch (e) { console.log(`  !! ${c.brand} 카탈로그 읽기 실패: ${e.message}`); continue; }
  try { overlay = await api("comps=" + encodeURIComponent(c.site)); } catch (e) { overlay = {}; }

  // 이미 옳은 혼용률이 있는 상품은 건너뛴다.
  const todo = (cat.items || [])
    .filter((p) => p && p.productUrl && !validComp(String((overlay[p.productUrl] || {}).comp || "").trim()))
    .slice(0, PER_BRAND);
  if (!todo.length) { console.log(`  · ${c.brand} — 채울 것 없음`); continue; }

  const stat = { ok: 0, none: 0, blocked: 0, err: 0 };
  const patch = {};
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(TABS, todo.length) }, async () => {
    const page = await ctx.newPage();
    try {
      while (i < todo.length) {
        const p = todo[i++];
        try {
          const resp = await page.goto(p.productUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
          const status = resp ? resp.status() : 0;
          if (status >= 400) { stat.blocked++; continue; }
          // 소재 정보가 접힌 탭 안에 있는 사이트가 많다. 펼쳐 두고 읽는다.
          await page.evaluate(() => {
            for (const d of document.querySelectorAll("details")) d.open = true;
            const rx = /composition|material|fabric|소재|혼용|content/i;
            for (const b of document.querySelectorAll('button,[role="button"],summary,[aria-expanded="false"]')) {
              if (rx.test(b.textContent || "") || rx.test(b.getAttribute("aria-label") || "")) {
                try { b.click(); } catch (e) {}
              }
            }
          }).catch(() => {});
          await page.waitForTimeout(600);
          const html = await page.content();
          const comp = asComp(compFromHtml(html)) ||
            asComp(compFromText(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ")));
          const color = colorFromHtml(html);
          if (validComp(comp)) {
            patch[p.productUrl] = { comp, ...(color ? { color } : {}) };
            stat.ok++;
          } else {
            // 페이지는 멀쩡히 읽었는데 소재 표기가 없다 = 사이트가 안 적는다.
            patch[p.productUrl] = { none: 1, ...(color ? { color } : {}) };
            stat.none++;
          }
        } catch (e) {
          const msg = String((e && e.message) || e);
          if (/net::ERR|Timeout/i.test(msg)) stat.blocked++; else stat.err++;
        }
      }
    } finally { await page.close().catch(() => {}); }
  }));

  grandFilled += stat.ok; grandTried += todo.length;
  const line = `${c.brand} — 시도 ${todo.length} · ✅ ${stat.ok} · 미표기 ${stat.none} · 차단/타임아웃 ${stat.blocked} · 오류 ${stat.err}`;
  console.log("  · " + line);
  rows.push({ brand: c.brand, site: c.site, total: c.count, ...stat, tried: todo.length });

  if (STORE && Object.keys(patch).length) {
    // 오버레이는 통째로 저장한다(Worker 는 본문을 그대로 KV 에 넣기만 한다).
    // 기존 값을 잃지 않도록 여기서 합친다 — 새 값이 이긴다.
    const merged = { ...overlay };
    const now = Date.now();
    for (const [u, v] of Object.entries(patch)) merged[u] = { ...(merged[u] || {}), ...v, t: now };
    let saved = false;
    for (let a = 0; a < 3 && !saved; a++) {
      try {
        const r = await fetch(`${WORKER}/?store=overlay&site=${encodeURIComponent(c.site)}${tok}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(merged), signal: AbortSignal.timeout(45000),
        });
        const j = await r.json().catch(() => null);
        if (j && j.ok) saved = true;
        else if (a === 2) console.log(`    !! 저장 실패 HTTP ${r.status}`);
      } catch (e) { if (a === 2) console.log(`    !! 저장 오류 ${String(e.message || e)}`); }
      if (!saved) await new Promise((r2) => setTimeout(r2, 2000));
    }
  }
}

await browser.close();

const md = [
  `# 혼용률 보강 — 진짜 크롬 (${new Date().toISOString().slice(0, 16).replace("T", " ")}Z)`,
  "",
  "평 fetch 로는 차단되는 브랜드를 진짜 크롬으로 다시 읽은 결과입니다.",
  "",
  `- 시도 ${grandTried}개 · **채움 ${grandFilled}개** (${grandTried ? Math.round((grandFilled / grandTried) * 100) : 0}%)`,
  STORE ? "" : "- (저장하지 않음 — DRY 실행)",
  "",
  "| 브랜드 | 상품 | 시도 | 채움 | 사이트 미표기 | 차단·타임아웃 | 오류 |",
  "|---|---:|---:|---:|---:|---:|---:|",
  ...rows.map((r) => `| ${r.brand} | ${r.total} | ${r.tried} | **${r.ok}** | ${r.none} | ${r.blocked} | ${r.err} |`),
  "",
  "차단·타임아웃이 대부분이면 진짜 크롬으로도 안 된다는 뜻이므로, 그 브랜드는",
  "사람 PC 의 확장(가정용 IP)이 맡아야 합니다. '사이트 미표기'가 대부분이면",
  "더 할 수 있는 것이 없습니다 — 엑셀에 '정보 없음'으로 나갑니다.",
  "",
].join("\n");
writeFileSync(join(ROOT, "enrich-browser-report.md"), md);
console.log(`\n총 ${grandFilled}/${grandTried} 채움 · 리포트: enrich-browser-report.md`);
