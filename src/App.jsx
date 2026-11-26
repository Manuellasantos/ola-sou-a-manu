import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Cabecalho from './components/Cabecalho'
import Rodape from './components/Rodape'
import Brasao from './animations/Brasao'
import Inicio from './pages/Inicio'

// A página de detalhes só é baixada quando alguém abre um projeto
const PaginaProjeto = lazy(() => import('./pages/PaginaProjeto'))
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada'))

function RolarAoTrocarDeRota() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/projeto/')) window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <RolarAoTrocarDeRota />
      <main id="conteudo" tabIndex={-1}>
        <Suspense fallback={<p className="wrap section">Carregando…</p>}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/projeto/:slug" element={<PaginaProjeto />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Routes>
        </Suspense>
      </main>
      <Rodape />
      <Brasao />
    </>
  )
}
