import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'motion/react'

import { spring } from '@/lib/motion'
import { useIsCoarsePointer, usePrefersReducedMotion } from './use-media-query'

interface MagneticResult {
  ref: React.RefObject<HTMLElement | null>
  x: MotionValue<number>
  y: MotionValue<number>
}

export function useMagnetic(strength = 0.28, radius = 90): MagneticResult {
  const ref = useRef<HTMLElement | null>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, spring.magnetic)
  const y = useSpring(rawY, spring.magnetic)

  const isCoarse = useIsCoarsePointer()
  const reduced = usePrefersReducedMotion()
  const disabled = isCoarse || reduced

  useEffect(() => {
    if (disabled) {
      rawX.set(0)
      rawY.set(0)
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const centreX = rect.left + rect.width / 2
      const centreY = rect.top + rect.height / 2
      const dx = event.clientX - centreX
      const dy = event.clientY - centreY

      if (Math.hypot(dx, dy) > radius + Math.max(rect.width, rect.height) / 2) {
        rawX.set(0)
        rawY.set(0)
        return
      }

      rawX.set(dx * strength)
      rawY.set(dy * strength)
    }

    const onPointerLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [disabled, radius, strength, rawX, rawY])

  return { ref, x, y }
}

export function useClipboard(resetAfter = 1800) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), resetAfter)
        return true
      } catch {
        return false
      }
    },
    [resetAfter],
  )

  return { copied, copy }
}

export function useScrollToSection() {
  const reduced = usePrefersReducedMotion()

  return useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (!el) return

      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '64',
      )
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      const offset = headerHeight < 10 ? headerHeight * rootFontSize : headerHeight

      const top = el.getBoundingClientRect().top + window.scrollY - offset - 24

      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })

      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
      el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true })

      if (history.replaceState) history.replaceState(null, '', `#${id}`)
    },
    [reduced],
  )
}
