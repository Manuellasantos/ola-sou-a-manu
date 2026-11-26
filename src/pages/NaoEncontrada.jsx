import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section className="section wrap">
      <p className="eyebrow">404</p>
      <h1 className="section-title">Essa página flutuou para longe.</h1>
      <p className="lead">O endereço não existe (ou ainda não existe). Que tal voltar para os projetos?</p>
      <Link className="btn btn-primary" to="/?secao=projetos">
        Ver projetos
      </Link>
    </section>
  )
}
