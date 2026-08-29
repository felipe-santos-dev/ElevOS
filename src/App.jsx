import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'

import MeusElevadores from './pages/sindico/MeusElevadores'
import DetalheElevador from './pages/sindico/DetalheElevador'
import FluxoPerguntas from './pages/sindico/FluxoPerguntas'
import Diagnostico from './pages/sindico/Diagnostico'
import Chamados from './pages/sindico/Chamados'
import Relatorios from './pages/sindico/Relatorios'

import Painel from './pages/central/Painel'
import VisaoElevadores from './pages/central/VisaoElevadores'
import ChamadosCentral from './pages/central/ChamadosCentral'
import RiskScore from './pages/central/RiskScore'
import Equipe from './pages/central/Equipe'

import AgendaTecnico from './pages/tecnico/AgendaTecnico'
import DetalheChamado from './pages/tecnico/DetalheChamado'
import FinalizarChamado from './pages/tecnico/FinalizarChamado'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Síndico */}
      <Route path="/sindico" element={<MeusElevadores />} />
      <Route path="/sindico/elevadores/:rg" element={<DetalheElevador />} />
      <Route path="/sindico/chamados" element={<Chamados />} />
      <Route path="/sindico/chamados/novo" element={<FluxoPerguntas />} />
      <Route path="/sindico/chamados/novo/diagnostico" element={<Diagnostico />} />
      <Route path="/sindico/relatorios" element={<Relatorios />} />

      {/* Central OTIS */}
      <Route path="/central" element={<Painel />} />
      <Route path="/central/elevadores" element={<VisaoElevadores />} />
      <Route path="/central/chamados" element={<ChamadosCentral />} />
      <Route path="/central/risk-score" element={<RiskScore />} />
      <Route path="/central/equipe" element={<Equipe />} />

      {/* Técnico */}
      <Route path="/tecnico" element={<AgendaTecnico />} />
      <Route path="/tecnico/chamados/:id" element={<DetalheChamado />} />
      <Route path="/tecnico/chamados/:id/finalizar" element={<FinalizarChamado />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
