import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn('overflow-visible', className)}
    >
      <path
        d="M4 9.5 L9.4 22.5 L14.8 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M27.2 12.6 a6.4 6.4 0 0 0 -5.2 -2.8 a6.4 6.4 0 0 0 0 12.8 a6.4 6.4 0 0 0 5.2 -2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="square"
      />
      <circle cx="30" cy="5" r="2" className="fill-brand" />
    </svg>
  )
}
