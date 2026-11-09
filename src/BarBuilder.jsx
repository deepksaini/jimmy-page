import { useEffect, useRef, useState } from 'react'
import {
  addBoxNote,
  applyRhythm,
  CHALLENGE_GOALS,
  CHORDS,
  chordLabel,
  endBarFeedback,
  evenPhrase,
  glowForChord,
  ideaMove,
  inBox1,
  LESSON_SETUP,
  noteChip,
  RHYTHM_CHOICES,
  scoreLesson,
} from './barBuilder.js'
import { eventsInOrder } from './music.js'
import { loadV3, patchLesson } from './v3Store.js'

const MOVES = [
  { id: 'repeat', label: 'Repeat it' },
  { id: 'rhythm', label: 'Change the rhythm' },
  { id: 'answer', label: 'Answer it' },
]

export default function BarBuilder({ lessonId, engine, guitar, onResult }) {
  const setup = LESSON_SETUP[lessonId]
  const [bars, setBars] = useState([[], [], [], []])
  const [liveBar, setLiveBar] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [msg, setMsg] = useState('')
  const [result, setResult] = useState(null)
  const [readyToPlay, setReadyToPlay] = useState(false)
  const barsRef = useRef(bars)
  const liveRef = useRef(liveBar)
  barsRef.current = bars
  liveRef.current = liveBar

  const chord = CHORDS[liveBar]
  const current = bars[liveBar] || []
  const notes = eventsInOrder(current)
  const savedTries = loadV3().lessons[lessonId]?.builderTries || []

  useEffect(() => {
    guitar?.clearBoard()
    guitar?.setBoxView({ boxMode: true, allowBlue: setup.blue })
    if (setup.glow) guitar?.setChordGlow(glowForChord(CHORDS[0]))
    else guitar?.setChordGlow([])
    setBars([[], [], [], []])
    setLiveBar(0)
    setFeedback(null)
    setMsg('')
    setResult(null)
    setReadyToPlay(false)
    return () => {
      guitar?.setBoxView({ boxMode: false, allowBlue: false })
      guitar?.clearBoard()
    }
  }, [lessonId])

  useEffect(() => {
    if (setup.glow) guitar?.setChordGlow(glowForChord(chord))
    else guitar?.setChordGlow([])
  }, [liveBar, lessonId, setup.glow, chord])

  useEffect(() => {
    return guitar?.registerTap((string, fret, meta = {}) => {
      if (meta.rhythmResult || string == null) return
      onTap(string, fret, meta)
    })
  }, [guitar, lessonId, setup.blue])

  function writeBar(index, events) {
    setBars((currentBars) => currentBars.map((bar, i) => (i === index ? events : bar)))
  }

  function onTap(string, fret, meta) {
    const index = liveRef.current
    const currentNotes = eventsInOrder(barsRef.current[index] || [])
    if (!inBox1(string, fret, setup.blue)) {
      guitar?.sendResult({ string, fret, ok: false, label: "That note isn't in the box" })
      setMsg("That note isn't in the box")
      return
    }
    if (currentNotes.length >= 4) {
      setMsg('Four notes is plenty. Undo to change one.')
      return
    }
    const next = addBoxNote(barsRef.current[index], string, fret)
    writeBar(index, next)
    setFeedback(null)
    setMsg('')
    guitar?.setCursor({ string, fret })
    if (!meta.fromPhone) engine.pluck(string, fret, meta)
  }

  async function hearChord() {
    await engine.unlock()
    engine.playScript([{ chord, mode: 'strum' }])
  }

  function undo() {
    writeBar(liveBar, notes.slice(0, -1))
    setFeedback(null)
    setMsg('')
  }

  function clearBar() {
    writeBar(liveBar, [])
    setFeedback(null)
    setMsg('')
  }

  function goNextBar() {
    if (liveBar >= 3) {
      setReadyToPlay(true)
      setFeedback(null)
      return
    }
    setLiveBar(liveBar + 1)
    setFeedback(null)
    setMsg('')
  }

  function nextBar() {
    const check = endBarFeedback(barsRef.current[liveBar], chord)
    if (check.empty) {
      setMsg(check.text)
      return
    }
    if (lessonId === '9.3' && liveBar === 0 && eventsInOrder(barsRef.current[0]).length < 3) {
      setMsg('Play a 3 or 4 note idea in bar 1.')
      return
    }
    setFeedback(check)
    setMsg(check.text)
    if (check.ok) goNextBar()
  }

  async function previewMove(kind) {
    const idea = barsRef.current[0]
    if (!eventsInOrder(idea).length) {
      setMsg('Play an idea in bar 1 first.')
      return
    }
    const built = ideaMove(idea, kind, chord)
    await engine.unlock()
    engine.preview(built, 80, 0, (_bar, event) => guitar?.setCursor(event), null, liveBar)
  }

  function applyMove(kind) {
    const idea = barsRef.current[0]
    if (!eventsInOrder(idea).length) {
      setMsg('Play an idea in bar 1 first.')
      return
    }
    writeBar(liveBar, ideaMove(idea, kind, chord))
    setFeedback(null)
    setMsg('')
  }

  function setRhythm(id) {
    writeBar(liveBar, applyRhythm(barsRef.current[liveBar], id))
    setMsg('')
  }

  async function playAll() {
    await engine.unlock()
    const phrase = setup.rhythm ? barsRef.current : evenPhrase(barsRef.current)
    engine.play(
      phrase,
      80,
      0,
      false,
      (_bar, event) => guitar?.setCursor({ string: event.string, fret: event.fret }),
      () => {
        const scored = scoreLesson(lessonId, barsRef.current)
        const tries = [...(loadV3().lessons[lessonId]?.builderTries || []), { met: scored.met, total: scored.total, ok: scored.ok }]
        patchLesson(lessonId, { builderTries: tries, practiceOk: scored.ok })
        setResult(scored)
        onResult?.(scored)
      },
      (bar) => {
        setLiveBar(bar)
        if (setup.glow) guitar?.setChordGlow(glowForChord(CHORDS[bar]))
      },
    )
  }

  if (!setup) return null

  return (
    <div className="bar-builder">
      <p className="goal-line">Goal: {setup.goal}</p>
      {lessonId === '9.6' ? (
        <ul className="goal-ticks">
          {(result ? result.checks : CHALLENGE_GOALS.map((label) => ({ label, ok: false }))).map((item) => (
            <li key={item.label} className={item.ok ? 'ok' : ''}>
              {item.ok ? '✓' : '○'} {item.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="bar-grid">
        {CHORDS.map((name, index) => (
          <button
            key={`${name}-${index}`}
            type="button"
            className={`bar-card ${index === liveBar ? 'live' : ''}`}
            onClick={() => {
              setLiveBar(index)
              setReadyToPlay(index === 3 && readyToPlay)
              setFeedback(null)
            }}
          >
            <strong>
              Bar {index + 1} · {name}
            </strong>
            <span className="chip-row bar-chips">
              {eventsInOrder(bars[index]).map((event, i) => (
                <span className="note-chip" key={`${event.string}-${event.fret}-${i}`}>
                  {noteChip(event)}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
      <p className="bar-now">
        Bar {liveBar + 1} · {chordLabel(chord)}
      </p>
      <div className="transport">
        <button type="button" className="primary" onClick={hearChord}>
          Hear the chord
        </button>
        <button type="button" onClick={undo} disabled={!notes.length}>
          Undo
        </button>
        <button type="button" onClick={clearBar} disabled={!notes.length}>
          Clear bar
        </button>
      </div>
      {setup.moves && liveBar >= 1 && liveBar <= 2 ? (
        <div className="move-list">
          {MOVES.map((move) => (
            <div className="move-row" key={move.id}>
              <button type="button" onClick={() => applyMove(move.id)}>
                {move.label}
              </button>
              <button type="button" className="ghost" onClick={() => previewMove(move.id)}>
                Preview
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {setup.rhythm ? (
        <div className="transport wrap">
          {RHYTHM_CHOICES.map((item) => (
            <button key={item.id} type="button" onClick={() => setRhythm(item.id)}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => setRhythm('rest')}>
            Add a rest
          </button>
        </div>
      ) : null}
      {msg ? <p className={feedback?.ok ? 'check-ok' : 'check-note'}>{msg}</p> : null}
      {feedback && !feedback.ok && !feedback.empty ? (
        <div className="transport">
          <button type="button" onClick={() => setFeedback(null)}>
            Change it
          </button>
          <button type="button" className="primary" onClick={goNextBar}>
            Keep it and continue
          </button>
        </div>
      ) : (
        <div className="transport">
          {liveBar < 3 || !readyToPlay ? (
            <button type="button" className="primary" onClick={nextBar}>
              Next bar
            </button>
          ) : null}
          {readyToPlay || liveBar === 3 ? (
            <button type="button" className="primary" onClick={playAll}>
              Play all four bars
            </button>
          ) : null}
        </div>
      )}
      {result ? (
        <div className="play-result">
          <p className="check-ok">{result.summary}</p>
          {lessonId !== '9.6' ? (
            <p className={result.ok ? 'check-ok' : 'check-note'}>{result.ok ? 'Goal met.' : 'Goal not met yet. Try another pass.'}</p>
          ) : (
            <p className={result.ok ? 'check-ok' : 'check-note'}>
              {result.met} of {result.total} goals.
            </p>
          )}
          {lessonId === '9.6' && savedTries.length ? (
            <p className="hint">
              First try: {savedTries[0].met}/{savedTries[0].total}
              {savedTries.length > 1
                ? ` · Later: ${savedTries
                    .slice(1)
                    .map((item) => `${item.met}/${item.total}`)
                    .join(', ')}`
                : ''}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
