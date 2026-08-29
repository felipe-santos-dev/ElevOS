import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import TecnicoShell from '../../components/TecnicoShell'
import { Badge, ProbBar, Toast } from '../../components/UI'
import { IconBox, IconCheckCircle, IconChevronLeft, IconClock, IconMapPin } from '../../components/Icons'
import { chamadosUrgentes } from '../../data/mock'

export default function DetalheChamado() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chamado = chamadosUrgentes.find((c) => c.id === id)

  const [minutos, setMinutos] = useState(25)
  const [aceito, setAceito] = useState(false)

  if (!chamado) return <Navigate to="/tecnico" replace />

  const aceitar = () => {
    setAceito(true)
    setTimeout(() => navigate(`/tecnico/chamados/${chamado.id}/finalizar`), 1600)
  }

  return (
    <TecnicoShell>
      <Toast show={aceito}>
        <IconCheckCircle className="w-5 h-5 shrink-0" />
        Chamado aceito · Status atualizado para “A caminho”
      </Toast>

      <header className="sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-2 py-3">
        <button onClick={() => navigate('/tecnico')} aria-label="Voltar" className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-100">
          <IconChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight">{chamado.local}</p>
          <p className="text-[13px] text-ink-500">RG: {chamado.rg}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-8 pt-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-500">
          <Badge status={chamado.urgencia === 'Alta' ? 'manutencao' : 'aguardando'}>
            Urgência {chamado.urgencia.toLowerCase()}
          </Badge>
          <span className="flex items-center gap-1.5">
            <IconMapPin className="w-4 h-4" />
            {chamado.distancia}
          </span>
          <span className="flex items-center gap-1.5">
            <IconClock className="w-4 h-4" />
            {chamado.sla}
          </span>
        </div>

        {/* Diagnóstico */}
        <section className="card mt-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold">Diagnóstico</h2>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              {chamado.confianca}%
            </span>
          </div>
          <ul className="mt-3.5 space-y-2.5">
            {chamado.causas.map((c, i) => (
              <li key={c.nome} className="grid grid-cols-[86px_1fr_40px] items-center gap-2.5">
                <span className="truncate text-[13px] font-medium">{c.nome}</span>
                <ProbBar value={c.probabilidade} tone={i === 0 ? 'otis' : 'soft'} delay={i * 120} />
                <span className="text-right text-[13px] font-bold tabular-nums">{c.probabilidade}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-3 text-[13px] text-ink-700">
            <IconBox className="w-4 h-4 mt-0.5 shrink-0 text-ink-500" />
            <span>
              <span className="font-semibold">Peças: </span>
              {chamado.pecas.join(', ')}
            </span>
          </p>
        </section>

        {/* Orientação */}
        <p className="mt-4 rounded-xl border border-otis-200 border-l-4 border-l-otis-600 bg-otis-50 p-4 text-[13px] leading-relaxed text-ink-700">
          {chamado.nota}
        </p>

        {/* Tempo estimado */}
        <section className="card mt-4 p-4">
          <label htmlFor="minutos" className="label">Tempo estimado (minutos)</label>
          <div className="flex items-center gap-2">
            <input
              id="minutos"
              type="number"
              min="5"
              max="240"
              step="5"
              value={minutos}
              onChange={(e) => setMinutos(Number(e.target.value))}
              className="input flex-1"
            />
            <button
              onClick={() => setMinutos((m) => Math.max(5, m - 5))}
              aria-label="Diminuir 5 minutos"
              className="btn-outline h-11 w-11 text-lg"
            >
              −
            </button>
            <button
              onClick={() => setMinutos((m) => Math.min(240, m + 5))}
              aria-label="Aumentar 5 minutos"
              className="btn-outline h-11 w-11 text-lg"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-[13px] text-ink-500">
            O síndico acompanha a previsão de chegada em tempo real.
          </p>
        </section>
      </div>

      {/* Ações fixas */}
      <div className="shrink-0 space-y-2 border-t border-slate-200 bg-white px-4 py-3">
        <button onClick={aceitar} disabled={aceito} className="btn-primary btn-lg w-full">
          {aceito ? 'Chamado aceito' : 'Aceitar chamado'}
        </button>
        <button onClick={() => navigate('/tecnico')} className="btn-ghost btn-md w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700">
          Recusar chamado
        </button>
      </div>
    </TecnicoShell>
  )
}
