const KEY = 'pbp-theme'

export function loadTheme() {
  try {
    return window.localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.dataset.theme = next
  try {
    window.localStorage.setItem(KEY, next)
  } catch {
    /* ignore */
  }
  return next
}
