import SindicoLayout from '../../components/SindicoLayout'
import { ConfiancaBar } from '../../components/UI'
import { IconDownload } from '../../components/Icons'
import { elevadores } from '../../data/mock'

const indicadores = [
  { titulo: 'Chamados em 12 meses', valor: '13', obs: '11 resolvidos' },
  { titulo: 'Tempo médio de atendimento', valor: '3h12', obs: 'dentro do SLA de 4h' },
  { titulo: 'Disponibilidade da frota', valor: '96,4%', obs: 'últimos 30 dias' },
]

const causas = [
  { nome: 'Motor / rolamento', valor: 38 },
  { nome: 'Porta e sensor', valor: 31 },
  { nome: 'Freio', valor: 18 },
  { nome: 'Comando elétrico', valor: 13 },
]

export default function Relatorios() {
  return (
    <SindicoLayout>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Relatórios</h1>
            <p className="mt-1 text-sm text-ink-500">Condomínio Vista Verde · últimos 12 meses</p>
          </div>
          <button className="btn-outline btn-md w-full sm:w-auto">
            <IconDownload className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {indicadores.map((i, idx) => (
            <div key={i.titulo} className="card animate-fade-up p-5" style={{ animationDelay: `${idx * 60}ms` }}>
              <p className="text-[13px] text-ink-500">{i.titulo}</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none tracking-tight">{i.valor}</p>
              <p className="mt-1.5 text-[13px] text-ink-500">{i.obs}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="card p-5">
            <h2 className="text-[15px] font-bold">Causas mais frequentes</h2>
            <ul className="mt-4 space-y-3.5">
              {causas.map((c, i) => (
                <li key={c.nome} className="grid grid-cols-[120px_1fr_44px] items-center gap-3 sm:grid-cols-[150px_1fr_48px]">
                  <span className="truncate text-[13px] font-medium">{c.nome}</span>
                  <ConfiancaBar value={c.valor} tone={i === 0 ? 'otis' : 'soft'} delay={i * 100} />
                  <span className="text-right text-[13px] font-bold tabular-nums">{c.valor}%</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card overflow-hidden">
            <header className="px-5 py-4">
              <h2 className="text-[15px] font-bold">Chamados por elevador</h2>
            </header>
            <ul className="divide-y divide-slate-100 border-t border-slate-100">
              {elevadores.map((el) => (
                <li key={el.rg} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold">
                      {el.torre} · {el.nome}
                    </span>
                    <span className="block text-[13px] text-ink-500">{el.rg}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[17px] font-bold leading-none">{el.preventiva.chamados12m}</span>
                    <span className="block text-xs text-ink-500">{el.preventiva.chamadosObs}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </SindicoLayout>
  )
}
