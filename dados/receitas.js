const RECEITAS = [
  {
    id: 'frango-grelhado-brocolis',
    nome: 'Frango Grelhado com Brócolis',
    tempo: '20 min',
    dificuldade: 'iniciante',
    ingredientes: ['frango', 'brocolis', 'alho', 'azeite'],
    instrucoes: 'Tempere o frango com alho e sal. Grelhe em frigideira com azeite até dourar. Cozinhe o brócolis no vapor por 5 min e sirva junto.'
  },
  {
    id: 'omelete',
    nome: 'Omelete Low-Carb',
    tempo: '10 min',
    dificuldade: 'iniciante',
    ingredientes: ['ovo', 'queijo-mussarela', 'manteiga', 'espinafre'],
    instrucoes: 'Bata os ovos. Derreta a manteiga na frigideira. Despeje os ovos, adicione o espinafre e o queijo. Dobre ao meio e sirva.'
  },
  {
    id: 'salada-atum',
    nome: 'Salada de Atum',
    tempo: '10 min',
    dificuldade: 'iniciante',
    ingredientes: ['atum', 'alface', 'tomate', 'pepino', 'azeite'],
    instrucoes: 'Misture o atum desfiado com alface, tomate e pepino picados. Tempere com azeite e sal.'
  },
  {
    id: 'carne-moida-couve-flor',
    nome: 'Carne Moída com Couve-flor',
    tempo: '25 min',
    dificuldade: 'iniciante',
    ingredientes: ['carne-moida', 'couve-flor', 'cebola', 'alho', 'azeite', 'queijo-parmesao'],
    instrucoes: 'Refogue a cebola e o alho no azeite. Adicione a carne moída e cozinhe até dourar. Cozinhe a couve-flor no vapor e misture tudo. Finalize com queijo parmesão ralado.'
  },
  {
    id: 'abobrinha-recheada',
    nome: 'Abobrinha Recheada com Frango',
    tempo: '35 min',
    dificuldade: 'intermediario',
    ingredientes: ['abobrinha', 'frango', 'queijo-mussarela', 'cebola', 'alho', 'tomate', 'azeite'],
    instrucoes: 'Corte as abobrinhas ao meio e retire o miolo. Refogue o frango desfiado com cebola, alho e tomate. Recheie as abobrinhas, cubra com mussarela e leve ao forno a 200°C por 20 min.'
  },
  {
    id: 'bacon-ovo',
    nome: 'Ovos com Bacon',
    tempo: '10 min',
    dificuldade: 'iniciante',
    ingredientes: ['ovo', 'bacon', 'manteiga'],
    instrucoes: 'Frite o bacon até dourar. Na mesma frigideira, adicione manteiga e frite os ovos. Sirva os ovos com o bacon.'
  },
  {
    id: 'salmao-grelhado',
    nome: 'Salmão Grelhado com Espinafre',
    tempo: '20 min',
    dificuldade: 'intermediario',
    ingredientes: ['salmao', 'espinafre', 'alho', 'azeite'],
    instrucoes: 'Tempere o salmão com sal, alho e limão. Grelhe 4 min de cada lado. Refogue o espinafre no alho e azeite até murchar.'
  },
  {
    id: 'creme-de-couve-flor',
    nome: 'Creme de Couve-flor com Bacon',
    tempo: '25 min',
    dificuldade: 'iniciante',
    ingredientes: ['couve-flor', 'bacon', 'creme-de-leite', 'alho', 'manteiga', 'queijo-parmesao'],
    instrucoes: 'Cozinhe a couve-flor até macia. Frite o bacon. Bata a couve-flor no processador com creme de leite, manteiga e alho. Misture o bacon picado e finalize com parmesão.'
  },
  {
    id: 'camarao-alho',
    nome: 'Camarão ao Alho e Manteiga',
    tempo: '15 min',
    dificuldade: 'intermediario',
    ingredientes: ['camarao', 'alho', 'manteiga', 'cebola', 'pimentao', 'azeite'],
    instrucoes: 'Refogue o alho e a cebola na manteiga. Adicione o camarão e cozinhe até dourar. Acrescente o pimentão picado. Finalize com azeite.'
  },
  {
    id: 'berinjela-parmesao',
    nome: 'Berinjela Low-Carb à Parmegiana',
    tempo: '30 min',
    dificuldade: 'intermediario',
    ingredientes: ['berinjela', 'queijo-mussarela', 'queijo-parmesao', 'tomate', 'alho', 'azeite'],
    instrucoes: 'Corte a berinjela em rodelas e grelhe com azeite. Refogue o tomate com alho para fazer o molho. Monte em camadas: berinjela, molho, mussarela, parmesão. Leve ao forno a 200°C por 15 min.'
  },
  {
    id: 'pimentao-recheado',
    nome: 'Pimentão Recheado com Carne',
    tempo: '35 min',
    dificuldade: 'intermediario',
    ingredientes: ['pimentao', 'carne-moida', 'cebola', 'alho', 'queijo-mussarela', 'tomate'],
    instrucoes: 'Corte os pimentões ao meio e retire as sementes. Refogue a carne com cebola, alho e tomate. Recheie os pimentões, cubra com mussarela e leve ao forno a 200°C por 20 min.'
  },
  {
    id: 'omelete-mussarela',
    nome: 'Omelete Simples com Mussarela',
    tempo: '8 min',
    dificuldade: 'iniciante',
    ingredientes: ['ovo', 'queijo-mussarela', 'manteiga'],
    instrucoes: 'Bata 2 ovos. Derreta a manteiga na frigideira. Despeje os ovos, espere firmar, adicione o queijo e dobre. Sirva quente.'
  },
  {
    id: 'salada-frango',
    nome: 'Salada de Frango Desfiado',
    tempo: '15 min',
    dificuldade: 'iniciante',
    ingredientes: ['frango', 'alface', 'tomate', 'pepino', 'azeite'],
    instrucoes: 'Desfie o frango cozido. Misture com alface, tomate e pepino picados. Tempere com azeite e sal.'
  },
  {
    id: 'linguiça-couve',
    nome: 'Linguiça com Couve Refogada',
    tempo: '20 min',
    dificuldade: 'iniciante',
    ingredientes: ['linguica', 'couve', 'alho', 'cebola', 'azeite'],
    instrucoes: 'Grelhe a linguiça em fatias. Refogue o alho e a cebola no azeite, adicione a couve picada e refogue até murchar. Sirva junto.'
  },
  {
    id: 'vagem-bacon',
    nome: 'Vagem Salteada com Bacon',
    tempo: '15 min',
    dificuldade: 'iniciante',
    ingredientes: ['vagem', 'bacon', 'alho', 'manteiga'],
    instrucoes: 'Cozinhe a vagem al dente. Frite o bacon picado. Misture a vagem com bacon, alho e manteiga. Salteie por 2 min.'
  },
  {
    id: 'cream-cheese-frango',
    nome: 'Frango ao Cream Cheese',
    tempo: '25 min',
    dificuldade: 'iniciante',
    ingredientes: ['frango', 'cream-cheese', 'espinafre', 'alho', 'manteiga'],
    instrucoes: 'Cozinhe o frango e desfie. Na frigideira, refogue o alho na manteiga, adicione o espinafre até murchar. Misture o frango e o cream cheese. Cozinhe por 5 min mexendo.'
  },
  {
    id: 'pernil-assado',
    nome: 'Pernil Assado Simples',
    tempo: '45 min',
    dificuldade: 'intermediario',
    ingredientes: ['pernil', 'alho', 'cebola', 'azeite', 'pimentao'],
    instrucoes: 'Tempere o pernil com alho, sal e azeite. Disponha em assadeira com cebola e pimentão. Cubra com papel alumínio e asse a 200°C por 30 min. Retire o alumínio e doure por mais 15 min.'
  },
  {
    id: 'ricota-espinafre',
    nome: 'Ricota com Espinafre',
    tempo: '15 min',
    dificuldade: 'iniciante',
    ingredientes: ['ricota', 'espinafre', 'alho', 'azeite', 'queijo-parmesao'],
    instrucoes: 'Refogue o alho no azeite, adicione o espinafre até murchar. Misture a ricota esfarelada e finalize com parmesão.'
  },
  {
    id: 'pizza-couve-flor',
    nome: 'Pizza Low-Carb de Couve-flor',
    tempo: '35 min',
    dificuldade: 'avancado',
    ingredientes: ['couve-flor', 'ovo', 'queijo-mussarela', 'queijo-parmesao', 'tomate'],
    instrucoes: 'Processe a couve-flor crua até virar "farinha". Cozinhe no micro-ondas por 4 min. Misture com ovo e parmesão. Espalhe em forma redonda e asse a 220°C por 15 min. Adicione molho de tomate, mussarela e leve ao forno por mais 10 min.'
  },
  {
    id: 'panqueca-ovo',
    nome: 'Panqueca Low-Carb de Ovo',
    tempo: '10 min',
    dificuldade: 'iniciante',
    ingredientes: ['ovo', 'cream-cheese', 'manteiga'],
    instrucoes: 'Bata 2 ovos com 1 colher de cream cheese até homogêneo. Derreta manteiga na frigideira e despeje a massa. Cozinhe dos dois lados. Sirva com manteiga ou recheio de sua preferência.'
  }
];

function buscarReceitas(idsAlimentos) {
  if (!idsAlimentos.length) return [];
  const set = new Set(idsAlimentos);
  return RECEITAS.map(r => {
    const ingSet = new Set(r.ingredientes);
    const match = r.ingredientes.filter(i => set.has(i)).length;
    const total = r.ingredientes.length;
    const pct = match / total;
    return { ...r, matchCount: match, totalCount: total, matchPct: pct };
  })
  .filter(r => r.matchCount > 0)
  .sort((a, b) => b.matchPct - a.matchPct);
}
