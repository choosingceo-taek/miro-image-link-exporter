# 무료 크롤링 엔진 비교 (2026-11-24T04:16Z)

GitHub Actions(데이터센터 IP)에서 지금 막혀 있는 페이지를 엔진마다 열어 본 결과입니다. 저장은 하지 않았습니다.
엔진마다 따로 프로세스로 돌려, 한 엔진이 죽어도 다른 엔진 결과는 남습니다.

✅ 소재까지 읽음 · 🟡 페이지는 열림(소재 없음/목록) · ⛔ 차단 · ❌ 오류

| 엔진 | ✅ | 🟡 | ⛔ | ❌ | 상품 3쪽 ✅·🟡 | 목록 0쪽 ✅·🟡 | 실행 |
|---|---:|---:|---:|---:|---:|---:|---|
| firefox | 3 | 0 | 0 | 0 | 3·0 | 0·0 | 정상 · 3쪽 · 15s |
| wayback | 2 | 0 | 0 | 1 | 2·0 | 0·0 | 정상 · 3쪽 · 2s |

## 페이지별

| 구분 | 브랜드 | firefox | wayback |
|---|---|:-:|:-:|
| 상품 | [www.zara.com](https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=615161645) | ✅ | ✅ |
| 상품 | [www.zara.com](https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=615792507) | ✅ | ✅ |
| 상품 | [www.zara.com](https://www.zara.com/us/en/washed-crepe-100-cotton-t-shirt-p04424641.html?v1=576063400) | ✅ | ❌ |

<details><summary>사유</summary>

- www.zara.com — https://www.zara.com/us/en/rustic-cotton-t-shirt-p04424306.html?v1=615161645
  - firefox: ✅ Cotton 100%
  - wayback: ✅ 20261112 보관본 · Cotton 100%
- www.zara.com — https://www.zara.com/us/en/boat-neck-t-shirt-p04424640.html?v1=615792507
  - firefox: ✅ Cotton 100%
  - wayback: ✅ 20260923 보관본 · Cotton 100%
- www.zara.com — https://www.zara.com/us/en/washed-crepe-100-cotton-t-shirt-p04424641.html?v1=576063400
  - firefox: ✅ Cotton 100%
  - wayback: ❌ 보관본 없음

</details>
