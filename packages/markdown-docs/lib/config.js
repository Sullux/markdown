const path = require('node:path')

const parseArgs = (args = []) => {
  const options = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '-i' || arg === '--input') {
      options.input = args[++i]
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i]
    } else if (arg === '-t' || arg === '--title') {
      options.title = args[++i]
    } else if (arg === '--logo') {
      options.logo = args[++i]
    } else if (arg === '--baseUrl') {
      options.baseUrl = args[++i]
    } else if (arg === '-h' || arg === '--help') {
      options.help = true
    }
  }
  return options
}

const normalizeConfig = (opts = {}) => {
  const input = path.resolve(opts.input || process.cwd())
  const output = path.resolve(opts.output || path.join(input, '_site'))
  const title = opts.title || path.basename(input)
  const baseUrl = opts.baseUrl || ''
  const logo = opts.logo || ''

  return { input, output, title, baseUrl, logo }
}

module.exports = { parseArgs, normalizeConfig }
