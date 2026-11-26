import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Gato from '../../animations/Gato'
import Moonwalk from '../../animations/Moonwalk'
import { useNaTela } from '../../hooks/useNaTela'
import { usePreferencias } from '../../hooks/usePreferencias'
import { projetosOrdenados } from '../../services/data'
import {
  FILTROS_VAZIOS,
  TIPOS,
  categoriasDisponiveis,
  filtrarProjetos,
  filtrosAtivos,
  statusDisponiveis,
  tecnologiasDisponiveis,
} from '../../services/filters'
import Capitulo from '../Capitulo'
import CardProjeto from '../CardProjeto'
import { Rasgo } from '../Colagem'
import Icone from '../Icone'

const CATEGORIAS = categoriasDisponiveis(projetosOrdenados)
const TECNOLOGIAS = tecnologiasDisponiveis(projetosOrdenados)
const STATUS = statusDisponiveis(projetosOrdenados)
const DESTAQUES = projetosOrdenados.filter((p) => p.destaque)

// embaralha a lista de projetos
function embaralhar(lista, semente) {
  const copia = [...lista]
  let s = semente
  for (let i = copia.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// anima os cards quando eles trocam de lugar
function useFlip(gradeRef, dependencia, animar) {
  const posicoes = useRef(new Map())
  useLayoutEffect(() => {
    const grade = gradeRef.current
    if (!grade) return
    const cards = [...grade.querySelectorAll('[data-slug]')]
    if (animar) {
      cards.forEach((card) => {
        const antes = posicoes.current.get(card.dataset.slug)
        const agora = card.getBoundingClientRect()
        if (antes && card.animate) {
          const dx = antes.left - agora.left
          const dy = antes.top - agora.top
          if (dx || dy) {
            card.animate([{ transform: `translate(${dx}px, ${dy}px) rotate(${dx > 0 ? -2 : 2}deg)` }, { transform: 'none' }], {
              duration: 700,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            })
          }
        }
      })
    }
    posicoes.current = new Map(cards.map((c) => [c.dataset.slug, c.getBoundingClientRect()]))
  }, [dependencia, gradeRef, animar])
}

export default function Projetos() {
  const { animar } = usePreferencias()
  const [ref, visivel] = useNaTela()
  const [palcoRef, palcoVisivel] = useNaTela({ limiar: 0.5 })
  const gradeRef = useRef(null)
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  const [passagem, setPassagem] = useState(0)
  const [aviso, setAviso] = useState('')

  const resultado = useMemo(() => {
    const filtrados = filtrarProjetos(projetosOrdenados, filtros)
    return passagem ? embaralhar(filtrados, passagem * 7919) : filtrados
  }, [filtros, passagem])

  useFlip(gradeRef, resultado.map((p) => p.slug).join(), animar)

  // troca a ordem dos projetos quando o brasão aparece
  useEffect(() => {
    const abrir = () => {
      setPassagem((n) => n + 1)
      setAviso('Os projetos trocaram de ordem.')
    }
    window.addEventListener('passagem-secreta', abrir)
    return () => window.removeEventListener('passagem-secreta', abrir)
  }, [])

  const mudar = (parcial) => setFiltros((f) => ({ ...f, ...parcial }))
  const alternarTipo = (tipo) =>
    mudar({ tipos: filtros.tipos.includes(tipo) ? filtros.tipos.filter((t) => t !== tipo) : [...filtros.tipos, tipo] })

  const temFiltroExtra = filtros.tecnologia || filtros.tipos.length || filtros.comDemo || filtros.status

  return (
    <section id="projetos" className="section projetos" aria-labelledby="proj-titulo">
      <div className={`wrap reveal ${visivel ? 'is-visible' : ''}`} ref={ref}>
        <Capitulo numero="05" id="proj-titulo">
          Meus <span className="destaque">projetos</span>
        </Capitulo>
        <p className="secao-intro">
          Alguns eu fiz sozinha, a maioria em equipe. Nos projetos em grupo, só conto qual foi a minha parte quando isso está no repositório.
        </p>

        <div ref={palcoRef}>
          <Moonwalk disparar={palcoVisivel}>
            <div className="cartaz folha">
              <p className="mao cartaz__titulo">em cartaz</p>
              <ol className="cartaz__lista">
                {DESTAQUES.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/projeto/${p.slug}`}>{p.nome.split(' — ')[0]}</Link>
                  </li>
                ))}
              </ol>
            </div>
          </Moonwalk>
        </div>

        <form className="filtros" role="search" aria-label="Filtrar projetos" onSubmit={(e) => e.preventDefault()}>
          <label className="filtros__busca">
            <Icone nome="busca" />
            <span className="sr-only">Buscar por nome, descrição, categoria ou tecnologia</span>
            <input type="search" placeholder="buscar: python, ETL, mapa…" value={filtros.busca} onChange={(e) => mudar({ busca: e.target.value })} />
          </label>

          <div className="filtros__chips" role="group" aria-label="Área">
            {['Todos', ...CATEGORIAS].map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={filtros.categoria === c} onClick={() => mudar({ categoria: c })}>
                {c}
              </button>
            ))}
          </div>

          <details className="filtros__mais" open={Boolean(temFiltroExtra)}>
            <summary>mais filtros</summary>
            <div className="filtros__linha">
              <label className="filtros__select">
                <span className="sr-only">Tecnologia</span>
                <select value={filtros.tecnologia} onChange={(e) => mudar({ tecnologia: e.target.value })}>
                  <option value="">qualquer tecnologia</option>
                  {TECNOLOGIAS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="filtros__select">
                <span className="sr-only">Status</span>
                <select value={filtros.status} onChange={(e) => mudar({ status: e.target.value })}>
                  <option value="">qualquer status</option>
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <div className="filtros__chips" role="group" aria-label="Tipo de projeto">
                {Object.entries(TIPOS).map(([valor, rotulo]) => (
                  <button key={valor} type="button" className="chip" aria-pressed={filtros.tipos.includes(valor)} onClick={() => alternarTipo(valor)}>
                    {rotulo}
                  </button>
                ))}
                <button type="button" className="chip" aria-pressed={filtros.comDemo} onClick={() => mudar({ comDemo: !filtros.comDemo })}>
                  com demo online
                </button>
              </div>
            </div>
          </details>

          <div className="filtros__rodape">
            <p className="filtros__contagem mono" aria-live="polite">
              {resultado.length} de {projetosOrdenados.length}
            </p>
            <button type="button" className="btn btn-sm" onClick={() => setFiltros(FILTROS_VAZIOS)} disabled={!filtrosAtivos(filtros)}>
              limpar filtros
            </button>
          </div>
        </form>

        <p className="sr-only" aria-live="polite">
          {aviso}
        </p>

        <div className="bento-area">
          <Gato alvoRef={gradeRef} />
          <ol className="bento" ref={gradeRef}>
            {resultado.map((p, i) => (
              <CardProjeto key={p.slug} projeto={p} numero={i + 1} />
            ))}
          </ol>
          {resultado.length === 0 && (
            <div className="vazio">
              <p className="mao">nenhum projeto com essa combinação.</p>
              <button type="button" className="btn btn-sm" onClick={() => setFiltros(FILTROS_VAZIOS)}>
                limpar filtros
              </button>
            </div>
          )}
        </div>
        <p className="mao projetos__dica">psiu: digita “corvinal” em qualquer lugar da página</p>
      </div>
      <Rasgo cor="var(--rosa-pastel)" semente={19} />
    </section>
  )
}
