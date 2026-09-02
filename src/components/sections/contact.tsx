import { ArrowUpRight, Check, Copy, Mail, Phone } from 'lucide-react'

import { contactChannels, profile } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { useClipboard } from '@/hooks/use-interactions'
import { GithubIcon, LinkedinIcon } from '@/components/primitives/brand-icons'
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/reveal'
import { Section } from '@/components/primitives/section'
import { Button } from '@/components/ui/button'

type IconComponent = (props: { className?: string }) => React.ReactElement

const ICONS: Record<string, IconComponent> = {
  email: Mail as IconComponent,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  phone: Phone as IconComponent,
}

export function Contact() {
  const { t, tx } = useI18n()
  const { copied, copy } = useClipboard()

  return (
    <Section id="contact" index="05" title={t('contact.title')} lead={t('contact.lead')}>
      <Reveal className="max-w-[58ch]">
        <p className="text-body text-muted-foreground">{t('contact.pitch')}</p>
      </Reveal>

      <Reveal className="mt-10">
        <div className="border-rule flex flex-wrap items-center gap-3 border-y py-6">
          <a
            href={`mailto:${profile.email}`}
            className="text-heading text-foreground hover:text-brand link-underline min-w-0 break-all transition-colors duration-200"
          >
            {profile.email}
          </a>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => void copy(profile.email)}
            aria-label={copied ? t('contact.copied') : t('contact.copy')}
            className="shrink-0"
          >
            {copied ? <Check className="text-brand size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </Reveal>

      <RevealGroup stagger={0.06} className="mt-10 grid gap-px sm:grid-cols-2">
        {contactChannels.map((channel) => {
          const Icon = ICONS[channel.id] ?? Mail

          return (
            <RevealItem key={channel.id}>
              <a
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                className="group border-border/70 hover:border-brand/50 hover:bg-muted/25 flex h-full items-start gap-4 rounded-lg border p-5 transition-colors duration-250"
              >
                <span className="border-border/70 group-hover:border-brand/50 group-hover:text-brand text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors duration-250">
                  <Icon className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-foreground text-[13px] font-medium">
                      {tx(channel.label)}
                    </span>
                    <ArrowUpRight className="text-muted-foreground group-hover:text-brand size-3.5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-muted-foreground mt-0.5 block text-[11px]">
                    {tx(channel.hint)}
                  </span>
                  <span className="text-muted-foreground mt-2 block text-[12px] break-all">
                    {channel.value}
                  </span>
                </span>
              </a>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Reveal className="mt-8">
        <p className="text-muted-foreground text-[11px]">
          {tx(profile.location)} · {t('contact.responseTime')}
        </p>
      </Reveal>
    </Section>
  )
}
