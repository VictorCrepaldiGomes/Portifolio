import { cn } from '@/lib/utils'
import { Reveal, RuleLine } from './reveal'

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12', className)}>
      {children}
    </div>
  )
}

interface SectionProps {
  id: string
  index: string
  title: string
  lead?: string
  className?: string
  children: React.ReactNode
}

export function Section({ id, index, title, lead, className, children }: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('scroll-mt-24 py-20 sm:py-24 lg:py-28', className)}
    >
      <Container>
        <div className="grid gap-y-10 lg:grid-cols-[10rem_1fr] lg:gap-x-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-4">
              <span className="text-index text-brand nums-tabular">{index}</span>
              <h2 id={headingId} className="text-label text-muted-foreground">
                {title}
              </h2>
            </Reveal>
            <RuleLine className="mt-5 hidden lg:block" />
          </div>

          <div className="min-w-0">
            {lead && (
              <Reveal>
                <p className="text-lead text-foreground max-w-[26ch] text-balance sm:max-w-[36ch]">
                  {lead}
                </p>
              </Reveal>
            )}
            <div className={cn(lead && 'mt-12 sm:mt-16')}>{children}</div>
          </div>
        </div>
      </Container>
    </section>
  )
}
