function renderDieta() {
  const selecionados = AppState.get('alimentosSelecionados') || [];
  const receitas = buscarReceitas(selecionados);

  const alimentosHTML = CATEGORIAS_ALIMENTOS.map(cat => `
    <div class="categoria-label">${cat.nome}</div>
    <div class="alimento-grid">
      ${cat.itens.map(item => `
        <button class="alimento-chip ${selecionados.includes(item.id) ? 'selected' : ''}" data-id="${item.id}">
          ${item.nome}
        </button>
      `).join('')}
    </div>
  `).join('');

  const receitasHTML = receitas.length === 0
    ? '<div class="empty-state"><p>Selecione alimentos acima para ver receitas compatíveis.</p></div>'
    : receitas.map(r => `
      <div class="card recipe-card" data-recipe-id="${r.id}">
        <span class="recipe-match ${r.matchCount === r.totalCount ? 'full' : 'partial'}">
          ${r.matchCount === r.totalCount ? '✅ Completa' : `⚠️ ${r.matchCount}/${r.totalCount} ingredientes`}
        </span>
        <h3>${r.nome}</h3>
        <div class="recipe-meta">⏱ ${r.tempo} · ${r.dificuldade}</div>
        ${r.matchCount < r.totalCount ? `
          <div class="recipe-ingredients">Faltam: ${r.ingredientes.filter(i => !selecionados.includes(i)).map(i => {
            const item = CATEGORIAS_ALIMENTOS.flatMap(c => c.itens).find(a => a.id === i);
            return item ? item.nome : i;
          }).join(', ')}</div>
        ` : ''}
      </div>
    `).join('');

  return `
    <div class="page" id="page-dieta">
      <div class="card">
        <div class="card-title">🥩 O que você tem em casa?</div>
        <p style="font-size:.82rem;color:var(--text-dim);margin-bottom:12px">Clique nos alimentos disponíveis para ver receitas low-carb compatíveis.</p>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:.8rem;color:var(--text-dim);margin-bottom:12px">
          <span>${selecionados.length > 0 ? `Selecionados: ${selecionados.length} alimentos` : 'Nenhum selecionado'}</span>
          ${selecionados.length > 0 ? '<button class="btn btn-secondary btn-sm" id="limpar-opcoes">✕ Limpar</button>' : ''}
        </div>
        ${alimentosHTML}
      </div>

      <div class="card">
        <div class="card-title">🍳 Receitas Sugeridas</div>
        <div id="receitas-lista">
          ${receitasHTML}
        </div>
      </div>
    </div>
  `;
}
