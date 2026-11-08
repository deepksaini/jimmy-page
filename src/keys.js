/** Letter keys named after the six box notes. */

const NOTES = {
  KeyC: { string: 3, fret: 5 }, // C4
  KeyD: { string: 3, fret: 7 }, // D4
  KeyE: { string: 2, fret: 5 }, // E4
  KeyG: { string: 2, fret: 8 }, // G4
  KeyA: { string: 1, fret: 5 }, // A4
}

const HIGH_C = { string: 1, fret: 8 } // C5

export function noteFromKey(event) {
  if (event.code === 'KeyC' && event.shiftKey) return HIGH_C
  if (event.code === 'KeyD' && event.shiftKey) return { string: 3, fret: 8 }
  if (event.shiftKey) return null
  return NOTES[event.code] || null
}

export const KEYS_HINT = 'Keys: C D E G A. Shift+C = higher C.'
export const KEYS_HINT_BLUE = 'Keys: C D E G A. Shift+C = higher C. Shift+D = E♭.'
