#!/usr/bin/env node
// 무료 크롤링 엔진 비교 — 지금 막혀 있는 페이지를 엔진마다 열어 보고 무엇이 통하는지 잰다.
//
// 추측으로 도구를 바꾸지 않으려고 만든 실측 도구다. 저장은 하지 않는다(읽기만).
//
// 엔진(기본 순서 — 싼 것부터):
//   impit             브라우저 없이 브라우저의 TLS·HTTP2 지문으로 요청(Apify, curl_cffi 류)
//   site-api          사이트가 자기 화면을 그릴 때 쓰는 JSON 주소를 직접 읽는다(지금은 Zara·Shopify) — 상품만
//   wayback           웹 아카이브(archive.org)에 보관된 같은 상품 페이지를 읽는다 — 차단과 무관 · 상품만
//   playwright        지금 쓰는 헤드리스 크롬(기준선)
//   firefox           그냥 Playwright 파이어폭스(지문 주입 없음, 파이어폭스 자기 UA 그대로)
//   firefox-fp        파이어폭스 + fingerprint-injector 만(Crawlee 크롤러 없이) — 기본 목록에는 없음
//   patchright        자동화 흔적을 지운 Playwright 패치판
//   crawlee-chromium  Crawlee PlaywrightCrawler + 지문 생성·주입(fingerprint-suite) + 세션 풀
//   crawlee-firefox   같은 것을 파이어폭스로(Crawlee 문서가 차단 회피용으로 권하는 조합)
//   camoufox          탐지 회피용으로 고친 파이어폭스(camoufox-js)
//   server            Render 서버(야간 프리페치와 같은 길)에 그 브랜드의 목록을 물어본다 — 목록만 · 기본 목록에는 없음
//   ext:<이름>        유료 수집 서비스 시험 칸 — 저장소 비밀 SCRAPE_API_CONFIG 가 있을 때만 생긴다(없으면 조용히 빠짐).
//                     설정 모양은 scripts/access-evidence.mjs 의 loadExtConfigs 설명, 운영 안내는 docs/access-map.md.
//
// 엔진마다 따로 자식 프로세스로 돌린다. 11/24 실행에서 camoufox 가 시작하자마자
// 프로세스 전체가 segfault(exit 139)로 죽어, 앞서 끝난 네 엔진의 페이지별 결과까지
// 날아갔다. 이제는 한 엔진이 죽거나 멈춰도 그 엔진만 "엔진 실행 실패"로 적히고
// 다음 엔진이 돈다. 자식은 페이지 하나를 볼 때마다 결과 파일을 갱신하므로, 시간
// 제한(ENGINE_MIN)으로 끊겨도 거기까지 본 결과는 남는다.
//
// 페이지마다 '원인 근거'를 함께 남긴다(접근 지도 docs/access-map.md 의 근거): HTTP 상태 · 최종 주소 ·
// 제목 · 차단 주체를 가리는 응답 헤더 · 쿠키 이름(값은 버림) · 차단 화면 흔적 · 보호 업체 스크립트 요청 ·
// 목록이면 HTML 의 상품 링크 수와 실제 수집기(collector.js)가 잡은 상품 수. 판정 규칙은 access-evidence.mjs.
//
// env:
//   ENGINES     쉼표 구분(기본: 위 전부 · 'ext' 는 설정된 외부 API 전부 · '-' 는 엔진 없이 카탈로그만 훑기)
//   BRANDS      상품 페이지를 뽑을 브랜드(Worker 카탈로그에서 브랜드당 PER 개 · 'all' = 전부)
//   PER         브랜드당 상품 수(기본 3). 상품이 아닌 주소(카테고리·기획전)는 건너뛴다.
//   LISTINGS    목록 페이지 URL(쉼표 구분)
//   URLS        위 둘 대신 이 URL 만(쉼표 구분). 저장소 안 .json 파일 이름 하나면 TARGETS 로 읽는다.
//   TARGETS     대상 파일(JSON 배열 [{kind:'listing'|'product', brand, url, cat?}]). BRANDS 를 함께 주면 그 상품도 더한다.
//   ENGINE_MIN  엔진 하나에 주는 시간(분, 기본 12)
//   HOST_GAP_MS 같은 사이트에 연달아 요청할 때 최소 간격(기본 1500) — 예의 있는 방문
//   OUT         리포트 파일 이름(기본 try-engines-report.md)
//   RESULTS_JSON 주면 엔진별·페이지별 결과(근거 포함)를 이 JSON 파일에도 남긴다
//               (저장된 혼용률 점검 audit-stored-comp.mjs 와 접근 지도 build-access-map.mjs 가 읽는다)
//   DUMP        1이면 페이지마다 "NN% 섬유"가 나오는 곳을 모두 덤프한다(try-engines-dump.md).
//   MATCH       카탈로그에서 상품을 고를 때 이름·주소가 이 정규식에 맞는 것만(예: jacket|coat)
//   RENDER_URL  server 엔진이 물을 Render 주소(기본 운영 주소)
//   SCRAPE_API_CONFIG  외부 API 엔진 설정(JSON). 키는 로그·리포트·결과 JSON 어디에도 쓰지 않는다.
import { readFileSync, writeFileSync, renameSync, mkdtempSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir, constants as osConst } from "node:os";
import {
  looksLikeProduct, evidenceOf, identify, causeOf, cookieNamesFromSetCookie,
  loadExtConfigs, secretsOf, redact, buildExtRequest, readExtResponse,
} from "./access-evidence.mjs";

export { looksLikeProduct };

const SELF = fileURLToPath(import.meta.url);
const ROOT = join(dirname(SELF), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
const DEFAULT_ENGINES = "impit,site-api,wayback,playwright,firefox,patchright,crawlee-chromium,crawlee-firefox,camoufox";
const PER = Math.max(1, Number(process.env.PER) || 3);
const ENGINE_MS = Math.max(0.05, Number(process.env.ENGINE_MIN) || 12) * 60_000;
const MIN_TXT = `${Math.round(ENGINE_MS / 6000) / 10}분`;
const NAV_MS = 45_000;
const HOST_GAP_MS = Math.max(0, Number(process.env.HOST_GAP_MS ?? 1500));
const list = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);

// 추출 규칙은 worker 한 벌을 쓴다(enrich-comp-browser 와 같은 방식).
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
const slice = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i); return src.slice(i, j); };
const { compFromHtml, compFromText, compWindow } = new Function(slice(workerSrc, "const FIBRES = {", "function titleCase") + "\n return { compFromHtml, compFromText, compWindow };")();
// 야간 보강(enrich-comp.mjs)과 같은 순서로 읽는다: JSON-LD 의 소재가 있으면 그것, 없으면 본문.
// (JSON-LD 를 빼면 Loft 처럼 소재를 JSON-LD 에만 적는 사이트가 '소재 없음'으로 잘못 보인다)
const fromJsonLd = new Function(slice(workerSrc, "function fromJsonLd(html) {", "const FIBRES = {") +
  slice(workerSrc, "function titleCase(s) {", "// 페이지 제목") + "\n return fromJsonLd;")();
const DUMP = process.env.DUMP === "1";
const DUMP_KB = Math.max(50, Number(process.env.DUMP_KB) || 400);
const MATCH = process.env.MATCH ? new RegExp(process.env.MATCH, "i") : null;

// 목록 페이지는 야간 수집과 같은 수집기(크롬 확장 collector.js)로 센다 — "열렸는데 우리가 못 읽음"을 가리려고.
const collectorSrc = readFileSync(join(ROOT, "chrome-extension", "collector.js"), "utf8");
const COLLECTOR = `(async () => { ${collectorSrc}\n return await pageCollector(); })()`;

// 외부 API(유료 서비스 시험 칸) 설정. 문제는 이름만 말하고 값은 절대 찍지 않는다.
const EXT = loadExtConfigs(process.env.SCRAPE_API_CONFIG);
const EXT_SECRETS = EXT.configs.flatMap((c) => secretsOf(c));
const scrub = (s) => redact(s, EXT_SECRETS);

const CHALLENGE_RX = /access denied|pardon our interruption|are you a human|attention required|verify you are human|unusual traffic|press (and|&) hold|just a moment|enable javascript and cookies|request unsuccessful|_Incapsula_Resource|captcha-delivery|403 forbidden/i;
const FIBRE_RX = /\d{1,3}\s?%\s*(?:[A-Za-z]+\s)?(cotton|polyester|viscose|wool|linen|silk|nylon|polyamide|elastane|spandex|lyocell|modal|cashmere|acrylic|rayon|leather)/i;

// 덤프용: 앞뒤 어느 순서든 "NN% 섬유" / "섬유 NN%"
const DUMP_FIB = "cotton|polyester|viscose|wool|linen|silk|nylon|polyamide|elastane|spandex|lyocell|modal|cashmere|acrylic|rayon|leather|acetate|cupro|lycra|merino|hemp|polyurethane|alpaca|mohair";
const DUMP_RX_SRC = String.raw`\d{1,3}\s?%\s*(?:[A-Za-z™®]+\s){0,3}(?:` + DUMP_FIB + String.raw`)|(?:` + DUMP_FIB + String.raw`)(?:\s+[A-Za-z]+){0,2}\s*:?\s*\d{1,3}\s?%`;

// HTML 만 있을 때(아카이브·impit)의 덤프: 추출기가 본 창 + 보이는 글의 모든 자리 + 스크립트 속 소재 조각
function htmlDump(html) {
  const h = String(html || "");
  const visible = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ");
  // 추출기(compFromHtml)는 <nav>·<template> 을 빼고 본다 — window·groups 는 그와 똑같이 계산한다.
  // (HTML 글 자리는 메뉴까지 포함한 전체 글에서 찾는다 — 무엇이 빠졌는지 보이게)
  const forComp = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ");
  const win = compWindow(forComp);
  const hits = [];
  const rx = new RegExp(DUMP_RX_SRC, "gi");
  let m;
  while ((m = rx.exec(visible)) && hits.length < 15) hits.push(`@${m.index}: …${visible.slice(Math.max(0, m.index - 300), m.index + 300)}…`);
  const json = [];
  for (const sm of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    const body = sm[1];
    for (const k of body.matchAll(/"(?:composition|compositions|materials?|fabric|detailedComposition)"\s*:/gi)) {
      const piece = body.slice(Math.max(0, k.index - 80), k.index + 500);
      if (/\d{1,3}\s?%|percentage/i.test(piece)) json.push(piece.replace(/\s+/g, " "));
      if (json.length >= 6) break;
    }
    if (json.length >= 6) break;
  }
  return {
    // 상품 페이지 신호 — '정말 이 상품 페이지를 읽었나' 판정을 고칠 근거
    title: ((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1] || "").trim().slice(0, 120),
    signals: [/"@type"\s*:\s*\[?\s*"Product"/i.test(h) && "JSON-LD Product", /property=["']og:type["'][^>]*content=["']product/i.test(h) && "og:type product",
      /itemtype=["'][^"']*schema\.org\/Product/i.test(h) && "itemtype Product"].filter(Boolean).join(", "),
    head: visible.slice(0, 1200),
    window: win ? win.slice(0, 900) : "",
    groups: compFromText(win || forComp).map((c) => `${c.line || 0}:${c.material} ${c.percent}%`).join(", "),
    hits, json, visibleLen: visible.length,
  };
}

// 브라우저 페이지에서의 덤프: 위에 더해 DOM 위치(요소 경로·보이는지·가장 가까운 앞 제목)
async function domDump(page) {
  return page.evaluate((src) => {
    const FIB = new RegExp(src, "i");
    const desc = (el) => {
      const parts = [];
      for (let e = el, i = 0; e && e.nodeType === 1 && i < 8; e = e.parentElement, i++) {
        let s = e.tagName.toLowerCase();
        if (e.id) s += "#" + e.id.slice(0, 30);
        const c = (typeof e.className === "string" ? e.className : "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
        if (c.length) s += "." + c.join(".");
        parts.push(s);
      }
      return parts.reverse().join(" > ");
    };
    const vis = (el) => {
      if (!el.getClientRects().length) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none";
    };
    const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,dt,legend,[class*=title i],[class*=heading i],[class*=label i],[class*=header i]")];
    const nodes = [];
    const seen = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode()) && nodes.length < 20) {
      // 글이 span 여럿으로 쪼개진 경우를 위해 조상으로 세 칸까지 올라가 본다.
      let el = n.parentElement;
      for (let k = 0; k < 3 && el && !FIB.test(el.textContent || ""); k++) el = el.parentElement;
      if (!el || /^(SCRIPT|STYLE|NOSCRIPT|BODY|HTML)$/.test(el.tagName) || seen.has(el)) continue;
      const t = el.textContent || "";
      if (t.length > 1500 || !FIB.test(t)) continue;
      seen.add(el);
      let head = "";
      for (let i = heads.length - 1; i >= 0; i--) {
        const h = heads[i];
        if (h === el || h.contains(el) || el.contains(h)) continue;
        if (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) { head = (h.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100); break; }
      }
      let blk = el;
      for (let i = 0; i < 6 && blk.parentElement && (blk.textContent || "").length < 250; i++) blk = blk.parentElement;
      nodes.push({
        path: desc(el), visible: vis(el), head,
        hidden: !!el.closest("dialog,[role=dialog],[aria-hidden=true],template,[hidden],[inert]"),
        own: t.trim().replace(/\s+/g, " ").slice(0, 300),
        block: (blk.textContent || "").trim().replace(/\s+/g, " ").slice(0, 700),
      });
    }
    const body = (document.body && document.body.innerText) || "";
    const inner = [];
    const rx = new RegExp(src, "gi");
    let m;
    while ((m = rx.exec(body)) && inner.length < 12) inner.push(`@${m.index}: …${body.slice(Math.max(0, m.index - 300), m.index + 300).replace(/\s+/g, " ")}…`);
    return { nodes, inner, innerLen: body.length, url: location.href };
  }, DUMP_RX_SRC).catch((e) => ({ error: String(e.message || e).slice(0, 100) }));
}

// 추출 결과([{material,percent,line}])를 저장 형식 문자열로 — enrich-comp.mjs 의 asComp 와 같은 규칙.
function asComp(v) {
  if (!Array.isArray(v)) return String(v || "").trim();
  const lines = [];
  for (const c of v) { const n = c.line || 0; (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`); }
  return lines.filter(Boolean).map((l) => l.join(" / ")).join("\n");
}

// 한 페이지 결과 판정. kind=listing 이면 혼용률 대신 상품 수로 본다(5개 이상이면 'list').
function judge(status, title, html, err, kind = "product", cards = 0) {
  if (err) return { v: "err", note: String(err).split("\n")[0].slice(0, 70) };
  const text = String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  if (status >= 400 || CHALLENGE_RX.test(title + " " + text.slice(0, 1500))) return { v: "blocked", note: `HTTP ${status} ${String(title).slice(0, 40)}` };
  if (kind === "listing") return { v: cards >= 5 ? "list" : "open", note: `상품 ${cards}개 · 글 ${text.length}자` };
  let ld = {};
  try { ld = fromJsonLd(html) || {}; } catch (e) {}
  const fromLd = !!(ld.composition && ld.composition.length);
  const comp = fromLd ? ld.composition : compFromHtml(html);
  const c = Array.isArray(comp) ? comp.map((x) => `${x.material} ${x.percent}%`).join(" / ") : String(comp || "");
  // comp: 저장 형식 그대로(두 원단이면 줄바꿈) — 저장값과 견줄 때 쓴다(RESULTS_JSON).
  if (c) return { v: "comp", note: (fromLd ? "JSON-LD · " : "") + c.slice(0, 60), comp: asComp(comp), ...(fromLd ? { src: "jsonld" } : {}) };
  return { v: "open", note: `글 ${text.length}자` };
}

// ── 자식 공통: 페이지 종류 · 사이트별 간격 · 결과 만들기 ─────────────────
let KIND = new Map();   // url → 'product' | 'listing' (자식이 대상 파일에서 채운다)
const kindOf = (u) => KIND.get(u) || "product";
const lastHit = new Map();
async function politeWait(url) {
  let host = "";
  try { host = new URL(url).hostname; } catch (e) { return; }
  const wait = (lastHit.get(host) || 0) + HOST_GAP_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastHit.set(host, Date.now());
}
// raw: { status, title, html, finalUrl, headers, cookies, requests, collector, collectorSample, err }
function resultOf(url, raw) {
  const kind = kindOf(url);
  if (raw.err) {
    const r = judge(0, "", "", raw.err);
    if (raw.status || raw.finalUrl) r.ev = evidenceOf({ url, kind, ...raw, html: raw.html || "" });
    return r;
  }
  const ev = evidenceOf({ url, kind, ...raw });
  const htmlCards = Math.max(ev.productLinks || 0, ev.itemList || 0);
  // 목록: 브라우저는 수집기가 잡은 수로, 브라우저가 없는 엔진(impit)은 HTML 의 상품 링크 수로 판정한다.
  const r = { ...judge(raw.status, raw.title || ev.title, raw.html, "", kind, kind === "listing" ? (raw.collector ?? htmlCards) : 0), ev };
  if (kind === "listing") {
    r.cards = htmlCards;
    if (raw.collector != null) { r.collector = raw.collector; r.sample = (raw.collectorSample || []).slice(0, 3); }
    if (r.v !== "blocked") {
      r.note = (raw.collector != null ? `수집기 ${raw.collector}개 · ` : "") + `HTML 상품 링크 ${htmlCards} · 이미지 링크 ${ev.imgLinks || 0} · 글 ${ev.textLen}자`;
    }
  }
  return r;
}

// 브라우저 페이지: 보호 업체의 스크립트·확인 요청 주소를 따로 적어 둔다(차단 주체의 근거).
const VENDOR_REQ = /perimeterx|px-cdn|px-cloud|\/_px\/|captcha-delivery|datadome|challenges\.cloudflare|cdn-cgi\/challenge|kpsdk|149e9513-01fa|awswaf|_Incapsula_Resource|\/_sec\/cp_challenge|\/akam\/\d+\/|hcaptcha|recaptcha|queue-it/i;
function watchRequests(page) {
  const reqs = [];
  page.on("request", (q) => { const u = q.url(); if (reqs.length < 30 && VENDOR_REQ.test(u)) reqs.push(u); });
  return reqs;
}
async function cookieNames(page) {
  try { return [...new Set((await page.context().cookies()).map((c) => c.name))]; } catch (e) { return []; }
}

// 브라우저 페이지 공통(상품): 열고, 접힌 소재 탭을 펼치고, 소재가 그려질 때까지 최대 6초
async function readPage(page, url) {
  const reqs = watchRequests(page);
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_MS });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    for (const d of document.querySelectorAll("details")) d.open = true;
    const rx = /composition|material|fabric|content|details/i;
    for (const b of document.querySelectorAll('button,[role="button"],summary,[aria-expanded="false"]')) {
      const t = (b.textContent || "") + " " + (b.getAttribute("aria-label") || "");
      if (t.length < 80 && rx.test(t)) { try { b.click(); } catch (e) {} }
    }
  }).catch(() => {});
  await page.waitForFunction((src) => new RegExp(src, "i").test((document.body && document.body.innerText) || ""),
    FIBRE_RX.source, { timeout: 6000 }).catch(() => {});
  const html = await page.content();
  const dump = DUMP ? { ...htmlDump(html), dom: await domDump(page) } : undefined;
  return {
    status: resp ? resp.status() : 0, title: await page.title().catch(() => ""), html, dump,
    finalUrl: page.url(), headers: resp ? await resp.allHeaders().catch(() => ({})) : {},
    cookies: await cookieNames(page), requests: reqs,
  };
}

// 브라우저 페이지 공통(목록): 열고, 야간 수집과 같은 수집기를 첫 화면에서 한 번 돌린다(자동 스크롤 포함).
async function readListing(page, url) {
  const reqs = watchRequests(page);
  let resp;
  try {
    resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_MS });
    await page.waitForTimeout(2500);
  } catch (e) {
    if (!/Timeout/i.test(String((e && e.message) || e))) throw e;
    // 문서가 늦게 끝나는 사이트 — browser-collect 와 같이 'commit' 으로 한 번 더(헤더조차 안 오면 응답 없음)
    resp = await page.goto(url, { waitUntil: "commit", timeout: NAV_MS }).catch(() => null);
    if (!resp) throw new Error(`응답 없음(차단 의심) — 헤더조차 ${NAV_MS / 1000}초 안에 안 옴`);
    await page.waitForTimeout(9000);
  }
  const status = resp ? resp.status() : 0;
  let collector = null, sample = [];
  if (status < 400) {
    const res = await Promise.race([
      page.evaluate(COLLECTOR).catch(() => null),
      new Promise((r) => setTimeout(() => r(null), 60_000)),
    ]);
    if (res && Array.isArray(res.items)) {
      const items = res.items.filter((it) => it && it.productUrl);
      collector = items.length;
      sample = items.slice(0, 3).map((it) => it.productUrl);
    }
  }
  return {
    status, title: await page.title().catch(() => ""), html: await page.content().catch(() => ""),
    finalUrl: page.url(), headers: resp ? await resp.allHeaders().catch(() => ({})) : {},
    cookies: await cookieNames(page), requests: reqs, collector, collectorSample: sample,
  };
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function readAll(browserOrCtx, urls, put) {
  for (const url of urls) {
    await politeWait(url);
    const page = await browserOrCtx.newPage();
    try {
      const r = kindOf(url) === "listing" ? await readListing(page, url) : await readPage(page, url);
      put(url, { ...resultOf(url, r), ...(r.dump ? { dump: r.dump } : {}) });
    } catch (e) {
      put(url, resultOf(url, { err: e.message, finalUrl: page.url() !== "about:blank" ? page.url() : "" }));
    } finally { await page.close().catch(() => {}); }
  }
}

async function runPlainBrowser(mod, urls, put) {
  const { chromium } = await import(mod);
  const browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}),
    args: ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--disable-http2"],
  });
  const ctx = await browser.newContext(mod === "playwright" ? { userAgent: UA, locale: "en-US" } : { locale: "en-US" });
  await readAll(ctx, urls, put);
  await browser.close();
}

// 그냥 파이어폭스. 크롬 UA 를 덮어쓰지 않는다 — 파이어폭스 엔진에 크롬 UA 를 붙이면 지문이 어긋난다.
async function runFirefox(urls, put) {
  const { firefox } = await import("playwright");
  const browser = await firefox.launch();
  const ctx = await browser.newContext({ locale: "en-US" });
  await readAll(ctx, urls, put);
  await browser.close();
}

// 파이어폭스 + 지문 생성·주입을 크롤러 없이 컨텍스트에 바로 붙인다(enrich-comp-browser 의 firefox-fp 와 같은 코드).
// crawlee-firefox 의 효과가 이것만으로 나오는지 보려는 것.
async function runFirefoxFp(urls, put) {
  const { firefox } = await import("playwright");
  const { newInjectedContext } = await import("fingerprint-injector");
  const browser = await firefox.launch();
  const ctx = await newInjectedContext(browser, {
    fingerprintOptions: { browsers: ["firefox"], operatingSystems: ["windows", "macos"], devices: ["desktop"], locales: ["en-US"] },
    newContextOptions: { locale: "en-US" },
  });
  await readAll(ctx, urls, put);
  await browser.close();
}

async function runCrawlee(browserName, urls, put) {
  const { PlaywrightCrawler, Configuration } = await import("crawlee");
  const pw = await import("playwright");
  // 저장소를 메모리로 — 리포트 외에 파일을 남기지 않는다.
  const config = new Configuration({ persistStorage: false, purgeOnStart: true });
  const crawler = new PlaywrightCrawler({
    launchContext: { launcher: browserName === "firefox" ? pw.firefox : pw.chromium },
    browserPoolOptions: { useFingerprints: true },   // fingerprint-generator + fingerprint-injector
    useSessionPool: true,
    // 403 을 받아도 처리기에서 기록하도록 차단 코드 자동 처리를 끈다(비교가 목적).
    sessionPoolOptions: { blockedStatusCodes: [] },
    maxRequestRetries: 1,
    maxConcurrency: 2,
    navigationTimeoutSecs: NAV_MS / 1000,
    requestHandlerTimeoutSecs: 90,
    headless: true,
    async requestHandler({ page, request, response }) {
      const url = request.userData.url;
      let collector = null, sample = [];
      if (kindOf(url) === "listing") {
        const res = await page.evaluate(COLLECTOR).catch(() => null);
        if (res && Array.isArray(res.items)) { const it = res.items.filter((x) => x && x.productUrl); collector = it.length; sample = it.slice(0, 3).map((x) => x.productUrl); }
      } else {
        await page.evaluate(() => { for (const d of document.querySelectorAll("details")) d.open = true; }).catch(() => {});
        await page.waitForFunction((src) => new RegExp(src, "i").test((document.body && document.body.innerText) || ""),
          FIBRE_RX.source, { timeout: 6000 }).catch(() => {});
      }
      put(url, resultOf(url, {
        status: response ? response.status() : 0, title: await page.title().catch(() => ""), html: await page.content(),
        finalUrl: page.url(), headers: response ? await response.allHeaders().catch(() => ({})) : {},
        cookies: await cookieNames(page), collector, collectorSample: sample,
      }));
    },
    failedRequestHandler({ request }, error) {
      put(request.userData.url, resultOf(request.userData.url, { err: (error && error.message) || "failed" }));
    },
  }, config);
  await crawler.run(urls.map((url, i) => ({ url, uniqueKey: `${i}:${url}`, userData: { url } })));
}

async function runCamoufox(urls, put) {
  const { Camoufox } = await import("camoufox-js");
  const browser = await Camoufox({ headless: true, humanize: true });
  await readAll(browser, urls, put);
  await browser.close();
}

function setCookieOf(headers) {
  try {
    if (typeof headers.getSetCookie === "function") return cookieNamesFromSetCookie(headers.getSetCookie());
    return cookieNamesFromSetCookie(headers.get("set-cookie") || "");
  } catch (e) { return []; }
}
async function runImpit(urls, put) {
  const { Impit } = await import("impit");
  const impit = new Impit({ browser: "chrome", followRedirects: true, timeout: NAV_MS });
  for (const url of urls) {
    await politeWait(url);
    try {
      const r = await impit.fetch(url, { headers: { "Accept-Language": "en-US,en;q=0.9" } });
      const html = await r.text();
      put(url, resultOf(url, {
        status: r.status, title: (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1], html,
        finalUrl: r.url || url, headers: r.headers, cookies: setCookieOf(r.headers),
      }));
    } catch (e) { put(url, resultOf(url, { err: e.message })); }
  }
}

// 사이트가 자기 화면을 그릴 때 부르는 JSON 주소. HTML 페이지보다 방어가 느슨한 경우가 있다.
function apiUrlOf(url) {
  const u = new URL(url);
  // Zara: …-p01234567.html?v1=<상품 id> → /<나라>/<언어>/products-details?productIds=<id>&ajax=true
  if (/(^|\.)zara\.com$/.test(u.hostname) && u.searchParams.get("v1")) {
    const loc = u.pathname.split("/").filter(Boolean).slice(0, 2).join("/");
    return `${u.origin}/${loc}/products-details?productIds=${u.searchParams.get("v1")}&ajax=true`;
  }
  // Shopify: /products/<handle> → /products/<handle>.json
  const m = url.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
  if (m) return `${m[1]}/products/${m[2]}.json`;
  return "";
}
// JSON 안의 소재 표기를 사람이 읽는 글로 편다 — {"material":"cotton","percentage":"95%"} → "95% cotton"
function flattenComp(text) {
  const out = [];
  for (const m of String(text).matchAll(/"(?:material|name)"\s*:\s*"([A-Za-z ]{3,30})"\s*,\s*"percentage"\s*:\s*"?(\d{1,3})\s?%?"?/gi)) out.push(`${m[2]}% ${m[1]}`);
  for (const m of String(text).matchAll(/"percentage"\s*:\s*"?(\d{1,3})\s?%?"?\s*,\s*"(?:material|name)"\s*:\s*"([A-Za-z ]{3,30})"/gi)) out.push(`${m[1]}% ${m[2]}`);
  return out.join(", ");
}
async function runSiteApi(urls, put) {
  const { Impit } = await import("impit");
  const impit = new Impit({ browser: "chrome", followRedirects: true, timeout: NAV_MS });
  for (const url of urls) {
    const api = apiUrlOf(url);
    if (!api) { put(url, { v: "err", note: "이 사이트용 JSON 주소를 모름" }); continue; }
    await politeWait(url);
    try {
      const r = await impit.fetch(api, { headers: { Accept: "application/json", "Accept-Language": "en-US,en;q=0.9" } });
      const body = await r.text();
      const ev = evidenceOf({ url: api, finalUrl: r.url || api, status: r.status, html: body.slice(0, 5000), headers: r.headers, cookies: setCookieOf(r.headers) });
      if (r.status >= 400 || !/^\s*[\[{]/.test(body)) { put(url, { v: "blocked", note: `HTTP ${r.status} · JSON 아님`, ev }); continue; }
      const flat = flattenComp(body);
      const j = judge(r.status, "", `<p>${flat}</p><p>${body.replace(/<[^>]+>/g, " ").slice(0, 200000)}</p>`);
      put(url, { ...(j.v === "open" ? { v: "open", note: `JSON ${body.length}자 · 소재 못 찾음 · ${(body.match(/.{0,60}omposition.{0,120}/i) || [""])[0]}` } : j), ev });
    } catch (e) { put(url, judge(0, "", "", e.message)); }
  }
}

// 웹 아카이브. 상품의 소재는 바뀌지 않으므로 몇 달 전 보관본이어도 값은 같다.
async function runWayback(urls, put) {
  for (const url of urls) {
    try {
      const a = await (await fetch("https://archive.org/wayback/available?url=" + encodeURIComponent(url.split("?")[0]),
        { signal: AbortSignal.timeout(30000) })).json();
      const snap = a && a.archived_snapshots && a.archived_snapshots.closest;
      if (!snap || !snap.available) { put(url, { v: "err", note: "보관본 없음" }); continue; }
      // id_ = 아카이브가 덧붙이는 머리띠 없이 원본 그대로
      const raw = `https://web.archive.org/web/${snap.timestamp}id_/${url.split("?")[0]}`;
      const r = await fetch(raw, { signal: AbortSignal.timeout(45000) });
      const html = await r.text();
      const j = judge(r.status, (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1], html);
      put(url, { ...j, note: `${snap.timestamp.slice(0, 8)} 보관본 · ${j.note}`, ...(DUMP ? { dump: htmlDump(html) } : {}) });
    } catch (e) { put(url, judge(0, "", "", e.message)); }
  }
}

// Render 서버(야간 프리페치와 같은 길)에 그 브랜드의 목록을 물어본다. 서버는 자기 category-links 로
// 카테고리 URL 을 차례로 읽고, 실패한 URL 은 경고(warnings)에 남긴다 — 그 경고가 서버 쪽 근거다.
// 상품이 어느 URL 에서 왔는지는 서버가 알려 주지 않아, 같은 카테고리의 URL 들은 같은 수를 받는다.
async function runServer(urls, put) {
  const targets = JSON.parse(readFileSync(argOf("--targets"), "utf8"));
  const byUrl = new Map(targets.map((t) => [t.url, t]));
  let brands = [];
  for (let i = 0; i < 4 && !brands.length; i++) {
    try { brands = ((await (await fetch(RENDER + "/api/brands", { signal: AbortSignal.timeout(90_000) })).json()).brands) || []; }
    catch (e) { await new Promise((r) => setTimeout(r, 15_000)); }
  }
  const urlOf = new Map(brands.map((b) => [String(b.name).toLowerCase(), b.url]));
  const groups = new Map();
  for (const u of urls) {
    const b = String((byUrl.get(u) || {}).brand || "").toLowerCase();
    if (!groups.has(b)) groups.set(b, []);
    groups.get(b).push(u);
  }
  for (const [b, us] of groups) {
    const home = urlOf.get(b);
    if (!home) { for (const u of us) put(u, { v: "err", note: "서버 브랜드 목록에 없음" }); continue; }
    try {
      const q = "/api/products?new=1&tops=150&sweatshirts=150&shirts=150&dresses=150&pants=150&url=" + encodeURIComponent(home);
      const d = await (await fetch(RENDER + q, { signal: AbortSignal.timeout(240_000) })).json();
      const prods = (d.products || []).filter((p) => p && p.category !== "new" && p.productUrl);
      const warns = (d.warnings || []).map(String);
      for (const u of us) {
        const t = byUrl.get(u) || {};
        const n = prods.filter((p) => p.category === t.cat).length;
        const w = warns.filter((x) => x.includes(u));
        const st = (w.join(" ").match(/HTTP (\d{3})/) || [])[1];
        const v = w.length && !n ? (st && Number(st) >= 400 ? "blocked" : "open") : n >= 5 ? "list" : "open";
        put(u, { v, note: `서버 ${t.cat || "?"} ${n}개${w.length ? " · 경고: " + w.map((x) => x.replace(u, "").replace(/\s+at\s*$/, "")).join(" / ").slice(0, 160) : ""}`,
          cards: n, serverWarnings: w.slice(0, 4), ev: { status: st ? Number(st) : 0, markers: [], headers: {}, cookies: [] } });
      }
    } catch (e) { for (const u of us) put(u, { v: "err", note: "서버 응답 실패: " + String(e.message || e).slice(0, 60) }); }
  }
}

// 외부 API 엔진(유료 서비스 시험 칸). 요청 주소·헤더·키는 결과에 남기지 않는다 — 대상 주소와 판정만.
async function runExt(name, urls, put) {
  const cfg = EXT.configs.find((c) => c.name === name);
  if (!cfg) throw new Error("설정 없음");
  let n = 0;
  for (const url of urls) {
    if (n >= cfg.maxRequests) { put(url, { v: "err", note: `요청 상한 ${cfg.maxRequests}회에서 멈춤` }); continue; }
    n++;
    if (cfg.gapMs) await new Promise((r) => setTimeout(r, cfg.gapMs));
    try {
      const { url: reqUrl, init } = buildExtRequest(cfg, url);
      const r = await fetch(reqUrl, { ...init, signal: AbortSignal.timeout(cfg.timeoutSec * 1000) });
      const body = await r.text();
      const x = readExtResponse(cfg, r.status, body, (h) => r.headers.get(h));
      if (!x.ok) { put(url, { v: x.apiStatus >= 400 || x.upstream >= 400 ? "blocked" : "err", note: scrub(x.note), ev: { status: x.upstream || 0, markers: [], headers: {}, cookies: [] } }); continue; }
      const base = resultOf(url, { status: x.upstream || 200, html: x.html, finalUrl: url });
      put(url, JSON.parse(scrub(JSON.stringify({ ...base, note: `${x.note} · ${base.note || ""}` }))));
    } catch (e) { put(url, { v: "err", note: scrub(String((e && e.message) || e)).slice(0, 80) }); }
  }
}

const RUN = {
  playwright: (u, put) => runPlainBrowser("playwright", u, put),
  firefox: (u, put) => runFirefox(u, put),
  "firefox-fp": (u, put) => runFirefoxFp(u, put),
  patchright: (u, put) => runPlainBrowser("patchright", u, put),
  "crawlee-chromium": (u, put) => runCrawlee("chromium", u, put),
  "crawlee-firefox": (u, put) => runCrawlee("firefox", u, put),
  camoufox: (u, put) => runCamoufox(u, put),
  impit: (u, put) => runImpit(u, put),
  "site-api": (u, put) => runSiteApi(u, put),
  wayback: (u, put) => runWayback(u, put),
  server: (u, put) => runServer(u, put),
  // 격리가 제대로 되는지 확인하는 시험용 엔진(기본 목록에는 없다).
  "test-crash": async (u, put) => { put(u[0], { v: "open", note: "첫 페이지만 보고 죽음" }); process.kill(process.pid, "SIGSEGV"); },
  "test-hang": async (u, put) => { put(u[0], { v: "open", note: "첫 페이지만 보고 멈춤" }); await new Promise(() => setInterval(() => {}, 1000)); },
};
for (const c of EXT.configs) RUN[`ext:${c.name}`] = (u, put) => runExt(c.name, u, put);
// 페이지 종류마다 돌 엔진: 아카이브·사이트 JSON 은 상품만, 서버는 목록만.
const ONLY = { "site-api": "product", wayback: "product", server: "listing" };

// ── 자식: 엔진 하나만 돌리고 결과 파일을 페이지마다 갱신한다 ─────────────
const argv = process.argv.slice(2);
function argOf(k) { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : ""; }
if (argOf("--engine")) {
  const eng = argOf("--engine"), outPath = argOf("--out");
  const all = JSON.parse(readFileSync(argOf("--targets"), "utf8"));
  KIND = new Map(all.map((t) => [t.url, t.kind]));
  const urls = JSON.parse(readFileSync(argOf("--urls"), "utf8"));
  const out = { res: {}, error: "" };
  const flush = () => { writeFileSync(outPath + ".tmp", JSON.stringify(out)); renameSync(outPath + ".tmp", outPath); };
  flush();
  try {
    if (!RUN[eng]) throw new Error("알 수 없는 엔진");
    await RUN[eng](urls, (url, r) => { out.res[url] = r; flush(); });
  } catch (e) {
    out.error = scrub(String((e && e.message) || e).split("\n")[0]).slice(0, 120);
    console.log(`  !! ${eng} 실행 실패: ${out.error}`);
  }
  flush();
  process.exit(0);   // 브라우저가 남긴 핸들 때문에 안 끝나는 일이 없게
}

// ── 엔진 목록 ────────────────────────────────────────────────────────
for (const p of EXT.problems) console.log("외부 API 설정 문제(이 칸은 빠짐): " + p);
if (process.env.GITHUB_ACTIONS === "true") for (const s of EXT_SECRETS) console.log(`::add-mask::${s}`);
const extNames = EXT.configs.map((c) => `ext:${c.name}`);
let ENGINES = list(process.env.ENGINES || DEFAULT_ENGINES);
if (ENGINES.includes("-") || ENGINES.includes("none")) ENGINES = [];
ENGINES = ENGINES.flatMap((e) => (e === "ext" ? extNames : [e]));
if (!process.env.ENGINES || !/\bext\b|ext:/.test(process.env.ENGINES)) ENGINES.push(...extNames.filter((e) => !ENGINES.includes(e)));
ENGINES = ENGINES.filter((e, i, a) => a.indexOf(e) === i && (!e.startsWith("ext:") || extNames.includes(e)));

// ── 대상 ─────────────────────────────────────────────────────────
const targets = [];   // { kind: 'product'|'listing', brand, url, cat? }
const picks = [];     // 브랜드별 고르기 기록 — 리포트에 남긴다
const addTarget = (t) => { if (t && t.url && !targets.some((x) => x.url === t.url)) targets.push(t); };
let targetsFile = process.env.TARGETS || "";
if (!targetsFile && list(process.env.URLS).length === 1 && /^[\w./-]+\.json$/.test(list(process.env.URLS)[0]) && existsSync(resolve(ROOT, list(process.env.URLS)[0]))) targetsFile = list(process.env.URLS)[0];
if (targetsFile) {
  for (const t of JSON.parse(readFileSync(resolve(ROOT, targetsFile), "utf8"))) {
    if (!t || !t.url) continue;
    addTarget({ kind: t.kind === "listing" ? "listing" : "product", brand: t.brand || new URL(t.url).hostname, url: t.url, ...(t.cat ? { cat: t.cat } : {}) });
  }
}
if (!targetsFile && list(process.env.URLS).length) {
  for (const u of list(process.env.URLS)) addTarget({ kind: "product", brand: new URL(u).hostname, url: u });
} else if (!targetsFile || process.env.BRANDS) {
  const ALL = String(process.env.BRANDS || "").trim().toLowerCase() === "all";
  const want = list(process.env.BRANDS || "Zara,H&M,Massimo Dutti,Arket,&Other Stories,Lululemon,Chico's,Anthropologie,Free People,Joules,Patagonia,Addidas").map((s) => s.toLowerCase());
  const tq = "&token=" + encodeURIComponent(TOKEN);
  try {
    const cats = (await (await fetch(`${WORKER}/?catalogs=1${tq}`)).json()).list || [];
    for (const c of cats) {
      if (!ALL && !want.includes(String(c.brand || "").toLowerCase())) continue;
      const cat = await (await fetch(`${WORKER}/?catalog=${encodeURIComponent(c.site)}${tq}`)).json();
      const items = (cat.items || []).filter((p) => p && p.productUrl);
      let skippedBefore = 0, took = 0;
      const skippedEx = [];
      for (const p of items) {
        if (took >= PER) break;
        if (!looksLikeProduct(p.productUrl)) { skippedBefore++; if (skippedEx.length < 2) skippedEx.push(p.productUrl); continue; }
        if (MATCH && !MATCH.test(`${p.name || ""} ${p.productUrl}`)) continue;
        if (ENGINES.length) addTarget({ kind: "product", brand: c.brand, url: p.productUrl, name: p.name || "" });
        took++;
      }
      const nonAll = items.filter((p) => !looksLikeProduct(p.productUrl)).length;
      // 카테고리 URL(src)마다 몇 개를 저장했나 — 확장·헤드리스가 저장한 카탈로그에만 src 가 있다.
      const bySrc = {};
      for (const p of items) { const s = p.src || "(src 없음)"; bySrc[s] = (bySrc[s] || 0) + 1; }
      picks.push({ brand: c.brand, site: c.site, took, skippedBefore, nonAll, total: items.length, skippedEx, bySrc, updated: c.updated || c.at || "" });
    }
  } catch (e) { console.error("Worker 카탈로그 읽기 실패: " + e.message); }
  if (!ALL) for (const w of want) if (!picks.some((p) => String(p.brand).toLowerCase() === w)) picks.push({ brand: w, missing: true });
  if (!targetsFile) for (const u of list(process.env.LISTINGS || [
    "https://www.prana.com/women/tops.html",
    "https://www.whitehouseblackmarket.com/store/category/tops/cat210001",
    "https://www.chicos.com/store/category/dresses/cat40004",
    "https://veronicabeard.com/collections/tops",
  ].join(","))) addTarget({ kind: "listing", brand: new URL(u).hostname.replace(/^www\./, ""), url: u });
}
if (!targets.length && ENGINES.length) { console.error("대상 없음"); process.exit(1); }
console.log(`대상 ${targets.length}개(목록 ${targets.filter((t) => t.kind === "listing").length}) · 엔진 ${ENGINES.join(", ") || "없음"} · 엔진당 ${MIN_TXT}\n`);
for (const p of picks) {
  if (p.missing) console.log(`  · ${p.brand}: 카탈로그 없음`);
  else console.log(`  · ${p.brand}: ${p.took}개 고름 · 앞에서 상품 아님으로 건너뜀 ${p.skippedBefore} · 카탈로그 전체 ${p.nonAll}/${p.total}개가 상품 아님으로 보임`);
}

// 러너 정보 — 같은 사이트가 러너(IP)마다 다르게 답하므로, 어느 러너에서 잰 것인지 남긴다.
const META = { at: new Date().toISOString(), runId: process.env.GITHUB_RUN_ID || "", runner: process.env.RUNNER_NAME || "", ip: "" };
if (process.env.GITHUB_ACTIONS === "true") {
  try { META.ip = (await (await fetch("https://checkip.amazonaws.com", { signal: AbortSignal.timeout(10_000) })).text()).trim().replace(/\.\d+$/, ".x"); } catch (e) {}
}

// ── 엔진마다 자식 프로세스 ────────────────────────────────────────
// 같은 사이트를 연달아 두드리지 않게 사이트별로 번갈아 세운다.
function interleave(ts) {
  const byHost = new Map();
  for (const t of ts) { let h = ""; try { h = new URL(t.url).hostname; } catch (e) {} if (!byHost.has(h)) byHost.set(h, []); byHost.get(h).push(t); }
  const qs = [...byHost.values()], out = [];
  while (qs.some((q) => q.length)) for (const q of qs) if (q.length) out.push(q.shift());
  return out;
}
const work = mkdtempSync(join(tmpdir(), "try-engines-"));
const targetsPath = join(work, "targets.json");
writeFileSync(targetsPath, JSON.stringify(targets));
const results = {};   // engine → url → {v, note, ev, ...}
const runInfo = {};   // engine → 실행 상태 한 줄

function runChild(eng, urlsPath) {
  const outPath = join(work, `${eng.replace(/[^\w.-]/g, "_")}.json`);
  return new Promise((done) => {
    // 외부 API 설정(키)은 그 엔진의 자식에게만 넘긴다.
    const env = { ...process.env };
    if (!eng.startsWith("ext:")) delete env.SCRAPE_API_CONFIG;
    // 자기 프로세스 그룹으로 띄워, 시간 초과 때 브라우저 자식까지 한꺼번에 끈다.
    const child = spawn(process.execPath, [SELF, "--engine", eng, "--targets", targetsPath, "--urls", urlsPath, "--out", outPath],
      { stdio: ["ignore", "inherit", "inherit"], detached: true, env });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      try { process.kill(-child.pid, "SIGKILL"); } catch (e) { try { child.kill("SIGKILL"); } catch (e2) {} }
    }, ENGINE_MS);
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      // 정리: 같은 그룹에 남은 브라우저가 있으면 끈다.
      try { process.kill(-child.pid, "SIGKILL"); } catch (e) {}
      let out = { res: {}, error: "" };
      try { if (existsSync(outPath)) out = JSON.parse(readFileSync(outPath, "utf8")); } catch (e) {}
      const exit = code != null ? code : 128 + (osConst.signals[signal] || 0);
      done({ out, exit, signal, timedOut });
    });
  });
}

const kindByUrl = new Map(targets.map((t) => [t.url, t.kind]));
function finish(r, url) {
  const kind = kindByUrl.get(url) || "product";
  r.cause = causeOf(r, kind);
  if (r.ev && (r.v === "blocked" || ["rate-limit", "conn-drop", "timeout", "blocked"].includes(r.cause) || (r.ev.cookies || []).length || Object.keys(r.ev.headers || {}).length)) {
    const who = identify(r.ev, r.v === "blocked" || r.cause === "rate-limit");
    r.who = { by: who.by, confidence: who.confidence, why: who.why, protection: who.protection, cdn: who.cdn, platform: who.platform, signals: who.vendors.map((v) => `${v.vendor}: ${v.signals.join(", ")}`).slice(0, 6) };
  }
  return r;
}

for (const eng of ENGINES) {
  if (!RUN[eng]) { console.log(`알 수 없는 엔진: ${eng}`); continue; }
  const mine = interleave(targets.filter((t) => !ONLY[eng] || ONLY[eng] === t.kind)).map((t) => t.url);
  results[eng] = {};
  for (const t of targets) if (!mine.includes(t.url)) results[eng][t.url] = { v: "skip", note: "이 종류의 페이지는 안 봄", cause: "skip" };
  if (!mine.length) { runInfo[eng] = "대상 없음"; continue; }
  const urlsPath = join(work, `urls-${eng.replace(/[^\w.-]/g, "_")}.json`);
  writeFileSync(urlsPath, JSON.stringify(mine));
  const t0 = Date.now();
  console.log(`\n▶ ${eng} (${mine.length}쪽)`);
  const { out, exit, signal, timedOut } = await runChild(eng, urlsPath);
  const secs = Math.round((Date.now() - t0) / 1000);
  const seen = Object.keys(out.res || {}).length;
  let why = "";
  if (timedOut) why = `시간 초과(${MIN_TXT}) — 못 본 페이지`;
  else if (exit !== 0) why = `엔진 실행 실패: exit ${exit}${signal ? ` (${signal})` : ""}`;
  else if (out.error) why = `엔진 실행 실패: ${out.error}`;
  for (const u of mine) results[eng][u] = finish((out.res || {})[u] || { v: "err", note: why || "결과 없음" }, u);
  runInfo[eng] = (why ? `${why.replace(" — 못 본 페이지", "")} · ${seen}/${mine.length}쪽까지` : `정상 · ${mine.length}쪽`) + ` · ${secs}s`;
  const n = (v) => mine.filter((u) => results[eng][u].v === v).length;
  console.log(`${eng}: 소재 ${n("comp")} · 목록 ${n("list")} · 열림 ${n("open")} · 차단 ${n("blocked")} · 오류 ${n("err")} · ${runInfo[eng]}`);
  // 엔진 하나가 끝날 때마다 리포트를 써 둔다 — 시간 제한에 걸려도 그때까지의 결과가 남는다.
  writeReport(true);
  writeResults();
}
writeReport(false);
if (DUMP) writeDump();
writeResults();

function writeResults() {
  if (!process.env.RESULTS_JSON) return;
  // 덤프(dump)는 크므로 뺀다.
  const slim = {};
  for (const [e, byUrl] of Object.entries(results)) {
    slim[e] = {};
    for (const [u, r] of Object.entries(byUrl)) { const { dump, ...rest } = r || {}; slim[e][u] = rest; }
  }
  const text = scrub(JSON.stringify({ at: new Date().toISOString(), meta: META, engines: ENGINES, runInfo, targets, results: slim, catalogs: picks }, null, 1));
  writeFileSync(resolve(ROOT, process.env.RESULTS_JSON), text);
}
if (process.env.RESULTS_JSON) console.log("결과 JSON: " + process.env.RESULTS_JSON);

// ── 덤프(DUMP=1) ──────────────────────────────────────────────────
function writeDump() {
  const cap = DUMP_KB * 1024;
  let md = `# 소재 자리 덤프 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
  md += `try-engines DUMP=1. 페이지마다 "NN% 섬유"가 나오는 자리를 모두 적었다. 읽기만 했다.\n`;
  md += `- window: 추출기(compFromHtml)가 보이는 글에서 compFromText 에 넘긴 창(앞 900자)\n- groups: 그 창에서 나온 줄:섬유\n`;
  md += `- dom: 요소 경로 · 화면에 보이는지(vis) · 숨김 조상(hidden) · 가장 가까운 앞 제목(head)\n\n`;
  let full = false;
  for (const t of targets) {
    for (const e of ENGINES) {
      const r = (results[e] || {})[t.url];
      if (!r || !r.dump) continue;
      const d = r.dump;
      let part = `## ${t.brand} · ${e} · ${r.note || ""}\n\n${t.url}${t.name ? ` (${t.name})` : ""}\n\n`;
      part += `- 보이는 글 ${d.visibleLen}자 · groups: \`${d.groups || "-"}\`\n`;
      part += `- 제목: ${d.title || "-"} · 상품 신호: ${d.signals || "없음"}\n`;
      part += `- 글 앞부분: ${(d.head || "").slice(0, d.window ? 400 : 1200)}\n`;
      part += "\n**window**\n\n```\n" + (d.window || "(없음)") + "\n```\n";
      if (d.dom && d.dom.nodes) {
        part += `\n**dom** (innerText ${d.dom.innerLen}자${d.dom.url && d.dom.url !== t.url ? ` · 최종 주소 ${d.dom.url}` : ""})\n\n`;
        for (const n of d.dom.nodes) {
          part += `- vis=${n.visible ? 1 : 0} hidden=${n.hidden ? 1 : 0} head=「${n.head}」\n  - path: \`${n.path}\`\n  - own: ${n.own}\n  - block: ${n.block}\n`;
        }
        if (d.dom.inner && d.dom.inner.length) part += `\n**innerText 자리**\n\n${d.dom.inner.map((x) => "- " + x).join("\n")}\n`;
      } else if (d.dom && d.dom.error) part += `\n(dom 덤프 실패: ${d.dom.error})\n`;
      if (d.hits && d.hits.length) part += `\n**HTML 글 자리**\n\n${d.hits.map((x) => "- " + x).join("\n")}\n`;
      if (d.json && d.json.length) part += `\n**스크립트 JSON 조각**\n\n${d.json.map((x) => "- `" + x.replace(/`/g, "'") + "`").join("\n")}\n`;
      part += "\n";
      if (md.length + part.length > cap) { md += `\n(크기 제한 ${DUMP_KB}KB — 이후 생략)\n`; full = true; break; }
      md += part;
    }
    if (full) break;
  }
  writeFileSync(resolve(ROOT, process.env.DUMP_OUT || "try-engines-dump.md"), md);
  console.log("덤프: " + (process.env.DUMP_OUT || "try-engines-dump.md") + ` (${Math.round(md.length / 1024)}KB)`);
}

// ── 리포트 ────────────────────────────────────────────────────────
function writeReport(partial) {
  const ICON = { comp: "✅", list: "✅", open: "🟡", blocked: "⛔", err: "❌", skip: "➖" };
  const engs = ENGINES.filter((e) => results[e]);
  const cnt = (e, v, kind) => targets.filter((t) => (!kind || t.kind === kind) && (results[e][t.url] || {}).v === v).length;
  const nProd = targets.filter((t) => t.kind === "product").length, nList = targets.length - nProd;
  let md = `# 무료 크롤링 엔진 비교 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
  if (partial) md += `> ⏳ 진행 중 — ${engs.length}/${ENGINES.length}개 엔진까지의 중간 결과입니다.\n\n`;
  md += `GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.\n`;
  md += `엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.\n\n`;
  if (META.runId || META.ip) md += `- 실행 ${META.runId || "-"} · 러너 ${META.runner || "-"} · 나가는 IP ${META.ip || "-"} · ${META.at.slice(0, 16)}Z\n\n`;
  md += `✅ 소재까지 읽음(상품) · 상품 5개 이상(목록) · 🟡 페이지는 열림(소재 없음 / 목록 상품 5개 미만) · ⛔ 차단 · ❌ 오류 · ➖ 이 엔진은 그 종류를 안 봄\n\n`;
  md += `| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 ${nProd}쪽 ✅·🟡 | 목록 ${nList}쪽 ✅·🟡 | 실행 |\n|---|---:|---:|---:|---:|---:|---:|---|\n`;
  for (const e of engs) {
    md += `| ${e} | ${cnt(e, "comp") + cnt(e, "list")} | ${cnt(e, "open")} | ${cnt(e, "blocked")} | ${cnt(e, "err")} | ` +
      `${cnt(e, "comp", "product")}·${cnt(e, "open", "product")} | ${cnt(e, "list", "listing")}·${cnt(e, "open", "listing")} | ${runInfo[e] || ""} |\n`;
  }
  if (picks.length) {
    md += `\n## 대상 고르기\n\n브랜드당 상품 ${PER}개. 카탈로그 앞쪽의 카테고리·기획전 주소는 상품이 아니라서 건너뛰었습니다.\n\n`;
    md += `| 브랜드 | 고름 | 앞에서 건너뜀 | 카탈로그 중 상품 아님 | 건너뛴 예 |\n|---|---:|---:|---:|---|\n`;
    for (const p of picks) {
      md += p.missing ? `| ${p.brand} | 카탈로그 없음 | | | |\n`
        : `| ${p.brand} | ${p.took} | ${p.skippedBefore} | ${p.nonAll}/${p.total} | ${p.skippedEx.map((u) => u.replace(/^https?:\/\/[^/]+/, "")).join(" · ")} |\n`;
    }
  }
  const cell = (t, e) => {
    const r = results[e][t.url] || {};
    const icon = ICON[r.v] || "·";
    if (t.kind === "listing" && (r.v === "list" || r.v === "open")) return `${icon} ${r.collector != null ? r.collector : r.cards ?? ""}`;
    if (r.v === "blocked" && r.ev && r.ev.status) return `${icon} ${r.ev.status}`;
    return icon;
  };
  md += `\n## 페이지별\n\n목록 칸의 숫자는 수집기(브라우저)·서버가 잡은 상품 수, impit 은 HTML 안의 상품 링크 수, ⛔ 옆 숫자는 HTTP 상태.\n\n`;
  md += `| 구분 | 브랜드 | ${engs.join(" | ")} |\n|---|---|${engs.map(() => ":-:").join("|")}|\n`;
  for (const t of targets) {
    md += `| ${t.kind === "listing" ? "목록" : "상품"} | [${t.brand}](${t.url}) | ${engs.map((e) => cell(t, e)).join(" | ")} |\n`;
  }
  // 원인 근거 — 막힌 곳·이상한 곳만
  const rows = [];
  for (const t of targets) for (const e of engs) {
    const r = results[e][t.url] || {};
    if (!r.cause || ["ok", "skip"].includes(r.cause)) continue;
    const ev = r.ev || {};
    const sig = [ev.title && `제목 "${ev.title.slice(0, 40)}"`, ev.redirect && `이동 ${ev.redirect}`, (ev.markers || []).length && `흔적 ${ev.markers.join("·")}`,
      r.who && r.who.signals.length && r.who.signals.join(" / ")].filter(Boolean).join(" · ");
    rows.push(`| ${t.kind === "listing" ? "목록" : "상품"} | ${t.brand} | ${e} | ${r.cause} | ${ev.status || ""} | ${r.who && r.who.by ? `${r.who.by} (${r.who.confidence})` : ""} | ${sig.replace(/\|/g, "/").slice(0, 260)} | ${t.url.replace(/^https?:\/\//, "").slice(0, 70)} |`);
  }
  if (rows.length) {
    md += `\n## 원인 근거(성공이 아닌 칸만)\n\n원인 어휘: blocked(차단 화면·403) · rate-limit(429) · conn-drop(접속을 끊음) · timeout · geo(지역 이동·배송 불가 화면) · dead(404·첫 화면으로 튕김) · shell(HTML 에 상품 없음 — 스크립트가 그림) · no-cards(열렸는데 상품 카드 없음) · selector(이미지 링크는 많은데 수집기 0) · no-comp(상품 페이지는 열렸는데 혼용률 못 읽음) · no-archive(보관본 없음) · maintenance · login · error.\n\n`;
    md += `차단 주체는 응답의 흔적으로만 정했습니다 — 높음: 차단 화면 자체에 그 업체 흔적 · 중간: 차단 응답에 그 업체 쿠키·헤더·스크립트 · 낮음: CDN 헤더만.\n\n`;
    md += `| 구분 | 브랜드 | 엔진 | 원인 | HTTP | 차단 주체(신뢰도) | 근거 | 주소 |\n|---|---|---|---|---:|---|---|---|\n` + rows.join("\n") + "\n";
  }
  md += `\n<details><summary>사유</summary>\n\n`;
  for (const t of targets) {
    md += `- ${t.brand} — ${t.url}\n`;
    for (const e of engs) { const r = results[e][t.url] || {}; md += `  - ${e}: ${ICON[r.v] || "·"} ${String(r.note || "").replace(/\n/g, " ")}${r.sample && r.sample.length ? ` · 예 ${r.sample[0]}` : ""}\n`; }
  }
  md += `\n</details>\n`;
  writeFileSync(resolve(ROOT, process.env.OUT || "try-engines-report.md"), scrub(md));
  if (!partial) console.log("\n리포트: " + (process.env.OUT || "try-engines-report.md"));
}
