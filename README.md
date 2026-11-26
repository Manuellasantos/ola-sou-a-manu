# Olá, sou a Manu ✿

Meu portfólio interativo. Aqui é onde dados, curiosidade, gatos e um pouco de moonwalk se encontram.

Sou a **Manuella Santos Cruz**, estudante de Ciência de Dados para Negócios na Fatec Sebrae e técnica em Informática para Internet pela Etec Albert Einstein. Meu foco é **Ciência de Dados, Análise de Dados, Engenharia de Dados e IA**.

![Prévia do portfólio](public/og.png)

## Objetivo

Eu não queria só um currículo online. Queria que o próprio site mostrasse como eu trabalho com dados:

- os projetos estão em um catálogo com filtros, e cada um tem uma página de detalhes;
- tem um **mini projeto de análise de dados dentro do portfólio**: scripts em Python coletam a API do GitHub, tratam os dados com Pandas e geram os gráficos da seção "Meu GitHub";
- as animações também usam dados de verdade: a rosa do início, a rede de habilidades e a borboleta que vira k-means são calculadas em Python (NumPy) e só desenhadas no navegador.

Cuidados que tomei: nada de barra de "Python 90%", nenhum resultado inventado, dados simulados sempre identificados e contribuição individual só quando está documentada no repositório do projeto.

## Como funciona

```
Python (scripts/)                         JavaScript (src/)
─────────────────                         ─────────────────
API do GitHub ──► coletar_github.py
                     │ data/raw/github_bruto.json
                     ▼
               processar_github.py ──► public/data/github.json ──► seção "Meu GitHub"
gerar_rosa.py ──────────────────────► public/data/rosa.json   ──► rosa do início (canvas)
gerar_rede_habilidades.py ──────────► public/data/rede.json   ──► rede de habilidades (SVG)
gerar_clusters.py ──────────────────► public/data/clusters.json ► borboleta → k-means (SVG)
gerar_graficos.py ──► docs/img/*.png + docs/relatorio-github.html (Matplotlib e Plotly)
```

O GitHub Pages só serve arquivos estáticos, então o Python roda **antes** (na minha máquina ou no GitHub Actions) e exporta JSON. O React só lê esses arquivos. O token do GitHub fica só no ambiente do script e nunca vai para o site.

Os projetos ficam em um único arquivo, [`src/data/projects.json`](src/data/projects.json). Para adicionar um projeto novo basta incluir um objeto ali, sem mexer nos componentes.

## Estrutura de pastas

```
ola-sou-a-manu/
├── .github/workflows/
│   ├── deploy.yml            # publica no GitHub Pages (só manual)
│   ├── dados-github.yml      # atualiza os dados do GitHub toda segunda
│   └── testes.yml            # testes JS + Python a cada push
├── docs/
│   ├── prompts.md            # exemplos de prompts que usei com o Claude
│   ├── relatorio-github.html # relatório interativo em Plotly
│   └── img/                  # gráficos em Matplotlib
├── public/
│   ├── data/                 # JSONs gerados pelos scripts Python
│   ├── img/projetos/         # capturas reais tiradas dos repositórios
│   └── audio/                # reservada para trilhas licenciadas
├── scripts/                  # Python: coleta, tratamento e geração dos dados
│   ├── coletar_github.py
│   ├── processar_github.py
│   ├── gerar_rosa.py
│   ├── gerar_clusters.py
│   ├── gerar_rede_habilidades.py
│   ├── gerar_graficos.py
│   ├── gerar_og.py
│   ├── gerar_tudo.py
│   └── utils.py
├── src/
│   ├── animations/           # rosa, moonwalk, gato, suricato, borboleta, balão
│   ├── components/           # cabeçalho, cards, pipeline, menu de acessibilidade
│   │   └── secoes/           # uma seção da home por arquivo
│   ├── config/               # seções, caminhos e trilhas de áudio
│   ├── data/                 # projects.json e profile.json
│   ├── hooks/                # preferências, visibilidade, carregamento de dados
│   ├── pages/                # Início, Projeto, 404
│   ├── services/             # filtros, áudio, armazenamento local
│   └── styles/               # tokens, base, layout, seções, animações
├── tests/
│   ├── js/                   # Vitest (filtros e catálogo)
│   └── python/               # pytest (scripts de dados)
├── requirements.txt
└── package.json
```

## Tecnologias

- **Frontend:** React 18, Vite, React Router (HashRouter), CSS puro com variáveis, SVG e Canvas.
- **Dados:** Python, Pandas, NumPy, Matplotlib, Plotly, Requests e a API do GitHub (REST e GraphQL).
- **Qualidade e deploy:** Vitest, pytest, GitHub Actions e GitHub Pages.

Escolhi não usar bibliotecas de animação (GSAP, Three.js etc.): tudo que mexe foi feito com CSS, SVG e Canvas, para o site ficar leve e para eu entender cada linha.

## Rodando localmente

```bash
npm install
npm run dev
```

O site abre em `http://localhost:5173/ola-sou-a-manu/`.

### Scripts Python

```bash
python -m venv .venv
source .venv/bin/activate        # no Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # opcional: coloque um GITHUB_TOKEN para coletar o calendário
python scripts/gerar_tudo.py     # coleta + processa + gera tudo
python scripts/gerar_tudo.py --offline   # sem internet, usando os dados já coletados
```

Os scripts podem ser rodados um por um também, cada arquivo explica o que faz no topo.

### Testes

```bash
npm test
pytest tests/python
```

## Animações

| Animação | Onde | Como funciona |
|---|---|---|
| Rosa de partículas | Início | 3.000 pontos de uma superfície paramétrica calculada em NumPy; o canvas gira, projeta em perspectiva e o cursor empurra as pétalas |
| Moonwalk | Projetos | Dançarino original em SVG. As pernas usam cinemática inversa (lei dos cossenos): um pé fica na ponta parado e o outro desliza chapado para trás. Ele puxa o painel "Em cartaz" |
| Gato | Grade de projetos | Segue o cursor pela borda dos cards, senta e cochila quando fica parado |
| Suricato | Sobre | Espia por trás do card de formação e acompanha o cursor com os olhos |
| Aranha e teia | Habilidades | A rede é "tecida" quando aparece e a aranha desce até a tecnologia escolhida |
| Borboleta → k-means | Pesquisa | Pontos desenham a curva da borboleta e depois viram dados simulados agrupados passo a passo |
| Passagem secreta | Projetos | Digite "corvinal": os cards trocam de lugar (técnica FLIP) |
| Balão vermelho | Contato | Easter egg |

Nenhuma animação bloqueia o conteúdo: tudo está no HTML desde o início e as animações só começam quando a seção aparece na tela.

## Acessibilidade

Menu de acessibilidade (ícone no topo) com:

- **VLibras**, carregado só quando ativado;
- paletas para **protanopia, deuteranopia** (eixo azul–laranja) e **tritanopia** (eixo vermelho–ciano), que trocam as cores dos gráficos de verdade. Os gráficos também usam formas, padrões e rótulos;
- **alto contraste**, **tamanho do texto** e animações **completas, reduzidas ou desligadas** (segue o `prefers-reduced-motion` do sistema por padrão);
- **som** desligado por padrão, com volume ajustável;
- botão para restaurar o padrão. Tudo fica salvo no navegador.

Também tem link para pular ao conteúdo, navegação por teclado com foco visível, HTML semântico, textos alternativos e versão em tabela dos gráficos do GitHub.

## Som

O áudio começa desligado e só toca depois que a pessoa ativa. Os efeitos são **originais**, sintetizados com a Web Audio API, curtos e com fade.

Eu adoraria um trechinho de Billie Jean no moonwalk, mas não incluí nenhuma música sem licença. A estrutura já está pronta em [`src/config/audio.js`](src/config/audio.js): se um dia eu tiver um arquivo autorizado, é só colocar em `public/audio/` e preencher o `src`.

## Adicionando um projeto

1. Inclua um objeto em `src/data/projects.json` seguindo o formato dos outros.
2. Coloque as capturas em `public/img/projetos/` (sem captura, o card mostra uma capa conceitual identificada).
3. Rode `python scripts/gerar_rede_habilidades.py` para a rede de habilidades incluir as tecnologias novas.

## Deploy

O workflow [`deploy.yml`](.github/workflows/deploy.yml) é **manual** para nada ser publicado sem eu decidir:

1. Em **Settings → Pages**, escolha **GitHub Actions** como fonte.
2. Em **Actions → Deploy no GitHub Pages**, clique em **Run workflow**.

O `vite.config.js` já usa `/ola-sou-a-manu/` como base, e o HashRouter faz as rotas funcionarem no Pages sem configuração extra.

## Como usei IA (Claude) neste projeto

Usei o **Claude Code**, da Anthropic, como par de programação durante o desenvolvimento. Escrevi um documento grande com o conceito, a identidade visual, os projetos e as regras (por exemplo, não inventar métricas e respeitar a autoria dos projetos em equipe), e fui pedindo as partes aos poucos.

O Claude me ajudou a:

- estruturar a arquitetura (Python gerando JSON, React só desenhando);
- escrever os scripts de coleta e tratamento dos dados do GitHub;
- implementar a matemática das animações (superfície da rosa, cinemática inversa do moonwalk, Fruchterman-Reingold, k-means);
- revisar acessibilidade, testes e documentação.

As decisões de conteúdo, as informações sobre mim e os projetos e a validação final ficaram comigo. Conferi as informações de cada projeto nos repositórios originais.

Um exemplo de prompt que usei:

> Quero que a seção do GitHub seja tipo um mini projeto de análise de dados dentro do portfólio, sabe? Python pegando os dados da API, Pandas tratando, e o site só lendo o JSON. Só que nada de barra de "Python 90%" porque isso não mede nada kkk. Mostra a fonte, o período e as limitações embaixo dos gráficos.

Tem mais exemplos em [docs/prompts.md](docs/prompts.md).

## Contato

- E-mail: [cruzmanu435@gmail.com](mailto:cruzmanu435@gmail.com)
- LinkedIn: [manu-cruz-8439332b6](https://www.linkedin.com/in/manu-cruz-8439332b6/)
- GitHub: [Manuellasantos](https://github.com/Manuellasantos)

---

Todos nós flutuamos por aqui.
