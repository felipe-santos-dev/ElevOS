import { useEffect, useState } from 'react'

// Mostra o alerta de "chamado feito" uma única vez, logo após o login
// (consome a flag gravada em sessionStorage pela tela de Login).
export function useLoginAlert() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('elevos:alerta-login') === '1') {
      sessionStorage.removeItem('elevos:alerta-login')
      setShow(true)
    }
  }, [])

  return { show, dismiss: () => setShow(false) }
}
