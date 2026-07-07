# 🔗 Miro 이미지 링크 추출기 (호스팅 저장소)

미로(Miro) 보드의 **사진 + 사진에 걸어둔 링크(URL)** 를 엑셀(CSV)로 뽑는 미로 앱입니다.
이 저장소는 **GitHub Pages 호스팅 전용** 공개 저장소입니다. (앱에는 내부 정보가 없습니다.)

- 배포 주소(App URL): `https://choosingceo-taek.github.io/miro-image-link-exporter/index.html`
- 세팅·설치·사용법: **[MANUAL.md](./MANUAL.md)**

기능: **사진+링크 → 이미지 삽입 엑셀(.xlsx)/CSV**, 그리고 (선택) **링크된 의상 상품 페이지의
원단 정보(혼용률·소재) 자동 정리 + 소재 통계·차트 엑셀**.

| 파일 | 역할 |
|------|------|
| `index.html` | 앱 본체(단일 파일). 진입점 + 패널 UI + 엑셀/CSV + 원단 분석 UI. |
| `worker/` | (선택) 원단 추출용 Cloudflare Worker — Claude `web_fetch`로 상품 페이지 읽기. |
| `MANUAL.md` | 팀 배포·설치·사용 단계별 매뉴얼 (PART D = 원단 분석) |
| `.nojekyll` | GitHub Pages가 파일을 그대로 서빙하도록 하는 설정 |
