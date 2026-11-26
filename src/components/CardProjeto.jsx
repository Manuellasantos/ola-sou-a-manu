import { Link } from 'react-router-dom'
import CapaProjeto from './CapaProjeto'
import Icone from './Icone'

// cor do card pela área principal do projeto
const COR_AREA = {
  'Engenharia de Dados': 'var(--c-ceu)',
  'Ciência de Dados': 'var(--c-menta)',
  'Análise de Dados': 'var(--c-menta)',
  'Business Intelligence': 'var(--c-manteiga)',
  'Inteligência Artificial': 'var(--c-lavanda)',
  'Infraestrutura e Cloud Computing': 'var(--c-ceu)',
  'Desenvolvimento Full Stack': 'var(--c-pessego)',
  'Desenvolvimento Frontend': 'var(--c-rosa)',
}
export const corDoProjeto = (p) => COR_AREA[p.categorias[0]] ?? 'var(--c-rosa)'

const TAMANHO = { 1: 'bento--xl', 2: 'bento--largo', 3: 'bento--largo', 4: 'bento--alto' }

export const rotuloTipo = (p) =>
  [p.tipo.includes('academico') && 'Acadêmico', p.tipo.includes('pessoal') && 'Pessoal', p.tipo.includes('hackathon') && 'Hackathon', p.equipe && 'Em equipe']
    .filter(Boolean)
    .join(' · ')

export default function CardProjeto({ projeto: p, compacto = false }) {
  const tamanho = compacto ? '' : TAMANHO[p.destaque] ?? ''
  return (
    <article className={`card-projeto glass ${tamanho}`} data-slug={p.slug} aria-labelledby={`card-${p.slug}`} style={{ '--cor': corDoProjeto(p) }}>
      <CapaProjeto projeto={p} />
      <div className="card-projeto__corpo">
        <div className="card-projeto__meta mono">
          <span>{rotuloTipo(p)}</span>
          {p.status && <span className="card-projeto__status">◐ {p.status}</span>}
          {p.dadosFicticios && <span className="card-projeto__status">dados fictícios</span>}
        </div>
        <h3 id={`card-${p.slug}`}>{p.nome}</h3>
        {p.conquistas.map((c) => (
          <p key={c} className="badge card-projeto__conquista">
            <Icone nome="trofeu" /> {c}
          </p>
        ))}
        <p className="card-projeto__resumo">{p.resumo}</p>
        <ul className="card-projeto__cats" aria-label="Categorias">
          {p.categorias.slice(0, 4).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <ul className="card-projeto__tecs" aria-label="Tecnologias">
          {p.tecnologias.slice(0, 6).map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
          {p.tecnologias.length > 6 && <li className="tag">+{p.tecnologias.length - 6}</li>}
        </ul>
        <div className="card-projeto__acoes">
          <Link className="btn btn-sm btn-primary" to={`/projeto/${p.slug}`}>
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
        </div>
      </div>
    </article>
  )
}
