const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const { markdownToHtml } = require('@sullux/markdown-html')

test('CommonMark 0.31.2 Conformance Suite - baseline score regression check', () => {
  const specs = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'spec.json'), 'utf8'))
  let passed = 0
  for (const s of specs) {
    try {
      const res = markdownToHtml(s.markdown, { headingIds: false, wikilinks: false })
      const html = typeof res === 'string' ? res : res.html || ''
      if (html.trim() === s.html.trim()) passed++
    } catch (e) {}
  }
  const minRequired = 513
  assert.ok(passed >= minRequired, `Expected at least ${minRequired} passed tests, but got ${passed}`)
})
