const KEY = 'pbp-theory'

function empty() {
  return {
    view: 'home',
    currentId: null,
    reportModuleId: null,
    stage: 'diagnose',
    verifyIndex: 0,
    usedVerify: [],
    followAnswer: null,
    diagnoseWhy: null,
    concepts: {},
  }
}

function normalize(parsed) {
  const base = empty()
  if (!parsed || typeof parsed !== 'object') return base
  return {
    ...base,
    ...parsed,
    concepts: parsed.concepts && typeof parsed.concepts === 'object' ? parsed.concepts : {},
    usedVerify: Array.isArray(parsed.usedVerify) ? parsed.usedVerify : [],
  }
}

export function loadTheory() {
  try {
    const raw = window.localStorage.getItem(KEY)
    return normalize(raw ? JSON.parse(raw) : empty())
  } catch {
    return empty()
  }
}

export function clearTheory() {
  window.localStorage.removeItem(KEY)
}

export function saveTheory(patch) {
  const state = { ...loadTheory(), ...patch }
  window.localStorage.setItem(KEY, JSON.stringify(state))
  return state
}

export function emptyConcept() {
  return {
    diagnoseAnswer: null,
    diagnoseWhy: null,
    gap: null,
    explanationsShown: [],
    verifies: [],
    status: 'in-progress',
    note: '',
  }
}

export function patchConcept(id, patch) {
  const state = loadTheory()
  const current = state.concepts[id] || emptyConcept()
  return saveTheory({
    concepts: {
      ...state.concepts,
      [id]: { ...current, ...patch },
    },
  })
}
