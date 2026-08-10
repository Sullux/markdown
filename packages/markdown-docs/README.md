# @sullux/markdown-docs

A zero-dependency, local-first static documentation website generator compiling GitBook-style Markdown documentation folders into fast, responsive, searchable HTML websites.

Built on `@sullux/markdown-compiler` and `@sullux/markdown-html`, `@sullux/markdown-docs` operates as both a standalone CLI application and a Node.js library.

## Core Features

* **GitBook `SUMMARY.md` Support:** Automatically parses `SUMMARY.md` navigation lists into sidebar navigation menus (with auto-discovery fallback if `SUMMARY.md` is omitted).
* **Zero Dependencies:** Pure Vanilla JS implementation with zero external packages.
* **Client-Side Search:** Auto-generates a lightweight JSON search index and embedded client-side search UI.
* **Responsive Layout:** Clean GitBook-inspired UI with collapsible sidebar navigation, dark/light theme toggle, and mobile support.
* **Rich Component Support:** Supports all `@sullux/markdown-html` features including code syntax highlighting, callout boxes (`> [!NOTE]`, `{% hint %}`), GFM tables, and custom image dimensions.
* **Static Asset Copying:** Automatically copies non-markdown assets (PNGs, SVGs, PDFs) directly to the output directory.

## Installation & CLI Usage

```bash
# Global installation or via npx
npm install -g @sullux/markdown-docs

# Generate site from a docs directory
markdown-docs -i ./docs -o ./_site -t "Project Documentation"
```

### CLI Options

| Flag | Long Flag | Description | Default |
| :--- | :--- | :--- | :--- |
| `-i` | `--input` | Input Markdown docs directory | Current working directory |
| `-o` | `--output` | Output directory | `<input>/_site` |
| `-t` | `--title` | Documentation site title | Directory name |
| | `--baseUrl` | Base URL prefix for links | `""` |
| `-h` | `--help` | Display CLI help menu | |

## Programmatic API Usage

```javascript
const { generateSite } = require('@sullux/markdown-docs')

const result = generateSite({
  input: './docs',
  output: './dist',
  title: 'Sullux API Docs',
})

console.log(`Generated ${result.pageCount} pages at ${result.output}`)
```

## Folder Topography

```
packages/markdown-docs/
├── bin/
│   └── cli.js            # Executable CLI entrypoint
├── lib/
│   ├── config.js         # Option and CLI argument parser
│   ├── summary.js        # SUMMARY.md parser and directory scanner
│   ├── layout.js         # Responsive HTML page template generator
│   ├── theme.js          # Embedded GitBook CSS styles
│   ├── search.js         # Client-side search index and JS script
│   ├── assets.js         # Static asset copy utility
│   └── site.js           # Site generation coordinator
├── index.js              # Package API entrypoint
└── package.json          # Package manifest
```

## Running Unit Tests

```bash
yarn test
```
