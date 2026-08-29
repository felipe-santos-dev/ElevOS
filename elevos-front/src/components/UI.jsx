import { IconChevronDown } from './Icons'
import { useEffect, useRef, useState } from 'react'

// ---------- Status ----------
export const STATUS = {
  normal:      { label: 'Normal',        dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  chamado:     { label: 'Chamado aberto',dot: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
  aguardando:  { label: 'Aguardando',    dot: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
  manutencao:  { label: 'Manutenção',    dot: 'bg-rose-500',    chip: 'bg-rose-50 text-rose-700 ring-rose-200' },
  aberto:      { label: 'Aberto',        dot: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
  resolvido:   { label: 'Resolvido',     dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  'a-caminho': { label: 'A caminho',     dot: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
}

export function StatusDot({ status, className = '' }) {
  const s = STATUS[status] ?? STATUS.normal
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${s.dot} ${className}`} />
}

export function Badge({ status, children, className = '' }) {
  const s = STATUS[status] ?? STATUS.normal
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${s.chip} ${className}`}
    >
      {children ?? s.label}
    </span>
  )
}

export function StatusLine({ status, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-700">
      <StatusDot status={status} />
      {label ?? STATUS[status]?.label}
    </span>
  )
}

// ---------- Barra de probabilidade ----------
export function ProbBar({ value, tone = 'otis', delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), 80 + delay)
    return () => clearTimeout(t)
  }, [value, delay])
  const tones = {
    otis: 'bg-otis-600',
    soft: 'bg-otis-400',
    faint: 'bg-otis-200',
  }
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${tones[tone] ?? tones.otis}`}
        style={{ width: `${w}%` }}
      />
    </div>
  )
}

export function riskTone(score) {
  if (score >= 81) return { label: 'Crítico', bar: 'bg-red-500', chip: 'text-red-600' }
  if (score >= 61) return { label: 'Alto', bar: 'bg-orange-500', chip: 'text-orange-600' }
  if (score >= 31) return { label: 'Médio', bar: 'bg-amber-400', chip: 'text-amber-600' }
  return { label: 'Baixo', bar: 'bg-emerald-500', chip: 'text-emerald-600' }
}

export function ScoreBar({ score }) {
  const tone = riskTone(score)
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(score), 100)
    return () => clearTimeout(t)
  }, [score])
  return (
    <div className="h-2 w-full min-w-[80px] rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${tone.bar}`} style={{ width: `${w}%` }} />
    </div>
  )
}

// ---------- Select customizado ----------
export function Select({ value, onChange, options, className = '', ariaLabel }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  const current = options.find((o) => o.value === value)
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 flex items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-ink-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-otis-500"
      >
        <span className="truncate">{current?.label ?? '—'}</span>
        <IconChevronDown className={`w-4 h-4 text-ink-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-64 overflow-auto scrollbar-thin rounded-lg border border-slate-200 bg-white p-1 shadow-pop animate-slide-down"
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                  o.value === value ? 'bg-otis-50 text-otis-900 font-semibold' : 'text-ink-700 hover:bg-slate-50'
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ---------- Toast ----------
export function Toast({ show, children, tone = 'success' }) {
  const tones = {
    success: 'bg-emerald-500 text-white',
    info: 'bg-otis-900 text-white',
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-3 top-3 z-50 transition-all duration-300 sm:inset-x-auto sm:right-4 sm:max-w-sm ${
        show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-pop ${tones[tone]}`}>
        {children}
      </div>
    </div>
  )
}

// ---------- Avatar ----------
export function Avatar({ iniciais, className = '' }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-otis-100 text-otis-900 text-xs font-bold shrink-0 ${className}`}
    >
      {iniciais}
    </span>
  )
}
