import { asset } from '../config/site'

function hash(texto) {
  let h = 0
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

/**
 * Capa do card. Usa a primeira captura real do projeto; se não houver nenhuma,
 * desenha uma capa conceitual (rosácea matemática r = cos(kθ)) com aviso visível,
 * para nunca parecer uma tela de dashboard que não existe.
 */
export default function CapaProjeto({ projeto, grande = false }) {
  const imagem = projeto.imagens[0]
  if (imagem) {
    return (
      <div className={`capa ${imagem.mobile ? 'capa--mobile' : ''}`}>
        <img src={asset(imagem.src)} alt={imagem.alt} loading="lazy" decoding="async" width="1400" height="700" />
      </div>
    )
  }

  const h = hash(projeto.slug)
  const k = [3, 5, 7, 4, 6][h % 5] / ([1, 2, 3][h % 3] || 1)
  const pontos = []
  for (let i = 0; i <= 720; i++) {
    const t = (i / 720) * Math.PI * 12
    const r = Math.cos(k * t) * 80
    pontos.push(`${(150 + r * Math.cos(t)).toFixed(1)},${(90 + r * Math.sin(t)).toFixed(1)}`)
  }
  return (
    <div className="capa capa--conceitual">
      <svg viewBox="0 0 300 180" role="img" aria-label={`Capa conceitual de ${projeto.nome}: curva rosácea com k = ${k.toFixed(2)}`}>
        <polyline points={pontos.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.85" />
        <circle cx="150" cy="90" r="3" fill="var(--accent-strong)" />
      </svg>
      <span className="capa__aviso mono">{grande ? 'capa conceitual · sem captura real disponível' : 'capa conceitual'}</span>
    </div>
  )
}
