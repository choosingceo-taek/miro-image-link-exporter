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
        if (!page.ok) {
          return json({ url: compUrl, comp: '', color: '', sizes: '', price: '', priceOrig: '',
            status: 'blocked', note: String(page.status) }, 200, cors);
        }
        const ld = fromJsonLd(page.html || '');
        const sp = page.shopify || {};
        const fromHtml = compFromHtml(page.html || '');
        // Massimo Dutti 형: 소재가 페이지 JSON(parts/components)에만 있다 — 본문·글에서 못 찾았을 때만.
        const fromText = fromHtml.length ? [] : compFromText(page.text);
        // JSON-LD 의 소재는 옳을 때만 먼저 쓴다(옳지 않으면 본문으로 — Buck Mason).
        const ldOk = ld.composition && ld.composition.length && validComp(ld.composition.map((c) => c.material + ' ' + c.percent + '%').join(' / '));
        const compList = ldOk ? ld.composition
          : (fromHtml.length ? fromHtml : (fromText.length ? fromText : (partsOwnerOk(page.html || '', compUrl) ? compFromPartsJson(page.html || '', compUrl) : [])));
        const comp = compList.map((c) => c.material + ' ' + c.percent + '%').join(' / ');
        const sizes = (sp.sizes && sp.sizes.length ? sp.sizes : (ld.sizes || [])).slice(0, 30).join(', ');
        // 상품 상세(설명·디테일·사진 전부·컬러 전부·코드·통화·재고 사이즈) — 아래 '상품 상세(detail) 추출' 구간.
        // 리더 프록시로 받은 글(page.html 없음)에서는 뽑지 않는다(어느 칸의 글인지 알 수 없다).
        const det = detailOf(page.html || '', compUrl, page.shopifyRaw || null);
        const out = {
          url: compUrl, comp,
          // 우선순위: Shopify 옵션 → JSON-LD → 페이지의 색상 선택 옵션.
          color: sp.color || ld.color || colorFromHtml(page.html || ''),
          sizes: sizes || (det.sizes || []).slice(0, 30).join(', '),
          price: sp.price || ld.price || det.price || '',
          priceOrig: sp.priceOrig || ld.price_original || det.priceOrig || '',
          via: page.via || 'page',
          desc: det.desc || '', feat: det.feat || [], imgs: det.imgs || [], colors: det.colors || [],
          sku: det.sku || '', cur: det.cur || '', sizesIn: det.sizesIn || [],
        };
        out.status = (comp || out.color || out.sizes || out.price || out.desc || out.feat.length) ? 'ok' : 'no_data';
        return json(out, 200, cors);
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
      // 혼용률 오버레이 조회 (GET ?comps=<site>) — 패널·배치가 카탈로그와 합쳐 쓴다.
      const compsSite = reqUrl.searchParams.get('comps');
      if (compsSite) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        if (!env.RACK_CACHE) return json({ map: {} }, 200, cors);
        const raw = await env.RACK_CACHE.get('comp:' + compsSite.toLowerCase());
        return new Response(raw || '{}', { status: 200, headers: { 'Content-Type': 'application/json', ...cors } });
      }

      // 상품 상세 조회 (GET ?details=<site>) — 설명·디테일·사진 전부·컬러 전부·코드·통화·재고 사이즈.
      // 오버레이(comp:<site>)와 따로 둔다: 오버레이는 브랜드를 열 때마다 받는 작은 값이고(혼용률·컬러·가격),
      // 상세는 글·사진 주소가 많아 브랜드당 수 MB 까지 커진다. 엑셀 추출·상세 보기 때만 받는다.
      const detailsSite = reqUrl.searchParams.get('details');
      if (detailsSite) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        if (!env.RACK_CACHE) return json({}, 200, cors);
        const raw = await env.RACK_CACHE.get('detail:' + detailsSite.toLowerCase());
        return new Response(raw || '{}', { status: 200, headers: { 'Content-Type': 'application/json', ...cors } });
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
          color: String(p.color || '').slice(0, 80),
          sizes: String(p.sizes || '').slice(0, 200),
        }));
      try {
        await env.RACK_CACHE.put('search:index', JSON.stringify({ updated: Date.now(), items }));
      } catch (e) {
        return json({ error: 'store=index: ' + String((e && e.message) || e) }, 200, cors);
      }
      return json({ ok: true, count: items.length }, 200, cors);
    }

    // 혼용률 패치 (POST ?store=comps) — 야간 보강·확장이 {site, comps:{상품URL:혼용률}} 를 보낸다.
    // 카탈로그 본문(items)은 건드리지 않고 comp 만 끼워 넣으므로, 수집과 경합해도
    // 상품이 사라질 일이 없다. KV 쓰기는 브랜드당 1회(무료 한도 1,000/일 안).
    // 오버레이 통째 저장 (POST ?store=overlay) — 병합은 클라이언트가 하고,
    // Worker 는 받은 본문을 그대로 KV 에 넣기만 한다.
    //
    // 왜: 무료 플랜은 요청당 CPU 10ms 다. store=comps 는 기존 오버레이를
    // JSON.parse → 항목마다 정규식 정리 → JSON.stringify 를 했는데, 항목이
    // 400개를 넘어가면 이 CPU 한도를 넘겨 put 전에 죽었다. 실측으로 갈렸다 —
    // Vince(340) 저장 성공, Whitestuff(419)·Gestuz(667) 실패.
    // 여기서는 파싱을 아예 하지 않아 크기와 무관하게 안전하다.
    if (reqUrl.searchParams.get('store') === 'overlay') {
      const tokOk = !env.ACCESS_TOKEN ||
        request.headers.get('x-access-token') === env.ACCESS_TOKEN ||
        reqUrl.searchParams.get('token') === env.ACCESS_TOKEN;
      if (!tokOk) return json({ error: 'unauthorized' }, 401, cors);
      if (!env.RACK_CACHE) return json({ error: 'RACK_CACHE KV not configured' }, 500, cors);
      const site = String(reqUrl.searchParams.get('site') || '').toLowerCase()
        .replace(/[^a-z0-9.-]/g, '').slice(0, 80);
      if (!site) return json({ error: 'missing site' }, 400, cors);
      const text = await request.text();
      if (!text || text[0] !== '{') return json({ error: 'body must be a JSON object' }, 400, cors);
      if (text.length > 8 * 1024 * 1024) return json({ error: 'overlay too large' }, 413, cors);
      try {
        await env.RACK_CACHE.put('comp:' + site, text);
      } catch (e) {
        return json({ error: 'store=overlay: ' + String((e && e.message) || e) }, 200, cors);
      }
      return json({ ok: true, site, bytes: text.length }, 200, cors);
    }

    // 상품 상세 통째 저장 (POST ?store=details&site=) — store=overlay 와 같은 방식: 병합은 보내는 쪽(야간 보강·확장)이
    // 하고 Worker 는 파싱 없이 KV 에 넣기만 한다(무료 플랜 CPU 10ms — 큰 JSON 을 파싱하면 저장 전에 죽는다).
    // 키를 오버레이와 나눈 이유: ① 목록·혼용률 화면이 받는 오버레이가 커지지 않는다 ② 혼용률 저장과 상세 저장이
    // 서로의 값을 덮지 않는다. 크기 상한 20MB(KV 값 상한 25MB 아래).
    if (reqUrl.searchParams.get('store') === 'details') {
      const tokOk = !env.ACCESS_TOKEN ||
        request.headers.get('x-access-token') === env.ACCESS_TOKEN ||
        reqUrl.searchParams.get('token') === env.ACCESS_TOKEN;
      if (!tokOk) return json({ error: 'unauthorized' }, 401, cors);
      if (!env.RACK_CACHE) return json({ error: 'RACK_CACHE KV not configured' }, 500, cors);
      const site = String(reqUrl.searchParams.get('site') || '').toLowerCase()
        .replace(/[^a-z0-9.-]/g, '').slice(0, 80);
      if (!site) return json({ error: 'missing site' }, 400, cors);
      const text = await request.text();
      if (!text || text[0] !== '{') return json({ error: 'body must be a JSON object' }, 400, cors);
      if (text.length > 20 * 1024 * 1024) return json({ error: 'details too large' }, 413, cors);
      try {
        await env.RACK_CACHE.put('detail:' + site, text);
      } catch (e) {
        return json({ error: 'store=details: ' + String((e && e.message) || e) }, 200, cors);
      }
      return json({ ok: true, site, bytes: text.length }, 200, cors);
    }

    if (reqUrl.searchParams.get('store') === 'comps') {
      const tokOk = !env.ACCESS_TOKEN ||
        request.headers.get('x-access-token') === env.ACCESS_TOKEN ||
        reqUrl.searchParams.get('token') === env.ACCESS_TOKEN;
      if (!tokOk) return json({ error: 'unauthorized' }, 401, cors);
      if (!env.RACK_CACHE) return json({ error: 'RACK_CACHE KV not configured' }, 500, cors);
      try {
        let body;
        try { body = await request.json(); }
        catch { return json({ error: 'invalid JSON body' }, 400, cors); }
        const site = String(body.site || '').toLowerCase().replace(/[^a-z0-9.-]/g, '').slice(0, 80);
        const comps = body.comps && typeof body.comps === 'object' ? body.comps : null;
        if (!site || !comps) return json({ error: 'missing site/comps' }, 400, cors);
        // 카탈로그 본문에 끼워 넣지 않고 별도 키(comp:<site>)에 쌓는다.
        // 카탈로그(수백 KB)를 매번 파싱·재직렬화하다 무료 플랜 CPU 한도에 걸려
        // 저장 전체가 500 으로 죽었다 — 오버레이는 작아서 그 문제가 없고,
        // 수집기의 카탈로그 저장과 경합하지도 않는다.
        let overlay = {};
        try { overlay = (await env.RACK_CACHE.get('comp:' + site, 'json')) || {}; } catch (e) {}
        const clean = (v, max) => {
          const t = String(v == null ? '' : v).trim().slice(0, max);
          return t === '[object Object]' ? '' : t;
        };
        let patched = 0;
        for (const [url, v] of Object.entries(comps)) {
          const key = String(url).slice(0, 1000);
          const cur = overlay[key] || {};
          const inc = typeof v === 'string' ? { comp: v } : (v || {});
          let n = 0;
          for (const [k, max] of [['comp', 160], ['color', 80], ['sizes', 200], ['price', 40], ['priceOrig', 40]]) {
            const t = clean(inc[k], max);
            if (t && !cur[k]) { cur[k] = t; n++; }
          }
          if (n) { overlay[key] = cur; patched++; }
        }
        // 오버레이 상한: 상품 1000개까지(브랜드 카탈로그 상한 800보다 넉넉하게).
        const keys = Object.keys(overlay);
        if (keys.length > 1000) for (const k of keys.slice(0, keys.length - 1000)) delete overlay[k];
        if (patched) await env.RACK_CACHE.put('comp:' + site, JSON.stringify(overlay));
        return json({ ok: true, site, patched, stored: Object.keys(overlay).length }, 200, cors);
      } catch (e) {
        return json({ error: 'store=comps: ' + String((e && e.message) || e) }, 200, cors);
      }
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
      try {
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
          // comp/color/sizes = 혼용률·컬러웨이·사이즈. 수집기·야간 보강이 채운다.
          comp: String(p.comp || '').slice(0, 160),
          color: String(p.color || '').slice(0, 80),
          sizes: String(p.sizes || '').slice(0, 200),
        }));
      if (!items.length) return json({ error: 'no valid items' }, 400, cors);

      // 기본은 "누적(병합)": 이 사이트의 기존 카탈로그에 상품URL 기준 중복 제거하며 합침.
      // (카테고리 페이지를 하나씩 수집하면 브랜드 카탈로그가 채워짐 — Render 브랜드와 동일 경험)
      // ?store=catalog&replace=1 이면 새로 덮어씀(신상 갱신용).
      // 혼용률·컬러·사이즈는 별도 오버레이(comp:<site>)에 있으므로 여기서 승계할 필요가 없다.
      // (예전에 여기서 옛 카탈로그를 파싱해 승계했더니 CPU 한도로 저장 전체가 죽었다)
      const replace = reqUrl.searchParams.get('replace') === '1';
      let merged = items;
      let guarded = null;   // 수집량이 급감해 갈아끼우기를 막았을 때의 기록
      {
        let prev = null;
        try { prev = await env.RACK_CACHE.get('catalog:' + site); } catch (e) {}
        let oldItems = [];
        if (prev) { try { oldItems = JSON.parse(prev).items || []; } catch (e) {} }
        // replace=1 은 브랜드 카탈로그를 통째로 갈아끼운다. 그런데 그날 카테고리
        // 하나가 차단되면 300개짜리 브랜드가 120개로 줄어든 채 저장되고, 미로 앱
        // 사용자는 그 순간부터 줄어든 목록을 보게 된다 — 비어 보이진 않지만 조용히
        // 축소된다. 수집이 절반 아래로 떨어지면 갈아끼우지 않고 병합으로 돌린다.
        // (품절 상품 정리는 정상적으로 수집된 날 replace 가 알아서 해 준다)
        const shrank = replace && oldItems.length >= 20 && items.length < oldItems.length * 0.5;
        if (shrank) guarded = { kept: oldItems.length, got: items.length };
        if ((!replace || shrank) && oldItems.length) {
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
      return json({ ok: true, site, count: merged.length, added: items.length, guarded }, 200, cors);
      } catch (e) {
        return json({ error: 'store=catalog: ' + String((e && e.message) || e) }, 200, cors);
      }
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
  // 본문 16000자 밖·페이지 JSON 안에 있는 소재까지 본다(compFromHtml).
  const htmlComp = compFromHtml(page.html || '');
  const plainComp = htmlComp.length ? [] : compFromText(page.text);
  const ldOk = ld.composition && ld.composition.length && validComp(ld.composition.map((c) => c.material + ' ' + c.percent + '%').join(' / '));
  const textComp = ldOk ? ld.composition
    : (htmlComp.length ? htmlComp : (plainComp.length ? plainComp : (partsOwnerOk(page.html || '', url) ? compFromPartsJson(page.html || '', url) : [])));
  // 상품 상세(설명·디테일·사진 전부 …) — 응답에 함께 싣는다(AI 와 무관, 구조화 데이터·본문 칸에서).
  const det = detailOf(page.html || '', url, page.shopifyRaw || null);
  const detBits = { desc: det.desc || '', feat: det.feat || [], imgs: det.imgs || [], colors: det.colors || [],
    sku: det.sku || '', cur: det.cur || '', sizesIn: det.sizesIn || [] };
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
      ...detBits,
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
    ...detBits,
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
    shopifyRaw: p,   // 상품 상세 추출(detailOf)이 사진 전부·변형·설명 목록을 읽는다
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
    // 섬유 이름은 낱말 셋까지만 — 하이픈·쉼표에서 끊는다. 예전 규칙(글자·공백·하이픈 24자)은 Buck Mason 의
    // material "100% cotton - With double the fabric density …" 을 "Cotton - With Double The 100%" 로 읽었고,
    // 그 값이 JSON-LD 라는 이유로 본문의 옳은 소재보다 앞서 혼용률이 빈 채로 남았다(2026-11-25 현장 측정).
    const pairs = [...matRaw.matchAll(/(\d{1,3})\s*%\s*([A-Za-z\uAC00-\uD7A3]+(?:[ ][A-Za-z\uAC00-\uD7A3]+){0,2})|([A-Za-z\uAC00-\uD7A3]+(?:[ ][A-Za-z\uAC00-\uD7A3]+){0,2})\s*(\d{1,3})\s*%/g)];
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
  // 목화 품종명이 섬유 이름 자리에 그대로 오는 경우 — Evereve 는 "48% Pima" 로만 적는다.
  pima: 'Cotton', supima: 'Cotton',
  // 상표명이 섬유 이름을 대신하는 경우.
  ecovero: 'Viscose', micromodal: 'Modal', 'micro modal': 'Modal', 'sea cell': 'Lyocell',
  // 금속사 — Oasis 는 "Main: 60% Nylon, 40% Metal", "8% Metallic" 로 적는다. 모르면 겉감 줄이 조각이 되어 안감 줄이 대신 뽑혔다.
  metallic: 'Metallic', 'metallic fibre': 'Metallic', 'metallic fiber': 'Metallic', metal: 'Metallic', lurex: 'Metallic',
  // 2026-11-26 Mint velvet "31% metallised fibre, 69% viscose" · ba&sh "62% VISCOSE / 38% METALLIZED FIBER" — 철자만 다른 금속사.
  'metallised fibre': 'Metallic', 'metallized fibre': 'Metallic', 'metallised fiber': 'Metallic', 'metallized fiber': 'Metallic',
  // 2026-11-26 ba&sh 데님 "92% COTTON / 6% ELASTOMULTIESTER / 2% ELASTANE" — 폴리에스테르계 신축사(EU 섬유 이름 그대로 둔다).
  elastomultiester: 'Elastomultiester',
  // 2026-11-26 Poetry "50% hemp 44% organic cotton 6% yak" — 야크 털을 몰라 합 94% 조각이 되어 통째로 비었다.
  yak: 'Yak',
  // 줄임말 — 2026-11-26 Dickies "77%Poly 20%Rayon 3%Spandex" · "55%CTN 34%POLY 8%NYLON 3%SPAN". 퍼센트 바로 뒤에서만 섬유로
  // 읽힌다(COMP_RX 의 앞 방향은 수식어가 없을 때 이 낱말 자체가 섬유 자리다). 두 글자 줄임말(PA·EL·CO)은 오탐이 커서 넣지 않는다.
  poly: 'Polyester', ctn: 'Cotton', span: 'Elastane',
  // 프랑스어 표기 — 2026-11-26 ba&sh 프랑스어 페이지 "85% LAINE / 14% POLYAMIDE / 1% ELASTHANNE". 'lin'(리넨)은 짧아 오탐이 커서 뺀다.
  laine: 'Wool', coton: 'Cotton', soie: 'Silk', cachemire: 'Cashmere', 'élasthanne': 'Elastane', elasthanne: 'Elastane',
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
// 퍼센트와 섬유 이름 사이에 수식어가 끼는 표기가 흔하다:
//   "100% Peruvian pima cotton"  "90% LENZING™ ECOVERO™ Viscose"  "29% Organically Grown Cotton"
// 반대 방향도 마찬가지다 — "Silk (mulberry) 5%" 처럼 괄호나 낱말이 끼면 놓친다.
// 이걸 놓치면 더 나쁘다: "Cotton 95%, Silk (mulberry) 5%" 에서 실크만 빠져
// "Cotton 95%" 가 되는데, 95% 는 유효 범위라 틀린 값이 그대로 저장된다.
//
// 그룹 번호로 읽으면 규칙을 손볼 때마다 어긋난다(실제로 한 번 어긋났다) — 이름을 붙인다.
const MOD_FWD = "(?<modf>(?:[A-Za-z\u2122\u00ae'\u2019-]{2,20}\\s+){0,4}?)";
const MOD_REV = "(?<modr>(?:\\s*\\([^)]{1,24}\\))?(?:\\s+[A-Za-z\u2122\u00ae'\u2019-]{2,20}){0,2})";
const COMP_RX = new RegExp(
  '(?<pctf>\\d{1,3})\\s*%\\s*(?:of\\s+)?' + MOD_FWD + '(?<fibf>' + FIBRE_ALT + ')(?![A-Za-z])' +
  '|(?<![A-Za-z])(?<fibr>' + FIBRE_ALT + ')' + MOD_REV + '\\s*[::]?\\s*(?<pctr>\\d{1,3})\\s*%', 'gi');
// 수식어 자리에 이런 말이 오면 소재 설명이 아니라 판촉·안내 문구다.
const MOD_BAD_RX = /\b(off|sale|extra|save|discount|up|only|from|code|order|shipping|free|new|all|shop|more|less|min|max|use)\b/i;

// 모든 "퍼센트+섬유" 자리를 앞에서부터 찾는다. 두 가지는 소재가 아니다:
//  · 섬유 이름이 앞에 오고 사이에 낱말이 끼었는데, 그 퍼센트 바로 뒤에 다른 섬유가 오는 경우 — 그 퍼센트는 뒤 섬유의 것이다.
//    2026-11-25 The Great: 창 이름 "Fit Guide dialog Modal spinner Details 100% Cotton" 이 "Modal 100%" 로 읽혔다.
//  · "100% Cotton Shop"·"… Collection" 처럼 기획전·메뉴 이름 — 2026-11-25 Z Supply 는 모든 페이지 메뉴에 이것이 있어
//    진짜 소재("Waffle Thermal: 60% Cotton, 40% Polyester")와 섞여 판단을 못 하거나, 메뉴 값이 그대로 저장됐다.
const PCT_THEN_FIBRE_RX = new RegExp('^\\d{1,3}\\s*%\\s*(?:of\\s+)?(?:[A-Za-z™®\'’-]{2,20}\\s+){0,4}?(?:' + FIBRE_ALT + ')(?![A-Za-z])', 'i');
const NAV_AFTER_RX = /^\s+(?:shop|collection|edit|essentials|capsule|store)\b/i;
// 상표 이름 뒤에 섬유의 일반 이름이 붙은 표기 — 일반 이름이 섬유다. 2026-11-26 Spanx "44% Tencel™ Modal"(텐셀은 상표 — 모달인데
// Lyocell 로 읽혔다) · Poetry "79% TENCEL™ lyocell 21% virgin wool"(뒤의 'lyocell 21%' 를 섬유+퍼센트로 다시 읽어 조각이 됐다) ·
// Athleta "25% LYCRA® Elastane". 상표 뒤의 일반 이름까지 한 항목으로 먹고, 섬유는 일반 이름으로 적는다(m.fibKey).
const BRAND_FIBRE_RX = /^(?:tencel|lycra|ecovero)$/i;
const ABBR_FIBRE_RX = /^(?:poly|ctn|span)$/i;
// 같은 섬유의 다른 이름이 바로 붙은 표기도 한 항목이다 — 2026-11-26 Banana Republic "84% viscose rayon, 15% LENZING™ ECOVERO™
// (viscose rayon), 1% elastane spandex": 'rayon'·'(viscose rayon)'·'spandex' 꼬리 때문에 같은 섬유 둘이 이어지지 못해 통째로 비었다.
const BRAND_TAIL_RX = new RegExp('^\\s*[\u2122\u00ae]?\\s*\\(?\\s*(' + FIBRE_ALT + ')(?![A-Za-z])(?:\\s+(?:' + FIBRE_ALT + ')(?![A-Za-z]))?\\s*\\)?', 'i');
function compMatchAll(src) {
  const rx = new RegExp(COMP_RX.source, 'gi');
  const out = [];
  let m;
  while ((m = rx.exec(src))) {
    const g = m.groups;
    if (g.fibr && /[A-Za-z]/.test(String(g.modr || '').replace(/\([^)]*\)/g, ''))) {
      const pctAt = m.index + m[0].search(/\d{1,3}\s*%\s*$/);
      if (PCT_THEN_FIBRE_RX.test(src.slice(pctAt, pctAt + 120))) { rx.lastIndex = pctAt; continue; }
    }
    if (NAV_AFTER_RX.test(src.slice(m.index + m[0].length, m.index + m[0].length + 20))) continue;
    // 줄임말(poly·ctn·span)은 퍼센트 바로 뒤에 수식어 없이 붙었을 때만 섬유다 — "Wing span 100%"·"100% of the span" 같은 글을 섬유로 읽지 않게.
    if (ABBR_FIBRE_RX.test(String(g.fibr || '').trim()) || (ABBR_FIBRE_RX.test(String(g.fibf || '').trim()) && String(g.modf || '').trim())) continue;
    if (g.fibf) {
      const end = m.index + m[0].length;
      const tail = src.slice(end, end + 40).match(BRAND_TAIL_RX);
      const own = FIBRES[g.fibf.toLowerCase().trim()];
      if (tail && BRAND_FIBRE_RX.test(g.fibf.trim()) && !BRAND_FIBRE_RX.test(tail[1])) { m.fibKey = tail[1]; m.tailEnd = end + tail[0].length; rx.lastIndex = m.tailEnd; }
      else if (tail && FIBRES[tail[1].toLowerCase()] === own && !/\d/.test(tail[0])) { m.tailEnd = end + tail[0].length; rx.lastIndex = m.tailEnd; }
    }
    out.push(m);
  }
  return out;
}
// 이 자리의 섬유 이름(상표 뒤 일반 이름이 있으면 그것)
const fibKeyOf = (m) => String(m.fibKey || m.groups.fibf || m.groups.fibr || '').toLowerCase().trim();
const matchEnd = (m) => m.tailEnd || (m.index + m[0].length);

// 두 원단(겉감/안감 등)으로 볼 수 있는 거리. 두 벌이 이보다 멀리 떨어져 있고 둘 다 부위 이름
// (OUTER SHELL · LINING …)이 붙어 있지 않으면, 한 옷의 두 원단이 아니라 서로 다른 곳에서 온
// 조각이다. 2026-11-24 Zara: 숨은 메뉴의 "PARTYWEAR 100% WOOL | CASHMERE" 와 3,400자 뒤의 진짜
// 소재 "100% cotton" 이 두 줄로 묶여 면 티셔츠가 "Wool 100% / Cotton 100%" 로 읽혔다.
// 어느 쪽이 맞는지 글만으로는 알 수 없으므로 그럴 때는 아무것도 돌려주지 않는다 —
// 틀린 값이 저장되는 것보다 비어 있는 편이 낫다.
const PART_GAP = 300;
const PART_LABEL_RX = /(?<![A-Za-z])(?:outer|shell|lining|lined|main|body|contrast|trim|inner|filling|fill|padding|wadding|insert|pocket|sleeve|collar|cuff|rib|lace|embroidery|겉감|안감|배색|충전재)(?![A-Za-z])[^%]{0,24}$/i;
// 낱말 없이 "100% 섬유" 만 셋 이상 줄줄이 붙은 자리는 한 옷의 소재가 아니라 배지·메뉴·필터 목록이다.
// 2026-11-24 Splendid: 머리 영역에 심긴 개인화 배지 틀 "100% Cotton 100% Cotton 100% Cashmere 100% Cashmere" 가
// 진짜 소재("68% Viscose - From Bamboo, 29% Polyester, 3% Elastane")보다 먼저 잡혀 "Cotton 100% / Cashmere 100%"
// 두 줄로 저장됐다(저장값 344개 중 233개). 한 옷의 두 원단은 부위 이름("Lining:")이 사이에 붙거나 둘뿐이다 —
// 셋 이상이 맨몸으로(구분 기호만 두고) 이어지거나, 같은 섬유가 맨몸으로 바로 되풀이되면("100% Cashmere 100% Cashmere"
// — 배지 하나만 그려진 Splendid 페이지가 원피스·레깅스를 Cashmere 100% 로 남긴 모양, 33개) 목록으로 보고 소재 후보에서
// 뺀다. 서로 다른 둘("100% Silk 100% Polyester")은 겉감·안감일 수 있어 그대로 둔다.
const BARE_GAP_RX = /^[\s|\/,\u00b7\u2022;+&-]{0,6}$/;
function bareRunAt(src) {
  const ms = [];
  for (const m of compMatchAll(String(src || ''))) {
    const g = m.groups;
    const fib = FIBRES[fibKeyOf(m)];
    if (fib) ms.push({ at: m.index, end: matchEnd(m), pct: Number(g.pctf || g.pctr), fib });
  }
  const out = new Set();
  for (let i = 0; i < ms.length;) {
    let j = i;
    if (ms[i].pct === 100) {
      while (j + 1 < ms.length && ms[j + 1].pct === 100 && BARE_GAP_RX.test(src.slice(ms[j].end, ms[j + 1].at))) j++;
    }
    const dup = j > i && ms.slice(i + 1, j + 1).some((x, k) => x.fib === ms[i + k].fib);
    if (j - i + 1 >= 3 || dup) for (let k = i; k <= j; k++) out.add(ms[k].at);
    i = j + 1;
  }
  return out;
}
// 부위 이름 — 겉감(main)이 보이면 장식(trim·rib·주머니 안감 …) 줄은 혼용률이 아니다. 2026-11-25 Boden:
// "Main: 50% recycled polyester, 30% polyester, 20% elastane · Trims: 100% polyester" 에서 겉감이 같은 섬유 두 번
// (재생 폴리 + 폴리)이라 조각으로 끊기고, 온전한 한 벌인 장식 줄 "Polyester 100%" 만 남아 저장됐다.
// 'secondary fabric' · 'tertiary fabric' — 2026-11-26 Vanessa Bruno "Composition : 100% viscose. Secondary fabric 100% cotton. Embroidery 100% polyester"
// (배색 원단 — combo 와 같이 본다).
const PART_MINOR_RX = /(?<![A-Za-z])(?:trims?|trimming|rib(?:bing|bed)?|pocket(?:\s+lining)?|pocketing|contrast|combo|secondary(?:\s+fabric)?|tertiary(?:\s+fabric)?|embroidery|lace|cuffs?|collar|binding|piping|insert|applique|appliqué|패치|배색)(?![A-Za-z])[^%]{0,24}$/i;
const PART_LINING_RX = /(?<![A-Za-z])(?:lining|lined|안감)(?![A-Za-z])[^%]{0,24}$/i;
// 하이픈에 붙은 낱말은 부위 이름이 아니다 — 2026-11-26 Spanx: 깨진 클래스 글 'leading-[var(--body-leading)]"> Bodice:' 의 'body' 를
// 겉감으로 읽어 'Bottom:' 줄을 장식으로 뺐다.
const PART_MAIN_RX = /(?<![A-Za-z-])(?:main|shell|outer|body|self|base\s+fabric|겉감)(?![A-Za-z-])[^%]{0,24}$/i;
function partRole(src, at, end) {
  // 값 뒤 괄호에 부위가 붙는 표기가 먼저다 — Tuckernuck "100% Cotton (outer), 100% Viscose (embroidery), 100% Polyester (lace)"
  // (앞쪽 40자에는 앞 줄의 "(outer)," 가 들어 있어 앞에서 찾으면 틀린다)
  const after = end != null ? (src.slice(end, end + 30).match(/^\s*\(([^)]{2,24})\)/) || [])[1] : '';
  if (after) {
    if (PART_MINOR_RX.test(after)) return 'minor';
    if (PART_LINING_RX.test(after)) return 'lining';
    if (PART_MAIN_RX.test(after)) return 'main';
  }
  const before = src.slice(Math.max(0, at - 40), at);
  if (PART_MINOR_RX.test(before)) return 'minor';
  if (PART_LINING_RX.test(before)) return 'lining';
  if (PART_MAIN_RX.test(before)) return 'main';
  return '';
}
// 소재 제목("Materials & Care" · "Composition:" · "Fabric content") 바로 뒤에 온 줄 — 여러 조성이 섞인 창에서 이 상품의 것.
// 'Fabric & care' 도 소재 제목이다 — 2026-11-26 Gap 계열(Gap·Old Navy·Banana Republic·Athleta)이 이 제목을 쓰고, 같은 창의 추천 카드 이름
// "100% Cotton Track Sweater Pants" 가 둘째 조성으로 잡혀 통째로 비었다.
const COMP_TITLE_RX = /(?:composition|materials?(?:\s*(?:&|and)\s*care)?|fabric(?:\s+content|\s*(?:&|and)\s*care)?|content|소재|혼용률?)\s*[:：]?\s*$/i;
// 같은 섬유가 쉼표·빗금만 사이에 두고 곧바로 다시 나오면(재생 폴리 + 폴리) 한 벌 안의 같은 섬유다 — 더한다.
const SAME_FIBRE_GAP_RX = /^[\s,;\/&+]*(?:and\s+)?$/i;
// 쉼표로 이어진 한 목록 안에 부위 이름이 끼면 거기서 한 벌이 끝난다 — 2026-11-26 Mint Velvet
// "Composition: Main, 41% polyamide, 59% viscose,lining, 3% elastane, 97% polyester": 겉감(100%) 뒤 3% 가 105% 안이라 겉감에
// 붙고, 97% 에서 넘쳐 '합 100% 넘는 목록'으로 통째로 버려졌다. 부위 이름 뒤에 콜론이 오거나(Lining:) 안감·Main N 뒤에 쉼표가 오면 끊는다.
const ITEM_GAP = 120;
const PART_BREAK_RX = /(?<![A-Za-z])(?:(?:lining|main(?:\s*\d+)?|shell|outer(?:\s+shell)?|body|trims?|contrast|pocket(?:ing|\s+lining)?|rib|lace|insert)\s*[:：]|(?:lining|main\s*\d+)\s*,)/i;
function compFromText(text) {
  // 한 옷에 원단이 두 가지인 경우가 있다 — 겉감/안감, 몸판/배색, 색상별 사양.
  //   "Shell: 100% Cotton. Lining: 100% Polyester"
  //   "100% Cotton Jersey, Heather Gray: 90% Cotton/10% Polyester"
  // 한 줄로 더하면 200% 나 110% 가 되어 없는 조성이 되고, 하나만 남기면 나머지
  // 원단을 잃는다. 그래서 한 벌이 100% 에 차면 줄을 바꿔 이어 담는다.
  const src = String(text || '').slice(0, 16000);
  const bare = bareRunAt(src);   // 배지·메뉴 목록(위 bareRunAt 주석)은 건너뛴다
  const groups = [];
  let cur = [], total = 0, seen = new Set(), gStart = 0, gEnd = 0;
  let ovf = false;   // 한 목록이 쉼표·빗금으로 이어지다 100% 를 넘었다(Bellerose '66 / 22 / 2 / 10 / 10' = 110%) — 페이지 표기가 틀렸다
  const flush = () => { if (cur.length) groups.push({ items: cur, start: gStart, end: gEnd, ovf }); cur = []; total = 0; seen = new Set(); ovf = false; };
  for (const m of compMatchAll(src)) {
    if (bare.has(m.index)) continue;
    const g = m.groups;
    const pct = Number(g.pctf || g.pctr);
    const mods = String(g.modf || g.modr || '');
    const key = fibKeyOf(m);
    const material = FIBRES[key];
    if (!material || !Number.isFinite(pct) || pct <= 0 || pct > 100) continue;
    // "20% off cotton tees" 같은 판촉 문구를 소재로 읽지 않는다.
    if (mods && MOD_BAD_RX.test(mods)) continue;
    // 목록 안에 부위 이름(Lining: · ",lining," · ",main 2,")이 끼면 앞 벌을 닫는다(PART_BREAK_RX).
    if (cur.length && PART_BREAK_RX.test(src.slice(gEnd, m.index))) flush();
    // 한 목록의 항목은 붙어 있다 — 120자 넘게 떨어진 퍼센트는 다른 글이다. 2026-11-26 Gap: 설명의 "Made with 14% recycled
    // polyester" 와 몇 문장 뒤 "Fabric & care 86% Cotton, 14% Recycled Polyester" 가 한 벌로 묶였다.
    if (cur.length && m.index - gEnd > ITEM_GAP) flush();
    // 같은 섬유가 곧바로 다시 나오면(재생 폴리 + 폴리) 더한다(SAME_FIBRE_GAP_RX).
    if (cur.length && seen.has(material) && total + pct <= 105 && SAME_FIBRE_GAP_RX.test(src.slice(gEnd, m.index))) {
      cur.find((c) => c.material === material).percent += pct;
      total += pct; gEnd = matchEnd(m);
      continue;
    }
    // 같은 섬유가 다시 나오거나 합이 100 을 넘기려 하면 한 벌이 끝난 것이다.
    if (cur.length && !seen.has(material) && pct < 100 && total + pct > 105 && /^\s*[,\/;+&]\s*$/.test(src.slice(gEnd, m.index))) { ovf = true; flush(); groups[groups.length - 1].ovfNext = true; }
    if (cur.length && (seen.has(material) || total + pct > 105)) flush();
    if (!cur.length) gStart = m.index;
    cur.push({ material, percent: pct });
    gEnd = matchEnd(m);
    total += pct;
    seen.add(material);
    if (cur.length >= 8) flush();
    if (groups.length >= 4) break;   // 그만큼 나오면 여러 상품이 섞인 페이지다
  }
  flush();
  if (!groups.length) return [];
  // 겉감(main) 줄이 있으면 장식(minor) 줄은 뺀다. 겉감이 온전한 한 벌이 아니면 아무것도 돌려주지 않는다 —
  // 장식 줄만 남겨 그것을 상품 소재로 저장하는 것보다 빈 칸이 낫다.
  // 사이트 공통 '원단 안내'(FABRIC GUIDE · glossary) 안의 조성은 이 상품의 것이 아니다(Goldie).
  for (let i = groups.length - 1; i >= 0; i--) if (/(?:fabric|material)s?\s+guide|glossary/i.test(src.slice(Math.max(0, groups[i].start - 120), groups[i].start))) groups.splice(i, 1);
  for (const g of groups) g.role = partRole(src, g.start, g.end);
  if (groups.some((g) => g.role === 'main')) {
    const mains = groups.filter((g) => g.role === 'main');
    const mainWhole = mains.some((g) => { const t = g.items.reduce((n, c) => n + c.percent, 0); return t >= 95 && t <= 105; });
    if (!mainWhole) return [];
    // 부위 이름이 없는 줄도 뺀다 — 설명 글의 "100% Wool 100% Cotton" 처럼 겉감·장식을 이름 없이 늘어놓은 줄이
    // 'Body: 100% wool · Trim: 100% cotton' 보다 앞에 오면 장식이 둘째 줄로 붙었다(Rag & bone Lucy henley).
    for (let i = groups.length - 1; i >= 0; i--) if (groups[i].role !== 'main' && groups[i].role !== 'lining') groups.splice(i, 1);
  } else if (groups.some((g) => g.role === 'minor') && groups.some((g) => g.role !== 'minor' && (() => { const t = g.items.reduce((n, c) => n + c.percent, 0); return t >= 95 && t <= 105; })())) {
    // 겉감이라는 이름은 없어도 이름 없는 온전한 한 벌이 있으면 장식·배색(minor) 줄은 뺀다 —
    // Vanessa Bruno "Composition : 100% viscose. Secondary fabric 100% cotton. Embroidery 100% polyester" 는 세 줄이라 통째로 비었다.
    for (let i = groups.length - 1; i >= 0; i--) if (groups[i].role === 'minor') groups.splice(i, 1);
  }

  const asLine = (g) => g.items.map((c) => c.material + ' ' + c.percent + '%').join(' / ');
  // 온전한 한 벌(합 95~105)만 남긴다. 어중간한 조각은 다른 상품에서 새어 든 것이다.
  // 100% 를 넘긴 목록(ovf)과 그 꼬리 조각은 둘 다 버린다 — 어느 숫자가 틀렸는지 알 수 없다.
  const titledAt = (g) => COMP_TITLE_RX.test(src.slice(Math.max(0, g.start - 30), g.start));
  const ovfTitled = groups.some((g, i) => (g.ovf || (i > 0 && groups[i - 1].ovf)) && titledAt(g));
  for (let i = groups.length - 1; i >= 0; i--) if (groups[i].ovf || (i > 0 && groups[i - 1].ovf)) groups.splice(i, 1);
  // 소재 제목 바로 뒤의 목록이 틀린 표기라 버렸으면, 뒤에 남은 다른 조성(추천 카드 등)으로 대신하지 않는다.
  if (ovfTitled) return [];
  const whole = groups.filter((g) => {
    const t = g.items.reduce((n, c) => n + c.percent, 0);
    return t >= 95 && t <= 105;
  });
  // 다른 줄의 일부를 되풀이한 줄은 뺀다 — 2026-11-26 Everlane "Materials: 97% Organic Cotton 3% Elastane Why It's Better This style is
  // made with 97% organic cotton" 이 'Cotton 97% / Elastane 3% ‖ Cotton 97%' 두 줄이 됐다(97% 하나도 95~105 라 '온전한 한 벌'로 쳤다).
  for (let i = whole.length - 1; i >= 0; i--) {
    const g = whole[i];
    if (whole.some((o) => o !== g && o.items.length > g.items.length && g.items.every((c) => o.items.some((x) => x.material === c.material && x.percent === c.percent)))) whole.splice(i, 1);
  }
  // 같은 줄이 반복되면 한 번만 ("100% Cotton ... 100% Cotton lining").
  const uniq = [];
  const seenLine = new Set();
  for (const g of whole) {
    const k = asLine(g);
    if (seenLine.has(k)) continue;
    seenLine.add(k);
    uniq.push(g);
  }
  // 서로 다른 조성이 셋 이상이면 한 옷의 원단이 아니라 여러 상품이 섞인 것이다 — 단 첫 줄이 소재 제목 바로 뒤이고
  // 다른 줄은 그렇지 않으면 첫 줄이 이 상품의 것이다(Oak + Fort 'Materials & Care 55% Cotton, …' 뒤에 메뉴·추천의 조성).
  const titled = (g) => COMP_TITLE_RX.test(src.slice(Math.max(0, g.start - 30), g.start));
  if (uniq.length >= 2 && titled(uniq[0]) && !uniq.slice(1).some(titled) && uniq[1].start - uniq[0].end > PART_GAP) uniq.splice(1);
  if (!uniq.length || uniq.length > 2) return [];
  // 두 줄이면 한 옷의 두 원단인지 본다 — 가깝거나, 둘 다 부위 이름이 붙어 있어야 한다(PART_GAP 주석).
  if (uniq.length === 2) {
    const near = uniq[1].start - uniq[0].end <= PART_GAP;
    const labelled = (g) => PART_LABEL_RX.test(src.slice(Math.max(0, g.start - 40), g.start));
    if (!near && !(labelled(uniq[0]) && labelled(uniq[1]))) return [];
  }
  // 줄 번호를 달아 돌려준다 — 문자열로 바꿀 때 이 번호로 줄을 나눈다.
  return uniq.flatMap((g, n) => g.items.map((c) => ({ ...c, line: n })));
}


// ── 값이 "쓸 수 있는" 값인지 ────────────────────────────────────────────
// 엑셀 열을 여는 기준(95%)은 "채워졌나"가 아니라 "옳은가"여야 한다. 채움률만
// 세면 '[object Object]' 도, "Cotton 60%" 처럼 절반만 뽑힌 것도 채운 것으로
// 잡혀서, 기준선을 넘겨 놓고 정작 표는 못 쓰는 상태가 된다.
//
// 혼용률이 옳다 = 모든 항목이 "섬유 NN%" 꼴이고, 합이 한 겹(100% 안팎)이거나
// 겉감+안감 두 겹(200% 안팎)이다. 60% 하나만 있으면 나머지를 놓친 것이므로 버린다.
const COMP_ITEM_RX = /^[A-Za-z][A-Za-z ]{1,24} (\d{1,3})%$/;
function validComp(s) {
  const t = String(s || '').trim();
  if (!t || t.includes('[object Object]')) return false;
  // 원단이 두 가지면 줄이 나뉜다("Cotton 100%\nPolyester 100%"). 줄마다 따로 본다.
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
    // 190~210 은 겉감+안감이 한 줄에 담긴 예전 저장분 — 그대로 인정한다.
    const ok = (total >= 95 && total <= 105) || (lines.length === 1 && total >= 190 && total <= 210);
    if (!ok) return false;
  }
  return true;
}
// 컬러가 옳다 = 사람이 읽는 색 이름이다. 안내 문구("Select")·색상코드(#fff)·
// 숫자만 있는 값은 엑셀에 실리면 오히려 헷갈린다.
const COLOR_BAD_RX = /^(?:select|choose|colou?r|색상|컬러|선택|기타|없음|n\/a|none|null|undefined|\d+|#[0-9a-f]{3,8})$/i;
function validColor(s) {
  const t = String(s || '').trim();
  if (!t || t.length > 40 || t.includes('[object Object]')) return false;
  return !COLOR_BAD_RX.test(t);
}

// ── 페이지 HTML 전체에서 혼용률 ────────────────────────────────────────
// compFromText 만 쓰면 두 가지를 놓친다.
//
// ① 앞 16000자만 본다. 상품 페이지는 메뉴·배너가 길어서 소재 설명이 그 뒤로
//    밀리는 일이 흔하다 — 페이지에 버젓이 적혀 있는데 못 읽는다. 그래서 먼저
//    "퍼센트+섬유" 가 처음 나오는 곳을 찾아 그 주변만 잘라서 넘긴다.
//
// ② 스크립트를 통째로 지우고 본다. 요즘 사이트는 소재 설명을 아코디언에 넣고
//    내용은 페이지 JSON(__NEXT_DATA__, Shopify 하이드레이션 등)에만 담아 둔다.
//    본문에서 못 찾았을 때만 스크립트 안을 본다 — 추천 상품 블록에 다른 상품의
//    소재가 섞여 있을 수 있어서, 이 경로는 합이 105%를 넘으면 통째로 버린다.
// 창은 "소재 제목(Composition·Materials·Fabric…)이 바로 앞에 붙은 자리"를 먼저 찾고, 없으면 첫 자리에서
// 연다. 첫 자리가 메뉴·배너의 조각("100% WOOL | CASHMERE")이고 진짜 소재가 4000자 밖에 있으면
// 조각 하나만 창에 들어와 그대로 틀린 값이 된다(2026-11-24 Zara 에서 본 모양).
function compWindow(s) {
  const COMP_HEAD_RX = /(?:composition|materials?|fabric(?:ation)?|content|outer shell|lining|소재|혼용률?)\s*[:：&a-z ]{0,20}$/i;
  const bare = bareRunAt(s);   // 배지·메뉴 목록에서는 창을 열지 않는다(Splendid)
  let first = null, headed = null;
  for (const m of compMatchAll(s)) {
    if (bare.has(m.index)) continue;
    if (!first) first = m;
    // 사이트 공통 '원단 안내'(FABRIC GUIDE · glossary) 칸의 제목은 이 상품의 소재 제목이 아니다 — 2026-11-25 Goldie:
    // 'FABRIC GUIDE … FABRICATION 100% Peruvian pima' 가 상품 글머리표의 '50% cotton, 50% polyester' 를 이겼다.
    if (COMP_HEAD_RX.test(s.slice(Math.max(0, m.index - 40), m.index)) && !/(?:fabric|material)s?\s+guide|glossary/i.test(s.slice(Math.max(0, m.index - 90), m.index))) { headed = m; break; }
  }
  const pick = headed || first;
  if (!pick) return '';
  const at = Math.max(0, pick.index - 200);
  return s.slice(at, at + 4000);
}
function compFromHtml(html) {
  const h = String(html || '');
  if (!h) return [];
  // 메뉴(<nav>)와 <template> 은 상품 본문이 아니다. Zara 의 숨은 메뉴에는 "100% WOOL | CASHMERE"
  // 라는 기획전 이름이 있어, 그게 첫 "퍼센트+섬유"로 잡혀 엉뚱한 울 100% 가 섞였다(2026-11-24).
  const visible = h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<template\b[\s\S]*?<\/template>/gi, ' ')
    // 추천 상품 칸이 따로 만든 태그일 때(<product-recommendations>) — 다른 상품의 소재가 든다.
    .replace(/<([a-z]+-[a-z-]*recommend[a-z-]*)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ');
  const shown = compFromText(compWindow(visible) || visible);
  if (shown.length) return shown;

  let scripts = '';
  for (const m of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    scripts += ' ' + m[1];
    if (scripts.length > 800000) break;
  }
  if (!scripts) return [];
  // JSON 안에서는 \u003c, \", \/ 로 이스케이프돼 있다. 되돌리지 않으면 태그가
  // 안 벗겨지고 "95% Cotton" 이 끊겨 보인다.
  const unesc = scripts
    .replace(/\\u003c/gi, '<').replace(/\\u003e/gi, '>').replace(/\\u0026/gi, '&')
    .replace(/\\"/g, '"').replace(/\\\//g, '/').replace(/\\[nrt]/g, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const win = compWindow(unesc);
  if (!win) return [];
  const out = compFromText(win);
  // 스크립트 경로는 여러 상품이 섞이기 쉽다. 줄이 나뉘어 있으면(원단 두 가지)
  // 그건 한 상품의 표기가 아니라 다른 상품이 섞인 것으로 본다 — 본문과 달리
  // 여기서는 어느 상품의 것인지 확인할 방법이 없다.
  // 단, "Composition: Main, …,main 2, …" 처럼 이 상품의 소재 문자열이 부위 이름과 함께 통째로 있으면 그 두 줄은 한 상품의 것이다 —
  // 2026-11-26 Mint Velvet: 평 fetch 로 받은 HTML 에는 소재가 테마 설정 JSON('"content": " Composition: Main, 52% polyamide, 48% viscose,
  // main 2, 84% lyocell, 16% polyester "')에만 있어 두 줄이라는 이유로 버려졌다(측정 실행 45779388161 표본).
  if (out.some((c) => (c.line || 0) > 0)) return LABELLED_COMP_RX.test(win) ? out : [];
  const total = out.reduce((n, c) => n + c.percent, 0);
  return total > 105 ? [] : out;   // 여러 상품이 섞였을 가능성 — 버린다
}
// ── 페이지 JSON(parts/components) 소재가 이 상품의 것인가 ───────────────────
// Massimo Dutti 형 페이지는 색상마다 상품 객체가 있고, 객체마다 "reference":"C<상품번호><색상>-…" 가 먼저 오고 그 뒤에
// "compositionDetail":{"parts":[…]} 가 온다. 주소의 상품번호(…-l06863575)와 '바로 앞 reference' 가 다른 블록만 있으면
// (추천·다른 상품의 JSON) 그 소재는 이 상품의 것이 아니다 — 쓰지 않는다. 주소에 상품번호가 없거나 reference 를 못 찾으면
// 예전처럼 둔다(compFromPartsJson 이 고른다). 2026-11-26 실측: 읽힌 9쪽(측정 45794717936)의 블록은 모두 그 쪽 상품번호의 것이었다.
function partsOwnerOk(html, url) {
  const id = (String(url || '').match(/[lp](\d{7,9})(?:[?#./]|$)/i) || [])[1];
  if (!id) return true;
  const h = String(html || '').replace(/\\"/g, '"');
  let own = false, other = false;
  for (const m of h.matchAll(/"parts"\s*:\s*\[/g)) {
    const before = h.slice(Math.max(0, m.index - 60000), m.index);
    let last = '';
    for (const r of before.matchAll(/"reference"\s*:\s*"C(\d{7,9})/g)) last = r[1];
    if (!last) continue;
    if (last.startsWith(id) || id.startsWith(last)) own = true; else other = true;
  }
  return own || !other;
}
const LABELLED_COMP_RX = /composition\s*[:：]\s*(?:main|shell|outer(?:\s+shell)?|body)\s*[,:：]/i;

// ── 컬러웨이: 상품 페이지의 "색상 선택 옵션"에서 읽는다 ─────────────────
// 색은 상품명에 없는 경우가 많고("한정판: Olive Tree", "코어"), 사전에 없는
// 고유 이름이 흔하다. 그래서 색상 단어를 추측하지 않고 옵션 표기를 그대로 가져온다.
// 사이트마다 마크업이 달라 흔한 형태를 순서대로 훑고, 못 찾으면 빈 값을 준다.
const COLOR_JUNK = /^(?:select|choose|color|colour|색상|컬러|선택|기타|\d+|#[0-9a-f]{3,8}|[\s:：·,\/-]+)$/i;
function cleanColor(v) {
  const t = String(v || '')
    .replace(/&amp;/gi, '&').replace(/&#0?39;|&apos;/gi, "'").replace(/&quot;/gi, '"')
    .replace(/^\s*(?:색상|컬러|colou?r)\s*[::]\s*/i, '')     // "Color: Olive" → "Olive"
    .replace(/^\s*한정판\s*[::]\s*/, '')                      // "한정판: Olive Tree" → "Olive Tree"
    .replace(/\s*\(전체 보기\)\s*$/, '')
    .replace(/\s+/g, ' ').trim();
  if (!t || t.length > 40 || COLOR_JUNK.test(t)) return '';
  return t;
}
function colorFromHtml(html) {
  const h = String(html || '');
  if (!h) return '';
  const pats = [
    // 페이지에 심어 둔 JSON — 가장 신뢰도가 높다.
    /"selected(?:Color|Colour)"\s*:\s*"([^"]{1,40})"/i,
    // 영국식 철자(colour)와 이름 변형까지 — Mint velvet·Whitestuff 같은 영국 사이트가 colour 를 쓴다.
    /"colou?r(?:Name|_name|Description|Label|DisplayName|Display)"\s*:\s*"([^"]{1,40})"/i,
    /"swatch(?:Name|Label)"\s*:\s*"([^"]{1,40})"/i,
    /<meta[^>]+(?:property|name)="(?:product|og):colou?r"[^>]+content="([^"]{1,40})"/i,
    /"colou?r"\s*:\s*"([^"]{1,40})"/i,
    // 선택된 스와치의 접근성 라벨
    /aria-label="\s*(?:색상|컬러|colou?r)\s*[::]?\s*([^"]{1,40})"/i,
    /data-(?:color|colour|color-name)="([^"]{1,40})"/i,
    // 선택 상자의 선택된 항목
    /<option[^>]+selected[^>]*>([^<]{1,40})<\/option>/i,
    // 화면 글자 "Colour: Navy" / <span>Color:</span><span>Navy</span>
    />\s*(?:colou?r|색상)\s*[:：]\s*([A-Za-z][A-Za-z' &\/-]{1,30}?)\s*</i,
    />\s*(?:colou?r|색상)\s*[:：]\s*<\/[a-z]+>\s*(?:<[^>]+>\s*){0,3}([A-Za-z][A-Za-z' &\/-]{1,30}?)\s*</i,
  ];
  for (const re of pats) {
    const m = h.match(re);
    if (m) { const c = cleanColor(m[1]); if (c) return c; }
  }
  // 색상 선택 영역(select/fieldset)의 첫 옵션 — 위 방법이 다 실패했을 때만.
  const box = h.match(/<(select|fieldset)[^>]*(?:name|id|class|data-option-name)="[^"]*(?:colou?r|색상|컬러)[^"]*"[\s\S]{0,4000}?<\/\1>/i);
  if (box) {
    for (const m of box[0].matchAll(/<option[^>]*>([^<]{1,40})<\/option>|aria-label="([^"]{1,40})"/gi)) {
      const c = cleanColor(m[1] || m[2]);
      if (c) return c;
    }
  }
  return '';
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

// ── 상품 상세(detail) 추출 시작 — enrich-comp.mjs·enrich-comp-browser.mjs·field-measure.mjs 가 이 구간을 떼어 쓰고,
//    chrome-extension/background.js 에 글자 그대로 복사돼 있다(scripts/test-detail.mjs 가 비교한다).
//
// 무엇을 뽑나(혼용률·컬러 말고 '나머지 상품 정보'):
//   desc    설명 문단(평문)            feat   디테일 글머리표(핏·기장·넥라인·여밈·주머니·관리법 …)
//   imgs    상품 사진 전부(갤러리)     colors 이 상품이 나오는 컬러 전부
//   sku     상품 코드                  cur    통화(USD·GBP …)
//   sizes   사이즈 전부                sizesIn 재고 있는 사이즈(사이트가 알려 줄 때만)
//   price / priceOrig / color / name   더 나은 출처가 있을 때 기존 값을 보강
// 출처 순서: Shopify 공개 JSON → JSON-LD(Product·ProductGroup) → 메타 태그 → 제목이 붙은 본문 칸(Details·Description·
// Features·Fit·Fabric & Care …). 어디서 왔는지는 src 에 남긴다(현장 지도 docs/field-map.md 의 근거).
//
// 지키는 것(이 저장소에서 실제로 틀렸던 자리):
//   · 메뉴(<nav>)·<template>·머리/꼬리(사이트 공통)·추천 상품("you may also like")·리뷰 칸의 글은 다른 상품의 것 — 지우고 본다.
//   · 사이트에 적힌 글 그대로. 공백만 다듬고 길이만 자른다(번역·고쳐 쓰기 없음).
//   · 길이 상한(DETAIL_CAP): 설명 1,500자 · 글머리표 25개 × 220자 · 사진 20장 · 컬러 30개 · 사이즈 40개 · 코드 60자.
// 이 구간은 다른 함수에 기대지 않는다(확장에 그대로 복사하기 위해서). titleCase 만 예외 — 확장에도 같은 이름이 있다.
const DETAIL_CAP = { desc: 1500, feat: 25, featLen: 220, imgs: 20, colors: 30, sizes: 40, sku: 60 };

// HTML 조각 → 사람이 읽는 평문(줄 구분은 \n 하나).
function dtText(s) {
  return String(s == null ? '' : s)
    // JSON-LD 설명에 HTML 이 엔티티로 든 경우("&lt;p&gt;…") — 태그로 되돌려 아래에서 함께 벗긴다(Whitestuff).
    .replace(/&lt;(\/?[a-z][a-z0-9]*\b[^&<>]{0,200}?)&gt;/gi, '<$1>')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(?:p|li|div|h[1-6]|dd|dt|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/&quot;|&#34;/gi, '"').replace(/&#0?39;|&apos;|&rsquo;|&lsquo;|&#821[67];/gi, "'")
    .replace(/&ldquo;|&rdquo;|&#822[01];/gi, '"').replace(/&ndash;|&#8211;/gi, '–').replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&bull;|&#8226;/gi, '•').replace(/&trade;/gi, '™').replace(/&reg;/gi, '®').replace(/&deg;/gi, '°')
    .replace(/&eacute;/gi, 'é').replace(/&egrave;/gi, 'è')
    .replace(/&#(\d{2,5});/g, (m, n) => { const c = Number(n); return c > 31 && c < 65536 ? String.fromCharCode(c) : ' '; })
    .replace(/&#x([0-9a-f]{2,4});/gi, (m, n) => { const c = parseInt(n, 16); return c > 31 ? String.fromCharCode(c) : ' '; })
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&')
    .replace(/[ \t\r\f\v ​]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
}
const dtClip = (s, n) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t; };
const dtUniq = (arr) => { const seen = new Set(); const out = []; for (const x of arr) { const k = String(x).toLowerCase(); if (x && !seen.has(k)) { seen.add(k); out.push(x); } } return out; };

// 한 요소(여는 태그부터 짝이 맞는 닫는 태그까지)를 통째로 지운다. 같은 이름의 태그 깊이를 센다.
// test(tag, attrs) 가 참인 요소만. 짝을 못 찾으면 지우지 않고 지나간다.
const DT_VOID = /^(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/;
function dtCut(h, test) {
  let out = '', from = 0;
  const open = /<([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g;
  let m;
  while ((m = open.exec(h))) {
    const tag = m[1].toLowerCase();
    if (DT_VOID.test(tag) || /\/\s*$/.test(m[2]) || !test(tag, m[2])) continue;
    const rx = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi');
    rx.lastIndex = m.index + m[0].length;
    let depth = 1, k, end = -1;
    while ((k = rx.exec(h))) {
      if (k[1]) { if (--depth === 0) { end = k.index + k[0].length; break; } } else if (!/\/\s*>$/.test(k[0])) depth++;
    }
    if (end < 0) continue;
    out += h.slice(from, m.index) + ' ';
    from = end;
    open.lastIndex = end;
  }
  return out + h.slice(from);
}
// 다른 상품·사이트 공통의 글이 든 칸. class·id 에 이런 말이 있으면 지운다.
const DT_NOISE_RX = /recommend|related|also[-_ ]?(?:like|love|bought|viewed)|you[-_ ]?may|may[-_ ]?also|upsell|up-sell|cross[-_ ]?sell|recently[-_ ]?viewed|complete[-_ ]?(?:the|your)[-_ ]?look|shop[-_ ]?the[-_ ]?look|wear[-_ ]?it[-_ ]?with|style[-_ ]?it[-_ ]?with|pairs?[-_ ]?(?:well[-_ ]?)?with|mega[-_ ]?menu|menu[-_ ]?drawer|header[-_ ]?(?:menu|drawer|nav)|site[-_ ]?nav|newsletter|cookie|consent|mini[-_ ]?cart|minicart|cart[-_ ]?drawer|breadcrumb|size[-_ ]?(?:guide|chart)|review|rating|bazaarvoice|yotpo|okendo|klarna|afterpay|loyalty|promo[-_ ]?bar|announcement|search[-_ ]?(?:form|bar|overlay)|skip[-_ ]?link/i;
const DT_ATTR_RX = /\b(?:class|id|aria-label|data-section-type|data-component)\s*=\s*["']([^"']*)["']/gi;
function dtAttrs(a) { let s = ''; for (const m of String(a).matchAll(DT_ATTR_RX)) s += ' ' + m[1]; return s; }
// 본문만 남긴 HTML. 스크립트·스타일·메뉴·<template>·사이트 머리/꼬리·추천 칸을 걷어 낸다.
function dtBody(html) {
  let h = String(html || '').slice(0, 1500000)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|template|iframe|select)\b[\s\S]*?<\/\1>/gi, ' ');
  h = dtCut(h, (tag, a) => {
    const at = dtAttrs(a);
    if (tag === 'nav') return true;
    if (tag === 'aside' || tag === 'dialog') return !/product|pdp/i.test(at);
    // 머리·꼬리는 사이트 공통 칸일 때만(상품 칸 머리 <header class="product__header"> 는 남긴다)
    if (tag === 'header' || tag === 'footer') return !/product|pdp|item|accordion|tab/i.test(at);
    return !!at && DT_NOISE_RX.test(at) && !/\b(?:product|pdp)[-_]?(?:details?|description|info|accordion|tabs?)\b/i.test(at);
  });
  return h;
}

// 칸 제목 — 이 제목이 붙은 칸의 글을 상품 디테일로 본다.
// 이음말: "Fabric & Care" · "Fabric and Care" · "SIZE + FIT" · "Fit/Size"
const DT_DESC_HEAD = /^(?:product\s+)?(?:description|overview|about\s+(?:this|the)\s+(?:product|style|item|piece)|editor'?s?\s+notes?|the\s+story|design\s+notes?|description\s*(?:&|and|\+|\/)\s*details?)$/i;
const DT_FEAT_HEAD = /^(?:(?:product|style|design|more|the|key|garment)\s+)?(?:details?|features?|highlights?|specifications?|specs|characteristics)$|^(?:details?\s*(?:&|and|\+|\/)\s*(?:care|fit|fabric|composition)|fit|the\s+fit|fit\s*(?:&|and|\+|\/)\s*(?:size|sizing|measurements?|details?|style)|size\s*(?:&|and|\+|\/)\s*fit|sizing|(?:fabric|fabrics|materials?|composition|content)\s*(?:&|and|\+|\/)\s*(?:care|fit)|care|care\s+(?:instructions|guide)|fabric(?:\s+details)?|materials?|composition)$/i;
// 이음말로 이은 칸 제목("Fabric & care details" · "Style & Fit + Measurements +" · "Fabric & Details") — 디테일 칸이다.
const DT_HEADISH_RX = /^(?:[a-z ]{0,30}(?:&|\+|\band\b)\s*)?(?:fabric|care|details?|fit|measurements?|size|style|materials?|composition)(?:\s*(?:&|\+|\band\b)\s*[a-z ]{0,20})?(?:\s+details)?\s*\+?$/i;
function dtHeadKind(t) {
  const s = String(t || '').replace(/[+\-–—:>›▾▸∨⌄˅]+\s*$/, '').replace(/\s+/g, ' ').trim();
  if (!s || s.length > 40) return '';
  if (DT_DESC_HEAD.test(s)) return 'desc';
  if (DT_FEAT_HEAD.test(s)) return 'feat';
  if (/[&+]|\band\b/i.test(s) && DT_HEADISH_RX.test(s)) return 'feat';
  return '';
}
// 사이트 공통 안내(배송·반품·사이즈 안내·결제)는 상품 디테일이 아니다 — 글머리표에서 뺀다.
// 값이 붙은 가격("$48")·판매 문구·공유 단추·태그 조각도 상품 디테일이 아니다(추천 칸이 새어 든 모양 — 11/25 현장 측정).
const DT_JUNK_RX = /\b(?:free\s+(?:shipping|returns?|delivery)|shipping|delivery|returns?(?:\s+(?:policy|within)|\s+\d+\s+days)|exchanges?|klarna|afterpay|interest-free|gift\s*card|sign\s+(?:in|up)|log\s*in|add\s+to\s+(?:bag|cart)|size\s+guide|find\s+(?:in|your)\s+(?:store|size)|write\s+a\s+review|newsletter|promo\s+code|subscribe|select\s+(?:a\s+)?size|notify\s+me|out\s+of\s+stock|pair\s+it\s+with|shop\s+(?:the\s+look|women|men|now|all)|wishlist|instagram|facebook|pinterest|tiktok|learn\s+more|contact\s+us|have\s+a\s+question|close\s+dialog|opens\s+in\s+a\s+new\s+window|choosing\s+a\s+selection|use\s+code|\d+%\s+off|sale|qty|in-store\s+availability|check\s+(?:in-store|availability|stock)|orders?\s+placed|can\s+be\s+returned|returned\s+until)\b|[$£€]\s?\d|<\/?[a-z]+[\s>]|="/i;
// 사이즈 단추·숫자만 있는 줄("10" · "XL" · "XXS XS S M L")
const DT_SIZE_LINE_RX = /^(?:(?:\d{1,3}|x{0,3}[sml]|xxs|one\s+size|os|petite|tall)(?:\s+|$))+$/i;

// 제목 바로 뒤의 내용 — 제목의 부모 칸이 닫히는 곳에서 멈춘다(아코디언 한 칸 · 제목+목록 한 덩어리).
// 다음 제목·6,000자에서도 멈춘다. 부모 칸이 비어 있으면(제목만 따로 감싼 구조) 한 겹 더, 최대 세 겹까지 넓힌다.
// 칸 경계를 지키지 않으면 칸 뒤에 이어진 추천 상품·사이즈 단추·판촉 문구까지 글머리표로 들어온다(11/25 측정).
function dtChunk(body, from, stopAt) {
  const rx = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
  for (const lim of [1, 2, 3]) {
    rx.lastIndex = from;
    let depth = 0, end = Math.min(stopAt, from + 6000), m;
    while ((m = rx.exec(body)) && m.index < end) {
      const tag = m[2].toLowerCase();
      if (DT_VOID.test(tag) || /\/\s*>$/.test(m[0])) continue;
      if (m[1]) { if (--depth <= -lim) { end = m.index; break; } } else depth++;
    }
    const chunk = body.slice(from, end);
    if (dtText(chunk).length >= 3) return chunk;
  }
  return '';
}
// 공유·추적·배송 방법 단추 이름.
const DT_BTN_RX = /^(?:[^.]{2,40}\s\+|share|traceability|nominated\s+day|collect\s+from\s+store|click\s*(?:&|and)\s*collect)$/i;
const dtJunk = (t) => DT_JUNK_RX.test(t) || DT_SIZE_LINE_RX.test(t) || DT_BTN_RX.test(String(t).trim()) || !!dtHeadKind(t);

// 제목이 붙은 본문 칸을 찾아 설명 문단·글머리표를 모은다.
function dtSections(body) {
  const heads = [];
  const rx = /<(button|summary|h[1-6]|dt|span|div|p|label|li|strong|b)\b([^>]*)>([\s\S]{1,300}?)<\/\1>/gi;
  let m;
  while ((m = rx.exec(body))) {
    // "Composition: …" 처럼 쌍점으로 끝나는 굵은 글·span 은 칸 제목이 아니라 한 줄 안의 이름표다(Mint Velvet: <li><strong>Composition: </strong>…).
    const ht = dtText(m[3]);
    const kind = (/^(?:strong|b|span|label)$/i.test(m[1]) && /[:：]\s*$/.test(ht)) ? "" : dtHeadKind(ht);
    if (kind) { heads.push({ kind, at: m.index, end: m.index + m[0].length }); rx.lastIndex = m.index + m[0].length; }
    else rx.lastIndex = m.index + 1 + m[1].length;
  }
  const desc = [], feat = [], kinds = new Set();
  for (let i = 0; i < heads.length; i++) {
    const h = heads[i];
    const chunk = dtChunk(body, h.end, i + 1 < heads.length ? heads[i + 1].at : body.length);
    // 단추·링크 하나만 든 줄("Check in-store availability")은 상품 디테일이 아니다.
    const lis = [...chunk.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].filter((x) => !/^\s*<(button|a)\b[\s\S]*<\/\1>\s*$/i.test(x[1])).map((x) => dtText(x[1]).replace(/\n/g, ' ').replace(/^[•·\-*\s]+/, '').trim())
      .filter((t) => t.length >= 2 && t.length <= 400 && !dtJunk(t));
    let got = 0;
    if (lis.length) { feat.push(...lis); got += lis.length; }
    const rest = dtText(chunk.replace(/<(ul|ol)\b[\s\S]*?<\/\1>/gi, ' '));
    const lines = rest.split('\n').map((x) => x.replace(/^[•·\-*\s]+/, '').trim()).filter((t) => t.length >= 2 && !dtJunk(t));
    if (h.kind === 'desc') {
      const para = lines.filter((t) => t.length >= 25);
      if (para.length) { desc.push(para.join('\n')); got++; }
      if (!lis.length) { const short = lines.filter((t) => t.length < 25 && t.length >= 3); if (short.length >= 2) { feat.push(...short); got += short.length; } }
    } else if (!lis.length) {
      // 글머리표 없이 줄로만 적은 칸("Relaxed fit<br>Hits at hip")은 줄이 글머리표다.
      const ls = lines.filter((t) => t.length <= 220);
      if (ls.length) { feat.push(...ls); got += ls.length; }
    }
    if (got) kinds.add(h.kind);
  }
  return { desc, feat, kinds: [...kinds] };
}

// JSON-LD 의 Product·ProductGroup 노드(중첩·@graph 까지 편다).
function dtLdNodes(html) {
  const flat = [];
  const walk = (n, d) => {
    if (!n || d > 6) return;
    if (Array.isArray(n)) { n.forEach((x) => walk(x, d + 1)); return; }
    if (typeof n !== 'object') return;
    flat.push(n);
    if (n['@graph']) walk(n['@graph'], d + 1);
    if (n.mainEntity) walk(n.mainEntity, d + 1);
  };
  const rx = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m, n = 0;
  while ((m = rx.exec(String(html || ''))) && n++ < 30) {
    const raw = m[1].trim().replace(/^<!\[CDATA\[|\]\]>$/g, '');
    try { walk(JSON.parse(raw), 0); } catch (e) {
      // 줄바꿈이 문자열 안에 그대로 든 JSON-LD(흔하다) — 공백으로 바꿔 한 번 더.
      try { walk(JSON.parse(raw.replace(/[\r\n\t]+/g, ' ')), 0); } catch (e2) {}
    }
  }
  const isT = (x, t) => { const v = x && x['@type']; return (Array.isArray(v) ? v : [v]).some((y) => String(y || '').toLowerCase() === t); };
  return { group: flat.find((x) => isT(x, 'productgroup')) || null, prod: flat.find((x) => isT(x, 'product')) || null, all: flat.filter((x) => isT(x, 'product')) };
}
const DT_SYM = { USD: '$', EUR: '€', GBP: '£', KRW: '₩', JPY: '¥', AUD: 'A$', CAD: 'C$' };
const dtNum = (v) => { const n = Number(String(v == null ? '' : v).replace(/,/g, '').replace(/[^\d.]/g, '')); return Number.isFinite(n) && n > 0 ? n : NaN; };
const dtMoney = (n, cur) => (Number.isFinite(n) ? (DT_SYM[cur] || (cur ? cur + ' ' : '$')) + String(Math.round(n * 100) / 100) : '');
function dtImg(v, base) {
  let u = typeof v === 'string' ? v : (v && (v.url || v.contentUrl || v.src)) || '';
  u = String(u).trim().replace(/&amp;/g, '&');
  if (!u) return '';
  if (u.startsWith('//')) u = 'https:' + u;
  else if (!/^https?:\/\//i.test(u)) { try { u = new URL(u, base).href; } catch (e) { return ''; } }
  // 견본 조각(swatch)·로고·아이콘·자리표시는 상품 사진이 아니다.
  if (/\.svg(?:\?|$)|swatch|logo|icon|placeholder|sprite|spacer|1x1|blank\.gif/i.test(u)) return '';
  return u;
}
const dtImgKey = (u) => String(u).replace(/^https?:/, '').replace(/[?#].*$/, '').replace(/_(?:\d+x\d*|\d*x\d+)(?=\.\w+$)/, '').toLowerCase();
function dtImgs(list, base) {
  const out = [], seen = new Set();
  for (const v of list) {
    const u = dtImg(v, base);
    const k = u && dtImgKey(u);
    if (u && !seen.has(k)) { seen.add(k); out.push(u); }
    if (out.length >= DETAIL_CAP.imgs) break;
  }
  return out;
}
const dtAvail = (o) => { const a = String((o && o.availability) || ''); return a ? /instock|limitedavailability|presale|preorder|onlineonly/i.test(a) : null; };

function dtFromLd(html, base) {
  const { group, prod, all } = dtLdNodes(html);
  const out = {};
  const p = prod || group;
  if (!p) return out;
  const g = group || {};
  const variants = Array.isArray(g.hasVariant) ? g.hasVariant : (Array.isArray(p.hasVariant) ? p.hasVariant : []);
  const vlist = variants.length ? variants : [];
  out.name = dtText(p.name || g.name || '').slice(0, 200);
  const d = dtText(g.description || p.description || '');
  if (d) out.desc = d;
  const imgs = [].concat(p.image || [], g.image || [], ...vlist.map((v) => (v && v.image) || []));
  out.imgs = dtImgs(imgs, base);
  out.sku = String(p.sku || g.productGroupID || p.productGroupID || p.mpn || g.sku || p.productID || '').trim().slice(0, DETAIL_CAP.sku);
  // 가격: 단일·배열·AggregateOffer. 정가는 priceSpecification 의 ListPrice·StrikethroughPrice.
  const offers = [];
  const push = (o) => { if (!o) return; if (Array.isArray(o)) { o.forEach(push); return; } if (typeof o !== 'object') return; offers.push(o); if (o.offers) push(o.offers); };
  push(p.offers); if (group && p !== group) push(g.offers);
  vlist.forEach((v) => v && push(v.offers));
  const curOf = (o) => String(o.priceCurrency || (o.priceSpecification && [].concat(o.priceSpecification)[0] && [].concat(o.priceSpecification)[0].priceCurrency) || '').toUpperCase();
  // 판매가: price → lowPrice → 정가 표시가 아닌 priceSpecification.price(Jaeger·M&S 는 여기에만 적는다).
  const specNow = (o) => { const x = [].concat(o.priceSpecification || []).find((sp) => sp && !/listprice|strikethrough|msrp|srp/i.test(String(sp.priceType || ''))); return x ? x.price : null; };
  const nowOf = (o) => dtNum(o.price != null ? o.price : (o.lowPrice != null ? o.lowPrice : specNow(o)));
  const nows = offers.map(nowOf).filter(Number.isFinite);
  const cur = (offers.map(curOf).find(Boolean) || '').slice(0, 3);
  if (cur) out.cur = cur;
  if (nows.length) out.price = dtMoney(Math.min(...nows), cur);
  const lists = [];
  for (const o of offers) for (const s of [].concat(o.priceSpecification || [])) {
    if (s && /listprice|strikethrough|msrp|srp/i.test(String(s.priceType || ''))) { const n = dtNum(s.price); if (Number.isFinite(n)) lists.push(n); }
  }
  if (lists.length && nows.length && Math.max(...lists) > Math.min(...nows)) out.priceOrig = dtMoney(Math.max(...lists), cur);
  // 컬러·사이즈: 변형(hasVariant) 또는 offers.itemOffered
  const colors = [], sizes = [], sizesIn = [];
  let stockKnown = false;
  const take = (node, offer) => {
    if (!node) return;
    const c = dtText(node.color || ''); if (c && c.length <= 40) colors.push(c);
    // size 는 글 하나 · {name} · 배열(Massimo Dutti: ["XS","S",…]) 모두 있다. 배열이면 재고는 알 수 없다.
    const many = Array.isArray(node.size);
    for (const z of many ? node.size : [node.size]) {
      const s = dtText(z && typeof z === 'object' ? z.name : z || '');
      if (!s || s.length > 20) continue;
      sizes.push(s);
      const av = many ? null : dtAvail(offer || [].concat(node.offers || [])[0]);
      if (av !== null) { stockKnown = true; if (av) sizesIn.push(s); }
    }
  };
  for (const v of vlist) take(v);
  for (const o of offers) if (o.itemOffered) take(o.itemOffered, o);
  if (!vlist.length) take(p, [].concat(p.offers || [])[0]);
  if (prod && prod.color) out.color = dtText(prod.color).slice(0, 80);
  const cs = dtUniq(colors);
  if (cs.length) out.colors = cs.slice(0, DETAIL_CAP.colors);
  const ss = dtUniq(sizes);
  if (ss.length) { out.sizes = ss.slice(0, DETAIL_CAP.sizes); if (stockKnown) out.sizesIn = dtUniq(sizesIn).slice(0, DETAIL_CAP.sizes); }
  out.ldCount = all.length;
  return out;
}

// Shopify 공개 JSON — /products/<handle>.js(가격 센트·재고 available) 또는 .json(가격 문자열·body_html) 둘 다 받는다.
function dtFromShopify(pr, base) {
  const out = {};
  if (!pr || typeof pr !== 'object') return out;
  const p = pr.product || pr;
  out.name = dtText(p.title || '').slice(0, 200);
  const bodyHtml = String(p.body_html || p.description || '');
  const lis = [...bodyHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((x) => dtText(x[1]).replace(/\n/g, ' ').trim()).filter((t) => t.length >= 2 && t.length <= 400);
  // 본문 속 칸 제목("DETAILS" · "SIZE + FIT")은 설명이 아니다 — 빼고 남은 문단만.
  const para = dtText(bodyHtml.replace(/<(ul|ol)\b[\s\S]*?<\/\1>/gi, ' ')).split('\n')
    .filter((t) => !dtHeadKind(t)).join('\n').trim();
  if (para) out.desc = para;
  if (lis.length) out.feat = lis;
  const imgs = (Array.isArray(p.images) ? p.images : []).map((x) => (typeof x === 'string' ? x : x && x.src));
  if (p.featured_image) imgs.unshift(p.featured_image);
  out.imgs = dtImgs(imgs, base);
  const opts = Array.isArray(p.options) ? p.options : [];
  const optIdx = (rx) => opts.findIndex((o) => rx.test(String(typeof o === 'string' ? o : (o && o.name) || '').trim()));
  const valsOf = (i) => { const o = opts[i]; return o && Array.isArray(o.values) ? o.values.map((v) => dtText(v)).filter(Boolean) : []; };
  const ci = optIdx(/^(?:colou?rs?|colou?rway|shade|wash|색상|컬러)$/i), si = optIdx(/^(?:sizes?|사이즈)$/i);
  if (ci >= 0) out.colors = dtUniq(valsOf(ci)).slice(0, DETAIL_CAP.colors);
  const vs = Array.isArray(p.variants) ? p.variants : [];
  if (si >= 0) {
    out.sizes = dtUniq(valsOf(si)).slice(0, DETAIL_CAP.sizes);
    if (vs.some((v) => v && typeof v.available === 'boolean')) {
      const key = 'option' + (si + 1);
      out.sizesIn = dtUniq(vs.filter((v) => v && v.available).map((v) => dtText(v[key] || ''))).filter(Boolean).slice(0, DETAIL_CAP.sizes);
    }
  }
  // .js 는 가격이 센트(정수), .json 은 "98.00" 문자열이다.
  const cents = typeof p.price === 'number' || vs.some((v) => v && typeof v.price === 'number');
  const amt = (v) => { const n = dtNum(v); return Number.isFinite(n) ? (cents ? n / 100 : n) : NaN; };
  const now = vs.map((v) => amt(v && v.price)).filter(Number.isFinite);
  const was = vs.map((v) => amt(v && v.compare_at_price)).filter(Number.isFinite);
  const cur = String((vs[0] && vs[0].price_currency) || '').toUpperCase().slice(0, 3);
  if (cur) out.cur = cur;
  if (now.length) out.price = dtMoney(Math.min(...now), cur || 'USD');
  if (now.length && was.length && Math.max(...was) > Math.min(...now)) out.priceOrig = dtMoney(Math.max(...was), cur || 'USD');
  // 상품 코드: 변형 코드들의 공통 앞부분(사이즈 꼬리를 뗀 것), 없으면 첫 변형 코드.
  const skus = vs.map((v) => String((v && v.sku) || '').trim()).filter(Boolean);
  if (skus.length) {
    let pre = skus[0];
    for (const s of skus) while (pre && !s.startsWith(pre)) pre = pre.slice(0, -1);
    pre = pre.replace(/[-_.\s]+$/, '');
    out.sku = (skus.length > 1 && pre.length >= 4 ? pre : skus[0]).slice(0, DETAIL_CAP.sku);
  }
  return out;
}

// 메타 태그(og·product:) — 가격·통화·사진. 설명(og:description)은 사이트 공통 문구인 경우가 많아 맨 뒤 대안으로만.
function dtFromMeta(html, base) {
  const h = String(html || '').slice(0, 400000);
  const metas = [...h.matchAll(/<meta\b[^>]*>/gi)].map((x) => x[0]);
  const keyOf = (t) => (t.match(/\b(?:property|name|itemprop)\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
  const valOf = (t) => (t.match(/\bcontent\s*=\s*"([^"]*)"/i) || t.match(/\bcontent\s*=\s*'([^']*)'/i) || [])[1];
  const get = (rx) => { for (const t of metas) { const v = valOf(t); if (v != null && rx.test(keyOf(t))) return dtText(v); } return ''; };
  const all = (rx) => metas.filter((t) => rx.test(keyOf(t))).map(valOf).filter(Boolean);
  const out = {};
  const cur = get(/^(?:product|og):price:currency$|^priceCurrency$/i).toUpperCase().slice(0, 3);
  if (cur) out.cur = cur;
  const amt = dtNum(get(/^(?:product|og):price:amount$|^price$/i));
  if (Number.isFinite(amt)) out.price = dtMoney(amt, cur);
  const orig = dtNum(get(/^(?:product|og):original_price:amount$/i));
  if (Number.isFinite(orig) && Number.isFinite(amt) && orig > amt) out.priceOrig = dtMoney(orig, cur);
  out.imgs = dtImgs(all(/^og:image(?::secure_url|:url)?$/i), base);
  out.desc = get(/^og:description$|^description$/i);
  out.color = get(/^(?:product|og):colou?r$/i);
  return out;
}

// Inditex(Massimo Dutti·Zara) 형 — 소재가 화면 글이 아니라 페이지 JSON 의 parts/components 에만 있다:
//   "parts":[{"description":"OUTER SHELL","components":[{"material":"cotton","percentage":"93%"},…]}]
// 추천 상품의 소재가 같은 JSON 에 섞일 수 있어, 서로 다른 조성이 둘 이상이면(이 상품의 것인지 모름) 버린다 —
// 단 주소의 상품 번호(…-l06853106 · …-p01234567)가 나온 자리 바로 뒤 8,000자 안의 것은 이 상품의 것으로 본다.
function compFromPartsJson(html, url) {
  const h = String(html || '').replace(/\\"/g, '"').replace(/\\u002[fF]/g, '/');
  const groups = [];
  for (const m of h.matchAll(/"parts"\s*:\s*\[/g)) {
    const seg = h.slice(m.index, m.index + 6000);
    const lines = [];
    for (const pm of seg.matchAll(/"description"\s*:\s*"([^"]{0,40})"(?:(?!"description")[\s\S]){0,400}?"components"\s*:\s*\[([^\]]*)\]/g)) {
      const items = [...pm[2].matchAll(/"material"\s*:\s*"([A-Za-z][A-Za-z ]{1,30})"\s*,\s*"percentage"\s*:\s*"?(\d{1,3}(?:[.,]\d+)?)\s*%?"?/g)]
        .map((c) => ({ material: titleCase(c[1].trim()), percent: Math.round(Number(c[2].replace(',', '.'))) }));
      const sum = items.reduce((n, c) => n + c.percent, 0);
      if (items.length && sum >= 95 && sum <= 105) lines.push(items);
      if (lines.length >= 2) break;
    }
    if (lines.length) groups.push({ at: m.index, text: lines.map((l) => l.map((c) => c.material + ' ' + c.percent + '%').join(' / ')).join('\n'), lines });
  }
  if (!groups.length) return [];
  const uniq = [...new Set(groups.map((g) => g.text))];
  let pick = uniq.length === 1 ? groups[0] : null;
  if (!pick) {
    const id = (String(url || '').match(/[lp](\d{7,9})(?:[?#./]|$)/i) || [])[1];
    if (id) {
      const at = h.indexOf(id);
      const near = at >= 0 ? groups.filter((g) => g.at > at && g.at - at < 8000) : [];
      if (near.length) pick = near[0];
    }
  }
  if (!pick) return [];
  return pick.lines.flatMap((l, n) => l.map((c) => ({ ...c, line: n })));
}

// 부위 이름표만 있는 줄("OUTER SHELL")과 이름표 없이 쌍점으로 시작하는 값 조각(": 100% cotton")을 정리한다.
// 이름표 바로 뒤에 값 줄이 오면 한 줄로 붙인다("OUTER SHELL: 100% cotton"). 짝이 없는 이름표·조각은 버린다 —
// 혼용률 줄은 이름표와 값이 함께 있을 때만 디테일로 남긴다(2026-11-25 Zara 표본).
const DT_PART_LABEL_RX = /^(?:outer\s+shell|shell|main(?:\s+fabric)?|body|lining|trims?|outer|inner|filling|padding|composition|materials?|fabric)\s*[:：]?$/i;
function dtJoinLabels(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const t = String(list[i] || '').trim();
    if (DT_PART_LABEL_RX.test(t)) {
      const next = String(list[i + 1] || '').trim().replace(/^[:：]\s*/, '');
      if (next && /\d{1,3}\s?%/.test(next) && !DT_PART_LABEL_RX.test(next)) { out.push(t.replace(/\s*[:：]$/, '') + ': ' + next); i++; }
      continue;
    }
    if (/^[:：\-\u2013]\s*\S/.test(t)) continue;
    out.push(t);
  }
  return out;
}

// 상품명 꼬리의 컬러 — 컬러마다 따로 된 상품(Boden: "Lace Trim V-Neck Velvet Top-Beetroot Red",
// 주소 …-beetroot-red-t2259red)은 컬러 옵션도 JSON-LD color 도 없이 이름 끝에만 컬러를 적는다.
// 꼬리를 주소(상품 핸들)에서도 똑같이 찾을 수 있을 때만 컬러로 본다 — 이름 끝의 아무 낱말이나 컬러로 읽지 않게.
function dtTitleColor(name, url) {
  const n = String(name || '').trim();
  const m = n.match(/(?:\s[-\u2013\u2014|]\s|-)([A-Za-z][A-Za-z '&\/]{1,30})$/);
  if (!m) return '';
  const tail = m[1].trim();
  const slug = tail.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let path = '';
  try { path = new URL(url).pathname.toLowerCase(); } catch (e) { return ''; }
  if (!slug || slug.length < 3 || !new RegExp('(?:^|[-/])' + slug + '(?:[-/.]|$)').test(path)) return '';
  // "Crew-Neck" · "Velvet V-Neck" · "Cap-Sleeve" 처럼 옷 모양 낱말이 꼬리면 컬러가 아니다. 앞부분은 여러 낱말이어야 한다.
  if (/^(?:neck|sleeves?|shirt|tee|top|dress|length|line|fit|leg|rise|back|front|waist|up|down|in|out|on|off|zip|button|wrap|pocket|collar|hem|knit|cut|crop(?:ped)?|tie|ups?)\b/i.test(tail)) return '';
  const head = n.slice(0, n.length - m[0].length);
  return /\s/.test(head) && n.length > tail.length + 3 ? tail : '';
}

// 한 상품 페이지의 상세 정보. html(없어도 됨)·shop(Shopify JSON, 없어도 됨)·url.
// 배열은 이미 상한으로 잘려 있다. src = 항목별 출처(shopify·jsonld·meta·dom).
function detailOf(html, url, shop) {
  const base = url || 'https://example.invalid/';
  const sp = shop ? dtFromShopify(shop, base) : {};
  const ld = html ? dtFromLd(html, base) : {};
  const mt = html ? dtFromMeta(html, base) : {};
  const dom = html ? dtSections(dtBody(html)) : { desc: [], feat: [], kinds: [] };
  const out = { src: {} };
  const pick = (k, cands) => {
    for (const [s, v] of cands) {
      if (Array.isArray(v) ? v.length : (v != null && String(v).trim())) { out[k] = v; out.src[k] = s; return; }
    }
  };
  pick('name', [['shopify', sp.name], ['jsonld', ld.name]]);
  // 설명: Shopify 본문 → JSON-LD → 본문 칸. og:description 은 마지막(사이트 공통 문구가 흔하다).
  pick('desc', [['shopify', sp.desc], ['jsonld', ld.desc], ['dom', dom.desc.join('\n')], ['meta', mt.desc]]);
  // 글머리표: 본문 칸 → Shopify 본문 목록(본문 칸이 핏·관리법 칸까지 더 넓게 담는다).
  pick('feat', [['dom', dom.feat], ['shopify', sp.feat]]);
  pick('imgs', [['shopify', sp.imgs], ['jsonld', ld.imgs], ['meta', mt.imgs]]);
  pick('colors', [['shopify', sp.colors], ['jsonld', ld.colors]]);
  pick('sizes', [['shopify', sp.sizes], ['jsonld', ld.sizes]]);
  pick('sizesIn', [['shopify', sp.sizesIn], ['jsonld', ld.sizesIn]]);
  pick('sku', [['shopify', sp.sku], ['jsonld', ld.sku]]);
  pick('cur', [['jsonld', ld.cur], ['meta', mt.cur], ['shopify', sp.cur]]);
  pick('price', [['shopify', sp.price], ['jsonld', ld.price], ['meta', mt.price]]);
  pick('priceOrig', [['shopify', sp.priceOrig], ['jsonld', ld.priceOrig], ['meta', mt.priceOrig]]);
  pick('color', [['jsonld', ld.color], ['meta', mt.color], ['title', dtTitleColor(out.name || ld.name || sp.name, url)]]);
  if (out.desc) out.desc = dtClip(out.desc, DETAIL_CAP.desc);
  if (out.feat) out.feat = dtJoinLabels(out.feat);
  if (out.feat) {
    out.feat = dtUniq(out.feat.map((t) => dtClip(t.replace(/\s+/g, ' '), DETAIL_CAP.featLen)))
      .filter((t) => !dtJunk(t)).slice(0, DETAIL_CAP.feat);
    if (!out.feat.length) { delete out.feat; delete out.src.feat; }
  }
  if (out.name) out.name = dtClip(out.name, 200);
  if (out.color && out.color.length > 40) { delete out.color; delete out.src.color; }
  out.domKinds = dom.kinds;
  return out;
}
// ── 상품 상세(detail) 추출 끝
