# Introduction to `markdown-compiler`

`@sullux/markdown-compiler` is a lightweight, zero-dependency, purely functional Markdown abstract syntax tree (AST) parser, stringifier, and construction DSL for JavaScript and Node.js.

Designed around strict local-first, low-overhead principles, `@sullux/markdown-compiler` provides a standard, timeless intermediate document representation between rich sender formats (such as HTML or platform-specific messaging APIs) and consumer presentation surfaces (such as web dashboards, GitBook-style documentation servers, or terminal interfaces).

## Key Design Principles

* **Zero Dependencies:** Auditable Vanilla JS implementation with zero third-party packages or runtime bloat.
* **Separation of Document Concerns:** Pure AST focus—no presentation, CSS, or styling concerns.
* **Symmetric Round-Trip Parity:** Parses Markdown to an AST, and compiles an AST back to Markdown with structural fidelity.
* **Declarative Node Builder DSL:** Construct valid AST documents programmatically using pure `Node.*` factories without manual JSON wrangling.
* **Rich Syntax Support:** Comprehensive coverage of GitHub Flavored Markdown (GFM), GitBook hint blocks, multi-syntax image dimensions, callout boxes, and task lists.

## Architecture

The compiler decomposes Markdown into a clean two-level tree:

```
Document
├── frontmatter: Object (YAML metadata)
└── blocks: Array of Block Nodes
    ├── header (level, children)
    ├── paragraph (children)
    ├── bulletList (items: Array of Inline Nodes, with indent, depth, listType)
    ├── orderedList (items: Array of Inline Nodes, with indent, depth, listType, order)
    ├── codeBlock (language, languageMetadata, value)
    ├── blockquote (children)
    ├── callout (style, children)
    ├── table (alignments, rows)
    └── hr
```

Each block contains inline children representing spans of text, formatting, links, and media.
