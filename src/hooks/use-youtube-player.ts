import { useCallback, useEffect, useRef, useState } from 'react'

import { useLatestRef } from './use-latest-ref'

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  stopVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  getDuration: () => number
  getCurrentTime: () => number
  getPlayerState: () => number
  getVideoData: () => { title?: string; video_id?: string }
  loadVideoById: (id: string) => void
  destroy: () => void
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId?: string
      host?: string
      playerVars?: Record<string, string | number>
      events?: {
        onReady?: () => void
        onStateChange?: (event: { data: number }) => void
        onError?: (event: { data: number }) => void
      }
    },
  ) => YTPlayer
  PlayerState: { PLAYING: number; PAUSED: number; BUFFERING: number; ENDED: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YTNamespace> | null = null

function loadApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      if (window.YT) resolve(window.YT)
      else reject(new Error('YouTube API loaded without YT namespace'))
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-youtube-api]')
    if (existing) return

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.dataset.youtubeApi = 'true'
    script.onerror = () => reject(new Error('Failed to load the YouTube API'))
    document.head.appendChild(script)
  })

  return apiPromise
}

const ERRORS: Record<number, string> = {
  2: 'invalid-id',
  5: 'not-playable',
  100: 'not-found',
  101: 'embed-blocked',
  150: 'embed-blocked',
}

export interface YouTubeState {
  ready: boolean
  playing: boolean
  buffering: boolean
  ended: boolean
  duration: number
  currentTime: number
  volume: number
  muted: boolean
  title: string
  isLive: boolean
  error: string | null
}

const INITIAL: YouTubeState = {
  ready: false,
  playing: false,
  buffering: false,
  ended: false,
  duration: 0,
  currentTime: 0,
  volume: 60,
  muted: false,
  title: '',
  isLive: false,
  error: null,
}

export function useYouTubePlayer(videoId: string | null, autoplay = false) {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [state, setState] = useState<YouTubeState>(INITIAL)
  const desiredVolume = useRef(INITIAL.volume)
  const autoplayRef = useLatestRef(autoplay)

  useEffect(() => {
    if (!videoId || !hostRef.current) return
    let cancelled = false

    const mount = async () => {
      try {
        const YT = await loadApi()
        if (cancelled || !hostRef.current) return

        if (playerRef.current) {
          playerRef.current.loadVideoById(videoId)
          setState((s) => ({ ...s, error: null, ended: false, currentTime: 0 }))
          return
        }

        const slot = document.createElement('div')
        hostRef.current.appendChild(slot)

        playerRef.current = new YT.Player(slot, {
          videoId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: () => {
              if (cancelled) return
              playerRef.current?.setVolume(desiredVolume.current)
              const data = playerRef.current?.getVideoData()
              const duration = playerRef.current?.getDuration() ?? 0
              setState((s) => ({
                ...s,
                ready: true,
                title: data?.title ?? '',
                duration,
                isLive: duration === 0,
                error: null,
              }))
              if (autoplayRef.current) playerRef.current?.playVideo()
            },
            onStateChange: (event) => {
              if (cancelled) return
              const duration = playerRef.current?.getDuration() ?? 0
              const data = playerRef.current?.getVideoData()
              setState((s) => ({
                ...s,
                playing: event.data === YT.PlayerState.PLAYING,
                buffering: event.data === YT.PlayerState.BUFFERING,
                ended: event.data === YT.PlayerState.ENDED,
                duration,
                isLive: duration === 0,
                title: data?.title || s.title,
              }))
            },
            onError: (event) => {
              if (cancelled) return
              setState((s) => ({
                ...s,
                ready: true,
                playing: false,
                error: ERRORS[event.data] ?? 'unknown',
              }))
            },
          },
        })
      } catch {
        if (!cancelled) setState((s) => ({ ...s, error: 'api' }))
      }
    }

    void mount()

    return () => {
      cancelled = true
    }
  }, [videoId, autoplayRef])

  useEffect(() => {
    if (!videoId) {
      playerRef.current?.destroy()
      playerRef.current = null
      if (hostRef.current) hostRef.current.innerHTML = ''
      setState({ ...INITIAL, volume: desiredVolume.current })
    }
  }, [videoId])

  useEffect(() => {
    if (!state.ready || !state.playing) return
    const id = setInterval(() => {
      const player = playerRef.current
      if (!player) return
      setState((s) => ({
        ...s,
        currentTime: player.getCurrentTime(),
        duration: player.getDuration(),
      }))
    }, 500)
    return () => clearInterval(id)
  }, [state.ready, state.playing])

  const play = useCallback(() => {
    playerRef.current?.playVideo()
  }, [])

  const toggle = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (state.playing) player.pauseVideo()
    else player.playVideo()
  }, [state.playing])

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true)
    setState((s) => ({ ...s, currentTime: seconds }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    desiredVolume.current = volume
    playerRef.current?.setVolume(volume)
    if (volume > 0) playerRef.current?.unMute()
    setState((s) => ({ ...s, volume, muted: volume === 0 }))
  }, [])

  const toggleMute = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (player.isMuted()) {
      player.unMute()
      player.setVolume(desiredVolume.current || 60)
      setState((s) => ({ ...s, muted: false, volume: desiredVolume.current || 60 }))
    } else {
      player.mute()
      setState((s) => ({ ...s, muted: true }))
    }
  }, [])

  return { hostRef, state, play, toggle, seek, setVolume, toggleMute }
}
