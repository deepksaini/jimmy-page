import { useEffect, useMemo, useRef, useState } from 'react'
import course from './course/lessons.json'
import Guitar from './Guitar.jsx'
import PhoneFrame from './PhoneFrame.jsx'
import BarBuilder from './BarBuilder.jsx'
import { stripSpec } from './barBuilder.js'
import { PlayOnPhoneButton, PhoneStatus, useGuitarLink } from './GuitarLink.jsx'
import { HomeBack, KindChips } from './board.jsx'
import { patchLesson } from './v3Store.js'
import { fixFor, isCorrectTap, remainingAfter } from './playLogic.js'
import { playedName } from './course/match.js'
import { CHORDS } from './music.js'
import { judgeRhythm } from './rhythm.js'

function allLessons() {
  return course.modules.flatMap((mod) => (mod.lessons || []).map((lesson) => ({ ...lesson, moduleId: mod.id, module: mod })))
}

function screensFor(lesson) {
  const screens = [{ type: 'why' }]
  lesson.teach.forEach((_, index) => screens.push({ type: 'teach', index }))
  lesson.examples.forEach((_, index) => screens.push({ type: 'example', index }))
  lesson.practice.forEach((_, index) => screens.push({ type: 'practice', index }))
  if (lesson.special) screens.push({ type: 'challenge' })
  lesson.quiz.forEach((_, index) => screens.push({ type: 'quiz', index }))
  if (lesson.remember) screens.push({ type: 'remember' })
  return screens
}

function stepCopy(lesson, screen) {
  if (screen.type === 'why') return { title: 'Why it matters', text: lesson.why, actions: [] }
  if (screen.type === 'teach') return { title: 'Teach', ...lesson.teach[screen.index], actions: lesson.teach[screen.index].actions }
  if (screen.type === 'example') return { title: 'Example', ...lesson.examples[screen.index], actions: lesson.examples[screen.index].actions }
  if (screen.type === 'practice') return { title: 'Practice', ...lesson.practice[screen.index], actions: lesson.practice[screen.index].actions }
  if (screen.type === 'quiz') return { title: `Quiz ${screen.index + 1}`, quiz: lesson.quiz[screen.index], actions: [] }
  if (screen.type === 'challenge') return { title: 'Final challenge', text: 'Four bars, no help. Meet the goals.', actions: [{ kind: 'improv', pass: { type: 'challenge' } }] }
  return { title: 'Remember', text: lesson.remember, actions: [] }
}

export default function LessonPlayer({ lessonId, engine, onHome, onReport }) {
  const lesson = useMemo(() => allLessons().find((item) => item.id === lessonId), [lessonId])
  const screens = useMemo(() => screensFor(lesson), [lesson])
  const guitar = useGuitarLink()
  const [page, setPage] = useState(0)
  const [note, setNote] = useState('')
  const [ok, setOk] = useState(false)
  const [collected, setCollected] = useState([])
  const [showMe, setShowMe] = useState(false)
  const [quizTries, setQuizTries] = useState(0)
  const [bars, setBars] = useState([[], [], [], []])
  const [liveBar, setLiveBar] = useState(0)
  const collectedRef = useRef([])
  const screen = screens[page]
  const copy = stepCopy(lesson, screen)
  const useBuilder = lesson.module.id === 'm9' && (screen.type === 'practice' || screen.type === 'challenge')
  const playAction = useBuilder
    ? null
    : copy.actions?.find((item) => item.kind === 'play' || item.kind === 'find' || item.kind === 'rhythm' || item.kind === 'improv') ||
      (copy.quiz?.kind === 'play' ? { ...copy.quiz, kind: 'play' } : null)
  const listenActions =
    copy.actions?.filter((item) => item.kind !== 'play' && item.kind !== 'find' && item.kind !== 'rhythm' && item.kind !== 'improv') || []

  useEffect(() => {
    setNote('')
    setOk(false)
    setCollected([])
    collectedRef.current = []
    setShowMe(false)
    setQuizTries(0)
    guitar?.clearBoard()
  }, [page, lessonId])

  useEffect(() => {
    if (!guitar || useBuilder) return undefined
    if (playAction?.kind === 'play' || (playAction?.kind === 'find' && showMe)) {
      guitar.setTargets({
        positions: playAction.positions || [],
        mode: playAction.mode || 'sequence',
        showNames: playAction.kind === 'play' || showMe,
      })
    }
    if (playAction?.kind === 'rhythm') guitar.setRhythmTask(playAction)
    return guitar.registerTap((string, fret, meta = {}) => {
      if (meta.rhythmResult) {
        setOk(meta.rhythmResult.ok)
        setNote(meta.rhythmResult.ok ? 'In time.' : 'Not quite in time. Try again.')
        return
      }
      if (string == null) return
      onTap(string, fret, meta)
    })
  }, [page, lessonId, showMe, playAction?.kind, playAction?.positions?.length, useBuilder])

  async function hear(action) {
    await engine.unlock()
    if (action.kind === 'strum') {
      const steps = (action.chords || []).map((chord) => ({ chord, mode: 'strum' }))
      engine.playScript(steps)
      return
    }
    if (action.kind === 'notes' || action.kind === 'play') {
      engine.playPositions(action.positions || [], { mode: 'seq', gap: 0.32 })
      return
    }
    if (action.kind === 'together') {
      engine.playPositions(action.positions || [], { mode: 'together' })
      return
    }
    if (action.kind === 'clicks') {
      engine.playClicks({ bpm: action.bpm || 80, bars: action.bars || 2 })
      return
    }
    if (action.kind === 'backing') {
      engine.playBacking(80, 0, {
        bars: 4,
        loops: 2,
        onBar: (bar) => {
          setLiveBar(bar)
          guitar?.setChordGlow(lesson.module.glow?.[CHORDS[bar]] || [])
        },
        onDone: () => guitar?.setChordGlow([]),
      })
    }
  }

  function onTap(string, fret, meta) {
    const tap = { string, fret, time: Date.now() }
    if (playAction?.kind === 'improv') {
      setBars((current) => {
        const next = current.map((bar, index) => (index === liveBar ? [...bar, { ...tap, startSlot: bar.length }] : bar))
        return next
      })
      if (!meta.fromPhone) engine.pluck(string, fret, meta)
      return
    }
    if (!playAction) {
      if (!guitar?.connected && !meta.fromPhone) engine.pluck(string, fret, meta)
      return
    }
    if (playAction.kind === 'rhythm' && !guitar?.connected) {
      setCollected((current) => {
        const next = [...current, tap]
        if (next.length >= (playAction.taps || playAction.beats)) {
          const judged = judgeRhythm(playAction, next.map((item) => item.time), next[0].time)
          setOk(judged.ok)
          setNote(judged.ok ? 'In time.' : 'Not quite in time. Try again.')
        }
        return next
      })
      if (!meta.fromPhone) engine.pluck(string, fret, meta)
      return
    }
    const good = isCorrectTap(playAction, collectedRef.current, tap)
    const label = `That's ${playedName(string, fret)}`
    guitar?.sendResult({ string, fret, ok: good, label })
    if (!good) {
      setNote(fixFor(copy.quiz || playAction, tap) || label)
      if (!guitar?.connected && !meta.fromPhone) engine.pluck(string, fret, meta)
      return
    }
    const left = remainingAfter(playAction, collectedRef.current, tap)
    const nextCollected = [...collectedRef.current, tap]
    collectedRef.current = nextCollected
    setCollected(nextCollected)
    if (!left.length) {
      setOk(true)
      setNote(screen.type === 'quiz' ? 'Yes.' : 'Got it.')
      if (screen.type === 'quiz') recordQuiz(true)
    }
    if (!guitar?.connected && !meta.fromPhone) engine.pluck(string, fret, meta)
  }

  function recordQuiz(correct) {
    const rec = patchLesson(lesson.id, {})
    const prev = rec.lessons[lesson.id]
    const first = quizTries === 0 && correct
    patchLesson(lesson.id, {
      quiz: [...(prev.quiz || []), { index: screen.index, correct, firstTry: first }],
      firstTryRight: (prev.firstTryRight || 0) + (first ? 1 : 0),
      afterFixRight: (prev.afterFixRight || 0) + (!first && correct ? 1 : 0),
    })
  }

  function onChoice(option) {
    if (option.correct) {
      setOk(true)
      setNote('Yes.')
      recordQuiz(true)
      return
    }
    const fix = (copy.quiz.fixes || []).find((item) => item.when === option.text)
    setQuizTries((n) => n + 1)
    setNote(fix?.fix || 'Try again.')
  }

  function next() {
    if (page >= screens.length - 1) {
      patchLesson(lesson.id, { status: 'done' })
      const mod = lesson.module
      const last = mod.lessons[mod.lessons.length - 1]
      if (lesson.id === last.id) {
        onReport(mod.id)
        return
      }
      onHome()
      return
    }
    setPage(page + 1)
  }

  const quizIndex = screens.findIndex((item) => item.type === 'quiz')
  const canClick = !guitar?.connected
  const frame = (
    <PhoneFrame>
      <Guitar
        namesOn={guitar?.view.showNames !== false}
        interactive={canClick}
        onTap={(string, fret) => guitar?.handleNote(string, fret, { fromPhone: false })}
        targets={guitar?.view.targets || []}
        currentIndex={guitar?.view.currentIndex || 0}
        mode={guitar?.view.mode || 'sequence'}
        chordGlow={guitar?.view.chordGlow || []}
        flash={guitar?.view.flash}
        cursor={guitar?.view.cursor}
        boxMode={guitar?.view.boxMode}
        allowBlue={guitar?.view.allowBlue}
      />
    </PhoneFrame>
  )

  return (
    <div className="v3-split">
      <section className="panel learn-page v3-lesson">
        <HomeBack onClick={onHome} />
        <KindChips chips={lesson.chips} />
        <h1>
          {lesson.id} {lesson.name}
        </h1>
        {quizIndex >= 0 ? (
          <button type="button" className="skip-quiz" onClick={() => setPage(quizIndex)}>
            Already know this? Skip to the quiz
          </button>
        ) : null}
        <p className="eyebrow">{copy.title}</p>
        {copy.text && !useBuilder ? <p className="lesson-evidence">{stripSpec(copy.text)}</p> : null}
        {copy.quiz ? <p className="lesson-evidence">{stripSpec(copy.quiz.prompt)}</p> : null}
        {copy.quiz?.kind === 'choose' ? (
          <div className="choices">
            {copy.quiz.options.map((option) => (
              <button key={option.text} type="button" className="choice" onClick={() => onChoice(option)}>
                {option.text}
              </button>
            ))}
          </div>
        ) : null}
        {listenActions.map((action, index) => (
          <button key={index} type="button" className="primary" onClick={() => hear(action)}>
            Listen
          </button>
        ))}
        {useBuilder ? (
          <BarBuilder
            lessonId={lesson.id}
            engine={engine}
            guitar={guitar}
            onResult={(scored) => {
              setOk(scored.ok)
              setNote(scored.summary)
            }}
          />
        ) : null}
        {screen.type === 'practice' && !useBuilder ? (
          <button
            type="button"
            onClick={() => {
              setShowMe(true)
              patchLesson(lesson.id, { showMe: (patchLesson(lesson.id, {}).lessons[lesson.id].showMe || 0) + 1 })
            }}
          >
            Show me
          </button>
        ) : null}
        {note && !useBuilder ? <p className={ok ? 'check-ok' : 'check-note'}>{note}</p> : null}
        <div className="player-nav">
          <button type="button" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            Back
          </button>
          <button type="button" className="primary" onClick={next} disabled={(!!copy.quiz || useBuilder) && !ok}>
            {page === screens.length - 1 ? 'Done' : 'Next'}
          </button>
        </div>
        <p className="status-line">
          {copy.title} · {lesson.name}
        </p>
      </section>
      <aside className="v3-guitar">
        <div className="phone-dock">
          <div className="phone-aside-head">
            <PlayOnPhoneButton className="primary play-phone" />
            <PhoneStatus />
          </div>
          {frame}
        </div>
      </aside>
    </div>
  )
}
