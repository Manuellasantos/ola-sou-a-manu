import { useEffect, useState } from 'react'
import { tocar } from '../services/audio'

// balão vermelho escondido no contato
export default function Balao() {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    if (!aberto) return
    const fechar = (e) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', fechar)
    const id = setTimeout(() => setAberto(false), 6000)
    return () => {
      window.removeEventListener('keydown', fechar)
      clearTimeout(id)
    }
  }, [aberto])

  return (
    <>
      <button
        type="button"
        className={`balao ${aberto ? 'balao--subiu' : ''}`}
        onClick={() => {
          setAberto(true)
          tocar('misterio')
        }}
        aria-label="Um balão vermelho. O que será?"
      >
        <svg viewBox="0 0 40 90" aria-hidden="true">
          <path d="M20 46 C18 58 24 66 19 76 C16 82 22 86 20 90" stroke="var(--text-3)" strokeWidth="1" fill="none" />
          <ellipse cx="20" cy="22" rx="16" ry="20" fill="#d4202c" />
          <path d="M17 42 h6 l-3 5z" fill="#a8141e" />
          <ellipse cx="13" cy="14" rx="4" ry="6" fill="#fff" opacity="0.35" />
        </svg>
      </button>
      <p className={`balao__frase ${aberto ? 'balao__frase--visivel' : ''}`} role="status" aria-live="polite">
        {aberto ? 'Todos nós flutuamos por aqui.' : ''}
      </p>
    </>
  )
}
