# Transitions & Stepped Reveals

Presentations often benefit from revealing ideas incrementally. `@sullux/markdown-slides` supports stepped transitions (fragments) without requiring inline HTML or complex presentation DSLs.

## Automatic Stepping (`steps: true`)

To step through list items or column partitions sequentially, set `steps: true` in your slide frontmatter:

```markdown
---
template: Header/Columns/Footer
steps: true
---
# Why Channel?

---

### Low Latency
- Sub-millisecond cold start times.
- Zero runtime overhead.

---

### High Portability
- Vanilla JavaScript implementation.
- Zero third-party dependencies.
```

When `steps: true` is enabled, list bullets (`<li>`) and column sections (`.slide-col`) are hidden initially and revealed sequentially each time the presenter advances.

## Targeted Selectors (`transitions: [...]`)

For precise control over reveal choreography, specify an array of CSS selectors in the `transitions` frontmatter property:

```markdown
---
template: Header/Columns/Footer
transitions:
  - "#model"
  - "#engine"
---
# Two Parts of Inference

---

### Model
The model represents all learned knowledge and weights.

---

### Engine
The engine takes input and applies it to the model.
```

Elements matching each selector will be revealed one by one in the order listed.

## Presenter Navigation

The presentation keyboard controller provides smooth bi-directional stepping:

* **Step Forward**: Pressing `→`, `Space`, `PageDown`, or `L` reveals the next fragment on the current slide. When all fragments are visible, the next keypress advances to the subsequent slide.
* **Step Backward**: Pressing `←`, `PageUp`, or `H` hides the last revealed fragment. When at step 0, it navigates to the previous slide with all its fragments already revealed.

## PDF & Print Behavior

In print mode (`@media print`), all stepped elements are rendered fully visible so that every slide exports completely in PDF format without missing points.
