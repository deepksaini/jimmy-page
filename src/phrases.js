import { POSITIONS } from './music.js'

export const NAMED_POS = {
  C4: { string: 3, fret: 5 },
  D4: { string: 3, fret: 7 },
  Eb4: { string: 3, fret: 8 },
  'E♭4': { string: 3, fret: 8 },
  E4: { string: 2, fret: 5 },
  G4: { string: 2, fret: 8 },
  A4: { string: 1, fret: 5 },
  C5: { string: 1, fret: 8 },
}

export function parsePhrase(text) {
  if (!text || !String(text).trim()) return []
  return String(text)
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
    .flatMap((token) => {
      const match = token.match(/^(rest|[A-G][♭b#]?\d)@(\d+)[×x](\d+)$/)
      if (!match) throw new Error(`Cannot read example note: ${token}`)
      if (match[1] === 'rest') return []
      const label = match[1].replace('b', '♭')
      const pos = NAMED_POS[label]
      if (!pos) throw new Error(`Unknown example note: ${label}`)
      return [
        {
          string: pos.string,
          fret: pos.fret,
          startSlot: Number(match[2]),
          lengthSlots: Number(match[3]),
          articulation: 'pick',
        },
      ]
    })
}

export function inNamedBox(event) {
  return POSITIONS.some((pos) => pos.string === event.string && pos.fret === event.fret) || event.fret === 8
}
