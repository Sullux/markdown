const test = require('node:test')
const assert = require('node:assert')
const { renderShell } = require('../lib/shell')

test('shell - renders HTML document with slides, theme, controls, and assets', () => {
  const slides = [
    {
      id: 'slide-1',
      html: '<div class="content">Slide 1</div>',
      notesHtml: '<p>Key points to cover.</p>',
      frontmatter: { steps: true },
    },
    {
      id: 'slide-2',
      html: '<div class="content">Slide 2</div>',
      frontmatter: { transitions: ['#col-a', '#col-b'] },
    },
  ]
  const head = ['<link rel="stylesheet" href="katex.min.css" />']

  const html = renderShell({
    title: 'Architecture Review',
    ratio: '16:9',
    theme: 'dark',
    slides,
    head,
  })

  assert.ok(html.includes('<!DOCTYPE html>'))
  assert.ok(html.includes('<title>Architecture Review</title>'))
  assert.ok(html.includes('data-theme="dark"'))
  assert.ok(html.includes('data-ratio="16:9"'))
  assert.ok(html.includes('href="katex.min.css"'))
  assert.ok(html.includes('id="slide-1" class="slide active"'))
  assert.ok(html.includes('data-steps="true"'))
  assert.ok(html.includes('class="speaker-notes" hidden><p>Key points to cover.</p></aside>'))
  assert.ok(html.includes('data-transitions=\'["#col-a","#col-b"]\''))
  assert.ok(html.includes('class="notes-drawer"'))
  assert.ok(html.includes('class="control-btn btn-notes"'))
  assert.ok(html.includes('class="control-btn btn-presenter"'))
  assert.ok(html.includes('initPresenter'))
  assert.ok(html.includes('slides-presenter'))
  assert.ok(html.includes('1 / 2'))
  assert.ok(html.includes('class="deck-progress"'))
  assert.ok(html.includes('--deck-scale'))
  assert.ok(html.includes('fitCanvas'))
  assert.ok(html.includes('addEventListener(\'keydown\''))
})
