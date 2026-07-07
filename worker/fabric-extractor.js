// Cloudflare Worker — 원단 정보 추출기 + 이미지 프록시
// ------------------------------------------------------------------
//  POST { "url": "https://..." }
//     → { url, product_name, image_url, composition:[{material,percent}], materials:[], status, note }
//       image_url = 상품 페이지 대표 이미지(og:image) 주소
//
//  GET  ?img=<이미지URL>[&token=...]
//     → 그 이미지를 서버에서 대신 가져와 CORS 허용 헤더와 함께 반환(프록시).
//       브라우저(패널)가 남의 도메인 이미지를 엑셀에 넣을 수 있게 해줍니다.
//
//  필수 시크릿:  ANTHROPIC_API_KEY   (`wrangler secret put ANTHROPIC_API_KEY`)
//  선택 변수:    ALLOWED_ORIGIN(기본 "*"), ACCESS_TOKEN(설정 시 POST 헤더/GET 쿼리로 검증)
// ------------------------------------------------------------------

const MODEL = 'claude-sonnet-5';
const ANTHROPIC_VERSION = '2023-06-01';
// Sonnet 5는 dynamic-filtering web_fetch(_20260209)를 지원합니다.
const WEB_FETCH_TYPE = 'web_fetch_20260209';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const MAX_IMG_BYTES = 8 * 1024 * 1024;

const SYSTEM = `You extract fabric / material information from a single clothing product web page.
You are given one product URL. Use the web_fetch tool to load it, then read the page
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
- Never invent data. If the page loads but no composition is stated, use status "no_data".`;

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
      const img = reqUrl.searchParams.get('img');
      if (!img) return json({ error: 'use POST to extract, or GET ?img=<url> to proxy an image' }, 400, cors);
      if (env.ACCESS_TOKEN && reqUrl.searchParams.get('token') !== env.ACCESS_TOKEN)
        return new Response('unauthorized', { status: 401, headers: cors });
      return proxyImage(img, cors);
    }

    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);

    if (env.ACCESS_TOKEN && request.headers.get('x-access-token') !== env.ACCESS_TOKEN)
      return json({ error: 'unauthorized' }, 401, cors);

    if (!env.ANTHROPIC_API_KEY)
      return json({ error: 'server is missing ANTHROPIC_API_KEY secret' }, 500, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'invalid JSON body' }, 400, cors); }

    const url = ((body && body.url) || '').trim();
    if (!url) return json({ error: 'missing "url"' }, 400, cors);

    try {
      const result = await extractFabric(url, env.ANTHROPIC_API_KEY);
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

async function extractFabric(url, apiKey) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      tools: [{ type: WEB_FETCH_TYPE, name: 'web_fetch', max_uses: 3 }],
      messages: [{
        role: 'user',
        content: `Product URL: ${url}\n\nFetch this page and return the product image URL, fabric composition, and materials as the specified JSON.`,
      }],
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Claude API ${resp.status}: ${t.slice(0, 200)}`);
  }

  const data = await resp.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  const parsed = parseJson(text);
  if (!parsed) {
    return { product_name: '', image_url: '', composition: [], materials: [], status: 'blocked', note: 'no parseable model output (page may be blocked)' };
  }

  return {
    product_name: parsed.product_name || '',
    image_url: (parsed.image_url && /^https?:\/\//i.test(parsed.image_url)) ? parsed.image_url : '',
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
