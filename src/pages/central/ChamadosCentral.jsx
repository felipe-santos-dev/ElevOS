import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CentralLayout from '../../components/CentralLayout'
import { Badge, NivelBadge, ProbBar, StatusStepper } from '../../components/UI'
import { IconBox, IconClock, IconMapPin, IconUsers, IconX } from '../../components/Icons'
import { useChamados } from '../../state/ChamadosContext'

function ModalDetalhes({ chamado, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-4">
      <div className="animate-slide-down max-h-[85vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-t-2xl bg-white p-5 shadow-pop sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-extrabold tracking-tight">{chamado.local}</h2>
            <p className="mt-0.5 text-[13px] text-ink-500">RG: {chamado.rg}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-500">
          <Badge status={chamado.urgencia === 'Alta' ? 'manutencao' : 'aguardando'}>
            Urgência {chamado.urgencia.toLowerCase()}
          </Badge>
          <NivelBadge confianca={chamado.confianca} />
          <span className="flex items-center gap-1.5">
            <IconClock className="w-4 h-4" />
            {chamado.sla}
          </span>
          <span className="flex items-center gap-1.5">
            <IconUsers className="w-4 h-4" />
            {chamado.tecnicoNome ?? 'Aguardando aceite da Central'}
          </span>
        </div>

        <section className="mt-5 rounded-xl border border-slate-200 p-4">
          <h3 className="text-[13px] font-bold text-ink-700">Situação do chamado</h3>
          <div className="mt-3">
            <StatusStepper status={chamado.status} />
          </div>
        </section>

        {chamado.causas.length > 0 && (
          <section className="mt-4">
            <h3 className="text-[13px] font-bold text-ink-700">Probabilidades por causa</h3>
            <ul className="mt-3 space-y-2.5">
              {chamado.causas.map((c, i) => (
                <li key={c.nome} className="grid grid-cols-[86px_1fr_40px] items-center gap-2.5">
                  <span className="truncate text-[13px] font-medium">{c.nome}</span>
                  <ProbBar value={c.probabilidade} tone={i === 0 ? 'otis' : 'soft'} delay={i * 100} />
                  <span className="text-right text-[13px] font-bold tabular-nums">{c.probabilidade}%</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {chamado.pecas.length > 0 && (
          <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-4 text-[13px] text-ink-700">
            <IconBox className="w-4 h-4 mt-0.5 shrink-0 text-ink-500" />
            <span>
              <span className="font-semibold">Peças: </span>
              {chamado.pecas.join(', ')}
            </span>
          </p>
        )}

        <p className="mt-4 rounded-lg bg-otis-50 p-3 text-[13px] leading-relaxed text-ink-700">{chamado.nota}</p>

        {chamado.feedback && (
          <section className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="text-[13px] font-bold text-emerald-800">Feedback do técnico</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-emerald-900">
              {chamado.feedback.resultado === 'resolvido' ? 'Resolvido no local.' : 'Não foi possível resolver no local.'}
              {' '}Diagnóstico correto: {chamado.feedback.avaliacao}.
            </p>
            {chamado.feedback.observacoes && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-emerald-900">{chamado.feedback.observacoes}</p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default function ChamadosCentral() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')
  const [selecionado, setSelecionado] = useState(null)
  const { chamados } = useChamados()
  const location = useLocation()

  // Chegando aqui pelo alerta de "novo chamado" (botão "Ver diagnóstico"),
  // já abre direto o painel de detalhes daquele chamado.
  useEffect(() => {
    const id = location.state?.abrirDetalheId
    if (!id) return
    const alvo = chamados.find((c) => c.id === id)
    if (alvo) setSelecionado(alvo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  return (
    <CentralLayout regiaoId={regiaoId} onRegiaoChange={setRegiaoId}>
      {selecionado && <ModalDetalhes chamado={selecionado} onClose={() => setSelecionado(null)} />}

      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Chamados</h1>
        <p className="mt-1 text-sm text-ink-500">
          {chamados.length} chamados · diagnóstico já calculado pelo motor quando disponível
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chamados.map((c, i) => (
            <article key={c.id} className="card animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold">{c.local}</p>
                  <p className="text-[13px] text-ink-500">RG: {c.rg}</p>
                </div>
                <Badge status={c.urgencia === 'Alta' ? 'manutencao' : 'aguardando'}>{c.urgencia}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <NivelBadge confianca={c.confianca} />
                {c.tecnicoNome ? (
                  <span className="text-[13px] text-ink-500">{c.tecnicoNome}</span>
                ) : (
                  <Badge status="aberto">Aguardando aceite</Badge>
                )}
              </div>

              {c.causas.length > 0 && (
                <div className="mt-4 space-y-2.5">
                  {c.causas.map((causa, idx) => (
                    <div key={causa.nome} className="grid grid-cols-[90px_1fr_40px] items-center gap-2.5">
                      <span className="truncate text-[13px] font-medium">{causa.nome}</span>
                      <ProbBar value={causa.probabilidade} tone={idx === 0 ? 'otis' : 'soft'} delay={idx * 100} />
                      <span className="text-right text-[13px] font-bold tabular-nums">{causa.probabilidade}%</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 rounded-lg bg-otis-50 p-3 text-[13px] leading-relaxed text-ink-700 line-clamp-3">{c.nota}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                {c.pecas.map((p) => (
                  <span key={p} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-ink-700">
                    {p}
                  </span>
                ))}
                <span className="ml-auto flex items-center gap-1.5 text-[13px] text-ink-500">
                  <IconMapPin className="w-3.5 h-3.5" />
                  {c.sla}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                {!c.tecnicoNome && (
                  <Link to={`/central/chamados/${c.id}/aceitar`} className="btn-primary btn-md flex-1">
                    Aceitar chamado
                  </Link>
                )}
                <button
                  onClick={() => setSelecionado(c)}
                  className={`btn-outline btn-md ${c.tecnicoNome ? 'w-full' : 'flex-1'}`}
                >
                  Ver detalhes
                </button>
              </div>
            </article>
          ))}

          {chamados.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-ink-500">Nenhum chamado no momento.</p>
          )}
        </div>
      </div>
    </CentralLayout>
  )
}
