import { useEffect, useState } from 'react'
import RosaGenerativa from '../../animations/RosaGenerativa'
import { irParaSecao, linkSecao } from '../../config/site'
import { usePreferencias } from '../../hooks/usePreferencias'
import { Seta } from '../Rabisco'

const VERBOS = ['investigar', 'organizar', 'conectar', 'desenhar', 'questionar']

function TextoCinetico({ texto }) {
  // cada letra sobe com um pequeno atraso; leitores de tela leem a frase inteira
  let indice = 0
  return (
    <span className="cinetico" aria-label={texto} role="text">
      {texto.split(' ').map((palavra, p) => (
        <span key={p} className="cinetico__palavra" aria-hidden="true">
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

export default function Abertura() {
  const { animar } = usePreferencias()
  const [verbo, setVerbo] = useState(0)

  useEffect(() => {
    if (!animar) return
    const id = setInterval(() => setVerbo((v) => (v + 1) % VERBOS.length), 2200)
    return () => clearInterval(id)
  }, [animar])

  return (
    <section id="inicio" className="abertura" aria-labelledby="abertura-titulo">
      <div className="wrap abertura__grade">
        <div className="abertura__texto">
          <p className="mao abertura__rotulo">caderno de campo da Manu · São Paulo</p>
          <h1 id="abertura-titulo" className="abertura__titulo">
            <TextoCinetico texto="Olá, sou a Manu." />
          </h1>
          <p className="abertura__sub">
            Estudo Ciência de Dados e gosto de <span className="marca abertura__verbo" key={verbo}>{VERBOS[verbo]}</span> as coisas até entender
            por que elas são do jeito que são.
          </p>
          <p className="abertura__guia">
            Esse site é meio caderno, meio portfólio. Começa por mim, passa pelo meu caminho e termina nos projetos e nos dados.
          </p>
          <a className="btn btn-primary" href={linkSecao('quem-sou')} onClick={(e) => irParaSecao('quem-sou', e)}>
            Começar pelo começo
          </a>
        </div>

        <div className="abertura__rosa">
          <RosaGenerativa />
          <p className="mao abertura__nota">
            <Seta curva="cima" className="abertura__seta" />
            isso é uma rosa feita de 3.000 pontos.
            <br />a conta foi feita em Python.
          </p>
        </div>
      </div>
    </section>
  )
}
