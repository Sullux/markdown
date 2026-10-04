# Split Template

The `Split` template (alias: `Columns`) creates equal-width columns partitioned by `---` breaks, without any persistent header or footer containers.

## Layout Behavior

* Every `---` break splits content into an additional column.
* Content occupies the full height and width of the slide canvas.
* Ideal for side-by-side comparisons, code vs. output views, or image vs. text layouts.

## Example Markdown

```markdown
---
template: Split
---
### Specification Definition

CommonMark 0.31.2 sets rigorous conformance expectations for Markdown parsing:

- Container hierarchy resolution
- Tight and loose list handling
- Strict backtick fencing rules

---

### Conformance Results

```text
Section 5.3: Lists               26 / 26 (100%)
Section 4.5: Fenced Code Blocks  29 / 29 (100%)
Section 4.1: Thematic Breaks     19 / 19 (100%)
Overall Score                   652 / 652 (100%)
```
```

## Structure

```text
┌──────────────────────┬───────────────────────┐
│ Specification        │ Conformance Results   │
│                      │                       │
│ CommonMark 0.31.2    │ [ Output Block ]      │
│ sets rigorous...     │                       │
│ • Container rules    │ 652 / 652 (100%)      │
└──────────────────────┴───────────────────────┘
```
