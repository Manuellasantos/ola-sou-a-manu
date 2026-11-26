import { useState } from 'react'
import Balao from '../../animations/Balao'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import Icone from '../Icone'

export default function Contato() {
  const [ref, visivel] = useNaTela()
  const [copiado, setCopiado] = useState(false)
  const { email, github, linkedin, curriculo } = perfil.links

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <section id="contato" className="section contato secao--rosa" aria-labelledby="contato-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <p className="eyebrow">Contato</p>
        <h2 id="contato-titulo" className="section-title">
          Vamos conversar sobre <em>dados</em>?
        </h2>
        <p className="lead">Quer trocar uma ideia sobre dados, um projeto ou uma oportunidade? Respondo por e-mail ou LinkedIn.</p>
        <div className="contato__acoes">
          <a className="btn btn-primary" href={`mailto:${email}`}>
            <Icone nome="email" /> {email}
          </a>
          <button type="button" className="btn" onClick={copiar}>
            <Icone nome="copiar" /> {copiado ? 'E-mail copiado!' : 'Copiar e-mail'}
          </button>
          <a className="btn" href={linkedin} target="_blank" rel="noreferrer">
            <Icone nome="linkedin" /> LinkedIn
          </a>
          <a className="btn" href={github} target="_blank" rel="noreferrer">
            <Icone nome="github" /> GitHub
          </a>
          {curriculo && (
            <a className="btn" href={curriculo} target="_blank" rel="noreferrer">
              <Icone nome="documento" /> Currículo
            </a>
          )}
        </div>
        <span className="sr-only" aria-live="polite">
          {copiado ? 'E-mail copiado para a área de transferência' : ''}
        </span>
        <Balao />
      </div>
    </section>
  )
}
