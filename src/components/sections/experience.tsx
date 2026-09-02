import { GraduationCap } from 'lucide-react'

import { timeline } from '@/content/experience'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/primitives/reveal'
import { Section } from '@/components/primitives/section'

export function Experience() {
  const { t, tx } = useI18n()

  return (
    <Section id="experience" index="02" title={t('experience.title')} lead={t('experience.lead')}>
      <ol className="border-rule border-t">
        {timeline.map((entry) => {
          const isEducation = entry.kind === 'education'

          return (
            <li key={entry.id}>
              <Reveal>
                <article
                  className={cn(
                    'group border-rule grid gap-x-6 gap-y-3 border-b py-7 sm:grid-cols-[9.5rem_1fr] sm:py-8',
                    'hover:bg-muted/25 -mx-4 px-4 transition-colors duration-300',
                  )}
                >
                  <div className="flex items-center gap-2.5 sm:flex-col sm:items-start sm:gap-2">
                    <span
                      className={cn(
                        'text-index nums-tabular transition-colors duration-300',
                        entry.current
                          ? 'text-brand'
                          : 'text-muted-foreground group-hover:text-foreground/70',
                      )}
                    >
                      {tx(entry.period)}
                    </span>
                    {entry.current && (
                      <span className="border-brand/40 text-brand rounded-full border px-1.5 py-px text-[10px] tracking-wider uppercase">
                        {t('experience.current')}
                      </span>
                    )}
                    {isEducation && (
                      <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px] tracking-wider uppercase">
                        <GraduationCap className="size-3" />
                        {t('experience.education')}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-heading text-foreground">{tx(entry.role)}</h3>
                    <p className="text-muted-foreground mt-1 text-[13px]">{entry.organization}</p>
                    <p className="text-body text-muted-foreground mt-3 max-w-[62ch]">
                      {tx(entry.description)}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {entry.stack.map((item) => (
                        <li
                          key={item}
                          className="border-border/60 text-muted-foreground rounded border px-2 py-0.5 text-[11px]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
