import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'src/content/github.generated.json')

const USER = process.env.GITHUB_USER ?? 'VictorCrepaldiGomes'
const TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''
const TIMEOUT_MS = 15_000

const EXCLUDED = new Set([
  'CommitFake',
  USER,
])

const log = {
  info: (msg) => console.log(`  ${msg}`),
  ok: (msg) => console.log(`  ✓ ${msg}`),
  warn: (msg) => console.warn(`  ! ${msg}`),
}

async function request(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': `${USER}-portfolio-build`,
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        ...options.headers,
      },
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} — ${url}`)
    }
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

async function fetchProfile() {
  const user = await request(`https://api.github.com/users/${USER}`)
  return {
    login: user.login,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatar_url,
    htmlUrl: user.html_url,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    createdAt: user.created_at,
  }
}

async function fetchRepos() {
  const all = []
  for (let page = 1; page <= 4; page += 1) {
    const batch = await request(
      `https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&sort=pushed&direction=desc`,
    )
    all.push(...batch)
    if (batch.length < 100) break
  }

  return all
    .filter((repo) => !repo.fork && !repo.private && !EXCLUDED.has(repo.name))
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language,
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      size: repo.size,
      archived: repo.archived,
      createdAt: repo.created_at,
      pushedAt: repo.pushed_at,
    }))
}

async function fetchLanguages(repos) {
  const totals = new Map()

  for (const repo of repos) {
    try {
      const languages = await request(
        `https://api.github.com/repos/${USER}/${repo.name}/languages`,
      )
      for (const [language, bytes] of Object.entries(languages)) {
        totals.set(language, (totals.get(language) ?? 0) + bytes)
      }
    } catch (error) {
      log.warn(`languages for ${repo.name}: ${error.message}`)
    }
  }

  const grandTotal = [...totals.values()].reduce((sum, bytes) => sum + bytes, 0)
  if (grandTotal === 0) return []

  return [...totals.entries()]
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: Number(((bytes / grandTotal) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8)
}

function compactDays(days) {
  if (days.length === 0) return { start: null, counts: [] }
  return { start: days[0].date, counts: days.map((day) => day.count) }
}

const CALENDAR_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount }
          }
        }
      }
    }
  }
`

async function fetchCalendarViaGraphQL() {
  const payload = await request('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: CALENDAR_QUERY, variables: { login: USER } }),
  })

  const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) throw new Error('unexpected GraphQL shape')

  const days = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
  )
  return { total: calendar.totalContributions, ...compactDays(days), source: 'graphql' }
}

async function fetchCalendarViaProxy() {
  const payload = await request(
    `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`,
    { headers: { Accept: 'application/json' } },
  )
  const days = (payload.contributions ?? []).map((day) => ({
    date: day.date,
    count: day.count,
  }))
  const total =
    typeof payload.total === 'object'
      ? Object.values(payload.total).reduce((sum, n) => sum + n, 0)
      : (payload.total ?? days.reduce((sum, day) => sum + day.count, 0))

  return { total, ...compactDays(days), source: 'proxy' }
}

async function fetchCalendar() {
  if (TOKEN) {
    try {
      const calendar = await fetchCalendarViaGraphQL()
      log.ok(`calendar via GraphQL (${calendar.total} contributions)`)
      return calendar
    } catch (error) {
      log.warn(`GraphQL calendar failed, trying proxy: ${error.message}`)
    }
  }

  try {
    const calendar = await fetchCalendarViaProxy()
    log.ok(`calendar via proxy (${calendar.total} contributions)`)
    return calendar
  } catch (error) {
    log.warn(`calendar unavailable: ${error.message}`)
    return { total: 0, start: null, counts: [], source: 'none' }
  }
}

async function main() {
  console.log(`\n▸ Syncing GitHub data for @${USER}${TOKEN ? ' (authenticated)' : ''}`)

  const profile = await fetchProfile()
  log.ok(`profile — ${profile.publicRepos} public repos, ${profile.followers} followers`)

  const repos = await fetchRepos()
  log.ok(`${repos.length} repositories`)

  const languages = await fetchLanguages(repos)
  log.ok(`${languages.length} languages — top: ${languages[0]?.name ?? 'n/a'}`)

  const calendar = await fetchCalendar()

  const snapshot = {
    generatedAt: new Date().toISOString(),
    user: profile,
    repos,
    languages,
    calendar,
    totals: {
      stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
      forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
      repos: repos.length,
    },
  }

  await mkdir(dirname(OUTPUT), { recursive: true })
  await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  log.ok(`written to src/content/github.generated.json\n`)
}

main().catch(async (error) => {
  log.warn(`GitHub sync failed: ${error.message}`)
  try {
    await readFile(OUTPUT, 'utf8')
    log.warn('keeping the previously committed snapshot — build continues\n')
  } catch {
    log.warn('no previous snapshot found; writing an empty one\n')
    const empty = {
      generatedAt: new Date().toISOString(),
      user: null,
      repos: [],
      languages: [],
      calendar: { total: 0, start: null, counts: [], source: 'none' },
      totals: { stars: 0, forks: 0, repos: 0 },
    }
    await mkdir(dirname(OUTPUT), { recursive: true })
    await writeFile(OUTPUT, `${JSON.stringify(empty, null, 2)}\n`, 'utf8')
  }

  process.exitCode = 0
})
