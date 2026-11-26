import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SECOES, irParaSecao, linkSecao } from '../config/site'
import { usePreferencias } from '../hooks/usePreferencias'
import { tocar } from '../services/audio'
import Icone from './Icone'
import MenuAcessibilidade from './MenuAcessibilidade'

export default function Cabecalho() {
  const { prefs, atualizar } = usePreferencias()
  const [menuAberto, setMenuAberto] = useState(false)
  const [a11yAberto, setA11yAberto] = useState(false)
  const [rolou, setRolou] = useState(false)
  const { pathname } = useLocation()
  const naHome = pathname === '/'

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!menuAberto) return
    const aoTeclar = (e) => e.key === 'Escape' && setMenuAberto(false)
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [menuAberto])

  const alternarSom = () => {
    const ativo = !prefs.audio
    atualizar({ audio: ativo })
    if (ativo) setTimeout(() => tocar('chime'), 50)
  }


  return (
    <header className={`topo ${rolou ? 'topo--rolou' : ''}`}>
      <div className="topo__barra wrap">
        <Link to="/" className="topo__marca" aria-label="Manuella Santos Cruz, voltar ao início">
          <span className="topo__rosa" aria-hidden="true">✿</span> manu<span className="muted">.dados</span>
        </Link>

        <nav aria-label="Seções" className={`topo__nav ${menuAberto ? 'aberto' : ''}`} id="menu-principal">
          <ul>
            {SECOES.map((s) => (
              <li key={s.id}>
                <a
                  href={linkSecao(s.id)}
                  onClick={(e) => {
                    setMenuAberto(false)
                    if (naHome) irParaSecao(s.id, e)
                  }}
                >
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="topo__acoes">
          <button
            type="button"
            className="icone-btn"
            onClick={alternarSom}
            aria-pressed={prefs.audio}
            aria-label={prefs.audio ? 'Desligar efeitos sonoros' : 'Ligar efeitos sonoros (volume baixo)'}
            title={prefs.audio ? 'Som ligado' : 'Som desligado'}
          >
            <Icone nome={prefs.audio ? 'somLigado' : 'somDesligado'} />
          </button>
          <button
            type="button"
            className="icone-btn"
            onClick={() => setA11yAberto(true)}
            aria-haspopup="dialog"
            aria-label="Abrir menu de acessibilidade"
            title="Acessibilidade"
          >
            <Icone nome="acessibilidade" />
          </button>
          <button
            type="button"
            className="icone-btn topo__hamburguer"
            onClick={() => setMenuAberto((v) => !v)}
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            <Icone nome={menuAberto ? 'fechar' : 'menu'} />
          </button>
        </div>
      </div>
      <MenuAcessibilidade aberto={a11yAberto} aoFechar={() => setA11yAberto(false)} />
    </header>
  )
}
