const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { buildDeck } = require('../lib/deck')

test('containers - compiles inline fenced container directive with template and attributes', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'container-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Container Test\nslides:\n  - 01-slide.md\n',
  )

  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# Main Slide

::: Quote {#highlight}
> "Truth is ever to be found in simplicity."
:::

Closing paragraph.
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('subdoc-container subdoc-quote'))
  assert.ok(html.includes('id="highlight"'))
  assert.ok(html.includes('Truth is ever to be found in simplicity.'))
})

test('containers - compiles nested container with local YAML frontmatter', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'container-fm-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: FM Test\nslides:\n  - 01-slide.md\n',
  )

  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# Split Container Demo

::: Split {#two-cols}
### Left Column
Left side content.

---

### Right Column
Right side content.
:::
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('subdoc-container subdoc-split'))
  assert.ok(html.includes('slide-columns'))
  assert.ok(html.includes('Left Column'))
  assert.ok(html.includes('Right Column'))
})
