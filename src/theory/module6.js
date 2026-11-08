const C_MAJOR = [
  { string: 5, fret: 3 },
  { string: 5, fret: 5 },
  { string: 5, fret: 7 },
  { string: 4, fret: 3 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
  { string: 3, fret: 4 },
  { string: 3, fret: 5 },
]

const A_MINOR = [
  { string: 5, fret: 0 },
  { string: 5, fret: 2 },
  { string: 5, fret: 3 },
  { string: 5, fret: 5 },
  { string: 5, fret: 7 },
  { string: 5, fret: 8 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
]

export const MODULE_6 = {
  id: 'm6',
  number: 6,
  title: 'Minor keys',
  status: 'full',
  concepts: [
    {
      id: '6.1',
      name: 'The relative minor',
      chips: ['Fact'],
      diagnose: {
        prompt: 'Do C major and A minor use the same notes?',
        options: [
          { text: 'Yes', correct: true },
          { text: 'No', gap: 'different-notes' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          "Play the C major scale but start and end on its 6th note, A: A B C D E F G A. That's A natural minor. It has exactly the same notes as C major. Only the home changes, from C to A, and that makes it sound darker. A minor is called the relative minor of C major. Every major key has one, starting on its 6th note, which is 3 half steps below the major key's home.",
        'different-notes':
          "Play the C major scale but start and end on its 6th note, A: A B C D E F G A. That's A natural minor. It has exactly the same notes as C major. Only the home changes, from C to A, and that makes it sound darker. A minor is called the relative minor of C major. Every major key has one, starting on its 6th note, which is 3 half steps below the major key's home.",
      },
      hear: {
        caption: 'Play the notes C to C over a C chord, then A to A over an Am chord.',
        labelMode: 'names',
        highlighted: [...C_MAJOR, ...A_MINOR],
        play: {
          script: [
            { mode: 'strum', chord: 'C', hold: 1, pause: 0.08 },
            { mode: 'seq', gap: 0.24, positions: C_MAJOR, pause: 0.35 },
            { mode: 'strum', chord: 'Am', hold: 1, pause: 0.08 },
            { mode: 'seq', gap: 0.24, positions: A_MINOR },
          ],
        },
      },
      verify: [
        {
          prompt: 'What is the relative minor of G major (G A B C D E F♯)?',
          options: [{ text: 'E minor', correct: true }, { text: 'A minor' }, { text: 'D minor' }],
          why: [
            { text: 'The 6th note of G major is E', correct: true },
            { text: 'The relative minor of every major key is A minor' },
          ],
          fix: 'Not yet. The 6th note of G major is E.',
        },
        {
          prompt: 'What is the relative minor of D major (D E F♯ G A B C♯)?',
          options: [{ text: 'B minor', correct: true }, { text: 'A minor' }, { text: 'F♯ minor' }],
          why: [
            { text: 'B is the 6th note of D major, 3 half steps below D', correct: true },
            { text: 'Take the next letter after D' },
          ],
          fix: 'Not yet. B is the 6th note of D major, 3 half steps below D.',
        },
      ],
      remember: 'Same notes, different home. The relative minor starts on the 6th note.',
    },
    {
      id: '6.2',
      name: 'The natural minor pattern',
      chips: ['Fact'],
      diagnose: {
        prompt: 'In A natural minor, what is the 3rd note?',
        options: [
          { text: 'C', correct: true },
          { text: 'C♯', gap: 'major-pattern' },
          { text: 'B', gap: 'miscount' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'The natural minor scale has its own step pattern: W H W W H W W. From A: A (W) B (H) C (W) D (W) E (H) F (W) G (W) A. The 3rd note is a half step plus a whole step above the 2nd, giving C. A minor third (3 half steps) from home is what makes it sound minor. C♯ would be a major third, the major pattern from Module 3.',
        'major-pattern':
          'The natural minor scale has its own step pattern: W H W W H W W. From A: A (W) B (H) C (W) D (W) E (H) F (W) G (W) A. The 3rd note is a half step plus a whole step above the 2nd, giving C. A minor third (3 half steps) from home is what makes it sound minor. C♯ would be a major third, the major pattern from Module 3.',
        miscount:
          'The natural minor scale has its own step pattern: W H W W H W W. From A: A (W) B (H) C (W) D (W) E (H) F (W) G (W) A. The 3rd note is a half step plus a whole step above the 2nd, giving C. A minor third (3 half steps) from home is what makes it sound minor. C♯ would be a major third, the major pattern from Module 3.',
      },
      hear: {
        caption: 'Play A natural minor with each step labeled W or H.',
        labelMode: 'names',
        highlighted: A_MINOR,
        play: { mode: 'seq', gap: 0.28, positions: A_MINOR },
      },
      verify: [
        {
          prompt: 'What are the notes of E natural minor?',
          options: [
            { text: 'E F♯ G A B C D', correct: true },
            { text: 'E F♯ G♯ A B C♯ D♯' },
            { text: 'E F G A B C D' },
          ],
          why: [
            { text: 'Following W H W W H W W from E lands on F♯ as the only sharp', correct: true },
            { text: "E minor always copies E major's notes" },
          ],
          fix: 'Not yet. Following W H W W H W W from E lands on F♯ as the only sharp.',
        },
        {
          prompt: 'In natural minor, the step between notes 2 and 3 is a...',
          options: [{ text: 'Half step', correct: true }, { text: 'Whole step' }],
          why: [
            { text: 'The pattern is W H W W H W W, and the H comes second', correct: true },
            { text: 'Every step in a minor scale is a half step' },
          ],
          fix: 'Not yet. The pattern is W H W W H W W, and the H comes second.',
        },
      ],
      remember: 'Natural minor = W H W W H W W.',
    },
    {
      id: '6.3',
      name: 'Chords in a minor key',
      chips: ['Fact'],
      diagnose: {
        prompt: 'In the key of A minor, chord i is...',
        options: [
          { text: 'A minor', correct: true },
          { text: 'A major', gap: 'case' },
          { text: 'C major', gap: 'relative-home' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Build triads on the natural minor scale the same way as in Module 4. In A minor you get Am, B diminished, C, Dm, Em, F, G. The pattern for every minor key is i ii° III iv v VI VII. Lowercase means minor, uppercase means major. The home chord, i, is minor. Common minor progressions are i–VI–VII (Am–F–G) and i–iv–v (Am–Dm–Em).',
        case:
          'Build triads on the natural minor scale the same way as in Module 4. In A minor you get Am, B diminished, C, Dm, Em, F, G. The pattern for every minor key is i ii° III iv v VI VII. Lowercase means minor, uppercase means major. The home chord, i, is minor. Common minor progressions are i–VI–VII (Am–F–G) and i–iv–v (Am–Dm–Em).',
        'relative-home':
          'Build triads on the natural minor scale the same way as in Module 4. In A minor you get Am, B diminished, C, Dm, Em, F, G. The pattern for every minor key is i ii° III iv v VI VII. Lowercase means minor, uppercase means major. The home chord, i, is minor. Common minor progressions are i–VI–VII (Am–F–G) and i–iv–v (Am–Dm–Em).',
      },
      hear: {
        caption: 'Strum Am, F, G, Am. Then Am, Dm, Em, Am.',
        labelMode: 'names',
        highlighted: [],
        play: {
          script: [
            { mode: 'strum', chord: 'Am', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'F', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'G', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'Am', hold: 1.15, pause: 0.4 },
            { mode: 'strum', chord: 'Am', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'Dm', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'Em', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'Am', hold: 1.15 },
          ],
        },
      },
      verify: [
        {
          prompt: 'In A minor, what is chord VI?',
          options: [{ text: 'F', correct: true }, { text: 'Dm' }, { text: 'G' }],
          why: [
            { text: "The 6th note of A minor is F, and VI is uppercase, so it's F major", correct: true },
            { text: 'VI is six letters after A' },
          ],
          fix: "Not yet. The 6th note of A minor is F, and VI is uppercase, so it's F major.",
        },
        {
          prompt: 'Am, F, G is which progression?',
          options: [
            { text: 'i–VI–VII', correct: true },
            { text: 'i–IV–V' },
            { text: 'vi–IV–V' },
          ],
          why: [
            { text: 'In A minor, Am is i, F is VI and G is VII', correct: true },
            { text: 'Every three-chord progression is i–IV–V' },
          ],
          fix: 'Not yet. In A minor, Am is i, F is VI and G is VII.',
        },
        {
          prompt: 'In E minor (E F♯ G A B C D), what is chord iv?',
          options: [{ text: 'A minor', correct: true }, { text: 'A major' }, { text: 'D major' }],
          why: [
            { text: "The 4th note is A, and iv is lowercase, so it's A minor (A, C, E)", correct: true },
            { text: 'iv is always D minor' },
          ],
          fix: "Not yet. The 4th note is A, and iv is lowercase, so it's A minor (A, C, E).",
        },
      ],
      remember: 'Minor keys: i ii° III iv v VI VII. Am–F–G is i–VI–VII.',
    },
  ],
}
