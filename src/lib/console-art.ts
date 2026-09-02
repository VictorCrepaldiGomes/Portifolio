import { profile } from '@/content/profile'

export function printConsoleArt() {
  if (import.meta.env.DEV) return

  const heading = [
    'color: #2563eb',
    'font-weight: 700',
    'font-size: 13px',
    'font-family: "JetBrains Mono", monospace',
  ].join(';')

  const body = [
    'color: #737373',
    'font-size: 12px',
    'line-height: 1.7',
    'font-family: "JetBrains Mono", monospace',
  ].join(';')

  const link = ['color: #2563eb', 'font-size: 12px', 'font-family: "JetBrains Mono", monospace'].join(';')

  console.log(
    `%c
 ┌──────────────────────────────────────┐
 │  VICTOR CREPALDI GOMES               │
 │  Full Stack Developer                │
 └──────────────────────────────────────┘
`,
    heading,
  )

  console.log(
    `%cYou are reading the console of a portfolio. Respect.

  · Ctrl/⌘ + K opens the command palette
  · The Konami code still works: ↑ ↑ ↓ ↓ ← → ← → B A
  · Type a certain name and something personal opens

Built with React 19, Vite, Tailwind v4 and Motion.
Set entirely in JetBrains Mono, on purpose.`,
    body,
  )

  console.log(`%c${profile.github}`, link)
}
