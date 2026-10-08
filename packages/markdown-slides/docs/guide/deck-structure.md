# Deck Structure & Composition

`@sullux/markdown-slides` enables modular presentation decks by allowing presentations to reference standalone slide files or nested sub-decks.

## Deck File Organization

A presentation deck directory typically organizes slides, custom templates, and static assets as follows:

```text
my-deck/
├── slides.yaml             # Deck configuration and slide sequence
├── Main.md                 # Optional root layout chrome (or templates/Main.md)
├── templates/              # Optional custom or overriding Markdown templates
│   ├── Main.md             # Persistent deck chrome, header, and footer
│   └── Hero.md             # Custom reusable template
├── images/                 # Local SVGs, logos, and illustrations
│   ├── logo.svg
│   └── diagram.png
├── 01-cover.md
├── 02-overview.md
├── 03-architecture.md
└── 04-summary.md
```

### Auto-Discovery Conventions
1. **`slides.yaml`**: The entrypoint for deck metadata and ordering.
2. **`Main.md` / `templates/Main.md`**: Automatically discovered and applied as the outer slide viewport frame across all slides.
3. **`templates/`**: Custom `.md` layout templates placed in this directory can be registered or referenced across slides.
4. **`images/`**: Image assets referenced in Markdown, raw HTML `<img src>`, or CSS `url(...)` are automatically discovered, collected, and deduplicated.

## Linear Decks

A simple linear deck lists slide files in the order they should be presented:

```yaml
title: "Product Launch"
slides:
  - 01-cover.md
  - 02-problem.md
  - 03-solution.md
  - 04-summary.md
```

## Nested & Reusable Sub-Decks

Large organizations and consultancies often reuse standard sections across multiple pitch decks or engineering reviews. With `@sullux/markdown-slides`, any slide entry can point to a subfolder containing its own `slides.yaml`:

```text
pitch-deck/
├── slides.yaml
├── 01-intro.md
├── architecture/
│   ├── slides.yaml
│   ├── 01-overview.md
│   └── 02-benchmarks.md
└── 03-closing.md
```

In the master `slides.yaml`:

```yaml
title: "Master Pitch Deck"
slides:
  - 01-intro.md
  - folder: ./architecture
  - 03-closing.md
```

The compiler flattens the hierarchy into a unified presentation while maintaining section breadcrumbs and metadata.
