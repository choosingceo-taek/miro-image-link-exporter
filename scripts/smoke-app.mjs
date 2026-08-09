#!/usr/bin/env node
// 독립 앱(app.html)을 진짜 브라우저에서 띄우고 끝까지 눌러 보는 연기 테스트.
//
// scripts/test-app-flow.mjs 는 규칙만 본다 — 계산이 맞아도 화면이 그 값을 안
// 그리거나 버튼 배선이 끊기면 통과한다. 여기서는 브랜드 클릭 → 상품 표시 →
// 선택 → 엑셀 내려받기까지 실제로 밟고, 받은 xlsx 를 열어 혼용률 열과
// 썸네일이 들어갔는지 확인한다.
//
// CI 에는 넣지 않는다: 크로미움 내려받기에 몇 분이 걸리고, 이 저장소는 이미
// GitHub 러너를 못 받아 배치가 통째로 건너뛰는 일이 있었다. 손으로 돌린다:
//
//   npm i --no-save playwright@1.49.1 exceljs@4.4.0
//   npx playwright install --with-deps chromium
//   node scripts/smoke-app.mjs
//
// Worker 는 실제로 부르지 않는다 — 응답을 가짜로 물려 두므로 네트워크 없이,
// 데이터가 어떻든 늘 같은 결과가 나온다.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { tmpdir } from "node:os";
import { deflateSync } from "node:zlib";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = mkdtempSync(join(tmpdir(), "rack-smoke-"));
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png" };
const require_ = createRequire(import.meta.url);

// 썸네일 경로를 진짜로 태우려면 디코딩되는 PNG 가 있어야 한다. 처음엔 손으로
// 적은 base64 를 썼는데 IDAT 가 안 풀려서 브라우저가 거부했고, 그 탓에 썸네일이
// 빈 채로 "통과"할 뻔했다. 그래서 여기서 직접 만든다.
function makePng(w, h) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    const o = y * (w * 3 + 1);
    raw[o] = 0;   // 필터 타입 0
    for (let x = 0; x < w; x++) { raw[o + 1 + x * 3] = 200; raw[o + 2 + x * 3] = 60 + y; raw[o + 3 + x * 3] = 80; }
  }
  const tab = [...Array(256)].map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (b) => {
    let c = 0xFFFFFFFF;
    for (const x of b) c = tab[(c ^ x) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const cc = Buffer.alloc(4); cc.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, cc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;   // 8bit RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0)),
  ]);
}
const PNG = makePng(60, 80);

const srv = createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/img.png") {
    res.writeHead(200, { "Content-Type": "image/png", "Access-Control-Allow-Origin": "*" });
    return res.end(PNG);
  }
  const f = join(ROOT, url.pathname === "/" ? "app.html" : url.pathname);
  if (!existsSync(f)) { res.writeHead(404); return res.end("nope"); }
  res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(8931, r));

const WORKER = "https://fabric-extractor.hs-fabric-linker.workers.dev";
const now = Date.now();
const CATALOGS = { list: [
  { site: "vince.com.vince", brand: "Vince", count: 3, updated: now - 5 * 3600e3 },
  { site: "ae.com.americaneagle", brand: "American Eagle", count: 2, updated: now - 101 * 3600e3 },
]};
const CATALOG = { brand: "Vince", items: [
  { name: "Silk Blouse", imageUrl: "http://localhost:8931/img.png", productUrl: "https://www.vince.com/p/silk-blouse", price: "$295" },
  { name: "Wide Trouser", imageUrl: "http://localhost:8931/img.png", productUrl: "https://vince.com/p/wide-trouser/", price: "$345" },
  { name: "Cashmere Crew", imageUrl: "http://localhost:8931/img.png", productUrl: "https://www.vince.com/p/cashmere-crew", price: "$395" },
]};
const COMPS = {
  "https://vince.com/p/silk-blouse": { comp: "Silk 100%", color: "Ivory" },
  "https://WWW.vince.com/p/wide-trouser": { comp: "Wool 70% / Nylon 30%" },
  "https://www.vince.com/p/cashmere-crew": { none: 1 },
};

// PLAYWRIGHT_CHROMIUM 이 있으면 그 실행 파일을 쓴다(브라우저가 미리 깔린 환경).
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
// favicon 404 는 앱과 무관하다 — 정적 서버에 파일이 없을 뿐이다.
page.on("console", (m) => {
  if (m.type() !== "error") return;
  const t = m.text();
  const from = (m.location() && m.location().url) || "";
  if (/favicon/i.test(t) || /favicon/i.test(from)) return;
  errs.push("console: " + t);
});
page.on("requestfailed", (r) => {
  if (!/favicon/i.test(r.url())) errs.push("요청 실패: " + r.url());
});

// cdnjs 를 타지 않는다 — 망이 막힌 곳에서도 돌아야 하고, 외부가 흔들려서
// 테스트가 깨지면 안 된다. 같은 버전을 로컬 node_modules 에서 물린다.
await page.route("**/exceljs.min.js", (route) => route.fulfill({
  status: 200, contentType: "text/javascript",
  body: readFileSync(require_.resolve("exceljs/dist/exceljs.min.js"), "utf8"),
}));

await page.route(WORKER + "/**", (route) => {
  const u = new URL(route.request().url());
  const j = (o) => route.fulfill({ status: 200, contentType: "application/json",
    headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(o) });
  if (u.searchParams.has("catalogs")) return j(CATALOGS);
  if (u.searchParams.has("catalog")) return j(CATALOG);
  if (u.searchParams.has("comps")) return j(COMPS);
  if (u.searchParams.has("img")) return route.fulfill({ status: 200, contentType: "image/png",
    headers: { "Access-Control-Allow-Origin": "*" }, body: PNG });
  return route.fulfill({ status: 404, body: "?" });
});

const step = async (label, fn) => {
  try { await fn(); console.log("  ✅ " + label); }
  catch (e) { console.log("  ❌ " + label + " — " + e.message); process.exitCode = 1; }
};

await page.goto("http://localhost:8931/app.html");
await page.waitForSelector(".brand", { timeout: 8000 });

await step("브랜드 2개가 목록에 뜬다", async () => {
  const n = await page.locator(".brand").count();
  if (n !== 2) throw new Error("개수 " + n);
});
await step("101시간 된 브랜드는 stale 표시", async () => {
  const c = await page.locator(".brand.stale").count();
  if (c !== 1) throw new Error("stale " + c + "개");
});

await page.locator(".brand", { hasText: "Vince" }).click();
await page.waitForSelector(".card", { timeout: 8000 });

await step("상품 3개가 그리드에 뜬다", async () => {
  const n = await page.locator(".card").count();
  if (n !== 3) throw new Error("개수 " + n);
});
await step("오버레이 혼용률이 카드에 붙는다 (URL 표기 달라도)", async () => {
  const t = await page.locator(".card .cp:not(.none)").allTextContents();
  if (!t.includes("Silk 100%")) throw new Error("Silk 100% 없음: " + JSON.stringify(t));
  if (!t.includes("Wool 70% / Nylon 30%")) throw new Error("Wool 표기 없음: " + JSON.stringify(t));
});
await step("사이트 미표기는 '정보 없음' 으로 구분", async () => {
  const t = await page.locator(".card .cp.none").allTextContents();
  if (t.length !== 1 || t[0] !== "정보 없음") throw new Error(JSON.stringify(t));
});
await step("카테고리 탭이 계산된다", async () => {
  const t = await page.locator(".tab").allTextContents();
  const j = t.join(" ");
  if (!j.includes("전체 3")) throw new Error(j);
  if (!j.includes("셔츠 1")) throw new Error("셔츠 분류 안 됨: " + j);
  if (!j.includes("팬츠·스커트 1")) throw new Error("팬츠 분류 안 됨: " + j);
});

await page.locator("#selAll").click();
await step("전체 선택 후 혼용률 비율을 미리 보여 준다", async () => {
  const m = await page.locator("#msg").textContent();
  if (!m.includes("선택 3")) throw new Error(m);
  if (!m.includes("혼용률 2")) throw new Error(m);
  if (!m.includes("67%")) throw new Error("비율 계산: " + m);
  if (!m.includes("95% 미만")) throw new Error("열 닫힘 경고 없음: " + m);
});

await step("카테고리를 옮겨도 선택이 유지된다", async () => {
  await page.locator('.tab[data-cat="shirts"]').click();
  await page.waitForTimeout(120);
  const sel = await page.locator(".card.sel").count();
  if (sel !== 1) throw new Error("셔츠 탭 선택 " + sel);
  await page.locator('.tab[data-cat="all"]').click();
  await page.waitForTimeout(120);
  if ((await page.locator(".card.sel").count()) !== 3) throw new Error("전체 탭으로 돌아오니 선택이 풀림");
});

// 혼용률이 있는 것만 골라 95% 를 넘기면 열이 열려야 한다.
await page.locator("#selNone").click();
await page.locator(".card", { hasText: "Silk Blouse" }).click();
await page.locator(".card", { hasText: "Wide Trouser" }).click();
await step("혼용률 있는 것만 고르면 열이 열린다", async () => {
  const m = await page.locator("#msg").textContent();
  if (!m.includes("100%")) throw new Error(m);
  if (m.includes("95% 미만")) throw new Error("열이 닫힌다고 나옴: " + m);
});

const dl = page.waitForEvent("download", { timeout: 30000 });
await page.locator("#xlsx").click();
await step("엑셀이 실제로 내려받아진다", async () => {
  const d = await dl;
  const p = join(OUT, "out.xlsx");
  await d.saveAs(p);
  const buf = readFileSync(p);
  if (buf.length < 3000) throw new Error("파일이 너무 작다: " + buf.length + "B");
  if (buf.slice(0, 2).toString() !== "PK") throw new Error("xlsx 가 아니다");
  console.log(`     파일명 ${d.suggestedFilename()} · ${buf.length}B`);
});
await step("추출 후 상태 문구", async () => {
  const m = await page.locator("#msg").textContent();
  if (!m.includes("완료 · 총 2")) throw new Error(m);
});

// 받은 파일을 실제로 열어 본다 — 내려받아졌다는 것만으로는 안이 맞는지 모른다.
await step("엑셀 안에 혼용률 열과 썸네일이 들어 있다", async () => {
  const ExcelJS = require_("exceljs");
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(join(OUT, "out.xlsx"));
  const ws = wb.getWorksheet(1);
  const head = ws.getRow(1).values.slice(1);
  if (head.join(",") !== "브랜드,썸네일,URL,상품명,혼용률") throw new Error("머리글: " + head.join(","));
  const comps = [ws.getCell("E2").value, ws.getCell("E3").value].sort();
  if (comps.join("|") !== "Silk 100%|Wool 70% / Nylon 30%") throw new Error("혼용률 칸: " + comps.join("|"));
  if (ws.getImages().length !== 2) throw new Error("썸네일 " + ws.getImages().length + "개");
});

await page.screenshot({ path: join(OUT, "app.png"), fullPage: true });
if (errs.length) { console.log("  ⚠ 콘솔 오류:\n     " + errs.join("\n     ")); process.exitCode = 1; }
else console.log("  ✅ 콘솔 오류 없음");
console.log("  화면: " + join(OUT, "app.png"));

await browser.close();
srv.close();
