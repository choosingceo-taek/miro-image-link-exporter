// 컬러웨이 — 페이지 제목 "<상품명> in <컬러> | <브랜드>" 에서 읽는다(야간 보강·크롬 보강이 함께 쓴다).
//
// 왜: White Stuff(665개)·The Upside(429개)는 컬러를 색상 선택 옵션·JSON-LD 어디에도 적지 않고 제목에만 적는다
// ("NELLY COTTON NOTCH NECK T-SHIRT in TEAL PRINT | White Stuff" · "COSMIC WIDE LEG SHANA PANT in WASHED BLACK | The UPSIDE").
// 그래서 두 브랜드의 컬러가 0% 였다(2026-11-26 야간 보강 리포트, 측정).
//
// 오탐을 막는 것:
//   · 컬러의 첫 낱말이 상품 주소의 마디에 그대로 있어야 한다(White Stuff '/TEAL_PR' · The Upside '-washed-black-').
//     "Shirt in Organic Cotton | X" 같은 소재 설명은 주소에 'organic' 마디가 없으면 걸러진다.
//   · 섬유 이름(cotton·linen …)이 든 말은 컬러가 아니다.
//   · 40자 이하, 낱말 넷 이하.
// worker/fabric-extractor.js 의 colorFromHtml 은 확장(chrome-extension/background.js)에 복사본이 있어 고치지 않고 여기에 둔다.
const FIBRE_WORD_RX = /\b(?:cotton|linen|wool|merino|silk|cashmere|viscose|rayon|lyocell|tencel|modal|polyester|nylon|polyamide|elastane|spandex|lycra|hemp|denim|leather|suede|jersey|velvet|corduroy|cord|fleece|knit|satin|organic|recycled)\b/i;
const NOT_COLOR_RX = /\b(?:size|pack|set|edition|collection|stock|store|sale|stretch|regular|petite|tall|plus|short|long|length)\b/i;

function decode(s) {
  return String(s || "").replace(/&amp;/gi, "&").replace(/&#0?39;|&apos;|&rsquo;/gi, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
const tc = (s) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

export function colorFromTitle(html, url) {
  const h = String(html || "");
  const title = decode((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]) ||
    decode((h.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) || [, ""])[1]);
  const m = title.match(/\S\s+in\s+([A-Za-z][A-Za-z '&\/-]{1,40}?)\s*(?:\||$)/);
  if (!m) return "";
  const color = m[1].trim();
  if (color.length > 40 || color.split(/\s+/).length > 4) return "";
  if (FIBRE_WORD_RX.test(color) || NOT_COLOR_RX.test(color)) return "";
  let path = "";
  try { path = new URL(url).pathname.toLowerCase(); } catch (e) { return ""; }
  const parts = new Set(path.split(/[-_/.]+/).filter(Boolean));
  const first = color.toLowerCase().split(/[\s\/&-]+/)[0];
  if (!first || first.length < 3 || !parts.has(first)) return "";
  return tc(color);
}
