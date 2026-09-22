const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const { parseArgs, buildDeck } = require('../index')

test('markdown-slides - parseArgs correctly parses CLI options', () => {
  const args = ['-i', './my-slides', '-o', './dist', '-t', 'Pitch Deck']
  const options = parseArgs(args)
  assert.strictEqual(options.input, './my-slides')
  assert.strictEqual(options.output, './dist')
  assert.strictEqual(options.title, 'Pitch Deck')
})

test('markdown-slides - buildDeck end-to-end compiles presentation directory', () => {
  const tmpDir = path.join(__dirname, '_fixture_e2e')
  const outDir = path.join(tmpDir, 'dist')
  const subDir = path.join(tmpDir, 'deep-dive')

  fs.mkdirSync(subDir, { recursive: true })

  // Write slides.yaml
  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    `
title: "Quarterly Review"
ratio: "16:9"
theme: "dark"
slides:
  - 01-cover.md
  - 02-columns.md
  - folder: ./deep-dive
`,
  )

  // Write slide 1: Cover
  fs.writeFileSync(
    path.join(tmpDir, '01-cover.md'),
    `---
template: Cover
---
# Sullux Quarterly
## Architecture Review
Charles Sullivan
`,
  )

  // Write slide 2: Columns with math and code
  fs.writeFileSync(
    path.join(tmpDir, '02-columns.md'),
    `---
template: Header/Columns/Footer
---
# Performance Benchmarks

---

### Complexity
Latency is $O(1)$ across operations.

---

### Code Architecture
\`\`\`javascript
const deck = buildDeck()
\`\`\`

---

*Confidential Report*
`,
  )

  // Write sub-deck slide
  fs.writeFileSync(
    path.join(subDir, 'slides.yaml'),
    `
template: Split
slides:
  - 01-sub.md
`,
  )

  fs.writeFileSync(
    path.join(subDir, '01-sub.md'),
    `Left Panel\n\n---\n\nRight Panel`,
  )

  // Write a dummy asset file
  fs.writeFileSync(path.join(tmpDir, 'logo.svg'), '<svg></svg>')

  try {
    const res = buildDeck({ input: tmpDir, output: outDir })

    assert.strictEqual(res.slideCount, 3)
    assert.strictEqual(res.output, outDir)

    const indexPath = path.join(outDir, 'index.html')
    assert.ok(fs.existsSync(indexPath))

    const html = fs.readFileSync(indexPath, 'utf8')
    assert.ok(html.includes('<title>Quarterly Review</title>'))
    assert.ok(html.includes('data-theme="dark"'))
    assert.ok(html.includes('data-ratio="16:9"'))

    // Slide 1: Cover
    assert.ok(html.includes('class="slide-layout slide-cover"'))
    assert.ok(html.includes('Sullux Quarterly'))

    // Slide 2: Columns + Math + Code
    assert.ok(html.includes('class="slide-layout slide-header-columns-footer"'))
    assert.ok(html.includes('Performance Benchmarks'))
    assert.ok(html.includes('class="math-inline"'))
    assert.ok(html.includes('katex'))
    assert.ok(html.includes('Confidential Report'))

    // Slide 3: Sub-deck split
    assert.ok(html.includes('class="slide-layout slide-split"'))
    assert.ok(html.includes('Left Panel'))
    assert.ok(html.includes('Right Panel'))

    // Asset copying
    assert.ok(fs.existsSync(path.join(outDir, 'logo.svg')))
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
})
