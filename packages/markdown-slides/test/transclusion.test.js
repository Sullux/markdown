const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { buildDeck } = require('../lib/deck')

test('transclusion - inlines external markdown document into parent slide', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'transclude-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Transclusion Test\nslides:\n  - 01-slide.md\n',
  )

  // Sub-document with Quote template
  fs.writeFileSync(
    path.join(tmpDir, 'quote-sub.md'),
    `---
template: Quote
---
> "The mind is everything."
`,
  )

  // Parent slide embedding quote-sub.md
  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# Main Slide

![Quote Component](./quote-sub.md)

Closing thoughts.
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('transcluded-doc transcluded-quote-sub'))
  assert.ok(html.includes('slide-quote'))
  assert.ok(html.includes('The mind is everything.'))
})

test('transclusion - safely handles cyclic transclusions', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cyclic-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Cyclic\nslides:\n  - a.md\n',
  )

  fs.writeFileSync(
    path.join(tmpDir, 'a.md'),
    '# A\n![Go B](./b.md)\n',
  )
  fs.writeFileSync(
    path.join(tmpDir, 'b.md'),
    '# B\n![Go A](./a.md)\n',
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('Cyclic: ./a.md'))
})
