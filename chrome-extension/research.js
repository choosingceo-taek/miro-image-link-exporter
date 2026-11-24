// 상품 리서치 앱 주소 — 팝업(popup.js)과 옆 패널(sidepanel.js)이 함께 쓴다.
//
// 리서치 화면 자체는 확장에 넣지 않는다. 확장은 '압축해제된 확장'으로 깔려 있어서
// 고칠 때마다 팀원이 폴더를 다시 받아야 한다. 화면은 GitHub Pages 에 올라간
// app.html 하나만 두고(고치면 바로 모두에게 반영), 확장은 그 주소를 열어 줄 뿐이다.
//
// 설정 저장소(chrome.storage.local)의 appUrl 로 주소를 바꿀 수 있다(시험용 — 팝업
// ⚙ 설정 맨 아래). Worker 주소·토큰이 기본값과 다를 때만 ?worker= / ?token= 으로
// 넘긴다. 기본값이면 주소를 깨끗하게 둔다 — 앱에도 같은 기본값이 들어 있다.
/* exported RACK_APP_DEFAULT, rackAppUrl, rackAppSettings */
const RACK_APP_DEFAULT = 'https://choosingceo-taek.github.io/miro-image-link-exporter/app.html';
const RACK_DEFAULT_WORKER = 'https://fabric-extractor.hs-fabric-linker.workers.dev';
const RACK_DEFAULT_TOKEN = 'hsfabriclinker';

// st = { appUrl, worker, token } (저장소 값 그대로), hash = 'site=…' 처럼 # 뒤에 붙일 것.
function rackAppUrl(st, hash) {
  const s = st || {};
  let u;
  try { u = new URL(String(s.appUrl || '').trim() || RACK_APP_DEFAULT); }
  catch (e) { u = new URL(RACK_APP_DEFAULT); }
  if (!/^https?:$/.test(u.protocol)) u = new URL(RACK_APP_DEFAULT);
  // background.js 의 getCfg 와 같은 규칙으로 '지금 확장이 쓰는 값'을 만든다.
  const worker = String(s.worker || RACK_DEFAULT_WORKER).trim().replace(/\/+$/, '');
  const token = s.token !== undefined && s.token !== null ? String(s.token) : RACK_DEFAULT_TOKEN;
  if (worker !== RACK_DEFAULT_WORKER) u.searchParams.set('worker', worker);
  if (token !== RACK_DEFAULT_TOKEN) u.searchParams.set('token', token);
  u.hash = hash ? String(hash).replace(/^#/, '') : '';
  return u.href;
}

async function rackAppSettings() {
  try { return await chrome.storage.local.get(['appUrl', 'worker', 'token']); }
  catch (e) { return {}; }
}
