# Build log

## Stage 1 — scaffold and music core
Created a new Vite React app in `/Users/deepak/phrase-by-phrase` (not inside Within Reach). Pinned Vite 6 so it runs on Node 22.11. Put pentatonic box, landings, and empty-bar helpers in `src/music.js`. Default: 80 bpm, 8th-note grid, bar 1 is the idea.

What went wrong: Vite 8 from create-vite wants a newer Node. Corrected by installing Vite 6.4.1.

## Stage 2 — fretboard, bars, Karplus-Strong
Clickable 5–8 box, four bar cards, tab line, quiet Am–F–G–Am backing (sine pad + bass + hats) and Karplus-Strong guitar notes with fades so ends do not click. Highlight follows the current note.

What went wrong: backing through Karplus-Strong sounded thin. Corrected by keeping Karplus-Strong for the solo and using soft sines for pad/bass.

## Stage 3 — moves, shape, stuck, polish
Repeat / Change the rhythm / Answer with preview then apply. Bar 4 snaps the last note to A. Undo stack. Shape view labeled as a simple guide. “I am stuck” drops a curated bar-1 idea. Click a selected filled slot to delete it.

Default if the brief was vague: a move always writes the first empty bar; if every bar is full, it writes the selected bar.

## Stage 4 — guided one-step flow
The old one-screen layout was too much at once (fretboard, four bar cards, every move). Replaced it with Bar 1 → 4 steps, a horizontal neck (strings as lines, frets as lines), note chips, and a final “Your solo” screen. Music, sound, and scoring were not changed. Ring vs solid is labeled in plain words.

Default: clicking a neck dot appends to bar 1 with the next free 8th note. Moves write the current step’s bar from the previous bar. Bar 4 still forces the last note to A.

## Keyboard
A, C, D, E, and G play those note names. High (default) is A3–G4; Low is A2–G3. Z selects Low, X selects High. Shift+A is the A one octave above the current set, so A C D E G Shift+A climbs. Dots show only the note name. The line under the neck is “Keys: A C D E G. Shift+A = higher A. Z low, X high.” In step 1 a mapped key also appends to bar 1. Later steps only sound. C on high e fret 8 is click-only. Backspace, Space, the four-note cap, ignored repeats/modifiers/inputs, and AudioContext resume are unchanged.

## Idea length
Bar 1 now stops at four notes. A fifth click or key does not add anything and shows “Four notes is plenty for an idea. Press Backspace to change one.” Repeat copies every note and slot. Change-rhythm, answer, and shift keep the same note count, so bars 2–4 stay as long as the idea. Rhythm patterns used to keep only as many notes as they had onsets, which is why later bars looked shorter.

## Labels and later-bar choices
Note names on the neck are the large labels. Keyboard letters sit in small dim keycaps (A C D E G, and A+ for Shift+A), with a Show keys toggle (on in step 1, off later). The legend spells out “Small keycap = the key to press.” Bars 2–4 no longer show the neck. Each of those steps is one choice list and one “Put it in bar N” button. Bar 2’s list is “Say it again”: the exact repeat plus the four rhythms. Keyboard audition still plays notes on those steps.

## Bar 2–4 ringing
Previews on later bars had no chord under them and did not light the chips, so the notes felt dead. A one-bar preview now uses that bar’s backing (F, G, or Am), Karplus notes hold a little longer, and the chips flash as the phrase plays. Ring vs solid still shows on the chips after the neck is hidden.

## Three-string box
The neck is only G, B, and high e at frets 5–8: C4 D4 E4 G4 A4 C5. Keys C D E G A play those pitches (and add them in step 1); Shift+C is C5. No Low/High switch. Moves clamp to these six notes. Landings in this set are Am: C E A (and high C), F: A C, G: G D. Bar 4 always ends on A4. Tab is three lines, e/B/G.

## Rhythm
Notes now occupy real 8th-note lengths and fade without a click; a rest after a note stops it cleanly. Bar 2’s “Say it again” choices have audible long and short notes. Bar 3 picks a rhythm different from bars 1 and 2 and always leaves a gap. Bar 4 runs up (1, 1, 2) and holds A4 for four 8ths. “Leave space” (bars 2 and 3) turns one chosen note into a rest. The first note of each bar is a little louder. An 8-block strip under each bar shows the rhythm, and tension follows density, rests, and the long final hold.

## Practice tool — Stage 1 (feedback, rounds, library)
Create now sits in a five-section nav: Create, Practice, Improvise, Echo, Progress. Only Create is live. After four bars, Check names whether each bar ends on a home note (Am: A C E, F: A C, G: G D) and how many notes on beats 1 and 3 are home notes, in plain sentences. Round 1 still uses moves. Round 2 keeps the ring dots but you write every bar. Round 3 hides the rings. Saved phrases go to localStorage (`pbp-phrases`) with a name, Load, and Delete.

What went wrong: the first pass added helpers but left the old “Your solo” screen in place, so Check and the library never showed. Corrected by swapping that screen and routing rounds 2–3 through the fretboard. Keys still ignore repeats, Backspace undoes on hand-built bars, Space plays or stops.

Default: beats 1 and 3 are eighth-note slots 0 and 4. A high C counts as C. Round 2 and 3 do not force bar 4 onto A; Check still tells you if you landed on a home note.

## Lessons
Replaced the Check sentences with seven always-open lesson cards. Each card is a rule, one line from the current phrase, a status chip, and a Hear it A/B when that lesson has a contrast (home-note swap, last note vs A, two matching bars, even rhythm vs chosen rhythm). Hear it plays copies only. Cards sit under the four bars in Create, under a report stub in Improvise, and in a Lessons tab with an example and a use count. After each round: “Lessons used: X of 7.” After round 3 it also compares with round 1.

Tests in `scripts/check-music.js`: for each lesson, one phrase that uses it and one that does not. Also a mutation check that Hear it copies do not edit the saved bars.

What went wrong: a rest at the end of a bar is just unused time, so “silence” would have been true for almost every phrase. Corrected by counting only a hole before or between notes. Default: a scale run is three or more notes that walk one step on C D E G A C, counted across the whole phrase; “used” means at most one run. “Finished” means bar 4 ends on A. Repeat matches steps, including a transposition. Rhythm matches the same notes with different start times or lengths.

## Polish — Create and Lessons only
Nav is Create and Lessons. Practice, Echo, Progress, and Improvise are hidden; no “comes later” copy. “Home note” is now “chord note” in the UI, lessons, legend, and tests. Each bar step has a large badge such as “Bar 1: A minor chord (A, C, E)” above the neck, and the bar tabs read “Bar 1 · Am”. Create opens with a How this works strip. Lesson 1 is tagged Fact; the rest are Common guideline. The Lessons tab starts with “Guidelines are habits many players use. Trust your ears.” Play buttons sit next to “Click the page once to turn on sound.” Page title is Jimmy Page. `npm run check` and `npm run build` pass.

## Spread and rhythm clicks
“Spread them out” places the bar’s notes on slots 0, 2, 4, 6 (one every two blocks). Clicking a filled block in the rhythm strip grows that note by one eighth if the next slot is free; if it cannot grow, it snaps back to one block. Undo still covers both.

## Course Learn — Stage 1
COURSE.md is the source of truth. The Lessons tab is now Learn: a list of Lessons 1, 3, 4, and 5 with Done / Not done in localStorage (`pbp-learn`). Each lesson is one page with Learn, Hear it, Try it, Check, Remember, and Fact / Common guideline chips, using the course copy and `Note@slot×length` examples. Chord-only backing playback is on the engine. Lesson 1 is a three-question quiz; Lesson 3 is pick-the-chord-notes; Lesson 4 is a four-bar chord-note ending; Lesson 5 is bar 4 land-on-A plus a passing note. Create is unchanged. Lessons 2, 6–8, the final challenge, and What comes next are hidden until later stages.

What went wrong: Learn was drafted before it was wired into the nav, and Hear it needed a chord-only `playBacking` path. Corrected by swapping the tab to Learn and adding backing-only playback. Default: unfinished lessons are omitted from the list, not shown as “comes later.”

## Guided course — Stage A
The app now opens on a Course home (title, goal, who it is for, “N of 4 done”, Continue). Lessons 1, 3, 4 and 5 play in a one-step-at-a-time player (Learn, Hear it, Try it, Check, Recap) with Back/Next, a desktop sidebar, and a phone dropdown. The next lesson unlocks when Check passes. After three failed checks, “Show me the answer and continue” is offered. Create is renamed Free practice and stays always available. Progress and the current step save in `pbp-learn`. Music, keys, and checks are unchanged.

Default: this stage’s catalog is four lessons, so the header reads “Lesson X of 4”. Lessons 2, 6–8, the final challenge, and What comes next wait for Stages B and C.

## Theory course — Stage A
Switched guitar sound from Karplus-Strong to the acoustic samples in `public/samples/guitar-samples/` via Tone.js Sampler. Chords/opens can strum low to high at 18 ms. The course fretboard is 6 strings, frets 0–12, with note names / scale numbers / blank. Course home lists all 10 modules; only Module 1 is playable. Each concept uses Diagnose → Explain → Verify → Continue from THEORY_COURSE.md, with Not sure follow-ups, Why? after a correct verify, three-miss “Show me and continue”, and localStorage `pbp-theory`. Free practice is unchanged (3-string box). About quotes the sample credit line.

Modules 2–8, Module 9 (COURSE.md), Module 10, and the learning report wait for Stages B and C. Coming-next modules are labeled, not invented.

## Theory course — Stage 1 (responsive + Modules 2–4)
Copied the updated THEORY_COURSE.md (Modules 1–8). Modules 2–4 are playable with the same Diagnose / Explain / Verify / Continue player as Module 1. Strummed chords use the voicings table. Ending a module or Stop for now opens the five-heading learning report (or “Not enough answers yet to judge this.”). CSS: text wraps, full-width option buttons, `min-width: 0` on flex/grid text children, fretboard in its own horizontal scroll, side padding ≥16px. Tested 375 / 768 / 1280: question 1.1 wraps, no page overflow, fretboard scrolls only on small widths.

`npm run check` and `npm run build` passed.

Stage 2 (Modules 5–8) and Stage 3 (Module 9, Module 10, remove Free practice) are not started.

## Theory course — Modules 5–10
Modules 5–8 use the Diagnose / Explain / Verify / Continue player and the THEORY_COURSE.md copy (keys, minor, rhythm, pentatonic/box 1/blue note). Module 9 is COURSE.md Lessons 4–8 plus the final challenge, with the four-bar builder inside Try it. Module 10 is the roadmap page. Free practice is removed from the nav.

`npm run check` and `npm run build` passed.

## Polish — Module 9 numbering, audience, credits
Dropped Module 9 Lessons 1 and 3 (key/scale/chord and how chords are built); Modules 4–6 already cover that. Remaining lessons are 9.1 Chord notes through 9.6 Final challenge. Module title is “Improvising”. The module opens with “You've learned the theory. Now you'll practice using it, one lesson at a time.” Course home who-it's-for is now “Someone who can play a few songs on guitar but knows almost no theory.” About / Credits shows the sample README attribution line.

Phone width 375: home, Module 9 list, and 9.1 wrap with no horizontal overflow.

`npm run check` and `npm run build` passed.

## Continue summaries and lesson-card width
Continue used to add a recap line after a correct check, and the learning report used to open with a starting-point recap. Those recap lines are gone (see the later log entry). The lesson card stays within the viewport; only `.full-neck-wrap` scrolls sideways.

Tested 375 / 768 / 1280: page width matches the viewport; at 375 and 768 the fretboard wrap scrolls (860px inside a narrower card); at 1280 the neck fits.

`npm run check` and `npm run build` passed.

## Restart session
A Restart session button sits in the top-left of the header (Light/Dark stay top-right). It asks first, then clears theory and Module 9 progress on this computer, keeps the theme, and returns to course home.

## Play on your phone
Laptop shows Play on your phone when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set; otherwise the button is hidden and the laptop neck still works. QR uses `?phone=SESSION_ID`. Phone is a vertical 6-string 0–12 neck, Tap to start, acoustic samples, broadcast `hello`/`note`. Laptop treats a phone note like a click (Module 9 box only). Idle 15s marks disconnected. Laptop does not double-play phone taps.

Need a real Supabase project and those env vars on Vercel to test a phone on cellular against a laptop on wifi (iPhone Safari). Without the keys this pass only proves build and unit checks.

`npm run check` and `npm run build` passed.

## Continue: confirmation only
Continue no longer shows a recap of what happened. After a correct check the screen is the one-line confirmation plus Next concept / Revisit / Stop for now. The learning report has no starting-point recap heading. `src/` has none of that recap copy.

## Phone neck look and phone-first laptop
The phone neck keeps the same 6×13 tap grid. It now has a wood background, vertical string lines (thicker on the low strings), fret wires, a thicker nut above fret 1, and inlay dots at 3, 5, 7, 9, and a double at 12. Note names sit on top.

Course copy is “Play on your phone (recommended), or click the fretboard below.” A green or red pulsing dot marks connected vs not. When a phone is connected, the laptop neck is display-only, lights phone notes, and still highlights lesson notes, with “Playing from your phone” above it. When the phone is disconnected, the laptop neck is clickable again.

`npm run check` and `npm run build` passed.

## Course v3 player
COURSE_V3.md is now the only source of lesson copy, parsed into `src/course/lessons.json`. The Diagnose/Verify engine is replaced by Why → Teach → Examples → Practice → Quiz → Remember, with skip-to-quiz. Lessons use a split layout (50/50 at 1024, 55/45 at 768, stacked below) and a shared vertical guitar in a phone frame. Two-way sync sends targets/clear/result/chordGlow/rhythmTask to the phone and hello/note/rhythmResult back. `npm run check` verifies open strings E2 A2 D3 G3 B3 E4 and that every course position is a real note on frets 0–12. All 10 modules (36 lessons + roadmap) are in this pass.

Tested 375 / 768 / 1280: home lists 36 lessons; 1.1 split shows the phone-frame guitar with glowing teach targets.

`npm run check` and `npm run build` passed.

## Module 9 bar-by-bar builder
Lessons 9.1–9.6 share one builder: four bar cards, Hear the chord, box 1 on the phone and the frame (chord notes glow, other box notes normal, outside dimmed), up to four notes with undo/clear, last-note feedback, then Play all four bars over Am–F–G–Am at 80 bpm. Per-lesson goals match COURSE_V3 (passing land, idea moves with preview, rhythm/rest, E♭, five-goal challenge with first try vs later). Spec wording like “Pass:” is stripped from the UI. Play on your phone and the connection status sit once, next to the frame.

Tried a 1970s look (harvest/cream, burnt orange, Palatino, tighter padding, four bar cards across the top). Phone disconnected: laptop neck stays clickable and shows “Phone disconnected.” Phone tab reached Connected after Tap to start.

Layout follow-up: docked the phone CTA to the frame (no floating gutter), showed frets 0–12 instead of clipping at 7, packed the lesson card and top bar so Restart/theme no longer sit on the guitar.

`npm run check` and `npm run build` passed.
