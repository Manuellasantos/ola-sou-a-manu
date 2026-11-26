import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="mao">página 404</p>
        <h1 className="titulo-secao__titulo">Essa página flutuou para longe.</h1>
        <p className="secao-intro">O endereço não existe, ou ainda não existe.</p>
        <Link className="btn btn-primary" to="/?secao=projetos">
          Voltar para os projetos
        </Link>
      </div>
    </section>
  )
}
