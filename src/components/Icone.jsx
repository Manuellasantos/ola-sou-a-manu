// Ícones em linha, desenhados à mão no estilo traço (sem dependência extra)
const CAMINHOS = {
  github: 'M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  email: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6',
  externo: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  figma: 'M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12zm0 10.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0zM5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0zm0-7A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z',
  seta: 'M5 12h14M12 5l7 7-7 7',
  voltar: 'M19 12H5M12 19l-7-7 7-7',
  somLigado: 'M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  somDesligado: 'M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6',
  acessibilidade: 'M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4 8l8 2 8-2M12 10v5l-3 7M12 15l3 7',
  fechar: 'M18 6 6 18M6 6l12 12',
  menu: 'M3 6h18M3 12h18M3 18h18',
  busca: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.3-4.3',
  copiar: 'M9 9h11v11H9zM5 15H4V4h11v1',
  documento: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
  replay: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  chapeu: 'M3 17h18M6 17c0-3 .5-8 2-10 1.5-1 3 .5 4 .5s2.5-1.5 4-.5c1.5 2 2 7 2 10M7 13h10',
  gato: 'M5 4l3 4h8l3-4v9a7 7 0 0 1-14 0zM9.5 13h.01M14.5 13h.01M11 16.5h2',
  livro: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5',
  pena: 'M20 4C12 4 6 10 5 19l-1 2M20 4c0 6-4 12-11 13M9 13h5',
  peca: 'M9 21h6M8 18h8M12 3a2.5 2.5 0 0 1 2.5 2.5c0 1-.5 1.7-1 2.2L15 15H9l1.5-7.3c-.5-.5-1-1.2-1-2.2A2.5 2.5 0 0 1 12 3z',
  pegada: 'M8 13c-2 0-3 2-3 4s1.5 3 3 3 3-1 3-3-1-4-3-4zM5 9h.01M8 7h.01M11 8h.01M16 9c-2 0-3 2-3 4s1.5 3 3 3 3-1 3-3-1-4-3-4zM14 5h.01M17 4h.01M20 6h.01',
  rosa: 'M12 3c3 0 5 2 5 5s-2 5-5 5-5-2-5-5M12 7c1.5 0 2.5 1 2.5 2.5S13.5 12 12 12M12 13v8M12 17c-2-1-4-1-5-3M12 16c2-.5 4-1.5 4.5-3.5',
  sorvete: 'M7 10a5 5 0 0 1 10 0zM7 10l5 12 5-12M9 14h6',
  onda: 'M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0M2 18c2-4 4-4 6 0s4 4 6 0 4-4 6 0',
  trofeu: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
}

export default function Icone({ nome, titulo, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={titulo ? undefined : true}
      role={titulo ? 'img' : undefined}
      {...props}
    >
      {titulo && <title>{titulo}</title>}
      <path d={CAMINHOS[nome]} />
    </svg>
  )
}
