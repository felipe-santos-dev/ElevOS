import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import TecnicoShell from '../../components/TecnicoShell'
import { Badge, ConfiancaBar, NivelBadge, StatusStepper, Toast } from '../../components/UI'
import { IconBox, IconCheckCircle, IconChevronLeft, IconClock, IconMapPin } from '../../components/Icons'
import { usuarios } from '../../data/mock'
import { useChamados } from '../../state/ChamadosContext'

export default function DetalheChamado() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { chamados, confirmarSaida } = useChamados()
  const chamado = chamados.find((c) => c.id === id)
  const u = usuarios.tecnico

  const [minutos, setMinutos] = useState(25)
  const [confirmado, setConfirmado] = useState(false)

  // Só é possível ver o chamado se ele estiver atribuído a este técnico.
  if (!chamado || chamado.tecnicoId !== u.id) return <Navigate to="/tecnico" replace />

  const saida = () => {
    confirmarSaida(chamado.id)
    setConfirmado(true)
  }

  return (
    <TecnicoShell>
      <Toast show={confirmado}>
        <IconCheckCircle className="w-5 h-5 shrink-0" />
        Saída confirmada · status atualizado para “A caminho”
      </Toast>

      <header className="sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-2 py-3">
        <button onClick={() => navigate('/tecnico')} aria-label="Voltar" className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-100">
          <IconChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight">{chamado.local}</p>
          <p className="text-[13px] text-ink-500">RG: {chamado.rg}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-8 pt-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-500">
          <Badge status={chamado.urgencia === 'Alta' ? 'manutencao' : 'aguardando'}>
            Urgência {chamado.urgencia.toLowerCase()}
          </Badge>
          <span className="flex items-center gap-1.5">
            <IconMapPin className="w-4 h-4" />
            {chamado.distancia}
          </span>
          <span className="flex items-center gap-1.5">
            <IconClock className="w-4 h-4" />
            {chamado.sla}
          </span>
        </div>

        {/* Situação */}
        <section className="card mt-4 p-4">
          <h2 className="text-[15px] font-bold">Situação</h2>
          <div className="mt-3.5">
            <StatusStepper status={chamado.status} />
          </div>
        </section>

        {/* Diagnóstico */}
        {chamado.causas.length > 0 ? (
          <section className="card mt-4 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold">Diagnóstico</h2>
              <NivelBadge confianca={chamado.confianca} />
            </div>
            <ul className="mt-3.5 space-y-2.5">
              {chamado.causas.map((c, i) => (
                <li key={c.nome} className="grid grid-cols-[86px_1fr_40px] items-center gap-2.5">
                  <span className="truncate text-[13px] font-medium">{c.nome}</span>
                  <ConfiancaBar value={c.confianca} tone={i === 0 ? 'otis' : 'soft'} delay={i * 120} />
                  <span className="text-right text-[13px] font-bold tabular-nums">{c.confianca}%</span>
                </li>
              ))}
            </ul>
            {chamado.pecas.length > 0 && (
              <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-3 text-[13px] text-ink-700">
                <IconBox className="w-4 h-4 mt-0.5 shrink-0 text-ink-500" />
                <span>
                  <span className="font-semibold">Peças: </span>
                  {chamado.pecas.join(', ')}
                </span>
              </p>
            )}
          </section>
        ) : (
          <section className="card mt-4 p-4">
            <h2 className="text-[15px] font-bold">Diagnóstico</h2>
            <p className="mt-2 text-[13px] text-ink-500">
              Chamado aberto manualmente — sem diagnóstico automático. Avalie no local.
            </p>
          </section>
        )}

        {/* Orientação */}
        <p className="mt-4 rounded-xl border border-otis-200 border-l-4 border-l-otis-600 bg-otis-50 p-4 text-[13px] leading-relaxed text-ink-700">
          {chamado.nota}
        </p>

        {/* Tempo estimado */}
        <section className="card mt-4 p-4">
          <label htmlFor="minutos" className="label">Tempo estimado (minutos)</label>
          <div className="flex items-center gap-2">
            <input
              id="minutos"
              type="number"
              min="5"
              max="240"
              step="5"
              value={minutos}
              onChange={(e) => setMinutos(Number(e.target.value))}
              className="input flex-1"
            />
            <button
              onClick={() => setMinutos((m) => Math.max(5, m - 5))}
              aria-label="Diminuir 5 minutos"
              className="btn-outline h-11 w-11 text-lg"
            >
              −
            </button>
            <button
              onClick={() => setMinutos((m) => Math.min(240, m + 5))}
              aria-label="Aumentar 5 minutos"
              className="btn-outline h-11 w-11 text-lg"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-[13px] text-ink-500">
            O síndico acompanha a previsão de chegada em tempo real.
          </p>
        </section>
      </div>

      {/* Ação fixa — não existe "aceitar", só confirmar saída. O ciclo só
          se fecha quando o feedback é salvo em Finalizar. */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
        {chamado.status === 'a-caminho' || chamado.status === 'concluido' ? (
          <button
            onClick={() => navigate(`/tecnico/chamados/${chamado.id}/finalizar`)}
            disabled={chamado.status === 'concluido'}
            className="btn-primary btn-lg w-full"
          >
            {chamado.status === 'concluido' ? 'Chamado concluído' : 'Registrar finalização'}
          </button>
        ) : (
          <button onClick={saida} className="btn-primary btn-lg w-full">
            Confirmar saída
          </button>
        )}
      </div>
    </TecnicoShell>
  )
}
