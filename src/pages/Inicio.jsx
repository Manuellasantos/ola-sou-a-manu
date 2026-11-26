import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import AlemDosDados from '../components/secoes/AlemDosDados'
import Contato from '../components/secoes/Contato'
import DadosGithub from '../components/secoes/DadosGithub'
import Habilidades from '../components/secoes/Habilidades'
import Hero from '../components/secoes/Hero'
import Pesquisa from '../components/secoes/Pesquisa'
import Projetos from '../components/secoes/Projetos'
import Sobre from '../components/secoes/Sobre'
import Trajetoria from '../components/secoes/Trajetoria'
import { irParaSecao } from '../config/site'

export default function Inicio() {
  const [params] = useSearchParams()
  const secao = params.get('secao')

  // links como /#/?secao=projetos (vindos de outra página) rolam até a seção
  useEffect(() => {
    if (!secao) return
    const id = setTimeout(() => irParaSecao(secao), 80)
    return () => clearTimeout(id)
  }, [secao])

  useEffect(() => {
    document.title = 'Manuella Santos Cruz · Ciência de Dados'
  }, [])

  return (
    <>
      <Hero />
      <Sobre />
      <Habilidades />
      <Projetos />
      <Trajetoria />
      <DadosGithub />
      <Pesquisa />
      <AlemDosDados />
      <Contato />
    </>
  )
}
