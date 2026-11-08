const A = 5

export const MODULE_1 = {
  id: 'm1',
  number: 1,
  title: 'Notes and the fretboard',
  status: 'full',
  concepts: [
    {
      id: '1.1',
      name: 'The 12 notes',
      chips: ['Fact'],
      diagnose: {
        prompt: 'How many different notes are there before the names start repeating?',
        options: [
          { text: '7', gap: 'letters-only' },
          { text: '8', gap: 'counted-twice' },
          { text: '12', correct: true },
          { text: 'Not sure', notSure: true },
        ],
      },
      followUp: {
        prompt: 'Notes are named with the letters A to G. Do you think there are any notes in between some of those letters?',
        options: [
          { text: 'Yes', explain: 'default' },
          { text: 'No', explain: 'letters-only' },
          { text: 'Not sure', explain: 'default' },
        ],
      },
      explain: {
        default:
          'There are 7 letter names: A B C D E F G. Between most of them sits one more note, written with a sharp (♯). Two pairs have nothing in between: B and C, and E and F. So the full set is A, A♯, B, C, C♯, D, D♯, E, F, F♯, G, G♯. That\'s 12 notes. After G♯ the names start again at A, just higher.',
        'letters-only':
          'There are 7 letter names: A B C D E F G. Between most of them sits one more note, written with a sharp (♯). Two pairs have nothing in between: B and C, and E and F. So the full set is A, A♯, B, C, C♯, D, D♯, E, F, F♯, G, G♯. That\'s 12 notes. After G♯ the names start again at A, just higher.',
        'counted-twice':
          '8 comes from counting the starting note twice: A ... up to the next A. That second A is the same note, only higher. There are 12 different notes before the names repeat.',
      },
      hear: {
        caption: 'A string, frets 0 to 12. Each fret is one of the 12 notes, then A repeats an octave higher.',
        labelMode: 'names',
        highlighted: Array.from({ length: 13 }, (_, fret) => ({ string: A, fret })),
        play: {
          mode: 'seq',
          gap: 0.28,
          positions: Array.from({ length: 13 }, (_, fret) => ({ string: A, fret })),
        },
      },
      verify: [
        {
          prompt: 'Which pair of letters has NO note in between?',
          options: [
            { text: 'C and D' },
            { text: 'E and F', correct: true },
            { text: 'G and A' },
            { text: 'F and G' },
          ],
          why: [
            { text: 'E and F (and B and C) sit right next to each other in the musical alphabet', correct: true },
            { text: 'F is always a flat note' },
            { text: 'Notes after E are always sharps' },
          ],
          fix: 'Not yet. E and F (and B and C) sit right next to each other.',
        },
        {
          prompt: 'Count up from C: C, C♯, D, D♯, E... What comes next?',
          options: [
            { text: 'E♯' },
            { text: 'F', correct: true },
            { text: 'F♯' },
          ],
          why: [
            { text: "There's no note between E and F, so F comes straight after E", correct: true },
            { text: 'Every letter is followed by its sharp' },
          ],
          fix: 'Not yet. There is no note between E and F, so F comes straight after E.',
        },
        {
          prompt: 'Count up from A: A, A♯, B... What comes next?',
          options: [
            { text: 'B♯' },
            { text: 'C', correct: true },
            { text: 'C♯' },
          ],
          why: [
            { text: "There's no note between B and C", correct: true },
            { text: 'B always goes to C♯' },
          ],
          fix: 'Not yet. There is no note between B and C, so C comes next.',
        },
      ],
      remember: '12 notes: 7 letters plus 5 in-between notes. Nothing sits between B and C, or E and F.',
    },
    {
      id: '1.2',
      name: 'Half steps and whole steps',
      chips: ['Fact'],
      diagnose: {
        prompt: 'On one guitar string, you move from fret 3 to fret 4. How big is that step?',
        options: [
          { text: 'A half step', correct: true },
          { text: 'A whole step', gap: 'step-size' },
          { text: 'It depends on which string', gap: 'strings-differ' },
          { text: 'Not sure', notSure: true },
        ],
      },
      followUp: {
        prompt: 'Is fret 3 to fret 4 the smallest move you can make on one string?',
        options: [
          { text: 'Yes', explain: 'default' },
          { text: 'No', explain: 'step-size' },
        ],
      },
      explain: {
        default:
          'The smallest step in music is a half step, which is one fret on the guitar. Two frets make a whole step. C to C♯ is a half step. C to D is a whole step (C, C♯, D).',
        'step-size':
          'The smallest step in music is a half step, which is one fret on the guitar. Two frets make a whole step. C to C♯ is a half step. C to D is a whole step (C, C♯, D).',
        'strings-differ':
          'Each string starts on a different note, but the spacing is the same on every string. Every fret raises the note by exactly one half step.',
      },
      hear: {
        caption: 'A string: fret 3 (C3) to fret 4 (C♯3), then fret 3 (C3) to fret 5 (D3).',
        labelMode: 'names',
        highlighted: [
          { string: A, fret: 3 },
          { string: A, fret: 4 },
          { string: A, fret: 5 },
        ],
        play: {
          mode: 'seq',
          gap: 0.55,
          positions: [
            { string: A, fret: 3 },
            { string: A, fret: 4 },
            { string: A, fret: 3 },
            { string: A, fret: 5 },
          ],
        },
      },
      verify: [
        {
          prompt: 'E to F is a...',
          options: [
            { text: 'Half step', correct: true },
            { text: 'Whole step' },
          ],
          why: [
            { text: "Nothing sits between E and F, so they're one fret apart", correct: true },
            { text: 'Moving from one letter to the next is always a whole step' },
          ],
          fix: 'Not yet. Nothing sits between E and F, so they are one fret apart: a half step.',
        },
        {
          prompt: 'On the B string, fret 2 to fret 4 is a...',
          options: [
            { text: 'Half step' },
            { text: 'Whole step', correct: true },
          ],
          why: [
            { text: 'Two frets is two half steps, which is one whole step', correct: true },
            { text: 'The B string is tuned differently, so its frets are bigger' },
          ],
          fix: 'Not yet. Two frets is two half steps, which is one whole step.',
        },
        {
          prompt: 'G to A is a...',
          options: [
            { text: 'Half step' },
            { text: 'Whole step', correct: true },
          ],
          why: [
            { text: 'G♯ sits in between, so it\'s two half steps', correct: true },
            { text: 'G and A are both natural notes' },
          ],
          fix: 'Not yet. G♯ sits between G and A, so G to A is a whole step.',
        },
      ],
      remember: '1 fret = half step. 2 frets = whole step.',
    },
    {
      id: '1.3',
      name: 'Sharps, flats and two names for one note',
      chips: ['Fact'],
      diagnose: {
        prompt: 'Do C♯ and D♭ sound the same?',
        options: [
          { text: 'Yes', correct: true },
          { text: 'No', gap: 'different-sounds' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'A sharp (♯) means one half step higher. A flat (♭) means one half step lower. C♯ is one fret above C. D♭ is one fret below D. That\'s the same fret, so it\'s the same sound with two names. Which name gets used depends on the key, which you\'ll see in Module 3.',
        'different-sounds':
          'A sharp (♯) means one half step higher. A flat (♭) means one half step lower. C♯ is one fret above C. D♭ is one fret below D. That\'s the same fret, so it\'s the same sound with two names. Which name gets used depends on the key, which you\'ll see in Module 3.',
      },
      hear: {
        caption: 'A string, fret 4: C♯ and D♭ are the same fret.',
        labelMode: 'names',
        highlighted: [{ string: A, fret: 4 }],
        play: { mode: 'seq', positions: [{ string: A, fret: 4 }] },
      },
      verify: [
        {
          prompt: 'What\'s another name for G♯?',
          options: [
            { text: 'G♭' },
            { text: 'A♭', correct: true },
            { text: 'A♯' },
          ],
          why: [
            { text: 'G♯ is one fret above G, and A♭ is one fret below A. That\'s the same fret', correct: true },
            { text: 'Sharps and flats with the same letter are the same note' },
          ],
          fix: 'Not yet. G♯ is one fret above G, and A♭ is one fret below A — the same fret.',
        },
        {
          prompt: 'What is one fret above E?',
          options: [
            { text: 'F', correct: true },
            { text: 'F♯' },
            { text: 'E♭' },
          ],
          why: [
            { text: 'There\'s no note between E and F, so one fret up from E is F', correct: true },
            { text: 'Going up one fret always adds a sharp to the letter' },
          ],
          fix: 'Not yet. There is no note between E and F, so one fret up from E is F.',
        },
      ],
      remember: '♯ = up one fret. ♭ = down one fret. One sound can have two names.',
    },
    {
      id: '1.4',
      name: 'String names and finding any note',
      chips: ['Fact'],
      diagnose: {
        prompt: 'In standard tuning, what are the open strings from the thickest to the thinnest?',
        options: [
          { text: 'E A D G B E', correct: true },
          { text: 'E B G D A E', gap: 'reversed' },
          { text: 'A D G C E A', gap: 'unknown-tuning' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'From the thickest (lowest) string to the thinnest: E A D G B E. A memory trick: "Eddie Ate Dynamite, Good Bye Eddie." To find any note, start from the open string\'s name and count up one half step per fret.',
        'unknown-tuning':
          'From the thickest (lowest) string to the thinnest: E A D G B E. A memory trick: "Eddie Ate Dynamite, Good Bye Eddie." To find any note, start from the open string\'s name and count up one half step per fret.',
        reversed:
          'Those are the right names, but in the opposite order. E B G D A E goes from the thinnest string to the thickest. From the thickest (lowest sounding) string it\'s E A D G B E.',
        tip: 'Fret 5 on a string gives the same note as the next thinner string played open. The one exception is the G string, where it\'s fret 4.',
      },
      hear: {
        caption: 'The six open strings, thickest to thinnest: E2, A2, D3, G3, B3, E4.',
        labelMode: 'names',
        highlighted: [6, 5, 4, 3, 2, 1].map((string) => ({ string, fret: 0 })),
        play: {
          mode: 'seq',
          gap: 0.35,
          positions: [6, 5, 4, 3, 2, 1].map((string) => ({ string, fret: 0 })),
        },
      },
      verify: [
        {
          prompt: 'What note is the A string, fret 3?',
          options: [
            { text: 'B' },
            { text: 'C', correct: true },
            { text: 'D' },
            { text: 'C♯' },
          ],
          why: [
            { text: 'Count half steps from A: A♯ (1), B (2), C (3)', correct: true },
            { text: 'Each fret moves to the next letter: B, C, D' },
          ],
          fix: 'Not yet. Count half steps from A: A♯, B, C. Fret 3 is C.',
        },
        {
          prompt: 'What note is the low E string, fret 5?',
          options: [
            { text: 'G' },
            { text: 'A', correct: true },
            { text: 'B' },
            { text: 'A♯' },
          ],
          why: [
            { text: 'Count up: F (1), F♯ (2), G (3), G♯ (4), A (5)', correct: true },
            { text: 'Count five letters after E: F, G, A, B' },
          ],
          fix: 'Not yet. Count up from E: F, F♯, G, G♯, A. Fret 5 is A.',
        },
        {
          prompt: 'Where is G on the D string?',
          options: [
            { text: 'Fret 3' },
            { text: 'Fret 4' },
            { text: 'Fret 5', correct: true },
            { text: 'Fret 7' },
          ],
          why: [
            { text: 'D♯ (1), E (2), F (3), F♯ (4), G (5)', correct: true },
            { text: 'G is three letters after D, so fret 3' },
          ],
          fix: 'Not yet. Count from D: D♯, E, F, F♯, G. G is fret 5.',
        },
      ],
      remember: 'E A D G B E, then count half steps up from the open string.',
    },
    {
      id: '1.5',
      name: 'Octaves',
      chips: ['Fact'],
      diagnose: {
        prompt: 'What does fret 12 on any string play?',
        options: [
          { text: 'The same note as the open string, but higher', correct: true },
          { text: 'A completely new note', gap: 'new-note' },
          { text: 'The same note as the open string, but lower', gap: 'direction' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          "After 12 half steps the note names repeat. The repeated note is an octave higher. It sounds like the same note, just higher. That's why fret 12 has the same name as the open string, and why many guitars have a double dot there.",
        'new-note':
          "After 12 half steps the note names repeat. The repeated note is an octave higher. It sounds like the same note, just higher. That's why fret 12 has the same name as the open string, and why many guitars have a double dot there.",
        direction: "Moving up the frets always makes the note higher. Fret 12 is the open string's note, an octave higher.",
      },
      hear: {
        caption: 'A string open (A2), then fret 12 (A3), then both together.',
        labelMode: 'names',
        highlighted: [
          { string: A, fret: 0 },
          { string: A, fret: 12 },
        ],
        play: {
          mode: 'seq',
          gap: 0.7,
          positions: [
            { string: A, fret: 0 },
            { string: A, fret: 12 },
          ],
          thenTogether: [
            { string: A, fret: 0 },
            { string: A, fret: 12 },
          ],
        },
      },
      verify: [
        {
          prompt: 'How many half steps make an octave?',
          options: [
            { text: '7' },
            { text: '8' },
            { text: '12', correct: true },
          ],
          why: [
            { text: 'There are 12 different notes before the names repeat', correct: true },
            { text: 'An octave has 8 letters, like do-re-mi up to do' },
          ],
          fix: 'Not yet. There are 12 different notes before the names repeat, so an octave is 12 half steps.',
        },
        {
          prompt: 'The A string at fret 12 is A. What note is fret 15?',
          options: [
            { text: 'B' },
            { text: 'C', correct: true },
            { text: 'D' },
          ],
          why: [
            { text: 'After fret 12 the pattern restarts, so fret 15 is the same note as fret 3, which is C', correct: true },
            { text: 'Fret 15 is three letters after A' },
          ],
          fix: 'Not yet. After fret 12 the pattern restarts, so fret 15 is the same as fret 3: C.',
        },
      ],
      remember: '12 half steps = one octave. Fret 12 = the open string, an octave higher.',
    },
  ],
}

export const COURSE_GOAL =
  'Go from "I know a few chords" to understanding why notes and chords work, and using that to improvise your own phrases.'

export const COURSE_FOR = 'Someone who can play a few songs on guitar but knows almost no theory.'
