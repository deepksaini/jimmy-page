import {
  catalog,
  continueTarget,
  doneCount,
  isUnlocked,
  lessonStatus,
  splitLearn,
} from '../src/courseProgress.js'
import {
  ACOUSTIC_FILES,
  midiOf as fullMidi,
  noteName as fullName,
  SAMPLE_CREDIT,
  sampleFileToToneName,
  STRUM_GAP,
} from '../src/notes.js'
import { MODULE_1 } from '../src/theory/module1.js'
import { MODULE_2 } from '../src/theory/module2.js'
import { MODULE_3 } from '../src/theory/module3.js'
import { MODULE_4 } from '../src/theory/module4.js'
import { MODULE_5 } from '../src/theory/module5.js'
import { MODULE_6 } from '../src/theory/module6.js'
import { MODULE_7 } from '../src/theory/module7.js'
import { MODULE_8 } from '../src/theory/module8.js'
import { MODULE_9, MODULE_9_IDS } from '../src/theory/module9.js'
import { LESSONS } from '../src/course.js'
import { MODULE_10 } from '../src/theory/module10.js'
import { nextConcept } from '../src/theory/catalog.js'
import { buildLearningReport } from '../src/theory/report.js'
import { continueSummary, diagnosePath, verifyOutcome } from '../src/theoryLogic.js'
import { VOICINGS } from '../src/voicings.js'
import {
  bar4EndsOnA,
  chordEndReport,
  chordPickResult,
  hasPassingLand,
} from '../src/learnChecks.js'
import { noteFromKey } from '../src/keys.js'
import { parsePhrase } from '../src/phrases.js'
import { evaluateLessons, LESSON_FIXTURES } from '../src/lessons.js'
import {
  BOX_FRETS,
  checkLine,
  chordBadge,
  CHORDS,
  finishRhythm,
  hasGap,
  LANDING_PC,
  midiOf,
  moveAnswer,
  moveChangeRhythm,
  moveLeaveSpace,
  moveRepeat,
  moveShift,
  noteName,
  pcOf,
  POSITIONS,
  RHYTHM_PATTERNS,
  resolveLastToA,
  resizeNote,
  spreadNotes,
  withDistinctRhythm,
} from '../src/music.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

function inBox(event) {
  return POSITIONS.some((pos) => pos.string === event.string && pos.fret === event.fret)
}

assert(POSITIONS.length === 6, 'box should have 6 clickable notes')
assert(noteName(midiOf(3, 5)) === 'C', 'G string fret 5 is C')
assert(noteName(midiOf(3, 7)) === 'D', 'G string fret 7 is D')
assert(noteName(midiOf(2, 5)) === 'E', 'B string fret 5 is E')
assert(noteName(midiOf(2, 8)) === 'G', 'B string fret 8 is G')
assert(noteName(midiOf(1, 5)) === 'A', 'high e fret 5 is A')
assert(noteName(midiOf(1, 8)) === 'C', 'high e fret 8 is C')
assert(BOX_FRETS[3].join() === '5,7', 'G string uses 5 and 7')
assert(!BOX_FRETS[4], 'D string is not in the box')
assert(LANDING_PC.Am.join() === '0,4,9', 'Am landings C E A')
assert(LANDING_PC.F.join() === '9,0', 'F landings A C')
assert(LANDING_PC.G.join() === '7,2', 'G landings G D')

const idea = [
  { string: 3, fret: 5, startSlot: 0, lengthSlots: 1, articulation: 'pick' },
  { string: 3, fret: 7, startSlot: 1, lengthSlots: 1, articulation: 'pick' },
  { string: 2, fret: 5, startSlot: 2, lengthSlots: 1, articulation: 'pick' },
]
const repeated = moveRepeat(idea)
assert(repeated.length === 3 && repeated[0].fret === 5, 'repeat copies the idea')
assert(repeated.every(inBox), 'repeat stays in the six notes')

const swung = moveChangeRhythm(idea, 'offbeat')
assert(swung[0].startSlot === 1, 'off-beat pattern starts on slot 1')

const answered = moveAnswer(idea, CHORDS[2])
assert(answered.length === 3, 'answer keeps note count')
assert(answered.every(inBox), 'answer stays in the six notes')
assert(LANDING_PC.G.includes(pcOf(midiOf(answered[2].string, answered[2].fret))), 'answer lands on a G chord tone')

const resolved = resolveLastToA(idea)
assert(resolved[2].string === 1 && resolved[2].fret === 5, 'finish lands on A4')

function sameCount(label, source, next) {
  assert(next.length === source.length, `${label} dropped notes (${next.length} from ${source.length})`)
  assert(next.every(inBox), `${label} left the six-note box`)
}

const three = idea
const four = [
  ...idea,
  { string: 1, fret: 5, startSlot: 3, lengthSlots: 1, articulation: 'pick' },
]
assert(moveChangeRhythm(four, 'long-short').some((event) => event.lengthSlots > 1), 'say-it-again lengths are audible')

for (const source of [three, four]) {
  const copy = moveRepeat(source)
  sameCount('repeat', source, copy)
  source.forEach((event, index) => {
    assert(copy[index].string === event.string && copy[index].fret === event.fret, 'repeat copies pitch')
    assert(copy[index].startSlot === event.startSlot && copy[index].lengthSlots === event.lengthSlots, 'repeat copies rhythm')
  })
  for (const pattern of RHYTHM_PATTERNS) {
    sameCount(`rhythm ${pattern.id}`, source, moveChangeRhythm(source, pattern.id))
  }
  sameCount('answer', source, moveAnswer(source, CHORDS[2]))
  sameCount('shift', source, moveShift(source, 2))
  sameCount('shift down', source, moveShift(source, -2))
  const finish = resolveLastToA(source)
  sameCount('resolve', source, finish)
  const last = finish[finish.length - 1]
  assert(last.string === 1 && last.fret === 5, 'bar 4 last note is A4')
}

const spaced = moveLeaveSpace(four, 1)
assert(spaced.length === 3, 'leave space drops one note')
assert(spaced.every(inBox), 'leave space stays in the six notes')

const answeredRhythm = withDistinctRhythm(moveAnswer(four, CHORDS[2]), [four])
assert(answeredRhythm.length === 4, 'answer keeps all idea notes')
assert(hasGap(answeredRhythm), 'bar 3 includes a rest')

const closed = finishRhythm(resolveLastToA(four))
assert(closed[closed.length - 1].lengthSlots >= 4, 'bar 4 holds A for at least two beats')
assert(closed[closed.length - 1].string === 1 && closed[closed.length - 1].fret === 5, 'held note is A4')
assert(closed.length === 4, 'finish still uses four notes')

const top = [{ string: 1, fret: 8, startSlot: 0, lengthSlots: 1, articulation: 'pick' }]
assert(moveShift(top, 2).every(inBox), 'shift clamps the high C')

const run = ['KeyC', 'KeyD', 'KeyE', 'KeyG', 'KeyA'].map((code) => noteFromKey({ code, shiftKey: false }))
run.push(noteFromKey({ code: 'KeyC', shiftKey: true }))
const runMidi = run.map((pos) => midiOf(pos.string, pos.fret))
assert(runMidi.join() === '60,62,64,67,69,72', 'C D E G A Shift+C should climb C4–C5')

const gBar = [
  { string: 2, fret: 5, startSlot: 0, lengthSlots: 1, articulation: 'pick' },
  { string: 2, fret: 8, startSlot: 4, lengthSlots: 1, articulation: 'pick' },
  { string: 2, fret: 5, startSlot: 6, lengthSlots: 1, articulation: 'pick' },
]
const gCheck = checkLine(2, gBar, 'G')
assert(chordBadge(0) === 'Bar 1: A minor chord (A, C, E)', 'bar 1 chord badge')
assert(chordBadge(1) === 'Bar 2: F chord (A, C)', 'bar 2 chord badge')
assert(chordBadge(2) === 'Bar 3: G chord (G, D)', 'bar 3 chord badge')
assert(chordBadge(3) === 'Bar 4: A minor chord (A, C, E)', 'bar 4 chord badge')

assert(gCheck.startsWith('Bar 3 over G: ends on E, not a chord note. Try G or D.'), 'check names the last note and chord notes')
assert(gCheck.includes('1 of 2 notes on beats 1 and 3 are chord notes'), 'check counts chord notes on beats 1 and 3')

const amHold = [{ string: 1, fret: 5, startSlot: 0, lengthSlots: 4, articulation: 'pick' }]
const amCheck = checkLine(0, amHold, 'Am')
assert(amCheck.includes('ends on A, a chord note'), 'A is a chord note over A minor')
assert(amCheck.includes('The note on beat 1 or 3 is a chord note'), 'single strong beat wording')
assert(!noteFromKey({ code: 'KeyB', shiftKey: false }), 'B is not a note key')
assert(!noteFromKey({ code: 'KeyZ', shiftKey: false }), 'Z is not a note key')

function lessonOf(bars, id) {
  return evaluateLessons(bars).find((item) => item.id === id)
}

const lessonIds = ['home', 'finish', 'repeat', 'rhythm', 'idea', 'silence', 'shape']
for (const id of lessonIds) {
  const yes = lessonOf(LESSON_FIXTURES[`${id}Yes`], id)
  const no = lessonOf(LESSON_FIXTURES[`${id}No`], id)
  assert(yes.status === 'used', `${id} should be used on the yes phrase (got ${yes.status}: ${yes.evidence})`)
  assert(no.status === 'not', `${id} should be not-yet on the no phrase (got ${no.status}: ${no.evidence})`)
}

const homeBefore = JSON.stringify(LESSON_FIXTURES.homeNo)
const homeLesson = lessonOf(LESSON_FIXTURES.homeNo, 'home')
assert(homeLesson.hear?.parts.length === 2, 'home lesson has an A/B when a bar misses a chord note')
homeLesson.hear.parts[1].events[0].fret = 99
assert(JSON.stringify(LESSON_FIXTURES.homeNo) === homeBefore, 'Hear it copies must not change the phrase')

const finishLesson = lessonOf(LESSON_FIXTURES.finishNo, 'finish')
assert(finishLesson.hear?.parts.length === 2, 'finish lesson plays as-is then ending on A')
const repeatLesson = lessonOf(LESSON_FIXTURES.repeatYes, 'repeat')
assert(repeatLesson.hear?.parts.length === 2, 'repeat lesson plays the two matching bars')
const rhythmLesson = lessonOf(LESSON_FIXTURES.rhythmYes, 'rhythm')
assert(rhythmLesson.hear?.parts.length === 2, 'rhythm lesson plays even notes then the chosen rhythm')

const packed = [
  { string: 3, fret: 5, startSlot: 0, lengthSlots: 1, articulation: 'pick' },
  { string: 3, fret: 7, startSlot: 1, lengthSlots: 1, articulation: 'pick' },
  { string: 2, fret: 5, startSlot: 2, lengthSlots: 1, articulation: 'pick' },
  { string: 1, fret: 5, startSlot: 3, lengthSlots: 1, articulation: 'pick' },
]
const spread = spreadNotes(packed)
assert(spread.map((event) => event.startSlot).join() === '0,2,4,6', 'spread puts a note every two blocks')
assert(spread.every((event) => event.lengthSlots === 1), 'spread notes are one block long')

const grown = resizeNote(spread, spread[0])
assert(grown[0].lengthSlots === 2, 'clicking a note grows it into the next empty block')
assert(grown[1].startSlot === 2, 'growing does not move the next note')
const maxed = resizeNote(grown, grown[0])
assert(maxed[0].lengthSlots === 1, 'clicking at full length shortens it back to one block')

const scaleRun = parsePhrase('C4@0×1, D4@1×1, E4@2×1, G4@3×1, A4@4×1, C5@5×3')
assert(scaleRun.length === 6, 'scale run has six notes')
assert(scaleRun[0].string === 3 && scaleRun[0].fret === 5, 'C4 is G string fret 5')
assert(scaleRun[5].startSlot === 5 && scaleRun[5].lengthSlots === 3, 'C5 holds three slots')
assert(parsePhrase('E4@0x2, rest@2x2, A4@4x4').length === 2, 'rests are skipped and x is allowed')

const amPick = [
  { string: 1, fret: 5 },
  { string: 3, fret: 5 },
  { string: 2, fret: 5 },
]
assert(chordPickResult(amPick, ['A', 'C', 'E']).ok, 'A C E is the A minor pick')
assert(!chordPickResult(amPick, ['A', 'C']).ok, 'E is extra on F')
assert(chordPickResult(amPick, ['A', 'C']).extra.join() === 'E', 'extra names the leftover note')

const fourChord = [
  parsePhrase('E4@0×2, A4@2×2, C5@4×4'),
  parsePhrase('C4@0×2, A4@2×2, C5@4×4'),
  parsePhrase('D4@0×4, G4@4×4'),
  parsePhrase('G4@0×1, E4@1×1, G4@2×2, A4@4×4'),
]
assert(chordEndReport(fourChord).ok, 'course examples end on chord notes')
assert(bar4EndsOnA(fourChord), 'finished phrase ends on A')
assert(hasPassingLand(fourChord), 'G then A over A minor is a passing land')
assert(!bar4EndsOnA([[], [], [], parsePhrase('G4@0×1, E4@1×1, G4@2×2, D4@4×4')]), 'D ending is unfinished')

const units = catalog(
  [
    { id: 'l1', title: 'One' },
    { id: 'l3', title: 'Three' },
    { id: 'l4', title: 'Four' },
  ],
  ['l1', 'l3', 'l4'],
)
assert(units.map((item) => item.id).join() === 'l1,l3,l4', 'catalog keeps course order')
assert(isUnlocked(0, {}, units), 'first lesson is unlocked')
assert(!isUnlocked(1, {}, units), 'second lesson starts locked')
assert(isUnlocked(1, { l1: true }, units), 'second lesson unlocks after the first check')
assert(lessonStatus(1, 'l3', {}, units) === 'locked', 'locked status')
assert(lessonStatus(0, 'l1', {}, units) === 'progress', 'unlocked current lesson is in progress')
assert(lessonStatus(0, 'l1', { l1: true }, units) === 'done', 'done status')
assert(doneCount(units, { l1: true }) === 1, 'done count')
assert(continueTarget(units, { done: {}, currentId: null }).id === 'l1', 'continue starts at lesson 1')
assert(continueTarget(units, { done: { l1: true }, currentId: 'l1' }).id === 'l3', 'continue moves to the next unlocked lesson')
const longLearn = splitLearn(
  [
    'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone twentytwo twentythree twentyfour twentyfive twentysix twentyseven twentyeight twentynine thirty thirtyone thirtytwo thirtythree thirtyfour thirtyfive thirtysix thirtyseven thirtyeight thirtynine forty fortyone fortytwo fortythree fortyfour fortyfive fortysix fortyseven fortyeight fortynine fifty fiftyone fiftytwo fiftythree fiftyfour fiftyfive fiftysix fiftyseven fiftyeight fiftynine sixty sixtyone sixtytwo sixtythree sixtyfour sixtyfive sixtysix sixtyseven sixtyeight sixtynine seventy seventyone seventytwo seventythree seventyfour seventyfive seventysix seventyseven seventyeight seventynine eighty eightyone eightytwo eightythree eightyfour eightyfive eightysix eightyseven eightyeight eightynine ninety ninetyone ninetytwo ninetythree ninetyfour ninetyfive ninetysix ninetyseven ninetyeight ninetynine hundred hundredone hundredtwo hundredthree hundredfour hundredfive hundredsix hundredseven hundredeight hundrednine hundredten hundredeleven hundredtwelve hundredthirteen hundredfourteen hundredfifteen hundredsixteen hundredseventeen hundredeighteen hundrednineteen hundredtwenty.',
    'Extra words sit on the next screen.',
  ],
  120,
)
assert(longLearn.length === 2, 'learn text splits around 120 words')

assert(
  SAMPLE_CREDIT ===
    'Guitar samples: tonejs-instruments by Nicholaus Brosowsky (CC BY 3.0), from the University of Iowa Musical Instrument Samples and Karoryfer Samples.',
  'about credits uses the sample README attribution line',
)
assert(ACOUSTIC_FILES.length === 37, 'acoustic set has 37 notes')
assert(sampleFileToToneName('Cs4') === 'C#4', 'Cs4 maps to Tone C#4')
assert(sampleFileToToneName('A2') === 'A2', 'A2 stays A2')
assert(fullName(fullMidi(5, 0)) === 'A', 'open A string is A')
assert(fullName(fullMidi(5, 3)) === 'C', 'A string fret 3 is C')
assert(fullName(fullMidi(6, 5)) === 'A', 'low E fret 5 is A')
assert(fullName(fullMidi(4, 5)) === 'G', 'D string fret 5 is G')
assert(STRUM_GAP >= 0.015 && STRUM_GAP <= 0.02, 'strum gap is 15–20 ms')
assert(MODULE_1.concepts.length === 5, 'module 1 has five concepts')
assert(MODULE_2.concepts.length === 4, 'module 2 has four concepts')
assert(MODULE_3.concepts.length === 3, 'module 3 has three concepts')
assert(MODULE_4.concepts.length === 3, 'module 4 has three concepts')
assert(nextConcept('1.5')?.id === '2.1', '1.5 is followed by 2.1')
assert(nextConcept('4.3')?.id === '5.1', '4.3 is followed by 5.1')
assert(nextConcept('8.4') === null, '8.4 is the last theory concept')
assert(MODULE_5.concepts.length === 3, 'module 5 has three concepts')
assert(MODULE_6.concepts.length === 3, 'module 6 has three concepts')
assert(MODULE_7.concepts.length === 3, 'module 7 has three concepts')
assert(MODULE_8.concepts.length === 4, 'module 8 has four concepts')
assert(MODULE_9_IDS.join() === 'l4,l5,l6,l7,l8,lfinal', 'module 9 uses chord notes through the final challenge')
assert(MODULE_9.title === 'Improvising', 'module 9 title is Improvising')
assert(
  MODULE_9.intro === "You've learned the theory. Now you'll practice using it, one lesson at a time.",
  'module 9 opens with the practice line',
)
assert(
  catalog(LESSONS, MODULE_9_IDS)
    .map((item) => `${item.number} ${item.title}`)
    .join('|') ===
    '9.1 Chord notes|9.2 Passing notes and landing|9.3 One idea, four bars|9.4 Rhythm and space|9.5 The blue note in a phrase|9.6 Final challenge',
  'module 9 lessons are numbered 9.1–9.6',
)
assert(!LESSONS.some((item) => item.id === 'l1' || item.id === 'l3'), 'key/scale/chord lessons are not in module 9')
assert(MODULE_10.items.length === 5, 'module 10 lists five next steps')
assert(parsePhrase('D4@0×1, E♭4@1×1, E4@2×6').length === 3, 'blue-note example parses')
assert(VOICINGS.C.length === 5, 'C voicing skips the low E string')
assert(fullName(fullMidi(5, 3)) === 'C' && fullName(fullMidi(4, 2)) === 'E', 'C chord notes start C E')
assert(diagnosePath(MODULE_2.concepts[0], 'Not sure', '3').skipExplain, '2.1 follow-up 3 skips explain')
assert(verifyOutcome(MODULE_3.concepts[0].verify[0], 'Because the half steps in the pattern fall on E to F and B to C, which are already half steps') === 'success', '3.1 V1 has no Why block')
assert(buildLearningReport(MODULE_2, {}).early, 'empty module report is early')
assert(diagnosePath(MODULE_1.concepts[0], '12').skipExplain, '12 skips the explanation')
assert(diagnosePath(MODULE_1.concepts[0], '7').gap === 'letters-only', '7 maps to letters-only')
assert(diagnosePath(MODULE_1.concepts[0], 'Not sure').stage === 'followup', 'Not sure opens the follow-up')
assert(
  verifyOutcome(MODULE_1.concepts[0].verify[0], 'E and F', 'E and F (and B and C) sit right next to each other in the musical alphabet') ===
    'success',
  'right answer and reason is success',
)

const c11 = MODULE_1.concepts[0]
const knewWhy = 'E and F (and B and C) sit right next to each other in the musical alphabet'
assert(
  continueSummary(c11, {
    diagnoseAnswer: '12',
    verifies: [{ result: 'success', answer: 'E and F', reason: knewWhy }],
    status: 'learned',
  }) === `You already knew this. You picked 12 and explained why ${knewWhy}.`,
  'continue summary when diagnose and first verify succeed',
)
assert(
  continueSummary(c11, {
    diagnoseAnswer: '7',
    verifies: [{ result: 'success', answer: 'E and F', reason: knewWhy }],
    status: 'learned',
  }) === 'At first you picked 7. After the explanation, you answered E and F and explained why.',
  'continue summary after a wrong diagnose then a pass',
)
assert(
  continueSummary(c11, {
    diagnoseAnswer: 'Not sure',
    verifies: [{ result: 'success', answer: 'E and F', reason: knewWhy }],
    status: 'learned',
  }).startsWith('At first you picked Not sure.'),
  'continue summary after Not sure then a pass',
)
assert(
  continueSummary(c11, {
    diagnoseAnswer: '12',
    verifies: [
      { result: 'right-wrong-reason', answer: 'E and F', reason: 'Notes after E are always sharps' },
      { result: 'success', answer: 'E and F', reason: knewWhy },
    ],
    status: 'learned',
  }) === "You picked the right answer, and your second reason showed why it's right.",
  'continue summary after a right answer with a second reason',
)
assert(
  continueSummary(c11, {
    diagnoseAnswer: '7',
    verifies: [{ result: 'wrong', answer: 'C and D', reason: null }],
    status: 'not-yet',
  }) === "This one was shown to you, so it's marked 'not yet shown'. Try Revisit later.",
  'continue summary after Show me and continue',
)
assert(
  buildLearningReport(MODULE_1, {
    '1.1': {
      diagnoseAnswer: '12',
      verifies: [{ result: 'success', answer: 'E and F', reason: knewWhy }],
      status: 'learned',
    },
  }).whereStarted[0].includes('You already knew this'),
  'report where-you-started uses the continue summary',
)

console.log('music checks passed')
