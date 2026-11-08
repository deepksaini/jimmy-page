const KEY = 'pbp-learn'

function empty() {
  return {
    done: {},
    started: {},
    fails: {},
    revealed: {},
    currentId: null,
    currentStep: 'learn',
    learnPage: 0,
    view: 'home',
    challengeFirst: null,
    challengeLatest: null,
  }
}

function normalize(parsed) {
  const base = empty()
  if (!parsed || typeof parsed !== 'object') return base
  return {
    done: parsed.done && typeof parsed.done === 'object' ? parsed.done : {},
    started: parsed.started && typeof parsed.started === 'object' ? parsed.started : {},
    fails: parsed.fails && typeof parsed.fails === 'object' ? parsed.fails : {},
    revealed: parsed.revealed && typeof parsed.revealed === 'object' ? parsed.revealed : {},
    currentId: typeof parsed.currentId === 'string' ? parsed.currentId : null,
    currentStep: typeof parsed.currentStep === 'string' ? parsed.currentStep : 'learn',
    learnPage: Number(parsed.learnPage) || 0,
    view: parsed.view === 'lesson' ? 'lesson' : 'home',
    challengeFirst: Number.isFinite(parsed.challengeFirst) ? parsed.challengeFirst : null,
    challengeLatest: Number.isFinite(parsed.challengeLatest) ? parsed.challengeLatest : null,
  }
}

export function loadLearn() {
  try {
    const raw = window.localStorage.getItem(KEY)
    return normalize(raw ? JSON.parse(raw) : empty())
  } catch {
    return empty()
  }
}

export function saveLearn(patch) {
  const state = { ...loadLearn(), ...patch }
  window.localStorage.setItem(KEY, JSON.stringify(state))
  return state
}

export function markLessonDone(id) {
  const state = loadLearn()
  return saveLearn({
    done: { ...state.done, [id]: true },
    fails: { ...state.fails, [id]: 0 },
  })
}

let lastFailId = ''
let lastFailAt = 0

export function bumpFail(id) {
  const now = Date.now()
  if (id === lastFailId && now - lastFailAt < 500) return loadLearn()
  lastFailId = id
  lastFailAt = now
  const state = loadLearn()
  const next = (Number(state.fails[id]) || 0) + 1
  return saveLearn({ fails: { ...state.fails, [id]: next } })
}

export function markRevealed(id) {
  const state = loadLearn()
  return saveLearn({
    revealed: { ...state.revealed, [id]: true },
    done: { ...state.done, [id]: true },
  })
}
