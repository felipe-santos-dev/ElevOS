import { useState } from 'react'
import CentralLayout from '../../components/CentralLayout'
import { Badge, ProbBar } from '../../components/UI'
import { chamadosUrgentes } from '../../data/mock'

export default function ChamadosCentral() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')

  return (
    <CentralLayout regiaoId={regiaoId} onRegiaoChange={setRegiaoId}>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Chamados</h1>
        <p className="mt-1 text-sm text-ink-500">
          {chamadosUrgentes.length} chamados abertos · diagnóstico já calculado pelo motor
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chamadosUrgentes.map((c, i) => (
            <article key={c.id} className="card animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold">{c.local}</p>
                  <p className="text-[13px] text-ink-500">RG: {c.rg}</p>
                </div>
                <Badge status={c.urgencia === 'Alta' ? 'manutencao' : 'aguardando'}>{c.urgencia}</Badge>
              </div>

              <div className="mt-4 space-y-2.5">
                {c.causas.map((causa, idx) => (
                  <div key={causa.nome} className="grid grid-cols-[90px_1fr_40px] items-center gap-2.5">
                    <span className="truncate text-[13px] font-medium">{causa.nome}</span>
                    <ProbBar value={causa.probabilidade} tone={idx === 0 ? 'otis' : 'soft'} delay={idx * 100} />
                    <span className="text-right text-[13px] font-bold tabular-nums">{causa.probabilidade}%</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-lg bg-otis-50 p-3 text-[13px] leading-relaxed text-ink-700">{c.nota}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                {c.pecas.map((p) => (
                  <span key={p} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-ink-700">
                    {p}
                  </span>
                ))}
                <span className="ml-auto text-[13px] text-ink-500">{c.sla}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </CentralLayout>
  )
}
