import { useEffect, useState } from 'react'
import { carregarDados } from '../services/data'

// carrega um arquivo json da pasta public/data
export function useDados(nome, ativo = true) {
  const [estado, setEstado] = useState({ dados: null, erro: null, carregando: ativo })

  useEffect(() => {
    if (!ativo) return
    let vivo = true
    setEstado((e) => ({ ...e, carregando: true }))
    carregarDados(nome)
      .then((dados) => vivo && setEstado({ dados, erro: null, carregando: false }))
      .catch((erro) => vivo && setEstado({ dados: null, erro, carregando: false }))
    return () => {
      vivo = false
    }
  }, [nome, ativo])

  return estado
}
