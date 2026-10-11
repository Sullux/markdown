# Generic Attribute Lists (`{...}`)

`@sullux/markdown-compiler` provides generic attribute list parsing via `{...}` (and `{:...}`) blocks. 

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

## 2. AST Data Model

When an element with an attribute block is parsed, the following standard properties are attached to the node:

```javascript
{
  type: 'image',
  url: 'hero.jpg',
  alt: 'Hero',
  id: 'hero-img',               // Extracted from #hero-img (or undefined)
  classes: ['fade-edges'],      // Extracted from .fade-edges (array)
  attributes: {                 // Map of all parsed key-values and boolean flags
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

## 3. Programmatic API: `parseAttributeList()`

The attribute parser is exported for direct programmatic use:

```javascript
const { parseAttributeList } = require('@sullux/markdown-compiler')

const result = parseAttributeList('{#chart .responsive width="500px" interactive}')
// Result:
// {
//   id: 'chart',
//   classes: ['responsive'],
//   attributes: {
//     width: '500px',
//     interactive: true
//   }
// }
```

---

## 4. Downstream Engine Interoperability

Because attribute lists are generic:
* **HTML Renderers (`@sullux/markdown-html`)**: Render `id="${token.id}"`, `class="${token.classes.join(' ')}"`, and convert dimensional attributes to standard inline styles.
* **Slide Decks (`@sullux/markdown-slides`)**: Read `token.id` for element anchors, and `token.attributes.at` for 2D Canvas positioning without the core compiler needing any slide-specific knowledge.
