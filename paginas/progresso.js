function renderProgresso() {
  const treinos = AppState.get('treinos') || [];

  const totalTreinos = treinos.length;
  const totalSets = treinos.reduce((acc, t) => acc + (t.config?.sets || 0), 0);
  const totalRounds = treinos.reduce((acc, t) => acc + (t.config?.rounds || 0) * (t.config?.sets || 0), 0);
  const hoje = new Date().toDateString();
  const treinosHoje = treinos.filter(t => new Date(t.data).toDateString() === hoje).length;

  const treinosHTML = treinos.length === 0
    ? '<div class="empty-state"><div class="empty-icon">📋</div><p>Nenhum treino registrado ainda. Complete um timer Tabata e salve para aparecer aqui!</p></div>'
    : [...treinos].reverse().slice(0, 20).map(t => {
        const data = new Date(t.data);
        return `
          <div class="workout-item">
            <div class="workout-date">${data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="workout-detail">
              Tabata: ${t.config?.trabalho || '?'}s trabalho / ${t.config?.descanso || '?'}s descanso · 
              ${t.config?.rounds || '?'} rounds × ${t.config?.sets || '?'} sets
            </div>
          </div>
        `;
      }).join('');

  return `
    <div class="page" id="page-progresso">
      <div class="card">
        <div class="card-title">📈 Suas Estatísticas</div>
        <div class="progress-stats">
          <div class="stat-card">
            <div class="stat-value">${totalTreinos}</div>
            <div class="stat-label">Total de Treinos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalSets}</div>
            <div class="stat-label">Total de Sets</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalRounds}</div>
            <div class="stat-label">Total de Rounds</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${treinosHoje}</div>
            <div class="stat-label">Treinos Hoje</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📜 Histórico de Treinos</div>
        ${treinosHTML}
      </div>

      ${treinos.length > 0 ? `
        <button class="btn btn-secondary btn-block" id="limpar-historico">🗑️ Limpar Histórico</button>
      ` : ''}
    </div>
  `;
}
