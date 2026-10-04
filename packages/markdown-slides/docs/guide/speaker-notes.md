# Speaker Notes

`@sullux/markdown-slides` includes built-in speaker notes support via Markdown frontmatter. Notes remain invisible to the audience during normal presentation, but can be viewed by the presenter at any time via a synchronized drawer overlay.

## Writing Notes in Frontmatter

Declare notes in the frontmatter of any slide file using the `notes:` property:

```markdown
---
template: Cover
notes: |
  - Welcome everyone and introduce the agenda.
  - Mention that this project runs with zero external dependencies.
  - Keep this opening slide under 2 minutes.
---
# Channel Inference Engine

## Background & Architecture Review
```

### Multiline Strings

Because `@sullux/markdown-compiler` features a full standard YAML parser, you can use multiline literal block scalars (`|`) or folded blocks (`>`), as well as YAML arrays of bullet points:

```markdown
---
notes:
  - First talking point
  - Second talking point
---
```

*(Note: Standard HTML comments `<!-- ... -->` in slide bodies remain design-time comments that are ignored by the compiler and omitted from output HTML).*

## Viewing Speaker Notes

During presentation, toggle the notes drawer with either of the following:

* Press **`S`** on the keyboard (or **`Esc`** to close).
* Click the **📝** icon in the floating presentation control bar.

The notes drawer slides up from the bottom of the screen with a blurred translucent backdrop. As you navigate forward or backward across slides, the drawer automatically syncs its content to match the currently displayed slide (or displays *"No notes for this slide"*).

## Print & PDF Export

When printing or exporting slides to PDF via your browser's Print dialog (`Ctrl+P` / `Cmd+P`), speaker notes are automatically hidden to ensure clean, publication-ready slide prints.
