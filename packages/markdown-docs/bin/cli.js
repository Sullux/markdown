#!/usr/bin/env node

const { parseArgs } = require('../lib/config')
const { generateSite } = require('../lib/site')

const printHelp = () => {
  console.log(`
Usage: markdown-docs [options]

Options:
  -i, --input <dir>      Path to input Markdown docs directory (default: CWD)
  -o, --output <dir>     Path to output directory (default: <input>/_site)
  -b, --base-url <url>   Base URL prefix for build/deployment
  -t, --title <title>    Site title (overrides title in docs.yaml)
  -c, --config <file>    Path to config file (default: <input>/docs.yaml)
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
    const res = generateSite(options)
    console.log(`Successfully generated ${res.pageCount} documentation pages -> ${res.output}`)
  } catch (err) {
    console.error(`Error generating docs: ${err.message}`)
    process.exit(1)
  }
}

main()
