#!/usr/bin/env node
// 브랜드 목록 불러오기 회귀 테스트.
//
// 미로에서 앱을 열면 브랜드를 못 고르고, 새로고침해야 됐다. 원인은
// loadBrandList 가 Render 의 /api/brands 를 딱 한 번 부르고 끝났다는 것이다.
// Render 무료 플랜은 놀면 잠들고 깨는 데 1분 가까이 걸려서, 그 사이 요청은
// 502 를 뱉거나 늘어진다. 재시도도 폴백도 없으니 목록이 빈 채로 끝났고,
// 새로고침하면 그 사이 Render 가 깨어 있어서 됐던 것이다.
//
// 여기서는 ① 합치기 규칙 ② 코드가 갖춰야 할 방어 장치를 본다.
// 합치기가 틀리면 Worker 가 준 목록이 Render 의 카테고리를 지운다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "index.html"), "utf8");

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// ── ① mergeBrands ──
const mi = src.indexOf("function mergeBrands(");
const mj = src.indexOf("function paintBrands(", mi);
if (mi < 0 || mj < 0) { console.error("❌ mergeBrands 블록을 찾지 못함"); process.exit(1); }
const mergeBrands = new Function(src.slice(mi, mj) + "\n return mergeBrands;")();

// Worker 는 name/url/count 만 준다. Render 는 categories/blocked 를 준다.
const WORKER = [
  { name: "Vince", url: "https://vince.com", count: 370, updated: 1 },
  { name: "American Eagle", url: "https://ae.com", count: 132, updated: 2 },
];
const RENDER = [
  { name: "Vince", url: "https://www.vince.com", categories: ["tops", "pants"] },
  { name: "American Eagle", url: "https://www.ae.com", categories: ["tops"], blocked: true },
  { name: "Apiece Apart", url: "https://apieceapart.com", categories: ["dresses"] },
];

const merged = mergeBrands(WORKER, RENDER);
const get = (n) => merged.find((b) => b.name === n) || {};

if (merged.length !== 3) fail(`합친 개수 ${merged.length} — 저장본 없는 브랜드도 남아야 한다`);
// 핵심: 뒤에 온 Render 가 앞의 count 를 지우면 안 되고,
//       앞선 Worker 값이 Render 의 categories 를 막아서도 안 된다.
if (get("Vince").count !== 370) fail("Render 로 합치면서 Worker 의 count 가 사라졌다");
if (!get("Vince").categories) fail("Render 의 categories 가 안 붙었다");
if (get("American Eagle").blocked !== true) fail("blocked 표시가 안 붙었다 — 확장 담당 브랜드가 90초 헛기다림에 빠진다");
if (get("Apiece Apart").name !== "Apiece Apart") fail("Render 에만 있는 브랜드가 빠졌다");

// 반대 순서(캐시가 먼저, Worker 가 나중)에서도 지워지면 안 된다.
const other = mergeBrands(RENDER, WORKER);
const g2 = (n) => other.find((b) => b.name === n) || {};
if (!g2("Vince").categories) fail("Worker 로 합치면서 categories 가 지워졌다");
if (g2("Vince").count !== 370) fail("Worker 의 count 가 안 붙었다");
if (g2("American Eagle").blocked !== true) fail("Worker 로 합치면서 blocked 가 지워졌다");

// 빈 값이 멀쩡한 값을 덮으면 안 된다 — 서버가 빈 배열을 주는 일이 있다.
const wiped = mergeBrands(RENDER, [{ name: "Vince", categories: [], url: "" }]);
const w = wiped.find((b) => b.name === "Vince");
if (!w.categories || !w.categories.length) fail("빈 배열이 categories 를 덮었다");
if (!w.url) fail("빈 문자열이 url 을 덮었다");

if (mergeBrands(null, null).length !== 0) fail("빈 입력에서 터진다");

// 이름 대소문자가 달라도 한 브랜드다.
const dup = mergeBrands([{ name: "Vince", count: 1 }], [{ name: "vince", categories: ["tops"] }]);
if (dup.length !== 1) fail(`대소문자만 다른 이름이 둘로 갈렸다 (${dup.length}개)`);

// ── ② 방어 장치가 코드에 남아 있는가 ──
// 아래가 하나라도 빠지면 "새로고침해야 선택된다"가 그대로 돌아온다.
const gi = src.indexOf("const BRANDS_CACHE_KEY");
const gj = src.indexOf("// ── 검색바 아래 브랜드·카테고리 선택 UI ──", gi);
if (gi < 0 || gj < 0) { console.error("❌ loadBrandList 블록을 찾지 못함"); process.exit(1); }
const block = src.slice(gi, gj);

const MUST = [
  ["localStorage.getItem(BRANDS_CACHE_KEY", "캐시를 안 읽는다 — 두 번째 열기도 느리다"],
  ["localStorage.setItem(BRANDS_CACHE_KEY", "캐시를 안 쓴다 — 다음 열기에 또 기다린다"],
  ["brandsFromWorker", "Worker 폴백이 없다 — Render 가 자면 목록이 빈다"],
  ["catalogs=1", "Worker 목록 주소를 안 쓴다"],
  ["AbortController", "타임아웃이 없다 — 늘어진 요청에 매달린다"],
  ["r.ok", "응답 상태를 안 본다 — 502 본문을 JSON 으로 읽다 죽는다"],
  ["__brandsLoading", "중복 호출 방지가 없다 — 탭을 오갈 때마다 겹쳐 부른다"],
];
for (const [needle, why] of MUST) {
  if (!block.includes(needle)) fail(`${why} (${needle} 없음)`);
}

// Render 재시도: 대기 배열이 있고, 콜드스타트(≈50초)를 견딜 만큼 길어야 한다.
const waits = block.match(/const waits = \[([^\]]+)\]/);
if (!waits) fail("Render 재시도 대기 배열이 없다 — 콜드스타트에서 한 번 만에 포기한다");
else {
  const arr = waits[1].split(",").map((x) => Number(x.trim()));
  if (arr.length < 3) fail(`재시도가 ${arr.length}번뿐 — 콜드스타트를 못 넘긴다`);
  const total = arr.reduce((a, b) => a + b, 0);
  if (total < 30000) fail(`재시도 총 대기 ${total}ms — Render 콜드스타트(약 50초)에 모자란다`);
}

if (bad) { console.error(`\n브랜드 목록 ${bad}건 실패`); process.exit(1); }
console.log("✅ 브랜드 목록 통과 — 합치기 9건 · 방어 장치 8종 (캐시→Worker→Render 3단)");
