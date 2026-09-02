import { ArrowUpRight, FileText, GraduationCap } from 'lucide-react'

import { getAge, profile, skillGroups } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { Reveal, RevealGroup, RevealItem, RuleLine } from '@/components/primitives/reveal'
import { Section } from '@/components/primitives/section'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function About() {
  const { t, tx } = useI18n()
  const age = String(getAge())

  return (
    <Section id="about" index="01" title={t('about.title')} lead={t('about.lead')}>
      <div className="grid gap-10 lg:grid-cols-[1fr_15rem] lg:gap-16">
        <RevealGroup stagger={0.07} className="max-w-[64ch] space-y-5">
          {tx(profile.bio).map((paragraph, index) => (
            <RevealItem key={`bio-${index}`}>
              <p className="text-body text-muted-foreground">{paragraph.replace('{age}', age)}</p>
            </RevealItem>
          ))}

          <RevealItem className="flex flex-wrap gap-2 pt-3">
            <Button variant="outline" size="sm" asChild className="gap-2 text-[12px]">
              <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                <FileText className="size-3.5" />
                {t('about.resume')}
                <ArrowUpRight className="size-3" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="gap-2 text-[12px]">
              <a href={profile.diploma} target="_blank" rel="noopener noreferrer">
                <GraduationCap className="size-3.5" />
                {t('about.diploma')}
              </a>
            </Button>
          </RevealItem>
        </RevealGroup>

        <Reveal className="order-first space-y-6 lg:order-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="border-border relative size-28 cursor-default overflow-hidden rounded-xl border">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  width={280}
                  height={280}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">{profile.name}</TooltipContent>
          </Tooltip>

          <div className="hidden lg:block">
            <h3 className="text-label text-muted-foreground mb-4">{t('about.focus')}</h3>
            <ul className="space-y-2.5">
              {profile.focus.map((item) => (
                <li key={item.key} className="flex gap-2.5 text-[12px] leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="bg-brand mt-[0.5em] size-1 shrink-0 rounded-full"
                  />
                  <span className="text-muted-foreground">{tx(item.label)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 lg:hidden">
        <RuleLine className="mb-8" />
        <Reveal className="mb-4">
          <h3 className="text-label text-muted-foreground">{t('about.focus')}</h3>
        </Reveal>
        <RevealGroup stagger={0.05} className="grid gap-2.5 sm:grid-cols-2">
          {profile.focus.map((item) => (
            <RevealItem key={item.key} className="flex gap-2.5 text-[12px] leading-relaxed">
              <span aria-hidden="true" className="bg-brand mt-[0.5em] size-1 shrink-0 rounded-full" />
              <span className="text-muted-foreground">{tx(item.label)}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <RuleLine className="my-12" />

      <RevealGroup stagger={0.05} className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {profile.facts.map((fact) => (
          <RevealItem key={fact.key} className="min-w-0">
            <p className="text-index text-muted-foreground">{tx(fact.label)}</p>
            <p className="text-foreground mt-2 text-[13px] leading-snug break-words">
              {tx(fact.value)}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      <RuleLine className="my-12" />

      <Reveal className="mb-7">
        <h3 className="text-label text-muted-foreground">{t('about.stack')}</h3>
      </Reveal>

      <div className="space-y-8">
        {skillGroups.map((group) => (
          <Reveal key={group.id} className="grid gap-3 sm:grid-cols-[7rem_1fr] sm:gap-6">
            <p className="text-index text-muted-foreground pt-1">{tx(group.label)}</p>
            <RevealGroup stagger={0.025} className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <RevealItem key={item}>
                  <span className="border-border/70 text-foreground/85 hover:border-brand hover:text-brand inline-flex rounded-md border px-2.5 py-1 text-[12px] transition-colors duration-200">
                    {item}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
