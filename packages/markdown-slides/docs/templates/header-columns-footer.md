# Header/Columns/Footer Template

The `Header/Columns/Footer` template creates a structured multi-column slide partitioned cleanly by horizontal rules (`---`).

## Partition Conventions

* **Header Section**: All content before the first `---` is placed into the top header container.
* **Column Sections**: Content between `---` partitions is automatically laid out as equal-width side-by-side columns (`.slide-col`).
* **Footer Section**: If more than two `---` breaks are provided, the final partition is placed into a bottom `<footer class="slide-footer">` bar.

*(Tip: Literal horizontal lines within a column can be written using asterisks `***` to avoid triggering a column partition).*

## Example Markdown

```markdown
---
template: Header/Columns/Footer
---
# Architectural Comparison

---

### Monolithic Approach
* Tightly coupled dependencies
* Heavy build requirements
* Large runtime footprint

---

### Functional Approach
* Zero external runtime dependencies
* Modular composability
* Sub-millisecond initialization

---

*Note: Benchmarks collected on Node.js v24.14.1 on Linux x86_64.*
```

## Structure

```text
┌──────────────────────────────────────────────┐
│  Architectural Comparison                    │
├──────────────────────┬───────────────────────┤
│  Monolithic Approach │  Functional Approach  │
│  • Tightly coupled   │  • Zero dependencies  │
│  • Heavy build       │  • Sub-millisecond    │
├──────────────────────┴───────────────────────┤
│  Note: Benchmarks collected on Node.js       │
└──────────────────────────────────────────────┘
```
