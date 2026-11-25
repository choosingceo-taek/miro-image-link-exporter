#!/usr/bin/env node
// 현장 지도(field map) 만들기 — field-measure-*.json(측정 결과)을 모아 docs/field-map.md 와 field-map.json 을 쓴다.
// 네트워크를 쓰지 않는다(저장소 안의 파일만 읽는다).
//
//   node scripts/build-field-map.mjs [측정 파일 …]   (비우면 저장소의 field-measure-*.json 전부 — 같은 브랜드는 나중 측정이 이긴다)
//
// 칸의 뜻(브랜드 × 항목):
//   ✅ n/r 출처     읽힌 상품 r 개 중 n 개에서 그 항목을 읽었다(출처: shopify·jsonld·meta·dom·page·parts-json)
//   📭 없음         상품 페이지는 읽혔는데 그 항목이 어디에도 없었다(사이트가 안 적음 — 또는 우리 규칙 밖, 아래 '흔적' 참고)
//   ⛔ 막힘         상품 페이지를 어느 무료 엔진으로도 못 읽었다(차단 화면·껍데기). '안 적음'으로 세지 않는다.
//   🔗 표본 없음    카탈로그에 상품 주소가 없다(목록 수집 문제 — 목록 담당).
// '읽힘' = 이 상품의 이름이 화면 글에 있는 페이지(productRead). 차단 화면·빈 껍데기는 읽힘이 아니다.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync(ROOT).filter((f) => /^field-measure-\d+\.json$/.test(f)).sort();
const FIELDS = [
  ["name", "상품명"], ["imgs", "사진 전부"], ["price", "판매가"], ["priceOrig", "정가(할인 시)"], ["cur", "통화"],
  ["color", "이 상품 컬러"], ["colors", "컬러 전부"], ["sizes", "사이즈"], ["sizesIn", "재고 사이즈"],
  ["comp", "혼용률"], ["desc", "설명"], ["feat", "디테일 글머리표"], ["sku", "상품 코드"],
];
const SRC = { shopify: "Shopify JSON", jsonld: "JSON-LD", meta: "메타 태그", dom: "본문 칸", page: "본문", "parts-json": "페이지 JSON", "shopify-json": "Shopify JSON" };
const has = (v) => (Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== "");

const runs = [];
const byBrand = new Map();
for (const f of files) {
  const j = JSON.parse(readFileSync(join(ROOT, f), "utf8"));
  runs.push({ file: f, runId: j.runId, at: j.at, ip: j.ip, part: j.part, brands: j.brands.length });
  for (const b of j.brands) {
    // 같은 브랜드를 여러 번 쟀으면 나중 것(파일 이름 순 = 실행 번호 순). 단, 나중 것이 시간 초과로 못 본 것이면 앞 것을 둔다.
    if (b.skipped && byBrand.has(b.brand)) continue;
    byBrand.set(b.brand, { ...b, runId: j.runId, ip: j.ip });
  }
}
const access = existsSync(join(ROOT, "access-map.json")) ? JSON.parse(readFileSync(join(ROOT, "access-map.json"), "utf8")) : { brands: [] };
const accessOf = new Map(access.brands.map((b) => [b.brand, b]));

// 브랜드 한 줄
function rowOf(b) {
  const prods = b.products || [];
  const read = prods.filter((p) => p.read);
  const engines = [...new Set(read.map((p) => p.engine).filter(Boolean))];
  const out = { brand: b.brand, site: b.site, total: b.total || 0, sampled: prods.length, read: read.length, engines, runId: b.runId, cells: {}, notes: [] };
  if (b.skipped) { out.state = "skipped"; out.notes.push(b.skipped); }
  else if (b.error) { out.state = "error"; out.notes.push(b.error); }
  else if (!prods.length) { out.state = "nosample"; }
  else if (!read.length) {
    out.state = "blocked";
    const ev = prods.map((p) => Object.entries(p.engines || {}).map(([e, r]) => `${e} ${r.v}${r.status ? " " + r.status : ""}`).join(", "));
    out.notes.push([...new Set(ev)].join(" / "));
    const a = accessOf.get(b.brand);
    if (a && a.product && a.product.cause) out.notes.push("접근 지도: " + a.product.cause);
  } else out.state = "read";
  for (const [k] of FIELDS) {
    if (out.state !== "read") { out.cells[k] = { s: out.state }; continue; }
    const got = read.filter((p) => has(p.got && p.got[k]));
    const src = [...new Set(got.map((p) => (p.src && p.src[k]) || (k === "name" || k === "imgs" ? "" : "")).filter(Boolean))];
    out.cells[k] = got.length ? { s: "ok", n: got.length, of: read.length, src } : { s: "none", n: 0, of: read.length };
  }
  // 흔적: 본문 칸 제목이 있었는데 디테일을 못 읽었나 · 클릭해야 그려지는 칸이었나
  const heads = [...new Set(read.flatMap((p) => (p.probe && p.probe.heads) || []))];
  if (heads.length) out.heads = heads.slice(0, 8);
  const click = read.filter((p) => p.clickOnly && p.clickOnly.featFirefox > p.clickOnly.featImpit);
  if (click.length) out.notes.push(`클릭해야 그려지는 디테일: impit ${click[0].clickOnly.featImpit}줄 → 파이어폭스 ${click[0].clickOnly.featFirefox}줄`);
  const plat = [...new Set(read.map((p) => p.probe && p.probe.platform).filter(Boolean))];
  if (plat.length) out.platform = plat.join("/");
  const state = [...new Set(read.flatMap((p) => (p.probe && p.probe.state) || []))];
  if (state.length) out.state_json = state;
  // 사람이 사이트와 대조할 표본 1개
  const s = read[0];
  if (s) {
    const g = s.got || {};
    out.sample = {
      url: s.url, name: s.name, engine: s.engine,
      read: {
        price: g.price || "", priceOrig: g.priceOrig || "", cur: g.cur || "", color: g.color || "", colors: (g.colors || []).slice(0, 6),
        sizes: (g.sizes || []).slice(0, 10), sizesIn: g.sizesIn ? g.sizesIn.slice(0, 10) : null, comp: g.comp || "", sku: g.sku || "",
        desc: String(g.desc || "").slice(0, 160), feat: (g.feat || []).slice(0, 6), imgs: (g.imgs || []).length,
      },
      fixture: (read.find((p) => p.fixture) || {}).fixture || null,
    };
  }
  if (b.byName) out.notes.push("상품 주소 모양이 규칙에 안 맞아 이름 있는 항목에서 표본을 골랐다");
  if (b.overlay && !b.overlay.error) out.stored = b.overlay;
  return out;
}

const rows = [...byBrand.values()].map(rowOf).sort((a, z) => a.brand.localeCompare(z.brand));
const totalProducts = rows.reduce((n, r) => n + r.total, 0);
// 항목별 요약 — '읽힘' 브랜드 중 그 항목을 읽은 수. 상품 수는 그 브랜드의 카탈로그 전체(3개 표본에서 미루어 본 값 — 추정).
// 읽힌 표본의 절반 이상에서 읽혔으면 그 브랜드는 '읽힘'으로 센다.
const summary = FIELDS.map(([k, label]) => {
  const ok = rows.filter((r) => r.cells[k] && r.cells[k].s === "ok" && r.cells[k].n * 2 >= r.cells[k].of);
  const none = rows.filter((r) => r.cells[k] && (r.cells[k].s === "none" || (r.cells[k].s === "ok" && r.cells[k].n * 2 < r.cells[k].of)));
  const blocked = rows.filter((r) => r.state === "blocked");
  const srcCount = {};
  for (const r of ok) for (const s of r.cells[k].src || []) srcCount[s] = (srcCount[s] || 0) + 1;
  return { key: k, label, brands: ok.length, products: ok.reduce((n, r) => n + r.total, 0), notStated: none.length, blocked: blocked.length, sources: srcCount };
});
// 저장값(오늘 Worker 오버레이) — 사이즈·컬러·가격·혼용률. 측정이 읽은 브랜드의 오버레이를 센 것(측정).
const storedSum = { items: 0, comp: 0, color: 0, sizes: 0, price: 0 };
for (const r of rows) if (r.stored) for (const k of Object.keys(storedSum)) storedSum[k] += r.stored[k] || 0;
// 페이지에서 읽히는 브랜드의 카탈로그 상품 수(추정 상한) — 오늘 저장값과 나란히.
const readable = (k) => rows.filter((r) => r.cells[k] && r.cells[k].s === "ok" && r.cells[k].n * 2 >= r.cells[k].of);
const after = {};
for (const k of ["sizes", "color", "price", "comp"]) {
  // 읽히는 브랜드는 전 상품, 아닌 브랜드는 오늘 저장값 그대로로 본다.
  const ok = new Set(readable(k === "color" ? "color" : k).map((r) => r.brand));
  if (k === "color") for (const r of readable("colors")) ok.add(r.brand);   // 컬러 전부만 읽혀도 상품 컬러 칸을 채울 수 있다(옵션 하나면 그 값)
  after[k] = rows.reduce((n, r) => n + (ok.has(r.brand) ? r.total : ((r.stored && r.stored[k]) || 0)), 0);
}

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const cellText = (c) => {
  if (!c) return "";
  if (c.s === "ok") return `✅ ${c.n}/${c.of} ${(c.src || []).map((s) => SRC[s] || s).join("·")}`;
  if (c.s === "none") return `📭 0/${c.of}`;
  if (c.s === "blocked") return "⛔";
  if (c.s === "nosample") return "🔗";
  return "…";
};
const esc = (s) => String(s == null ? "" : s).replace(/\|/g, "/").replace(/\n/g, " ");

let md = `# 상품 정보 현장 지도 (field map)\n\n`;
md += `> 만든 때 ${new Date().toISOString().slice(0, 16)}Z · 측정 실행 ${runs.map((r) => `${r.runId}(${r.part}, 러너 ${r.ip})`).join(" · ")}\n`;
md += `> 만드는 법: \`node scripts/build-field-map.mjs\` — 측정은 \`diagnose-page.yml\` mode=fields(읽기만, 로그에 \`STORE: 0\`).\n\n`;
md += `## 한눈에\n\n`;
md += `브랜드마다 카탈로그에서 상품 3개(앞·가운데·끝)를 골라 상품 페이지를 무료 엔진(impit → 파이어폭스)으로 열고, 항목마다 읽히는지와 어디서 읽히는지를 쟀다. `;
md += `상품 페이지는 브랜드 ${rows.filter((r) => r.state === "read").length}/${rows.length}개에서 읽혔고(${rows.filter((r) => r.state === "blocked").length}개는 막힘, ${rows.filter((r) => r.state === "nosample").length}개는 표본 없음), 카탈로그 상품은 모두 ${totalProducts.toLocaleString()}개다.\n\n`;
md += `| 항목 | 읽히는 브랜드 | 그 브랜드의 카탈로그 상품(추정) | 읽혔는데 없음(브랜드) | 막힘(브랜드) | 주된 출처 |\n|---|---:|---:|---:|---:|---|\n`;
for (const s of summary) {
  md += `| ${s.label} | ${s.brands} | ${s.products.toLocaleString()} (${pct(s.products, totalProducts)}%) | ${s.notStated} | ${s.blocked} | ${Object.entries(s.sources).sort((a, z) => z[1] - a[1]).map(([k, n]) => `${SRC[k] || k} ${n}`).join(" · ")} |\n`;
}
md += `\n- **측정한 것**: 표본 상품 페이지에서 그 항목이 읽혔는지·출처(칸마다 n/r). **추정한 것**: '카탈로그 상품' 열 — 표본 3개에서 읽히면 그 브랜드의 상품 전부가 같은 틀이라고 보고 더한 값이다.\n`;
md += `- '읽히는 브랜드' = 읽힌 표본의 절반 이상에서 그 항목이 나온 브랜드.\n\n`;
md += `### 사이즈·컬러·가격 — 오늘 저장값과 페이지에서 읽히는 몫\n\n`;
md += `| 항목 | 오늘 저장값(오버레이, 측정) | 페이지에서 읽히는 브랜드를 다 채우면(추정) |\n|---|---:|---:|\n`;
for (const [k, label] of [["sizes", "사이즈"], ["color", "컬러"], ["price", "가격"], ["comp", "혼용률"]]) {
  md += `| ${label} | ${storedSum[k].toLocaleString()}/${storedSum.items.toLocaleString()} (${pct(storedSum[k], storedSum.items)}%) | ${after[k].toLocaleString()}/${totalProducts.toLocaleString()} (${pct(after[k], totalProducts)}%) |\n`;
}
md += `\n가격은 카탈로그(목록 수집)에도 있어 화면에는 그쪽이 먼저 쓰인다 — 위 저장값은 오버레이(상품 페이지에서 읽은 값)만 센 것이다.\n\n`;

md += `## 브랜드별 (${rows.length})\n\n`;
md += `칸: ✅ 읽힌 수/읽힌 표본 · 출처 — 📭 읽혔는데 없음 — ⛔ 막힘 — 🔗 표본 없음\n\n`;
md += `| 브랜드 | 상품 | 읽힘 | ${FIELDS.map(([, l]) => l).join(" | ")} |\n|---|---:|---|${FIELDS.map(() => "---").join("|")}|\n`;
for (const r of rows) {
  md += `| ${esc(r.brand)} | ${r.total} | ${r.state === "read" ? `${r.read}/${r.sampled} ${r.engines.join("/")}` : r.state === "blocked" ? "⛔ 막힘" : r.state === "nosample" ? "🔗 표본 없음" : r.state} | ${FIELDS.map(([k]) => cellText(r.cells[k])).join(" | ")} |\n`;
}
md += `\n## 막힌 브랜드 — 무엇이 막았나\n\n`;
for (const r of rows.filter((x) => x.state === "blocked" || x.state === "nosample")) md += `- **${esc(r.brand)}** (${r.total}개) — ${esc(r.notes.join(" · ") || "카탈로그에 상품 주소가 없음")}\n`;
md += `\n## 사람이 확인할 표본 (브랜드당 1개)\n\n`;
md += `사이트를 열어 아래 값과 견주면 된다. 설명은 앞 160자, 디테일은 앞 6줄만 적었다. 시험 자료(HTML)는 \`scripts/fixtures/pages/\`.\n\n`;
for (const r of rows.filter((x) => x.sample)) {
  const s = r.sample, g = s.read;
  md += `<details><summary><b>${esc(r.brand)}</b> — ${esc(s.name)} (${s.engine})</summary>\n\n`;
  md += `- 주소: ${s.url}\n`;
  md += `- 가격 ${esc(g.price) || "—"}${g.priceOrig ? ` · 정가 ${esc(g.priceOrig)}` : ""} · 통화 ${g.cur || "—"} · 코드 ${esc(g.sku) || "—"}\n`;
  md += `- 컬러 ${esc(g.color) || "—"} · 컬러 전부 ${esc(g.colors.join(", ")) || "—"}\n`;
  md += `- 사이즈 ${esc(g.sizes.join(", ")) || "—"}${g.sizesIn ? ` · 재고 ${esc(g.sizesIn.join(", ")) || "(없음)"}` : ""}\n`;
  md += `- 혼용률 ${esc(g.comp) || "—"} · 사진 ${g.imgs}장\n`;
  md += `- 설명: ${esc(g.desc) || "—"}\n`;
  md += `- 디테일: ${g.feat.length ? g.feat.map(esc).join(" · ") : "—"}\n`;
  if (r.heads) md += `- 페이지의 칸 제목: ${r.heads.map(esc).join(" · ")}\n`;
  if (r.notes.length) md += `- 메모: ${r.notes.map(esc).join(" · ")}\n`;
  md += `\n</details>\n\n`;
}
writeFileSync(join(ROOT, "docs/field-map.md"), md);
writeFileSync(join(ROOT, "field-map.json"), JSON.stringify({ generated: new Date().toISOString(), runs, fields: FIELDS.map(([k, l]) => ({ key: k, label: l })),
  summary, stored: storedSum, readableAfter: after, totalProducts, brands: rows }, null, 1));
console.log(`docs/field-map.md · field-map.json — 브랜드 ${rows.length} · 읽힘 ${rows.filter((r) => r.state === "read").length}`);
