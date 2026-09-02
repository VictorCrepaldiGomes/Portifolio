import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue)
}

export const useIsMobile = () => !useMediaQuery('(min-width: 768px)')

export const useIsCoarsePointer = () => useMediaQuery('(pointer: coarse)', true)

export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')
