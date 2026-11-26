import Suricato from '../../animations/Suricato'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import Capitulo from '../Capitulo'
import { AdesivoCorrelacao, Estrela, Rasgo } from '../Colagem'

export default function QuemSou() {
  const [ref, visivel] = useNaTela()

  return (
    <section id="sobre" className="section tema-rosa sobre-secao" aria-labelledby="sobre-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="01" id="sobre-titulo">
          Sobre <span className="destaque">mim</span>
        </Capitulo>

        <div className="sobre">
          <div className="sobre__texto">
            {perfil.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <aside className="sobre__colagem" aria-label="Formação">
            <div className="formacao folha">
              <Suricato visivel={visivel} />
              <h3>Formação</h3>
              <ol>
                <li>
                  <span className="mono">2026 – 2028 (previsão)</span>
                  <strong>Ciência de Dados para Negócios</strong>
                  <span>Fatec Sebrae</span>
                </li>
                <li>
                  <span className="mono">2023 – 2025</span>
                  <strong>Técnico em Informática para Internet</strong>
                  <span>Etec Albert Einstein</span>
                </li>
              </ol>
            </div>
            <Estrela className="sobre__estrela" semente={21} pontas={8} cor="var(--rosa)" />
            <AdesivoCorrelacao className="sobre__adesivo" />
          </aside>
        </div>
      </div>
      <Rasgo cor="var(--rosa)" semente={7} />
    </section>
  )
}
