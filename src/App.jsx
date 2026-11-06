import { useMemo, useRef, useState } from 'react'
import { createEngine } from './audio.js'
import {
  addNote,
  BARS,
  barTension,
  CHORDS,
  clearSlot,
  emptyBars,
  eventsInOrder,
  eventsToTab,
  isChordTone,
  LANDING_PC,
  midiOf,
  pcOf,
  moveAnswer,
  moveChangeRhythm,
  moveRepeat,
  noteName,
  POSITIONS,
  resolveLastToA,
  RHYTHM_PATTERNS,
  SLOTS_PER_BAR,
  STARTERS,
  STRING_LABELS,
} from './music.js'
import './styles.css'

const engine = createEngine()

const MOVES = [
  { id: 'repeat', title: 'Repeat it', body: 'Play the same idea again in the next bar.' },
  { id: 'rhythm', title: 'Change the rhythm', body: 'Keep the notes. Change when they land.' },
  { id: 'answer', title: 'Answer it', body: 'Turn the shape around, then land on a chord tone.' },
]

function firstEmptyBar(bars) {
  return bars.findIndex((bar) => bar.length === 0)
}

function lastFilledBar(bars) {
  for (let i = bars.length - 1; i >= 0; i -= 1) {
    if (bars[i].length) return i
  }
  return 0
}

export default function App() {
  const [bars, setBars] = useState(emptyBars)
  const [selectedBar, setSelectedBar] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(0)
  const [bpm, setBpm] = useState(80)
  const [swing, setSwing] = useState(0)
  const [loop, setLoop] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [cursor, setCursor] = useState(null)
  const [previewId, setPreviewId] = useState(null)
  const history = useRef([])

  const tab = useMemo(() => eventsToTab(bars), [bars])
  const tensions = useMemo(
    () => bars.map((events, index) => barTension(events, CHORDS[index])),
    [bars],
  )

  function commit(next) {
    history.current.push(bars)
    setBars(next)
  }

  function undo() {
    const prev = history.current.pop()
    if (prev) setBars(prev)
  }

  function place(string, fret) {
    const next = bars.map((bar, index) =>
      index === selectedBar ? addNote(bar, string, fret, selectedSlot, 1) : bar,
    )
    commit(next)
    setSelectedSlot((slot) => Math.min(SLOTS_PER_BAR - 1, slot + 1))
  }

  function sourceBar() {
    const filled = lastFilledBar(bars)
    return bars[filled] || bars[0]
  }

  function variantFor(moveId, extra) {
    const source = sourceBar()
    const targetIndex = Math.max(0, firstEmptyBar(bars) === -1 ? selectedBar : firstEmptyBar(bars))
    const chord = CHORDS[targetIndex]
    let nextEvents = source
    if (moveId === 'repeat') nextEvents = moveRepeat(source)
    if (moveId === 'rhythm') nextEvents = moveChangeRhythm(source, extra || RHYTHM_PATTERNS[0].id)
    if (moveId === 'answer') nextEvents = moveAnswer(source, chord)
    if (targetIndex === 3) nextEvents = resolveLastToA(nextEvents)
    return { targetIndex, nextEvents }
  }

  function applyMove(moveId, extra) {
    if (!sourceBar().length) return
    const { targetIndex, nextEvents } = variantFor(moveId, extra)
    const next = bars.map((bar, index) => (index === targetIndex ? nextEvents : bar))
    commit(next)
    setSelectedBar(targetIndex)
    setPreviewId(null)
  }

  async function previewMove(moveId, extra) {
    await engine.unlock()
    const { nextEvents } = variantFor(moveId, extra)
    setPreviewId(`${moveId}-${extra || ''}`)
    engine.preview(nextEvents, bpm, swing)
  }

  async function playAll() {
    await engine.unlock()
    setPlaying(true)
    engine.play(
      bars,
      bpm,
      swing,
      loop,
      (bar, event) => {
        setSelectedBar(bar)
        setCursor({ bar, slot: event.startSlot, string: event.string, fret: event.fret })
      },
      () => {
        setPlaying(false)
        setCursor(null)
      },
    )
  }

  const landing = LANDING_PC[CHORDS[selectedBar]]
  const nextTarget = firstEmptyBar(bars)

  return (
    <div className="app">
      <header className="top">
        <div>
          <p className="eyebrow">Phrase by Phrase</p>
          <h1>Turn a tiny idea into four bars.</h1>
          <p className="lede">
            You choose every note. The app only offers ways to develop what you already played.
            A minor pentatonic, box at frets 5 to 8.
          </p>
        </div>
        <div className="transport">
          <button type="button" className="primary" onClick={playing ? () => { engine.stop(); setPlaying(false) } : playAll}>
            {playing ? 'Stop' : 'Play four bars'}
          </button>
          <button type="button" onClick={undo} disabled={!history.current.length}>
            Undo
          </button>
          <label className="check">
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            Loop
          </label>
          <label>
            Tempo {bpm}
            <input type="range" min="60" max="110" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
          </label>
          <label>
            Swing
            <input type="range" min="0" max="1" step="0.05" value={swing} onChange={(e) => setSwing(Number(e.target.value))} />
          </label>
        </div>
      </header>

      <section className="fret-wrap" aria-label="Fretboard">
        <p className="hint">
          Bar {selectedBar + 1} is {CHORDS[selectedBar]}. Dots mark landing notes for this chord.
          Click a note to write it. Click a slot to choose where it goes.
        </p>
        <div className="fretboard">
          {[1, 2, 3, 4, 5, 6].map((string) => (
            <div className="string-row" key={string}>
              <span className="string-name">{STRING_LABELS[string]}</span>
              <div className="frets">
                {[5, 6, 7, 8].map((fret) => {
                  const pos = POSITIONS.find((item) => item.string === string && item.fret === fret)
                  if (!pos) {
                    return <span key={fret} className="fret empty" />
                  }
                  const landingHere = landing.includes(pcOf(pos.midi))
                  const active =
                    cursor && cursor.string === string && cursor.fret === fret
                  const written = bars[selectedBar].some((event) => event.string === string && event.fret === fret)
                  return (
                    <button
                      key={fret}
                      type="button"
                      className={[
                        'fret',
                        'playable',
                        landingHere ? 'landing' : '',
                        written ? 'written' : '',
                        active ? 'now' : '',
                      ].join(' ')}
                      onClick={() => place(string, fret)}
                      aria-label={`${pos.name} on ${STRING_LABELS[string]} string, fret ${fret}${landingHere ? ', landing note' : ''}`}
                    >
                      <span className="shape" aria-hidden="true" />
                      <span className="fret-label">
                        {pos.name}
                        <small>{fret}</small>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bars" aria-label="Four bars">
        {bars.map((events, index) => (
          <button
            type="button"
            key={index}
            className={`bar-card ${selectedBar === index ? 'selected' : ''}`}
            onClick={() => setSelectedBar(index)}
          >
            <header>
              <strong>Bar {index + 1}</strong>
              <span>{CHORDS[index]}</span>
            </header>
            <p className="bar-role">
              {['Your idea', 'Develop it', 'Contrast', 'Finish on A'][index]}
            </p>
            <div className="slots" onClick={(e) => e.stopPropagation()}>
              {Array.from({ length: SLOTS_PER_BAR }, (_, slot) => {
                const event = events.find((item) => item.startSlot === slot)
                const here = cursor && cursor.bar === index && cursor.slot === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`slot ${event ? 'filled' : ''} ${selectedBar === index && selectedSlot === slot ? 'chosen' : ''} ${here ? 'now' : ''}`}
                    onClick={() => {
                      if (selectedBar === index && selectedSlot === slot && event) {
                        commit(bars.map((bar, i) => (i === index ? clearSlot(bar, slot) : bar)))
                        return
                      }
                      setSelectedBar(index)
                      setSelectedSlot(slot)
                    }}
                    aria-label={`Bar ${index + 1}, beat slot ${slot + 1}${event ? `, ${noteName(midiOf(event.string, event.fret))}` : ', empty'}`}
                  >
                    {event ? noteName(midiOf(event.string, event.fret)) : '·'}
                  </button>
                )
              })}
            </div>
            <p className="tab-line">{tab[index]}</p>
          </button>
        ))}
      </section>

      <section className="lower">
        <div className="moves">
          <h2>What should happen next?</h2>
          <p className="hint">
            {nextTarget === -1
              ? 'All four bars have notes. Undo or edit a slot, then try another move.'
              : `These moves fill bar ${nextTarget + 1}. Preview first. You can undo.`}
          </p>
          {MOVES.map((move) => (
            <article key={move.id} className="move">
              <div>
                <h3>{move.title}</h3>
                <p>{move.body}</p>
              </div>
              {move.id === 'rhythm' ? (
                <div className="variants">
                  {RHYTHM_PATTERNS.map((pattern) => (
                    <span key={pattern.id} className="variant-row">
                      <button type="button" className={previewId === `rhythm-${pattern.id}` ? 'ghost on' : 'ghost'} onClick={() => previewMove('rhythm', pattern.id)}>
                        Preview: {pattern.label}
                      </button>
                      <button type="button" onClick={() => applyMove('rhythm', pattern.id)}>
                        Use this
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="variants">
                  <button type="button" className={previewId === `${move.id}-` ? 'ghost on' : 'ghost'} onClick={() => previewMove(move.id)}>
                    Preview
                  </button>
                  <button type="button" onClick={() => applyMove(move.id)}>
                    Use this
                  </button>
                </div>
              )}
            </article>
          ))}
          <button
            type="button"
            className="stuck"
            onClick={() => {
              const idea = STARTERS[Math.floor(Math.random() * STARTERS.length)]
              const next = bars.map((bar, index) => (index === 0 ? idea : bar))
              commit(next)
              setSelectedBar(0)
            }}
          >
            I am stuck — drop in a short starter for bar 1
          </button>
        </div>

        <aside className="shape">
          <h2>How tense each bar feels</h2>
          <p className="hint">A simple guide, not music science. Target: build and then release.</p>
          <svg viewBox="0 0 320 140" className="chart" role="img" aria-label="Tension across four bars">
            <polyline
              fill="none"
              stroke="#7d8c82"
              strokeDasharray="4 5"
              points="16,96 112,58 208,40 304,110"
            />
            <polyline
              fill="none"
              stroke="#e8d7b0"
              strokeWidth="3"
              points={tensions
                .map((value, index) => `${16 + index * 96},${120 - value * 90}`)
                .join(' ')}
            />
            {tensions.map((value, index) => (
              <g key={index}>
                <circle cx={16 + index * 96} cy={120 - value * 90} r={selectedBar === index ? 7 : 5} fill="#e8d7b0" />
                <text x={16 + index * 96} y="136" textAnchor="middle">
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>
          <p className="tab-block">
            {eventsInOrder(bars[selectedBar]).map((event) => (
              <span key={`${event.startSlot}-${event.string}`}>
                {STRING_LABELS[event.string]} {event.fret} {noteName(midiOf(event.string, event.fret))}
                {event.articulation !== 'pick' ? ` ${event.articulation}` : ''}
              </span>
            ))}
          </p>
        </aside>
      </section>
    </div>
  )
}
