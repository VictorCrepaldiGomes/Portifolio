import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const BASE = process.env.AUDIT_URL ?? 'http://localhost:4173'

const TARGETS = [
  {
    name: 'desktop · dark',
    context: { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' },
  },
  {
    name: 'mobile · light',
    context: {
      viewport: { width: 390, height: 844 },
      colorScheme: 'light',
      isMobile: true,
      hasTouch: true,
    },
  },
]

const browser = await chromium.launch()
let violations = 0

for (const target of TARGETS) {
  const context = await browser.newContext(target.context)
  const page = await context.newPage()

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze()

  console.log(`\n===== ${target.name} =====`)
  console.log(
    `passes ${results.passes.length} · violations ${results.violations.length} · needs review ${results.incomplete.length}`,
  )

  violations += results.violations.length

  for (const violation of results.violations) {
    console.log(`\n  [${violation.impact}] ${violation.id} — ${violation.help}`)
    console.log(`  ${violation.helpUrl}`)
    for (const node of violation.nodes.slice(0, 5)) {
      console.log(`    · ${node.target.join(' ')}`)
      console.log(`      ${node.failureSummary?.replace(/\n/g, ' ').slice(0, 220)}`)
    }
  }

  await context.close()
}

await browser.close()

console.log(`\n${violations === 0 ? '✓ no violations' : `✗ ${violations} violation(s)`}\n`)
process.exit(violations === 0 ? 0 : 1)
