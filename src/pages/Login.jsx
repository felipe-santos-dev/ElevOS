import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { IconEye, IconEyeOff } from '../components/Icons'

const perfis = [
  { id: 'sindico', label: 'Síndico', rota: '/sindico', usuario: 'carlos.mendes' },
  { id: 'central', label: 'Central OTIS', rota: '/central/elevadores', usuario: 'ana.lima' },
  { id: 'tecnico', label: 'Técnico', rota: '/tecnico', usuario: 'rafael.silva' },
]

export default function Login() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState('sindico')
  const [usuario, setUsuario] = useState('carlos.mendes')
  const [senha, setSenha] = useState('elevos2026')
  const [verSenha, setVerSenha] = useState(false)

  const trocarPerfil = (p) => {
    setPerfil(p.id)
    setUsuario(p.usuario)
  }

  const entrar = (e) => {
    e.preventDefault()
    // Sinaliza para a tela de destino exibir o alerta de chamado ao entrar.
    sessionStorage.setItem('elevos:alerta-login', '1')
    navigate(perfis.find((p) => p.id === perfil).rota)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Painel de marca */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-[#0A1020] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        {/* brilho da marca ao fundo */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #039ABC 0%, transparent 65%)' }}
        />
        <Logo tagline tone="light" size="lg" className="relative" />

        <div className="relative my-10 lg:my-0 max-w-md">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
            Sistema de Chamados
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
            Síndicos abrem chamados em doze perguntas. A Central recebe o diagnóstico já explicado,
            com a probabilidade de cada causa.
          </p>
        </div>

        <p className="relative text-xs text-slate-500">Challenge OTIS · FIAP · Grupo GLYFFS</p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-8">
        <form onSubmit={entrar} className="card w-full max-w-[420px] p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Entrar</h2>
          <p className="mt-1 text-sm text-ink-500">Use as credenciais do seu condomínio</p>

          {/* Seletor de perfil — atalho de demo */}
          <div className="mt-6 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
            {perfis.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => trocarPerfil(p)}
                className={`h-9 rounded-md text-[13px] font-semibold transition-colors ${
                  perfil === p.id ? 'bg-white text-otis-900 shadow-card' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label htmlFor="usuario" className="label">Usuário</label>
            <input
              id="usuario"
              className="input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="senha" className="label">Senha</label>
            <div className="relative">
              <input
                id="senha"
                type={verSenha ? 'text' : 'password'}
                className="input pr-11"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setVerSenha((v) => !v)}
                aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-ink-500 hover:bg-slate-100"
              >
                {verSenha ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-lg mt-6 w-full">Entrar</button>

          <button type="button" className="mt-4 w-full text-center text-[13px] font-medium text-ink-500 hover:text-ink-900">
            Esqueci minha senha
          </button>
        </form>
      </div>
    </div>
  )
}
