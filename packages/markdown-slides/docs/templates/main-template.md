# Main Layout & Template Inheritance

`@sullux/markdown-slides` supports hierarchical, composable slide layouts. Rather than hardcoding persistent headers, footers, watermarks, or corporate branding into every slide, decks can define a deck-wide **`Main`** layout template.

---

## 1. The `Main` Layout Concept

In presentation decks, individual slides focus on content layout (such as `Title/Content`, `Header/Columns/Footer`, or `Cover`), while the overarching deck layout manages persistent chrome:
* Watermark logos
* Persistent copyright and company branding footers
* Custom Google fonts or typography
* Custom CSS variables and styles

Every slide template automatically inherits from `Main` unless explicitly suppressed.

---

## 2. Defining a Markdown Template (`Main.md`)

Templates can be written in vanilla Markdown using `<slot />` to inject slide content:

````markdown
---
name: Main
base: none
head:
  - '<link rel="preconnect" href="https://fonts.googleapis.com">'
  - '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">'
---

```css template
:root {
  --slide-font: 'Inter', sans-serif;
}
.deck-watermark {
  position: absolute;
  top: 2rem;
  right: 2rem;
  opacity: 0.08;
  pointer-events: none;
}
.deck-footer {
  position: absolute;
  bottom: 1.5rem;
  left: 2.5rem;
  right: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  opacity: 0.7;
}
```

<div class="deck-watermark">
  ![Watermark Logo](images/logo.svg){width=140px}
</div>

<slot />

<footer class="deck-footer">
  <span>Channel Inference Engine</span>
  <span>© 2026 Sullux LLC</span>
  <img src="https://sullux.com/images/logo-full-email-dark.svg" height="16" />
</footer>
````

### Key Features
* **`<slot />` (or `<slot></slot>`)**: The point where the slide's content HTML is inserted.
* **` ```css template `**: Automatically hoisted into a `<style>` tag in the slide's `<head>`.
* **`head:` frontmatter**: String or list of `<link>` or `<script>` tags hoisted into `<head>`.
* **Automatic Asset Resolution**: Images referenced in Markdown (`![alt](url)`), HTML (`<img src="...">`), or CSS (`url(...)`) are automatically discovered, downloaded, copied, and rewritten.

---

## 3. Auto-Discovery & Configuration

### Auto-Discovery
If `Main.md` exists in the presentation root directory or inside `templates/Main.md`, `@sullux/markdown-slides` automatically discovers and registers it as the root `Main` layout.

### Explicit Overrides in `slides.yaml`
You can point to any custom Markdown layout file in `slides.yaml`:

```yaml
Main: ./templates/branded-layout.md
```

Or map multiple custom templates:

```yaml
templates:
  Main: ./templates/branded-layout.md
  Title/Content: ./templates/custom-header.md
```

---

## 4. Per-Slide Opt-Out (`Main: none`)

Cover splash screens and full-bleed media slides typically do not want the standard deck chrome (watermark, footer, etc.).

A slide can opt out of the `Main` layout in its frontmatter:

```markdown
---
template: Cover
Main: none
---
# Welcome
## Keynote Presentation
```

Setting `Main: none`, `Main: false`, `layout: none`, or `base: none` halts the inheritance chain, rendering the slide bare.

---

## 5. Multi-Level Inheritance (`base:`)

Any custom template can declare its parent in frontmatter:

```yaml
---
name: Header/Columns/Footer
base: Title/Content
---
```

When the template executes, its output is passed up the chain to `base: Title/Content`, which in turn passes up to `base: Main`, forming an auditable, composable layout pipeline.

---

## 6. Sub-Documents & Chrome Boundary

While full slides inherit `Main` by default, **sub-documents** (embedded via `:::` containers or transcluded via `![alt](./fragment.md)`) represent scoped component fragments within a slide.

`@sullux/markdown-slides` automatically suppresses `Main` chrome when compiling sub-documents:
* CSS styles and variables declared in `Main.md` naturally cascade down into the sub-document.
* Physical DOM chrome (such as `<footer class="deck-footer">` or watermarks) is **not** duplicated inside the sub-document.
* Custom sub-document templates can still use explicit `base:` chains to inherit from other component layouts.
