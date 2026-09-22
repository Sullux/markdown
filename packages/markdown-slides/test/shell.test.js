const test = require('node:test')
const assert = require('node:assert')
const { renderShell } = require('../lib/shell')

test('shell - renders HTML document with slides, theme, controls, and assets', () => {
  const slides = [
    { id: 'slide-1', html: '<div class="content">Slide 1</div>' },
    { id: 'slide-2', html: '<div class="content">Slide 2</div>' },
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
  assert.ok(html.includes('id="slide-2" class="slide"'))
  assert.ok(html.includes('1 / 2'))
  assert.ok(html.includes('class="deck-progress"'))
  assert.ok(html.includes('addEventListener(\'keydown\''))
})
