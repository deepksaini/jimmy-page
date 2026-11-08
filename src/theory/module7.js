const A3 = { string: 3, fret: 2 }

export const MODULE_7 = {
  id: 'm7',
  number: 7,
  title: 'Rhythm',
  status: 'full',
  concepts: [
    {
      id: '7.1',
      name: 'Beats, bars and 4/4',
      chips: ['Fact'],
      diagnose: {
        prompt: 'In 4/4 time, how many beats are in one bar?',
        options: [
          { text: '3', gap: 'guess' },
          { text: '4', correct: true },
          { text: '8', gap: 'counting-ands' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'The beat is the steady pulse you tap your foot to. A bar groups beats together. In 4/4, the most common time in rock and pop, each bar has 4 beats, counted "1, 2, 3, 4", and then it starts again. Beat 1 usually feels the strongest.',
        guess:
          'The beat is the steady pulse you tap your foot to. A bar groups beats together. In 4/4, the most common time in rock and pop, each bar has 4 beats, counted "1, 2, 3, 4", and then it starts again. Beat 1 usually feels the strongest.',
        'counting-ands':
          '"1 and 2 and 3 and 4 and" splits each beat into two halves. That\'s 8 halves, but still 4 beats. The "ands" sit between the beats.',
      },
      hear: {
        caption: 'A click track with beat 1 louder, then a strum on every beat for two bars.',
        labelMode: 'names',
        highlighted: [],
        play: { kind: 'clicks-strum', bpm: 80, clickBars: 2, strumBars: 2, chord: 'Am' },
      },
      verify: [
        {
          prompt: 'What does the top 4 in 4/4 tell you?',
          options: [
            { text: 'There are 4 beats in each bar', correct: true },
            { text: 'Play 4 chords' },
            { text: 'The song is in the key of 4' },
          ],
          why: [
            { text: 'The top number counts the beats in a bar', correct: true },
            { text: 'It tells you how fast to play' },
          ],
          fix: 'Not yet. The top number counts the beats in a bar.',
        },
        {
          prompt: 'You count "1 and 2 and 3 and 4 and". How many beats is that?',
          options: [{ text: '4', correct: true }, { text: '8' }],
          why: [
            { text: 'The "ands" are halves between the beats, not extra beats', correct: true },
            { text: 'Every word you say is one beat' },
          ],
          fix: 'Not yet. The "ands" are halves between the beats, not extra beats.',
        },
      ],
      remember: '4/4 = four beats per bar. Beat 1 is the strongest.',
    },
    {
      id: '7.2',
      name: 'Note lengths and rests',
      chips: ['Fact'],
      diagnose: {
        prompt: 'In 4/4, how many beats does a half note last?',
        options: [
          { text: 'Half a beat', gap: 'literal-name' },
          { text: '2 beats', correct: true },
          { text: '1 beat', gap: 'mixup' },
          { text: 'Not sure', notSure: true, explain: 'default' },
        ],
      },
      explain: {
        default:
          'Note names describe how much of a 4/4 bar they fill. A whole note fills the bar (4 beats). A half note is half the bar (2 beats). A quarter note is 1 beat. An eighth note is half a beat (one "1" or one "and"). A rest is a silence of the same length. A quarter rest is one beat of silence.',
        'literal-name':
          'Note names describe how much of a 4/4 bar they fill. A whole note fills the bar (4 beats). A half note is half the bar (2 beats). A quarter note is 1 beat. An eighth note is half a beat (one "1" or one "and"). A rest is a silence of the same length. A quarter rest is one beat of silence.',
        mixup:
          'Note names describe how much of a 4/4 bar they fill. A whole note fills the bar (4 beats). A half note is half the bar (2 beats). A quarter note is 1 beat. An eighth note is half a beat (one "1" or one "and"). A rest is a silence of the same length. A quarter rest is one beat of silence.',
      },
      hear: {
        caption: 'One bar each: a whole note, two half notes, four quarter notes, eight eighth notes, all on A3.',
        labelMode: 'names',
        highlighted: [A3],
        play: {
          script: [
            { mode: 'seq', positions: [A3], hold: 2.9, gap: 3, pause: 0.25 },
            { mode: 'seq', positions: [A3, A3], hold: 1.4, gap: 1.5, pause: 0.25 },
            { mode: 'seq', positions: [A3, A3, A3, A3], hold: 0.65, gap: 0.75, pause: 0.25 },
            { mode: 'seq', positions: [A3, A3, A3, A3, A3, A3, A3, A3], hold: 0.32, gap: 0.38 },
          ],
        },
      },
      verify: [
        {
          prompt: 'How many eighth notes fit in one bar of 4/4?',
          options: [{ text: '4' }, { text: '8', correct: true }, { text: '16' }],
          why: [
            { text: 'Each beat holds two eighth notes, and 4 × 2 = 8', correct: true },
            { text: 'An eighth note lasts 8 beats' },
          ],
          fix: 'Not yet. Each beat holds two eighth notes, and 4 × 2 = 8.',
        },
        {
          prompt: 'A bar has a half note and a quarter note. How many beats are left?',
          options: [{ text: '1', correct: true }, { text: '2' }, { text: '0' }],
          why: [
            { text: '2 + 1 = 3 beats used, so 1 beat is left out of 4', correct: true },
            { text: 'A half note and a quarter note always fill the bar' },
          ],
          fix: 'Not yet. 2 + 1 = 3 beats used, so 1 beat is left out of 4.',
        },
        {
          prompt: 'What does a quarter rest mean?',
          options: [
            { text: 'Stay silent for one beat', correct: true },
            { text: 'Play softly for one beat' },
            { text: 'Skip a quarter of the song' },
          ],
          why: [
            { text: 'A rest is silence, and a quarter is one beat in 4/4', correct: true },
            { text: 'Rests mean play quieter' },
          ],
          fix: 'Not yet. A rest is silence, and a quarter is one beat in 4/4.',
        },
      ],
      remember: 'Whole = 4, half = 2, quarter = 1, eighth = ½. Rests are timed silences.',
    },
    {
      id: '7.3',
      name: 'Off the beat',
      chips: ['Fact', 'Common guideline'],
      diagnose: {
        hearFirst: true,
        prompt: 'Which one feels more pushed and bouncy?',
        hear: {
          caption: 'Two bars of the same chord: first, strums only on 1, 2, 3, 4. Second, strums landing on the "ands".',
          labelMode: 'names',
          highlighted: [],
          play: {
            kind: 'slot-strums',
            bpm: 80,
            bars: [
              { chord: 'Am', slots: [0, 2, 4, 6] },
              { chord: 'Am', slots: [1, 3, 5, 7] },
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
          'Notes on the numbers (1, 2, 3, 4) are on the beat. Notes on the "ands" are off the beat. Putting the stress on off-beats is called syncopation. It creates a pushing, bouncy feel that makes rhythm sound alive. Many rock riffs and solos rely on it.',
        hearing:
          'Notes on the numbers (1, 2, 3, 4) are on the beat. Notes on the "ands" are off the beat. Putting the stress on off-beats is called syncopation. It creates a pushing, bouncy feel that makes rhythm sound alive. Many rock riffs and solos rely on it.',
      },
      hear: {
        caption: 'Replay both bars with "1 and 2 and 3 and 4 and" shown, highlighting where each strum lands.',
        labelMode: 'names',
        highlighted: [],
        countLine: '1 and 2 and 3 and 4 and',
        play: {
          kind: 'slot-strums',
          bpm: 80,
          bars: [
            { chord: 'Am', slots: [0, 2, 4, 6] },
            { chord: 'Am', slots: [1, 3, 5, 7] },
          ],
        },
      },
      verify: [
        {
          prompt: 'In "1 and 2 and 3 and 4 and", which of these is off the beat?',
          options: [
            { text: 'The "and" after 2', correct: true },
            { text: 'Beat 3' },
            { text: 'Beat 1' },
          ],
          why: [
            { text: 'The "ands" sit between the beats', correct: true },
            { text: "Beat 3 is in the second half of the bar, so it's off" },
          ],
          fix: 'Not yet. The "ands" sit between the beats.',
        },
        {
          prompt: 'A note starts on the "and" of 4 and keeps ringing into beat 1 of the next bar. What is that?',
          options: [{ text: 'Syncopation', correct: true }, { text: 'A mistake' }, { text: 'A rest' }],
          why: [
            { text: 'It starts off the beat and pushes across the strong beat', correct: true },
            { text: 'Notes must start on a number' },
          ],
          fix: 'Not yet. It starts off the beat and pushes across the strong beat.',
        },
      ],
      remember: 'Numbers are on the beat. "Ands" are off the beat. Stressing them is syncopation.',
    },
  ],
}
