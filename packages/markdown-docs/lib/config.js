const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')
const { parseYaml } = require('./yaml')

const parseArgs = (args = []) => {
  const options = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '-i' || arg === '--input') options.input = args[++i]
    else if (arg === '-o' || arg === '--output') options.output = args[++i]
    else if (arg === '-b' || arg === '--base-url' || arg === '--baseUrl') options.baseUrl = args[++i]
    else if (arg === '-t' || arg === '--title') options.title = args[++i]
    else if (arg === '-c' || arg === '--config') options.config = args[++i]
    else if (arg === '-h' || arg === '--help') options.help = true
  }
  return options
}

const loadFileConfig = (inputDir, customConfigPath) => {
  const configFile = customConfigPath ? path.resolve(customConfigPath) : null
  const candidates = configFile ? [configFile] : [
    path.join(inputDir, 'docs.yaml'),
    path.join(inputDir, 'docs.yml'),
    path.join(inputDir, 'docs.json'),
  ]

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        if (file.endsWith('.json')) return JSON.parse(content)
        return parseYaml(content)
      } catch (e) {
        return {}
      }
    }
  }

  const summaryPath = path.join(inputDir, 'SUMMARY.md')
  if (fs.existsSync(summaryPath)) {
    const ast = parse(fs.readFileSync(summaryPath, 'utf8'))
    if (ast.frontmatter && Object.keys(ast.frontmatter).length > 0) {
      return ast.frontmatter
    }
  }

  return {}
}

const normalizeConfig = (opts = {}) => {
  const input = path.resolve(opts.input || process.cwd())
  const fileConfig = loadFileConfig(input, opts.config)

  const output = path.resolve(opts.output || fileConfig.output || path.join(input, '_site'))
  const title = opts.title !== undefined ? opts.title : (fileConfig.title !== undefined ? fileConfig.title : '')
  const baseUrl = opts.baseUrl !== undefined ? opts.baseUrl : (fileConfig.baseUrl !== undefined ? fileConfig.baseUrl : '')
  const logo = fileConfig.logo || opts.logo || ''
  const favicon = fileConfig.favicon || opts.favicon || ''
  const links = fileConfig.links || opts.links || []
  const theme = { ...(fileConfig.theme || {}), ...(opts.theme || {}) }

  return { input, output, title, baseUrl, logo, favicon, links, theme }
}

module.exports = { parseArgs, normalizeConfig, loadFileConfig }
