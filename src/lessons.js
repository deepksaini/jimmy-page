import {
  barTension,
  CHORD_SAY,
  CHORDS,
  eventsInOrder,
  hasInteriorRest,
  HOME_NAMES,
  isHomeName,
  midiOf,
  nearestChordTonePosition,
  noteName,
  resolveLastToA,
  rhythmSignature,
  scaleIndex,
} from './music.js'

const STATS_KEY = 'pbp-lesson-stats'

export const LESSON_META = [
  {
    id: 'home',
    kind: 'fact',
    title: 'Chord notes change with the chord.',
    rule: 'A minor’s chord notes are A, C, and E. F’s are A and C. G’s are G and D. The same pitch can be in one chord and not in the next.',
    example: 'End a G bar on D. That D is a chord note over G, but not over A minor or F.',
  },
  {
    id: 'finish',
    kind: 'guide',
    title: 'Your last note decides how finished it feels.',
    rule: 'On the last bar, A feels finished. C or E feels restful but still open. Any other note feels unfinished.',
    example: 'Play C D E in bar 4, then change the last note to A and hear the phrase land.',
  },
  {
    id: 'repeat',
    kind: 'guide',
    title: 'Repeat an idea so people remember it.',
    rule: 'Play the same steps again in another bar — the same ups and downs, even if you start on a different note.',
    example: 'Bar 1 goes C D E. Bar 2 goes D E G. Same two steps up, so the ear hears a repeat.',
  },
  {
    id: 'rhythm',
    kind: 'guide',
    title: 'Rhythm changes the feel.',
    rule: 'Keep the notes and change when they land. The idea stays, the feel moves.',
    example: 'Play C D E on the beat, then play C D E coming in after the downbeat.',
  },
  {
    id: 'idea',
    kind: 'guide',
    title: 'An idea beats running the scale.',
    rule: 'A run is three or more notes that walk one step at a time on C D E G A C. One short run is fine. Many runs sound like the ladder, not a phrase.',
    example: 'C D E once, then a leap, is one idea. C D E and later G A C is two runs.',
  },
  {
    id: 'silence',
    kind: 'guide',
    title: 'Silence makes notes stand out.',
    rule: 'Leave a rest inside a bar — a hole before a note or between notes — so the next sound has space.',
    example: 'Play C, wait an eighth, then D and E. The gap is the point.',
  },
  {
    id: 'shape',
    kind: 'guide',
    title: 'Build, then settle.',
    rule: 'Let the phrase get more restless toward bar 2 or 3, then let bar 4 come down.',
    example: 'Start simple over A minor, get busier over F or G, then end bar 4 on a long A.',
  },
]

function cloneBar(events) {
  return eventsInOrder(events).map((event) => ({ ...event }))
}

function lastEvent(events) {
  const notes = eventsInOrder(events)
  return notes[notes.length - 1] || null
}

function lastName(events) {
  const event = lastEvent(events)
  return event ? noteName(midiOf(event.string, event.fret)) : null
}

function pitchSeq(events) {
  return eventsInOrder(events)
    .map((event) => scaleIndex(midiOf(event.string, event.fret)))
    .join(',')
}

function stepPattern(events) {
  const idx = eventsInOrder(events).map((event) => scaleIndex(midiOf(event.string, event.fret)))
  if (idx.length < 2) return null
  return idx
    .slice(1)
    .map((value, index) => value - idx[index])
    .join(',')
}

function nameLine(events) {
  return eventsInOrder(events)
    .map((event) => noteName(midiOf(event.string, event.fret)))
    .join(' ')
}

function sayList(items) {
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} or ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, or ${items[items.length - 1]}`
}

function evenRhythm(events) {
  return eventsInOrder(events).map((event, index) => ({
    ...event,
    startSlot: index,
    lengthSlots: 1,
  }))
}

function lastToHome(events, chord) {
  const notes = cloneBar(events)
  if (!notes.length) return notes
  const last = notes[notes.length - 1]
  const pos = nearestChordTonePosition(midiOf(last.string, last.fret), chord)
  notes[notes.length - 1] = { ...last, string: pos.string, fret: pos.fret }
  return notes
}

export function flattenNotes(bars) {
  return bars.flatMap((events) => eventsInOrder(events))
}

export function countScaleRuns(bars) {
  const idx = flattenNotes(bars).map((event) => scaleIndex(midiOf(event.string, event.fret)))
  let runs = 0
  let i = 0
  while (i < idx.length - 1) {
    const dir = idx[i + 1] - idx[i]
    if (dir !== 1 && dir !== -1) {
      i += 1
      continue
    }
    let length = 2
    let j = i + 1
    while (j + 1 < idx.length && idx[j + 1] - idx[j] === dir) {
      length += 1
      j += 1
    }
    if (length >= 3) {
      runs += 1
      i = j
    } else {
      i += 1
    }
  }
  return runs
}

export function shapeFits(tensions) {
  if (tensions.length < 4) return false
  const peak = Math.max(tensions[1], tensions[2])
  const rises = tensions[1] > tensions[0] + 0.02 || tensions[2] > tensions[0] + 0.02
  const peakIsMiddle = peak >= tensions[0] && peak >= tensions[3]
  const falls = tensions[3] < peak - 0.02
  return rises && peakIsMiddle && falls
}

function statusUsed(used, enough) {
  if (!enough) return 'short'
  return used ? 'used' : 'not'
}

function lessonHome(bars) {
  const written = bars
    .map((events, index) => ({
      index,
      chord: CHORDS[index],
      name: lastName(events),
      notes: eventsInOrder(events).length,
    }))
    .filter((item) => item.notes > 0)
  const enough = written.length >= 2
  const used = enough && written.every((item) => isHomeName(item.name, item.chord))
  const bits = (enough ? written : bars.map((events, index) => ({
    index,
    chord: CHORDS[index],
    name: lastName(events),
    notes: eventsInOrder(events).length,
  }))).map((item) => {
    if (!item.notes) return `Bar ${item.index + 1} has no notes yet.`
    const home = isHomeName(item.name, item.chord)
    return `Bar ${item.index + 1} over ${CHORD_SAY[item.chord]} ends on ${item.name}${home ? ', a chord note' : ', not a chord note'}.`
  })
  const seen = new Map()
  for (const item of written) {
    const row = seen.get(item.name) || { home: [], not: [] }
    if (isHomeName(item.name, item.chord)) row.home.push(CHORD_SAY[item.chord])
    else row.not.push(CHORD_SAY[item.chord])
    seen.set(item.name, row)
  }
  let extra = ''
  for (const [name, row] of seen) {
    if (row.home.length && row.not.length) {
      extra = ` ${name} is settled over ${sayList(row.home)} but not over ${sayList(row.not)}.`
      break
    }
  }
  if (!extra && written.length) {
    extra = ` Chord notes: A minor = ${HOME_NAMES.Am.join(', ')}; F = ${HOME_NAMES.F.join(', ')}; G = ${HOME_NAMES.G.join(', ')}.`
  }
  const firstMiss = written.find((item) => !isHomeName(item.name, item.chord))
  const hear = firstMiss
    ? {
        parts: [
          { events: cloneBar(bars[firstMiss.index]), barIndex: firstMiss.index },
          { events: lastToHome(bars[firstMiss.index], firstMiss.chord), barIndex: firstMiss.index },
        ],
      }
    : null
  return {
    evidence: `${bits.join(' ')}${extra}`.trim(),
    status: statusUsed(used, enough),
    hear,
  }
}

function lessonFinish(bars) {
  const notes = eventsInOrder(bars[3] || [])
  const enough = notes.length > 0
  const name = lastName(bars[3] || [])
  let evidence = 'Bar 4 has no notes yet.'
  let used = false
  if (name === 'A') {
    evidence = 'Bar 4 ends on A, so it feels finished.'
    used = true
  } else if (name === 'C' || name === 'E') {
    evidence = `Bar 4 ends on ${name}, restful but still open.`
  } else if (name) {
    evidence = `Bar 4 ends on ${name}, so it feels unfinished.`
  }
  const hear =
    enough && name !== 'A'
      ? {
          parts: [
            { events: cloneBar(bars[3]), barIndex: 3 },
            { events: resolveLastToA(cloneBar(bars[3])), barIndex: 3 },
          ],
        }
      : null
  return { evidence, status: statusUsed(used, enough), hear }
}

function lessonRepeat(bars) {
  const ready = bars
    .map((events, index) => ({ index, pattern: stepPattern(events), names: nameLine(events), count: eventsInOrder(events).length }))
    .filter((item) => item.pattern)
  const enough = ready.length >= 2
  let pair = null
  for (let i = 0; i < ready.length; i += 1) {
    for (let j = i + 1; j < ready.length; j += 1) {
      if (ready[i].pattern === ready[j].pattern) {
        pair = [ready[i], ready[j]]
        break
      }
    }
    if (pair) break
  }
  const evidence = pair
    ? `Bar ${pair[0].index + 1} (${pair[0].names}) and bar ${pair[1].index + 1} (${pair[1].names}) use the same steps.`
    : enough
      ? 'No two bars share the same steps between notes.'
      : 'Need at least two bars with two notes each to look for a repeat.'
  const hear = pair
    ? {
        parts: [
          { events: cloneBar(bars[pair[0].index]), barIndex: pair[0].index },
          { events: cloneBar(bars[pair[1].index]), barIndex: pair[1].index },
        ],
      }
    : null
  return { evidence, status: statusUsed(!!pair, enough), hear }
}

function lessonRhythm(bars) {
  const ready = bars
    .map((events, index) => ({
      index,
      pitch: pitchSeq(events),
      rhythm: rhythmSignature(events),
      names: nameLine(events),
      count: eventsInOrder(events).length,
    }))
    .filter((item) => item.count >= 2)
  const enough = ready.length >= 2
  let pair = null
  for (let i = 0; i < ready.length; i += 1) {
    for (let j = i + 1; j < ready.length; j += 1) {
      if (ready[i].pitch === ready[j].pitch && ready[i].rhythm !== ready[j].rhythm) {
        pair = [ready[i], ready[j]]
        break
      }
    }
    if (pair) break
  }
  const chosen = pair ? pair[1] : null
  const evidence = pair
    ? `Bar ${pair[1].index + 1} reuses bar ${pair[0].index + 1}’s notes (${pair[0].names}) with a different rhythm.`
    : enough
      ? 'No bar repeats another bar’s notes with a new rhythm.'
      : 'Need at least two bars with two notes each to compare rhythm.'
  const hear = chosen
    ? {
        parts: [
          { events: evenRhythm(bars[chosen.index]), barIndex: chosen.index },
          { events: cloneBar(bars[chosen.index]), barIndex: chosen.index },
        ],
      }
    : null
  return { evidence, status: statusUsed(!!pair, enough), hear }
}

function lessonIdea(bars) {
  const notes = flattenNotes(bars)
  const enough = notes.length >= 3
  const runs = countScaleRuns(bars)
  const used = enough && runs <= 1
  let evidence = 'Need at least three notes to look for a scale run.'
  if (enough && runs === 0) evidence = 'No scale runs of three or more notes. The notes jump enough to sound like an idea.'
  if (enough && runs === 1) evidence = 'One scale run of three or more notes. That is still an idea, not a whole ladder.'
  if (enough && runs > 1) evidence = `${runs} scale runs of three or more notes. Try repeating a short idea instead of walking the ladder.`
  return { evidence, status: statusUsed(used, enough), hear: null }
}

function lessonSilence(bars) {
  const written = bars.filter((events) => eventsInOrder(events).length)
  const enough = written.length > 0
  const quiet = bars
    .map((events, index) => ({ index, rest: hasInteriorRest(events) }))
    .filter((item) => item.rest)
  const labels = quiet.map((item) => item.index + 1)
  let restLine = ''
  if (labels.length === 1) restLine = `Bar ${labels[0]} leaves a rest inside the bar.`
  else if (labels.length === 2) restLine = `Bars ${labels[0]} and ${labels[1]} leave a rest inside the bar.`
  else if (labels.length > 2) {
    restLine = `Bars ${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]} leave a rest inside the bar.`
  }
  const evidence = quiet.length
    ? restLine
    : enough
      ? 'Notes sit against each other. No bar leaves a rest inside it.'
      : 'Need notes before we can hear silence between them.'
  return { evidence, status: statusUsed(quiet.length > 0, enough), hear: null }
}

function lessonShape(bars) {
  const enough = bars.every((events) => eventsInOrder(events).length > 0)
  const tensions = bars.map((events, index) => barTension(events, CHORDS[index]))
  const used = enough && shapeFits(tensions)
  const words = tensions.map((value, index) => {
    if (value < 0.32) return `bar ${index + 1} settled`
    if (value < 0.5) return `bar ${index + 1} in the middle`
    return `bar ${index + 1} restless`
  })
  const evidence = enough
    ? used
      ? `The phrase builds, then comes down (${words.join(', ')}).`
      : `The phrase does not build then settle (${words.join(', ')}).`
    : 'Need notes in all four bars to see the rise and fall.'
  return { evidence, status: statusUsed(used, enough), hear: null }
}

const EVALUATORS = {
  home: lessonHome,
  finish: lessonFinish,
  repeat: lessonRepeat,
  rhythm: lessonRhythm,
  idea: lessonIdea,
  silence: lessonSilence,
  shape: lessonShape,
}

export function evaluateLessons(bars) {
  return LESSON_META.map((meta) => {
    const result = EVALUATORS[meta.id](bars)
    return { ...meta, ...result }
  })
}

export function lessonsUsedCount(lessons) {
  return lessons.filter((item) => item.status === 'used').length
}

export function emptyLessonStats() {
  return Object.fromEntries(LESSON_META.map((item) => [item.id, 0]))
}

export function loadLessonStats() {
  try {
    const raw = window.localStorage.getItem(STATS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return { ...emptyLessonStats(), ...parsed }
  } catch {
    return emptyLessonStats()
  }
}

export function recordLessonUses(ids) {
  const stats = loadLessonStats()
  for (const id of ids) {
    if (id in stats) stats[id] += 1
  }
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  return stats
}

function n(string, fret, startSlot, lengthSlots = 1) {
  return { string, fret, startSlot, lengthSlots, articulation: 'pick' }
}

const C = [3, 5]
const D = [3, 7]
const E = [2, 5]
const G = [2, 8]
const A = [1, 5]
const C5 = [1, 8]

function run(slots, ...pitches) {
  return pitches.map((pos, index) => n(pos[0], pos[1], slots[index] ?? index, 1))
}

export const LESSON_FIXTURES = {
  homeYes: [
    run([0, 1, 2], C, D, E),
    run([0, 1, 2], C, D, C),
    run([0, 1, 2], G, E, D),
    run([0, 1, 2], C, E, A),
  ],
  homeNo: [
    run([0, 1, 2], C, E, D),
    run([0, 1, 2], A, C, D),
    run([0, 1, 2], G, D, E),
    run([0, 1, 2], C, D, G),
  ],
  finishYes: [[], [], [], run([0, 1, 4], C, D, A)],
  finishNo: [[], [], [], run([0, 1, 2], C, D, G)],
  repeatYes: [
    run([0, 1, 2], C, D, E),
    run([0, 1, 2], D, E, G),
    run([0, 1, 2], G, E, C),
    run([0, 1, 2], A, E, C),
  ],
  repeatNo: [
    run([0, 1, 2], C, E, A),
    run([0, 1, 2], G, D, C),
    run([0, 1, 2], E, G, A),
    run([0, 1, 2], A, C, E),
  ],
  rhythmYes: [
    run([0, 1, 2], C, D, E),
    [n(3, 5, 1, 1), n(3, 7, 3, 1), n(2, 5, 5, 1)],
    run([0, 1, 2], G, E, D),
    run([0, 1, 2], C, E, A),
  ],
  rhythmNo: [
    run([0, 1, 2], C, D, E),
    run([0, 1, 2], C, D, E),
    run([0, 1, 2], G, E, D),
    run([0, 1, 2], C, E, A),
  ],
  ideaYes: [
    run([0, 1, 2], C, D, E),
    run([0, 2, 4], A, E, C),
    run([0, 2, 4], G, E, C),
    run([0, 1, 4], C, E, A),
  ],
  ideaNo: [
    run([0, 1, 2], C, D, E),
    run([0, 1, 2], G, A, C5),
    run([0, 1, 2], C5, A, G),
    run([0, 1, 2], E, D, C),
  ],
  silenceYes: [
    [n(3, 5, 0, 1), n(3, 7, 2, 1), n(2, 5, 4, 1)],
    run([0, 1, 2], C, D, E),
    run([0, 1, 2], G, D, E),
    run([0, 1, 2], C, E, A),
  ],
  silenceNo: [
    run([0, 1, 2], C, D, E),
    run([0, 1, 2], C, D, C),
    run([0, 1, 2], G, E, D),
    run([0, 1, 2], C, E, A),
  ],
  shapeYes: [
    [n(1, 5, 0, 4)],
    [n(3, 7, 0, 1), n(2, 8, 1, 1), n(3, 7, 2, 1), n(2, 5, 3, 1)],
    [n(3, 5, 0, 1), n(2, 5, 1, 1), n(1, 8, 2, 1), n(3, 7, 3, 1)],
    [n(3, 5, 0, 1), n(2, 5, 1, 1), n(1, 5, 4, 4)],
  ],
  shapeNo: [
    [n(3, 5, 0, 1), n(2, 5, 1, 1), n(1, 8, 2, 1), n(3, 7, 3, 1)],
    [n(1, 5, 0, 2)],
    [n(1, 5, 0, 2)],
    [n(3, 7, 0, 1), n(2, 8, 1, 1), n(3, 7, 2, 1), n(2, 5, 3, 1)],
  ],
}
