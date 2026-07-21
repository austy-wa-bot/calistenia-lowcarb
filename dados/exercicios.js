const EXERCICIOS = [
  {
    id: 'flexao',
    nome: 'Flexão',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'peito',
    video: 'https://www.youtube.com/embed/MO10KOoQx5E',
    descricao: 'Mãos na largura dos ombros, corpo reto, desça até o peito quase tocar o chão.'
  },
  {
    id: 'flexao-diamante',
    nome: 'Flexão Diamante',
    nivel: 'intermediario',
    equipamento: 'nenhum',
    musculo: 'peito',
    video: 'https://www.youtube.com/embed/t2cR426fFx0',
    descricao: 'Mãos juntas formando um losango sob o peito. Ênfase em tríceps e peitoral interno.'
  },
  {
    id: 'agachamento',
    nome: 'Agachamento',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'pernas',
    video: 'https://www.youtube.com/embed/YaXPRqUwItQ',
    descricao: 'Pés na largura dos ombros, desça como se fosse sentar, mantenha costas retas.'
  },
  {
    id: 'agachamento-bulgaro',
    nome: 'Agachamento Búlgaro',
    nivel: 'intermediario',
    equipamento: 'cadeira',
    musculo: 'pernas',
    video: 'https://www.youtube.com/embed/bwhl_9jN_3o',
    descricao: 'Um pé apoiado atrás em uma cadeira. Desça com a perna da frente.'
  },
  {
    id: 'afundo',
    nome: 'Afundo',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'pernas',
    video: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    descricao: 'Passo largo à frente, desça até o joelho de trás quase tocar o chão.'
  },
  {
    id: 'ponte',
    nome: 'Ponte (Glúteo)',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'gluteos',
    video: 'https://www.youtube.com/embed/wPM8icPu6H8',
    descricao: 'Deitado, joelhos dobrados, eleve o quadril contraindo glúteos.'
  },
  {
    id: 'prancha',
    nome: 'Prancha',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'core',
    video: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    descricao: 'Antebraços no chão, corpo reto, contraia o abdômen.'
  },
  {
    id: 'mergulho-triceps',
    nome: 'Mergulho de Tríceps',
    nivel: 'intermediario',
    equipamento: 'cadeira',
    musculo: 'braços',
    video: 'https://www.youtube.com/embed/KwnAzS-oN6c',
    descricao: 'Mãos apoiadas na borda da cadeira, desça o quadril e volte.'
  },
  {
    id: 'panturrilha',
    nome: 'Elevação de Panturrilha',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'pernas',
    video: 'https://www.youtube.com/embed/k8ipHzKeAkQ',
    descricao: 'Em pé, eleve os calcanhares ficando na ponta dos pés.'
  },
  {
    id: 'cadeira-barras',
    nome: 'Remada na Cadeira',
    nivel: 'intermediario',
    equipamento: 'cadeira',
    musculo: 'costas',
    video: 'https://www.youtube.com/embed/OYUxXMGVuuU',
    descricao: 'Deite-se sob uma cadeira, segure as bordas e puxe o peito em direção à borda.'
  },
  {
    id: 'flexao-aplaudida',
    nome: 'Flexão Explosiva',
    nivel: 'avancado',
    equipamento: 'nenhum',
    musculo: 'peito',
    video: 'https://www.youtube.com/embed/6HxtxoXRFG0',
    descricao: 'Flexão com impulso para soltar as mãos do chão e bater palmas.'
  },
  {
    id: 'pistol',
    nome: 'Agachamento Pistol',
    nivel: 'avancado',
    equipamento: 'cadeira',
    musculo: 'pernas',
    video: 'https://www.youtube.com/embed/vq5-vdgJc0I',
    descricao: 'Agachamento em uma perna só. Use uma cadeira como apoio se necessário.'
  },
  {
    id: 'flexao-pike',
    nome: 'Flexão Pike (Ombro)',
    nivel: 'intermediario',
    equipamento: 'nenhum',
    musculo: 'ombros',
    video: 'https://www.youtube.com/embed/x7_I5SUAd00',
    descricao: 'Quadril elevado formando um V, desça a cabeça em direção ao chão.'
  },
  {
    id: 'abdominal',
    nome: 'Abdominal Tradicional',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'core',
    video: 'https://www.youtube.com/embed/Xyd_fa5zoEU',
    descricao: 'Joelhos dobrados, mãos na nuca, eleve o tronco contraindo o abdômen.'
  },
  {
    id: 'bicicleta',
    nome: 'Abdominal Bicicleta',
    nivel: 'intermediario',
    equipamento: 'nenhum',
    musculo: 'core',
    video: 'https://www.youtube.com/embed/wpRI3xBhJmo',
    descricao: 'Deitado, alterne levando cotovelo ao joelho oposto em movimento de pedalada.'
  },
  {
    id: 'flexao-negativa',
    nome: 'Flexão Negativa',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'peito',
    video: 'https://www.youtube.com/embed/GX87fbBd78A',
    descricao: 'Desça controladamente por 3-4 segundos. Ótima para iniciantes ganharem força.'
  },
  {
    id: 'cadeira-elevacao',
    nome: 'Step-up na Cadeira',
    nivel: 'iniciante',
    equipamento: 'cadeira',
    musculo: 'pernas',
    video: 'https://www.youtube.com/embed/vLgNjXucUs0',
    descricao: 'Suba e desça de uma cadeira alternando as pernas.'
  },
  {
    id: 'superman',
    nome: 'Superman',
    nivel: 'iniciante',
    equipamento: 'nenhum',
    musculo: 'costas',
    video: 'https://www.youtube.com/embed/zbCHSAYz11A',
    descricao: 'Deitado de barriga, eleve braços e pernas simultaneamente.'
  }
];

const NIVEL_ORDEM = { iniciante: 0, intermediario: 1, avancado: 2 };

function filtrarExercicios({ nivel, equipamento, musculo }) {
  return EXERCICIOS.filter(ex => {
    if (nivel && ex.nivel !== nivel) return false;
    if (equipamento === 'nenhum' && ex.equipamento !== 'nenhum') return false;
    if (musculo && ex.musculo !== musculo) return false;
    return true;
  }).sort((a, b) => NIVEL_ORDEM[a.nivel] - NIVEL_ORDEM[b.nivel]);
}

function listarMusculos() {
  return [...new Set(EXERCICIOS.map(e => e.musculo))];
}
