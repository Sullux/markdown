# Generic Attribute Lists (`{...}`)

`@sullux/markdown-compiler` provides generic attribute list parsing via `{...}` (and `{:...}`) blocks across both inline and block elements.

Rather than hardcoding domain-specific rules (like image dimensions, layout coordinates, or presentation metadata), the compiler tokenizes attributes into a clean, predictable data model that downstream engines can inspect without coupling.

---

## 1. Syntax Specification

An attribute block is enclosed in curly braces `{...}` (with an optional leading colon `{:...}`). It contains space-delimited tokens:

| Syntax | Token Type | Meaning | AST Output |
| :--- | :--- | :--- | :--- |
| `#identifier` | Identifier | Element ID / Anchor | `id: 'identifier'` |
| `.class-name` | Class Name | CSS Class | `classes: ['class-name']` |
| `key=value` or `key="value"` | Key-Value Pair | Arbitrary attribute | `attributes: { key: 'value' }` |
| `key:value` or `key:"value"` | Key-Value Pair | Alternative separator | `attributes: { key: 'value' }` |
| `bare-word` | Boolean Flag | Flag / Tag | `attributes: { flag: true }` |

### Quoted Values
Values containing spaces, commas, or special characters must be enclosed in single (`'...'`) or double (`"..."`) quotes:
```markdown
![Hero](hero.jpg){#hero-img .fade-edges at="65%, 15%" width="400px" clip=false}
```

---

## 2. Supported Targets & Disambiguation Rules

Attribute lists attach cleanly to different DOM levels depending on where they appear:

### A. Headings (`<h1-h6>`)
Trailing attributes on an ATX heading line attach directly to the heading block:
```markdown
# Architecture Overview {#overview .hero-title}
```
**HTML:** `<h1 id="overview" class="hero-title">Architecture Overview</h1>`

### B. Paragraphs (`<p>`)
Trailing attributes at the end of a paragraph attach to the `<p>` block:
```markdown
Photo by Mike Scheid on Unsplash {.caption #caption}
```
**HTML:** `<p id="caption" class="caption">Photo by Mike Scheid on Unsplash</p>`

### C. Bracketed Spans (`<span>`)
For arbitrary text spans within a sentence, wrap the text in square brackets:
```markdown
The engine achieved [sub-millisecond latency]{#metric .badge-success} in tests.
```
**HTML:** `The engine achieved <span id="metric" class="badge-success">sub-millisecond latency</span> in tests.`

### D. List Items (`<li>`)
Trailing attributes on a list item line attach to that specific `<li>`:
```markdown
- Task 1: Engine Core {.done #task-1}
- Task 2: Compilers {.in-progress #task-2}
```
**HTML:**
```html
<ul>
  <li id="task-1" class="done">Task 1: Engine Core</li>
  <li id="task-2" class="in-progress">Task 2: Compilers</li>
</ul>
```

### E. List Containers (`<ul>` / `<ol>`)
A standalone attribute line immediately preceding a list attaches to the entire list container:
```markdown
{: #pipeline-steps .feature-grid}
- Download weights
- Initialize memory buffers
- Execute compute graph
```
**HTML:**
```html
<ul id="pipeline-steps" class="feature-grid">
  <li>Download weights</li>
  <li>Initialize memory buffers</li>
  <li>Execute compute graph</li>
</ul>
```

### F. Images & Links (`<img>`, `<a>`)
Attributes directly following the URL parentheses attach to the element:
```markdown
[Read Documentation](https://docs.example.com){#docs-link .btn-primary}
![General Audience](audience.jpg){#general-audience .fade-edges width="400px"}
```

---

## 3. AST Data Model

When an element with an attribute block is parsed, the following standard properties are attached to the node:

```javascript
{
  type: 'paragraph', // or 'header', 'listItem', 'bulletList', 'image', 'span', etc.
  id: 'caption',
  classes: ['caption'],
  attributes: {
    at: '65%, 15%',
    width: '400px',
    clip: false
  }
}
```

* **`id`**: Unique identifier string.
* **`classes`**: Array of class name strings.
* **`attributes`**: Key-value map of all remaining attributes. Boolean values (`true`/`false`) are parsed as native booleans; numbers or strings preserve their values.

---

## 4. Programmatic API

```javascript
const { parseAttributeList, extractTrailingAttributes } = require('@sullux/markdown-compiler')

const result = parseAttributeList('{#chart .responsive width="500px" interactive}')
// { id: 'chart', classes: ['responsive'], attributes: { width: '500px', interactive: true } }

const trailing = extractTrailingAttributes('Photo credit {.caption #caption}')
// { cleanText: 'Photo credit', id: 'caption', classes: ['caption'], attributes: {} }
```
