#!/usr/bin/env node
// 브랜드별 카테고리 분포 — 저장된 카탈로그가 tops/shirts/sweatshirts/dresses/pants 를
// 실제로 몇 개씩 갖고 있는지 본다. 카테고리 URL 등록 여부와 실제 분포는 다르다:
// 수집기가 상품명으로 재분류하므로, 전용 URL 이 없어도 그 카테고리가 채워질 수 있다.
//
// ?catalogs=1 한 번이면 되므로(카테고리 수가 메타데이터에 있다) 몇 초면 끝난다.
// env: WORKER_URL, WORKER_TOKEN, BRANDS(쉼표 구분, 비우면 상위 30개)

const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const CATS = ["tops", "shirts", "sweatshirts", "dresses", "pants"];
const want = (process.env.BRANDS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

const ls = await fetch(`${WORKER}/?catalogs=1&token=${encodeURIComponent(TOKEN)}`).then((r) => r.json());
// 브랜드명이 정확히 같아야만 걸리면 "왜 안 나오지" 를 진단할 수 없다 —
// 이름이 어긋난 것 자체가 원인인 경우가 많다. 부분 일치로 찾고, 저장 키도 함께 찍는다.
const rows = (ls.list || [])
  .map((c) => ({ brand: c.brand || c.site, site: c.site, count: c.count || 0, cats: c.cats || {}, updated: c.updated || 0 }))
  .filter((r) => (want.length
    ? want.some((w) => r.brand.toLowerCase().includes(w) || String(r.site).toLowerCase().includes(w))
    : r.count >= 100))
  .sort((a, z) => z.count - a.count);

const pad = (s, n) => String(s).padEnd(n);
const ago = (t) => (t ? Math.round((Date.now() - t) / 3600000) + "시간 전" : "-");
console.log(pad("브랜드", 20) + pad("저장 키", 34) + pad("전체", 7) + CATS.map((c) => pad(c, 13)).join("") + "갱신");
for (const r of rows) {
  const missing = CATS.filter((c) => !(r.cats[c] > 0));
  console.log(
    pad(r.brand, 20) + pad(r.site, 34) + pad(r.count, 7) +
    CATS.map((c) => pad(r.cats[c] || "-", 13)).join("") + pad(ago(r.updated), 12) +
    (missing.length ? `  ⚠ 없음: ${missing.join(", ")}` : "  ✅ 5개 모두"),
  );
}
// 앱은 브랜드 목록(Render brands.json)의 이름으로 저장 키를 찾는다. 이름이 한 글자라도
// 다르면 못 찾고, 같은 호스트에 브랜드가 둘이면(ae.com = American Eagle + Aerie)
// 호스트 폴백도 포기하도록 돼 있어 상품이 통째로 안 나온다. 둘을 나란히 찍어 확인한다.
if (want.length) {
  const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
  const norm = (x) => String(x || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  let brands = [];
  try { brands = await fetch(`${RENDER}/brands.json`).then((r) => r.json()); } catch (e) {
    console.log(`\n(브랜드 목록을 못 받았다: ${String((e && e.message) || e)})`);
  }
  const hit = (Array.isArray(brands) ? brands : []).filter((b) =>
    want.some((w) => String(b.name || "").toLowerCase().includes(w) || String(b.url || "").toLowerCase().includes(w)));
  if (hit.length) {
    console.log(`\n앱 브랜드 목록에 등록된 이름 ↔ 저장 키 대조`);
    const keys = (ls.list || []);
    for (const b of hit) {
      const nb = norm(b.name);
      const exact = keys.find((c) => norm(c.brand) === nb || norm(String(c.site).split(".").pop()) === nb);
      let host = "";
      try { host = new URL(b.url).hostname.replace(/^www\./, ""); } catch (e) {}
      const sameHost = keys.filter((c) => norm(c.site).startsWith(norm(host)));
      console.log(`  "${b.name}" (${host})`);
      console.log(`    정확 일치 키: ${exact ? exact.site : "❌ 없음"}`);
      console.log(`    같은 호스트 키 ${sameHost.length}개: ${sameHost.map((c) => `${c.site}("${c.brand}")`).join(", ") || "없음"}`);
      if (!exact && sameHost.length !== 1) {
        console.log(`    ⚠ 앱이 이 브랜드를 못 찾는다 — 이름 불일치 + 같은 호스트에 키가 ${sameHost.length}개라 폴백도 포기한다`);
      }
    }
  }
}

if (want.length && !rows.length) {
  console.log(`\n⚠ "${want.join(", ")}" 로 걸리는 저장 키가 없다 — 카탈로그가 아예 없거나 브랜드명이 다르다.`);
  console.log(`전체 저장 키 ${(ls.list || []).length}개 중 비슷한 이름:`);
  for (const c of ls.list || []) {
    const n = String(c.brand || c.site).toLowerCase();
    if (want.some((w) => w.split("").every((ch) => n.includes(ch)))) console.log(`  - ${c.brand} (${c.site}, ${c.count || 0}개)`);
  }
}
console.log(`\n브랜드 ${rows.length}개 · 5개 카테고리 모두 있는 브랜드 ` +
  rows.filter((r) => CATS.every((c) => r.cats[c] > 0)).length + "개");
