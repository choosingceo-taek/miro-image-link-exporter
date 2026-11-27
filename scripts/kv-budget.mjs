// KV 쓰기 집계 · 하루 쓰기 예산 — Cloudflare 무료 플랜은 KV put 이 하루 1,000회다(00:00 UTC = 09:00 KST 에 다시 찬다).
//
// 왜 있나: 2026-11-26·27 이틀 연속 한도가 찼다(11/26 07:36Z · 11/27 04:20Z, 야간 보강 로그의
// "KV put() limit exceeded for the day."). 한도가 차면 그날 남은 저장이 전부 실패한다 — 크롬 확장(23:00 KST)도.
// 데이터는 잃지 않지만(실패한 저장은 이전 저장본을 그대로 둔다) 새로 모은 것이 하나도 안 남는다.
//
// 이 파일이 하는 일:
//   1) 집계(WriteCounter) — 스크립트가 Worker 에 보낸 저장 요청 수와, 그 요청이 KV 에 일으킨 put·delete 수.
//      Worker 한 요청이 일으키는 put 은 worker/fabric-extractor.js 기준(DAILY-AUTOMATION.md '쓰기 예산' 표):
//        store=catalog → put 1(catalog:<site>, 메타데이터 포함) + legacy 를 주면 delete 1(삭제는 따로 하루 1,000회)
//        store=overlay → put 1(comp:<site>) · store=details → put 1(detail:<site>) · store=index → put 1(search:index)
//      브랜드 목록(?catalogs=1)은 따로 저장하지 않는다 — KV list() 로 읽을 때 만든다(쓰기 0).
//   2) 장부(kv-writes/<UTC 날짜>/<잡>-<실행>.json) — 이 저장소의 잡이 오늘 쓴 put 을 남긴다. 실행마다 파일이 따로라
//      동시에 돈 잡끼리 커밋이 부딪히지 않는다. 서버 프리페치(다른 저장소)·크롬 확장(사람 PC)은 여기 안 남으므로
//      예약분(KV_RESERVE)으로 미리 빼 둔다.
//   3) 예산(planWrites) — 오늘 남은 몫 = 한도 − 예약분 − 장부 합계. 모자라면 덜 중요한 쓰기부터 미룬다:
//      상세(detail:) → 검색 인덱스 → 오버레이(comp:) 순으로 멈춘다. 카탈로그 저장(수집)은 이 예산으로 막지 않는다.
//      미룬 것은 잃는 게 아니다 — 저장본은 그대로이고, 다음 실행이 같은 상품을 다시 읽어 채운다.
//
// 장부는 KV_LEDGER_DIR 을 줄 때만 읽고 쓴다(워크플로가 kv-writes 를 준다). 로컬·단위 테스트는 장부 없이 돈다.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const KV_DAY_LIMIT = 1000;
// 예약분 기본 300 = 서버 프리페치 약 80(11/25~27 측정: 카탈로그 75 + 인덱스 1)
//                + 크롬 확장 약 110(추정: 확장 담당 36개 × 카탈로그·오버레이·상세 3)
//                + 손으로 돌리는 실행 여유 약 110(헤드리스 재수집 한 번이 35 — 11/27 측정).
export const KV_RESERVE = 300;

// 쓰기 종류별 우선순위(작을수록 먼저 보낸다 = 예산이 모자랄 때 마지막까지 남는다).
// 주인이 정한 순서: ① 카탈로그(수집) ② 혼용률·컬러(comp: 오버레이) ③ 상세(detail:)·검색 인덱스.
// 같은 종류 안에서는 값이 바뀐 쓰기가 '시도 시각만 바뀐' 쓰기보다 먼저다.
export const PRIO = {
  catalog: -1,          // 수집 — 예산으로 막지 않는다
  overlay: 0,           // 혼용률·컬러·사이즈·가격·none 이 바뀜
  overlayStamp: 1,      // 시도 시각(t·ct·rv·cv·wt·bv)만 바뀜 — 안 보내면 다음 실행이 같은 상품을 다시 읽을 뿐
  index: 2,             // 검색 인덱스(search:index)
  details: 3,           // 상세 내용이 바뀜
  detailsStamp: 4,      // 상세의 읽은 시각(dt)만 바뀜
};
export const PRIO_NAME = { "-1": "카탈로그", 0: "오버레이", 1: "오버레이(시도 기록만)", 2: "검색 인덱스", 3: "상세", 4: "상세(읽은 시각만)" };

export const utcDay = (ms = Date.now()) => new Date(ms).toISOString().slice(0, 10);

const num = (v, d) => { const n = Number(v); return v != null && v !== "" && Number.isFinite(n) ? n : d; };
export function budgetEnv(env = process.env) {
  return {
    limit: Math.max(0, num(env.KV_DAY_LIMIT, KV_DAY_LIMIT)),
    reserve: Math.max(0, num(env.KV_RESERVE, KV_RESERVE)),
    dir: env.KV_LEDGER_DIR || "",
  };
}

// 오늘(UTC) 장부 — [{ job, run, part, at, start, mode, requests, puts, deletes, ... }]
export function readLedger(dir, day = utcDay()) {
  if (!dir) return [];
  const d = join(dir, day);
  if (!existsSync(d)) return [];
  const out = [];
  for (const f of readdirSync(d).filter((x) => x.endsWith(".json")).sort()) {
    try { const e = JSON.parse(readFileSync(join(d, f), "utf8")); if (e && typeof e === "object") out.push({ ...e, file: f }); } catch (e) {}
  }
  return out;
}
export const ledgerPuts = (entries) => entries.reduce((n, e) => n + (Number(e.puts) || 0), 0);

// 오늘 남은 몫. 음수면 0.
export function remainingToday({ limit, reserve, used }) { return Math.max(0, limit - reserve - used); }

// 장부에 이번 실행을 남긴다. 7일 넘은 날짜 폴더는 지운다(prune 을 준 잡만 — 동시에 지우다 부딪히지 않게).
export function writeLedger(dir, entry, { prune = false } = {}) {
  if (!dir) return "";
  const day = entry.day || utcDay(entry.at ? Date.parse(entry.at) : Date.now());
  const d = join(dir, day);
  mkdirSync(d, { recursive: true });
  const name = [entry.job, entry.run || "local", entry.part].filter(Boolean).join("-").replace(/[^\w.-]/g, "") + ".json";
  writeFileSync(join(d, name), JSON.stringify({ ...entry, day }, null, 1) + "\n");
  if (prune) {
    const keep = new Set(Array.from({ length: 7 }, (_, i) => utcDay(Date.now() - i * 86400000)));
    for (const x of readdirSync(dir)) if (/^\d{4}-\d\d-\d\d$/.test(x) && !keep.has(x)) rmSync(join(dir, x), { recursive: true, force: true });
  }
  return join(d, name);
}

// 집계 — 보낸 요청(재시도 포함) · KV put · delete · 종류별 · 변화 없어 건너뜀 · 예산으로 미룸 · 실패.
export class WriteCounter {
  constructor() {
    this.requests = 0; this.puts = 0; this.deletes = 0;
    this.byKind = {};        // kind → { requests, puts }
    this.same = 0;           // 저장본과 같아 보내지 않은 쓰기
    this.deferred = [];      // 예산으로 미룬 쓰기 [{kind, site, prio}]
    this.failed = [];        // 보냈는데 실패 [{kind, site, why}]
    this.would = 0;          // 저장하지 않는 실행(DRY·STORE=0)이 보냈을 요청
    this.wouldPuts = 0;
    this.limitHit = "";      // Worker 가 'limit exceeded' 를 돌려줬으면 그 글
  }
  kind(k) { return (this.byKind[k] = this.byKind[k] || { requests: 0, puts: 0, would: 0 }); }
  sent(k) { this.requests++; this.kind(k).requests++; }
  ok(k, { puts = 1, deletes = 0 } = {}) { this.puts += puts; this.deletes += deletes; this.kind(k).puts += puts; }
  wouldSend(k, puts = 1) { this.would++; this.wouldPuts += puts; this.kind(k).would++; }
  fail(k, site, why) {
    this.failed.push({ kind: k, site, why: String(why || "").slice(0, 160) });
    if (/limit exceeded/i.test(String(why))) this.limitHit = this.limitHit || String(why).slice(0, 160);
  }
  summary() {
    return { requests: this.requests, puts: this.puts, deletes: this.deletes, byKind: this.byKind, same: this.same,
      deferred: this.deferred.length, failed: this.failed.length, would: this.would, wouldPuts: this.wouldPuts, limitHit: this.limitHit };
  }
}

// 예산 안에서 보낼 것을 고른다. writes: [{ prio, puts(기본 1), ... }]. 우선순위 → 들어온 순서로 줄 세워
// 앞에서부터 남은 몫만큼. 카탈로그(prio < 0)는 몫과 상관없이 늘 보낸다.
export function planWrites(writes, remaining) {
  const order = writes.map((w, i) => ({ w, i })).sort((a, z) => (a.w.prio - z.w.prio) || (a.i - z.i));
  const send = [], cut = [];
  let used = 0;
  for (const { w } of order) {
    const p = w.puts == null ? 1 : w.puts;
    if (w.prio < 0 || used + p <= remaining) { send.push(w); if (w.prio >= 0) used += p; }
    else cut.push(w);
  }
  return { send, cut };
}

// 장부 줄 하나를 사람이 읽는 글로.
export function ledgerLine(e) {
  return `${e.job}${e.part ? "/" + e.part : ""} #${e.run || "?"} ${String(e.at || "").slice(11, 16)}Z — 요청 ${e.requests || 0} · put ${e.puts || 0}` +
    (e.deletes ? ` · delete ${e.deletes}` : "") + (e.mode ? ` · ${e.mode}` : "");
}
