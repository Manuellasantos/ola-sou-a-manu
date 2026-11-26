import { useState } from 'react'
import { useDados } from '../../hooks/useDados'
import { useNaTela } from '../../hooks/useNaTela'
import Capitulo from '../Capitulo'
import { Acumulado, Heatmap, Linguagens, Semana, fmtMes } from '../Graficos'
import { Rasgo } from '../Colagem'

export default function Analises() {
  const [ref, visivel] = useNaTela()
  const { dados, erro, carregando } = useDados('github', visivel)
  const [tabela, setTabela] = useState(false)
  const c = dados?.contribuicoes

  return (
    <section id="analises" className="section tema-rosa analises-secao" aria-labelledby="lab-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="06" nota="atualiza sozinho toda segunda" id="lab-titulo">
          Minhas <span className="destaque">análises</span>
        </Capitulo>
        <p className="secao-intro">Analisei a minha própria atividade no GitHub: em que dias eu programo, quais linguagens aparecem e como os repositórios foram surgindo.</p>

        {carregando && <p className="mao">carregando os dados…</p>}
        {erro && <p className="notice">Os dados não carregaram agora. Tenta recarregar a página.</p>}

        {dados && (
          <div className="lab">
            <dl className="lab__numeros">
              <div>
                <dt>repositórios públicos</dt>
                <dd>{dados.resumo.repos_publicos}</dd>
              </div>
              <div>
                <dt>projetos de equipe em outras contas</dt>
                <dd>{dados.resumo.repos_equipe_externos}</dd>
              </div>
              {c && (
                <>
                  <div>
                    <dt>contribuições no último ano</dt>
                    <dd>{c.total}</dd>
                  </div>
                  <div>
                    <dt>dias em que mexi em código público</dt>
                    <dd>{c.dias_ativos}</dd>
                  </div>
                </>
              )}
            </dl>

            {c && (
              <figure className="lab__grafico lab__grafico--largo folha">
                <figcaption>
                  <span className="lab__legenda-titulo">Contribuições no último ano</span> <span className="mao">cada quadradinho é um dia</span>
                </figcaption>
                <Heatmap contrib={c} />
                <p className="mao lab__anotacao">
                  meu dia com mais contribuições: {[...c.por_dia_semana].sort((a, b) => b.total - a.total)[0].dia.toLowerCase()}. não sei explicar.
                </p>
              </figure>
            )}

            <figure className="lab__grafico folha">
              <figcaption>
                <span className="lab__legenda-titulo">Linguagens nos repositórios</span>
              </figcaption>
              <Linguagens linguagens={dados.linguagens} visivel={visivel} />
              <p className="lab__legenda">Cada ponto vale 2% do código.</p>
            </figure>

            <figure className="lab__grafico folha">
              <figcaption>
                <span className="lab__legenda-titulo">Repositórios ao longo do tempo</span>
              </figcaption>
              <Acumulado meses={dados.repos_por_mes} />
              {c && (
                <>
                  <figcaption className="lab__sub">
                    <span className="lab__legenda-titulo">Contribuições por dia da semana</span>
                  </figcaption>
                  <Semana dias={c.por_dia_semana} />
                </>
              )}
            </figure>

            <div className="lab__rodape">
              <button type="button" className="btn btn-sm" aria-expanded={tabela} onClick={() => setTabela((v) => !v)}>
                {tabela ? 'esconder' : 'ver'} os números em tabela
              </button>
              {tabela && (
                <div className="tabelas">
                  <table>
                    <caption>Linguagens</caption>
                    <thead>
                      <tr>
                        <th scope="col">Linguagem</th>
                        <th scope="col">% do código</th>
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

            </div>
          </div>
        )}

      </div>
      <Rasgo cor="var(--off)" semente={27} />
    </section>
  )
}
