# ElevOS

Sistema de apoio ao diagnóstico de falhas em elevadores sem telemetria (sem IoT).
Projeto acadêmico do **2º semestre da FIAP** · Challenge OTIS · Grupo GLYFFS.

## O problema

Muitos elevadores mais antigos não têm nenhum sensor conectado — quando algo dá
errado, o único jeito de saber o que houve é o síndico descrever o sintoma. O
ElevOS estrutura essa descrição em um formulário de perguntas de sim/não e usa
essas respostas para apontar a causa mais provável e as peças recomendadas,
antes mesmo do técnico chegar ao local.

## Como funciona o diagnóstico

O motor de diagnóstico **não usa inteligência artificial nem estatística** — é
uma matriz de pesos e um sistema de pontuação por soma e subtração, calculado
em Python puro (`motor_simulacao.py`).

- Existem **12 perguntas** (P1 a P12) e **6 possíveis falhas** (Motor, Freio,
  Porta, Sensor, Polia/Cabo, Contator Elétrico).
- Cada pergunta tem um peso (de 0 a 3) para cada falha, definido à mão pela
  equipe a partir do conhecimento sobre os sintomas de cada problema.
- Cada resposta ajusta a pontuação de cada falha:
  - **"Sim"** soma o peso da pergunta.
  - **"Não"** subtrai o peso da pergunta.
  - **"Não sei"** não altera nada.
- Depois de cada resposta, a pontuação é transformada em uma **porcentagem de
  confiança**: pega-se a pontuação de cada falha (ignorando as negativas, que
  viram 0) e divide-se pela soma de todas as pontuações positivas.
- **Parada antecipada:** assim que alguma falha atinge 80% de confiança ou
  mais, o motor para de perguntar — não faz sentido continuar o questionário
  se a causa já está clara.
- Se as 12 perguntas terminarem sem isso acontecer, o diagnóstico é
  classificado pela maior confiança encontrada:

  | Confiança | Classificação | O que o sistema sugere |
  |---|---|---|
  | 80% ou mais | **Certeza** | peça da falha principal |
  | 65% a 79% | **Provável** | peças da falha principal + secundária |
  | 40% a 64% | **Dúvida** | 3 a 4 peças possíveis |
  | Menos de 40% | **Incerteza** | kit completo de peças |

## Os três perfis

- **Síndico** — abre um chamado respondendo as 12 perguntas e acompanha o
  diagnóstico e o andamento do atendimento.
- **Central OTIS** — enxerga todos os chamados e elevadores monitorados, pode
  abrir um chamado ela mesma (mesmo questionário de 12 perguntas) e atribuir
  um técnico responsável.
- **Técnico** — só vê os chamados atribuídos a ele, confirma que está saindo
  para o atendimento e, ao final, registra o feedback (o chamado só se
  encerra depois desse registro).

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | React 18 + Vite, React Router, Tailwind CSS |
| Motor de diagnóstico | Python puro (`motor_simulacao.py`) — sem bibliotecas externas |
| Back-end | Flask (`app.py`) — mínimo e apenas demonstrativo |
| Persistência | Arquivo `database.json` (JSON puro) |

Ícones são todos SVG desenhados à mão em `src/components/Icons.jsx` — nenhuma
biblioteca de ícones ou de componentes de interface prontos foi usada.

**Importante:** o front-end funciona sozinho, com dados de exemplo em
`src/data/mock.js` — ele **não** faz chamadas para o `app.py`. O back-end
existe só para mostrar que o mesmo motor de diagnóstico também funciona por
trás de uma API HTTP, com 3 rotas simples (ver abaixo).

## Como rodar

### Front-end

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

### Back-end (demonstrativo)

```bash
pip install flask flask-cors
python app.py    # http://localhost:5000
```

Rotas disponíveis:

| Rota | Método | O que faz |
|---|---|---|
| `/api/health` | GET | Confirma que o servidor está rodando |
| `/api/diagnosticar` | POST | Recebe `{"respostas": {"P1": "Sim", ...}}` e devolve o diagnóstico completo |
| `/api/chamados` | GET | Devolve a lista de chamados salva em `database.json` |

### Motor de diagnóstico isolado

```bash
python motor_simulacao.py
```

Roda três cenários de teste no terminal (Certeza, Provável e Incerteza), cada
um mostrando as respostas, a pontuação, a confiança e o diagnóstico final.

## Marca

A logo vive em `src/components/Logo.jsx`, em SVG — escala sem perder nitidez e serve
também de favicon (data URI em `index.html`).

| Cor | Hex | Uso |
|---|---|---|
| Ciano ElevOS | `#039ABC` | símbolo, régua do slogan |
| Navy do chevron | `#090D19` | chevrons, fundo do hero do login |
| Azul de interface | `#0a2d8f` (`otis-900`) | botões e links |

```jsx
<LogoMark />          // só o símbolo
<Logo />              // símbolo + "ElevOS"           → usado nas telas
<Logo tagline />      // símbolo + "ElevOS" + slogan  → usado só no login
```

O slogan "Do registro à prevenção" aparece **apenas no login**. Nas telas internas
a marca fica reduzida ao símbolo + wordmark, para não competir com o conteúdo.

## Telas

### Login (`/`)
Seletor de perfil para navegar direto em cada fluxo da demo.

### Síndico
| Rota | Tela |
|---|---|
| `/sindico` | Meus elevadores — cards de status + últimos chamados |
| `/sindico/elevadores/:rg` | Detalhe do elevador — ficha, histórico e preventivas |
| `/sindico/chamados` | Lista de chamados com filtro |
| `/sindico/chamados/novo` | Fluxo de 12 perguntas (entrada estruturada) |
| `/sindico/chamados/novo/diagnostico` | Diagnóstico com explicação das respostas |
| `/sindico/relatorios` | Relatórios do condomínio |

### Central OTIS
| Rota | Tela |
|---|---|
| `/central` | Painel — indicadores, chamados recentes e prioridade da carteira |
| `/central/elevadores` | Visão por elevador — árvore condomínio → bloco → elevador |
| `/central/chamados` | Chamados abertos com diagnóstico do motor |
| `/central/chamados/novo` | Abrir chamado — mesmo fluxo de 12 perguntas do síndico |
| `/central/chamados/novo/atribuir` | Atribuir um técnico ao chamado recém-aberto |
| `/central/risk-score` | Risk Score com filtros e faixas de risco |
| `/central/equipe` | Técnicos em campo |

O **seletor de cidade/região no header é global**: filtra condomínios, elevadores,
Risk Score e indicadores de todas as telas da Central.

### Técnico (mobile)
| Rota | Tela |
|---|---|
| `/tecnico` | Agenda — abas Urgentes e Preventivas (só chamados atribuídos a ele) |
| `/tecnico/chamados/:id` | Diagnóstico, peças sugeridas e confirmação de saída |
| `/tecnico/chamados/:id/finalizar` | Feedback: resultado, avaliação do diagnóstico e peças usadas |

O app do técnico é mobile-first. No desktop ele aparece dentro de uma moldura de celular
(`src/components/TecnicoShell.jsx`) porque é o único perfil que trabalha em campo. Ele não
tem opção de "aceitar" chamado — só de confirmar que está saindo; o atendimento só é
considerado concluído depois que o feedback é salvo.

## Responsividade

Todas as telas foram verificadas em 390px (celular), 820px (tablet) e 1440px (desktop),
sem overflow horizontal. As tabelas da Central viram cards no mobile; as sidebars viram
drawer com botão de menu.

## Estrutura

```
app.py                # back-end Flask mínimo (demonstrativo)
database.json         # chamados de exemplo, para a rota /api/chamados
motor_simulacao.py     # motor de diagnóstico em Python puro
src/
├── components/        # layouts, primitivos de UI e ícones
├── data/mock.js        # todos os dados usados pelo front-end
├── state/              # estado compartilhado dos chamados (Context API)
├── utils/               # cálculo do diagnóstico e busca de elevadores
├── pages/
│   ├── sindico/
│   ├── central/
│   └── tecnico/
├── App.jsx              # rotas
└── main.jsx
```
