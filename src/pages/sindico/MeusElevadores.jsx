import { Link, useNavigate } from 'react-router-dom'
import SindicoLayout from '../../components/SindicoLayout'
import { Badge, LoginAlert, StatusLine, TecnologiaChip } from '../../components/UI'
import { IconChevronRight, IconPlus } from '../../components/Icons'
import { elevadores, ultimosChamadosSindico, usuarios } from '../../data/mock'
import { useLoginAlert } from '../../hooks/useLoginAlert'

export default function MeusElevadores() {
  const navigate = useNavigate()
  const u = usuarios.sindico
  const alerta = useLoginAlert()
  const ultimo = ultimosChamadosSindico[0]

  return (
    <SindicoLayout>
      <div className="mx-auto max-w-6xl">
        <LoginAlert show={alerta.show} onClose={alerta.dismiss} titulo="Chamado aberto recentemente">
          {ultimo.torre} · {ultimo.elevador} (RG {ultimo.rg}) — {ultimo.titulo}, registrado em {ultimo.data}.
        </LoginAlert>

        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Olá, {u.nome.split(' ')[0]}</h1>
            <p className="mt-1 text-sm text-ink-500">
              {u.condominio} · {elevadores.length} elevadores
            </p>
          </div>
          <button onClick={() => navigate('/sindico/chamados/novo')} className="btn-primary btn-md w-full sm:w-auto">
            <IconPlus className="w-4 h-4" />
            Abrir chamado
          </button>
        </div>

        {/* Cards dos elevadores */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {elevadores.map((el, i) => (
            <Link
              key={el.rg}
              to={`/sindico/elevadores/${el.rg}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className="card group animate-fade-up p-5 transition-shadow hover:shadow-pop focus:outline-none focus-visible:ring-2 focus-visible:ring-otis-500"
            >
              <div className="flex items-center justify-between">
                <StatusLine status={el.status} label={el.statusLabel} />
                <IconChevronRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-500" />
              </div>

              <p className="mt-4 text-[17px] font-bold leading-tight">
                {el.torre} · <span className="text-otis-900">{el.nome}</span>
              </p>
              <p className="mt-1 text-[13px] text-ink-500">RG: {el.rg}</p>
              <TecnologiaChip tecnologia={el.tecnologia} className="mt-2.5" />

              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-[13px] text-ink-500">{el.resumo}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Últimos chamados */}
        <section className="card mt-6 overflow-hidden">
          <header className="flex items-center justify-between px-5 py-4">
            <h2 className="text-[15px] font-bold">Últimos chamados</h2>
            <Link to="/sindico/chamados" className="text-[13px] font-semibold text-otis-700 hover:text-otis-900">
              Ver todos
            </Link>
          </header>

          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {ultimosChamadosSindico.map((c) => (
              <li key={c.rg + c.data}>
                <Link
                  to={`/sindico/elevadores/${c.rg}`}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4"
                >
                  <StatusLine status={c.dot} label={`${c.torre} · ${c.elevador}`} />
                  <span className="pl-4 text-[13px] text-ink-500 sm:flex-1 sm:pl-0">{c.titulo}</span>
                  <span className="flex items-center gap-3 pl-4 sm:pl-0">
                    <span className="text-[13px] text-ink-500 whitespace-nowrap">{c.data}</span>
                    <Badge status={c.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SindicoLayout>
  )
}
