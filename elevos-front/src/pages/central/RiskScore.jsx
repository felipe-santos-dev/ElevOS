import { useMemo, useState } from 'react'
import CentralLayout from '../../components/CentralLayout'
import { ScoreBar, Select, riskTone } from '../../components/UI'
import { IconDownload } from '../../components/Icons'
import { riskScore } from '../../data/mock'

const PERIODOS = [
  { value: '30', label: 'Últimos 30 dias' },
  { value: '60', label: 'Últimos 60 dias' },
  { value: '90', label: 'Últimos 90 dias' },
]

function Legenda() {
  const faixas = [
    { label: '0-30', cor: 'bg-emerald-500' },
    { label: '31-60', cor: 'bg-amber-400' },
    { label: '61-80', cor: 'bg-orange-500' },
    { label: '81-100', cor: 'bg-red-500' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-700">
      {faixas.map((f) => (
        <span key={f.label} className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${f.cor}`} />
          {f.label}
        </span>
      ))}
    </div>
  )
}

export default function RiskScore() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')
  const [condominio, setCondominio] = useState('todos')
  const [periodo, setPeriodo] = useState('30')
  const [scoreMin, setScoreMin] = useState(0)

  const daRegiao = useMemo(() => riskScore.filter((r) => r.regiaoId === regiaoId), [regiaoId])

  const opcoesCondominio = useMemo(() => {
    const nomes = [...new Set(daRegiao.map((r) => r.condominio))]
    return [{ value: 'todos', label: 'Todos os condomínios' }, ...nomes.map((n) => ({ value: n, label: n }))]
  }, [daRegiao])

  const lista = useMemo(
    () =>
      daRegiao
        .filter((r) => (condominio === 'todos' ? true : r.condominio === condominio))
        .filter((r) => r.score >= scoreMin),
    [daRegiao, condominio, scoreMin],
  )

  return (
    <CentralLayout
      regiaoId={regiaoId}
      onRegiaoChange={(id) => {
        setRegiaoId(id)
        setCondominio('todos')
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Risk Score</h1>
            <p className="mt-1 text-sm text-ink-500">
              {lista.length} elevadores avaliados · previsão para os próximos 30 dias
            </p>
          </div>
          <button className="btn-outline btn-md w-full sm:w-auto">
            <IconDownload className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
            <Select value={condominio} onChange={setCondominio} options={opcoesCondominio} className="lg:w-56" ariaLabel="Filtrar por condomínio" />
            <Select value={periodo} onChange={setPeriodo} options={PERIODOS} className="lg:w-44" ariaLabel="Período" />
            <label className="flex h-10 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 sm:col-span-2 lg:w-60">
              <span className="shrink-0 text-[13px] font-medium text-ink-700">Score mínimo</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={scoreMin}
                onChange={(e) => setScoreMin(Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-otis-900"
                aria-label="Score mínimo"
              />
              <span className="w-7 shrink-0 text-right text-[13px] font-bold tabular-nums">{scoreMin}</span>
            </label>
          </div>
          <Legenda />
        </div>

        {/* Tabela desktop */}
        <section className="card mt-4 hidden overflow-hidden lg:block">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-ink-500">
                  <th className="px-5 py-3 w-16">Rank</th>
                  <th className="px-5 py-3">Elevador</th>
                  <th className="px-5 py-3">Condomínio</th>
                  <th className="px-5 py-3 w-32">Últ. chamado</th>
                  <th className="px-5 py-3 w-56">Score</th>
                  <th className="px-5 py-3 w-28">Risco</th>
                  <th className="px-5 py-3">Ação recomendada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lista.map((r) => {
                  const tone = riskTone(r.score)
                  return (
                    <tr key={r.rg} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-3.5 text-[13px] font-bold text-ink-500">#{r.rank}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] font-bold">{r.elevador}</span>
                        <span className="ml-2 text-[13px] text-ink-500">{r.rg}</span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-ink-700">{r.condominio}</td>
                      <td className="px-5 py-3.5 text-[13px] text-ink-500">{r.ultimoChamado}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-3">
                          <ScoreBar score={r.score} />
                          <span className="w-7 shrink-0 text-right text-[13px] font-bold tabular-nums">{r.score}</span>
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 text-[13px] font-bold ${tone.chip}`}>{tone.label}</td>
                      <td className="px-5 py-3.5 text-[13px] text-ink-700">{r.acao}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {lista.length === 0 && <p className="px-5 py-12 text-center text-sm text-ink-500">Nenhum elevador neste filtro.</p>}
        </section>

        {/* Cards mobile */}
        <div className="mt-4 space-y-3 lg:hidden">
          {lista.map((r) => {
            const tone = riskTone(r.score)
            return (
              <article key={r.rg} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-ink-500">#{r.rank}</p>
                    <p className="mt-0.5 truncate text-sm font-bold">
                      {r.elevador} <span className="font-medium text-ink-500">{r.rg}</span>
                    </p>
                    <p className="truncate text-[13px] text-ink-500">{r.condominio}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-extrabold leading-none tabular-nums">{r.score}</p>
                    <p className={`mt-1 text-xs font-bold ${tone.chip}`}>{tone.label}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <ScoreBar score={r.score} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <span className="text-[13px] font-semibold">{r.acao}</span>
                  <span className="shrink-0 text-[13px] text-ink-500">{r.ultimoChamado}</span>
                </div>
              </article>
            )
          })}
          {lista.length === 0 && <p className="py-12 text-center text-sm text-ink-500">Nenhum elevador neste filtro.</p>}
        </div>
      </div>
    </CentralLayout>
  )
}
