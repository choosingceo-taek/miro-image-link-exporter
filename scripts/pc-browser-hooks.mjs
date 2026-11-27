// PC 수집용 덧붙임(preload) — 기존 수집기를 고치지 않고, PC 에서 돌 때만 브라우저 실행 방식과 한도를 바꾼다.
//
//   node --import ./scripts/pc-browser-hooks.mjs scripts/browser-collect.mjs
//   (scripts/pc-collect.mjs 가 이렇게 부른다 — 사람이 직접 부를 일은 없다)
//
// 하는 일(모두 PC 실행에서만 — 데이터센터 야간 실행에는 이 파일이 끼지 않는다):
//  1. 브라우저 — PC 에 설치된 진짜 구글 크롬(Playwright channel "chrome")을, 화면이 있으면 창을 띄워(headed) 연다.
//     창을 못 띄우는 환경(화면 없는 서비스 등)이면 같은 크롬을 창 없이 다시 연다. 파이어폭스도 창을 띄운다.
//  2. 있는 그대로의 브라우저(PC_NATIVE=1, 기본) — 수집기가 데이터센터용으로 넣은 위장 설정을 뺀다:
//     크롬 user-agent 덮어쓰기 · 시간대(미국 동부) 덮어쓰기 · navigator.webdriver 숨기기 ·
//     --disable-blink-features=AutomationControlled · --no-sandbox(PC 에서는 보안을 낮추므로) · --disable-http2.
//     이 PC 의 크롬이 자기 모습 그대로 사이트에 간다 — 확장이 그러듯이. 위장·우회 도구는 쓰지 않는다.
//     브라우저가 아닌 요청(컬러 보강의 fetch)도 크롬인 척하는 user-agent 를 빼고 자기 이름(PC_FETCH_UA)으로 보낸다.
//  3. 정중한 접속 — 같은 주소 한 실행 3번까지 · 같은 호스트 1초 간격 · 429 를 받은 호스트는 그 실행 내내 멈춤
//     (page.goto 와, 쇼핑몰로 가는 fetch 둘 다). 규칙은 scripts/pc-limits.mjs.
//  4. 쓰기 예산 — Worker 저장 요청(POST ?store=…)을 세고, 예산을 넘거나 같은 브랜드·같은 종류를 두 번 보내면
//     보내기 전에 막는다(그 브랜드는 이전 저장본이 그대로 남는다). 목록 읽기(?catalogs=1)도 센다.
//
// env (pc-collect.mjs 가 준다):
//   PC_RUN_FILE     단계 사이에 이어 받는 상태 파일(JSON) — 없으면 새로 만든다
//   PC_STEP         이 프로세스의 단계 이름(collect · comp-… · color) — 로그용
//   PC_WRITE_BUDGET 한 실행 쓰기 상한(상태 파일이 처음 만들어질 때만 쓴다)
//   PC_CHANNEL      chrome(기본) | "" (끔 — Playwright 가 받은 크로미움)
//   PC_HEADED       1(기본) 이면 창을 띄운다
//   PC_NATIVE       1(기본) 이면 2번의 위장 설정을 뺀다 · 0 이면 수집기 설정 그대로(데이터센터와 같은 비교 측정용)
//   PC_HOST_GAP_MS  같은 호스트 간격(기본 1000 · 최소 1000)
//   PC_MAX_PER_URL  같은 주소 상한(기본 3 · 최대 3)
//   WORKER_URL · RENDER_URL  이 둘로 가는 요청은 쇼핑몰 요청으로 세지 않는다
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { chromium, firefox } from "playwright";
import { emptyRunState, politeBefore, politeAfter, classifyWorker, writeDecide } from "./pc-limits.mjs";

const RUN_FILE = process.env.PC_RUN_FILE || "";
const STEP = process.env.PC_STEP || "";
const CHANNEL = process.env.PC_CHANNEL === undefined ? "chrome" : process.env.PC_CHANNEL;
const HEADED = process.env.PC_HEADED !== "0";
const NATIVE = process.env.PC_NATIVE !== "0";
const OPTS = {
  gapMs: Math.max(1000, Number(process.env.PC_HOST_GAP_MS) || 1000),
  maxPerUrl: Math.min(3, Math.max(1, Number(process.env.PC_MAX_PER_URL) || 3)),
};
const WORKER = (process.env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
const FETCH_UA = process.env.PC_FETCH_UA || "Mozilla/5.0 (compatible; market-research-pc-collector; Node.js fetch)";
const RENDER = (process.env.RENDER_URL || "https://market-research-uzs2.onrender.com").replace(/\/+$/, "");

let run = emptyRunState(process.env.PC_WRITE_BUDGET);
if (RUN_FILE && existsSync(RUN_FILE)) {
  try { const d = JSON.parse(readFileSync(RUN_FILE, "utf8")); if (d && d.polite && d.writes) run = { launches: [], ...d }; } catch (e) {}
}
const save = () => { if (RUN_FILE) try { writeFileSync(RUN_FILE, JSON.stringify(run, null, 1)); } catch (e) {} };
process.on("exit", save);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function politeGate(url) {
  const d = politeBefore(run.polite, url, Date.now(), OPTS);
  if (!d.ok) {
    run.polite.refused.push({ step: STEP, url: String(url).slice(0, 200), why: d.why });
    save();
    throw new Error(d.why);
  }
  if (d.waitMs > 0) await sleep(d.waitMs);
}
function politeSeen(url, status) {
  if (politeAfter(run.polite, url, status)) {
    console.log(`  !! [PC] ${new URL(url).host} 가 429(요청 과다) — 이 실행에서는 이 사이트에 더 묻지 않는다`);
    save();
  }
}

// ── fetch: Worker 쓰기 예산 · 쇼핑몰 정중한 접속 ──
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = String((input && input.url) || input);
  const method = (init && init.method) || (input && input.method) || "GET";
  if (url.startsWith(WORKER)) {
    const c = classifyWorker(url, method, init && init.body);
    if (c.type === "list") { run.writes.lists++; save(); }
    if (c.type === "write") {
      const d = writeDecide(run.writes, c.kind, c.site, STEP, Date.now());
      save();
      if (!d.ok) {
        console.log(`  !! [PC] 저장 요청을 보내지 않음 — ${d.why} (${run.writes.used}/${run.writes.budget})`);
        throw new Error("PC 쓰기 한도: " + d.why);
      }
      console.log(`  [PC] 저장 요청 ${run.writes.used}/${run.writes.budget} — ${c.kind}${c.site ? " " + c.site : ""}`);
      // Worker 가 받아들였는지(= KV put 1번) 적어 둔다 — 하루 쓰기 장부(kv-writes/)에 put 수로 남긴다.
      const entry = run.writes.log[run.writes.log.length - 1];
      const r = await realFetch(input, init);
      const j = await r.clone().json().catch(() => null);
      entry.put = !!(j && j.ok);
      if (entry.put && c.kind === "catalog" && /[?&]legacy=[^&]/.test(url)) entry.del = 1;   // legacy 를 주면 옛 키 delete 1
      if (!entry.put) entry.err = String((j && j.error) || "HTTP " + r.status).slice(0, 120);
      save();
      return r;
    }
    return realFetch(input, init);
  }
  if (url.startsWith(RENDER) || !/^https?:/i.test(url)) return realFetch(input, init);
  await politeGate(url);
  let opts = init;
  if (NATIVE) {
    const h = new Headers((init && init.headers) || (input && input.headers) || {});
    h.set("user-agent", FETCH_UA);
    opts = { ...(init || {}), headers: h };
  }
  const r = await realFetch(input, opts);
  politeSeen(url, r.status);
  return r;
};

// ── Playwright: 진짜 크롬 · 창 띄우기 · 위장 설정 빼기 · page.goto 정중하게 ──
const STRIP_ARGS = ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--disable-http2"];
function patchPage(page) {
  const goto = page.goto.bind(page);
  page.goto = async (url, opts) => {
    await politeGate(url);
    const resp = await goto(url, opts);
    politeSeen(url, resp ? resp.status() : 0);
    return resp;
  };
  return page;
}
function patchContext(ctx) {
  const newPage = ctx.newPage.bind(ctx);
  ctx.newPage = async (...a) => patchPage(await newPage(...a));
  if (NATIVE) {
    const addInit = ctx.addInitScript.bind(ctx);
    // 수집기가 넣는 'navigator.webdriver 숨기기' 만 뺀다(다른 초기 스크립트는 그대로).
    ctx.addInitScript = async (script, arg) => (/webdriver/.test(String(script)) ? undefined : addInit(script, arg));
  }
  return ctx;
}
function patchBrowser(browser) {
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (o = {}) => {
    const opts = { ...o };
    if (NATIVE) { delete opts.userAgent; delete opts.timezoneId; }
    return patchContext(await newContext(opts));
  };
  return browser;
}
function patchType(type, name) {
  const launch = type.launch.bind(type);
  type.launch = async (o = {}) => {
    const opts = { ...o };
    if (name === "chromium" && CHANNEL && !opts.executablePath) opts.channel = CHANNEL;
    if (NATIVE && Array.isArray(opts.args)) opts.args = opts.args.filter((a) => !STRIP_ARGS.includes(a));
    let headless = !HEADED, note = "";
    let browser;
    try {
      browser = await launch({ ...opts, headless });
    } catch (e) {
      if (headless) throw e;
      // 화면이 없는 환경(서비스로 도는 러너 · 화면 없는 리눅스) — 같은 브라우저를 창 없이 다시 연다.
      note = "창을 못 띄워 창 없이 엶: " + String((e && e.message) || e).split("\n")[0].slice(0, 120);
      headless = true;
      browser = await launch({ ...opts, headless });
    }
    const entry = { step: STEP, engine: name, channel: opts.channel || "", headless, native: NATIVE, version: browser.version(), ...(note ? { note } : {}) };
    run.launches.push(entry);
    save();
    console.log(`  [PC] ${name}${opts.channel ? " (" + opts.channel + ")" : ""} ${entry.version} — ${headless ? "창 없이" : "창 띄움"}${NATIVE ? " · 있는 그대로" : ""}${note ? " · " + note : ""}`);
    return patchBrowser(browser);
  };
}
patchType(chromium, "chromium");
patchType(firefox, "firefox");
