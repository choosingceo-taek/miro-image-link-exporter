// Cloudflare Worker — 원단 정보 추출기 + 이미지 프록시 (Google Gemini · 무료 티어)
// ------------------------------------------------------------------
//  POST { "url": "https://..." }
//     → { url, product_name, image_url, composition:[{material,percent}], materials:[], status, note }
//       image_url = 상품 페이지 대표 이미지(og:image) 주소
//
//  GET  ?img=<이미지URL>[&token=...]
//     → 그 이미지를 서버에서 대신 가져와 CORS 허용 헤더와 함께 반환(프록시).
//       브라우저(패널)가 남의 도메인 이미지를 엑셀에 넣을 수 있게 해줍니다.
//
//  GET  ?board=<boardId>&item=<itemId>[&token=...]
//     → 미로 보드의 그 이미지를 REST API로 받아와 CORS 허용 헤더와 함께 반환(썸네일용).
//       (미로는 업로드 이미지 원본 주소를 Web SDK로 노출하지 않아 REST API가 필요.)
//
//  GET  ?collection=<Shopify 컬렉션URL>&limit=30[&token=...]
//     → 그 컬렉션의 최신 상품 목록(제목/이미지/링크)을 JSON으로 반환(신상품 가져오기 기능이 사용).
//
//  GET  /install            → 미로 authorize 로 리다이렉트(이 링크를 팀에 공유해 설치)
//  GET  /oauth/callback     → 설치 시 그 팀의 access_token 을 받아 KV(mtok:<teamId>)에 저장
//
//  OAuth 설치용 시크릿(여러 팀이 설치 링크만으로 썸네일까지 쓰게 하려면 필요):
//               CLIENT_ID       (`wrangler secret put CLIENT_ID`)     ← 미로 앱 설정의 Client ID
//               CLIENT_SECRET   (`wrangler secret put CLIENT_SECRET`) ← 미로 앱 설정의 Client secret
//               (미로 앱 설정 Redirect URI 에 https://<worker>/oauth/callback 을 등록해야 함)
//  선택 시크릿:  MIRO_TOKEN      (`wrangler secret put MIRO_TOKEN`)  ← 단일 팀만 쓸 때의 개인 토큰(레거시)
//               GEMINI_API_KEY  (원단 분석 레거시 기능에만)
//  선택 변수:    ALLOWED_ORIGIN(기본 "*"), ACCESS_TOKEN(설정 시 POST 헤더/GET 쿼리로 검증)
// ------------------------------------------------------------------

// 무료 티어 모델. 필요하면 'gemini-2.5-flash' 등으로 변경 가능.
// (URL 읽기 도구 url_context는 무료 한도가 매우 낮아, Worker가 직접 페이지를 가져와
//  일반 텍스트 생성으로 추출합니다 — 무료 한도가 훨씬 넉넉함.)
const MODEL = 'gemini-2.0-flash';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const MAX_IMG_BYTES = 8 * 1024 * 1024;

const SYSTEM = `You extract fabric / material information from a single clothing product web page.
You are given a product URL and the extracted TEXT of that page. Read the provided text
(look for "materials", "composition", "fabric", "care", "product details" sections).

Respond with ONLY one JSON object — no markdown fences, no prose. Shape:
{
  "product_name": string,        // garment name; "" if unknown
  "image_url": string,           // absolute URL of the MAIN product image. Prefer the og:image
                                 // meta tag; otherwise the primary product photo. "" if none found.
  "composition": [               // fiber breakdown; [] if not stated on the page
    { "material": string, "percent": number }   // e.g. {"material":"Cotton","percent":60}
  ],
  "materials": [string],         // distinct material names present, e.g. ["Cotton","Elastane"]
  "price": string,               // the price the customer pays now, with currency symbol exactly as
                                 // stated, e.g. "$128", "₩89,000". If discounted, this is the SALE
                                 // price (the lower one). "" if not stated.
  "price_original": string,      // the pre-discount / list / "was" price, same formatting.
                                 // "" when the item is not on sale.
  "color": string,               // colorway of THIS product page, e.g. "Black", "Ivory / Navy"; "" if not stated
  "sizes": [string],             // size options offered, in the order shown, e.g. ["XS","S","M","L"]
                                 // or ["24","25","26"] or ["UK 8","UK 10"]. [] if the page shows none.
  "status": "ok" | "no_data" | "blocked",  // no_data = loaded but no composition; blocked = could not access
  "note": string                 // short reason when not "ok"; else ""
}

Rules:
- Composition comes from wherever the page states fibre percentages — the words around it vary by
  site ("Material", "Materials", "Composition", "Fabric", "Fabrication", "Fibre content",
  "Shell", "Made of", "소재", "혼용률", "혼용율", "겉감"). Any place a fibre name sits next to a
  percentage is composition. Take every fibre listed with a percent.
- Normalize material names to English title case: Cotton, Polyester, Elastane, Modal, Nylon,
  Viscose, Wool, Silk, Linen, Cashmere, Acrylic, Lyocell, Spandex→Elastane, Polyamide→Nylon.
- sizes: list only the sizes actually offered for this garment. Ignore sold-out markers, size
  guides, model-height notes ("model wears S"), and shoe/accessory sizes when the item is apparel.
  Keep the site's own labels — do not translate or convert them.
- price / price_original: if the page shows two prices (struck-through and current), "price" is the
  one the customer pays and "price_original" is the struck-through one. Never swap them. If only
  one price is shown, leave "price_original" empty.
- If the garment has multiple parts (shell / lining / trim), merge into one overall breakdown
  and mention that in "note".
- percent must be a number (no "%" sign). If a material has no percent, still add it to
  "materials" but omit it from "composition".
- image_url must be an absolute https URL (starting with http). If only a relative path is on the
  page, resolve it against the product URL. If you cannot find an image, use "".
- Never invent data. If the page loads but no composition is stated, use status "no_data".
- If you cannot access the page at all, use status "blocked".`;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-access-token',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const reqUrl = new URL(request.url);

    // ── OAuth 설치 플로우 (팀이 이 링크로 설치 → 그 팀 토큰을 자동 저장) ──────
    //   GET /install         → 미로 authorize 페이지로 리다이렉트(이 링크를 팀에 공유)
    //   GET /oauth/callback  → 코드를 access_token 으로 교환해 KV(mtok:<teamId>)에 저장
    //   (이렇게 하면 팀은 설치 링크 클릭만으로 썸네일까지 바로 동작 — 밑작업 불필요)
    if (reqUrl.pathname === '/install' || reqUrl.pathname === '/oauth/install') {
      if (!env.CLIENT_ID) return new Response('server is missing CLIENT_ID', { status: 500, headers: cors });
      const redirectUri = reqUrl.origin + '/oauth/callback';
      const authorize = 'https://miro.com/oauth/authorize?response_type=code'
        + '&client_id=' + encodeURIComponent(env.CLIENT_ID)
        + '&redirect_uri=' + encodeURIComponent(redirectUri);
      return Response.redirect(authorize, 302);
    }
    if (reqUrl.pathname === '/oauth/callback') return handleOAuthCallback(reqUrl, env);

    // ── 이미지 프록시 (GET ?img=...) ──────────────────────────────
    if (request.method === 'GET') {
      const tokOk = !env.ACCESS_TOKEN || reqUrl.searchParams.get('token') === env.ACCESS_TOKEN;

      // og:image + og:title만 추출 (AI 미사용 — 무료 한도와 무관).
      // 패널이 상품명 보강(URL로만 추정한 이름 → 실제 페이지 제목)에도 사용.
      const meta = reqUrl.searchParams.get('meta');
      if (meta) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        const page = await fetchPageText(meta);
        return json({
          url: meta,
          image_url: page.ok ? (page.ogImage || '') : '',
          title: page.ok ? (page.title || '') : '',
          status: page.ok ? 'ok' : 'blocked',
          note: page.ok ? '' : ('fetch ' + page.status),
        }, 200, cors);
      }

      // 혼용률 한 건 (GET ?comp=<상품URL>) — 야간 보강 배치의 우회로.
      // GitHub Actions IP 는 많은 쇼핑몰에서 403 인데 Cloudflare IP 는 통과하는 경우가 많다.
      // 여기서는 이미 있는 fetchPageText(Shopify JSON → 직접 → 리더 프록시)를 그대로 쓴다.
      const compUrl = reqUrl.searchParams.get('comp');
      if (compUrl) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        const page = await fetchPageText(compUrl);
        if (!page.ok) return json({ url: compUrl, comp: '', status: 'blocked', note: String(page.status) }, 200, cors);
        const ld = fromJsonLd(page.html || '');
        const comp = (ld.composition && ld.composition.length)
          ? ld.composition.map((c) => c.material + ' ' + c.percent + '%').join(' / ')
          : compFromText(page.text);
        return json({ url: compUrl, comp, status: comp ? 'ok' : 'no_data', via: page.via || 'page' }, 200, cors);
      }

      // 전체 상품 검색 인덱스 (GET ?index=1) — 야간 프리페치가 만들어 둔 것을 반환.
      if (reqUrl.searchParams.get('index')) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        if (!env.RACK_CACHE) return json({ items: [] }, 200, cors);
        const raw = await env.RACK_CACHE.get('search:index');
        if (!raw) return json({ items: [] }, 200, cors);
        return new Response(raw, { status: 200, headers: { 'Content-Type': 'application/json', ...cors } });
      }

      // 페이지 HTML 프록시 (GET ?html=<url>) — Render(AWS IP)가 막힌 사이트를
      // Cloudflare IP로 한 번 더 시도하는 폴백. IP 대역 기반 차단은 이걸로 뚫리기도 함.
      const htmlUrl = reqUrl.searchParams.get('html');
      if (htmlUrl) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        try {
          const u = new URL(htmlUrl);
          if (!/^https?:$/.test(u.protocol)) return json({ error: 'bad url' }, 400, cors);
          const r = await fetch(u.href, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            redirect: 'follow',
            cf: { cacheTtl: 0 },
          });
          const body = await r.text();
          return json({ ok: r.ok, status: r.status, finalUrl: r.url, body: body.slice(0, 600_000) }, 200, cors);
        } catch (e) {
          return json({ ok: false, status: 0, error: String((e && e.message) || e) }, 200, cors);
        }
      }

      // Shopify 컬렉션 상품 목록 (GET ?collection=<컬렉션URL>&limit=30)
      // 신상품 가져오기(보드에 채워넣기) 기능이 사용. Shopify 공개 JSON이라 봇 차단이 약함.
      const collection = reqUrl.searchParams.get('collection');
      if (collection) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        const limit = Math.min(Math.max(parseInt(reqUrl.searchParams.get('limit') || '30', 10) || 30, 1), 100);
        const res = await fetchShopifyCollection(collection, limit);
        return json({ collection, ...res }, res.ok ? 200 : 502, cors);
      }

      // ── 공유 카탈로그 저장소 (하드차단 사이트용) ─────────────────────
      // 팀원이 쇼핑몰을 볼 때 유저스크립트가 상품 목록을 올려두면(KV 저장),
      // 이후 모두가 미로 앱 실행만으로 즉시 접근합니다. (사이트 재방문 불필요)
      if (reqUrl.searchParams.get('catalogs')) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        if (!env.RACK_CACHE) return json({ error: 'RACK_CACHE KV not configured', list: [] }, 200, cors);
        const ls = await env.RACK_CACHE.list({ prefix: 'catalog:' });
        const list = ls.keys.map(k => ({
          site: k.name.slice('catalog:'.length),
          brand: (k.metadata && k.metadata.brand) || '',
          count: (k.metadata && k.metadata.count) || 0,
          updated: (k.metadata && k.metadata.updated) || 0,
          cats: (k.metadata && k.metadata.cats) || null,
        }));
        return json({ ok: true, list }, 200, cors);
      }
      const catalogSite = reqUrl.searchParams.get('catalog');
      if (catalogSite) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        if (!env.RACK_CACHE) return json({ error: 'RACK_CACHE KV not configured' }, 500, cors);
        const raw = await env.RACK_CACHE.get('catalog:' + catalogSite.toLowerCase());
        if (!raw) return json({ error: 'no catalog for ' + catalogSite }, 404, cors);
        return new Response(raw, { status: 200, headers: { 'Content-Type': 'application/json', ...cors } });
      }

      // 미로 보드 이미지 프록시 (GET ?board=<boardId>&item=<itemId>)
      // 미로는 업로드 이미지의 원본 주소를 Web SDK로 노출하지 않으므로, REST API로 받아옵니다.
      // (서버 시크릿 MIRO_TOKEN 사용 — 토큰은 브라우저로 절대 나가지 않음.)
      const board = reqUrl.searchParams.get('board');
      const item = reqUrl.searchParams.get('item');
      if (board && item) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        return proxyMiroImage(board, item, env, cors);
      }

      const img = reqUrl.searchParams.get('img');
      if (!img) return json({ error: 'use POST to extract, GET ?meta=<url> for og:image, GET ?img=<url> to proxy an image, or GET ?board=&item= for a Miro board image' }, 400, cors);
      if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
      return proxyImage(img, cors, reqUrl.searchParams.get('ref'));
    }

    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);

    // 검색 인덱스 저장 (POST ?store=index) — 야간 프리페치 전용.
    if (reqUrl.searchParams.get('store') === 'index') {
      const tokOk2 = !env.ACCESS_TOKEN ||
        request.headers.get('x-access-token') === env.ACCESS_TOKEN ||
        reqUrl.searchParams.get('token') === env.ACCESS_TOKEN;
      if (!tokOk2) return json({ error: 'unauthorized' }, 401, cors);
      if (!env.RACK_CACHE) return json({ error: 'RACK_CACHE KV not configured' }, 500, cors);
      let body;
      try { body = await request.json(); }
      catch { return json({ error: 'invalid JSON body' }, 400, cors); }
      const items = (Array.isArray(body.items) ? body.items : [])
        .filter(p => p && /^https?:\/\//i.test(p.imageUrl || '') && /^https?:\/\//i.test(p.productUrl || ''))
        .slice(0, 40000)
        .map(p => ({
          name: String(p.name || '').slice(0, 200),
          brand: String(p.brand || '').slice(0, 80),
          category: String(p.category || 'tops').slice(0, 20),
          imageUrl: String(p.imageUrl).slice(0, 1000),
          productUrl: String(p.productUrl).slice(0, 1000),
          price: String(p.price || '').slice(0, 40),
          priceOrig: String(p.priceOrig || '').slice(0, 40),
          comp: String(p.comp || '').slice(0, 160),
        }));
      await env.RACK_CACHE.put('search:index', JSON.stringify({ updated: Date.now(), items }));
      return json({ ok: true, count: items.length }, 200, cors);
    }

    // 혼용률 패치 (POST ?store=comps) — 야간 보강·확장이 {site, comps:{상품URL:혼용률}} 를 보낸다.
    // 카탈로그 본문(items)은 건드리지 않고 comp 만 끼워 넣으므로, 수집과 경합해도
    // 상품이 사라질 일이 없다. KV 쓰기는 브랜드당 1회(무료 한도 1,000/일 안).
    if (reqUrl.searchParams.get('store') === 'comps') {
      const tokOk = !env.ACCESS_TOKEN ||
        request.headers.get('x-access-token') === env.ACCESS_TOKEN ||
        reqUrl.searchParams.get('token') === env.ACCESS_TOKEN;
      if (!tokOk) return json({ error: 'unauthorized' }, 401, cors);
      if (!env.RACK_CACHE) return json({ error: 'RACK_CACHE KV not configured' }, 500, cors);
      let body;
      try { body = await request.json(); }
      catch { return json({ error: 'invalid JSON body' }, 400, cors); }
      const site = String(body.site || '').toLowerCase().replace(/[^a-z0-9.-]/g, '').slice(0, 80);
      const comps = body.comps && typeof body.comps === 'object' ? body.comps : null;
      if (!site || !comps) return json({ error: 'missing site/comps' }, 400, cors);
      const raw = await env.RACK_CACHE.get('catalog:' + site);
      if (!raw) return json({ error: 'no such catalog', site }, 404, cors);
      let rec;
      try { rec = JSON.parse(raw); } catch (e) { return json({ error: 'corrupt catalog' }, 500, cors); }
      let patched = 0;
      for (const p of rec.items || []) {
        const c = comps[p.productUrl];
        if (c && !p.comp) { p.comp = String(c).slice(0, 160); patched++; }
      }
      if (patched) {
        const cats = {};
        for (const p of rec.items || []) cats[p.category] = (cats[p.category] || 0) + 1;
        // updated 는 건드리지 않는다 — 갱신 시각은 "상품이 언제 수집됐나"의 신호라서,
        // 혼용률 보강이 그걸 덮으면 확장 실행 필요 판정이 어긋난다.
        await env.RACK_CACHE.put('catalog:' + site, JSON.stringify(rec), {
          metadata: { brand: rec.brand || '', count: (rec.items || []).length, updated: rec.updated || 0, cats },
        });
      }
      const missing = (rec.items || []).filter(p => !p.comp).length;
      return json({ ok: true, site, patched, missing }, 200, cors);
    }

    // 카탈로그 저장 (POST ?store=catalog) — 유저스크립트가 쇼핑몰 페이지에서 전송.
    // 토큰은 헤더 또는 쿼리 둘 다 허용(유저스크립트 편의).
    if (reqUrl.searchParams.get('store') === 'catalog') {
      const tokOk = !env.ACCESS_TOKEN ||
        request.headers.get('x-access-token') === env.ACCESS_TOKEN ||
        reqUrl.searchParams.get('token') === env.ACCESS_TOKEN;
      if (!tokOk) return json({ error: 'unauthorized' }, 401, cors);
      if (!env.RACK_CACHE)
        return json({ error: 'RACK_CACHE KV not configured — worker/README.md의 KV 설정을 하세요' }, 500, cors);
      let body;
      try { body = await request.json(); }
      catch { return json({ error: 'invalid JSON body' }, 400, cors); }
      const site = String(body.site || '').toLowerCase().replace(/[^a-z0-9.-]/g, '').slice(0, 80);
      if (!site) return json({ error: 'missing site' }, 400, cors);
      const items = (Array.isArray(body.items) ? body.items : [])
        .filter(p => p && /^https?:\/\//i.test(p.imageUrl || '') && /^https?:\/\//i.test(p.productUrl || ''))
        .slice(0, 800)   // 저장 상한(병합 경로의 800과 동일하게 맞춤)
        .map(p => ({
          name: String(p.name || '').slice(0, 200),
          imageUrl: String(p.imageUrl).slice(0, 1000),
          productUrl: String(p.productUrl).slice(0, 1000),
          price: String(p.price || '').slice(0, 40),
          // 할인 상품이면 정가. 없으면 빈 문자열(정가=판매가).
          priceOrig: String(p.priceOrig || '').slice(0, 40),
          category: String(p.category || 'tops').slice(0, 20),
          // src = 이 상품을 어느 카테고리 URL에서 긁었는지. 잘못 잡힌 항목의 출처 추적용.
          src: String(p.src || '').slice(0, 300),
          // comp = 혼용률("Cotton 60% / Modal 40%"). 수집기·야간 보강이 채운다.
          comp: String(p.comp || '').slice(0, 160),
        }));
      if (!items.length) return json({ error: 'no valid items' }, 400, cors);

      // 기본은 "누적(병합)": 이 사이트의 기존 카탈로그에 상품URL 기준 중복 제거하며 합침.
      // (카테고리 페이지를 하나씩 수집하면 브랜드 카탈로그가 채워짐 — Render 브랜드와 동일 경험)
      // ?store=catalog&replace=1 이면 새로 덮어씀(신상 갱신용).
      const replace = reqUrl.searchParams.get('replace') === '1';
      let merged = items;
      {
        let prev = null;
        try { prev = await env.RACK_CACHE.get('catalog:' + site); } catch (e) {}
        let oldItems = [];
        if (prev) { try { oldItems = JSON.parse(prev).items || []; } catch (e) {} }
        // 혼용률은 한 번 뽑으면 바뀌지 않는 값인데, 매일 오는 수집분에는 없다.
        // replace 로 통째로 갈아끼울 때도 같은 상품URL의 기존 comp 는 반드시 승계한다 —
        // 안 그러면 야간 수집이 돌 때마다 보강해 둔 혼용률이 전부 지워진다.
        const oldComp = new Map();
        for (const p of oldItems) if (p && p.comp) oldComp.set(p.productUrl, p.comp);
        for (const p of merged) if (!p.comp && oldComp.has(p.productUrl)) p.comp = oldComp.get(p.productUrl);
        if (!replace && oldItems.length) {
          const seen = new Set(items.map(p => p.productUrl));
          const keptOld = oldItems.filter(p => p && !seen.has(p.productUrl));
          merged = items.concat(keptOld).slice(0, 800);   // 새 항목 우선, 총 800개 상한
        }
      }
      const record = { site, brand: String(body.brand || '').slice(0, 80), updated: Date.now(), items: merged };
      // 카테고리 분포를 메타데이터에 함께 남긴다 — 상태 페이지가 카탈로그 본문을 내려받지 않고도
      // 브랜드별 구성을 보여줄 수 있다. (KV 메타데이터 상한 1KB 이내로 충분히 작다)
      const cats = {};
      for (const p of merged) cats[p.category] = (cats[p.category] || 0) + 1;
      await env.RACK_CACHE.put('catalog:' + site, JSON.stringify(record), {
        metadata: { brand: record.brand, count: merged.length, updated: record.updated, cats },
      });
      // 레거시 정리: 예전 크롬 확장은 호스트만으로 키를 만들어(catalog:freepeople.com) 한 도메인의
      // 두 브랜드를 섞어 저장했다. 이제 <호스트>.<브랜드슬러그>로 저장하는데, 같은 호스트의 옛 키가
      // 남아 있으면 검색이 그쪽(섞인 데이터)에 먼저 걸린다 → 클라이언트가 지정한 옛 키를 함께 삭제.
      const legacy = String(reqUrl.searchParams.get('legacy') || '')
        .toLowerCase().replace(/[^a-z0-9.-]/g, '').slice(0, 80);
      if (legacy && legacy !== site && site.startsWith(legacy + '.')) {
        try { await env.RACK_CACHE.delete('catalog:' + legacy); } catch (e) {}
      }
      return json({ ok: true, site, count: merged.length, added: items.length }, 200, cors);
    }

    if (env.ACCESS_TOKEN && request.headers.get('x-access-token') !== env.ACCESS_TOKEN)
      return json({ error: 'unauthorized' }, 401, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'invalid JSON body' }, 400, cors); }

    const url = ((body && body.url) || '').trim();
    if (!url) return json({ error: 'missing "url"' }, 400, cors);

    // 같은 상품을 다시 스캔하는 일이 잦다(보드를 조금 고치고 또 뽑는다).
    // 상품 페이지 내용은 하루 이틀 사이에 바뀌지 않으므로 결과를 7일 보관한다.
    // 캐시가 맞으면 사이트 접속도 AI 호출도 아예 일어나지 않아 즉시 응답한다.
    const CACHE_MS = 7 * 24 * 3600 * 1000;
    const cacheKey = 'prod:' + url.slice(0, 400);
    const noCache = reqUrl.searchParams.get('nocache') === '1';
    if (!noCache && env.RACK_CACHE) {
      try {
        const hit = await env.RACK_CACHE.get(cacheKey, 'json');
        if (hit && hit.at && Date.now() - hit.at < CACHE_MS && hit.data) {
          return json({ url, ...hit.data, cached: true }, 200, cors);
        }
      } catch (e) {}
    }

    try {
      // 키가 없어도 막지 않는다 — 구조화 데이터만으로 채울 수 있는 항목이 많다.
      // noai=1 은 패널이 AI 한도에 걸린 뒤 보내는 신호. AI 없이 뽑을 수 있는 것만 돌려준다.
      const noAi = reqUrl.searchParams.get('noai') === '1';
      const result = await extractFabric(url, noAi ? '' : (env.GEMINI_API_KEY || ''));
      // 실패는 캐시하지 않는다 — 일시적 차단이면 다음에 성공할 수 있다.
      if (env.RACK_CACHE && result.status !== 'blocked' && result.status !== 'error') {
        try {
          await env.RACK_CACHE.put(cacheKey, JSON.stringify({ at: Date.now(), data: result }),
            { expirationTtl: 8 * 24 * 3600 });
        } catch (e) {}
      }
      return json({ url, ...result }, 200, cors);
    } catch (e) {
      return json(
        { url, product_name: '', image_url: '', composition: [], materials: [], status: 'error', note: String((e && e.message) || e) },
        200, cors,
      );
    }
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

// 남의 도메인 이미지를 서버에서 가져와 CORS 허용 헤더와 함께 반환.
// 이미지 CDN은 흔히 Referer를 검사(핫링크 차단) → 여러 referer 전략을 순서대로 시도:
//  ① ref(상품 사이트, 패널이 전달) → ② referer 없음 → ③ 이미지 도메인의 상위 사이트(www.<base>)
//  → ④ 이미지 origin. 하나라도 이미지가 오면 성공.
async function proxyImage(img, cors, ref) {
  let target;
  try { target = new URL(img); }
  catch { return new Response('bad img url', { status: 400, headers: cors }); }
  if (target.protocol !== 'https:' && target.protocol !== 'http:')
    return new Response('bad scheme', { status: 400, headers: cors });

  // 이미지 호스트의 등록 도메인으로 상위 사이트 referer 추정 (asset-0.aritzia.com → https://www.aritzia.com/)
  const parts = target.hostname.split('.');
  const baseDomain = parts.length >= 2 ? parts.slice(-2).join('.') : target.hostname;
  const guessedSite = 'https://www.' + baseDomain + '/';

  const referers = [];
  if (ref && /^https?:\/\//i.test(ref)) { try { referers.push(new URL(ref).origin + '/'); } catch (e) {} }
  referers.push('');                 // referer 없음
  referers.push(guessedSite);
  referers.push(target.origin + '/');

  let lastStatus = 0;
  const seen = new Set();
  for (const rf of referers) {
    if (seen.has(rf)) continue; seen.add(rf);
    const headers = { 'user-agent': UA, accept: 'image/avif,image/webp,image/*,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' };
    if (rf) headers.referer = rf;
    let r;
    try { r = await fetch(target.toString(), { headers, redirect: 'follow' }); }
    catch (e) { lastStatus = 502; continue; }
    if (!r.ok) { lastStatus = r.status; continue; }
    const ct = r.headers.get('content-type') || 'image/jpeg';
    if (!ct.startsWith('image/')) { lastStatus = 415; continue; }
    const len = Number(r.headers.get('content-length') || 0);
    if (len && len > MAX_IMG_BYTES) return new Response('image too large', { status: 413, headers: cors });
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: { ...cors, 'content-type': ct, 'cache-control': 'public, max-age=86400' },
    });
  }
  return new Response('upstream ' + (lastStatus || 'fail'), { status: 502, headers: cors });
}

// 미로 보드의 이미지(업로드본)를 REST API로 받아와 CORS 허용 헤더와 함께 반환.
//   1) GET /v2/boards/{board}/images/{item}  → data.imageUrl (리소스 주소)
//   2) 그 주소에 format=original&redirect=false → JSON { url }(60초 유효 서명 링크)
//                                              또는 3xx Location 로 직접 이동
//   3) 그 링크의 실제 바이트를 받아 반환
// 호스트는 항상 api.miro.com 로 고정되므로(사용자 입력 host 아님) SSRF 위험이 없습니다.
// 여러 팀 토큰 지원. 토큰 후보 우선순위:
//  ① board→team 캐시로 찾은 그 팀 토큰 → ② 저장된 모든 팀 토큰(mtok:*)
//  → ③ 레거시 개인 토큰(env.MIRO_TOKEN, 있으면). 성공한 토큰의 팀을 캐시해 다음엔 바로 사용.
async function proxyMiroImage(boardId, itemId, env, cors) {
  // 아이템 ID는 숫자, 보드 ID는 영숫자/기호 일부만 허용(안전 문자만).
  if (!/^[\w=-]{1,64}$/.test(String(boardId)) || !/^\d{1,32}$/.test(String(itemId)))
    return new Response('bad board/item id', { status: 400, headers: cors });

  const candidates = await miroTokenCandidates(boardId, env);
  if (!candidates.length)
    return new Response('no MIRO token — 팀에서 앱을 설치(OAuth)했는지 확인하세요', { status: 503, headers: cors });

  let lastStatus = 0;
  for (const cand of candidates) {
    const res = await fetchMiroImage(boardId, itemId, cand.token, cors);
    if (res.ok) {
      // 이 보드는 이 팀 토큰으로 열린다는 것을 기억(다음 썸네일부터 즉시 해당 토큰 사용)
      if (env.RACK_CACHE && cand.team) {
        try { await env.RACK_CACHE.put('b2t:' + boardId, cand.team, { expirationTtl: 60 * 60 * 24 * 30 }); } catch (e) {}
      }
      return res.response;
    }
    if (typeof res.status === 'number') lastStatus = res.status;
  }
  return new Response('miro item ' + (lastStatus || 'fetch failed'), { status: 502, headers: cors });
}

// 이 보드에 쓸 미로 토큰 후보 목록 [{team, token}] (우선순위 순, 중복 제거).
async function miroTokenCandidates(boardId, env) {
  const out = [], seen = new Set();
  const push = (team, token) => { if (token && !seen.has(token)) { seen.add(token); out.push({ team, token }); } };

  if (env.RACK_CACHE) {
    // 1) board→team 캐시(직전에 성공한 팀) 우선
    try {
      const team = await env.RACK_CACHE.get('b2t:' + boardId);
      if (team === 'legacy') push('legacy', env.MIRO_TOKEN);
      else if (team) { const t = await env.RACK_CACHE.get('mtok:' + team); if (t) push(team, t); }
    } catch (e) {}
    // 2) 저장된 모든 팀 토큰
    try {
      const ls = await env.RACK_CACHE.list({ prefix: 'mtok:' });
      for (const k of ls.keys) {
        const team = k.name.slice('mtok:'.length);
        const t = await env.RACK_CACHE.get(k.name);
        push(team, t);
      }
    } catch (e) {}
  }
  // 3) 레거시 개인 토큰(있으면)
  push('legacy', env.MIRO_TOKEN);
  return out;
}

// 주어진 토큰 하나로 미로 보드 이미지를 받아옴. 성공 { ok:true, response } / 실패 { ok:false, status }.
// 호스트는 항상 api.miro.com 로 고정(사용자 입력 host 아님)이라 SSRF 위험이 없습니다.
async function fetchMiroImage(boardId, itemId, token, cors) {
  const auth = { authorization: 'Bearer ' + token };

  // 1) 아이템 메타데이터에서 리소스 주소(imageUrl) 얻기
  let metaResp;
  try {
    metaResp = await fetch(
      `https://api.miro.com/v2/boards/${encodeURIComponent(boardId)}/images/${encodeURIComponent(itemId)}`,
      { headers: { ...auth, accept: 'application/json' } },
    );
  } catch (e) { return { ok: false, status: 'fetch-error' }; }
  if (!metaResp.ok) return { ok: false, status: metaResp.status };

  let meta;
  try { meta = await metaResp.json(); } catch (e) { return { ok: false, status: 'parse' }; }
  const resourceUrl = meta && meta.data && meta.data.imageUrl;
  if (!resourceUrl) return { ok: false, status: 'no-url' };

  // 2) 리소스 주소를 직접 다운로드 가능한 링크로 변환(redirect=false → JSON {url}, 또는 3xx)
  let downloadUrl = '';
  try {
    const u = new URL(resourceUrl);
    u.searchParams.set('format', 'original');
    u.searchParams.set('redirect', 'false');
    const rr = await fetch(u.toString(), { headers: { ...auth, accept: 'application/json' }, redirect: 'manual' });
    if (rr.status >= 300 && rr.status < 400) {
      downloadUrl = rr.headers.get('location') || '';
    } else if (rr.ok) {
      const ct = rr.headers.get('content-type') || '';
      if (ct.includes('json')) {
        const j = await rr.json().catch(() => null);
        if (j && j.url) downloadUrl = j.url;
      } else if (ct.startsWith('image/')) {
        return { ok: true, response: imageResponse(await rr.arrayBuffer(), ct, cors) };
      }
    }
  } catch (e) {}

  // 3) 실제 바이트 받기. 서명 링크는 보통 인증 불필요. 실패 시 리소스 주소를 인증+리다이렉트로 재시도.
  const attempts = [];
  if (downloadUrl) attempts.push({ url: downloadUrl, useAuth: false });
  attempts.push({ url: withParam(resourceUrl, 'format', 'original'), useAuth: true });

  for (const a of attempts) {
    try {
      const ir = await fetch(a.url, {
        headers: a.useAuth ? { ...auth, accept: 'image/*' } : { accept: 'image/*' },
        redirect: 'follow',
      });
      if (!ir.ok) continue;
      const ct = ir.headers.get('content-type') || 'image/jpeg';
      if (!ct.startsWith('image/')) continue;
      const buf = await ir.arrayBuffer();
      if (buf.byteLength > MAX_IMG_BYTES) return { ok: true, response: new Response('image too large', { status: 413, headers: cors }) };
      return { ok: true, response: imageResponse(buf, ct, cors) };
    } catch (e) {}
  }
  return { ok: false, status: 'bytes-failed' };
}

// OAuth 콜백: authorization code → access_token 교환 후 팀별로 KV에 저장.
async function handleOAuthCallback(reqUrl, env) {
  const head = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<style>body{font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;max-width:520px;margin:56px auto;padding:0 22px;color:#1c1c1e}'
    + 'h1{font-size:21px;margin:0 0 12px}.b{background:#f6f6f8;border:1px solid #e6e6ea;border-radius:14px;padding:18px;font-size:14px;line-height:1.7}'
    + '.ok{color:#16794a}.err{color:#b42318}b{font-weight:700}</style>';
  const err = reqUrl.searchParams.get('error');
  const code = reqUrl.searchParams.get('code');
  if (err) return htmlResp(head + `<h1 class="err">설치가 취소되었습니다</h1><div class="b">${escapeHtmlSafe(err)}</div>`, 400);
  if (!code) return htmlResp(head + `<h1 class="err">잘못된 접근</h1><div class="b">인증 코드가 없습니다.</div>`, 400);
  if (!env.CLIENT_ID || !env.CLIENT_SECRET)
    return htmlResp(head + `<h1 class="err">서버 설정 필요</h1><div class="b">CLIENT_ID / CLIENT_SECRET 시크릿이 설정되지 않았습니다.</div>`, 500);

  const redirectUri = reqUrl.origin + '/oauth/callback';
  const tokenUrl = 'https://api.miro.com/v1/oauth/token?grant_type=authorization_code'
    + '&client_id=' + encodeURIComponent(env.CLIENT_ID)
    + '&client_secret=' + encodeURIComponent(env.CLIENT_SECRET)
    + '&code=' + encodeURIComponent(code)
    + '&redirect_uri=' + encodeURIComponent(redirectUri);

  let data;
  try {
    const r = await fetch(tokenUrl, { method: 'POST', headers: { accept: 'application/json' } });
    data = await r.json().catch(() => ({}));
    if (!r.ok || !data.access_token)
      return htmlResp(head + `<h1 class="err">토큰 발급 실패</h1><div class="b">${escapeHtmlSafe(JSON.stringify(data).slice(0, 300))}</div>`, 502);
  } catch (e) {
    return htmlResp(head + `<h1 class="err">토큰 요청 오류</h1><div class="b">${escapeHtmlSafe(String((e && e.message) || e))}</div>`, 502);
  }

  const teamId = String(data.team_id || data.team || '');
  let saved = false;
  if (env.RACK_CACHE && teamId) {
    try { await env.RACK_CACHE.put('mtok:' + teamId, data.access_token); saved = true; } catch (e) {}
  }
  return htmlResp(head
    + `<h1 class="ok">✅ 설치 완료</h1>`
    + `<div class="b">이제 미로 보드를 열고 <b>Board Scanner</b> 앱 아이콘을 눌러 바로 사용하세요.<br>`
    + `보드 이미지 <b>썸네일까지 자동</b>으로 들어갑니다. 이 창은 닫아도 됩니다.`
    + (saved ? '' : `<br><br><span class="err">⚠ 서버에 KV(RACK_CACHE)가 없어 팀 토큰을 저장하지 못했습니다. 관리자에게 문의하세요.</span>`)
    + `</div>`, 200);
}

function htmlResp(html, status) {
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

function escapeHtmlSafe(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function imageResponse(buf, ct, cors) {
  return new Response(buf, {
    status: 200,
    headers: { ...cors, 'content-type': ct, 'cache-control': 'private, max-age=3600' },
  });
}

function withParam(url, k, v) {
  try { const u = new URL(url); u.searchParams.set(k, v); return u.toString(); }
  catch (e) { return url; }
}

async function extractFabric(url, apiKey) {
  // 1) Worker가 직접 페이지를 가져와 텍스트 + 대표이미지(og:image) 추출.
  const page = await fetchPageText(url);
  if (!page.ok) {
    return {
      product_name: '', image_url: '', composition: [], materials: [],
      price: '', price_original: '', color: '', sizes: [],
      status: 'blocked', note: 'fetch ' + page.status,
    };
  }

  // 2) AI 를 부르기 전에 공짜로 얻을 수 있는 것부터 챙긴다.
  //    Shopify JSON(구조화) → schema.org JSON-LD 순. 둘 다 정확한 값이라 AI 추측보다 낫고,
  //    이걸로 다 채워지면 AI 호출 자체를 건너뛰어 무료 한도(429)를 쓰지 않는다.
  const sp0 = page.shopify || {};
  const ld = fromJsonLd(page.html);
  const textComp = (ld.composition && ld.composition.length) ? ld.composition : compFromText(page.text);
  const pre = {
    product_name: ld.product_name || page.title || '',
    price: sp0.price || ld.price || '',
    price_original: sp0.priceOrig || ld.price_original || '',
    color: sp0.color || ld.color || '',
    sizes: (sp0.sizes && sp0.sizes.length ? sp0.sizes : ld.sizes) || [],
    composition: textComp,
    materials: (ld.materials && ld.materials.length) ? ld.materials : textComp.map((c) => c.material),
  };
  // AI 는 "이걸로도 안 되는 것"에만 쓴다. 컬러 하나 때문에 호출하면 무료 한도가
  // 금방 바닥나고, 정작 중요한 혼용률·가격이 있는 상품까지 대기에 걸린다.
  const complete = pre.composition.length && pre.price && pre.sizes.length;
  if (complete || !apiKey) {
    return {
      product_name: pre.product_name,
      image_url: page.ogImage && /^https?:\/\//i.test(page.ogImage) ? page.ogImage : '',
      composition: pre.composition, materials: pre.materials,
      price: pre.price, price_original: pre.price_original,
      color: pre.color, sizes: pre.sizes.slice(0, 30),
      status: pre.composition.length ? 'ok' : 'no_data',
      // 왜 AI 를 안 썼는지 남긴다 — 값이 비었을 때 원인을 찾기 쉽게.
      note: complete ? '' : (apiKey ? '' : 'AI 키 없음 — 구조화 데이터만 사용'),
      via: 'structured',
    };
  }

  // 3) 남은 항목만 일반 텍스트 생성으로 보강. URL 읽기 도구 미사용.
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const userText =
    `Product URL: ${url}\n` +
    `Detected main image (og:image): ${page.ogImage || '(none)'}\n\n` +
    `PAGE TEXT (may be truncated):\n${page.text}\n\n` +
    `Extract the fabric composition and materials as the specified JSON. ` +
    `If the text has no composition info, use status "no_data".`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      generationConfig: { temperature: 0, responseMimeType: 'application/json' },
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Gemini API ${resp.status}: ${t.slice(0, 200)}`);
  }

  const data = await resp.json();
  const cand = (data.candidates && data.candidates[0]) || {};
  const text = (((cand.content && cand.content.parts) || [])
    .map((p) => p.text || '')
    .join('\n')).trim();

  const parsed = parseJson(text);
  if (!parsed) {
    return {
      product_name: pre.product_name, image_url: page.ogImage || '',
      composition: pre.composition, materials: pre.materials,
      price: pre.price, price_original: pre.price_original,
      color: pre.color, sizes: pre.sizes.slice(0, 30),
      status: pre.composition.length ? 'ok' : 'no_data', note: 'no parseable model output',
    };
  }

  const modelImg = (parsed.image_url && /^https?:\/\//i.test(parsed.image_url)) ? parsed.image_url : '';
  return {
    product_name: parsed.product_name || '',
    image_url: modelImg || (page.ogImage && /^https?:\/\//i.test(page.ogImage) ? page.ogImage : ''),
    composition: pre.composition.length ? pre.composition : (Array.isArray(parsed.composition)
      ? parsed.composition
          .filter((c) => c && c.material)
          .map((c) => ({ material: String(c.material), percent: Number(c.percent) }))
          .filter((c) => c.material && !Number.isNaN(c.percent))
      : []),
    materials: pre.materials.length ? pre.materials
      : (Array.isArray(parsed.materials) ? parsed.materials.map(String) : []),
    // 구조화 데이터(Shopify·JSON-LD)가 있으면 그쪽이 정확하다 — AI 추측보다 우선.
    price: (pre.price || String(parsed.price || '')).slice(0, 40),
    price_original: (pre.price_original || String(parsed.price_original || '')).slice(0, 40),
    color: (pre.color || String(parsed.color || '')).slice(0, 80),
    sizes: (pre.sizes.length
      ? pre.sizes
      : Array.isArray(parsed.sizes) ? parsed.sizes.map((s) => String(s).trim()).filter(Boolean) : []
    ).slice(0, 30),
    status: parsed.status || 'ok',
    note: parsed.note || '',
  };
}

// 페이지를 서버에서 가져와 og:image 추출 + HTML을 평문 텍스트로 정리(최대 16k자).
// Shopify 상품은 공개 JSON(/products/<handle>.json)이 봇 차단이 약하고
// 이미지 + 설명(원단 정보 가능)을 담고 있어 HTML보다 훨씬 잘 됩니다. 먼저 시도.
async function fetchShopifyJson(url) {
  let u;
  try { u = new URL(url); } catch (e) { return null; }
  const m = u.pathname.match(/\/products\/([^/?#]+)/i);
  if (!m) return null;
  const jsonUrl = `${u.origin}/products/${m[1]}.json`;

  let r;
  try { r = await fetch(jsonUrl, { headers: { 'user-agent': UA, accept: 'application/json' } }); }
  catch (e) { return null; }
  if (!r.ok) return null;

  let data;
  try { data = await r.json(); } catch (e) { return null; }
  const p = data && data.product;
  if (!p) return null;

  let img = (p.image && p.image.src) ||
            (Array.isArray(p.images) && p.images[0] && p.images[0].src) || '';
  if (img && img.startsWith('//')) img = 'https:' + img;

  const body = String(p.body_html || '')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ').trim();
  // Shopify 는 사이즈·색·가격을 구조화해서 준다. AI가 본문에서 추측하는 것보다 정확하므로
  // 여기서 뽑아 두고, 호출측이 AI 결과보다 우선해서 쓴다.
  const optValues = (want) => {
    const o = (Array.isArray(p.options) ? p.options : [])
      .find((x) => new RegExp(want, 'i').test(String(x && x.name || '')));
    return o && Array.isArray(o.values) ? o.values.map((v) => String(v).trim()).filter(Boolean) : [];
  };
  const sizes = optValues('^(size|사이즈)$').slice(0, 30);
  const color = optValues('^(colou?r|색상|컬러)$').slice(0, 4).join(' / ');
  const vs = Array.isArray(p.variants) ? p.variants : [];
  const num = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : NaN; };
  const now = vs.map((v) => num(v && v.price)).filter(Number.isFinite);
  const was = vs.map((v) => num(v && v.compare_at_price)).filter(Number.isFinite);
  const lowNow = now.length ? Math.min(...now) : NaN;
  const highWas = was.length ? Math.max(...was) : NaN;
  const money = (n) => (Number.isFinite(n) ? String(n) : '');
  // compare_at_price 가 현재가보다 클 때만 할인으로 본다(같거나 작으면 세일이 아니다).
  const onSale = Number.isFinite(lowNow) && Number.isFinite(highWas) && highWas > lowNow;

  let text = `${p.title || ''}. ${body} tags: ${p.tags || ''}`.trim();
  if (text.length > 16000) text = text.slice(0, 16000);

  return {
    ok: true, text, ogImage: /^https?:\/\//i.test(img) ? img : '', title: String(p.title || '').trim(),
    shopify: { sizes, color, price: money(lowNow), priceOrig: onSale ? money(highWas) : '' },
  };
}

// Shopify 컬렉션의 공개 상품 목록(JSON)을 가져와 최신순으로 정리.
// Shopify 상점(대부분의 신생 패션몰이 여기 해당)이면 /collections/<handle>/products.json 이
// 공개돼 있어 로그인/봇 차단 없이 상품명·이미지·링크·등록일을 받을 수 있습니다.
async function fetchShopifyCollection(collectionUrl, limit) {
  let u;
  try { u = new URL(collectionUrl); } catch (e) { return { ok: false, status: 'bad collection url' }; }
  const path = u.pathname.replace(/\/+$/, '');
  const jsonUrl = `${u.origin}${path}/products.json?limit=250`;

  let r;
  try { r = await fetch(jsonUrl, { headers: { 'user-agent': UA, accept: 'application/json' } }); }
  catch (e) { return { ok: false, status: 'fetch error' }; }
  if (!r.ok) return { ok: false, status: String(r.status) };

  let data;
  try { data = await r.json(); } catch (e) { return { ok: false, status: 'parse error' }; }
  const list = Array.isArray(data.products) ? data.products : [];
  if (!list.length) return { ok: false, status: 'no products (Shopify 상점이 아니거나 컬렉션이 비었을 수 있음)' };

  const items = list.map((p) => {
    let img = (p.image && p.image.src) ||
              (Array.isArray(p.images) && p.images[0] && p.images[0].src) || '';
    if (img && img.startsWith('//')) img = 'https:' + img;
    return {
      title: p.title || '',
      url: `${u.origin}/products/${p.handle}`,
      image: img,
      created_at: p.created_at || '',
    };
  }).filter((it) => it.image && it.url);

  items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return { ok: true, items: items.slice(0, limit) };
}

async function fetchPageText(url) {
  // 1) Shopify 상품이면 JSON 우선 (차단 회피 + 원단정보 포함)
  const shop = await fetchShopifyJson(url);
  if (shop && shop.ok) return shop;

  // 2) 아니면 일반 HTML 가져오기
  const headers = { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' };
  // 일시적 차단(껍데기/에러) 대비 1회 재시도.
  let r = null, lastErr = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      r = await fetch(url, { headers, redirect: 'follow' });
      if (r.ok) break;
      lastErr = String(r.status);
      r = null;
    } catch (e) {
      lastErr = 'error:' + ((e && e.message) || e);
      r = null;
    }
    if (attempt === 0) await new Promise(res => setTimeout(res, 1200));
  }
  // 3) 봇 차단(403/429)으로 직접 접근이 막히면 리더 프록시로 한 번 더.
  //    adidas·ae.com처럼 데이터센터 IP를 통째로 막는 사이트는 이 경로로만 본문을 얻을 수 있다.
  if (!r) {
    try {
      const rr = await fetch('https://r.jina.ai/' + url, { headers: { accept: 'text/plain' } });
      if (rr.ok) {
        let md = await rr.text();
        const title = (md.match(/^Title:\s*(.+)$/m) || [, ''])[1].trim().slice(0, 200);
        const img = (md.match(/https?:\/\/[^\s)"']+\.(?:jpe?g|png|webp)(?:\?[^\s)"']*)?/i) || [''])[0];
        md = md.replace(/\s+/g, ' ').trim();
        if (md.length > 16000) md = md.slice(0, 16000);
        return { ok: true, text: md, ogImage: img, title, via: 'reader' };
      }
      lastErr = 'reader ' + rr.status;
    } catch (e) {
      lastErr = 'reader error:' + ((e && e.message) || e);
    }
  }
  if (!r) return { ok: false, status: lastErr || 'fetch failed' };

  const html = await r.text();
  const ogImage = findImage(html, url);
  const title = findTitle(html);

  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length > 16000) text = text.slice(0, 16000);

  return { ok: true, text, ogImage, title, html: html.slice(0, 400000) };
}

// ── 구조화 데이터(JSON-LD Product)에서 먼저 뽑는다 ──────────────────────
// 쇼핑몰 대부분은 검색엔진용으로 schema.org Product 를 심어 둔다. 거기에 가격·색·
// 사이즈·소재가 이미 정확한 값으로 들어 있으므로, AI 를 부르기 전에 이것부터 읽는다.
// AI 호출이 줄면 무료 한도(429)에 걸릴 일도 그만큼 줄고 응답도 빨라진다.
function fromJsonLd(html) {
  const out = { product_name: '', price: '', price_original: '', color: '', sizes: [], materials: [], composition: [] };
  if (!html) return out;
  const blocks = [];
  const rx = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = rx.exec(html)) && blocks.length < 20) {
    try { blocks.push(JSON.parse(m[1].trim())); } catch (e) {}
  }
  // @graph·배열·중첩을 평평하게 펴서 Product 노드를 찾는다.
  const flat = [];
  const walk = (n, d) => {
    if (!n || d > 4) return;
    if (Array.isArray(n)) { n.forEach((x) => walk(x, d + 1)); return; }
    if (typeof n !== 'object') return;
    flat.push(n);
    if (n['@graph']) walk(n['@graph'], d + 1);
  };
  blocks.forEach((b) => walk(b, 0));
  const isType = (n, t) => {
    const v = n && n['@type'];
    return Array.isArray(v) ? v.some((x) => String(x).toLowerCase() === t) : String(v || '').toLowerCase() === t;
  };
  const prod = flat.find((n) => isType(n, 'product'));
  if (!prod) return out;

  out.product_name = String(prod.name || '').trim().slice(0, 200);
  if (prod.color) out.color = String(prod.color).trim().slice(0, 80);

  // 가격: offers 는 단일 객체일 수도, 배열/AggregateOffer 일 수도 있다.
  const offers = [];
  const pushOffer = (o) => {
    if (!o) return;
    if (Array.isArray(o)) { o.forEach(pushOffer); return; }
    if (typeof o !== 'object') return;
    offers.push(o);
    if (o.offers) pushOffer(o.offers);
  };
  pushOffer(prod.offers);
  const cur = (o) => String(o.priceCurrency || (o.priceSpecification && o.priceSpecification.priceCurrency) || '').toUpperCase();
  const amt = (o) => {
    const raw = o.price != null ? o.price
      : (o.lowPrice != null ? o.lowPrice
      : (o.priceSpecification && o.priceSpecification.price));
    const n = Number(String(raw == null ? '' : raw).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : NaN;
  };
  const SYM = { USD: '$', EUR: '\u20ac', GBP: '\u00a3', KRW: '\u20a9', JPY: '\u00a5' };
  const nowVals = offers.map(amt).filter(Number.isFinite);
  if (nowVals.length) {
    const c = cur(offers.find((o) => Number.isFinite(amt(o))) || {});
    const sym = SYM[c] || (c ? c + ' ' : '');
    out.price = sym + String(Math.min(...nowVals));
  }

  // 사이즈: hasVariant / offers 의 size 필드에서 모은다.
  const sizes = new Set();
  const addSize = (v) => { const t = String(v == null ? '' : v).trim(); if (t && t.length <= 20) sizes.add(t); };
  (Array.isArray(prod.hasVariant) ? prod.hasVariant : []).forEach((v) => v && addSize(v.size));
  offers.forEach((o) => { if (o.itemOffered && o.itemOffered.size) addSize(o.itemOffered.size); if (o.size) addSize(o.size); });
  if (prod.size) (Array.isArray(prod.size) ? prod.size : [prod.size]).forEach(addSize);
  out.sizes = [...sizes].slice(0, 30);

  // 소재: material 필드에 "60% Cotton, 40% Modal" 처럼 들어오는 경우가 많다.
  const matRaw = [prod.material, prod.fabricType]
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .filter(Boolean).map((v) => (typeof v === 'object' ? v.name || '' : String(v))).join(', ');
  if (matRaw) {
    const pairs = [...matRaw.matchAll(/(\d{1,3})\s*%\s*([A-Za-z\uAC00-\uD7A3][A-Za-z \uAC00-\uD7A3-]{1,24})|([A-Za-z\uAC00-\uD7A3][A-Za-z \uAC00-\uD7A3-]{1,24})\s*(\d{1,3})\s*%/g)];
    for (const g of pairs) {
      const pct = Number(g[1] || g[4]);
      const name = String(g[2] || g[3] || '').trim();
      if (name && Number.isFinite(pct)) out.composition.push({ material: titleCase(name), percent: pct });
    }
    out.materials = out.composition.length
      ? out.composition.map((c) => c.material)
      : matRaw.split(/[,/]/).map((t) => titleCase(t.trim())).filter(Boolean).slice(0, 8);
  }
  return out;
}

// ── 본문 텍스트에서 혼용률 뽑기 (AI 미사용) ─────────────────────────────
// 혼용률은 구조화 데이터에 잘 안 들어가지만, 본문에는 거의 항상 "60% Cotton" 형태로 적혀 있다.
// 이걸 먼저 읽으면 AI 호출이 크게 줄어 무료 한도 대기가 사라진다.
// "20% OFF", "100% satisfaction" 같은 숫자를 섬유로 오인하지 않도록 섬유명 목록으로 제한한다.
const FIBRES = {
  cotton: 'Cotton', 'organic cotton': 'Cotton', polyester: 'Polyester',
  'recycled polyester': 'Polyester', elastane: 'Elastane', spandex: 'Elastane',
  lycra: 'Elastane', modal: 'Modal', nylon: 'Nylon', polyamide: 'Nylon',
  viscose: 'Viscose', rayon: 'Viscose', wool: 'Wool', 'merino wool': 'Wool', merino: 'Wool',
  silk: 'Silk', linen: 'Linen', flax: 'Linen', cashmere: 'Cashmere', acrylic: 'Acrylic',
  lyocell: 'Lyocell', tencel: 'Lyocell', hemp: 'Hemp', ramie: 'Ramie', jute: 'Jute',
  alpaca: 'Alpaca', mohair: 'Mohair', angora: 'Angora', bamboo: 'Bamboo', cupro: 'Cupro',
  acetate: 'Acetate', triacetate: 'Triacetate', polyurethane: 'Polyurethane', leather: 'Leather',
  // 한국어 표기. 한 글자짜리(면·울)는 '화면'·'서울' 같은 낱말에 걸려 오탐이 나므로 뺀다.
  폴리에스테르: 'Polyester', 나일론: 'Nylon', 스판덱스: 'Elastane', 레이온: 'Viscose',
  모달: 'Modal', 리넨: 'Linen', 실크: 'Silk', 캐시미어: 'Cashmere', 아크릴: 'Acrylic',
  비스코스: 'Viscose', 텐셀: 'Lyocell', 라이오셀: 'Lyocell',
};
const FIBRE_ALT = Object.keys(FIBRES)
  .sort((a, z) => z.length - a.length)
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
// \b 는 한글에 걸리지 않는다(한글은 \w 가 아니라 '폴리에스테르' 앞뒤에 경계가 없다).
// 그래서 경계 대신 "라틴 문자와 붙어 있지 않을 것" 으로 판정한다.
const COMP_RX = new RegExp(
  '(\\d{1,3})\\s*%\\s*(?:of\\s+)?(' + FIBRE_ALT + ')(?![A-Za-z])' +
  '|(?<![A-Za-z])(' + FIBRE_ALT + ')\\s*[::]?\\s*(\\d{1,3})\\s*%', 'gi');

function compFromText(text) {
  const out = [];
  const seen = new Set();
  for (const m of String(text || '').slice(0, 16000).matchAll(COMP_RX)) {
    const pct = Number(m[1] || m[4]);
    const key = String(m[2] || m[3] || '').toLowerCase().trim();
    const material = FIBRES[key];
    if (!material || !Number.isFinite(pct) || pct <= 0 || pct > 100) continue;
    if (seen.has(material)) continue;
    seen.add(material);
    out.push({ material, percent: pct });
    if (out.length >= 8) break;
  }
  // 합이 터무니없으면(겉감·안감이 뒤섞였거나 오탐) 버린다. 100 하나만 있는 것은 정상.
  const total = out.reduce((n, c) => n + c.percent, 0);
  if (!out.length || total > 210) return [];
  return out;
}

function titleCase(s) {
  return String(s).toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()).trim().slice(0, 40);
}

// 페이지 제목: og:title 우선, 없으면 <title>. (상품명 보강용 — 사이트 접속은 Worker가 대신)
function findTitle(html) {
  const pats = [
    /<meta[^>]+(?:property|name)=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:title["']/i,
    /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
    /<title[^>]*>([^<]+)<\/title>/i,
  ];
  for (const re of pats) {
    const m = html.match(re);
    if (m && m[1]) {
      return m[1].replace(/&amp;/gi, '&').replace(/&#0?39;|&apos;/gi, "'").replace(/&quot;/gi, '"')
        .replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
    }
  }
  return '';
}

// 대표 이미지 탐색: 페이지마다 고유한 메타 태그만 사용(og:image / twitter:image / link).
// ⚠️ 느슨한 JSON-LD "image" 매칭은 추천상품·배너 등 "다른 상품 이미지"를 잘못 집으므로 쓰지 않음.
//    (없으면 빈칸으로 두는 게 잘못된 썸네일보다 낫다.)
function findImage(html, base) {
  const pats = [
    /<meta[^>]+(?:property|name)=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
    /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const re of pats) {
    const m = html.match(re);
    if (m && m[1]) {
      let u = m[1].replace(/&amp;/gi, '&');
      if (!/^https?:\/\//i.test(u)) {
        if (u.startsWith('//')) u = 'https:' + u;
        else { try { u = new URL(u, base).toString(); } catch (e) {} }
      }
      if (/^https?:\/\//i.test(u)) return u;
    }
  }
  return '';
}

function parseJson(text) {
  if (!text) return null;
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  try { return JSON.parse(t); } catch { return null; }
}
