import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'

import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { duration, ease } from '@/lib/motion'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function ThemeToggle({ expanded = false }: { expanded?: boolean }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { t } = useI18n()

  const Icon = resolvedTheme === 'dark' ? Sun : Moon

  const trigger = (
    <Button
      variant="ghost"
      size={expanded ? 'sm' : 'icon-sm'}
      onClick={toggleTheme}
      aria-label={t('a11y.toggleTheme')}
      className={cn(expanded && 'border-border/70 flex-1 border')}
    >
      <span className="relative flex size-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="absolute flex"
          >
            <Icon className="size-4" />
          </motion.span>
        </AnimatePresence>
      </span>
      {expanded && (
        <span className="text-[11px] tracking-wider uppercase">
          {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  )

  if (expanded) return trigger

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="bottom">
        {resolvedTheme === 'dark' ? t('cmd.theme.light') : t('cmd.theme.dark')}
      </TooltipContent>
    </Tooltip>
  )
}
