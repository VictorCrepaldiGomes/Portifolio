# victorgomes.dev.br

Personal portfolio of **Victor Crepaldi Gomes** — Full Stack Developer.

Set entirely in JetBrains Mono over a strictly monochrome palette plus one
electric blue. Bilingual (PT-BR / EN), keyboard-first, and wired to live GitHub
data.

**Live:** <https://www.victorgomes.dev.br>

---

## Stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | React 19 + Vite 8 (Rolldown)                        |
| Language   | TypeScript 6, strict                                |
| Styling    | Tailwind CSS v4 (CSS-first config) + shadcn/ui      |
| Motion     | Motion (`motion/react`)                             |
| URL state  | nuqs                                                |
| Type       | JetBrains Mono Variable (self-hosted via Fontsource) |
| Lint       | oxlint                                              |

## Getting started

```bash
pnpm install
pnpm dev
```

| Script              | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `pnpm dev`          | Dev server                                                                |
| `pnpm build`        | Sync GitHub data → typecheck → build                                      |
| `pnpm build:fast`   | Build without hitting the GitHub API                                      |
| `pnpm sync:github`  | Refresh `src/content/github.generated.json`                               |
| `pnpm generate:og`  | Re-render `public/og.png` and `public/apple-touch-icon.png`               |
| `pnpm audit:a11y`   | axe-core audit against a running `pnpm preview` (exits non-zero on issues) |
| `pnpm typecheck`    | `tsc -b --noEmit`                                                         |
| `pnpm lint`         | oxlint                                                                    |

## Architecture

```text
scripts/
  fetch-github.mjs      Build-time GitHub snapshot. Never fails the build.
  generate-og.mjs       Renders the social card from an SVG template (resvg).
  audit-a11y.mjs        axe-core sweep, both themes and breakpoints.

src/
  content/              The single source of truth for everything the site says.
    types.ts            Localized<T>, Project, TimelineEntry, …
    profile.ts          Identity, navigation, skills, contact channels.
    projects.ts         Editorial layer over the GitHub repositories.
    experience.ts       Work and education on one timeline.
    ui.ts               Every interface string, in both languages.
    github.generated.json   Committed build-time snapshot.

  lib/
    i18n.tsx            Language provider; language lives in ?lang=.
    motion.ts           The motion vocabulary: easings, durations, variants.
    github.ts           Snapshot loader + background revalidation.
    seo.ts              Reactive meta tags, hreflang and JSON-LD.
    url-state.ts        nuqs parsers for the shareable UI state.
    format.ts           Locale-aware dates and numbers.

  hooks/                use-theme, use-scroll-spy, use-keyboard, use-clock, …
  components/
    ui/                 shadcn primitives.
    primitives/         Reveal, Section, Counter, Marquee, Logo, brand icons.
    layout/             Header, footer, theme and language toggles.
    sections/           Hero, About, Experience, Work, GitHub, Contact.
    command/            ⌘K palette.
    music/              YouTube dock.
    easter-eggs/        Snake, and a note that is not for you.
```

### Content is data, not markup

Every user-facing string is a `Localized` pair in `src/content`. The language
toggle is a lookup, not a translation step, and TypeScript refuses to compile a
string that exists in only one language.

Age is derived from a birth date rather than written down, so the About section
never goes stale. LinkedIn is a link only: it has no public profile API, so
nothing on this page can read from it at runtime.

### GitHub data

`scripts/fetch-github.mjs` snapshots the profile, repositories, aggregated
language bytes and the contribution calendar into
`src/content/github.generated.json`, which is **committed**. The page therefore
renders real data with zero network latency and no rate-limit exposure.

- The calendar is stored as a start date plus a flat array of daily counts —
  contiguous days make every other date derivable, which is ~20 kB saved.
- `GITHUB_TOKEN` is optional and build-time only. With it, the calendar comes
  from the GraphQL API; without it, from a public proxy; without that, the
  section degrades quietly.
- If the sync fails for any reason, the previously committed snapshot stands and
  the build continues.
- In the browser, `useGitHub()` refreshes the values that actually move (stars,
  followers, last push) after the page settles, caching for an hour in
  `sessionStorage`. Every failure is swallowed on purpose.

### State that belongs in the URL

Handled with nuqs, so any view is a link someone can send:

| Param      | Meaning                             | History   |
| ---------- | ----------------------------------- | --------- |
| `?lang=`   | `pt` (default, stripped) \| `en`    | `replace` |
| `?filter=` | Project category                    | `replace` |
| `?project=`| Open case study by slug             | `push`    |

`push` on `?project=` is what makes the browser Back button — and the Android
back gesture — close the case study for free.

### Music dock

A small YouTube player docked bottom-right. There is no free YouTube search API,
so the flow is: pick a station, or search on YouTube, copy the link and paste it.
Any watch/short/live/embed URL or a bare 11-character ID is accepted.

Station IDs live in `src/components/music/music-context.tsx`. They were checked
against a real embed from a real origin — note that many long-running "lofi
radio" *live streams* refuse to embed, so the presets are archived videos. If one
goes dark, swap the ID there.

### Easter eggs

Nothing links to these.

| Trigger | What happens |
| --- | --- |
| `⌘K` / `Ctrl+K` | Command palette |
| Konami code (↑↑↓↓←→←→BA) | Snake |
| Type `maria` anywhere | A note for Maria Victória |
| The ♡ in the footer | The same note |
| Open the console | A greeting and the hints above |

### Accessibility

`pnpm audit:a11y` runs axe-core over the full page in both themes and both
breakpoints and currently reports **0 violations**. Palette contrast is verified
against WCAG AA in both modes; the three "needs review" items are a background
grid, an overlapping layout pill and a gradient underline, all of which measure
~18:1 in practice.

Motion respects `prefers-reduced-motion` globally through `MotionConfig` and
again in CSS.

## Versioning

The version in `package.json` is injected into the bundle as `__APP_VERSION__`
and shown in the footer. Bump it on every deploy — patch for fixes and copy,
minor for a new feature or section, major for a redesign.

```bash
pnpm release:patch
pnpm release:minor
pnpm release:major
```

See `CHANGELOG.md`.

## Deployment

Vercel, configured by `vercel.json` (immutable asset caching plus a small set of
security headers). Set `GITHUB_TOKEN` as a build environment variable to get the
real contribution calendar.

---

There is more here than the navigation shows. Press `⌘K` / `Ctrl+K`, or open
the browser console.
