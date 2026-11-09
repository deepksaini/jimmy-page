import { useMemo, useState } from 'react'
import course from './course/lessons.json'
import LessonPlayer from './LessonPlayer.jsx'
import { HomeBack } from './board.jsx'
import { loadV3, saveV3 } from './v3Store.js'

function reportFor(mod, lessonsState) {
  const items = (mod.lessons || []).map((lesson) => {
    const rec = lessonsState[lesson.id] || {}
    return {
      id: lesson.id,
      name: lesson.name,
      done: rec.status === 'done',
      firstTryRight: rec.firstTryRight || 0,
      afterFixRight: rec.afterFixRight || 0,
      showMe: rec.showMe || 0,
      quizCount: lesson.quiz?.length || 0,
    }
  })
  const started = items.some((item) => item.done || item.quizCount)
  return {
    early: !started,
    title: `Module ${mod.number}: ${mod.title}`,
    items,
  }
}

function LearningReport({ mod, state, onHome, onContinue }) {
  const report = reportFor(mod, state.lessons)
  const live = course.modules
  const following = live[live.findIndex((item) => item.id === mod.id) + 1]
  return (
    <section className="panel learn-page report-page">
      <HomeBack onClick={onHome} />
      <h1>Learning report</h1>
      <p className="lede">{report.title}</p>
      {report.early ? (
        <p className="lesson-evidence">Not enough answers yet to judge this.</p>
      ) : (
        <>
          <h2>Lessons done</h2>
          <ul className="report-list">
            {report.items.map((item) => (
              <li key={item.id}>
                {item.id} {item.name}: {item.done ? 'done' : 'not done'}
              </li>
            ))}
          </ul>
          <h2>Quiz</h2>
          <ul className="report-list">
            {report.items.map((item) => (
              <li key={`${item.id}-q`}>
                {item.id}: {item.firstTryRight} right first time, {item.afterFixRight} after a fix
                {item.showMe ? `, Show me used ${item.showMe} time${item.showMe === 1 ? '' : 's'}` : ''}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="transport">
        {following ? (
          <button type="button" className="primary" onClick={() => onContinue(following)}>
            Next module
          </button>
        ) : null}
        <HomeBack onClick={onHome} />
      </div>
    </section>
  )
}

export default function CourseV3({ engine }) {
  const [state, setState] = useState(() => loadV3())
  const lessons = useMemo(() => course.modules.flatMap((mod) => mod.lessons || []), [])
  const open = state.view === 'lesson' ? lessons.find((item) => item.id === state.currentId) : null
  const reportMod = state.view === 'report' ? course.modules.find((item) => item.id === state.reportModuleId) : null
  const done = lessons.filter((item) => state.lessons[item.id]?.status === 'done').length

  function openLesson(id) {
    setState(saveV3({ view: 'lesson', currentId: id, reportModuleId: null }))
  }

  function goHome() {
    setState(saveV3({ view: 'home', currentId: null }))
  }

  if (open) {
    return (
      <LessonPlayer
        lessonId={open.id}
        engine={engine}
        onHome={goHome}
        onReport={(id) => setState(saveV3({ view: 'report', reportModuleId: id }))}
      />
    )
  }

  if (reportMod) {
    return (
      <LearningReport
        mod={reportMod}
        state={state}
        onHome={goHome}
        onContinue={(mod) => {
          if (mod.kind === 'roadmap') {
            setState(saveV3({ view: 'roadmap', reportModuleId: null }))
            return
          }
          const first = mod.lessons?.[0]
          if (first) openLesson(first.id)
        }}
      />
    )
  }

  if (state.view === 'roadmap') {
    const mod = course.modules.find((item) => item.id === 'm10')
    return (
      <section className="panel learn-page">
        <HomeBack onClick={goHome} />
        <h1>Module 10: {mod.title}</h1>
        <ul className="report-list">
          {mod.items.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="panel course-home">
      <h1>Jimmy Page</h1>
      <p className="lede">{course.goal}</p>
      <p className="lesson-evidence">{course.who}</p>
      <div className="progress-block">
        <p className="progress-label">
          {done} of {lessons.length} lessons done
        </p>
        <div className="course-bar">
          <span style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }} />
        </div>
      </div>
      <button
        type="button"
        className="primary continue"
        onClick={() => {
          const next = lessons.find((item) => state.lessons[item.id]?.status !== 'done')
          if (next) openLesson(next.id)
        }}
      >
        Continue
      </button>
      <ul className="course-toc">
        {course.modules.map((mod) => (
          <li key={mod.id}>
            {mod.kind === 'roadmap' ? (
              <button type="button" className="toc-item toc-module" onClick={() => setState(saveV3({ view: 'roadmap' }))}>
                <span>
                  <span className="toc-kicker">Module {mod.number}</span>
                  <span className="toc-title">{mod.title}</span>
                </span>
                <span className="toc-status">Roadmap</span>
              </button>
            ) : (
              <>
                <p className="toc-kicker">
                  Module {mod.number}: {mod.title}
                </p>
                {mod.intro ? <p className="hint">{mod.intro}</p> : null}
                <ul>
                  {(mod.lessons || []).map((lesson) => (
                    <li key={lesson.id}>
                      <button type="button" className="learn-item" onClick={() => openLesson(lesson.id)}>
                        <span>
                          {lesson.id} {lesson.name}
                        </span>
                        <span>{state.lessons[lesson.id]?.status === 'done' ? 'Done' : 'Not started'}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
