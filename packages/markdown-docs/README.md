# @sullux/markdown-docs

A zero-dependency, local-first static documentation website generator compiling GitBook-style Markdown documentation folders into fast, responsive, searchable HTML websites.

Built on `@sullux/markdown-compiler` and `@sullux/markdown-html`, `@sullux/markdown-docs` operates as both a standalone CLI application and a Node.js library.

## Core Features

* **GitBook `SUMMARY.md` Support:** Automatically parses `SUMMARY.md` navigation lists and `## Section` headers into sidebar navigation menus (with directory auto-discovery fallback if `SUMMARY.md` is omitted).
* **Zero Dependencies:** Pure Vanilla JS implementation using Node.js built-ins.
* **Declarative Site Configuration (`docs.yaml`):** Comprehensive YAML configuration file support for logos, themes, external links, favicons, and base URLs.
* **Dual Light/Dark Branding:** Supports dual logos (`logo.light`, `logo.dark`) and dual color schemes with native OS system dark mode detection and client-side manual toggle persistence.
* **Client-Side Search:** Auto-generates a lightweight JSON search index and embedded client-side search UI.
* **Responsive 3-Column Layout:** Sticky header with top search bar, left navigation sidebar, center content stream, and right page outline (TOC) with responsive slide-in drawers for mobile.
* **Rich Component Support:** Supports code syntax highlighting, callout boxes (`> [!NOTE]`, `{% hint %}`), GFM tables, and custom image dimensions.
* **Static Asset Copying:** Automatically copies non-Markdown assets (images, SVGs, PDFs) directly to the output directory.

## CLI Usage

```bash
# Generate site using default docs.yaml configuration in ./docs
markdown-docs -i ./docs -o ./_site

# Build with a custom base URL for CI/CD environments
markdown-docs -i ./docs -o ./_site -b "/my-app-docs/"
```

### CLI Options

| Flag | Long Flag | Description | Default |
| :--- | :--- | :--- | :--- |
| `-i` | `--input` | Path to input Markdown docs directory | Current working directory |
| `-o` | `--output` | Path to output build directory | `<input>/_site` |
| `-b` | `--base-url` | Base URL prefix for links and deployment | `""` |
| `-t` | `--title` | Site title override (overrides `docs.yaml`) | `title` in `docs.yaml` |
| `-c` | `--config` | Custom path to config file | `<input>/docs.yaml` |
| `-h` | `--help` | Display CLI help menu | |

---

## Site Configuration (`docs.yaml`)

You can configure your documentation site by placing a `docs.yaml` (or `docs.yml` / `docs.json`) file in your input documentation directory.

### Example `docs.yaml`

```yaml
# Site Title (Optional: omit or leave empty for logo-only headers)
title: "BucketDB"

# Output directory (Optional: can also be passed via CLI)
output: "_site"

# Base URL prefix (Optional: useful for GitHub Pages or subdirectory hosting)
baseUrl: "/docs"

# Brand Logo (Supports single path/SVG, or dual light/dark images)
logo:
  light: "assets/logo-light.svg"
  dark: "assets/logo-dark.svg"

# Favicon Asset Path or URL
favicon: "assets/favicon.ico"

# External Header Navigation Links
links:
  - title: "GitHub"
    url: "https://github.com/sullux/coms"
  - title: "API Spec"
    url: "https://api.example.com"

# Theme Color Overrides
theme:
  light:
    bg: "#ffffff"
    accent: "#2563eb"
    codeBg: "#f8fafc"
    codeText: "#0f172a"
  dark:
    bg: "#121316"
    accent: "#3b82f6"
    codeBg: "#0a0b0e"
    codeText: "#f3f4f6"
```

### Configuration Options Reference

| Property | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Product or site name displayed in header & `<title>` tag. Leave empty (`""`) or omit when using a logo image containing the product name. | `""` |
| `output` | `string` | Relative or absolute path to output build directory. | `<input>/_site` |
| `baseUrl` | `string` | Base URL path prefix for hosting in subdirectories. | `""` |
| `logo` | `string \| object` | Asset path/SVG string, or `{ light: "...", dark: "..." }` object for automatic theme switching. | `""` |
| `favicon` | `string` | Asset path or URL to icon file. | Default book emoji (`📚`) |
| `links` | `array` | Header external links array `[{ title: "...", url: "..." }]`. | `[]` |
| `theme.light` | `object` | Light theme color overrides (`bg`, `accent`, `codeBg`, `codeText`). | Built-in light colors |
| `theme.dark` | `object` | Dark theme color overrides (`bg`, `accent`, `codeBg`, `codeText`). | Built-in dark colors |

---

## Programmatic API Usage

```javascript
const { generateSite } = require('@sullux/markdown-docs')

const result = generateSite({
  input: './docs',
  output: './dist',
  baseUrl: '/docs',
})

console.log(`Generated ${result.pageCount} pages at ${result.output}`)
```

## Running Unit Tests

```bash
yarn test
```
