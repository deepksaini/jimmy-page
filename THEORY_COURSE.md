# Guitar Theory, Step by Step: Course Content and Teaching Method

This file is the source of truth for what the app teaches and how it teaches. **Do not invent course content.** If a concept below has no full content yet, show it as "Coming next" instead of making something up.

**Who it's for:** Someone who can play a few songs on guitar but knows almost no theory.

**Course goal (show on the course home):** Go from "I know a few chords" to understanding why notes and chords work, and using that to improvise your own phrases.

---

# Part 1: How the app teaches (adapted from the Paper Decoder tutor)

Every concept follows the same loop:

**Diagnose → Explain → Verify → Continue or Revisit**

Understanding, not the number of questions answered, decides when the learner moves on.

## Rules for the app

1. **One question per screen.** Never stack questions.
2. **Diagnose first.** Each concept opens with one question. Each wrong option points to a specific gap (shown below as `gap: name`). The app remembers which gap the learner showed.
3. **"Not sure" is a real answer.** If the learner picks it, show the concept's one short follow-up question before explaining anything. If no follow-up is written, go to the default explanation.
4. **Explain only the missing piece.** Show the explanation written for the learner's gap (at most about 120 words), one example, and the Hear / See demo. If the learner answered the diagnose question correctly, skip the explanation and go straight to Verify. Don't reteach what they already know.
5. **A right answer is not proof.** After every correct answer, ask "Why?" with reason options. Only a correct answer plus a correct reason counts as evidence.
6. **Verify with a new situation.** Verify questions use a different example from the one in the explanation, so the learner can't just repeat it.
   - Right answer and right reason: say briefly why it works, then go to Continue.
   - Right answer, wrong reason: say the answer may be right, show the right reason as a hint, and ask the next verify question. Stay in Verify.
   - Wrong answer: show a short, specific fix and ask a different verify question. Stay in Verify.
   - After 3 verify questions without a full success: offer "Show me and continue". Mark the concept as "not yet shown" (not as learned).
7. **Continue or Revisit.** After a correct check, show only the one-line confirmation and three buttons: **Next concept**, **Revisit with a new example** (uses any verify questions not yet seen), **Stop for now**. Do not add a summary of what happened.
8. **Never move on without the learner choosing to.**
9. **Status line** at the bottom of every concept screen: `Stage: Diagnose | Explain | Verify | Continue · Concept: [name]`.

## Learning report (end of each module, and when the learner stops)

Build it only from what the learner actually did. Never invent scores or gains. Four headings:

1. **What we covered**: the explanations and examples actually shown.
2. **Evidence**: their correct answer plus reason pairs, quoted.
3. **Still uncertain**: concepts skipped, revealed with "Show me", or verified only once.
4. **One next step**: one concrete suggestion aimed at the most uncertain concept.

If the learner stopped early, say plainly "Not enough answers yet to judge this."

## What the app saves (localStorage, per concept)

First diagnose answer, gap shown, explanations shown, each verify attempt (question, answer, reason, result), and status (learned / not yet shown / skipped).

## Sound and fretboard

- Use the real guitar samples in `public/samples/guitar-samples/` (see the README there). Acoustic is the default.
- Chords are strummed: play the notes from the lowest string to the highest, 15 to 20 ms apart.
- The course fretboard shows **all 6 strings, frets 0 to 12**, with string names (E A D G B E, thickest to thinnest). Modes: note names, scale numbers, or blank (for quizzes). The 3-string box is only used in Module 9.

### Chord voicings for strumming (low string to high)

| Chord | Shape | Notes to play |
|---|---|---|
| C | x32010 | C3 E3 G3 C4 E4 |
| G | 320003 | G2 B2 D3 G3 B3 G4 |
| D | xx0232 | D3 A3 D4 F♯4 |
| A | x02220 | A2 E3 A3 C♯4 E4 |
| E | 022100 | E2 B2 E3 G♯3 B3 E4 |
| F (small shape) | xx3211 | F3 A3 C4 F4 |
| Am | x02210 | A2 E3 A3 C4 E4 |
| Dm | xx0231 | D3 A3 D4 F4 |
| Em | 022000 | E2 B2 E3 G3 B3 E4 |
| Bm (small shape) | x2443x | B2 F♯3 B3 D4 |
| C minor (for 4.2) | x3554x | C3 G3 C4 E♭4 |

---

# Part 2: Course map (beginner to intermediate)

| Module | Title | Status |
|---|---|---|
| 1 | Notes and the fretboard | Full content below |
| 2 | Intervals: the distance between notes | Full content below |
| 3 | The major scale | Full content below |
| 4 | Chords | Full content below |
| 5 | Keys and chord progressions | Full content below |
| 6 | Minor keys | Full content below |
| 7 | Rhythm | Full content below |
| 8 | The pentatonic scale | Full content below |
| 9 | Improvising | Chord notes, landing, one idea, rhythm, blue note, final challenge |
| 10 | What comes next | Roadmap page |

---

# Part 3: Full content

How options are written: `✓` marks the correct answer. `gap: name` names the misunderstanding that a wrong option reveals. "Why?" reasons appear after the correct answer is chosen. One reason is correct (✓).

Note names in Hear / See use octave numbers (middle C = C4). Fret positions are given as string + fret.

---

## Module 1: Notes and the fretboard

### 1.1 The 12 notes

Chip: Fact

**Diagnose**
Q: How many different notes are there before the names start repeating?
- 7 → gap: letters-only
- 8 → gap: counted-twice
- 12 ✓
- Not sure → follow-up

Follow-up (Not sure): Notes are named with the letters A to G. Do you think there are any notes in between some of those letters?
- Yes → explain: default
- No → explain: letters-only
- Not sure → explain: default

**Explain**
- letters-only / default: There are 7 letter names: A B C D E F G. Between most of them sits one more note, written with a sharp (♯). Two pairs have nothing in between: B and C, and E and F. So the full set is A, A♯, B, C, C♯, D, D♯, E, F, F♯, G, G♯. That's 12 notes. After G♯ the names start again at A, just higher.
- counted-twice: 8 comes from counting the starting note twice: A ... up to the next A. That second A is the same note, only higher. There are 12 different notes before the names repeat.

**Hear / See**
Fretboard: A string, frets 0 to 12, labeled. Play each fret in turn, A2 to A3, while highlighting it.

**Verify**
V1. Which pair of letters has NO note in between?
- C and D
- E and F ✓
- G and A
- F and G

Why?
- E and F (and B and C) sit right next to each other in the musical alphabet ✓
- F is always a flat note
- Notes after E are always sharps

V2. Count up from C: C, C♯, D, D♯, E... What comes next?
- E♯
- F ✓
- F♯

Why?
- There's no note between E and F, so F comes straight after E ✓
- Every letter is followed by its sharp

V3. Count up from A: A, A♯, B... What comes next?
- B♯
- C ✓
- C♯

Why?
- There's no note between B and C ✓
- B always goes to C♯

**Remember:** 12 notes: 7 letters plus 5 in-between notes. Nothing sits between B and C, or E and F.

---

### 1.2 Half steps and whole steps

Chip: Fact

**Diagnose**
Q: On one guitar string, you move from fret 3 to fret 4. How big is that step?
- A half step ✓
- A whole step → gap: step-size
- It depends on which string → gap: strings-differ
- Not sure → follow-up

Follow-up (Not sure): Is fret 3 to fret 4 the smallest move you can make on one string?
- Yes → explain: default
- No → explain: step-size

**Explain**
- step-size / default: The smallest step in music is a **half step**, which is one fret on the guitar. Two frets make a **whole step**. C to C♯ is a half step. C to D is a whole step (C, C♯, D).
- strings-differ: Each string starts on a different note, but the spacing is the same on every string. Every fret raises the note by exactly one half step.

**Hear / See**
A string: fret 3 (C3) to fret 4 (C♯3), then fret 3 (C3) to fret 5 (D3).

**Verify**
V1. E to F is a...
- Half step ✓
- Whole step

Why?
- Nothing sits between E and F, so they're one fret apart ✓
- Moving from one letter to the next is always a whole step

V2. On the B string, fret 2 to fret 4 is a...
- Half step
- Whole step ✓

Why?
- Two frets is two half steps, which is one whole step ✓
- The B string is tuned differently, so its frets are bigger

V3. G to A is a...
- Half step
- Whole step ✓

Why?
- G♯ sits in between, so it's two half steps ✓
- G and A are both natural notes

**Remember:** 1 fret = half step. 2 frets = whole step.

---

### 1.3 Sharps, flats and two names for one note

Chip: Fact

**Diagnose**
Q: Do C♯ and D♭ sound the same?
- Yes ✓
- No → gap: different-sounds
- Not sure → explain: default

**Explain**
- different-sounds / default: A sharp (♯) means one half step higher. A flat (♭) means one half step lower. C♯ is one fret above C. D♭ is one fret below D. That's the same fret, so it's the same sound with two names. Which name gets used depends on the key, which you'll see in Module 3.

**Hear / See**
Show one fret labeled both C♯ and D♭ (A string, fret 4). Play it.

**Verify**
V1. What's another name for G♯?
- G♭
- A♭ ✓
- A♯

Why?
- G♯ is one fret above G, and A♭ is one fret below A. That's the same fret ✓
- Sharps and flats with the same letter are the same note

V2. What is one fret above E?
- F ✓
- F♯
- E♭

Why?
- There's no note between E and F, so one fret up from E is F ✓
- Going up one fret always adds a sharp to the letter

**Remember:** ♯ = up one fret. ♭ = down one fret. One sound can have two names.

---

### 1.4 String names and finding any note

Chip: Fact

**Diagnose**
Q: In standard tuning, what are the open strings from the thickest to the thinnest?
- E A D G B E ✓
- E B G D A E → gap: reversed
- A D G C E A → gap: unknown-tuning
- Not sure → explain: default

**Explain**
- default / unknown-tuning: From the thickest (lowest) string to the thinnest: **E A D G B E**. A memory trick: "Eddie Ate Dynamite, Good Bye Eddie." To find any note, start from the open string's name and count up one half step per fret.
- reversed: Those are the right names, but in the opposite order. E B G D A E goes from the thinnest string to the thickest. From the thickest (lowest sounding) string it's E A D G B E.

Tip (show after the explanation): Fret 5 on a string gives the same note as the next thinner string played open. The one exception is the G string, where it's fret 4.

**Hear / See**
Show the 6 open strings with names. Play each open string from low to high: E2, A2, D3, G3, B3, E4.

**Verify**
V1. What note is the A string, fret 3?
- B
- C ✓
- D
- C♯

Why?
- Count half steps from A: A♯ (1), B (2), C (3) ✓
- Each fret moves to the next letter: B, C, D

V2. What note is the low E string, fret 5?
- G
- A ✓
- B
- A♯

Why?
- Count up: F (1), F♯ (2), G (3), G♯ (4), A (5) ✓
- Count five letters after E: F, G, A, B

V3. Where is G on the D string?
- Fret 3
- Fret 4
- Fret 5 ✓
- Fret 7

Why?
- D♯ (1), E (2), F (3), F♯ (4), G (5) ✓
- G is three letters after D, so fret 3

**Remember:** E A D G B E, then count half steps up from the open string.

---

### 1.5 Octaves

Chip: Fact

**Diagnose**
Q: What does fret 12 on any string play?
- The same note as the open string, but higher ✓
- A completely new note → gap: new-note
- The same note as the open string, but lower → gap: direction
- Not sure → explain: default

**Explain**
- default / new-note: After 12 half steps the note names repeat. The repeated note is an **octave** higher. It sounds like the same note, just higher. That's why fret 12 has the same name as the open string, and why many guitars have a double dot there.
- direction: Moving up the frets always makes the note higher. Fret 12 is the open string's note, an octave higher.

**Hear / See**
A string open (A2), then fret 12 (A3), then both together.

**Verify**
V1. How many half steps make an octave?
- 7
- 8
- 12 ✓

Why?
- There are 12 different notes before the names repeat ✓
- An octave has 8 letters, like do-re-mi up to do

V2. The A string at fret 12 is A. What note is fret 15?
- B
- C ✓
- D

Why?
- After fret 12 the pattern restarts, so fret 15 is the same note as fret 3, which is C ✓
- Fret 15 is three letters after A

**Remember:** 12 half steps = one octave. Fret 12 = the open string, an octave higher.

---

## Module 2: Intervals, the distance between notes

### 2.1 What an interval is

Chip: Fact

**Diagnose**
Q: How many half steps is it from C up to E?
- 2 → gap: counting-letters
- 4 ✓
- 5 → gap: counting-both-ends
- Not sure → follow-up

Follow-up (Not sure): Count with me: C to C♯ is one half step. How many more to reach E?
- 2 → explain: counting-letters
- 3 ✓ (treat as correct, go to Verify)
- Not sure → explain: default

**Explain**
- default / counting-letters: An **interval** is the distance between two notes, counted in half steps (frets). Letters hide the notes in between, so count every one: C to C♯ (1), D (2), D♯ (3), E (4). C to E is 4 half steps, which is 4 frets.
- counting-both-ends: Count the moves, not the notes. C to C♯ is one move. You don't count the C you started on. C, C♯, D, D♯, E is 4 moves.

Reference table (show after explaining):

| Half steps | Name |
|---|---|
| 1 | minor 2nd |
| 2 | major 2nd |
| 3 | minor 3rd |
| 4 | major 3rd |
| 5 | perfect 4th |
| 6 | tritone |
| 7 | perfect 5th |
| 8 | minor 6th |
| 9 | major 6th |
| 10 | minor 7th |
| 11 | major 7th |
| 12 | octave |

**Hear / See**
A string fret 3 (C3), then fret 7 (E3), showing the 4 frets between.

**Verify**
V1. How many half steps from A up to C?
- 2
- 3 ✓
- 4

Why?
- A♯ (1), B (2), C (3) ✓
- A, B, C is three letters

V2. How many half steps from G up to D?
- 5
- 7 ✓
- 8

Why?
- G♯, A, A♯, B, C, C♯, D is 7 moves ✓
- G to D is four letters, and each letter is two half steps

**Remember:** An interval is the distance between two notes, counted in half steps.

---

### 2.2 Major and minor thirds

Chip: Fact (the half-step counts). Common guideline (bright versus dark).

**Diagnose** (hear first)
Play two pairs: C3 then E3, and C3 then E♭3.
Q: Which pair sounds darker or sadder?
- The first (C to E) → gap: no-ear-yet
- The second (C to E♭) ✓
- They sound the same → gap: no-ear-yet
- Not sure → explain: default

**Explain**
- default / no-ear-yet: A **major third** is 4 half steps (C to E). It sounds bright. A **minor third** is 3 half steps (C to E♭). It sounds darker. That single half step is the main difference between major and minor sounds. Listen again and focus on the second note.

**Hear / See**
Replay both pairs, then play each pair together.

**Verify**
V1. Is A to C a major or minor third?
- Major
- Minor ✓

Why?
- A to C is 3 half steps ✓
- A is a minor note

V2. Is G to B a major or minor third?
- Major ✓
- Minor

Why?
- G to B is 4 half steps ✓
- B is a natural note, so it's major

V3. Is D to F a major or minor third?
- Major
- Minor ✓

Why?
- D♯, E, F is 3 half steps ✓
- F is lower than F♯, so it's major

**Remember:** 4 half steps = major third (bright). 3 half steps = minor third (darker).

---

### 2.3 The perfect fifth

Chip: Fact (the count). Common guideline (stable sound).

**Diagnose** (hear first)
Play A2 and E3 together (low E string fret 5 plus A string fret 7).
Q: Does this sound stable or tense?
- Stable ✓
- Tense → gap: hearing
- Not sure → explain: default

**Explain**
- default / hearing: A to E is 7 half steps, a **perfect fifth**. It's one of the most stable, open-sounding intervals. Rock guitarists use it as the "power chord": low E string fret 5 (A) with A string fret 7 (E). Most players hear it as strong and settled, while the notes very close together (1 half step apart) sound tense.

**Hear / See**
Play the power chord, then A2 with A♯2 (1 half step) for contrast.

**Verify**
V1. Is C to G a perfect fifth?
- Yes ✓
- No

Why?
- C to G is 7 half steps ✓
- C and G are both natural notes

V2. Which note is a perfect fifth above E?
- A
- B ✓
- C

Why?
- E up 7 half steps: F, F♯, G, G♯, A, A♯, B ✓
- B is five letters after E

**Remember:** 7 half steps = perfect fifth. Strong and stable.

---

### 2.4 Tension and release

Chip: Common guideline

**Diagnose** (hear first)
Play a C major chord, then B3 moving to C4, then B3 moving to A3.
Q: Which move sounds more like an ending?
- B to C ✓
- B to A → gap: no-pull-yet
- Not sure → explain: default

**Explain**
- default / no-pull-yet: Some notes create **tension**: the ear expects them to move. Notes one half step away from a stable note pull strongly toward it. B is one half step below C, so over a C chord, B moving up to C sounds like arriving. That's **release**. Music feels alive because it moves between tension and release.

**Hear / See**
Replay both, with the C chord underneath.

**Verify**
V1. Over a C chord, which note pulls most strongly to C?
- G
- E
- B ✓

Why?
- B is one half step below C ✓
- B is the last letter, so it goes back to the start

V2. Over an A minor chord, which note sounds like it wants to move: A, E, or D?
- A
- E
- D ✓

Why?
- D isn't in the A minor chord (A, C, E), so it wants to move to C or E ✓
- D is the lowest note

**Remember:** Tension wants to move. Release is landing on a stable note.

---

## Module 3: The major scale

### 3.1 The major scale pattern

Chip: Fact

**Diagnose**
Q: Which notes make up the C major scale?
- C D E F G A B ✓
- C D E F♯ G A B → gap: random-sharps
- C D E G A → gap: pentatonic-mixup
- Not sure → explain: default

**Explain**
- default / random-sharps: A major scale follows one step pattern: **Whole, Whole, Half, Whole, Whole, Whole, Half** (W W H W W W H). From C that gives C (W) D (W) E (H) F (W) G (W) A (W) B (H) C. The two half steps land exactly on E to F and B to C, where there's no note in between. That's why C major has no sharps or flats.
- pentatonic-mixup: C D E G A is a five-note scale (the pentatonic, Module 8). The full major scale has seven notes: C D E F G A B. It follows the pattern W W H W W W H.

**Hear / See**
Play C3 up to C4 along the A, D and G strings, labeling each step W or H.

**Verify**
V1. Why does C major have no sharps or flats?
- Because the half steps in the pattern fall on E to F and B to C, which are already half steps ✓
- Because C is the first letter
- Because no major scale has sharps

V2. In the pattern W W H W W W H, where are the two half steps?
- Between notes 3 and 4, and between 7 and 8 ✓
- Between notes 1 and 2, and between 4 and 5
- There's only one

Why?
- In C major these are E to F and B to C ✓
- The half steps come at the start of each half of the scale

**Remember:** Major scale = W W H W W W H.

---

### 3.2 Building a major scale on any note

Chip: Fact

**Diagnose**
Q: Build G major with W W H W W W H. What is the 7th note?
- F → gap: naturals-only
- F♯ ✓
- E → gap: miscount
- Not sure → explain: default

**Explain**
- default / naturals-only: Start on G and follow the pattern: G (W) A (W) B (H) C (W) D (W) E (W) F♯ (H) G. From E, a whole step lands on F♯, not F. That's why the key of G has one sharp. Each letter is used once in a scale, which is why we write B♭ in F major and not A♯.
- miscount: Count again: G is 1, A is 2, B is 3, C is 4, D is 5, E is 6. The 7th is a whole step above E, which is F♯.

**Hear / See**
Play G major from G3 on the low strings, with F♯ highlighted.

**Verify**
V1. D major is D E F♯ G A B C♯. Which notes are sharp?
- F♯ only
- F♯ and C♯ ✓
- C♯ and G♯

Why?
- Following W W H W W W H from D lands on F♯ and C♯ ✓
- D major always copies G major's sharps

V2. Build F major. What is the 4th note?
- B
- B♭ ✓
- C

Why?
- Notes 3 to 4 are a half step, and a half step above A is B♭ ✓
- F major starts with F, so it must have a flat somewhere

**Remember:** Any note + W W H W W W H = its major scale. Use each letter once.

---

### 3.3 Scale numbers

Chip: Fact

**Diagnose**
Q: In G major (G A B C D E F♯), which note is number 5?
- C → gap: miscount
- D ✓
- E → gap: miscount
- Not sure → explain: default

**Explain**
- default / miscount: Number the notes of a scale from 1 to 7. In C major: C = 1, D = 2, E = 3, F = 4, G = 5, A = 6, B = 7. Numbers let you talk about any key at once. "1, 3, 5" means C, E, G in C major, and G, B, D in G major. Number 1 is home.

**Hear / See**
Fretboard in "scale numbers" mode for C major, then G major.

**Verify**
V1. In D major (D E F♯ G A B C♯), what are 1, 3 and 5?
- D F A
- D F♯ A ✓
- D G A

Why?
- Count the notes of D major: D is 1, F♯ is 3, A is 5 ✓
- 1, 3, 5 is always D, F, A

V2. In any major scale, which number is home?
- 1 ✓
- 5
- 7

Why?
- The scale starts and feels finished on 1 ✓
- 7 is the last note, so it's home

**Remember:** Numbers are positions in the scale. 1 is home.

---

## Module 4: Chords

### 4.1 What a chord is

Chip: Fact

**Diagnose**
Q: What is a chord?
- Three or more notes played together ✓
- Two notes played one after the other → gap: melody-vs-chord
- One loud note → gap: melody-vs-chord
- Not sure → explain: default

**Explain**
- default / melody-vs-chord: A **chord** is several notes sounding together. Notes one after another make a melody. The basic chord, a **triad**, uses notes 1, 3 and 5 of a scale, which is every other note. The C major chord is C, E, G.

**Hear / See**
Strum an open C chord (C3, E3, G3, C4, E4). Then play its notes one at a time.

**Verify**
V1. Which notes make a G major chord?
- G B D ✓
- G A B
- G C D

Why?
- Take every other note of G major, starting from G: G, B, D ✓
- Take the first three notes of the scale

V2. The open C chord has five strings playing. How many different note names does it have?
- 5
- 3 ✓
- 2

Why?
- It only uses C, E and G. Some are repeated in another octave ✓
- Every string plays a different note

**Remember:** A triad is notes 1, 3 and 5 of a scale.

---

### 4.2 Major and minor chords

Chip: Fact (the counts). Common guideline (bright versus dark).

**Diagnose** (hear first)
Strum C major (C, E, G), then C minor (C, E♭, G).
Q: Which one is the minor chord?
- The first → gap: no-ear-yet
- The second ✓
- Not sure → explain: default

**Explain**
- default / no-ear-yet: Both chords have a root and a fifth (7 half steps apart). The difference is the middle note. A **major** chord stacks a major third (4 half steps) then a minor third (3): C, E, G. A **minor** chord stacks a minor third (3) then a major third (4): C, E♭, G. Only the middle note moves, by one half step.

**Hear / See**
Strum both chords again, highlighting the moving note E to E♭.

**Verify**
V1. Is A, C, E a major or minor chord?
- Major
- Minor ✓

Why?
- A to C is 3 half steps, so the bottom third is minor ✓
- All the notes are natural, so it's minor

V2. E major is E, G♯, B. To make E minor, which note changes?
- E
- G♯ becomes G ✓
- B becomes B♭

Why?
- The middle note drops one half step to make the bottom third minor ✓
- The top note always changes in a minor chord

V3. Is D, F♯, A major or minor?
- Major ✓
- Minor

Why?
- D to F♯ is 4 half steps, a major third ✓
- It has a sharp, so it's minor

**Remember:** Major = 4 half steps, then 3. Minor = 3 half steps, then 4.

---

### 4.3 The chords that belong to a key

Chip: Fact

**Diagnose**
Q: Which of these chords belongs to the key of C major (notes C D E F G A B)?
- D major (D, F♯, A) → gap: outside-notes
- D minor (D, F, A) ✓
- E major (E, G♯, B) → gap: outside-notes
- Not sure → explain: default

**Explain**
- default / outside-notes: Build a triad on every note of the scale, using only notes from that scale. In C major: C E G (C), D F A (D minor), E G B (E minor), F A C (F), G B D (G), A C E (A minor), B D F (B diminished, two minor thirds stacked). Every major key follows the same pattern: **I ii iii IV V vi vii°**. Uppercase means major, lowercase means minor, and ° means diminished. D major needs F♯, which isn't in C major, so it doesn't belong.

**Hear / See**
Strum the seven chords of C major in order.

**Verify**
V1. In C major, what is chord V?
- G major ✓
- G minor
- F major

Why?
- The 5th note is G, and in the pattern V is uppercase, so it's major ✓
- V means five letters after C

V2. In G major (G A B C D E F♯), what is chord vi?
- E major
- E minor ✓
- D major

Why?
- The 6th note is E, and vi is lowercase, so it's minor: E, G, B ✓
- vi is always A minor

**Remember:** Every major key: I ii iii IV V vi vii°.

---

## Module 5: Keys and chord progressions

### 5.1 What a key is

Chip: Fact

**Diagnose**
Q: What is a song's key?
- A scale and the chords built from it, with one note and chord that feel like home ✓
- The first chord of the song → gap: first-chord
- The highest note in the song → gap: highest-note
- Not sure → explain: default

**Explain**
- default / highest-note: A **key** is a home base. It's a scale (like C major) plus the seven chords built from that scale (Module 4). One note and one chord feel like home: in C major, the note C and the C chord. Songs pull back toward that home, and they often start and end there.
- first-chord: Songs often start on the home chord, but not always. The key is about which chord feels like home, not which one comes first. A song in C major might start on Am and still keep coming back to C.

**Hear / See**
Strum C, F, G, then C. Then strum C, F, G and stop on G. The first sounds finished, the second sounds like it's waiting.

**Verify**
V1. In the key of G major, which chord feels like home?
- C
- G ✓
- D

Why?
- G is chord I, the home chord of G major ✓
- G is the first letter of the key's name, so it's played first

V2. Which group of chords belongs to the key of G major (G A B C D E F♯)?
- G, C, D, Em ✓
- G, C, D, E major
- G, F, C, D

Why?
- G, C, D and Em use only notes from G major ✓
- They're the most popular chords

**Remember:** A key is a scale plus its chords, with one home.

---

### 5.2 Chord numbers and common progressions

Chip: Fact (the numbers). Common guideline (where each progression is common).

**Diagnose**
Q: In a progression, what does "IV" mean?
- The chord built on the 4th note of the key ✓
- The fourth chord you play → gap: order-not-position
- Play four chords → gap: order-not-position
- Not sure → explain: default

**Explain**
- default / order-not-position: Musicians name chords by their position in the key, using the numbers from Module 4. In C major: I = C, IV = F, V = G, vi = Am. So "I–IV–V" means C–F–G in C, and G–C–D in G. Numbers let one progression work in any key. Three very common ones:
  - **I–IV–V**: rock and blues (C–F–G)
  - **I–V–vi–IV**: a huge number of pop songs (C–G–Am–F)
  - **ii–V–I**: jazz (Dm–G–C)

**Hear / See**
Strum I–V–vi–IV in C (C, G, Am, F), then the same numbers in G (G, D, Em, C). Same feeling, different key.

**Verify**
V1. What is I–IV–V in G major?
- G, C, D ✓
- G, A, B
- G, D, Em

Why?
- The 1st, 4th and 5th notes of G major are G, C and D, and those chords are major ✓
- I–IV–V means the first three chords after G

V2. What is I–IV–V in A major (A B C♯ D E F♯ G♯)?
- A, D, E ✓
- A, B, C♯
- A, D, Em

Why?
- The 1st, 4th and 5th notes of A major are A, D and E ✓
- Chord V is always minor

V3. What is ii–V–I in C major?
- Dm, G, C ✓
- D, G, C
- C, G, Dm

Why?
- ii is the 2nd note (D) and lowercase, so minor. Then V is G and I is C ✓
- ii means play D twice

**Remember:** Chord numbers come from positions in the key. I–IV–V and I–V–vi–IV are everywhere.

---

### 5.3 Finding the key of a song

Chip: Common guideline

**Diagnose**
Q: A song uses G, C, D and Em, and keeps ending on G. What key is it most likely in?
- G major ✓
- C major → gap: chord-set
- D major → gap: chord-set
- Not sure → explain: default

**Explain**
- default / chord-set: Use two clues. First, which chord feels like home? It's usually the one the song ends on or keeps returning to. Second, which key contains all the chords? G, C, D and Em are I, IV, V and vi of G major. C major can't be right, because the D major chord needs F♯, which isn't in C major.

**Hear / See**
Play a short loop of G, Em, C, D that ends on G.

**Verify**
V1. A song uses C, F, G and Am, and ends on C. Key?
- C major ✓
- F major
- G major

Why?
- C, F, G and Am all fit C major, and C feels like home ✓
- F appears, so it must be F major

V2. A song uses D, G, A and Bm, and ends on D. Key?
- D major ✓
- G major
- A major

Why?
- D, G, A and Bm are I, IV, V and vi of D major, and D feels like home ✓
- A is the highest chord

**Remember:** Find home by ear, then check which key contains every chord.

---

## Module 6: Minor keys

### 6.1 The relative minor

Chip: Fact

**Diagnose**
Q: Do C major and A minor use the same notes?
- Yes ✓
- No → gap: different-notes
- Not sure → explain: default

**Explain**
- default / different-notes: Play the C major scale but start and end on its 6th note, A: A B C D E F G A. That's **A natural minor**. It has exactly the same notes as C major. Only the home changes, from C to A, and that makes it sound darker. A minor is called the **relative minor** of C major. Every major key has one, starting on its 6th note, which is 3 half steps below the major key's home.

**Hear / See**
Play the notes C to C over a C chord, then A to A over an Am chord.

**Verify**
V1. What is the relative minor of G major (G A B C D E F♯)?
- E minor ✓
- A minor
- D minor

Why?
- The 6th note of G major is E ✓
- The relative minor of every major key is A minor

V2. What is the relative minor of D major (D E F♯ G A B C♯)?
- B minor ✓
- A minor
- F♯ minor

Why?
- B is the 6th note of D major, 3 half steps below D ✓
- Take the next letter after D

**Remember:** Same notes, different home. The relative minor starts on the 6th note.

---

### 6.2 The natural minor pattern

Chip: Fact

**Diagnose**
Q: In A natural minor, what is the 3rd note?
- C ✓
- C♯ → gap: major-pattern
- B → gap: miscount
- Not sure → explain: default

**Explain**
- default / major-pattern / miscount: The natural minor scale has its own step pattern: **W H W W H W W**. From A: A (W) B (H) C (W) D (W) E (H) F (W) G (W) A. The 3rd note is a half step plus a whole step above the 2nd, giving C. A minor third (3 half steps) from home is what makes it sound minor. C♯ would be a major third, the major pattern from Module 3.

**Hear / See**
Play A natural minor with each step labeled W or H.

**Verify**
V1. What are the notes of E natural minor?
- E F♯ G A B C D ✓
- E F♯ G♯ A B C♯ D♯
- E F G A B C D

Why?
- Following W H W W H W W from E lands on F♯ as the only sharp ✓
- E minor always copies E major's notes

V2. In natural minor, the step between notes 2 and 3 is a...
- Half step ✓
- Whole step

Why?
- The pattern is W H W W H W W, and the H comes second ✓
- Every step in a minor scale is a half step

**Remember:** Natural minor = W H W W H W W.

---

### 6.3 Chords in a minor key

Chip: Fact

**Diagnose**
Q: In the key of A minor, chord i is...
- A minor ✓
- A major → gap: case
- C major → gap: relative-home
- Not sure → explain: default

**Explain**
- default / case / relative-home: Build triads on the natural minor scale the same way as in Module 4. In A minor you get Am, B diminished, C, Dm, Em, F, G. The pattern for every minor key is **i ii° III iv v VI VII**. Lowercase means minor, uppercase means major. The home chord, i, is minor. Common minor progressions are **i–VI–VII** (Am–F–G) and **i–iv–v** (Am–Dm–Em).

**Hear / See**
Strum Am, F, G, Am. Then Am, Dm, Em, Am.

**Verify**
V1. In A minor, what is chord VI?
- F ✓
- Dm
- G

Why?
- The 6th note of A minor is F, and VI is uppercase, so it's F major ✓
- VI is six letters after A

V2. Am, F, G is which progression?
- i–VI–VII ✓
- i–IV–V
- vi–IV–V

Why?
- In A minor, Am is i, F is VI and G is VII ✓
- Every three-chord progression is i–IV–V

V3. In E minor (E F♯ G A B C D), what is chord iv?
- A minor ✓
- A major
- D major

Why?
- The 4th note is A, and iv is lowercase, so it's A minor (A, C, E) ✓
- iv is always D minor

**Remember:** Minor keys: i ii° III iv v VI VII. Am–F–G is i–VI–VII.

---

## Module 7: Rhythm

### 7.1 Beats, bars and 4/4

Chip: Fact

**Diagnose**
Q: In 4/4 time, how many beats are in one bar?
- 3 → gap: guess
- 4 ✓
- 8 → gap: counting-ands
- Not sure → explain: default

**Explain**
- default / guess: The **beat** is the steady pulse you tap your foot to. A **bar** groups beats together. In **4/4**, the most common time in rock and pop, each bar has 4 beats, counted "1, 2, 3, 4", and then it starts again. Beat 1 usually feels the strongest.
- counting-ands: "1 and 2 and 3 and 4 and" splits each beat into two halves. That's 8 halves, but still 4 beats. The "ands" sit between the beats.

**Hear / See**
A click track with beat 1 louder, then a strum on every beat for two bars.

**Verify**
V1. What does the top 4 in 4/4 tell you?
- There are 4 beats in each bar ✓
- Play 4 chords
- The song is in the key of 4

Why?
- The top number counts the beats in a bar ✓
- It tells you how fast to play

V2. You count "1 and 2 and 3 and 4 and". How many beats is that?
- 4 ✓
- 8

Why?
- The "ands" are halves between the beats, not extra beats ✓
- Every word you say is one beat

**Remember:** 4/4 = four beats per bar. Beat 1 is the strongest.

---

### 7.2 Note lengths and rests

Chip: Fact

**Diagnose**
Q: In 4/4, how many beats does a half note last?
- Half a beat → gap: literal-name
- 2 beats ✓
- 1 beat → gap: mixup
- Not sure → explain: default

**Explain**
- default / literal-name / mixup: Note names describe how much of a 4/4 bar they fill. A **whole note** fills the bar (4 beats). A **half note** is half the bar (2 beats). A **quarter note** is 1 beat. An **eighth note** is half a beat (one "1" or one "and"). A **rest** is a silence of the same length. A quarter rest is one beat of silence.

**Hear / See**
One bar each: a whole note, two half notes, four quarter notes, eight eighth notes, all on A3.

**Verify**
V1. How many eighth notes fit in one bar of 4/4?
- 4
- 8 ✓
- 16

Why?
- Each beat holds two eighth notes, and 4 × 2 = 8 ✓
- An eighth note lasts 8 beats

V2. A bar has a half note and a quarter note. How many beats are left?
- 1 ✓
- 2
- 0

Why?
- 2 + 1 = 3 beats used, so 1 beat is left out of 4 ✓
- A half note and a quarter note always fill the bar

V3. What does a quarter rest mean?
- Stay silent for one beat ✓
- Play softly for one beat
- Skip a quarter of the song

Why?
- A rest is silence, and a quarter is one beat in 4/4 ✓
- Rests mean play quieter

**Remember:** Whole = 4, half = 2, quarter = 1, eighth = ½. Rests are timed silences.

---

### 7.3 Off the beat

Chip: Fact (where the off-beats are). Common guideline (how it feels).

**Diagnose** (hear first)
Play two bars of the same chord: first, strums only on 1, 2, 3, 4. Second, strums landing on the "ands".
Q: Which one feels more pushed and bouncy?
- The first → gap: hearing
- The second ✓
- Not sure → explain: default

**Explain**
- default / hearing: Notes on the numbers (1, 2, 3, 4) are **on the beat**. Notes on the "ands" are **off the beat**. Putting the stress on off-beats is called **syncopation**. It creates a pushing, bouncy feel that makes rhythm sound alive. Many rock riffs and solos rely on it.

**Hear / See**
Replay both bars with "1 and 2 and 3 and 4 and" shown, highlighting where each strum lands.

**Verify**
V1. In "1 and 2 and 3 and 4 and", which of these is off the beat?
- The "and" after 2 ✓
- Beat 3
- Beat 1

Why?
- The "ands" sit between the beats ✓
- Beat 3 is in the second half of the bar, so it's off

V2. A note starts on the "and" of 4 and keeps ringing into beat 1 of the next bar. What is that?
- Syncopation ✓
- A mistake
- A rest

Why?
- It starts off the beat and pushes across the strong beat ✓
- Notes must start on a number

**Remember:** Numbers are on the beat. "Ands" are off the beat. Stressing them is syncopation.

---

## Module 8: The pentatonic scale

### 8.1 The minor pentatonic

Chip: Fact

**Diagnose**
Q: Which notes make up A minor pentatonic?
- A C D E G ✓
- A B C D E → gap: first-five
- A C E → gap: chord-not-scale
- Not sure → explain: default

**Explain**
- default / first-five: "Penta" means five. Take A natural minor (A B C D E F G) and leave out notes 2 and ♭6, which are B and F. You get **A C D E G**. With those two gone, there are no half steps left in the scale, only gaps of 3 or 2 half steps. That makes it very hard to hit a note that clashes, which is why it's the favorite scale for rock and blues soloing.
- chord-not-scale: A, C, E is the A minor chord (Module 4). The pentatonic scale adds D and G to it: A C D E G.

**Hear / See**
Play A natural minor, then A minor pentatonic, highlighting the two notes that disappear.

**Verify**
V1. Which two notes of A natural minor are left out?
- B and F ✓
- C and G
- D and E

Why?
- Notes 2 (B) and ♭6 (F) are removed, which also removes the half steps ✓
- The two highest notes are removed

V2. What is E minor pentatonic? (E natural minor is E F♯ G A B C D.)
- E G A B D ✓
- E F♯ G A B
- E G B

Why?
- Remove notes 2 (F♯) and ♭6 (C) from E natural minor ✓
- Take the first five notes

**Remember:** Minor pentatonic = natural minor without 2 and ♭6. No half steps.

---

### 8.2 The major pentatonic

Chip: Fact

**Diagnose**
Q: Do C major pentatonic and A minor pentatonic share the same notes?
- Yes ✓
- No → gap: different-notes
- Not sure → explain: default

**Explain**
- default / different-notes: The **major pentatonic** is the major scale without notes 4 and 7. C major (C D E F G A B) without F and B gives **C D E G A**. Those are exactly the notes of A minor pentatonic (A C D E G). They're relatives, just like C major and A minor in Module 6. Which one you hear depends on which note feels like home, and that depends on the chords underneath.

**Hear / See**
Play C D E G A over a C chord, then the same notes over an Am chord.

**Verify**
V1. What is G major pentatonic? (G major is G A B C D E F♯.)
- G A B D E ✓
- G A B C D
- G B D

Why?
- Remove notes 4 (C) and 7 (F♯) ✓
- Take the first five notes

V2. Which minor pentatonic has the same notes as G major pentatonic?
- E minor pentatonic ✓
- A minor pentatonic
- D minor pentatonic

Why?
- E is G major's relative minor, and E minor pentatonic is E G A B D ✓
- A minor pentatonic fits with everything

**Remember:** Major pentatonic = major scale without 4 and 7. It shares notes with its relative minor pentatonic.

---

### 8.3 Box 1 on the guitar

Chip: Fact

**Diagnose**
Q: At which fret does the A minor pentatonic "box 1" start on the low E string?
- Fret 5 ✓
- Fret 0 → gap: open-position
- Fret 7 → gap: guess
- Not sure → explain: default

**Explain**
- default / open-position / guess: Box 1 starts on the home note on the low E string. A is at fret 5 there (Module 1), so the box covers frets 5 to 8:
  - Low E: 5 (A), 8 (C)
  - A: 5 (D), 7 (E)
  - D: 5 (G), 7 (A)
  - G: 5 (C), 7 (D)
  - B: 5 (E), 8 (G)
  - High e: 5 (A), 8 (C)
  
  The shape is movable. Put its first note on a different home note on the low E string and you get that key's minor pentatonic.

**Hear / See**
Fretboard showing box 1 with the A notes highlighted. Play it from low to high and back.

**Verify**
V1. Where would box 1 start for G minor pentatonic?
- Fret 3 ✓
- Fret 5
- Fret 7

Why?
- G is at fret 3 on the low E string, and the same shape moves there ✓
- Every minor pentatonic starts at fret 5

V2. In box 1 of A minor pentatonic, which notes are A (home)?
- Low E fret 5, D string fret 7, high e fret 5 ✓
- A string fret 5, B string fret 8
- Every fret 5

Why?
- Those three spots are all A, in different octaves ✓
- Fret 5 is always the home note

**Remember:** Box 1 starts on the home note on the low E string. The shape moves to any key.

---

### 8.4 The blue note

Chip: Fact (the note). Common guideline (how to use it).

**Diagnose** (hear first)
Over an Am chord, play D3 to E3, then D3, E♭3, E3.
Q: Which one sounds more bluesy?
- The first → gap: hearing
- The second ✓
- Not sure → explain: default

**Explain**
- default / hearing: The **blue note** is the ♭5, the note between 4 and 5. In A minor pentatonic it's **E♭**, between D and E. It adds a tense, bluesy edge. Adding it to the pentatonic gives the **blues scale**: A C D E♭ E G. It's so tense that players use it as a passing note. They slide or step through it, and don't stop on it. In box 1 it sits at A string fret 6 and G string fret 8.

**Hear / See**
Play the A blues scale through box 1, highlighting E♭.

**Verify**
V1. What is the blue note in E minor pentatonic (E G A B D)?
- B♭ ✓
- C
- F

Why?
- It's the ♭5: 6 half steps above E, between A and B ✓
- It's the note after the highest note in the scale

V2. Where is the blue note best used?
- As a quick passing note between 4 and 5 ✓
- As the last note of a phrase
- Held as long as possible

Why?
- It's very tense, so it works best leading into a stable note ✓
- Tension is best when it's never resolved

**Remember:** The blue note is ♭5. Pass through it, don't stop on it.

## Module 9: Improvising
You've learned the theory. Now you'll practice using it, one lesson at a time.

Lessons 1 and 3 from COURSE.md are omitted here because Modules 4–6 already cover key/scale/chord and how chords are built. The app uses 9.1 Chord notes, 9.2 Passing notes and landing, 9.3 One idea, four bars, 9.4 Rhythm and space, 9.5 The blue note in a phrase, 9.6 Final challenge. Backing (Am, F, G, Am) is i, VI, VII, i from Module 6.

## Module 10: What comes next (roadmap page)
- Seventh chords and how their extra note changes what fits.
- The other four pentatonic positions, and the CAGED system for linking shapes across the neck.
- Modes as colors: Dorian (natural minor with a raised 6th, F♯ in A) and Mixolydian (major with a ♭7).
- Bends and vibrato.
- A listening mode that hears your real guitar.

---

## Review note
"Common guideline" items describe habits many players hear and use, not rules. All content should be reviewed by an experienced guitarist before release.
