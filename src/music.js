/** A minor pentatonic, first-position box (frets 5–8). All logic is deterministic. */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const PENTATONIC_PC = [9, 0, 2, 4, 7] // A C D E G
export const OPEN_MIDI = [0, 64, 59, 55, 50, 45, 40] // index = string 1 (high e) … 6 (low E)
export const STRING_LABELS = ['', 'e', 'B', 'G', 'D', 'A', 'E']
export const BOX_FRETS = {
  1: [5, 8],
  2: [5, 8],
  3: [5, 7],
  4: [5, 7],
  5: [5, 7],
  6: [5, 8],
}
export const BARS = 4
export const SLOTS_PER_BAR = 8
export const DEFAULT_BPM = 80
export const CHORDS = ['Am', 'F', 'G', 'Am']
export const LANDING_PC = {
  Am: [9, 0, 4],
  F: [9, 0],
  G: [7, 2],
}

export function midiOf(string, fret) {
  return OPEN_MIDI[string] + fret
}

export function noteName(midi) {
  return NOTE_NAMES[((midi % 12) + 12) % 12]
}

export function pcOf(midi) {
  return ((midi % 12) + 12) % 12
}

export function boxPositions() {
  const list = []
  for (let string = 1; string <= 6; string += 1) {
    for (const fret of BOX_FRETS[string]) {
      const midi = midiOf(string, fret)
      list.push({ string, fret, midi, name: noteName(midi) })
    }
  }
  return list
}

export const POSITIONS = boxPositions()

export function emptyBars() {
  return Array.from({ length: BARS }, () => [])
}

export function eventsInOrder(events) {
  return [...events].sort((a, b) => a.startSlot - b.startSlot || a.string - b.string)
}

export function occupiedSlots(events) {
  const used = new Set()
  for (const event of events) {
    for (let i = 0; i < event.lengthSlots; i += 1) used.add(event.startSlot + i)
  }
  return used
}

export function nextFreeSlot(events) {
  const used = occupiedSlots(events)
  for (let slot = 0; slot < SLOTS_PER_BAR; slot += 1) {
    if (!used.has(slot)) return slot
  }
  return -1
}

export function addNote(events, string, fret, slot = nextFreeSlot(events), lengthSlots = 1) {
  if (slot < 0 || slot >= SLOTS_PER_BAR) return events
  const without = events.filter(
    (event) => event.startSlot + event.lengthSlots <= slot || event.startSlot >= slot + lengthSlots,
  )
  return eventsInOrder([
    ...without,
    {
      string,
      fret,
      startSlot: slot,
      lengthSlots,
      articulation: 'pick',
    },
  ])
}

export function clearSlot(events, slot) {
  return events.filter((event) => event.startSlot !== slot)
}

export function isChordTone(midi, chord) {
  return LANDING_PC[chord].includes(pcOf(midi))
}

export function isRootA(midi) {
  return pcOf(midi) === 9
}

const BOX_BY_PITCH = [...POSITIONS].sort((a, b) => a.midi - b.midi)

export function scaleIndex(midi) {
  return BOX_BY_PITCH.findIndex((pos) => pos.midi === midi)
}

export function nearestChordTonePosition(midi, chord) {
  const allowed = new Set(LANDING_PC[chord])
  let best = BOX_BY_PITCH[0]
  let bestDist = 99
  for (const pos of BOX_BY_PITCH) {
    if (!allowed.has(pcOf(pos.midi))) continue
    const dist = Math.abs(pos.midi - midi)
    if (dist < bestDist) {
      best = pos
      bestDist = dist
    }
  }
  return best
}

export function nearestA(midi) {
  const aNotes = POSITIONS.filter((pos) => pcOf(pos.midi) === 9)
  let best = aNotes[0]
  let bestDist = 99
  for (const pos of aNotes) {
    const dist = Math.abs(pos.midi - midi)
    if (dist < bestDist) {
      best = pos
      bestDist = dist
    }
  }
  return best
}

export function noteTension(midi, chord) {
  if (isRootA(midi) && chord === 'Am') return 0.08
  if (isChordTone(midi, chord)) return 0.25
  if (PENTATONIC_PC.includes(pcOf(midi))) return 0.62
  return 0.9
}

export function barTension(events, chord) {
  if (!events.length) return 0.15
  const notes = eventsInOrder(events)
  const avg =
    notes.reduce((sum, event) => sum + noteTension(midiOf(event.string, event.fret), chord), 0) /
    notes.length
  const density = Math.min(1, notes.length / 6)
  return Math.min(1, avg + density * 0.18)
}

export function shapeTensions(bars) {
  return bars.map((events, index) => barTension(events, CHORDS[index]))
}

export const RHYTHM_PATTERNS = [
  {
    id: 'pause-skip',
    label: 'Note, pause, note, note',
    hint: 'Leave a little air, then continue.',
    onsets: [0, 2, 3, 5],
    lengths: [1, 1, 1, 1],
  },
  {
    id: 'long-short',
    label: 'Long, then two shorts',
    hint: 'Lean on the first note.',
    onsets: [0, 2, 3, 5, 6],
    lengths: [2, 1, 1, 1, 1],
  },
  {
    id: 'offbeat',
    label: 'Start off the beat',
    hint: 'Come in after the downbeat.',
    onsets: [1, 3, 5, 7],
    lengths: [1, 1, 1, 1],
  },
  {
    id: 'front',
    label: 'Crowd the front, then rest',
    hint: 'Say it quickly, then listen.',
    onsets: [0, 1, 2, 3],
    lengths: [1, 1, 1, 1],
  },
]

function mapNotesToRhythm(source, pattern) {
  const notes = eventsInOrder(source)
  if (!notes.length) return []
  const count = Math.min(notes.length, pattern.onsets.length)
  const next = []
  for (let i = 0; i < count; i += 1) {
    const onset = pattern.onsets[i]
    const length = Math.min(pattern.lengths[i] ?? 1, SLOTS_PER_BAR - onset)
    next.push({
      ...notes[i],
      startSlot: onset,
      lengthSlots: length,
      articulation: notes[i].articulation || 'pick',
    })
  }
  return eventsInOrder(next)
}

export function moveRepeat(source) {
  return eventsInOrder(source).map((event) => ({ ...event }))
}

export function moveChangeRhythm(source, patternId) {
  const pattern = RHYTHM_PATTERNS.find((item) => item.id === patternId) || RHYTHM_PATTERNS[0]
  return mapNotesToRhythm(source, pattern)
}

export function moveAnswer(source, chord) {
  const notes = eventsInOrder(source)
  if (!notes.length) return []
  const answered = [{ ...notes[0] }]
  for (let index = 1; index < notes.length; index += 1) {
    const srcIdx = scaleIndex(midiOf(notes[index].string, notes[index].fret))
    const prevSrc = scaleIndex(midiOf(notes[index - 1].string, notes[index - 1].fret))
    const step = srcIdx - prevSrc
    const prevAns = scaleIndex(midiOf(answered[index - 1].string, answered[index - 1].fret))
    const targetIdx = Math.max(0, Math.min(BOX_BY_PITCH.length - 1, prevAns - step))
    const pos = BOX_BY_PITCH[targetIdx]
    answered.push({ ...notes[index], string: pos.string, fret: pos.fret })
  }
  const last = answered[answered.length - 1]
  const nudged = nearestChordTonePosition(midiOf(last.string, last.fret), chord)
  answered[answered.length - 1] = { ...last, string: nudged.string, fret: nudged.fret }
  return answered
}

export function resolveLastToA(events) {
  const notes = eventsInOrder(events)
  if (!notes.length) {
    const a = POSITIONS.find((pos) => pos.string === 4 && pos.fret === 7) // A on D string
    return [{ string: a.string, fret: a.fret, startSlot: 6, lengthSlots: 2, articulation: 'pick' }]
  }
  const last = notes[notes.length - 1]
  const a = nearestA(midiOf(last.string, last.fret))
  notes[notes.length - 1] = { ...last, string: a.string, fret: a.fret }
  return notes
}

export function moveShift(source, steps) {
  const notes = eventsInOrder(source)
  return notes.map((event) => {
    const idx = scaleIndex(midiOf(event.string, event.fret))
    const next = BOX_BY_PITCH[Math.max(0, Math.min(BOX_BY_PITCH.length - 1, idx + steps))]
    return { ...event, string: next.string, fret: next.fret }
  })
}

export function withRestGap(source) {
  return eventsInOrder(source).map((event, index) => ({
    ...event,
    startSlot: Math.min(SLOTS_PER_BAR - 1, event.startSlot + (index > 0 ? 1 : 0)),
    lengthSlots: 1,
  }))
}

export function bendLast(source) {
  const notes = eventsInOrder(source)
  if (!notes.length) return []
  const last = notes[notes.length - 1]
  return [...notes.slice(0, -1), { ...last, articulation: last.articulation === 'slide' ? 'bend' : 'bend' }]
}

export const STARTERS = [
  [
    { string: 1, fret: 5, startSlot: 0, lengthSlots: 1, articulation: 'pick' },
    { string: 1, fret: 8, startSlot: 1, lengthSlots: 1, articulation: 'pick' },
    { string: 2, fret: 5, startSlot: 2, lengthSlots: 2, articulation: 'pick' },
  ],
  [
    { string: 4, fret: 7, startSlot: 0, lengthSlots: 2, articulation: 'pick' },
    { string: 3, fret: 5, startSlot: 2, lengthSlots: 1, articulation: 'pick' },
    { string: 3, fret: 7, startSlot: 4, lengthSlots: 1, articulation: 'pick' },
  ],
  [
    { string: 2, fret: 8, startSlot: 1, lengthSlots: 1, articulation: 'pick' },
    { string: 2, fret: 5, startSlot: 3, lengthSlots: 1, articulation: 'pick' },
    { string: 3, fret: 5, startSlot: 5, lengthSlots: 2, articulation: 'pick' },
  ],
]

export function eventsToTab(bars) {
  return bars.map((events) => {
    const notes = eventsInOrder(events)
    if (!notes.length) return 'rest'
    return notes
      .map((event) => {
        const art = event.articulation === 'bend' ? 'b' : event.articulation === 'slide' ? 's' : ''
        return `${STRING_LABELS[event.string]}${event.fret}${art}`
      })
      .join('  ')
  })
}
