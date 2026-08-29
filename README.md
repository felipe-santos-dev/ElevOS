# ElevOS — Front-end

Interface do **ElevOS**, sistema de diagnóstico sob incerteza para elevadores antigos sem IoT.
Challenge OTIS · FIAP · Grupo GLYFFS.

Este repositório contém **apenas o front-end**. Todos os dados vêm de `src/data/mock.js`
— não há chamadas de API. É o ponto de integração com a API do motor Bayes depois.

## Stack

- React 18 + Vite
- React Router 6 (`HashRouter`, para abrir o `dist/` sem servidor)
- Tailwind CSS 3
- Zero dependência de biblioteca de ícones — SVG inline em `src/components/Icons.jsx`

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

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

## Telas

### Login (`/`)
Seletor de perfil para navegar direto em cada fluxo da demo.

### Síndico
| Rota | Tela |
|---|---|
| `/sindico` | Meus elevadores — cards de status + últimos chamados |
| `/sindico/elevadores/:rg` | Detalhe do elevador — ficha, histórico e preventivas |
| `/sindico/chamados` | Lista de chamados com filtro |
| `/sindico/chamados/novo` | Fluxo de perguntas (entrada estruturada) |
| `/sindico/chamados/novo/diagnostico` | Diagnóstico com explicabilidade |
| `/sindico/relatorios` | Relatórios do condomínio |

O fluxo de perguntas encerra em **5 perguntas de um banco de 12** — a barra de progresso
mostra isso porque o motor para quando a confiança é suficiente, não quando o formulário acaba.

### Central OTIS
| Rota | Tela |
|---|---|
| `/central` | Painel — KPIs, Fleet Health e prioridade da carteira |
| `/central/elevadores` | Visão por elevador — árvore condomínio → bloco → elevador |
| `/central/chamados` | Chamados abertos com diagnóstico do motor |
| `/central/risk-score` | Risk Score com filtros e faixas de risco |
| `/central/equipe` | Técnicos em campo |

O **seletor de cidade/região no header é global**: filtra condomínios, elevadores,
Risk Score e KPIs de todas as telas da Central.

### Técnico (mobile)
| Rota | Tela |
|---|---|
| `/tecnico` | Agenda — abas Urgentes e Preventivas |
| `/tecnico/chamados/:id` | Diagnóstico, peças sugeridas e aceite com toast |
| `/tecnico/chamados/:id/finalizar` | Feedback: resultado, avaliação do diagnóstico e peças |

O app do técnico é mobile-first. No desktop ele aparece dentro de uma moldura de celular
(`src/components/TecnicoShell.jsx`) porque é o único perfil que trabalha em campo.

## Responsividade

Todas as telas foram verificadas em 390px (celular), 820px (tablet) e 1440px (desktop),
sem overflow horizontal. As tabelas da Central viram cards no mobile; as sidebars viram
drawer com botão de menu.

## Estrutura

```
src/
├── components/     # layouts, primitivos de UI e ícones
├── data/mock.js    # todos os dados da aplicação
├── pages/
│   ├── sindico/
│   ├── central/
│   └── tecnico/
├── App.jsx         # rotas
└── main.jsx
```

## Integração futura

Substituir os imports de `src/data/mock.js` por chamadas à API. Os pontos de contato são:

- `perguntas` / `TOTAL_PERGUNTAS_BANCO` → endpoint de próxima pergunta (ganho de informação)
- `diagnostico` → retorno do motor Bayes (posterior + explicabilidade + nível de confiança)
- `riskScore` → endpoint de priorização da carteira
- `FinalizarChamado` → POST do feedback do técnico (evidência para o banco histórico)
