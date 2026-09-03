# ElevOS

Sistema de apoio ao diagnóstico de falhas em elevadores sem telemetria.
Projeto acadêmico do 2º semestre da FIAP · Challenge OTIS · Grupo GLYFFS.

**Demonstração:** https://grupo-glyffs.github.io/ElevOS/

A versão publicada é o front-end completo, com dados de exemplo. O back-end e o
motor em Python não rodam no GitHub Pages, que serve apenas arquivos estáticos —
para executá-los, veja [Rodando o lado Python](#rodando-o-lado-python).

---

## O problema

Elevadores mais antigos não têm sensor conectado. Quando algo dá errado, a única
fonte de informação é o síndico descrevendo o sintoma com as palavras dele — e
isso chega à central como "está fazendo um barulho estranho".

O ElevOS troca esse texto livre por um questionário objetivo e usa as respostas
para apontar a causa mais provável e as peças recomendadas, antes de o técnico
sair para o local.

## Como funciona o diagnóstico

O motor **não usa inteligência artificial nem estatística**. É uma matriz de
pesos com soma e subtração, e qualquer resultado pode ser refeito no papel.

A conta é definida em Python puro (`motor_simulacao.py`, a referência) e
reproduzida em JavaScript (`src/utils/diagnostico.js`), que é o que roda nas
telas. Os dois lados usam a mesma matriz, a mesma regra de resposta e os mesmos
limiares.

**A matriz.** São 12 perguntas (P1 a P12) e 6 falhas possíveis: Motor, Freio,
Porta, Sensor, Polia/Cabo e Contator Elétrico. Cada pergunta tem um peso de 0 a
3 para cada falha, definido pela equipe a partir dos sintomas típicos de cada
problema.

**A pontuação.** Cada resposta ajusta a pontuação de todas as falhas ao mesmo
tempo:

| Resposta | Efeito |
|---|---|
| Sim | soma o peso da pergunta |
| Não | subtrai o peso da pergunta |
| Não sei | não altera nada |

O "não" subtrair é o que permite eliminar hipóteses: negar um sintoma derruba a
pontuação das falhas que dependiam dele.

**A confiança.** Depois de cada resposta, a pontuação vira porcentagem. As
pontuações negativas são zeradas, somam-se as positivas, e cada falha fica com a
sua fatia desse total.

**Parada antecipada.** Assim que uma falha atinge 80% de confiança, o
questionário encerra. Isso vale no fluxo real: `/chamados/novo` recalcula a cada
resposta e leva direto para o diagnóstico, mesmo que ainda faltem perguntas.

**Classificação.** Se as 12 perguntas terminarem sem atingir os 80%, a maior
confiança define o resultado:

| Confiança | Classificação | Peças sugeridas |
|---|---|---|
| 80% ou mais | Certeza | da falha principal |
| 65% a 79% | Provável | da principal e da secundária |
| 40% a 64% | Dúvida | 3 a 4 peças possíveis |
| Menos de 40% | Incerteza | kit completo |

A faixa de Incerteza existe de propósito: quando a evidência é fraca, o sistema
assume que não sabe em vez de apostar em um palpite. Um diagnóstico errado com
aparência de certeza manda o técnico com a peça errada.

## Os três perfis

**Síndico** — abre o chamado respondendo as perguntas, recebe o diagnóstico com
a explicação de quais respostas pesaram e acompanha o andamento.

**Central OTIS** — enxerga todos os chamados e elevadores, pode abrir chamado
pelo mesmo questionário e atribui o técnico responsável.

**Técnico** — vê apenas os chamados atribuídos a ele, confirma que está saindo e
registra o feedback ao final. O chamado só encerra depois desse registro.

## Escopo e limitações

Projeto acadêmico com restrição de escopo: só é usado o que foi ensinado no
semestre. Vale explicitar o que isso significa.

| | |
|---|---|
| Front-end | React 18 + Vite, React Router, Tailwind CSS |
| Motor (referência) | Python puro — `motor_simulacao.py`, só biblioteca padrão |
| Motor (front-end) | JavaScript puro — `src/utils/diagnostico.js` |
| Back-end | Flask — `app.py`, mínimo e demonstrativo |
| Estado | Context API, sem biblioteca externa |
| Ícones | SVG desenhados à mão em `src/components/Icons.jsx` |

Nenhuma biblioteca de componentes de interface, de ícones, de gerenciamento de
estado ou de cálculo foi usada.

O que o projeto **não** faz, e é bom deixar claro:

- O front-end não conversa com o `app.py`. Ele funciona sozinho com os dados de
  `src/data/mock.js`. O back-end existe para demonstrar que o mesmo motor
  responde por HTTP.
- Não há persistência. O `database.json` é lido pela rota `/api/chamados` e
  nunca escrito; o que é criado nas telas vive em memória e se perde no reload.
- O login é um seletor de perfil, sem autenticação.
- Não há sensor, telemetria nem hardware. É proposital: a proposta é atender
  justamente o elevador que não tem sensor.

## Rodando o lado Python

O GitHub Pages não executa código de servidor, então essas duas partes só rodam
localmente.

```bash
pip install -r requirements.txt
python app.py            # http://localhost:5000
```

| Rota | Método | O que faz |
|---|---|---|
| `/api/health` | GET | Confirma que o servidor está no ar |
| `/api/diagnosticar` | POST | Recebe `{"respostas": {"P1": "Sim", ...}}` e devolve o diagnóstico |
| `/api/chamados` | GET | Devolve os chamados de `database.json` |

Para ver a conta sem subir nada:

```bash
python motor_simulacao.py
```

Roda três cenários no terminal — Certeza, Provável e Incerteza — mostrando as
respostas, a pontuação, a confiança e o ponto em que a parada antecipada
dispara. É a mesma conta que o JavaScript reproduz no navegador; os dois lados
foram conferidos número a número.

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
| `/central/chamados` | Chamados abertos com o diagnóstico do motor |
| `/central/chamados/novo` | Abrir chamado pelo mesmo questionário |
| `/central/chamados/novo/atribuir` | Atribuir técnico ao chamado |
| `/central/risk-score` | Risk Score com filtros e faixas |
| `/central/equipe` | Técnicos em campo e carga de trabalho |

O seletor de cidade no cabeçalho é global: filtra condomínios, elevadores, Risk
Score e indicadores em todas as telas da Central.

### Técnico

| Rota | Tela |
|---|---|
| `/tecnico` | Agenda — abas Urgentes e Preventivas |
| `/tecnico/chamados/:id` | Diagnóstico, peças sugeridas e confirmação de saída |
| `/tecnico/chamados/:id/finalizar` | Feedback: resultado, avaliação e peças usadas |

É o único perfil que trabalha em campo, então as telas são mobile-first. No
desktop aparecem dentro de uma moldura de celular (`TecnicoShell.jsx`). Não
existe "aceitar chamado", só confirmar a saída — o atendimento se encerra quando
o feedback é salvo.

## Responsividade

Verificado em 390px, 820px e 1440px, sem rolagem horizontal. As tabelas da
Central viram cards no mobile e as barras laterais viram menu retrátil.

## Marca

A logo está em `src/components/Logo.jsx`, em SVG, e serve também de favicon
(data URI no `index.html`).

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

## Estrutura

```
app.py                  back-end Flask demonstrativo
motor_simulacao.py      motor de diagnóstico em Python — a referência
database.json           chamados de exemplo para /api/chamados
requirements.txt        flask e flask-cors
src/
├── components/         layouts, primitivos de interface e ícones
├── data/mock.js        matriz de pesos e dados de exemplo
├── state/              estado compartilhado dos chamados (Context API)
├── utils/              cálculo do diagnóstico e busca de elevadores
├── pages/
│   ├── sindico/
│   ├── central/
│   └── tecnico/
├── App.jsx             rotas
└── main.jsx