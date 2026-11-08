import { continueSummary } from '../theoryLogic.js'
import { emptyConcept } from '../theoryStore.js'
import { MODULES } from './catalog.js'

export function moduleForConcept(id) {
  return MODULES.find((mod) => mod.concepts?.some((concept) => concept.id === id)) || null
}

export function lastConceptOf(mod) {
  if (!mod?.concepts?.length) return null
  return mod.concepts[mod.concepts.length - 1]
}

export function firstConceptOf(mod) {
  return mod?.concepts?.[0] || null
}

export function nextModule(mod) {
  const live = MODULES.filter((item) => item.status === 'full' || item.status === 'roadmap')
  const index = live.findIndex((item) => item.id === mod.id)
  return live[index + 1] || null
}

export function buildLearningReport(mod, conceptMap) {
  const items = (mod.concepts || []).map((concept) => ({
    concept,
    rec: conceptMap[concept.id] || emptyConcept(),
  }))
  const whereStarted = items
    .filter((item) => item.rec.diagnoseAnswer || item.rec.status === 'not-yet')
    .map((item) => `${item.concept.id} ${item.concept.name}: ${continueSummary(item.concept, item.rec)}`)
  const covered = []
  items.forEach((item) => {
    const keys = item.rec.explanationsShown || []
    keys.forEach((key) => {
      const text = item.concept.explain?.[key] || item.concept.explain?.default
      if (text) covered.push(text)
    })
    if (keys.length && item.concept.hear?.caption) covered.push(item.concept.hear.caption)
  })
  const evidence = items.flatMap((item) =>
    (item.rec.verifies || [])
      .filter((row) => row.result === 'success')
      .map((row) => ({
        concept: `${item.concept.id} ${item.concept.name}`,
        answer: row.answer,
        reason: row.reason,
      })),
  )
  const uncertain = items.filter((item) => {
    const rec = item.rec
    if (rec.status === 'skipped' || rec.status === 'not-yet') return true
    const wins = (rec.verifies || []).filter((row) => row.result === 'success')
    return wins.length === 1
  })
  const enough = whereStarted.length > 0 || evidence.length > 0
  const next = uncertain[0] || items.find((item) => item.rec.status !== 'learned')
  return {
    early: !enough,
    title: `Module ${mod.number}: ${mod.title}`,
    whereStarted,
    covered,
    evidence,
    uncertain: uncertain.map((item) => `${item.concept.id} ${item.concept.name}`),
    nextStep: next?.concept.remember || null,
    nextConceptId: next?.concept.id || null,
  }
}
