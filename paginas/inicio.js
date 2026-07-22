function renderInicio() {
  const perfil = AppState.get('perfil') || {};
  const pesoHistorico = AppState.get('pesoHistorico') || [];
  const treinos = AppState.get('treinos') || [];

  const onboardingCompleto = AppState.get('onboardingCompleto');
  if (!onboardingCompleto) {
    return renderOnboarding();
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
            <div style="font-size:.85rem;color:var(--text-dim)">Hoje (meta: deitar até ${AppState.get('onboardSonoMeta') || '22:00'})</div>
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
          <button class="btn btn-primary" id="inicio-programa" style="flex:1">📅 Programa</button>
        </div>
        <div class="btn-group" style="margin-top:8px">
          <button class="btn btn-secondary" id="inicio-exercicios" style="flex:1">🏋️ Exercícios</button>
          <button class="btn btn-secondary" id="inicio-dieta" style="flex:1">🥗 Dieta</button>
        </div>
        <div class="btn-group" style="margin-top:8px">
          <button class="btn btn-secondary" id="inicio-progresso" style="flex:1">📊 Progresso</button>
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

function renderOnboarding() {
  const step = AppState.get('onboardingStep') || 0;
  const total = 9;
  const pct = ((step + 1) / total) * 100;

  const steps = [
    { titulo: 'Bem-vindo', icone: '💪' },
    { titulo: 'Expectativas', icone: '🎯' },
    { titulo: 'Seu Ritmo', icone: '🏃' },
    { titulo: 'Despensa', icone: '🥗' },
    { titulo: 'Primeiro Treino', icone: '🏋️' },
    { titulo: 'Qualidade do Sono', icone: '😴' },
    { titulo: 'Seus Dados', icone: '📝' },
    { titulo: 'Primeira Refeição', icone: '🍳' },
    { titulo: 'Próximo Passo', icone: '🚀' },
  ];

  const bar = `
    <div style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;font-size:.75rem;color:var(--text-dim);margin-bottom:4px">
        <span>${steps[step].icone} ${steps[step].titulo}</span>
        <span>${step + 1}/${total}</span>
      </div>
      <div style="height:4px;background:var(--bg-input);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:var(--green);border-radius:2px;transition:width .3s"></div>
      </div>
    </div>
  `;

  let body = '';
  let nextLabel = 'Próximo';
  let showNext = true;
  let showBack = step > 0;

  switch (step) {
    case 0: {
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3.5rem;margin-bottom:12px">💪</div>
          <h2 style="font-size:1.4rem;margin-bottom:8px">Bem-vindo ao CicloFit!</h2>
          <p style="font-size:.85rem;color:var(--text-dim);line-height:1.6;margin-bottom:6px">
            Seu método completo para transformar corpo e mente.
          </p>
          <p style="font-size:.82rem;color:var(--text-dim);line-height:1.5">
            Vamos te guiar por <strong>${total} passos</strong> rápidos para personalizar sua jornada.
          </p>
          <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;text-align:left">
            <div style="font-size:.85rem">✅ Calistenia + Jejum Intermitente</div>
            <div style="font-size:.85rem">✅ Dieta Low-Carb orientada</div>
            <div style="font-size:.85rem">✅ Timer Tabata integrado</div>
            <div style="font-size:.85rem">✅ Metodologia Nuno Cobra</div>
          </div>
        </div>
      `;
      break;
    }
    case 1: {
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">🎯</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Nossas Expectativas</h2>
          <p style="font-size:.85rem;color:var(--text-dim);line-height:1.5;margin-bottom:16px">
            O CicloFit funciona com consistência, não com intensidade máxima.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.9rem">📅 3× por semana</div>
              <div style="font-size:.8rem;color:var(--text-dim)">Segunda, Quarta e Sexta — ou sua melhor agenda</div>
            </div>
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.9rem">⏱ 12-20 minutos</div>
              <div style="font-size:.8rem;color:var(--text-dim)">Aquecimento + Tabata + Desaquecimento</div>
            </div>
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.9rem">🥗 Low-Carb sem radicalismo</div>
              <div style="font-size:.8rem;color:var(--text-dim)">Priorize proteína e gordura boa, sem neurose</div>
            </div>
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.9rem">😴 Sono como pilar #1</div>
              <div style="font-size:.8rem;color:var(--text-dim)">8h de sono regulam seus hormônios</div>
            </div>
          </div>
        </div>
      `;
      break;
    }
    case 2: {
      const perfil = AppState.get('perfil') || {};
      const tempoParado = perfil.tempoParado || '';
      const condicoes = perfil.condicoes || [];
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">🏃</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Seu Ritmo</h2>
          <p style="font-size:.82rem;color:var(--text-dim);line-height:1.5;margin-bottom:16px">
            Isso ajuda a personalizar a intensidade do programa.
          </p>
          <div class="form-group" style="text-align:left">
            <label>Há quanto tempo você treina regularmente?</label>
            <select id="input-tempo-parado" style="font-size:.9rem">
              <option value="" ${!tempoParado ? 'selected' : ''}>Selecione...</option>
              <option value="nunca" ${tempoParado === 'nunca' ? 'selected' : ''}>Nunca parei — treino regularmente</option>
              <option value="menos-1-mes" ${tempoParado === 'menos-1-mes' ? 'selected' : ''}>Menos de 1 mês parado</option>
              <option value="1-3-meses" ${tempoParado === '1-3-meses' ? 'selected' : ''}>1 a 3 meses parado</option>
              <option value="3-6-meses" ${tempoParado === '3-6-meses' ? 'selected' : ''}>3 a 6 meses parado</option>
              <option value="mais-6-meses" ${tempoParado === 'mais-6-meses' ? 'selected' : ''}>Mais de 6 meses parado</option>
            </select>
          </div>
          <div style="text-align:left;margin-top:16px">
            <label style="font-size:.85rem;font-weight:600;display:block;margin-bottom:8px">Tem alguma condição ou limitação?</label>
            ${[
              {id:'nenhuma', label:'Nenhuma'},
              {id:'joelho', label:'Joelho'},
              {id:'coluna', label:'Coluna / Costas'},
              {id:'ombro', label:'Ombro'},
              {id:'punho', label:'Punho'},
              {id:'cardiaco', label:'Cardíaco'},
              {id:'hernia', label:'Hérnia de disco'},
            ].map(c => `
              <label class="chip-checkable ${condicoes.includes(c.id) ? 'checked' : ''}" data-cond="${c.id}" style="display:inline-flex;margin:0 4px 6px 0;font-size:.82rem">
                <input type="checkbox" ${condicoes.includes(c.id) ? 'checked' : ''} style="display:none">
                <span>${c.label}</span>
              </label>
            `).join('')}
            <div style="margin-top:8px">
              <input type="text" id="input-outra-condicao" value="${perfil.outraCondicao || ''}" placeholder="Outra (opcional)" style="font-size:.85rem;width:100%">
            </div>
          </div>
        </div>
      `;
      break;
    }
    case 3: {
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">🥗</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">O que tem na despensa?</h2>
          <p style="font-size:.82rem;color:var(--text-dim);line-height:1.5;margin-bottom:12px">
            Marque os alimentos que você já tem ou consome regularmente.
          </p>
          <div id="onboard-pantry-list">
            ${CATEGORIAS_ALIMENTOS.map((cat, ci) => `
              <details class="pantry-group" ${ci < 3 ? 'open' : ''}>
                <summary style="font-size:.85rem;font-weight:600;padding:8px 0;cursor:pointer;color:var(--text)">${cat.nome}</summary>
                <div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 0 8px">
                  ${cat.itens.map(item => {
                    const sel = AppState.get('alimentosSelecionados') || [];
                    const checked = sel.includes(item.id) ? 'checked' : '';
                    return `
                      <label class="chip-checkable ${checked}" data-id="${item.id}">
                        <input type="checkbox" ${checked} style="display:none">
                        <span>${item.nome.split(' - ').pop()}</span>
                      </label>
                    `;
                  }).join('')}
                </div>
              </details>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }
    case 4: {
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">🏋️</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Primeiro Treino</h2>
          <p style="font-size:.82rem;color:var(--text-dim);line-height:1.5;margin-bottom:16px">
            Que tal fazer um treino leve agora? Marque como concluído depois.
          </p>
          <div class="card" style="margin:0;text-align:left">
            <div style="font-weight:600;font-size:.9rem;margin-bottom:8px">🔥 Aquecimento (5 min)</div>
            <div style="font-size:.85rem;color:var(--text-dim);line-height:1.8">
              <div>1. Polichinelo — 30s</div>
              <div>2. Rotação de ombros — 30s</div>
              <div>3. Agachamento sem peso — 30s</div>
              <div>4. Alongamento de braços — 30s</div>
              <div>5. Polichinelo — 30s</div>
            </div>
          </div>
          <label class="chip-checkable" id="onboard-treino-done" style="margin-top:16px;display:inline-flex;font-size:.9rem;padding:8px 20px">
            <input type="checkbox" id="onboard-treino-check" ${AppState.get('onboardTreinoDone') ? 'checked' : ''} style="margin-right:8px">
            ✅ Concluí o aquecimento
          </label>
        </div>
      `;
      break;
    }
    case 5: {
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">😴</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Qualidade do Sono</h2>
          <p style="font-size:.82rem;color:var(--text-dim);line-height:1.5;margin-bottom:16px">
            O sono é o pilar mais importante do método. Defina sua meta de horário para dormir.
          </p>
          <div class="form-group" style="max-width:200px;margin:0 auto">
            <label>Horário que você vai deitar</label>
            <select id="onboard-sono-horario" style="text-align:center;font-size:1rem">
              ${['21:00','21:30','22:00','22:30','23:00','23:30'].map(h =>
                `<option value="${h}" ${(AppState.get('onboardSonoMeta') || '22:00') === h ? 'selected' : ''}>${h}</option>`
              ).join('')}
            </select>
          </div>
          <div style="margin-top:16px;font-size:.82rem;color:var(--text-dim)">
            💡 Ideal: deitar até 22h e acordar sem despertador
          </div>
        </div>
      `;
      break;
    }
    case 6: {
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">📝</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Seus Dados</h2>
          <p style="font-size:.82rem;color:var(--text-dim);margin-bottom:16px;line-height:1.5">
            Vamos acompanhar sua evolução juntos!
          </p>
          <div class="form-group">
            <label>Seu nome</label>
            <input type="text" id="input-nome" value="${AppState.get('perfil')?.nome || ''}" placeholder="Ex: João" style="text-align:center">
          </div>
          <div class="form-row" style="margin-bottom:12px">
            <div class="form-group">
              <label>Peso (kg)</label>
              <input type="number" id="input-peso" step="0.1" min="20" max="300" value="${AppState.get('perfil')?.peso || ''}" placeholder="Ex: 75" style="text-align:center">
            </div>
            <div class="form-group">
              <label>Altura (cm)</label>
              <input type="number" id="input-altura" step="1" min="100" max="250" value="${AppState.get('perfil')?.altura || ''}" placeholder="Ex: 175" style="text-align:center">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:20px">
            <label>Peso alvo (kg)</label>
            <input type="number" id="input-peso-alvo" step="0.1" min="20" max="300" value="${AppState.get('perfil')?.pesoAlvo || ''}" placeholder="Ex: 70" style="text-align:center">
          </div>
        </div>
      `;
      break;
    }
    case 7: {
      const selecionados = AppState.get('alimentosSelecionados') || [];
      let sugestao = null;
      let comIngredientes = 0;
      if (selecionados.length > 0) {
        const candidatas = RECEITAS.filter(r =>
          r.ingredientes.some(i => selecionados.includes(i))
        );
        if (candidatas.length > 0) {
          candidatas.sort((a, b) => {
            const aMatch = a.ingredientes.filter(i => selecionados.includes(i)).length;
            const bMatch = b.ingredientes.filter(i => selecionados.includes(i)).length;
            return bMatch - aMatch;
          });
          sugestao = candidatas[0];
          comIngredientes = sugestao.ingredientes.filter(i => selecionados.includes(i)).length;
        }
      }
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">🍳</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Primeira Refeição</h2>
          <p style="font-size:.82rem;color:var(--text-dim);line-height:1.5;margin-bottom:16px">
            Com base na sua despensa, sugerimos esta receita:
          </p>
          ${sugestao ? `
            <div class="card recipe-card" style="margin:0;text-align:left;cursor:default" data-recipe-id="${sugestao.id}">
              <div style="font-weight:600;font-size:.95rem">${sugestao.nome}</div>
              <div style="font-size:.75rem;color:var(--text-dim);margin:4px 0 8px">⏱ ${sugestao.tempo} · ${sugestao.dificuldade}</div>
              <div style="font-size:.8rem;color:var(--text-dim);margin-bottom:6px">🧂 Ingredientes que você tem: ${comIngredientes}/${sugestao.ingredientes.length}</div>
              <div style="font-size:.8rem;line-height:1.6;color:var(--text);white-space:pre-line">${sugestao.instrucoes}</div>
            </div>
          ` : `
            <div style="padding:20px;color:var(--text-dim);font-size:.85rem">
              Nenhum ingrediente marcado na despensa. Você pode explorar receitas depois na aba Dieta!
            </div>
          `}
        </div>
      `;
      nextLabel = 'Último';
      break;
    }
    case 8: {
      body = `
        <div style="text-align:center;padding:8px 0">
          <div style="font-size:3rem;margin-bottom:12px">🚀</div>
          <h2 style="font-size:1.3rem;margin-bottom:8px">Pronto para Começar!</h2>
          <p style="font-size:.85rem;color:var(--text-dim);line-height:1.6;margin-bottom:16px">
            Amanhã é o primeiro dia da sua nova rotina. Aqui vai seu plano:
          </p>
          <div style="display:flex;flex-direction:column;gap:10px;text-align:left">
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.85rem">🌅 Ao acordar</div>
              <div style="font-size:.8rem;color:var(--text-dim)">Jejum de 16h · Água com limão</div>
            </div>
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.85rem">🏋️ Primeira atividade</div>
              <div style="font-size:.8rem;color:var(--text-dim)">Aquecimento de 5 min + alongamento</div>
            </div>
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.85rem">🥗 Primeira refeição (12h)</div>
              <div style="font-size:.8rem;color:var(--text-dim)">Café da manhã low-carb — veja a aba Dieta</div>
            </div>
            <div class="card" style="padding:12px 16px;margin:0">
              <div style="font-weight:600;font-size:.85rem">😴 Meta de sono</div>
              <div style="font-size:.8rem;color:var(--text-dim)">Deitar até ${AppState.get('onboardSonoMeta') || '22:00'}</div>
            </div>
          </div>
          <div style="margin-top:20px;font-size:.82rem;color:var(--text-dim)">
            💡 Lembre-se: consistência > intensidade. Você consegue!
          </div>
        </div>
      `;
      nextLabel = '✅ Concluir';
      showBack = true;
      break;
    }
  }

  return `
    <div class="page" id="page-inicio">
      <div class="card" style="padding:24px 20px">
        ${bar}
        ${body}
        <div style="display:flex;gap:10px;margin-top:20px;justify-content:${showBack ? 'space-between' : 'center'}">
          ${showBack ? '<button class="btn btn-secondary" id="onboard-back" style="flex:1">← Voltar</button>' : ''}
          <button class="btn btn-primary" id="onboard-next" style="flex:${showBack ? '2' : '1'};max-width:${showBack ? 'none' : '280px'}">${nextLabel} →</button>
        </div>
      </div>
    </div>
  `;
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