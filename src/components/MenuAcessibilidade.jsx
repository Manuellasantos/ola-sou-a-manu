import { useEffect, useRef } from 'react'
import { usePreferencias } from '../hooks/usePreferencias'
import { tocar } from '../services/audio'
import Icone from './Icone'

const PALETAS = [
  { valor: 'padrao', rotulo: 'Padrão (rosa e lavanda)' },
  { valor: 'protanopia', rotulo: 'Protanopia (azul e laranja)' },
  { valor: 'deuteranopia', rotulo: 'Deuteranopia (azul e laranja)' },
  { valor: 'tritanopia', rotulo: 'Tritanopia (vermelho e ciano)' },
]

const MOVIMENTOS = [
  { valor: 'normal', rotulo: 'Completo' },
  { valor: 'reduzido', rotulo: 'Reduzido' },
  { valor: 'desligado', rotulo: 'Sem animações' },
]

const VLIBRAS_SCRIPT = 'https://vlibras.gov.br/app/vlibras-plugin.js'

// carrega o VLibras
function ativarVLibras() {
  if (document.querySelector('[vw]')) {
    document.querySelector('[vw]').style.display = ''
    return
  }
  const raiz = document.createElement('div')
  raiz.setAttribute('vw', '')
  raiz.className = 'enabled'
  raiz.innerHTML =
    '<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>'
  document.body.appendChild(raiz)

  const script = document.createElement('script')
  script.src = VLIBRAS_SCRIPT
  script.async = true
  script.onload = () => {
    const anterior = window.onload
    new window.VLibras.Widget('https://vlibras.gov.br/app')
    // inicia o widget
    if (typeof window.onload === 'function' && window.onload !== anterior) window.onload()
  }
  document.body.appendChild(script)
}

function desativarVLibras() {
  const raiz = document.querySelector('[vw]')
  if (raiz) raiz.style.display = 'none'
}

export default function MenuAcessibilidade({ aberto, aoFechar }) {
  const { prefs, atualizar, restaurar, movimento } = usePreferencias()
  const dialogo = useRef(null)

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (aberto && !d.open) d.showModal()
    if (!aberto && d.open) d.close()
  }, [aberto])

  useEffect(() => {
    if (prefs.vlibras) ativarVLibras()
    else desativarVLibras()
  }, [prefs.vlibras])

  const fonteEmPassos = Math.round((prefs.fonte - 1) * 10)

  return (
    <dialog
      ref={dialogo}
      className="a11y glass"
      aria-labelledby="a11y-titulo"
      onClose={aoFechar}
      onClick={(e) => e.target === dialogo.current && aoFechar()}
    >
      <div className="a11y__topo">
        <h2 id="a11y-titulo">Acessibilidade</h2>
        <button type="button" className="icone-btn" onClick={aoFechar} aria-label="Fechar menu de acessibilidade">
          <Icone nome="fechar" />
        </button>
      </div>
      <p className="muted a11y__nota">As escolhas ficam salvas neste navegador.</p>

      <fieldset>
        <legend>Libras</legend>
        <label className="a11y__alternar">
          <input type="checkbox" checked={prefs.vlibras} onChange={(e) => atualizar({ vlibras: e.target.checked })} />
          <span>Ativar VLibras (tradução para Libras)</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Cores</legend>
        {PALETAS.map((p) => (
          <label key={p.valor} className="a11y__opcao">
            <input
              type="radio"
              name="paleta"
              value={p.valor}
              checked={prefs.paleta === p.valor}
              onChange={() => atualizar({ paleta: p.valor })}
            />
            <span>{p.rotulo}</span>
          </label>
        ))}
        <label className="a11y__alternar">
          <input
            type="checkbox"
            checked={prefs.contraste === 'alto'}
            onChange={(e) => atualizar({ contraste: e.target.checked ? 'alto' : 'normal' })}
          />
          <span>Alto contraste</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Tamanho do texto</legend>
        <div className="a11y__fonte">
          <button type="button" className="btn btn-sm" onClick={() => atualizar({ fonte: Math.max(0.9, +(prefs.fonte - 0.1).toFixed(1)) })} aria-label="Diminuir texto">
            A−
          </button>
          <output aria-live="polite">{fonteEmPassos === 0 ? 'Padrão' : `${fonteEmPassos > 0 ? '+' : ''}${fonteEmPassos * 10}%`}</output>
          <button type="button" className="btn btn-sm" onClick={() => atualizar({ fonte: Math.min(1.4, +(prefs.fonte + 0.1).toFixed(1)) })} aria-label="Aumentar texto">
            A+
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Animações</legend>
        {MOVIMENTOS.map((m) => (
          <label key={m.valor} className="a11y__opcao">
            <input type="radio" name="movimento" checked={movimento === m.valor} onChange={() => atualizar({ movimento: m.valor })} />
            <span>{m.rotulo}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Som</legend>
        <label className="a11y__alternar">
          <input
            type="checkbox"
            checked={prefs.audio}
            onChange={(e) => {
              atualizar({ audio: e.target.checked })
              if (e.target.checked) setTimeout(() => tocar('chime'), 50)
            }}
          />
          <span>Efeitos sonoros curtos</span>
        </label>
        <label className="a11y__volume">
          <span>Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={prefs.volume}
            disabled={!prefs.audio}
            onChange={(e) => atualizar({ volume: Number(e.target.value) })}
            onPointerUp={() => tocar('click')}
          />
        </label>
      </fieldset>

      <button type="button" className="btn" onClick={restaurar}>
        Restaurar padrão
      </button>
    </dialog>
  )
}
