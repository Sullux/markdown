# `parse(markdownText)`

The `parse` function compiles raw Markdown text into a structured Document AST.

## Signature

```javascript
const { parse } = require('@sullux/markdown-compiler')

const ast = parse(markdownText)
```

### Parameters

* **`markdownText`** (`string`): The raw Markdown text to parse, including optional YAML frontmatter.

### Returns

* **`Document`** (`Object`):
  * **`frontmatter`** (`Object`): Key-value pairs parsed from the document's leading YAML frontmatter block (if present); empty object `{}` if absent.
  * **`blocks`** (`Array<BlockNode>`): Array of top-level structural block nodes.

## Behavior & Features

### 1. Frontmatter Extraction
Leading YAML frontmatter enclosed by `---` delimiters is parsed and returned on the `frontmatter` property:

```javascript
const doc = parse(`---
title: Project Report
tags:
  - architecture
  - local-first
---

# Summary
Prose content goes here.
`)

console.log(doc.frontmatter.title) // 'Project Report'
console.log(doc.frontmatter.tags)  // ['architecture', 'local-first']
```

### 2. Multi-Syntax Image Dimensions
Dimensions specified across popular Markdown dialects are automatically parsed into `width` and `height` properties with standard units (defaulting to `px` when numbers are bare):

```javascript
const doc = parse(`
![Obsidian|300x150](photo.png)
![Pandoc](photo.png){width=80%}
![GitHub](photo.png){:width="400px"}
![VS Code](photo.png =250x100)
`)

const images = doc.blocks[0].children
console.log(images[0].width, images[0].height) // '300px', '150px'
console.log(images[1].width)                  // '80%'
console.log(images[2].width)                  // '400px'
console.log(images[3].width, images[3].height) // '250px', '100px'
```

### 3. Nested Lists & Container Hierarchy
Hierarchical lists strictly follow CommonMark container block rules. A list contains `listItem` nodes in `children`, and nested sub-lists reside inside the parent `listItem.children`:

```javascript
const doc = parse(`
1. Setup environment
2. Build binary
   * Check Vulkan drivers
   * Verify SPIR-V tools
3. Launch service
`)

const list = doc.blocks[0]
console.log(list.type)             // 'orderedList'
console.log(list.children.length)  // 3 list items

const item2 = list.children[1]
console.log(item2.children[0].type) // 'paragraph' (Build binary)
console.log(item2.children[1].type) // 'bulletList' (sub-list with 2 items)
```

### 4. Code Block Metadata
Fenced code blocks capture language tags and any trailing attribute strings into `languageMetadata`:

```javascript
const doc = parse(`
\`\`\`javascript title="app.js" linenums="1"
console.log('Hello');
\`\`\`
`)

const code = doc.blocks[0]
console.log(code.language)         // 'javascript'
console.log(code.languageMetadata) // 'title="app.js" linenums="1"'
```
