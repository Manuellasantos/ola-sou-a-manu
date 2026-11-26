// salva e lê as preferências no navegador
const PREFIXO = 'manu-portfolio:'

export function ler(chave, padrao) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave)
    return bruto === null ? padrao : JSON.parse(bruto)
  } catch {
    return padrao
  }
}

export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
  } catch {
    /* sem armazenamento disponível */
  }
}
