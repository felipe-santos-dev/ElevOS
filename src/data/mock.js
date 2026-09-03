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
    tecnologia: 'iot',
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
    tecnologia: 'iot',
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
    tecnologia: 'antigo',
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
// Banco fixo de 12 perguntas, igual ao motor_simulacao.py: cada
// pergunta tem um peso (0 a 3) para cada uma das 6 falhas possíveis.
// "sim" soma o peso, "não" subtrai o peso, "não sei" não altera nada
// (ver src/utils/diagnostico.js).
export const FALHAS = ['Motor', 'Freio', 'Porta', 'Sensor', 'Polia/Cabo', 'Contator Elétrico']

export const perguntas = [
  { id: 'P1', titulo: 'O elevador faz barulho metálico?', ajuda: 'Ouça durante a subida, com a cabine vazia', resumo: 'Barulho metálico', pesos: { Motor: 3, Freio: 1, Porta: 0, Sensor: 0, 'Polia/Cabo': 2, 'Contator Elétrico': 0 } },
  { id: 'P2', titulo: 'O elevador para com solavancos?', ajuda: 'Perceba se a cabine treme ou dá um solavanco ao parar no andar', resumo: 'Para com solavancos', pesos: { Motor: 2, Freio: 3, Porta: 0, Sensor: 1, 'Polia/Cabo': 1, 'Contator Elétrico': 0 } },
  { id: 'P3', titulo: 'A porta não abre ou trava?', ajuda: 'Teste no térreo e em mais um andar', resumo: 'Porta não abre ou trava', pesos: { Motor: 0, Freio: 0, Porta: 3, Sensor: 2, 'Polia/Cabo': 0, 'Contator Elétrico': 0 } },
  { id: 'P4', titulo: 'A porta fecha muito devagar?', ajuda: 'Compare com o tempo habitual de fechamento', resumo: 'Porta lenta ao fechar', pesos: { Motor: 0, Freio: 0, Porta: 2, Sensor: 0, 'Polia/Cabo': 0, 'Contator Elétrico': 0 } },
  { id: 'P5', titulo: 'Há cheiro de queimado?', ajuda: 'Verifique com cautela, sem se aproximar do quadro elétrico', resumo: 'Cheiro de queimado', pesos: { Motor: 1, Freio: 0, Porta: 0, Sensor: 0, 'Polia/Cabo': 0, 'Contator Elétrico': 3 } },
  { id: 'P6', titulo: 'A luz da cabine oscila?', ajuda: 'Observe com a porta fechada, em movimento', resumo: 'Luz da cabine oscila', pesos: { Motor: 0, Freio: 0, Porta: 1, Sensor: 0, 'Polia/Cabo': 0, 'Contator Elétrico': 0 } },
  { id: 'P7', titulo: 'O painel de andares apaga?', ajuda: 'Observe se os números do painel apagam ou piscam durante o percurso', resumo: 'Painel de andares apaga', pesos: { Motor: 0, Freio: 0, Porta: 0, Sensor: 3, 'Polia/Cabo': 0, 'Contator Elétrico': 0 } },
  { id: 'P8', titulo: 'O elevador vibra na subida?', ajuda: 'Perceptível ao encostar na parede da cabine', resumo: 'Vibração na subida', pesos: { Motor: 1, Freio: 0, Porta: 0, Sensor: 0, 'Polia/Cabo': 0, 'Contator Elétrico': 0 } },
  { id: 'P9', titulo: 'O freio faz ruído ao parar?', ajuda: 'Perceba no instante em que a cabine para', resumo: 'Freio faz ruído ao parar', pesos: { Motor: 0, Freio: 2, Porta: 0, Sensor: 0, 'Polia/Cabo': 0, 'Contator Elétrico': 0 } },
  { id: 'P10', titulo: 'O cabo está desgastado?', ajuda: 'Verifique o cabo de tração na casa de máquinas, se tiver acesso', resumo: 'Cabo desgastado', pesos: { Motor: 0, Freio: 0, Porta: 0, Sensor: 0, 'Polia/Cabo': 2, 'Contator Elétrico': 0 } },
  { id: 'P11', titulo: 'Há folga na polia?', ajuda: 'Observe se a polia balança ou tem folga perceptível', resumo: 'Folga na polia', pesos: { Motor: 0, Freio: 0, Porta: 0, Sensor: 0, 'Polia/Cabo': 1, 'Contator Elétrico': 0 } },
  { id: 'P12', titulo: 'O disjuntor desarma?', ajuda: 'Considere quedas de energia repentinas do elevador nos últimos dias', resumo: 'Disjuntor desarma', pesos: { Motor: 0, Freio: 0, Porta: 0, Sensor: 0, 'Polia/Cabo': 0, 'Contator Elétrico': 3 } },
]

export const TOTAL_PERGUNTAS_BANCO = perguntas.length

// Respostas padrão — usadas só quando a tela de Diagnóstico é
// aberta diretamente, sem vir do fluxo de perguntas.
export const RESPOSTAS_PADRAO = {
  P1: 'sim', P2: 'sim', P3: 'nao', P4: 'sim', P5: 'nao-sei',
  P6: 'nao', P7: 'nao', P8: 'nao', P9: 'nao-sei', P10: 'nao', P11: 'nao', P12: 'nao',
}

// ---------- Peças por falha (igual a PECAS_POR_FALHA em motor_simulacao.py) ----------
// Lista de peças individuais por falha — é a fonte usada por sugerirPecas()
// em src/utils/diagnostico.js para montar a lista certa por faixa de confiança.
export const PECAS_POR_FALHA = {
  Motor: ['Motor X34', 'Rolamento'],
  Freio: ['Pastilha de Freio', 'Sensor de Desgaste'],
  Porta: ['Atuador de Porta', 'Fechadura Elétrica'],
  Sensor: ['Sensor de Porta', 'Sensor de Presença'],
  'Polia/Cabo': ['Cabo de Aço', 'Polia', 'Lubrificante'],
  'Contator Elétrico': ['Contator', 'Fusível', 'Relé'],
}

// Peça (só da falha principal) com metadados de estoque/serviço — usada na
// caixa "Peça sugerida" das telas de diagnóstico. estoque/servico não existem
// no motor Python, são só apresentação; o nome vem de PECAS_POR_FALHA para
// nunca divergir da lista de peças de verdade.
export const pecasPorCausa = {
  Motor: { nome: PECAS_POR_FALHA.Motor.join(' + '), estoque: 'Em estoque', servico: '~2h de serviço' },
  Freio: { nome: PECAS_POR_FALHA.Freio.join(' + '), estoque: 'Em estoque', servico: '~1h30 de serviço' },
  Porta: { nome: PECAS_POR_FALHA.Porta.join(' + '), estoque: 'Em estoque', servico: '~1h de serviço' },
  Sensor: { nome: PECAS_POR_FALHA.Sensor.join(' + '), estoque: 'Sob encomenda', servico: '~2h30 de serviço' },
  'Polia/Cabo': { nome: PECAS_POR_FALHA['Polia/Cabo'].join(' + '), estoque: 'Sob encomenda', servico: '~3h de serviço' },
  'Contator Elétrico': { nome: PECAS_POR_FALHA['Contator Elétrico'].join(' + '), estoque: 'Em estoque', servico: '~1h30 de serviço' },
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
          { nome: 'Elevador 01', rg: 'ES-1023', status: 'normal', ultimoChamado: '27/08', tecnologia: 'iot' },
          { nome: 'Elevador 02', rg: 'ES-1024', status: 'manutencao', ultimoChamado: '25/08', tecnologia: 'iot' },
        ],
      },
      {
        nome: 'Bloco B',
        elevadores: [{ nome: 'Elevador 01', rg: 'ES-1025', status: 'aguardando', ultimoChamado: '20/08', tecnologia: 'antigo' }],
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
          { nome: 'Elevador 01', rg: 'ES-3301', status: 'manutencao', ultimoChamado: '22/08', tecnologia: 'antigo' },
          { nome: 'Elevador 03', rg: 'ES-3305', status: 'manutencao', ultimoChamado: '26/08', tecnologia: 'antigo' },
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
          { nome: 'Elevador 01', rg: 'ES-4101', status: 'normal', ultimoChamado: '05/08', tecnologia: 'iot' },
          { nome: 'Elevador 02', rg: 'ES-4102', status: 'aguardando', ultimoChamado: '18/08', tecnologia: 'antigo' },
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
          { nome: 'Elevador 04', rg: 'ES-5540', status: 'manutencao', ultimoChamado: '19/08', tecnologia: 'antigo' },
          { nome: 'Elevador 05', rg: 'ES-5544', status: 'normal', ultimoChamado: '09/08', tecnologia: 'iot' },
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
          { nome: 'Elevador 01', rg: 'ES-2210', status: 'normal', ultimoChamado: '28/06', tecnologia: 'iot' },
          { nome: 'Elevador 02', rg: 'ES-2211', status: 'normal', ultimoChamado: '02/07', tecnologia: 'iot' },
          { nome: 'Elevador 03', rg: 'ES-2212', status: 'normal', ultimoChamado: '14/07', tecnologia: 'antigo' },
        ],
      },
    ],
  },
]

// ---------- Risk Score ----------
export const riskScore = [
  {
    rank: 1, elevador: 'Elevador 03', rg: 'ES-3305', condominio: 'Edifício Aurora', cidade: 'São Paulo', regiaoId: 'sp-zona-sul',
    ultimoChamado: '26/08', score: 94, acao: 'Inspeção urgente', idade: 14, chamados12m: 9, tempoReparo: '5.8h',
    tendencia: 'subindo', variacao: 6, sparkline: [40, 52, 58, 70, 82, 94],
    detalhe: {
      ultimaManutencao: '22/06/2026 · troca de cabos', custoEstimado: 'R$ 4.200 – R$ 5.600',
      pecas: ['Motor X34', 'Rolamento'],
      plano: ['Inspeção urgente', 'Substituir motor e rolamento', 'Reavaliar contrato de manutenção'],
      historico: [
        { data: '26/08', titulo: 'Barulho metálico na subida', status: 'aberto' },
        { data: '14/08', titulo: 'Parada entre andares', status: 'resolvido' },
        { data: '02/07', titulo: 'Vibração na cabine', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 2, elevador: 'Elevador 02', rg: 'ES-1024', condominio: 'Vista Verde', cidade: 'São Paulo', regiaoId: 'sp-zona-sul',
    ultimoChamado: '27/08', score: 88, acao: 'Inspeção urgente', idade: 11, chamados12m: 8, tempoReparo: '5.2h',
    tendencia: 'subindo', variacao: 4, sparkline: [35, 44, 55, 66, 78, 88],
    detalhe: {
      ultimaManutencao: '28/11/2025 · troca de óleo', custoEstimado: 'R$ 3.100 – R$ 4.400',
      pecas: ['Motor X34', 'Rolamento'],
      plano: ['Inspeção urgente', 'Agendar troca de rolamento', 'Notificar síndico'],
      historico: [
        { data: '27/08', titulo: 'Barulho metálico na subida', status: 'aberto' },
        { data: '14/08', titulo: 'Porta lenta ao fechar', status: 'resolvido' },
        { data: '21/07', titulo: 'Botão sem resposta', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 3, elevador: 'Elevador 01', rg: 'ES-3301', condominio: 'Edifício Aurora', cidade: 'São Paulo', regiaoId: 'sp-zona-sul',
    ultimoChamado: '22/08', score: 84, acao: 'Agendar retrofit', idade: 14, chamados12m: 7, tempoReparo: '4.6h',
    tendencia: 'estavel', variacao: 0, sparkline: [80, 78, 82, 79, 83, 84],
    detalhe: {
      ultimaManutencao: '10/05/2026 · inspeção geral', custoEstimado: 'R$ 2.600 – R$ 3.800',
      pecas: ['Sensor de Porta', 'Sensor de Presença'],
      plano: ['Agendar retrofit', 'Revisar sensores de porta', 'Testar sistema de frenagem'],
      historico: [
        { data: '22/08', titulo: 'Pane elétrica', status: 'aberto' },
        { data: '30/06', titulo: 'Cabine desnivelada', status: 'resolvido' },
        { data: '18/05', titulo: 'Alarme dispara sozinho', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 4, elevador: 'Elevador 04', rg: 'ES-5540', condominio: 'Centro Comercial Rio', cidade: 'Rio de Janeiro', regiaoId: 'rj-zona-sul',
    ultimoChamado: '19/08', score: 79, acao: 'Agendar retrofit', idade: 9, chamados12m: 6, tempoReparo: '4.1h',
    tendencia: 'subindo', variacao: 3, sparkline: [60, 64, 68, 71, 75, 79],
    detalhe: {
      ultimaManutencao: '02/04/2026 · lubrificação', custoEstimado: 'R$ 1.800 – R$ 2.900',
      pecas: ['Pastilha de Freio', 'Sensor de Desgaste'],
      plano: ['Agendar retrofit', 'Inspecionar sistema de freios', 'Monitorar por 30 dias'],
      historico: [
        { data: '19/08', titulo: 'Cabine balança ao parar', status: 'aberto' },
        { data: '05/07', titulo: 'Freio range ao parar', status: 'resolvido' },
        { data: '22/05', titulo: 'Trepidação entre andares', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 5, elevador: 'Elevador 01', rg: 'ES-1025', condominio: 'Vista Verde', cidade: 'São Paulo', regiaoId: 'sp-zona-sul',
    ultimoChamado: '20/08', score: 73, acao: 'Trocar rolamento', idade: 6, chamados12m: 6, tempoReparo: '3.8h',
    tendencia: 'descendo', variacao: -2, sparkline: [81, 79, 77, 75, 74, 73],
    detalhe: {
      ultimaManutencao: '02/03/2026 · troca de peça', custoEstimado: 'R$ 1.500 – R$ 2.400',
      pecas: ['Motor X34', 'Rolamento'],
      plano: ['Trocar rolamento', 'Testar operação por 15 dias', 'Revisar contrato SLA'],
      historico: [
        { data: '26/08', titulo: 'Porta não abre no térreo', status: 'aberto' },
        { data: '20/08', titulo: 'Trepidação entre andares', status: 'resolvido' },
        { data: '05/07', titulo: 'Luz da cabine oscilando', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 6, elevador: 'Elevador 02', rg: 'ES-4102', condominio: 'Residencial Pico', cidade: 'São Paulo', regiaoId: 'sp-zona-norte',
    ultimoChamado: '18/08', score: 68, acao: 'Agendar retrofit', idade: 8, chamados12m: 5, tempoReparo: '3.5h',
    tendencia: 'subindo', variacao: 2, sparkline: [56, 59, 62, 65, 66, 68],
    detalhe: {
      ultimaManutencao: '14/02/2026 · revisão elétrica', custoEstimado: 'R$ 1.200 – R$ 2.000',
      pecas: ['Sensor de Porta'],
      plano: ['Agendar retrofit', 'Avaliar upgrade IoT', 'Acompanhar chamados recorrentes'],
      historico: [
        { data: '18/08', titulo: 'Elevador reinicia sozinho', status: 'aberto' },
        { data: '29/06', titulo: 'Luz da cabine oscila', status: 'resolvido' },
        { data: '11/05', titulo: 'Ruído leve na descida', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 7, elevador: 'Elevador 01', rg: 'ES-6820', condominio: 'Parque das Flores', cidade: 'São Paulo', regiaoId: 'sp-zona-norte',
    ultimoChamado: '11/08', score: 64, acao: 'Antecipar preventiva', idade: 5, chamados12m: 4, tempoReparo: '2.9h',
    tendencia: 'estavel', variacao: 0, sparkline: [62, 65, 63, 64, 63, 64],
    detalhe: {
      ultimaManutencao: '08/01/2026 · inspeção', custoEstimado: 'R$ 900 – R$ 1.600',
      pecas: ['Pastilha de Freio'],
      plano: ['Antecipar preventiva', 'Confirmar troca de pastilha', 'Encerrar acompanhamento'],
      historico: [
        { data: '11/08', titulo: 'Ruído leve na descida', status: 'resolvido' },
        { data: '30/05', titulo: 'Porta lenta ao abrir', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 8, elevador: 'Elevador 05', rg: 'ES-5544', condominio: 'Centro Comercial Rio', cidade: 'Rio de Janeiro', regiaoId: 'rj-zona-sul',
    ultimoChamado: '09/08', score: 58, acao: 'Antecipar preventiva', idade: 10, chamados12m: 4, tempoReparo: '2.6h',
    tendencia: 'descendo', variacao: -3, sparkline: [68, 65, 62, 60, 59, 58],
    detalhe: {
      ultimaManutencao: '30/01/2026 · troca de óleo', custoEstimado: 'R$ 1.000 – R$ 1.800',
      pecas: ['Cabo de Aço', 'Lubrificante'],
      plano: ['Antecipar preventiva', 'Confirmar peças em estoque', 'Reavaliar em 60 dias'],
      historico: [
        { data: '09/08', titulo: 'Vibração leve na subida', status: 'resolvido' },
        { data: '02/06', titulo: 'Cabine desnivelada', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 9, elevador: 'Elevador 01', rg: 'ES-4101', condominio: 'Residencial Pico', cidade: 'São Paulo', regiaoId: 'sp-zona-norte',
    ultimoChamado: '05/08', score: 51, acao: 'Monitorar', idade: 7, chamados12m: 3, tempoReparo: '2.3h',
    tendencia: 'subindo', variacao: 1, sparkline: [46, 47, 48, 49, 50, 51],
    detalhe: {
      ultimaManutencao: '19/12/2025 · lubrificação', custoEstimado: 'R$ 800 – R$ 1.400',
      pecas: ['Cabo de Aço'],
      plano: ['Monitorar', 'Agendar inspeção de rotina', 'Confirmar contrato SLA'],
      historico: [
        { data: '05/08', titulo: 'Botão sem resposta', status: 'resolvido' },
        { data: '22/06', titulo: 'Ruído leve na descida', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 10, elevador: 'Elevador 02', rg: 'ES-6821', condominio: 'Parque das Flores', cidade: 'São Paulo', regiaoId: 'sp-zona-norte',
    ultimoChamado: '31/07', score: 44, acao: 'Monitorar', idade: 4, chamados12m: 3, tempoReparo: '2.0h',
    tendencia: 'estavel', variacao: 0, sparkline: [42, 45, 43, 44, 43, 44],
    detalhe: {
      ultimaManutencao: '05/12/2025 · revisão geral', custoEstimado: 'R$ 700 – R$ 1.200',
      pecas: ['Rolamento'],
      plano: ['Monitorar', 'Confirmar peças disponíveis', 'Agendar inspeção trimestral'],
      historico: [
        { data: '31/07', titulo: 'Antecipar preventiva', status: 'resolvido' },
        { data: '15/04', titulo: 'Ruído leve na descida', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 11, elevador: 'Elevador 01', rg: 'ES-1023', condominio: 'Vista Verde', cidade: 'São Paulo', regiaoId: 'sp-zona-sul',
    ultimoChamado: '21/07', score: 37, acao: 'Monitorar', idade: 9, chamados12m: 3, tempoReparo: '1.8h',
    tendencia: 'descendo', variacao: -2, sparkline: [42, 40, 39, 38, 37, 37],
    detalhe: {
      ultimaManutencao: '28/11/2025 · troca de óleo', custoEstimado: 'R$ 600 – R$ 1.100',
      pecas: [],
      plano: ['Monitorar', 'Sem ação urgente prevista'],
      historico: [
        { data: '21/07', titulo: 'Botão do 4º andar sem resposta', status: 'resolvido' },
        { data: '12/05', titulo: 'Porta lenta ao abrir', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 12, elevador: 'Elevador 03', rg: 'ES-2212', condominio: 'Solar das Palmeiras', cidade: 'Belo Horizonte', regiaoId: 'bh-centro-sul',
    ultimoChamado: '14/07', score: 29, acao: 'Sem ação', idade: 5, chamados12m: 2, tempoReparo: '1.5h',
    tendencia: 'estavel', variacao: 0, sparkline: [30, 28, 29, 30, 29, 29],
    detalhe: {
      ultimaManutencao: '20/09/2025 · inspeção geral', custoEstimado: 'R$ 400 – R$ 800',
      pecas: [],
      plano: ['Sem ação urgente prevista'],
      historico: [
        { data: '14/07', titulo: 'Ruído leve na descida', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 13, elevador: 'Elevador 02', rg: 'ES-2211', condominio: 'Solar das Palmeiras', cidade: 'Belo Horizonte', regiaoId: 'bh-centro-sul',
    ultimoChamado: '02/07', score: 24, acao: 'Sem ação', idade: 4, chamados12m: 2, tempoReparo: '1.4h',
    tendencia: 'descendo', variacao: -1, sparkline: [27, 26, 25, 25, 24, 24],
    detalhe: {
      ultimaManutencao: '02/09/2025 · lubrificação', custoEstimado: 'R$ 400 – R$ 800',
      pecas: [],
      plano: ['Sem ação urgente prevista'],
      historico: [
        { data: '02/07', titulo: 'Porta trava ao abrir', status: 'resolvido' },
      ],
    },
  },
  {
    rank: 14, elevador: 'Elevador 01', rg: 'ES-2210', condominio: 'Solar das Palmeiras', cidade: 'Belo Horizonte', regiaoId: 'bh-centro-sul',
    ultimoChamado: '28/06', score: 18, acao: 'Sem ação', idade: 3, chamados12m: 1, tempoReparo: '1.2h',
    tendencia: 'estavel', variacao: 0, sparkline: [19, 18, 19, 18, 18, 18],
    detalhe: {
      ultimaManutencao: '15/08/2025 · inspeção geral', custoEstimado: 'R$ 300 – R$ 600',
      pecas: [],
      plano: ['Sem ação urgente prevista'],
      historico: [
        { data: '28/06', titulo: 'Vibração leve na subida', status: 'resolvido' },
      ],
    },
  },
]

// ---------- Técnicos disponíveis para atribuição (Central) ----------
export const tecnicos = [
  { id: 'u-03', nome: 'Rafael Silva', iniciais: 'RS', regiao: 'Zona Sul', especialidade: 'Motor e tração' },
  { id: 'u-04', nome: 'Bruno Alves', iniciais: 'BA', regiao: 'Zona Sul', especialidade: 'Portas e sensores' },
  { id: 'u-05', nome: 'Camila Rocha', iniciais: 'CR', regiao: 'Zona Norte', especialidade: 'Freios e nivelamento' },
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
      { nome: 'Motor', confianca: 78 },
      { nome: 'Freio', confianca: 14 },
    ],
    pecas: ['Motor X34', 'Rolamento', 'Pastilha de Freio', 'Sensor de Desgaste'],
    nota: 'Barulho metálico e paradas entre andares. Preventiva atrasada em 3 meses — leve peças de rolamento.',
    abertoEm: '08:14',
    tecnicoId: 'u-03',
    tecnicoNome: 'Rafael Silva',
    status: 'atribuido',
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
      { nome: 'Freio', confianca: 65 },
      { nome: 'Sensor', confianca: 22 },
    ],
    pecas: ['Pastilha de Freio', 'Sensor de Desgaste', 'Sensor de Porta', 'Sensor de Presença'],
    nota: 'Porta não abre no térreo. Histórico de 6 chamados em 12 meses — considere inspeção completa.',
    abertoEm: '17:40',
    tecnicoId: 'u-03',
    tecnicoNome: 'Rafael Silva',
    status: 'atribuido',
  },
  {
    id: 'ch-03',
    local: 'Aurora · Elevador 3',
    rg: 'ES-3305',
    causa: 'Sensor',
    confianca: 54,
    urgencia: 'Média',
    distancia: '2,7 km',
    sla: 'SLA 8h',
    causas: [
      { nome: 'Sensor', confianca: 54 },
      { nome: 'Porta', confianca: 31 },
    ],
    pecas: ['Sensor de Porta', 'Sensor de Presença', 'Atuador de Porta', 'Fechadura Elétrica'],
    nota: 'Diagnóstico em dúvida — leve peças de sensor e de porta para cobrir as duas hipóteses. Elevador sem retrofit, sem telemetria disponível.',
    abertoEm: '14:10',
    tecnicoId: 'u-04',
    tecnicoNome: 'Bruno Alves',
    status: 'atribuido',
  },
]

export const preventivas = [
  { dia: '15', mes: 'SET', titulo: 'Troca de óleo', local: 'Bloco A · ES-1023', hora: '09:00', duracao: '~1h30' },
  { dia: '18', mes: 'SET', titulo: 'Inspeção', local: 'Bloco C · ES-1030', hora: '14:00', duracao: '~2h' },
  { dia: '22', mes: 'SET', titulo: 'Cabos e roldanas', local: 'Aurora · ES-3305', hora: '08:30', duracao: '~3h' },
  { dia: '29', mes: 'SET', titulo: 'Teste de freio', local: 'Solar · ES-2210', hora: '10:00', duracao: '~1h' },
]

export const pecasDisponiveis = ['Rolamento', 'Lubrificante', 'Motor X34', 'Sensor de Porta', 'Pastilha de Freio', 'Cabo de Aço']
