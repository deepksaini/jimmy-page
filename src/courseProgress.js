export const PLAYER_STEPS = ['learn', 'hear', 'try', 'check', 'recap']

export const PLAYER_LABELS = {
  learn: 'Learn',
  hear: 'Hear it',
  try: 'Try it',
  check: 'Check',
  recap: 'Recap',
}

export function catalog(lessons, ids) {
  return ids.map((id) => lessons.find((item) => item.id === id)).filter(Boolean)
}

export function isUnlocked(index, done, sequence) {
  if (index <= 0) return true
  const prev = sequence[index - 1]
  return !!(prev && done[prev.id])
}

export function lessonStatus(index, id, done, sequence) {
  if (done[id]) return 'done'
  if (!isUnlocked(index, done, sequence)) return 'locked'
  return 'progress'
}

export function doneCount(sequence, done) {
  return sequence.filter((item) => done[item.id]).length
}

export function continueTarget(sequence, progress) {
  const done = progress.done || {}
  const currentId = progress.currentId
  if (currentId) {
    const index = sequence.findIndex((item) => item.id === currentId)
    if (index >= 0 && !done[currentId] && isUnlocked(index, done, sequence)) {
      return {
        id: currentId,
        step: PLAYER_STEPS.includes(progress.currentStep) ? progress.currentStep : 'learn',
        learnPage: Number(progress.learnPage) || 0,
      }
    }
  }
  const next = sequence.find((item, index) => !done[item.id] && isUnlocked(index, done, sequence))
  if (!next) return null
  return { id: next.id, step: 'learn', learnPage: 0 }
}

export function stepIndex(step) {
  const index = PLAYER_STEPS.indexOf(step)
  return index < 0 ? 0 : index
}

export function canOpenStep(target, current, checkPassed) {
  const to = stepIndex(target)
  const from = stepIndex(current)
  if (to <= from) return true
  if (target === 'recap') return checkPassed
  if (current === 'check' && !checkPassed) return false
  return to === from + 1 || to < from
}

export function splitLearn(paragraphs, maxWords = 120) {
  const screens = []
  let current = []
  let words = 0
  for (const para of paragraphs || []) {
    const count = String(para).trim().split(/\s+/).filter(Boolean).length
    if (current.length && words + count > maxWords) {
      screens.push(current)
      current = [para]
      words = count
    } else {
      current.push(para)
      words += count
    }
  }
  if (current.length) screens.push(current)
  return screens.length ? screens : [[]]
}
