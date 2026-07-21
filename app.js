const AppState = {
  _data: {},

  init() {
    try {
      const saved = localStorage.getItem('calisteniaApp');
      if (saved) this._data = JSON.parse(saved);
    } catch (e) {}

    const page = new URLSearchParams(window.location.search).get('page') || 'exercicios';
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
    const page = this._data._page || 'exercicios';
    renderPage(page);
  }
};

const PAGES = {
  exercicios: { render: renderExercicios },
  timer: { render: renderTimer },
  dieta: { render: renderDieta },
  progresso: { render: renderProgresso }
};

const PAGE_TITLES = {
  exercicios: '🏋️ Catálogo de Exercícios',
  timer: '⏱️ Timer Tabata',
  dieta: '🥗 Dieta Low-Carb',
  progresso: '📊 Meu Progresso'
};

function renderPage(pageId) {
  const content = document.getElementById('content');
  const title = document.getElementById('page-title');
  const page = PAGES[pageId];

  if (!page) return;

  title.textContent = PAGE_TITLES[pageId] || 'Calistenia Low-Carb';
  content.innerHTML = page.render();

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
    const page = new URLSearchParams(window.location.search).get('page') || 'exercicios';
    renderPage(page);
  });

  const initialPage = new URLSearchParams(window.location.search).get('page') || 'exercicios';
  if (PAGES[initialPage]) renderPage(initialPage);
  else renderPage('exercicios');
});

window.addEventListener('beforeunload', () => {
  AppState._save();
});
