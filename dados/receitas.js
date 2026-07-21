const RECEITAS = [
  {
    "id": "frango-grelhado-brocolis",
    "nome": "Frango Grelhado com Brócolis",
    "tempo": "20 min",
    "dificuldade": "Fácil",
    "categoria": "almoco",
    "ingredientes": [
      "frango-coxa-c-pele",
      "brocolis",
      "alho",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Tempere o frango com alho e sal. Grelhe em frigideira com azeite até dourar. Cozinhe o brócolis no vapor por 5 min e sirva junto."
  },
  {
    "id": "omelete",
    "nome": "Omelete Low-Carb",
    "tempo": "10 min",
    "dificuldade": "Fácil",
    "categoria": "cafe",
    "ingredientes": [
      "ovo-de-galinha-caipira",
      "queijo-muarela",
      "manteiga-grassfed-se-possivel",
      "espinafre"
    ],
    "instrucoes": "Bata os ovos. Derreta a manteiga na frigideira. Despeje os ovos, adicione o espinafre e o queijo. Dobre ao meio e sirva."
  },
  {
    "id": "salada-atum",
    "nome": "Salada de Atum",
    "tempo": "10 min",
    "dificuldade": "Fácil",
    "categoria": "almoco",
    "ingredientes": [
      "atum-em-conserva-oleo",
      "alface",
      "tomate",
      "pepino",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Misture o atum desfiado com alface, tomate e pepino picados. Tempere com azeite e sal."
  },
  {
    "id": "carne-moida-couve-flor",
    "nome": "Carne Moída com Couve-flor",
    "tempo": "25 min",
    "dificuldade": "Fácil",
    "categoria": "almoco",
    "ingredientes": [
      "boi-moida-8020",
      "couveflor",
      "cebola",
      "alho",
      "azeite-de-oliva-extravirgem",
      "queijo-parmesao-ralado"
    ],
    "instrucoes": "Refogue a cebola e o alho no azeite. Adicione a carne moída e cozinhe até dourar. Cozinhe a couve-flor no vapor e misture tudo. Finalize com queijo parmesão ralado."
  },
  {
    "id": "abobrinha-recheada",
    "nome": "Abobrinha Recheada com Frango",
    "tempo": "35 min",
    "dificuldade": "Médio",
    "categoria": "jantar",
    "ingredientes": [
      "abobrinha",
      "frango-coxa-c-pele",
      "queijo-muarela",
      "cebola",
      "alho",
      "tomate",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Corte as abobrinhas ao meio e retire o miolo. Refogue o frango desfiado com cebola, alho e tomate. Recheie as abobrinhas, cubra com muçarela e leve ao forno a 200°C por 20 min."
  },
  {
    "id": "bacon-ovo",
    "nome": "Ovos com Bacon",
    "tempo": "10 min",
    "dificuldade": "Fácil",
    "categoria": "cafe",
    "ingredientes": [
      "ovo-de-galinha-caipira",
      "porco-bacon-sem-acucar",
      "manteiga-grassfed-se-possivel"
    ],
    "instrucoes": "Frite o bacon até dourar. Na mesma frigideira, adicione manteiga e frite os ovos. Sirva os ovos com o bacon."
  },
  {
    "id": "salmao-grelhado",
    "nome": "Salmão Grelhado com Espinafre",
    "tempo": "20 min",
    "dificuldade": "Médio",
    "categoria": "jantar",
    "ingredientes": [
      "salmao-selvagem",
      "espinafre",
      "alho",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Tempere o salmão com sal, alho e limão. Grelhe 4 min de cada lado. Refogue o espinafre no alho e azeite até murchar."
  },
  {
    "id": "creme-de-couve-flor",
    "nome": "Creme de Couve-flor com Bacon",
    "tempo": "25 min",
    "dificuldade": "Fácil",
    "categoria": "jantar",
    "ingredientes": [
      "couveflor",
      "porco-bacon-sem-acucar",
      "queijo-parmesao-ralado",
      "alho",
      "manteiga-grassfed-se-possivel",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Cozinhe a couve-flor até macia. Frite o bacon. Bata a couve-flor no processador com manteiga e alho. Misture o bacon picado e finalize com parmesão."
  },
  {
    "id": "camarao-alho",
    "nome": "Camarão ao Alho e Manteiga",
    "tempo": "15 min",
    "dificuldade": "Médio",
    "categoria": "jantar",
    "ingredientes": [
      "camaro",
      "alho",
      "manteiga-grassfed-se-possivel",
      "cebola",
      "pimentao-vermelho",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Refogue o alho e a cebola na manteiga. Adicione o camarão e cozinhe até dourar. Acrescente o pimentão picado. Finalize com azeite."
  },
  {
    "id": "berinjela-parmesao",
    "nome": "Berinjela Low-Carb à Parmegiana",
    "tempo": "30 min",
    "dificuldade": "Médio",
    "categoria": "almoco",
    "ingredientes": [
      "berinjela",
      "queijo-muarela",
      "queijo-parmesao-ralado",
      "tomate",
      "alho",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Corte a berinjela em rodelas e grelhe com azeite. Refogue o tomate com alho para fazer o molho. Monte em camadas: berinjela, molho, muçarela, parmesão. Leve ao forno a 200°C por 15 min."
  },
  {
    "id": "pimentao-recheado",
    "nome": "Pimentão Recheado com Carne",
    "tempo": "35 min",
    "dificuldade": "Médio",
    "categoria": "almoco",
    "ingredientes": [
      "pimentao-vermelho",
      "boi-moida-8020",
      "cebola",
      "alho",
      "queijo-muarela",
      "tomate"
    ],
    "instrucoes": "Corte os pimentões ao meio e retire as sementes. Refogue a carne com cebola, alho e tomate. Recheie os pimentões, cubra com muçarela e leve ao forno a 200°C por 20 min."
  },
  {
    "id": "omelete-mussarela",
    "nome": "Omelete Simples com Muçarela",
    "tempo": "8 min",
    "dificuldade": "Fácil",
    "categoria": "cafe",
    "ingredientes": [
      "ovo-de-galinha-caipira",
      "queijo-muarela",
      "manteiga-grassfed-se-possivel"
    ],
    "instrucoes": "Bata 2 ovos. Derreta a manteiga na frigideira. Despeje os ovos, espere firmar, adicione o queijo e dobre. Sirva quente."
  },
  {
    "id": "salada-frango",
    "nome": "Salada de Frango Desfiado",
    "tempo": "15 min",
    "dificuldade": "Fácil",
    "categoria": "almoco",
    "ingredientes": [
      "frango-coxa-c-pele",
      "alface",
      "tomate",
      "pepino",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Desfie o frango cozido. Misture com alface, tomate e pepino picados. Tempere com azeite e sal."
  },
  {
    "id": "linguica-couve",
    "nome": "Linguiça com Couve Refogada",
    "tempo": "20 min",
    "dificuldade": "Fácil",
    "categoria": "almoco",
    "ingredientes": [
      "linguica",
      "couve",
      "alho",
      "cebola",
      "azeite-de-oliva-extravirgem"
    ],
    "instrucoes": "Grelhe a linguiça em fatias. Refogue o alho e a cebola no azeite, adicione a couve picada e refogue até murchar. Sirva junto."
  },
  {
    "id": "vagem-bacon",
    "nome": "Vagem Salteada com Bacon",
    "tempo": "15 min",
    "dificuldade": "Fácil",
    "categoria": "almoco",
    "ingredientes": [
      "vagem",
      "porco-bacon-sem-acucar",
      "alho",
      "manteiga-grassfed-se-possivel"
    ],
    "instrucoes": "Cozinhe a vagem al dente. Frite o bacon picado. Misture a vagem com bacon, alho e manteiga. Salteie por 2 min."
  },
  {
    "id": "cream-cheese-frango",
    "nome": "Frango ao Cream Cheese",
    "tempo": "25 min",
    "dificuldade": "Fácil",
    "categoria": "jantar",
    "ingredientes": [
      "frango-coxa-c-pele",
      "cream-cheese",
      "espinafre",
      "alho",
      "manteiga-grassfed-se-possivel"
    ],
    "instrucoes": "Cozinhe o frango e desfie. Na frigideira, refogue o alho na manteiga, adicione o espinafre até murchar. Misture o frango e o cream cheese. Cozinhe por 5 min mexendo."
  },
  {
    "id": "pernil-assado",
    "nome": "Pernil Assado Simples",
    "tempo": "45 min",
    "dificuldade": "Médio",
    "categoria": "jantar",
    "ingredientes": [
      "porco-pernil",
      "alho",
      "cebola",
      "azeite-de-oliva-extravirgem",
      "pimentao-vermelho"
    ],
    "instrucoes": "Tempere o pernil com alho, sal e azeite. Disponha em assadeira com cebola e pimentão. Cubra com papel alumínio e asse a 200°C por 30 min. Retire o alumínio e doure por mais 15 min."
  },
  {
    "id": "ricota-espinafre",
    "nome": "Ricota com Espinafre",
    "tempo": "15 min",
    "dificuldade": "Fácil",
    "categoria": "almoco",
    "ingredientes": [
      "ricota",
      "espinafre",
      "alho",
      "azeite-de-oliva-extravirgem",
      "queijo-parmesao-ralado"
    ],
    "instrucoes": "Refogue o alho no azeite, adicione o espinafre até murchar. Misture a ricota esfarelada e finalize com parmesão."
  },
  {
    "id": "pizza-couve-flor",
    "nome": "Pizza Low-Carb de Couve-flor",
    "tempo": "35 min",
    "dificuldade": "Difícil",
    "categoria": "jantar",
    "ingredientes": [
      "couveflor",
      "ovo-de-galinha-caipira",
      "queijo-muarela",
      "queijo-parmesao-ralado",
      "tomate"
    ],
    "instrucoes": "Processe a couve-flor crua até virar farinha. Cozinhe no micro-ondas por 4 min. Misture com ovo e parmesão. Espalhe em forma redonda e asse a 220°C por 15 min. Adicione molho de tomate, muçarela e leve ao forno por mais 10 min."
  },
  {
    "id": "panqueca-ovo",
    "nome": "Panqueca Low-Carb de Ovo",
    "tempo": "10 min",
    "dificuldade": "Fácil",
    "categoria": "cafe",
    "ingredientes": [
      "ovo-de-galinha-caipira",
      "cream-cheese",
      "manteiga-grassfed-se-possivel"
    ],
    "instrucoes": "Bata 2 ovos com 1 colher de cream cheese até homogêneo. Derreta manteiga na frigideira e despeje a massa. Cozinhe dos dois lados. Sirva com manteiga ou recheio de sua preferência."
  },
  {
    "id": "ovos-mexidos",
    "nome": "Ovos Mexidos Cremosos",
    "tempo": "5 min",
    "dificuldade": "Fácil",
    "categoria": "cafe",
    "ingredientes": [
      "ovo-de-galinha-caipira",
      "manteiga-grassfed-se-possivel",
      "sal-marinho",
      "pimentadoreino-moida-na-hora"
    ],
    "instrucoes": "Quebre os ovos em uma tigela e bata ligeiramente. Derreta a manteiga em frigideira em fogo baixo. Despeje os ovos e mexa constantemente com espátula de silicone. Quando começar a formar coalhadas cremosas (cerca de 2min), desligue. Tempere com sal e pimenta."
  },
  {
    "id": "cafe-bulletproof",
    "nome": "Café Bulletproof",
    "tempo": "3 min",
    "dificuldade": "Fácil",
    "categoria": "cafe",
    "ingredientes": [
      "cafe-preto-coado",
      "manteiga-grassfed-se-possivel",
      "oleo-de-coco-extravirgem"
    ],
    "instrucoes": "Prepare o café coado normalmente. Coloque no liquidificador: café quente + manteiga + óleo de coco. Bata por 30 segundos até formar uma espuma cremosa. Sirva imediatamente."
  },
  {
    "id": "bife-cavalo",
    "nome": "Bife à Cavalo",
    "tempo": "10 min",
    "dificuldade": "Fácil",
    "categoria": "cafe",
    "ingredientes": [
      "boi-contrafil",
      "ovo-de-galinha-caipira",
      "manteiga-grassfed-se-possivel",
      "sal-marinho",
      "pimentadoreino-moida-na-hora"
    ],
    "instrucoes": "Tempere o bife com sal grosso dos dois lados. Em frigideira bem quente, derreta metade da manteiga e sele o bife: 3-4min de cada lado. Reserve. Na mesma frigideira, derreta o restante da manteiga e frite os ovos (gema mole). Sirva os ovos sobre o bife."
  },
  {
    "id": "estrogonofe-frango",
    "nome": "Estrogonofe de Frango Keto",
    "tempo": "30 min",
    "dificuldade": "Médio",
    "categoria": "almoco",
    "ingredientes": [
      "frango-peito-c-pele",
      "cebola",
      "alho",
      "cogumelos",
      "creme-de-leite-lata",
      "mostarda-amarela",
      "manteiga-grassfed-se-possivel",
      "sal-marinho",
      "salsinha"
    ],
    "instrucoes": "Tempere o frango com sal e pimenta. Em panela, derreta a manteiga em fogo alto e sele o frango até dourar. Reserve. Na mesma panela, refogue a cebola e o alho até murchar. Adicione os cogumelos e refogue por mais 3min. Volte o frango, adicione a mostarda e o creme de leite. Misture bem. Cozinhe em fogo baixo por 5min. Acerte o sal. Finalize com salsinha."
  },
  {
    "id": "moqueca-peixe",
    "nome": "Moqueca de Peixe Keto",
    "tempo": "35 min",
    "dificuldade": "Médio",
    "categoria": "almoco",
    "ingredientes": [
      "cacao",
      "limao-sucoraspas",
      "cebola",
      "pimentao-vermelho",
      "alho",
      "coco-leite",
      "azeite-de-oliva-extravirgem",
      "coentro",
      "sal-marinho"
    ],
    "instrucoes": "Tempere o peixe com limão, sal e pimenta. Deixe descansar 10min. Em uma panela, aqueça o azeite. Refogue a cebola, o pimentão e o alho por 3min. Coloque as postas de peixe sobre os temperos. Despeje o leite de coco por cima. Tampe e cozinhe em fogo baixo por 15min. Abra, ajuste o sal, finalize com coentro fresco."
  },
  {
    "id": "escondidinho-frango",
    "nome": "Escondidinho de Frango",
    "tempo": "40 min",
    "dificuldade": "Médio",
    "categoria": "almoco",
    "ingredientes": [
      "frango-coxa-c-pele",
      "couveflor",
      "creme-de-leite-lata",
      "queijo-muarela",
      "cebola",
      "manteiga-grassfed-se-possivel",
      "sal-marinho",
      "salsinha"
    ],
    "instrucoes": "Cozinhe a couve-flor no vapor até ficar macia (8min). Escorra bem. Bata a couve-flor no processador ou amasse com garfo. Misture o creme de leite, metade da manteiga, sal. Reserve. Refogue a cebola na manteiga restante. Adicione o frango desfiado, sal, pimenta, salsinha. Em um refratário, monte: frango no fundo, purê de couve-flor por cima, muçarela ralada no topo. Leve ao forno a 200°C por 15min até gratinar."
  },
  {
    "id": "salmao-aspargos",
    "nome": "Salmão Grelhado com Aspargos",
    "tempo": "15 min",
    "dificuldade": "Fácil",
    "categoria": "jantar",
    "ingredientes": [
      "salmao-selvagem",
      "aspargos",
      "manteiga-grassfed-se-possivel",
      "limao-sucoraspas",
      "sal-marinho",
      "pimentadoreino-moida-na-hora"
    ],
    "instrucoes": "Tempere o salmão com sal, pimenta e suco de limão. Derreta metade da manteiga em frigideira, fogo médio-alto. Grelhe o salmão com a pele para baixo por 4min. Vire e grelhe por mais 3min. Enquanto isso, em outra frigideira, derreta a manteiga restante e salteie os aspargos por 4min. Sirva o salmão com os aspargos ao lado."
  },
  {
    "id": "frango-curry",
    "nome": "Frango ao Curry com Creme",
    "tempo": "25 min",
    "dificuldade": "Médio",
    "categoria": "jantar",
    "ingredientes": [
      "frango-coxa-c-pele",
      "cebola",
      "alho",
      "creme-de-leite-lata",
      "curry-em-po",
      "manteiga-grassfed-se-possivel",
      "sal-marinho",
      "pimentadoreino-moida-na-hora"
    ],
    "instrucoes": "Tempere o frango com sal, pimenta e metade do curry. Derreta a manteiga em panela, fogo alto. Sele o frango até dourar (5min). Reserve. Na mesma panela, refogue cebola e alho (3min). Adicione o curry restante. Volte o frango, adicione o creme de leite. Misture bem. Cozinhe em fogo baixo por 8min. Ajuste o sal. Sirva."
  },
  {
    "id": "pao-queijo-keto",
    "nome": "Pão de Queijo Keto",
    "tempo": "25 min",
    "dificuldade": "Médio",
    "categoria": "lanche",
    "ingredientes": [
      "farinha-de-amendoas",
      "queijo-parmesao-ralado",
      "ovo-de-galinha-caipira",
      "ghee-manteiga-clarificada",
      "sal-marinho",
      "oregano"
    ],
    "instrucoes": "Pré-aqueça o forno a 180°C. Misture todos os ingredientes secos (farinha, queijo, sal, orégano). Adicione os ovos e a manteiga. Misture com as mãos até massa homogênea. Modele bolinhas pequenas e coloque em assadeira untada. Asse por 15-18min até dourar levemente. Espere esfriar 5min antes de servir."
  },
  {
    "id": "mix-castanhas",
    "nome": "Mix de Castanhas",
    "tempo": "1 min",
    "dificuldade": "Fácil",
    "categoria": "lanche",
    "ingredientes": [
      "macadamia",
      "amendoas",
      "nozes"
    ],
    "instrucoes": "Coloque 20g de macadâmia, 20g de amêndoas e 10g de nozes em um pote. Leve na bolsa. Dose controlada: 50g/dia é o limite."
  }
];

function buscarReceitas(idsAlimentos) {
  if (!idsAlimentos.length) return [];
  const set = new Set(idsAlimentos);
  return RECEITAS.map(r => {
    const match = r.ingredientes.filter(i => set.has(i)).length;
    const total = r.ingredientes.length;
    const pct = match / total;
    return { ...r, matchCount: match, totalCount: total, matchPct: pct };
  })
  .filter(r => r.matchCount > 0)
  .sort((a, b) => b.matchPct - a.matchPct);
}
