import {
  BOX_FRETS,
  CHORDS,
  LANDING_PC,
  midiOf,
  moveAnswer,
  moveChangeRhythm,
  moveRepeat,
  noteName,
  pcOf,
  POSITIONS,
  resolveLastToA,
} from '../src/music.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

assert(POSITIONS.length === 12, 'box should have 12 clickable notes')
assert(noteName(midiOf(1, 5)) === 'A', 'high e fret 5 is A')
assert(noteName(midiOf(1, 8)) === 'C', 'high e fret 8 is C')
assert(noteName(midiOf(4, 7)) === 'A', 'D string fret 7 is A')
assert(BOX_FRETS[3].join() === '5,7', 'G string uses 5 and 7')
assert(LANDING_PC.Am.join() === '9,0,4', 'Am landings A C E')
assert(LANDING_PC.F.join() === '9,0', 'F landings A C')
assert(LANDING_PC.G.join() === '7,2', 'G landings G D')

const idea = [
  { string: 1, fret: 5, startSlot: 0, lengthSlots: 1, articulation: 'pick' },
  { string: 1, fret: 8, startSlot: 1, lengthSlots: 1, articulation: 'pick' },
  { string: 2, fret: 5, startSlot: 2, lengthSlots: 1, articulation: 'pick' },
]
const repeated = moveRepeat(idea)
assert(repeated.length === 3 && repeated[0].fret === 5, 'repeat copies the idea')

const swung = moveChangeRhythm(idea, 'offbeat')
assert(swung[0].startSlot === 1, 'off-beat pattern starts on slot 1')

const answered = moveAnswer(idea, CHORDS[2])
assert(answered.length === 3, 'answer keeps note count')
assert(LANDING_PC.G.includes(pcOf(midiOf(answered[2].string, answered[2].fret))), 'answer lands on a G chord tone')

const resolved = resolveLastToA(idea)
assert(pcOf(midiOf(resolved[2].string, resolved[2].fret)) === 9, 'finish can resolve to A')

console.log('music checks passed')
