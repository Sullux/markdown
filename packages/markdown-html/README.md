# @sullux/markdown-html

A high-performance, bidirectional Markdown $\leftrightarrow$ HTML compiler supporting GitHub-Flavored Markdown (GFM), GitBook hints, pluggable code block renderers, built-in syntax highlighting, and custom image dimensions.

Part of the Sullux markdown suite, `@sullux/markdown-html` relies on `@sullux/markdown-compiler` for AST parsing and stringifying, ensuring zero dependencies and fully auditable code.

## Core Features

* **Bidirectional Transformations:**
  * `markdownToHtml(markdown, options)`: Renders AST-driven semantic HTML.
  * `htmlToMarkdown(html)`: Converts HTML documents/emails back to clean GFM Markdown.
* **Pluggable Code Block Renderers:** Register custom handlers for languages like `mermaid`, `dot`, or bespoke blocks via `options.codeRenderers`.
* **Built-in Zero-Dependency Syntax Highlighting:**
  * Out-of-the-box tokenizers for `js`, `json`, `yaml`, `bash`, `html`, and `sql`.
  * Customizable and overridable via `options.tokenizers`.
* **Image Dimension Styling:** Multi-syntax dimension support (Obsidian `|400x200`, Pandoc/GitLab `{width=50%}`, GitHub `{:width="400px"}`, VS Code `=300x200`) rendered as inline CSS (`style="width: 400px; height: 200px;"`).
* **Rich Component Support:**
  * Auto-slugified heading IDs with deduplication (`<h2 id="section-one-1">`).
  * Callouts (`> [!NOTE]`, `{% hint %}`).
  * Task list checkboxes (`- [ ]`, `- [x]`).
  * GFM tables with column alignment attributes (`<th align="center">`).
  * YAML frontmatter stripping.

## Folder Topography

```
packages/markdown-html/
├── lib/
│   ├── markdown-to-html/     # Markdown -> AST -> HTML renderer (<100 lines each)
│   │   ├── index.js
│   │   ├── render-block.js
│   │   ├── render-inline.js
│   │   ├── slugify.js
│   │   ├── escape.js
│   │   └── highlight/        # Zero-dependency language tokenizers
│   │       ├── index.js
│   │       ├── js.js
│   │       ├── json.js
│   │       ├── yaml.js
│   │       ├── bash.js
│   │       ├── html.js
│   │       └── sql.js
│   └── html-to-markdown/     # HTML -> AST -> Markdown compiler (<100 lines each)
│       ├── index.js
│       ├── parse-html.js
│       ├── ast-builder.js
│       ├── block-builder.js
│       ├── block-table.js
│       ├── inline-builder.js
│       └── utils.js
├── index.js                  # Package entrypoint
└── package.json              # Package manifest
```

## Programmatic Usage

### 1. Converting Markdown to HTML with Options

```javascript
const { markdownToHtml } = require('@sullux/markdown-html')

const md = `
# System Spec

![Diagram|400x200](schema.png)

\`\`\`js
const name = "Sullux";
\`\`\`

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
/* Output includes:
<h1 id="system-spec">System Spec</h1>
<p><img src="schema.png" alt="Diagram" style="width: 400px; height: 200px;" /></p>
<pre><code class="language-js"><span class="hl-kw">const</span> <span class="hl-id">name</span> <span class="hl-punc">=</span> <span class="hl-str">&quot;Sullux&quot;</span><span class="hl-punc">;</span></code></pre>
<div class="mermaid">graph TD;
  A-->B;</div>
*/
```

### 2. Converting HTML back to Markdown

```javascript
const { htmlToMarkdown } = require('@sullux/markdown-html')

const htmlInput = '<h1>Title</h1><p>This is <strong>bold</strong> text with <a href="https://sullux.com">a link</a>.</p>'
const markdown = htmlToMarkdown(htmlInput)

console.log(markdown)
/* Output:
# Title

This is **bold** text with [a link](https://sullux.com).
*/
```

## Running Unit Tests

```bash
yarn test
```
