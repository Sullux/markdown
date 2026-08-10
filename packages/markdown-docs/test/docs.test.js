const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { parseSummaryMd } = require('../lib/summary')
const { parseArgs } = require('../lib/config')
const { generateSite } = require('../index')

test('markdown-docs - parseSummaryMd extracts navigation items', () => {
  const summaryContent = `# Table of Contents

* [Introduction](index.md)
* [Quick Start](quick-start.md)
* [Guide](guide/README.md)
* [Core Concepts](guide/concepts.md)
`
  const tree = parseSummaryMd(summaryContent)
  assert.strictEqual(tree.length, 4)
  assert.strictEqual(tree[0].title, 'Introduction')
  assert.strictEqual(tree[0].href, 'index.md')
  assert.strictEqual(tree[3].title, 'Core Concepts')
})

test('markdown-docs - parseArgs correctly parses CLI options', () => {
  const args = ['-i', '/docs', '-o', '/site', '-t', 'My Docs']
  const opts = parseArgs(args)
  assert.strictEqual(opts.input, '/docs')
  assert.strictEqual(opts.output, '/site')
  assert.strictEqual(opts.title, 'My Docs')
})

test('markdown-docs - generateSite builds static HTML site from markdown directory', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-docs-test-'))
  const inputDir = path.join(tmpDir, 'docs')
  const outputDir = path.join(tmpDir, 'dist')

  fs.mkdirSync(inputDir, { recursive: true })
  fs.writeFileSync(path.join(inputDir, 'SUMMARY.md'), '* [Home](index.md)\n* [About](about.md)')
  fs.writeFileSync(path.join(inputDir, 'index.md'), '# Welcome\n\nThis is the **home** page.')
  fs.writeFileSync(path.join(inputDir, 'about.md'), '# About Us\n\n![Logo](logo.png)')
  fs.writeFileSync(path.join(inputDir, 'logo.png'), 'fake-png-data')

  const result = generateSite({ input: inputDir, output: outputDir, title: 'Test Site' })

  assert.strictEqual(result.pageCount, 2)
  assert.ok(fs.existsSync(path.join(outputDir, 'index.html')))
  assert.ok(fs.existsSync(path.join(outputDir, 'about.html')))
  assert.ok(fs.existsSync(path.join(outputDir, 'logo.png')))
  assert.ok(fs.existsSync(path.join(outputDir, 'search-index.json')))

  const indexHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8')
  assert.match(indexHtml, /<h1 id="welcome">Welcome<\/h1>/)
  assert.match(indexHtml, /<a href="index.html" class="nav-link active">Home<\/a>/)

  fs.rmSync(tmpDir, { recursive: true, force: true })
})
