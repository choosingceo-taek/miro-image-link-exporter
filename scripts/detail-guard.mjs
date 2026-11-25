// 상품 상세(설명·디테일 글머리표) 저장 직전 가드 + 상세 저장값 합치기.
//
// 왜 있나: 혼용률에서 이미 겪은 일이다(comp-guard.mjs 머리말). 상품 본문이 아니라 페이지 틀에서 온 글 —
// 배송·반품 안내, 사이즈 안내 문구, 판촉 배지, 브랜드 소개 문단 — 은 그 브랜드의 거의 모든 상품에 똑같이 붙는다.
// 사이트마다 추출기를 고칠 수는 없으니, 저장 직전에 '이미 저장된 값 + 이번에 읽은 값'을 브랜드 단위로 모아 보고
// 한 글이 브랜드 상품 대부분을 덮으면 그 글을 저장하지 않는다(보류). 빈 칸은 다음에 다시 읽히지만 틀린 글은 엑셀로 나간다.
//
// 규칙(DETAIL_GUARD):
//   ① 설명(desc) — 같은 설명이 설명 있는 상품의 DESC_SHARE(50%) 이상이고 DESC_MIN(5)개 이상이면 그 설명을 보류.
//      서로 다른 상품이 한 문단을 공유하는 일은 없다(같은 상품의 다른 색은 주소가 달라도 같은 설명일 수 있어,
//      그런 '같은 이름' 상품은 하나로 센다).
//   ② 글머리표(feat) — 한 줄이 글머리표 있는 상품의 FEAT_SHARE(80%) 이상이고 FEAT_MIN(10)개 이상이면 그 줄만 뺀다.
//      "Imported"·"Machine wash cold" 처럼 정직하게 흔한 줄도 빠지지만, 상품을 가르는 정보가 아니라 잃는 것이 적다.
//      목록 전체를 버리지 않는다 — 나머지 줄(핏·기장·여밈)은 그 상품의 것이다.
// 판단 근거가 모자라면(상품이 적으면) 통과시킨다. 이미 저장된 값은 건드리지 않는다.
//
// 야간 보강(enrich-comp.mjs)·크롬 보강(enrich-comp-browser.mjs)이 쓰고, 확장(background.js)에 글자 그대로 복사돼 있다.

// ── 상세 가드 규칙 시작 — chrome-extension/background.js 에 글자 그대로 복사돼 있다(test-detail-guard 가 비교)
const DETAIL_GUARD = { DESC_MIN: 5, DESC_SHARE: 0.5, FEAT_MIN: 10, FEAT_SHARE: 0.8 };
const dgNorm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9가-힣%]+/g, ' ').trim();
const dgName = (s) => dgNorm(s).replace(/\b(?:xs|s|m|l|xl|xxl|petite|tall|plus)\b/g, ' ').replace(/\s+/g, ' ').trim();

// stored·incoming: [{url, name, desc, feat}] (같은 상품은 이번 값으로 본다).
// 돌려주는 것: { holdDesc: Set(설명 정규화 키), dropFeat: Set(글머리표 정규화 키), stats }
function detailFlags(stored, incoming, rule = DETAIL_GUARD) {
  const inc = new Map();
  for (const p of incoming || []) if (p && p.url) inc.set(p.url, p);
  const all = [...(stored || []).filter((p) => p && p.url && !inc.has(p.url)), ...inc.values()];
  // 같은 이름(다른 색·다른 주소)의 상품은 한 상품으로 센다.
  const byName = new Map();
  for (const p of all) {
    const k = dgName(p.name) || p.url;
    const e = byName.get(k) || { desc: new Set(), feat: new Set() };
    if (p.desc) e.desc.add(dgNorm(p.desc));
    for (const f of p.feat || []) e.feat.add(dgNorm(f));
    byName.set(k, e);
  }
  const groups = [...byName.values()];
  const withDesc = groups.filter((g) => g.desc.size).length;
  const withFeat = groups.filter((g) => g.feat.size).length;
  const dc = new Map(), fc = new Map();
  for (const g of groups) {
    for (const d of g.desc) dc.set(d, (dc.get(d) || 0) + 1);
    for (const f of g.feat) fc.set(f, (fc.get(f) || 0) + 1);
  }
  const holdDesc = new Set(), dropFeat = new Set();
  for (const [k, n] of dc) if (k && n >= rule.DESC_MIN && n / Math.max(1, withDesc) >= rule.DESC_SHARE) holdDesc.add(k);
  for (const [k, n] of fc) if (k && n >= rule.FEAT_MIN && n / Math.max(1, withFeat) >= rule.FEAT_SHARE) dropFeat.add(k);
  return { holdDesc, dropFeat, stats: { products: groups.length, withDesc, withFeat } };
}

// 이번 값 하나에 가드를 적용한다. 무엇을 뺐는지 함께 돌려준다.
function detailApply(rec, flags) {
  const out = { ...rec };
  const why = [];
  if (out.desc && flags.holdDesc.has(dgNorm(out.desc))) { why.push('desc'); delete out.desc; }
  if (Array.isArray(out.feat) && out.feat.length) {
    const keep = out.feat.filter((f) => !flags.dropFeat.has(dgNorm(f)));
    if (keep.length !== out.feat.length) why.push('feat-' + (out.feat.length - keep.length));
    if (keep.length) out.feat = keep; else delete out.feat;
  }
  return { rec: out, why };
}

// 상세 저장값(detail:<site>, {상품URL: {desc, feat, imgs, colors, sku, cur, sizesIn, dt}})에 이번 값을 합친다.
// 이번에 읽은 값이 있으면 그 칸은 이번 값으로 바꾼다(가격·재고처럼 바뀌는 칸이 있다). 없으면 예전 값을 둔다.
// dt = 상세를 마지막으로 읽은 시각. 1,000개 상한(오버레이와 같게, 오래된 것부터 뺀다).
const DETAIL_FIELDS = ['desc', 'feat', 'imgs', 'colors', 'sku', 'cur', 'sizesIn'];
function mergeDetails(map, incoming, now) {
  const merged = { ...(map || {}) };
  let added = 0;
  for (const [url, rec] of Object.entries(incoming || {})) {
    const cur = { ...(merged[url] || {}) };
    let n = 0;
    for (const k of DETAIL_FIELDS) {
      const v = rec && rec[k];
      const has = Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== '';
      if (has) { if (JSON.stringify(cur[k]) !== JSON.stringify(v)) n++; cur[k] = v; }
    }
    cur.dt = now;
    merged[url] = cur;
    if (n) added++;
  }
  const keys = Object.keys(merged);
  if (keys.length > 1000) {
    keys.sort((a, z) => (merged[a].dt || 0) - (merged[z].dt || 0));
    for (const k of keys.slice(0, keys.length - 1000)) delete merged[k];
  }
  return { merged, added };
}
// ── 상세 가드 규칙 끝

export { DETAIL_GUARD, DETAIL_FIELDS, detailFlags, detailApply, mergeDetails, dgNorm };
