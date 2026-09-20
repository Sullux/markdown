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
  assert.strictEqual(tree[0].href, 'index.html')
  assert.strictEqual(tree[1].href, 'quick-start.html')
  assert.strictEqual(tree[2].href, 'guide/index.html')
  assert.strictEqual(tree[3].title, 'Core Concepts')
  assert.strictEqual(tree[3].href, 'guide/concepts.html')
})

test('markdown-docs - parseSummaryMd supports unlinked category labels with nested sub-items', () => {
  const summaryContent = `# Summary

* [Overview](README.md)
* Packages
  * [markdown-compiler](/projects/markdown/markdown-compiler)
  * [markdown-html](/projects/markdown/markdown-html)
`
  const tree = parseSummaryMd(summaryContent)
  assert.strictEqual(tree.length, 2)
  assert.strictEqual(tree[0].title, 'Overview')
  assert.strictEqual(tree[0].href, 'index.html')

  assert.strictEqual(tree[1].title, 'Packages')
  assert.strictEqual(tree[1].href, null)
  assert.strictEqual(tree[1].children.length, 2)
  assert.strictEqual(tree[1].children[0].title, 'markdown-compiler')
  assert.strictEqual(tree[1].children[0].href, '/projects/markdown/markdown-compiler')
  assert.strictEqual(tree[1].children[1].title, 'markdown-html')
  assert.strictEqual(tree[1].children[1].href, '/projects/markdown/markdown-html')
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

test('markdown-docs - generateSite compiles README.md to index.html without README.html artifact', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-docs-readme-test-'))
  const inputDir = path.join(tmpDir, 'docs')
  const outputDir = path.join(tmpDir, 'dist')

  fs.mkdirSync(inputDir, { recursive: true })
  fs.writeFileSync(path.join(inputDir, 'SUMMARY.md'), '* [Overview](README.md)\n* [Features](features.md)')
  fs.writeFileSync(path.join(inputDir, 'README.md'), '# Product Overview\n\nWelcome to our product.\n\nRead more at [Overview](README.md).')
  fs.writeFileSync(path.join(inputDir, 'features.md'), '# Features\n\nFeature list. Go back to [Home](README.md).')

  const result = generateSite({ input: inputDir, output: outputDir, title: 'Test Product' })

  assert.strictEqual(result.pageCount, 2)
  assert.ok(fs.existsSync(path.join(outputDir, 'index.html')))
  assert.ok(!fs.existsSync(path.join(outputDir, 'README.html')), 'README.html should not exist')

  const indexHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8')
  assert.match(indexHtml, /href="index\.html"/)
  assert.doesNotMatch(indexHtml, /href="README\.(?:md|html)"/)

  const featuresHtml = fs.readFileSync(path.join(outputDir, 'features.html'), 'utf8')
  assert.match(featuresHtml, /href="index\.html"/)
  assert.doesNotMatch(featuresHtml, /href="README\.(?:md|html)"/)

  const searchIndex = JSON.parse(fs.readFileSync(path.join(outputDir, 'search-index.json'), 'utf8'))
  assert.strictEqual(searchIndex[0].title, 'Product Overview')
  assert.strictEqual(searchIndex[0].href, 'index.html')

  fs.rmSync(tmpDir, { recursive: true, force: true })
})

test('markdown-docs - generateSite detects math and injects KaTeX assets on math pages', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-docs-math-test-'))
  const inputDir = path.join(tmpDir, 'docs')
  const outputDir = path.join(tmpDir, 'dist')

  fs.mkdirSync(inputDir, { recursive: true })
  fs.writeFileSync(path.join(inputDir, 'SUMMARY.md'), '* [Math Page](math.md)\n* [Plain Page](plain.md)\n* [Code Math](code-math.md)')
  fs.writeFileSync(path.join(inputDir, 'math.md'), '# Math Page\n\nComplexity is $O(1)$ and:\n\n$$\nf(x) = x^2\n$$')
  fs.writeFileSync(path.join(inputDir, 'code-math.md'), '# Code Math Page\n\n```math\ng(x) = \\sqrt{x}\n```')
  fs.writeFileSync(path.join(inputDir, 'plain.md'), '# Plain Page\n\nNo math formulas here.')

  generateSite({ input: inputDir, output: outputDir })

  const mathHtml = fs.readFileSync(path.join(outputDir, 'math.html'), 'utf8')
  assert.match(mathHtml, /katex\.min\.css/)
  assert.match(mathHtml, /auto-render\.min\.js/)
  assert.match(mathHtml, /class="math-inline" data-latex="O\(1\)"/)

  const codeMathHtml = fs.readFileSync(path.join(outputDir, 'code-math.html'), 'utf8')
  assert.match(codeMathHtml, /katex\.min\.css/)
  assert.match(codeMathHtml, /auto-render\.min\.js/)
  assert.match(codeMathHtml, /class="math-display" data-latex="g\(x\) = \\sqrt\{x\}"/)

  const plainHtml = fs.readFileSync(path.join(outputDir, 'plain.html'), 'utf8')
  assert.doesNotMatch(plainHtml, /katex\.min\.css/)
  assert.doesNotMatch(plainHtml, /auto-render\.min\.js/)

  fs.rmSync(tmpDir, { recursive: true, force: true })
})

test('markdown-docs - generateSite injects Mermaid assets on diagram pages with theme event dispatch', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-docs-mermaid-test-'))
  const inputDir = path.join(tmpDir, 'docs')
  const outputDir = path.join(tmpDir, 'dist')

  fs.mkdirSync(inputDir, { recursive: true })
  fs.writeFileSync(path.join(inputDir, 'SUMMARY.md'), '* [Diagrams](diagrams.md)\n* [Notes](notes.md)')
  fs.writeFileSync(path.join(inputDir, 'diagrams.md'), '# Diagrams\n\n```mermaid\ngraph TD;\n  A-->B;\n```')
  fs.writeFileSync(path.join(inputDir, 'notes.md'), '# Notes\n\nJust text.')

  generateSite({ input: inputDir, output: outputDir })

  const diagHtml = fs.readFileSync(path.join(outputDir, 'diagrams.html'), 'utf8')
  assert.match(diagHtml, /mermaid\.esm\.min\.mjs/)
  assert.match(diagHtml, /@sullux\/markdown:theme/)
  assert.match(diagHtml, /<pre class="mermaid">graph TD;\n  A--&gt;B;<\/pre>/)
  assert.match(diagHtml, /dispatchEvent\(new CustomEvent\('@sullux\/markdown:theme'/)

  const notesHtml = fs.readFileSync(path.join(outputDir, 'notes.html'), 'utf8')
  assert.doesNotMatch(notesHtml, /mermaid\.esm\.min\.mjs/)

  fs.rmSync(tmpDir, { recursive: true, force: true })
})
