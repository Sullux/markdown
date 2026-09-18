# Multi-Syntax Images & Metadata

Different Markdown editors and static site generators use varying conventions for embedding image dimensions and metadata. `@sullux/markdown-compiler` provides native, zero-configuration support for the four most widely used dimension syntaxes.

## Supported Syntaxes

| Dialect | Syntax | Parsed AST Output |
| :--- | :--- | :--- |
| **Obsidian** | `![Diagram\|400x200](schema.png)` | `{ width: '400px', height: '200px' }` |
| **Pandoc / GitLab** | `![Diagram](schema.png){width=50% height=200px}` | `{ width: '50%', height: '200px' }` |
| **GitHub** | `![Diagram](schema.png){:width="400px"}` | `{ width: '400px' }` |
| **VS Code** | `![Diagram](schema.png =300x150)` | `{ width: '300px', height: '150px' }` |

## Code Example

```javascript
const { parse } = require('@sullux/markdown-compiler')

const markdown = `
# Diagrams

Obsidian style:
![Architecture Diagram|600x350](img/arch.png)

Pandoc responsive:
![Data Flow](img/flow.png){width=75%}

VS Code preview:
![Component](img/component.png =200x100)
`

const doc = parse(markdown)

doc.blocks.forEach((block) => {
  if (Array.isArray(block.children)) {
    block.children.forEach((child) => {
      if (child.type === 'image') {
        console.log(`Image: ${child.url}`)
        console.log(`  Alt: ${child.alt}`)
        console.log(`  Width: ${child.width || 'auto'}`)
        console.log(`  Height: ${child.height || 'auto'}`)
      }
    })
  }
})
```

Output:

```
Image: img/arch.png
  Alt: Architecture Diagram
  Width: 600px
  Height: 350px
Image: img/flow.png
  Alt: Data Flow
  Width: 75%
  Height: auto
Image: img/component.png
  Alt: Component
  Width: 200px
  Height: 100px
```
