import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import TecnicoShell from '../../components/TecnicoShell'
import { Toast } from '../../components/UI'
import { IconCheckCircle, IconChevronLeft, IconPlus, IconX, IconXCircle } from '../../components/Icons'
import { pecasDisponiveis, usuarios } from '../../data/mock'
import { useChamados } from '../../state/ChamadosContext'

const RESULTADOS = [
  { id: 'resolvido', titulo: 'Resolvido', obs: 'Serviço concluído no local', Icon: IconCheckCircle, cor: 'emerald' },
  { id: 'nao-resolvido', titulo: 'Não foi possível resolver', obs: 'Requer peça ou nova visita', Icon: IconXCircle, cor: 'rose' },
]

const AVALIACOES = [
  { id: 'sim', label: 'Sim' },
  { id: 'parcialmente', label: 'Parcialmente' },
  { id: 'nao', label: 'Não' },
]

export default function FinalizarChamado() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { chamados, salvarFeedback } = useChamados()
  const chamado = chamados.find((c) => c.id === id)
  const u = usuarios.tecnico

  const [resultado, setResultado] = useState('resolvido')
  const [avaliacao, setAvaliacao] = useState('sim')
  const [observacoes, setObservacoes] = useState(
    'Rolamento trocado. Motor dentro da tolerância — recomendo nova inspeção em 60 dias.',
  )
  const [pecas, setPecas] = useState([
    { nome: 'Rolamento', qtd: 1 },
    { nome: 'Motor X34', qtd: 1 },
  ])
  const [addAberto, setAddAberto] = useState(false)
  const [salvo, setSalvo] = useState(false)

  // Só é possível finalizar um chamado atribuído a este técnico.
  if (!chamado || chamado.tecnicoId !== u.id) return <Navigate to="/tecnico" replace />

  const removerPeca = (nome) => setPecas((p) => p.filter((x) => x.nome !== nome))
  const adicionarPeca = (nome) => {
    setPecas((p) => (p.some((x) => x.nome === nome) ? p : [...p, { nome, qtd: 1 }]))
    setAddAberto(false)
  }

  const salvar = () => {
    // O ciclo do chamado só se confirma (status "Concluído") aqui, ao salvar o feedback.
    salvarFeedback(chamado.id, { resultado, avaliacao, observacoes, pecas })
    setSalvo(true)
    setTimeout(() => navigate('/tecnico'), 1800)
  }

  const disponiveis = pecasDisponiveis.filter((p) => !pecas.some((x) => x.nome === p))

  return (
    <TecnicoShell>
      <Toast show={salvo}>
        <IconCheckCircle className="w-5 h-5 shrink-0" />
        Feedback registrado · vira evidência no banco histórico
      </Toast>

      <header className="sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-2 py-3">
        <button onClick={() => navigate(-1)} aria-label="Voltar" className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-100">
          <IconChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight">Finalizar</p>
          <p className="truncate text-[13px] text-ink-500">{chamado.local} · em atendimento há 1h12</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-8 pt-4">
        {/* Resultado */}
        <div className="space-y-3">
          {RESULTADOS.map((r) => {
            const ativo = resultado === r.id
            const cores = {
              emerald: ativo ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200',
              rose: ativo ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' : 'border-slate-200',
            }
            const icone = { emerald: 'text-emerald-600', rose: 'text-rose-500' }
            return (
              <button
                key={r.id}
                onClick={() => setResultado(r.id)}
                className={`flex w-full items-center gap-3 rounded-xl border bg-white p-4 text-left transition-all ${cores[r.cor]}`}
              >
                <r.Icon className={`w-6 h-6 shrink-0 ${icone[r.cor]}`} />
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold">{r.titulo}</span>
                  <span className="block text-[13px] text-ink-500">{r.obs}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Avaliação do diagnóstico */}
        <fieldset className="mt-5">
          <legend className="label">O diagnóstico estava correto?</legend>
          <div className="space-y-2">
            {AVALIACOES.map((a) => {
              const ativo = avaliacao === a.id
              return (
                <label
                  key={a.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3.5 transition-all ${
                    ativo ? 'border-otis-600 ring-1 ring-otis-600' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="avaliacao"
                    value={a.id}
                    checked={ativo}
                    onChange={() => setAvaliacao(a.id)}
                    className="h-4 w-4 accent-otis-900"
                  />
                  <span className="text-[15px] font-medium">{a.label}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {/* Observações */}
        <div className="mt-5">
          <label htmlFor="obs" className="label">
            Observações <span className="font-normal text-ink-500">(opcional)</span>
          </label>
          <textarea
            id="obs"
            rows={4}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="input h-auto resize-none py-3 leading-relaxed"
          />
        </div>

        {/* Peças */}
        <div className="mt-5">
          <p className="label">Peças utilizadas</p>
          <div className="flex flex-wrap gap-2">
            {pecas.map((p) => (
              <span
                key={p.nome}
                className="inline-flex items-center gap-1.5 rounded-md bg-otis-50 px-2.5 py-1.5 text-[13px] font-semibold text-otis-900"
              >
                {p.nome} ×{p.qtd}
                <button onClick={() => removerPeca(p.nome)} aria-label={`Remover ${p.nome}`} className="text-otis-700 hover:text-otis-950">
                  <IconX className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {addAberto ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {disponiveis.map((p) => (
                <button
                  key={p}
                  onClick={() => adicionarPeca(p)}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] font-medium hover:bg-slate-50"
                >
                  {p}
                </button>
              ))}
              {disponiveis.length === 0 && <span className="text-[13px] text-ink-500">Todas as peças já foram adicionadas.</span>}
            </div>
          ) : (
            <button onClick={() => setAddAberto(true)} className="btn-outline mt-2 h-9 px-3 text-[13px]">
              <IconPlus className="w-4 h-4" />
              Adicionar
            </button>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
        <button onClick={salvar} disabled={salvo} className="btn-primary btn-lg w-full">
          {salvo ? 'Salvando…' : 'Salvar feedback'}
        </button>
      </div>
    </TecnicoShell>
  )
}
