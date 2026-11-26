import RosaGenerativa from '../../animations/RosaGenerativa'
import { asset, irParaSecao, linkSecao } from '../../config/site'
import { perfil } from '../../services/data'
import { AdesivoBarras, Estrela, Faixa, SetaMao } from '../Colagem'
import Icone from '../Icone'

// estilo de cada letra do nome
const ESTILOS = ['rosa', 'preto', 'contorno', 'pastel', 'branco', 'rosa', 'preto', 'contorno']

function NomeRecortado({ nome }) {
  return (
    <span className="recorte" aria-label={nome} role="text">
      {[...nome].map((letra, i) => (
        <span key={i} aria-hidden="true" className={`recorte__letra recorte__letra--${ESTILOS[i % ESTILOS.length]}`} style={{ '--i': i, '--giro': `${((i * 37) % 11) - 5}deg` }}>
          {letra}
        </span>
      ))}
    </span>
  )
}

const FAIXA_1 = ['Ciência de Dados', 'Engenharia de Dados', 'Análise de Dados', 'Inteligência Artificial', 'Fatec Sebrae', 'São Paulo']
const FAIXA_2 = ['Python', 'SQL', 'Pandas', 'NumPy', 'Databricks', 'Spark', 'Plotly', 'Streamlit', 'React', 'Git']

export default function Abertura() {
  return (
    <>
      <section id="inicio" className="abertura" aria-labelledby="abertura-titulo">
        <div className="wrap abertura__palco">
          <Estrela className="abertura__estrela abertura__estrela--1" semente={4} cor="var(--rosa)" />
          <Estrela className="abertura__estrela abertura__estrela--2" semente={9} pontas={11} />

          <h1 id="abertura-titulo" className="abertura__titulo">
            <span className="abertura__prazer">Prazer, sou a</span>
            <NomeRecortado nome="Manuella" />
            <span className="abertura__exclamacao" aria-hidden="true">
              !
            </span>
          </h1>

          <div className="abertura__colagem">
            <figure className="polaroide folha fita">
              {perfil.foto ? (
                <img src={asset(perfil.foto)} alt="Foto da Manuella" className="polaroide__foto" />
              ) : (
                <RosaGenerativa />
              )}
              <figcaption className="mao">{perfil.foto ? 'eu!' : 'rosa, minha flor favorita'}</figcaption>
            </figure>
            <AdesivoBarras className="abertura__adesivo abertura__adesivo--barras" />
          </div>

          <div className="abertura__texto">
            <p className="abertura__sub">
              Estudante de <span className="destaque">Ciência de Dados</span> para Negócios na Fatec Sebrae e técnica em Informática para Internet.
            </p>
            <p className="abertura__apoio">Gosto de pegar um dado bagunçado e entender o que ele está tentando dizer.</p>
            <div className="abertura__acoes">
              <a className="btn btn-primary" href={linkSecao('projetos')} onClick={(e) => irParaSecao('projetos', e)}>
                Ver meus projetos <Icone nome="seta" />
              </a>
              <a className="btn" href={linkSecao('sobre')} onClick={(e) => irParaSecao('sobre', e)}>
                Sobre mim
              </a>
            </div>
            <p className="mao abertura__dica">
              <SetaMao className="abertura__seta" />
              (tem um gato andando pelos projetos)
            </p>
          </div>
        </div>
      </section>
      <div className="faixas">
        <Faixa itens={FAIXA_1} />
        <Faixa itens={FAIXA_2} invertida tema="rosa" />
      </div>
    </>
  )
}
