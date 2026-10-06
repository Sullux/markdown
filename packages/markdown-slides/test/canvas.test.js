const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { buildDeck } = require('../lib/deck')

test('canvas - positions elements by ID using frontmatter layout mapping', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canvas-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Canvas Deck\nslides:\n  - 01-canvas.md\n',
  )

  fs.writeFileSync(
    path.join(tmpDir, '01-canvas.md'),
    `---
template: Canvas
layout:
  brain: [20%, 50%]
  arrow: [50%, 50%]
  disk:  [80%, 50%]
transitions:
  - "#brain"
  - "#arrow"
  - "#disk"
---
![Brain](images/brain.svg){#brain}
![Arrow](images/r-arrow.svg){#arrow}
![Disk](images/disk.svg){#disk}
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('slide-layout slide-canvas'))
  assert.ok(html.includes('left: 20%; top: 50%'))
  assert.ok(html.includes('left: 50%; top: 50%'))
  assert.ok(html.includes('left: 80%; top: 50%'))
  assert.ok(html.includes('id="brain"'))
  assert.ok(html.includes('id="arrow"'))
  assert.ok(html.includes('id="disk"'))
  assert.ok(html.includes('data-transitions=\'["#brain","#arrow","#disk"]\''))
})

test('canvas - transcludes a canvas sub-document file into a standard slide', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canvas-trans-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Transcluded Canvas\nslides:\n  - 01-slide.md\n',
  )

  // Sub-document with Canvas template
  fs.writeFileSync(
    path.join(tmpDir, 'pipeline.md'),
    `---
template: Canvas
height: 250
layout:
  brain: [15%, 50%]
  disk:  [85%, 50%]
---
![Brain](images/brain.svg){#brain}
![Disk](images/disk.svg){#disk}
`,
  )

  // Parent slide
  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# Inference Architecture

![Pipeline Diagram](./pipeline.md)

End-to-end streaming.
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('transcluded-pipeline'))
  assert.ok(html.includes('slide-canvas'))
  assert.ok(html.includes('left: 15%; top: 50%'))
  assert.ok(html.includes('left: 85%; top: 50%'))
})

test('canvas - inlines a canvas container with local frontmatter inside a slide', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canvas-cont-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Inline Container Canvas\nslides:\n  - 01-slide.md\n',
  )

  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# In-Slide Canvas

::: Canvas {#model-canvas height="300px"}
---
layout:
  iconA: [25%, 50%]
  iconB: [75%, 50%]
---
![Icon A](images/a.svg){#iconA}
![Icon B](images/b.svg){#iconB}
:::

Concluding text.
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('subdoc-container subdoc-canvas'))
  assert.ok(html.includes('id="model-canvas"'))
  assert.ok(html.includes('height: 300px'))
  assert.ok(html.includes('left: 25%; top: 50%'))
  assert.ok(html.includes('left: 75%; top: 50%'))
})
