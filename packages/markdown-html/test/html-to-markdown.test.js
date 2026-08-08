const test = require('node:test')
const assert = require('node:assert')
const { htmlToMarkdown, toMarkdown } = require('../index')

test('HTML to Markdown compiler strips script/style/comment tags', () => {
  const html = `
    <!-- This is a comment -->
    <p>Keep this text.</p>
    <style>body { color: red; }</style>
    <script>console.log("ignore me");</script>
    <div>And keep this too.</div>
  `
  const md = htmlToMarkdown(html)
  const expected = [
    'Keep this text.',
    '',
    'And keep this too.',
  ].join('\n')

  assert.strictEqual(md, expected)
})

test('HTML to Markdown maps basic typographic formatting tags', () => {
  const html = `
    <p>Hello <strong>bold world</strong> and <em>italicized text</em> with some <code>inline code</code>!</p>
  `
  const md = htmlToMarkdown(html)
  assert.strictEqual(md, 'Hello **bold world** and *italicized text* with some `inline code`!')
})

test('HTML to Markdown handles CSS Cascading inline styles', () => {
  const html = `
    <div>
      This is standard text.
      <span style="font-weight: bold;">This is bold span.</span>
      <span style="font-style: italic;">This is italic span.</span>
      <span style="font-weight: 700; font-style: italic;">This is bold italic.</span>
    </div>
  `
  const md = htmlToMarkdown(html)
  const expected = 'This is standard text. **This is bold span.** *This is italic span.* ***This is bold italic.***'
  assert.strictEqual(md, expected)
})

test('HTML to Markdown processes anchors, images, and breaks', () => {
  const html = `
    <p>Go to <a href="https://sullux.com">Sullux <strong>Consultancy</strong></a> now.</p>
    <p>Check the logo: <img src="logo.png" alt="Sullux Logo" /></p>
    <p>First Line<br />Second Line</p>
  `
  const md = htmlToMarkdown(html)
  const expected = [
    'Go to [Sullux **Consultancy**](https://sullux.com) now.',
    '',
    'Check the logo: ![Sullux Logo](logo.png)',
    '',
    'First Line  ',
    'Second Line',
  ].join('\n')

  assert.strictEqual(md, expected)
})

test('HTML to Markdown promotes styled large font sizes to Headers', () => {
  const html = `
    <div style="font-size: 28px; font-weight: bold;">Big Top Header</div>
    <p style="font-size: 20px;">Medium Subtitle</p>
    <div>Standard small text.</div>
  `
  const md = htmlToMarkdown(html)
  const expected = [
    '# Big Top Header',
    '',
    '### Medium Subtitle',
    '',
    'Standard small text.',
  ].join('\n')

  assert.strictEqual(md, expected)
})

test('HTML to Markdown translates complex nested lists and blockquotes', () => {
  const html = `
    <blockquote>
      <p>This is a quote with a list:</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2 with <strong>bold</strong></li>
      </ul>
    </blockquote>
  `
  const md = htmlToMarkdown(html)
  const expected = [
    '> This is a quote with a list:',
    '> ',
    '> * Item 1',
    '> * Item 2 with **bold**',
  ].join('\n')

  assert.strictEqual(md, expected)
})

test('HTML to Markdown converts tables and extracts property alignments', () => {
  const html = `
    <table>
      <thead>
        <tr>
          <th align="left">Metric</th>
          <th style="text-align: center">Status</th>
          <th align="right">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Uptime</td>
          <td>Operational</td>
          <td>99.9%</td>
        </tr>
        <tr>
          <td>Latency</td>
          <td>Low</td>
          <td>45ms</td>
        </tr>
      </tbody>
    </table>
  `
  const md = htmlToMarkdown(html)
  const expected = [
    '| Metric  |   Status    | Value |',
    '| :------ | :---------: | ----: |',
    '| Uptime  | Operational | 99.9% |',
    '| Latency |     Low     |  45ms |',
  ].join('\n')

  assert.strictEqual(md, expected)
})

test('HTML to Markdown decodes HTML entities', () => {
  const html = '<p>Hello&nbsp;Charles&amp;Natasha! This is &#39;great&#39; &amp; &#x26; fun &ldquo;stuff&rdquo;&zwnj;.</p>'
  const md = htmlToMarkdown(html)
  assert.strictEqual(md, "Hello Charles&Natasha! This is 'great' & & fun “stuff”.")
})

test('HTML to Markdown collapses empty columns/rows and flattens layout tables', () => {
  const html = `
    <table>
      <tr>
        <td></td>
        <td>My nested cell content</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
  `
  const md = htmlToMarkdown(html)
  assert.strictEqual(md, 'My nested cell content')
})
