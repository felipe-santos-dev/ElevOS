import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { NivelBadge, ProbBar, Toast } from '../../components/UI'
import { LogoMark } from '../../components/Logo'
import { IconBox, IconCheck, IconCheckCircle, IconInfo, IconX } from '../../components/Icons'
import { pecasPorCausa, perguntas, RESPOSTAS_PADRAO } from '../../data/mock'
import { calcularDiagnostico, explicarDiagnostico, nivelConfianca } from '../../utils/diagnostico'
import { buscarElevador } from '../../utils/elevadores'
import { useChamados } from '../../state/ChamadosContext'

const LABEL = { sim: 'Sim', nao: 'Não', 'nao-sei': 'Não sei' }

function MarcaResposta({ valor }) {
  if (valor === 'sim') return <IconCheck className="w-4 h-4 shrink-0 text-emerald-600" />
  if (valor === 'nao') return <IconX className="w-4 h-4 shrink-0 text-rose-500" />
  return <span className="w-4 shrink-0 text-center text-[13px] font-bold text-slate-400">?</span>
}

// Mesma tela para síndico e Central — só muda o que acontece ao
// confirmar: o síndico já envia o chamado, a Central segue para
// escolher o técnico responsável.
export default function Diagnostico({ origem = 'sindico' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const [enviado, setEnviado] = useState(false)
  const { abrirChamado } = useChamados()

  const rg = params.get('rg') ?? 'ES-1024'
  const el = buscarElevador(rg) ?? buscarElevador('ES-1024')
  const respostas = location.state?.respostas ?? RESPOSTAS_PADRAO
  const rotaPerguntas = origem === 'central' ? '/central/chamados/novo' : '/sindico/chamados/novo'
  const rotaRaiz = origem === 'central' ? '/central/elevadores' : '/sindico'

  const diagnostico = useMemo(() => calcularDiagnostico(perguntas, respostas), [respostas])
  const nivel = nivelConfianca(diagnostico.confianca)
  const causaTop = diagnostico.causas[0]
  const peca = pecasPorCausa[causaTop?.nome] ?? pecasPorCausa.Motor

  const explicacao = useMemo(() => explicarDiagnostico(diagnostico, nivel), [diagnostico, nivel])

  const tons = ['otis', 'soft', 'faint']

  const confirmar = () => {
    if (origem === 'central') {
      navigate(`/central/chamados/novo/atribuir?rg=${rg}`, { state: { respostas } })
      return
    }
    abrirChamado({
      local: el.local,
      rg: el.rg,
      causa: causaTop?.nome,
      confianca: diagnostico.confianca,
      causas: diagnostico.causas,
      pecas: [peca.nome],
      nota: explicacao,
      origem: 'sindico',
    })
    setEnviado(true)
    setTimeout(() => navigate('/sindico'), 1800)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast show={enviado}>
        <IconCheckCircle className="w-5 h-5 shrink-0" />
        Chamado enviado · a Central já recebeu o diagnóstico
      </Toast>

      <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <Link to={rotaRaiz} aria-label="ElevOS" className="shrink-0">
          <LogoMark className="w-8 h-8" />
        </Link>
        <span className="h-6 w-px bg-slate-200" />
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight">Diagnóstico</p>
          <p className="truncate text-[13px] text-ink-500">
            {el.local} · RG {el.rg}
          </p>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_380px]">
          {/* Coluna esquerda */}
          <div className="space-y-4">
            {/* Confiança */}
            <section className="animate-fade-up rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <IconCheck className="w-6 h-6" />
                </span>
                <div>
                  <p className="text-2xl font-extrabold leading-none tracking-tight sm:text-[32px]">
                    {diagnostico.confianca ?? 0}%
                    <span className="ml-2 align-middle text-sm font-semibold text-ink-700">de confiança</span>
                  </p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-700">
                    <NivelBadge confianca={diagnostico.confianca} />
                    <span>{diagnostico.respondidas} de {diagnostico.totalPerguntas} respostas analisadas</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Probabilidades */}
            <section className="card animate-fade-up p-5" style={{ animationDelay: '80ms' }}>
              <h2 className="text-[15px] font-bold">Probabilidades por causa</h2>
              <ul className="mt-4 space-y-3.5">
                {diagnostico.causas.map((c, i) => (
                  <li key={c.nome} className="grid grid-cols-[72px_1fr_44px] items-center gap-3 sm:grid-cols-[88px_1fr_48px]">
                    <span className="truncate text-[13px] font-medium">{c.nome}</span>
                    <ProbBar value={c.probabilidade} tone={tons[i] ?? 'faint'} delay={i * 120} />
                    <span className="text-right text-[13px] font-bold tabular-nums">{c.probabilidade}%</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Explicabilidade */}
            <section
              className="animate-fade-up rounded-xl border border-otis-200 bg-otis-50 p-5 border-l-4 border-l-otis-600"
              style={{ animationDelay: '160ms' }}
            >
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-otis-900">
                <IconInfo className="w-4 h-4 shrink-0" />
                Por que este diagnóstico
              </h2>
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-700">{explicacao}</p>
            </section>
          </div>

          {/* Coluna direita */}
          <div className="space-y-4">
            <section className="card animate-fade-up p-5" style={{ animationDelay: '60ms' }}>
              <p className="text-[13px] text-ink-500">Peça sugerida</p>
              <p className="mt-2 flex items-center gap-2.5 text-[17px] font-bold">
                <IconBox className="w-5 h-5 shrink-0 text-ink-500" />
                {peca.nome}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  {peca.estoque}
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-ink-700">
                  {peca.servico}
                </span>
              </div>
            </section>

            <section className="card animate-fade-up p-5" style={{ animationDelay: '120ms' }}>
              <h2 className="text-[15px] font-bold">Suas respostas</h2>
              <ul className="mt-3 space-y-2.5">
                {perguntas.map((p) => {
                  const v = respostas[p.id] ?? 'nao-sei'
                  return (
                    <li key={p.id} className="flex items-center gap-2.5">
                      <MarcaResposta valor={v} />
                      <span className="flex-1 truncate text-[13px] text-ink-700">{p.resumo}</span>
                      <span
                        className={`text-[13px] font-bold ${
                          v === 'sim' ? 'text-emerald-600' : v === 'nao' ? 'text-rose-500' : 'text-slate-400'
                        }`}
                      >
                        {LABEL[v]}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>

            <button onClick={confirmar} disabled={enviado} className="btn-primary btn-lg w-full">
              {enviado ? 'Enviando…' : origem === 'central' ? 'Avançar para atribuição' : 'Confirmar e enviar chamado'}
            </button>
            <Link to={`${rotaPerguntas}?rg=${rg}`} className="btn-ghost btn-md w-full">
              Refazer as perguntas
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
