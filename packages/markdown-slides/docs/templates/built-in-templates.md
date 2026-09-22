# Built-in Templates

`@sullux/markdown-slides` includes a suite of standard templates designed to handle common presentation patterns out of the box.

## Standard Template Suite

### 1. `Cover` (or `Title`)
Designed for opening splash slides, speaker introductions, and section breakers.
* **Expected Markdown**: First `#` becomes the main display title; optional `##` becomes the subtitle; trailing paragraphs become author/date lines.
* **Layout**: Vertically and horizontally centered with enlarged typography.

### 2. `Title/Content` (Default)
Standard informational slide with a top title bar and flexible content body.
* **Expected Markdown**: First `#` becomes the title bar. All subsequent content renders in the main scroll-free viewport.

### 3. `Header/Columns/Footer`
Partition-based layout for dashboards, multi-pillar comparisons, and summary slides.
* **Expected Markdown**: Divided into regions using `---` thematic breaks:
  * Partition 0: Header area
  * Partitions 1 through $N-2$: Content columns (flexbox/grid)
  * Partition $N-1$: Footer area

```markdown
# Section Title

---

### Left Column
* Bullet point A
* Bullet point B

---

### Right Column
![Diagram](diagram.png)

---

*Confidential - For Internal Review Only*
```

### 4. `Split`
Side-by-side columns without header or footer partitions.
* **Expected Markdown**: `---` divides the slide directly into side-by-side columns.

### 5. `Media` (Full-Bleed)
Edge-to-edge canvas with minimal padding for large diagrams, architectural maps, or screenshots.

### 6. `Quote`
Centered statement slide with large callout typography and attribution.
