# @sullux/markdown-compiler

A lightweight, zero-dependency, purely functional Markdown abstract syntax tree (AST) parser, stringifier, and construction DSL.

For full guides, interactive examples, and API references, visit the [official website](https://sullux.com/projects/markdown/markdown-compiler/).

---

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
  * **Hierarchical Lists:** Preserves nested sub-lists and sequence continuity across mixed list types.

## Installation

```bash
yarn add @sullux/markdown-compiler
```

## Quick Example

```javascript
const { parse, stringify, Node } = require('@sullux/markdown-compiler')

// Parse Markdown into an AST
const ast = parse('# Hello World\n\nWelcome to **sullux**.')

// Construct or manipulate AST nodes programmatically
const doc = {
  frontmatter: { title: 'Specification' },
  blocks: [
    Node.header(1, [Node.text('Specification')]),
    Node.paragraph([Node.text('Auditable, zero-dependency Markdown compiler.')]),
  ],
}

// Stringify AST back to Markdown
const markdown = stringify(doc)
console.log(markdown)
```

## Documentation

Full documentation, guides, and complete API specifications are available at:
👉 **[https://sullux.com/projects/markdown/markdown-compiler/](https://sullux.com/projects/markdown/markdown-compiler/)**

## Contributing

Contributions and pull requests are welcome!

### Running Unit Tests

We use the built-in Node.js test runner for zero-dependency test execution:

```bash
# Run tests for this package
yarn test

# Or run tests across all workspace packages from the repository root
yarn workspaces run test
```

### Guidelines

* Pure Vanilla JavaScript only—no build steps or transpilation.
* Maintain zero runtime dependencies.
* Keep files focused and readable ($\le 100$ lines per file where practical).
* Ensure all tests pass with 100% coverage across new functionality.

## License

MIT © 2026 Charles Sullivan / Sullux LLC.
