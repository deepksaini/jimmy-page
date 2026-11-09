import * as Tone from 'tone'

export function expectedOffsets(task) {
  const beat = 60000 / (task.bpm || 80)
  const count = task.taps || task.beats || 4
  if (task.pattern === 'half') {
    return Array.from({ length: count }, (_, i) => i * 2 * beat)
  }
  if (task.pattern === 'offbeat') {
    return Array.from({ length: count }, (_, i) => beat * (i + 0.5))
  }
  return Array.from({ length: count }, (_, i) => i * beat)
}

export function judgeRhythm(task, tapTimes, startAt) {
  const expected = expectedOffsets(task)
  const offsets = tapTimes.slice(0, expected.length).map((time, index) => time - startAt - expected[index])
  const tolerance = task.toleranceMs || 150
  const ok = offsets.length === expected.length && offsets.every((ms) => Math.abs(ms) <= tolerance)
  return { ok, offsetsMs: offsets.map((n) => Math.round(n)) }
}

export function runClicks(task, startAt) {
  const expected = expectedOffsets(task)
  const synth = new Tone.MembraneSynth({ octaves: 2, pitchDecay: 0.008 }).toDestination()
  synth.volume.value = -8
  const now = Tone.now() + Math.max(0, (startAt - performance.now()) / 1000)
  expected.forEach((offset, index) => {
    const accent = task.pattern !== 'offbeat' && index % 4 === 0
    synth.triggerAttackRelease(accent ? 'C2' : 'C3', 0.08, now + offset / 1000, accent ? 0.9 : 0.45)
  })
  return () => synth.dispose()
}
