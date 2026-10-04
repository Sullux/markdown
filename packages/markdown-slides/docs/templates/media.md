# Media Template

The `Media` template (alias: `FullBleed`) removes standard slide margins and padding, providing an edge-to-edge canvas for large diagrams, architectural maps, photos, and video embeds.

## Layout Behavior

* Removes outer margin and container padding.
* Automatically scales images and embedded containers to fit comfortably within the 16:9 or 4:3 slide canvas while maintaining aspect ratio.

## Example Markdown

```markdown
---
template: Media
---
![System Architecture Diagram](images/system-architecture.svg)
```

## Structure

```text
┌──────────────────────────────────────────────┐
│                                              │
│         [ Full-Bleed High Resolution         │
│             Architecture Diagram ]           │
│                                              │
└──────────────────────────────────────────────┘
```
