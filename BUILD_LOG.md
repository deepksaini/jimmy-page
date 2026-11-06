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
