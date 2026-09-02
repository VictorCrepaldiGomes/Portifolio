import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { duration, ease, viewport } from '@/lib/motion'
import { formatDate, formatRelative } from '@/lib/format'
import { calendarInsights, expandCalendar, toContributionWeeks, useGitHub } from '@/lib/github'
import { profile } from '@/content/profile'
import { GithubIcon } from '@/components/primitives/brand-icons'
import { Counter } from '@/components/primitives/counter'
import { Reveal, RevealGroup, RevealItem, RuleLine } from '@/components/primitives/reveal'
import { Section } from '@/components/primitives/section'

const LEVEL_CLASS = [
  'bg-muted-foreground/20',
  'bg-brand/25',
  'bg-brand/45',
  'bg-brand/70',
  'bg-brand',
] as const

function ContributionGraph() {
  const { t, lang } = useI18n()
  const { data } = useGitHub()

  const days = useMemo(() => expandCalendar(data.calendar), [data.calendar])
  const weeks = useMemo(() => toContributionWeeks(days), [days])
  const insights = useMemo(() => calendarInsights(days), [days])

  if (weeks.length === 0) return null

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-label text-muted-foreground">{t('github.contributions')}</h3>
        <p className="text-foreground nums-tabular text-[13px]">
          <Counter value={data.calendar.total} />
        </p>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-0.75">
          {weeks.map((week, weekIndex) => (
            <div key={week[0]?.date ?? weekIndex} className="flex flex-col gap-0.75">
              {week.map((day) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewport}
                  transition={{
                    duration: 0.35,
                    ease: ease.out,
                    delay: Math.min(weekIndex * 0.008, 0.5),
                  }}
                  title={`${day.count} ${t('github.contributionOn')} ${formatDate(day.date, lang)}`}
                  className={cn('size-2.5 rounded-[2px]', LEVEL_CLASS[day.level])}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <dl className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px]">
          <div className="flex items-baseline gap-1.5">
            <dt>{t('github.streak')}</dt>
            <dd className="text-foreground nums-tabular">
              {insights.longestStreak} {t('github.days')}
            </dd>
          </div>
          {insights.busiestDay && (
            <div className="flex items-baseline gap-1.5">
              <dt>{t('github.busiest')}</dt>
              <dd className="text-foreground nums-tabular">
                {formatDate(insights.busiestDay.date, lang)} · {insights.busiestDay.count}
              </dd>
            </div>
          )}
        </dl>

        <div className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
          <span>{t('github.less')}</span>
          {LEVEL_CLASS.map((className, level) => (
            <span key={level} className={cn('size-2.5 rounded-[2px]', className)} />
          ))}
          <span>{t('github.more')}</span>
        </div>
      </div>
    </div>
  )
}

function LanguageBar() {
  const { t } = useI18n()
  const { data } = useGitHub()

  const languages = data.languages.slice(0, 6)
  if (languages.length === 0) return null

  const shades = ['bg-brand', 'bg-brand/70', 'bg-brand/50', 'bg-brand/35', 'bg-brand/22', 'bg-brand/14']

  return (
    <div>
      <h3 className="text-label text-muted-foreground mb-4">{t('github.languages')}</h3>

      <div
        role="img"
        aria-label={languages.map((l) => `${l.name} ${l.percent}%`).join(', ')}
        className="bg-muted flex h-1.5 w-full overflow-hidden rounded-full"
      >
        {languages.map((language, index) => (
          <motion.span
            key={language.name}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: 0.9, ease: ease.expo, delay: index * 0.06 }}
            style={{ width: `${language.percent}%` }}
            className={cn('h-full origin-left', shades[index] ?? 'bg-brand/10')}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {languages.map((language, index) => (
          <li key={language.name} className="flex items-center gap-2 text-[12px]">
            <span className={cn('size-2 rounded-full', shades[index] ?? 'bg-brand/10')} />
            <span className="text-foreground">{language.name}</span>
            <span className="text-muted-foreground nums-tabular">{language.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function GitHubActivity() {
  const { t, lang } = useI18n()
  const { data, isLive } = useGitHub()

  const stats = [
    { key: 'repos', label: t('github.repos'), value: data.totals.repos },
    { key: 'stars', label: t('github.stars'), value: data.totals.stars },
    { key: 'followers', label: t('github.followers'), value: data.user?.followers ?? 0 },
  ]

  const recent = data.repos.slice(0, 5)

  return (
    <Section id="github" index="04" title={t('github.title')} lead={t('github.lead')}>
      <RevealGroup stagger={0.06} className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <RevealItem key={stat.key}>
            <p className="text-index text-muted-foreground">{stat.label}</p>
            <p className="text-title text-foreground nums-tabular mt-2">
              <Counter value={stat.value} />
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      <RuleLine className="my-12" />

      <Reveal>
        <ContributionGraph />
      </Reveal>

      <RuleLine className="my-12" />

      <Reveal>
        <LanguageBar />
      </Reveal>

      <RuleLine className="my-12" />

      <Reveal className="mb-5">
        <h3 className="text-label text-muted-foreground">{t('github.recent')}</h3>
      </Reveal>

      <ul className="border-rule border-t">
        {recent.map((repo, index) => (
          <motion.li
            key={repo.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: duration.base, ease: ease.out, delay: index * 0.05 }}
            className="border-rule border-b"
          >
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:bg-muted/25 -mx-4 flex items-center justify-between gap-4 px-4 py-3.5 transition-colors duration-200"
            >
              <span className="min-w-0">
                <span className="text-foreground group-hover:text-brand block truncate text-[13px] transition-colors">
                  {repo.name}
                </span>
                {repo.description && (
                  <span className="text-muted-foreground mt-0.5 block truncate text-[12px]">
                    {repo.description}
                  </span>
                )}
              </span>
              <span className="text-muted-foreground nums-tabular flex shrink-0 items-center gap-3 text-[11px]">
                {repo.language && <span className="hidden sm:inline">{repo.language}</span>}
                <span className="hidden md:inline">{formatRelative(repo.pushedAt, lang)}</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </motion.li>
        ))}
      </ul>

      <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-2 text-[12px] transition-colors"
        >
          <GithubIcon className="size-3.5" />
          {t('github.viewProfile')}
          <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px]">
          <span
            className={cn(
              'size-1.5 rounded-full',
              isLive ? 'bg-brand' : 'bg-muted-foreground/40',
            )}
          />
          {isLive ? t('github.live') : formatRelative(data.generatedAt, lang)}
        </span>
      </Reveal>
    </Section>
  )
}
