# Options Reference & Visual Mapping

Every configuration option in `@sullux/markdown-docs` directly controls specific UI elements and rendering behaviors on the generated website.

## Configuration Options

| Option | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Site product title. Leave empty (`""`) or omit when using a logo containing product name text. |
| `logo` | `string \| object` | Asset path/SVG string, or `{ light: "...", dark: "..." }` object. |
| `favicon` | `string` | Asset path or URL to icon file. |
| `links` | `array` | Header external links list `[{ title: "...", url: "..." }]`. |
| `baseUrl` | `string` | Base path URL prefix for hosting in subdirectories. |
| `output` | `string` | Output build directory. |
| `theme` | `object` | Custom color overrides (`bg`, `accent`, `codeBg`, `codeText`). |

---

## How Each Element Appears on the Website

### 1. `title`
* **Browser Tab `<title>` Tag:** Prepend to the page name (e.g. `Quick Start - Markdown Docs`).
* **Header Branding:** Displayed as text next to the brand logo in the top-left corner. If omitted or empty (`""`), only the logo image renders.

### 2. `logo`
* **Top Header Brand Anchor:** Rendered on the left side of the sticky top navigation header.
* **Dual Light/Dark Logos:** When specified as `{ light: "...", dark: "..." }`, both images are rendered with CSS classes (`.logo-light`, `.logo-dark`). Selecting light or dark mode toggles image visibility automatically.

### 3. `favicon`
* **Browser Tab Icon:** Injected into HTML `<head>` as `<link rel="icon" href="...">`. Defaults to book emoji (`📚`) if omitted.

### 4. `links`
* **Top-Right Header Links:** Rendered in the header navigation area with external indicator arrows (`↗`). Clicking opens links in a new browser tab with `rel="noopener"`.

### 5. `baseUrl`
* **Path Prefix Calculation:** Used to resolve relative pathing across nested subdirectories, assets, and navigation links.

### 6. `theme`
* **CSS Custom Properties:** Mapped into CSS variables (`--bg-page`, `--accent-color`, `--code-bg`, `--code-text`), driving both page styling and code syntax highlighting.
