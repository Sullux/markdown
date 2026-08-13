# CLI Reference

The `@sullux/markdown-docs` command-line executable provides a streamlined interface for building documentation sites across local development and automated CI/CD pipelines.

## Command Syntax

```bash
markdown-docs [options]
```

## Options Table

| Flag | Long Flag | Description | Default |
| :--- | :--- | :--- | :--- |
| `-i` | `--input` | Path to input Markdown documentation directory | Current directory (`.`) |
| `-o` | `--output` | Output directory for compiled HTML site | `<input>/_site` |
| `-b` | `--base-url` | Base URL path prefix for hosting in subdirectories | `""` |
| `-t` | `--title` | Site title override | Title in `docs.yaml` |
| `-c` | `--config` | Custom path to config file | `<input>/docs.yaml` |
| `-h` | `--help` | Display CLI help menu | |

## Usage Examples

### Build Local Docs
```bash
markdown-docs -i ./docs -o ./dist
```

### Staging Build with Base URL Prefix
```bash
markdown-docs -i ./docs -o ./_site -b "/staging-docs/"
```

### Custom Config Path
```bash
markdown-docs -i ./docs -c ./config/custom-docs.yaml
```
