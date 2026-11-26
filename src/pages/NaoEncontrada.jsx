import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section className="section wrap">
      <p className="mao">página 404</p>
      <h1 className="capitulo__titulo">Essa página flutuou para longe.</h1>
      <p className="capitulo__intro">O endereço não existe, ou ainda não existe.</p>
      <Link className="btn btn-primary" to="/?secao=projetos">
        voltar para os projetos
      </Link>
    </section>
  )
}
