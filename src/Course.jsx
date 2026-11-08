import { useEffect, useMemo, useRef, useState } from 'react'
import { HomeBack, KindChips } from './board.jsx'
import { COURSE_GOAL, LESSONS, lessonById, phraseEvents } from './course.js'
import { MODULE_9_IDS, MODULE_9_INTRO } from './theory/module9.js'
import { PHONE_HOME } from './phoneLink.js'
import { usePhoneLink } from './PhoneLink.jsx'
import { SAMPLE_CREDIT } from './notes.js'
import {
  catalog,
  continueTarget,
  doneCount,
  isUnlocked,
  lessonStatus,
  PLAYER_LABELS,
  PLAYER_STEPS,
  splitLearn,
  stepIndex,
} from './courseProgress.js'
import {
  bar4EndsOnA,
  blueNoteCheck,
  challengeGoals,
  chordEndReport,
  hasPassingLand,
  ideaFourCheck,
  rhythmSpaceCheck,
  withLastPitch,
} from './learnChecks.js'
import { bumpFail, loadLearn, markLessonDone, markRevealed, saveLearn } from './learnStore.js'
import { addNote, emptyBars, eventsInOrder, IDEA_MAX_NOTES } from './music.js'
import { applyBuilderMove, Bar4Try, FourBarTry, LoopListen, PickChordNotes } from './tryWidgets.jsx'

const BPM = 80

function LockIcon() {
  return (
    <svg className="lock-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2zm-7-2a2 2 0 114 0v2h-4V6zm7 14H7V10h10v10z"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="check-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9.2 16.6L4.8 12.2l1.4-1.4 3 3 8-8 1.4 1.4z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="play-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  )
}

function lessonHeading(item) {
  return `${item.number} ${item.title}`
}

function statusLabel(status) {
  if (status === 'done') return 'Done'
  if (status === 'locked') return 'Locked'
  return 'In progress'
}

function revealCopy(lesson) {
  if (lesson.quiz) {
    return lesson.quiz.map((item) => `${item.prompt} ${item.answer}. ${item.why}`).join(' ')
  }
  if (lesson.try.kind === 'pick-chord-notes') {
    return 'A minor: A, C and E. F: A and C. G: G and D.'
  }
  if (lesson.try.kind === 'four-bars-end-chord') {
    return 'End the A minor bars on A, C or E. End F on A or C. End G on G or D.'
  }
  if (lesson.try.kind === 'four-bar-idea') {
    return 'Repeat one short idea, change the rhythm or answer it, and keep scale runs to one or none.'
  }
  if (lesson.try.kind === 'four-bar-rhythm') {
    return 'Leave a rest inside a bar, and start at least one note on an "and".'
  }
  if (lesson.try.kind === 'four-bar-blue') {
    return 'Use E♭ at least once, follow it with D or E, and do not end a bar on it.'
  }
  if (lesson.try.kind === 'four-bar-challenge') {
    return lesson.try.goals.join(' ')
  }
  return 'End bar 4 on A. Somewhere play a non-chord note then the chord note next to it, for example D then E over A minor.'
}

function LessonList({ sequence, progress, openId, onOpen, variant }) {
  return (
    <ul className={`course-toc ${variant || ''}`}>
      {sequence.map((item, index) => {
        const status = lessonStatus(index, item.id, progress.done, sequence)
        const current = item.id === openId
        return (
          <li key={item.id}>
            <button
              type="button"
              className={`toc-item ${status} ${current ? 'current' : ''}`}
              disabled={status === 'locked'}
              onClick={() => onOpen(item.id)}
            >
              <span className="toc-mark">
                {status === 'locked' ? <LockIcon /> : status === 'done' ? <CheckIcon /> : <span className="toc-dot" />}
              </span>
              <span className="toc-copy">
                <span className="toc-title">
                  {lessonHeading(item)}
                </span>
                <span className="toc-meta">
                  {statusLabel(status)} · about 3 min
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function HearStep({ items, playing, hearId, onPlay, onStop }) {
  return (
    <div className="hear-grid">
      {items.map((item, index) => (
        <div key={index} className="hear-card">
          <button
            type="button"
            className={`hear-play ${playing && hearId === index ? 'on' : ''}`}
            onClick={() => (playing && hearId === index ? onStop() : onPlay(item, index))}
            aria-label={playing && hearId === index ? 'Stop' : 'Play'}
          >
            {playing && hearId === index ? <span className="stop-sq" /> : <PlayIcon />}
          </button>
          <p className="hear-caption">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function QuizCheck({ questions, passed, picks, onPick, checked }) {
  return (
    <div className="quiz">
      {questions.map((item, index) => {
        const pick = picks[index]
        const show = checked && pick
        const right = pick === item.answer
        return (
          <fieldset key={item.prompt} className="quiz-q" disabled={passed}>
            <legend>{item.prompt}</legend>
            {item.options.map((option) => (
              <label key={option} className="quiz-opt">
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={pick === option}
                  onChange={() => onPick(index, option)}
                />
                {option}
              </label>
            ))}
            {show && !right ? (
              <p className="check-note">
                Not yet. The answer is {item.answer}. {item.why}
              </p>
            ) : null}
            {show && right ? <p className="check-ok">Right.</p> : null}
          </fieldset>
        )
      })}
    </div>
  )
}

function LessonPlayer({
  lesson,
  sequence,
  progress,
  engine,
  bpm,
  learnKey,
  onProgress,
  onHome,
  onOpenLesson,
  onExit,
}) {
  const index = sequence.findIndex((item) => item.id === lesson.id)
  const screens = useMemo(() => splitLearn(lesson.learn), [lesson])
  const alreadyDone = !!progress.done[lesson.id]
  const [phase, setPhase] = useState(() =>
    PLAYER_STEPS.includes(progress.currentStep) ? progress.currentStep : 'learn',
  )
  const [learnPage, setLearnPage] = useState(() => Math.min(Number(progress.learnPage) || 0, screens.length - 1))
  const [playing, setPlaying] = useState(false)
  const [hearId, setHearId] = useState(null)
  const [liveBar, setLiveBar] = useState(0)
  const [bars, setBars] = useState(emptyBars)
  const [cursor, setCursor] = useState(null)
  const [tryPassed, setTryPassed] = useState(alreadyDone)
  const [checkPassed, setCheckPassed] = useState(alreadyDone)
  const [checkNote, setCheckNote] = useState(alreadyDone ? 'Pass.' : '')
  const [picks, setPicks] = useState(() => (lesson.quiz ? lesson.quiz.map(() => null) : []))
  const [quizChecked, setQuizChecked] = useState(false)
  const [fails, setFails] = useState(() => Number(progress.fails?.[lesson.id]) || 0)
  const [revealed, setRevealed] = useState(!!progress.revealed?.[lesson.id] || alreadyDone)
  const pickTap = useRef(null)
  const phone = usePhoneLink()

  function persist(patch) {
    onProgress(
      saveLearn({
        view: 'lesson',
        currentId: lesson.id,
        started: { ...loadLearn().started, [lesson.id]: true },
        ...patch,
      }),
    )
  }

  useEffect(() => {
    persist({ currentStep: phase, learnPage })
  }, [phase, learnPage, lesson.id])

  function stop() {
    engine.stop()
    setPlaying(false)
    setHearId(null)
    setCursor(null)
  }

  async function playHear(item, id) {
    stop()
    await engine.unlock()
    setPlaying(true)
    setHearId(id)
    const done = () => {
      setPlaying(false)
      setHearId(null)
    }
    if (item.kind === 'chord') {
      engine.playBacking(bpm, 0, { bars: 1, startBar: item.barIndex, loops: 1, onDone: done })
      return
    }
    if (item.kind === 'chords') {
      engine.playBacking(bpm, 0, {
        bars: item.bars,
        startBar: item.startBar,
        loops: 1,
        onBar: (bar) => setLiveBar(bar),
        onDone: done,
      })
      return
    }
    if (item.kind === 'solo') {
      engine.play(
        item.bars.map(phraseEvents),
        bpm,
        0,
        false,
        (bar, event) => {
          setLiveBar(bar)
          setCursor({ string: event.string, fret: event.fret })
        },
        done,
        (bar) => setLiveBar(bar),
      )
      return
    }
    engine.preview(phraseEvents(item.phrase), bpm, 0, undefined, done, item.barIndex)
  }

  async function playLoop() {
    stop()
    await engine.unlock()
    setPlaying(true)
    setHearId('loop')
    engine.play(
      bars,
      bpm,
      0,
      true,
      (bar, event) => {
        setLiveBar(bar)
        setCursor({ string: event.string, fret: event.fret })
      },
      () => {
        setPlaying(false)
        setHearId(null)
        setCursor(null)
      },
      (bar) => setLiveBar(bar),
    )
  }

  function placeInBar(barIndex, string, fret, options = {}) {
    engine.pluck(string, fret, options)
    setBars((current) => {
      if (eventsInOrder(current[barIndex]).length >= IDEA_MAX_NOTES) return current
      return current.map((bar, i) => (i === barIndex ? addNote(bar, string, fret) : bar))
    })
  }

  async function hearBar4(kind) {
    stop()
    const events = kind === 'as-d' ? withLastPitch(bars[3], 3, 7) : bars[3]
    if (!eventsInOrder(events).length) return
    await engine.unlock()
    setPlaying(true)
    setHearId(kind)
    engine.preview(events, bpm, 0, undefined, () => {
      setPlaying(false)
      setHearId(null)
    }, 3)
  }

  function passLesson() {
    setCheckPassed(true)
    onProgress(markLessonDone(lesson.id))
  }

  function failLesson(message) {
    setCheckPassed(false)
    setCheckNote(message)
    const next = bumpFail(lesson.id)
    setFails(Number(next.fails[lesson.id]) || 0)
    onProgress(next)
  }

  function evaluateCheck() {
    if (lesson.quiz) {
      const allRight = lesson.quiz.every((item, i) => picks[i] === item.answer)
      setQuizChecked(true)
      if (allRight) {
        setCheckNote(`Pass. All ${lesson.quiz.length} right.`)
        passLesson()
        return
      }
      failLesson('Not yet. See the notes under each question.')
      return
    }
    if (lesson.try.kind === 'pick-chord-notes') {
      if (tryPassed) {
        setCheckNote('Pass. All three chords right.')
        passLesson()
        return
      }
      failLesson('Not yet. Go back and select the exact notes for each chord.')
      return
    }
    if (lesson.try.kind === 'four-bars-end-chord') {
      const report = chordEndReport(bars)
      if (report.ok) {
        setCheckNote('Pass. Each bar ends on a chord note.')
        passLesson()
        return
      }
      failLesson(
        `Not yet. ${report.misses.map((item) => `Bar ${item.bar} over ${item.chord} ended on ${item.last}. Try ${item.want}.`).join(' ')}`,
      )
      return
    }
    if (lesson.try.kind === 'four-bar-idea') {
      const result = ideaFourCheck(bars)
      if (result.ok) {
        setCheckNote('Pass. One idea, said again, changed, then finished.')
        passLesson()
        return
      }
      failLesson(
        !result.share
          ? 'Not yet. At least two bars must share the same idea (same steps between notes).'
          : !result.change
            ? 'Not yet. Change the rhythm in at least one bar, or answer the idea.'
            : 'Not yet. At most one scale run (three or more notes stepping the same way).',
      )
      return
    }
    if (lesson.try.kind === 'four-bar-rhythm') {
      const result = rhythmSpaceCheck(bars)
      if (result.ok) {
        setCheckNote('Pass. You used a rest and an off-beat note.')
        passLesson()
        return
      }
      failLesson(
        !result.rest
          ? 'Not yet. Leave at least one rest inside a bar (not just empty time at the end).'
          : 'Not yet. Start at least one note off the beat (slot 1, 3, 5 or 7).',
      )
      return
    }
    if (lesson.try.kind === 'four-bar-blue') {
      const result = blueNoteCheck(bars)
      if (result.ok) {
        setCheckNote(result.message)
        passLesson()
        return
      }
      failLesson(result.message)
      return
    }
    if (lesson.try.kind === 'four-bar-challenge') {
      const result = challengeGoals(bars)
      const saved = loadLearn()
      const first = saved.challengeFirst == null ? result.met : saved.challengeFirst
      saveLearn({ challengeFirst: first, challengeLatest: result.met })
      const score = `First try: ${first} of 5. Now: ${result.met} of 5.`
      if (result.met === 5) {
        setCheckNote(`Pass. ${score}`)
        passLesson()
        return
      }
      failLesson(`Not yet. ${score} ${result.items.filter((item) => !item.ok).map((item) => item.label).join(' ')}`)
      return
    }
    const endA = bar4EndsOnA(bars)
    const passing = hasPassingLand(bars)
    if (endA && passing) {
      setCheckNote('Pass. Bar 4 ends on A, and you passed through a nearby chord note.')
      passLesson()
      return
    }
    failLesson(
      !endA
        ? 'Not yet. Bar 4 must end on A.'
        : 'Not yet. Somewhere, play a note that is not in the chord, then the chord note next to it (for example D then E).',
    )
  }

  useEffect(() => {
    if (phase !== 'check' || checkPassed) return undefined
    if (lesson.quiz) {
      if (picks.some((item) => !item)) return undefined
      evaluateCheck()
      return undefined
    }
    evaluateCheck()
    return undefined
  }, [phase, picks])

  useEffect(() => {
    if (!learnKey) return undefined
    if (phase !== 'try') {
      learnKey.current = null
      return undefined
    }
    learnKey.current = (mapped, options = {}) => {
      applyTryTap(mapped.string, mapped.fret, options)
    }
    return () => {
      learnKey.current = null
    }
  }, [learnKey, lesson, liveBar, engine, phase])

  function applyTryTap(string, fret, options = {}) {
    const kind = lesson.try.kind
    setCursor({ string, fret })
    if (phase !== 'try') return
    if (kind === 'pick-chord-notes') {
      pickTap.current?.(string, fret, options)
      return
    }
    if (
      kind === 'four-bars-end-chord' ||
      kind === 'four-bar-idea' ||
      kind === 'four-bar-rhythm' ||
      kind === 'four-bar-blue' ||
      kind === 'four-bar-challenge'
    ) {
      placeInBar(liveBar, string, fret, options)
      return
    }
    if (kind === 'bar4-compare') {
      placeInBar(3, string, fret, options)
      return
    }
    engine.pluck(string, fret, options)
  }

  useEffect(() => {
    if (!phone) return undefined
    const allowBlue = lesson.try?.kind === 'four-bar-blue' || lesson.try?.kind === 'four-bar-challenge'
    phone.setBoxMode(allowBlue ? 'box-blue' : 'box')
    return phone.registerTap((string, fret, options) => applyTryTap(string, fret, options))
  }, [phone, lesson, liveBar, phase])

  function goPhase(next) {
    stop()
    setPhase(next)
    if (next === 'learn') setLearnPage(0)
  }

  function onBack() {
    if (phase === 'learn' && learnPage > 0) {
      setLearnPage(learnPage - 1)
      return
    }
    if (phase === 'learn') {
      stop()
      onProgress(saveLearn({ view: 'home' }))
      onHome()
      return
    }
    const prev = PLAYER_STEPS[stepIndex(phase) - 1]
    if (prev === 'learn') setLearnPage(screens.length - 1)
    goPhase(prev)
  }

  function onNext() {
    if (phase === 'learn' && learnPage < screens.length - 1) {
      setLearnPage(learnPage + 1)
      return
    }
    const next = PLAYER_STEPS[stepIndex(phase) + 1]
    if (next) goPhase(next)
  }

  function nextLesson() {
    stop()
    const following = sequence[index + 1]
    if (!following) {
      onProgress(saveLearn({ view: 'home' }))
      ;(onExit || onHome)()
      return
    }
    onProgress(saveLearn({ view: 'lesson', currentId: following.id, currentStep: 'learn', learnPage: 0 }))
    onOpenLesson(following.id)
  }

  function tryAgain() {
    setQuizChecked(false)
    setPicks(lesson.quiz ? lesson.quiz.map(() => null) : [])
    setCheckNote('')
    goPhase(lesson.quiz ? 'check' : 'try')
  }

  function showAnswer() {
    const next = markRevealed(lesson.id)
    setRevealed(true)
    setCheckPassed(true)
    setTryPassed(true)
    setCheckNote(`The answer: ${revealCopy(lesson)}`)
    if (lesson.quiz) {
      setPicks(lesson.quiz.map((item) => item.answer))
      setQuizChecked(true)
    }
    onProgress(next)
  }

  const nextLocked = phase === 'check' && !checkPassed
  const onLast = phase === 'recap'

  return (
    <div className="course-player">
      <aside className="course-side">
        <HomeBack
          onClick={() => {
            stop()
            onProgress(saveLearn({ view: 'home' }))
            ;(onExit || onHome)()
          }}
        />
        <LessonList sequence={sequence} progress={progress} openId={lesson.id} onOpen={onOpenLesson} />
      </aside>

      <div className="course-main">
        <label className="course-jump">
          <span className="sr-only">Lessons</span>
          <select
            value={lesson.id}
            onChange={(event) => {
              const id = event.target.value
              const idx = sequence.findIndex((item) => item.id === id)
              if (lessonStatus(idx, id, progress.done, sequence) === 'locked') return
              stop()
              onOpenLesson(id)
            }}
          >
            {sequence.map((item, idx) => {
              const status = lessonStatus(idx, item.id, progress.done, sequence)
              return (
                  <option key={item.id} value={item.id} disabled={status === 'locked'}>
                  {status === 'locked' ? 'Locked · ' : ''}
                  {lessonHeading(item)}
                </option>
              )
            })}
          </select>
        </label>

        <header className="player-head">
          <KindChips chips={lesson.chips} />
          <h1>
            {lessonHeading(lesson)}
          </h1>
        </header>

        <nav className="step-dots" aria-label="Lesson parts">
          {PLAYER_STEPS.map((id) => {
            const allowed =
              alreadyDone ||
              stepIndex(id) <= stepIndex(phase) ||
              (id === 'recap' && checkPassed) ||
              (stepIndex(id) === stepIndex(phase) + 1 && (phase !== 'check' || checkPassed))
            return (
              <button
                key={id}
                type="button"
                className={`step-dot ${phase === id ? 'current' : ''} ${alreadyDone || (id === 'check' && checkPassed) || (id === 'recap' && checkPassed) ? 'done' : ''}`}
                disabled={!allowed}
                onClick={() => allowed && goPhase(id)}
              >
                {PLAYER_LABELS[id]}
              </button>
            )
          })}
        </nav>

        <div className="course-step">
          {phase === 'learn' ? (
            screens[learnPage].map((para) => (
              <p key={para} className="lesson-evidence">
                {para}
              </p>
            ))
          ) : null}

          {phase === 'hear' ? (
            <HearStep items={lesson.hear} playing={playing} hearId={hearId} onPlay={playHear} onStop={stop} />
          ) : null}

          {phase === 'try' ? (
            <>
              <p className="lesson-evidence">{lesson.try.text}</p>
              {lesson.try.kind === 'loop-listen' ? (
                <LoopListen
                  playing={playing && hearId === 'loop'}
                  liveBar={liveBar}
                  onPlay={playLoop}
                  onStop={stop}
                  onPlace={(string, fret) => engine.pluck(string, fret)}
                  cursor={cursor || phone?.lastNote}
                />
              ) : null}
              {lesson.try.kind === 'pick-chord-notes' ? (
                <PickChordNotes
                  engine={engine}
                  targets={lesson.try.targets}
                  onComplete={() => setTryPassed(true)}
                  tapRef={pickTap}
                />
              ) : null}
              {['four-bars-end-chord', 'four-bar-idea', 'four-bar-rhythm', 'four-bar-blue', 'four-bar-challenge'].includes(
                lesson.try.kind,
              ) ? (
                <FourBarTry
                  playing={playing}
                  hearId={hearId}
                  liveBar={liveBar}
                  setLiveBar={setLiveBar}
                  bars={bars}
                  onPlayLoop={playLoop}
                  onStop={stop}
                  onPlace={(string, fret) => placeInBar(liveBar, string, fret)}
                  cursor={cursor || phone?.lastNote}
                  showLanding={lesson.try.kind !== 'four-bar-challenge'}
                  allowBlue={lesson.try.kind === 'four-bar-blue' || lesson.try.kind === 'four-bar-challenge'}
                  goals={
                    lesson.try.kind === 'four-bar-challenge'
                      ? challengeGoals(bars).items
                      : lesson.try.goals
                  }
                  onRepeat={
                    lesson.try.kind === 'four-bar-idea'
                      ? () => setBars((current) => applyBuilderMove(current, liveBar, 'repeat'))
                      : undefined
                  }
                  onRhythm={
                    lesson.try.kind === 'four-bar-idea' || lesson.try.kind === 'four-bar-rhythm'
                      ? () => setBars((current) => applyBuilderMove(current, liveBar, 'rhythm'))
                      : undefined
                  }
                  onAnswer={
                    lesson.try.kind === 'four-bar-idea'
                      ? () => setBars((current) => applyBuilderMove(current, liveBar, 'answer'))
                      : undefined
                  }
                  onSpread={
                    lesson.try.kind === 'four-bar-rhythm'
                      ? () => setBars((current) => applyBuilderMove(current, liveBar, 'spread'))
                      : undefined
                  }
                  onSpace={
                    lesson.try.kind === 'four-bar-rhythm'
                      ? () => setBars((current) => applyBuilderMove(current, liveBar, 'space'))
                      : undefined
                  }
                />
              ) : null}
              {lesson.try.kind === 'bar4-compare' ? (
                <Bar4Try
                  playing={playing}
                  hearId={hearId}
                  bars={bars}
                  onHear={hearBar4}
                  onStop={stop}
                  onPlace={(string, fret) => placeInBar(3, string, fret)}
                  cursor={cursor || phone?.lastNote}
                />
              ) : null}
              {tryPassed && lesson.try.kind === 'pick-chord-notes' ? (
                <p className="check-ok">Those three chords are right. Press Next for Check.</p>
              ) : null}
            </>
          ) : null}

          {phase === 'check' ? (
            <>
              {lesson.quiz ? (
                <QuizCheck
                  questions={lesson.quiz}
                  passed={checkPassed}
                  picks={picks}
                  checked={quizChecked}
                  onPick={(i, option) => {
                    if (checkPassed) return
                    setQuizChecked(false)
                    setPicks((current) => current.map((value, idx) => (idx === i ? option : value)))
                  }}
                />
              ) : null}
              {checkNote ? <p className={checkPassed ? 'check-ok' : 'check-note'}>{checkNote}</p> : null}
              {!checkPassed && checkNote ? (
                <div className="transport">
                  <button type="button" className="primary" onClick={tryAgain}>
                    Try again
                  </button>
                  {fails >= 3 ? (
                    <button type="button" onClick={showAnswer}>
                      Show me the answer and continue
                    </button>
                  ) : null}
                </div>
              ) : null}
              {revealed && checkPassed ? <p className="lesson-evidence">{revealCopy(lesson)}</p> : null}
            </>
          ) : null}

          {phase === 'recap' ? <p className="remember">{lesson.remember}</p> : null}
        </div>

        <div className="player-nav">
          <button type="button" onClick={onBack}>
            Back
          </button>
          {onLast ? (
            <button type="button" className="primary" onClick={nextLesson}>
              {sequence[index + 1] ? 'Next lesson' : 'Back to course home'}
            </button>
          ) : (
            <button type="button" className="primary" onClick={onNext} disabled={nextLocked}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Course({ engine, bpm = BPM, learnKey, onExit }) {
  const sequence = useMemo(() => catalog(LESSONS, MODULE_9_IDS), [])
  const [progress, setProgress] = useState(() => loadLearn())
  const [openId, setOpenId] = useState(() => {
    const state = loadLearn()
    if (state.view === 'lesson' && state.currentId && lessonById(state.currentId)) return state.currentId
    return null
  })
  const lesson = openId ? lessonById(openId) : null
  const done = doneCount(sequence, progress.done)
  const resume = continueTarget(sequence, progress)

  function openLesson(id) {
    const idx = sequence.findIndex((item) => item.id === id)
    if (idx < 0) return
    if (!progress.done[id] && !isUnlocked(idx, progress.done, sequence)) return
    const same = id === progress.currentId
    setProgress(
      saveLearn({
        view: 'lesson',
        currentId: id,
        currentStep: same ? progress.currentStep : 'learn',
        learnPage: same ? progress.learnPage : 0,
        started: { ...progress.started, [id]: true },
      }),
    )
    setOpenId(id)
  }

  function continueCourse() {
    if (!resume) {
      const last = sequence[sequence.length - 1]
      if (last) openLesson(last.id)
      return
    }
    openLesson(resume.id)
  }

  if (lesson && sequence.some((item) => item.id === lesson.id)) {
    return (
      <LessonPlayer
        key={lesson.id}
        lesson={lesson}
        sequence={sequence}
        progress={progress}
        engine={engine}
        bpm={bpm}
        learnKey={learnKey}
        onProgress={setProgress}
        onHome={() => setOpenId(null)}
        onExit={onExit}
        onOpenLesson={openLesson}
      />
    )
  }

  return (
    <section className="panel course-home">
      {onExit ? (
        <HomeBack onClick={onExit} />
      ) : null}
      <h1>Module 9: Improvising</h1>
      <p className="lede">{MODULE_9_INTRO}</p>
      <p className="lesson-evidence">{COURSE_GOAL}</p>
      <p className="lesson-evidence">{PHONE_HOME}</p>
      <div className="progress-block">
        <p className="progress-label">
          {done} of {sequence.length} done
        </p>
        <div
          className="course-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={sequence.length}
          aria-valuenow={done}
          aria-label="Course progress"
        >
          <span style={{ width: `${sequence.length ? (done / sequence.length) * 100 : 0}%` }} />
        </div>
      </div>
      <button type="button" className="primary continue" onClick={continueCourse}>
        Continue
      </button>
      <LessonList sequence={sequence} progress={progress} openId={null} onOpen={openLesson} />
      <div className="about">
        <h2>About / Credits</h2>
        <p className="lesson-evidence">{SAMPLE_CREDIT}</p>
      </div>
    </section>
  )
}
