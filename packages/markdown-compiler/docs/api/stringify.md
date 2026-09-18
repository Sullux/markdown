# `stringify(ast)`

The `stringify` function serializes a Document AST or node structure back into canonical Markdown text.

## Signature

```javascript
const { stringify } = require('@sullux/markdown-compiler')

const markdownText = stringify(ast)
```

### Parameters

* **`ast`** (`Document | BlockNode | Array<BlockNode>`):
  * Can be a full Document object (`{ frontmatter, blocks }`), a single Block node, or an array of nodes.

### Returns

* **`string`**: Canonical Markdown representation with proper indentation, headers, block boundaries, and frontmatter.

## Behavior & Features

### 1. Frontmatter Serialization
When the provided AST includes a `frontmatter` object with keys, it is serialized as YAML enclosed in `---` frontmatter blocks:

```javascript
const { stringify, Node } = require('@sullux/markdown-compiler')

const doc = {
  frontmatter: {
    title: 'Release Notes',
    published: true,
    version: '1.0.1',
  },
  blocks: [
    Node.header(1, [Node.text('Release Notes')]),
    Node.paragraph([Node.text('Bug fixes and stability improvements.')]),
  ],
}

console.log(stringify(doc))
```

Output:

```markdown
---
title: Release Notes
published: true
version: 1.0.1
---

# Release Notes

Bug fixes and stability improvements.
```

### 2. GFM Table Formatting
Tables are rendered with aligned column pipes and proper alignment delimiters (`:---`, `:---:`, `---:`):

```javascript
const { stringify, Node } = require('@sullux/markdown-compiler')

const table = Node.table(
  ['left', 'center', 'right'],
  [
    [Node.text('Metric'), Node.text('Status'), Node.text('Value')],
    [Node.text('Latency'), Node.text('PASS'), Node.text('1.4ms')],
    [Node.text('Throughput'), Node.text('PASS'), Node.text('27 tok/s')],
  ]
)

console.log(stringify(table))
```

Output:

```markdown
| Metric     | Status |     Value |
| :--------- | :----: | --------: |
| Latency    |  PASS  |     1.4ms |
| Throughput |  PASS  |  27 tok/s |
```

### 3. Nested List Preservation
Lists with indented children preserve indentation and marker styles (`*`, `-`, or numbered markers):

```javascript
const { stringify, Node } = require('@sullux/markdown-compiler')

const list = {
  type: 'orderedList',
  items: [
    Object.assign([Node.text('Setup')], { indent: 0, order: 1, listType: 'ordered' }),
    Object.assign([Node.text('Sub-step A')], { indent: 2, marker: '*', listType: 'bullet' }),
    Object.assign([Node.text('Deploy')], { indent: 0, order: 2, listType: 'ordered' }),
  ],
}

console.log(stringify(list))
```

Output:

```markdown
1. Setup
  * Sub-step A
2. Deploy
```
