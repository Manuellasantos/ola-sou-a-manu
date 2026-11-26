import { Link } from 'react-router-dom'
import { asset } from '../config/site'
import Icone from './Icone'

export const rotuloTipo = (p) =>
  [p.tipo.includes('academico') && 'acadêmico', p.tipo.includes('pessoal') && 'pessoal', p.tipo.includes('hackathon') && 'hackathon', p.equipe && 'em equipe']
    .filter(Boolean)
    .join(' · ')

/**
 * Um projeto como linha de índice de caderno: número grande, nome, uma frase e as tags.
 * Ao passar o mouse (ou focar), a captura real aparece "colada" ao lado com fita.
 */
export default function LinhaProjeto({ projeto: p, numero }) {
  const imagem = p.imagens[0]
  return (
    <li className="indice__item" data-slug={p.slug}>
      <article className="indice__linha" aria-labelledby={`proj-${p.slug}`}>
        <span className="indice__numero" aria-hidden="true">
          {String(numero).padStart(2, '0')}
        </span>
        <div className="indice__corpo">
          <p className="indice__meta mono">
            {rotuloTipo(p)}
            {p.status && ` · ${p.status.toLowerCase()}`}
            {p.dadosFicticios && ' · dados fictícios'}
          </p>
          <h3 id={`proj-${p.slug}`}>
            <Link to={`/projeto/${p.slug}`} className="indice__nome">
              {p.nome}
            </Link>
          </h3>
          {p.conquistas.map((c) => (
            <p key={c} className="badge indice__conquista">
              <Icone nome="trofeu" /> {c}
            </p>
          ))}
          <p className="indice__resumo">{p.resumo}</p>
          <ul className="indice__tags" aria-label="Tecnologias">
            {p.tecnologias.slice(0, 7).map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
          <p className="indice__links">
            <a href={p.links.github} target="_blank" rel="noreferrer">
              código<span className="sr-only"> de {p.nome}</span>
            </a>
            {p.links.deploy && (
              <a href={p.links.deploy} target="_blank" rel="noreferrer">
                demo online<span className="sr-only"> de {p.nome}</span>
              </a>
            )}
            {p.links.figma && (
              <a href={p.links.figma} target="_blank" rel="noreferrer">
                figma<span className="sr-only"> de {p.nome}</span>
              </a>
            )}
          </p>
        </div>
        <div className={`indice__foto folha fita ${imagem?.mobile ? 'indice__foto--celular' : ''}`} aria-hidden={!imagem}>
          {imagem ? (
            <img src={asset(imagem.src)} alt={imagem.alt} loading="lazy" decoding="async" />
          ) : (
            <p className="mao indice__sem-foto">ainda sem print público desse aqui</p>
          )}
        </div>
      </article>
    </li>
  )
}
