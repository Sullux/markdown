const { parse } = require('./lib/parser')
const { stringify } = require('./lib/stringify')
const { parseYaml } = require('./lib/yaml')
const Node = require('./lib/nodes')

const toMarkdown = (html) => {
  const { htmlToMarkdown } = require('@sullux/markdown-html')
  return htmlToMarkdown(html)
}

module.exports = {
  parse,
  stringify,
  toMarkdown,
  parseYaml,
  Node,
}
