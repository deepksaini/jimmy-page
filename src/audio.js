import { CHORDS, midiOf, SLOTS_PER_BAR } from './music.js'

const cache = new Map()

function midiToFreq(midi) {
  return 440 * 2 ** ((midi - 69) / 12)
}

function fadeEdges(data, sampleRate) {
  const fadeIn = Math.max(8, Math.floor(sampleRate * 0.003))
  const fadeOut = Math.max(16, Math.floor(sampleRate * 0.012))
  for (let i = 0; i < fadeIn; i += 1) data[i] *= i / fadeIn
  for (let i = 0; i < fadeOut; i += 1) {
    const idx = data.length - 1 - i
    if (idx >= 0) data[idx] *= i / fadeOut
  }
}

export function renderKarplus(ctx, freq, seconds) {
  const key = `${ctx.sampleRate}|${freq.toFixed(2)}|${seconds.toFixed(2)}`
  if (cache.has(key)) return cache.get(key)
  const n = Math.max(2, Math.round(ctx.sampleRate / freq))
  const length = Math.max(n + 8, Math.floor(ctx.sampleRate * seconds))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  const delay = new Float32Array(n)
  for (let i = 0; i < n; i += 1) delay[i] = Math.random() * 2 - 1
  let ptr = 0
  let prev = 0
  for (let i = 0; i < length; i += 1) {
    const averaged = 0.5 * (delay[ptr] + prev)
    prev = delay[ptr]
    delay[ptr] = averaged * 0.996
    data[i] = averaged
    ptr = (ptr + 1) % n
  }
  fadeEdges(data, ctx.sampleRate)
  cache.set(key, buffer)
  return buffer
}

function playBuffer(ctx, buffer, time, gainValue, dest, playing) {
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(gainValue, time)
  src.connect(gain)
  gain.connect(dest)
  src.start(time)
  playing.push(src)
  return src
}

function playTone(ctx, freq, time, seconds, gainValue, dest, playing) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  osc.type = 'sine'
  osc.frequency.value = freq
  filter.type = 'lowpass'
  filter.frequency.value = 900
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + seconds)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(dest)
  osc.start(time)
  osc.stop(time + seconds + 0.05)
  playing.push(osc)
}

function hatBuffer(ctx) {
  const length = Math.floor(ctx.sampleRate * 0.04)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length)
  }
  fadeEdges(data, ctx.sampleRate)
  return buffer
}

const ROOT_MIDI = { Am: 45, F: 41, G: 43 }
const PAD_MIDI = {
  Am: [57, 60, 64],
  F: [53, 57, 60],
  G: [55, 59, 62],
}

export function createEngine() {
  let ctx = null
  let master = null
  let playing = []
  let hat = null

  async function ensure() {
    if (!ctx) {
      ctx = new AudioContext()
      master = ctx.createGain()
      master.gain.value = 0.9
      master.connect(ctx.destination)
      hat = hatBuffer(ctx)
    }
    if (ctx.state === 'suspended') await ctx.resume()
    return ctx
  }

  function stop() {
    for (const node of playing) {
      try {
        node.stop()
      } catch {
        /* already stopped */
      }
    }
    playing.length = 0
  }

  function scheduleBacking(audio, start, bpm, swing, bars = 4, loops = 1) {
    const beat = 60 / bpm
    const eighth = beat / 2
    const dest = audio.createGain()
    dest.gain.value = 1
    dest.connect(master)
    for (let loop = 0; loop < loops; loop += 1) {
      for (let bar = 0; bar < bars; bar += 1) {
        const chord = CHORDS[bar]
        const barStart = start + (loop * bars + bar) * 8 * eighth
        playTone(audio, midiToFreq(ROOT_MIDI[chord]), barStart, beat * 1.5, 0.16, dest, playing)
        for (const midi of PAD_MIDI[chord]) {
          playTone(audio, midiToFreq(midi), barStart + 0.02, beat * 3.2, 0.035, dest, playing)
        }
        for (let slot = 0; slot < SLOTS_PER_BAR; slot += 1) {
          const swingAdd = slot % 2 === 1 ? eighth * swing * 0.35 : 0
          const t = barStart + slot * eighth + swingAdd
          playBuffer(audio, hat, t, slot % 2 === 0 ? 0.035 : 0.015, dest, playing)
        }
      }
    }
  }

  function schedulePhrase(audio, start, bpm, swing, bars, onSlot) {
    const beat = 60 / bpm
    const eighth = beat / 2
    bars.forEach((events, bar) => {
      events.forEach((event) => {
        const swingAdd = event.startSlot % 2 === 1 ? eighth * swing * 0.35 : 0
        const jitter = (Math.random() * 0.02 - 0.01)
        const t = start + (bar * SLOTS_PER_BAR + event.startSlot) * eighth + swingAdd + jitter
        const freq = midiToFreq(midiOf(event.string, event.fret))
        const seconds = Math.max(0.18, event.lengthSlots * eighth + 0.12)
        const buf = renderKarplus(audio, freq, seconds)
        const vel = 0.28 + Math.random() * 0.1
        playBuffer(audio, buf, Math.max(audio.currentTime, t), vel, master, playing)
        if (onSlot) {
          const wait = Math.max(0, t - audio.currentTime)
          window.setTimeout(() => onSlot(bar, event), wait * 1000)
        }
      })
    })
  }

  return {
    async preview(events, bpm, swing) {
      const audio = await ensure()
      stop()
      const start = audio.currentTime + 0.05
      schedulePhrase(audio, start, bpm, swing, [events], null)
    },
    async play(bars, bpm, swing, loop, onSlot, onDone) {
      const audio = await ensure()
      stop()
      const start = audio.currentTime + 0.06
      const loops = loop ? 8 : 1
      scheduleBacking(audio, start, bpm, swing, 4, loops)
      for (let i = 0; i < loops; i += 1) {
        const t = start + i * 4 * 8 * (60 / bpm / 2)
        schedulePhrase(audio, t, bpm, swing, bars, i === 0 ? onSlot : null)
      }
      const total = loops * 4 * 8 * (60 / bpm / 2)
      window.setTimeout(() => onDone?.(), total * 1000 + 80)
    },
    stop,
    async unlock() {
      await ensure()
    },
  }
}
