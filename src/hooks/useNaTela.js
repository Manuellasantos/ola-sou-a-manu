import { useEffect, useRef, useState } from 'react'

/**
 * Diz se o elemento está visível. Usado para disparar animações só quando a pessoa
 * chega na seção e para pausar canvas fora da tela (economiza bateria).
 */
export function useNaTela({ umaVez = true, margem = '0px 0px -12% 0px', limiar = 0 } = {}) {
  const ref = useRef(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisivel(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          if (umaVez) obs.disconnect()
        } else if (!umaVez) {
          setVisivel(false)
        }
      },
      { rootMargin: margem, threshold: limiar },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [umaVez, margem, limiar])

  return [ref, visivel]
}
