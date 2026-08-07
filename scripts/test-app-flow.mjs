#!/usr/bin/env node
// 독립 앱(app.html)의 데이터 흐름 회귀 테스트.
//
// 앱은 미로를 거치지 않는다: Worker 에서 받은 카탈로그와 오버레이를 합쳐
// 그대로 엑셀로 만든다. 그래서 "합치기 → 카테고리 → 열 개방 → 행 값"이
// 한 줄로 이어지는데, 중간이 끊겨도 화면에는 상품이 보인다 — 엑셀을 열어
// 혼용률 열이 통째로 없는 걸 보고서야 안다.
//
// 여기서는 Worker 응답을 흉내 낸 입력으로 그 사슬 전체를 돌린다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const box = {};
new Function("globalThis", readFileSync(join(ROOT, "shared/product-core.js"), "utf8"))(box);
const C = box.RackCore;

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// ── ① 카탈로그 + 오버레이 합치기 ──
// 혼용률은 카탈로그가 아니라 오버레이(comp:<site>)에 따로 있다. 이걸 못 붙이면
// 앱의 존재 이유가 사라진다. 상품URL 표기가 달라도 붙어야 한다.
const CATALOG = [
  { name: "Silk Blouse", imageUrl: "https://cdn.x/a.jpg", productUrl: "https://www.vince.com/p/silk-blouse", price: "$295" },
  { name: "Wide Trouser", imageUrl: "https://cdn.x/b.jpg", productUrl: "https://vince.com/p/wide-trouser/", price: "$345" },
  { name: "Cashmere Crew", imageUrl: "https://cdn.x/c.jpg", productUrl: "https://www.vince.com/p/cashmere-crew" },
  { name: "이미지 없음", productUrl: "https://www.vince.com/p/no-image" },
];
const OVERLAY = {
  // www 있음 → 없음, 끝 슬래시 있음/없음, 대문자 — 세 가지 표기 차이를 다 섞었다.
  "https://vince.com/p/silk-blouse": { comp: "Silk 100%", color: "Ivory" },
  "https://WWW.vince.com/p/wide-trouser": { comp: "Wool 70% / Nylon 30%" },
  "https://www.vince.com/p/cashmere-crew": { none: 1 },
};
const merged = C.mergeOverlay(CATALOG, OVERLAY, "Vince");

if (merged.length !== 3) fail(`이미지 없는 상품은 빠져야 한다 — ${merged.length}개 남음`);
const by = (n) => merged.find((p) => p.name === n) || {};
if (by("Silk Blouse").comp !== "Silk 100%") fail(`www 표기 차이로 혼용률이 안 붙음: ${JSON.stringify(by("Silk Blouse").comp)}`);
if (by("Wide Trouser").comp !== "Wool 70% / Nylon 30%") fail(`끝 슬래시·대문자 차이로 혼용률이 안 붙음: ${JSON.stringify(by("Wide Trouser").comp)}`);
if (by("Silk Blouse").color !== "Ivory") fail("컬러가 안 붙음");
if (by("Silk Blouse").brand !== "Vince") fail("브랜드가 안 들어감");
// 사이트가 소재를 아예 안 적는 상품 — '확인 필요'와 구분해야 한다.
if (by("Cashmere Crew").compNone !== true) fail("none 표시가 compNone 으로 안 옮겨짐");
if (by("Silk Blouse").compNone !== false) fail("혼용률이 있는데 compNone 이 켜짐");

// ── ② 카테고리 재분류 ──
// 앱의 탭이 여기에 걸려 있다. 저장된 category 를 안 믿고 다시 나눈다.
const CATS = [
  ["Silk Blouse", "https://x.com/p/silk-blouse", "shirts"],
  ["Wide Trouser", "https://x.com/p/wide-trouser", "pants"],
  ["Cashmere Sweater", "https://x.com/p/cashmere-sweater", "sweatshirts"],
  ["Ribbed Tank", "https://x.com/p/ribbed-tank", "tops"],
  ["Midi Dress", "https://x.com/p/midi-dress", "dresses"],
  // 'crew' 만으로는 상의인지 스웨터인지 갈리지 않는다(crew neck tee 도 crew 다).
  // 기본값 tops 로 두는 편이 덜 틀린다 — 지금 동작을 그대로 굳혀 둔다.
  ["Cashmere Crew", "https://x.com/p/cashmere-crew", "tops"],
];
for (const [name, url, want] of CATS) {
  const got = C.guessCat(url, name);
  if (got !== want) fail(`카테고리 "${name}" → 기대 ${want} 실제 ${got}`);
}

// ── ③ 열 개방 판정 ──
// 이 파일에 실리는 상품들만 보고 정한다. 브랜드 전체 평균이 아니다 —
// 그래야 이미 100% 채워진 브랜드를 뽑을 때 다른 브랜드 탓에 열이 닫히지 않는다.
const withComp = (n) => Array.from({ length: n }, () => ({ comp: "Cotton 100%" }));
const without = (n) => Array.from({ length: n }, () => ({ comp: "" }));
const GATE = [
  ["전부 채워짐", withComp(20), true],
  ["19/20 = 95% — 기준선 정확히", withComp(19).concat(without(1)), true],
  ["18/20 = 90% — 기준 미달", withComp(18).concat(without(2)), false],
  ["반쪽짜리는 채운 것으로 안 센다", Array.from({ length: 20 }, () => ({ comp: "Cotton 60%" })), false],
  ["빈 선택", [], false],
];
for (const [label, arr, want] of GATE) {
  const got = C.compReady(arr);
  if (got !== want) fail(`열 개방 "${label}" → 기대 ${want} 실제 ${got}`);
}
// 컬러웨이는 아직 닫아 둔 상태여야 한다 — 혼용률이 1순위라 따로 잠가 뒀다.
if (C.colorReady(Array.from({ length: 20 }, () => ({ color: "Ivory" }))) !== false) {
  fail("컬러웨이 열이 열렸다 — SHOW_COLOR_COLUMN 이 false 인지 확인");
}

// ── ④ 열 구성과 행 값이 맞물리는가 ──
// colsFor 가 만든 열과 rowColFor 가 매긴 열 문자가 어긋나면 엑셀에서 값이
// 옆 칸에 들어간다. 눈으로는 표가 멀쩡해 보여서 놓치기 쉽다.
const cols = C.colsFor(false, true);
const rowCol = C.rowColFor(cols);
if (cols.map((c) => c.key).join(",") !== "brand,img,link,name,comp") {
  fail("열 구성이 예상과 다름: " + cols.map((c) => c.key).join(","));
}
if (rowCol.brand !== "A" || rowCol.name !== "D" || rowCol.comp !== "E") {
  fail("열 문자가 어긋남: " + JSON.stringify(rowCol));
}
if (rowCol.img || rowCol.link) fail("썸네일·URL 은 rowValues 가 만들지 않으므로 열 문자를 받으면 안 된다");

// 합치기 결과를 그대로 행으로 만든다 — 사슬의 끝.
const v1 = C.rowValues(by("Silk Blouse"), "Vince", rowCol, false, true);
if (v1.comp !== "Silk 100%") fail(`행 값 혼용률: ${JSON.stringify(v1.comp)}`);
const v2 = C.rowValues(by("Cashmere Crew"), "Vince", rowCol, false, true);
if (v2.comp !== C.NO_INFO) fail(`사이트 미표기는 '정보 없음' 이어야 한다: ${JSON.stringify(v2.comp)}`);
const v3 = C.rowValues({ name: "X" }, "Vince", rowCol, false, true);
if (v3.comp !== C.NEED) fail(`아직 못 구한 값은 '확인 필요' 여야 한다: ${JSON.stringify(v3.comp)}`);

if (bad) { console.error(`\n앱 데이터 흐름 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 앱 데이터 흐름 통과 — 합치기 ${CATALOG.length}건 · 카테고리 ${CATS.length}건 · 열 개방 ${GATE.length}건 · 행 값 3건`);
