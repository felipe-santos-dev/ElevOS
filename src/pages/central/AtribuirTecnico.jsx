import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { NivelBadge, Toast } from '../../components/UI'
import { LogoMark } from '../../components/Logo'
import { IconCheck, IconCheckCircle, IconChevronLeft } from '../../components/Icons'
import { PECAS_POR_FALHA, RESPOSTAS_PADRAO, perguntas, tecnicos } from '../../data/mock'
import { calcularDiagnostico, explicarDiagnostico, nivelConfianca, sugerirPecas } from '../../utils/diagnostico'
import { buscarElevador } from '../../utils/elevadores'
import { useChamados } from '../../state/ChamadosContext'

// Duas rotas levam aqui:
//   /central/chamados/novo/atribuir?rg=...   -> a Central está abrindo um chamado novo
//   /central/chamados/:id/aceitar            -> a Central está aceitando um chamado
//                                                já aberto (ex: pelo síndico) e escolhendo o técnico
export default function AtribuirTecnico() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [params] = useSearchParams()
  const { chamados, abrirChamado, aceitarChamado } = useChamados()
  const [selecionado, setSelecionado] = useState(null)
  const [enviado, setEnviado] = useState(false)

  const modoAceitar = Boolean(id)
  const chamadoExistente = modoAceitar ? chamados.find((c) => c.id === id) : null

  const rg = params.get('rg')
  const respostas = location.state?.respostas ?? RESPOSTAS_PADRAO

  // No modo "aceitar" o diagnóstico já foi calculado quando o chamado
  // foi aberto — usamos os dados que já estão salvos nele. No modo
  // "novo" calculamos na hora, a partir das respostas do questionário.
  const diagnosticoCalculado = useMemo(() => calcularDiagnostico(perguntas, respostas), [respostas])
  const el = modoAceitar ? null : rg ? buscarElevador(rg) : null

  const diagnostico = modoAceitar
    ? { causas: chamadoExistente?.causas ?? [], confianca: chamadoExistente?.confianca ?? null }
    : diagnosticoCalculado
  const nivel = nivelConfianca(diagnostico.confianca)
  const causaTop = diagnostico.causas[0]
  const pecasSugeridas = useMemo(() => sugerirPecas(diagnostico, nivel, PECAS_POR_FALHA), [diagnostico, nivel])
  const explicacao = useMemo(() => explicarDiagnostico(diagnosticoCalculado, nivelConfianca(diagnosticoCalculado.confianca)), [diagnosticoCalculado])

  const cargaPorTecnico = useMemo(() => {
    const mapa = {}
    chamados.forEach((c) => {
      if (c.status !== 'concluido') mapa[c.tecnicoId] = (mapa[c.tecnicoId] ?? 0) + 1
    })
    return mapa
  }, [chamados])

  if (modoAceitar) {
    // Chamado inexistente, já concluído ou já atribuído: nada a aceitar aqui.
    if (!chamadoExistente || chamadoExistente.tecnicoId) return <Navigate to="/central/chamados" replace />
  } else if (!el) {
    return <Navigate to="/central/elevadores" replace />
  }

  const local = modoAceitar ? chamadoExistente.local : el.local
  const rgExibido = modoAceitar ? chamadoExistente.rg : el.rg
  const titulo = modoAceitar ? 'Aceitar chamado' : 'Atribuir técnico'

  const confirmar = () => {
    const tecnico = tecnicos.find((t) => t.id === selecionado)
    if (!tecnico) return

    if (modoAceitar) {
      aceitarChamado(chamadoExistente.id, tecnico.id, tecnico.nome)
    } else {
      abrirChamado({
        local: el.local,
        rg: el.rg,
        causa: causaTop?.nome,
        confianca: diagnostico.confianca,
        causas: diagnostico.causas,
        pecas: pecasSugeridas,
        nota: explicacao,
        tecnicoId: tecnico.id,
        tecnicoNome: tecnico.nome,
        origem: 'central',
      })
    }

    setEnviado(true)
    setTimeout(() => navigate('/central/chamados'), 1800)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast show={enviado}>
        <IconCheckCircle className="w-5 h-5 shrink-0" />
        {modoAceitar ? 'Chamado aceito · o técnico já foi notificado' : 'Chamado aberto e atribuído · o técnico já foi notificado'}
      </Toast>

      <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <Link to="/central/elevadores" aria-label="ElevOS" className="flex shrink-0 items-center gap-2.5">
          <LogoMark className="w-8 h-8" />
        </Link>
        <button
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-100"
        >
          <IconChevronLeft className="w-5 h-5" />
        </button>
        <span className="h-6 w-px bg-slate-200" />
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight">{titulo}</p>
          <p className="truncate text-[13px] text-ink-500">
            {local} · RG {rgExibido}
          </p>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl">
          <section className="card animate-fade-up p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[15px] font-bold">Resumo do chamado</h2>
              <NivelBadge confianca={diagnostico.confianca} />
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
              {causaTop && diagnostico.confianca !== null
                ? `Causa mais provável: ${causaTop.nome} (${causaTop.confianca}%).`
                : 'Sem sintomas conclusivos — avaliação no local será necessária.'}
            </p>
            {modoAceitar && chamadoExistente.nota && (
              <p className="mt-2 rounded-lg bg-otis-50 p-3 text-[13px] leading-relaxed text-ink-700">{chamadoExistente.nota}</p>
            )}
          </section>

          <h2 className="mt-6 text-[15px] font-bold">Selecione o técnico responsável</h2>
          <p className="mt-1 text-[13px] text-ink-500">A carga atual mostra os chamados ainda não concluídos.</p>

          <ul className="mt-3 space-y-2.5">
            {tecnicos.map((t) => {
              const ativo = selecionado === t.id
              const carga = cargaPorTecnico[t.id] ?? 0
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setSelecionado(t.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border bg-white p-4 text-left transition-all ${
                      ativo ? 'border-otis-600 ring-1 ring-otis-600' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold">{t.nome}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-500">
                        {t.regiao} · {t.especialidade}
                      </span>
                      <span className="mt-1 block text-[13px] text-ink-500">
                        {carga} {carga === 1 ? 'chamado ativo' : 'chamados ativos'}
                      </span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        ativo ? 'bg-otis-900 text-white' : 'bg-slate-100 text-transparent'
                      }`}
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            onClick={confirmar}
            disabled={!selecionado || enviado}
            className="btn-primary btn-lg mt-6 w-full"
          >
            {enviado ? 'Enviando…' : modoAceitar ? 'Aceitar e atribuir técnico' : 'Atribuir e abrir chamado'}
          </button>
        </div>
      </main>
    </div>
  )
}
