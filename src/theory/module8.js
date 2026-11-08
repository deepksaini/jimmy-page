const A_NATURAL = [
  { string: 5, fret: 0 },
  { string: 5, fret: 2 },
  { string: 5, fret: 3 },
  { string: 5, fret: 5 },
  { string: 5, fret: 7 },
  { string: 5, fret: 8 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
]

const A_PENTA = [
  { string: 5, fret: 0 },
  { string: 5, fret: 3 },
  { string: 5, fret: 5 },
  { string: 5, fret: 7 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
]

const C_PENTA = [
  { string: 5, fret: 3 },
  { string: 5, fret: 5 },
  { string: 5, fret: 7 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
]

export const BOX1 = [
  { string: 6, fret: 5 },
  { string: 6, fret: 8 },
  { string: 5, fret: 5 },
  { string: 5, fret: 7 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
  { string: 3, fret: 5 },
  { string: 3, fret: 7 },
  { string: 2, fret: 5 },
  { string: 2, fret: 8 },
  { string: 1, fret: 5 },
  { string: 1, fret: 8 },
]

const BOX1_A = [
  { string: 6, fret: 5 },
  { string: 4, fret: 7 },
  { string: 1, fret: 5 },
]

const D3 = { string: 5, fret: 5 }
const Eb3 = { string: 5, fret: 6 }
const E3 = { string: 5, fret: 7 }

const BLUES = [
  { string: 6, fret: 5 },
  { string: 6, fret: 8 },
  { string: 5, fret: 5 },
  { string: 5, fret: 6 },
  { string: 5, fret: 7 },
  { string: 4, fret: 5 },
  { string: 4, fret: 7 },
  { string: 3, fret: 5 },
  { string: 3, fret: 7 },
  { string: 3, fret: 8 },
  { string: 2, fret: 5 },
  { string: 2, fret: 8 },
  { string: 1, fret: 5 },
  { string: 1, fret: 8 },
]

export const MODULE_8 = {
  id: 'm8',
  number: 8,
  title: 'The pentatonic scale',
  status: 'full',
  concepts: [
    {
      id: '8.1',
      name: 'The minor pentatonic',
      chips: ['Fact'],
      diagnose: {
        prompt: 'Which notes make up A minor pentatonic?',
        options: [
          { text: 'A C D E G', correct: true },
          { text: 'A B C D E', gap: 'first-five' },
          { text: 'A C E', gap: 'chord-not-scale' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          '"Penta" means five. Take A natural minor (A B C D E F G) and leave out notes 2 and ♭6, which are B and F. You get A C D E G. With those two gone, there are no half steps left in the scale, only gaps of 3 or 2 half steps. That makes it very hard to hit a note that clashes, which is why it\'s the favorite scale for rock and blues soloing.',
        'first-five':
          '"Penta" means five. Take A natural minor (A B C D E F G) and leave out notes 2 and ♭6, which are B and F. You get A C D E G. With those two gone, there are no half steps left in the scale, only gaps of 3 or 2 half steps. That makes it very hard to hit a note that clashes, which is why it\'s the favorite scale for rock and blues soloing.',
        'chord-not-scale':
          'A, C, E is the A minor chord (Module 4). The pentatonic scale adds D and G to it: A C D E G.',
      },
      hear: {
        caption: 'Play A natural minor, then A minor pentatonic, highlighting the two notes that disappear.',
        labelMode: 'names',
        highlighted: [
          { string: 5, fret: 2 },
          { string: 5, fret: 8 },
        ],
        play: {
          script: [
            { mode: 'seq', gap: 0.24, positions: A_NATURAL, pause: 0.35 },
            { mode: 'seq', gap: 0.28, positions: A_PENTA },
          ],
        },
      },
      verify: [
        {
          prompt: 'Which two notes of A natural minor are left out?',
          options: [
            { text: 'B and F', correct: true },
            { text: 'C and G' },
            { text: 'D and E' },
          ],
          why: [
            { text: 'Notes 2 (B) and ♭6 (F) are removed, which also removes the half steps', correct: true },
            { text: 'The two highest notes are removed' },
          ],
          fix: 'Not yet. Notes 2 (B) and ♭6 (F) are removed, which also removes the half steps.',
        },
        {
          prompt: 'What is E minor pentatonic? (E natural minor is E F♯ G A B C D.)',
          options: [
            { text: 'E G A B D', correct: true },
            { text: 'E F♯ G A B' },
            { text: 'E G B' },
          ],
          why: [
            { text: 'Remove notes 2 (F♯) and ♭6 (C) from E natural minor', correct: true },
            { text: 'Take the first five notes' },
          ],
          fix: 'Not yet. Remove notes 2 (F♯) and ♭6 (C) from E natural minor.',
        },
      ],
      remember: 'Minor pentatonic = natural minor without 2 and ♭6. No half steps.',
    },
    {
      id: '8.2',
      name: 'The major pentatonic',
      chips: ['Fact'],
      diagnose: {
        prompt: 'Do C major pentatonic and A minor pentatonic share the same notes?',
        options: [
          { text: 'Yes', correct: true },
          { text: 'No', gap: 'different-notes' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          "The major pentatonic is the major scale without notes 4 and 7. C major (C D E F G A B) without F and B gives C D E G A. Those are exactly the notes of A minor pentatonic (A C D E G). They're relatives, just like C major and A minor in Module 6. Which one you hear depends on which note feels like home, and that depends on the chords underneath.",
        'different-notes':
          "The major pentatonic is the major scale without notes 4 and 7. C major (C D E F G A B) without F and B gives C D E G A. Those are exactly the notes of A minor pentatonic (A C D E G). They're relatives, just like C major and A minor in Module 6. Which one you hear depends on which note feels like home, and that depends on the chords underneath.",
      },
      hear: {
        caption: 'Play C D E G A over a C chord, then the same notes over an Am chord.',
        labelMode: 'names',
        highlighted: C_PENTA,
        play: {
          script: [
            { mode: 'strum', chord: 'C', hold: 1, pause: 0.08 },
            { mode: 'seq', gap: 0.28, positions: C_PENTA, pause: 0.35 },
            { mode: 'strum', chord: 'Am', hold: 1, pause: 0.08 },
            { mode: 'seq', gap: 0.28, positions: C_PENTA },
          ],
        },
      },
      verify: [
        {
          prompt: 'What is G major pentatonic? (G major is G A B C D E F♯.)',
          options: [
            { text: 'G A B D E', correct: true },
            { text: 'G A B C D' },
            { text: 'G B D' },
          ],
          why: [
            { text: 'Remove notes 4 (C) and 7 (F♯)', correct: true },
            { text: 'Take the first five notes' },
          ],
          fix: 'Not yet. Remove notes 4 (C) and 7 (F♯).',
        },
        {
          prompt: 'Which minor pentatonic has the same notes as G major pentatonic?',
          options: [
            { text: 'E minor pentatonic', correct: true },
            { text: 'A minor pentatonic' },
            { text: 'D minor pentatonic' },
          ],
          why: [
            { text: "E is G major's relative minor, and E minor pentatonic is E G A B D", correct: true },
            { text: 'A minor pentatonic fits with everything' },
          ],
          fix: "Not yet. E is G major's relative minor, and E minor pentatonic is E G A B D.",
        },
      ],
      remember: 'Major pentatonic = major scale without 4 and 7. It shares notes with its relative minor pentatonic.',
    },
    {
      id: '8.3',
      name: 'Box 1 on the guitar',
      chips: ['Fact'],
      diagnose: {
        prompt: 'At which fret does the A minor pentatonic "box 1" start on the low E string?',
        options: [
          { text: 'Fret 5', correct: true },
          { text: 'Fret 0', gap: 'open-position' },
          { text: 'Fret 7', gap: 'guess' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Box 1 starts on the home note on the low E string. A is at fret 5 there (Module 1), so the box covers frets 5 to 8:\nLow E: 5 (A), 8 (C)\nA: 5 (D), 7 (E)\nD: 5 (G), 7 (A)\nG: 5 (C), 7 (D)\nB: 5 (E), 8 (G)\nHigh e: 5 (A), 8 (C)\nThe shape is movable. Put its first note on a different home note on the low E string and you get that key\'s minor pentatonic.',
        'open-position':
          'Box 1 starts on the home note on the low E string. A is at fret 5 there (Module 1), so the box covers frets 5 to 8:\nLow E: 5 (A), 8 (C)\nA: 5 (D), 7 (E)\nD: 5 (G), 7 (A)\nG: 5 (C), 7 (D)\nB: 5 (E), 8 (G)\nHigh e: 5 (A), 8 (C)\nThe shape is movable. Put its first note on a different home note on the low E string and you get that key\'s minor pentatonic.',
        guess:
          'Box 1 starts on the home note on the low E string. A is at fret 5 there (Module 1), so the box covers frets 5 to 8:\nLow E: 5 (A), 8 (C)\nA: 5 (D), 7 (E)\nD: 5 (G), 7 (A)\nG: 5 (C), 7 (D)\nB: 5 (E), 8 (G)\nHigh e: 5 (A), 8 (C)\nThe shape is movable. Put its first note on a different home note on the low E string and you get that key\'s minor pentatonic.',
      },
      hear: {
        caption: 'Fretboard showing box 1 with the A notes highlighted. Play it from low to high and back.',
        labelMode: 'names',
        highlighted: BOX1_A,
        play: {
          script: [
            { mode: 'seq', gap: 0.2, positions: BOX1, pause: 0.15 },
            { mode: 'seq', gap: 0.2, positions: [...BOX1].reverse() },
          ],
        },
      },
      verify: [
        {
          prompt: 'Where would box 1 start for G minor pentatonic?',
          options: [{ text: 'Fret 3', correct: true }, { text: 'Fret 5' }, { text: 'Fret 7' }],
          why: [
            { text: 'G is at fret 3 on the low E string, and the same shape moves there', correct: true },
            { text: 'Every minor pentatonic starts at fret 5' },
          ],
          fix: 'Not yet. G is at fret 3 on the low E string, and the same shape moves there.',
        },
        {
          prompt: 'In box 1 of A minor pentatonic, which notes are A (home)?',
          options: [
            { text: 'Low E fret 5, D string fret 7, high e fret 5', correct: true },
            { text: 'A string fret 5, B string fret 8' },
            { text: 'Every fret 5' },
          ],
          why: [
            { text: 'Those three spots are all A, in different octaves', correct: true },
            { text: 'Fret 5 is always the home note' },
          ],
          fix: 'Not yet. Those three spots are all A, in different octaves.',
        },
      ],
      remember: 'Box 1 starts on the home note on the low E string. The shape moves to any key.',
    },
    {
      id: '8.4',
      name: 'The blue note',
      chips: ['Fact', 'Common guideline'],
      diagnose: {
        hearFirst: true,
        prompt: 'Which one sounds more bluesy?',
        hear: {
          caption: 'Over an Am chord, play D3 to E3, then D3, E♭3, E3.',
          labelMode: 'names',
          highlighted: [D3, Eb3, E3],
          play: {
            script: [
              { mode: 'strum', chord: 'Am', hold: 0.9, pause: 0.08 },
              { mode: 'seq', gap: 0.32, positions: [D3, E3], pause: 0.4 },
              { mode: 'strum', chord: 'Am', hold: 0.9, pause: 0.08 },
              { mode: 'seq', gap: 0.28, positions: [D3, Eb3, E3] },
            ],
          },
        },
        options: [
          { text: 'The first', gap: 'hearing' },
          { text: 'The second', correct: true },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          "The blue note is the ♭5, the note between 4 and 5. In A minor pentatonic it's E♭, between D and E. It adds a tense, bluesy edge. Adding it to the pentatonic gives the blues scale: A C D E♭ E G. It's so tense that players use it as a passing note. They slide or step through it, and don't stop on it. In box 1 it sits at A string fret 6 and G string fret 8.",
        hearing:
          "The blue note is the ♭5, the note between 4 and 5. In A minor pentatonic it's E♭, between D and E. It adds a tense, bluesy edge. Adding it to the pentatonic gives the blues scale: A C D E♭ E G. It's so tense that players use it as a passing note. They slide or step through it, and don't stop on it. In box 1 it sits at A string fret 6 and G string fret 8.",
      },
      hear: {
        caption: 'Play the A blues scale through box 1, highlighting E♭.',
        labelMode: 'names',
        highlighted: [
          { string: 5, fret: 6 },
          { string: 3, fret: 8 },
        ],
        play: { mode: 'seq', gap: 0.2, positions: BLUES },
      },
      verify: [
        {
          prompt: 'What is the blue note in E minor pentatonic (E G A B D)?',
          options: [{ text: 'B♭', correct: true }, { text: 'C' }, { text: 'F' }],
          why: [
            { text: "It's the ♭5: 6 half steps above E, between A and B", correct: true },
            { text: "It's the note after the highest note in the scale" },
          ],
          fix: "Not yet. It's the ♭5: 6 half steps above E, between A and B.",
        },
        {
          prompt: 'Where is the blue note best used?',
          options: [
            { text: 'As a quick passing note between 4 and 5', correct: true },
            { text: 'As the last note of a phrase' },
            { text: 'Held as long as possible' },
          ],
          why: [
            { text: "It's very tense, so it works best leading into a stable note", correct: true },
            { text: "Tension is best when it's never resolved" },
          ],
          fix: "Not yet. It's very tense, so it works best leading into a stable note.",
        },
      ],
      remember: "The blue note is ♭5. Pass through it, don't stop on it.",
    },
  ],
}
