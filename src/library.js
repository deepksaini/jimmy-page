const KEY = 'pbp-phrases'

export function loadPhrases() {
  try {
    const raw = window.localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function savePhrase(name, bars, round) {
  const trimmed = (name || '').trim() || 'Untitled phrase'
  const list = loadPhrases()
  const item = {
    id: `${Date.now()}`,
    name: trimmed,
    bars,
    round,
    savedAt: new Date().toISOString(),
  }
  list.unshift(item)
  window.localStorage.setItem(KEY, JSON.stringify(list))
  return list
}

export function deletePhrase(id) {
  const list = loadPhrases().filter((item) => item.id !== id)
  window.localStorage.setItem(KEY, JSON.stringify(list))
  return list
}
