# Custom Templates & Composition

Custom templates allow you to define custom slide layouts, corporate watermarks, branding frames, and dynamic transformations in pure JavaScript.

## Template Function Signature

A template is a pure JavaScript function that takes a pipeline state and context object, returning the updated state:

```javascript
const myWatermark = (state, context) => {
  const watermarkHtml = `<div class="watermark">${context.title}</div>`
  return {
    ...state,
    html: `<div class="deck-frame">${state.html}${watermarkHtml}</div>`,
    head: [
      ...state.head,
      '<style>.watermark { position: absolute; bottom: 16px; right: 24px; opacity: 0.5; }</style>',
    ],
  }
}

module.exports = {
  'My Watermark': myWatermark,
}
```

## Pipeline State Object

* **`state.ast`**: The parsed Markdown AST for the slide.
* **`state.html`**: The compiled HTML string for the slide content.
* **`state.head`**: Array of `<style>`, `<script>`, or `<link>` tags required by the slide.
* **`context`**: Metadata including `title`, `theme`, `slideIndex`, `totalSlides`, and configuration options from `slides.yaml`.

## Registering in `slides.yaml`

Import your custom template module in `slides.yaml`:

```yaml
templates:
  - ./my-custom-templates.js

template:
  - My Watermark
  - Title/Content
```
