import { useEffect } from 'react'

import { profile, skillGroups } from '@/content/profile'
import { ui } from '@/content/ui'
import type { Lang } from '@/content/types'
import { useI18n } from './i18n'

const SITE = profile.site

function setMeta(selector: string, attribute: 'content' | 'href', value: string) {
  const element = document.head.querySelector(selector)
  if (element) element.setAttribute(attribute, value)
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let element = document.head.querySelector<HTMLLinkElement>(selector)

  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    if (hreflang) element.hreflang = hreflang
    document.head.appendChild(element)
  }
  element.href = href
}

const urlFor = (lang: Lang) => (lang === 'pt' ? `${SITE}/` : `${SITE}/?lang=en`)

function personSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.shortName,
    url: SITE,
    image: profile.avatar,
    email: `mailto:${profile.email}`,
    telephone: profile.phone.display,
    jobTitle: profile.role[lang],
    description: ui['meta.description'][lang],
    worksFor: {
      '@type': 'Organization',
      name: 'AsA Sistemas de Computação',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'FUNDEC',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dracena',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    knowsLanguage: ['pt-BR', 'en'],
    knowsAbout: skillGroups.flatMap((group) => group.items),
    sameAs: [profile.github, profile.linkedin],
  }
}

function websiteSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ui['meta.title'][lang],
    url: SITE,
    inLanguage: lang === 'pt' ? 'pt-BR' : 'en',
    author: { '@type': 'Person', name: profile.name },
  }
}

export function useSeo() {
  const { lang } = useI18n()

  useEffect(() => {
    const title = ui['meta.title'][lang]
    const description = ui['meta.description'][lang]
    const url = urlFor(lang)
    const locale = lang === 'pt' ? 'pt_BR' : 'en_US'
    const alternateLocale = lang === 'pt' ? 'en_US' : 'pt_BR'

    document.title = title

    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:locale"]', 'content', locale)
    setMeta('meta[property="og:locale:alternate"]', 'content', alternateLocale)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)

    upsertLink('canonical', url)
    upsertLink('alternate', urlFor('pt'), 'pt-BR')
    upsertLink('alternate', urlFor('en'), 'en')
    upsertLink('alternate', urlFor('pt'), 'x-default')

    let script = document.getElementById('ld-json')
    if (!script) {
      script = document.createElement('script')
      script.id = 'ld-json'
      script.setAttribute('type', 'application/ld+json')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify([personSchema(lang), websiteSchema(lang)])
  }, [lang])
}
