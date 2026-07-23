const $ = (id) => document.getElementById(id);
const send = (msg) => new Promise((res) => chrome.runtime.sendMessage(msg, res));

async function loadCfg() {
  const cfg = await send({ type: 'getCfg' });
  if (cfg) { $('worker').value = cfg.worker || ''; $('token').value = cfg.token || ''; }
}

$('saveCfg').addEventListener('click', async () => {
  await send({ type: 'setCfg', worker: $('worker').value.trim(), token: $('token').value.trim() });
  $('saveCfg').textContent = '저장됨 ✓';
  setTimeout(() => ($('saveCfg').textContent = '설정 저장'), 1500);
});

$('start').addEventListener('click', async () => {
  const urls = $('urls').value.split('\n').map((s) => s.trim()).filter((s) => /^https?:\/\//i.test(s));
  if (!urls.length) { alert('상품 목록 페이지 URL을 한 줄에 하나씩 넣으세요.'); return; }
  $('prog').style.display = 'block';
  await send({ type: 'start', urls });
  poll();
});

$('stop').addEventListener('click', () => send({ type: 'stop' }));

function render(st) {
  const running = st.running;
  $('start').disabled = running;
  $('stop').disabled = !running;
  if (st.total) {
    $('progText').textContent = running
      ? `수집 중… ${st.done}/${st.total}` + (st.current ? ` · ${shorten(st.current)}` : '')
      : `완료 · ${st.done}/${st.total}`;
    $('progBar').style.width = Math.round((st.done / st.total) * 100) + '%';
  }
  $('log').innerHTML = (st.log || []).map((e) =>
    `<div class="${e.ok ? 'ok' : 'no'}">${e.ok ? '✅' : '⚠'} ${escapeHtml(hostOf(e.url))} — ${escapeHtml(e.msg)}</div>`
  ).join('');
}

function poll() {
  send({ type: 'state' }).then((st) => {
    if (!st) return;
    render(st);
    if (st.running) setTimeout(poll, 700);
  });
}

function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
function shorten(u) { const h = hostOf(u); return h.length > 22 ? h.slice(0, 22) + '…' : h; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

loadCfg();
poll();   // 팝업 다시 열어도 진행상황 이어서 표시
