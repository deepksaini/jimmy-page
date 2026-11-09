import { midiOf, noteName, pcOf } from '../notes.js'

export const ENHARMONIC = {
  'C♯': 'D♭',
  'D♭': 'C♯',
  Db: 'C♯',
  'D♯': 'E♭',
  'E♭': 'D♯',
  Eb: 'D♯',
  'F♯': 'G♭',
  'G♭': 'F♯',
  Gb: 'F♯',
  'G♯': 'A♭',
  'A♭': 'G♯',
  Ab: 'G♯',
  'A♯': 'B♭',
  'B♭': 'A♯',
  Bb: 'A♯',
  'C#': 'C♯',
  'D#': 'D♯',
  'F#': 'F♯',
  'G#': 'G♯',
  'A#': 'A♯',
}

export function canonName(name) {
  if (!name) return ''
  const pretty = name.replace('#', '♯').replace('b', '♭')
  return pretty
}

export function namesMatch(a, b) {
  const left = canonName(a)
  const right = canonName(b)
  if (left === right) return true
  return ENHARMONIC[left] === right || ENHARMONIC[right] === left
}

export function pcFromName(name) {
  const pretty = canonName(name)
  const sharp = ENHARMONIC[pretty] && pretty.includes('♭') ? ENHARMONIC[pretty] : pretty
  const idx = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'].indexOf(sharp)
  return idx
}

export function playedName(string, fret) {
  return noteName(midiOf(string, fret))
}

export function samePos(a, b) {
  return a && b && a.string === b.string && a.fret === b.fret
}

export function matchesTarget(pos, target) {
  if (!target) return false
  if (target.string && samePos(pos, target)) return true
  if (target.acceptNotes?.length) {
    const name = playedName(pos.string, pos.fret)
    return target.acceptNotes.some((note) => namesMatch(name, note) || pcOf(midiOf(pos.string, pos.fret)) === pcFromName(note))
  }
  return false
}

export const OPEN_OCTAVES = {
  6: 'E2',
  5: 'A2',
  4: 'D3',
  3: 'G3',
  2: 'B3',
  1: 'E4',
}
