import { useEffect, useState } from 'react'

/** Toque, tela pequena ou aparelho modesto: simplifica os efeitos visuais. */
export function useDispositivo() {
  const calcular = () => {
    const toque = window.matchMedia?.('(hover: none)').matches ?? false
    const pequeno = window.innerWidth < 720
    const modesto = (navigator.hardwareConcurrency ?? 8) <= 4 || (navigator.deviceMemory ?? 8) <= 4
    return { toque, pequeno, leve: pequeno || modesto }
  }
  const [info, setInfo] = useState(calcular)
  useEffect(() => {
    const aoRedimensionar = () => setInfo(calcular())
    window.addEventListener('resize', aoRedimensionar)
    return () => window.removeEventListener('resize', aoRedimensionar)
  }, [])
  return info
}
