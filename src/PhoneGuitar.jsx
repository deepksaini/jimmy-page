import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import Guitar from './Guitar.jsx'
import { acousticUrlsForNeck, midiOf, noteWithOctave } from './notes.js'
import { channelName, validNote } from './phoneLink.js'
import { getSupabase } from './supabaseClient.js'
import { judgeRhythm, runClicks } from './rhythm.js'
import { playedName } from './course/match.js'

export default function PhoneGuitar({ sessionId }) {
  const [started, setStarted] = useState(false)
  const [status, setStatus] = useState('Connecting…')
  const [view, setView] = useState({
    targets: [],
    mode: 'sequence',
    showNames: true,
    currentIndex: 0,
    chordGlow: [],
    flash: null,
    cursor: null,
    rhythmTask: null,
    boxMode: false,
    allowBlue: false,
  })
  const samplerRef = useRef(null)
  const channelRef = useRef(null)
  const clicksRef = useRef(null)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setStatus('This phone guitar needs a live connection. Open the site from the QR code.')
      return undefined
    }
    const channel = supabase.channel(channelName(sessionId), { config: { broadcast: { self: false } } })
    channel.on('broadcast', { event: 'targets' }, ({ payload }) => {
      setView((current) => ({
        ...current,
        targets: payload.positions || [],
        mode: payload.mode || 'sequence',
        showNames: payload.showNames !== false,
        currentIndex: 0,
        flash: null,
        rhythmTask: null,
      }))
    })
    channel.on('broadcast', { event: 'clear' }, () => {
      setView((current) => ({
        ...current,
        targets: [],
        chordGlow: [],
        rhythmTask: null,
        flash: null,
        currentIndex: 0,
        boxMode: false,
        allowBlue: false,
      }))
    })
    channel.on('broadcast', { event: 'boxView' }, ({ payload }) => {
      setView((current) => ({
        ...current,
        boxMode: !!payload.boxMode,
        allowBlue: !!payload.allowBlue,
      }))
    })
    channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
      setView((current) => ({ ...current, cursor: payload }))
    })
    channel.on('broadcast', { event: 'result' }, ({ payload }) => {
      setView((current) => {
        const nextIndex =
          payload.ok && current.mode === 'sequence' ? current.currentIndex + 1 : current.currentIndex
        return { ...current, flash: payload, cursor: payload, currentIndex: nextIndex }
      })
      window.setTimeout(() => {
        setView((current) => ({ ...current, flash: null }))
      }, 700)
    })
    channel.on('broadcast', { event: 'chordGlow' }, ({ payload }) => {
      setView((current) => ({ ...current, chordGlow: payload.positions || [] }))
    })
    channel.on('broadcast', { event: 'rhythmTask' }, ({ payload }) => {
      setView((current) => ({ ...current, rhythmTask: payload }))
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
    setStarted(true)
    setStatus('Connected')
    await send('hello', { time: Date.now() })
  }

  useEffect(() => {
    if (!started) return undefined
    const id = window.setInterval(() => send('hello', { time: Date.now() }), 4000)
    return () => window.clearInterval(id)
  }, [started])

  useEffect(() => {
    if (!started || !view.rhythmTask) return undefined
    const task = view.rhythmTask
    const taps = []
    const startAt = performance.now() + 400
    clicksRef.current = { task, taps, startAt, stop: runClicks(task, startAt) }
    const limit = task.taps || task.beats
    return () => clicksRef.current?.stop?.()
  }, [started, view.rhythmTask])

  async function tap(string, fret) {
    const note = validNote({ string, fret, time: Date.now() })
    if (!note) return
    setView((current) => ({ ...current, cursor: note }))
    samplerRef.current?.triggerAttackRelease(noteWithOctave(midiOf(string, fret)), 0.85, Tone.now(), 0.9)
    if (clicksRef.current?.task) {
      clicksRef.current.taps.push(performance.now())
      const { task, taps, startAt } = clicksRef.current
      if (taps.length >= (task.taps || task.beats)) {
        const judged = judgeRhythm(task, taps, startAt)
        await send('rhythmResult', judged)
        clicksRef.current.stop?.()
        clicksRef.current = null
        setView((current) => ({ ...current, rhythmTask: null }))
      }
      return
    }
    await send('note', { ...note, name: playedName(string, fret) })
  }

  return (
    <div className="phone-app">
      <header className="phone-top">
        <p className="phone-brand">Jimmy Page</p>
        <p className="phone-status" role="status">
          <span className={`phone-dot ${status.startsWith('Connected') ? 'on' : 'off'}`} aria-hidden="true" />
          {status}
        </p>
        {started ? (
          <button type="button" className="ghost" onClick={() => setView((v) => ({ ...v, showNames: !v.showNames }))}>
            {view.showNames ? 'Hide names' : 'Show names'}
          </button>
        ) : null}
      </header>
      {!started ? (
        <button type="button" className="phone-start" onClick={start}>
          Tap to start
        </button>
      ) : (
        <Guitar
          namesOn={view.showNames}
          onTap={tap}
          targets={view.targets}
          currentIndex={view.currentIndex}
          mode={view.mode}
          chordGlow={view.chordGlow}
          flash={view.flash}
          cursor={view.cursor}
          boxMode={view.boxMode}
          allowBlue={view.allowBlue}
        />
      )}
    </div>
  )
}
