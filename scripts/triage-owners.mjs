#!/usr/bin/env node
// 담당 재분류 — 어느 브랜드를 서버가 맡고 어느 브랜드를 확장이 맡아야 하는가.
//
// 지금 구분은 "서버 스크래퍼가 목록 페이지를 긁을 수 있나"로 나뉘어 있다. 그런데
// 혼용률에 필요한 것은 **상품 페이지**를 읽을 수 있느냐다. 둘은 다르다 —
// Aritzia·H&M 은 목록은 긁히는데 상품 페이지가 막혀서, 카탈로그는 쌓이지만
// 혼용률은 영원히 0% 였다.
//
// 확장이 쓸 수 있는 시간은 하룻밤 6시간뿐이라 아무 브랜드나 얹으면 안 된다.
// 그래서 양방향으로 본다:
//   서버 → 확장 : 서버 IP 로 상품 페이지가 막히는 브랜드 (혼용률을 못 채운다)
//   확장 → 서버 : 서버 IP 로 잘 읽히는데 확장이 붙들고 있는 브랜드 (밤 시간 낭비)
//   어느 쪽도 무의미 : 사이트가 혼용률을 아예 안 적는 브랜드 (확장 시간을 쓰면 안 된다)
//
// 읽기만 한다. 결론은 triage-owners.md 와 화면에 낸다.
// env: WORKER_URL, WORKER_TOKEN, RENDER_URL, SAMPLE(브랜드당 표본, 기본 4)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const SAMPLE = Math.max(2, Number(process.env.SAMPLE) || 4);
const tok = "&token=" + encodeURIComponent(TOKEN);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// 추출·판정 규칙은 worker 에서 그대로 떼어 온다 — 복사본이면 진단과 실제가 어긋난다.
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const slice = (a, b) => {
  const i = src.indexOf(a), j = src.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error("worker 블록을 찾지 못함: " + a);
  return src.slice(i, j);
};
const compFromText = new Function(slice("const FIBRES = {", "function titleCase") + "\n return compFromText;")();
const compFromHtml = new Function(slice("const FIBRES = {", "function titleCase") + "\n return compFromHtml;")();
const { validComp } = new Function(
  slice("const COMP_ITEM_RX", "// ── 페이지 HTML 전체에서 혼용률") + "\n return { validComp };",
)();
// 한 옷에 원단이 둘이면 항목에 line 번호가 달려 온다 — 줄로 나눠 담는다.
// (enrich-comp.mjs 와 같은 규칙. 줄 번호를 무시하고 " / " 로 합치면 두 줄짜리가
//  한 줄 200% 가 되어 판정에서 탈락한다)
const asComp = (v) => {
  if (!Array.isArray(v)) return String(v || "").trim();
  const lines = [];
  for (const c of v) {
    const n = c.line || 0;
    (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`);
  }
  return lines.filter(Boolean).map((l) => l.join(" / ")).join("\n");
};

// 혼용률이 페이지에 '있기는 한지' — 섬유 이름과 퍼센트가 붙어 있어야 한다.
// 페이지 어딘가의 "20% Off" 와 아래 소재 안내가 따로 걸리면 안 된다.
const FIBRE = "cotton|polyester|elastane|spandex|nylon|polyamide|wool|silk|linen|flax|viscose|rayon|modal|lyocell|tencel|cashmere|acrylic|acetate|triacetate|cupro|ramie|hemp|bamboo|mohair|alpaca" +
  "|면|코튼|폴리에스터|폴리에스테르|나일론|울|양모|실크|견|린넨|마|비스코스|레이온|모달|텐셀|아크릴|캐시미어|스판덱스";
const NEAR = new RegExp(`(?:\\d{1,3}\\s*%[^%]{0,20}?(?:${FIBRE}))|(?:(?:${FIBRE})[^%]{0,20}?\\d{1,3}\\s*%)`, "i");
const strip = (h) => String(h || "").replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

async function getText(url, accept, ms = 20000) {
  const r = await fetch(url, {
    headers: { "user-agent": UA, accept: accept || "text/html,*/*;q=0.8", "accept-language": "en-US,en;q=0.9" },
    redirect: "follow", signal: AbortSignal.timeout(ms),
  });
  if (!r.ok) { const e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
  return r.text();
}

// 서버 IP 로 이 상품 페이지를 읽고 혼용률을 뽑을 수 있는가.
async function probe(url) {
  const m = url.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
  if (m) {
    try {
      const j = JSON.parse(await getText(`${m[1]}/products/${m[2]}.json`, "application/json", 12000));
      const body = String((j && j.product && j.product.body_html) || "").replace(/<[^>]+>/g, " ");
      if (validComp(asComp(compFromText(body)))) return "성공";
    } catch (e) { /* 다음 */ }
  }
  let html;
  try { html = await getText(url); } catch (e) { return "차단"; }
  if (validComp(asComp(compFromHtml(html)) || asComp(compFromText(strip(html))))) return "성공";
  return NEAR.test(strip(html)) || NEAR.test(html) ? "규칙누락" : "정보없음";
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; await fn(items[k]); }
  }));
}

const getJson = async (u) => (await fetch(u, { signal: AbortSignal.timeout(45000) })).json();

const [brands, blocked, catalogs] = await Promise.all([
  getJson(`${RENDER}/brands.json`),
  getJson(`${RENDER}/blocked-brands.json`),
  getJson(`${WORKER}/?catalogs=1${tok}`),
]);
const inExt = new Set((blocked.brands || []).map(norm));
const inBrw = new Set((blocked.browser || []).map(norm));
const list = (catalogs.list || []);

console.log(`브랜드 ${list.length}개를 상품 페이지 기준으로 다시 나눈다 (브랜드당 표본 ${SAMPLE})\n`);

const rows = [];
await pool(list, 6, async (c) => {
  let cat, ov;
  try {
    [cat, ov] = await Promise.all([
      getJson(`${WORKER}/?catalog=${encodeURIComponent(c.site)}${tok}`),
      getJson(`${WORKER}/?comps=${encodeURIComponent(c.site)}${tok}`).catch(() => ({})),
    ]);
  } catch (e) { return; }
  const items = (cat.items || []).filter((p) => p && p.productUrl);
  if (!items.length) return;
  const missing = items.filter((p) => !validComp(String((ov[p.productUrl] || {}).comp || "")));
  const name = cat.brand || c.site;
  const owner = inExt.has(norm(name)) ? "확장" : inBrw.has(norm(name)) ? "헤드리스" : "서버";
  const filled = 1 - missing.length / items.length;
  // 이미 다 찬 브랜드는 건드릴 이유가 없다.
  if (!missing.length) { rows.push({ name, site: c.site, owner, filled, n: items.length, verdict: "그대로", by: {} }); return; }

  const pick = missing.slice(0, SAMPLE);
  const by = {};
  // 어느 상품을 보고 그렇게 판정했는지 남긴다 — 사람이 직접 열어 확인할 수 있어야 한다.
  const seen = [];
  await pool(pick, 3, async (p) => {
    const k = await probe(p.productUrl).catch(() => "차단");
    by[k] = (by[k] || 0) + 1;
    seen.push({ k, url: p.productUrl });
  });
  const share = (k) => (by[k] || 0) / pick.length;
  // 판정 — 표본의 과반으로 정한다.
  const verdict =
    share("차단") >= 0.5 ? "확장 필요"
      : share("정보없음") >= 0.5 ? "정보 없음"
        : share("규칙누락") >= 0.5 ? "규칙 보완"
          : "서버 가능";
  rows.push({ name, site: c.site, owner, filled, n: items.length, missing: missing.length, verdict, by, seen });
});

const pct = (x) => Math.round(x * 100) + "%";
const group = (v) => rows.filter((r) => r.verdict === v).sort((a, z) => (z.missing || 0) - (a.missing || 0));

// 옮겨야 할 것만 추린다 — 이미 맞게 놓인 브랜드는 조용히 둔다.
const toExt = group("확장 필요").filter((r) => r.owner === "서버");
const toSrv = group("서버 가능").filter((r) => r.owner === "확장");
const noPoint = group("정보 없음").filter((r) => r.owner === "확장");
const fixRule = group("규칙 보완");

let md = `# 담당 재분류 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
md += `상품 페이지를 서버 IP 로 읽을 수 있는지로 나눴다. 목록 페이지가 긁히는 것과는 다른 문제다 —\n`;
md += `목록은 되는데 상품 페이지가 막히면 카탈로그는 쌓이지만 혼용률은 영원히 0% 다.\n\n`;
md += `| 판정 | 브랜드 | 뜻 |\n|---|---:|---|\n`;
md += `| 확장 필요 | ${group("확장 필요").length} | 서버 IP 로 상품 페이지가 막힌다 |\n`;
md += `| 서버 가능 | ${group("서버 가능").length} | 서버로 읽힌다 |\n`;
md += `| 규칙 보완 | ${group("규칙 보완").length} | 읽히는데 우리가 못 뽑는다 |\n`;
md += `| 정보 없음 | ${group("정보 없음").length} | 사이트가 혼용률을 안 적는다 |\n`;
md += `| 그대로 | ${group("그대로").length} | 이미 다 찼다 |\n\n`;

const table = (arr) => `| 브랜드 | 지금 담당 | 채움 | 빈 상품 | 표본 |\n|---|---|---:|---:|---|\n` +
  arr.map((r) => `| ${r.name} | ${r.owner} | ${pct(r.filled)} | ${r.missing} | ${Object.entries(r.by).map(([k, v]) => `${k} ${v}`).join(" · ")} |`).join("\n") + "\n\n";

if (toExt.length) {
  md += `## ⛔ 서버 → 확장 (${toExt.length})\n\n서버가 아무리 돌아도 이 브랜드의 혼용률은 안 채워진다.\n\n` + table(toExt);
}
if (toSrv.length) {
  md += `## ↩ 확장 → 서버 (${toSrv.length})\n\n서버 IP 로 잘 읽힌다. 확장이 붙들고 있으면 밤 시간만 쓴다 — 확장 목록에서 빼면\n`;
  md += `그 시간이 정말 확장이 필요한 브랜드로 간다.\n\n` + table(toSrv);
}
// 혼용률을 아예 안 적는 브랜드는 담당과 무관하게 전부 낸다 — 엑셀에 '정보 없음'으로
// 표시할 대상이고, 사람이 직접 열어 확인할 수 있게 상품 URL 도 붙인다.
const noneAll = group("정보 없음");
if (noneAll.length) {
  md += `## — 사이트가 혼용률을 안 적는 브랜드 (${noneAll.length})\n\n`;
  md += `표본을 열어 봤는데 페이지 어디에도 소재 표기가 없었다. 아무리 다시 읽어도 안 나온다.\n`;
  md += `엑셀에서는 '확인 필요' 가 아니라 '정보 없음' 으로 나가야 하는 대상이다.\n\n`;
  md += `| 브랜드 | 담당 | 채움 | 빈 상품 | 확인한 상품 URL |\n|---|---|---:|---:|---|\n`;
  for (const r of noneAll) {
    const u = (r.seen || []).filter((x) => x.k === "정보없음").slice(0, 2).map((x) => x.url);
    md += `| ${r.name} | ${r.owner} | ${pct(r.filled)} | ${r.missing} | ${u.join("<br>") || "-"} |\n`;
  }
  md += `\n`;
}
if (noPoint.length) {
  md += `### 그중 확장이 시간을 쓰고 있는 브랜드 (${noPoint.length})\n\n`;
  md += `수집은 계속해야 하지만(빼면 상품이 낡는다) 혼용률 찾기에는 시간을 덜 써야 한다.\n\n` + table(noPoint);
}
if (fixRule.length) {
  md += `## 🔧 규칙 보완 (${fixRule.length})\n\n페이지에 값이 있는데 못 뽑는다. 담당을 옮길 문제가 아니라 추출 규칙 문제다.\n\n` + table(fixRule);
}
writeFileSync(join(ROOT, "triage-owners.md"), md);

console.log(`확장 필요 ${group("확장 필요").length} · 서버 가능 ${group("서버 가능").length} · 규칙 보완 ${group("규칙 보완").length} · 정보 없음 ${group("정보 없음").length} · 그대로 ${group("그대로").length}`);
console.log(`\n옮길 것 — 서버→확장 ${toExt.length}개 · 확장→서버 ${toSrv.length}개 · 확장에서 뺄 것(정보 없음) ${noPoint.length}개`);
for (const r of toExt) console.log(`  ⛔ ${r.name} (빈 상품 ${r.missing})`);
for (const r of toSrv) console.log(`  ↩ ${r.name} (빈 상품 ${r.missing})`);
for (const r of noPoint) console.log(`  — ${r.name} (빈 상품 ${r.missing})`);
console.log(`\n자세한 내용은 triage-owners.md`);
