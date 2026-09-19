<p align="center">
  <img src="logo.svg" alt="Sullux Markdown Suite" width="160" height="160" />
</p>

# Sullux Markdown Suite

A suite of high-performance, local-first, zero-dependency Vanilla JavaScript packages for parsing, stringifying, converting, and rendering Markdown documents and static documentation websites.

Designed for low cognitive load and strict auditability, the Sullux Markdown Suite provides a clean document processing pipeline with zero external runtime dependencies.

🌐 **Official Website:** [https://sullux.com/projects/markdown](https://sullux.com/projects/markdown)

---

## Projects Index

### 1. [@sullux/markdown-compiler](./packages/markdown-compiler/README.md)

Designed around strict local-first, low-overhead principles, `@sullux/markdown-compiler` provides a standard, timeless intermediate document representation between rich sender formats (such as HTML or platform-specific messaging APIs) and consumer presentation surfaces (such as web dashboards, static documentation sites, or terminal interfaces).

It features symmetric round-trip conversion between Markdown text and a clean, two-level AST, a declarative `Node.*` builder DSL for programmatic document construction, and comprehensive support for GitHub Flavored Markdown (GFM) tables, task lists, callout boxes, YAML frontmatter, code block metadata, and multi-syntax image dimensions.

#### Quick Start

##### Installation

```bash
yarn add @sullux/markdown-compiler
```

##### Usage

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

📖 **[Read `@sullux/markdown-compiler` Documentation](https://sullux.com/projects/markdown/markdown-compiler/)**

---

### 2. [@sullux/markdown-html](./packages/markdown-html/README.md)

Part of the Sullux markdown suite, `@sullux/markdown-html` relies on `@sullux/markdown-compiler` to deliver fast, bidirectional conversion between Markdown and clean, semantic HTML. It transforms Markdown ASTs into HTML with auto-slugified heading IDs, callout boxes, task lists, GFM tables, and multi-syntax image dimensions styled as inline CSS. It also parses arbitrary HTML documents, emails, or CMS content back into canonical GFM Markdown with style normalization and layout table flattening.

Key capabilities include pluggable code block renderers for diagrams (such as Mermaid or Graphviz) and zero-dependency compile-time syntax highlighting for common languages (`js`, `json`, `yaml`, `bash`, `html`, `sql`).

#### Quick Start

##### Installation

```bash
yarn add @sullux/markdown-html
```

##### Usage

```javascript
const { markdownToHtml, htmlToMarkdown } = require('@sullux/markdown-html')

// Convert Markdown to semantic HTML with custom code renderers
const html = markdownToHtml('# Hello\n\n![Diagram|400x200](arch.png)', {
  codeRenderers: {
    mermaid: (node) => `<div class="mermaid">${node.value}</div>\n`,
  },
})

// Convert HTML back to clean GFM Markdown
const markdown = htmlToMarkdown('<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>')
```

📖 **[Read `@sullux/markdown-html` Documentation](https://sullux.com/projects/markdown/markdown-html/)**

---

### 3. [@sullux/markdown-docs](./packages/markdown-docs/README.md)

Built on `@sullux/markdown-compiler` and `@sullux/markdown-html`, `@sullux/markdown-docs` compiles directories of Markdown files into production-ready static documentation sites with zero third-party dependencies. It operates both as a standalone CLI utility and as a Node.js library.

It features automatic `SUMMARY.md` navigation hierarchy parsing, embedded client-side search, a responsive 3-column layout with mobile navigation drawers, native dual light/dark themes with system preference tracking and toggle persistence, static asset bundling, and declarative `docs.yaml` site configuration.

#### Quick Start

##### Installation

```bash
yarn add @sullux/markdown-docs
# or install globally
yarn global add @sullux/markdown-docs
```

##### Usage (CLI)

```bash
# Generate static HTML site from a docs directory
markdown-docs -i ./docs -o ./_site -t "Project Documentation"
```

##### Usage (Programmatic)

```javascript
const { generateSite } = require('@sullux/markdown-docs')

const result = generateSite({
  input: './docs',
  output: './dist',
  baseUrl: '/docs',
})

console.log(`Generated ${result.pageCount} pages at ${result.output}`)
```

📖 **[Read `@sullux/markdown-docs` Documentation](https://sullux.com/projects/markdown/markdown-docs/)**

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
