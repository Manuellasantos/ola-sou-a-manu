import { useEffect, useRef } from 'react'
import { useDados } from '../hooks/useDados'
import { useNaTela } from '../hooks/useNaTela'
import { usePreferencias } from '../hooks/usePreferencias'
import { useDispositivo } from '../hooks/useDispositivo'

const cor = (nome) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim()

function hexParaRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * Rosa de partículas. As coordenadas 3D vêm de scripts/gerar_rosa.py;
 * aqui só giramos, projetamos em perspectiva e deixamos o cursor "soprar" as pétalas.
 * Perto do cursor, partículas vizinhas se ligam como uma pequena rede de dados.
 */
export default function RosaGenerativa() {
  const canvasRef = useRef(null)
  const [areaRef, visivel] = useNaTela({ umaVez: false, limiar: 0 })
  const { dados } = useDados('rosa')
  const { animar, prefs } = usePreferencias()
  const { leve } = useDispositivo()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !dados) return
    const ctx = canvas.getContext('2d')
    const passo = leve ? 2 : 1
    const pontos = dados.pontos.filter((_, i) => i % passo === 0)
    const desvio = pontos.map(() => [0, 0])
    const cores = [hexParaRgb(cor('--accent-strong')), hexParaRgb(cor('--c-rosa')), hexParaRgb(cor('--c-pessego')), hexParaRgb(cor('--c-lavanda')), hexParaRgb(cor('--c-ceu'))]
    const mouse = { x: -9999, y: -9999 }
    let angulo = 0.6
    let quadro = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const redimensionar = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    redimensionar()
    const ro = new ResizeObserver(redimensionar)
    ro.observe(canvas)

    const mover = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const sair = () => {
      mouse.x = mouse.y = -9999
    }
    canvas.addEventListener('pointermove', mover)
    canvas.addEventListener('pointerleave', sair)

    const desenhar = () => {
      ctx.clearRect(0, 0, w, h)
      const escala = Math.min(w, h) * 0.42
      const cx = w / 2
      const cy = h * 0.42
      const cosA = Math.cos(angulo)
      const sinA = Math.sin(angulo)
      const inclinacao = 0.5 // vista um pouco de cima
      const cosT = Math.cos(inclinacao)
      const sinT = Math.sin(inclinacao)
      const projetados = []

      for (let i = 0; i < pontos.length; i++) {
        const [x, y, z, tom] = pontos[i]
        const xr = x * cosA - y * sinA
        const yr = x * sinA + y * cosA
        const alt = z * cosT - yr * sinT
        const prof = z * sinT + yr * cosT
        const persp = 2.6 / (2.6 + prof)
        let sx = cx + xr * escala * persp
        let sy = cy - alt * escala * persp

        // o cursor empurra as partículas; elas voltam devagar (mola)
        const d = desvio[i]
        const dx = sx + d[0] - mouse.x
        const dy = sy + d[1] - mouse.y
        const dist2 = dx * dx + dy * dy
        if (animar && dist2 < 6400) {
          const forca = (1 - dist2 / 6400) * 2.2
          const dist = Math.sqrt(dist2) || 1
          d[0] += (dx / dist) * forca
          d[1] += (dy / dist) * forca
        }
        d[0] *= 0.94
        d[1] *= 0.94
        sx += d[0]
        sy += d[1]
        projetados.push([sx, sy, prof, tom])
      }

      projetados.sort((a, b) => b[2] - a[2])
      for (const [sx, sy, prof, tom] of projetados) {
        // miolo rosa intenso, pétalas do meio rosa e pêssego, bordas lavanda e céu
        const c = tom > 0.7 ? cores[0] : tom > 0.5 ? cores[1] : tom > 0.35 ? cores[2] : tom > 0.18 ? cores[3] : cores[4]
        const alfa = 0.35 + (1 - (prof + 1) / 2) * 0.6
        const raio = (1 - prof) * 0.9 + 0.6
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alfa})`
        ctx.beginPath()
        ctx.arc(sx, sy, raio, 0, Math.PI * 2)
        ctx.fill()
      }

      // rede de conexões perto do cursor
      if (animar && mouse.x > 0) {
        const perto = projetados.filter(([sx, sy]) => (sx - mouse.x) ** 2 + (sy - mouse.y) ** 2 < 12000).slice(0, 60)
        ctx.strokeStyle = `rgba(${cores[4].join(',')},0.3)`
        ctx.lineWidth = 0.6
        for (let i = 0; i < perto.length; i++) {
          for (let j = i + 1; j < perto.length; j++) {
            const ddx = perto[i][0] - perto[j][0]
            const ddy = perto[i][1] - perto[j][1]
            if (ddx * ddx + ddy * ddy < 500) {
              ctx.beginPath()
              ctx.moveTo(perto[i][0], perto[i][1])
              ctx.lineTo(perto[j][0], perto[j][1])
              ctx.stroke()
            }
          }
        }
      }
    }

    const loop = () => {
      angulo += 0.0035
      desenhar()
      quadro = requestAnimationFrame(loop)
    }
    if (animar && visivel) loop()
    else desenhar()

    return () => {
      cancelAnimationFrame(quadro)
      ro.disconnect()
      canvas.removeEventListener('pointermove', mover)
      canvas.removeEventListener('pointerleave', sair)
    }
  }, [dados, animar, visivel, leve, prefs.paleta, prefs.contraste])

  return (
    <figure className="rosa" ref={areaRef}>
      <canvas
        ref={canvasRef}
        className="rosa__canvas"
        role="img"
        aria-label="Rosa tridimensional formada por 3.000 partículas rosa e lavanda, girando devagar"
      />
      <figcaption className="rosa__legenda mono">
        superfície paramétrica · NumPy → JSON → canvas
      </figcaption>
    </figure>
  )
}
