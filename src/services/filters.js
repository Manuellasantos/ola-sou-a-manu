// funções dos filtros de projetos

export const ORDEM_CATEGORIAS = [
  'Análise de Dados',
  'Ciência de Dados',
  'Engenharia de Dados',
  'Business Intelligence',
  'Inteligência Artificial',
  'Machine Learning',
  'Infraestrutura e Cloud Computing',
  'Desenvolvimento Frontend',
  'Desenvolvimento Backend',
  'Desenvolvimento Full Stack',
  'Banco de Dados',
  'Geoprocessamento',
  'UI/UX Design',
  'Impacto Social',
]

export const TIPOS = {
  academico: 'Acadêmicos',
  pessoal: 'Pessoais',
  equipe: 'Em equipe',
  hackathon: 'Hackathons e competições',
}

export const FILTROS_VAZIOS = {
  busca: '',
  categoria: 'Todos',
  tecnologia: '',
  tipos: [],
  comDemo: false,
  status: '',
}

// retorna só as categorias que têm projetos
export function categoriasDisponiveis(projetos) {
  const usadas = new Set(projetos.flatMap((p) => p.categorias))
  return ORDEM_CATEGORIAS.filter((c) => usadas.has(c))
}

export function tecnologiasDisponiveis(projetos) {
  return [...new Set(projetos.flatMap((p) => p.tecnologias))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function statusDisponiveis(projetos) {
  return [...new Set(projetos.map((p) => p.status).filter(Boolean))]
}

const normalizar = (texto) =>
  (texto ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

function temTipo(projeto, tipo) {
  if (tipo === 'equipe') return projeto.equipe
  return projeto.tipo.includes(tipo)
}

export function filtrarProjetos(projetos, filtros) {
  const busca = normalizar(filtros.busca).trim()
  return projetos.filter((p) => {
    if (filtros.categoria !== 'Todos' && !p.categorias.includes(filtros.categoria)) return false
    if (filtros.tecnologia && !p.tecnologias.includes(filtros.tecnologia)) return false
    if (filtros.tipos.length && !filtros.tipos.every((t) => temTipo(p, t))) return false
    if (filtros.comDemo && !p.links.deploy) return false
    if (filtros.status && p.status !== filtros.status) return false
    if (busca) {
      const alvo = normalizar([p.nome, p.resumo, ...p.categorias, ...p.tecnologias].join(' '))
      if (!busca.split(/\s+/).every((termo) => alvo.includes(termo))) return false
    }
    return true
  })
}

export function filtrosAtivos(filtros) {
  return (
    filtros.busca.trim() !== '' ||
    filtros.categoria !== 'Todos' ||
    filtros.tecnologia !== '' ||
    filtros.tipos.length > 0 ||
    filtros.comDemo ||
    filtros.status !== ''
  )
}
