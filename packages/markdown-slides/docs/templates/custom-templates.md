# Custom Templates & Composition

`@sullux/markdown-slides` supports two approaches for creating custom slide templates:
1. **Markdown-Based Templates (`.md`)**: Author layouts in standard Markdown with `<slot />` tags, CSS code blocks, and frontmatter.
2. **JavaScript-Based Templates (`.js`)**: Pure functional AST transformers for programmatic control.

---

## 1. Markdown-Based Templates (`.md`)

Markdown templates allow you to define slide layouts without writing JavaScript. A template file looks like standard Markdown, using `<slot />` where the slide content should be inserted:

````markdown
---
name: Hero
base: Main
head:
  - '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&display=swap" rel="stylesheet">'
---

```css template
.hero-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
}
.hero-wrapper h1 {
  font-size: 3.5rem;
  color: var(--accent);
}
```

<div class="hero-wrapper">
  <slot />
</div>
````

### Template Features
* **`<slot />` (or `<slot></slot>`)**: Replaced with the compiled HTML of the slide or sub-document.
* **` ```css template `**: Hoisted automatically into a `<style>` tag in the slide's `<head>`.
* **`head:` frontmatter**: String or list of `<link>` or `<script>` tags hoisted into `<head>`.
* **`base:` inheritance**: The parent template this layout inherits from (defaults up to `Main`).

---

## 2. The `templates/` Directory & Configuration

### Directory Convention
Place custom templates in a `templates/` folder at the root of your presentation:

```text
my-deck/
├── slides.yaml
├── templates/
│   ├── Main.md             # Overrides root slide frame
│   ├── Hero.md             # Custom template
│   └── Title/Content.md    # Overrides built-in Title/Content
└── 01-slide.md
```

### Registering Overrides in `slides.yaml`
Map custom template names directly to template files in `slides.yaml`:

```yaml
title: "Quarterly Review"

# Map template names to custom Markdown or JavaScript files
templates:
  Main: ./templates/Main.md
  Hero: ./templates/Hero.md
  Title/Content: ./templates/MyHeader.md

slides:
  - 01-cover.md
  - 02-overview.md
```

You can also import JavaScript modules exporting template factories as a list:

```yaml
templates:
  - ./templates/custom-addons.js
```

---

## 3. Using Custom Templates in Slides

### Whole-Slide Layout
Specify the template name in the slide's frontmatter:

```markdown
---
template: Hero
---
# Breakthrough Performance
Sub-millisecond latency on commodity hardware.
```

### Fractal Sub-Documents (`:::`)
Because templates in `@sullux/markdown-slides` are **fractal**, any custom template can also be used as an inline sub-document container:

```markdown
---
template: Title/Content
---
# System Architecture

::: Hero {#highlight-metric height="250px"}
# 10x Throughput
Measured against state-of-the-art baselines.
:::

Summary text follows below.
```

Sub-documents automatically inherit styling without duplicating the outer `Main` chrome.

---

## 4. Advanced JavaScript Templates (`.js`)

For programmatic AST manipulation or custom render pipelines, a JavaScript template is a pure function:

```javascript
// templates/watermark.js
const Watermark = (state, context) => {
  const watermarkHtml = `<div class="watermark">${context.title}</div>`
  return {
    ...state,
    html: `<div class="slide-watermark-wrap">${state.html}${watermarkHtml}</div>`,
    head: [
      ...(state.head || []),
      '<style>.watermark { position: absolute; bottom: 20px; right: 30px; opacity: 0.3; }</style>',
    ],
  }
}

module.exports = {
  Watermark,
}
```

### Pipeline Signature
* `(state, context) => newState`
* **`state`**: `{ ast, html, head, frontmatter }`
* **`context`**: `{ title, theme, config, registry, isSubDocument }`
