import { useState } from 'react'
import { Link } from 'react-router-dom'
import BorboletaKmeans from '../../animations/BorboletaKmeans'
import { useDados } from '../../hooks/useDados'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import Capitulo from '../Capitulo'
import { Acumulado, Heatmap, Linguagens, Semana, fmtData, fmtMes } from '../Graficos'
import Pipeline from '../Pipeline'

export default function Laboratorio() {
  const [ref, visivel] = useNaTela()
  const { dados, erro, carregando } = useDados('github', visivel)
  const [tabela, setTabela] = useState(false)
  const c = dados?.contribuicoes

  return (
    <section id="laboratorio" className="section laboratorio" aria-labelledby="lab-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="V" nota="o laboratório" id="lab-titulo">
          Testei em mim <span className="marca marca--menta">mesma</span>
        </Capitulo>
        <p className="capitulo__intro">
          Fiquei curiosa pra saber como eu uso o GitHub. Então fiz o que faço com qualquer dado: puxei, limpei com Pandas e desenhei. Um robô do
          GitHub Actions refaz tudo toda segunda-feira.
        </p>

        {carregando && <p className="mao">puxando os dados…</p>}
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
                  <span className="mao">cada quadradinho é um dia</span>
                </figcaption>
                <Heatmap contrib={c} />
                <p className="mao lab__anotacao">
                  meu dia com mais contribuições: {[...c.por_dia_semana].sort((a, b) => b.total - a.total)[0].dia.toLowerCase()}. não sei explicar.
                </p>
              </figure>
            )}

            <figure className="lab__grafico folha">
              <figcaption>
                <span className="mao">linguagens no código público</span>
              </figcaption>
              <Linguagens linguagens={dados.linguagens} visivel={visivel} />
              <p className="lab__legenda">Os pontos começam bagunçados e se organizam em barras. Cada ponto vale 2% do código.</p>
            </figure>

            <figure className="lab__grafico folha">
              <figcaption>
                <span className="mao">repositórios ao longo do tempo</span>
              </figcaption>
              <Acumulado meses={dados.repos_por_mes} />
              {c && (
                <>
                  <figcaption className="lab__sub">
                    <span className="mao">contribuições por dia da semana</span>
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

              <div className="lab__fonte">
                <p>
                  <strong>De onde veio:</strong> API pública do GitHub, da minha conta (@{dados.usuario}). Última atualização em{' '}
                  {fmtData(dados.coletado_em.slice(0, 10))}.
                </p>
                <p>
                  <strong>Antes de tirar conclusões:</strong> quantidade de código não mede o quanto eu sei de uma linguagem. Só entra o que é público,
                  então o dashboard em Excel quase não aparece. E no repositório da Análise AWS eu subi a pasta do ambiente virtual sem querer, então
                  ignorei os bytes de lá pra não inflar o Python.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="experimentos">
          <div className="experimento">
            <h3>
              Experimento: <span className="marca marca--lavanda">borboleta vira dado</span>
            </h3>
            <p>
              Os pontos desenham uma borboleta usando a curva de Temple Fay. Quando você clica, as asas se desfazem e os pontos viram três grupos que o
              k-means vai descobrindo passo a passo. Escrevi o k-means do zero em NumPy pra entender o que acontece por dentro.
            </p>
            <p className="mao">os pontos são inventados por mim, só pra mostrar o algoritmo.</p>
            <BorboletaKmeans />
          </div>

          <div className="experimento">
            <h3>
              Como organizei <span className="marca marca--pessego">1 milhão de voos</span>
            </h3>
            <p>
              No Voebem, os dados da ANAC passam por três camadas antes de virar dashboard. Clica em cada uma pra ver o que acontece lá.
            </p>
            <Pipeline tipo="medalhao" />
            <Link className="btn btn-sm" to="/projeto/voebem">
              ver o projeto inteiro
            </Link>

            <h3 className="experimento__estudar">Ainda quero estudar</h3>
            <ul className="estudar">
              {perfil.estudar.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
