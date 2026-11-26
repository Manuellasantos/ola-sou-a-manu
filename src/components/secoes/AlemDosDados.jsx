import { irParaSecao, linkSecao } from '../../config/site'
import { useNaTela } from '../../hooks/useNaTela'
import { tocar } from '../../services/audio'
import { perfil } from '../../services/data'

import Icone from '../Icone'

// ícones de traço desenhados no projeto, cada card com a sua cor
const ICONE = { mj: 'chapeu', gatos: 'gato', livros: 'livro', corvinal: 'pena', intj: 'peca', suricato: 'pegada', rosas: 'rosa', acai: 'sorvete', esporte: 'onda' }
const CORES = ['var(--c-rosa)', 'var(--c-menta)', 'var(--c-lavanda)', 'var(--c-ceu)', 'var(--c-pessego)', 'var(--c-manteiga)']

export default function AlemDosDados() {
  const [ref, visivel] = useNaTela()

  const abrirPassagem = (e) => {
    window.dispatchEvent(new Event('passagem-secreta'))
    irParaSecao('projetos', e)
  }

  const acao = {
    mj: (
      <a className="btn btn-sm" href={linkSecao('projetos')} onClick={(e) => irParaSecao('projetos', e)}>
        Ver o moonwalk
      </a>
    ),
    corvinal: (
      <button type="button" className="btn btn-sm" onClick={abrirPassagem}>
        Abrir a passagem secreta
      </button>
    ),
    rosas: (
      <button type="button" className="btn btn-sm" onClick={(e) => { tocar('natureza'); irParaSecao('inicio', e) }}>
        Ver a rosa
      </button>
    ),
  }

  return (
    <section id="alem" className="section alem secao--lavanda" aria-labelledby="alem-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <p className="eyebrow">Além dos dados</p>
        <h2 id="alem-titulo" className="section-title">
          Nem só de código e dados <em>vive uma pessoa</em>.
        </h2>
        <ul className="alem__grade">
          {perfil.alemDosDados.map((item, i) => (
            <li key={item.id} className={`alem__card glass alem__card--${item.id}`} style={{ '--i': i, '--cor': CORES[i % CORES.length] }}>
              <span className="alem__simbolo">
                <Icone nome={ICONE[item.id]} />
              </span>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
              {acao[item.id]}
            </li>
          ))}
        </ul>
        <p className="notice">Dica: digite “corvinal” em qualquer lugar da página.</p>
      </div>
    </section>
  )
}
