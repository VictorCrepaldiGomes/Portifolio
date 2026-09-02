import { createContext, useContext, useMemo, useState } from 'react'

interface EggValue {
  snakeOpen: boolean
  setSnakeOpen: (open: boolean) => void
  noteOpen: boolean
  setNoteOpen: (open: boolean) => void
}

const EggContext = createContext<EggValue | null>(null)

export function EggProvider({ children }: { children: React.ReactNode }) {
  const [snakeOpen, setSnakeOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

  const value = useMemo<EggValue>(
    () => ({ snakeOpen, setSnakeOpen, noteOpen, setNoteOpen }),
    [snakeOpen, noteOpen],
  )

  return <EggContext value={value}>{children}</EggContext>
}

export function useEggs(): EggValue {
  const ctx = useContext(EggContext)
  if (!ctx) throw new Error('useEggs must be used within <EggProvider>')
  return ctx
}
