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

Block nodes define structural regions of the document.

### `header`
Represents section headings (`#` through `######`).
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
Represents lists. Each element in `items` is an array of inline nodes with indentation and sequence metadata.
```javascript
{
  type: 'orderedList', // or 'bulletList'
  items: [
    [
      { type: 'text', value: 'First step' },
      // items array properties:
      // indent: 0,
      // depth: 0,
      // listType: 'ordered',
      // order: 1
    ]
  ]
}
```

### `codeBlock`
Represents fenced code blocks (```` ``` ```` or `~~~`).
```javascript
{
  type: 'codeBlock',
  language: 'javascript',
  languageMetadata: 'title="server.js"',
  value: 'const port = 8080;'
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

### `hr`
Represents a horizontal rule (`---`, `***`, `___`).
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
* **`link`**: `{ type: 'link', url: string, children: InlineNode[] }`
* **`wikilink`**: `{ type: 'wikilink', target: string, display: string }`
* **`image`**: `{ type: 'image', url: string, alt: string, width?: string, height?: string }`
* **`checkbox`**: `{ type: 'checkbox', checked: boolean }`
* **`br`**: `{ type: 'br' }`
