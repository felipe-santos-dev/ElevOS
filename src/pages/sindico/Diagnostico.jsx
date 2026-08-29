import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ProbBar, Toast } from '../../components/UI'
import { LogoMark } from '../../components/Logo'
import { IconBox, IconCheck, IconCheckCircle, IconInfo, IconX } from '../../components/Icons'
import { diagnostico, elevadores, perguntas } from '../../data/mock'

const LABEL = { sim: 'Sim', nao: 'Não', 'nao-sei': 'Não sei' }

function MarcaResposta({ valor }) {
  if (valor === 'sim') return <IconCheck className="w-4 h-4 shrink-0 text-emerald-600" />
  if (valor === 'nao') return <IconX className="w-4 h-4 shrink-0 text-rose-500" />
  return <span className="w-4 shrink-0 text-center text-[13px] font-bold text-slate-400">?</span>
}

export default function Diagnostico() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const [enviado, setEnviado] = useState(false)

  const rg = params.get('rg') ?? 'ES-1024'
  const el = elevadores.find((e) => e.rg === rg) ?? elevadores[1]
  const respostas = location.state?.respostas ?? { q1: 'sim', q2: 'sim', q3: 'nao', q4: 'sim', q5: 'nao-sei' }

  const confirmar = () => {
    setEnviado(true)
    setTimeout(() => navigate('/sindico'), 1800)
  }

  const tons = ['otis', 'soft', 'faint']

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast show={enviado}>
        <IconCheckCircle className="w-5 h-5 shrink-0" />
        Chamado enviado · a Central já recebeu o diagnóstico
      </Toast>

      <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <Link to="/sindico" aria-label="ElevOS" className="shrink-0">
          <LogoMark className="w-8 h-8" />
        </Link>
        <span className="h-6 w-px bg-slate-200" />
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight">Diagnóstico</p>
          <p className="truncate text-[13px] text-ink-500">
            {el.torre} · {el.nome} · RG {el.rg}
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
                    {diagnostico.confianca}%
                    <span className="ml-2 align-middle text-sm font-semibold text-ink-700">de confiança</span>
                  </p>
                  <p className="mt-1.5 text-[13px] text-ink-700">
                    {diagnostico.nivel} · {diagnostico.respostasAnalisadas} respostas analisadas
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
                    <ProbBar value={c.probabilidade} tone={tons[i]} delay={i * 120} />
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
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-700">{diagnostico.explicacao}</p>
            </section>
          </div>

          {/* Coluna direita */}
          <div className="space-y-4">
            <section className="card animate-fade-up p-5" style={{ animationDelay: '60ms' }}>
              <p className="text-[13px] text-ink-500">Peça sugerida</p>
              <p className="mt-2 flex items-center gap-2.5 text-[17px] font-bold">
                <IconBox className="w-5 h-5 shrink-0 text-ink-500" />
                {diagnostico.peca.nome}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  {diagnostico.peca.estoque}
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-ink-700">
                  {diagnostico.peca.servico}
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
              {enviado ? 'Enviando…' : 'Confirmar e enviar chamado'}
            </button>
            <Link to="/sindico/chamados/novo" className="btn-ghost btn-md w-full">
              Refazer as perguntas
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
