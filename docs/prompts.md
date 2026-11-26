# Engenharia de Prompts 

Durante o desenvolvimento deste portfólio, utilizei o Claude Code como agente de inteligência artificial para auxiliar na implementação, organização, revisão e aprimoramento do projeto.

A interação foi conduzida por meio de prompts estruturados, considerando contexto, objetivos, requisitos técnicos, restrições e resultados esperados.

O desenvolvimento foi realizado de maneira incremental, partindo de um prompt principal, responsável por estabelecer as diretrizes gerais do projeto, seguido de prompts específicos para implementação e refinamento das funcionalidades.

Os prompts apresentados a seguir foram resumidos e reorganizados para fins de documentação, preservando a intenção dos pedidos originais.

---

## 1. Prompt principal — Contextualização e definição do projeto

**Técnicas utilizadas:** Role Prompting, Contextual Prompting e Instruction-Based Prompting.

**Objetivo:** estabelecer a identidade, os requisitos e a direção técnica do portfólio.

> Atue como especialista em Creative Development, UI/UX Design, desenvolvimento web e Ciência de Dados.
>
> Desenvolva um portfólio profissional utilizando minhas informações pessoais, trajetória acadêmica, projetos, perfis profissionais e referências visuais.
>
> O portfólio deve equilibrar três pilares:
>
> - Personalidade e criatividade;
> - Ciência de Dados e competências técnicas;
> - Modernidade, interatividade e acessibilidade.
>
> Utilize Python para processamento e análise de dados e JavaScript para renderização e interações no navegador.
>
> Organize os projetos por categorias e tecnologias, disponibilizando seus respectivos repositórios, demonstrações e protótipos.
>
> Desenvolva uma arquitetura modular, responsiva, acessível e compatível com GitHub Pages.
>
> Não invente informações, métricas, experiências ou resultados. Diferencie projetos concluídos, em desenvolvimento e interesses futuros.
>
> O resultado deve ser um portfólio autoral que demonstre minhas competências técnicas e minha personalidade, evitando a aparência de um currículo online convencional.

O prompt principal também incluiu minha apresentação pessoal, referências estéticas, os 11 projetos desenvolvidos, seus respectivos links, requisitos de acessibilidade e uma ordem sugerida de implementação.

---

## 2. Organização do ambiente e do repositório

**Técnicas utilizadas:** Constraint-Based Prompting e Task Specification.

**Objetivo:** estabelecer limites claros para a organização local e o versionamento do projeto.

> Organize o projeto dentro da pasta local `emprego`, criando um diretório chamado `Olá, sou a Manu`.
>
> Requisitos:
>
> - Mantenha todos os arquivos do portfólio dentro desse diretório.
> - Inicialize o versionamento Git exclusivamente na pasta do projeto.
> - Utilize o mesmo nome como referência para o repositório no GitHub, respeitando as regras de nomenclatura da plataforma.
> - Não versione nem publique a pasta `emprego`, pois ela é utilizada apenas para organização local.
> - Preserve os demais arquivos e projetos existentes no ambiente.
>
> Configure a estrutura de diretórios e o `.gitignore` antes de iniciar o desenvolvimento.

---

## 3. Priorização das áreas profissionais

**Técnicas utilizadas:** Contextual Prompting e Requirement Prioritization.

**Objetivo:** alinhar a apresentação dos projetos às minhas áreas de interesse profissional.

> Considere que meu foco profissional está nas áreas de Ciência de Dados, Análise de Dados, Engenharia de Dados e Inteligência Artificial.
>
> Reorganize a hierarquia visual do portfólio para que os projetos dessas áreas recebam maior destaque.
>
> Priorize projetos que envolvam processamento de dados, pipelines ETL, análise estatística, visualizações, engenharia de dados e inteligência artificial.
>
> Preserve os projetos de desenvolvimento web, infraestrutura, banco de dados e UI/UX, mantendo-os disponíveis no catálogo e nos filtros.
>
> A apresentação deve evidenciar meu perfil profissional multidisciplinar, sem transmitir a impressão de que minha atuação está limitada ao desenvolvimento frontend.

---

## 4. Análise de dados do GitHub

**Técnicas utilizadas:** Task Decomposition, Contextual Prompting e definição de restrições.

**Objetivo:** transformar os dados do GitHub em um projeto de análise integrado ao portfólio.

> Desenvolva uma seção de análise de dados utilizando informações públicas do meu GitHub.
>
> Organize o processo nas seguintes etapas:
>
> 1. Extração dos dados por meio da API do GitHub utilizando Python.
> 2. Limpeza, organização e transformação dos dados com Pandas.
> 3. Cálculo de indicadores relevantes.
> 4. Exportação dos resultados em JSON.
> 5. Consumo e visualização dos dados pelo frontend.
>
> Explore indicadores como distribuição de linguagens, quantidade de repositórios, evolução temporal dos projetos e frequência de atividade, respeitando as limitações da API.
>
> Restrições:
>
> - Utilize exclusivamente dados reais nas análises apresentadas como resultados.
> - Não utilize porcentagens arbitrárias de proficiência.
> - Não interprete quantidade de código ou commits como medida de domínio técnico.
> - Informe a fonte, o período analisado e as limitações dos dados.
> - Não exponha credenciais ou tokens no frontend.
>
> Mantenha os scripts Python legíveis, documentados e independentes da camada de apresentação.

---

## 5. Animação do moonwalk

**Técnicas utilizadas:** Requirement Specification, Negative Prompting e Explainability.

**Objetivo:** implementar uma animação personalizada inspirada em Michael Jackson.

> Desenvolva uma animação de um personagem estilizado realizando o moonwalk enquanto puxa ou revela o painel de projetos.
>
> O movimento deve reproduzir as principais características da dança:
>
> - Deslocamento corporal para trás;
> - Alternância entre os pés;
> - Deslizamento de um pé enquanto o outro permanece apoiado na ponta;
> - Sincronização entre pernas, pés e deslocamento do personagem.
>
> Não utilize apenas uma imagem estática sendo movimentada horizontalmente.
>
> Integre a animação ao painel de projetos, garantindo que o movimento tenha uma função dentro da interface.
>
> A animação não deve bloquear a navegação e precisa respeitar as configurações de redução de movimento.
>
> Após a implementação, explique brevemente como foram construídos os movimentos das pernas, dos pés e as transições, indicando os parâmetros que podem ser modificados posteriormente.

---

## 6. Geração matemática de uma rosa

**Técnicas utilizadas:** Task Decomposition e Technical Constraint Prompting.

**Objetivo:** integrar programação matemática, identidade visual e visualização de dados.

> Desenvolva uma representação generativa de uma rosa formada por partículas e coordenadas matemáticas.
>
> Utilize Python e NumPy para calcular os pontos que constituem a estrutura da flor.
>
> Divida a implementação em duas responsabilidades:
>
> - Python: cálculos matemáticos, geração de coordenadas e exportação dos dados.
> - JavaScript: leitura dos dados, renderização e animação no navegador.
>
> A rosa deve integrar a identidade visual do portfólio, utilizando tons de rosa sem tornar toda a interface monocromática.
>
> Evite utilizar Python apenas como elemento decorativo ou simbólico. Os dados gerados pelo script devem ser efetivamente utilizados na visualização.
>
> Documente a função matemática, os parâmetros utilizados e o processo de geração dos pontos para facilitar futuras alterações.

---

## 7. Representação dos projetos em equipe

**Técnicas utilizadas:** Grounding e Fact-Based Prompting.

**Objetivo:** garantir precisão na apresentação das minhas contribuições e respeitar a autoria coletiva.

> Analise os repositórios, READMEs e informações fornecidas sobre os projetos desenvolvidos em equipe.
>
> Considere que alguns projetos estão hospedados nos perfis de outros integrantes.
>
> Quando minha contribuição individual estiver documentada, apresente-a de maneira objetiva.
>
> Quando não houver informações suficientes, identifique o projeto como desenvolvido em equipe, sem atribuir responsabilidades específicas.
>
> Restrições:
>
> - Não atribua exclusivamente a mim funcionalidades desenvolvidas coletivamente.
> - Não invente cargos, responsabilidades ou contribuições.
> - Preserve os links dos repositórios originais.
> - Diferencie projetos individuais e coletivos.
>
> Utilize apenas informações disponíveis nas fontes fornecidas.

---

## 8. Seleção de imagens dos projetos

**Técnicas utilizadas:** Source Grounding e Negative Prompting.

**Objetivo:** garantir autenticidade na representação visual dos projetos.

> Utilize prioritariamente imagens reais dos projetos, obtidas por meio dos repositórios, READMEs, demonstrações e materiais disponibilizados.
>
> Quando não existirem capturas de tela disponíveis, utilize uma capa visual conceitual claramente identificada como ilustrativa.
>
> Não gere imagens que simulem dashboards, funcionalidades, resultados ou interfaces inexistentes.
>
> Preserve a distinção entre:
>
> - Capturas reais;
> - Protótipos;
> - Mockups;
> - Capas conceituais.
>
> Otimize as imagens para utilização no navegador e inclua descrições alternativas acessíveis.

---

## 9. Implementação dos recursos de acessibilidade

**Técnicas utilizadas:** Requirement-Based Prompting e Acceptance Criteria.

**Objetivo:** desenvolver funcionalidades de acessibilidade que possam ser efetivamente utilizadas.

> Implemente um menu de acessibilidade integrado ao portfólio, utilizando as diretrizes WCAG 2.2 AA como referência.
>
> Funcionalidades obrigatórias:
>
> - Integração com VLibras;
> - Paletas acessíveis para protanopia, deuteranopia e tritanopia;
> - Modo de alto contraste;
> - Ajuste do tamanho das fontes;
> - Redução ou desativação das animações;
> - Restauração das configurações padrão.
>
> As paletas para daltonismo devem melhorar a distinção entre as cores dos componentes e gráficos, e não apenas simular alterações na percepção visual.
>
> Utilize também rótulos, padrões, símbolos e formas para evitar dependência exclusiva de cores.
>
> Garanta navegação por teclado, indicadores de foco visíveis, compatibilidade com leitores de tela e descrições acessíveis dos gráficos.
>
> Critérios de aceitação:
>
> - Todos os controles devem possuir funcionalidades reais.
> - As alterações devem ser aplicadas corretamente aos componentes.
> - As preferências devem ser preservadas localmente.
> - A navegação deve continuar funcional em dispositivos móveis.
> - As animações devem respeitar a preferência `prefers-reduced-motion`.
>
> Valide os recursos após a implementação.

---

## 10. Implementação do Sound Design

**Técnicas utilizadas:** Conditional Prompting e Constraint-Based Prompting.

**Objetivo:** adicionar uma experiência sonora opcional sem comprometer a acessibilidade e os direitos autorais.

> Desenvolva uma estrutura modular de áudio para associar efeitos sonoros a momentos específicos da navegação.
>
> A principal referência musical é Billie Jean, de Michael Jackson, durante a animação do moonwalk.
>
> Caso exista um arquivo devidamente autorizado, permita sua integração à animação. Caso contrário, utilize efeitos sonoros originais ou licenciados e mantenha a estrutura preparada para receber posteriormente um arquivo autorizado.
>
> Requisitos:
>
> - Áudio desativado por padrão;
> - Ativação mediante interação do visitante;
> - Controle de volume;
> - Reprodução breve;
> - Transições com fade-in e fade-out;
> - Opção de silenciamento;
> - Persistência das preferências;
> - Respeito às restrições de autoplay dos navegadores.
>
> Não utilize músicas protegidas sem autorização.
>
> O áudio deve complementar as interações, sem ser obrigatório para compreender ou utilizar o site.

---

## 11. Easter eggs e referências pessoais

**Técnicas utilizadas:** Creative Prompting e Contextual Prompting.

**Objetivo:** incorporar referências culturais e pessoais à experiência de navegação.

> Implemente pequenas interações que representem meus interesses pessoais, preservando o caráter profissional do portfólio.
>
> Desenvolva um balão vermelho escondido na interface, inspirado em It: A Coisa, de Stephen King.
>
> Ao interagir com o balão, apresente a frase:
>
> “Todos nós flutuamos por aqui.”
>
> Explore também uma referência discreta à Corvinal, de Harry Potter, por meio de componentes que se reorganizam de maneira semelhante às escadas móveis de Hogwarts.
>
> As interações devem ser opcionais, acessíveis e integradas à identidade visual.
>
> Evite elementos que dificultem a leitura, prejudiquem a navegação ou interrompam a experiência principal.

---

## 12. Refinamento do storytelling e da linguagem

**Técnicas utilizadas:** Iterative Prompting, Style Guiding e Negative Prompting.

**Objetivo:** melhorar a naturalidade dos textos e reorganizar a experiência narrativa do portfólio.

> Revise os textos e a hierarquia narrativa do portfólio existente.
>
> A linguagem atual apresenta construções artificiais e expressões genéricas frequentemente associadas a conteúdos produzidos por inteligência artificial.
>
> Utilize minha apresentação pessoal original como referência de tom e vocabulário.
>
> Priorize uma linguagem natural, jovem, objetiva e profissional.
>
> Organize a experiência de navegação na seguinte sequência:
>
> 1. Apresentação pessoal e personalidade;
> 2. Trajetória e interesses;
> 3. Conhecimentos e habilidades técnicas;
> 4. Experiências e conquistas;
> 5. Portfólio de projetos;
> 6. Contato.
>
> Evite slogans genéricos, metáforas excessivas, exageros profissionais e explicações desnecessárias sobre as tecnologias utilizadas na construção do site.
>
> Demonstre minhas competências por meio dos projetos, funcionalidades e visualizações, sem depender de afirmações promocionais.
>
> Preserve todas as informações factuais existentes.
>
> Reformule também a apresentação visual, evitando cards genéricos e layouts previsíveis, sem comprometer a legibilidade.

---

## 13. Reformulação da identidade visual

**Técnicas utilizadas:** Multimodal Prompting, Visual Reference Prompting e Iterative Refinement.

**Objetivo:** redefinir a direção artística a partir de referências visuais.

> Analise as duas imagens anexadas e identifique suas principais características de composição, tipografia, cores, texturas e organização visual.
>
> Utilize essas referências para reformular a identidade visual do portfólio existente, combinando:
>
> - Creative Editorial Design;
> - Modern Scrapbook Design;
> - Playful Design;
> - Maximalismo controlado;
> - Motion Design;
> - Neo-Brutalism suave.
>
> Explore fundos claros, contrastes entre rosa e preto, colagens, tipografias expressivas, letras recortadas, estrelas, setas manuscritas, faixas animadas e texturas de papel.
>
> Adapte essa linguagem visual ao contexto de Ciência de Dados, incorporando gráficos de dispersão, matrizes de correlação, tabelas, pipelines ETL e redes de conexões como parte da composição.
>
> Não reproduza literalmente as referências. Desenvolva uma identidade própria.
>
> Restrições:
>
> - Não reconstrua o projeto do zero.
> - Preserve os 11 projetos e suas informações.
> - Preserve os links de GitHub, deploy e Figma.
> - Preserve os scripts Python e as integrações existentes.
> - Preserve os filtros e funcionalidades.
> - Preserve os recursos de acessibilidade.
> - Preserve as animações funcionais, adaptando-as à nova estética.
>
> O resultado deve apresentar uma identidade criativa, expressiva e profissional, sem aparência genérica ou excessivamente corporativa.
>
> Após a reformulação, valide a responsividade, a acessibilidade e o funcionamento das funcionalidades existentes.

---

## 14. Documentação e versionamento

**Técnicas utilizadas:** Output Specification e Style Guiding.

**Objetivo:** garantir uma documentação compreensível e um histórico de desenvolvimento organizado.

> Revise a documentação e o versionamento do projeto.
>
> Estruture o README.md com as seguintes informações:
>
> - Apresentação e objetivo do portfólio;
> - Tecnologias utilizadas;
> - Arquitetura e estrutura de diretórios;
> - Funcionalidades;
> - Funcionamento dos scripts Python;
> - Processo de coleta e tratamento dos dados;
> - Recursos de acessibilidade;
> - Instruções de execução local;
> - Processo de build e deploy;
> - Utilização da inteligência artificial durante o desenvolvimento;
> - Exemplos dos prompts empregados.
>
> Utilize uma linguagem clara, natural e tecnicamente precisa.
>
> As mensagens de commit devem ser curtas, descritivas e coerentes com as alterações realizadas, evitando construções artificiais.
>
> Exemplos:
>
> - `organizando a estrutura do projeto`
> - `adicionando os filtros dos projetos`
> - `ajustando a identidade visual`
> - `corrigindo a animação do moonwalk`
> - `atualizando os dados do GitHub`
>
> Não invente informações sobre o processo de desenvolvimento. Diferencie funcionalidades implementadas, planejadas e pendentes.
>
> Mantenha a documentação atualizada conforme a evolução do projeto.

---

# Estratégias de Engenharia de Prompts

Durante o desenvolvimento, utilizei diferentes estratégias para orientar a inteligência artificial de acordo com a natureza de cada tarefa.

| Estratégia | Aplicação no projeto |
|---|---|
| Role Prompting | Definição do papel técnico assumido pela IA. |
| Contextual Prompting | Apresentação da minha personalidade, trajetória e objetivos profissionais. |
| Instruction-Based Prompting | Definição explícita das tarefas a serem executadas. |
| Task Decomposition | Divisão de funcionalidades complexas em etapas menores. |
| Constraint-Based Prompting | Estabelecimento de limites técnicos, éticos e funcionais. |
| Negative Prompting | Especificação de comportamentos e resultados indesejados. |
| Grounding | Utilização de repositórios, dados reais e fontes fornecidas para fundamentar as respostas. |
| Conditional Prompting | Definição de comportamentos alternativos conforme determinadas condições. |
| Multimodal Prompting | Utilização de imagens como referências para a reformulação visual. |
| Iterative Prompting | Refinamento progressivo das soluções a partir da análise dos resultados. |
| Acceptance Criteria | Definição de condições para considerar uma funcionalidade concluída. |
| Output Specification | Determinação da estrutura e do formato das entregas. |
| Style Guiding | Orientação da linguagem textual e da identidade visual. |
| Explainability | Solicitação de explicações sobre decisões técnicas e funcionamento do código. |

---

# O que aprendi utilizando inteligência artificial no desenvolvimento

A utilização de inteligência artificial durante o desenvolvimento do portfólio permitiu compreender a importância da elaboração de instruções claras, contextualizadas e verificáveis.

## Contextualização antes da implementação

Percebi que fornecer o contexto e explicar o motivo de uma solicitação contribui para decisões mais alinhadas ao objetivo do projeto.

Por exemplo, informar que meu foco profissional está nas áreas de Ciência de Dados e Engenharia de Dados permitiu orientar a hierarquia dos projetos apresentados.

## Definição de restrições

Estabelecer regras explícitas, como não inventar métricas, não atribuir contribuições indevidas e preservar funcionalidades existentes, ajuda a reduzir interpretações incorretas e alterações indesejadas.

## Decomposição de problemas

Dividir funcionalidades complexas em tarefas menores facilita a implementação, a identificação de problemas e a manutenção do código.

Um exemplo foi a separação entre Python, responsável pelo processamento dos dados, e JavaScript, responsável pela renderização e pelas interações no navegador.

## Refinamento iterativo

Nem sempre a primeira solução gerada corresponde ao resultado esperado.

A reformulação da identidade visual demonstrou a importância de avaliar criticamente as entregas, fornecer novas referências e aprimorar as instruções sem descartar o trabalho funcional já realizado.

## Compreensão do código

Além de solicitar implementações, busquei compreender o funcionamento das soluções por meio de explicações técnicas e documentação dos scripts.

O objetivo foi utilizar a inteligência artificial como ferramenta de apoio ao desenvolvimento, mantendo minha capacidade de compreender, modificar e dar continuidade ao projeto.

## Validação das informações e funcionalidades

As informações apresentadas precisam ser conferidas com suas respectivas fontes, especialmente os dados dos projetos, métricas, tecnologias e contribuições individuais.

Da mesma forma, funcionalidades, filtros, links, responsividade e acessibilidade devem ser testados antes da publicação.

---

# Considerações finais

O uso de inteligência artificial neste projeto não se limitou à geração de código. Envolveu definição de requisitos, contextualização, decomposição de problemas, direcionamento criativo, revisão de resultados e refinamento de soluções.

A Engenharia de Prompts foi utilizada como ferramenta de comunicação entre a intenção do projeto e sua implementação técnica.

O Claude Code atuou como agente de apoio ao desenvolvimento, enquanto as decisões sobre identidade visual, prioridades, funcionalidades, requisitos e critérios de aceitação foram orientadas por mim.

Essa experiência contribuiu tanto para a construção do portfólio quanto para o desenvolvimento das minhas habilidades de comunicação técnica, pensamento crítico, especificação de requisitos e utilização de ferramentas de inteligência artificial.
