import projetos from '../data/projects.json'
import perfil from '../data/profile.json'
import { asset } from '../config/site'

export { projetos, perfil }

export const projetoPorSlug = (slug) => projetos.find((p) => p.slug === slug)

// Projetos em destaque primeiro (pela ordem de "destaque"), depois os demais
export const projetosOrdenados = [...projetos].sort(
  (a, b) => (a.destaque ?? 99) - (b.destaque ?? 99),
)

const cache = new Map()

/** Busca um JSON gerado pelos scripts Python em public/data/. */
export function carregarDados(nome) {
  if (!cache.has(nome)) {
    const promessa = fetch(asset(`data/${nome}.json`)).then((r) => {
      if (!r.ok) throw new Error(`Não foi possível carregar ${nome}.json (${r.status})`)
      return r.json()
    })
    promessa.catch(() => cache.delete(nome))
    cache.set(nome, promessa)
  }
  return cache.get(nome)
}
