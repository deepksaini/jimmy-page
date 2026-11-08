/** A minor pentatonic, first-position box (frets 5–8). All logic is deterministic. */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const PENTATONIC_PC = [9, 0, 2, 4, 7] // A C D E G
export const OPEN_MIDI = [0, 64, 59, 55, 50, 45, 40] // index = string 1 (high e) … 6 (low E)
export const STRING_LABELS = ['', 'e', 'B', 'G', 'D', 'A', 'E']
export const NECK_STRINGS = [1, 2, 3] // high e, B, G
export const BOX_FRETS = {
  1: [5, 8],
  2: [5, 8],
  3: [5, 7],
}
export const A4_POS = { string: 1, fret: 5 }
export const BARS = 4
export const SLOTS_PER_BAR = 8
export const IDEA_MAX_NOTES = 4
export const DEFAULT_BPM = 80
export const CHORDS = ['Am', 'F', 'G', 'Am']
export const LANDING_PC = {
  Am: [0, 4, 9], // C, E, A (and high C)
  F: [9, 0], // A, C
  G: [7, 2], // G, D
}
export const HOME_NAMES = {
  Am: ['A', 'C', 'E'],
  F: ['A', 'C'],
  G: ['G', 'D'],
}
export const CHORD_SAY = { Am: 'A minor', F: 'F', G: 'G' }
export const STRONG_SLOTS = [0, 4] // beats 1 and 3 in a bar of eight 8ths

export function chordNotesLine(chord) {
  const notes = HOME_NAMES[chord].join(', ')
  if (chord === 'Am') return `A minor chord: ${notes}`
  return `${chord} chord: ${notes}`
}

export function chordBadge(barIndex) {
  const chord = CHORDS[barIndex]
  const notes = HOME_NAMES[chord].join(', ')
  if (chord === 'Am') return `Bar ${barIndex + 1}: A minor chord (${notes})`
  return `Bar ${barIndex + 1}: ${chord} chord (${notes})`
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
  for (const string of NECK_STRINGS) {
    for (const fret of BOX_FRETS[string]) {
      const midi = midiOf(string, fret)
      list.push({ string, fret, midi, name: noteName(midi) })
    }
  }
  return list
}

export const POSITIONS = boxPositions()

export function inBox(string, fret, allowBlue = false) {
  if (POSITIONS.some((item) => item.string === string && item.fret === fret)) return true
  return !!(allowBlue && string === 3 && fret === 8)
}

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

export function spreadNotes(events) {
  const notes = eventsInOrder(events)
  return notes.map((event, index) => ({
    ...event,
    startSlot: Math.min(SLOTS_PER_BAR - 1, index * 2),
    lengthSlots: 1,
  }))
}

export function resizeNote(events, target) {
  const notes = eventsInOrder(events).map((event) => ({ ...event }))
  const index = notes.findIndex(
    (event) =>
      event.startSlot === target.startSlot &&
      event.string === target.string &&
      event.fret === target.fret,
  )
  if (index < 0) return events
  const note = notes[index]
  const nextStart = notes[index + 1] ? notes[index + 1].startSlot : SLOTS_PER_BAR
  const maxLen = Math.max(1, nextStart - note.startSlot)
  const nextLen = note.lengthSlots < maxLen ? note.lengthSlots + 1 : 1
  notes[index] = { ...note, lengthSlots: nextLen }
  return notes
}

export function isChordTone(midi, chord) {
  return LANDING_PC[chord].includes(pcOf(midi))
}

export function isHomeName(name, chord) {
  return HOME_NAMES[chord].includes(name)
}

export function checkBar(events, chord) {
  const notes = eventsInOrder(events)
  const homes = HOME_NAMES[chord]
  const last = notes[notes.length - 1]
  const lastName = last ? noteName(midiOf(last.string, last.fret)) : null
  const endsHome = !!(lastName && isHomeName(lastName, chord))
  const onBeats = notes.filter((event) => STRONG_SLOTS.includes(event.startSlot))
  const homeOnBeats = onBeats.filter((event) => isHomeName(noteName(midiOf(event.string, event.fret)), chord))
  return {
    chord,
    homes,
    lastName,
    endsHome,
    beatCount: onBeats.length,
    homeOnBeats: homeOnBeats.length,
  }
}

export function checkLine(barIndex, events, chord) {
  const check = checkBar(events, chord)
  const where = `Bar ${barIndex + 1} over ${CHORD_SAY[chord]}`
  const tryHomes = check.homes.join(' or ')
  let ending = `${where}: no notes yet.`
  if (check.lastName && check.endsHome) {
    ending = `${where}: ends on ${check.lastName}, a chord note.`
  } else if (check.lastName) {
    ending = `${where}: ends on ${check.lastName}, not a chord note. Try ${tryHomes}.`
  }
  let beats = 'No notes land on beats 1 or 3.'
  if (check.beatCount === 1 && check.homeOnBeats === 1) {
    beats = 'The note on beat 1 or 3 is a chord note.'
  } else if (check.beatCount === 1) {
    beats = 'The note on beat 1 or 3 is not a chord note.'
  } else if (check.beatCount > 1 && check.homeOnBeats === check.beatCount) {
    beats = `All ${check.beatCount} notes on beats 1 and 3 are chord notes.`
  } else if (check.beatCount > 1) {
    beats = `${check.homeOnBeats} of ${check.beatCount} notes on beats 1 and 3 are chord notes.`
  }
  return `${ending} ${beats}`
}

export function isRootA(midi) {
  return pcOf(midi) === 9
}

const BOX_BY_PITCH = [...POSITIONS].sort((a, b) => a.midi - b.midi)

export function nearestBoxPosition(midi) {
  let best = BOX_BY_PITCH[0]
  let bestDist = Infinity
  for (const pos of BOX_BY_PITCH) {
    const dist = Math.abs(pos.midi - midi)
    if (dist < bestDist) {
      best = pos
      bestDist = dist
    }
  }
  return best
}

export function fitToBox(event) {
  const found = POSITIONS.find((pos) => pos.string === event.string && pos.fret === event.fret)
  if (found) return { ...event, string: found.string, fret: found.fret }
  const pos = nearestBoxPosition(midiOf(event.string, event.fret))
  return { ...event, string: pos.string, fret: pos.fret }
}

function fitPhrase(events) {
  return eventsInOrder(events).map((event) => fitToBox(event))
}

export function scaleIndex(midi) {
  const exact = BOX_BY_PITCH.findIndex((pos) => pos.midi === midi)
  if (exact >= 0) return exact
  const near = nearestBoxPosition(midi)
  return BOX_BY_PITCH.findIndex((pos) => pos.midi === near.midi)
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

export function nearestA(_midi) {
  return POSITIONS.find((pos) => pos.string === A4_POS.string && pos.fret === A4_POS.fret)
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
  const occupied = occupiedSlots(events).size / SLOTS_PER_BAR
  const longest = Math.max(...notes.map((event) => event.lengthSlots))
  const restShare = 1 - occupied
  return Math.min(
    1,
    Math.max(0.05, avg + occupied * 0.16 - restShare * 0.1 - (longest >= 4 ? 0.12 : 0) - (notes.length <= 3 ? 0.06 : 0)),
  )
}

export function shapeTensions(bars) {
  return bars.map((events, index) => barTension(events, CHORDS[index]))
}

export const RHYTHM_PATTERNS = [
  {
    id: 'pause-skip',
    label: 'Note, pause, note, note',
    hint: 'Leave a little air, then continue.',
    onsets: [0, 2, 4, 5],
    lengths: [1, 2, 1, 3],
  },
  {
    id: 'long-short',
    label: 'Long, then two shorts',
    hint: 'Lean on the first note.',
    onsets: [0, 3, 4, 6],
    lengths: [3, 1, 1, 2],
  },
  {
    id: 'offbeat',
    label: 'Start off the beat',
    hint: 'Come in after the downbeat.',
    onsets: [1, 3, 5, 6],
    lengths: [1, 2, 1, 2],
  },
  {
    id: 'front',
    label: 'Crowd the front, then rest',
    hint: 'Say it quickly, then listen.',
    onsets: [0, 1, 2, 3],
    lengths: [1, 1, 1, 1],
  },
]

export const ANSWER_RHYTHMS = [
  { onsets: [0, 1, 3, 5], lengths: [1, 1, 2, 2] },
  { onsets: [0, 2, 3, 6], lengths: [2, 1, 2, 2] },
  { onsets: [1, 2, 4, 6], lengths: [1, 1, 2, 2] },
]

function nextOpenSlot(used, preferred) {
  if (preferred >= 0 && preferred < SLOTS_PER_BAR && !used.has(preferred)) return preferred
  for (let slot = 0; slot < SLOTS_PER_BAR; slot += 1) {
    if (!used.has(slot)) return slot
  }
  return -1
}

function occupy(used, start, length) {
  for (let i = 0; i < length; i += 1) used.add(start + i)
}

function roomFrom(used, start, wanted) {
  let room = 0
  while (start + room < SLOTS_PER_BAR && !used.has(start + room) && room < wanted) room += 1
  return room
}

function mapNotesToRhythm(source, pattern) {
  const notes = eventsInOrder(source)
  if (!notes.length) return []
  const used = new Set()
  const next = []
  for (let i = 0; i < notes.length; i += 1) {
    const wanted = Math.max(1, pattern.lengths[i] ?? notes[i].lengthSlots ?? 1)
    let onset = pattern.onsets[i]
    if (onset == null || onset < 0 || onset >= SLOTS_PER_BAR) {
      onset = next[i - 1] ? next[i - 1].startSlot + next[i - 1].lengthSlots : 0
    }
    let length = roomFrom(used, onset, wanted)
    if (length < 1 || used.has(onset)) {
      let found = -1
      for (let slot = 0; slot < SLOTS_PER_BAR; slot += 1) {
        const room = roomFrom(used, slot, wanted)
        if (room >= 1 && !used.has(slot)) {
          found = slot
          length = Math.max(1, Math.min(wanted, room))
          break
        }
      }
      if (found < 0) break
      onset = found
    }
    occupy(used, onset, length)
    next.push({
      ...notes[i],
      startSlot: onset,
      lengthSlots: length,
      articulation: notes[i].articulation || 'pick',
    })
  }
  return fitPhrase(next)
}

export function moveRepeat(source) {
  return fitPhrase(eventsInOrder(source).map((event) => ({ ...event })))
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
  return fitPhrase(answered)
}

export function resolveLastToA(events) {
  const notes = fitPhrase(events)
  if (!notes.length) {
    return [{ string: A4_POS.string, fret: A4_POS.fret, startSlot: 6, lengthSlots: 2, articulation: 'pick' }]
  }
  const last = notes[notes.length - 1]
  notes[notes.length - 1] = { ...last, string: A4_POS.string, fret: A4_POS.fret }
  return notes
}

export function moveShift(source, steps) {
  const notes = eventsInOrder(source)
  return fitPhrase(
    notes.map((event) => {
      const idx = scaleIndex(midiOf(event.string, event.fret))
      const next = BOX_BY_PITCH[Math.max(0, Math.min(BOX_BY_PITCH.length - 1, idx + steps))]
      return { ...event, string: next.string, fret: next.fret }
    }),
  )
}

export function rhythmSignature(events) {
  return eventsInOrder(events)
    .map((event) => `${event.startSlot}:${event.lengthSlots}`)
    .join(',')
}

export function hasGap(events) {
  const notes = eventsInOrder(events)
  if (!notes.length) return true
  if (notes[0].startSlot > 0) return true
  for (let i = 0; i < notes.length - 1; i += 1) {
    if (notes[i].startSlot + notes[i].lengthSlots < notes[i + 1].startSlot) return true
  }
  return notes[notes.length - 1].startSlot + notes[notes.length - 1].lengthSlots < SLOTS_PER_BAR
}

export function hasInteriorRest(events) {
  const notes = eventsInOrder(events)
  if (!notes.length) return false
  if (notes[0].startSlot > 0) return true
  for (let i = 0; i < notes.length - 1; i += 1) {
    if (notes[i].startSlot + notes[i].lengthSlots < notes[i + 1].startSlot) return true
  }
  return false
}

export function withDistinctRhythm(events, avoidBars = []) {
  const notes = eventsInOrder(events)
  if (!notes.length) return []
  const avoid = new Set(avoidBars.filter((bar) => bar && bar.length).map((bar) => rhythmSignature(bar)))
  for (const pattern of ANSWER_RHYTHMS) {
    const mapped = mapNotesToRhythm(notes, pattern)
    if (!avoid.has(rhythmSignature(mapped)) && hasGap(mapped)) return mapped
  }
  return mapNotesToRhythm(notes, ANSWER_RHYTHMS[0])
}

export function finishRhythm(events) {
  const notes = eventsInOrder(events)
  if (!notes.length) {
    return [{ string: A4_POS.string, fret: A4_POS.fret, startSlot: 4, lengthSlots: 4, articulation: 'pick' }]
  }
  const lastA = { string: A4_POS.string, fret: A4_POS.fret }
  if (notes.length === 1) {
    return [{ ...notes[0], ...lastA, startSlot: 0, lengthSlots: 8 }]
  }
  if (notes.length === 2) {
    return [
      { ...notes[0], startSlot: 0, lengthSlots: 2 },
      { ...notes[1], ...lastA, startSlot: 2, lengthSlots: 6 },
    ]
  }
  if (notes.length === 3) {
    return [
      { ...notes[0], startSlot: 0, lengthSlots: 1 },
      { ...notes[1], startSlot: 1, lengthSlots: 2 },
      { ...notes[2], ...lastA, startSlot: 4, lengthSlots: 4 },
    ]
  }
  return [
    { ...notes[0], startSlot: 0, lengthSlots: 1 },
    { ...notes[1], startSlot: 1, lengthSlots: 1 },
    { ...notes[2], startSlot: 2, lengthSlots: 2 },
    { ...notes[3], ...lastA, startSlot: 4, lengthSlots: 4 },
  ]
}

export function moveLeaveSpace(source, index = 0) {
  const notes = eventsInOrder(source)
  if (notes.length <= 1) return fitPhrase(notes)
  const drop = Math.max(0, Math.min(notes.length - 1, Number(index) || 0))
  return fitPhrase(notes.filter((_, i) => i !== drop))
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
    { string: 3, fret: 5, startSlot: 0, lengthSlots: 1, articulation: 'pick' },
    { string: 3, fret: 7, startSlot: 1, lengthSlots: 1, articulation: 'pick' },
    { string: 2, fret: 5, startSlot: 2, lengthSlots: 2, articulation: 'pick' },
  ],
  [
    { string: 1, fret: 5, startSlot: 0, lengthSlots: 2, articulation: 'pick' },
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
    return NECK_STRINGS.map((string) => {
      const cells = Array.from({ length: SLOTS_PER_BAR }, () => '--')
      for (const event of notes) {
        if (event.string !== string) continue
        cells[event.startSlot] = String(event.fret).padStart(2, '-')
      }
      return `${STRING_LABELS[string]}|${cells.join('')}`
    }).join('\n')
  })
}
