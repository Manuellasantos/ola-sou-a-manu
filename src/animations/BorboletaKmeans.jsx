import { useEffect, useState } from 'react'
import { useDados } from '../hooks/useDados'
import { useNaTela } from '../hooks/useNaTela'
import { usePreferencias } from '../hooks/usePreferencias'
import { tocar } from '../services/audio'

const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)']
const FORMAS = ['circulo', 'quadrado', 'triangulo'] // forma de cada grupo

function Ponto({ x, y, forma, cor }) {
  if (forma === 'quadrado') return <rect x={x - 3.2} y={y - 3.2} width="6.4" height="6.4" fill={cor} className="km__ponto" />
  if (forma === 'triangulo') return <path d={`M${x} ${y - 4} L${x + 4} ${y + 3} L${x - 4} ${y + 3}Z`} fill={cor} className="km__ponto" />
  return <circle cx={x} cy={y} r="3.4" fill={cor} className="km__ponto" />
}

// borboleta que vira os pontos do k-means
export default function BorboletaKmeans() {
  const [ref, visivel] = useNaTela({ limiar: 0.3 })
  const { dados } = useDados('clusters', visivel)
  const { animar } = usePreferencias()
  const [etapa, setEtapa] = useState(-1) // -1 mostra a borboleta, depois cada iteração

  const total = dados?.passos.length ?? 0

  useEffect(() => {
    if (!dados) return
    if (!animar) {
      setEtapa(total - 1)
      return
    }
    if (etapa >= total - 1 || etapa < 0) return
    const id = setTimeout(() => setEtapa((e) => e + 1), 1100)
    return () => clearTimeout(id)
  }, [dados, etapa, total, animar])

  const comecar = () => {
    tocar('natureza')
    setEtapa(0)
  }

  if (!dados) return <div ref={ref} className="km glass km--carregando">Carregando borboleta…</div>

  const passo = etapa >= 0 ? dados.passos[etapa] : null
  const S = 400

  return (
    <figure className="km glass" ref={ref}>
      <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-labelledby="km-desc">
        <desc id="km-desc">
          {passo
            ? `K-means com ${dados.k} grupos sobre ${dados.pontos.length} pontos simulados, iteração ${passo.iteracao + 1} de ${total}, inércia ${passo.inercia}.`
            : `Borboleta desenhada por ${dados.pontos.length} pontos. Clique em agrupar para transformar as asas em dados.`}
        </desc>
        {dados.pontos.map(([px, py], i) => {
          const [bx, by] = dados.borboleta[i]
          const x = (passo ? px : bx) * S
          const y = (passo ? py : by) * S
          const grupo = passo ? passo.rotulos[i] : null
          return (
            <g key={i} className="km__mover" style={{ transform: `translate(${x}px, ${y}px)`, transitionDelay: passo && etapa === 0 ? `${(i % 30) * 12}ms` : '0ms' }}>
              <Ponto x={0} y={0} forma={grupo === null ? 'circulo' : FORMAS[grupo]} cor={grupo === null ? 'var(--accent)' : SERIES[grupo]} />
            </g>
          )
        })}
        {passo?.centroides.map(([cx, cy], j) => (
          <g key={j} className="km__mover" style={{ transform: `translate(${cx * S}px, ${cy * S}px)` }}>
            <circle r="11" fill="none" stroke={SERIES[j]} strokeWidth="2" />
            <path d="M-6 0 H6 M0 -6 V6" stroke={SERIES[j]} strokeWidth="2" />
          </g>
        ))}
      </svg>
      <figcaption>
        <p className="mono muted">
          {passo ? `iteração ${passo.iteracao + 1}/${total} · inércia ${passo.inercia.toFixed(2)}` : 'curva da borboleta · 210 pontos'}
        </p>
        <div className="km__acoes">
          <button type="button" className="btn btn-sm btn-primary" onClick={comecar} disabled={etapa >= 0 && etapa < total - 1 && animar}>
            {etapa < 0 ? 'Agrupar com k-means' : 'Rodar de novo'}
          </button>
          {etapa >= 0 && (
            <button type="button" className="btn btn-sm" onClick={() => setEtapa(-1)}>
              Voltar à borboleta
            </button>
          )}
        </div>
        <p className="notice">Dados simulados (três nuvens gaussianas) só para demonstrar o algoritmo. O k-means foi escrito do zero em NumPy.</p>
      </figcaption>
    </figure>
  )
}
