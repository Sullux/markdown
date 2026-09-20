const test = require('node:test')
const assert = require('node:assert')
const { markdownToHtml } = require('../index')

test('markdownToHtml - Headings and slugified IDs', () => {
  const md = '# Main Title\n\n## Section One\n\n## Section One'
  const html = markdownToHtml(md)
  assert.strictEqual(
    html,
    '<h1 id="main-title">Main Title</h1>\n<h2 id="section-one">Section One</h2>\n<h2 id="section-one-1">Section One</h2>\n'
  )
})

test('markdownToHtml - Fenced code blocks with language highlighting', () => {
  const md = '```js\nconst x = "<hello>";\n```'
  const html = markdownToHtml(md)
  assert.strictEqual(
    html,
    '<pre><code class="language-js"><span class="hl-kw">const</span> <span class="hl-id">x</span> <span class="hl-punc">=</span> <span class="hl-str">&quot;&lt;hello&gt;&quot;</span><span class="hl-punc">;</span></code></pre>\n'
  )
})

test('markdownToHtml - Pluggable custom code block renderers', () => {
  const md = '```mermaid\ngraph TD;\n  A-->B;\n```'
  const customRenderer = (node) => `<div class="mermaid-graph">${node.value}</div>\n`

  const html = markdownToHtml(md, {
    codeRenderers: { mermaid: customRenderer },
  })

  assert.strictEqual(html, '<div class="mermaid-graph">graph TD;\n  A-->B;</div>\n')
})

test('markdownToHtml - GitHub and GitBook callout boxes', () => {
  const gfmMd = '> [!NOTE]\n> This is a note.'
  const gfmHtml = markdownToHtml(gfmMd)
  assert.match(gfmHtml, /<div class="callout callout-note">\n<div class="callout-title">Note<\/div>\n<p>This is a note.<\/p>\n<\/div>/)

  const gitbookMd = '{% hint style="info" %}\nThis is info.\n{% endhint %}'
  const gitbookHtml = markdownToHtml(gitbookMd)
  assert.match(gitbookHtml, /<div class="callout callout-info">\n<div class="callout-title">Info<\/div>\n<p>This is info.<\/p>\n<\/div>/)
})

test('markdownToHtml - Task lists and checkboxes', () => {
  const md = '- [ ] Task 1\n- [x] Task 2'
  const html = markdownToHtml(md)
  assert.match(html, /<input type="checkbox" disabled \/> Task 1/)
  assert.match(html, /<input type="checkbox" checked disabled \/> Task 2/)
})

test('markdownToHtml - Numbered lists with sub-bullets render nested <ul> inside <li> without re-numbering', () => {
  const md = [
    '1. first item',
    '  - sub 1',
    '  - sub 2',
    '2. second item',
    '  - sub 1',
    '  - sub 2',
  ].join('\n')

  const html = markdownToHtml(md)
  assert.ok(html.includes('<ol>\n<li>first item<ul>\n<li>sub 1</li>\n<li>sub 2</li>\n</ul>\n</li>\n<li>second item<ul>\n<li>sub 1</li>\n<li>sub 2</li>\n</ul>\n</li>\n</ol>'))
})

test('markdownToHtml - GFM Tables with column alignments', () => {
  const md = '| Name | Age |\n| :--- | ---: |\n| Charles | 50 |'
  const html = markdownToHtml(md)
  assert.match(html, /<table>\n<thead>\n<tr><th align="left">Name<\/th><th align="right">Age<\/th><\/tr>/)
  assert.match(html, /<tbody>\n<tr><td align="left">Charles<\/td><td align="right">50<\/td><\/tr>\n<\/tbody>/)
})

test('markdownToHtml - Images with dimensions render inline CSS styles', () => {
  const md = '![Diagram|400x200](architecture.png)'
  const html = markdownToHtml(md)
  assert.strictEqual(html, '<p><img src="architecture.png" alt="Diagram" style="width: 400px; height: 200px;" /></p>\n')
})

test('markdownToHtml - Strips YAML frontmatter', () => {
  const md = '---\ntitle: Doc Title\nauthor: Charles\n---\n\n# Real Content'
  const html = markdownToHtml(md)
  assert.strictEqual(html, '<h1 id="real-content">Real Content</h1>\n')
})

test('markdownToHtml - Preserves raw block HTML elements without escaping', () => {
  const md = '<p align="center">\n  <img src="logo.svg" alt="Logo" width="160" height="160" />\n</p>\n\n# Real Content'
  const html = markdownToHtml(md)
  assert.ok(html.includes('<p align="center">\n  <img src="logo.svg" alt="Logo" width="160" height="160" />\n</p>\n'))
  assert.ok(html.includes('<h1 id="real-content">Real Content</h1>\n'))
})

test('markdownToHtml - Renders inline math and display math with semantic container defaults', () => {
  const md = 'Formula $E = mc^2$ in text.\n\n$$\n\\frac{a}{b}\n$$'
  const html = markdownToHtml(md)
  assert.ok(html.includes('<span class="math-inline" data-latex="E = mc^2">$E = mc^2$</span>'))
  assert.ok(html.includes('<div class="math-display" data-latex="\\frac{a}{b}">$$\n\\frac{a}{b}\n$$</div>'))
})

test('markdownToHtml - Supports custom math block and inline math renderers', () => {
  const md = 'Formula $x^2$ here.\n\n$$y = mx + b$$'
  const html = markdownToHtml(md, {
    inlineMathRenderer: (token) => `<math-inline>${token.value}</math-inline>`,
    mathBlockRenderer: (node) => `<math-block>${node.value}</math-block>\n`,
  })
  assert.ok(html.includes('<math-inline>x^2</math-inline>'))
  assert.ok(html.includes('<math-block>y = mx + b</math-block>'))
})

test('markdownToHtml - Code renderers math hook handles both code blocks and display math fallback', () => {
  const md = '```math\ncode_formula\n```\n\n$$block_formula$$'
  const html = markdownToHtml(md, {
    codeRenderers: {
      math: (node) => `<rendered-math>${node.value}</rendered-math>\n`,
    },
  })
  assert.ok(html.includes('<rendered-math>code_formula</rendered-math>'))
  assert.ok(html.includes('<rendered-math>block_formula</rendered-math>'))
})
