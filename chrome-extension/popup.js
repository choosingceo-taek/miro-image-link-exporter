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

// 남은 시간: 지금까지 걸린 평균 시간 × 남은 개수. (초반엔 표본이 적어 부정확할 수 있음)
function fmtDur(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}초`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}분`;
  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
}

function renderRunProgress(st) {
  const box = $('runProg');
  if (!st.total) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  const pct = Math.round((st.done / st.total) * 100);
  $('runPct').textContent = pct + '%';
  $('runCount').textContent = `${st.done} / ${st.total}`;
  $('runBar').style.width = pct + '%';
  if (st.running) {
    const elapsed = st.startedAt ? Date.now() - st.startedAt : 0;
    if (st.done > 0 && elapsed > 0) {
      const remain = (elapsed / st.done) * (st.total - st.done);
      $('runEta').textContent = `약 ${fmtDur(remain)} 남음 · 경과 ${fmtDur(elapsed)}`;
    } else {
      $('runEta').textContent = `첫 페이지 수집 중… (남은 시간 계산 중)`;
    }
    $('runNow2').textContent = st.current ? `현재: ${st.current}` : '';
  } else {
    $('runEta').textContent = `완료 · 소요 ${st.startedAt ? fmtDur(Date.now() - st.startedAt) : '-'}`;
    $('runNow2').textContent = '';
  }
}

function render(st) {
  const running = st.running;
  $('start').disabled = running;
  $('stop').disabled = !running;
  $('runNow').disabled = running;
  $('runStop').disabled = !running;
  renderRunProgress(st);
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
    else if (st.total) send({ type: 'getSched' }).then(renderSched);   // 끝나면 "지난 실행" 갱신
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
  $('maxPages').value = String(s.maxPages || 20);
  const parts = [];
  if (s.schedOn && s.nextRun) parts.push(`다음 실행 ${fmtWhen(s.nextRun)}`);
  else if (!s.schedOn) parts.push('자동 수집 꺼짐');
  if (s.lastRun) {
    const r = s.lastRun;
    parts.push(r.error
      ? `지난 실행 ${fmtWhen(r.when)} — 오류: ${r.error}`
      : `지난 실행 ${fmtWhen(r.when)} — 브랜드 성공 ${r.ok}/${r.total}` +
        (r.urls ? ` (카테고리 ${r.urls}개)` : ''));
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
    maxPages: Number($('maxPages').value),
  });
  const s = await send({ type: 'getSched' });
  renderSched(s);
  return r;
}
// 설치된 버전 표시(팝업에서 바로 최신 여부를 확인할 수 있게).
try {
  const m = chrome.runtime.getManifest();
  $('verInfo').textContent = `버전 ${m.version}`;
} catch (e) {}

['schedOn', 'schedTime', 'schedVisible', 'maxPages'].forEach((id) => $(id).addEventListener('change', saveSched));
$('runNow').addEventListener('click', async () => {
  $('runNow').disabled = true;
  $('schedInfo').textContent = '대상 목록을 불러오는 중…';
  const r = await send({ type: 'runNow' });
  if (r && r.ok) {
    $('prog').style.display = 'block';
    $('runProg').style.display = 'block';
    $('schedInfo').textContent = `${r.brands || 0}개 브랜드 · ${r.total}개 카테고리 수집 시작`;
    poll();
  } else {
    $('schedInfo').textContent = '⚠ ' + ((r && r.msg) || '실행 실패');
    $('runNow').disabled = false;
  }
});

$('runStop').addEventListener('click', () => {
  send({ type: 'stop' });
  $('schedInfo').textContent = '중지 요청됨 — 현재 페이지까지 마치고 멈춥니다.';
});

function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
function shorten(u) { const h = hostOf(u); return h.length > 22 ? h.slice(0, 22) + '…' : h; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

loadCfg();
send({ type: 'getSched' }).then(renderSched);
poll();   // 팝업 다시 열어도 진행상황 이어서 표시
