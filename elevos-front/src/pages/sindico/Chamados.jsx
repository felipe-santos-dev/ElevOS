import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SindicoLayout from '../../components/SindicoLayout'
import { Badge } from '../../components/UI'
import { IconPlus } from '../../components/Icons'
import { elevadores } from '../../data/mock'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'aberto', label: 'Abertos' },
  { id: 'resolvido', label: 'Resolvidos' },
]

export default function Chamados() {
  const [filtro, setFiltro] = useState('todos')

  const lista = useMemo(() => {
    const todos = elevadores.flatMap((el) =>
      el.chamados.map((c) => ({ ...c, rg: el.rg, torre: el.torre, elevador: el.nome })),
    )
    return filtro === 'todos' ? todos : todos.filter((c) => c.status === filtro)
  }, [filtro])

  return (
    <SindicoLayout>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Chamados</h1>
            <p className="mt-1 text-sm text-ink-500">{lista.length} chamados no período</p>
          </div>
          <Link to="/sindico/chamados/novo" className="btn-primary btn-md w-full sm:w-auto">
            <IconPlus className="w-4 h-4" />
            Abrir chamado
          </Link>
        </div>

        <div className="mt-5 flex gap-1 overflow-x-auto scrollbar-thin rounded-lg bg-slate-100 p-1 sm:inline-flex">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`h-9 shrink-0 rounded-md px-4 text-[13px] font-semibold transition-colors ${
                filtro === f.id ? 'bg-white text-otis-900 shadow-card' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <section className="card mt-4 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {lista.map((c, i) => (
              <li key={`${c.rg}-${c.data}-${i}`}>
                <Link
                  to={`/sindico/elevadores/${c.rg}`}
                  className="flex flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="text-[13px] text-ink-500 whitespace-nowrap sm:w-28">{c.data}</span>
                  <span className="text-sm font-semibold sm:flex-1">{c.titulo}</span>
                  <span className="text-[13px] text-ink-500 sm:w-52">
                    {c.torre} · {c.elevador} · {c.rg}
                  </span>
                  <Badge status={c.status} className="self-start sm:self-auto" />
                </Link>
              </li>
            ))}
            {lista.length === 0 && (
              <li className="px-5 py-12 text-center text-sm text-ink-500">Nenhum chamado neste filtro.</li>
            )}
          </ul>
        </section>
      </div>
    </SindicoLayout>
  )
}
