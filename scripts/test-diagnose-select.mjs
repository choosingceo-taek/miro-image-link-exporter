#!/usr/bin/env node
// 목록 페이지 진단(scripts/diagnose-page.mjs)이 '무엇을 진단할지' 고르는 규칙을 못 박는다.
//
// 예전엔 워크플로에 주소 4개가 박혀 있어서, 수집기가 이미 잘 모으는 페이지를 매일
// '막힌 페이지'로 진단했다. 지금은 그날 헤드리스 수집 리포트에서 상품 0개로 끝난
// 페이지만 고른다. 여기서 차단(403·봇 확인·응답 없음)이나 마감으로 미룬 것을 골라 버리면
// 진단 리포트가 '선택자 문제'처럼 보여 엉뚱한 곳을 고치게 된다.
//
// 진짜 스크립트를 가짜 리포트로 돌린다(브라우저 없이).
//   LIST_ONLY=1 — 고른 주소만 찍고 끝난다
//   고를 것이 없으면 '진단할 것 없음' 리포트를 쓰고 끝나야 한다 — 이때는 playwright 를
//   불러오기만 해도 실패하도록 막아 두고 돌린다(브라우저를 띄우지 않는다는 증거).
import { spawnSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = join(ROOT, "scripts/diagnose-page.mjs");
const TMP = mkdtempSync(join(tmpdir(), "diag-select-"));

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };
const ok = (m) => console.log("  ✅ " + m);

// playwright 를 불러오려 하면 바로 죽게 하는 모듈 훅.
const HOOK = join(TMP, "no-playwright.mjs");
writeFileSync(HOOK, `
import { register } from "node:module";
register("data:text/javascript," + encodeURIComponent(
  "export async function resolve(s, c, next) { if (/^playwright/.test(s)) throw new Error('NO_BROWSER_ALLOWED'); return next(s, c); }"));
`);

function run(report, extraEnv = {}, args = []) {
  const rp = join(TMP, "report.json");
  writeFileSync(rp, JSON.stringify(report));
  const r = spawnSync(process.execPath, ["--import", HOOK, SCRIPT, ...args], {
    // 추가 브랜드 잡 리포트는 기본으로 '없음'(저장소에 실제 파일이 있어도 끼지 않게) — 필요한 시험만 준다.
    env: { ...process.env, URLS: "", REPORT: rp, EXTRA_REPORT: join(TMP, "no-extra.json"), OUT: join(TMP, "diag.md"), ...extraEnv },
    encoding: "utf8", timeout: 30_000,
  });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}
const pick = (report) => {
  const r = run(report, { LIST_ONLY: "1" });
  if (r.code !== 0) { fail("LIST_ONLY 실행 실패: " + r.out.slice(0, 300)); return []; }
  return JSON.parse(r.out.trim().split("\n").pop());
};

// 실제 browser-collect-report.json 모양을 따른다(note 문구도 수집기가 쓰는 그대로).
const zero = (url, note = "상품 0개 · 최종주소 x · 제목 \"x\" · 링크 10/이미지 0") => ({ url, count: 0, note });
const REPORT = {
  results: [
    { brand: "A", site: "a.com.a", collected: 0, perUrl: [
      zero("https://a.com/tops"),
      { url: "https://a.com/dresses", count: 40, note: "" },          // 잘 모인 페이지 — 고르면 안 된다
      zero("https://a.com/pants", "HTTP 403"),
      zero("https://a.com/shirts", "봇 차단 페이지"),
      zero("https://a.com/sweat", "오류: 응답 없음(차단 의심) — 헤더조차 60초 안에 안 옴"),
      zero("https://a.com/429", "HTTP 429"),
    ] },
    { brand: "B", site: "b.com.b", collected: 0, perUrl: [
      zero("https://b.com/1"), zero("https://b.com/2"), zero("https://b.com/1"),   // 중복은 한 번만
      zero("https://b.com/err", "오류: net::ERR_NAME_NOT_RESOLVED"),               // 오류도 진단 대상
    ] },
    // 마감으로 미룬 브랜드 · 마감으로 중단된 브랜드는 선택자 문제가 아니다
    { brand: "C", site: "c.com.c", collected: 0, deferred: true, perUrl: [zero("https://c.com/x", "마감으로 미룸")] },
    { brand: "D", site: "d.com.d", collected: 3, cut: true, perUrl: [zero("https://d.com/x")] },
    { brand: "E", site: "e.com.e", collected: 0, perUrl: [zero("https://e.com/x", "마감으로 미룸")] },
    { brand: "F", site: "f.com.f", collected: 0, perUrl: [zero("https://f.com/1"), zero("https://f.com/2"), zero("https://f.com/3"), zero("https://f.com/4")] },
  ],
};

try {
  // ── 고르기 ──
  {
    const got = pick(REPORT);
    const want = ["https://a.com/tops", "https://b.com/1", "https://b.com/2", "https://b.com/err", "https://f.com/1", "https://f.com/2"];
    if (JSON.stringify(got) !== JSON.stringify(want)) fail(`고른 주소가 다르다\n     기대 ${JSON.stringify(want)}\n     실제 ${JSON.stringify(got)}`);
    else ok("0개 페이지만 · 차단(403/429/봇 차단/응답 없음)·마감 제외 · 중복 제거 · 최대 6개");
    if (got.length > 6) fail(`최대 6개인데 ${got.length}개`);
  }
  // ── 추가 브랜드 잡 리포트(browser-collect-extra-report.json)의 0개 페이지도 고른다 ──
  {
    const xp = join(TMP, "extra.json");
    writeFileSync(xp, JSON.stringify({ results: [{ brand: "Gap", perUrl: [zero("https://gap.example/tops"), { url: "https://gap.example/ok", count: 50, note: "" }] }] }));
    const r = run({ results: [{ brand: "A", perUrl: [zero("https://a.com/tops")] }] }, { LIST_ONLY: "1", EXTRA_REPORT: xp });
    const got = r.code === 0 ? JSON.parse(r.out.trim().split("\n").pop()) : null;
    if (JSON.stringify(got) !== JSON.stringify(["https://a.com/tops", "https://gap.example/tops"])) fail("추가 브랜드 잡 리포트의 0개 페이지를 고르지 않는다: " + r.out.slice(0, 200));
    else ok("추가 브랜드 잡 리포트의 0개 페이지도 고른다");
  }
  // ── 주소를 직접 주면 리포트는 보지 않는다 ──
  {
    const r = run(REPORT, { LIST_ONLY: "1", URLS: "https://x.com/a, https://x.com/b" });
    if (r.code !== 0 || r.out.trim().split("\n").pop() !== JSON.stringify(["https://x.com/a", "https://x.com/b"])) {
      fail("URLS 를 직접 줬는데 그대로 안 쓴다: " + r.out.slice(0, 200));
    } else ok("URLS 를 직접 주면 그 주소만 본다");
  }
  // ── 고를 것이 없으면: 리포트를 쓰고, 브라우저 없이 0 으로 끝난다 ──
  for (const [label, report] of [
    ["전부 잘 모였거나 차단·마감뿐", { results: [
      { brand: "A", perUrl: [{ url: "https://a.com/1", count: 30, note: "" }, zero("https://a.com/2", "HTTP 403")] },
      { brand: "C", deferred: true, perUrl: [zero("https://c.com/x", "마감으로 미룸")] },
      { brand: "D", cut: true, perUrl: [zero("https://d.com/x")] },
    ] }],
    ["리포트가 비어 있음", {}],
  ]) {
    const out = join(TMP, "diag.md");
    if (existsSync(out)) rmSync(out);
    const r = run(report);
    if (r.code !== 0) fail(`[${label}] 종료 코드 ${r.code} — ${r.out.slice(0, 300)}`);
    else if (/NO_BROWSER_ALLOWED/.test(r.out)) fail(`[${label}] 진단할 것이 없는데 브라우저 모듈을 불러왔다`);
    else if (!existsSync(out) || !/진단할 것이 없습니다/.test(readFileSync(out, "utf8"))) fail(`[${label}] '진단할 것 없음' 리포트가 없다`);
    else ok(`[${label}] '진단할 것 없음' 리포트를 쓰고 브라우저 없이 끝난다`);
  }
  // 훅이 실제로 막는지(그래야 위 검사가 의미가 있다).
  {
    const r = run({ results: [{ brand: "A", perUrl: [zero("https://a.com/1")] }] });
    if (r.code === 0 || !/NO_BROWSER_ALLOWED/.test(r.out)) fail("playwright 차단 훅이 동작하지 않는다 — 위 '브라우저 없이' 검사를 믿을 수 없다");
    else ok("(확인) 진단할 것이 있으면 브라우저 모듈을 부른다 — 훅이 그걸 잡는다");
  }
} finally {
  rmSync(TMP, { recursive: true, force: true });
}

if (bad) { console.error(`\n진단 대상 고르기 ${bad}건 실패`); process.exit(1); }
console.log("✅ 진단 대상 고르기 통과");
