import {
  COURSE_FRETS,
  COURSE_STRINGS,
  midiOf,
  noteName,
  scaleDegree,
  STRING_NAMES,
} from './notes.js'
import { PhoneStatus, phoneCanClick, usePhoneLink } from './PhoneLink.jsx'

const ROOT_PC = { C: 0, 'C♯': 1, D: 2, 'D♯': 3, E: 4, F: 5, 'F♯': 6, G: 7, 'G♯': 8, A: 9, 'A♯': 10, B: 11 }

export function FullFretboard({
  labelMode = 'names',
  scaleRoot = 'C',
  cursor = null,
  highlighted = [],
  onPlace,
  interactive = false,
}) {
  const phone = usePhoneLink()
  const litCursor = cursor || phone?.lastNote
  const canClick = phoneCanClick(interactive, phone)
  const rootPc = ROOT_PC[scaleRoot] ?? 0

  function mark(string, fret) {
    return highlighted.some((item) => item.string === string && item.fret === fret)
  }

  function label(string, fret) {
    if (labelMode === 'blank') return ''
    const midi = midiOf(string, fret)
    if (labelMode === 'numbers') return scaleDegree(midi, rootPc)
    return noteName(midi)
  }

  return (
    <div className="full-neck-wrap">
      <PhoneStatus aboveBoard />
      <div
        className="full-neck"
        role={canClick ? 'group' : 'img'}
        aria-label="Guitar neck, six strings, frets 0 to 12"
      >
        <div className="full-frets" aria-hidden="true">
          <span />
          {COURSE_FRETS.map((fret) => (
            <span key={fret}>{fret}</span>
          ))}
        </div>
        {COURSE_STRINGS.map((string) => (
          <div className="full-string" key={string}>
            <span className="string-name">{STRING_NAMES[string]}</span>
            <div className="full-wire">
              {COURSE_FRETS.map((fret) => {
                const midi = midiOf(string, fret)
                const now = litCursor && litCursor.string === string && litCursor.fret === fret
                const lit = mark(string, fret)
                const text = label(string, fret)
                const body = (
                  <>
                    <span className={`dot ${fret === 0 ? 'ring' : 'fill'} ${lit || now ? 'used' : ''} ${now ? 'now' : ''}`} />
                    {text ? <span className="dot-name">{text}</span> : null}
                  </>
                )
                if (!canClick) {
                  return (
                    <span key={fret} className="cell">
                      {body}
                    </span>
                  )
                }
                return (
                  <button
                    key={fret}
                    type="button"
                    className="cell hit"
                    onClick={() => onPlace?.(string, fret)}
                    aria-label={`${noteName(midi)} on the ${STRING_NAMES[string]} string, fret ${fret}`}
                  >
                    {body}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="hint">Thickest string at the top. Open strings are fret 0.</p>
    </div>
  )
}

export function LabelModeSwitch({ mode, onMode }) {
  return (
    <div className="theme-switch" role="group" aria-label="Fretboard labels">
      {[
        { id: 'names', label: 'Note names' },
        { id: 'numbers', label: 'Scale numbers' },
        { id: 'blank', label: 'Blank' },
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          className={`mode ${mode === item.id ? 'current' : ''}`}
          onClick={() => onMode(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
