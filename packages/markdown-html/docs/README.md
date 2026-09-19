# Introduction to `markdown-html`

`@sullux/markdown-html` is a high-performance, zero-dependency, bidirectional Markdown $\leftrightarrow$ HTML compiler for JavaScript and Node.js.

Part of the Sullux markdown suite, `@sullux/markdown-html` relies on `@sullux/markdown-compiler` for AST parsing and canonical stringification, delivering auditable, lightweight document transformation with zero external runtime dependencies.

## Key Design Principles

* **Zero External Dependencies:** Built with pure Vanilla JavaScript and Node.js built-ins. Fully auditable and lightweight.
* **Symmetric Bidirectional Transformation:**
  * `markdownToHtml`: Renders AST-driven semantic HTML with custom rendering hooks and syntax highlighting.
  * `htmlToMarkdown`: Parses raw HTML documents, emails, or CMS outputs back into clean, canonical GitHub Flavored Markdown (GFM).
* **Pluggable Architecture:** Register custom code block handlers for diagrams (such as Mermaid or Graphviz) and pluggable language tokenizers.
* **Multi-Syntax Dimension Support:** Automatically converts image dimension annotations across Obsidian, Pandoc, GitHub, and VS Code conventions into inline CSS styles.
* **Rich Markdown Components:** Full support for callout boxes (`> [!NOTE]`, `{% hint %}`), task lists (`- [ ]`, `- [x]`), GFM tables with column alignments, heading ID slugification with collision deduplication, and YAML frontmatter stripping.

## Architecture

`@sullux/markdown-html` operates across two symmetrical pipelines:

### 1. Markdown to HTML
```
Markdown Source
       │
       ▼
@sullux/markdown-compiler (AST)
       │
       ├─► Block Renderer (Headers, Paragraphs, Lists, Tables, Callouts)
       ├─► Inline Renderer (Bold, Italic, Links, Images with Dimensions)
       └─► Syntax Highlighter / Custom Code Block Renderers
       │
       ▼
Semantic HTML Output
```

### 2. HTML to Markdown
```
HTML Source
       │
       ▼
HTML Parser (Tokenizes tags, attributes, entities, styles)
       │
       ▼
AST Builder (Transforms DOM elements to Compiler AST)
       │
       ▼
@sullux/markdown-compiler (Stringifier)
       │
       ▼
Canonical GFM Markdown
```
