#!/usr/bin/env node
// 미로 패널의 브랜드 목록이 Render 상태와 무관하게 채워지는지 진짜 브라우저로 본다.
//
// 고치기 전에는 Render(/api/brands) 한 번이 전부였다. Render 무료 플랜은 놀면
// 잠들어 502 를 뱉는데, 그러면 브랜드 칸이 빈 채로 끝나서 미로에서 앱을 열면
// 브랜드를 고를 수 없었다 — 새로고침하면 그 사이 서버가 깨어 있어서 됐다.
//
// 그래서 여기서는 일부러 Render 를 죽여 놓고 브랜드가 고를 수 있게 뜨는지 본다.
// scripts/test-brandlist.mjs 는 합치기 규칙과 코드에 방어 장치가 있는지만 본다 —
// 실제로 화면의 <select> 가 채워지는지는 브라우저로만 확인할 수 있다.
//
// 손으로 돌린다(크로미움 내려받기가 몇 분이라 CI 에는 없다):
//   npm i --no-save playwright@1.49.1
//   npx playwright install --with-deps chromium
//   node scripts/smoke-panel-brands.mjs
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const WORKER = "https://fabric-extractor.hs-fabric-linker.workers.dev";
const RENDER = "https://market-research-uzs2.onrender.com";

const srv = createServer((req, res) => {
  const p = req.url.split("?")[0];
  // 미로 SDK 를 대신할 최소 스텁. 패널은 보드 정보와 drop 이벤트만 건드린다.
  if (p === "/miro-stub.js") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    return res.end(`window.miro = { board: {
      getInfo: async () => ({ id: 'stub-board' }),
      getSelection: async () => [], get: async () => [],
      viewport: { get: async () => ({ x:0, y:0, width: 1000, height: 800 }) },
      ui: { on: () => {}, openPanel: async () => {} },
      createImage: async () => ({ id: 'x' }),
    } };`);
  }
  const f = join(ROOT, p === "/" ? "index.html" : p);
  if (!existsSync(f)) { res.writeHead(404); return res.end("no"); }
  let body = readFileSync(f, "utf8");
  if (p === "/index.html") {
    // 실제 SDK 는 망을 타므로 스텁으로 바꿔 끼운다.
    body = body.replace(/<script src="https:\/\/miro\.com[^"]*"><\/script>/, '<script src="miro-stub.js"></script>');
  }
  res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" });
  res.end(body);
});
await new Promise((r) => srv.listen(8933, r));

const CATALOGS = { list: [
  { site: "vince.com.vince", brand: "Vince", count: 370, updated: Date.now() - 5 * 3600e3 },
  { site: "ae.com.americaneagle", brand: "American Eagle", count: 132, updated: Date.now() - 146 * 3600e3 },
  { site: "shopbop.com.shopbop", brand: "Shopbop", count: 459, updated: Date.now() - 6 * 3600e3 },
]};

let bad = 0;
const step = async (label, fn) => {
  try { await fn(); console.log("  ✅ " + label); }
  catch (e) { console.log("  ❌ " + label + " — " + e.message); bad++; }
};

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});

// renderMode: 'dead' = 502(잠든 상태), 'ok' = 정상
async function openPanel(ctx, renderMode) {
  const page = await ctx.newPage();
  await page.route(WORKER + "/**", (route) => {
    const u = new URL(route.request().url());
    const j = (o) => route.fulfill({ status: 200, contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(o) });
    if (u.searchParams.has("catalogs")) return j(CATALOGS);
    return j({ items: [] });
  });
  await page.route(RENDER + "/**", (route) => renderMode === "ok"
    ? route.fulfill({ status: 200, contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ brands: [
          { name: "Vince", url: "https://www.vince.com", categories: ["tops", "pants"] },
          { name: "American Eagle", url: "https://www.ae.com", categories: ["tops"], blocked: true },
        ]}) })
    : route.fulfill({ status: 502, contentType: "text/html", body: "<html>Bad Gateway</html>" }));
  await page.goto("http://localhost:8933/index.html?view=panel");
  await page.locator("#tabResearch").click();
  return page;
}

const names = (page) => page.locator("#pickBrand option:not([disabled])").allTextContents();

// ── ① Render 가 잠들어 있어도 브랜드를 고를 수 있어야 한다 (이게 원래 버그) ──
{
  const ctx = await browser.newContext();
  const page = await openPanel(ctx, "dead");
  await step("Render 가 502 여도 브랜드 목록이 뜬다", async () => {
    await page.waitForFunction(
      () => document.querySelectorAll("#pickBrand option").length > 1, null, { timeout: 15000 });
    const n = await names(page);
    for (const want of ["Vince", "American Eagle", "Shopbop"]) {
      if (!n.includes(want)) throw new Error(`${want} 없음 — ${JSON.stringify(n)}`);
    }
  });
  await step("고르면 실제로 값이 잡힌다", async () => {
    await page.selectOption("#pickBrand", "Vince");
    const v = await page.locator("#pickBrand").inputValue();
    if (v !== "Vince") throw new Error("선택값 " + JSON.stringify(v));
  });
  await ctx.close();
}

// ── ② Render 가 살아 있으면 카테고리까지 붙는다 ──
{
  const ctx = await browser.newContext();
  const page = await openPanel(ctx, "ok");
  await step("Render 가 살아 있으면 categories 가 붙어 카테고리 칸이 좁혀진다", async () => {
    await page.waitForFunction(
      () => document.querySelectorAll("#pickBrand option").length > 1, null, { timeout: 20000 });
    // American Eagle 은 tops 만 가진 브랜드로 물려 뒀다.
    await page.waitForFunction(() => {
      const b = document.getElementById("pickBrand");
      return b && [...b.options].some((o) => o.value === "American Eagle");
    }, null, { timeout: 20000 });
    await page.selectOption("#pickBrand", "American Eagle");
    await page.waitForTimeout(400);
    const cats = await page.locator("#pickCat option").allTextContents();
    if (cats.length > 4) throw new Error("카테고리가 안 좁혀졌다: " + JSON.stringify(cats));
  });

  // 캐시가 남았으면 다음 열기는 기다림이 없어야 한다.
  await step("두 번째 열기는 캐시로 즉시 채워진다", async () => {
    const p2 = await openPanel(ctx, "dead");
    await p2.waitForFunction(
      () => document.querySelectorAll("#pickBrand option").length > 1, null, { timeout: 2500 });
    const n = await names(p2);
    if (!n.includes("Vince")) throw new Error(JSON.stringify(n));
  });
  await ctx.close();
}

await browser.close();
srv.close();
if (bad) { console.error(`\n패널 브랜드 목록 ${bad}건 실패`); process.exit(1); }
console.log("✅ 패널 브랜드 목록 통과 — Render 가 죽어도 · 살아도 · 두 번째 열기도");
