import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Abertura from '../components/secoes/Abertura'
import Caminho from '../components/secoes/Caminho'
import Epilogo from '../components/secoes/Epilogo'
import Habilidades from '../components/secoes/Habilidades'
import AlemDaTecnologia from '../components/secoes/AlemDaTecnologia'
import Analises from '../components/secoes/Analises'
import Estudos from '../components/secoes/Estudos'
import Projetos from '../components/secoes/Projetos'
import QuemSou from '../components/secoes/QuemSou'
import { irParaSecao } from '../config/site'

// página inicial com todas as seções
export default function Inicio() {
  const [params] = useSearchParams()
  const secao = params.get('secao')

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
      <Abertura />
      <QuemSou />
      <AlemDaTecnologia />
      <Caminho />
      <Habilidades />
      <Projetos />
      <Analises />
      <Estudos />
      <Epilogo />
    </>
  )
}
