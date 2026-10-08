# `slides.yaml` Configuration

A slide deck directory can contain a `slides.yaml` defining presentation metadata, themes, default templates, and slide sequences.

## Schema Reference

```yaml
# Presentation Metadata
title: "Quarterly Architecture Review"
author: "Charles Sullivan"
date: "2025-01-15"

# Viewport & Display
ratio: "16:9"             # "16:9" or "4:3"
theme: "dark"             # "dark" or "light"

# Custom Templates & Overrides (optional)
Main: ./templates/Main.md # Custom root slide layout (auto-discovered if Main.md exists)
templates:
  Hero: ./templates/Hero.md
  Title/Content: ./templates/CustomHeader.md

# Deck-wide Default Templates
template: Title/Content

# Slide Sequence
slides:
  - 01-cover.md
  - 02-overview.md
  - folder: ./deep-dive     # Nested sub-deck resolving ./deep-dive/slides.yaml
  - 03-summary.md
```

## Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `"Presentation"` | The document title displayed in the browser tab and presentation header. |
| `ratio` | `string` | `"16:9"` | Aspect ratio of the presentation viewport (`"16:9"` or `"4:3"`). |
| `theme` | `string` | `"dark"` | Active theme palette (`"dark"` or `"light"`). |
| `Main` | `string` | `"Main.md"` | Path to custom root slide layout (auto-discovered if `Main.md` or `templates/Main.md` exists). |
| `templates` | `object \| Array` | `{}` | Map of custom template names to `.md`/`.js` paths, or list of JS modules. |
| `template` | `string \| Array` | `"Title/Content"` | Default template stack applied to all slides unless overridden. |
| `slides` | `Array` | `[]` | Ordered list of slide files or sub-deck folders. |

## Slide Frontmatter

Individual Markdown slide files can configure per-slide options via YAML frontmatter:

```markdown
---
template: Cover
notes: "Emphasize cold-start latency and zero dependencies."
steps: true
---
# High-Throughput Engine

- Sub-millisecond cold starts
- Dependency-free binary runtime
```

### Frontmatter Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `template` | `string \| Array` | Override the template stack for this slide (e.g. `Cover`, `Split`). |
| `Main` | `string \| boolean` | Set `none` or `false` to opt out of the deck `Main` layout (e.g. on cover slides). |
| `notes` | `string \| Array` | Speaker notes displayed in the presenter drawer when pressing `S`. |
| `steps` | `boolean` | Set `true` to auto-step through list bullets or column blocks sequentially. |
| `transitions` | `string[]` | Array of CSS selectors to reveal sequentially (e.g. `['#model', '#engine']`). |
| `layout` | `object` | Coordinate map for `Canvas` template elements (`id: [x, y]`). |
