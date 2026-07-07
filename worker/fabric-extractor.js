// Cloudflare Worker — 원단 정보 추출기
// ------------------------------------------------------------------
// 미로 패널에서 의상 상품 페이지 URL을 하나 받아, Claude의 web_fetch 도구로
// 그 페이지를 가져와 "혼용률(composition) + 소재(materials)"를 구조화된
// JSON으로 뽑아 돌려줍니다.
//
//   요청:  POST { "url": "https://..." }
//   응답:  { url, product_name, composition:[{material,percent}], materials:[], status, note }
//
// 필수 시크릿:  ANTHROPIC_API_KEY   (`wrangler secret put ANTHROPIC_API_KEY`)
// 선택 변수:    ALLOWED_ORIGIN      (기본 "*", 배포 후 패널 주소로 좁히기를 권장)
//               ACCESS_TOKEN        (설정 시 요청에 x-access-token 헤더 필요 — 오남용 방지)
// ------------------------------------------------------------------

const MODEL = 'claude-opus-4-8';
const ANTHROPIC_VERSION = '2023-06-01';

const SYSTEM = `You extract fabric / material information from a single clothing product web page.
You are given one product URL. Use the web_fetch tool to load it, then read the page
(look for "materials", "composition", "fabric", "care", "product details" sections).

Respond with ONLY one JSON object — no markdown fences, no prose. Shape:
{
  "product_name": string,        // garment name; "" if unknown
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
- percent must be a number (no "%" sign). If a page lists a material with no percent, still add
  it to "materials" but omit it from "composition".
- Never invent data. If the page loads but no composition is stated, use status "no_data".`;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-access-token',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
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
      // 실패해도 200 + status:error 로 돌려주면 패널이 행 단위로 표시할 수 있습니다.
      return json(
        { url, product_name: '', composition: [], materials: [], status: 'error', note: String((e && e.message) || e) },
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
      // web_fetch 는 대화에 이미 존재하는 URL만 가져오므로 user 메시지에 URL을 넣습니다.
      tools: [{ type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 3 }],
      messages: [{
        role: 'user',
        content: `Product URL: ${url}\n\nFetch this page and return the fabric composition and materials as the specified JSON.`,
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
    // 최종 텍스트가 없으면(예: pause_turn) 접근 실패로 간주
    return { product_name: '', composition: [], materials: [], status: 'blocked', note: 'no parseable model output (page may be blocked)' };
  }

  return {
    product_name: parsed.product_name || '',
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

// 모델이 코드펜스나 앞뒤 설명을 붙여도 견고하게 JSON만 뽑아냅니다.
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
