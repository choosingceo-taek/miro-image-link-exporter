#!/usr/bin/env node
// 팝업의 설정 항목이 실제로 저장되는지 확인한다.
//
// 팝업은 값을 메시지로 보내고, 배경 스크립트가 그걸 storage 에 넣는다. 이 사슬은
// 세 곳(HTML 체크박스 · 팝업 전송 · 배경 저장)에 같은 이름을 적어야 이어지는데,
// 한 군데만 빠뜨려도 조용히 끊긴다 — 화면에서는 체크가 되고, 팝업을 닫았다 열면
// 도로 돌아온다. 실제로 '자리를 비웠을 때만 수집'이 그 상태였다(배경에서 누락).
//
// 여기서는 세 파일을 문자열로 대조해 항목이 전 구간에 있는지 본다. 브라우저를
// 띄우지 않고도 배선이 끊긴 것을 잡는 게 목적이다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(ROOT, "chrome-extension/popup.html"), "utf8");
const popup = readFileSync(join(ROOT, "chrome-extension/popup.js"), "utf8");
const bg = readFileSync(join(ROOT, "chrome-extension/background.js"), "utf8");

// [설정 이름, 팝업 요소 id, 배경이 읽을 때 쓰는 키]
// 요소 id 와 저장 키가 다른 항목이 있다(schedTime → schedHour/schedMin).
const FIELDS = [
  { id: "schedOn", key: "schedOn" },
  { id: "schedVisible", key: "visible" },
  { id: "idleOnly", key: "idleOnly" },
  { id: "maxPages", key: "maxPages" },
];

let bad = 0;
const fail = (m) => { console.error("  ❌ " + m); bad++; };

// setSched 핸들러 본문만 떼어 본다 — 파일 어딘가에 이름이 있다는 것만으로는
// '저장한다'는 뜻이 아니다.
const si = bg.indexOf("if (msg.type === 'setSched')");
const sj = bg.indexOf("if (msg.type === 'runNow')", si);
if (si < 0 || sj < 0) { console.error("❌ setSched 핸들러를 찾지 못함"); process.exit(1); }
const setSched = bg.slice(si, sj);

// getSched 도 마찬가지 — 저장은 하는데 읽지 않으면 값이 안 쓰인다.
const gi = bg.indexOf("async function getSched()");
const gj = bg.indexOf("function nextRunAt", gi);
if (gi < 0 || gj < 0) { console.error("❌ getSched 를 찾지 못함"); process.exit(1); }
const getSched = bg.slice(gi, gj);

for (const f of FIELDS) {
  // ① 팝업 화면에 그 항목이 있는가
  if (!html.includes(`id="${f.id}"`)) fail(`popup.html 에 #${f.id} 가 없다`);
  // ② 팝업이 값을 읽어 보내는가
  if (!popup.includes(`$('${f.id}')`)) fail(`popup.js 가 #${f.id} 를 읽지 않는다`);
  // ③ 값이 바뀌면 저장이 불리는가
  if (!new RegExp(`\\[[^\\]]*'${f.id}'[^\\]]*\\][\\s\\S]{0,120}saveSched`).test(popup)) {
    fail(`popup.js 의 change 리스너 목록에 '${f.id}' 가 없다 — 바꿔도 저장이 안 불린다`);
  }
  // ④ 배경이 그 값을 실제로 저장하는가
  if (!setSched.includes(`${f.key}:`)) {
    fail(`background.js 의 setSched 가 ${f.key} 를 저장하지 않는다 — 껐다 열면 도로 켜진다`);
  }
  // ⑤ 배경이 그 값을 다시 읽는가
  if (!getSched.includes(f.key)) fail(`background.js 의 getSched 가 ${f.key} 를 읽지 않는다`);
}

// 시각은 id 와 저장 키가 다르므로 따로 본다.
if (!html.includes('id="schedTime"')) fail("popup.html 에 #schedTime 이 없다");
for (const k of ["schedHour", "schedMin"]) {
  if (!setSched.includes(`${k}:`)) fail(`setSched 가 ${k} 를 저장하지 않는다`);
  if (!getSched.includes(k)) fail(`getSched 가 ${k} 를 읽지 않는다`);
}
// 시각을 바꾸면 알람을 다시 걸어야 한다 — 안 그러면 옛 시각에 그대로 돈다.
if (!setSched.includes("applySchedule()")) {
  fail("setSched 가 applySchedule() 를 안 부른다 — 시각을 바꿔도 옛 시각에 실행된다");
}

if (bad) { console.error(`\n설정 배선 ${bad}건 끊김`); process.exit(1); }
console.log(`✅ 팝업 설정 배선 통과 — ${FIELDS.length + 1}개 항목이 화면→전송→저장→읽기까지 이어진다`);
