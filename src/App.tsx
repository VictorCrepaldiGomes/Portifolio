import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig } from 'motion/react'

import { useI18n } from '@/lib/i18n'
import { useSeo } from '@/lib/seo'
import { printConsoleArt } from '@/lib/console-art'
import { useKonamiCode, useSecretWord } from '@/hooks/use-keyboard'
import { useCommandPalette } from '@/components/command/command-context'
import { useEggs } from '@/components/easter-eggs/egg-context'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { MusicDock } from '@/components/music/music-dock'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { Work } from '@/components/sections/work'
import { GitHubActivity } from '@/components/sections/github'
import { Contact } from '@/components/sections/contact'

const CommandPalette = lazy(() =>
  import('@/components/command/command-palette').then((m) => ({ default: m.CommandPalette })),
)
const SnakeGame = lazy(() =>
  import('@/components/easter-eggs/snake').then((m) => ({ default: m.SnakeGame })),
)
const LoveNote = lazy(() =>
  import('@/components/easter-eggs/love-note').then((m) => ({ default: m.LoveNote })),
)

export default function App() {
  const { t } = useI18n()
  const { hasOpened: paletteMounted } = useCommandPalette()
  const { snakeOpen, setSnakeOpen, noteOpen, setNoteOpen } = useEggs()
  useSeo()

  useKonamiCode(() => setSnakeOpen(true))
  useSecretWord('maria', () => setNoteOpen(true))

  useEffect(printConsoleArt, [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#about"
        className="focus:bg-background focus:text-foreground focus:ring-brand sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2"
      >
        {t('a11y.skip')}
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Work />
        <GitHubActivity />
        <Contact />
      </main>

      <SiteFooter />
      <MusicDock />

      <Suspense fallback={null}>
        {paletteMounted && <CommandPalette />}
        {snakeOpen && <SnakeGame open={snakeOpen} onOpenChange={setSnakeOpen} />}
        {noteOpen && <LoveNote open={noteOpen} onOpenChange={setNoteOpen} />}
      </Suspense>
    </MotionConfig>
  )
}
