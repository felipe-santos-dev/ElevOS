import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LogoMark } from '../../components/Logo'
import { IconInfo } from '../../components/Icons'
import { perguntas, TOTAL_PERGUNTAS_BANCO } from '../../data/mock'
import { buscarElevador } from '../../utils/elevadores'
import { calcularDiagnostico, LIMITE_CERTEZA } from '../../utils/diagnostico'

const OPCOES = [
  { valor: 'sim', label: 'Sim' },
  { valor: 'nao', label: 'Não' },
  { valor: 'nao-sei', label: 'Não sei' },
]

// O mesmo fluxo de 12 perguntas serve o síndico (/sindico/...) e a
// Central (/central/...) — só muda para onde ele navega no final.
export default function FluxoPerguntas({ origem = 'sindico' }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rg = params.get('rg') ?? 'ES-1024'
  const el = buscarElevador(rg) ?? buscarElevador('ES-1024')
  const rotaRaiz = origem === 'central' ? '/central/elevadores' : '/sindico'
  const rotaDiagnostico = origem === 'central' ? '/central/chamados/novo/diagnostico' : '/sindico/chamados/novo/diagnostico'

  const [indice, setIndice] = useState(0)
  const [respostas, setRespostas] = useState({})

  const pergunta = perguntas[indice]
  const progresso = ((indice + 1) / TOTAL_PERGUNTAS_BANCO) * 100

  const responder = (valor) => {
    const novas = { ...respostas, [pergunta.id]: valor }
    setRespostas(novas)

    // Parada antecipada: igual a motor_simulacao.py — depois de cada
    // resposta, recalcula a confiança de todas as falhas; se a maior
    // já atingir o limite de certeza, encerra o questionário na hora,
    // mesmo que ainda faltem perguntas no banco.
    const diagnostico = calcularDiagnostico(perguntas, novas)
    const maiorConfianca = diagnostico.causas[0]?.confianca ?? 0
    const paradaAntecipada = diagnostico.confianca !== null && maiorConfianca >= LIMITE_CERTEZA

    if (paradaAntecipada || indice >= perguntas.length - 1) {
      navigate(`${rotaDiagnostico}?rg=${rg}`, { state: { respostas: novas } })
    } else {
      setIndice(indice + 1)
    }
  }

  const voltar = () => {
    if (indice === 0) navigate(-1)
    else setIndice(indice - 1)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Topbar */}
      <header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <Link to={rotaRaiz} aria-label="ElevOS" className="flex shrink-0 items-center gap-2.5">
          <LogoMark className="w-8 h-8" />
          <span className="hidden text-[17px] font-extrabold tracking-tight sm:block">ElevOS</span>
        </Link>
        <span className="hidden h-6 w-px bg-slate-200 sm:block" />
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight">Novo chamado</p>
          <p className="truncate text-[13px] text-ink-500">
            {el.local} · RG {el.rg}
          </p>
        </div>
        <Link to="/" className="ml-auto text-[13px] font-semibold text-ink-500 hover:text-ink-900">
          Sair
        </Link>
      </header>

      {/* Conteúdo */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-2xl">
          {/* Progresso */}
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-otis-900 transition-[width] duration-500 ease-out"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <span className="shrink-0 text-[13px] font-semibold text-ink-500">
              <span className="text-ink-900">{indice + 1}</span> / {TOTAL_PERGUNTAS_BANCO}
            </span>
          </div>

          {/* Card da pergunta */}
          <div key={pergunta.id} className="card mt-6 animate-fade-up px-5 py-8 text-center sm:px-10 sm:py-10">
            <h1 className="text-xl font-extrabold leading-snug tracking-tight sm:text-[26px]">
              {pergunta.titulo}
            </h1>
            <p className="mt-2.5 text-sm text-ink-500">{pergunta.ajuda}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {OPCOES.map((o) => {
                const ativo = respostas[pergunta.id] === o.valor
                const estilo =
                  o.valor === 'nao-sei'
                    ? 'bg-slate-100 text-ink-500 hover:bg-slate-200'
                    : o.valor === 'sim'
                    ? 'bg-otis-900 text-white hover:bg-otis-950'
                    : 'bg-white text-ink-900 border border-slate-300 hover:bg-slate-50'
                return (
                  <button
                    key={o.valor}
                    onClick={() => responder(o.valor)}
                    className={`btn btn-lg w-full ${estilo} ${ativo ? 'ring-2 ring-otis-500 ring-offset-2' : ''}`}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-5 flex flex-col items-center justify-between gap-3 text-[13px] sm:flex-row">
            <button onClick={voltar} className="font-semibold text-ink-500 hover:text-ink-900">
              Voltar
            </button>
            <span className="flex items-center gap-1.5 text-ink-500">
              <IconInfo className="w-4 h-4 shrink-0" />
              Suas respostas alimentam o diagnóstico por pontuação
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
