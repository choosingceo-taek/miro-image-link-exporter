#!/usr/bin/env node
// 중복 저장 키 정리 — 같은 브랜드가 두 벌 저장된 것을 한 벌로 합친다.
//
// 예전 확장은 호스트만으로 키를 만들었다(catalog:fatface.com). 지금은
// <호스트>.<브랜드슬러그>(catalog:fatface.com.fatface)를 쓴다. 둘이 함께 남아 있으면:
//   ① 앱이 둘 중 아무거나 집을 수 있다 — 옛 키가 걸리면 오래된 목록을 본다.
//   ② 야간 보강이 유령 카탈로그에도 예산을 쓴다 — 아무도 안 읽는 데이터를 채운다.
//   ③ 채움률 분모가 부풀어 "12%" 같은 숫자가 실제보다 나쁘게 보인다.
//
// 지우기만 하면 옛 키에만 있던 상품이 사라진다(fatface 는 옛 키가 96개 더 많았다).
// 그래서 합치고 지운다: 상품URL 기준 합집합 → 새 키에 저장 → 옛 키 삭제.
// 혼용률·컬러 오버레이도 같은 방식으로 합친다 — 안 그러면 보강해 둔 값이 고아가 된다.
//
// 기본은 미리보기다. 실제로 바꾸려면 APPLY=1.
// env: WORKER_URL, WORKER_TOKEN, APPLY

const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const APPLY = process.env.APPLY === "1";
const tok = "&token=" + encodeURIComponent(TOKEN);

async function getJson(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw last || new Error("fetch failed");
}

const ls = await getJson(`${WORKER}/?catalogs=1${tok}`);
const list = (ls.list || []).map((c) => ({ site: String(c.site || ""), brand: c.brand || "", count: c.count || 0, updated: c.updated || 0 }));
const bySite = new Map(list.map((c) => [c.site, c]));

// 짝 찾기: 옛 키 "host" 와 새 키 "host.slug" 가 둘 다 있는 경우.
const pairs = [];
for (const c of list) {
  // 옛 키는 순수 호스트(fatface.com), 새 키는 그 뒤에 ".슬러그"가 더 붙는다(fatface.com.fatface).
  const children = list.filter((x) => x.site !== c.site && x.site.startsWith(c.site + "."));
  if (children.length) pairs.push({ old: c, news: children });
}

if (!pairs.length) { console.log("✅ 중복 저장 키 없음"); process.exit(0); }

console.log(`중복 저장 키 ${pairs.length}건${APPLY ? " — 합치고 옛 키를 지운다" : " (미리보기 · 실제 반영은 APPLY=1)"}\n`);

const pad = (s, n) => String(s).padEnd(n);
let done = 0, failed = 0;
for (const { old, news } of pairs) {
  // 새 키가 여럿이면(한 호스트에 브랜드 둘) 어디로 합칠지 정할 수 없다 — 사람이 판단해야 한다.
  if (news.length > 1) {
    console.log(`⚠ ${old.site} (${old.count}개) → 새 키가 ${news.length}개 [${news.map((n) => n.site).join(", ")}]`);
    console.log(`   한 호스트에 브랜드가 둘이라 자동으로 합치지 않는다 — 어느 브랜드 것인지 사람이 나눠야 한다.\n`);
    continue;
  }
  const dst = news[0];
  let oldCat, newCat, oldOv, newOv;
  try {
    [oldCat, newCat, oldOv, newOv] = await Promise.all([
      getJson(`${WORKER}/?catalog=${encodeURIComponent(old.site)}${tok}`),
      getJson(`${WORKER}/?catalog=${encodeURIComponent(dst.site)}${tok}`),
      getJson(`${WORKER}/?comps=${encodeURIComponent(old.site)}${tok}`).catch(() => ({})),
      getJson(`${WORKER}/?comps=${encodeURIComponent(dst.site)}${tok}`).catch(() => ({})),
    ]);
  } catch (e) {
    console.log(`❌ ${old.site} → ${dst.site}: 읽기 실패 ${String(e.message || e)}\n`);
    failed++; continue;
  }

  // 합집합 — 새 키 것을 앞에 둔다(최신 수집분 우선). 상한은 Worker 저장 상한과 같은 800.
  const seen = new Set((newCat.items || []).map((p) => p.productUrl));
  const extra = (oldCat.items || []).filter((p) => p && p.productUrl && !seen.has(p.productUrl));
  const merged = (newCat.items || []).concat(extra).slice(0, 800);
  // 오버레이도 합친다. 새 키 값이 우선 — 옛 키 값은 빈 자리만 메운다.
  const ov = { ...(oldOv || {}), ...(newOv || {}) };

  console.log(`${pad(old.site, 30)} ${pad(old.count + "개", 8)} → ${pad(dst.site, 34)} ${pad(dst.count + "개", 8)} ` +
    `합치면 ${merged.length}개 (옛 키에만 있던 상품 ${extra.length}개) · 오버레이 ${Object.keys(newOv || {}).length}→${Object.keys(ov).length}`);

  if (!APPLY) continue;
  if (!merged.length) { console.log("   건너뜀 — 합친 결과가 비었다\n"); failed++; continue; }

  try {
    // 오버레이를 먼저 옮긴다. 카탈로그 저장이 실패해도 보강해 둔 값은 남는다.
    if (Object.keys(ov).length > Object.keys(newOv || {}).length) {
      const r0 = await fetch(`${WORKER}/?store=overlay&site=${encodeURIComponent(dst.site)}${tok}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ov), signal: AbortSignal.timeout(45000),
      }).then((x) => x.json());
      if (r0 && r0.error) throw new Error("오버레이: " + r0.error);
    }
    // legacy= 를 붙이면 Worker 가 저장 뒤에 옛 키를 지운다(같은 호스트일 때만 지운다).
    const r = await fetch(
      `${WORKER}/?store=catalog&replace=1&legacy=${encodeURIComponent(old.site)}${tok}`,
      {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: dst.site, brand: newCat.brand || dst.brand || "", items: merged }),
        signal: AbortSignal.timeout(60000),
      },
    ).then((x) => x.json());
    if (!r || !r.ok) throw new Error(JSON.stringify(r));
    console.log(`   ✅ ${dst.site} = ${r.count}개 · 옛 키 ${old.site} 삭제\n`);
    done++;
  } catch (e) {
    console.log(`   ❌ 저장 실패: ${String(e.message || e)}\n`);
    failed++;
  }
}

console.log(APPLY
  ? `\n합침 ${done}건 · 실패 ${failed}건`
  : `\n미리보기만 했다. 실제로 반영하려면 APPLY=1 로 다시 실행한다.`);
if (failed) process.exit(1);
