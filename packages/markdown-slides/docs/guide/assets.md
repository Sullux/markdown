# Asset Bundling & Resolution

`@sullux/markdown-slides` automatically bundles local media, out-of-tree assets, and remote web images into a single self-contained, offline-ready presentation folder.

## Offline Presentations

When you embed images in your slides—whether local files, parent directory references, or remote URLs—the compiler resolves them during build time:

```markdown
# Local image in deck folder
![Brain](images/brain.svg)

# Out-of-tree image in parent directory
![Company Logo](../../docs/logo.svg)

# Remote image from web URL
![Sullux](https://sullux.com/images/logo-full-email-dark.svg)
```

During build:
1. Local images inside your deck directory are copied to `dist/images/`.
2. Out-of-tree local images (e.g. `../../docs/logo.svg`) are located, copied, and bundled into `dist/images/`.
3. Remote web images (`https://...`) are fetched via Node's native `fetch()` and saved locally to `dist/images/`.
4. All Markdown image links in the AST are rewritten to reference the local relative path (e.g. `images/logo.svg`).

The resulting presentation folder can be opened on an airplane, in an air-gapped environment, or transferred to another computer without broken image links.

## The Minimum Viable Suffix Algorithm

To avoid ugly opaque hashes (e.g. `a4f89b1c.svg`) while preventing name collisions between images from different folders, `@sullux/markdown-slides` uses a **Minimum Viable Suffix** algorithm:

### 1. Root Canonicalization & Anonymization
All paths are converted to canonical roots:
* Remote URLs map to `/remote/<hostname>/<path>` (e.g. `/remote/sullux.com/images/logo.svg`).
* Local paths re-root the user's home directory to `/user/...` (e.g. `/user/sullux/docs/logo.svg`) to ensure reproducible, anonymized builds across different developers and CI machines.
* Windows drive letters are normalized (`c:/` $\rightarrow$ `/`, `d:/` $\rightarrow$ `/d/`).

### 2. Deduplication
If multiple slides reference the exact same asset URL or local path, the asset is downloaded or copied only once and shared across all slides.

### 3. Disambiguation by Parent Peeling
Uniqueness is evaluated case-insensitively. If multiple assets share the same filename:
* If unique, the original filename is preserved with zero noise: `logo.svg`.
* If a collision occurs (e.g. `docs/logo.svg` vs `images/logo.svg`), the algorithm peels parent directory segments until names are distinct: `docs-logo.svg` and `images-logo.svg`.
* In the rare event of identical paths differing only by case, a terminal numeric suffix is appended: `foo.svg` and `Foo-2.svg`.
