#!/usr/bin/env node
// 독립 앱(app.html)을 진짜 브라우저에서 띄우고 끝까지 눌러 보는 연기 테스트.
//
// scripts/test-app-flow.mjs · test-app-basket.mjs 는 규칙만 본다 — 계산이 맞아도
// 화면이 그 값을 안 그리거나 버튼 배선이 끊기면 통과한다. 여기서는 실제로 밟는다:
//   ① 브랜드 클릭 → 상품 표시 → 선택 → 엑셀 내려받기(받은 xlsx 를 열어 확인)
//   ② 전체 상품 검색 → 두 브랜드 결과 · 늦게 받은 오버레이로 혼용률 갱신
//   ③ 브랜드 A 에서 고르고 B 로 옮겨 또 고르기 → 한 엑셀에 두 브랜드
//   ④ '혼용률 있는 것만' · '혼용률 있는 상품만 보기' · Shift 범위 선택 · 깨진 이미지
//   ⑤ #site= 바로가기 · 마지막 브랜드 기억 · '/' 와 Esc
//   ⑥ 세그먼트 칩(Render 정상 / Render 응답 없음)
//   ⑦ 380px(브라우저 옆 패널 너비)에서 가로 스크롤 없음 · 서랍 · 2열
//
// CI 에서는 단위 테스트와 따로 'smoke' 잡으로 돈다(.github/workflows/test.yml —
// 크로미움 내려받기에 몇 분이 걸려 나눴다). 손으로 돌릴 때:
//
//   npm i --no-save playwright@1.49.1 exceljs@4.4.0
//   npx playwright install --with-deps chromium
//   node scripts/smoke-app.mjs
//
// SHOTS=<폴더> 를 주면 380px·1280px 화면을 그 폴더에 남긴다.
//
// Worker·Render 는 실제로 부르지 않는다 — 응답을 가짜로 물려 두므로 네트워크 없이,
// 데이터가 어떻든 늘 같은 결과가 나온다.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdtempSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { tmpdir } from "node:os";
import { deflateSync } from "node:zlib";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = mkdtempSync(join(tmpdir(), "rack-smoke-"));
const SHOTS = process.env.SHOTS || "";
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png" };
const require_ = createRequire(import.meta.url);
const PORT = Number(process.env.PORT) || 8931;
const HERE = `http://localhost:${PORT}`;

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
await new Promise((r) => srv.listen(PORT, r));

const WORKER = "https://fabric-extractor.hs-fabric-linker.workers.dev";
const RENDER = "https://market-research-uzs2.onrender.com";
const IMG = `${HERE}/img.png`;
const BROKEN = `${HERE}/missing-image.png`;   // 404 — 빈 자리 표시로 바뀌어야 한다
const now = Date.now();
const CATALOGS = { list: [
  { site: "vince.com.vince", brand: "Vince", count: 3, updated: now - 5 * 3600e3 },
  { site: "ae.com.americaneagle", brand: "American Eagle", count: 3, updated: now - 101 * 3600e3 },
]};
const CATALOG = {
  "vince.com.vince": { brand: "Vince", items: [
    { name: "Silk Blouse", imageUrl: IMG, productUrl: "https://www.vince.com/p/silk-blouse", price: "$295" },
    { name: "Wide Trouser", imageUrl: IMG, productUrl: "https://vince.com/p/wide-trouser/", price: "$345" },
    { name: "Cashmere Crew", imageUrl: IMG, productUrl: "https://www.vince.com/p/cashmere-crew", price: "$395" },
  ]},
  "ae.com.americaneagle": { brand: "American Eagle", items: [
    { name: "Silk Cami Top", imageUrl: IMG, productUrl: "https://www.ae.com/p/silk-cami", price: "$40" },
    { name: "Linen Button Shirt", imageUrl: IMG, productUrl: "https://www.ae.com/p/linen-shirt", price: "$50" },
    { name: "Ribbed Tank", imageUrl: BROKEN, productUrl: "https://www.ae.com/p/ribbed-tank", price: "$20" },
  ]},
};
const COMPS = {
  "vince.com.vince": {
    "https://vince.com/p/silk-blouse": { comp: "Silk 100%", color: "Ivory" },
    "https://WWW.vince.com/p/wide-trouser": { comp: "Wool 70% / Nylon 30%" },
    "https://www.vince.com/p/cashmere-crew": { none: 1 },
  },
  "ae.com.americaneagle": {
    // 인덱스에는 아직 없는 혼용률 — 검색 결과에 늦게라도 붙어야 한다.
    "https://www.ae.com/p/silk-cami": { comp: "Silk 92% / Elastane 8%" },
    "https://www.ae.com/p/ribbed-tank": { comp: "Cotton 100%" },
  },
};
// 상품 상세(detail:<site>) — 설명·디테일·컬러 전부·사진. 엑셀 추가 열과 상세 보기가 쓴다.
const DETAILS = {
  "vince.com.vince": {
    "https://www.vince.com/p/silk-blouse": { desc: "A fluid silk blouse with a relaxed drape.", feat: ["Relaxed fit", "Button front"],
      colors: ["Ivory", "Black"], imgs: ["https://img.example/a.jpg", "https://img.example/b.jpg"], sku: "V123" },
  },
};
// 검색 인덱스: 야간에 만들어진 것이라 오버레이보다 낡았다(AE 혼용률이 비어 있다).
const INDEX = { items: [
  ...CATALOG["vince.com.vince"].items.map((p) => ({ ...p, brand: "Vince", comp: p.name === "Silk Blouse" ? "Silk 100%" : "" })),
  ...CATALOG["ae.com.americaneagle"].items.map((p) => ({ ...p, brand: "American Eagle", comp: "" })),
]};
const RENDER_BRANDS = { brands: [
  { name: "Vince", url: "https://vince.com", segments: ["WMN"] },
  { name: "American Eagle", url: "https://ae.com", segments: ["YWMN"] },
]};

// PLAYWRIGHT_CHROMIUM 이 있으면 그 실행 파일을 쓴다(브라우저가 미리 깔린 환경).
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const errs = [];
const counts = { index: 0, comps: {} };

// renderMode: 'ok' = 분류를 준다, 'dead' = 502(잠든 상태)
async function openApp(ctx, { renderMode = "ok", hash = "", viewport } = {}) {
  const page = await ctx.newPage();
  if (viewport) await page.setViewportSize(viewport);
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  // favicon 404 는 앱과 무관하다. 깨진 이미지 404 는 일부러 넣은 것이다.
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    const from = (m.location() && m.location().url) || "";
    if (/favicon|missing-image/i.test(t + " " + from)) return;
    // Render 가 잠든 경우는 일부러 502 를 준다.
    if (renderMode === "dead" && /502|api\/brands/.test(t + " " + from)) return;
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
    if (u.searchParams.has("catalog")) return j(CATALOG[u.searchParams.get("catalog")] || { items: [] });
    if (u.searchParams.has("comps")) {
      const s = u.searchParams.get("comps");
      counts.comps[s] = (counts.comps[s] || 0) + 1;
      return j(COMPS[s] || {});
    }
    if (u.searchParams.has("index")) { counts.index++; return j(INDEX); }
    if (u.searchParams.has("details")) return j(DETAILS[u.searchParams.get("details")] || {});
    if (u.searchParams.has("img")) return route.fulfill({ status: 200, contentType: "image/png",
      headers: { "Access-Control-Allow-Origin": "*" }, body: PNG });
    return route.fulfill({ status: 404, body: "?" });
  });
  await page.route(RENDER + "/**", (route) => renderMode === "ok"
    ? route.fulfill({ status: 200, contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(RENDER_BRANDS) })
    : route.fulfill({ status: 502, headers: { "Access-Control-Allow-Origin": "*" }, body: "Bad Gateway" }));
  await page.goto(`${HERE}/app.html${hash}`);
  return page;
}

const step = async (label, fn) => {
  try { await fn(); console.log("  ✅ " + label); }
  catch (e) { console.log("  ❌ " + label + " — " + e.message); process.exitCode = 1; }
};
const msgOf = (page) => page.locator("#msg").textContent();
const until = async (fn, ms = 5000) => {
  const t0 = Date.now();
  let last;
  while (Date.now() - t0 < ms) { last = await fn(); if (last) return last; await new Promise((r) => setTimeout(r, 80)); }
  return last;
};
async function readXlsx(d, name) {
  const p = join(OUT, name);
  await d.saveAs(p);
  const ExcelJS = require_("exceljs");
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(p);
  const ws = wb.getWorksheet(1);
  const head = ws.getRow(1).values.slice(1);
  const rows = [];
  for (let r = 2; r <= ws.rowCount; r++) rows.push(ws.getRow(r).values.slice(1));
  return { ws, head, rows, file: d.suggestedFilename(), size: readFileSync(p).length };
}

const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
const page = await openApp(ctx);
await page.waitForSelector(".brand", { timeout: 8000 });

console.log("① 브랜드 하나에서 고르고 엑셀");
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
await step("브랜드를 열면 주소가 #site= 로 바뀐다", async () => {
  const h = await page.evaluate(() => location.hash);
  if (h !== "#site=vince.com.vince") throw new Error(h);
});

await page.locator("#selAll").click();
await step("전체 선택 후 혼용률 비율을 미리 보여 준다", async () => {
  const m = await msgOf(page);
  if (!m.includes("선택 3")) throw new Error(m);
  if (!m.includes("혼용률 2")) throw new Error(m);
  if (!m.includes("67%")) throw new Error("비율 계산: " + m);
  if (!m.includes("95% 미만")) throw new Error("열 닫힘 경고 없음: " + m);
  if (!m.includes("‘혼용률 있는 것만’")) throw new Error("경고가 버튼을 가리키지 않음: " + m);
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
  const m = await msgOf(page);
  if (!m.includes("100%")) throw new Error(m);
  if (m.includes("95% 미만")) throw new Error("열이 닫힌다고 나옴: " + m);
});

let dl = page.waitForEvent("download", { timeout: 30000 });
await page.locator("#xlsx").click();
let x1;
await step("엑셀이 실제로 내려받아진다", async () => {
  x1 = await readXlsx(await dl, "out.xlsx");
  if (x1.size < 3000) throw new Error("파일이 너무 작다: " + x1.size + "B");
  if (x1.file !== `Vince_${new Date().toISOString().slice(0, 10)}.xlsx`) throw new Error("파일명 " + x1.file);
  console.log(`     파일명 ${x1.file} · ${x1.size}B`);
});
await step("추출 후 상태 문구", async () => {
  const m = await until(async () => { const t = await msgOf(page); return t.includes("완료") ? t : ""; }, 10000);
  if (!m.includes("완료 · 총 2")) throw new Error(m);
});
// 받은 파일을 실제로 열어 본다 — 내려받아졌다는 것만으로는 안이 맞는지 모른다.
await step("엑셀 안에 혼용률 열과 썸네일이 들어 있다", async () => {
  if (x1.head.join(",") !== "브랜드,썸네일,URL,상품명,혼용률,판매가,정가,사이즈,컬러 전부,설명,디테일,이미지 링크") throw new Error("머리글: " + x1.head.join(","));
  const comps = [x1.ws.getCell("E2").value, x1.ws.getCell("E3").value].sort();
  if (comps.join("|") !== "Silk 100%|Wool 70% / Nylon 30%") throw new Error("혼용률 칸: " + comps.join("|"));
  if (x1.ws.getImages().length !== 2) throw new Error("썸네일 " + x1.ws.getImages().length + "개");
});
// 추가 열: 기존 열 뒤에 판매가·정가·사이즈·컬러 전부·설명·디테일·이미지 링크 — 상세는 detail:<site> 에서.
await step("엑셀 추가 열(판매가·컬러 전부·설명·디테일·이미지 링크)", async () => {
  const row = [2, 3].map((r) => x1.ws.getRow(r).values.slice(1)).find((v) => String(v[3]).includes("Silk Blouse"));
  if (!row) throw new Error("Silk Blouse 행 없음");
  const [price, , , colors, desc, feat, imgs] = row.slice(5);
  if (price !== "$295") throw new Error("판매가 " + price);
  if (colors !== "Ivory, Black") throw new Error("컬러 전부 " + colors);
  if (desc !== "A fluid silk blouse with a relaxed drape.") throw new Error("설명 " + desc);
  if (feat !== "Relaxed fit\nButton front") throw new Error("디테일 " + JSON.stringify(feat));
  if (imgs !== "https://img.example/a.jpg\nhttps://img.example/b.jpg") throw new Error("이미지 " + JSON.stringify(imgs));
});
await page.screenshot({ path: join(OUT, "app.png"), fullPage: true });

console.log("② 전체 상품 검색");
await page.locator("#selNone").click();
await page.locator("#q").fill("silk");
await page.waitForSelector(".card .br", { timeout: 8000 });
await step("검색 결과가 두 브랜드에서 나온다(카드마다 브랜드 표시)", async () => {
  const names = await page.locator(".card .nm").allTextContents();
  const brands = await page.locator(".card .br").allTextContents();
  if (names.sort().join("|") !== "Silk Blouse|Silk Cami Top") throw new Error(names.join("|"));
  if ([...new Set(brands)].sort().join("|") !== "American Eagle|Vince") throw new Error(brands.join("|"));
});
await step("검색 결과 개수와 주소 #q=", async () => {
  const sub = await page.locator("#sub").textContent();
  if (!/^2개/.test(sub)) throw new Error(sub);
  const h = await page.evaluate(() => location.hash);
  if (h !== "#q=silk") throw new Error(h);
});
await step("인덱스에 없던 혼용률이 오버레이로 늦게라도 붙는다", async () => {
  const t = await until(async () => {
    const all = await page.locator(".card .cp").allTextContents();
    return all.includes("Silk 92% / Elastane 8%") ? all : null;
  });
  if (!t) throw new Error(JSON.stringify(await page.locator(".card .cp").allTextContents()));
});
await step("검색 목록은 한 번만 받는다", async () => {
  await page.locator("#q").fill("tank");
  await page.waitForTimeout(500);
  if (counts.index !== 1) throw new Error("index 요청 " + counts.index + "번");
  const n = await page.locator(".card").count();
  if (n !== 1) throw new Error("tank 결과 " + n);
});
await step("한 글자는 찾지 않는다", async () => {
  await page.locator("#q").fill("s");
  await page.waitForTimeout(450);
  const h = await page.locator("#hint").textContent();
  if (!h.includes("2글자 이상")) throw new Error(h);
});
await step("Esc 로 검색을 지우면 보던 브랜드로 돌아간다", async () => {
  await page.locator("#q").press("Escape");
  await page.waitForTimeout(150);
  const t = await page.locator("#title").textContent();
  const n = await page.locator(".card").count();
  if (t !== "Vince" || n !== 3) throw new Error(`${t} · ${n}개`);
});
await step("'/' 를 누르면 검색창으로 간다", async () => {
  await page.locator("main").click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("/");
  const f = await page.evaluate(() => document.activeElement && document.activeElement.id);
  if (f !== "q") throw new Error("포커스 " + f);
  await page.keyboard.press("Escape");
});

console.log("③ 여러 브랜드를 한 엑셀에");
await page.locator(".card", { hasText: "Wide Trouser" }).click();
await page.locator(".brand", { hasText: "American Eagle" }).click();
await page.waitForSelector('.card:has-text("Silk Cami Top")', { timeout: 8000 });
await step("깨진 상품 이미지는 빈 자리 표시로 바뀐다", async () => {
  const ok = await until(() => page.locator('.card:has-text("Ribbed Tank") .ph.noimg').count());
  if (!ok) throw new Error("noimg 없음");
  if (await page.locator('.card:has-text("Ribbed Tank") img').count()) throw new Error("깨진 img 가 남음");
});
await page.locator(".card", { hasText: "Silk Cami Top" }).click();
await page.locator(".card", { hasText: "Linen Button Shirt" }).click();
await step("브랜드를 옮겨도 앞 브랜드에서 고른 것이 남는다", async () => {
  const m = await msgOf(page);
  if (!m.includes("선택 3") || !m.includes("브랜드 2")) throw new Error(m);
  if (await page.locator("#xlsx").isDisabled()) throw new Error("엑셀 버튼이 잠김");
});
await step("'선택한 상품 보기' 는 두 브랜드를 다 보여 준다", async () => {
  await page.locator("#selView").click();
  await page.waitForTimeout(100);
  const names = (await page.locator(".card .nm").allTextContents()).sort();
  if (names.join("|") !== "Linen Button Shirt|Silk Cami Top|Wide Trouser") throw new Error(names.join("|"));
  await page.locator("#selView").click();   // 돌아가기
  const t = await page.locator("#title").textContent();
  if (t !== "American Eagle") throw new Error("돌아간 화면 " + t);
});

dl = page.waitForEvent("download", { timeout: 30000 });
await page.locator("#xlsx").click();
await step("섞인 선택(2/3)은 혼용률 열 없이, 행마다 자기 브랜드로 나간다", async () => {
  const x = await readXlsx(await dl, "mixed.xlsx");
  const day = new Date().toISOString().slice(0, 10);
  if (x.file !== `RACK_2brands_${day}.xlsx`) throw new Error("파일명 " + x.file);
  if (x.head.join(",") !== "브랜드,썸네일,URL,상품명,판매가,정가,사이즈,컬러 전부,설명,디테일,이미지 링크") throw new Error("머리글: " + x.head.join(","));
  if (x.rows.length !== 3) throw new Error("행 " + x.rows.length);
  const brands = x.rows.map((r) => r[0]);
  // 브랜드가 처음 담긴 순서대로 묶인다(Vince 먼저).
  if (brands.join("|") !== "Vince|American Eagle|American Eagle") throw new Error(brands.join("|"));
  console.log(`     파일명 ${x.file} · 행 ${x.rows.length}`);
});
await until(async () => (await msgOf(page)).includes("완료"), 10000);

await step("'혼용률 있는 것만' 은 혼용률 없는 선택을 뺀다", async () => {
  await page.locator("#compOnly").click();
  const m = await msgOf(page);
  if (!m.includes("선택 2") || !m.includes("브랜드 2")) throw new Error(m);
  if (m.includes("95% 미만")) throw new Error("아직 닫힘: " + m);
  if (!m.includes("1개를 뺐습니다")) throw new Error("알림 없음: " + m);
  if (!(await page.locator("#compOnly").isDisabled())) throw new Error("뺄 게 없는데 버튼이 살아 있음");
});
dl = page.waitForEvent("download", { timeout: 30000 });
await page.locator("#xlsx").click();
await step("혼용률 있는 것만 남기면 두 브랜드 엑셀에 혼용률 열이 열린다", async () => {
  const x = await readXlsx(await dl, "mixed2.xlsx");
  if (x.head.join(",") !== "브랜드,썸네일,URL,상품명,혼용률,판매가,정가,사이즈,컬러 전부,설명,디테일,이미지 링크") throw new Error("머리글: " + x.head.join(","));
  const got = x.rows.map((r) => `${r[0]}:${r[4]}`).join("|");
  if (got !== "Vince:Wool 70% / Nylon 30%|American Eagle:Silk 92% / Elastane 8%") throw new Error(got);
});
await until(async () => (await msgOf(page)).includes("완료"), 10000);

await step("'혼용률 있는 상품만 보기' 는 지금 화면만 거른다", async () => {
  await page.locator("#compView").check();
  await page.waitForTimeout(100);
  const names = (await page.locator(".card .nm").allTextContents()).sort();
  if (names.join("|") !== "Ribbed Tank|Silk Cami Top") throw new Error(names.join("|"));
  await page.locator("#compView").uncheck();
  if ((await page.locator(".card").count()) !== 3) throw new Error("해제해도 3개가 아님");
});
await step("Shift+클릭으로 범위를 한꺼번에 고른다", async () => {
  await page.locator("#selNone").click();
  const cards = page.locator(".card");
  await cards.nth(0).click();
  await cards.nth(2).click({ modifiers: ["Shift"] });
  const sel = await page.locator(".card.sel").count();
  if (sel !== 3) throw new Error("선택 " + sel);
  if (!(await msgOf(page)).includes("선택 3")) throw new Error(await msgOf(page));
});

console.log("④ 바로가기 · 기억");
await step("#site= 로 열면 그 브랜드가 바로 열린다", async () => {
  const p2 = await openApp(ctx, { hash: "#site=ae.com.americaneagle" });
  await p2.waitForSelector(".card", { timeout: 8000 });
  const t = await p2.locator("#title").textContent();
  const on = await until(() => p2.locator(".brand.on").textContent().catch(() => ""));
  if (t !== "American Eagle" || !String(on).includes("American Eagle")) throw new Error(`${t} / ${on}`);
  await p2.close();
});
await step("#q= 로 열면 그 검색이 바로 열린다", async () => {
  const p2 = await openApp(ctx, { hash: "#q=linen" });
  await p2.waitForSelector(".card .br", { timeout: 8000 });
  const v = await p2.locator("#q").inputValue();
  const n = await p2.locator(".card").count();
  if (v !== "linen" || n !== 1) throw new Error(`${v} · ${n}개`);
  await p2.close();
});
await step("해시가 없으면 마지막으로 본 브랜드를 연다", async () => {
  const p2 = await openApp(ctx);
  await p2.waitForSelector(".card", { timeout: 8000 });
  const t = await p2.locator("#title").textContent();
  if (t !== "American Eagle") throw new Error(t);
  await p2.close();
});

console.log("⑤ 세그먼트");
await step("Render 분류가 오면 칩이 켜지고, 고르면 그 세그먼트 브랜드만 남는다", async () => {
  await until(() => page.locator('.seg[data-seg="WMN"]:not([disabled])').count());
  if (!(await page.locator('.seg[data-seg="ACTIVE"]').isDisabled())) throw new Error("빈 Active 칩이 안 잠김");
  await page.locator('.seg[data-seg="WMN"]').click();
  const names = await page.locator(".brand .nm").allTextContents();
  if (names.join("|") !== "Vince") throw new Error(names.join("|"));
  await page.locator('.seg[data-seg="WMN"]').click();   // 한 번 더 = 전체
  if ((await page.locator(".brand").count()) !== 2) throw new Error("다시 눌러도 전체로 안 돌아옴");
});
await step("Render 가 응답하지 않으면 칩을 숨기고 브랜드는 그대로 쓸 수 있다", async () => {
  const c2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p2 = await openApp(c2, { renderMode: "dead" });
  await p2.waitForSelector(".brand", { timeout: 8000 });
  const hidden = await until(() => p2.locator("#segs").evaluate((el) => el.hidden));
  if (!hidden) throw new Error("칩이 그대로 보임");
  if ((await p2.locator(".brand").count()) !== 2) throw new Error("브랜드가 줄었다");
  await c2.close();
});

console.log("⑥ 좁은 화면(380px) · 넓은 화면(1280px)");
const shot = async (p, name) => {
  const path = join(SHOTS || OUT, name);
  await p.screenshot({ path });
  return path;
};
if (SHOTS) {
  // 넓은 화면: 브랜드 보기 · 검색 결과 · 선택 바
  await page.locator("#selNone").click();
  await page.locator(".brand", { hasText: "Vince" }).click();
  await page.waitForSelector('.card:has-text("Silk Blouse")');
  await page.locator(".card", { hasText: "Silk Blouse" }).click();
  await page.locator(".card", { hasText: "Wide Trouser" }).click();
  await page.waitForTimeout(200);
  await shot(page, "app-1280-brand.png");
  await page.locator("#q").fill("silk");
  await page.waitForSelector(".card .br");
  await page.waitForTimeout(500);
  await shot(page, "app-1280-search.png");
  await page.locator("#q").press("Escape");
}
const narrow = await openApp(ctx, { viewport: { width: 380, height: 760 }, hash: "#site=vince.com.vince" });
await narrow.waitForSelector(".card", { timeout: 8000 });
const noHScroll = (p) => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
await step("380px: 가로 스크롤이 없다", async () => {
  if (!(await noHScroll(narrow))) {
    const w = await narrow.evaluate(() => document.documentElement.scrollWidth);
    throw new Error("scrollWidth " + w);
  }
});
await step("380px: 그리드는 2열", async () => {
  const cols = await narrow.locator("#grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  if (cols !== 2) throw new Error(cols + "열");
});
await step("380px: 브랜드 목록은 서랍으로 접히고 버튼으로 연다", async () => {
  const box = await narrow.locator("aside").boundingBox();
  if (box && box.x + box.width > 1) throw new Error("서랍이 화면에 나와 있음 x=" + box.x);
  await narrow.locator("#drawerBtn").click();
  await narrow.waitForTimeout(300);
  const b2 = await narrow.locator("aside").boundingBox();
  if (!b2 || b2.x < -1) throw new Error("서랍이 안 열림");
  if (SHOTS) await shot(narrow, "app-380-drawer.png");
  await narrow.locator(".brand", { hasText: "American Eagle" }).click();
  await narrow.waitForTimeout(300);
  const b3 = await narrow.locator("aside").boundingBox();
  if (b3 && b3.x + b3.width > 1) throw new Error("고른 뒤 서랍이 안 닫힘");
  const t = await narrow.locator("#drawerBtn").textContent();
  if (!t.includes("American Eagle")) throw new Error("버튼 이름 " + t);
});
await step("380px: 하단 바가 줄바꿈돼도 마지막 카드를 가리지 않는다", async () => {
  await narrow.waitForSelector('.card:has-text("Ribbed Tank")');
  await narrow.locator("#selAll").click();
  await narrow.waitForTimeout(150);
  await narrow.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await narrow.waitForTimeout(150);
  const bar = await narrow.locator("#bar").boundingBox();
  const last = await narrow.locator(".card").last().boundingBox();
  if (last.y + last.height > bar.y + 1) throw new Error(`카드 아래 ${last.y + last.height} > 바 위 ${bar.y}`);
  if (!(await noHScroll(narrow))) throw new Error("선택 후 가로 스크롤 생김");
  const xb = await narrow.locator("#xlsx").boundingBox();
  if (xb.x + xb.width > 380) throw new Error("엑셀 버튼이 화면 밖");
  if (SHOTS) await shot(narrow, "app-380-selection.png");
});
await step("380px: 검색 결과도 가로 스크롤 없음", async () => {
  await narrow.locator("#q").fill("silk");
  await narrow.waitForSelector(".card .br", { timeout: 8000 });
  await narrow.waitForTimeout(400);
  if (!(await noHScroll(narrow))) throw new Error("가로 스크롤");
  if (SHOTS) { await narrow.evaluate(() => window.scrollTo(0, 0)); await shot(narrow, "app-380-search.png"); }
});

if (errs.length) { console.log("  ⚠ 콘솔 오류:\n     " + errs.join("\n     ")); process.exitCode = 1; }
else console.log("  ✅ 콘솔 오류 없음");
console.log("  화면: " + (SHOTS || OUT));

await browser.close();
srv.close();
