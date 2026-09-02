import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  ChevronDown,
  Music,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { useYouTubePlayer } from '@/hooks/use-youtube-player'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  formatTime,
  parseYouTubeId,
  STATIONS,
  thumbnailFor,
  useMusic,
} from './music-context'

function Equalizer({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className={cn(
            'bg-brand w-[2px] rounded-full',
            active ? 'equalizer-bar' : 'h-[3px] opacity-50',
          )}
          style={active ? { animationDelay: `${bar * 0.16}s` } : undefined}
        />
      ))}
    </span>
  )
}

export function MusicDock() {
  const { t } = useI18n()
  const { open, setOpen, videoId, autoplay, play, stop } = useMusic()
  const { hostRef, state, toggle, seek, setVolume, toggleMute } = useYouTubePlayer(
    videoId,
    autoplay,
  )

  const [input, setInput] = useState('')
  const [invalid, setInvalid] = useState(false)

  const station = STATIONS.find((item) => item.id === videoId)
  const label = state.title || station?.label || ''
  const hasTrack = Boolean(videoId)
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const id = parseYouTubeId(input)
    if (!id) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    setInput('')
    play(id)
  }

  return (
    <>
      <div
        ref={hostRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 size-px overflow-hidden opacity-0"
      />

      <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6">
        <AnimatePresence>
          {open && (
            <motion.section
              aria-label={t('music.title')}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={spring.snappy}
              className="bg-popover/95 border-border w-[min(23rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl"
            >
              <header className="border-rule flex items-center justify-between border-b px-4 py-3">
                <span className="text-label text-muted-foreground flex items-center gap-2">
                  <Equalizer active={state.playing} />
                  {t('music.title')}
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setOpen(false)}
                  aria-label={t('music.minimize')}
                >
                  <ChevronDown className="size-4" />
                </Button>
              </header>

              <div className="space-y-5 p-4">
                {hasTrack && (
                  <div className="space-y-3.5">
                    <div className="flex gap-3.5">
                      <div className="border-border relative size-16 shrink-0 overflow-hidden rounded-lg border">
                        <img
                          src={thumbnailFor(videoId as string)}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                        {state.playing && (
                          <span className="absolute inset-0 flex items-end justify-end p-1.5">
                            <Equalizer active />
                          </span>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                        <p className="text-foreground line-clamp-2 text-[13px] leading-snug">
                          {state.error ? t('music.unavailable') : label || '…'}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          {state.error
                            ? t('music.tryAnother')
                            : state.isLive
                              ? t('music.liveStream')
                              : state.buffering
                                ? t('music.loading')
                                : station?.label}
                        </p>
                      </div>
                    </div>

                    {!state.error && !state.isLive && state.duration > 0 && (
                      <div className="space-y-1.5">
                        <label className="sr-only" htmlFor="music-seek">
                          {t('music.seek')}
                        </label>
                        <input
                          id="music-seek"
                          type="range"
                          min={0}
                          max={Math.floor(state.duration)}
                          value={Math.floor(state.currentTime)}
                          onChange={(event) => seek(Number(event.target.value))}
                          className="range-track w-full"
                          style={{ ['--range-progress' as string]: `${progress}%` }}
                        />
                        <div className="text-muted-foreground nums-tabular flex justify-between text-[10px]">
                          <span>{formatTime(state.currentTime)}</span>
                          <span>{formatTime(state.duration)}</span>
                        </div>
                      </div>
                    )}

                    {!state.error && (
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon-sm"
                          onClick={toggle}
                          disabled={!state.ready}
                          aria-label={state.playing ? t('music.pause') : t('music.play')}
                          className="rounded-full"
                        >
                          {state.playing ? (
                            <Pause className="size-3.5 fill-current" />
                          ) : (
                            <Play className="size-3.5 fill-current" />
                          )}
                        </Button>

                        <button
                          type="button"
                          onClick={toggleMute}
                          aria-label={state.muted ? t('music.unmute') : t('music.mute')}
                          className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        >
                          {state.muted || state.volume === 0 ? (
                            <VolumeX className="size-4" />
                          ) : (
                            <Volume2 className="size-4" />
                          )}
                        </button>

                        <label className="sr-only" htmlFor="music-volume">
                          {t('music.volume')}
                        </label>
                        <input
                          id="music-volume"
                          type="range"
                          min={0}
                          max={100}
                          value={state.muted ? 0 : state.volume}
                          onChange={(event) => setVolume(Number(event.target.value))}
                          className="range-track flex-1"
                          style={{
                            ['--range-progress' as string]: `${state.muted ? 0 : state.volume}%`,
                          }}
                        />

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={stop}
                          aria-label={t('music.stop')}
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {!hasTrack && (
                  <p className="text-muted-foreground text-[12px] leading-relaxed">
                    {t('music.lead')}
                  </p>
                )}

                <form onSubmit={submit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(event) => {
                        setInput(event.target.value)
                        setInvalid(false)
                      }}
                      placeholder={t('music.placeholder')}
                      aria-label={t('music.placeholder')}
                      aria-invalid={invalid}
                      className={cn(
                        'border-border bg-background/60 placeholder:text-muted-foreground/80 h-9 min-w-0 flex-1 rounded-lg border px-3 text-[12px] outline-none transition-colors',
                        'focus-visible:border-brand',
                        invalid && 'border-destructive',
                      )}
                    />
                    <Button type="submit" size="icon-sm" aria-label={t('music.play')}>
                      <Play className="size-3.5" />
                    </Button>
                  </div>
                  {invalid && <p className="text-destructive text-[11px]">{t('music.invalid')}</p>}
                </form>

                <div className="space-y-2">
                  <p className="text-index text-muted-foreground">{t('music.stations')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => play(item.id)}
                        className={cn(
                          'rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors duration-200',
                          item.id === videoId
                            ? 'border-brand text-brand'
                            : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40',
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-rule space-y-1.5 border-t pt-3">
                  <a
                    href="https://www.youtube.com/results?search_query=lofi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-brand group inline-flex items-center gap-1.5 text-[11px] transition-colors"
                  >
                    {t('music.searchOn')}
                    <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    {t('music.searchHint')}
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout" initial={false}>
          {open ? null : hasTrack ? (
            <motion.div
              key="pill"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={spring.snappy}
              className="border-border bg-background/85 flex items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-3 shadow-lg backdrop-blur-xl"
            >
              <Equalizer active={state.playing} />

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-foreground max-w-[10rem] truncate text-[11px]"
                aria-label={t('music.open')}
              >
                {state.error ? t('music.unavailable') : label || t('music.title')}
              </button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    onClick={toggle}
                    disabled={!state.ready || Boolean(state.error)}
                    aria-label={state.playing ? t('music.pause') : t('music.play')}
                    className="size-7 rounded-full"
                  >
                    {state.playing ? (
                      <Pause className="size-3 fill-current" />
                    ) : (
                      <Play className="size-3 fill-current" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {state.playing ? t('music.pause') : t('music.play')}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  key="toggle"
                  type="button"
                  layout
                  onClick={() => setOpen(true)}
                  aria-expanded={false}
                  aria-label={t('music.open')}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: duration.fast, ease: ease.out }}
                  className="border-border bg-background/85 text-muted-foreground hover:text-foreground flex size-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-colors"
                >
                  <Music className="size-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left">{t('music.title')}</TooltipContent>
            </Tooltip>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
