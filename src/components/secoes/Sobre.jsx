import Suricato from '../../animations/Suricato'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'

const CORES = ['var(--c-ceu)', 'var(--c-menta)', 'var(--c-lavanda)', 'var(--c-pessego)']

export default function Sobre() {
  const [ref, visivel] = useNaTela()

  return (
    <section id="sobre" className="section secao--ceu" aria-labelledby="sobre-titulo">
      <div className={`wrap sobre reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <div className="sobre__texto">
          <p className="eyebrow">Formação e interesses</p>
          <h2 id="sobre-titulo" className="section-title">
            O que me trouxe <em>até aqui</em>.
          </h2>
          <ul className="interesses">
            {perfil.interesses.map((item, i) => (
              <li key={item.titulo} className="glass" style={{ '--cor': CORES[i % CORES.length] }}>
                <strong>{item.titulo}</strong>
                <span>{item.texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="sobre__formacao" aria-label="Formação">
          <div className="formacao-card glass">
            <Suricato visivel={visivel} />
            <h3>Formação</h3>
            <ol className="formacao-lista">
              <li>
                <span className="mono muted">em andamento</span>
                <strong>Ciência de Dados para Negócios</strong>
                <span>Fatec Sebrae</span>
              </li>
              <li>
                <span className="mono muted">concluído em 2025</span>
                <strong>Técnico em Informática para Internet</strong>
                <span>Etec Albert Einstein</span>
              </li>
              <li>
                <span className="mono muted">2026</span>
                <strong>Trilha Fundamentos de Engenharia de Dados e Machine Learning</strong>
                <span>TOTVS</span>
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  )
}
