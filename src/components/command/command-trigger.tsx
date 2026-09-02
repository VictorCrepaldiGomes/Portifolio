import { useState } from 'react'
import { Search } from 'lucide-react'

import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCommandPalette } from './command-context'

function useModKeyLabel() {
  const [label] = useState(() =>
    /mac|iphone|ipad|ipod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl',
  )
  return label
}

export function CommandTrigger() {
  const { setOpen } = useCommandPalette()
  const { t } = useI18n()
  const mod = useModKeyLabel()

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="sm:hidden"
        aria-label={t('a11y.openCommand')}
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t('a11y.openCommand')}
            className="border-border/70 text-muted-foreground hover:text-foreground hover:border-border group hidden h-8 items-center gap-2 rounded-md border pr-1.5 pl-2.5 text-[12px] transition-colors duration-200 sm:flex"
          >
            <Search className="size-3.5" />
            <kbd className="border-border/70 bg-muted/60 rounded border px-1.5 py-0.5 font-sans text-[10px] leading-none font-medium">
              {mod}K
            </kbd>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t('a11y.openCommand')}</TooltipContent>
      </Tooltip>
    </>
  )
}
