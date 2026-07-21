function renderProgresso() {
  const treinos = AppState.get('treinos') || [];
  const perfil = AppState.get('perfil') || {};
  const pesoHistorico = AppState.get('pesoHistorico') || [];

  const totalTreinos = treinos.length;
  const totalSets = treinos.reduce((acc, t) => acc + (t.config?.sets || 0), 0);
  const totalRounds = treinos.reduce((acc, t) => acc + (t.config?.rounds || 0) * (t.config?.sets || 0), 0);
  const hoje = new Date().toDateString();
  const treinosHoje = treinos.filter(t => new Date(t.data).toDateString() === hoje).length;

  let imc = null;
  let imcClass = '';
  if (perfil.peso && perfil.altura) {
    const h = perfil.altura / 100;
    imc = (perfil.peso / (h * h)).toFixed(1);
    const val = parseFloat(imc);
    if (val < 18.5) imcClass = 'Abaixo do peso';
    else if (val < 25) imcClass = 'Peso normal';
    else if (val < 30) imcClass = 'Sobrepeso';
    else imcClass = 'Obesidade';
  }

  const ultimoPeso = pesoHistorico.length > 0 ? pesoHistorico[pesoHistorico.length - 1].peso : perfil.peso || null;

  const pesoChart = [...pesoHistorico].reverse().slice(0, 10).reverse().map(e => {
    const d = new Date(e.data);
    return `
      <div class="workout-item">
        <div class="workout-date">${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
        <div class="workout-detail" style="font-size:1rem;font-weight:600;color:var(--text)">${e.peso} kg</div>
      </div>
    `;
  }).join('');

  const treinosHTML = treinos.length === 0
    ? '<div class="empty-state"><div class="empty-icon">📋</div><p>Nenhum treino registrado ainda.</p></div>'
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
        <div class="card-title">👤 Meu Perfil</div>
        <div class="form-row">
          <div class="form-group">
            <label>Peso (kg)</label>
            <input type="number" id="input-peso" value="${perfil.peso || ''}" step="0.1" min="20" max="300" placeholder="Ex: 75">
          </div>
          <div class="form-group">
            <label>Altura (cm)</label>
            <input type="number" id="input-altura" value="${perfil.altura || ''}" step="1" min="100" max="250" placeholder="Ex: 175">
          </div>
          <div class="form-group">
            <label>Peso Alvo (kg)</label>
            <input type="number" id="input-peso-alvo" value="${perfil.pesoAlvo || ''}" step="0.1" min="20" max="300" placeholder="Ex: 70">
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn btn-primary btn-sm" id="salvar-perfil">💾 Salvar Perfil</button>
          <button class="btn btn-green btn-sm" id="registrar-peso" ${!perfil.peso ? 'disabled style="opacity:.5"' : ''}>📝 Registrar Peso Hoje</button>
        </div>
      </div>

      ${imc ? `
      <div class="card">
        <div class="card-title">📊 IMC</div>
        <div class="progress-stats">
          <div class="stat-card">
            <div class="stat-value ${imcClass === 'Peso normal' ? 'stat-green' : imcClass === 'Obesidade' || imcClass === 'Abaixo do peso' ? 'stat-red' : 'stat-yellow'}">${imc}</div>
            <div class="stat-label">IMC Atual</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="font-size:1rem">${imcClass}</div>
            <div class="stat-label">Classificação</div>
          </div>
          ${perfil.pesoAlvo ? `
          <div class="stat-card">
            <div class="stat-value ${perfil.pesoAlvo < perfil.peso ? 'stat-green' : 'stat-yellow'}">${perfil.pesoAlvo} kg</div>
            <div class="stat-label">Meta</div>
          </div>
          <div class="stat-card">
            <div class="stat-value ${ultimoPeso ? (ultimoPeso <= perfil.pesoAlvo ? 'stat-green' : 'stat-red') : ''}">${ultimoPeso ? (perfil.peso - perfil.pesoAlvo > 0 ? '+' : '') + (perfil.peso - perfil.pesoAlvo).toFixed(1) : '—'} kg</div>
            <div class="stat-label">Faltam</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      ${perfil.pesoAlvo && perfil.peso !== perfil.pesoAlvo ? `
      <div class="card">
        <div class="card-title">⏱ Estimativa até a Meta</div>
        ${(() => {
          const perdaPorSemana = calcularPerdaSemanal(pesoHistorico);
          if (perdaPorSemana) {
            const diff = perfil.peso - perfil.pesoAlvo;
            const semanas = Math.abs(diff / perdaPorSemana);
            if (semanas > 0 && semanas < 200) {
              const s = Math.round(semanas);
              return `
                <div style="text-align:center;padding:8px 0">
                  <div style="font-size:1.8rem;font-weight:700;color:${s <= 4 ? 'var(--green)' : s <= 12 ? 'var(--yellow)' : 'var(--text-dim)'}">~${s} semanas</div>
                  <div style="font-size:.82rem;color:var(--text-dim);margin-top:4px">${perdaPorSemana > 0 ? `Perdendo ${Math.abs(perdaPorSemana).toFixed(2)} kg/semana` : `Ganhando ${Math.abs(perdaPorSemana).toFixed(2)} kg/semana`}</div>
                </div>
              `;
            }
          }
          return `
            <div style="text-align:center;padding:8px 0">
              <div style="font-size:.85rem;color:var(--text-dim)">📝 Registre seu peso por algumas semanas para vermos sua estimativa</div>
            </div>
          `;
        })()}
      </div>` : ''}

      ${pesoHistorico.length > 0 ? `
      <div class="card">
        <div class="card-title">📈 Evolução do Peso</div>
        ${pesoChart}
      </div>
      ` : ''}

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