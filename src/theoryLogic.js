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
  const verifies = record.verifies || []
  const ok = verifies.find((item) => item.result === 'success')
  const hadWrongReason = verifies.some((item) => item.result === 'right-wrong-reason')
  const diagnoseCorrect = !!diagnosePath(concept, first).correct
  const firstTry = verifies[0]?.result === 'success'

  if (record.status === 'not-yet') {
    return "This one was shown to you, so it's marked 'not yet shown'. Try Revisit later."
  }
  if (hadWrongReason && ok) {
    return "You picked the right answer, and your second reason showed why it's right."
  }
  if (diagnoseCorrect && firstTry && ok) {
    if (ok.reason) {
      return `You already knew this. You picked ${first} and explained why ${ok.reason}.`
    }
    return `You already knew this. You picked ${first} and explained why.`
  }
  if (ok) {
    return `At first you picked ${first}. After the explanation, you answered ${ok.answer} and explained why.`
  }
  return concept.remember
}
