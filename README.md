# Sullux Markdown Suite

A suite of high-performance, local-first, zero-dependency Vanilla JavaScript packages for parsing, stringifying, converting, and rendering Markdown documents and static documentation websites.

Designed for low cognitive load and strict auditability, the Sullux Markdown Suite provides a clean document processing pipeline with zero external runtime dependencies.

---

## Projects Index

### 1. [@sullux/markdown-compiler](./packages/markdown-compiler/README.md)

A lightweight, purely functional Markdown abstract syntax tree (AST) parser, stringifier, and construction DSL. Handles GFM extensions, frontmatter extraction, code block metadata, callout boxes, task lists, GFM tables, and multi-syntax image dimensions.

#### Quickstart

```javascript
const { parse, stringify, Node } = require('@sullux/markdown-compiler')

// Parse raw Markdown to a structured AST
const ast = parse('# Title\n\nThis is **bold** text.')

// Construct an AST programmatically with Node builders
const doc = {
  blocks: [
    Node.header(1, [Node.text('Sullux Markdown')]),
    Node.paragraph([Node.bold([Node.text('Zero-dependency')]), Node.text(' AST toolchain.')]),
  ],
}

// Compile AST back to clean Markdown
const markdownText = stringify(doc)
```

👉 **[Read full `@sullux/markdown-compiler` Documentation](./packages/markdown-compiler/README.md)**

---

### 2. [@sullux/markdown-html](./packages/markdown-html/README.md)

A high-performance, bidirectional Markdown ↔ HTML compiler. Converts Markdown ASTs directly into semantic HTML with pluggable code block renderers (e.g. `mermaid`), zero-dependency syntax highlighting for common languages (`js`, `json`, `yaml`, `bash`, `html`, `sql`), and inline CSS image dimension styling. Also parses raw HTML back into clean Markdown.

#### Quickstart

```javascript
const { markdownToHtml, htmlToMarkdown } = require('@sullux/markdown-html')

// Convert Markdown to HTML with custom code renderers
const html = markdownToHtml('# Hello\n\n![Diagram|400x200](arch.png)', {
  codeRenderers: {
    mermaid: (node) => `<div class="mermaid">${node.value}</div>\n`,
  },
})

// Convert HTML back to clean GFM Markdown
const markdown = htmlToMarkdown('<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>')
```

👉 **[Read full `@sullux/markdown-html` Documentation](./packages/markdown-html/README.md)**

---

### 3. [@sullux/markdown-docs](./packages/markdown-docs/README.md)

A static documentation site generator that compiles GitBook-style Markdown documentation directories into fast, responsive, searchable HTML websites. Automatically parses `SUMMARY.md` navigation hierarchies, embeds client-side search, handles dark/light theme toggling, and copies static assets.

#### Quickstart (CLI)

```bash
# Generate static HTML site from a docs directory
markdown-docs -i ./docs -o ./_site -t "Project Documentation"
```

#### Quickstart (Programmatic Import)

```javascript
const { generateDocs } = require('@sullux/markdown-docs')

const result = generateDocs({
  input: './docs',
  output: './dist',
  title: 'Sullux API Reference',
})

console.log(`Generated ${result.pageCount} pages at ${result.output}`)
```

👉 **[Read full `@sullux/markdown-docs` Documentation](./packages/markdown-docs/README.md)**

---

## Philosophy & Coding Style

All packages in this repository adhere strictly to our core engineering principles:

* **Zero External Dependencies:** Built using 100% Vanilla JavaScript and Node.js built-ins. All code is fully auditable.
* **Functional Paradigm:** Pure functions and factory wrappers over classes; `const` over `let`; ternary expressions over branching statements. No `this`, no classes.
* **Low Cognitive Overhead:** Simple, readable, self-contained modules designed for fast comprehension and minimal mental context switching.
* **Strict Single-Responsibility Files:** Every source file in this repository is kept concise and strictly **under 100 lines**.

---

## Contributing

We welcome contributions that align with our engineering guidelines.

### Local Development Setup

```bash
# Clone repository
git clone git@github.com:Sullux/markdown.git
cd markdown

# Install workspace dependencies
yarn install

# Run complete unit test suite across all workspace packages
yarn test
```

### Contribution Guidelines

1. **Maintain Zero Dependencies:** Do not add third-party NPM packages without prior review and explicit justification.
2. **File Length Limit:** Keep all JavaScript source files strictly under 100 lines. Split larger modules into subdirectories with clean `index.js` exports.
3. **Vanilla JS & Node.js Test Runner:** Use Node's built-in testing runner (`node --test`) for all unit and integration tests.
4. **Code Formatting:** Follow `.prettierrc` conventions (no semicolons, single quotes, trailing commas).

---

## License

Copyright (c) 2026 Charles Sullivan. Released under the **MIT License**.
