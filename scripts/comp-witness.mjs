// 혼용률 두 번째 증인 — 같은 페이지의 디테일 글머리표·설명 속 "퍼센트+섬유" 줄과 혼용률 칸을 견준다.
//
// 혼용률 칸(comp)과 글머리표(feat)는 같은 페이지를 두 번 읽은 것이다(규칙이 다르다 — comp 는 JSON-LD·본문 창·페이지 JSON,
// feat 는 제목 붙은 본문 칸). 둘이 다르면 어느 한쪽이 틀렸다. 2026-11-25 Boden 표본: comp "Polyester 100%" 인데
// 글머리표에는 "Main: 50% recycled polyester, 30% polyester, 20% elastane" · "Trims: 100% polyester" — comp 가 장식 줄을 집었다.
//
// 이 파일은 비교만 한다(네트워크 없음). docs/field-map.md 의 '두 번째 증인' 절을 build-field-map.mjs 가 이것으로 만든다.
import { compFromText } from "./detail-core.mjs";

const norm = (c) => String(c || "").toLowerCase().split(/\n/).map((l) => l.split(/\s*\/\s*/).map((t) => t.trim()).filter(Boolean).sort().join(" / ")).filter(Boolean);
const asLines = (arr) => {
  const lines = [];
  for (const c of arr) { const n = c.line || 0; (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`); }
  return lines.filter(Boolean).map((l) => l.join(" / "));
};
const LABEL_RX = /^\s*([A-Za-z][A-Za-z ]{1,24}?)\s*[:：]/;
const ROLE = (label) => {
  const l = String(label || "").toLowerCase();
  if (/trim|rib|pocket|contrast|embroider|lace|cuff|collar|binding|piping|insert|appliq/.test(l)) return "minor";
  if (/lining|lined/.test(l)) return "lining";
  if (/main|shell|outer|body|self|fabric|composition|material|content/.test(l)) return "main";
  return "";
};

// 한 상품: comp(문자열)와 글머리표·설명. 돌려주는 것: null(증인 없음) 또는 { agree, kind, witness:[{text, comp, role}], verdict }
export function witnessOf(comp, feat, desc) {
  const lines = [...(feat || []), ...String(desc || "").split("\n")].map((t) => String(t).trim()).filter((t) => /\d{1,3}\s?%/.test(t));
  const wit = [];
  for (const t of lines) {
    const got = asLines(compFromText(t));
    if (!got.length) continue;
    const label = (t.match(LABEL_RX) || [])[1] || "";
    for (const g of got) wit.push({ text: t.slice(0, 160), comp: g, role: ROLE(label), label });
  }
  if (!wit.length) return null;
  const have = norm(comp);
  const witSet = new Set(wit.map((w) => norm(w.comp)[0]));
  const mains = wit.filter((w) => w.role === "main");
  if (!have.length) return { agree: false, kind: "comp 빈 칸", witness: wit, verdict: "글머리표 — 페이지에 혼용률이 적혀 있는데 comp 가 못 읽음" };
  // comp 의 줄이 모두 글머리표 어딘가에 있고, 겉감 줄이 있으면 그 겉감이 comp 에 들어 있으면 일치.
  const allIn = have.every((l) => witSet.has(l));
  const mainIn = !mains.length || mains.some((w) => have.includes(norm(w.comp)[0]));
  if (allIn && mainIn) return { agree: true, witness: wit };
  // 어긋남 — 판정 근거
  const minorHit = wit.filter((w) => w.role === "minor" && have.includes(norm(w.comp)[0]));
  let verdict = "";
  if (minorHit.length && mains.length) verdict = `글머리표 — comp 가 장식 줄(${minorHit[0].label})을 집었고 겉감(${mains[0].label}) 줄이 따로 있다`;
  else if (!allIn && wit.length === 1 && !wit[0].label) verdict = "판단 필요 — 글머리표 한 줄(이름표 없음)과 comp 가 다르다";
  return { agree: false, kind: minorHit.length ? "장식 줄" : "값 다름", witness: wit, verdict };
}
