import { ArrowUpRight, GitFork, Star } from 'lucide-react'

import { categoryLabels, projects } from '@/content/projects'
import { useI18n } from '@/lib/i18n'
import { formatRelative } from '@/lib/format'
import { reposByName } from '@/lib/github'
import { useSelectedProject } from '@/lib/url-state'
import { GithubIcon } from '@/components/primitives/brand-icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ProjectDialog() {
  const { t, tx, lang } = useI18n()
  const [slug, setSlug] = useSelectedProject()

  const project = projects.find((candidate) => candidate.slug === slug)
  const repo = project?.repo ? reposByName.get(project.repo) : undefined

  return (
    <Dialog
      open={Boolean(project)}
      onOpenChange={(open) => {
        if (!open) void setSlug(null)
      }}
    >
      <DialogContent className="max-h-[88svh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        {project && (
          <>
            <DialogHeader className="space-y-0 px-6 pt-6 text-left sm:px-8 sm:pt-8">
              <div className="text-index text-muted-foreground flex items-center gap-3">
                <span className="nums-tabular">{project.year}</span>
                <span className="bg-rule h-px w-6" />
                <span>{tx(categoryLabels[project.category])}</span>
              </div>

              <DialogTitle className="text-title mt-4">{project.title}</DialogTitle>

              <DialogDescription className="text-body text-muted-foreground mt-4">
                {tx(project.description)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 px-6 py-8 sm:px-8">
              <div>
                <h4 className="text-label text-muted-foreground mb-4">{t('work.highlights')}</h4>
                <ul className="space-y-2.5">
                  {tx(project.highlights).map((highlight, index) => (
                    <li
                      key={`${project.slug}-highlight-${index}`}
                      className="flex gap-3 text-[13px] leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-brand mt-[0.55em] size-1 shrink-0 rounded-full"
                      />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-label text-muted-foreground mb-4">Stack</h4>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      className="border-border/70 text-foreground/85 rounded-md border px-2.5 py-1 text-[12px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {repo && (
                <dl className="border-rule text-muted-foreground grid grid-cols-2 gap-4 border-t pt-6 text-[12px] sm:grid-cols-4">
                  <div>
                    <dt className="text-index text-muted-foreground">{t('github.stars')}</dt>
                    <dd className="nums-tabular text-foreground mt-1.5 flex items-center gap-1.5">
                      <Star className="size-3.5" />
                      {repo.stars}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-index text-muted-foreground">Forks</dt>
                    <dd className="nums-tabular text-foreground mt-1.5 flex items-center gap-1.5">
                      <GitFork className="size-3.5" />
                      {repo.forks}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-index text-muted-foreground">
                      {t('github.languages')}
                    </dt>
                    <dd className="text-foreground mt-1.5">{repo.language ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-index text-muted-foreground">{t('work.updated')}</dt>
                    <dd className="text-foreground nums-tabular mt-1.5">
                      {formatRelative(repo.pushedAt, lang)}
                    </dd>
                  </div>
                </dl>
              )}

              <div className="flex flex-wrap gap-2">
                {project.repo && (
                  <Button size="sm" asChild className="gap-2 text-[12px]">
                    <a
                      href={`https://github.com/VictorCrepaldiGomes/${project.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="size-3.5" />
                      {t('work.repo')}
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button size="sm" variant="outline" asChild className="gap-2 text-[12px]">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      {t('work.demo')}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
