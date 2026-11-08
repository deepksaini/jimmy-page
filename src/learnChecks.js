import { countScaleRuns } from './lessons.js'
import {
  CHORD_SAY,
  CHORDS,
  eventsInOrder,
  hasInteriorRest,
  HOME_NAMES,
  isHomeName,
  midiOf,
  noteName,
  scaleIndex,
} from './music.js'

export function lastName(events) {
  const notes = eventsInOrder(events)
  if (!notes.length) return null
  const last = notes[notes.length - 1]
  return noteName(midiOf(last.string, last.fret))
}

export function endsOnChordNote(events, chord) {
  const name = lastName(events)
  return !!(name && isHomeName(name, chord))
}

export function chordPickResult(picked, names) {
  const have = new Set(picked.map((pos) => noteName(midiOf(pos.string, pos.fret))))
  const need = new Set(names)
  const missed = names.filter((name) => !have.has(name))
  const extra = [...have].filter((name) => !need.has(name))
  return {
    ok: missed.length === 0 && extra.length === 0,
    missed,
    extra,
  }
}

export function chordEndReport(bars) {
  const misses = []
  CHORDS.forEach((chord, index) => {
    if (!endsOnChordNote(bars[index] || [], chord)) {
      misses.push({
        bar: index + 1,
        chord: CHORD_SAY[chord],
        last: lastName(bars[index] || []) || 'no notes',
        want: HOME_NAMES[chord].join(', '),
      })
    }
  })
  return {
    ok: misses.length === 0 && bars.every((bar) => eventsInOrder(bar).length > 0),
    misses,
  }
}

export function hasPassingLand(bars) {
  const notes = bars.flatMap((events, bar) =>
    eventsInOrder(events).map((event) => ({ ...event, bar })),
  )
  for (let i = 0; i < notes.length - 1; i += 1) {
    const a = notes[i]
    const b = notes[i + 1]
    const nameA = noteName(midiOf(a.string, a.fret))
    const nameB = noteName(midiOf(b.string, b.fret))
    const step = Math.abs(scaleIndex(midiOf(a.string, a.fret)) - scaleIndex(midiOf(b.string, b.fret)))
    if (step === 1 && !isHomeName(nameA, CHORDS[a.bar]) && isHomeName(nameB, CHORDS[b.bar])) {
      return true
    }
  }
  return false
}

export function bar4EndsOnA(bars) {
  return lastName(bars[3] || []) === 'A'
}

export function withLastPitch(events, string, fret) {
  const notes = eventsInOrder(events).map((event) => ({ ...event }))
  if (!notes.length) return notes
  const last = notes[notes.length - 1]
  notes[notes.length - 1] = { ...last, string, fret }
  return notes
}

function stepPattern(events) {
  const idx = eventsInOrder(events).map((event) => scaleIndex(midiOf(event.string, event.fret)))
  if (idx.length < 2) return null
  return idx
    .slice(1)
    .map((value, index) => value - idx[index])
    .join(',')
}

function pitchSeq(events) {
  return eventsInOrder(events)
    .map((event) => scaleIndex(midiOf(event.string, event.fret)))
    .join(',')
}

export function twoBarsShareIdea(bars) {
  const ready = bars
    .map((events, index) => ({ index, pattern: stepPattern(events) }))
    .filter((item) => item.pattern)
  for (let i = 0; i < ready.length; i += 1) {
    for (let j = i + 1; j < ready.length; j += 1) {
      if (ready[i].pattern === ready[j].pattern) return true
    }
  }
  return false
}

export function changedRhythmOrAnswer(bars) {
  const ready = bars.map((events, index) => ({
    index,
    events,
    pitch: pitchSeq(events),
    rhythm: eventsInOrder(events)
      .map((event) => `${event.startSlot}:${event.lengthSlots}`)
      .join(','),
    pattern: stepPattern(events),
    count: eventsInOrder(events).length,
  }))
  const usable = ready.filter((item) => item.count >= 2)
  for (let i = 0; i < usable.length; i += 1) {
    for (let j = i + 1; j < usable.length; j += 1) {
      const a = usable[i]
      const b = usable[j]
      if (a.pitch === b.pitch && a.rhythm !== b.rhythm) return true
      if (a.pattern && b.pattern) {
        const reversed = a.pattern
          .split(',')
          .map(Number)
          .reverse()
          .map((n) => -n)
          .join(',')
        if (reversed === b.pattern) return true
      }
    }
  }
  return false
}

export function hasOffBeat(bars) {
  return bars.some((events) => eventsInOrder(events).some((event) => event.startSlot % 2 === 1))
}

export function ideaFourCheck(bars) {
  const share = twoBarsShareIdea(bars)
  const change = changedRhythmOrAnswer(bars)
  const runs = countScaleRuns(bars)
  return {
    ok: share && change && runs <= 1,
    share,
    change,
    runs,
  }
}

export function rhythmSpaceCheck(bars) {
  const rest = bars.some((events) => hasInteriorRest(events))
  const off = hasOffBeat(bars)
  return { ok: rest && off, rest, off }
}

function isBlue(event) {
  return event.string === 3 && event.fret === 8
}

export function blueNoteCheck(bars) {
  const notes = bars.flatMap((events, bar) => eventsInOrder(events).map((event) => ({ ...event, bar })))
  const used = notes.filter(isBlue)
  if (!used.length) return { ok: false, message: 'Not yet. E♭ is used at least once.' }
  for (const event of used) {
    const line = eventsInOrder(bars[event.bar])
    if (line[line.length - 1].string === event.string && line[line.length - 1].fret === event.fret && line[line.length - 1].startSlot === event.startSlot) {
      return { ok: false, message: 'Not yet. E♭ is never the last note of a bar.' }
    }
  }
  for (let i = 0; i < notes.length; i += 1) {
    if (!isBlue(notes[i])) continue
    const next = notes[i + 1]
    const name = next ? noteName(midiOf(next.string, next.fret)) : ''
    if (name !== 'E' && name !== 'D') {
      return { ok: false, message: 'Not yet. Every E♭ is followed straight away by E or D.' }
    }
  }
  return { ok: true, message: 'Pass. E♭ is used as a stepping stone.' }
}

export function challengeGoals(bars) {
  const items = [
    { ok: chordEndReport(bars).ok, label: "Every bar ends on a chord note for that bar's chord." },
    { ok: bar4EndsOnA(bars), label: 'Bar 4 ends on A.' },
    { ok: twoBarsShareIdea(bars), label: 'At least two bars share the same idea.' },
    { ok: bars.some((events) => hasInteriorRest(events)), label: 'At least one rest inside a bar.' },
    { ok: countScaleRuns(bars) <= 1 && bars.some((events) => eventsInOrder(events).length), label: 'At most one scale run.' },
  ]
  const met = items.filter((item) => item.ok).length
  return { items, met, total: items.length }
}
