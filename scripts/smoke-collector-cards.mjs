#!/usr/bin/env node
// 수집기가 상품 카드에서 사진을 찾아내는지 진짜 브라우저로 확인한다.
//
// 이 판단은 DOM 을 타고 오르내리는 일이라 문자열 테스트로는 못 잡는다. 실제로
// 두 브랜드가 이것 때문에 며칠씩 0개였다:
//
//  · Apiece Apart — 카드 전체를 덮는 투명 링크(<a class="absolute inset-0">)를 쓴다.
//    링크 안에는 sr-only 글자뿐이고 사진은 형제 요소라, 가장 가까운 div 만 보면
//    아무것도 못 찾는다. 링크 80개 중 이미지가 딸린 것 0개였다.
//  · Carhartt — 카드 첫머리에 확대보기 아이콘(eye-black.svg)이 온다. 첫 <img> 만
//    보면 그게 .svg 라 버려지고, 뒤에 있는 진짜 상품 사진까지 못 찾는다.
//
// 아래 HTML 은 두 사이트의 실제 구조(diagnose-page.md 에 찍힌 것)를 옮긴 것이다.
//
//   npm i --no-save playwright@1.49.1 && npx playwright install --with-deps chromium
//   node scripts/smoke-collector-cards.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// collector.js 는 pageCollector() 를 '정의'만 한다. 헤드리스 러너
// (browser-collect.mjs)와 똑같이 감싸서 불러야 한다 — 안 그러면 undefined 가
// 돌아오고, 테스트는 "상품 0개"를 코드 탓으로 오해한다.
const collectorSrc = readFileSync(join(ROOT, "chrome-extension/collector.js"), "utf8");
const COLLECTOR = `(async () => { ${collectorSrc}\n return await pageCollector(); })()`;

// 실제 사이트 구조를 옮긴 목록 페이지들.
const PAGES = {
  // 투명 오버레이 링크 — 링크 안에 이미지가 없고 형제로 놓인다.
  apieceApart: `
    <div class="grid">
      <div class="group relative">
        <div class="aspect-[3/4] overflow-hidden">
          <img src="https://cdn.apieceapart.com/isolde.jpg" width="600" height="800" alt="Cropped Isolde Button Down">
        </div>
        <a class="inline-flex items-center absolute inset-0 z-10 rounded-sm"
           aria-label="View details for Cropped Isolde Button Down"
           href="/products/cropped-isolde-button-down-2?id=f9201e82"><span class="sr-only">Cropped Isolde Button Down</span></a>
        <h3 class="mt-2 text-sm">Cropped Isolde Button Down</h3>
      </div>
      <div class="group relative">
        <div class="aspect-[3/4] overflow-hidden">
          <img src="https://cdn.apieceapart.com/monde.jpg" width="600" height="800" alt="Monde Drape Bias Top">
        </div>
        <a class="inline-flex items-center absolute inset-0 z-10 rounded-sm"
           aria-label="View details for Monde Drape Bias Top"
           href="/products/monde-drape-bias-top?id=7a00e29c"><span class="sr-only">Monde Drape Bias Top</span></a>
        <h3 class="mt-2 text-sm">Monde Drape Bias Top</h3>
      </div>
    </div>`,

  // 카드 첫머리에 아이콘 <img> 가 오고 진짜 사진은 그 뒤에 온다.
  carhartt: `
    <div class="product-grid">
      <div class="product-item">
        <a class="cx-product-image-container" href="/en-eu/p/relaxed-fit-fleece-joggers/105510">
          <div class="product-image-wrapper">
            <img src="/images/common/eye-black.svg" alt="" aria-hidden="true">
            <img src="https://imagery.carhartt.com/105510_V61.jpg" width="500" height="500" alt="Relaxed Fit Fleece Joggers">
          </div>
        </a>
        <a class="product-name" href="/en-eu/p/relaxed-fit-fleece-joggers/105510">
          <h2 class="product-name-label">Relaxed Fit Fleece Joggers</h2></a>
      </div>
    </div>`,

  // 안전장치: 그리드가 카드로 오인되면 옆 상품 사진을 가져간다. 그런 일이 없어야 한다.
  noImageAtAll: `
    <div class="list">
      <div><a href="/products/aaa-no-photo-here">A</a></div>
      <div><a href="/products/bbb-no-photo-here">B</a></div>
      <div><a href="/products/ccc-no-photo-here">C</a></div>
      <div><a href="/products/ddd-no-photo-here">D</a></div>
      <div class="banner"><img src="https://cdn.x/hero-banner.jpg" width="1200" height="400" alt="Sale"></div>
    </div>`,
};

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });

async function harvest(body) {
  // about:blank 이 아니라 실제 출처가 있어야 상대경로(/products/...)가 절대주소가 된다.
  await page.route("https://shop.example.com/**", (r) =>
    r.fulfill({ status: 200, contentType: "text/html", body: `<html><body>${body}</body></html>` }));
  await page.goto("https://shop.example.com/c/tops");
  await page.waitForTimeout(150);
  return (await page.evaluate(COLLECTOR)) || {};
}

// ── Apiece Apart: 투명 오버레이 링크 ──
{
  const r = await harvest(PAGES.apieceApart);
  const items = r.items || [];
  if (items.length !== 2) {
    fail(`Apiece Apart 구조 — 상품 ${items.length}개 (기대 2) · 탈락 ${JSON.stringify(r.rej)}`);
  } else {
    const byUrl = Object.fromEntries(items.map((i) => [i.productUrl.split("?")[0].split("/").pop(), i]));
    const a = byUrl["cropped-isolde-button-down-2"];
    if (!a) fail("Apiece Apart — 상품 URL 이 다르다: " + items.map((i) => i.productUrl).join(", "));
    else if (a.imageUrl !== "https://cdn.apieceapart.com/isolde.jpg") {
      fail(`Apiece Apart — 사진이 틀렸다: ${a.imageUrl}`);
    }
    // 옆 상품 사진을 끌어오지 않았는지.
    const b = byUrl["monde-drape-bias-top"];
    if (b && b.imageUrl !== "https://cdn.apieceapart.com/monde.jpg") {
      fail(`Apiece Apart — 옆 상품 사진이 섞였다: ${b.imageUrl}`);
    }
  }
}

// ── Carhartt: 아이콘이 먼저 오는 카드 ──
{
  const r = await harvest(PAGES.carhartt);
  const items = r.items || [];
  const it = items.find((i) => /relaxed-fit-fleece-joggers/.test(i.productUrl));
  if (!it) fail(`Carhartt 구조 — 상품을 못 찾음 · 탈락 ${JSON.stringify(r.rej)}`);
  else if (it.imageUrl !== "https://imagery.carhartt.com/105510_V61.jpg") {
    fail(`Carhartt — 아이콘(.svg)에 걸려 사진을 못 찾았다: ${it.imageUrl}`);
  }
}

// ── 안전장치: 사진이 없으면 없는 대로 버려야 한다 ──
{
  const r = await harvest(PAGES.noImageAtAll);
  const stolen = (r.items || []).filter((i) => /hero-banner/.test(i.imageUrl || ""));
  if (stolen.length) {
    fail(`사진 없는 링크가 배너 이미지를 끌어왔다 (${stolen.length}개) — 카드 범위를 너무 넓게 잡는다`);
  }
}

await browser.close();
if (bad) { console.error(`\n카드 사진 찾기 ${bad}건 실패`); process.exit(1); }
console.log("✅ 카드 사진 찾기 통과 — 투명 오버레이 링크 · 아이콘 우선 카드 · 과확장 방지");
