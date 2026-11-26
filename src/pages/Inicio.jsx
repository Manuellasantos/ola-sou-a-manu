import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Abertura from '../components/secoes/Abertura'
import Caminho from '../components/secoes/Caminho'
import Epilogo from '../components/secoes/Epilogo'
import Habilidades from '../components/secoes/Habilidades'
import Laboratorio from '../components/secoes/Laboratorio'
import Projetos from '../components/secoes/Projetos'
import QuemSou from '../components/secoes/QuemSou'
import { irParaSecao } from '../config/site'

// A ordem conta a história: primeiro quem eu sou, depois de onde vim,
// o que sei fazer, o que construí e, por fim, os meus próprios dados.
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
      <Caminho />
      <Habilidades />
      <Projetos />
      <Laboratorio />
      <Epilogo />
    </>
  )
}
