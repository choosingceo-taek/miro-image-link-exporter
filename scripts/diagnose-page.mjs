#!/usr/bin/env node
// 상품이 0개로 나오는 목록 페이지의 "왜"를 구조까지 파고들어 찍는다.
//
// 야간 수집 리포트는 여기까지만 알려 준다:
//   링크 259/이미지 85 · 탈락[total=259 noImage=230 ...]
// "이미지가 안 붙어서 다 버렸다"는 알겠는데, 이미지가 왜 안 붙는지를 모르면
// 선택자를 어떻게 고쳐야 할지 정할 수 없다. 지연 로딩이라 src 가 비어 있는 건지,
// CSS 배경으로 깔린 건지, 카드가 shadow DOM 안에 있는 건지, 아니면 애초에
// 차단 페이지를 받은 건지 — 원인마다 고칠 곳이 다르다.
//
// 그래서 이 스크립트는 수집기와 같은 판단을 재현한 뒤, 버려진 링크들을 다시 열어
// 그 주변에 무엇이 있었는지를 센다. 사람이 사이트에 직접 못 들어가도 원인을
// 좁힐 수 있게 하는 것이 목적이다.
//
//   node scripts/diagnose-page.mjs <url> [url...]
//   URLS="a,b" node scripts/diagnose-page.mjs
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const URLS = (process.argv.slice(2).length
  ? process.argv.slice(2)
  : String(process.env.URLS || "").split(",")
).map((s) => s.trim()).filter(Boolean);

if (!URLS.length) {
  console.error("URL 을 주세요: node scripts/diagnose-page.mjs <url> [url...]");
  process.exit(1);
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// 페이지 안에서 도는 조사기. 수집기(collector.js)와 같은 순서로 이미지를 찾아 보고,
// 실패하면 "그럼 뭐가 있었나"를 기록한다.
const PROBE = () => {
  // collector.js 의 abs 와 같아야 한다. 빈 문자열을 걸러내지 않으면
  // new URL("", href) 가 페이지 주소를 돌려줘서, src="" 인 지연 로딩 이미지가
  // "주소를 찾았다"로 잡힌다 — 진단이 원인을 정반대로 말하게 된다.
  const abs = (u) => {
    const v = String(u || "").trim();
    if (!v || /^(data|blob|javascript):/i.test(v)) return "";
    try { const a = new URL(v, location.href); return /^https?:$/.test(a.protocol) ? a.href : ""; }
    catch (e) { return ""; }
  };
  const badUrl = (u) => !u || /\.svg(\?|#|$)/i.test(u) || /placeholder|blank|spacer|1x1|transparent/i.test(u);

  // 수집기가 보는 것과 같은 후보들.
  const IMG_ATTRS = ["src", "data-src", "data-lazy", "data-original", "data-image", "data-srcset", "srcset"];

  const out = {
    url: location.href, title: document.title,
    anchors: 0, withImg: 0, imgEmptySrc: 0, bgImage: 0, sourceSrcset: 0,
    inShadow: 0, resolved: 0,
    attrHits: {},          // 어떤 속성에 진짜 주소가 들어 있었나
    otherAttrs: {},        // 우리가 안 보는 속성 중 이미지처럼 생긴 값이 든 것
    cardClasses: {},       // 반복되는 카드 컨테이너 class — 선택자 후보
    samples: [],
    iframes: document.querySelectorAll("iframe").length,
    shadowHosts: 0,
    totalImgs: document.querySelectorAll("img").length,
    bodyText: (document.body ? document.body.innerText : "").replace(/\s+/g, " ").trim().slice(0, 200),
  };

  // shadow DOM 안에 상품이 들어 있으면 querySelectorAll 로는 아예 안 보인다.
  const walkShadow = (root, depth) => {
    if (depth > 4) return;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) { out.shadowHosts++; out.inShadow += el.shadowRoot.querySelectorAll("a[href]").length; walkShadow(el.shadowRoot, depth + 1); }
    }
  };
  try { walkShadow(document, 0); } catch (e) {}

  const anchors = [...document.querySelectorAll("a[href]")];
  out.anchors = anchors.length;

  for (const a of anchors) {
    const card = a.closest('article,li,[class*="card"],[class*="product"],[class*="tile"],[class*="item"],div') || a;
    const img = a.querySelector("img") || card.querySelector("img");
    if (img) out.withImg++;

    // ① 수집기가 실제로 쓰는 경로로 뽑아 본다.
    let got = "";
    if (img) {
      for (const at of IMG_ATTRS) {
        const raw = at === "srcset"
          ? (img.getAttribute("srcset") || "").split(",").pop().trim().split(/\s+/)[0]
          : img.getAttribute(at);
        const u = abs(raw || "");
        if (!badUrl(u)) { got = u; out.attrHits[at] = (out.attrHits[at] || 0) + 1; break; }
      }
      if (!got) {
        out.imgEmptySrc++;
        // ② 우리가 안 보는 속성에 주소가 숨어 있나 — 여기서 이름이 나오면 그걸 추가하면 된다.
        for (const at of img.getAttributeNames()) {
          if (IMG_ATTRS.includes(at)) continue;
          const v = img.getAttribute(at) || "";
          if (/\.(jpe?g|png|webp|avif)/i.test(v) || /^https?:\/\/[^ ]+image/i.test(v)) {
            out.otherAttrs[at] = (out.otherAttrs[at] || 0) + 1;
          }
        }
      }
    }
    // ③ <source srcset> / CSS 배경으로 깔린 경우
    if (!got && card.querySelector("source[srcset], source[data-srcset]")) { out.sourceSrcset++; }
    if (!got) {
      const bgEl = card.querySelector('[style*="background-image"]');
      if (bgEl) out.bgImage++;
      else {
        // 인라인 style 이 아니라 스타일시트로 깔린 배경은 getComputedStyle 로만 보인다.
        try {
          const bg = getComputedStyle(card).backgroundImage || "";
          if (bg && bg !== "none" && /url\(/i.test(bg)) out.bgImage++;
        } catch (e) {}
      }
    }
    if (got) {
      out.resolved++;
      const cls = (card.className && String(card.className).slice(0, 60)) || "(no class)";
      out.cardClasses[cls] = (out.cardClasses[cls] || 0) + 1;
    }
  }

  // 상품처럼 생겼는데 이미지가 안 붙은 링크의 실제 HTML 을 몇 개 남긴다.
  for (const a of anchors) {
    if (out.samples.length >= 3) break;
    const href = a.getAttribute("href") || "";
    if (!/\/(p|product|products|prod)\//i.test(href) && !/-\d{4,}/.test(href)) continue;
    const card = a.closest('article,li,[class*="card"],[class*="product"],[class*="tile"]') || a;
    const img = card.querySelector("img");
    if (img && !badUrl(abs(img.getAttribute("src") || ""))) continue;   // 잘 되는 건 볼 필요 없다
    out.samples.push({
      href,
      cardClass: (card.className && String(card.className).slice(0, 80)) || "",
      imgAttrs: img ? img.getAttributeNames().map((n) => n + "=" + String(img.getAttribute(n)).slice(0, 70)) : null,
      html: card.outerHTML.replace(/\s+/g, " ").slice(0, 500),
    });
  }
  return out;
};

const BLOCK_RX = /access denied|forbidden|are you a robot|captcha|bot detection|cloudflare|perimeterx|akamai|incapsula|unusual traffic|잠시 후 다시/i;

const lines = [];
const say = (s) => { lines.push(s); console.log(s); };

say(`# 목록 페이지 진단 (${new Date().toISOString().slice(0, 16).replace("T", " ")}Z)`);
say("");
say("상품이 0개로 나오는 페이지를 진짜 크롬으로 열어 구조를 뜯어본 결과입니다.");
say("");

// 브라우저가 미리 깔린 환경에서는 그 실행 파일을 쓴다.
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 2200 }, locale: "en-US" });

for (const url of URLS) {
  say(`## ${url}`);
  say("");
  const page = await ctx.newPage();
  let resp = null;
  try {
    resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    // 지연 로딩을 깨우기 위해 실제 사용자처럼 굴려 준다.
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 1600);
      await page.waitForTimeout(700);
    }
    await page.waitForTimeout(1500);
  } catch (e) {
    say(`- ⛔ 페이지 로드 실패: ${String((e && e.message) || e).split("\n")[0]}`);
    say("");
    await page.close().catch(() => {});
    continue;
  }

  const status = resp ? resp.status() : 0;
  const d = await page.evaluate(PROBE).catch((e) => ({ error: String(e && e.message) }));
  if (d.error) { say(`- ⛔ 조사 실패: ${d.error}`); say(""); await page.close(); continue; }

  const blocked = status >= 400 || BLOCK_RX.test(d.title) || BLOCK_RX.test(d.bodyText);
  say(`- HTTP **${status}** · 최종주소 \`${d.url}\``);
  say(`- 제목: "${d.title}"`);
  if (blocked) {
    say("");
    say("### ⛔ 차단으로 보입니다 — 선택자 문제가 아닙니다");
    say("");
    say("데이터센터 IP(GitHub Actions)가 막혔다는 뜻이므로, 이 브랜드는 **확장(가정용 IP)** 이 맡아야 합니다.");
    say(`> ${d.bodyText.slice(0, 200)}`);
    say("");
    await page.close();
    continue;
  }

  say(`- 링크 ${d.anchors}개 · \`<img>\` ${d.totalImgs}개 · iframe ${d.iframes}개`);
  say(`- 링크 중 이미지가 딸린 것 ${d.withImg}개 → 그중 주소를 뽑아낸 것 **${d.resolved}개**`);
  say("");

  const rows = [
    ["img 는 있는데 주소가 비어 있음", d.imgEmptySrc, "지연 로딩. 아래 '못 보던 속성'을 수집기에 추가하면 됩니다"],
    ["<source srcset> 로만 있음", d.sourceSrcset, "picture 태그 — 수집기가 이미 보지만 카드 범위가 안 맞을 수 있습니다"],
    ["CSS 배경으로 깔림", d.bgImage, "스타일시트 배경은 인라인 style 검사로 안 잡힙니다"],
    ["shadow DOM 안의 링크", d.inShadow, `shadow 호스트 ${d.shadowHosts}개 — querySelectorAll 로는 안 보입니다`],
  ].filter((r) => r[1] > 0);

  if (rows.length) {
    say("| 증상 | 개수 | 뜻 |");
    say("|---|---:|---|");
    for (const [a, b, c] of rows) say(`| ${a} | ${b} | ${c} |`);
    say("");
  }

  const kv = (o, label) => {
    const e = Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (!e.length) return;
    say(`**${label}**: ` + e.map(([k, v]) => `\`${k}\` ${v}`).join(" · "));
    say("");
  };
  kv(d.attrHits, "주소를 찾은 속성");
  kv(d.otherAttrs, "우리가 안 보는 속성인데 이미지 주소가 들어 있음 ← 여기에 답이 있을 가능성이 큽니다");
  kv(d.cardClasses, "성공한 카드의 class");

  if (d.samples.length) {
    say("**이미지가 안 붙은 상품 링크 표본**");
    say("");
    for (const s of d.samples) {
      say(`- \`${s.href}\``);
      if (s.cardClass) say(`  - 카드 class: \`${s.cardClass}\``);
      say(`  - img 속성: ${s.imgAttrs ? "`" + s.imgAttrs.join("` `") + "`" : "(img 없음)"}`);
      say("  - ```" + s.html.slice(0, 400) + "```");
    }
    say("");
  }
  await page.close().catch(() => {});
}

await browser.close();

const path = process.env.OUT || "diagnose-page.md";
writeFileSync(path, lines.join("\n") + "\n");
console.error(`\n리포트: ${path}`);
