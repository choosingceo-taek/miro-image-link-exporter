// 상품 상세(detail) 추출 규칙을 Node 스크립트에서 쓰기 위한 다리.
//
// 규칙의 원본은 worker/fabric-extractor.js 의 "상품 상세(detail) 추출" 구간 하나뿐이다 — 여기서는 그 구간을
// 떼어 그대로 실행할 뿐 복사본을 만들지 않는다(복사본은 한쪽만 고쳐지는 사고를 낸다. 이 저장소에서 세 번 났다).
// 크롬 확장(background.js)은 파일을 공유할 수 없어 글자 그대로 복사해 두고, scripts/test-detail.mjs 가 같은지 본다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const WORKER_SRC = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
export const DETAIL_START = "// ── 상품 상세(detail) 추출 시작";
export const DETAIL_END = "// ── 상품 상세(detail) 추출 끝";

export function detailBlock(src = WORKER_SRC) {
  const i = src.indexOf(DETAIL_START), j = src.indexOf(DETAIL_END, i);
  if (i < 0 || j < 0) throw new Error("detail 구간을 찾지 못함");
  return src.slice(i, j + DETAIL_END.length);
}
const slice = (a, b) => { const i = WORKER_SRC.indexOf(a), j = WORKER_SRC.indexOf(b, i); if (i < 0 || j < 0) throw new Error("worker 블록 없음: " + a); return WORKER_SRC.slice(i, j); };

const api = new Function(
  slice("function titleCase(s) {", "// 페이지 제목") + detailBlock() +
  "\n return { detailOf, compFromPartsJson, dtText, dtBody, dtSections, dtFromLd, dtFromShopify, dtFromMeta, dtHeadKind, DETAIL_CAP };",
)();
export const { detailOf, compFromPartsJson, dtText, dtBody, dtSections, dtFromLd, dtFromShopify, dtFromMeta, dtHeadKind, DETAIL_CAP } = api;

// 혼용률·컬러 규칙(기존) — 현장 지도가 같은 페이지에서 함께 잰다.
export const { compFromHtml, compFromText } = new Function(slice("const FIBRES = {", "function titleCase") + "\n return { compFromHtml, compFromText };")();
export const colorFromHtml = new Function(slice("const COLOR_JUNK", "function titleCase") + "\n return colorFromHtml;")();
export const fromJsonLd = new Function(slice("function fromJsonLd(html) {", "const FIBRES = {") + slice("function titleCase(s) {", "// 페이지 제목") + "\n return fromJsonLd;")();
export const { validComp, validColor } = new Function(slice("const COMP_ITEM_RX", "// ── 페이지 HTML 전체에서 혼용률") + "\n return { validComp, validColor };")();

// [{material,percent,line}] → 저장 형식("Cotton 95% / Elastane 5%", 두 원단이면 줄바꿈).
export function asComp(v) {
  if (!Array.isArray(v)) return String(v || "").trim();
  const lines = [];
  for (const c of v) { const n = c.line || 0; (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`); }
  return lines.filter(Boolean).map((l) => l.join(" / ")).join("\n");
}

// 한 페이지에서 혼용률 — 야간 보강과 같은 순서(JSON-LD → 본문 → 본문 밖 JSON) + Inditex parts JSON.
export function compOf(html, url) {
  let ld = {};
  try { ld = fromJsonLd(html) || {}; } catch (e) {}
  if (ld.composition && ld.composition.length && validComp(asComp(ld.composition))) return { comp: asComp(ld.composition), src: "jsonld" };
  const h = asComp(compFromHtml(html));
  if (h) return { comp: h, src: "page" };
  const p = asComp(compFromPartsJson(html, url));
  if (p) return { comp: p, src: "parts-json" };
  return { comp: "", src: "" };
}

// 오버레이·저장용 상세 레코드로 줄인다(출처 표시·내부 칸은 뺀다). 빈 칸은 싣지 않는다.
export const DETAIL_KEYS = ["desc", "feat", "imgs", "colors", "sku", "cur", "sizesIn"];
export function detailRecord(d) {
  const out = {};
  for (const k of DETAIL_KEYS) {
    const v = d && d[k];
    if (Array.isArray(v) ? v.length : v != null && String(v).trim()) out[k] = v;
  }
  return out;
}
