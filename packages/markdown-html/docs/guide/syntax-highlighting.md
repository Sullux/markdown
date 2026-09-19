# Syntax Highlighting

`@sullux/markdown-html` includes a built-in, zero-dependency code syntax highlighter that operates at compile time without requiring bulky runtime highlighting libraries.

## Supported Languages

The following language aliases are supported out of the box:

| Language | Aliases | Description |
| :--- | :--- | :--- |
| **JavaScript** | `js`, `javascript` | Keywords, strings, numbers, comments, punctuation, identifiers |
| **JSON** | `json` | Keys, strings, numbers, booleans, null |
| **YAML** | `yaml`, `yml` | Keys, values, strings, numbers, comments |
| **Bash / Shell** | `bash`, `sh`, `zsh` | Commands, flags, strings, variables, comments |
| **HTML / XML** | `html`, `xml` | Tags, attributes, strings, comments |
| **SQL** | `sql` | Keywords, operators, strings, numbers, comments |

## Output Token Classes

Highlighted code is wrapped in `<pre><code class="language-{lang}">` and uses standard CSS class names for styling:

| CSS Class | Token Type | Example |
| :--- | :--- | :--- |
| `.hl-kw` | Keyword | `const`, `function`, `SELECT`, `if` |
| `.hl-str` | String Literal | `"hello"`, `'value'` |
| `.hl-num` | Number | `42`, `3.14` |
| `.hl-comment` | Comment | `// comment`, `/* ... */`, `# comment` |
| `.hl-punc` | Punctuation / Operator | `{`, `}`, `;`, `=`, `=>` |
| `.hl-id` | Identifier / Function | `myVar`, `calculateTotal` |
| `.hl-tag` | HTML/XML Tag Name | `div`, `span`, `table` |
| `.hl-attr` | HTML/XML Attribute Name | `class`, `href`, `id` |

## Adding Custom Tokenizers

You can supply custom tokenizers or override existing ones using the `options.tokenizers` object:

```javascript
const { markdownToHtml } = require('@sullux/markdown-html')

const customTokenizers = {
  python: (code) => {
    // Custom zero-dependency tokenizer returning HTML spans
    return code.replace(/\b(def|return|import)\b/g, '<span class="hl-kw">$1</span>')
  },
}

const md = '```python\ndef greet():\n    return "hello"\n```'
const html = markdownToHtml(md, { tokenizers: customTokenizers })
```
