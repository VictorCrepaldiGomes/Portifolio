import { useCallback, useEffect, useRef, useState } from 'react'

import { useI18n } from '@/lib/i18n'
import { useLatestRef } from '@/hooks/use-latest-ref'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const GRID = 19
const START_SPEED_MS = 140
const MIN_SPEED_MS = 70
const BEST_KEY = 'vc.snake.best'

type Point = { x: number; y: number }
type Direction = 'up' | 'down' | 'left' | 'right'
type Phase = 'idle' | 'running' | 'paused' | 'over'

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

const KEY_MAP: Record<string, Direction> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
}

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

function initialSnake(): Point[] {
  const middle = Math.floor(GRID / 2)
  return [
    { x: middle, y: middle },
    { x: middle - 1, y: middle },
    { x: middle - 2, y: middle },
  ]
}

function randomFreeCell(occupied: Point[]): Point {
  const free: Point[] = []
  for (let x = 0; x < GRID; x += 1) {
    for (let y = 0; y < GRID; y += 1) {
      if (!occupied.some((cell) => cell.x === x && cell.y === y)) free.push({ x, y })
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 }
}

export function SnakeGame({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY) ?? 0)
    } catch {
      return 0
    }
  })

  const snakeRef = useRef<Point[]>(initialSnake())
  const foodRef = useRef<Point>(randomFreeCell(initialSnake()))
  const directionRef = useRef<Direction>('right')
  const queueRef = useRef<Direction[]>([])
  const phaseRef = useLatestRef(phase)

  const reset = useCallback(() => {
    snakeRef.current = initialSnake()
    foodRef.current = randomFreeCell(snakeRef.current)
    directionRef.current = 'right'
    queueRef.current = []
    setScore(0)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = canvas.clientWidth
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr
      canvas.height = size * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cell = size / GRID
    const foreground = token('--foreground') || '#0a0a0a'
    const brand = token('--brand') || '#2563eb'
    const rule = token('--rule') || 'rgba(0,0,0,.08)'

    ctx.clearRect(0, 0, size, size)

    ctx.strokeStyle = rule
    ctx.lineWidth = 1
    for (let i = 1; i < GRID; i += 1) {
      ctx.beginPath()
      ctx.moveTo(Math.round(i * cell) + 0.5, 0)
      ctx.lineTo(Math.round(i * cell) + 0.5, size)
      ctx.moveTo(0, Math.round(i * cell) + 0.5)
      ctx.lineTo(size, Math.round(i * cell) + 0.5)
      ctx.stroke()
    }

    const food = foodRef.current
    ctx.fillStyle = brand
    ctx.beginPath()
    ctx.roundRect(food.x * cell + cell * 0.22, food.y * cell + cell * 0.22, cell * 0.56, cell * 0.56, cell * 0.28)
    ctx.fill()

    const snake = snakeRef.current
    snake.forEach((segment, index) => {
      const fade = 1 - (index / Math.max(snake.length, 1)) * 0.55
      ctx.globalAlpha = index === 0 ? 1 : fade
      ctx.fillStyle = foreground
      ctx.beginPath()
      ctx.roundRect(
        segment.x * cell + cell * 0.1,
        segment.y * cell + cell * 0.1,
        cell * 0.8,
        cell * 0.8,
        cell * 0.22,
      )
      ctx.fill()
    })
    ctx.globalAlpha = 1
  }, [])

  useEffect(() => {
    if (!open) return

    let frame = 0
    let last = performance.now()
    let accumulator = 0

    const step = () => {
      const snake = snakeRef.current
      const queued = queueRef.current.shift()
      if (queued && queued !== OPPOSITE[directionRef.current]) {
        directionRef.current = queued
      }

      const vector = VECTORS[directionRef.current]
      const head = { x: snake[0].x + vector.x, y: snake[0].y + vector.y }

      const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID
      const hitSelf = snake.some((cell, index) => index > 0 && cell.x === head.x && cell.y === head.y)

      if (hitWall || hitSelf) {
        setPhase('over')
        setScore((current) => {
          setBest((currentBest) => {
            const next = Math.max(currentBest, current)
            try {
              localStorage.setItem(BEST_KEY, String(next))
            } catch {}
            return next
          })
          return current
        })
        return
      }

      snake.unshift(head)

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        foodRef.current = randomFreeCell(snake)
        setScore((current) => current + 1)
      } else {
        snake.pop()
      }
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const delta = now - last
      last = now

      if (phaseRef.current === 'running') {
        accumulator += delta
        const interval = Math.max(
          MIN_SPEED_MS,
          START_SPEED_MS - (snakeRef.current.length - 3) * 2.5,
        )
        while (accumulator >= interval) {
          accumulator -= interval
          step()
          if (phaseRef.current !== 'running') break
        }
      } else {
        accumulator = 0
      }

      draw()
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [open, draw, phaseRef])

  const start = useCallback(() => {
    reset()
    setPhase('running')
  }, [reset])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (key === ' ' || key === 'spacebar') {
        event.preventDefault()
        setPhase((current) => {
          if (current === 'running') return 'paused'
          if (current === 'paused') return 'running'
          return current
        })
        if (phaseRef.current === 'idle' || phaseRef.current === 'over') start()
        return
      }

      const direction = KEY_MAP[key]
      if (!direction) return
      event.preventDefault()

      if (phaseRef.current === 'idle') start()
      if (queueRef.current.length < 2) queueRef.current.push(direction)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, start, phaseRef])

  useEffect(() => {
    const onBlur = () => setPhase((current) => (current === 'running' ? 'paused' : current))
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onBlur)
    return () => {
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onBlur)
    }
  }, [])

  const touchStart = useRef<Point | null>(null)

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    const origin = touchStart.current
    if (!origin) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - origin.x
    const dy = touch.clientY - origin.y
    touchStart.current = null

    if (Math.hypot(dx, dy) < 24) return
    const direction: Direction =
      Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'

    if (phaseRef.current === 'idle' || phaseRef.current === 'over') start()
    if (queueRef.current.length < 2) queueRef.current.push(direction)
  }

  const overlay =
    phase === 'idle'
      ? t('egg.snake.start')
      : phase === 'paused'
        ? t('egg.snake.paused')
        : phase === 'over'
          ? t('egg.snake.over')
          : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-heading">{t('egg.snake.title')}</DialogTitle>
          <DialogDescription className="text-[12px]">
            {t('egg.snake.found')} {t('egg.snake.controls')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between text-[12px]">
          <span className="text-muted-foreground">
            {t('egg.snake.score')}{' '}
            <span className="text-foreground nums-tabular font-medium">{score}</span>
          </span>
          <span className="text-muted-foreground">
            {t('egg.snake.best')}{' '}
            <span className="text-foreground nums-tabular font-medium">{best}</span>
          </span>
        </div>

        <div
          className="border-border relative aspect-square w-full overflow-hidden rounded-lg border"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <canvas ref={canvasRef} className="block size-full touch-none" />

          {overlay && (
            <div className="bg-background/60 absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
              <p className={cn('text-label', phase === 'over' ? 'text-brand' : 'text-muted-foreground')}>
                {overlay}
              </p>
              {(phase === 'idle' || phase === 'over') && (
                <Button size="sm" onClick={start} className="text-[12px]">
                  {phase === 'over' ? t('egg.snake.again') : t('egg.snake.title')}
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-center text-[11px]">
          {t('egg.snake.controls')}
        </p>
      </DialogContent>
    </Dialog>
  )
}
