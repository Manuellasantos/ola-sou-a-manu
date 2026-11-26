// Pequenos desenhos "à mão" usados como anotação nas margens do caderno.
export function Seta({ className = '', curva = 'baixo' }) {
  const d = curva === 'baixo' ? 'M4 6 C 30 4, 60 20, 70 52 M58 44 L70 54 L76 40' : 'M4 50 C 30 52, 60 36, 70 6 M58 12 L70 4 L76 18'
  return (
    <svg className={`rabisco ${className}`} viewBox="0 0 80 60" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Sublinhado({ className = '' }) {
  return (
    <svg className={`rabisco rabisco--sub ${className}`} viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 9 C 40 3, 80 12, 120 6 S 180 4, 198 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
