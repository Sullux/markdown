# Canvas Template

The `Canvas` template enables 2D spatial positioning of icons, diagrams, arrows, and content elements. It can be used as a **full-slide template** or as an **in-slide sub-document container** via `::: Canvas`.

## Concept

Rather than polluting the Markdown body with inline coordinate tags, `Canvas` maps element IDs (`{#id}`) to spatial coordinates declared cleanly in frontmatter:

```markdown
---
template: Canvas
layout:
  brain: [20%, 50%]
  arrow: [50%, 50%]
  disk:  [80%, 50%]
transitions:
  - "#brain"
  - "#arrow"
  - "#disk"
---
![Brain](images/brain.svg){#brain}
![Arrow](images/r-arrow.svg){#arrow}
![Disk](images/disk.svg){#disk}
```

## Coordinate Syntax (`layout:`)

Coordinates can be expressed in pixels or percentages:

### Array Shorthand `[x, y, align]`

```yaml
layout:
  logo: [50%, 20%]               # x=50%, y=20%, center-aligned
  diagram: [100px, 300px]        # explicit pixel positions
  footer: [50%, 90%, center]     # custom alignment
```

### Object Syntax

```yaml
layout:
  brain:
    at: [25%, 50%]
    align: center                # 'center', 'top-left', 'bottom-right'
  sidebar:
    x: 80%
    y: 50%
```

## Anchors on Images & Elements

Our compiler supports explicit anchors on images and block elements:

* **Image with ID**: `![Brain](images/brain.svg){#brain}`
* **Image with ID and dimensions**: `![Disk](images/disk.svg){#disk width=80px}`

## Stepped Reveals & Transitions

Because canvas elements use standard IDs (`#brain`, `#arrow`, `#disk`), they connect seamlessly with our existing stepped transitions system:

```yaml
transitions:
  - "#brain"
  - "#arrow"
  - "#disk"
```

Advancing the slide reveals each diagram element in sequence!

## Embedding Canvas in Other Slides

Use either **transclusion** or **fenced containers**:

```markdown
# In-Slide Canvas Region

::: Canvas {#pipeline height="260px"}
---
layout:
  source: [20%, 50%]
  sink:   [80%, 50%]
---
![Source](images/source.svg){#source}
![Sink](images/sink.svg){#sink}
:::
```
