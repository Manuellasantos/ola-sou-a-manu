import { useEffect, useState } from 'react'
import { tocar } from '../services/audio'

/**
 * Easter egg da Corvinal: digitar "corvinal" (ou tocar no adesivo da casa)
 * mostra um brasão que "carimba" a tela, com o corvo batendo as asas,
 * e as escadas mudam de lugar: os projetos trocam de ordem.
 *
 * O brasão é um desenho original, só inspirado nas cores da casa (azul e bronze).
 */
export default function Brasao() {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    let digitado = ''
    const abrir = () => {
      setAberto(true)
      tocar('transicao')
      window.dispatchEvent(new Event('passagem-secreta'))
    }
    const aoTeclar = (e) => {
      if (e.key === 'Escape') setAberto(false)
      if (e.target.matches?.('input, textarea, select') || e.key.length !== 1) return
      digitado = (digitado + e.key.toLowerCase()).slice(-8)
      if (digitado === 'corvinal') abrir()
    }
    window.addEventListener('keydown', aoTeclar)
    window.addEventListener('corvinal', abrir)
    return () => {
      window.removeEventListener('keydown', aoTeclar)
      window.removeEventListener('corvinal', abrir)
    }
  }, [])

  useEffect(() => {
    if (!aberto) return
    const id = setTimeout(() => setAberto(false), 4200)
    return () => clearTimeout(id)
  }, [aberto])

  return (
    <div className={`brasao ${aberto ? 'brasao--aberto' : ''}`} role="status" aria-live="polite" onClick={() => setAberto(false)}>
      {aberto && (
        <div className="brasao__conteudo">
          <svg viewBox="0 0 200 240" className="brasao__escudo" aria-hidden="true">
            {/* escudo */}
            <path d="M100 8 L188 34 C188 120 160 186 100 230 C40 186 12 120 12 34 Z" fill="#1d3461" stroke="#b9853f" strokeWidth="8" />
            <path d="M100 24 L172 45 C172 118 148 172 100 210 C52 172 28 118 28 45 Z" fill="none" stroke="#d9a75b" strokeWidth="2" strokeDasharray="4 5" />
            {/* estrelas */}
            {[
              [54, 62],
              [146, 62],
              [100, 44],
            ].map(([x, y]) => (
              <path key={x} className="brasao__brilho" d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2}Z`} fill="#d9a75b" />
            ))}
            {/* corvo estilizado: corpo, cabeça, bico e duas asas que batem */}
            <g className="brasao__corvo">
              <path className="brasao__asa brasao__asa--esq" d="M96 118 C 76 96, 52 92, 36 104 C 54 106, 66 114, 70 124 C 58 122, 50 128, 46 136 C 66 130, 82 132, 96 128 Z" fill="#b9853f" />
              <path className="brasao__asa brasao__asa--dir" d="M104 118 C 124 96, 148 92, 164 104 C 146 106, 134 114, 130 124 C 142 122, 150 128, 154 136 C 134 130, 118 132, 104 128 Z" fill="#b9853f" />
              <ellipse cx="100" cy="132" rx="12" ry="22" fill="#d9a75b" />
              <circle cx="100" cy="106" r="9" fill="#d9a75b" />
              <path d="M100 103 L110 108 L100 111 Z" fill="#1d3461" />
              <circle cx="97" cy="104" r="1.6" fill="#1d3461" />
              <path d="M92 152 L100 170 L108 152 Z" fill="#b9853f" />
            </g>
            {/* faixa com o nome */}
            <path d="M30 176 L170 176 L162 194 L170 212 L30 212 L38 194 Z" fill="#b9853f" />
            <text x="100" y="200" textAnchor="middle" className="brasao__nome">
              CORVINAL
            </text>
          </svg>
          <p className="brasao__frase">As escadas mudaram de lugar: os projetos trocaram de ordem.</p>
        </div>
      )}
    </div>
  )
}
