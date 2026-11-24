#!/usr/bin/env node
// 저장 직전 가드(comp-guard.mjs) — 사이트 장식이 브랜드 전체에 되풀이된 값은 보류하고,
// 정직하게 되풀이되는 값(면 티셔츠 브랜드의 Cotton 100%, 안감 Polyester 100%)은 통과시키는지 본다.
// 자료 모양은 2026-11-24 저장값 점검(stored-comp-audit-raw.md)에서 옮겼다.
import { units, findFlags, heldBy, guardRun, nameContradicts } from "./comp-guard.mjs";

let bad = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`  ❌ ${name}: ${g} (기대 ${w})`); bad++; } else console.log(`  ✓ ${name}`);
};
const mk = (brand) => (comp, i, name) => ({ url: `https://${brand}.example/products/p${i}`, name: name || `p${i}`, comp });
const rep = (n, comp, name) => Array.from({ length: n }, () => [comp, name]);
const build = (brand, rows) => rows.map(([comp, name], i) => mk(brand)(comp, i, name));
const heldCount = (items) => { const f = findFlags(items); return items.filter((p) => heldBy(p.comp, f)).length; };

// ── 단위 ──
eq("단위: 두 줄", units("Cotton 100%\nCashmere 100%").length, 2);
eq("단위: 예전 한 줄 200% 도 두 벌", units("Cotton 100% / Linen 100%").length, 2);
eq("단위: 혼방 한 줄은 한 벌", units("Cotton 60% / Polyester 40%").length, 1);
eq("이름 어긋남: 울 스웨터에 Leather", nameContradicts("Essential Wool Cashmere Cherub Sweater", "Leather 100%"), ["wool", "cashmere"]);
eq("이름 어긋남: Faux Leather 는 가죽 아님", nameContradicts("Faux Leather Pant", "Polyurethane 100%"), []);

// ── Splendid: 344 중 233 이 "Cotton 100% ‖ Cashmere 100%"(리넨 원피스 포함). 여러 줄 대부분에 두 줄이 다 있다 ──
const splendid = build("splendid", [
  ...rep(30, "Cotton 100%\nCashmere 100%", "Louisa Long Sleeve Tee"),
  ...rep(6, "Cotton 100%\nCashmere 100%", "Stella Linen Midi Dress"),
  ["Viscose 95% / Elastane 5%\nCashmere 100%", "Ribbed Tank"],
  ["Modal 50% / Cotton 50%\nCashmere 100%", "Supersoft Tee"],
  ["Cotton 100%\nPolyester 100%", "Eyelet Top"],
  ["Linen 100%\nCotton 100%", "Linen Shirt"],
  ["Rayon 100%\nCotton 100%", "Rayon Top"],
  ...rep(20, "Cotton 60% / Modal 40%", "Tee"),
]);
const sf = findFlags(splendid);
eq("Splendid: 두 줄 모두 조각으로 표시", sf.filter((f) => f.kind === "line").map((f) => f.text).sort(), ["Cashmere 100%", "Cotton 100%"]);
eq("Splendid: 여러 줄 값 41개 모두 보류", heldCount(splendid), 41);
eq("Splendid: 한 줄 값(Cotton 60 / Modal 40)은 통과", heldBy("Cotton 60% / Modal 40%", sf), null);

// ── Gymshark: 여러 줄 49 중 48 에 "‖ Cotton 100%" 가 덧붙음 ──
const gym = build("gymshark", [
  ["Polyester 88% / Elastane 12%\nCotton 100%", "Feather Form Scoop Neck T-Shirt"],
  ["Nylon 75% / Elastane 25%\nCotton 100%", "Everyday Racer Back Tank"],
  ["Polyester 100%\nCotton 100%", "Training Oversized Tee"],
  ["Cotton 80% / Polyester 20%\nCotton 100%", "Crest Hoodie"],
  ["Nylon 80% / Elastane 20%\nCotton 100%", "Vital Seamless Leggings"],
  ["Polyester 92% / Elastane 8%\nCotton 100%", "Flex Shorts"],
  ["Modal 50% / Polyester 50%\nCotton 100%", "Rest Day Tee"],
  ["Polyester 88% / Elastane 12%\nCotton 100%", "Feather Form Tee Black"],
  ["Polyester 90% / Elastane 10%\nPolyester 100%", "Sports Bra"],
  ...rep(40, "Polyester 88% / Elastane 12%", "Tee"),
]);
eq("Gymshark: 'Cotton 100%' 줄을 조각으로", findFlags(gym).map((f) => f.text), ["Cotton 100%"]);
eq("Gymshark: 덧붙은 8개만 보류(안감 있는 1개는 통과)", heldCount(gym), 8);

// ── &Other Stories: 예전 한 줄 200% "Cotton 100% / Linen 100%" 꼴 ──
const stories = build("stories", [
  ...rep(5, "Cotton 100% / Linen 100%", "Boxy Cotton T-Shirt"),
  ["Wool 100% / Linen 100%", "Rib-Knit Wool Top"],
  ["Viscose 100% / Linen 100%", "Satin Blouse"],
  ["Polyester 100% / Linen 100%", "Pleated Skirt"],
  ["Cotton 95% / Elastane 5%\nLinen 100%", "Slim Tee"],
  ...rep(30, "Cotton 100%", "Tee"),
]);
eq("&Other Stories: 한 줄 200% 꼴의 'Linen 100%' 조각", findFlags(stories).map((f) => f.text), ["Linen 100%"]);

// ── Aritzia: 472 중 358 이 "Leather 100%" — 면 탱크·울 스웨터 ──
const aritzia = build("aritzia", [
  ...rep(20, "Leather 100%", "Seabreeze Tank - Mesh-knit organic cotton crewneck tank."),
  ...rep(10, "Leather 100%", "Essential Wool Cashmere Cherub Sweater"),
  ...rep(40, "Leather 100%", "Contour Bodysuit"),
  ...rep(30, "Wool 70% / Cashmere 30%", "Cherub Sweater"),
]);
eq("Aritzia: 'Leather 100%' 값 전체 보류", findFlags(aritzia).map((f) => [f.kind, f.text]), [["value", "Leather 100%"]]);
eq("Aritzia: 70개 보류", heldCount(aritzia), 70);

// ── 정직한 경우는 통과 ──
// 면 티셔츠 브랜드(Xirena 84%·Coldwatercreek 91% Cotton 100%) — 이름이 어긋나지 않는다
const tees = build("tees", [...rep(80, "Cotton 100%", "Beau Shirt"), ...rep(4, "Cotton 100%", "Linen Look Shirt"), ...rep(16, "Cotton 95% / Elastane 5%", "Tee")]);
eq("면 티 브랜드 80% Cotton 100%: 통과", findFlags(tees), []);
// 이름에 'linen' 이 몇 개 섞여도(4/84, 5% 미만) 통과
const tees2 = build("tees2", [...rep(80, "Cotton 100%", "Classic Tee"), ...rep(3, "Cotton 100%", "Cotton Linen Shirt"), ...rep(17, "Cotton 98% / Elastane 2%", "Tee")]);
eq("면 티 브랜드(이름 어긋남 3개): 통과", findFlags(tees2), []);
// 안감 있는 옷이 많은 브랜드(Ann Taylor 66 중 63 에 Polyester 100%)
const lined = build("ann", [
  ...rep(20, "Viscose 100%\nPolyester 100%", "Sleeveless Bow Blouse"),
  ...rep(20, "Polyester 95% / Elastane 5%\nPolyester 100%", "Sequin Crew Neck Top"),
  ...rep(20, "Cotton 100%\nPolyester 100%", "Mixed Media Top"),
  ...rep(3, "Wool 60% / Polyester 40%\nAcetate 100%", "Blazer"),
]);
eq("안감 Polyester 100% 가 95%: 통과", heldCount(lined), 0);
// 니트 브랜드 Bassike(여러 줄 37 중 25 = 68% 에 Cotton 100% — 몸판+배색): 문턱 아래라 통과
const bassike = build("bassike", [...rep(25, "Cotton 100%\nCotton 95% / Elastane 5%", "Rib Tank"), ...rep(12, "Cotton 95% / Elastane 5%\nModal 100%", "Scoop Tank")]);
eq("Bassike 68%: 통과", heldCount(bassike), 0);
// Ulla Johnson 크로셰+가죽(여러 줄 6개 모두 Cotton 100% — 적어서 판단 안 함)
const ulla = build("ulla", rep(6, "Cotton 100%\nLeather 100%", "Livia Crochet & Leather Top"));
eq("Ulla Johnson 6개: 통과", heldCount(ulla), 0);
// 같은 원단 묶음(짝이 한 종류)
const sets = build("sets", rep(12, "Cotton 100%\nWool 100%", "Fair Isle Vest"));
eq("짝이 한 종류(같은 원단 묶음): 통과", heldCount(sets), 0);

// ── guardRun: 이번 실행 값 + 저장값을 함께 본다 ──
{
  const stored = splendid.slice(0, 30).map((p) => ({ ...p }));
  const incoming = [
    { url: "https://splendid.example/products/new1", name: "Lydia Linen Mini Dress", comp: "Cotton 100%\nCashmere 100%" },
    { url: "https://splendid.example/products/new2", name: "Supima Tee", comp: "Cotton 100%" },
    { url: "https://splendid.example/products/new3", name: "Rib Tank", comp: "Modal 92% / Elastane 8%\nCashmere 100%" },
    ...build("splendidx", [["Cotton 100%\nPolyester 100%"], ["Viscose 100%\nCashmere 100%"], ["Linen 100%\nCotton 100%"]]),
  ];
  const r = guardRun(stored, incoming);
  eq("guardRun: 저장값과 함께 보면 이번 실행의 조각 값 보류", [...r.held.keys()].includes("https://splendid.example/products/new1"), true);
  eq("guardRun: 한 줄 Cotton 100% 는 저장", r.held.has("https://splendid.example/products/new2"), false);
  // 이번 실행만으로는 근거가 모자라면(여러 줄 2개) 통과 — 저장값이 없으면 판단을 못 한다
  const r2 = guardRun([], incoming.slice(0, 3));
  eq("guardRun: 근거가 모자라면 통과", r2.held.size, 0);
  // 같은 상품은 이번 값으로 본다(저장값이 조각이어도 이번에 고쳐 읽었으면 통과)
  const fixed = { url: stored[0].url, name: stored[0].name, comp: "Cotton 100%" };
  eq("guardRun: 같은 상품의 새 값", guardRun(stored, [fixed]).held.size, 0);
}

console.log(bad ? `\n저장 직전 가드 — ${bad}개 실패` : "\n저장 직전 가드 — 모두 통과");
process.exit(bad ? 1 : 0);
