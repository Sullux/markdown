<p align="center">
  <img src="docs/logo.svg" alt="Markdown Slides" width="160" height="160" />
</p>

# @sullux/markdown-slides

A zero-dependency, local-first presentation slide deck generator compiling Markdown directories into responsive, modular, template-driven HTML slide presentations.

📖 **Official Documentation:** [https://sullux.com/projects/markdown/markdown-slides/](https://sullux.com/projects/markdown/markdown-slides/)

## Overview

Built on `@sullux/markdown-compiler` and `@sullux/markdown-html`, `@sullux/markdown-slides` compiles directories of Markdown files and sub-decks into self-contained presentation experiences. It operates both as a standalone CLI utility and as an embeddable Node.js library.

It features composable slide templates, intuitive partition-based layouts, stepped transitions (fragments), multi-level deck hierarchies with reusable sub-decks, native KaTeX math rendering, Mermaid diagram integration, responsive 16:9 / 4:3 viewports, keyboard-driven presentation controls, and print-to-PDF export.

## Quick Start

### Installation

```bash
yarn add @sullux/markdown-slides
# or install globally
yarn global add @sullux/markdown-slides
```

### Usage (CLI)

```bash
# Generate static presentation from a slides directory
markdown-slides -i ./slides -o ./_slides -t "Quarterly Architecture Review"
```

### Usage (Programmatic)

```javascript
const { buildDeck } = require('@sullux/markdown-slides')

const result = buildDeck({
  input: './slides',
  output: './dist/slides',
  title: 'Quarterly Architecture Review',
})

console.log(`Generated ${result.slideCount} slides at ${result.output}`)
```

For complete guides, template documentation, and configuration options, see the [official documentation](https://sullux.com/projects/markdown/markdown-slides/).

## Contributing & License

Please see the [Monorepo README](../../README.md) for contribution guidelines, testing instructions, and license details.
