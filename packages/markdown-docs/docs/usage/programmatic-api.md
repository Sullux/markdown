# Programmatic API

In addition to the CLI, `@sullux/markdown-docs` exports a clean Node.js programmatic API for integrating site generation directly into build scripts or custom toolchains.

## `generateSite(options)`

Primary entrypoint for site generation.

```javascript
const { generateSite } = require('@sullux/markdown-docs')

const result = generateSite({
  input: './docs',
  output: './dist',
  baseUrl: '/docs',
})

console.log(`Generated ${result.pageCount} pages at ${result.output}`)
```

### Options

| Option | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `input` | `string` | Path to documentation input directory | `process.cwd()` |
| `output` | `string` | Output site directory | `<input>/_site` |
| `baseUrl` | `string` | Deployment base path prefix | `""` |
| `title` | `string` | Site title override | Title in `docs.yaml` |
| `config` | `string` | Path to custom YAML/JSON config file | `<input>/docs.yaml` |

### Return Value

`generateSite()` returns a summary object:

```javascript
{
  output: "/path/to/output/directory",
  pageCount: 12
}
```
