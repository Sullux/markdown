# Path to 100% CommonMark 0.31.2 Conformance

This document outlines the architectural assessment and remaining work required for `@sullux/markdown-compiler` to achieve 100% compliance with the [CommonMark 0.31.2 Specification](https://spec.commonmark.org/0.31.2/), verified against the official 652 conformance test cases (`spec.json`).

---

## Current Status (v2.0.0)

With the v2.0.0 refactor, the compiler adheres to CommonMark block structure concepts:
* Universal container block symmetry (`children: Node[]` across `blockquote`, `callout`, `bulletList`, `orderedList`, `listItem`).
* Hierarchical list nesting with first-class `listItem` containers.
* Support for tight vs. loose list semantics and ordered list `start` counters.
* Seamless coexistence with production extensions (YAML frontmatter, GFM tables, task list items, LaTeX math blocks, multi-syntax image dimensions, and Type 6 raw HTML blocks).

---

## Remaining Compliance Work

### 1. Lexical & Character-Level Normalization (§2)

CommonMark requires input preprocessing before block parsing:

* **Line Endings (§2.1):** Normalize `\r\n` and lone `\r` to `\n`.
* **Tab Expansion (§2.2):** Expand tabs to spaces based on 4-space tab stops dependent on column position, rather than naive fixed replacement.
* **Null Characters (§2.3):** Replace `U+0000` with `U+FFFD` (Replacement Character).
* **Character Escapes (§2.4):** Backslash escapes (`\`) preceding any of the 32 ASCII punctuation characters (`\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~`) must be treated as literal characters across blocks and inlines.
* **Entity References (§2.5):** Named HTML entities (e.g., `&copy;`, `&amp;`), decimal (`&#1234;`), and hexadecimal (`&#x12ab;`) references must be decoded or preserved without breaking inline delimiter parsing.

### 2. Leaf Block Additions (§4)

* **Indented Code Blocks (§4.4):** Any line indented by 4 spaces (or 1 tab) that is not part of a list continuation or container block must parse as an indented code block.
* **Setext Headings (§4.3):** Underlined headings using `===` (H1) and `---` (H2) underneath a line of text. Requires disambiguation from thematic breaks and YAML frontmatter.
* **Thematic Breaks (§4.1):** Support up to 3 spaces of leading indentation and spaces between characters (e.g., `- - -`, `*   *   *`).
* **Complete HTML Block Types (§4.6):** Support all 7 HTML block types:
  * *Type 1:* `<script>`, `<pre>`, `<style>` (terminated by corresponding closing tag).
  * *Type 2:* Comments (`<!-- ... -->`).
  * *Type 3:* Processing instructions (`<? ... ?>`).
  * *Type 4:* Declarations (`<!DOCTYPE ...>`, `<![A-Z]...>`).
  * *Type 5:* CDATA sections (`<![CDATA[...]]>`).
  * *Type 6:* Standard block tags (`<p>`, `<div>`, `<table>`, `<ul>`, etc. — *currently supported*).
  * *Type 7:* Complete open/close HTML tags not interrupted by blank lines.
* **Link Reference Definitions (§4.7):** Standalone leaf blocks formatted as `[label]: /url "title"`. They do not render directly to HTML, but populate a document dictionary used by inline reference links (`[text][label]` and `[ref]`).

### 3. Container Block Refinements (§5)

* **Paragraph Interruption Rules (§5.2 & §5.3):**
  * Bullet lists can interrupt an ongoing paragraph; ordered lists cannot unless their starting number is `1.`.
  * Thematic breaks, ATX headers, and fenced code blocks interrupt paragraphs; indented code blocks cannot.
* **Lazy Continuation Lines (§5.2.1):**
  * In blockquotes and list items, lines that omit the `>` marker or list indentation can continue the preceding paragraph under specific conditions.
* **Strict Tight vs. Loose Rules (§5.3):**
  * A list is loose if any of its items contain two blocks separated by a blank line, or if a blank line separates list items.

### 4. Inline Parsing Engine (§6) — Delimiter Stack Engine

Our current inline parser uses sequential regular expressions. Full compliance requires moving to a token/delimiter-stack parser:

* **Delimiter Run Algorithm (§6.4):**
  * Implementation of left-flanking and right-flanking delimiter run rules for `*` and `_`.
  * Unicode-aware whitespace and punctuation boundary checks (e.g., `foo_bar_baz` is not italicized, while `foo*bar*baz` is).
  * Nested alternating emphasis (`***bold and italic***`, `**bold *italic* bold**`).
* **Code Spans (§6.3):**
  * Arbitrary backtick counts for escaping backticks (e.g., ` ``code with ` inside`` `).
  * Leading and trailing space stripping rules inside code spans.
* **Reference Links & Shortcut Links (§6.5):**
  * Full resolution of `[text][ref]`, `[ref][]`, and `[ref]` against Link Reference Definitions.
* **Balanced Parentheses in Link URLs (§6.5):**
  * Support balanced nested parentheses in URLs, e.g. `[wiki](http://example.com/wiki/(disambiguation))`.
* **Autolinks (§6.7):**
  * Automatic detection and parsing of `<http://...>` and `<user@example.com>`.
* **Hard & Soft Line Breaks (§6.9 & §6.10):**
  * Two trailing spaces or a trailing `\` at the end of a line emits a hard break (`<br />`).
  * Single newlines emit soft breaks (space or newline).

---

## Phased Implementation Plan

| Phase | Areas | Modules Involved | Estimated Effort |
| :--- | :--- | :--- | :--- |
| **Phase 1: Normalization & Leaf Blocks** | Character normalization, tabs, Setext headers, indented code blocks, complete HTML block types, link reference definitions | `lib/parser/preprocess.js`, `header.js`, `code.js`, `html.js`, `link-defs.js` | Moderate |
| **Phase 2: Delimiter Stack Inline Engine** | Emphasis flanking rules, arbitrary backtick spans, autolinks, reference links, balanced URL parentheses | `lib/parser/inline.js`, `delimiter-stack.js`, `inline-links.js` | High |
| **Phase 3: Conformance Test Suite** | Import official `spec.json` (652 test cases) and integrate progressive compliance reporting | `test/commonmark.test.js` | Automated |
