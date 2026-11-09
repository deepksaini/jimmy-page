import { useEffect, useState } from 'react'
import { createEngine } from './audio.js'
import { noteFromKey } from './keys.js'
import { applyTheme, loadTheme } from './theme.js'
import { clearLearn } from './learnStore.js'
import { clearTheory } from './theoryStore.js'
import { clearV3 } from './v3Store.js'
import { GuitarLinkProvider } from './GuitarLink.jsx'
import PhoneGuitar from './PhoneGuitar.jsx'
import { readPhoneSession } from './phoneLink.js'
import CourseV3 from './CourseV3.jsx'
import './styles.css'

const engine = createEngine()

function ThemeToggle({ theme, onTheme }) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? 'Switch to light' : 'Switch to dark'}
      aria-pressed={dark}
      onClick={() => onTheme(dark ? 'light' : 'dark')}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.1" fill="currentColor" />
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 3.2v1.7M12 19.1v1.7M4.9 4.9l1.2 1.2M17.9 17.9l1.2 1.2M3.2 12h1.7M19.1 12h1.7M4.9 19.1l1.2-1.2M17.9 6.1l1.2-1.2" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M15 3.1a8.3 8.3 0 1 0 5.8 13.5A7 7 0 0 1 15 3.1z" />
        </svg>
      )}
    </button>
  )
}

function CourseApp() {
  const [theme, setTheme] = useState(() => applyTheme(loadTheme()))
  const [session, setSession] = useState(0)

  function restartSession() {
    if (!window.confirm('Start over from the beginning? This clears progress on this computer. Theme is kept.')) return
    engine.stop()
    clearTheory()
    clearLearn()
    clearV3()
    try {
      window.localStorage.removeItem('pbp-phrases')
      window.localStorage.removeItem('pbp-lesson-stats')
    } catch {
      /* ignore */
    }
    setSession((n) => n + 1)
  }

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
      await engine.pluck(mapped.string, mapped.fret)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <GuitarLinkProvider>
      <div className="app wide" onPointerDown={() => engine.unlock()}>
        <div className="app-bar">
          <ThemeToggle theme={theme} onTheme={(next) => setTheme(applyTheme(next))} />
        </div>
        <CourseV3 key={session} engine={engine} onRestart={restartSession} />
      </div>
    </GuitarLinkProvider>
  )
}

export default function App() {
  const phoneSession = readPhoneSession()
  if (phoneSession) return <PhoneGuitar sessionId={phoneSession} />
  return <CourseApp />
}
