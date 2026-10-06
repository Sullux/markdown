# Built-in Templates Overview

`@sullux/markdown-slides` includes a suite of responsive slide templates designed to interpret semantic Markdown blocks into clean presentation layouts.

## Available Templates

| Template | Primary Use Case | Partition Syntax |
| :--- | :--- | :--- |
| **[Title/Content](title-content.md)** | Standard presentation slide with top title bar and flexible body. | Single slide body |
| **[Header/Columns/Footer](header-columns-footer.md)** | Multi-column comparison or data layout with persistent header and footer. | `---` thematic breaks |
| **[Cover](cover.md)** | Centered presentation splash screen for titles, subtitles, and author info. | H1, H2, metadata |
| **[Split](split.md)** | Side-by-side columns without header or footer margins. | `---` thematic breaks |
| **[Canvas](canvas.md)** | 2D spatial positioning of icons, diagrams, and components. | `layout:` frontmatter coordinates |
| **[Media](media.md)** | Unpadded full-bleed slide canvas for diagrams, photos, or code demos. | Full canvas |
| **[Quote](quote.md)** | Large typographic statement slide centering a key takeaway or quote. | Blockquote `> ` |

## Setting Templates

Templates can be configured at the presentation level or on individual slides:

### Default Deck Template (`slides.yaml`)

```yaml
template: Title/Content
```

### Per-Slide Frontmatter Override

```markdown
---
template: Cover
---
# Welcome
```

### Per-Slide in `slides.yaml`

```yaml
slides:
  - file: 01-intro.md
    template: Cover
  - file: 02-comparison.md
    template: Header/Columns/Footer
```
