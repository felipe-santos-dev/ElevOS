import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CentralLayout from '../../components/CentralLayout'
import { ProbBar, ScoreBar, StatusDot, riskTone } from '../../components/UI'
import { IconChevronRight } from '../../components/Icons'
import { condominios, regioes, riskScore } from '../../data/mock'

export default function Painel() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')
  const regiao = regioes.find((r) => r.id === regiaoId)

  const dados = useMemo(() => {
    const conds = condominios.filter((c) => c.regiaoId === regiaoId)
    const elevs = conds.flatMap((c) => c.blocos.flatMap((b) => b.elevadores))
    const risco = riskScore.filter((r) => r.regiaoId === regiaoId)
    const criticos = risco.filter((r) => r.score >= 81).length
    return {
      conds: conds.length,
      total: elevs.length,
      normal: elevs.filter((e) => e.status === 'normal').length,
      aguardando: elevs.filter((e) => e.status === 'aguardando').length,
      manutencao: elevs.filter((e) => e.status === 'manutencao').length,
      criticos,
      topRisco: risco.slice(0, 5),
    }
  }, [regiaoId])

  const fleetHealth = dados.total ? Math.round((dados.normal / dados.total) * 100) : 0

  const kpis = [
    { titulo: 'Elevadores monitorados', valor: dados.total, obs: `${dados.conds} condomínios` },
    { titulo: 'Em manutenção', valor: dados.manutencao, obs: `${dados.aguardando} aguardando` },
    { titulo: 'Risco crítico', valor: dados.criticos, obs: 'score acima de 80' },
    { titulo: 'First Time Fix', valor: '71%', obs: 'meta do projeto: 86%' },
  ]

  return (
    <CentralLayout regiaoId={regiaoId} onRegiaoChange={setRegiaoId}>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Painel</h1>
        <p className="mt-1 text-sm text-ink-500">
          {regiao.cidade} · {regiao.regiao}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, i) => (
            <div key={k.titulo} className="card animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <p className="text-[13px] text-ink-500">{k.titulo}</p>
              <p className="mt-2 text-[30px] font-extrabold leading-none tracking-tight tabular-nums">{k.valor}</p>
              <p className="mt-1.5 text-[13px] text-ink-500">{k.obs}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <section className="card p-5">
            <h2 className="text-[15px] font-bold">Fleet Health</h2>
            <p className="mt-1 text-[13px] text-ink-500">Estado atual da carteira desta região</p>
            <p className="mt-4 text-[40px] font-extrabold leading-none tracking-tight">{fleetHealth}%</p>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Normal', qtd: dados.normal, status: 'normal', tone: 'otis' },
                { label: 'Aguardando', qtd: dados.aguardando, status: 'aguardando', tone: 'soft' },
                { label: 'Manutenção', qtd: dados.manutencao, status: 'manutencao', tone: 'faint' },
              ].map((l, i) => (
                <div key={l.label} className="grid grid-cols-[110px_1fr_32px] items-center gap-3">
                  <span className="flex items-center gap-2 text-[13px] font-medium">
                    <StatusDot status={l.status} />
                    {l.label}
                  </span>
                  <ProbBar value={dados.total ? (l.qtd / dados.total) * 100 : 0} tone={l.tone} delay={i * 100} />
                  <span className="text-right text-[13px] font-bold tabular-nums">{l.qtd}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card overflow-hidden">
            <header className="flex items-center justify-between px-5 py-4">
              <h2 className="text-[15px] font-bold">Prioridade da carteira</h2>
              <Link to="/central/risk-score" className="flex items-center gap-1 text-[13px] font-semibold text-otis-700 hover:text-otis-900">
                Ver Risk Score
                <IconChevronRight className="w-4 h-4" />
              </Link>
            </header>
            <ul className="divide-y divide-slate-100 border-t border-slate-100">
              {dados.topRisco.map((r) => {
                const tone = riskTone(r.score)
                return (
                  <li key={r.rg} className="flex items-center gap-3 px-5 py-3">
                    <span className="w-7 shrink-0 text-[13px] font-bold text-ink-500">#{r.rank}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{r.elevador} · {r.rg}</span>
                      <span className="block truncate text-[13px] text-ink-500">{r.condominio}</span>
                    </span>
                    <span className="hidden w-24 shrink-0 sm:block">
                      <ScoreBar score={r.score} />
                    </span>
                    <span className={`w-16 shrink-0 text-right text-[13px] font-bold ${tone.chip} tabular-nums`}>
                      {r.score}
                    </span>
                  </li>
                )
              })}
              {dados.topRisco.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-ink-500">Sem dados nesta região.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </CentralLayout>
  )
}
