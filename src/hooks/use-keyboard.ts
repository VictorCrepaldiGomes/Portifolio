import { useEffect } from 'react'

import { useLatestRef } from './use-latest-ref'

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable ||
    target.closest('[cmdk-root]') !== null
  )
}

interface ShortcutOptions {
  allowInInput?: boolean
  enabled?: boolean
}

export function useKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  { allowInInput = false, enabled = true }: ShortcutOptions = {},
) {
  const handlerRef = useLatestRef(handler)

  useEffect(() => {
    if (!enabled) return

    const parts = key.toLowerCase().split('+')
    const needsMod = parts.includes('mod')
    const needsShift = parts.includes('shift')
    const target = parts[parts.length - 1]

    const onKeyDown = (event: KeyboardEvent) => {
      if (!allowInInput && isTypingTarget(event.target)) return

      const mod = event.metaKey || event.ctrlKey
      if (needsMod !== mod) return
      if (needsShift !== event.shiftKey) return
      if (event.key.toLowerCase() !== target) return

      handlerRef.current(event)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, allowInInput, enabled, handlerRef])
}

const KONAMI = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
] as const

export function useKonamiCode(onUnlock: () => void) {
  const onUnlockRef = useLatestRef(onUnlock)

  useEffect(() => {
    let position = 0

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      const key = event.key.toLowerCase()
      if (key === KONAMI[position]) {
        position += 1
        if (position === KONAMI.length) {
          position = 0
          onUnlockRef.current()
        }
      } else {
        position = key === KONAMI[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onUnlockRef])
}

export function useSecretWord(word: string, onMatch: () => void) {
  const onMatchRef = useLatestRef(onMatch)

  useEffect(() => {
    const target = word.toLowerCase()
    let buffer = ''

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      if (event.key.length !== 1) return

      buffer = (buffer + event.key.toLowerCase()).slice(-target.length)
      if (buffer === target) {
        buffer = ''
        onMatchRef.current()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [word, onMatchRef])
}
