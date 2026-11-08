export function findOption(options, text) {
  return options.find((item) => item.text === text)
}

export function diagnosePath(concept, answer, followAnswer) {
  const option = findOption(concept.diagnose.options, answer)
  if (!option) return { stage: 'diagnose' }
  if (option.notSure && concept.followUp) {
    if (!followAnswer) return { stage: 'followup' }
    const follow = findOption(concept.followUp.options, followAnswer)
    if (follow?.correct) return { stage: 'verify', gap: null, skipExplain: true }
    return { stage: 'explain', gap: follow?.explain || 'default' }
  }
  if (option.notSure) return { stage: 'explain', gap: option.explain || 'default' }
  if (option.correct) return { stage: 'verify', gap: null, skipExplain: true, correct: true }
  return { stage: 'explain', gap: option.gap || 'default' }
}

export function explainText(concept, gap) {
  const key = gap || 'default'
  return concept.explain[key] || concept.explain.default
}

export function verifyOutcome(question, answer, reason) {
  const option = findOption(question.options, answer)
  const answerRight = !!option?.correct
  if (!question.why?.length) return answerRight ? 'success' : 'wrong'
  const why = findOption(question.why, reason)
  const reasonRight = !!why?.correct
  if (answerRight && reasonRight) return 'success'
  if (answerRight && !reasonRight) return 'right-wrong-reason'
  return 'wrong'
}

export function nextVerifyIndex(used, total) {
  for (let i = 0; i < total; i += 1) {
    if (!used.includes(i)) return i
  }
  return used.length % total
}

export function statusLine(stage, conceptName) {
  const map = {
    diagnose: 'Diagnose',
    followup: 'Diagnose',
    'why-diagnose': 'Diagnose',
    explain: 'Explain',
    verify: 'Verify',
    'why-verify': 'Verify',
    continue: 'Continue',
  }
  return `Stage: ${map[stage] || stage} · Concept: ${conceptName}`
}

export function continueSummary(concept, record) {
  const first = record.diagnoseAnswer
  const ok = (record.verifies || []).find((item) => item.result === 'success')
  if (ok) {
    return `At first you picked ${first}. Later you answered “${ok.answer}” and explained why.`
  }
  if (record.status === 'not-yet') {
    return `You saw this concept after three tries: ${concept.remember}`
  }
  return concept.remember
}
