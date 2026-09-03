// ============================================================
// Motor de diagnóstico (mock, sem back-end).
// Reproduz em JavaScript a mesma conta de motor_simulacao.py: cada
// pergunta tem um peso para cada uma das 6 falhas; "sim" soma o
// peso, "não" subtrai o peso, "não sei" não altera nada. Depois
// zeramos as pontuações negativas (uma falha não pode pesar menos
// que nada) e dividimos pela soma das pontuações positivas para
// chegar na confiança (%) de cada falha.
// ============================================================

// Limite de confiança a partir do qual já consideramos "Certeza" —
// mesmo valor de LIMITE_CERTEZA em motor_simulacao.py, usado tanto
// na classificação final quanto na parada antecipada do questionário.
export const LIMITE_CERTEZA = 80

// Faixas de confiança pedidas pelo negócio (iguais às de motor_simulacao.py):
// 80% ou mais  -> certeza
// 65% a 79%    -> provável
// 40% a 64%    -> dúvida
// < 40%        -> incerteza
export function nivelConfianca(confianca) {
  if (confianca == null) return { chave: 'sem-dados', label: 'Sem diagnóstico', cor: 'slate' }
  if (confianca >= LIMITE_CERTEZA) return { chave: 'certeza', label: 'Certeza', cor: 'emerald' }
  if (confianca >= 65) return { chave: 'provavel', label: 'Provável', cor: 'otis' }
  if (confianca >= 40) return { chave: 'duvida', label: 'Dúvida', cor: 'amber' }
  return { chave: 'incerteza', label: 'Incerteza', cor: 'slate' }
}

export function calcularDiagnostico(perguntas, respostas, falhas) {
  const listaFalhas = falhas ?? Object.keys(perguntas[0]?.pesos ?? {})

  const pontuacao = {}
  listaFalhas.forEach((falha) => {
    pontuacao[falha] = 0
  })

  perguntas.forEach((p) => {
    const valor = respostas[p.id]
    const fator = valor === 'sim' ? 1 : valor === 'nao' ? -1 : 0
    listaFalhas.forEach((falha) => {
      pontuacao[falha] += (p.pesos[falha] ?? 0) * fator
    })
  })

  const pontuacoesPositivas = {}
  listaFalhas.forEach((falha) => {
    pontuacoesPositivas[falha] = pontuacao[falha] > 0 ? pontuacao[falha] : 0
  })
  const totalPositivo = Object.values(pontuacoesPositivas).reduce((a, b) => a + b, 0)

  const causas = listaFalhas
    .map((nome) => ({
      nome,
      confianca: totalPositivo > 0 ? Math.round((pontuacoesPositivas[nome] / totalPositivo) * 100) : 0,
    }))
    .sort((a, b) => b.confianca - a.confianca)

  const respondidas = perguntas.filter((p) => respostas[p.id] != null).length
  const confianca = respondidas === 0 ? null : causas[0]?.confianca ?? 0

  return { causas, confianca, respondidas, totalPerguntas: perguntas.length }
}

// Sugestão de peças por faixa de confiança — mesma regra de _sugerir_pecas()
// em motor_simulacao.py:
//   Certeza   -> só as peças da falha principal
//   Provável  -> peças da falha principal + da secundária
//   Dúvida    -> peças da principal + secundária, limitado a 3-4 itens
//   Incerteza -> "kit completo" (peças de todas as falhas, sem repetir)
export function sugerirPecas(diagnostico, nivel, pecasPorFalha) {
  const [principal, secundaria] = diagnostico.causas
  if (!principal || diagnostico.confianca === null) return []

  if (nivel.chave === 'certeza') {
    return [...pecasPorFalha[principal.nome]]
  }

  if (nivel.chave === 'provavel' || nivel.chave === 'duvida') {
    const pecas = [...pecasPorFalha[principal.nome]]
    if (secundaria) {
      pecasPorFalha[secundaria.nome].forEach((peca) => {
        if (!pecas.includes(peca)) pecas.push(peca)
      })
    }
    return nivel.chave === 'duvida' ? pecas.slice(0, 4) : pecas
  }

  // Incerteza (ou qualquer outro caso): kit completo, com as peças de
  // todas as falhas, sem repetir.
  const kitCompleto = []
  Object.values(pecasPorFalha).forEach((pecasDaFalha) => {
    pecasDaFalha.forEach((peca) => {
      if (!kitCompleto.includes(peca)) kitCompleto.push(peca)
    })
  })
  return kitCompleto
}

// Texto de explicabilidade — usado no diagnóstico do síndico e na
// tela de atribuição da Central, para manter a mesma leitura do resultado.
export function explicarDiagnostico(diagnostico, nivel) {
  const [primeira, segunda] = diagnostico.causas
  if (!primeira || diagnostico.confianca === null) {
    return 'Nenhuma resposta indicou sintomas claros — não é possível apontar uma causa provável ainda.'
  }
  const partes = [
    `${diagnostico.respondidas} de ${diagnostico.totalPerguntas} perguntas analisadas apontam ${primeira.nome.toLowerCase()} como causa mais provável, com ${primeira.confianca}% de peso entre as hipóteses.`,
  ]
  if (segunda && segunda.confianca > 0) {
    partes.push(`${segunda.nome} aparece em seguida, com ${segunda.confianca}%.`)
  }
  partes.push(`Nível de confiança: ${nivel.label.toLowerCase()}.`)
  return partes.join(' ')
}
