#!/usr/bin/env node
// 크롬 확장을 '실제로' 설치해 수집 1회를 끝까지 돌리고, 혼용률 보강(enrichComps)이
// fetch 로 막힌 상품만 탭으로 다시 읽는지 확인한다.
//
// 확장 코드는 문자열 테스트로는 못 잡는 부분이 많다 — 서비스워커 fetch 와 탭 탐색은
// 같은 사이트에서도 다른 응답을 받고, 탭 안에 주입한 함수는 실제 DOM 에서 돈다.
// 그래서 진짜 Chromium 에 unpacked 확장을 올리고, 가짜 Render·Worker·쇼핑몰
// (scripts/fixtures/fake-ext-backend.mjs)에만 붙여 돌린다. 진짜 사이트는 건드리지 않는다.
//
// 확인하는 것:
//   ① fetch 로 읽히는 상품은 fetch 로 채우고 탭을 열지 않는다
//   ② fetch 가 봇 확인 화면이면 탭으로 열어, 3초 뒤에 그려지는 소재까지 읽는다
//   ③ fetch 가 빈 껍데기(또는 403)면 탭으로 열어, 접힌 details 를 펼쳐 읽는다
//   ④ fetch·탭 모두 막히면 오버레이에 아무것도 남기지 않는다(t 없음 → 다음에 다시)
//   ⑤ fetch 로 읽었는데 소재가 없으면 t 만 찍힌다(기존 동작)
//   ⑥ 탭으로도 처음 TAB_GIVEUP(6)개가 전부 막히면 그 브랜드의 탭 읽기를 접는다
//   + 카탈로그 자체가 저장됐는가
//
// 손으로 돌린다(2분 남짓 걸린다 — 확장의 대기 시간을 테스트 때문에 줄이지 않는다):
//   NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 node scripts/smoke-extension-enrich.mjs
// 화면이 있는 모드로 보려면 HEADED=1 (서버라면 xvfb-run 으로 감싼다).
// Chromium 경로를 직접 주려면 PLAYWRIGHT_CHROMIUM=/path/to/chrome.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { startFakeBackend } from "./fixtures/fake-ext-backend.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXT = join(ROOT, "chrome-extension");
const PORT = Number(process.env.PORT) || 8963;
const TIMEOUT_MS = 5 * 60 * 1000;

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);
const t0 = Date.now();
const secs = () => ((Date.now() - t0) / 1000).toFixed(0) + "s";

const { server, rec } = await startFakeBackend(PORT);
const B = rec.base;
const SITE_A = "127.0.0.1.smokebrand";
const SITE_B = "127.0.0.1.giveupbrand";

const userDir = mkdtempSync(join(tmpdir(), "rack-ext-smoke-"));
let context;
let finalState = null;
try {
  // 확장은 headless-shell 에서는 안 뜬다 — 완전한 Chromium(channel: chromium)의 새 headless 를 쓴다.
  context = await chromium.launchPersistentContext(userDir, {
    channel: process.env.PLAYWRIGHT_CHROMIUM ? undefined : "chromium",
    executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined,
    headless: !process.env.HEADED,
    args: [
      `--disable-extensions-except=${EXT}`,
      `--load-extension=${EXT}`,
      // 가짜 서버는 전부 127.0.0.1 — 사내 프록시를 거치지 않게 한다.
      "--no-proxy-server",
    ],
  });
  // 팝업은 열릴 때 GitHub 에서 최신 버전을 확인한다 — 테스트에서는 밖으로 나가지 않게 막는다.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());

  let sw = context.serviceWorkers().find((w) => w.url().startsWith("chrome-extension://"));
  if (!sw) sw = await context.waitForEvent("serviceworker", { timeout: 20000 });
  const extId = new URL(sw.url()).host;
  console.log(`· 확장 로드됨 — id ${extId} (${secs()})`);

  // 팝업 페이지에서 사람이 누르는 것과 같은 메시지를 보낸다.
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extId}/popup.html`);
  const send = (msg) => popup.evaluate((m) => new Promise((res) => chrome.runtime.sendMessage(m, res)), msg);

  // Render 주소는 setCfg 가 받지 않는다(저장소 키 render 로만 바뀐다) — 저장소에 직접 넣는다.
  await popup.evaluate((render) => chrome.storage.local.set({ render }), `${B}/r`);
  const cfgOk = await send({ type: "setCfg", worker: `${B}/w`, token: "" });
  const cfg = await send({ type: "getCfg" });
  if (!cfgOk || !cfgOk.ok || cfg.worker !== `${B}/w` || cfg.render !== `${B}/r` || cfg.token !== "") {
    throw new Error("설정이 안 들어갔다: " + JSON.stringify(cfg));
  }

  // runNow = 팝업의 "지금 전체 실행" — buildTargets → collect(manual) → enrichComps.
  const started = await send({ type: "runNow" });
  if (!started || !started.ok || started.brands !== 2) throw new Error("runNow 실패: " + JSON.stringify(started));
  console.log(`· 수집 시작 — 브랜드 ${started.brands}개 · 카테고리 ${started.total}개 (${secs()})`);

  let lastCur = "";
  while (Date.now() - t0 < TIMEOUT_MS) {
    await popup.waitForTimeout(1500);
    const st = await send({ type: "state" });
    if (st.current && st.current !== lastCur) { lastCur = st.current; console.log(`  … ${st.current} (${secs()})`); }
    if (!st.running && (st.log || []).some((l) => /한 바퀴 완료|걸림/.test(l.msg || ""))) { finalState = st; break; }
  }
  if (!finalState) throw new Error(`${TIMEOUT_MS / 1000}초 안에 수집이 끝나지 않았다`);
} catch (e) {
  fail("실행 실패: " + ((e && e.stack) || e));
} finally {
  if (context) await context.close().catch(() => {});
  server.close();
  try { rmSync(userDir, { recursive: true, force: true }); } catch (e) {}
}

if (finalState) {
  console.log(`· 수집 끝 (${secs()}) — 로그:`);
  for (const l of [...finalState.log].reverse()) console.log(`    ${l.ok ? "·" : "!"} ${l.msg}`);

  // ── 카탈로그가 저장됐는가 ──
  const catA = rec.catalogs[SITE_A] || [];
  const catB = rec.catalogs[SITE_B] || [];
  if (catA.length !== 6) fail(`SmokeBrand 카탈로그 ${catA.length}개 (기대 6) — ${Object.keys(rec.catalogs).join(", ")}`);
  else ok("SmokeBrand 카탈로그 6개 저장");
  if (catB.length !== 7) fail(`GiveupBrand 카탈로그 ${catB.length}개 (기대 7)`);
  else ok("GiveupBrand 카탈로그 7개 저장");
  const post = rec.catalogPosts.find((c) => c.body.site === SITE_A);
  if (post && !/replace=1/.test(post.query)) fail("카테고리를 다 돌았는데 replace=1 이 없다: " + post.query);

  // ── Sec-Fetch-Dest 로 fetch/탭을 가를 수 있었는가 ──
  const dests = new Set(rec.product.map((r) => r.dest));
  if (!dests.has("empty") || !dests.has("document") || [...dests].some((d) => d !== "empty" && d !== "document")) {
    fail("Sec-Fetch-Dest 가 예상과 다르다: " + [...dests].join(", ") + " — 가짜 쇼핑몰이 fetch/탭을 못 가른다");
  }
  const reqs = (path, dest) => rec.product.filter((r) => r.path === path && r.dest === dest).length;
  const pa = (slug) => `/a/item/${slug}`;

  // 모든 상품이 먼저 fetch 로 한 번씩 읽혀야 한다.
  for (const slug of ["fetch-ok", "challenge-late", "js-shell", "fetch-403", "both-blocked", "no-comp"]) {
    if (reqs(pa(slug), "empty") !== 1) fail(`${slug}: fetch 요청 ${reqs(pa(slug), "empty")}회 (기대 1)`);
  }
  // 탭은 fetch 로 막힌 상품에만, 한 번씩.
  const tabbedA = ["challenge-late", "js-shell", "fetch-403", "both-blocked"];
  for (const slug of tabbedA) {
    if (reqs(pa(slug), "document") !== 1) fail(`${slug}: 탭 열림 ${reqs(pa(slug), "document")}회 (기대 1)`);
  }
  for (const slug of ["fetch-ok", "no-comp"]) {
    if (reqs(pa(slug), "document")) fail(`${slug}: fetch 로 읽혔는데 탭을 열었다`);
  }
  if (!bad) ok("탭은 fetch 로 막힌 SmokeBrand 상품 4개에만 열렸다");

  // ── 오버레이에 무엇이 저장됐는가 ──
  const ovA = rec.overlayPosts.filter((o) => o.site === SITE_A);
  if (ovA.length !== 1) fail(`SmokeBrand 오버레이 저장 ${ovA.length}회 (기대 1)`);
  const saved = (ovA[ovA.length - 1] || {}).body || {};
  const g = (slug) => saved[`${B}${pa(slug)}`];
  const expect = (slug, comp, color, label) => {
    const v = g(slug);
    if (!v) return fail(`${label}: 저장 안 됨`);
    if (v.comp !== comp) return fail(`${label}: comp ${JSON.stringify(v.comp)} (기대 ${JSON.stringify(comp)})`);
    if (color !== undefined && v.color !== color) return fail(`${label}: color ${JSON.stringify(v.color)} (기대 ${JSON.stringify(color)})`);
    if (!v.t) return fail(`${label}: 시도 시각(t)이 없다`);
    ok(`${label}: ${JSON.stringify(v.comp)}${v.color ? " · " + v.color : ""}`);
  };
  expect("fetch-ok", "Cotton 95% / Elastane 5%", "Navy", "① fetch 로 채움");
  expect("challenge-late", "Wool 70% / Nylon 30%", "Oat", "② 봇 확인 → 탭 · 늦게 그려지는 소재");
  expect("js-shell", "Linen 100%", undefined, "③ 빈 껍데기 → 탭 · 접힌 details");
  expect("fetch-403", "Silk 100%", undefined, "③-b fetch 403 → 탭");
  if (g("both-blocked")) fail(`④ fetch·탭 모두 막힘: 오버레이에 남았다 — ${JSON.stringify(g("both-blocked"))} (다음에 다시 시도하지 않게 된다)`);
  else ok("④ fetch·탭 모두 막힘: 오버레이에 없음 → 다음 실행에 다시");
  const nc = g("no-comp");
  if (!nc || !nc.t || nc.comp) fail(`⑤ 소재 없는 페이지: ${JSON.stringify(nc)} (기대: t 만 있고 comp 없음)`);
  else ok("⑤ 소재 없는 페이지: t 만 찍힘");
  const keys = Object.keys(saved);
  if (keys.length !== 5) fail(`SmokeBrand 오버레이 항목 ${keys.length}개 (기대 5): ${keys.join(", ")}`);
  for (const [u, v] of Object.entries(saved)) {
    for (const k of Object.keys(v)) if (String(v[k]).includes("[object")) fail(`객체가 문자열로 새어 들어감: ${u} ${k}`);
  }

  // ── 탭으로도 다 막히는 브랜드: 6개에서 접는다 ──
  const bDoc = rec.product.filter((r) => r.path.startsWith("/b/") && r.dest === "document").length;
  const bFetch = rec.product.filter((r) => r.path.startsWith("/b/") && r.dest === "empty").length;
  if (bFetch !== 7) fail(`GiveupBrand fetch ${bFetch}회 (기대 7)`);
  if (bDoc !== 6) fail(`⑥ GiveupBrand 탭 ${bDoc}회 (기대 6 = TAB_GIVEUP)`);
  else ok("⑥ 탭으로도 6개 연속 막히자 7번째는 열지 않았다");
  const ovB = rec.overlayPosts.filter((o) => o.site === SITE_B);
  if (ovB.some((o) => Object.keys(o.body).some((u) => u.includes("/b/item/")))) {
    fail("GiveupBrand: 막힌 상품이 오버레이에 저장됐다");
  }
  if (!finalState.log.some((l) => /GiveupBrand · 탭으로 혼용률 0\/6개 \(막힘 6\) — 남은 1개는 다음 차례/.test(l.msg || ""))) {
    fail("GiveupBrand 탭 포기 로그가 없다");
  }
  if (!finalState.log.some((l) => /SmokeBrand · 탭으로 혼용률 3\/4개 \(막힘 1\)/.test(l.msg || ""))) {
    fail("SmokeBrand 탭 결과 로그가 기대(3/4, 막힘 1)와 다르다");
  }

  // 상품 상세(1.7.24): 막힌 상품(봇 확인 화면)의 상세는 저장하지 않는다. 오버레이에는 상세 칸이 섞이지 않는다.
  if (rec.detailPosts.some((o) => Object.keys(o.body).some((u) => u.includes("/b/item/")))) fail("막힌 상품의 상세가 저장됐다");
  else ok("막힌 상품의 상세는 저장하지 않았다");
  if (rec.overlayPosts.some((o) => Object.values(o.body).some((v) => v && (v.desc || v.feat || v.imgs)))) fail("상세가 오버레이에 섞였다");

  if (rec.other.length) fail("예상 밖의 요청: " + rec.other.join(" | "));
}

console.log(`· 소요 ${secs()}`);
if (bad) { console.error(`\n확장 혼용률 보강 스모크 ${bad}건 실패`); process.exit(1); }
console.log("✅ 확장 혼용률 보강 스모크 통과 — fetch 우선 · 막힌 것만 탭 · 막힌 건 다음에 다시 · 6개에서 포기");
