import { Link } from 'react-router-dom'
import BorboletaKmeans from '../../animations/BorboletaKmeans'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import Pipeline from '../Pipeline'

export default function Pesquisa() {
  const [ref, visivel] = useNaTela()
  return (
    <section id="pesquisa" className="section secao--manteiga" aria-labelledby="pesq-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <p className="eyebrow">Pesquisa e curiosidade científica</p>
        <h2 id="pesq-titulo" className="section-title">
          Da natureza aos <em>algoritmos</em>.
        </h2>
        <p className="lead">
          Separei o que eu já fiz na prática do que ainda é interesse de estudo. A borboleta abaixo é um bom resumo de como penso: algo da natureza que
          vira dado, e dado que vira padrão.
        </p>

        <div className="pesquisa">
          <BorboletaKmeans />
          <div className="pesquisa__colunas">
            <div>
              <h3 className="mono pesquisa__rotulo">✓ já fiz</h3>
              <ul className="pesquisa__lista">
                {perfil.pesquisa.realizado.map((r) => (
                  <li key={r.titulo} className="glass">
                    <strong>{r.titulo}</strong>
                    <p>{r.texto}</p>
                    {r.projeto && <Link to={`/projeto/${r.projeto}`}>Ver o projeto</Link>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mono pesquisa__rotulo">? quero aprofundar</h3>
              <ul className="pesquisa__lista pesquisa__lista--interesse">
                {perfil.pesquisa.interesses.map((r) => (
                  <li key={r.titulo}>
                    <strong>{r.titulo}</strong>
                    <p>{r.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pesquisa__pipeline glass">
          <Pipeline tipo="medalhao" titulo="Arquitetura medalhão do Voebem: clique em cada camada" />
          <Link className="btn btn-sm" to="/projeto/voebem">
            Ver o projeto Voebem
          </Link>
        </div>
      </div>
    </section>
  )
}
