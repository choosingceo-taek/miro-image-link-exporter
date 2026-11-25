# 접근 지도 — 134개 브랜드, 우리 수집기가 어디까지 닿는가

만든 때 {{GENERATED}} · 측정 실행 {{RUNS}}회(GitHub Actions, 읽기만) · 기준 야간 리포트 2026-11-25(main)

이 문서는 `node scripts/build-access-map.mjs` 가 만든다. 같은 사실이 `access-map.json` 에 기계용으로 있다.
판정 근거는 세 가지뿐이다 — ① 11/25 야간 리포트(서버 프리페치·헤드리스 수집·카탈로그 점검·혼용률 보강),
② 오늘 새로 잰 측정(`try-engines-results-<실행>.json`, 실행 목록은 맨 아래), ③ 그 둘을 보고 사람이 적은 판정
(`access-measure/verdicts.json`). 오늘 재지 않고 추정한 것은 표에 **(추정)** 이라고 적었다.

## 1. 한눈에

### 목록(카테고리) 페이지 — 상품 목록을 가져오는 단계

{{SUMMARY_LISTING}}

### 상품 페이지 — 혼용률·컬러를 읽는 단계

{{SUMMARY_PRODUCT}}

엑셀 혼용률 칸: 지금 {{COMP_TOTAL}}개가 채워져 있고 **{{COMP_MISSING}}개가 비어 있다**(11/25 03:39 카탈로그 점검 기준).

{{KEY_POINTS}}

상태 이름 뜻:

- ✅ 된다 — 지금 쓰는 길(서버·헤드리스·확장)로 매일 채워진다.
- 🏠 집 IP(확장)에서만 — 데이터센터(Render·GitHub)에서는 막히거나 못 읽고, 담당자 PC 의 크롬 확장만 된다. 확장을 매일 돌려야 유지된다.
- 🟠 일부만 — 카테고리 일부만, 또는 날마다(러너마다) 되다 말다 한다.
- ⛔ 어디서도 막힘 — 우리가 가진 길이 모두 막혔다.
- 🔗 URL 이 틀림·죽음 — 사이트가 아니라 담당자가 준 주소가 문제.
- 🔧 열리는데 잘못 읽음 — 접근은 되는데 우리 수집기가 상품을 못 고르거나 엉뚱한 것을 고른다.
- 📭 사이트가 혼용률을 안 적음(상품 페이지만).

고치는 단계: **0** 이미 정상 → **1** 무료로 우리 쪽에서(엔진 바꾸기·사이트 JSON·선택자·웹 아카이브) → **2** 집 IP 가 필요(확장) → **3** 유료 차단 해제 서비스 → **4** 담당자가 새 URL 을 줘야 함.

## 2. 무엇이 막는가 — 차단 주체

"403" 은 증상일 뿐이다. 차단 업체는 응답에 흔적을 남긴다 — 쿠키 이름(`_abck`·`bm_sz` = Akamai, `datadome` = DataDome,
`__cf_bm` = Cloudflare, `_px*` = HUMAN/PerimeterX), 응답 헤더(`server: AkamaiGHost`·`akamai-grn`, `cf-mitigated: challenge`,
`x-datadome: protected`, `x-vercel-id`), 차단 화면의 제목과 문구(“Access Denied … Reference #”, “Just a moment…”,
“Attention Required! | Cloudflare”, “Please enable JS and disable any ad blocker” + captcha-delivery.com,
“Access to this page has been denied” + px-cloud.net, “Vercel Security Checkpoint”), 그리고 페이지가 불러오는 확인 스크립트 주소.
아래 주체는 **그 흔적만으로** 정했다(브랜드 평판으로 짐작하지 않음). 근거 강도: **높음** = 차단 화면 자체에 그 업체 흔적 ·
**중간** = 차단 응답에 그 업체 쿠키·헤더만 · **낮음** = CDN 헤더만. 판정 규칙과 시험은 `scripts/access-evidence.mjs` ·
`scripts/test-access-evidence.mjs`.

{{BLOCKERS}}

{{VENDOR_NOTES}}

## 3. 담당자가 확인해야 할 URL

{{BAD_URLS}}

## 4. 목록 페이지 — 브랜드별

'근거(측정)' 칸의 `엔진 성공/잰 횟수(실패 원인 HTTP)` 는 오늘 그 브랜드의 목록 URL 들을 모든 실행에서 잰 합계다.
엔진: impit = 브라우저 없이 크롬의 TLS 지문으로 HTML 만 받음(서버 프리페치와 가장 비슷한 길) · playwright = 헤드리스 크롬 ·
firefox = 헤드리스 파이어폭스 · firefox-fresh = 페이지마다 쿠키 없는 새 창 · server = Render 서버에 직접 물어봄(프리페치와 같은 길).
목록은 "상품 5개 이상"을 성공으로 셌다(브라우저는 야간 수집과 같은 수집기 collector.js 기준, impit 은 HTML 의 상품 링크).

{{LISTING_SECTIONS}}

## 5. 상품 페이지 — 브랜드별

상품은 "혼용률을 읽음"을 성공으로 셌다. 브랜드마다 카탈로그 앞쪽 상품 3개(같은 상품을 모든 엔진이 연다).
site-api = 사이트 자체 JSON(Shopify `.json`·Zara), wayback = 웹 아카이브 보관본.

{{PRODUCT_SECTIONS}}

## 6. 유료 서비스 시험 칸

`scripts/try-engines.mjs` 에 업체 중립 엔진 `ext:<이름>` 을 넣었다. 업체 이름·주소·키는 저장소에 없다 — 실행할 때
저장소 비밀 **`SCRAPE_API_CONFIG`** 로만 들어온다. 비밀이 없으면 그 엔진은 조용히 빠진다(지금 상태).

담당자가 할 일:

1. GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret
2. 이름 `SCRAPE_API_CONFIG`, 값은 아래 모양의 JSON 한 줄(서비스 둘 이상을 견주려면 배열 `[ {...}, {...} ]`):

```json
{
  "name": "trial-a",
  "request": "https://<서비스 API 주소>?api_key={key}&url={url}",
  "method": "GET",
  "params": { "<서비스 옵션 이름>": "<값>" },
  "headers": {},
  "key": "<서비스가 준 키>",
  "html": "body",
  "upstreamStatus": "",
  "success": { "status": [200] },
  "timeoutSec": 120,
  "maxRequests": 100,
  "gapMs": 1000
}
```

- `{url}` 자리에 대상 주소가 인코딩돼 들어간다(`{url_raw}` = 그대로). `{key}` 는 `request`·`headers`·`params`·`body` 어디에 써도 된다.
- 키를 헤더로 받는 서비스: `"headers": { "<헤더 이름>": "{key}" }`. POST 로 받는 서비스: `"method": "POST", "body": { "url": "{url_raw}" }`.
- 응답이 JSON 으로 HTML 을 감싸 주면 `"html": "json:<점 경로>"`(예: `json:data.html`), 대상 사이트의 상태 코드를 따로 주면
  `"upstreamStatus": "header:<헤더 이름>"` 또는 `"json:<점 경로>"`.
- `name` 은 리포트 열 제목(`ext:trial-a`)이 된다 — 업체 이름일 필요 없다. `maxRequests` 로 한 번 실행의 요청 수(=비용)를 묶는다.
- 키·키가 든 헤더 값·API 호스트는 로그에서 가려지고(GitHub `add-mask`), 리포트·결과 JSON 에서는 `***` 로 바뀐다.
  결과에는 대상 주소와 판정만 남는다. 가짜 API 로 시험: `node scripts/test-access-evidence.mjs`.

시험 한 번: Actions → Diagnose stuck pages → Run workflow, 브랜치 `claude/dv-visibility-cross-device-igprlf`,
mode `engines`, urls `access-measure/targets-blocked.json`, engines `impit,firefox,ext`(유료 열만 보려면 `ext`).
리포트 `try-engines-report-<실행>.md` 에 무료 엔진 열 옆에 `ext:<이름>` 열이 나온다. `targets-blocked.json` 은 지금 무료로는
안 되는 목록·상품 주소만 모은 것이다(§7).

## 7. 측정 방법과 한계

- 모든 측정은 GitHub Actions 러너(미국 데이터센터 IP)에서 읽기만 했다. Worker 에 아무것도 쓰지 않았다(엔진 비교 도구는 저장 코드가 없다).
- 사이트당 요청은 엔진마다 URL 3~5개, 같은 사이트 연속 요청은 1.5초 이상 띄웠다. 로그인·확인 화면 풀기는 하지 않았다.
- 같은 URL 을 서로 다른 러너(IP)에서 2회 이상 쟀다. 목록 URL 623개 전부는 impit 으로 2회(서로 다른 IP) — 두 번의 판정이 623개 모두 같았다.
  막힌·이상한 브랜드의 목록 URL 166개는 크롬·파이어폭스로 2회, 상품은 브랜드당 3개를 1~2회.
- camoufox(탐지 회피용 파이어폭스)는 이번에도 모든 실행에서 시작하자마자 죽었다(SIGSEGV) — 결과 없음, 표에서 뺐다.
- 데이터센터 결과는 러너마다 갈릴 수 있다(11/24 Chico's 상품 12/20 → 0/20). 한 번만 잰 칸은 표의 '실행 N회'로 보인다.
- 서버(Render) 경고의 'reader fallback failed (HTTP 429)' 는 서버가 쓰는 외부 리더 프록시의 한도다 — 사이트 차단 근거로 세지 않았다.
- 집 IP(확장) 쪽은 오늘 새로 재지 않았다. 확장 담당 브랜드의 '확장에서 된다'는 카탈로그의 URL 별 저장 수와 갱신 시각(11/25)이 근거다.
- '페이지 넘김 의심' 같은 원인은 표에 (추정)으로 적었다 — 측정은 '차단 없음'까지만 말한다.

{{URL_SECTION}}

### 측정 실행

{{RUN_TABLE}}
