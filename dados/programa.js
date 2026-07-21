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
