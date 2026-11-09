const KEY = 'jp-v3'

function emptyLesson() {
  return {
    status: 'new',
    quiz: [],
    showMe: 0,
    firstTryRight: 0,
    afterFixRight: 0,
    builderTries: [],
    practiceOk: false,
  }
}

export function loadV3() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || '{}')
    return {
      view: raw.view || 'home',
      currentId: raw.currentId || null,
      reportModuleId: raw.reportModuleId || null,
      lessons: raw.lessons || {},
    }
  } catch {
    return { view: 'home', currentId: null, reportModuleId: null, lessons: {} }
  }
}

export function saveV3(patch) {
  const next = { ...loadV3(), ...patch }
  window.localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function patchLesson(id, patch) {
  const state = loadV3()
  const rec = { ...(state.lessons[id] || emptyLesson()), ...patch }
  state.lessons = { ...state.lessons, [id]: rec }
  window.localStorage.setItem(KEY, JSON.stringify(state))
  return state
}

export function clearV3() {
  window.localStorage.removeItem(KEY)
}

export function emptyLessonRecord() {
  return emptyLesson()
}
