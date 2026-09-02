import { useId } from 'react'
import { motion } from 'motion/react'

import { LANGS } from '@/content/types'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function LangToggle({ expanded = false }: { expanded?: boolean }) {
  const { lang, setLang, t } = useI18n()
  const layoutId = useId()

  return (
    <div
      role="group"
      aria-label={t('a11y.toggleLang')}
      className={cn(
        'border-border/70 relative flex items-center rounded-md border p-0.5',
        expanded && 'flex-1',
      )}
    >
      {LANGS.map((code) => {
        const isActive = lang === code
        return (
          <Tooltip key={code}>
            <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={isActive}
            className={cn(
              'relative z-10 rounded-[5px] px-2 py-1 text-[11px] font-medium tracking-wider uppercase transition-colors duration-200',
              expanded && 'flex-1',
              isActive ? 'text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`lang-active-${layoutId}`}
                className="bg-foreground absolute inset-0 -z-10 rounded-[5px]"
                transition={spring.layout}
              />
            )}
            {code}
          </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {code === 'pt' ? t('cmd.lang.pt') : t('cmd.lang.en')}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
