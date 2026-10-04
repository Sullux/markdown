# Speaker Notes & Presenter View

`@sullux/markdown-slides` includes built-in speaker notes support via Markdown frontmatter. Notes remain invisible to the audience during normal presentation, and can be viewed either via an on-screen drawer overlay or in a dedicated **synchronized dual-screen Presenter Window**.

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

---

## Dual-Screen Presenter Window

For live presentations where you want your notes on your laptop screen while projecting the full slides to your audience, press **`P`** (or click the **🖥️** button in the control bar).

This pops out a separate, fully synchronized Presenter Window:

```text
┌──────────────────────────────────────┬────────────────────────────────────────┐
│  CURRENT SLIDE                       │  ELAPSED: 00:12:45   [Reset]           │
│  ┌────────────────────────────────┐  │  CLOCK: 14:35   SLIDE: 3 / 14          │
│  │                                │  ├────────────────────────────────────────┤
│  │  [ Current Slide Live Preview] │  │  SPEAKER NOTES (Large Typography)      │
│  │                                │  │                                        │
│  └────────────────────────────────┘  │  • Introduce the memory recall latency.│
├──────────────────────────────────────┤  │  • Emphasize zero-dependency engine.│
│  UP NEXT                             │  │  • Pause for questions before demo. │
│  ┌────────────────────────────────┐  │                                        │
│  │  [ Next Upcoming Slide ]       │  │                                        │
│  └────────────────────────────────┘  │                                        │
└──────────────────────────────────────┴────────────────────────────────────────┘
```

### Features
* **Zero Dependencies & Zero Server**: Runs completely client-side. Works offline and even directly over `file://` URLs.
* **Bidirectional Navigation**: Pressing `→`, `←`, `Space`, or keyboard navigation in **either** window instantly updates both screens.
* **"Up Next" Preview**: Always know what slide is coming next before transitioning.
* **Elapsed Time & Clock**: Tracks total presentation time with a one-click Reset button alongside current wall clock time.
* **Large Typography**: Notes are rendered in spacious, high-contrast typography optimized for quick reading from a distance.

---

## On-Screen Notes Drawer

If presenting on a single screen without a separate projector, you can also toggle an on-screen notes drawer:

* Press **`S`** on the keyboard (or **`Esc`** to close).
* Click the **📝** icon in the floating presentation control bar.
* Click the **🖥️ Pop out** button inside the drawer header to transition directly into the dual-screen Presenter Window.

---

## Print & PDF Export

When printing or exporting slides to PDF via your browser's Print dialog (`Ctrl+P` / `Cmd+P`), speaker notes and presenter controls are automatically hidden to ensure clean, publication-ready slide prints.
