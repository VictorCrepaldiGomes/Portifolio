import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Menu, X } from 'lucide-react'

import { navigation, profile } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { duration, ease, spring, staggerItem, staggerVariants } from '@/lib/motion'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollToSection } from '@/hooks/use-interactions'
import { Logo } from '@/components/primitives/logo'
import { Container } from '@/components/primitives/section'
import { LangToggle } from '@/components/layout/lang-toggle'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { CommandTrigger } from '@/components/command/command-trigger'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const SECTION_IDS = navigation.map((item) => item.id)

export function SiteHeader() {
  const { t, tx } = useI18n()
  const activeId = useScrollSpy(SECTION_IDS)
  const scrollToSection = useScrollToSection()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 })

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 12))

  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('resize', close)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('resize', close)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    requestAnimationFrame(() => scrollToSection(id))
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-(--header-h)',
          'transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled || menuOpen
            ? 'bg-background/80 border-b backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <Container className="flex h-full items-center justify-between gap-4">
          <a
            href="#hero"
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
              history.replaceState(null, '', window.location.pathname + window.location.search)
            }}
            aria-label={t('a11y.home')}
            className="group flex shrink-0 items-center gap-2.5 rounded-sm"
          >
            <span className="border-foreground/25 group-hover:border-brand group-hover:text-brand text-foreground flex size-7 items-center justify-center border transition-colors duration-200">
              <Logo className="size-4" />
            </span>
            <span className="hidden text-[13px] font-medium tracking-tight whitespace-nowrap sm:inline">
              {profile.shortName}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="border-border/70 text-muted-foreground nums-tabular hidden rounded border px-1.5 py-0.5 text-[10px] leading-none lg:inline-block">
                  v{__APP_VERSION__}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t('footer.version')}</TooltipContent>
            </Tooltip>
          </a>

          <nav aria-label={t('a11y.mainNav')} className="hidden min-w-0 md:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = activeId === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={(event) => {
                        event.preventDefault()
                        go(item.id)
                      }}
                      className={cn(
                        'relative flex items-center gap-1.5 px-3 py-2 text-[13px] transition-colors duration-200',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <span className="text-index text-muted-foreground nums-tabular">
                        {item.index}
                      </span>
                      <span>{tx(item.label)}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="bg-brand absolute inset-x-2 -bottom-px h-px"
                          transition={spring.layout}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <CommandTrigger />
            <LangToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: duration.fast, ease: ease.out }}
                  className="flex"
                >
                  {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </Container>

        <motion.div
          style={{ scaleX: progress }}
          className="bg-brand absolute inset-x-0 bottom-0 h-px origin-left"
          aria-hidden="true"
        />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="bg-background/95 fixed inset-0 z-40 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              aria-label={t('a11y.mainNav')}
              initial="hidden"
              animate="show"
              variants={staggerVariants(0.05, 0.08)}
              className="flex h-full flex-col justify-between px-5 pt-(--header-h) pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <ul className="mt-10 flex flex-col">
                {navigation.map((item) => (
                  <motion.li key={item.id} variants={staggerItem}>
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => {
                        event.preventDefault()
                        go(item.id)
                      }}
                      className="group border-border/60 flex items-baseline gap-4 border-b py-5"
                    >
                      <span className="text-index text-brand nums-tabular">{item.index}</span>
                      <span className="text-title group-active:text-brand transition-colors">
                        {tx(item.label)}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={staggerItem} className="space-y-4">
                <p className="text-micro text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-2">
                  <LangToggle expanded />
                  <ThemeToggle expanded />
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
