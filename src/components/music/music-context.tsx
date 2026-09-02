import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export interface Station {
  id: string
  label: string
}

export const STATIONS: readonly Station[] = [
  { id: 'lTRiuFIWV54', label: 'lofi 1 a.m.' },
  { id: 'TURbeWK2wwg', label: 'lofi 4 a.m.' },
  { id: 'n61ULEU7CO0', label: 'best of lofi' },
  { id: '4xDzrJKXOOY', label: 'synthwave' },
]

const STORAGE_KEY = 'vc.music.video'

interface MusicValue {
  open: boolean
  setOpen: (open: boolean) => void
  videoId: string | null
  autoplay: boolean
  play: (id: string) => void
  stop: () => void
}

const MusicContext = createContext<MusicValue | null>(null)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [autoplay, setAutoplay] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  const play = useCallback((id: string) => {
    setAutoplay(true)
    setVideoId(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {}
  }, [])

  const stop = useCallback(() => {
    setVideoId(null)
    setAutoplay(false)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const value = useMemo<MusicValue>(
    () => ({ open, setOpen, videoId, autoplay, play, stop }),
    [open, videoId, autoplay, play, stop],
  )

  return <MusicContext value={value}>{children}</MusicContext>
}

export function useMusic(): MusicValue {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within <MusicProvider>')
  return ctx
}

const ID_PATTERN = /^[\w-]{11}$/

export function parseYouTubeId(input: string): string | null {
  const value = input.trim()
  if (!value) return null
  if (ID_PATTERN.test(value)) return value

  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1)
      return ID_PATTERN.test(id) ? id : null
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const param = url.searchParams.get('v')
      if (param && ID_PATTERN.test(param)) return param

      const match = url.pathname.match(/\/(embed|live|shorts|v)\/([\w-]{11})/)
      if (match) return match[2]
    }
  } catch {
    return null
  }

  return null
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`
}

export const thumbnailFor = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
