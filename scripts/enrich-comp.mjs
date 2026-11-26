#!/usr/bin/env node
// 야간 보강 — 저장된 카탈로그에서 엑셀 항목(혼용률·컬러웨이)이 빈 상품의 페이지를 읽어 채운다.
//
// 왜 밤에 하나: 혼용률은 상품 페이지에만 있는데, 스캔하는 순간에 읽으면 상품 수만큼
// 사용자가 기다린다. 혼용률은 한 번 뽑으면 바뀌지 않는 값이므로 여기서 미리 채워 두면
// 보드 스캐너는 저장값을 붙이기만 한다(접속 0회).
//
// 추출은 AI 없이 한다: ① Shopify /products/<handle>.json ② schema.org JSON-LD
// ③ 본문 텍스트의 "60% Cotton" 패턴. 규칙은 worker/fabric-extractor.js 의 블록을
// 그대로 떼어 와 실행한다 — 복사본을 만들면 한쪽만 고쳐지는 사고가 난다.
//
// 봇 차단(확장 담당) 브랜드는 직접 접속이 403이라 리더 프록시(r.jina.ai)로 우회한다.
// 그래도 안 되는 상품은 남겨 두면 확장 1.7 이 실사용 PC에서 채운다(이중 안전망).
//
// env: WORKER_URL, WORKER_TOKEN, PER_BRAND(브랜드당 상한, 기본 800), TOTAL(전체 상한, 기본 40000),
//      NEED_FIELDS(목표 항목, 기본 comp,color), RETRY_DAYS(빈손 재시도 간격, 기본 5)
//      DRY=1 (읽기만 하고 Worker 에 아무것도 쓰지 않는다 — 리포트는 enrich-comp-dry-report.md)
//      BRANDS(쉼표로 나눈 브랜드 이름, 대소문자 무시 — 이 브랜드만 돈다. 비우면 전부)
//      WAYBACK=0 (아카이브 층 끄기), WAYBACK_MAX(한 실행 조회 상한, 기본 250 · DRY 는 600),
//      WAYBACK_PER_BRAND(브랜드당 조회 상한, 기본 40), WAYBACK_RETRY_DAYS(보관본 없던 상품을
//      다시 묻기까지, 기본 30), WAYBACK_API · WAYBACK_WEB · CATEGORY_LINKS_URL(테스트용 주소 바꾸기)
// 예약 실행은 workflow_dispatch inputs 가 비어 있어 이 기본값이 그대로 쓰인다 —
// 작게 잡으면 매일 조금씩만 채우다 끝나지 않는다. 하룻밤에 전부 도는 값으로 둔다.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { urlGuard, urlKey, archivePageCheck, archivedOriginal, archivedTimestamp, samePage } from "./wayback-guard.mjs";
import { guardRun, flagText } from "./comp-guard.mjs";
import { detailOf, compFromPartsJson, detailRecord } from "./detail-core.mjs";
import { detailFlags, detailApply, mergeDetails } from "./detail-guard.mjs";
import { ruleVersion, colorVersion } from "./rule-version.mjs";
import { colorFromTitle } from "./title-color.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const TOKEN = process.env.WORKER_TOKEN || "hsfabriclinker";
// 채울 목표 항목. 상품 페이지를 한 번 열면 넷 다 나오므로 함께 두는 편이 효율적이다.
// 무엇을 '다 찼다'로 볼지 = 어느 상품의 페이지를 열지. 여기에 컬러를 넣으면
// 혼용률은 이미 있고 컬러만 없는 상품에도 페이지를 열게 되고, 그만큼 혼용률이
// 빈 상품에 손이 못 간다. 혼용률이 1순위이므로 기본은 comp 하나다.
//
// 컬러를 잃는 게 아니다 — 페이지를 한 번 열면 enrichOf 가 네 항목을 모두 뽑고
// 저장도 그대로 한다. 목표에서 뺀다는 건 "컬러 때문에 페이지를 열지는 않는다"는
// 뜻일 뿐, 여는 김에 나오는 컬러는 똑같이 채운다.
const FIELDS = (process.env.NEED_FIELDS || "comp").split(",").map((s2) => s2.trim()).filter(Boolean);
// 못 찾은 상품을 며칠 뒤에 다시 시도할지. 사이트가 정보를 안 적으면 아무리 읽어도 안 나온다.
const RETRY_DAYS = Math.max(1, Number(process.env.RETRY_DAYS) || 5);
// 혼용률은 있는데 컬러만 빈 상품을 며칠에 한 번 다시 열지. 컬러는 2순위라 길게 둔다.
const COLOR_RETRY_DAYS = Math.max(1, Number(process.env.COLOR_RETRY_DAYS) || 30);
// 재시도 창을 무시하고 빈 항목을 전부 다시 읽는다. 평소엔 켜지 않는다 — 사이트가
// 안 적는 값을 매번 다시 읽게 되기 때문이다. 다만 추출 규칙이 좋아졌거나 예전에
// 일시적으로 실패한 뒤에는, 창에 갇힌 상품이 전부 '시도 안 함' 상태로 굳는다.
// (진단 표본 112개 중 58개가 "지금 읽으면 나온다"였다 — 그게 이 스위치의 이유다)
const RETRY_ALL = process.env.RETRY_ALL === "1";
// 성과 없는 브랜드를 한 실행에 몇 개까지만 다시 볼지. 0 이면 제한하지 않는다.
const BARREN_CAP = Math.max(0, Number(process.env.BARREN_CAP ?? 30));
const PER_BRAND = Math.max(1, Number(process.env.PER_BRAND) || 800);
// 한 브랜드 안에서 동시에 읽을 상품 페이지 수. 전부 같은 사이트로 가므로
// 여기를 무작정 올리면 429 를 부른다 — 전체 속도는 BRAND_POOL 로 올린다.
const PAGE_POOL = Math.max(1, Number(process.env.PAGE_POOL) || 8);
const TOTAL = Math.max(1, Number(process.env.TOTAL) || 40000);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const tok = "&token=" + encodeURIComponent(TOKEN);

// ── 측정용 실행(DRY=1) ─────────────────────────────────────────────
// 상품 페이지·아카이브·Worker 를 읽는 것은 평소와 똑같이 하고, 결과를 합쳐 '저장했다면
// 무엇이 바뀌었을지'까지 센다. 다만 Worker 에는 아무것도 쓰지 않는다 — 오버레이 저장·
// 검색 인덱스 재구축을 건너뛰고, 리포트도 다른 파일(enrich-comp-dry-report.md)에 쓴다.
// 이 스크립트가 Worker 에 쓰는 길은 POST 두 곳(store=overlay, store=index)뿐이고 GET 은
// 전부 읽기다(?catalogs · ?catalog · ?comps · ?comp — ?comp 는 페이지를 읽어 돌려줄 뿐 KV 에
// 쓰지 않는다). 그래도 나중에 누가 쓰기를 하나 더 붙일 수 있으므로, DRY 에서는 fetch 자체를
// 감싸 GET/HEAD 가 아닌 요청은 보내기 전에 막는다.
const DRY = process.env.DRY === "1";
if (DRY) {
  const realFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return Promise.reject(new Error(`DRY=1 — ${method} 요청을 막음: ${String(input && input.url || input).slice(0, 120)}`));
    }
    return realFetch(input, init);
  };
}
// 브랜드 이름 비교용 — "Chico's"·"H&M"·"&Other Stories" 처럼 기호가 섞인 이름을 그대로 적어도
// 맞도록 글자·숫자만 남겨 비교한다.
const normBrand = (s2) => String(s2 || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
const BRANDS = String(process.env.BRANDS || "").split(",").map(normBrand).filter(Boolean);
// 측정 실행은 실행 번호를 붙인 파일에도 쓴다 — 두 측정을 나란히 돌려도 한쪽이 다른 쪽을 덮지 않게(DRY_TAG 가 있을 때만 — 워크플로가 실행 번호를 준다).
const REPORT_FILE = DRY ? (process.env.DRY_TAG ? `enrich-comp-dry-${process.env.DRY_TAG}.md` : "enrich-comp-dry-report.md") : "enrich-comp-report.md";

// ── 한 사이트에 정중하게 ─────────────────────────────────────────────
// HOST_GAP_MS: 같은 호스트로 가는 요청 사이 최소 간격(ms). 기본 0(야간 그대로) — 측정 실행(DRY)은 워크플로가 1000 을 준다.
// 429: 어떤 호스트든 429 를 한 번 받으면 이 실행에서는 그 호스트에 더 묻지 않는다(야간에도). 그 뒤의 상품은 시도 시각을
//      찍지 않고 남겨 다음 실행이 읽는다 — '막힘'으로 적어 재시도 창(5일)에 가두지 않는다.
// WORKER_BYPASS=0: Worker 우회(?comp)를 끈다. Worker 는 같은 상품 주소를 직접 두 번·리더로 한 번 더 열어서, 측정 실행이
//      상품 주소당 요청을 3번 이하(평 fetch · impit)로 묶으려면 꺼야 한다. 야간은 켠다(기본).
const HOST_GAP_MS = Math.max(0, Number(process.env.HOST_GAP_MS) || 0);
const WORKER_BYPASS = process.env.WORKER_BYPASS !== "0";
const hostOf = (u) => { try { return new URL(u).hostname; } catch (e) { return ""; } };
const hostNext = new Map();
const stop429 = new Map();   // 호스트 → 429 를 받은 주소
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function hostSlot(url) {
  const h = hostOf(url);
  if (stop429.has(h)) throw new Error("STOP429 " + h);
  if (!HOST_GAP_MS || !h) return;
  const at = Math.max(Date.now(), hostNext.get(h) || 0);
  hostNext.set(h, at + HOST_GAP_MS);
  if (at > Date.now()) await pause(at - Date.now());
  if (stop429.has(h)) throw new Error("STOP429 " + h);
}
function note429(url, status) {
  if (status !== 429) return;
  const h = hostOf(url);
  if (h && !stop429.has(h)) { stop429.set(h, url); console.log(`  !! ${h} 가 429(요청 과다) — 이 실행에서는 이 사이트에 더 묻지 않는다`); }
}

// ── worker 의 추출 블록을 그대로 실행(단일 소스 유지) ─────────────────────
const workerSrc = readFileSync(join(ROOT, "worker/fabric-extractor.js"), "utf8");
function slice(startMark, endMark) {
  const i = workerSrc.indexOf(startMark);
  const j = workerSrc.indexOf(endMark, i);
  if (i < 0 || j < 0) throw new Error(`worker 블록을 찾지 못함: ${startMark}`);
  return workerSrc.slice(i, j);
}
const compFromText = new Function(
  slice("const FIBRES = {", "function titleCase") + "\n return compFromText;",
)();
// 본문 16000자 밖·페이지 JSON 안까지 보는 판(compWindow 포함).
const compFromHtml = new Function(
  slice("const FIBRES = {", "function titleCase") + "\n return compFromHtml;",
)();
// compFromText/compFromHtml 은 [{material,percent}] 를 돌려준다. 그대로 저장하면
// String() 이 걸려 '[object Object],[object Object]' 가 들어간다 — 반드시 여기서 문자열로.
// 한 옷에 원단이 둘이면 항목에 line 번호가 달려 온다 — 줄로 나눠 담는다.
const asComp = (v) => {
  if (!Array.isArray(v)) return String(v || "").trim();
  const lines = [];
  for (const c of v) {
    const n = c.line || 0;
    (lines[n] = lines[n] || []).push(`${c.material} ${c.percent}%`);
  }
  return lines.filter(Boolean).map((l) => l.join(" / ")).join("\n");
};
// 엑셀 열을 여는 기준은 "채워졌나"가 아니라 "옳은가"다 — 판정도 worker 와 한 벌.
const { validComp, validColor } = new Function(
  slice("const COMP_ITEM_RX", "// ── 페이지 HTML 전체에서 혼용률") +
  "\n return { validComp, validColor };",
)();
// 엑셀 열을 여는 기준선과 최종 목표.
const GATE = 95, GOAL = 99;
// fromJsonLd 는 titleCase 를 쓰므로 두 블록을 이어 붙인다.
const colorFromHtml = new Function(
  slice("const COLOR_JUNK", "function titleCase") + "\n return colorFromHtml;",
)();
// 섬유 이름 → 대표 이름(worker 의 FIBRES) — 아카이브 보관본이 '혼용률 여러 벌(목록)'인지 셀 때 쓴다.
const FIBRE_MAP = new Function(
  slice("const FIBRES = {", "function titleCase") + "\n return FIBRES;",
)();
const fromJsonLd = new Function(
  slice("function fromJsonLd(html) {", "const FIBRES = {") +
  slice("function titleCase(s) {", "// 페이지 제목") + "\n return fromJsonLd;",
)();

// ── 추출 규칙 판(rv) — scripts/rule-version.mjs 머리말. 읽었는데 비었던 상품은 판이 바뀌면 재시도 창과 무관하게 한 번 더 연다.
const RULE_V = ruleVersion();
// 컬러 규칙 판(cv) — 컬러가 절반도 안 찬 브랜드에서, 컬러가 빈 상품은 판이 바뀌면 컬러 재시도 창(30일)과 무관하게 한 번 더 연다.
const COLOR_V = colorVersion();

// ── 측정 실행의 근거 글 — 뽑은 값이 페이지의 어느 글에서 왔나(DRY 리포트의 표본 칸) ──────────────
// 값의 첫 항목("Cotton 60%")을 페이지 글에서 다시 찾아 앞뒤를 잘라 보여 준다. 추출기와 따로 찾으므로 사람이 맞는지 볼 수 있다.
function evidenceOf(src, comp) {
  const first = String(comp || "").split(/\n| \/ /)[0].trim();
  const m = first.match(/^(.+) (\d{1,3})%$/);
  if (!m || !src) return "";
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keys = Object.keys(FIBRE_MAP).filter((k) => FIBRE_MAP[k] === m[1]).sort((a, z) => z.length - a.length).map(esc);
  const alt = (keys.length ? keys : [esc(m[1])]).join("|");
  const rx = new RegExp(`(?<![\\d.])${m[2]}\\s*(?:%|percent)[^%]{0,40}?(?:${alt})|(?:${alt})[^%\\d]{0,30}?${m[2]}\\s*%`, "i");
  const h = String(src);
  const vis = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ");
  const raw = h.replace(/\\u003c/gi, "<").replace(/\\u003e/gi, ">").replace(/\\u0026/gi, "&").replace(/\\"/g, '"').replace(/\\\//g, "/")
    .replace(/<[^>]+>/g, " ").replace(/\\[nrt]/g, " ").replace(/\s+/g, " ");
  for (const [where, t] of [["화면 글", vis], ["페이지 JSON", raw]]) {
    const x = t.match(rx);
    if (x) return `${where}: …${t.slice(Math.max(0, x.index - 90), x.index + x[0].length + 110).trim()}…`;
  }
  return "";
}

const _unusedCompOfJsonLd = (html) => {
  try {
    const ld = fromJsonLd(html);
    if (ld.composition && ld.composition.length) {
      return ld.composition.map((c) => `${c.material} ${c.percent}%`).join(" / ");
    }
  } catch (e) {}
  return "";
};

// ── impit: 브라우저 없이 크롬의 TLS 지문으로 요청 ───────────────────────
// 평 fetch(Node)는 TLS 지문이 브라우저와 달라 Whitestuff·J.Crew 같은 사이트가 '직접차단'으로 돌려보낸다
// (11/24 보강: Whitestuff 직접차단 76개 — 같은 날 impit 은 표본 3/3 을 읽었다, docs/access-map.md).
// 그래서 평 fetch 가 막히거나 봇 확인 화면이면 impit 으로 한 번 더 연다. 설치돼 있지 않으면(로컬·단위 테스트) 이 층은 꺼진다.
// IMPIT_MODULE 로 다른 모듈을 넣을 수 있다(테스트가 가짜 impit 을 넣는다). IMPIT=0 이면 끈다.
let impitClient = null;
if (process.env.IMPIT !== "0") {
  try {
    const mod = await import(process.env.IMPIT_MODULE || "impit");
    impitClient = new mod.Impit({ browser: "chrome", followRedirects: true, timeout: 30000 });
  } catch (e) { impitClient = null; }
}
const IMPIT_ON = !!impitClient;
async function getImpit(url) {
  await hostSlot(url);
  const r = await impitClient.fetch(url, { headers: { "Accept-Language": "en-US,en;q=0.9" } });
  if (r.status >= 400) { note429(url, r.status); throw new Error("HTTP " + r.status); }
  return r.text();
}

// ── 상품 상세(설명·디테일·사진 전부 …) ───────────────────────────────
// 페이지를 여는 김에 함께 뽑아 detail:<site> 에 따로 저장한다(Worker README · docs/field-map.md).
// DETAIL_BACKFILL=1 이면 혼용률이 이미 찬(=예전엔 다시 열 일이 없던) 상품도 상세가 없으면 3차로 연다 — 남은 예산·시간 안에서.
const DETAIL_BACKFILL = process.env.DETAIL_BACKFILL === "1";
const DETAIL_RETRY_MS = Math.max(1, Number(process.env.DETAIL_RETRY_DAYS) || 30) * 24 * 3600 * 1000;
// 3차를 멈출 시각 — 워크플로 제한 시간(110분) 전에 리포트·인덱스를 쓸 여유를 남긴다.
const STOP_AT = Date.now() + Math.max(5, Number(process.env.TIME_MIN) || 95) * 60_000;

async function get(url, accept, timeoutMs = 20000) {
  await hostSlot(url);
  const r = await fetch(url, {
    headers: { "user-agent": UA, accept: accept || "text/html,*/*;q=0.8", "accept-language": "en-US,en;q=0.9" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!r.ok) { note429(url, r.status); throw new Error("HTTP " + r.status); }
  return r.text();
}

// 빈 배열([])도 truthy 라 그대로 쓰면 "아무것도 못 찾았는데 성공"으로 판정된다.
// 그 탓에 Shopify 상품은 첫 경로에서 곧장 반환돼 페이지·우회 경로를 아예 안 탔다.
const val = (v) => (Array.isArray(v) ? v.length > 0 : !!String(v || "").trim());
const has = (o) => !!o && (val(o.comp) || val(o.color) || val(o.sizes) || val(o.price));

// 받은 HTML 이 '상품 페이지를 실제로 읽은 것'인가. 아니면 소재가 없다고 결론 내릴 수 없다.
const CHALLENGE_RX = /access denied|pardon our interruption|are you a human|attention required|verify you are human|unusual traffic|press (and|&) hold|just a moment|enable javascript and cookies|request unsuccessful|incapsula incident/i;
function realPage(html) {
  const s = String(html || "");
  const title = (s.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1];
  // 화면에 보이는 글. 스크립트·스타일을 걷어 낸 것이다.
  const visible = s.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  // 차단 문구는 제목과 화면 글에서만 찾는다. 원본 HTML 에서 찾으면 PerimeterX·Incapsula 로
  // 보호되는 '정상' 상품 페이지가 머리의 <script src=…perimeterx…/_Incapsula_Resource> 나
  // 다국어 문구 묶음("Access denied") 때문에 통째로 차단으로 분류된다. 글 없이 iframe 만
  // 띄우는 캡차(DataDome·Incapsula)는 아래 글 길이 기준에서 걸린다.
  if (CHALLENGE_RX.test(title) || CHALLENGE_RX.test(visible.slice(0, 3000))) return false;
  // JSON-LD Product 나 og:type product 가 있으면 상품 페이지다.
  if (/"@type"\s*:\s*"Product"|property=["']og:type["'][^>]*content=["']product/i.test(s)) return true;
  // 그 외에는 화면에 보이는 글이 어느 정도 있어야 한다. 스크립트로만 그리는 껍데기는 수백 자에 그친다.
  return visible.length >= 600;
}

// ── 이 상품 페이지를 정말 읽었나(none 판정) 시작 — enrich-comp-browser.mjs 가 이 구간을 떼어 쓴다
// realPage 는 '차단 화면이 아니다'까지만 본다. 소재가 없다(none)는 결론은 그보다 강한 근거가
// 있어야 한다 — none 은 엑셀에 '정보 없음'으로 나가고 그 상품을 한동안 다시 안 보기 때문이다.
//
// 11/24 실측: Patagonia 상품 페이지는 fetch·크롬으로 열면 글 1,017자짜리 껍데기만 온다(600자는
// 넘는다). 그 껍데기를 '읽었다'로 쳐서 남은 167개가 전부 none 이 됐는데, 파이어폭스로 열면
// 같은 상품에서 혼용률이 나온다. 그래서 none 은 "이 상품의 본문이 그려진 페이지"일 때만 적는다:
//   · 카탈로그의 상품명이 있으면 — 그 이름의 낱말 대부분(60% 이상)이 화면 글에 있어야 한다.
//     제목(<title>)만으로는 안 된다. 껍데기도 제목은 갖고 있다.
//   · 상품명이 없으면 — 상품 신호(JSON-LD Product · og:type product · schema.org/Product)와
//     화면 글 600자 이상.
// 아니면 '못 읽음'으로 센다(차단과 같이) — none 을 적지 않는다.
const NAME_STOP = new Set(["the", "and", "with", "for", "in", "of", "a", "an", "to", "by", "new", "women", "womens",
  "men", "mens", "s", "x", "de", "la", "le", "et", "en"]);
function nameWords(name) {
  return String(name || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 2 && !NAME_STOP.has(w));
}
function productRead(html, name) {
  const s = String(html || "");
  const visible = s.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<title[\s\S]*?<\/title>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#0?39;|&apos;|&rsquo;/gi, "'");
  const words = nameWords(name);
  if (words.length) {
    const hay = " " + nameWords(visible).join(" ") + " ";
    const hit = words.filter((w) => hay.includes(" " + w + " ")).length;
    return hit / words.length >= 0.6;
  }
  const signal = /"@type"\s*:\s*\[?\s*"Product"|property=["']og:type["'][^>]*content=["']product|itemtype=["'][^"']*schema\.org\/Product/i.test(s);
  return signal && visible.replace(/\s+/g, " ").trim().length >= 600;
}
// ── 이 상품 페이지를 정말 읽었나(none 판정) 끝

// 한 상품의 네 항목(혼용률·컬러·사이즈·가격). 실패는 null — 이유는 세어서 리포트로.
async function enrichOf(url, stat, o = {}, wbCtx = { used: 0 }, name = "") {
  if (stop429.has(hostOf(url))) return { skip429: true };
  // ① Shopify JSON — 가장 싸고 정확. variants/options 에 사이즈·컬러·가격이 구조화돼 있다.
  const m = url.match(/^(https?:\/\/[^/]+).*?\/products\/([^/?#]+)/i);
  let shopPr = null;
  if (m) {
    // .js(재고 available·가격 센트·이미지 전부)를 먼저, 안 되면 .json(가격 문자열·body_html). 둘 다 공개 JSON 이다.
    try { const pj = JSON.parse(await get(`${m[1]}/products/${m[2]}.js`, "application/json", 12000)); if (pj && Array.isArray(pj.variants)) shopPr = pj; } catch (e) {}
    if (!shopPr) { try { const j = JSON.parse(await get(`${m[1]}/products/${m[2]}.json`, "application/json", 12000)); shopPr = (j && j.product) || null; } catch (e) {} }
    try {
      const pr = shopPr;
      if (pr) {
        // 컬러·사이즈·가격은 상세 추출기(dtFromShopify)가 .js·.json 둘 다에서 같은 규칙으로 읽는다.
        const d = detailOf("", url, pr);
        const out = {
          comp: asComp(compFromText(String(pr.body_html || pr.description || "").replace(/<[^>]+>/g, " "))),
          // 컬러 옵션이 없으면(컬러마다 따로 된 상품 — Boden) 이름 꼬리의 컬러(dtTitleColor).
          color: (d.colors || []).slice(0, 4).join(" / ") || d.color || "",
          sizes: (d.sizes || []).slice(0, 30).join(", "),
          price: d.price || "",
          priceOrig: d.priceOrig || "",
          det: detailRecord(d),
        };
        // 혼용률까지 나왔으면 여기서 끝 — 단, 디테일 글머리표·본문 칸은 페이지에만 있는 사이트가 많아
        // 상세가 비면(설명·디테일 둘 다 없음) 페이지도 연다.
        if (DRY && out.comp) { out.src = "Shopify JSON"; out.ev = evidenceOf(String(pr.body_html || pr.description || ""), out.comp); }
        if (out.comp && (out.det.desc || out.det.feat)) { stat.shopify++; return out; }
        if (out.comp || has(out)) { stat.shopify++; var partial = out; }
      }
    } catch (e) {}
  }
  // ② 페이지 직접 → JSON-LD → 본문.
  let html = "";
  let readOk = false;
  let bv = "";   // 이번에 막힌 읽기 방식(오버레이 bv) — impit 이 생긴 뒤 아직 impit 으로 안 본 상품을 가린다
  try { html = await get(url); readOk = realPage(html); } catch (e) { html = ""; }
  // 평 fetch 가 막혔거나 봇 확인 화면이면 impit(크롬 TLS 지문)으로 한 번 더.
  if (!readOk && IMPIT_ON) {
    try { const h2 = await getImpit(url); if (realPage(h2)) { html = h2; readOk = true; stat.impit = (stat.impit || 0) + 1; } } catch (e) {}
    if (!readOk) bv = "fetch,impit";
  }
  if (!readOk && !html) stat.blocked++;
  // 200 으로 왔어도 봇 확인 화면이거나 내용이 스크립트로만 그려지는 빈 껍데기면
  // '읽었다'가 아니다. 예전엔 이걸 읽은 것으로 쳐서 '사이트 미표기(none)'로 적었다 —
  // Zara 500 · H&M 743 · Massimo Dutti 596 이 그렇게 '정보 없음'으로 분류됐지만,
  // 진짜 크롬 보강 기록에서는 같은 브랜드가 100% 차단이었다.
  if (html && !readOk) { stat.blocked++; html = ""; }
  // 차단 화면은 아니지만 이 상품의 본문이 그려지지 않은 껍데기(Patagonia 1,017자) — 소재가 없다고
  // 결론 내릴 수 없다. 아래에서 none 대신 '못 읽음'으로 돌리고, 아카이브도 물어본다.
  const shell = readOk && !productRead(html, name);
  if (html) {
    let ld = {};
    try { ld = fromJsonLd(html); } catch (e) {}
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
    // 상품 상세 — 이 상품의 본문이 그려진 페이지일 때만(껍데기의 글은 다른 상품·사이트 공통 글이다).
    const d = shell ? {} : detailOf(html, url, shopPr);
    // JSON-LD 소재는 옳을 때만 먼저(옳지 않으면 본문으로 — Buck Mason 'Cotton - With Double The 100%').
    // Massimo Dutti 형(소재가 페이지 JSON parts/components 에만)은 본문·글에서 못 찾았을 때만.
    const ldComp = (ld.composition && ld.composition.length && validComp(asComp(ld.composition))) ? asComp(ld.composition) : "";
    const pageComp = ldComp ? "" : (asComp(compFromHtml(html)) || asComp(compFromText(text)));
    const partsComp = ldComp || pageComp || shell ? "" : asComp(compFromPartsJson(html, url));
    const out = {
      comp: ldComp || pageComp || partsComp,
      // 색은 JSON-LD 에 없는 경우가 더 많다 — 페이지의 색상 선택 옵션에서도 읽는다.
      // 마지막으로 제목 "<상품명> in <컬러> | <브랜드>" — White Stuff·The Upside 는 컬러를 제목에만 적는다(scripts/title-color.mjs).
      color: ld.color || colorFromHtml(html) || d.color || (shell ? "" : colorFromTitle(html, url)) || "",
      sizes: (ld.sizes && ld.sizes.length ? ld.sizes : (d.sizes || [])).slice(0, 30).join(", "),
      price: ld.price || d.price || "",
      priceOrig: ld.price_original || d.priceOrig || "",
    };
    if (!shell) out.det = detailRecord(d);
    if (DRY && out.comp) { out.src = ldComp ? "JSON-LD" : pageComp ? "본문" : "페이지 JSON(parts)"; out.ev = evidenceOf(html, out.comp); }
    if (has(out)) { stat.page++; return merge(out, typeof partial === "undefined" ? null : partial); }
    // 혼용률·컬러·가격은 없어도 설명·디테일이 나왔으면 그것만이라도 넘긴다(아래 none 판정은 그대로).
    if (out.det && (out.det.desc || out.det.feat)) var detOnly = out.det;
  }
  // 여기까지 왔으면 페이지에서 아무것도 못 얻었다. 껍데기였으면 세고, 무엇이 왔는지 몇 개 남긴다.
  if (shell) {
    stat.shell++;
    if (shellEx.length < 12) {
      const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1];
      const vis = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      shellEx.push({ url, name, head: (String(title).trim() + " · " + vis).slice(0, 200) });
    }
  }
  // ③ Worker 우회 — GitHub Actions IP 는 많은 쇼핑몰에서 403 이지만 Cloudflare IP 는
  //    통과하는 경우가 많다. Worker 안에서 Shopify JSON → 직접 → 리더까지 다시 시도한다.
  let viaWorker = null;
  if (WORKER_BYPASS) try {
    const r = await fetch(WORKER + "/?comp=" + encodeURIComponent(url) + tok, {
      signal: AbortSignal.timeout(20000),
    });
    const j = await r.json();
    if (has(j)) {
      stat.worker++;
      viaWorker = merge(j, typeof partial === "undefined" ? null : partial);
      // 새 Worker 는 상세(desc·feat·imgs …)도 돌려준다 — 예전 Worker 면 빈 값이다.
      const wd = detailRecord(j);
      if (Object.keys(wd).length) viaWorker.det = { ...((partial && partial.det) || {}), ...wd };
    }
    else stat.noData++;
  } catch (e) { stat.fail++; }
  if (DRY && viaWorker && viaWorker.comp && !viaWorker.src) { viaWorker.src = "Worker 우회"; viaWorker.ev = "(Worker 가 읽음 — 이 실행은 페이지 글을 갖고 있지 않다)"; }
  // ④ 웹 아카이브 — 지금 페이지를 진짜로 못 읽었고(차단·봇 확인·빈 껍데기) 앞 경로에서
  //    혼용률이 안 나왔을 때만. 소재는 시간이 지나도 안 바뀌므로 몇 달 전 보관본이어도
  //    값이 같다. 가격·사이즈·재고는 바뀌므로 보관본에서는 혼용률·컬러만 받는다.
  //    Shopify JSON 이나 페이지를 읽었는데 소재가 없던 상품은 '사이트가 안 적는' 쪽이라 묻지 않는다.
  if ((!readOk || shell) && typeof partial === "undefined" && !(viaWorker && validComp(asComp(viaWorker.comp)))) {
    const w = await waybackOf(url, stat, o, wbCtx);
    if (w && w.comp) {
      if (!viaWorker) return w;
      // 우회가 지금 페이지에서 가격·컬러를 읽어 왔으면 그건 살리고 혼용률만 보관본에서.
      return { ...viaWorker, comp: w.comp, color: viaWorker.color || w.color, via: "wayback", wd: w.wd, wt: w.wt };
    }
    if (w && w.wt) {
      if (viaWorker) viaWorker.wt = w.wt;
      else return { blocked: true, wt: w.wt, ...(bv ? { bv } : {}) };
    }
  }
  if (viaWorker) return viaWorker;
  // 페이지는 멀쩡히 읽었는데 소재 표기가 없었다면 그건 '아직 못 구한 것'이 아니라
  // '사이트가 안 적는 것'이다. 엑셀에서 '확인 필요'와 다르게 보여 줘야 하므로
  // 그 사실을 남긴다 — 차단이면 readOk 가 false 라 표시하지 않는다.
  if (typeof partial === "undefined") {
    if (readOk && !shell) return { none: true, ...(typeof detOnly !== "undefined" ? { det: detOnly } : {}) };
    return { blocked: true, ...(bv ? { bv } : {}) };
  }
  return partial;
}

// ── 웹 아카이브(archive.org) 층 ─────────────────────────────────────
// 큰 브랜드(Zara·Arket·Reformation·Mango …)는 데이터센터 IP 를 통째로 막지만, 웹 아카이브에
// 보관된 '같은 상품 주소'의 예전 페이지에는 혼용률이 그대로 있는 경우가 많다(11/24 실측).
// 이미 있는 보관본만 읽는다 — 보관을 새로 요청하는 'Save Page Now' 는 절대 부르지 않는다.
//
// archive.org 는 무료 공공 서비스라 정중하게 쓴다: 동시 2개 · 약 4초 간격(분당 15회) · 이 저장소를 밝히는
// User-Agent(개인 연락처 없음) · 한 실행 WAYBACK_MAX · 브랜드당 WAYBACK_PER_BRAND 상한 ·
// 429/5xx 에 물러서고, 연달아 실패하면 이 실행에서는 층을 끈다.
//
// 오버레이에 남기는 것:
//   via: "wayback"  혼용률이 보관본에서 왔다(컬러도 그 보관본에서 왔을 수 있다)
//   wd:  "20260712" 그 보관본의 날짜
//   wt:  <ms>       보관본을 물어봤다(없었거나 거부됐거나) — WAYBACK_RETRY_DAYS 동안 다시 안 묻는다
// 나중에 진짜 페이지에서 같은 혼용률을 읽으면 via·wd 를 지운다(확인됨). 다른 값이 나오면 지금
// 페이지 값으로 바꾸고 via·wd 를 지운 뒤, 두 값을 리포트('혼용률이 엇갈린 상품')에 남긴다 —
// 보관본은 몇 달 전의 다른 판일 수 있고 지금 페이지가 지금 파는 상품이다(applyLiveComp, 크롬 보강도 같은 규칙).
const WAYBACK = process.env.WAYBACK !== "0";
const WAYBACK_API = (process.env.WAYBACK_API || "https://archive.org/wayback/available").replace(/\/+$/, "");
const WAYBACK_WEB = (process.env.WAYBACK_WEB || "https://web.archive.org/web").replace(/\/+$/, "");
const numEnv = (k, d) => { const v = process.env[k]; const n = Number(v); return v != null && v !== "" && Number.isFinite(n) ? n : d; };
// DRY 는 측정용이라 상한을 넉넉히 둔다(저장을 안 하므로 다음 밤 예산을 뺏지도 않는다).
// 상한 계산: 상품 하나에 요청 2~3회 × 4초 ≈ 10초. 250개면 약 40분 — 110분 실행의 다른 경로와 나눠 쓴다.
const WAYBACK_MAX = Math.max(0, numEnv("WAYBACK_MAX", DRY ? 600 : 250));
const WAYBACK_PER_BRAND = Math.max(0, numEnv("WAYBACK_PER_BRAND", 40));
const WAYBACK_RETRY_MS = Math.max(1, numEnv("WAYBACK_RETRY_DAYS", 30)) * 24 * 3600 * 1000;
// 요청 사이 간격. 11/24 측정 실행(45303192170)에서 1초 간격(분당 약 40회)으로 5분쯤 지나자
// archive.org 가 429 없이 접속 자체를 끊었다("fetch failed" 연속) — IP 단위로 막는 것으로 보인다.
// 분당 15회(4초)로 낮춘다.
const WAYBACK_GAP_MS = Math.max(0, numEnv("WAYBACK_GAP_MS", 4000));
const WAYBACK_BACKOFF_MS = Math.max(1, numEnv("WAYBACK_BACKOFF_MS", 5000)); // 429/5xx 뒤 첫 대기
// 접속이 끊기면(fetch failed) 막힌 것일 공산이 커서 더 길게 쉰다: 30초 → 60초 → 120초.
const WAYBACK_NETERR_MS = Math.max(1, numEnv("WAYBACK_NETERR_MS", 30000));
const WAYBACK_FAILS = Math.max(1, numEnv("WAYBACK_FAILS", 4));              // 연속 실패 몇 번에 끄나
const WB_UA = "rack-catalog-enrich (github.com/choosingceo-taek/miro-image-link-exporter)";
const CATEGORY_LINKS_URL = process.env.CATEGORY_LINKS_URL ||
  (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "") + "/category-links.json";
const wb = {
  used: 0, inflight: 0, nextAt: 0, fails: 0, off: false, offWhy: "",
  calls: 0, r429: 0, r5xx: 0, neterr: 0, withQuery: 0, ms: 0,
  reasons: {}, examples: {},
};
const wbWaiters = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// 동시 2개 · 시작 간격 WAYBACK_GAP_MS. 429 를 받으면 nextAt 을 밀어 전체가 함께 쉰다.
async function wbSlot() {
  while (wb.inflight >= 2) await new Promise((r) => wbWaiters.push(r));
  wb.inflight++;
  const at = Math.max(Date.now(), wb.nextAt);
  wb.nextAt = at + WAYBACK_GAP_MS;
  if (at > Date.now()) await sleep(at - Date.now());
}
function wbRelease() { wb.inflight--; const r = wbWaiters.shift(); if (r) r(); }
function wbNote(reason, brand, url, extra) {
  wb.reasons[reason] = (wb.reasons[reason] || 0) + 1;
  const ex = (wb.examples[reason] = wb.examples[reason] || []);
  // DRY 는 가드를 판단하려는 실행이라 예시를 더 많이 남긴다.
  if (ex.length < (DRY ? 25 : 5)) ex.push({ brand, url, extra: extra || "" });
}
// 아카이브에 GET 한 번. 429·5xx·네트워크 오류는 물러섰다가 두 번까지 다시 해 본다.
// 연속 실패가 WAYBACK_FAILS 번이면 이 실행에서는 층을 끈다(throw).
async function wbGet(url, asJson) {
  let last = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (wb.off) throw new Error("아카이브 층 꺼짐: " + wb.offWhy);
    await wbSlot();
    // 자리를 기다리는 사이 다른 요청이 층을 껐을 수 있다 — 그러면 보내지 않는다.
    if (wb.off) { wbRelease(); throw new Error("아카이브 층 꺼짐: " + wb.offWhy); }
    let wait = 0;
    const t0 = Date.now();
    try {
      wb.calls++;
      const r = await fetch(url, {
        headers: { "user-agent": WB_UA, accept: asJson ? "application/json" : "text/html,*/*;q=0.8" },
        redirect: "follow", signal: AbortSignal.timeout(asJson ? 30000 : 45000),
      });
      if (r.status === 429 || r.status >= 500) {
        if (r.status === 429) wb.r429++; else wb.r5xx++;
        const ra = Number(r.headers.get("retry-after"));
        try { await r.arrayBuffer(); } catch (e) {}
        last = new Error("HTTP " + r.status);
        wait = Math.max(Number.isFinite(ra) ? ra * 1000 : 0, WAYBACK_BACKOFF_MS * 2 ** wb.fails);
      } else {
        const body = asJson ? await r.json().catch(() => null) : await r.text();
        wb.fails = 0;
        return { status: r.status, url: r.url, body };
      }
    } catch (e) {
      wb.neterr++;
      last = e;
      wait = WAYBACK_NETERR_MS * 2 ** wb.fails;
    } finally {
      wb.ms += Date.now() - t0;
      wbRelease();
    }
    wb.fails++;
    if (wb.fails >= WAYBACK_FAILS) {
      if (!wb.off) {
        wb.off = true;
        wb.offWhy = `연속 실패 ${wb.fails}회(마지막: ${String((last && last.message) || last)})`;
        console.log(`  !! 웹 아카이브 층을 이 실행에서 끈다 — ${wb.offWhy}`);
      }
      throw last;
    }
    wait = Math.min(wait, 120000);
    wb.nextAt = Math.max(wb.nextAt, Date.now() + wait);   // 전체가 함께 쉰다
    await sleep(wait);
  }
  throw last;
}

// 이 실행에서 쓰는 카테고리 URL 목록(Render 의 category-links.json). 못 읽으면 주소 규칙만 쓴다.
let categorySet = null;
const curBrand = new Map();   // productUrl → 브랜드 이름(아카이브 예시 기록용)

// 한 상품의 보관본에서 혼용률·컬러를 읽는다. 돌려주는 것:
//   { comp, color, via:"wayback", wd, wt }  찾음
//   { wt }                                   물어봤지만 못 씀(보관본 없음·거부) — 30일 동안 안 묻는다
//   null                                     묻지 않음(꺼짐·상한·최근에 물음·주소 거부) 또는 일시 오류
async function waybackOf(url, stat, o, ctx) {
  if (!WAYBACK || wb.off) return null;
  const brand = curBrand.get(url) || "";
  if (o && o.wt && Date.now() - o.wt < WAYBACK_RETRY_MS) { stat.wbSkip++; return null; }
  const g = urlGuard(url, categorySet);
  if (!g.ok) { stat.wbUrl++; wbNote("주소: " + g.reason, brand, url); return null; }
  if (wb.used >= WAYBACK_MAX || ctx.used >= WAYBACK_PER_BRAND) { stat.wbSkip++; return null; }
  wb.used++; ctx.used++;
  const reject = (reason, extra) => { stat.wbReject++; wbNote(reason, brand, url, extra); return { wt: Date.now() }; };
  try {
    // 쿼리 없이 먼저 묻는다(보관본은 대개 쿼리 없는 주소로 쌓인다). 없으면 쿼리 그대로 한 번 더 —
    // Zara(?v1=)·Reformation(?dwvar_)처럼 쿼리가 붙은 주소로만 보관된 경우가 있다.
    const full = url.split("#")[0];
    const bare = full.split("?")[0];
    let snap = null, target = bare;
    for (const cand of full !== bare ? [bare, full] : [bare]) {
      const a = await wbGet(`${WAYBACK_API}?url=${encodeURIComponent(cand)}`, true);
      const c = a.body && a.body.archived_snapshots && a.body.archived_snapshots.closest;
      if (c && c.available !== false && c.timestamp) { snap = c; target = cand; break; }
    }
    if (!snap) { stat.wbNone++; wbNote("보관본 없음", brand, url); return { wt: Date.now() }; }
    if (target !== bare) wb.withQuery++;
    if (snap.status && !/^2/.test(String(snap.status))) return reject("보관본이 리다이렉트·오류", `status ${snap.status}`);
    // id_ = 아카이브가 덧붙이는 머리띠 없이 원본 그대로
    const r = await wbGet(`${WAYBACK_WEB}/${snap.timestamp}id_/${target}`, false);
    if (r.status >= 400) return reject("보관본 열기 실패", `HTTP ${r.status}`);
    const orig = archivedOriginal(r.url);
    if (orig && !samePage(orig, target)) return reject("다른 주소로 넘어간 보관본", orig.slice(0, 160));
    const html = String(r.body || "");
    if (!realPage(html)) return reject("보관본도 차단·빈 화면");
    const chk = archivePageCheck(html, FIBRE_MAP);
    if (!chk.ok) return reject(chk.reason, JSON.stringify(chk.signals));
    let ld = {};
    try { ld = fromJsonLd(html); } catch (e) {}
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
    const comp = (ld.composition && ld.composition.length && validComp(asComp(ld.composition)))
      ? asComp(ld.composition) : (asComp(compFromHtml(html)) || asComp(compFromText(text)));
    if (!validComp(comp)) return reject("보관본에 혼용률 없음", comp ? `뽑힌 값 "${comp.slice(0, 60)}"` : "");
    const color = ld.color || colorFromHtml(html) || "";
    const ts = archivedTimestamp(r.url) || String(snap.timestamp);
    stat.wayback++;
    wbNote("찾음", brand, url, `${ts.slice(0, 8)} · ${comp.replace(/\n/g, " | ")}${target !== bare ? " · 쿼리 포함 주소" : ""}`);
    // 가격·사이즈·정가는 일부러 싣지 않는다 — 보관본 시점의 값이라 지금과 다르다.
    return { comp, color: validColor(color) ? color : "", via: "wayback", wd: ts.slice(0, 8), wt: Date.now(), arcOnly: true,
      ...(DRY ? { src: `보관본 ${ts.slice(0, 8)}`, ev: evidenceOf(html, comp) } : {}) };
  } catch (e) {
    stat.wbErr++;
    wbNote("아카이브 오류", brand, url, String((e && e.message) || e).slice(0, 120));
    return null;   // 일시 오류 — 시각을 안 찍어 다음 실행이 다시 묻는다
  }
}
// ── 혼용률 출처·none 표시 규칙 시작 — enrich-comp-browser.mjs 가 이 구간을 떼어 쓴다(validComp 를 넘겨받음)
const sameComp = (a, b) => {
  const n = (x) => String(x || "").toLowerCase().split(/\s*\/\s*|\n/).map((t) => t.trim()).filter(Boolean).sort().join("/");
  return !!a && n(a) === n(b);
};
// none 을 누가 적었나(nv). 쉼표로 이은 읽기 방식 묶음 — fetch(평 fetch) · chromium(크롬·patchright) · firefox.
// 읽기 방식마다 열리는 페이지가 다르다(Patagonia: fetch·크롬은 껍데기, 파이어폭스는 본문). 그래서 크롬 보강은
// 지금 쓰는 엔진이 이 목록에 없을 때 none 을 한 번 더 확인한다 — 엔진마다 상품당 한 번뿐이다.
// nv 가 없는 예전 none 은 fetch·크롬이 적은 것으로 본다(파이어폭스를 쓰기 전의 표시다).
const NONE_LEGACY = "chromium,fetch";
const engineClass = (eng) => (eng === "playwright" || eng === "patchright" || eng === "chromium" ? "chromium" : eng === "firefox" ? "firefox" : "fetch");
function noneSeenBy(o, eng) {
  if (!o || !o.none) return false;
  return String(o.nv || NONE_LEGACY).split(",").includes(engineClass(eng));
}
function markNone(cur, eng) {
  const s = new Set(String(cur.none ? (cur.nv || NONE_LEGACY) : "").split(",").filter(Boolean));
  s.add(engineClass(eng));
  cur.none = 1;
  cur.nv = [...s].sort().join(",");
}
function clearNone(cur) { delete cur.none; delete cur.nv; }
// 지금 페이지(보관본이 아님)에서 옳은 혼용률을 읽었을 때. cur 를 고치고 무슨 일이 있었는지 돌려준다.
//   빈 칸            → 채운다("set")
//   같은 값          → 보관본 출처였으면 via·wd 를 지운다(확인됨, "same")
//   보관본과 다른 값 → 지금 페이지가 이긴다("replace"). 보관본은 몇 달 전의 다른 판일 수 있고, 지금 페이지가
//                      지금 파는 상품이다. 대신 두 값을 리포트에 남겨 사람이 볼 수 있게 한다(conflict).
//   지금 페이지에서 읽었던 다른 값 → 덮지 않는다("keep") — 어느 쪽이 옳은지 알 근거가 없다. 역시 남긴다.
// 혼용률이 들어가면 none 은 지운다.
function applyLiveComp(cur, comp) {
  if (!validComp(comp)) return { act: "" };
  if (!validComp(String(cur.comp || "").trim())) {
    cur.comp = comp; delete cur.via; delete cur.wd; clearNone(cur);
    return { act: "set" };
  }
  if (sameComp(comp, cur.comp)) {
    if (cur.via === "wayback") { delete cur.via; delete cur.wd; }
    clearNone(cur);
    return { act: "same" };
  }
  const conflict = { old: cur.comp, oldVia: cur.via || "", oldWd: cur.wd || "", live: comp };
  if (cur.via === "wayback") {
    cur.comp = comp; delete cur.via; delete cur.wd; clearNone(cur);
    return { act: "replace", conflict };
  }
  clearNone(cur);
  return { act: "keep", conflict };
}
// ── 혼용률 출처·none 표시 규칙 끝

// 앞 경로에서 얻은 값을 잃지 않게 합친다(먼저 찾은 쪽 우선).
function merge(a, b) {
  if (!b) return a;
  const out = { ...b };
  for (const k of ["comp", "color", "sizes", "price", "priceOrig"]) if (!out[k] && a[k]) out[k] = a[k];
  // 상세는 칸별로 합친다. 페이지 쪽(a)이 이긴다 — 페이지 추출은 Shopify JSON 까지 함께 보고 본문 칸의 글머리표를 더한 것이다.
  if (a.det || b.det) out.det = { ...(b.det || {}), ...(a.det || {}) };
  // 측정 실행의 출처·근거 글은 혼용률을 준 쪽 것을 따라간다.
  if (a.comp && out.comp === a.comp && a.src) { out.src = a.src; out.ev = a.ev; }
  return out;
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; await fn(items[k]); }
  }));
}

const ls = await fetch(WORKER + "/?catalogs=1" + tok).then((r) => r.json());
let list = (ls.list || []).sort((a, z) => (a.site < z.site ? -1 : 1));
// 같은 호스트에 옛 키(<host>)와 새 키(<host>.<slug>)가 함께 있으면 같은 상품을 두 번 읽게 된다.
// 예산 낭비라 새 키만 남긴다(옛 키는 어차피 미로 앱이 쓰지 않는다).
{
  const hosts = new Map();
  for (const c of list) {
    const host = String(c.site || "").split(".").slice(0, 2).join(".");
    if (!hosts.has(host)) hosts.set(host, []);
    hosts.get(host).push(c);
  }
  const skip = new Set();
  for (const [host, g] of hosts) {
    if (g.length > 1 && g.some((c) => c.site !== host)) {
      for (const c of g) if (c.site === host) skip.add(c.site);
    }
  }
  if (skip.size) console.log(`중복 옛 키 ${skip.size}개 건너뜀: ${[...skip].join(", ")}`);
  list = list.filter((c) => !skip.has(c.site));
}
// 검색 인덱스는 언제나 전 브랜드로 다시 만든다 — BRANDS 로 줄인 목록으로 만들면
// 나머지 브랜드가 인덱스에서 통째로 빠진다.
const allList = list;
const unmatchedBrands = [];
if (BRANDS.length) {
  const hit = (c) => {
    const b = normBrand(c.brand);
    const parts = String(c.site || "").toLowerCase().split(".").map(normBrand);
    return BRANDS.find((x) => x === b || parts.includes(x));
  };
  const used = new Set();
  list = list.filter((c) => { const x = hit(c); if (x) used.add(x); return !!x; });
  for (const x of BRANDS) if (!used.has(x)) unmatchedBrands.push(x);
  console.log(`BRANDS 필터 — ${list.length}개 카탈로그: ${list.map((c) => c.brand || c.site).join(", ")}` +
    (unmatchedBrands.length ? ` · 못 찾은 이름: ${unmatchedBrands.join(", ")}` : ""));
}
if (DRY) console.log("DRY=1 — 읽기만 한다. Worker 에 저장하지 않고 인덱스도 다시 만들지 않는다.");
if (WAYBACK) {
  // 카테고리 URL 자체가 상품으로 저장된 경우를 아카이브에 묻기 전에 거른다(읽기만).
  try {
    const links = await fetch(CATEGORY_LINKS_URL, { signal: AbortSignal.timeout(60000) }).then((r) => r.json());
    categorySet = new Set();
    for (const c of Object.values(links || {})) {
      for (const arr of Object.values(c || {})) if (Array.isArray(arr)) for (const u of arr) { const k = urlKey(u); if (k) categorySet.add(k); }
    }
    console.log(`웹 아카이브 층 켬 — 상한 ${WAYBACK_MAX}(브랜드당 ${WAYBACK_PER_BRAND}) · 카테고리 URL ${categorySet.size}개`);
  } catch (e) {
    console.log(`웹 아카이브 층 켬 — 상한 ${WAYBACK_MAX}(브랜드당 ${WAYBACK_PER_BRAND}) · 카테고리 URL 목록 못 읽음(주소 규칙만 쓴다)`);
  }
}
const wbBrandCtx = new Map();   // 사이트 → { used } — 1차·2차를 합쳐 브랜드당 상한을 센다
console.log(`카탈로그 ${list.length}개 — [${FIELDS.join(",")}] 채운다 (브랜드당 ${PER_BRAND}, 전체 ${TOTAL}, 재시도 ${RETRY_DAYS}일)`);

let budget = TOTAL;
const rows = [];
// 지금 페이지에서 읽은 혼용률이 이미 있던 값과 다른 상품 — 리포트에 남겨 사람이 본다(applyLiveComp).
const compConflicts = [];
// 저장 직전 가드(comp-guard.mjs)가 보류한 값 — 브랜드 전체에 되풀이되는 사이트 장식으로 보여 저장하지 않았다.
const guardHeld = [];
// 상품 상세 — 브랜드별 채움(저장했다면) · 가드가 뺀 설명/글머리표.
const detailFill = new Map();
const detailNoStore = new Set();   // DRY 에서 Worker 상세 칸을 못 읽은 브랜드(배포 전 Worker) — 빈 값에서 센다
const detailHeld = [];
// 껍데기(차단 화면은 아닌데 상품명이 화면 글에 없음)로 센 페이지의 예 — 리포트에 남긴다.
const shellEx = [];
// 측정 실행(DRY)의 브랜드별 표본 — 채운 것(값 · 출처 · 페이지 글), 읽었는데 빈 것, 못 읽은 것. 사람이 페이지를 열어 확인한다.
const SAMPLE_N = Math.max(1, Number(process.env.SAMPLE_N) || 3);
const samples = new Map();
function sampleOf(brand, p, got) {
  const s = samples.get(brand) || { filled: [], none: [], blocked: [], filledN: 0, noneN: 0, blockedN: 0 };
  samples.set(brand, s);
  const comp = got ? asComp(got.comp) : "";
  if (got && validComp(comp)) {
    s.filledN++;
    // 앞·뒤를 고루 보려고 처음 둘과 그 뒤 5번째마다 하나를 바꿔 넣는다(최대 SAMPLE_N+2)
    if (s.filled.length < SAMPLE_N + 2) s.filled.push({ url: p.productUrl, name: p.name || "", comp, src: got.src || "", ev: got.ev || "" });
  } else if (got && !got.blocked && (got.none || has(got))) {
    // 페이지(또는 Shopify JSON)는 읽었는데 혼용률이 없다 — 미표기로 적혔거나, 컬러·가격만 나온 상품
    s.noneN++;
    if (s.none.length < SAMPLE_N) s.none.push({ url: p.productUrl, name: p.name || "", why: got.none ? "미표기" : "컬러·가격만" });
  } else { s.blockedN++; if (s.blocked.length < SAMPLE_N) s.blocked.push({ url: p.productUrl, name: p.name || "", why: got && got.blocked ? (got.bv ? "막힘(" + got.bv + ")" : "막힘·껍데기") : "값 없음" }); }
}
// 같은 브랜드가 1차·2차 두 번 처리되므로 결과를 한 줄로 합친다.
const rowBySite = new Map();
const addRow = (r) => {
  const prev = rowBySite.get(r.site);
  if (!prev) { rowBySite.set(r.site, r); rows.push(r); return; }
  if (r.error && !prev.error) prev.error = r.error;
  prev.total = r.total != null ? r.total : prev.total;
  prev.have = Math.max(prev.have || 0, r.have || 0);
  prev.haveColor = Math.max(prev.haveColor || 0, r.haveColor || 0);
  prev.patched = (prev.patched || 0) + (r.patched || 0);
  prev.addComp = (prev.addComp || 0) + (r.addComp || 0);
  prev.addColor = (prev.addColor || 0) + (r.addColor || 0);
  for (const k of ["tried", "liveComp", "arcComp", "ms"]) prev[k] = (prev[k] || 0) + (r[k] || 0);
  if (r.stat) {
    prev.stat = prev.stat || {};
    for (const k of Object.keys(r.stat)) prev.stat[k] = (prev.stat[k] || 0) + r.stat[k];
  }
};

// ── 신상 우선 ──────────────────────────────────────────────────────
// 매일 밤 수집이 2천 개 넘는 신상을 들여오는데, 신상은 혼용률이 빈 채로 들어온다.
// 브랜드 순서대로 한 번만 훑으면 앞쪽 브랜드의 '예전에 실패한' 상품에 예산을 다
// 쓰고 뒤쪽 브랜드의 신상은 손도 못 댄다 — 그러면 어제 되던 브랜드가 오늘 나빠진다.
//
// 그래서 두 바퀴를 돈다.
//   1차: 시도 기록(t)이 아예 없는 상품 = 오늘 새로 들어온 것. 성공률이 가장 높다.
//   2차: 예전에 시도했다가 못 채운 상품. 남은 예산으로 본다.
// 1차를 전 브랜드에 걸쳐 먼저 끝내야 '신상 우선'이 성립한다.
//   3차(DETAIL_BACKFILL=1 일 때만): 혼용률은 이미 찼지만 상품 상세(설명·디테일·사진 전부)가 없는 상품.
//        혼용률이 1순위라 맨 뒤에, 남은 예산·시간(TIME_MIN) 안에서만 돈다. 며칠에 걸쳐 다 찬다.
const PHASE_NEW = 1, PHASE_OLD = 2, PHASE_DETAIL = 3;
// 1차에서 읽은 상품은 오버레이에 '시도 시각'이 찍힌다. 2차는 오버레이를 다시
// 읽으므로 그 상품들이 '신상이 아님'으로 분류돼 도로 걸린다 — RETRY_ALL 이 켜져
// 있으면 재시도 창도 안 막아 준다. 이번 실행에서 이미 읽은 것은 여기서 뺀다.
const triedThisRun = new Set();

async function processBrand(c, phase) {
  if (budget <= 0) return;
  const tStart = Date.now();
  let cat;
  try { cat = await fetch(WORKER + "/?catalog=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(30000) }).then((r) => r.json()); }
  catch (e) { addRow({ brand: c.brand || c.site, site: c.site, error: String(e.message || e) }); return; }
  const items = cat.items || [];
  // 채움 상태는 오버레이(comp:<site>) 기준 — 카탈로그 item 필드는 더 이상 쓰지 않는다.
  //
  // 읽기에 실패하면 이 브랜드는 통째로 건너뛴다. 예전엔 빈 객체로 넘어갔는데,
  // 저장 단계가 그 빈 객체를 기준으로 병합해 통째로 덮어썼다 — 읽기 한 번 실패에
  // 브랜드의 누적 수집분이 전부 날아갔다(Cotton on 98% → 0%).
  let overlay = null;
  for (let attempt = 0; attempt < 3 && overlay === null; attempt++) {
    try {
      const r = await fetch(WORKER + "/?comps=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      if (j && typeof j === "object" && !Array.isArray(j) && !j.error) overlay = j;
      else throw new Error("오버레이 형식이 아님");
    } catch (e) {
      if (attempt === 2) { addRow({ brand: cat.brand || c.site, site: c.site, total: items.length, error: "오버레이 읽기 실패: " + String(e.message || e) }); }
      else await new Promise((r2) => setTimeout(r2, 2000));
    }
  }
  if (overlay === null) return;
  const ov = (p) => overlay[p.productUrl] || {};
  // 상품 상세 저장값(detail:<site>). 못 읽으면 이 브랜드는 상세를 저장하지 않는다(빈 값을 기준으로 통째로
  // 덮어쓰면 쌓아 둔 상세가 날아간다 — 오버레이에서 실제로 겪은 사고). 혼용률 보강은 그대로 한다.
  let detailMap = null;
  try {
    const r = await fetch(WORKER + "/?details=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(30000) });
    if (r.ok) { const j = await r.json(); if (j && typeof j === "object" && !Array.isArray(j) && !j.error) detailMap = j; }
  } catch (e) {}
  // DRY(측정)는 아무것도 쓰지 않으므로, 저장값을 못 읽어도(배포 전 Worker 에는 ?details 가 없다) 빈 값으로 세어 본다.
  if (detailMap === null && DRY) { detailMap = {}; detailNoStore.add(c.site); }
  // 객체·배열이 통째로 String() 돼 들어간 흔적은 값이 아니다.
  // '[object Object]' 하나일 수도, 배열이라 쉼표로 여럿일 수도 있다.
  const valOf = (o, k) => { const t = String((o && o[k]) || "").trim(); return t.includes("[object Object]") ? "" : t; };
  // '있다'가 아니라 '옳다'로 센다 — 절반만 뽑힌 혼용률("Cotton 60%")이나
  // 안내 문구가 들어간 컬러("Select")는 채운 것으로 치지 않는다.
  const okOf = (o, k) => (k === "comp" ? validComp(valOf(o, k)) : k === "color" ? validColor(valOf(o, k)) : !!valOf(o, k));
  // 목표 항목(NEED_FIELDS)이 다 찼거나, 최근에 이미 시도해 봤으면 건너뛴다.
  //
  // "시도했으면 건너뛴다"가 핵심이다. 목표를 comp+color 로 두면, 혼용률은 있는데
  // 색을 안 적는 사이트의 상품을 매 실행마다 영원히 다시 읽게 된다 — 예산이 그쪽으로
  // 다 새고 정작 빈 상품에 손이 못 간다. 실제로 4항목 목표였을 때 45분에 +429 였다.
  const now = Date.now();
  const RETRY_MS = RETRY_DAYS * 24 * 3600 * 1000;
  const COLOR_RETRY_MS = COLOR_RETRY_DAYS * 24 * 3600 * 1000;
  const lowColor = items.length > 0 && items.filter((p) => okOf(ov(p), "color")).length / items.length < 0.5;
  const full = (p) => {
    const o = ov(p);
    if (FIELDS.every((k) => okOf(o, k))) {
      // 혼용률은 찼는데 컬러가 없는 상품 — 컬러 규칙이 생기기 전(8/4)에 혼용률을 채운
      // 상품은 다시 열 일이 없어서 컬러가 영영 비어 있었다(Everlane 306·Mint velvet 292·
      // The upside 322 … 혼용률은 70% 안팎인데 컬러 0%). 컬러 시도 시각(ct)을 따로 두고
      // COLOR_RETRY_DAYS 에 한 번만 다시 연다 — 매번 열면 색을 안 적는 사이트에 예산이 샌다.
      if (!FIELDS.includes("color") && !okOf(o, "color") && !(o.ct && now - o.ct < COLOR_RETRY_MS)) return false;
      // 컬러가 절반도 안 찬 브랜드 — 컬러 규칙 판이 바뀌었으면 창과 무관하게 한 번(막혔던 상품 bv 는 빼고).
      if (!FIELDS.includes("color") && lowColor && !okOf(o, "color") && !o.bv && o.cv !== COLOR_V) return false;
      return true;
    }
    // 값이 들어 있는데 옳지 않으면(쓰레기·절반만 뽑힘) 시도 시각과 무관하게 다시 읽는다.
    // 안 그러면 잘못 저장된 값이 재시도 기간(RETRY_DAYS) 내내 자리를 차지한다.
    if (FIELDS.some((k) => valOf(o, k) && !okOf(o, k))) return false;
    // impit 이 생기기 전에 '못 읽음'으로 끝난 상품은 impit 으로 한 번은 다시 본다 — 재시도 창(5일)에 갇혀
    // Buck Mason·Dickies·Everlane·Whitestuff … 의 빈 혼용률이 평 fetch 차단 한 번으로 계속 비어 있었다.
    // 사이트 미표기(none)로 판정된 상품은 아니다. 한 번 impit 으로 보고 나면 bv 에 impit 이 남아 다시 창을 지킨다.
    if (IMPIT_ON && FIELDS.includes("comp") && !okOf(o, "comp") && !o.none && o.t && !String(o.bv || "").includes("impit")) return false;
    // 추출 규칙이 바뀐 뒤 — 읽었는데 비었던 상품(사이트 미표기 포함)은 창과 무관하게 한 번 더 연다(RULE_V 주석).
    //   rv 가 있으면 그 판과 지금 판을 견준다. rv 가 없는 예전 기록은 '읽었는데 비었던' 흔적(사이트 미표기 none, 또는 컬러·가격·
    //   사이즈는 읽힘)이 있을 때만 — 시도 시각만 있는 기록은 막혔던 것일 수 있어 창을 지킨다(impit 까지 막힘 bv 도 마찬가지).
    if (FIELDS.includes("comp") && !okOf(o, "comp") && o.t && (o.rv ? o.rv !== RULE_V
      : !o.bv && !!(o.none || valOf(o, "color") || valOf(o, "price") || valOf(o, "sizes")))) return false;
    if (RETRY_ALL) return false;          // 창을 무시하고 다시 읽는다
    return o.t && now - o.t < RETRY_MS;   // 최근 시도 → 이번엔 넘긴다
  };
  // 엑셀에 나가는 두 항목을 따로 센다 — 합쳐 보면 어느 쪽이 비었는지 알 수 없다.
  const have = items.filter((p) => okOf(ov(p), "comp")).length;
  const haveColor = items.filter((p) => okOf(ov(p), "color")).length;
  // 1차에는 시도 기록이 없는 상품(=오늘 새로 들어온 것)만, 2차에는 나머지.
  const isNew = (p) => !ov(p).t;
  // 3차(상세): 혼용률이 찼거나 사이트 미표기로 판정된 — 즉 페이지가 읽히는 — 상품 중 상세가 없거나 오래된 것.
  const needDetail = (p) => {
    if (!detailMap) return false;
    const o = ov(p);
    if (!(okOf(o, "comp") || o.none)) return false;
    const d = detailMap[p.productUrl];
    return !(d && d.dt && now - d.dt < DETAIL_RETRY_MS);
  };
  if (phase === PHASE_DETAIL && Date.now() > STOP_AT) {
    addRow({ brand: cat.brand || c.site, site: c.site, total: items.length, have, haveColor, patched: 0, detailLeft: items.filter(needDetail).length });
    return;
  }
  const want = items.filter((p) => !triedThisRun.has(p.productUrl) && (phase === PHASE_DETAIL
    ? needDetail(p)
    : !full(p) && (phase === PHASE_NEW ? isNew(p) : !isNew(p))));
  // 성과 없는 브랜드는 조금씩만 본다.
  // 충분히 열어 봤는데 값이 거의 안 나온 브랜드는 사이트가 소재를 안 적는 쪽이다.
  // Loft 는 579개를 열어 4% 였다 — 매일 밤 579개를 다시 여는 것은 그 시간을
  // 실제로 채워지는 브랜드에서 빼앗는 일이다.
  //
  // 그렇다고 목록에서 빼거나 영영 포기하지는 않는다. 사이트가 표기를 추가하면
  // 따라가야 하기 때문이다. 매 실행 BARREN_CAP 개씩만 다시 보고, 값이 나오기
  // 시작하면 비율이 올라가면서 이 제한이 저절로 풀린다.
  // (신상 1차에는 걸지 않는다 — 새로 들어온 상품은 판단할 근거가 아직 없다)
  const tried = items.filter((p) => ov(p).t).length;
  const barren = phase !== PHASE_NEW && tried >= 60 && have / Math.max(tried, 1) < 0.05;
  const cap = barren && BARREN_CAP ? Math.min(BARREN_CAP, PER_BRAND) : PER_BRAND;
  const todo = want.slice(0, Math.min(cap, budget));
  if (barren && want.length > todo.length) {
    console.log(`  ${c.site}: 성과 낮음(${have}/${tried}) — 이번엔 ${todo.length}/${want.length}개만`);
  }
  if (!todo.length) {
    addRow({ brand: cat.brand || c.site, site: c.site, total: items.length, have, haveColor, patched: 0 });
    return;
  }

  const stat = { shopify: 0, page: 0, worker: 0, wayback: 0, noData: 0, blocked: 0, fail: 0, shell: 0, none: 0,
    wbNone: 0, wbReject: 0, wbUrl: 0, wbErr: 0, wbSkip: 0 };
  const comps = {};
  if (!wbBrandCtx.has(c.site)) wbBrandCtx.set(c.site, { used: 0 });
  const wbCtx = wbBrandCtx.get(c.site);
  // Worker 우회가 붙어 차단 상품은 왕복이 하나 더 는다 — 동시 처리를 올려 상쇄한다.
  for (const p of todo) { triedThisRun.add(p.productUrl); curBrand.set(p.productUrl, cat.brand || c.brand || c.site); }
  const details = {};
  await pool(todo, PAGE_POOL, async (p) => {
    if (phase === PHASE_DETAIL && Date.now() > STOP_AT) return;   // 3차는 시간이 다 되면 멈춘다(남은 것은 다음 밤)
    // 2차도 시간이 다 되면 새로 열지 않는다 — 워크플로 제한 시간에 걸리면 리포트·검색 인덱스를 못 쓴다. 남은 것은 다음 밤.
    if (phase === PHASE_OLD && Date.now() > STOP_AT) { stat.late = (stat.late || 0) + 1; return; }
    const got = await enrichOf(p.productUrl, stat, ov(p), wbCtx, p.name || "");
    // 이 사이트가 429 를 준 뒤 — 시도 기록을 남기지 않는다(다음 실행이 읽는다). 이번 상품이 429 를 받은 경우도 같다.
    if ((got && got.skip429) || (stop429.has(hostOf(p.productUrl)) && !(got && validComp(asComp(got.comp))))) { stat.skip429 = (stat.skip429 || 0) + 1; return; }
    if (DRY) sampleOf(cat.brand || c.brand || c.site, p, got);
    // 상세: 페이지(또는 Shopify JSON)를 읽었을 때만 남긴다 — 빈 기록도 남겨 '봤다'(dt)를 찍는다. 막힌 상품은 남기지 않는다.
    if (got && !got.blocked && (got.det || has(got) || got.none)) details[p.productUrl] = got.det || {};
    // 빈 결과도 넣는다 — 저장 단계에서 '시도 시각'만 찍혀 다음 실행이 건너뛴다.
    // 페이지를 읽었는데 소재가 없었으면 none 을 함께 남긴다(엑셀에서 '정보 없음').
    // 막혀서 못 읽었으면 blocked 를 남긴다 — 예전 판정이 잘못 찍어 둔 none 을 지우는 데 쓴다.
    // 아카이브에 물어보고 못 쓴 상품은 wt(물어본 시각)를 함께 넘긴다.
    comps[p.productUrl] = has(got) ? got
      : (got && got.none ? { none: 1 } : got && got.blocked ? { blocked: 1, ...(got.wt ? { wt: got.wt } : {}), ...(got.bv ? { bv: got.bv } : {}) } : {});
  });
  budget -= todo.length;
  // 저장 직전 가드: 이번에 읽은 혼용률을 이 브랜드에 이미 저장된 값과 함께 보고, 브랜드 전체에
  // 되풀이되는 조각(메뉴·배너·추천 블록에서 온 글)이면 저장하지 않고 보류한다(comp-guard.mjs 머리말).
  // 혼용률만 뺀다 — 컬러·가격은 그대로 저장하고, 시도 시각도 남아 재시도 기간이 지나면 다시 읽는다.
  {
    const nameOf = new Map(items.map((p) => [p.productUrl, p.name || ""]));
    const stored = items.map((p) => ({ url: p.productUrl, name: p.name || "",
      comp: String(p.comp || "").trim() || valOf(ov(p), "comp") })).filter((x) => validComp(x.comp));
    const incoming = Object.entries(comps).map(([url, v]) => ({ url, name: nameOf.get(url) || "", comp: v ? asComp(v.comp) : "" }))
      .filter((x) => validComp(x.comp));
    const { held } = guardRun(stored, incoming);
    for (const [url, h] of held) {
      guardHeld.push({ brand: cat.brand || c.brand || c.site, url, name: h.name, comp: h.comp, why: flagText(h.flag) });
      const v = { ...comps[url] };
      delete v.comp; delete v.via; delete v.wd; delete v.none;
      comps[url] = v;
      stat.held = (stat.held || 0) + 1;
    }
  }

  // 이번에 읽은 혼용률이 어디서 왔나 — 지금 페이지(실시간 경로) / 보관본.
  let liveComp = 0, arcComp = 0;
  for (const v of Object.values(comps)) {
    if (v && v.none) stat.none++;   // 이번에 '사이트 미표기'로 판정한 상품
    if (!v || !validComp(asComp(v.comp))) continue;
    if (v.via === "wayback") arcComp++; else liveComp++;
  }

  // 저장: 병합을 여기서 하고 Worker 에는 완성된 오버레이를 통째로 넘긴다.
  // Worker 가 병합하면(기존 오버레이 파싱 + 항목별 정리 + 재직렬화) 항목 400개쯤에서
  // 무료 플랜 CPU 10ms 를 넘겨 저장 전에 죽는다 — Vince(340) 성공, Whitestuff(419)
  // 실패로 실측됐다. 여기서 병합하면 Worker 는 파싱 없이 쓰기만 하므로 크기와 무관하다.
  let patched = 0, addComp = 0, addColor = 0;
  const keys = Object.keys(comps);
  // DRY 여도 병합까지는 한다 — '저장했다면 몇 개가 새로 찼을지'를 세기 위해서다.
  if (keys.length) {
    const merged = { ...overlay };
    const clean = (v, max) => {
      const t = String(v == null ? "" : v).trim().slice(0, max);
      return t.includes("[object Object]") ? "" : t;
    };
    for (const [url, v] of Object.entries(comps)) {
      const cur = { ...(merged[url] || {}) };
      const inc = typeof v === "string" ? { comp: v } : (v || {});
      const fromArc = inc.via === "wayback";
      let n = 0;
      for (const [k, max] of [["comp", 160], ["color", 80], ["sizes", 200], ["price", 40], ["priceOrig", 40]]) {
        // 보관본만으로 얻은 결과에서는 혼용률·컬러만 받는다 — 가격·사이즈·정가는 그때의 값이다.
        if (inc.arcOnly && k !== "comp" && k !== "color") continue;
        const t = clean(inc[k], max);
        // 옳지 않은 값은 아예 저장하지 않는다. 저장해 두면 다음 실행이 "값은 있는데
        // 옳지 않다"고 보고 재시도 기간을 무시한 채 영원히 다시 읽는다.
        const good = k === "comp" ? validComp(t) : k === "color" ? validColor(t) : !!t;
        // 지금 페이지에서 읽은 혼용률은 출처 규칙(applyLiveComp)을 따른다 — 크롬 보강과 같은 규칙.
        if (k === "comp" && good && !fromArc) {
          const r = applyLiveComp(cur, t);
          if (r.act === "set" || r.act === "replace") { n++; addComp++; }
          if (r.conflict) compConflicts.push({ brand: cat.brand || c.brand || c.site, url, ...r.conflict, act: r.act });
          continue;
        }
        if (good && !okOf(cur, k)) {
          cur[k] = t; n++;
          // 보관본에서 온 혼용률은 출처를 남긴다 — 나중에 지금 페이지와 가려낼 수 있게.
          if (k === "comp" && fromArc) { cur.via = "wayback"; cur.wd = String(inc.wd || "").slice(0, 8); }
          if (k === "comp") addComp++;
          if (k === "color") addColor++;
        } else if (cur[k] && !okOf(cur, k)) {
          delete cur[k];   // 예전에 잘못 저장된 값 정리('[object Object]', 절반만 뽑힌 혼용률)
        }
      }
      // 보관본을 물어본 시각 — 없거나 못 쓴 상품을 WAYBACK_RETRY_DAYS 동안 다시 묻지 않는다.
      if (inc.wt) cur.wt = inc.wt;
      // 막힌 읽기 방식 — impit 까지 막혔으면 다음부터는 재시도 창을 지킨다(위 full). 읽히면 지운다.
      if (inc.bv) cur.bv = inc.bv;
      else if (!inc.blocked && cur.bv) delete cur.bv;
      // 값을 못 찾았어도 "시도했음"은 남긴다 — 안 남기면 같은 상품을 매번 다시 읽는다.
      cur.t = now;
      cur.ct = now;   // 컬러도 이번에 함께 봤다(위 full 의 컬러 재시도 창)
      // 페이지는 읽었는데 소재 표기가 없었다 = 사이트가 안 적는다.
      // 엑셀에서 '확인 필요'(아직 못 구함)와 다르게 '정보 없음'으로 보여 주기 위한 표시다.
      // 값을 찾았으면 지운다 — 사이트가 나중에 표기를 추가했을 수 있다.
      // nv 에 'fetch' 를 남긴다 — 크롬 보강이 다른 엔진으로 한 번 더 확인할 수 있게(markNone).
      // 어느 규칙 판으로 시도했나 — 혼용률이 비어 있을 때만 남긴다(판이 바뀌면 다시 읽으려고, RULE_V). 막힌 시도도 적는다:
      // 안 적으면 그 상품은 예전 기록으로 보여 매 실행 다시 열린다. 판이 바뀔 때 한 번 더 열릴 뿐이다.
      if (!okOf(cur, "comp")) cur.rv = RULE_V; else delete cur.rv;
      if (!okOf(cur, "color")) cur.cv = COLOR_V; else delete cur.cv;
      if (inc.none && !cur.comp) markNone(cur, "fetch");
      else if (cur.comp) clearNone(cur);
      // 오늘 읽으려 했는데 막혔다면 '사이트가 안 적는다'고 단정할 근거가 없다.
      // 예전 판정은 봇 확인 화면·빈 껍데기도 '읽음'으로 쳐서 Zara·H&M·Massimo Dutti 에
      // none 을 찍어 두었다 — 엑셀에 '정보 없음'으로 나간다. '확인 필요'로 되돌린다.
      else if (inc.blocked && cur.none) clearNone(cur);
      merged[url] = cur;
      if (n) patched++;
    }
    // 상품 상한(브랜드 카탈로그 800)보다 넉넉하게 1000개까지만 남긴다.
    const mk = Object.keys(merged);
    if (mk.length > 1000) for (const k of mk.slice(0, mk.length - 1000)) delete merged[k];

    let ok = DRY;   // DRY 는 저장 시도 자체를 하지 않는다
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        const resp = await fetch(`${WORKER}/?store=overlay&site=${encodeURIComponent(c.site)}${tok}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(merged), signal: AbortSignal.timeout(45000),
        });
        const text = await resp.text();
        let r = null;
        try { r = JSON.parse(text); } catch (e) {}
        if (r && r.ok) { ok = true; break; }
        if (attempt === 2) console.log(`  !! ${c.site} 저장 실패: HTTP ${resp.status} ${text.slice(0, 160)}`);
      } catch (e) {
        if (attempt === 2) console.log(`  !! ${c.site} 저장 오류: ${String(e.message || e)}`);
      }
      await new Promise((r2) => setTimeout(r2, 2000));
    }
    if (!ok) patched = 0;
  }

  // 저장 후 실제로 박혔는지 다시 읽어 확인한다 — 응답의 patched 만 믿지 않는다.
  let verify = null, verifyColor = null;
  if (keys.length && !DRY) {
    try {
      const re = await fetch(WORKER + "/?comps=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(20000) }).then((r) => r.json());
      // 지금 카탈로그에 있는 상품만 센다. 오버레이에는 카탈로그에서 빠진 상품의 값도 남아 있어,
      // 전부 세면 채움률이 100% 를 넘는다(11/24 실행: Bassike 909/320 · 전체 129%).
      // 예전엔 쓴 브랜드가 적어 드러나지 않았는데, 컬러 재시도로 거의 모든 브랜드가 쓰면서 드러났다.
      const vs2 = items.map((p) => (re || {})[p.productUrl]).filter(Boolean);
      verify = vs2.filter((o) => validComp(valOf(o, "comp"))).length;
      verifyColor = vs2.filter((o) => validColor(valOf(o, "color"))).length;
      // 쓰기 직후 읽기는 KV 지연으로 0 이 나올 수 있다 — 쓴 것도 없을 때만 문제로 본다.
      if (patched === 0 && verify === 0) {
        console.log(`  !! ${c.site}: 저장 후에도 오버레이 비어 있음 — 첫 키 ${keys[0].slice(0, 120)}`);
      }
    } catch (e) {}
  }
  // ── 상품 상세 저장(detail:<site>) ─────────────────────────────────
  // 저장 직전 가드(detail-guard.mjs): 브랜드 상품 대부분에 똑같이 붙는 설명·글머리표(배송 안내·브랜드 소개)는 뺀다.
  // 병합은 여기서 하고 Worker 에는 완성본을 통째로 넘긴다(store=overlay 와 같은 이유 — Worker CPU 한도).
  let detAdded = 0, detHeldDesc = 0, detDropFeat = 0;
  if (detailMap && Object.keys(details).length) {
    const nameOf = new Map(items.map((p) => [p.productUrl, p.name || ""]));
    const stored = Object.entries(detailMap).map(([url, d]) => ({ url, name: nameOf.get(url) || "", desc: d && d.desc, feat: d && d.feat }));
    const incoming = Object.entries(details).map(([url, d]) => ({ url, name: nameOf.get(url) || "", desc: d.desc, feat: d.feat }));
    const flags = detailFlags(stored, incoming);
    const clean = {};
    for (const [url, d] of Object.entries(details)) {
      const r = detailApply(d, flags);
      if (r.why.includes("desc")) { detHeldDesc++; if (detailHeld.length < 60) detailHeld.push({ brand: cat.brand || c.site, url, what: "설명", text: String(d.desc).slice(0, 120) }); }
      const fd = r.why.find((w) => w.startsWith("feat-"));
      if (fd) detDropFeat += Number(fd.slice(5));
      clean[url] = r.rec;
    }
    if (flags.dropFeat.size && detailHeld.length < 60) detailHeld.push({ brand: cat.brand || c.site, url: "", what: "글머리표", text: [...flags.dropFeat].slice(0, 4).join(" · ") });
    const { merged: dm, added } = mergeDetails(detailMap, clean, now);
    detAdded = added;
    if (!DRY) {
      let ok = false;
      for (let attempt = 0; attempt < 3 && !ok; attempt++) {
        try {
          const resp = await fetch(`${WORKER}/?store=details&site=${encodeURIComponent(c.site)}${tok}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dm), signal: AbortSignal.timeout(60000),
          });
          const t = await resp.text();
          let r = null; try { r = JSON.parse(t); } catch (e) {}
          if (r && r.ok) ok = true;
          else if (attempt === 2) console.log(`  !! ${c.site} 상세 저장 실패: HTTP ${resp.status} ${t.slice(0, 120)}`);
        } catch (e) { if (attempt === 2) console.log(`  !! ${c.site} 상세 저장 오류: ${String(e.message || e)}`); }
        if (!ok) await new Promise((r2) => setTimeout(r2, 2000));
      }
      if (!ok) detAdded = 0;
    }
    // 저장했다면의 채움(카탈로그 상품 기준) — 리포트용
    detailFill.set(c.site, {
      brand: cat.brand || c.site, total: items.length,
      desc: items.filter((p) => dm[p.productUrl] && dm[p.productUrl].desc).length,
      feat: items.filter((p) => dm[p.productUrl] && dm[p.productUrl].feat).length,
      imgs: items.filter((p) => dm[p.productUrl] && dm[p.productUrl].imgs).length,
      colors: items.filter((p) => dm[p.productUrl] && dm[p.productUrl].colors).length,
      bytes: JSON.stringify(dm).length, added: (detailFill.get(c.site) || { added: 0 }).added + detAdded,
      heldDesc: detHeldDesc, dropFeat: detDropFeat,
    });
  }

  // KV 는 최종 일관성 저장소라 방금 쓴 값이 즉시 읽히지 않을 수 있다(수십 초 지연).
  // 실측: ae.com.americaneagle 은 '+3 검증 3', addisonbay 는 '+3 검증 0' — 같은 코드다.
  // 검증값을 그대로 쓰면 실제로 저장된 것을 안 됐다고 보고하게 되므로 큰 값을 쓴다.
  const haveNow = Math.max(verify == null ? 0 : verify, have + addComp);
  const colorNow = Math.max(verifyColor == null ? 0 : verifyColor, haveColor + addColor);
  addRow({ brand: cat.brand || c.site, site: c.site, total: items.length, have: haveNow, haveColor: colorNow, patched, addComp, addColor, stat,
    tried: todo.length, liveComp, arcComp, ms: Date.now() - tStart });
  console.log(`  ${c.site}: 혼용률 +${addComp} 컬러 +${addColor} (읽음 ${todo.length}, 경로 ${JSON.stringify(stat)})`);
}

// ── 브랜드를 동시에 여러 개 ────────────────────────────────────────
// 예전에는 브랜드를 하나씩 처리하며 그 안에서 10개를 동시에 읽었다. 10개가 전부
// 같은 사이트로 몰려 429(요청 과다)를 부르면서도 전체 속도는 못 냈다(Leset 이 그랬다).
// 브랜드를 나눠 돌리면 한 사이트로 가는 동시 요청은 PAGE_POOL 로 줄고 전체 동시
// 요청은 BRAND_POOL 배로 는다 — 사이트에는 더 정중하고 전체로는 더 빠르다.
const BRAND_POOL = Math.max(1, Number(process.env.BRAND_POOL) || 5);
console.log(`impit ${IMPIT_ON ? "켬" : "없음(평 fetch 만)"} · 상세 3차 ${DETAIL_BACKFILL ? "켬" : "끔"}`);
for (const phase of DETAIL_BACKFILL ? [PHASE_NEW, PHASE_OLD, PHASE_DETAIL] : [PHASE_NEW, PHASE_OLD]) {
  console.log(`\n── ${phase === PHASE_NEW ? "1차 신상" : phase === PHASE_OLD ? "2차 재시도" : "3차 상품 상세"} ── 남은 예산 ${budget}`);
  await pool(list, BRAND_POOL, (c) => processBrand(c, phase));
}


// ── 검색 인덱스 재구축 — 전 브랜드 카탈로그에서. comp 가 인덱스로 흘러야
//    보드 스캐너가 접속 없이 붙일 수 있다. 브랜드당 150개(프리페치와 동일 상한).
let indexCount = 0;
if (!DRY) try {
  const idx = [];
  for (const c of allList) {
    try {
      const cat = await fetch(WORKER + "/?catalog=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(30000) }).then((r) => r.json());
      let om = {};
      try { om = await fetch(WORKER + "/?comps=" + encodeURIComponent(c.site) + tok, { signal: AbortSignal.timeout(20000) }).then((r) => r.json()) || {}; } catch (e) {}
      for (const it of (cat.items || []).slice(0, 150)) {
        if (!it || !it.imageUrl || !it.productUrl) continue;
        const o = om[it.productUrl] || {};
        // 검색·스캔에 필요한 필드만 싣는다(src 를 실었더니 KV 값 상한을 넘겼다).
        idx.push({
          name: it.name || "", brand: cat.brand || c.brand || c.site,
          category: it.category || "", imageUrl: it.imageUrl, productUrl: it.productUrl,
          price: o.price || it.price || "", priceOrig: o.priceOrig || it.priceOrig || "",
          comp: o.comp || "", color: o.color || "", sizes: o.sizes || "",
        });
      }
    } catch (e) {}
  }
  const resp = await fetch(WORKER + "/?store=index" + tok, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: idx }), signal: AbortSignal.timeout(120000),
  });
  const text = await resp.text();
  try { indexCount = JSON.parse(text).count || 0; }
  catch (e) { console.log(`index rebuild failed: HTTP ${resp.status} ${text.slice(0, 200)}`); }
} catch (e) { console.log("index rebuild failed:", String(e.message || e)); }

const done = rows.filter((r) => !r.error);
const totalItems = done.reduce((s, r) => s + (r.total || 0), 0);
const totalHave = done.reduce((s, r) => s + (r.have || 0), 0);
const totalColor = done.reduce((s, r) => s + (r.haveColor || 0), 0);
const totalComp = done.reduce((s, r) => s + (r.addComp || 0), 0);
const totalColorAdd = done.reduce((s, r) => s + (r.addColor || 0), 0);
const pct = (n) => (totalItems ? Math.round((n / totalItems) * 100) : 0);
const compPct = pct(totalHave), colorPct = pct(totalColor);
const worst = Math.min(compPct, colorPct);
const need = (p2) => Math.max(0, Math.ceil((p2 / 100) * totalItems) - Math.min(totalHave, totalColor));

let md = `# 엑셀 항목 보강 결과 (${new Date().toISOString().slice(0, 16)}Z)\n\n`;
if (DRY) {
  md = `# 엑셀 항목 보강 — 측정 실행(DRY) (${new Date().toISOString().slice(0, 16)}Z)\n\n` +
    `> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,\n` +
    `> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.\n` +
    `> 진짜 결과는 \`enrich-comp-report.md\` 를 본다.\n\n`;
}
if (BRANDS.length) {
  md += `대상 브랜드(BRANDS): ${list.map((c) => c.brand || c.site).join(", ") || "(없음)"}` +
    (unmatchedBrands.length ? ` · 못 찾은 이름: ${unmatchedBrands.join(", ")}` : "") + `\n\n`;
}
md += `- 설정: 재시도 창 ${RETRY_DAYS}일${RETRY_ALL ? "(무시 — RETRY_ALL)" : ""} · 추출 규칙 판 ${RULE_V} · 한 사이트 요청 간격 ${HOST_GAP_MS}ms · ` +
  `Worker 우회 ${WORKER_BYPASS ? "켬" : "끔(측정 — 상품 주소당 요청 3번 이하)"} · impit ${IMPIT_ON ? "켬" : "없음"}\n`;
if (stop429.size) md += `- **429 를 받아 이 실행에서 그만 물은 사이트**: ${[...stop429].map(([h, u]) => `${h}(${u})`).join(" · ")} — 그 뒤 상품은 시도 기록 없이 남겼다\n`;
md += `\n`;
// ── 엑셀 열 개방 기준 ──────────────────────────────────────────────
// 절반만 찬 표는 쓸 수 없다는 판단으로, 두 항목이 모두 GATE% 를 넘을 때만
// 보드 스캐너 엑셀에 열을 연다(index.html 의 SHOW_FABRIC_COLUMNS).
// 여기서 세는 것은 "채워졌나"가 아니라 "옳은가"다 — 절반만 뽑힌 혼용률
// ("Cotton 60%")이나 안내 문구가 들어간 컬러("Select")는 세지 않는다.
// 열림 여부는 이제 브랜드마다 따로 정해진다 — 패널이 그 파일에 실리는 상품만 보고
// 판단하기 때문이다(index.html 의 fabricReady). 그래서 전체 평균보다 "몇 개 브랜드가
// 지금 온전히 뽑히나"가 실제로 쓰는 사람에게 의미 있는 숫자다.
const ready = done.filter((r) => r.total && (r.have / r.total) >= GATE / 100 && ((r.haveColor || 0) / r.total) >= GATE / 100);
const readyItems = ready.reduce((n, r) => n + r.total, 0);
md += `## 엑셀 열 개방 판정 (기준 ${GATE}% · 목표 ${GOAL}%)\n\n`;
md += `> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는\n`;
md += `> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 \`preflight.md\` 를 본다.\n\n`;
md += `**지금 두 열이 다 채워져 나오는 브랜드: ${ready.length}/${done.filter((r) => r.total).length}개** ` +
  `(상품 ${readyItems}/${totalItems}개)\n\n` +
  `패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.\n` +
  (ready.length ? `\n${ready.map((r) => r.brand).sort().join(" · ")}\n\n` : `\n`);
md += worst >= GATE
  ? `전체 평균도 기준을 넘었습니다 — 혼용률 ${compPct}% · 컬러웨이 ${colorPct}%.\n` +
    (worst >= GOAL ? `목표 ${GOAL}% 도 넘었습니다.\n\n` : `목표 ${GOAL}% 까지 ${need(GOAL)}개 남았습니다.\n\n`)
  : `전체 평균은 아직입니다 — 혼용률 ${compPct}% · 컬러웨이 ${colorPct}%.\n` +
    `기준 ${GATE}% 까지 ${need(GATE)}개, 목표 ${GOAL}% 까지 ${need(GOAL)}개 더 채워야 합니다.\n` +
    `(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)\n\n`;

md += `목표 항목: ${FIELDS.join(", ")} · 상품 ${totalItems}개\n\n`;
md += `| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |\n|---|---:|---:|---:|\n`;
md += `| 혼용률 | ${totalHave} | ${compPct}% | +${totalComp} |\n`;
md += `| 컬러웨이 | ${totalColor} | ${colorPct}% | +${totalColorAdd} |\n\n`;
md += DRY ? `- 검색 인덱스 재구축: DRY 라 하지 않음\n\n` : `- 검색 인덱스 재구축: ${indexCount}개\n\n`;
md += `백필은 브랜드당 ${PER_BRAND}개·한 회차 ${TOTAL}개 상한이다. 목표 항목이 다 찬 상품과\n`;
md += `${RETRY_DAYS}일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.\n\n`;
// 경로 이름을 그대로 쓰면 오해를 부른다 — shopify/page/worker 는 '성공한 경로'이고
// noData/blocked/fail 만 실패다. 예전 리포트의 'page=505' 를 '505개 실패'로 읽었다.
const PATH_LABEL = {
  shopify: "쇼피JSON", page: "페이지", worker: "우회", wayback: "아카이브",
  noData: "정보없음", blocked: "직접차단", fail: "오류", shell: "껍데기", impit: "impit",
  wbNone: "보관본없음", wbReject: "아카이브거부", wbErr: "아카이브오류",
};
const pathStr = (st) => {
  if (!st) return "";
  const ok = ["shopify", "page", "impit", "worker", "wayback"].filter((k) => st[k]).map((k) => `${PATH_LABEL[k]} ${st[k]}`);
  const ng = ["noData", "blocked", "shell", "fail", "wbNone", "wbReject", "wbErr"].filter((k) => st[k]).map((k) => `${PATH_LABEL[k]} ${st[k]}`);
  return [ok.length ? "성공 " + ok.join("·") : "", st.none ? `미표기 ${st.none}` : "", st.held ? `가드 보류 ${st.held}` : "", ng.length ? "실패 " + ng.join("·") : "",
    st.skip429 ? `429 로 멈춤 ${st.skip429}` : "", st.late ? `시간 끝 ${st.late}` : ""].filter(Boolean).join(" / ");
};
const gaps = done.filter((r) => r.total).sort((a, z) => (a.have / a.total) - (z.have / z.total));
if (gaps.length) {
  md += `## 브랜드별 채움률 (${gaps.length}) — 낮은 순\n\n`;
  md += `| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |\n|---|:-:|---:|---:|---:|---|\n`;
  for (const r of gaps) {
    const cp = Math.round((r.have / r.total) * 100);
    const cl = Math.round(((r.haveColor || 0) / r.total) * 100);
    // 이 브랜드를 지금 뽑으면 두 열이 붙는지 — 패널의 판정과 같은 기준.
    const open = cp >= GATE && cl >= GATE ? "✅" : "—";
    md += `| ${r.brand} | ${open} | ${r.have}/${r.total} (${cp}%) | ${r.haveColor || 0}/${r.total} (${cl}%) | 혼용률 +${r.addComp || 0} 컬러 +${r.addColor || 0} | ${pathStr(r.stat)} |\n`;
  }
  md += `\n`;
}
if (detailFill.size) {
  const rowsD = [...detailFill.values()].sort((a, z) => z.total - a.total);
  const sum = (k) => rowsD.reduce((n, r) => n + (r[k] || 0), 0);
  md += `## 상품 상세(설명·디테일·사진 전부·컬러 전부) — 이번 실행에서 읽은 브랜드 ${rowsD.length}개\n\n`;
  if (detailNoStore.size) md += `> Worker 에 상세 칸(?details)이 아직 없어(배포 전) ${detailNoStore.size}개 브랜드는 빈 저장값에서 센 '저장했다면' 값이다.\n\n`;
  md += `별도 저장 칸(detail:<site>)에 쌓인다. 상품 수 대비 — 설명 ${sum("desc")} · 디테일 ${sum("feat")} · 사진 ${sum("imgs")} · 컬러 전부 ${sum("colors")} / ${sum("total")}\n\n`;
  md += `| 브랜드 | 상품 | 설명 | 디테일 | 사진 | 컬러 전부 | 이번 +N | 가드(설명 보류·글머리표 뺌) | 저장 크기 |\n|---|---:|---:|---:|---:|---:|---:|---|---:|\n`;
  for (const r of rowsD) md += `| ${r.brand} | ${r.total} | ${r.desc} | ${r.feat} | ${r.imgs} | ${r.colors} | +${r.added} | ${r.heldDesc}·${r.dropFeat} | ${Math.round(r.bytes / 1024)}KB |\n`;
  md += `\n`;
  if (detailHeld.length) {
    md += `<details><summary>가드가 뺀 글(브랜드 대부분에 똑같이 붙은 글 — 사이트 공통 문구로 보고 저장하지 않음)</summary>\n\n`;
    for (const x of detailHeld) md += `- ${x.brand} · ${x.what}${x.url ? ` · ${x.url}` : ""} — ${String(x.text).replace(/\|/g, "/").replace(/\n/g, " ")}\n`;
    md += `\n</details>\n\n`;
  }
}
if (shellEx.length) {
  md += `## 껍데기로 센 페이지 예 (${shellEx.length})\n\n`;
  md += `차단 화면은 아닌데 카탈로그 상품명이 화면 글에 없어 '사이트 미표기(none)'로 적지 않은 페이지.\n\n`;
  for (const x of shellEx) md += `- ${String(x.name).slice(0, 60)} — ${x.url}\n  > ${x.head.replace(/\|/g, "/")}\n`;
  md += `\n`;
}
if (compConflicts.length) {
  md += `## 혼용률이 엇갈린 상품 (${compConflicts.length})\n\n`;
  md += `지금 페이지에서 읽은 값이 이미 있던 값과 다르다. 보관본 값이었으면 지금 페이지 값으로 바꿨고(바꿈),\n`;
  md += `지금 페이지에서 읽었던 값이면 그대로 뒀다(유지).\n\n| 브랜드 | 상품 | 있던 값 | 지금 페이지 | 처리 |\n|---|---|---|---|---|\n`;
  for (const x of compConflicts.slice(0, 100)) {
    md += `| ${x.brand} | ${x.url} | ${String(x.old).replace(/\n/g, " ‖ ")}${x.oldVia ? ` (${x.oldVia} ${x.oldWd})` : ""} | ${String(x.live).replace(/\n/g, " ‖ ")} | ${x.act === "replace" ? "바꿈" : "유지"} |\n`;
  }
  md += `\n`;
}
if (guardHeld.length) {
  md += `## 저장 직전 가드가 보류한 혼용률 (${guardHeld.length})\n\n`;
  md += `이 브랜드의 다른 상품에도 똑같이 되풀이되는 값이라 상품의 소재가 아니라 페이지 틀(메뉴·배너·추천 블록)의 글로 보고\n`;
  md += `저장하지 않았다(scripts/comp-guard.mjs). 칸은 비어 있고 재시도 기간이 지나면 다시 읽는다.\n\n| 브랜드 | 상품 | 읽은 값 | 이유 |\n|---|---|---|---|\n`;
  for (const x of guardHeld.slice(0, 100)) {
    md += `| ${x.brand} | [${String(x.name || "(이름 없음)").replace(/\|/g, "/").slice(0, 60)}](${x.url}) | ${String(x.comp).replace(/\n/g, " ‖ ")} | ${x.why.replace(/\|/g, "/")} |\n`;
  }
  md += `\n`;
}
// ── 측정 실행의 표본(DRY) ─────────────────────────────────────────
if (DRY && samples.size) {
  md += `## 브랜드별 표본 — 사람이 열어 확인할 것\n\n`;
  md += `채운 것: 이번에 읽은 값 · 출처 · 그 값을 페이지 글에서 다시 찾은 자리(추출기와 따로 찾음 — 못 찾으면 비어 있다).\n`;
  md += `빈 것: 페이지는 읽었는데 혼용률이 없던 상품(사이트 미표기로 적었을 것). 못 읽음: 막힘·껍데기·값 없음.\n\n`;
  for (const [brand, x] of [...samples].sort((a, z) => (a[0] < z[0] ? -1 : 1))) {
    md += `### ${brand} — 채움 ${x.filledN} · 빈 것 ${x.noneN} · 못 읽음 ${x.blockedN}\n\n`;
    for (const f of x.filled) md += `- ✅ ${f.url}\n  - 값: **${f.comp.replace(/\n/g, " ‖ ")}** (${f.src || "?"})\n  - 페이지 글: ${(f.ev || "(다시 찾지 못함)").replace(/\|/g, "/").slice(0, 320)}\n`;
    for (const f of x.none) md += `- ⬜ 빈 것(${f.why}) · ${f.url}\n`;
    for (const f of x.blocked) md += `- ⛔ ${f.why} · ${f.url}\n`;
    md += `\n`;
  }
}
// ── 웹 아카이브 층 ─────────────────────────────────────────────────
if (WAYBACK) {
  const tried = done.filter((r) => r.tried);
  md += `## 웹 아카이브 층\n\n`;
  md += `조회 ${wb.used}/${WAYBACK_MAX}개(브랜드당 ${WAYBACK_PER_BRAND}) · 요청 ${wb.calls}회 · 429 ${wb.r429} · 5xx ${wb.r5xx} · ` +
    `네트워크 오류 ${wb.neterr} · 쿼리 포함 주소로만 찾은 것 ${wb.withQuery}` +
    (wb.off ? ` · **이 실행 도중 층을 껐다: ${wb.offWhy}**` : "") + `\n\n`;
  md += `| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |\n` +
    `|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
  for (const r of tried.sort((a, z) => (z.tried || 0) - (a.tried || 0))) {
    const st = r.stat || {};
    md += `| ${r.brand} | ${r.tried} | ${r.liveComp || 0} | ${r.arcComp || 0} | ${st.wbNone || 0} | ${st.wbReject || 0} | ` +
      `${st.wbUrl || 0} | ${st.wbErr || 0} | ${st.wbSkip || 0} | ${Math.round((r.ms || 0) / 1000)}s |\n`;
  }
  md += `\n사유별 개수: ${Object.entries(wb.reasons).map(([k, v]) => `${k} ${v}`).join(" · ") || "없음"}\n\n`;
  const exKeys = Object.keys(wb.examples);
  if (exKeys.length) {
    md += `<details><summary>사유별 예시(최대 ${DRY ? 25 : 5}개)</summary>\n\n`;
    for (const k of exKeys) {
      md += `**${k}**\n\n`;
      for (const e of wb.examples[k]) md += `- ${e.brand} — ${e.url}${e.extra ? ` — ${e.extra.replace(/\|/g, "/")}` : ""}\n`;
      md += `\n`;
    }
    md += `</details>\n\n`;
  }
}
const errs = rows.filter((r) => r.error);
if (errs.length) {
  md += `## 읽기 실패 (${errs.length})\n\n`;
  for (const r of errs) md += `- ${r.brand}: ${r.error}\n`;
}
writeFileSync(join(ROOT, REPORT_FILE), md);
console.log(`\n혼용률 ${totalHave}/${totalItems} (${compPct}%, +${totalComp}) · 컬러 ${totalColor}/${totalItems} (${colorPct}%, +${totalColorAdd}) · 인덱스 ${indexCount}`);
console.log(`컬러웨이·혼용률이 다 붙는 브랜드 ${ready.length}/${done.filter((r) => r.total).length}개 · 전체 평균 혼용률 ${compPct}% 컬러 ${colorPct}%`);
