# @sullux/markdown-docs

A zero-dependency, local-first static documentation website generator compiling GitBook-style Markdown documentation folders into fast, responsive, searchable HTML websites.

📖 **Official Documentation:** [https://sullux.com/projects/markdown/markdown-docs/](https://sullux.com/projects/markdown/markdown-docs/)

## Overview

Built on `@sullux/markdown-compiler` and `@sullux/markdown-html`, `@sullux/markdown-docs` compiles directories of Markdown files into production-ready static documentation sites with zero third-party dependencies. It operates both as a standalone CLI utility and as a Node.js library.

It features automatic `SUMMARY.md` navigation hierarchy parsing, embedded client-side search, a responsive 3-column layout with mobile navigation drawers, native dual light/dark themes with system preference tracking and toggle persistence, static asset bundling, and declarative `docs.yaml` site configuration.

## Quick Start

### Installation

```bash
yarn add @sullux/markdown-docs
# or install globally
yarn global add @sullux/markdown-docs
```

### Usage (CLI)

```bash
# Generate static HTML site from a docs directory
markdown-docs -i ./docs -o ./_site -t "Project Documentation"
```

### Usage (Programmatic)

```javascript
const { generateSite } = require('@sullux/markdown-docs')

const result = generateSite({
  input: './docs',
  output: './dist',
  baseUrl: '/docs',
})

console.log(`Generated ${result.pageCount} pages at ${result.output}`)
```

For complete guides, configuration options, and CLI references, see the [official documentation](https://sullux.com/projects/markdown/markdown-docs/).

## Contributing & License

Please see the [Monorepo README](../../README.md) for contribution guidelines, testing instructions, and license details.
