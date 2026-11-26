#!/usr/bin/env node
// 저장된 혼용률 정리(clean-stored-comp.mjs)를 가짜 Worker 에 붙여 끝까지 돌려 본다.
//
// 지우기는 되돌릴 길이 백업뿐이라, 다음을 하나씩 못 박는다:
//   ① 미리보기(기본)는 GET 만 보낸다 — 쓰기 0건, 지울 목록·계획 파일만 남긴다
//   ② 적용은 승인(CONFIRM=apply-<개수>) 없이는 아무것도 쓰지 않는다
//   ③ 적용은 대상의 혼용률만 지운다 — 다른 상품·다른 칸(이름·사진·가격·컬러·사이즈·ct)은 그대로,
//      카탈로그의 모자란 값 뒤에 있던 오버레이의 온전한 값은 남아 보인다
//   ④ 지운 상품은 다시 읽힌다 — t·wt·none·nv 가 지워져 야간 보강이 첫 바퀴에 그 상품 페이지를 연다.
//      상품이 아닌 행은 시도 시각을 그대로 두어 다시 읽지 않는다
//   ⑤ 백업 → 되돌리기가 원래 저장값을 그대로 돌려놓는다(그 사이 새 값이 들어온 칸은 건드리지 않는다)
//   ⑥ 멈춤 조건(기준보다 15% 넘게 많음 · 예상 밖 브랜드에서 여럿 · 오래된 승인 목록)이 걸리면 아무것도 쓰지 않는다
//   ⑦ STAGE=backup 은 쓰지 않고, STAGE=write 는 백업에 없는 값은 지우지 않는다
//   node scripts/test-clean-stored-comp.mjs
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { startCleanWorker } from "./fixtures/fake-clean-worker.mjs";
import { nonProductRow, productUnderCategory, shortWhy, limitCheck, LIMITS } from "./clean-stored-comp.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);
const check = (cond, good, msg) => (cond ? ok(good) : fail(msg || good));
const clone = (o) => JSON.parse(JSON.stringify(o));
// 칸 순서와 무관하게 비교
const canon = (o) => JSON.stringify(o, (k, v) => (v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort()) : v));

// ── 규칙 단위 확인 ──
check(nonProductRow("https://www.carhartt.com/c/black-friday"), "row: /c/black-friday 는 상품 아닌 행");
check(nonProductRow("https://www.loft.com/clothing/dresses/casual-dresses/cat3670007/"), "row: Loft cat3670007 은 상품 아닌 행");
check(nonProductRow("https://www.anntaylor.com/clothing/sweaters/cata000011/"), "row: Ann Taylor cata000011 은 상품 아닌 행");
check(nonProductRow("https://www.ae.com/us/en/c/aerie/tops/sweatshirts-hoodies/cat7030169"), "row: Aerie /c/…/cat7030169 는 상품 아닌 행");
check(nonProductRow("https://www.jmclaughlin.com/collections/new-arrivals-women"), "row: /collections/new-arrivals-women 는 상품 아닌 행");
check(nonProductRow("https://www.madewell.com/womens/new/new-arrivals/"), "row: Madewell new-arrivals 는 상품 아닌 행");
check(!nonProductRow("https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CX381") && productUnderCategory("https://www.jcrew.com/p/womens/categories/clothing/tees-and-tanks/CX381"),
  "row: J.Crew /p/…/categories/…/CX381 은 진짜 상품 — 대상 아님");
check(!nonProductRow("https://www.garnethill.com/eileen-fisher-silk-twill-classic-collar-shirt/clothing/categories/tops-tees/744396"), "row: Garnet Hill …/744396 은 진짜 상품 — 대상 아님");
check(!nonProductRow("https://www.carhartt.com/en-eu/c/men/t-shirts/eum2000014") === false, "row: Carhartt /c/…/eum2000014 는 /c/ 아래라 상품 아닌 행");
check(shortWhy("Elastane 8%") === "합이 8%" && shortWhy("Cotton 100% / Elastane 6%") === "합이 106%", "short: 합 8% · 106% 는 모자란/넘친 값");
check(!shortWhy("Recycled Cotton 20% / Cotton 80%") && !shortWhy("Cotton 100%\nPolyester 100%"), "short: 숫자가 맞는 값은 대상 아님");
{
  const t = (brand, n) => Array.from({ length: n }, () => ({ brand }));
  check(limitCheck(t("Aritzia", 115), 100).length === 0 && limitCheck(t("Aritzia", 116), 100).length === 1, "limit: 기준 100 에 115 는 통과, 116 은 멈춤(15%)");
  check(limitCheck(t("Somebrand", LIMITS.OTHER_MAX), 0).length === 0 && limitCheck(t("Somebrand", LIMITS.OTHER_MAX + 1), 0).length === 1,
    `limit: 예상 밖 브랜드는 ${LIMITS.OTHER_MAX}개까지, 그보다 많으면 멈춤`);
  check(limitCheck(t("&Other Stories", 60), 0).length === 0, "limit: 예상한 브랜드(&Other Stories)는 개수 제한 없음(전체 15%만)");
}

// ── 가짜 세상 ──
const NOW = Date.now(), DAY = 86400000;
const item = (base, path, name, comp = "", extra = {}) => ({ name, imageUrl: `https://img.x${path}.jpg`, productUrl: base + path, price: "$50", priceOrig: "",
  category: "tops", src: base + "/list", comp, color: extra.color || "", sizes: extra.sizes || "S, M" });
function world(base, { unexpected = 0 } = {}) {
  const P = (p) => base + p;
  // Aritzia 흉내 — 40개 중 32개가 Leather 100%(카탈로그 16 · 오버레이 16), 그중 다수는 이름이 울·면을 말한다.
  const ar = [], arOv = {};
  for (let i = 1; i <= 40; i++) {
    const path = `/p/a${i}`;
    const leather = i <= 32;
    const name = leather ? (i % 3 === 0 ? `Wool Crew Sweater ${i}` : i % 3 === 1 ? `Cotton Tank ${i}` : `Contour Top ${i}`) : `Linen Shirt ${i}`;
    if (leather && i % 2 === 0) ar.push(item(base, path, name, "Leather 100%"));
    else ar.push(item(base, path, name));
    if (leather && i % 2 === 1) arOv[P(path)] = { comp: "Leather 100%", color: "Black", t: NOW - DAY, ct: NOW - DAY, wt: NOW - DAY, via: "wayback", wd: "20260101" };
    if (!leather) arOv[P(path)] = { comp: `Linen ${50 + i}% / Cotton ${50 - i}%`, color: "White", t: NOW - 2 * DAY };
  }
  // 카탈로그 값 뒤의 오버레이: 사이트 미표기(none) 표시가 남아 있는 경우 — 지운 뒤 '정보 없음'이 되면 안 된다.
  arOv[P("/p/a2")] = { none: 1, nv: "fetch", t: NOW - DAY, color: "Ivory", sizes: "XS, S" };
  // 같은 상품의 오버레이에도 같은 조각 값 — 둘 다 지워야 한다.
  arOv[P("/p/a4")] = { comp: "Leather 100%", t: NOW - DAY, price: "$48" };
  // 숫자가 모자란 카탈로그 값
  const sh = [
    item(base, "/p/s1", "Modal Tee", "Elastane 8%"),        // 오버레이에 온전한 값 → 그 값이 보이게 된다
    item(base, "/p/s2", "Wide Pant", "Cotton 45%"),         // 오버레이 없음
    item(base, "/p/s3", "Pima Tee", "Combed Pima Cotton 100%"), // 이름만 낯선 값 — 대상 아님
    item(base, "/p/s4", "Rib Tank", "Cotton 100% / Elastane 6%"), // 합 106 — 오버레이엔 컬러·시도 시각만
    item(base, "/p/s5", "Plain Tee"),
  ];
  const shOv = {
    [P("/p/s1")]: { comp: "Modal 92% / Elastane 8%", color: "Grey", t: NOW - DAY },
    [P("/p/s4")]: { color: "Navy", t: NOW - DAY, ct: NOW - DAY },
    [P("/p/s5")]: { none: 1, nv: "fetch", t: NOW - DAY },
  };
  // 상품이 아닌 행 + 이름이 categories 아래인 진짜 상품
  const rw = [
    item(base, "/c/black-friday", "arrow icon"),
    item(base, "/p/womens/categories/clothing/tees/CX381", "Vintage Tee"),
    item(base, "/p/r3", "Chore Coat", "Cotton 100%"),
  ];
  const rwOv = {
    [P("/c/black-friday")]: { comp: "Cotton 59% / Polyester 41%", t: NOW - DAY },
    [P("/p/womens/categories/clothing/tees/CX381")]: { comp: "Cotton 100%", t: NOW - DAY },
  };
  // 아무것도 지울 것 없는 브랜드
  const cl = [item(base, "/p/k1", "Knit", "Wool 100%"), item(base, "/p/k2", "Tee")];
  const clOv = { [P("/p/k2")]: { comp: "Cotton 100%", t: NOW - DAY } };
  const catalogs = {
    "aritzia.test.aritzia": { site: "aritzia.test.aritzia", brand: "Aritzia", updated: 1, items: ar },
    "short.test.short": { site: "short.test.short", brand: "Shortbrand", updated: 1, items: sh },
    "rows.test.rows": { site: "rows.test.rows", brand: "Carlhartt", updated: 1, items: rw },
    "clean.test.clean": { site: "clean.test.clean", brand: "Cleanbrand", updated: 1, items: cl },
  };
  const overlays = { "aritzia.test.aritzia": arOv, "short.test.short": shOv, "rows.test.rows": rwOv, "clean.test.clean": clOv };
  if (unexpected) {
    catalogs["odd.test.odd"] = { site: "odd.test.odd", brand: "Oddbrand", updated: 1,
      items: Array.from({ length: unexpected }, (_, i) => item(base, `/p/o${i}`, `Odd ${i}`, "Cotton 40%")) };
    overlays["odd.test.odd"] = {};
  }
  // 정리 뒤 야간 보강이 열어 볼 페이지 — 진짜 소재
  const pages = {};
  for (let i = 1; i <= 40; i++) pages[`/p/a${i}`] = `<html><head><title>A ${i}</title></head><body><h1>A ${i}</h1><div>Composition: 100% Wool</div><p>${"Soft knit with a relaxed fit. Machine wash cold. ".repeat(20)}</p></body></html>`;
  pages["/c/black-friday"] = `<html><body><h1>Black Friday</h1><div>Composition: 100% Cotton</div>${"x ".repeat(400)}</body></html>`;
  return { catalogs, overlays, pages };
}
// 지울 것: Aritzia 32 · Shortbrand 3(s1·s2·s4) · Carlhartt 1(/c/black-friday) = 36
const EXPECT = 36;

function run(script, base, env, out) {
  return new Promise((resolveP) => {
    const p = spawn(process.execPath, [join(ROOT, "scripts", script)], {
      env: { ...process.env, WORKER_URL: base, WORKER_TOKEN: "test", NO_PROXY: "localhost,127.0.0.1", no_proxy: "localhost,127.0.0.1",
        APPLY: "", CONFIRM: "", STAGE: "", PLAN: "", BACKUP: "", RESTORE: "", BRANDS: "", EXPECT: "", OUT_DIR: out, RUN_ID: "t1",
        DRY: "", WAYBACK: "0", BRAND_POOL: "1", RETRY_DAYS: "5", ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let o = "";
    p.stdout.on("data", (d) => (o += d)); p.stderr.on("data", (d) => (o += d));
    p.on("close", (code) => resolveP({ code, out: o }));
  });
}
// 미리보기의 계획 파일(상품 주소 포함)을 다음 실행이 그대로 쓰도록 가짜 Worker 는 늘 같은 포트로 띄운다.
const PORT = 20000 + Math.floor(Math.random() * 20000);
const start = (opts) => startCleanWorker((b) => world(b, opts), PORT);
const writes = (fk) => fk.state.requests.filter((r) => r.method !== "GET" && r.method !== "HEAD");

const dirs = [];
const tmp = () => { const d = mkdtempSync(join(tmpdir(), "clean-comp-")); dirs.push(d); return d; };
// enrich-comp.mjs 는 리포트를 저장소 루트에 쓴다 — 테스트가 진짜 리포트를 바꾸지 않게 지켜 둔다.
const REPORTS = ["enrich-comp-report.md", "enrich-comp-dry-report.md"].map((f) => join(ROOT, f));
const saved = REPORTS.map((f) => (existsSync(f) ? readFileSync(f) : null));

try {
  // ── ① 미리보기 ──
  let planPath, dryOut;
  {
    const out = tmp(); dryOut = out;
    const fk = await start();
    const before = clone({ c: fk.state.catalogs, o: fk.state.overlays });
    const r = await run("clean-stored-comp.mjs", fk.base, {}, out);
    await fk.close();
    if (r.code !== 0) { console.error(r.out); fail(`미리보기 종료 코드 ${r.code}`); }
    check(!writes(fk).length, `미리보기: 요청 ${fk.state.requests.length}건이 전부 GET — 쓰기 0건`, `미리보기가 쓰기를 보냄: ${JSON.stringify(writes(fk).slice(0, 2))}`);
    check(canon(before) === canon({ c: fk.state.catalogs, o: fk.state.overlays }), "미리보기: 저장값 그대로");
    planPath = join(out, "stored-comp-clean-plan.json");
    const plan = JSON.parse(readFileSync(planPath, "utf8"));
    check(plan.total === EXPECT && plan.groups.guard === 32 && plan.groups.short === 3 && plan.groups.row === 1,
      `미리보기: 대상 ${EXPECT}개(조각 32 · 모자란 값 3 · 상품 아닌 행 1)`, `대상이 다르다: ${JSON.stringify(plan.groups)} 총 ${plan.total}`);
    const urls = new Set(plan.targets.map((t) => t.url.replace(fk.base, "")));
    check(!urls.has("/p/s3") && !urls.has("/p/womens/categories/clothing/tees/CX381") && !urls.has("/p/r3") && !urls.has("/p/k1") && !urls.has("/p/a33"),
      "미리보기: 이름만 낯선 값·categories 아래 진짜 상품·정상 값·다른 브랜드는 대상 아님");
    const s1 = plan.targets.find((t) => t.url.endsWith("/p/s1"));
    check(s1 && s1.after === "Modal 92% / Elastane 8%" && !s1.retry && s1.layers.length === 1 && s1.layers[0].layer === "catalog",
      "미리보기: 카탈로그의 모자란 값만 지우고, 뒤의 온전한 오버레이 값이 보이게 된다");
    const a4 = plan.targets.find((t) => t.url.endsWith("/p/a4"));
    check(a4 && a4.layers.map((l) => l.layer).sort().join() === "catalog,overlay", "미리보기: 카탈로그와 오버레이에 같은 조각이 있으면 둘 다 지울 칸");
    const md = readFileSync(join(out, "stored-comp-clean-report.md"), "utf8");
    check(/아직 아무것도 지우지 않았다/.test(md) && /### Aritzia — 32개/.test(md) && /Wool Crew Sweater 3/.test(md) && /상품명은 wool/.test(md) &&
      /따로 할 일 — 상품이 아닌 행 1개/.test(md) && /confirm=apply-36/.test(md),
      "미리보기 리포트: 브랜드별 개수·상품명·지울 값·이유·링크·따로 할 일·적용 입력값", md.slice(0, 1500));
  }

  // ── ② 승인 없는 적용 ──
  {
    const fk = await start();
    const r1 = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: planPath }, tmp());
    const r2 = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: planPath, CONFIRM: "apply-35" }, tmp());
    await fk.close();
    check(r1.code === 3 && r2.code === 3 && !writes(fk).length, "적용: CONFIRM 이 없거나 개수가 다르면 멈추고 아무것도 쓰지 않는다", `코드 ${r1.code}/${r2.code} · 쓰기 ${writes(fk).length}`);
  }

  // ── ③④⑤ 적용 → 확인 → 다시 읽힘 → 되돌리기 ──
  {
    const out = tmp();
    const fk = await start();
    const P = (p) => fk.base + p;
    const orig = clone({ c: fk.state.catalogs, o: fk.state.overlays });

    // 정리 전: 야간 보강(미리보기)은 오버레이에 조각 값이 있는 Aritzia 상품(홀수 번호)을 열지 않는다 —
    // 값이 '옳은' 모양이라 다 찼다고 본다. (카탈로그에만 값이 있는 상품은 보강이 원래도 열지만, 읽은 값은
    // 오버레이에 들어가고 화면에는 카탈로그 값이 앞서 나간다 — 그래서 카탈로그 칸도 비워야 한다.)
    const e0 = await run("enrich-comp.mjs", fk.base, { DRY: "1" }, out);
    const hit0 = Object.keys(fk.state.hits).filter((k) => /^\/p\/a\d+$/.test(k) && Number(k.slice(4)) % 2 === 1 && Number(k.slice(4)) <= 32).length;
    if (e0.code !== 0) { console.error(e0.out.slice(-2000)); fail(`정리 전 보강 종료 코드 ${e0.code}`); }
    fk.state.hits = {};

    const r = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: planPath, CONFIRM: `apply-${EXPECT}` }, out);
    if (r.code !== 0) { console.error(r.out); fail(`적용 종료 코드 ${r.code}`); }
    const posts = writes(fk);
    check(posts.every((p) => /store=(overlay|catalog)/.test(p.query)) && !posts.some((p) => p.query.includes("clean.test.clean")) && !posts.some((p) => p.query.includes("replace=1")),
      `적용: 쓰기 ${posts.length}건 — 대상이 있는 카탈로그의 overlay·catalog(병합)뿐, 지울 것 없는 브랜드엔 쓰지 않음`, JSON.stringify(posts));
    const C = fk.state.catalogs, O = fk.state.overlays;
    const ar = C["aritzia.test.aritzia"], arO = O["aritzia.test.aritzia"];
    // 대상만 지워졌나
    const plan = JSON.parse(readFileSync(planPath, "utf8"));
    const tset = new Set(plan.targets.map((t) => t.url));
    let leftComp = 0, otherChanged = [];
    for (const [site, c] of Object.entries(C)) {
      const oc = orig.c[site];
      if (c.items.length !== oc.items.length) otherChanged.push(`${site} 상품 수 ${oc.items.length}→${c.items.length}`);
      if (c.brand !== oc.brand) otherChanged.push(`${site} 브랜드 ${oc.brand}→${c.brand}`);
      c.items.forEach((p, i) => {
        const q = oc.items[i];
        if (p.productUrl !== q.productUrl) otherChanged.push(`${site} 순서 바뀜 ${i}`);
        const strip = (x) => ({ ...x, comp: "" });
        if (canon(strip(p)) !== canon(strip(q))) otherChanged.push(`${site} ${p.productUrl} 다른 칸이 바뀜`);
        if (tset.has(p.productUrl) && plan.targets.find((t) => t.url === p.productUrl).layers.some((l) => l.layer === "catalog") && p.comp) leftComp++;
        if (!tset.has(p.productUrl) && p.comp !== q.comp) otherChanged.push(`${site} 대상 아닌 ${p.productUrl} comp 바뀜`);
      });
    }
    for (const [site, ov] of Object.entries(O)) for (const [k, v] of Object.entries(orig.o[site])) {
      if (!tset.has(k) && canon(ov[k]) !== canon(v)) otherChanged.push(`${site} 대상 아닌 오버레이 ${k} 바뀜`);
      if (tset.has(k) && ov[k] && ov[k].comp && plan.targets.find((t) => t.url === k).layers.some((l) => l.key === k)) leftComp++;
    }
    check(!leftComp, "적용: 대상의 혼용률이 카탈로그·오버레이 모두에서 지워졌다", `남은 값 ${leftComp}`);
    check(!otherChanged.length, "적용: 대상 아닌 상품·다른 칸(이름·사진·가격·카테고리·컬러·사이즈)·순서·브랜드는 그대로", otherChanged.slice(0, 6).join(" / "));
    const a1 = arO[P("/p/a1")];
    check(a1 && !a1.comp && a1.color === "Black" && a1.ct && !("t" in a1) && !("wt" in a1) && !("via" in a1) && !("wd" in a1),
      "적용: 오버레이 조각 값 — comp·via·wd·t·wt 를 지우고 컬러·ct 는 남김", JSON.stringify(a1));
    const a2 = arO[P("/p/a2")];
    check(a2 && !a2.none && !a2.nv && !a2.t && a2.color === "Ivory" && a2.sizes === "XS, S",
      "적용: 카탈로그 값 뒤의 none·nv·t 를 지운다('정보 없음'으로 나가지 않고 다시 읽힌다) · 컬러·사이즈는 남김", JSON.stringify(a2));
    check(arO[P("/p/a4")] && !arO[P("/p/a4")].comp && arO[P("/p/a4")].price === "$48" && !ar.items.find((p) => p.productUrl === P("/p/a4")).comp,
      "적용: 같은 조각이 카탈로그·오버레이 둘 다에 있던 상품 — 둘 다 지움, 가격은 남김");
    const sO = O["short.test.short"], sC = C["short.test.short"];
    check(canon(sO[P("/p/s1")]) === canon(orig.o["short.test.short"][P("/p/s1")]) && !sC.items[0].comp,
      "적용: 모자란 카탈로그 값만 지우고 뒤의 온전한 값(Modal 92% / Elastane 8%)은 그대로 — 그 값이 보인다");
    check(sO[P("/p/s4")] && !("t" in sO[P("/p/s4")]) && sO[P("/p/s4")].color === "Navy" && sO[P("/p/s4")].ct, "적용: 카탈로그 값만 있던 상품 — 오버레이 t 를 지워 다시 읽힌다(컬러·ct 는 남김)");
    const rO = O["rows.test.rows"];
    check(rO[P("/c/black-friday")] && !rO[P("/c/black-friday")].comp && rO[P("/c/black-friday")].t === orig.o["rows.test.rows"][P("/c/black-friday")].t &&
      rO[P("/p/womens/categories/clothing/tees/CX381")].comp === "Cotton 100%",
      "적용: 상품 아닌 행은 값만 지우고 시도 시각은 그대로 · categories 아래 진짜 상품은 그대로");
    const bkFile = join(out, "stored-comp-clean-backup-t1.json");
    check(existsSync(bkFile) && readdirSync(join(out, "stored-comp-clean-snapshot-t1")).length === 6, "적용: 백업 파일 + 카탈로그 3개의 통째 사본(카탈로그·오버레이)");
    const bk = JSON.parse(readFileSync(bkFile, "utf8"));
    check(bk.entries.some((e) => e.layer === "catalog" && e.value === "Elastane 8%" && e.productUrl === P("/p/s1")) &&
      bk.entries.some((e) => e.layer === "overlay" && e.key === P("/p/a1") && e.value === "Leather 100%" && e.before.wt) &&
      bk.entries.some((e) => e.layer === "overlay-stamps" && e.key === P("/p/a2") && e.before.none),
      "백업: 사이트·상품 주소·카탈로그/오버레이·이전 값 전체·그 칸의 원래 객체(시각·표시 포함)");
    const md = readFileSync(join(out, "stored-comp-clean-apply-t1.md"), "utf8");
    check(/36개를 지웠다/.test(md) && /다시 읽어 확인: 지운 값이 모두 사라졌고/.test(md), "적용 리포트: 지운 개수 · 다시 읽어 확인");

    // 다시 미리보기 → 대상 0
    const again = await run("clean-stored-comp.mjs", fk.base, {}, tmp());
    check(/대상 0개/.test(again.out), "적용 뒤 미리보기: 남은 대상 0개", again.out.slice(-400));

    // ④ 다시 읽힘: 야간 보강(미리보기 모드라 저장은 안 함)이 지운 상품 페이지를 연다.
    fk.state.hits = {};
    const e1 = await run("enrich-comp.mjs", fk.base, { DRY: "1" }, out);
    if (e1.code !== 0) { console.error(e1.out.slice(-2000)); fail(`정리 뒤 보강 종료 코드 ${e1.code}`); }
    const reread = plan.targets.filter((t) => t.retry && t.url.includes("/p/a")).map((t) => t.url.replace(fk.base, ""));
    const missed = reread.filter((p) => !fk.state.hits[p]);
    check(hit0 === 0, "정리 전: 야간 보강은 오버레이 조각 값 상품을 열지 않았다(대조군)", `정리 전에도 ${hit0}개를 열었다`);
    check(!missed.length && reread.length === 32, `정리 뒤: 야간 보강이 지운 Aritzia 상품 ${reread.length}개를 모두 첫 바퀴에 다시 연다`, `안 연 상품: ${missed.join(", ")}`);
    check(!fk.state.hits["/c/black-friday"], "정리 뒤: 상품 아닌 행(/c/black-friday)은 다시 읽지 않는다(시도 시각 그대로)");
    check(/1차 신상/.test(e1.out), "정리 뒤: 보강 로그에 1차(시도 기록 없음) 바퀴");

    // ⑤ 되돌리기 — 미리보기는 쓰지 않고, APPLY=1 이면 원래대로. 그 사이 새 값이 들어온 칸은 건드리지 않는다.
    const nw = fk.state.requests.length;
    const rd = await run("clean-stored-comp.mjs", fk.base, { RESTORE: bkFile }, out);
    check(rd.code === 0 && !fk.state.requests.slice(nw).some((q) => q.method !== "GET"), "되돌리기 미리보기: 쓰기 0건");
    // 새 값이 들어온 칸 하나를 흉내낸다(야간 보강이 진짜 소재를 채움)
    fk.state.overlays["aritzia.test.aritzia"][P("/p/a3")] = { ...fk.state.overlays["aritzia.test.aritzia"][P("/p/a3")], comp: "Wool 100%", t: NOW };
    const rr = await run("clean-stored-comp.mjs", fk.base, { RESTORE: bkFile, APPLY: "1" }, out);
    if (rr.code !== 0) { console.error(rr.out); fail(`되돌리기 종료 코드 ${rr.code}`); }
    const now = { c: clone(fk.state.catalogs), o: clone(fk.state.overlays) };
    check(now.o["aritzia.test.aritzia"][P("/p/a3")].comp === "Wool 100%", "되돌리기: 그 사이 새 값이 들어온 칸은 덮지 않는다");
    // 그 칸만 빼면 원래와 똑같아야 한다(카탈로그 updated 는 저장 시각이라 뺀다)
    now.o["aritzia.test.aritzia"][P("/p/a3")] = orig.o["aritzia.test.aritzia"][P("/p/a3")];
    for (const s of Object.keys(now.c)) { now.c[s].updated = orig.c[s].updated; delete now.c[s].site; }
    const o2 = clone(orig); for (const s of Object.keys(o2.c)) delete o2.c[s].site;
    check(canon(now) === canon(o2), "백업 → 되돌리기: 카탈로그·오버레이가 정리 전과 똑같아진다(시각·표시 포함)",
      "되돌린 결과가 원래와 다르다: " + Object.keys(now.o).filter((s) => canon(now.o[s]) !== canon(o2.o[s])).concat(Object.keys(now.c).filter((s) => canon(now.c[s]) !== canon(o2.c[s]))).join(", "));
    await fk.close();
  }

  // ── ⑥ 멈춤 조건 ──
  {
    // 기준보다 15% 넘게 많음: 승인 목록을 30개로 꾸미면(36 > 34.5) 멈춘다.
    const out = tmp();
    const p30 = JSON.parse(readFileSync(planPath, "utf8")); p30.total = 30; p30.targets = p30.targets.slice(0, 30);
    writeFileSync(join(out, "p30.json"), JSON.stringify(p30));
    const fk = await start();
    const r = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: join(out, "p30.json"), CONFIRM: "apply-30" }, out);
    check(r.code === 3 && !writes(fk).length && /15%/.test(r.out), "멈춤: 지금 대상(36)이 승인 개수(30)보다 15% 넘게 많으면 아무것도 쓰지 않는다", r.out.slice(-500));
    // 오래된 승인 목록
    const old = JSON.parse(readFileSync(planPath, "utf8")); old.at = new Date(Date.now() - 4 * DAY).toISOString();
    writeFileSync(join(out, "old.json"), JSON.stringify(old));
    const r2 = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: join(out, "old.json"), CONFIRM: `apply-${EXPECT}` }, out);
    check(r2.code === 3 && !writes(fk).length, "멈춤: 72시간보다 오래된 승인 목록이면 아무것도 쓰지 않는다");
    await fk.close();
    // 예상 밖 브랜드에서 9개(> 8): 미리보기는 경고만, 적용은 멈춤
    const fk2 = await start({ unexpected: 9 });
    const out2 = tmp();
    const d = await run("clean-stored-comp.mjs", fk2.base, { EXPECT: "45" }, out2);
    const md = readFileSync(join(out2, "stored-comp-clean-report.md"), "utf8");
    check(d.code === 0 && /⛔ 멈춤 조건에 걸림: 예상 밖 브랜드 Oddbrand 에서 9개/.test(md), "멈춤(미리보기): 예상 밖 브랜드 9개를 리포트 맨 위에 ⛔ 로 알린다");
    const a = await run("clean-stored-comp.mjs", fk2.base, { APPLY: "1", PLAN: join(out2, "stored-comp-clean-plan.json"), CONFIRM: "apply-45" }, out2);
    check(a.code === 3 && !writes(fk2).length && /Oddbrand/.test(a.out), "멈춤(적용): 예상 밖 브랜드 하나에서 8개 넘게 걸리면 아무것도 쓰지 않는다");
    await fk2.close();
  }

  // ── ⑦ STAGE=backup / STAGE=write ──
  {
    const out = tmp();
    const fk = await start();
    const b1 = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: planPath, CONFIRM: `apply-${EXPECT}`, STAGE: "backup" }, out);
    check(b1.code === 0 && !writes(fk).length && existsSync(join(out, "stored-comp-clean-backup-t1.json")), "STAGE=backup: 백업만 쓰고 Worker 에는 쓰지 않는다");
    const w0 = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: planPath, CONFIRM: `apply-${EXPECT}`, STAGE: "write", BACKUP: join(out, "nope.json") }, out);
    check(w0.code === 4 && !writes(fk).length, "STAGE=write: 백업 파일이 없으면 쓰지 않는다");
    // 백업에서 Aritzia 항목을 빼면 그 상품은 지우지 않는다
    const bk = JSON.parse(readFileSync(join(out, "stored-comp-clean-backup-t1.json"), "utf8"));
    bk.entries = bk.entries.filter((e) => e.site !== "aritzia.test.aritzia");
    writeFileSync(join(out, "partial.json"), JSON.stringify(bk));
    const w1 = await run("clean-stored-comp.mjs", fk.base, { APPLY: "1", PLAN: planPath, CONFIRM: `apply-${EXPECT}`, STAGE: "write", BACKUP: join(out, "partial.json") }, out);
    check(w1.code === 0 && !writes(fk).some((q) => q.query.includes("aritzia")) && writes(fk).some((q) => q.query.includes("short.test.short") || q.method === "POST"),
      "STAGE=write: 백업에 없는 값(Aritzia)은 지우지 않고, 백업에 있는 것만 지운다", w1.out.slice(-600));
    await fk.close();
  }
} finally {
  REPORTS.forEach((f, i) => { if (saved[i]) writeFileSync(f, saved[i]); else if (existsSync(f)) rmSync(f); });
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
}

if (bad) { console.error(`\n혼용률 정리 ${bad}건 실패`); process.exit(1); }
console.log("\n✅ 혼용률 정리 — 미리보기는 쓰지 않음 · 대상만 지움 · 다시 읽힘 · 백업/되돌리기 · 멈춤 조건");
