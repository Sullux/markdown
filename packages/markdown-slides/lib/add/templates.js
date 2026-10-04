const TEMPLATE_BOILERPLATES = {
  'Title/Content': `---
template: Title/Content
---
# Slide Title

Write slide content here.
`,
  'Header/Columns/Footer': `---
template: Header/Columns/Footer
---
# Slide Header

---

### Left Column
Left column content.

---

### Right Column
Right column content.

---

Footer note or summary.
`,
  Cover: `---
template: Cover
---
# Presentation Title

## Subtitle or Topic Description

Author Name
`,
  Split: `---
template: Split
---
### Left Content
Detailed explanation or text.

---

### Right Content
Image, diagram, or supporting details.
`,
  Media: `---
template: Media
---
![Diagram or Screenshot](images/diagram.svg)
`,
  Quote: `---
template: Quote
---
> "Simplicity is prerequisite for reliability."
>
> — Edsger W. Dijkstra
`,
}

const getBoilerplate = (templateName = 'Title/Content') =>
  TEMPLATE_BOILERPLATES[templateName] ||
  `---
template: ${templateName}
---
# New Slide

Content goes here.
`

module.exports = {
  TEMPLATE_BOILERPLATES,
  getBoilerplate,
}
