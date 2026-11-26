// 혼용률 추출 규칙의 판(rv) — 규칙 소스에서 저절로 나오는 짧은 지문.
//
// 야간 보강(enrich-comp.mjs)은 읽었는데 혼용률이 비었던 상품을 재시도 창(5일) 동안 다시 열지 않는다. 그래서 규칙을
// 고쳐도 그 상품들에는 닷새 동안 닿지 않았고, 창을 무시하는 새벽 회차는 다른 실행에 밀려 취소되면 그날 통째로 빠졌다
// (11/26 실행 45745945625). 상품마다 '어느 판으로 읽었나'를 남기고, 판이 바뀌면 창과 무관하게 한 번 더 연다.
//
// 판에 드는 소스: worker/fabric-extractor.js 의 JSON-LD·섬유·본문·값 판정·페이지 HTML 구간과 페이지 JSON(parts) 구간,
// enrich-comp.mjs 의 '이 상품 페이지를 정말 읽었나' 구간. 이 글자들이 바뀌면 판이 바뀐다 — 번호를 손으로 올릴 일이 없다.
// (주석만 고쳐도 바뀐다. 그때는 비었던 상품을 한 번 더 읽을 뿐이라 해가 없다.)
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// 구간 표시는 글자를 나눠 적는다 — 이 파일에 표시가 통째로 있으면 다른 스크립트가 이 파일을 표시로 착각할 수 있다.
const READ_A = "// ── 이 상품 페이지를 정말 읽었나(none 판정) " + "시작";
const READ_B = "// ── 이 상품 페이지를 정말 읽었나(none 판정) " + "끝";

function cut(src, a, b, what) {
  const i = src.indexOf(a), j = src.indexOf(b, i + 1);
  if (i < 0 || j < 0) throw new Error(`규칙 판: ${what} 구간을 찾지 못함 (${a})`);
  return src.slice(i, j);
}

// 컬러 규칙의 판(cv) — worker 의 컬러 구간(colorFromHtml)과 제목 컬러(title-color.mjs). 컬러가 빈 상품 중
// 컬러가 거의 없는 브랜드(절반 미만)의 것은 판이 바뀌면 컬러 재시도 창(30일)과 무관하게 한 번 더 연다(enrich-comp.mjs).
export function colorVersion(root = ROOT) {
  const w = readFileSync(join(root, "worker/fabric-extractor.js"), "utf8");
  const t = readFileSync(join(root, "scripts/title-color.mjs"), "utf8");
  return createHash("sha1").update(cut(w, "const COLOR_JUNK", "function titleCase", "worker 컬러")).update(t).digest("hex").slice(0, 8);
}

export function ruleVersion(root = ROOT) {
  const w = readFileSync(join(root, "worker/fabric-extractor.js"), "utf8");
  const e = readFileSync(join(root, "scripts/enrich-comp.mjs"), "utf8");
  return createHash("sha1")
    .update(cut(w, "function fromJsonLd(html) {", "// ── 컬러웨이", "worker 혼용률"))
    .update(cut(w, "function compFromPartsJson(", "const DT_PART_LABEL_RX", "worker 페이지 JSON"))
    .update(cut(e, READ_A, READ_B, "enrich-comp 읽음 판정"))
    .digest("hex").slice(0, 8);
}
