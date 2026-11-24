#!/usr/bin/env node
// 저장된 혼용률 점검(audit-stored-comp.mjs)의 시그니처 규칙을 작은 가짜 자료로 확인한다.
// 네트워크에 붙지 않는다 — 모듈을 불러와 규칙 함수만 돌린다(직접 실행할 때만 Worker 를 읽는다).
import { sigA, sigB, sigC, sigD, sigE, sigF, analyzeBrand, shownItems, verdict, sameComp } from "./audit-stored-comp.mjs";

let bad = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`  ❌ ${name}: ${g} (기대 ${w})`); bad++; } else console.log(`  ✓ ${name}`);
};

// ── A. Zara 모양 ──
eq("A: 울 100 / 면 100 (두 줄)", sigA("Wool 100%\nCotton 100%"), true);
eq("A: 예전 한 줄 200%", sigA("Wool 100% / Cotton 100%"), true);
eq("A: 같은 섬유 두 줄은 아님(겉감=안감)", sigA("Cotton 100%\nCotton 100%"), false);
eq("A: 한 줄 100% 는 아님", sigA("Cotton 100%"), false);
eq("A: 섞인 줄이 있으면 아님", sigA("Cotton 95% / Elastane 5%\nPolyester 100%"), false);
eq("A: 혼방 한 줄은 아님", sigA("Cotton 60% / Polyester 40%"), false);

// ── B. 반복 조각 ──
const mk = (comp, i) => ({ name: "p" + i, url: "https://x.com/p/" + i, comp });
const zaraLike = [
  "Wool 100%\nCotton 100%", "Wool 100%\nCotton 95% / Elastane 5%", "Viscose 100%\nWool 100%",
  "Wool 100%\nModal 50% / Cotton 50%", "Wool 100%\nPolyester 100%", "Cotton 100%", "Linen 100%",
].map(mk);
const b = sigB(zaraLike);
eq("B: 'Wool 100%' 조각을 찾음", b.map((f) => f.line), ["Wool 100%"]);
eq("B: 다섯 개 중 다섯", b[0] && [b[0].n, b[0].multi], [5, 5]);
eq("B: 흔한 안감 아님", b[0] && b[0].lining, false);
const lining = ["Cotton 100%\nPolyester 100%", "Wool 80% / Nylon 20%\nPolyester 100%", "Linen 100%\nPolyester 100%",
  "Viscose 100%\nPolyester 100%", "Wool 100%\nPolyester 100%"].map(mk);
eq("B: 폴리 안감은 흔한 안감으로 표시", sigB(lining).map((f) => [f.line, f.lining]), [["Polyester 100%", true]]);
eq("B: 여러 줄이 적으면 보지 않음", sigB(zaraLike.slice(0, 3)), []);
// 두 줄이 늘 똑같으면(짝이 한 종류) 조각이 아니라 같은 상품 묶음 — C 에서 본다
const same = Array.from({ length: 6 }, (_, i) => mk("Cotton 100%\nPolyester 100%", i));
eq("B: 짝이 한 종류면 아님", sigB(same), []);

// ── C. 한 값이 독차지 ──
const many = Array.from({ length: 40 }, (_, i) => mk(i < 30 ? "Cotton 100%" : "Cotton 98% / Elastane 2%", i));
const c = sigC(many);
eq("C: 40개 중 30개(75%) 같은 값", c && [c.n, c.of], [30, 40]);
eq("C: 30개 미만이면 보지 않음", sigC(many.slice(0, 20)), null);
const spread = Array.from({ length: 40 }, (_, i) => mk(i % 2 ? "Cotton 100%" : "Linen 100%", i));
eq("C: 반반이면 아님", sigC(spread), null);
eq("C: 순서만 다른 값은 같은 값", sameComp("Cotton 95% / Elastane 5%", "Elastane 5% / Cotton 95%"), true);

// ── D. 상품명과 어긋남(nameCheck 재사용) ──
eq("D: 린넨 셔츠인데 면 100%", sigD("Linen Shirt", "Cotton 100%"), ["이름에 linen, 혼용률에 없음"]);
eq("D: 린넨 셔츠, 린넨 55%", sigD("Linen Shirt", "Linen 55% / Cotton 45%"), []);
eq("D: '100% cotton' 이름인데 혼방", sigD("100% Cotton Tee", "Cotton 95% / Elastane 5%"), ["이름은 100% cotton"]);
eq("D: 페이크 레더는 가죽 아님", sigD("Faux Leather Jacket", "Polyurethane 100%"), []);
eq("D: 린넨 룩은 린넨 아님", sigD("Linen-Look Trousers", "Polyester 100%"), []);
eq("D: 두 줄 지적은 D 에서 뺌", sigD("Jacket", "Cotton 100%\nPolyester 100%"), []);
eq("D: 이름에 섬유 없으면 없음", sigD("Rustic T-Shirt", "Wool 100%"), []);

// ── E. 불가능한 값 ──
eq("E: 정상 값", sigE("Cotton 95% / Elastane 5%"), []);
eq("E: 겉감+안감 두 줄 정상", sigE("Cotton 100%\nPolyester 100%"), []);
eq("E: [object Object]", sigE("[object Object],[object Object]"), ["[object …] (저장 사고 흔적)"]);
eq("E: 합이 60%", sigE("Cotton 60%"), ["합이 60%"]);
eq("E: 100% 넘음", sigE("Cotton 120%"), ["100% 넘는 항목", "합이 120%"]);
eq("E: 섬유가 아닌 낱말", sigE("Shell 100%"), ["섬유가 아닌 낱말: Shell"]);
eq("E: 세 줄", sigE("Cotton 100%\nPolyester 100%\nNylon 100%").includes("줄이 3개"), true);
eq("E: 꼴이 아닌 조각", sigE("Cotton 100% / machine wash"), ["‘섬유 NN%’ 꼴이 아닌 조각"]);

// ── F. 상품 주소가 아닌 곳 ──
eq("F: Loft 카테고리 주소", sigF("https://www.loft.com/clothing/sweaters/catl000012/"), true);
eq("F: Shopify collections", sigF("https://x.com/collections/tops"), true);
eq("F: Shopify 상품(collections 안의 products)", sigF("https://x.com/collections/tops/products/tee"), false);
eq("F: 상품 주소", sigF("https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html"), false);

// ── 합치기: 카탈로그 값 우선 · [object …] 는 화면엔 빈 칸 · 가린 값 ──
const items = shownItems([
  { name: "A", productUrl: "https://www.x.com/p/1/", comp: "" },
  { name: "B", productUrl: "https://x.com/p/2", comp: "Cotton 100%" },
  { name: "C", productUrl: "https://x.com/p/3", comp: "[object Object]" },
  { name: "D", productUrl: "https://x.com/p/4" },
], {
  "https://x.com/p/1": { comp: "Wool 100%\nCotton 100%", via: "wayback", wd: "20260101" },
  "https://x.com/p/2": { comp: "Linen 100%" },
  "https://x.com/p/3": { comp: "Silk 100%" },
  "https://x.com/p/4": { none: 1, nv: "fetch" },
});
eq("합치기: 오버레이(보관본) 값", [items[0].comp, items[0].src, items[0].via], ["Wool 100%\nCotton 100%", "overlay", "wayback"]);
eq("합치기: 카탈로그 값이 이김 · 가린 값 기록", [items[1].comp, items[1].src, items[1].hidden], ["Cotton 100%", "catalog", "Linen 100%"]);
eq("합치기: [object] 는 빈 칸(오버레이 값도 가려짐)", [items[2].comp, items[2].raw], ["", "[object Object]"]);
eq("합치기: none", items[3].none, true);
const r = analyzeBrand(items);
eq("analyzeBrand: A 1 · E 1", [r.A.length, r.E.length], [1, 1]);

// ── 검증 판정 ──
eq("판정: 지금 페이지와 같음", verdict("Cotton 100%", { firefox: { v: "comp", comp: "Cotton 100%" } }).v, "fine");
const w = verdict("Wool 100%\nCotton 100%", { impit: { v: "blocked" }, firefox: { v: "comp", comp: "Cotton 100%" } });
eq("판정: 섞인 줄 → 틀림 확인", [w.v, w.how, w.eng], ["wrong", "extra", "firefox"]);
eq("판정: 보관본만", verdict("Cotton 100%", { firefox: { v: "blocked" }, wayback: { v: "comp", comp: "Linen 100%" } }).v, "wrong-arc");
eq("판정: 열렸지만 못 읽음", verdict("Cotton 100%", { firefox: { v: "open" } }).v, "open");
eq("판정: 못 읽음", verdict("Cotton 100%", { firefox: { v: "blocked" }, wayback: { v: "err" } }).v, "unread");

if (bad) { console.error(`\n${bad}개 실패`); process.exit(1); }
console.log("\n저장된 혼용률 점검 규칙 — 모두 통과");
