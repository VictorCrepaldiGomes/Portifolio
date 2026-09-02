import { ArrowUp, ArrowUpRight, Heart, Mail } from 'lucide-react'

import { contactChannels, navigation, profile } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { useLocalTime } from '@/hooks/use-clock'
import { useScrollToSection } from '@/hooks/use-interactions'
import { useEggs } from '@/components/easter-eggs/egg-context'
import { GithubIcon, LinkedinIcon } from '@/components/primitives/brand-icons'
import { Logo } from '@/components/primitives/logo'
import { Container } from '@/components/primitives/section'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const YEAR = new Date().getFullYear()

const ICON_CLASS =
  'text-muted-foreground hover:text-foreground hover:bg-muted/60 group flex size-9 items-center justify-center rounded-md transition-colors'

export function SiteFooter() {
  const { t, tx, lang } = useI18n()
  const { setNoteOpen } = useEggs()
  const scrollToSection = useScrollToSection()
  const time = useLocalTime('America/Sao_Paulo', lang === 'pt' ? 'pt-BR' : 'en-GB')

  return (
    <footer className="border-rule border-t">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div className="max-w-xs space-y-5">
            <a
              href="#hero"
              onClick={(event) => {
                event.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="group flex w-fit items-center gap-2.5"
            >
              <span className="border-foreground/25 group-hover:border-brand group-hover:text-brand text-foreground flex size-7 items-center justify-center border transition-colors duration-200">
                <Logo className="size-4" />
              </span>
              <span className="text-[13px] font-medium tracking-tight">{profile.name}</span>
            </a>

            <p className="text-muted-foreground text-[12px] leading-relaxed">
              {tx(profile.tagline)}
            </p>

            <p className="text-muted-foreground flex items-center gap-2 text-[11px]">
              <span className="relative flex size-1.5">
                <span className="bg-brand pulse-ring absolute inline-flex size-full rounded-full" />
                <span className="bg-brand relative inline-flex size-1.5 rounded-full" />
              </span>
              {profile.available ? t('status.available') : t('status.unavailable')}
            </p>
          </div>

          <nav aria-label={t('footer.navigate')}>
            <h2 className="text-index text-muted-foreground mb-5">{t('footer.navigate')}</h2>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => {
                      event.preventDefault()
                      if (item.id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' })
                      else scrollToSection(item.id)
                    }}
                    className="text-muted-foreground hover:text-foreground inline-flex items-baseline gap-2 text-[12px] transition-colors"
                  >
                    <span className="text-index text-muted-foreground">{item.index}</span>
                    {tx(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-index text-muted-foreground mb-5">{t('contact.title')}</h2>
            <ul className="space-y-2.5">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    target={channel.external ? '_blank' : undefined}
                    rel={channel.external ? 'noopener noreferrer' : undefined}
                    className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[12px] transition-colors"
                  >
                    {tx(channel.label)}
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-rule mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
            <span>
              © {YEAR} {profile.name}
            </span>
            <span className="bg-rule hidden h-3 w-px sm:block" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="nums-tabular cursor-default">{time} BRT</span>
              </TooltipTrigger>
              <TooltipContent side="top">{t('footer.myTime')}</TooltipContent>
            </Tooltip>
            <span className="bg-rule hidden h-3 w-px sm:block" />
            <span className="hidden lg:inline">
              {t('footer.built')} React · Vite · Tailwind · Motion
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="border-border/70 text-foreground nums-tabular cursor-default rounded border px-1.5 py-0.5 text-[10px] leading-none">
                  v{__APP_VERSION__}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">{t('footer.version')}</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setNoteOpen(true)}
              aria-label="♥"
              className="text-muted-foreground hover:text-brand group flex size-9 items-center justify-center rounded-md transition-colors"
            >
              <Heart className="size-3.5 transition-transform duration-300 group-hover:scale-125" />
            </button>

            <Tooltip>
              <TooltipTrigger asChild>
                <a href={`mailto:${profile.email}`} aria-label="E-mail" className={ICON_CLASS}>
                  <Mail className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">{profile.email}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={ICON_CLASS}
                >
                  <GithubIcon className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">GitHub</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={ICON_CLASS}
                >
                  <LinkedinIcon className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">LinkedIn</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  aria-label={t('footer.backToTop')}
                  className={ICON_CLASS}
                >
                  <ArrowUp className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{t('footer.backToTop')}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Container>
    </footer>
  )
}
