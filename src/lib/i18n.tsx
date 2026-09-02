import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

import { LANGS, type Lang } from '@/content/types'
import { ui, type UiKey } from '@/content/ui'

const STORAGE_KEY = 'vc.lang'

const langParser = parseAsStringLiteral(LANGS).withDefault('pt').withOptions({
  clearOnDefault: true,
  history: 'replace',
})

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: UiKey) => string
  tx: <V extends Readonly<Record<Lang, unknown>>>(value: V) => V[Lang]
}

const I18nContext = createContext<I18nValue | null>(null)

function readStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'pt' || stored === 'en' ? stored : null
  } catch {
    return null
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setQueryLang] = useQueryState('lang', langParser)

  const setLang = useCallback(
    (next: Lang) => {
      void setQueryLang(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {}
    },
    [setQueryLang],
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('lang')) return

    const stored = readStoredLang()
    const preferred = stored ?? (navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en')
    if (preferred !== 'pt') void setQueryLang(preferred)
  }, [setQueryLang])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === 'pt' ? 'en' : 'pt'),
      t: (key) => ui[key][lang],
      tx: (localized) => localized[lang],
    }),
    [lang, setLang],
  )

  return <I18nContext value={value}>{children}</I18nContext>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>')
  return ctx
}
