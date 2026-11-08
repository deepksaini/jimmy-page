import { useEffect, useMemo, useState } from 'react'
import { HomeBack, KindChips } from './board.jsx'
import { FullFretboard, LabelModeSwitch } from './FullFretboard.jsx'
import {
  allConcepts,
  conceptById,
  COURSE_FOR,
  COURSE_GOAL,
  MODULES,
  nextConcept,
} from './theory/catalog.js'
import Course from './Course.jsx'
import { buildLearningReport, moduleForConcept, nextModule } from './theory/report.js'
import { SAMPLE_CREDIT } from './notes.js'
import { chordNotes } from './voicings.js'
import {
  continueSummary,
  diagnosePath,
  explainText,
  findOption,
  nextVerifyIndex,
  statusLine,
  verifyOutcome,
} from './theoryLogic.js'
import { emptyConcept, loadTheory, patchConcept, saveTheory } from './theoryStore.js'

function Options({ options, onPick }) {
  return (
    <div className="quiz">
      {options.map((item) => (
        <button key={item.text} type="button" className="choice" onClick={() => onPick(item.text)}>
          {item.text}
        </button>
      ))}
    </div>
  )
}

function IntervalTable({ rows }) {
  if (!rows?.length) return null
  return (
    <div className="interval-table-wrap">
      <table className="interval-table">
        <thead>
          <tr>
            <th>Half steps</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.steps}>
              <td>{row.steps}</td>
              <td>{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HearBlock({ hear, engine, labels, onLabels, cursor, onCursor }) {
  const [playing, setPlaying] = useState(false)
  const [root, setRoot] = useState(hear?.scaleRoot || 'C')

  useEffect(() => {
    setRoot(hear?.scaleRoot || 'C')
  }, [hear?.scaleRoot])

  const highlighted = root === hear?.alsoRoot && hear?.alsoHighlighted ? hear.alsoHighlighted : hear?.highlighted || []

  async function play() {
    if (!hear?.play) return
    await engine.unlock()
    setPlaying(true)
    const finish = () => {
      setPlaying(false)
      onCursor(null)
    }
    const onNote = (pos) => onCursor(pos)
    if (hear.play.kind === 'clicks-strum') {
      engine.playClicksThenStrums({ ...hear.play, onNote, onDone: finish })
      return
    }
    if (hear.play.kind === 'slot-strums') {
      engine.playSlotStrums(hear.play.bars, { bpm: hear.play.bpm || 80, onNote, onDone: finish })
      return
    }
    if (hear.play.script) {
      engine.playScript(hear.play.script, { onNote, onDone: finish })
      return
    }
    const positions = hear.play.chord ? chordNotes(hear.play.chord) : hear.play.positions
    const first = {
      mode: hear.play.mode,
      gap: hear.play.gap,
      onNote,
    }
    if (hear.play.thenTogether) {
      engine.playPositions(positions, {
        ...first,
        onDone: () => {
          engine.playPositions(hear.play.thenTogether, {
            mode: 'together',
            onNote,
            onDone: finish,
          })
        },
      })
      return
    }
    engine.playPositions(positions, { ...first, onDone: finish })
  }

  return (
    <div className="hear-see">
      <LabelModeSwitch mode={labels} onMode={onLabels} />
      {hear?.alsoRoot ? (
        <div className="player-nav">
          <button type="button" className={root === hear.scaleRoot ? 'primary' : 'ghost'} onClick={() => setRoot(hear.scaleRoot)}>
            {hear.scaleRoot} major
          </button>
          <button type="button" className={root === hear.alsoRoot ? 'primary' : 'ghost'} onClick={() => setRoot(hear.alsoRoot)}>
            {hear.alsoRoot} major
          </button>
        </div>
      ) : null}
      {hear?.caption ? <p className="lesson-evidence">{hear.caption}</p> : null}
      {hear?.countLine ? <p className="remember">{hear.countLine}</p> : null}
      <button
        type="button"
        className={`hear-play ${playing ? 'on' : ''}`}
        onClick={() => (playing ? engine.stop() : play())}
        aria-label={playing ? 'Stop' : 'Play'}
      >
        {playing ? <span className="stop-sq" /> : <span className="tri" />}
      </button>
      <FullFretboard
        labelMode={labels}
        scaleRoot={root}
        highlighted={highlighted}
        cursor={cursor}
      />
    </div>
  )
}

function LearningReport({ mod, state, engine, onHome, onContinue }) {
  const report = buildLearningReport(mod, state.concepts)
  const following = nextModule(mod)
  return (
    <section className="panel learn-page report-page">
      <HomeBack
        onClick={() => {
          engine.stop()
          onHome()
        }}
      />
      <h1>Learning report</h1>
      <p className="lede">{report.title}</p>
      {report.early ? (
        <p className="lesson-evidence">Not enough answers yet to judge this.</p>
      ) : (
        <>
          <h2>Where you started</h2>
          {report.whereStarted.length ? (
            <ul className="report-list">
              {report.whereStarted.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="lesson-evidence">No diagnose answers in this module.</p>
          )}
          <h2>What we covered</h2>
          {report.covered.length ? (
            report.covered.map((text, index) => (
              <p key={index} className="lesson-evidence">
                {text}
              </p>
            ))
          ) : (
            <p className="lesson-evidence">No explanations were shown in this module.</p>
          )}
          <h2>Evidence</h2>
          {report.evidence.length ? (
            <ul className="report-list">
              {report.evidence.map((row, index) => (
                <li key={`${row.concept}-${index}`}>
                  {row.concept}: “{row.answer}”
                  {row.reason ? ` — “${row.reason}”` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p className="lesson-evidence">No correct answer-and-reason pairs yet.</p>
          )}
          <h2>Still uncertain</h2>
          {report.uncertain.length ? (
            <ul className="report-list">
              {report.uncertain.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="lesson-evidence">Nothing marked uncertain in this module.</p>
          )}
          <h2>One next step</h2>
          {report.nextStep ? <p className="remember">{report.nextStep}</p> : null}
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

function ConceptPlayer({ concept, engine, state, onState, onHome, onReport }) {
  const record = state.concepts[concept.id] || emptyConcept()
  const [note, setNote] = useState('')
  const [cursor, setCursor] = useState(null)
  const [labels, setLabels] = useState(concept.hear?.labelMode || 'names')
  const [ownWords, setOwnWords] = useState(record.note || '')
  const [offerReveal, setOfferReveal] = useState(false)
  const stage = state.stage
  const verifyQ = concept.verify[state.verifyIndex] || concept.verify[0]
  const diagnoseHear = concept.diagnose.hear
  const showBoard = stage !== 'explain' && !(stage === 'diagnose' && concept.diagnose.hearFirst)

  function persist(patch, conceptPatch) {
    let next = saveTheory(patch)
    if (conceptPatch) next = patchConcept(concept.id, conceptPatch)
    onState(next)
    return next
  }

  function go(nextStage, extra = {}, conceptPatch) {
    engine.stop()
    setNote('')
    persist({ stage: nextStage, ...extra }, conceptPatch)
  }

  useEffect(() => {
    persist({ currentId: concept.id, view: 'lesson' })
  }, [concept.id])

  function afterFail(verifies, used) {
    const success = verifies.some((item) => item.result === 'success')
    if (used.length >= 3 && !success) {
      setOfferReveal(true)
      persist({ usedVerify: used }, { verifies })
      return
    }
    const next = nextVerifyIndex(used, concept.verify.length)
    persist({ stage: 'verify', verifyIndex: next, usedVerify: used, pendingAnswer: null }, { verifies })
  }

  function finishVerifySuccess(verifies, extraNote) {
    if (extraNote) setNote(extraNote)
    persist({ stage: 'continue', pendingAnswer: null }, { verifies, status: 'learned' })
  }

  function onDiagnose(answer) {
    const path = diagnosePath(concept, answer)
    persist({}, { diagnoseAnswer: answer, gap: path.gap || null, status: 'in-progress' })
    if (path.stage === 'followup') {
      go('followup')
      return
    }
    if (path.skipExplain) {
      go('verify', { verifyIndex: 0, usedVerify: [] })
      return
    }
    const shown = [...(record.explanationsShown || [])]
    if (path.gap && !shown.includes(path.gap)) shown.push(path.gap)
    go('explain', {}, { gap: path.gap, explanationsShown: shown })
  }

  function onFollow(answer) {
    const path = diagnosePath(concept, 'Not sure', answer)
    if (path.skipExplain) {
      go('verify', { verifyIndex: 0, usedVerify: [] }, { followAnswer: answer })
      return
    }
    const shown = [...(record.explanationsShown || [])]
    if (path.gap && !shown.includes(path.gap)) shown.push(path.gap)
    go('explain', { followAnswer: answer }, { gap: path.gap, explanationsShown: shown })
  }

  function onVerifyAnswer(answer) {
    const option = findOption(verifyQ.options, answer)
    if (option?.correct) {
      if (!verifyQ.why?.length) {
        const verifies = [...(record.verifies || []), { question: verifyQ.prompt, answer, reason: null, result: 'success' }]
        finishVerifySuccess(verifies)
        return
      }
      persist({ stage: 'why-verify', pendingAnswer: answer })
      return
    }
    if (verifyQ.fix) setNote(verifyQ.fix)
    const verifies = [...(record.verifies || []), { question: verifyQ.prompt, answer, reason: null, result: 'wrong' }]
    afterFail(verifies, [...state.usedVerify, state.verifyIndex])
  }

  function onWhy(reason) {
    const result = verifyOutcome(verifyQ, state.pendingAnswer, reason)
    const verifies = [
      ...(record.verifies || []),
      { question: verifyQ.prompt, answer: state.pendingAnswer, reason, result },
    ]
    if (result === 'success') {
      const right = verifyQ.why.find((item) => item.correct)
      finishVerifySuccess(verifies, `Yes. ${right.text}.`)
      return
    }
    if (result === 'right-wrong-reason') {
      const right = verifyQ.why.find((item) => item.correct)
      setNote(`The answer may be right. Hint: ${right.text}`)
    } else if (verifyQ.fix) {
      setNote(verifyQ.fix)
    }
    afterFail(verifies, [...state.usedVerify, state.verifyIndex])
  }

  function leaveToReport(status) {
    engine.stop()
    patchConcept(concept.id, { note: ownWords, status })
    const mod = moduleForConcept(concept.id)
    persist({ view: 'report', reportModuleId: mod.id, currentId: concept.id })
    onReport(mod.id)
  }

  const latest = loadTheory().concepts[concept.id] || record

  return (
    <section className="panel learn-page">
      <HomeBack
        onClick={() => {
          engine.stop()
          persist({ view: 'home' })
          onHome()
        }}
      />
      <KindChips chips={concept.chips} />
      <h1>
        {concept.id} {concept.name}
      </h1>

      {stage === 'diagnose' ? (
        <>
          {concept.diagnose.hearFirst && diagnoseHear ? (
            <HearBlock hear={diagnoseHear} engine={engine} labels={labels} onLabels={setLabels} cursor={cursor} onCursor={setCursor} />
          ) : null}
          <p className="lesson-evidence">{concept.diagnose.prompt}</p>
          <Options options={concept.diagnose.options} onPick={onDiagnose} />
        </>
      ) : null}

      {stage === 'followup' ? (
        <>
          <p className="lesson-evidence">{concept.followUp.prompt}</p>
          <Options options={concept.followUp.options} onPick={onFollow} />
        </>
      ) : null}

      {stage === 'explain' ? (
        <>
          <p className="lesson-evidence">{explainText(concept, record.gap)}</p>
          {concept.explain.tip ? <p className="lesson-evidence">{concept.explain.tip}</p> : null}
          <IntervalTable rows={concept.explain.table} />
          <HearBlock hear={concept.hear} engine={engine} labels={labels} onLabels={setLabels} cursor={cursor} onCursor={setCursor} />
          <div className="player-nav">
            <span />
            <button type="button" className="primary" onClick={() => go('verify', { verifyIndex: 0, usedVerify: [] })}>
              Next
            </button>
          </div>
        </>
      ) : null}

      {stage === 'verify' ? (
        <>
          <p className="lesson-evidence">{verifyQ.prompt}</p>
          <Options options={verifyQ.options} onPick={onVerifyAnswer} />
        </>
      ) : null}

      {stage === 'why-verify' ? (
        <>
          <p className="lesson-evidence">Why?</p>
          <Options options={verifyQ.why} onPick={onWhy} />
        </>
      ) : null}

      {note ? <p className={stage === 'continue' ? 'check-ok' : 'check-note'}>{note}</p> : null}

      {offerReveal && stage !== 'continue' ? (
        <button type="button" className="primary" onClick={() => persist({ stage: 'continue' }, { status: 'not-yet' })}>
          Show me and continue
        </button>
      ) : null}

      {stage === 'continue' ? (
        <>
          <p className="remember">{continueSummary(concept, latest)}</p>
          {latest.status === 'not-yet' ? <p className="lesson-evidence">{concept.remember}</p> : null}
          <label className="own-words">
            In your own words (optional)
            <textarea value={ownWords} onChange={(event) => setOwnWords(event.target.value)} rows={3} />
          </label>
          <div className="transport">
            <button
              type="button"
              className="primary"
              onClick={() => {
                const following = nextConcept(concept.id)
                const mod = moduleForConcept(concept.id)
                const last = mod.concepts[mod.concepts.length - 1]
                patchConcept(concept.id, {
                  note: ownWords,
                  status: latest.status === 'not-yet' ? 'not-yet' : 'learned',
                })
                if (!following || following.moduleId !== mod.id || concept.id === last.id) {
                  persist({ view: 'report', reportModuleId: mod.id, currentId: concept.id })
                  onReport(mod.id)
                  return
                }
                persist({
                  view: 'lesson',
                  currentId: following.id,
                  stage: 'diagnose',
                  verifyIndex: 0,
                  usedVerify: [],
                  pendingAnswer: null,
                })
              }}
            >
              Next concept
            </button>
            <button
              type="button"
              onClick={() => {
                const unused = concept.verify
                  .map((_, index) => index)
                  .filter((index) => !state.usedVerify.includes(index))
                go('verify', { verifyIndex: unused[0] ?? 0 })
              }}
            >
              Revisit with a new example
            </button>
            <button
              type="button"
              onClick={() => leaveToReport(latest.status === 'learned' ? 'learned' : 'skipped')}
            >
              Stop for now
            </button>
          </div>
        </>
      ) : null}

      {showBoard ? (
        <FullFretboard
          labelMode={labels}
          scaleRoot={concept.hear?.scaleRoot || 'C'}
          highlighted={stage === 'diagnose' || stage === 'followup' ? [] : concept.hear?.highlighted || []}
          cursor={cursor}
        />
      ) : null}

      <p className="status-line">{statusLine(stage, concept.name)}</p>
    </section>
  )
}

function RoadmapPage({ engine, onHome }) {
  const mod = MODULES.find((item) => item.id === 'm10')
  return (
    <section className="panel learn-page">
      <HomeBack
        onClick={() => {
          engine.stop()
          onHome()
        }}
      />
      <h1>
        Module {mod.number}: {mod.title}
      </h1>
      <ul className="report-list">
        {mod.items.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}

export default function TheoryCourse({ engine, learnKey }) {
  const [state, setState] = useState(() => loadTheory())
  const concepts = useMemo(() => allConcepts(), [])
  const open = state.view === 'lesson' ? conceptById(state.currentId) : null
  const reportMod = state.view === 'report' ? MODULES.find((item) => item.id === state.reportModuleId) : null
  const learned = concepts.filter((item) => state.concepts[item.id]?.status === 'learned').length

  function openModule(mod) {
    if (mod.kind === 'improv') {
      setState(saveTheory({ view: 'improv', reportModuleId: null }))
      return
    }
    if (mod.status === 'roadmap') {
      setState(saveTheory({ view: 'roadmap', reportModuleId: null }))
      return
    }
    if (mod.concepts?.[0]) openConcept(mod.concepts[0].id)
  }

  function openConcept(id) {
    setState(
      saveTheory({
        view: 'lesson',
        currentId: id,
        stage: 'diagnose',
        verifyIndex: 0,
        usedVerify: [],
        pendingAnswer: null,
        reportModuleId: null,
      }),
    )
  }

  function goHome() {
    setState(saveTheory({ view: 'home', reportModuleId: null }))
  }

  if (reportMod) {
    return (
      <LearningReport
        mod={reportMod}
        state={state}
        engine={engine}
        onHome={goHome}
        onContinue={(mod) => openModule(mod)}
      />
    )
  }

  if (state.view === 'improv') {
    return <Course engine={engine} learnKey={learnKey} onExit={goHome} />
  }

  if (state.view === 'roadmap') {
    return <RoadmapPage engine={engine} onHome={goHome} />
  }

  if (open) {
    return (
      <ConceptPlayer
        key={open.id}
        concept={open}
        engine={engine}
        state={state}
        onState={setState}
        onHome={goHome}
        onReport={(id) => setState(saveTheory({ view: 'report', reportModuleId: id }))}
      />
    )
  }

  return (
    <section className="panel course-home">
      <h1>Jimmy Page</h1>
      <p className="lede">{COURSE_GOAL}</p>
      <p className="lesson-evidence">{COURSE_FOR}</p>
      <div className="progress-block">
        <p className="progress-label">
          {learned} of {concepts.length} concepts done
        </p>
        <div className="course-bar" role="progressbar" aria-valuenow={learned} aria-valuemax={concepts.length}>
          <span style={{ width: `${concepts.length ? (learned / concepts.length) * 100 : 0}%` }} />
        </div>
      </div>
      <button
        type="button"
        className="primary continue"
        onClick={() => {
          const saved = loadTheory()
          const current = saved.currentId && conceptById(saved.currentId)
          if (current && saved.concepts[current.id]?.status !== 'learned') {
            setState(saveTheory({ view: 'lesson', currentId: current.id }))
            return
          }
          const next = concepts.find((item) => saved.concepts[item.id]?.status !== 'learned')
          if (next) {
            openConcept(next.id)
            return
          }
          openModule(MODULES.find((item) => item.id === 'm9'))
        }}
      >
        Continue
      </button>
      <ul className="course-toc">
        {MODULES.map((mod) => (
          <li key={mod.id}>
            {mod.kind === 'improv' || mod.status === 'roadmap' ? (
              <button type="button" className="toc-item toc-module" onClick={() => openModule(mod)}>
                <span className="toc-copy">
                  <span className="toc-title">
                    Module {mod.number}: {mod.title}
                  </span>
                  <span className="toc-meta">{mod.status === 'roadmap' ? 'Roadmap' : 'Ready'}</span>
                </span>
              </button>
            ) : (
              <div className="toc-item toc-module">
                <span className="toc-copy">
                  <span className="toc-title">
                    Module {mod.number}: {mod.title}
                  </span>
                  <span className="toc-meta">{mod.status === 'full' ? 'Ready' : 'Coming next'}</span>
                </span>
              </div>
            )}
            {mod.concepts ? (
              <ul className="concept-list">
                {mod.concepts.map((concept) => {
                  const status = state.concepts[concept.id]?.status
                  return (
                    <li key={concept.id}>
                      <button type="button" className="learn-item" onClick={() => openConcept(concept.id)}>
                        <span>
                          {concept.id} {concept.name}
                        </span>
                        <span className={`learn-flag ${status === 'learned' ? 'done' : ''}`}>
                          {status === 'learned'
                            ? 'Learned'
                            : status === 'not-yet'
                              ? 'Not yet shown'
                              : status === 'skipped'
                                ? 'Skipped'
                                : 'Not started'}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="about">
        <h2>About / Credits</h2>
        <p className="lesson-evidence">{SAMPLE_CREDIT}</p>
      </div>
    </section>
  )
}
