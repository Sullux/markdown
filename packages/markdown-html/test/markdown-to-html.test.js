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
