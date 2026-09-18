# Node Builder DSL

`@sullux/markdown-compiler` exports a `Node` object containing factory functions for generating valid AST nodes programmatically.

## Importing

```javascript
const { Node } = require('@sullux/markdown-compiler')
```

## Block Factories

* **`Node.header(level, children)`**: Creates a header node (`level`: 1–6).
* **`Node.paragraph(children)`**: Creates a paragraph block node.
* **`Node.bulletList(items)`**: Creates an unordered bullet list block node.
* **`Node.orderedList(items)`**: Creates a numbered ordered list block node.
* **`Node.codeBlock(language, value)`**: Creates a fenced code block node.
* **`Node.blockquote(children)`**: Creates a blockquote node.
* **`Node.callout(style, title, children)`**: Creates a callout box node (e.g. `'note'`, `'warning'`).
* **`Node.table(alignments, rows)`**: Creates an aligned table node.
* **`Node.hr()`**: Creates a horizontal rule node.

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
      [Node.text('Review architecture document')],
      [Node.text('Execute test suite')],
      [Node.text('Deploy service')],
    ]),
  ],
}

console.log(stringify(doc))
```
