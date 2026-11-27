# ElevOS

Acesse o app: https://grupo-glyffs.github.io/ElevOS/

Sistema de apoio ao diagnóstico de falhas em elevadores sem telemetria.
Challenge OTIS · FIAP, 2º semestre de Engenharia de Software · Grupo GLYFFS.

A versão publicada é o front-end completo, com dados de exemplo. O motor de referência em
Python não roda no GitHub Pages, que serve só arquivos estáticos; para executá-lo, veja
[Rodando o motor em Python](#rodando-o-motor-em-python).

## O problema

Elevador antigo não tem sensor conectado. Quando algo dá errado, quem avisa é o síndico, com
as palavras dele. O que chega na central é "está fazendo um barulho estranho".

Assim ninguém sabe o que levar. O técnico vai até o prédio para descobrir o problema, volta
para buscar a peça e o elevador fica parado mais tempo. A central também não consegue dizer
qual equipamento vai dar trabalho no mês que vem, porque o histórico está em texto livre.

O ElevOS troca o texto livre por doze perguntas objetivas. As respostas apontam a causa mais
provável e as peças recomendadas antes de o técnico sair, e ficam gravadas de um jeito que dá
para comparar um chamado com o outro.

## Como abrir o app

* Pela internet (mais fácil): abra https://grupo-glyffs.github.io/ElevOS/ no navegador do
  computador ou do celular.
* Para entrar: usuário e senha já vêm preenchidos. Escolha o perfil — Síndico, Central OTIS
  ou Técnico — e clique em Entrar. Trocar o perfil troca o usuário.
* Na sua máquina: veja [Rodando o front-end localmente](#rodando-o-front-end-localmente).

Não precisa criar conta. O que você cria nas telas vive na memória do navegador e se perde
quando a página é recarregada.

## O que dá para fazer no app

### Síndico

* Ver os elevadores do condomínio, com status, resumo e os últimos chamados de cada um.
* Abrir a ficha do elevador: modelo, capacidade, paradas, contrato, preventivas e histórico.
* Abrir um chamado respondendo doze perguntas de Sim, Não ou Não sei, cada uma com uma dica
  de como verificar o sintoma.
* Receber o diagnóstico na hora, com a causa mais provável, a confiança em porcentagem, as
  peças sugeridas e a explicação de quais respostas pesaram.
* Acompanhar os chamados do condomínio por status.
* Ver os relatórios do condomínio: causas mais frequentes e chamados por elevador.

### Central OTIS

* Painel com indicadores, chamados recentes e a prioridade da carteira.
* Navegar pela árvore condomínio → bloco → elevador e abrir a ficha de qualquer equipamento.
* Ver os chamados abertos já com o diagnóstico do motor e a confiança de cada causa.
* Abrir chamado pelo mesmo questionário do síndico, quando o aviso chega por telefone.
* Atribuir o técnico responsável, vendo região, especialidade e carga de trabalho.
* Ver o Risk Score dos elevadores, ordenado por risco, com filtros de período, idade do
  equipamento, condomínio e score mínimo.
* Ver a equipe em campo.
* O seletor de cidade no cabeçalho é global: filtra condomínios, elevadores, Risk Score e
  indicadores em todas as telas da Central.

### Técnico

* Agenda separada em Urgentes e Preventivas.
* Abrir o chamado e ver o diagnóstico, a confiança de cada causa, as peças sugeridas e a
  observação da central antes de sair.
* Confirmar a saída para o local.
* Registrar o feedback no fim: resultado, avaliação e peças usadas. O chamado só encerra
  depois desse registro.

É o único perfil que trabalha em campo, então as telas são mobile-first. No desktop elas
aparecem dentro de uma moldura de celular (`TecnicoShell.jsx`). Não existe "aceitar chamado",
só confirmar a saída.

## Como funciona o diagnóstico

O motor **não usa inteligência artificial nem estatística**. É uma matriz de pesos com soma e
subtração, e qualquer resultado pode ser refeito no papel.

A conta é definida em Python puro (`motor_simulacao.py`, a referência) e reproduzida em
JavaScript (`src/utils/diagnostico.js`), que é o que roda nas telas. Os dois lados usam a
mesma matriz, a mesma regra de resposta e os mesmos limiares.

**A matriz.** São 12 perguntas (P1 a P12) e 6 falhas possíveis: Motor, Freio, Porta, Sensor,
Polia/Cabo e Contator Elétrico. Cada pergunta tem um peso de 0 a 3 para cada falha, definido
pela equipe a partir dos sintomas típicos de cada problema.

**A pontuação.** Cada resposta ajusta a pontuação de todas as falhas ao mesmo tempo:

| Resposta | Efeito |
|---|---|
| Sim | soma o peso da pergunta |
| Não | subtrai o peso da pergunta |
| Não sei | não altera nada |

O "não" subtrair é o que permite eliminar hipóteses: negar um sintoma derruba a pontuação das
falhas que dependiam dele.

**A confiança.** Depois de cada resposta, a pontuação vira porcentagem. As pontuações
negativas são zeradas, somam-se as positivas, e cada falha fica com a sua fatia desse total.

**Parada antecipada.** Assim que uma falha atinge 80% de confiança, o questionário encerra.
Isso vale no fluxo real: a tela de perguntas recalcula a cada resposta e leva direto para o
diagnóstico, mesmo que ainda faltem perguntas.

**Classificação.** Se as 12 perguntas terminarem sem atingir os 80%, a maior confiança define
o resultado:

| Confiança | Classificação | Peças sugeridas |
|---|---|---|
| 80% ou mais | Certeza | da falha principal |
| 65% a 79% | Provável | da principal e da secundária |
| 40% a 64% | Dúvida | 3 a 4 peças possíveis |
| Menos de 40% | Incerteza | kit completo |

A faixa de Incerteza existe de propósito: quando a evidência é fraca, o sistema assume que não
sabe em vez de apostar num palpite. Um diagnóstico errado com cara de certeza manda o técnico
com a peça errada.

## Os dados de exemplo

Todos fictícios, em `src/data/mock.js`: 5 condomínios em 3 cidades e 4 regiões, 14 elevadores,
3 técnicos, as 12 perguntas com a matriz de pesos, as peças de cada falha e as 14 linhas do
Risk Score.

O Risk Score vai de 0 a 100 e, aqui, **maior = mais risco**: 0–30 verde, 31–60 amarelo, 61–80
laranja e 81–100 crítico. Cada linha traz idade do equipamento, chamados em 12 meses, tempo
médio de reparo, tendência, última manutenção, custo estimado, peças e plano de ação. É um
ranking de demonstração, não um cálculo do front-end.

## Escopo e limitações

Projeto acadêmico com restrição de escopo: só é usado o que foi ensinado no semestre. Vale
explicitar o que isso significa.

| | |
|---|---|
| Front-end | React 18 + Vite |
| Motor (referência) | Python puro — `motor_simulacao.py`, só biblioteca padrão |
| Motor (front-end) | JavaScript puro — `src/utils/diagnostico.js` |
| Estado | Context API, sem biblioteca externa |
| Ícones | SVG desenhados à mão em `src/components/Icons.jsx` |

Nenhuma biblioteca de componentes de interface, de ícones, de gerenciamento de estado ou de
cálculo foi usada.

O que o projeto **não** faz, e é bom deixar claro:

* Não há back-end. O front-end funciona sozinho com os dados de `src/data/mock.js`; o motor em
  Python existe como referência da conta e roda pelo terminal.
* Não há persistência. O que é criado nas telas vive em memória e se perde no reload.
* O login é um seletor de perfil, sem autenticação.
* Não há sensor, telemetria nem hardware. É proposital: a proposta é atender justamente o
  elevador que não tem sensor.

## Rodando o front-end localmente

Precisa do Node 20 ou mais novo.

```bash
npm install
npm run dev
```

O Vite mostra o endereço no terminal, normalmente <http://localhost:5173>. Para gerar a versão
de produção, `npm run build`, e `npm run preview` para conferir o resultado.

O deploy é automático: o workflow em `.github/workflows/deploy.yml` roda o build a cada push
na branch `Versão2-ElevOS` e publica a pasta `dist` no GitHub Pages. O `base` do Vite é
`/ElevOS/`, o nome do repositório.

## Rodando o motor em Python

Não precisa de instalação — o motor usa apenas `json` e `sys`, sem nenhuma dependência
externa.

```bash
python motor_simulacao.py
```

Roda três cenários no terminal — Certeza, Provável e Incerteza — mostrando as respostas, a
pontuação, a confiança e o ponto em que a parada antecipada dispara. É a mesma conta que o
JavaScript reproduz no navegador; os dois lados foram conferidos número a número.

## Telas

**Login (`/`)** — seletor de perfil para navegar em cada fluxo.

### Síndico

| Rota | Tela |
|---|---|
| `/sindico` | Meus elevadores — cards de status e últimos chamados |
| `/sindico/elevadores/:rg` | Ficha do elevador, histórico e preventivas |
| `/sindico/chamados` | Lista de chamados com filtro |
| `/sindico/chamados/novo` | Questionário, com parada antecipada |
| `/sindico/chamados/novo/diagnostico` | Diagnóstico e explicação das respostas |
| `/sindico/relatorios` | Relatórios do condomínio |

### Central OTIS

| Rota | Tela |
|---|---|
| `/central` | Painel — indicadores, chamados recentes e prioridade da carteira |
| `/central/elevadores` | Árvore condomínio → bloco → elevador |
| `/central/elevadores/:rg` | Ficha do elevador, na visão da Central |
| `/central/chamados` | Chamados abertos com o diagnóstico do motor |
| `/central/chamados/novo` | Abrir chamado pelo mesmo questionário |
| `/central/chamados/novo/diagnostico` | Diagnóstico do chamado aberto pela Central |
| `/central/chamados/novo/atribuir` | Atribuir técnico ao chamado |
| `/central/risk-score` | Risk Score com filtros e faixas |
| `/central/equipe` | Técnicos em campo e carga de trabalho |

### Técnico

| Rota | Tela |
|---|---|
| `/tecnico` | Agenda — abas Urgentes e Preventivas |
| `/tecnico/chamados/:id` | Diagnóstico, peças sugeridas e confirmação de saída |
| `/tecnico/chamados/:id/finalizar` | Feedback: resultado, avaliação e peças usadas |

Qualquer rota desconhecida volta para o login.

## Responsividade e acessibilidade

* Verificado em 390px, 820px e 1440px, sem rolagem horizontal. As tabelas da Central viram
  cards no mobile e as barras laterais viram menu retrátil.
* HTML semântico: `header`, `nav`, `main`, `section` e `article`.
* `label` nos campos do formulário, `aria-label` nos botões que só têm ícone, `aria-hidden`
  nos elementos decorativos e foco visível na navegação por teclado.

## Marca

A logo está em `src/components/Logo.jsx`, em SVG, e serve também de favicon (data URI no
`index.html`).

| Cor | Hex | Uso |
|---|---|---|
| Ciano ElevOS | `#039ABC` | símbolo, régua do slogan |
| Navy | `#090D19` | chevrons, fundo do login |
| Azul de interface | `#0a2d8f` | botões e links |

```jsx
<LogoMark />      // só o símbolo
<Logo />          // símbolo + wordmark — telas internas
<Logo tagline />  // + slogan "Do registro à prevenção" — só no login
```

## Estrutura de pastas

O projeto usa React, que organiza os arquivos por componente. A correspondência com as pastas
pedidas é:

* css: `src/index.css` e as classes do Tailwind nos componentes.
* js: a pasta `src/` inteira (páginas, componentes, dados e regras).
* img: não há imagem de bitmap — a logo e os ícones são SVG escritos em JSX.

```
motor_simulacao.py      motor de diagnóstico em Python — a referência
index.html              página única que carrega o app
src/
  components/           layouts, primitivos de interface e ícones
  data/mock.js          matriz de pesos e dados de exemplo
  hooks/                comportamentos reaproveitados entre telas
  state/                estado compartilhado dos chamados (Context API)
  utils/                cálculo do diagnóstico e busca de elevadores
  pages/
    sindico/
    central/
    tecnico/
  App.jsx               rotas
  main.jsx              ponto de entrada
```

## Tecnologias

* React 18, Vite e React Router
* Context API para o estado compartilhado
* Python puro no motor de referência
* `sessionStorage`, para o aviso que aparece uma vez depois do login
* GitHub Actions e GitHub Pages para o deploy

## Links

* App: https://grupo-glyffs.github.io/ElevOS/
* Repositório: https://github.com/Grupo-GLYFFS/ElevOS

## Integrantes

* Fabricio Cardoso Nicoli, RM571627
* Felipe Santos, RM574050
* Leonardo de Lima Dias, RM569286
* Samuel Almeida Santos, RM572554
* Gabriel de Lucca Chiapetta Santana, RM573610

## Uso de IA

Usamos IA generativa (Claude) como apoio na escrita dos textos do projeto. Todo o
resultado foi revisado pelo grupo.
