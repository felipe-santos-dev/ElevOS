import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { usuarios } from '../data/mock'
import { Avatar } from './UI'
import Logo from './Logo'
import {
  IconBell, IconBuilding, IconChart, IconList, IconSearch, IconSettings, IconX,
} from './Icons'

const nav = [
  { to: '/sindico', label: 'Meus elevadores', Icon: IconBuilding, end: true },
  { to: '/sindico/chamados', label: 'Chamados', Icon: IconList },
  { to: '/sindico/relatorios', label: 'Relatórios', Icon: IconChart },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {nav.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-otis-50 text-otis-900 font-semibold' : 'text-ink-500 hover:bg-slate-50 hover:text-ink-900'
            }`
          }
        >
          <Icon className="w-5 h-5 shrink-0" />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default function SindicoLayout({ children }) {
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const u = usuarios.sindico

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center px-5 h-[72px]">
          <Logo size="sm" />
        </div>
        <div className="flex-1 px-3">
          <NavItems />
        </div>
        <div className="px-3 pb-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-slate-50 hover:text-ink-900">
            <IconSettings className="w-5 h-5 shrink-0" />
            Configurações
          </button>
        </div>
      </aside>

      {/* Drawer mobile */}
      {menu && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMenu(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white p-3 shadow-pop animate-slide-down">
            <div className="flex items-center justify-between px-2 h-14">
              <Logo size="sm" />
              <button onClick={() => setMenu(false)} aria-label="Fechar menu" className="btn-ghost h-9 w-9 rounded-lg">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <NavItems onNavigate={() => setMenu(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setMenu(true)}
            aria-label="Abrir menu"
            className="lg:hidden -ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-100"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <label className="relative flex-1 max-w-lg">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar elevador ou RG"
              className="input h-11 pl-9 bg-white"
              aria-label="Buscar elevador ou RG"
            />
          </label>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <button aria-label="Notificações" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-slate-100">
              <IconBell className="w-5 h-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <div className="hidden sm:block h-8 w-px bg-slate-200" />
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-slate-50">
              <Avatar iniciais={u.iniciais} className="w-9 h-9 text-[13px]" />
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-[13px] font-bold">{u.nome}</span>
                <span className="block text-xs text-ink-500">{u.papel}</span>
              </span>
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
