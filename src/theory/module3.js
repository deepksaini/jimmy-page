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

const G_MAJOR = [
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
  { string: 3, fret: 4 },
  { string: 3, fret: 5 },
  { string: 3, fret: 7 },
  { string: 2, fret: 5 },
  { string: 2, fret: 7 },
  { string: 1, fret: 3 },
]

export const MODULE_3 = {
  id: 'm3',
  number: 3,
  title: 'The major scale',
  status: 'full',
  concepts: [
    {
      id: '3.1',
      name: 'The major scale pattern',
      chips: ['Fact'],
      diagnose: {
        prompt: 'Which notes make up the C major scale?',
        options: [
          { text: 'C D E F G A B', correct: true },
          { text: 'C D E F♯ G A B', gap: 'random-sharps' },
          { text: 'C D E G A', gap: 'pentatonic-mixup' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'A major scale follows one step pattern: Whole, Whole, Half, Whole, Whole, Whole, Half (W W H W W W H). From C that gives C (W) D (W) E (H) F (W) G (W) A (W) B (H) C. The two half steps land exactly on E to F and B to C, where there\'s no note in between. That\'s why C major has no sharps or flats.',
        'random-sharps':
          'A major scale follows one step pattern: Whole, Whole, Half, Whole, Whole, Whole, Half (W W H W W W H). From C that gives C (W) D (W) E (H) F (W) G (W) A (W) B (H) C. The two half steps land exactly on E to F and B to C, where there\'s no note in between. That\'s why C major has no sharps or flats.',
        'pentatonic-mixup':
          'C D E G A is a five-note scale (the pentatonic, Module 8). The full major scale has seven notes: C D E F G A B. It follows the pattern W W H W W W H.',
      },
      hear: {
        caption: 'Play C3 up to C4 along the A, D and G strings, labeling each step W or H.',
        labelMode: 'names',
        highlighted: C_MAJOR,
        play: { mode: 'seq', gap: 0.28, positions: C_MAJOR },
      },
      verify: [
        {
          prompt: 'Why does C major have no sharps or flats?',
          options: [
            { text: 'Because the half steps in the pattern fall on E to F and B to C, which are already half steps', correct: true },
            { text: 'Because C is the first letter' },
            { text: 'Because no major scale has sharps' },
          ],
        },
        {
          prompt: 'In the pattern W W H W W W H, where are the two half steps?',
          options: [
            { text: 'Between notes 3 and 4, and between 7 and 8', correct: true },
            { text: 'Between notes 1 and 2, and between 4 and 5' },
            { text: "There's only one" },
          ],
          why: [
            { text: 'In C major these are E to F and B to C', correct: true },
            { text: 'The half steps come at the start of each half of the scale' },
          ],
          fix: 'Not yet. In C major these are E to F and B to C.',
        },
      ],
      remember: 'Major scale = W W H W W W H.',
    },
    {
      id: '3.2',
      name: 'Building a major scale on any note',
      chips: ['Fact'],
      diagnose: {
        prompt: 'Build G major with W W H W W W H. What is the 7th note?',
        options: [
          { text: 'F', gap: 'naturals-only' },
          { text: 'F♯', correct: true },
          { text: 'E', gap: 'miscount' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Start on G and follow the pattern: G (W) A (W) B (H) C (W) D (W) E (W) F♯ (H) G. From E, a whole step lands on F♯, not F. That\'s why the key of G has one sharp. Each letter is used once in a scale, which is why we write B♭ in F major and not A♯.',
        'naturals-only':
          'Start on G and follow the pattern: G (W) A (W) B (H) C (W) D (W) E (W) F♯ (H) G. From E, a whole step lands on F♯, not F. That\'s why the key of G has one sharp. Each letter is used once in a scale, which is why we write B♭ in F major and not A♯.',
        miscount:
          'Count again: G is 1, A is 2, B is 3, C is 4, D is 5, E is 6. The 7th is a whole step above E, which is F♯.',
      },
      hear: {
        caption: 'Play G major from G3 on the low strings, with F♯ highlighted.',
        labelMode: 'names',
        highlighted: G_MAJOR,
        play: { mode: 'seq', gap: 0.28, positions: G_MAJOR },
      },
      verify: [
        {
          prompt: 'D major is D E F♯ G A B C♯. Which notes are sharp?',
          options: [
            { text: 'F♯ only' },
            { text: 'F♯ and C♯', correct: true },
            { text: 'C♯ and G♯' },
          ],
          why: [
            { text: 'Following W W H W W W H from D lands on F♯ and C♯', correct: true },
            { text: "D major always copies G major's sharps" },
          ],
          fix: 'Not yet. Following W W H W W W H from D lands on F♯ and C♯.',
        },
        {
          prompt: 'Build F major. What is the 4th note?',
          options: [{ text: 'B' }, { text: 'B♭', correct: true }, { text: 'C' }],
          why: [
            { text: 'Notes 3 to 4 are a half step, and a half step above A is B♭', correct: true },
            { text: 'F major starts with F, so it must have a flat somewhere' },
          ],
          fix: 'Not yet. Notes 3 to 4 are a half step, and a half step above A is B♭.',
        },
      ],
      remember: 'Any note + W W H W W W H = its major scale. Use each letter once.',
    },
    {
      id: '3.3',
      name: 'Scale numbers',
      chips: ['Fact'],
      diagnose: {
        prompt: 'In G major (G A B C D E F♯), which note is number 5?',
        options: [
          { text: 'C', gap: 'miscount' },
          { text: 'D', correct: true },
          { text: 'E', gap: 'miscount' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Number the notes of a scale from 1 to 7. In C major: C = 1, D = 2, E = 3, F = 4, G = 5, A = 6, B = 7. Numbers let you talk about any key at once. "1, 3, 5" means C, E, G in C major, and G, B, D in G major. Number 1 is home.',
        miscount:
          'Number the notes of a scale from 1 to 7. In C major: C = 1, D = 2, E = 3, F = 4, G = 5, A = 6, B = 7. Numbers let you talk about any key at once. "1, 3, 5" means C, E, G in C major, and G, B, D in G major. Number 1 is home.',
      },
      hear: {
        caption: 'Fretboard in "scale numbers" mode for C major, then G major.',
        labelMode: 'numbers',
        scaleRoot: 'C',
        alsoRoot: 'G',
        highlighted: C_MAJOR,
        alsoHighlighted: G_MAJOR,
        play: { mode: 'seq', gap: 0.28, positions: C_MAJOR },
      },
      verify: [
        {
          prompt: 'In D major (D E F♯ G A B C♯), what are 1, 3 and 5?',
          options: [
            { text: 'D F A' },
            { text: 'D F♯ A', correct: true },
            { text: 'D G A' },
          ],
          why: [
            { text: 'Count the notes of D major: D is 1, F♯ is 3, A is 5', correct: true },
            { text: '1, 3, 5 is always D, F, A' },
          ],
          fix: 'Not yet. Count the notes of D major: D is 1, F♯ is 3, A is 5.',
        },
        {
          prompt: 'In any major scale, which number is home?',
          options: [{ text: '1', correct: true }, { text: '5' }, { text: '7' }],
          why: [
            { text: 'The scale starts and feels finished on 1', correct: true },
            { text: "7 is the last note, so it's home" },
          ],
          fix: 'Not yet. The scale starts and feels finished on 1.',
        },
      ],
      remember: 'Numbers are positions in the scale. 1 is home.',
    },
  ],
}
