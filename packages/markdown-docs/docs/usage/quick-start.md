# Quick Start

Get your static documentation site up and running in seconds with `@sullux/markdown-docs`.

## Installation

Run `@sullux/markdown-docs` directly using `npx` or install it globally:

```bash
# Global installation via npm
npm i -g @sullux/markdown-docs

# Global installation via yarn
yarn global add @sullux/markdown-docs

# Or run instantly via npx
npx @sullux/markdown-docs -i ./docs -o ./_site
```

## Basic Compilation

To compile a documentation directory into a static HTML website:

```bash
markdown-docs -i ./my-docs -o ./_site
```

This command scans `./my-docs` for Markdown source files and `SUMMARY.md`, applies your `docs.yaml` configuration, bundles static assets (PNGs, SVGs), and outputs a complete, responsive site into `./_site`.
