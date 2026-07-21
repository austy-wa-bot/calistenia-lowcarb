function renderPrograma() {
  const totalSemanas = PROGRAMA_SEMANAL.length;
  const semanaIdx = AppState.get('programaSemanaAtual') ?? semanaAtual();
  const semana = PROGRAMA_SEMANAL[semanaIdx];
  const treinosCompletos = AppState.get('treinosPrograma') || {};
  const todasStats = treinosCompletos[semanaIdx] || [];
  const perfil = AppState.get('perfil') || {};
  const condicoes = perfil.condicoes || [];
  const tempoParado = perfil.tempoParado || '';
  const tabataCfg = tabataPorTempoParado(tempoParado);
  const avisoGeral = avisoCondicoes(condicoes);

  if (!AppState.get('programaInicio') && !AppState.get('programaSemanaAtual')) {
    return renderProgramaWelcome();
  }

  const weekNav = `
    <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px">
      ${PROGRAMA_SEMANAL.map((s, i) => `
        <button class="btn ${i === semanaIdx ? 'btn-primary' : 'btn-secondary'} btn-sm" id="prog-week-${i}" style="flex-shrink:0">
          Semana ${i + 1}
        </button>
      `).join('')}
    </div>
  `;

  const diasHTML = semana.dias.map((d, di) => {
    const completo = todasStats.includes(d.dia);
    const key = `${semanaIdx}-${d.dia}`;
    const temRestricao = d.exercicios.some(id => !exercicioCompativel(id, condicoes).ok);
    return `
      <div class="card" style="margin:0 ${di > 0 ? '0 0 0 0' : '0'};${di > 0 ? '' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div>
            <div style="font-weight:600;font-size:.9rem">${d.label}</div>
            <div style="font-size:.78rem;color:var(--text-dim)">${d.foco}</div>
          </div>
          ${completo ? '<span style="font-size:.8rem;color:var(--green)">✅ Completo</span>' : ''}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
          ${d.exercicios.map(id => {
            const ex = exercicioPorId(id);
            if (!ex) return '';
            const compat = exercicioCompativel(id, condicoes);
            const cor = compat.ok ? 'var(--bg-input)' : 'var(--yellow-light)';
            const borda = compat.ok ? 'transparent' : 'var(--yellow)';
            return `<span class="chip-checkable" style="cursor:default;background:${cor};border-color:${borda};padding:4px 10px;font-size:.78rem" title="${compat.ok ? '' : '⚠️ ' + (compat.motivos || []).join(', ')}">${ex.nome}${compat.ok ? '' : ' ⚠️'}</span>`;
          }).join('')}
        </div>
        ${temRestricao ? '<div style="font-size:.72rem;color:var(--yellow);margin-bottom:6px">⚠️ Exercícios com restrição — adapte conforme necessário</div>' : ''}
        ${tempoParado && tabataCfg.label !== 'intensidade normal' ? `<div style="font-size:.72rem;color:var(--accent);margin-bottom:6px">⏱ Tabata adaptado: ${tabataCfg.trabalho}s/${tabataCfg.descanso}s — ${tabataCfg.label}</div>` : ''}
        <div style="display:flex;gap:8px">
          <button class="btn btn-green btn-sm" id="prog-iniciar-${key}" style="flex:1">▶ Iniciar</button>
          <button class="btn btn-secondary btn-sm" id="prog-completar-${key}" style="flex:1">
            ${completo ? '✓' : '○'} ${completo ? 'Feito' : 'Completar'}
          </button>
        </div>
      </div>
    `;
  }).join('<div style="height:10px"></div>');

  const totalFeitos = PROGRAMA_SEMANAL.reduce((acc, s, si) => {
    const stats = treinosCompletos[si] || [];
    return acc + stats.length;
  }, 0);
  const totalDias = totalSemanas * 3;

  return `
    <div class="page" id="page-programa">
      <div class="card" style="padding-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div class="card-title" style="margin:0">📅 Programa Semanal</div>
          <span style="font-size:.75rem;color:var(--text-dim)">${totalFeitos}/${totalDias} treinos</span>
        </div>
        <div style="height:4px;background:var(--bg-input);border-radius:2px;margin-bottom:12px;overflow:hidden">
          <div style="height:100%;width:${(totalFeitos / totalDias) * 100}%;background:var(--green);border-radius:2px;transition:width .3s"></div>
        </div>
        ${weekNav}
      </div>

      ${avisoGeral ? `
        <div class="card" style="padding:10px 14px;background:var(--yellow-light);border:1px solid var(--yellow);font-size:.8rem;color:var(--text);line-height:1.5">
          ${avisoGeral}
        </div>
      ` : ''}

      <div class="card" style="text-align:center">
        <div style="font-weight:700;font-size:1.1rem;color:var(--primary)">Semana ${semanaIdx + 1}: ${semana.titulo}</div>
        <div style="font-size:.8rem;color:var(--text-dim);margin-top:4px">${semana.subtitulo}</div>
        ${tempoParado && tabataCfg.label !== 'intensidade normal' ? `<div style="font-size:.78rem;color:var(--accent);margin-top:6px">⏱ Seu ritmo: ${tabataCfg.trabalho}s trabalho / ${tabataCfg.descanso}s descanso</div>` : ''}
      </div>

      ${diasHTML}

      ${semanaIdx < totalSemanas - 1 ? `
        <button class="btn btn-primary btn-block" id="prog-proxima-semana">Próxima Semana →</button>
      ` : ''}
      ${semanaIdx > 0 ? `
        <button class="btn btn-secondary btn-block" id="prog-semana-anterior" style="margin-top:8px">← Semana Anterior</button>
      ` : ''}
    </div>
  `;
}

function renderProgramaWelcome() {
  return `
    <div class="page" id="page-programa">
      <div class="card" style="text-align:center;padding:32px 20px">
        <div style="font-size:3rem;margin-bottom:12px">📅</div>
        <h2 style="font-size:1.3rem;margin-bottom:8px">Programa Guiado</h2>
        <p style="font-size:.85rem;color:var(--text-dim);line-height:1.5;margin-bottom:16px">
          4 semanas de treino progressivo. <br>
          3× por semana, 15 min por dia.
        </p>
        <div style="display:flex;flex-direction:column;gap:8px;text-align:left;margin-bottom:20px">
          <div style="font-size:.85rem">✅ Semana 1: Fundação — movimentos básicos</div>
          <div style="font-size:.85rem">✅ Semana 2: Progressão — novos ângulos</div>
          <div style="font-size:.85rem">✅ Semana 3: Intensificação — mais força</div>
          <div style="font-size:.85rem">✅ Semana 4: Consolidação — corpo completo</div>
        </div>
        <button class="btn btn-primary btn-block" id="prog-comecar">🚀 Começar Programa</button>
      </div>
    </div>
  `;
}
