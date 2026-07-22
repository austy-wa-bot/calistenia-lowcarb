const AppState = {
  _data: {},

  init() {
    try {
      const saved = localStorage.getItem('calisteniaApp');
      if (saved) this._data = JSON.parse(saved);
    } catch (e) {}

    const page = new URLSearchParams(window.location.search).get('page') || 'inicio';
    this._data._page = page;
  },

  get(key) {
    return this._data[key];
  },

  set(key, val) {
    this._data[key] = val;
    this._save();
  },

  _save() {
    try {
      const toSave = { ...this._data };
      delete toSave._page;
      const saved = AppState.get('timerEstado');
      const isRunning = saved && (saved.status === 'rodando' || saved.status === 'pausado');
      if (isRunning) delete toSave.timerEstado;
      localStorage.setItem('calisteniaApp', JSON.stringify(toSave));
    } catch (e) {}
  },

  notify() {
    this._save();
    const page = this._data._page || 'inicio';
    renderPage(page);
  }
};

const PAGES = {
  inicio: { render: renderInicio },
  exercicios: { render: renderExercicios },
  timer: { render: renderTimer },
  dieta: { render: renderDieta },
  progresso: { render: renderProgresso },
  programa: { render: renderPrograma }
};

const PAGE_TITLES = {
  inicio: '🏠 Início',
  exercicios: '🏋️ Catálogo de Exercícios',
  timer: '⏱️ Timer Tabata',
  dieta: '🥗 Dieta Low-Carb',
  progresso: '📊 Meu Progresso',
  programa: '📅 Programa'
};

function renderPage(pageId) {
  const content = document.getElementById('content');
  const title = document.getElementById('page-title');
  const page = PAGES[pageId];

  if (!page) return;

  title.textContent = PAGE_TITLES[pageId] || 'CicloFit';
  content.innerHTML = page.render();

  const pageDiv = content.querySelector('.page');
  if (pageDiv) pageDiv.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  AppState._data._page = pageId;
}

function navigate(pageId) {
  if (!PAGES[pageId]) return;
  renderPage(pageId);

  const url = new URL(window.location);
  url.searchParams.set('page', pageId);
  window.history.replaceState({}, '', url);
}

function setupGlobalListeners() {
  document.getElementById('bottom-nav').addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (btn) {
      e.preventDefault();
      navigate(btn.dataset.page);
    }
  });

  document.addEventListener('click', e => {
    const target = e.target;

    if (target.id === 'timer-start') {
      const cfg = lerConfigForm();
      AppState.set('timerConfig', cfg);
      const estado = { fase: 'work', round: 1, set: 1, tempo: cfg.trabalho, total: cfg.trabalho, status: 'rodando' };
      AppState.set('timerEstado', estado);
      AppState.notify();
      setTimeout(iniciarTimer, 50);
    }

    if (target.id === 'timer-pause') pausarTimer();
    if (target.id === 'timer-resume') continuarTimer();
    if (target.id === 'timer-stop') resetarTimer();
    if (target.id === 'timer-reset') resetarTimer();
    if (target.id === 'timer-log') salvarTreino();

    const chip = target.closest('.alimento-chip');
    if (chip) {
      const id = chip.dataset.id;
      const selecionados = AppState.get('alimentosSelecionados') || [];
      const idx = selecionados.indexOf(id);
      if (idx === -1) selecionados.push(id);
      else selecionados.splice(idx, 1);
      AppState.set('alimentosSelecionados', selecionados);
      AppState.notify();
    }

    const recipeCard = target.closest('.recipe-card');
    if (recipeCard) {
      const id = recipeCard.dataset.recipeId;
      const receita = RECEITAS.find(r => r.id === id);
      if (!receita) return;

      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay open';
      overlay.innerHTML = `
        <div class="modal-content">
          <h2>${receita.nome}</h2>
          <div class="recipe-meta">⏱ ${receita.tempo} · ${receita.dificuldade}</div>
          <div class="card-title" style="margin-top:16px">Ingredientes</div>
          <ul style="font-size:.85rem;color:var(--text-dim);line-height:1.8;margin-bottom:12px;padding-left:20px">
            ${receita.ingredientes.map(i => {
              const item = CATEGORIAS_ALIMENTOS.flatMap(c => c.itens).find(a => a.id === i);
              return `<li>${item ? item.nome : i}</li>`;
            }).join('')}
          </ul>
          <div class="card-title">Modo de Preparo</div>
          <p style="font-size:.85rem;color:var(--text-dim);line-height:1.6;white-space:pre-line">${receita.instrucoes}</p>
          <button class="btn btn-primary btn-block" style="margin-top:16px" id="fechar-modal">Fechar</button>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.id === 'fechar-modal') overlay.remove();
      });
    }

    if (target.id === 'prog-comecar') {
      AppState.set('programaInicio', new Date().toISOString());
      AppState.set('programaSemanaAtual', 0);
      AppState.notify();
    }

    const progIniciar = target.id && target.id.startsWith('prog-iniciar-');
    if (progIniciar) {
      const parts = target.id.replace('prog-iniciar-', '').split('-');
      const semanaIdx = parseInt(parts[0]);
      const dia = parseInt(parts[1]);
      const semana = PROGRAMA_SEMANAL[semanaIdx];
      if (semana) {
        const diaDados = semana.dias.find(d => d.dia === dia);
        if (diaDados) {
          AppState.set('timerExercicios', diaDados.exercicios);
          const perfil = AppState.get('perfil') || {};
          const tabataCfg = tabataPorTempoParado(perfil.tempoParado || '');
          AppState.set('timerConfig', { ...tabataCfg });
          navigate('timer');
        }
      }
    }

    const progCompletar = target.id && target.id.startsWith('prog-completar-');
    if (progCompletar) {
      const parts = target.id.replace('prog-completar-', '').split('-');
      const semanaIdx = parseInt(parts[0]);
      const dia = parseInt(parts[1]);
      const treinos = AppState.get('treinosPrograma') || {};
      const lista = treinos[semanaIdx] || [];
      if (!lista.includes(dia)) {
        lista.push(dia);
        treinos[semanaIdx] = lista;
        AppState.set('treinosPrograma', treinos);
        AppState.notify();
      }
    }

    if (target.id === 'prog-proxima-semana') {
      const atual = AppState.get('programaSemanaAtual') ?? 0;
      if (atual < PROGRAMA_SEMANAL.length - 1) {
        AppState.set('programaSemanaAtual', atual + 1);
        AppState.notify();
      }
    }

    if (target.id === 'prog-semana-anterior') {
      const atual = AppState.get('programaSemanaAtual') ?? 0;
      if (atual > 0) {
        AppState.set('programaSemanaAtual', atual - 1);
        AppState.notify();
      }
    }

    const progWeekMatch = target.id && target.id.match(/^prog-week-(\d+)$/);
    if (progWeekMatch) {
      AppState.set('programaSemanaAtual', parseInt(progWeekMatch[1]));
      AppState.notify();
    }

    if (target.id === 'toggle-sono-ontem' || target.id === 'toggle-sono-hoje') {
      const sono = AppState.get('sono') || {};
      const d = new Date();
      if (target.id === 'toggle-sono-ontem') d.setDate(d.getDate() - 1);
      const ds = d.toISOString().split('T')[0];
      sono[ds] = !sono[ds];
      AppState.set('sono', sono);
      AppState.notify();
    }

    if (target.id === 'onboard-next') {
      const step = AppState.get('onboardingStep') || 0;
      if (step === 2) {
        const perfil = AppState.get('perfil') || {};
        perfil.tempoParado = document.getElementById('input-tempo-parado')?.value || '';
        const condChips = document.querySelectorAll('[data-cond]');
        perfil.condicoes = [];
        condChips.forEach(ch => {
          if (ch.classList.contains('checked')) perfil.condicoes.push(ch.dataset.cond);
        });
        perfil.outraCondicao = document.getElementById('input-outra-condicao')?.value?.trim() || '';
        AppState.set('perfil', perfil);
      }
      if (step === 6) {
        const nome = document.getElementById('input-nome')?.value.trim();
        const peso = parseFloat(document.getElementById('input-peso')?.value);
        const altura = parseFloat(document.getElementById('input-altura')?.value);
        const pesoAlvo = parseFloat(document.getElementById('input-peso-alvo')?.value);
        if (!nome || !peso || !altura) return;
        const perfil = AppState.get('perfil') || {};
        Object.assign(perfil, { nome, peso, altura });
        if (pesoAlvo) perfil.pesoAlvo = pesoAlvo;
        AppState.set('perfil', perfil);
      }
      if (step === 4) {
        const check = document.getElementById('onboard-treino-check');
        if (check) AppState.set('onboardTreinoDone', check.checked);
      }
      if (step === 5) {
        const horario = document.getElementById('onboard-sono-horario')?.value;
        if (horario) AppState.set('onboardSonoMeta', horario);
      }
      if (step >= 8) {
        AppState.set('onboardingCompleto', true);
        AppState.set('onboardingStep', 0);
        AppState.notify();
        return;
      }
      AppState.set('onboardingStep', step + 1);
      AppState.notify();
    }

    if (target.id === 'onboard-back') {
      const step = AppState.get('onboardingStep') || 0;
      if (step > 0) {
        AppState.set('onboardingStep', step - 1);
        AppState.notify();
      }
    }

    const chipCheck = target.closest('.chip-checkable');
    if (chipCheck) {
      if (chipCheck.id === 'onboard-treino-done') return;
      const checkbox = chipCheck.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        chipCheck.classList.toggle('checked', checkbox.checked);
        const id = chipCheck.dataset.id;
        const cond = chipCheck.dataset.cond;
        if (id) {
          const selecionados = AppState.get('alimentosSelecionados') || [];
          const idx = selecionados.indexOf(id);
          if (checkbox.checked && idx === -1) selecionados.push(id);
          else if (!checkbox.checked && idx > -1) selecionados.splice(idx, 1);
          AppState.set('alimentosSelecionados', selecionados);
        }
        if (cond) {
          if (cond === 'nenhuma') {
            document.querySelectorAll('[data-cond]').forEach(c => {
              if (c.dataset.cond !== 'nenhuma') {
                c.classList.remove('checked');
                const cb = c.querySelector('input');
                if (cb) cb.checked = false;
              }
            });
          } else {
            const nenhumaChip = document.querySelector('[data-cond="nenhuma"]');
            if (nenhumaChip) {
              nenhumaChip.classList.remove('checked');
              const cb = nenhumaChip.querySelector('input');
              if (cb) cb.checked = false;
            }
          }
        }
      }
    }

    if (target.id === 'inicio-timer') navigate('timer');
    if (target.id === 'inicio-programa') navigate('programa');
    if (target.id === 'inicio-exercicios') navigate('exercicios');
    if (target.id === 'inicio-progresso') navigate('progresso');
    if (target.id === 'inicio-dieta') navigate('dieta');

    if (target.id === 'salvar-perfil') {
      const peso = parseFloat(document.getElementById('input-peso')?.value);
      const altura = parseFloat(document.getElementById('input-altura')?.value);
      const pesoAlvo = parseFloat(document.getElementById('input-peso-alvo')?.value);
      if (!peso || !altura) return;
      const perfil = AppState.get('perfil') || {};
      perfil.peso = peso;
      perfil.altura = altura;
      if (pesoAlvo) perfil.pesoAlvo = pesoAlvo;
      AppState.set('perfil', perfil);
      AppState.notify();
    }

    if (target.id === 'registrar-peso') {
      const pesoInput = parseFloat(document.getElementById('input-peso')?.value);
      if (!pesoInput) return;
      const perfil = AppState.get('perfil') || {};
      perfil.peso = pesoInput;
      AppState.set('perfil', perfil);
      const historico = AppState.get('pesoHistorico') || [];
      historico.push({ data: new Date().toISOString(), peso: pesoInput });
      AppState.set('pesoHistorico', historico);
      AppState.notify();
    }

    if (target.id === 'surprise-me') {
      const receita = RECEITAS[Math.floor(Math.random() * RECEITAS.length)];
      if (!receita) return;
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay open';
      overlay.innerHTML = `
        <div class="modal-content">
          <h2>🎲 ${receita.nome}</h2>
          <div class="recipe-meta">⏱ ${receita.tempo} · ${receita.dificuldade}</div>
          <div class="card-title" style="margin-top:16px">Ingredientes</div>
          <ul style="font-size:.85rem;color:var(--text-dim);line-height:1.8;margin-bottom:12px;padding-left:20px">
            ${receita.ingredientes.map(i => {
              const item = CATEGORIAS_ALIMENTOS.flatMap(c => c.itens).find(a => a.id === i);
              return `<li>${item ? item.nome : i}</li>`;
            }).join('')}
          </ul>
          <div class="card-title">Modo de Preparo</div>
          <p style="font-size:.85rem;color:var(--text-dim);line-height:1.6;white-space:pre-line">${receita.instrucoes}</p>
          <button class="btn btn-primary btn-block" style="margin-top:16px" id="fechar-modal">Fechar</button>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.id === 'fechar-modal') overlay.remove();
      });
    }

    if (target.id === 'limpar-opcoes') {
      AppState.set('alimentosSelecionados', []);
      AppState.notify();
    }

    if (target.id === 'limpar-historico') {
      if (confirm('Tem certeza que deseja limpar todo o histórico de treinos?')) {
        AppState.set('treinos', []);
        AppState.notify();
      }
    }

    const filterChip = target.closest('.filter-chip');
    if (filterChip && filterChip.closest('#filtro-nivel, #filtro-equipamento, #filtro-musculo')) {
      const filtros = AppState.get('filtrosExercicios') || { nivel: '', equipamento: '', musculo: '' };
      const parentId = filterChip.closest('.filter-bar').id;
      const keyMap = { 'filtro-nivel': 'nivel', 'filtro-equipamento': 'equipamento', 'filtro-musculo': 'musculo' };
      const key = keyMap[parentId];
      if (key) {
        filtros[key] = filterChip.dataset.value;
        AppState.set('filtrosExercicios', filtros);
        AppState.notify();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  AppState.init();

  if (!AppState.get('timerEstado')) {
    const cfg = AppState.get('timerConfig') || { trabalho: 20, descanso: 10, rounds: 8, sets: 3, descansoSet: 60 };
    AppState._data.timerEstado = { fase: 'work', round: 1, set: 1, tempo: cfg.trabalho, total: cfg.trabalho, status: 'pronto' };
  }

  setupGlobalListeners();

  window.addEventListener('popstate', () => {
    const page = new URLSearchParams(window.location.search).get('page') || 'inicio';
    renderPage(page);
  });

  const initialPage = new URLSearchParams(window.location.search).get('page') || 'inicio';
  if (PAGES[initialPage]) renderPage(initialPage);
  else renderPage('inicio');
});

window.addEventListener('beforeunload', () => {
  AppState._save();
});

function appShowUpdateToast(reg) {
  const toast = document.getElementById('update-toast');
  if (!toast) return;
  toast.style.display = 'flex';
  const btn = document.getElementById('btn-atualizar-agora');
  if (btn) {
    btn._reg = reg;
    btn.onclick = function () {
      if (this._reg && this._reg.waiting) {
        this._reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    };
  }
  const closeBtn = document.getElementById('btn-fechar-toast');
  if (closeBtn) {
    closeBtn.onclick = () => { toast.style.display = 'none'; };
  }
}

function appCheckForUpdates() {
  const toast = document.getElementById('update-toast');
  const reg = window.__swReg;
  if (!reg) {
    if (toast) {
      toast.querySelector('span').textContent = 'Service Worker não disponível';
      toast.style.display = 'flex';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
    return;
  }
  reg.update().then(() => {
    if (toast) {
      toast.querySelector('span').textContent = '✅ Verificação concluída';
      toast.style.display = 'flex';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
  }).catch(() => {
    if (toast) {
      toast.querySelector('span').textContent = '❌ Erro ao verificar';
      toast.style.display = 'flex';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
  });
}

document.addEventListener('click', e => {
  if (e.target.id === 'verificar-atualizacoes') {
    e.preventDefault();
    const toast = document.getElementById('update-toast');
    if (toast) toast.querySelector('span').textContent = '🔄 Verificando...';
    appCheckForUpdates();
  }
});
