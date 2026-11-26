import { Link } from 'react-router-dom'
import BorboletaKmeans from '../../animations/BorboletaKmeans'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import Capitulo from '../Capitulo'
import { AguaViva, SetaMao } from '../Colagem'
import Pipeline from '../Pipeline'

export default function Estudos() {
  const [ref, visivel] = useNaTela()

  return (
    <section id="estudos" className="section estudos-secao" aria-labelledby="estudos-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="07" id="estudos-titulo">
          O que estou <span className="destaque">estudando</span>
        </Capitulo>
        <div className="estudos__pesquisa folha">
          <AguaViva className="estudos__agua-viva" />
          <p className="mao">iniciação científica, em andamento</p>
          <p>Estou pesquisando o uso de inteligência artificial no ambiente de trabalho.</p>
          <SetaMao className="estudos__seta" />
        </div>
        <div className="experimentos">
          <div className="experimento">
            <h3>
              <span className="destaque">k-means</span> passo a passo
            </h3>
            <p>
              Estou estudando algoritmos de agrupamento. Aqui a borboleta se desfaz e os pontos viram três grupos que o k-means vai encontrando a cada
              iteração.
            </p>
            <p className="notice">Os pontos são simulados, só para mostrar o algoritmo. O k-means foi implementado do zero, sem bibliotecas de machine learning.</p>
            <BorboletaKmeans />
          </div>

          <div className="experimento">
            <h3>
              Arquitetura medalhão
            </h3>
            <p>
              No Voebem, os dados de mais de 1 milhão de voos da ANAC passam por três camadas antes de virar dashboard. Clica em cada uma.
            </p>
            <Pipeline tipo="medalhao" />
            <Link className="btn btn-sm" to="/projeto/voebem">
              ver o projeto Voebem
            </Link>

            <h3 className="experimento__estudar">Próximos passos</h3>
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
