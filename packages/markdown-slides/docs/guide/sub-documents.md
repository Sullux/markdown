# Sub-Documents & Transclusion

`@sullux/markdown-slides` treats templates as fractal interpreters. A template is not limited to whole slides—it can also be applied to **subsections of a slide** or **external component files**.

This gives you two clean mechanisms for modular slide design:
1. **File Transclusion**: Embedding an external Markdown file as a self-contained component.
2. **Fenced Container Directives (`:::`)**: Scoping an in-slide region to a dedicated template with its own local frontmatter and attributes.

---

## 1. File Transclusion (`![alt](./component.md)`)

To embed a standalone sub-document into any slide, reference its `.md` file using standard Markdown image syntax:

```markdown
# Inference Pipeline

![Architecture Diagram](./diagrams/pipeline.md)

*Real-time token streaming with microsecond memory recall.*
```

### Sub-Document File (`pipeline.md`)

The referenced sub-document has its own frontmatter and template:

```markdown
---
template: Canvas
height: 260
layout:
  brain: [20%, 50%]
  arrow: [50%, 50%]
  disk:  [80%, 50%]
---
![Brain](../images/brain.svg){#brain}
![Arrow](../images/r-arrow.svg){#arrow}
![Disk](../images/disk.svg){#disk}
```

### Benefits
* **Plain Text Readability**: The parent slide remains 100% standard Markdown without any layout math.
* **Component Reusability**: The same diagram file can be embedded in multiple slides.
* **Automatic Asset Resolution**: Images referenced inside `pipeline.md` are automatically bundled and resolved by the Minimum Viable Suffix asset pipeline.
* **Cyclic Protection**: Recursion is monitored to prevent infinite inclusion loops.

---

## 2. In-Slide Fenced Containers (`:::`)

For one-off sub-layouts that don't need a separate file, use fenced container directives (`:::`).

### Syntax

```markdown
::: [template] [{attributes}]
[optional local YAML frontmatter]
[markdown body]
:::
```

### Examples

#### Nested Split Columns inside a Title/Content Slide

```markdown
---
template: Title/Content
---
# Feature Comparison

::: Split {#comparison}
### Zero Dependencies
* Pure vanilla JavaScript
* No npm bloat

---

### Low Latency
* Sub-millisecond cold starts
* Predictable memory usage
:::

Summary note below the columns.
```

#### In-Slide 2D Canvas Container

```markdown
# Neural Cache

::: Canvas {#cache-flow height="280px"}
---
layout:
  iconA: [25%, 50%]
  iconB: [75%, 50%]
---
![Source](images/source.svg){#iconA}
![Target](images/target.svg){#iconB}
:::
```

### Attributes Support

Containers support standard curly attribute syntax:
* **ID Anchor**: `{#my-id}`
* **Classes**: `{.accent .border}`
* **Dimensions**: `height="300px"` or `width="80%"`

```markdown
::: Quote {#key-takeaway .callout}
> "Simplicity is prerequisite for reliability."
:::
```
