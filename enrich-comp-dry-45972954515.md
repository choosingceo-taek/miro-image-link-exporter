# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-27T10:51Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

- 설정: 재시도 창 5일(무시 — RETRY_ALL) · 추출 규칙 판 1e33f36e · 한 사이트 요청 간격 2000ms · Worker 우회 끔(측정 — 상품 주소당 요청 3번 이하) · impit 켬
- **429 를 받아 이 실행에서 그만 물은 사이트**: global.llbean.com(https://global.llbean.com/llb/shop/5877971.html) · paige.com(https://paige.com/products/women-rhodes-tee-whisper-pink.js) — 그 뒤 상품은 시도 기록 없이 남겼다

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 51/134개** (상품 18031/44626개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

ALC · Aerie · American Eagle · Apiece Apart · Banana Republic · Bash · Beyond yoga · Boldest · Buck Mason · Citizens of Humanity · Cotton on · Damson Madder · Dickies · Evereve · Faherty · Frank & Eileen · Gestuz · Gymshark · Hobbs · J.jill · James Perse · Jigsaw · LNA · La Ligne · Lucky Brand · Marine Layer · Me+Em · Monsoon · Nation LTD · Ninety Percent · Old Navy · On · Phase eight · Poetry · Rag & bone · Sanctuary · Seasalt cornwall · Shopbop · Sweaty betty · The Great · Theory · Tuckernuck · Ulla Johnson · Varley · Veronica Beard · Vince · Vuori · Whistles · Wrap · Xirena · vineyardvines

전체 평균은 아직입니다 — 혼용률 80% · 컬러웨이 72%.
기준 95% 까지 10178개, 목표 99% 까지 11963개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 44626개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 35659 | 80% | +172 |
| 컬러웨이 | 32217 | 72% | +169 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 800개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (134) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| The white company | — | 0/68 (0%) | 0/68 (0%) | 혼용률 +0 컬러 +0 | 시간 끝 30 |
| H&M | — | 0/744 (0%) | 4/744 (1%) | 혼용률 +0 컬러 +0 | 실패 직접차단 2·보관본없음 2 / 시간 끝 30 |
| Sezane | — | 1/203 (0%) | 2/203 (1%) | 혼용률 +0 컬러 +0 | 시간 끝 30 |
| Lululemon | — | 8/512 (2%) | 8/512 (2%) | 혼용률 +0 컬러 +0 | 시간 끝 30 |
| Garnet hill | — | 2/108 (2%) | 0/108 (0%) | 혼용률 +0 컬러 +0 | 실패 직접차단 30·보관본없음 1·아카이브거부 12·아카이브오류 7 |
| Anthropologie | — | 7/263 (3%) | 7/263 (3%) | 혼용률 +0 컬러 +0 | 실패 직접차단 30 |
| Addidas | — | 22/537 (4%) | 22/537 (4%) | 혼용률 +0 컬러 +0 | 실패 직접차단 30 |
| Patagonia | — | 7/168 (4%) | 6/168 (4%) | 혼용률 +0 컬러 +0 | 실패 껍데기 30 |
| Prana | — | 4/81 (5%) | 4/81 (5%) | 혼용률 +0 컬러 +0 | 실패 직접차단 30 |
| Joules | — | 29/536 (5%) | 29/536 (5%) | 혼용률 +0 컬러 +0 | 실패 직접차단 333 / 시간 끝 174 |
| Massimo Dutti | — | 58/606 (10%) | 95/606 (16%) | 혼용률 +0 컬러 +0 | 실패 직접차단 218 / 시간 끝 330 |
| Oysho | — | 2/20 (10%) | 0/20 (0%) | 혼용률 +0 컬러 +0 | 실패 직접차단 18 |
| Fatface | — | 49/374 (13%) | 49/374 (13%) | 혼용률 +19 컬러 +19 | 성공 아카이브 19 / 실패 직접차단 344·보관본없음 21 |
| Free People | — | 25/189 (13%) | 20/189 (11%) | 혼용률 +6 컬러 +5 | 성공 아카이브 6 / 실패 직접차단 169·보관본없음 31·아카이브거부 1·아카이브오류 2 |
| Reformation | — | 179/800 (22%) | 186/800 (23%) | 혼용률 +0 컬러 +0 | 시간 끝 621 |
| Chico's | — | 202/800 (25%) | 207/800 (26%) | 혼용률 +42 컬러 +44 | 성공 페이지 18·impit 18·아카이브 26 / 실패 직접차단 622·보관본없음 12·아카이브거부 2 |
| FP Movement | — | 22/72 (31%) | 11/72 (15%) | 혼용률 +8 컬러 +6 | 성공 아카이브 8 / 미표기 1 / 실패 직접차단 57·보관본없음 17·아카이브거부 4·아카이브오류 8 |
| Coldwatercreek | — | 71/200 (36%) | 113/200 (56%) | 혼용률 +0 컬러 +0 | 성공 페이지 128 / 실패 껍데기 1 |
| WHBM | — | 78/219 (36%) | 80/219 (37%) | 혼용률 +0 컬러 +0 | 시간 끝 141 |
| &Other Stories | — | 176/472 (37%) | 116/472 (25%) | 혼용률 +0 컬러 +0 | 시간 끝 296 |
| Zara | — | 204/499 (41%) | 203/499 (41%) | 혼용률 +3 컬러 +3 | 성공 아카이브 3 / 실패 직접차단 12·보관본없음 7·아카이브거부 2 / 시간 끝 280 |
| Loft | — | 285/672 (42%) | 321/672 (48%) | 혼용률 +0 컬러 +0 | 미표기 19 / 실패 껍데기 368 |
| Arket | — | 186/382 (49%) | 187/382 (49%) | 혼용률 +4 컬러 +4 | 성공 페이지 1·impit 1·아카이브 3 / 실패 직접차단 199·보관본없음 36·아카이브오류 1 |
| Paige | — | 32/61 (52%) | 60/61 (98%) | 혼용률 +0 컬러 +0 | 실패 직접차단 8 / 429 로 멈춤 29 |
| Wilson | — | 29/51 (57%) | 38/51 (75%) | 혼용률 +0 컬러 +0 | 시간 끝 22 |
| Mango | — | 52/88 (59%) | 0/88 (0%) | 혼용률 +0 컬러 +0 | 시간 끝 36 |
| Abercrombie & Fitch | — | 140/224 (63%) | 2/224 (1%) | 혼용률 +0 컬러 +0 | 실패 직접차단 84 |
| Aritzia | — | 505/800 (63%) | 5/800 (1%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 직접차단 296·보관본없음 36·아카이브거부 3 |
| Splendid | — | 319/478 (67%) | 447/478 (94%) | 혼용률 +2 컬러 +37 | 성공 쇼피JSON 40·페이지 38 / 시간 끝 121 |
| Everlane | — | 341/461 (74%) | 300/461 (65%) | 혼용률 +0 컬러 +5 | 성공 쇼피JSON 119·페이지 119 |
| Club monaco | — | 142/173 (82%) | 64/173 (37%) | 혼용률 +0 컬러 +1 | 성공 쇼피JSON 53·페이지 31 |
| Spanx | — | 101/121 (83%) | 121/121 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 20 |
| Oasis | — | 150/176 (85%) | 176/176 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 26 |
| Stateside | — | 299/350 (85%) | 293/350 (84%) | 혼용률 +0 컬러 +0 | 시간 끝 51 |
| Gap | — | 407/475 (86%) | 474/475 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 68 |
| Rails | — | 261/304 (86%) | 235/304 (77%) | 혼용률 +1 컬러 +1 | 성공 쇼피JSON 41·페이지 40 / 시간 끝 3 |
| rouje | — | 201/234 (86%) | 227/234 (97%) | 혼용률 +9 컬러 +0 | 성공 쇼피JSON 1·페이지 11 / 실패 직접차단 17·껍데기 4 / 시간 끝 10 |
| Leset | — | 203/236 (86%) | 231/236 (98%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 33·페이지 33 |
| Cotton citizen | — | 181/208 (87%) | 208/208 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 27·페이지 27 |
| Splits59 | — | 152/174 (87%) | 122/174 (70%) | 혼용률 +0 컬러 +0 | 시간 끝 22 |
| Lands end | — | 405/463 (87%) | 20/463 (4%) | 혼용률 +0 컬러 +0 | 실패 직접차단 58 |
| J crew | — | 172/196 (88%) | 196/196 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 24·impit 24 |
| Madewell | — | 67/75 (89%) | 75/75 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 8·impit 8 |
| Good American | — | 609/681 (89%) | 681/681 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 49·페이지 72 |
| Michael Stars | — | 225/251 (90%) | 227/251 (90%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 26·페이지 26 |
| Athleta | — | 369/406 (91%) | 378/406 (93%) | 혼용률 +0 컬러 +0 | 성공 페이지 37 |
| J.mclaughlin | — | 471/516 (91%) | 12/516 (2%) | 혼용률 +0 컬러 +0 | 성공 페이지 43 / 실패 직접차단 2 |
| Carlhartt | — | 81/88 (92%) | 1/88 (1%) | 혼용률 +0 컬러 +0 | 성공 페이지 6 / 미표기 1 |
| Boden | — | 339/368 (92%) | 228/368 (62%) | 혼용률 +2 컬러 +1 | 성공 쇼피JSON 2·페이지 2 / 시간 끝 29 |
| Addison bay | — | 130/141 (92%) | 109/141 (77%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 11·페이지 11 |
| Project Social T | — | 277/299 (93%) | 299/299 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 22·페이지 22 |
| Ann Taylor | — | 353/381 (93%) | 362/381 (95%) | 혼용률 +0 컬러 +0 | 미표기 1 / 실패 껍데기 27 |
| Alo | — | 230/248 (93%) | 248/248 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 18·페이지 18 |
| Outdoorvoices | — | 117/126 (93%) | 111/126 (88%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 9·페이지 9 |
| Eddie bauer | — | 210/226 (93%) | 200/226 (88%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 16·페이지 16 |
| Monrow | — | 207/222 (93%) | 222/222 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 15·페이지 15 |
| Scoth & soda | — | 377/404 (93%) | 401/404 (99%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 8·페이지 26 / 시간 끝 1 |
| Vanessa bruno | — | 240/257 (93%) | 257/257 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 17 |
| Eileen fisher | — | 515/545 (94%) | 282/545 (52%) | 혼용률 +0 컬러 +0 | 실패 직접차단 30 |
| L.L bean | — | 296/313 (95%) | 259/313 (83%) | 혼용률 +0 컬러 +0 | 성공 페이지 2·impit 8 / 미표기 6 / 실패 직접차단 8 / 429 로 멈춤 9 |
| Frame | — | 229/242 (95%) | 221/242 (91%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 13·페이지 13 |
| Nike | ✅ | 528/556 (95%) | 550/556 (99%) | 혼용률 +0 컬러 +1 | 성공 페이지 28 |
| Sundry | — | 273/287 (95%) | 252/287 (88%) | 혼용률 +0 컬러 +0 | 시간 끝 14 |
| Marine Layer | ✅ | 178/187 (95%) | 187/187 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 9·페이지 9 |
| English factory | — | 259/272 (95%) | 249/272 (92%) | 혼용률 +0 컬러 +0 | 시간 끝 13 |
| Draper James | — | 189/198 (95%) | 177/198 (89%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 9·페이지 9 |
| Bellerose | ✅ | 237/248 (96%) | 235/248 (95%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 11·페이지 11 |
| Varley | ✅ | 275/287 (96%) | 287/287 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 12 |
| Tuckernuck | ✅ | 360/375 (96%) | 374/375 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 15 |
| Phase eight | ✅ | 386/401 (96%) | 401/401 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 15 |
| Gestuz | ✅ | 619/643 (96%) | 641/643 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 24 |
| CCC | — | 771/800 (96%) | 486/800 (61%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 11·페이지 24 / 미표기 3 / 실패 직접차단 1·껍데기 1 |
| Buck Mason | ✅ | 107/111 (96%) | 110/111 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 4 |
| Frank & Eileen | ✅ | 455/472 (96%) | 472/472 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 17·페이지 17 |
| Theory | ✅ | 376/390 (96%) | 377/390 (97%) | 혼용률 +0 컬러 +0 | 시간 끝 14 |
| Mint velvet | — | 403/417 (97%) | 311/417 (75%) | 혼용률 +31 컬러 +5 | 성공 쇼피JSON 45·페이지 45 |
| J.jill | ✅ | 87/90 (97%) | 89/90 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 3 |
| Bassike | — | 340/351 (97%) | 1/351 (0%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 238·페이지 216 |
| Jager | — | 390/402 (97%) | 339/402 (84%) | 혼용률 +0 컬러 +0 | 성공 페이지 12 |
| Apiece Apart | ✅ | 99/102 (97%) | 101/102 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 3 |
| Evereve | ✅ | 482/496 (97%) | 496/496 (100%) | 혼용률 +12 컬러 +12 | 성공 쇼피JSON 26·페이지 26 |
| The upside | — | 212/218 (97%) | 115/218 (53%) | 혼용률 +0 컬러 +0 | 시간 끝 6 |
| Wrap | ✅ | 364/374 (97%) | 369/374 (99%) | 혼용률 +0 컬러 +0 | 시간 끝 10 |
| Poetry | ✅ | 295/303 (97%) | 299/303 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 4 / 미표기 4 |
| Ulla Johnson | ✅ | 303/311 (97%) | 311/311 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 8 |
| Whistles | ✅ | 236/242 (98%) | 241/242 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 6 |
| Xirena | ✅ | 394/404 (98%) | 404/404 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 10 |
| Greyson | — | 125/128 (98%) | 116/128 (91%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 3·페이지 3 |
| Citizens of Humanity | ✅ | 167/171 (98%) | 171/171 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 4·페이지 4 |
| Seasalt cornwall | ✅ | 267/273 (98%) | 272/273 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 6 |
| Faherty | ✅ | 245/250 (98%) | 249/250 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 5·페이지 5 |
| Whitestuff | — | 663/676 (98%) | 362/676 (54%) | 혼용률 +9 컬러 +6 | 성공 페이지 9·impit 9 / 시간 끝 13 |
| Z Supply | — | 250/254 (98%) | 229/254 (90%) | 혼용률 +0 컬러 +0 | 시간 끝 4 |
| Gerard darel | — | 136/138 (99%) | 85/138 (62%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 2·페이지 2 |
| Bash | ✅ | 610/618 (99%) | 614/618 (99%) | 혼용률 +6 컬러 +6 | 성공 페이지 10 / 미표기 4 |
| On | ✅ | 229/232 (99%) | 232/232 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 3 |
| Ninety Percent | ✅ | 155/157 (99%) | 157/157 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 2·페이지 2 |
| Beyond yoga | ✅ | 242/245 (99%) | 244/245 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 3·페이지 3 |
| ALC | ✅ | 415/420 (99%) | 420/420 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 5·페이지 5 |
| Barbour | — | 168/170 (99%) | 16/170 (9%) | 혼용률 +0 컬러 +0 | 미표기 2 |
| Me+Em | ✅ | 451/456 (99%) | 455/456 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 4 / 실패 껍데기 1 |
| Veronica Beard | ✅ | 361/365 (99%) | 365/365 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 4 |
| Old Navy | ✅ | 668/675 (99%) | 675/675 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 7 |
| vineyardvines | ✅ | 558/563 (99%) | 561/563 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 5 |
| The Great | ✅ | 243/245 (99%) | 243/245 (99%) | 혼용률 +0 컬러 +0 | 시간 끝 2 |
| La Ligne | ✅ | 396/399 (99%) | 399/399 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 3 |
| Damson Madder | ✅ | 409/412 (99%) | 412/412 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 2·페이지 2 / 미표기 1 |
| LNA | ✅ | 276/278 (99%) | 276/278 (99%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 2·페이지 2 |
| Monsoon | ✅ | 174/175 (99%) | 175/175 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 1 |
| Thread & supply | — | 348/350 (99%) | 279/350 (80%) | 혼용률 +0 컬러 +0 | 시간 끝 2 |
| Lilla P | — | 175/176 (99%) | 145/176 (82%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 1·페이지 1 |
| Sweaty betty | ✅ | 409/411 (100%) | 410/411 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 2 |
| Sanctuary | ✅ | 425/427 (100%) | 426/427 (100%) | 혼용률 +12 컬러 +12 | 성공 쇼피JSON 14·페이지 2 |
| American Eagle | ✅ | 670/673 (100%) | 673/673 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 3·impit 3 |
| Cotton on | ✅ | 481/483 (100%) | 475/483 (98%) | 혼용률 +0 컬러 +0 | 성공 페이지 2 |
| Sessun | — | 241/242 (100%) | 0/242 (0%) | 혼용률 +0 컬러 +0 | 성공 페이지 1 |
| Gymshark | ✅ | 265/266 (100%) | 266/266 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 1 |
| James Perse | ✅ | 540/542 (100%) | 539/542 (99%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 2·페이지 2 |
| Hobbs | ✅ | 352/353 (100%) | 353/353 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 1 |
| Vince | ✅ | 378/379 (100%) | 379/379 (100%) | 혼용률 +0 컬러 +0 | 시간 끝 1 |
| Velvet | — | 394/395 (100%) | 340/395 (86%) | 혼용률 +0 컬러 +0 | 시간 끝 1 |
| Banana Republic | ✅ | 501/502 (100%) | 502/502 (100%) | 혼용률 +0 컬러 +0 | 성공 페이지 1 |
| Aerie | ✅ | 404/404 (100%) | 404/404 (100%) | 혼용률 +0 컬러 +0 |  |
| Dickies | ✅ | 240/240 (100%) | 240/240 (100%) | 혼용률 +0 컬러 +0 |  |
| Goldie | — | 148/148 (100%) | 129/148 (87%) | 혼용률 +0 컬러 +0 |  |
| Jigsaw | ✅ | 374/374 (100%) | 374/374 (100%) | 혼용률 +5 컬러 +0 | 성공 쇼피JSON 5·페이지 5 |
| Boldest | ✅ | 136/136 (100%) | 132/136 (97%) | 혼용률 +0 컬러 +0 |  |
| Lucky Brand | ✅ | 170/170 (100%) | 170/170 (100%) | 혼용률 +0 컬러 +0 |  |
| Nation LTD | ✅ | 525/525 (100%) | 525/525 (100%) | 혼용률 +0 컬러 +0 |  |
| Nylora | — | 242/242 (100%) | 52/242 (21%) | 혼용률 +0 컬러 +0 |  |
| Oak + Fort | — | 340/340 (100%) | 316/340 (93%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 1·페이지 1 |
| Rag & bone | ✅ | 233/233 (100%) | 233/233 (100%) | 혼용률 +0 컬러 +0 |  |
| Shopbop | ✅ | 572/572 (100%) | 572/572 (100%) | 혼용률 +0 컬러 +0 |  |
| Vuori | ✅ | 219/219 (100%) | 219/219 (100%) | 혼용률 +0 컬러 +0 |  |

## 상품 상세(설명·디테일·사진 전부·컬러 전부) — 이번 실행에서 읽은 브랜드 80개

별도 저장 칸(detail:<site>)에 쌓인다. 상품 수 대비 — 설명 21139 · 디테일 14975 · 사진 20839 · 컬러 전부 14897 / 27671

| 브랜드 | 상품 | 설명 | 디테일 | 사진 | 컬러 전부 | 이번 +N | 가드(설명 보류·글머리표 뺌) | 저장 크기 |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| CCC | 800 | 673 | 234 | 661 | 0 | +1 | 0·0 | 707KB |
| Aritzia | 800 | 0 | 0 | 0 | 0 | +0 | 0·0 | 0KB |
| Chico's | 800 | 152 | 0 | 152 | 152 | +18 | 0·0 | 154KB |
| Good American | 681 | 515 | 487 | 515 | 489 | +6 | 0·0 | 650KB |
| Whitestuff | 676 | 551 | 551 | 551 | 0 | +5 | 0·0 | 335KB |
| Old Navy | 675 | 675 | 112 | 675 | 675 | +1 | 0·0 | 961KB |
| American Eagle | 673 | 673 | 673 | 673 | 673 | +0 | 0·0 | 437KB |
| Loft | 672 | 0 | 0 | 0 | 0 | +0 | 0·0 | 3KB |
| Gestuz | 643 | 7 | 4 | 9 | 9 | +0 | 0·0 | 61KB |
| Bash | 618 | 615 | 611 | 611 | 611 | +6 | 0·0 | 923KB |
| Nike | 556 | 556 | 556 | 553 | 544 | +0 | 0·0 | 461KB |
| James Perse | 542 | 504 | 11 | 504 | 503 | +0 | 0·0 | 596KB |
| J.mclaughlin | 516 | 254 | 254 | 254 | 0 | +0 | 0·0 | 168KB |
| Banana Republic | 502 | 502 | 227 | 502 | 502 | +0 | 0·0 | 614KB |
| Zara | 499 | 120 | 25 | 120 | 120 | +0 | 0·0 | 166KB |
| Evereve | 496 | 436 | 301 | 437 | 407 | +8 | 0·0 | 434KB |
| Cotton on | 483 | 474 | 483 | 0 | 0 | +0 | 0·0 | 282KB |
| Splendid | 478 | 463 | 450 | 463 | 463 | +40 | 0·0 | 867KB |
| Gap | 475 | 474 | 381 | 474 | 474 | +1 | 0·0 | 713KB |
| Frank & Eileen | 472 | 444 | 311 | 444 | 428 | +0 | 0·0 | 642KB |
| Everlane | 461 | 456 | 190 | 458 | 0 | +33 | 0·0 | 575KB |
| Me+Em | 456 | 451 | 454 | 454 | 454 | +0 | 0·0 | 330KB |
| Sanctuary | 427 | 298 | 427 | 427 | 418 | +12 | 0·0 | 549KB |
| ALC | 420 | 414 | 248 | 414 | 404 | +0 | 0·0 | 486KB |
| Mint velvet | 417 | 314 | 0 | 414 | 0 | +22 | 0·0 | 453KB |
| Damson Madder | 412 | 411 | 224 | 411 | 403 | +1 | 0·0 | 659KB |
| Athleta | 406 | 406 | 332 | 378 | 378 | +0 | 0·0 | 371KB |
| Scoth & soda | 404 | 384 | 373 | 386 | 378 | +0 | 0·0 | 413KB |
| Jager | 402 | 402 | 401 | 402 | 0 | +0 | 0·0 | 1287KB |
| Phase eight | 401 | 401 | 401 | 401 | 401 | +0 | 0·0 | 923KB |
| La Ligne | 399 | 356 | 356 | 356 | 346 | +0 | 0·0 | 464KB |
| Arket | 382 | 2 | 2 | 2 | 2 | +1 | 0·0 | 3KB |
| Ann Taylor | 381 | 25 | 12 | 25 | 11 | +0 | 0·0 | 32KB |
| Fatface | 374 | 0 | 0 | 0 | 0 | +0 | 0·0 | 3KB |
| Jigsaw | 374 | 374 | 211 | 374 | 345 | +0 | 0·0 | 376KB |
| Boden | 368 | 336 | 227 | 335 | 0 | +2 | 0·0 | 462KB |
| Hobbs | 353 | 353 | 353 | 352 | 353 | +0 | 0·0 | 675KB |
| Bassike | 351 | 344 | 344 | 344 | 0 | +147 | 0·0 | 505KB |
| Oak + Fort | 340 | 332 | 326 | 332 | 318 | +1 | 0·0 | 555KB |
| L.L bean | 313 | 56 | 53 | 41 | 0 | +2 | 0·0 | 46KB |
| Rails | 304 | 283 | 47 | 283 | 0 | +25 | 0·72 | 294KB |
| Poetry | 303 | 303 | 299 | 0 | 0 | +0 | 0·0 | 165KB |
| Project Social T | 299 | 299 | 27 | 299 | 295 | +2 | 0·105 | 382KB |
| LNA | 278 | 278 | 0 | 278 | 273 | +0 | 0·0 | 264KB |
| Gymshark | 266 | 266 | 151 | 266 | 0 | +0 | 0·0 | 294KB |
| Michael Stars | 251 | 251 | 172 | 251 | 240 | +0 | 0·52 | 434KB |
| Faherty | 250 | 249 | 248 | 249 | 248 | +0 | 0·0 | 380KB |
| Alo | 248 | 248 | 5 | 248 | 248 | +1 | 0·0 | 266KB |
| Bellerose | 248 | 248 | 246 | 248 | 0 | +1 | 0·0 | 399KB |
| Beyond yoga | 245 | 244 | 233 | 244 | 240 | +0 | 0·0 | 227KB |
| Sessun | 242 | 242 | 242 | 242 | 0 | +0 | 0·0 | 162KB |
| Frame | 242 | 240 | 0 | 240 | 236 | +1 | 0·0 | 246KB |
| Leset | 236 | 235 | 92 | 235 | 218 | +1 | 0·0 | 386KB |
| rouje | 234 | 150 | 143 | 150 | 0 | +0 | 0·0 | 210KB |
| On | 232 | 231 | 231 | 231 | 231 | +0 | 0·0 | 325KB |
| Eddie bauer | 226 | 226 | 148 | 226 | 218 | +0 | 0·0 | 438KB |
| Monrow | 222 | 113 | 183 | 222 | 212 | +0 | 0·0 | 216KB |
| Cotton citizen | 208 | 208 | 206 | 208 | 206 | +0 | 0·0 | 293KB |
| Coldwatercreek | 200 | 199 | 199 | 199 | 0 | +0 | 0·0 | 132KB |
| Draper James | 198 | 198 | 197 | 198 | 171 | +0 | 0·0 | 270KB |
| J crew | 196 | 78 | 77 | 77 | 77 | +0 | 0·0 | 87KB |
| Free People | 189 | 1 | 0 | 0 | 0 | +0 | 0·0 | 2KB |
| Marine Layer | 187 | 0 | 120 | 187 | 182 | +0 | 0·0 | 159KB |
| Lilla P | 176 | 176 | 11 | 176 | 175 | +0 | 0·0 | 277KB |
| Oasis | 176 | 176 | 176 | 176 | 176 | +0 | 0·0 | 329KB |
| Monsoon | 175 | 175 | 175 | 175 | 0 | +1 | 0·0 | 312KB |
| Club monaco | 173 | 149 | 148 | 173 | 0 | +22 | 0·0 | 181KB |
| Citizens of Humanity | 171 | 171 | 97 | 171 | 168 | +0 | 0·0 | 261KB |
| Barbour | 170 | 170 | 170 | 170 | 0 | +0 | 0·0 | 218KB |
| Ninety Percent | 157 | 157 | 5 | 157 | 157 | +0 | 0·0 | 203KB |
| Addison bay | 141 | 141 | 0 | 141 | 139 | +0 | 0·0 | 244KB |
| Gerard darel | 138 | 137 | 9 | 137 | 45 | +0 | 0·0 | 147KB |
| Greyson | 128 | 128 | 0 | 128 | 127 | +0 | 0·0 | 142KB |
| Outdoorvoices | 126 | 126 | 88 | 126 | 111 | +0 | 0·0 | 143KB |
| Buck Mason | 111 | 103 | 91 | 103 | 102 | +0 | 0·0 | 115KB |
| Apiece Apart | 102 | 100 | 0 | 100 | 99 | +0 | 0·0 | 131KB |
| J.jill | 90 | 90 | 0 | 90 | 0 | +0 | 0·0 | 25KB |
| Carlhartt | 88 | 84 | 83 | 83 | 0 | +0 | 0·0 | 112KB |
| Madewell | 75 | 62 | 51 | 48 | 42 | +1 | 0·0 | 55KB |
| FP Movement | 72 | 1 | 0 | 0 | 0 | +0 | 0·0 | 2KB |

<details><summary>가드가 뺀 글(브랜드 대부분에 똑같이 붙은 글 — 사이트 공통 문구로 보고 저장하지 않음)</summary>

- Michael Stars · 글머리표 — fitted semi fitted relaxed · ultra rib dresses gauze dresses linen dresses
- Project Social T · 글머리표 — machine wash cold · wash inside out with similar colors · do not bleach · lay flat to dry
- Rails · 글머리표 — imported · recommend ordering true to size

</details>

## 껍데기로 센 페이지 예 (12)

차단 화면은 아닌데 카탈로그 상품명이 화면 글에 없어 '사이트 미표기(none)'로 적지 않은 페이지.

- points icon — https://www.anntaylor.com/stylerewards
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Stack of folded sweaters in mint, cream and green tied with  — https://www.anntaylor.com/new-arrivals/the-gift-shop/cat4730013/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Two women in a green bow blouse with wide-leg trousers and a — https://www.anntaylor.com/new-arrivals/all-new-arrivals/cata00008/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Woman in a green ribbed turtleneck midi dress with a black b — https://www.anntaylor.com/new-arrivals/shop-by-shade/cat5310001/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Woman in a short-sleeve green sequin shift dress. — https://www.anntaylor.com/clothing/all-clothing/cat3630020/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Woman in a short-sleeve green sequin shift dress. — https://www.anntaylor.com/new-arrivals/trends-to-try/cata7000090/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Woman in a black blazer, white shirt and black leather trous — https://www.anntaylor.com/work/all-work/cat4190020/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Woman in a black faux-fur jacket and a sequin maxi skirt. — https://www.anntaylor.com/new-arrivals/the-social-shop/cat5550004/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Black satin slingback heels with rosette detail. — https://www.anntaylor.com/shoes/all-shoes/cata000020/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Black suede pumps with a jeweled crystal buckle. — https://www.anntaylor.com/shoes/heels-pumps/cat660016/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Green and navy plaid sequin clutch with a gold chain strap. — https://www.anntaylor.com/accessories/belts-handbags/cat1860024/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR
- Crystal starburst tassel earrings. — https://www.anntaylor.com/accessories/jewelry/cata000021/
  >  · 50% OFF EVERYTHING > SHOP NOW EXTRA 15% OFF YOUR $200+ PURCHASE > SHOP NOW FREE SHIPPING WITH ORDERS OF $150+! true Order Status Order Status My Account Sign In Sign Up Wallet Track An Order StyleR

## 혼용률이 엇갈린 상품 (51)

지금 페이지에서 읽은 값이 이미 있던 값과 다르다. 보관본 값이었으면 지금 페이지 값으로 바꿨고(바꿈),
지금 페이지에서 읽었던 값이면 그대로 뒀다(유지).

| 브랜드 | 상품 | 있던 값 | 지금 페이지 | 처리 |
|---|---|---|---|---|
| Club monaco | https://www.clubmonaco.com/products/slim-tuxedo-pant-295101677-100 | Polyester 64% / Viscose 32% / Elastane 4% ‖ Polyester 100% | Polyester 64% / Viscose 32% / Elastane 4% | 유지 |
| Bassike | https://www.bassike.com/products/faded-denim-vest-r26wfj22-super-light-wash | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/techno-twill-athletic-sweat-aw25wft94-marine-blue | Nylon 93% / Elastane 7% | Nylon 93% / Elastane 7% ‖ Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/fleece-cropped-hoodie-pc26wft10-washed-carob | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/wool-zip-pull-over-sweat-aw26wfj43-grey | Wool 60% / Elastane 27% / Nylon 11% / Cotton 97% | Wool 60% / Elastane 27% / Nylon 11% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/fleece-split-detail-sweat-aw26wft42-ecru | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/boxy-pique-polo-knit-r26wk32-pale-yellow | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/collections/women-knitwear-sweaters/products/fleece-cropped-hoodie-pc26wft10-washed-carob | Cotton 100% ‖ Cotton 92% / Elastane 8% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/collections/women-knitwear-sweaters/products/fleece-zip-through-hoodie-aw26mfj06-black | Cotton 98% | Cotton 100% ‖ Cotton 92% / Elastane 8% | 유지 |
| Bassike | https://www.bassike.com/collections/women-knitwear-sweaters/products/techno-twill-athletic-sweat-aw25wft94-marine-blue | Nylon 93% / Elastane 7% | Nylon 93% / Elastane 7% ‖ Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/superfine-crew-neck-knit-ss26wk13-red | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/fine-check-slip-dress-r26wfd173-whiteblacklight-blue | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/check-ecopet-longerline-dress-ss26wfd128-black-taupe-check | Cotton 99% / Polyurethane 1% ‖ Cotton 92% / Elastane 8% | Cotton 99% / Polyurethane 1% | 유지 |
| Bassike | https://www.bassike.com/products/bias-stripe-polo-dress-aw26wjd60-rednavynatural | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/crushed-cotton-peplum-dress-pc26wfd09-chocolate-brown | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/fleece-peplum-hoodie-dress-pc26wft13-washed-black | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-dresses-skirts/products/check-ecopet-longerline-dress-ss26wfd128-black-taupe-check | Cotton 99% / Polyurethane 1% ‖ Cotton 92% / Elastane 8% | Cotton 99% / Polyurethane 1% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-dresses-skirts/products/cotton-popover-dress-ss26wfd29-black | Linen 62% / Viscose 38% | Viscose 62% / Linen 38% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-dresses-skirts/products/crushed-cotton-mini-jumpsuit-ss25wfd131-dark-sage | Cotton 100% / Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-dresses-skirts/products/fleece-peplum-hoodie-dress-pc26wft13-washed-black | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-dresses-skirts/products/fine-check-slip-dress-r26wfd173-whiteblacklight-blue | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/box-pleat-tailored-pant-r27wfb48-black | Viscose 99% / Elastane 1% | Viscose 99% / Elastane 1% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/tailored-longerline-wool-short-ss25wfb192-black | Cotton 100% / Viscose 100% | Wool 100% | 유지 |
| Bassike | https://www.bassike.com/products/relaxed-minimal-pant-r27wfb51-black | Viscose 99% / Elastane 1% | Viscose 99% / Elastane 1% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/tailored-pant-ss26wfb68-black | Polyester 57% / Wool 24% / Viscose 15% / Elastane 4% | Polyester 57% / Wool 24% / Viscose 15% / Elastane 4% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/relaxed-minimal-pant-ss26wfb146-black | Polyester 77% / Viscose 18% / Elastane 5% / Cotton 100% | Polyester 77% / Viscose 18% / Elastane 5% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/wide-leg-gathered-pant-ss26wfb71-black | Polyester 57% / Wool 24% / Viscose 15% / Elastane 4% | Polyester 57% / Wool 24% / Viscose 15% / Elastane 4% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/cotton-twill-barrel-leg-pant-ss24wfb56-chocolate-brown | Cotton 97% / Elastane 3% | Cotton 97% / Elastane 3% ‖ Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/crushed-cotton-layered-pant-pc26wfb89-soft-pink | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/tailored-pant-aw26wfb63-charcoal | Polyester 60% / Wool 22% / Viscose 18% / Cotton 100% | Polyester 60% / Wool 22% / Viscose 18% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/worn-canvas-pleat-pant-aw26wfb02-washed-tan | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/leather-zip-off-pant-aw26wfb22-black | Polyester 100% | Leather 100% ‖ Polyester 100% | 유지 |
| Bassike | https://www.bassike.com/products/pleated-check-pant-aw26wfb30-brown-ink | Wool 65% / Polyester 35% | Wool 65% / Polyester 35% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/pleated-check-short-aw26wfb40-tan-orange | Wool 65% / Polyester 35% | Wool 65% / Polyester 35% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/fleece-barrel-leg-trackpant-aw26wfb04-ecru | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/wide-leg-pant-aw26wfb10-grey | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/tab-detail-twill-pant-aw26wfb11-ecru | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/relaxed-cord-pant-aw26wfb73-dark-brown | Cotton 98% / Elastane 2% | Cotton 98% / Elastane 2% ‖ Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/soft-tailored-pant-pc26wfb23-chocolate-brown | Viscose 50% / Linen 48% / Elastane 2% / Cotton 100% | Viscose 50% / Linen 48% / Elastane 2% ‖ Viscose 59% / Polyester 41% | 유지 |
| Bassike | https://www.bassike.com/products/high-rise-leather-pant-pc26wfb32-black | Leather 100% | Leather 100% ‖ Polyester 95% / Elastane 5% | 유지 |
| Bassike | https://www.bassike.com/products/turned-down-waistband-pant-r26wfb64-black | Viscose 100% / Cotton 100% | Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/products/pull-on-drawstring-pant-pc26wfb39-tan | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/double-twill-wide-leg-pant-pc26wfb42-dark-brown | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/cotton-pique-shorts-r26wk33-pale-yellow | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/cotton-twill-capri-pant-r26wfb180-dusty-pink | Cotton 97% / Elastane 3% | Cotton 97% / Elastane 3% ‖ Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/crushed-cotton-summer-pant-ss25wfb183-black | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/cotton-twill-wide-leg-pant-ss25wfb06-khaki | Cotton 97% / Elastane 3% | Cotton 97% / Elastane 3% ‖ Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/products/crushed-cotton-parachute-pant-pc25wfb52-natural | Cotton 98% | Cotton 100% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-pants-shorts/products/relaxed-minimal-pant-r27wfb51-black | Viscose 99% / Elastane 1% | Viscose 99% / Elastane 1% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-pants-shorts/products/box-pleat-tailored-pant-r27wfb48-black | Viscose 99% / Elastane 1% | Viscose 99% / Elastane 1% ‖ Viscose 100% | 유지 |
| Bassike | https://www.bassike.com/collections/womens-pants-shorts/products/wide-leg-pant-aw26wfb10-grey | Cotton 98% | Cotton 100% | 유지 |

## 브랜드별 표본 — 사람이 열어 확인할 것

채운 것: 이번에 읽은 값 · 출처 · 그 값을 페이지 글에서 다시 찾은 자리(추출기와 따로 찾음 — 못 찾으면 비어 있다).
빈 것: 페이지는 읽었는데 혼용률이 없던 상품(사이트 미표기로 적었을 것). 못 읽음: 막힘·껍데기·값 없음.

### ALC — 채움 0 · 빈 것 5 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://alcltd.com/products/tate-top-lavender-mauve
- ⬜ 빈 것(컬러·가격만) · https://alcltd.com/products/tess-cardigan-off-white
- ⬜ 빈 것(컬러·가격만) · https://alcltd.com/collections/knitwear/products/tess-cardigan-off-white

### Abercrombie & Fitch — 채움 0 · 빈 것 0 · 못 읽음 84

- ⛔ 막힘(fetch,impit) · https://www.abercrombie.com/shop/wd/p/essential-polished-body-skimming-tee-62050821
- ⛔ 막힘(fetch,impit) · https://www.abercrombie.com/shop/wd/p/flutter-sleeve-slash-top-63080819
- ⛔ 막힘(fetch,impit) · https://www.abercrombie.com/shop/wd/p/bra-free-reversible-scoopneck-top-63080321

### Addidas — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘(fetch,impit) · https://www.adidas.com/us/black_friday
- ⛔ 막힘(fetch,impit) · https://www.adidas.com/us/men-trending
- ⛔ 막힘(fetch,impit) · https://www.adidas.com/us/men-prime

### Addison bay — 채움 0 · 빈 것 11 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://addisonbay.com/products/bay-tank?variant=42357032124498
- ⬜ 빈 것(컬러·가격만) · https://addisonbay.com/products/sideline-sweatshirt?variant=42369494220882
- ⬜ 빈 것(컬러·가격만) · https://addisonbay.com/products/active-mesh-scoop-neck-everyday-tank?variant=42357127118930

### Alo — 채움 0 · 빈 것 18 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.aloyoga.com/products/w1404r-alosoft-finesse-tee-white
- ⬜ 빈 것(컬러·가격만) · https://www.aloyoga.com/products/w3747r-cropped-take-me-out-button-up-white
- ⬜ 빈 것(컬러·가격만) · https://www.aloyoga.com/products/w4488r-ribbed-stardust-jacket-black

### American Eagle — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.ae.com/us/en/p/women/jeans/baggy-wide-leg-jeans/ae-low-rise-cozy-baggy-jean/0437_6438_992
- ⬜ 빈 것(컬러·가격만) · https://www.ae.com/us/en/p/women/jeans/baggy-wide-leg-jeans/ae-low-rise-cozy-baggy-jean/0437_6439_896
- ⬜ 빈 것(컬러·가격만) · https://www.ae.com/us/en/p/women/jeans/baggy-wide-leg-jeans/ae-low-rise-cozy-baggy-jean/0437_6440_001

### Ann Taylor — 채움 0 · 빈 것 1 · 못 읽음 27

- ⬜ 빈 것(미표기) · https://www.anntaylor.com/sale/all-sale/cata000055/
- ⛔ 막힘·껍데기 · https://www.anntaylor.com/stylerewards
- ⛔ 막힘·껍데기 · https://www.anntaylor.com/new-arrivals/the-gift-shop/cat4730013/
- ⛔ 막힘·껍데기 · https://www.anntaylor.com/new-arrivals/all-new-arrivals/cata00008/

### Anthropologie — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘(fetch,impit) · https://www.anthropologie.com/shop/pilcro-sequined-twofer-tank
- ⛔ 막힘(fetch,impit) · https://www.anthropologie.com/shop/by-anthropologie-long-sleeve-lace-top
- ⛔ 막힘(fetch,impit) · https://www.anthropologie.com/shop/by-anthropologie-fuzzy-dolman-sleeve-boatneck-top

### Apiece Apart — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.apieceapart.com/products/uri-low-cut-tank
- ⬜ 빈 것(컬러·가격만) · https://www.apieceapart.com/products/cortina-cool-maxi
- ⬜ 빈 것(컬러·가격만) · https://www.apieceapart.com/products/long-sleeve-volta

### Aritzia — 채움 1 · 빈 것 0 · 못 읽음 295

- ✅ https://www.aritzia.com/intl/en/product/carter-blouse/95895.html
  - 값: **Polyester 100%** (보관본 20250119)
  - 페이지 글: 화면 글: …ave a lower environmental impact than their virgin alternatives Materials & Care Content: 100% polyester Care: Machine wash Imported Sustainability Learn more about the sustainability of our products, including how…
- ⛔ 막힘(fetch,impit) · https://www.aritzia.com/intl/en/new
- ⛔ 막힘(fetch,impit) · https://www.aritzia.com/intl/en/clothing/sweaters
- ⛔ 막힘(fetch,impit) · https://www.aritzia.com/intl/en/clothing/coats-jackets

### Arket — 채움 4 · 빈 것 0 · 못 읽음 196

- ✅ https://www.arket.com/en-ww/product/signature-long-sleeve-t-shirt-greenwhite-1252141033/
  - 값: **Cotton 100%** (JSON-LD)
  - 페이지 글: 화면 글: …T-shirts Signature Long-Sleeve T-Shirt Materials and care instructions Composition Shell: Cotton 100% Care Instructions Dry clean Line dry High iron Machine wash at 40° Explore our care section for more informat…
- ✅ https://www.arket.com/en-ww/product/frill-collar-blouse-beige-1309044001/
  - 값: **Cupro 100%** (보관본 20260421)
  - 페이지 글: 화면 글: …40 42 44 Find your size Find in store Add to bag Product details Materials and suppliers Cupro 100% You may also like Relaxed-Fit Poplin Shirt $ 99 Wool-Lyocell Cardigan $ 99 Gathered Blouse $ 99 Relaxed Stand…
- ✅ https://www.arket.com/en-ww/product/silk-blend-blouse-dark-brown-1323869001/
  - 값: **Silk 82% / Nylon 18%** (보관본 20260509)
  - 페이지 글: 화면 글: …L Find your size Find in store Add to bag Product details Materials and suppliers Shell: Silk 82%, Polyamide 18% Binding: Cotton 100% You may also like Sculptural Top $ 69 Silk Dress $ 259 Silk T-Shirt Dress…
- ✅ https://www.arket.com/en-ww/product/peplum-taffeta-top-black-1316231002/
  - 값: **Cotton 60% / Nylon 40% ‖ Cotton 100%** (보관본 20260420)
  - 페이지 글: 화면 글: …40 42 44 Find your size Find in store Add to bag Product details Materials and suppliers Cotton 60%, Polyamide 40% Lining: Cotton 100% You may also like Cocoon Taffeta Dress $ 129 Pintuck Top $ 69 Pintuck Top…
- ⛔ 막힘(fetch,impit) · https://www.arket.com/en-ww/product/wool-rib-top-black-1357865001/
- ⛔ 막힘(fetch,impit) · https://www.arket.com/en-ww/product/heavy-silk-blend-tank-top-black-1370751001/
- ⛔ 막힘(fetch,impit) · https://www.arket.com/en-ww/product/cashmere-hoodie-grey-1352706002/

### Athleta — 채움 0 · 빈 것 37 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=1177319012
- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=659287712
- ⬜ 빈 것(컬러·가격만) · https://athleta.gap.com/browse/product.do?pid=531302002

### Banana Republic — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://bananarepublic.gap.com/browse/product.do?pid=1183114012

### Barbour — 채움 0 · 빈 것 2 · 못 읽음 0

- ⬜ 빈 것(미표기) · https://www.barbour.com/row/zadie-overshirt-LOS0099RE99.html
- ⬜ 빈 것(미표기) · https://www.barbour.com/row/alix-overshirt-LOS0100MI11.html

### Bash — 채움 6 · 빈 것 8 · 못 읽음 0

- ✅ https://ba-sh.com/fr/en/p/shirt-hony-ecru-3667436092756.html
  - 값: **Viscose 100%** (본문)
  - 페이지 글: 화면 글: …viscose in this model is made from wood pulp from sustainably managed forests. Material: 100% VISCOSE Made in: China Hand wash Do not bleach Iron at a maximum temperature of 110&deg;C. Dry clean only Do not tumb…
- ✅ https://ba-sh.com/fr/en/p/shirt-palani-kaki-3667436074219.html
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …ssic collar - Cotton The cotton fibers in this model come from organic farming. Material: 100% COTTON Made in: India Wash at 30&deg;C Do not bleach Iron at a maximum temperature of 110&deg;C. Dry clean only Do n…
- ✅ https://ba-sh.com/fr/en/p/blouse-hope-ecru-3667436092831.html
  - 값: **Viscose 100%** (본문)
  - 페이지 글: 화면 글: …viscose in this model is made from wood pulp from sustainably managed forests. Material: 100% VISCOSE Made in: China Hand wash Do not bleach Iron at a maximum temperature of 110&deg;C. Dry clean only Do not tumb…
- ✅ https://ba-sh.com/fr/en/p/dress-kimia-kaki-3667436072840.html
  - 값: **Viscose 100%** (본문)
  - 페이지 글: 화면 글: …viscose in this model is made from wood pulp from sustainably managed forests. Material: 100% VISCOSE Made in: China Hand wash Do not bleach Iron at a maximum temperature of 110&deg;C. Dry clean only Do not tumb…
- ✅ https://ba-sh.com/fr/en/p/dress-kacy-bleu-3667436072291.html
  - 값: **Viscose 100%** (본문)
  - 페이지 글: 화면 글: …viscose in this model is made from wood pulp from sustainably managed forests. Material: 100% VISCOSE Made in: China Hand wash Do not bleach Iron at a maximum temperature of 110&deg;C. Dry clean only Do not tumb…
- ⬜ 빈 것(미표기) · https://ba-sh.com/us/skirts-shorts/
- ⬜ 빈 것(컬러·가격만) · https://ba-sh.com/us/p/skirt-nolly-terre-3667436096891.html
- ⬜ 빈 것(컬러·가격만) · https://ba-sh.com/fr/en/p/necklace-suzanne-silver-3667436107528.html

### Bassike — 채움 227 · 빈 것 11 · 못 읽음 0

- ✅ https://www.bassike.com/products/cord-shacket-pc26wft48-dark-plum
  - 값: **Cotton 98% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …k utility topstitching Soft washed finish Raised mini cord fabrication with stretch Main: 98% Cotton 2% Spandex Cold machine wash inside out Cycle with like colours Dry in shade Iron on low heat Do not soak or…
- ✅ https://www.bassike.com/products/organic-denim-cropped-shirt-r26wft142-washed-indigo
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …le layered back yoke Wide sleeves Tonal topstitching throughout Organic lightweight denim cotton made in Japan Main: 100% organic cotton Lining: 100% cotton Fabric made in Japan Cold gentle machine wash separately, inside out Dry i…
- ✅ https://www.bassike.com/products/faded-denim-vest-r26wfj22-super-light-wash
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …osures Raw edge armholes and flap detailing Contrast topstitching throughout Vintage-wash 100% organic cotton Fabric made in Japan Cold gentle machine wash separately, inside out Dry in shade Iron on reverse side, low h…
- ✅ https://www.bassike.com/products/stripe-slouch-ls-tshirt-ss25wjt182-blackwhite
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …titch Designed and made in Australia Addison is wearing a size S and is 179cm tall. Main: 100% organic cotton Fabric made in Australia Warm delicate machine wash Cycle with other like colours Wash in a laundry bag Mediu…
- ✅ https://www.bassike.com/products/slouch-circle-tank-r23wjt202-dark-sage
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …n and loop fastening Twisted side seams for asymmetric fit Designed and made in Australia 100% Superfine organic cotton jersey Cold gentle machine wash Cycle with like colours, inside out Separately in a laundry bag Reshape while…
- ⬜ 빈 것(컬러·가격만) · https://www.bassike.com/products/e-gift-card
- ⬜ 빈 것(컬러·가격만) · https://www.bassike.com/products/melange-knit-vest-aw26wk06-black-melange
- ⬜ 빈 것(컬러·가격만) · https://www.bassike.com/products/melange-crew-neck-knit-aw26wk12-black-melange

### Bellerose — 채움 0 · 빈 것 11 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://bellerose.com/products/women-t-shirts-vizsla-stripe-b
- ⬜ 빈 것(컬러·가격만) · https://bellerose.com/products/women-sweatshirts-tallic-combo-a
- ⬜ 빈 것(컬러·가격만) · https://bellerose.com/products/women-sweatshirts-fellow-h-grey

### Beyond yoga — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://beyondyoga.com/products/up-for-it-puff-matte-vest-sea-salt-00acb-0000
- ⬜ 빈 것(컬러·가격만) · https://beyondyoga.com/products/beyond-yoga-digital-gift-card
- ⬜ 빈 것(컬러·가격만) · https://beyondyoga.com/products/solemate-2-5-short-speckle-dot-00ava-0000

### Boden — 채움 2 · 빈 것 0 · 못 읽음 0

- ✅ https://us.boden.com/products/women-erica-lace-top-black-t2229bla
  - 값: **Cotton 71% / Nylon 29%** (본문)
  - 페이지 글: 화면 글: …ze guide Model wears Model is wearing size 4 Model is 6'0 Fabric & care Composition Main: 71% cotton, 29% polyamide Care Machine washable View full details Reviews How we collect reviews How we collect reviews…
- ✅ https://us.boden.com/products/women-pia-ruffle-detail-top-light-lilac-enchanted-springs-t2148pin
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …hip Size guide Model wears Model is wearing size 2 Model is 6'0 Fabric & care Composition 100% cotton Care Machine washable View full details Reviews How we collect reviews How we collect reviews Every review on…

### Buck Mason — 채움 0 · 빈 것 4 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/natural-sea-breeze-linen-coastline-cami
- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/gift
- ⬜ 빈 것(컬러·가격만) · https://www.buckmason.com/products/black-sunset-tuxedo-dress

### CCC — 채움 0 · 빈 것 27 · 못 읽음 2

- ⬜ 빈 것(컬러·가격만) · https://www.crewclothing.co.uk/products/sparkle-scoop-neck-t-shirt-in-dark-green
- ⬜ 빈 것(컬러·가격만) · https://www.crewclothing.co.uk/products/perfect-crew-cotton-slub-tee-in-cherry-red
- ⬜ 빈 것(컬러·가격만) · https://www.crewclothing.co.uk/products/perfect-crew-cotton-slub-tee-in-blue
- ⛔ 막힘·껍데기 · https://www.crewclothing.co.uk/womens/clothing-and-accessories/womens-shirts-and-blouses/woven-cotton-tshirt-blue-wyc019/
- ⛔ 막힘(fetch,impit) · https://www.crewclothing.co.uk/womens/clothing-and-accessories/womens-sweatshirts-hoodies/half-zip-sweat-pink-waaf004/

### Carlhartt — 채움 0 · 빈 것 7 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107742/womens-irvine-loose-ls-logo-t-shirt
- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107973/womens-irvine-loose-ls-pocket-t-shirt
- ⬜ 빈 것(컬러·가격만) · https://www.carhartt.com/product/107869/womens-irvine-relaxed-floral-pocket-t-shirt

### Chico's — 채움 42 · 빈 것 2 · 못 읽음 596

- ✅ https://www.chicos.com/store/product/seamed-ponte-knit-3-4-sleeve-dress/570418072?inseam=regular&sizeType=regular&color=4333&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761369577
  - 값: **Viscose 60% / Nylon 31% / Elastane 9%** (보관본 20260921)
  - 페이지 글: 화면 글: …ands on, Chico's signature double-knit fabric. A-line fit 3/4 sleeved dress. Length: 40". 60% Rayon, 31% Nylon, 9% Spandex. Machine washable. Imported. Shipping & Returns SHARE Reviews and Fit Have a question?…
- ✅ https://www.chicos.com/store/product/faux-leather-ponte-knit-dress/570417754?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761381272
  - 값: **Viscose 65% / Nylon 30% / Elastane 5% ‖ Polyester 100%** (보관본 20260910)
  - 페이지 글: 화면 글: …belted midi dress with a back zipper closure, crew neckline and 3/4 sleeves. Length: 47". 65% Rayon, 30% Nylon, 5% Spandex. Faux leather skirt and accents: 100% Polyester. Machine washable. Imported. Shipping…
- ✅ https://www.chicos.com/store/product/zenergy-upf-mockneck-bungee-dress/570382458?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196535196094
  - 값: **Polyester 86% / Elastane 14%** (보관본 20260722)
  - 페이지 글: 화면 글: …length dress with side bungee detailing, cap sleeves, and snap half placket. Length: 38". 86% Polyester, 14% Spandex. Machine washable. Imported. Shipping & Returns SHARE Reviews and Fit Have a question? Ask and a…
- ✅ https://www.chicos.com/store/product/travelers-printed-3-4-bell-sleeve-dress/570414053?inseam=regular&sizeType=regular&color=3605&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761137282
  - 값: **Acetate 96% / Elastane 4%** (본문)
  - 페이지 글: 페이지 JSON: …hed Naia™ fabric. Classic-fit, boatneck, 3/4 sleeved, pullover dress. Midi length: 44.5". 96% Acetate, 4% Elastane. Machine washable. Imported. ","color":"MEDIEVAL BLUE","sku":"199761137336","brand":{"@type":"Or…
- ✅ https://www.chicos.com/store/product/embellished-denim-knee-length-dress/570414255?inseam=regular&sizeType=regular&color=1303&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761088997
  - 값: **Lyocell 100%** (본문)
  - 페이지 글: 페이지 JSON: …pleat. Soft denim fabric.&nbsp; A-line knee length dress with elbow sleeves. Length: 39". 100% Lenzing TENCEL™ Lyocell. Machine washable. Imported. ","color":"MEDIUM BLUE WASH","sku":"199761089048","brand":{"@type":"Org…
- ⬜ 빈 것(컬러·가격만) · https://www.chicos.com/store/product/jersey-knit-tropical-maxi-dress/570412858?inseam=regular&sizeType=regular&color=3145&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536922920
- ⬜ 빈 것(컬러·가격만) · https://www.chicos.com/store/product/printed-ponte-knit-tank-dress/570412949?inseam=regular&sizeType=regular&color=852&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536950497
- ⛔ 막힘(fetch,impit) · https://www.chicos.com/store/product/animal-cotton-slub-epaulet-detail-3-4-sleeve-tee/570421518?inseam=regular&sizeType=regular&color=001&catId=cat11199293&collectionId=category&parentId=199761614974
- ⛔ 막힘(fetch,impit) · https://www.chicos.com/store/product/cotton-slub-epaulet-detail-3-4-sleeve-tee/570421519?inseam=regular&sizeType=regular&color=1673&catId=cat11199293&collectionId=category&parentId=199761617746
- ⛔ 막힘(fetch,impit) · https://www.chicos.com/store/product/touch-of-cool-layering-tee/570420603?inseam=regular&sizeType=regular&color=6635&catId=cat11199293&collectionId=category&parentId=199761504114

### Citizens of Humanity — 채움 0 · 빈 것 4 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://citizensofhumanity.com/products/miro-relaxed-pant-toasted-caramel
- ⬜ 빈 것(컬러·가격만) · https://citizensofhumanity.com/products/savannah-cigarette-leather-pant-black
- ⬜ 빈 것(컬러·가격만) · https://citizensofhumanity.com/products/jen-straight-leather-pant-black

### Club monaco — 채움 22 · 빈 것 31 · 못 읽음 0

- ✅ https://www.clubmonaco.com/products/high-rise-cropped-twill-pant-295100545-932
  - 값: **Cotton 97% / Elastane 3%** (Shopify JSON)
  - 페이지 글: 화면 글: …5'9" wearing a size 4 Designed for a high-rise, wide-leg silhouette with a cropped length 97% cotton; 3% elastane Relaxed fit with a 26” inseam, 21” leg opening; based on a size 6 Zip fly with button closure Se…
- ✅ https://www.clubmonaco.com/products/full-length-borrem-pant-295101650-100
  - 값: **Polyester 53% / Wool 43% / Elastane 4%** (Shopify JSON)
  - 페이지 글: 화면 글: …apered leg. Picture a laid-back (but still polished) version of your favorite suit pants. 53% polyester; 43% wool; 4% elastane Straight fit with a 32” inseam, 16” leg opening; based on a size M Zip fly with button…
- ✅ https://www.clubmonaco.com/products/kick-crop-pant-295101243-100
  - 값: **Polyester 64% / Viscose 32% / Elastane 4%** (Shopify JSON)
  - 페이지 글: 화면 글: …Model is 5'8.5" wearing a size 4 Designed for a flared silhouette with a cropped length. 64% polyester; 32% viscose; 4% elastane Slim fit with a 26” inseam, 18.5” leg opening; based on a size 6 Zip fly with hook-…
- ✅ https://www.clubmonaco.com/products/cropped-linen-side-tie-pant-295101421-001
  - 값: **Linen 100% ‖ Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …s 5'9.5" wearing a size S Designed for a slight wide-leg silhouette with a cropped length 100% linen; lining: 100% cotton Relaxed fit with a 25" inseam, 26.5” leg opening; based on a size M Ties at sides Cased…
- ✅ https://www.clubmonaco.com/products/borrem-suit-pants-295705517-410
  - 값: **Polyester 48% / Wool 48% / Elastane 4%** (Shopify JSON)
  - 페이지 글: 화면 글: …leg. Picture a laid-back (but still polished) version of your favorite suit pants. Shell: 48% polyester; 48% wool; 4% elastane Straight fit with a 26"regular inseam, 28" long inseam, 14" leg opening; based on a si…
- ⬜ 빈 것(컬러·가격만) · https://www.clubmonaco.com/products/brocade-puff-sleeve-295900347-411
- ⬜ 빈 것(컬러·가격만) · https://www.clubmonaco.com/products/seamed-peplum-top-295875801-402
- ⬜ 빈 것(컬러·가격만) · https://www.clubmonaco.com/products/pareo-491874042-030

### Coldwatercreek — 채움 0 · 빈 것 128 · 못 읽음 1

- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/wintertide-waffle-tee/22279/
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/snowflake-tapestry-burnout-tee/26140/
- ⬜ 빈 것(컬러·가격만) · https://www.coldwatercreek.com/follow-your-heart-tunic/22475/
- ⛔ 막힘·껍데기 · https://www.coldwatercreek.com/sale/best-sellers-on-sale

### Cotton citizen — 채움 0 · 빈 것 27 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://cottoncitizen.com/products/seoul-scoop-tank-white
- ⬜ 빈 것(컬러·가격만) · https://cottoncitizen.com/products/seoul-half-sleeve-tee-vintage-black
- ⬜ 빈 것(컬러·가격만) · https://cottoncitizen.com/products/seoul-muscle-tee-vintage-burgundy

### Cotton on — 채움 0 · 빈 것 2 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://cottonon.com/US/ford-raglan-tiny-tee/2062265-03.html
- ⬜ 빈 것(컬러·가격만) · https://cottonon.com/US/estelle-satin-lace-cami/2061283-02.html

### Damson Madder — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://damsonmadder.com/products/lemi-sheer-blouse-multi-check
- ⬜ 빈 것(컬러·가격만) · https://damsonmadder.com/en-us/products/lemi-sheer-blouse-multi-check
- ⬜ 빈 것(미표기) · https://damsonmadder.com/en-us/products/damson-madder-gift-card

### Draper James — 채움 0 · 빈 것 9 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://draperjames.com/products/cardigan-3
- ⬜ 빈 것(컬러·가격만) · https://draperjames.com/products/horse-sweater
- ⬜ 빈 것(컬러·가격만) · https://draperjames.com/products/long-sleeve-top-in-bateau-knit

### Eddie bauer — 채움 0 · 빈 것 16 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.eddiebauer.com/products/wr-departure-crew-neck-tank-eb001073w
- ⬜ 빈 것(컬러·가격만) · https://www.eddiebauer.com/products/luxe-soft-hoodie-eb001337w
- ⬜ 빈 것(컬러·가격만) · https://www.eddiebauer.com/products/eddie-bauer-sage-hoodie-with-accent-trim-sage-green

### Eileen fisher — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘(fetch,impit) · https://www.eileenfisher.com/a-sustainable-life
- ⛔ 막힘(fetch,impit) · https://www.eileenfisher.com/a-sustainable-life/journal.html
- ⛔ 막힘(fetch,impit) · https://www.eileenfisher.com/a-sustainable-life/first-life.html

### Evereve — 채움 12 · 빈 것 14 · 못 읽음 0

- ✅ https://evereve.com/products/ponte-knit-wide-leg-pant-black
  - 값: **Viscose 68% / Nylon 27% / Elastane 5%** (본문)
  - 페이지 글: 화면 글: …ength: Full Front Rise: 11" Inseam Length: 31" Leg Opening: 31" Material & Care Material: 68% Viscose, 27% Nylon, 5% Spandex Ponte Knit Care: Hand Wash,Dry Flat Style #: 1605 Size Guide Tops & Dresses Extra Smal…
- ✅ https://evereve.com/products/jenny-pleated-culotte-pant-stargazer
  - 값: **Hemp 31% / Cotton 29% / Polyester 23% / Viscose 15% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …rop Front Rise: 11 3/4" Inseam Length: 27" Leg Opening: 26 1/4" Material & Care Material: 31% Hemp, 29% Cotton, 23% Polyester, 15% Viscose, 2% Spandex Woven Care: Machine Wash,Wash Cold,Delicate / Gentle Cycl…
- ✅ https://evereve.com/products/scout-knit-striped-pant-ashblack
  - 값: **Cotton 66% / Polyester 21% / Viscose 13%** (본문)
  - 페이지 글: 화면 글: …Rise: High Length: Ankle Front Rise: 11 1/2" Inseam Length: 26" Material & Care Material: 66% Cotton, 21% Polyester, 13% Rayon Knit Care: Machine Wash,Delicate / Gentle Cycle,Dry Flat,Iron Low Style #: ZP262589…
- ✅ https://evereve.com/products/sabrina-utility-pant-lindt
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …Front Rise: 11 1/4" Inseam Length: 26 1/2" Leg Opening: 17 1/2" Material & Care Material: 100% Cotton Non-stretch Twill Care: Wash Cold,Tumble Dry Low Style #: P00116105-SL-L Size Guide Tops & Dresses Extra Smal…
- ✅ https://evereve.com/products/theo-poplin-pant-hottoddy
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …: Ankle Front Rise: 12" Inseam Length: 26" Leg Opening: 19 1/2" Material & Care Material: 100% Cotton Poplin Care: Wash Cold,Tumble Dry Low Style #: P00116021-WR Size Guide Tops & Dresses Extra Small 0-2 Small 4…
- ⬜ 빈 것(컬러·가격만) · https://evereve.com/products/karli-long-sleeve-twofer-tee-heathergrey
- ⬜ 빈 것(컬러·가격만) · https://evereve.com/products/shelia-top-heathergrey
- ⬜ 빈 것(컬러·가격만) · https://evereve.com/products/mel-stripe-side-pleat-tee-white-blue

### Everlane — 채움 0 · 빈 것 119 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-city-stripe-ruched-dress-haute-red
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-100-my-body-box-cut-tee-white
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-full-zip-hoodie-in-wool-cashmere-oatmeal

### FP Movement — 채움 8 · 빈 것 1 · 못 읽음 49

- ✅ https://www.freepeople.com/fpmovement/shop/tennis-ringer-tee/
  - 값: **Cotton 100%** (보관본 20260809)
  - 페이지 글: 화면 글: …tless ease. Fit: Relaxed, boxy fit; crew neckline; slightly cropped silhouette. Features: 100% cotton fabrication; relaxed, easy silhouette; crew neckline; contrasting seams; charming tennis graphic with the bra…
- ✅ https://www.freepeople.com/fpmovement/shop/never-better-printed-reversible-twist-crop2/
  - 값: **Nylon 79% / Elastane 21%** (보관본 20260813)
  - 페이지 글: 화면 글: …+ Fit Measurements Bust: 26 in Length: 10.75 in Contents Care Machine Wash Cold Contents 79% Nylon, 21% Elastane Origin Import Shipping, In-Store Pickup, Returns Shipping Free Standard Shipping to US, Austral…
- ✅ https://www.freepeople.com/fpmovement/shop/shortcut-pullover/
  - 값: **Cotton 100%** (보관본 20260812)
  - 페이지 글: 화면 글: …Our Non-Profit Partner Girls Inc. ♡ Learn more. Contents Care Machine Wash Cold Contents 100% Cotton Origin Import Shipping, In-Store Pickup, Returns Shipping Free Standard Shipping to US, Australia, Canada ord…
- ✅ https://www.freepeople.com/fpmovement/shop/a-cut-above-flocked-buti-logo-hoodie/
  - 값: **Cotton 100%** (보관본 20251002)
  - 페이지 글: 화면 글: …or the perfect finishing touch. Fit: Slouchy, boxy fit Features: Ultra-luxe, heavyweight, 100% cotton fabrication; structured style; oversized silhouette; classic hood; defined seaming; exaggerated sleeves; thum…
- ✅ https://www.freepeople.com/fpmovement/shop/vixen-long-sleeve-layer/
  - 값: **Nylon 92% / Elastane 8%** (보관본 20251230)
  - 페이지 글: 화면 글: …Our Non-Profit Partner Girls Inc. ♡ Learn more. Contents Care Machine Wash Cold Contents 92% Nylon, 8% Elastane Origin Import Shipping, In-Store Pickup, Returns US Shipping Please visit our shipping page to v…
- ⬜ 빈 것(미표기) · https://itunes.apple.com/us/app/free-people/id659532790
- ⛔ 막힘(fetch,impit) · https://www.freepeople.com/fpmovement/performance-tops/
- ⛔ 막힘(fetch,impit) · https://www.freepeople.com/fpmovement/casual-tops/
- ⛔ 막힘(fetch,impit) · https://www.freepeople.com/fpmovement/100-percent-cotton-activewear-curation/

### Faherty — 채움 0 · 빈 것 5 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://fahertybrand.com/products/legend-sweater-rugby-popover-pacific-ride-stripe
- ⬜ 빈 것(컬러·가격만) · https://fahertybrand.com/products/copy-of-faherty-e-gift-card-good-vibes-for-all
- ⬜ 빈 것(컬러·가격만) · https://fahertybrand.com/products/sophia-smocked-skirt-navy-lotus-floral

### Fatface — 채움 19 · 빈 것 0 · 못 읽음 325

- ✅ https://www.fatface.com/style/su790022/h69671
  - 값: **Body 67% / Recycled Polyester 33% / Rib 98% / Elastane 2%** (보관본 20260606)
  - 페이지 글: 화면 글: …Model is 5'9''/175cm tall and wears size 8 Read More Product Code: H69-671 Care & Fabric Body 67% Cotton, 33% Recycled polyester. Rib 98% Cotton, 2% Elastane. Machine washable. Price History Date Price April…
- ✅ https://www.fatface.com/style/sv044416/w74630
  - 값: **Cotton 100%** (보관본 20260519)
  - 페이지 글: 화면 글: …Model is 5'9''/175cm tall and wears size 8 Read More Product Code: W74-630 Care & Fabric 100% Cotton. Machine washable. Discover More All Sweatshirts & Hoodies Jumpers T-Shirts Jeans Recently Viewed You need to…
- ✅ https://www.fatface.com/style/su396877/e79229
  - 값: **Cotton 100%** (보관본 20260216)
  - 페이지 글: 화면 글: …Thea half neck, featuring handy zip pockets, an adjustable quarter-zip neck and made from 100% cotton, she is the ultimate comfy and cosy staple for your wardrobe. Whether you&#x27;re taking the dogs for a walk…
- ✅ https://www.fatface.com/style/su962327/v24254
  - 값: **Cotton 100%** (보관본 20260614)
  - 페이지 글: 화면 글: …ars size 8 Model is 5'9''/175cm tall and wears size 8 Product Code: V24-254 Care & Fabric 100% Cotton. Machine washable. Discover More All Sweatshirts & Hoodies Jumpers T-Shirts Jeans Recently Viewed You need to…
- ✅ https://www.fatface.com/style/su613095/f22968
  - 값: **Polyester 100%** (보관본 20250821)
  - 페이지 글: 화면 글: …del is 5'8''/173cm and wears UK size 8 Read More Product Code: F22-968 Care & Fabric Body 100% Polyester. Trim 100% Cotton. Machine washable. Reviews No product reviews have been submitted as of yet. Recently Viewe…
- ⛔ 막힘(fetch,impit) · https://www.fatface.com/style/su990707/y56442
- ⛔ 막힘(fetch,impit) · https://www.fatface.com/style/su990707/g78330
- ⛔ 막힘(fetch,impit) · https://www.fatface.com/style/sv022065/v60690

### Frame — 채움 0 · 빈 것 13 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://frame-store.com/products/the-classic-tee
- ⬜ 빈 것(컬러·가격만) · https://frame-store.com/products/le-mid-rise-v-tee
- ⬜ 빈 것(컬러·가격만) · https://frame-store.com/products/the-silk-arcadia-top

### Frank & Eileen — 채움 0 · 빈 것 17 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.frankandeileen.com/products/ireland-dress-1984-wash-italian-dream-light-denim
- ⬜ 빈 것(컬러·가격만) · https://www.frankandeileen.com/products/ireland-dress-1981-wash-italian-dream-light-denim
- ⬜ 빈 것(컬러·가격만) · https://www.frankandeileen.com/products/ireland-dress-1968-wash-italian-dream-light-denim

### Free People — 채움 6 · 빈 것 0 · 못 읽음 163

- ✅ https://www.freepeople.com/shop/we-the-free-clean-rugby-tee/
  - 값: **Cotton 100%** (보관본 20260523)
  - 페이지 글: 화면 글: …st: 53 in Length: 21.5 in Sleeve Length: 6.75 in Contents Care Machine Wash Cold Contents 100% Cotton Origin Import Shipping, In-Store Pickup, Returns US Shipping Please visit our shipping page to view Shipping…
- ✅ https://www.freepeople.com/shop/fp-one-blake-graphic-thermal/
  - 값: **Cotton 100%** (보관본 20251202)
  - 페이지 글: 화면 글: …l batch, hand dyed, and hand embellished styles. Contents Care Machine Wash Cold Contents 100% Cotton Origin Import Shipping, In-Store Pickup, Returns US Shipping Please visit our shipping page to view Shipping…
- ✅ https://www.freepeople.com/shop/we-the-free-perfect-oversized-long-sleeve-top/
  - 값: **Cotton 100%** (보관본 20260811)
  - 페이지 글: 화면 글: …t: 46 in Length: 27.25 in Sleeve Length: 21.5 in Contents Care Machine Wash Cold Contents 100% Cotton Origin Import Shipping, In-Store Pickup, Returns Shipping Free Standard Shipping to US, Australia, Canada ord…
- ✅ https://www.freepeople.com/shop/we-the-free-graphic-camden-pullover/
  - 값: **Polyester 49% / Cotton 51%** (보관본 20261028)
  - 페이지 글: 화면 글: …in Length: 27.25 in Sleeve Length: 15 in Care + Contents Care Machine Wash Cold Contents 49% Polyester, 51% Cotton, Rib: 100% Cotton Origin Import Shipping, In-Store Pickup, Returns Shipping Free Standard Shippin…
- ✅ https://www.freepeople.com/shop/loveshackfancy-ciela-top/
  - 값: **Cotton 100%** (보관본 20260810)
  - 페이지 글: 화면 글: …nd-dyed fabrics and vintage-inspired floral prints. Contents Care Hand Wash Cold Contents 100% Cotton Origin Import Shipping, In-Store Pickup, Returns Shipping Free Standard Shipping to US, Australia, Canada ord…
- ⛔ 막힘(fetch,impit) · https://www.freepeople.com/shop/we-the-free-nolan-swit/
- ⛔ 막힘(fetch,impit) · https://www.freepeople.com/shop/anora-long-sleeve-top/
- ⛔ 막힘(fetch,impit) · https://www.freepeople.com/shop/we-the-free-on-your-side-asymmetric-thermal/

### Gap — 채움 0 · 빈 것 68 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=903064042
- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=853419142
- ⬜ 빈 것(컬러·가격만) · https://www.gap.com/browse/product.do?pid=1180261132

### Garnet hill — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘(fetch,impit) · https://www.garnethill.com/holiday-gifts/shops/cashmere-gifts/
- ⛔ 막힘(fetch,impit) · https://www.garnethill.com/holiday-gifts/shops/gifts-for-kids/
- ⛔ 막힘(fetch,impit) · https://www.garnethill.com/holiday-gifts/shops/gifts-for-him/

### Gerard darel — 채움 0 · 빈 것 2 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://gerarddarel.com/en-us/products/chemisier-top-lora_dec69e1201301
- ⬜ 빈 것(컬러·가격만) · https://gerarddarel.com/en-us/products/robe-cassy_der66e1209100

### Gestuz — 채움 0 · 빈 것 24 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.gestuz.com/en-us/gzchaela-leather-top--10911604-100017
- ⬜ 빈 것(컬러·가격만) · https://www.gestuz.com/en-us/gzestha-blouse--10911567-100017
- ⬜ 빈 것(컬러·가격만) · https://www.gestuz.com/en-us/gzsaily-blouse--10911373-191106

### Good American — 채움 0 · 빈 것 72 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.goodamerican.com/products/boatneck-tank-black001
- ⬜ 빈 것(컬러·가격만) · https://www.goodamerican.com/products/the-scalloped-lace-top-black
- ⬜ 빈 것(컬러·가격만) · https://www.goodamerican.com/products/always-fits-good-petite-bootcut-jeans-indigo446

### Greyson — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://greysonclothiers.com/products/rise-ai-giftcard
- ⬜ 빈 것(컬러·가격만) · https://greysonclothiers.com/products/color-block-leo-dress-1
- ⬜ 빈 것(컬러·가격만) · https://greysonclothiers.com/products/hera-dress

### Gymshark — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://row.gymshark.com/products/gymshark-everyday-seamless-leggings-leggings-brown-aw26

### H&M — 채움 0 · 빈 것 0 · 못 읽음 2

- ⛔ 막힘(fetch,impit) · https://www2.hm.com/en_us/productpage.1370459002.html
- ⛔ 막힘(fetch,impit) · https://www2.hm.com/en_us/productpage.1351503001.html

### Hobbs — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.hobbs.com/us/product/nadia-knitted-dress/0226-9219-1085L00-BLACK.html

### J crew — 채움 0 · 빈 것 24 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.jcrew.com/shop/party-dressing
- ⬜ 빈 것(컬러·가격만) · https://www.jcrew.com/m/womens/categories/clothing/dresses-and-jumpsuits/wool-rollnecktrade-sweater-dress/MQ462
- ⬜ 빈 것(컬러·가격만) · https://www.jcrew.com/m/womens/categories/clothing/dresses-and-jumpsuits/wool-fair-isle-rollnecktrade-sweater-dress/MQ462

### J.jill — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.jjill.com/product/pure-jill-beaded-embroidered-top-357841?color=13V
- ⬜ 빈 것(컬러·가격만) · https://www.jjill.com/product/satin-pleated-maxi-dress-304111?color=780
- ⬜ 빈 것(컬러·가격만) · https://www.jjill.com/product/satin-wide-leg-pants-360831?color=ETI

### J.mclaughlin — 채움 0 · 빈 것 43 · 못 읽음 2

- ⬜ 빈 것(컬러·가격만) · https://www.jmclaughlin.com/products/amory-suede-maxi-dress-solid-dk-brown
- ⬜ 빈 것(컬러·가격만) · https://www.jmclaughlin.com/products/cally-silk-blend-dress-heritage-paisley-wine-purple-orange
- ⬜ 빈 것(컬러·가격만) · https://www.jmclaughlin.com/products/eliza-velvet-belt-solid-cabernet
- ⛔ 막힘(fetch,impit) · https://www.jmclaughlin.com/products/norie-silk-blend-blouse-mini-deco-bloom-blue-aqua
- ⛔ 막힘(fetch,impit) · https://www.jmclaughlin.com/products/norie-silk-blend-blouse-mythic-geo-border-white-green

### Jager — 채움 0 · 빈 것 12 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.marksandspencer.com/relaxed-fit-crew-neck-side-split-top/p/clp61266967?color=IVORY#intid=pid_pg1pip40g2r6c2%7Cprodflag_Just%20Arrived
- ⬜ 빈 것(컬러·가격만) · https://www.marksandspencer.com/lyocell-blend-collared-top-with-wool/p/clp61233390?color=BLACK#intid=pid_pg1pip48g2r18c2
- ⬜ 빈 것(컬러·가격만) · https://www.marksandspencer.com/sparkly-crew-neck-slim-fit-knitted-top/p/clp61248268?color=GREENMIX#intid=pid_pg1pip48g2r23c2%7Cprodflag_20%25%20off

### James Perse — 채움 0 · 빈 것 2 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.jamesperse.com/products/gift-card
- ⬜ 빈 것(컬러·가격만) · https://www.jamesperse.com/products/suede-shearling-vest-caramel-wsha2700

### Jigsaw — 채움 5 · 빈 것 0 · 못 읽음 0

- ✅ https://www.jigsaw-online.com/products/ribbed-henley-vest-white
  - 값: **Cashmere 100%** (본문)
  - 페이지 글: 화면 글: …rs Heels All Accessories Scarves Gifting Show submenu for &quot;Gifting&quot; All Gifting 100% Cashmere Gifts Grand Gestures Gifting Accessories Jewellery Gifts Gifts Under £50 Gifts Under £150 Discover Show subme…
- ✅ https://www.jigsaw-online.com/products/metallic-scoop-tank-bronze
  - 값: **Cashmere 100%** (본문)
  - 페이지 글: 화면 글: …rs Heels All Accessories Scarves Gifting Show submenu for &quot;Gifting&quot; All Gifting 100% Cashmere Gifts Grand Gestures Gifting Accessories Jewellery Gifts Gifts Under £50 Gifts Under £150 Discover Show subme…
- ✅ https://www.jigsaw-online.com/products/cotton-90s-rib-tank-brown
  - 값: **Cashmere 100%** (본문)
  - 페이지 글: 화면 글: …rs Heels All Accessories Scarves Gifting Show submenu for &quot;Gifting&quot; All Gifting 100% Cashmere Gifts Grand Gestures Gifting Accessories Jewellery Gifts Gifts Under £50 Gifts Under £150 Discover Show subme…
- ✅ https://www.jigsaw-online.com/products/metallic-rib-cardigan-bronze
  - 값: **Cashmere 100%** (본문)
  - 페이지 글: 화면 글: …rs Heels All Accessories Scarves Gifting Show submenu for &quot;Gifting&quot; All Gifting 100% Cashmere Gifts Grand Gestures Gifting Accessories Jewellery Gifts Gifts Under £50 Gifts Under £150 Discover Show subme…
- ✅ https://www.jigsaw-online.com/products/ombre-tiered-tank-dress-navy
  - 값: **Cashmere 100%** (본문)
  - 페이지 글: 화면 글: …rs Heels All Accessories Scarves Gifting Show submenu for &quot;Gifting&quot; All Gifting 100% Cashmere Gifts Grand Gestures Gifting Accessories Jewellery Gifts Gifts Under £50 Gifts Under £150 Discover Show subme…

### Joules — 채움 0 · 빈 것 0 · 못 읽음 333

- ⛔ 막힘(fetch,impit) · https://www.joules.com/shop/womens/clothing/tops/t-shirts
- ⛔ 막힘(fetch,impit) · https://www.joules.com/shop/womens/clothing/tops/rugby-shirts
- ⛔ 막힘(fetch,impit) · https://www.joules.com/shop/womens/clothing/tops/f/pattern-stripe

### L.L bean — 채움 0 · 빈 것 8 · 못 읽음 0

- ⬜ 빈 것(미표기) · https://global.llbean.com/llb/shop/509870/
- ⬜ 빈 것(미표기) · https://global.llbean.com/llb/shop/507087
- ⬜ 빈 것(미표기) · https://global.llbean.com/llb/shop/507074

### LNA — 채움 0 · 빈 것 2 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.lnaclothing.com/products/naomi-cardigan-w-shawl-burgundy
- ⬜ 빈 것(컬러·가격만) · https://www.lnaclothing.com/collections/hoodies-sweatshirts/products/naomi-cardigan-w-shawl-burgundy

### La Ligne — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://lalignenyc.com/products/suede-colby-pant-chocolate
- ⬜ 빈 것(컬러·가격만) · https://lalignenyc.com/products/suede-colby-pant-navy
- ⬜ 빈 것(컬러·가격만) · https://lalignenyc.com/products/suede-colby-pant-blue-grey

### Lands end — 채움 0 · 빈 것 0 · 못 읽음 58

- ⛔ 막힘(fetch,impit) · https://www.landsend.com/shop/sale/S-ytq-xec
- ⛔ 막힘(fetch,impit) · https://www.landsend.com/shop/-/S-17jp-xec
- ⛔ 막힘(fetch,impit) · https://www.landsend.com/shop/kids/S-yuh-xec

### Leset — 채움 0 · 빈 것 33 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://leset.com/products/the-margo-2-pack-white
- ⬜ 빈 것(컬러·가격만) · https://leset.com/products/margo2packwhiteblack
- ⬜ 빈 것(컬러·가격만) · https://leset.com/products/the-margo-long-sleeve-2-pack-white-white

### Lilla P — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://lillap.com/products/digital-gift-card

### Loft — 채움 0 · 빈 것 19 · 못 읽음 368

- ⬜ 빈 것(미표기) · https://www.loft.com/clothing/tops/catl000011/everyday-v-neck-tee/580224.html
- ⬜ 빈 것(미표기) · https://www.loft.com/clothing/tops/catl000011/lou-grey-scubasoft-v-neck-tank-top/779994.html
- ⬜ 빈 것(미표기) · https://www.loft.com/clothing/tops/catl000011/loft-versa-360-knit-square-neck-tank-top/777622.html
- ⛔ 막힘·껍데기 · https://www.loft.com/new-arrivals/all-new-arrivals/catl00009/
- ⛔ 막힘·껍데기 · https://www.loft.com/gifts/shop-all-gifts/cat3860003/
- ⛔ 막힘·껍데기 · https://www.loft.com/clothing/sweaters/catl000012/

### Madewell — 채움 0 · 빈 것 8 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.madewell.com/kr/womens/shoes/
- ⬜ 빈 것(컬러·가격만) · https://www.madewell.com/kr/mens/shoes/
- ⬜ 빈 것(컬러·가격만) · https://www.madewell.com/womens/clothing/jeans/

### Marine Layer — 채움 0 · 빈 것 9 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.marinelayer.com/products/millie-wool-blouse
- ⬜ 빈 것(컬러·가격만) · https://www.marinelayer.com/collections/gals-tops-buttondowns/products/millie-wool-blouse
- ⬜ 빈 것(컬러·가격만) · https://www.marinelayer.com/collections/gals-tops-buttondowns/products/millie-wool-blouse-1

### Massimo Dutti — 채움 0 · 빈 것 0 · 못 읽음 218

- ⛔ 막힘(fetch,impit) · https://www.massimodutti.com/us/striped-henley-knit-tshirt-l06853106
- ⛔ 막힘(fetch,impit) · https://www.massimodutti.com/us/buttoned-henley-tshirt-l06863575
- ⛔ 막힘(fetch,impit) · https://www.massimodutti.com/us/cotton-blend-bib-detail-tshirt-l06615918

### Me+Em — 채움 0 · 빈 것 4 · 못 읽음 1

- ⬜ 빈 것(컬러·가격만) · https://www.meandem.com/us/luxe-boxy-t-shirt-cigaro-brown
- ⬜ 빈 것(컬러·가격만) · https://www.meandem.com/us/luxe-boxy-t-shirt-navy
- ⬜ 빈 것(컬러·가격만) · https://www.meandem.com/us/blazer-dress-black
- ⛔ 막힘·껍데기 · https://www.meandem.com/us/sign-up

### Michael Stars — 채움 0 · 빈 것 26 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.michaelstars.com/products/amari-tank-ws001
- ⬜ 빈 것(컬러·가격만) · https://www.michaelstars.com/products/illana-crochet-tank-top-cro008s
- ⬜ 빈 것(컬러·가격만) · https://www.michaelstars.com/products/marlow-striped-tee-sj002

### Mint velvet — 채움 31 · 빈 것 14 · 못 읽음 0

- ✅ https://mintvelvet.com/products/brown-satin-halter-maxi-dress
  - 값: **Viscose 100% ‖ Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 100% viscose,lining, 100% polyester " ,"text_alignment": "left" ,"override_color_options": false ,"text_colour": "rgba(0,0…
- ✅ https://mintvelvet.com/products/burgundy-velvet-floral-midi-dress
  - 값: **Elastane 15% / Nylon 48% / Polyester 37% ‖ Elastane 14% / Polyester 86%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 15% elastane, 48% polyamide, 37% polyester,lining, 14% elastane, 86% polyester " ,"text_alignment": "left" ,"override_colo…
- ✅ https://mintvelvet.com/products/black-sequin-mini-dress-1
  - 값: **Polyester 95% / Elastane 5% ‖ Elastane 3% / Polyester 97%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 95% recycled polyester, 5% elastane,lining, 3% elastane, 97% polyester " ,"text_alignment": "left" ,"override_color_options": false…
- ✅ https://mintvelvet.com/products/gold-satin-maxi-dress
  - 값: **Viscose 100% ‖ Polyester 100%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 100% viscose,lining, 100% polyester " ,"text_alignment": "left" ,"override_color_options": false ,"text_colour": "rgba(0,0…
- ✅ https://mintvelvet.com/products/burgundy-lace-blazer-mini-dress
  - 값: **Lyocell 6% / Cotton 28% / Nylon 45% / Viscose 21% ‖ Elastane 3% / Polyester 97%** (본문)
  - 페이지 글: 페이지 JSON: …s": "", "custom_data": {}, "type": "@theme", "settings": {"content": " Composition: Main, 6% lyocell, 28% cotton, 45% polyamide, 21% viscose,lining, 3% elastane, 97% polyester,base, 100% polyester " ,"text_alig…
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/black-lace-mandarin-collar-cardigan
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/mv-gift-card
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/burgundy-swan-print-shirt

### Monrow — 채움 0 · 빈 것 15 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.monrow.com/products/brushed-thermal-color-block-raglan-1
- ⬜ 빈 것(컬러·가격만) · https://www.monrow.com/products/vintage-fleece-half-zip-sweatshirt
- ⬜ 빈 것(컬러·가격만) · https://www.monrow.com/products/supersoft-zip-up-hoody-dark-heather

### Monsoon — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.monsoonlondon.com/us/penny-long-sleeve-pleated-midi-dress-teal-10081000174.html

### Nike — 채움 0 · 빈 것 28 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.nike.com/t/victory-womens-dri-fit-short-flouncy-tennis-skirt-0SDyNPZH/FD5577-407
- ⬜ 빈 것(컬러·가격만) · https://www.nike.com/t/swim-womens-layered-tankini-5pla6C4q/NESSG311-440
- ⬜ 빈 것(컬러·가격만) · https://www.nike.com/t/swim-womens-layered-tankini-plus-size-Ou3Bg221/NESSG338-001

### Ninety Percent — 채움 0 · 빈 것 2 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://ninetypercent.com/products/hayden-henley-top-in-chalk-aw26
- ⬜ 빈 것(컬러·가격만) · https://ninetypercent.com/collections/womens-sustainable-t-shirts-and-tops/products/hayden-henley-top-in-chalk-aw26

### Oak + Fort — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://oakandfort.ca/products/polka-dot-halter-neck-top-wt-15889-w

### Oasis — 채움 0 · 빈 것 26 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.oasisfashion.com/product/dsgn-studio-dsgn-studio-stripe-applique-oversized-hoodie_xtt02400?colour=deep+berry
- ⬜ 빈 것(컬러·가격만) · https://www.oasisfashion.com/product/dsgn-studio-dsgn-studio-applique-oversized-half-zip-sweatshirt_xtt02494?colour=ash+grey
- ⬜ 빈 것(컬러·가격만) · https://www.oasisfashion.com/product/dsgn-studio-dsgn-studio-loopback-funnel-neck-zip-through-sweatshirt_xtt02312?colour=light+pink

### Old Navy — 채움 0 · 빈 것 7 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://oldnavy.gap.com/browse/product.do?pid=916674022
- ⬜ 빈 것(컬러·가격만) · https://oldnavy.gap.com/browse/product.do?pid=1186791012
- ⬜ 빈 것(컬러·가격만) · https://oldnavy.gap.com/browse/product.do?pid=916674002

### On — 채움 0 · 빈 것 3 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.on.com/en-us/products/cyclon-t-891/womens/undyed-white-apparel-891.01244
- ⬜ 빈 것(컬러·가격만) · https://www.on.com/en-us/products/weather-pants-w-1wg3082/womens/black-apparel-1WG30820553
- ⬜ 빈 것(컬러·가격만) · https://www.on.com/en-us/products/weather-pants-w-1wg3082/womens/hare-brume-apparel-1WG30824953

### Outdoorvoices — 채움 0 · 빈 것 9 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.outdoorvoices.com/products/w-thinkfast-jersey-baby-tee-aura
- ⬜ 빈 것(컬러·가격만) · https://www.outdoorvoices.com/products/w-thinkfast-jersey-baby-tee-black
- ⬜ 빈 것(컬러·가격만) · https://www.outdoorvoices.com/products/doing-things-hoodie-black

### Oysho — 채움 0 · 빈 것 0 · 못 읽음 18

- ⛔ 막힘(fetch,impit) · https://www.oysho.com/gb/womens-base-layer-n5063
- ⛔ 막힘(fetch,impit) · https://www.oysho.com/gb/womens-sports-tank-tops-n4770
- ⛔ 막힘(fetch,impit) · https://www.oysho.com/gb/comfortlux-tops-n5686

### Patagonia — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘·껍데기 · https://www.patagonia.com/product/womens-i-voted-sticker-easy-cut-tee/37364.html
- ⛔ 막힘·껍데기 · https://www.patagonia.com/product/womens-in-spired-easy-cut-tee/37366.html
- ⛔ 막힘·껍데기 · https://www.patagonia.com/product/womens-long-sleeved-capilene-cool-merino-blend-shirt/44555.html

### Phase eight — 채움 0 · 빈 것 15 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.phase-eight.com/row/product/novie-burgundy-satin-shirt-10013970250.html
- ⬜ 빈 것(컬러·가격만) · https://www.phase-eight.com/row/product/danica-satin-drape-top-502497250.html
- ⬜ 빈 것(컬러·가격만) · https://www.phase-eight.com/row/product/chrissy-short-sleeve-blouse-10005310055.html

### Poetry — 채움 0 · 빈 것 8 · 못 읽음 0

- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poest/shirts-and-tunics
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poeds/dresses-and-skirts
- ⬜ 빈 것(미표기) · https://www.poetryfashion.co.uk/poetj/trousers

### Prana — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘(fetch,impit) · https://www.prana.com/p/moonvale-short-sleeve-top/2162831.html?dwvar_2162831_color=Dawn
- ⛔ 막힘(fetch,impit) · https://www.prana.com/p/mountain-maven-denim-shirt/2163521.html?dwvar_2163521_color=Blue%20Denim
- ⛔ 막힘(fetch,impit) · https://www.prana.com/p/everyday-daisy-crop-tee/2178941.html?dwvar_2178941_color=Glacier%20Skies

### Project Social T — 채움 0 · 빈 것 22 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.projectsocialt.com/products/the-flirt-polo-heather-grey
- ⬜ 빈 것(컬러·가격만) · https://www.projectsocialt.com/products/zadie-ivory-striped-tee-ivory-navy
- ⬜ 빈 것(컬러·가격만) · https://www.projectsocialt.com/products/osper-ivory-textured-stripe-tee-ivory-navy

### Rails — 채움 1 · 빈 것 40 · 못 읽음 0

- ✅ https://www.rails.com/products/beckley-sweatshirt-sunshine
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …ench terry sweatshirt with dropped shoulders, ribbed trim, and soutached suns throughout. 100% Cotton Imported. FIT Recommend ordering true to size. Front Body Length: 24″ (Measured from size S.)…
- ⬜ 빈 것(컬러·가격만) · https://www.rails.com/products/alixa-top-onyx-blurred-floral
- ⬜ 빈 것(컬러·가격만) · https://www.rails.com/products/kaleen-top-navy
- ⬜ 빈 것(컬러·가격만) · https://www.rails.com/products/matilda-cardigan-black

### Sanctuary — 채움 12 · 빈 것 2 · 못 읽음 0

- ✅ https://www.sanctuaryclothing.com/products/places-to-be-knit-track-jacket-green-juice-chalk
  - 값: **Viscose 76% / Polyester 24%** (Shopify JSON)
  - 페이지 글: 화면 글: …re 5'9" - 5'11" and wear a size S. Front: 23" Bust: 35 1/2" Sleeve: 30 1/2" FABRIC + CARE 76% Viscose 24% Polyester Double Knit Yarn Hand Wash Cold, Lay Flat to Dry Imported…
- ✅ https://www.sanctuaryclothing.com/products/easy-pointelle-shell-green-juice
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …SIZE + FIT Models are 5'9"-5'11" and wear size S. Front: 23" Bust: 33 1/2" FABRIC + CARE 100% Cotton Cotton Slub Yarn Machine Wash Cold, Lay Flat to Dry Imported…
- ✅ https://www.sanctuaryclothing.com/products/easy-pointelle-shell-chalk
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …SIZE + FIT Models are 5'9"-5'11" and wear size S. Front: 23" Bust: 33 1/2" FABRIC + CARE 100% Cotton Cotton Slub Yarn Machine Wash Cold, Lay Flat to Dry Imported…
- ✅ https://www.sanctuaryclothing.com/products/all-in-pointelle-button-top-collagen
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …Models are 5'9"-5'11" and wear size S. Front: 22" Bust: 33" Sleeve: 13 1/2" FABRIC + CARE 100% Cotton Cotton Pointelle Machine Wash Cold, Lay Flat to Dry Imported…
- ✅ https://www.sanctuaryclothing.com/products/metallic-sweater-tee-collagen
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …Models are 5'9"-5'11" and wear size S. Front: 21" Bust: 41" Sleeve: 22 1/2" FABRIC + CARE 100% Cotton Crochet Yarn Hand Wash Cold, Lay Flat to Dry Imported…
- ⬜ 빈 것(컬러·가격만) · https://www.sanctuaryclothing.com/products/gift-card
- ⬜ 빈 것(컬러·가격만) · https://www.sanctuaryclothing.com/products/ekara-slim-wide-jean-30-inseam-emb-light

### Scoth & soda — 채움 0 · 빈 것 26 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.scotchandsoda.com/products/the-artiste-sunglasses-ss5031_800-crystal-gray
- ⬜ 빈 것(컬러·가격만) · https://www.scotchandsoda.com/products/the-muse-sunglasses-ss5035_119-tortoiseshell
- ⬜ 빈 것(컬러·가격만) · https://scotchandsoda.com/products/mount-w-sneaker-78-4106-01-s279-s279-taupe-multi

### Sessun — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://en.sessun.com/catalogue/trousers/carlea-black.html

### Splendid — 채움 2 · 빈 것 38 · 못 읽음 0

- ✅ https://splendid.com/products/alessi-romper-1
  - 값: **Lyocell 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …The Alessi Romper makes getting out the door a piece of cake. It's cut from 100% lyocell for a lightweight, breathable feel. Its button-down bodice has an optional waist belt that can be tied for a…
- ✅ https://splendid.com/products/high-waist-wide-leg-jean
  - 값: **Elastane 1% / Elastomultiester 9% / Modal 11% / Cotton 79%** (Shopify JSON)
  - 페이지 글: 화면 글: …y look. Pair with a tee on the weekends or style with boots and a sweater for the office. 1% Spandex, 9% Elastomultiester, 11% Modal, 79% Cotton High waisted Wide leg Cropped flare Iconic 5-pocket design Distre…
- ⬜ 빈 것(컬러·가격만) · https://splendid.com/products/splendid-x-wild-one-star-sweater
- ⬜ 빈 것(컬러·가격만) · https://splendid.com/products/zeena-zip-up-cardigan
- ⬜ 빈 것(컬러·가격만) · https://splendid.com/products/splendid-x-cellajaneblog-stripe-front-seam-sweater

### Whitestuff — 채움 9 · 빈 것 0 · 못 읽음 0

- ✅ https://www.whitestuff.com/p/8311/reese-button-through-dress/BLUE_PR
  - 값: **Cotton 51% / Modal 49%** (본문)
  - 페이지 글: 화면 글: …kline gives it a dressier feel, while pockets keep it practical. Product ID: 448286 &quot;51% Organic Cotton 49% Modal (tencel™) Size 12 high shoulder neck point to hem approx. 130cm Petite size 12 high shoulder neck p…
- ✅ https://www.whitestuff.com/p/8281/447157-leah-jersey-dress/NAVY_MULTI
  - 값: **Cotton 50% / Modal 50%** (본문)
  - 페이지 글: 화면 글: …st that falls into a full, swishy skirt. Add sandals now, boots later. Product ID: 447157 50% Organic Cotton 50% Modal TENCEL ™ Size 12 high shoulder neck point to hem approx. 120cm Notch Neck Long Sleeve Classic Fit M…
- ✅ https://www.whitestuff.com/p/8427/447137-kalia-short-dress/NAVY_MULTI
  - 값: **Viscose 100%** (본문)
  - 페이지 글: 화면 글: …s, tie neck and tiered skirt on this dress. (Though we may be biased.) Product ID: 447137 100% Viscose (LENZING ™ ECOVERO ™) Size 12 high shoulder neck point to hem approx. 98cm Petite size 12 high shoulder neck…
- ✅ https://www.whitestuff.com/p/8327/448287-harper-jersey-dress/NAVY_MULTI
  - 값: **Cotton 52% / Modal 48% ‖ Cotton 51% / Modal 49%** (본문)
  - 페이지 글: 화면 글: …ff, and a v-neckline to keep it easy to dress up or down. Product ID: 448287 NAVY MULTI : 52% Organic Cotton 48% Modal (TENCEL™) / GREEN PRINT : 51% Organic Cotton 49% Modal (TENCEL™)&quot; Size 12 high shoulder neck p…
- ✅ https://www.whitestuff.com/p/8327/448287-harper-jersey-dress/GREEN_PR
  - 값: **Cotton 52% / Modal 48% ‖ Cotton 51% / Modal 49%** (본문)
  - 페이지 글: 화면 글: …ff, and a v-neckline to keep it easy to dress up or down. Product ID: 448287 NAVY MULTI : 52% Organic Cotton 48% Modal (TENCEL™) / GREEN PRINT : 51% Organic Cotton 49% Modal (TENCEL™)&quot; Size 12 high shoulder neck p…

### Zara — 채움 3 · 빈 것 0 · 못 읽음 9

- ✅ https://www.zara.com/us/en/long-sleeve-henley-t-shirt-p04174666.html?v1=595399393
  - 값: **Cotton 95% / Elastane 5%** (보관본 20260926)
  - 페이지 글: 페이지 JSON: …perty":[{"@type":"PropertyValue","propertyID":"Composition","name":"OUTER SHELL","value":"95% cotton, 5% elastane"}],"hasVariant":[{"@type":"Product","name":"LONG SLEEVE HENLEY T-SHIRT - Ecru - S","sku":"562905…
- ✅ https://www.zara.com/us/en/interlock-bomber-sweatshirt-p02335653.html?v1=560284773
  - 값: **Cotton 75% / Polyester 17% / Elastane 8%** (보관본 20261107)
  - 페이지 글: 페이지 JSON: …,"value":""},{"@type":"PropertyValue","propertyID":"Composition","name":"LINING","value":"75% cotton, 17% polyester, 8% elastane"}],"hasVariant":[{"@type":"Product","name":"INTERLOCK BOMBER SWEATSHIRT - Mid-blu…
- ✅ https://www.zara.com/us/en/printed-bloomer-pants-p07910159.html?v1=565418278
  - 값: **Lyocell 75% / Nylon 25% ‖ Polyester 100%** (보관본 20260910)
  - 페이지 글: 화면 글: …omposition & care Check in-store availability Shipping, Exchanges and Returns OUTER SHELL 75% lyocell 25% polyamide LINING 100% polyester Footer Help My Zara account Items and sizes Gift options Deliveries Payme…
- ⛔ 막힘(fetch,impit) · https://www.zara.com/us/en/washed-effect-sweatshirt-p03253820.html?v1=566231625
- ⛔ 막힘(fetch,impit) · https://www.zara.com/us/en/interlock-zip-up-sweatshirt-p02335652.html?v1=597431702
- ⛔ 막힘(fetch,impit) · https://www.zara.com/us/en/interlock-high-neck-sweatshirt-p02335651.html?v1=597431700

### rouje — 채움 9 · 빈 것 2 · 못 읽음 21

- ✅ https://www.rouje.com/products/veya-merino-wool-long-dress-beige
  - 값: **Wool 100%** (본문)
  - 페이지 글: 화면 글: …en choisissant le mode de paiement Paypal ou Klarna au moment du paiement. Made in Europe 100% Laine Transport routier Ajustement Petit Normal Grand Ce modèle taille normalement, choisissez votre taille habitue…
- ✅ https://www.rouje.com/products/eilleen-merino-wool-long-sleeve-dress-grey
  - 값: **Wool 100%** (본문)
  - 페이지 글: 화면 글: …mode de paiement Paypal ou Klarna au moment du paiement. Made in Europe Transport routier 100% Laine Ajustement Petit Normal Grand Ce modèle taille normalement, choisissez votre taille habituelle. Description R…
- ✅ https://www.rouje.com/products/liseron-lace-midi-dress-brown
  - 값: **Viscose 55% / Silk 45%** (본문)
  - 페이지 글: 화면 글: …la taille 42, puis de 3 cm au-delà. Matières & Entretien Composition : Tissu principal : 55 % viscose, 45 % soie Dentelle : 90 % polyamide - 10 % nylon Entretien de votre pièce Rouje : Lavage en machine à froid,…
- ✅ https://www.rouje.com/products/charlotta-midi-dress-floral-print-dusty-pink
  - 값: **Viscose 55% / Silk 45%** (본문)
  - 페이지 글: 화면 글: …42, puis de 3 cm par taille au-delà. Matières & Entretien Composition : Tissu principal : 55 % viscose, 45 % soie Entretien de votre pièce Rouje : Lavage à la main à l’eau froide Ne pas utiliser d'eau de Javel Ne…
- ✅ https://www.rouje.com/products/kitty-short-wool-dress-brown
  - 값: **Wool 100%** (본문)
  - 페이지 글: 화면 글: …mode de paiement Paypal ou Klarna au moment du paiement. Made in Italy Transport routier 100% Laine Ajustement Petit Normal Grand Ce modèle taille normalement, choisissez votre taille habituelle. Description R…
- ⬜ 빈 것(컬러·가격만) · https://www.rouje.com/products/malla-short-sleeve-wool-top-lace-ecru
- ⬜ 빈 것(컬러·가격만) · https://www.rouje.com/en-int/products/lesfillesenrouje-la-palette-visage-blush-highlighter
- ⛔ 막힘·껍데기 · https://www.rouje.com/products/karene-t-shirt-ecru
- ⛔ 막힘·껍데기 · https://www.rouje.com/products/ademir-cardigan-crochet-ecru
- ⛔ 막힘(fetch,impit) · https://www.rouje.com/products/kareneb-body-navy

## 웹 아카이브 층

조회 271/600개(브랜드당 40) · 요청 431회 · 429 0 · 5xx 0 · 네트워크 오류 53 · 쿼리 포함 주소로만 찾은 것 0 · **이 실행 도중 층을 껐다: 연속 실패 4회(마지막: fetch failed)**

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Chico's | 640 | 16 | 26 | 12 | 2 | 0 | 0 | 487 | 3684s |
| Reformation | 621 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Massimo Dutti | 548 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 870s |
| Joules | 507 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1330s |
| Loft | 387 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 810s |
| Fatface | 344 | 0 | 19 | 21 | 0 | 0 | 0 | 304 | 2164s |
| Aritzia | 296 | 0 | 1 | 36 | 3 | 32 | 0 | 224 | 1871s |
| &Other Stories | 296 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Zara | 292 | 0 | 3 | 7 | 2 | 0 | 0 | 0 | 110s |
| Bassike | 238 | 227 | 0 | 0 | 0 | 0 | 0 | 0 | 928s |
| Arket | 200 | 1 | 3 | 36 | 0 | 0 | 1 | 159 | 1639s |
| Free People | 169 | 0 | 6 | 31 | 1 | 2 | 2 | 106 | 1809s |
| Splendid | 161 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 231s |
| WHBM | 141 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Coldwatercreek | 129 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 512s |
| Everlane | 119 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 711s |
| Abercrombie & Fitch | 84 | 0 | 0 | 0 | 0 | 0 | 0 | 84 | 334s |
| Good American | 72 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 437s |
| Gap | 68 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 270s |
| FP Movement | 58 | 0 | 8 | 17 | 4 | 4 | 8 | 10 | 1890s |
| Lands end | 58 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 398s |
| Club monaco | 53 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 228s |
| Stateside | 51 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| J.mclaughlin | 45 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 357s |
| Mint velvet | 45 | 31 | 0 | 0 | 0 | 0 | 0 | 0 | 207s |
| Rails | 44 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 239s |
| rouje | 42 | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 226s |
| Athleta | 37 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 147s |
| Mango | 36 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Leset | 33 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 196s |
| H&M | 32 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 9s |
| Boden | 31 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 7s |
| Addidas | 30 | 0 | 0 | 0 | 0 | 14 | 0 | 16 | 118s |
| Anthropologie | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 30 | 118s |
| Eileen fisher | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 30 | 118s |
| Garnet hill | 30 | 0 | 0 | 1 | 12 | 8 | 7 | 2 | 1366s |
| Patagonia | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 58s |
| Prana | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 118s |
| Sezane | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Lululemon | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| The white company | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| CCC | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 134s |
| Paige | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 14s |
| Ann Taylor | 28 | 0 | 0 | 0 | 0 | 1 | 0 | 26 | 56s |
| Nike | 28 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 110s |
| Cotton citizen | 27 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 160s |
| Scoth & soda | 27 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 146s |
| Michael Stars | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 154s |
| Oasis | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 102s |
| Evereve | 26 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 129s |
| Gestuz | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 47s |
| J crew | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 95s |
| Project Social T | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 130s |
| Splits59 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Wilson | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Whitestuff | 22 | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 35s |
| Spanx | 20 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Alo | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 70s |
| Oysho | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 70s |
| Frank & Eileen | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 100s |
| L.L bean | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 62s |
| Vanessa bruno | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Eddie bauer | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 94s |
| Monrow | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 88s |
| Phase eight | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 58s |
| Tuckernuck | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Bash | 14 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 41s |
| Sundry | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Theory | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Sanctuary | 14 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 33s |
| Frame | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 77s |
| English factory | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Jager | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 44s |
| Varley | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Addison bay | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 60s |
| Bellerose | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 64s |
| Wrap | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Xirena | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Draper James | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 52s |
| Marine Layer | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 52s |
| Outdoorvoices | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 52s |
| Madewell | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 32s |
| Poetry | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 30s |
| Ulla Johnson | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Carlhartt | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 26s |
| Old Navy | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 27s |
| Seasalt cornwall | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| The upside | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Whistles | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| ALC | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 28s |
| Faherty | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 28s |
| Jigsaw | 5 | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 18s |
| Me+Em | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16s |
| vineyardvines | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Buck Mason | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 30s |
| Citizens of Humanity | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 20s |
| Veronica Beard | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Z Supply | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| American Eagle | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 11s |
| Apiece Apart | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 22s |
| Beyond yoga | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16s |
| Damson Madder | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18s |
| Greyson | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 17s |
| J.jill | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10s |
| La Ligne | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 22s |
| On | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 22s |
| Barbour | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7s |
| Cotton on | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6s |
| Gerard darel | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 11s |
| James Perse | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10s |
| LNA | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10s |
| Ninety Percent | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10s |
| Sweaty betty | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| The Great | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Thread & supply | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Banana Republic | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3s |
| Sessun | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3s |
| Hobbs | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2s |
| Lilla P | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |
| Monsoon | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2s |
| Oak + Fort | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |
| Gymshark | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7s |
| Velvet | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |
| Vince | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0s |

사유별 개수: 보관본 없음 163 · 찾음 66 · 보관본도 차단·빈 화면 11 · 보관본에 혼용률 없음 3 · 주소: 카테고리 이름 주소 51 · 주소: 최상위 짧은 경로 1 · 혼용률 여러 벌(목록) 5 · 보관본 열기 실패 2 · 아카이브 오류 18 · 주소: 카테고리 경로 9 · 상품 표시 없음 2 · 목록 페이지(JSON-LD) 1

<details><summary>사유별 예시(최대 25개)</summary>

**보관본 없음**

- H&M — https://www2.hm.com/en_us/productpage.1370459002.html
- H&M — https://www2.hm.com/en_us/productpage.1351503001.html
- Zara — https://www.zara.com/us/en/washed-effect-sweatshirt-p03253820.html?v1=566231625
- Zara — https://www.zara.com/us/en/interlock-high-neck-sweatshirt-p02335651.html?v1=597431700
- Zara — https://www.zara.com/us/en/cropped-glitter-hoodie-p06050140.html?v1=579871208
- Zara — https://www.zara.com/us/en/flowy-wrap-blouse-zw-collection-p04786184.html?v1=545446457
- Zara — https://www.zara.com/us/en/embroidered-ruffle-blouse-p07969235.html?v1=564534119
- Zara — https://www.zara.com/us/en/ruffle-mini-dress-p07890777.html?v1=589248306
- Zara — https://www.zara.com/us/en/satin-gloss-effect-midi-dress-p08741246.html?v1=550281614
- Arket — https://www.arket.com/en-ww/product/relaxed-polo-shirt-off-white-1369192001/
- Arket — https://www.arket.com/en-ww/product/viscose-silk-shirt-dark-beige-1352079001/
- Arket — https://www.arket.com/en-ww/product/cotton-wrap-shirt-black-1353719001/
- Chico's — https://www.chicos.com/store/product/sequin-chiffon-sleeveless-dress/570420330?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761517893
- Arket — https://www.arket.com/en-ww/product/pima-cotton-poplin-shirt-off-whiteblack-1366463001/
- Arket — https://www.arket.com/en-ww/product/silk-satin-blouse-dark-green-1382326001/
- Arket — https://www.arket.com/en-ww/product/silk-satin-shirt-beige-1355525004/
- Arket — https://www.arket.com/en-ww/product/pleated-tuxedo-shirt-black-1360267001/
- Arket — https://www.arket.com/en-ww/product/pleated-tuxedo-shirt-white-1360267003/
- Arket — https://www.arket.com/en-ww/product/cotton-smocked-shirt-white-1370468001/
- Arket — https://www.arket.com/en-ww/product/linen-blend-blouse-black-1363059001/
- Arket — https://www.arket.com/en-ww/product/slim-stretch-cotton-shirt-beige-1356564002/
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories/scarves
- Arket — https://www.arket.com/en-ww/product/denim-overshirt-dark-blue-1331471002/
- Chico's — https://www.chicos.com/store/product/knit-velour-knee-length-dress/570419628?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761515752
- Arket — https://www.arket.com/en-ww/product/smock-blouse-black-1365690001/

**찾음**

- Zara — https://www.zara.com/us/en/long-sleeve-henley-t-shirt-p04174666.html?v1=595399393 — 20260926 · Cotton 95% / Elastane 5%
- Zara — https://www.zara.com/us/en/interlock-bomber-sweatshirt-p02335653.html?v1=560284773 — 20261107 · Cotton 75% / Polyester 17% / Elastane 8%
- Zara — https://www.zara.com/us/en/printed-bloomer-pants-p07910159.html?v1=565418278 — 20260910 · Lyocell 75% / Nylon 25% / Polyester 100%
- Arket — https://www.arket.com/en-ww/product/frill-collar-blouse-beige-1309044001/ — 20260421 · Cupro 100%
- Chico's — https://www.chicos.com/store/product/seamed-ponte-knit-3-4-sleeve-dress/570418072?inseam=regular&sizeType=regular&color=4333&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761369577 — 20260921 · Viscose 60% / Nylon 31% / Elastane 9%
- Chico's — https://www.chicos.com/store/product/faux-leather-ponte-knit-dress/570417754?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761381272 — 20260910 · Viscose 65% / Nylon 30% / Elastane 5% / Polyester 100%
- Chico's — https://www.chicos.com/store/product/zenergy-upf-mockneck-bungee-dress/570382458?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196535196094 — 20260722 · Polyester 86% / Elastane 14%
- Chico's — https://www.chicos.com/store/product/soft-stretch-knit-animal-print-dress/570418555?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761360666 — 20261024 · Polyester 93% / Elastane 7%
- Chico's — https://www.chicos.com/store/product/travelers-knit-printed-twist-front-dress/570417294?inseam=regular&sizeType=regular&color=7069&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761283279 — 20260820 · Polyester 93% / Elastane 7%
- Chico's — https://www.chicos.com/store/product/travelers-classic-dress/570302454?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196533233234 — 20260607 · Acetate 96% / Elastane 4%
- Arket — https://www.arket.com/en-ww/product/silk-blend-blouse-dark-brown-1323869001/ — 20260509 · Silk 82% / Nylon 18%
- Chico's — https://www.chicos.com/store/product/travelers-chiffon-overlay-dress/570414060?inseam=regular&sizeType=regular&color=2664&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761137633 — 20260711 · Acetate 96% / Elastane 4%
- Chico's — https://www.chicos.com/store/product/crinkle-chiffon-animal-print-dress/570409321?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536815338 — 20260831 · Polyester 100%
- Aritzia — https://www.aritzia.com/intl/en/product/carter-blouse/95895.html — 20250119 · Polyester 100%
- Chico's — https://www.chicos.com/store/product/sleeveless-surplice-linen-dress/570409326?inseam=regular&sizeType=regular&color=001&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536748049 — 20260716 · Linen 53% / Cotton 47%
- Chico's — https://www.chicos.com/store/product/georgette-trapunto-pullover-dress/570410095?inseam=regular&sizeType=regular&color=5291&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536820462 — 20260721 · Polyester 100%
- Arket — https://www.arket.com/en-ww/product/peplum-taffeta-top-black-1316231002/ — 20260420 · Cotton 60% / Nylon 40% / Cotton 100%
- Chico's — https://www.chicos.com/store/product/denim-godet-sleeveless-dress/570412268?inseam=regular&sizeType=regular&color=112&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536911177 — 20260831 · Lyocell 100%
- Chico's — https://www.chicos.com/store/product/travelers-twist-neck-midi-dress/570412690?inseam=regular&sizeType=regular&color=7012&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536957540 — 20260711 · Acetate 96% / Elastane 4%
- Chico's — https://www.chicos.com/store/product/linen-collared-dress/570411040?inseam=regular&sizeType=regular&color=7005&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536910194 — 20260911 · Linen 100%
- Chico's — https://www.chicos.com/store/product/printed-cotton-linen-belted-dress/570409483?inseam=regular&sizeType=regular&color=6913&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536756143 — 20260609 · Cotton 75% / Linen 25%
- Chico's — https://www.chicos.com/store/product/printed-midi-shirt-dress/570409319?inseam=regular&sizeType=regular&color=7010&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536755856 — 20260802 · Polyester 100%
- Chico's — https://www.chicos.com/store/product/zenergy-upf-sleeveless-animal-bungee-dress/570413284?inseam=regular&sizeType=regular&color=183&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761100958 — 20261016 · Polyester 88% / Elastane 12%
- Chico's — https://www.chicos.com/store/product/linen-cotton-henley-dress/570411038?inseam=regular&sizeType=regular&color=5735&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=196536909860 — 20261003 · Linen 53% / Cotton 47% / Cotton 100%
- Fatface — https://www.fatface.com/style/su790022/h69671 — 20260606 · Body 67% / Recycled Polyester 33% / Rib 98% / Elastane 2%

**보관본도 차단·빈 화면**

- Zara — https://www.zara.com/us/en/interlock-zip-up-sweatshirt-p02335652.html?v1=597431702
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/gifts-for-him/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/holiday-dressing/
- Garnet hill — https://www.garnethill.com/bedding-home/features/monogram-shop/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/gifts-under-100/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/family-pajamas/
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/gifts-for-her/
- Garnet hill — https://www.garnethill.com/clothing/features/the-cashmere-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-linen-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-organic-cotton-shop/
- Garnet hill — https://www.garnethill.com/clothing/features/the-petite-shop/

**보관본에 혼용률 없음**

- Zara — https://www.zara.com/us/en/striped-poplin-shirt-p08920816.html?v1=602868859
- FP Movement — https://www.freepeople.com/fpmovement/casual-wear/
- FP Movement — https://www.freepeople.com/fpmovement/shortsies-and-skortsies/

**주소: 카테고리 이름 주소**

- Addidas — https://www.adidas.com/us/black_friday
- Addidas — https://www.adidas.com/us/men-trending
- Addidas — https://www.adidas.com/us/men-prime
- Addidas — https://www.adidas.com/us/men-black_friday
- Addidas — https://www.adidas.com/us/women
- Addidas — https://www.adidas.com/us/women-trending
- Addidas — https://www.adidas.com/us/women-prime
- Addidas — https://www.adidas.com/us/women-black_friday
- Addidas — https://www.adidas.com/us/kids
- Addidas — https://www.adidas.com/us/kids-trending
- Addidas — https://www.adidas.com/us/kids-prime
- Addidas — https://www.adidas.com/us/kids-black_friday
- Addidas — https://www.adidas.com/us/trending
- Addidas — https://www.adidas.com/us/women-tank_tops
- Aritzia — https://www.aritzia.com/intl/en/new
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweaters
- Aritzia — https://www.aritzia.com/intl/en/clothing/coats-jackets
- Aritzia — https://www.aritzia.com/intl/en/clothing/sweatsuit-sets
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes
- Aritzia — https://www.aritzia.com/intl/en/clothing/womens-workout-clothes/butter-clothing
- Aritzia — https://www.aritzia.com/intl/en/clothing/accessories
- Aritzia — https://www.aritzia.com/intl/en/discover
- Aritzia — https://www.aritzia.com/intl/en/clothing/tops/going-out-tops
- Aritzia — https://www.aritzia.com/intl/en/clothing/tops/halter-tops
- Aritzia — https://www.aritzia.com/intl/en/clothing/tops/tube-tops

**주소: 최상위 짧은 경로**

- Ann Taylor — https://www.anntaylor.com/stylerewards

**혼용률 여러 벌(목록)**

- Aritzia — https://www.aritzia.com/intl/en/product/loretto-blouse/128753.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":4,"prices":0,"carts":1,"sigs":["polyester 50","polyester 100","wool 100","cotton 100"],"title":"Loretto Blouse / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList"]}
- Chico's — https://www.chicos.com/store/product/denim-faux-suede-detail-dress/570414275?inseam=regular&sizeType=regular&color=010&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761089758 — {"rootProducts":1,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":3,"prices":21,"carts":1,"sigs":["cotton 75/elastane 10/lyocell 4/polyester 10","elastane 1/polyester 89","elastane 11"],"title":"Denim Faux Suede Detail Dress / Chico&#x27;s","types":["Product","Organization","Offer","AggregateRating"]}
- Aritzia — https://www.aritzia.com/intl/en/product/smooth-matter%E2%84%A2-decanter-halter-top/131119.html — {"rootProducts":1,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":3,"prices":0,"carts":1,"sigs":["elastane 8/polyester 92","wool 100","cotton 100"],"title":"Smooth Matter™ Decanter Halter Top / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList","Product","Brand","Offer"]}
- Aritzia — https://www.aritzia.com/intl/en/product/cruiselinen%E2%84%A2-regal-vest/124183.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":5,"prices":0,"carts":1,"sigs":["lyocell 66","linen 34/lyocell 66","linen 21/lyocell 79","wool 100"],"title":"CruiseLinen™ Regal Vest / Aritzia INTL","types":["BreadcrumbList","ListItem","ItemList"]}
- FP Movement — https://www.freepeople.com/fpmovement/shop/bundle/the-surfs-up-bundle4/ — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":3,"prices":13,"carts":0,"sigs":["elastane 20/polyester 80","cotton 100","polyester 100"],"title":"The Surf&#39;s Up Bundle / Free People","types":["Corporation","ContactPoint","SiteNavigationElement","WebPageElement","BreadcrumbList","ListItem"]}

**보관본 열기 실패**

- Chico's — https://www.chicos.com/store/product/travelers-rose-print-midi-dress/570419663?inseam=regular&sizeType=regular&color=4569&catId=cat40004&collectionId=category&queryId=bdca6a1cc229da41a59505a5c81d41bb&indexName=prod_chs_products&parentId=199761568574 — HTTP 404
- Free People — https://www.freepeople.com/shop/whispering-love-lace-top/ — HTTP 403

**아카이브 오류**

- Arket — https://www.arket.com/en-ww/product/peplum-taffeta-top-pink-1316231001/ — fetch failed
- Free People — https://www.freepeople.com/shop/the-tales-repaired-mixed-flannel-shirt/ — fetch failed
- FP Movement — https://www.freepeople.com/fpmovement/shop/hot-shot-easy-pants/ — fetch failed
- FP Movement — https://www.freepeople.com/fpmovement/best-selling-bottoms/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Free People — https://www.freepeople.com/shop/for-love-and-lemons-fallen-floral-top/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- FP Movement — https://www.freepeople.com/fpmovement/shop/trackline-cropped-easy-pants/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- FP Movement — https://www.freepeople.com/fpmovement/shop/all-star-graphic-joggers/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- FP Movement — https://www.freepeople.com/fpmovement/activewear-hot-shot-collection/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- FP Movement — https://www.freepeople.com/fpmovement/shop/sundown-fleece-pants2/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- FP Movement — https://www.freepeople.com/fpmovement/shorts-movement/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Garnet hill — https://www.garnethill.com/clothing/features/the-eileen-fisher-shop/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Garnet hill — https://www.garnethill.com/shoes-accessories/shoes/sneakers/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Garnet hill — https://www.garnethill.com/bedding-home/decor/holiday-decor/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Garnet hill — https://www.garnethill.com/clothing/features/the-mens-shop/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Garnet hill — https://www.garnethill.com/shoes-accessories/shoes/flats/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Garnet hill — https://www.garnethill.com/shoes-accessories/shoes/boots/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- Garnet hill — https://www.garnethill.com/clothing/features/the-kids-shop/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)
- FP Movement — https://www.freepeople.com/fpmovement/shop/hot-shot-onesie/ — 아카이브 층 꺼짐: 연속 실패 4회(마지막: fetch failed)

**주소: 카테고리 경로**

- Aritzia — https://www.aritzia.com/intl/en/shop-by/back-to-school
- Aritzia — https://www.aritzia.com/intl/en/shop-by/womens-basics
- Aritzia — https://www.aritzia.com/intl/en/shop-by/workwear
- Garnet hill — https://www.garnethill.com/clothing/categories/sweaters/
- Garnet hill — https://www.garnethill.com/clothing/categories/coats-jackets/
- Garnet hill — https://www.garnethill.com/clothing/categories/skirts/
- Garnet hill — https://www.garnethill.com/clothing/categories/sleepwear/
- Garnet hill — https://www.garnethill.com/clothing/categories/athleisure/
- Garnet hill — https://www.garnethill.com/clothing/categories/intimates/

**상품 표시 없음**

- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/holiday-bedding/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":1,"prices":2,"carts":0,"sigs":["cotton 100"],"title":"Holiday Bedding","types":["Brand","BreadcrumbList","ListItem"]}
- Garnet hill — https://www.garnethill.com/holiday-gifts/shops/holiday-decor/ — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":1,"prices":2,"carts":0,"sigs":["linen 100"],"title":"Holiday Decor","types":["Brand","BreadcrumbList","ListItem"]}

**목록 페이지(JSON-LD)**

- FP Movement — https://www.freepeople.com/fpmovement/performance-wear/ — {"rootProducts":0,"listProducts":27,"itemList":27,"og":true,"h1":1,"blocks":1,"prices":27,"carts":0,"sigs":["cotton 100"],"title":"Performance Onesies + Workout One-Pieces / FP Movement","types":["Corporation","ContactPoint","SiteNavigationElement","WebPageElement","BreadcrumbList","ListItem"]}

</details>


## KV 쓰기 (이번 실행)

- 실행 방식 **full** · 1·2·3차 · 재시도 창 무시
- **DRY — 실제로 보낸 저장 요청 0회 · KV put 0** (보내기 전에 막은 요청 0)
- 저장했다면: 요청 173회 · KV put 173 (overlay 92 · details 80 · index 1)
- 저장본과 같아 보내지 않음 0 · 오늘 몫이 모자라 미룸 0
- 예전 방식(1·2·3차마다 저장)이었다면 같은 읽기 결과로 저장 요청 185회
- 오늘(UTC 2026-11-27) 이 저장소 잡이 쓴 put(장부, 이 실행 전): 0 · 예약분 300(서버 프리페치·크롬 확장·손 실행) · 이 실행에 허용된 몫 700/1000

