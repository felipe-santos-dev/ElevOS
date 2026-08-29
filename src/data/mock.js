// ============================================================
// ElevOS — dados mock do front-end (sem back-end)
// Toda tela consome daqui. Trocar por chamadas de API depois.
// ============================================================

export const usuarios = {
  sindico: {
    id: 'u-01',
    nome: 'Carlos Mendes',
    iniciais: 'CM',
    papel: 'Síndico',
    condominio: 'Condomínio Vista Verde',
    cidade: 'São Paulo',
  },
  central: {
    id: 'u-02',
    nome: 'Ana Lima',
    iniciais: 'AL',
    papel: 'Operadora',
    regiao: 'Zona Sul',
  },
  tecnico: {
    id: 'u-03',
    nome: 'Rafael Silva',
    iniciais: 'RS',
    papel: 'Técnico',
    regiao: 'Zona Sul',
  },
}

// ---------- Elevadores do síndico ----------
export const elevadores = [
  {
    rg: 'ES-1023',
    torre: 'Torre A',
    nome: 'Elevador 1',
    status: 'normal',
    statusLabel: 'Normal',
    resumo: 'Último chamado 21/07 · resolvido',
    modelo: 'Gen2 Prime',
    capacidade: '8 pessoas · 600 kg',
    paradas: '12 andares',
    contrato: 'Premium · SLA 4h',
    operacao: 'Em operação',
    preventiva: {
      ultima: '28/11/2025',
      ultimaObs: '9 meses atrás',
      proxima: '15/09/2026',
      proximaObs: 'Troca de óleo',
      chamados12m: 3,
      chamadosObs: '3 resolvidos',
    },
    chamados: [
      { data: '21/07 · 11:35', titulo: 'Botão do 4º andar sem resposta', status: 'resolvido' },
      { data: '12/05 · 09:02', titulo: 'Porta lenta ao abrir', status: 'resolvido' },
      { data: '03/02 · 14:47', titulo: 'Ruído leve na descida', status: 'resolvido' },
    ],
  },
  {
    rg: 'ES-1024',
    torre: 'Torre A',
    nome: 'Elevador 2',
    status: 'chamado',
    statusLabel: 'Chamado aberto',
    resumo: 'Barulho metálico · técnico a caminho',
    modelo: 'Gen2 Prime',
    capacidade: '8 pessoas · 600 kg',
    paradas: '12 andares',
    contrato: 'Premium · SLA 4h',
    operacao: 'Em operação',
    preventiva: {
      ultima: '28/11/2025',
      ultimaObs: '9 meses atrás',
      proxima: '15/09/2026',
      proximaObs: 'Troca de óleo',
      chamados12m: 4,
      chamadosObs: '3 resolvidos',
    },
    chamados: [
      { data: '27/08 · 08:14', titulo: 'Barulho metálico na subida', status: 'aberto' },
      { data: '14/08 · 16:22', titulo: 'Porta lenta ao fechar', status: 'resolvido' },
      { data: '21/07 · 11:35', titulo: 'Botão do 4º andar sem resposta', status: 'resolvido' },
    ],
  },
  {
    rg: 'ES-1025',
    torre: 'Torre B',
    nome: 'Elevador 1',
    status: 'manutencao',
    statusLabel: 'Manutenção',
    resumo: 'Parado desde 26/08 · troca de peça',
    modelo: 'Gen2 Life',
    capacidade: '6 pessoas · 450 kg',
    paradas: '9 andares',
    contrato: 'Standard · SLA 8h',
    operacao: 'Parado',
    preventiva: {
      ultima: '02/03/2026',
      ultimaObs: '6 meses atrás',
      proxima: '20/09/2026',
      proximaObs: 'Cabos e roldanas',
      chamados12m: 6,
      chamadosObs: '5 resolvidos',
    },
    chamados: [
      { data: '26/08 · 17:40', titulo: 'Porta não abre no térreo', status: 'aberto' },
      { data: '20/08 · 10:12', titulo: 'Trepidação entre andares', status: 'resolvido' },
      { data: '05/07 · 08:55', titulo: 'Luz da cabine oscilando', status: 'resolvido' },
    ],
  },
]

export const ultimosChamadosSindico = [
  { torre: 'Torre A', elevador: 'Elevador 2', rg: 'ES-1024', titulo: 'Barulho metálico na subida', data: '27/08 · 08:14', status: 'a-caminho', dot: 'chamado' },
  { torre: 'Torre B', elevador: 'Elevador 1', rg: 'ES-1025', titulo: 'Porta não abre no térreo', data: '26/08 · 17:40', status: 'aguardando', dot: 'manutencao' },
  { torre: 'Torre A', elevador: 'Elevador 1', rg: 'ES-1023', titulo: 'Botão do 4º andar sem resposta', data: '21/07 · 11:35', status: 'resolvido', dot: 'normal' },
]

// ---------- Fluxo de perguntas (entrada estruturada) ----------
// O motor escolhe a próxima pergunta por ganho de informação.
// Aqui a sequência é fixa: 5 perguntas de um banco de 12.
export const perguntas = [
  { id: 'q1', titulo: 'O elevador para entre andares?', ajuda: 'Considere as últimas 48 horas de uso', resumo: 'Para entre andares' },
  { id: 'q2', titulo: 'O elevador faz barulho metálico?', ajuda: 'Ouça durante a subida, com a cabine vazia', resumo: 'Barulho metálico' },
  { id: 'q3', titulo: 'A porta trava ao abrir?', ajuda: 'Teste no térreo e em mais um andar', resumo: 'Porta trava ao abrir' },
  { id: 'q4', titulo: 'Há vibração na subida?', ajuda: 'Perceptível ao encostar na parede da cabine', resumo: 'Vibração na subida' },
  { id: 'q5', titulo: 'A luz da cabine oscila?', ajuda: 'Observe com a porta fechada, em movimento', resumo: 'Luz da cabine oscila' },
]

export const TOTAL_PERGUNTAS_BANCO = 12

// ---------- Diagnóstico ----------
export const diagnostico = {
  confianca: 78,
  nivel: 'Diagnóstico conclusivo',
  respostasAnalisadas: 5,
  causas: [
    { nome: 'Motor', probabilidade: 78 },
    { nome: 'Freio', probabilidade: 15 },
    { nome: 'Sensor', probabilidade: 7 },
  ],
  explicacao:
    'Barulho metálico + paradas entre andares = 312 casos similares na base, 84% resolvidos no conjunto motor. A porta não travou, o que derruba a hipótese de sensor de 26% para 7%. A última preventiva deste elevador foi há 9 meses, 3 acima do intervalo recomendado.',
  peca: {
    nome: 'Motor X34 + Rolamento',
    estoque: 'Em estoque',
    servico: '~2h de serviço',
  },
}

// ---------- Central OTIS ----------
export const regioes = [
  { id: 'sp-zona-sul', cidade: 'São Paulo', regiao: 'Zona Sul' },
  { id: 'sp-zona-norte', cidade: 'São Paulo', regiao: 'Zona Norte' },
  { id: 'rj-zona-sul', cidade: 'Rio de Janeiro', regiao: 'Zona Sul' },
  { id: 'bh-centro-sul', cidade: 'Belo Horizonte', regiao: 'Centro-Sul' },
]

export const condominios = [
  {
    id: 'c-01',
    nome: 'Condomínio São Luiz',
    cidade: 'São Paulo',
    regiaoId: 'sp-zona-sul',
    blocos: [
      {
        nome: 'Bloco A',
        elevadores: [
          { nome: 'Elevador 01', rg: 'ES-1023', status: 'normal', ultimoChamado: '27/08' },
          { nome: 'Elevador 02', rg: 'ES-1024', status: 'manutencao', ultimoChamado: '25/08' },
        ],
      },
      {
        nome: 'Bloco B',
        elevadores: [{ nome: 'Elevador 01', rg: 'ES-1025', status: 'aguardando', ultimoChamado: '20/08' }],
      },
    ],
  },
  {
    id: 'c-02',
    nome: 'Edifício Aurora',
    cidade: 'São Paulo',
    regiaoId: 'sp-zona-sul',
    blocos: [
      {
        nome: 'Torre Única',
        elevadores: [
          { nome: 'Elevador 01', rg: 'ES-3301', status: 'manutencao', ultimoChamado: '22/08' },
          { nome: 'Elevador 03', rg: 'ES-3305', status: 'manutencao', ultimoChamado: '26/08' },
        ],
      },
    ],
  },
  {
    id: 'c-03',
    nome: 'Residencial Pico',
    cidade: 'São Paulo',
    regiaoId: 'sp-zona-norte',
    blocos: [
      {
        nome: 'Bloco Único',
        elevadores: [
          { nome: 'Elevador 01', rg: 'ES-4101', status: 'normal', ultimoChamado: '05/08' },
          { nome: 'Elevador 02', rg: 'ES-4102', status: 'aguardando', ultimoChamado: '18/08' },
        ],
      },
    ],
  },
  {
    id: 'c-04',
    nome: 'Centro Comercial Rio',
    cidade: 'Rio de Janeiro',
    regiaoId: 'rj-zona-sul',
    blocos: [
      {
        nome: 'Ala Norte',
        elevadores: [
          { nome: 'Elevador 04', rg: 'ES-5540', status: 'manutencao', ultimoChamado: '19/08' },
          { nome: 'Elevador 05', rg: 'ES-5544', status: 'normal', ultimoChamado: '09/08' },
        ],
      },
    ],
  },
  {
    id: 'c-05',
    nome: 'Solar das Palmeiras',
    cidade: 'Belo Horizonte',
    regiaoId: 'bh-centro-sul',
    blocos: [
      {
        nome: 'Bloco A',
        elevadores: [
          { nome: 'Elevador 01', rg: 'ES-2210', status: 'normal', ultimoChamado: '28/06' },
          { nome: 'Elevador 02', rg: 'ES-2211', status: 'normal', ultimoChamado: '02/07' },
          { nome: 'Elevador 03', rg: 'ES-2212', status: 'normal', ultimoChamado: '14/07' },
        ],
      },
    ],
  },
]

// ---------- Risk Score ----------
export const riskScore = [
  { rank: 1, elevador: 'Elevador 03', rg: 'ES-3305', condominio: 'Edifício Aurora', cidade: 'São Paulo', regiaoId: 'sp-zona-sul', ultimoChamado: '26/08', score: 94, acao: 'Inspeção urgente' },
  { rank: 2, elevador: 'Elevador 02', rg: 'ES-1024', condominio: 'Vista Verde', cidade: 'São Paulo', regiaoId: 'sp-zona-sul', ultimoChamado: '27/08', score: 88, acao: 'Inspeção urgente' },
  { rank: 3, elevador: 'Elevador 01', rg: 'ES-3301', condominio: 'Edifício Aurora', cidade: 'São Paulo', regiaoId: 'sp-zona-sul', ultimoChamado: '22/08', score: 84, acao: 'Agendar retrofit' },
  { rank: 4, elevador: 'Elevador 04', rg: 'ES-5540', condominio: 'Centro Comercial Rio', cidade: 'Rio de Janeiro', regiaoId: 'rj-zona-sul', ultimoChamado: '19/08', score: 79, acao: 'Agendar retrofit' },
  { rank: 5, elevador: 'Elevador 01', rg: 'ES-1025', condominio: 'Vista Verde', cidade: 'São Paulo', regiaoId: 'sp-zona-sul', ultimoChamado: '20/08', score: 73, acao: 'Trocar rolamento' },
  { rank: 6, elevador: 'Elevador 02', rg: 'ES-4102', condominio: 'Residencial Pico', cidade: 'São Paulo', regiaoId: 'sp-zona-norte', ultimoChamado: '18/08', score: 68, acao: 'Agendar retrofit' },
  { rank: 7, elevador: 'Elevador 01', rg: 'ES-6820', condominio: 'Parque das Flores', cidade: 'São Paulo', regiaoId: 'sp-zona-norte', ultimoChamado: '11/08', score: 64, acao: 'Antecipar preventiva' },
  { rank: 8, elevador: 'Elevador 05', rg: 'ES-5544', condominio: 'Centro Comercial Rio', cidade: 'Rio de Janeiro', regiaoId: 'rj-zona-sul', ultimoChamado: '09/08', score: 58, acao: 'Antecipar preventiva' },
  { rank: 9, elevador: 'Elevador 01', rg: 'ES-4101', condominio: 'Residencial Pico', cidade: 'São Paulo', regiaoId: 'sp-zona-norte', ultimoChamado: '05/08', score: 51, acao: 'Monitorar' },
  { rank: 10, elevador: 'Elevador 02', rg: 'ES-6821', condominio: 'Parque das Flores', cidade: 'São Paulo', regiaoId: 'sp-zona-norte', ultimoChamado: '31/07', score: 44, acao: 'Monitorar' },
  { rank: 11, elevador: 'Elevador 01', rg: 'ES-1023', condominio: 'Vista Verde', cidade: 'São Paulo', regiaoId: 'sp-zona-sul', ultimoChamado: '21/07', score: 37, acao: 'Monitorar' },
  { rank: 12, elevador: 'Elevador 03', rg: 'ES-2212', condominio: 'Solar das Palmeiras', cidade: 'Belo Horizonte', regiaoId: 'bh-centro-sul', ultimoChamado: '14/07', score: 29, acao: 'Sem ação' },
  { rank: 13, elevador: 'Elevador 02', rg: 'ES-2211', condominio: 'Solar das Palmeiras', cidade: 'Belo Horizonte', regiaoId: 'bh-centro-sul', ultimoChamado: '02/07', score: 24, acao: 'Sem ação' },
  { rank: 14, elevador: 'Elevador 01', rg: 'ES-2210', condominio: 'Solar das Palmeiras', cidade: 'Belo Horizonte', regiaoId: 'bh-centro-sul', ultimoChamado: '28/06', score: 18, acao: 'Sem ação' },
]

// ---------- App do técnico ----------
export const chamadosUrgentes = [
  {
    id: 'ch-01',
    local: 'Torre A · Elevador 2',
    rg: 'ES-1024',
    causa: 'Motor',
    confianca: 78,
    urgencia: 'Alta',
    distancia: '0,8 km',
    sla: 'SLA 4h',
    causas: [
      { nome: 'Motor', probabilidade: 78 },
      { nome: 'Freio', probabilidade: 14 },
    ],
    pecas: ['Motor X34', 'Rolamento'],
    nota: 'Barulho metálico e paradas entre andares. Preventiva atrasada em 3 meses — leve peças de rolamento.',
  },
  {
    id: 'ch-02',
    local: 'Torre B · Elevador 1',
    rg: 'ES-1025',
    causa: 'Freio',
    confianca: 65,
    urgencia: 'Média',
    distancia: '1,3 km',
    sla: 'SLA 8h',
    causas: [
      { nome: 'Freio', probabilidade: 65 },
      { nome: 'Sensor', probabilidade: 22 },
    ],
    pecas: ['Pastilha de freio', 'Graxa MP2'],
    nota: 'Porta não abre no térreo. Histórico de 6 chamados em 12 meses — considere inspeção completa.',
  },
  {
    id: 'ch-03',
    local: 'Aurora · Elevador 3',
    rg: 'ES-3305',
    causa: 'Sensor de porta',
    confianca: 54,
    urgencia: 'Média',
    distancia: '2,7 km',
    sla: 'SLA 8h',
    causas: [
      { nome: 'Sensor de porta', probabilidade: 54 },
      { nome: 'Placa de comando', probabilidade: 31 },
    ],
    pecas: ['Sensor óptico', 'Kit completo'],
    nota: 'Diagnóstico inconclusivo — leve o kit completo. Elevador sem retrofit, sem telemetria disponível.',
  },
]

export const preventivas = [
  { dia: '15', mes: 'SET', titulo: 'Troca de óleo', local: 'Bloco A · ES-1023', hora: '09:00', duracao: '~1h30' },
  { dia: '18', mes: 'SET', titulo: 'Inspeção', local: 'Bloco C · ES-1030', hora: '14:00', duracao: '~2h' },
  { dia: '22', mes: 'SET', titulo: 'Cabos e roldanas', local: 'Aurora · ES-3305', hora: '08:30', duracao: '~3h' },
  { dia: '29', mes: 'SET', titulo: 'Teste de freio', local: 'Solar · ES-2210', hora: '10:00', duracao: '~1h' },
]

export const pecasDisponiveis = ['Rolamento', 'Graxa MP2', 'Motor X34', 'Sensor óptico', 'Pastilha de freio', 'Cabo de aço']
