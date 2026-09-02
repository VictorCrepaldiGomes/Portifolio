import { cn } from '@/lib/utils'

export function Marquee({
  items,
  speed = 42,
  className,
}: {
  items: readonly string[]
  speed?: number
  className?: string
}) {
  const track = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className={cn(
        'group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
    >
      <div
        className="marquee-track flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="text-muted-foreground flex shrink-0 items-center gap-10 text-[12px] tracking-wide whitespace-nowrap"
          >
            {item}
            <span className="bg-brand/50 size-1 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  )
}
