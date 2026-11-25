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

  // ── 엑셀 추가 열(상품 상세) ─────────────────────────────────────
  // 기존 열(브랜드·썸네일·URL·상품명·[컬러웨이]·[혼용률])과 그 순서·95% 기준은 그대로 두고, 그 뒤에 붙인다.
  // 이 열들은 '확인 필요' 표시를 하지 않는다 — 빈 칸 = 아직 안 모였거나 사이트가 안 적음.
  // 값은 사이트에 적힌 글 그대로다(설명·디테일은 Worker 의 detail:<site> 에서 — 내보낼 때만 받는다).
  const EXTRA_COLS = [
    { header: '판매가', key: 'price', width: 12 },
    { header: '정가', key: 'priceOrig', width: 12 },
    { header: '사이즈', key: 'sizes', width: 24 },
    { header: '컬러 전부', key: 'colors', width: 28 },
    { header: '설명', key: 'desc', width: 60 },
    { header: '디테일', key: 'feat', width: 50 },
    { header: '이미지 링크', key: 'imgs', width: 60 },
  ];
  const exportCols = (showColor, showComp) => colsFor(showColor, showComp).concat(EXTRA_COLS);
  // 추가 열의 열 문자(기존 열 뒤부터).
  function extraColFor(cols) {
    const m = {};
    const keys = new Set(EXTRA_COLS.map((c) => c.key));
    cols.forEach((c, n) => { if (keys.has(c.key)) m[c.key] = colLetter(n); });
    return m;
  }
  // 한 상품의 추가 열 값. d = 상세 저장값(detail:<site> 의 한 상품) 또는 없음.
  function extraValues(r, d) {
    const x = d || {};
    const list = (v, sep) => (Array.isArray(v) ? v.map((t) => String(t).trim()).filter(Boolean).join(sep) : cleanVal(v));
    // 사이즈: 재고 사이즈를 알면 품절 사이즈에 (품절)을 붙인다.
    let sizes = cleanVal(r.sizes);
    if (Array.isArray(x.sizesIn) && sizes) {
      const inStock = new Set(x.sizesIn.map((t) => String(t).trim().toLowerCase()));
      sizes = sizes.split(/\s*,\s*/).map((t) => (inStock.has(t.toLowerCase()) ? t : t + '(품절)')).join(', ');
    }
    const imgs = Array.isArray(x.imgs) && x.imgs.length ? x.imgs : (r.imageUrl ? [r.imageUrl] : []);
    return {
      price: cleanVal(r.price), priceOrig: cleanVal(r.priceOrig), sizes,
      colors: list(x.colors, ', '), desc: cleanVal(x.desc), feat: list(x.feat, '\n'), imgs: list(imgs, '\n'),
    };
  }
  // 상세 저장값(상품URL → 상세)을 상품에 붙인다(표기가 조금 달라도 같은 상품으로 — urlKey).
  function attachDetails(items, detailMap) {
    const m = new Map();
    for (const [u, d] of Object.entries(detailMap || {})) if (d) m.set(urlKey(u), d);
    let n = 0;
    for (const p of items || []) { const d = m.get(urlKey(p.productUrl)); if (d) { p.detail = d; n++; } }
    return n;
  }

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

  // ── 전체 상품 검색(독립 앱) ─────────────────────────────────────
  // Worker 검색 인덱스(?index=1)에서 상품명으로 찾는다. 미로 패널과 같은 규칙
  // (두 글자 이상, 300개 상한)에 하나만 더했다: 띄어 쓴 낱말이 순서와 상관없이
  // 모두 들어 있으면 맞는 것으로 본다("linen shirt" 로 "Shirt in Linen" 도 찾는다).
  // 낱말 하나만 넣으면 미로 패널과 결과가 같다.
  const SEARCH_MIN = 2;
  const SEARCH_CAP = 300;
  function searchIndex(index, q, cap) {
    const max = cap || SEARCH_CAP;
    const query = String(q || '').trim().toLowerCase();
    if (query.length < SEARCH_MIN) return { hits: [], total: 0, capped: false, short: true };
    const words = query.split(/\s+/).filter(Boolean);
    const hits = [];
    let total = 0;
    for (const it of index || []) {
      if (!it || !it.imageUrl || !it.productUrl) continue;
      const name = String(it.name || '').toLowerCase();
      if (!words.every((w) => name.includes(w))) continue;
      total++;
      if (hits.length < max) hits.push(it);
    }
    return { hits, total, capped: total > max, short: false };
  }

  // 인덱스 항목 → 화면·엑셀이 쓰는 상품 모양(mergeOverlay 결과와 같은 필드).
  // 인덱스의 혼용률은 야간 보강 때 오버레이에서 옮겨 적은 것이다. '사이트 미표기'
  // 표시(none)는 인덱스에 없으므로 compNone 은 오버레이를 받아야 켜진다.
  function fromIndex(it) {
    return {
      name: it.name || '',
      imageUrl: it.imageUrl,
      productUrl: it.productUrl,
      price: it.price || '',
      priceOrig: it.priceOrig || '',
      comp: it.comp || '',
      compNone: false,
      color: it.color || '',
      sizes: it.sizes || '',
      brand: it.brand || '',
      cat: guessCat(it.productUrl, it.name),
    };
  }

  // 이미 화면에 있는 상품에 나중에 받은 오버레이를 덧입힌다. 인덱스는 하루 한 번
  // 만들어지고 오버레이는 확장·보강이 올 때마다 바뀌므로, 오버레이 값이 있으면
  // 그쪽을 믿는다. 값이 없는 필드는 원래 값을 지우지 않는다.
  function applyOverlay(items, overlay) {
    const ov = new Map();
    for (const [u, o] of Object.entries(overlay || {})) if (o) ov.set(urlKey(u), o);
    let changed = 0;
    for (const p of items || []) {
      const o = ov.get(urlKey(p.productUrl));
      if (!o) continue;
      const before = p.comp + '|' + p.compNone + '|' + p.color;
      if (o.comp) p.comp = o.comp;
      if (o.color) p.color = o.color;
      if (o.sizes && !p.sizes) p.sizes = o.sizes;
      if (o.price && !p.price) p.price = o.price;
      p.compNone = !!(o.none && !p.comp);
      if (before !== p.comp + '|' + p.compNone + '|' + p.color) changed++;
    }
    return changed;
  }

  // ── 세그먼트(YWMN·WMN·ACTIVE·SLEEP) ────────────────────────────
  // 미로 패널과 같은 뜻: 한 번에 하나만 켠다, 아무것도 안 켜면 전체, 분류가 없는
  // 브랜드는 전체에서만 보인다. 분류는 Render 의 /api/brands(brands.json)에 있고
  // Worker 브랜드 목록에는 없다 — 브랜드 이름(대소문자 무시)으로 맞춘다.
  const SEGMENTS = [['YWMN', 'YWMN'], ['WMN', 'WMN'], ['ACTIVE', 'Active'], ['SLEEP', 'Sleep']];
  const nameKey = (s) => String(s || '').trim().toLowerCase();
  function segMapOf(renderBrands) {
    const m = {};
    for (const b of renderBrands || []) {
      if (!b || !b.name || !Array.isArray(b.segments) || !b.segments.length) continue;
      m[nameKey(b.name)] = b.segments.slice();
    }
    return m;
  }
  const segsOf = (brandName, segMap) => (segMap && segMap[nameKey(brandName)]) || [];
  const inSeg = (brandName, seg, segMap) => !seg || segsOf(brandName, segMap).includes(seg);
  // 탭마다 '눌러도 되는가'. 분류가 아직 하나도 없으면 아무 탭도 잠그지 않는다 —
  // 분류가 늦게 오는 사이에 개수를 세면 전부 0이라 네 탭이 통째로 잠긴다(패널에서 실제로 그랬다).
  function segState(brandNames, segMap) {
    const anySeg = (brandNames || []).some((n) => segsOf(n, segMap).length);
    const out = {};
    for (const [k] of SEGMENTS) {
      out[k] = { count: (brandNames || []).filter((n) => segsOf(n, segMap).includes(k)).length };
      out[k].disabled = anySeg && !out[k].count;
    }
    return { anySeg, segs: out };
  }

  // ── 선택 바구니 ────────────────────────────────────────────────
  // 브랜드를 옮기거나 검색을 해도 고른 상품이 남아 있어야 여러 브랜드를 한
  // 엑셀에 담을 수 있다. 그래서 선택을 '지금 화면의 상품'이 아니라 상품URL 을
  // 열쇠로 한 바구니에 상품 정보째 담아 둔다.
  const hasComp = (p) => validComp(cleanVal(p && p.comp));
  function basketSummary(items) {
    const list = items || [];
    const brands = new Set(list.map((p) => nameKey(p.brand)).filter(Boolean));
    const ok = list.filter(hasComp).length;
    const none = list.filter((p) => p.compNone && !hasComp(p)).length;
    return {
      n: list.length, brands: brands.size, comp: ok, none,
      pct: list.length ? Math.round((ok / list.length) * 100) : 0,
      ready: compReady(list),
    };
  }
  // 혼용률이 없는 것을 뺀다 — 95% 기준에 걸려 열이 닫힐 때 한 번에 여는 버튼.
  const compOnly = (items) => (items || []).filter(hasComp);

  // 엑셀 행 순서: 브랜드가 처음 담긴 순서대로 묶고, 브랜드 안에서는 담은 순서.
  function exportOrder(items) {
    const first = new Map();
    (items || []).forEach((p, i) => { const k = nameKey(p.brand); if (!first.has(k)) first.set(k, i); });
    return (items || []).map((p, i) => [p, i])
      .sort((a, b) => (first.get(nameKey(a[0].brand)) - first.get(nameKey(b[0].brand))) || (a[1] - b[1]))
      .map((x) => x[0]);
  }

  // 파일 이름: 한 브랜드면 그 브랜드, 여럿이면 RACK_<n>brands_<날짜>.
  function exportFileName(items, date, fallback) {
    const day = String(date || new Date().toISOString()).slice(0, 10);
    const names = [...new Set((items || []).map((p) => String(p.brand || '').trim()).filter(Boolean)
      .map((s) => s.toLowerCase()))];
    if (names.length > 1) return `RACK_${names.length}brands_${day}.xlsx`;
    const one = (items || []).map((p) => String(p.brand || '').trim()).find(Boolean) || fallback || 'rack';
    return `${one.replace(/[^\w가-힣]+/g, '_').slice(0, 30)}_${day}.xlsx`;
  }

  // Shift+클릭 범위: 마지막으로 누른 카드와 지금 카드 사이(양끝 포함)의 상품URL.
  function rangeBetween(list, a, b) {
    if (a < 0 || b < 0) return [];
    const lo = Math.min(a, b), hi = Math.max(a, b);
    return (list || []).slice(lo, hi + 1).map((p) => p.productUrl);
  }

  // ── 주소 해시(바로가기) ────────────────────────────────────────
  // #site=<사이트 키> 또는 #q=<검색어>. 확장이 '수집한 브랜드 리서치에서 보기'로
  // 여는 주소가 이것이고, 사용자가 화면을 옮길 때마다 갱신돼 즐겨찾기·공유가 된다.
  function parseHash(h) {
    const s = String(h || '').replace(/^#/, '');
    const p = new URLSearchParams(s);
    return { site: (p.get('site') || '').trim(), q: (p.get('q') || '').trim() };
  }
  function makeHash(st) {
    const p = new URLSearchParams();
    if (st && st.site) p.set('site', st.site);
    else if (st && st.q) p.set('q', st.q);
    const s = p.toString();
    return s ? '#' + s : '';
  }

  root.RackCore = {
    cleanVal, validComp, validColor, urlKey, guessCat,
    NEED, NO_INFO, FABRIC_GATE,
    compReady, colorReady, colsFor, rowColFor, rowValues, colLetter,
    EXTRA_COLS, exportCols, extraColFor, extraValues, attachDetails,
    mergeOverlay,
    SEARCH_MIN, SEARCH_CAP, searchIndex, fromIndex, applyOverlay,
    SEGMENTS, segMapOf, segsOf, inSeg, segState,
    hasComp, basketSummary, compOnly, exportOrder, exportFileName, rangeBetween,
    parseHash, makeHash,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
