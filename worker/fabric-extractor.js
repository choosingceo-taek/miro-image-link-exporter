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
  "status": "ok" | "no_data" | "blocked",  // no_data = loaded but no composition; blocked = could not access
  "note": string                 // short reason when not "ok"; else ""
}

Rules:
- Normalize material names to English title case: Cotton, Polyester, Elastane, Modal, Nylon,
  Viscose, Wool, Silk, Linen, Cashmere, Acrylic, Lyocell, Spandex→Elastane, Polyamide→Nylon.
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

      // og:image만 추출 (AI 미사용 — 무료 한도와 무관). "썸네일+URL만" 버튼이 사용.
      const meta = reqUrl.searchParams.get('meta');
      if (meta) {
        if (!tokOk) return new Response('unauthorized', { status: 401, headers: cors });
        const page = await fetchPageText(meta);
        return json({
          url: meta,
          image_url: page.ok ? (page.ogImage || '') : '',
          status: page.ok ? 'ok' : 'blocked',
          note: page.ok ? '' : ('fetch ' + page.status),
        }, 200, cors);
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
      return proxyImage(img, cors);
    }

    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);

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
        .slice(0, 500)
        .map(p => ({
          name: String(p.name || '').slice(0, 200),
          imageUrl: String(p.imageUrl).slice(0, 1000),
          productUrl: String(p.productUrl).slice(0, 1000),
          price: String(p.price || '').slice(0, 40),
          category: String(p.category || 'tops').slice(0, 20),
        }));
      if (!items.length) return json({ error: 'no valid items' }, 400, cors);
      const record = { site, brand: String(body.brand || '').slice(0, 80), updated: Date.now(), items };
      await env.RACK_CACHE.put('catalog:' + site, JSON.stringify(record), {
        metadata: { brand: record.brand, count: items.length, updated: record.updated },
      });
      return json({ ok: true, site, count: items.length }, 200, cors);
    }

    if (env.ACCESS_TOKEN && request.headers.get('x-access-token') !== env.ACCESS_TOKEN)
      return json({ error: 'unauthorized' }, 401, cors);

    if (!env.GEMINI_API_KEY)
      return json({ error: 'server is missing GEMINI_API_KEY secret' }, 500, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'invalid JSON body' }, 400, cors); }

    const url = ((body && body.url) || '').trim();
    if (!url) return json({ error: 'missing "url"' }, 400, cors);

    try {
      const result = await extractFabric(url, env.GEMINI_API_KEY);
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
async function proxyImage(img, cors) {
  let target;
  try { target = new URL(img); }
  catch { return new Response('bad img url', { status: 400, headers: cors }); }
  if (target.protocol !== 'https:' && target.protocol !== 'http:')
    return new Response('bad scheme', { status: 400, headers: cors });

  const r = await fetch(target.toString(), {
    headers: { 'user-agent': UA, accept: 'image/avif,image/webp,image/*,*/*;q=0.8', referer: target.origin + '/' },
  });
  if (!r.ok) return new Response('upstream ' + r.status, { status: 502, headers: cors });

  const ct = r.headers.get('content-type') || 'image/jpeg';
  if (!ct.startsWith('image/')) return new Response('not an image', { status: 415, headers: cors });

  const len = Number(r.headers.get('content-length') || 0);
  if (len && len > MAX_IMG_BYTES) return new Response('image too large', { status: 413, headers: cors });

  const buf = await r.arrayBuffer();
  return new Response(buf, {
    status: 200,
    headers: { ...cors, 'content-type': ct, 'cache-control': 'public, max-age=86400' },
  });
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
    return { product_name: '', image_url: '', composition: [], materials: [], status: 'blocked', note: 'fetch ' + page.status };
  }

  // 2) 일반 텍스트 생성(무료 한도 넉넉)으로 원단 정보만 추출. URL 읽기 도구 미사용.
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
    return { product_name: '', image_url: page.ogImage || '', composition: [], materials: [], status: 'no_data', note: 'no parseable model output' };
  }

  const modelImg = (parsed.image_url && /^https?:\/\//i.test(parsed.image_url)) ? parsed.image_url : '';
  return {
    product_name: parsed.product_name || '',
    image_url: modelImg || (page.ogImage && /^https?:\/\//i.test(page.ogImage) ? page.ogImage : ''),
    composition: Array.isArray(parsed.composition)
      ? parsed.composition
          .filter((c) => c && c.material)
          .map((c) => ({ material: String(c.material), percent: Number(c.percent) }))
          .filter((c) => c.material && !Number.isNaN(c.percent))
      : [],
    materials: Array.isArray(parsed.materials) ? parsed.materials.map(String) : [],
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
  let text = `${p.title || ''}. ${body} tags: ${p.tags || ''}`.trim();
  if (text.length > 16000) text = text.slice(0, 16000);

  return { ok: true, text, ogImage: /^https?:\/\//i.test(img) ? img : '' };
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
  if (!r) return { ok: false, status: lastErr || 'fetch failed' };

  const html = await r.text();
  const ogImage = findImage(html, url);

  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length > 16000) text = text.slice(0, 16000);

  return { ok: true, text, ogImage };
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
