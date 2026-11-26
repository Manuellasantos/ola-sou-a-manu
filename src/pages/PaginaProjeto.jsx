import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import CapaProjeto from '../components/CapaProjeto'
import { rotuloTipo } from '../components/CardProjeto'
import Icone from '../components/Icone'
import Pipeline from '../components/Pipeline'
import { asset } from '../config/site'
import { projetoPorSlug, projetosOrdenados } from '../services/data'
import NaoEncontrada from './NaoEncontrada'

function Bloco({ titulo, children, quando = true }) {
  if (!quando) return null
  return (
    <section className="detalhe__bloco">
      <h2>{titulo}</h2>
      {children}
    </section>
  )
}

const Lista = ({ itens }) => (
  <ul className="detalhe__lista">
    {itens.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
)

export default function PaginaProjeto() {
  const { slug } = useParams()
  const p = projetoPorSlug(slug)

  useEffect(() => {
    if (p) document.title = `${p.nome} · Manuella Santos Cruz`
  }, [p])

  if (!p) return <NaoEncontrada />
  const d = p.detalhes
  const indice = projetosOrdenados.findIndex((x) => x.slug === slug)
  const proximo = projetosOrdenados[(indice + 1) % projetosOrdenados.length]

  return (
    <article className="detalhe wrap section" aria-labelledby="detalhe-titulo">
      <Link className="btn btn-sm detalhe__voltar" to="/?secao=projetos">
        <Icone nome="voltar" /> Todos os projetos
      </Link>

      <header className="detalhe__topo">
        <p className="eyebrow">{rotuloTipo(p)}{p.origem ? ` · ${p.origem}` : ''}</p>
        <h1 id="detalhe-titulo" className="section-title">{p.nome}</h1>
        <p className="lead">{p.resumo}</p>
        <div className="detalhe__selos">
          {p.status && <span className="badge">◐ {p.status}</span>}
          {p.conquistas.map((c) => (
            <span key={c} className="badge">
              <Icone nome="trofeu" /> {c}
            </span>
          ))}
          {p.dadosFicticios && <span className="badge">Dados fictícios</span>}
        </div>
        <div className="detalhe__links">
          <a className="btn btn-primary" href={p.links.github} target="_blank" rel="noreferrer">
            <Icone nome="github" /> Repositório
          </a>
          {p.links.deploy ? (
            <a className="btn" href={p.links.deploy} target="_blank" rel="noreferrer">
              <Icone nome="externo" /> Demonstração online
            </a>
          ) : (
            <span className="muted detalhe__sem-deploy">Sem demonstração online: a documentação está no repositório.</span>
          )}
          {p.links.figma && (
            <a className="btn" href={p.links.figma} target="_blank" rel="noreferrer">
              <Icone nome="figma" /> Figma
            </a>
          )}
        </div>
      </header>

      <div className="detalhe__galeria">
        {p.imagens.length ? (
          p.imagens.map((img) => (
            <figure key={img.src} className={`glass ${img.mobile ? 'detalhe__img--mobile' : ''}`}>
              <img src={asset(img.src)} alt={img.alt} loading="lazy" decoding="async" />
              <figcaption className="mono muted">{img.alt} · captura real do repositório</figcaption>
            </figure>
          ))
        ) : (
          <figure className="glass">
            <CapaProjeto projeto={p} grande />
          </figure>
        )}
      </div>

      <div className="detalhe__grade">
        <div className="detalhe__principal">
          <Bloco titulo="Contexto" quando={d.contexto}>
            <p>{d.contexto}</p>
          </Bloco>
          <Bloco titulo="Problema" quando={d.problema}>
            <p>{d.problema}</p>
          </Bloco>
          <Bloco titulo="Objetivo" quando={d.objetivo}>
            <p>{d.objetivo}</p>
          </Bloco>
          <Bloco titulo="Metodologia e arquitetura" quando={d.metodologia}>
            <p>{d.metodologia}</p>
            {(d.arquitetura === 'medalhao' || d.arquitetura === 'etl') && <Pipeline tipo={d.arquitetura} />}
          </Bloco>
          <Bloco titulo="Tratamento dos dados" quando={d.tratamento?.length}>
            <Lista itens={d.tratamento} />
          </Bloco>
          <Bloco titulo="Funcionalidades" quando={d.funcionalidades?.length}>
            <Lista itens={d.funcionalidades} />
          </Bloco>
          <Bloco titulo="Cálculos e análises" quando={d.calculos?.length}>
            <Lista itens={d.calculos} />
          </Bloco>
          <Bloco titulo="Resultados" quando={d.resultados}>
            <p>{d.resultados}</p>
          </Bloco>
          <Bloco titulo="Limitações" quando={d.limitacoes?.length}>
            <Lista itens={d.limitacoes} />
          </Bloco>
          <Bloco titulo="Aprendizados" quando={d.aprendizados?.length}>
            <Lista itens={d.aprendizados} />
          </Bloco>
        </div>

        <aside className="detalhe__lateral glass">
          <h2>Minha contribuição</h2>
          <p>{d.contribuicao}</p>
          {d.fontes?.length > 0 && (
            <>
              <h2>Fontes de dados</h2>
              <Lista itens={d.fontes} />
            </>
          )}
          <h2>Tecnologias</h2>
          <ul className="card-projeto__tecs">
            {p.tecnologias.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
          <h2>Categorias</h2>
          <ul className="card-projeto__cats">
            {p.categorias.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </aside>
      </div>

      <nav className="detalhe__proximo" aria-label="Próximo projeto">
        <Link to={`/projeto/${proximo.slug}`} className="glass">
          <span className="mono muted">próximo projeto</span>
          <strong>{proximo.nome}</strong>
          <Icone nome="seta" />
        </Link>
      </nav>
    </article>
  )
}
