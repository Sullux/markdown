#!/usr/bin/env node

const { parseArgs } = require('../lib/config')
const { buildDeck } = require('../lib/deck')
const { loadDeck } = require('../lib/loader')
const { formatTemplateList } = require('../lib/templates')

const printHelp = () => {
  console.log(`
Usage: markdown-slides [options]

Options:
  -i, --input <dir>      Path to input Markdown slides directory (default: CWD)
  -o, --output <dir>     Path to output directory (default: <input>/_slides)
  -t, --title <title>    Deck title (overrides title in slides.yaml)
  -c, --config <file>    Path to config file (default: <input>/slides.yaml)
  --templates, -l        List available slide templates (built-in and custom)
  -h, --help             Show help documentation
`)
}

const main = async () => {
  const args = process.argv.slice(2)
  const options = parseArgs(args)

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  if (options.templates) {
    const registry = options.input
      ? loadDeck(options.input, options).registry
      : {}
    console.log(formatTemplateList(options.input, registry))
    process.exit(0)
  }

  try {
    const res = await buildDeck(options)
    console.log(`Successfully generated ${res.slideCount} slides -> ${res.output}`)
  } catch (err) {
    console.error(`Error generating slides: ${err.message}`)
    process.exit(1)
  }
}

main()
