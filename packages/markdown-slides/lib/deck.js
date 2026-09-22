const path = require('node:path')
const fs = require('node:fs')

const buildDeck = (options = {}) => {
  const inputDir = path.resolve(options.input || process.cwd())
  const outputDir = path.resolve(options.output || path.join(inputDir, '_slides'))

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  return {
    input: inputDir,
    output: outputDir,
    slideCount: 0,
  }
}

module.exports = { buildDeck }
