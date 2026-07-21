let timerInterval = null;
let timerRunning = false;
let timerPaused = false;
let wakeLock = null;

const TIMER_DEFAULTS = { trabalho: 20, descanso: 10, rounds: 8, sets: 3, descansoSet: 60 };

function getTimerConfig() {
  return AppState.get('timerConfig') || { ...TIMER_DEFAULTS };
}

function beep(freq, duracao) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracao);
    osc.stop(ctx.currentTime + duracao);
  } catch (e) {}
}

function beepAlerta() { beep(880, 0.15); }
function beepTransicao() { beep(660, 0.1); setTimeout(() => beep(880, 0.3), 150); }
function beepFinal() { beep(1047, 0.4); setTimeout(() => beep(1047, 0.4), 500); }

async function solicitarWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (e) {}
}

async function liberarWakeLock() {
  if (wakeLock) {
    try { await wakeLock.release(); } catch (e) {}
    wakeLock = null;
  }
}

function formatarTempo(s) {
  const m = Math.floor(s / 60);
  const seg = s % 60;
  return `${m}:${String(seg).padStart(2, '0')}`;
}

function lerConfigForm() {
  return {
    trabalho: parseInt(document.getElementById('cfg-trabalho')?.value) || TIMER_DEFAULTS.trabalho,
    descanso: parseInt(document.getElementById('cfg-descanso')?.value) || TIMER_DEFAULTS.descanso,
    rounds: parseInt(document.getElementById('cfg-rounds')?.value) || TIMER_DEFAULTS.rounds,
    sets: parseInt(document.getElementById('cfg-sets')?.value) || TIMER_DEFAULTS.sets,
    descansoSet: parseInt(document.getElementById('cfg-descanso-set')?.value) || TIMER_DEFAULTS.descansoSet
  };
}

function atualizarDisplayTimer(estado, config) {
  const timeEl = document.getElementById('timer-time');
  const roundEl = document.getElementById('timer-round');
  const phaseEl = document.getElementById('timer-phase');
  const progressEl = document.getElementById('timer-progress-bar');

  if (timeEl) timeEl.textContent = formatarTempo(estado.tempo);
  if (roundEl) roundEl.textContent = `Round ${estado.round}/${config.rounds} · Set ${estado.set}/${config.sets}`;

  if (phaseEl) {
    const faseLabel = estado.fase === 'work' ? 'TRABALHO' : 'DESCANSO';
    phaseEl.textContent = faseLabel;
    phaseEl.className = `timer-phase ${estado.fase === 'work' ? 'work' : 'rest'}`;
  }

  if (progressEl) {
    const pct = estado.total > 0 ? ((estado.total - estado.tempo) / estado.total * 100) : 0;
    progressEl.style.width = `${pct}%`;
    progressEl.className = `timer-progress-bar ${estado.fase === 'work' ? '' : 'rest'}`;
  }
}

function atualizarBotoesTimer(estado) {
  const container = document.getElementById('timer-controls');
  if (!container) return;

  if (estado.status === 'pronto') {
    container.innerHTML = `<button class="btn btn-green btn-sm" id="timer-start">▶ Iniciar</button>`;
  } else if (estado.status === 'rodando') {
    container.innerHTML = `
      <button class="btn btn-secondary btn-sm" id="timer-pause">⏸ Pausar</button>
      <button class="btn btn-secondary btn-sm" id="timer-stop">⏹ Parar</button>
    `;
  } else if (estado.status === 'pausado') {
    container.innerHTML = `
      <button class="btn btn-green btn-sm" id="timer-resume">▶ Continuar</button>
      <button class="btn btn-secondary btn-sm" id="timer-stop">⏹ Parar</button>
    `;
  } else if (estado.status === 'finalizado') {
    container.innerHTML = `
      <button class="btn btn-primary btn-sm" id="timer-reset">🔄 Refazer</button>
      <button class="btn btn-green btn-sm" id="timer-log">💾 Salvar Treino</button>
    `;
  }
}

function tickTimer() {
  const estado = AppState.get('timerEstado');
  const config = getTimerConfig();
  if (!estado || estado.status !== 'rodando') return;

  const novo = { ...estado, tempo: estado.tempo - 1 };

  if (novo.tempo <= 3 && novo.tempo > 0 && estado.fase === 'work') {
    beepAlerta();
  }

  if (novo.tempo <= 0) {
    if (estado.fase === 'work') {
      beepTransicao();
      if (estado.round >= config.rounds) {
        if (estado.set >= config.sets) {
          beepFinal();
          pararTimer();
          novo.status = 'finalizado';
          novo.tempo = 0;
          novo.total = 0;
          AppState.set('timerEstado', novo);
          AppState.notify();
          return;
        } else {
          novo.set = estado.set + 1;
          novo.round = 1;
          novo.fase = 'rest';
          novo.tempo = config.descansoSet;
          novo.total = config.descansoSet;
        }
      } else {
        novo.round = estado.round + 1;
        novo.fase = 'rest';
        novo.tempo = config.descanso;
        novo.total = config.descanso;
      }
    } else {
      beepTransicao();
      novo.fase = 'work';
      novo.tempo = config.trabalho;
      novo.total = config.trabalho;
    }
  }

  AppState._data.timerEstado = novo;
  atualizarDisplayTimer(novo, config);
}

function iniciarTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerPaused = false;

  const cfg = getTimerConfig();
  const estado = { fase: 'work', round: 1, set: 1, tempo: cfg.trabalho, total: cfg.trabalho, status: 'rodando' };
  AppState._data.timerEstado = estado;
  atualizarDisplayTimer(estado, cfg);
  atualizarBotoesTimer(estado);
  solicitarWakeLock();

  timerInterval = setInterval(tickTimer, 1000);
}

function pausarTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerRunning = false;
  timerPaused = true;
  liberarWakeLock();

  const estado = AppState.get('timerEstado');
  if (estado) {
    estado.status = 'pausado';
    AppState.set('timerEstado', estado);
    atualizarBotoesTimer(estado);
  }
}

function continuarTimer() {
  timerRunning = true;
  timerPaused = false;

  const estado = AppState.get('timerEstado');
  if (estado) {
    estado.status = 'rodando';
    AppState.set('timerEstado', estado);
    atualizarBotoesTimer(estado);
    solicitarWakeLock();
    timerInterval = setInterval(tickTimer, 1000);
  }
}

function pararTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerRunning = false;
  timerPaused = false;
  liberarWakeLock();
}

function resetarTimer() {
  pararTimer();
  const cfg = getTimerConfig();
  const estado = { fase: 'work', round: 1, set: 1, tempo: cfg.trabalho, total: cfg.trabalho, status: 'pronto' };
  AppState.set('timerEstado', estado);
  AppState.notify();
}

function salvarTreino() {
  pararTimer();
  const cfg = getTimerConfig();
  const log = AppState.get('treinos') || [];
  log.push({
    data: new Date().toISOString(),
    tipo: 'tabata',
    config: { ...cfg }
  });
  AppState.set('treinos', log);

  const estado = { fase: 'work', round: 1, set: 1, tempo: cfg.trabalho, total: cfg.trabalho, status: 'pronto' };
  AppState.set('timerEstado', estado);
  AppState.notify();
}

function renderExerciciosTimer() {
  const ids = AppState.get('timerExercicios');
  if (!ids || !ids.length) return '';
  return `
    <div class="card" style="text-align:center">
      <div class="card-title">🏋️ Exercícios do Dia</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">
        ${ids.map(id => {
          const ex = EXERCICIOS.find(e => e.id === id);
          return ex ? `<span class="chip-checkable" style="cursor:default;background:var(--green-light);border-color:transparent;color:var(--green);padding:4px 12px;font-size:.78rem;font-weight:600">${ex.nome}</span>` : '';
        }).join('')}
      </div>
    </div>
  `;
}

function renderTimer() {
  const cfg = getTimerConfig();
  const estado = AppState.get('timerEstado');
  const exHTML = renderExerciciosTimer();
  if (!estado || estado.status === 'pronto') {
    return `
      <div class="page" id="page-timer">
        ${exHTML}
        <div class="card timer-display">
          <div class="timer-round" id="timer-round">Round 1/${cfg.rounds} · Set 1/${cfg.sets}</div>
          <div class="timer-time" id="timer-time">${formatarTempo(cfg.trabalho)}</div>
          <div class="timer-phase work" id="timer-phase">TRABALHO</div>
          <div class="timer-progress">
            <div class="timer-progress-bar" id="timer-progress-bar" style="width:0%"></div>
          </div>
          <div class="timer-controls" id="timer-controls">
            <button class="btn btn-green btn-sm" id="timer-start">▶ Iniciar</button>
          </div>
        </div>

        <div class="card timer-config">
          <div class="card-title">Configuração</div>
          <div class="form-row">
            <div class="form-group">
              <label>Trabalho (s)</label>
              <input type="number" id="cfg-trabalho" value="${cfg.trabalho}" min="1" max="600">
            </div>
            <div class="form-group">
              <label>Descanso (s)</label>
              <input type="number" id="cfg-descanso" value="${cfg.descanso}" min="0" max="600">
            </div>
            <div class="form-group">
              <label>Rounds</label>
              <input type="number" id="cfg-rounds" value="${cfg.rounds}" min="1" max="99">
            </div>
            <div class="form-group">
              <label>Sets</label>
              <input type="number" id="cfg-sets" value="${cfg.sets}" min="1" max="99">
            </div>
            <div class="form-group">
              <label>Desc. Sets (s)</label>
              <input type="number" id="cfg-descanso-set" value="${cfg.descansoSet}" min="0" max="600">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const faseLabel = estado.status === 'finalizado' ? 'FINALIZADO' : (estado.fase === 'work' ? 'TRABALHO' : 'DESCANSO');
  const faseClass = estado.status === 'finalizado' ? 'work' : (estado.fase === 'work' ? 'work' : 'rest');
  const progressPct = estado.total > 0 ? ((estado.total - estado.tempo) / estado.total * 100) : (estado.status === 'finalizado' ? 100 : 0);
  const disabled = (estado.status === 'rodando' || estado.status === 'pausado') ? 'disabled' : '';

  return `
    <div class="page" id="page-timer">
      ${exHTML}
      <div class="card timer-display">
        <div class="timer-round" id="timer-round">${estado.status === 'finalizado' ? '🏆 Treino Concluído!' : `Round ${estado.round}/${cfg.rounds} · Set ${estado.set}/${cfg.sets}`}</div>
        <div class="timer-time" id="timer-time">${formatarTempo(estado.tempo)}</div>
        <div class="timer-phase ${faseClass}" id="timer-phase">${faseLabel}</div>
        <div class="timer-progress">
          <div class="timer-progress-bar" id="timer-progress-bar" style="width:${progressPct}%"></div>
        </div>
        <div class="timer-controls" id="timer-controls">
          ${estado.status === 'rodando' ? `
            <button class="btn btn-secondary btn-sm" id="timer-pause">⏸ Pausar</button>
            <button class="btn btn-secondary btn-sm" id="timer-stop">⏹ Parar</button>
          ` : estado.status === 'pausado' ? `
            <button class="btn btn-green btn-sm" id="timer-resume">▶ Continuar</button>
            <button class="btn btn-secondary btn-sm" id="timer-stop">⏹ Parar</button>
          ` : estado.status === 'finalizado' ? `
            <button class="btn btn-primary btn-sm" id="timer-reset">🔄 Refazer</button>
            <button class="btn btn-green btn-sm" id="timer-log">💾 Salvar Treino</button>
          ` : ''}
        </div>
      </div>

      <div class="card timer-config">
        <div class="card-title">Configuração</div>
        <div class="form-row">
          <div class="form-group">
            <label>Trabalho (s)</label>
            <input type="number" id="cfg-trabalho" value="${cfg.trabalho}" min="1" max="600" ${disabled}>
          </div>
          <div class="form-group">
            <label>Descanso (s)</label>
            <input type="number" id="cfg-descanso" value="${cfg.descanso}" min="0" max="600" ${disabled}>
          </div>
          <div class="form-group">
            <label>Rounds</label>
            <input type="number" id="cfg-rounds" value="${cfg.rounds}" min="1" max="99" ${disabled}>
          </div>
          <div class="form-group">
            <label>Sets</label>
            <input type="number" id="cfg-sets" value="${cfg.sets}" min="1" max="99" ${disabled}>
          </div>
          <div class="form-group">
            <label>Desc. Sets (s)</label>
            <input type="number" id="cfg-descanso-set" value="${cfg.descansoSet}" min="0" max="600" ${disabled}>
          </div>
        </div>
      </div>
    </div>
  `;
}
