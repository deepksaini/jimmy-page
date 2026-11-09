import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { channelName, PHONE_IDLE_MS, phoneUrl, randomSessionId, supabaseConfig, validNote } from './phoneLink.js'
import { getSupabase } from './supabaseClient.js'
import { playedName } from './course/match.js'

const GuitarContext = createContext(null)

export function useGuitarLink() {
  return useContext(GuitarContext)
}

const emptyView = {
  targets: [],
  mode: 'sequence',
  showNames: true,
  currentIndex: 0,
  chordGlow: [],
  rhythmTask: null,
  flash: null,
  cursor: null,
  boxMode: false,
  allowBlue: false,
}

export function GuitarLinkProvider({ children }) {
  const enabled = !!supabaseConfig()
  const sessionId = useMemo(() => randomSessionId(), [])
  const [failed, setFailed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [qrSrc, setQrSrc] = useState('')
  const [connected, setConnected] = useState(false)
  const [view, setView] = useState(emptyView)
  const tapRef = useRef(null)
  const aliveRef = useRef(0)
  const timerRef = useRef(null)
  const channelRef = useRef(null)
  const visible = enabled && !failed

  const markAlive = useCallback(() => {
    aliveRef.current = Date.now()
    setConnected(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (Date.now() - aliveRef.current >= PHONE_IDLE_MS) setConnected(false)
    }, PHONE_IDLE_MS + 50)
  }, [])

  const send = useCallback(async (event, payload) => {
    await channelRef.current?.send({ type: 'broadcast', event, payload })
  }, [])

  const registerTap = useCallback((fn) => {
    tapRef.current = fn
    return () => {
      if (tapRef.current === fn) tapRef.current = null
    }
  }, [])

  const setTargets = useCallback(
    (payload) => {
      setView((current) => {
        const next = {
          targets: payload.positions || [],
          mode: payload.mode || 'sequence',
          showNames: payload.showNames !== false,
          currentIndex: 0,
          chordGlow: [],
          rhythmTask: null,
          flash: null,
          boxMode: current.boxMode,
          allowBlue: current.allowBlue,
        }
        return { ...current, ...next }
      })
      send('targets', payload)
    },
    [send],
  )

  const clearBoard = useCallback(() => {
    setView((current) => ({ ...emptyView, showNames: current.showNames, cursor: null }))
    send('clear', {})
  }, [send])

  const sendResult = useCallback(
    (payload) => {
      setView((current) => ({
        ...current,
        flash: payload,
        cursor: payload,
        currentIndex: payload.ok && current.mode === 'sequence' ? current.currentIndex + 1 : current.currentIndex,
      }))
      window.setTimeout(() => {
        setView((current) => ({ ...current, flash: current.flash === payload ? null : current.flash }))
      }, 700)
      send('result', payload)
    },
    [send],
  )

  const setChordGlow = useCallback(
    (positions) => {
      setView((current) => ({ ...current, chordGlow: positions || [] }))
      send('chordGlow', { positions })
    },
    [send],
  )

  const setRhythmTask = useCallback(
    (task) => {
      setView((current) => ({ ...current, rhythmTask: task }))
      send('rhythmTask', task)
    },
    [send],
  )

  const setBoxView = useCallback(
    (payload) => {
      const boxMode = !!payload?.boxMode
      const allowBlue = !!payload?.allowBlue
      setView((current) => ({ ...current, boxMode, allowBlue }))
      send('boxView', { boxMode, allowBlue })
    },
    [send],
  )

  const setCursor = useCallback(
    (note) => {
      setView((current) => ({ ...current, cursor: note }))
      send('cursor', note)
    },
    [send],
  )

  const handleNote = useCallback(
    (string, fret, meta = {}) => {
      const note = validNote({ string, fret, time: meta.time || Date.now() })
      if (!note) return
      setView((current) => ({ ...current, cursor: note }))
      tapRef.current?.(note.string, note.fret, { ...meta, name: playedName(note.string, note.fret) })
    },
    [],
  )

  useEffect(() => {
    if (!visible || !modalOpen || qrSrc) return undefined
    let cancelled = false
    QRCode.toDataURL(phoneUrl(sessionId), { width: 280, margin: 1 })
      .then((url) => {
        if (!cancelled) setQrSrc(url)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [visible, modalOpen, qrSrc, sessionId])

  useEffect(() => {
    if (!visible) return undefined
    const supabase = getSupabase()
    if (!supabase) {
      setFailed(true)
      return undefined
    }
    const channel = supabase.channel(channelName(sessionId), {
      config: { broadcast: { self: false } },
    })
    channel.on('broadcast', { event: 'hello' }, () => markAlive())
    channel.on('broadcast', { event: 'note' }, ({ payload }) => {
      const note = validNote(payload)
      if (!note) return
      markAlive()
      handleNote(note.string, note.fret, { fromPhone: true, silent: true, time: note.time })
    })
    channel.on('broadcast', { event: 'rhythmResult' }, ({ payload }) => {
      markAlive()
      tapRef.current?.(null, null, { rhythmResult: payload })
    })
    channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setFailed(true)
    })
    channelRef.current = channel
    return () => {
      window.clearTimeout(timerRef.current)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [visible, sessionId, markAlive, handleNote])

  const value = {
    visible,
    connected,
    view,
    setView,
    setTargets,
    clearBoard,
    sendResult,
    setChordGlow,
    setRhythmTask,
    setBoxView,
    setCursor,
    registerTap,
    handleNote,
    send,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    modalOpen,
    qrSrc,
    sessionId,
    link: typeof window !== 'undefined' ? phoneUrl(sessionId) : '',
  }

  return (
    <GuitarContext.Provider value={value}>
      {children}
      {visible && modalOpen ? (
        <div className="phone-modal" role="dialog" aria-labelledby="phone-modal-title">
          <div className="phone-modal-card">
            <h2 id="phone-modal-title">Play on your phone</h2>
            <p className="lesson-evidence">Scan this code. Your phone becomes the guitar and stays in sync with this screen.</p>
            {qrSrc ? <img className="phone-qr" src={qrSrc} alt="QR code to open this course on your phone" /> : <p>Making the code…</p>}
            <p className="hint">{value.link}</p>
            <button type="button" className="primary" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </GuitarContext.Provider>
  )
}

export function PlayOnPhoneButton({ className = 'ghost play-phone' }) {
  const link = useGuitarLink()
  if (!link?.visible) return null
  return (
    <button type="button" className={className} onClick={link.openModal}>
      Play on your phone
    </button>
  )
}

export function PhoneStatus({ aboveBoard = false }) {
  const link = useGuitarLink()
  if (!link?.visible) return null
  return (
    <p className={`phone-status ${aboveBoard ? 'phone-live' : ''}`} role="status">
      <span className={`phone-dot ${link.connected ? 'on' : 'off'}`} aria-hidden="true" />
      {link.connected ? 'Playing from your phone' : 'Phone disconnected'}
    </p>
  )
}
