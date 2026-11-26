import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDados } from '../../hooks/useDados'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil, projetoPorSlug } from '../../services/data'

const L = 1000
const A = 640
const GRUPOS = ['Linguagens', 'Dados', 'Desenvolvimento', 'Ferramentas', 'Outras']
// cada grupo tem cor E forma, para não depender só da cor
const FORMA = { Linguagens: 'circulo', Dados: 'losango', Desenvolvimento: 'triangulo', Ferramentas: 'quadrado', Outras: 'circulo' }
const COR = { Linguagens: 'var(--s1)', Dados: 'var(--s2)', Desenvolvimento: 'var(--s3)', Ferramentas: 'var(--s4)', Outras: 'var(--s5)' }

function Marcador({ forma, x, y, r, ...props }) {
  if (forma === 'losango') return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} transform={`rotate(45 ${x} ${y})`} {...props} />
  if (forma === 'quadrado') return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx="2" {...props} />
  if (forma === 'triangulo') return <path d={`M${x} ${y - r * 1.2} L${x + r * 1.1} ${y + r * 0.8} L${x - r * 1.1} ${y + r * 0.8}Z`} {...props} />
  return <circle cx={x} cy={y} r={r} {...props} />
}

/** Aranha que desce por um fio até a tecnologia escolhida: a teia vira a rede. */
function Aranha({ x, y }) {
  return (
    <g className="aranha" style={{ transform: `translate(${x}px, ${y}px)` }} aria-hidden="true">
      <line x1="0" y1={-y - 10} x2="0" y2="-14" stroke="var(--text-3)" strokeWidth="1" />
      <g className="aranha__corpo" transform="translate(0,-20)">
        {[-1, 1].map((lado) =>
          [0, 1, 2, 3].map((i) => (
            <path key={`${lado}${i}`} d={`M0 0 q${lado * 8} ${-6 + i * 4} ${lado * 12} ${-2 + i * 5}`} stroke="var(--text)" strokeWidth="1.4" fill="none" />
          )),
        )}
        <ellipse cx="0" cy="2" rx="5" ry="6" fill="var(--text)" />
        <circle cx="0" cy="-5" r="3.2" fill="var(--text)" />
        <circle cx="-1.2" cy="-5.5" r="0.8" fill="var(--accent)" />
        <circle cx="1.2" cy="-5.5" r="0.8" fill="var(--accent)" />
      </g>
    </g>
  )
}

export default function Habilidades() {
  const [ref, visivel] = useNaTela()
  const { dados, erro } = useDados('rede', visivel)
  const [selecionada, setSelecionada] = useState('tec:Python')

  const { nos, arestas, tecnologias, vizinhos } = useMemo(() => {
    if (!dados) return { nos: [], arestas: [], tecnologias: [], vizinhos: new Set() }
    const nos = dados.nos.map((n) => ({ ...n, px: n.x * L, py: n.y * A }))
    const vizinhos = new Set([selecionada])
    dados.arestas.forEach(([a, b]) => {
      if (nos[a].id === selecionada) vizinhos.add(nos[b].id)
      if (nos[b].id === selecionada) vizinhos.add(nos[a].id)
    })
    const tecnologias = nos.filter((n) => n.tipo === 'tecnologia').sort((a, b) => b.projetos - a.projetos || a.rotulo.localeCompare(b.rotulo))
    return { nos, arestas: dados.arestas, tecnologias, vizinhos }
  }, [dados, selecionada])

  const noSelecionado = nos.find((n) => n.id === selecionada)
  const projetosLigados = [...vizinhos].filter((id) => !id.startsWith('tec:')).map(projetoPorSlug).filter(Boolean)

  return (
    <section id="habilidades" className="section secao--lavanda" aria-labelledby="hab-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <p className="eyebrow">Habilidades técnicas</p>
        <h2 id="hab-titulo" className="section-title">
          Uma teia de <em>tecnologias</em> e projetos.
        </h2>
        <p className="lead">
          Cada fio liga uma tecnologia a um projeto em que ela foi usada de verdade. Escolha uma tecnologia para ver onde ela aparece.
          O desenho da rede foi calculado em Python (algoritmo de Fruchterman-Reingold com NumPy).
        </p>

        <div className="habilidades">
          <div className="habilidades__lista" role="group" aria-label="Escolha uma tecnologia">
            {GRUPOS.filter((g) => tecnologias.some((t) => t.grupo === g)).map((grupo) => (
              <div key={grupo} className="habilidades__grupo">
                <h3 className="mono">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <Marcador forma={FORMA[grupo]} x={7} y={7} r={4.5} fill={COR[grupo]} />
                  </svg>
                  {grupo}
                </h3>
                <div className="habilidades__chips">
                  {tecnologias
                    .filter((t) => t.grupo === grupo)
                    .map((t) => (
                      <button key={t.id} type="button" className="chip" aria-pressed={selecionada === t.id} onClick={() => setSelecionada(t.id)}>
                        {t.rotulo} <span className="mono muted">{t.projetos}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
            {!dados && !erro && <p className="muted">Tecendo a rede…</p>}
            {erro && <p className="notice">Não consegui carregar a rede agora. As tecnologias estão listadas em cada projeto.</p>}
          </div>

          <div className="habilidades__rede glass">
            {dados && (
              <svg viewBox={`0 0 ${L} ${A}`} role="img" aria-labelledby="rede-desc" className={visivel ? 'rede rede--tecendo' : 'rede'}>
                <desc id="rede-desc">
                  Rede com {tecnologias.length} tecnologias e {nos.length - tecnologias.length} projetos. {noSelecionado?.rotulo} está ligado a{' '}
                  {projetosLigados.map((p) => p.nome).join(', ')}.
                </desc>
                {arestas.map(([a, b], i) => {
                  const ativo = vizinhos.has(nos[a].id) && vizinhos.has(nos[b].id) && (nos[a].id === selecionada || nos[b].id === selecionada)
                  return (
                    <line
                      key={i}
                      x1={nos[a].px}
                      y1={nos[a].py}
                      x2={nos[b].px}
                      y2={nos[b].py}
                      className={`rede__fio ${ativo ? 'rede__fio--ativo' : ''}`}
                      style={{ '--i': i }}
                      pathLength="1"
                    />
                  )
                })}
                {nos.map((n) => {
                  const ativo = vizinhos.has(n.id)
                  const projeto = n.tipo === 'projeto'
                  return (
                    <g key={n.id} className={`rede__no ${ativo ? 'rede__no--ativo' : ''}`} onClick={() => !projeto && setSelecionada(n.id)}>
                      {projeto ? (
                        <rect x={n.px - 7} y={n.py - 7} width="14" height="14" rx="4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
                      ) : (
                        <Marcador forma={FORMA[n.grupo]} x={n.px} y={n.py} r={4 + n.projetos * 1.4} fill={COR[n.grupo]} />
                      )}
                      {(ativo || n.projetos >= 3) && (
                        <text x={n.px} y={n.py + (projeto ? 24 : 22 + n.projetos)} textAnchor="middle" className={projeto ? 'rede__rotulo rede__rotulo--projeto' : 'rede__rotulo'}>
                          {n.rotulo}
                        </text>
                      )}
                    </g>
                  )
                })}
                {noSelecionado && <Aranha x={noSelecionado.px} y={noSelecionado.py} />}
              </svg>
            )}
          </div>
        </div>

        {noSelecionado && (
          <div className="habilidades__resultado" aria-live="polite">
            <p>
              <strong>{noSelecionado.rotulo}</strong> aparece em {projetosLigados.length} {projetosLigados.length === 1 ? 'projeto' : 'projetos'}:
            </p>
            <ul>
              {projetosLigados.map((p) => (
                <li key={p.slug}>
                  <Link to={`/projeto/${p.slug}`}>{p.nome}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="notice">
          Sem barras de “proficiência”: quantidade de projetos mostra onde já usei uma tecnologia, não o quanto eu domino. Também tenho familiaridade com{' '}
          {perfil.habilidades.Ferramentas.filter((f) => !tecnologias.some((t) => t.rotulo === f)).join(', ')}.
        </p>
      </div>
    </section>
  )
}
