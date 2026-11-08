export const PHONE_QUERY = 'phone'
export const PHONE_IDLE_MS = 15000
export const PHONE_HOME = 'Play on your phone (recommended), or click the fretboard below.'
export const PHONE_TRY = 'Play on your phone (recommended), or click the fretboard below.'
export const OUT_OF_BOX = "That note isn't in the box"

export function supabaseConfig() {
  const env = import.meta.env || {}
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url, key }
}

export function randomSessionId() {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (value) => value.toString(36).padStart(2, '0')).join('').slice(0, 12)
}

export function channelName(sessionId) {
  return `guitar-${sessionId}`
}

export function phoneUrl(sessionId) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set(PHONE_QUERY, sessionId)
  return url.toString()
}

export function readPhoneSession() {
  const id = new URLSearchParams(window.location.search).get(PHONE_QUERY)
  if (!id || id.length < 10) return null
  return id
}

export function validNote(payload) {
  const string = Number(payload?.string)
  const fret = Number(payload?.fret)
  if (!Number.isInteger(string) || !Number.isInteger(fret)) return null
  if (string < 1 || string > 6 || fret < 0 || fret > 12) return null
  return { string, fret, time: Number(payload.time) || Date.now() }
}
