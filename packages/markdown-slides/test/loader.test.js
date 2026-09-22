const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const { parseYaml } = require('../lib/yaml')
const { loadDeck } = require('../lib/loader')

test('yaml - parses simple keys, lists, and objects', () => {
  const yaml = `
title: "Sample Deck"
ratio: "16:9"
theme: "dark"
slides:
  - 01-intro.md
  - file: 02-arch.md
    template: Split
`
  const parsed = parseYaml(yaml)
  assert.strictEqual(parsed.title, 'Sample Deck')
  assert.strictEqual(parsed.ratio, '16:9')
  assert.strictEqual(parsed.theme, 'dark')
  assert.strictEqual(parsed.slides.length, 2)
  assert.strictEqual(parsed.slides[0], '01-intro.md')
  assert.deepStrictEqual(parsed.slides[1], {
    file: '02-arch.md',
    template: 'Split',
  })
})

test('loader - loads deck, flattens sub-decks, and resolves templates', () => {
  const tmpDir = path.join(__dirname, '_fixture_deck')
  const subDir = path.join(tmpDir, 'deep-dive')

  fs.mkdirSync(subDir, { recursive: true })

  // Write top-level slides.yaml
  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    `
title: "Master Presentation"
template: "Title/Content"
templates:
  - ./custom.js
slides:
  - 01-cover.md
  - folder: ./deep-dive
  - 03-summary.md
`,
  )

  // Write custom template
  fs.writeFileSync(
    path.join(tmpDir, 'custom.js'),
    `
module.exports = {
  CustomLayout: (state) => ({ ...state, html: '<div class="custom">' + state.html + '</div>' })
}
`,
  )

  // Write 01-cover.md with frontmatter override
  fs.writeFileSync(
    path.join(tmpDir, '01-cover.md'),
    `---
template: Cover
---
# Main Title
## Subtitle
`,
  )

  // Write 03-summary.md
  fs.writeFileSync(
    path.join(tmpDir, '03-summary.md'),
    `# Summary\n\nTakeaways...`,
  )

  // Write sub-deck slides.yaml
  fs.writeFileSync(
    path.join(subDir, 'slides.yaml'),
    `
template: Split
slides:
  - 01-sub.md
`,
  )

  // Write sub-deck slide
  fs.writeFileSync(
    path.join(subDir, '01-sub.md'),
    `Left\n\n---\n\nRight`,
  )

  try {
    const deck = loadDeck(tmpDir)

    assert.strictEqual(deck.config.title, 'Master Presentation')
    assert.strictEqual(deck.slides.length, 3)

    // Slide 1: Cover
    assert.strictEqual(deck.slides[0].index, 0)
    assert.strictEqual(deck.slides[0].template, 'Cover')
    assert.strictEqual(deck.slides[0].totalSlides, 3)

    // Slide 2: Deep dive sub-deck
    assert.strictEqual(deck.slides[1].index, 1)
    assert.strictEqual(deck.slides[1].section, 'deep-dive')
    assert.strictEqual(deck.slides[1].template, 'Split')

    // Slide 3: Summary
    assert.strictEqual(deck.slides[2].index, 2)
    assert.strictEqual(deck.slides[2].template, 'Title/Content')

    // Custom template registry
    assert.ok(typeof deck.registry.CustomLayout === 'function')
    assert.ok(typeof deck.registry['Title/Content'] === 'function')
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
})
