# @sullux/markdown-compiler

A lightweight, zero-dependency, purely functional Markdown abstract syntax tree (AST) parser, stringifier, and construction DSL for JavaScript and Node.js.

📖 **Official Documentation:** [https://sullux.com/projects/markdown/markdown-compiler/](https://sullux.com/projects/markdown/markdown-compiler/)

## Overview

Designed around strict local-first, low-overhead principles, `@sullux/markdown-compiler` provides a standard, timeless intermediate document representation between rich sender formats (such as HTML or platform-specific messaging APIs) and consumer presentation surfaces (such as web dashboards, static documentation sites, or terminal interfaces).

It features symmetric round-trip conversion between Markdown text and a clean, two-level AST, a declarative `Node.*` builder DSL for programmatic document construction, and comprehensive support for GitHub Flavored Markdown (GFM) tables, task lists, callout boxes, YAML frontmatter, code block metadata, and multi-syntax image dimensions.

## Quick Start

### Installation

```bash
yarn add @sullux/markdown-compiler
```

### Usage

```javascript
const { parse, stringify, Node } = require('@sullux/markdown-compiler')

// Parse raw Markdown into a structured AST
const ast = parse('# Hello World\n\nWelcome to **sullux**.')

// Construct or manipulate AST nodes programmatically
const doc = {
  frontmatter: { title: 'Specification' },
  blocks: [
    Node.header(1, [Node.text('Specification')]),
    Node.paragraph([Node.text('Auditable, zero-dependency Markdown compiler.')]),
  ],
}

// Compile AST back to clean Markdown
const markdown = stringify(doc)
console.log(markdown)
```

For complete guides, interactive examples, and full API specifications, see the [official documentation](https://sullux.com/projects/markdown/markdown-compiler/).

## Contributing & License

Please see the [Monorepo README](../../README.md) for contribution guidelines, testing instructions, and license details.
