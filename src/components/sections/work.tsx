import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Star } from 'lucide-react'

import { categoryLabels, projects } from '@/content/projects'
import type { Project } from '@/content/types'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { formatRelative } from '@/lib/format'
import { reposByName } from '@/lib/github'
import { FILTERS, useProjectFilter, useSelectedProject } from '@/lib/url-state'
import { GithubIcon } from '@/components/primitives/brand-icons'
import { Reveal } from '@/components/primitives/reveal'
import { Section } from '@/components/primitives/section'
import { ProjectDialog } from './project-dialog'

const AVAILABLE_FILTERS = FILTERS.filter(
  (filter) => filter === 'all' || projects.some((project) => project.category === filter),
)

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const { t, tx, lang } = useI18n()
  const [, setSelected] = useSelectedProject()
  const repo = project.repo ? reposByName.get(project.repo) : undefined

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: duration.base, ease: ease.out }}
      className="border-rule border-b"
    >
      <button
        type="button"
        onClick={() => void setSelected(project.slug)}
        aria-label={`${project.title} — ${tx(project.summary)}`}
        className="group -mx-4 grid w-[calc(100%+2rem)] gap-x-6 gap-y-2 px-4 py-7 text-left transition-colors duration-300 sm:grid-cols-[2.5rem_1fr_auto] sm:py-8"
      >
        <span className="text-index text-muted-foreground group-hover:text-brand hidden pt-1.5 transition-colors duration-300 sm:block">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-heading text-foreground group-hover:text-brand transition-colors duration-300">
              {project.title}
            </h3>
            <span className="text-index text-muted-foreground nums-tabular">
              {project.year}
            </span>
            {repo && repo.stars > 0 && (
              <span className="text-muted-foreground nums-tabular inline-flex items-center gap-1 text-[11px]">
                <Star className="size-3" />
                {repo.stars}
              </span>
            )}
          </div>

          <p className="text-body text-muted-foreground mt-2 max-w-[58ch]">
            {tx(project.summary)}
          </p>

          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((item) => (
              <li
                key={item}
                className="border-border/60 text-muted-foreground rounded border px-2 py-0.5 text-[11px]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-muted-foreground flex items-center gap-3 self-start pt-1.5 text-[11px] sm:flex-col sm:items-end sm:gap-1.5">
          {repo && (
            <span className="nums-tabular whitespace-nowrap">
              {t('work.updated')} {formatRelative(repo.pushedAt, lang)}
            </span>
          )}
          <ArrowUpRight className="text-muted-foreground group-hover:text-brand size-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </button>
    </motion.li>
  )
}

export function Work() {
  const { t, tx } = useI18n()
  const [filter, setFilter] = useProjectFilter()

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <Section id="work" index="03" title={t('work.title')} lead={t('work.lead')}>
      <Reveal className="mb-8 flex flex-wrap items-center gap-1.5">
        {AVAILABLE_FILTERS.map((option) => {
          const isActive = filter === option
          const label = option === 'all' ? t('work.all') : tx(categoryLabels[option])

          return (
            <button
              key={option}
              type="button"
              onClick={() => void setFilter(option)}
              aria-pressed={isActive}
              className={cn(
                'relative rounded-md px-3 py-1.5 text-[12px] transition-colors duration-200',
                isActive
                  ? 'text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-active"
                  className="bg-foreground absolute inset-0 -z-10 rounded-md"
                  transition={spring.layout}
                />
              )}
              {label}
            </button>
          )
        })}
      </Reveal>

      <motion.ul layout className="border-rule border-t">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && (
        <p className="text-muted-foreground py-12 text-center text-[13px]">{t('work.empty')}</p>
      )}

      <Reveal className="mt-10">
        <a
          href="https://github.com/VictorCrepaldiGomes?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-2 text-[12px] transition-colors"
        >
          <GithubIcon className="size-3.5" />
          {t('github.viewProfile')}
          <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </Reveal>

      <ProjectDialog />
    </Section>
  )
}
