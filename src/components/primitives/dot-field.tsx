import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/use-media-query'

const SPACING = 26
const INFLUENCE = 150
const MAX_SHIFT = 9

function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function DotField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let visible = true
    let time = 0

    const pointer = { x: -9999, y: -9999, active: false }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const base = readToken('--muted-foreground') || '#888'
      const brand = readToken('--brand') || '#2563eb'

      ctx.clearRect(0, 0, width, height)

      const columns = Math.ceil(width / SPACING) + 1
      const rows = Math.ceil(height / SPACING) + 1

      for (let col = 0; col < columns; col += 1) {
        for (let row = 0; row < rows; row += 1) {
          const originX = col * SPACING
          const originY = row * SPACING

          let x = originX
          let y = originY
          let radius = 1.1
          let intensity = 0

          if (pointer.active) {
            const dx = pointer.x - originX
            const dy = pointer.y - originY
            const distance = Math.hypot(dx, dy)

            if (distance < INFLUENCE) {
              const falloff = 1 - distance / INFLUENCE
              const eased = falloff * falloff
              intensity = eased
              const shift = eased * MAX_SHIFT
              const angle = Math.atan2(dy, dx)
              x += Math.cos(angle) * shift
              y += Math.sin(angle) * shift
              radius = 1.1 + eased * 1.9
            }
          }

          const wave =
            (Math.sin(originX * 0.012 + time) + Math.cos(originY * 0.014 - time * 0.7)) * 0.5
          const ambient = 0.12 + Math.max(0, wave) * 0.1

          ctx.globalAlpha = ambient + intensity * 0.6
          ctx.fillStyle = intensity > 0.25 ? brand : base
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
    }

    const tick = () => {
      frame = requestAnimationFrame(tick)
      if (!visible) return
      if (!reduced) time += 0.006
      draw()
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active =
        event.pointerType !== 'touch' &&
        pointer.x > -INFLUENCE &&
        pointer.y > -INFLUENCE &&
        pointer.x < width + INFLUENCE &&
        pointer.y < height + INFLUENCE
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 },
    )
    observer.observe(parent)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    resize()
    draw()

    if (reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerleave', onPointerLeave)
      return () => {
        observer.disconnect()
        resizeObserver.disconnect()
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none block size-full', className)}
    />
  )
}
