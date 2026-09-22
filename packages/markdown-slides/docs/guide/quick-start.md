# Quick Start

Get started with `@sullux/markdown-slides` in your project.

## Installation

Install the package via Yarn or NPM:

```bash
yarn add @sullux/markdown-slides
```

Or install globally to use the CLI anywhere:

```bash
yarn global add @sullux/markdown-slides
```

## Basic Usage

### 1. Create a Slide Deck Directory

Create a folder for your slides containing a `slides.yaml` and some Markdown slides:

```text
my-presentation/
├── slides.yaml
├── 01-intro.md
└── 02-architecture.md
```

### 2. Configure `slides.yaml`

```yaml
title: "Quarterly Review"
ratio: "16:9"
theme: "dark"

slides:
  - 01-intro.md
  - 02-architecture.md
```

### 3. Write Slide Content

In `01-intro.md`:

```markdown
# Quarterly Architecture Review

## Sullux Engineering

Charles Sullivan & Natasha Sullivan
```

In `02-architecture.md`:

```markdown
# Core Infrastructure

---

### High-Throughput Engine
* Zero runtime dependencies
* Sub-millisecond cold starts

---

### Client Presentation
* Responsive 16:9 canvas
* Stepped transitions
```

### 4. Build the Presentation

Run the `markdown-slides` command:

```bash
markdown-slides -i ./my-presentation -o ./dist
```

Open `./dist/index.html` in your browser to begin presenting!
