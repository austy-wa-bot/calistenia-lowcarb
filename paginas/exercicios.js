function renderExercicios() {
  const filtros = AppState.get('filtrosExercicios') || { nivel: '', equipamento: '', musculo: '' };
  const resultados = filtrarExercicios(filtros);

  return `
    <div class="page" id="page-exercicios">
      <div class="filter-bar" id="filtro-nivel">
        <button class="filter-chip ${!filtros.nivel ? 'active' : ''}" data-value="">Todos</button>
        <button class="filter-chip ${filtros.nivel === 'iniciante' ? 'active' : ''}" data-value="iniciante">Iniciante</button>
        <button class="filter-chip ${filtros.nivel === 'intermediario' ? 'active' : ''}" data-value="intermediario">Intermediário</button>
        <button class="filter-chip ${filtros.nivel === 'avancado' ? 'active' : ''}" data-value="avancado">Avançado</button>
      </div>
      <div class="filter-bar" id="filtro-equipamento">
        <button class="filter-chip ${filtros.equipamento === '' ? 'active' : ''}" data-value="">Todos</button>
        <button class="filter-chip ${filtros.equipamento === 'nenhum' ? 'active' : ''}" data-value="nenhum">Sem Equip.</button>
        <button class="filter-chip ${filtros.equipamento === 'cadeira' ? 'active' : ''}" data-value="cadeira">Cadeira</button>
      </div>
      <div class="filter-bar" id="filtro-musculo">
        <button class="filter-chip ${filtros.musculo === '' ? 'active' : ''}" data-value="">Todos</button>
        ${listarMusculos().map(m => `
          <button class="filter-chip ${filtros.musculo === m ? 'active' : ''}" data-value="${m}">${m}</button>
        `).join('')}
      </div>
      ${resultados.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>Nenhum exercício encontrado com esses filtros.</p>
        </div>
      ` : resultados.map(ex => `
        <div class="card exercise-card">
          <div class="video-wrap">
            <iframe src="${ex.video}" loading="lazy" allowfullscreen></iframe>
          </div>
          <div class="exercise-info">
            <h3>${ex.nome}</h3>
            <p>${ex.descricao}</p>
            <div class="exercise-tags">
              <span class="badge ${ex.nivel === 'iniciante' ? 'badge-green' : ex.nivel === 'intermediario' ? 'badge-yellow' : 'badge-red'}">${ex.nivel}</span>
              <span class="badge badge-green">${ex.equipamento === 'nenhum' ? 'Sem equipamento' : ex.equipamento}</span>
              <span class="badge badge-green">${ex.musculo}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
