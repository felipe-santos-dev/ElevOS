// Moldura mobile-first do app do técnico.
// No celular ocupa a tela inteira; no desktop vira um "device frame" centralizado.
export default function TecnicoShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 sm:flex sm:items-center sm:justify-center sm:py-8">
      <div className="relative flex min-h-screen w-full flex-col bg-slate-50 sm:min-h-0 sm:h-[820px] sm:max-h-[calc(100vh-4rem)] sm:w-[400px] sm:overflow-hidden sm:rounded-[2rem] sm:border-[10px] sm:border-ink-900 sm:shadow-pop">
        {children}
      </div>
    </div>
  )
}
