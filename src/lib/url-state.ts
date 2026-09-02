import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'

import { projectCategories } from '@/content/projects'

const FILTERS = ['all', ...projectCategories] as const

export type ProjectFilter = (typeof FILTERS)[number]

export function useProjectFilter() {
  return useQueryState(
    'filter',
    parseAsStringLiteral(FILTERS).withDefault('all').withOptions({
      clearOnDefault: true,
      history: 'replace',
      shallow: true,
    }),
  )
}

export function useSelectedProject() {
  return useQueryState(
    'project',
    parseAsString.withOptions({
      clearOnDefault: true,
      history: 'push',
      shallow: true,
    }),
  )
}

export { FILTERS }
