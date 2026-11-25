#!/usr/bin/env node
// 상품 상세 저장 직전 가드(detail-guard.mjs) — 브랜드 대부분에 똑같이 붙은 설명·글머리표(사이트 공통 문구)는 빼고,
// 상품마다 다른 글은 그대로 두는지 본다. 합치기(mergeDetails)와 확장 복사본이 글자 그대로 같은지도 본다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { detailFlags, detailApply, mergeDetails } from "./detail-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`  ❌ ${name}: ${g} (기대 ${w})`); bad++; } else console.log(`  ✓ ${name}`);
};
const NAMES = ["Alder Tee", "Birch Shirt", "Cedar Dress", "Dogwood Pant", "Elm Skirt", "Fir Jacket", "Gum Tank", "Hazel Knit",
  "Ivy Blouse", "Juniper Coat", "Kauri Short", "Larch Top"];
const mk = (i, desc, feat) => ({ url: `https://b.example/p/${i}`, name: NAMES[i], desc, feat });

// ① 사이트 공통 설명(8/12) → 보류. 상품마다 다른 설명은 통과.
{
  const boiler = "Designed in our London studio. Free returns within 30 days.";
  const items = NAMES.map((_, i) => mk(i, i < 8 ? boiler : `A unique description number ${i} about this piece.`, []));
  const f = detailFlags([], items);
  eq("공통 설명 보류", detailApply({ desc: boiler }, f).rec.desc, undefined);
  eq("고유 설명 통과", detailApply({ desc: items[9].desc }, f).rec.desc, items[9].desc);
}
// ② 근거가 모자라면(4개) 통과
{
  const items = NAMES.slice(0, 4).map((_, i) => mk(i, "Same text everywhere on four items only.", []));
  eq("근거 모자람 — 통과", detailApply({ desc: "Same text everywhere on four items only." }, detailFlags([], items)).rec.desc, "Same text everywhere on four items only.");
}
// ③ 같은 이름(다른 색)은 한 상품으로 센다 — 같은 상품 6색이 같은 설명이어도 보류하지 않는다.
{
  const items = [0, 1, 2, 3, 4, 5].map((i) => ({ url: `https://b.example/p/c${i}`, name: "Alder Tee", desc: "The Alder tee in soft slub jersey." }))
    .concat([6, 7, 8, 9].map((i) => mk(i, `Other ${i} description text here.`, [])));
  eq("같은 이름 여러 색 — 통과", detailApply({ desc: "The Alder tee in soft slub jersey." }, detailFlags([], items)).rec.desc, "The Alder tee in soft slub jersey.");
}
// ④ 글머리표: 12개 모두에 붙은 줄은 빼고, 상품마다 다른 줄은 남긴다. 줄을 다 빼면 칸이 사라진다.
{
  const items = NAMES.map((_, i) => mk(i, "", ["Free shipping over $100", `Length ${60 + i} cm`, i % 2 ? "Relaxed fit" : "Slim fit"]));
  const f = detailFlags([], items);
  eq("공통 글머리표만 뺌", detailApply({ feat: ["Free shipping over $100", "Length 61 cm", "Relaxed fit"] }, f).rec.feat, ["Length 61 cm", "Relaxed fit"]);
  eq("반쯤만 붙은 줄(Relaxed fit)은 남음", f.dropFeat.has("relaxed fit"), false);
  eq("다 빠지면 칸 없음", "feat" in detailApply({ feat: ["Free shipping over $100"] }, f).rec, false);
}
// ⑤ 저장값과 이번 값을 함께 본다 — 이번에 읽은 3개만으로는 모자라도 저장값 9개와 합치면 보류.
{
  const boiler = "Our story began in 1972 on the coast of Cornwall.";
  const stored = NAMES.slice(0, 9).map((_, i) => mk(i, boiler, []));
  const incoming = NAMES.slice(9, 12).map((_, i) => mk(9 + i, boiler, []));
  eq("저장값과 함께 — 보류", detailApply({ desc: boiler }, detailFlags(stored, incoming)).rec.desc, undefined);
}
// ⑥ 합치기: 이번 값이 있으면 그 칸을 바꾸고, 없으면 예전 값을 둔다. dt 를 찍는다. 1,000개 상한(오래된 것부터 뺌).
{
  const old = { a: { desc: "old", imgs: ["x"], dt: 1 }, b: { desc: "keep", dt: 2 } };
  const { merged, added } = mergeDetails(old, { a: { desc: "new" }, c: {} }, 99);
  eq("합치기: 바뀐 칸", merged.a, { desc: "new", imgs: ["x"], dt: 99 });
  eq("합치기: 안 읽은 상품은 그대로", merged.b, { desc: "keep", dt: 2 });
  eq("합치기: 빈 기록도 dt", merged.c, { dt: 99 });
  eq("합치기: 바뀐 상품 수", added, 1);
  const big = {};
  for (let i = 0; i < 1005; i++) big["u" + i] = { dt: i };
  const r = mergeDetails(big, { n: { desc: "x" } }, 5000).merged;
  eq("상한 1,000 — 오래된 것부터", [Object.keys(r).length, "u0" in r, "u5" in r, "n" in r], [1000, false, false, true]);
}
// ⑦ 확장 복사본이 글자 그대로 같은가 · 배선(저장 전에 가드)
{
  const block = (src) => { const a = src.indexOf("// ── 상세 가드 규칙 시작"), b = src.indexOf("// ── 상세 가드 규칙 끝"); return a >= 0 && b > a ? src.slice(a, b) : null; };
  const mod = block(readFileSync(join(ROOT, "scripts/detail-guard.mjs"), "utf8"));
  const ext = readFileSync(join(ROOT, "chrome-extension/background.js"), "utf8");
  eq("확장: 상세 가드 규칙이 detail-guard.mjs 와 같다", !!mod && block(ext) === mod, true);
  for (const f of ["scripts/enrich-comp.mjs", "scripts/enrich-comp-browser.mjs"]) {
    const src = readFileSync(join(ROOT, f), "utf8");
    const a = src.indexOf("detailApply("), b = src.indexOf("store=details");
    eq(`배선: ${f} 가 상세 저장 전에 가드`, a > 0 && a < b, true);
  }
  const ea = ext.indexOf("detailApply(", ext.indexOf("async function storeDetails")), eb = ext.indexOf("store=details", ext.indexOf("async function storeDetails"));
  eq("배선: 확장 storeDetails 가 저장 전에 가드", ea > 0 && ea < eb, true);
}
console.log(bad ? `\n${bad}개 실패` : "\n모두 통과");
process.exit(bad ? 1 : 0);
