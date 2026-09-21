# AST Specification

`@sullux/markdown-compiler` represents Markdown documents as a plain JavaScript Object tree without complex prototype hierarchies or methods.

## Root Node

A parsed document has the shape:

```typescript
interface Document {
  frontmatter: Record<string, any>;
  blocks: BlockNode[];
}
```

## Block Nodes

Block nodes define structural regions of the document. Block structure strictly adheres to the [CommonMark Specification (v0.31.2)](https://spec.commonmark.org/0.31.2/) for container blocks and nesting.

### `header`
Represents section headings (`#` through `######`) or Setext headings (`===`, `---`).
```javascript
{
  type: 'header',
  level: 1, // 1 to 6
  children: [ /* InlineNode[] */ ]
}
```

### `paragraph`
Represents a block of running prose.
```javascript
{
  type: 'paragraph',
  children: [ /* InlineNode[] */ ]
}
```

### `bulletList` & `orderedList`
Represents container lists adhering to CommonMark §5.3. Contains `listItem` container nodes in `children`.
```javascript
{
  type: 'orderedList', // or 'bulletList'
  start: 1,            // starting number for ordered lists (default 1)
  tight: true,         // true for tight lists, false for loose lists
  children: [
    {
      type: 'listItem',
      checked: false,  // boolean for task list items, undefined for normal items
      children: [
        { type: 'paragraph', children: [ { type: 'text', value: 'First step' } ] },
        // optional nested sub-lists or continuation blocks
      ]
    }
  ]
}
```

### `listItem`
A container block representing an individual list entry (§5.2). It contains an array of block nodes in `children` (such as paragraphs, sub-lists, or code blocks) and an optional `checked` property for GFM task lists.
```javascript
{
  type: 'listItem',
  checked: true, // optional boolean
  children: [ /* BlockNode[] */ ]
}
```

### `codeBlock`
Represents fenced code blocks (```` ``` ```` or `~~~`) or indented code blocks (4 spaces / 1 tab).
```javascript
{
  type: 'codeBlock',
  language: 'javascript',
  languageMetadata: 'title="server.js"',
  value: 'const port = 8080;'
}
```

### `mathBlock`
Represents display math blocks enclosed by `$$...$$` or ```` ```math ````.
```javascript
{
  type: 'mathBlock',
  value: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
}
```

### `blockquote`
Represents quoted content (`>`).
```javascript
{
  type: 'blockquote',
  children: [ /* BlockNode[] */ ]
}
```

### `callout`
Represents alert and callout banners (`> [!NOTE]` or GitBook `{% hint %}`).
```javascript
{
  type: 'callout',
  style: 'note', // 'note', 'warning', 'tip', 'important', 'info', etc.
  title: 'Custom Title', // optional title
  children: [ /* BlockNode[] */ ]
}
```

### `table`
Represents GFM aligned tables.
```javascript
{
  type: 'table',
  alignments: ['left', 'center', 'right'],
  rows: [
    [ [/* Cell 0,0 inline nodes */], [/* Cell 0,1 */], [/* Cell 0,2 */] ],
    [ [/* Cell 1,0 inline nodes */], [/* Cell 1,1 */], [/* Cell 1,2 */] ]
  ]
}
```

### `html`
Represents raw block-level HTML elements (CommonMark Types 1–7).
```javascript
{
  type: 'html',
  value: '<div class="alert">\n  <p>Raw HTML</p>\n</div>'
}
```

### `hr`
Represents a horizontal rule / thematic break (`---`, `***`, `___`).
```javascript
{
  type: 'hr'
}
```

## Inline Nodes

Inline nodes represent formatting, text, and media inside block elements:

* **`text`**: `{ type: 'text', value: string }`
* **`bold`**: `{ type: 'bold', children: InlineNode[] }`
* **`italic`**: `{ type: 'italic', children: InlineNode[] }`
* **`strikethrough`**: `{ type: 'strikethrough', children: InlineNode[] }`
* **`code`**: `{ type: 'code', value: string }`
* **`link`**: `{ type: 'link', url: string, title?: string, children: InlineNode[] }`
* **`wikilink`**: `{ type: 'wikilink', target: string, display: string }`
* **`image`**: `{ type: 'image', url: string, alt: string, title?: string, width?: string, height?: string }`
* **`checkbox`**: `{ type: 'checkbox', checked: boolean }`
* **`html`**: `{ type: 'html', value: string }`
* **`inlineMath`**: `{ type: 'inlineMath', value: string }`
* **`br`**: `{ type: 'br' }`
