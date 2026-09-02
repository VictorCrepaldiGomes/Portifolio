import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Resvg } from '@resvg/resvg-js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = resolve(ROOT, 'public')
const CACHE = resolve(ROOT, 'node_modules/.cache/fonts')

const FONT_BASE = 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf'
const FONTS = ['JetBrainsMono-Regular', 'JetBrainsMono-Medium', 'JetBrainsMono-Bold']

const INK = '#fafafa'
const MUTED = '#8a8a8a'
const BG = '#0a0a0a'
const BRAND = '#3b82f6'

async function ensureFonts() {
  await mkdir(CACHE, { recursive: true })
  const paths = []

  for (const name of FONTS) {
    const path = resolve(CACHE, `${name}.ttf`)
    if (!existsSync(path)) {
      process.stdout.write(`  downloading ${name}.ttf … `)
      const response = await fetch(`${FONT_BASE}/${name}.ttf`)
      if (!response.ok) throw new Error(`font download failed: ${response.status}`)
      await writeFile(path, Buffer.from(await response.arrayBuffer()))
      console.log('done')
    }
    paths.push(path)
  }

  return paths
}

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function gridLines(width, height, step) {
  let lines = ''
  for (let x = step; x < width; x += step) {
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>`
  }
  for (let y = step; y < height; y += step) {
    lines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>`
  }
  return lines
}

function ogCard() {
  const W = 1200
  const H = 630
  const stack = ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind']

  const chips = stack
    .map((label, index) => {
      const x = 80 + index * 168
      return `
        <g transform="translate(${x}, 486)">
          <rect width="150" height="44" rx="8" fill="none" stroke="#ffffff" stroke-opacity="0.16"/>
          <text x="75" y="29" text-anchor="middle" font-family="JetBrains Mono" font-size="17" fill="${MUTED}">${escape(label)}</text>
        </g>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${gridLines(W, H, 60)}

  <!-- availability -->
  <circle cx="86" cy="92" r="6" fill="${BRAND}"/>
  <text x="106" y="98" font-family="JetBrains Mono" font-size="18" font-weight="500" letter-spacing="3.2" fill="${MUTED}">DISPONÍVEL PARA NOVAS OPORTUNIDADES</text>

  <!-- name -->
  <text x="80" y="248" font-family="JetBrains Mono" font-size="92" font-weight="700" letter-spacing="-4.5" fill="${INK}">Victor</text>
  <text x="80" y="344" font-family="JetBrains Mono" font-size="92" font-weight="700" letter-spacing="-4.5" fill="#6e6e6e">Crepaldi Gomes<tspan fill="${BRAND}">.</tspan></text>

  <!-- rule -->
  <rect x="80" y="386" width="180" height="1.5" fill="#ffffff" fill-opacity="0.22"/>

  <!-- role -->
  <text x="80" y="432" font-family="JetBrains Mono" font-size="19" font-weight="500" letter-spacing="3.4" fill="${MUTED}">DESENVOLVEDOR FULL STACK</text>

  ${chips}

  <!-- url -->
  <text x="1120" y="98" text-anchor="end" font-family="JetBrains Mono" font-size="18" fill="${MUTED}">victorgomes.dev.br</text>
</svg>`
}

function touchIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="${BG}"/>
  <text x="90" y="116" text-anchor="middle" font-family="JetBrains Mono" font-size="74" font-weight="700" letter-spacing="-4" fill="${INK}">VC</text>
  <circle cx="140" cy="42" r="11" fill="${BRAND}"/>
</svg>`
}

function render(svg, fontFiles, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: {
      fontFiles,
      loadSystemFonts: false,
      defaultFontFamily: 'JetBrains Mono',
    },
  })
  return resvg.render().asPng()
}

async function main() {
  console.log('\n▸ Generating social assets')
  const fontFiles = await ensureFonts()

  await writeFile(resolve(PUBLIC, 'og.png'), render(ogCard(), fontFiles, 1200))
  console.log('  ✓ public/og.png (1200×630)')

  await writeFile(resolve(PUBLIC, 'apple-touch-icon.png'), render(touchIcon(), fontFiles, 180))
  console.log('  ✓ public/apple-touch-icon.png (180×180)')

  const size = (await readFile(resolve(PUBLIC, 'og.png'))).byteLength
  console.log(`  og.png is ${(size / 1024).toFixed(1)} KB\n`)
}

main().catch((error) => {
  console.error(`  ! OG generation failed: ${error.message}\n`)
  process.exit(1)
})
