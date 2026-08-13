# Configuration Methods

`@sullux/markdown-docs` supports multiple ways to configure your documentation site, offering flexibility for both simple projects and complex multi-environment CI/CD deployment pipelines.

## Priority Cascading Order

When `@sullux/markdown-docs` builds your site, configuration settings are resolved using a cascading priority order:

1. **CLI Flags** (e.g. `-t "Title"`, `-b "/docs/"`) — *Highest Priority*
2. **Configuration File** (`docs.yaml`, `docs.yml`, or `docs.json`)
3. **`SUMMARY.md` Frontmatter** (YAML block at top of `SUMMARY.md`)
4. **Built-in Defaults** — *Lowest Priority*

---

## Method 1: `docs.yaml` File

Place a `docs.yaml` file in the root of your documentation input directory. This is the recommended configuration method for project-level settings.

```yaml
title: "My Product Docs"
output: "_site"
baseUrl: "/docs"

logo:
  light: "assets/logo-light.svg"
  dark: "assets/logo-dark.svg"

favicon: "assets/favicon.ico"

links:
  - title: "GitHub"
    url: "https://github.com/my-org/my-repo"
  - title: "API Reference"
    url: "https://api.example.com"

theme:
  light:
    bg: "#ffffff"
    accent: "#2563eb"
    codeBg: "#f8fafc"
  dark:
    bg: "#121316"
    accent: "#3b82f6"
    codeBg: "#0a0b0e"
```

---

## Method 2: `SUMMARY.md` Frontmatter

If you prefer keeping all configuration inside your Markdown source files without creating a separate `docs.yaml` file, you can embed YAML frontmatter at the very top of your `SUMMARY.md` file:

```markdown
---
title: "Embedded Docs Title"
logo: "assets/logo.png"
links:
  - title: "GitHub"
    url: "https://github.com/my-org/my-repo"
---

# Table of Contents

* [Introduction](README.md)
* [Quick Start](quick-start.md)
```

---

## Method 3: CLI Arguments

CLI parameters provide build-time overrides. This is especially useful in CI/CD pipelines where base URLs or deployment output directories vary between staging and production environments:

```bash
# Override output directory and deployment base URL during CI/CD builds
markdown-docs -i ./docs -o ./build -b "/staging-docs/"
```
