import { Link } from 'react-router-dom'
import { asset } from '../config/site'
import CapaProjeto from './CapaProjeto'
import { Estrela } from './Colagem'
import Icone from './Icone'

export const rotuloTipo = (p) =>
  [p.tipo.includes('academico') && 'acadêmico', p.tipo.includes('pessoal') && 'pessoal', p.tipo.includes('hackathon') && 'hackathon', p.equipe && 'em equipe']
    .filter(Boolean)
    .join(' · ')

// tamanho e tema de cada peça do bento: os projetos de dados ganham as maiores
const LAYOUT = {
  1: { tamanho: 'bento--xl', tema: 'tema-preto' },
  2: { tamanho: 'bento--largo', tema: 'tema-rosa' },
  3: { tamanho: 'bento--largo', tema: '' },
  4: { tamanho: 'bento--alto', tema: 'tema-pink' },
}
const TEMAS_ROTATIVOS = ['', 'tema-rosa', '', 'tema-preto', 'tema-rosa', '']

/** Print do projeto dentro de uma moldura: navegador para web, celular para app. */
function Mockup({ projeto }) {
  const img = projeto.imagens[0]
  if (!img) return <CapaProjeto projeto={projeto} />
  if (img.mobile) {
    return (
      <div className="mockup mockup--celular">
        <img src={asset(img.src)} alt={img.alt} loading="lazy" decoding="async" />
      </div>
    )
  }
  return (
    <div className="mockup mockup--navegador">
      <span className="mockup__barra" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <img src={asset(img.src)} alt={img.alt} loading="lazy" decoding="async" />
    </div>
  )
}

export default function CardProjeto({ projeto: p, numero }) {
  const layout = LAYOUT[p.destaque] ?? { tamanho: '', tema: TEMAS_ROTATIVOS[numero % TEMAS_ROTATIVOS.length] }
  return (
    <li className={`bento__item ${layout.tamanho}`} data-slug={p.slug} style={{ '--giro': `${((numero * 53) % 5) - 2}deg` }}>
      <article className={`peca ${layout.tema}`} aria-labelledby={`proj-${p.slug}`}>
        <span className="peca__numero" aria-hidden="true">
          {String(numero).padStart(2, '0')}
        </span>
        {p.conquistas.length > 0 && (
          <span className="peca__selo" aria-hidden="true">
            <Estrela semente={numero} pontas={12} cor="var(--rosa-medio)" />
            <b>{p.conquistas[0].split(" — ")[0]}</b>
          </span>
        )}
        <div className="peca__imagem">
          <Mockup projeto={p} />
        </div>
        <div className="peca__corpo">
          <p className="peca__meta mono">
            {rotuloTipo(p)}
            {p.status && ` · ${p.status.toLowerCase()}`}
            {p.dadosFicticios && ' · dados fictícios'}
          </p>
          <h3 id={`proj-${p.slug}`}>
            <Link to={`/projeto/${p.slug}`} className="peca__nome">
              {p.nome}
            </Link>
          </h3>
          {p.conquistas.map((c) => (
            <p key={c} className="badge peca__conquista">
              <Icone nome="trofeu" /> {c}
            </p>
          ))}
          <p className="peca__resumo">{p.resumo}</p>
          <p className="peca__categorias">{p.categorias.slice(0, 3).join(' / ')}</p>
          <ul className="peca__tags" aria-label="Tecnologias">
            {p.tecnologias.slice(0, 6).map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
            {p.tecnologias.length > 6 && <li className="tag">+{p.tecnologias.length - 6}</li>}
          </ul>
          <p className="peca__links">
            <Link to={`/projeto/${p.slug}`} className="btn btn-sm btn-primary">
              Ver detalhes<span className="sr-only"> de {p.nome}</span>
            </Link>
            <a className="btn btn-sm" href={p.links.github} target="_blank" rel="noreferrer">
              <Icone nome="github" /> GitHub<span className="sr-only"> de {p.nome}</span>
            </a>
            {p.links.deploy && (
              <a className="btn btn-sm" href={p.links.deploy} target="_blank" rel="noreferrer">
                <Icone nome="externo" /> Demo<span className="sr-only"> de {p.nome}</span>
              </a>
            )}
            {p.links.figma && (
              <a className="btn btn-sm" href={p.links.figma} target="_blank" rel="noreferrer">
                <Icone nome="figma" /> Figma<span className="sr-only"> de {p.nome}</span>
              </a>
            )}
          </p>
        </div>
      </article>
    </li>
  )
}
