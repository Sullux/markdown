# Quick Start

Get started with `@sullux/markdown-html` in your JavaScript or Node.js project.

## Installation

Install via Yarn:

```bash
yarn add @sullux/markdown-html
```

Or via NPM:

```bash
npm install @sullux/markdown-html
```

## Basic Usage

### 1. Converting Markdown to HTML

```javascript
const { markdownToHtml } = require('@sullux/markdown-html')

const markdown = `
# System Architecture

We build with **zero dependencies**.

![Diagram|400x200](diagram.png)

\`\`\`js
const status = 'healthy';
\`\`\`
`

const html = markdownToHtml(markdown)
console.log(html)
```

Output:

```html
<h1 id="system-architecture">System Architecture</h1>
<p>We build with <strong>zero dependencies</strong>.</p>
<p><img src="diagram.png" alt="Diagram" style="width: 400px; height: 200px;" /></p>
<pre><code class="language-js"><span class="hl-kw">const</span> <span class="hl-id">status</span> <span class="hl-punc">=</span> <span class="hl-str">&quot;healthy&quot;</span><span class="hl-punc">;</span></code></pre>
```

### 2. Converting HTML to Markdown

```javascript
const { htmlToMarkdown } = require('@sullux/markdown-html')

const html = `
<h1>System Architecture</h1>
<p>We build with <strong>zero dependencies</strong>.</p>
<p>Visit <a href="https://sullux.com">our website</a> for details.</p>
`

const markdown = htmlToMarkdown(html)
console.log(markdown)
```

Output:

```markdown
# System Architecture

We build with **zero dependencies**.

Visit [our website](https://sullux.com) for details.
```

### 3. Custom Code Block Renderers

You can intercept fenced code blocks and render custom HTML for specific languages (such as Mermaid diagrams):

```javascript
const { markdownToHtml } = require('@sullux/markdown-html')

const md = `
\`\`\`mermaid
graph TD;
  A-->B;
\`\`\`
`

const html = markdownToHtml(md, {
  codeRenderers: {
    mermaid: (node) => `<div class="mermaid">${node.value}</div>\n`,
  },
})

console.log(html)
// <div class="mermaid">graph TD;\n  A-->B;</div>
```
