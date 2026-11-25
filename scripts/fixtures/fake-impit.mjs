// 테스트용 가짜 impit — 진짜 impit(크롬 TLS 지문 흉내)처럼 fetch 하되, 가짜 쇼핑몰이 알아보게 x-impit 머리를 붙인다.
// enrich-comp.mjs 는 IMPIT_MODULE 로 이 파일을 받는다(scripts/test-enrich-detail.mjs).
export class Impit {
  constructor(opts) { this.opts = opts || {}; }
  async fetch(url, init = {}) {
    const r = await fetch(url, { ...init, headers: { ...(init.headers || {}), "x-impit": "1" } });
    return { status: r.status, url: r.url, headers: r.headers, text: () => r.text() };
  }
}
