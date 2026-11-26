import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ler, salvar } from '../services/storage'
import { configurarAudio } from '../services/audio'

const prefereMenosMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const PADRAO = {
  paleta: 'padrao', // padrao | protanopia | deuteranopia | tritanopia
  contraste: 'normal', // normal | alto
  fonte: 1, // 0.9 a 1.4
  movimento: null, // null = segue o sistema | normal | reduzido | desligado
  audio: false,
  volume: 0.35,
  vlibras: false,
}

const Contexto = createContext(null)

export function PreferenciasProvider({ children }) {
  const [prefs, setPrefs] = useState(() => ({ ...PADRAO, ...ler('prefs', {}) }))
  const [sistemaReduz, setSistemaReduz] = useState(prefereMenosMovimento)

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const atualizar = () => setSistemaReduz(mq.matches)
    mq.addEventListener('change', atualizar)
    return () => mq.removeEventListener('change', atualizar)
  }, [])

  const movimento = prefs.movimento ?? (sistemaReduz ? 'reduzido' : 'normal')

  useEffect(() => {
    const raiz = document.documentElement
    raiz.dataset.palette = prefs.paleta
    raiz.dataset.contrast = prefs.contraste
    raiz.dataset.motion = movimento
    raiz.style.setProperty('--font-scale', prefs.fonte)
    salvar('prefs', prefs)
    configurarAudio({ ativo: prefs.audio, volume: prefs.volume })
  }, [prefs, movimento])

  const atualizar = useCallback((parcial) => setPrefs((p) => ({ ...p, ...parcial })), [])
  const restaurar = useCallback(() => setPrefs(PADRAO), [])

  const valor = useMemo(
    () => ({ prefs, atualizar, restaurar, movimento, animar: movimento === 'normal' }),
    [prefs, atualizar, restaurar, movimento],
  )
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export const usePreferencias = () => useContext(Contexto)
