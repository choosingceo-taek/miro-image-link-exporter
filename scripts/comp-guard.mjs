// 저장 직전 가드 — 브랜드 전체에 되풀이되는 '사이트 장식' 혼용률을 저장하지 않고 보류한다.
//
// 왜 있나(2026-11-24 저장값 점검, docs/stored-comp-audit.md):
//   · Splendid  344개 중 233개가 "Cotton 100% ‖ Cashmere 100%" — 리넨 원피스에도 붙어 있었다.
//   · Gymshark  여러 줄 49개 중 48개에 "‖ Cotton 100%" 가 덧붙어 있었다(새로 읽으면 깨끗).
//   · Aritzia   472개 중 358개가 "Leather 100%" — 면 탱크톱·울 스웨터에도.
//   페이지 구조가 어떻든, 상품 본문이 아니라 페이지 틀(메뉴·배너·추천 블록)에서 온 글은 그 브랜드의
//   거의 모든 상품에 똑같이 나타난다. 추출기를 사이트마다 고칠 수는 없으니, 저장 직전에 '이번 실행에서
//   읽은 값 + 이미 저장된 값'을 브랜드 단위로 모아 보고 이런 값을 걸러 낸다.
//
// 두 가지 규칙(점검 스크립트의 시그니처 B·C 를 저장용으로 좁힌 것):
//   ① 줄 규칙 — 여러 줄(겉감/안감 같은) 혼용률 가운데 같은 줄이 LINE_SHARE 이상에 들어 있고,
//      그 줄과 짝을 이룬 다른 줄이 LINE_PARTNERS 종류 이상(=나머지 소재는 상품마다 다름)이면
//      그 줄은 조각이다. 그 줄이 든 여러 줄 값은 통째로 보류한다.
//      단, 흔한 안감(폴리에스터·비스코스·아세테이트·큐프로·나일론 100%)은 통과 — 안감 있는 옷이 많은
//      브랜드는 정말로 거의 모든 여러 줄 값에 "Polyester 100%" 가 있다(Ann Taylor 66개 중 63개).
//   ② 값 규칙 — 한 값이 브랜드 혼용률의 VALUE_SHARE 이상을 차지하는데, 그 값을 가진 상품의 이름이
//      값에 없는 섬유를 말하는 경우가 VALUE_CONTRA 이상이면(울 스웨터·면 탱크가 Leather 100%) 그 값을
//      보류한다. 면 티셔츠 브랜드가 정직하게 80% "Cotton 100%" 인 경우는 이름이 어긋나지 않아 통과한다.
//
// 보류 = 저장하지 않고 리포트에 남긴다. 빈 칸은 다음에 다시 시도되지만, 틀린 값은 엑셀로 나간다 —
// 애매하면 비워 두는 쪽을 고른다. 이미 저장된 값은 건드리지 않는다(지우는 것은 사람의 승인이 필요하다).
//
// 야간 보강(enrich-comp.mjs)·크롬 보강(enrich-comp-browser.mjs)이 저장 직전에 쓰고,
// 점검(audit-stored-comp.mjs)이 '오늘 저장값에 적용했다면'을 셀 때 쓴다. 네트워크를 쓰지 않는 순수 함수만.

// ── 저장 직전 가드 규칙 시작 — chrome-extension/background.js 에 글자 그대로 복사돼 있다(test-comp-guard 가 비교)
const GUARD_RULE = {
  LINE_MIN_MULTI: 8,   // 여러 줄 값이 이만큼은 있어야 판단한다(적으면 우연과 구별이 안 된다)
  LINE_SHARE: 0.8,     // 같은 줄이 여러 줄 값의 이 비율 이상
  LINE_PARTNERS: 3,    // 짝 줄의 종류(같은 원단 묶음이면 짝이 한두 종류다)
  VALUE_MIN: 30,       // 브랜드 혼용률이 이만큼은 있어야 판단한다
  VALUE_SHARE: 0.6,    // 한 값이 이 비율 이상
  VALUE_CONTRA: 0.1,   // 그 값을 가진 상품 중 이름과 어긋나는 비율
  VALUE_CONTRA_MIN: 5, // 어긋나는 상품이 적어도 이만큼
};

// 흔한 안감 — 브랜드 전체에 되풀이돼도 진짜일 수 있다.
const LINING_RX = /^(?:polyester|viscose|acetate|triacetate|cupro|nylon|polyamide) 100%$/i;

// 혼용률 → 단위(원단 한 벌) 목록. 줄로 나뉘고, 예전 저장분처럼 한 줄에 "Wool 100% / Cotton 100%"(합 200)로
// 붙은 것도 두 벌로 본다.
function units(comp) {
  const out = [];
  for (const line of String(comp || "").split("\n").map((l) => l.trim()).filter(Boolean)) {
    const items = line.split(/\s*\/\s*/).filter(Boolean).map((p) => {
      const m = p.match(/^(.*?)\s*(\d{1,3}(?:\.\d+)?)\s*%$/);
      return m ? { fib: m[1].trim(), pct: Number(m[2]) } : { fib: p.trim(), pct: NaN };
    });
    const sum = items.reduce((n, c) => n + (Number.isFinite(c.pct) ? c.pct : 0), 0);
    if (items.length >= 2 && sum > 150 && items.every((c) => c.pct === 100)) for (const c of items) out.push([c]);
    else out.push(items);
  }
  return out;
}
const unitKey = (u) => u.map((c) => `${c.fib} ${c.pct}%`.toLowerCase()).sort().join(" / ");
const unitText = (u) => u.map((c) => `${c.fib} ${c.pct}%`).join(" / ");
const normValue = (comp) => units(comp).map(unitKey).sort().join(" ‖ ");

// 상품명이 말하는 섬유 중 혼용률에 없는 것. "Faux Leather"·"Linen-Look" 는 그 섬유가 아니다.
const NAME_FIBRES = { cotton: "Cotton", wool: "Wool", merino: "Wool", linen: "Linen", silk: "Silk", cashmere: "Cashmere",
  viscose: "Viscose", lyocell: "Lyocell", tencel: "Lyocell", modal: "Modal", polyester: "Polyester", nylon: "Nylon",
  leather: "Leather", alpaca: "Alpaca", mohair: "Mohair" };
function nameContradicts(name, comp) {
  const n = String(name || "").toLowerCase()
    .replace(/\b(?:faux|vegan|imitation|fake|pleather)[\s-]+[a-z]+/g, " ")
    .replace(/\b[a-z]+[\s-](?:look|like|effect|feel|touch|print)\b/g, " ");
  const c = String(comp || "").toLowerCase();
  return Object.entries(NAME_FIBRES).filter(([w, f]) => new RegExp(`\\b${w}\\b`).test(n) && !c.includes(f.toLowerCase())).map(([w]) => w);
}

// 브랜드 하나의 값들([{url, name, comp}])에서 조각으로 보이는 줄·값을 찾는다.
function findFlags(items, rule = GUARD_RULE) {
  const withComp = items.filter((p) => p && String(p.comp || "").trim());
  const flags = [];
  // ① 줄 규칙
  const multi = withComp.filter((p) => units(p.comp).length >= 2);
  if (multi.length >= rule.LINE_MIN_MULTI) {
    const cnt = new Map();
    for (const p of multi) {
      const us = units(p.comp);
      const keys = new Set(us.map(unitKey));
      for (const u of us) {
        const k = unitKey(u);
        if (!keys.has(k)) continue;
        keys.delete(k);
        const e = cnt.get(k) || { text: unitText(u), n: 0, partners: new Set() };
        e.n++;
        for (const o of us) if (unitKey(o) !== k) e.partners.add(unitKey(o));
        cnt.set(k, e);
      }
    }
    for (const [k, e] of cnt) {
      const share = e.n / multi.length;
      if (share >= rule.LINE_SHARE && e.partners.size >= rule.LINE_PARTNERS && !LINING_RX.test(e.text)) {
        flags.push({ kind: "line", key: k, text: e.text, n: e.n, of: multi.length, share, partners: e.partners.size });
      }
    }
  }
  // ② 값 규칙
  if (withComp.length >= rule.VALUE_MIN) {
    const cnt = new Map();
    for (const p of withComp) {
      const k = normValue(p.comp);
      const e = cnt.get(k) || { text: p.comp, n: 0, contra: 0, ex: [] };
      e.n++;
      const why = nameContradicts(p.name, p.comp);
      if (why.length) { e.contra++; if (e.ex.length < 5) e.ex.push({ name: p.name, url: p.url, why }); }
      cnt.set(k, e);
    }
    for (const [k, e] of cnt) {
      const share = e.n / withComp.length;
      if (share >= rule.VALUE_SHARE && e.contra >= rule.VALUE_CONTRA_MIN && e.contra / e.n >= rule.VALUE_CONTRA) {
        flags.push({ kind: "value", key: k, text: e.text, n: e.n, of: withComp.length, share, contra: e.contra, contraEx: e.ex });
      }
    }
  }
  return flags;
}

// 이 값이 어느 표시에 걸리나(없으면 null).
function heldBy(comp, flags) {
  if (!flags.length || !String(comp || "").trim()) return null;
  const us = units(comp);
  const v = normValue(comp);
  for (const f of flags) {
    if (f.kind === "value" && f.key === v) return f;
    if (f.kind === "line" && us.length >= 2 && us.some((u) => unitKey(u) === f.key)) return f;
  }
  return null;
}

const urlKey = (u) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/+$/, "")).toLowerCase(); } catch (e) { return String(u || ""); } };

// 저장 직전에 쓴다. stored: 이 브랜드에 이미 저장돼 화면에 보이는 값, incoming: 이번 실행에서 읽은 값
// (둘 다 [{url, name, comp}]). 같은 상품은 이번 값으로 본다. 보류할 이번 값의 주소 → 이유를 돌려준다.
function guardRun(stored, incoming, rule = GUARD_RULE) {
  const inc = new Map();
  for (const p of incoming || []) if (p && p.url && String(p.comp || "").trim()) inc.set(urlKey(p.url), p);
  const ctx = [...(stored || []).filter((p) => p && p.url && !inc.has(urlKey(p.url))), ...inc.values()];
  const flags = findFlags(ctx, rule);
  const held = new Map();
  for (const p of inc.values()) {
    const f = heldBy(p.comp, flags);
    if (f) held.set(p.url, { comp: p.comp, name: p.name || "", flag: f });
  }
  return { held, flags };
}

// 보류 이유를 사람 말로.
function flagText(f) {
  const pct = Math.round(f.share * 100);
  return f.kind === "line"
    ? `여러 줄 값 ${f.of}개 중 ${f.n}개(${pct}%)에 같은 줄 "${f.text}" · 짝 ${f.partners}종`
    : `값 ${f.of}개 중 ${f.n}개(${pct}%)가 "${String(f.text).replace(/\n/g, " ‖ ")}" · 그중 ${f.contra}개는 이름과 어긋남`;
}
// ── 저장 직전 가드 규칙 끝

export { GUARD_RULE, units, normValue, nameContradicts, findFlags, heldBy, guardRun, flagText };
