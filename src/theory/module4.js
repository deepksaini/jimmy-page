import { chordNotes } from '../voicings.js'

const BDIM = [
  { string: 4, fret: 3 },
  { string: 3, fret: 4 },
  { string: 2, fret: 3 },
]

const C_SEVEN = [
  { chord: 'C' },
  { chord: 'Dm' },
  { chord: 'Em' },
  { chord: 'F' },
  { chord: 'G' },
  { chord: 'Am' },
  { positions: BDIM },
]

export const MODULE_4 = {
  id: 'm4',
  number: 4,
  title: 'Chords',
  status: 'full',
  concepts: [
    {
      id: '4.1',
      name: 'What a chord is',
      chips: ['Fact'],
      diagnose: {
        prompt: 'What is a chord?',
        options: [
          { text: 'Three or more notes played together', correct: true },
          { text: 'Two notes played one after the other', gap: 'melody-vs-chord' },
          { text: 'One loud note', gap: 'melody-vs-chord' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'A chord is several notes sounding together. Notes one after another make a melody. The basic chord, a triad, uses notes 1, 3 and 5 of a scale, which is every other note. The C major chord is C, E, G.',
        'melody-vs-chord':
          'A chord is several notes sounding together. Notes one after another make a melody. The basic chord, a triad, uses notes 1, 3 and 5 of a scale, which is every other note. The C major chord is C, E, G.',
      },
      hear: {
        caption: 'Strum an open C chord (C3, E3, G3, C4, E4). Then play its notes one at a time.',
        labelMode: 'names',
        highlighted: chordNotes('C'),
        play: {
          script: [
            { mode: 'strum', chord: 'C', hold: 1.1, pause: 0.3 },
            { mode: 'seq', gap: 0.32, chord: 'C' },
          ],
        },
      },
      verify: [
        {
          prompt: 'Which notes make a G major chord?',
          options: [
            { text: 'G B D', correct: true },
            { text: 'G A B' },
            { text: 'G C D' },
          ],
          why: [
            { text: 'Take every other note of G major, starting from G: G, B, D', correct: true },
            { text: 'Take the first three notes of the scale' },
          ],
          fix: 'Not yet. Take every other note of G major, starting from G: G, B, D.',
        },
        {
          prompt: 'The open C chord has five strings playing. How many different note names does it have?',
          options: [{ text: '5' }, { text: '3', correct: true }, { text: '2' }],
          why: [
            { text: 'It only uses C, E and G. Some are repeated in another octave', correct: true },
            { text: 'Every string plays a different note' },
          ],
          fix: 'Not yet. It only uses C, E and G. Some are repeated in another octave.',
        },
      ],
      remember: 'A triad is notes 1, 3 and 5 of a scale.',
    },
    {
      id: '4.2',
      name: 'Major and minor chords',
      chips: ['Fact', 'Common guideline'],
      diagnose: {
        hearFirst: true,
        prompt: 'Which one is the minor chord?',
        hear: {
          caption: 'Strum C major (C, E, G), then C minor (C, E♭, G).',
          labelMode: 'names',
          highlighted: [...chordNotes('C'), ...chordNotes('Cm')],
          play: {
            script: [
              { mode: 'strum', chord: 'C', hold: 1.05, pause: 0.35 },
              { mode: 'strum', chord: 'Cm', hold: 1.05 },
            ],
          },
        },
        options: [
          { text: 'The first', gap: 'no-ear-yet' },
          { text: 'The second', correct: true },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Both chords have a root and a fifth (7 half steps apart). The difference is the middle note. A major chord stacks a major third (4 half steps) then a minor third (3): C, E, G. A minor chord stacks a minor third (3) then a major third (4): C, E♭, G. Only the middle note moves, by one half step.',
        'no-ear-yet':
          'Both chords have a root and a fifth (7 half steps apart). The difference is the middle note. A major chord stacks a major third (4 half steps) then a minor third (3): C, E, G. A minor chord stacks a minor third (3) then a major third (4): C, E♭, G. Only the middle note moves, by one half step.',
      },
      hear: {
        caption: 'Strum both chords again, highlighting the moving note E to E♭.',
        labelMode: 'names',
        highlighted: [
          { string: 4, fret: 2 },
          { string: 2, fret: 4 },
        ],
        play: {
          script: [
            { mode: 'strum', chord: 'C', hold: 1.05, pause: 0.35 },
            { mode: 'strum', chord: 'Cm', hold: 1.05 },
          ],
        },
      },
      verify: [
        {
          prompt: 'Is A, C, E a major or minor chord?',
          options: [{ text: 'Major' }, { text: 'Minor', correct: true }],
          why: [
            { text: 'A to C is 3 half steps, so the bottom third is minor', correct: true },
            { text: "All the notes are natural, so it's minor" },
          ],
          fix: 'Not yet. A to C is 3 half steps, so the bottom third is minor.',
        },
        {
          prompt: 'E major is E, G♯, B. To make E minor, which note changes?',
          options: [
            { text: 'E' },
            { text: 'G♯ becomes G', correct: true },
            { text: 'B becomes B♭' },
          ],
          why: [
            { text: 'The middle note drops one half step to make the bottom third minor', correct: true },
            { text: 'The top note always changes in a minor chord' },
          ],
          fix: 'Not yet. The middle note drops one half step to make the bottom third minor.',
        },
        {
          prompt: 'Is D, F♯, A major or minor?',
          options: [{ text: 'Major', correct: true }, { text: 'Minor' }],
          why: [
            { text: 'D to F♯ is 4 half steps, a major third', correct: true },
            { text: "It has a sharp, so it's minor" },
          ],
          fix: 'Not yet. D to F♯ is 4 half steps, a major third.',
        },
      ],
      remember: 'Major = 4 half steps, then 3. Minor = 3 half steps, then 4.',
    },
    {
      id: '4.3',
      name: 'The chords that belong to a key',
      chips: ['Fact'],
      diagnose: {
        prompt: 'Which of these chords belongs to the key of C major (notes C D E F G A B)?',
        options: [
          { text: 'D major (D, F♯, A)', gap: 'outside-notes' },
          { text: 'D minor (D, F, A)', correct: true },
          { text: 'E major (E, G♯, B)', gap: 'outside-notes' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Build a triad on every note of the scale, using only notes from that scale. In C major: C E G (C), D F A (D minor), E G B (E minor), F A C (F), G B D (G), A C E (A minor), B D F (B diminished, two minor thirds stacked). Every major key follows the same pattern: I ii iii IV V vi vii°. Uppercase means major, lowercase means minor, and ° means diminished. D major needs F♯, which isn\'t in C major, so it doesn\'t belong.',
        'outside-notes':
          'Build a triad on every note of the scale, using only notes from that scale. In C major: C E G (C), D F A (D minor), E G B (E minor), F A C (F), G B D (G), A C E (A minor), B D F (B diminished, two minor thirds stacked). Every major key follows the same pattern: I ii iii IV V vi vii°. Uppercase means major, lowercase means minor, and ° means diminished. D major needs F♯, which isn\'t in C major, so it doesn\'t belong.',
      },
      hear: {
        caption: 'Strum the seven chords of C major in order.',
        labelMode: 'names',
        highlighted: [
          ...chordNotes('C'),
          ...chordNotes('Dm'),
          ...chordNotes('Em'),
          ...chordNotes('F'),
          ...chordNotes('G'),
          ...chordNotes('Am'),
          ...BDIM,
        ],
        play: {
          script: C_SEVEN.map((step) => ({
            mode: 'strum',
            hold: 0.95,
            pause: 0.22,
            ...step,
          })),
        },
      },
      verify: [
        {
          prompt: 'In C major, what is chord V?',
          options: [
            { text: 'G major', correct: true },
            { text: 'G minor' },
            { text: 'F major' },
          ],
          why: [
            { text: 'The 5th note is G, and in the pattern V is uppercase, so it\'s major', correct: true },
            { text: 'V means five letters after C' },
          ],
          fix: 'Not yet. The 5th note is G, and in the pattern V is uppercase, so it\'s major.',
        },
        {
          prompt: 'In G major (G A B C D E F♯), what is chord vi?',
          options: [
            { text: 'E major' },
            { text: 'E minor', correct: true },
            { text: 'D major' },
          ],
          why: [
            { text: 'The 6th note is E, and vi is lowercase, so it\'s minor: E, G, B', correct: true },
            { text: 'vi is always A minor' },
          ],
          fix: 'Not yet. The 6th note is E, and vi is lowercase, so it\'s minor: E, G, B.',
        },
      ],
      remember: 'Every major key: I ii iii IV V vi vii°.',
    },
  ],
}
