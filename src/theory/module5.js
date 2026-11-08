const A3 = { string: 5, fret: 0 }

export const MODULE_5 = {
  id: 'm5',
  number: 5,
  title: 'Keys and chord progressions',
  status: 'full',
  concepts: [
    {
      id: '5.1',
      name: 'What a key is',
      chips: ['Fact'],
      diagnose: {
        prompt: "What is a song's key?",
        options: [
          { text: 'A scale and the chords built from it, with one note and chord that feel like home', correct: true },
          { text: 'The first chord of the song', gap: 'first-chord' },
          { text: 'The highest note in the song', gap: 'highest-note' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          "A key is a home base. It's a scale (like C major) plus the seven chords built from that scale (Module 4). One note and one chord feel like home: in C major, the note C and the C chord. Songs pull back toward that home, and they often start and end there.",
        'highest-note':
          "A key is a home base. It's a scale (like C major) plus the seven chords built from that scale (Module 4). One note and one chord feel like home: in C major, the note C and the C chord. Songs pull back toward that home, and they often start and end there.",
        'first-chord':
          'Songs often start on the home chord, but not always. The key is about which chord feels like home, not which one comes first. A song in C major might start on Am and still keep coming back to C.',
      },
      hear: {
        caption: 'Strum C, F, G, then C. Then strum C, F, G and stop on G. The first sounds finished, the second sounds like it\'s waiting.',
        labelMode: 'names',
        highlighted: [A3],
        play: {
          script: [
            { mode: 'strum', chord: 'C', hold: 0.85, pause: 0.12 },
            { mode: 'strum', chord: 'F', hold: 0.85, pause: 0.12 },
            { mode: 'strum', chord: 'G', hold: 0.85, pause: 0.12 },
            { mode: 'strum', chord: 'C', hold: 1.2, pause: 0.45 },
            { mode: 'strum', chord: 'C', hold: 0.85, pause: 0.12 },
            { mode: 'strum', chord: 'F', hold: 0.85, pause: 0.12 },
            { mode: 'strum', chord: 'G', hold: 1.4 },
          ],
        },
      },
      verify: [
        {
          prompt: 'In the key of G major, which chord feels like home?',
          options: [{ text: 'C' }, { text: 'G', correct: true }, { text: 'D' }],
          why: [
            { text: 'G is chord I, the home chord of G major', correct: true },
            { text: "G is the first letter of the key's name, so it's played first" },
          ],
          fix: 'Not yet. G is chord I, the home chord of G major.',
        },
        {
          prompt: 'Which group of chords belongs to the key of G major (G A B C D E F♯)?',
          options: [
            { text: 'G, C, D, Em', correct: true },
            { text: 'G, C, D, E major' },
            { text: 'G, F, C, D' },
          ],
          why: [
            { text: 'G, C, D and Em use only notes from G major', correct: true },
            { text: "They're the most popular chords" },
          ],
          fix: 'Not yet. G, C, D and Em use only notes from G major.',
        },
      ],
      remember: 'A key is a scale plus its chords, with one home.',
    },
    {
      id: '5.2',
      name: 'Chord numbers and common progressions',
      chips: ['Fact', 'Common guideline'],
      diagnose: {
        prompt: 'In a progression, what does "IV" mean?',
        options: [
          { text: 'The chord built on the 4th note of the key', correct: true },
          { text: 'The fourth chord you play', gap: 'order-not-position' },
          { text: 'Play four chords', gap: 'order-not-position' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Musicians name chords by their position in the key, using the numbers from Module 4. In C major: I = C, IV = F, V = G, vi = Am. So "I–IV–V" means C–F–G in C, and G–C–D in G. Numbers let one progression work in any key. Three very common ones:\nI–IV–V: rock and blues (C–F–G)\nI–V–vi–IV: a huge number of pop songs (C–G–Am–F)\nii–V–I: jazz (Dm–G–C)',
        'order-not-position':
          'Musicians name chords by their position in the key, using the numbers from Module 4. In C major: I = C, IV = F, V = G, vi = Am. So "I–IV–V" means C–F–G in C, and G–C–D in G. Numbers let one progression work in any key. Three very common ones:\nI–IV–V: rock and blues (C–F–G)\nI–V–vi–IV: a huge number of pop songs (C–G–Am–F)\nii–V–I: jazz (Dm–G–C)',
      },
      hear: {
        caption: 'Strum I–V–vi–IV in C (C, G, Am, F), then the same numbers in G (G, D, Em, C). Same feeling, different key.',
        labelMode: 'names',
        highlighted: [],
        play: {
          script: [
            { mode: 'strum', chord: 'C', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'G', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'Am', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'F', hold: 1.1, pause: 0.4 },
            { mode: 'strum', chord: 'G', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'D', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'Em', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'C', hold: 1.1 },
          ],
        },
      },
      verify: [
        {
          prompt: 'What is I–IV–V in G major?',
          options: [
            { text: 'G, C, D', correct: true },
            { text: 'G, A, B' },
            { text: 'G, D, Em' },
          ],
          why: [
            { text: 'The 1st, 4th and 5th notes of G major are G, C and D, and those chords are major', correct: true },
            { text: 'I–IV–V means the first three chords after G' },
          ],
          fix: 'Not yet. The 1st, 4th and 5th notes of G major are G, C and D, and those chords are major.',
        },
        {
          prompt: 'What is I–IV–V in A major (A B C♯ D E F♯ G♯)?',
          options: [
            { text: 'A, D, E', correct: true },
            { text: 'A, B, C♯' },
            { text: 'A, D, Em' },
          ],
          why: [
            { text: 'The 1st, 4th and 5th notes of A major are A, D and E', correct: true },
            { text: 'Chord V is always minor' },
          ],
          fix: 'Not yet. The 1st, 4th and 5th notes of A major are A, D and E.',
        },
        {
          prompt: 'What is ii–V–I in C major?',
          options: [
            { text: 'Dm, G, C', correct: true },
            { text: 'D, G, C' },
            { text: 'C, G, Dm' },
          ],
          why: [
            { text: 'ii is the 2nd note (D) and lowercase, so minor. Then V is G and I is C', correct: true },
            { text: 'ii means play D twice' },
          ],
          fix: 'Not yet. ii is the 2nd note (D) and lowercase, so minor. Then V is G and I is C.',
        },
      ],
      remember: 'Chord numbers come from positions in the key. I–IV–V and I–V–vi–IV are everywhere.',
    },
    {
      id: '5.3',
      name: 'Finding the key of a song',
      chips: ['Common guideline'],
      diagnose: {
        prompt: 'A song uses G, C, D and Em, and keeps ending on G. What key is it most likely in?',
        options: [
          { text: 'G major', correct: true },
          { text: 'C major', gap: 'chord-set' },
          { text: 'D major', gap: 'chord-set' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          "Use two clues. First, which chord feels like home? It's usually the one the song ends on or keeps returning to. Second, which key contains all the chords? G, C, D and Em are I, IV, V and vi of G major. C major can't be right, because the D major chord needs F♯, which isn't in C major.",
        'chord-set':
          "Use two clues. First, which chord feels like home? It's usually the one the song ends on or keeps returning to. Second, which key contains all the chords? G, C, D and Em are I, IV, V and vi of G major. C major can't be right, because the D major chord needs F♯, which isn't in C major.",
      },
      hear: {
        caption: 'Play a short loop of G, Em, C, D that ends on G.',
        labelMode: 'names',
        highlighted: [],
        play: {
          script: [
            { mode: 'strum', chord: 'G', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'Em', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'C', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'D', hold: 0.9, pause: 0.12 },
            { mode: 'strum', chord: 'G', hold: 1.3 },
          ],
        },
      },
      verify: [
        {
          prompt: 'A song uses C, F, G and Am, and ends on C. Key?',
          options: [{ text: 'C major', correct: true }, { text: 'F major' }, { text: 'G major' }],
          why: [
            { text: 'C, F, G and Am all fit C major, and C feels like home', correct: true },
            { text: 'F appears, so it must be F major' },
          ],
          fix: 'Not yet. C, F, G and Am all fit C major, and C feels like home.',
        },
        {
          prompt: 'A song uses D, G, A and Bm, and ends on D. Key?',
          options: [{ text: 'D major', correct: true }, { text: 'G major' }, { text: 'A major' }],
          why: [
            { text: 'D, G, A and Bm are I, IV, V and vi of D major, and D feels like home', correct: true },
            { text: 'A is the highest chord' },
          ],
          fix: 'Not yet. D, G, A and Bm are I, IV, V and vi of D major, and D feels like home.',
        },
      ],
      remember: 'Find home by ear, then check which key contains every chord.',
    },
  ],
}
