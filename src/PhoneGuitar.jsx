import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import {
  COURSE_FRETS,
  COURSE_STRINGS,
  midiOf,
  noteName,
  noteWithOctave,
  acousticUrlsForNeck,
} from './notes.js'
import { channelName, validNote } from './phoneLink.js'
import { getSupabase } from './supabaseClient.js'

const DOTS = { 3: 1, 5: 1, 7: 1, 9: 1, 12: 2 }

async function keepAwake() {
  try {
    if (navigator.wakeLock?.request) await navigator.wakeLock.request('screen')
  } catch {
    /* phones may deny this */
  }
}

function PhoneNeck({ namesOn, onTap, cursor }) {
  return (
    <div className="phone-neck" role="group" aria-label="Guitar neck, six strings, frets 0 to 12, nut at the top">
      <div className="phone-strings" aria-hidden="true">
        {COURSE_STRINGS.map((string) => (
          <i key={string} className={`phone-string s${string}`} />
        ))}
      </div>
      <div className="phone-nut" aria-hidden="true">
        <span />
        {COURSE_STRINGS.map((string) => (
          <span key={string}>{string === 1 ? 'e' : noteName(midiOf(string, 0))}</span>
        ))}
      </div>
      {COURSE_FRETS.map((fret) => (
        <div
          className={`phone-fret ${fret === 0 ? 'open' : ''} ${fret === 1 ? 'after-nut' : ''}`}
          key={fret}
        >
          <span className="phone-fret-num">{fret}</span>
          {COURSE_STRINGS.map((string) => {
            const now = cursor && cursor.string === string && cursor.fret === fret
            return (
              <button
                key={`${string}-${fret}`}
                type="button"
                className={`phone-cell ${now ? 'now' : ''}`}
                onClick={() => onTap(string, fret)}
                aria-label={`${noteName(midiOf(string, fret))} string ${string} fret ${fret}`}
              >
                {namesOn ? <span>{noteName(midiOf(string, fret))}</span> : null}
              </button>
            )
          })}
          {DOTS[fret] ? (
            <span className={`phone-dots n${DOTS[fret]}`} aria-hidden="true">
              {Array.from({ length: DOTS[fret] }, (_, index) => (
                <i key={index} />
              ))}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default function PhoneGuitar({ sessionId }) {
  const [started, setStarted] = useState(false)
  const [status, setStatus] = useState('Connecting…')
  const [namesOn, setNamesOn] = useState(true)
  const [cursor, setCursor] = useState(null)
  const samplerRef = useRef(null)
  const channelRef = useRef(null)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setStatus('This phone guitar needs a live connection. Open the site from the QR code.')
      return undefined
    }
    const channel = supabase.channel(channelName(sessionId), {
      config: { broadcast: { self: false } },
    })
    channel.subscribe((state) => {
      if (state === 'SUBSCRIBED') setStatus('Connected. Tap to start.')
      if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') setStatus('Disconnected')
    })
    channelRef.current = channel
    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [sessionId])

  async function send(event, payload) {
    await channelRef.current?.send({ type: 'broadcast', event, payload })
  }

  async function start() {
    await Tone.start()
    if (!samplerRef.current) {
      samplerRef.current = new Tone.Sampler({
        urls: acousticUrlsForNeck(),
        baseUrl: '/samples/guitar-samples/acoustic/',
        attack: 0.004,
        release: 0.7,
      }).toDestination()
      samplerRef.current.volume.value = -6
      await Tone.loaded()
    }
    await keepAwake()
    setStarted(true)
    setStatus('Connected')
    await send('hello', { time: Date.now() })
  }

  useEffect(() => {
    if (!started) return undefined
    const id = window.setInterval(() => {
      send('hello', { time: Date.now() })
    }, 4000)
    return () => window.clearInterval(id)
  }, [started])

  async function tap(string, fret) {
    const note = validNote({ string, fret, time: Date.now() })
    if (!note) return
    setCursor(note)
    const sampler = samplerRef.current
    if (sampler) sampler.triggerAttackRelease(noteWithOctave(midiOf(string, fret)), 0.85, Tone.now(), 0.9)
    await send('note', note)
  }

  return (
    <div className="phone-app">
      <header className="phone-top">
        <p className="phone-brand">Jimmy Page</p>
        <p className="phone-status" role="status">
          <span
            className={`phone-dot ${status === 'Connected' || status === 'Connected. Tap to start.' ? 'on' : 'off'}`}
            aria-hidden="true"
          />
          {status}
        </p>
        {started ? (
          <button type="button" className="ghost" onClick={() => setNamesOn((on) => !on)}>
            {namesOn ? 'Hide names' : 'Show names'}
          </button>
        ) : null}
      </header>
      {!started ? (
        <button type="button" className="phone-start" onClick={start}>
          Tap to start
        </button>
      ) : (
        <PhoneNeck namesOn={namesOn} onTap={tap} cursor={cursor} />
      )}
    </div>
  )
}
