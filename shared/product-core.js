// 상품 값 판정·엑셀 열 구성 — 미로 패널(index.html)과 독립 앱(app.html)이 함께 쓴다.
//
// 왜 파일로 뺐나: 같은 규칙이 여러 벌로 복사돼 있으면 한쪽만 고쳐지고 조용히
// 어긋난다. 이 저장소에서 실제로 세 번 났던 일이다 — 두 줄짜리 혼용률을 다루게
// 고칠 때 enrich·triage·preflight 세 곳 중 두 곳만 고쳐서, 같은 값이 어떤
// 화면에서는 옳고 어떤 화면에서는 틀렸다.
//
// Worker(worker/fabric-extractor.js)는 여전히 자기 사본을 갖는다 — Cloudflare 로
// 따로 배포되는 다른 실행 환경이라 파일을 공유할 수 없다. 대신
// scripts/test-valid.mjs 가 세 구현을 같은 표로 함께 돌려 어긋나면 CI 에서 막는다.
//
// 모듈이 아니라 평범한 스크립트다. GitHub Pages 에 정적 파일로 올라가고
// file:// 로 열어도 동작해야 하기 때문이다.
(function (root) {
  'use strict';

  // 예전 저장 사고로 '[object Object]' 가 값으로 남은 상품이 있다 — 빈 값으로 본다.
  const cleanVal = (v) => {
    const t = String(v || '').trim();
    return t.includes('[object Object]') ? '' : t;
  };

  // ── 값이 옳은지 판정 ────────────────────────────────────────────
  // '있다'가 아니라 '옳다'로 센다. 절반만 뽑힌 혼용률("Cotton 60%")이나
  // 안내 문구가 들어간 컬러("Select")는 엑셀에 실리면 오히려 헷갈린다.
  const COMP_ITEM_RX = /^[A-Za-z][A-Za-z ]{1,24} (\d{1,3})%$/;
  function validComp(s) {
    const t = String(s || '').trim();
    if (!t || t.includes('[object Object]')) return false;
    // 원단이 두 가지면 줄이 나뉜다. 줄마다 따로 본다.
    const lines = t.split('\n').map((x) => x.trim()).filter(Boolean);
    if (!lines.length || lines.length > 2) return false;
    for (const line of lines) {
      const parts = line.split(' / ');
      if (parts.length > 8) return false;
      let total = 0;
      for (const p of parts) {
        const m = p.match(COMP_ITEM_RX);
        if (!m) return false;
        const n = Number(m[1]);
        if (!(n > 0 && n <= 100)) return false;
        total += n;
      }
      const ok = (total >= 95 && total <= 105) || (lines.length === 1 && total >= 190 && total <= 210);
      if (!ok) return false;
    }
    return true;
  }

  const COLOR_BAD_RX = /^(?:select|choose|colou?r|색상|컬러|선택|기타|없음|n\/a|none|null|undefined|\d+|#[0-9a-f]{3,8})$/i;
  function validColor(s) {
    const t = String(s || '').trim();
    if (!t || t.length > 40 || t.includes('[object Object]')) return false;
    return !COLOR_BAD_RX.test(t);
  }

  // 상품URL 표기가 조금씩 달라도(www· 끝 슬래시·대소문자) 같은 상품으로 맞춘다.
  const urlKey = (u) => {
    try {
      const x = new URL(u);
      return (x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/+$/, '')).toLowerCase();
    } catch (e) { return ''; }
  };

  // ── 엑셀 열 스위치 ──────────────────────────────────────────────
  // 절반만 차 있으면 '확인 필요'가 뒤섞인 표가 나가는데, 그건 쓸 수 없다.
  // 그래서 95% 기준을 둔다 — 다만 그 기준을 '전체 평균'에 걸면, 이미 100%
  // 채워진 브랜드를 뽑을 때도 다른 브랜드가 비었다는 이유로 계속 빈 칸으로
  // 나간다. 기준은 같게 두고 적용 대상만 바꾼다: 지금 이 엑셀에 실리는
  // 상품들이 95% 를 넘기면 그 파일에는 열을 붙인다.
  //
  // 두 열을 따로 판단한다. 예전에는 하나로 묶어서, 혼용률이 98% 인 브랜드도
  // 컬러웨이가 60% 라는 이유로 혼용률 열까지 닫혔다 — 우선순위가 다른 두 값을
  // 한 스위치에 묶은 탓이다. 혼용률이 1순위이므로 각자 기준을 넘으면 각자 열린다.
  const SHOW_COMP_COLUMN = 'auto';    // 'auto' | true | false
  const SHOW_COLOR_COLUMN = false;    // 컬러웨이는 아직 닫아 둔다
  const FABRIC_GATE = 0.95;

  const NEED = '확인 필요';
  const NO_INFO = '정보 없음';

  const ratio = (items, ok) => (items && items.length ? items.filter(ok).length / items.length : 0);
  function compReady(items) {
    if (SHOW_COMP_COLUMN !== 'auto') return !!SHOW_COMP_COLUMN;
    return ratio(items, (r) => validComp(cleanVal(r.comp))) >= FABRIC_GATE;
  }
  function colorReady(items) {
    if (SHOW_COLOR_COLUMN !== 'auto') return !!SHOW_COLOR_COLUMN;
    return ratio(items, (r) => validColor(cleanVal(r.color))) >= FABRIC_GATE;
  }

  const BASE_COLS = [
    { header: '브랜드', key: 'brand', width: 18 },
    { header: '썸네일', key: 'img', width: 18 },
    { header: 'URL', key: 'link', width: 52 },
    { header: '상품명', key: 'name', width: 42 },
  ];
  const COLOR_COL = { header: '컬러웨이', key: 'color', width: 20 };
  // 원단이 두 가지면 두 줄로 들어간다 — 넉넉히 잡는다(wrapText 는 쓰는 쪽에서 켠다).
  const COMP_COL = { header: '혼용률', key: 'comp', width: 34 };

  // 열 문자(A,B,C…)는 열 개수에서 만든다 — 손으로 적으면 스위치를 켤 때 어긋난다.
  const colLetter = (n) => String.fromCharCode(65 + n);
  const colsFor = (showColor, showComp) =>
    BASE_COLS.concat(showColor ? [COLOR_COL] : [], showComp ? [COMP_COL] : []);
  const rowColFor = (cols) => {
    const m = {};
    cols.forEach((c, n) => { if (c.key !== 'img' && c.key !== 'link') m[c.key] = colLetter(n); });
    return m;
  };

  function rowValues(r, brandGuess, rowCol, showColor, showComp) {
    const vals = { brand: r.brand || brandGuess || '', name: r.name || '' };
    // 이미 모아 둔 값만 쓴다 — 여기서 상품 페이지를 읽으면 수십 개 상품에
    // 수십 번 접속하게 된다.
    if (showColor) vals.color = cleanVal(r.color);
    if (showComp) vals.comp = cleanVal(r.comp);
    for (const k of Object.keys(rowCol)) {
      if (String(vals[k] || '').trim()) continue;
      // '확인 필요'는 "아직 못 구했다 — 사람이 확인해 달라"는 뜻이다. 사이트가
      // 소재를 아예 안 적는 상품까지 그렇게 적으면, 아무리 확인해도 나오지 않는
      // 칸을 계속 들여다보게 된다. 그건 '정보 없음'으로 적어 구분한다.
      vals[k] = (k === 'comp' && r.compNone) ? NO_INFO : NEED;
    }
    return vals;
  }

  // ── 카탈로그 + 오버레이 합치기 ──────────────────────────────────
  // 상품 목록(catalog:<site>)과 혼용률·컬러·사이즈(comp:<site>)는 따로 저장된다.
  // 나눠 둔 이유는 Worker 의 CPU 한도 때문인데(카탈로그를 매번 파싱하면 죽는다),
  // 화면에서는 하나로 보여야 하므로 여기서 상품URL 기준으로 붙인다.
  function mergeOverlay(items, overlay, brand) {
    const ov = new Map();
    for (const [u, o] of Object.entries(overlay || {})) if (o) ov.set(urlKey(u), o);
    return (items || [])
      .filter((p) => p && p.imageUrl && p.productUrl)
      .map((p) => {
        const o = ov.get(urlKey(p.productUrl)) || {};
        return {
          name: p.name || '',
          imageUrl: p.imageUrl,
          productUrl: p.productUrl,
          price: p.price || o.price || '',
          priceOrig: p.priceOrig || o.priceOrig || '',
          comp: p.comp || o.comp || '',
          // 사이트가 소재를 아예 안 적는 상품 — 엑셀에서 '확인 필요'와 구분한다.
          compNone: !!(o.none && !(p.comp || o.comp)),
          color: p.color || o.color || '',
          sizes: p.sizes || o.sizes || '',
          brand: brand || '',
        };
      });
  }

  // ── 카테고리 재분류 ─────────────────────────────────────────────
  // 저장된 category 를 그대로 믿지 않는다. 수집할 때는 "어느 카테고리 페이지에서
  // 왔는가"로 정해지는데, 목록 페이지에 다른 종류가 섞여 있는 일이 흔하다.
  function guessCat(u, name) {
    const n = ' ' + String(name || '').toLowerCase() + ' ';
    const url = ' ' + String(u || '').toLowerCase() + ' ';
    const nHas = (re) => re.test(n);
    // ① 이름 우선. 순서가 중요하다:
    //   하의 먼저(trackpant·sweatpant가 sweat/top으로 새는 것 방지)
    //   → 스웨트(sweatshirt가 shirts로 새는 것 방지) → 티/탑(t-shirt가 shirts로 새는 것 방지) → 셔츠
    if (nHas(/dress|gown|jumpsuit|romper|원피스|점프수트/) && !nHas(/(?<!t[-\s])shirt[-\s]?dress/)) return 'dresses';
    if (nHas(/pants?\b|trouser|chino|legging|jogger|slack|culotte|capri|skorts?\b|skirts?\b|\bshorts\b|바지|팬츠|슬랙스|청바지|쇼츠|반바지|레깅스|조거|스커트|치마/) || nHas(/\b(?:jeans?|denim)\b(?!\s?(?:jacket|shirt|blouse|dress|skirt|vest|coat|top))/)) return 'pants';
    if (nHas(/sweat|hoodie|hoody|jumper|cardigan|knit(?!\s?(?:tank|tee|cami|top))|sweater|맨투맨|후드|니트|가디건|스웨터/)) return 'sweatshirts';
    if (nHas(/t[-\s]?shirt|tees?\b|tank|cami|camisole|halter|bodysuit|crop\s*top|티셔츠|나시|캐미|홀터/)) return 'tops';
    if (nHas(/shirt|blouse|button[-\s]?down|oxford|셔츠|블라우스|남방/)) return 'shirts';
    if (nHas(/\btop\b|탑/)) return 'tops';
    // ② 이름에 단서가 없으면 URL 보조
    // 이름이 겉옷을 가리키면 URL 보조는 건너뛴다. 상품명이 'Denim Jacket'인데 주소에 denim이
    // 들어 있다는 이유로 pants가 되던 문제 — 겉옷 칸이 없으니 기본값 tops로 두는 편이 덜 틀리다.
    const outer = nHas(/jacket|coat|blazer|parka|anorak|\bvest\b|재킷|자켓|코트|점퍼|베스트|조끼/);
    if (!outer && /dress|원피스/.test(url)) return 'dresses';
    if (!outer && /pants?\b|trouser|jeans?\b|denim|chino|legging|jogger|shorts?\b|skirts?\b|skorts?\b|바지|팬츠/.test(url)) return 'pants';
    if (/sweat|hoodie|knit|cardigan|맨투맨|후드|니트/.test(url)) return 'sweatshirts';
    if (/shirt|blouse|셔츠|블라우스/.test(url)) return 'shirts';
    return 'tops';
  }

  root.RackCore = {
    cleanVal, validComp, validColor, urlKey, guessCat,
    NEED, NO_INFO, FABRIC_GATE,
    compReady, colorReady, colsFor, rowColFor, rowValues, colLetter,
    mergeOverlay,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
