// PC 수집(pc-collect)의 두 가지 한도 — 순수 함수만 있다(브라우저·네트워크 없음, test-pc-plan.mjs 가 직접 돌린다).
//
//  1. 정중한 접속(polite) — 쇼핑몰 한 곳에 무리하지 않는다.
//     · 같은 주소(URL)는 한 실행에 최대 3번까지만 연다(maxPerUrl).
//     · 같은 호스트로 가는 요청 사이는 최소 1초(gapMs).
//     · 어떤 호스트든 429(요청 과다)를 한 번 받으면, 이 실행에서는 그 호스트에 더 묻지 않는다.
//  2. 쓰기 예산(writes) — Cloudflare KV 무료 한도(하루 약 1,000번 쓰기)를 지킨다.
//     · 한 실행의 저장 요청 수 상한(budget).
//     · 같은 종류(catalog·overlay·details·index)·같은 브랜드(site)는 한 실행에 한 번만 보낸다
//       — 실패해도 다시 보내지 않는다(재시도가 쓰기를 세 배로 늘리지 않게). 이전 저장본이 그대로 남는다.
//
// 상태(state)는 JSON 으로 그대로 파일에 쓸 수 있는 모양이다 — 단계(수집·혼용률·컬러)가 따로 도는
// 프로세스라 파일로 이어 받는다(scripts/pc-browser-hooks.mjs).

export const POLITE_DEFAULTS = { gapMs: 1000, maxPerUrl: 3 };

export function emptyRunState(budget) {
  return {
    polite: { perUrl: {}, lastAt: {}, stopped: {}, navs: 0, refused: [] },
    writes: { budget: Math.max(0, Number(budget) || 0), used: 0, seen: {}, log: [], lists: 0 },
    launches: [],
  };
}

export const hostOf = (u) => { try { return new URL(u).host.toLowerCase(); } catch (e) { return ""; } };
export const urlKey = (u) => String(u || "").split("#")[0];

// 요청을 보내기 전에 부른다. 돌려주는 값: { ok: true, waitMs } | { ok: false, why }
// ok 이면 이 요청을 센 것이다(보내지 않아도 센다 — 보수적으로).
export function politeBefore(p, url, now, opts = {}) {
  const gapMs = opts.gapMs ?? POLITE_DEFAULTS.gapMs;
  const maxPerUrl = opts.maxPerUrl ?? POLITE_DEFAULTS.maxPerUrl;
  const host = hostOf(url);
  if (!host) return { ok: true, waitMs: 0 };
  if (p.stopped[host]) return { ok: false, why: `STOP429 ${host} — 이 실행에서 429 를 받아 더 묻지 않음` };
  const key = urlKey(url);
  const n = p.perUrl[key] || 0;
  if (n >= maxPerUrl) return { ok: false, why: `PER_URL_LIMIT — 같은 주소를 이미 ${n}번 열었음(한 실행 ${maxPerUrl}번까지)` };
  p.perUrl[key] = n + 1;
  const at = Math.max(now, (p.lastAt[host] || 0) + gapMs);
  p.lastAt[host] = at;
  p.navs++;
  return { ok: true, waitMs: at - now };
}

// 응답을 받은 뒤 부른다. 429 면 그 호스트를 멈춘다. 돌려주는 값: 이번에 멈췄으면 true
export function politeAfter(p, url, status) {
  if (Number(status) !== 429) return false;
  const host = hostOf(url);
  if (!host || p.stopped[host]) return false;
  p.stopped[host] = urlKey(url);
  return true;
}

// Worker 요청을 나눈다: 쓰기(store=…) · 목록 읽기(catalogs=1 — KV list 한도가 따로 있다) · 그 밖의 읽기.
export function classifyWorker(url, method, body) {
  let u;
  try { u = new URL(url); } catch (e) { return { type: "read" }; }
  const m = String(method || "GET").toUpperCase();
  const kind = u.searchParams.get("store");
  if (m === "POST" && kind) {
    let site = u.searchParams.get("site") || "";
    if (!site && typeof body === "string") {
      try { const j = JSON.parse(body); site = String((j && j.site) || ""); } catch (e) {}
    }
    return { type: "write", kind, site: site.toLowerCase() };
  }
  if (m !== "GET" && m !== "HEAD") return { type: "write", kind: "other", site: "" };
  if (u.searchParams.get("catalogs")) return { type: "list" };
  return { type: "read" };
}

// 쓰기 하나를 보낼지 정한다. 돌려주는 값: { ok, why }. ok 이면 센다.
export function writeDecide(w, kind, site, step, now) {
  const key = `${kind}|${site}`;
  let why = "";
  if (w.seen[key]) why = `같은 브랜드·같은 종류(${kind}${site ? " " + site : ""})는 한 실행에 한 번만`;
  else if (w.used >= w.budget) why = `쓰기 예산 ${w.budget}번을 다 씀`;
  const ok = !why;
  if (ok) { w.used++; w.seen[key] = 1; }
  w.log.push({ step: step || "", kind, site, ok, ...(why ? { why } : {}), at: new Date(now).toISOString() });
  return { ok, why };
}
