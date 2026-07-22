# 설치 링크만으로 팀들이 바로 쓰게 하기 (OAuth 설치 플로우)

이 설정을 한 번 해두면, 다른 팀은 **설치 링크 클릭 → Authorize** 만으로
앱을 쓰고 **썸네일까지 자동**으로 됩니다. 팀마다 앱 만들기·Worker 배포·토큰 붙여넣기 **전부 불필요**.

전제: 앱은 **하나(소유자 것)** 만 씁니다. 팀들은 이 앱을 설치 링크로 설치합니다.

---

## A. 미로 앱 설정 (한 번)

미로 개발자 설정에서 이 앱을 열고:

1. **App URL** 에 `?worker=` 를 붙여서 넣기 (⚠️ 이게 있어야 팀원이 무설정으로 씀):
   ```
   https://choosingceo-taek.github.io/miro-image-link-exporter/index.html?worker=https://<본인-worker>.workers.dev
   ```
2. **Permissions (scopes)**: `boards:read` 체크 (보드에 이미지 추가 기능도 쓰려면 `boards:write` 추가)
3. **Redirect URI for OAuth** 에 등록:
   ```
   https://<본인-worker>.workers.dev/oauth/callback
   ```
4. **Client ID** 와 **Client secret** 값을 복사해 둠 (B에서 사용).

## B. Worker 시크릿 주입 후 배포 (한 번)

```bash
cd worker
wrangler secret put CLIENT_ID       # A-4의 Client ID 붙여넣기
wrangler secret put CLIENT_SECRET   # A-4의 Client secret 붙여넣기
wrangler deploy
```
> KV(RACK_CACHE)는 이미 `wrangler.toml`에 설정돼 있어 팀 토큰이 자동 저장됩니다.
> (기존 `MIRO_TOKEN`은 지워도 됩니다. 내 팀도 아래 설치 링크로 한 번 설치하면 똑같이 커버됩니다.)

## C. 팀에 공유할 설치 링크

```
https://<본인-worker>.workers.dev/install
```

각 팀에서 **한 명(설치 권한 있는 사람)** 이 이 링크를 열고 → 자기 팀 선택 → **Authorize** → 끝.
그 순간 그 팀 토큰이 서버에 저장되고, 팀원 전원이 보드에서 앱 아이콘을 눌러 바로 씁니다(썸네일 포함).

---

## 팀원에게 전달할 안내 (이게 전부)

> 1. 이 링크 열기 → 우리 팀 선택 → **Authorize**: `https://<본인-worker>.workers.dev/install`
> 2. 미로 보드에서 **Board Scanner** 앱 아이콘 클릭 → **Scan All**
> 3. 브랜드·썸네일·상품명·URL 엑셀이 바로 다운로드됩니다.

## 동작 원리 (참고)
- 설치 시 미로가 그 팀 전용 `access_token` 을 발급 → Worker가 `mtok:<teamId>` 로 KV에 저장.
- 썸네일 요청 시 Worker가 **그 보드가 열리는 팀 토큰**을 골라 사용(성공한 조합은 캐시 → 이후 즉시).
- 토큰은 서버(KV)에만 있고 브라우저로 나가지 않습니다. `?worker=` 로 넘어가는 건 Worker 주소뿐입니다.

## 비용
전부 무료 티어(Worker 10만 req/일, KV 쓰기 1천·읽기 10만/일). 사내 테스트 규모로는 한도에 안 걸립니다.
