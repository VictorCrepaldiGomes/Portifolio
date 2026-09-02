import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { useKeyboardShortcut } from '@/hooks/use-keyboard'

interface CommandPaletteValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  hasOpened: boolean
}

const CommandPaletteContext = createContext<CommandPaletteValue | null>(null)

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpenState] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next)
    if (next) setHasOpened(true)
  }, [])

  const toggle = useCallback(() => setOpen(!open), [open, setOpen])

  useKeyboardShortcut('mod+k', (event) => {
    event.preventDefault()
    toggle()
  })

  const value = useMemo<CommandPaletteValue>(
    () => ({ open, setOpen, toggle, hasOpened }),
    [open, setOpen, toggle, hasOpened],
  )

  return <CommandPaletteContext value={value}>{children}</CommandPaletteContext>
}

export function useCommandPalette(): CommandPaletteValue {
  const ctx = useContext(CommandPaletteContext)
  if (!ctx) throw new Error('useCommandPalette must be used within <CommandPaletteProvider>')
  return ctx
}
