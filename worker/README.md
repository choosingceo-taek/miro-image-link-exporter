# 🧵 원단 정보 추출 Worker (Cloudflare · Google Gemini 무료)

미로 패널이 보낸 **의상 상품 페이지 URL**을 받아, **Worker가 직접 페이지를 가져와** 텍스트를
Gemini에 넘겨 **혼용률(composition) + 소재(materials)** 를 JSON으로 돌려주는 작은 서버입니다.
(Gemini의 URL 읽기 도구는 무료 한도가 매우 낮아, 넉넉한 일반 텍스트 생성 방식을 씁니다.)

> 이 서버가 있어야 패널의 **"🧵 원단 정보 분석"** 버튼이 동작합니다.
> (브라우저는 남의 쇼핑몰 사이트를 직접 못 읽기 때문 — CORS. 그래서 대신 읽어줄 서버가 필요합니다.)

---

## 준비물
- **Cloudflare 계정** (무료 티어)
- **Gemini API 키** (무료. https://aistudio.google.com/apikey 에서 발급 — 구글 로그인 후 "Create API key")
- **미로 access token** (썸네일용). 미로 앱 설정의 **Install app and get OAuth token** 버튼으로 발급.
- Node.js + `npm i -g wrangler`

## 배포 (약 5분)

```bash
cd worker

# 1) 로그인
wrangler login

# 2) API 키를 시크릿으로 주입 (저장소/코드에는 절대 넣지 않습니다)
wrangler secret put GEMINI_API_KEY
#   → 프롬프트에 AIza... 로 시작하는 Gemini 키 붙여넣기

# 3) 미로 보드 이미지를 썸네일로 넣기 위한 미로 토큰 (썸네일 기능에만 필요)
wrangler secret put MIRO_TOKEN
#   → 미로 앱 설정 화면의 "Install app and get OAuth token"에서 나온 access token 붙여넣기
#     (미로는 업로드 이미지의 원본 주소를 Web SDK로 노출하지 않아, REST API 호출에 이 토큰이 필요)

# 4) (선택) 오남용 방지용 공유 토큰
wrangler secret put ACCESS_TOKEN
#   → 아무 랜덤 문자열. 설정하면 패널 설정에도 같은 값을 넣어야 함.

# 5) 배포
wrangler deploy
```

> **썸네일(미로 보드 이미지)** 은 위 `MIRO_TOKEN` 이 있어야 나옵니다.
> 토큰을 안 넣으면 나머지(원단 분석·URL 정리)는 그대로 동작하고 썸네일 칸만 비워집니다.
> 미로 access token은 앱 재설치/만료 시 바뀔 수 있으니, 썸네일이 안 나오면 이 값을 다시 넣고 재배포하세요.

배포가 끝나면 이런 주소가 나옵니다:

```
https://fabric-extractor.<your-subdomain>.workers.dev
```

이 주소를 **미로 패널 → ⚙︎ 원단 분석 서버 설정 → Worker URL** 칸에 붙여넣으면 끝.
(ACCESS_TOKEN을 설정했다면 같은 값을 Access token 칸에도.)

> 이미 다른 모델로 배포해 둔 상태라면, 코드만 바꾼 뒤 `wrangler deploy` **한 번만** 다시 하면 됩니다.
> 새 키(`GEMINI_API_KEY`)는 위 2번으로 새로 넣어야 합니다(기존 `ANTHROPIC_API_KEY`는 더 이상 안 씀).

## 공유 카탈로그 저장소 (하드차단 사이트용) — 선택, 강력 추천
Massimo Dutti·Zara·H&M·Gap처럼 봇 차단이 강한 사이트는 서버가 못 읽습니다. 대신 팀원이
브라우저에서 그 사이트를 볼 때 **유저스크립트(RACK 수집기)** 로 상품을 한 번 전송해두면,
**이후 모두가 미로 앱에서 즉시 접근**합니다. 저장은 Cloudflare **무료 KV**를 씁니다.

```bash
cd worker
# 1) KV 네임스페이스 생성 (무료)
wrangler kv namespace create RACK_CACHE
#   → 출력된 id 를 wrangler.toml 의 [[kv_namespaces]] 블록에 붙여넣고 주석(#) 해제
# 2) 재배포
wrangler deploy
```

유저스크립트 설치(팀원 각자, 최초 1회):
- 브라우저에 **Tampermonkey**(무료 확장) 설치 → `rack-harvester.user.js` 를 열면 설치 창이 뜸
- 설치 후 쇼핑몰 페이지 우하단의 **📥 RACK 전송** 버튼 클릭(최초 1회 Worker 주소·토큰 입력, 우클릭=설정변경)
- 미로 RACK 패널 상단에 **저장된 카탈로그** 칩이 생기고, 누르면 즉시 상품이 뜹니다.

새 KV 관련 엔드포인트: `POST ?store=catalog`(저장), `GET ?catalogs=1`(목록), `GET ?catalog=<site>`(불러오기).

## 배포 후 보안 권장
- `wrangler.toml`의 `ALLOWED_ORIGIN`을 패널 주소(예: `https://choosingceo-taek.github.io`)로 좁히고 재배포하세요.
- `ACCESS_TOKEN`을 설정해 두면 링크만 아는 외부인이 님의 키/할당량을 쓰는 걸 막습니다.

## 동작/한계
- **무료 티어라 하루 사용량·분당 요청 한도**가 있습니다. 큰 보드(수백 개)는 한도에 걸려 나눠 돌려야 할 수 있습니다.
  (한도 초과 시 `error` 상태로 표시됨 → 잠시 후 재시도)
- 대형 쇼핑몰(H&M·Gap 등)은 봇 차단이 강해 **일부 페이지는 접근 실패**(`blocked`)할 수 있습니다.
- 구글은 **무료 티어 요청 데이터를 서비스 개선에 활용**할 수 있습니다(민감 정보 주의).
- 모델은 `fabric-extractor.js`의 `MODEL`에서 바꿀 수 있음 (예: `gemini-2.0-flash` → `gemini-2.5-flash`).

## 로컬 테스트
```bash
wrangler dev
# 다른 터미널에서:
curl -X POST http://localhost:8787 \
  -H 'content-type: application/json' \
  -d '{"url":"https://eberjey.com/products/cozy-time-mock-neck-pullover-lead"}'
```
