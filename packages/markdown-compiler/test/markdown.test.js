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
