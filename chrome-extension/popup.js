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

$('collectHere').addEventListener('click', async () => {
  const box = $('hereResult');
  box.style.display = 'block';
  box.textContent = '⏳ 이 페이지 수집 중…';
  $('collectHere').disabled = true;
  try {
    const r = await send({ type: 'collectActive' });
    box.innerHTML = r && r.ok
      ? `<span style="color:#1a7f37">✅ ${escapeHtml(r.msg)} → 미로 앱에서 확인</span>`
      : `<span style="color:#b42318">⚠ ${escapeHtml((r && r.msg) || '실패')}</span>`;
  } catch (e) {
    box.innerHTML = `<span style="color:#b42318">⚠ ${escapeHtml(String(e && e.message || e))}</span>`;
  } finally { $('collectHere').disabled = false; }
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

// ── 매일 자동 수집 ──────────────────────────────────────────────
const pad2 = (n) => String(n).padStart(2, '0');
function fmtWhen(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function renderSched(s) {
  if (!s) return;
  $('schedOn').checked = !!s.schedOn;
  $('schedTime').value = `${pad2(s.schedHour)}:${pad2(s.schedMin || 0)}`;
  $('schedVisible').checked = s.visible !== false;
  const parts = [];
  if (s.schedOn && s.nextRun) parts.push(`다음 실행 ${fmtWhen(s.nextRun)}`);
  else if (!s.schedOn) parts.push('자동 수집 꺼짐');
  if (s.lastRun) {
    const r = s.lastRun;
    parts.push(r.error
      ? `지난 실행 ${fmtWhen(r.when)} — 오류: ${r.error}`
      : `지난 실행 ${fmtWhen(r.when)} — 성공 ${r.ok}/${r.total}`);
  }
  $('schedInfo').textContent = parts.join(' · ');
}
async function saveSched() {
  const [h, m] = String($('schedTime').value || '08:00').split(':');
  const r = await send({
    type: 'setSched',
    schedOn: $('schedOn').checked,
    schedHour: Number(h),
    schedMin: Number(m),
    visible: $('schedVisible').checked,
  });
  const s = await send({ type: 'getSched' });
  renderSched(s);
  return r;
}
['schedOn', 'schedTime', 'schedVisible'].forEach((id) => $(id).addEventListener('change', saveSched));
$('runNow').addEventListener('click', async () => {
  $('runNow').disabled = true;
  $('schedInfo').textContent = '대상 목록을 불러오는 중…';
  const r = await send({ type: 'runNow' });
  if (r && r.ok) {
    $('prog').style.display = 'block';
    $('schedInfo').textContent = `${r.total}개 페이지 수집 시작 — 아래 진행상황 참고`;
    poll();
  } else {
    $('schedInfo').textContent = '⚠ ' + ((r && r.msg) || '실행 실패');
  }
  $('runNow').disabled = false;
});

function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
function shorten(u) { const h = hostOf(u); return h.length > 22 ? h.slice(0, 22) + '…' : h; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

loadCfg();
send({ type: 'getSched' }).then(renderSched);
poll();   // 팝업 다시 열어도 진행상황 이어서 표시
