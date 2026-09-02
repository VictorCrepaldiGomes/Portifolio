# Changelog

Version lives in `package.json`, is injected at build time as `__APP_VERSION__`,
and is printed in the site footer. Bump it on every deploy.

```bash
pnpm release:patch   # 3.0.0 -> 3.0.1   fixes, copy, small tweaks
pnpm release:minor   # 3.0.0 -> 3.1.0   new section, new feature
pnpm release:major   # 3.0.0 -> 4.0.0   redesign, a different site
```

## 3.0.0

Full rebuild. React 19 + Vite + Tailwind v4, typeset in JetBrains Mono,
monochrome plus one blue.

- Bilingual PT-BR / EN with the language in the URL
- Build-time GitHub snapshot with client-side revalidation
- Command palette, hidden Snake, hidden note
- YouTube music dock with its own transport controls
- Interactive dot field in the hero
- Age derived from a birth date instead of hard-coded
- 0 accessibility violations, 0 lint warnings, 0 type errors

## 2.x

The previous site: React + Vite, Inter, card-based layout, PT-BR only.

## 1.x

The first portfolio.
