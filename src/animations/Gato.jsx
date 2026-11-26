import { useEffect, useRef, useState } from 'react'
import { usePreferencias } from '../hooks/usePreferencias'

/**
 * Gato que passeia pela borda de cima da grade de projetos.
 * - Com mouse: segue o cursor na horizontal enquanto ele estiver sobre a grade.
 * - Com toque: anda até onde a pessoa tocou.
 * - Parado por alguns segundos: senta e depois cochila (zZz).
 * Ele fica numa camada própria, sem capturar cliques, então nunca atrapalha os cards.
 */
export default function Gato({ alvoRef }) {
  const { animar } = usePreferencias()
  const [x, setX] = useState(40)
  const [estado, setEstado] = useState('sentado') // andando | sentado | dormindo
  const [olhaEsquerda, setOlhaEsquerda] = useState(false)
  const destino = useRef(40)
  const atual = useRef(40)
  const ocioso = useRef(0)

  useEffect(() => {
    const alvo = alvoRef.current
    if (!alvo || !animar) return
    const aoMover = (e) => {
      const r = alvo.getBoundingClientRect()
      destino.current = Math.max(20, Math.min(r.width - 60, e.clientX - r.left - 30))
    }
    alvo.addEventListener('pointermove', aoMover)
    alvo.addEventListener('pointerdown', aoMover)

    let quadro
    let anterior = performance.now()
    const loop = (agora) => {
      const dt = Math.min(0.05, (agora - anterior) / 1000)
      anterior = agora
      const diff = destino.current - atual.current
      if (Math.abs(diff) > 2) {
        atual.current += Math.sign(diff) * Math.min(Math.abs(diff), 140 * dt)
        setX(atual.current)
        setOlhaEsquerda(diff < 0)
        setEstado('andando')
        ocioso.current = 0
      } else {
        ocioso.current += dt
        setEstado(ocioso.current > 6 ? 'dormindo' : 'sentado')
      }
      quadro = requestAnimationFrame(loop)
    }
    quadro = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(quadro)
      alvo.removeEventListener('pointermove', aoMover)
      alvo.removeEventListener('pointerdown', aoMover)
    }
  }, [alvoRef, animar])

  return (
    <div className={`gato gato--${animar ? estado : 'sentado'}`} style={{ transform: `translateX(${x}px)` }} aria-hidden="true">
      <svg viewBox="0 0 70 44" style={{ transform: olhaEsquerda ? 'scaleX(-1)' : undefined }}>
        <g className="gato__rabo">
          <path d="M8 30 C-2 26 0 10 8 8" stroke="var(--text-2)" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        <ellipse cx="28" cy="30" rx="20" ry="10" fill="var(--text-2)" />
        <g className="gato__patas">
          <rect className="gato__pata gato__pata--a" x="14" y="34" width="5" height="10" rx="2.5" fill="var(--text-2)" />
          <rect className="gato__pata gato__pata--b" x="22" y="34" width="5" height="10" rx="2.5" fill="var(--text-2)" />
          <rect className="gato__pata gato__pata--a" x="34" y="34" width="5" height="10" rx="2.5" fill="var(--text-2)" />
          <rect className="gato__pata gato__pata--b" x="41" y="34" width="5" height="10" rx="2.5" fill="var(--text-2)" />
        </g>
        <g className="gato__cabeca">
          <circle cx="52" cy="20" r="11" fill="var(--text-2)" />
          <path d="M43 14 L44 3 L51 10Z M53 10 L60 3 L61 14Z" fill="var(--text-2)" />
          <path d="M45 12 L45.5 6 L49 10Z M55 10 L59 6 L59.5 12Z" fill="var(--accent)" />
          <g className="gato__olhos">
            <ellipse cx="48" cy="19" rx="1.6" ry="2.4" fill="var(--bg)" />
            <ellipse cx="56" cy="19" rx="1.6" ry="2.4" fill="var(--bg)" />
          </g>
          <path className="gato__olhos-fechados" d="M46 19 q2 2 4 0 M54 19 q2 2 4 0" stroke="var(--bg)" strokeWidth="1.4" fill="none" />
          <path d="M52 23 l-1.5 1.5 h3z" fill="var(--accent-strong)" />
        </g>
      </svg>
      <span className="gato__zzz mono">zZz</span>
    </div>
  )
}
