#!/usr/bin/env node
// 엑셀 추가 열(shared/product-core.js) — 기존 열과 순서는 그대로 두고 뒤에 판매가·정가·사이즈·컬러 전부·설명·
// 디테일·이미지 링크를 붙이는지, 95% 기준(혼용률·컬러웨이 열)은 그대로인지 본다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const box = {};
new Function("globalThis", readFileSync(join(ROOT, "shared/product-core.js"), "utf8"))(box);
const C = box.RackCore;
let bad = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`  ❌ ${name}: ${g} (기대 ${w})`); bad++; } else console.log(`  ✓ ${name}`);
};
eq("기존 열(혼용률 열림) + 추가 열", C.exportCols(false, true).map((c) => c.header),
  ["브랜드", "썸네일", "URL", "상품명", "혼용률", "판매가", "정가", "사이즈", "컬러 전부", "설명", "디테일", "이미지 링크"]);
eq("기존 열은 colsFor 그대로(순서 같음)", C.exportCols(true, true).slice(0, 6).map((c) => c.key), C.colsFor(true, true).map((c) => c.key));
eq("95% 기준은 그대로(FABRIC_GATE)", C.FABRIC_GATE, 0.95);
const cols = C.exportCols(false, false);
eq("추가 열 문자(혼용률 열이 닫히면 E 부터)", C.extraColFor(cols), { price: "E", priceOrig: "F", sizes: "G", colors: "H", desc: "I", feat: "J", imgs: "K" });
const p = { productUrl: "https://www.x.com/p/a/", price: "$98", priceOrig: "$120", sizes: "S, M, L", imageUrl: "https://img/0.jpg" };
const map = { "https://x.com/p/a": { desc: "Soft tee.", feat: ["Boxy fit", "Crew neck"], colors: ["Bone", "Navy"], imgs: ["https://img/1.jpg", "https://img/2.jpg"], sizesIn: ["S", "L"] } };
eq("상세 붙이기(주소 표기 달라도)", C.attachDetails([p], map), 1);
eq("추가 열 값", C.extraValues(p, p.detail), { price: "$98", priceOrig: "$120", sizes: "S, M(품절), L", colors: "Bone, Navy",
  desc: "Soft tee.", feat: "Boxy fit\nCrew neck", imgs: "https://img/1.jpg\nhttps://img/2.jpg" });
eq("상세가 없으면 사진은 대표 사진, 나머지는 빈 칸(확인 필요 표시 없음)", C.extraValues({ imageUrl: "https://img/0.jpg" }, null),
  { price: "", priceOrig: "", sizes: "", colors: "", desc: "", feat: "", imgs: "https://img/0.jpg" });
const app = readFileSync(join(ROOT, "app.html"), "utf8");
eq("앱: 기존 행 값은 기존 열로만(rowValues 에 추가 열을 넘기지 않음)", app.includes("const rowCol = C.rowColFor(C.colsFor(showColor, showComp));"), true);
console.log(bad ? `\n${bad}개 실패` : "\n모두 통과");
process.exit(bad ? 1 : 0);
