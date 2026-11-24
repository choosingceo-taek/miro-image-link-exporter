// 브라우저 옆 패널 — 올려 둔 리서치 앱(app.html)을 꽉 찬 iframe 으로 보여 준다.
//
// 앱이 다 뜨면 { rackApp: 'ready' } 를 보내온다. 그 신호로 로딩 표시를 걷는다.
// 신호가 안 오면(인터넷이 끊겼거나 회사망이 GitHub Pages 를 막는 등) 무엇이
// 문제인지 적고 '새 탭에서 열기'를 내민다. 빈 화면만 남기지 않는다.
(() => {
  const $ = (id) => document.getElementById(id);
  const frame = $('app');
  let url = '';
  let loaded = false, ready = false;
  let tLoad = 0, tReady = 0;

  function show(text, sub, err) {
    $('state').hidden = false;
    $('state').classList.toggle('err', !!err);
    $('stateText').textContent = text;
    $('stateSub').textContent = sub || '';
    $('openTab').hidden = !err;
    $('stayHere').hidden = !(err && loaded);
  }
  function hide() { $('state').hidden = true; }

  function fail(why) {
    if (ready) return;
    show('리서치 앱을 열지 못했습니다.', why, true);
  }

  async function start() {
    clearTimeout(tLoad); clearTimeout(tReady);
    loaded = false; ready = false;
    url = rackAppUrl(await rackAppSettings(), '');
    if (navigator.onLine === false) {
      fail('인터넷에 연결되어 있지 않습니다. 연결한 뒤 이 패널을 다시 여세요.');
      return;
    }
    show('리서치 앱을 여는 중…', '');
    frame.src = url;
    // 20초 안에 페이지가 아예 안 오면 실패로 본다.
    tLoad = setTimeout(() => {
      if (!loaded) fail('응답이 없습니다. 인터넷 연결이나 회사 네트워크 차단을 확인하세요.');
    }, 20000);
  }

  frame.addEventListener('load', () => {
    if (!frame.getAttribute('src')) return;
    loaded = true;
    clearTimeout(tLoad);
    // 페이지는 왔는데(오류 화면일 수도 있다) 앱 신호가 없으면 잠시 뒤 안내한다.
    tReady = setTimeout(() => {
      if (!ready) fail('페이지를 불러오지 못했거나 앱이 응답하지 않습니다. 인터넷 연결·회사 네트워크 차단을 확인하세요.');
    }, 8000);
  });

  window.addEventListener('message', (e) => {
    if (e.source !== frame.contentWindow) return;
    // 주소를 바꿔 다시 여는 사이에 앞 주소의 앱이 늦게 보낸 신호는 버린다.
    try { if (e.origin !== new URL(url).origin) return; } catch (err) { return; }
    if (e.data && e.data.rackApp === 'ready') {
      ready = true;
      clearTimeout(tLoad); clearTimeout(tReady);
      hide();
    }
  });

  $('openTab').addEventListener('click', () => {
    if (chrome.tabs && chrome.tabs.create) chrome.tabs.create({ url });
    else window.open(url, '_blank');
  });
  $('stayHere').addEventListener('click', hide);

  // 팝업 ⚙ 에서 주소·Worker 를 바꾸면 패널도 따라 다시 연다.
  try {
    chrome.storage.onChanged.addListener((ch, area) => {
      if (area === 'local' && (ch.appUrl || ch.worker || ch.token)) start();
    });
  } catch (e) {}

  start();
})();
