# Image Dimensions & Styling

When authoring Markdown across different editors and platforms, developers often encounter varying conventions for specifying image sizes. `@sullux/markdown-html` translates dimensions from all major dialects into standard inline CSS `style` attributes.

## Supported Dialects

The following Markdown dimension syntaxes are parsed by `@sullux/markdown-compiler` and transformed by `@sullux/markdown-html`:

| Dialect | Markdown Syntax | Rendered HTML Output |
| :--- | :--- | :--- |
| **Obsidian** | `![Diagram\|400x200](arch.png)` | `<img src="arch.png" alt="Diagram" style="width: 400px; height: 200px;" />` |
| **Pandoc / GitLab** | `![Diagram](arch.png){width=50% height=200px}` | `<img src="arch.png" alt="Diagram" style="width: 50%; height: 200px;" />` |
| **GitHub** | `![Diagram](arch.png){:width="400px"}` | `<img src="arch.png" alt="Diagram" style="width: 400px;" />` |
| **VS Code** | `![Diagram](arch.png =300x150)` | `<img src="arch.png" alt="Diagram" style="width: 300px; height: 150px;" />` |

## Unit Normalization

* Bare numerical dimensions (e.g. `400x200` or `=300x150`) automatically resolve to `px` units (`width: 400px; height: 200px;`).
* Percentage units (e.g. `width=80%`) and explicit pixel units are preserved as specified.
* Images without dimension annotations render standard attributes: `<img src="url" alt="alt" />` with no inline `style` attribute.
