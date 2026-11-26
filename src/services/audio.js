/**
 * Motor de áudio do portfólio.
 *
 * Regras: desligado por padrão, só liga depois de um clique da pessoa (respeita o
 * bloqueio de autoplay), volume baixo, trechos curtos com fade-in/fade-out e nada
 * tocando em loop. Os efeitos são sintetizados aqui mesmo com a Web Audio API,
 * então não dependem de nenhum arquivo com direitos autorais.
 */
import { TRILHAS } from '../config/audio'
import { asset } from '../config/site'

let contexto = null
let mestre = null
let ligado = false
let volume = 0.35
const buffers = new Map()

function garantirContexto() {
  if (!contexto) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    contexto = new Ctx()
    mestre = contexto.createGain()
    mestre.gain.value = volume
    mestre.connect(contexto.destination)
  }
  if (contexto.state === 'suspended') contexto.resume()
  return contexto
}

export function configurarAudio({ ativo, volume: novoVolume }) {
  ligado = ativo
  volume = novoVolume
  if (ativo) garantirContexto()
  if (mestre) mestre.gain.setTargetAtTime(ativo ? volume : 0, contexto.currentTime, 0.05)
}

/** Envelope com fade-in e fade-out para nada começar ou terminar seco. */
function envelope(ctx, inicio, duracao, pico = 1, ataque = 0.02) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, inicio)
  g.gain.linearRampToValueAtTime(pico, inicio + ataque)
  g.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao)
  g.connect(mestre)
  return g
}

function tom(ctx, freq, inicio, duracao, tipo = 'sine', pico = 0.4) {
  const osc = ctx.createOscillator()
  osc.type = tipo
  osc.frequency.setValueAtTime(freq, inicio)
  osc.connect(envelope(ctx, inicio, duracao, pico))
  osc.start(inicio)
  osc.stop(inicio + duracao + 0.05)
  return osc
}

function ruido(ctx, inicio, duracao, filtro = 4000, pico = 0.3) {
  const tamanho = Math.floor(ctx.sampleRate * duracao)
  const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate)
  const canal = buffer.getChannelData(0)
  for (let i = 0; i < tamanho; i++) canal[i] = Math.random() * 2 - 1
  const fonte = ctx.createBufferSource()
  fonte.buffer = buffer
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = filtro
  fonte.connect(bp)
  bp.connect(envelope(ctx, inicio, duracao, pico, 0.005))
  fonte.start(inicio)
}

// Efeitos originais. Nenhum deles reproduz melodia de música existente.
const EFEITOS = {
  // batida curta e genérica (bumbo + estalo), sem melodia, para o moonwalk
  groove(ctx, t) {
    for (let i = 0; i < 8; i++) {
      const b = t + i * 0.25
      if (i % 2 === 0) {
        const osc = ctx.createOscillator()
        osc.frequency.setValueAtTime(120, b)
        osc.frequency.exponentialRampToValueAtTime(45, b + 0.12)
        osc.connect(envelope(ctx, b, 0.18, 0.7, 0.003))
        osc.start(b)
        osc.stop(b + 0.2)
      } else {
        ruido(ctx, b, 0.08, 2500, 0.25)
      }
    }
  },
  whoosh(ctx, t) {
    ruido(ctx, t, 0.5, 900, 0.18)
  },
  chime(ctx, t) {
    ;[880, 1174.66, 1318.51].forEach((f, i) => tom(ctx, f, t + i * 0.09, 1.2, 'sine', 0.15))
  },
  pop(ctx, t) {
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(600, t)
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.15)
    osc.connect(envelope(ctx, t, 0.2, 0.5, 0.002))
    osc.start(t)
    osc.stop(t + 0.25)
    ruido(ctx, t, 0.12, 3000, 0.2)
  },
  creak(ctx, t) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(70, t)
    osc.frequency.linearRampToValueAtTime(110, t + 1.2)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 600
    osc.connect(lp)
    lp.connect(envelope(ctx, t, 1.6, 0.12, 0.3))
    osc.start(t)
    osc.stop(t + 1.7)
  },
  click(ctx, t) {
    tom(ctx, 1400, t, 0.05, 'triangle', 0.12)
  },
}

async function tocarArquivo(ctx, trilha) {
  if (!buffers.has(trilha.src)) {
    const resp = await fetch(asset(trilha.src))
    buffers.set(trilha.src, await ctx.decodeAudioData(await resp.arrayBuffer()))
  }
  const fonte = ctx.createBufferSource()
  fonte.buffer = buffers.get(trilha.src)
  const t = ctx.currentTime
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(1, t + 0.6)
  g.gain.setValueAtTime(1, t + trilha.duracao - 0.8)
  g.gain.linearRampToValueAtTime(0, t + trilha.duracao)
  fonte.connect(g)
  g.connect(mestre)
  fonte.start(t, trilha.inicio, trilha.duracao)
}

/**
 * Toca um efeito ("pop") ou uma trilha ("moonwalk"). Se a trilha não tiver arquivo
 * licenciado configurado, toca o efeito original equivalente.
 */
export function tocar(nome) {
  if (!ligado) return
  const ctx = garantirContexto()
  if (!ctx) return
  const trilha = TRILHAS[nome]
  if (trilha?.src) {
    tocarArquivo(ctx, trilha).catch(() => EFEITOS[trilha.efeitoPadrao]?.(ctx, ctx.currentTime))
    return
  }
  const efeito = EFEITOS[trilha?.efeitoPadrao ?? nome]
  efeito?.(ctx, ctx.currentTime + 0.01)
}
