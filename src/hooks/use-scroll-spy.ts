import { useEffect, useState } from 'react'

export function useScrollSpy(ids: readonly string[], offset = 96) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    let frame = 0

    const measure = () => {
      frame = 0

      const scrolledToEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (scrolledToEnd) {
        setActiveId(elements[elements.length - 1].id)
        return
      }

      const line = offset + window.innerHeight * 0.18

      let best: string | null = null
      let bestDistance = Number.POSITIVE_INFINITY

      for (const el of elements) {
        const { top, bottom } = el.getBoundingClientRect()
        if (top <= line && bottom >= line) {
          best = el.id
          break
        }
        const distance = Math.min(Math.abs(top - line), Math.abs(bottom - line))
        if (distance < bestDistance) {
          bestDistance = distance
          best = el.id
        }
      }

      if (best) setActiveId(best)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return activeId
}
