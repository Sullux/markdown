# Quick Start

Get started with `@sullux/markdown-compiler` in your Node.js or JavaScript project.

## Installation

Install the package via Yarn or NPM:

```bash
yarn add @sullux/markdown-compiler
```

Or using NPM:

```bash
npm install @sullux/markdown-compiler
```

## Basic Usage

### Parsing Markdown to an AST

```javascript
const { parse } = require('@sullux/markdown-compiler')

const source = `---
title: Getting Started
author: Natasha
---

# Hello World

This is a **markdown** document with an image:

![Logo|200x50](logo.png)
`

const ast = parse(source)

console.log(ast.frontmatter)
// { title: 'Getting Started', author: 'Natasha' }

console.log(ast.blocks[0])
// { type: 'header', level: 1, children: [ { type: 'text', value: 'Hello World' } ] }
```

### Stringifying an AST to Markdown

```javascript
const { stringify, Node } = require('@sullux/markdown-compiler')

const ast = {
  frontmatter: { title: 'Generated Spec' },
  blocks: [
    Node.header(1, [Node.text('System Spec')]),
    Node.paragraph([
      Node.text('This document was generated using '),
      Node.bold([Node.text('markdown-compiler')]),
      Node.text('.'),
    ]),
  ],
}

const markdown = stringify(ast)
console.log(markdown)
```

Output:

```markdown
---
title: Generated Spec
---

# System Spec

This document was generated using **markdown-compiler**.
```
