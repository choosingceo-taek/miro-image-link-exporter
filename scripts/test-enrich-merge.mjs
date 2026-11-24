#!/usr/bin/env node
// 야간 혼용률 보강(scripts/enrich-comp.mjs)을 가짜 Worker·가짜 상품 페이지에 붙여 끝까지 돌린다.
//
// 이 스크립트는 '어느 상품을 다시 열지(full)'와 '읽은 결과를 오버레이에 어떻게 합칠지'를
// 정한다. 둘 다 틀려도 워크플로는 초록불로 끝난다 — 잘못된 'none' 이 엑셀에 '정보 없음'으로
// 박히거나, 컬러만 빈 상품을 영영 안 열거나, 매일 같은 상품에 예산을 쏟는다. 그래서
// 진짜 스크립트를 돌리고, 어느 페이지를 열었는지(접속 횟수)와 무엇을 저장했는지를 본다.
//
// 브라우저가 필요 없다 — 이 스크립트는 fetch 만 쓴다.
//   node scripts/test-enrich-merge.mjs
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = join(ROOT, "enrich-comp-report.md");
const DAY = 24 * 3600 * 1000;
const SITE = "test.com.testbrand";

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);

// ── 상품 페이지 ──
const prose = ("Free shipping on orders over $75. The Everyday piece is cut from soft, breathable fabric " +
  "with a relaxed fit. Machine wash cold, tumble dry low. Imported. Size guide: XS S M L XL. Reviews (124). ").repeat(5);
const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", ...o })}</script>`;
const page = (title, body, ldObj) =>
  `<html><head><title>${title}</title>${ldObj ? ld(ldObj) : ""}</head><body><h1>${title}</h1>${body}<p>${prose}</p></body></html>`;
const PAGES = {
  "/p/1": page("Navy Tee", "<div>Composition: 100% Cotton</div>", { name: "Navy Tee", color: "Navy" }),
  "/p/2": page("Recent Tee", "<div>Composition: 100% Cotton</div>", { name: "Recent Tee", color: "Red" }),
  "/p/3": page("Black Tee", "<div>Composition: 100% Cotton</div>", { name: "Black Tee", color: "Black" }),
  // 200 으로 오는 봇 확인 화면
  "/p/4": `<html><head><title>Pardon Our Interruption</title></head><body><h1>Pardon Our Interruption</h1><p>As you were browsing something about your browser made us think you were a bot.</p></body></html>`,
  // /p/5 는 403
  // 페이지는 멀쩡한데 소재·컬러를 안 적는다
  "/p/6": page("Mystery Pant", "<p>Machine wash cold. Imported.</p>", { name: "Mystery Pant" }),
  // 스크립트로만 그리는 빈 껍데기
  "/p/7": `<html><head><title>Shop</title><script>window.__APP__=${JSON.stringify({ blob: "x".repeat(20000) })}</script></head><body><div id="root"></div></body></html>`,
  // 절반만 뽑히는 혼용률 + 안내 문구 컬러 — 둘 다 저장하면 안 된다
  "/p/8": page("Half Knit", "<div>Composition: 60% Cotton</div>", { name: "Half Knit", color: "Select" }),
  // /p/9 는 403
  "/p/10": page("Skipped", "<div>Composition: 100% Linen</div>", { name: "Skipped", color: "Sand" }),
  "/p/12": page("Fixed Tee", "<div>Composition: 95% Cotton, 5% Elastane</div>", { name: "Fixed Tee", color: "Ecru" }),
  // /p/13 는 403
  "/p/14": page("Fresh Tee", "<div>Composition: 100% Cotton</div>", { name: "Fresh Tee", color: "Olive" }),
  // 차단 화면도 아니고 글도 600자를 넘지만, 이 상품의 본문이 안 그려진 껍데기(Patagonia 1,017자형).
  // 제목과 JSON-LD 에는 상품명이 있어도 화면 글에는 없다 — none 을 적으면 안 된다.
  "/p/15": `<html><head><title>Capilene Cool Merino Shirt</title>${ld({ name: "Capilene Cool Merino Shirt" })}</head><body>` +
    `<header>Shop Women Men Kids Packs &amp; Gear Activism Stories Worn Wear</header><div id="app"></div><footer>${prose}</footer></body></html>`,
};
// 카탈로그의 상품명 — 페이지의 이름과 같다(껍데기 판정이 이 이름을 화면 글에서 찾는다).
const NAMES = { 1: "Navy Tee", 2: "Recent Tee", 3: "Black Tee", 4: "Bot Check Tee", 5: "Blocked Wool Tee", 6: "Mystery Pant",
  7: "Empty Shell Tee", 8: "Half Knit", 9: "Blocked Tee", 10: "Skipped", 12: "Fixed Tee", 13: "Blocked Half Tee", 14: "Fresh Tee",
  15: "Capilene Cool Merino Shirt" };

// 시나리오마다 처음 오버레이를 새로 만든다(시각은 실행 직전 기준).
function seedOverlay(base, now) {
  const u = (n) => `${base}/p/${n}`;
  return {
    // 혼용률 있음 · 컬러 없음 · 컬러 시도 기록 없음 → 다시 연다
    [u(1)]: { comp: "Cotton 100%", t: now - 10 * DAY },
    // 혼용률 있음 · 컬러 없음 · 컬러 시도가 하루 전 → 건너뛴다(NEED_FIELDS=comp 일 때)
    [u(2)]: { comp: "Cotton 100%", t: now - 10 * DAY, ct: now - 1 * DAY },
    // 컬러 시도가 31일 전 → 다시 연다
    [u(3)]: { comp: "Cotton 100%", t: now - 40 * DAY, ct: now - 31 * DAY },
    // 예전 판정이 찍어 둔 none — 오늘은 봇 확인 화면이 와서 못 읽음 → none 을 걷어 낸다
    [u(4)]: { none: 1, t: now - 6 * DAY },
    // 혼용률은 있는데 오늘 403 → 혼용률은 그대로
    [u(5)]: { comp: "Wool 100%", t: now - 40 * DAY },
    // 6·7·8·9 는 처음 보는 상품(오버레이 없음)
    // 최근에 시도했는데 못 찾음 → 재시도 창 안이라 건너뛴다
    [u(10)]: { t: now - 1 * DAY },
    // 절반만 뽑힌 혼용률 — 시도 시각이 최근이어도 다시 읽어 옳은 값으로 바꾼다
    [u(12)]: { comp: "Cotton 60%", t: now - 1 * DAY },
    // 절반만 뽑힌 혼용률 + 오늘 403 → 잘못된 값을 지운다
    [u(13)]: { comp: "Cotton 60%", t: now - 1 * DAY },
    // 혼용률 있음 · 컬러 없음 · 최근 시도 · 컬러 시도 기록 없음
    [u(14)]: { comp: "Cotton 100%", t: now - 1 * DAY },
    // 예전에 껍데기를 '읽음'으로 쳐서 찍힌 none(Patagonia 167개) — 재시도 창 밖
    [u(15)]: { none: 1, t: now - 6 * DAY },
  };
}

async function scenario(label, env) {
  const hits = {};
  let overlay = {};
  const stores = [];
  let index = null;
  const srv = createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    const j = (o) => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
    const body = () => new Promise((r) => { let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => r(b)); });
    if (u.pathname.startsWith("/p/")) {
      hits[u.pathname] = (hits[u.pathname] || 0) + 1;
      if (PAGES[u.pathname]) { res.writeHead(200, { "Content-Type": "text/html" }); return res.end(PAGES[u.pathname]); }
      res.writeHead(403); return res.end("Forbidden");
    }
    if (u.searchParams.has("catalogs")) return j({ list: [{ site: SITE, brand: "TestBrand", count: 14 }] });
    if (u.searchParams.has("catalog")) {
      const items = [];
      for (let n = 1; n <= 15; n++) if (n !== 11) items.push({ name: NAMES[n], category: "tops", imageUrl: `https://img.x/${n}.jpg`, productUrl: `${base}/p/${n}` });
      return j({ brand: "TestBrand", items });
    }
    if (u.searchParams.has("comps")) return j(overlay);
    if (u.searchParams.has("comp")) { hits.bypass = (hits.bypass || 0) + 1; return j({}); }   // Worker 우회도 못 찾음
    if (u.searchParams.get("store") === "overlay") {
      return body().then((b) => { overlay = JSON.parse(b); stores.push(overlay); j({ ok: true }); });
    }
    if (u.searchParams.get("store") === "index") {
      return body().then((b) => { index = JSON.parse(b); j({ ok: true, count: index.items.length }); });
    }
    res.writeHead(404); res.end("{}");
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const t0 = Date.now();
  overlay = seedOverlay(base, t0);
  const seed = JSON.parse(JSON.stringify(overlay));

  const run = spawn(process.execPath, [join(ROOT, "scripts/enrich-comp.mjs")], {
    env: {
      ...process.env, WORKER_URL: base, WORKER_TOKEN: "test", BRAND_POOL: "1",
      // 웹 아카이브 층은 끈다 — 켜 두면 진짜 archive.org 로 나간다. 그 층은
      // scripts/test-enrich-wayback.mjs 가 가짜 아카이브로 따로 본다.
      WAYBACK: "0",
      NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1", ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  run.stdout.on("data", (d) => { out += d; });
  run.stderr.on("data", (d) => { out += d; });
  const code = await new Promise((r) => run.on("close", r));
  const t1 = Date.now();
  srv.close();
  console.log(`\n[${label}] 종료 ${code} · ${((t1 - t0) / 1000).toFixed(1)}s`);
  if (code !== 0) { console.error(out); fail(`[${label}] 종료 코드 ${code}`); }
  const at = (n) => overlay[`${base}/p/${n}`];
  const stamped = (n) => { const o = at(n) || {}; return o.t >= t0 && o.t <= t1 && o.ct >= t0 && o.ct <= t1; };
  return { hits, at, seed: (n) => seed[`${base}/p/${n}`], stamped, stores, index, out };
}

// 원래 리포트를 지키고 끝나면 되돌린다(저장소에 커밋된 파일이다).
const reportBak = existsSync(REPORT) ? readFileSync(REPORT) : null;
try {
  // ── 시나리오 1: 기본(NEED_FIELDS=comp) ──
  {
    const L = "기본 NEED_FIELDS=comp";
    const { hits, at, seed, stamped, stores, index } = await scenario(L, { NEED_FIELDS: "" });
    const h = (n) => hits[`/p/${n}`] || 0;
    if (!stores.length) fail(`[${L}] 오버레이 저장이 한 번도 없었다`);

    // full(): 컬러 재시도 창
    if (h(1) !== 1) fail(`[${L}] 혼용률 有·컬러 無·ct 없음인데 다시 안 열었다(접속 ${h(1)})`);
    else if (at(1).color !== "Navy" || at(1).comp !== "Cotton 100%" || !stamped(1)) fail(`[${L}] p1 저장 내용: ${JSON.stringify(at(1))}`);
    else ok("혼용률 有·컬러 無·컬러 시도 기록 없음 → 다시 열어 컬러를 채우고 t·ct 를 찍는다");

    if (h(2) !== 0) fail(`[${L}] 컬러 시도가 하루 전인데 다시 열었다(접속 ${h(2)})`);
    else if (JSON.stringify(at(2)) !== JSON.stringify(seed(2))) fail(`[${L}] 안 연 상품이 바뀌었다: ${JSON.stringify(at(2))}`);
    else ok(`컬러 시도가 최근(1일) → 건너뛰고 기록도 그대로`);

    if (h(3) !== 1 || at(3).color !== "Black" || !stamped(3)) fail(`[${L}] 컬러 시도가 31일 전인데: 접속 ${h(3)} · ${JSON.stringify(at(3))}`);
    else ok("컬러 시도가 COLOR_RETRY_DAYS(30일)보다 오래됨 → 다시 연다");

    if (h(14) !== 1 || at(14).color !== "Olive") fail(`[${L}] t 는 최근이지만 ct 가 없는 상품: 접속 ${h(14)} · ${JSON.stringify(at(14))}`);
    else ok("t 가 최근이어도 컬러 시도 기록(ct)이 없으면 연다 — 컬러 창은 t 와 따로 돈다");

    // 병합: blocked / none
    if (h(4) !== 1) fail(`[${L}] p4 를 열지 않았다`);
    else if (at(4).none || at(4).comp || !stamped(4)) fail(`[${L}] 봇 확인 화면인데 none 이 남았다: ${JSON.stringify(at(4))}`);
    else ok("200 봇 확인 화면 → 예전 none 을 걷어 내고 시도 시각만 찍는다");

    if (at(5).comp !== "Wool 100%" || at(5).none || !stamped(5)) fail(`[${L}] 403 에 옳은 혼용률이 지워지거나 none 이 붙었다: ${JSON.stringify(at(5))}`);
    else ok("403 차단 → 기존의 옳은 혼용률은 그대로, none 없음");

    if (!at(6) || at(6).none !== 1 || at(6).comp || !stamped(6)) fail(`[${L}] 실제로 읽었고 소재가 없는 페이지: ${JSON.stringify(at(6))}`);
    else ok("정상으로 읽었는데 소재 표기 없음(상품명이 화면 글에 있음) → none 을 남긴다");
    if (at(6).nv !== "fetch") fail(`[${L}] none 을 적은 읽기 방식(nv)이 없다: ${JSON.stringify(at(6))}`);
    else ok("none 에 nv=fetch 를 함께 남긴다 — 크롬 보강이 다른 엔진으로 한 번 더 확인할 수 있게");
    if (h(15) !== 1 || at(15).none || at(15).nv || at(15).comp || !stamped(15)) fail(`[${L}] 본문이 안 그려진 껍데기: 접속 ${h(15)} · ${JSON.stringify(at(15))}`);
    else ok("차단 화면은 아니지만 상품명이 화면 글에 없는 껍데기 → none 을 적지 않고, 예전 none 도 걷어 낸다");

    for (const [n, why] of [[7, "빈 껍데기(200)"], [9, "403 차단"]]) {
      const o = at(n);
      if (!o || o.none || o.comp || o.blocked || !stamped(n)) fail(`[${L}] ${why}: ${JSON.stringify(o)}`);
      else ok(`${why} → none 을 적지 않고 시도 시각만(blocked 표시도 저장 안 함)`);
    }

    if (!at(8) || at(8).comp || at(8).color || at(8).none) fail(`[${L}] 절반 혼용률·'Select' 컬러가 저장됐다: ${JSON.stringify(at(8))}`);
    else ok("절반만 뽑힌 혼용률(60%)·안내 문구 컬러('Select')는 저장하지 않는다");

    if (h(10) !== 0 || JSON.stringify(at(10)) !== JSON.stringify(seed(10))) fail(`[${L}] 재시도 창 안의 빈 상품을 열었다(접속 ${h(10)})`);
    else ok(`빈 상품이라도 RETRY_DAYS 안에 시도했으면 건너뛴다`);

    if (h(12) !== 1 || at(12).comp !== "Cotton 95% / Elastane 5%") fail(`[${L}] 잘못된 혼용률을 다시 읽어 고치지 않았다: ${JSON.stringify(at(12))}`);
    else ok("잘못 저장된 혼용률은 재시도 창과 무관하게 다시 읽어 옳은 값으로 바꾼다");

    if (h(13) !== 1 || (at(13) && at(13).comp)) fail(`[${L}] 잘못된 혼용률이 403 뒤에도 남았다: ${JSON.stringify(at(13))}`);
    else ok("잘못된 혼용률 + 오늘 403 → 잘못된 값을 지운다");

    for (const [u, v] of Object.entries(Object.assign({}, ...stores))) {
      for (const k of ["comp", "color", "sizes", "price"]) {
        if (v && String(v[k] || "").includes("[object")) fail(`[${L}] 객체가 문자열로 새어 들어감: ${u} ${k}`);
      }
    }
    // 같은 상품을 1차·2차에서 두 번 읽지 않는다.
    const twice = Object.entries(hits).filter(([k, v]) => k.startsWith("/p/") && v > 1);
    if (twice.length) fail(`[${L}] 한 실행에서 두 번 연 상품: ${JSON.stringify(twice)}`);

    // 검색 인덱스 재구축에 오버레이 값이 실린다.
    if (!index) fail(`[${L}] 검색 인덱스 재구축(store=index) 요청이 없다`);
    else {
      const i1 = index.items.find((x) => /\/p\/1$/.test(x.productUrl));
      if (!i1 || i1.comp !== "Cotton 100%" || i1.color !== "Navy") fail(`[${L}] 인덱스에 오버레이 값이 안 실렸다: ${JSON.stringify(i1)}`);
      else ok(`검색 인덱스 재구축 ${index.items.length}개 — 오버레이의 혼용률·컬러가 실린다`);
    }
    if (!existsSync(REPORT) || !/TestBrand/.test(readFileSync(REPORT, "utf8"))) fail(`[${L}] 리포트에 브랜드 줄이 없다`);
    else if (!/미표기 1 .*껍데기 1/.test(readFileSync(REPORT, "utf8"))) fail(`[${L}] 리포트 경로 열에 미표기·껍데기 수가 없다`);
    else ok("리포트 경로 열: 미표기 1 · 껍데기 1");
  }

  // ── 시나리오 2: NEED_FIELDS=comp,color — 예전 동작(컬러도 목표) ──
  {
    const L = "NEED_FIELDS=comp,color";
    const { hits, at } = await scenario(L, { NEED_FIELDS: "comp,color" });
    const h = (n) => hits[`/p/${n}`] || 0;
    // 컬러가 목표면 ct 는 보지 않고 t(RETRY_DAYS)로만 정한다.
    if (h(2) !== 1 || at(2).color !== "Red") fail(`[${L}] t 가 10일 전인 컬러 빈 상품: 접속 ${h(2)} · ${JSON.stringify(at(2))}`);
    else ok("컬러가 목표면 ct(하루 전)와 무관하게 t(10일 전) 기준으로 다시 연다");
    if (h(14) !== 0) fail(`[${L}] t 가 하루 전인 상품을 열었다(접속 ${h(14)}) — 예전 재시도 창이 깨졌다`);
    else ok("컬러가 목표면 t 가 최근(1일)인 상품은 건너뛴다(예전 동작 유지)");
  }
} finally {
  if (reportBak) writeFileSync(REPORT, reportBak);
}

if (bad) { console.error(`\n혼용률 보강 선택·병합 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ 혼용률 보강 선택·병합 통과 — 컬러 재시도 창 · 차단/미표기 구분 · 잘못된 값 정리 · 인덱스 재구축");
