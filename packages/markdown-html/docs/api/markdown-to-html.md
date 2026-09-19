# `markdownToHtml(markdown, options)`

The `markdownToHtml` function parses raw Markdown text into a structured AST using `@sullux/markdown-compiler` and renders it into clean, semantic HTML.

## Signature

```javascript
const { markdownToHtml } = require('@sullux/markdown-html')

const html = markdownToHtml(markdown, options)
```

### Parameters

* **`markdown`** (`string`): The raw Markdown source text, optionally containing YAML frontmatter.
* **`options`** (`Object`, optional):
  * **`options.codeRenderers`** (`Record<string, Function>`): Map of language tags to custom code block renderers `(node, options) => string`.
  * **`options.mathBlockRenderer`** (`Function`): Custom renderer for display math blocks `(node, options) => string`. Defaults to `options.codeRenderers.math` if provided, otherwise semantic `<div class="math-display">`.
  * **`options.inlineMathRenderer`** (`Function`): Custom renderer for inline math `(token, options) => string`. Defaults to semantic `<span class="math-inline">`.
  * **`options.tokenizers`** (`Record<string, Function>`): Map of language names to custom syntax tokenizers `(code) => string`.
  * **`options.slugify`** (`Function`): Custom heading slug generator `(rawText, usedSlugsSet) => string`.

### Returns

* **`string`**: The rendered semantic HTML document.

---

## Features & Rendering Behaviors

### 1. Heading IDs and Slugification
Headings automatically receive an `id` attribute generated from their text. If duplicate headings exist within the same document, an incrementing suffix is automatically appended to guarantee unique anchor IDs:

```javascript
const html = markdownToHtml('# Overview\n\n## Section\n\n## Section')
```

Output:
```html
<h1 id="overview">Overview</h1>
<h2 id="section">Section</h2>
<h2 id="section-1">Section</h2>
```

### 2. Built-in Syntax Highlighting
Fenced code blocks are escaped and tokenized with syntax highlighting spans for languages like `js`, `json`, `yaml`, `bash`, `html`, and `sql`:

```html
<pre><code class="language-js"><span class="hl-kw">const</span> <span class="hl-id">pi</span> <span class="hl-punc">=</span> <span class="hl-num">3.14</span><span class="hl-punc">;</span></code></pre>
```

### 3. GitBook & GitHub Callout Banners
Both GitHub callout syntax (`> [!NOTE]`, `> [!WARNING]`, etc.) and GitBook hint tags (`{% hint style="info" %}`) render as styled callout containers:

```html
<div class="callout callout-note">
<div class="callout-title">Note</div>
<p>Important document note.</p>
</div>
```

### 4. Interactive Task Lists
GFM task items are rendered with semantic, read-only HTML checkbox inputs:

```markdown
- [ ] Todo item
- [x] Completed item
```

Rendered HTML:
```html
<ul>
<li><input type="checkbox" disabled /> Todo item</li>
<li><input type="checkbox" checked disabled /> Completed item</li>
</ul>
```

### 5. GFM Tables with Column Alignments
Tables are formatted with `<thead>` and `<tbody>` tags, and column alignments (`left`, `center`, `right`) are passed to cell `align` attributes:

```html
<table>
<thead>
<tr><th align="left">Name</th><th align="right">Count</th></tr>
</thead>
<tbody>
<tr><td align="left">Alpha</td><td align="right">100</td></tr>
</tbody>
</table>
```

### 6. Image Dimension Inline Styles
Image dimension annotations across Obsidian, Pandoc, GitHub, and VS Code syntaxes are converted into inline CSS styles:

```markdown
![Architecture|600x300](arch.png)
```

Rendered HTML:
```html
<p><img src="arch.png" alt="Architecture" style="width: 600px; height: 300px;" /></p>
```

### 7. Frontmatter Stripping
Leading YAML frontmatter enclosed in `---` is parsed and stripped from the rendered HTML output so that metadata is not leaked into presentation prose.

### 8. Math Rendering (LaTeX)
Inline math (`$...$`) and display math blocks (`$$...$$`) render to semantic containers with `data-latex` attributes by default:

```markdown
Formula $E = mc^2$ in prose.

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

Rendered HTML:
```html
<p>Formula <span class="math-inline" data-latex="E = mc^2">$E = mc^2$</span> in prose.</p>

<div class="math-display" data-latex="\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}">$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$</div>
```

Custom math renderers can be supplied via `options.mathBlockRenderer`, `options.inlineMathRenderer`, or `options.codeRenderers.math`.
