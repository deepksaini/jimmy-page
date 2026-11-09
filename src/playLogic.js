import { midiOf, pcOf } from './notes.js'
import { namesMatch, playedName, samePos } from './course/match.js'

export function remainingAfter(action, collected, tap) {
  const positions = action.positions || []
  if (action.pass?.type === 'note') {
    return namesMatch(playedName(tap.string, tap.fret), action.pass.name) ? [] : ['wait']
  }
  if (action.pass?.type === 'interval') {
    const next = [...collected, tap]
    if (next.length < 2) return ['wait']
    const [a, b] = next.slice(-2)
    const ok = a.string === action.pass.string && b.string === action.pass.string && Math.abs(a.fret - b.fret) === action.pass.frets
    return ok ? [] : ['wait']
  }
  if (action.acceptNotes?.length) {
    const name = playedName(tap.string, tap.fret)
    const ok = action.acceptNotes.some((note) => namesMatch(name, note))
    const done = [...collected, ...(ok ? [tap] : [])]
    const need = action.positions?.length || 1
    return ok && done.length >= need ? [] : positions.slice(done.length)
  }
  if (action.mode === 'set' || action.mode === 'any') {
    const left = positions.filter((pos) => !collected.some((hit) => samePos(hit, pos)))
    const hit = left.find((pos) => samePos(pos, tap))
    if (!hit && action.mode === 'any' && positions.some((pos) => namesMatch(playedName(tap.string, tap.fret), pos.name))) {
      return left.slice(1)
    }
    return hit ? left.filter((pos) => !samePos(pos, hit)) : left
  }
  const next = positions[collected.length]
  if (next && samePos(next, tap)) return positions.slice(collected.length + 1)
  return positions.slice(collected.length)
}

export function isCorrectTap(action, collected, tap) {
  const before = (action.positions || []).length - remainingAfter(action, collected, { string: -1, fret: -1 }).length
  const after = remainingAfter(action, collected, tap)
  if (action.pass?.type === 'interval') {
    if (collected.length === 0) return tap.string === action.pass.string
    const a = collected[0]
    return a.string === tap.string && Math.abs(a.fret - tap.fret) === action.pass.frets
  }
  if (action.pass?.type === 'note' || action.acceptNotes?.length) {
    const names = action.acceptNotes?.length ? action.acceptNotes : [action.pass.name]
    return names.some((note) => namesMatch(playedName(tap.string, tap.fret), note))
  }
  if (action.mode === 'set' || action.mode === 'any') {
    return (action.positions || []).some((pos) => samePos(pos, tap) && !collected.some((hit) => samePos(hit, pos)))
  }
  const next = (action.positions || [])[collected.length]
  return !!(next && samePos(next, tap))
}

export function fixFor(actionOrQuiz, tap) {
  const fixes = actionOrQuiz.fixes || []
  const named = playedName(tap.string, tap.fret)
  const hit = fixes.find((item) => item.when?.string && samePos(item.when, tap)) || fixes.find((item) => item.when === named) || fixes.find((item) => item.when === 'any')
  return hit?.fix || `That's ${named.replace('♯', '♯')}.`
}

export function chordNoteOk(glow, tap) {
  return glow.some((pos) => samePos(pos, tap) || pcOf(midiOf(pos.string, pos.fret)) === pcOf(midiOf(tap.string, tap.fret)))
}
