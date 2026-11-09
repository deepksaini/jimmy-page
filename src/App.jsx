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
        <p className="eyebrow">Jimmy Page</p>
        <div className="top-row">
          <button type="button" className="ghost restart" onClick={restartSession}>
            Restart session
          </button>
          <ThemeSwitch theme={theme} onTheme={(next) => setTheme(applyTheme(next))} />
        </div>
        <CourseV3 key={session} engine={engine} />
      </div>
    </GuitarLinkProvider>
  )
}

export default function App() {
  const phoneSession = readPhoneSession()
  if (phoneSession) return <PhoneGuitar sessionId={phoneSession} />
  return <CourseApp />
}
