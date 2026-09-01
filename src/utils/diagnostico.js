// ============================================================
// Motor de diagnóstico (mock, sem back-end).
// Cada pergunta tem uma causa associada e um peso; a partir das
// respostas calculamos a probabilidade de cada causa e a
// confiança final é a probabilidade da causa mais provável.
// ============================================================

// Faixas de confiança pedidas pelo negócio:
// > 85%        -> certeza
// 65% a 84%    -> provável
// 40% a 64%    -> dúvida
// < 40%        -> incerteza
export function nivelConfianca(confianca) {
  if (confianca == null) return { chave: 'sem-dados', label: 'Sem diagnóstico', cor: 'slate' }
  if (confianca > 85) return { chave: 'certeza', label: 'Certeza', cor: 'emerald' }
  if (confianca >= 65) return { chave: 'provavel', label: 'Provável', cor: 'otis' }
  if (confianca >= 40) return { chave: 'duvida', label: 'Dúvida', cor: 'amber' }
  return { chave: 'incerteza', label: 'Incerteza', cor: 'slate' }
}

export function calcularDiagnostico(perguntas, respostas) {
  const pontosPorCausa = {}
  const pesoPorCausa = {}

  perguntas.forEach((p) => {
    pesoPorCausa[p.causa] = (pesoPorCausa[p.causa] ?? 0) + p.peso
    const valor = respostas[p.id]
    const fator = valor === 'sim' ? 1 : valor === 'nao-sei' ? 0.5 : 0
    pontosPorCausa[p.causa] = (pontosPorCausa[p.causa] ?? 0) + p.peso * fator
  })

  const totalPontos = Object.values(pontosPorCausa).reduce((a, b) => a + b, 0)

  const causas = Object.keys(pesoPorCausa)
    .map((nome) => ({
      nome,
      probabilidade: totalPontos > 0 ? Math.round((pontosPorCausa[nome] / totalPontos) * 100) : 0,
    }))
    .sort((a, b) => b.probabilidade - a.probabilidade)

  const respondidas = perguntas.filter((p) => respostas[p.id] != null).length
  const confianca = respondidas === 0 ? null : causas[0]?.probabilidade ?? 0

  return { causas, confianca, respondidas, totalPerguntas: perguntas.length }
}

// Texto de explicabilidade — usado no diagnóstico do síndico e na
// tela de atribuição da Central, para manter a mesma leitura do resultado.
export function explicarDiagnostico(diagnostico, nivel) {
  const [primeira, segunda] = diagnostico.causas
  if (!primeira || diagnostico.confianca === null) {
    return 'Nenhuma resposta indicou sintomas claros — não é possível apontar uma causa provável ainda.'
  }
  const partes = [
    `${diagnostico.respondidas} de ${diagnostico.totalPerguntas} perguntas analisadas apontam ${primeira.nome.toLowerCase()} como causa mais provável, com ${primeira.probabilidade}% de peso entre as hipóteses.`,
  ]
  if (segunda && segunda.probabilidade > 0) {
    partes.push(`${segunda.nome} aparece em seguida, com ${segunda.probabilidade}%.`)
  }
  partes.push(`Nível de confiança: ${nivel.label.toLowerCase()}.`)
  return partes.join(' ')
}
