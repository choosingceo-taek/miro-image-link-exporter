#!/usr/bin/env node
// 독립 앱(app.html)의 검색·세그먼트·선택 바구니 규칙 회귀 테스트.
//
// 앱이 미로 패널만큼 쓸 만해지면서 규칙이 늘었다: 전체 상품 검색, 세그먼트 칩,
// 브랜드를 옮겨도 남는 선택, 여러 브랜드를 한 엑셀에 담는 이름 짓기, 혼용률 열
// 기준(95%)을 섞인 선택에 거는 일. 화면은 멀쩡해 보여도 이 중 하나가 어긋나면
// 엑셀이 틀리게 나간다. 그래서 규칙만 떼어 shared/product-core.js 에 두고 여기서 본다.
//
//   node scripts/test-app-basket.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const box = {};
new Function("globalThis", readFileSync(join(ROOT, "shared/product-core.js"), "utf8"))(box);
const C = box.RackCore;

let bad = 0, n = 0;
const ok = (cond, m) => { n++; if (!cond) { console.error("  ❌ " + m); bad++; } };
const eq = (got, want, m) => ok(JSON.stringify(got) === JSON.stringify(want), `${m} — 기대 ${JSON.stringify(want)} 실제 ${JSON.stringify(got)}`);

// ── ① 전체 상품 검색 ──
const IDX = [
  { name: "Linen Shirt", brand: "Vince", imageUrl: "https://i/1", productUrl: "https://vince.com/p/1", comp: "Linen 100%" },
  { name: "Shirt in Washed Linen", brand: "Aritzia", imageUrl: "https://i/2", productUrl: "https://aritzia.com/p/2" },
  { name: "LINEN pant", brand: "Aritzia", imageUrl: "https://i/3", productUrl: "https://aritzia.com/p/3" },
  { name: "Linen Tee no image", brand: "Vince", productUrl: "https://vince.com/p/4" },
  { name: "Wool Coat", brand: "Vince", imageUrl: "https://i/5", productUrl: "https://vince.com/p/5" },
];
eq(C.searchIndex(IDX, "l").short, true, "한 글자는 찾지 않는다");
eq(C.searchIndex(IDX, " l ").hits.length, 0, "공백을 떼고 한 글자면 찾지 않는다");
{
  const r = C.searchIndex(IDX, "linen");
  eq(r.hits.map((x) => x.productUrl.slice(-1)), ["1", "2", "3"], "대소문자 무시 · 이미지 없는 항목 제외");
  eq([r.total, r.capped], [3, false], "개수·상한");
}
eq(C.searchIndex(IDX, "linen shirt").hits.length, 2, "낱말 순서가 달라도 찾는다");
eq(C.searchIndex(IDX, "shirt coat").hits.length, 0, "낱말이 하나라도 없으면 빠진다");
{
  const many = Array.from({ length: 450 }, (_, i) => ({ name: "Tee " + i, imageUrl: "https://i/" + i, productUrl: "https://x/" + i }));
  const r = C.searchIndex(many, "tee");
  eq([r.hits.length, r.total, r.capped], [C.SEARCH_CAP, 450, true], "300개에서 자르고 전체 개수는 따로 센다");
  eq(C.SEARCH_CAP, 300, "상한은 미로 패널과 같은 300");
}
{
  const p = C.fromIndex(IDX[0]);
  eq([p.brand, p.comp, p.compNone, p.cat], ["Vince", "Linen 100%", false, "shirts"], "인덱스 항목을 상품 모양으로");
}

// ── ② 오버레이 덧입히기(검색 결과의 혼용률을 최신으로) ──
{
  const items = [C.fromIndex(IDX[0]), C.fromIndex(IDX[1]), C.fromIndex(IDX[2])];
  const changed = C.applyOverlay(items, {
    "https://www.vince.com/p/1/": { comp: "Linen 55% / Cotton 45%" },   // 표기가 달라도 붙는다
    "https://aritzia.com/p/2": { none: 1 },
  });
  eq(changed, 2, "바뀐 개수");
  eq(items[0].comp, "Linen 55% / Cotton 45%", "오버레이 값이 인덱스 값보다 앞선다");
  eq([items[1].comp, items[1].compNone], ["", true], "사이트 미표기 표시가 붙는다");
  eq(items[2].compNone, false, "오버레이가 없는 상품은 그대로");
  C.applyOverlay(items, { "https://vince.com/p/1": { color: "Ivory" } });
  eq(items[0].comp, "Linen 55% / Cotton 45%", "값이 없는 필드는 원래 값을 지우지 않는다");
}

// ── ③ 세그먼트 ──
const RENDER = [
  { name: "Aerie", url: "https://ae.com", segments: ["YWMN", "SLEEP"] },
  { name: "Vince", url: "https://vince.com", segments: ["WMN"] },
  { name: "Unsorted", url: "https://u.com" },
];
const SM = C.segMapOf(RENDER);
eq(Object.keys(SM).sort(), ["aerie", "vince"], "분류가 있는 브랜드만 지도에 들어간다");
const NAMES = ["AERIE", "Vince", "Unsorted", "Nowhere"];
eq(NAMES.filter((x) => C.inSeg(x, "", SM)), NAMES, "아무것도 안 켜면 전체(분류 없는 브랜드 포함)");
eq(NAMES.filter((x) => C.inSeg(x, "SLEEP", SM)), ["AERIE"], "이름 대소문자를 무시하고 맞춘다");
eq(NAMES.filter((x) => C.inSeg(x, "WMN", SM)), ["Vince"], "분류가 없는 브랜드는 세그먼트에서 빠진다");
{
  const st = C.segState(NAMES, SM);
  eq([st.segs.YWMN.disabled, st.segs.ACTIVE.disabled, st.segs.ACTIVE.count], [false, true, 0], "빈 세그먼트만 잠근다");
  const none = C.segState(NAMES, {});
  eq(Object.values(none.segs).map((s) => s.disabled), [false, false, false, false],
    "분류가 아직 없으면 아무 칩도 잠그지 않는다(전부 잠기는 사고 방지)");
}

// ── ④ 선택 바구니: 여러 브랜드 ──
const vince = C.mergeOverlay([
  { name: "Silk Blouse", imageUrl: "https://i/a", productUrl: "https://vince.com/p/a" },
  { name: "Wool Pant", imageUrl: "https://i/b", productUrl: "https://vince.com/p/b" },
], { "https://vince.com/p/a": { comp: "Silk 100%" }, "https://vince.com/p/b": { comp: "Wool 100%" } }, "Vince");
const aritzia = C.mergeOverlay([
  { name: "Tee", imageUrl: "https://i/c", productUrl: "https://aritzia.com/p/c" },
  { name: "Knit", imageUrl: "https://i/d", productUrl: "https://aritzia.com/p/d" },
], { "https://aritzia.com/p/c": { comp: "Cotton 100%" }, "https://aritzia.com/p/d": { none: 1 } }, "Aritzia");

const basket = new Map();
basket.set(vince[0].productUrl, vince[0]);          // 브랜드 A 에서 고르고
basket.set(aritzia[0].productUrl, aritzia[0]);      // 브랜드 B 로 옮겨 고르고
basket.set(vince[1].productUrl, vince[1]);          // 다시 A
basket.set(aritzia[1].productUrl, aritzia[1]);
basket.set(vince[0].productUrl, vince[0]);          // 같은 상품을 다시 담아도 하나
{
  const sel = [...basket.values()];
  const s = C.basketSummary(sel);
  eq([s.n, s.brands, s.comp, s.none, s.pct], [4, 2, 3, 1, 75], "바구니 요약(개수·브랜드 수·혼용률·미표기)");
  eq(s.ready, false, "섞인 선택 3/4 = 75% → 혼용률 열 닫힘");
  eq(C.exportOrder(sel).map((p) => p.name), ["Silk Blouse", "Wool Pant", "Tee", "Knit"],
    "엑셀 행은 브랜드가 처음 담긴 순서로 묶인다");
  const only = C.compOnly(sel);
  eq(only.map((p) => p.name), ["Silk Blouse", "Tee", "Wool Pant"], "혼용률 있는 것만 남긴다");
  eq(C.basketSummary(only).ready, true, "혼용률 있는 것만 남기면 열이 열린다");
  // 각 행은 자기 브랜드를 갖는다 — 첫 상품의 브랜드로 덮이면 안 된다.
  const cols = C.colsFor(false, true), rc = C.rowColFor(cols);
  eq(C.exportOrder(sel).map((p) => C.rowValues(p, p.brand, rc, false, true).brand), ["Vince", "Vince", "Aritzia", "Aritzia"],
    "행마다 자기 브랜드");
}
// 95% 기준은 섞인 선택 전체에 건다: 20개 중 19개면 열린다.
{
  const sel = Array.from({ length: 19 }, (_, i) => ({ brand: i % 2 ? "A" : "B", comp: "Cotton 100%" }))
    .concat([{ brand: "C", comp: "" }]);
  const s = C.basketSummary(sel);
  eq([s.brands, s.ready], [3, true], "세 브랜드 19/20 = 95% → 열림");
  eq(C.basketSummary(sel.concat([{ brand: "C", comp: "" }])).ready, false, "19/21 → 닫힘");
}
// 혼용률 판정은 '옳은 값'으로 — 반쪽짜리는 빠진다.
eq(C.compOnly([{ comp: "Cotton 60%" }, { comp: "Cotton 60% / Elastane 40%" }]).length, 1, "반쪽 혼용률은 없는 것으로 본다");

// ── ⑤ 파일 이름 ──
eq(C.exportFileName([{ brand: "Vince" }, { brand: "vince" }], "2026-11-24T10:00:00Z"), "Vince_2026-11-24.xlsx", "한 브랜드");
eq(C.exportFileName([{ brand: "Vince" }, { brand: "Aritzia" }, { brand: "Aerie" }], "2026-11-24"), "RACK_3brands_2026-11-24.xlsx", "여러 브랜드");
eq(C.exportFileName([{ brand: "Free People / Intimately" }], "2026-11-24"), "Free_People_Intimately_2026-11-24.xlsx", "파일 이름에 못 쓰는 글자");
eq(C.exportFileName([{ brand: "" }], "2026-11-24", "x.com.y"), "x_com_y_2026-11-24.xlsx", "브랜드가 없으면 사이트 키");

// ── ⑥ Shift 범위 · 주소 해시 ──
const L = ["a", "b", "c", "d", "e"].map((x) => ({ productUrl: x }));
eq(C.rangeBetween(L, 3, 1), ["b", "c", "d"], "거꾸로 눌러도 범위");
eq(C.rangeBetween(L, -1, 2), [], "앞서 누른 카드가 없으면 범위 없음");
eq(C.parseHash("#site=vince.com.vince"), { site: "vince.com.vince", q: "" }, "해시 site");
eq(C.parseHash("#q=linen%20shirt"), { site: "", q: "linen shirt" }, "해시 q");
eq(C.parseHash(""), { site: "", q: "" }, "빈 해시");
eq(C.makeHash({ q: "linen shirt & co" }), "#q=linen+shirt+%26+co", "검색어 해시");
eq(C.parseHash(C.makeHash({ q: "linen shirt & co" })).q, "linen shirt & co", "검색어 해시 왕복");
eq(C.makeHash({ site: "a.b", q: "x" }), "#site=a.b", "브랜드가 있으면 브랜드가 앞선다");
eq(C.makeHash({}), "", "아무것도 없으면 빈 해시");

if (bad) { console.error(`\n앱 검색·바구니 ${bad}/${n}건 실패`); process.exit(1); }
console.log(`✅ 앱 검색·세그먼트·바구니 통과 — ${n}건`);
