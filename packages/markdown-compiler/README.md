# @sullux/markdown-compiler

A lightweight, zero-dependency, purely functional Markdown abstract syntax tree (AST) parser, stringifier, and construction DSL.

Designed around strict local-first, low-overhead principles, `@sullux/markdown-compiler` provides a standard, timeless intermediate document representation between rich sender formats (like HTML or platform-specific messaging APIs) and consumer presentation surfaces (such as web dashboards, GitBook-style documentation servers, or terminal interfaces).

## Core Features

* **Zero Dependencies:** Auditable Vanilla JS implementation with zero external packages.
* **Separation of Document Concerns:** Pure AST focus—no visual or style concerns.
* **Declarative Node Builder DSL:** Construct valid AST documents programmatically via `Node.*` factories.
* **Rich GFM & GitBook Syntax Support:**
  * **YAML Frontmatter:** Extracted into a top-level `frontmatter` object.
  * **Code Block Metadata:** Parses `language` and `languageMetadata` (e.g. ```` ```js title="app.js" ````).
  * **Multi-Syntax Image Dimensions:** Parses image sizes across Obsidian (`![alt|400x200](url)`), Pandoc/GitLab (`![alt](url){width=50%}`), GitHub (`![alt](url){:width="400px"}`), and VS Code (`![alt](url =300x200)`). Bare numbers automatically resolve to `px`.
  * **Callout Boxes:** GitHub callouts (`> [!NOTE]`) and GitBook liquid blocks (`{% hint style="info" %}`).
  * **Task Lists:** Checkbox items (`- [ ]`, `- [x]`).
  * **GFM Tables:** Column alignments (`left`, `center`, `right`, `default`).
  * **Wikilinks & Strikethrough:** `[[target|display]]` and `~~strikethrough~~`.

## Folder Topography

```
packages/markdown-compiler/
├── lib/
│   ├── nodes.js            # AST node builder DSL factories
│   ├── parser/             # Linear-time block and inline tokenizers (<100 lines each)
│   │   ├── index.js
│   │   ├── frontmatter.js
│   │   ├── parse-blocks.js
│   │   ├── block-matchers.js
│   │   ├── inline.js
│   │   ├── inline-tags.js
│   │   ├── inline-links.js
│   │   ├── image.js
│   │   └── table.js
│   └── stringify/          # Recursive AST-to-Markdown compiler modules
│       ├── index.js
│       ├── blocks.js
│       ├── inline.js
│       └── table.js
├── index.js                # Package entrypoint
└── package.json            # Package manifest
```

## Programmatic Usage

### 1. Parsing Markdown to AST

```javascript
const { parse } = require('@sullux/markdown-compiler')

const markdown = `---
title: System Architecture
---

# Overview

Refer to [[DESIGN.md|Design Spec]] and check the diagram:

![Architecture|400x200](arch.png)

\`\`\`js title="server.js"
const server = createServer();
\`\`\`
`

const ast = parse(markdown)
console.log(ast.frontmatter) // { title: "System Architecture" }
console.log(ast.blocks[1].children[0]) // image node with width: "400px", height: "200px"
console.log(ast.blocks[2]) // codeBlock node with language: "js", languageMetadata: 'title="server.js"'
```

### 2. Generating Markdown with the Builder DSL

```javascript
const { Node, stringify } = require('@sullux/markdown-compiler')

const doc = {
  frontmatter: { title: 'Coms Protocol' },
  blocks: [
    Node.header(1, [Node.text('Coms Platform')]),
    Node.paragraph([
      Node.text('Uses '),
      Node.bold([Node.text('zero-dependency')]),
      Node.text(' architecture.'),
    ]),
  ],
}

const markdown = stringify(doc)
console.log(markdown)
```

## Running Unit Tests

```bash
yarn test
```
