// enrich-comp-browser.mjs 를 붙여 볼 가짜 Worker + 가짜 상품 페이지.
//
// 진짜 쇼핑몰에 붙이면 결과가 매일 달라져 테스트가 못 된다. 여기서는 여섯 가지
// 경우를 고정해 둔다 — 평범한 표기 · 접힌 details 안의 두 겹 원단 · 늦게 그려지는 표기 ·
// 소재를 안 적는 페이지 · 403 차단 · 200 으로 오는 봇 확인 화면.
//
// 특히 마지막 둘을 가르는 것이 중요하다. 차단을 '사이트가 안 적음'으로
// 적어 버리면 엑셀에 '정보 없음'이 박히고, 다시는 읽지 않게 된다.
import { createServer } from "node:http";

const PORT = Number(process.env.PORT) || 8951;
const ITEMS = [
  { name: "Waffle Tee", imageUrl: "https://x/1.jpg", productUrl: `http://localhost:${PORT}/p/1` },
  { name: "Lined Coat", imageUrl: "https://x/2.jpg", productUrl: `http://localhost:${PORT}/p/2` },
  { name: "Mystery Pant", imageUrl: "https://x/3.jpg", productUrl: `http://localhost:${PORT}/p/3` },
  { name: "Blocked Item", imageUrl: "https://x/4.jpg", productUrl: `http://localhost:${PORT}/p/4` },
  { name: "Challenge Item", imageUrl: "https://x/5.jpg", productUrl: `http://localhost:${PORT}/p/5` },
  { name: "Late Knit", imageUrl: "https://x/6.jpg", productUrl: `http://localhost:${PORT}/p/6` },
  { name: "Capilene Cool Merino Shirt", imageUrl: "https://x/7.jpg", productUrl: `http://localhost:${PORT}/p/7` },
  { name: "Legacy None Tee", imageUrl: "https://x/8.jpg", productUrl: `http://localhost:${PORT}/p/8` },
  { name: "Recheck Pant", imageUrl: "https://x/9.jpg", productUrl: `http://localhost:${PORT}/p/9` },
];
// 오버레이(이미 저장된 값). none 의 nv = 그 none 을 적은 읽기 방식.
const OVERLAY = {
  // nv 없는 예전 none — fetch·크롬이 적은 것으로 본다. 크롬(playwright)으로는 다시 안 연다.
  [`http://localhost:${PORT}/p/8`]: { none: 1, t: Date.now() - 2 * 86400000 },
  // 평 fetch 만 적은 none — 크롬으로 한 번 더 열어 본다.
  [`http://localhost:${PORT}/p/9`]: { none: 1, nv: "fetch", t: Date.now() - 2 * 86400000 },
};

const PAGES = {
  // 평범한 표기
  "/p/1": `<html><body><h1>Waffle Tee</h1><div class="detail">Composition: 95% Cotton, 5% Elastane</div>
     <button id="det" aria-expanded="false">Details</button><div id="detbox"></div>
     <script>document.getElementById("det").addEventListener("click", () => {
       document.getElementById("detbox").innerHTML = "<ul><li>Relaxed fit</li><li>Ribbed crew neck</li></ul>"; });</script></body></html>`,
  // 접힌 details 안 — 펼치기 로직이 없으면 못 읽는다
  "/p/2": `<html><body><h1>Lined Coat</h1>
     <details><summary>Composition</summary><p>Shell: 100% Wool</p><p>Lining: 100% Polyester</p></details>
     </body></html>`,
  // 사이트가 소재를 안 적는 경우
  "/p/3": `<html><body><h1>Mystery Pant</h1><p>Machine wash cold. Imported.</p></body></html>`,
  // 200 으로 오는 봇 확인 화면 — '미표기'로 적으면 21일 동안 다시 안 읽는다. 차단으로 세야 한다.
  "/p/5": `<html><head><title>Pardon Our Interruption</title></head><body><h1>Pardon Our Interruption</h1>
     <p>As you were browsing something about your browser made us think you were a bot.</p></body></html>`,
  // 페이지가 뜬 뒤 스크립트로 소재를 늦게 그리는 사이트(Zara·H&M 형) — 600ms 만 보면 놓친다.
  "/p/6": `<html><body><h1>Late Knit</h1><div id="d"></div>
     <script>setTimeout(() => { document.getElementById("d").textContent = "Composition: 70% Wool, 30% Polyamide"; }, 4000);</script>
     </body></html>`,
  // 차단 화면은 아니고 글도 있지만 이 상품의 본문이 안 그려진 껍데기(Patagonia 1,017자형) — none 을 적으면 안 된다.
  "/p/7": `<html><head><title>Capilene Cool Merino Shirt</title></head><body><header>${"Shop Women Men Kids Packs Gear Activism Stories Worn Wear Gift Cards Sign In Cart Free shipping on orders over $99 ".repeat(8)}</header><div id="app"></div></body></html>`,
  // 이 페이지는 소재를 적지만, 예전 none 이 크롬 몫이라 열리지 않아야 한다(열리면 comp 가 저장된다).
  "/p/8": `<html><body><h1>Legacy None Tee</h1><div>Composition: 100% Cotton</div></body></html>`,
  // 다시 열어 보니 역시 소재 없음 → none 에 chromium 을 더한다.
  "/p/9": `<html><body><h1>Recheck Pant</h1><p>Machine wash cold. Imported.</p></body></html>`,
};

let saved = null;
createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const j = (o) => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
  if (u.searchParams.has("catalogs")) return j({ list: [{ site: "test.com.testbrand", brand: "TestBrand", count: ITEMS.length, updated: Date.now() }] });
  if (u.searchParams.has("catalog")) return j({ brand: "TestBrand", items: ITEMS });
  if (u.searchParams.has("comps")) return j(OVERLAY);
  // 상품 상세 저장값(detail:<site>) — 처음엔 비어 있다. 저장 요청은 DETAILS: 줄로 남긴다.
  if (u.searchParams.has("details")) return j({});
  if (u.searchParams.get("store") === "details") {
    let b = ""; req.on("data", (d) => (b += d));
    return req.on("end", () => { console.error("DETAILS:" + b); j({ ok: true }); });
  }
  if (u.searchParams.get("store") === "overlay") {
    let b = ""; req.on("data", (d) => (b += d));
    return req.on("end", () => { saved = JSON.parse(b); console.error("SAVED:" + JSON.stringify(saved)); j({ ok: true }); });
  }
  if (PAGES[u.pathname]) { res.writeHead(200, { "Content-Type": "text/html" }); return res.end(PAGES[u.pathname]); }
  res.writeHead(403); res.end("Forbidden");   // /p/4 = 차단
}).listen(Number(process.env.PORT) || 8951);
