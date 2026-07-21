const PROGRAMA_SEMANAL = [
  {
    semana: 1,
    titulo: 'Fundação',
    subtitulo: 'Construindo a base — movimentos simples, consistência máxima.',
    dias: [
      {
        dia: 1,
        label: 'Segunda',
        foco: 'Corpo Inteiro',
        exercicios: ['agachamento', 'flexao-negativa', 'ponte', 'prancha'],
      },
      {
        dia: 2,
        label: 'Quarta',
        foco: 'Membros Inferiores + Core',
        exercicios: ['afundo', 'panturrilha', 'abdominal', 'superman'],
      },
      {
        dia: 3,
        label: 'Sexta',
        foco: 'Membros Superiores',
        exercicios: ['flexao', 'cadeira-elevacao', 'ponte', 'prancha'],
      },
    ],
  },
  {
    semana: 2,
    titulo: 'Progressão',
    subtitulo: 'Aumentando o desafio — novos ângulos, mesma disciplina.',
    dias: [
      {
        dia: 1,
        label: 'Segunda',
        foco: 'Empurrar + Agachar',
        exercicios: ['flexao', 'agachamento-bulgaro', 'bicicleta', 'mergulho-triceps'],
      },
      {
        dia: 2,
        label: 'Quarta',
        foco: 'Puxar + Core',
        exercicios: ['flexao-diamante', 'afundo', 'prancha', 'cadeira-barras'],
      },
      {
        dia: 3,
        label: 'Sexta',
        foco: 'Corpo Inteiro',
        exercicios: ['agachamento', 'flexao-pike', 'flexao-negativa', 'superman'],
      },
    ],
  },
  {
    semana: 3,
    titulo: 'Intensificação',
    subtitulo: 'Ritmo acelerado — mais força, mais controle.',
    dias: [
      {
        dia: 1,
        label: 'Segunda',
        foco: 'Empurrar + Pernas',
        exercicios: ['flexao-diamante', 'agachamento-bulgaro', 'mergulho-triceps', 'bicicleta'],
      },
      {
        dia: 2,
        label: 'Quarta',
        foco: 'Equilíbrio + Costas',
        exercicios: ['flexao-pike', 'cadeira-barras', 'agachamento', 'abdominal'],
      },
      {
        dia: 3,
        label: 'Sexta',
        foco: 'Potência',
        exercicios: ['flexao-diamante', 'afundo', 'panturrilha', 'prancha'],
      },
    ],
  },
  {
    semana: 4,
    titulo: 'Consolidação',
    subtitulo: 'O corpo já sabe o caminho. Agora é aperfeiçoar.',
    dias: [
      {
        dia: 1,
        label: 'Segunda',
        foco: 'Força Máxima',
        exercicios: ['flexao', 'agachamento-bulgaro', 'mergulho-triceps', 'bicicleta'],
      },
      {
        dia: 2,
        label: 'Quarta',
        foco: 'Core + Coordenação',
        exercicios: ['flexao-diamante', 'afundo', 'cadeira-barras', 'superman'],
      },
      {
        dia: 3,
        label: 'Sexta',
        foco: 'Corpo Inteiro (Desafio)',
        exercicios: ['flexao-pike', 'agachamento', 'flexao', 'prancha'],
      },
    ],
  },
];

function semanaAtual() {
  const inicio = AppState.get('programaInicio');
  if (!inicio) return 0;
  const dias = Math.floor((Date.now() - new Date(inicio).getTime()) / 86400000);
  const semana = Math.floor(dias / 7);
  return Math.min(semana, PROGRAMA_SEMANAL.length - 1);
}

function exercicioPorId(id) {
  return EXERCICIOS.find(e => e.id === id);
}

const EXERCICIOS_RESTRICOES = {
  'agachamento-bulgaro': ['joelho'],
  'pistol': ['joelho'],
  'afundo': ['joelho'],
  'agachamento': ['joelho'],
  'flexao-pike': ['ombro', 'punho'],
  'mergulho-triceps': ['ombro', 'punho'],
  'flexao': ['punho', 'ombro'],
  'flexao-diamante': ['punho', 'ombro'],
  'flexao-negativa': ['punho'],
  'flexao-aplaudida': ['punho', 'ombro'],
  'superman': ['coluna', 'hernia'],
  'prancha': ['coluna', 'punho'],
  'abdominal': ['coluna', 'hernia'],
  'bicicleta': ['coluna', 'hernia'],
  'cadeira-barras': ['ombro', 'coluna'],
};

function exercicioCompativel(id, condicoes) {
  if (!condicoes || condicoes.length === 0 || condicoes.includes('nenhuma')) return { ok: true };
  const restricoes = EXERCICIOS_RESTRICOES[id];
  if (!restricoes) return { ok: true };
  const conflitos = restricoes.filter(r => condicoes.includes(r));
  if (conflitos.length === 0) return { ok: true };
  return { ok: false, motivos: conflitos };
}

function tabataPorTempoParado(tempoParado) {
  const configs = {
    'nunca': { trabalho: 20, descanso: 10, rounds: 8, sets: 2, label: 'intensidade normal' },
    'menos-1-mes': { trabalho: 20, descanso: 10, rounds: 8, sets: 2, label: 'intensidade normal' },
    '1-3-meses': { trabalho: 15, descanso: 15, rounds: 8, sets: 2, label: 'ritmo moderado' },
    '3-6-meses': { trabalho: 10, descanso: 20, rounds: 8, sets: 2, label: 'ritmo leve' },
    'mais-6-meses': { trabalho: 10, descanso: 20, rounds: 8, sets: 1, label: 'ritmo leve - 1 set' },
  };
  return configs[tempoParado] || configs['nunca'];
}

function avisoCondicoes(condicoes) {
  if (!condicoes || condicoes.length === 0 || condicoes.includes('nenhuma')) return '';
  const mapa = {
    joelho: '⚠️ Evite impactos nos joelhos. Prefira agachamento convencional.',
    coluna: '⚠️ Mantenha a coluna neutra. Evite hiperextensão.',
    ombro: '⚠️ Reduza amplitude se houver dor no ombro.',
    punho: '⚠️ Faça flexões nos punhos ou use halteres como apoio.',
    cardiaco: '⚠️ Monitore a frequência cardíaca. Faça pausas se necessário.',
    hernia: '⚠️ Evite compressão abdominal. Consulte seu médico.',
  };
  return condicoes.map(c => mapa[c]).filter(Boolean).join('<br>');
}
