import { useState } from 'react'
import CentralLayout from '../../components/CentralLayout'
import { Avatar, Badge } from '../../components/UI'

const tecnicos = [
  { nome: 'Rafael Silva', iniciais: 'RS', regiao: 'Zona Sul', abertos: 3, preventivas: 4, status: 'chamado', hoje: 'Torre A · Elevador 2' },
  { nome: 'Marina Costa', iniciais: 'MC', regiao: 'Zona Sul', abertos: 1, preventivas: 2, status: 'normal', hoje: 'Aurora · Elevador 1' },
  { nome: 'Diego Farias', iniciais: 'DF', regiao: 'Zona Sul', abertos: 0, preventivas: 5, status: 'normal', hoje: 'Sem chamado atribuído' },
  { nome: 'Paula Nunes', iniciais: 'PN', regiao: 'Zona Sul', abertos: 2, preventivas: 1, status: 'chamado', hoje: 'Centro Comercial · Elevador 4' },
]

export default function Equipe() {
  const [regiaoId, setRegiaoId] = useState('sp-zona-sul')

  return (
    <CentralLayout regiaoId={regiaoId} onRegiaoChange={setRegiaoId}>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Equipe</h1>
        <p className="mt-1 text-sm text-ink-500">{tecnicos.length} técnicos em campo</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tecnicos.map((t, i) => (
            <article key={t.nome} className="card animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3">
                <Avatar iniciais={t.iniciais} className="w-11 h-11 text-sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{t.nome}</p>
                  <p className="text-[13px] text-ink-500">{t.regiao}</p>
                </div>
              </div>

              <p className="mt-4 truncate text-[13px] text-ink-700">{t.hoje}</p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[13px] text-ink-500">
                  <span className="font-bold text-ink-900">{t.abertos}</span> urgentes ·{' '}
                  <span className="font-bold text-ink-900">{t.preventivas}</span> preventivas
                </span>
                <Badge status={t.status}>{t.status === 'chamado' ? 'Em rota' : 'Disponível'}</Badge>
              </div>
            </article>
          ))}
        </div>
      </div>
    </CentralLayout>
  )
}
