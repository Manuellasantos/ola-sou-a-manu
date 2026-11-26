import { useMemo, useState } from 'react'
import { useDados } from '../../hooks/useDados'
import { useNaTela } from '../../hooks/useNaTela'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const fmtMes = (m) => `${MESES[Number(m.slice(5, 7)) - 1]}/${m.slice(2, 4)}`
const fmtData = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

/** Calendário de contribuições (heatmap). Níveis calculados em Python. */
function Heatmap({ contrib }) {
  const [foco, setFoco] = useState(null)
  const celula = 12
  const semanas = []
  contrib.dias.forEach(([data, qtd, nivel], i) => {
    const diaSemana = new Date(`${data}T12:00:00`).getDay()
    if (i === 0 || diaSemana === 0) semanas.push([])
    semanas[semanas.length - 1].push({ data, qtd, nivel, diaSemana })
  })
  const largura = semanas.length * (celula + 3) + 30

  return (
    <div className="heatmap">
      <div className="heatmap__rolagem">
        <svg viewBox={`0 0 ${largura} ${7 * (celula + 3) + 24}`} role="img" aria-label={`Calendário de contribuições: ${contrib.total} contribuições em ${contrib.dias_ativos} dias, de ${fmtData(contrib.inicio)} a ${fmtData(contrib.fim)}`}>
          {['', 'seg', '', 'qua', '', 'sex', ''].map((d, i) => (
            <text key={i} x="0" y={20 + i * (celula + 3) + 9} className="heatmap__rotulo">
              {d}
            </text>
          ))}
          {semanas.map((semana, s) => {
            const primeiro = semana[0]
            const mostraMes = primeiro && Number(primeiro.data.slice(8, 10)) <= 7
            return (
              <g key={s} transform={`translate(${30 + s * (celula + 3)} 0)`}>
                {mostraMes && (
                  <text x="0" y="10" className="heatmap__rotulo">
                    {MESES[Number(primeiro.data.slice(5, 7)) - 1]}
                  </text>
                )}
                {semana.map((d) => (
                  <rect
                    key={d.data}
                    y={20 + d.diaSemana * (celula + 3)}
                    width={celula}
                    height={celula}
                    rx="3"
                    fill={`var(--heat-${d.nivel})`}
                    className="heatmap__dia"
                    onPointerEnter={() => setFoco(d)}
                    onPointerLeave={() => setFoco(null)}
                  >
                    <title>{`${fmtData(d.data)}: ${d.qtd} contribuições`}</title>
                  </rect>
                ))}
              </g>
            )
          })}
        </svg>
      </div>
      <div className="heatmap__rodape mono">
        <span aria-live="polite">{foco ? `${fmtData(foco.data)} · ${foco.qtd} contribuições` : 'passe o cursor sobre um dia'}</span>
        <span className="heatmap__legenda" aria-hidden="true">
          menos {[0, 1, 2, 3, 4].map((n) => <i key={n} style={{ background: `var(--heat-${n})` }} />)} mais
        </span>
      </div>
    </div>
  )
}

/** Barras de linguagens montadas por pontinhos: "dados brutos se organizando em gráfico". */
function Linguagens({ linguagens, visivel }) {
  const pontos = useMemo(() => {
    const lista = []
    linguagens.forEach((l, linha) => {
      const n = Math.max(1, Math.round(l.percentual / 2)) // 1 ponto = 2%
      for (let i = 0; i < n; i++) {
        lista.push({ linha, i, sx: Math.random() * 100, sy: Math.random() * 100 })
      }
    })
    return lista
  }, [linguagens])

  return (
    <div className="linguagens">
      <svg viewBox={`0 0 520 ${linguagens.length * 34 + 10}`} role="img" aria-labelledby="ling-desc" className={visivel ? 'linguagens--organizado' : ''}>
        <desc id="ling-desc">
          Participação em bytes de código por linguagem: {linguagens.map((l) => `${l.linguagem} ${l.percentual}% em ${l.repos} repositórios`).join('; ')}.
        </desc>
        <defs>
          <pattern id="hachura" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--bg)" strokeWidth="1.5" />
          </pattern>
        </defs>
        {linguagens.map((l, linha) => (
          <g key={l.linguagem}>
            <text x="0" y={linha * 34 + 22} className="linguagens__nome">
              {l.linguagem}
            </text>
            <text x="512" y={linha * 34 + 22} textAnchor="end" className="linguagens__valor">
              {l.percentual.toFixed(1)}% · {l.repos} repo{l.repos > 1 ? 's' : ''}
            </text>
          </g>
        ))}
        {pontos.map((p, k) => (
          <circle
            key={k}
            r="3.6"
            className="linguagens__ponto"
            fill={p.linha % 2 ? 'var(--s2)' : 'var(--s1)'}
            style={{
              '--x0': `${p.sx * 4.6 + 100}px`,
              '--y0': `${p.sy * 2}px`,
              '--x1': `${110 + p.i * 8.6}px`,
              '--y1': `${p.linha * 34 + 18}px`,
              '--d': `${(k % 40) * 18}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function Acumulado({ meses }) {
  const max = Math.max(...meses.map((m) => m.acumulado))
  const L = 520
  const A = 160
  const x = (i) => 20 + (i / (meses.length - 1)) * (L - 40)
  const y = (v) => A - 24 - (v / max) * (A - 44)
  const caminho = meses.map((m, i) => `${i ? 'L' : 'M'}${x(i)} ${y(m.acumulado)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${L} ${A}`} role="img" aria-label={`Repositórios acumulados: de ${meses[0].acumulado} em ${fmtMes(meses[0].mes)} para ${max} em ${fmtMes(meses.at(-1).mes)}`}>
      <path d={`${caminho} L${x(meses.length - 1)} ${A - 24} L20 ${A - 24}Z`} fill="var(--accent)" opacity="0.12" />
      <path d={caminho} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
      {meses.map((m, i) =>
        m.novos ? (
          <g key={m.mes}>
            <circle cx={x(i)} cy={y(m.acumulado)} r="4.5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
            <title>{`${fmtMes(m.mes)}: +${m.novos} (total ${m.acumulado})`}</title>
          </g>
        ) : null,
      )}
      <text x="20" y={A - 6} className="heatmap__rotulo">
        {fmtMes(meses[0].mes)}
      </text>
      <text x={L - 20} y={A - 6} textAnchor="end" className="heatmap__rotulo">
        {fmtMes(meses.at(-1).mes)}
      </text>
    </svg>
  )
}

function Semana({ dias }) {
  const max = Math.max(...dias.map((d) => d.total)) || 1
  return (
    <ul className="semana" aria-label="Contribuições por dia da semana">
      {dias.map((d) => (
        <li key={d.dia}>
          <span className="semana__barra" style={{ '--h': d.total / max }} />
          <span className="mono">{d.dia}</span>
          <span className="mono muted">{d.total}</span>
        </li>
      ))}
    </ul>
  )
}

export default function DadosGithub() {
  const [ref, visivel] = useNaTela()
  const { dados, erro, carregando } = useDados('github', visivel)
  const [tabela, setTabela] = useState(false)
  const c = dados?.contribuicoes

  return (
    <section id="dados" className="section secao--menta" aria-labelledby="dados-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <p className="eyebrow">Análise de dados · meu GitHub</p>
        <h2 id="dados-titulo" className="section-title">
          Analisei <em>meus próprios</em> dados.
        </h2>
        <p className="lead">
          Um pequeno projeto dentro do portfólio: scripts em Python coletam a API pública do GitHub, tratam tudo com Pandas e geram os JSONs que estes
          gráficos leem. Um GitHub Action repete o processo toda semana.
        </p>

        {carregando && <p className="muted">Consultando os dados…</p>}
        {erro && <p className="notice">Os dados do GitHub não carregaram agora. Tente recarregar a página.</p>}

        {dados && (
          <>
            <dl className="numeros">
              <div className="glass">
                <dt>repositórios públicos</dt>
                <dd>{dados.resumo.repos_publicos}</dd>
              </div>
              <div className="glass">
                <dt>projetos em equipe em outras contas</dt>
                <dd>{dados.resumo.repos_equipe_externos}</dd>
              </div>
              {c && (
                <>
                  <div className="glass">
                    <dt>contribuições no último ano</dt>
                    <dd>{c.total}</dd>
                  </div>
                  <div className="glass">
                    <dt>dias com atividade</dt>
                    <dd>{c.dias_ativos}</dd>
                  </div>
                </>
              )}
            </dl>

            <div className="painel-dados">
              {c && (
                <figure className="glass painel-dados__largo">
                  <figcaption>Calendário de contribuições</figcaption>
                  <Heatmap contrib={c} />
                </figure>
              )}
              <figure className="glass">
                <figcaption>Linguagens nos repositórios (% dos bytes)</figcaption>
                <Linguagens linguagens={dados.linguagens} visivel={visivel} />
              </figure>
              <figure className="glass">
                <figcaption>Repositórios acumulados</figcaption>
                <Acumulado meses={dados.repos_por_mes} />
                {c && (
                  <>
                    <figcaption className="painel-dados__sub">Contribuições por dia da semana</figcaption>
                    <Semana dias={c.por_dia_semana} />
                  </>
                )}
              </figure>
            </div>

            <button type="button" className="btn btn-sm" aria-expanded={tabela} onClick={() => setTabela((v) => !v)}>
              {tabela ? 'Esconder' : 'Ver'} os dados em tabela
            </button>
            {tabela && (
              <div className="tabelas">
                <table>
                  <caption>Linguagens</caption>
                  <thead>
                    <tr>
                      <th scope="col">Linguagem</th>
                      <th scope="col">% dos bytes</th>
                      <th scope="col">Repositórios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.linguagens.map((l) => (
                      <tr key={l.linguagem}>
                        <td>{l.linguagem}</td>
                        <td>{l.percentual.toFixed(1)}</td>
                        <td>{l.repos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {c && (
                  <table>
                    <caption>Contribuições por mês</caption>
                    <thead>
                      <tr>
                        <th scope="col">Mês</th>
                        <th scope="col">Contribuições</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.por_mes.map((m) => (
                        <tr key={m.mes}>
                          <td>{fmtMes(m.mes)}</td>
                          <td>{m.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <div className="notice fonte-dados">
              <p>
                <strong>Fonte:</strong> {dados.fonte}, usuário {dados.usuario}. Coletado em {fmtData(dados.coletado_em.slice(0, 10))}
                {c && `; contribuições de ${fmtData(c.inicio)} a ${fmtData(c.fim)}`}.
              </p>
              <p>
                <strong>Limitações:</strong> {dados.limitacoes.join(' ')}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
