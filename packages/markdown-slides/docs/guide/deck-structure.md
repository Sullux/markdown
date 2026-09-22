# Deck Structure & Composition

`@sullux/markdown-slides` enables modular presentation decks by allowing presentations to reference standalone slide files or nested sub-decks.

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
