import {
  bar4EndsOnA,
  blueNoteCheck,
  chordEndReport,
  hasPassingLand,
  lastName,
  rhythmSpaceCheck,
  twoBarsShareIdea,
} from './learnChecks.js'
import { countScaleRuns } from './lessons.js'
import {
  CHORD_SAY,
  CHORDS,
  eventsInOrder,
  hasInteriorRest,
  HOME_NAMES,
  isHomeName,
  mapNotesToRhythm,
  midiOf,
  moveAnswer,
  moveChangeRhythm,
  moveRepeat,
  noteName,
  RHYTHM_PATTERNS,
  spreadNotes,
  withDistinctRhythm,
  withRestGap,
} from './music.js'

export const BOX1 = [
  { string: 6, fret: 5 },
  { string: 6, fret: 8 },
  { string: 5, fret: 5 },
  { string: 5, fret: 7 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
  { string: 3, fret: 5 },
  { string: 3, fret: 7 },
  { string: 2, fret: 5 },
  { string: 2, fret: 8 },
  { string: 1, fret: 5 },
  { string: 1, fret: 8 },
]

export const BLUE_NOTES = [
  { string: 5, fret: 6 },
  { string: 3, fret: 8 },
]

export const BOX_GLOW = {
  Am: [
    { string: 6, fret: 5 },
    { string: 6, fret: 8 },
    { string: 5, fret: 7 },
    { string: 4, fret: 7 },
    { string: 3, fret: 5 },
    { string: 2, fret: 5 },
    { string: 1, fret: 5 },
    { string: 1, fret: 8 },
  ],
  F: [
    { string: 6, fret: 5 },
    { string: 6, fret: 8 },
    { string: 4, fret: 7 },
    { string: 3, fret: 5 },
    { string: 1, fret: 5 },
    { string: 1, fret: 8 },
  ],
  G: [
    { string: 5, fret: 5 },
    { string: 4, fret: 5 },
    { string: 3, fret: 7 },
    { string: 2, fret: 8 },
  ],
}

export const CHALLENGE_GOALS = [
  'Every bar ends on a chord note for that bar.',
  'Bar 4 ends on A.',
  'At least two bars share the same idea.',
  'At least one rest inside a bar.',
  'At most one scale run (three or more notes stepping through the box in one direction).',
]

export const RHYTHM_CHOICES = [
  { id: 'even', label: 'Even' },
  { id: 'pause-skip', label: 'Note-pause-note-note' },
  { id: 'long-short', label: 'Long then two shorts' },
  { id: 'offbeat', label: 'Start off the beat' },
]

const EVEN_PATTERN = { id: 'even', onsets: [0, 2, 4, 6], lengths: [2, 2, 2, 2] }

export const LESSON_SETUP = {
  '9.1': {
    glow: true,
    blue: false,
    moves: false,
    rhythm: false,
    goal: 'End each bar on a glowing note.',
  },
  '9.2': {
    glow: true,
    blue: false,
    moves: false,
    rhythm: false,
    goal: "Use a note that isn't glowing, step to a glowing note next to it, and end bar 4 on A.",
  },
  '9.3': {
    glow: true,
    blue: false,
    moves: true,
    rhythm: false,
    goal: 'Use your idea in at least two bars and end on A.',
  },
  '9.4': {
    glow: true,
    blue: false,
    moves: false,
    rhythm: true,
    goal: 'Leave at least one rest inside a bar and start one note off the beat.',
  },
  '9.5': {
    glow: true,
    blue: true,
    moves: false,
    rhythm: false,
    goal: "Use E♭ once, step straight to D or E, and don't end a bar on it.",
  },
  '9.6': {
    glow: false,
    blue: true,
    moves: false,
    rhythm: true,
    goal: 'Meet the five goals.',
  },
}

export function posKey(string, fret) {
  return `${string}-${fret}`
}

export function isBlueNote(string, fret) {
  return BLUE_NOTES.some((item) => item.string === string && item.fret === fret)
}

export function inBox1(string, fret, allowBlue = false) {
  if (BOX1.some((item) => item.string === string && item.fret === fret)) return true
  return !!(allowBlue && isBlueNote(string, fret))
}

export function glowForChord(chord) {
  return BOX_GLOW[chord] || BOX_GLOW.Am
}

export function displayPitch(name) {
  if (name === 'D#') return 'E♭'
  if (name === 'A#') return 'B♭'
  if (name === 'C#') return 'C♯'
  if (name === 'F#') return 'F♯'
  if (name === 'G#') return 'G♯'
  return name
}

function sayList(items) {
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} or ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, or ${items[items.length - 1]}`
}

export function chordLabel(chord) {
  return CHORD_SAY[chord] || chord
}

export function endBarFeedback(events, chord) {
  const notes = eventsInOrder(events)
  const last = lastName(events)
  const pretty = displayPitch(last)
  const homes = HOME_NAMES[chord]
  const label = chordLabel(chord)
  if (!notes.length) {
    return { ok: false, empty: true, text: 'Play a note in this bar first.', last: null, homes }
  }
  if (isHomeName(last, chord)) {
    return { ok: true, empty: false, text: `Ends on ${pretty}, a note of ${label} ✓`, last, homes }
  }
  return {
    ok: false,
    empty: false,
    text: `Ends on ${pretty}, which isn't in ${label}. Try ${sayList(homes)}.`,
    last,
    homes,
  }
}

export function addBoxNote(events, string, fret) {
  const notes = eventsInOrder(events)
  if (notes.length >= 4) return notes
  return spreadNotes([...notes, { string, fret, startSlot: notes.length * 2, lengthSlots: 2, articulation: 'pick' }])
}

export function applyRhythm(events, patternId) {
  if (patternId === 'even') return mapNotesToRhythm(events, EVEN_PATTERN)
  if (patternId === 'rest') return withRestGap(events)
  const pattern = RHYTHM_PATTERNS.find((item) => item.id === patternId)
  if (pattern) return mapNotesToRhythm(events, pattern)
  return eventsInOrder(events)
}

export function ideaMove(source, kind, chord) {
  if (kind === 'repeat') return moveRepeat(source)
  if (kind === 'rhythm') return withDistinctRhythm(source, [source]) || moveChangeRhythm(source, 'long-short')
  if (kind === 'answer') return moveAnswer(source, chord)
  return eventsInOrder(source)
}

export function evenPhrase(bars) {
  return bars.map((events) => spreadNotes(events))
}

export function chordEndsCount(bars) {
  const report = chordEndReport(bars)
  return {
    okCount: 4 - report.misses.length,
    total: 4,
    report,
  }
}

function blueOk(bars) {
  const check = blueNoteCheck(bars)
  return check.ok
}

export function scoreLesson(lessonId, bars) {
  const ends = chordEndsCount(bars)
  const setup = LESSON_SETUP[lessonId]
  const checks = []
  if (lessonId === '9.1') {
    checks.push({ ok: ends.report.ok, label: setup.goal })
  } else if (lessonId === '9.2') {
    checks.push({ ok: hasPassingLand(bars) && bar4EndsOnA(bars), label: setup.goal })
  } else if (lessonId === '9.3') {
    checks.push({ ok: twoBarsShareIdea(bars) && bar4EndsOnA(bars), label: setup.goal })
  } else if (lessonId === '9.4') {
    checks.push({ ok: rhythmSpaceCheck(bars).ok, label: setup.goal })
  } else if (lessonId === '9.5') {
    checks.push({ ok: blueOk(bars), label: setup.goal })
  } else if (lessonId === '9.6') {
    const runs = countScaleRuns(bars)
    checks.push({ ok: ends.report.ok, label: CHALLENGE_GOALS[0] })
    checks.push({ ok: bar4EndsOnA(bars), label: CHALLENGE_GOALS[1] })
    checks.push({ ok: twoBarsShareIdea(bars), label: CHALLENGE_GOALS[2] })
    checks.push({ ok: bars.some((events) => hasInteriorRest(events)), label: CHALLENGE_GOALS[3] })
    checks.push({
      ok: runs <= 1 && bars.some((events) => eventsInOrder(events).length),
      label: CHALLENGE_GOALS[4],
    })
  }
  const met = checks.filter((item) => item.ok).length
  return {
    ok: checks.length > 0 && checks.every((item) => item.ok),
    checks,
    met,
    total: checks.length,
    endsOnChord: ends.okCount,
    summary: `${ends.okCount} of 4 bars end on a chord note.`,
  }
}

export function stripSpec(text) {
  if (!text) return ''
  return String(text)
    .replace(/\bPass:\s*/gi, '')
    .replace(/\s*→\s*accept[^.]*\.?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function noteChip(event) {
  return displayPitch(noteName(midiOf(event.string, event.fret)))
}

export { CHORDS }
