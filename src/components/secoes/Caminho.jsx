import { Link } from 'react-router-dom'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil, projetoPorSlug } from '../../services/data'
import Capitulo from '../Capitulo'
import Icone from '../Icone'
import { Estrela } from '../Colagem'

// símbolo e nome de cada tipo
const TIPOS = {
  formacao: { rotulo: 'formação', simbolo: '◆' },
  experiencia: { rotulo: 'experiência', simbolo: '●' },
  pesquisa: { rotulo: 'pesquisa', simbolo: '◎' },
  voluntariado: { rotulo: 'voluntariado', simbolo: '◇' },
  certificacao: { rotulo: 'curso', simbolo: '▲' },
  hackathon: { rotulo: 'hackathon', simbolo: '⬢' },
  conquista: { rotulo: 'conquista', simbolo: '★' },
}

const EH_CONQUISTA = (t) => t.tipo === 'conquista' || t.tipo === 'hackathon'

export default function Caminho() {
  const [ref, visivel] = useNaTela()
  const linha = perfil.trajetoria.filter((t) => !EH_CONQUISTA(t))
  const conquistas = perfil.trajetoria.filter(EH_CONQUISTA)
  const fases = [...new Set(linha.map((t) => t.fase))]

  return (
    <section id="trajetoria" className="section trajetoria-secao" aria-labelledby="traj-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="03" id="traj-titulo">
          Minha <span className="destaque">trajetória</span>
        </Capitulo>

        <div className="trajetoria">
          <ol className="caminho">
            {fases.map((fase) => (
              <li key={fase} className="caminho__fase">
                <h3 className="caminho__ano">{fase}</h3>
                <ul className="caminho__itens">
                  {linha
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
                                  {projetoPorSlug(slug)?.nome.split(' — ')[0]}
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

          <aside className="conquistas tema-preto" aria-labelledby="conquistas-titulo">
            <Estrela className="conquistas__estrela" semente={5} pontas={12} cor="var(--rosa)" />
            <h3 id="conquistas-titulo">Hackathons e conquistas</h3>
            <ul>
              {conquistas.map((c) => (
                <li key={c.titulo}>
                  <span className="conquistas__icone" aria-hidden="true">
                    {c.titulo.startsWith('3º') ? <Icone nome="trofeu" /> : TIPOS[c.tipo].simbolo}
                  </span>
                  <div>
                    <strong>{c.titulo}</strong>
                    <span>
                      {c.fase !== 'Competições pelo caminho' ? `${c.quando ? `${c.quando} ` : ''}${c.fase} · ` : ''}
                      {c.texto}
                    </span>
                    {c.projetos?.map((slug) => (
                      <Link key={slug} to={`/projeto/${slug}`}>
                        ver {projetoPorSlug(slug)?.nome.split(' — ')[0]}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
