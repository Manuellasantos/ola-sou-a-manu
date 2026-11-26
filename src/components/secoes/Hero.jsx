import { useEffect, useState } from 'react'
import RosaGenerativa from '../../animations/RosaGenerativa'
import { irParaSecao, linkSecao } from '../../config/site'
import { usePreferencias } from '../../hooks/usePreferencias'
import { perfil } from '../../services/data'
import Icone from '../Icone'

const VERBOS = ['investigo', 'organizo', 'conecto', 'visualizo', 'questiono']
// cada palavra do título ganha uma cor da paleta
const CORES_PALAVRAS = ['var(--c-rosa)', 'var(--c-lavanda)', 'var(--c-menta)', 'var(--c-pessego)']

function TextoCinetico({ texto }) {
  // cada letra sobe com um pequeno atraso; leitores de tela leem o texto inteiro.
  // As letras ficam agrupadas por palavra para a quebra de linha nunca cortar "Ma-nu".
  let indice = 0
  return (
    <span className="cinetico" aria-label={texto} role="text">
      {texto.split(' ').map((palavra, p) => (
        <span key={p} className="cinetico__palavra" aria-hidden="true" style={{ '--cor': CORES_PALAVRAS[p % CORES_PALAVRAS.length] }}>
          {[...palavra].map((letra) => (
            <span key={indice} style={{ '--i': indice++ }} className="cinetico__letra">
              {letra}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const { animar } = usePreferencias()
  const [verbo, setVerbo] = useState(0)

  useEffect(() => {
    if (!animar) return
    const id = setInterval(() => setVerbo((v) => (v + 1) % VERBOS.length), 2400)
    return () => clearInterval(id)
  }, [animar])

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-titulo">
      <div className="wrap hero__grade">
        <div className="hero__texto">
          <p className="eyebrow">Portfólio · {perfil.local}</p>
          <h1 id="hero-titulo" className="hero__titulo">
            <TextoCinetico texto="Olá, sou a Manu" />
          </h1>
          <p className="hero__verbo" aria-live="off">
            Eu <span className="hero__palavra" key={verbo}>{VERBOS[verbo]}</span> dados.
          </p>
        </div>
        <RosaGenerativa />
      </div>

      <div className="wrap hero__apresentacao">
        <div className="hero__bio">
          <h2 className="hero__prazer">
            Prazer, sou a <em>Manuella</em>.
          </h2>
          {perfil.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="hero__acoes">
            <a className="btn btn-primary" href={linkSecao('projetos')} onClick={(e) => irParaSecao('projetos', e)}>
              Ver projetos <Icone nome="seta" />
            </a>
            <a className="btn" href={perfil.links.github} target="_blank" rel="noreferrer">
              <Icone nome="github" /> GitHub
            </a>
            <a className="btn" href={perfil.links.linkedin} target="_blank" rel="noreferrer">
              <Icone nome="linkedin" /> LinkedIn
            </a>
            <a className="btn" href={`mailto:${perfil.links.email}`}>
              <Icone nome="email" /> E-mail
            </a>
          </div>
        </div>
        <ul className="tracos" aria-label="Como eu sou">
          {perfil.tracos.map((t, i) => (
            <li key={t.rotulo} style={{ '--cor': CORES_PALAVRAS[i % CORES_PALAVRAS.length] }}>
              <strong>{t.rotulo}</strong>
              <span>{t.detalhe}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
