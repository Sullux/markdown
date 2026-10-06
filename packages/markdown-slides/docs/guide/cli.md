# CLI Reference

`@sullux/markdown-slides` provides a versatile command-line interface under both the full name `markdown-slides` and the convenient short alias `ms`.

## Synopsis

```bash
# Build presentation from current directory
ms

# Build presentation from a specific directory
ms -i ./my-presentation -o ./dist

# Add a new slide with interactive template selector
ms add 04-summary

# Add a new slide with a specific template
ms add 05-conclusion -t Cover

# Update markdown-slides globally to latest release
ms update

# List available built-in and project templates
ms --templates
```

## Commands

### `ms` / `markdown-slides` (Build)

Compiles Markdown slide files into a standalone, offline-ready HTML presentation package with assets, styles, and controls.

```bash
ms [options]
```

| Option | Shorthand | Default | Description |
| :--- | :--- | :--- | :--- |
| `--input <dir>` | `-i` | Current directory | Path to input directory containing `slides.yaml` and slides. |
| `--output <dir>` | `-o` | `<input>/_slides` | Target output directory where `index.html` and assets are written. |
| `--title <title>` | `-t` | Title in `slides.yaml` | Overrides presentation title in browser header and metadata. |
| `--config <file>` | `-c` | `<input>/slides.yaml` | Path to custom YAML configuration file. |
| `--templates` | `-l` | | Lists all available built-in and project-specific custom templates. |
| `--help` | `-h` | | Displays CLI help documentation and exits. |

---

### `ms add <name>` (Add Slide)

Creates a new Markdown slide file pre-populated with standard template boilerplate and automatically registers the slide at the end of `slides.yaml`.

```bash
ms add <name> [options]
```

| Option | Shorthand | Default | Description |
| :--- | :--- | :--- | :--- |
| `<name>` | | *(required)* | Name or filename of the new slide (e.g. `03-features` or `03-features.md`). |
| `--template <name>` | `-t` | Interactive prompt | Specifies the template to use, bypassing the interactive selection menu. |
| `--input <dir>` | `-i` | Current directory | Target slide deck folder where the slide and `slides.yaml` reside. |

#### Interactive Mode

When run without `-t` in an interactive terminal, `ms add` prompts with a numbered choice menu:

```text
$ ms add 04-architecture

Select a slide template:
  1) Title/Content (default)
  2) Header/Columns/Footer
  3) Cover
  4) Split
  5) Media
  6) Quote

Choose template [1-6] (default: 1): 2
Created 04-architecture.md (Header/Columns/Footer) and updated slides.yaml
```

---

### `ms --templates` (List Templates)

Inspects all templates registered in the system:

```bash
# List built-in templates
ms --templates

# List built-in plus custom templates defined in ./my-deck/slides.yaml
ms -i ./my-deck --templates
```

---

### `ms update` (Self-Update)

Updates globally-installed `@sullux/markdown-slides` to the latest version published to npm by automatically running `npm install -g @sullux/markdown-slides@latest`.

```bash
ms update
```
