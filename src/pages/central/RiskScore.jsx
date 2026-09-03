import { Fragment, useEffect, useMemo, useState } from 'react'
import CentralLayout from '../../components/CentralLayout'
import { RiskBadge, ScoreBar, Select, Sparkline, StatusDot, TrendChip, riskTone } from '../../components/UI'
import {
  IconCalendarPlus, IconChevronLeft, IconChevronRight, IconDownload, IconEye, IconSearch,
} from '../../components/Icons'
import { riskScore } from '../../data/mock'

const PERIODOS = [
  { value: '30', label: 'Últimos 30 dias' },
  { value: '60', label: 'Últimos 60 dias' },
  { value: '90', label: 'Últimos 90 dias' },
]

const IDADES = [
  { value: 'todos', label: 'Todas as idades' },
  { value: 'ate5', label: 'Até 5 anos' },
  { value: '6-10', label: '6 a 10 anos' },
  { value: 'acima10', label: 'Acima de 10 anos' },
]

const PAGE_SIZE = 10

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

function MetricCard({ label, dot, valor, net, delay }) {
  const tendencia = net > 0 ? 'subindo' : net < 0 ? 'descendo' : 'estavel'
  return (
    <div className="card animate-fade-up flex flex-col gap-3.5 p-5" style={{ animationDelay: `${delay}ms` }}>
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
        {label}
      </span>
      <span className="flex items-baseline justify-between">
        <span className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums">{valor}</span>
        <TrendChip tendencia={tendencia} variacao={net} />
      </span>
      <span className="text-xs text-ink-500">vs. período anterior</span>
    </div>
  )
}

export default function RiskScore() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')
  const [condominio, setCondominio] = useState('todos')
  const [periodo, setPeriodo] = useState('30')
  const [scoreMin, setScoreMin] = useState(0)
  const [idadeFiltro, setIdadeFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [selecionados, setSelecionados] = useState(() => new Set())
  const [expandidos, setExpandidos] = useState(() => new Set())
  const [pagina, setPagina] = useState(1)

  const daRegiao = useMemo(() => riskScore.filter((r) => r.regiaoId === regiaoId), [regiaoId])

  const opcoesCondominio = useMemo(() => {
    const nomes = [...new Set(daRegiao.map((r) => r.condominio))]
    return [{ value: 'todos', label: 'Todos os condomínios' }, ...nomes.map((n) => ({ value: n, label: n }))]
  }, [daRegiao])

  const porCondominio = useMemo(
    () => daRegiao.filter((r) => (condominio === 'todos' ? true : r.condominio === condominio)),
    [daRegiao, condominio],
  )

  const metricas = useMemo(() => {
    const grupos = { critico: [], alto: [], medio: [], baixo: [] }
    porCondominio.forEach((r) => {
      if (r.score >= 81) grupos.critico.push(r)
      else if (r.score >= 61) grupos.alto.push(r)
      else if (r.score >= 31) grupos.medio.push(r)
      else grupos.baixo.push(r)
    })
    const net = (arr) => arr.reduce((acc, r) => acc + (r.tendencia === 'subindo' ? 1 : r.tendencia === 'descendo' ? -1 : 0), 0)
    return {
      critico: { valor: grupos.critico.length, net: net(grupos.critico) },
      alto: { valor: grupos.alto.length, net: net(grupos.alto) },
      medio: { valor: grupos.medio.length, net: net(grupos.medio) },
      baixo: { valor: grupos.baixo.length, net: net(grupos.baixo) },
    }
  }, [porCondominio])

  const passaIdade = (r) => {
    if (idadeFiltro === 'todos') return true
    if (idadeFiltro === 'ate5') return r.idade <= 5
    if (idadeFiltro === '6-10') return r.idade >= 6 && r.idade <= 10
    return r.idade > 10
  }

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return porCondominio
      .filter((r) => r.score >= scoreMin)
      .filter(passaIdade)
      .filter((r) => (termo ? r.elevador.toLowerCase().includes(termo) || r.rg.toLowerCase().includes(termo) : true))
  }, [porCondominio, scoreMin, idadeFiltro, busca])

  useEffect(() => setPagina(1), [regiaoId, condominio, scoreMin, idadeFiltro, busca])

  const totalPaginas = Math.max(1, Math.ceil(lista.length / PAGE_SIZE))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const itensPagina = lista.slice((paginaAtual - 1) * PAGE_SIZE, paginaAtual * PAGE_SIZE)
  const inicio = lista.length === 0 ? 0 : (paginaAtual - 1) * PAGE_SIZE + 1
  const fim = Math.min(paginaAtual * PAGE_SIZE, lista.length)

  const todosMarcados = itensPagina.length > 0 && itensPagina.every((r) => selecionados.has(r.rg))

  const alternarSelecionado = (rg) =>
    setSelecionados((s) => {
      const n = new Set(s)
      n.has(rg) ? n.delete(rg) : n.add(rg)
      return n
    })

  const alternarTodos = () =>
    setSelecionados((s) => {
      const n = new Set(s)
      itensPagina.forEach((r) => (todosMarcados ? n.delete(r.rg) : n.add(r.rg)))
      return n
    })

  const alternarExpandido = (rg) =>
    setExpandidos((s) => {
      const n = new Set(s)
      n.has(rg) ? n.delete(rg) : n.add(rg)
      return n
    })

  return (
    <CentralLayout
      regiaoId={regiaoId}
      onRegiaoChange={(id) => {
        setRegiaoId(id)
        setCondominio('todos')
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Risk Score</h1>
            <p className="mt-1 text-sm text-ink-500">{daRegiao.length} elevadores monitorados</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="btn-outline btn-md">
              <IconDownload className="w-4 h-4" />
              Exportar CSV
            </button>
            <button className="btn-primary btn-md">
              <IconCalendarPlus className="w-4 h-4" />
              Agendar inspeção
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Crítico" dot="bg-red-500" valor={metricas.critico.valor} net={metricas.critico.net} delay={0} />
          <MetricCard label="Alto" dot="bg-orange-500" valor={metricas.alto.valor} net={metricas.alto.net} delay={60} />
          <MetricCard label="Médio" dot="bg-amber-400" valor={metricas.medio.valor} net={metricas.medio.net} delay={120} />
          <MetricCard label="Baixo" dot="bg-emerald-500" valor={metricas.baixo.valor} net={metricas.baixo.net} delay={180} />
        </div>

        {/* Filtros */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
            <Select value={condominio} onChange={setCondominio} options={opcoesCondominio} className="lg:w-56" ariaLabel="Filtrar por condomínio" />
            <Select value={idadeFiltro} onChange={setIdadeFiltro} options={IDADES} className="lg:w-44" ariaLabel="Filtrar por idade" />
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
            <label className="relative sm:col-span-2 lg:w-64">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar elevador ou RG..."
                className="input h-10 pl-9"
                aria-label="Buscar elevador ou RG"
              />
            </label>
          </div>
          <Legenda />
        </div>

        {/* Tabela desktop */}
        <section className="card mt-4 hidden overflow-hidden lg:block">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[1180px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-ink-500">
                  <th className="px-4 py-3 w-11">
                    <input
                      type="checkbox"
                      checked={todosMarcados}
                      onChange={alternarTodos}
                      className="h-4 w-4 cursor-pointer accent-otis-900"
                      aria-label="Selecionar todos"
                    />
                  </th>
                  <th className="px-3 py-3 w-14">Rank</th>
                  <th className="px-3 py-3">Elevador</th>
                  <th className="px-3 py-3">Condomínio</th>
                  <th className="px-3 py-3 w-20">Idade</th>
                  <th className="px-3 py-3 w-32">Score</th>
                  <th className="px-3 py-3 w-24">Tendência</th>
                  <th className="px-3 py-3 w-24">Chamados</th>
                  <th className="px-3 py-3 w-28">Tempo médio</th>
                  <th className="px-3 py-3 w-24">Risco</th>
                  <th className="px-3 py-3 w-20 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itensPagina.map((r) => {
                  const tone = riskTone(r.score)
                  const aberto = expandidos.has(r.rg)
                  return (
                    <Fragment key={r.rg}>
                      <tr
                        onClick={() => alternarExpandido(r.rg)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${aberto ? 'bg-otis-50/40' : ''}`}
                      >
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selecionados.has(r.rg)}
                            onChange={() => alternarSelecionado(r.rg)}
                            className="h-4 w-4 cursor-pointer accent-otis-900"
                            aria-label={`Selecionar ${r.elevador} ${r.rg}`}
                          />
                        </td>
                        <td className="px-3 py-3.5 text-[13px] font-bold text-ink-500">#{r.rank}</td>
                        <td className="px-3 py-3.5">
                          <span className="block text-[13px] font-bold">{r.elevador}</span>
                          <span className="block text-[13px] text-ink-500">{r.rg}</span>
                        </td>
                        <td className="px-3 py-3.5 text-[13px] text-ink-700">{r.condominio}</td>
                        <td className="px-3 py-3.5 text-[13px] text-ink-700">{r.idade} anos</td>
                        <td className="px-3 py-3.5">
                          <span className="text-[17px] font-extrabold tabular-nums">{r.score}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <TrendChip tendencia={r.tendencia} variacao={r.variacao} />
                        </td>
                        <td className="px-3 py-3.5 text-[13px] text-ink-700">{r.chamados12m}</td>
                        <td className="px-3 py-3.5 text-[13px] text-ink-700">{r.tempoReparo}</td>
                        <td className="px-3 py-3.5">
                          <RiskBadge score={r.score} />
                        </td>
                        <td className="px-3 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <span className="inline-flex items-center gap-1">
                            <button
                              title="Agendar inspeção"
                              aria-label="Agendar inspeção"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100 hover:text-ink-900"
                            >
                              <IconCalendarPlus className="w-4 h-4" />
                            </button>
                            <button
                              title="Ver detalhes"
                              aria-label="Ver detalhes"
                              onClick={() => alternarExpandido(r.rg)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100 hover:text-ink-900"
                            >
                              <IconEye className="w-4 h-4" />
                            </button>
                          </span>
                        </td>
                      </tr>
                      {aberto && (
                        <tr className="bg-otis-50/30">
                          <td colSpan={11} className="px-8 py-5">
                            <div className="grid gap-6 lg:grid-cols-3">
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Histórico recente</p>
                                <ul className="mt-2.5 space-y-2">
                                  {r.detalhe.historico.map((h) => (
                                    <li key={h.data + h.titulo} className="flex items-start gap-2.5 border-b border-slate-100 pb-2 last:border-0">
                                      <StatusDot status={h.status} className="mt-1.5" />
                                      <span className="min-w-0">
                                        <span className="block text-[13px] font-semibold text-ink-900">{h.titulo}</span>
                                        <span className="block text-[13px] text-ink-500">{h.data}</span>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Manutenção e custo</p>
                                <p className="mt-2.5 text-[13px] text-ink-900">
                                  <span className="text-ink-500">Última: </span>{r.detalhe.ultimaManutencao}
                                </p>
                                <p className="mt-1.5 text-[13px] text-ink-900">
                                  <span className="text-ink-500">Custo estimado: </span>
                                  <strong>{r.detalhe.custoEstimado}</strong>
                                </p>
                                {r.detalhe.pecas.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {r.detalhe.pecas.map((p) => (
                                      <span key={p} className="rounded-md bg-otis-50 px-2.5 py-1 text-xs font-semibold text-otis-900">
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Plano de ação</p>
                                <ol className="mt-2.5 space-y-2">
                                  {r.detalhe.plano.map((passo, i) => (
                                    <li key={passo} className="flex items-start gap-2.5">
                                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-otis-50 text-[11px] font-bold text-otis-900">
                                        {i + 1}
                                      </span>
                                      <span className="text-[13px] text-ink-900">{passo}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          {lista.length === 0 && <p className="px-5 py-12 text-center text-sm text-ink-500">Nenhum elevador neste filtro.</p>}

          {/* Paginação */}
          {lista.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5">
              <span className="text-[13px] text-ink-500">
                Mostrando {inicio}-{fim} de {lista.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  aria-label="Página anterior"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <IconChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPagina(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-semibold ${
                      p === paginaAtual ? 'bg-otis-900 text-white' : 'text-ink-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  aria-label="Próxima página"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Cards mobile */}
        <div className="mt-4 space-y-3 lg:hidden">
          {itensPagina.map((r) => {
            const aberto = expandidos.has(r.rg)
            return (
              <article key={r.rg} className="card p-4">
                <button className="flex w-full items-start justify-between gap-3 text-left" onClick={() => alternarExpandido(r.rg)}>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-ink-500">#{r.rank}</p>
                    <p className="mt-0.5 truncate text-sm font-bold">
                      {r.elevador} <span className="font-medium text-ink-500">{r.rg}</span>
                    </p>
                    <p className="truncate text-[13px] text-ink-500">{r.condominio}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-extrabold leading-none tabular-nums">{r.score}</p>
                    <div className="mt-1.5">
                      <RiskBadge score={r.score} />
                    </div>
                  </div>
                </button>
                <div className="mt-3">
                  <ScoreBar score={r.score} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 text-[13px] text-ink-500">
                  <span>{r.idade} anos</span>
                  <span>{r.chamados12m} chamados/12m</span>
                  <span>{r.tempoReparo} reparo</span>
                  <TrendChip tendencia={r.tendencia} variacao={r.variacao} />
                </div>
                {aberto && (
                  <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Plano de ação</p>
                      <ol className="mt-2 space-y-1.5">
                        {r.detalhe.plano.map((passo, i) => (
                          <li key={passo} className="text-[13px] text-ink-900">
                            {i + 1}. {passo}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <p className="text-[13px] text-ink-900">
                      <span className="text-ink-500">Custo estimado: </span>
                      <strong>{r.detalhe.custoEstimado}</strong>
                    </p>
                  </div>
                )}
              </article>
            )
          })}
          {lista.length === 0 && <p className="py-12 text-center text-sm text-ink-500">Nenhum elevador neste filtro.</p>}
          {lista.length > 0 && (
            <p className="text-center text-[13px] text-ink-500">
              Mostrando {inicio}-{fim} de {lista.length}
            </p>
          )}
        </div>
      </div>
    </CentralLayout>
  )
}
