import { IconAlertTriangle, IconCheck, IconChevronDown, IconCpu, IconMinus, IconTrend, IconWifi, IconX } from './Icons'
import { useEffect, useRef, useState } from 'react'
import { nivelConfianca } from '../utils/diagnostico'
import { STATUS_STEPS } from '../state/ChamadosContext'

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

// ---------- Barra de confiança ----------
export function ConfiancaBar({ value, tone = 'otis', delay = 0 }) {
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
  if (score >= 81) return { label: 'Crítico', bar: 'bg-red-500', hex: '#ef4444', chip: 'text-red-600', chipBg: 'bg-red-50', chipRing: 'ring-red-200' }
  if (score >= 61) return { label: 'Alto', bar: 'bg-orange-500', hex: '#f97316', chip: 'text-orange-600', chipBg: 'bg-orange-50', chipRing: 'ring-orange-200' }
  if (score >= 31) return { label: 'Médio', bar: 'bg-amber-400', hex: '#f59e0b', chip: 'text-amber-600', chipBg: 'bg-amber-50', chipRing: 'ring-amber-200' }
  return { label: 'Baixo', bar: 'bg-emerald-500', hex: '#22c55e', chip: 'text-emerald-600', chipBg: 'bg-emerald-50', chipRing: 'ring-emerald-200' }
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

export function RiskBadge({ score, className = '' }) {
  const tone = riskTone(score)
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset whitespace-nowrap ${tone.chipBg} ${tone.chip} ${tone.chipRing} ${className}`}>
      {tone.label}
    </span>
  )
}

// ---------- Sparkline (mini gráfico de tendência) ----------
export function Sparkline({ values, color = '#0a2d8f', className = 'w-14 h-6' }) {
  if (!values || values.length === 0) return null
  const w = 60
  const h = 22
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const step = w / (values.length - 1 || 1)
  const points = values
    .map((v, i) => `${(i * step).toFixed(1)},${(h - 2 - ((v - min) / range) * (h - 4)).toFixed(1)}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------- Tendência (score subindo, descendo ou estável) ----------
const TENDENCIA = {
  subindo: { Icon: IconTrend, rotate: false, color: 'text-red-600' },
  descendo: { Icon: IconTrend, rotate: true, color: 'text-emerald-600' },
  estavel: { Icon: IconMinus, rotate: false, color: 'text-ink-500' },
}

export function TrendChip({ tendencia, variacao }) {
  const t = TENDENCIA[tendencia] ?? TENDENCIA.estavel
  const label = variacao > 0 ? `+${variacao}` : `${variacao}`
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-bold tabular-nums ${t.color}`}>
      <t.Icon className={`w-3.5 h-3.5 shrink-0 ${t.rotate ? 'rotate-90' : ''}`} />
      {label}
    </span>
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

// ---------- Modelo do elevador: antigo x moderno (IoT) ----------
export function TecnologiaChip({ tecnologia, className = '' }) {
  const iot = tecnologia === 'iot'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${
        iot ? 'bg-sky-50 text-sky-700 ring-sky-200' : 'bg-slate-100 text-ink-600 ring-slate-200'
      } ${className}`}
      title={iot ? 'Elevador com telemetria em tempo real' : 'Elevador sem telemetria — dados só por chamado'}
    >
      {iot ? <IconWifi className="w-3.5 h-3.5" /> : <IconCpu className="w-3.5 h-3.5" />}
      {iot ? 'Moderno · IoT' : 'Modelo antigo'}
    </span>
  )
}

// ---------- Nível de confiança do diagnóstico ----------
export function NivelBadge({ confianca, className = '' }) {
  const nivel = nivelConfianca(confianca)
  const tons = {
    certeza: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    provavel: 'bg-otis-50 text-otis-900 ring-otis-200',
    duvida: 'bg-amber-50 text-amber-700 ring-amber-200',
    incerteza: 'bg-slate-100 text-ink-600 ring-slate-200',
    'sem-dados': 'bg-slate-100 text-ink-500 ring-slate-200',
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${tons[nivel.chave]} ${className}`}
    >
      {nivel.label}
      {confianca != null && ` · ${confianca}%`}
    </span>
  )
}

// ---------- Situação do chamado (linha do tempo) ----------
export function StatusStepper({ status }) {
  const atual = Math.max(0, STATUS_STEPS.findIndex((s) => s.key === status))
  return (
    <ol className="space-y-3">
      {STATUS_STEPS.map((s, i) => {
        const feito = i <= atual
        const emAndamento = i === atual
        return (
          <li key={s.key} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                feito ? 'bg-otis-900 text-white' : 'bg-slate-200 text-ink-500'
              }`}
            >
              {feito ? <IconCheck className="w-3.5 h-3.5" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
            </span>
            <span className={`text-[13px] ${emAndamento ? 'font-bold text-ink-900' : feito ? 'font-medium text-ink-700' : 'text-ink-500'}`}>
              {s.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

// ---------- Alerta de novo chamado ao entrar ----------
export function LoginAlert({ show, onClose, titulo, children }) {
  if (!show) return null
  return (
    <div
      role="alert"
      className="animate-fade-up mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
        <IconAlertTriangle className="w-5 h-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-amber-900">{titulo}</p>
        <div className="mt-0.5 text-[13px] leading-relaxed text-amber-800">{children}</div>
      </div>
      <button
        onClick={onClose}
        aria-label="Dispensar alerta"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-amber-700 hover:bg-amber-100"
      >
        <IconX className="w-4 h-4" />
      </button>
    </div>
  )
}
