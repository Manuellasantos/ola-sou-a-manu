import { useState } from 'react'
import { usePreferencias } from '../hooks/usePreferencias'

// etapas de um pipeline de dados
const PIPELINES = {
  medalhao: [
    { id: 'bronze', nome: 'Bronze', simbolo: '▤', resumo: 'Ingestão bruta', texto: 'O VRA e os cadastros da ANAC entram como vieram: nada é corrigido aqui, para sempre ser possível reprocessar.' },
    { id: 'silver', nome: 'Silver', simbolo: '▥', resumo: 'Espelho tipado e limpo', texto: "String 'null' vira NULL, horários viram timestamps, atrasos são calculados em minutos e atrasos implausíveis viram NULL sem apagar a linha. Linhas repetidas são deduplicadas." },
    { id: 'gold', nome: 'Gold', simbolo: '▦', resumo: 'Modelo de consumo', texto: 'Dimensão de aeroportos, fato de voos com as regras de negócio (pontual = até 15 min de atraso) e uma tabela desnormalizada que alimenta o dashboard AI/BI.' },
  ],
  etl: [
    { id: 'extracao', nome: 'Extração', simbolo: '⇣', resumo: 'Leitura do CSV', texto: 'O arquivo high_popularity_spotify_data.csv é lido com Pandas.' },
    { id: 'transformacao', nome: 'Transformação', simbolo: '⟲', resumo: 'Limpeza', texto: 'Colunas renomeadas, duplicatas removidas, um registro por faixa, ano extraído e duração convertida de ms para minutos.' },
    { id: 'carga', nome: 'Carregamento', simbolo: '⇡', resumo: 'Arquivo tratado', texto: 'O resultado é salvo em spotify_tratado.csv e alimenta o dashboard no Streamlit.' },
  ],
}

export default function Pipeline({ tipo = 'medalhao', titulo }) {
  const camadas = PIPELINES[tipo]
  const [ativa, setAtiva] = useState(camadas[0].id)
  const { animar } = usePreferencias()
  // volta para a primeira etapa se o projeto mudar
  const atual = camadas.find((c) => c.id === ativa) ?? camadas[0]

  return (
    <div className={`pipeline pipeline--${tipo}`}>
      {titulo && <h3>{titulo}</h3>}
      <div className={`pipeline__fluxo ${animar ? 'pipeline__fluxo--vivo' : ''}`} role="tablist" aria-label="Etapas do pipeline">
        {camadas.map((c, i) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            id={`tab-${c.id}`}
            aria-selected={atual.id === c.id}
            aria-controls={`painel-${tipo}`}
            className={`pipeline__camada pipeline__camada--${c.id}`}
            onClick={() => setAtiva(c.id)}
            style={{ '--i': i }}
          >
            <span className="pipeline__simbolo" aria-hidden="true">{c.simbolo}</span>
            <strong>{c.nome}</strong>
            <span className="mono">{c.resumo}</span>
            <span className="pipeline__particulas" aria-hidden="true">
              {Array.from({ length: 6 }, (_, k) => (
                <i key={k} style={{ '--k': k }} />
              ))}
            </span>
          </button>
        ))}
      </div>
      <div id={`painel-${tipo}`} role="tabpanel" aria-labelledby={`tab-${atual.id}`} className="pipeline__painel folha">
        <p>{atual.texto}</p>
      </div>
    </div>
  )
}
