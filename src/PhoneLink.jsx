import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import {
  channelName,
  OUT_OF_BOX,
  PHONE_IDLE_MS,
  phoneUrl,
  randomSessionId,
  supabaseConfig,
  validNote,
} from './phoneLink.js'
import { inBox } from './music.js'
import { getSupabase } from './supabaseClient.js'

const PhoneLinkContext = createContext(null)

export function usePhoneLink() {
  return useContext(PhoneLinkContext)
}

export function PhoneLinkProvider({ children }) {
  const enabled = !!supabaseConfig()
  const sessionId = useMemo(() => randomSessionId(), [])
  const [failed, setFailed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [qrSrc, setQrSrc] = useState('')
  const [connected, setConnected] = useState(false)
  const [lastNote, setLastNote] = useState(null)
  const [outOfBox, setOutOfBox] = useState('')
  const tapRef = useRef(null)
  const boxRef = useRef('full')
  const aliveRef = useRef(0)
  const timerRef = useRef(null)

  const visible = enabled && !failed

  const markAlive = useCallback(() => {
    aliveRef.current = Date.now()
    setConnected(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (Date.now() - aliveRef.current >= PHONE_IDLE_MS) setConnected(false)
    }, PHONE_IDLE_MS + 50)
  }, [])

  const registerTap = useCallback((fn) => {
    tapRef.current = fn
    return () => {
      if (tapRef.current === fn) tapRef.current = null
    }
  }, [])

  const setBoxMode = useCallback((mode) => {
    boxRef.current = mode
  }, [])

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
    channel.on('broadcast', { event: 'hello' }, () => {
      markAlive()
    })
    channel.on('broadcast', { event: 'note' }, ({ payload }) => {
      const note = validNote(payload)
      if (!note) return
      markAlive()
      setLastNote(note)
      window.setTimeout(() => {
        setLastNote((current) => (current === note ? null : current))
      }, 320)
      const mode = boxRef.current
      if (mode === 'box' || mode === 'box-blue') {
        if (!inBox(note.string, note.fret, mode === 'box-blue')) {
          setOutOfBox(OUT_OF_BOX)
          return
        }
      }
      setOutOfBox('')
      tapRef.current?.(note.string, note.fret, { fromPhone: true, silent: true })
    })
    channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setFailed(true)
    })
    return () => {
      window.clearTimeout(timerRef.current)
      supabase.removeChannel(channel)
    }
  }, [visible, sessionId, markAlive])

  const value = {
    visible,
    connected,
    lastNote,
    outOfBox,
    registerTap,
    setBoxMode,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    modalOpen,
    qrSrc,
    sessionId,
    link: typeof window !== 'undefined' ? phoneUrl(sessionId) : '',
  }

  return (
    <PhoneLinkContext.Provider value={value}>
      {children}
      {visible && modalOpen ? (
        <div className="phone-modal" role="dialog" aria-labelledby="phone-modal-title">
          <div className="phone-modal-card">
            <h2 id="phone-modal-title">Play on your phone</h2>
            <p className="lesson-evidence">Scan this code. Your phone becomes a guitar and sends taps here live.</p>
            {qrSrc ? <img className="phone-qr" src={qrSrc} alt="QR code to open this course on your phone" /> : <p>Making the code…</p>}
            <p className="hint">{value.link}</p>
            <PhoneStatus />
            <button type="button" className="primary" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </PhoneLinkContext.Provider>
  )
}

export function PlayOnPhoneButton({ className = 'ghost play-phone' }) {
  const phone = usePhoneLink()
  if (!phone?.visible) return null
  return (
    <button type="button" className={className} onClick={phone.openModal}>
      Play on your phone
    </button>
  )
}

export function PhoneStatus({ aboveBoard = false }) {
  const phone = usePhoneLink()
  if (!phone?.visible) return null
  const live = phone.connected
  return (
    <p className={`phone-status ${aboveBoard ? 'phone-live' : ''}`} role="status">
      <span className={`phone-dot ${live ? 'on' : 'off'}`} aria-hidden="true" />
      {live ? 'Playing from your phone' : 'Phone disconnected'}
      {phone.outOfBox ? ` · ${phone.outOfBox}` : ''}
    </p>
  )
}

export function phoneCanClick(interactive, phone) {
  return !!interactive && !phone?.connected
}
