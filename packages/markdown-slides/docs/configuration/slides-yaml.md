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

# Custom Templates (optional)
templates:
  - ./templates/corporate.js

# Deck-wide Default Templates
template:
  - Corporate Header
  - Title/Content

# Slide Sequence
slides:
  - file: 01-cover.md
    template: Cover

  - file: 02-overview.md

  - folder: ./deep-dive     # Nested sub-deck resolving ./deep-dive/slides.yaml

  - file: 03-summary.md
    template:
      - Corporate Header
      - Split
```

## Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `"Presentation"` | The document title displayed in the browser tab and presentation header. |
| `ratio` | `string` | `"16:9"` | Aspect ratio of the presentation viewport (`"16:9"` or `"4:3"`). |
| `theme` | `string` | `"dark"` | Active theme palette (`"dark"` or `"light"`). |
| `template` | `string \| Array` | `"Title/Content"` | Default template stack applied to all slides unless overridden. |
| `slides` | `Array` | `[]` | Ordered list of slide files or sub-deck folders. |
