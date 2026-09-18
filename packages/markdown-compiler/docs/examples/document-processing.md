# Document Processing

This example demonstrates how to use `@sullux/markdown-compiler` to parse, inspect, transform, and re-stringify Markdown documents in an automated workflow.

## Scenario: Automatic Link Rewriter

Suppose you want to process Markdown files and update all relative image links to use an asset CDN prefix.

```javascript
const { parse, stringify } = require('@sullux/markdown-compiler')

const sourceMarkdown = `---
title: Product Catalog
---

# Catalog

Check out our flagship product:

![Flagship Product](images/flagship.png)

Also see our [accessories](docs/accessories.md).
`

// 1. Parse into AST
const doc = parse(sourceMarkdown)

// 2. Recursive inline visitor function
const rewriteImages = (nodes, cdnBase) =>
  nodes.map((node) => {
    if (node.type === 'image' && !node.url.startsWith('http')) {
      return {
        ...node,
        url: `${cdnBase}/${node.url.replace(/^\/+/, '')}`,
      }
    }
    if (Array.isArray(node.children)) {
      return {
        ...node,
        children: rewriteImages(node.children, cdnBase),
      }
    }
    return node
  })

// 3. Transform blocks
const cdnPrefix = 'https://cdn.sullux.com/assets'
doc.blocks = doc.blocks.map((block) => {
  if (Array.isArray(block.children)) {
    return {
      ...block,
      children: rewriteImages(block.children, cdnPrefix),
    }
  }
  return block
})

// 4. Serialize back to Markdown
const updatedMarkdown = stringify(doc)
console.log(updatedMarkdown)
```

Output:

```markdown
---
title: Product Catalog
---

# Catalog

Check out our flagship product:

![Flagship Product](https://cdn.sullux.com/assets/images/flagship.png)

Also see our [accessories](docs/accessories.md).
```
