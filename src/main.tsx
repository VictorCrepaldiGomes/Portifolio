import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { NuqsAdapter } from 'nuqs/adapters/react'

import App from './App'
import { I18nProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/hooks/use-theme'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CommandPaletteProvider } from '@/components/command/command-context'
import { EggProvider } from '@/components/easter-eggs/egg-context'
import { MusicProvider } from '@/components/music/music-context'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

createRoot(container).render(
  <StrictMode>
    <NuqsAdapter>
      <Suspense fallback={null}>
        <ThemeProvider>
          <I18nProvider>
            <TooltipProvider delayDuration={280} skipDelayDuration={120}>
              <CommandPaletteProvider>
                <MusicProvider>
                  <EggProvider>
                    <App />
                  </EggProvider>
                </MusicProvider>
              </CommandPaletteProvider>
            </TooltipProvider>
          </I18nProvider>
        </ThemeProvider>
      </Suspense>
    </NuqsAdapter>
  </StrictMode>,
)
