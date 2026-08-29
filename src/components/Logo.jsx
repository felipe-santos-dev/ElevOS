// Marca ElevOS.
// <LogoMark />      → só o símbolo (quadrado ciano com chevrons)
// <Logo />          → símbolo + "ElevOS"           (uso nas telas)
// <Logo tagline />  → símbolo + "ElevOS" + slogan  (uso só no login)

export function LogoMark({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="ElevOS">
      <rect width="40" height="40" rx="11" fill="#039ABC" />
      <g
        fill="none"
        stroke="#090D19"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.6 18.4 L20 9.6 L29.4 18.4" />
        <path d="M10.6 28.6 L20 19.8 L29.4 28.6" />
      </g>
    </svg>
  )
}

export default function Logo({
  tagline = false,
  tone = 'dark',        // 'dark' = texto escuro (fundo claro) | 'light' = texto claro (fundo escuro)
  size = 'md',          // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const escalas = {
    sm: { mark: 'w-8 h-8', texto: 'text-[17px]', slogan: 'text-[11px]', gap: 'gap-2.5' },
    md: { mark: 'w-9 h-9', texto: 'text-xl', slogan: 'text-xs', gap: 'gap-3' },
    lg: { mark: 'w-14 h-14 sm:w-16 sm:h-16', texto: 'text-[32px] sm:text-[38px]', slogan: 'text-[13px] sm:text-sm', gap: 'gap-3.5 sm:gap-4' },
  }
  const s = escalas[size]
  const corTexto = tone === 'light' ? 'text-white' : 'text-ink-900'
  const corSlogan = tone === 'light' ? 'text-white/70' : 'text-ink-500'

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <LogoMark className={`${s.mark} shrink-0`} />
      <span className="flex flex-col">
        <span className={`font-extrabold leading-none tracking-tight ${s.texto} ${corTexto}`}>
          ElevOS
        </span>
        {tagline && (
          <>
            <span className="mt-2 block h-[3px] w-14 rounded-full bg-[#039ABC] sm:w-16" />
            <span className={`mt-2 leading-none ${s.slogan} ${corSlogan}`}>
              Do registro à prevenção
            </span>
          </>
        )}
      </span>
    </span>
  )
}
