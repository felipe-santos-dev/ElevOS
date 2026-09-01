import { createContext, useContext, useMemo, useState } from 'react'
import { chamadosUrgentes as chamadosIniciais } from '../data/mock'

// ============================================================
// Estado compartilhado dos chamados (mock, sem back-end).
// Guarda o ciclo: aberto -> atribuído -> a caminho -> concluído.
// Síndico e Central abrem chamados aqui; o técnico só enxerga
// (e só avança) os que estão atribuídos a ele.
// ============================================================

export const STATUS_STEPS = [
  { key: 'aberto', label: 'Chamado aberto' },
  { key: 'atribuido', label: 'Técnico atribuído' },
  { key: 'a-caminho', label: 'Técnico a caminho' },
  { key: 'concluido', label: 'Concluído' },
]

const ChamadosContext = createContext(null)

let sequencial = 0

export function ChamadosProvider({ children }) {
  const [chamados, setChamados] = useState(() =>
    chamadosIniciais.map((c) => ({ feedback: null, ...c })),
  )
  // Chamados cujo alerta de "novo chamado" a Central já dispensou nesta
  // sessão — evita que o mesmo popup volte a cada navegação.
  const [alertasVistos, setAlertasVistos] = useState(() => new Set())

  // Sem técnico informado na abertura, o chamado fica "aberto" e sem
  // atribuição — a Central precisa aceitá-lo e escolher o técnico
  // (é o caso do síndico, que nunca escolhe técnico). Quando o técnico
  // já vem definido (fluxo em que a própria Central atribui na hora de
  // abrir), o chamado nasce direto como "atribuído".
  const abrirChamado = (dados) => {
    sequencial += 1
    const temTecnico = Boolean(dados.tecnicoId)
    const novo = {
      id: `ch-${Date.now()}-${sequencial}`,
      local: dados.local,
      rg: dados.rg,
      causa: dados.causa ?? dados.causas?.[0]?.nome ?? 'A investigar',
      confianca: dados.confianca ?? null,
      urgencia: dados.urgencia ?? 'Média',
      distancia: dados.distancia ?? '—',
      sla: dados.sla ?? 'SLA 8h',
      causas: dados.causas ?? [],
      pecas: dados.pecas ?? [],
      nota: dados.nota ?? 'Chamado aberto manualmente pela Central OTIS.',
      abertoEm: dados.abertoEm ?? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tecnicoId: dados.tecnicoId ?? null,
      tecnicoNome: dados.tecnicoNome ?? null,
      status: temTecnico ? 'atribuido' : 'aberto',
      feedback: null,
      origem: dados.origem ?? 'central',
    }
    setChamados((lista) => [novo, ...lista])
    return novo
  }

  // A Central aceita um chamado em aberto (do síndico, por exemplo) e
  // escolhe o técnico responsável — só então ele entra na fila do técnico.
  const aceitarChamado = (id, tecnicoId, tecnicoNome) =>
    setChamados((lista) =>
      lista.map((c) => (c.id === id ? { ...c, tecnicoId, tecnicoNome, status: 'atribuido' } : c)),
    )

  const confirmarSaida = (id) =>
    setChamados((lista) =>
      lista.map((c) => (c.id === id && c.status !== 'concluido' ? { ...c, status: 'a-caminho' } : c)),
    )

  const salvarFeedback = (id, feedback) =>
    setChamados((lista) => lista.map((c) => (c.id === id ? { ...c, status: 'concluido', feedback } : c)))

  const marcarAlertaVisto = (id) => setAlertasVistos((vistos) => new Set(vistos).add(id))

  const value = useMemo(
    () => ({ chamados, abrirChamado, aceitarChamado, confirmarSaida, salvarFeedback, alertasVistos, marcarAlertaVisto }),
    [chamados, alertasVistos],
  )

  return <ChamadosContext.Provider value={value}>{children}</ChamadosContext.Provider>
}

export function useChamados() {
  const ctx = useContext(ChamadosContext)
  if (!ctx) throw new Error('useChamados deve ser usado dentro de <ChamadosProvider>')
  return ctx
}
