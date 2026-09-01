import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import SindicoLayout from '../../components/SindicoLayout'
import CentralLayout from '../../components/CentralLayout'
import { Badge, STATUS, StatusDot, TecnologiaChip } from '../../components/UI'
import { IconChevronLeft, IconPlus } from '../../components/Icons'
import { buscarElevador } from '../../utils/elevadores'

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

// Usada tanto pelo síndico (/sindico/elevadores/:rg) quanto pela Central
// (/central/elevadores/:rg) — o "origem" decide a moldura (sidebar do
// síndico ou rail da Central) e para onde os links voltam, para o
// operador da Central nunca ser jogado dentro do app do síndico.
export default function DetalheElevador({ origem = 'sindico' }) {
  const { rg } = useParams()
  const navigate = useNavigate()
  const el = buscarElevador(rg)
  const [regiaoId, setRegiaoId] = useState(el?.regiaoId ?? 'sp-zona-sul')

  if (!el) return <Navigate to={origem === 'central' ? '/central/elevadores' : '/sindico'} replace />

  const preventivaAtrasada = el.preventiva?.ultimaObs?.includes('meses') ?? false
  const rotaRaiz = origem === 'central' ? '/central/elevadores' : '/sindico'
  const rotaRaizLabel = origem === 'central' ? 'Visão por elevador' : 'Meus elevadores'
  const rotaChamados = origem === 'central' ? '/central/chamados' : '/sindico/chamados'
  const rotaAbrirChamado = origem === 'central' ? `/central/chamados/novo?rg=${el.rg}` : `/sindico/chamados/novo?rg=${el.rg}`

  const conteudo = (
    <div className="mx-auto max-w-6xl">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link
          to={rotaRaiz}
          className="flex items-center gap-1 text-[13px] font-semibold text-otis-700 hover:text-otis-900"
        >
          <IconChevronLeft className="w-4 h-4" />
          {rotaRaizLabel}
        </Link>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-[22px]">
          {el.torre} · {el.nome}
        </h1>
        <span className="text-[13px] text-ink-500">RG: {el.rg}</span>
        <span className="ml-auto flex items-center gap-2 text-[13px] font-medium text-ink-700">
          <StatusDot status={el.operacao ? (el.operacao === 'Parado' ? 'manutencao' : 'normal') : el.status} />
          {el.operacao ?? el.statusLabel ?? STATUS[el.status]?.label ?? el.status}
        </span>
      </div>
      {el.condominio && <p className="mt-1 text-[13px] text-ink-500">{el.condominio}</p>}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Coluna principal */}
        <div className="space-y-4">
          <section className="card overflow-hidden">
            <header className="flex items-center justify-between px-5 py-4">
              <h2 className="text-[15px] font-bold">Últimos chamados</h2>
              <Link to={rotaChamados} className="text-[13px] font-semibold text-otis-700 hover:text-otis-900">
                Ver histórico completo
              </Link>
            </header>
            {el.chamados && el.chamados.length > 0 ? (
              <ul className="divide-y divide-slate-100 border-t border-slate-100">
                {el.chamados.map((c) => (
                  <li key={c.data} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="text-[13px] text-ink-500 whitespace-nowrap sm:w-28">{c.data}</span>
                    <span className="text-[13px] font-medium sm:flex-1">{c.titulo}</span>
                    <Badge status={c.status} className="self-start sm:self-auto" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border-t border-slate-100 px-5 py-6 text-[13px] text-ink-500">
                Sem histórico de chamados registrado para este elevador.
              </p>
            )}
          </section>

          {el.preventiva && (
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
          )}
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          <section className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-bold">Ficha do equipamento</h2>
              <TecnologiaChip tecnologia={el.tecnologia} />
            </div>
            <dl className="mt-3 divide-y divide-slate-100">
              <Ficha label="RG" valor={el.rg} />
              {el.modelo && <Ficha label="Modelo" valor={el.modelo} />}
              {el.capacidade && <Ficha label="Capacidade" valor={el.capacidade} />}
              {el.paradas && <Ficha label="Paradas" valor={el.paradas} />}
              {el.contrato && <Ficha label="Contrato" valor={el.contrato} />}
            </dl>
          </section>

          <div className="space-y-3">
            <button onClick={() => navigate(rotaAbrirChamado)} className="btn-primary btn-lg w-full">
              <IconPlus className="w-4 h-4" />
              Abrir chamado
            </button>
            <Link to={rotaChamados} className="btn-outline btn-lg w-full">
              Ver histórico completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  if (origem === 'central') {
    return (
      <CentralLayout regiaoId={regiaoId} onRegiaoChange={setRegiaoId}>
        {conteudo}
      </CentralLayout>
    )
  }

  return <SindicoLayout>{conteudo}</SindicoLayout>
}
