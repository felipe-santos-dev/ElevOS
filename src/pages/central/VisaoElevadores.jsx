import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CentralLayout from '../../components/CentralLayout'
import { Badge, StatusDot, TecnologiaChip } from '../../components/UI'
import { IconBuilding, IconChevronDown, IconHome, IconMapPin, IconPlus } from '../../components/Icons'
import { condominios, regioes } from '../../data/mock'

function Legenda() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-700">
      <span className="flex items-center gap-2"><StatusDot status="normal" /> Normal</span>
      <span className="flex items-center gap-2"><StatusDot status="aguardando" /> Aguardando</span>
      <span className="flex items-center gap-2"><StatusDot status="manutencao" /> Manutenção</span>
    </div>
  )
}

export default function VisaoElevadores() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')
  const [abertos, setAbertos] = useState({ 'c-01': true, 'c-01::Bloco A': true })

  const lista = useMemo(() => condominios.filter((c) => c.regiaoId === regiaoId), [regiaoId])
  const regiao = regioes.find((r) => r.id === regiaoId)
  const totalElevadores = lista.reduce(
    (acc, c) => acc + c.blocos.reduce((a, b) => a + b.elevadores.length, 0),
    0,
  )

  const toggle = (k) => setAbertos((s) => ({ ...s, [k]: !s[k] }))

  return (
    <CentralLayout regiaoId={regiaoId} onRegiaoChange={setRegiaoId}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Visão por elevador</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ink-500">
              <span className="flex items-center gap-1.5">
                <IconMapPin className="w-4 h-4 shrink-0" />
                {regiao.cidade} · {regiao.regiao}
              </span>
              <span className="hidden text-slate-300 sm:inline">|</span>
              <span className="basis-full sm:basis-auto">
                {lista.length} condomínios · {totalElevadores} elevadores monitorados
              </span>
            </p>
          </div>
          <Legenda />
        </div>

        {/* Tabela / árvore */}
        <section className="card mt-5 overflow-hidden">
          {/* Cabeçalho — só desktop */}
          <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-500 lg:grid lg:grid-cols-[minmax(0,1fr)_110px_130px_120px_130px_190px] lg:gap-4">
            <span>Estrutura</span>
            <span>RG</span>
            <span>Tecnologia</span>
            <span>Status</span>
            <span>Último chamado</span>
            <span className="text-right">Ações</span>
          </div>

          <div className="divide-y divide-slate-100">
            {lista.map((cond) => {
              const condAberto = abertos[cond.id] ?? false
              const qtd = cond.blocos.reduce((a, b) => a + b.elevadores.length, 0)
              return (
                <div key={cond.id}>
                  {/* Condomínio */}
                  <button
                    onClick={() => toggle(cond.id)}
                    aria-expanded={condAberto}
                    className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 sm:px-5"
                  >
                    <IconChevronDown
                      className={`w-4 h-4 shrink-0 text-ink-500 transition-transform ${condAberto ? '' : '-rotate-90'}`}
                    />
                    <IconBuilding className="w-[18px] h-[18px] shrink-0 text-ink-500" />
                    <span className="truncate text-sm font-bold">{cond.nome}</span>
                    <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-ink-700">
                      {qtd} {qtd === 1 ? 'elevador' : 'elevadores'}
                    </span>
                    <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[13px] text-ink-500 sm:flex">
                      <IconMapPin className="w-4 h-4" />
                      {cond.cidade}
                    </span>
                  </button>

                  {condAberto &&
                    cond.blocos.map((bloco) => {
                      const chave = `${cond.id}::${bloco.nome}`
                      const blocoAberto = abertos[chave] ?? false
                      return (
                        <div key={chave}>
                          {/* Bloco */}
                          <button
                            onClick={() => toggle(chave)}
                            aria-expanded={blocoAberto}
                            className="flex w-full items-center gap-2.5 py-3 pl-10 pr-4 text-left transition-colors hover:bg-slate-50 sm:pl-12 sm:pr-5"
                          >
                            <IconChevronDown
                              className={`w-4 h-4 shrink-0 text-ink-500 transition-transform ${blocoAberto ? '' : '-rotate-90'}`}
                            />
                            <IconHome className="w-[18px] h-[18px] shrink-0 text-ink-500" />
                            <span className="truncate text-[13px] font-semibold">{bloco.nome}</span>
                            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-ink-700">
                              {bloco.elevadores.length}
                            </span>
                          </button>

                          {/* Elevadores */}
                          {blocoAberto &&
                            bloco.elevadores.map((el) => (
                              <div
                                key={el.rg}
                                className="grid grid-cols-1 gap-1.5 border-t border-slate-100 bg-white py-3.5 pl-10 pr-4 transition-colors hover:bg-otis-50/40 sm:pl-16 sm:pr-5 lg:grid-cols-[minmax(0,1fr)_110px_130px_120px_130px_190px] lg:items-center lg:gap-4 lg:py-3"
                              >
                                <span className="flex items-center gap-2.5">
                                  <StatusDot status={el.status} />
                                  <span className="truncate text-[13px] font-medium">{el.nome}</span>
                                </span>
                                <span className="pl-[18px] text-[13px] text-ink-500 lg:pl-0">{el.rg}</span>
                                <span className="pl-[18px] lg:pl-0">
                                  <TecnologiaChip tecnologia={el.tecnologia} />
                                </span>
                                <span className="pl-[18px] lg:pl-0">
                                  <Badge status={el.status} />
                                </span>
                                <span className="pl-[18px] text-[13px] text-ink-500 lg:pl-0">
                                  <span className="lg:hidden">Último chamado: </span>
                                  {el.ultimoChamado}
                                </span>
                                <span className="flex items-center gap-3 pl-[18px] lg:justify-end lg:pl-0">
                                  <Link
                                    to={`/central/elevadores/${el.rg}`}
                                    className="text-[13px] font-semibold text-otis-700 hover:text-otis-900"
                                  >
                                    Detalhes
                                  </Link>
                                  <Link
                                    to={`/central/chamados/novo?rg=${el.rg}`}
                                    className="flex items-center gap-1 text-[13px] font-semibold text-ink-700 hover:text-ink-900"
                                  >
                                    <IconPlus className="w-3.5 h-3.5" />
                                    Abrir chamado
                                  </Link>
                                </span>
                              </div>
                            ))}
                        </div>
                      )
                    })}
                </div>
              )
            })}

            {lista.length === 0 && (
              <p className="px-5 py-12 text-center text-sm text-ink-500">
                Nenhum condomínio monitorado nesta região.
              </p>
            )}
          </div>
        </section>
      </div>
    </CentralLayout>
  )
}
