#!/usr/bin/env node
// 값이 "쓸 수 있는" 값인지 판정하는 규칙의 회귀 테스트.
//
// 이 규칙이 엑셀 열을 여는 기준선(95%)을 정한다. 느슨하면 잘못된 값을 채운
// 것으로 세어 기준선을 넘겨 놓고 정작 표는 못 쓰게 되고, 빡빡하면 멀쩡한
// 값을 버려서 문이 영영 안 열린다. 양쪽 다 여기서 잡는다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const i = src.indexOf("const COMP_ITEM_RX");
const j = src.indexOf("// ── 페이지 HTML 전체에서 혼용률");
if (i < 0 || j < 0) { console.error("❌ 판정 블록을 찾지 못함"); process.exit(1); }
const { validComp, validColor } = new Function(
  src.slice(i, j) + "\n return { validComp, validColor };",
)();

// 패널(index.html)은 같은 판정기를 복사해 갖고 있다 — 엑셀 열을 열지 말지를
// 브라우저에서 그 자리에 판단해야 하기 때문이다. 두 벌이 어긋나면 Worker 가
// "옳다"고 센 값을 패널은 버리게 되고(또는 그 반대), 기준선 자체가 무의미해진다.
// 그래서 같은 표로 두 구현을 함께 돌린다.
const panelSrc = readFileSync(join(ROOT, "index.html"), "utf8");
const pi = panelSrc.indexOf("const COMP_ITEM_RX");
const pj = panelSrc.indexOf("// ── 컬러웨이·혼용률 열 스위치");
if (pi < 0 || pj < 0) { console.error("❌ 패널의 판정 블록을 찾지 못함 — index.html 구조 확인"); process.exit(1); }
const panel = new Function(panelSrc.slice(pi, pj) + "\n return { validComp, validColor };")();

// 독립 앱(app.html)은 복사본을 갖지 않고 shared/product-core.js 를 읽어 쓴다.
// 그래도 여기서 함께 돌린다 — 공유 파일이 Worker 와 어긋나는 순간을 잡아야 하고,
// 앱이 그 파일을 정말로 쓰고 있는지도 확인해야 한다(아래 검사).
const core = {};
new Function("globalThis", readFileSync(join(ROOT, "shared/product-core.js"), "utf8"))(core);
const shared = core.RackCore || {};
if (typeof shared.validComp !== "function" || typeof shared.validColor !== "function") {
  console.error("❌ shared/product-core.js 가 RackCore.validComp/validColor 를 내보내지 않음");
  process.exit(1);
}

// 앱이 공유 파일을 안 읽고 자기 사본을 들고 있으면, 위 대조가 통과해도 실제
// 화면은 다르게 동작한다. 그 상태를 막는다.
const app = readFileSync(join(ROOT, "app.html"), "utf8");
if (!app.includes("shared/product-core.js")) {
  console.error("❌ app.html 이 shared/product-core.js 를 불러오지 않는다");
  process.exit(1);
}
if (/function\s+validComp\b/.test(app)) {
  console.error("❌ app.html 이 validComp 사본을 갖고 있다 — 공유 파일을 쓰도록 고칠 것");
  process.exit(1);
}

const COMP = [
  // ── 옳은 값 ──
  ["한 가지 섬유 100%", "Cotton 100%", true],
  ["두 가지 합 100%", "Cotton 60% / Modal 40%", true],
  ["세 가지 합 100%", "Cotton 95% / Elastane 3% / Nylon 2%", true],
  ["겉감+안감 두 겹", "Cotton 100% / Polyester 100%", true],
  ["반올림 오차 101%", "Wool 51% / Nylon 50%", true],

  // ── 버려야 하는 값 ──
  ["절반만 뽑힘 — 나머지를 놓친 것", "Cotton 60%", false],
  ["합이 어중간", "Cotton 70% / Wool 20%", false],
  ["세 겹은 과다 — 여러 상품이 섞였을 것", "Cotton 100% / Wool 100% / Silk 100%", false],
  ["객체가 통째로 들어감", "[object Object]", false],
  ["배열이 통째로 들어감", "[object Object],[object Object]", false],
  ["퍼센트가 없음", "Cotton", false],
  ["형식이 다름", "60% Cotton", false],
  ["빈 값", "", false],
  ["공백만", "   ", false],
];

const COLOR = [
  // ── 옳은 값 ──
  ["영문 색 이름", "Optic White", true],
  ["한글 색 이름", "코어", true],
  ["고유 색 이름", "Olive Tree", true],
  ["여러 색 표기", "Ivory / Navy", true],
  ["기호 포함", "Black & White", true],

  // ── 버려야 하는 값 ──
  ["안내 문구", "Select", false],
  ["항목 이름만", "Color", false],
  ["한글 항목 이름만", "색상", false],
  ["색상 코드", "#ff0000", false],
  ["숫자만", "12", false],
  ["문자열 null", "null", false],
  ["객체가 통째로 들어감", "[object Object]", false],
  ["너무 긴 값 — 설명문이 통째로 들어옴", "A".repeat(41), false],
  ["빈 값", "", false],
];

let bad = 0;
const IMPLS = [["worker", { validComp, validColor }], ["패널", panel], ["공유(앱)", shared]];
for (const [who, impl] of IMPLS) {
  for (const [label, v, want] of COMP) {
    const got = impl.validComp(v);
    if (got !== want) { bad++; console.error(`❌ [${who}] 혼용률 · ${label}: ${JSON.stringify(v)} → 기대 ${want} 실제 ${got}`); }
  }
  for (const [label, v, want] of COLOR) {
    const got = impl.validColor(v);
    if (got !== want) { bad++; console.error(`❌ [${who}] 컬러 · ${label}: ${JSON.stringify(v)} → 기대 ${want} 실제 ${got}`); }
  }
}
if (bad) { console.error(`\n값 판정 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 값 판정 통과 — 혼용률 ${COMP.length}건 · 컬러 ${COLOR.length}건 (worker·패널·공유 세 구현 일치)`);
