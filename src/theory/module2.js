import { chordNotes } from '../voicings.js'

const C3 = { string: 5, fret: 3 }
const E3 = { string: 5, fret: 7 }
const Eb3 = { string: 5, fret: 6 }
const A_POWER = [
  { string: 6, fret: 5 },
  { string: 5, fret: 7 },
]
const A_TENSE = [
  { string: 6, fret: 5 },
  { string: 6, fret: 6 },
]
const B3 = { string: 2, fret: 0 }
const C4 = { string: 2, fret: 1 }
const A3 = { string: 3, fret: 2 }

const INTERVAL_TABLE = [
  { steps: '1', name: 'minor 2nd' },
  { steps: '2', name: 'major 2nd' },
  { steps: '3', name: 'minor 3rd' },
  { steps: '4', name: 'major 3rd' },
  { steps: '5', name: 'perfect 4th' },
  { steps: '6', name: 'tritone' },
  { steps: '7', name: 'perfect 5th' },
  { steps: '8', name: 'minor 6th' },
  { steps: '9', name: 'major 6th' },
  { steps: '10', name: 'minor 7th' },
  { steps: '11', name: 'major 7th' },
  { steps: '12', name: 'octave' },
]

export const MODULE_2 = {
  id: 'm2',
  number: 2,
  title: 'Intervals, the distance between notes',
  status: 'full',
  concepts: [
    {
      id: '2.1',
      name: 'What an interval is',
      chips: ['Fact'],
      diagnose: {
        prompt: 'How many half steps is it from C up to E?',
        options: [
          { text: '2', gap: 'counting-letters' },
          { text: '4', correct: true },
          { text: '5', gap: 'counting-both-ends' },
          { text: 'Not sure', notSure: true },
        ],
      },
      followUp: {
        prompt: 'Count with me: C to C♯ is one half step. How many more to reach E?',
        options: [
          { text: '2', explain: 'counting-letters' },
          { text: '3', correct: true },
          { text: 'Not sure', explain: 'default' },
        ],
      },
      explain: {
        default:
          'An interval is the distance between two notes, counted in half steps (frets). Letters hide the notes in between, so count every one: C to C♯ (1), D (2), D♯ (3), E (4). C to E is 4 half steps, which is 4 frets.',
        'counting-letters':
          'An interval is the distance between two notes, counted in half steps (frets). Letters hide the notes in between, so count every one: C to C♯ (1), D (2), D♯ (3), E (4). C to E is 4 half steps, which is 4 frets.',
        'counting-both-ends':
          "Count the moves, not the notes. C to C♯ is one move. You don't count the C you started on. C, C♯, D, D♯, E is 4 moves.",
        table: INTERVAL_TABLE,
        tableCaption: 'Half steps / Name',
      },
      hear: {
        caption: 'A string fret 3 (C3), then fret 7 (E3), showing the 4 frets between.',
        labelMode: 'names',
        highlighted: [C3, E3],
        play: { mode: 'seq', gap: 0.4, positions: [C3, E3] },
      },
      verify: [
        {
          prompt: 'How many half steps from A up to C?',
          options: [{ text: '2' }, { text: '3', correct: true }, { text: '4' }],
          why: [
            { text: 'A♯ (1), B (2), C (3)', correct: true },
            { text: 'A, B, C is three letters' },
          ],
          fix: 'Not yet. A♯ (1), B (2), C (3).',
        },
        {
          prompt: 'How many half steps from G up to D?',
          options: [{ text: '5' }, { text: '7', correct: true }, { text: '8' }],
          why: [
            { text: 'G♯, A, A♯, B, C, C♯, D is 7 moves', correct: true },
            { text: 'G to D is four letters, and each letter is two half steps' },
          ],
          fix: 'Not yet. G♯, A, A♯, B, C, C♯, D is 7 moves.',
        },
      ],
      remember: 'An interval is the distance between two notes, counted in half steps.',
    },
    {
      id: '2.2',
      name: 'Major and minor thirds',
      chips: ['Fact', 'Common guideline'],
      diagnose: {
        hearFirst: true,
        prompt: 'Which pair sounds darker or sadder?',
        hear: {
          caption: 'Two pairs: C3 then E3, and C3 then E♭3.',
          labelMode: 'names',
          highlighted: [C3, E3, Eb3],
          play: {
            script: [
              { mode: 'seq', gap: 0.35, positions: [C3, E3], pause: 0.35 },
              { mode: 'seq', gap: 0.35, positions: [C3, Eb3] },
            ],
          },
        },
        options: [
          { text: 'The first (C to E)', gap: 'no-ear-yet' },
          { text: 'The second (C to E♭)', correct: true },
          { text: 'They sound the same', gap: 'no-ear-yet' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'A major third is 4 half steps (C to E). It sounds bright. A minor third is 3 half steps (C to E♭). It sounds darker. That single half step is the main difference between major and minor sounds. Listen again and focus on the second note.',
        'no-ear-yet':
          'A major third is 4 half steps (C to E). It sounds bright. A minor third is 3 half steps (C to E♭). It sounds darker. That single half step is the main difference between major and minor sounds. Listen again and focus on the second note.',
      },
      hear: {
        caption: 'Replay both pairs, then play each pair together.',
        labelMode: 'names',
        highlighted: [C3, E3, Eb3],
        play: {
          script: [
            { mode: 'seq', gap: 0.32, positions: [C3, E3], pause: 0.28 },
            { mode: 'seq', gap: 0.32, positions: [C3, Eb3], pause: 0.35 },
            { mode: 'together', positions: [C3, E3], hold: 0.9, pause: 0.3 },
            { mode: 'together', positions: [C3, Eb3], hold: 0.9 },
          ],
        },
      },
      verify: [
        {
          prompt: 'Is A to C a major or minor third?',
          options: [{ text: 'Major' }, { text: 'Minor', correct: true }],
          why: [
            { text: 'A to C is 3 half steps', correct: true },
            { text: 'A is a minor note' },
          ],
          fix: 'Not yet. A to C is 3 half steps.',
        },
        {
          prompt: 'Is G to B a major or minor third?',
          options: [{ text: 'Major', correct: true }, { text: 'Minor' }],
          why: [
            { text: 'G to B is 4 half steps', correct: true },
            { text: "B is a natural note, so it's major" },
          ],
          fix: 'Not yet. G to B is 4 half steps.',
        },
        {
          prompt: 'Is D to F a major or minor third?',
          options: [{ text: 'Major' }, { text: 'Minor', correct: true }],
          why: [
            { text: 'D♯, E, F is 3 half steps', correct: true },
            { text: "F is lower than F♯, so it's major" },
          ],
          fix: 'Not yet. D♯, E, F is 3 half steps.',
        },
      ],
      remember: '4 half steps = major third (bright). 3 half steps = minor third (darker).',
    },
    {
      id: '2.3',
      name: 'The perfect fifth',
      chips: ['Fact', 'Common guideline'],
      diagnose: {
        hearFirst: true,
        prompt: 'Does this sound stable or tense?',
        hear: {
          caption: 'A2 and E3 together (low E string fret 5 plus A string fret 7).',
          labelMode: 'names',
          highlighted: A_POWER,
          play: { mode: 'together', positions: A_POWER, hold: 1.1 },
        },
        options: [
          { text: 'Stable', correct: true },
          { text: 'Tense', gap: 'hearing' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'A to E is 7 half steps, a perfect fifth. It\'s one of the most stable, open-sounding intervals. Rock guitarists use it as the "power chord": low E string fret 5 (A) with A string fret 7 (E). Most players hear it as strong and settled, while the notes very close together (1 half step apart) sound tense.',
        hearing:
          'A to E is 7 half steps, a perfect fifth. It\'s one of the most stable, open-sounding intervals. Rock guitarists use it as the "power chord": low E string fret 5 (A) with A string fret 7 (E). Most players hear it as strong and settled, while the notes very close together (1 half step apart) sound tense.',
      },
      hear: {
        caption: 'Play the power chord, then A2 with A♯2 (1 half step) for contrast.',
        labelMode: 'names',
        highlighted: [...A_POWER, { string: 6, fret: 6 }],
        play: {
          script: [
            { mode: 'strum', positions: A_POWER, hold: 1, pause: 0.35 },
            { mode: 'together', positions: A_TENSE, hold: 1 },
          ],
        },
      },
      verify: [
        {
          prompt: 'Is C to G a perfect fifth?',
          options: [{ text: 'Yes', correct: true }, { text: 'No' }],
          why: [
            { text: 'C to G is 7 half steps', correct: true },
            { text: 'C and G are both natural notes' },
          ],
          fix: 'Not yet. C to G is 7 half steps.',
        },
        {
          prompt: 'Which note is a perfect fifth above E?',
          options: [{ text: 'A' }, { text: 'B', correct: true }, { text: 'C' }],
          why: [
            { text: 'E up 7 half steps: F, F♯, G, G♯, A, A♯, B', correct: true },
            { text: 'B is five letters after E' },
          ],
          fix: 'Not yet. E up 7 half steps: F, F♯, G, G♯, A, A♯, B.',
        },
      ],
      remember: '7 half steps = perfect fifth. Strong and stable.',
    },
    {
      id: '2.4',
      name: 'Tension and release',
      chips: ['Common guideline'],
      diagnose: {
        hearFirst: true,
        prompt: 'Which move sounds more like an ending?',
        hear: {
          caption: 'A C major chord, then B3 moving to C4, then B3 moving to A3.',
          labelMode: 'names',
          highlighted: [...chordNotes('C'), B3, C4, A3],
          play: {
            script: [
              { mode: 'strum', chord: 'C', hold: 0.85, pause: 0.2 },
              { mode: 'seq', gap: 0.32, positions: [B3, C4], pause: 0.35 },
              { mode: 'strum', chord: 'C', hold: 0.7, pause: 0.2 },
              { mode: 'seq', gap: 0.32, positions: [B3, A3] },
            ],
          },
        },
        options: [
          { text: 'B to C', correct: true },
          { text: 'B to A', gap: 'no-pull-yet' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Some notes create tension: the ear expects them to move. Notes one half step away from a stable note pull strongly toward it. B is one half step below C, so over a C chord, B moving up to C sounds like arriving. That\'s release. Music feels alive because it moves between tension and release.',
        'no-pull-yet':
          'Some notes create tension: the ear expects them to move. Notes one half step away from a stable note pull strongly toward it. B is one half step below C, so over a C chord, B moving up to C sounds like arriving. That\'s release. Music feels alive because it moves between tension and release.',
      },
      hear: {
        caption: 'Replay both, with the C chord underneath.',
        labelMode: 'names',
        highlighted: [...chordNotes('C'), B3, C4, A3],
        play: {
          script: [
            { mode: 'strum', chord: 'C', hold: 1.1, pause: 0.05 },
            { mode: 'seq', gap: 0.4, positions: [B3, C4], pause: 0.35 },
            { mode: 'strum', chord: 'C', hold: 1.1, pause: 0.05 },
            { mode: 'seq', gap: 0.4, positions: [B3, A3] },
          ],
        },
      },
      verify: [
        {
          prompt: 'Over a C chord, which note pulls most strongly to C?',
          options: [{ text: 'G' }, { text: 'E' }, { text: 'B', correct: true }],
          why: [
            { text: 'B is one half step below C', correct: true },
            { text: 'B is the last letter, so it goes back to the start' },
          ],
          fix: 'Not yet. B is one half step below C.',
        },
        {
          prompt: 'Over an A minor chord, which note sounds like it wants to move: A, E, or D?',
          options: [{ text: 'A' }, { text: 'E' }, { text: 'D', correct: true }],
          why: [
            { text: "D isn't in the A minor chord (A, C, E), so it wants to move to C or E", correct: true },
            { text: 'D is the lowest note' },
          ],
          fix: "Not yet. D isn't in the A minor chord (A, C, E), so it wants to move to C or E.",
        },
      ],
      remember: 'Tension wants to move. Release is landing on a stable note.',
    },
  ],
}
