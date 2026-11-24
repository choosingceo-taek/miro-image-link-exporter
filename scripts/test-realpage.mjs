#!/usr/bin/env node
// '받은 HTML 이 상품 페이지를 실제로 읽은 것인가' 판정(realPage)을 못 박는다.
//
// 왜 있는 테스트인지: 200 으로 온 봇 확인 화면이나 스크립트로만 그리는 빈 껍데기를
// '읽었다'로 치면 소재가 없다는 결론(none)이 나고, 엑셀에 '정보 없음'이 박힌 채
// 다시는 읽지 않는다(Zara·H&M·Massimo Dutti). 반대로 멀쩡한 상품 페이지를 차단으로
// 치면 그 브랜드의 혼용률은 영영 '확인 필요'로 남는다 — 둘 다 조용히 망가진다.
//
// 같은 규칙이 두 곳에 있다: scripts/enrich-comp.mjs(야간 보강)와
// chrome-extension/background.js(확장의 fetch 보강). 두 벌을 소스에서 그대로 떼어 와
// 같은 표로 돌린다 — 한쪽만 고치면 여기서 걸린다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// CHALLENGE_RX 선언부터 realPage 함수 끝까지 떼어 낸다.
function load(rel) {
  const src = readFileSync(join(ROOT, rel), "utf8");
  const i = src.indexOf("const CHALLENGE_RX");
  const f = src.indexOf("function realPage(", i);
  const j = src.indexOf("\n}\n", f);
  if (i < 0 || f < 0 || j < 0) throw new Error(`${rel}: realPage 를 찾지 못함`);
  const block = src.slice(i, j + 2);
  const rx = (block.match(/const CHALLENGE_RX = (\/.*\/[a-z]*);/) || [])[1];
  return { fn: new Function(block + "\n return realPage;")(), rx };
}
const copies = {
  "enrich-comp.mjs": load("scripts/enrich-comp.mjs"),
  "background.js": load("chrome-extension/background.js"),
};

// 두 벌의 차단 문구 목록 자체가 같아야 한다 — 표에 없는 문구에서 갈라지지 않게.
if (copies["enrich-comp.mjs"].rx !== copies["background.js"].rx) {
  fail("CHALLENGE_RX 가 두 파일에서 다르다\n     enrich-comp: " + copies["enrich-comp.mjs"].rx +
    "\n     background : " + copies["background.js"].rx);
}

// 메뉴·설명이 있는 평범한 화면 글(600자 이상).
const prose = ("Free shipping on orders over $75. Women New Arrivals Tops Dresses Pants Sale. " +
  "The Everyday Crew Tee is cut from soft, breathable fabric with a relaxed fit and a ribbed neckline. " +
  "Machine wash cold, tumble dry low. Imported. Size guide: XS S M L XL. Reviews (124). ").repeat(4);
const bigScript = `<script>window.__APP__=${JSON.stringify({ blob: "x".repeat(20000) })}</script>`;

const CASES = [
  // [설명, html, 실제로 읽은 페이지인가]
  ["평범한 상품 페이지", `<html><head><title>Crew Tee | Shop</title></head><body><h1>Crew Tee</h1><p>${prose}</p></body></html>`, true],
  ["JSON-LD Product + 본문이 얇다", `<html><head><title>Crew Tee</title><script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Crew Tee"}</script></head><body><div id="root"></div></body></html>`, true],
  ["og:type product + 본문이 얇다", `<html><head><title>Crew Tee</title><meta property="og:type" content="product"></head><body><div id="root">Crew Tee</div></body></html>`, true],
  ["스크립트만 큰 빈 껍데기", `<html><head><title>Shop</title>${bigScript}</head><body><div id="root"></div><noscript>Loading</noscript></body></html>`, false],
  ["Pardon Our Interruption (Imperva/Distil)", `<html><head><title>Pardon Our Interruption</title></head><body><h1>Pardon Our Interruption</h1><p>As you were browsing something about your browser made us think you were a bot.</p></body></html>`, false],
  ["Access Denied (Akamai)", `<HTML><HEAD><TITLE>Access Denied</TITLE></HEAD><BODY><H1>Access Denied</H1>You don't have permission to access "http://www.shop.com/p/1" on this server.<P>Reference #18.6c2c1002.1700000000.1a2b3c</BODY></HTML>`, false],
  ["Cloudflare Just a moment", `<!DOCTYPE html><html lang="en-US"><head><title>Just a moment...</title><script>(function(){window._cf_chl_opt={cvId:'3'}})();</script></head><body><div class="main-wrapper"><h1>shop.com</h1><h2>Checking if the site connection is secure</h2></div></body></html>`, false],
  ["PerimeterX Press & Hold", `<html lang="en"><head><title>Access to this page has been denied</title><script>window._pxAppId='PXabc123';</script><script src="//client.perimeterx.net/PXabc123/main.min.js"></script></head><body><div class="px-captcha-container"><p>Press &amp; Hold to confirm you are</p><p>a human (and not a bot).</p><div id="px-captcha"></div><p>Reference ID 1a2b3c4d</p></div></body></html>`, false],
  // 실제 HTML 에서는 & 가 그대로 나오기도 한다.
  ["PerimeterX Press & Hold(이스케이프 없음)", `<html><head><title>shop.com</title></head><body><p>Press & Hold to confirm you are a human (and not a bot).</p></body></html>`, false],
  ["Incapsula 자원 페이지", `<html style="height:100%"><head><META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW"><meta name="format-detection" content="telephone=no"><script type="text/javascript" src="/_Incapsula_Resource?SWJIYLWA=719d34d31c8e3a6e6fffd425f7e032f3"></script></head><body style="margin:0px;height:100%"><iframe id="main-iframe" src="/_Incapsula_Resource?CWUDNSAI=24&xinfo=8-1234&incident_id=0-1234&edet=15" frameborder=0 width="100%" height="100%">Request unsuccessful. Incapsula incident ID: 0-123456789</iframe></body></html>`, false],
  ["DataDome 캡차(글 없이 iframe 뿐)", `<html><head><title>shop.com</title><script>var dd={'rt':'c','cid':'AHrlqAAA','hsh':'ABC','t':'fe','host':'geo.captcha-delivery.com'}</script><script src="https://ct.captcha-delivery.com/c.js"></script></head><body><iframe src="https://geo.captcha-delivery.com/captcha/?initialCid=AHrlqAAA" title="DataDome CAPTCHA" width="100%" height="100%"></iframe></body></html>`, false],
  // 긴 정상 페이지가 본문 깊은 곳에서 'captcha' 를 언급한다(문의 폼 안내 등) — 읽은 것이다.
  ["본문 깊은 곳에 captcha 언급이 있는 긴 정상 페이지", `<html><head><title>Linen Shirt</title></head><body><h1>Linen Shirt</h1><p>${prose}</p><footer>Contact us — this form is protected by reCAPTCHA and the Google Privacy Policy applies. Solve the captcha to send.</footer></body></html>`, true],
  // 정상 페이지인데 봇 차단 솔루션의 스크립트가 머리에 실려 있다. 그 사이트의 모든 상품
  // 페이지가 이렇다 — 이걸 차단으로 치면 브랜드 전체가 영영 '확인 필요'로 남는다.
  ["PerimeterX 로 보호되는 정상 상품 페이지", `<html><head><title>Ribbed Tank | Shop</title><script>window._pxAppId='PXabc123';</script><script src="//client.perimeterx.net/PXabc123/main.min.js"></script></head><body><h1>Ribbed Tank</h1><p>${prose}</p></body></html>`, true],
  ["Incapsula 로 보호되는 정상 상품 페이지", `<html><head><title>Wool Coat</title><script src="/_Incapsula_Resource?SWJIYLWA=719d34d31c8e3a6e6fffd425f7e032f3"></script></head><body><h1>Wool Coat</h1><p>${prose}</p></body></html>`, true],
  ["다국어 문구 묶음에 'Access denied' 가 든 정상 상품 페이지", `<html><head><title>Denim Jacket</title><script>window.__i18n={"errors.forbidden":"Access denied","errors.retry":"Just a moment"}</script></head><body><h1>Denim Jacket</h1><p>${prose}</p></body></html>`, true],
  ["빈 문자열", "", false],
];

for (const [name, { fn }] of Object.entries(copies)) {
  for (const [label, html, want] of CASES) {
    let got;
    try { got = fn(html); } catch (e) { got = "오류 " + e.message; }
    if (got !== want) fail(`[${name}] ${label} — 기대 ${want ? "읽음" : "차단/껍데기"} 실제 ${got}`);
  }
}
// 두 벌이 표 밖의 입력에서도 같은 답을 내는지 — 표의 HTML 을 조금씩 잘라 본다.
for (const [, html] of CASES) {
  for (const n of [200, 700, 3000]) {
    const h = html.slice(0, n);
    const a = copies["enrich-comp.mjs"].fn(h), b = copies["background.js"].fn(h);
    if (a !== b) fail(`두 벌의 답이 갈라짐(앞 ${n}자): ${h.slice(0, 60)}…`);
  }
}

// ── none 을 적어도 되는가(productRead) ──────────────────────────────
// realPage 는 '차단 화면이 아니다'까지만 본다. none(엑셀 '정보 없음', 한동안 다시 안 봄)은
// "이 상품의 본문이 그려진 페이지"에서만 적는다. 규칙은 enrich-comp.mjs 한 벌이고,
// enrich-comp-browser.mjs 는 그 구간을 그대로 떼어 쓴다 — 떼어 쓰는지도 여기서 본다.
const ecSrc = readFileSync(join(ROOT, "scripts/enrich-comp.mjs"), "utf8");
const A = "// ── 이 상품 페이지를 정말 읽었나(none 판정) 시작", B = "// ── 이 상품 페이지를 정말 읽었나(none 판정) 끝";
const prBlock = ecSrc.slice(ecSrc.indexOf(A), ecSrc.indexOf(B));
const productRead = new Function(prBlock + "\n return productRead;")();
const brSrc = readFileSync(join(ROOT, "scripts/enrich-comp-browser.mjs"), "utf8");
if (!brSrc.includes("이 상품 페이지를 정말 읽었나(none 판정) 시작")) fail("enrich-comp-browser.mjs 가 productRead 구간을 떼어 쓰지 않는다");
if (!/productRead\(html, p\.name/.test(brSrc)) fail("enrich-comp-browser.mjs 가 none 을 적기 전에 productRead(html, p.name) 를 보지 않는다");
if (!/productRead\(html, name\)/.test(ecSrc)) fail("enrich-comp.mjs 가 none 을 적기 전에 productRead(html, name) 를 보지 않는다");

// Patagonia 껍데기(11/24 실측: 모든 엔진에서 글 1,017자). 메뉴·바닥글만 있고 상품 본문이 없다.
const shellProse = ("Shop Women Men Kids Packs & Gear Activism Stories Worn Wear Gift Cards Sign In Cart " +
  "Free shipping on orders over $99 Ironclad Guarantee Returns Help Contact Find a store ").repeat(6);
const PR = [
  // [설명, html, 카탈로그 상품명, none 을 적어도 되는가]
  ["Loft 형 — 상품명이 화면에 있고 소재 표기 없음", `<html><head><title>Ribbed Crew Sweater | LOFT</title></head><body><h1>Ribbed Crew Sweater</h1><p>${prose}</p></body></html>`, "Ribbed Crew Sweater", true],
  ["상품명 대소문자·문장부호 차이(RUSTIC COTTON T-SHIRT)", `<html><body><h1>RUSTIC COTTON T-SHIRT</h1><p>${prose}</p></body></html>`, "Rustic cotton t-shirt", true],
  ["상품명 낱말 일부만 다름(색 이름이 붙음)", `<html><body><h1>Women's Long-Sleeved Capilene Cool Merino Shirt</h1><p>${prose}</p></body></html>`, "W's L/S Capilene Cool Merino Shirt - Black", true],
  ["Patagonia 껍데기 — 제목·JSON-LD 엔 이름이 있지만 화면 글엔 없다", `<html><head><title>Women's In-Spired Easy-Cut Tee</title><script type="application/ld+json">{"@type":"Product","name":"Women's In-Spired Easy-Cut Tee"}</script></head><body><header>${shellProse}</header><div id="app"></div></body></html>`, "Women's In-Spired Easy-Cut Tee", false],
  // 11/24 실측 그대로(덤프, 파이어폭스·크롬·fetch 모두 같은 1,017자): 상품 주소인데 점검 안내 화면이 온다.
  // 차단 문구가 없고 글도 600자가 넘어 realPage 는 '읽음' — 이걸로 Patagonia 167개에 none 이 찍혔다.
  ["Patagonia 점검 화면(실측)", `<html><head><title>Patagonia Outdoor Clothing &amp; Gear</title></head><body><h1>Patagonia</h1><h2>We’re working on it.</h2><p>System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and moving shortly. Please try again in a few minutes.</p><p>U.S. &amp; Canada Europe Japan If you live in the United States or Canada and need to contact us immediately, please visit our Help Center . Patagonia Customer Service Reps are available weekdays from 6am to 6pm, and weekends from 7am to 3pm (PT). European customers can email customerservice.europe@patagonia.com or reach us by phone. Patagonia EU Customer Service Representatives are available Monday to Thursday from 9am to 5.30pm and on Friday from 9am to 5pm (CET). Austria: (+43) 512 219 532 Denmark: (+45) 78 72 45 69 France: (+33) 450 88 44 92 Germany: (+49) 89 262 079 666 Ireland: (+353) 766 705 887 Italy: (+39) 047 48 61 000 Netherlands: (+31) 20 299 0787 Spain: (+34) 518 89 92 53 Switzerland: (+41) 215 60 61 10 United Kingdom: (+44) 203 636 9222</p></body></html>`, "W's I Voted Sticker Easy Cut Tee in White", false],
  ["다른 상품 페이지로 넘어감", `<html><body><h1>Classic Denim Jacket</h1><p>${prose}</p></body></html>`, "Silk Slip Dress", false],
  ["상품명 없음 + JSON-LD Product + 글 충분", `<html><head><script type="application/ld+json">{"@type":"Product","name":"X"}</script></head><body><p>${prose}</p></body></html>`, "", true],
  ["상품명 없음 + 상품 신호 없음", `<html><body><p>${prose}</p></body></html>`, "", false],
  ["상품명 없음 + og:type product 지만 글이 얇다", `<html><head><meta property="og:type" content="product"></head><body><div id="root">Tee</div></body></html>`, "", false],
  ["빈 문자열", "", "Crew Tee", false],
];
for (const [label, html, name, want] of PR) {
  let got;
  try { got = productRead(html, name); } catch (e) { got = "오류 " + e.message; }
  if (got !== want) fail(`[productRead] ${label} — 기대 ${want ? "none 가능" : "못 읽음"} 실제 ${got}`);
}

if (bad) { console.error(`\nrealPage ${bad}건 실패`); process.exit(1); }
console.log(`✅ realPage 통과 — ${CASES.length}가지 페이지 × 두 벌(enrich-comp · 확장) 일치 · none 판정(productRead) ${PR.length}건`);
