import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CentralLayout from '../../components/CentralLayout'
import { Badge, NivelBadge, RiskBadge, ScoreBar, TrendChip, riskTone } from '../../components/UI'
import { IconChevronRight } from '../../components/Icons'
import { condominios, regioes, riskScore } from '../../data/mock'
import { useChamados } from '../../state/ChamadosContext'

const CHAMADO_STATUS = {
  aberto: { badge: 'aberto', label: 'Aberto' },
  atribuido: { badge: 'aguardando', label: 'Atribuído' },
  'a-caminho': { badge: 'a-caminho', label: 'A caminho' },
  concluido: { badge: 'resolvido', label: 'Concluído' },
}

export default function Painel() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')
  const regiao = regioes.find((r) => r.id === regiaoId)
  const { chamados } = useChamados()

  const dados = useMemo(() => {
    const conds = condominios.filter((c) => c.regiaoId === regiaoId)
    const elevs = conds.flatMap((c) => c.blocos.flatMap((b) => b.elevadores))
    const risco = riskScore.filter((r) => r.regiaoId === regiaoId)
    const criticos = risco.filter((r) => r.score >= 81)
    const criticosNet = criticos.reduce(
      (acc, r) => acc + (r.tendencia === 'subindo' ? 1 : r.tendencia === 'descendo' ? -1 : 0),
      0,
    )
    return {
      conds: conds.length,
      total: elevs.length,
      manutencao: elevs.filter((e) => e.status === 'manutencao').length,
      aguardando: elevs.filter((e) => e.status === 'aguardando').length,
      criticos: criticos.length,
      criticosNet,
      topRisco: risco.slice(0, 5),
    }
  }, [regiaoId])

  const kpis = [
    { titulo: 'Elevadores monitorados', valor: dados.total, obs: `${dados.conds} condomínios` },
    { titulo: 'Em manutenção', valor: dados.manutencao, obs: `${dados.aguardando} aguardando` },
    { titulo: 'Risco crítico', valor: dados.criticos, obs: 'score acima de 80', trend: dados.criticosNet },
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
              <span className="mt-2 flex items-baseline justify-between">
                <span className="text-[30px] font-extrabold leading-none tracking-tight tabular-nums">{k.valor}</span>
                {k.trend != null && (
                  <TrendChip tendencia={k.trend > 0 ? 'subindo' : k.trend < 0 ? 'descendo' : 'estavel'} variacao={k.trend} />
                )}
              </span>
              <p className="mt-1.5 text-[13px] text-ink-500">{k.obs}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <section className="card overflow-hidden">
            <header className="flex items-center justify-between px-5 py-4">
              <h2 className="text-[15px] font-bold">Chamados recentes</h2>
              <Link to="/central/chamados" className="flex items-center gap-1 text-[13px] font-semibold text-otis-700 hover:text-otis-900">
                Ver todos
                <IconChevronRight className="w-4 h-4" />
              </Link>
            </header>
            <ul className="divide-y divide-slate-100 border-t border-slate-100">
              {chamados.slice(0, 5).map((c) => {
                const st = CHAMADO_STATUS[c.status] ?? CHAMADO_STATUS.aberto
                return (
                  <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-semibold">{c.local}</span>
                        <Badge status={st.badge}>{st.label}</Badge>
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] text-ink-500">
                        {c.rg} · {c.tecnicoNome ?? 'Aguardando aceite'}
                      </span>
                    </span>
                    <NivelBadge confianca={c.confianca} />
                  </li>
                )
              })}
              {chamados.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-ink-500">Nenhum chamado no momento.</li>
              )}
            </ul>
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
                    <span className="hidden w-20 shrink-0 sm:block">
                      <ScoreBar score={r.score} />
                    </span>
                    <span className={`w-10 shrink-0 text-right text-[13px] font-bold ${tone.chip} tabular-nums`}>
                      {r.score}
                    </span>
                    <RiskBadge score={r.score} className="shrink-0" />
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
