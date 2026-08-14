# Introduction to `markdown-docs`

`@sullux/markdown-docs` is a zero-dependency, local-first static documentation website generator. It compiles GitBook-style Markdown documentation folders into fast, responsive, searchable HTML websites.

> **Note:** In fact, the site you are looking at right now was compiled by the `markdown-docs` CLI!

## Key Design Principles

* **Zero Third-Party Dependencies:** Built entirely with Vanilla JavaScript and Node.js built-ins.
* **Local-First Architecture:** All assets, search indexes, scripts, and stylesheets are self-contained and bundled directly into static HTML output.
* **Low Cognitive Load:** Intuitive 3-column GitBook layout featuring sticky navigation, search bar, and page outline.
* **Declarative Configuration:** Simple YAML configurations supporting multi-channel priorities, dual light/dark themes, custom logos, and external navigation links.

## How It Works

`@sullux/markdown-docs` scans your documentation directory for Markdown files and a `SUMMARY.md` navigation file. It parses AST structures using `@sullux/markdown-compiler`, translates content to HTML via `@sullux/markdown-html`, and wraps pages in a responsive template with client-side search and dual-theme switching.
