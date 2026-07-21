function renderInicio() {
  const perfil = AppState.get('perfil') || {};
  const pesoHistorico = AppState.get('pesoHistorico') || [];
  const treinos = AppState.get('treinos') || [];

  if (!perfil.nome) {
    return `
      <div class="page" id="page-inicio">
        <div class="card" style="text-align:center;padding:32px 20px">
          <div style="font-size:3rem;margin-bottom:12px">💪</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Bem-vindo!</h2>
          <p style="font-size:.85rem;color:var(--text-dim);margin-bottom:20px;line-height:1.5">
            Preencha seus dados para começar. Vamos acompanhar sua evolução juntos!
          </p>
          <div class="form-group">
            <label>Seu nome</label>
            <input type="text" id="input-nome" placeholder="Ex: João" style="text-align:center">
          </div>
          <div class="form-row" style="margin-bottom:12px">
            <div class="form-group">
              <label>Peso (kg)</label>
              <input type="number" id="input-peso" step="0.1" min="20" max="300" placeholder="Ex: 75" style="text-align:center">
            </div>
            <div class="form-group">
              <label>Altura (cm)</label>
              <input type="number" id="input-altura" step="1" min="100" max="250" placeholder="Ex: 175" style="text-align:center">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:20px">
            <label>Peso alvo (kg)</label>
            <input type="number" id="input-peso-alvo" step="0.1" min="20" max="300" placeholder="Ex: 70" style="text-align:center">
          </div>
          <button class="btn btn-primary btn-block" id="onboard-salvar">🚀 Começar</button>
        </div>
      </div>
    `;
  }

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const ultimoTreino = treinos.length > 0 ? treinos[treinos.length - 1] : null;
  const ultimoTreinoStr = ultimoTreino
    ? new Date(ultimoTreino.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : 'Nenhum ainda';

  const perdaPorSemana = calcularPerdaSemanal(pesoHistorico);
  let estimativa = null;
  if (perdaPorSemana && perfil.pesoAlvo && perfil.pesoAlvo !== perfil.peso) {
    const diff = perfil.peso - perfil.pesoAlvo;
    const semanas = Math.abs(diff / perdaPorSemana);
    if (semanas > 0 && semanas < 200) {
      estimativa = Math.round(semanas);
    }
  }

  const progressoPct = perfil.pesoAlvo && perfil.peso !== perfil.pesoAlvo
    ? Math.min(100, Math.max(0, ((perfil.peso - perfil.pesoAlvo) / (perfil.peso - perfil.pesoAlvo)) * 100))
    : 100;

  const sono = AppState.get('sono') || {};
  const hojeStr = new Date().toISOString().split('T')[0];
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const ontemStr = ontem.toISOString().split('T')[0];
  const sonoOntem = sono[ontemStr];
  const sonoHoje = sono[hojeStr];
  const streakSono = (() => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (sono[ds]) streak++;
      else break;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  })();

  return `
    <div class="page" id="page-inicio">
      <div class="card">
        <h2 style="font-size:1.2rem;margin-bottom:4px">${saudacao}, ${perfil.nome}!</h2>
        <p style="font-size:.82rem;color:var(--text-dim)">💪 Vamos treinar hoje?</p>
      </div>

      <div class="card">
        <div class="card-title">📊 Resumo</div>
        <div class="progress-stats">
          <div class="stat-card">
            <div class="stat-value ${perfil.pesoAlvo && perfil.peso <= perfil.pesoAlvo ? 'stat-green' : ''}">${perfil.peso} kg</div>
            <div class="stat-label">Peso Atual</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--text-dim)">${perfil.pesoAlvo} kg</div>
            <div class="stat-label">Peso Alvo</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--green)">${perfil.peso - perfil.pesoAlvo > 0 ? '+' : ''}${(perfil.peso - perfil.pesoAlvo).toFixed(1)} kg</div>
            <div class="stat-label">Faltam</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${treinos.length}</div>
            <div class="stat-label">Treinos Feitos</div>
          </div>
        </div>

        ${estimativa ? `
        <div style="margin-top:12px;padding:12px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center">
          <div style="font-size:.82rem;color:var(--text-dim)">⏱ Estimativa para atingir sua meta</div>
          <div style="font-size:1.4rem;font-weight:700;color:${estimativa <= 4 ? 'var(--green)' : 'var(--yellow)'}">~${estimativa} semanas</div>
          <div style="font-size:.75rem;color:var(--text-dim);margin-top:4px">${perdaPorSemana > 0 ? `Perdendo ${Math.abs(perdaPorSemana).toFixed(2)} kg/semana` : `Ganhando ${Math.abs(perdaPorSemana).toFixed(2)} kg/semana`}</div>
        </div>
        ` : perfil.pesoAlvo && perfil.peso !== perfil.pesoAlvo ? `
        <div style="margin-top:12px;padding:12px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center">
          <div style="font-size:.82rem;color:var(--text-dim)">📝 Registre seu peso por algumas semanas para vermos sua estimativa</div>
        </div>
        ` : ''}
      </div>

      <div class="card">
        <div class="card-title">😴 Sono — Pilar #1</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div>
            <div style="font-size:.85rem;color:var(--text-dim)">Ontem você dormiu 8h?</div>
            <div style="font-size:1.1rem;font-weight:600;color:${sonoOntem ? 'var(--green)' : 'var(--text-dim)'}">${sonoOntem ? '✅ Sim' : '❓ Não registrado'}</div>
          </div>
          <button class="btn ${sonoOntem ? 'btn-green' : 'btn-secondary'} btn-sm" id="toggle-sono-ontem">${sonoOntem ? '✓' : 'Marcar'}</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:.85rem;color:var(--text-dim)">Hoje (meta: deitar até 22h)</div>
            <div style="font-size:1.1rem;font-weight:600;color:${sonoHoje ? 'var(--green)' : 'var(--text-dim)'}">${sonoHoje ? '✅ Registrado' : '⏳ Pendente'}</div>
          </div>
          <button class="btn ${sonoHoje ? 'btn-green' : 'btn-secondary'} btn-sm" id="toggle-sono-hoje">${sonoHoje ? '✓' : 'Marcar'}</button>
        </div>
        ${streakSono > 0 ? `<div style="margin-top:10px;font-size:.82rem;color:var(--green)">🔥 Sequência: ${streakSono} ${streakSono === 1 ? 'dia' : 'dias'} com 8h de sono</div>` : ''}
      </div>

      <div class="card">
        <div class="card-title">💡 Dica do Dia — Nuno Cobra</div>
        <div style="font-size:.9rem;color:var(--text);line-height:1.6;font-style:italic">
          "${dicaDoDia()}"
        </div>
      </div>

      <div class="card">
        <div class="card-title">⚡ Acesso Rápido</div>
        <div class="btn-group">
          <button class="btn btn-green" id="inicio-timer" style="flex:1">⏱ Timer</button>
          <button class="btn btn-primary" id="inicio-exercicios" style="flex:1">🏋️ Exercícios</button>
        </div>
        <div class="btn-group" style="margin-top:8px">
          <button class="btn btn-secondary" id="inicio-progresso" style="flex:1">📊 Progresso</button>
          <button class="btn btn-secondary" id="inicio-dieta" style="flex:1">🥗 Dieta</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📜 Último Treino</div>
        ${ultimoTreino ? `
          <div style="font-size:.9rem;font-weight:600">Tabata · ${ultimoTreino.config?.trabalho || '?'}s/${ultimoTreino.config?.descanso || '?'}s</div>
          <div style="font-size:.82rem;color:var(--text-dim);margin-top:4px">${ultimoTreinoStr} · ${ultimoTreino.config?.rounds || '?'} rounds × ${ultimoTreino.config?.sets || '?'} sets</div>
        ` : `
          <div style="font-size:.85rem;color:var(--text-dim)">Nenhum treino registrado ainda. Que tal começar agora?</div>
        `}
      </div>
    </div>
  `;
}

const DICAS_NUNO_COBRA = [
  "Fazer pouco e fazer sempre. A consistência vence a intensidade.",
  "Alcançar o cérebro através do músculo. O movimento cura.",
  "Nunca exceda seus limites. Respeite seu corpo hoje para fortalecê-lo amanhã.",
  "A semente da vitória precisa ser regada todos os dias.",
  "Seu corpo agradece cada passo, por menor que seja.",
  "O método não exige heróis. Exige persistência.",
  "Transformação física é consequência de hábitos, não de esforços hercúleos.",
  "Durma bem. Coma bem. Mova-se. O resto é consequência.",
  "Não há atalho. Há apenas o próximo passo.",
  "O corpo que você quer é feito nas pequenas decisões do dia a dia.",
  "Respire. Alongue. Siga. O movimento é vida.",
  "A disciplina é a ponte entre metas e conquistas.",
  "Não espere motivação. Crie o hábito.",
  "Cada treino é um voto para o tipo de pessoa que você quer se tornar.",
  "O método é simples porque a vida já é complexa demais."
];

function dicaDoDia() {
  const hoje = new Date();
  const diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
  return DICAS_NUNO_COBRA[diaDoAno % DICAS_NUNO_COBRA.length];
}

function calcularPerdaSemanal(historico) {
  if (historico.length < 2) return null;
  const ordenado = [...historico].sort((a, b) => new Date(a.data) - new Date(b.data));
  const primeiro = ordenado[0];
  const ultimo = ordenado[ordenado.length - 1];
  const dias = (new Date(ultimo.data) - new Date(primeiro.data)) / 86400000;
  if (dias < 7) return null;
  const semanas = dias / 7;
  return (ultimo.peso - primeiro.peso) / semanas;
}