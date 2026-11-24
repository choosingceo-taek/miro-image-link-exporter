#!/usr/bin/env node
// 크롬 확장에서 상품 리서치 앱을 여는 길을 진짜 확장으로 확인하는 연기 테스트.
//
// 확장 폴더(chrome-extension/)를 '압축해제된 확장'으로 그대로 올린 크로미움에서
//   ① 팝업 맨 위 '상품 리서치 열기' → 새 탭이 앱 주소로 열리고, Worker 설정이
//      기본값과 다르면 ?worker= / ?token= 으로 넘어가 앱이 그 Worker 로 뜬다
//   ② 옆 패널 페이지(sidepanel.html) → iframe 에 앱이 뜨고 로딩 표시가 걷힌다
//      · iframe 안에서 고르고 엑셀을 내려받을 수 있다
//      · 앱 주소가 죽어 있으면 읽을 수 있는 안내와 '새 탭에서 열기'가 나온다
//   ③ '이 페이지 수집' 성공 뒤 '수집한 브랜드 리서치에서 보기' → #site= 로 열린다
//   ④ 브라우저에 옆 패널 기능(chrome.sidePanel)이 없으면 그 버튼만 숨는다
//   ⑤ 팝업·옆 패널에 CSP·콘솔 오류가 없다
// 를 밟는다. 앱(app.html)·Worker·Render 는 모두 이 스크립트가 띄운 가짜 서버로 돌린다.
//
//   npm i --no-save playwright@1.49.1 && npx playwright install --with-deps chromium
//   node scripts/smoke-extension-research.mjs
//
// 확장은 새 헤드리스(channel: "chromium")에서 올라간다. 안 되는 환경이면
// HEADED=1 xvfb-run -a node scripts/smoke-extension-research.mjs
//
// 확장 페이지에서 page.waitForFunction 은 쓰지 않는다 — Playwright 1.49 는 조건을
// 페이지 안에서 문자열 eval 로 되풀이해 확장 CSP(script-src 'self')에 막힌다.
// 기다림은 locator.waitFor 로만 한다.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXT = join(ROOT, "chrome-extension");
const require_ = createRequire(import.meta.url);
const PORT = Number(process.env.PORT) || 8941;
const HERE = `http://localhost:${PORT}`;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png" };
const RENDER = "https://market-research-uzs2.onrender.com";
const DEFAULT_APP = "https://choosingceo-taek.github.io/miro-image-link-exporter/app.html";
const DEFAULT_WORKER = "https://fabric-extractor.hs-fabric-linker.workers.dev";

// 1x1 PNG — 썸네일 칸을 채우는 데만 쓴다.
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC", "base64");
const ITEMS = [
  { name: "Silk Blouse", imageUrl: `${HERE}/img.png`, productUrl: "https://vince.com/p/silk-blouse", price: "$295" },
  { name: "Wide Trouser", imageUrl: `${HERE}/img.png`, productUrl: "https://vince.com/p/wide-trouser", price: "$345" },
];
const seen = { worker: [] };

// 앱 파일 + 가짜 Worker(/w/) 를 한 서버에서.
const srv = createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const j = (o) => { res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); res.end(JSON.stringify(o)); };
  if (u.pathname === "/img.png") { res.writeHead(200, { "Content-Type": "image/png", "Access-Control-Allow-Origin": "*" }); return res.end(PNG); }
  if (u.pathname === "/w/" || u.pathname === "/w") {
    seen.worker.push(u.search);
    if (u.searchParams.get("token") !== "testtok") { res.writeHead(401, { "Access-Control-Allow-Origin": "*" }); return res.end("unauthorized"); }
    if (u.searchParams.has("catalogs")) return j({ list: [{ site: "vince.com.vince", brand: "Vince", count: 2, updated: Date.now() }] });
    if (u.searchParams.has("catalog")) return j({ brand: "Vince", items: ITEMS });
    if (u.searchParams.has("comps")) return j({ "https://vince.com/p/silk-blouse": { comp: "Silk 100%" }, "https://vince.com/p/wide-trouser": { comp: "Wool 100%" } });
    if (u.searchParams.has("index")) return j({ items: ITEMS.map((p) => ({ ...p, brand: "Vince" })) });
    if (u.searchParams.has("img")) { res.writeHead(200, { "Content-Type": "image/png", "Access-Control-Allow-Origin": "*" }); return res.end(PNG); }
    return j({});
  }
  const f = join(ROOT, u.pathname === "/" ? "app.html" : u.pathname);
  if (!f.startsWith(ROOT) || !existsSync(f)) { res.writeHead(404); return res.end("nope"); }
  res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(PORT, r));

const headed = !!process.env.HEADED;
const ctx = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), "rack-ext-")), {
  // 확장은 headless-shell 에서는 안 뜬다 — 완전한 Chromium(channel: chromium)의 새 headless 를 쓴다.
  channel: process.env.PLAYWRIGHT_CHROMIUM ? undefined : "chromium",
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined,
  headless: !headed,
  acceptDownloads: true,
  // 화면 크기 흉내(viewport)는 쓰지 않는다 — 크로미움 131(Playwright 1.49)은 흉내를 켜면
  // 확장 페이지 안 다른 출처 iframe(옆 패널의 앱)으로 가는 클릭을 바깥 <iframe> 요소에
  // 떨어뜨린다(머리줄 아래 전부). 진짜 옆 패널엔 흉내가 없으니 창 크기를 직접 맞춘다(fitWindow).
  viewport: null,
  args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`],
});
// 엑셀 라이브러리와 Render 는 밖으로 나가지 않게 여기서 물린다.
await ctx.route("**/exceljs.min.js", (route) => route.fulfill({
  status: 200, contentType: "text/javascript",
  body: readFileSync(require_.resolve("exceljs/dist/exceljs.min.js"), "utf8"),
}));
await ctx.route(RENDER + "/**", (route) => route.fulfill({
  status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify({ brands: [{ name: "Vince", url: "https://vince.com", segments: ["WMN"] }] }),
}));
// 버전 확인(raw.githubusercontent.com)도 막힌 망에서 오래 매달리지 않게 바로 돌려준다.
await ctx.route("https://raw.githubusercontent.com/**", (route) => route.fulfill({
  status: 200, contentType: "application/json", body: JSON.stringify({ version: "0.0.1" }),
}));

let sw = ctx.serviceWorkers()[0];
if (!sw) sw = await ctx.waitForEvent("serviceworker", { timeout: 20000 });
const ID = new URL(sw.url()).host;
const EXT_URL = `chrome-extension://${ID}`;
console.log(`  확장 로드됨 — ${ID} (버전 ${await sw.evaluate(() => chrome.runtime.getManifest().version)})`);

const errs = [];
// 팝업·옆 패널 페이지 자체의 오류만 모은다(iframe 안 앱의 오류는 smoke-app.mjs 몫).
function watch(page, label) {
  page.on("pageerror", (e) => errs.push(`${label} pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const from = (m.location() && m.location().url) || "";
    if (from && !from.startsWith("chrome-extension://")) return;
    errs.push(`${label} console: ${m.text()}`);
  });
  return page;
}
const step = async (label, fn) => {
  try { await fn(); console.log("  ✅ " + label); }
  catch (e) { console.log("  ❌ " + label + " — " + e.message); process.exitCode = 1; }
};
const newTab = () => ctx.waitForEvent("page", { timeout: 10000 });
// 페이지 안쪽 크기가 w×h 가 되게 창 크기를 맞춘다(앞에서 연 진짜 옆 패널이 창 폭을 먹어도).
async function fitWindow(page, w, h) {
  const cdp = await ctx.newCDPSession(page);
  const { windowId } = await cdp.send("Browser.getWindowForTarget");
  for (let i = 0; i < 5; i++) {
    const [iw, ih] = await page.evaluate(() => [innerWidth, innerHeight]);
    if (iw === w && ih === h) break;
    const { bounds } = await cdp.send("Browser.getWindowBounds", { windowId });
    if (bounds.windowState && bounds.windowState !== "normal") {
      await cdp.send("Browser.setWindowBounds", { windowId, bounds: { windowState: "normal" } });
    }
    await cdp.send("Browser.setWindowBounds", { windowId, bounds: { width: bounds.width + w - iw, height: bounds.height + h - ih } });
    await page.waitForTimeout(200);
  }
  await cdp.detach();
  return page.evaluate(() => [innerWidth, innerHeight]);
}

// ── ① 팝업 ──
const popup = watch(await ctx.newPage(), "popup");
await popup.goto(`${EXT_URL}/popup.html`);

await step("팝업 맨 위에 '상품 리서치 열기'가 있고 옆 패널 버튼도 보인다", async () => {
  const first = await popup.evaluate(() => document.body.firstElementChild.querySelector("button").id);
  if (first !== "openApp") throw new Error("맨 위 버튼 " + first);
  const t = await popup.locator("#openApp").textContent();
  if (!t.includes("상품 리서치 열기")) throw new Error(t);
  if (!(await popup.locator("#openPanel").isVisible())) throw new Error("옆 패널 버튼이 숨어 있음");
  const hint = await popup.locator(".research .hint").textContent();
  if (!hint.includes("엑셀 추출")) throw new Error(hint);
});
await step("기본 설정이면 앱 주소에 아무것도 붙이지 않는다", async () => {
  const r = await popup.evaluate(([w]) => [
    rackAppUrl({}, ""),
    rackAppUrl({ worker: w + "/", token: "hsfabriclinker" }, ""),
    rackAppUrl({ worker: "https://other.example/", token: "" }, "site=a.b"),
    rackAppUrl({ appUrl: "javascript:alert(1)" }, ""),
  ], [DEFAULT_WORKER]);
  if (r[0] !== DEFAULT_APP) throw new Error(r[0]);
  if (r[1] !== DEFAULT_APP) throw new Error("기본 Worker 인데 붙음: " + r[1]);
  if (r[2] !== DEFAULT_APP + "?worker=https%3A%2F%2Fother.example&token=#site=a.b") throw new Error(r[2]);
  if (r[3] !== DEFAULT_APP) throw new Error("이상한 주소를 그대로 씀: " + r[3]);
});

// 설정 화면에서 앱 주소·Worker 를 가짜 서버로 바꾼다(실제 사용자가 하는 그대로).
await popup.locator("details summary", { hasText: "Worker 설정" }).click();
await popup.locator("#worker").fill(`${HERE}/w`);
await popup.locator("#token").fill("testtok");
await popup.locator("#appUrl").fill(`${HERE}/app.html`);
await popup.locator("#saveCfg").click();
await popup.locator("#saveCfg", { hasText: "저장됨" }).waitFor({ timeout: 5000 });

let appUrl = "";
await step("'상품 리서치 열기' → 새 탭이 앱 주소로 열리고 설정이 넘어간다", async () => {
  const p = newTab();
  await popup.locator("#openApp").click();
  const tab = await p;
  await tab.waitForLoadState();
  appUrl = tab.url();
  const want = `${HERE}/app.html?worker=${encodeURIComponent(HERE + "/w")}&token=testtok`;
  if (appUrl !== want) throw new Error(appUrl);
  await tab.waitForSelector(".brand", { timeout: 8000 });
  const n = await tab.locator(".brand").count();
  if (n !== 1) throw new Error("브랜드 " + n);
  await tab.close();
});

await step("'이 페이지 수집' 성공 뒤 '수집한 브랜드 리서치에서 보기' → #site= 로 열린다", async () => {
  // 수집 자체(활성 탭에 스크립트 주입)는 smoke-extension-enrich 쪽 몫이다. 여기서는
  // 백그라운드 응답을 흉내 내 팝업이 그 응답으로 바로가기를 만드는지만 본다.
  await popup.evaluate(() => {
    const real = chrome.runtime.sendMessage.bind(chrome.runtime);
    chrome.runtime.sendMessage = (msg, cb) => {
      if (msg && msg.type === "collectActive") {
        setTimeout(() => cb({ ok: true, count: 2, msg: "Vince · 이 페이지 2개 → 저장소 총 2개", site: "vince.com.vince", brand: "Vince" }), 50);
        return;
      }
      return real(msg, cb);
    };
  });
  await popup.locator("#collectHere").click();
  await popup.waitForSelector("#seeBrand", { timeout: 5000 });
  const p = newTab();
  await popup.locator("#seeBrand").click();
  const tab = await p;
  await tab.waitForSelector(".card", { timeout: 8000 });
  if (!tab.url().endsWith("#site=vince.com.vince")) throw new Error(tab.url());
  const t = await tab.locator("#title").textContent();
  if (t !== "Vince") throw new Error("제목 " + t);
  await tab.close();
});
await step("백그라운드 collectActive 가 site·brand 를 돌려준다(코드 확인)", async () => {
  const src = readFileSync(join(EXT, "background.js"), "utf8");
  const body = src.slice(src.indexOf("async function collectActive"), src.indexOf("chrome.runtime.onMessage.addListener"));
  if (!/return \{ ok: !!d\.ok[^}]*\bsite\b[^}]*\bbrand\b/.test(body)) throw new Error("응답에 site·brand 없음");
});

await step("'옆 패널로 열기'를 눌러도 오류가 없다(열리거나, 못 열면 새 탭으로)", async () => {
  const before = ctx.pages().length;
  const closed = popup.waitForEvent("close", { timeout: 4000 }).then(() => "closed").catch(() => "");
  const opened = ctx.waitForEvent("page", { timeout: 4000 }).then((pg) => pg).catch(() => null);
  await popup.locator("#openPanel").click();
  const [c, pg] = await Promise.all([closed, opened]);
  if (pg) {
    await pg.waitForLoadState();
    if (!pg.url().startsWith(`${HERE}/app.html`)) throw new Error("다른 탭이 열림 " + pg.url());
    console.log("     (이 헤드리스 크로미움은 옆 패널을 못 열어 새 탭으로 대신 열었다)");
    await pg.close();
  } else if (c === "closed") {
    console.log("     (옆 패널이 열리고 팝업이 닫혔다)");
  } else if (ctx.pages().length === before) {
    throw new Error("아무 일도 없었다");
  }
});

// ── ② 옆 패널 ──
const panel = watch(await ctx.newPage(), "sidepanel");
const size = await fitWindow(panel, 400, 800);
if (size[0] !== 400) console.log(`     (창 크기를 400px 로 못 맞춤: ${size.join("x")})`);
await panel.goto(`${EXT_URL}/sidepanel.html`);
await step("옆 패널 iframe 이 앱 주소를 연다", async () => {
  await panel.locator("#app[src]").waitFor({ state: "attached", timeout: 5000 });
  const src = await panel.locator("#app").getAttribute("src");
  if (src !== appUrl) throw new Error(src);
});
const frame = panel.frameLocator("#app");
await step("iframe 안에 앱이 뜨고 로딩 표시가 걷힌다", async () => {
  await frame.locator(".brand").first().waitFor({ timeout: 8000 });
  await panel.locator("#state").waitFor({ state: "hidden", timeout: 5000 });
  const box = await panel.locator("#app").boundingBox();
  if (box.width < 390 || box.height < 790) throw new Error(`iframe 크기 ${box.width}x${box.height}`);
});
await step("옆 패널 너비에서 서랍·2열로 그려진다", async () => {
  if (!(await frame.locator("#drawerBtn").isVisible())) throw new Error("서랍 버튼 없음");
  await frame.locator("#drawerBtn").click();
  await frame.locator(".brand", { hasText: "Vince" }).click();
  // 고르면 서랍이 닫혀야 한다 — 안 닫히면 클릭이 앱까지 가지 않은 것이다.
  await frame.locator("body.drawer").waitFor({ state: "detached", timeout: 3000 })
    .catch(() => { throw new Error("브랜드를 골랐는데 서랍이 안 닫힘(클릭이 iframe 안으로 안 들어감?)"); });
  await frame.locator(".card").first().waitFor({ timeout: 8000 });
  const cols = await frame.locator("#grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  if (cols !== 2) throw new Error(cols + "열");
});
await step("옆 패널 안에서 고르고 엑셀을 내려받을 수 있다", async () => {
  await frame.locator("#selAll").click();
  const dl = panel.waitForEvent("download", { timeout: 20000 });
  await frame.locator("#xlsx").click();
  const d = await dl;
  if (!/^Vince_\d{4}-\d\d-\d\d\.xlsx$/.test(d.suggestedFilename())) throw new Error(d.suggestedFilename());
});

await step("앱 주소가 죽어 있으면 안내와 '새 탭에서 열기'가 나온다", async () => {
  const dead = await ctx.newPage();   // 일부러 실패시키는 페이지 — 오류 수집 대상이 아니다
  try {
    // 주소를 먼저 바꾸고 연다 — 열린 패널에서 바꾸면 앞 주소의 앱이 늦게 보낸 '다 떴음' 신호와 겹친다.
    await sw.evaluate(() => chrome.storage.local.set({ appUrl: "http://localhost:9/app.html" }));
    await dead.goto(`${EXT_URL}/sidepanel.html`);
    await dead.locator("#openTab").waitFor({ state: "visible", timeout: 15000 });
    const t = await dead.locator("#stateText").textContent();
    const sub = await dead.locator("#stateSub").textContent();
    if (!t.includes("열지 못했습니다") || !sub) throw new Error(`${t} / ${sub}`);
    console.log(`     안내: ${t} ${sub}`);
    const p = newTab();
    await dead.locator("#openTab").click();
    const tab = await p;
    await tab.waitForLoadState().catch(() => {});
    // 열린 탭은 접속 실패로 Playwright 쪽 주소가 오류 화면(chrome-error://)이 된다.
    // 브라우저 탭 목록에는 연 주소가 그대로 남으므로 그걸로 확인한다.
    const urls = await sw.evaluate(async () => (await chrome.tabs.query({})).map((t) => t.url || t.pendingUrl || ""));
    await tab.close();
    if (!urls.some((u) => u.startsWith("http://localhost:9/app.html"))) throw new Error("새 탭이 죽은 앱 주소를 열지 않음: " + urls.join(", "));
  } finally {
    await sw.evaluate((u) => chrome.storage.local.set({ appUrl: u }), `${HERE}/app.html`).catch(() => {});
    await dead.close();
  }
});

// ── ④ 옆 패널 기능이 없는 브라우저 ──
await step("chrome.sidePanel 이 없으면 옆 패널 버튼만 숨고 새 탭 버튼은 그대로", async () => {
  const old = watch(await ctx.newPage(), "popup(옆 패널 없음)");
  await old.addInitScript(() => {
    try { Object.defineProperty(chrome, "sidePanel", { value: undefined, configurable: true }); } catch (e) {}
  });
  await old.goto(`${EXT_URL}/popup.html`);
  const hasApi = await old.evaluate(() => !!chrome.sidePanel);
  if (hasApi) throw new Error("흉내 실패 — chrome.sidePanel 이 남아 있음");
  if (await old.locator("#openPanel").isVisible()) throw new Error("옆 패널 버튼이 보임");
  const p = newTab();
  await old.locator("#openApp").click();
  const tab = await p;
  await tab.waitForLoadState();
  if (!tab.url().startsWith(`${HERE}/app.html`)) throw new Error(tab.url());
  await tab.close();
  await old.close();
});

await step("팝업·옆 패널에 CSP·콘솔 오류가 없다", async () => {
  await panel.waitForTimeout(300);
  if (errs.length) throw new Error("\n     " + errs.join("\n     "));
});

await ctx.close();
srv.close();
