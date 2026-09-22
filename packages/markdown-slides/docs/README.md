<p align="center">
  <img src="logo.svg" alt="Markdown Slides" width="160" height="160" />
</p>

# Introduction to `markdown-slides`

`@sullux/markdown-slides` is a lightweight, zero-dependency, local-first presentation slide deck generator compiling Markdown directories into responsive, modular, template-driven HTML slide presentations.

Designed around strict local-first, low-overhead principles, `@sullux/markdown-slides` provides an elegant developer-first presentation workflow. Presenters can version-control their slide decks in Git, reuse slide modules across multiple presentations, and compile self-contained presentations that run offline in any web browser.

## Key Design Principles

* **Zero Dependencies:** Auditable Vanilla JS implementation with zero third-party packages or runtime bloat.
* **Separation of Presentation Concerns:** Pure Markdown content feeds into composable template pipelines.
* **Template-Driven Layouts:** No clunky HTML layout tags or complex CSS in your Markdown. The template determines how slide partitions and headings are rendered.
* **Modular Slide Hierarchy:** Decks can include subfolders containing their own `slides.yaml`, enabling frictionless reuse of slide sections across projects.
* **Symmetric Ecosystem Parity:** Seamlessly renders LaTeX math, Mermaid diagrams, and syntax-highlighted code blocks via `@sullux/markdown-html`.
* **Print & PDF Ready:** Built-in `@media print` support enables crisp, one-slide-per-page PDF exports directly from any browser.
