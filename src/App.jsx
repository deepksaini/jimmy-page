import { useEffect, useRef, useState } from 'react'
import { createEngine } from './audio.js'
import { noteFromKey } from './keys.js'
import { applyTheme, loadTheme } from './theme.js'
import TheoryCourse from './TheoryCourse.jsx'
import './styles.css'

const engine = createEngine()

function ThemeSwitch({ theme, onTheme }) {
  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      <button type="button" className={theme === 'light' ? 'ghost on' : 'ghost'} aria-pressed={theme === 'light'} onClick={() => onTheme('light')}>
        Light
      </button>
      <button type="button" className={theme === 'dark' ? 'ghost on' : 'ghost'} aria-pressed={theme === 'dark'} onClick={() => onTheme('dark')}>
        Dark
      </button>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => applyTheme(loadTheme()))
  const learnKey = useRef(null)

  useEffect(() => {
    async function onKey(event) {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      const focused = document.activeElement
      if (
        focused &&
        (focused.tagName === 'INPUT' ||
          focused.tagName === 'TEXTAREA' ||
          focused.tagName === 'SELECT' ||
          focused.isContentEditable)
      ) {
        return
      }
      const mapped = noteFromKey(event)
      if (!mapped) return
      event.preventDefault()
      if (learnKey.current) learnKey.current(mapped)
      else await engine.pluck(mapped.string, mapped.fret)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app wide" onPointerDown={() => engine.unlock()}>
      <p className="eyebrow">Jimmy Page</p>
      <div className="top-row">
        <span />
        <ThemeSwitch theme={theme} onTheme={(next) => setTheme(applyTheme(next))} />
      </div>
      <TheoryCourse engine={engine} learnKey={learnKey} />
    </div>
  )
}
