# Title/Content Template

The `Title/Content` template (alias: `Standard`) is the default slide layout in `@sullux/markdown-slides`. It provides a structured top header bar and a spacious, scroll-safe body area.

## Layout Behavior

* **Top Header**: The first top-level header (`# Title`) is extracted and rendered into a distinct, accented `<header class="slide-header">` bar.
* **Content Body**: All subsequent blocks (paragraphs, lists, code blocks, images, tables) are rendered into a responsive `<div class="slide-body">` container with consistent typography and padding.

## Example Markdown

```markdown
---
template: Title/Content
---
# High-Throughput Inference

The inference engine runs in pure JavaScript with zero dependencies:

- Sub-millisecond cold start times
- Full streaming response support
- Microsecond memory recall

```javascript
import { createEngine } from '@sullux/channel'
const engine = createEngine({ model: 'phi-3' })
```
```

## Structure

```text
┌──────────────────────────────────────────────┐
│  High-Throughput Inference                   │
├──────────────────────────────────────────────┤
│  The inference engine runs in pure           │
│  JavaScript with zero dependencies:          │
│                                              │
│  • Sub-millisecond cold start times          │
│  • Full streaming response support           │
│                                              │
│  [ Code Block ]                              │
└──────────────────────────────────────────────┘
```
