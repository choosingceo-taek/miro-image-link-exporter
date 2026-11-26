#!/usr/bin/env node
// 제목 컬러(scripts/title-color.mjs) — "<상품명> in <컬러> | <브랜드>" 에서 컬러를 읽되, 소재 설명·주소에 없는 말은 읽지 않는다.
// 실제 페이지(현장 측정 45776242765 가 남긴 시험 자료)의 기대값은 사람이 제목과 주소를 읽고 적었다.
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { colorFromTitle } from "./title-color.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0, n = 0;
const eq = (label, got, want) => {
  n++;
  if (got !== want) { bad++; console.error(`  ❌ ${label}\n     기대 ${JSON.stringify(want)}\n     실제 ${JSON.stringify(got)}`); } else console.log(`  ✓ ${label}`);
};
const page = (f) => gunzipSync(readFileSync(join(ROOT, "scripts/fixtures", f))).toString("utf8");

// 실제 페이지 — <title> 과 주소
eq("White Stuff — 'NELLY COTTON NOTCH NECK T-SHIRT in TEAL PRINT | White Stuff' · /TEAL_PR",
  colorFromTitle(page("detail-pages/whitestuff-tealpr.html.gz"), "https://www.whitestuff.com/p/7379/nelly-cotton-notch-neck-t-shirt/TEAL_PR"), "Teal Print");
eq("White Stuff — 'KIM BUTTON THROUGH TEE in NAVY MULTI | White Stuff' · /NAVY_MULTI",
  colorFromTitle(page("detail-pages/whitestuff.html.gz"), "https://www.whitestuff.com/p/8703/447978-kim-button-through-tee/NAVY_MULTI"), "Navy Multi");
eq("The Upside — 'COSMIC WIDE LEG SHANA PANT in WASHED BLACK | The UPSIDE' · -washed-black-",
  colorFromTitle(page("detail-pages/theupside-cosmicwidelegshanapantwashedblackusw2260.html.gz"), "https://www.theupside.com/cosmic-wide-leg-shana-pant-washed-black-usw226028/"), "Washed Black");
eq("The Upside — 'MAYA SAL DOUBLE LAYER BRA in SETTING SUN'",
  colorFromTitle(page("detail-pages/theupside-mayasaldoublelayerbra.html.gz"), "https://www.theupside.com/maya-sal-double-layer-bra-setting-sun-usw426067/"), "Setting Sun");

// 읽지 않을 것
const t = (title) => `<html><head><title>${title}</title></head><body></body></html>`;
eq("소재 설명 'in Organic Cotton' 은 컬러가 아니다", colorFromTitle(t("Shirt in Organic Cotton | Brand"), "https://x.com/p/shirt-organic-cotton"), "");
eq("'in Linen' 은 컬러가 아니다", colorFromTitle(t("Rowena Trousers in Linen | White Stuff"), "https://x.com/p/rowena-linen"), "");
eq("주소에 없는 말은 읽지 않는다", colorFromTitle(t("Easy Tee in Navy | Brand"), "https://x.com/products/easy-tee-12345"), "");
eq("'in Stock' 같은 안내는 컬러가 아니다", colorFromTitle(t("Easy Tee in Stock | Brand"), "https://x.com/products/easy-tee-in-stock"), "");
eq("'in' 이 없으면 빈 값", colorFromTitle(t("Easy Tee | Brand"), "https://x.com/products/easy-tee-navy"), "");
eq("제목이 없으면 빈 값", colorFromTitle("<html><body>no title</body></html>", "https://x.com/p/a-navy"), "");

console.log(bad ? `\n${bad}/${n}개 실패` : `\n✅ 제목 컬러 ${n}건 통과`);
process.exit(bad ? 1 : 0);
