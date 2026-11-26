import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil, projetoPorSlug } from '../../services/data'

// símbolo + rótulo por tipo: a informação não depende só da cor
const TIPOS = {
  formacao: { rotulo: 'Formação', simbolo: '◆', cor: 'var(--c-ceu)' },
  experiencia: { rotulo: 'Experiência', simbolo: '●', cor: 'var(--c-menta)' },
  pesquisa: { rotulo: 'Pesquisa', simbolo: '◎', cor: 'var(--c-lavanda)' },
  voluntariado: { rotulo: 'Voluntariado', simbolo: '◇', cor: 'var(--c-pessego)' },
  certificacao: { rotulo: 'Certificação', simbolo: '▲', cor: 'var(--c-manteiga)' },
  hackathon: { rotulo: 'Hackathon', simbolo: '⬢', cor: 'var(--c-rosa)' },
  conquista: { rotulo: 'Conquista', simbolo: '★', cor: 'var(--c-manteiga)' },
  projeto: { rotulo: 'Projeto', simbolo: '■', cor: 'var(--c-rosa)' },
}

export default function Trajetoria() {
  const [ref, visivel] = useNaTela()
  const [filtro, setFiltro] = useState('todos')
  const [aberto, setAberto] = useState(null)
  const itens = [...perfil.trajetoria].sort((a, b) => a.ordem - b.ordem).filter((i) => filtro === 'todos' || i.tipo === filtro)

  return (
    <section id="trajetoria" className="section secao--pessego" aria-labelledby="traj-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <p className="eyebrow">Trajetória e conquistas</p>
        <h2 id="traj-titulo" className="section-title">
          Da Etec ao <em>pipeline</em> de 1 milhão de voos.
        </h2>
        <div className="filtros__chips" role="group" aria-label="Filtrar linha do tempo">
          <button type="button" className="chip" aria-pressed={filtro === 'todos'} onClick={() => setFiltro('todos')}>
            Tudo
          </button>
          {Object.entries(TIPOS).map(([valor, t]) => (
            <button key={valor} type="button" className="chip" aria-pressed={filtro === valor} onClick={() => setFiltro(valor)}>
              <span aria-hidden="true">{t.simbolo}</span> {t.rotulo}
            </button>
          ))}
        </div>

        <ol className="linha-tempo">
          {itens.map((item, i) => {
            const id = `traj-${i}-${item.tipo}`
            const expandido = aberto === item.titulo
            return (
              <li key={item.titulo} className={`linha-tempo__item linha-tempo__item--${item.tipo}`} style={{ '--i': i, '--cor': TIPOS[item.tipo].cor }}>
                <span className="linha-tempo__marco" aria-hidden="true">
                  {TIPOS[item.tipo].simbolo}
                </span>
                <div className="linha-tempo__card glass">
                  <p className="mono muted">
                    {item.ano} · {TIPOS[item.tipo].rotulo}
                  </p>
                  <h3>
                    <button type="button" aria-expanded={expandido} aria-controls={id} onClick={() => setAberto(expandido ? null : item.titulo)}>
                      {item.titulo}
                      <span aria-hidden="true" className="linha-tempo__mais">{expandido ? '−' : '+'}</span>
                    </button>
                  </h3>
                  <p className="muted">{item.local}</p>
                  <div id={id} hidden={!expandido} className="linha-tempo__detalhe">
                    <p>{item.texto}</p>
                    {item.projetos?.map((slug) => (
                      <Link key={slug} className="btn btn-sm" to={`/projeto/${slug}`}>
                        Ver {projetoPorSlug(slug)?.nome.split(' — ')[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
        <p className="notice">Datas do meu currículo. Para os projetos de 2026 sem mês informado, a ordem segue a criação dos repositórios no GitHub.</p>
      </div>
    </section>
  )
}
