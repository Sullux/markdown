#!/usr/bin/env node

const { parseArgs } = require('../lib/config')
const { buildDeck } = require('../lib/deck')
const { loadDeck } = require('../lib/loader')
const { formatTemplateList } = require('../lib/templates')
const { addSlide } = require('../lib/add')

const printHelp = () => {
  console.log(`
Usage:
  markdown-slides [options]
  markdown-slides add <name> [options]

Commands:
  add <name>             Add a new slide file with boilerplate and update slides.yaml

Options:
  -i, --input <dir>      Path to slides directory (default: current working directory)
  -o, --output <dir>     Path to output directory (default: <input>/_slides)
  -t, --template <name>  Template for new slide (used with "add", e.g. Cover, Split)
  -t, --title <title>    Deck title (overrides title in slides.yaml when building)
  -c, --config <file>    Path to config file (default: <input>/slides.yaml)
  --templates, -l        List available slide templates (built-in and custom)
  -h, --help             Show help documentation

Aliases:
  ms                     Short command alias for markdown-slides
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

  if (options.command === 'add') {
    try {
      const res = await addSlide(options)
      const yamlMsg = res.updatedYaml ? ' and updated slides.yaml' : ''
      console.log(`Created ${res.filename} (${res.template})${yamlMsg}`)
      process.exit(0)
    } catch (err) {
      console.error(`Error adding slide: ${err.message}`)
      process.exit(1)
    }
  }

  try {
    const res = await buildDeck(options)
    console.log(
      `Successfully generated ${res.slideCount} slides -> ${res.output}`,
    )
  } catch (err) {
    console.error(`Error generating slides: ${err.message}`)
    process.exit(1)
  }
}

main()
