import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { PreferenciasProvider } from './hooks/usePreferencias'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/secoes.css'
import './styles/animacoes.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PreferenciasProvider>
      {/* HashRouter: rotas como /#/projeto/voebem funcionam no GitHub Pages sem servidor */}
      <HashRouter>
        <App />
      </HashRouter>
    </PreferenciasProvider>
  </React.StrictMode>,
)
