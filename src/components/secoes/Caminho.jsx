import { Link } from 'react-router-dom'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil, projetoPorSlug } from '../../services/data'
import Capitulo from '../Capitulo'

// símbolo + rótulo por tipo: a informação não depende só da cor
const TIPOS = {
  formacao: { rotulo: 'formação', simbolo: '◆' },
  experiencia: { rotulo: 'experiência', simbolo: '●' },
  pesquisa: { rotulo: 'pesquisa', simbolo: '◎' },
  voluntariado: { rotulo: 'voluntariado', simbolo: '◇' },
  certificacao: { rotulo: 'curso', simbolo: '▲' },
  hackathon: { rotulo: 'hackathon', simbolo: '⬢' },
  conquista: { rotulo: 'conquista', simbolo: '★' },
}

export default function Caminho() {
  const [ref, visivel] = useNaTela()
  const fases = [...new Set(perfil.trajetoria.map((t) => t.fase))]

  return (
    <section id="caminho" className="section caminho-secao" aria-labelledby="caminho-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="II" nota="de onde eu vim" id="caminho-titulo">
          O caminho até aqui
        </Capitulo>

        <ol className="caminho">
          {fases.map((fase, f) => (
            <li key={fase} className="caminho__fase" style={{ '--f': f }}>
              <h3 className="caminho__ano">{fase}</h3>
              <ul className="caminho__itens">
                {perfil.trajetoria
                  .filter((t) => t.fase === fase)
                  .map((t) => (
                    <li key={t.titulo} className={`caminho__item caminho__item--${t.tipo}`}>
                      <span className="caminho__simbolo" aria-hidden="true">
                        {TIPOS[t.tipo].simbolo}
                      </span>
                      <div>
                        <p className="caminho__meta mono">
                          {t.quando ? `${t.quando} · ` : ''}
                          {TIPOS[t.tipo].rotulo}
                        </p>
                        <h4>{t.titulo}</h4>
                        <p>{t.texto}</p>
                        {t.projetos && (
                          <p className="caminho__links">
                            {t.projetos.map((slug) => (
                              <Link key={slug} to={`/projeto/${slug}`}>
                                {projetoPorSlug(slug)?.nome.split(' — ')[0]} →
                              </Link>
                            ))}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
