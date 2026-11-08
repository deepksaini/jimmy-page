import { KEYS_HINT, KEYS_HINT_BLUE } from './keys.js'
import {
  CHORD_SAY,
  chordBadge,
  LANDING_PC,
  midiOf,
  NECK_STRINGS,
  noteName,
  pcOf,
  POSITIONS,
  STRING_LABELS,
} from './music.js'
import { PhoneStatus, phoneCanClick, usePhoneLink } from './PhoneLink.jsx'

const DEGREE = { A: '1', C: '♭3', D: '4', E: '5', G: '♭7' }

export function Fretboard({
  chord,
  events = [],
  cursor,
  onPlace,
  interactive,
  showLanding = true,
  selected = [],
  showNumbers = false,
  allowBlue = false,
}) {
  const phone = usePhoneLink()
  const litCursor = cursor || phone?.lastNote
  const canClick = phoneCanClick(interactive, phone)
  const landing = showLanding && chord ? LANDING_PC[chord] : []
  function cellPos(string, fret) {
    const found = POSITIONS.find((item) => item.string === string && item.fret === fret)
    if (found) return found
    if (allowBlue && string === 3 && fret === 8) {
      return { string, fret, midi: midiOf(string, fret), name: 'E♭' }
    }
    return null
  }
  return (
    <div className="neck-wrap">
      <PhoneStatus aboveBoard />
      <div className="neck" role={canClick ? 'group' : 'img'} aria-label="Guitar neck, G, B and high e, frets 5 to 8">
        <div className="fret-nums" aria-hidden="true">
          <span />
          {[5, 6, 7, 8].map((fret) => (
            <span key={fret}>{fret}</span>
          ))}
        </div>
        {NECK_STRINGS.map((string) => (
          <div className="string-line" key={string}>
            <span className="string-name">{STRING_LABELS[string]}</span>
            <div className="wire">
              {[5, 6, 7, 8].map((fret) => {
                const pos = cellPos(string, fret)
                const settled = pos && landing.includes(pcOf(pos.midi))
                const written =
                  pos && events.some((event) => event.string === string && event.fret === fret)
                const picked =
                  pos && selected.some((item) => item.string === string && item.fret === fret)
                const now =
                  pos && litCursor && litCursor.string === string && litCursor.fret === fret
                if (!pos) {
                  return <span key={fret} className="cell" />
                }
                const label = showNumbers ? DEGREE[pos.name] || pos.name : pos.name === 'D#' ? 'E♭' : pos.name
                const body = (
                  <>
                    <span
                      className={`dot ${settled ? 'ring' : 'fill'} ${written || picked ? 'used' : ''} ${now ? 'now' : ''}`}
                    />
                    <span className="dot-name">{label}</span>
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
                    onClick={() => onPlace(string, fret)}
                    aria-label={`${pos.name} on the ${STRING_LABELS[string]} string, fret ${fret}${showLanding && settled ? '. Ring: a note in the chord playing now' : ''}`}
                  >
                    {body}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {showLanding ? (
        <p className="legend">
          <span className="dot ring tiny" /> Ring = a note in the chord playing now.
          <span className="dot fill tiny" /> Solid = still in the scale, less settled.
        </p>
      ) : null}
      <p className="hint key-hint">{allowBlue ? KEYS_HINT_BLUE : KEYS_HINT}</p>
    </div>
  )
}

export function ChordBadge({ barIndex }) {
  return <p className="chord-badge">{chordBadge(barIndex)}</p>
}

export function SoundHint() {
  return <p className="sound-hint">Click the page once to turn on sound.</p>
}

export function HomeBack({ onClick }) {
  return (
    <button type="button" className="home-back" onClick={onClick}>
      <svg className="home-back-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M15.4 5.4 8.8 12l6.6 6.6-1.4 1.4L6 12l8-8.8 1.4 1.2z"
        />
      </svg>
      back to home
    </button>
  )
}

export function KindChips({ chips }) {
  if (!chips?.length) return null
  return (
    <div className="chip-row">
      {chips.map((chip) => (
        <span key={chip} className="lesson-kind">
          {chip}
        </span>
      ))}
    </div>
  )
}

export { CHORD_SAY, DEGREE }
