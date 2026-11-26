import { useEffect, useRef, useState } from 'react'
import { usePreferencias } from '../hooks/usePreferencias'

// suricato que aparece atrás do card de formação
export default function Suricato({ visivel }) {
  const { animar } = usePreferencias()
  const [escondido, setEscondido] = useState(false)
  const [olhar, setOlhar] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  useEffect(() => {
    if (!animar) return
    const mover = (e) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.3)
      const d = Math.hypot(dx, dy) || 1
      setOlhar({ x: (dx / d) * 2.2, y: (dy / d) * 1.6 })
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => window.removeEventListener('pointermove', mover)
  }, [animar])

  useEffect(() => {
    if (!escondido) return
    const id = setTimeout(() => setEscondido(false), 2600)
    return () => clearTimeout(id)
  }, [escondido])

  const estado = !visivel || escondido ? 'suricato--baixo' : 'suricato--alto'

  return (
    <button
      type="button"
      ref={ref}
      className={`suricato ${estado}`}
      onClick={() => setEscondido(true)}
      aria-label="Suricato espiando. Clique para ele se esconder."
      title="Deu suricato no teste. Kkk."
    >
      <svg viewBox="0 0 80 110" aria-hidden="true">
        <g className="suricato__corpo">
          <path d="M22 110 C18 80 20 58 28 44 L52 44 C60 58 62 80 58 110Z" fill="#b89a7a" />
          <path d="M31 70 C30 84 31 98 33 110 L47 110 C49 98 50 84 49 70Z" fill="#d9c3a5" />
          <ellipse cx="40" cy="30" rx="17" ry="19" fill="#b89a7a" />
          <ellipse cx="40" cy="40" rx="9" ry="7" fill="#d9c3a5" />
          <ellipse cx="23" cy="24" rx="4" ry="5" fill="#7a6250" />
          <ellipse cx="57" cy="24" rx="4" ry="5" fill="#7a6250" />
          <ellipse cx="32" cy="28" rx="6" ry="5" fill="#4a3a30" />
          <ellipse cx="48" cy="28" rx="6" ry="5" fill="#4a3a30" />
          <g style={{ transform: `translate(${olhar.x}px, ${olhar.y}px)` }} className="suricato__olhos">
            <circle cx="32" cy="28" r="2.6" fill="#131217" />
            <circle cx="48" cy="28" r="2.6" fill="#131217" />
            <circle cx="33" cy="27" r="0.9" fill="#fff" />
            <circle cx="49" cy="27" r="0.9" fill="#fff" />
          </g>
          <ellipse cx="40" cy="38" rx="3" ry="2" fill="#2a1f1a" />
          <path d="M27 56 C24 62 26 66 30 66 M53 56 C56 62 54 66 50 66" stroke="#7a6250" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </button>
  )
}
