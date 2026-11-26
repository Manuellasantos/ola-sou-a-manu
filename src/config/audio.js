/**
 * Trilhas musicais opcionais.
 *
 * Nenhuma música está incluída no repositório: trechos de músicas (como Billie Jean,
 * Smooth Criminal, Human Nature ou Thriller) só podem ser usados com autorização ou
 * licença. Enquanto `src` for null, o site toca efeitos sonoros ORIGINAIS sintetizados
 * no navegador (Web Audio API), definidos em src/services/audio.js.
 *
 * Para usar um arquivo licenciado: coloque-o em public/audio/ e preencha `src` e `credito`.
 */
export const TRILHAS = {
  moonwalk: { src: null, credito: null, inicio: 0, duracao: 6, efeitoPadrao: 'groove' },
  transicao: { src: null, credito: null, inicio: 0, duracao: 2, efeitoPadrao: 'whoosh' },
  natureza: { src: null, credito: null, inicio: 0, duracao: 3, efeitoPadrao: 'chime' },
  misterio: { src: null, credito: null, inicio: 0, duracao: 3, efeitoPadrao: 'creak' },
}
