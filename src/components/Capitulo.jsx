/**
 * Cabeçalho de capítulo do "caderno": número romano vazado, anotação à mão e título.
 * Os capítulos contam a história na ordem: quem sou, de onde vim, o que sei e o que fiz.
 */
export default function Capitulo({ numero, nota, id, children }) {
  return (
    <header className="capitulo">
      <span className="capitulo__numero" aria-hidden="true">
        {numero}
      </span>
      <div>
        <p className="capitulo__nota mao">
          <span className="sr-only">Capítulo {numero}: </span>
          {nota}
        </p>
        <h2 id={id} className="capitulo__titulo">
          {children}
        </h2>
      </div>
    </header>
  )
}
