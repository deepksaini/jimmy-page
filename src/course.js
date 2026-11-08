import { parsePhrase } from './phrases.js'

export const COURSE_TITLE = 'Jimmy Page'

export const COURSE_GOAL =
  "By the end you'll know which notes fit each chord, and how to turn one small idea into four bars."

export const COURSE_FOR =
  'Who it is for: a guitarist who knows the A minor pentatonic box but mostly runs up and down it when trying to improvise.'

export const STAGE_A_IDS = ['l1', 'l3', 'l4', 'l5']
export const STAGE1_IDS = STAGE_A_IDS

export const LESSONS = [
  {
    id: 'l1',
    number: 1,
    title: 'Key, scale and chord',
    chips: ['Fact'],
    learn: [
      'Three words get mixed up, so here they are side by side.',
      'Key: the home of the whole song. In A minor, everything feels like it wants to come back to A. The key stays the same.',
      'Scale: the set of notes you play from. The A minor pentatonic is A, C, D, E, G. It also stays the same.',
      'Chord: a few notes the backing plays together. It changes, usually every bar. Here: A minor, then F, then G, then A minor.',
      'You play notes from the scale. The backing plays the chords. The key is the home they share.',
    ],
    hear: [
      { label: 'The A minor chord on its own for one bar.', kind: 'chord', barIndex: 0 },
      {
        label: 'Your five notes, one after another, over the A minor chord.',
        kind: 'phrase',
        barIndex: 0,
        phrase: 'C4@0×1, D4@1×1, E4@2×1, G4@3×1, A4@4×1, C5@5×3',
      },
      {
        label: 'All four chords in a row (A minor, F, G, A minor), so the change from bar to bar is audible.',
        kind: 'chords',
        bars: 4,
        startBar: 0,
      },
    ],
    try: {
      kind: 'loop-listen',
      text: 'Press Play. While the four chords loop, click or press any of your notes. Listen for the moment each new chord starts.',
    },
    quiz: [
      {
        prompt: 'The backing plays something new every bar. Is that the key, the scale or the chord?',
        options: ['the key', 'the scale', 'the chord'],
        answer: 'the chord',
        why: 'The chord is what the backing plays, and it changes every bar. The key stays A minor the whole time.',
      },
      {
        prompt: 'The five notes you play from are the key, the scale or the chord?',
        options: ['the key', 'the scale', 'the chord'],
        answer: 'the scale',
        why: 'The scale is the set of notes you play from: A, C, D, E, G. It does not change with the bar.',
      },
      {
        prompt: 'In A minor, which note feels like home?',
        options: ['A', 'C', 'E', 'G'],
        answer: 'A',
        why: 'A is the home of the key of A minor. Everything wants to come back to it.',
      },
    ],
    remember: 'The key and the scale stay. The chord changes.',
  },
  {
    id: 'l3',
    number: 3,
    title: 'How chords are built',
    chips: ['Fact'],
    learn: [
      'A basic chord is three notes. To build one, start on a note of the A minor scale (A, B, C, D, E, F, G) and take every other note.',
      'Start on A: A, C, E = A minor',
      'Start on F: F, A, C = F',
      'Start on G: G, B, D = G',
      'Minor or major comes from the gap between the first two notes. On one string, count frets:',
      'A to C is 3 frets. A 3-fret gap makes a minor chord.',
      'F to A is 4 frets, and G to B is 4 frets. A 4-fret gap makes a major chord.',
      'In the key of A minor, musicians number the chords by where they start in the scale: A minor is i (lowercase = minor), F is VI, G is VII (uppercase = major). The backing in this app is i, VI, VII, i.',
    ],
    hear: [
      { label: 'A minor chord on its own for one bar.', kind: 'chord', barIndex: 0 },
      { label: 'F chord on its own for one bar.', kind: 'chord', barIndex: 1 },
      { label: 'G chord on its own for one bar.', kind: 'chord', barIndex: 2 },
      {
        label: "A minor's notes one at a time, from your box.",
        kind: 'phrase',
        barIndex: 0,
        phrase: 'E4@0×2, A4@2×2, C5@4×4',
      },
      {
        label: "F's notes one at a time, from your box.",
        kind: 'phrase',
        barIndex: 1,
        phrase: 'C4@0×2, A4@2×2, C5@4×4',
      },
      {
        label: "G's notes one at a time, from your box.",
        kind: 'phrase',
        barIndex: 2,
        phrase: 'D4@0×4, G4@4×4',
      },
    ],
    try: {
      kind: 'pick-chord-notes',
      text: 'For each chord, click every note in your box that belongs to it, then press Done.',
      targets: [
        { chord: 'Am', names: ['A', 'C', 'E'] },
        { chord: 'F', names: ['A', 'C'] },
        { chord: 'G', names: ['G', 'D'] },
      ],
    },
    remember: "A chord is every other note of the scale. F and G each have one note you don't have in your five.",
  },
  {
    id: 'l4',
    number: 4,
    title: 'Chord notes are the notes that fit right now',
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
      text: 'Play the four-bar loop. The rings on the fretboard move to the chord notes each time the chord changes. End each bar on a ringed note.',
    },
    remember: 'Aim for the chord, not just the scale.',
  },
  {
    id: 'l5',
    number: 5,
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
      text: 'Write bar 4 so it ends on A. Then change only the last note to D, and press Hear it to compare.',
    },
    remember: 'Pass through tension, land on a chord note.',
  },
  {
    id: 'l6',
    number: 6,
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
      text: 'Build four bars from your own idea using the moves.',
    },
    remember: 'One idea, said again, changed, then finished.',
  },
  {
    id: 'l7',
    number: 7,
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
      text: 'Use a rhythm move or Spread them out, and add at least one rest.',
    },
    remember: 'Where a note lands matters as much as which note it is.',
  },
  {
    id: 'l8',
    number: 8,
    title: 'The blue note',
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
      text: 'In bar 2 or 3, add E♭ once, between D and E.',
    },
    remember: 'The blue note is a stepping stone, not a place to stop.',
  },
  {
    id: 'lfinal',
    number: 9,
    title: 'Your own four bars, no help',
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
      text: 'Write four bars with no rings, no moves, and no hints.',
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
