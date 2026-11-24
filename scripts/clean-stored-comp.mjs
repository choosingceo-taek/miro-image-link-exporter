#!/usr/bin/env node
// 저장된 혼용률 정리 — 점검(docs/stored-comp-audit.md)이 '자동으로 지워도 되는 값'으로 고른 세 묶음만 지운다.
//
// 기본은 미리보기(dry)다. 아무것도 쓰지 않고, 지울 목록(stored-comp-clean-report.md · stored-comp-clean-plan.json)만 남긴다.
// GET/HEAD 가 아닌 요청은 보내기 전에 막는다(enrich-comp.mjs 의 DRY=1 과 같은 장치) — 쓰기는 APPLY=1 일 때만 열린다.
//
// 세 묶음(점검의 '정리 제안 A' — 사람이 볼 목록 B 는 손대지 않는다):
//   guard  저장 직전 가드(comp-guard.mjs)가 오늘 저장값에서 거르는 값 — 브랜드 전체에 되풀이되는 조각
//          (점검 때 Aritzia `Leather 100%` · Splendid · &Other Stories · Gymshark 의 `Cotton/Cashmere 100%` 줄)
//   row    상품이 아닌 행(카테고리·목록 주소)에 붙은 값 — 점검의 시그니처 F 에서, 끝이 상품 번호인 주소
//          (J.Crew `/p/…/categories/…/CX381` · Garnet Hill `…/categories/…/744396` — 진짜 상품)는 뺀다
//   short  카탈로그 상품에 실린, 퍼센트 합이 모자라거나 넘치는 값(합 5~106%) — 점검의 시그니처 E 중 '합이 N%'
// 상품 목록은 실행할 때 Worker 에서 새로 읽어 같은 규칙으로 고른다(값은 매일 밤 바뀐다 — 목록을 박아 두지 않는다).
//
// ── 혼용률이 어디에 저장돼 있나 ──
//   catalog:<site>  상품 목록. 상품마다 comp 칸이 있다(예전 수집기가 채운 것).
//   comp:<site>     오버레이 { 상품URL: { comp, color, sizes, price, priceOrig, t, ct, wt, none, nv, via, wd } }
//   화면·엑셀은 둘을 합친다(shared/product-core.js 의 mergeOverlay): 카탈로그 comp 가 있으면 그것, 없으면 오버레이 comp.
//   그래서 카탈로그 값이 틀리면 오버레이를 아무리 고쳐도 화면에는 카탈로그 값이 나간다 — 카탈로그 칸도 비워야 한다.
//
// ── 지울 때 바꾸는 것 ──
//   카탈로그: 대상 상품의 comp 칸만 비운다. 이름·사진·가격·카테고리·컬러·사이즈는 그대로.
//             Worker 에 카탈로그 칸 하나만 고치는 길은 없어서, 지금 목록을 읽어 comp 만 비운 채 같은 목록을
//             병합 저장(POST ?store=catalog, replace 없이)으로 다시 보낸다. 그 때문에 카탈로그의 '갱신 시각(updated)'은
//             이 실행 시각으로 바뀐다(상품 값은 그대로).
//   오버레이: 지울 값이 오버레이에 있으면 comp 와 그 출처 표시(via·wd)를 지운다. 컬러·사이즈·가격·ct 는 그대로.
//   다시 읽히게 하기: 지운 뒤 그 상품에 보일 값이 하나도 없으면, 오버레이에서 t(시도 시각) · wt(보관본 물어본 시각) ·
//             none·nv('사이트 미표기')를 함께 지운다. 야간 보강(enrich-comp.mjs)은 t 가 없는 상품을 '신상'으로 보고
//             첫 바퀴에 읽는다(5일 재시도 창·30일 보관본 창에 걸리지 않는다). 크롬 보강은 오버레이에 옳은 comp 가
//             없고 none 이 없으면 읽는다. none 이 남아 있으면 엑셀에 '정보 없음'으로 나가므로 반드시 지운다.
//             지운 뒤에도 보일 값이 남는 상품(카탈로그의 모자란 값 뒤에 오버레이의 온전한 값이 있던 경우)은
//             오버레이를 건드리지 않는다 — 그 값이 그대로 보인다.
//   상품이 아닌 행(row): 값만 지우고 시도 시각은 그대로 둔다. 다시 읽으면 목록 페이지의 아무 상품 소재가 또 붙을 수
//             있어서다. 진짜 해결은 그 행을 카탈로그에서 빼는 것이라 여기서는 하지 않고 리포트에 따로 적는다.
//
// ── 승인·되돌리기 ──
//   1) 미리보기(기본): 지울 목록과 개수를 남긴다. 담당자가 이 목록을 보고 승인한다.
//   2) 적용(APPLY=1): CONFIRM=apply-<승인한 목록의 개수> 가 맞아야 한다. 승인한 목록(PLAN, 기본 stored-comp-clean-plan.json)
//      에 있고 값도 그때와 똑같은 것만 지운다 — 승인 뒤에 새로 생긴 대상·값이 바뀐 대상은 지우지 않고 리포트에 남긴다.
//      STAGE=backup 은 지울 값 전부를 백업 파일에 적고 끝낸다(워크플로가 이 파일을 올리고 커밋한 뒤),
//      STAGE=write 는 그 백업에 똑같이 적힌 값만 지운다. STAGE 를 비우면 한 프로세스에서 둘을 차례로 한다.
//   3) 되돌리기(RESTORE=<백업 파일>, APPLY=1 이어야 실제로 쓴다): 백업의 값을 제자리에 돌려놓는다.
//      그 사이 새 값이 들어온 칸은 건드리지 않는다.
//   멈춤 조건(적용 전에 하나라도 걸리면 아무것도 쓰지 않는다):
//      · 지금 고른 대상이 기준(승인 목록 개수, 미리보기에선 EXPECT·기본 819)보다 MAX_OVER(15%) 넘게 많다
//      · 예상한 브랜드(EXPECTED_BRANDS) 밖의 브랜드 하나에서 OTHER_MAX(8)개 넘게 걸린다
//      · 승인 목록이 PLAN_MAX_AGE_H(72)시간보다 오래됐다 · CONFIRM 이 승인 목록 개수와 다르다
//
// env: WORKER_URL, WORKER_TOKEN, BRANDS(쉼표 — 이 브랜드만), APPLY=1, CONFIRM, STAGE(backup|write), PLAN, BACKUP,
//      RESTORE, EXPECT, OUT_DIR(리포트·백업을 쓸 폴더, 기본 저장소 루트), RUN_ID(백업 파일 이름에 붙임)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { shownItems, sigE, sigF, validComp, cleanVal, pickCatalogs, normBrand } from "./audit-stored-comp.mjs";
import { findFlags, heldBy, nameContradicts } from "./comp-guard.mjs";

const SELF = fileURLToPath(import.meta.url);
const ROOT = join(dirname(SELF), "..");

// 큰 개수가 나와도 되는 브랜드 — 점검에서 틀림을 확인한 네 곳 + 상품 아닌 행이 44개였던 Carhartt(카탈로그 이름 Carlhartt).
// 상품 목록이 아니라 '멈춤 조건'의 기준이다. 이 밖의 브랜드는 하나에서 OTHER_MAX 개까지만 허용한다.
export const EXPECTED_BRANDS = ["Aritzia", "Splendid", "&Other Stories", "Gymshark", "Carhartt", "Carlhartt"].map(normBrand);
export const LIMITS = { MAX_OVER: 0.15, OTHER_MAX: 8, PLAN_MAX_AGE_H: 72 };
// 점검(2026-11-24 06:00 UTC 실행 45335666146)이 센 자동 정리 대상 — 미리보기에서 견줄 기준.
export const AUDIT_TOTAL = 819;
export const AUDIT_GROUPS = { guard: 718, row: 64, short: 37 };

export const GROUP_NAME = {
  guard: "브랜드 전체에 되풀이되는 조각 값",
  row: "상품이 아닌 행(카테고리·목록 주소)",
  short: "숫자가 모자란 값(퍼센트 합이 안 맞음)",
};

// ── 대상 고르기 규칙 ───────────────────────────────────────────────
// 시그니처 F(audit 의 sigF)는 경로에 categories 가 들어간 진짜 상품 주소도 잡는다 — J.Crew `/p/…/categories/…/CX381`,
// Garnet Hill `/<상품이름>/clothing/categories/…/744396`. 둘 다 마지막 조각이 상품 번호다. 이런 주소는 뺀다.
// 다만 목록이라는 표시가 분명한 주소(/c/ · /collections/ · new-arrivals · 끝이 cat1234 같은 카테고리 번호)는 그대로 대상이다.
const CAT_ID_RX = /^cata?[a-z]?\d{4,}$/i;
export function productUnderCategory(url) {
  let u; try { u = new URL(url); } catch (e) { return false; }
  const segs = u.pathname.split("/").filter(Boolean).map((s) => s.toLowerCase());
  if (!segs.some((s) => s === "category" || s === "categories")) return false;
  if (segs.some((s) => s === "c" || s === "collections" || /^new-arrivals?$/.test(s))) return false;
  const last = segs[segs.length - 1] || "";
  return /\d/.test(last) && !CAT_ID_RX.test(last);
}
export const nonProductRow = (url) => sigF(url) && !productUnderCategory(url);

// 카탈로그에 실린 값 중 퍼센트 합이 맞지 않는 것(validComp 가 거절하고, 이유가 '합이 N%').
// 섬유 이름 표기만 다른 값(Recycled Cotton 20% 등)은 숫자가 맞으므로 대상이 아니다.
export function shortWhy(raw) {
  if (validComp(raw)) return "";
  return sigE(raw).find((w) => /^합이 /.test(w)) || "";
}

const urlKey = (u) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/+$/, "")).toLowerCase(); } catch (e) { return ""; } };
const RETRY_FIELDS = ["t", "wt", "none", "nv"];   // 다시 읽히게 하려고 지우는 표시
const SOURCE_FIELDS = ["via", "wd"];             // comp 의 출처 표시 — comp 를 지우면 함께 지운다
// Worker 의 카탈로그 저장이 받아 주는 상품 칸(worker/fabric-extractor.js store=catalog). 이 밖의 칸이 있으면
// 다시 보낼 때 사라지므로 그 카탈로그는 쓰지 않는다.
export const CATALOG_FIELDS = new Set(["name", "imageUrl", "productUrl", "price", "priceOrig", "category", "src", "comp", "color", "sizes"]);

function shortReason(group, p, flag, why) {
  if (group === "row") return "상품이 아닌 주소(목록 페이지) — 목록에 섞인 다른 상품의 소재";
  if (group === "short") return `퍼센트 ${why.replace(/^합이 /, "합이 ")} — 숫자가 모자람`;
  const pct = Math.round(flag.share * 100);
  const contra = nameContradicts(p.name, p.comp);
  const tail = contra.length ? ` · 상품명은 ${contra.join("·")}` : "";
  return flag.kind === "value"
    ? `이 브랜드 혼용률의 ${pct}%가 같은 값${tail}`
    : `“${flag.text}” 줄이 이 브랜드 두 원단 값의 ${pct}%에 붙어 있음${tail}`;
}

// 한 사이트(카탈로그 + 오버레이)에서 대상을 고르고, 무엇을 어떻게 바꿀지 정한다. 네트워크를 쓰지 않는다.
// 돌려주는 targets[i]:
//   { site, brand, url, name, group, reason, value(지금 보이는 값), layers:[{layer:"catalog", idx, value} | {layer:"overlay", key, value}],
//     after(지운 뒤 보일 값), retry(다시 읽히게 표시를 지우나) }
export function selectSite(site, cat, overlay) {
  const brand = (cat && cat.brand) || site;
  const catItems = (cat && cat.items) || [];
  const ov = overlay || {};
  const items = shownItems(catItems, ov);
  // shownItems 는 productUrl 이 있는 카탈로그 상품만 순서대로 돌려준다 — 카탈로그 위치를 맞춰 둔다.
  const idxs = [];
  catItems.forEach((p, i) => { if (p && p.productUrl) idxs.push(i); });
  const ovKeys = new Map();
  for (const k of Object.keys(ov)) { const uk = urlKey(k); if (!ovKeys.has(uk)) ovKeys.set(uk, []); ovKeys.get(uk).push(k); }
  const withComp = items.filter((p) => p.comp);
  const flags = findFlags(withComp);
  const targets = [];
  items.forEach((p, n) => {
    if (!p.comp) return;
    const flag = heldBy(p.comp, flags);
    const why = p.src === "catalog" ? shortWhy(p.raw) : "";
    const group = nonProductRow(p.url) ? "row" : flag ? "guard" : why ? "short" : "";
    if (!group) return;
    const idx = idxs[n];
    const layers = [];
    const catRaw = String(catItems[idx].comp || "").trim();
    if (catRaw) layers.push({ layer: "catalog", idx, value: catItems[idx].comp });
    // 같은 상품(urlKey)의 오버레이 칸들. 화면은 마지막 것을 쓴다(mergeOverlay 의 Map). 지울지:
    //   row → 전부 / 카탈로그가 비어 있어 이 값이 보이던 것 → 지운다 / 가드에 걸리거나 옳지 않은 값 → 지운다.
    //   나머지(옳은 값)는 남긴다 — 카탈로그 값을 지우면 그 값이 보인다.
    const keys = ovKeys.get(urlKey(p.url)) || [];
    let after = "";
    keys.forEach((k, j) => {
      const v = cleanVal(ov[k] && ov[k].comp);
      if (!v) return;
      const shownHere = !catRaw && j === keys.length - 1;
      if (group === "row" || shownHere || heldBy(v, flags) || !validComp(v)) layers.push({ layer: "overlay", key: k, value: ov[k].comp });
      else after = v;
    });
    targets.push({
      site, brand, url: p.url, name: p.name, group, reason: shortReason(group, p, flag, why),
      value: p.comp, layers, after, retry: !after && group !== "row",
    });
  });
  return { brand, targets, flags };
}

// 고른 대상대로 새 카탈로그 목록·새 오버레이를 만든다(원본은 건드리지 않는다).
export function applyEdits(cat, overlay, targets) {
  const items = ((cat && cat.items) || []).map((p) => (p ? { ...p } : p));
  const ov = {};
  for (const [k, v] of Object.entries(overlay || {})) ov[k] = v && typeof v === "object" ? { ...v } : v;
  let catChanged = 0, ovChanged = 0;
  for (const t of targets) {
    for (const l of t.layers) {
      if (l.layer === "catalog") { items[l.idx].comp = ""; catChanged++; }
      else { const e = ov[l.key]; delete e.comp; for (const f of SOURCE_FIELDS) delete e[f]; ovChanged++; }
    }
    if (t.retry) {
      for (const k of Object.keys(ov)) {
        if (urlKey(k) !== urlKey(t.url) || !ov[k] || typeof ov[k] !== "object") continue;
        const had = RETRY_FIELDS.some((f) => f in ov[k]);
        for (const f of RETRY_FIELDS) delete ov[k][f];
        if (had && !t.layers.some((l) => l.key === k)) ovChanged++;
      }
    }
  }
  return { items, overlay: ov, catChanged, ovChanged };
}

// 멈춤 조건. 걸린 이유 목록을 돌려준다(비면 통과).
export function limitCheck(targets, baseline, limits = LIMITS) {
  const out = [];
  // 허용 상한은 정수로 내림한다(100 × 1.15 가 114.999… 로 계산돼 115 를 막는 일이 없게).
  if (baseline > 0 && targets.length > Math.floor(baseline * (1 + limits.MAX_OVER) + 1e-9)) {
    out.push(`대상 ${targets.length}개가 기준 ${baseline}개보다 ${Math.round((targets.length / baseline - 1) * 100)}% 많다(허용 ${Math.round(limits.MAX_OVER * 100)}%)`);
  }
  const byBrand = new Map();
  for (const t of targets) byBrand.set(t.brand, (byBrand.get(t.brand) || 0) + 1);
  for (const [b, n] of byBrand) {
    if (!EXPECTED_BRANDS.includes(normBrand(b)) && n > limits.OTHER_MAX) out.push(`예상 밖 브랜드 ${b} 에서 ${n}개(허용 ${limits.OTHER_MAX}개)`);
  }
  return out;
}

const tkey = (t) => `${t.site}\n${t.url}`;
const layerSig = (t) => t.layers.map((l) => `${l.layer}:${l.layer === "catalog" ? "" : l.key}=${l.value}`).sort().join("\n");
// 승인 목록과 지금 고른 대상을 맞춘다 — 승인 목록에 있고, 지울 칸과 값이 그때와 똑같은 것만 지운다.
export function matchApproved(targets, plan) {
  const ok = new Map((plan.targets || []).map((t) => [tkey(t), t]));
  const go = [], changed = [], fresh = [];
  for (const t of targets) {
    const a = ok.get(tkey(t));
    if (!a) fresh.push(t);
    else if (a.group !== t.group || layerSig(a) !== layerSig(t)) changed.push(t);
    else go.push(t);
  }
  const liveKeys = new Set(targets.map(tkey));
  const gone = (plan.targets || []).filter((t) => !liveKeys.has(tkey(t)));
  return { go, changed, fresh, gone };
}

// 백업 항목: 지울 칸 하나마다 { site, brand, url, name, group, layer, key|productUrl, value(이전 값 전체), before(그 칸의 원래 객체) }
export function backupEntries(targets, catBySite, ovBySite) {
  const out = [];
  for (const t of targets) {
    const ov = ovBySite.get(t.site) || {};
    for (const l of t.layers) {
      if (l.layer === "catalog") out.push({ site: t.site, brand: t.brand, url: t.url, name: t.name, group: t.group, layer: "catalog", productUrl: catBySite.get(t.site).items[l.idx].productUrl, value: l.value, before: catBySite.get(t.site).items[l.idx] });
      else out.push({ site: t.site, brand: t.brand, url: t.url, name: t.name, group: t.group, layer: "overlay", key: l.key, value: l.value, before: ov[l.key] });
    }
    // 다시 읽히게 하려고 지우는 표시(t·wt·none·nv)도 되돌릴 수 있게 남긴다 — 값이 없던 칸이라도.
    if (t.retry) for (const k of Object.keys(ov)) {
      if (urlKey(k) === urlKey(t.url) && !t.layers.some((l) => l.key === k) && ov[k] && RETRY_FIELDS.some((f) => f in ov[k])) {
        out.push({ site: t.site, brand: t.brand, url: t.url, name: t.name, group: t.group, layer: "overlay-stamps", key: k, value: "", before: ov[k] });
      }
    }
  }
  return out;
}
const inBackup = (t, backup) => {
  const have = new Set((backup.entries || []).map((e) => `${e.site}\n${e.layer}\n${e.layer === "catalog" ? e.productUrl : e.key}\n${e.value}`));
  return (cat) => t.layers.every((l) => have.has(`${t.site}\n${l.layer}\n${l.layer === "catalog" ? cat.items[l.idx].productUrl : l.key}\n${l.value}`));
};

// 되돌리기: 백업 항목을 지금 저장값에 다시 넣는다. 그 사이 새 값이 들어온 칸은 건드리지 않는다.
export function restoreSite(cat, overlay, entries) {
  const items = ((cat && cat.items) || []).map((p) => (p ? { ...p } : p));
  const ov = {};
  for (const [k, v] of Object.entries(overlay || {})) ov[k] = v && typeof v === "object" ? { ...v } : v;
  const done = [], skipped = [];
  for (const e of entries) {
    if (e.layer === "catalog") {
      const it = items.find((p) => p && p.productUrl === e.productUrl);
      if (!it) { skipped.push({ ...e, why: "카탈로그에서 상품이 사라짐" }); continue; }
      if (String(it.comp || "").trim()) { skipped.push({ ...e, why: `그 사이 새 값이 들어옴: ${it.comp}` }); continue; }
      it.comp = e.value; done.push(e);
    } else {
      const cur = ov[e.key] && typeof ov[e.key] === "object" ? ov[e.key] : {};
      if (e.layer === "overlay" && cleanVal(cur.comp)) { skipped.push({ ...e, why: `그 사이 새 값이 들어옴: ${cur.comp}` }); continue; }
      const b = e.before || {};
      for (const f of ["comp", ...SOURCE_FIELDS, ...RETRY_FIELDS]) if (f in b && !(f in cur)) cur[f] = b[f];
      // 되돌린 값과 함께 none 이 남으면 '정보 없음'과 값이 같이 보인다 — 값이 돌아오면 none 은 뺀다.
      if (cleanVal(cur.comp)) { delete cur.none; delete cur.nv; }
      ov[e.key] = cur; done.push(e);
    }
  }
  return { items, overlay: ov, done, skipped };
}

// ── 리포트(담당자가 읽는 목록) ─────────────────────────────────────
const esc = (s) => String(s == null ? "" : s).replace(/\|/g, "/").replace(/\n/g, " ‖ ").trim();
export function report(r) {
  const T = r.targets;
  const by = (k) => T.filter((t) => t.group === k).length;
  const brands = new Map();
  for (const t of T) { if (!brands.has(t.brand)) brands.set(t.brand, []); brands.get(t.brand).push(t); }
  const order = [...brands].sort((a, z) => z[1].length - a[1].length || (a[0] < z[0] ? -1 : 1));
  let md = `# 저장된 혼용률 정리 — ${r.title}\n\n`;
  md += `${r.lead}\n\n`;
  md += `- 읽은 시각 ${r.at.slice(0, 16)}Z · 카탈로그 ${r.sites}개${r.brandFilter ? ` (이 브랜드만: ${r.brandFilter})` : ""}\n`;
  md += `- **지울 혼용률 ${T.length}개** — ${GROUP_NAME.guard} ${by("guard")} · ${GROUP_NAME.row} ${by("row")} · ${GROUP_NAME.short} ${by("short")}\n`;
  if (r.compare) md += `- ${r.compare}\n`;
  md += `- 지운 뒤에도 다른 값이 보이는 상품 ${T.filter((t) => t.after).length}개(카탈로그의 모자란 값 뒤에 온전한 값이 있던 것 — 표의 '지운 뒤' 칸)\n`;
  if (r.errors && r.errors.length) md += `- ⚠ 읽기 실패(이 카탈로그는 고르지도 쓰지도 않음): ${r.errors.map((e) => `${e.site}(${e.err})`).join(", ")}\n`;
  if (r.skippedSites && r.skippedSites.length) md += `- ⚠ 쓰지 않은 카탈로그: ${r.skippedSites.map((e) => `${e.site}(${e.why})`).join(", ")}\n`;
  md += r.limits.length ? `- ⛔ 멈춤 조건에 걸림: ${r.limits.join(" · ")}\n` : `- 멈춤 조건(기준보다 15% 넘게 많음 · 예상 밖 브랜드 한 곳에서 ${LIMITS.OTHER_MAX}개 넘음): 걸리지 않음\n`;
  if (r.extra) md += r.extra;
  md += `\n## 지우면 어떻게 되나\n\n`;
  md += `- 지우는 것은 **혼용률 한 칸뿐**이다. 상품 이름·사진·가격·컬러·사이즈는 그대로 남는다.\n`;
  md += `- 지운 칸은 엑셀에서 '확인 필요'로 나간다('정보 없음'이 아니다). 야간 보강·크롬 보강이 고친 추출기와 저장 직전 가드로 다시 읽어 채운다 — 페이지가 열리는 브랜드(Splendid·Gymshark 등)는 며칠 안에, 막히는 브랜드(Aritzia·&Other Stories)는 확장이나 보관본이 채울 때까지 빈칸일 수 있다.\n`;
  md += `- 지운 값은 모두 백업 파일에 남고, 되돌리기로 제자리에 돌려놓을 수 있다(그 사이 새 값이 들어온 칸은 건드리지 않는다).\n`;
  md += `- 상품이 아닌 행은 값만 지운다. 행 자체를 카탈로그에서 빼는 일은 따로 해야 한다(맨 아래 '따로 할 일').\n`;
  md += `\n## 브랜드별 개수\n\n| 브랜드 | 지울 개수 | 묶음 |\n|---|---:|---|\n`;
  for (const [b, arr] of order) {
    const g = ["guard", "row", "short"].filter((k) => arr.some((t) => t.group === k)).map((k) => `${GROUP_NAME[k].replace(/\(.*\)/, "")} ${arr.filter((t) => t.group === k).length}`);
    md += `| ${esc(b)} | ${arr.length} | ${g.join(" · ")} |\n`;
  }
  md += `\n## 브랜드별 목록\n\n'지울 값'의 ‖ 는 줄바꿈(두 원단)이다. '지운 뒤'가 비어 있으면 그 칸은 빈칸('확인 필요')이 된다.\n`;
  for (const [b, arr] of order) {
    md += `\n### ${esc(b)} — ${arr.length}개\n\n`;
    const heads = [...new Set(arr.map((t) => t.head).filter(Boolean))];
    if (heads.length) md += heads.map((h) => `- ${h}`).join("\n") + "\n\n";
    md += `| # | 상품명 | 지울 값 | 이유 | 지운 뒤 | 링크 |\n|---:|---|---|---|---|---|\n`;
    arr.forEach((t, i) => {
      md += `| ${i + 1} | ${esc(t.name).slice(0, 90) || "(이름 없음)"} | ${esc(t.value)} | ${esc(t.reason)} | ${esc(t.after) || "빈칸"} | [열기](${t.url}) |\n`;
    });
  }
  const rows = T.filter((t) => t.group === "row");
  if (rows.length) {
    md += `\n## 따로 할 일 — 상품이 아닌 행 ${rows.length}개\n\n`;
    md += `이 행들은 상품이 아니라 카테고리·목록 페이지 주소다. 혼용률을 지워도 행은 엑셀·리서치 화면에 그대로 남고, 야간 보강이 이 주소를 다시 읽으면 목록에 섞인 다른 상품의 소재가 또 붙을 수 있다. 행 자체를 카탈로그에서 빼고(수집기 쪽 거르기 확인), 보강이 이런 주소를 읽지 않게 하는 것이 진짜 해결이다 — 이번 정리에서는 하지 않는다.\n\n`;
    const rb = new Map();
    for (const t of rows) rb.set(t.brand, [...(rb.get(t.brand) || []), t]);
    for (const [b, arr] of rb) md += `- **${esc(b)}** ${arr.length}개: ${arr.map((t) => t.url).join(" · ")}\n`;
  }
  return md;
}

// 계획 파일(기계용) — 적용할 때 '승인한 목록'으로 쓴다.
const planOf = (at, targets, extra = {}) => ({
  at, total: targets.length, groups: { guard: targets.filter((t) => t.group === "guard").length, row: targets.filter((t) => t.group === "row").length, short: targets.filter((t) => t.group === "short").length },
  ...extra,
  targets: targets.map((t) => ({ site: t.site, brand: t.brand, url: t.url, name: t.name, group: t.group, reason: t.reason, value: t.value, after: t.after, retry: t.retry,
    layers: t.layers.map((l) => (l.layer === "catalog" ? { layer: "catalog", value: l.value } : { layer: "overlay", key: l.key, value: l.value })) })),
});

// ── 실행 ──────────────────────────────────────────────────────────
async function main() {
  const env = process.env;
  const APPLY = env.APPLY === "1";
  const STAGE = String(env.STAGE || "").trim();
  const OUT = resolve(env.OUT_DIR || ROOT);
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  const WORKER = (env.WORKER_URL || "https://fabric-extractor.hs-fabric-linker.workers.dev").replace(/\/+$/, "");
  const TOKEN = env.WORKER_TOKEN || "hsfabriclinker";
  const tok = "&token=" + encodeURIComponent(TOKEN);
  const BRANDS = String(env.BRANDS || "").split(",").map(normBrand).filter(Boolean);
  const RUN = String(env.RUN_ID || new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12));

  // 쓰기 잠금 — APPLY=1 이 아니면 GET/HEAD 가 아닌 요청은 보내기 전에 막는다.
  const realFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (!APPLY && method !== "GET" && method !== "HEAD") {
      return Promise.reject(new Error(`미리보기(dry) — ${method} 요청을 막음: ${String((input && input.url) || input).slice(0, 120)}`));
    }
    return realFetch(input, init);
  };
  const getJson = async (qs) => {
    let last;
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(WORKER + "/?" + qs + tok, { signal: AbortSignal.timeout(60000) });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const j = await r.json();
        if (!j || typeof j !== "object" || Array.isArray(j) || j.error) throw new Error("형식이 아님" + (j && j.error ? ": " + j.error : ""));
        return j;
      } catch (e) { last = e; if (i < 2) await new Promise((res) => setTimeout(res, 2000)); }
    }
    throw last;
  };
  const post = async (qs, body) => {
    const r = await fetch(WORKER + "/?" + qs + tok, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) });
    const text = await r.text();
    let j = null; try { j = JSON.parse(text); } catch (e) {}
    if (!j || !j.ok) throw new Error(`HTTP ${r.status} ${text.slice(0, 160)}`);
    return j;
  };
  const write = (name, s) => { writeFileSync(join(OUT, name), s); console.log("  → " + join(OUT, name)); };

  // ── 되돌리기 ──
  if (env.RESTORE) {
    const bk = JSON.parse(readFileSync(resolve(env.RESTORE), "utf8"));
    const bySite = new Map();
    for (const e of bk.entries || []) { if (!bySite.has(e.site)) bySite.set(e.site, []); bySite.get(e.site).push(e); }
    console.log(`되돌리기 — 백업 ${env.RESTORE} · 항목 ${(bk.entries || []).length}개 · 카탈로그 ${bySite.size}개 · ${APPLY ? "실제로 쓴다" : "미리보기(쓰지 않음)"}`);
    const rows = [];
    for (const [site, entries] of bySite) {
      let cat, ov;
      try { cat = await getJson("catalog=" + encodeURIComponent(site)); ov = await getJson("comps=" + encodeURIComponent(site)); }
      catch (e) { rows.push(`| ${site} | 읽기 실패 ${esc(e.message)} | | |`); continue; }
      const r = restoreSite(cat, ov, entries);
      const catN = r.done.filter((e) => e.layer === "catalog").length, ovN = r.done.length - catN;
      let st = APPLY ? "" : "미리보기";
      if (APPLY) {
        try {
          if (ovN) await post("store=overlay&site=" + encodeURIComponent(site), r.overlay);
          if (catN) await post("store=catalog", { site, brand: cat.brand || "", items: r.items });
          st = "돌려놓음";
        } catch (e) { st = "쓰기 실패 " + esc(e.message); }
      }
      rows.push(`| ${site} | ${st} | ${r.done.length} (카탈로그 ${catN} · 오버레이 ${ovN}) | ${r.skipped.length ? r.skipped.slice(0, 5).map((s) => esc(s.url) + " — " + esc(s.why)).join("<br>") : "-"} |`);
      console.log(`  ${site}: 돌려놓을 ${r.done.length} · 건너뜀 ${r.skipped.length} ${st}`);
    }
    write("stored-comp-clean-restore-report.md", `# 저장된 혼용률 되돌리기 (${new Date().toISOString().slice(0, 16)}Z)\n\n백업: \`${env.RESTORE}\` · ${APPLY ? "실제로 썼다" : "미리보기 — 쓰지 않았다"}\n\n| 카탈로그 | 결과 | 돌려놓은 칸 | 건너뛴 칸(그 사이 새 값 등) |\n|---|---|---|---|\n${rows.join("\n")}\n`);
    return 0;
  }

  // ── 읽고 고르기 ──
  const { list, skipOld } = pickCatalogs((await getJson("catalogs=1")).list || [], BRANDS);
  console.log(`카탈로그 ${list.length}개(옛 키 ${skipOld.size}개 뺌) — ${APPLY ? `적용(STAGE=${STAGE || "backup+write"})` : "미리보기(dry), 쓰지 않는다"}`);
  const at = new Date().toISOString();
  const catBySite = new Map(), ovBySite = new Map(), errors = [];
  let targets = [];
  const heads = new Map();
  for (const c of list) {
    let cat, ov;
    // 오버레이를 못 읽은 카탈로그는 고르지도 쓰지도 않는다 — 빈 오버레이로 보고 쓰면 그 브랜드의 보강분이 날아간다.
    try { cat = await getJson("catalog=" + encodeURIComponent(c.site)); ov = await getJson("comps=" + encodeURIComponent(c.site)); }
    catch (e) { errors.push({ site: c.site, err: String(e.message || e).slice(0, 80) }); continue; }
    catBySite.set(c.site, cat); ovBySite.set(c.site, ov);
    const r = selectSite(c.site, cat, ov);
    for (const f of r.flags) heads.set(r.brand + "\n" + f.key, `가드 근거: ${f.kind === "value" ? `혼용률 ${f.of}개 중 ${f.n}개(${Math.round(f.share * 100)}%)가 “${String(f.text).replace(/\n/g, " ‖ ")}” · 그중 ${f.contra}개는 상품명이 다른 섬유를 말함` : `두 원단 값 ${f.of}개 중 ${f.n}개(${Math.round(f.share * 100)}%)에 “${f.text}” 줄 · 짝 줄 ${f.partners}종`}`);
    for (const t of r.targets) if (t.group === "guard") t.head = [...heads].filter(([k]) => k.startsWith(r.brand + "\n")).map(([, v]) => v).join(" / ");
    targets = targets.concat(r.targets);
    if (r.targets.length) console.log(`  ${r.brand}: ${r.targets.length}개`);
  }
  const groupsLine = (T) => `가드 ${T.filter((t) => t.group === "guard").length} · 상품 아닌 행 ${T.filter((t) => t.group === "row").length} · 모자란 값 ${T.filter((t) => t.group === "short").length}`;
  console.log(`대상 ${targets.length}개 — ${groupsLine(targets)}${errors.length ? ` · 읽기 실패 ${errors.length}` : ""}`);

  // ── 미리보기 ──
  if (!APPLY) {
    const EXPECT = Number(env.EXPECT) || AUDIT_TOTAL;
    const limits = limitCheck(targets, BRANDS.length ? 0 : EXPECT);
    const g = (k) => targets.filter((t) => t.group === k).length;
    const compare = BRANDS.length ? "" :
      `점검(11/24 06:00 UTC)의 자동 정리 대상 ${AUDIT_TOTAL}개와 견줌: 지금 ${targets.length}개(${targets.length - AUDIT_TOTAL >= 0 ? "+" : ""}${targets.length - AUDIT_TOTAL}) — ` +
      `조각 값 ${g("guard")}/${AUDIT_GROUPS.guard} · 상품 아닌 행 ${g("row")}/${AUDIT_GROUPS.row} · 모자란 값 ${g("short")}/${AUDIT_GROUPS.short}`;
    write("stored-comp-clean-plan.json", JSON.stringify(planOf(at, targets, { brands: BRANDS, errors }), null, 1));
    write("stored-comp-clean-report.md", report({
      title: "지울 목록(미리보기)", at, sites: list.length, brandFilter: BRANDS.join(","), targets, compare, errors, limits,
      lead: `> **아직 아무것도 지우지 않았다.** 이 목록은 미리보기다(쓰기 요청은 스크립트가 막았다). 담당자가 이 목록을 보고 승인하면, ` +
        `승인한 목록에 있고 값이 그때와 똑같은 것만 지운다. 승인 뒤에 새로 생긴 대상은 지우지 않는다.\n> ` +
        `적용 실행: diagnose-page 워크플로 · mode=clean-apply · confirm=apply-${targets.length}${BRANDS.length ? ` · brands=${env.BRANDS}` : ""}`,
    }));
    if (limits.length) console.log("⛔ 적용했다면 멈췄을 조건: " + limits.join(" · "));
    return 0;
  }

  // ── 적용 ──
  const planPath = resolve(env.PLAN || join(ROOT, "stored-comp-clean-plan.json"));
  if (!existsSync(planPath)) { console.error(`⛔ 승인 목록이 없다: ${planPath}`); return 2; }
  const plan = JSON.parse(readFileSync(planPath, "utf8"));
  const stop = [];
  if (String(env.CONFIRM || "").trim() !== `apply-${plan.total}`) stop.push(`CONFIRM 이 승인 목록 개수와 다르다(받은 값 "${env.CONFIRM || ""}", 승인 목록 ${plan.total}개 → apply-${plan.total})`);
  const ageH = (Date.now() - Date.parse(plan.at)) / 3600000;
  if (!(ageH <= LIMITS.PLAN_MAX_AGE_H)) stop.push(`승인 목록이 ${Math.round(ageH)}시간 전 것이다(허용 ${LIMITS.PLAN_MAX_AGE_H}시간) — 미리보기를 다시 돌려 승인받을 것`);
  if (normBrand((plan.brands || []).join()) !== normBrand(BRANDS.join())) stop.push(`승인 목록의 브랜드 필터(${(plan.brands || []).join(",") || "전부"})와 이번 실행(${BRANDS.join(",") || "전부"})이 다르다`);
  if (errors.length) stop.push(`카탈로그 ${errors.length}개를 못 읽었다(${errors.map((e) => e.site).join(", ")})`);
  stop.push(...limitCheck(targets, plan.total));
  const m = matchApproved(targets, plan);
  console.log(`승인 목록 ${plan.total}개 · 지금 고른 ${targets.length}개 → 지울 ${m.go.length} · 값이 바뀜 ${m.changed.length} · 승인 뒤 새로 생김 ${m.fresh.length} · 사라짐 ${m.gone.length}`);
  const applyReport = (title, lead, done, extra = "", skippedSites = []) => write(`stored-comp-clean-apply-${RUN}.md`, report({
    title, at, sites: list.length, brandFilter: BRANDS.join(","), targets: done, errors, limits: stop, skippedSites, lead,
    compare: `승인 목록 ${plan.total}개(${plan.at.slice(0, 16)}Z) · 지금 고른 ${targets.length}개 · 그중 승인 목록과 같은 ${m.go.length}개 · 값이 바뀌어 건너뜀 ${m.changed.length} · 승인 뒤 새로 생겨 건너뜀 ${m.fresh.length} · 이미 사라진 ${m.gone.length}`,
    extra,
  }));
  if (stop.length) {
    console.error("⛔ 멈춤 — 아무것도 쓰지 않았다:\n  " + stop.join("\n  "));
    applyReport("적용 멈춤", "> ⛔ 멈춤 조건에 걸려 **아무것도 쓰지 않았다.**", m.go);
    return 3;
  }
  const go = m.go;
  const touched = [...new Set(go.map((t) => t.site))];

  if (STAGE !== "write") {
    const bk = { at, run: RUN, plan: { at: plan.at, total: plan.total }, confirm: env.CONFIRM, entries: backupEntries(go, catBySite, ovBySite) };
    write(`stored-comp-clean-backup-${RUN}.json`, JSON.stringify(bk, null, 1));
    // 통째 사본(사이트마다 카탈로그·오버레이 원문) — 워크플로가 아티팩트로만 올린다.
    const snapDir = join(OUT, `stored-comp-clean-snapshot-${RUN}`);
    mkdirSync(snapDir, { recursive: true });
    for (const s of touched) {
      writeFileSync(join(snapDir, `${s}.catalog.json`), JSON.stringify(catBySite.get(s)));
      writeFileSync(join(snapDir, `${s}.overlay.json`), JSON.stringify(ovBySite.get(s)));
    }
    console.log(`백업 — 칸 ${bk.entries.length}개 · 카탈로그 ${touched.length}개 사본`);
    if (STAGE === "backup") return 0;
  }

  // 쓰기: 백업에 똑같이 적힌 값만.
  const bkPath = resolve(env.BACKUP || join(OUT, `stored-comp-clean-backup-${RUN}.json`));
  if (!existsSync(bkPath)) { console.error(`⛔ 백업 파일이 없다: ${bkPath} — 쓰지 않는다`); return 4; }
  const backup = JSON.parse(readFileSync(bkPath, "utf8"));
  const ready = go.filter((t) => inBackup(t, backup)(catBySite.get(t.site)));
  const noBk = go.length - ready.length;
  const done = [], skippedSites = [];
  for (const site of [...new Set(ready.map((t) => t.site))]) {
    const ts = ready.filter((t) => t.site === site);
    const cat = catBySite.get(site), ov = ovBySite.get(site);
    const odd = (cat.items || []).find((p) => p && Object.keys(p).some((k) => !CATALOG_FIELDS.has(k)));
    const needCat = ts.some((t) => t.layers.some((l) => l.layer === "catalog"));
    if (needCat && (odd || (cat.items || []).length > 800)) { skippedSites.push({ site, why: odd ? `카탈로그에 저장이 받지 않는 칸(${Object.keys(odd).filter((k) => !CATALOG_FIELDS.has(k)).join(",")})` : "상품 800개 초과" }); continue; }
    const e = applyEdits(cat, ov, ts);
    try {
      // 오버레이 먼저(표시 지우기), 그다음 카탈로그.
      if (e.ovChanged) await post("store=overlay&site=" + encodeURIComponent(site), e.overlay);
      if (e.catChanged) await post("store=catalog", { site, brand: cat.brand || "", items: e.items });
      done.push(...ts);
      console.log(`  ${site}: 지움 ${ts.length} (카탈로그 칸 ${e.catChanged} · 오버레이 칸 ${e.ovChanged})`);
    } catch (err) { skippedSites.push({ site, why: "쓰기 실패: " + String(err.message || err).slice(0, 120) }); }
  }
  // 확인: 다시 읽어 지운 값이 없어졌고 다른 상품은 그대로인지(KV 는 몇십 초 늦게 보일 수 있어 몇 번 본다).
  let verifyLine = "";
  {
    const bad = [];
    for (const site of [...new Set(done.map((t) => t.site))]) {
      let okSite = false, why = "";
      for (let i = 0; i < 4 && !okSite; i++) {
        if (i) await new Promise((r) => setTimeout(r, 15000));
        try {
          const cat2 = await getJson("catalog=" + encodeURIComponent(site)), ov2 = await getJson("comps=" + encodeURIComponent(site));
          const left = selectSite(site, cat2, ov2).targets.filter((t) => done.some((d) => d.site === site && d.url === t.url));
          const n1 = (catBySite.get(site).items || []).length, n2 = (cat2.items || []).length;
          why = left.length ? `아직 남은 대상 ${left.length}` : n1 !== n2 ? `상품 수가 ${n1}→${n2}` : "";
          okSite = !why;
        } catch (e) { why = "다시 읽기 실패"; }
      }
      if (!okSite) bad.push(`${site}(${why})`);
    }
    verifyLine = bad.length ? `- ⚠ 다시 읽어 확인 못 한 카탈로그: ${bad.join(", ")} (KV 지연일 수 있음 — 미리보기를 다시 돌려 볼 것)\n` : `- 다시 읽어 확인: 지운 값이 모두 사라졌고 상품 수는 그대로다\n`;
  }
  applyReport("지운 결과", `> 승인 목록(${plan.at.slice(0, 16)}Z, ${plan.total}개) 가운데 **${done.length}개를 지웠다.** 백업: \`stored-comp-clean-backup-${RUN}.json\` — 되돌리기는 mode=clean-restore.`,
    done, verifyLine + (noBk ? `- 백업에 없어 건너뜀 ${noBk}개\n` : ""), skippedSites);
  return skippedSites.length ? 5 : 0;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === SELF;
if (isMain) process.exitCode = await main();
