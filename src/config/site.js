// monta o caminho de um arquivo da pasta public
export const asset = (caminho) => `${import.meta.env.BASE_URL}${caminho.replace(/^\//, '')}`

export const SECOES = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'sobre', rotulo: 'Sobre mim' },
  { id: 'trajetoria', rotulo: 'Trajetória' },
  { id: 'tecnologias', rotulo: 'Tecnologias' },
  { id: 'projetos', rotulo: 'Projetos' },
  { id: 'analises', rotulo: 'Análises' },
  { id: 'estudos', rotulo: 'Estudos' },
  { id: 'contato', rotulo: 'Contato' },
]

// links e rolagem até as seções da página inicial
export const linkSecao = (id) => `#/?secao=${id}`

export function irParaSecao(id, evento) {
  const alvo = document.getElementById(id)
  if (!alvo) return
  evento?.preventDefault()
  const reduzir = document.documentElement.dataset.motion !== 'normal'
  alvo.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' })
  // coloca o foco na seção
  alvo.setAttribute('tabindex', '-1')
  alvo.focus({ preventScroll: true })
}
