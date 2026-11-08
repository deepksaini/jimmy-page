import { parsePhrase } from './phrases.js'

export const COURSE_TITLE = 'Jimmy Page'

export const COURSE_GOAL =
  "By the end you'll know which notes fit each chord, and how to turn one small idea into four bars."

export const COURSE_FOR = 'Someone who can play a few songs on guitar but knows almost no theory.'

export const LESSONS = [
  {
    id: 'l4',
    number: '9.1',
    title: 'Chord notes',
    chips: ['Fact', 'Common guideline'],
    learn: [
      'Your five notes never change. What changes, bar by bar, is which of them are in the chord playing right now. Those are chord notes. They sound settled. The other notes of the scale are still safe to play, but they sound like they want to move.',
      'Same note, different feeling: D is not in A minor (A, C, E), so over A minor it sounds unsettled. D is in G (G, B, D), so over G it sounds settled.',
      'This is the main step from "running the scale" to soloing: aim for the chord, not just the scale.',
    ],
    hear: [
      { label: 'D held for a whole bar over A minor.', kind: 'phrase', barIndex: 0, phrase: 'D4@0×8' },
      { label: 'The same D held for a whole bar over G.', kind: 'phrase', barIndex: 2, phrase: 'D4@0×8' },
    ],
    try: {
      kind: 'four-bars-end-chord',
      text: 'Play the four-bar loop. The rings on the fretboard move to the chord notes each time the chord changes. End each bar on a ringed note. Play on your phone (recommended), or click the fretboard below.',
    },
    remember: 'Aim for the chord, not just the scale.',
  },
  {
    id: 'l5',
    number: '9.2',
    title: 'Passing notes and landing',
    chips: ['Common guideline'],
    learn: [
      "Notes that aren't chord notes aren't wrong. They're passing notes: they create a little tension that a chord note then releases. D, for example, sits right next to C and E, so it naturally leads into one of them.",
      'The last note decides how finished the phrase sounds:',
      'Ending on A over the last A minor bar sounds finished.',
      'Ending on C or E sounds restful but open.',
      'Ending on D or G sounds unfinished, as if the phrase wants to go on.',
    ],
    hear: [
      {
        label: 'Over the final A minor bar, ends on D (unfinished).',
        kind: 'phrase',
        barIndex: 3,
        phrase: 'G4@0×1, E4@1×1, G4@2×2, D4@4×4',
      },
      {
        label: 'Over the final A minor bar, ends on A (finished).',
        kind: 'phrase',
        barIndex: 3,
        phrase: 'G4@0×1, E4@1×1, G4@2×2, A4@4×4',
      },
    ],
    try: {
      kind: 'bar4-compare',
      text: 'Write bar 4 so it ends on A. Then change only the last note to D, and press Hear it to compare. Play on your phone (recommended), or click the fretboard below.',
    },
    remember: 'Pass through tension, land on a chord note.',
  },
  {
    id: 'l6',
    number: '9.3',
    title: 'One idea, four bars',
    chips: ['Common guideline'],
    learn: [
      "Good solos often sound like speech: you say something, say it again, change it, then finish. You don't need many notes. Start with a short idea (three or four notes) and develop it:",
      'Say it again: repeat the idea so people remember it.',
      'Change the rhythm: same notes, new timing.',
      'Answer it: turn the shape around, like a reply to a question, and land on a chord note. This is called call and response.',
      'Finish: end on A.',
      'Running up and down the scale sounds like an exercise. Repeating and changing one idea sounds like music.',
    ],
    hear: [
      {
        label: 'A four-bar example built from one idea.',
        kind: 'solo',
        bars: [
          'E4@0×2, G4@2×2, A4@4×4',
          'E4@0×2, G4@2×2, A4@4×4',
          'A4@0×2, G4@2×2, D4@4×4',
          'G4@0×1, E4@1×1, G4@2×2, A4@4×4',
        ],
      },
      {
        label: 'The same four bars as scale runs (C, D, E, G, A going up and down).',
        kind: 'solo',
        bars: [
          'C4@0×1, D4@1×1, E4@2×1, G4@3×1, A4@4×4',
          'A4@0×1, G4@1×1, E4@2×1, D4@3×1, C4@4×4',
          'C4@0×1, D4@1×1, E4@2×1, G4@3×1, A4@4×4',
          'A4@0×1, G4@1×1, E4@2×1, D4@3×1, C4@4×4',
        ],
      },
    ],
    try: {
      kind: 'four-bar-idea',
      text: 'Build four bars from your own idea using the moves. Play on your phone (recommended), or click the fretboard below.',
    },
    remember: 'One idea, said again, changed, then finished.',
  },
  {
    id: 'l7',
    number: '9.4',
    title: 'Rhythm and space',
    chips: ['Common guideline'],
    learn: [
      'Rhythm can make the same notes sound like a different idea.',
      'A bar of 4/4 has four beats, and each beat splits into two halves: "1 and 2 and 3 and 4 and". That\'s the 8 slots in each bar.',
      'A note that starts on an "and" is off the beat. Starting off the beat makes a phrase feel more alive.',
      'A rest is a planned silence. Leaving space makes the notes around it stand out and gives the listener time to hear the idea.',
      'A long note at the end of a phrase gives it weight.',
    ],
    hear: [
      { label: 'Even.', kind: 'phrase', barIndex: 0, phrase: 'E4@0×2, G4@2×2, A4@4×4' },
      { label: 'Off the beat.', kind: 'phrase', barIndex: 0, phrase: 'E4@1×2, G4@3×2, A4@5×3' },
      { label: 'With a rest.', kind: 'phrase', barIndex: 0, phrase: 'E4@0×1, rest@1×3, G4@4×1, A4@5×3' },
    ],
    try: {
      kind: 'four-bar-rhythm',
      text: 'Use a rhythm move or Spread them out, and add at least one rest. Play on your phone (recommended), or click the fretboard below.',
    },
    remember: 'Where a note lands matters as much as which note it is.',
  },
  {
    id: 'l8',
    number: '9.5',
    title: 'The blue note in a phrase',
    chips: ['Common guideline'],
    learn: [
      'Add one note to your five: E♭ (E flat). It sits between D and E. Its job number is ♭5 (flat fifth), and it gives that bluesy, tense sound heard in a lot of rock and blues.',
      "It's very tense, so treat it as a stepping stone: slide through it from D to E, or E to D. Don't stop on it.",
      'Where it is: G string, fret 8. Key: Shift+D.',
    ],
    hear: [
      { label: 'Without the blue note.', kind: 'phrase', barIndex: 0, phrase: 'D4@0×2, E4@2×6' },
      { label: 'With the blue note passing through.', kind: 'phrase', barIndex: 0, phrase: 'D4@0×1, E♭4@1×1, E4@2×6' },
    ],
    try: {
      kind: 'four-bar-blue',
      text: 'In bar 2 or 3, add E♭ once, between D and E. Play on your phone (recommended), or click the fretboard below.',
    },
    remember: 'The blue note is a stepping stone, not a place to stop.',
  },
  {
    id: 'lfinal',
    number: '9.6',
    title: 'Final challenge',
    chips: [],
    learn: [
      "No rings, no moves, no hints. Use everything from the lessons. The goals are shown before you start, so you know what you're aiming for.",
      '1. Every bar ends on a chord note for that bar\'s chord.',
      '2. Bar 4 ends on A.',
      '3. At least two bars share the same idea.',
      '4. At least one rest inside a bar.',
      '5. At most one scale run.',
    ],
    hear: [
      {
        label: 'The four-bar backing: A minor, F, G, A minor.',
        kind: 'chords',
        bars: 4,
        startBar: 0,
      },
    ],
    try: {
      kind: 'four-bar-challenge',
      text: 'Write four bars with no rings, no moves, and no hints. Play on your phone (recommended), or click the fretboard below.',
      goals: [
        'Every bar ends on a chord note for that bar\'s chord.',
        'Bar 4 ends on A.',
        'At least two bars share the same idea.',
        'At least one rest inside a bar.',
        'At most one scale run.',
      ],
    },
    remember: "If you can do this without hints, you've learned it. Next, try it on your guitar over a backing track.",
  },
]

export function lessonById(id) {
  return LESSONS.find((item) => item.id === id)
}

export function phraseEvents(text) {
  return parsePhrase(text)
}
