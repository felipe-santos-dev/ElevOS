import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TecnicoShell from '../../components/TecnicoShell'
import { Avatar, Badge, NivelBadge } from '../../components/UI'
import { IconBell, IconChevronRight, IconClock, IconMapPin } from '../../components/Icons'
import { preventivas, usuarios } from '../../data/mock'
import { useChamados } from '../../state/ChamadosContext'

export default function AgendaTecnico() {
  const [aba, setAba] = useState('urgentes')
  const navigate = useNavigate()
  const u = usuarios.tecnico
  const { chamados } = useChamados()

  // Só aparecem chamados atribuídos a este técnico e que ainda não foram concluídos.
  const meusChamados = useMemo(
    () => chamados.filter((c) => c.tecnicoId === u.id && c.status !== 'concluido'),
    [chamados, u.id],
  )

  return (
    <TecnicoShell>
      {/* Cabeçalho */}
      <header className="sticky top-0 z-20 shrink-0 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Avatar iniciais={u.iniciais} className="w-10 h-10 text-[13px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold leading-tight">{u.nome}</p>
            <p className="text-[13px] text-ink-500">
              {u.papel} · {u.regiao}
            </p>
          </div>
          <button aria-label="Notificações" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100">
            <IconBell className="w-5 h-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-6 px-4">
          {[
            { id: 'preventivas', label: 'Preventivas', badge: null },
            { id: 'urgentes', label: 'Urgentes', badge: meusChamados.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAba(t.id)}
              className={`relative flex items-center gap-2 pb-3 pt-1 text-[15px] font-semibold transition-colors ${
                aba === t.id ? 'text-otis-900' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {t.label}
              {t.badge != null && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                    aba === t.id ? 'bg-otis-900 text-white' : 'bg-slate-200 text-ink-700'
                  }`}
                >
                  {t.badge}
                </span>
              )}
              {aba === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-t bg-otis-900" />}
            </button>
          ))}
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-8 pt-4">
        {aba === 'urgentes' ? (
          <ul className="space-y-3">
            {meusChamados.map((c, i) => (
              <li key={c.id}>
                <button
                  onClick={() => navigate(`/tecnico/chamados/${c.id}`)}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="card animate-fade-up flex w-full items-center gap-3 p-4 text-left transition-shadow hover:shadow-pop"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-bold">{c.local}</span>
                      <Badge status={c.urgencia === 'Alta' ? 'manutencao' : 'aguardando'}>{c.urgencia}</Badge>
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ink-500">RG: {c.rg}</span>
                    <span className="mt-2 flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-otis-700">{c.causa}</span>
                      <NivelBadge confianca={c.confianca} />
                    </span>
                    <span className="mt-2 flex items-center gap-4 text-[13px] text-ink-500">
                      <span className="flex items-center gap-1.5">
                        <IconMapPin className="w-4 h-4" />
                        {c.distancia}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <IconClock className="w-4 h-4" />
                        {c.sla}
                      </span>
                    </span>
                  </span>
                  <IconChevronRight className="w-5 h-5 shrink-0 text-slate-300" />
                </button>
              </li>
            ))}
            {meusChamados.length === 0 && (
              <li className="py-12 text-center text-[13px] text-ink-500">Nenhum chamado atribuído a você no momento.</li>
            )}
          </ul>
        ) : (
          <>
            <p className="mb-3 text-[13px] font-semibold text-ink-500">
              Setembro · {preventivas.length} agendadas
            </p>
            <ul className="space-y-3">
              {preventivas.map((p, i) => (
                <li
                  key={p.dia}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="card animate-fade-up flex items-center gap-4 p-4"
                >
                  <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-otis-50 text-otis-900">
                    <span className="text-[19px] font-extrabold leading-none">{p.dia}</span>
                    <span className="mt-0.5 text-[10px] font-bold tracking-wider">{p.mes}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">{p.titulo}</span>
                    <span className="mt-0.5 block truncate text-[13px] text-ink-500">{p.local}</span>
                    <span className="mt-0.5 block text-[13px] text-ink-500">
                      {p.hora} · {p.duracao}
                    </span>
                  </span>
                  <IconChevronRight className="w-5 h-5 shrink-0 text-slate-300" />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
        <Link to="/" className="block text-center text-[13px] font-semibold text-ink-500 hover:text-ink-900">
          Sair
        </Link>
      </div>
    </TecnicoShell>
  )
}
