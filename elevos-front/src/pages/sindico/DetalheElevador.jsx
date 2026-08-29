import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import SindicoLayout from '../../components/SindicoLayout'
import { Badge, StatusDot } from '../../components/UI'
import { IconChevronLeft, IconPlus } from '../../components/Icons'
import { elevadores } from '../../data/mock'

function Metric({ titulo, valor, obs, tom = 'default' }) {
  const tons = { default: 'text-ink-500', alerta: 'text-amber-600' }
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <p className="text-[13px] text-ink-500">{titulo}</p>
      <p className="mt-1.5 text-[17px] font-bold leading-tight">{valor}</p>
      <p className={`mt-0.5 text-[13px] ${tons[tom]}`}>{obs}</p>
    </div>
  )
}

function Ficha({ label, valor }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[13px] text-ink-500">{label}</dt>
      <dd className="text-[13px] font-semibold text-right">{valor}</dd>
    </div>
  )
}

export default function DetalheElevador() {
  const { rg } = useParams()
  const navigate = useNavigate()
  const el = elevadores.find((e) => e.rg === rg)

  if (!el) return <Navigate to="/sindico" replace />

  const preventivaAtrasada = el.preventiva.ultimaObs.includes('meses')

  return (
    <SindicoLayout>
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link
            to="/sindico"
            className="flex items-center gap-1 text-[13px] font-semibold text-otis-700 hover:text-otis-900"
          >
            <IconChevronLeft className="w-4 h-4" />
            Meus elevadores
          </Link>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-[22px]">
            {el.torre} · {el.nome}
          </h1>
          <span className="text-[13px] text-ink-500">RG: {el.rg}</span>
          <span className="ml-auto flex items-center gap-2 text-[13px] font-medium text-ink-700">
            <StatusDot status={el.operacao === 'Parado' ? 'manutencao' : 'normal'} />
            {el.operacao}
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          {/* Coluna principal */}
          <div className="space-y-4">
            <section className="card overflow-hidden">
              <header className="flex items-center justify-between px-5 py-4">
                <h2 className="text-[15px] font-bold">Últimos chamados</h2>
                <Link to="/sindico/chamados" className="text-[13px] font-semibold text-otis-700 hover:text-otis-900">
                  Ver histórico completo
                </Link>
              </header>
              <ul className="divide-y divide-slate-100 border-t border-slate-100">
                {el.chamados.map((c) => (
                  <li key={c.data} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="text-[13px] text-ink-500 whitespace-nowrap sm:w-28">{c.data}</span>
                    <span className="text-[13px] font-medium sm:flex-1">{c.titulo}</span>
                    <Badge status={c.status} className="self-start sm:self-auto" />
                  </li>
                ))}
              </ul>
            </section>

            <section className="card p-5">
              <h2 className="text-[15px] font-bold">Manutenções preventivas</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Metric
                  titulo="Última"
                  valor={el.preventiva.ultima}
                  obs={el.preventiva.ultimaObs}
                  tom={preventivaAtrasada ? 'alerta' : 'default'}
                />
                <Metric titulo="Próxima" valor={el.preventiva.proxima} obs={el.preventiva.proximaObs} />
                <Metric titulo="Chamados 12 meses" valor={el.preventiva.chamados12m} obs={el.preventiva.chamadosObs} />
              </div>
            </section>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-4">
            <section className="card p-5">
              <h2 className="text-[15px] font-bold">Ficha do equipamento</h2>
              <dl className="mt-3 divide-y divide-slate-100">
                <Ficha label="RG" valor={el.rg} />
                <Ficha label="Modelo" valor={el.modelo} />
                <Ficha label="Capacidade" valor={el.capacidade} />
                <Ficha label="Paradas" valor={el.paradas} />
                <Ficha label="Contrato" valor={el.contrato} />
              </dl>
            </section>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/sindico/chamados/novo?rg=${el.rg}`)}
                className="btn-primary btn-lg w-full"
              >
                <IconPlus className="w-4 h-4" />
                Abrir chamado
              </button>
              <Link to="/sindico/chamados" className="btn-outline btn-lg w-full">
                Ver histórico completo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SindicoLayout>
  )
}
