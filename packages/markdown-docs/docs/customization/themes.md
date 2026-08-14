# Themes & Branding

`@sullux/markdown-docs` provides a native dual-theme engine (Light & Dark) with zero external CSS frameworks.

## Theme Switching Engine

The site template embeds a 3-way theme picker in the page outline sidebar:

* **Light Mode:** Forces light theme background and light syntax highlighting.
* **System Mode:** Automatically tracks the user's operating system dark mode preference (`@media (prefers-color-scheme: dark)`).
* **Dark Mode:** Forces dark theme background and dark syntax highlighting.

User mode selections are saved in browser `localStorage` (`sullux-theme-mode`) for instant persistence across page refreshes.

## Customizing Theme Colors

You can override colors in `docs.yaml`:

```yaml
theme:
  light:
    bg: "#ffffff"        # Page background color
    accent: "#2563eb"    # Primary accent and link color
    codeBg: "#f8fafc"    # Code block background
    codeText: "#0f172a"  # Default code text color
  dark:
    bg: "#121316"        # Dark page background color
    accent: "#3b82f6"    # Dark primary accent color
    codeBg: "#0a0b0e"    # Dark code block background
    codeText: "#f3f4f6"  # Dark code text color
```

## Dual-Theme Brand Logos

Provide separate brand logos for light and dark backgrounds:

```yaml
logo:
  light: "assets/logo-light.svg"
  dark: "assets/logo-dark.svg"
```

The compiled HTML renders both logo images in the top header and uses CSS media queries and data attributes to toggle visibility cleanly without flash of unstyled content.
