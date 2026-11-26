import { useCallback, useEffect, useRef, useState } from 'react'
import { usePreferencias } from '../hooks/usePreferencias'
import { tocar } from '../services/audio'

/**
 * Dançarino original e estilizado (homenagem ao passo, não um retrato de ninguém)
 * fazendo o moonwalk enquanto puxa o painel "Em cartaz".
 *
 * Como o passo funciona (no referencial do corpo, que olha para a direita):
 *   - um pé fica APOIADO NA PONTA, parado em relação ao chão, com o calcanhar erguido;
 *   - o outro fica CHAPADO no chão e desliza para trás;
 *   - na metade do ciclo eles trocam: o calcanhar que estava erguido desce e o outro sobe.
 * Como o corpo anda para trás na mesma velocidade em que o pé apoiado "avança",
 * parece que ele caminha para frente enquanto escorrega para trás.
 *
 * As pernas usam cinemática inversa de dois segmentos (coxa e canela):
 * dado o quadril e o tornozelo, a lei dos cossenos dá o ângulo do joelho.
 */

const COXA = 34
const CANELA = 34
const PE = 16
const QUADRIL_Y = 58 // altura do quadril em relação ao chão (menor que a perna esticada)
const PASSO = 16 // meia amplitude do pé em relação ao quadril
const CICLO = 1.05 // segundos por ciclo completo (dois passos)

function joelho(qx, qy, tx, ty) {
  const dx = tx - qx
  const dy = ty - qy
  const d = Math.min(Math.hypot(dx, dy), COXA + CANELA - 0.01)
  const base = Math.atan2(dy, dx)
  const a = Math.acos((COXA * COXA + d * d - CANELA * CANELA) / (2 * COXA * d))
  // joelho dobra para frente (direita): ângulo subtraído em coordenadas de tela
  return [qx + COXA * Math.cos(base - a), qy + COXA * Math.sin(base - a)]
}

/** Posição de um pé ao longo do ciclo. fase ∈ [0, 1). */
function pe(fase) {
  if (fase < 0.5) {
    // pé chapado deslizando da frente para trás: +PASSO → −PASSO
    const t = fase / 0.5
    const x = PASSO - 2 * PASSO * t
    return { tornozelo: [x, 0 - 4], calcanhar: [x - 4, 0], ponta: [x + PE - 4, 0] }
  }
  // pé na ponta, parado no chão (no referencial do corpo avança −PASSO → +PASSO)
  const t = (fase - 0.5) / 0.5
  const x = -PASSO + 2 * PASSO * t
  // o calcanhar sobe rápido no começo e desce no fim (troca de apoio)
  const ergue = Math.sin(Math.PI * Math.min(1, t * 1.15)) * 0.65 + 0.15
  const ang = ergue * 0.9
  const ponta = [x + PE - 4, 0]
  const tornozelo = [ponta[0] - PE * Math.cos(ang), -PE * Math.sin(ang) - 4]
  return { tornozelo, calcanhar: [tornozelo[0] - 3, tornozelo[1] + 3], ponta }
}

function Perna({ fase, frente }) {
  const p = pe(fase)
  const qx = 0
  const qy = -QUADRIL_Y
  const [jx, jy] = joelho(qx, qy, p.tornozelo[0], p.tornozelo[1])
  const tom = frente ? 'var(--text)' : 'color-mix(in srgb, var(--text) 60%, var(--bg))'
  return (
    <g>
      <polyline points={`${qx},${qy} ${jx},${jy} ${p.tornozelo[0]},${p.tornozelo[1]}`} fill="none" stroke={tom} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      {/* meia: o detalhe rosa que chama atenção para os pés */}
      <line x1={p.tornozelo[0]} y1={p.tornozelo[1] - 6} x2={p.tornozelo[0]} y2={p.tornozelo[1]} stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${p.calcanhar[0]} ${p.calcanhar[1]} L${p.tornozelo[0]} ${p.tornozelo[1]} L${p.ponta[0]} ${p.ponta[1]} Z`} fill={tom} stroke={tom} strokeWidth="5" strokeLinejoin="round" />
    </g>
  )
}

function Dancarino({ t }) {
  const fase = (t / CICLO) % 1
  const balanco = Math.sin(fase * Math.PI * 4) * 1.5
  const bracoA = Math.sin(fase * Math.PI * 2) * 18
  return (
    <g transform={`translate(0 ${balanco * 0.4})`}>
      <Perna fase={(fase + 0.5) % 1} frente={false} />
      <g transform={`rotate(-4 0 ${-QUADRIL_Y})`}>
        {/* braço de trás */}
        <path d={`M-2 ${-QUADRIL_Y - 44} q${-6 - bracoA * 0.2} 18 ${-2 - bracoA * 0.3} 36`} stroke="color-mix(in srgb, var(--text) 70%, var(--bg))" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* tronco com paletó */}
        <path d={`M-11 ${-QUADRIL_Y + 2} L-9 ${-QUADRIL_Y - 48} L11 ${-QUADRIL_Y - 48} L12 ${-QUADRIL_Y + 2} Z`} fill="var(--text)" stroke="var(--text)" strokeWidth="2" strokeLinejoin="round" />
        <path d={`M0 ${-QUADRIL_Y - 46} L0 ${-QUADRIL_Y}`} stroke="var(--accent)" strokeWidth="2" />
        {/* cabeça e chapéu */}
        <circle cx="2" cy={-QUADRIL_Y - 60} r="10" fill="var(--text)" />
        <path d={`M-14 ${-QUADRIL_Y - 66} L18 ${-QUADRIL_Y - 68}`} stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
        <path d={`M-6 ${-QUADRIL_Y - 67} L-5 ${-QUADRIL_Y - 82} Q3 ${-QUADRIL_Y - 86} 11 ${-QUADRIL_Y - 82} L11 ${-QUADRIL_Y - 68}`} fill="var(--text)" stroke="var(--text)" strokeWidth="1.5" />
        <path d={`M-6 ${-QUADRIL_Y - 71} L11 ${-QUADRIL_Y - 72}`} stroke="var(--accent)" strokeWidth="3" />
        {/* braço da frente, segurando a corda do painel */}
        <path d={`M4 ${-QUADRIL_Y - 44} q14 8 26 ${4 + bracoA * 0.1}`} stroke="var(--text)" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <Perna fase={fase} frente />
    </g>
  )
}

/**
 * Palco do moonwalk. O dançarino entra pela direita, escorrega para a esquerda
 * e arrasta o painel junto. O conteúdo do painel está no DOM desde o início:
 * a animação nunca bloqueia o acesso (e some com "movimento reduzido").
 */
export default function Moonwalk({ disparar, children }) {
  const { animar } = usePreferencias()
  const palco = useRef(null)
  const [t, setT] = useState(0)
  const [progresso, setProgresso] = useState(animar ? 0 : 1)
  const [rodando, setRodando] = useState(false)
  const quadro = useRef(0)

  const comecar = useCallback(() => {
    if (!animar) {
      setProgresso(1)
      return
    }
    cancelAnimationFrame(quadro.current)
    setRodando(true)
    tocar('moonwalk')
    const duracao = 3.2
    const inicio = performance.now()
    const passo = (agora) => {
      const s = (agora - inicio) / 1000
      setT(s)
      setProgresso(Math.min(1, s / duracao))
      if (s < duracao) quadro.current = requestAnimationFrame(passo)
      else setRodando(false)
    }
    quadro.current = requestAnimationFrame(passo)
  }, [animar])

  useEffect(() => {
    if (disparar) comecar()
    return () => cancelAnimationFrame(quadro.current)
  }, [disparar, comecar])

  useEffect(() => {
    if (!animar) setProgresso(1)
  }, [animar])

  // movimento suave: acelera e desacelera nas pontas
  const suave = progresso < 1 ? 1 - Math.pow(1 - progresso, 2.2) : 1
  const fora = 100 - suave * 100 // % do painel ainda fora do palco

  return (
    <div className="moonwalk" ref={palco}>
      <div className="moonwalk__painel" style={{ transform: `translateX(${fora}%)` }}>
        {children}
      </div>
      {animar && (
        <div className={`moonwalk__palco ${rodando ? '' : 'moonwalk__palco--parado'}`} style={{ left: `calc(${fora}% * 0.98)` }} aria-hidden="true">
          <svg viewBox="-50 -150 110 160" className="moonwalk__svg">
            <ellipse cx="2" cy="4" rx="34" ry="4" fill="var(--text)" opacity="0.12" />
            <Dancarino t={rodando ? t : 0.25} />
          </svg>
        </div>
      )}
      {animar && (
        <button type="button" className="btn btn-sm moonwalk__repetir" onClick={comecar} disabled={rodando}>
          ↺ Repetir o moonwalk
        </button>
      )}
    </div>
  )
}
