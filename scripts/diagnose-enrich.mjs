#!/usr/bin/env node
// 왜 혼용률이 안 채워지는지 가려낸다.
//
// 야간 보강은 실패한 상품에 '시도 시각'을 찍고 RETRY_DAYS 동안 건너뛴다. 덕분에
// 예산이 새지는 않지만, 대신 "왜 실패했는지"가 리포트에서 사라진다 — 매 실행이
// +0 으로만 보이고 원인을 알 수 없다. 여기서는 재시도 창을 무시하고 소수만
// 표본으로 다시 읽어, 실패를 세 가지로 나눈다:
//
//   ① 차단        — 페이지를 아예 못 받았다. IP 문제라 확장(가정용 IP)이 맡아야 한다.
//   ② 규칙 누락   — 페이지는 받았고 본문에 섬유 이름+% 가 보이는데 못 뽑았다. 우리 잘못이다.
//   ③ 정보 없음   — 페이지를 받았는데 본문에 혼용률 자체가 없다. 사이트가 안 적는다.
//
// ②가 많으면 추출 규칙을 고쳐야 하고, ①이 많으면 그 브랜드를 확장 담당으로 옮겨야
// 하며, ③이면 더 할 수 있는 게 없다. 셋을 섞어 놓으면 판단이 안 된다.
//
// 읽기만 한다 — 저장은 하지 않는다.
// env: WORKER_URL, WORKER_TOKEN, BRANDS(쉼표, 비우면 채움률 낮은 순 상위), TOP(기본 12), SAMPLE(브랜드당, 기본 8)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const TOP = Math.max(1, Number(process.env.TOP) || 12);
const SAMPLE = Math.max(1, Number(process.env.SAMPLE) || 8);
const want = (process.env.BRANDS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const tok = "&token=" + encodeURIComponent(TOKEN);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

// 추출 규칙은 worker 에서 그대로 떼어 온다 — 복사본을 만들면 진단과 실제가 어긋난다.
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const slice = (a, b) => {
  const i = workerSrc.indexOf(a), j = workerSrc.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error("worker 블록을 찾지 못함: " + a);
  return workerSrc.slice(i, j);
};
const compFromText = new Function(slice("const FIBRES = {", "function titleCase") + "\n return compFromText;")();
const compFromHtml = new Function(slice("const FIBRES = {", "function titleCase") + "\n return compFromHtml;")();
const { validComp } = new Function(
  slice("const COMP_ITEM_RX", "// ── 페이지 HTML 전체에서 혼용률") + "\n return { validComp };",
)();
const asComp = (v) => (Array.isArray(v) ? v.map((c) => `${c.material} ${c.percent}%`).join(" / ") : String(v || "").trim());

// 본문에 혼용률 '재료'가 보이는지 — 규칙 누락과 정보 없음을 가르는 잣대.
//
// 섬유 이름과 퍼센트가 **붙어 있어야** 한다. "페이지 어딘가에 % 가 있고 어딘가에
// 섬유 이름이 있다"로 판정하면, 상단 판촉 배너("20% Off Your First Order")와
// 한참 아래 소재 안내 문구가 따로 걸려서 없는 혼용률을 있다고 센다 — 첫 진단이
// 그 탓에 '규칙 누락'을 부풀려 셌다.
//
// 대신 worker 의 COMP_RX 보다는 넓게 잡는다. 똑같이 잡으면 정의상 어긋날 일이
// 없어져서 진단이 아무것도 못 찾는다. 섬유 이름을 더 많이 알고, 사이 문자도
// 너그럽게 둔다("Cotton – 60%", "Cotton / Polyester 60/40" 같은 표기).
const FIBRE_WORDS = "cotton|polyester|elastane|spandex|nylon|polyamide|wool|silk|linen|flax|viscose|rayon|modal|lyocell|tencel|cashmere|acrylic|acetate|triacetate|cupro|ramie|hemp|bamboo|mohair|alpaca|leather|down|feather" +
  "|면|코튼|폴리에스터|폴리에스테르|나일론|울|양모|실크|견|린넨|마|비스코스|레이온|모달|텐셀|아크릴|캐시미어|스판덱스|폴리우레탄";
const NEAR_RX = new RegExp(
  `(?:\\d{1,3}\\s*%[^%]{0,20}?(?:${FIBRE_WORDS}))|(?:(?:${FIBRE_WORDS})[^%]{0,20}?\\d{1,3}\\s*%)`, "i");
function looksLikeHasComp(text) {
  return NEAR_RX.test(String(text || ""));
}

async function getText(url, accept, ms = 20000) {
  const r = await fetch(url, {
    headers: { "user-agent": UA, accept: accept || "text/html,*/*;q=0.8", "accept-language": "en-US,en;q=0.9" },
    redirect: "follow", signal: AbortSignal.timeout(ms),
  });
  if (!r.ok) { const e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
  return r.text();
}

// 한 상품을 실제 경로대로 읽어 보고, 실패면 이유를 분류해 돌려준다.
async function probe(url) {
  // ① Shopify JSON
  const m = url.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
  if (m) {
    try {
      const j = JSON.parse(await getText(`${m[1]}/products/${m[2]}.json`, "application/json", 12000));
      const body = String((j && j.product && j.product.body_html) || "").replace(/<[^>]+>/g, " ");
      const c = asComp(compFromText(body));
      if (validComp(c)) return { ok: true, via: "쇼피JSON", comp: c };
      if (looksLikeHasComp(body)) return { ok: false, why: "규칙 누락", where: "쇼피JSON 본문", sample: snippet(body) };
    } catch (e) { /* 다음 경로 */ }
  }
  // ② 페이지 직접
  let html = "";
  try { html = await getText(url); }
  catch (e) { return { ok: false, why: "차단", where: `직접 ${e.status || e.name || "실패"}` }; }
  const c2 = asComp(compFromHtml(html)) || asComp(compFromText(stripTags(html)));
  if (validComp(c2)) return { ok: true, via: "페이지", comp: c2 };
  const text = stripTags(html);
  if (looksLikeHasComp(text)) return { ok: false, why: "규칙 누락", where: "페이지 본문", sample: snippet(text) };
  if (looksLikeHasComp(html)) return { ok: false, why: "규칙 누락", where: "페이지 JSON/스크립트", sample: snippet(html) };
  return { ok: false, why: "정보 없음", where: `본문 ${text.length}자` };
}

const stripTags = (h) => String(h || "")
  .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// 사람이 읽고 판단할 수 있게, 퍼센트가 나오는 곳 주변만 잘라 보여 준다.
function snippet(t) {
  const s = String(t || "");
  // 판정에 쓴 것과 같은 자리를 보여 준다 — 다른 자리를 보여 주면 오해를 부른다.
  const i = s.search(NEAR_RX);
  if (i < 0) return "";
  return s.slice(Math.max(0, i - 60), i + 140).replace(/\s+/g, " ").trim();
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; await fn(items[k]); }
  }));
}

const ls = await fetch(`${WORKER}/?catalogs=1${tok}`).then((r) => r.json());
let cats = (ls.list || []).filter((c) => (c.count || 0) >= 10);
if (want.length) {
  cats = cats.filter((c) => want.some((w) =>
    String(c.brand || "").toLowerCase().includes(w) || String(c.site || "").toLowerCase().includes(w)));
}

// 채움률이 낮은 브랜드부터 본다 — 이미 다 찬 브랜드는 진단할 게 없다.
const scored = [];
for (const c of cats) {
  let ov = {};
  try { ov = await fetch(`${WORKER}/?comps=${encodeURIComponent(c.site)}${tok}`).then((r) => r.json()); } catch (e) {}
  let cat;
  try { cat = await fetch(`${WORKER}/?catalog=${encodeURIComponent(c.site)}${tok}`).then((r) => r.json()); } catch (e) { continue; }
  const items = (cat.items || []).filter((p) => p && p.productUrl);
  if (!items.length) continue;
  const missing = items.filter((p) => !validComp(String((ov[p.productUrl] || {}).comp || "")));
  scored.push({ brand: cat.brand || c.site, site: c.site, total: items.length, missing });
}
scored.sort((a, z) => (z.missing.length / z.total) - (a.missing.length / a.total));
const targets = scored.filter((r) => r.missing.length).slice(0, want.length ? scored.length : TOP);

console.log(`혼용률이 빈 상품을 브랜드당 ${SAMPLE}개씩 다시 읽어 원인을 가른다 (브랜드 ${targets.length}개)\n`);

const totals = { "규칙 누락": 0, "차단": 0, "정보 없음": 0, "성공": 0 };
const perBrand = [];   // 리포트용 — 브랜드마다 어느 원인이 몇 개였는지
for (const t of targets) {
  const pick = t.missing.slice(0, SAMPLE);
  const res = [];
  await pool(pick, 4, async (p) => { res.push(await probe(p.productUrl).catch((e) => ({ ok: false, why: "차단", where: String(e.message || e) }))); });
  const by = {};
  for (const r of res) {
    const k = r.ok ? "성공" : r.why;
    by[k] = (by[k] || 0) + 1;
    totals[k] = (totals[k] || 0) + 1;
  }
  const pct = Math.round((1 - t.missing.length / t.total) * 100);
  perBrand.push({ brand: t.brand, site: t.site, pct, missing: t.missing.length, total: t.total, n: pick.length, by });
  console.log(`${t.brand} (${t.site}) — 채움 ${pct}% · 빈 상품 ${t.missing.length}/${t.total} · 표본 ${pick.length}`);
  console.log(`   ${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
  // 규칙 누락이면 실제 본문을 보여 준다 — 이걸 보고 추출 규칙을 고친다.
  const gap = res.find((r) => !r.ok && r.why === "규칙 누락" && r.sample);
  if (gap) console.log(`   ↳ 못 뽑은 본문(${gap.where}): …${gap.sample}…`);
  const okOne = res.find((r) => r.ok);
  if (okOne) console.log(`   ↳ 다시 읽으니 나온다(${okOne.via}): ${okOne.comp} — 재시도 창 때문에 안 채워지고 있었다`);
  console.log("");
}

console.log("── 합계 ──");
for (const [k, v] of Object.entries(totals)) if (v) console.log(`  ${k}: ${v}`);
// ── 리포트 파일 ─────────────────────────────────────────────────
// 원인별로 손댈 곳이 다르므로, 브랜드를 원인으로 묶어서 낸다. 특히 '차단'이
// 대부분인 브랜드는 서버가 아무리 돌아도 안 채워진다 — 확장 담당으로 옮겨야 한다.
const share = (r, k) => (r.n ? (r.by[k] || 0) / r.n : 0);
const blockedBrands = perBrand.filter((r) => share(r, "차단") >= 0.5);
const gapBrands = perBrand.filter((r) => share(r, "규칙 누락") >= 0.5);
const waitingBrands = perBrand.filter((r) => share(r, "성공") >= 0.5);
const noneBrands = perBrand.filter((r) => share(r, "정보 없음") >= 0.5);

let md = `# 혼용률 미채움 원인 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
md += `브랜드 ${perBrand.length}개 · 표본 ${Object.values(totals).reduce((a, b) => a + b, 0)}개\n\n`;
md += `| 원인 | 표본 | 손댈 곳 |\n|---|---:|---|\n`;
md += `| 성공 | ${totals["성공"] || 0} | 재시도 창에 갇혀 있을 뿐 — RETRY_ALL=1 로 한 번 돌리면 채워진다 |\n`;
md += `| 차단 | ${totals["차단"] || 0} | 서버 IP 로는 못 읽는다 — 확장(가정용 IP) 담당으로 옮겨야 한다 |\n`;
md += `| 규칙 누락 | ${totals["규칙 누락"] || 0} | 페이지에 값이 있는데 못 뽑았다 — 추출 규칙을 고친다 |\n`;
md += `| 정보 없음 | ${totals["정보 없음"] || 0} | 사이트가 안 적는다 — 더 할 수 있는 게 없다 |\n\n`;

if (blockedBrands.length) {
  md += `## ⛔ 확장 담당으로 옮겨야 하는 브랜드 (${blockedBrands.length})\n\n`;
  md += `표본의 절반 이상이 '차단'이다. 서버 프리페치가 아무리 돌아도 이 브랜드의\n`;
  md += `혼용률은 안 채워진다. Render 저장소의 \`public/blocked-brands.json\` 의\n`;
  md += `\`brands\` 에 넣으면 확장이 05:00 에 수집·보강한다.\n\n`;
  md += `| 브랜드 | 저장 키 | 빈 상품 | 표본 차단 |\n|---|---|---:|---:|\n`;
  for (const r of blockedBrands) md += `| ${r.brand} | ${r.site} | ${r.missing}/${r.total} | ${r.by["차단"] || 0}/${r.n} |\n`;
  md += `\n`;
}
if (gapBrands.length) {
  md += `## 🔧 추출 규칙을 고쳐야 하는 브랜드 (${gapBrands.length})\n\n`;
  md += `| 브랜드 | 저장 키 | 빈 상품 | 표본 규칙누락 |\n|---|---|---:|---:|\n`;
  for (const r of gapBrands) md += `| ${r.brand} | ${r.site} | ${r.missing}/${r.total} | ${r.by["규칙 누락"] || 0}/${r.n} |\n`;
  md += `\n`;
}
if (waitingBrands.length) {
  md += `## ⏳ 다시 읽기만 하면 채워지는 브랜드 (${waitingBrands.length})\n\n`;
  md += waitingBrands.map((r) => `${r.brand}(${r.missing})`).join(" · ") + `\n\n`;
}
if (noneBrands.length) {
  md += `## — 사이트가 혼용률을 안 적는 브랜드 (${noneBrands.length})\n\n`;
  md += noneBrands.map((r) => r.brand).join(" · ") + `\n\n`;
}
writeFileSync(join(ROOT, "enrich-diagnosis.md"), md);

console.log(`
읽는 법:
  성공      = 지금 읽으면 나온다. 재시도 창(RETRY_DAYS) 때문에 안 채워지고 있을 뿐이다.
  규칙 누락 = 페이지에 값이 있는데 우리가 못 뽑았다. 추출 규칙을 고쳐야 한다.
  차단      = 페이지를 못 받았다. 이 브랜드는 확장(가정용 IP) 담당으로 옮겨야 한다.
  정보 없음 = 사이트가 혼용률을 안 적는다. 더 할 수 있는 게 없다.`);
