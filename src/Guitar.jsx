import { inBox1, isBlueNote } from './barBuilder.js'
import { COURSE_FRETS, COURSE_STRINGS, midiOf, noteName } from './notes.js'

const DOTS = { 3: 1, 5: 1, 7: 1, 9: 1, 12: 2 }

export default function Guitar({
  namesOn = true,
  onTap,
  interactive = true,
  targets = [],
  currentIndex = 0,
  mode = 'sequence',
  chordGlow = [],
  flash = null,
  cursor = null,
  boxMode = false,
  allowBlue = false,
}) {
  function stateFor(string, fret) {
    if (flash && flash.string === string && flash.fret === fret) return flash.ok ? 'correct' : 'wrong'
    if (cursor && cursor.string === string && cursor.fret === fret) return 'now'
    const glowHit = chordGlow.some((item) => item.string === string && item.fret === fret)
    if (glowHit) return 'glow'
    const idx = targets.findIndex((item) => item.string === string && item.fret === fret)
    if (idx >= 0) {
      if (mode === 'sequence' && idx === currentIndex) return 'target-now'
      if (mode === 'sequence' && idx > currentIndex) return 'target'
      if (mode !== 'sequence') return 'target-now'
      return 'target'
    }
    if (boxMode && isBlueNote(string, fret) && allowBlue) return 'blue'
    if (boxMode && !inBox1(string, fret, allowBlue)) return 'dim'
    return ''
  }

  return (
    <div className="phone-neck guitar-neck" role="group" aria-label="Guitar neck, six strings, frets 0 to 12, nut at the top">
      <div className="phone-strings" aria-hidden="true">
        {COURSE_STRINGS.map((string) => (
          <i key={string} className={`phone-string s${string}`} />
        ))}
      </div>
      <div className="phone-nut" aria-hidden="true">
        <span />
        {COURSE_STRINGS.map((string) => (
          <span key={string}>{string === 1 ? 'e' : noteName(midiOf(string, 0))}</span>
        ))}
      </div>
      {COURSE_FRETS.map((fret) => (
        <div
          className={`phone-fret ${fret === 0 ? 'open' : ''} ${fret === 1 ? 'after-nut' : ''} ${
            boxMode && (fret < 5 || fret > 8) ? 'outside-box' : ''
          }`}
          key={fret}
        >
          <span className="phone-fret-num">{fret}</span>
          {COURSE_STRINGS.map((string) => {
            const kind = stateFor(string, fret)
            const label = namesOn ? noteName(midiOf(string, fret)) : ''
            const body = (
              <>
                {label ? <span>{label}</span> : null}
                {kind === 'correct' ? <span className="guitar-check">✓</span> : null}
                {kind === 'wrong' && flash?.label ? <span className="guitar-wrong-label">{flash.label}</span> : null}
              </>
            )
            const cls = `phone-cell ${kind}`
            if (!interactive) {
              return (
                <span key={`${string}-${fret}`} className={cls}>
                  {body}
                </span>
              )
            }
            return (
              <button
                key={`${string}-${fret}`}
                type="button"
                className={cls}
                onClick={() => onTap?.(string, fret)}
                aria-label={`${noteName(midiOf(string, fret))} string ${string} fret ${fret}`}
              >
                {body}
              </button>
            )
          })}
          {DOTS[fret] ? (
            <span className={`phone-dots n${DOTS[fret]}`} aria-hidden="true">
              {Array.from({ length: DOTS[fret] }, (_, index) => (
                <i key={index} />
              ))}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
