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
//  필수 시크릿:  GEMINI_API_KEY   (`wrangler secret put GEMINI_API_KEY`)
//               → https://aistudio.google.com/apikey 에서 무료 발급
//               MIRO_TOKEN       (`wrangler secret put MIRO_TOKEN`)
//               → 미로 앱 설정 "Install app and get OAuth token"에서 나온 access token.
//                 (썸네일=보드 이미지 기능에만 필요. 없으면 썸네일만 빠지고 나머진 동작.)
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
async function proxyMiroImage(boardId, itemId, env, cors) {
  if (!env.MIRO_TOKEN)
    return new Response('server is missing MIRO_TOKEN secret', { status: 500, headers: cors });
  // 아이템 ID는 숫자, 보드 ID는 영숫자/기호 일부만 허용(안전 문자만).
  if (!/^[\w=-]{1,64}$/.test(String(boardId)) || !/^\d{1,32}$/.test(String(itemId)))
    return new Response('bad board/item id', { status: 400, headers: cors });

  const auth = { authorization: 'Bearer ' + env.MIRO_TOKEN };

  // 1) 아이템 메타데이터에서 리소스 주소(imageUrl) 얻기
  let metaResp;
  try {
    metaResp = await fetch(
      `https://api.miro.com/v2/boards/${encodeURIComponent(boardId)}/images/${encodeURIComponent(itemId)}`,
      { headers: { ...auth, accept: 'application/json' } },
    );
  } catch (e) {
    return new Response('miro item fetch error', { status: 502, headers: cors });
  }
  if (!metaResp.ok) return new Response('miro item ' + metaResp.status, { status: 502, headers: cors });

  let meta;
  try { meta = await metaResp.json(); } catch (e) { return new Response('miro item parse', { status: 502, headers: cors }); }
  const resourceUrl = meta && meta.data && meta.data.imageUrl;
  if (!resourceUrl) return new Response('miro imageUrl missing', { status: 502, headers: cors });

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
        // 드물게 리소스 주소가 곧바로 이미지 바이트를 반환하는 경우
        return imageResponse(await rr.arrayBuffer(), ct, cors);
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
      if (buf.byteLength > MAX_IMG_BYTES) return new Response('image too large', { status: 413, headers: cors });
      return imageResponse(buf, ct, cors);
    } catch (e) {}
  }
  return new Response('miro image fetch failed', { status: 502, headers: cors });
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
