const test = require('node:test')
const assert = require('node:assert')
const { parse } = require('@sullux/markdown-compiler')
const {
  BUILT_IN_TEMPLATES,
  runTemplates,
} = require('../lib/templates')

test('templates - Title/Content separates header and body', () => {
  const markdown = '# Slide Title\n\n- Bullet 1\n- Bullet 2'
  const ast = parse(markdown)
  const res = runTemplates(
    'Title/Content',
    { ast },
    { registry: BUILT_IN_TEMPLATES },
  )

  assert.ok(res.html.includes('class="slide-layout slide-title-content"'))
  assert.ok(res.html.includes('<header class="slide-header">'))
  assert.ok(res.html.includes('<h1 id="slide-title">Slide Title</h1>'))
  assert.ok(res.html.includes('<div class="slide-body">'))
  assert.ok(res.html.includes('<li>Bullet 1</li>'))
})

test('templates - Header/Columns/Footer partitions by thematic break', () => {
  const markdown = `
Top Header Bar

---

### Col 1
- Point A

---

### Col 2
- Point B

---

Footer Note
`
  const ast = parse(markdown)
  const res = runTemplates(
    'Header/Columns/Footer',
    { ast },
    { registry: BUILT_IN_TEMPLATES },
  )

  assert.ok(res.html.includes('class="slide-layout slide-header-columns-footer"'))
  assert.ok(res.html.includes('<header class="slide-header">'))
  assert.ok(res.html.includes('<div class="slide-columns">'))
  assert.ok(res.html.includes('<div class="slide-col">'))
  assert.ok(res.html.includes('Col 1'))
  assert.ok(res.html.includes('Col 2'))
  assert.ok(res.html.includes('<footer class="slide-footer">'))
  assert.ok(res.html.includes('Footer Note'))
})

test('templates - Cover extracts title, subtitle, and metadata', () => {
  const markdown = '# Main Title\n\n## Presentation Subtitle\n\nCharles Sullivan\nJanuary 2025'
  const ast = parse(markdown)
  const res = runTemplates(
    'Cover',
    { ast },
    { registry: BUILT_IN_TEMPLATES },
  )

  assert.ok(res.html.includes('class="slide-layout slide-cover"'))
  assert.ok(res.html.includes('<div class="cover-title">'))
  assert.ok(res.html.includes('Main Title'))
  assert.ok(res.html.includes('<div class="cover-subtitle">'))
  assert.ok(res.html.includes('Presentation Subtitle'))
  assert.ok(res.html.includes('<div class="cover-meta">'))
  assert.ok(res.html.includes('Charles Sullivan'))
})

test('templates - Split divides content into columns without header/footer', () => {
  const markdown = 'Left Content\n\n---\n\nRight Content'
  const ast = parse(markdown)
  const res = runTemplates(
    'Split',
    { ast },
    { registry: BUILT_IN_TEMPLATES },
  )

  assert.ok(res.html.includes('class="slide-layout slide-split"'))
  assert.ok(res.html.includes('<div class="slide-columns">'))
  assert.ok(res.html.includes('Left Content'))
  assert.ok(res.html.includes('Right Content'))
  assert.ok(!res.html.includes('<header class="slide-header">'))
})

test('templates - Media provides unpadded canvas', () => {
  const markdown = '![Architecture Map](arch.png)'
  const ast = parse(markdown)
  const res = runTemplates(
    'Media',
    { ast },
    { registry: BUILT_IN_TEMPLATES },
  )

  assert.ok(res.html.includes('class="slide-layout slide-media"'))
  assert.ok(res.html.includes('<img src="arch.png" alt="Architecture Map"'))
})

test('templates - Quote centers statement callout', () => {
  const markdown = '> Simplicity is prerequisite for reliability.\n>\n> — Edsger W. Dijkstra'
  const ast = parse(markdown)
  const res = runTemplates(
    'Quote',
    { ast },
    { registry: BUILT_IN_TEMPLATES },
  )

  assert.ok(res.html.includes('class="slide-layout slide-quote"'))
  assert.ok(res.html.includes('<blockquote>'))
  assert.ok(res.html.includes('Edsger W. Dijkstra'))
})

test('templates - progressive composition through multiple templates', () => {
  const markdown = '# Composed Slide\n\nContent here'
  const ast = parse(markdown)

  // Custom envelope template that wraps html in a watermark frame
  const watermarkTemplate = (state, context) => ({
    ...state,
    html: `<div class="watermark-frame">${state.html}<div class="stamp">${context.title}</div></div>`,
    head: [...state.head, '<style>.watermark { color: red; }</style>'],
  })

  const registry = {
    ...BUILT_IN_TEMPLATES,
    Watermark: watermarkTemplate,
  }

  const res = runTemplates(
    ['Title/Content', 'Watermark'],
    { ast },
    { registry, title: 'Quarterly Review' },
  )

  assert.ok(res.html.includes('class="watermark-frame"'))
  assert.ok(res.html.includes('class="slide-layout slide-title-content"'))
  assert.ok(res.html.includes('<div class="stamp">Quarterly Review</div>'))
  assert.ok(res.head.includes('<style>.watermark { color: red; }</style>'))
})

test('templates - collect head assets like math and syntax highlighting', () => {
  const markdown = '# Math Slide\n\nInline math: $E=mc^2$'
  const ast = parse(markdown)
  const res = runTemplates(
    'Title/Content',
    { ast },
    { registry: BUILT_IN_TEMPLATES },
  )

  assert.ok(res.html.includes('class="math-inline"'))
  assert.ok(res.head.some((h) => h.includes('katex')))
})
