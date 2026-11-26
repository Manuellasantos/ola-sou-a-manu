import Suricato from '../../animations/Suricato'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import Capitulo from '../Capitulo'

export default function QuemSou() {
  const [ref, visivel] = useNaTela()

  return (
    <section id="quem-sou" className="section" aria-labelledby="quem-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="I" nota="antes de qualquer projeto" id="quem-titulo">
          Prazer, sou a <span className="marca">Manuella</span>.
        </Capitulo>

        <div className="quem">
          <div className="quem__bio">
            {perfil.bio.map((p, i) => (
              <p key={p} className={i === 0 ? 'quem__primeiro' : ''}>
                {p}
              </p>
            ))}
            <p className="mao quem__nota">
              curiosidade é o meu traço mais forte.
              <br />o resto do site é consequência disso.
            </p>
          </div>

          <figure className="ficha folha fita">
            <Suricato visivel={visivel} />
            <figcaption className="ficha__titulo">
              <span className="mono">ficha de campo nº 001</span>
              <strong>Espécime: Manu</strong>
            </figcaption>
            <dl className="ficha__lista">
              {perfil.ficha.map(([campo, valor]) => (
                <div key={campo}>
                  <dt>{campo}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
            <p className="ficha__carimbo" aria-hidden="true">
              observada
              <br />
              em 2026
            </p>
          </figure>
        </div>
      </div>
    </section>
  )
}
