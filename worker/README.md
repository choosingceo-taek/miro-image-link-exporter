# 🧵 원단 정보 추출 Worker (Cloudflare)

미로 패널이 보낸 **의상 상품 페이지 URL**을 받아, Claude의 `web_fetch` 도구로 그 페이지를
가져와 **혼용률(composition) + 소재(materials)** 를 JSON으로 돌려주는 작은 서버입니다.

> 이 서버가 있어야 패널의 **"🧵 원단 정보 분석"** 버튼이 동작합니다.
> (브라우저는 남의 쇼핑몰 사이트를 직접 못 읽기 때문 — CORS. 그래서 대신 읽어줄 서버가 필요합니다.)

---

## 준비물
- **Cloudflare 계정** (무료 티어로 시작 가능)
- **Anthropic API 키** (Claude API 사용 = 유료. https://console.anthropic.com 에서 발급)
- Node.js + `npm i -g wrangler`

## 배포 (약 5분)

```bash
cd worker

# 1) 로그인
wrangler login

# 2) API 키를 시크릿으로 주입 (저장소/코드에는 절대 넣지 않습니다)
wrangler secret put ANTHROPIC_API_KEY
#   → 프롬프트에 sk-ant-... 붙여넣기

# 3) (선택) 오남용 방지용 공유 토큰
wrangler secret put ACCESS_TOKEN
#   → 아무 랜덤 문자열. 설정하면 패널 설정에도 같은 값을 넣어야 함.

# 4) 배포
wrangler deploy
```

배포가 끝나면 이런 주소가 나옵니다:

```
https://fabric-extractor.<your-subdomain>.workers.dev
```

이 주소를 **미로 패널 → ⚙︎ 원단 분석 서버 설정 → Worker URL** 칸에 붙여넣으면 끝.
(ACCESS_TOKEN을 설정했다면 같은 값을 Access token 칸에도.)

## 배포 후 보안 권장
- `wrangler.toml`의 `ALLOWED_ORIGIN`을 패널 주소(예: `https://choosingceo-taek.github.io`)로 좁히고 재배포하세요.
- `ACCESS_TOKEN`을 설정해 두면 링크만 아는 외부인이 님의 API 키로 비용을 태우는 걸 막습니다.

## 동작/한계
- 대형 쇼핑몰(H&M·Gap·Etam 등)은 봇 차단이 강해 **일부 페이지는 접근 실패**할 수 있습니다.
  이 경우 응답 `status`가 `blocked`/`no_data`/`error`로 오고, 패널·엑셀에 그대로 표시됩니다(수동 확인용).
- Shopify 계열(Eberjey, Negative Underwear 등)은 대체로 잘 읽힙니다.
- 링크 1개당 Claude(Haiku 4.5, 저비용 모델) 호출 1회 → 링크 수만큼 비용이 듭니다. 큰 보드는 요금을 미리 확인하세요.
  (더 높은 정확도가 필요하면 `fabric-extractor.js`의 `MODEL`을 `claude-opus-4-8`로 바꾸고, `WEB_FETCH_TYPE`을 `web_fetch_20260209`로 함께 바꾼 뒤 재배포.)

## 로컬 테스트
```bash
wrangler dev
# 다른 터미널에서:
curl -X POST http://localhost:8787 \
  -H 'content-type: application/json' \
  -d '{"url":"https://eberjey.com/products/cozy-time-mock-neck-pullover-lead"}'
```
