import { useState } from 'react'
import Balao from '../../animations/Balao'
import { asset } from '../../config/site'
import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import { Estrela } from '../Colagem'

export default function Epilogo() {
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
    <section id="contato" className="section tema-preto epilogo" aria-labelledby="contato-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <p className="mao epilogo__nota">fico feliz que chegou até aqui</p>
        <h2 id="contato-titulo" className="epilogo__titulo">
          Vamos <span className="destaque">conversar?</span>
        </h2>
        <p className="epilogo__texto">Pode ser sobre dados, um projeto, uma oportunidade ou um livro de suspense. Respondo por e-mail e pelo LinkedIn.</p>

        <ul className="epilogo__links">
          <li>
            <a href={`mailto:${email}`}>{email}</a>
            <button type="button" className="epilogo__copiar mono" onClick={copiar}>
              {copiado ? 'copiado!' : 'copiar'}
            </button>
          </li>
          <li>
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          {curriculo && (
            <li>
              <a href={asset(curriculo)} target="_blank" rel="noreferrer">
                Currículo (PDF)
              </a>
            </li>
          )}
        </ul>
        <span className="sr-only" aria-live="polite">
          {copiado ? 'E-mail copiado' : ''}
        </span>
        <Estrela className="epilogo__estrela" semente={40} pontas={13} cor="var(--rosa)" />
        <Balao />
      </div>
    </section>
  )
}
