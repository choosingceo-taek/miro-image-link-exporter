#!/usr/bin/env node
// PC 수집(pc-collect)의 브랜드·엔진 고르기 — 순수 함수(브라우저·네트워크 없음). test-pc-plan.mjs 가 직접 돌린다.
//
// 대상: Render blocked-brands.json 의 brands(= 크롬 확장 담당 그룹). 데이터센터(GitHub·Render)에서 막혀
// 지금은 owner PC 의 크롬 확장만 읽는 브랜드다. PC 의 자동 러너가 같은 PC·같은 IP 에서 진짜 브라우저로 돈다.
//
// 브랜드마다 엔진·설정을 접근 지도(access-map.json — 데이터센터 측정)에서 고른다:
//   · 크롬은 막히는데 파이어폭스는 열린 브랜드(데이터센터에서 파이어폭스 성공률 ≥ 50%, 크롬보다 높음) → firefox
//       예: H&M·Arket·&Other Stories·L.L bean 목록(크롬만 Akamai/Cloudflare 403), Patagonia·WHBM 상품 페이지
//   · 파이어폭스 '새 창'(카테고리마다 쿠키 없는 창)이 한 창보다 잘 열린 브랜드 → fresh
//       예: Garnet hill·Massimo Dutti 목록 — 첫 페이지만 열리고 다음부터 막혔다
//   · 측정 기록에 "첫 URL/첫 카테고리만 열림"이 적힌 브랜드 → fresh (예: Chico's·WHBM·Anthropologie·Prana)
//   · 그 밖(모든 무료 엔진이 데이터센터에서 막힘 — Akamai·DataDome·Vercel·PerimeterX) → chrome
//       근거: 같은 PC·같은 IP 의 진짜 크롬(확장)은 이 브랜드들을 읽는다(owner 확인 2026-11-27: WHBM 이 회사 PC 크롬에서 열림)
// 그 위에 PC 에서 잰 결과(pc-collect-state.json)를 얹는다:
//   · 고른 엔진이 PC 에서 2번 연달아 봇 차단 → 다른 엔진으로 바꾼다
//   · 크롬·파이어폭스 둘 다 PC 에서 2번 연달아 봇 차단 → 그 브랜드는 멈춘다(기록하고 14일 뒤 한 번 다시 본다).
//     집·회사 IP 의 진짜 브라우저로도 막히는 곳은 우회하지 않는다 — 확장 담당으로 남긴다.
// 사람이 고칠 곳: pc-brands.json 의 overrides(엔진·새 창·멈춤을 브랜드별로 못박기).
//
//   node scripts/pc-plan.mjs              지금 저장소 파일만으로 계획 표를 찍는다(Render 대신 접근 지도의 확장 그룹)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const STRIKES = 2;          // 연달아 이만큼 막히면 엔진을 바꾸거나 멈춘다
export const STOP_DAYS = 14;       // 멈춘 브랜드를 다시 보기까지
export const DAY = 86_400_000;
export const normBrand = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
const other = (e) => (e === "chrome" ? "firefox" : "chrome");

// 접근 지도 측정 하나(measured[engine])의 성공률. 측정이 없으면 null.
function rate(m) {
  if (!m || !(Number(m.n) > 0)) return null;
  return Number(m.ok || 0) / Number(m.n);
}
const FIRST_ONLY_RX = /첫\s*(?:URL|카테고리|페이지)\s*(?:만|하나)|first page only/i;

// 접근 지도 한 브랜드의 한 단계(listing | product)에서 PC 엔진을 고른다.
export function evidenceEngine(entry, stage = "listing") {
  const s = (entry && entry[stage]) || {};
  const m = s.measured || {};
  const pw = rate(m.playwright), ff = rate(m.firefox), fr = rate(m["firefox-fresh"]);
  const best = Math.max(ff ?? -1, fr ?? -1);
  const text = `${s.cause || ""} ${s.fix || ""}`;
  const fmt = (k, x) => (m[k] ? `${k} ${m[k].ok}/${m[k].n}` : "");
  const meas = [fmt("playwright", pw), fmt("firefox", ff), fmt("firefox-fresh", fr)].filter(Boolean).join(" · ");
  if (best >= 0.5 && best > (pw ?? 0)) {
    const fresh = (fr ?? -1) > (ff ?? -1);
    return { engine: "firefox", fresh, why: `데이터센터 측정 ${meas} — 크롬보다 파이어폭스${fresh ? "(새 창)" : ""}가 열림` };
  }
  const fresh = FIRST_ONLY_RX.test(text);
  const by = (entry && entry.blocker && entry.blocker.by) || "";
  return {
    engine: "chrome", fresh,
    why: (meas ? `데이터센터 측정 ${meas}${by ? `(${by})` : ""} — ` : "측정 없음 — ") +
      ((pw ?? 0) >= 0.5 ? "데이터센터 크롬도 열림 — 확장과 같은 크롬으로" : "집·회사 IP 의 진짜 크롬(확장)이 읽는 브랜드") +
      (fresh ? " · 기록에 '첫 페이지만 열림' → 카테고리마다 새 창" : ""),
  };
}

// 한 브랜드·한 단계의 최종 선택. ov = pc-brands.json 의 그 브랜드 항목, st = PC 측정 기록(그 단계).
// 돌려주는 값: { engine, fresh, why, stop } — stop 이 있으면 이번에는 돌지 않는다.
export function choose({ entry, stage = "listing", ov = null, st = null, stoppedUntil = 0, now = Date.now(), have = { chrome: true, firefox: true } }) {
  let pick = evidenceEngine(entry, stage);
  const ovEngine = ov && (stage === "product" ? ov.productEngine || ov.engine : ov.engine);
  if (ov && ov.stop) return { ...pick, stop: `pc-brands.json 에서 멈춤: ${ov.stop}` };
  if (ovEngine && ["chrome", "firefox"].includes(ovEngine)) {
    const fresh = stage === "product" && ov.productFresh !== undefined ? !!ov.productFresh : ov.fresh !== undefined ? !!ov.fresh : pick.fresh;
    pick = { engine: ovEngine, fresh, why: `pc-brands.json 에서 지정${ov.evidence ? " — " + ov.evidence : ""}` };
  }
  const fails = (e) => Number((((st || {})[e]) || {}).fails || 0);
  if (fails(pick.engine) >= STRIKES) {
    if (fails(other(pick.engine)) >= STRIKES) {
      if (stoppedUntil > now) {
        return { ...pick, stop: `PC 에서 크롬·파이어폭스 모두 ${STRIKES}번 연달아 봇 차단 — 확장 담당 유지, ${new Date(stoppedUntil).toISOString().slice(0, 10)} 에 다시 봄` };
      }
      pick = { ...pick, why: pick.why + ` · PC 에서 둘 다 막혔던 브랜드 — ${STOP_DAYS}일 지나 다시 봄` };
    } else {
      const e = other(pick.engine);
      pick = { engine: e, fresh: e === "firefox" ? true : pick.fresh, why: `PC 에서 ${pick.engine} 가 ${fails(pick.engine)}번 연달아 봇 차단 → ${e}${e === "firefox" ? "(새 창)" : ""}로 바꿈` };
    }
  }
  if (!have[pick.engine]) {
    const e = other(pick.engine);
    if (!have[e]) return { ...pick, stop: "이 PC 에서 크롬도 파이어폭스도 못 띄움" };
    pick = { ...pick, engine: e, why: `${pick.why} · 이 PC 에서 ${pick.engine} 를 못 띄워 ${e} 로` };
  }
  return pick;
}

const PRODUCT_RANK = { blocked: 0, "home-only": 1, partial: 2, misread: 3, works: 4 };

// 하루치 계획.
//   renderBrands  Render blocked-brands.json 의 brands(이름 배열)
//   accessMap     access-map.json 의 brands 배열
//   overrides     pc-brands.json 의 overrides({ 이름: {...} })
//   state         pc-collect-state.json
//   only          사람이 고른 브랜드(BRANDS 입력) — 주면 그 브랜드만, 신선도·멈춤과 무관하게
//   catalogs      Worker ?catalogs=1 의 list(없으면 null) — updated 가 freshHours 안이면 목록 수집을 건너뛴다
//                 (확장이 어젯밤 돌았으면 PC 는 쓰기를 아낀다 · 확장이 빠진 날만 PC 가 채운다)
//   datacenter    데이터센터 야간 수집이 이미 도는 브랜드(browser-extra-brands.json) — catalogs 가 없을 때만 쓴다
//   extra         Render 확장 그룹 밖이지만 PC 가 함께 볼 브랜드(pc-brands.json 의 add — 예: 서버 담당인데 막히는 WHBM).
//                 저장은 합치기(store: "merge")로 — 서버가 쌓아 온 카탈로그를 줄이지 않게.
export function buildPlan({ renderBrands = [], accessMap = [], overrides = {}, state = {}, only = [], catalogs = null,
  datacenter = [], extra = [], freshHours = 20, now = Date.now(), have = { chrome: true, firefox: true } }) {
  const byName = new Map(accessMap.map((b) => [normBrand(b.brand), b]));
  const ovBy = new Map(Object.entries(overrides || {}).map(([k, v]) => [normBrand(k), v]));
  const want = new Set(only.map(normBrand).filter(Boolean));
  const dc = new Set(datacenter.map(normBrand));
  const cat = new Map();
  for (const c of catalogs || []) {
    const k = normBrand(c.brand);
    if (!k) continue;
    const t = Number(c.updated) || 0;
    const ms = t && t < 1e12 ? t * 1000 : t;
    if (!cat.has(k) || ms > cat.get(k).updated) cat.set(k, { updated: ms, count: Number(c.count) || 0 });
  }
  const names = [];
  for (const n of renderBrands) if (n && !names.some((x) => normBrand(x) === normBrand(n))) names.push(String(n));
  const addBy = new Map();
  for (const x of extra || []) {
    const n = String((x && x.brand) || "").trim();
    if (!n || names.some((y) => normBrand(y) === normBrand(n))) continue;
    names.push(n);
    addBy.set(normBrand(n), x);
  }
  const collect = [], enrich = [], skipped = [];
  for (const brand of names) {
    const k = normBrand(brand);
    if (want.size && !want.has(k)) continue;
    const entry = byName.get(k) || null;
    const ov = ovBy.get(k) || null;
    const bs = ((state && state.brands) || {})[k] || {};
    // 목록(카테고리) 수집
    const L = choose({ entry, stage: "listing", ov, st: bs.collect, stoppedUntil: Number(bs.stoppedUntil) || 0, now, have });
    const c = cat.get(k);
    let skip = L.stop || "";
    if (!skip && !want.size) {
      if (catalogs && c && c.updated && now - c.updated < freshHours * 3_600_000) {
        skip = `목록이 ${Math.round((now - c.updated) / 3_600_000)}시간 전에 저장됨(확장·야간 수집) — 쓰기를 아끼려고 건너뜀`;
      } else if (!catalogs && dc.has(k)) {
        skip = "데이터센터 야간 수집(browser-extra-brands.json)이 도는 브랜드 — 저장 목록을 못 읽어 겹치지 않게 건너뜀";
      }
    }
    if (skip) skipped.push({ brand, stage: "listing", why: skip });
    else {
      const add = addBy.get(k);
      collect.push({ brand, engine: L.engine, fresh: !!L.fresh, why: L.why + (add ? ` · Render 확장 그룹 밖(pc-brands.json add${add.why ? ": " + add.why : ""}) — 합쳐 저장` : ""),
        store: add && add.store !== "replace" ? "merge" : "replace" });
    }
    // 상품 페이지 보강(혼용률 → 컬러) — 목록을 건너뛰어도 보강은 한다(상품 페이지는 데이터센터에서 막힌다)
    const P = choose({ entry, stage: "product", ov, st: bs.product, stoppedUntil: Number(bs.productStoppedUntil) || 0, now, have });
    if (P.stop) skipped.push({ brand, stage: "product", why: P.stop });
    else {
      const status = (entry && entry.product && entry.product.status) || "";
      enrich.push({ brand, engine: P.engine, fresh: !!P.fresh, why: P.why, rank: PRODUCT_RANK[status] ?? 2,
        compPct: entry && entry.comp ? Number(entry.comp.pct) || 0 : 0 });
    }
  }
  // 쓰기 예산이 모자라면 뒤에서부터 빠진다 — 데이터센터에서 막힌 정도가 큰 브랜드, 혼용률이 빈 브랜드가 앞.
  enrich.sort((a, b) => a.rank - b.rank || a.compPct - b.compPct);
  return { collect, enrich, skipped };
}

// 이번 PC 실행 결과를 측정 기록에 반영한다.
//   collectResults: browser-collect 리포트의 results — { brand, engine(chromium|firefox), collected, verdict }
//   enrichRows:     혼용률 보강 표 — { brand, engine(chrome|firefox), tried, ok, none, blocked, shell }
export function updateState(state, { collectResults = [], enrichRows = [] }, now = Date.now()) {
  const out = { brands: { ...((state && state.brands) || {}) }, updated: new Date(now).toISOString() };
  const day = new Date(now).toISOString().slice(0, 10);
  const bump = (rec, engine, verdict) => {
    const cur = { fails: 0, oks: 0, ...(rec[engine] || {}) };
    if (verdict === "ok") { cur.fails = 0; cur.oks++; cur.lastOk = day; }
    else if (verdict === "blocked") cur.fails++;
    cur.last = day; cur.lastVerdict = verdict;
    rec[engine] = cur;
  };
  const both = (rec) => ["chrome", "firefox"].every((e) => Number((rec[e] || {}).fails || 0) >= STRIKES);
  for (const r of collectResults) {
    if (!r || !r.brand || r.cut || r.deferred) continue;
    const k = normBrand(r.brand);
    const b = { ...(out.brands[k] || {}), brand: r.brand };
    b.collect = { ...(b.collect || {}) };
    const engine = r.engine === "firefox" ? "firefox" : "chrome";
    const verdict = Number(r.collected) >= 20 ? "ok" : /차단/.test(String(r.verdict || "")) ? "blocked" : "thin";
    bump(b.collect, engine, verdict);
    if (verdict === "ok") delete b.stoppedUntil;
    else if (both(b.collect)) b.stoppedUntil = now + STOP_DAYS * DAY;
    out.brands[k] = b;
  }
  for (const r of enrichRows) {
    if (!r || !r.brand || !(Number(r.tried) > 0)) continue;
    const k = normBrand(r.brand);
    const b = { ...(out.brands[k] || {}), brand: r.brand };
    b.product = { ...(b.product || {}) };
    const engine = /firefox/.test(r.engine) ? "firefox" : "chrome";
    const read = Number(r.ok || 0) + Number(r.none || 0);
    const verdict = read > 0 ? "ok" : (Number(r.blocked || 0) + Number(r.shell || 0)) / Number(r.tried) >= 0.9 ? "blocked" : "thin";
    bump(b.product, engine, verdict);
    if (verdict === "ok") delete b.productStoppedUntil;
    else if (both(b.product)) b.productStoppedUntil = now + STOP_DAYS * DAY;
    out.brands[k] = b;
  }
  return out;
}

// enrich-comp-browser.mjs 리포트(md)의 표를 읽는다 — 그 스크립트는 JSON 을 남기지 않는다.
export function parseEnrichTable(md) {
  const rows = [];
  for (const line of String(md || "").split("\n")) {
    const m = line.match(/^\| (.+?) \| (.+?) \| (\d+) \| (\d+) \| \*\*(\d+)\*\* \| (\d+) \| (\d+) \| (\d+) \| (\d+) \|$/);
    if (!m) continue;
    rows.push({ brand: m[1], engine: m[2], total: +m[3], tried: +m[4], ok: +m[5], none: +m[6], shell: +m[7], blocked: +m[8], err: +m[9] });
  }
  return rows;
}

// 쓰기 예산 나누기: 목록 수집 1번/브랜드 → 혼용률 보강 2번/브랜드(오버레이 + 상품 상세) → 컬러 2번/브랜드 + 검색 인덱스 1번.
export const WRITES = { collect: 1, comp: 2, color: 2, colorFixed: 1 };
export function splitBudget(budget, nCollect, nEnrich, nColor) {
  let left = Math.max(0, Number(budget) || 0);
  const collect = Math.min(nCollect, Math.floor(left / WRITES.collect)); left -= collect * WRITES.collect;
  const comp = Math.min(nEnrich, Math.floor(left / WRITES.comp)); left -= comp * WRITES.comp;
  const color = left > WRITES.colorFixed ? Math.min(nColor, Math.floor((left - WRITES.colorFixed) / WRITES.color)) : 0;
  return { collect, comp, color };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
  const am = JSON.parse(readFileSync(join(ROOT, "access-map.json"), "utf8")).brands || [];
  let overrides = {};
  try { overrides = JSON.parse(readFileSync(join(ROOT, "pc-brands.json"), "utf8")).overrides || {}; } catch (e) {}
  let state = {};
  try { state = JSON.parse(readFileSync(join(ROOT, "pc-collect-state.json"), "utf8")); } catch (e) {}
  let add = [];
  try { add = JSON.parse(readFileSync(join(ROOT, "pc-brands.json"), "utf8")).add || []; } catch (e) {}
  const plan = buildPlan({ renderBrands: am.filter((b) => b.group === "extension").map((b) => b.brand), accessMap: am, overrides, state, extra: add });
  const cell = (x) => (x ? `${x.engine}${x.fresh ? " · 새 창" : ""}` : "—");
  console.log("| 브랜드 | 목록 | 상품 페이지 | 목록 근거 |\n|---|---|---|---|");
  const all = [...new Set([...plan.collect, ...plan.enrich, ...plan.skipped].map((x) => x.brand))];
  for (const b of all) {
    const c = plan.collect.find((x) => x.brand === b), p = plan.enrich.find((x) => x.brand === b);
    const s = plan.skipped.find((x) => x.brand === b && x.stage === "listing");
    console.log(`| ${b} | ${c ? cell(c) : "멈춤"} | ${cell(p)} | ${c ? c.why : s.why} |`);
  }
}
