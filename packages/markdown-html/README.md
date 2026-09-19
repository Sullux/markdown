<p align="center">
  <img src="docs/logo.svg" alt="Markdown HTML" width="160" height="160" />
</p>

# @sullux/markdown-html

A high-performance, zero-dependency, bidirectional Markdown ↔ HTML compiler supporting GitHub-Flavored Markdown (GFM), GitBook hints, pluggable code block renderers, built-in syntax highlighting, and custom image dimensions.

📖 **Official Documentation:** [https://sullux.com/projects/markdown/markdown-html/](https://sullux.com/projects/markdown/markdown-html/)

## Overview

Part of the Sullux markdown suite, `@sullux/markdown-html` relies on `@sullux/markdown-compiler` to deliver fast, bidirectional conversion between Markdown and clean, semantic HTML. It transforms Markdown ASTs into HTML with auto-slugified heading IDs, callout boxes, task lists, GFM tables, and multi-syntax image dimensions styled as inline CSS. It also parses arbitrary HTML documents, emails, or CMS content back into canonical GFM Markdown with style normalization and layout table flattening.

Key capabilities include pluggable code block renderers for diagrams (such as Mermaid or Graphviz) and zero-dependency compile-time syntax highlighting for common languages (`js`, `json`, `yaml`, `bash`, `html`, `sql`).

## Quick Start

### Installation

```bash
yarn add @sullux/markdown-html
```

### Usage

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

For complete guides, syntax highlighting details, and full API specifications, see the [official documentation](https://sullux.com/projects/markdown/markdown-html/).

## Contributing & License

Please see the [Monorepo README](../../README.md) for contribution guidelines, testing instructions, and license details.
