// título das seções
export default function Capitulo({ numero, nota, id, children }) {
  return (
    <header className="titulo-secao">
      <span className="titulo-secao__numero mono" aria-hidden="true">
        {numero}
      </span>
      <h2 id={id} className="titulo-secao__titulo">
        {children}
      </h2>
      {nota && <p className="titulo-secao__nota mao">{nota}</p>}
    </header>
  )
}
