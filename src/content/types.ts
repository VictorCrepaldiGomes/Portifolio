export const LANGS = ['pt', 'en'] as const

export type Lang = (typeof LANGS)[number]

export type Localized<T = string> = Readonly<Record<Lang, T>>

export const isLang = (value: unknown): value is Lang =>
  typeof value === 'string' && (LANGS as readonly string[]).includes(value)

export type SectionId =
  | 'hero'
  | 'about'
  | 'experience'
  | 'work'
  | 'github'
  | 'contact'

export interface NavItem {
  readonly id: SectionId
  readonly label: Localized
  readonly index: string
}

export interface Profile {
  readonly name: string
  readonly shortName: string
  readonly initials: string
  readonly birthDate: string
  readonly role: Localized
  readonly tagline: Localized
  readonly bio: Localized<readonly string[]>
  readonly location: Localized
  readonly locationUrl: string
  readonly email: string
  readonly phone: {
    readonly display: string
    readonly href: string
  }
  readonly github: string
  readonly linkedin: string
  readonly site: string
  readonly avatar: string
  readonly available: boolean
  readonly resume: string
  readonly diploma: string
  readonly focus: readonly FocusItem[]
  readonly facts: readonly Fact[]
}

export interface FocusItem {
  readonly key: string
  readonly label: Localized
}

export interface Fact {
  readonly key: string
  readonly label: Localized
  readonly value: Localized
}

export type TimelineKind = 'work' | 'education'

export interface TimelineEntry {
  readonly id: string
  readonly kind: TimelineKind
  readonly role: Localized
  readonly organization: string
  readonly period: Localized
  readonly start: string
  readonly current?: boolean
  readonly description: Localized
  readonly stack: readonly string[]
}

export type ProjectCategory = 'web' | 'mobile' | 'api' | 'automation'

export interface Project {
  readonly slug: string
  readonly title: string
  readonly year: string
  readonly category: ProjectCategory
  readonly summary: Localized
  readonly description: Localized
  readonly highlights: Localized<readonly string[]>
  readonly stack: readonly string[]
  readonly repo?: string
  readonly demo?: string
  readonly featured: boolean
}

export interface SkillGroup {
  readonly id: string
  readonly label: Localized
  readonly items: readonly string[]
}

export interface ContactChannel {
  readonly id: string
  readonly label: Localized
  readonly value: string
  readonly hint: Localized
  readonly href: string
  readonly external: boolean
}
