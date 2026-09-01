import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { regioes, usuarios } from '../data/mock'
import { Avatar, NivelBadge, Select } from './UI'
import { LogoMark } from './Logo'
import { IconAlertTriangle, IconBell, IconBuilding, IconChart, IconGrid, IconList, IconSearch, IconUsers, IconX } from './Icons'
import { useChamados } from '../state/ChamadosContext'

const rail = [
  { to: '/central', label: 'Painel', Icon: IconGrid, end: true },
  { to: '/central/elevadores', label: 'Visão por elevador', Icon: IconBuilding },
  { to: '/central/chamados', label: 'Chamados', Icon: IconList },
  { to: '/central/risk-score', label: 'Risk Score', Icon: IconChart },
  { to: '/central/equipe', label: 'Equipe', Icon: IconUsers },
]

// Popup central de "novo chamado" — aparece em qualquer tela da Central
// enquanto houver um chamado aberto (do síndico, tipicamente) esperando
// aceite, e some assim que a Central aceita ou dispensa.
function AlertaChamadoAberto({ chamado, onFechar, onVerDiagnostico, onAceitar }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/50 p-4">
      <div className="animate-fade-up w-full max-w-md rounded-2xl bg-white p-6 shadow-pop">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <IconAlertTriangle className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[15px] font-extrabold tracking-tight">Novo chamado aberto</p>
            <p className="mt-0.5 truncate text-[13px] text-ink-500">
              {chamado.local} · RG {chamado.rg}
            </p>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <NivelBadge confianca={chamado.confianca} />
          {chamado.causa && <span className="text-[13px] font-medium text-ink-700">Causa provável: {chamado.causa}</span>}
        </div>

        {chamado.nota && (
          <p className="mt-3 line-clamp-3 rounded-lg bg-otis-50 p-3 text-[13px] leading-relaxed text-ink-700">{chamado.nota}</p>
        )}

        <div className="mt-5 flex gap-2">
          <button onClick={onVerDiagnostico} className="btn-outline btn-md flex-1">
            Ver diagnóstico
          </button>
          <button onClick={onAceitar} className="btn-primary btn-md flex-1">
            Aceitar chamado
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CentralLayout({ children, regiaoId, onRegiaoChange }) {
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const u = usuarios.central
  const { chamados, alertasVistos, marcarAlertaVisto } = useChamados()

  const pendente = chamados.find((c) => c.status === 'aberto' && !c.tecnicoId && !alertasVistos.has(c.id))

  const options = regioes.map((r) => ({ value: r.id, label: `${r.cidade} · ${r.regiao}` }))

  const Rail = ({ onNavigate, expanded = false }) => (
    <nav className={expanded ? 'space-y-1' : 'flex flex-col items-center gap-1'}>
      {rail.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          title={label}
          className={({ isActive }) =>
            expanded
              ? `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-otis-50 text-otis-900 font-semibold' : 'text-ink-500 hover:bg-slate-50 hover:text-ink-900'
                }`
              : `relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                  isActive ? 'bg-otis-50 text-otis-900' : 'text-ink-500 hover:bg-slate-50 hover:text-ink-900'
                }`
          }
        >
          {({ isActive }) => (
            <>
              {!expanded && isActive && <span className="absolute -left-3 h-6 w-1 rounded-r bg-otis-900" />}
              <Icon className="w-5 h-5 shrink-0" />
              {expanded && <span className="truncate">{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {pendente && (
        <AlertaChamadoAberto
          chamado={pendente}
          onFechar={() => marcarAlertaVisto(pendente.id)}
          onVerDiagnostico={() => {
            marcarAlertaVisto(pendente.id)
            navigate('/central/chamados', { state: { abrirDetalheId: pendente.id } })
          }}
          onAceitar={() => {
            marcarAlertaVisto(pendente.id)
            navigate(`/central/chamados/${pendente.id}/aceitar`)
          }}
        />
      )}

      {/* Rail desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[72px] flex-col items-center gap-6 border-r border-slate-200 bg-white py-4">
        <button onClick={() => navigate('/central')} aria-label="Central OTIS" className="shrink-0">
          <LogoMark className="w-9 h-9" />
        </button>
        <Rail />
      </aside>

      {/* Drawer mobile */}
      {menu && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMenu(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white p-3 shadow-pop animate-slide-down">
            <div className="flex items-center justify-between px-2 h-14">
              <span className="text-[15px] font-extrabold tracking-tight">Central OTIS</span>
              <button onClick={() => setMenu(false)} aria-label="Fechar menu" className="btn-ghost h-9 w-9 rounded-lg">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <Rail expanded onNavigate={() => setMenu(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[72px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setMenu(true)}
              aria-label="Abrir menu"
              className="lg:hidden -ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-100"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <span className="flex items-center gap-2.5 whitespace-nowrap lg:gap-0">
              <LogoMark className="w-8 h-8 shrink-0 lg:hidden" />
              <span className="text-[17px] font-extrabold tracking-tight">Central OTIS</span>
            </span>

            {/* Seletor global de cidade/região — desktop e tablet */}
            <Select
              value={regiaoId}
              onChange={onRegiaoChange}
              options={options}
              ariaLabel="Selecionar cidade e região"
              className="hidden shrink-0 sm:block sm:w-[210px]"
            />

            <label className="relative ml-auto hidden md:block flex-1 max-w-xl">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
              <input type="search" placeholder="Buscar por RG, prédio ou elevador" className="input h-10 pl-9" aria-label="Buscar" />
            </label>

            <div className="ml-auto md:ml-0 flex items-center gap-2 sm:gap-3">
              <button aria-label="Notificações" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100">
                <IconBell className="w-5 h-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
              <button onClick={() => navigate('/')} className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-slate-50">
                <Avatar iniciais={u.iniciais} className="w-9 h-9 text-[13px]" />
                <span className="hidden sm:block text-left leading-tight">
                  <span className="block text-[13px] font-bold">{u.nome}</span>
                  <span className="block text-xs text-ink-500">{u.papel}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Segunda linha — busca e seletor de região no mobile */}
          <div className="flex gap-2 px-4 pb-3 md:hidden">
            <Select
              value={regiaoId}
              onChange={onRegiaoChange}
              options={options}
              ariaLabel="Selecionar cidade e região"
              className="w-[150px] shrink-0 sm:hidden"
            />
            <label className="relative min-w-0 flex-1">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
              <input type="search" placeholder="Buscar por RG ou prédio" className="input h-10 pl-9" aria-label="Buscar" />
            </label>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
