import * as Tone from 'tone'
import { acousticUrls, midiOf, noteWithOctave, STRUM_GAP } from './notes.js'
import { CHORDS, eventsInOrder, SLOTS_PER_BAR } from './music.js'
import { chordNotes } from './voicings.js'

function resolvePositions(step) {
  if (step.chord) return chordNotes(step.chord)
  return step.positions || []
}

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
  let sampler = null
  let timers = []

  function clearTimers() {
    for (const id of timers) window.clearTimeout(id)
    timers = []
  }

  function later(fn, ms) {
    const id = window.setTimeout(fn, Math.max(0, ms))
    timers.push(id)
    return id
  }

  async function ensure() {
    await Tone.start()
    if (!ctx) {
      ctx = new AudioContext()
      master = ctx.createGain()
      master.gain.value = 0.9
      master.connect(ctx.destination)
      hat = hatBuffer(ctx)
    }
    if (ctx.state === 'suspended') await ctx.resume()
    if (!sampler) {
      sampler = new Tone.Sampler({
        urls: acousticUrls(),
        baseUrl: '/samples/guitar-samples/acoustic/',
        attack: 0.004,
        release: 0.7,
      }).toDestination()
      sampler.volume.value = -8
      await Tone.loaded()
    }
    return ctx
  }

  function stop() {
    clearTimers()
    if (sampler) sampler.releaseAll()
    for (const node of playing) {
      try {
        node.stop()
      } catch {
        /* already stopped */
      }
    }
    playing.length = 0
  }

  function triggerNote(string, fret, duration = 0.85, when = undefined, velocity = 0.78) {
    if (!sampler) return
    const note = noteWithOctave(midiOf(string, fret))
    sampler.triggerAttackRelease(note, duration, when ?? Tone.now(), velocity)
  }

  function scheduleBacking(audio, start, bpm, swing, barCount = 4, loops = 1, startBar = 0) {
    const beat = 60 / bpm
    const eighth = beat / 2
    const dest = audio.createGain()
    dest.gain.value = 1
    dest.connect(master)
    for (let loop = 0; loop < loops; loop += 1) {
      for (let bar = 0; bar < barCount; bar += 1) {
        const chord = CHORDS[(startBar + bar) % CHORDS.length]
        const barStart = start + (loop * barCount + bar) * 8 * eighth
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

  function schedulePhrase(bpm, swing, bars, onSlot, startAt) {
    const eighth = 60 / bpm / 2
    const t0 = startAt ?? Tone.now() + 0.05
    bars.forEach((events, bar) => {
      const ordered = eventsInOrder(events)
      ordered.forEach((event, index) => {
        const swingAdd = event.startSlot % 2 === 1 ? eighth * swing * 0.35 : 0
        const t = t0 + (bar * SLOTS_PER_BAR + event.startSlot) * eighth + swingAdd
        const next = ordered[index + 1]
        const endSlot = event.startSlot + event.lengthSlots
        const followedByRest = !next || next.startSlot > endSlot
        const lastOfPiece = bar === bars.length - 1 && index === ordered.length - 1
        const ring = event.lengthSlots * eighth + (lastOfPiece ? 0.14 : 0)
        const tail = lastOfPiece ? 0.2 : followedByRest ? 0.038 : 0.02
        const seconds = Math.max(0.12, ring + tail)
        const vel = (index === 0 ? 0.92 : 0.76)
        triggerNote(event.string, event.fret, seconds, t, vel)
        if (onSlot) {
          later(() => onSlot(bar, event), (t - Tone.now()) * 1000)
        }
      })
    })
  }

  return {
    async preview(events, bpm, swing, onSlot, onDone, barIndex = 0) {
      const audio = await ensure()
      stop()
      const start = audio.currentTime + 0.05
      scheduleBacking(audio, start, bpm, swing, 1, 1, barIndex)
      schedulePhrase(bpm, swing, [events], (_bar, event) => onSlot?.(barIndex, event))
      const total = SLOTS_PER_BAR * (60 / bpm / 2)
      later(() => onDone?.(), total * 1000 + 80)
    },
    async playSequence(parts, bpm, swing, onSlot, onDone) {
      const audio = await ensure()
      stop()
      const start = audio.currentTime + 0.05
      const eighth = 60 / bpm / 2
      const t0 = Tone.now() + 0.05
      parts.forEach((part, index) => {
        const t = start + index * SLOTS_PER_BAR * eighth
        scheduleBacking(audio, t, bpm, swing, 1, 1, part.barIndex)
        schedulePhrase(bpm, swing, [part.events], (_bar, event) => onSlot?.(part.barIndex, event), t0 + index * SLOTS_PER_BAR * eighth)
      })
      later(() => onDone?.(), parts.length * SLOTS_PER_BAR * eighth * 1000 + 80)
    },
    async playBacking(bpm, swing, { bars = 4, startBar = 0, loops = 1, onBar, onDone } = {}) {
      const audio = await ensure()
      stop()
      const start = audio.currentTime + 0.05
      scheduleBacking(audio, start, bpm, swing, bars, loops, startBar)
      const eighth = 60 / bpm / 2
      const barDur = SLOTS_PER_BAR * eighth
      for (let i = 0; i < loops * bars; i += 1) {
        const bar = (startBar + i) % CHORDS.length
        later(() => onBar?.(bar, i), i * barDur * 1000)
      }
      later(() => onDone?.(), loops * bars * barDur * 1000 + 80)
    },
    async play(bars, bpm, swing, loop, onSlot, onDone, onBar) {
      const audio = await ensure()
      stop()
      const start = audio.currentTime + 0.06
      const loops = loop ? 8 : 1
      const eighth = 60 / bpm / 2
      const barDur = 8 * eighth
      const t0 = Tone.now() + 0.06
      scheduleBacking(audio, start, bpm, swing, 4, loops)
      for (let i = 0; i < loops; i += 1) {
        schedulePhrase(bpm, swing, bars, i === 0 ? onSlot : null, t0 + i * 4 * barDur)
      }
      for (let i = 0; i < loops * 4; i += 1) {
        later(() => onBar?.(i % 4, i), i * barDur * 1000)
      }
      later(() => onDone?.(), loops * 4 * barDur * 1000 + 80)
    },
    async playSlotStrums(bars, { bpm = 80, onNote, onDone } = {}) {
      await ensure()
      stop()
      const eighth = 60 / bpm / 2
      const t0 = Tone.now() + 0.05
      let last = t0
      bars.forEach((bar, barIndex) => {
        const list = [...resolvePositions(bar)]
        list.sort((a, b) => b.string - a.string)
        ;(bar.slots || []).forEach((slot) => {
          const t = t0 + (barIndex * 8 + slot) * eighth
          list.forEach((pos, index) => {
            const when = t + index * STRUM_GAP
            triggerNote(pos.string, pos.fret, 0.55, when)
            later(() => onNote?.(pos, index), (when - Tone.now()) * 1000)
            last = Math.max(last, when + 0.55)
          })
        })
      })
      later(() => onDone?.(), (last - Tone.now()) * 1000 + 80)
    },
    async playClicksThenStrums({ bpm = 80, clickBars = 2, strumBars = 2, chord = 'Am', onNote, onDone } = {}) {
      const audio = await ensure()
      stop()
      const beat = 60 / bpm
      const start = audio.currentTime + 0.05
      for (let i = 0; i < clickBars * 4; i += 1) {
        const t = start + i * beat
        playBuffer(audio, hat, t, i % 4 === 0 ? 0.14 : 0.045, master, playing)
      }
      const strumAt = Tone.now() + clickBars * 4 * beat + 0.08
      const list = [...resolvePositions({ chord })]
      list.sort((a, b) => b.string - a.string)
      for (let i = 0; i < strumBars * 4; i += 1) {
        const t = strumAt + i * beat
        list.forEach((pos, index) => {
          const when = t + index * STRUM_GAP
          triggerNote(pos.string, pos.fret, 0.55, when)
          later(() => onNote?.(pos, index), (when - Tone.now()) * 1000)
        })
      }
      later(() => onDone?.(), (clickBars + strumBars) * 4 * beat * 1000 + 120)
    },
    async playScript(steps, { onNote, onDone } = {}) {
      await ensure()
      stop()
      let t = Tone.now() + 0.04
      let last = t
      steps.forEach((step) => {
        const list = [...resolvePositions(step)]
        if (step.mode === 'strum') list.sort((a, b) => b.string - a.string)
        const gap = step.gap ?? 0.22
        const hold = step.hold ?? 0.7
        list.forEach((pos, index) => {
          const when =
            step.mode === 'together'
              ? t
              : step.mode === 'strum'
                ? t + index * STRUM_GAP
                : t + index * gap
          triggerNote(pos.string, pos.fret, hold, when)
          later(() => onNote?.(pos, index), (when - Tone.now()) * 1000)
          last = Math.max(last, when + hold)
        })
        t = last + (step.pause ?? 0.22)
      })
      later(() => onDone?.(), (t - Tone.now()) * 1000 + 40)
    },
    async playPositions(positions, { mode = 'seq', gap = 0.22, hold = 0.7, onNote, onDone } = {}) {
      await ensure()
      stop()
      const now = Tone.now() + 0.04
      const list = [...positions]
      if (mode === 'strum') {
        list.sort((a, b) => b.string - a.string)
      }
      list.forEach((pos, index) => {
        const t =
          mode === 'together'
            ? now
            : mode === 'strum'
              ? now + index * STRUM_GAP
              : now + index * gap
        triggerNote(pos.string, pos.fret, hold, t)
        later(() => onNote?.(pos, index), (t - Tone.now()) * 1000)
      })
      const last =
        mode === 'together'
          ? hold
          : mode === 'strum'
            ? list.length * STRUM_GAP + hold
            : list.length * gap + 0.1
      later(() => onDone?.(), last * 1000 + 60)
    },
    async playClicks({ bpm = 80, bars = 2, onBeat, onDone } = {}) {
      const audio = await ensure()
      stop()
      const beat = 60 / bpm
      const start = audio.currentTime + 0.05
      const total = bars * 4
      for (let i = 0; i < total; i += 1) {
        const t = start + i * beat
        playBuffer(audio, hat, t, i % 4 === 0 ? 0.16 : 0.05, master, playing)
        later(() => onBeat?.(i), i * beat * 1000)
      }
      later(() => onDone?.(), total * beat * 1000 + 80)
    },
    stop,
    async unlock() {
      await ensure()
    },
    async pluck(string, fret, options = {}) {
      if (options.silent) return
      await ensure()
      triggerNote(string, fret, 0.9, Tone.now(), 0.82)
    },
    loaded() {
      return !!sampler
    },
  }
}
