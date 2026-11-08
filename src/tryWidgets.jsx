import { useState } from 'react'
import { ChordBadge, Fretboard, SoundHint } from './board.jsx'
import { chordPickResult } from './learnChecks.js'
import {
  CHORD_SAY,
  CHORDS,
  eventsInOrder,
  HOME_NAMES,
  midiOf,
  moveAnswer,
  moveChangeRhythm,
  moveLeaveSpace,
  moveRepeat,
  noteName,
  RHYTHM_PATTERNS,
  spreadNotes,
} from './music.js'

export function LoopListen({ playing, onPlay, onStop, onPlace, liveBar }) {
  return (
    <div>
      <ChordBadge barIndex={liveBar} />
      <Fretboard chord={CHORDS[liveBar]} events={[]} interactive onPlace={onPlace} showLanding />
      <div className="transport">
        <button type="button" className="primary" onClick={playing ? onStop : onPlay}>
          {playing ? 'Stop' : 'Play'}
        </button>
        <SoundHint />
      </div>
    </div>
  )
}

export function PickChordNotes({ engine, targets, onComplete }) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState([])
  const [note, setNote] = useState('')
  const target = targets[step]

  function toggle(string, fret) {
    engine.pluck(string, fret)
    setPicked((current) => {
      const exists = current.some((item) => item.string === string && item.fret === fret)
      if (exists) return current.filter((item) => !(item.string === string && item.fret === fret))
      return [...current, { string, fret }]
    })
  }

  function submit() {
    const result = chordPickResult(picked, target.names)
    if (!result.ok) {
      const missed = result.missed.length ? `Missed ${result.missed.join(', ')}.` : ''
      const extra = result.extra.length ? ` Extra: ${result.extra.join(', ')}.` : ''
      setNote(`Not yet. ${missed}${extra}`.trim())
      return
    }
    setNote('Those are the notes in your box for this chord.')
    setPicked([])
    if (step < targets.length - 1) {
      setStep(step + 1)
      return
    }
    onComplete()
  }

  return (
    <div>
      <p className="chord-badge">
        {CHORD_SAY[target.chord]} chord: {HOME_NAMES[target.chord].join(', ')}
      </p>
      <Fretboard
        chord={target.chord}
        events={[]}
        selected={picked}
        interactive
        onPlace={toggle}
        showLanding
      />
      <div className="transport">
        <button type="button" className="primary" onClick={submit} disabled={!picked.length}>
          Done
        </button>
      </div>
      {note ? <p className="lesson-evidence">{note}</p> : null}
    </div>
  )
}

export function FourBarTry({
  playing,
  hearId,
  onPlayLoop,
  onStop,
  onPlace,
  bars,
  liveBar,
  setLiveBar,
  cursor,
  showLanding = true,
  allowBlue = false,
  onSpread,
  onRepeat,
  onRhythm,
  onAnswer,
  onSpace,
  goals,
}) {
  return (
    <div>
      {goals?.length ? (
        <ul className="report-list">
          {goals.map((line) => (
            <li key={line.label || line}>{line.ok == null ? line : `${line.ok ? 'Met' : 'Not yet'}: ${line.label}`}</li>
          ))}
        </ul>
      ) : null}
      <div className="transport">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            type="button"
            className={`mode ${liveBar === index ? 'current' : ''}`}
            onClick={() => setLiveBar(index)}
          >
            Bar {index + 1} · {CHORDS[index]}
          </button>
        ))}
      </div>
      <ChordBadge barIndex={liveBar} />
      <Fretboard
        chord={CHORDS[liveBar]}
        events={bars[liveBar]}
        cursor={cursor}
        interactive
        onPlace={onPlace}
        showLanding={showLanding}
        allowBlue={allowBlue}
      />
      <p className="lesson-evidence">
        This bar:{' '}
        {eventsInOrder(bars[liveBar])
          .map((event) => (event.string === 3 && event.fret === 8 ? 'E♭' : noteName(midiOf(event.string, event.fret))))
          .join(' → ') || 'no notes yet'}
      </p>
      <div className="transport">
        <button type="button" className="primary" onClick={playing && hearId === 'loop' ? onStop : onPlayLoop}>
          {playing && hearId === 'loop' ? 'Stop' : 'Play'}
        </button>
        {onRepeat ? (
          <button type="button" onClick={onRepeat} disabled={!eventsInOrder(bars[0]).length}>
            Repeat the idea
          </button>
        ) : null}
        {onRhythm ? (
          <button type="button" onClick={onRhythm} disabled={!eventsInOrder(bars[Math.max(0, liveBar - 1)]).length}>
            Change the rhythm
          </button>
        ) : null}
        {onAnswer ? (
          <button type="button" onClick={onAnswer} disabled={!eventsInOrder(bars[0]).length}>
            Answer it
          </button>
        ) : null}
        {onSpread ? (
          <button type="button" onClick={onSpread} disabled={!eventsInOrder(bars[liveBar]).length}>
            Spread them out
          </button>
        ) : null}
        {onSpace ? (
          <button type="button" onClick={onSpace} disabled={!eventsInOrder(bars[liveBar]).length}>
            Leave space
          </button>
        ) : null}
        <SoundHint />
      </div>
    </div>
  )
}

export function applyBuilderMove(bars, liveBar, kind) {
  const source = bars[liveBar].length ? bars[liveBar] : bars[Math.max(0, liveBar - 1)]
  let next = source
  if (kind === 'repeat') next = moveRepeat(source)
  if (kind === 'rhythm') next = moveChangeRhythm(source, RHYTHM_PATTERNS[1]?.id || RHYTHM_PATTERNS[0].id)
  if (kind === 'answer') next = moveAnswer(source, CHORDS[liveBar])
  if (kind === 'spread') next = spreadNotes(bars[liveBar])
  if (kind === 'space') next = moveLeaveSpace(bars[liveBar], 0)
  return bars.map((bar, index) => (index === liveBar ? next : bar))
}

export function Bar4Try({ playing, hearId, onHear, onStop, bars, onPlace }) {
  return (
    <div>
      <ChordBadge barIndex={3} />
      <Fretboard chord="Am" events={bars[3]} interactive onPlace={onPlace} showLanding />
      <p className="lesson-evidence">
        Bar 4:{' '}
        {eventsInOrder(bars[3]).map((event) => noteName(midiOf(event.string, event.fret))).join(' → ') ||
          'no notes yet'}
      </p>
      <div className="transport">
        <button type="button" className="primary" onClick={playing && hearId === 'as-is' ? onStop : () => onHear('as-is')}>
          {playing && hearId === 'as-is' ? 'Stop' : 'Hear it'}
        </button>
        <button type="button" onClick={playing && hearId === 'as-d' ? onStop : () => onHear('as-d')}>
          {playing && hearId === 'as-d' ? 'Stop' : 'Hear it with last note D'}
        </button>
        <SoundHint />
      </div>
    </div>
  )
}
