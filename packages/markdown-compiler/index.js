const { parse } = require('./lib/parser')
const { parseAttributeList, extractTrailingAttributes } = require('./lib/parser/attributes')
const { stringify } = require('./lib/stringify')
const { parseYaml } = require('./lib/yaml')
const Node = require('./lib/nodes')

const toMarkdown = (html) => {
  const { htmlToMarkdown } = require('@sullux/markdown-html')
  return htmlToMarkdown(html)
}

module.exports = {
  parse,
  parseAttributeList,
  extractTrailingAttributes,
  stringify,
  toMarkdown,
  parseYaml,
  Node,
}
