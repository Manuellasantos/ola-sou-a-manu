// Caminho para arquivos em public/, respeitando o "base" do Vite (GitHub Pages)
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

// Com HashRouter, "#sobre" seria lido como rota. Por isso a navegação entre seções
// usa "#/?secao=sobre" como link e rola direto quando já estamos na home.
export const linkSecao = (id) => `#/?secao=${id}`

export function irParaSecao(id, evento) {
  const alvo = document.getElementById(id)
  if (!alvo) return
  evento?.preventDefault()
  const reduzir = document.documentElement.dataset.motion !== 'normal'
  alvo.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' })
  // move o foco para a seção, para quem navega por teclado ou leitor de tela
  alvo.setAttribute('tabindex', '-1')
  alvo.focus({ preventScroll: true })
}
