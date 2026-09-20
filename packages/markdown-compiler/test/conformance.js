const fs = require('node:fs')
const path = require('node:path')
const { markdownToHtml } = require('@sullux/markdown-html')

const specsPath = path.join(__dirname, 'fixtures', 'spec.json')
if (!fs.existsSync(specsPath)) {
  console.error('spec.json not found at', specsPath)
  process.exit(1)
}

const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'))
const args = process.argv.slice(2)

const getArg = (flag) => {
  const idx = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : undefined
}

const targetSection = getArg('--section')
const targetExample = getArg('--example') ? parseInt(getArg('--example'), 10) : undefined
const showFailuresOnly = args.includes('--failed')

const filtered = specs.filter((s) => {
  if (targetExample !== undefined) return s.example === targetExample
  if (targetSection) return s.section.toLowerCase().includes(targetSection.toLowerCase())
  return true
})

let passedCount = 0
const sections = {}

for (const item of filtered) {
  if (!sections[item.section]) {
    sections[item.section] = { total: 0, passed: 0, failures: [] }
  }
  const stat = sections[item.section]
  stat.total++

  let actual = ''
  let error = null
  try {
    const res = markdownToHtml(item.markdown, { headingIds: false })
    actual = typeof res === 'string' ? res : res.html || ''
  } catch (err) {
    error = err
  }

  const matches = !error && actual.trim() === item.html.trim()

  if (matches) {
    passedCount++
    stat.passed++
  } else {
    stat.failures.push({
      example: item.example,
      section: item.section,
      markdown: item.markdown,
      expected: item.html,
      actual,
      error,
    })
  }
}

if (targetExample !== undefined) {
  const item = filtered[0]
  if (!item) {
    console.log(`Example ${targetExample} not found.`)
    process.exit(1)
  }
  const f = sections[item.section].failures[0]
  if (!f) {
    console.log(`\x1b[32m✔ Example ${item.example} [${item.section}] PASSED\x1b[0m\n`)
  } else {
    console.log(`\x1b[31m✖ Example ${item.example} [${item.section}] FAILED\x1b[0m\n`)
    console.log('\x1b[34m--- MARKDOWN ---\x1b[0m\n' + item.markdown)
    console.log('\x1b[32m--- EXPECTED HTML ---\x1b[0m\n' + item.html)
    console.log('\x1b[31m--- ACTUAL HTML ---\x1b[0m\n' + (f.error ? f.error.stack : f.actual))
  }
  process.exit(f ? 1 : 0)
}

console.log(`\n\x1b[1m=== CommonMark 0.31.2 Conformance Report ===\x1b[0m`)
console.log(`Overall: ${passedCount} / ${filtered.length} passed (${((passedCount / filtered.length) * 100).toFixed(1)}%)\n`)

for (const [secName, stat] of Object.entries(sections)) {
  const pct = Math.round((stat.passed / stat.total) * 100)
  const isFull = stat.passed === stat.total
  const isZero = stat.passed === 0
  const color = isFull ? '\x1b[32m' : isZero ? '\x1b[31m' : '\x1b[33m'
  const icon = isFull ? '✔' : isZero ? '✖' : '▲'

  if (!showFailuresOnly || !isFull) {
    const label = `${secName.padEnd(42)}`
    const count = `${stat.passed}/${stat.total}`.padStart(7)
    console.log(`  ${color}${icon} ${label} ${count} (${pct}%)\x1b[0m`)
  }
}
console.log('')
