const { test } = require('node:test')
const assert = require('node:assert')
const { parse, stringify, Node } = require('../index')

test('Node builders create valid AST structures', () => {
  const text = Node.text('Hello World')
  assert.strictEqual(text.type, 'text')
  assert.strictEqual(text.value, 'Hello World')

  const header = Node.header(1, [text])
  assert.strictEqual(header.type, 'header')
  assert.strictEqual(header.level, 1)
  assert.strictEqual(header.children[0].value, 'Hello World')

  const code = Node.codeBlock('javascript', 'const x = 1;')
  assert.strictEqual(code.type, 'codeBlock')
  assert.strictEqual(code.language, 'javascript')
  assert.strictEqual(code.value, 'const x = 1;')
})

test('stringify compiles AST with frontmatter and tables', () => {
  const ast = {
    frontmatter: {
      title: 'Coms Spec',
      tags: ['sullux', 'local-first'],
      active: true,
      year: 2026,
    },
    blocks: [
      Node.header(1, [Node.text('My Document')]),
      Node.paragraph([
        Node.text('Refer to '),
        Node.wikilink('EVENTS.md'),
        Node.text(' or '),
        Node.wikilink('PLANNING.md', 'Plan'),
        Node.text('.'),
      ]),
      Node.table(
        ['default', 'center', 'right'],
        [
          [Node.text('Item'), Node.text('Qty'), Node.text('Cost')],
          [Node.text('Relay'), Node.text('1'), Node.text('$100')],
          [Node.text('Modem Board'), Node.text('2'), Node.text('$50')],
        ]
      ),
    ],
  }

  const output = stringify(ast)
  assert.ok(output.includes('title: Coms Spec'))
  assert.ok(output.includes('tags: [sullux, local-first]'))
  assert.ok(output.includes('# My Document'))
  assert.ok(output.includes('| Item        | Qty | Cost |'))
  assert.ok(output.includes('| ----------- | :-: | ---: |'))
})

test('parse extracts structured AST, frontmatter, and tables', () => {
  const mdInput = `---
title: Test Doc
author: Charles
---

# Title

Paragraph with **bold** and *italic* text.

| Left | Center | Right |
| :--- | :----: | ----: |
| A1   |   B1   |    C1 |
| A2   |   B2   |    C2 |

> Quoted paragraph with **bold**
`

  const ast = parse(mdInput)

  assert.strictEqual(ast.frontmatter.title, 'Test Doc')
  assert.strictEqual(ast.frontmatter.author, 'Charles')

  assert.strictEqual(ast.blocks[0].type, 'header')
  assert.strictEqual(ast.blocks[0].children[0].value, 'Title')

  assert.strictEqual(ast.blocks[1].type, 'paragraph')
  assert.strictEqual(ast.blocks[1].children[1].type, 'bold')

  assert.strictEqual(ast.blocks[2].type, 'table')
  assert.strictEqual(ast.blocks[2].alignments[0], 'left')
  assert.strictEqual(ast.blocks[2].alignments[1], 'center')
  assert.strictEqual(ast.blocks[2].alignments[2], 'right')
  assert.strictEqual(ast.blocks[2].rows[1][0][0].value, 'A1')
  assert.strictEqual(ast.blocks[2].rows[1][1][0].value, 'B1')

  assert.strictEqual(ast.blocks[3].type, 'blockquote')
  assert.strictEqual(ast.blocks[3].children[0].type, 'paragraph')
  assert.strictEqual(ast.blocks[3].children[0].children[1].type, 'bold')
})

test('round-trip markdown parsing and stringification has parity', () => {
  const mdInput = [
    '---',
    'title: Sullux LLC',
    'tags: [consulting, system]',
    '---',
    '',
    '# Sullux LLC',
    '',
    'Our consultancy services include custom local-first architectures.',
    '',
    '## Our Values',
    '',
    '* Zero dependencies',
    '* Fully auditable codebases',
    '',
    '| Value | Importance |',
    '| :---- | ---------: |',
    '| Trust |       High |',
    '| Speed |  Essential |',
  ].join('\n')

  const ast = parse(mdInput)
  const mdOutput = stringify(ast)

  assert.strictEqual(mdOutput, mdInput)
})

test('parse correctly parses nested images inside link anchors', () => {
  const md = '[![Atlassian](image_url)](link_url)'
  const ast = parse(md)

  assert.strictEqual(ast.blocks.length, 1)
  assert.strictEqual(ast.blocks[0].type, 'paragraph')

  const linkNode = ast.blocks[0].children[0]
  assert.strictEqual(linkNode.type, 'link')
  assert.strictEqual(linkNode.url, 'link_url')

  const imageNode = linkNode.children[0]
  assert.strictEqual(imageNode.type, 'image')
  assert.strictEqual(imageNode.url, 'image_url')
  assert.strictEqual(imageNode.alt, 'Atlassian')
})

test('code blocks extract language and languageMetadata', () => {
  const md = '```md github title="example.md"\n# Hello World\n```'
  const ast = parse(md)

  assert.strictEqual(ast.blocks.length, 1)
  const codeBlock = ast.blocks[0]
  assert.strictEqual(codeBlock.type, 'codeBlock')
  assert.strictEqual(codeBlock.language, 'md')
  assert.strictEqual(codeBlock.languageMetadata, 'github title="example.md"')
})

test('nested bullet lists preserve indentation and depth', () => {
  const md = [
    '* Item 1',
    '  * Sub-item 1.1',
    '    * Sub-item 1.1.1',
    '* Item 2',
  ].join('\n')

  const ast = parse(md)
  assert.strictEqual(ast.blocks[0].type, 'bulletList')
  assert.strictEqual(ast.blocks[0].children.length, 2)

  // Item 1 contains paragraph and nested bulletList
  const item1 = ast.blocks[0].children[0]
  assert.strictEqual(item1.type, 'listItem')
  assert.strictEqual(item1.children[0].type, 'paragraph')
  assert.strictEqual(item1.children[0].children[0].value, 'Item 1')

  const subList1 = item1.children[1]
  assert.strictEqual(subList1.type, 'bulletList')
  assert.strictEqual(subList1.children[0].type, 'listItem')
  assert.strictEqual(subList1.children[0].children[0].children[0].value, 'Sub-item 1.1')

  const subSubList = subList1.children[0].children[1]
  assert.strictEqual(subSubList.type, 'bulletList')
  assert.strictEqual(subSubList.children[0].children[0].children[0].value, 'Sub-item 1.1.1')

  // Item 2
  const item2 = ast.blocks[0].children[1]
  assert.strictEqual(item2.type, 'listItem')
  assert.strictEqual(item2.children[0].children[0].value, 'Item 2')
})

test('ordered list with nested bullet sub-list preserves single list block and continuation numbering', () => {
  const md = [
    '1. Streaming & Chunking',
    '2. Pre-processing',
    '3. Summarization via MapReduce',
    '    * Map',
    '    * Reduce',
    '4. LLM Integration',
  ].join('\n')

  const ast = parse(md)
  assert.strictEqual(ast.blocks.length, 1)
  assert.strictEqual(ast.blocks[0].type, 'orderedList')
  assert.strictEqual(ast.blocks[0].children.length, 4)

  const items = ast.blocks[0].children
  assert.strictEqual(items[0].children[0].children[0].value, 'Streaming & Chunking')
  assert.strictEqual(items[1].children[0].children[0].value, 'Pre-processing')

  // Item 3 has paragraph and nested bullet list
  assert.strictEqual(items[2].children[0].children[0].value, 'Summarization via MapReduce')
  const nestedList = items[2].children[1]
  assert.strictEqual(nestedList.type, 'bulletList')
  assert.strictEqual(nestedList.children.length, 2)
  assert.strictEqual(nestedList.children[0].children[0].children[0].value, 'Map')
  assert.strictEqual(nestedList.children[1].children[0].children[0].value, 'Reduce')

  assert.strictEqual(items[3].children[0].children[0].value, 'LLM Integration')

  const stringified = stringify(ast)
  assert.ok(stringified.includes('1. Streaming & Chunking'))
  assert.ok(stringified.includes('* Map'))
  assert.ok(stringified.includes('* Reduce'))
  assert.ok(stringified.includes('4. LLM Integration'))
})

test('ordered list with nested bullet sub-lists separates items and maintains nested hierarchy', () => {
  const md = [
    '1. first item',
    '  - sub 1',
    '  - sub 2',
    '2. second item',
    '  - sub 1',
    '  - sub 2',
  ].join('\n')

  const ast = parse(md)
  assert.strictEqual(ast.blocks.length, 1)
  assert.strictEqual(ast.blocks[0].type, 'orderedList')
  assert.strictEqual(ast.blocks[0].children.length, 2)

  assert.strictEqual(ast.blocks[0].children[0].children[0].children[0].value, 'first item')
  assert.strictEqual(ast.blocks[0].children[0].children[1].type, 'bulletList')
  assert.strictEqual(ast.blocks[0].children[0].children[1].children.length, 2)

  assert.strictEqual(ast.blocks[0].children[1].children[0].children[0].value, 'second item')
  assert.strictEqual(ast.blocks[0].children[1].children[1].type, 'bulletList')
  assert.strictEqual(ast.blocks[0].children[1].children[1].children.length, 2)
})

test('image dimension parsing supports Obsidian, Pandoc/Gitlab, GitHub, and VS Code syntaxes', () => {
  const obs1 = parse('![Diagram|400x200](schema.png)')
  assert.strictEqual(obs1.blocks[0].children[0].width, '400px')
  assert.strictEqual(obs1.blocks[0].children[0].height, '200px')

  const obs2 = parse('![Diagram|300](schema.png)')
  assert.strictEqual(obs2.blocks[0].children[0].width, '300px')
  assert.strictEqual(obs2.blocks[0].children[0].height, undefined)

  const pandoc = parse('![Diagram](schema.png){width=50% height=200px}')
  assert.strictEqual(pandoc.blocks[0].children[0].width, '50%')
  assert.strictEqual(pandoc.blocks[0].children[0].height, '200px')

  const github = parse('![Diagram](schema.png){:width="400px"}')
  assert.strictEqual(github.blocks[0].children[0].width, '400px')

  const vscode = parse('![Diagram](schema.png =300x150)')
  assert.strictEqual(vscode.blocks[0].children[0].width, '300px')
  assert.strictEqual(vscode.blocks[0].children[0].height, '150px')
})

test('HTML block parsing preserves raw block HTML elements', () => {
  const md = '<p align="center">\n  <img src="logo.svg" alt="Logo" width="160" height="160" />\n</p>\n\n# Heading'
  const ast = parse(md)

  assert.strictEqual(ast.blocks.length, 2)
  assert.strictEqual(ast.blocks[0].type, 'html')
  assert.ok(ast.blocks[0].value.includes('<p align="center">'))
  assert.ok(ast.blocks[0].value.includes('</p>'))
  assert.strictEqual(ast.blocks[1].type, 'header')

  const stringified = stringify(ast)
  assert.ok(stringified.includes('<p align="center">'))
  assert.ok(stringified.includes('# Heading'))
})

test('math parsing - inlineMath and mathBlock with round-trip stringification', () => {
  const inlineMd = 'The equation $E = mc^2$ is famous.'
  const inlineAst = parse(inlineMd)
  assert.strictEqual(inlineAst.blocks[0].children[1].type, 'inlineMath')
  assert.strictEqual(inlineAst.blocks[0].children[1].value, 'E = mc^2')
  assert.strictEqual(stringify(inlineAst).trim(), inlineMd)

  const blockMd = '$$\n\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$'
  const blockAst = parse(blockMd)
  assert.strictEqual(blockAst.blocks[0].type, 'mathBlock')
  assert.strictEqual(blockAst.blocks[0].value, '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}')
  assert.strictEqual(stringify(blockAst).trim(), blockMd)

  const singleBlockMd = '$$E = mc^2$$'
  const singleBlockAst = parse(singleBlockMd)
  assert.strictEqual(singleBlockAst.blocks[0].type, 'mathBlock')
  assert.strictEqual(singleBlockAst.blocks[0].value, 'E = mc^2')
  assert.strictEqual(stringify(singleBlockAst).trim(), '$$\nE = mc^2\n$$')

  const codeMathMd = '```math\n\\int_0^1 x dx\n```'
  const codeMathAst = parse(codeMathMd)
  assert.strictEqual(codeMathAst.blocks[0].type, 'codeBlock')
  assert.strictEqual(codeMathAst.blocks[0].language, 'math')
})

test('math parsing - avoids false positives on currency and escaped symbols', () => {
  const currencyMd = 'Cost is $10 and profit is $20.'
  const currencyAst = parse(currencyMd)
  const hasMath = currencyAst.blocks[0].children.some((c) => c.type === 'inlineMath')
  assert.strictEqual(hasMath, false)

  const singleDollarMd = 'It costs $5.'
  const singleDollarAst = parse(singleDollarMd)
  const hasSingleMath = singleDollarAst.blocks[0].children.some((c) => c.type === 'inlineMath')
  assert.strictEqual(hasSingleMath, false)

  const escapedMd = 'Here is \\$not math\\$.'
  const escapedAst = parse(escapedMd)
  const hasEscapedMath = escapedAst.blocks[0].children.some((c) => c.type === 'inlineMath')
  assert.strictEqual(hasEscapedMath, false)
})

test('stringify - thematic breaks, inline html, titles, code spans, callout titles, and loose lists', () => {
  // 1. Thematic break
  const hrAst = { blocks: [{ type: 'hr' }] }
  assert.strictEqual(stringify(hrAst).trim(), '---')

  // 2. Inline HTML without extra newlines
  const inlineHtmlAst = parse('Hello <b>world</b>!')
  assert.strictEqual(stringify(inlineHtmlAst).trim(), 'Hello <b>world</b>!')

  // 3. Link and Image titles
  const linkAst = parse('[example](https://example.com "title")')
  assert.strictEqual(stringify(linkAst).trim(), '[example](https://example.com "title")')
  const imgAst = parse('![alt](img.png "img title")')
  assert.strictEqual(stringify(imgAst).trim(), '![alt](img.png "img title")')

  // 4. Code spans containing backticks
  const codeSpanAst = parse('`` `foo` ``')
  assert.strictEqual(stringify(codeSpanAst).trim(), '`` `foo` ``')

  // 5. Code block containing triple backticks
  const codeBlockNode = { type: 'codeBlock', language: 'markdown', value: '```js\nconst x = 1\n```' }
  const codeBlockStr = stringify({ blocks: [codeBlockNode] }).trim()
  assert.ok(codeBlockStr.startsWith('````markdown'))
  assert.ok(codeBlockStr.endsWith('````'))

  // 6. Callout with title
  const calloutNode = Node.callout('note', 'Custom Title', [Node.paragraph([Node.text('Body text.')])])
  assert.ok(stringify({ blocks: [calloutNode] }).includes('> [!NOTE] Custom Title'))

  // 7. Loose list formatting
  const looseListAst = {
    blocks: [
      Node.bulletList([
        Node.listItem([Node.paragraph([Node.text('item 1')])]),
        Node.listItem([Node.paragraph([Node.text('item 2')])]),
      ], false),
    ],
  }
  const looseStr = stringify(looseListAst).trim()
  assert.strictEqual(looseStr, '* item 1\n\n* item 2')

  // 8. Multi-paragraph list item
  const multiParaItem = {
    blocks: [
      Node.bulletList([
        Node.listItem([
          Node.paragraph([Node.text('first para')]),
          Node.paragraph([Node.text('second para')]),
        ]),
      ], false),
    ],
  }
  const multiStr = stringify(multiParaItem).trim()
  assert.strictEqual(multiStr, '* first para\n\n  second para')

  // 9. Checklist round-trip
  const checklistMd = '* [x] task done\n* [ ] task todo'
  const checklistAst = parse(checklistMd)
  assert.strictEqual(stringify(checklistAst).trim(), checklistMd)
})

