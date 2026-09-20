# Custom Code Renderers

`@sullux/markdown-html` allows you to intercept fenced code blocks and provide custom HTML rendering logic on a per-language basis using the `options.codeRenderers` map.

This is especially useful for client-side diagram engines (like Mermaid, Graphviz, or PlantUML), interactive runners, or custom presentation widgets.

## Signature

A code block renderer is a pure function:

```javascript
(node, options) => string
```

### Parameters

* **`node`** (`Object`): The AST code block node:
  * **`node.value`** (`string`): The inner code text.
  * **`node.language`** (`string`): The code block language identifier (e.g. `'mermaid'`).
  * **`node.languageMetadata`** (`string`): Any trailing metadata string after the language identifier.
* **`options`** (`Object`): The options object passed into `markdownToHtml`.

### Returns

* **`string | Object`**: Either an HTML string to replace the block, or a component object `{ html: string, head: string[] }` providing markup and head tags (scripts, stylesheets) to inject into the document.

---

## Example: Mermaid Diagrams

To render Mermaid diagrams into `<div class="mermaid">` containers instead of syntax-highlighted code blocks:

```javascript
const { markdownToHtml } = require('@sullux/markdown-html')

const markdown = `
# Architecture Diagram

\`\`\`mermaid
graph TD;
  A[Client] --> B[API Gateway];
  B --> C[(BucketDB)];
\`\`\`
`

const html = markdownToHtml(markdown, {
  codeRenderers: {
    mermaid: (node) => `<div class="mermaid">${node.value}</div>\n`,
  },
})

console.log(html)
```

Output:

```html
<h1 id="architecture-diagram">Architecture Diagram</h1>
<div class="mermaid">graph TD;
  A[Client] --> B[API Gateway];
  B --> C[(BucketDB)];</div>
```

---

## Example: Interactive Code Playground

You can also pass custom attributes or metadata into interactive components:

```javascript
const { markdownToHtml } = require('@sullux/markdown-html')

const html = markdownToHtml(source, {
  codeRenderers: {
    sandbox: (node) => {
      const encoded = Buffer.from(node.value).toString('base64')
      return `<interactive-runner code="${encoded}"></interactive-runner>\n`
    },
  },
})
```
