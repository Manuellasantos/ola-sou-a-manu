import { useNaTela } from '../../hooks/useNaTela'
import { perfil } from '../../services/data'
import Capitulo from '../Capitulo'
import Icone from '../Icone'
import { Estrela, Rasgo } from '../Colagem'

// ícone de cada item
const ICONES = ['pena', 'gato', 'chapeu', 'livro', 'rosa', 'pegada', 'peca', 'sorvete', 'onda', 'pena', 'livro', 'gato', 'onda']

export default function AlemDaTecnologia() {
  const [ref, visivel] = useNaTela()
  const ficha = perfil.ficha.filter(([campo]) => !['Nome', 'Idade', 'Habitat', 'Estuda'].includes(campo))

  return (
    <section id="alem" className="section tema-pink alem-secao" aria-labelledby="alem-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="02" id="alem-titulo">
          Além da tecnologia
        </Capitulo>
        <p className="alem__abertura">{perfil.alem.abertura}</p>
        <p className="alem__texto">{perfil.alem.texto}</p>

        <ul className="mural" aria-label="Algumas coisas sobre mim">
          {ficha.map(([campo, valor], i) => (
            <li key={campo} className={`mural__item mural__item--${i % 4}`} style={{ '--i': i }}>
              <span className="mural__icone">
                <Icone nome={ICONES[i % ICONES.length]} />
              </span>
              <span className="mural__campo mono">{campo}</span>
              <span className="mural__valor">{valor}</span>
            </li>
          ))}
        </ul>
        <Estrela className="alem__estrela" semente={33} pontas={10} cor="var(--preto)" />
      </div>
      <Rasgo cor="var(--off)" semente={12} />
    </section>
  )
}
