/** Chord shapes from THEORY_COURSE.md, low string (6) to high (1). `x` is skipped. */

export const VOICINGS = {
  C: [
    { string: 5, fret: 3 },
    { string: 4, fret: 2 },
    { string: 3, fret: 0 },
    { string: 2, fret: 1 },
    { string: 1, fret: 0 },
  ],
  G: [
    { string: 6, fret: 3 },
    { string: 5, fret: 2 },
    { string: 4, fret: 0 },
    { string: 3, fret: 0 },
    { string: 2, fret: 0 },
    { string: 1, fret: 3 },
  ],
  D: [
    { string: 4, fret: 0 },
    { string: 3, fret: 2 },
    { string: 2, fret: 3 },
    { string: 1, fret: 2 },
  ],
  A: [
    { string: 5, fret: 0 },
    { string: 4, fret: 2 },
    { string: 3, fret: 2 },
    { string: 2, fret: 2 },
    { string: 1, fret: 0 },
  ],
  E: [
    { string: 6, fret: 0 },
    { string: 5, fret: 2 },
    { string: 4, fret: 2 },
    { string: 3, fret: 1 },
    { string: 2, fret: 0 },
    { string: 1, fret: 0 },
  ],
  F: [
    { string: 4, fret: 3 },
    { string: 3, fret: 2 },
    { string: 2, fret: 1 },
    { string: 1, fret: 1 },
  ],
  Am: [
    { string: 5, fret: 0 },
    { string: 4, fret: 2 },
    { string: 3, fret: 2 },
    { string: 2, fret: 1 },
    { string: 1, fret: 0 },
  ],
  Dm: [
    { string: 4, fret: 0 },
    { string: 3, fret: 2 },
    { string: 2, fret: 3 },
    { string: 1, fret: 1 },
  ],
  Em: [
    { string: 6, fret: 0 },
    { string: 5, fret: 2 },
    { string: 4, fret: 2 },
    { string: 3, fret: 0 },
    { string: 2, fret: 0 },
    { string: 1, fret: 0 },
  ],
  Bm: [
    { string: 5, fret: 2 },
    { string: 4, fret: 4 },
    { string: 3, fret: 4 },
    { string: 2, fret: 3 },
  ],
  Cm: [
    { string: 5, fret: 3 },
    { string: 4, fret: 5 },
    { string: 3, fret: 5 },
    { string: 2, fret: 4 },
  ],
}

export function chordNotes(name) {
  return VOICINGS[name] || []
}
