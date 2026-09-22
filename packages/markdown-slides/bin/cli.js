#!/usr/bin/env node

const { parseArgs } = require('../lib/config')
const { buildDeck } = require('../lib/deck')

const printHelp = () => {
  console.log(`
Usage: markdown-slides [options]

Options:
  -i, --input <dir>      Path to input Markdown slides directory (default: CWD)
  -o, --output <dir>     Path to output directory (default: <input>/_slides)
  -t, --title <title>    Deck title (overrides title in slides.yaml)
  -c, --config <file>    Path to config file (default: <input>/slides.yaml)
  -h, --help             Show help documentation
`)
}

const main = () => {
  const args = process.argv.slice(2)
  const options = parseArgs(args)

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  try {
    const res = buildDeck(options)
    console.log(`Successfully generated ${res.slideCount} slides -> ${res.output}`)
  } catch (err) {
    console.error(`Error generating slides: ${err.message}`)
    process.exit(1)
  }
}

main()
