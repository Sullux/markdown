# Node Builder DSL

`@sullux/markdown-compiler` exports a `Node` object containing factory functions for generating valid AST nodes programmatically.

## Importing

```javascript
const { Node } = require('@sullux/markdown-compiler')
```

## Block Factories

* **`Node.header(level, children)`**: Creates a header node (`level`: 1–6).
* **`Node.paragraph(children)`**: Creates a paragraph block node.
* **`Node.listItem(children, checked)`**: Creates a list item container node (`checked`: optional boolean).
* **`Node.bulletList(children, tight)`**: Creates an unordered bullet list container node.
* **`Node.orderedList(children, start, tight)`**: Creates a numbered ordered list container node (`start`: default 1).
* **`Node.codeBlock(language, value)`**: Creates a fenced code block node.
* **`Node.mathBlock(value)`**: Creates a LaTeX display math block node.
* **`Node.blockquote(children)`**: Creates a blockquote node.
* **`Node.callout(style, title, children)`**: Creates a callout box node (e.g. `'note'`, `'warning'`).
* **`Node.table(alignments, rows)`**: Creates an aligned table node.
* **`Node.html(value)`**: Creates a raw block-level HTML node.
* **`Node.hr()`**: Creates a horizontal rule / thematic break node.

## Inline Factories

* **`Node.text(value)`**: Creates a plain text inline node.
* **`Node.bold(children)`**: Creates a strong bold inline node.
* **`Node.italic(children)`**: Creates an emphasized italic inline node.
* **`Node.strikethrough(children)`**: Creates a strikethrough inline node.
* **`Node.code(value)`**: Creates an inline code snippet node.
* **`Node.link(url, children)`**: Creates a hyperlink node.
* **`Node.wikilink(target, display)`**: Creates a wikilink node (`[[target|display]]`).
* **`Node.image(url, alt)`**: Creates an image node.
* **`Node.checkbox(checked)`**: Creates a task list checkbox node.
* **`Node.inlineMath(value)`**: Creates an inline LaTeX math node (`$value$`).
* **`Node.html(value)`**: Creates a raw inline HTML node.
* **`Node.br()`**: Creates a line-break node.

## Example: Composing an AST

```javascript
const { Node, stringify } = require('@sullux/markdown-compiler')

const doc = {
  frontmatter: { title: 'System Plan' },
  blocks: [
    Node.header(1, [Node.text('System Plan')]),
    Node.paragraph([
      Node.text('Follow these '),
      Node.bold([Node.text('important')]),
      Node.text(' instructions:'),
    ]),
    Node.bulletList([
      Node.listItem([Node.paragraph([Node.text('Review architecture document')])]),
      Node.listItem([Node.paragraph([Node.text('Execute test suite')])]),
      Node.listItem([Node.paragraph([Node.text('Deploy service')])]),
    ]),
  ],
}

console.log(stringify(doc))
```
