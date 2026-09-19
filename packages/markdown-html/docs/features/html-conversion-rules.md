# HTML to Markdown Conversion Rules

When transforming HTML content into Markdown, `@sullux/markdown-html` applies a deterministic set of structural rules to produce clean, readable GitHub Flavored Markdown (GFM).

## Element Mapping Reference

| HTML Element | Markdown Syntax | Notes |
| :--- | :--- | :--- |
| `<h1>` | `# Heading 1` | Standard ATX header |
| `<h2>` | `## Heading 2` | Standard ATX header |
| `<h3>` | `### Heading 3` | Standard ATX header |
| `<h4>` | `#### Heading 4` | Standard ATX header |
| `<h5>` | `##### Heading 5` | Standard ATX header |
| `<h6>` | `###### Heading 6` | Standard ATX header |
| `<p>` | Paragraph text | Separated by double newlines |
| `<strong>`, `<b>` | `**text**` | Bold emphasis |
| `<em>`, `<i>` | `*text*` | Italic emphasis |
| `<code>` | `` `code` `` | Inline code snippet |
| `<pre><code>` | ```` ```lang ... ``` ```` | Fenced code block |
| `<del>`, `<s>`, `<strike>` | `~~text~~` | Strikethrough |
| `<a>` | `[text](url)` | Anchor link |
| `<img>` | `![alt](url)` | Image |
| `<ul>`, `<li>` | `* item` | Unordered bullet list |
| `<ol>`, `<li>` | `1. item` | Ordered list |
| `<blockquote>` | `> text` | Blockquote |
| `<hr>` | `---` | Horizontal rule |
| `<br>` | Two trailing spaces + newline | Soft line break |
| `<table>` | GFM Pipe Table | Header row, delimiter row, body rows |

## CSS Style Rules

Inline CSS styles on generic containers (`<div>`, `<span>`) are mapped as follows:

* **`font-weight: bold | 700 | 800 | 900`**: Wrapped in `**` (bold).
* **`font-style: italic`**: Wrapped in `*` (italic).
* **`font-weight: bold` AND `font-style: italic`**: Wrapped in `***` (bold italic).
* **`text-decoration: line-through`**: Wrapped in `~~` (strikethrough).
* **`font-size >= 24px`**: Promoted to `#` (Header 1).
* **`font-size >= 18px`**: Promoted to `###` (Header 3).

## Sanitation & Cleaning Heuristics

1. **Tag Stripping:** Elements that have no presentation meaning in Markdown (such as `<script>`, `<style>`, `<meta>`, `<head>`, `<noscript>`) and comments (`<!-- -->`) are discarded.
2. **Entity Normalization:** Standard HTML entities are decoded to UTF-8 characters (e.g., `&amp;` $\to$ `&`, `&nbsp;` $\to$ non-breaking space, `&quot;` $\to$ `"`).
3. **Table Flattening:** Tables used purely for email layout (e.g. empty spacer rows, borderless wrapper tables) are collapsed into standard flow blocks.
