#!/usr/bin/env node
// 크롬 확장 폴더가 그대로 '압축해제된 확장'으로 올라갈 수 있는지 확인한다.
//
// 팀원은 chrome-extension 폴더만 받아 올린다. manifest 가 가리키는 파일이 하나라도
// 없거나, 확장 페이지에 인라인 스크립트·바깥 스크립트가 들어가면(MV3 는 둘 다 막는다)
// 올린 뒤에야 빈 화면으로 알게 된다. 브라우저 없이 미리 잡는다.
//
//   node scripts/test-extension-manifest.mjs
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXT = join(ROOT, "chrome-extension");
let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

let m;
try { m = JSON.parse(readFileSync(join(EXT, "manifest.json"), "utf8")); }
catch (e) { console.error("❌ manifest.json 을 읽지 못함: " + e.message); process.exit(1); }

if (m.manifest_version !== 3) fail("manifest_version 이 3 이 아니다");
if (!/^\d+\.\d+\.\d+$/.test(m.version || "")) fail("버전 형식: " + m.version);
if ((m.description || "").length > 132) fail(`description 이 132자를 넘는다(${m.description.length}) — 크롬이 거부한다`);

// manifest 가 가리키는 파일
const refs = [
  m.background && m.background.service_worker,
  m.action && m.action.default_popup,
  m.side_panel && m.side_panel.default_path,
].filter(Boolean);
for (const f of refs) if (!existsSync(join(EXT, f))) fail("manifest 가 가리키는 파일이 없다: " + f);
if (m.side_panel && !(m.permissions || []).includes("sidePanel")) fail("side_panel 을 쓰는데 sidePanel 권한이 없다");

// 서비스워커가 불러오는 파일
const bg = readFileSync(join(EXT, m.background.service_worker), "utf8");
for (const [, f] of bg.matchAll(/importScripts\(\s*'([^']+)'\s*\)/g)) {
  if (!existsSync(join(EXT, f))) fail("background 가 불러오는 파일이 없다: " + f);
}

// 확장 페이지: 스크립트는 폴더 안 파일로만
const pages = [m.action && m.action.default_popup, m.side_panel && m.side_panel.default_path].filter(Boolean);
for (const p of pages) {
  const html = readFileSync(join(EXT, p), "utf8");
  for (const [tag] of html.matchAll(/<script\b[^>]*>/gi)) {
    const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
    if (!src) { fail(`${p}: 인라인 <script> — MV3 확장 페이지에서는 실행되지 않는다`); continue; }
    if (/^(https?:)?\/\//.test(src)) { fail(`${p}: 바깥 스크립트 ${src} — MV3 에서 막힌다`); continue; }
    if (!existsSync(join(EXT, src))) fail(`${p}: 스크립트 파일이 없다 ${src}`);
  }
  if (/\son[a-z]+\s*=\s*["']/i.test(html.replace(/<!--[\s\S]*?-->/g, ""))) fail(`${p}: onclick 같은 인라인 이벤트 — MV3 에서 막힌다`);
}

// CHANGELOG 맨 위 항목이 지금 버전이어야 팀원이 '최신인가'를 맞춰 볼 수 있다.
const log = readFileSync(join(EXT, "CHANGELOG.md"), "utf8");
const top = (log.match(/^## (\d+\.\d+\.\d+)/m) || [])[1];
if (top !== m.version) fail(`CHANGELOG 맨 위(${top})와 manifest 버전(${m.version})이 다르다`);

if (bad) { console.error(`\n확장 폴더 ${bad}건 실패`); process.exit(1); }
console.log(`✅ 확장 폴더 통과 — v${m.version} · 참조 파일 ${refs.length}개 · 확장 페이지 ${pages.length}개`);
