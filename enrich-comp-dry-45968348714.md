# 엑셀 항목 보강 — 측정 실행(DRY) (2026-11-27T09:19Z)

> ⚠️ **DRY 실행 — 저장하지 않았다.** 페이지·아카이브를 읽고 '저장했다면'을 셌을 뿐,
> Worker 의 오버레이·검색 인덱스는 그대로다. 아래 '이번 실행 +N' 은 저장했다면 늘었을 개수다.
> 진짜 결과는 `enrich-comp-report.md` 를 본다.

- 설정: 재시도 창 5일 · 추출 규칙 판 1e33f36e · 한 사이트 요청 간격 2000ms · Worker 우회 끔(측정 — 상품 주소당 요청 3번 이하) · impit 켬

## 엑셀 열 개방 판정 (기준 95% · 목표 99%)

> 이 숫자는 **방금 쓴 값을 낙관적으로** 센 것이다 — KV 가 최종 일관성이라 쓴 직후에는
> 안 읽히는 일이 있어 일부러 그렇게 뒀다. 안정된 뒤의 실제 숫자는 `preflight.md` 를 본다.

**지금 두 열이 다 채워져 나오는 브랜드: 51/134개** (상품 18031/44626개)

패널은 뽑는 상품들만 보고 열을 연다 — 이 브랜드들은 오늘 뽑으면 컬러웨이·혼용률이 붙는다.

ALC · Aerie · American Eagle · Apiece Apart · Banana Republic · Bash · Beyond yoga · Boldest · Buck Mason · Citizens of Humanity · Cotton on · Damson Madder · Dickies · Evereve · Faherty · Frank & Eileen · Gestuz · Gymshark · Hobbs · J.jill · James Perse · Jigsaw · LNA · La Ligne · Lucky Brand · Marine Layer · Me+Em · Monsoon · Nation LTD · Ninety Percent · Old Navy · On · Phase eight · Poetry · Rag & bone · Sanctuary · Seasalt cornwall · Shopbop · Sweaty betty · The Great · Theory · Tuckernuck · Ulla Johnson · Varley · Veronica Beard · Vince · Vuori · Whistles · Wrap · Xirena · vineyardvines

전체 평균은 아직입니다 — 혼용률 80% · 컬러웨이 72%.
기준 95% 까지 10235개, 목표 99% 까지 12020개 더 채워야 합니다.
(전체가 다 차기를 기다릴 필요는 없다 — 위 브랜드들은 이미 온전히 뽑힌다)

목표 항목: comp · 상품 44626개

| 항목 | 옳은 값 보유 | 채움률 | 이번 실행 |
|---|---:|---:|---:|
| 혼용률 | 35593 | 80% | +106 |
| 컬러웨이 | 32160 | 72% | +112 |

- 검색 인덱스 재구축: DRY 라 하지 않음

백필은 브랜드당 800개·한 회차 40000개 상한이다. 목표 항목이 다 찬 상품과
5일 안에 시도해 본 상품은 건너뛴다 — 사이트가 안 적는 값을 영원히 다시 읽지 않기 위해서다.

## 브랜드별 채움률 (134) — 낮은 순

| 브랜드 | 엑셀 | 혼용률 | 컬러웨이 | 이번 실행 | 경로 |
|---|:-:|---:|---:|---:|---|
| The white company | — | 0/68 (0%) | 0/68 (0%) | 혼용률 +0 컬러 +0 |  |
| H&M | — | 0/744 (0%) | 4/744 (1%) | 혼용률 +0 컬러 +0 | 실패 직접차단 32·보관본없음 32 |
| Sezane | — | 3/203 (1%) | 4/203 (2%) | 혼용률 +2 컬러 +2 | 성공 아카이브 2 / 실패 직접차단 30·보관본없음 16·아카이브거부 2 |
| Lululemon | — | 8/512 (2%) | 8/512 (2%) | 혼용률 +0 컬러 +0 | 실패 직접차단 30·보관본없음 9·아카이브거부 2 |
| Garnet hill | — | 2/108 (2%) | 0/108 (0%) | 혼용률 +0 컬러 +0 | 성공 페이지 6·impit 6 |
| Anthropologie | — | 8/263 (3%) | 8/263 (3%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 직접차단 30·보관본없음 23·아카이브거부 2 |
| Addidas | — | 25/537 (5%) | 25/537 (5%) | 혼용률 +3 컬러 +3 | 성공 아카이브 3 / 실패 직접차단 30·보관본없음 26·아카이브거부 1 |
| Patagonia | — | 8/168 (5%) | 7/168 (4%) | 혼용률 +1 컬러 +1 | 성공 아카이브 1 / 실패 껍데기 30·보관본없음 14·아카이브거부 15 |
| Prana | — | 4/81 (5%) | 4/81 (5%) | 혼용률 +0 컬러 +0 |  |
| Joules | — | 29/536 (5%) | 29/536 (5%) | 혼용률 +0 컬러 +0 |  |
| Fatface | — | 31/374 (8%) | 31/374 (8%) | 혼용률 +1 컬러 +1 | 성공 페이지 1·impit 1 / 실패 직접차단 252·보관본없음 40 |
| Massimo Dutti | — | 58/606 (10%) | 95/606 (16%) | 혼용률 +0 컬러 +0 |  |
| Oysho | — | 2/20 (10%) | 0/20 (0%) | 혼용률 +0 컬러 +0 |  |
| Free People | — | 19/189 (10%) | 15/189 (8%) | 혼용률 +0 컬러 +0 |  |
| FP Movement | — | 14/72 (19%) | 5/72 (7%) | 혼용률 +0 컬러 +0 |  |
| Chico's | — | 160/800 (20%) | 163/800 (20%) | 혼용률 +0 컬러 +0 |  |
| Reformation | — | 179/800 (22%) | 186/800 (23%) | 혼용률 +0 컬러 +0 |  |
| Coldwatercreek | — | 71/200 (36%) | 113/200 (56%) | 혼용률 +0 컬러 +0 |  |
| WHBM | — | 78/219 (36%) | 80/219 (37%) | 혼용률 +0 컬러 +0 |  |
| &Other Stories | — | 176/472 (37%) | 116/472 (25%) | 혼용률 +0 컬러 +0 |  |
| Zara | — | 204/499 (41%) | 203/499 (41%) | 혼용률 +3 컬러 +3 | 성공 아카이브 3 / 실패 직접차단 12·보관본없음 7·아카이브거부 2 |
| Loft | — | 285/672 (42%) | 321/672 (48%) | 혼용률 +0 컬러 +0 |  |
| Arket | — | 182/382 (48%) | 183/382 (48%) | 혼용률 +0 컬러 +0 |  |
| Paige | — | 32/61 (52%) | 60/61 (98%) | 혼용률 +0 컬러 +0 |  |
| Wilson | — | 29/51 (57%) | 38/51 (75%) | 혼용률 +0 컬러 +0 |  |
| Mango | — | 52/88 (59%) | 0/88 (0%) | 혼용률 +0 컬러 +0 |  |
| Abercrombie & Fitch | — | 140/224 (63%) | 2/224 (1%) | 혼용률 +0 컬러 +0 |  |
| Aritzia | — | 504/800 (63%) | 4/800 (1%) | 혼용률 +0 컬러 +0 |  |
| Splendid | — | 319/478 (67%) | 447/478 (94%) | 혼용률 +2 컬러 +37 | 성공 쇼피JSON 85·페이지 83 |
| Everlane | — | 341/461 (74%) | 297/461 (64%) | 혼용률 +0 컬러 +2 | 성공 쇼피JSON 79·페이지 78 |
| Club monaco | — | 142/173 (82%) | 64/173 (37%) | 혼용률 +0 컬러 +1 | 성공 쇼피JSON 31·페이지 9 |
| Spanx | — | 101/121 (83%) | 121/121 (100%) | 혼용률 +0 컬러 +0 |  |
| Oasis | — | 150/176 (85%) | 176/176 (100%) | 혼용률 +0 컬러 +0 |  |
| Gap | — | 407/475 (86%) | 474/475 (100%) | 혼용률 +0 컬러 +0 |  |
| Rails | — | 261/304 (86%) | 251/304 (83%) | 혼용률 +1 컬러 +17 | 성공 쇼피JSON 36·페이지 17 |
| Leset | — | 203/236 (86%) | 231/236 (98%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 9·페이지 9 |
| Cotton citizen | — | 181/208 (87%) | 208/208 (100%) | 혼용률 +0 컬러 +0 |  |
| Stateside | — | 305/350 (87%) | 293/350 (84%) | 혼용률 +6 컬러 +0 | 성공 쇼피JSON 47·페이지 47 |
| Splits59 | — | 152/174 (87%) | 122/174 (70%) | 혼용률 +0 컬러 +0 |  |
| Lands end | — | 405/463 (87%) | 20/463 (4%) | 혼용률 +0 컬러 +0 |  |
| J crew | — | 172/196 (88%) | 196/196 (100%) | 혼용률 +0 컬러 +0 |  |
| rouje | — | 207/234 (88%) | 227/234 (97%) | 혼용률 +15 컬러 +0 | 성공 쇼피JSON 3·페이지 17 |
| Madewell | — | 67/75 (89%) | 75/75 (100%) | 혼용률 +0 컬러 +0 |  |
| Good American | — | 609/681 (89%) | 681/681 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 21·페이지 43 |
| Michael Stars | — | 225/251 (90%) | 227/251 (90%) | 혼용률 +0 컬러 +0 |  |
| Athleta | — | 369/406 (91%) | 378/406 (93%) | 혼용률 +0 컬러 +0 |  |
| J.mclaughlin | — | 471/516 (91%) | 12/516 (2%) | 혼용률 +0 컬러 +0 |  |
| Carlhartt | — | 81/88 (92%) | 1/88 (1%) | 혼용률 +0 컬러 +0 |  |
| Boden | — | 339/368 (92%) | 231/368 (63%) | 혼용률 +2 컬러 +4 | 성공 쇼피JSON 8·페이지 7 / 실패 껍데기 7·보관본없음 2 |
| Addison bay | — | 130/141 (92%) | 109/141 (77%) | 혼용률 +0 컬러 +0 |  |
| Project Social T | — | 277/299 (93%) | 299/299 (100%) | 혼용률 +0 컬러 +0 |  |
| Ann Taylor | — | 353/381 (93%) | 362/381 (95%) | 혼용률 +0 컬러 +0 |  |
| Alo | — | 230/248 (93%) | 248/248 (100%) | 혼용률 +0 컬러 +0 |  |
| Outdoorvoices | — | 117/126 (93%) | 111/126 (88%) | 혼용률 +0 컬러 +0 |  |
| Eddie bauer | — | 210/226 (93%) | 200/226 (88%) | 혼용률 +0 컬러 +0 |  |
| Monrow | — | 207/222 (93%) | 222/222 (100%) | 혼용률 +0 컬러 +0 |  |
| Scoth & soda | — | 377/404 (93%) | 401/404 (99%) | 혼용률 +0 컬러 +0 | 성공 페이지 15 |
| Vanessa bruno | — | 240/257 (93%) | 257/257 (100%) | 혼용률 +0 컬러 +0 |  |
| Eileen fisher | — | 515/545 (94%) | 282/545 (52%) | 혼용률 +0 컬러 +0 |  |
| L.L bean | — | 296/313 (95%) | 259/313 (83%) | 혼용률 +0 컬러 +0 |  |
| Frame | — | 229/242 (95%) | 221/242 (91%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 1·페이지 1 |
| Nike | ✅ | 528/556 (95%) | 550/556 (99%) | 혼용률 +0 컬러 +1 | 성공 페이지 1 |
| Sundry | — | 273/287 (95%) | 252/287 (88%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 10·페이지 6 |
| Marine Layer | ✅ | 178/187 (95%) | 187/187 (100%) | 혼용률 +0 컬러 +0 |  |
| English factory | — | 259/272 (95%) | 249/272 (92%) | 혼용률 +0 컬러 +0 |  |
| Draper James | — | 189/198 (95%) | 177/198 (89%) | 혼용률 +0 컬러 +0 |  |
| Bellerose | ✅ | 237/248 (96%) | 235/248 (95%) | 혼용률 +0 컬러 +0 |  |
| Varley | ✅ | 275/287 (96%) | 287/287 (100%) | 혼용률 +0 컬러 +0 |  |
| Tuckernuck | ✅ | 360/375 (96%) | 374/375 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 14·페이지 14 |
| Phase eight | ✅ | 386/401 (96%) | 401/401 (100%) | 혼용률 +0 컬러 +0 |  |
| Gestuz | ✅ | 619/643 (96%) | 641/643 (100%) | 혼용률 +0 컬러 +0 |  |
| CCC | — | 771/800 (96%) | 486/800 (61%) | 혼용률 +0 컬러 +0 |  |
| Buck Mason | ✅ | 107/111 (96%) | 110/111 (99%) | 혼용률 +0 컬러 +0 |  |
| Frank & Eileen | ✅ | 455/472 (96%) | 472/472 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 2·페이지 2 |
| Mint velvet | — | 402/417 (96%) | 309/417 (74%) | 혼용률 +30 컬러 +3 | 성공 쇼피JSON 40·페이지 40 |
| Theory | ✅ | 376/390 (96%) | 377/390 (97%) | 혼용률 +0 컬러 +0 |  |
| J.jill | ✅ | 87/90 (97%) | 89/90 (99%) | 혼용률 +0 컬러 +0 |  |
| Bassike | — | 340/351 (97%) | 1/351 (0%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 238·페이지 216 |
| Jager | — | 390/402 (97%) | 339/402 (84%) | 혼용률 +0 컬러 +0 |  |
| Apiece Apart | ✅ | 99/102 (97%) | 101/102 (99%) | 혼용률 +0 컬러 +0 |  |
| Evereve | ✅ | 482/496 (97%) | 496/496 (100%) | 혼용률 +12 컬러 +12 | 성공 쇼피JSON 49·페이지 49 |
| The upside | — | 212/218 (97%) | 115/218 (53%) | 혼용률 +0 컬러 +0 |  |
| Wrap | ✅ | 364/374 (97%) | 369/374 (99%) | 혼용률 +0 컬러 +0 |  |
| Poetry | ✅ | 295/303 (97%) | 299/303 (99%) | 혼용률 +0 컬러 +0 |  |
| Ulla Johnson | ✅ | 303/311 (97%) | 311/311 (100%) | 혼용률 +0 컬러 +0 |  |
| Whistles | ✅ | 236/242 (98%) | 241/242 (100%) | 혼용률 +0 컬러 +0 |  |
| Xirena | ✅ | 394/404 (98%) | 404/404 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 67·페이지 67 |
| Greyson | — | 125/128 (98%) | 116/128 (91%) | 혼용률 +0 컬러 +0 |  |
| Citizens of Humanity | ✅ | 167/171 (98%) | 171/171 (100%) | 혼용률 +0 컬러 +0 |  |
| Seasalt cornwall | ✅ | 267/273 (98%) | 272/273 (100%) | 혼용률 +0 컬러 +0 |  |
| Faherty | ✅ | 245/250 (98%) | 249/250 (100%) | 혼용률 +0 컬러 +0 |  |
| Whitestuff | — | 663/676 (98%) | 362/676 (54%) | 혼용률 +9 컬러 +6 | 성공 페이지 9·impit 9 |
| Z Supply | — | 250/254 (98%) | 229/254 (90%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 8·페이지 8 |
| Gerard darel | — | 136/138 (99%) | 85/138 (62%) | 혼용률 +0 컬러 +0 |  |
| Jigsaw | ✅ | 369/374 (99%) | 374/374 (100%) | 혼용률 +0 컬러 +0 |  |
| Bash | ✅ | 610/618 (99%) | 614/618 (99%) | 혼용률 +6 컬러 +6 | 성공 페이지 6 |
| On | ✅ | 229/232 (99%) | 232/232 (100%) | 혼용률 +0 컬러 +0 |  |
| Ninety Percent | ✅ | 155/157 (99%) | 157/157 (100%) | 혼용률 +0 컬러 +0 |  |
| Beyond yoga | ✅ | 242/245 (99%) | 244/245 (100%) | 혼용률 +0 컬러 +0 |  |
| ALC | ✅ | 415/420 (99%) | 420/420 (100%) | 혼용률 +0 컬러 +0 |  |
| Barbour | — | 168/170 (99%) | 16/170 (9%) | 혼용률 +0 컬러 +0 |  |
| Me+Em | ✅ | 451/456 (99%) | 455/456 (100%) | 혼용률 +0 컬러 +0 |  |
| Veronica Beard | ✅ | 361/365 (99%) | 365/365 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 107·페이지 105 |
| Old Navy | ✅ | 668/675 (99%) | 675/675 (100%) | 혼용률 +0 컬러 +0 |  |
| vineyardvines | ✅ | 558/563 (99%) | 561/563 (100%) | 혼용률 +0 컬러 +0 |  |
| The Great | ✅ | 243/245 (99%) | 243/245 (99%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 14·페이지 14 |
| La Ligne | ✅ | 396/399 (99%) | 399/399 (100%) | 혼용률 +0 컬러 +0 |  |
| Damson Madder | ✅ | 409/412 (99%) | 412/412 (100%) | 혼용률 +0 컬러 +0 |  |
| LNA | ✅ | 276/278 (99%) | 276/278 (99%) | 혼용률 +0 컬러 +0 |  |
| Monsoon | ✅ | 174/175 (99%) | 175/175 (100%) | 혼용률 +0 컬러 +0 |  |
| Thread & supply | — | 348/350 (99%) | 279/350 (80%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 11·페이지 2 |
| Lilla P | — | 175/176 (99%) | 145/176 (82%) | 혼용률 +0 컬러 +0 |  |
| Sweaty betty | ✅ | 409/411 (100%) | 410/411 (100%) | 혼용률 +0 컬러 +0 |  |
| Sanctuary | ✅ | 425/427 (100%) | 426/427 (100%) | 혼용률 +12 컬러 +12 | 성공 쇼피JSON 12 |
| American Eagle | ✅ | 670/673 (100%) | 673/673 (100%) | 혼용률 +0 컬러 +0 |  |
| Cotton on | ✅ | 481/483 (100%) | 475/483 (98%) | 혼용률 +0 컬러 +0 |  |
| Sessun | — | 241/242 (100%) | 0/242 (0%) | 혼용률 +0 컬러 +0 |  |
| Gymshark | ✅ | 265/266 (100%) | 266/266 (100%) | 혼용률 +0 컬러 +0 |  |
| James Perse | ✅ | 540/542 (100%) | 539/542 (99%) | 혼용률 +0 컬러 +0 |  |
| Hobbs | ✅ | 352/353 (100%) | 353/353 (100%) | 혼용률 +0 컬러 +0 |  |
| Vince | ✅ | 378/379 (100%) | 379/379 (100%) | 혼용률 +0 컬러 +0 |  |
| Velvet | — | 394/395 (100%) | 340/395 (86%) | 혼용률 +0 컬러 +0 |  |
| Banana Republic | ✅ | 501/502 (100%) | 502/502 (100%) | 혼용률 +0 컬러 +0 |  |
| Aerie | ✅ | 404/404 (100%) | 404/404 (100%) | 혼용률 +0 컬러 +0 |  |
| Dickies | ✅ | 240/240 (100%) | 240/240 (100%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 24·페이지 24 |
| Goldie | — | 148/148 (100%) | 129/148 (87%) | 혼용률 +0 컬러 +0 |  |
| Boldest | ✅ | 136/136 (100%) | 132/136 (97%) | 혼용률 +0 컬러 +0 |  |
| Lucky Brand | ✅ | 170/170 (100%) | 170/170 (100%) | 혼용률 +0 컬러 +0 |  |
| Nation LTD | ✅ | 525/525 (100%) | 525/525 (100%) | 혼용률 +0 컬러 +0 |  |
| Nylora | — | 242/242 (100%) | 52/242 (21%) | 혼용률 +0 컬러 +0 |  |
| Oak + Fort | — | 340/340 (100%) | 316/340 (93%) | 혼용률 +0 컬러 +0 | 성공 쇼피JSON 7·페이지 7 |
| Rag & bone | ✅ | 233/233 (100%) | 233/233 (100%) | 혼용률 +0 컬러 +0 |  |
| Shopbop | ✅ | 572/572 (100%) | 572/572 (100%) | 혼용률 +0 컬러 +0 |  |
| Vuori | ✅ | 219/219 (100%) | 219/219 (100%) | 혼용률 +0 컬러 +0 |  |

## 상품 상세(설명·디테일·사진 전부·컬러 전부) — 이번 실행에서 읽은 브랜드 35개

별도 저장 칸(detail:<site>)에 쌓인다. 상품 수 대비 — 설명 10111 · 디테일 7405 · 사진 10359 · 컬러 전부 7048 / 12956

| 브랜드 | 상품 | 설명 | 디테일 | 사진 | 컬러 전부 | 이번 +N | 가드(설명 보류·글머리표 뺌) | 저장 크기 |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| Good American | 681 | 516 | 488 | 516 | 490 | +7 | 0·0 | 651KB |
| Whitestuff | 676 | 551 | 551 | 551 | 0 | +5 | 0·0 | 335KB |
| Bash | 618 | 615 | 611 | 611 | 611 | +6 | 0·0 | 923KB |
| Nike | 556 | 556 | 556 | 553 | 544 | +0 | 0·0 | 461KB |
| Addidas | 537 | 0 | 0 | 0 | 0 | +0 | 0·0 | 1KB |
| Zara | 499 | 120 | 25 | 120 | 120 | +0 | 0·0 | 166KB |
| Evereve | 496 | 473 | 338 | 474 | 444 | +45 | 0·0 | 471KB |
| Splendid | 478 | 473 | 460 | 473 | 473 | +51 | 0·0 | 885KB |
| Frank & Eileen | 472 | 446 | 313 | 446 | 430 | +2 | 0·0 | 646KB |
| Everlane | 461 | 454 | 191 | 456 | 0 | +31 | 0·0 | 573KB |
| Sanctuary | 427 | 298 | 427 | 427 | 418 | +12 | 0·0 | 549KB |
| Mint velvet | 417 | 312 | 0 | 412 | 0 | +20 | 0·0 | 451KB |
| Scoth & soda | 404 | 384 | 373 | 386 | 378 | +0 | 0·0 | 413KB |
| Xirena | 404 | 345 | 222 | 345 | 340 | +67 | 0·0 | 333KB |
| Tuckernuck | 375 | 375 | 369 | 375 | 364 | +1 | 0·0 | 618KB |
| Fatface | 374 | 1 | 1 | 1 | 1 | +1 | 0·0 | 3KB |
| Boden | 368 | 341 | 231 | 340 | 0 | +8 | 0·0 | 468KB |
| Veronica Beard | 365 | 365 | 251 | 365 | 363 | +107 | 0·0 | 558KB |
| Bassike | 351 | 344 | 344 | 344 | 0 | +147 | 0·0 | 505KB |
| Thread & supply | 350 | 350 | 350 | 350 | 345 | +9 | 0·0 | 697KB |
| Stateside | 350 | 349 | 191 | 349 | 1 | +15 | 0·0 | 398KB |
| Oak + Fort | 340 | 338 | 332 | 338 | 324 | +7 | 0·0 | 564KB |
| Rails | 304 | 304 | 49 | 304 | 0 | +24 | 0·0 | 316KB |
| Sundry | 287 | 287 | 0 | 285 | 245 | +9 | 0·0 | 266KB |
| Anthropologie | 263 | 0 | 0 | 0 | 0 | +0 | 0·0 | 1KB |
| Z Supply | 254 | 253 | 40 | 253 | 229 | +8 | 0·0 | 407KB |
| The Great | 245 | 245 | 135 | 245 | 233 | +13 | 0·0 | 388KB |
| Frame | 242 | 241 | 0 | 241 | 237 | +1 | 0·0 | 247KB |
| Dickies | 240 | 240 | 173 | 240 | 240 | +24 | 0·0 | 379KB |
| Leset | 236 | 235 | 92 | 235 | 218 | +1 | 0·0 | 386KB |
| rouje | 234 | 151 | 144 | 151 | 0 | +2 | 0·0 | 212KB |
| Sezane | 203 | 0 | 0 | 0 | 0 | +0 | 0·0 | 0KB |
| Club monaco | 173 | 149 | 148 | 173 | 0 | +22 | 0·0 | 181KB |
| Patagonia | 168 | 0 | 0 | 0 | 0 | +0 | 0·0 | 0KB |
| Garnet hill | 108 | 0 | 0 | 0 | 0 | +0 | 0·0 | 4KB |

<details><summary>가드가 뺀 글(브랜드 대부분에 똑같이 붙은 글 — 사이트 공통 문구로 보고 저장하지 않음)</summary>

- Rails · 글머리표 — imported · recommend ordering true to size

</details>

## 껍데기로 센 페이지 예 (12)

차단 화면은 아닌데 카탈로그 상품명이 화면 글에 없어 '사이트 미표기(none)'로 적지 않은 페이지.

- W's Capilene® Cool Trail Shirt - Stratapeaks in Cover Green — https://www.patagonia.com/product/womens-capilene-cool-trail-shirt-stratapeaks/23726.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Desert Glow Oversized T-Shirt in Weathered Stone — https://www.patagonia.com/product/womens-desert-glow-oversized-t-shirt/37868.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Fitz Roy Massif Easy-Cut Pocket Tee in Snowmelt Blue — https://www.patagonia.com/product/womens-fitz-roy-massif-easy-cut-pocket-tee/37901.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Capilene® Cool Trail Cropped Shirt in Ink Black — https://www.patagonia.com/product/womens-capilene-cool-trail-cropped-shirt/24476.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's P-6 Cosmos Easy-Cut T-Shirt in Smolder Blue — https://www.patagonia.com/product/womens-p-6-cosmos-easy-cut-t-shirt/37909.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Pass It Around Relaxed Drop-Sleeve Organic T-Shirt in Bl — https://www.patagonia.com/product/womens-pass-it-around-relaxed-drop-sleeve-organic-t-shirt/37904.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's P-6 Logo Responsibili-Tee® in Fiber White — https://www.patagonia.com/product/womens-p-6-logo-responsibili-tee/37567.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Capilene® Cool Daily Shirt - Spoke Stencil in Gumtree Gr — https://www.patagonia.com/product/womens-capilene-cool-daily-shirt-spoke-stencil/45492.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Mountain Sun Band Easy-Cut T-Shirt in Undyed Natural — https://www.patagonia.com/product/womens-mountain-sun-band-easy-cut-t-shirt/37900.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Daily Crew in Berm Brown — https://www.patagonia.com/product/womens-daily-crewneck-sweatshirt/42172.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Ahnya Pullover in Virtually Blue — https://www.patagonia.com/product/womens-ahnya-pullover/42151.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 
- W's Wilsie Pullover in Canopy Green — https://www.patagonia.com/product/womens-wilsie-pullover/42385.html
  > Patagonia Outdoor Clothing & Gear · Patagonia Outdoor Clothing & Gear Patagonia We’re working on it. System maintenance is in progress. We’ve got our hands full at the moment, but we should be up and 

## 혼용률이 엇갈린 상품 (63)

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
| Z Supply | https://zsupplyclothing.com/products/cozy-moment-skirt | Cotton 100% | Polyester 50% / Nylon 29% / Acrylic 15% / Wool 3% / Elastane 3% | 유지 |
| Z Supply | https://zsupplyclothing.com/products/the-socialite-denim-mini-skirt | Cotton 100% | Cotton 99% / Elastane 1% | 유지 |
| Z Supply | https://zsupplyclothing.com/products/crestview-plaid-skirt | Cotton 100% | Viscose 65% / Polyester 35% | 유지 |
| Evereve | https://evereve.com/products/rowan-cami-layer-tee-blue-brown | Cotton 94% / Elastane 6% ‖ Polyester 100% | Cotton 94% / Elastane 6% | 유지 |
| Evereve | https://evereve.com/products/indy-terry-tank-cherry-navystripe | Cotton 56% / Polyester 44% ‖ Cotton 100% | Cotton 56% / Polyester 44% | 유지 |
| Evereve | https://evereve.com/products/indy-gauze-top-midnight | Cotton 50% / Viscose 50% ‖ Cotton 100% | Cotton 50% / Viscose 50% | 유지 |
| Evereve | https://evereve.com/products/sutton-sweatshirt-heathergrey | Cotton 60% / Polyester 40% ‖ Cotton 59% / Polyester 38% / Elastane 3% | Cotton 60% / Polyester 40% | 유지 |
| Evereve | https://evereve.com/products/kimberly-faux-leather-top-wine | Polyurethane 100% ‖ Viscose 70% / Polyester 22% / Cotton 5% | Polyurethane 100% ‖ Viscose 70% / Polyester 22% / Cotton 5% / Metallic 3% | 유지 |
| Evereve | https://evereve.com/products/one-of-a-kind-lace-top-burntcocoa-bone | Viscose 66% / Polyester 34% ‖ Nylon 100% | Viscose 66% / Polyester 34% | 유지 |
| Veronica Beard | https://veronicabeard.com/products/miller-tailored-vest-navy | Polyester 63% / Viscose 27% / Cotton 7% / Elastane 3% | Polyester 63% / Viscose 27% / Cotton 7% / Elastane 3% ‖ Polyester 96% / Elastane 4% | 유지 |
| Veronica Beard | https://veronicabeard.com/products/elthea-belted-midi-dress-black-1 | Viscose 83% / Polyester 17% | Viscose 60% / Nylon 22% / Polyester 14% / Elastane 4% | 유지 |
| Veronica Beard | https://veronicabeard.com/products/cole-wide-leg-pant-sand | Cotton 50% / Viscose 50% | Cotton 50% / Viscose 50% ‖ Viscose 53% / Polyester 47% | 유지 |

## 브랜드별 표본 — 사람이 열어 확인할 것

채운 것: 이번에 읽은 값 · 출처 · 그 값을 페이지 글에서 다시 찾은 자리(추출기와 따로 찾음 — 못 찾으면 비어 있다).
빈 것: 페이지는 읽었는데 혼용률이 없던 상품(사이트 미표기로 적었을 것). 못 읽음: 막힘·껍데기·값 없음.

### Addidas — 채움 3 · 빈 것 0 · 못 읽음 27

- ✅ https://www.adidas.com/us/essentials-logo-tee/GL0649.html
  - 값: **Cotton 100%** (보관본 20250720)
  - 페이지 글: 페이지 JSON: ….","subtitle":"Everyday tee with an ultra-sporty look.","usps":["Regular fit","Crewneck","100% cotton","Short sleeves","Imported"],"wash_care_instructions":{"care_instructions":[{"code":"B1","description":"Do no…
- ✅ https://www.adidas.com/us/argentina-26-away-cropped-jersey/KE5984.html
  - 값: **Polyester 100%** (보관본 20260410)
  - 페이지 글: 페이지 JSON: …jersey with Climacool for cool, dry game day comfort.","usps":["Regular fit","Crew neck","100% polyester (100% recycled)","Cropped","CLIMACOOL technology","Imported"],"wash_care_instructions":{"care_instructions":[…
- ✅ https://www.adidas.com/us/colombia-26-away-cropped-jersey/KE8088.html
  - 값: **Polyester 100%** (보관본 20260410)
  - 페이지 글: 페이지 JSON: …ng Climacool technology for cool, dry comfort.","usps":["Regular fit","Higher crew neck","100% polyester (100% recycled)","Interlock construction","Cropped length","CLIMACOOL technology","Sweat-wicking, quick-dryin…
- ⛔ 막힘(fetch,impit) · https://www.adidas.com/us/penn-state-nittany-lions-short-sleeve-blend-t-shirt/LF7553.html
- ⛔ 막힘(fetch,impit) · https://www.adidas.com/us/texas-a-m-aggies-womens-premium-fashion-tee/KQ9336.html
- ⛔ 막힘(fetch,impit) · https://www.adidas.com/us/w-hob-fw22/KF2117.html

### Anthropologie — 채움 1 · 빈 것 0 · 못 읽음 29

- ✅ https://www.anthropologie.com/shop/alemais-nanci-silk-shirt
  - 값: **Silk 100%** (보관본 20260810)
  - 페이지 글: 화면 글: …item arrives to you. Product Details Style No. 4139964850181; Color Code: 030 Woven from 100% silk satin, this relaxed blouse stands out with a vibrant botanical motif and contrasting border print. A classic…
- ⛔ 막힘(fetch,impit) · https://www.anthropologie.com/shop/terez-giants-zip-up-sweater
- ⛔ 막힘(fetch,impit) · https://www.anthropologie.com/shop/love-wednesday-puff-sleeve-peplum-blouse
- ⛔ 막힘(fetch,impit) · https://www.anthropologie.com/shop/susana-monaco-plunge-shawl-neck-top

### Bash — 채움 6 · 빈 것 0 · 못 읽음 0

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

### Boden — 채움 7 · 빈 것 1 · 못 읽음 7

- ✅ https://us.boden.com/products/women-erica-lace-top-black-t2229bla
  - 값: **Cotton 71% / Nylon 29%** (본문)
  - 페이지 글: 화면 글: …ze guide Model wears Model is wearing size 4 Model is 6'0 Fabric & care Composition Main: 71% cotton, 29% polyamide Care Machine washable View full details Reviews How we collect reviews How we collect reviews…
- ✅ https://us.boden.com/products/women-pia-ruffle-detail-top-light-lilac-enchanted-springs-t2148pin
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …hip Size guide Model wears Model is wearing size 2 Model is 6'0 Fabric & care Composition 100% cotton Care Machine washable View full details Reviews How we collect reviews How we collect reviews Every review on…
- ✅ https://us.boden.com/products/women-carmen-trim-detail-top-olive-flourishing-sprig-stamp-t1959grn
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …Reach for this hard-working 100% cotton long sleeve top when your jeans need a little elevation. The lace trim and colourful flower prints create a t…
- ✅ https://us.boden.com/products/women-essential-v-neck-vest-navy-t2158nav
  - 값: **Cotton 95% / Elastane 5%** (본문)
  - 페이지 글: 화면 글: …hip Size guide Model wears Model is wearing size 2 Model is 5'9 Fabric & care Composition 95% cotton, 5% elastane Care Machine washable View full details Reviews How we collect reviews How we collect reviews Ev…
- ✅ https://us.boden.com/products/women-essential-v-neck-vest-white-t2158wht
  - 값: **Cotton 95% / Elastane 5%** (본문)
  - 페이지 글: 화면 글: …hip Size guide Model wears Model is wearing size 2 Model is 5'9 Fabric & care Composition 95% cotton, 5% elastane Care Machine washable View full details Reviews How we collect reviews How we collect reviews Ev…
- ⬜ 빈 것(컬러·가격만) · https://us.boden.com/products/women-canonbury-tailored-pants-green-stripe-r0900mgr
- ⛔ 막힘·껍데기 · https://us.boden.com/products/women-nicola-cotton-midi-dress-green-geo-spectacle-d1746lgr
- ⛔ 막힘·껍데기 · https://us.boden.com/products/women-pleat-skirt-denim-dress-indigo-d1889ldn
- ⛔ 막힘·껍데기 · https://us.boden.com/products/women-mollie-linen-midi-dress-navy-d1512nvy

### Club monaco — 채움 22 · 빈 것 9 · 못 읽음 0

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
- ⬜ 빈 것(컬러·가격만) · https://www.clubmonaco.com/products/merino-sweater-pant-295900078-100
- ⬜ 빈 것(컬러·가격만) · https://www.clubmonaco.com/products/tab-front-skinny-pant-295887778-100
- ⬜ 빈 것(컬러·가격만) · https://www.clubmonaco.com/products/ribbed-sweater-pant-295102362-100

### Dickies — 채움 24 · 빈 것 0 · 못 읽음 0

- ✅ https://www.dickies.com/products/womens-flex-regular-fit-cargo-pants-dkwbt0020bk
  - 값: **Polyester 65% / Cotton 35%** (본문)
  - 페이지 글: 화면 글: …reach. High rise; Straight Leg Inseam: 32&quot; Moisture wicking 7.25 oz. Brushed Twill, 65% Polyester/35% Cotton Imported MORE LIKE THIS Previous Slide Next Slide Sale Sale Available Colors Women's FLEX Regular…
- ✅ https://www.dickies.com/products/womens-flex-regular-fit-cargo-pants-dkwbt0020dn
  - 값: **Polyester 65% / Cotton 35%** (본문)
  - 페이지 글: 화면 글: …reach. High rise; Straight Leg Inseam: 32&quot; Moisture wicking 7.25 oz. Brushed Twill, 65% Polyester/35% Cotton Imported MORE LIKE THIS Previous Slide Next Slide Sale Sale Available Colors Women's FLEX Regular…
- ✅ https://www.dickies.com/products/womens-flex-relaxed-fit-duck-carpenter-pants-dkfd2500rbk
  - 값: **Cotton 98% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …leg 32&quot; Inseam Stretch fabric for comfort and ease of movement 9.8 oz. Brushed Duck, 98% Cotton/2% Spandex Imported MORE LIKE THIS Previous Slide Next Slide Available Colors Women's FLEX Relaxed Fit Duck C…
- ✅ https://www.dickies.com/products/womens-flex-relaxed-fit-duck-carpenter-pants-dkfd2500rbd
  - 값: **Cotton 98% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …leg 32&quot; Inseam Stretch fabric for comfort and ease of movement 9.8 oz. Brushed Duck, 98% Cotton/2% Spandex Imported MORE LIKE THIS Previous Slide Next Slide Available Colors Women's FLEX Relaxed Fit Duck C…
- ✅ https://www.dickies.com/products/womens-flex-relaxed-fit-duck-carpenter-pants-dkfd2500rms
  - 값: **Cotton 98% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …leg 32&quot; Inseam Stretch fabric for comfort and ease of movement 9.8 oz. Brushed Duck, 98% Cotton/2% Spandex Imported MORE LIKE THIS Previous Slide Next Slide Available Colors Women's FLEX Relaxed Fit Duck C…

### Evereve — 채움 49 · 빈 것 0 · 못 읽음 0

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

### Everlane — 채움 2 · 빈 것 77 · 못 읽음 0

- ✅ https://www.everlane.com/products/womens-organic-cotton-box-cut-tee-vintage-red
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …ew neck, perfectly relaxed fit, slightly cropped length, easy short sleeves, it’s made of 100% organic cotton which makes it super breathable and soft to the touch. Like fries though, you can’t have just one, you’ll wan…
- ✅ https://www.everlane.com/products/womens-shimmy-cutaway-tank-airblue
  - 값: **Lyocell 88% / Elastane 12%** (본문)
  - 페이지 글: 화면 글: …Check out our sizing FAQs or contact us . CHAT WITH AN EXPERT Materials & Care Materials: 88% TENCEL™ Lyocell, 12% Elastane Did You Know? This garment is made with TENCEL™ Lyocell. Known for its smoothness and…
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-city-stripe-ruched-dress-haute-red
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-cozy-stretch-turtleneck-dress-charcoal
- ⬜ 빈 것(컬러·가격만) · https://www.everlane.com/products/womens-organic-cotton-striped-tee-dress-black-canvas-tan

### Fatface — 채움 1 · 빈 것 0 · 못 읽음 252

- ✅ https://www.fatface.com/style/sv080387/v80617
  - 값: **Shell 62% / Nylon 38% / Lining 100%** (JSON-LD)
  - 페이지 글: 화면 글: …e logo are available in sizes 18 and above. Read More Product Code: V80-617 Care & Fabric Shell 62% Viscose, 38% Nylon. Lining 100% LENZING™ ECOVERO™ Viscose. Machine washable. Price History Date Price Novembe…
- ⛔ 막힘(fetch,impit) · https://www.fatface.com/style/sv080350/y57924
- ⛔ 막힘(fetch,impit) · https://www.fatface.com/style/sv123399/y57925
- ⛔ 막힘(fetch,impit) · https://www.fatface.com/style/sv456009/y57934

### Frame — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://frame-store.com/products/the-tennis-polo-wf26ksw060-grms

### Frank & Eileen — 채움 2 · 빈 것 0 · 못 읽음 0

- ✅ https://www.frankandeileen.com/products/brennan-camel-italian-performance-corduroy
  - 값: **Cotton 97% / Elastane 3%** (본문)
  - 페이지 글: 화면 글: …a high-rise and slightly cropped length. Fits true to size Italian Performance Corduroy, 97% Cotton, 3% Elastane Description Brennan is the barrel jean we all want. Made in our plush Italian Performance Cordur…
- ✅ https://www.frankandeileen.com/products/jameson-skirt-black-watch-plaid-italian-performance-twill
  - 값: **Cotton 97% / Elastane 3%** (본문)
  - 페이지 글: 화면 글: …ng. Designed for a mid-rise and mini-length. Fits true to size Italian Performance Twill, 97% Cotton, 3% Elastane Description Our Jameson Skirt transforms the signature contour waistband and utility pockets of…

### Garnet hill — 채움 0 · 빈 것 6 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.garnethill.com/lilla-p-washed-twill-pants/clothing/categories/pants/744627
- ⬜ 빈 것(컬러·가격만) · https://www.garnethill.com/london-wool-blend-trousers/clothing/categories/pants/710861
- ⬜ 빈 것(컬러·가격만) · https://www.garnethill.com/calla-lightweight-tapered-twill-trousers/clothing/categories/pants/738977

### Good American — 채움 1 · 빈 것 43 · 못 읽음 0

- ✅ https://www.goodamerican.com/products/the-micro-cable-polo-sky
  - 값: **Wool 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …tweight merino wool. 18 1/2" long from shoulder Model is 5’9” and wearing size XS Fabric: 100% Merino Wool Care: Hand wash inside out in cold water. Do not bleach. Lay flat to dry. Do not iron. Dry cleanable.…
- ⬜ 빈 것(컬러·가격만) · https://www.goodamerican.com/products/always-fits-good-petite-straight-jeans-indigo571
- ⬜ 빈 것(컬러·가격만) · https://www.goodamerican.com/products/always-fits-good-classic-bootcut-jeans-long-inseam-indigo446
- ⬜ 빈 것(컬러·가격만) · https://www.goodamerican.com/products/never-fades-good-legs-straight-jeans-black001

### H&M — 채움 0 · 빈 것 0 · 못 읽음 32

- ⛔ 막힘(fetch,impit) · https://www2.hm.com/en_us/productpage.1370459002.html
- ⛔ 막힘(fetch,impit) · https://www2.hm.com/en_us/productpage.1351503001.html
- ⛔ 막힘(fetch,impit) · https://www2.hm.com/en_us/productpage.1385195001.html

### Leset — 채움 0 · 빈 것 9 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://leset.com/products/barb-slip-skirt-black
- ⬜ 빈 것(컬러·가격만) · https://leset.com/products/barb-slip-skirt-chocolate
- ⬜ 빈 것(컬러·가격만) · https://leset.com/products/barb-slip-skirt-gunmetal

### Lululemon — 채움 0 · 빈 것 0 · 못 읽음 30

- ⛔ 막힘(fetch,impit) · https://shop.lululemon.com/c/women-olive-t-shirts/n1td6fzwx7w
- ⛔ 막힘(fetch,impit) · https://shop.lululemon.com/c/women-blue-t-shirts/n10vt3zwx7w
- ⛔ 막힘(fetch,impit) · https://shop.lululemon.com/c/women-navy-t-shirts/n1ea52zwx7w

### Mint velvet — 채움 30 · 빈 것 10 · 못 읽음 0

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
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/burgundy-lace-detail-mini-dress
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/black-velvet-cape-detail-maxi-dress
- ⬜ 빈 것(컬러·가격만) · https://mintvelvet.com/products/black-cape-sleeve-mini-dress

### Nike — 채움 0 · 빈 것 1 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://www.nike.com/t/victory-womens-dri-fit-short-flouncy-tennis-skirt-0SDyNPZH/FD5577-407

### Oak + Fort — 채움 6 · 빈 것 1 · 못 읽음 0

- ✅ https://oakandfort.ca/products/halter-neck-layered-long-sleeve-top-sw-17592-w
  - 값: **Polyester 39% / Nylon 30% / Acrylic 25% / Wool 6%** (본문)
  - 페이지 글: 화면 글: …ring a size S Fit & Sizing Runs small True to size Runs large Size guide Materials & Care 39% Polyester, 30% Nylon, 25% Acrylic, 6% Wool Machine wash cold gentle cycle separately. Only non-chlorine bleach if neede…
- ✅ https://oakandfort.ca/products/knit-one-shoulder-twist-front-tank-sw-15846-w
  - 값: **Polyester 49% / Viscose 34% / Nylon 17%** (본문)
  - 페이지 글: 화면 글: …ring a size S Fit & Sizing Runs small True to size Runs large Size guide Materials & Care 49% Polyester, 34% Viscose, 17% Nylon / Exclusive of trims Hand wash cold. Only non-chlorine bleach if needed. Lay flat to…
- ✅ https://oakandfort.ca/products/ribbed-knit-halter-tank-top-sw-15840-w
  - 값: **Polyester 49% / Viscose 33% / Nylon 16% / Elastane 2%** (본문)
  - 페이지 글: 화면 글: …ring a size S Fit & Sizing Runs small True to size Runs large Size guide Materials & Care 49% Polyester, 33% Viscose, 16% Nylon, 2% Spandex / Exclusive of trims Hand wash cold. Only non-chlorine bleach if needed.…
- ✅ https://oakandfort.ca/products/relaxed-fit-tunic-tank-top-sw-15845-w
  - 값: **Polyester 60% / Viscose 40%** (본문)
  - 페이지 글: 화면 글: …ring a size S Fit & Sizing Runs small True to size Runs large Size guide Materials & Care 60% Polyester, 40% Viscose / Exclusive of trims Hand wash cold separately. Do not bleach. Lay flat to dry. Reshape when dam…
- ✅ https://oakandfort.ca/products/knit-cowl-neck-halter-top-sw-15671-w
  - 값: **Polyester 58% / Viscose 42%** (본문)
  - 페이지 글: 화면 글: …ring a size S Fit & Sizing Runs small True to size Runs large Size guide Materials & Care 58% Polyester, 42% Viscose / Exclusive of trims Hand wash cold. Only non-chlorine bleach if needed. Lay flat to dry. Reshap…
- ⬜ 빈 것(컬러·가격만) · https://oakandfort.ca/products/polka-dot-halter-neck-top-wt-15889-w

### Patagonia — 채움 1 · 빈 것 0 · 못 읽음 29

- ✅ https://www.patagonia.com/product/womens-desert-glow-oversized-t-shirt/37868.html
  - 값: **Cotton 100%** (보관본 20260421)
  - 페이지 글: 화면 글: …tyle No. 37868 Fit Relaxed fit For more information visit our Size Guide Specs & Features 100% Organic Cotton Tee US-grown organic cotton is sourced from member farms of the Texas Organic Cotton Marketing Cooperative Ro…
- ⛔ 막힘·껍데기 · https://www.patagonia.com/product/womens-capilene-cool-trail-shirt-stratapeaks/23726.html
- ⛔ 막힘·껍데기 · https://www.patagonia.com/product/womens-fitz-roy-massif-easy-cut-pocket-tee/37901.html
- ⛔ 막힘·껍데기 · https://www.patagonia.com/product/womens-p-6-cosmos-easy-cut-t-shirt/37909.html

### Rails — 채움 19 · 빈 것 17 · 못 읽음 0

- ✅ https://www.rails.com/products/beckley-sweatshirt-sunshine
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …ench terry sweatshirt with dropped shoulders, ribbed trim, and soutached suns throughout. 100% Cotton Imported. FIT Recommend ordering true to size. Front Body Length: 24″ (Measured from size S.)…
- ✅ https://www.rails.com/products/barry-pant-blue-lagoon
  - 값: **Cotton 55% / Lyocell 45%** (Shopify JSON)
  - 페이지 글: 화면 글: …ing waistband, and legs that taper slightly at the hem. Finished with side slant pockets. 55% Cotton / 45% Lyocell Imported. FIT Recommend ordering true to size. Inseam Length: 28" Front Rise: 11 1/2″ (Measured…
- ✅ https://www.rails.com/products/normandie-pant-antique-blue
  - 값: **Cotton 55% / Lyocell 45%** (Shopify JSON)
  - 페이지 글: 화면 글: …t cotton lyocell pant features an adjustable drawstring toggle and a relaxed, drapey fit. 55% Cotton / 45% Lyocell Imported. FIT Recommend ordering true to size. Inseam Length: 31 1/2" Front Rise: 11 1/4″ (Meas…
- ✅ https://www.rails.com/products/cameron-pant-black
  - 값: **Polyester 79% / Viscose 17% / Elastane 4%** (Shopify JSON)
  - 페이지 글: 화면 글: …ered leg, and side and back pockets. Unlined for comfort, structured enough for anywhere. 79% Polyester / 17% Rayon / 4% Spandex Imported. FIT Recommend ordering true to size. Inseam Length: 30" Front Rise: 11 1/8…
- ✅ https://www.rails.com/products/emmie-pant-cocoa-floral-embroidery
  - 값: **Linen 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …soutached floral embroidery, and a relaxed fit that travels well and wears effortlessly. 100% Linen Imported. FIT Recommend ordering true to size. Inseam Length: 29 1/2" Front Rise: 12 1/4″ (Measured from size…
- ⬜ 빈 것(컬러·가격만) · https://www.rails.com/products/camellia-dress-lace-floral
- ⬜ 빈 것(컬러·가격만) · https://www.rails.com/products/eva-dress-atlantic
- ⬜ 빈 것(컬러·가격만) · https://www.rails.com/products/clairemont-dress-sorrento-braided

### Sanctuary — 채움 12 · 빈 것 0 · 못 읽음 0

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

### Scoth & soda — 채움 0 · 빈 것 15 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://scotchandsoda.com/products/tencel-sleeveless-sweatshirt-u9e00660t-u641-electric-pink
- ⬜ 빈 것(컬러·가격만) · https://scotchandsoda.com/products/gathered-sleeve-oversized-fit-hoodie-178173-u698-cadillac-pink
- ⬜ 빈 것(컬러·가격만) · https://scotchandsoda.com/products/boxy-fit-embroidered-sweatshirt-177277-0005-antra

### Sezane — 채움 2 · 빈 것 0 · 못 읽음 28

- ✅ https://www.sezane.com/us-en/product/damon-trousers/navy
  - 값: **Polyester 54% / Wool 44% / Elastane 2% / Viscose 100%** (보관본 20260203)
  - 페이지 글: 화면 글: …ng Lined Inside leg length: 66 cm / 26 in (on all sizes) Behind the label : Main Fabric : 54% Polyester, 44% Wool, 2% Elastane *of which 51% of Recycled polyester Lining : 100% Viscose Made in Romania Environmenta…
- ✅ https://www.sezane.com/us-en/product/toni-trousers/camel
  - 값: **Goat Leather 100% / Viscose 100%** (보관본 20260919)
  - 페이지 글: 화면 글: …tening Inside leg length 31.3 in / 79.5 cm (for size 36) Behind the label : Main Fabric : 100% Goat leather Lining : 100% Viscose Made in India Environmental qualities product sheet Traceability : Made in : India Care…
- ⛔ 막힘(fetch,impit) · https://www.sezane.com/us-en/product/marc-pant/navy
- ⛔ 막힘(fetch,impit) · https://www.sezane.com/us-en/product/salvatore-pant/black
- ⛔ 막힘(fetch,impit) · https://www.sezane.com/us-en/product/marino-trousers/navy

### Splendid — 채움 2 · 빈 것 83 · 못 읽음 0

- ✅ https://splendid.com/products/alessi-romper-1
  - 값: **Lyocell 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …The Alessi Romper makes getting out the door a piece of cake. It's cut from 100% lyocell for a lightweight, breathable feel. Its button-down bodice has an optional waist belt that can be tied for a…
- ✅ https://splendid.com/products/high-waist-wide-leg-jean
  - 값: **Elastane 1% / Elastomultiester 9% / Modal 11% / Cotton 79%** (Shopify JSON)
  - 페이지 글: 화면 글: …y look. Pair with a tee on the weekends or style with boots and a sweater for the office. 1% Spandex, 9% Elastomultiester, 11% Modal, 79% Cotton High waisted Wide leg Cropped flare Iconic 5-pocket design Distre…
- ⬜ 빈 것(컬러·가격만) · https://splendid.com/products/splendid-x-wild-one-star-sweater
- ⬜ 빈 것(컬러·가격만) · https://splendid.com/products/zeena-zip-up-cardigan
- ⬜ 빈 것(컬러·가격만) · https://splendid.com/products/splendid-x-cellajaneblog-stripe-front-seam-sweater

### Stateside — 채움 10 · 빈 것 37 · 못 읽음 0

- ✅ https://shopstateside.us/products/softest-fleece-raglan-sweatshirt-with-side-slits-in-new-navy
  - 값: **Modal 78% / Cotton 16% / Elastane 6%** (본문)
  - 페이지 글: 화면 글: …h detail, allows added dimension to seasonal layering. #SP26-130-5820-NNVY Content + Care 78% Siro Micro Modal 16% Cotton 6% Spandex Made in the USA Model wears size small. Review our SIZE CHART for sizing help informati…
- ✅ https://shopstateside.us/products/softest-fleece-drawstring-sweatpant-with-pockets-in-new-navy
  - 값: **Modal 78% / Cotton 16% / Elastane 6%** (본문)
  - 페이지 글: 화면 글: …they offer all-day comfort with a casual, sporty look. #SP26-130-6043-NNVY Content + Care 78% Siro Micro Modal 16% Cotton 6% Spandex Made in the USA Model wears size small. Review our SIZE CHART for sizing help SKU SP26-…
- ✅ https://shopstateside.us/products/softest-fleece-v-neck-raglan-sweatshirt-in-new-navy
  - 값: **Modal 78% / Cotton 16% / Elastane 6%** (본문)
  - 페이지 글: 화면 글: …turtleneck inside if it's too cold or just on its own. #SP26-130-6116-NNVY Content + Care 78% Siro Micro Modal 16% Cotton 6% Spandex Made in the USA Model wears size small. Review our SIZE CHART for sizing help SKU SP26-…
- ✅ https://shopstateside.us/products/softest-fleece-drawstring-pant-in-new-navy-1
  - 값: **Modal 78% / Cotton 16% / Elastane 6%** (본문)
  - 페이지 글: 화면 글: …they offer all-day comfort with a casual, sporty look. #SP26-130-6117-NNVY Content + Care 78% Siro Micro Modal 16% Cotton 6% Spandex Made in the USA Review our SIZE CHART for sizing help SKU SP26-130-6117-NNVY-XS Size Ch…
- ✅ https://shopstateside.us/products/fine-2x1-rib-cropped-high-neck-tank-in-new-navy
  - 값: **Modal 95% / Elastane 5%** (본문)
  - 페이지 글: 화면 글: …oft and buttery fabric that is easy to move around in. #SP26-618-5815-NNVY Content + Care 95% Siro Micro Modal 5% Spandex Made in the USA Model wears size small. Review our SIZE CHART for sizing help information. SKU SP2…
- ⬜ 빈 것(컬러·가격만) · https://shopstateside.us/products/linen-shirt-in-poppy
- ⬜ 빈 것(컬러·가격만) · https://shopstateside.us/products/faux-fur-vest-in-tutu
- ⬜ 빈 것(컬러·가격만) · https://shopstateside.us/products/voile-short-sleeve-dolman-shirt-in-white

### Sundry — 채움 4 · 빈 것 6 · 못 읽음 0

- ✅ https://sundryclothing.com/products/sundry-athletic-pant-in-heather-grey
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …hems in a classic heather grey, they’re perfect for laid-back lounging or casual outings. 100% Cotton Made in USA Machine wash cold- Do not bleach Tumble dry at low heat - cool iron if needed 0= XS, 1 = S, 2 = M…
- ✅ https://sundryclothing.com/products/sundry-sport-sweatpant-in-sea-breeze
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …drawstring. Easy to wear with a tee or cami. We paired the sweatpants with a graphic tee. 100% Cotton Made in USA Machine wash cold- Do not bleach Tumble dry at low heat - cool iron if needed 0= XS, 1 = S, 2 = M…
- ✅ https://sundryclothing.com/products/sundry-straight-pant-in-washed-black
  - 값: **Cotton 64% / Polyester 36%** (Shopify JSON)
  - 페이지 글: 화면 글: …, roomy pockets, and a fluid drape, they’re perfect for laid-back days or cozy nights in. 64% Cotton 36% Polyester Made in USA Machine wash cold- Do not bleach Tumble dry at low heat - cool iron if needed 0= XS…
- ✅ https://sundryclothing.com/products/sundry-basic-sweatpant-in-blue-wash
  - 값: **Cotton 50% / Polyester 50%** (Shopify JSON)
  - 페이지 글: 화면 글: …ngs tipped in neon coral accents, adding a playful touch to the clean, minimalist design. 50% Cotton 50% Polyester Made in USA Machine wash cold- Do not bleach Tumble dry at low heat - cool iron if needed 0= XS…
- ⬜ 빈 것(컬러·가격만) · https://sundryclothing.com/products/sundry-raglan-sweatshirt-in-blue-wash
- ⬜ 빈 것(컬러·가격만) · https://sundryclothing.com/products/softest-fleece-crewneck-sweatshirt-in-signature-green
- ⬜ 빈 것(컬러·가격만) · https://sundryclothing.com/products/softest-fleece-hoodie-in-signature-green

### The Great — 채움 12 · 빈 것 2 · 못 읽음 0

- ✅ https://thisisthegreat.com/products/the-lattice-lace-victorian-top-white
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …36 48 40 42 44 46 48 50 JP 3 5 7 9 11 13 15 17 19 21 UK 2 4 6 8 10 12 14 16 18 20 Details 100% Cotton Dry Clean Only Imported how to STYLE it Link to The Ford Jean. -- Foundry Wash Add to bag Link to The Silk Ba…
- ✅ https://thisisthegreat.com/products/the-cotillion-top-pink-dot
  - 값: **Polyester 100% ‖ Viscose 100%** (본문)
  - 페이지 글: 화면 글: …36 48 40 42 44 46 48 50 JP 3 5 7 9 11 13 15 17 19 21 UK 2 4 6 8 10 12 14 16 18 20 Details 100% Polyester Cami Lining: 100% Viscose Dry Clean Only Imported how to STYLE it Link to The Tracksuit Pintuck Pant. -- Choc…
- ✅ https://thisisthegreat.com/products/the-zenith-top-copper-bubble-dot
  - 값: **Silk 100%** (본문)
  - 페이지 글: 화면 글: …36 48 40 42 44 46 48 50 JP 3 5 7 9 11 13 15 17 19 21 UK 2 4 6 8 10 12 14 16 18 20 Details 100% Silk Dry Clean Only Imported how to STYLE it Link to The Woodside Toggle Coat. -- Cream Add to bag Link to The For…
- ✅ https://thisisthegreat.com/products/the-smocked-flounce-top-tan-leopard
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …36 48 40 42 44 46 48 50 JP 3 5 7 9 11 13 15 17 19 21 UK 2 4 6 8 10 12 14 16 18 20 Details 100% Cotton Machine wash cold gentle cycle with like colors. Do not bleach. Tumble dry low or hang/line dry. Warm iron if…
- ✅ https://thisisthegreat.com/products/the-soutache-suit-vest-black
  - 값: **Polyester 65% / Viscose 35%** (본문)
  - 페이지 글: 화면 글: …36 48 40 42 44 46 48 50 JP 3 5 7 9 11 13 15 17 19 21 UK 2 4 6 8 10 12 14 16 18 20 Details 65% Polyester 35% Viscose Dry Clean Only Imported Stetson & THE GREAT. apparel is available for return or exchange within 1…
- ⬜ 빈 것(컬러·가격만) · https://thisisthegreat.com/products/the-fringe-top-black
- ⬜ 빈 것(컬러·가격만) · https://thisisthegreat.com/products/great-gift-card

### Thread & supply — 채움 9 · 빈 것 2 · 못 읽음 0

- ✅ https://threadandsupply.com/collections/pullovers/products/serenity-fleece-crewneck-sweatshirt-aug25
  - 값: **Cotton 82% / Nylon 15% / Elastane 3%** (Shopify JSON)
  - 페이지 글: 화면 글: …for a size small: Length: 23.5" Chest: 20.5" Sleeve Length: 21 3/4" Fabric Content/Care: 82% Cotton 15% Nylon 3% Spandex Machine Wash Cold Import…
- ✅ https://threadandsupply.com/collections/pullovers/products/marion-fringe-top-aug25
  - 값: **Cotton 65% / Polyester 35%** (Shopify JSON)
  - 페이지 글: 화면 글: …ze small: Length: 23.5" Chest: 20" Sleeve length: 21.5" Sweep: 19.5" Fabric Content/Care: 65% Cotton 35% Polyester Machine Wash Cold Import…
- ✅ https://threadandsupply.com/collections/pullovers/products/dolly-sweater-hoodie-aug25
  - 값: **Viscose 51% / Polyester 29% / Nylon 20%** (Shopify JSON)
  - 페이지 글: 화면 글: …urements for a size small: Length: 22" Chest: 19" Sleeve Length: 22" Fabric Content/Care: 51% Viscose 29% Polyester 20% Nylon Machine Wash Cold Import…
- ✅ https://threadandsupply.com/collections/pullovers/products/piper-pullover-jul25
  - 값: **Polyester 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …ents for a size small: Length: 23.5" Chest: 20.5" Sleeve Length: 30" Fabric Content/Care: 100% Polyester Machine Wash Cold Import…
- ✅ https://threadandsupply.com/collections/pullovers/products/helen-sweatshirt-jul25
  - 값: **Cotton 80% / Polyester 20%** (Shopify JSON)
  - 페이지 글: 화면 글: …ts for a size small: Length: 21.5" Chest: 20.5" Sleeve Length: 28.5" Fabric Content/Care: 80% Cotton 20% Polyester Machine Wash Cold Import…
- ⬜ 빈 것(컬러·가격만) · https://threadandsupply.com/products/becka-top-jul26
- ⬜ 빈 것(컬러·가격만) · https://threadandsupply.com/products/ora-dress-jun26

### Tuckernuck — 채움 0 · 빈 것 14 · 못 읽음 0

- ⬜ 빈 것(컬러·가격만) · https://tnuck.com/products/french-blue-sleeveless-bessette-button-down
- ⬜ 빈 것(컬러·가격만) · https://tnuck.com/products/black-sleeveless-bessette-button-down
- ⬜ 빈 것(컬러·가격만) · https://tnuck.com/products/white-sleeveless-bessette-button-down

### Veronica Beard — 채움 107 · 빈 것 0 · 못 읽음 0

- ✅ https://veronicabeard.com/products/drexler-henley-top-green-shadow
  - 값: **Polyester 96% / Elastane 4%** (본문)
  - 페이지 글: 화면 글: …s dark olive long-sleeve tee pairs back to anything in your closet with ease. Composition 96% Polyester, 4% Elastane Care Turn inside out and machine wash cold. Lay flat. Style #J26FA0235 Details A foundational pi…
- ✅ https://veronicabeard.com/products/pruitt-mesh-t-shirt-black-limestone
  - 값: **Nylon 95% / Elastane 5%** (본문)
  - 페이지 글: 화면 글: …ndational piece, this black top is perfect on its own or as a layering piece. Composition 95% Polyamide, 5% Elastane Care Machine wash cold. Tumble dry. Style #J27RE0151 Details A new take on the VB-favorite Pruit…
- ✅ https://veronicabeard.com/products/sebastian-embellished-t-shirt-black
  - 값: **Cotton 95% / Elastane 5%** (본문)
  - 페이지 글: 화면 글: …ated classic, this black T-shirt adds a hint of shine to your everyday looks. Composition 95% Cotton, 5% Elastane Care Turn inside out and machine wash cold. Lay flat. Style #J26FA0168 Details The VB-favorite S…
- ✅ https://veronicabeard.com/products/coralee-puff-sleeve-top-garnet-rose
  - 값: **Cotton 96% / Elastane 4%** (본문)
  - 페이지 글: 화면 글: …making, style this rose-pink shirt with all your favorite pieces year-round. Composition 96% Cotton, 4% Elastane Care Turn inside out and machine wash cold. Lay flat. Style #J27RE0168 Details Our feminine take…
- ✅ https://veronicabeard.com/products/sebastian-graphic-t-shirt-white
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …rfect off-duty staple, style this white tee with all your wardrobe favorites. Composition 100% Cotton Care Turn inside out and machine wash cold. Tumble dry. Style #J26FA0261 Details The Sebastian is a classic T…

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

### Xirena — 채움 67 · 빈 것 0 · 못 읽음 0

- ✅ https://www.xirena.com/products/merlot-ink-clementine-top
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …with ruffle detailing and shirred puff sleeves. Fabric Description: Savannah Printed Luna Cotton / 100% Cotton Care Guide: Machine wash cold, gentle cycle, tumble dry low Provenance: Imported Style Number: X5LUP04…
- ✅ https://www.xirena.com/products/blue-lark-dorien-top
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …ar, partial button-front, shirred blouson sleeves, and ruffled cuffs. Fabric Description: Cotton Poplin / 100% Cotton Care Guide: Machine wash cold, gentle cycle, tumble dry low Provenance: Los Angeles Style Number: X5CT…
- ✅ https://www.xirena.com/products/bronze-alloy-sabina-top
  - 값: **Viscose 83% / Nylon 17%** (본문)
  - 페이지 글: 화면 글: …rred front and back yokes, and a stitched collar tie. Fabric Description: Marlon Stripe / 83% Viscose, 17% Polyamide Care Guide: Machine wash cold, gentle cycle, tumble dry low Provenance: Imported Style Number:…
- ✅ https://www.xirena.com/products/pearl-white-gilda-top
  - 값: **Cotton 100%** (본문)
  - 페이지 글: 화면 글: …nt and contrast grosgrain piping along the front yoke. Fabric Description: Paper Poplin / 100% Cotton Care Guide: Machine wash cold, gentle cycle, tumble dry low Provenance: Los Angeles Style Number: X5PPP048 Si…
- ✅ https://www.xirena.com/products/olive-brown-colette-top
  - 값: **Cupro 70% / Viscose 30%** (본문)
  - 페이지 글: 화면 글: …e-trimmed V-neck, adjustable spaghetti straps, and a lace hem. Fabric Description: Verity Cupro Viscose / 70% Cupro, 30% Viscose Care Guide: Dry clean only Provenance: Imported Style Number: X5VVC045 Size & Fit Size & F…

### Z Supply — 채움 8 · 빈 것 1 · 못 읽음 0

- ✅ https://zsupplyclothing.com/products/trainer-stripe-pant
  - 값: **Cotton 100%** (Shopify JSON)
  - 페이지 글: 화면 글: …Laidback with a sporty feel, these wide leg pants are made from soft 100% cotton French terry that feels like an everyday favorite from day one. Contrast side stripes add a retro-inspired fi…
- ✅ https://zsupplyclothing.com/products/waverton-short-sleeve-tee
  - 값: **Cotton 52% / Viscose 48%** (본문)
  - 페이지 글: 화면 글: …settles in. Lightweight Midweight Heavyweight Details Crew neck Short sleeve Lightweight 52% Cotton, 48% Viscose Hand Wash Cold Separately, Reshape and Lay Flat to Dry, Or Dry Clean Size & Fit Regular fit Leng…
- ✅ https://zsupplyclothing.com/products/sabrina-top
  - 값: **Viscose 92% / Elastane 8%** (본문)
  - 페이지 글: 화면 글: …urself reaching for on repeat. Details Off the shoulder Long sleeve Second Skin Baby Rib: 92% Rayon, 8% Spandex Machine Wash Cold, Gentle Cycle, Line Dry Size & Fit Fitted Length: 22" • Bust: 28 1/2" (Size S)…
- ✅ https://zsupplyclothing.com/products/ginger-bodysuit
  - 값: **Viscose 92% / Elastane 8%** (본문)
  - 페이지 글: 화면 글: …jacket and call it done. Details Scoop neck Long sleeve Snap front Second Skin Baby Rib: 92% Rayon, 8% Spandex Machine Wash Cold, Gentle Cycle, Lay Flat to Dry Size & Fit Fitted Bust: 31" • Waist: 26" (Size S…
- ✅ https://zsupplyclothing.com/products/kori-lace-inset-skirt
  - 값: **Polyester 100%** (본문)
  - 페이지 글: 화면 글: …the whole thing feeling refreshingly uncomplicated. Details Elastic waistband Luxe Satin: 100% Polyester Hand Wash Cold, Line Dry or Dry Clean Size & Fit High rise Regular fit Length: 34" • Waist: 29" (Size S) Size…
- ⬜ 빈 것(컬러·가격만) · https://zsupplyclothing.com/products/the-perfect-striped-pant-1

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

### rouje — 채움 15 · 빈 것 2 · 못 읽음 0

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
- ⬜ 빈 것(컬러·가격만) · https://www.rouje.com/en-int/products/lesfillesenrouje-la-palette-visage-blush-highlighter
- ⬜ 빈 것(컬러·가격만) · https://www.rouje.com/en-int/products/lalia-velvet-midi-dress-floral-print-black

## 웹 아카이브 층

조회 203/600개(브랜드당 40) · 요청 244회 · 429 0 · 5xx 0 · 네트워크 오류 0 · 쿼리 포함 주소로만 찾은 것 0

| 브랜드 | 시도 상품 | 혼용률(지금 페이지) | 혼용률(보관본) | 보관본 없음 | 보관본 거부 | 주소 거부 | 아카이브 오류 | 상한·최근 물음 | 걸린 시간 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Fatface | 253 | 1 | 0 | 40 | 0 | 0 | 0 | 212 | 1139s |
| Bassike | 238 | 227 | 0 | 0 | 0 | 0 | 0 | 0 | 928s |
| Veronica Beard | 107 | 107 | 0 | 0 | 0 | 0 | 0 | 0 | 423s |
| Splendid | 85 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 499s |
| Everlane | 79 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 463s |
| Xirena | 67 | 67 | 0 | 0 | 0 | 0 | 0 | 0 | 266s |
| Evereve | 49 | 49 | 0 | 0 | 0 | 0 | 0 | 0 | 193s |
| Stateside | 47 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 259s |
| Good American | 44 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 263s |
| Mint velvet | 40 | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 178s |
| Rails | 36 | 19 | 0 | 0 | 0 | 0 | 0 | 0 | 135s |
| H&M | 32 | 0 | 0 | 32 | 0 | 0 | 0 | 0 | 142s |
| Club monaco | 31 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 96s |
| Addidas | 30 | 0 | 3 | 26 | 1 | 0 | 0 | 0 | 361s |
| Anthropologie | 30 | 0 | 1 | 23 | 2 | 0 | 0 | 4 | 321s |
| Patagonia | 30 | 0 | 1 | 14 | 15 | 0 | 0 | 0 | 181s |
| Sezane | 30 | 0 | 2 | 16 | 2 | 5 | 0 | 5 | 167s |
| Lululemon | 30 | 0 | 0 | 9 | 2 | 12 | 0 | 7 | 163s |
| Dickies | 24 | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 94s |
| rouje | 17 | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 98s |
| Scoth & soda | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 93s |
| Boden | 15 | 7 | 0 | 2 | 0 | 0 | 0 | 5 | 72s |
| The Great | 14 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 56s |
| Tuckernuck | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 83s |
| Sanctuary | 12 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 23s |
| Zara | 12 | 0 | 3 | 7 | 2 | 0 | 0 | 0 | 110s |
| Thread & supply | 11 | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 26s |
| Sundry | 10 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 40s |
| Leset | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 52s |
| Z Supply | 9 | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 35s |
| Whitestuff | 9 | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 35s |
| Oak + Fort | 7 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 27s |
| Garnet hill | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 22s |
| Bash | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 11s |
| Frank & Eileen | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 6s |
| Frame | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4s |
| Nike | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3s |

사유별 개수: 보관본 없음 169 · 찾음 10 · 보관본도 차단·빈 화면 1 · 보관본에 혼용률 없음 3 · 목록 페이지(JSON-LD) 1 · 보관본 열기 실패 1 · 상품 여러 개(JSON-LD) 12 · 상품 표시 없음 3 · 주소: 카테고리 이름 주소 5 · 주소: 카테고리 경로 12 · 혼용률 여러 벌(목록) 3

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
- Anthropologie — https://www.anthropologie.com/shop/terez-giants-zip-up-sweater
- Addidas — https://www.adidas.com/us/penn-state-nittany-lions-short-sleeve-blend-t-shirt/LF7553.html
- Anthropologie — https://www.anthropologie.com/shop/love-wednesday-puff-sleeve-peplum-blouse
- Addidas — https://www.adidas.com/us/texas-a-m-aggies-womens-premium-fashion-tee/KQ9336.html
- Anthropologie — https://www.anthropologie.com/shop/susana-monaco-plunge-shawl-neck-top
- Addidas — https://www.adidas.com/us/w-hob-fw22/KF2117.html
- Anthropologie — https://www.anthropologie.com/shop/sister-new-york-wool-cashmere-ballet-wrap-sweater
- Addidas — https://www.adidas.com/us/y-3-short-sleeve-dip-dye-utility-overshirt/KQ7287.html
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-high-low-fringed-poncho
- Addidas — https://www.adidas.com/us/tee/H57378.html
- Anthropologie — https://www.anthropologie.com/shop/varley-bryson-long-sleeve-half-zip-sweater
- Addidas — https://www.adidas.com/us/primelift-essentials-workout-boxy-mesh-t-shirt/KT3828.html
- Anthropologie — https://www.anthropologie.com/shop/rowing-blazers-cashmere-cotton-striped-v-neck-sweater
- Addidas — https://www.adidas.com/us/skateboarding-x-temple-of-skate-curb-tee/KS4338.html
- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-banded-dolman-top
- Addidas — https://www.adidas.com/us/knitted-tee/KW2606.html

**찾음**

- Zara — https://www.zara.com/us/en/long-sleeve-henley-t-shirt-p04174666.html?v1=595399393 — 20260926 · Cotton 95% / Elastane 5%
- Zara — https://www.zara.com/us/en/interlock-bomber-sweatshirt-p02335653.html?v1=560284773 — 20261107 · Cotton 75% / Polyester 17% / Elastane 8%
- Zara — https://www.zara.com/us/en/printed-bloomer-pants-p07910159.html?v1=565418278 — 20260910 · Lyocell 75% / Nylon 25% / Polyester 100%
- Anthropologie — https://www.anthropologie.com/shop/alemais-nanci-silk-shirt — 20260810 · Silk 100%
- Addidas — https://www.adidas.com/us/essentials-logo-tee/GL0649.html — 20250720 · Cotton 100%
- Addidas — https://www.adidas.com/us/argentina-26-away-cropped-jersey/KE5984.html — 20260410 · Polyester 100%
- Addidas — https://www.adidas.com/us/colombia-26-away-cropped-jersey/KE8088.html — 20260410 · Polyester 100%
- Patagonia — https://www.patagonia.com/product/womens-desert-glow-oversized-t-shirt/37868.html — 20260421 · Cotton 100%
- Sezane — https://www.sezane.com/us-en/product/damon-trousers/navy — 20260203 · Polyester 54% / Wool 44% / Elastane 2% / Viscose 100%
- Sezane — https://www.sezane.com/us-en/product/toni-trousers/camel — 20260919 · Goat Leather 100% / Viscose 100%

**보관본도 차단·빈 화면**

- Zara — https://www.zara.com/us/en/interlock-zip-up-sweatshirt-p02335652.html?v1=597431702

**보관본에 혼용률 없음**

- Zara — https://www.zara.com/us/en/striped-poplin-shirt-p08920816.html?v1=602868859
- Anthropologie — https://www.anthropologie.com/shop/helsi-leslie-strapless-stretch-sequin-midi-dress
- Lululemon — https://shop.lululemon.com/p/little-ribbed-scoop-neck-tank-top/wz7vj6nn0d

**목록 페이지(JSON-LD)**

- Addidas — https://www.adidas.com/us/love-unites-graphic-tee/KT1987.html — {"rootProducts":1,"listProducts":0,"itemList":0,"og":false,"h1":2,"blocks":1,"prices":2,"carts":5,"sigs":["cotton 100"],"title":"adidas LOVE UNITES GRAPHIC TEE - Black / Free Shipping with ","types":["ProductGroup","AggregateRating","PeopleAudience","Product","QuantitativeValue","Offer"]}

**보관본 열기 실패**

- Anthropologie — https://www.anthropologie.com/shop/by-anthropologie-nina-mock-neck-sweater-mini-dress — HTTP 404

**상품 여러 개(JSON-LD)**

- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-trail-shirt-stratapeaks/23726.html — {"rootProducts":4,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["lyocell 15/polyester 85"],"title":"Patagonia Women's Capilene® Cool Trail Shirt - Stratapeaks","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-p-6-logo-responsibili-tee/37567.html — {"rootProducts":7,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":0,"prices":4,"carts":2,"sigs":[],"title":"Patagonia Women's P-6 Logo Responsibili-Tee®","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-capilene-cool-daily-shirt-spoke-stencil/45492.html — {"rootProducts":3,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Capilene® Cool Daily Shirt - Spoke Stencil","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-ahnya-pullover/42151.html — {"rootProducts":9,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":4,"carts":2,"sigs":["cotton 58/elastane 4/polyester 38","cotton 57/elastane 5/polyester 38"],"title":"Patagonia Women's Ahnya Pullover","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-daily-hoody/42157.html — {"rootProducts":5,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":2,"prices":4,"carts":2,"sigs":["cotton 100","cotton 97/elastane 3"],"title":"Patagonia Women's Daily Hoody","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-great-waves-daily-hoody/39727.html — {"rootProducts":3,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":4,"carts":2,"sigs":["cotton 100","cotton 97/elastane 3"],"title":"Patagonia Women's Great Waves Daily Hoody","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-work-sweatshirt/41585.html — {"rootProducts":4,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":3,"prices":4,"carts":2,"sigs":["elastane 2/polyester 83","elastane 2/hemp 15/polyester 83","elastane 6/hemp 14/polyester 80"],"title":"Patagonia Women's Work Sweatshirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-full-zip-work-hoody-sweatshirt/41670.html — {"rootProducts":6,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":3,"prices":4,"carts":2,"sigs":["elastane 2/polyester 83","elastane 2/hemp 15/polyester 83","elastane 6/hemp 14/polyester 80"],"title":"Patagonia Women's Full-Zip Work Hoody Sweatshirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-95-oval-logo-daily-crewneck-sweatshirt/39729.html — {"rootProducts":4,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":2,"prices":4,"carts":2,"sigs":["cotton 100","cotton 97/elastane 3"],"title":"Patagonia Women's '95 Oval Logo Daily Crewneck Sweatshirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-long-sleeved-self-guided-sun-shirt/41830.html — {"rootProducts":3,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["polyester 100"],"title":"Patagonia Women's Long-Sleeved Self-Guided Sun Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-lightweight-a-c-buttondown-shirt/54296.html — {"rootProducts":5,"listProducts":0,"itemList":0,"og":false,"h1":1,"blocks":1,"prices":5,"carts":2,"sigs":["cotton 95/hemp 5"],"title":"Patagonia Women's Lightweight A/C® Buttondown Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}
- Patagonia — https://www.patagonia.com/product/womens-lightweight-button-down-a-c-shirt/42030.html — {"rootProducts":5,"listProducts":0,"itemList":7,"og":false,"h1":1,"blocks":1,"prices":4,"carts":2,"sigs":["cotton 95/hemp 5"],"title":"Patagonia Women's Lightweight Button Down A/C® Shirt","types":["ProductGroup","AggregateRating","Brand","Product","Offer","BreadcrumbList"]}

**상품 표시 없음**

- Patagonia — https://www.patagonia.com/product/womens-daily-crewneck-sweatshirt/42172.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":0,"prices":0,"carts":0,"sigs":[],"title":"Hang Tight! Routing to checkout...","types":[]}
- Patagonia — https://www.patagonia.com/product/womens-swift-drift-sun-hoody/41790.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":0,"prices":0,"carts":0,"sigs":[],"title":"Hang Tight! Routing to checkout...","types":[]}
- Patagonia — https://www.patagonia.com/product/womens-lightweight-fjord-flannel-shirt/42460.html — {"rootProducts":0,"listProducts":0,"itemList":0,"og":false,"h1":0,"blocks":0,"prices":0,"carts":0,"sigs":[],"title":"Hang Tight! Routing to checkout...","types":[]}

**주소: 카테고리 이름 주소**

- Sezane — https://www.sezane.com/us-en/product/salvatore-pant/black
- Sezane — https://www.sezane.com/us-en/product/lisandro-trousers/black
- Sezane — https://www.sezane.com/us-en/product/damon-trousers/black
- Sezane — https://www.sezane.com/us-en/product/albin-crop-trousers/black
- Sezane — https://www.sezane.com/us-en/product/gustavo-trousers/black

**주소: 카테고리 경로**

- Lululemon — https://shop.lululemon.com/c/women-olive-t-shirts/n1td6fzwx7w
- Lululemon — https://shop.lululemon.com/c/women-blue-t-shirts/n10vt3zwx7w
- Lululemon — https://shop.lululemon.com/c/women-navy-t-shirts/n1ea52zwx7w
- Lululemon — https://shop.lululemon.com/c/women-purple-t-shirts/n1h084zwx7w
- Lululemon — https://shop.lululemon.com/c/women-pastel-t-shirts/n1pspvzwx7w
- Lululemon — https://shop.lululemon.com/c/women-neon-t-shirts/n15l40zwx7w
- Lululemon — https://shop.lululemon.com/c/women-striped-t-shirts/n12bcnzwx7w
- Lululemon — https://shop.lululemon.com/c/women-printed-t-shirts/n19u7azwx7w
- Lululemon — https://shop.lululemon.com/c/women-flow-y-tank-tops/n1uk4wzxxus
- Lululemon — https://shop.lululemon.com/c/women-swiftly-tank-tops/n1nfanzuk4w
- Lululemon — https://shop.lululemon.com/c/women-align-tank-tops/n1esuuzuk4w
- Lululemon — https://shop.lululemon.com/c/women-ebb-to-street-tank-tops/n1h81hzuk4w

**혼용률 여러 벌(목록)**

- Sezane — https://www.sezane.com/us-en/product/loulou-trousers/navy-ecru-tennis-stripes — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":4,"prices":8,"carts":0,"sigs":["elastane 2/polyester 69/viscose 29","viscose 100","elastane 4/polyester 53/viscose 19/wool 24","acetate 74/viscose 26"],"title":"Loulou Trousers - Navy Ecru Tennis Stripes - Recycled polyes","types":["Product","Brand","Offer","Organization"]}
- Sezane — https://www.sezane.com/us-en/product/soan-trousers/taupe — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":6,"prices":10,"carts":8,"sigs":["viscose 100/wool 100","cotton 100","linen 10/silk 9/viscose 25","viscose 100"],"title":"SOAN Trousers - Taupe - Wool - Sézane","types":["Product","Brand","Offer","Organization","BreadcrumbList","ListItem"]}
- Lululemon — https://shop.lululemon.com/p/lululemon-align-mini-v-neck-tank-top/gdg1o8dn72 — {"rootProducts":1,"listProducts":0,"itemList":0,"og":true,"h1":1,"blocks":3,"prices":1,"carts":1,"sigs":["elastane 19/nylon 81","elastane 11/nylon 89/polyester 79","elastane 21"],"title":"lululemon Align™ Mini V-Neck Tank Top / Women&#x27;s Sleevel","types":["ProductGroup","Brand","AggregateRating","Product","Offer","Organization"]}

</details>


## KV 쓰기 (이번 실행)

- 실행 방식 **full** · 1·2·3차 · 재시도 창 지킴
- **DRY — 실제로 보낸 저장 요청 0회 · KV put 0** (보내기 전에 막은 요청 0)
- 저장했다면: 요청 73회 · KV put 73 (overlay 37 · details 35 · index 1)
- 저장본과 같아 보내지 않음 0 · 오늘 몫이 모자라 미룸 0
- 예전 방식(1·2·3차마다 저장)이었다면 같은 읽기 결과로 저장 요청 102회
- 오늘(UTC 2026-11-27) 이 저장소 잡이 쓴 put(장부, 이 실행 전): 0 · 예약분 300(서버 프리페치·크롬 확장·손 실행) · 이 실행에 허용된 몫 700/1000

