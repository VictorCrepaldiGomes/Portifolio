import type { Lang } from '@/content/types'

const LOCALES: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US' }

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

export function formatRelative(iso: string, lang: Lang): string {
  const formatter = new Intl.RelativeTimeFormat(LOCALES[lang], { numeric: 'auto' })
  let delta = (new Date(iso).getTime() - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(delta) < division.amount) {
      return formatter.format(Math.round(delta), division.unit)
    }
    delta /= division.amount
  }
  return formatter.format(Math.round(delta), 'year')
}

export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALES[lang]).format(value)
}
