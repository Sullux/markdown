# Markdown Features & Extensions

`@sullux/markdown-docs` inherits all AST parsing and HTML rendering capabilities from `@sullux/markdown-compiler` and `@sullux/markdown-html`.

## Fenced Code Blocks & Syntax Highlighting

Code blocks with language tags are automatically syntax-highlighted using clean CSS variables:

```javascript
const { generateSite } = require('@sullux/markdown-docs')

const site = generateSite({ input: './docs', output: './_site' })
```

Supported languages include `javascript`, `js`, `json`, `html`, `yaml`, `yml`, `sql`, and `bash`.

## Callout Boxes

Supports GitHub callouts (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`, `> [!IMPORTANT]`) and GitBook hint blocks (`{% hint style="info" %}`):

> [!NOTE]
> Callout boxes render with accent borders and subtle background fills matching your active color theme.

> [!WARNING]
> Be sure to verify all relative asset paths when referencing custom images.

## GFM Tables

GitHub Flavored Markdown tables are rendered with custom headers, borders, and column alignment:

| Feature | Status | Native |
| :--- | :---: | ---: |
| Client-Side Search | Enabled | Yes |
| Dual Theme Switcher | Enabled | Yes |
| Zero Dependencies | Verified | Yes |

## Custom Image Dimensions

Supports Obsidian (`![[image.png|300x200]]`), Pandoc (`![alt](img.png){width=300px}`), and GitHub image dimension syntaxes.
