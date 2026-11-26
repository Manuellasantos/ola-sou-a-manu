/**
 * Título de seção no estilo editorial: número em adesivo, anotação à mão opcional
 * e título grande (use <span className="destaque"> para destacar uma palavra).
 */
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
