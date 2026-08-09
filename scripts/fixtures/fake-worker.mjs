// enrich-comp-browser.mjs 를 붙여 볼 가짜 Worker + 가짜 상품 페이지.
//
// 진짜 쇼핑몰에 붙이면 결과가 매일 달라져 테스트가 못 된다. 여기서는 네 가지
// 경우를 고정해 둔다 — 평범한 표기 · 접힌 details 안의 두 겹 원단 ·
// 소재를 안 적는 페이지 · 403 차단.
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
];

const PAGES = {
  // 평범한 표기
  "/p/1": `<html><body><h1>Waffle Tee</h1><div class="detail">Composition: 95% Cotton, 5% Elastane</div></body></html>`,
  // 접힌 details 안 — 펼치기 로직이 없으면 못 읽는다
  "/p/2": `<html><body><h1>Lined Coat</h1>
     <details><summary>Composition</summary><p>Shell: 100% Wool</p><p>Lining: 100% Polyester</p></details>
     </body></html>`,
  // 사이트가 소재를 안 적는 경우
  "/p/3": `<html><body><h1>Mystery Pant</h1><p>Machine wash cold. Imported.</p></body></html>`,
};

let saved = null;
createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const j = (o) => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
  if (u.searchParams.has("catalogs")) return j({ list: [{ site: "test.com.testbrand", brand: "TestBrand", count: 4, updated: Date.now() }] });
  if (u.searchParams.has("catalog")) return j({ brand: "TestBrand", items: ITEMS });
  if (u.searchParams.has("comps")) return j({});
  if (u.searchParams.get("store") === "overlay") {
    let b = ""; req.on("data", (d) => (b += d));
    return req.on("end", () => { saved = JSON.parse(b); console.error("SAVED:" + JSON.stringify(saved)); j({ ok: true }); });
  }
  if (PAGES[u.pathname]) { res.writeHead(200, { "Content-Type": "text/html" }); return res.end(PAGES[u.pathname]); }
  res.writeHead(403); res.end("Forbidden");   // /p/4 = 차단
}).listen(Number(process.env.PORT) || 8951);
