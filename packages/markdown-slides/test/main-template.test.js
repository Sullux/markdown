const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { buildDeck } = require('../lib/deck')

test('main template - auto-discovers Main.md and wraps slides in layout', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'main-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Main Test\nslides:\n  - 01-slide.md\n  - 02-cover.md\n',
  )

  // Auto-discovered Main.md with a slot, footer, and CSS
  fs.writeFileSync(
    path.join(tmpDir, 'Main.md'),
    `---
name: Main
base: none
---
\`\`\`css template
.deck-footer { color: #888; font-size: 12px; }
\`\`\`
<div class="deck-frame">
  <slot />
  <footer class="deck-footer">© 2026 Sullux LLC</footer>
</div>
`,
  )

  // Slide 1 - standard slide, gets wrapped in Main
  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# Normal Slide
Some content here.
`,
  )

  // Slide 2 - opts out with Main: none
  fs.writeFileSync(
    path.join(tmpDir, '02-cover.md'),
    `---
template: Cover
Main: none
---
# Splash Cover
## Subtitle
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 2)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  // Slide 1 should contain deck-frame and deck-footer
  assert.ok(html.includes('© 2026 Sullux LLC'))
  assert.ok(html.includes('class="deck-frame"'))
  assert.ok(html.includes('.deck-footer { color: #888; font-size: 12px; }'))
})

test('main template - explicit override in slides.yaml and HTML/CSS asset discovery', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'main-override-test-'))
  const outDir = path.join(tmpDir, 'dist')
  fs.mkdirSync(path.join(tmpDir, 'assets'), { recursive: true })

  fs.writeFileSync(path.join(tmpDir, 'assets', 'logo.svg'), '<svg>logo</svg>')
  fs.writeFileSync(path.join(tmpDir, 'assets', 'bg.svg'), '<svg>bg</svg>')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    `title: Custom Main
Main: ./custom-layout.md
slides:
  - 01-slide.md
`,
  )

  fs.writeFileSync(
    path.join(tmpDir, 'custom-layout.md'),
    `---
base: none
---
\`\`\`css template
.custom-wrap { background: url('assets/bg.svg'); }
\`\`\`
<div class="custom-wrap">
  <img src="assets/logo.svg" alt="Logo" />
  <slot></slot>
</div>
`,
  )

  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# Custom Slide
Body text.
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  assert.ok(html.includes('class="custom-wrap"'))
  // Asset rewriting check: src and url should be rewritten to images/...
  assert.ok(html.includes('src="images/logo.svg"'))
  assert.ok(html.includes('url(\'images/bg.svg\')'))

  // Verify assets copied to dist/images/
  assert.ok(fs.existsSync(path.join(outDir, 'images', 'logo.svg')))
  assert.ok(fs.existsSync(path.join(outDir, 'images', 'bg.svg')))
})

test('main template - sub-documents do not inherit Main slide layout chrome', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'main-subdoc-test-'))
  const outDir = path.join(tmpDir, 'dist')

  fs.writeFileSync(
    path.join(tmpDir, 'slides.yaml'),
    'title: Subdoc No Chrome\nslides:\n  - 01-slide.md\n',
  )

  fs.writeFileSync(
    path.join(tmpDir, 'Main.md'),
    `---
name: Main
base: none
---
<div class="deck-frame">
  <slot />
  <footer class="deck-persistent-footer">SLIDE CHROME FOOTER</footer>
</div>
`,
  )

  fs.writeFileSync(
    path.join(tmpDir, '01-slide.md'),
    `---
template: Title/Content
---
# Main Slide

::: Canvas {#diagram height="150px"}
---
layout:
  box: [50%, 50%]
---
<div id="box">Inner Content</div>
:::
`,
  )

  const res = await buildDeck({ input: tmpDir, output: outDir })
  assert.strictEqual(res.slideCount, 1)

  const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
  // The persistent footer should appear exactly ONCE for the slide, not duplicated inside the subdoc
  const occurrences = (html.match(/SLIDE CHROME FOOTER/g) || []).length
  assert.strictEqual(occurrences, 1)

  // Verify the subdoc container does not contain deck-persistent-footer
  const subdocHtml = html.split('subdoc-container')[1].split('</div>')[0]
  assert.ok(!subdocHtml.includes('SLIDE CHROME FOOTER'))
})

