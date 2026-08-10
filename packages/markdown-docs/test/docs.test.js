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
  const args = ['-i', '/docs', '-o', '/site', '-b', '/base/', '-t', 'My Docs']
  const opts = parseArgs(args)
  assert.strictEqual(opts.input, '/docs')
  assert.strictEqual(opts.output, '/site')
  assert.strictEqual(opts.baseUrl, '/base/')
  assert.strictEqual(opts.title, 'My Docs')
})

test('markdown-docs - generateSite builds static HTML site with custom docs.yaml config', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-docs-test-'))
  const inputDir = path.join(tmpDir, 'docs')
  const outputDir = path.join(tmpDir, 'dist')

  fs.mkdirSync(inputDir, { recursive: true })
  fs.writeFileSync(path.join(inputDir, 'docs.yaml'), `
title: Custom Docs
logo:
  light: ./logo-light.svg
  dark: ./logo-dark.svg
links:
  - title: GitHub
    url: https://github.com/Sullux
theme:
  light:
    accent: "#160b74"
  dark:
    accent: "#b8b2e6"
  `)
  fs.writeFileSync(path.join(inputDir, 'SUMMARY.md'), '* [Home](index.md)\n* [About](about.md)')
  fs.writeFileSync(path.join(inputDir, 'index.md'), '# Welcome\n\nThis is the **home** page.')
  fs.writeFileSync(path.join(inputDir, 'about.md'), '# About Us\n\n![Logo](logo.png)')
  fs.writeFileSync(path.join(inputDir, 'logo.png'), 'fake-png-data')

  const result = generateSite({ input: inputDir, output: outputDir })

  assert.strictEqual(result.pageCount, 2)
  assert.ok(fs.existsSync(path.join(outputDir, 'index.html')))
  assert.ok(fs.existsSync(path.join(outputDir, 'about.html')))
  assert.ok(fs.existsSync(path.join(outputDir, 'logo.png')))
  assert.ok(fs.existsSync(path.join(outputDir, 'search-index.json')))

  const indexHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8')
  assert.match(indexHtml, /<h1 id="welcome">Welcome<\/h1>/)
  assert.match(indexHtml, /class="brand-logo logo-light"/)
  assert.match(indexHtml, /class="brand-logo logo-dark"/)
  assert.match(indexHtml, /<span>Custom Docs<\/span>/)
  assert.match(indexHtml, /<a href="https:\/\/github.com\/Sullux" target="_blank" rel="noopener" class="header-link">GitHub ↗<\/a>/)

  fs.rmSync(tmpDir, { recursive: true, force: true })
})

test('markdown-docs - generateSite renders logo-only header when title is omitted', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-docs-test-'))
  const inputDir = path.join(tmpDir, 'docs')
  const outputDir = path.join(tmpDir, 'dist')

  fs.mkdirSync(inputDir, { recursive: true })
  fs.writeFileSync(path.join(inputDir, 'docs.yaml'), `
logo:
  light: ./logo-light.svg
  dark: ./logo-dark.svg
  `)
  fs.writeFileSync(path.join(inputDir, 'index.md'), '# Home\n\nWelcome.')

  const result = generateSite({ input: inputDir, output: outputDir })

  assert.strictEqual(result.pageCount, 1)
  const indexHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8')
  assert.match(indexHtml, /class="brand-logo logo-light"/)
  assert.doesNotMatch(indexHtml, /<span>/)

  fs.rmSync(tmpDir, { recursive: true, force: true })
})
