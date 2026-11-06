# Phrase by Phrase

A small guitar tool: you enter 3–4 notes in A minor pentatonic, then develop them into a four-bar phrase. The app never writes the solo for you. No AI, no network calls.

```bash
npm install
npm run check
npm run dev
```

Open [http://127.0.0.1:5176](http://127.0.0.1:5176).

1. Click A, C, D (or any box notes) into bar 1.
2. Preview and apply **Repeat it** or **Change the rhythm** for bar 2.
3. Apply **Answer it** for bar 3.
4. Fill bar 4; the last note resolves to A.
5. Play four bars.

`src/music.js` holds scale, box, moves, and tension. `src/audio.js` holds Karplus-Strong playback.
