/**
 * Peças de colagem reutilizadas pelo site: estrelas irregulares, faixas que correm,
 * bordas de papel rasgado e "adesivos" com pequenos gráficos.
 * Os adesivos de dados leem public/data/arte.json (gerado por scripts/gerar_arte.py).
 */
import { useDados } from '../hooks/useDados'

/** Estrela/explosão com pontas irregulares (nenhuma igual à outra, pela semente). */
export function Estrela({ pontas = 9, semente = 1, cor = 'var(--preto)', className = '', ...props }) {
  let s = semente
  const aleatorio = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const pts = []
  for (let i = 0; i < pontas * 2; i++) {
    const ang = (i / (pontas * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? 46 + aleatorio() * 4 : 18 + aleatorio() * 10
    pts.push(`${(50 + Math.cos(ang) * r).toFixed(1)},${(50 + Math.sin(ang) * r).toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 100 100" className={`estrela ${className}`} aria-hidden="true" {...props}>
      <polygon points={pts.join(' ')} fill={cor} />
    </svg>
  )
}

/** Faixa inclinada com texto correndo (pausa ao passar o mouse e some com movimento reduzido). */
export function Faixa({ itens, invertida = false, tema = 'preto' }) {
  const linha = [...itens, ...itens]
  return (
    <div className={`faixa faixa--${tema} ${invertida ? 'faixa--invertida' : ''}`} aria-hidden="true">
      <div className="faixa__trilho">
        {[0, 1].map((k) => (
          <span key={k} className="faixa__grupo">
            {linha.map((t, i) => (
              <span key={i}>
                {t} <b>✦</b>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Borda de papel rasgado entre duas seções. "cor" é o fundo da seção de baixo. */
export function Rasgo({ cor = 'var(--off)', semente = 3, virado = false }) {
  let s = semente
  const pts = ['0,40']
  for (let x = 0; x <= 100; x += 2.5) {
    s = (s * 9301 + 49297) % 233280
    pts.push(`${x},${(12 + (s / 233280) * 16).toFixed(1)}`)
  }
  pts.push('100,40')
  return (
    <div className={`rasgo ${virado ? 'rasgo--virado' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
        <polygon points={pts.join(' ')} fill={cor} />
      </svg>
    </div>
  )
}

/** Seta desenhada à mão. */
export function SetaMao({ className = '', d = 'M6 10 C 40 0, 80 30, 92 70 M78 60 L92 72 L98 54' }) {
  return (
    <svg viewBox="0 0 104 80" className={`seta-mao ${className}`} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------------- adesivos de dados ---------------- */

function Adesivo({ titulo, nota, className = '', children }) {
  return (
    <figure className={`adesivo ${className}`}>
      {children}
      <figcaption>
        <span className="adesivo__titulo">{titulo}</span>
        {nota && <span className="adesivo__nota">{nota}</span>}
      </figcaption>
    </figure>
  )
}

export function AdesivoTabela({ className }) {
  const { dados } = useDados('arte')
  if (!dados) return null
  return (
    <Adesivo titulo="linguagens nos meus repositórios" className={className}>
      <table className="adesivo__tabela">
        <thead>
          <tr>
            <th scope="col">linguagem</th>
            <th scope="col">repos</th>
          </tr>
        </thead>
        <tbody>
          {dados.github.linguagens.map(([l, n]) => (
            <tr key={l}>
              <td>{l}</td>
              <td>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Adesivo>
  )
}

export function AdesivoBarras({ className }) {
  const { dados } = useDados('arte')
  if (!dados || !dados.github.semana.length) return null
  const max = Math.max(...dados.github.semana.map((d) => d[1])) || 1
  return (
    <Adesivo titulo="commits por dia" className={className}>
      <svg viewBox="0 0 140 80" role="img" aria-label={`Contribuições por dia da semana: ${dados.github.semana.map(([d, n]) => `${d} ${n}`).join(', ')}`}>
        {dados.github.semana.map(([d, n], i) => {
          const h = (n / max) * 56
          return (
            <g key={d}>
              <rect x={6 + i * 19} y={64 - h} width="13" height={h} fill={i % 2 ? 'var(--preto)' : 'var(--rosa)'} />
              <text x={12.5 + i * 19} y="76" textAnchor="middle" className="adesivo__rot">
                {d[0]}
              </text>
            </g>
          )
        })}
      </svg>
    </Adesivo>
  )
}

export function AdesivoLinha({ className }) {
  const { dados } = useDados('arte')
  if (!dados) return null
  const v = dados.github.acumulado
  const max = Math.max(...v)
  const d = v.map((y, i) => `${i ? 'L' : 'M'}${6 + (i / (v.length - 1)) * 128} ${70 - (y / max) * 60}`).join(' ')
  return (
    <Adesivo titulo="repositórios acumulados" className={className}>
      <svg viewBox="0 0 140 78" role="img" aria-label={`Linha de repositórios acumulados, de ${v[0]} até ${max}`}>
        <path d={d} fill="none" stroke="var(--rosa)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="134" cy={70 - 60} r="4" fill="var(--preto)" />
      </svg>
    </Adesivo>
  )
}

/** Água-viva desenhada com linhas: o "sino" pulsa e os tentáculos ondulam. */
export function AguaViva({ className = '' }) {
  return (
    <svg viewBox="0 0 80 130" className={`agua-viva ${className}`} aria-hidden="true">
      <path className="agua-viva__sino" d="M8 44 C 8 10, 72 10, 72 44 C 60 40, 52 48, 40 44 C 28 48, 20 40, 8 44 Z" fill="var(--rosa-medio)" stroke="var(--preto)" strokeWidth="2" />
      {[16, 28, 40, 52, 64].map((x, i) => (
        <path
          key={x}
          className="agua-viva__tentaculo"
          style={{ '--i': i }}
          d={`M${x} 46 C ${x - 8} 66, ${x + 8} 84, ${x} 104 C ${x - 6} 112, ${x + 4} 120, ${x} 126`}
          fill="none"
          stroke="var(--preto)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      {[22, 34, 46, 58].map((x) => (
        <circle key={x} cx={x} cy="30" r="2" fill="var(--branco)" />
      ))}
    </svg>
  )
}
