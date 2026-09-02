import { useEffect, useState } from 'react'

import snapshot from '@/content/github.generated.json'
import { githubUser } from '@/content/profile'

export interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  avatarUrl: string
  htmlUrl: string
  followers: number
  following: number
  publicRepos: number
  createdAt: string
}

export interface GitHubRepo {
  name: string
  description: string | null
  htmlUrl: string
  homepage: string | null
  language: string | null
  topics: string[]
  stars: number
  forks: number
  size: number
  archived: boolean
  createdAt: string
  pushedAt: string
}

export interface GitHubLanguage {
  name: string
  bytes: number
  percent: number
}

export interface ContributionDay {
  date: string
  count: number
}

export interface ContributionCalendar {
  total: number
  start: string | null
  counts: number[]
  source: 'graphql' | 'proxy' | 'none'
}

export interface GitHubSnapshot {
  generatedAt: string
  user: GitHubUser | null
  repos: GitHubRepo[]
  languages: GitHubLanguage[]
  calendar: ContributionCalendar
  totals: { stars: number; forks: number; repos: number }
}

const DAY_MS = 86_400_000

export function expandCalendar(calendar: ContributionCalendar): ContributionDay[] {
  if (!calendar.start || calendar.counts.length === 0) return []

  const start = Date.parse(`${calendar.start}T00:00:00Z`)
  return calendar.counts.map((count, index) => ({
    date: new Date(start + index * DAY_MS).toISOString().slice(0, 10),
    count,
  }))
}

export const githubSnapshot = snapshot as GitHubSnapshot

export const reposByName = new Map(githubSnapshot.repos.map((repo) => [repo.name, repo]))

export interface ContributionCell extends ContributionDay {
  level: number
}

export function toContributionWeeks(days: ContributionDay[]): ContributionCell[][] {
  if (days.length === 0) return []

  const max = Math.max(...days.map((day) => day.count), 1)
  const level = (count: number) => {
    if (count === 0) return 0
    return Math.min(4, Math.ceil((count / max) * 4))
  }

  const first = new Date(`${days[0].date}T00:00:00Z`)
  const padding = first.getUTCDay()
  const cells: (ContributionCell | null)[] = [
    ...Array.from({ length: padding }, () => null),
    ...days.map((day) => ({ ...day, level: level(day.count) })),
  ]

  const weeks: ContributionCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7).filter((cell): cell is ContributionCell => cell !== null))
  }
  return weeks
}

export interface CalendarInsights {
  longestStreak: number
  busiestDay: ContributionDay | null
  activeDays: number
}

export function calendarInsights(days: ContributionDay[]): CalendarInsights {
  let longestStreak = 0
  let current = 0
  let busiestDay: ContributionDay | null = null
  let activeDays = 0

  for (const day of days) {
    if (day.count > 0) {
      current += 1
      activeDays += 1
      if (current > longestStreak) longestStreak = current
      if (!busiestDay || day.count > busiestDay.count) busiestDay = day
    } else {
      current = 0
    }
  }

  return { longestStreak, busiestDay, activeDays }
}

const CACHE_KEY = 'vc.github.revalidated'
const TTL_MS = 60 * 60 * 1000

interface CachedRevalidation {
  at: number
  user: Pick<GitHubUser, 'followers' | 'publicRepos'>
  repos: Pick<GitHubRepo, 'name' | 'stars' | 'forks' | 'pushedAt'>[]
}

interface ApiUser {
  followers: number
  public_repos: number
}

interface ApiRepo {
  name: string
  stargazers_count: number
  forks_count: number
  pushed_at: string
}

function readCache(): CachedRevalidation | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedRevalidation
    return Date.now() - parsed.at < TTL_MS ? parsed : null
  } catch {
    return null
  }
}

function applyRevalidation(base: GitHubSnapshot, fresh: CachedRevalidation): GitHubSnapshot {
  const freshByName = new Map(fresh.repos.map((repo) => [repo.name, repo]))
  const repos = base.repos.map((repo) => {
    const update = freshByName.get(repo.name)
    return update ? { ...repo, ...update } : repo
  })

  return {
    ...base,
    user: base.user ? { ...base.user, ...fresh.user } : base.user,
    repos,
    totals: {
      ...base.totals,
      stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
      forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
    },
  }
}

export function useGitHub(): { data: GitHubSnapshot; isLive: boolean } {
  const [seed] = useState(() => {
    const cached = readCache()
    return cached
      ? { data: applyRevalidation(githubSnapshot, cached), live: true }
      : { data: githubSnapshot, live: false }
  })

  const [data, setData] = useState<GitHubSnapshot>(seed.data)
  const [isLive, setIsLive] = useState(seed.live)

  useEffect(() => {
    if (seed.live) return

    const controller = new AbortController()

    const revalidate = async () => {
      try {
        const headers = { Accept: 'application/vnd.github+json' }
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUser}`, {
            headers,
            signal: controller.signal,
          }),
          fetch(
            `https://api.github.com/users/${githubUser}/repos?per_page=100&sort=pushed&direction=desc`,
            { headers, signal: controller.signal },
          ),
        ])

        if (!userResponse.ok || !reposResponse.ok) return

        const user = (await userResponse.json()) as ApiUser
        const repos = (await reposResponse.json()) as ApiRepo[]
        if (!Array.isArray(repos)) return

        const fresh: CachedRevalidation = {
          at: Date.now(),
          user: { followers: user.followers, publicRepos: user.public_repos },
          repos: repos.map((repo) => ({
            name: repo.name,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            pushedAt: repo.pushed_at,
          })),
        }

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(fresh))
        } catch {}

        setData((current) => applyRevalidation(current, fresh))
        setIsLive(true)
      } catch {}
    }

    const timer = setTimeout(revalidate, 1200)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [seed.live])

  return { data, isLive }
}
