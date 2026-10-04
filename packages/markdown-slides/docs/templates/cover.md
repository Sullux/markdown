# Cover Template

The `Cover` template (alias: `Title`) is designed for presentation opening splash screens, section titles, and closing slides.

## Layout Behavior

* **Display Heading**: The first level-1 heading (`#`) is styled with large display typography.
* **Subtitle**: The first level-2 heading (`##`) is rendered as an elegant, accented subtitle.
* **Metadata & Logos**: Additional paragraphs, author lines, and image badges are rendered centered at the bottom of the card.

## Example Markdown

```markdown
---
template: Cover
---
# Channel Inference Engine

## Interactive streaming inference with millisecond memory recall

Charles Sullivan & Natasha Sullivan

![Sullux](https://sullux.com/images/logo-full-email-dark.svg)
```

## Structure

```text
┌──────────────────────────────────────────────┐
│                                              │
│          Channel Inference Engine            │
│                                              │
│   Interactive streaming inference with ...   │
│                                              │
│      Charles Sullivan & Natasha Sullivan     │
│                   [ Logo ]                   │
│                                              │
└──────────────────────────────────────────────┘
```
