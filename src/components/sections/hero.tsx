import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { getAge, profile, skillGroups } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { useGitHub } from '@/lib/github'
import { cn } from '@/lib/utils'
import { duration, ease, staggerItem, staggerVariants } from '@/lib/motion'
import { useLocalTime } from '@/hooks/use-clock'
import { useScrollToSection } from '@/hooks/use-interactions'
import { Container } from '@/components/primitives/section'
import { Counter } from '@/components/primitives/counter'
import { DotField } from '@/components/primitives/dot-field'
import { Marquee } from '@/components/primitives/marquee'
import { Button } from '@/components/ui/button'

const NAME_LINES = ['Victor', 'Crepaldi', 'Gomes'] as const

const STACK_TICKER = skillGroups.flatMap((group) => group.items)

function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative flex size-1.5', className)}>
      <span className="bg-brand pulse-ring absolute inline-flex size-full rounded-full" />
      <span className="bg-brand relative inline-flex size-1.5 rounded-full" />
    </span>
  )
}

function SystemPanel() {
  const { t, tx, lang } = useI18n()
  const time = useLocalTime('America/Sao_Paulo', lang === 'pt' ? 'pt-BR' : 'en-GB')

  const rows = [
    { key: 'local', label: 'LOCAL', value: tx(profile.location) },
    { key: 'time', label: 'TIME', value: `${time} BRT` },
    { key: 'work', label: 'WORK', value: 'AsA Sistemas de Computação' },
    { key: 'stack', label: 'STACK', value: 'React · TypeScript · Node' },
    { key: 'build', label: 'BUILD', value: `v${__APP_VERSION__}` },
  ]

  return (
    <dl className="divide-rule divide-y">
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-[3.75rem_1fr] gap-3 py-2.5">
          <dt className="text-index text-muted-foreground pt-0.5">{row.label}</dt>
          <dd className="text-foreground/90 nums-tabular text-[12px] leading-relaxed">
            {row.value}
          </dd>
        </div>
      ))}
      <div className="grid grid-cols-[3.75rem_1fr] gap-3 py-2.5">
        <dt className="text-index text-muted-foreground pt-0.5">STATUS</dt>
        <dd className="text-foreground/90 flex items-start gap-2 text-[12px] leading-relaxed">
          <StatusDot className="mt-1.5 shrink-0" />
          <span>{profile.available ? t('status.available') : t('status.unavailable')}</span>
        </dd>
      </div>
    </dl>
  )
}

function Stats() {
  const { t } = useI18n()
  const { data } = useGitHub()

  const since = data.user ? new Date(data.user.createdAt).getFullYear() : 2022

  const stats = [
    { key: 'age', label: t('hero.stat.age'), value: getAge(), animated: true },
    { key: 'repos', label: t('hero.stat.repos'), value: data.totals.repos, animated: true },
    { key: 'commits', label: t('hero.stat.commits'), value: data.calendar.total, animated: true },
    { key: 'since', label: t('hero.stat.since'), value: since, animated: false },
  ]

  return (
    <dl className="border-rule grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.key}>
          <dt className="text-index text-muted-foreground">{stat.label}</dt>
          <dd className="text-foreground nums-tabular mt-1.5 text-2xl font-semibold tracking-tight">
            {stat.animated ? <Counter value={stat.value} /> : stat.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function Hero() {
  const { t, tx } = useI18n()
  const scrollToSection = useScrollToSection()
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll()
  const backdropY = useTransform(scrollYProgress, [0, 0.25], [0, reduced ? 0 : 90])
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])

  return (
    <section
      id="hero"
      aria-label={profile.name}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-(--header-h) pb-28"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: backdropY, opacity: backdropOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_65%_at_40%_40%,black,transparent)]">
          <DotField />
        </div>
        <div className="noise-layer absolute inset-0 mix-blend-overlay" />
      </motion.div>

      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerVariants(0.06, 0.05)}
          className="grid gap-x-16 gap-y-12 lg:grid-cols-[1fr_17rem] lg:items-end"
        >
          <div className="min-w-0">
            <motion.div variants={staggerItem} className="flex items-center gap-2.5">
              <StatusDot />
              <span className="text-label text-muted-foreground">
                {profile.available ? t('status.available') : t('status.unavailable')}
              </span>
            </motion.div>

            <h1 className="text-display mt-6 sm:mt-8">
              <span className="sr-only">
                {profile.name} — {tx(profile.role)}
              </span>
              {NAME_LINES.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    aria-hidden="true"
                    variants={{
                      hidden: { y: '108%' },
                      show: {
                        y: '0%',
                        transition: { duration: 0.8, ease: ease.expo, delay: index * 0.06 },
                      },
                    }}
                    className={index === 0 ? 'block' : 'text-muted-foreground block'}
                  >
                    {line}
                    {index === NAME_LINES.length - 1 && <span className="text-brand">.</span>}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.9, ease: ease.expo } },
              }}
              className="bg-rule mt-7 h-px w-full max-w-40 origin-left sm:max-w-56"
            />

            <motion.div variants={staggerItem} className="mt-6 space-y-3">
              <p className="text-label text-muted-foreground">{tx(profile.role)}</p>
              <p className="text-body text-muted-foreground max-w-[46ch] text-pretty">
                {tx(profile.tagline)}
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => scrollToSection('work')}
                className="group h-11 gap-2 rounded-md px-5 text-[13px]"
              >
                {t('hero.cta.work')}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="h-11 rounded-md px-5 text-[13px]"
              >
                {t('hero.cta.contact')}
              </Button>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-10">
              <Stats />
            </motion.div>
          </div>

          <motion.div variants={staggerItem} className="border-rule hidden border-t pt-4 lg:block">
            <SystemPanel />
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: duration.slow }}
        className="border-rule absolute inset-x-0 bottom-0 border-t py-3"
      >
        <Marquee items={STACK_TICKER} />
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToSection('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: duration.slow }}
        className="text-muted-foreground hover:text-foreground group absolute inset-x-0 bottom-16 mx-auto hidden w-fit items-center gap-2 rounded-md px-3 py-2 transition-colors sm:flex"
      >
        <span className="text-label">{t('hero.scroll')}</span>
        <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
      </motion.button>
    </section>
  )
}
