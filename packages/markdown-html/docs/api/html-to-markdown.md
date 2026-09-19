# `htmlToMarkdown(htmlString)`

The `htmlToMarkdown` function converts HTML documents, fragments, emails, or CMS content back into clean, canonical GitHub Flavored Markdown (GFM).

## Signature

```javascript
const { htmlToMarkdown } = require('@sullux/markdown-html')

const markdown = htmlToMarkdown(htmlString)
```

*(Note: `toMarkdown` is exported as an alias of `htmlToMarkdown`)*

### Parameters

* **`htmlString`** (`string`): The HTML markup to parse and convert.

### Returns

* **`string`**: Clean, canonical Markdown representation.

---

## Behavior & Conversion Pipeline

`htmlToMarkdown` tokenizes HTML, parses structural DOM trees, normalizes cascading inline styles, and maps nodes into `@sullux/markdown-compiler` AST nodes before compiling them into canonical Markdown.

### 1. Stripping Script, Style, and Comment Tags
Irrelevant or unsafe tags such as `<script>`, `<style>`, and HTML comments (`<!-- ... -->`) are stripped automatically:

```javascript
const html = '<!-- comment --><p>Content</p><script>alert(1)</script>'
console.log(htmlToMarkdown(html))
// Content
```

### 2. Typographic Tags & Inline CSS Styles
Standard semantic tags (`<strong>`, `<b>`, `<em>`, `<i>`, `<code>`, `<s>`, `<del>`) and inline CSS styles (`style="font-weight: bold; font-style: italic;"`) are normalized into Markdown delimiters:

```javascript
const html = `
<p>Hello <strong>bold world</strong> and <em>italicized text</em> with <code>inline code</code>.</p>
<p><span style="font-weight: 700; font-style: italic;">Styled span</span></p>
`
console.log(htmlToMarkdown(html))
```

Output:
```markdown
Hello **bold world** and *italicized text* with `inline code`.

***Styled span***
```

### 3. Header Promotion from Styled Elements
Large font styles applied to generic `<div>` or `<p>` containers are promoted to Markdown headers:

* `font-size >= 24px`: Promoted to Level 1 Header (`#`)
* `font-size >= 18px`: Promoted to Level 3 Header (`###`)

```javascript
const html = '<div style="font-size: 28px; font-weight: bold;">Big Header</div>'
console.log(htmlToMarkdown(html))
// # Big Header
```

### 4. Links, Images, and Breaks
* Anchors (`<a href="URL">text</a>`) are transformed into `[text](URL)`.
* Images (`<img src="URL" alt="text" />`) are converted into `![text](URL)`.
* Line breaks (`<br />`) are converted into Markdown soft breaks (two trailing spaces).

### 5. Nested Lists & Blockquotes
Deeply nested ordered lists, unordered lists, and blockquotes maintain their structural hierarchy and quote markers:

```javascript
const html = `
<blockquote>
  <p>Quote title:</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2 with <strong>bold</strong></li>
  </ul>
</blockquote>
`
console.log(htmlToMarkdown(html))
```

Output:
```markdown
> Quote title:
> 
> * Item 1
> * Item 2 with **bold**
```

### 6. GFM Tables & Alignment Detection
Tables are converted to GFM table formatting with proper delimiter alignment rows. Column alignment is extracted from `align` attributes (`align="center"`) or CSS text alignment (`style="text-align: right"`):

```javascript
const html = `
<table>
  <thead>
    <tr><th align="left">Name</th><th style="text-align: right">Price</th></tr>
  </thead>
  <tbody>
    <tr><td>Widget</td><td>$10.00</td></tr>
  </tbody>
</table>
`
console.log(htmlToMarkdown(html))
```

Output:
```markdown
| Name   |  Price |
| :----- | -----: |
| Widget | $10.00 |
```

### 7. Entity Decoding
Named entities (`&nbsp;`, `&amp;`, `&ldquo;`, `&rdquo;`, `&lt;`, `&gt;`) and hexadecimal/decimal numeric entities (`&#39;`, `&#x26;`) are automatically decoded to standard Unicode text.

### 8. Layout Table Flattening
Empty table cells, spacer rows, and single-cell layout wrappers used in email markup are collapsed and flattened into clean prose.

---

## Low-Level Helper Exports

For advanced use cases, `@sullux/markdown-html` also exports the underlying parser and AST converter:

* **`parseHtml(htmlString)`**: Parses an HTML string into a lightweight DOM tree.
* **`toAst(htmlTree)`**: Converts a parsed HTML DOM tree into a `@sullux/markdown-compiler` AST.
