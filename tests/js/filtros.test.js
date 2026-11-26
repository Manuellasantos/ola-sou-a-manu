import { describe, expect, it } from 'vitest'
import projetos from '../../src/data/projects.json'
import {
  FILTROS_VAZIOS,
  categoriasDisponiveis,
  filtrarProjetos,
  filtrosAtivos,
} from '../../src/services/filters'

const filtrar = (parcial) => filtrarProjetos(projetos, { ...FILTROS_VAZIOS, ...parcial })

describe('catálogo de projetos', () => {
  it('tem os 11 projetos, com slugs únicos e link para o GitHub', () => {
    expect(projetos).toHaveLength(11)
    expect(new Set(projetos.map((p) => p.slug)).size).toBe(11)
    projetos.forEach((p) => expect(p.links.github).toMatch(/^https:\/\/github\.com\//))
  })

  it('não tem link de deploy inventado', () => {
    const semDeploy = projetos.filter((p) => !p.links.deploy).map((p) => p.slug)
    expect(semDeploy.sort()).toEqual(['analise-aws', 'dashboard-excel', 'lavanderia', 'voebem'])
  })
})

describe('filtros', () => {
  it('sem filtros mostra todos', () => {
    expect(filtrar({})).toHaveLength(11)
    expect(filtrosAtivos(FILTROS_VAZIOS)).toBe(false)
  })

  it('só lista categorias que têm projetos', () => {
    const cats = categoriasDisponiveis(projetos)
    cats.forEach((c) => expect(filtrar({ categoria: c }).length).toBeGreaterThan(0))
  })

  it('filtra por categoria (um projeto pode estar em várias)', () => {
    const eng = filtrar({ categoria: 'Engenharia de Dados' }).map((p) => p.slug)
    expect(eng).toContain('voebem')
    expect(eng).toContain('spotify-etl')
  })

  it('busca ignora acentos e maiúsculas e procura em tecnologias', () => {
    expect(filtrar({ busca: 'PANDAS' }).map((p) => p.slug)).toContain('spotify-etl')
    expect(filtrar({ busca: 'analise aws' }).map((p) => p.slug)).toEqual(['analise-aws'])
  })

  it('combina tipo, tecnologia e demonstração online', () => {
    const r = filtrar({ tipos: ['hackathon'], comDemo: true })
    expect(r.map((p) => p.slug).sort()).toEqual(['black-in-tech', 'focinho-amigo'])
    expect(filtrar({ tecnologia: 'Databricks' }).map((p) => p.slug)).toEqual(['voebem'])
    expect(filtrar({ tipos: ['equipe', 'pessoal'] })).toHaveLength(0)
  })

  it('filtra por status conhecido', () => {
    expect(filtrar({ status: 'MVP' }).map((p) => p.slug)).toEqual(['vagalume'])
  })
})
